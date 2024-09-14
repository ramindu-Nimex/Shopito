import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CustomChatDashSideBar() {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const response = await fetch("/api/chat/userChats", {
        credentials: "include",
      });
      const result = await response.json();
      console.log(result); // Log the result
      return result;
    },
  });
  return (
    <Sidebar className="fixed z-10 flex flex-col">
      <Link to="/dashboard/chats">
        <span className="font-semibold text-sm mb-3">DASHBOARD</span>
      </Link>
      <div className="pt-5">
      <Link to="/dashboard/chats">Create a new Chat</Link>
      </div>
      <hr className="border-none h-[2px] bg-slate-200 opacity-10 rounded-md my-5" />
      <span className="font-semibold text-sm mb-3">RECENT CHATS</span>
      <div className="flex flex-col overflow-scroll my-5 gap-2">
        {isPending
        ? "Loading..."
        : error
        ? "Something went wrong!"
        : Array.isArray(data)
        ? data.map((chat) => (
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
              {chat.title}
            </Link>
          ))
        : "No chats available"} {/* Handle non-array data */}
      </div>
      <hr className="border-none h-[2px] bg-slate-200 opacity-10 rounded-md my-5" />
      <div className="mt-auto flex items-center gap-3 flex-col text-xs">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-xs sm:text-xl font-bold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
            Shop
          </span>
          Ito
        </Link>
        <div className="flex flex-col justify-center text-center">
          <span>Upgrade to ShopIBot</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </Sidebar>
  );
}
