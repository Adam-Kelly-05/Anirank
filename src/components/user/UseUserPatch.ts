"use client";

import { useAuth } from "react-oidc-context";

const API_BASE = "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod";

type UpdateUserPayload = {
  Bio?: string;
  ProfilePicture?: string | null;
  Username?: string;
};

export function useUpdateUser() {
  const auth = useAuth();

  const updateUser = async ({
    userId,
    payload,
  }: {
    userId?: string;
    payload: UpdateUserPayload;
  }): Promise<boolean> => {
    try {
      const endpoint = userId ? `${API_BASE}/user/${userId}` : `${API_BASE}/user/me`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (!userId) {
        const idToken = auth.user?.id_token;
        if (!idToken) {
          console.error("useUpdateUser: Missing id_token for authenticated update");
          return false;
        }
        headers.Authorization = `Bearer ${idToken}`;
      }

      const method = userId ? "PUT" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("useUpdateUser: Update failed", text);
        return false;
      }

      return true;
    } catch (e: unknown) {
      console.error("useUpdateUser: Unexpected error", e);
      return false;
    }
  };

  return { updateUser };
}
