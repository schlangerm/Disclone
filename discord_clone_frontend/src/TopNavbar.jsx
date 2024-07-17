import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/AuthProvider"

import './css/globals.css';
import './css/top_navbar.css'
import { useEffect, useState } from "react";

const TopNavbar = () => {
    const user = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);


    useEffect(() => {
      if (user.name) {
        setUserName(user.name);
      } else {
        setUserName(user?.email);
      }
    }, [user]);

    const handleNavigateToSettings = () => {
        navigate("/settings");
    }


    return (
        <header className="top-header">
          <div className="user-name">{userName}</div>
          <div className='logout-button'>
            <button
              children="Logout"
              onClick={() => {
                user.logOut()
              }}/>
          </div>
          <div className="settings-button">
            <button onClick={handleNavigateToSettings}>
                Settings
            </button>
          </div>
        </header>
    )
}

export default TopNavbar