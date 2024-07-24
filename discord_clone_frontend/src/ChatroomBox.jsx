import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './hooks/AuthProvider.jsx';

import './css/chatroom_box.css'
import './css/globals.css';
import SlidingPanel from './SlidingPanel.jsx';
import socket from './sockets/socket.js';

const ChatroomBox = ({ activeElement }) => {
    const activeChatroom = activeElement;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(activeChatroom.Messages);
    const [memberPanelOpen, setMemberPanelOpen] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const user = useAuth()
    const messagesEndRef = useRef(null);

    const MAX_MSG_LENGTH = 1250;

    const members = activeChatroom.Users

    // on component mount
    useEffect(() => {

      socket.on('inc-message-object', (msgObj) => {
        setMessages((prevMsgs) => [...prevMsgs, msgObj]);
      });

      socket.on('message-error', (data) => {
        alert(data.error);
      })

      return () => {
        // on component dismount
        socket.off('inc-message-object');
        socket.off('message-error');
      };
    }, []); 

    // When chatroom changes: 
    useEffect(() => {
      if (activeChatroom && activeChatroom.id) {
        socket.emit('joinRoom', activeChatroom.id)
        console.log('Join room request sent');

        setMessages(activeChatroom.Messages);
        
        return () => {
          // on component dismount
          socket.emit('leaveRoom', activeChatroom.id);
        };
      }
    }, [activeChatroom]);

    const toggleMemberPanel = () => {
      setMemberPanelOpen(!memberPanelOpen);
    }

    const onMessageSend = async (message, activeChatroomId ) => { // socket connection
      if (message.length > MAX_MSG_LENGTH) {
        alert(`Messages must be less than ${MAX_MSG_LENGTH} characters`)
      }
      const msgObj = {
        content: message,
        type: 'text', 
        sender_id: user.id,
        chat_id: activeChatroomId
      }
      console.log(msgObj);
      socket.emit('sent-message-object', { msgObj, to: activeChatroomId });
      setMessage(""); // TODO implement other types of messages
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
      }
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]); // will scroll down when that array changes

    return (
      <div className={`chatroom-box ${memberPanelOpen ? 'shfited' : ''}`}>
        <div className="chat-header">
          <h4>{activeChatroom.name}</h4>
          <button className="delete-chat-button" onClick={handleDeleteChat}>
            Delete Chat
          </button>
          <button className="member-panel-button" onClick={toggleMemberPanel}>
            Members
          </button>
        </div>
        <div className='chat-content-container'>
          <div className='chat-messages-wrapper'>
            <div className="messages">
              {messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //ascending order
                .map((message, index, array) => {
                  const previousMessage = array[index - 1];
                  const showName = !previousMessage || previousMessage.sender_id !== message.sender_id;
                  return (
                    <div key={message.id} className="message">
                      {showName && (
                        <div className='sender-name'>
                          {
                            (() => {
                              let user = activeChatroom.Users.find((user) => user.id === message.sender_id) 
                              return user.name ? user.name : user.email;
                            })()
                          }
                        </div>
                      )}
                      <div> {message.content} </div>
                      <div> {message.createdAt.toLocaleString()} </div> 
                    </div>
                  );
              })}
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
          <div className='member-panel-wrapper'>
              <SlidingPanel items={members} isOpen={memberPanelOpen} />
          </div>
        </div>
      </div>
    );
};

export default ChatroomBox;