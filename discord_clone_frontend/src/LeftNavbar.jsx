import React from 'react';

import './globals.css';
import './left_navbar.css';

const LeftNavbar = ({ chatrooms, onSelectChatroom }) => {
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
        </div>
    );
}

export default LeftNavbar;