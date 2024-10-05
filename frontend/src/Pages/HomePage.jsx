import React from "react";
import bg from "/bg.jpg";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { Button } from "flowbite-react";
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [text] = useTypewriter({
    words: [
      "convenient shopping experiences.",
      "luxury at every corner.",
      "your shopping destination.",
      "unmatched variety and convenience."
    ],
    loop: true,
    typeSpeed: 60,
    deleteSpeed: 40,
    delaySpeed: 2000,
  });

  return (
    <div>
      <img
        src={bg}
        alt=""
        className="object-cover relative opacity-55 dark:opacity-40 h-screen w-full"
      />
      <div className="flex flex-col gap-6 p-28 px-3 max-w-full mx-auto absolute inset-0 justify-center items-center">
      <h1 className='style font-bold text-9xl text-center font-mono italic'>ShopIto</h1>
        <h2 className="text-center text-md font-bold uppercase text-gray-500">
          Where Excellence Meets Every Need
        </h2>
        <h3 className="text-xl md:text-2xl font-bold text-center">
          We Create{" "}
          <span className="style">
            {text}
          </span>
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
            cursorColor="#6b7280"
          />
        </h3>
        <div className="flex justify-center">
          <Button
            className="w-[250px] rounded-tl-2xl rounded-br-2xl"
            gradientDuoTone="purpleToPink"
          >
            <Link  className="transition duration-100 ease-in-out">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
