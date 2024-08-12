import React, { useState } from 'react';
import { useAuth } from './hooks/AuthProvider';

import './css/globals.css'
import './css/register_page.css'

const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const appURL = import.meta.env.VITE_FRONTEND_URL
    const { registerAction } = useAuth();

    const handleSubmit = () => {
      if (email && password) {
        console.log(email, password);
        registerAction(
          {
            email: email,
            password: password,
        });
      }
      else {
        alert("Please provide a valid email and password");
      }
    }

    const handleEnterKey = (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }

  
    return (
      <div className="register-page">
        <label>
          Email:{" "}
          <input
            name="email"
            placeholder="email@host.org"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleEnterKey}
          />
        </label>
        <label>
          Password:{" "}
          <input
            name="pw"
            placeholder="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleEnterKey}
          />
        </label>
        <button
          children="Submit"
          onClick={handleSubmit}
        />
        <div className='login-offer'>
          <h1>Already Registered?</h1>
          <p>
            Login{' '}
            <a href={`${appURL}/login`}>here</a>
          </p>
        </div>
      </div>
    );
}

export default RegisterPage;