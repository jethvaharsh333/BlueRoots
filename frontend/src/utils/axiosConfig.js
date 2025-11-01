import axios from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_URL } from '../constant'
import { store } from '../store'
import { refreshToken, clearCredentials } from '../store/slices/authSlice'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const result = await store.dispatch(refreshToken())
        
        if (refreshToken.fulfilled.match(result)) {
          // Retry the original request with new token
          const newToken = Cookies.get('accessToken')
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        } else {
          // Refresh failed, clear credentials and redirect to login
          store.dispatch(clearCredentials())
          Cookies.remove('accessToken')
          Cookies.remove('refreshToken')
          window.location.href = '/auth/login'
        }
      } catch (refreshError) {
        // Refresh failed, clear credentials and redirect to login
        store.dispatch(clearCredentials())
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance