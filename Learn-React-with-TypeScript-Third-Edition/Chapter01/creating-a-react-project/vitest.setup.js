// Configuración de testing para React Testing Library - Capítulo 1
import '@testing-library/jest-dom'
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpiar después de cada test
afterEach(() => {
  cleanup()
})

// Configurar el DOM
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
})

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator

// Mocks necesarios para React Testing Library
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock de fetch para pruebas de API
global.fetch = vi.fn()

// Suprimir warnings de React en pruebas
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('ReactDOM.render is deprecated'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
