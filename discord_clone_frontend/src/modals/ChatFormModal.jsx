import { useState } from "react";
import Modal from 'react-modal';
import '../css/chat_form_modal.css';

const ChatFormModal = ({ isOpen, onRequestClose }) => { //TODO: add friends-list capability so that we can easily select those we want in the chat, and prevent being added by a random person 
    const [chatName, setChatName] = useState('');
    const [addedUsers, setAddedUsers] = useState(['']);

    const handleAddedUsersChange = (index, event) => {
        const newAddedUsers = [...addedUsers];
        newAddedUsers[index] = event.target.value;
        setAddedUsers(newAddedUsers);

        if (index === addedUsers.length - 1 && event.target.value !== '') {
            setAddedUsers([...addedUsers, '']);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const submittedAddedUsers = addedUsers.filter(addedUser => addedUser.trim() !== '');
        // TODO submit logic here
        console.log("Chat name: ", chatName);
        console.log("Added Users: ", addedUsers);
        
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Chat Form Modal"
            className="modal-background"
        >
            <div className="modal-container">
                <div className="title">
                    <h2>Add a new Chat</h2>
                </div>
                <div className="body">
                    <label>
                        Chat Name:{" "}
                        <input
                            name="chatName"
                            placeholder="Enter name of your chat..."
                            value={chatName}
                            onChange={(event) => setChatName(event.target.value)}
                        />
                    </label>
                    <label>
                        Add Users to Chat:{" "}
                    </label>
                    {addedUsers.map((addedUser, index) => (
                        <input
                            key={index}
                            name={`addedUser-${index}`}
                            placeholder="Enter a friend's email..."
                            value={addedUser}
                            onChange={(event) => handleAddedUsersChange(index, event)}
                        />
                    ))}
                </div>
                <div className="footer">
                    <button onClick={onRequestClose}> Cancel </button>
                    <button onClick={handleSubmit}> Add Chat </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatFormModal