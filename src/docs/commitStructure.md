================================================================
        ESTRUCTURA DE COMMITS - CONVENTIONAL COMMITS
================================================================

FORMATO BASE
------------
<tipo>(<alcance>): <descripción corta>

[cuerpo opcional]

[footer opcional]


TIPOS PERMITIDOS
----------------
feat      → Nueva funcionalidad
fix       → Corrección de bug
style     → Cambios de estilos (CSS, Tailwind, formato visual)
refactor  → Refactorización de código sin cambiar funcionalidad
chore     → Tareas de configuración, dependencias, build
docs      → Documentación
test      → Pruebas unitarias o de integración
perf      → Mejoras de rendimiento
ci        → Configuración de CI/CD
revert    → Revierte un commit anterior


ALCANCES SUGERIDOS (ajustar según proyecto)
--------------------------------------------
auth        → Autenticación / autorización
ui          → Componentes de interfaz
api         → Capa de consumo de backend
router      → Configuración de rutas
store       → Estado global
hooks       → Custom hooks
services    → Lógica de negocio
adapters    → Transformación de datos
config      → Variables de entorno / configuración
deps        → Dependencias del proyecto


EJEMPLOS
--------
feat(auth): agregar login con JWT
fix(api): corregir interceptor de token expirado
style(ui): ajustar espaciado en componente Button
refactor(services): separar lógica de usuario en módulo propio
chore(deps): actualizar axios a v1.7
docs(router): documentar guards de rutas privadas
feat(store): integrar Zustand para manejo de sesión
fix(adapters): mapear correctamente campo email del backend
perf(hooks): memorizar llamadas en useFetchUser
revert: revertir feat(auth) por conflicto con módulo de roles


REGLAS GENERALES
----------------
1. Descripción en minúscula y sin punto final
2. Máximo 72 caracteres en la primera línea
3. Usar español o inglés, pero nunca mezclar en el mismo proyecto
4. El cuerpo explica el QUÉ y el POR QUÉ, no el cómo
5. Un commit = un propósito (no mezclar feat + fix)
6. Usar BREAKING CHANGE en el footer si rompe compatibilidad


COMMIT CON BREAKING CHANGE
--------------------------
feat(api): cambiar estructura de respuesta del cliente HTTP

El cliente ahora retorna { data, error, status } en lugar de
la respuesta directa de axios para estandarizar el manejo.

BREAKING CHANGE: todos los servicios deben actualizarse
para desestructurar la nueva forma de respuesta.


FLUJO RECOMENDADO POR RAMA
---------------------------
main          → Solo merges desde develop (producción estable)
develop       → Integración general del equipo
feature/*     → feat, style, refactor
bugfix/*      → fix
hotfix/*      → fix urgente directo a main
release/*     → chore, docs, bump de versión


================================================================
                     REFERENCIA RÁPIDA
================================================================

feat | fix | style | refactor | chore | docs | test | perf | ci | revert
(<alcance>): <qué hiciste en minúscula sin punto final>

================================================================