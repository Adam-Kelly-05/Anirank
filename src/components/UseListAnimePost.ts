"use client";

import { useAuth } from "react-oidc-context";

export function useAddAnimeToList() {
  const auth = useAuth();

  const addAnimeToList = async (data: {
    listId: string;
    animeId: number;
  }) => {
    const idToken = auth.user?.id_token;
    const userSub = auth.user?.profile?.sub;

    if (!idToken || !userSub) {
      console.error("useAddAnimeToList: Not authenticated or missing sub");
      return null;
    }

    const res = await fetch(
      `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/${data.listId}/anime`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId: userSub,
          animeId: data.animeId,
        }),
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("addAnimeToList failed:", res.status, json);
      return null;
    }

    return json;
  };

  return { addAnimeToList };
}
