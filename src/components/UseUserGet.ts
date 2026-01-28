"use client";

import { User } from "@/types/User";
import * as React from "react";

export function useGetUser(userId?: string | number) {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    async function fetchUser() {
      if (!userId) {
        setUser(undefined);
        return;
      }

      try {
        const response = await fetch(
          `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/${userId}`,
        );
        if (!response.ok) {
          setUser(undefined);
          return;
        }
        const raw = await response.json();
        setUser(raw?.data ?? raw);
      } catch {
        setUser(undefined);
      }
    }
    fetchUser();
  }, [userId]);

  return user;
}
