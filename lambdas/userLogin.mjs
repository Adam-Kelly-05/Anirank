import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
console.log("before dynamo......");
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
console.log("Starting...........");
export const handler = async (event) => {
  const tableName = process.env.USERS_TABLE;

  // Cognito trigger payload
  const attrs = event?.request?.userAttributes ?? {};
  const userId = attrs.sub; // Cognito UUID (string)

  console.log("triggerSource:", event?.triggerSource);
  console.log("USERS_TABLE:", tableName);
  console.log("userAttributes keys:", Object.keys(attrs));

  if (!tableName) {
    console.error("Missing USERS_TABLE env var");
    return event;
  }

  // If Cognito didn't send sub, do NOT call DynamoDB
  if (typeof userId !== "string" || userId.length === 0) {
    console.error("Missing/invalid sub. Full event:", JSON.stringify(event));
    return event;
  }

  const now = new Date().toISOString();

  const email = attrs.email ?? null;
  const username = attrs.preferred_username ?? attrs.name ?? event?.userName ?? "Default Username";

  const profilePicture = attrs.picture ?? null;

  await ddb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { userId },
      UpdateExpression: `
      SET
        #Email = :email,
        #Username = if_not_exists(#Username, :username),
        #ProfilePicture = if_not_exists(#ProfilePicture, :pic),
        #Bio = if_not_exists(#Bio, :bio),
        #DateJoin = if_not_exists(#DateJoin, :dateJoin),
        #LastLoginAt = :now
    `,
      ExpressionAttributeNames: {
        "#Email": "Email",
        "#Username": "Username",
        "#ProfilePicture": "ProfilePicture",
        "#Bio": "Bio",
        "#DateJoin": "DateJoin",
        "#LastLoginAt": "LastLoginAt",
      },
      ExpressionAttributeValues: {
        ":email": email,
        ":username": username,
        ":pic": profilePicture,
        ":bio": "Default Bio",
        ":dateJoin": now,
        ":now": now,
      },
    }),
  );

  console.log("✅ Upserted user:", userId);
  return event;
};
