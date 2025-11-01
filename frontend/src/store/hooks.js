import { useDispatch, useSelector } from 'react-redux'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

// Custom hooks for common selectors
export const useAuth = () => {
  return useAppSelector((state) => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    error: state.auth.error,
    accessToken: state.auth.accessToken,
  }))
}

export const useUser = () => {
  return useAppSelector((state) => ({
    profile: state.user.profile,
    users: state.user.users,
    loading: state.user.loading,
    error: state.user.error,
    updateLoading: state.user.updateLoading,
    updateError: state.user.updateError,
  }))
}

export const useReports = () => {
  return useAppSelector((state) => ({
    reports: state.reports.reports,
    pendingReports: state.reports.pendingReports,
    currentReport: state.reports.currentReport,
    analytics: state.reports.analytics,
    totalReports: state.reports.totalReports,
    loading: state.reports.loading,
    error: state.reports.error,
    createLoading: state.reports.createLoading,
    createError: state.reports.createError,
    verifyLoading: state.reports.verifyLoading,
    verifyError: state.reports.verifyError,
  }))
}

export const useAlerts = () => {
  return useAppSelector((state) => ({
    alerts: state.alerts.alerts,
    currentAlert: state.alerts.currentAlert,
    analytics: state.alerts.analytics,
    totalAlerts: state.alerts.totalAlerts,
    loading: state.alerts.loading,
    error: state.alerts.error,
    createLoading: state.alerts.createLoading,
    createError: state.alerts.createError,
    updateLoading: state.alerts.updateLoading,
    updateError: state.alerts.updateError,
  }))
}

export const useLeaderboard = () => {
  return useAppSelector((state) => ({
    leaderboard: state.leaderboard.leaderboard,
    topContributors: state.leaderboard.topContributors,
    userRank: state.leaderboard.userRank,
    totalUsers: state.leaderboard.totalUsers,
    loading: state.leaderboard.loading,
    error: state.leaderboard.error,
    timeframe: state.leaderboard.timeframe,
  }))
}

export const useAnalytics = () => {
  return useAppSelector((state) => ({
    dashboardStats: state.analytics.dashboardStats,
    reportTrends: state.analytics.reportTrends,
    categoryDistribution: state.analytics.categoryDistribution,
    geographicData: state.analytics.geographicData,
    hotspots: state.analytics.hotspots,
    userEngagement: state.analytics.userEngagement,
    responseTimes: state.analytics.responseTimes,
    loading: state.analytics.loading,
    error: state.analytics.error,
    lastUpdated: state.analytics.lastUpdated,
  }))
}