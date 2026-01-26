"use client";

import * as React from "react";
import { List } from "@/types/List";

// Fetch lists by userId
export function useList({
  id,
  idType,
}: {
  id?: string | number;
  idType?: string | number;
}) {
  const [list, setLists] = React.useState<List[]>([]);

  React.useEffect(() => {
    async function fetchLists() {
      if (!id) {
        setLists([]);
        return;
      }

      try {
        const response = await fetch(
          `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/${id}`,
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

      const response = await fetch(url);
      const raw = await response.json();
      const data = Array.isArray(raw) ? raw : (raw?.Items ?? raw?.data ?? []);
      setLists(data);
    }
    fetchLists();
  }, [id, idType]);

  return list;
}
