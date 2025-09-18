import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

describe('App Component - Capítulo 1', () => {
  beforeEach(() => {
    cleanup()
  })

  test('renderiza el componente App correctamente', () => {
    const { container } = render(<App />)
    expect(container.firstChild).toBeTruthy()
    expect(container.innerHTML).toContain('Vite + React')
  })

  test('renderiza el título "Vite + React"', () => {
    const { container } = render(<App />)
    const titleElement = container.querySelector('h1')
    expect(titleElement).toBeTruthy()
    expect(titleElement.textContent).toBe('Vite + React')
  })

  test('inicializa el contador en 0', () => {
    const { container } = render(<App />)
    const countButton = container.querySelector('button')
    expect(countButton).toBeTruthy()
    expect(countButton.textContent).toContain('count is')
    expect(countButton.textContent).toContain('0')
  })

  test('incrementa el contador al hacer clic en el botón', () => {
    const { container } = render(<App />)
    const countButton = container.querySelector('button')
    
    expect(countButton.textContent).toContain('0')
    fireEvent.click(countButton)
    expect(countButton.textContent).toContain('1')
    fireEvent.click(countButton)
    expect(countButton.textContent).toContain('2')
  })

  test('renderiza los logos de Vite y React', () => {
    const { container } = render(<App />)
    const viteLogo = container.querySelector('img[alt="Vite logo"]')
    const reactLogo = container.querySelector('img[alt="React logo"]')
    
    expect(viteLogo).toBeTruthy()
    expect(reactLogo).toBeTruthy()
  })

  test('los enlaces tienen atributos correctos', () => {
    const { container } = render(<App />)
    const links = container.querySelectorAll('a')
    expect(links.length).toBe(2)
    
    const viteLink = Array.from(links).find(link => link.href.includes('vite.dev'))
    const reactLink = Array.from(links).find(link => link.href.includes('react.dev'))
    
    expect(viteLink).toBeTruthy()
    expect(reactLink).toBeTruthy()
    expect(viteLink.target).toBe('_blank')
    expect(reactLink.target).toBe('_blank')
  })

  test('no genera errores en la consola', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  test('tiene la estructura DOM esperada', () => {
    const { container } = render(<App />)
    expect(container.querySelector('h1')).toBeTruthy()
    expect(container.querySelector('button')).toBeTruthy()
    expect(container.querySelector('.card')).toBeTruthy()
    expect(container.querySelectorAll('img').length).toBe(2)
    expect(container.querySelectorAll('a').length).toBe(2)
  })
})