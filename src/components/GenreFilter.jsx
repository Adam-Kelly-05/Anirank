"use client";

import React from "react"

const genres = [
  "Action","Fantasy","Comedy","Romance","Drama","Adventure",
  "Supernatural","Sci-Fi","Suspense","Mystery","Horror","Sports"
];

export default function GenreFilter({ selectedGenre, onSelect }) {
  return (
    <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-4 bg-[#0a0e1a] border-b border-blue-500">
      <div className="flex space-x-4 px-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`px-3 py-2 rounded-full font-semibold whitespace-nowrap transition 
              ${selectedGenre === genre 
                ? " px-3 py-1 text-xs text-gray-100" 
                : "rounded-full border  px-3 py-1 text-xs text-gray-100 hover:bg-blue-800 hover:text-white"}
            `}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
