'use client'

import * as React from "react"
import { Review } from "@/types/reviews"
import { ReviewsCard } from "./reviewsCard"

export default function ReviewsObject() {
    const [reviews, setReviews] = React.useState<Review[]>([]);

    React.useEffect(() => {
        async function fetchReviews() {
            const response = await fetch("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/reviews");
            const reviews = await response.json();
            setReviews(reviews);
        }
        fetchReviews();
    }, []);
    return ( // returns all reviews
        <div className="space-y-4 p-4">
            {reviews.map((review) => (
                <ReviewsCard key={review.reviewId} review={review} />
            ))}
        </div>
    )
}
