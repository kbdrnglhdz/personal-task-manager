# Especificación de Requerimientos - Planificador de Tareas Personal

---

## 1. Descripción General

**Nombre del producto:** Task Planner (Planificador de Tareas Personal)

**Tipo de aplicación:** SPA (Single Page Application) full-stack

**Resumen:** Aplicación web para gestión de tareas personales con almacenamiento local en SQLite. Permite crear, visualizar, marcar como completadas y eliminar tareas.

**Usuarios objetivo:** Usuarios individuales que necesitan una herramienta simple para organizar sus tareas diarias.

---

## 2. Modelo de Datos

### Tarea (`Task`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | Identificador único |
| `title` | `string` | Título de la tarea (requerido, no vacío) |
| `completed` | `integer` (0/1) | Estado de completitud |
| `created_at` | `string` (ISO datetime) | Fecha de creación |

---

## 3. Requerimientos Funcionales

### FR-01: Listar Tareas
- El sistema debe mostrar todas las tareas ordenadas por fecha de creación (más recientes primero)
- Si no hay tareas, mostrar estado vacío con mensaje y icono

### FR-02: Crear Tarea
- El usuario debe poder crear una tarea ingresando un título
- El título es requerido y no puede estar vacío (trim)
- Al crear, la tarea aparece al inicio de la lista
- Retorna código 201 Created

### FR-03: Marcar Tarea como Completada/Incompleta
- El usuario puede togglear el estado de completitud de una tarea
- El checkbox refleja el estado actual
- Tareas completadas muestran texto tachado y opacidad reducida

### FR-04: Eliminar Tarea
- El usuario puede eliminar una tarea individual
- El botón "Eliminar" ejecuta la acción inmediatamente

### FR-05: Estados de Carga
- Mostrar "Cargando..." mientras se obtienen las tareas iniciales
- Manejar errores de API mostrando mensaje de error

---

## 4. Requerimientos No Funcionales

### RNF-01: Diseño Visual
- **Tema:** Dark mode con glassmorphism
- **Colores:** Background navy (#0f0f1a, #1a1a2e), accent violet (#8b5cf6)
- **Tipografía:** Inter (Google Fonts)
- **Efectos:** Glows púrpura, blur en cards, bordes translúcidos
- **Responsive:** Mobile-first, stack vertical en <480px

### RNF-02: Performance
- Actualizaciones optimistas del estado UI
- Sin recarga de página para operaciones CRUD

### RNF-03: Persistencia
- Base de datos SQLite local (`backend/db/tasks.db`)
- Datos persisten entre sesiones

---

## 5. Arquitectura

```
┌─────────────┐     REST API      ┌─────────────┐
│   Frontend  │  ←──────────────→ │   Backend   │
│   React 19  │   GET/POST/PUT     │  Express   │
│   + Vite    │   PATCH/DELETE    │  + SQLite   │
└─────────────┘                   └─────────────┘
     :5174                            :3001
```

---

## 6. Endpoints API

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/api/tasks` | Lista todas las tareas | `200` + `Task[]` |
| POST | `/api/tasks` | Crea una tarea | `201` + `Task` |
| PUT | `/api/tasks/:id` | Actualiza título/completado | `200` + `Task` |
| PATCH | `/api/tasks/:id/toggle` | Toggle completitud | `200` + `Task` |
| DELETE | `/api/tasks/:id` | Elimina una tarea | `204` (sin body) |

### Errores

| Código | Condición |
|--------|-----------|
| `400` | Título requerido está vacío |
| `404` | Tarea no encontrada |
| `500` | Error interno del servidor |

---

## 7. Criterios de Aceptación

- [ ] Usuario puede agregar una tarea con título no vacío
- [ ] Usuario puede ver lista de todas las tareas ordenadas por fecha
- [ ] Usuario puede marcar/desmarcar tarea como completada
- [ ] Usuario puede eliminar una tarea
- [ ] Estado vacío se muestra cuando no hay tareas
- [ ] Errores de API se muestran al usuario
- [ ] UI sigue el diseño dark mode con glassmorphism especificado

---

## 8. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React | 19.x |
| Frontend | TypeScript | 5.x |
| Frontend | Vite | 8.x |
| Backend | Express | 5.x |
| Base de datos | SQLite (better-sqlite3) | latest |
| IDs | UUID v4 | latest |

---

## 9. Estructura de Archivos

```
fundamentos/
├── backend/
│   ├── db/
│   │   └── database.js      # Conexión SQLite
│   ├── routes/
│   │   └── tasks.js         # Rutas CRUD
│   └── index.js             # Entry point
├── frontend/
│   └── src/
│       ├── components/       # Componentes React
│       ├── hooks/            # Custom hooks
│       ├── types/            # Tipos TypeScript
│       ├── App.tsx           # Componente principal
│       └── index.css         # Estilos
└── docs/
    └── specs/
        └── SPEC.md           # Este archivo
```
