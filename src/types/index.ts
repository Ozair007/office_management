// User types
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  image?: string
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

// Auth types
export interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signOut: () => void
}

export interface LoginResponse extends User {
  accessToken: string
  refreshToken: string
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}

export interface SignInData {
  username: string
  password: string
}

// User management types
export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  username: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
}
