import { USERS_PER_PAGE } from '@/constants'
import apiClient from './apiClient'
import type { User, UsersResponse, CreateUserData, UpdateUserData } from '@/types'

export async function getUsers(
  limit: number = USERS_PER_PAGE,
  skip: number = 0
): Promise<UsersResponse> {
  const response = await apiClient.get<UsersResponse>(
    `/users?limit=${limit}&skip=${skip}`
  )
  return response.data
}

export async function createUser(data: CreateUserData): Promise<User> {
  const response = await apiClient.post<User>('/users/add', data)
  return response.data
}

export async function updateUser(
  id: number,
  data: UpdateUserData
): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, data)
  return response.data
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}
