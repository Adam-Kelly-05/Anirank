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
      try {
        const url = new URL(
          "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime",
        );
        url.searchParams.set(
          "limit",
          String(typeof limit === "number" ? limit : 52),
        );
        if (genre) {
          url.searchParams.set("genre", genre);
        }

        const response = await fetch(url.toString());
        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : (result?.Items ?? result?.data ?? []);

        setAnime(data);
      } catch {
        setAnime([]);
      }
    }
    fetchAnime();
  }, [genre, limit]);

  return { animes };
}
