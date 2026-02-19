"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Anime } from "@/types/Anime";

export function SearchLogic({
  children,
}: {
  children: (state: { query: string; animes: Anime[]; isLoading: boolean }) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const term = query.trim();

    if (!term) {
      setAnimes([]);
      setIsLoading(false);
      return;
    }

    async function fetchAnime() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/${term}`,
        );
        const result = await response.json();
        const data = Array.isArray(result) ? result : (result?.Items ?? result?.data ?? []);
        setAnimes(data);
      } catch {
        setAnimes([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnime();
  }, [query]);

  return <>{children({ query, animes, isLoading })}</>;
}
