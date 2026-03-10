import { Review } from "@/types/Review";

export function groupReviewsByAnime(reviews: Review[]) {
  const map = new Map();

  for (const r of reviews) {
    if (!map.has(r.animeId)) {
      map.set(r.animeId, {
        animeId: r.animeId,
        title: r.animeName,
        image: r.image,
        reviewCount: 0,
      });
    }

    map.get(r.animeId).reviewCount++;
  }

  return Array.from(map.values()).sort((a, b) => b.reviewCount - a.reviewCount);
}
