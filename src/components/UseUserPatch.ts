"use client";

import { useAuth } from "react-oidc-context";

export function useUpdateUser() {
  const auth = useAuth();

  const updateUser = async (patch: {
    Bio?: string;
    ProfilePicture?: string;
    Username?: string;
  }): Promise<unknown | null> => {
    try {
      const idToken = auth.user?.id_token;

      if (!idToken) {
        console.error("useUpdateUser: Not authenticated (no id_token)");
        return null;
      }

      const res = await fetch(
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/me",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(patch),
        },
      );

      const json = res.status === 204 ? null : await res.json();

      if (!res.ok) {
        console.error("useUpdateUser: Update failed", console.log(json));
        return null;
      }

      if (json && typeof json === "object") {
        const typed = json as { user?: unknown; data?: unknown };
        return typed.user ?? typed.data ?? typed;
      }

      return json;
    } catch (e: unknown) {
      console.error("useUpdateUser: Unexpected error", e);
      return null;
    }
  };

  return { updateUser };
}
