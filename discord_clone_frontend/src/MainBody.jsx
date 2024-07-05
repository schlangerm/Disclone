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

    const onDeleteChat = async () => { // api call
      const response = await fetch(`${backendURL}/api/chat?id=${activeChatroom.id}`, {
        method: 'delete',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${user?.token}`
        }
      });
      const res = await response.json();
      console.log(`response: ${res}`);
      if (res.success) {
        alert('Chat deleted successfully');
      } else {
        alert('Failed to delete chat');
      }
    };

    const handleDeleteChat = () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this chat? Only the chat creator can delete the chat")
      if (confirmDelete) {
        onDeleteChat()
      } else {
        return;
      }
    }

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [activeChatroom.Messages]); // will scroll down when that array changes

    return (
      <div className="main-body">
        <div className="chat-header">
          <h4>{activeChatroom.name}</h4>
          <button className="delete-chat-button" onClick={handleDeleteChat}>
            Delete Chat
          </button>
        </div>
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