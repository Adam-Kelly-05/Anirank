'use client'

import * as React from "react"
import { Review } from "@/types/Review"
import { ReviewsCard } from "./reviewsCard"

export default function FetchReviewsObject({ userId }: { userId?: string | number }) {
    const [reviews, setReviews] = React.useState<Review[]>([]);

    React.useEffect(() => {
        async function fetchReviews() {
            let url = "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/reviews"
            if (userId != null) { url += `/${userId}` }
            const response = await fetch(url);
            const reviews = await response.json();
            setReviews(reviews);
        }
        fetchReviews();
    }, [userId]);
    return ( // returns all reviews
        <div className="space-y-4 p-4">
            {reviews.map((review) => (
                <ReviewsCard key={review.reviewId} review={review} />
            ))}
        </div>
    )
}
