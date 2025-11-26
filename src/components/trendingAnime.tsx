'use client'

import { Anime } from "@/types/animes";
import React from "react";
import AnimeCard from "./animeCard";
import ReusableCarousel from "./carousel";

export default function CallAnimeObject() {
    const [anime, setAnimes] = React.useState<Anime[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
    async function fetchAnimes() {
      setLoading(true);
      setError(null);
      const url =
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime?limit=15";

      try {
        const response = await fetch(url);
        const result = await response.json();
        const raw = result?.data ?? result;
        const normalized = Array.isArray(raw) ? raw : [raw];
        setAnimes(normalized);
        setError(null);
      } catch (error) {
        setAnimes([]);
        setError("Unable to load trending anime right now.");
      }
      setLoading(false);
    }
    fetchAnimes();
    }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="blue-gradient py-16 border-b-4 border-blue-400" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #1d4ed8 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="https://placehold.co/150x150/3b82f6/ffffff?text=LOGO"
              alt="Anirank Logo"
              className="mx-auto w-24 h-24 md:w-32 md:h-32"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Anirank
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 font-medium">
            Discover, rate, and review your favorite anime series
          </p>
        </div>
      </section>

      {/* Trending Anime Section */}
      <section className="py-12 bg-blue-950" style={{backgroundColor: '#172554'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="h-8 w-1 bg-blue-500 rounded-full mr-4" style={{backgroundColor: '#3b82f6'}}></div>
            <h2 className="text-3xl font-bold text-white">Trending Anime</h2>
          </div>

          {loading && (
            <p className="text-blue-100">Loading trending anime...</p>
          )}

          {error && !loading && (
            <p className="text-red-200">{error}</p>
          )}

          {!loading && !error && (
            <ReusableCarousel
              data={anime}
              render={(item) => <AnimeCard {...item} />}
            />
          )}
        </div>
      </section>
    </div>
)};
