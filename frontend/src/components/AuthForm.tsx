import { useState, type FormEvent } from 'react';
import type { UserLogin, UserRegister } from '../types/user';

interface AuthFormProps {
  onLogin: (data: UserLogin) => Promise<void>;
  onRegister: (data: UserRegister) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

type AuthMode = 'login' | 'register';

export function AuthForm({ onLogin, onRegister, isLoading, error }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.email) {
      setValidationError('El email es requerido');
      return;
    }

    if (!formData.password) {
      setValidationError('La contraseña es requerida');
      return;
    }

    if (mode === 'register') {
      if (!formData.name) {
        setValidationError('El nombre es requerido');
        return;
      }
      if (formData.password.length < 8) {
        setValidationError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
    }

    try {
      if (mode === 'login') {
        await onLogin({ email: formData.email, password: formData.password });
      } else {
        await onRegister(formData);
      }
    } catch {
      // Error handled by parent
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setValidationError(null);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Tu nombre"
              className="auth-input"
            />
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="tu@email.com"
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder={mode === 'register' ? 'Mínimo 8 caracteres' : 'Tu contraseña'}
            className="auth-input"
          />
        </div>

        {(error || validationError) && (
          <div className="auth-error">
            {validationError || error}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="auth-btn">
          {isLoading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
        </button>
      </form>

      <p className="auth-toggle">
        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button type="button" onClick={toggleMode} className="auth-toggle-btn">
          {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  );
}