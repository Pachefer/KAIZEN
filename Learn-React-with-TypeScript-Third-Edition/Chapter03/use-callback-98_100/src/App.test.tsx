import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import App from './App'

describe('App Component - Chapter03 - use-callback', () => {
  beforeEach(() => {
    cleanup()
  })

  test('renderiza el componente App correctamente', () => {
    const { container } = render(<App />)
    expect(container.firstChild).toBeTruthy()
    expect(container.innerHTML).toBeTruthy()
  })

  test('no genera errores en la consola', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  test('tiene una estructura DOM válida', () => {
    const { container } = render(<App />)
    expect(container.textContent.length).toBeGreaterThan(0)
    expect(container.innerHTML.length).toBeGreaterThan(0)
  })

  test('es un componente React válido', () => {
    expect(typeof App).toBe('function')
    expect(App.name).toBe('App')
  })

  test('puede renderizarse múltiples veces sin errores', () => {
    // Primer renderizado
    const { unmount: unmount1 } = render(<App />)
    unmount1()
    
    // Segundo renderizado
    const { container } = render(<App />)
    
    // Verificar que el segundo renderizado produce elementos DOM
    expect(container.children.length).toBeGreaterThan(0)
  })

  test('tiene tipos TypeScript correctos', () => {
    const AppComponent: React.FC = App
    expect(AppComponent).toBeDefined()
  })
})