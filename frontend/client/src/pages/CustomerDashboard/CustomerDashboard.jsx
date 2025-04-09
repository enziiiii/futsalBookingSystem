import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import Court from './Court';
import { fetchCourtsForCustomer } from '../../reducers/courtsSlice';

const CustomerDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Fetching courts for customer')
    dispatch(fetchCourtsForCustomer());
  }, [dispatch]);


  return (
    <div>
      <h1>Customer Dashboard</h1>
      <Court />

    </div>
  );

};


export default CustomerDashboard