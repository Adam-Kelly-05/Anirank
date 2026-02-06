import { Anime } from "./Anime";

export type RecommendationSection =
  | { kind: "genre"; genre: string; title: string; items: Anime[] }
  | { kind: "anime"; animeId: number; title: string; seed: Anime; items: Anime[] };
