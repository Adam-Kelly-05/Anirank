import { useState } from "react";
import { ThumbsDown } from "lucide-react";

function DownvoteButton({ animeId, reviewId, userId, initial }) {
  const [count, setCount] = useState(initial);
  const [vote, setVote] = useState("none");

  const downvote = async () => {
    console.log("Sending:", { animeId, reviewId, userId });

    const res = await fetch("https://cja8opa5k1.execute-api.eu-west-1.amazonaws.com/downvote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId, reviewId, userId }),
    });

    const data = await res.json();
    console.log("Downvote response:", data);

    if (data.action === "undo-downvote") {
      setVote("none");
      setCount(data.downvotes);
    } else if (data.action === "switch-up-to-down") {
      setVote("down");
      setCount(data.downvotes);
    } else if (data.action === "downvote") {
      setVote("down");
      setCount(data.downvotes);
    }
  };

  return (
    <button
      onClick={downvote}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: vote === "down" ? "red" : "white",
      }}
    >
      <ThumbsDown
        size={20}
        color={vote === "down" ? "white" : "red"}
        fill={vote === "down" ? "red" : "none"}
      />
      {count}
    </button>
  );
}

export default DownvoteButton;
