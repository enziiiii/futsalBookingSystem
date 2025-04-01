import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";


export const fetchUsersByRole = createAsyncThunk('users/fetchUsersByRole', async({ role }) => {
    const response = await api.get(`admin/users?role=${role}`);
    console.log('API Response:', response.data);
    // return response.data;
    return response.data.data; // Return the array inside the 'data'
    
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
    const response = await api.post('/admin/users', user);
    console.log('API Response:', response.data);
    return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, user }) => {
    const allowedFields = ["username", "fullName", "email", "passwordHash", "phoneNumber"];
    const filteredUser = Object.fromEntries(
        Object.entries(user).filter(([key]) => allowedFields.includes(key))
    );

    console.log('Sending update data to API:', filteredUser);
    const response = await api.put(`admin/users/${userId}`, filteredUser);
    return response.data;
});

export const deleteUser = createAsyncThunk('/admin/users/deleteUser', async (userId) => {
    await api.delete(`/users/${userId}`);
    return userId;
});


const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        status: 'idle',
        error: null,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersByRole.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(fetchUsersByRole.fulfilled, (state, action) => {
                state.status = 'Succeedded';
                state.users = action.payload;
                // state.users = Array.isArray(action.payload.data) ? action.payload : [];
                console.log('Assigned state.users:', state.users);
            })

            .addCase(fetchUsersByRole.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('Error fectching users:', action.error);
            })

            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })

            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((user) => user.user_id === action.payload.user_id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user.user_id !== action.payload);
            });
    },
});


export default userSlice.reducer;