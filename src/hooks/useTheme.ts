import type { ThemeContextType } from '@/constants'
import { createContext, useContext } from 'react'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeContext = createContext<ThemeContextType | null>(null)