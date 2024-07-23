import React from "react";

import './css/sliding_panel.css';

// for now, requires items to have a .name attribute or .email attribute

const SlidingPanel = ({ items, isOpen }) => {
    return (
        <div className={`sliding-panel ${isOpen ? 'open' : ''}`}>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{ item.name ? item.name : item.email }</li>
                ))}
            </ul>
        </div>
    );
};

export default SlidingPanel;