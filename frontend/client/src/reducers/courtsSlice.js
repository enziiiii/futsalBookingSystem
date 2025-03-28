import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchCourts = createAsyncThunk('courts/fetchCourts', async () => {
    const response = await fetch('/api/courts', {
        headers: { Authorization: `Bearer ${localStorage.getItems('token')}` },
    });

    const data = await response.json();
    return data;
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
            .addCase(fetchCourts.pending, (state) => {
                state.loading = 'pending';
            })

            .addCase(fetchCourts.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.courts = action.payload;
            })

            .addCase(fetchCourts.rejected,(state, action) => {
                state.loading = 'failed';
                state.error = action.error.message;
            });
    },
});

export default courtSlice.reducer;

/* extraReducers builder uses .addCase for handling async thunk states, which is a standard pattern in 
    Redux Toolkit for managing loading, success, and error states.
*/