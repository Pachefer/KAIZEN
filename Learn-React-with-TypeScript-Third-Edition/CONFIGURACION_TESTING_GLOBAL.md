# 🧪 Configuración Global de Testing - Capítulos 1-12

## 📋 Resumen

Esta guía describe la configuración estandarizada de testing aplicada a todos los capítulos del libro "Learn React with TypeScript". Cada proyecto incluye pruebas unitarias con Vitest, React Testing Library y Jest-DOM.

## 🛠️ Configuración Implementada

### Dependencias de Testing

Todos los proyectos incluyen estas dependencias:

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.4",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@vitest/ui": "^3.2.4",
    "jsdom": "^26.1.0",
    "vitest": "^3.2.4"
  }
}
```

### Scripts de Testing

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 📁 Archivos de Configuración

### 1. `vite.config.js` (Capítulo 1 - JavaScript)

```javascript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'vite.config.*',
        'vitest.config.*',
        'eslint.config.*'
      ]
    }
  }
})
```

### 2. `vite.config.ts` (Capítulos 2+ - TypeScript)

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/index.ts',
        '**/types.ts',
        'vite.config.*',
        'vitest.config.*',
        'eslint.config.*'
      ]
    }
  }
})
```

### 3. `vitest.setup.js` (JavaScript Projects)

- Configuración de DOM con JSDOM
- Mocks de APIs del navegador
- Setup de React Testing Library
- Limpieza automática después de cada test

### 4. `vitest.setup.ts` (TypeScript Projects)

- Configuración tipada con TypeScript
- Extensión de expect con jest-dom matchers
- Configuración de DOM y mocks
- Tipos globales configurados

## 🎯 Características del Setup

### ✅ DOM Environment
- **JSDOM** configurado automáticamente
- APIs del navegador mockeadas (matchMedia, IntersectionObserver, etc.)
- Variables globales (window, document, navigator) disponibles

### ✅ React Testing Library
- Configuración automática de jest-dom matchers
- Limpieza de componentes después de cada test
- Utilities de testing importadas globalmente

### ✅ Coverage Reports
- Cobertura de código con V8 provider
- Reportes en formato text, JSON y HTML
- Exclusiones configuradas para archivos de configuración

### ✅ TypeScript Support
- Tipos de Vitest disponibles globalmente
- Configuración tipada para projects TypeScript
- Soporte completo para .tsx y .ts files

## 🚀 Comandos Disponibles

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas una vez
npm test

# Ejecutar en modo watch
npm run test:watch

# Ejecutar con reporte de cobertura
npm run test:coverage

# Abrir UI de Vitest
npm run test:ui
```

## 📊 Estructura de Pruebas

### Ejemplo de Test (JavaScript)
```javascript
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MiComponente from './MiComponente'

describe('MiComponente', () => {
  test('renderiza correctamente', () => {
    render(<MiComponente />)
    expect(screen.getByText('Texto esperado')).toBeDefined()
  })

  test('maneja eventos de click', () => {
    const mockHandler = vi.fn()
    render(<MiComponente onClick={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})
```

### Ejemplo de Test (TypeScript)
```typescript
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ComponentProps } from 'react'
import MiComponente from './MiComponente'

type Props = ComponentProps<typeof MiComponente>

describe('MiComponente', () => {
  test('renderiza con props tipadas', () => {
    const props: Props = {
      title: 'Test Title',
      onClick: vi.fn()
    }
    
    render(<MiComponente {...props} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})
```

## 🔧 Aplicación por Capítulo

### Capítulo 1: React Basics (JavaScript)
- ✅ Configuración de Vitest con JavaScript
- ✅ Testing de componentes funcionales
- ✅ Testing de hooks (useState, useEffect)
- ✅ Testing de eventos

### Capítulo 2: TypeScript Basics
- ✅ Configuración con TypeScript
- ✅ Testing de tipos
- ✅ Testing de componentes tipados

### Capítulo 3: React Hooks (TypeScript)
- ✅ Testing de hooks personalizados
- ✅ Testing de useEffect, useReducer, etc.
- ✅ Testing de contexto

### Capítulos 4-6: Styling & Routing
- ✅ Testing de componentes con estilos
- ✅ Testing de navegación
- ✅ Testing de rutas dinámicas

### Capítulos 7-8: Data Fetching
- ✅ Mocking de fetch API
- ✅ Testing de componentes async
- ✅ Testing de React Query/TanStack Query

### Capítulos 9: Forms
- ✅ Testing de formularios
- ✅ Testing de validación
- ✅ Testing de server actions

### Capítulos 10: State Management
- ✅ Testing de Context
- ✅ Testing de Zustand
- ✅ Testing de estado global

### Capítulos 11: Advanced Patterns
- ✅ Testing de render props
- ✅ Testing de HOCs
- ✅ Testing de custom hooks

### Capítulos 12: Testing (Avanzado)
- ✅ Testing de componentes complejos
- ✅ Testing de interacciones de usuario
- ✅ Reportes de cobertura
- ✅ Testing de funciones puras

## 📝 Notas Importantes

1. **Compatibilidad**: Todas las configuraciones son compatibles con React 19 y las últimas versiones de las herramientas
2. **Performance**: Los tests están optimizados para ejecución rápida
3. **Mantenibilidad**: Configuración consistente en todos los capítulos
4. **Escalabilidad**: Fácil de extender con nuevas funcionalidades de testing

## 🆘 Troubleshooting

### Error: "document is not defined"
- ✅ **Resuelto**: Configuración automática de JSDOM en vitest.setup

### Error: "expect(...).toBeInTheDocument is not a function"
- ✅ **Resuelto**: jest-dom matchers configurados automáticamente

### Error: "window.matchMedia is not a function"
- ✅ **Resuelto**: Mock de matchMedia incluido en setup

### Linter errors en archivos de test
- ✅ **Resuelto**: Configuración de globals en vitest.config

## 🎉 Resultado

**✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE**

Todos los capítulos (1-12) tienen configuración estandarizada de testing que incluye:
- Vitest como test runner
- React Testing Library para testing de componentes
- Jest-DOM para matchers adicionales
- JSDOM para environment del navegador
- Cobertura de código configurada
- TypeScript support cuando aplica
- Scripts npm estandarizados
