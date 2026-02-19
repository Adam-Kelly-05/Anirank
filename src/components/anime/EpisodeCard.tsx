"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EpisodeCardItem {
  animeId: number;
  image: string;
  title_english?: string;
  title_japanese?: string;
  episodes?: number;
  synopsis?: string;
}

export default function EpisodeCard(item: EpisodeCardItem) {
  const router = useRouter();

  return (
    <div className="relative w-[220px] h-full overflow-visible transition-transform duration-200 will-change-transform hover:scale-105 hover:z-20 isolate">
      <Card
        onClick={() => router.push(`/anime/${item.animeId}`)}
        className={cn(
          "relative h-full flex flex-col overflow-hidden cursor-pointer",
          "bg-card border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40",
          "ring-1 ring-transparent hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background",
        )}
      >
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={item.image}
              alt={item.title_english || item.title_japanese || "Anime image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 220px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
            <div className="absolute top-2 right-2"></div>
          </div>
          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground font-medium line-clamp-1">
              {item.title_english}
            </p>
            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
              Episode: {item.episodes ? item.episodes : "N/A"}
            </h3>
            {(() => {
              const synopsis = item.synopsis ?? "";
              return (
                <p className="text-sm text-card-foreground/80 line-clamp-3">
                  {synopsis.length > 180 ? `${synopsis.slice(0, 177)}...` : synopsis}
                </p>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
