"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "react-oidc-context";
import { Anime } from "@/types/Anime";
import { useCreateReview } from "@/components/UseReviewsPost";

export default function AddReviewForm({ anime, animeId }: { anime: Anime; animeId: string }) {
  const router = useRouter();
  const auth = useAuth();
  const { createReview } = useCreateReview();
  const numericAnimeId = Number(anime.animeId ?? animeId);

  const [form, setForm] = React.useState({
    rating: 0,
    reviewHeader: "",
    reviewText: "",
  });
  const [hoveredStar, setHoveredStar] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const resetForm = () => {
    setForm({ rating: 0, reviewHeader: "", reviewText: "" });
    setHoveredStar(0);
    setSaveError("");
    setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    if (Number.isNaN(numericAnimeId)) {
      setSaveError("Missing anime id for review submission.");
      return;
    }

    try {
      const review = await createReview({
        animeId: numericAnimeId,
        animeName: anime.title_english || anime.title_japanese,
        rating: form.rating,
        reviewHeader: form.reviewHeader,
        reviewBody: form.reviewText,
      });

      if (!review) {
        throw new Error("Failed to submit review");
      }

      setSaveSuccess(true);
      setForm({ rating: 0, reviewHeader: "", reviewText: "" });
      setHoveredStar(0);
      setTimeout(() => {
        router.push(`/anime/${animeId}`);
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  if (auth.isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <p className="text-gray-400">Checking your session...</p>
      </main>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <section className="py-16 px-6 flex justify-center">
        <div className="w-full max-w-[640px] min-w-[320px]">
          <Card className="bg-card border-primary/20 shadow-xl h-[240px]">
            <CardContent className="h-full flex flex-col items-center justify-center gap-4 p-8 sm:p-10 text-center">
              <p className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                Please log in to write a review
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full">
        {/* Review Form */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Stars Field */}
              <div>
                <label className="block text-white font-semibold mb-3">Rating</label>
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
                          star <= (hoveredStar || form.rating) ? "text-yellow-400" : "text-gray-600"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                {form.rating > 0 && (
                  <p className="text-sm text-gray-400 mt-2">{form.rating} out of 10 stars</p>
                )}
              </div>

              {/* Review Header Field */}
              <div>
                <label className="block text-white font-semibold mb-2">Review headline</label>
                <input
                  type="text"
                  name="reviewHeader"
                  value={form.reviewHeader}
                  onChange={(e) => setForm({ ...form, reviewHeader: e.target.value })}
                  maxLength={120}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Watch this before you die"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.reviewHeader.length}/120 characters
                </p>
              </div>

              {/* Review Text Field */}
              <div>
                <label className="block text-white font-semibold mb-2">Review</label>
                <textarea
                  name="reviewText"
                  value={form.reviewText}
                  onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Share your thoughts about this anime..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{form.reviewText.length} characters</p>
              </div>

              {/* Error/Success Messages */}
              {saveError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  Review submitted successfully!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={saving}
                  className="border-primary/30 text-gray-400 hover:text-white hover:border-primary/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    saving ||
                    form.rating === 0 ||
                    !form.reviewHeader.trim() ||
                    !form.reviewText.trim()
                  }
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
