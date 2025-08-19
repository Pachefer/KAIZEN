# PARTE I: FUNDAMENTOS Y CONFIGURACIÓN

## 🚀 **CAPÍTULO 1: INTRODUCCIÓN Y CONFIGURACIÓN DEL ENTORNO**

### 🟢 **NIVEL BÁSICO: ¿Qué es Next.js 15 y React.js 19?**

Next.js 15 es el framework más moderno para React que permite crear aplicaciones web full-stack con renderizado del lado del servidor (SSR), generación estática (SSG) y renderizado incremental estático (ISR). React.js 19 introduce nuevas características como React Compiler, mejoras en el modelo de concurrencia y optimizaciones de rendimiento.

#### **Características Principales de Next.js 15:**
- **App Router**: Nuevo sistema de enrutamiento basado en archivos
- **Server Components**: Componentes que se ejecutan en el servidor
- **Streaming**: Renderizado progresivo de páginas
- **Turbopack**: Bundler ultra-rápido (reemplaza Webpack)
- **TypeScript nativo**: Soporte completo sin configuración adicional

#### **Características Principales de React.js 19:**
- **React Compiler**: Compilación automática de optimizaciones
- **Concurrencia mejorada**: Mejor manejo de actualizaciones asíncronas
- **Hooks optimizados**: Mejoras en useMemo, useCallback y otros hooks
- **Suspense mejorado**: Mejor manejo de estados de carga

---

### 🟡 **NIVEL INTERMEDIO: Arquitectura y Beneficios**

#### **Arquitectura Híbrida:**
Next.js 15 combina lo mejor de ambos mundos:
- **Server-Side Rendering (SSR)**: Para contenido dinámico
- **Static Site Generation (SSG)**: Para contenido estático
- **Incremental Static Regeneration (ISR)**: Para contenido que se actualiza periódicamente
- **Client-Side Rendering (CSR)**: Para interactividad del usuario

#### **Beneficios de Rendimiento:**
- **First Contentful Paint (FCP)**: Más rápido con SSR
- **Largest Contentful Paint (LCP)**: Optimizado con streaming
- **Cumulative Layout Shift (CLS)**: Reducido con layouts estáticos
- **Time to Interactive (TTI)**: Mejorado con hidratación progresiva

---

### 🔴 **NIVEL AVANZADO: Patrones de Arquitectura Empresarial**

#### **Micro-Frontends:**
```typescript
// Ejemplo de arquitectura de micro-frontends
interface MicroFrontendConfig {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  props?: Record<string, any>;
}

class MicroFrontendManager {
  private apps: Map<string, MicroFrontendConfig> = new Map();
  
  registerApp(config: MicroFrontendConfig): void {
    this.apps.set(config.name, config);
  }
  
  async loadApp(name: string): Promise<void> {
    const app = this.apps.get(name);
    if (!app) throw new Error(`App ${name} not found`);
    
    // Lógica de carga dinámica
    const module = await import(app.entry);
    module.mount(app.container, app.props);
  }
}
```

---

## 🛠️ **CAPÍTULO 2: CONFIGURACIÓN DEL ENTORNO DE DESARROLLO**

### 🟢 **NIVEL BÁSICO: Instalación Paso a Paso**

#### **1. Instalar Node.js y npm:**
```bash
# Verificar versión de Node.js (requiere 18.17 o superior)
node --version

# Verificar versión de npm
npm --version

# Si no tienes Node.js, descárgalo de: https://nodejs.org/
```

#### **2. Instalar Visual Studio Code:**
```bash
# En macOS con Homebrew
brew install --cask visual-studio-code

# En Windows: Descargar desde https://code.visualstudio.com/
# En Linux: Usar el gestor de paquetes de tu distribución
```

#### **3. Extensiones Recomendadas para VS Code:**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

### 🟡 **NIVEL INTERMEDIO: Configuración Avanzada del Entorno**

