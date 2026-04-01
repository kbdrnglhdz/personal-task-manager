import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { AuthForm } from './components/AuthForm';
import { UserProfile } from './components/UserProfile';
import type { UserLogin, UserRegister, UserUpdate } from './types/user';
import './index.css';

function App() {
  const [showTasks, setShowTasks] = useState(false);
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();
  const {
    user,
    isLoading: authLoading,
    isAuthenticated,
    error: authError,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount
  } = useAuth();

  if (authLoading) {
    return <div className="container">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>Planificador de Tareas</h1>
        <AuthForm
          onLogin={login as (data: UserLogin) => Promise<void>}
          onRegister={register as (data: UserRegister) => Promise<void>}
          isLoading={authLoading}
          error={authError}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Planificador de Tareas</h1>
      
      <div className="app-header">
        <span className="app-user-greeting">Hola, {user?.name}</span>
        <button onClick={() => setShowTasks(!showTasks)} className="app-toggle-btn">
          {showTasks ? 'Mi Perfil' : 'Mis Tareas'}
        </button>
      </div>

      {showTasks ? (
        <div className="tasks-section">
          {loading && <p className="loading-text">Cargando...</p>}
          {error && <p className="error">{error}</p>}
          <TaskForm onAdd={addTask} />
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
      ) : (
        <UserProfile
          user={user!}
          onUpdateProfile={updateProfile as (data: UserUpdate) => Promise<void>}
          onDeleteAccount={deleteAccount}
          onLogout={logout}
          isLoading={authLoading}
          error={authError}
        />
      )}
    </div>
  );
}

export default App;