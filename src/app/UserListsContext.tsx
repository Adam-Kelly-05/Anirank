"use client";

import React, { createContext, useEffect, useState, useContext } from "react";
import { List } from "@/types/List";

interface UserListsContextType {
  userLists: List[]; 
  addAnimeToList: (listId: number, animeId: number  ) => void; 
    createList: (name: string, description?: string) => number; 
}

const UserListsContext = createContext<UserListsContextType | undefined>(undefined);

export const UserListsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLists, setUserLists] = useState<List[]>([]);

    useEffect(() => {
    const saved = localStorage.getItem("userLists");
    if (saved) setUserLists(JSON.parse(saved));
  }, []);

    useEffect(() => {
    localStorage.setItem("userLists", JSON.stringify(userLists));
  }, [userLists]);

    const createList = (name: string, description?: string) => {
    const newList: List = {
      listId: Date.now(), 
      userId: "local-user",
      name,
      description,
      items: [],
      dateCreated: new Date().toLocaleDateString(),
    };

    setUserLists((prev) => [...prev, newList]);
    return newList.listId;
  };

    const addAnimeToList = (listId: number, animeId: number) => {
    setUserLists((prev) =>
      prev.map((list) =>
        list.listId === listId
          ? {
              ...list,
              items: list.items.includes(animeId)
                ? list.items
                : [...list.items, animeId],
            }
          : list
      )
    );
  };

  return (
    <UserListsContext.Provider value={{ userLists,
        addAnimeToList,
        createList
 }}>
      {children}
    </UserListsContext.Provider>
  );
};

export const useUserLists = (): UserListsContextType => {
  const context = useContext(UserListsContext);
  if (!context) {
    throw new Error("useUserLists must be used within a UserListsProvider");
  }
  return context;
};    
