#!/usr/bin/env node

/**
 * SCRIPT PARA CONFIGURAR TESTING EN TODOS LOS CAPÍTULOS
 * Este script aplica la configuración de testing a todos los proyectos de los capítulos 1-12
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración base para cada tipo de proyecto
const configs = {
  // Para proyectos con JavaScript (Capítulo 1)
  javascript: {
    vitestConfig: `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'vite.config.*',
        'vitest.config.*',
        'eslint.config.*'
      ]
    }
  }
})`,
    
    setupFile: `// Configuración de testing para React Testing Library
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

// Mocks necesarios
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

global.fetch = vi.fn()`,

    packageJsonScripts: {
      "test": "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage",
      "test:ui": "vitest --ui"
    },

    devDependencies: {
      "@testing-library/jest-dom": "^6.6.4",
      "@testing-library/react": "^16.3.0",
      "@testing-library/user-event": "^14.6.1",
      "@vitest/ui": "^3.2.4",
      "jsdom": "^26.1.0",
      "vitest": "^3.2.4"
    }
  },

  // Para proyectos con TypeScript (Capítulos 2+)
  typescript: {
    vitestConfig: `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/index.ts',
        '**/types.ts',
        'vite.config.*',
        'vitest.config.*',
        'eslint.config.*'
      ]
    }
  }
})`,

    setupFile: `// Configuración de testing para React Testing Library
import '@testing-library/jest-dom/vitest'
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extender expect con matchers de jest-dom
expect.extend(matchers)

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

global.window = dom.window as unknown as Window & typeof globalThis
global.document = dom.window.document
global.navigator = dom.window.navigator

// Mocks necesarios
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

global.fetch = vi.fn()`,

    packageJsonScripts: {
      "test": "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage",
      "test:ui": "vitest --ui"
    },

    devDependencies: {
      "@testing-library/jest-dom": "^6.6.4",
      "@testing-library/react": "^16.3.0",
      "@testing-library/user-event": "^14.6.1",
      "@vitest/ui": "^3.2.4",
      "jsdom": "^26.1.0",
      "vitest": "^3.2.4"
    }
  }
}

// Función para detectar si un directorio tiene un proyecto
function hasProject(dir) {
  const packageJsonPath = path.join(dir, 'package.json')
  return fs.existsSync(packageJsonPath)
}

// Función para detectar si usa TypeScript
function usesTypeScript(dir) {
  const tsconfigPath = path.join(dir, 'tsconfig.json')
  const viteTsConfig = path.join(dir, 'vite.config.ts')
  return fs.existsSync(tsconfigPath) || fs.existsSync(viteTsConfig)
}

// Función para actualizar package.json
function updatePackageJson(projectDir, config) {
  const packageJsonPath = path.join(projectDir, 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    return
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    
    // Agregar scripts de testing
    packageJson.scripts = {
      ...packageJson.scripts,
      ...config.packageJsonScripts
    }
    
    // Agregar dependencias de testing
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...config.devDependencies
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(\`✅ Actualizado package.json en \${projectDir}\`)
  } catch (error) {
    console.error(\`❌ Error actualizando package.json en \${projectDir}:\`, error.message)
  }
}

// Función para crear archivos de configuración
function setupProjectTesting(projectDir) {
  const isTypeScript = usesTypeScript(projectDir)
  const config = isTypeScript ? configs.typescript : configs.javascript
  
  // Actualizar vite.config
  const viteConfigFile = isTypeScript ? 'vite.config.ts' : 'vite.config.js'
  const viteConfigPath = path.join(projectDir, viteConfigFile)
  
  if (fs.existsSync(viteConfigPath)) {
    fs.writeFileSync(viteConfigPath, config.vitestConfig)
    console.log(\`✅ Configurado \${viteConfigFile} en \${projectDir}\`)
  }
  
  // Crear archivo de setup
  const setupFile = isTypeScript ? 'vitest.setup.ts' : 'vitest.setup.js'
  const setupPath = path.join(projectDir, setupFile)
  
  fs.writeFileSync(setupPath, config.setupFile)
  console.log(\`✅ Creado \${setupFile} en \${projectDir}\`)
  
  // Actualizar package.json
  updatePackageJson(projectDir, config)
}

// Función principal
function setupAllChapters() {
  console.log('🚀 Configurando testing para todos los capítulos...')
  
  const chapters = Array.from({ length: 12 }, (_, i) => \`Chapter\${String(i + 1).padStart(2, '0')}\`)
  
  for (const chapter of chapters) {
    const chapterDir = path.join(__dirname, chapter)
    
    if (!fs.existsSync(chapterDir)) {
      console.log(\`⚠️  Capítulo \${chapter} no encontrado\`)
      continue
    }
    
    console.log(\`\n📁 Procesando \${chapter}...\`)
    
    // Buscar subdirectorios con proyectos
    const subDirs = fs.readdirSync(chapterDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const subDir of subDirs) {
      const projectDir = path.join(chapterDir, subDir)
      
      if (hasProject(projectDir)) {
        console.log(\`  📦 Configurando proyecto en \${subDir}\`)
        setupProjectTesting(projectDir)
      }
    }
  }
  
  console.log('\\n🎉 ¡Configuración de testing completada para todos los capítulos!')
  console.log('\\n📝 Para instalar las dependencias en cada proyecto, ejecuta:')
  chapters.forEach(chapter => {
    console.log(\`   cd \${chapter}/<proyecto> && npm install\`)
  })
}

// Ejecutar el script
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  setupAllChapters()
}
