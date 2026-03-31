# Proyecto Fullstack

Estructura monorepo con backend (Node.js + Express) y frontend (React + Vite + TypeScript).

## Estructura

```
.
├── backend/          # API REST con Express
├── frontend/         # Aplicación React con Vite
└── package.json      # Scripts para ejecutar ambos entornos
```

## Requisitos Previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
# Instalar dependencias del backend
cd backend && npm install

# Instalar dependencias del frontend
cd frontend && npm install
```

## Ejecución

### Ejecutar ambos entornos simultáneamente

```bash
npm run dev
```

Esto inicia:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

### Ejecutar solo el backend

```bash
npm run dev:backend
```

### Ejecutar solo el frontend

```bash
npm run dev:frontend
```

## Endpoints del Backend

| Método | Ruta          | Descripción                  |
|--------|---------------|------------------------------|
| GET    | /api/health   | Verifica que el servidor está activo |

## Variables de Entorno (Backend)

Crear archivo `backend/.env`:

```env
PORT=3001
NODE_ENV=development
```
# personal-task-manager
