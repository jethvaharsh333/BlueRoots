import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { BACKEND_URL } from '../../constant'

// Async thunks for alert operations
export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/alerts/create`, alertData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create alert')
    }
  }
)

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async ({ page = 1, limit = 10, status, severity }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/alerts`, {
        params: { page, limit, status, severity }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts')
    }
  }
)

export const fetchAlertById = createAsyncThunk(
  'alerts/fetchAlertById',
  async (alertId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/alerts/${alertId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alert')
    }
  }
)

export const updateAlertStatus = createAsyncThunk(
  'alerts/updateAlertStatus',
  async ({ alertId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/alerts/${alertId}/status`, {
        status,
        notes,
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update alert status')
    }
  }
)

export const assignAlert = createAsyncThunk(
  'alerts/assignAlert',
  async ({ alertId, assignedTo }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/alerts/${alertId}/assign`, {
        assignedTo,
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign alert')
    }
  }
)

export const fetchAlertAnalytics = createAsyncThunk(
  'alerts/fetchAlertAnalytics',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/alerts/analytics`, {
        params: { startDate, endDate }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alert analytics')
    }
  }
)

const initialState = {
  alerts: [],
  currentAlert: null,
  analytics: null,
  totalAlerts: 0,
  currentPage: 1,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
}

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.createError = null
      state.updateError = null
    },
    clearCurrentAlert: (state) => {
      state.currentAlert = null
    },
    updateAlertLocally: (state, action) => {
      const { alertId, updates } = action.payload
      
      // Update in alerts array
      const alertIndex = state.alerts.findIndex(alert => alert._id === alertId)
      if (alertIndex !== -1) {
        state.alerts[alertIndex] = { ...state.alerts[alertIndex], ...updates }
      }
      
      // Update current alert if it matches
      if (state.currentAlert && state.currentAlert._id === alertId) {
        state.currentAlert = { ...state.currentAlert, ...updates }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Alert
      .addCase(createAlert.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.createLoading = false
        state.alerts.unshift(action.payload)
        state.createError = null
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload
      })
      
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.alerts = action.payload.alerts
        state.totalAlerts = action.payload.total
        state.currentPage = action.payload.page
        state.error = null
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Alert by ID
      .addCase(fetchAlertById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlertById.fulfilled, (state, action) => {
        state.loading = false
        state.currentAlert = action.payload
        state.error = null
      })
      .addCase(fetchAlertById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update Alert Status
      .addCase(updateAlertStatus.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updateAlertStatus.fulfilled, (state, action) => {
        state.updateLoading = false
        const updatedAlert = action.payload
        
        // Update in alerts array
        const alertIndex = state.alerts.findIndex(alert => alert._id === updatedAlert._id)
        if (alertIndex !== -1) {
          state.alerts[alertIndex] = updatedAlert
        }
        
        // Update current alert if it matches
        if (state.currentAlert && state.currentAlert._id === updatedAlert._id) {
          state.currentAlert = updatedAlert
        }
        
        state.updateError = null
      })
      .addCase(updateAlertStatus.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })
      
      // Assign Alert
      .addCase(assignAlert.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(assignAlert.fulfilled, (state, action) => {
        state.updateLoading = false
        const updatedAlert = action.payload
        
        // Update in alerts array
        const alertIndex = state.alerts.findIndex(alert => alert._id === updatedAlert._id)
        if (alertIndex !== -1) {
          state.alerts[alertIndex] = updatedAlert
        }
        
        // Update current alert if it matches
        if (state.currentAlert && state.currentAlert._id === updatedAlert._id) {
          state.currentAlert = updatedAlert
        }
        
        state.updateError = null
      })
      .addCase(assignAlert.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload
      })
      
      // Fetch Alert Analytics
      .addCase(fetchAlertAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlertAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload
        state.error = null
      })
      .addCase(fetchAlertAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentAlert, updateAlertLocally } = alertSlice.actions
export default alertSlice.reducer