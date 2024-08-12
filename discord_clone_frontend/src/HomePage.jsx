import React, { useEffect } from 'react';
import { useState } from 'react';

import { makeApiRequest } from './helpers.js';
import { useAuth } from './hooks/AuthProvider';

import MainBody from './MainBody.jsx'
import LeftNavbar from './components/LeftNavbar.jsx'
import socket from './sockets/socket.js';

import './css/globals.css';
import './css/homepage.css';

const HomePage = () => {
    const [activeChatroom, setActiveChatroom] = useState(null);
    const [chatrooms, setChatrooms] = useState([]);
    const [chatroomMemberships, setChatroomMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logOut } = useAuth();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
      const fetchChatrooms = async () => { // api call
        try {
          console.log('asking for chatrooms') 
          const res = await makeApiRequest(`${backendURL}/api/chatrooms`, 'GET');
          console.log(`response is: ${JSON.stringify(res)}`);
          if (res.error) {
            alert(res.error);
            if (res.data === 'ExpiredToken') {
              alert('Please log in again')
              logOut()
            }
            return;
          }
          if (res.success) {
            const chatroomsArray = res.data.results
            // set chatroom membership
            setChatroomMemberships(chatroomsArray.map(chatroom => chatroom.id));
            // add the chatroom type
            const updatedChatroomsArray = chatroomsArray.map(element => {
              return { ...element, type: 'Chatrooms'};
            })
            setChatrooms(updatedChatroomsArray);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchChatrooms();
    }, [backendURL]);

    useEffect(() => {
      //for each chatroom:
      chatroomMemberships.forEach((chatroomId)=> {
        socket.emit('joinRoom', chatroomId);
        console.log('joining room', chatroomId);
      })

      return () => {
        //for each chatroom
        chatroomMemberships.forEach((chatroomId) => {
          socket.emit('leaveRoom', chatroomId);
          console.log('left room', chatroomId);
        })
      }
    }, [chatroomMemberships])

    useEffect(() => {
      
      socket.on('inc-message-object', (msgObj) => { //incoming to specific chatroom (joined above)

        console.log('incoming message from backend socket server');

        setChatrooms((prevChatrooms) => {
          const updatedChatrooms = prevChatrooms.map(chatroom => {
            if (chatroom.id === msgObj.chat_id) {
              console.log(`updating chatroom ${chatroom.name}`); 
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
    return (
      <div className='homepage'>
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