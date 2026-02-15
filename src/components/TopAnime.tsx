"use client";

import React from "react";
import RankedList from "@/components/RankedList";
import { Anime } from "@/types/Anime";
import List from "./List";
import { useUserLists } from "@/app/UserListsContext";
import ListSelectorModal from "@/components/ListSelectorModal";

export default function TopTenAnimeList() {
  const [animes, setAnimes] = React.useState<Anime[]>([]);
  const { userLists } = useUserLists()!;  

  const [selectedAnime, setSelectedAnime] = React.useState<number | null>(null);
  const [showListSelector, setShowListSelector] = React.useState(false);
  const [showAllTop, setShowAllTop] = React.useState(false);
  const [showAllEditors, setShowAllEditors] = React.useState(false);
  const [editorsPicks, setEditorsPicks] = React.useState<Anime[]>([]);

  const defaultLists = [ "Favourites", "Watching", "Completed", "Plan to Watch"];

  React.useEffect(() => {
    async function fetchTopTen() {
      const url = new URL("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime");
      url.searchParams.set("limit", "100");

      const response = await fetch(url.toString());
      const result = await response.json();

      const data = Array.isArray(result) ? result : (result?.Items ?? result?.data ?? []);

      const sorted = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      const normalized = sorted.map((a) => ({ ...a, animeId: a.animeId ?? a.id,}));

      setAnimes(normalized);
    }

    fetchTopTen();
  }, []);

  const listItems = animes.map((anime) => ({
    title: anime.title_english || anime.title_japanese || "Unknown Title",
    imageUrl: anime.image,
    animeId: anime.animeId,
  }));

  const handleAdd = (item: { title: string; imageUrl: string; animeId: number }) => {
    console.log("Adding anime:", item);
    setSelectedAnime(item.animeId); 
    setShowListSelector(true);
  };

  //Display only 10 top animes by default, with option to show all
  const visibleTopItems = showAllTop ? listItems : listItems.slice(0, 10);

  React.useEffect(() => {
  async function fetchEditorsPicks() {
    const url = new URL("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime");
    url.searchParams.set("limit", "100");

    const response = await fetch(url.toString());
    const result = await response.json();

    const data = Array.isArray(result) ? result : (result?.Items ?? result?.data ?? []);

    //selects 10 random animes from the list
    const shuffled = [...data].sort(() => Math.random() - 0.5);

    const normalized = shuffled.map((a) => ({
      ...a,
      animeId: a.animeId ?? a.id,
    }));

    setEditorsPicks(normalized);
  }

  fetchEditorsPicks();
}, []);

const editorItems = editorsPicks.map((anime) => ({
  title: anime.title_english || anime.title_japanese || "Unknown Title",
  imageUrl: anime.image,
  animeId: anime.animeId,
}));
  //Display only 10 editor's picks by default, with option to show all
  const visibleEditorsPicks = showAllEditors ? editorItems : editorItems.slice(0, 10);

  return (
    <>
    <section className="py-12">
      <div className="flex flex-wrap justify-center gap-10 overflow-x-auto">
        <div className="w-full md:w-[45%]">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold mb-6">Top 100 Anime</h2>
          {listItems.length > 10 && ( 
            <button onClick={() => setShowAllTop(!showAllTop)} 
            className="text-sm text-blue-400 hover:text-blue-300 transition" > 
            {showAllTop ? "Show Less" : "View All"} 
            </button> 
          )} 
          </div>
          <RankedList items={visibleTopItems} onAdd={handleAdd} />
        </div>

        <div className="w-full md:w-[45%]">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold mb-6">Editor's Picks</h2>
          {editorItems.length > 10 && ( 
            <button onClick={() => setShowAllEditors(!showAllEditors)} 
            className="text-sm text-blue-400 hover:text-blue-300 transition" > 
            {showAllEditors ? "Show Less" : "View All"} 
            </button> 
          )} 
            </div>
          <List items={visibleEditorsPicks} onAdd={handleAdd} />
        </div>
      </div>
    </section>   
    
    <ListSelectorModal  
    show={showListSelector}
    onClose={() => setShowListSelector(false)}
    selectedAnime={selectedAnime}
    defaultLists={defaultLists}
/>
    </>
  );
}
