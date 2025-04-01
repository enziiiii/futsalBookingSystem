import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers/authSlice";
import authReducer from './reducers/authSlice';
import courtReducer from './reducers/courtsSlice';
import userReducer from './reducers/userSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        courts: courtReducer,
        users: userReducer
    },
});