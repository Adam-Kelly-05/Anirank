"use client";

import { useAuth } from "react-oidc-context";

type UpdateUserPayload = {
  Bio?: string;
  ProfilePicture?: string | null;
  Username?: string;
};

/**
 * Update a user record. If a userId is provided, uses the public PUT endpoint.
 * Otherwise, falls back to the authenticated /user/me PATCH using the id_token.
 */
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
      const endpoint = userId
        ? `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/${userId}`
        : "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/me";

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
