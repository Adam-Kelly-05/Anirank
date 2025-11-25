"use client";

import * as React from "react";
import { Anime } from "@/types/animes";
import AnimeCard from "./animeCard";

export default function AnimesObject() {
  const [animes, setAnime] = React.useState<Anime[]>([]);

  const pickRandomSubset = (list: Anime[], count: number) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  };

  React.useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(
          "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime",
        );
        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result?.Items ?? result?.data ?? [];

        const randomSelection = pickRandomSubset(data as Anime[], 52);
        setAnime(randomSelection);
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
