import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CustomChatDashSideBar() {
  return (
    <Sidebar className="fixed z-10">
      <span className="font-semibold text-sm mb-3">DASHBOARD</span>
      <hr className="border-none h-[2px] bg-slate-200 opacity-10 rounded-md my-5" />
      <span className="font-semibold text-sm mb-3">RECENT CHATS</span>
      <div className="flex flex-col overflow-scroll my-5 gap-2">
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
        <Link to="/">My Chat List</Link>
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
