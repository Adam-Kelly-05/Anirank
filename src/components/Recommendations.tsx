"use client";

import AnimeCard from "./AnimeCard";
import { useUserRecommendations } from "./UseUserRecommendations";
import type { RecommendationSection } from "@/types/RecommendationSection";

export default function Recommendations() {
  const { error, sections } = useUserRecommendations();

  const formatGenre = (genre: string) =>
    genre.charAt(0).toUpperCase() + genre.slice(1);

  const titleFor = (s: RecommendationSection) =>
    s.kind === "anime"
      ? `Because you liked ${s.seed.title_english || s.seed.title_japanese}`
      : formatGenre(s.genre);

  return (
    <section className="py-8 border-t-2 bg-[#0a0e1a] border-[#3b82f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center mb-6">
          <div className="h-6 w-1 rounded-full mr-3 bg-[#60a5fa]" />
          <h3 className="text-2xl font-bold text-white">Recommended for you</h3>
          <div className="flex-1 ml-4 h-px bg-gradient-to-r from-blue-500/60 to-transparent" />
        </div>

        {error && (
          <pre className="whitespace-pre-wrap rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
            {error}
          </pre>
        )}

        {sections.map((section, idx) => (
          <div key={`${section.kind}-${idx}`} className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="text-blue-400">|</span>
              <h4 className="text-base font-semibold tracking-wide">
                {titleFor(section)}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.items.map((anime) => (
                <AnimeCard key={anime.animeId} {...anime} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
