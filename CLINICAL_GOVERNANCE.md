# Gobernanza clínica

## Objetivo

Mantener una herramienta educativa exacta, trazable y claramente separada de los materiales oficiales de certificación y de la toma de decisiones sin supervisión.

## Roles mínimos

| Rol | Responsabilidad |
| --- | --- |
| Responsable clínico PALS | Confirma algoritmo, indicación, dosis, máximos, unidades y redacción de seguridad. |
| Revisor clínico independiente | Repite los cálculos y compara cada cambio con la fuente primaria. |
| Responsable técnico | Revisa código, pruebas, PWA, accesibilidad y despliegue. |
| Propietario del repositorio | Autoriza la publicación y conserva el historial. |

Una misma persona puede desempeñar más de un rol, pero todo cambio de fórmula o dosis debe recibir una segunda revisión clínica.

## Cadencia

- Revisión programada trimestral de enlaces, avisos de cambio y erratas.
- Revisión extraordinaria cuando AHA/AAP publique un cambio, corrección o material actualizado.
- Revisión anual completa aunque no existan cambios anunciados.

## Proceso de cambio clínico

1. Registrar la fuente primaria, fecha de acceso y sección afectada.
2. Describir el valor anterior, el nuevo valor y el motivo.
3. Actualizar el contenido o la fórmula.
4. Añadir una prueba de límite inferior, valor habitual y dosis máxima.
5. Ejecutar la validación automática.
6. Obtener aprobación clínica y técnica en pull request.
7. Incrementar versión, caché, fecha de revisión y changelog.

## Reglas de contenido

- Priorizar guías y algoritmos oficiales AHA/AAP; usar literatura secundaria solo para contexto, nunca para sustituir un valor oficial disponible.
- No incluir tablas aproximadas de percentiles como si fueran objetivos individualizados.
- No inferir máximos cuando el algoritmo no los declara; mostrar la necesidad de protocolo o dosis adulta.
- Expresar concentración junto a epinefrina cuando se calcule volumen.
- Diferenciar desfibrilación de cardioversión sincronizada.
- Mantener la advertencia de doble verificación cerca de los resultados.
- No usar logotipos, diagramas ni fragmentos extensos protegidos sin autorización.

## Incidentes

Un error que pueda alterar dosis, energía, secuencia o indicación se trata como incidente crítico. Debe retirarse o corregirse con prioridad, documentarse en el changelog y notificarse a los usuarios por el mecanismo disponible en el entorno de distribución.
