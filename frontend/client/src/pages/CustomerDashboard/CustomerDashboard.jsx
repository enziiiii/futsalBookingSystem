import React from 'react'
import { useEffect } from 'react';
import { fetchCourts } from '../../reducers/courtsSlice';
import { useDispatch, useSelector } from 'react-redux'

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { courts, status, error } = useSelector((state) => state.courts);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>
  }
    
  return (
    <div>
      <h2>Available Courts</h2>
      <ul>
        {courts.map((court) => (
          <li key={court.court_id}>
            {court.court_name} - ${court.hourly_rate} per hour
          </li>
        ))}
      </ul>
    </div>
  );
};


export default CustomerDashboard