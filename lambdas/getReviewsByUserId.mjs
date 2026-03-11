import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const userId = event.pathParameters.userId;

    const result = await docClient.send(
      new QueryCommand({
        TableName: "Review",
        IndexName: "userId-Index",
        KeyConditionExpression: "userId = :id",
        ExpressionAttributeValues: {
          ":id": userId,
        },
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.name, message: err.message }),
    };
  }
};
