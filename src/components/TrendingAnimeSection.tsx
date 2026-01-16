'use client'

import React from "react";
import AnimeCard from "./AnimeCard";
import ContentCarousel from "./AnimeCarousel";
import { useAnimeList } from "./UseAnimeList";

export default function TrendingAnimeSection() {
  const { animes } = useAnimeList({ limit: 15 });

  return (
    <div className="min-h-screen bg-background">
      {/* Trending Anime Section */}
      <section
        className="py-12 bg-blue-950"
        style={{ backgroundColor: "#172554" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div
              className="h-8 w-1 bg-blue-500 rounded-full mr-4"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <h2 className="text-3xl font-bold text-white">Trending Anime</h2>
          </div>

          <ContentCarousel data={animes} render={(item) => <AnimeCard {...item} />} />
        </div>
      </section>
    </div>
  );
}
