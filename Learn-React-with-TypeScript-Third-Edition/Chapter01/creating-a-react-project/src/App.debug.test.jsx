import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component - Debug', () => {
  test('debug: ver qué se renderiza en el DOM', () => {
    const { container } = render(<App />)
    
    // Ver el HTML completo renderizado
    console.log('=== HTML RENDERIZADO ===')
    console.log(container.innerHTML)
    
    // Ver todos los elementos encontrados
    console.log('=== ELEMENTOS ENCONTRADOS ===')
    console.log(screen.debug())
    
    // Verificar que al menos algo se renderizó
    expect(container.firstChild).toBeTruthy()
  })
  
  test('verificar que el componente existe', () => {
    expect(App).toBeDefined()
    expect(typeof App).toBe('function')
    
    const result = App()
    console.log('=== RESULTADO DEL COMPONENTE ===')
    console.log(result)
  })
})
