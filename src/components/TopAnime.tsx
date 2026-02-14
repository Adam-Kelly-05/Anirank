"use client";

import React from "react";
import RankedList from "@/components/RankedList";
import { Anime } from "@/types/Anime";
import List from "./List";
import { useUserLists } from "@/app/UserListsContext";

export default function TopTenAnimeList() {
  const [animes, setAnimes] = React.useState<Anime[]>([]);
  const { userLists, addAnimeToList, createList } = useUserLists()!;  

  const [selectedAnime, setSelectedAnime] = React.useState<number | null>(null);
  const [showListSelector, setShowListSelector] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const [creatingList, setCreatingList] = React.useState(false);

  React.useEffect(() => {
    async function fetchTopTen() {
      const url = new URL("https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime");
      url.searchParams.set("limit", "50");

      const response = await fetch(url.toString());
      const result = await response.json();

      const data = Array.isArray(result) ? result : (result?.Items ?? result?.data ?? []);

      const sorted = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      const normalized = sorted.map((a) => ({ ...a, animeId: a.animeId ?? a.id,}));

      setAnimes(normalized.slice(0, 10));
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

  return (
    <>
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
      
    {/* List selector modal */}
    {showListSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">

            {!creatingList ? (
              <>
                <h2 className="text-xl font-bold mb-4">Add to List</h2>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userLists.map((list) => (
                    <button key={list.listId} onClick={() => {
                        addAnimeToList(list.listId, selectedAnime!);
                        setShowListSelector(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {list.name}
                    </button>
                  ))}
                </div>

                <button onClick={() => setCreatingList(true)}
                  className="mt-4 w-full px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                >
                  + Create New List
                </button>

                <button onClick={() => setShowListSelector(false)}
                  className="mt-2 w-full px-3 py-2 rounded bg-gray-300 dark:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Create New List</h2>

                <input type="text" placeholder="List name" value={newListName} onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-3"
                />

                <button onClick={() => {
                    const newId = createList(newListName);
                    addAnimeToList(newId, selectedAnime!);
                    setCreatingList(false);
                    setShowListSelector(false);
                    setNewListName("");
                  }}
                  className="w-full px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"                >
                  Create
                </button>

                <button onClick={() => setCreatingList(false)}
                  className="mt-2 w-full px-3 py-2 rounded bg-gray-300 dark:bg-gray-700"
                >
                  Back
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
