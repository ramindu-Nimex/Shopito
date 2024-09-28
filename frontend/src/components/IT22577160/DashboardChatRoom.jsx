import React, { useEffect, useRef } from "react";
import "./chatPage.css";
import NewPrompt from "./NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

export default function DashboardChatRoom() {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/userChats/${chatId}`, {
        credentials: "include",
      });
      const result = await response.json();
      console.log(result); // Log the result
      return result;
    },
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">Test message from AI</div>
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data
            ? data?.history?.map((message, i) => (
                <>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: "300", width: "400" }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div
                    className={
                      message.role === "user" ? "message user" : "message"
                    }
                    key={i}
                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))
            : "No messages available"}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
}
