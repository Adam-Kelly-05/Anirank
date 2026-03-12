"use client";
import OtherAnimeCard from "./OtherAnimeCard";
import { RoleCardItem } from "@/types/RoleCardItem";
import ContentCarousel from "@/components/anime/AnimeCarousel";

export default function OtherAnimeCarousel({ items }: { items: RoleCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <OtherAnimeCard {...item} />} />;
}
