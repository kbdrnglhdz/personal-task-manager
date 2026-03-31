Para integrar esta funcionalidad de manera coherente con tu **SPEC001.md** actual, debemos actualizar el modelo de datos, los endpoints y la interfaz. Aquí tienes la especificación complementaria:

---

## Especificación: Sistema de Comentarios para Tareas

### 1. Actualización del Modelo de Datos

Necesitamos una nueva entidad `Comment` relacionada con `Task`.

#### Comentario (`Comment`)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | Identificador único |
| `task_id` | `string` (UUID) | Relación con la tarea (Foreign Key) |
| `content` | `text` | Contenido del comentario (requerido) |
| `created_at` | `string` (ISO datetime) | Fecha de creación |

---

### 2. Nuevos Requerimientos Funcionales

#### FR-06: Visualizar Comentarios
- Al seleccionar o expandir una tarea, el sistema debe listar sus comentarios asociados.
- Los comentarios se ordenan cronológicamente (el más antiguo primero).
- Si no hay comentarios, mostrar un mensaje sutil: "Sin notas adicionales".

#### FR-07: Agregar Comentario
- El usuario puede escribir un comentario en un campo de texto dentro de la vista de la tarea.
- El botón "Enviar" solo se habilita si hay texto (trim).
- La UI debe actualizarse inmediatamente para mostrar el nuevo comentario (Optimistic UI).

#### FR-08: Eliminar Comentario
- Cada comentario tendrá un botón de eliminación (ícono de papelera pequeño).
- Se requiere confirmación visual o capacidad de deshacer para evitar borrados accidentales.

---

### 3. Modificaciones en la API (Endpoints)

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/api/tasks/:id/comments` | Obtiene comentarios de una tarea | `200` + `Comment[]` |
| POST | `/api/tasks/:id/comments` | Crea un comentario para esa tarea | `201` + `Comment` |
| DELETE | `/api/comments/:id` | Elimina un comentario específico | `204` |

---

### 4. Requerimientos No Funcionales (UI/UX)

#### RNF-04: Integración Visual (Glassmorphism)
- **Contenedor:** Los comentarios deben aparecer en una sección colapsable o un "Detail View" debajo de la tarea original.
- **Estilo:** Fondo con `backdrop-filter: blur(4px)` y un borde más tenue que la card principal para jerarquizar.
- **Micro-interacción:** Animación suave (slide down) al abrir la sección de comentarios.

---

### 5. Criterios de Aceptación Actualizados

- [ ] El usuario puede ver el número de comentarios desde la lista principal (badge icónico).
- [ ] El usuario puede añadir un comentario y verlo reflejado sin recargar.
- [ ] Al eliminar una tarea, todos sus comentarios asociados deben borrarse de la DB (Borrado en cascada).
- [ ] El campo de texto del comentario se limpia automáticamente tras un envío exitoso.

---

### 6. Impacto en la Estructura de Archivos

```
backend/
├── routes/
│   ├── tasks.js
│   └── comments.js         # Nueva ruta para lógica de comentarios
frontend/
└── src/
    ├── components/
    │   ├── CommentList.tsx  # Nuevo componente
    │   └── CommentItem.tsx  # Nuevo componente
```

### Un pequeño consejo de diseño:
Dado que buscas un estilo **Dark Glassmorphism**, te sugiero que para los comentarios uses un color de acento ligeramente distinto (quizás un **Cyan #22d3ee**) o simplemente una opacidad menor que la tarea principal para que el usuario entienda visualmente que el comentario es un "hijo" de la tarea.

¿Te gustaría que desarrollemos el código del componente de React o la migración de la base de datos para SQLite?