import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import DashboardLayout from "./DashboardLayout";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user?.token) {
    alert('Please log in');
    return <Navigate to="/login" />;
  } 
  return (
  <DashboardLayout>
    <Outlet/>
  </DashboardLayout>
)};

export default PrivateRoute;