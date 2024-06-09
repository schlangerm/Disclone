import React, { useState } from 'react';

import './globals.css'
import { useAuth } from './hooks/AuthProvider';

import './register_page.css'

const RegisterPage = () => {
    const user = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  
    return (
      <div className="register-page">
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
              user.registerAction(
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

export default RegisterPage;