#### **Configuración de ESLint:**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
};
```

#### **Configuración de Prettier:**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

#### **Configuración de TypeScript:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 🔴 **NIVEL AVANZADO: Automatización y DevOps Local**

#### **Scripts de Automatización:**
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky install"
  }
}
```

#### **Configuración de Husky (Git Hooks):**
```bash
# Instalar Husky
npm install --save-dev husky lint-staged

# Configurar Husky
npx husky install

# Agregar hook de pre-commit
npx husky add .husky/pre-commit "npx lint-staged"
```

#### **Configuración de lint-staged:**
```json
// .lintstagedrc.json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

---

## 📚 **CAPÍTULO 3: REACT PRIMER - CONCEPTOS BÁSICOS**

### 🟢 **NIVEL BÁSICO: Fundamentos de React**

#### **¿Qué es React?**
React es una biblioteca de JavaScript para construir interfaces de usuario. Permite crear componentes reutilizables que mantienen su estado y se actualizan automáticamente cuando cambian los datos.

#### **Componente Básico:**
```tsx
// Componente funcional simple
function Saludo() {
  return <h1>¡Hola Mundo!</h1>;
}

// Componente con props
function SaludoPersonalizado({ nombre }: { nombre: string }) {
  return <h1>¡Hola {nombre}!</h1>;
}

// Uso del componente
<SaludoPersonalizado nombre="Juan" />
```

#### **JSX Básico:**
```tsx
// JSX permite escribir HTML en JavaScript
const elemento = (
  <div className="contenedor">
    <h1>Título</h1>
    <p>Párrafo con <strong>texto en negrita</strong></p>
    <ul>
      <li>Elemento 1</li>
      <li>Elemento 2</li>
    </ul>
  </div>
);
```

---

### 🟡 **NIVEL INTERMEDIO: Hooks y Estado**

#### **useState Hook:**
```tsx
import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(0);
  
  const incrementar = () => setContador(prev => prev + 1);
  const decrementar = () => setContador(prev => prev - 1);
  const resetear = () => setContador(0);
  
  return (
    <div className="contador">
      <h2>Contador: {contador}</h2>
      <div className="botones">
        <button onClick={decrementar}>-</button>
        <button onClick={resetear}>Reset</button>
        <button onClick={incrementar}>+</button>
      </div>
    </div>
  );
}
```

#### **useEffect Hook:**
```tsx
import { useState, useEffect } from 'react';

