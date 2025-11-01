import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authApi";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        role: null,
        isAuthenticated: null,
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            console.log("EXTRA-REDUCER");
            console.log(action.payload);
            state.user = action.payload.data.user;
            state.role = action.payload.data.role;
            state.isAuthenticated = true;
        })

    }
});

export const { } = authSlice.actions;
export default authSlice.reducer;