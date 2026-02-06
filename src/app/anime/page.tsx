"use client";
import AnimeGrid from "@/components/AnimeGrid";
import GenreFilter from "@/components/GenreFilter";
import { useState } from "react";
import { useEffect } from "react";

export default function AboutPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/15 via-accent/25 to-primary/10 py-12 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-2 bg-primary rounded-full mr-4"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text">
              Anime Collection
            </h1>
          </div>
          <p className="text-lg text-foreground/80 ml-6">
            Explore our comprehensive collection of anime series
          </p>
        </div>
      </section>

      {/* Genre Filter Section */}
      <div className="sticky top-0 z-50 bg-background border-primary/20">
        <GenreFilter
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
        />
      </div>

      {/* Anime Carousel Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimeGrid genre={selectedGenre} limit={52} />
        </div>
      </section>
    </div>
  );
}
