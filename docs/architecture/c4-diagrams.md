# C4 Model - Planificador de Tareas Personal

Este documento describe la arquitectura del sistema utilizando el modelo C4 de Simon Brown.

---

## Nivel 1: Contexto del Sistema

![Contexto](diagrams/context.png)

### Elementos del Contexto

| Elemento | Descripción |
|----------|-------------|
| **Usuario** | Persona individual que necesita organizar sus tareas diarias |
| **Task Planner** | Sistema SPA que permite CRUD de tareas y comentarios |
| **SQLite** | Base de datos local para persistencia sin servidor externo |

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
C4Context
    title Sistema de Contexto - Planificador de Tareas
    
    Person(user, "Usuario", "Persona individual que gestiona tareas")
    System(taskPlanner, "Task Planner", "Aplicación full-stack para crear, editar y organizar tareas personales con notas")
    SystemDb(sqlite, "SQLite Database", "Persistencia local de tareas y comentarios")
    
    Rel(user, taskPlanner, "Gestiona tareas")
    Rel(taskPlanner, sqlite, "Almacena/recupera datos")
    
    UpdateRelStyle(user, taskPlanner, $textColor="#ffffff", $lineColor="#8b5cf6")
    UpdateRelStyle(taskPlanner, sqlite, $textColor="#ffffff", $lineColor="#22d3ee")
```

</details>

---

## Nivel 2: Contenedores

![Contenedores](diagrams/containers.png)

### Contenedores del Sistema

| Contenedor | Tecnología | Puerto | Responsabilidad |
|------------|------------|--------|-----------------|
| **Frontend SPA** | React 19, TypeScript, Vite | 5173/5174 | UI interactiva, estado, comunicación API |
| **Backend API** | Express.js 5, ES Modules | 3001 | Lógica de negocio, endpoints REST, acceso BD |
| **SQLite DB** | better-sqlite3 | - | Almacenamiento persistente |

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
C4Container
    title Contenedores - Planificador de Tareas
    
    Person(user, "Usuario", "Persona individual")
    
    Container(frontend, "Frontend SPA", "React 19 + TypeScript + Vite", "Interfaz de usuario con glassmorphism dark mode")
    Container(backend, "Backend API", "Express.js 5 + ES Modules", "API REST para gestión de tareas y comentarios")
    ContainerDb(db, "SQLite Database", "better-sqlite3", "Persistencia de tareas y comentarios")
    
    Rel(user, frontend, "HTTP/REST", "localhost:5174")
    Rel(frontend, backend, "fetch API", "localhost:3001/api")
    Rel(backend, db, "SQL queries")
    
    UpdateRelStyle(frontend, backend, $textColor="#ffffff", $lineColor="#8b5cf6", $strokeStyle="dashed")
    UpdateRelStyle(backend, db, $textColor="#ffffff", $lineColor="#22d3ee")
```

</details>

---

## Nivel 3: Componentes

### Frontend - Componentes React

![Componentes Frontend](diagrams/components-frontend.png)

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
C4Component
    title Componentes Frontend - React Components
    
    Container(frontend, "Frontend", "React 19 SPA")
    
    Component(app, "App.tsx", "Root Component", "Orquesta useTasks, renderiza TaskForm y TaskList")
    Component(taskForm, "TaskForm.tsx", "Form Component", "Input para crear nuevas tareas")
    Component(taskList, "TaskList.tsx", "List Component", "Mapea tasks a TaskItem, estado vacío")
    Component(taskItem, "TaskItem.tsx", "Item Component", "Muestra tarea + expand/collapse comments")
    Component(commentList, "CommentList.tsx", "Comments Component", "Lista comentarios + input agregar")
    Component(commentItem, "CommentItem.tsx", "Comment Component", "Contenido, fecha, botón eliminar")
    
    Component(hookTasks, "useTasks.ts", "Custom Hook", "Estado tasks, loading, error, CRUD operations")
    Component(hookComments, "useComments.ts", "Custom Hook", "Estado comments por taskId, CRUD operations")
    
    Component(types, "task.ts", "TypeScript Types", "Task, Comment, NewTask, NewComment interfaces")
    
    Rel(app, taskForm, "usa")
    Rel(app, taskList, "usa")
    Rel(taskList, taskItem, "mapea")
    Rel(taskItem, commentList, "contiene")
    Rel(commentList, commentItem, "mapea")
    Rel(taskItem, hookComments, "usa")
    Rel(app, hookTasks, "usa")
    Rel(hookComments, types, "tipos")
    Rel(hookTasks, types, "tipos")
