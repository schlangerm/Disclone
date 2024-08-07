import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./hooks/AuthProvider.jsx";
import SlidingPanel from "./SlidingPanel.jsx";
import { FaAngleDoubleDown } from "react-icons/fa";
import { IoMdArrowRoundUp } from "react-icons/io";
import Dropdown from "./components/Dropdown.jsx";

import "./css/chatroom_box.css"
import "./css/globals.css";

const ChatroomBox = ({ activeElement }) => {
    const activeChatroom = activeElement;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(activeChatroom.Messages);
    const [memberPanelOpen, setMemberPanelOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const user = useAuth()
    const messagesEndRef = useRef(null);

    const MAX_MSG_LENGTH = 1250;


    const members = activeChatroom.Users

    useEffect(() => {
      setMessages(activeChatroom.Messages);
    }, [activeChatroom])

    const toggleMemberPanel = () => {
      setMemberPanelOpen(!memberPanelOpen);
    }

    const handleEnterKey = (event) => {
      if (event.key === "Enter") {
        onMessageSend(message, activeChatroom.id);
      }
    }

    const onMessageSend = async (message, activeChatroomId ) => { // socket connection REWORK to api call
      if (message.length > MAX_MSG_LENGTH) {
        alert(`Messages must be less than ${MAX_MSG_LENGTH} characters`);
        return;
      }

      if (message.length < 1) {
        alert("Messages cannot be empty");
        return;
      }

      const response = await fetch(`${backendURL}/api/message`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${user?.token}` //get token from localstorage (pass token as rarely as possible)
        },
        body: JSON.stringify({
          content: message,
          type: "text",
          chat_id: activeChatroomId
        })
      });
      const res = await response.json();
      console.log(`response: ${res}`);
      if (res.success) {
        console.log("Message sent successfully")
      } else {
        alert("Failed to send message");
      }
      setMessage(""); // TODO implement other types of messages
    }

    const onDeleteChat = async () => { // api call
      const response = await fetch(`${backendURL}/api/chat?id=${activeChatroom.id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer: ${user?.token}` //get token from localstorage (pass token as rarely as possible)
        }
      });
      const res = await response.json();
      console.log(`response: ${res}`);
      if (res.success) {
        alert("Chat deleted successfully");
      } else {
        alert("Failed to delete chat");
      }
    };

    const handleDeleteChat = () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this chat? Only the chat creator can delete the chat")
      if (confirmDelete) {
        onDeleteChat()
      }
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]); // will scroll down when that array changes

    const toggleChatSettings = () => {
      setIsDropdownVisible(!isDropdownVisible);
    }

    return (
      <div className={`chatroom-box ${memberPanelOpen ? "shfited" : ""}`}>
        <div className="chat-header">
          <div className="chat-name-and-settings">
            <h4>{activeChatroom.name}</h4>
            <div className="dropdown-container">
              <button className="chat-settings-button" onClick={toggleChatSettings}>
                <FaAngleDoubleDown />
              </button>
              <Dropdown 
                isVisible={isDropdownVisible} 
                contentArray={[
                  <button className="delete-chat-button" onClick={handleDeleteChat}>
                    Delete Chat
                  </button>
                ]}
              />
            </div>
          </div>
          <button className="member-panel-button" onClick={toggleMemberPanel}>
            Members
          </button>
        </div>
        <div className="chat-content-container">
          <div className="chat-messages-wrapper">
            <div className="messages">
              {messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //ascending order
                .map((message, index, array) => {
                  const previousMessage = array[index - 1];
                  const showName = !previousMessage || previousMessage.sender_id !== message.sender_id;
                  return (
                    <div key={message.id} className="message">
                      {showName && (
                        <div className="sender-name">
                          {
                            (() => {
                              let user = activeChatroom.Users.find((user) => user.id === message.sender_id) 
                              return user.name ? user.name : user.email;
                            })()
                          }
                        </div>
                      )}
                      <div className="message-content"> {message.content} </div>
                      <div className="datetime"> 
                        {new Date (message.createdAt).toLocaleString("en-US", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })} </div> 
                    </div>
                  );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="user-input">
              <input
                type="text"
                name="message"
                value={message}
                placeholder="Write a message..."
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleEnterKey}
              />
              <button
                onClick={() => {
                  console.log(message);
                  onMessageSend(message, activeChatroom.id);
                }}
              >
                <IoMdArrowRoundUp />
              </button>
            </div>
          </div>
          <div className="member-panel-wrapper">
              <SlidingPanel items={members} isOpen={memberPanelOpen} />
          </div>
        </div>
      </div>
    );
};

export default ChatroomBox;