"use client";

import { useAuth } from "react-oidc-context";

export function useDeleteList() {
  const auth = useAuth();

  const deleteList = async (listId: string) => {
    const idToken = auth.user?.id_token;
    const userSub = auth.user?.profile?.sub;
    if (!idToken || !userSub) return false;

    const res = await fetch(`/api/list/${encodeURIComponent(listId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ userId: userSub }),
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type") ?? "";
      const rawPayload = contentType.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "");
      const payload =
        typeof rawPayload === "string"
          ? rawPayload.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)
          : rawPayload;
      console.error("deleteList failed:", res.status, payload);
      return false;
    }

    return true;
  };

  return { deleteList };
}
