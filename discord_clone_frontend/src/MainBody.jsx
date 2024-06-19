import React from 'react';
import { useState } from 'react';

import './css/main_body.css'
import './css/globals.css';

const MainBody = ({ activeChatroom }) => {
    const [message, setMessage] = useState("");

    const onMessageSend = async (message, activeChatroomId ) => {
      const response = await fetch(`${backendURL}/api/message`, {
        method: 'put',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          chatroomId: activeChatroomId
        })
      });

      if (response.success) {
        const res = await response.json();
        //update chatroom maybe? talk through it when return
      }
    }

    return (
      <div className="main-body">
        <h4>{activeChatroom.name}</h4>
        <div className="messages">
          {activeChatroom.messages.map((message) => (
            <div key={message.id} className="message">
              <div>
                {" "}
                {
                  activeChatroom.users.find((user) => user.id === message.sender_id) //up to button seems done?
                    .email
                }{" "}
              </div>
              <div> {message.content} </div>
              <div> {message.createdAt.toLocaleString()} </div> 
            </div>
          ))}
        </div>
        <div className="user-input">
          <input
            name="message"
            value={message}
            placeholder="Write a message..."
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            children="Submit"
            onClick={() => {
              console.log(message);
              onMessageSend(message, activeChatroom.id);
            }}
          />
        </div>
      </div>
    );
}

export default MainBody;