"use client";

import { useAuth } from "react-oidc-context";

export function useDeleteList() {
  const auth = useAuth();

  const deleteList = async (params: { listId: string }) => {
    const token = auth.user?.access_token ?? auth.user?.id_token;

    if (!token) return false;
    if (!params.listId) return false;

    const listIdEncoded = encodeURIComponent(params.listId);
    try {
      const res = await fetch(
        `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/${listIdEncoded}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) return true;

      const json = await res.json().catch(() => ({}));
      console.error("deleteList failed:", res.status, json);
      return false;
    } catch (error) {
      console.error("deleteList request error:", error);
      return false;
    }
  };

  return { deleteList };
}
