import React, { useEffect, useRef } from 'react'
import "./chatPage.css";
import NewPrompt from './NewPrompt';

export default function DashboardChatRoom() {

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">Test message from AI</div>
          <div className="message user">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id
            repellat ex unde laboriosam assumenda illum commodi alias omnis,
            quas facere, quo nobis mollitia quia, officiis nostrum est voluptas
            deleniti! Libero molestias in corrupti provident perferendis iusto,
            cum voluptates ex necessitatibus voluptatibus aut, laudantium
            accusamus ipsam eaque minima sapiente quia molestiae.
          </div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from AI</div>
          <div className="message user">Test message from user</div>
          <NewPrompt />
        </div>
      </div>
    </div>
  )
}
