"use client";

import React from "react";
import Image from "next/image";

interface RankedListProps {
  items: {
    title: string;
    imageUrl: string;
  }[];
  onAdd: (item: { title: string; imageUrl: string }) => void;
}

export default function RankedList({ items, onAdd }: RankedListProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-3 border rounded-lg bg-background shadow-sm"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={50}
              height={50}
              className="rounded object-cover"
            />

            <span className="font-medium flex-1">{item.title}</span>

            {/* Add button */}
            <button
              onClick={() => onAdd(item)}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
