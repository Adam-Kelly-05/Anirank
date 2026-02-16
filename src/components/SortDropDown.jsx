"use client";

import { Funnel } from "lucide-react";

export default function SortDropdown({ selectedSort, onSelectSort }) {
  const sortOptions = ["Newest", "Most Popular", "Title A-Z"];

  return (
    <div className="flex justify-center">
      <details className="relative">
        <summary className="cursor-pointer px-4 py-2 text-xs text-gray-100 border border-blue-500 rounded-full hover:bg-blue-800 transition">
          <Funnel size={14} className="text-blue-400" />
          Sort: {selectedSort || "Select"}
        </summary>

        <div className="absolute mt-2 bg-[#0a0e1a] border border-blue-500 rounded-lg shadow-lg w-40 z-10">
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSelectSort(option)}
              className="block w-full text-left px-4 py-2 text-xs text-gray-100 hover:bg-blue-800"
            >
              {option}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
