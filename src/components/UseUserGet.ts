"use client";

import { User } from "@/types/User";
import * as React from "react";

// Base API URL; prefers env override for flexibility across envs.
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod";

export function useGetUser(userId?: string | number): {
  user?: User;
  loading: boolean;
  error?: string;
  refetch: () => Promise<void>;
} {
  const [user, setUser] = React.useState<User>();
  const [loading, setLoading] = React.useState<boolean>(!!userId);
  const [error, setError] = React.useState<string>();

  const fetchUser = React.useCallback(async () => {
    if (!userId) {
      setUser(undefined);
      setLoading(false);
      setError("Missing user id");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(`${API_BASE}/user/${userId}`);
      if (!response.ok) {
        setUser(undefined);
        setError("Unable to load user details.");
        return;
      }
      const raw = await response.json();
      setUser(raw?.data ?? raw);
    } catch {
      setUser(undefined);
      setError("Unable to load user details.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
