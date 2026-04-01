# SPEC: <Nombre del Módulo>

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Fecha de creación** | YYYY-MM-DD |
| **Estado** | Pendiente / En Revisión / Aprobado / Obsoleto |
| **Specs relacionados** | SPEC001, SPEC002 |
| **Owner** | <nombre del responsable> |

---

## 1. Descripción

**Nombre:** <nombre del módulo>
**Resumen:** <breve descripción del propósito del módulo>
**Alcance:** <qué incluye y qué NO incluye>
**Dependencias:** <módulos o servicios externos necesarios>

---

## 2. Modelo de Datos

### Entidad Principal (`EntityName`)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` (UUID) | Sí | Identificador único |
| `name` | `string` | Sí | Nombre del campo |
| `description` | `string` | No | Descripción opcional |
| `status` | `enum` | Sí | Estado: `active`, `inactive`, `pending` |
| `created_at` | `string` (ISO datetime) | Sí | Fecha de creación |
| `updated_at` | `string` (ISO datetime) | No | Fecha de actualización |
| `deleted_at` | `string` (ISO datetime) | No | Soft delete |

### Campos Adicionales (si aplica)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `<campo_extra>` | `string` | <descripción> |

### Relaciones

```
EntityA (1) ─────< EntityB (N)
  PK:id              FK:entity_a_id

EntityC (1) ─────< EntityD (1)
  PK:id              FK:entity_c_id
```

### Índices

| Índice | Columnas | Tipo | Descripción |
|--------|----------|------|-------------|
| `idx_entity_name` | `name` | B-Tree | Búsqueda por nombre |
| `idx_entity_status` | `status` | B-Tree | Filtrado por estado |
| `uq_entity_email` | `email` | Unique | Email único |

---

## 3. Requerimientos Funcionales

### FR-01: Nombre del Requerimiento

**Prioridad:** Alta / Media / Baja

- Descripción detallada del requerimiento
- Comportamiento esperado
- Precondiciones necesarias
- Postcondiciones resultado

**Flujo:**
```
1. El usuario realiza <acción>
2. El sistema valida <condición>
3. El sistema ejecuta <lógica>
4. Retorna <resultado>
```

---

### FR-02: <Otro requerimiento>

- Descripción...

---

### FR-03: <Otro requerimiento>

- Descripción...

---

## 4. Requerimientos No Funcionales

### RNF-01: Nombre del Requerimiento No Funcional

- **Categoría:** Seguridad / Rendimiento / Escalabilidad / Disponibilidad
- **Descripción:** <descripción>
- **Métricas:** <métricas medibles>
  - Tiempo de respuesta < 200ms
  - Disponibilidad 99.9%
  - Concurrencia > 100 usuarios

---

### RNF-02: <Otro RNF>

- Descripción...

---

## 5. Endpoints API

### Endpoints Principales

| Método | Endpoint | Descripción | Autenticación | Request | Respuesta |
|--------|----------|-------------|---------------|---------|-----------|
| GET | `/api/resource` | Lista recursos | Sí | `?page=1&limit=10&sort=created_at` | `{data: [], total, page}` |
| GET | `/api/resource/:id` | Obtiene recurso | Sí | - | `Resource` |
| POST | `/api/resource` | Crea recurso | Sí | `{ ... }` | `Resource` (201) |
| PUT | `/api/resource/:id` | Actualiza recurso | Sí | `{ ... }` | `Resource` |
| DELETE | `/api/resource/:id` | Elimina recurso | Sí | - | 204 |

### Endpoints Adicionales (si aplica)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/resource/:id/related` | Recursos relacionados |

### Códigos de Error

| Código | Condición | Mensaje |
|--------|-----------|---------|
| `400` | Validación fallida | "El campo X es requerido" |
| `401` | No autenticado | "Token requerido" |
| `403` | No autorizado | "Sin permisos para esta acción" |
| `404` | No encontrado | "Recurso no encontrado" |
| `409` | Conflicto | "El recurso ya existe" |
| `422` | Datos inválidos | "Formato de datos incorrecto" |
| `500` | Error interno | "Error del servidor" |

### Validaciones

| Campo | Reglas |
|-------|--------|
| `email` | Formato válido, único |
| `password` | Mínimo 8 caracteres |
| `name` | Máximo 100 caracteres, requerido |

---

## 6. Criterios de Aceptación

### Criterios Funcionales

- [ ] El usuario puede <acción> exitosamente
- [ ] El sistema valida <condición> correctamente
- [ ] El sistema retorna <resultado> esperado
- [ ] Los errores se manejan apropiadamente

### Criterios de Seguridad

- [ ] Datos sensibles no expuestos en respuestas
- [ ] Autenticación requerida para operaciones
- [ ] Autorización verificada por rol/permiso

### Criterios de Rendimiento

- [ ] Tiempo de respuesta < 200ms
- [ ] Soporta 100+ solicitudes concurrentes

### Criterios de UX

- [ ] Mensajes de error claros y accionables
- [ ] Validación en tiempo real del formulario

---

## 7. Estructura de Archivos

### Backend

```
backend/
├── db/
│   └── database.js           # Schema y migraciones
├── models/
│   └── entity.js            # Modelo de datos
├── routes/
│   └── entity.js           # Endpoints REST
├── middleware/
│   └── auth.js             # Auth y permisos
├── validators/
│   └── entity.js           # Validaciones
├── services/
│   └── entity.js           # Lógica de negocio
└── index.js                # Registro de rutas
```

### Frontend

```
frontend/
├── types/
│   └── entity.ts           # Tipos TypeScript
├── hooks/
│   └── useEntity.ts        # Hook personalizado
├── components/
│   ├── EntityList.tsx      # Lista de entidades
│   ├── EntityForm.tsx      # Formulario crear/editar
│   └── EntityDetail.tsx    # Detalle de entidad
├── services/
│   └── api.ts              # Funciones API
└── pages/
    └── EntityPage.tsx      # Página principal
```

---

## 8. Estado de Implementación

| Componente | Estado | Fecha Inicio | Fecha Fin |
|------------|--------|--------------|-----------|
| Modelo de datos | ⏳ Pendiente | - | - |
| API Endpoints | ⏳ Pendiente | - | - |
| Frontend | ⏳ Pendiente | - | - |
| Tests | ⏳ Pendiente | - | - |
| Documentación | ⏳ Pendiente | - | - |

---

## 9. Historial de Versiones

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0.0 | YYYY-MM-DD | <autor> | Creación inicial |
| | | | |
| | | | |

---

## 10. Notas Adicionales

- <notas técnicas relevantes>
- <decisiones de diseño>
- <referencias a documentación externa>