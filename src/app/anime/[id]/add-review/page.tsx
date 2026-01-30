import { Anime } from "@/types/Anime";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime",
      { cache: "no-store" },
    );
    const payload = await res.json();
    const list = Array.isArray(payload)
      ? payload
      : (payload?.Items ?? payload?.data ?? []);

    const apiIds = list
      .map((item: { id?: number; animeId?: number }) =>
        (item.id ?? item.animeId)?.toString(),
      )
      .filter(Boolean) as string[];

    const ids = Array.from(new Set(apiIds));
    return ids.map((id) => ({ id }));
  } catch {
    return [];
  }
}

export default async function AddReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch anime details to display context
  const res = await fetch(
    `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/${id}`,
    { cache: "force-cache" },
  );

  if (!res.ok) {
    notFound();
  }

  const payload = await res.json();
  const rawAnime = (
    Array.isArray(payload)
      ? payload[0]
      : (payload?.Item ?? payload?.data ?? payload)
  ) as Anime | null;

  if (!rawAnime) {
    notFound();
  }

  const anime = rawAnime;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <Link href={`/anime/${id}`}>
          <Button variant="ghost" size="sm">
            ← Back to {anime.title_english || anime.title_japanese}
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Write a Review</h1>
          <p className="text-gray-400 mt-2">
            Share your thoughts about {anime.title_english || anime.title_japanese}
          </p>
        </div>

        {/* Review form will go here */}
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-gray-400">Review form component will be added here.</p>
        </div>
      </div>
    </div>
  );
}
