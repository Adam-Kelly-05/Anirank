import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Lists";
const USER_ID_INDEX = "userId-index";

export const handler = async (event) => {
  try {
    if (!TABLE_NAME) throw new Error("Missing env TABLE_NAME");

    const userId = event?.pathParameters?.userId || event?.queryStringParameters?.userId;

    if (!userId) {
      return json(400, {
        message: "Missing userId (path param or query param)",
      });
    }

    const listId = event?.queryStringParameters?.listId;
    const listName = event?.queryStringParameters?.listName;

    let metaItems = [];

    if (listId) {
      const meta = await getListMetaByPk(listId);
      if (!meta)
        return json(404, {
          message: `List not found: ${listId}`,
        });
      if (meta.userId !== userId) {
        return json(403, {
          message: "That list does not belong to this user.",
        });
      }
      metaItems = [meta];
    } else {
      metaItems = await getUserListMetas(userId);

      if (listName) {
        metaItems = metaItems.filter((m) => (m.listName || m.name) === listName);
      }

      if (metaItems.length === 0) {
        return json(200, {
          userId,
          lists: [],
        });
      }
    }

    const results = [];
    for (const meta of metaItems) {
      const pk = meta.pk;
      const all = await getAllItemsInList(pk);
      const animeItems = all.filter(
        (it) => typeof it.sk === "string" && it.sk.startsWith("ANIME#"),
      );

      results.push({
        listId: pk,
        listName: meta.listName || meta.name || null,
        createdAt: meta.createdAt || null,
        items: animeItems.map((it) => ({
          animeId: it.animeId ?? parseAnimeIdFromSk(it.sk),
          addedAt: it.addedAt || null,
        })),
      });
    }

    const single = results.length === 1;

    return json(
      200,
      single
        ? results[0]
        : {
            userId,
            lists: results,
          },
    );
  } catch (err) {
    console.error(err);
    return json(500, {
      message: "Server error",
      error: err.message,
    });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(body),
  };
}

function parseAnimeIdFromSk(sk) {
  const parts = String(sk).split("#");
  const maybe = parts[1];
  const n = Number(maybe);
  return Number.isFinite(n) ? n : maybe;
}

async function getListMetaByPk(pk) {
  const resp = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "pk",
      },
      ExpressionAttributeValues: {
        ":pk": pk,
      },
    }),
  );
  return (resp.Items || []).find((i) => i.sk === "META") || null;
}

async function getAllItemsInList(pk) {
  const resp = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "pk",
      },
      ExpressionAttributeValues: {
        ":pk": pk,
      },
    }),
  );
  return resp.Items || [];
}

async function getUserListMetas(userId) {
  const resp = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: USER_ID_INDEX,
      KeyConditionExpression: "#userId = :u",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":u": userId,
      },
    }),
  );

  return (resp.Items || []).filter((i) => i.sk === "META");
}
