import { useState, FormEvent } from 'react';
import type { NewTask } from '../types/task';

interface TaskFormProps {
  onAdd: (task: NewTask) => Promise<void>;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd({ title: title.trim() });
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Nueva tarea..."
        disabled={isSubmitting}
      />
      <button type="submit" disabled={!title.trim() || isSubmitting}>
        {isSubmitting ? '...' : 'Agregar'}
      </button>
    </form>
  );
}
