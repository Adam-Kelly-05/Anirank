"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/types/Review";
import { useAnimeById } from "@/components/anime/UseAnime";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UpvoteButton from "./UpvoteButton";
import DownvoteButton from "./DownvoteButton";
import FlagButton from "./FlagButton";

export function ReviewCard({
  review,
  hideProfileForUserId,
}: {
  review: Review;
  hideProfileForUserId?: string | number;
}) {
  const anime = useAnimeById(review.animeId);

  const [revealed, setRevealed] = useState(!review.spoiler);
  const shouldShowProfileButton =
    hideProfileForUserId == null || String(review.userId) !== String(hideProfileForUserId);

  return (
    <Card className="bg-card border-primary/20 hover:border-primary/40 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <Link href={`/anime/${review.animeId}`} className="block">
              <div className="w-24 h-32 rounded overflow-hidden border border-primary/30 shadow-lg">
                {anime?.image ? (
                  <Image
                    src={anime.image}
                    alt={anime?.title_english || anime?.title_japanese || review.animeName}
                    width={96}
                    height={128}
                    className="w-full h-auto object-cover"
                    style={{ width: "100%", height: "auto" }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
            </Link>
            {shouldShowProfileButton && (
              <div className="mt-3">
                <Link
                  href={`/profile?userId=${encodeURIComponent(review.userId)}`}
                  className="inline-flex items-center rounded border border-blue-500 px-3 py-1 text-sm text-blue-300 hover:bg-blue-900/40 transition"
                >
                  View Profile
                </Link>
              </div>
            )}
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
                  Reviewed on{" "}
                  {new Date(review.ratedDate).toLocaleString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full font-bold">
                <p>⭐</p>
                {review.rating}/10
              </div>
            </div>
            <p className="text-base font-semibold uppercase tracking-wide text-gray-200 mb-2">
              {review.reviewHeader}
            </p>
            {/* Spoiler warning box */}
            {review.spoiler && !revealed && (
              <div className="bg-blue-950/40 border border-blue-500 p-3 rounded-md mb-3 text-blue-200 font-semibold">
                This review may contain spoilers
                <button
                  onClick={() => setRevealed(true)}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition"
                >
                  Show review
                </button>
              </div>
            )}

            {/* Only show body if revealed */}
            {revealed && <p className="text-gray-300">{review.reviewBody}</p>}

            <div
              style={{
                marginTop: "3rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid #0a3a7a",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              
              <UpvoteButton
                animeId={review.animeId}
                reviewId={review.reviewId}
                userId={review.userId}
                initial={review.upvotes || 0}
              />

              <DownvoteButton
                animeId={review.animeId}
                reviewId={review.reviewId}
                userId={review.userId}
                initial={review.downvotes || 0}
              />
              <FlagButton
                reviewId={review.reviewId}
                animeId={review.animeId}
                userId={review.userId}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
