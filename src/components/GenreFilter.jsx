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
    <div className="flex items-center gap-3">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className={`px-3 py-1 rounded-full font-semibold text-xs whitespace-nowrap border transition
            ${
              selectedGenre === genre
                ? "text-gray-100 border-blue-500 bg-blue-600"
                : "text-gray-100 border-blue-500/40 hover:bg-blue-800 hover:text-white"
            }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
