import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { createBooking, fetchBookedHours } from '../reducers/bookSlice';
import DatePicker from 'react-datepicker';

const BookingDetails = () => {
    const { courtId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookedHours, setBookedHours] = useState([]);
    const [error, setError] = useState('');

    // useEffect(() => {

    //     // using api.get() + local useState, without Redux
    //     const fetchBookedHours = async () => {
    //         try {
    //             const response = await api.get(
    //                 `/courts/${courtId}/booked-hours?date=${selectedDate.toISOString().split('T')[0]}`
    //             );
    //             setBookedHours(response.data);
    //         } catch (error) {
    //             setError('Failed to load booked hours');
    //         }
    //     };
    //     fetchBookedHours();
    // }, [courtId, selectedDate]);

    useEffect(() => {
        dispatch(fetchBookedHours({ courtId, date: selectedDate.toISOString().split('T')[0]}));
    }, [courtId, selectedDate, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startTime || !endTime) {
            setError('Please select both start and end times');
            return;
        }

        const startDate = new Date(selectedDate);
        const [startHour, startMinute] = startTime.split(':');
        startDate.setHours(startHour, startMinute, 0, 0);

        const endDate = new Date(selectedDate);
        const [endHour, endMinute] = endTime.split(':');
        endDate.setHours(endHour, endMinute, 0, 0);

        if (endDate <= startDate) {
            setError('End time must be after start time');
            return;
        }

        const isSlotBooked = bookedHours.some(
            (slot) => 
                new Date(slot.start_time) < endDate && new Date(slot.end_time) > startDate
        );

        if (isSlotBooked) {
            setError('Selected time slot overlaps with an existing booking');
            return;
        }

        try {
            const bookingData = {
                court_id: courtId,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
            };

            dispatch(createBooking(bookingData));
            navigate(`/payment/${response.payload.booking_id}`);
        } catch (error) {
            setError(error.message || 'An error occured while creating the booking');
        }
    };

  return (
    <div>
        <h2>Book Court {courtId}</h2>
        <form onSubmit={handleSubmit}>
            <DatePicker selected={selectedDate} onChange={setSelectedDate} minDate={new Date()} />
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Confirm Booking</button>
        </form>
    </div>
  )
}

export default BookingDetails