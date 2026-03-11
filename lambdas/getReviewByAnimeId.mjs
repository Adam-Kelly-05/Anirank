import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "eu-west-1" }));

export const handler = async (event) => {
  try {
    console.log("PATH:", event?.rawPath);
    console.log("PATH PARAMS:", event?.pathParameters);

    const raw = event?.pathParameters?.animeId ?? event?.pathParameters?.animeid;

    if (raw == null) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing animeId", got: event?.pathParameters ?? null }),
      };
    }

    const animeId = Number(raw);
    if (!Number.isFinite(animeId)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "animeId must be a number", raw }),
      };
    }

    const result = await docClient.send(
      new QueryCommand({
        TableName: "Review",
        KeyConditionExpression: "animeId = :id",
        ExpressionAttributeValues: { ":id": animeId },
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.Items ?? []),
    };
  } catch (err) {
    console.error("LAMBDA ERROR:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err?.message ?? "Unknown error" }),
    };
  }
};
