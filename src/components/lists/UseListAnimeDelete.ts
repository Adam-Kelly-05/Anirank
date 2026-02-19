"use client";

import { useAuth } from "react-oidc-context";

const LIST_API_BASE = "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod";

export function useRemoveAnimeFromList() {
  const auth = useAuth();

  const removeAnimeFromList = async (params: { listId: string; animeId: number }) => {
    const idToken = auth.user?.id_token;
    if (!idToken) return false;

    const listIdEncoded = encodeURIComponent(params.listId);
    const animeIdEncoded = encodeURIComponent(String(params.animeId));

    const res = await fetch(`${LIST_API_BASE}/list/${listIdEncoded}/anime/${animeIdEncoded}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error("removeAnimeFromList failed:", res.status, json);
      return false;
    }

    return true;
  };

  return { removeAnimeFromList };
}
