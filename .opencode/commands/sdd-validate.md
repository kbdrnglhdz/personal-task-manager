---
description: Valida un archivo de especificación
agent: subagent
---

Valida el archivo de especificación SDD en `$ARGUMENTS`.

Pasos a seguir:
1. Lee el archivo especificado en `$ARGUMENTS`
2. Verifica que contenga los encabezados requeridos:
   - ## 1. Descripción (o similar)
   - ## 2. Modelo de Datos
   - ## 3. Requerimientos Funcionales
   - ## 4. Requerimientos No Funcionales
   - ## 5. Endpoints API
   - ## 6. Criterios de Aceptación
3. Verifica que no haya referencias rotas a otros specs
4. Verifica el formato de tablas (si las hay)
5. Reporta los errores encontrados o confirma que es válido

Si el archivo no existe, indica que debe crearse primero.
