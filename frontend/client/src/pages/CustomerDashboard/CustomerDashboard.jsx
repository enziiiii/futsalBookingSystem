import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { fetchCourtsForCustomer } from '../../reducers/courtsSlice';
import Sidebar from '../../components/Sidebar';
import { Navigate, Outlet } from 'react-router-dom';



const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user || !user.roles.includes('customer')) {
    return <Navigate to="/login" />;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Fetching courts for customer')
    dispatch(fetchCourtsForCustomer());
  }, [dispatch]);


  return (
    <div className="flex">
      <Sidebar role="customer" />
      <div className="flex-1 p-6 ml-16 md:ml-64">
        <Outlet />
      </div>
    </div>

  );

};


export default CustomerDashboard