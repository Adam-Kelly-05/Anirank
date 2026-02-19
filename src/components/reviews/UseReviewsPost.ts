"use client";

import { useAuth } from "react-oidc-context";

export function useCreateReview() {
  const auth = useAuth();

  const createReview = async (review: {
    animeId: number;
    animeName?: string;
    rating: number;
    reviewHeader?: string;
    reviewBody?: string;
    ratedDate?: string;
  }) => {
    const idToken = auth.user?.id_token;

    if (!idToken) {
      console.error("useCreateReview: Not authenticated (no id_token)");
      return null;
    }

    const res = await fetch("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(review),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("createReview failed:", res.status, json);
      return null;
    }

    return json.review ?? json;
  };

  return { createReview };
}
