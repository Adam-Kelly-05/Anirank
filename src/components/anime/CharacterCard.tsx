"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CharacterCardItem } from "@/types/CharacterCardItem";

export default function CharacterCard(item: CharacterCardItem) {
  const router = useRouter();

  return (
    <div className="relative w-[220px] h-full overflow-visible transition-transform duration-200 will-change-transform hover:scale-105 hover:z-20 isolate">
      <Card
        onClick={() => router.push(`/character/${item.characterId}`)}
        className={cn(
          "relative h-full flex flex-col overflow-hidden cursor-pointer",
          "bg-card border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40",
          "ring-1 ring-transparent hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background",
        )}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Character Image */}
          <div className="relative w-full aspect-[6/8]">
            <Image
              src={item.image}
              alt={item.name_english || item.name_japanese || "Character image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 260px"
              priority
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
          </div>

          {/* Character Info */}
          <div className="p-4 space-y-2 flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground font-medium line-clamp-1">
              {item.name_japanese}
            </p>

            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
              {item.name_english}
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
