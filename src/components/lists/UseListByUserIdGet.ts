"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { List } from "@/types/List";

export function useGetListsByUserId() {
  const auth = useAuth();

  const getLists = React.useCallback(
    async (userId: string): Promise<List[] | null> => {
      const idToken = auth.user?.id_token;

      if (!idToken) {
        console.error("useGetListsByUserId: Not authenticated");
        return null;
      }

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
        return null;
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

      if (payload && typeof payload === "object" && "lists" in payload) {
        const lists = (payload as { lists?: unknown }).lists;
        return Array.isArray(lists) ? (lists as List[]) : [];
      }

      return [];
    },
    [auth.user?.id_token],
  );

  return { getLists };
}
