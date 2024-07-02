import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useURL } from './hooks/URLProvider.jsx';
import { useAuth } from './hooks/AuthProvider.jsx';

import './css/main_body.css'
import './css/globals.css';


const MainBody = ({ activeChatroom }) => {
    const [message, setMessage] = useState("");
    const { backendURL } = useURL()
    const user = useAuth()
    const messagesEndRef = useRef(null);

    const onMessageSend = async (message, activeChatroomId ) => { // api call
      // TODO:
      //        Update chatroom or otherwise provide feedback with new message in chat - websocket!
      const response = await fetch(`${backendURL}/api/message`, {
        method: 'post',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${user?.token}`
        },
        body: JSON.stringify({
          message: message,
          chatroomId: activeChatroomId
        })
      }); // TODO: need to add message type, etc in there at some point
      //console.log("\n response is: ", response)
      const res = await response.json();
      if (res.success) {
        console.log("response: ", res)
        alert('Message sent successfully');
      }
      setMessage("");
    }

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [activeChatroom.Messages]); // will scroll down when that array changes

    return (
      <div className="main-body">
        <h4>{activeChatroom.name}</h4>
        <div className="messages">
          {activeChatroom.Messages
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //ascending order
            .map((message) => (
              <div key={message.id} className="message">
                <div>
                  {" "}
                  {
                    activeChatroom.Users.find((user) => user.id === message.sender_id) //up to button seems done?
                      .email
                  }{" "}
                </div>
                <div> {message.content} </div>
                <div> {message.createdAt.toLocaleString()} </div> 
              </div>
            ))
          }
          <div ref={messagesEndRef} />
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