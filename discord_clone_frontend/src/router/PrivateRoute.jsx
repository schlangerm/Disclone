import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import DashboardLayout from './DashboardLayout';

const PrivateRoute = () => {
  const token = localStorage.getItem('AuthToken');
  if (!token) {
    alert('Please log in');
    return <Navigate to='/login' />;
  } 
  return (
  <DashboardLayout>
    <Outlet/>
  </DashboardLayout>
)};

export default PrivateRoute;