---
description: Aplica una especificación y genera código
agent: subagent
---

Lee la especificación y genera código stub/skeleton.

Pasos a seguir:
1. Busca el archivo SPEC en `docs/specs/` matching `$ARGUMENTS` (puede ser nombre parcial)
2. Lee y parsea el archivo de especificación
3. Identifica:
   - Modelo de datos (entidades, campos, relaciones)
   - Endpoints API (métodos, rutas, request/response)
   - Componentes UI mencionados
   - Estructura de archivos propuesta
4. Genera código skeleton según la tecnología del proyecto:
   - Backend: routes, models, controllers
   - Frontend: components, hooks, types
5. Muestra el código generado y confirma antes de escribir archivos
6. Solo crea archivos nuevos, no modifica existentes

Si no encuentra el spec, lista los specs disponibles en `docs/specs/`.
