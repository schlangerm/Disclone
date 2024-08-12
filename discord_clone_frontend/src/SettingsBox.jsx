import React from 'react';

const SettingsBox = ({ activeElement }) => {
    const { name, component: ActiveComponent } = activeElement;
 
    return (
        <div className='settings-box'>
            <div className='settings-header'>
                <h4>{name}</h4>
                {ActiveComponent ? <ActiveComponent/> : 
                <div className='no-selection-message'>
                    <p>No componenet selected</p>
                </div>}
            </div>
        </div>
    )
}

export default SettingsBox