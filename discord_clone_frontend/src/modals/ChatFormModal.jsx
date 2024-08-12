import { useState } from 'react';
import Modal from 'react-modal';

import { makeApiRequest, reloadPage } from '../helpers';

import '../css/chat_form_modal.css';

const ChatFormModal = ({ isOpen, onRequestClose }) => { //TODO: add friends-list capability so that we can easily select those we want in the chat, and prevent being added by a random person 
    const [chatName, setChatName] = useState('');
    const [addedUsers, setAddedUsers] = useState(['']);
    const [initialMessage, setInitialMessage] = useState(['']);
    const backendURL = import.meta.env.VITE_BACKEND_URL

    const handleAddedUsersChange = (index, event) => {
        const newAddedUsers = [...addedUsers];
        const currentValue = event.target.value;

        newAddedUsers[index] = currentValue;

        setAddedUsers(newAddedUsers);
    };

    const handleInputBlur = (index) => {

        if (index === addedUsers.length - 1 && addedUsers[index].trim() !== '') {
            setAddedUsers([...addedUsers, '']);
        }
    };

    const onChatSubmit = async (chatName, submittedAddedUsers, initialMessage) => { //api call
        // name in query, user array, initial message obj w/ content and type

        const res = await makeApiRequest(`${backendURL}/api/chat?name=${chatName}`, 'POST', {
            userArray: submittedAddedUsers,
            initialMessage: {
                content: initialMessage,
                type: 'text'
            }
        });
        if (res.success) {
            console.log(`response is: ${JSON.stringify(res)}`);
            alert('Chat submitted successfully');
            reloadPage();
        } else {
            console.log(`Error: ${res.error}`);
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const submittedAddedUsers = addedUsers.filter(addedUser => addedUser.trim() !== '');
        /*
        console.log('Chat name: ', chatName); //string
        console.log('Added Users: ', addedUsers); //array without owner
        console.log('submitted added users object: ', submittedAddedUsers);
        console.log('initial message: ', initialMessage); //string
        */
        if (!chatName) {
            alert('Chat must have a name')
        }
        if (chatName && submittedAddedUsers && initialMessage) {
            onChatSubmit(chatName, submittedAddedUsers, initialMessage)
            setChatName('');
            setAddedUsers(['']); 
            onRequestClose();
        } else if (!chatName) {
            alert('Chat must have a name')
        } else if (!submittedAddedUsers) {
            alert('Chat must have at least two users, including the creator (you)')
        } else if (!initialMessage) {
            alert('Chat must have an initial message')
        }
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel='Chat Form Modal'
            className='modal-background'
            appElement={document.getElementById('root')}
        >
            <div className='modal-container'>
                <div className='title'>
                    <h2>Add a new Chat</h2>
                </div>
                <div className='body'>
                    <label>
                        Chat Name:{' '}
                        <input
                            name='chatName'
                            placeholder='Enter name of your chat...'
                            value={chatName}
                            onChange={(event) => setChatName(event.target.value)}
                            autoComplete='off'
                        />
                    </label>
                    <label>
                        Add Users to Chat:{' '}
                        {addedUsers.map((addedUser, index) => (
                            <input
                                key={index}
                                name={`addedUser-${index}`}
                                placeholder="Enter a friend's email..."
                                value={addedUser}
                                onChange={(event) => handleAddedUsersChange(index, event)}
                                onBlur={() => handleInputBlur(index)}
                                autoComplete='off'
                            />
                        ))}
                    </label>
                    <label>
                        Type an initial message:{' '}
                        <input
                            name='intialMessage'
                            placeholder="Your chat's first message..."
                            value ={initialMessage}
                            onChange={(event) => setInitialMessage(event.target.value)}
                            autoComplete='off'
                        />
                    </label>
                </div>
                <div className='footer'>
                    <button onClick={onRequestClose}> Cancel </button>
                    <button onClick={handleSubmit}> Add Chat </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatFormModal