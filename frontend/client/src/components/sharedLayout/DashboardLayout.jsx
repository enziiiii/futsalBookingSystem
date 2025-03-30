import React from 'react'
import { Outlet } from 'react-router-dom';
import UserNav from '../shared/UserNav';

const DashboardLayout = () => {
  return (
    <>
        <UserNav />
        <Outlet /> {/* Renders the nested dashboard routes */}
    
    </>
  );
};

export default DashboardLayout;