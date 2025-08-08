import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Component - Capítulo 1 (Versión Corregida)', () => {
  // Test 1: Verificar que el título se renderiza correctamente
  test('renderiza el título "Vite + React"', () => {
    render(<App />)
    const titleElement = screen.getByText('Vite + React')
    expect(titleElement).toBeDefined()
    expect(titleElement.tagName).toBe('H1')
  })

  // Test 2: Verificar que el contador se inicializa en 0
  test('inicializa el contador en 0', () => {
    render(<App />)
    const countButton = screen.getByRole('button')
    expect(countButton).toBeDefined()
    expect(countButton.textContent).toContain('count is')
    expect(countButton.textContent).toContain('0')
    expect(countButton.tagName).toBe('BUTTON')
  })

  // Test 3: Verificar que el contador se incrementa al hacer clic
  test('incrementa el contador al hacer clic en el botón', () => {
    render(<App />)
    const countButton = screen.getByRole('button')
    
    // Verificar estado inicial
    expect(countButton.textContent).toContain('0')
    
    // Primer clic
    fireEvent.click(countButton)
    expect(countButton.textContent).toContain('1')
    
    // Segundo clic
    fireEvent.click(countButton)
    expect(countButton.textContent).toContain('2')
    
    // Tercer clic
    fireEvent.click(countButton)
    expect(countButton.textContent).toContain('3')
  })

  // Test 4: Verificar que los logos se renderizan correctamente
  test('renderiza los logos de Vite y React con atributos correctos', () => {
    render(<App />)
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo).toBeDefined()
    expect(reactLogo).toBeDefined()
    expect(viteLogo.tagName).toBe('IMG')
    expect(reactLogo.tagName).toBe('IMG')
  })

  // Test 5: Verificar que los enlaces tienen los atributos correctos
  test('los enlaces abren en nueva pestaña y tienen URLs correctas', () => {
    render(<App />)
    const links = screen.getAllByRole('link')
    const viteLink = links.find(link => link.href === 'https://vite.dev/')
    const reactLink = links.find(link => link.href === 'https://react.dev/')
    
    expect(viteLink).toBeDefined()
    expect(reactLink).toBeDefined()
    expect(viteLink.target).toBe('_blank')
    expect(reactLink.target).toBe('_blank')
  })

  // Test 6: Verificar que el texto de instrucciones se renderiza
  test('renderiza el texto de instrucciones sobre HMR', () => {
    render(<App />)
    const editText = screen.getByText((content, element) => {
      return element?.textContent === 'Edit src/App.jsx and save to test HMR'
    })
    expect(editText).toBeDefined()
    expect(editText.tagName).toBe('P')
  })

  // Test 7: Verificar que el texto sobre los logos se renderiza
  test('renderiza el texto instructivo sobre los logos', () => {
    render(<App />)
    const clickText = screen.getByText('Click on the Vite and React logos to learn more')
    expect(clickText).toBeDefined()
    expect(clickText.tagName).toBe('P')
    expect(clickText.className).toBe('read-the-docs')
  })

  // Test 8: Verificar que el botón tiene funcionalidad
  test('el botón del contador es clickeable', () => {
    render(<App />)
    const countButton = screen.getByRole('button')
    expect(countButton).toBeDefined()
    
    // Verificar que el click cambia el contenido
    const initialText = countButton.textContent
    fireEvent.click(countButton)
    const newText = countButton.textContent
    expect(newText).not.toBe(initialText)
  })

  // Test 9: Verificar que el contenedor del botón tiene la clase card
  test('el contenedor del botón tiene la clase "card"', () => {
    render(<App />)
    const cardDiv = screen.getByRole('button').closest('.card')
    expect(cardDiv).toBeDefined()
    expect(cardDiv.className).toBe('card')
  })

  // Test 10: Verificar que los logos tienen las clases CSS correctas
  test('los logos tienen las clases CSS correctas', () => {
    render(<App />)
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo.className).toBe('logo')
    expect(reactLogo.className).toBe('logo react')
  })

  // Test 11: Verificar que el componente se re-renderiza correctamente
  test('el componente mantiene el estado correctamente entre interacciones', () => {
    render(<App />)
    const countButton = screen.getByRole('button')
    
    // Estado inicial
    expect(countButton.textContent).toContain('0')
    
    // Hacer varios clics
    fireEvent.click(countButton)
    fireEvent.click(countButton)
    
    // El estado debería haberse actualizado a 2
    expect(countButton.textContent).toContain('2')
  })

  // Test 12: Verificar que el código inline se renderiza correctamente
  test('renderiza el código inline en el texto de instrucciones', () => {
    render(<App />)
    const codeElement = screen.getByText('src/App.jsx')
    expect(codeElement).toBeDefined()
    expect(codeElement.tagName).toBe('CODE')
  })

  // Test 13: Verificar que el componente no tiene errores de consola
  test('no genera errores en la consola', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test 14: Verificar que el componente es accesible
  test('el componente cumple con estándares básicos de accesibilidad', () => {
    render(<App />)
    
    // Verificar que las imágenes tienen texto alternativo
    expect(screen.getByAltText('Vite logo')).toBeDefined()
    expect(screen.getByAltText('React logo')).toBeDefined()
    
    // Verificar que el botón es clickeable
    const button = screen.getByRole('button')
    expect(button).toBeDefined()
  })

  // Test 15: Verificar el comportamiento del estado con múltiples clics rápidos
  test('maneja múltiples clics rápidos correctamente', () => {
    render(<App />)
    const countButton = screen.getByRole('button')
    
    // Hacer 5 clics rápidos
    for (let i = 0; i < 5; i++) {
      fireEvent.click(countButton)
    }
    
    // Verificar que el contador llegó a 5
    expect(countButton.textContent).toContain('5')
  })
})
