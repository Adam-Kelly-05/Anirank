"use client";

import { useAuth } from "react-oidc-context";

export function useDeleteList() {
  const auth = useAuth();

  const deleteList = async (listId: string) => {
    const token = auth.user?.access_token ?? auth.user?.id_token;
    if (!token) return false;

    try {
      const res = await fetch(
        `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/${encodeURIComponent(listId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        console.error("deleteList failed:", res.status);
        return false;
      }

      return true;
    } catch (error) {
      console.error("deleteList request error:", error);
      return false;
    }
  };

  return { deleteList };
}
