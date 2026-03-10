"use client";
import RoleCard from "./RoleCard";
import { RoleCardItem } from "@/types/RoleCardItem";
import ContentCarousel from "@/components/anime/AnimeCarousel";

export default function RoleCarousel({ items }: { items: RoleCardItem[] }) {
  return <ContentCarousel data={items} render={(item) => <RoleCard {...item} />} />;
}
