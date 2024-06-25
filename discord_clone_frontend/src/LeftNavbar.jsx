import React, { useState } from 'react';

import './css/globals.css';
import './css/left_navbar.css';
import ChatFormModal from './modals/ChatFormModal';

const LeftNavbar = ({ chatrooms, onSelectChatroom }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    
    const openModal = () => {
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
    };


    return (
        <div className="left-navbar">
          <h3>Chatrooms</h3>
          <ul>
            {chatrooms.map((chatroom) => ( //TODO: this currently throws an error if chatroomsGet fails as chatrooms is not an array, should fix that
              <li key={chatroom.id} onClick={() => onSelectChatroom(chatroom)}>
                {chatroom.name}
              </li>
            ))}
          </ul>
          <div className='left-navbar-actions'>
            <button
              className='open-chat-form-button'
              onClick={openModal}
            >
              +
            </button>
            <ChatFormModal isOpen={isModalOpen} onRequestClose={closeModal} />
          </div>
        </div>
    );
}

export default LeftNavbar;