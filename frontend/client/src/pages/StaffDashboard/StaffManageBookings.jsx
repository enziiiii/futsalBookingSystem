import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBooking, fetchStaffBookings } from '../../reducers/bookSlice';

const StaffManageBookings = () => {
  const dispatch = useDispatch();
  const staffBookings = useSelector((state) => state.booking.bookings.staffBookings);
  const status = useSelector((state) => state.booking.status.staff);
  const cancelStatus = useSelector((state) => state.booking.cancelStatus);
  const error = useSelector((state) => state.booking.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStaffBookings());
    }
  }, [dispatch, status]);

  const handleCancel = (bookingId) => {
    const reason = 'Canceled by staff';
    dispatch(cancelBooking({ bookingId, reason }));
  };

  if (status === 'loading') {
    return <div>Loading bookings...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>
  }
 

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Booking</h2>
      {cancelStatus === 'loading' && <p>Canceling booking...</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Court</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffBookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td>{booking.customer_name}</td>
              <td>{booking.court_name}</td>
              <td>{new Date(booking.start_time).toLocaleString()}</td>
              <td>{new Date(booking.end_time).toLocaleString()}</td>
              <td>{booking.status}</td>
              <td className="py-2 px-4 border">
                <button className="text-blue-500 hover:underline mr-2">Edit</button>
                <button>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StaffManageBookings