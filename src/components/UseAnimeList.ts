"use client";

import * as React from "react";
import { Anime } from "@/types/Anime";

// Fetch anime list with optional genre/limit filters
export function useAnimeList({
  genre,
  limit,
}: {
  genre?: string;
  limit?: number;
}) {
  const [animes, setAnime] = React.useState<Anime[]>([]);

  React.useEffect(() => {
    async function fetchAnime() {
      let url =
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime";
      if (genre) {
        url += `genre/${genre}`;
      }
      if (limit) {
        url += `?limit=${limit}`;
      }

      const response = await fetch(url);
      const raw = await response.json();
      const data = Array.isArray(raw) ? raw : (raw?.Items ?? raw?.data ?? []);
      setAnime(data);
    }
    fetchAnime();
  }, [genre, limit]);

  return { animes };
}
