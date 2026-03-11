import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Lists";

export const handler = async (event) => {
  try {
    const listId = event?.pathParameters?.listId || event?.queryStringParameters?.listId;
    const animeIdRaw = event?.pathParameters?.animeId || event?.queryStringParameters?.animeId;

    if (!listId || animeIdRaw === undefined || animeIdRaw === null) {
      return json(400, { message: "Missing listId or animeId" });
    }

    const animeId = Number(animeIdRaw);
    if (!Number.isFinite(animeId)) {
      return json(400, { message: "animeId must be a number" });
    }

    const callerSub = getCallerSub(event);
    if (callerSub) {
      const meta = await ddb.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { pk: listId, sk: "META" },
        }),
      );

      if (!meta.Item) return json(404, { message: "List not found", listId });
      if (meta.Item.userId !== callerSub) {
        return json(403, { message: "Not allowed to modify this list" });
      }
    }

    await ddb.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { pk: listId, sk: `ANIME#${animeId}` },
      }),
    );

    return json(200, {
      message: "Anime removed from list",
      listId,
      animeId,
    });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Server error", error: err.message });
  }
};

function getCallerSub(event) {
  return (
    event?.requestContext?.authorizer?.jwt?.claims?.sub ||
    event?.requestContext?.authorizer?.claims?.sub ||
    null
  );
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
