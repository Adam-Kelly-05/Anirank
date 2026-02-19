"use client";

import React from "react";
import { useAuth } from "react-oidc-context";

export function useGetListsByUserId() {
  const auth = useAuth();

  const getLists = React.useCallback(async (userId: string) => {
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
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("getLists failed:", res.status, json);
      return null;
    }

    let payload: any = json;
    if (typeof json?.body === "string") {
      try {
        payload = JSON.parse(json.body);
      } catch {
        payload = {};
      }
    } else if (typeof json?.body === "object" && json?.body !== null) {
      payload = json.body;
    }

    return payload?.lists ?? [];
  }, [auth.user?.id_token]);

  return { getLists };
}
