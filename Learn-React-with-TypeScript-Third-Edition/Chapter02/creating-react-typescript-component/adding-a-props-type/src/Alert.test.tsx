import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Alert } from './Alert'

describe('Alert Component - TypeScript', () => {
  // Test 1: Renderizado básico con props requeridas
  test('renderiza correctamente con props mínimas', () => {
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

  // Test 3: Funcionalidad de cerrar cuando closable es true
  test('muestra botón de cerrar cuando closable es true', () => {
    render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    expect(closeButton).toBeInTheDocument()
    expect(screen.getByText('❌')).toBeInTheDocument()
  })

  // Test 4: No muestra botón de cerrar cuando closable es false
  test('no muestra botón de cerrar cuando closable es false', () => {
    render(
      <Alert heading="Test" closable={false}>
        Content
      </Alert>
    )
    
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
    expect(screen.queryByText('❌')).not.toBeInTheDocument()
  })

  // Test 5: No muestra botón de cerrar cuando closable no se especifica
  test('no muestra botón de cerrar cuando closable no se especifica', () => {
    render(<Alert heading="Test">Content</Alert>)
    
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
  })

  // Test 6: Funcionalidad de cerrar alert
  test('oculta el alert al hacer clic en cerrar', () => {
    render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  // Test 7: Ejecuta onClose callback al cerrar
  test('ejecuta onClose callback al cerrar', () => {
    const mockOnClose = jest.fn()
    
    render(
      <Alert heading="Test" closable={true} onClose={mockOnClose}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  // Test 8: No ejecuta onClose si no se proporciona
  test('no ejecuta onClose si no se proporciona', () => {
    render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    
    // No debería lanzar error
    expect(() => fireEvent.click(closeButton)).not.toThrow()
  })

  // Test 9: Verificar tipos de props con TypeScript
  test('acepta diferentes tipos de children', () => {
    render(
      <Alert heading="Test">
        <div>Div content</div>
        <p>Paragraph content</p>
        <button>Button content</button>
      </Alert>
    )
    
    expect(screen.getByText('Div content')).toBeInTheDocument()
    expect(screen.getByText('Paragraph content')).toBeInTheDocument()
    expect(screen.getByText('Button content')).toBeInTheDocument()
  })

  // Test 10: Verificar que el componente es estable
  test('mantiene estabilidad entre re-renderizados', () => {
    const { rerender } = render(
      <Alert heading="Test">Content</Alert>
    )
    
    expect(screen.getByText('Test')).toBeInTheDocument()
    
    rerender(<Alert heading="Test">Content</Alert>)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  // Test 11: Verificar accesibilidad
  test('cumple con estándares de accesibilidad', () => {
    render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    // Verificar que el ícono tiene role y aria-label
    const icon = screen.getByRole('img')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('aria-label')
    
    // Verificar que el botón de cerrar tiene aria-label
    const closeButton = screen.getByLabelText('Close')
    expect(closeButton).toBeInTheDocument()
  })

  // Test 12: Verificar que no hay errores de consola
  test('no genera errores en la consola', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Alert heading="Test">Content</Alert>)
    
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test 13: Verificar comportamiento con props opcionales
  test('maneja correctamente props opcionales', () => {
    render(<Alert heading="Test">Content</Alert>)
    
    // Debería usar valores por defecto
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
    expect(screen.getByLabelText('Information')).toBeInTheDocument()
  })

  // Test 14: Verificar que el estado se resetea correctamente
  test('el estado se resetea correctamente al re-renderizar', () => {
    const { rerender } = render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    // Cerrar el alert
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
    
    // Re-renderizar - debería estar visible de nuevo
    rerender(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  // Test 15: Verificar que el componente es reutilizable
  test('es reutilizable con diferentes configuraciones', () => {
    const { rerender } = render(
      <Alert heading="First" type="information">
        First content
      </Alert>
    )
    
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
    
    rerender(
      <Alert heading="Second" type="warning" closable={true}>
        Second content
      </Alert>
    )
    
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('⚠')).toBeInTheDocument()
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  // Test 16: Verificar que el botón de cerrar es clickeable
  test('el botón de cerrar es clickeable', () => {
    render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    expect(closeButton).toBeEnabled()
  })

  // Test 17: Verificar que el componente maneja múltiples cierres
  test('maneja múltiples cierres correctamente', () => {
    const mockOnClose = jest.fn()
    
    const { rerender } = render(
      <Alert heading="Test" closable={true} onClose={mockOnClose}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    
    // Primer cierre
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
    
    // Re-renderizar y cerrar de nuevo
    rerender(
      <Alert heading="Test" closable={true} onClose={mockOnClose}>
        Content
      </Alert>
    )
    
    const newCloseButton = screen.getByLabelText('Close')
    fireEvent.click(newCloseButton)
    expect(mockOnClose).toHaveBeenCalledTimes(2)
  })

  // Test 18: Verificar que el componente retorna null cuando está cerrado
  test('retorna null cuando visible es false', () => {
    const { container } = render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    
    // El contenedor debería estar vacío
    expect(container.firstChild).toBeNull()
  })

  // Test 19: Verificar que el componente maneja strings largos
  test('maneja strings largos correctamente', () => {
    const longHeading = 'Este es un título muy largo que debería manejarse correctamente en el componente Alert'
    const longContent = 'Este es un contenido muy largo que también debería manejarse correctamente en el componente Alert sin causar problemas de renderizado o layout'
    
    render(
      <Alert heading={longHeading}>
        {longContent}
      </Alert>
    )
    
    expect(screen.getByText(longHeading)).toBeInTheDocument()
    expect(screen.getByText(longContent)).toBeInTheDocument()
  })

  // Test 20: Verificar que el componente es accesible con lectores de pantalla
  test('es accesible con lectores de pantalla', () => {
    render(
      <Alert heading="Test" closable={true}>
        Content
      </Alert>
    )
    
    // Verificar que todos los elementos tienen roles y aria-labels apropiados
    const icon = screen.getByRole('img')
    const closeButton = screen.getByRole('button')
    
    expect(icon).toHaveAttribute('aria-label')
    expect(closeButton).toHaveAttribute('aria-label', 'Close')
  })
}) 