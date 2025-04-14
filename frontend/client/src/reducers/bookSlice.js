import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import api from "../services/api";

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (customerId) => {
    try {
        const response = await api.get(`/customer/bookings/${customerId}`);
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
        const response = await api.put(`/bookings/${bookingId}/confirm`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to confirm booking');
    }
});


const bookSlice = createSlice({
    name: 'bookings',
    initialState: {
        bookings: [],                   // list of bookings
        bookedHours: [],                 // list of booked hours
        status: 'idle',                 // for fetchBookings and createBooking
        error: null,                    // for fetchBookings and createBooking
        bookedHoursStatus: 'idle',      // for fetchBookedHours
        bookedHoursError: null,         // for fetchBookedHours
        confirmStatus: 'idle',          // for confirmBooking
        confirmError: null,             // for confirmBooking
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookings = action.payload;
            })

            .addCase(fetchBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(createBooking. fulfilled, (state, action) => {
                state.bookings.push(action.payload);
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
            });
    },

});

export default bookSlice.reducer;