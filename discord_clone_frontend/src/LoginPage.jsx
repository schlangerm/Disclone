import React from 'react';
import { useState } from 'react';
import { useAuth } from './hooks/AuthProvider';

import './css/globals.css';
import './css/login_page.css';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const appURL = import.meta.env.VITE_FRONTEND_URL
    const { loginAction } = useAuth();

    const handleSubmit = () => {
      if (email && password) {
        console.log(email, password);
        loginAction(
          {
            email: email,
            password: password,
        });
      }
      else {
        alert('Please provide a valid email and password');
      }
    }

    const handleEnterKey = (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }

    return (
      <div className='login-page'>
        <div className='input-wrapper'>
          <label>
            Email:{' '}
            <input
              name='email'
              placeholder='email@host.org'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={handleEnterKey}
            />
          </label>
          <label>
            Password:{' '}
            <input
              name='pw'
              placeholder='password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleEnterKey}
            />
          </label>
          <button
            children='Submit'
            onClick={handleSubmit}
          />
        </div>
        <div className='register-offer'>
          <h1>Not Registered?</h1>
          <p>
            Register an account{' '}
            <a href={`${appURL}/register`}>here</a>
          </p>
        </div>
      </div>
    );
}

export default LoginPage;