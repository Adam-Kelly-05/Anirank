"use client";

import ContentCarousel from "@/components/anime/AnimeCarousel";
import CharacterCard from "@/components/anime/CharacterCard";
import { CharacterCardItem } from "@/types/CharacterCardItem";

export default function CharacterCarousel({ items }: { items: CharacterCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <CharacterCard {...item} />} />;
}
