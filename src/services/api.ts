import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add the token to requests if it exists
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle common API errors
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    
    // Handle 403 Forbidden (subscription-related)
    if (error.response && error.response.status === 403) {
      if (error.response.data.message.includes('subscription')) {
        // Redirect to subscription plans page if it's a subscription-related error
        window.location.href = '/dashboard/subscription/plans'
      }
    }
    
    return Promise.reject(error)
  }
)

export default {
  get: (url: string, params = {}) => instance.get(url, { params }),
  post: (url: string, data = {}) => instance.post(url, data),
  put: (url: string, data = {}) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),
  
  // Set the auth token for the API instance
  setToken: (token: string) => {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  
  // Remove the auth token from the API instance
  removeToken: () => {
    delete instance.defaults.headers.common.Authorization
  }
}