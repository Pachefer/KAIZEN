# 💎 Recursos Premium - React con TypeScript

## 🎯 Recursos Exclusivos para el Aprendizaje

---

## 📚 Biblioteca de Componentes Premium

### 🎨 **Design System Completo**

#### **1. Sistema de Iconos**
```tsx
// components/icons/IconSystem.tsx
import React from 'react'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'

interface IconProps {
  name: string
  size?: IconSize
  color?: IconColor
  className?: string
}

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

const iconColors = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-400'
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const iconMap = {
    'check': (
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    'close': (
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    'warning': (
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    'info': (
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  }

  const IconComponent = iconMap[name as keyof typeof iconMap]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <span className={`${iconSizes[size]} ${iconColors[color]} ${className}`}>
      {IconComponent}
    </span>
  )
}
```

#### **2. Sistema de Tipografía**
```tsx
// components/typography/Typography.tsx
import React from 'react'

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline'
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
type TextColor = 'primary' | 'secondary' | 'muted' | 'error' | 'success'

interface TypographyProps {
  variant?: TextVariant
  weight?: TextWeight
  color?: TextColor
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const variantStyles = {
  h1: 'text-4xl leading-tight',
  h2: 'text-3xl leading-tight',
  h3: 'text-2xl leading-snug',
  h4: 'text-xl leading-snug',
  h5: 'text-lg leading-snug',
  h6: 'text-base leading-snug',
  body: 'text-base leading-relaxed',
  caption: 'text-sm leading-relaxed',
  overline: 'text-xs leading-relaxed uppercase tracking-wider'
}

const weightStyles = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

const colorStyles = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  muted: 'text-gray-500',
  error: 'text-red-600',
  success: 'text-green-600'
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  children,
  className = '',
  as
}) => {
  const Component = as || (variant.startsWith('h') ? variant : 'p')
  
  const classes = [
    variantStyles[variant],
    weightStyles[weight],
    colorStyles[color],
    className
  ].filter(Boolean).join(' ')

  return (
    <Component className={classes}>
      {children}
    </Component>
  )
}
```

---

## 🧪 Hooks Personalizados Premium

### 🔧 **Hooks de Utilidad Avanzados**

#### **1. useLocalStorage Hook**
```tsx
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Función para establecer el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
```

#### **2. useDebounce Hook**
```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

#### **3. useIntersectionObserver Hook**
```tsx
// hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: options.threshold || 0,
        root: options.root || null,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options.threshold, options.root, options.rootMargin, hasIntersected])

  return { elementRef, isIntersecting, hasIntersected }
}
```

---

## 🎯 Utilidades y Helpers Premium

### 🛠️ **Funciones de Utilidad Avanzadas**

#### **1. Validadores de Formularios**
```tsx
// utils/validators.ts
export const validators = {
  required: (value: string) => {
    if (!value || value.trim().length === 0) {
      return 'Este campo es requerido'
    }
    return null
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Ingresa un email válido'
    }
    return null
  },

  minLength: (min: number) => (value: string) => {
    if (value.length < min) {
      return `Mínimo ${min} caracteres`
    }
    return null
  },

  maxLength: (max: number) => (value: string) => {
    if (value.length > max) {
      return `Máximo ${max} caracteres`
    }
    return null
  },

  password: (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

    if (!hasUpperCase) return 'Debe contener al menos una mayúscula'
    if (!hasLowerCase) return 'Debe contener al menos una minúscula'
    if (!hasNumbers) return 'Debe contener al menos un número'
    if (!hasSpecialChar) return 'Debe contener al menos un carácter especial'
    if (value.length < 8) return 'Debe tener al menos 8 caracteres'

    return null
  },

  phone: (value: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(value)) {
      return 'Ingresa un número de teléfono válido'
    }
    return null
  },

  url: (value: string) => {
    try {
      new URL(value)
      return null
    } catch {
      return 'Ingresa una URL válida'
    }
  }
}

export function validateField(value: string, rules: Array<(value: string) => string | null>) {
  for (const rule of rules) {
    const error = rule(value)
    if (error) return error
  }
  return null
}
```

#### **2. Formateadores de Datos**
```tsx
// utils/formatters.ts
export const formatters = {
  currency: (amount: number, currency = 'USD', locale = 'es-ES') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount)
  },

  date: (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    return new Intl.DateTimeFormat('es-ES', {
      ...defaultOptions,
      ...options
    }).format(dateObj)
  },

  relativeTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return 'hace un momento'
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`
    if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`
    
    return `hace ${Math.floor(diffInSeconds / 31536000)} años`
  },

  fileSize: (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  },

  phoneNumber: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  },

  creditCard: (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/)
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`
    }
    return cardNumber
  }
}
```

