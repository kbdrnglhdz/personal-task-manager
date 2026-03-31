# SPEC002: Sistema de Comentarios para Tareas

---

## 1. Descripción General

**Nombre:** Sistema de Comentarios (Notes/Notes System)

**Resumen:** Extensión del planificador de tareas que permite agregar notas o comentarios a cada tarea individual, proporcionando contexto adicional y seguimiento de información relevante.

**Relación:** Complemento a SPEC001 - Sistema de Tareas

---

## 2. Modelo de Datos

### Comentario (`Comment`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | Identificador único |
| `task_id` | `string` (UUID) | FK hacia `tasks.id` |
| `content` | `text` | Contenido del comentario (requerido, no vacío) |
| `created_at` | `string` (ISO datetime) | Fecha de creación automática |

### Relaciones

```
Task (1) ─────< Comment (N)
  PK:id             FK:task_id
                ON DELETE CASCADE
```

---

## 3. Requerimientos Funcionales

### FR-06: Visualizar Comentarios

- Al expandir una tarea, el sistema debe listar sus comentarios asociados
- Los comentarios se ordenan cronológicamente (ASC - más antiguo primero)
- Si no hay comentarios, mostrar mensaje sutil: "Sin notas adicionales"
- Mostrar fecha de creación formateada (día/mes hora:minuto)

### FR-07: Agregar Comentario

- Usuario puede escribir un comentario en un campo de texto dentro de la vista de la tarea
- El botón "Enviar" solo se habilita si hay texto (después de trim)
- La UI debe actualizarse inmediatamente tras el envío exitoso (Optimistic UI)
- El campo de texto se limpia automáticamente tras envío exitoso

### FR-08: Eliminar Comentario

- Cada comentario tiene un botón de eliminación (ícono papelera)
- El botón es discreto (opacity 0.5) y se intensifica en hover
- La eliminación es inmediata sin confirmación (UI simple)

---

## 4. Requerimientos No Funcionales

### RNF-04: Integración Visual (Glassmorphism)

| Elemento | Estilo |
|----------|--------|
| **Contenedor** | Sección colapsable debajo de la tarea |
| **Fondo** | `backdrop-filter: blur(4px)`, opacidad 3% |
| **Borde** | 1px solid rgba(34, 211, 238, 0.1) |
| **Accent** | Cyan #22d3ee para distinguir de tareas (violet) |
| **Animación** | slideDown 0.3s ease al expandir |

### RNF-05: Interfaz de Badge

- Botón expandir con icono de comentarios
- Badge circular mostrando número de comentarios
- Color cyan consistente con la sección

---

## 5. Endpoints API

| Método | Endpoint | Descripción | Request Body | Respuesta |
|--------|----------|-------------|--------------|-----------|
| GET | `/api/tasks/:taskId/comments` | Lista comentarios de tarea | - | `Comment[]` (200) |
| POST | `/api/tasks/:taskId/comments` | Crea comentario | `{ content: string }` | `Comment` (201) |
| DELETE | `/api/comments/:id` | Elimina comentario | - | 204 |

### Errores

| Código | Condición |
|--------|-----------|
| `400` | Content vacío o solo espacios |
| `404` | Tarea no encontrada |
| `404` | Comentario no encontrado (DELETE) |

---

## 6. Criterios de Aceptación

- [ ] Usuario puede ver el número de comentarios en el badge
- [ ] Usuario puede expandir/colapsar la sección de comentarios
- [ ] Usuario puede añadir un comentario y verlo sin recargar
- [ ] El campo de texto se limpia tras envío exitoso
- [ ] Usuario puede eliminar un comentario individual
- [ ] Al eliminar una tarea, sus comentarios se eliminan en cascada
- [ ] Estilos cyan glassmorphism aplicados correctamente

---

## 7. Estructura de Archivos

```
backend/
├── db/
│   └── database.js              # + tabla comments con FK CASCADE
├── routes/
│   ├── tasks.js                 # (sin cambios)
│   └── comments.js              # NUEVO: CRUD comentarios
└── index.js                     # + mount commentsRouter

frontend/src/
├── types/
│   └── task.ts                  # + interface Comment, type NewComment
├── hooks/
│   └── useComments.ts           # NUEVO: estado y API comentarios
├── components/
│   ├── CommentItem.tsx          # NUEVO: comentario individual
│   ├── CommentList.tsx         # NUEVO: lista + input
│   └── TaskItem.tsx             # MOD: + expand/collapse, badge
└── index.css                    # MOD: + estilos comentarios (cyan)
```

---

## 8. Decisiones de Diseño

### Color de Acento

Se utiliza **Cyan #22d3ee** para comentarios, diferenciándolos de las tareas (Violet #8b5cf6). Esto establece jerarquía visual clara donde:
- Las **tareas** son elementos principales (violet)
- Los **comentarios** son elementos secundarios (cyan)

### Optimistic UI

Las operaciones de agregar/eliminar comentario actualizan el estado local inmediatamente, sin esperar confirmación del servidor. Esto proporciona respuesta instantánea al usuario.

---

## 9. Estado del Implementación

| Componente | Estado |
|------------|--------|
| Modelo de datos | ✅ Implementado |
| API Endpoints | ✅ Implementado |
| Frontend Hooks | ✅ Implementado |
| Componentes UI | ✅ Implementado |
| Estilos | ✅ Implementado |
| Tests | ❌ Pendiente |

---

## 10. Historial de Versiones

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0.0 | 2026-03-31 | Implementación inicial |
