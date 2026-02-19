"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/components/user/UseUserGet";
import { useAuth } from "react-oidc-context";
import { useSearchParams } from "next/navigation";
import ReviewsList from "@/components/reviews/ReviewsList";
import OidcAuthPanel from "@/components/user/OidcAuthPanel";
import { EditUserForm } from "@/components/user/EditUserForm";
import { useCreateList } from "@/components/lists/UseListPost";
import { useGetListsByUserId } from "@/components/lists/UseListByUserIdGet";
import { List } from "@/types/List";
import ProfileListsSection from "@/components/lists/ProfileListsSection";

export default function ProfilePage() {
  return (
    <React.Suspense
      fallback={<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">Loading...</main>}
    >
      <ProfilePageContent />
    </React.Suspense>
  );
}

function ProfilePageContent() {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const userSub = auth.user?.profile?.sub as string | undefined;
  const viewedUserId = searchParams.get("userId") ?? searchParams.get("id") ?? userSub;
  const isOwnProfile = !!auth.isAuthenticated && !!userSub && viewedUserId === userSub;
  const {
    user: fetchedUser,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetUser(viewedUserId);
  const [reviewsAmount, setReviewsAmount] = React.useState(0);
  const [averageScore, setAverageScore] = React.useState(0);
  const [editing, setEditing] = React.useState(false);

  const { createList: createListApi } = useCreateList();
  const { getLists } = useGetListsByUserId();
  const [lists, setLists] = React.useState<List[]>([]);
  const [listsLoading, setListsLoading] = React.useState(false);
  const [listsRefreshKey, setListsRefreshKey] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;

    async function loadLists() {
      if (!viewedUserId) {
        setLists([]);
        return;
      }

      setListsLoading(true);
      const fetchedLists = await getLists(viewedUserId);
      if (cancelled) return;

      setLists(Array.isArray(fetchedLists) ? (fetchedLists as List[]) : []);
      setListsLoading(false);
    }

    loadLists();
    return () => {
      cancelled = true;
    };
  }, [getLists, viewedUserId, listsRefreshKey]);

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
                    {isOwnProfile && (
                      <div className="shrink-0">
                        <OidcAuthPanel />
                      </div>
                    )}
                  </div>
                </div>

                {isOwnProfile && (
                  <Button
                    variant="outline"
                    onClick={() => setEditing((v) => !v)}
                    className="mt-4 border-primary/40 text-gray-200"
                  >
                    {editing ? "Close Edit" : "Edit Profile"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isOwnProfile && editing && (
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

        {/* Profile Section */}
        <ProfileListsSection
          isOwnProfile={isOwnProfile}
          lists={lists}
          listsLoading={listsLoading}
          onListsChanged={() => setListsRefreshKey((prev) => prev + 1)}
          onCreateList={async (listName) => {
            const created = await createListApi({ listName });
            if (created) {
              setListsRefreshKey((prev) => prev + 1);
              return true;
            }
            return false;
          }}
        />

        {/* Reviews Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">My Reviews</h2>

          <ReviewsList
            id={fetchedUser?.userId}
            idType="user"
            onReviewsAmount={setReviewsAmount}
            onAverageScore={setAverageScore}
            hideProfileForUserId={viewedUserId}
          />
        </div>
      </div>
    </main>
  );
}
