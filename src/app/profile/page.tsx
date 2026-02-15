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

export default function ProfilePage() {
  const auth = useAuth();
  const userSub = auth.user?.profile?.sub as string | undefined;
  const {
    user: fetchedUser,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetUser(userSub);
  const [reviewsAmount, setReviewsAmount] = React.useState(0); // Default value of 0
  const [averageScore, setAverageScore] = React.useState(0);
  const [editing, setEditing] = React.useState(false);

  const { userLists, createList, removeAnimeFromList, deleteList } = useUserLists(); 
  const defaultLists = [ "Favourites", "Watching", "Watched", "Plan to Watch" ]; 
  const allListNames = [ 
    ...defaultLists,    
    ...userLists.map((l) => l.name), 
  ]; 

  const [selectedList, setSelectedList] = React.useState<string | null>(null); 
  const [showCreateModal, setShowCreateModal] = React.useState(false); 
  const [newListName, setNewListName] = React.useState("");
  const selectedListObject = userLists.find(l => l.name === selectedList);

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
        results.push(anime); } 
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

      {/* List Filter Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">My Lists</h2>        
          <ListFilter        
          lists={allListNames}         
          selectedList={selectedList}         
          onSelect={setSelectedList}  
          onCreateList={() => setShowCreateModal(true)}          
          />

          {/* Delete list button */}         
          {selectedList && (
            <button
            onClick={() => {      
              const list = userLists.find(l => l.name === selectedList);      
              if (!list) return;
              
              if (confirm(`Delete list "${selectedList}"?`)) {
                deleteList(list.listId);
                setSelectedList(null);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete List
              </button>
            )}
        </div>

      {/* Display Anime in selected list */}
      {selectedList && ( 
        <div className="mt-6"> 
        <h3 className="text-2xl font-bold text-white mb-4"> 
          {selectedList} 
        </h3> 
        <List items={animeItems.map((anime) => ({ 
          title: anime.title_english || anime.title_japanese, 
          imageUrl: anime.image, 
          animeId: anime.animeId 
          })
        )} 
        onRemove={(animeId) => { 
          if (!selectedListObject) return; 
          if (confirm("Remove this anime from the list?")) { 
            removeAnimeFromList(selectedListObject.listId, animeId); 
          } 
        }}
        /> 
        </div>
      )}

      {/* create list modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80">
              
              <h2 className="text-xl font-bold mb-4">Create New List</h2>
              <input        
              type="text"        
              placeholder="List name"
              value={newListName}        
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-3"       
              />      
              <button 
              onClick={() => {          
                const id = createList(newListName);
                setSelectedList(newListName);
                setShowCreateModal(false);
                setNewListName("");        
              }}        
              className="w-full px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"      
              >        
              Create
              </button>      
              
              <button        
              onClick={() => setShowCreateModal(false)}        
              className="mt-2 w-full px-3 py-2 rounded bg-gray-300 dark:bg-gray-700"      
              >        
              Cancel      
              </button>
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
