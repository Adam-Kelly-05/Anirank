"use client";

import ContentCarousel from "@/components/anime/AnimeCarousel";
import EpisodeCard from "@/components/anime/EpisodeCard";
import { EpisodeCardItem } from "@/types/EpisodeCardItem";

export default function EpisodeCarousel({ items }: { items: EpisodeCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <EpisodeCard {...item} />} />;
}
