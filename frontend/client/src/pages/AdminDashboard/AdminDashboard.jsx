import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';


const AdminDashboard = () => {
  
  return (
    <div>
      <div className="flex h-screen">
        <Sidebar role="admin" />
        <div className="flex-1 p-6 ml-16 md:ml-64">
          <Outlet />
        </div>
    </div>
  </div>
    
  );
};

export default AdminDashboard
