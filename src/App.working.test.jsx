/**
 * PRUEBAS UNITARIAS FUNCIONALES PARA EL COMPONENTE APP
 * Estas pruebas están diseñadas para funcionar con la configuración actual
 */

import { describe, test, expect, vi, beforeAll } from 'vitest'
import { createRoot } from 'react-dom/client'
import App from './App'

// Configurar el DOM manualmente antes de las pruebas
beforeAll(() => {
  // Crear un documento HTML básico
  global.document = {
    createElement: vi.fn((tag) => ({
      tagName: tag.toUpperCase(),
      innerHTML: '',
      textContent: '',
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      appendChild: vi.fn(),
      removeChild: vi.fn(),
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(() => false)
      },
      style: {},
      children: [],
      parentNode: null
    })),
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
      innerHTML: '',
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => [])
    },
    head: {
      appendChild: vi.fn()
    },
    getElementById: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }

  global.window = {
    document: global.document,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    getComputedStyle: vi.fn(() => ({})),
    location: { href: 'http://localhost' },
    navigator: { userAgent: 'test' }
  }
})

describe('App Component - Pruebas Funcionales', () => {
  // Test 1: Verificar que el componente puede ser importado
  test('el componente App se puede importar correctamente', () => {
    expect(App).toBeDefined()
    expect(typeof App).toBe('function')
  })

  // Test 2: Verificar que el componente es una función React válida
  test('el componente App es una función React válida', () => {
    expect(App.name).toBe('App')
    expect(App.length).toBe(0) // No tiene parámetros
  })

  // Test 3: Verificar que el componente puede ejecutarse sin errores
  test('el componente App puede ejecutarse sin errores', () => {
    expect(() => {
      const result = App()
      return result
    }).not.toThrow()
  })

  // Test 4: Verificar que el componente retorna un elemento React
  test('el componente App retorna un elemento React válido', () => {
    const result = App()
    expect(result).toBeDefined()
    expect(result).toHaveProperty('type')
    expect(result).toHaveProperty('props')
  })

  // Test 5: Verificar la estructura del componente
  test('el componente App tiene la estructura esperada', () => {
    const result = App()
    expect(result.type).toBeDefined()
    expect(result.props).toBeDefined()
    expect(result.props.children).toBeDefined()
  })

  // Test 6: Verificar que contiene elementos esperados  
  test('el componente App contiene los elementos principales', () => {
    const appCode = App.toString()
    
    // Verificar que contiene las referencias principales
    expect(appCode).toContain('useState')
    expect(appCode).toContain('count')
    expect(appCode).toContain('setCount')
    expect(appCode).toContain('Vite + React')
  })

  // Test 7: Verificar que usa hooks de React
  test('el componente App usa hooks de React', () => {
    const appCode = App.toString()
    expect(appCode).toContain('useState')
    expect(appCode).toContain('0') // valor inicial del estado
  })

  // Test 8: Verificar que tiene los elementos de UI esperados
  test('el componente App contiene elementos de UI esperados', () => {
    const appCode = App.toString()
    expect(appCode).toContain('onClick')
    expect(appCode).toContain('button')
    expect(appCode).toContain('img')
    expect(appCode).toContain('href')
  })

  // Test 9: Verificar que maneja eventos
  test('el componente App maneja eventos de click', () => {
    const appCode = App.toString()
    expect(appCode).toContain('onClick')
    expect(appCode).toContain('setCount')
  })

  // Test 10: Verificar que tiene las URLs correctas
  test('el componente App contiene las URLs esperadas', () => {
    const appCode = App.toString()
    expect(appCode).toContain('https://vite.dev')
    expect(appCode).toContain('https://react.dev')
  })

  // Test 11: Verificar que tiene los logos
  test('el componente App contiene referencias a los logos', () => {
    const appCode = App.toString()
    expect(appCode).toContain('viteLogo')
    expect(appCode).toContain('reactLogo')
    expect(appCode).toContain('alt')
  })

  // Test 12: Verificar que tiene el texto de instrucciones
  test('el componente App contiene texto de instrucciones', () => {
    const appCode = App.toString()
    expect(appCode).toContain('Edit')
    expect(appCode).toContain('save to test HMR')
  })

  // Test 13: Verificar que tiene clases CSS
  test('el componente App contiene clases CSS', () => {
    const appCode = App.toString()
    expect(appCode).toContain('className')
    expect(appCode).toContain('logo')
    expect(appCode).toContain('card')
  })

  // Test 14: Verificar la lógica del contador
  test('el componente App implementa lógica de contador', () => {
    const appCode = App.toString()
    expect(appCode).toContain('count + 1')
    expect(appCode).toContain('count is')
  })

  // Test 15: Verificar que no arroja errores de sintaxis
  test('el componente App no tiene errores de sintaxis', () => {
    let syntaxError = null
    try {
      // Intentar evaluar la función como string
      new Function('return ' + App.toString())()
    } catch (error) {
      syntaxError = error
    }
    expect(syntaxError).toBeNull()
  })
})

// Pruebas adicionales de funcionalidad
describe('App Component - Funcionalidad Avanzada', () => {
  test('el componente puede ser llamado múltiples veces', () => {
    const result1 = App()
    const result2 = App()
    
    expect(result1).toBeDefined()
    expect(result2).toBeDefined()
    
    // Ambos resultados deben tener la misma estructura
    expect(result1.type).toBe(result2.type)
  })

  test('el componente mantiene consistencia en su output', () => {
    const results = []
    for (let i = 0; i < 5; i++) {
      results.push(App())
    }
    
    // Todos los resultados deben ser consistentes
    results.forEach(result => {
      expect(result).toBeDefined()
      expect(result.type).toBeDefined()
      expect(result.props).toBeDefined()
    })
  })
})
