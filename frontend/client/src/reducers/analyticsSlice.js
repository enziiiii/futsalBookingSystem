import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";


export const fetchAnalyticData = createAsyncThunk('analytics/fetchAnalyticsData', async ({courtId, type}, { rejectWithValue }) => {
    try {
        const response = await api.get(`staff/analytics/${type}/${courtId}`);
        console.log(`Analytics API response for ${type} on court ${courtId}:`, response.data);
        return response.data.data;

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return rejectWithValue(error.response?.data || 'Failed to fetch analytics');
    }
});

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        analyticsData: [],
        status: 'idle',
        analyticsError: null,
    },

    reducers: {
        resetAnalytics: (state) => {
            state.analyticsData = [];
            state.status = 'idle';
            state.analyticsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticData.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(fetchAnalyticData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.analyticsData = action.payload;
                state.error = null;
            })

            .addCase(fetchAnalyticData.rejected, (state, action) => {
                state.status = 'failed';
                state.analyticsError = action.payload;
            });
    },
});

export const { resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;