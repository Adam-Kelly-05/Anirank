import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "eu-west-1",
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Lists";

export const handler = async (event) => {
  console.log(
    "deleteList event:",
    JSON.stringify({
      pathParameters: event?.pathParameters,
      queryStringParameters: event?.queryStringParameters,
      requestContext: {
        stage: event?.requestContext?.stage,
        httpMethod: event?.requestContext?.http?.method ?? event?.requestContext?.httpMethod,
        authorizerKeys: Object.keys(event?.requestContext?.authorizer || {}),
      },
    }),
  );

  try {
    const listId = event?.pathParameters?.listId || event?.queryStringParameters?.listId;

    if (!listId)
      return json(400, {
        message: "Missing listId",
      });

    const sub =
      event?.requestContext?.authorizer?.jwt?.claims?.sub || // HTTP API JWT authorizer
      event?.requestContext?.authorizer?.claims?.sub; // REST API / lambda authorizer style

    if (!sub) {
      return json(401, {
        message: "Unauthorized (missing sub in authorizer)",
      });
    }

    const items = await queryAllByPk(listId);

    if (items.length === 0) {
      return json(404, {
        message: "List not found",
        listId,
      });
    }

    const meta = items.find((x) => x.sk === "META");
    if (!meta) {
      return json(500, {
        message: "List META row missing",
        listId,
      });
    }

    // 🔥 FIX: your DynamoDB column is `userid` (lowercase) in your screenshot
    const owner = meta.userId ?? meta.userid;

    if (!owner) {
      return json(500, {
        message: "META row missing owner field (userId/userid)",
        listId,
        metaKeys: Object.keys(meta),
      });
    }

    if (owner !== sub) {
      return json(403, {
        message: "Forbidden (not list owner)",
      });
    }

    const keys = items.map((it) => ({
      pk: it.pk,
      sk: it.sk,
    }));
    await batchDelete(keys);

    return json(200, {
      message: "List deleted",
      listId,
      deletedCount: keys.length,
    });
  } catch (err) {
    console.error("deleteList error:", err);
    return json(500, {
      message: "Server error",
      error: err?.name,
      detail: err?.message,
    });
  }
};

async function queryAllByPk(pk) {
  const out = [];
  let ExclusiveStartKey;

  do {
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
        ExclusiveStartKey,
      }),
    );

    out.push(...(resp.Items || []));
    ExclusiveStartKey = resp.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return out;
}

async function batchDelete(keys) {
  const chunks = chunk(keys, 25);

  for (const c of chunks) {
    let requestItems = {
      [TABLE_NAME]: c.map((k) => ({
        DeleteRequest: {
          Key: k,
        },
      })),
    };

    while (true) {
      const resp = await ddb.send(
        new BatchWriteCommand({
          RequestItems: requestItems,
        }),
      );

      const unprocessed = resp.UnprocessedItems?.[TABLE_NAME] || [];
      if (unprocessed.length === 0) break;

      requestItems = {
        [TABLE_NAME]: unprocessed,
      };
      await sleep(200);
    }
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "Authorization,Content-Type",
      "access-control-allow-methods": "OPTIONS,DELETE",
    },
    body: JSON.stringify(body),
  };
}
