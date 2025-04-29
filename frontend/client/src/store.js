import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlice';
import courtReducer from './reducers/courtsSlice';
import userReducer from './reducers/userSlice';
import bookReducer from './reducers/bookSlice';
import customerReducer from './reducers/customerSlice'
import analyticsReducer from './reducers/analyticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courts: courtReducer,
        users: userReducer,
        booking: bookReducer,
        customer: customerReducer,
        analytics: analyticsReducer,
    },
});