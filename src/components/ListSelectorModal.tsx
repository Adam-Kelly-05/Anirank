"use client";

import React from "react";
import { useUserLists } from "@/app/UserListsContext";

interface ListSelectorModalProps {
  show: boolean;
  onClose: () => void;
  selectedAnime: number | null;
  defaultLists: string[];
}

export default function ListSelectorModal({
  show,
  onClose,
  selectedAnime,
  defaultLists
}: ListSelectorModalProps) {
  const { userLists, addAnimeToList, createList } = useUserLists()!;
  const [creatingList, setCreatingList] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");

  if (!show) return null;

  const combinedLists = userLists;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 bg-[#0a0e1a] border border-blue-500 rounded-2xl text-gray-100 shadow-xl">

        {!creatingList ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-100">Add to List</h2>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll flex flex-col items-center">
              {combinedLists.map((list) => (
                <button
                  key={list.listId}
                  onClick={() => {
                    addAnimeToList(list.listId, selectedAnime!);
                    onClose();
                  }}
                  className="w-80 text-center px-3 py-2 text-xs rounded-full border border-blue-500 bg-blue-600 text-gray-100 hover:bg-blue-800 transition"
                >
                  {list.name}
                </button>
              ))}
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
              onClick={() => {
                const newId = createList(newListName);
                addAnimeToList(newId, selectedAnime!);
                setCreatingList(false);
                onClose();
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
