"use client";

import * as React from "react";
import { List } from "@/types/List";

// Fetch lists by userId
export function useList({ userId }: { userId?: number }) {
  const [lists, setLists] = React.useState<List[]>([]);

  React.useEffect(() => {
    async function fetchLists() {
      if (!userId) {
        setLists([]);
        return;
      }

      try {
        const response = await fetch(
          `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/${userId}`,
        );
        if (!response.ok) {
          setLists([]);
          return;
        }
        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : (result?.Items ?? result?.data ?? []);

        setLists(data);
      } catch {
        setLists([]);
      }
    }
    fetchLists();
  }, [userId]);

  return lists;
}
