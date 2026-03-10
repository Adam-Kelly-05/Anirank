"use client";

import ContentCarousel from "@/components/anime/AnimeCarousel";
import MostReviewedAnimeCard from "@/components/reviews/MostReviewedAnimeCard";
import { MostReviewedAnimeItem } from "@/types/MostReviewedAnimeItem";

export default function MostReviewedAnimeCarousel({ items }: { items: MostReviewedAnimeItem[] }) {
  return <ContentCarousel data={items} render={(item) => <MostReviewedAnimeCard {...item} />} />;
}
