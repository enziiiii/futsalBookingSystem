import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

// fetch all customer (for staff)
export const fetchCustomers = createAsyncThunk('customer/fetchCustomers', async (__dirname, { rejectWithValue }) => {
    try {
        const response = await api.get('/staff/customers');
        return response.data.data;
        
    } catch (error) {
        console.error('Fetch customers error:', error.response?.data | error.message);
        return rejectWithValue(error.response?.data || 'failed to fetch customers');
    }
});

// fetch customer profile (for customer dashboard)
export const fetchCustomerProfile = createAsyncThunk('customers/fetchCustomerProfile', async (customerId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/customer/profile/${customerId}`);
        return response.data.data;
    } catch (error) {
        console.error('Fetch profile error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'failed to fetch profile');
    }
});

// Update membership
export const updateMembership = createAsyncThunk('customer/updatedMembership', async ({ customerId, membershipData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/customer/membership/${customerId}`, membershipData);
        return response.data.data;
    } catch (error) {
        console.error('Update membership error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to update membership');
    }
});

// Fetch notifications
export const fetchNotifications = createAsyncThunk('customers/fetchNotifications', async (customerId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/customer/notifications/${customerId}`);
        return response.data.data;
    } catch (error) {
        console.error('Fetch notifications error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
});

// mark notificaition as read
export const markNotificationRead = createAsyncThunk('customers/markNotificationRead', async ({ customerId, notificationId }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/customer/notifications/${customerId}/${notificationId}/read`, {});
        return response.data.data;
    } catch (error) {
        console.error('Mark notification read error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to mark notification read');
    }
});

// submit feedback
export const submitFeedback = createAsyncThunk('customers/submitFeedback', async ({ customerId, feedbackData }, { rejectWithValue }) => {
    try {
        const response = await api.post(`/customer/feedback/${customerId}`, feedbackData);
        return response.data.data;
    } catch (error) {
        console.error('Submit feedback error:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || 'Failed to submit feedback');
    }
});

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        profile: null,
        notifications: [],
        feedback: [],
        status: 'idle',
        notificationStatus: 'idle',
        feedbackStatus: 'idle',
        error: null,
        notificationError: null,
        feedbackError: null,
    },

    reducers: [],
    extraReducers: (builder) => {
        builder
        // Fetch Customers
        .addCase(fetchCustomers.pending, (state) => {
            state.status = 'loading';
        })

        .addCase(fetchCustomers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.customers = action.payload;
            state.error = null;
        })

        .addCase(fetchCustomers.rejected, (state, action) => {
            state.status = 'failed';
            state.error= action.payload || action.error.message;
        })

        // Fecth Customer Profile
        .addCase(fetchCustomerProfile.pending, (state) => {
            state.status = 'loading';
        })

        .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.profile = action.payload;
            state.error = null;
        })

        .addCase(fetchCustomerProfile.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
        })

        // Update Membership
        .addCase(updateMembership.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.profile = { ...state.profile, membership: action.payload };
            const index = state.customers.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) state.customers[index].membership = action.payload;
            state.error = null;
          })

          .addCase(updateMembership.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || action.error.message;
          })

           // Fetch Notifications
        .addCase(fetchNotifications.pending, (state) => {
            state.notificationStatus = 'loading';
        })
        .addCase(fetchNotifications.fulfilled, (state, action) => {
            state.notificationStatus = 'succeeded';
            state.notifications = action.payload;
            state.notificationError = null;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
            state.notificationStatus = 'failed';
            state.notificationError = action.payload || action.error.message;
        })


        // Submit Feedback
        .addCase(submitFeedback.pending, (state) => {
            state.feedbackStatus = 'loading';
        })

        .addCase(submitFeedback.fulfilled, (state, action) => {
            state.feedbackStatus = 'succeeded';
            state.feedback.push(action.payload);
            state.feedbackError = null;
        })

        .addCase(submitFeedback.rejected, (state, action) => {
            state.feedbackStatus = 'failed';
            state.feedbackError = action.payload || action.error.message;
        });

    },
});

export default customerSlice.reducer;