"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "react-oidc-context";
import { Anime } from "@/types/Anime";
import Image from "next/image";

interface AddReviewFormProps {
  anime: Anime;
  animeId: string;
}

export default function AddReviewForm({ anime, animeId }: AddReviewFormProps) {
  const router = useRouter();
  const auth = useAuth();

  const [form, setForm] = React.useState({
    rating: 0,
    reviewText: "",
  });
  const [hoveredStar, setHoveredStar] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const response = await fetch(
        `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AnimeId: animeId,
            UserId: auth.user?.profile?.sub,
            Rating: form.rating,
            ReviewText: form.reviewText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push(`/anime/${animeId}`);
      }, 1500);
    } catch (err: any) {
      setSaveError(err.message || "Failed to submit review.");
    } finally {
      setSaving(false);
    }
  };

  // if (!auth.isAuthenticated) {
  //   return (
  //     <main className="min-h-screen flex items-center justify-center py-12 px-4">
  //       <Card className="bg-card border-primary/20">
  //         <CardContent className="p-8 text-center">
  //           <p className="text-gray-400 mb-4">Please log in to write a review</p>
  //           <Button onClick={() => router.push(`/anime/${animeId}`)}>Go Back</Button>
  //         </CardContent>
  //       </Card>
  //     </main>
  //   );
  // }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/anime/${animeId}`)}
            className="mb-4 border-primary/30 text-gray-400 hover:text-white hover:border-primary/50"
          >
            ← Back to {anime.title_english || anime.title_japanese}
          </Button>
          <h1 className="text-4xl font-bold text-white">Write a Review</h1>
          <p className="text-gray-400 mt-2">
            Share your thoughts about {anime.title_english || anime.title_japanese}
          </p>
        </div>

        {/* Anime Info Card */}
        <Card className="bg-card border-primary/20 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={anime.image}
                  alt={anime.title_english || anime.title_japanese || "Anime"}
                  width={80}
                  height={120}
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-0.5">
                  {anime.title_english || anime.title_japanese}
                </h2>
                {anime.title_japanese && anime.title_english && (
                  <p className="text-xs text-gray-400 mb-2">
                    {anime.title_japanese}
                  </p>
                )}
                <p className="text-gray-300 text-xs line-clamp-2">
                  {anime.synopsis}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Form */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Stars Field */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="text-4xl transition-all duration-150 focus:outline-none"
                    >
                      <span
                        className={
                          star <= (hoveredStar || form.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                {form.rating > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {form.rating} out of 10 stars
                  </p>
                )}
              </div>

              {/* Review Text Field */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Review
                </label>
                <textarea
                  name="reviewText"
                  value={form.reviewText}
                  onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Share your thoughts about this anime..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.reviewText.length} characters
                </p>
              </div>

              {/* Error/Success Messages */}
              {saveError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  Review submitted successfully! Redirecting...
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/anime/${animeId}`)}
                  disabled={saving}
                  className="border-primary/30 text-gray-400 hover:text-white hover:border-primary/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || form.rating === 0 || !form.reviewText.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