function UsuarioPerfil({ userId }: { userId: string }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch(`/api/usuarios/${userId}`);
        const datos = await respuesta.json();
        setUsuario(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    
    cargarUsuario();
  }, [userId]); // Se ejecuta cuando cambia userId
  
  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!usuario) return <div>Usuario no encontrado</div>;
  
  return (
    <div className="perfil-usuario">
      <h2>{usuario.nombre}</h2>
      <p>{usuario.email}</p>
    </div>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Patrones Avanzados y Optimización**

#### **Custom Hooks:**
```tsx
// Hook personalizado para manejo de formularios
function useFormulario<T extends Record<string, any>>(valoresIniciales: T) {
  const [valores, setValores] = useState<T>(valoresIniciales);
  const [errores, setErrores] = useState<Partial<Record<keyof T, string>>>({});
  const [tocado, setTocado] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const cambiarValor = (campo: keyof T, valor: any) => {
    setValores(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: undefined }));
    }
  };
  
  const marcarTocado = (campo: keyof T) => {
    setTocado(prev => ({ ...prev, [campo]: true }));
  };
  
  const validar = (validaciones: Record<keyof T, (valor: any) => string | undefined>) => {
    const nuevosErrores: Partial<Record<keyof T, string>> = {};
    
    Object.keys(validaciones).forEach((campo) => {
      const error = validaciones[campo as keyof T](valores[campo as keyof T]);
      if (error) {
        nuevosErrores[campo as keyof T] = error;
      }
    });
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  const resetear = () => {
    setValores(valoresIniciales);
    setErrores({});
    setTocado({});
  };
  
  return {
    valores,
    errores,
    tocado,
    cambiarValor,
    marcarTocado,
    validar,
    resetear
  };
}

// Uso del hook personalizado
function FormularioUsuario() {
  const { valores, errores, tocado, cambiarValor, marcarTocado, validar, resetear } = 
    useFormulario({
      nombre: '',
      email: '',
      edad: ''
    });
  
  const validaciones = {
    nombre: (valor: string) => !valor ? 'El nombre es requerido' : undefined,
    email: (valor: string) => !valor ? 'El email es requerido' : !valor.includes('@') ? 'Email inválido' : undefined,
    edad: (valor: string) => !valor ? 'La edad es requerida' : isNaN(Number(valor)) ? 'Edad debe ser un número' : undefined
  };
  
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar(validaciones)) {
      console.log('Formulario válido:', valores);
      // Enviar datos
    }
  };
  
  return (
    <form onSubmit={manejarEnvio}>
      <div>
        <input
          type="text"
          value={valores.nombre}
          onChange={(e) => cambiarValor('nombre', e.target.value)}
          onBlur={() => marcarTocado('nombre')}
          placeholder="Nombre"
        />
        {tocado.nombre && errores.nombre && <span className="error">{errores.nombre}</span>}
      </div>
      
      <div>
        <input
          type="email"
          value={valores.email}
          onChange={(e) => cambiarValor('email', e.target.value)}
          onBlur={() => marcarTocado('email')}
          placeholder="Email"
        />
        {tocado.email && errores.email && <span className="error">{errores.email}</span>}
      </div>
      
      <div>
        <input
          type="number"
          value={valores.edad}
          onChange={(e) => cambiarValor('edad', e.target.value)}
          onBlur={() => marcarTocado('edad')}
          placeholder="Edad"
        />
        {tocado.edad && errores.edad && <span className="error">{errores.edad}</span>}
      </div>
      
      <button type="submit">Enviar</button>
      <button type="button" onClick={resetear}>Resetear</button>
    </form>
  );
}
```

#### **React.memo y useMemo para Optimización:**
```tsx
import { memo, useMemo, useCallback } from 'react';

// Componente optimizado con React.memo
const ListaUsuarios = memo(({ usuarios, onUsuarioClick }: {
  usuarios: Usuario[];
  onUsuarioClick: (usuario: Usuario) => void;
}) => {
  // Memoizar la lista filtrada
  const usuariosActivos = useMemo(() => 
    usuarios.filter(usuario => usuario.activo), 
    [usuarios]
  );
  
  // Memoizar la función de callback
  const handleClick = useCallback((usuario: Usuario) => {
    onUsuarioClick(usuario);
  }, [onUsuarioClick]);
  
  return (
    <ul>
      {usuariosActivos.map(usuario => (
        <li key={usuario.id} onClick={() => handleClick(usuario)}>
          {usuario.nombre}
        </li>
      ))}
    </ul>
  );
});

// Componente padre
function PanelUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  const manejarClickUsuario = useCallback((usuario: Usuario) => {
    console.log('Usuario seleccionado:', usuario);
  }, []);
  
  return (
    <div>
      <ListaUsuarios 
        usuarios={usuarios} 
        onUsuarioClick={manejarClickUsuario} 
      />
    </div>
  );
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Crea un componente `Contador` que permita incrementar, decrementar y resetear un valor.

### **Ejercicio Intermedio:**
Implementa un hook personalizado `useLocalStorage` que sincronice el estado con localStorage.

### **Ejercicio Avanzado:**
Crea un sistema de gestión de estado global usando Context API y useReducer para una aplicación de tareas.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta primera parte hemos cubierto:
- ✅ Configuración completa del entorno de desarrollo
- ✅ Fundamentos de React y JSX
- ✅ Hooks básicos (useState, useEffect)
- ✅ Hooks personalizados y patrones avanzados
- ✅ Optimización de componentes con React.memo y useMemo
- ✅ Configuración de herramientas de desarrollo (ESLint, Prettier, TypeScript)

En el siguiente capítulo aprenderemos sobre Next.js 15 y su configuración inicial.
