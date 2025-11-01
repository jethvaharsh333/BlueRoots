# Redux Integration Guide for Blue Roots

This guide explains how Redux has been integrated into your Blue Roots environmental reporting platform and how to use it effectively.

## 🏗️ Redux Architecture Overview

### Store Structure
```
src/store/
├── index.js                 # Store configuration
├── hooks.js                 # Custom Redux hooks
└── slices/
    ├── authSlice.js         # Authentication state
    ├── userSlice.js         # User profile & management
    ├── reportSlice.js       # Environmental reports
    ├── alertSlice.js        # Government alerts
    ├── leaderboardSlice.js  # Gamification & rankings
    └── analyticsSlice.js    # Dashboard analytics
```

## 🚀 Getting Started

### 1. Store Setup
The Redux store is already configured in `src/store/index.js` and connected to your app in `src/main.jsx`:

```jsx
import { Provider } from 'react-redux'
import { store } from './store'

// App wrapped with Redux Provider
<Provider store={store}>
  <App />
</Provider>
```

### 2. Using Redux in Components

#### Import Custom Hooks
```jsx
import { useAppDispatch, useAuth, useReports, useUser } from '../store/hooks'
```

#### Basic Usage Pattern
```jsx
const MyComponent = () => {
  const dispatch = useAppDispatch()
  const { user, loading, error } = useAuth()
  
  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])
  
  return (
    <div>
      {loading ? 'Loading...' : user?.username}
    </div>
  )
}
```

## 📋 Available Slices & Actions

### 1. Authentication Slice (`authSlice.js`)

**State:**
- `user`: Current user object
- `isAuthenticated`: Boolean authentication status
- `accessToken`: JWT access token
- `loading`: Loading state for auth operations
- `error`: Error messages

**Actions:**
```jsx
import { loginUser, registerUser, logoutUser, refreshToken } from '../store/slices/authSlice'

// Login
dispatch(loginUser({ email, password }))

// Register
dispatch(registerUser({ username, email, password, role }))

// Logout
dispatch(logoutUser())

// Refresh token
dispatch(refreshToken())
```

**Custom Hook:**
```jsx
const { user, isAuthenticated, loading, error } = useAuth()
```

### 2. User Slice (`userSlice.js`)

**State:**
- `profile`: User profile data
- `users`: List of users (for admin)
- `loading`: Loading states
- `error`: Error messages

**Actions:**
```jsx
import { fetchUserProfile, updateUserProfile, createNgoUser } from '../store/slices/userSlice'

// Fetch profile
dispatch(fetchUserProfile())

// Update profile
dispatch(updateUserProfile({ username, email }))

// Create NGO user (Government only)
dispatch(createNgoUser({ username, email, password }))
```

### 3. Reports Slice (`reportSlice.js`)

**State:**
- `reports`: User's reports
- `pendingReports`: Reports pending verification (NGO)
- `currentReport`: Currently viewed report
- `analytics`: Report analytics data

**Actions:**
```jsx
import { createReport, fetchMyReports, verifyReport } from '../store/slices/reportSlice'

// Create new report
dispatch(createReport({
  category: 'cutting',
  notes: 'Description',
  latitude: 12.34,
  longitude: 56.78,
  images: [file1, file2]
}))

// Fetch user's reports
dispatch(fetchMyReports({ page: 1, limit: 10 }))

// Verify report (NGO only)
dispatch(verifyReport({ reportId, action: 'verify', reason: 'Valid report' }))
```

### 4. Alerts Slice (`alertSlice.js`)

**State:**
- `alerts`: List of alerts
- `currentAlert`: Currently viewed alert
- `analytics`: Alert analytics

**Actions:**
```jsx
import { createAlert, fetchAlerts, updateAlertStatus } from '../store/slices/alertSlice'

// Create alert (NGO only)
dispatch(createAlert({
  reportIds: ['report1', 'report2'],
  severity: 'critical',
  description: 'Urgent environmental issue'
}))

// Update alert status (Government only)
dispatch(updateAlertStatus({ alertId, status: 'investigating' }))
```

### 5. Leaderboard Slice (`leaderboardSlice.js`)

**State:**
- `leaderboard`: Ranked users list
- `topContributors`: Top contributors
- `userRank`: Current user's rank

**Actions:**
```jsx
import { fetchLeaderboard, fetchTopContributors } from '../store/slices/leaderboardSlice'

// Fetch leaderboard
dispatch(fetchLeaderboard({ page: 1, timeframe: 'month' }))

// Fetch top contributors
dispatch(fetchTopContributors({ limit: 5 }))
```

### 6. Analytics Slice (`analyticsSlice.js`)

**State:**
- `dashboardStats`: Dashboard statistics
- `reportTrends`: Report trends over time
- `categoryDistribution`: Report category breakdown
- `geographicData`: Geographic distribution of reports

**Actions:**
```jsx
import { fetchDashboardStats, fetchReportTrends } from '../store/slices/analyticsSlice'

// Fetch dashboard stats
dispatch(fetchDashboardStats({ role: 'citizen' }))

// Fetch report trends
dispatch(fetchReportTrends({ startDate, endDate, groupBy: 'day' }))
```

## 🎯 Role-Based Usage Examples

