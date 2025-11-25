import AnimeDetailsPage from "./AnimeDetailsPage";
import { Anime } from "@/types/animes";
import animeData from "@/extras/anime.json";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const localIds = animeData.map((anime) => anime.animeId.toString());

  try {
    const res = await fetch(
      "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime",
      { cache: "force-cache" },
    );
    const payload = await res.json();
    const list = Array.isArray(payload)
      ? payload
      : payload?.Items ?? payload?.data ?? [];

    const apiIds = list
      .map((item: { id?: number; animeId?: number }) =>
        (item.id ?? item.animeId)?.toString(),
      )
      .filter(Boolean) as string[];

    const ids = Array.from(new Set([...localIds, ...apiIds]));
    return ids.map((id) => ({ id }));
  } catch {
    return localIds.map((id) => ({ id }));
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idParam = id;

  let rawAnime: Anime | null = null;

  try {
    const res = await fetch(
      `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/${idParam}`,
      { cache: "force-cache" },
    );

    if (res.ok) {
      const payload = await res.json();
      rawAnime = (Array.isArray(payload)
        ? payload[0]
        : (payload)?.Item ?? (payload)?.data ?? (payload)) as Anime | null;
    }
  } catch {
    // ignore and fall back to local data
  }

  if (!rawAnime) {
    notFound();
  }

  return <AnimeDetailsPage anime={rawAnime} />;
}
