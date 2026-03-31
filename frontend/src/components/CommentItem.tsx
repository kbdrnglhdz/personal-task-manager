import type { Comment } from '../types/task';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => Promise<void>;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comment-item">
      <div className="comment-content">
        <p>{comment.content}</p>
        <span className="comment-date">{formatDate(comment.created_at)}</span>
      </div>
      <button
        onClick={() => onDelete(comment.id)}
        className="comment-delete-btn"
        title="Eliminar comentario"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  );
}
