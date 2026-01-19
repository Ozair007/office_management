import apiClient from "./apiClient";

export interface User {
	id: number;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	image?: string;
}

export interface LoginResponse extends User {
	accessToken: string;
	refreshToken: string;
}

export interface SignUpData {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
	const response = await apiClient.post<LoginResponse>("/auth/login", {
		username,
		password,
	});
	return response.data;
}

export async function signUp(data: SignUpData): Promise<User> {
	const response = await apiClient.post<User>("/users/add", data);
	return response.data;
}

export async function getCurrentUser(): Promise<User> {
	const response = await apiClient.get<User>("/auth/me");
	return response.data;
}
