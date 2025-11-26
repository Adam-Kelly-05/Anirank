"use client";

import * as React from "react";
import { Anime } from "@/types/animes";
import AnimeCard from "./animeCard";

export default function AllAnimesObject() {
  const [animes, setAnime] = React.useState<Anime[]>([]);

  React.useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(
          "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime?limit=40",
        );
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
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {animes.map((anime) => (
        <AnimeCard key={anime.animeId} {...anime} />
      ))}
    </div>
  );
}
