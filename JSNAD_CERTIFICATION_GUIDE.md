# 🚀 Guía Completa de Certificación OpenJS Node.js Application Developer (JSNAD)

## 📋 Tabla de Contenidos

1. [Introducción a JSNAD](#introducción-a-jsnad)
2. [Fundamentos de Node.js](#fundamentos-de-nodejs)
3. [Módulos y Sistema de Módulos](#módulos-y-sistema-de-módulos)
4. [Control de Flujo Asíncrono](#control-de-flujo-asíncrono)
5. [Control de Flujo Síncrono](#control-de-flujo-síncrono)
6. [Streams](#streams)
7. [Sistema de Archivos](#sistema-de-archivos)
8. [Módulos de Utilidad](#módulos-de-utilidad)
9. [Testing y Debugging](#testing-y-debugging)
10. [Seguridad](#seguridad)
11. [Performance y Optimización](#performance-y-optimización)
12. [Examen de Práctica](#examen-de-práctica)

## 🎯 Introducción a JSNAD

### ¿Qué es JSNAD?

**JSNAD** (JavaScript Node.js Application Developer) es una certificación oficial de OpenJS Foundation que valida tu conocimiento en el desarrollo de aplicaciones Node.js. Esta certificación demuestra que tienes las habilidades necesarias para construir aplicaciones Node.js robustas y escalables.

### Temas del Examen

El examen JSNAD cubre los siguientes dominios principales:

- **Control de Flujo Asíncrono (25%)**
- **Control de Flujo Síncrono (25%)**
- **Módulos y Sistema de Módulos (20%)**
- **Streams (15%)**
- **Sistema de Archivos (15%)**

### Duración y Formato

- **Duración**: 90 minutos
- **Preguntas**: 50 preguntas de opción múltiple
- **Puntuación mínima**: 70%
- **Formato**: Examen en línea con supervisión

### Preparación Recomendada

- **Experiencia**: Al menos 1-2 años desarrollando con Node.js
- **Práctica**: Mínimo 20-30 horas de práctica con ejemplos
- **Recursos**: Node.js oficial docs, práctica con código real

---

## 🔧 Configuración del Entorno de Práctica

### Instalación de Node.js

```bash
# Verificar versión actual
node --version
npm --version

# Instalar la versión LTS recomendada
# Recomendado: Node.js 18.x o 20.x LTS
```

### Estructura del Proyecto de Práctica

```bash
mkdir jsnad-practice
cd jsnad-practice
npm init -y

# Instalar dependencias de testing
npm install --save-dev jest @types/node

# Crear estructura de directorios
mkdir src tests examples
```

### Configuración de Jest

```json
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

---

## 📚 Próximas Secciones

En las siguientes secciones, cubriremos cada tema del examen con:

- ✅ Explicación teórica detallada
- 🔍 Ejemplos de código prácticos
- 🧪 Pruebas unitarias completas
- ⚠️ Casos edge y mejores prácticas
- 🎯 Preguntas de práctica del examen
- 📝 Resúmenes y puntos clave

**¡Continuemos con los fundamentos de Node.js!**
