import React from 'react';
import { useState } from 'react';

import './css/main_body.css'
import './css/globals.css';

const MainBody = ({ activeChatroom }) => {
    const [message, setMessage] = useState("");

    return (
      <div className="main-body">
        <h4>{activeChatroom.name}</h4>
        <div className="messages">
          {activeChatroom.messages.map((message) => (
            <div key={message.id} className="message">
              <div>
                {" "}
                {
                  activeChatroom.users.find((user) => user.id === message.sender) //This is completely changing. Get messages from the db associated with this chat
                    .name
                }{" "}
              </div>
              <div> {message.message} </div>
              <div> {message.timestamp.toLocaleString()} </div>
            </div>
          ))}
        </div>
        <div className="user-input">
          <input
            name="message"
            value={message}
            placeholder="Write a message..."
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            children="Submit"
            onClick={(event) => {
              console.log(message);
            }}
          />
        </div>
      </div>
    );
}

export default MainBody;