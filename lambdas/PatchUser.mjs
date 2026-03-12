import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const db = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: process.env.AWS_REGION,
  }),
);

const ALLOWED = new Set(["Bio", "ProfilePicture", "Username"]);

export const handler = async (event) => {
  try {
    const claims = event.requestContext?.authorizer?.jwt?.claims;

    const userId = claims?.sub;
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Unauthorized",
        }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const updates = Object.fromEntries(
      Object.entries(body).filter(([k, v]) => ALLOWED.has(k) && v !== undefined),
    );

    if (Object.keys(updates).length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "No valid fields to update. Allowed: Bio, ProfilePicture, Username",
        }),
      };
    }

    const names = {
      "#updatedAt": "updatedAt",
    };
    const values = {
      ":updatedAt": new Date().toISOString(),
    };
    const sets = ["#updatedAt = :updatedAt"];

    let i = 0;
    for (const [k, v] of Object.entries(updates)) {
      i++;
      names[`#k${i}`] = k;
      values[`:v${i}`] = v;
      sets.push(`#k${i} = :v${i}`);
    }

    const result = await db.send(
      new UpdateCommand({
        TableName: "Users",
        Key: {
          userId,
        },
        UpdateExpression: "SET " + sets.join(", "),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",

        ConditionExpression: "attribute_exists(userId)",
      }),
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: result.Attributes,
      }),
    };
  } catch (err) {
    if (err?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User profile does not exist",
        }),
      };
    }

    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error",
      }),
    };
  }
};
