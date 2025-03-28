import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers/authSlice";
import authReducer from './reducers/authSlice';
import courtReducer from './reducers/courtsSlice';



export const store = configureStore({
    reducer: {
        auth: authReducer,
        courts: courtReducer
    },
});