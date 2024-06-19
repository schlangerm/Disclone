import React, { createContext, useState } from 'react';

const URLContext = createContext();

const URLProvider = ({ children }) => {
    const [appURL] = useState("http://localhost:5173");
    const [backendURL] = useState("http://localhost:3001")

    return (
        <URLContext.Provider value={{ appURL, backendURL }}>
            {children}
        </URLContext.Provider>
    );
};

export default URLProvider;

export const useURL = () => {
    return useContext(URLContext)
}