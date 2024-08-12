import React, { useEffect, useRef, useState } from "react";
import { makeApiRequest, reloadPage } from "./helpers.js";

import SlidingPanel from "./SlidingPanel.jsx";
import RenameChatModal from "./modals/RenameChatModal.jsx";
import Dropdown from "./components/Dropdown.jsx";

import { FaAngleDoubleDown } from "react-icons/fa";
import { IoMdArrowRoundUp } from "react-icons/io";

import "./css/chatroom_box.css"
import "./css/globals.css";

const ChatroomBox = ({ activeElement }) => {
    const activeChatroom = activeElement;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(activeChatroom.Messages);
    const [memberPanelOpen, setMemberPanelOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isRenameModalVisible, setRenameModalVisible] = useState(false);
    const messagesEndRef = useRef(null);

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("AuthToken");

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

    const onMessageSend = async (message, activeChatroomId ) => {
      if (message.length > MAX_MSG_LENGTH) {
        alert(`Messages must be less than ${MAX_MSG_LENGTH} characters`);
        return;
      }

      if (message.length < 1) {
        alert("Messages cannot be empty");
        return;
      }

      const res = await makeApiRequest(`${backendURL}/api/message`, 'POST', {
        content: message,
        type: "text",
        chat_id: activeChatroomId
      });
      console.log(`response: ${JSON.stringify(res)}`);
      if (res.success) {
        console.log("Message sent successfully")
      } else {
        alert("Failed to send message");
      }
      setMessage(""); // TODO implement other types of messages
    }

    const onDeleteChat = async () => {
      const res = await makeApiRequest(`${backendURL}/api/chat?id=${activeChatroom.id}`, 'DELETE');
      console.log(`response: ${JSON.stringify(res)}`);
      if (res.success) {
        alert("Chat deleted successfully");
        reloadPage();
      } else {
        alert("Failed to delete chat");
      }
    };

    const handleDeleteChat = () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this chat? Only the chat creator can delete the chat")
      if (confirmDelete) {
        onDeleteChat();
      }
    };

    const openRenameChatModal = () => {
      setRenameModalVisible(true);
    };

    const onRenameChat = async (newName) => { //api call 
      const res = await makeApiRequest(`${backendURL}/api/chat?id=${activeChatroom.id}`, 'PUT', {
        newName: newName
      });
      if (res.success) {
        alert("Chat renamed successfully");
        reloadPage();
      } else {
        alert("Failed to rename chat");
      }
    }

    const onLeaveChat = async () => {
      const res = await makeApiRequest(`${backendURL}/api/chat/leave?id=${activeChatroom.id}`, 'DELETE');
      console.log(`response: ${JSON.stringify(res)}`);
      if (res.success) {
        alert("Chat left successfully");
        reloadPage();
      } else {
        if (res.data === "Owner") {
          alert("Failed to leave chat - Owners cannot leave their chats; but may delete their chats");
        } else {
          alert("Failed to leave chat");
        }
      }
    };

    const handleLeaveChat = () => {
      const confirmLeave = window.confirm("Are you sure you want to leave this chat? You will not be able to view this chat anymore")
      if (confirmLeave) {
        onLeaveChat();
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
                contentArray={
                  activeChatroom.User_Chat && activeChatroom.User_Chat.is_owner ? ([
                    <button className="delete-chat-button" onClick={handleDeleteChat}>
                      Delete Chat
                    </button>,
                    <button className="rename-chat-button" onClick={openRenameChatModal}>
                      Rename Chat
                    </button>
                  ]) : ([
                    <button className="leave-chat-button" onClick={handleLeaveChat}>
                      Leave Chat
                    </button>
                  ])
                }
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
                              if (!user) {
                                return "[Deleted User]";
                              }
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
                autoComplete="off"
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
        <RenameChatModal
          isVisible={isRenameModalVisible}
          onClose={() => setRenameModalVisible(false)}
          onSubmit={onRenameChat}
        />
      </div>
    );
};

export default ChatroomBox;