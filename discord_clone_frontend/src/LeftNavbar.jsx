import React, { useState } from 'react';
import ChatFormModal from './modals/ChatFormModal';

import './css/globals.css';
import './css/left_navbar.css';


const componentMapping = {
  Chatrooms: ChatFormModal,
  Settings: ChatFormModal, // TODO change
};

//takes an array, each element needs to have .id and .name
const LeftNavbar = ({ contentArray = [], onSelectElement }) => {
    let Component = ChatFormModal
    const [isModalOpen, setModalOpen] = useState(false);
    
    if (contentArray.length) { 
      Component = componentMapping[contentArray[0].type];
    }
    
    const openModal = () => {
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
    };


    return (
        <div className="left-navbar">
          {Array.isArray(contentArray) && contentArray.length > 0 ? (
            <>
              <h3>{contentArray[0].type}</h3>
              <ul>
                {contentArray.map((element) => ( 
                  <li key={element.id} onClick={() => onSelectElement(element)}>
                    {element.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
              <p>No content available</p>
          )}
          <div className='left-navbar-actions'>
            <Component isOpen={isModalOpen} onRequestClose={closeModal} />
            <button
              className='open-modal-button'
              onClick={openModal}
            >
              +
            </button>
          </div>
        </div>
    );
}

export default LeftNavbar;