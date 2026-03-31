# SPEC: <Nombre del Módulo>

---

## 1. Descripción

**Nombre:** <nombre del módulo>
**Resumen:** <breve descripción>
**Relación:** <specs relacionados o dependencias>

---

## 2. Modelo de Datos

### Entidad Principal (`EntityName`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | Identificador único |
| `name` | `string` | Nombre del campo |
| `created_at` | `string` (ISO datetime) | Fecha de creación |

### Relaciones

```
EntityA (1) ─────< EntityB (N)
  PK:id              FK:entity_a_id
```

---

## 3. Requerimientos Funcionales

### FR-XX: Nombre del Requerimiento

- Descripción del requerimiento
- Detalles de implementación

---

## 4. Requerimientos No Funcionales

### RNF-XX: Nombre del RNF

- Descripción del requerimiento no funcional
- Métricas o constraints

---

## 5. Endpoints API

| Método | Endpoint | Descripción | Request | Respuesta |
|--------|----------|-------------|---------|-----------|
| GET | `/api/resource` | Lista recursos | - | `Resource[]` |
| POST | `/api/resource` | Crea recurso | `{ ... }` | `Resource` (201) |
| PUT | `/api/resource/:id` | Actualiza | `{ ... }` | `Resource` |
| DELETE | `/api/resource/:id` | Elimina | - | 204 |

### Errores

| Código | Condición |
|--------|-----------|
| `400` | Validación fallida |
| `404` | Recurso no encontrado |

---

## 6. Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

---

## 7. Estructura de Archivos

```
backend/
└── ...

frontend/
└── ...
```

---

## 8. Estado de Implementación

| Componente | Estado |
|------------|--------|
| Modelo de datos | ⏳ Pendiente |
| API Endpoints | ⏳ Pendiente |
| Frontend | ⏳ Pendiente |
| Tests | ⏳ Pendiente |

---

## 9. Historial de Versiones

| Versión | Fecha | Descripción |
|---------|-------|-------------|
| 1.0.0 | YYYY-MM-DD | Creación inicial |
