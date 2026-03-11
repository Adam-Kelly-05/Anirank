import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "eu-west-1",
});
const db = DynamoDBDocumentClient.from(client);

const ANIME_TABLE = "Anime";
const ANIME_BY_GENRE_TABLE = "AnimeByGenre";

const normalizeGenre = (g) => (g || "").trim().toLowerCase();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const makeWholePhraseRegex = (raw) => {
  const phrase = String(raw).trim().toLowerCase().replace(/\s+/g, " ");
  const safe = escapeRegex(phrase);
  return new RegExp(`(^|[^a-z0-9])${safe}([^a-z0-9]|$)`, "i");
};

const getAiredStartYear = (aired) => {
  if (!aired) return Infinity;
  const match = String(aired).match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : Infinity;
};

const BLOCKED_GENRES = new Set(["hentai", "erotica", "boys love", "girls love"]);

const BLOCKED_REGEXES = [...BLOCKED_GENRES].map(makeWholePhraseRegex);

const textContainsBlockedPhrase = (text) => {
  const t = (text ?? "").toString().toLowerCase();
  if (!t) return false;
  return BLOCKED_REGEXES.some((re) => re.test(t));
};

const isBlockedByTitle = (anime) => {
  return (
    textContainsBlockedPhrase(anime?.title_english) ||
    textContainsBlockedPhrase(anime?.title_japanese) ||
    textContainsBlockedPhrase(anime?.title)
  );
};

const isBlockedByGenres = (genresForIndex) => {
  return (genresForIndex ?? []).some((g) => BLOCKED_GENRES.has(g));
};

const blockedResponse = (reason) => ({
  statusCode: 403,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Blocked by content filter",
    reason,
  }),
});

export const handler = async (event) => {
  const search = event.pathParameters?.search;

  if (!search) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Missing search parameter",
      }),
    };
  }

  const asNumber = Number(search);
  const isNumberSearch = !isNaN(asNumber);

  try {
    if (isNumberSearch) {
      const id = asNumber;

      const result = await db.send(
        new GetCommand({
          TableName: ANIME_TABLE,
          Key: {
            animeId: id,
          },
        }),
      );

      if (result.Item) {
        const stored = result.Item;

        const storedGenresNormalized = (stored.genres ?? []).map(normalizeGenre).filter(Boolean);

        if (isBlockedByTitle(stored) || isBlockedByGenres(storedGenresNormalized)) {
          return blockedResponse("Existing stored item matches blocked title/genre");
        }

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Found by ID in DynamoDB",
            data: stored,
          }),
        };
      }

      const url = `https://api.jikan.moe/v4/anime/${id}/full`;

      try {
        const response = await fetch(url);
        const json = await response.json();
        const anime = json.data;

        if (!anime) {
          return {
            statusCode: 404,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "Anime not found in Jikan",
            }),
          };
        }

        const genresForAnime = anime.genres?.map((g) => g.name).filter(Boolean) || [];
        const genresForIndex = genresForAnime.map(normalizeGenre).filter(Boolean);

        if (isBlockedByTitle(anime)) {
          return blockedResponse("Title contains blocked phrase");
        }
        if (isBlockedByGenres(genresForIndex)) {
          return blockedResponse("Genre is blocked");
        }

        const newAnime = {
          animeId: id,
          aired: anime.aired?.string,
          episodes: anime.episodes,
          genres: genresForAnime,
          image: anime.images?.jpg?.large_image_url,
          source: anime.source,
          streaming: anime.streaming?.find((s) => s.name === "Crunchyroll")?.url,
          studio: anime.studios?.[0]?.name,
          synopsis: anime.synopsis,
          title_english: anime.title_english,
          title_japanese: anime.title_japanese,
          trailer: anime.trailer?.embed_url,
          type: anime.type,
        };

        Object.keys(newAnime).forEach((key) => {
          if (newAnime[key] == null) delete newAnime[key];
        });

        await db.send(
          new PutCommand({
            TableName: ANIME_TABLE,
            Item: newAnime,
          }),
        );

        if (genresForIndex.length > 0) {
          const requests = genresForIndex.map((genre) => ({
            PutRequest: {
              Item: {
                genre,
                animeId: id,
              },
            },
          }));

          for (let i = 0; i < requests.length; i += 25) {
            await db.send(
              new BatchWriteCommand({
                RequestItems: {
                  [ANIME_BY_GENRE_TABLE]: requests.slice(i, i + 25),
                },
              }),
            );
          }
        }

        return {
          statusCode: 201,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Anime fetched from API and saved (and indexed by genre)",
            data: newAnime,
          }),
        };
      } catch (apiErr) {
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Failed to fetch from API",
            error: apiErr?.message ?? String(apiErr),
          }),
        };
      }
    }

    const re = makeWholePhraseRegex(search);

    let ExclusiveStartKey = undefined;
    const matches = [];

    do {
      const scanRes = await db.send(
        new ScanCommand({
          TableName: ANIME_TABLE,
          ExclusiveStartKey,
          ProjectionExpression:
            "animeId, title_english, title_japanese, image, aired, synopsis, trailer, genres",
        }),
      );

      for (const item of scanRes.Items ?? []) {
        const genresNormalized = (item.genres ?? []).map(normalizeGenre).filter(Boolean);

        if (isBlockedByTitle(item) || isBlockedByGenres(genresNormalized)) {
          continue;
        }

        const t1 = (item.title_english ?? "").toLowerCase();
        const t2 = (item.title_japanese ?? "").toLowerCase();
        if (re.test(t1) || re.test(t2)) matches.push(item);
      }

      ExclusiveStartKey = scanRes.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    if (matches.length > 0) {
      matches.sort((a, b) => getAiredStartYear(a.aired) - getAiredStartYear(b.aired));

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Found by title (scan + paginate)",
          data: matches,
        }),
      };
    }

    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "No anime found containing that title",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Server error",
        error: err?.message ?? String(err),
      }),
    };
  }
};
