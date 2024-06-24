import React, { useState } from 'react';

import './css/globals.css';
import './css/left_navbar.css';

const LeftNavbar = ({ chatrooms, onSelectChatroom }) => {
    const [isChatFormVisible, setChatFormVisible] = useState(false);

    const toggleChatFormVisibility = () => {
      setChatFormVisible(!isChatFormVisible);
    };


    return (
        <div className="left-navbar">
          <h3>Chatrooms</h3>
          <ul>
            {chatrooms.map((chatroom) => (
              <li key={chatroom.id} onClick={() => onSelectChatroom(chatroom)}>
                {chatroom.name}
              </li>
            ))}
          </ul>
          <div className='left-navbar-actions'>
            <button
              onClick={toggleChatFormVisibility}
            >
              +
            </button>
          </div>
        </div>
    );
}

export default LeftNavbar;