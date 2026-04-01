import { useState, type FormEvent } from 'react';
import type { Comment, NewComment } from '../types/task';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  taskId: string;
  comments: Comment[];
  onAdd: (comment: NewComment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function CommentList({ comments, onAdd, onDelete }: CommentListProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd({ content: content.trim() });
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="no-comments">Sin notas adicionales</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} onDelete={onDelete} />
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Agregar nota..."
          disabled={isSubmitting}
        />
        <button type="submit" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? '...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
