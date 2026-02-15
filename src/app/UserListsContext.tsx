"use client";

import React, { createContext, useEffect, useState, useContext } from "react";
import { List } from "@/types/List";

interface UserListsContextType {
  userLists: List[]; 
  addAnimeToList: (listId: number, animeId: number  ) => void; 
    createList: (name: string, description?: string) => number;
    removeAnimeFromList: (listId: number, animeId: number) => void;
    deleteList: (listId: number) => void;
}

const UserListsContext = createContext<UserListsContextType | undefined>(undefined);

export const UserListsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLists, setUserLists] = useState<List[]>([]);
  const [loaded, setLoaded] = useState(false);

    useEffect(() => {
    const saved = localStorage.getItem("userLists");
    if (saved) setUserLists(JSON.parse(saved));
    setLoaded(true);
  }, []);

    useEffect(() => {
    localStorage.setItem("userLists", JSON.stringify(userLists));
  }, [userLists, loaded]);
  
  //function to create a new list
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
  
  //function to add anime to a list
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
  //function to remove anime from a list
  const removeAnimeFromList = (listId: number, animeId: number) => {
    setUserLists((prev) =>
      prev.map((list) =>
        list.listId === listId
          ? {
              ...list,
              items: list.items.filter((id) => id !== animeId),
            }
          : list
      )
    );
  };
  
  //function to delete a list
  const deleteList = (listId: number) => {
    setUserLists((prev) => prev.filter((list) => list.listId !== listId));
  };
  
  //default lists
  const defaultLists = ["Favourites", "Watching", "Completed", "Plan to Watch"];
  
  React.useEffect(() => {
    if (!loaded) return;

    let changed = false;
    
    defaultLists.forEach((name) => {
      const exists = userLists.some((l) => l.name === name);
      
      if (!exists) {
      createList(name);
      changed = true;
    }
  });

    if (changed) {
      console.log("Default lists added to user lists.");
    }
}, [loaded]);


  return (
    <UserListsContext.Provider value={{ userLists,
        addAnimeToList,
        createList,
        removeAnimeFromList,
        deleteList
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
