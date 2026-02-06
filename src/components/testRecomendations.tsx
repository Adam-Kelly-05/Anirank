import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

type RecItem = {
  animeId: number;
  score: number;
  title_english: string;
  title_japanese: string;
  image: string;
  aired: string;
  synopsis: string;
  trailer: string;
  type: string;
  genres: string[];
};

type ApiResponse = {
  items: RecItem[];
};

export function RecommendationsTester() {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [items, setItems] = useState<RecItem[]>([]);

  const load = async () => {
    setLoading(true);
    setError("");

    const idToken = auth.user?.id_token; // same as your other components
    if (!idToken) {
      setLoading(false);
      setItems([]);
      setError("Not authenticated (no id_token)");
      return;
    }

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

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}\n\n${text}`);
      }

      const json = JSON.parse(text) as ApiResponse;

      if (!json || !Array.isArray(json.items)) {
        throw new Error("Unexpected API response shape (missing items[])");
      }

      setItems(json.items);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto-load when signed in
    if (auth.isAuthenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Recommendations Tester</h3>

        <button onClick={load} disabled={loading || !auth.isAuthenticated}>
          {loading ? "Loading..." : "Reload"}
        </button>

        <span style={{ opacity: 0.75 }}>
          {auth.isAuthenticated ? `${items.length} items` : "Not signed in"}
        </span>
      </div>

      {error && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ffbdbd",
            background: "#fff2f2",
          }}
        >
          {error}
        </pre>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {items.map((x) => (
          <div
            key={x.animeId}
            style={{
              border: "1px solid #2a2a2a33",
              borderRadius: 12,
              overflow: "hidden",
              background: "white",
            }}
          >
            <div style={{ width: "100%", aspectRatio: "16/9", background: "#eee" }}>
              {x.image ? (
                <img
                  src={x.image}
                  alt={x.title_english || x.title_japanese || String(x.animeId)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>

            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>
                {x.title_english || x.title_japanese || `Anime ${x.animeId}`}
              </div>

              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                {x.type} {x.aired ? `• ${x.aired}` : ""}
              </div>

              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                score: {Number.isFinite(x.score) ? x.score.toFixed(2) : "?"}
              </div>

              {x.genres?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {x.genres.slice(0, 6).map((g) => (
                    <span
                      key={g}
                      style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 999,
                        border: "1px solid #00000022",
                        background: "#fafafa",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ) : null}

              {x.synopsis ? (
                <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13, lineHeight: 1.35 }}>
                  {x.synopsis}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
