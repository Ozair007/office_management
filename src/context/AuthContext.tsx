import { useState, useEffect, type ReactNode } from 'react'
import { login, signUp as apiSignUp, getCurrentUser } from '@/api/auth'
import type { User, SignInData, SignUpData } from '@/types'
import { AuthContext } from '../hooks/useAuth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } catch {
          localStorage.removeItem('token')
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const signUp = async (data: SignUpData) => {
    const newUser = await apiSignUp(data)
    const loginResponse = await login({
      username: data.username,
      password: data.password,
    })
    localStorage.setItem('token', loginResponse.accessToken)
    setUser(newUser)
  }

  const signIn = async (data: SignInData) => {
    const response = await login(data)
    localStorage.setItem('token', response.accessToken)
    setUser(response)
  }

  const signOut = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}