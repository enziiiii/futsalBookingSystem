import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlice';
import courtReducer from './reducers/courtsSlice';
import userReducer from './reducers/userSlice';
import bookReducer from './reducers/bookSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courts: courtReducer,
        users: userReducer,
        bookings: bookReducer,
    },
});