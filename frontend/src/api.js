import axios from 'axios'

// Token storage helpers
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

export const setTokens = (access, refresh, user) => {
  if (access) localStorage.setItem(TOKEN_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const isAuthenticated = () => !!getAccessToken()

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: s => s >= 200 && s < 300,
  timeout: 15000,
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Try to refresh the token
        const response = await axios.post(
          'http://localhost:8000/api/auth/token/refresh/',
          { refresh: refreshToken }
        )

        const { access } = response.data
        setTokens(access, refreshToken, getUser())

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Authentication functions
export async function register(userData) {
  const { data } = await api.post('auth/register/', userData)
  if (data.tokens) {
    setTokens(data.tokens.access, data.tokens.refresh, data.user)
  }
  return data
}

export async function login(credentials) {
  const { data } = await api.post('auth/login/', credentials)
  if (data.tokens) {
    setTokens(data.tokens.access, data.tokens.refresh, data.user)
  }
  return data
}

export async function logout() {
  try {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      await api.post('auth/logout/', { refresh: refreshToken })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    clearTokens()
  }
}

export async function getProfile() {
  const { data } = await api.get('auth/profile/')
  setTokens(getAccessToken(), getRefreshToken(), data)
  return data
}

export async function updateProfile(userData) {
  const { data } = await api.patch('auth/profile/update/', userData)
  setTokens(getAccessToken(), getRefreshToken(), data)
  return data
}

export async function changePassword(passwordData) {
  const { data } = await api.post('auth/change-password/', passwordData)
  return data
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('auth/password-reset/', { email })
  return data
}

export async function confirmPasswordReset(token, passwordData) {
  const { data } = await api.post('auth/password-reset/confirm/', {
    token,
    ...passwordData,
  })
  return data
}

// Notes functions
export async function listNotes() {
  const { data } = await api.get('notes/')
  return data
}

export async function createNote(payload) {
  const { data } = await api.post('notes/', payload)
  return data
}

export async function getNote(id) {
  const { data } = await api.get(`notes/${id}/`)
  return data
}

export async function updateNote(id, payload) {
  const { data } = await api.patch(`notes/${id}/`, payload)
  return data
}

export async function deleteNote(id) {
  const { data } = await api.delete(`notes/${id}/`)
  return data
}

export async function summarize(id) {
  const { data } = await api.post(`notes/${id}/summarize/`)
  return data
}

export async function generateQuiz(id) {
  const { data } = await api.post(`notes/${id}/generate-quiz/`)
  return data
}

export async function generateFlashcards(id) {
  const { data } = await api.post(`notes/${id}/generate-flashcards/`)
  return data
}

export async function submitQuiz(id, answers) {
  const { data } = await api.post(`notes/${id}/submit-quiz/`, { answers })
  return data
}

export async function flashcardReviewed(id) {
  const { data } = await api.post(`notes/${id}/flashcard-reviewed/`)
  return data
}

