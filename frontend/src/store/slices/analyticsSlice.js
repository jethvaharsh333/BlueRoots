import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { BACKEND_URL } from '../../constant'

// Async thunks for analytics operations
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async ({ role, timeframe = 'month' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/dashboard`, {
        params: { role, timeframe }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  }
)

export const fetchReportTrends = createAsyncThunk(
  'analytics/fetchReportTrends',
  async ({ startDate, endDate, groupBy = 'day' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/report-trends`, {
        params: { startDate, endDate, groupBy }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report trends')
    }
  }
)

export const fetchCategoryDistribution = createAsyncThunk(
  'analytics/fetchCategoryDistribution',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/category-distribution`, {
        params: { startDate, endDate }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category distribution')
    }
  }
)

export const fetchGeographicData = createAsyncThunk(
  'analytics/fetchGeographicData',
  async ({ startDate, endDate, zoom = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/geographic`, {
        params: { startDate, endDate, zoom }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch geographic data')
    }
  }
)

export const fetchHotspots = createAsyncThunk(
  'analytics/fetchHotspots',
  async ({ radius = 1000, minReports = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/hotspots`, {
        params: { radius, minReports }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hotspots')
    }
  }
)

export const fetchUserEngagement = createAsyncThunk(
  'analytics/fetchUserEngagement',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/user-engagement`, {
        params: { startDate, endDate }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user engagement')
    }
  }
)

export const fetchResponseTimes = createAsyncThunk(
  'analytics/fetchResponseTimes',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/response-times`, {
        params: { startDate, endDate }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch response times')
    }
  }
)

const initialState = {
  dashboardStats: null,
  reportTrends: [],
  categoryDistribution: [],
  geographicData: [],
  hotspots: [],
  userEngagement: null,
  responseTimes: null,
  loading: false,
  error: null,
  lastUpdated: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAnalytics: (state) => {
      state.dashboardStats = null
      state.reportTrends = []
      state.categoryDistribution = []
      state.geographicData = []
      state.hotspots = []
      state.userEngagement = null
      state.responseTimes = null
      state.lastUpdated = null
    },
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString()
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.dashboardStats = action.payload
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Report Trends
      .addCase(fetchReportTrends.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReportTrends.fulfilled, (state, action) => {
        state.loading = false
        state.reportTrends = action.payload
        state.error = null
      })
      .addCase(fetchReportTrends.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Category Distribution
      .addCase(fetchCategoryDistribution.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoryDistribution.fulfilled, (state, action) => {
        state.loading = false
        state.categoryDistribution = action.payload
        state.error = null
      })
      .addCase(fetchCategoryDistribution.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Geographic Data
      .addCase(fetchGeographicData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGeographicData.fulfilled, (state, action) => {
        state.loading = false
        state.geographicData = action.payload
        state.error = null
      })
      .addCase(fetchGeographicData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Hotspots
      .addCase(fetchHotspots.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHotspots.fulfilled, (state, action) => {
        state.loading = false
        state.hotspots = action.payload
        state.error = null
      })
      .addCase(fetchHotspots.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch User Engagement
      .addCase(fetchUserEngagement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserEngagement.fulfilled, (state, action) => {
        state.loading = false
        state.userEngagement = action.payload
        state.error = null
      })
      .addCase(fetchUserEngagement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Response Times
      .addCase(fetchResponseTimes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResponseTimes.fulfilled, (state, action) => {
        state.loading = false
        state.responseTimes = action.payload
        state.error = null
      })
      .addCase(fetchResponseTimes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearAnalytics, updateLastUpdated } = analyticsSlice.actions
export default analyticsSlice.reducer