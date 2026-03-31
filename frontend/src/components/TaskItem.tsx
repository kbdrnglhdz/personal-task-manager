import { useState } from 'react';
import type { Task } from '../types/task';
import { useComments } from '../hooks/useComments';
import { CommentList } from './CommentList';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { comments, addComment, deleteComment } = useComments(task.id);

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <label>
          <input
            type="checkbox"
            checked={!!task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span>{task.title}</span>
        </label>
        <div className="task-actions">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-btn"
            title={isExpanded ? 'Ocultar notas' : 'Ver notas'}
          >
            <span className="comment-badge">{comments.length}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
            >
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="delete-btn">
            Eliminar
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="task-comments">
          <CommentList
            taskId={task.id}
            comments={comments}
            onAdd={addComment}
            onDelete={deleteComment}
          />
        </div>
      )}
    </li>
  );
}
