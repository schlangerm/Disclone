import React, { useEffect } from 'react';
import { useState } from 'react';
import MainBody from './MainBody.jsx'
import LeftNavbar from './LeftNavbar.jsx'
import { useAuth } from './hooks/AuthProvider';
import socket from './sockets/socket.js';

import './css/globals.css';
import './css/homepage.css';

 
const HomePage = () => {
    const [activeChatroom, setActiveChatroom] = useState(null);
    const [chatrooms, setChatrooms] = useState([]);
    const [chatroomMemberships, setChatroomMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuth();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    console.log("!! user:", user);
    //console.log("!!! email:", user.email)
    const email = user?.email;

    useEffect(() => {
      const fetchChatrooms = async () => { // api call
        try {
          console.log("asking for chatrooms") 
          const response = await fetch(`${backendURL}/api/chatrooms`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer: ${user?.token}`
            }
          });
          const res = await response.json();
          console.log("response is: ", res)
          if (res.error) {
            alert(res.error);
            if (res.data === "ExpiredToken") {
              alert("Please log in again")
              user.logOut()
            }
            return;
          }
          if (res.success) {
            const chatroomsArray = res.data.results
            //console.log("chatrooms received: ", chatroomsArray)
            // set chatroom membership
            setChatroomMemberships(chatroomsArray.map(chatroom => chatroom.id));
            // add the chatroom type
            const updatedChatroomsArray = chatroomsArray.map(element => {
              return { ...element, type: "Chatrooms"};
            })
            //console.log("chatrooms updated: ", updatedChatroomsArray)
            setChatrooms(updatedChatroomsArray);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchChatrooms();
    }, [backendURL, user?.token]);

    
    useEffect(() => { //This leaves the room and rejoins every time a message is sent from user
      //for each chatroom:
      chatroomMemberships.forEach((chatroomId)=> {
        socket.emit("joinRoom", chatroomId);
        console.log("joining room", chatroomId);
      })

      return () => {
        //for each chatroom
        chatroomMemberships.forEach((chatroomId) => {
          socket.emit("leaveRoom", chatroomId);
          console.log("left room", chatroomId);
        })
      }
    }, [chatroomMemberships])

    useEffect(() => {
      
      socket.on('inc-message-object', (msgObj) => { //sends to specific chatroom

        console.log("incoming message from backend socket server");

        setChatrooms((prevChatrooms) => {
          const updatedChatrooms = prevChatrooms.map(chatroom => {
            if (chatroom.id === msgObj.chat_id) {
              console.log("updating chatroom", chatroom.name); 
              return {
                ...chatroom, 
                Messages: [...chatroom.Messages, msgObj]
              };
            } else {
              return chatroom;
            }
          });

          if (activeChatroom && activeChatroom.id === msgObj.chat_id) {
            setActiveChatroom(updatedChatrooms.find(chatroom => chatroom.id === msgObj.chat_id));
          }

          return updatedChatrooms;
        });
      });

      socket.on('message-error', (data) => {
        alert(data.error);
      });

      return () => {
        socket.off('inc-message-object');
        socket.off('message-error');
        
      };
    }, [activeChatroom]) // POTENTIAL ISSUE: activeChatroom dependency for socket listeners?


    const onSelectChatroom = async (chatroom) => { 
      setActiveChatroom(chatroom);
    };

    console.log("homepage email received: ", email);
    return (
      <div className="homepage">
        {loading ? (
          <p>Loading chatrooms...</p>
        ) : (
          <LeftNavbar 
            contentArray={chatrooms}  
            onSelectElement={onSelectChatroom} />
        )}
        {activeChatroom && <MainBody activeElement={activeChatroom} />}
      </div>
    );
}

export default HomePage;