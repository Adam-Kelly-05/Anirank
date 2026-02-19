"use client";

import * as React from "react";
import ReviewsList from "./ReviewsList";

export default function AnimeReviewsSection({ animeId }: { animeId?: number }) {
  const [averageScore, setAverageScore] = React.useState(0);
  const [reviewCount, setReviewCount] = React.useState(0);

  return (
    <div className="space-y-4 p-4 rounded-xl bg-black/30 border border-white/10">
      <div className="flex items-baseline gap-3">
        <p className="font-semibold text-gray-100">Average score</p>
        <p className="text-3xl font-bold text-amber-300">
          {reviewCount > 0 && averageScore !== null ? averageScore.toFixed(1) : "—"}
        </p>
        <p className="text-sm text-gray-400">({reviewCount} reviews)</p>
      </div>

      <ReviewsList
        id={animeId}
        idType="anime"
        onAverageScore={(value) => setAverageScore(value ?? 0)}
        onReviewsAmount={setReviewCount}
      />
    </div>
  );
}