### Citizen Dashboard
```jsx
const CitizenDashboard = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { reports } = useReports()
  const { topContributors } = useLeaderboard()
  const { dashboardStats } = useAnalytics()

  useEffect(() => {
    dispatch(fetchMyReports({ limit: 4 }))
    dispatch(fetchTopContributors({ limit: 3 }))
    dispatch(fetchDashboardStats({ role: 'citizen' }))
  }, [dispatch])

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <div>Eco Points: {dashboardStats?.ecoPoints}</div>
      {/* Display recent reports, leaderboard, etc. */}
    </div>
  )
}
```

### NGO Verification
```jsx
const NgoVerification = () => {
  const dispatch = useAppDispatch()
  const { pendingReports, verifyLoading } = useReports()

  const handleVerify = (reportId) => {
    dispatch(verifyReport({ 
      reportId, 
      action: 'verify', 
      reason: 'Report verified by field inspection' 
    }))
  }

  return (
    <div>
      {pendingReports.map(report => (
        <div key={report._id}>
          <h3>{report.category}</h3>
          <button 
            onClick={() => handleVerify(report._id)}
            disabled={verifyLoading}
          >
            Verify Report
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Government Alerts
```jsx
const GovernmentAlerts = () => {
  const dispatch = useAppDispatch()
  const { alerts, updateLoading } = useAlerts()

  const handleStatusUpdate = (alertId, status) => {
    dispatch(updateAlertStatus({ 
      alertId, 
      status, 
      notes: 'Investigation in progress' 
    }))
  }

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert._id}>
          <h3>Alert: {alert.severity}</h3>
          <button 
            onClick={() => handleStatusUpdate(alert._id, 'investigating')}
            disabled={updateLoading}
          >
            Start Investigation
          </button>
        </div>
      ))}
    </div>
  )
}
```

## 🔧 Advanced Features

### Error Handling
```jsx
const MyComponent = () => {
  const { error } = useReports()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError()) // Clear error after showing
    }
  }, [error, dispatch])
}
```

### Loading States
```jsx
const MyComponent = () => {
  const { loading, createLoading, verifyLoading } = useReports()

  return (
    <div>
      {loading && <div>Loading reports...</div>}
      <button disabled={createLoading}>
        {createLoading ? 'Creating...' : 'Create Report'}
      </button>
    </div>
  )
}
```

### Optimistic Updates
```jsx
const updateReportLocally = (reportId, updates) => {
  dispatch(updateReportStatus({ reportId, status: 'verified' }))
}
```

## 🔐 Authentication Flow

1. **Login**: `dispatch(loginUser({ email, password }))`
2. **Token Storage**: Automatically stored in cookies
3. **Auto-refresh**: Handled by axios interceptors
4. **Route Protection**: Use `isAuthenticated` from `useAuth()`

```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/auth/login" />
  
  return children
}
```

## 📊 Real-time Updates

For real-time features, you can dispatch actions when receiving WebSocket events:

```jsx
useEffect(() => {
  const socket = io(BACKEND_URL)
  
  socket.on('reportVerified', (data) => {
    dispatch(updateReportStatus({ 
      reportId: data.reportId, 
      status: 'verified' 
    }))
    toast.success('Your report has been verified!')
  })
  
  return () => socket.disconnect()
}, [dispatch])
```

## 🎨 UI Integration

Redux state can be easily integrated with your existing UI components:

```jsx
const ReportCard = ({ report }) => {
  const dispatch = useAppDispatch()
  const { verifyLoading } = useReports()

  return (
    <motion.div className="report-card">
      <h3>{report.category}</h3>
      <p>{report.notes}</p>
      <Button 
        onClick={() => dispatch(verifyReport({ reportId: report._id }))}
        loading={verifyLoading}
      >
        Verify
      </Button>
    </motion.div>
  )
}
```

## 🚀 Migration from Existing Code

To migrate your existing components:

1. **Replace useState with Redux state**:
   ```jsx
   // Before
   const [user, setUser] = useState(null)
   
   // After
   const { user } = useAuth()
   ```

2. **Replace API calls with Redux actions**:
   ```jsx
   // Before
   const fetchData = async () => {
     const response = await axiosClient.get('/api/reports')
     setReports(response.data)
   }
   
   // After
   dispatch(fetchMyReports())
   ```

3. **Use Redux loading states**:
   ```jsx
   // Before
   const [loading, setLoading] = useState(false)
   
   // After
   const { loading } = useReports()
   ```

## 📝 Best Practices

1. **Use custom hooks**: Always use the custom hooks from `store/hooks.js`
2. **Handle errors**: Always check for and handle error states
3. **Clear errors**: Clear errors after displaying them to users
4. **Loading states**: Show appropriate loading indicators
5. **Optimistic updates**: Update UI immediately for better UX
6. **Type safety**: Consider adding TypeScript for better type safety

## 🔍 Debugging

Use Redux DevTools Extension for debugging:
- Install Redux DevTools browser extension
- View state changes in real-time
- Time-travel debugging
- Action replay

## 📚 Example Files

Check these example files to see Redux in action:
- `src/pages/citizen/citizen-dashboard-redux.jsx` - Complete dashboard with Redux
- `src/components/auth/login-form-redux.jsx` - Authentication with Redux
- `src/pages/citizen/new-report-redux.jsx` - Report creation with Redux

This Redux integration provides a robust, scalable state management solution for your Blue Roots platform, making it easier to manage complex state across different user roles and features.