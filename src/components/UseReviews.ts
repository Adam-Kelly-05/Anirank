"use client";

import * as React from "react";
import { Review } from "@/types/Review";

export function useReviews({
  id,
  idType,
}: {
  id?: string | number;
  idType?: string | number;
}) {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    async function fetchReviews() {
      if ((idType === "user" || idType === "anime") && !id) {
        setReviews([]);
        return;
      }

      let url =
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/reviews";
      if (idType === "user") {
        url += `/${id}`;
      } else if (idType === "anime") {
        url += `/animeId/${id}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          setReviews([]);
          return;
        }
        const raw = await response.json();
        const data = Array.isArray(raw) ? raw : (raw?.Items ?? raw?.data ?? []);
        setReviews(data);
      } catch {
        setReviews([]);
      }
    }

    fetchReviews();
  }, [id, idType]);

  const reviewCount = reviews.length;

  let totalRating = 0;
  reviews.forEach((review) => {
    totalRating += review.rating;
  });

  let averageRating = 0;
  if (totalRating != 0) {
    averageRating = totalRating / reviewCount;
  }

  return { reviews, reviewCount, averageRating };
}
