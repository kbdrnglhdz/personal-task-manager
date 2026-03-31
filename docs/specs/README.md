# Documentación de Especificaciones

Este directorio contiene las especificaciones oficiales del proyecto.

## Estructura

```
docs/
├── specs/           # Especificaciones aprobadas
│   ├── SPEC001.md   # Sistema de Tareas
│   └── SPEC002.md   # Sistema de Comentarios
├── changes/         # Propuestas de cambio
│   └── SPEC002.md   # Propuesta de comentarios
├── templates/       # Plantillas
│   └── spec-template.md
└── architecture/   # Diagramas de arquitectura
    └── c4-diagrams.md
```

## Cómo agregar una nueva especificación

1. Crear propuesta en `changes/` con `/sdd-propose <descripción>`
2. Validar con `/sdd-validate docs/changes/tu-propuesta.md`
3. Una vez aprobada, mover a `specs/` renombrando a `SPECXXX.md`
4. Aplicar con `/sdd-apply SPECXXX`

## Formato de Specs

Ver `templates/spec-template.md` para la plantilla base.

## Comandos útiles

```bash
/sdd-init         # Reinicializar estructura
/sdd-validate     # Validar especificación
/sdd-propose      # Crear propuesta
/sdd-apply        # Aplicar especificación
```
