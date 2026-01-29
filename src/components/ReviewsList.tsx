"use client";

import * as React from "react";
import { ReviewCard } from "./ReviewCard";
import { useReviewsGet } from "./UseReviewsGet";

export default function ReviewsList({
  id,
  idType,
  onReviewsAmount,
  onAverageScore,
}: {
  id?: string | number;
  idType?: string | number;
  onReviewsAmount?: (count: number) => void;
  onAverageScore?: (count: number) => void;
}) {
  const { reviews, reviewCount, averageRating } = useReviewsGet({ id, idType });

  React.useEffect(() => {
    onReviewsAmount?.(reviewCount);
  }, [onReviewsAmount, reviewCount]);

  React.useEffect(() => {
    onAverageScore?.(averageRating);
  }, [onAverageScore, averageRating]);

  return (
    <div className="space-y-4 p-4">
      {reviews.map((review) => (
        <ReviewCard key={review.reviewId} review={review} />
      ))}
    </div>
  );
}
