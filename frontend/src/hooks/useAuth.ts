/**
 * Hook de autenticación
 * SPEC: Gestión de Usuarios (SPEC003)
 */

import { useState, useEffect, useCallback } from 'react';
import type { User, UserLogin, UserRegister, UserUpdate } from '../types/user';
import * as authApi from '../api/auth';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (data: UserLogin) => Promise<void>;
  register: (data: UserRegister) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UserUpdate) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      if (!authApi.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authApi.getProfile();
        setUser(profile);
      } catch {
        // Token expirado o inválido
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (data: UserLogin) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user } = await authApi.login(data);
      setUser(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: UserRegister) => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.register(data);
      // Auto-login después de registro
      await login({ email: data.email, password: data.password });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: UserUpdate) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.deleteAccount();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar cuenta';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    clearError
  };
}