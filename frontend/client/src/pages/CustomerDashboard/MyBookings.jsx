import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../reducers/bookSlice';

const MyBookings = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const bookings = useSelector((state) => state.booking.bookings || []);
    const loading = useSelector((state) => state.booking.loading);

    useEffect(() => {
        if (user && user.userID) {
            dispatch(fetchBookings(user.userId));
        }
    }, [dispatch, user]);

    if (loading === 'pending') return <p>Loading...</p>;

  return (
    <div>
        <h2>My Bookings</h2>
        {bookings.length > 0 ? (
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.booking_id}>
                        Booking #{booking.booking_id} - {booking.start_time}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No booking found.</p>
        )}
    </div>
  )
}

export default MyBookings