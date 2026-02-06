"use client";

const genres = [
  "Action",
  "Fantasy",
  "Comedy",
  "Romance",
  "Drama",
  "Adventure",
  "Supernatural",
  "Sci-Fi",
  "Suspense",
  "Mystery",
  "Horror",
  "Sports",
  "Gourmet",
  "Slice of Life",
];

export default function GenreFilter({ selectedGenre, onSelect }) {
  return (
    <div className="w-full py-4 bg-[#0a0e1a] border-b border-blue-500">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 px-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`px-3 py-2 rounded-full font-semibold whitespace-nowrap transition
              ${
                selectedGenre === genre
                  ? " px-3 py-1 text-xs text-gray-100 rounded-full border border-blue-500 bg-blue-600"
                  : "rounded-full border  px-3 py-1 text-xs text-gray-100 hover:bg-blue-800 hover:text-white"
              }
            `}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
