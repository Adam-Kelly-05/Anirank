import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
  }),
);

const ANIME_TABLE = "Anime";
const REVIEW_TABLE = "Review";
const ANIME_BY_GENRE_TABLE = "AnimeByGenre";
const REVIEW_USERID_INDEX = "userId-Index";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const json = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

function getUserId(event) {
  const claims = event?.requestContext?.authorizer?.jwt?.claims;
  return claims?.sub ?? null;
}

function normalizeGenre(g) {
  return String(g ?? "")
    .trim()
    .toLowerCase();
}

function ratingToWeight(r) {
  const rating = Number(r);
  const map = {
    10: 2.0,
    9: 1.5,
    8: 1.0,
    7: 0.5,
    6: 0.2,
    5: 0.0,
    4: -0.5,
    3: -1.0,
    2: -1.5,
    1: -2.0,
  };
  return map[rating] ?? 0.0;
}

async function batchGetAll({ tableName, keys, projectionExpression }) {
  const out = [];
  for (let i = 0; i < keys.length; i += 100) {
    const chunk = keys.slice(i, i + 100);
    const res = await ddb.send(
      new BatchGetCommand({
        RequestItems: {
          [tableName]: {
            Keys: chunk,
            ...(projectionExpression
              ? {
                  ProjectionExpression: projectionExpression,
                }
              : {}),
          },
        },
      }),
    );
    out.push(...(res?.Responses?.[tableName] ?? []));
  }
  return out;
}

function pickRandomUnique(arr, n) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

export const handler = async (event) => {
  try {
    if (event?.httpMethod === "OPTIONS")
      return json(200, {
        ok: true,
      });

    const userId = getUserId(event);
    if (!userId)
      return json(401, {
        message: "Unauthorized",
      });

    const reviewsRes = await ddb.send(
      new QueryCommand({
        TableName: REVIEW_TABLE,
        IndexName: REVIEW_USERID_INDEX,
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: {
          ":u": userId,
        },
        ProjectionExpression: "animeId, rating",
      }),
    );

    const reviews = reviewsRes?.Items ?? [];
    if (reviews.length === 0)
      return json(200, {
        sections: [],
      });

    const reviewedAnimeIds = new Set(
      reviews.map((r) => Number(r.animeId)).filter((x) => !Number.isNaN(x)),
    );

    const reviewedAnime = await batchGetAll({
      tableName: ANIME_TABLE,
      keys: [...reviewedAnimeIds].map((animeId) => ({
        animeId,
      })),
      projectionExpression:
        "animeId, genres, title_english, title_japanese, image, aired, synopsis, trailer",
    });

    const animeById = new Map();
    for (const a of reviewedAnime) animeById.set(Number(a.animeId), a);

    const genreScores = new Map();
    for (const r of reviews) {
      const animeId = Number(r.animeId);
      const anime = animeById.get(animeId);
      const genres = Array.isArray(anime?.genres) ? anime.genres : [];
      const delta = ratingToWeight(r.rating);

      for (const g0 of genres) {
        const g = normalizeGenre(g0);
        if (!g) continue;
        genreScores.set(g, (genreScores.get(g) ?? 0) + delta);
      }
    }

    const topGenres = [...genreScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .filter(([, score]) => score > 0)
      .slice(0, 3)
      .map(([g]) => g);

    const topReviews = reviews
      .slice()
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 3);

    const sections = [];
    const usedIds = new Set();
    for (let i = 0; i < 3; i++) {
      const g = topGenres[i];
      if (g) {
        const q = await ddb.send(
          new QueryCommand({
            TableName: ANIME_BY_GENRE_TABLE,
            KeyConditionExpression: "genre = :g",
            ExpressionAttributeValues: {
              ":g": g,
            },
            ProjectionExpression: "animeId",
            Limit: 200,
          }),
        );

        const poolIds = (q?.Items ?? [])
          .map((x) => Number(x.animeId))
          .filter((id) => !Number.isNaN(id))
          .filter((id) => !reviewedAnimeIds.has(id))
          .filter((id) => !usedIds.has(id));

        const chosen = pickRandomUnique(poolIds, 4);
        chosen.forEach((id) => usedIds.add(id));

        const animeRaw = chosen.length
          ? await batchGetAll({
              tableName: ANIME_TABLE,
              keys: chosen.map((animeId) => ({
                animeId,
              })),
              projectionExpression:
                "animeId, title_english, title_japanese, image, aired, synopsis, trailer, genres",
            })
          : [];

        sections.push({
          kind: "genre",
          genre: g,
          title: `Because you like ${g}`,
          items: animeRaw,
        });
      }

      const tr = topReviews[i];
      if (tr) {
        const topId = Number(tr.animeId);
        const topRaw = animeById.get(topId);
        if (topRaw) {
          const topCard = topRaw;
          const displayTitle = topCard.title_english || topCard.title_japanese || `Anime ${topId}`;

          const genres = (Array.isArray(topRaw.genres) ? topRaw.genres : [])
            .map(normalizeGenre)
            .filter(Boolean)
            .slice(0, 2);

          const similarSet = new Set();

          for (const sg of genres) {
            const q = await ddb.send(
              new QueryCommand({
                TableName: ANIME_BY_GENRE_TABLE,
                KeyConditionExpression: "genre = :g",
                ExpressionAttributeValues: {
                  ":g": sg,
                },
                ProjectionExpression: "animeId",
                Limit: 200,
              }),
            );

            for (const it of q?.Items ?? []) {
              const id = Number(it.animeId);
              if (Number.isNaN(id)) continue;
              if (id === topId) continue;
              if (reviewedAnimeIds.has(id)) continue;
              if (usedIds.has(id)) continue;
              similarSet.add(id);
            }
          }

          const similarIds = pickRandomUnique([...similarSet], 4);
          similarIds.forEach((id) => usedIds.add(id));

          const similarRaw = similarIds.length
            ? await batchGetAll({
                tableName: ANIME_TABLE,
                keys: similarIds.map((animeId) => ({
                  animeId,
                })),
                projectionExpression:
                  "animeId, title_english, title_japanese, image, aired, synopsis, trailer, genres",
              })
            : [];

          sections.push({
            kind: "anime",
            animeId: topId,
            title: `Because you like ${displayTitle}`,
            seed: topCard,
            items: similarRaw,
          });
        }
      }
    }

    return json(200, {
      sections,
    });
  } catch (err) {
    console.error(err);
    return json(500, {
      message: "Server error",
      detail: err?.message ?? String(err),
    });
  }
};
