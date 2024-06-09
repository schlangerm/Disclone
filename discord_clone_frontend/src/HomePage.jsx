import React from 'react';
import { useState } from 'react';
import MainBody from './MainBody.jsx'
import LeftNavbar from './LeftNavbar.jsx'
import { useAuth } from './hooks/AuthProvider';

import './globals.css';
import './homepage.css';


const HomePage = () => {
  //TODO: get chatrooms from api
  //      import user context here for email and check auth
    const [activeChatroom, setActiveChatroom] = useState(null);
    const user = useAuth()
    //console.log("!! user:", user)
    //console.log("!!! email:", user.user.email)
    const email = user.user.email 

    const chatrooms = [
      {
        id: 1,
        name: "Love birds",
        users: [
          {
            id: 1,
            name: "Matt",
          },
          {
            id: 2,
            name: "Liza",
          },
        ],
        messages: [
          {
            id: 1,
            message: "Hii",
            sender: 1,
            chatroom: 1,
            timestamp: new Date(2024, 4, 5),
          },
          {
            id: 2,
            message: "hola",
            sender: 2,
            chatroom: 1,
            timestamp: new Date(),
          },
        ],
      },
      {
        id: 2,
        name: "M names",
        users: [
          {
            id: 1,
            name: "Matt",
          },
          {
            id: 3,
            name: "Manu",
          },
        ],
        messages: [
          {
            id: 3,
            message: "Matt is my name",
            sender: 1,
            chatroom: 2,
            timestamp: new Date(2024, 4, 4),
          },
          {
            id: 4,
            message: "Manu is my name",
            sender: 3,
            chatroom: 2,
            timestamp: new Date(2024, 4, 5),
          },
        ],
      },
    ];
    const onSelectChatroom = (chatroom) => {
      setActiveChatroom(chatroom);
    };
    console.log("homepage email received: ", email);
    return (
      <div className="homepage">
        <header className="top-header">
          <div className="user-email">{email}</div>
        </header>
        <LeftNavbar chatrooms={chatrooms} onSelectChatroom={onSelectChatroom} />
        {activeChatroom && <MainBody activeChatroom={activeChatroom} />}
      </div>
    );
}

export default HomePage;