"use client";

import AnimeCard from "./AnimeCard";
import { useAnimeList } from "./UseAnimeList";

export default function AnimeGrid({
  genre,
  limit,
  sort,
}: {
  genre?: string;
  limit?: number;
  sort?: string | null;
}) {
  const { animes } = useAnimeList({ genre, limit });
  const items = [...(animes ?? [])];

  if (sort === "Newest") {
    items.sort((a, b) => {
      const dateA = new Date(a.releaseDate ?? 0).getTime();
      const dateB = new Date(b.releaseDate ?? 0).getTime();
      return dateB - dateA;
    });
  }

  if (sort === "Most Popular") {
    items.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }

  if (sort === "Title A-Z") {
    items.sort((a, b) => (a.title_english ?? "").localeCompare(b.title_english ?? ""));
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {items.map((anime) => (
        <AnimeCard key={anime.animeId} {...anime} />
      ))}
    </div>
  );
}
