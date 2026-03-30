import { create } from 'zustand'

const useThemeStore = create((set) => ({
  theme: 'cyber',
  setTheme: (theme) => set({ theme }),
}))

export default useThemeStore