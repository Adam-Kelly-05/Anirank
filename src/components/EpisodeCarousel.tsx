"use client";

import ContentCarousel from "@/components/AnimeCarousel";
import EpisodeCard from "@/components/EpisodeCard";
import type { Anime } from "@/types/Anime";

export default function EpisodeCarousel({ items }: { items: Anime[] }) {
  return (
    <ContentCarousel
      data={items}
      render={(item) => <EpisodeCard {...item} />}
    />
  );
}
