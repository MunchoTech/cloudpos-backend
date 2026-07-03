import axios from 'axios'

const API_BASE = 'https://resplendent-truth-production-c715.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cloudpos_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cloudpos_token')
      localStorage.removeItem('cloudpos_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
