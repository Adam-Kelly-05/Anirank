"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { RoleCardItem } from "@/types/RoleCardItem";

export default function OtherAnimeCard(item: RoleCardItem) {
  return (
    <div className="relative w-[220px] h-full overflow-visible transition-transform duration-200 hover:scale-105 hover:z-20">
      <Card className="bg-card border-primary/20 shadow-lg hover:shadow-2xl cursor-pointer">
        <CardContent className="p-0">
          <div className="relative w-full aspect-[6/8]">
            <Image src={item.anime_image} alt={item.character} fill className="object-cover" />
          </div>

          <div className="p-4 space-y-1">
            <h3 className="font-bold text-lg line-clamp-2">{item.anime_title}</h3>
            <p className="text-xs text-gray-400">{item.date}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
