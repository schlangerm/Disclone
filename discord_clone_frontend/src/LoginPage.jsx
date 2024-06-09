import React from 'react';
import { useState } from 'react';

import './globals.css';
import './login_page.css';
import { useAuth } from './hooks/AuthProvider';

const LoginPage = () => {
    const user = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  
    return (
      <div className="login-page">
        <label>
          Email:{" "}
          <input
            name="email"
            placeholder="email@host.org"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
          />
        </label>
        <button
          children="Submit"
          onClick={(event) => {
            if (email && password) {
              console.log(email, password);
              user.loginAction(
                {
                  email: email,
                  password: password,
              });
            }
            else {
              alert("Please provide a valid email and password");
            }
          }}
        />
      </div>
    );
}

export default LoginPage;