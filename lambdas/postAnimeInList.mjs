import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "eu-west-1",
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Lists";

export const handler = async (event) => {
  try {
    const body = parseJson(event?.body);

    const listId =
      body?.listId || event?.pathParameters?.listId || event?.queryStringParameters?.listId;

    const animeId =
      body?.animeId || event?.pathParameters?.animeId || event?.queryStringParameters?.animeId;

    if (!listId || animeId === undefined || animeId === null) {
      return json(400, {
        message: "listId and animeId are required",
      });
    }

    const metaResp = await ddb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          pk: listId,
          sk: "META",
        },
      }),
    );

    if (!metaResp.Item) {
      return json(404, {
        message: "List not found",
        listId,
      });
    }

    const nowIso = new Date().toISOString();
    const item = {
      pk: listId,
      sk: `ANIME#${animeId}`,
      animeId,
      addedAt: nowIso.slice(0, 10),
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      }),
    );

    return json(201, {
      message: "Anime added to list",
      listId,
      anime: item,
    });
  } catch (err) {
    console.error(err);

    if (err?.name === "ConditionalCheckFailedException") {
      return json(409, {
        message: "Anime already exists in this list",
      });
    }

    return json(500, {
      message: "Server error",
      error: err.message,
    });
  }
};

function parseJson(s) {
  if (!s) return {};
  try {
    return typeof s === "string" ? JSON.parse(s) : s;
  } catch {
    return {};
  }
}

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
