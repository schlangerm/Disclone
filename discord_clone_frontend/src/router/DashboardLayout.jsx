import React from 'react';
import TopNavbar from '../components/TopNavbar.jsx';

import '../css/dashboard-layout.css';

const DashboardLayout = ({ children }) => {
   
    return (
      <div className='layout'>
        <TopNavbar/>
        <div className='main-content-wrapper'>
          {children}
        </div>
      </div>
    );
}

export default DashboardLayout;