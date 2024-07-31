import React, { useEffect } from 'react';
import { useState } from 'react';
import MainBody from './MainBody.jsx'
import LeftNavbar from './LeftNavbar.jsx'
import { useAuth } from './hooks/AuthProvider';

import './css/globals.css';
import './css/homepage.css';

 
const HomePage = () => {
    const [activeChatroom, setActiveChatroom] = useState(null);
    const [chatrooms, setChatrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuth();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    console.log("!! user:", user);
    //console.log("!!! email:", user.email)
    const email = user?.email;

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
            const chatroomsArray = res.data.results
            console.log('chatrooms received: ', chatroomsArray)
            // add the chatroom type
            const updatedChatroomsArray = chatroomsArray.map(element => {
              return { ...element, type: "Chatrooms"};
            })
            console.log('chatrooms updated: ', updatedChatroomsArray)
            setChatrooms(updatedChatroomsArray);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchChatrooms();
    }, [backendURL, user?.token]);

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