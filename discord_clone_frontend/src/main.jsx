import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './hooks/AuthProvider';

import './css/globals.css'
import URLProvider from './hooks/URLProvider.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <URLProvider>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </URLProvider>
  </BrowserRouter>
)