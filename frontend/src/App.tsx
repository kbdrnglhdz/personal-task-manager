import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import './index.css';

function App() {
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();

  if (loading) return <div className="container">Cargando...</div>;
  if (error) return <div className="container error">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Planificador de Tareas</h1>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}

export default App;
