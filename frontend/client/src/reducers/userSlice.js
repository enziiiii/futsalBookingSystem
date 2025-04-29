import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";


export const fetchUsersByRole = createAsyncThunk('users/fetchUsersByRole', async({ role }) => {
    const response = await api.get(`/admin/users?role=${role}`);
    console.log('From userSlice, Full API Response:', response);
    console.log('API Data:', response.data);
    return response.data.data; // Return the array inside the 'data' or Handle both response formats
    
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
    console.log("From userSlice addUser",user);
    try {
        const response = await api.post('/admin/users', user);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding users:', error.response?.data || error.message);
        throw error;
    }
    
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, user }) => {
    const allowedFields = ["username", "fullName", "email", "phoneNumber"];
    const filteredUser = Object.fromEntries(
        Object.entries(user).filter(([key]) => allowedFields.includes(key))
    );

    console.log('From userSlice.js, Sending update data to API:', filteredUser);
    const response = await api.put(`admin/users/${userId}`, filteredUser);
    return response.data.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, { rejectWithValue }) => {
   try {
    await api.delete(`/admin/users/${userId}`);
    return userId;
   } catch (error) {
    return rejectWithValue(error.response.data);
   }
});

// to update roles
export const updateUserRoles = createAsyncThunk('users/updateUserRoles', async ({ userId, roles }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/admin/users/${userId}/roles`, { roles });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Failed to updated roles' });
    }
});


const userSlice = createSlice({
    name: 'users',
    initialState: {
        usersByRole: { customer: [], staff: [] },
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
                state.status = 'Succeeded';
                const { role } = action.meta.arg;           // Extract the rolepassed to the thunk
                state.usersByRole[role] = action.payload;   // Store users under the respective role
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
                const updatedUser = action.payload;
                for (const role in state.usersByRole) {
                    const index = state.usersByRole[role]?.findIndex((user) => user.user_id === updatedUser.user_id);
                    if (index !== -1) {
                        state.usersByRole[index] = { ...state.usersByRole[role][index], ...updatedUser };
                    }
                }
                state.status = 'succeeded';
            })

            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(updateUserRoles.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                for ( const role in state.usersByRole) {
                    state.usersByRole[role] = state.usersByRole[role].filter((user) => user.user_id !== updatedUser.user_id);
                }
                updatedUser.roles.forEach((role) => {
                    if (!state.usersByRole[role]) {
                        state.usersByRole[role] = [];
                    }
                    state.usersByRole[role].push(updatedUser);
                });
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                const userId = action.payload;
                for (const role in state.usersByRole) {
                    state.usersByRole[role] = state.usersByRole[role].filter(user => user.user_id !== userId); 
                }
            });
    },
});


export default userSlice.reducer;