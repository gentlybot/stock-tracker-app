import { apiPost } from './api';
import { LoginRequest, LoginResponse, LoginResponseSchema } from '../types/user';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const raw = await apiPost<LoginResponse>('/api/auth/login', credentials);
  const data = LoginResponseSchema.parse(raw);
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
