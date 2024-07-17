import React, { useContext, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import HomePage from './HomePage.jsx';
import PrivateRoute from './router/PrivateRoute';
import RegisterPage from './RegisterPage.jsx';
import SettingsPage from './SettingsPage.jsx';

import './css/globals.css'



const App = () => {  

  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route element={<PrivateRoute />}>
        <Route path ="/" element={<Navigate to = "/home"/>}/>
        <Route path ="/home" element={<HomePage/>}/>
        <Route path ="/settings" element={<SettingsPage/>}/>
      </Route>
    </Routes>
  );
};

export default App;