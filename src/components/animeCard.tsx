import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Anime } from "@/types/animes"

export default function AnimeCard(item: Anime) {
  return (
    <div className="w-[280px]">
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:scale-105",
        "bg-card border-primary/20 shadow-lg hover:shadow-2xl hover:border-primary/40"
      )}>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={item.image}
              alt={item.title_english}
              className="w-full h-[380px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                #{item.animeId}
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <Link href={`/anime/${item.animeId}`}>
              <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                {item.title_english}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground font-medium line-clamp-1">
              {item.title_japanese}
            </p>
            <p className="text-sm text-muted-foreground">
              Aired: {item.aired}
            </p>
            <p className="text-sm text-card-foreground/80 line-clamp-3">
              {item.synopsis}
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full mt-3 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            >
              <a
                href={item.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                Watch Trailer
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1" />
                </svg>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}