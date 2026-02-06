"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import AnimeCard from "./AnimeCard";
import type { Anime } from "@/types/Anime";

type Section =
  | {
      kind: "genre";
      genre: string;
      title: string;
      items: Anime[];
    }
  | {
      kind: "anime";
      animeId: number;
      title: string;
      seed: Anime;
      items: Anime[];
    };

type ApiResponse = {
  sections: Section[];
};

export default function RecommendationsTester() {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);

  const load = async () => {
    setLoading(true);
    setError("");
    setSections([]);

    const idToken = auth.user?.id_token;
    if (!idToken) {
      setLoading(false);
      setError("Not authenticated (no id_token)");
      return;
    }

    try {
      const res = await fetch(
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/me/recommendations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const text = await res.text();
      console.log("RAW:", text);

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}\n\n${text}`);

      const parsed = JSON.parse(text) as ApiResponse;

      if (!parsed || !Array.isArray(parsed.sections)) {
        throw new Error("Unexpected API response shape (missing sections[])");
      }

      setSections(parsed.sections);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated]);

  return (
    <div className="p-4 space-y-10">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Recommendations Tester</h2>
        <button
          onClick={load}
          disabled={loading || !auth.isAuthenticated}
          className="px-3 py-1.5 rounded-md border border-primary/30 hover:border-primary/60 hover:bg-primary/5 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Reload"}
        </button>
      </div>

      {error ? (
        <pre className="whitespace-pre-wrap rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          {error}
        </pre>
      ) : null}

      {!error && !loading && sections.length === 0 ? (
        <div className="text-muted-foreground">No sections returned.</div>
      ) : null}

      {sections.map((section, idx) => (
        <div key={`${section.kind}-${idx}`} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{section.title}</h3>

            {section.kind === "genre" ? (
              <span className="text-sm text-muted-foreground">
                genre: {section.genre}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                seed animeId: {section.animeId}
              </span>
            )}
          </div>

          {section.kind === "anime" ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Because you like:</div>
              <div className="max-w-[280px]">
                <AnimeCard {...section.seed} />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {section.items.map((anime) => (
              <AnimeCard key={anime.animeId} {...anime} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
