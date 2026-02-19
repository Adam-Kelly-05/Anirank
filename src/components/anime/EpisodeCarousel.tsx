"use client";

import ContentCarousel from "@/components/anime/AnimeCarousel";
import EpisodeCard, { EpisodeCardItem } from "@/components/anime/EpisodeCard";

export default function EpisodeCarousel({ items }: { items: EpisodeCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <EpisodeCard {...item} />} />;
}
