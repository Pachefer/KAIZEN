/**
 * CONFIGURACIÓN GLOBAL DE VITEST PARA TODOS LOS CAPÍTULOS
 * Este archivo contiene la configuración estándar de testing que se puede aplicar
 * a todos los capítulos del libro Learn React with TypeScript
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export const createVitestConfig = (customConfig: any = {}) => {
  return defineConfig({
    plugins: [react()],
    test: {
      // Configuración global para todos los capítulos
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      
      // Configuración de cobertura por defecto
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
          'eslint.config.*',
          '**/*.test.*',
          '**/*.spec.*'
        ],
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
          }
        }
      },
      
      // Configuración para archivos de test
      include: [
        '**/*.{test,spec}.{js,jsx,ts,tsx}'
      ],
      
      // Timeout para pruebas
      testTimeout: 10000,
      
      // Configuración para React Testing Library
      environmentOptions: {
        jsdom: {
          resources: 'usable'
        }
      },
      
      // Merge con configuración personalizada
      ...customConfig
    }
  })
}

export default createVitestConfig()
