"use client";

import { Funnel } from "lucide-react";

export default function SortDropdown({ selectedSort, onSelectSort }) {
  const sortOptions = ["Newest", "Most Popular", "Title A-Z"];

  return (
    <div className="flex justify-start items-center gap-4">
      <details className="relative">
      <summary className="cursor-pointer px-3 py-1 text-xs font-semibold text-gray-100 border border-blue-500/40 rounded-full bg-[#0a0e1a] hover:bg-blue-800 hover:text-white transition flex items-center gap-2"> 
      <Funnel size={14} className="text-blue-400" /> {selectedSort || "Sort"} 
      </summary>
        <div className="absolute mt-2 bg-[#0a0e1a] border border-blue-500/40 rounded-lg shadow-xl overflow-hidden z-10 w-40">
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSelectSort(option)}
              className="block w-full text-left px-4 py-2 text-xs text-gray-100 hover:bg-blue-800 transition"
            >
              {option}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
