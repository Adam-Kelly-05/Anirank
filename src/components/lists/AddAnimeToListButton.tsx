"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import AddAnimeToListPopUp from "@/components/lists/AddAnimeToListPopUp";

export default function AddAnimeToListButton({ animeId }: { animeId: number }) {
  const [showPopUp, setShowPopUp] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setShowPopUp(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add to List
      </Button>

      <AddAnimeToListPopUp
        show={showPopUp}
        onClose={() => setShowPopUp(false)}
        selectedAnime={animeId}
      />
    </>
  );
}
