"use client"

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/searchBar";
import { Anime } from "@/types/animes";
import AnimeCard from "@/components/animeCard";

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-lg mb-4">
        {query ? `No anime found matching ${query}` : "No anime available"}
      </div>
      <div className="text-gray-500">
        {query
          ? "Try searching with different keywords"
          : "Please try again later"}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const term = query.trim();

    if (!term) {
      setAnimes([]);
      setIsLoading(false);
      return;
    }

    async function fetchAnime() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/${encodeURIComponent(term)}`,
        );
        const result = await response.json();
        const data = Array.isArray(result)
          ? result
          : result?.Items ?? result?.data ?? [];
        setAnimes(data);
      } catch (error) {
        setAnimes([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnime();
  }, [query]);

  return (
    <Suspense fallback={<div className="text-center text-gray-400 pt-20">Loading search...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Search Anime</h1>
            <p className="text-xl text-gray-300 mb-8">
              Find your favorite anime series and movies
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar placeholder="Search by title or description..." />
            </div>
          </div>

          {/* Search Results */}
          <div className="mb-8">
            <p className="text-gray-300 mb-6">
              {isLoading
                ? "Searching..."
                : query
                  ? `Showing ${animes.length} result${animes.length !== 1 ? "s" : ""} for ${query}`
                  : `Showing ${animes.length} anime`}
            </p>

            {!isLoading && animes.length === 0 && (
              <EmptyState query={query} />
            )}

            {/* Results Grid */}
            {animes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {animes.map((item: Anime) => (
                  <AnimeCard key={item.animeId} {...item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
