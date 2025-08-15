#!/usr/bin/env node

/**
 * SCRIPT PARA APLICAR PRUEBAS UNITARIAS CORREGIDAS A TODOS LOS CAPÍTULOS
 * Este script aplica las pruebas funcionales a todos los proyectos de los capítulos 1-12
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Función para detectar si un directorio tiene un proyecto
function hasProject(dir) {
  const packageJsonPath = path.join(dir, 'package.json')
  const srcPath = path.join(dir, 'src')
  return fs.existsSync(packageJsonPath) && fs.existsSync(srcPath)
}

// Función para detectar si usa TypeScript
function usesTypeScript(dir) {
  const tsconfigPath = path.join(dir, 'tsconfig.json')
  const viteTsConfig = path.join(dir, 'vite.config.ts')
  const srcTsFiles = fs.existsSync(path.join(dir, 'src')) && 
    fs.readdirSync(path.join(dir, 'src')).some(file => file.endsWith('.tsx') || file.endsWith('.ts'))
  return fs.existsSync(tsconfigPath) || fs.existsSync(viteTsConfig) || srcTsFiles
}

// Función para verificar si existe App component
function hasAppComponent(dir) {
  const srcDir = path.join(dir, 'src')
  if (!fs.existsSync(srcDir)) return false
  
  const files = fs.readdirSync(srcDir)
  return files.some(file => 
    file === 'App.jsx' || 
    file === 'App.tsx' || 
    file === 'App.js' || 
    file === 'App.ts'
  )
}

// Función para crear pruebas específicas para Capítulo 1
function createChapter1Tests(projectDir) {
  const testContent = `import { describe, test, expect, vi, beforeEach } from 'vitest'
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
})`

  const testPath = path.join(projectDir, 'src', 'App.test.jsx')
  fs.writeFileSync(testPath, testContent)
  console.log(`✅ Creadas pruebas específicas para Capítulo 1 en ${projectDir}`)
}

// Función para crear pruebas básicas para otros capítulos
function createBasicTests(projectDir, chapterName, isTypeScript = false) {
  const extension = isTypeScript ? 'tsx' : 'jsx'
  const importReact = isTypeScript ? "import React from 'react'" : ""
  
  const testContent = `${importReact ? importReact + '\n' : ''}import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import App from './App'

describe('App Component - ${chapterName}', () => {
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
    const { container: container1 } = render(<App />)
    cleanup()
    const { container: container2 } = render(<App />)
    
    expect(container1.innerHTML).toBeTruthy()
    expect(container2.innerHTML).toBeTruthy()
  })${isTypeScript ? `

  test('tiene tipos TypeScript correctos', () => {
    const AppComponent: React.FC = App
    expect(AppComponent).toBeDefined()
  })` : ''}
})`

  const testPath = path.join(projectDir, 'src', `App.test.${extension}`)
  fs.writeFileSync(testPath, testContent)
  console.log(`✅ Creadas pruebas básicas para ${chapterName} en ${projectDir}`)
}

// Función para actualizar package.json con dependencias de testing
function updatePackageJsonWithTestDeps(projectDir, isTypeScript = false) {
  const packageJsonPath = path.join(projectDir, 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    return
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    
    // Agregar scripts de testing si no existen
    if (!packageJson.scripts) packageJson.scripts = {}
    if (!packageJson.scripts.test) {
      packageJson.scripts.test = "vitest run"
      packageJson.scripts["test:watch"] = "vitest"
      packageJson.scripts["test:coverage"] = "vitest run --coverage"
    }
    
    // Agregar dependencias de testing si no existen
    if (!packageJson.devDependencies) packageJson.devDependencies = {}
    
    const testingDeps = {
      "@testing-library/jest-dom": "^6.6.4",
      "@testing-library/react": "^16.3.0",
      "@testing-library/user-event": "^14.6.1",
      "@vitest/ui": "^3.2.4",
      "jsdom": "^26.1.0",
      "vitest": "^3.2.4"
    }

    if (isTypeScript) {
      testingDeps["@types/testing-library__jest-dom"] = "^6.0.0"
    }

    Object.assign(packageJson.devDependencies, testingDeps)
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(`✅ Actualizado package.json en ${projectDir}`)
  } catch (error) {
    console.error(`❌ Error actualizando package.json en ${projectDir}:`, error.message)
  }
}

// Función principal
function setupTestsForAllChapters() {
  console.log('🚀 Aplicando pruebas unitarias corregidas a todos los capítulos...')
  
  const chapters = Array.from({ length: 12 }, (_, i) => `Chapter${String(i + 1).padStart(2, '0')}`)
  
  for (const chapter of chapters) {
    const chapterDir = path.join(__dirname, chapter)
    
    if (!fs.existsSync(chapterDir)) {
      console.log(`⚠️  ${chapter} no encontrado`)
      continue
    }
    
    console.log(`\n📁 Procesando ${chapter}...`)
    
    // Buscar subdirectorios con proyectos
    const subDirs = fs.readdirSync(chapterDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const subDir of subDirs) {
      const projectDir = path.join(chapterDir, subDir)
      
      if (hasProject(projectDir) && hasAppComponent(projectDir)) {
        console.log(`  📦 Configurando proyecto en ${subDir}`)
        
        const isTypeScript = usesTypeScript(projectDir)
        const chapterName = `${chapter} - ${subDir}`
        
        // Aplicar pruebas específicas según el capítulo
        if (chapter === 'Chapter01' && subDir === 'creating-a-react-project') {
          createChapter1Tests(projectDir)
        } else {
          createBasicTests(projectDir, chapterName, isTypeScript)
        }
        
        // Actualizar package.json
        updatePackageJsonWithTestDeps(projectDir, isTypeScript)
      }
    }
  }
  
  console.log('\n🎉 ¡Pruebas aplicadas exitosamente a todos los capítulos!')
  console.log('\n📝 Para instalar dependencias y ejecutar pruebas:')
  console.log('   cd [directorio-del-proyecto]')
  console.log('   npm install')
  console.log('   npm test')
}

// Ejecutar el script
if (import.meta.url === `file://${process.argv[1]}`) {
  setupTestsForAllChapters()
}

export { setupTestsForAllChapters }
