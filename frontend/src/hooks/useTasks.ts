import { useState, useEffect, useCallback } from 'react';
import type { Task, NewTask } from '../types/task';

const API_URL = 'http://localhost:3001/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (task: NewTask) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    const newTask = await res.json();
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const res = await fetch(`${API_URL}/tasks/${id}/toggle`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to toggle task');
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
}