---

## 🎨 Temas y Estilos Premium

### 🌙 **Sistema de Temas Avanzado**

#### **1. Contexto de Tema**
```tsx
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'system'
  })

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(systemTheme)
      root.classList.toggle('dark', systemTheme)
    } else {
      const isDarkTheme = theme === 'dark'
      setIsDark(isDarkTheme)
      root.classList.toggle('dark', isDarkTheme)
    }
    
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

#### **2. Variables CSS Dinámicas**
```css
/* styles/theme.css */
:root {
  /* Colores base */
  --color-primary-50: #e3f2fd;
  --color-primary-100: #bbdefb;
  --color-primary-500: #2196f3;
  --color-primary-600: #1e88e5;
  --color-primary-700: #1976d2;
  --color-primary-900: #0d47a1;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Tipografía */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Bordes */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;

  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.dark {
  /* Colores para modo oscuro */
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-border: #404040;
}

.light {
  /* Colores para modo claro */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;
}
```

---

## 🚀 Configuraciones Avanzadas

### ⚙️ **Configuración de Build Optimizada**

#### **1. Vite Config Avanzado**
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },

  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  server: {
    port: 3000,
    open: true,
    cors: true
  },

  preview: {
    port: 4173,
    open: true
  }
})
```

#### **2. TypeScript Config Avanzado**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@styles/*": ["src/styles/*"]
    },
    "types": ["vite/client", "jest", "@testing-library/jest-dom"]
  },
  "include": [
    "src",
    "vite.config.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

---

## 📊 Métricas y Analytics

### 📈 **Sistema de Tracking de Rendimiento**

#### **1. Performance Monitor**
```tsx
// utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(name: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, [])
      }
      
      this.metrics.get(name)!.push(duration)
      
      // Log si es muy lento
      if (duration > 100) {
        console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`)
      }
    }
  }

  getMetrics(name: string) {
    const values = this.metrics.get(name) || []
    if (values.length === 0) return null

    const sorted = values.sort((a, b) => a - b)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const median = sorted[Math.floor(sorted.length / 2)]

    return {
      count: values.length,
      average: avg,
      min,
      max,
      median
    }
  }

  generateReport(): string {
    const report = ['Performance Report:', '']
    
    for (const [name, values] of this.metrics) {
      const metrics = this.getMetrics(name)
      if (metrics) {
        report.push(`${name}:`)
        report.push(`  Count: ${metrics.count}`)
        report.push(`  Average: ${metrics.average.toFixed(2)}ms`)
        report.push(`  Min: ${metrics.min.toFixed(2)}ms`)
        report.push(`  Max: ${metrics.max.toFixed(2)}ms`)
        report.push(`  Median: ${metrics.median.toFixed(2)}ms`)
        report.push('')
      }
    }
    
    return report.join('\n')
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
```

---

## 🎯 Scripts de Automatización

### 🤖 **Scripts de Desarrollo**

#### **1. Generador de Proyectos**
```bash
#!/bin/bash
# create-react-ts-project.sh

PROJECT_NAME=$1
TEMPLATE=${2:-basic}

if [ -z "$PROJECT_NAME" ]; then
    echo "Uso: ./create-react-ts-project.sh <NombreProyecto> [template]"
    echo "Templates disponibles: basic, advanced, full-stack"
    exit 1
fi

echo "🚀 Creando proyecto React con TypeScript: $PROJECT_NAME"

# Crear directorio del proyecto
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# Inicializar con Vite
npm create vite@latest . -- --template react-ts --yes

# Instalar dependencias base
npm install

# Instalar dependencias adicionales según template
case $TEMPLATE in
  "advanced")
    npm install @headlessui/react @heroicons/react
    npm install -D @types/node
    ;;
  "full-stack")
    npm install @headlessui/react @heroicons/react
    npm install express cors helmet morgan
    npm install -D @types/node @types/express @types/cors
    ;;
esac

# Crear estructura de directorios
mkdir -p src/{components,hooks,utils,types,styles,contexts}
mkdir -p src/components/{ui,layout,forms}
mkdir -p public/{images,icons}

# Crear archivos base
cat > src/types/index.ts << EOF
// Tipos globales del proyecto
export interface User {
  id: string
  name: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
EOF

cat > src/utils/index.ts << EOF
// Utilidades globales
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES')
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
EOF

echo "✅ Proyecto $PROJECT_NAME creado exitosamente!"
echo "📁 Estructura:"
tree -I 'node_modules|.git' -a

echo ""
echo "🎯 Próximos pasos:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
```

---

*Estos recursos premium complementan la guía excepcional, proporcionando herramientas y componentes de nivel profesional para el desarrollo con React y TypeScript.* 