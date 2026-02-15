"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface RankedListProps {
  items: {
    title: string;
    imageUrl: string;
    animeId: number;
  }[];
  onAdd?: ((item: { title: string; imageUrl: string; animeId: number }) => void) | undefined;
  onRemove?: (animeId: number) => void;
}

export default function RankedList({ items, onAdd, onRemove }: RankedListProps) {
  const [showAll, setShowAll] = React.useState(false);

  const visibleItems = showAll ? items : items.slice(0, 10);
  return (
    <div className="max-w-2xl mx-auto">
      <ul className="space-y-3">
        {visibleItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-3 border rounded-lg bg-background shadow-sm"
          >
          <Link href={`/anime/${item.animeId}`} className="flex items-center gap-4 flex-1">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={50}
              height={50}
              className="rounded object-cover"
            />
            
            <span className="font-medium flex-1">{item.title}</span>
            </Link>

            {/* Add button */}
            {onAdd && (
            <button
              onClick={() => onAdd(item)}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
            >
              Add
            </button>
            )}
            {/* Remove button */}
            {onRemove && (
            <button
              onClick={() => onRemove(item.animeId)}
              className="px-2 py-1 text-sm bg-red-600 text-white rounded"
            >
              Remove
            </button>
            )}
          </li>
        ))}
      </ul>
      {items.length > 10 && (
        <button onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      )}
    </div>
  );
}
