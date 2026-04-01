import { useState, useEffect } from 'react';
import type { User, UserUpdate } from '../types/user';

interface UserProfileProps {
  user: User;
  onUpdateProfile: (data: UserUpdate) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
  error: string | null;
}

export function UserProfile({ 
  user, 
  onUpdateProfile, 
  onDeleteAccount,
  onLogout: _onLogout,
  isLoading, 
  error 
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setFormData({ name: user.name, email: user.email });
  }, [user]);

  const handleSave = async () => {
    setLocalError(null);
    
    if (!formData.name.trim()) {
      setLocalError('El nombre es requerido');
      return;
    }
    
    if (!formData.email.trim()) {
      setLocalError('El email es requerido');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('El email no es válido');
      return;
    }

    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch {
      // Error handled by parent
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email });
    setIsEditing(false);
    setLocalError(null);
  };

  const handleDelete = async () => {
    try {
      await onDeleteAccount();
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="profile-section">
      {isEditing ? (
        <div className="profile-edit">
          <h3 className="profile-edit-title">Editar Perfil</h3>
          <div className="form-group">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              placeholder="Tu nombre"
              className="auth-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
              placeholder="tu@email.com"
              className="auth-input"
            />
          </div>

          {(error || localError) && (
            <div className="auth-error">
              {localError || error}
            </div>
          )}

          <div className="profile-actions">
            <button onClick={handleSave} disabled={isLoading} className="auth-btn">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={handleCancel} disabled={isLoading} className="profile-cancel-btn">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-view">
          <div className="profile-info-card">
            <div className="profile-field">
              <span className="profile-label">Nombre</span>
              <span className="profile-value">{user.name}</span>
            </div>
            
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
            
            <div className="profile-field">
              <span className="profile-label">Rol</span>
              <span className={`profile-role role-${user.role}`}>
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
            
            <div className="profile-field">
              <span className="profile-label">Miembro desde</span>
              <span className="profile-value">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
              Editar Perfil
            </button>
          </div>

          <div className="profile-danger-zone">
            {showDeleteConfirm ? (
              <div className="profile-delete-confirm">
                <p className="profile-delete-warning">¿Eliminar tu cuenta?</p>
                <p className="profile-delete-hint">Esta acción no se puede deshacer</p>
                <div className="profile-actions">
                  <button onClick={handleDelete} disabled={isLoading} className="profile-delete-btn">
                    {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="profile-cancel-btn">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)} className="profile-delete-btn">
                Eliminar cuenta
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}