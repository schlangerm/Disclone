import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import HomePage from './HomePage.jsx';
import PrivateRoute from './router/PrivateRoute';
import RegisterPage from './RegisterPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import socket from './sockets/socket.js';

import './css/globals.css'




const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  //const [someEvents, setSomeEvents] = useState([]);
  const token = localStorage.getItem("AuthToken")

  useEffect(() => {

    if (token) {
      socket.connect();
    }

    const onConnect = () => {
      setIsConnected(true);
      console.log('Socket connected to server, may not be authenticated');
      socket.emit('authenticate', {token: token});
    }

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected from server');
    }
    /*
    const onSomeEvent = (value) => {
      setSomeEvents(previous => [...previous, value]); //example
    }
    */

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    //socket.on('something', onSomeEvent); // example

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      //socket.off('something', onSomeEvent); // example
    };
  }, [token]); //runs when token changes

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route element={<PrivateRoute />}>
        <Route path ="/" element={<Navigate to = "/home" />}/>
        <Route path ="/home" element={<HomePage />}/>
        <Route path ="/settings" element={<SettingsPage />}/>
      </Route>
    </Routes>
  );
};

export default App;