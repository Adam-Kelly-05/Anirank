import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "eu-west-1" }));

const ANIME_TABLE = "Anime";
const BY_GENRE_TABLE = "AnimeByGenre";

const CARD_PROJECTION = "animeId, aired, genres, image, synopsis, title_english, title_japanese";

const clipSynopsis = (t, n = 180) => (!t ? t : t.length > n ? t.slice(0, n).trimEnd() + "..." : t);

function reservoirSample(stream, N) {
  const picked = [];
  let seen = 0;

  for (const item of stream) {
    seen++;

    if (picked.length < N) {
      picked.push(item);
    } else {
      const j = Math.floor(Math.random() * seen);
      if (j < N) picked[j] = item;
    }
  }
  return picked;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export const handler = async (event) => {
  try {
    const limit = Number(event?.queryStringParameters?.limit) || null;
    const genre = event?.queryStringParameters?.genre?.trim().toLowerCase() || null;

    let anime = [];

    if (genre) {
      let lastKey;
      const ids = [];

      do {
        const res = await db.send(
          new QueryCommand({
            TableName: BY_GENRE_TABLE,
            KeyConditionExpression: "#g = :g",
            ExpressionAttributeNames: { "#g": "genre" },
            ExpressionAttributeValues: { ":g": genre },
            ProjectionExpression: "animeId",
            ExclusiveStartKey: lastKey,
          }),
        );

        for (const item of res.Items ?? []) {
          if (item?.animeId != null) ids.push(item.animeId);
        }

        lastKey = res.LastEvaluatedKey;
      } while (lastKey);

      if (ids.length === 0) return ok([]);

      const pickedIds = limit ? reservoirSample(ids, limit) : ids;

      const batches = chunk(pickedIds, 100);

      for (const batch of batches) {
        let request = {
          RequestItems: {
            [ANIME_TABLE]: {
              Keys: batch.map((id) => ({ animeId: id })),
              ProjectionExpression: CARD_PROJECTION,
            },
          },
        };

        for (let attempt = 0; attempt < 5; attempt++) {
          const out = await db.send(new BatchGetCommand(request));
          anime.push(...(out.Responses?.[ANIME_TABLE] ?? []));

          const un = out.UnprocessedKeys?.[ANIME_TABLE];
          if (!un || !un.Keys?.length) break;

          request = {
            RequestItems: {
              [ANIME_TABLE]: {
                ...un,
                ProjectionExpression: CARD_PROJECTION,
              },
            },
          };
        }
      }

      anime = anime.map((a) => ({
        ...a,
        synopsis: clipSynopsis(a.synopsis),
      }));

      return ok(anime);
    }

    let lastKey;
    const all = [];

    do {
      const res = await db.send(
        new ScanCommand({
          TableName: ANIME_TABLE,
          ProjectionExpression: CARD_PROJECTION,
          ExclusiveStartKey: lastKey,
        }),
      );

      all.push(...(res.Items ?? []));
      lastKey = res.LastEvaluatedKey;
    } while (lastKey);

    anime = limit ? reservoirSample(all, limit) : all;

    anime = anime.map((a) => ({
      ...a,
      synopsis: clipSynopsis(a.synopsis),
    }));

    return ok(anime);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function ok(body) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
