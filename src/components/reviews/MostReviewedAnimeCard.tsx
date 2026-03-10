"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MostReviewedAnimeItem } from "@/types/MostReviewedAnimeItem";
import { useAnimeById } from "@/components/anime/UseAnime";

export default function MostReviewedAnimeCard(item: MostReviewedAnimeItem) {
  const router = useRouter();
  const anime = useAnimeById(Number(item.animeId));

  return (
    <div className="relative w-[220px] h-full overflow-visible transition-transform duration-200 hover:scale-105 hover:z-20 isolate">
      <Card
        onClick={() => router.push(`/anime/${item.animeId}`)}
        className={cn(
          "relative h-full flex flex-col overflow-hidden cursor-pointer",
          "bg-card border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40",
          "ring-1 ring-transparent hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background",
        )}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Anime Image */}
          <div className="relative w-full aspect-[6/8]">
            {anime?.image ? (
              <Image
                src={anime.image}
                alt={anime.title_english || anime.title_japanese || item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 260px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
          </div>

          {/* Anime Info */}
          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
              {anime?.title_english || anime?.title_japanese || item.title}
            </h3>

            <p className="text-sm text-muted-foreground font-medium">
              Reviews: {item.reviewCount.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
