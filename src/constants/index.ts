export const API_URL = import.meta.env.VITE_API_URL

export const USERS_PER_PAGE = 6

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const THEME_STORAGE_KEY = 'themeMode'