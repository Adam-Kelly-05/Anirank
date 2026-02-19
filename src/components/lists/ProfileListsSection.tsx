"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { List } from "@/types/List";
import { useAnimeById } from "@/components/anime/UseAnime";

function ListAnimeItem({ animeId }: { animeId: number }) {
  const anime = useAnimeById(animeId);

  if (!anime) {
    return <p className="text-sm text-gray-400">Loading anime #{animeId}...</p>;
  }

  return (
    <Link
      href={`/anime/${animeId}`}
      className="flex items-center gap-3 rounded-lg border border-primary/20 p-2 hover:bg-primary/10 transition"
    >
      <Image
        src={anime.image}
        alt={anime.title_english || anime.title_japanese || "Anime cover"}
        width={48}
        height={64}
        className="h-16 w-12 object-cover rounded"
      />
      <p className="text-sm text-gray-200">{anime.title_english || anime.title_japanese}</p>
    </Link>
  );
}

export default function ProfileListsSection({
  isOwnProfile,
  lists,
  listsLoading,
  onCreateList,
}: {
  isOwnProfile: boolean;
  lists: List[];
  listsLoading: boolean;
  onCreateList: (listName: string) => Promise<boolean>;
}) {
  const [expandedListId, setExpandedListId] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const [createdListName, setCreatedListName] = React.useState<string | null>(null);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-3xl font-bold text-white">My Lists</h2>
        {isOwnProfile && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create List
          </Button>
        )}
      </div>

      {listsLoading && <p className="mb-6 text-gray-300">Loading lists...</p>}

      {!listsLoading && lists.length === 0 && (
        <p className="mb-6 text-gray-300">No lists found for this user.</p>
      )}

      {!listsLoading && lists.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {lists.map((list) => (
            <Card key={list.listId} className="bg-card border-primary/20">
              <CardContent className="p-4">
                <p className="text-xl font-semibold text-white">{list.listName}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {Array.isArray(list.items) ? list.items.length : 0} anime
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Created:{" "}
                  {list.createdAt
                    ? new Date(list.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Unknown date"}
                </p>
                <Button
                  onClick={() =>
                    setExpandedListId((prev) => (prev === list.listId ? null : list.listId))
                  }
                  variant="outline"
                  className="mt-3 border-primary/40 text-gray-200"
                >
                  {expandedListId === list.listId ? "Hide Items" : "View Items"}
                </Button>

                {expandedListId === list.listId && (
                  <div className="mt-4 space-y-2">
                    {list.items.length === 0 && (
                      <p className="text-sm text-gray-400">No anime in this list yet.</p>
                    )}
                    {list.items.map((item) => (
                      <ListAnimeItem
                        key={`${list.listId}-${item.animeId}`}
                        animeId={item.animeId}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm p-6 bg-[#0a0e1a] border border-blue-500 rounded-2xl text-gray-100 shadow-xl">
            <h3 className="text-lg font-semibold text-center mb-4">Create New List</h3>
            <input
              type="text"
              placeholder="Enter List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 rounded-full bg-[#0a0e1a] border border-blue-500 text-gray-100"
            />
            <div className="mt-4 flex gap-2">
              <Button
                onClick={async () => {
                  const trimmedName = newListName.trim();
                  if (!trimmedName) return;

                  const created = await onCreateList(trimmedName);
                  if (created) {
                    setCreatedListName(trimmedName);
                    setNewListName("");
                    setShowCreateModal(false);
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewListName("");
                }}
                variant="outline"
                className="flex-1 border-blue-500 text-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {createdListName && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm p-6 bg-[#0a0e1a] border border-blue-500 rounded-2xl text-gray-100 shadow-xl">
            <p className="text-lg font-semibold text-center">{createdListName} List Created</p>
            <Button
              onClick={() => setCreatedListName(null)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
