# 🗂️ Git - Control de Versiones Avanzado

## 📋 Índice

1. [Configuración Avanzada](#configuración-avanzada)
2. [Comandos Avanzados](#comandos-avanzados)
3. [Flujos de Trabajo](#flujos-de-trabajo)
4. [Resolución de Conflictos](#resolución-de-conflictos)
5. [Git Hooks](#git-hooks)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración Avanzada

### Configuración Global y Local

```bash
# Configuración global de Git - Se aplica a todos los repositorios del usuario
git config --global user.name "Tu Nombre" # Establece nombre de usuario global
git config --global user.email "tu.email@ejemplo.com" # Establece email global
git config --global core.editor "code --wait" # Establece editor por defecto (VS Code)
git config --global init.defaultBranch main # Establece rama principal por defecto

# RESULTADO ESPERADO: Configuración global aplicada a ~/.gitconfig
# Archivo ~/.gitconfig creado con las configuraciones especificadas

# Configuración local del repositorio - Solo aplica al repositorio actual
git config user.name "Nombre Específico" # Establece nombre para este repo
git config user.email "especifico@ejemplo.com" # Establece email para este repo
git config core.autocrlf input # Configura manejo de line endings (Linux/Mac)

# RESULTADO ESPERADO: Configuración local aplicada a .git/config del repositorio
# Las configuraciones locales tienen prioridad sobre las globales

# Verificar configuraciones
git config --list --show-origin # Muestra todas las configuraciones con su origen
git config --get user.name # Obtiene valor específico de configuración
git config --get user.email # Obtiene email configurado

# RESULTADO ESPERADO: Lista de todas las configuraciones activas con su ubicación
```

### Configuración de Alias Útiles

```bash
# Crear alias para comandos frecuentes - Acelera el flujo de trabajo
git config --global alias.st status # git st = git status
git config --global alias.co checkout # git co = git checkout
git config --global alias.br branch # git br = git branch
git config --global alias.ci commit # git ci = git commit
git config --global alias.unstage 'reset HEAD --' # git unstage = git reset HEAD --
git config --global alias.last 'log -1 HEAD' # git last = git log -1 HEAD
git config --global alias.visual '!gitk' # git visual = abre gitk

# RESULTADO ESPERADO: Alias configurados en ~/.gitconfig
# Ahora puedes usar comandos más cortos: git st, git co, git br, etc.

# Alias avanzados para flujos de trabajo complejos
git config --global alias.lg "log --oneline --graph --decorate --all" # Log gráfico
git config --global alias.ll "log --oneline --graph --decorate" # Log local
git config --global alias.cleanup "!git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d" # Limpia ramas merged
git config --global alias.undo "reset --soft HEAD~1" # Deshace último commit

# RESULTADO ESPERADO: Alias avanzados para operaciones complejas
# git lg = muestra log con gráfico de ramas
# git cleanup = elimina ramas ya fusionadas
```

---

## 🔄 Comandos Avanzados

### Manipulación de Commits

```bash
# Rebase interactivo - Permite modificar commits existentes
git rebase -i HEAD~3 # Inicia rebase interactivo de los últimos 3 commits
# RESULTADO ESPERADO: Editor se abre con lista de commits para modificar
# Opciones disponibles: pick, reword, edit, squash, fixup, drop

# Ejemplo de archivo de rebase interactivo:
# pick abc1234 Primer commit - Implementa funcionalidad básica
# reword def5678 Segundo commit - Corrige error de validación
# squash ghi9012 Tercer commit - Agrega tests unitarios

# Cambiar mensaje del último commit
git commit --amend -m "Nuevo mensaje del commit" # Modifica mensaje del último commit
# RESULTADO ESPERADO: Último commit modificado con nuevo mensaje
# ⚠️ ADVERTENCIA: Solo usar en commits que no han sido pushados

# Dividir un commit en múltiples commits
git reset --soft HEAD~1 # Deshace último commit manteniendo cambios en staging
git add archivo1.txt # Agrega primer archivo
git commit -m "Primer commit: archivo1.txt" # Crea primer commit
git add archivo2.txt # Agrega segundo archivo
git commit -m "Segundo commit: archivo2.txt" # Crea segundo commit

# RESULTADO ESPERADO: Un commit dividido en dos commits separados
```

### Stashing Avanzado

```bash
# Stash con mensaje descriptivo
git stash push -m "Trabajo en progreso: implementación de login" # Guarda cambios con mensaje
# RESULTADO ESPERADO: Cambios guardados en stash con mensaje descriptivo

# Stash de archivos específicos
git stash push archivo1.txt archivo2.txt # Guarda solo archivos específicos
# RESULTADO ESPERADO: Solo los archivos especificados se guardan en stash

# Stash incluyendo archivos no trackeados
git stash push -u -m "Incluye archivos nuevos" # -u incluye archivos no trackeados
# RESULTADO ESPERADO: Stash incluye archivos nuevos y modificados

# Aplicar stash específico
git stash list # Lista todos los stashes
# RESULTADO ESPERADO: Lista como "stash@{0}: Trabajo en progreso: implementación de login"

git stash apply stash@{1} # Aplica stash específico sin eliminarlo
git stash pop stash@{1} # Aplica stash específico y lo elimina
# RESULTADO ESPERADO: Cambios del stash aplicados al working directory

# Crear rama desde stash
git stash branch nueva-rama stash@{0} # Crea rama nueva desde stash
# RESULTADO ESPERADO: Nueva rama creada con cambios del stash aplicados
```

### Logs y Búsqueda Avanzada

```bash
# Log con filtros avanzados
git log --author="Juan Pérez" --since="2024-01-01" --until="2024-12-31" # Commits por autor y fecha
# RESULTADO ESPERADO: Lista de commits del autor en el rango de fechas especificado

git log --grep="bug" --oneline # Busca commits que contengan "bug" en el mensaje
# RESULTADO ESPERADO: Commits que contengan "bug" en el mensaje

git log -S "función_importante" # Busca commits que agregaron o removieron la función
# RESULTADO ESPERADO: Commits que modificaron la función especificada

# Log con estadísticas
git log --stat # Muestra estadísticas de archivos modificados
# RESULTADO ESPERADO: Lista de commits con número de líneas agregadas/eliminadas por archivo

git log --shortstat # Estadísticas resumidas
# RESULTADO ESPERADO: Resumen de archivos modificados, líneas agregadas/eliminadas

# Log gráfico
git log --graph --oneline --all --decorate # Gráfico visual de ramas
# RESULTADO ESPERADO: Visualización gráfica de la historia de commits y ramas
```

---

## 🌿 Flujos de Trabajo

### Git Flow

```bash
# Inicializar Git Flow en repositorio
git flow init # Inicializa Git Flow con ramas principales
# RESULTADO ESPERADO: Pregunta por nombres de ramas (main, develop, feature, release, hotfix)

# Crear feature branch
git flow feature start nueva-funcionalidad # Crea rama feature desde develop
# RESULTADO ESPERADO: Nueva rama feature/nueva-funcionalidad creada desde develop

# Trabajar en feature
git add . # Agrega cambios
git commit -m "Implementa nueva funcionalidad" # Hace commit
git push origin feature/nueva-funcionalidad # Push a repositorio remoto

# Finalizar feature
git flow feature finish nueva-funcionalidad # Fusiona feature en develop y elimina rama
# RESULTADO ESPERADO: Feature fusionada en develop, rama feature eliminada

# Crear release
git flow release start v1.0.0 # Crea rama release desde develop
# RESULTADO ESPERADO: Nueva rama release/v1.0.0 creada

# Finalizar release
git flow release finish v1.0.0 # Fusiona release en main y develop, crea tag
# RESULTADO ESPERADO: Release fusionada en main y develop, tag v1.0.0 creado

# Crear hotfix
git flow hotfix start error-critico # Crea rama hotfix desde main
# RESULTADO ESPERADO: Nueva rama hotfix/error-critico creada desde main

# Finalizar hotfix
git flow hotfix finish error-critico # Fusiona hotfix en main y develop
# RESULTADO ESPERADO: Hotfix fusionado en main y develop, tag creado
```

### GitHub Flow

```bash
# Crear rama desde main
git checkout -b feature/nueva-funcionalidad # Crea y cambia a nueva rama
# RESULTADO ESPERADO: Nueva rama creada desde main

# Trabajar y hacer commits
git add . # Agrega cambios
git commit -m "Implementa nueva funcionalidad" # Commit descriptivo
git push origin feature/nueva-funcionalidad # Push a repositorio remoto

# Crear Pull Request (desde GitHub/GitLab)
# RESULTADO ESPERADO: Pull Request creado para revisión

# Después de aprobación, merge a main
git checkout main # Cambia a rama main
git pull origin main # Actualiza main local
git merge feature/nueva-funcionalidad # Fusiona feature
git push origin main # Push de cambios
git branch -d feature/nueva-funcionalidad # Elimina rama local

# RESULTADO ESPERADO: Feature fusionada en main, rama eliminada
```

---

## ⚠️ Resolución de Conflictos

### Identificar Conflictos

```bash
# Verificar estado de conflictos
git status # Muestra archivos con conflictos
# RESULTADO ESPERADO: Lista de archivos marcados como "both modified"

# Ver conflictos en archivo específico
git diff archivo.txt # Muestra diferencias en archivo con conflictos
# RESULTADO ESPERADO: Marcadores de conflicto en el archivo

# Ejemplo de archivo con conflictos:
# <<<<<<< HEAD
# Línea del código actual
# =======
# Línea del código que viene de otra rama
# >>>>>>> feature/nueva-funcionalidad
```

### Resolver Conflictos

```bash
# Abrir archivo con conflictos en editor
code archivo.txt # Abre archivo en VS Code
# RESULTADO ESPERADO: Editor muestra marcadores de conflicto

# Editar archivo manualmente
# Eliminar marcadores de conflicto y mantener código deseado
# Guardar archivo

# Marcar conflicto como resuelto
git add archivo.txt # Marca archivo como resuelto
# RESULTADO ESPERADO: Archivo marcado como "staged for commit"

# Verificar que todos los conflictos están resueltos
git status # Verifica estado
# RESULTADO ESPERADO: No debe mostrar archivos con conflictos

# Completar merge
git commit -m "Resuelve conflictos de merge" # Completa el merge
# RESULTADO ESPERADO: Merge completado exitosamente
```

### Herramientas de Resolución

```bash
# Usar herramienta de merge
git mergetool # Abre herramienta de merge configurada
# RESULTADO ESPERADO: Herramienta visual para resolver conflictos

# Configurar herramienta de merge
git config --global merge.tool vscode # Configura VS Code como herramienta
git config --global mergetool.vscode.cmd 'code --wait $MERGED' # Comando para VS Code

# Abortar merge si es necesario
git merge --abort # Cancela merge y vuelve al estado anterior
# RESULTADO ESPERADO: Merge cancelado, repositorio vuelve al estado antes del merge
```

---

## 🪝 Git Hooks

### Hooks del Lado Cliente

```bash
# Crear hook pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Hook que se ejecuta antes de cada commit

echo "Ejecutando pre-commit hook..."

# Verificar que no hay archivos con TODO sin resolver
if git diff --cached --name-only | xargs grep -l "TODO"; then
    echo "Error: Archivos contienen TODO sin resolver"
    exit 1
fi

# Ejecutar tests antes del commit
npm test
if [ $? -ne 0 ]; then
    echo "Error: Tests fallaron"
    exit 1
fi

echo "Pre-commit hook completado exitosamente"
EOF

chmod +x .git/hooks/pre-commit # Hace el hook ejecutable
# RESULTADO ESPERADO: Hook pre-commit creado y configurado

# Hook post-commit
cat > .git/hooks/post-commit << 'EOF'
#!/bin/sh
# Hook que se ejecuta después de cada commit

echo "Ejecutando post-commit hook..."

# Enviar notificación
echo "Commit realizado: $(git log -1 --pretty=format:'%s')"

# Actualizar documentación si es necesario
if git diff-tree --name-only HEAD | grep -q "README"; then
    echo "README modificado, actualizando documentación..."
fi

echo "Post-commit hook completado"
EOF

chmod +x .git/hooks/post-commit # Hace el hook ejecutable
# RESULTADO ESPERADO: Hook post-commit creado y configurado
```

### Hooks del Lado Servidor

```bash
# Hook pre-receive (en servidor)
cat > hooks/pre-receive << 'EOF'
#!/bin/sh
# Hook que se ejecuta en servidor antes de recibir push

echo "Verificando push..."

# Verificar que el commit tiene mensaje válido
while read oldrev newrev refname; do
    if git log --format=%B $oldrev..$newrev | grep -q "^WIP"; then
        echo "Error: No se permiten commits con mensaje 'WIP'"
        exit 1
    fi
done

echo "Push verificado exitosamente"
EOF

chmod +x hooks/pre-receive # Hace el hook ejecutable
# RESULTADO ESPERADO: Hook pre-receive configurado en servidor
```

---

## 🧪 Testing de Git

### Scripts de Testing

```bash
# Script para probar flujo de trabajo Git
#!/bin/bash
# test-git-workflow.sh

echo "🧪 Iniciando pruebas de flujo de trabajo Git..."

# Crear repositorio de prueba
mkdir test-repo && cd test-repo
git init

# Configurar usuario
git config user.name "Test User"
git config user.email "test@example.com"

# Crear archivo inicial
echo "Contenido inicial" > archivo.txt
git add archivo.txt
git commit -m "Commit inicial"

# Crear rama feature
git checkout -b feature/test
echo "Nueva funcionalidad" >> archivo.txt
git add archivo.txt
git commit -m "Agrega nueva funcionalidad"

# Volver a main y hacer merge
git checkout main
git merge feature/test

# Verificar resultado
if git log --oneline | grep -q "Agrega nueva funcionalidad"; then
    echo "✅ Merge exitoso"
else
    echo "❌ Merge falló"
    exit 1
fi

echo "🎉 Pruebas completadas exitosamente"
# RESULTADO ESPERADO: Script ejecuta flujo completo y verifica resultados
```

### Automatización con GitHub Actions

```yaml
# .github/workflows/git-tests.yml
name: Git Workflow Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-git-workflow:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Verificar mensajes de commit
      run: |
        # Verificar que commits tienen formato correcto
        git log --format=%B ${{ github.event.before }}..${{ github.event.after }} | while read line; do
          if [[ ! $line =~ ^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: ]]; then
            echo "❌ Commit message no sigue convención: $line"
            exit 1
          fi
        done
    
    - name: Verificar que no hay archivos grandes
      run: |
        # Verificar que no hay archivos > 10MB
        find . -type f -size +10M | while read file; do
          echo "❌ Archivo muy grande: $file"
          exit 1
        done
    
    - name: Verificar estructura de ramas
      run: |
        # Verificar que estamos en rama correcta
        if [[ "${{ github.ref }}" != "refs/heads/main" && "${{ github.ref }}" != "refs/heads/develop" ]]; then
          echo "✅ Rama de feature detectada"
        fi

# RESULTADO ESPERADO: GitHub Actions ejecuta verificaciones automáticas en cada push/PR
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Git y cuáles son sus características principales?**
   - Sistema de control de versiones distribuido, historial completo, ramas

2. **¿Cuál es la diferencia entre Git y SVN?**
   - Git: distribuido, ramas locales, SVN: centralizado, ramas en servidor

3. **¿Qué son los commits en Git?**
   - Snapshots del repositorio, identificados por SHA-1, contienen cambios y metadatos

### Preguntas Intermedias

4. **¿Cómo funciona el merge en Git?**
   - Three-way merge, base común, cambios de ambas ramas, resolución de conflictos

5. **¿Qué es rebase y cuándo usarlo?**
   - Reaplica commits en nueva base, historia lineal, no usar en ramas compartidas

6. **¿Cómo manejar conflictos de merge?**
   - Identificar archivos conflictivos, editar manualmente, git add, completar merge

### Preguntas Avanzadas

7. **¿Cómo optimizar un repositorio Git grande?**
   - Git LFS, shallow clones, filtros de objetos, limpieza de historia

8. **¿Qué son los Git hooks y cómo usarlos?**
   - Scripts automáticos, pre/post eventos, validación, automatización

9. **¿Cómo implementar Git Flow en un proyecto?**
   - Ramas main/develop/feature/release/hotfix, flujo de trabajo estructurado

---

## 📚 Recursos Adicionales

- [Git Documentation](https://git-scm.com/doc)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Hooks](https://git-scm.com/docs/githooks)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Git! 🚀** 