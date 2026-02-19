import { NextResponse } from "next/server";

const LIST_API_BASE = "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod";

function tryParseJson(text: string): { userId?: string } | null {
  try {
    return JSON.parse(text) as { userId?: string };
  } catch {
    return null;
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ listId: string }> }) {
  try {
    const { listId } = await params;
    const authorization = req.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const rawBody = await req.text();
    const parsedBody = rawBody ? tryParseJson(rawBody) : null;
    const userId = parsedBody?.userId;
    const encodedListId = encodeURIComponent(listId);
    const withUserQuery =
      userId && userId.trim().length > 0
        ? `${LIST_API_BASE}/list/${encodedListId}?userId=${encodeURIComponent(userId)}`
        : `${LIST_API_BASE}/list/${encodedListId}`;
    const withoutUserQuery = `${LIST_API_BASE}/list/${encodedListId}`;

    const firstAttempt = await fetch(withUserQuery, {
      method: "DELETE",
      headers: {
        Authorization: authorization,
        ...(userId ? { "X-User-Id": userId } : {}),
        ...(rawBody ? { "Content-Type": "application/json" } : {}),
      },
      body: rawBody || undefined,
      cache: "no-store",
    });

    const upstream = firstAttempt.ok
      ? firstAttempt
      : await fetch(withoutUserQuery, {
          method: "DELETE",
          headers: {
            Authorization: authorization,
          },
          cache: "no-store",
        });

    const contentType = upstream.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await upstream.json().catch(() => ({}));
      if (!upstream.ok && (typeof data !== "object" || data === null || Object.keys(data).length === 0)) {
        return NextResponse.json(
          { error: "Delete list failed", status: upstream.status, statusText: upstream.statusText },
          { status: upstream.status },
        );
      }
      return NextResponse.json(data, { status: upstream.status });
    }

    const text = await upstream.text();
    if (!upstream.ok && text.trim().length === 0) {
      return NextResponse.json(
        { error: "Delete list failed", status: upstream.status, statusText: upstream.statusText },
        { status: upstream.status },
      );
    }
    return new NextResponse(text, { status: upstream.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
