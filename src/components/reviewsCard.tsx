'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Review } from "@/types/reviews"

interface ReviewsCardProps {
    review: Review
}

export function ReviewsCard({ review }: ReviewsCardProps) {
    return (
        <Card className="bg-white text-black rounded-xl">
            <CardHeader>
                <CardTitle>{review.animeName}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{review.reviewHeader}</CardDescription>
                <CardDescription>{review.reviewBody}</CardDescription>
                <CardDescription>Rating: {review.rating}/10</CardDescription>
            </CardContent>
        </Card>
    )
}
