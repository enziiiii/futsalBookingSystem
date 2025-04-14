import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BookingForm from './BookingForm';
import { useNavigate } from 'react-router-dom'
import { fetchCourtsForCustomer } from '../../reducers/courtsSlice';

const Court = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courts = useSelector((state) => state.courts.courts);
  const loading = useSelector((state) => state.courts.loading);
  const error = useSelector((state) => state.courts.error);
  // console.log('Error:', error);
  
  // filter state
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    dispatch(fetchCourtsForCustomer());
  }, [dispatch]);

  const handleBookCourt = (courtId) => {
    navigate(`/customer/booking/${courtId}`);
  };


  if (loading === 'pending') return <p>Loading...</p>;
  if (loading === 'failed') return <p>Error loading courts: {error || 'Unkown error'}</p>;

  // filter courts based on the selected filter
  const filteredCourts = courts.filter((court) => {
    if (filter == 'all') return true;
    return court.status === filter;
  });


  return (
    <div>
      <h2>Available Courts</h2>
      {/* <p>Debug: {courts.length} courts loaded</p> */}
      <div style={{ marginBottom: '10px' }}>
        <label>Filter by status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="closed">Closed</option>
          <option value="maintenance">Maintenace</option>
        </select>
      </div>
      <ul>
        {filteredCourts.length > 0 ? (
          filteredCourts.map(court => (
            <li key={court.court_id}>
              {court.court_name} - Status: {court.status}
              {court.status === 'available' && (
                <button onClick={() => handleBookCourt(court.court_id)}>Book Now</button>
              )}
            </li>
          ))
      ) : (
        <p>No courts available</p>
      )}
      </ul>
    </div>
  );
};

export default Court;