import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nexaverse_user')) || null,
  token: localStorage.getItem('nexaverse_token') || null,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('nexaverse_token', token)
    localStorage.setItem('nexaverse_user', JSON.stringify(user))
    set({ user, token, error: null })
  },

  logout: () => {
    localStorage.removeItem('nexaverse_token')
    localStorage.removeItem('nexaverse_user')
    set({ user: null, token: null })
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export default useAuthStore