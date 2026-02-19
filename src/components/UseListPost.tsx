"use client";

import { useAuth } from "react-oidc-context";

export function useCreateList() {
  const auth = useAuth();

  const createList = async (data: { listName: string }) => {
    const idToken = auth.user?.id_token;
    const userSub = auth.user?.profile?.sub;

    if (!idToken || !userSub) {
      console.error("useCreateList: Not authenticated or missing sub");
      return null;
    }

    const res = await fetch("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        userId: userSub,
        listName: data.listName,
      }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("createList failed:", res.status, json);
      return null;
    }

    return json.list ?? json;
  };

  return { createList };
}
