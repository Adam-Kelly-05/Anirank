import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "eu-west-1",
});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const id = event.pathParameters?.userId;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing search parameter",
      }),
    };
  }

  try {
    const result = await db.send(
      new GetCommand({
        TableName: "Users",
        Key: {
          userId: id,
        },
      }),
    );

    if (result.Item) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: result.Item,
        }),
      };
    }

    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "No user found with that ID",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error",
        error: err.message,
      }),
    };
  }
};
