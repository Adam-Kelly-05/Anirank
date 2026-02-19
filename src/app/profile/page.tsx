"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/components/UseUserGet";
import { useAuth } from "react-oidc-context";
import ReviewsList from "@/components/ReviewsList";
import OidcAuthPanel from "@/components/OidcAuthPanel";
import { EditUserForm } from "@/components/EditUserForm";
import { useUserLists } from "../UserListsContext";
import ListFilter from "@/components/ListFilter";
import List from "@/components/List";
import { useCreateList } from "@/components/UseListPost";

export default function ProfilePage() {
  console.log("ProfilePage rendered");

  const auth = useAuth();
  const userSub = auth.user?.profile?.sub as string | undefined;
  const {
    user: fetchedUser,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetUser(userSub);
  const [reviewsAmount, setReviewsAmount] = React.useState(0);
  const [averageScore, setAverageScore] = React.useState(0);
  const [editing, setEditing] = React.useState(false);

  const { userLists, createList, removeAnimeFromList, deleteList } = useUserLists();
  const { createList: createListApi } = useCreateList();
  const defaultLists = ["Favourites", "Watching", "Watched", "Plan to Watch"];
  const allListNames = [...defaultLists, ...userLists.map((l) => l.name)];
  const combinedLists = [
    ...defaultLists.map((name) => ({ name, isDefault: true })),
    ...userLists.map((list) => ({ name: list.name, listId: list.listId, isDefault: false })),
  ];

  const [selectedList, setSelectedList] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const [createdListName, setCreatedListName] = React.useState<string | null>(null);
  const selectedListObject = userLists.find((l) => l.name === selectedList);

  const [animeItems, setAnimeItems] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (!selectedList) return;
    if (!selectedListObject) return;
    const list = selectedListObject;
    async function loadAnime() {
      const results = [];
      for (const id of list?.items || []) {
        const res = await fetch(`/api/anime/${id}`);
        const anime = await res.json();
        results.push(anime);
      }
      setAnimeItems(results);
    }
    loadAnime();
  }, [selectedList, userLists, selectedListObject]);

  if (auth.isLoading) {
    return <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">Loading...</main>;
  }

  if (!auth.isAuthenticated) {
    return (
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-primary/30">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-white">Sign in</h1>
                <OidcAuthPanel />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (userLoading) {
    return <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">Loading...</main>;
  }

  if (userError) {
    return (
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8 bg-card border-primary/30">
            <CardContent className="p-8 text-center text-white space-y-4">
              <p>{userError}</p>
              <div className="flex justify-center gap-4">
                <button
                  className="appearance-none rounded border-2 border-primary px-4 py-2 text-primary hover:border-primary/80 hover:text-primary/80"
                  onClick={refetchUser}
                >
                  Retry
                </button>
                <OidcAuthPanel />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-primary/30">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Avatar */}
              {fetchedUser?.ProfilePicture ? (
                <div className="flex-shrink-0">
                  <Image
                    src={fetchedUser.ProfilePicture}
                    alt={`${fetchedUser.Username}'s avatar`}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover shadow-2xl"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                    {/* First letter as default Avatar */}
                    {fetchedUser?.Username?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="flex-1 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">{fetchedUser?.Username}</h1>
                <p className="text-gray-400 text-lg mb-4">{fetchedUser?.Bio}</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="px-4 py-2 bg-card rounded-lg border border-primary/20">
                    <p className="text-gray-400">
                      User Since:{" "}
                      <span className="ml-2 text-white font-semibold">
                        {new Date(fetchedUser?.DateJoin ?? "").toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="shrink-0">
                      <OidcAuthPanel />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setEditing((v) => !v)}
                  className="mt-4 border-primary/40 text-gray-200"
                >
                  {editing ? "Close Edit" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {editing && (
          <EditUserForm
            user={fetchedUser}
            onSaved={async () => {
              await refetchUser();
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{reviewsAmount}</div>
              <div className="text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {Number(averageScore ?? 0).toFixed(2)}
              </div>
              <div className="text-gray-400">Average Score</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-white">My Lists</h2>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create List
          </Button>
        </div>

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
                    const created = await createListApi({
                      listName: trimmedName,
                    });
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

        {/* Reviews Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">My Reviews</h2>

          <ReviewsList
            id={fetchedUser?.userId}
            idType="user"
            onReviewsAmount={setReviewsAmount}
            onAverageScore={setAverageScore}
          />
        </div>
      </div>
    </main>
  );
}
