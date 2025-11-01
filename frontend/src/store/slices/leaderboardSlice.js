import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { BACKEND_URL } from '../../constant'

// Async thunks for leaderboard operations
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ page = 1, limit = 10, timeframe = 'all' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/leaderboard`, {
        params: { page, limit, timeframe }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard')
    }
  }
)

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/my-rank`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user rank')
    }
  }
)

export const fetchTopContributors = createAsyncThunk(
  'leaderboard/fetchTopContributors',
  async ({ limit = 5, timeframe = 'month' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/top-contributors`, {
        params: { limit, timeframe }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top contributors')
    }
  }
)

const initialState = {
  leaderboard: [],
  topContributors: [],
  userRank: null,
  totalUsers: 0,
  currentPage: 1,
  loading: false,
  error: null,
  timeframe: 'all', // 'all', 'month', 'week'
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setTimeframe: (state, action) => {
      state.timeframe = action.payload
    },
    updateUserPoints: (state, action) => {
      const { userId, points } = action.payload
      
      // Update user in leaderboard if present
      const userIndex = state.leaderboard.findIndex(user => user._id === userId)
      if (userIndex !== -1) {
        state.leaderboard[userIndex].ecoPoints = points
        
        // Re-sort leaderboard by points
        state.leaderboard.sort((a, b) => b.ecoPoints - a.ecoPoints)
        
        // Update ranks
        state.leaderboard.forEach((user, index) => {
          user.rank = index + 1
        })
      }
      
      // Update user rank if it's the current user
      if (state.userRank && state.userRank.userId === userId) {
        state.userRank.ecoPoints = points
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false
        state.leaderboard = action.payload.leaderboard
        state.totalUsers = action.payload.total
        state.currentPage = action.payload.page
        state.error = null
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch User Rank
      .addCase(fetchUserRank.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.loading = false
        state.userRank = action.payload
        state.error = null
      })
      .addCase(fetchUserRank.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Top Contributors
      .addCase(fetchTopContributors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopContributors.fulfilled, (state, action) => {
        state.loading = false
        state.topContributors = action.payload
        state.error = null
      })
      .addCase(fetchTopContributors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setTimeframe, updateUserPoints } = leaderboardSlice.actions
export default leaderboardSlice.reducer