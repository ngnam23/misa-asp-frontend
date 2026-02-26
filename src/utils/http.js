import axios from 'axios'

// Tạo axios instance
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7122/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error.response?.status
    const data = error.response?.data

    return Promise.reject({
      status,
      message: data?.message || error.message,
      data,
    })
  },
)

export default http
