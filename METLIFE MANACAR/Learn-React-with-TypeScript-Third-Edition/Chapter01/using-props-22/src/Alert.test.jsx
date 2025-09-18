import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Alert } from './Alert'

describe('Alert Component - Props', () => {
  // Test 1: Renderizado básico con props por defecto
  test('renderiza correctamente con props por defecto', () => {
    render(<Alert heading="Test Heading">Test content</Alert>)
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
    expect(screen.getByLabelText('Information')).toBeInTheDocument()
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
  })

  // Test 2: Renderizado con tipo warning
  test('renderiza correctamente con tipo warning', () => {
    render(
      <Alert type="warning" heading="Warning Heading">
        Warning content
      </Alert>
    )
    
    expect(screen.getByText('Warning Heading')).toBeInTheDocument()
    expect(screen.getByText('Warning content')).toBeInTheDocument()
    expect(screen.getByLabelText('Warning')).toBeInTheDocument()
    expect(screen.getByText('⚠')).toBeInTheDocument()
  })

  // Test 3: Renderizado con tipo information explícito
  test('renderiza correctamente con tipo information explícito', () => {
    render(
      <Alert type="information" heading="Info Heading">
        Info content
      </Alert>
    )
    
    expect(screen.getByText('Info Heading')).toBeInTheDocument()
    expect(screen.getByText('Info content')).toBeInTheDocument()
    expect(screen.getByLabelText('Information')).toBeInTheDocument()
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
  })

  // Test 4: Verificar estructura del DOM
  test('tiene la estructura DOM correcta', () => {
    render(<Alert heading="Test">Content</Alert>)
    
    const alertContainer = screen.getByText('Test').closest('div')
    expect(alertContainer).toBeInTheDocument()
    
    const childrenContainer = screen.getByText('Content').closest('div')
    expect(childrenContainer).toBeInTheDocument()
  })

  // Test 5: Verificar accesibilidad
  test('cumple con estándares de accesibilidad', () => {
    render(<Alert heading="Test">Content</Alert>)
    
    const icon = screen.getByRole('img')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('aria-label')
  })

  // Test 6: Verificar que children se renderiza correctamente
  test('renderiza children correctamente', () => {
    const testContent = 'Este es un mensaje de prueba'
    render(<Alert heading="Test">{testContent}</Alert>)
    
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  // Test 7: Verificar que heading se renderiza correctamente
  test('renderiza heading correctamente', () => {
    const testHeading = 'Título de Prueba'
    render(<Alert heading={testHeading}>Content</Alert>)
    
    expect(screen.getByText(testHeading)).toBeInTheDocument()
  })

  // Test 8: Verificar íconos según el tipo
  test('muestra el ícono correcto según el tipo', () => {
    const { rerender } = render(
      <Alert type="information" heading="Test">Content</Alert>
    )
    
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
    expect(screen.queryByText('⚠')).not.toBeInTheDocument()
    
    rerender(
      <Alert type="warning" heading="Test">Content</Alert>
    )
    
    expect(screen.getByText('⚠')).toBeInTheDocument()
    expect(screen.queryByText('ℹ️')).not.toBeInTheDocument()
  })

  // Test 9: Verificar aria-label según el tipo
  test('tiene el aria-label correcto según el tipo', () => {
    const { rerender } = render(
      <Alert type="information" heading="Test">Content</Alert>
    )
    
    expect(screen.getByLabelText('Information')).toBeInTheDocument()
    
    rerender(
      <Alert type="warning" heading="Test">Content</Alert>
    )
    
    expect(screen.getByLabelText('Warning')).toBeInTheDocument()
  })

  // Test 10: Verificar que el componente es reutilizable
  test('es reutilizable con diferentes props', () => {
    const { rerender } = render(
      <Alert heading="First">First content</Alert>
    )
    
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('First content')).toBeInTheDocument()
    
    rerender(
      <Alert type="warning" heading="Second">Second content</Alert>
    )
    
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Second content')).toBeInTheDocument()
    expect(screen.getByText('⚠')).toBeInTheDocument()
  })

  // Test 11: Verificar que el valor por defecto funciona correctamente
  test('usa el valor por defecto cuando no se especifica type', () => {
    render(<Alert heading="Test">Content</Alert>)
    
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
    expect(screen.getByLabelText('Information')).toBeInTheDocument()
  })

  // Test 12: Verificar que el componente maneja contenido complejo
  test('maneja contenido JSX complejo como children', () => {
    render(
      <Alert heading="Test">
        <p>Párrafo de prueba</p>
        <button>Botón de prueba</button>
      </Alert>
    )
    
    expect(screen.getByText('Párrafo de prueba')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  // Test 13: Verificar que no hay errores de consola
  test('no genera errores en la consola', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<Alert heading="Test">Content</Alert>)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test 14: Verificar que el componente es accesible con diferentes tipos
  test('mantiene accesibilidad con diferentes tipos', () => {
    const { rerender } = render(
      <Alert type="information" heading="Info">Content</Alert>
    )
    
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Information')
    
    rerender(
      <Alert type="warning" heading="Warning">Content</Alert>
    )
    
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Warning')
  })

  // Test 15: Verificar que el componente es estable
  test('mantiene estabilidad entre re-renderizados', () => {
    const { rerender } = render(
      <Alert heading="Test">Content</Alert>
    )
    
    const initialIcon = screen.getByText('ℹ️')
    const initialHeading = screen.getByText('Test')
    
    rerender(<Alert heading="Test">Content</Alert>)
    
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
}) 