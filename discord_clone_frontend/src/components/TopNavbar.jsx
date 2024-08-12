import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';
import { useEffect, useState } from 'react';

import { IoSettings } from 'react-icons/io5';
import { IoChevronBackSharp } from 'react-icons/io5';

import '../css/globals.css';
import '../css/top_navbar.css';


const TopNavbar = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);


    useEffect(() => {
      if (user?.name) {
        setUserName(user.name);
      } else {
        setUserName(user?.email);
      }
    }, [user]);

    const handleNavigateToSettings = () => {
        navigate('/settings');
    }

    const handleBackClick = () => {
      navigate(-1);
    };


    return (
      <header className='top-header'>
        <div className='user-wrapper'>
          <div className='user-name'>{userName}</div>
          <div className='logout-button-wrapper'>
            <button className='logout-button'
              children='Logout'
              onClick={() => {
                logOut()
              }}/>
          </div>
        </div>
        <div className='settings-button-wrapper'>
          <button 
            className='settings-button' 
            onClick={handleNavigateToSettings}>
              <IoSettings />
          </button>
        </div>
        <div className='back-button-wrapper'>
          <button 
            className='back-button'
            onClick={handleBackClick}>
              <IoChevronBackSharp />
          </button>
        </div>
      </header>
  )
}

export default TopNavbar