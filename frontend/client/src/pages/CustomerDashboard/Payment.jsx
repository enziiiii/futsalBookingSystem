import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const Payment = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);


    const handlePayment = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await api.put(`/customer/bookings/${bookingId}/confirm`);
            console.log('Payment respone:', res.data);
            alert('Payment successful! Booking confirmed.');
            navigate('/customer/myBookings');
                
        } catch (error) {
            alert('Payment failed> please try again');
            console.error('Payment error:', error);
            setError(error?.response?.data?.message || 'Payment failed. Please try assignAdminRole.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>
                Complete Payment for Booking #{bookingId}
            </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Please complete payment within 15 minutes.</p>
            <button onClick={handlePayment} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Confirm Payment'}
            </button>
            <button onClick={() => navigate('/customer/courts')}>
                Cancel
            </button>
        </div>
    );
};

    export default Payment