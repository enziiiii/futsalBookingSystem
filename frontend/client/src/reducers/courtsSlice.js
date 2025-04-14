import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// uses simple fetch rather than axios
// to get courts as Admin
export const fetchCourts = createAsyncThunk('courts/fetchCourts', async () => {
    const response = await fetch('http://localhost:5000/api/admin/courts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch courts');
    }

    const responseData = await response.json();
    console.log('API response:', responseData);
    return responseData.data;
});


// to get courts as Customer
export const fetchCourtsForCustomer = createAsyncThunk('courts/fetchCourtsForCustomer', 
    async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/customer/courts');
        console.log('API Response:', response.data);
        return response.data.data || [];
    } catch (error) {
        console.error('Fetch courts error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to fetch courts');
    }
});


 
// As Admin
export const addCourt = createAsyncThunk('courts/addCourt', async (courtData) => {
    console.log('From courtSlice, courtData being sent to backend:', courtData);

    const response = await fetch('http://localhost:5000/api/admin/courts', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
         },
            body: JSON.stringify(courtData),
    });

    if (!response.ok) {
        throw new Error('Failed to add court');
    }

    const data = await response.json();
    return data;
});


// to update courts
export const updateCourt = createAsyncThunk('courts/updateCourt', async ({ courtId, courtData }) => {
    const response = await fetch(`http://localhost:5000/api/admin/courts/${courtId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json' ,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(courtData),
    });
    const data = await response.json();
    return data;
    
});


// to delete courts
export const deleteCourt = createAsyncThunk('courts/deleteCourt', async (courtId) => {
    await fetch(`http://localhost:5000/api/admin/courts/${courtId}`, { 
        method: 'DELETE',
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return courtId;
});

const initialState = {
    courts: [],
    loading: 'idle',
    error: null,
};

const courtSlice = createSlice({
    name: 'courts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Admin cases
            .addCase(fetchCourts.pending, (state) => {
                state.loading = 'pending';
            })

            .addCase(fetchCourts.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                console.log('Fetched courts:', action.payload);  //Debug: should log the array
                state.courts = action.payload;  // Set state.courts to the array
            })

            .addCase(fetchCourts.rejected,(state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            })

            // for admin
            .addCase(addCourt.fulfilled, (state, action) => {
                state.courts.push(action.payload);
            })

            .addCase(updateCourt.fulfilled, (state, action) => {
                const index = state.courts.findIndex((court) => court.court_id === action.payload.court_id);
                if (index !== -1) state.courts[index] = action.payload;
            })

            .addCase(deleteCourt.fulfilled, (state, action) => {
                state.courts = state.courts.filter((court) => court.court_id !== action.payload);
            })

            // Customer cases
            .addCase(fetchCourtsForCustomer.pending, (state) => {
                state.loading = 'pending';
                console.log('Fetch courts for customer pending');
            })

            .addCase(fetchCourtsForCustomer.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                console.log('Fetched courts:', action.payload);
                state.courts = action.payload;
                state.error = null;
            })

            .addCase(fetchCourtsForCustomer.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
                console.log('Fetch courts failed:', action.error.message);
            });
        },
});

export default courtSlice.reducer;

/* extraReducers builder uses .addCase for handling async thunk states, which is a standard pattern in 
    Redux Toolkit for managing loading, success, and error states.
*/





