import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

const BookingDetails = () => {
    const { courtId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookedHours, setBookedHours] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookedHours = async () => {
            try {
                const response = await api.get(
                    `/courts/${courtId}/booked-hours?date=${selectedDate.toISOString().split('T')[0]}`
                );
                setBookedHours(response.data);
            } catch (error) {
                setError('Failed to load booked hours');
            }
        };
        fetchBookedHours();
    }, [courtId, selectedDate]);

  return (
    <div>BookingDetails</div>
  )
}

export default BookingDetails