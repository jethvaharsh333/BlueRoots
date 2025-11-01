import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { BACKEND_URL } from '../../constant'

// Async thunks for report operations
export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      
      // Append all report data to FormData
      Object.keys(reportData).forEach(key => {
        if (key === 'images' && Array.isArray(reportData[key])) {
          reportData[key].forEach(image => {
            formData.append('images', image)
          })
        } else {
          formData.append(key, reportData[key])
        }
      })
      
      const response = await axios.post(`${BACKEND_URL}/reports/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create report')
    }
  }
)

export const fetchMyReports = createAsyncThunk(
  'reports/fetchMyReports',
  async ({ page = 1, limit = 10, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/reports/my-history`, {
        params: { page, limit, status }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports')
    }
  }
)

export const fetchReportById = createAsyncThunk(
  'reports/fetchReportById',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/reports/${reportId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report')
    }
  }
)

// For NGO users
export const fetchPendingReports = createAsyncThunk(
  'reports/fetchPendingReports',
  async ({ page = 1, limit = 10, category }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/reports/pending`, {
        params: { page, limit, category }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending reports')
    }
  }
)

export const verifyReport = createAsyncThunk(
  'reports/verifyReport',
  async ({ reportId, action, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/reports/verify`, {
        reportId,
        action, // 'verify', 'reject', or 'flag'
        reason,
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify report')
    }
  }
)

export const fetchReportsAnalytics = createAsyncThunk(
  'reports/fetchReportsAnalytics',
  async ({ startDate, endDate, category }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/reports/analytics`, {
        params: { startDate, endDate, category }
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics')
    }
  }
)

const initialState = {
  reports: [],
  pendingReports: [],
  currentReport: null,
  analytics: null,
  totalReports: 0,
  currentPage: 1,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  verifyLoading: false,
  verifyError: null,
}

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.createError = null
      state.verifyError = null
    },
    clearCurrentReport: (state) => {
      state.currentReport = null
    },
    updateReportStatus: (state, action) => {
      const { reportId, status } = action.payload
      
      // Update in reports array
      const reportIndex = state.reports.findIndex(report => report._id === reportId)
      if (reportIndex !== -1) {
        state.reports[reportIndex].status = status
      }
      
      // Update in pending reports array
      const pendingIndex = state.pendingReports.findIndex(report => report._id === reportId)
      if (pendingIndex !== -1) {
        if (status !== 'pending') {
          state.pendingReports.splice(pendingIndex, 1)
        } else {
          state.pendingReports[pendingIndex].status = status
        }
      }
      
      // Update current report if it matches
      if (state.currentReport && state.currentReport._id === reportId) {
        state.currentReport.status = status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Report
      .addCase(createReport.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.createLoading = false
        state.reports.unshift(action.payload)
        state.createError = null
      })
      .addCase(createReport.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload
      })
      
      // Fetch My Reports
      .addCase(fetchMyReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload.reports
        state.totalReports = action.payload.total
        state.currentPage = action.payload.page
        state.error = null
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Report by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false
        state.currentReport = action.payload
        state.error = null
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Pending Reports (NGO)
      .addCase(fetchPendingReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPendingReports.fulfilled, (state, action) => {
        state.loading = false
        state.pendingReports = action.payload.reports
        state.totalReports = action.payload.total
        state.currentPage = action.payload.page
        state.error = null
      })
      .addCase(fetchPendingReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Verify Report (NGO)
      .addCase(verifyReport.pending, (state) => {
        state.verifyLoading = true
        state.verifyError = null
      })
      .addCase(verifyReport.fulfilled, (state, action) => {
        state.verifyLoading = false
        const updatedReport = action.payload
        
        // Remove from pending reports
        state.pendingReports = state.pendingReports.filter(
          report => report._id !== updatedReport._id
        )
        
        state.verifyError = null
      })
      .addCase(verifyReport.rejected, (state, action) => {
        state.verifyLoading = false
        state.verifyError = action.payload
      })
      
      // Fetch Reports Analytics
      .addCase(fetchReportsAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReportsAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload
        state.error = null
      })
      .addCase(fetchReportsAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentReport, updateReportStatus } = reportSlice.actions
export default reportSlice.reducer