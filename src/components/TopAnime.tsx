"use client";

import React from "react";
import RankedList from "@/components/RankedList";
import { Anime } from "@/types/Anime";
import List from "./List";

export default function TopTenAnimeList() {
  const [animes, setAnimes] = React.useState<Anime[]>([]);

  React.useEffect(() => {
    async function fetchTopTen() {
      const url = new URL("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime");
      url.searchParams.set("limit", "50");

      const response = await fetch(url.toString());
      const result = await response.json();

      const data = Array.isArray(result) ? result : (result?.Items ?? result?.data ?? []);

      const sorted = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      setAnimes(sorted.slice(0, 10));
    }

    fetchTopTen();
  }, []);

  const listItems = animes.map((anime) => ({
    title: anime.title_english || anime.title_japanese || "Unknown Title",
    imageUrl: anime.image,
  }));

  const handleAdd = (item: { title: string; imageUrl: string }) => {
    console.log("Adding anime:", item);
    //need to add logic to add anime to user's list
  };

  return (
    <section className="py-12">
      <div className="flex flex-wrap justify-center gap-10 overflow-x-auto">
        <div className="w-full md:w-[45%]">
          <h2 className="text-3xl font-bold mb-6">Top 10 Anime</h2>
          <RankedList items={listItems} onAdd={handleAdd} />
        </div>
        <div className="w-full md:w-[45%]">
          <h2 className="text-3xl font-bold mb-6">Editor's Picks</h2>
          <List items={listItems} onAdd={handleAdd} />
        </div>
      </div>
    </section>
  );
}
