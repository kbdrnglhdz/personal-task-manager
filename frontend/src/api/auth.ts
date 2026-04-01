/**
 * API de autenticación
 * SPEC: Gestión de Usuarios (SPEC003)
 */

import type { 
  User, 
  UserLogin, 
  UserRegister, 
  UserUpdate, 
  AuthResponse,
  UsersListResponse,
  ApiError
} from '../types/user';

const API_URL = 'http://localhost:3001/api/users';

/**
 * Obtiene el token del localStorage
 */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Guarda el token en localStorage
 */
function setToken(token: string): void {
  localStorage.setItem('token', token);
}

/**
 * Elimina el token del localStorage
 */
function clearToken(): void {
  localStorage.removeItem('token');
}

/**
 * Manejo de respuestas
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Error en la solicitud');
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

/**
 * Opciones para requests autenticados
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token 
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ============================================
// Auth API
// ============================================

/**
 * Registra un nuevo usuario
 */
export async function register(data: UserRegister): Promise<User> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return handleResponse<User>(response);
}

/**
 * Inicia sesión
 */
export async function login(data: UserLogin): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const authResponse = await handleResponse<AuthResponse>(response);
  
  // Guardar token
  setToken(authResponse.token);
  
  return authResponse;
}

/**
 * Cierra sesión
 */
export function logout(): void {
  clearToken();
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getProfile(): Promise<User> {
  const response = await fetch(`${API_URL}/me`, {
    headers: getAuthHeaders()
  });
  
  return handleResponse<User>(response);
}

/**
 * Actualiza el perfil del usuario actual
 */
export async function updateProfile(data: UserUpdate): Promise<User> {
  const response = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  return handleResponse<User>(response);
}

/**
 * Elimina la cuenta del usuario actual
 */
export async function deleteAccount(): Promise<void> {
  const response = await fetch(`${API_URL}/me`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  await handleResponse<void>(response);
  clearToken();
}

// ============================================
// Admin API
// ============================================

/**
 * Lista todos los usuarios (solo admin)
 */
export async function listUsers(page = 1, limit = 10): Promise<UsersListResponse> {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders()
  });
  
  return handleResponse<UsersListResponse>(response);
}

/**
 * Elimina un usuario por ID (solo admin)
 */
export async function deleteUser(userId: string): Promise<void> {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  await handleResponse<void>(response);
}

// ============================================
// Helpers
// ============================================

/**
 * Verifica si hay un usuario autenticado
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Obtiene el usuario actual desde el token (sin hacer request)
 * Nota: Esto no valida si el token sigue siendo válido
 */
export function getCurrentUserFromToken(): User | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.userId, role: payload.role } as User;
  } catch {
    return null;
  }
}