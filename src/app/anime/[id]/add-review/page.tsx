import { Anime } from "@/types/Anime";
import { notFound } from "next/navigation";
import AddReviewForm from "./AddReviewForm";

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

  return <AddReviewForm anime={anime} animeId={id} />;
}
