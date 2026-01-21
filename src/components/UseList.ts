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
      let url =
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/list/";
      if (idType === "user") {
        url += `user/${id}`;
      } else if (idType === "list") {
        url += `${id}`;
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
