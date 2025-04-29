import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { createBooking } from '../../reducers/bookSlice';
import api from '../../services/api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CourtAvailability from './CourtAvailability';


const BookingForm = ({ onClose }) => {
    const { courtId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookedHours, setBookedHours] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hours = Array.from({ length: 14 }, (_, i) => 8 + i); // 8 AM to 10 PM

    useEffect(() => {
        if (!courtId) {
            setError('Court ID is missing');
            return;
        }

        const fetchBookedHours = async () => {
            try {
                const response = await axios.get(
                    `/customer/courts/${courtId}/booked-hours?date=${selectedDate.toISOString().split('T')[0]}`
                );
                setBookedHours(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.error('Error fetching booked hours:', error);
                setError('Failed to load booked hours');
            }
        };

        fetchBookedHours();
    }, [selectedDate, courtId]);

    const isSlotBooked = (hour) => {
        const checkTime = new Date(selectedDate);
        checkTime.setHours(hour, 0, 0, 0);
        return bookedHours.some(
            (slot) =>
                new Date(slot.start_time) <= checkTime &&
                checkTime < new Date(slot.end_time)
        );
    };

    const handleSlotClick = (hour) => {
        if (isSlotBooked(hour)) return;
        if (!startTime) {
            setStartTime(`${hour.toString().padStart(2, '0')}:00`);
        } else if (!endTime) {
            setEndTime(`${hour.toString().padStart(2, '0')}:00`);
        } else {
            setStartTime(`${hour.toString().padStart(2, '0')}:00`);
            setEndTime('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!startTime || !endTime) {
            setError('Please select both start and end times');
            setIsSubmitting(false);
            return;
        }

        const startDate = new Date(selectedDate);
        const [startHour, startMinute] = startTime.split(':');
        startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());

        const endDate = new Date(selectedDate);
        const [endHour, endMinute] = endTime.split(':');
        endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
        endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());

        if (endDate <= startDate) {
            setError('End time must be after start time');
            setIsSubmitting(false);
            return;
        }

        try {
            const bookingData = {
                court_id: courtId,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
            };

            const availabilityResponse = await api.post('/customer/bookings/check-availability', bookingData);
            const { available } = availabilityResponse.data.data || {};
            if (!available) {
                setError('Selected time slot is not available');
                setIsSubmitting(false);
                return;
            }

            const result = await dispatch(createBooking(bookingData)).unwrap();
            alert('Booking successful! Please complete payment within 15 minutes.');
            navigate(`/customer/payment/${result.booking_id}`);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'An error occurred';
            setError(errorMessage);
            if (errorMessage.includes('Unauthorized')) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose ? onClose() : navigate('/customer/courts');
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-10">
            {/* <CourtAvailability /> */}
            <h2 className="text-2xl font-bold mb-4">Book Court</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-medium">Select Date:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        dateFormat="yyyy-MM-dd"
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Select Time Slots:</label>
                    <div className="grid grid-cols-4 gap-2">
                        {hours.map((hour) => {
                            const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
                            const booked = isSlotBooked(hour);
                            const isSelected =
                                timeLabel === startTime || timeLabel === endTime;
                            return (
                                <button
                                    key={hour}
                                    type="button"
                                    onClick={() => handleSlotClick(hour)}
                                    disabled={booked}
                                    className={`p-2 text-sm rounded-lg border text-center transition-all
                                        ${booked
                                            ? 'bg-red-200 text-red-800 cursor-not-allowed'
                                            : isSelected
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 hover:bg-blue-100'
                                        }`}
                                >
                                    {timeLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

// export default BookingForm;

// const BookingForm = ({ onClose }) => {
//     const { courtId } = useParams();
//     if (!courtId) {
//         setError('Court ID is missing');
//         return;
//     }

//     const navigate = useNavigate();
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     // const [selectedHour, setSelectedHour] = useState(null);
//     const [startTime, setStartTime] = useState('');
//     const [endTime, setEndTime] = useState('');
//     const [bookedHours, setBookedHours] = useState([]);
//     const [error, setError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const dispatch = useDispatch();

//     // Fetch booked hours when date or court changes
//     useEffect(() => {
//         const fetchBookedHours = async () => {
//             try {
//                 const response = await axios.get(
//                     `/customer/courts/${courtId}/booked-hours?date=${selectedDate.toISOString().split('T')[0]}`
//                 );

//                 // setBookedHours(response.data.data);
//                 setBookedHours(Array.isArray(response.data.data) ? response.data.data : []);
//             } catch (error) {
//                 console.error('Error fetching booked hours:', error);
//                 setError('Failed to load booked hours');
//             }
//         };

//         fetchBookedHours();
//     }, [selectedDate, courtId]);


//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsSubmitting(true);

//         if (!startTime || !endTime) {
//             setError('Please select both start and end times')
//             setIsSubmitting(false);
//             return;
//         }

//         const startDate = new Date(selectedDate);
//         const [startHour, startMinute] = startTime.split(':');
//         startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
//         startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
//         // start.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0, 0);

//         const endDate = new Date(selectedDate);
//         const [endHour, endMinute] = endTime.split(':');
//         endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
//         endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());
//         // end.getHours(parseInt(endTime.split(':')[0]), parseInt(endTime,split(':')[1]), 0, 0);

//         if (isNaN(startDate) || isNaN(endDate)) {
//             setError('Invalis data or time');
//             return;
//         }

//         if (endDate <= startDate) {
//             setError('End time must be after start time');
//             setIsSubmitting(false);
//             return;
//         }

//         try {
//             // time slot availability checking
//             const bookingData = {
//                 court_id: courtId,
//                 start_time: startDate.toISOString(),
//                 end_time: endDate.toISOString(),
                
//             };

//             // availability check
//             console.log('Sending bookingData:', bookingData);
//             const availabilityResponse = await api.post('/customer/bookings/check-availability', bookingData);
//             const { available } = availabilityResponse.data.data || {};
//             if (!available) {
//                 setError('Selected time slot is not available');
//                 setIsSubmitting(false);
//                 return;
//             }

//             // creating booking
//             const createBookingData = {
//                 court_id: bookingData.court_id,
//                 start_time: bookingData.start_time,
//             };
//             console.log('Sending createBookingData:', createBookingData);
//             const result = await dispatch(createBooking(createBookingData)).unwrap();
//             console.log('Booking created:', result);
//             alert('Booking successful! Please complete payment within 15 minutes. ');
//             navigate(`/customer/payment/${result.booking_id}`);  // Redirect to payment page
//         } catch (error) {      
//             console.error('Booking error:', error.response?.data || error.message);     
//             const errorMessage = error.message || error || 'An error occured while creating the booking';
//             setError(errorMessage);
//             if (errorMessage.includes('Unauthorized')) {
//                 alert('Session expired. Please log in again.');
//                 navigate('login');
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };


//     const handleCancel = () => {
//         if (onClose) {
//           onClose();
//         } else {
//           navigate('/customer/courts');   // Fallback to navigate back
//         }
//     }
        

//   return (
//     <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '10px' }}>
//         <h2>Book Court</h2>
//         <form onSubmit={handleSubmit}>
//         <div>
//             <label>Select Date:</label>
//             <DatePicker 
//                 selected={selectedDate} 
//                 onChange={(date) => setSelectedDate(date)} 
//                 minDate={new Date()}
//                 dateFormat="yyyy-MM-dd"
//             />
//         </div>
//         <div>
//             {/* <label>Select Hour:</label> */}
//             <label>Start Time:</label>
//             <input 
//                 type="time"
//                 value={startTime}
//                 onChange={(e) => setStartTime(e.target.value)}
//                 required
//             />
//         </div>
//         <div>
//             {/* <label>Select Hour:</label> */}
//             <label>End Time:</label>
//             <input 
//                 type="time"
//                 value={endTime}
//                 onChange={(e) => setEndTime(e.target.value)}
//                 required
//             />
//         </div>
//         {bookedHours.length > 0 && (
//             <div>
//                 <p>Booked Slots:</p>
//                 <ul>
//                     {bookedHours.map((slot, index) => (
//                         <li key={index}>
//                             {new Date(slot.start_time).toLocaleTimeString()} - {' '}
//                             {new Date(slot.end_time).toLocaleTimeString()}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         )}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit Booking'}
//         </button>
//         <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
//             Cancel
//         </button>
//         </form>
//     </div>
//   )
// }

export default BookingForm