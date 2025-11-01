import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { BACKEND_URL } from '../../constant'

// Async thunks for user operations
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/profile`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/user/profile`, profileData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/user/password`, {
        currentPassword,
        newPassword,
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password')
    }
  }
)

// For government users to create NGO accounts
export const createNgoUser = createAsyncThunk(
  'user/createNgoUser',
  async (ngoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/create-ngo`, ngoData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create NGO user')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async ({ role, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/all`, {
        params: { role, page, limit }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

const initialState = {
  profile: null,
  users: [],
  totalUsers: 0,
  currentPage: 1,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.updateError = null
    },
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false
        state.profile = action.payload
        state.updateError = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })
      
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.updateLoading = false
        state.updateError = null
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })
      
      // Create NGO User
      .addCase(createNgoUser.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(createNgoUser.fulfilled, (state, action) => {
        state.updateLoading = false
        state.users.push(action.payload)
        state.updateError = null
      })
      .addCase(createNgoUser.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })
      
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
        state.totalUsers = action.payload.total
        state.currentPage = action.payload.page
        state.error = null
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, updateProfileLocally } = userSlice.actions
export default userSlice.reducer