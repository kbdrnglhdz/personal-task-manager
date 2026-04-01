# SPEC: Gestión de Usuarios

---

## 1. Descripción

**Nombre:** Gestión de Usuarios (User Management)
**Resumen:** Sistema completo de gestión de usuarios con autenticación JWT, roles y permisos.
**Relación:** Depende de SPEC001 (Tareas) y SPEC002 (Comentarios) - usuarios son autores de tareas y comentarios.

---

## 2. Modelo de Datos

### Entidad Principal (`User`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | Identificador único |
| `email` | `string` | Correo electrónico único |
| `password_hash` | `string` | Contraseña hasheada con bcrypt |
| `name` | `string` | Nombre completo |
| `role` | `enum` | Rol del usuario (`admin`, `user`) |
| `created_at` | `string` (ISO datetime) | Fecha de creación |
| `updated_at` | `string` (ISO datetime) | Fecha de actualización |

### Relaciones

```
User (1) ─────< Task (N)
  PK:id            FK:user_id

User (1) ─────< Comment (N)
  PK:id            FK:user_id
```

---

## 3. Requerimientos Funcionales

### FR-01: Registro de Usuario

- Un usuario puede registrarse proporcionando email, password y name
- El email debe ser único en el sistema
- La contraseña debe tener mínimo 8 caracteres
- Retorna el usuario creado (sin password_hash)

### FR-02: Inicio de Sesión

- Un usuario puede iniciar sesión con email y password
- Retorna un token JWT válido por 24 horas
- Credenciales inválidas retornan error 401

### FR-03: Obtener Perfil

- Un usuario autenticado puede ver su perfil
- Retorna datos del usuario sin password_hash

### FR-04: Actualizar Perfil

- Un usuario puede actualizar su name y email
- No puede cambiar su propio rol (excepto admin)
- El email debe ser único

### FR-05: Eliminar Cuenta

- Un usuario puede eliminar su cuenta
- Un admin puede eliminar cualquier usuario
- Eliminación en cascada de tareas y comentarios del usuario

### FR-06: Listar Usuarios (Admin)

- Solo admins pueden listar todos los usuarios
- Soporte de paginación

---

## 4. Requerimientos No Funcionales

### RNF-01: Seguridad

- Contraseñas hasheadas con bcrypt (cost factor 10)
- Tokens JWT con expiración de 24h
- Contraseñas nunca expuestas en respuestas API

### RNF-02: Rendimiento

- Búsqueda de usuarios por email indexada
- Tiempo de respuesta < 200ms para operaciones típicas

### RNF-03: Validación

- Email con formato válido
- Password mínimo 8 caracteres
- Name obligatorio, máximo 100 caracteres

---

## 5. Endpoints API

| Método | Endpoint | Descripción | Request | Respuesta |
|--------|----------|-------------|---------|-----------|
| POST | `/api/users/register` | Registra nuevo usuario | `{email, password, name}` | `User` (201) |
| POST | `/api/users/login` | Inicia sesión | `{email, password}` | `{token, user}` (200) |
| GET | `/api/users/me` | Obtiene perfil actual | - | `User` (200) |
| PUT | `/api/users/me` | Actualiza perfil | `{name?, email?}` | `User` (200) |
| DELETE | `/api/users/me` | Elimina cuenta | - | 204 |
| GET | `/api/users` | Lista usuarios (admin) | `?page=1&limit=10` | `{users, total}` (200) |
| DELETE | `/api/users/:id` | Elimina usuario (admin) | - | 204 |

### Errores

| Código | Condición |
|--------|-----------|
| `400` | Validación fallida (email inválido, password corto) |
| `401` | Credenciales incorrectas |
| `403` | Acceso denegado (sin permisos) |
| `404` | Usuario no encontrado |
| `409` | Email ya existe |
| `422` | Datos inválidos |

---

## 6. Criterios de Aceptación

- [ ] Un usuario puede registrarse exitosamente con email válido
- [ ] El sistema rechaza emails duplicados con error 409
- [ ] Un usuario puede iniciar sesión y recibe token JWT
- [ ] El token expira después de 24 horas
- [ ] Un usuario puede ver su perfil sin ver password_hash
- [ ] Un usuario puede actualizar su name y email
- [ ] Un usuario no puede cambiar su propio rol
- [ ] Un usuario puede eliminar su cuenta
- [ ] Un admin puede eliminar cualquier usuario
- [ ] La contraseña se almacena hasheada con bcrypt
- [ ] Endpoints protegidos requieren token JWT válido

---

## 7. Estructura de Archivos

```
backend/
├── db/
│   └── database.js           # Schema de usuarios
├── routes/
│   └── users.js              # Endpoints de usuarios
├── middleware/
│   └── auth.js               # Verificación JWT
└── index.js                  # Registro de rutas

frontend/
├── types/
│   └── user.ts               # Tipos TypeScript
├── hooks/
│   └── useAuth.ts            # Hook de autenticación
├── components/
│   ├── AuthForm.tsx          # Formulario login/register
│   └── UserProfile.tsx       # Perfil de usuario
└── api/
    └── auth.ts               # Funciones API
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
| 1.0.0 | 2026-03-31 | Creación inicial - Propuesta convertida a SPEC003 |