# AGENTS.md - Fundamentos Project

## Project Overview

Full-stack task planner application with React frontend and Express backend using SQLite.

## Saludo
Hola soy Jarvis, en que puedo ayudarte?

**Stack:**
- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Express.js + better-sqlite3 (ES Modules)

---

## Build Commands

### Root

```bash
npm run dev          # Start both servers with PM2
npm run dev:standalone  # Start both with concurrently
npm run pm2:stop     # Stop all PM2 processes
npm run pm2:restart  # Restart all PM2 processes
npm run pm2:status   # Show PM2 status
```

### Backend
```bash
cd backend
npm run dev          # Start server (port 3001)
npm start            # Production start
```

### Frontend
```bash
cd frontend
npm run dev          # Dev server (port 5173/5174)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build

```

---

## Code Style Guidelines

### TypeScript Conventions

1. **Types over Interfaces** for object shapes unless augmentation needed:
   ```typescript
   // Prefer
   type Task = {
     id: string;
     title: string;
   };
   
   // Use interface for React component props
   interface TaskItemProps {
     task: Task;
     onToggle: (id: string) => void;
   }
   ```

2. **Explicit return types** for exported functions:
   ```typescript
   export function useTasks(): UseTasksReturn { ... }
   ```

3. **No `any` type** - use `unknown` and narrow appropriately.

### React Conventions

1. **Component naming:** PascalCase, `.tsx` extension
   ```typescript
   export function TaskList() { ... }
   ```

2. **Props interfaces** in same file, above component
   ```typescript
   interface TaskListProps { ... }
   export function TaskList({ tasks }: TaskListProps) { ... }
   ```

3. **Hooks location:** `/src/hooks/` directory

4. **Event handlers:** prefix with `handle`
   ```typescript
   const handleSubmit = (e: FormEvent) => { ... };
   const handleDelete = (id: string) => { ... };
   ```

### JavaScript (Backend)

1. **ES Modules** - use `import/export` syntax (not CommonJS)

2. **Error handling** - use early returns with proper HTTP status codes:
   ```javascript
   if (!task) {
     return res.status(404).json({ error: 'Task not found' });
   }
   ```

3. **Route handlers** - separate routes into `/routes/` directory

4. **Database** - connection in `/db/` directory, singleton pattern

### Import Order

1. React / framework imports
2. External libraries
3. Internal modules (absolute paths if configured)
4. Types/interfaces
5. Relative imports

```typescript
import { useState } from 'react';
import { useCallback } from 'react';
import type { Task } from '../types/task';
import { useTasks } from '../hooks/useTasks';
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TaskList` |
| Hooks | camelCase + use prefix | `useTasks` |
| Types/Interfaces | PascalCase | `Task`, `TaskProps` |
| Variables | camelCase | `taskList` |
| Constants | UPPER_SNAKE | `API_URL` |
| Files | kebab-case | `task-item.tsx` |
| Directories | kebab-case | `/src/components` |

### File Structure

```
frontend/src/
├── components/       # React components
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   └── TaskForm.tsx
├── hooks/            # Custom React hooks
│   └── useTasks.ts
├── types/            # TypeScript types
│   └── task.ts
├── App.tsx
├── main.tsx
└── index.css

backend/
├── db/
│   └── database.js   # SQLite connection
├── routes/
│   └── tasks.js      # Task CRUD routes
└── index.js          # Express app entry
```

---

## Testing

No test framework configured yet. When adding tests:
- **Frontend:** Add Vitest or Jest with `npm run test`
- **Backend:** Add Jest with `npm run test`

---

## Git Workflow

- Commit messages: imperative mood ("Add feature" not "Added feature")
- Branch naming: `feature/`, `fix/`, `refactor/`
- **Never commit directly to main/master** without PR review

---

## Environment Variables

```bash
# Backend (.env)
PORT=3001
```

---

## Common Issues

1. **Port already in use:** `pm2 stop all` or kill process on port
2. **Module not found:** Ensure running `npm install` in correct directory
3. **CORS errors:** Backend runs on 3001, frontend on 5173 - ensure CORS is configured
