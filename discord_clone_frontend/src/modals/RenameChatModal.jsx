import React, { useState } from 'react';
import '../css/rename_chat_modal.css';

const RenameChatModal = ({ isVisible, onClose, onSubmit }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = () => {
    onSubmit(newName);
    setNewName('');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h4>Rename Chat</h4>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new chat name"
          autoComplete="off"
        />
        <button onClick={handleSubmit}>Rename</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default RenameChatModal;