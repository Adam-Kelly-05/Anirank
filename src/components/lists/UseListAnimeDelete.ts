"use client";

import { useAuth } from "react-oidc-context";

export function useRemoveAnimeFromList() {
  const auth = useAuth();

  const removeAnimeFromList = async (params: { listId: string; animeId: number }) => {
    const token = auth.user?.access_token ?? auth.user?.id_token;
    if (!token) return false;

    const listIdEncoded = encodeURIComponent(params.listId);
    const animeIdEncoded = encodeURIComponent(String(params.animeId));

    try {
      const res = await fetch(
        `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/${listIdEncoded}/anime/${animeIdEncoded}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) return true;

      const json = await res.json().catch(() => ({}));
      console.error("removeAnimeFromList failed:", res.status, json);
      return false;
    } catch (error) {
      console.error("removeAnimeFromList request error:", error);
      return false;
    }
  };

  return { removeAnimeFromList };
}
