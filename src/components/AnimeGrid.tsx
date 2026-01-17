"use client";

import AnimeCard from "./AnimeCard";
import { useAnimeList } from "./UseAnimeList";

export default function AnimeGrid({
  genre,
  limit,
}: {
  genre?: string;
  limit?: number;
}) {
  const { animes } = useAnimeList({ genre, limit });
  const items = animes ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {items.map((anime) => (
        <AnimeCard key={anime.animeId} {...anime} />
      ))}
    </div>
  );
}
