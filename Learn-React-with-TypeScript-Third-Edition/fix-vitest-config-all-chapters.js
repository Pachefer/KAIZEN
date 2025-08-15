#!/usr/bin/env node

/**
 * SCRIPT PARA CORREGIR CONFIGURACIÓN VITEST EN TODOS LOS CAPÍTULOS
 * Este script aplica la configuración Vitest correcta a todos los proyectos
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

// Función para actualizar vite.config.js o vite.config.ts
function updateViteConfig(projectDir, isTypeScript = false) {
  const extension = isTypeScript ? 'ts' : 'js'
  const configPath = path.join(projectDir, `vite.config.${extension}`)
  
  if (!fs.existsSync(configPath)) {
    console.log(`    ⚠️  No se encontró vite.config.${extension} en ${projectDir}`)
    return
  }

  const setupFileName = isTypeScript ? 'vitest.setup.ts' : 'vitest.setup.js'
  
  const vitestConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./${setupFileName}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        ${isTypeScript ? `'**/*.d.ts',
        '**/index.ts',
        '**/types.ts',` : ''}
        'vite.config.*',
        'vitest.config.*',
        'eslint.config.*'
      ]
    }
  }
})`

  fs.writeFileSync(configPath, vitestConfig)
  console.log(`    ✅ Actualizado vite.config.${extension}`)
}

// Función para crear vitest.setup
function createVitestSetup(projectDir, isTypeScript = false) {
  const extension = isTypeScript ? 'ts' : 'js'
  const setupPath = path.join(projectDir, `vitest.setup.${extension}`)
  
  const setupContent = `import '@testing-library/jest-dom/vitest';`
  
  fs.writeFileSync(setupPath, setupContent)
  console.log(`    ✅ Creado vitest.setup.${extension}`)
}

// Función para corregir las pruebas problemáticas
function fixTestFiles(projectDir, isTypeScript = false) {
  const extension = isTypeScript ? 'tsx' : 'jsx'
  const testFiles = [
    path.join(projectDir, 'src', `App.test.${extension}`)
  ]
  
  for (const testFile of testFiles) {
    if (fs.existsSync(testFile)) {
      let content = fs.readFileSync(testFile, 'utf-8')
      
      // Corregir la prueba problemática de múltiples renderizados
      const oldTestPattern = /test\('puede renderizarse múltiples veces sin errores', \(\) => \{[\s\S]*?\}\)/
      const newTest = `test('puede renderizarse múltiples veces sin errores', () => {
    // Primer renderizado
    const { unmount: unmount1 } = render(<App />)
    unmount1()
    
    // Segundo renderizado
    const { container } = render(<App />)
    
    // Verificar que el segundo renderizado produce elementos DOM
    expect(container.children.length).toBeGreaterThan(0)
  })`
      
      if (oldTestPattern.test(content)) {
        content = content.replace(oldTestPattern, newTest)
        fs.writeFileSync(testFile, content)
        console.log(`    ✅ Corregido ${testFile}`)
      }
    }
  }
}

// Función principal
function fixVitestConfigForAllChapters() {
  console.log('🔧 Corrigiendo configuración Vitest en todos los capítulos...')
  
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
      
      if (hasProject(projectDir)) {
        console.log(`  📦 Corrigiendo ${subDir}`)
        
        const isTypeScript = usesTypeScript(projectDir)
        
        // Actualizar vite.config
        updateViteConfig(projectDir, isTypeScript)
        
        // Crear vitest.setup
        createVitestSetup(projectDir, isTypeScript)
        
        // Corregir archivos de test
        fixTestFiles(projectDir, isTypeScript)
      }
    }
  }
  
  console.log('\n🎉 ¡Configuración Vitest corregida en todos los capítulos!')
  console.log('\n📝 Ahora todas las pruebas deberían funcionar correctamente.')
  console.log('   Para verificar, navega a cualquier proyecto y ejecuta:')
  console.log('   npm test')
}

// Ejecutar el script
if (import.meta.url === `file://${process.argv[1]}`) {
  fixVitestConfigForAllChapters()
}

export { fixVitestConfigForAllChapters }
