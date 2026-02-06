"use client";

import * as React from "react";
import { useAuth } from "react-oidc-context";
import type { RecommendationSection } from "@/types/RecommendationSection";

export function useUserRecommendations() {
  const auth = useAuth();
  const [error, setError] = React.useState("");
  const [sections, setSections] = React.useState<RecommendationSection[]>([]);

  const load = React.useCallback(async () => {
    const idToken = auth.user?.id_token;
    if (!idToken) {
      setError("Not authenticated (no id_token)");
      setSections([]);
      return;
    }

    setError("");

    try {
      const res = await fetch(
        "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/me/recommendations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const text = await res.text();
      if (!res.ok)
        throw new Error(`HTTP ${res.status} ${res.statusText}\n\n${text}`);

      const parsed = JSON.parse(text) as { sections?: RecommendationSection[] };
      if (!Array.isArray(parsed.sections)) {
        throw new Error("Unexpected API response shape (missing sections[])");
      }

      setSections(parsed.sections);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      setSections([]);
    }
  }, [auth.user?.id_token]);

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      setSections([]);
      setError("");
      return;
    }
    void load();
  }, [auth.isAuthenticated, load]);

  return { error, sections };
}
