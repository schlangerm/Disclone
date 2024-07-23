import React from 'react';

const SettingsBox = ({ activeElement }) => {
    const { name, component: ActiveComponent } = activeElement;
 
    return (
        <div className="settings-box">
            <div className="settings-header">
                <h4>{name}</h4>
                {ActiveComponent ? <ActiveComponent/> : <p>Select a setting</p>}
            </div>
        </div>
    )
}

export default SettingsBox