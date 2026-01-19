import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { login, signUp as apiSignUp, getCurrentUser } from '@/api/auth'
import type { User, SignInData, SignUpData } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
