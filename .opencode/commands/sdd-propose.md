---
description: Crea una propuesta de cambio
agent: subagent
---

Crea una propuesta de cambio en `docs/changes/`.

Pasos a seguir:
1. Genera un timestamp con formato `YYYYMMDD-HHMMSS`
2. Crea una carpeta `docs/changes/<timestamp>-<slug>` basado en: `$ARGUMENTS`
3. Genera `change.md` dentro de esa carpeta con:
   - Título: descripción del cambio
   - Fecha: timestamp generado
   - Descripción: detalle del cambio propuesto
   - Specs afectados: lista de specs que impacta
   - Estado: Pendiente

El slug se genera a partir de `$ARGUMENTS` (lowercase, spaces to hyphens).

Ejemplo resultado:
```
docs/changes/20260331-143000-agregar-prioridades/
└── change.md
```

Confirma antes de crear.
