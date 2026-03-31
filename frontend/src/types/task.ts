export interface Task {
  id: string;
  title: string;
  completed: number;
  created_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  content: string;
  created_at: string;
}

export type NewTask = Pick<Task, 'title'>;
export type NewComment = Pick<Comment, 'content'>;
