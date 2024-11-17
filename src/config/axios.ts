import axios from 'axios'

const api = axios.create({
  baseURL: 'https://anascrew-6b546-default-rtdb.europe-west1.firebasedatabase.app',
  timeout: 5000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
