"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { useGetListsByUserId } from "@/components/lists/UseListByUserIdGet";
import { useAddAnimeToList } from "@/components/lists/UseListAnimePost";
import { useCreateList } from "@/components/lists/UseListPost";
import { List } from "@/types/List";

interface AddAnimeToListPopUpProps {
  show: boolean;
  onClose: () => void;
  selectedAnime: number | null;
}

function listHasAnime(list: List, animeId: number | null): boolean {
  if (animeId == null || !Array.isArray(list.items)) return false;
  return list.items.some((item) => Number(item.animeId) === Number(animeId));
}

export default function AddAnimeToListPopUp({
  show,
  onClose,
  selectedAnime,
}: AddAnimeToListPopUpProps) {
  const auth = useAuth();
  const { getLists } = useGetListsByUserId();
  const { addAnimeToList } = useAddAnimeToList();
  const { createList } = useCreateList();
  const [lists, setLists] = React.useState<List[]>([]);
  const [loadingLists, setLoadingLists] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [creatingList, setCreatingList] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");

  React.useEffect(() => {
    if (!show) return;

    const userSub = auth.user?.profile?.sub;
    if (!userSub) {
      setError("Sign in to add anime to lists.");
      setLists([]);
      return;
    }
    const safeUserSub: string = userSub;

    let cancelled = false;
    async function loadLists() {
      setLoadingLists(true);
      setError(null);
      const result = await getLists(safeUserSub);
      if (cancelled) return;
      setLists(Array.isArray(result) ? (result as List[]) : []);
      setLoadingLists(false);
    }

    loadLists();
    return () => {
      cancelled = true;
    };
  }, [show, auth.user?.profile?.sub, getLists]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 bg-[#0a0e1a] border border-blue-500 rounded-2xl text-gray-100 shadow-xl">
        {!creatingList ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-100">Add to List</h2>

            {loadingLists && <p className="text-sm text-gray-300 mb-2">Loading lists...</p>}
            {error && <p className="text-sm text-red-300 mb-2">{error}</p>}

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll flex flex-col items-center">
              {lists.map((list) => {
                const alreadyAdded = listHasAnime(list, selectedAnime);
                return (
                  <button
                    key={list.listId}
                    disabled={alreadyAdded}
                    onClick={async () => {
                      if (!selectedAnime || alreadyAdded) return;
                      await addAnimeToList({
                        listId: list.listId,
                        animeId: selectedAnime,
                      });
                      onClose();
                    }}
                    className={`w-80 text-center px-3 py-2 text-xs rounded-full border border-blue-500 text-gray-100 transition ${
                      alreadyAdded
                        ? "bg-blue-900/40 cursor-not-allowed opacity-60"
                        : "bg-blue-600 hover:bg-blue-800"
                    }`}
                  >
                    {alreadyAdded ? `${list.listName} (Already Added)` : list.listName}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCreatingList(true)}
              className="mt-4 w-full px-3 py-2 text-xs rounded-full border border-blue-500 text-gray-100 hover:bg-blue-800 transition"
            >
              Create New List
            </button>

            <button
              onClick={onClose}
              className="mt-2 w-full px-3 py-2 text-xs rounded-full border border-blue-500 text-gray-100 hover:bg-blue-900 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-100">Create New List</h2>

            <input
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0a0e1a] border border-blue-500 text-gray-100 mb-3"
            />

            <button
              onClick={async () => {
                const trimmedName = newListName.trim();
                if (!trimmedName || !selectedAnime) return;

                await createList({ listName: trimmedName });

                const userSub = auth.user?.profile?.sub;
                if (userSub) {
                  const refreshed = await getLists(userSub);
                  const refreshedLists = Array.isArray(refreshed) ? (refreshed as List[]) : [];
                  setLists(refreshedLists);
                }

                setCreatingList(false);
                setNewListName("");
              }}
              className="w-full px-3 py-2 text-xs rounded-full bg-blue-600 text-gray-100 hover:bg-blue-800 transition"
            >
              Create
            </button>

            <button
              onClick={() => setCreatingList(false)}
              className="mt-2 w-full px-3 py-2 text-xs rounded-full border border-blue-500 text-gray-100 hover:bg-blue-800 transition"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
