/**
 * Tipos de usuario
 * SPEC: Gestión de Usuarios (SPEC003)
 */

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  error: string;
}