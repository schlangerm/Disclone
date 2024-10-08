import React, { useState } from 'react';

import { useAuth } from '../hooks/AuthProvider';
import { makeApiRequest, reloadPage } from '../helpers';

const ProfileSettings = () => {
    const [newName, setNewName] = useState('')
    const { logOut } = useAuth()
    const backendURL = import.meta.env.VITE_BACKEND_URL
    
    const handleNameChange = async () => { // api call
        let trimmedName = newName.trim();
        if (!trimmedName) {
            alert('Please enter a new display name');
            return;
        }
        const res = await makeApiRequest(`${backendURL}/api/user/displayname`, 'PUT', {
            newName: trimmedName
        });
        console.log(`response: ${JSON.stringify(res)}`);
        if (res.success) {
            alert('Your display name has been updated.')
            reloadPage();
        } else {
            alert('Your display name could not be updated.') // TODO: inform users when unique constraint violated
        }
    }

    const onDeleteUser = async () => { // api call

        const res = await makeApiRequest(`${backendURL}/api/user/delete`, 'DELETE');
       
        console.log(`response: ${JSON.stringify(res)}`);
        
        if (res.success) {
            alert('Your account has been deleted. This cannot be undone.');
            logOut();
        } else {
            alert('Failed to delete your account. Contact support.');
        }
    }

    const handleDeleteUser = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This cannot be undone');
        if (confirmDelete) {
            onDeleteUser()
        }
    }

    return(
        <div className='profile-settings-content'>
            <div className='update-display-name-wrapper'>
                <input 
                    type='text'
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder='Enter new display name'
                />
                <button className='update-display-name-button' onClick={handleNameChange}>
                    Update Display Name
                </button>
            </div>
            <button className='delete-user-button' onClick={handleDeleteUser}>
                Delete Your Account
            </button>
        </div>
    );
};

export default ProfileSettings;