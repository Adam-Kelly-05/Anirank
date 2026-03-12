import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({
  region: "eu-west-1",
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Lists";

export const handler = async (event) => {
  try {
    const body = parseJson(event.body);

    const userId = body?.userId;
    const listName = body?.listName;

    if (!userId || !listName) {
      return json(400, {
        message: "userId and listName are required",
      });
    }

    const listId = `${new Date().toISOString()}${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    const item = {
      pk: listId,
      sk: "META",
      userId,
      listName,
      createdAt: listId,
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(pk)",
      }),
    );

    return json(201, {
      message: "List created",
      list: item,
    });
  } catch (err) {
    console.error(err);

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
