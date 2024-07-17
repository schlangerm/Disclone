import React, { useEffect, useRef, useState } from 'react';
import { useURL } from './hooks/URLProvider.jsx';
import { useAuth } from './hooks/AuthProvider.jsx';
import io from 'socket.io-client';

import './css/chatroom_box.css'
import './css/globals.css';


const ChatroomBox = ({ activeElement }) => {
    const activeChatroom = activeElement;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(activeChatroom.Messages);
    const { backendURL } = useURL()
    const user = useAuth()
    const messagesEndRef = useRef(null);
    const socket = useRef(null);

    // when URL or user token changes
    useEffect(() => {

      socket.current = io(backendURL);

      socket.current.on('connect', () => {
        console.log('Connected to server, may not be authenticated');
        socket.current.emit('authenticate', {token: user.token})
      });

      socket.current.on('inc-message-object', (msgObj) => {
        setMessages((prevMsgs) => [...prevMsgs, msgObj]);
      });

      return () => {
        // on component unmount
        socket.current.off('connect');
        socket.current.off('inc-message-object');
        socket.current.disconnect();
      };
    }, [backendURL, user.token]);

  // When chatroom changes: 
  useEffect(() => {
    if (activeChatroom && activeChatroom.id) {
      socket.current.emit('joinRoom', activeChatroom.id)

      setMessages(activeChatroom.Messages);
      
      return () => {
        // on component unmount
        socket.current.emit('leaveRoom', activeChatroom.id);
      };
    }
  }, [activeChatroom]);



    const onMessageSend = async (message, activeChatroomId ) => { // socket connection
      const msgObj = {
        content: message,
        type: 'text', 
        sender_id: user.id,
        chat_id: activeChatroomId
      }
      console.log(msgObj);
      socket.current.emit('sent-message-object', { msgObj, to: activeChatroomId });
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
      <div className="chatroom-box">
        <div className="chat-header">
          <h4>{activeChatroom.name}</h4>
          <button className="delete-chat-button" onClick={handleDeleteChat}>
            Delete Chat
          </button>
        </div>
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
    );
};

export default ChatroomBox;