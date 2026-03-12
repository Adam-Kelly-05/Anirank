import { useState } from "react";
import { ThumbsUp } from "lucide-react";

function UpvoteButton({ animeId, reviewId, userId, initial }) {
  const [count, setCount] = useState(initial);
  const [vote, setVote] = useState("none");

  const upvote = async () => {
    console.log("Sending:", { animeId, reviewId, userId });

    const res = await fetch("https://f8liivtkjh.execute-api.eu-west-1.amazonaws.com/upvote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId, reviewId, userId })
    });

    const data = await res.json();
    console.log("Upvote response:", data);

    if (data.action === "undo-upvote") {
      setVote("none");
      setCount(data.upvotes);
    } else if (data.action === "switch-down-to-up") {
      setVote("up");
      setCount(data.upvotes);
    } else if (data.action === "upvote") {
      setVote("up");
      setCount(data.upvotes);
    }
  };

  return (
    <button
      onClick={upvote}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: vote === "up" ? "blue" : "white"
      }}
    >
      <ThumbsUp
        size={20}
        color={vote === "up" ? "white" : "blue"}
        fill={vote === "up" ? "blue" : "none"}
      />
      {count}
    </button>
  );
}

export default UpvoteButton;
