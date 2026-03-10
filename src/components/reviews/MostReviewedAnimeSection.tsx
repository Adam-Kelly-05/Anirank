"use client";

import React from "react";
import { useReviewsGet } from "@/components/reviews/UseReviewsGet";
import { groupReviewsByAnime } from "@/lib/groupReviewsByAnime";
import MostReviewedAnimeCarousel from "@/components/reviews/MostReviewedAnimeCarousel";

export default function MostReviewedAnimeSection() {
  const { reviews } = useReviewsGet({});

  const mostReviewedAnime = React.useMemo(() => {
    return groupReviewsByAnime(reviews).slice(0, 10);
  }, [reviews]);

  return <MostReviewedAnimeCarousel items={mostReviewedAnime} />;
}
