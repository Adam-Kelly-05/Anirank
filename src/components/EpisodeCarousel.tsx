"use client";

import ContentCarousel from "@/components/AnimeCarousel";
import EpisodeCard, { EpisodeCardItem } from "@/components/EpisodeCard";

export default function EpisodeCarousel({ items }: { items: EpisodeCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <EpisodeCard {...item} />} />;
}
