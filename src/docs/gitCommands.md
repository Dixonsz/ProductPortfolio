================================================================
              GUÍA DE RAMAS - GIT BRANCH MANAGEMENT
================================================================

ESTRUCTURA DE RAMAS
-------------------
main          → Producción estable (solo merges desde develop/hotfix)
develop       → Integración general, rama base del equipo
feature/*     → Nuevas funcionalidades
bugfix/*      → Corrección de bugs en desarrollo
hotfix/*      → Corrección urgente directo desde main
release/*     → Preparación de versión para producción


NOMENCLATURA DE RAMAS
---------------------
feature/nombre-descriptivo
feature/auth-login
feature/user-profile-page
feature/api-client-setup

bugfix/nombre-del-bug
bugfix/fix-token-refresh
bugfix/404-on-home-redirect

hotfix/descripcion-urgente
hotfix/critical-login-crash

release/v1.0.0
release/v2.3.1


================================================================
                        COMANDOS ESENCIALES
================================================================

CREAR RAMAS
-----------
# Crear rama y quedarte en la actual
git branch feature/nombre

# Crear rama y moverse a ella inmediatamente (recomendado)
git checkout -b feature/develop

# Crear rama desde una rama específica
git checkout -b feature/nombre develop

# Crear rama desde un commit específico
git checkout -b feature/nombre <hash-commit>


MOVERSE ENTRE RAMAS
-------------------
# Ir a una rama existente
git checkout nombre-rama
git switch nombre-rama              ← forma moderna (Git 2.23+)

# Volver a la rama anterior
git checkout -
git switch -

# Ver en qué rama estás
git branch
git status


LISTAR RAMAS
------------
# Ramas locales
git branch

# Ramas remotas
git branch -r

# Todas (locales + remotas)
git branch -a

# Con último commit de cada rama
git branch -v


ACTUALIZAR RAMAS
----------------
# Traer cambios del remoto sin fusionar
git fetch origin

# Traer y fusionar (pull)
git pull origin nombre-rama

# Actualizar tu rama con los últimos cambios de develop
git checkout feature/mi-rama
git merge develop

# Alternativa con rebase (historial más limpio)
git rebase develop


FUSIONAR RAMAS (MERGE)
----------------------
# Ir a la rama destino primero
git checkout develop

# Fusionar tu rama en develop
git merge feature/nombre

# Merge sin fast-forward (mantiene historial de la rama)
git merge --no-ff feature/nombre

# Merge squash (aplasta todos los commits en uno)
git merge --squash feature/nombre


ELIMINAR RAMAS
--------------
# Eliminar rama local (solo si ya fue mergeada)
git branch -d feature/nombre

# Eliminar rama local forzado (aunque no haya sido mergeada)
git branch -D feature/nombre

# Eliminar rama en remoto
git push origin --delete feature/nombre

# Limpiar referencias a ramas remotas eliminadas
git fetch --prune
git remote prune origin


PUBLICAR RAMAS
--------------
# Subir rama nueva al remoto
git push origin feature/nombre

# Subir y establecer tracking (para hacer pull/push sin especificar)
git push -u origin feature/nombre

# Subir todos los cambios locales al remoto
git push


RENOMBRAR RAMAS
---------------
# Renombrar la rama en la que estás
git branch -m nuevo-nombre

# Renombrar una rama específica
git branch -m nombre-viejo nuevo-nombre

# Publicar la rama renombrada y eliminar la vieja en remoto
git push origin -u nuevo-nombre
git push origin --delete nombre-viejo


STASH (GUARDAR CAMBIOS TEMPORALMENTE)
--------------------------------------
# Guardar cambios sin commitear antes de cambiar de rama
git stash

# Guardar con descripción
git stash push -m "descripción del stash"

# Ver lista de stashes guardados
git stash list

# Recuperar el último stash
git stash pop

# Recuperar un stash específico
git stash apply stash@{2}

# Eliminar un stash
git stash drop stash@{0}

# Eliminar todos los stashes
git stash clear


================================================================
                     FLUJO DE TRABAJO TÍPICO
================================================================

INICIAR UNA NUEVA FUNCIONALIDAD
--------------------------------
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad

  ... trabajas, haces commits ...

git push -u origin feature/nombre-funcionalidad
  → Abres Pull Request hacia develop


CORREGIR UN BUG EN DESARROLLO
------------------------------
git checkout develop
git pull origin develop
git checkout -b bugfix/descripcion-bug

  ... corriges el bug ...

git push -u origin bugfix/descripcion-bug
  → Abres Pull Request hacia develop


HOTFIX EN PRODUCCIÓN
---------------------
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-urgente

  ... aplicas la corrección ...

git checkout main
git merge --no-ff hotfix/descripcion-urgente
git tag -a v1.0.1 -m "hotfix: descripcion-urgente"
git push origin main

git checkout develop
git merge --no-ff hotfix/descripcion-urgente
git push origin develop

git branch -d hotfix/descripcion-urgente


PREPARAR UN RELEASE
--------------------
git checkout develop
git checkout -b release/v1.0.0

  ... ajustes finales, bump de versión, docs ...

git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "release: v1.0.0"
git push origin main --tags

git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

git branch -d release/v1.0.0


================================================================
                      REFERENCIA RÁPIDA
================================================================

git checkout -b feature/nombre develop   → crear y moverse
git checkout nombre-rama                 → moverse
git checkout -                           → rama anterior
git branch -a                           → listar todas
git merge --no-ff feature/nombre        → fusionar
git branch -d feature/nombre            → eliminar local
git push origin --delete feature/nombre → eliminar remoto
git stash / git stash pop               → guardar/recuperar cambios
git fetch --prune                       → limpiar remotas eliminadas

================================================================