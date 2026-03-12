import { useState } from "react";
import { Flag } from "lucide-react";

function FlagButton({ reviewId, animeId, userId }) {
  const [reported, setReported] = useState(false);
  const [loading, setLoading] = useState(false);

  const reportReview = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("https://ql8om3wyba.execute-api.eu-west-1.amazonaws.com/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          animeId,
          userId,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setReported(data.reported ?? true);
      } else if (res.status === 409) {
        setReported(true);
        alert("You already reported this review.");
      } else {
        alert("Error reporting review.");
      }
    } catch (err) {
      console.error("Report error:", err);
      alert("Network error.");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={reportReview}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        cursor: reported ? "default" : "pointer",
        color: reported ? "red" : "white",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <Flag size={20} />
      {reported ? " " : ""}
    </button>
  );
}

export default FlagButton;
