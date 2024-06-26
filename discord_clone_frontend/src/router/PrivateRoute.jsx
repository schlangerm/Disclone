import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user?.token) {
    alert('Please log in');
    return <Navigate to="/login" />;
  } //could do something with jwt here if no user obj; put token in an authprovider hook to decode and set user
  return <Outlet />;
};

export default PrivateRoute;