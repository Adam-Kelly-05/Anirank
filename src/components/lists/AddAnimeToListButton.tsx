"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ListSelectorModal from "@/components/lists/ListSelectorModal";

export default function AddAnimeToListButton({ animeId }: { animeId: number }) {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Add to List
      </Button>

      <ListSelectorModal
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedAnime={animeId}
      />
    </>
  );
}