```

</details>

### Backend - Componentes Express

![Componentes Backend](diagrams/components-backend.png)

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
C4Component
    title Componentes Backend - Express API
    
    Container(backend, "Backend", "Express.js API")
    
    Component(index, "index.js", "Entry Point", "Express app, CORS, JSON middleware, route mounting")
    Component(routesTasks, "tasks.js", "Routes", "GET/POST/PUT/PATCH/DELETE /api/tasks")
    Component(routesComments, "comments.js", "Routes", "GET/POST/DELETE /api/tasks/:id/comments")
    Component(db, "database.js", "Database Module", "SQLite singleton, schema initialization")
    
    Rel(index, routesTasks, "mount")
    Rel(index, routesComments, "mount")
    Rel(routesTasks, db, "query")
    Rel(routesComments, db, "query")
```

</details>

---

## Nivel 4: Flujo de Datos

![Secuencia](diagrams/sequence.png)

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant D as SQLite
    
    Note over U,D: Crear Tarea
    U->>F: Ingresa título
    F->>B: POST /api/tasks {title}
    B->>D: INSERT INTO tasks
    D-->>B: Task
    B-->>F: 201 Created + Task
    F-->>U: Actualiza lista
    
    Note over U,D: Agregar Comentario
    U->>F: Click expandir tarea
    F->>B: GET /api/tasks/:id/comments
    B->>D: SELECT comments WHERE task_id = ?
    D-->>B: Comment[]
    B-->>F: Comment[]
    F-->>U: Muestra comentarios
    
    U->>F: Escribe comentario
    F->>B: POST /api/tasks/:id/comments {content}
    B->>D: INSERT INTO comments
    D-->>B: Comment
    B-->>F: 201 Created + Comment
    F-->>U: Actualiza sección
    
    Note over U,D: Eliminar Tarea (Cascade Delete)
    U->>F: Click eliminar tarea
    F->>B: DELETE /api/tasks/:id
    B->>D: DELETE FROM tasks WHERE id = ? (CASCADE)
    D-->>B: 1 row deleted
    B-->>F: 204 No Content
    F-->>U: Remueve tarea de lista
```

</details>

---

## Estructura de Archivos

![Estructura](diagrams/structure.png)

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
graph TD
    subgraph Root["📁 fundamentos/"]
        subgraph Backend["📁 backend/"]
            B1["index.js"]
            subgraph DB["📁 db/"]
                D1["database.js"]
            end
            subgraph Routes["📁 routes/"]
                R1["tasks.js"]
                R2["comments.js"]
            end
            B_PKG["package.json"]
        end
        
        subgraph Frontend["📁 frontend/"]
            subgraph Src["📁 src/"]
                A["App.tsx"]
                CSS["index.css"]
                subgraph Components["📁 components/"]
                    TF["TaskForm.tsx"]
                    TL["TaskList.tsx"]
                    TI["TaskItem.tsx"]
                    CL["CommentList.tsx"]
                    CI["CommentItem.tsx"]
                end
                subgraph Hooks["📁 hooks/"]
                    UT["useTasks.ts"]
                    UC["useComments.ts"]
                end
                subgraph Types["📁 types/"]
                    T["task.ts"]
                end
            end
            F_PKG["package.json"]
        end
        
        Docs["📁 docs/"]
        Config["📄 ecosystem.config.js"]
    end
    
    A --> Components
    A --> Hooks
    TI --> CL
    CL --> CI
    UT --> Types
    UC --> Types
    B1 --> Routes
    B1 --> DB
    Routes --> DB
```

</details>

---

## API Endpoints

