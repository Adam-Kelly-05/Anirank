"use client";

import AnimeCard from "./AnimeCard";
import { useAnimeList } from "./UseAnimeList";

function parseReleaseTimestamp(releaseDate?: string, aired?: string): number {
  const direct = Date.parse(releaseDate ?? "");
  if (!Number.isNaN(direct)) return direct;

  const airedStart = (aired ?? "").split(" to ")[0].trim();
  const airedParsed = Date.parse(airedStart);
  if (!Number.isNaN(airedParsed)) return airedParsed;

  return Number.NEGATIVE_INFINITY;
}

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
      const dateA = parseReleaseTimestamp(a.releaseDate, a.aired);
      const dateB = parseReleaseTimestamp(b.releaseDate, b.aired);
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
