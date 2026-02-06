"use client";

import AnimeCard from "./AnimeCard";
import { useUserRecommendations } from "./UseUserRecommendations";
import type { RecommendationSection } from "@/types/RecommendationSection";

export default function Recommendations() {
  const { error, sections } = useUserRecommendations();

  const titleFor = (s: RecommendationSection) =>
    s.kind === "anime"
      ? `Because you liked ${s.seed.title_english || s.seed.title_japanese}`
      : s.title;

  return (
    <div className="space-y-10 p-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Recommended for you</h2>
      </div>

      {error ? (
        <pre className="whitespace-pre-wrap rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          {error}
        </pre>
      ) : null}

      {sections.map((section, idx) => (
        <div key={`${section.kind}-${idx}`} className="space-y-4">
          <h3 className="text-xl font-semibold">{titleFor(section)}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {section.items.map((anime) => (
              <AnimeCard key={anime.animeId} {...anime} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
