# PARTE III: SERVER COMPONENTS VS CLIENT COMPONENTS

## 🚀 **CAPÍTULO 7: COMPONENTES DEL SERVIDOR VS CLIENTE**

### 🟢 **NIVEL BÁSICO: ¿Qué son Server Components y Client Components?**

#### **Server Components (Componentes del Servidor):**
Los Server Components son componentes de React que se ejecutan exclusivamente en el servidor. No se envían al navegador, lo que significa que no aumentan el tamaño del bundle de JavaScript del cliente.

#### **Client Components (Componentes del Cliente):**
Los Client Components son componentes tradicionales de React que se ejecutan en el navegador. Pueden usar hooks, estado local y interactividad del usuario.

#### **Diferencias Clave:**

| Característica | Server Components | Client Components |
|----------------|-------------------|-------------------|
| **Ejecución** | Solo en servidor | En el navegador |
| **Interactividad** | No | Sí |
| **Estado local** | No | Sí |
| **Eventos** | No | Sí |
| **Hooks** | No | Sí |
| **Bundle size** | No aumenta | Aumenta |
| **SEO** | Excelente | Bueno |
| **Rendimiento** | Muy rápido | Rápido |

---

### 🟡 **NIVEL INTERMEDIO: Cuándo Usar Cada Tipo**

#### **Usar Server Components cuando:**
- Necesitas acceder a recursos del servidor (base de datos, APIs)
- No requieres interactividad del usuario
- Quieres optimizar el SEO
- Necesitas renderizar contenido estático
- Quieres reducir el tamaño del bundle del cliente

#### **Usar Client Components cuando:**
- Necesitas interactividad del usuario (clicks, formularios)
- Usas hooks de React (useState, useEffect)
- Necesitas estado local
- Usas eventos del navegador
- Necesitas acceso a APIs del navegador

---

### 🔴 **NIVEL AVANZADO: Patrones de Arquitectura Híbrida**

#### **Patrón de Composición Cliente-Servidor:**
```tsx
// Server Component - Maneja datos y renderizado inicial
// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import LoadingSpinner from '@/components/LoadingSpinner';

export default async function DashboardPage() {
  // Verificar autenticación en el servidor
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Obtener datos del usuario en el servidor
  const userData = await fetchUserData(session.user.id);
  const recentActivity = await fetchRecentActivity(session.user.id);
  
  return (
    <div className="dashboard-container">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard de {userData.name}
      </h1>
      
      {/* Server Component para datos estáticos */}
      <UserProfile user={userData} />
      
      {/* Client Component para interactividad */}
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardClient 
          initialData={userData}
          recentActivity={recentActivity}
        />
      </Suspense>
    </div>
  );
}

// Server Component para perfil de usuario
async function UserProfile({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center space-x-4">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">
            Miembro desde {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Client Component para interactividad
// src/app/dashboard/DashboardClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  initialData: User;
  recentActivity: Activity[];
}

export default function DashboardClient({ 
  initialData, 
  recentActivity 
}: DashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [activities, setActivities] = useState(recentActivity);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleSaveProfile = async (updatedData: Partial<User>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setData(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };
  
  const handleRefreshActivities = async () => {
    try {
      const response = await fetch('/api/user/activities');
      const newActivities = await response.json();
      setActivities(newActivities);
    } catch (error) {
      console.error('Error al refrescar actividades:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Sección de perfil editable */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Perfil</h3>
          <button
            onClick={handleEditProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        
        {isEditing ? (
          <ProfileEditForm 
            user={data} 
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileDisplay user={data} />
        )}
      </div>
      
      {/* Sección de actividades recientes */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Actividades Recientes</h3>
          <button
            onClick={handleRefreshActivities}
            className="text-blue-600 hover:text-blue-800"
          >
            Refrescar
          </button>
        </div>
        
        <ActivityList activities={activities} />
      </div>
    </div>
  );
}
```

---

## 🎨 **CAPÍTULO 8: ESTILOS Y UI CON TAILWIND CSS**

### 🟢 **NIVEL BÁSICO: Fundamentos de Tailwind CSS**

#### **Configuración Básica:**
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos personalizados */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply text-gray-900 bg-gray-50;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}
```

#### **Componentes Básicos:**
```tsx
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md' 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
```

---

### 🟡 **NIVEL INTERMEDIO: Componentes Avanzados y Animaciones**

#### **Componente de Modal:**
```tsx
// src/components/ui/Modal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all duration-300 ease-out`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
  
  // Renderizar en portal para evitar problemas de z-index
  return createPortal(modalContent, document.body);
}
```

#### **Componente de Dropdown:**
```tsx
// src/components/ui/Dropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled = false,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    ${option.value === value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                  `}
                >
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <Check size={16} className="text-blue-600 ml-2" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Sistema de Diseño y Temas**

#### **Sistema de Diseño con CSS Variables:**
```css
/* src/app/globals.css */
:root {
  /* Colores primarios */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;
  
  /* Colores secundarios */
  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-900: #0f172a;
  
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
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Bordes */
  --border-radius-sm: 0.125rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-2xl: 1rem;
  
  /* Transiciones */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

/* Modo oscuro */
[data-theme="dark"] {
  --color-primary-50: #1e3a8a;
  --color-primary-100: #1d4ed8;
  --color-primary-500: #3b82f6;
  --color-primary-600: #60a5fa;
  --color-primary-700: #93c5fd;
  --color-primary-900: #dbeafe;
  
  --color-secondary-50: #0f172a;
  --color-secondary-100: #1e293b;
  --color-secondary-500: #64748b;
  --color-secondary-600: #94a3b8;
  --color-secondary-700: #cbd5e1;
  --color-secondary-900: #f8fafc;
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500;
  }
  
  .btn-secondary {
    @apply btn bg-secondary-200 hover:bg-secondary-300 text-secondary-900 focus:ring-secondary-500;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-secondary-300 rounded-md bg-white text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
  }
  
  .card {
    @apply bg-white dark:bg-secondary-800 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700;
  }
}
```

#### **Hook para Gestión de Tema:**
```tsx
// src/hooks/useTheme.ts
'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Obtener tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      root.setAttribute('data-theme', systemTheme);
    } else {
      setResolvedTheme(theme);
      root.setAttribute('data-theme', theme);
    }
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
        window.document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Crea un componente de tarjeta de usuario que muestre información estática usando Server Components.

### **Ejercicio Intermedio:**
Implementa un formulario de contacto usando Client Components con validación y manejo de estado.

### **Ejercicio Avanzado:**
Crea un sistema de temas completo con modo claro/oscuro y persistencia en localStorage.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta tercera parte hemos cubierto:
- ✅ Diferencias entre Server Components y Client Components
- ✅ Cuándo y cómo usar cada tipo de componente
- ✅ Patrones de composición cliente-servidor
- ✅ Sistema de estilos con Tailwind CSS
- ✅ Componentes UI reutilizables
- ✅ Sistema de temas y modo oscuro

En el siguiente capítulo aprenderemos sobre base de datos y ORM con Prisma.
