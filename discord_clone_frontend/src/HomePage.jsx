import React, { useContext } from 'react';
import { useState } from 'react';
import MainBody from './MainBody.jsx'
import LeftNavbar from './LeftNavbar.jsx'
import { useAuth } from './hooks/AuthProvider';

import './css/globals.css';
import './css/homepage.css';
import { useURL } from './hooks/URLProvider.jsx';


const HomePage = () => {
  //TODO: get chatrooms from api
  //      import user context here for email and check auth DONE
    const [activeChatroom, setActiveChatroom] = useState(null);
    const user = useAuth()
    const { backendURL } = useURL()
    console.log("!! user:", user)
    //console.log("!!! email:", user.user.email)
    const email = user?.user?.email;


    const chatroomsGet = async () => { // api call TODO: set auth header
      try {
        console.log('asking for chatrooms') 
        const response = await fetch(`${backendURL}/api/chatrooms`, {
          method: 'get',
          headers: {
            "Content-Type": "application/json",
          }
        });
        const res = await response.json();
        console.log('response is: ', res)
        if (res.error) {
          alert(res.error);
          return;
        }
        if (res.success) {
          const chatrooms = res.data.results
          console.log('chatrooms received: ', chatrooms)
          return chatrooms
        }
      } catch (err) {
        console.error(err);
      }
    }

/*
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
    */

    const onSelectChatroom = async (chatroom) => { 
      //UNTESTED
      chatroomId = chatroom.id
      console.log("fetching chatroom id=", chatroomId)
      try {
        response = await fetch(`${backendURL}/api/chat?id=${chatroomId}`, {
          method: 'get',
          headers: {
            "Content-Type" : "application/json",
          },
        });

        if (response.success) {
          const chat = await response.json();
          console.log("Fetched chat: ", chat);
        }
      } catch (error) {
        console.error(error)
      }
      setActiveChatroom(chat);
    };

    console.log("homepage email received: ", email);
    return (
      <div className="homepage">
        <header className="top-header">
          <div className="user-email">{email}</div>
          <div className='logout-button'>
            <button
              children="Logout"
              onClick={(event) => {
                user.logOut()
              }}/>
          </div>
        </header>
        <div className='main-content-wrapper'>
          <LeftNavbar 
            chatrooms={chatroomsGet()}  //UNTESTED - need to finish chat post, look in chat.router.js on backend
            onSelectChatroom={onSelectChatroom} />
          {activeChatroom && <MainBody activeChatroom={activeChatroom} />}
        </div>
      </div>
    );
}

export default HomePage;