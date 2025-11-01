import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from '../../constant';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (user, { rejectWithValue }) => {
        try {
            console.log("api fires as", `${BACKEND_URL}/auth/login`);

            const res = await axiosClient.post(`${BACKEND_URL}/auth/login`, user);
            localStorage.setItem("role", res.data.data.role);

            console.log("AUTH-SLICE");
            console.log(res.data);
            
            return res.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message || "Login failed");
        }
    }
);