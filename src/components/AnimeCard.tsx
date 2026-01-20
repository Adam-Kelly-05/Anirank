"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types/Anime";

export default function AnimeCard(item: Anime) {
  const router = useRouter();

  return (
    <div className="relative w-[280px] h-full overflow-visible transition-transform duration-200 will-change-transform hover:scale-105 hover:z-50 isolate">
      <Card
        onClick={() => router.push(`/anime/${item.animeId}`)}
        className={cn(
          "relative h-full flex flex-col overflow-hidden cursor-pointer",
          "bg-card border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40",
          "ring-1 ring-transparent hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background",
        )}
      >
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative">
            <img
              src={item.image}
              alt={item.title_english}
              className="w-full h-[380px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
            <div className="absolute top-2 right-2"></div>
          </div>
          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
              {item.title_english}
            </h3>
            <p className="text-sm text-muted-foreground font-medium line-clamp-1">
              {item.title_japanese}
            </p>
            <p className="text-sm text-muted-foreground">Aired: {item.aired}</p>
            <p className="text-sm text-card-foreground/80 line-clamp-3">
              {item.synopsis?.length > 180
                ? `${item.synopsis.slice(0, 177)}...`
                : (item.synopsis ?? "")}
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full mt-auto border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            >
              <a
                href={item.trailer}
                className="inline-flex items-center justify-center"
                onClick={(event) => event.stopPropagation()}
              >
                Watch Trailer 🧲
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
