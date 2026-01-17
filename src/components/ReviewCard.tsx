"use client";

import { Card, CardContent } from "./ui/card";
import { Review } from "@/types/Review";
import { useAnimeById } from "./UseAnime";
import Link from "next/link";

export function ReviewCard({ review }: { review: Review }) {
  const anime = useAnimeById(review.animeId);

  return (
    <Card className="bg-card border-primary/20 hover:border-primary/40 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <Link href={`/anime/${review.animeId}`} className="block">
              <div className="w-24 h-32 rounded overflow-hidden border border-primary/30 shadow-lg">
                <img
                  src={anime?.image}
                  alt={
                    anime?.title_english ||
                    anime?.title_japanese ||
                    review.animeName
                  }
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  <Link href={`/anime/${review.animeId}`} className="hover:underline">
                    {review.animeName}
                  </Link>
                </h3>
                <p className="text-gray-500 text-sm">
                  Reviewed on {review.ratedDate}
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full font-bold">
                <p>⭐</p>
                {review.rating}/10
              </div>
            </div>
            <p className="text-gray-300">{review.reviewBody}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
