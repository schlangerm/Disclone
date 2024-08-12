import React from 'react';

import '../css/dropdown.css';

const Dropdown = ({ isVisible, contentArray }) => {
    return (
        <div className={`dropdown-content ${isVisible ? 'show' : ''}`}>
            {isVisible ? (
                <ul>
                    {contentArray.map((element, index) => (
                        <li key={index}>
                            {element}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

export default Dropdown;