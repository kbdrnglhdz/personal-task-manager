import { useState, useEffect, useCallback } from 'react';
import type { Comment, NewComment } from '../types/task';

const API_URL = 'http://localhost:3001/api';

export function useComments(taskId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(async (comment: NewComment) => {
    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    const newComment = await res.json();
    setComments(prev => [...prev, newComment]);
  }, [taskId]);

  const deleteComment = useCallback(async (id: string) => {
    const res = await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete comment');
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  return { comments, loading, error, addComment, deleteComment };
}
