"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Anime } from "@/types/animes";

export default function AnimesObject() {
  const [animes, setAnime] = React.useState<Anime[]>([]);

  React.useEffect(() => {
    async function fetchAnime() {
      const response = await fetch(
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime",
      );
      const data = await response.json();
      setAnime(data);
    }
    fetchAnime();
  }, []);
  return (
    // returns all reviews
    <div className="space-y-4 p-4">
      {animes.map((anime) => (
        <Card key={anime.animeId} className="bg-white text-black rounded-xl">

            <img 
                src={anime.image} 
                alt={anime.title_english} 
                className="w-full h-64 object-cover"
            />

          <CardHeader>
            <CardTitle>{anime.title_english}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>
              <strong>Studio:</strong> {anime.studio}
            </CardDescription>
            <CardDescription>
              <strong>Aired:</strong> {anime.aired}
            </CardDescription>
            <CardDescription>
              <strong>Episodes:</strong> {anime.episodes}
            </CardDescription>
            <CardDescription>
              <strong>Type:</strong> {anime.type}
            </CardDescription>
            <CardDescription>
              <strong>Source:</strong> {anime.source}
            </CardDescription>
            <CardDescription>
              <strong>Synopsis:</strong> {anime.synopsis}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
