import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import api from "../services/api";

// Fetch booking for admin
export const fetchAdminBookings = createAsyncThunk('bookings/fetchAdminBookings', async () => {
    try {
        const response = await api.get(`/admin/bookings`);
        return response.data.data;
    } catch (error) {
        console.error('Fetch admin bookings error:', error.response?.data || error.messgage);
        return rejectWithValue(error.response?.data || 'Failed to fetch admin bookings');
    }
});

// Fetch booking for Staff
export const fetchStaffBookings = createAsyncThunk('booking/fetchBookings', async () => {
    try {
        const response = await api.get(`/staff/bookings`);
        return response.data.data;
    } catch (error) {
        console.error('Fetch bookings error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed tp fetch Staff bookings')
    }
});

// Fetch bookings for customer
export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
    try {
        const response = await api.get(`/customer/bookings`);
        return response.data.data;
    } catch (error) {
        console.error('Fetch bookings error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to fetch bookings');
    }
});

export const createBooking = createAsyncThunk('bookings/createBooking', async (bookingData, {rejectWithValue }) => {
    try {
        const response = await api.post('/customer/bookings', bookingData);
        return response.data.data;
    } catch (error) {
        console.error('Create booking error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to create booking');
    }
});

export const fetchBookedHours = createAsyncThunk('bookings/fetchBookedHours', async ({ courtId, date }, { rejectWithValue }) => {
    try {
        const response = await api.get(`/courts/${courtId}/booked-hours?date=${date}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch booked hours');
    }
});

export const confirmBooking = createAsyncThunk('bookings/confirmBooking', async (bookingId, { rejectWithValue }) => {
    try {
        const response = await api.put(`customer/bookings/${bookingId}/confirm`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to confirm booking');
    }
});

export const cancelBooking = createAsyncThunk('bookings/cancelBooking', async ({ bookingId, reason }, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/staff/bookings/${bookingId}`, {
            data: { reason }
        });
        return bookingId; // Return the booking Id to remove it from the state
    } catch (error) {
        console.error('Cancel booking error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to cancel booking');
    }
});

const bookSlice = createSlice({
    name: 'bookings',
    initialState: {
        bookings: {                     // list of bookings
            adminBookings: [],
            staffBookings: [],
            customerBookings: [],
        },                   
        bookedHours: [],                 // list of booked hours
        status: {                          // for fetchBookings and createBooking
            admin: 'idle',
            staff: 'idle',
            customer: 'idle',
        },
                        
        error: null,                    // for fetchBookings and createBooking
        bookedHoursStatus: 'idle',      // for fetchBookedHours
        bookedHoursError: null,         // for fetchBookedHours
        confirmStatus: 'idle',          // for confirmBooking
        confirmError: null,             // for confirmBooking
        cancelStatus: 'idle',
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            // Admin 
            .addCase(fetchAdminBookings.pending, (state) => {
                state.status.admin = 'loading';
            })

            .addCase(fetchAdminBookings.fulfilled, (state, action) => {
                state.status.admin = 'succeeded';
                state.bookings.adminBookings = action.payload;
            })

            .addCase(fetchAdminBookings.rejected, (state, action) => {
                state.status.admin = 'failed';
                state.error = action.error.message;
            })

            // Staff 
            .addCase(fetchStaffBookings.pending, (state) => {
                state.status.staff = 'loading';
            })

            .addCase(fetchStaffBookings.fulfilled, (state, action) => {
                state.status.staff = 'succeeded';
                state.bookings.staffBookings = action.payload;
            })

            .addCase(fetchStaffBookings.rejected, (state, action) => {
                state.status.staff = 'failed';
                state.error = action.error.message;
            })

            // Customer
            .addCase(fetchBookings.pending, (state) => {
                state.status.customer = 'loading';
            })

            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.status.customer = 'succeeded';
                console.log('Fetched bookings:', action.payload);
                state.bookings.customerBookings = action.payload;
            })

            .addCase(fetchBookings.rejected, (state, action) => {
                state.status.customer = 'failed';
                state.error = action.error.message;
            })

            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.customerBookings.push(action.payload);
            })

            .addCase(createBooking.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })

            .addCase(fetchBookedHours.pending, (state) => {
                state.bookedHoursStatus = 'loading';
            })

            .addCase(fetchBookedHours.fulfilled, (state, action) => {
                state.bookedHoursStatus = 'succeeded';
                state.bookedHours = action.payload;
                state.bookedHoursError = null;
            })

            .addCase(fetchBookedHours.rejected, (state, action) => {
                state.bookedHoursStatus = 'failed';
                state.bookedHoursError = action.payload;
            })

            .addCase(confirmBooking.pending, (state) => {
                state.confirmStatus = 'loading';
            })

            .addCase(confirmBooking.fulfilled, (state, action) => {
                state.confirmStatus = 'succeeded';

                const index = state.bookings.findIndex(b => b.booking_id === action.payload.booking_id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                state.confirmError = null;
            })

            .addCase(confirmBooking.rejected, (state, action) => {
                state.confirmStatus = 'failed';
                state.confirmError = action.payload;
            })

            .addCase(cancelBooking.pending, (state) => {
                state.cancelStatus = 'loading';
            })

            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.cancelStatus = 'succeeded';
                state.bookings = state.bookings.filter(booking => booking.booking_id !== action.payload);
            })

            .addCase(cancelBooking.rejected, (state, action) => {
                state.cancelStatus = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export default bookSlice.reducer;