```mermaid
graph LR
    subgraph Backend["Backend API :3001"]
        subgraph Tasks["/api/tasks"]
            GET1["GET /"]
            POST1["POST /"]
            PUT1["PUT /:id"]
            PATCH1["PATCH /:id/toggle"]
            DELETE1["DELETE /:id"]
        end
        
        subgraph Comments["/api"]
            GET2["GET /tasks/:taskId/comments"]
            POST2["POST /tasks/:taskId/comments"]
            DELETE2["DELETE /comments/:id"]
        end
    end
    
    FE["Frontend React"] --> GET1
    FE --> POST1
    FE --> PUT1
    FE --> PATCH1
    FE --> DELETE1
    FE --> GET2
    FE --> POST2
    FE --> DELETE2
```

### Tabla de Endpoints

| Método | Endpoint | Descripción | Request Body | Respuesta |
|--------|----------|-------------|--------------|-----------|
| GET | `/api/tasks` | Lista todas las tareas | - | `Task[]` |
| POST | `/api/tasks` | Crea tarea | `{ title: string }` | `Task` (201) |
| PUT | `/api/tasks/:id` | Actualiza tarea | `{ title?, completed? }` | `Task` |
| PATCH | `/api/tasks/:id/toggle` | Toggle completado | - | `Task` |
| DELETE | `/api/tasks/:id` | Elimina tarea | - | 204 (CASCADE) |
| GET | `/api/tasks/:taskId/comments` | Lista comentarios | - | `Comment[]` |
| POST | `/api/tasks/:taskId/comments` | Crea comentario | `{ content: string }` | `Comment` (201) |
| DELETE | `/api/comments/:id` | Elimina comentario | - | 204 |

---

## Modelo de Datos

![ER Model](diagrams/er-model.png)

<details>
<summary><b>Código Mermaid</b></summary>

```mermaid
erDiagram
    TASKS {
        string id PK "UUID"
        string title "NOT NULL"
        int completed "0/1"
        string created_at "ISO datetime"
    }
    
    COMMENTS {
        string id PK "UUID"
        string task_id FK "NOT NULL"
        string content "NOT NULL"
        string created_at "ISO datetime"
    }
    
    TASKS ||--o{ COMMENTS : "has"
```

</details>

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Frontend UI** | React | 19.x |
| **Frontend Build** | Vite | 8.x |
| **Frontend Language** | TypeScript | 5.x |
| **Frontend Router** | React Router | 7.x |
| **Backend Runtime** | Node.js | - |
| **Backend Framework** | Express | 5.x |
| **Database** | SQLite (better-sqlite3) | - |
| **IDs** | UUID v4 | - |
| **Dev Tools** | PM2, concurrently | - |

---

## Métricas del Código

| Métrica | Valor |
|---------|-------|
| **Componentes Frontend** | 5 |
| **Hooks Custom** | 2 |
| **Rutas API** | 8 |
| **Tablas BD** | 2 (tasks, comments) |
| **Lenguajes** | 2 (TypeScript, JavaScript) |

---

## Regenerar Diagramas

Para regenerar las imágenes de los diagramas:

```bash
# Instalar dependencias (si no está)
npm install -D @mermaid-js/mermaid-cli

# Generar todas las imágenes
npx mmdc -i docs/architecture/diagrams/context.mmd -o docs/architecture/diagrams/context.png -b transparent -w 1200 -H 800
npx mmdc -i docs/architecture/diagrams/containers.mmd -o docs/architecture/diagrams/containers.png -b transparent -w 1400 -H 900
npx mmdc -i docs/architecture/diagrams/components-frontend.mmd -o docs/architecture/diagrams/components-frontend.png -b transparent -w 1600 -H 1000
npx mmdc -i docs/architecture/diagrams/components-backend.mmd -o docs/architecture/diagrams/components-backend.png -b transparent -w 1200 -H 700
npx mmdc -i docs/architecture/diagrams/sequence.mmd -o docs/architecture/diagrams/sequence.png -b transparent -w 1400 -H 900
npx mmdc -i docs/architecture/diagrams/structure.mmd -o docs/architecture/diagrams/structure.png -b transparent -w 1400 -H 800
npx mmdc -i docs/architecture/diagrams/er-model.mmd -o docs/architecture/diagrams/er-model.png -b transparent -w 1000 -H 600
```
