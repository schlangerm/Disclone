import React from 'react';
import ChatroomBox from './ChatroomBox.jsx';
import SettingsBox from './SettingsBox.jsx';


import './css/main_body.css'
import './css/globals.css';

const componentMapping = {
  Chatrooms: ChatroomBox,
  Settings: SettingsBox,
};

const MainBody = ({ activeElement }) => {
  const Component = componentMapping[activeElement?.type];
  console.log("type: ", activeElement?.type);
    return (
      <div className='main-body'>
        {Component ? (
          <Component activeElement={activeElement}/>
        ) : (
          <div> No component loaded </div>
        )}
      </div>
    );
};

export default MainBody;