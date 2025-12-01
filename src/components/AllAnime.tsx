"use client";

import * as React from "react";
import { Anime } from "@/types/animes";
import AnimeCard from "./animeCard";

interface AllAnimesProps {
  genre?: string;
  limit?: number;
}

export default function AllAnimesObject({ genre, limit }: AllAnimesProps) {
  const [animes, setAnime] = React.useState<Anime[]>([]);

  React.useEffect(() => {
    async function fetchAnime() {
      try {
        const url = new URL(
          "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime",
        );
        url.searchParams.set("limit", String(typeof limit === "number" ? limit : 52));
        if (genre) {
          url.searchParams.set("genre", genre);
        }

        const response = await fetch(url.toString());
        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result?.Items ?? result?.data ?? [];

        setAnime(data);
      } catch (error) {
        setAnime([]);
      }
    }
    fetchAnime();
  }, [genre, limit]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {animes.map((anime) => (
        console.log(anime),
        <AnimeCard key={anime.animeId} {...anime} />
      ))}
    </div>
  );
}
