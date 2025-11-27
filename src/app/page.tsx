"use client"

import React from "react";
import CallAnimeObject from "@/components/trendingAnime";
import AllAnimesObject from "@/components/AllAnime";

["Action","Fantasy","Comedy","Romance","Drama","Adventure","Supernatural","Sci-Fi","Suspense","Mystery","Horror","Sports"]

export default function Home() {
  return (
    <>
      <CallAnimeObject />

      {genres.map((genre, index) => (
        <section
          key={genre}
          className="py-8 border-t-2"
          style={{
            backgroundColor: index % 2 === 0 ? "#0a0e1a" : "#172554",
            borderColor: "#3b82f6",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <div
                className="h-6 w-1 bg-blue-400 rounded-full mr-3"
                style={{ backgroundColor: "#60a5fa" }}
              ></div>
              <h3 className="text-2xl font-bold text-white">{genre}</h3>
              <div
                className="flex-1 ml-4 h-px"
                style={{
                  background:
                    "linear-gradient(to right, rgba(59, 130, 246, 0.6), transparent)",
                }}
              ></div>
            </div>

            <AllAnimesObject genre={genre} limit={8}/>
          </div>
        </section>
      ))}
    </>
  );
}
