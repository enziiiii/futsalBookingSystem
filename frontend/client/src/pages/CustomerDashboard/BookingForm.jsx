import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { createBooking } from '../../reducers/bookSlice';
import api from '../../services/api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const BookingForm = ({ onClose }) => {
    const { courtId } = useParams();
    if (!courtId) {
        setError('Court ID is missing');
        return;
    }

    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [selectedHour, setSelectedHour] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookedHours, setBookedHours] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    // Fetch booked hours when date or court changes
    useEffect(() => {
        const fetchBookedHours = async () => {
            try {
                const response = await axios.get(
                    `/customer/courts/${courtId}/booked-hours?date=${selectedDate.toISOString().split('T')[0]}`
                );

                // setBookedHours(response.data.data);
                setBookedHours(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.error('Error fetching booked hours:', error);
                setError('Failed to load booked hours');
            }
        };

        fetchBookedHours();
    }, [selectedDate, courtId]);


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!startTime || !endTime) {
            setError('Please select both start and end times')
            setIsSubmitting(false);
            return;
        }

        const startDate = new Date(selectedDate);
        const [startHour, startMinute] = startTime.split(':');
        startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
        // start.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0, 0);

        const endDate = new Date(selectedDate);
        const [endHour, endMinute] = endTime.split(':');
        endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
        endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());
        // end.getHours(parseInt(endTime.split(':')[0]), parseInt(endTime,split(':')[1]), 0, 0);

        if (isNaN(startDate) || isNaN(endDate)) {
            setError('Invalis data or time');
            return;
        }

        if (endDate <= startDate) {
            setError('End time must be after start time');
            setIsSubmitting(false);
            return;
        }

        try {
            // time slot availability checking
            const bookingData = {
                court_id: courtId,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                
            };

            // availability check
            console.log('Sending bookingData:', bookingData);
            const availabilityResponse = await api.post('/customer/bookings/check-availability', bookingData);
            const { available } = availabilityResponse.data.data || {};
            if (!available) {
                setError('Selected time slot is not available');
                setIsSubmitting(false);
                return;
            }

            // creating booking
            const createBookingData = {
                court_id: bookingData.court_id,
                start_time: bookingData.start_time,
            };
            console.log('Sending createBookingData:', createBookingData);
            const result = await dispatch(createBooking(createBookingData)).unwrap();
            console.log('Booking created:', result);
            alert('Booking successful! Please complete payment within 15 minutes. ');
            navigate(`/customer/payment/${result.booking_id}`);  // Redirect to payment page
        } catch (error) {      
            console.error('Booking error:', error.response?.data || error.message);     
            const errorMessage = error.message || error || 'An error occured while creating the booking';
            setError(errorMessage);
            if (errorMessage.includes('Unauthorized')) {
                alert('Session expired. Please log in again.');
                navigate('login');
            }
        } finally {
            setIsSubmitting(false);
        }

    //     try {
    //         //Check availability
    //         const availabilityResponse = await axios.post('/bookings/check-availability', {
    //             court_id: courtId,
    //             start_time: start.toISOString(),
    //             end_time: end.toISOString(),
    //         });

    //         if (!availabilityResponse.data.available) {
    //             setError('Selected time slot is not available');
    //             return;
    //         }

    //         //Create booking
    //         await dispatch(createBooking(bookingData));

    //         alert('Booking successful! Please complete payment within 15 minutes.');
    //         onclose();
    //     } catch (error) {
    //         console.error('Booking error:', error);
    //         setError('Booking failed. Please try again.');
    //     }
    };


    const handleCancel = () => {
        if (onClose) {
          onClose();
        } else {
          navigate('/customer/courts');   // Fallback to navigate back
        }
    }
        

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '10px' }}>
        <h2>Book Court</h2>
        <form onSubmit={handleSubmit}>
        <div>
            <label>Select Date:</label>
            <DatePicker 
                selected={selectedDate} 
                onChange={(date) => setSelectedDate(date)} 
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
            />
        </div>
        <div>
            {/* <label>Select Hour:</label> */}
            <label>Start Time:</label>
            <input 
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
            />
        </div>
        <div>
            {/* <label>Select Hour:</label> */}
            <label>End Time:</label>
            <input 
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
            />
        </div>
        {bookedHours.length > 0 && (
            <div>
                <p>Booked Slots:</p>
                <ul>
                    {bookedHours.map((slot, index) => (
                        <li key={index}>
                            {new Date(slot.start_time).toLocaleTimeString()} - {' '}
                            {new Date(slot.end_time).toLocaleTimeString()}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
        </button>
        <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
            Cancel
        </button>
        </form>
    </div>
  )
}

export default BookingForm