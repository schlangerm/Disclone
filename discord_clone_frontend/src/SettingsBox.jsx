import React, { useState } from 'react';
import { useAuth } from './hooks/AuthProvider';
import { useURL } from './hooks/URLProvider';

const SettingsBox = ({ activeElement }) => {
    const activeSetting = activeElement;
    const user = useAuth();
    const { backendURL } = useURL();
    const [newName, setNewName] = useState('');

    const handleNameChange = async () => { // api call

        if (!newName) {
            alert('Please enter a new display name');
            return;
        }

        const response = await fetch(`${backendURL}/api/user/displayname`, {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer: ${user?.token}`
            },
            body: JSON.stringify({
                newName: newName
            })
        });
        const res = await response.json();
        console.log(`response: ${res}`);
        if (res.success) {
            alert('Your display name has been updated. Please log in again to see changes reflected.')
        } else {
            alert('Your display name could not be updated.') // TODO: inform users when unique constraint violated
        }
    }

    const onDeleteUser = async () => {
        const response = await fetch(`${backendURL}/api/user/delete`, {
            method: 'delete',
            headers: {
                "Conttent-Type": "application/json",
                "Authorization": `Bearer: ${user?.token}`
            }
        });
        const res = await response.json();
        console.log(`response: ${res}`);
        if (res.success) {
            alert('Your account has been deleted. This cannot be undone.');
            user.logOut();
        } else {
            alert("Failed to delete your account. Contact support.");
        }
    }


    const handleDeleteUser = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone");
        if (confirmDelete) {
            onDeleteUser()
        }
    }


    return (
        <div className="settings-box">
            <div className="settings-header">
                <h4>{activeSetting.name}</h4>
                <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new display name"
                />
                <button className='update-display-name-button' onClick={handleNameChange}>
                    Update Display Name
                </button>
                <button className='delete-user-button' onClick={handleDeleteUser}>
                    Delete Your Account
                </button>
            </div>
        </div>
    )
}

export default SettingsBox