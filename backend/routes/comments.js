import { Router } from 'express';
import db from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/tasks/:taskId/comments', (req, res) => {
  const { taskId } = req.params;
  const task = db.prepare('SELECT id FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const comments = db.prepare(
    'SELECT * FROM comments WHERE task_id = ? ORDER BY created_at ASC'
  ).all(taskId);
  res.json(comments);
});

router.post('/tasks/:taskId/comments', (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;
  
  const task = db.prepare('SELECT id FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const id = uuidv4();
  db.prepare('INSERT INTO comments (id, task_id, content) VALUES (?, ?, ?)').run(
    id, taskId, content.trim()
  );
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
  res.status(201).json(comment);
});

router.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.status(204).send();
});

export default router;
