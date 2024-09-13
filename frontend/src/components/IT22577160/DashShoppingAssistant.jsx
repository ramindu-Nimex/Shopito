import React from "react";
import { FcTodoList } from "react-icons/fc";
import { FaRobot } from "react-icons/fa6";
import { GrSearchAdvanced } from "react-icons/gr";
import { Link } from "react-router-dom";

export default function DashShoppingAssistant() {
  return (
    <div>
      {/* <img
        src="/orbital.png"
        alt=""
        className="object-cover relative opacity-55 dark:opacity-40 h-screen w-full hidden sm:inline"
      /> */}
      <div className="p-3 md:mx-auto flex flex-col sm:flex-row items-center ">
        <div className="flex flex-wrap gap-6 justify-center">
          <Link>
            <div className="flex flex-col p-3  dark:bg-slate-800 bg-slate-200 gap-4 md:w-96 rounded-md shadow-md w-full">
                <div className="flex justify-between">
                <div className="">
                    <h3 className="text-gray-500 text-lg uppercase font-bold">
                    ToDo List
                    </h3>
                </div>
                <FcTodoList className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
            </div>
          </Link>
          <Link to='/dashboard/chats'>
            <div className="flex flex-col p-3 dark:bg-slate-800 bg-slate-200 gap-4 md:w-96 rounded-md shadow-md w-full">
                <div className="flex justify-between">
                <div className="gap-5">
                    <h3 className="text-gray-500 text-lg uppercase font-bold">
                    ShopIBot
                    </h3>
                <FaRobot className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
                <img src="/bot.png" alt="" width={100} />
                </div>
            </div>
          </Link>
          <Link>
            <div className="flex flex-col p-3 dark:bg-slate-800 bg-slate-200 gap-4 md:w-96 rounded-md shadow-md w-full">
                <div className="flex justify-between">
                <div className="">
                    <h3 className="text-gray-500 text-lg uppercase font-bold">
                    Best Deal
                    </h3>
                </div>
                <GrSearchAdvanced className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                </div>
            </div>
          </Link>
        </div>
        <div className="">
          <img src="/bot.png" alt="" className="bot" />
        </div>
      </div>
    </div>
  );
}
