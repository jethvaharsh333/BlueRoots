import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import reportSlice from './slices/reportSlice'
import alertSlice from './slices/alertSlice'
import leaderboardSlice from './slices/leaderboardSlice'
import analyticsSlice from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    reports: reportSlice,
    alerts: alertSlice,
    leaderboard: leaderboardSlice,
    analytics: analyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// export type RootState = store.getState
// export type AppDispatch = store.dispatch