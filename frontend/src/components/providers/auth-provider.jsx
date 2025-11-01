import { createContext, useContext, useEffect } from 'react'
import { useAppDispatch, useAuth } from '../../store/hooks'
import { fetchUserProfile } from '../../store/slices/userSlice'
import { setCredentials } from '../../store/slices/authSlice'
import Cookies from 'js-cookie'

const AuthContext = createContext({})

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, loading } = useAuth()

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get('accessToken')
      const refreshToken = Cookies.get('refreshToken')

      if (accessToken && refreshToken && !user) {
        try {
          // Fetch user profile if tokens exist but user data is missing
          const result = await dispatch(fetchUserProfile())
          
          if (fetchUserProfile.fulfilled.match(result)) {
            dispatch(setCredentials({
              user: result.payload,
              accessToken,
              refreshToken,
            }))
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          // Clear invalid tokens
          Cookies.remove('accessToken')
          Cookies.remove('refreshToken')
        }
      }
    }

    initializeAuth()
  }, [dispatch, user])

  const value = {
    isAuthenticated,
    user,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}