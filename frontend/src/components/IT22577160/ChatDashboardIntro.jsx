import React from "react";
import "./chatDashboardIntro.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ChatDashboardIntro() {
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    await fetch("/api/chat/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, userId: currentUser._id }),
    });
  };

  return (
    <div className="dashboardPage">
      {/* <div className="texts">
        <div className="logo text-center">
          <Link
            to="/"
            className="self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
              Shop
            </span>
            Ito
          </Link>
          <h1>ShopI Bot</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Create a New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Help me with my Code</span>
          </div>
        </div>
      </div> */}
      <div className="formContainer mx-[500px]">
        <form onSubmit={handleSubmit} className="fixed bottom-0">
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
}
