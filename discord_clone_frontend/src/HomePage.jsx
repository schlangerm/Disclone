import React, { useEffect } from 'react';
import { useState } from 'react';
import MainBody from './MainBody.jsx'
import LeftNavbar from './LeftNavbar.jsx'
import { useAuth } from './hooks/AuthProvider';
import { useURL } from './hooks/URLProvider.jsx';

import './css/globals.css';
import './css/homepage.css';



const HomePage = () => {
    const [activeChatroom, setActiveChatroom] = useState(null);
    const [chatrooms, setChatrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuth()
    const { backendURL } = useURL()
    console.log("!! user:", user)
    //console.log("!!! email:", user.user.email)
    const email = user?.user?.email;

    useEffect(() => {
      const fetchChatrooms = async () => { // api call
        try {
          console.log('asking for chatrooms') 
          const response = await fetch(`${backendURL}/api/chatrooms`, {
            method: 'get',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer: ${user?.token}`
            }
          });
          const res = await response.json();
          console.log('response is: ', res)
          if (res.error) {
            alert(res.error);
            if (res.data === 'ExpiredToken') {
              alert("Please log in again")
              user.logOut()
            }
            return;
          }
          if (res.success) {
            const chatrooms = res.data.results
            console.log('chatrooms received: ', chatrooms)
            setChatrooms(chatrooms);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchChatrooms();
    }, [backendURL, user?.token]);

    const onSelectChatroom = async (chatroom) => { 
      // Works
      setActiveChatroom(chatroom);
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
          {loading ? (
            <p>Loading chatrooms...</p>
          ) : (
            <LeftNavbar 
              chatrooms={chatrooms}  // Works
              onSelectChatroom={onSelectChatroom} />
          )}
          {activeChatroom && <MainBody activeChatroom={activeChatroom} />}
        </div>
      </div>
    );
}

export default HomePage;