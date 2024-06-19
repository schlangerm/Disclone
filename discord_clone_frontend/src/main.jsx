import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './hooks/AuthProvider';
import { URLProvider } from './hooks/URLProvider.jsx';

import './css/globals.css'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <URLProvider>
          <App/>
        </URLProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)