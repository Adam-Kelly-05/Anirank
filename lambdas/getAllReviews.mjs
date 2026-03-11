import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: "Review",
      }),
    );

    const sorted = (data.Items ?? []).sort((a, b) => new Date(b.ratedDate) - new Date(a.ratedDate));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sorted),
    };
  } catch (err) {
    console.error("Error scanning DynamoDB:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Failed to fetch review list",
        error: err.message,
      }),
    };
  }
};
