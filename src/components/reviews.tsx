'use client'

import * as React from "react"
import { Review } from "@/types/Review"
import { ReviewsCard } from "./reviewsCard"

export default function FetchReviewsObject({ id, idType }: { id?: string | number; idType?: string | number }) {
    const [reviews, setReviews] = React.useState<Review[]>([]);

    React.useEffect(() => {
        async function fetchReviews() {
            let url = "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/reviews"
            if (idType == "user") {
                url += `/${id}`;
            } else if (idType == "anime") {
                url += `/animeId/${id}`;
            }
            const response = await fetch(url);
            const raw = await response.json();
            const data = Array.isArray(raw) ? raw : raw?.Items ?? raw?.data ?? [];
            setReviews(data);
        }
        fetchReviews();
    }, [id, idType]);
    return ( // returns all reviews
        <div className="space-y-4 p-4">
            {reviews.map((review) => (
                <ReviewsCard key={review.reviewId} review={review} />
            ))}
        </div>
    )
}
