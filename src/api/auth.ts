import apiClient from './apiClient'
import type { User, LoginResponse, SignUpData, SignInData } from '@/types'

export type { User }

export async function login(data: SignInData): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data)
  return response.data
}

export async function signUp(data: SignUpData): Promise<User> {
  const response = await apiClient.post<User>('/users/add', data)
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}
