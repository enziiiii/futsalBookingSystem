import React from 'react'
import { useSelector } from 'react-redux';

const Court = () => {
  const courts = useSelector((state) => state.courts.courts);
  const loading = useSelector((state) => state.courts.loading);
  const error = useSelector((state) => state.courts.error);

  // console.log('Courts:', courts);
  // console.log('Loading:', loading);
  console.log('Error:', error);

  if (loading === 'pending') return <p>Loading...</p>;
  if (loading === 'failed') return <p>Error loading courts</p>;

  const handleBookCourt = (courtId) => {
    console.log(`Booking court with ID: ${courtId}`);
    
  };


  return (
    <div>
      <h2>Available Courts</h2>
      {/* <p>Debug: {courts.length} courts loaded</p> */}
      <ul>
        {courts.length > 0 ? (
          courts.map(court => (
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