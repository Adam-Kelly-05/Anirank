"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { useGetListsByUserId } from "@/components/UseListByUserIdGet";
import { useAddAnimeToList } from "@/components/UseListAnimePost";
import { List } from "@/types/List";

export default function AddAnimeToListButton({ animeId }: { animeId: number }) {
  const auth = useAuth();
  const { getLists } = useGetListsByUserId();
  const { addAnimeToList } = useAddAnimeToList();

  const [showModal, setShowModal] = React.useState(false);
  const [lists, setLists] = React.useState<List[]>([]);
  const [loadingLists, setLoadingLists] = React.useState(false);
  const [submittingListId, setSubmittingListId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!showModal) return;
    const userSub = auth.user?.profile?.sub;
    if (!userSub) {
      setError("Sign in to add this anime to a list.");
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
  }, [showModal, auth.user?.profile?.sub, getLists]);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add to List
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-md p-6 bg-[#0a0e1a] border border-blue-500 rounded-2xl text-gray-100 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">Add Anime To List</h3>

            {loadingLists && <p className="text-sm text-gray-300">Loading lists...</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}
            {success && <p className="text-sm text-green-300">{success}</p>}

            {!loadingLists && !error && lists.length === 0 && (
              <p className="text-sm text-gray-300">No lists found.</p>
            )}

            {!loadingLists && lists.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lists.map((list) => (
                  <Button
                    key={list.listId}
                    disabled={submittingListId === list.listId}
                    onClick={async () => {
                      setSubmittingListId(list.listId);
                      setError(null);
                      setSuccess(null);

                      const result = await addAnimeToList({
                        listId: list.listId,
                        animeId,
                      });

                      if (result) {
                        setSuccess(`Added to "${list.listName}"`);
                      } else {
                        setError("Failed to add anime to list.");
                      }
                      setSubmittingListId(null);
                    }}
                    variant="outline"
                    className="w-full justify-start border-blue-500 text-gray-100 hover:bg-blue-800"
                  >
                    {submittingListId === list.listId ? "Adding..." : list.listName}
                  </Button>
                ))}
              </div>
            )}

            <Button
              onClick={() => {
                setShowModal(false);
                setError(null);
                setSuccess(null);
              }}
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
