import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Har request mein JWT token automatically add hoga
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexaverse_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 aane par automatically logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexaverse_token')
      localStorage.removeItem('nexaverse_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api


