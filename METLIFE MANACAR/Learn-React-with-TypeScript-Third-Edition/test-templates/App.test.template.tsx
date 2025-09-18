import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

describe('App Component - [CHAPTER_NAME]', () => {
  // Limpiar después de cada test para asegurar aislamiento
  beforeEach(() => {
    cleanup()
  })

  // Test 1: Verificar renderizado básico del componente
  test('renderiza el componente App correctamente', () => {
    const { container } = render(<App />)
    expect(container.firstChild).toBeTruthy()
    expect(container.innerHTML).toBeTruthy()
  })

  // Test 2: Verificar que el componente no tiene errores de consola
  test('no genera errores en la consola', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test 3: Verificar estructura general del DOM
  test('tiene una estructura DOM válida', () => {
    const { container } = render(<App />)
    
    // Verificar que hay contenido
    expect(container.textContent.length).toBeGreaterThan(0)
    expect(container.innerHTML.length).toBeGreaterThan(0)
  })

  // Test 4: Verificar que es un componente funcional válido
  test('es un componente React válido', () => {
    expect(typeof App).toBe('function')
    expect(App.name).toBe('App')
  })

  // Test 5: Verificar renderizado múltiple
  test('puede renderizarse múltiples veces sin errores', () => {
    const { container: container1 } = render(<App />)
    cleanup()
    const { container: container2 } = render(<App />)
    
    expect(container1.innerHTML).toBeTruthy()
    expect(container2.innerHTML).toBeTruthy()
  })

  // Test 6: Verificar tipos TypeScript (si aplica)
  test('tiene tipos TypeScript correctos', () => {
    // Verificar que el componente es tipeable
    const AppComponent: React.FC = App
    expect(AppComponent).toBeDefined()
  })
})
