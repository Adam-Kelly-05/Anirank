"use client";

import ContentCarousel from "@/components/anime/AnimeCarousel";
import ActorCard from "@/components/anime/ActorCard";
import { ActorCardItem } from "@/types/ActorCardItem";

export default function ActorCarousel({ items }: { items: ActorCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <ActorCard {...item} />} />;
}
