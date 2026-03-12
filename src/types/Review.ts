export interface Review {
  animeId: number;
  reviewId: number;
  animeName: string;
  rating: number;
  reviewBody: string;
  reviewHeader: string;
  userId: string;
  ratedDate: string;
  image: string;
  spoiler: boolean;
  confidence: number;
  upvotes: number;
  downvotes: number;
}
