import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';


const StaffDashboard = () => {
  const { user }  = useSelector((state) => state.auth);
  if (!user || !user.roles.includes('staff')) {
    return <Navigate to ="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="staff" />
      <div className="flex-1 p-6 ml-16 md-ml-64">
        <Outlet />
        {/* <h1>Hello from StaffDashboard</h1> */}
      </div>
    </div>
  )
}

export default StaffDashboard