import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import soundOn from "/soundon.png";
import soundOff from "/soundoff.png";
import bot from "/bot.mp3";

export default function Homepage() {
  const [typingStatus, setTypingStatus] = useState("human1");
  const audioRef = useRef(new Audio(bot));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1 className="ml-6 font-semibold">ShopI Bot</h1>
        <h2 className="text-2xl font-semibold">Supercharge your creativity and productivity</h2>
        <h3 className="text-xs font-medium">
          Meet Shopito Bot, your personal shopping genie! With a quick chat, it
          curates the perfect picks tailored to your style, budget, and
          preferences.
        </h3>
        <Link to="/dashboard/chats" className="mt-5">
          <div className="flex flex-col p-3 dark:bg-slate-800 bg-slate-200 gap-4 md:w-96 rounded-md shadow-md w-full">
            <div className="flex justify-between">
              <div className="gap-5">
                <h3 className="text-gray-500 text-lg uppercase font-bold">
                  ShopIBot
                </h3>
                <FaRobot className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
              </div>
              <img src="/bot.png" alt="" width={100} />
            </div>
          </div>
        </Link>
      </div>
      <div className="right mt-20">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat dark:bg-[#2c2937] bg-slate-200">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "bot.png"
              }
              alt=""
            />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Human: Shop smarter, with personalized picks",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot: your satisfaction is our priority.",
                2000,
                () => {
                  setTypingStatus("human2");
                },
                "Human2: one conversation at a time",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot: Discover your perfect style",
                2000,
                () => {
                  setTypingStatus("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2">
        <img
          src={!isPlayingMusic ? soundOff : soundOn}
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className="w-10 h-10 cursor-pointer object-contain"
        />
      </div>
    </div>
  );
}
