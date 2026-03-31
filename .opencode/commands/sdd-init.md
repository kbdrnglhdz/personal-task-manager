---
description: Inicializa la estructura de carpetas para especificaciones
agent: subagent
---

Inicializa la estructura de carpetas para especificaciones SDD:

1. Crea la carpeta `docs/specs/` si no existe
2. Crea la carpeta `docs/changes/` si no existe  
3. Crea la carpeta `docs/templates/` si no existe
4. Genera `docs/specs/README.md` explicando la estructura:
   - `specs/`: contiene archivos SPEC.md con especificaciones
   - `changes/`: almacena propuestas de cambio
   - `templates/`: guarda plantillas para especificaciones

5. Genera `docs/templates/spec-template.md` con la plantilla base que incluya:
   - Título (SPEC: Nombre del Módulo)
   - Descripción
   - Modelo de Datos
   - Requerimientos Funcionales
   - Requerimientos No Funcionales
   - Endpoints API
   - Criterios de Aceptación
   - Estructura de Archivos

Confirma las acciones antes de ejecutar.
