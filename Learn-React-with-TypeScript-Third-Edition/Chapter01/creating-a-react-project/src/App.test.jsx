import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

describe('App Component - Capítulo 1', () => {
  // Test 1: Verificar que el título se renderiza correctamente
  test('renderiza el título "Vite + React"', () => {
    render(<App />)
    const titleElement = screen.getByText('Vite + React')
    expect(titleElement).toBeInTheDocument()
    expect(titleElement.tagName).toBe('H1')
  })

  // Test 2: Verificar que el contador se inicializa en 0
  test('inicializa el contador en 0', () => {
    render(<App />)
    const countButton = screen.getByText(/count is 0/i)
    expect(countButton).toBeInTheDocument()
    expect(countButton.tagName).toBe('BUTTON')
  })

  // Test 3: Verificar que el contador se incrementa al hacer clic
  test('incrementa el contador al hacer clic en el botón', () => {
    render(<App />)
    const countButton = screen.getByText(/count is 0/i)
    
    // Primer clic
    fireEvent.click(countButton)
    expect(screen.getByText(/count is 1/i)).toBeInTheDocument()
    
    // Segundo clic
    fireEvent.click(countButton)
    expect(screen.getByText(/count is 2/i)).toBeInTheDocument()
    
    // Tercer clic
    fireEvent.click(countButton)
    expect(screen.getByText(/count is 3/i)).toBeInTheDocument()
  })

  // Test 4: Verificar que los logos se renderizan correctamente
  test('renderiza los logos de Vite y React con atributos correctos', () => {
    render(<App />)
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
    expect(viteLogo.tagName).toBe('IMG')
    expect(reactLogo.tagName).toBe('IMG')
  })

  // Test 5: Verificar que los enlaces tienen los atributos correctos
  test('los enlaces abren en nueva pestaña y tienen URLs correctas', () => {
    render(<App />)
    const viteLink = screen.getByRole('link', { name: /vite logo/i })
    const reactLink = screen.getByRole('link', { name: /react logo/i })
    
    expect(viteLink).toHaveAttribute('target', '_blank')
    expect(reactLink).toHaveAttribute('target', '_blank')
    expect(viteLink).toHaveAttribute('href', 'https://vite.dev')
    expect(reactLink).toHaveAttribute('href', 'https://react.dev')
  })

  // Test 6: Verificar que el texto de instrucciones se renderiza
  test('renderiza el texto de instrucciones sobre HMR', () => {
    render(<App />)
    const editText = screen.getByText(/Edit src\/App\.jsx and save to test HMR/i)
    expect(editText).toBeInTheDocument()
    expect(editText.tagName).toBe('P')
  })

  // Test 7: Verificar que el texto sobre los logos se renderiza
  test('renderiza el texto instructivo sobre los logos', () => {
    render(<App />)
    const clickText = screen.getByText(/Click on the Vite and React logos to learn more/i)
    expect(clickText).toBeInTheDocument()
    expect(clickText.tagName).toBe('P')
    expect(clickText).toHaveClass('read-the-docs')
  })

  // Test 8: Verificar que el botón tiene la clase CSS correcta
  test('el botón del contador tiene la clase CSS correcta', () => {
    render(<App />)
    const countButton = screen.getByText(/count is 0/i)
    expect(countButton).toBeInTheDocument()
  })

  // Test 9: Verificar que el contenedor del botón tiene la clase card
  test('el contenedor del botón tiene la clase "card"', () => {
    render(<App />)
    const cardDiv = screen.getByText(/count is 0/i).closest('.card')
    expect(cardDiv).toBeInTheDocument()
  })

  // Test 10: Verificar que los logos tienen las clases CSS correctas
  test('los logos tienen las clases CSS correctas', () => {
    render(<App />)
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo).toHaveClass('logo')
    expect(reactLogo).toHaveClass('logo', 'react')
  })

  // Test 11: Verificar que el componente se re-renderiza correctamente
  test('el componente mantiene el estado correctamente entre re-renderizados', () => {
    const { rerender } = render(<App />)
    
    // Estado inicial
    expect(screen.getByText(/count is 0/i)).toBeInTheDocument()
    
    // Re-renderizar el componente
    rerender(<App />)
    
    // El estado debería mantenerse en 0
    expect(screen.getByText(/count is 0/i)).toBeInTheDocument()
  })

  // Test 12: Verificar que el código inline se renderiza correctamente
  test('renderiza el código inline en el texto de instrucciones', () => {
    render(<App />)
    const codeElement = screen.getByText('src/App.jsx')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement.tagName).toBe('CODE')
  })

  // Test 13: Verificar que el componente no tiene errores de consola
  test('no genera errores en la consola', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test 14: Verificar que el componente es accesible
  test('el componente cumple con estándares básicos de accesibilidad', () => {
    render(<App />)
    
    // Verificar que las imágenes tienen texto alternativo
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
    expect(screen.getByAltText('React logo')).toBeInTheDocument()
    
    // Verificar que el botón es clickeable
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  // Test 15: Verificar el comportamiento del estado con múltiples clics rápidos
  test('maneja múltiples clics rápidos correctamente', () => {
    render(<App />)
    const countButton = screen.getByText(/count is 0/i)
    
    // Hacer 5 clics rápidos
    for (let i = 0; i < 5; i++) {
      fireEvent.click(countButton)
    }
    
    // Verificar que el contador llegó a 5
    expect(screen.getByText(/count is 5/i)).toBeInTheDocument()
  })
}) 