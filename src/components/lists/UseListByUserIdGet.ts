"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { List } from "@/types/List";

export function useGetListsByUserId() {
  const auth = useAuth();

  const getLists = React.useCallback(
    async (userId: string): Promise<List[]> => {
      const idToken = auth.user?.id_token;

      if (!idToken) {
        console.error("useGetListsByUserId: Not authenticated");
        return [];
      }

      try {
        const res = await fetch(
          `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("getLists failed:", res.status, json);
          return [];
        }

        let payload: unknown = json;
        if (typeof json?.body === "string") {
          try {
            payload = JSON.parse(json.body) as unknown;
          } catch {
            payload = null;
          }
        } else if (typeof json?.body === "object" && json?.body !== null) {
          payload = json.body;
        }

        const typed = payload as { lists?: unknown; Items?: unknown; data?: unknown } | null;
        const candidate = typed?.lists ?? typed?.Items ?? typed?.data ?? payload;

        if (Array.isArray(candidate)) return candidate as List[];
        if (candidate && typeof candidate === "object") return [candidate as List];
        return [];
      } catch (error) {
        console.error("getLists request error:", error);
        return [];
      }
    },
    [auth.user?.id_token],
  );

  return { getLists };
}
