import { Anime } from "@/types/Anime";
import { notFound } from "next/navigation";
import FetchReviewsObject from "@/components/reviews";

export const dynamicParams = false;

export async function generateStaticParams() {
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

    const ids = Array.from(new Set(apiIds));
    return ids.map((id) => ({ id }));
  } catch {
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/${id}`,
    { cache: "force-cache" },
  );

  if (res.ok) {
    const payload = await res.json();
    const rawAnime = (Array.isArray(payload)
      ? payload[0]
      : (payload)?.Item ?? (payload)?.data ?? (payload)) as Anime | null;
    if (rawAnime) {
      const anime = rawAnime;
      return (
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col gap-10 md:flex-row md:items-start">
            <div className="w-full max-w-xs md:max-w-sm rounded-xl overflow-hidden shadow-2xl bg-black/40">
              <img
                src={anime.image}
                alt={anime.title_english || anime.title_japanese}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold">{anime.title_english}</h1>
                {anime.title_japanese && (
                  <h2 className="text-xl text-gray-400">
                    {anime.title_japanese}
                  </h2>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-900">
                {anime.aired && (
                  <span className="rounded-full bg-blue-200 px-3 py-1 text-blue-900">
                    Aired: {anime.aired}
                  </span>
                )}
                {anime.episodes ? (
                  <span className="rounded-full bg-amber-200 px-3 py-1 text-amber-900">
                    Episodes: {anime.episodes}
                  </span>
                ) : null}
                {anime.type && (
                  <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-900">
                    {anime.type}
                  </span>
                )}
                {anime.studio && (
                  <span className="rounded-full bg-purple-200 px-3 py-1 text-purple-900">
                    Studio: {anime.studio}
                  </span>
                )}
                {anime.source && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-900">
                    Source: {anime.source}
                  </span>
                )}
              </div>

              {anime.genres?.length ? (
                <div className="text-sm text-gray-200 flex flex-wrap gap-2">
                  <span className="font-semibold text-gray-100 mr-1">
                    Genres:
                  </span>
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-100"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              ) : null}

              <p className="text-gray-100 leading-relaxed">
                {anime.synopsis}
              </p>

              {anime.trailer && (
                <div>
                  <a
                    href={anime.trailer}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg hover:shadow-xl transition"
                  >
                    Watch Trailer
                    <span aria-hidden>▶</span>
                  </a>
                </div>
              )}
              <div>
                <FetchReviewsObject id={anime.animeId} idType="anime" />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  notFound();
}
