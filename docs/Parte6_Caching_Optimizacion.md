# PARTE VI: CACHING, OPTIMIZACIÓN Y FORMULARIOS AVANZADOS

## ⚡ **CAPÍTULO 11: CACHING Y OPTIMIZACIÓN**

### 🟢 **NIVEL BÁSICO: Fundamentos de Caching en Next.js 15**

#### **¿Qué es el Caching?**
El caching es una técnica que almacena datos o resultados de operaciones costosas para reutilizarlos posteriormente, mejorando significativamente el rendimiento de la aplicación.

#### **Tipos de Caching en Next.js 15:**
- **Router Cache**: Cache del lado del cliente para navegación
- **Full Route Cache**: Cache del lado del servidor para rutas completas
- **Request Memoization**: Cache de funciones individuales
- **ISR (Incremental Static Regeneration)**: Regeneración incremental de páginas estáticas

---

### 🟡 **NIVEL INTERMEDIO: Estrategias de Caching**

#### **Router Cache:**
```tsx
// src/app/layout.tsx
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Suspense fallback={<div>Cargando...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
```

#### **Full Route Cache:**
```tsx
// src/app/blog/[slug]/page.tsx
import { unstable_cache } from 'next/cache';

// Función cacheada para obtener posts del blog
const getCachedPost = unstable_cache(
  async (slug: string) => {
    // Simular llamada a API o base de datos
    const response = await fetch(`https://api.example.com/posts/${slug}`);
    return response.json();
  },
  ['blog-post'], // Clave del cache
  {
    revalidate: 3600, // Revalidar cada hora
    tags: ['blog-posts'], // Tags para invalidación selectiva
  }
);

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getCachedPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

#### **Request Memoization:**
```tsx
// src/lib/cache.ts
import { unstable_cache } from 'next/cache';

// Cache para consultas de base de datos
export const getCachedUsers = unstable_cache(
  async () => {
    // Simular consulta a base de datos
    const users = await fetch('https://api.example.com/users').then(res => res.json());
    return users;
  },
  ['users'],
  {
    revalidate: 300, // 5 minutos
    tags: ['users'],
  }
);

export const getCachedUserById = unstable_cache(
  async (id: string) => {
    const user = await fetch(`https://api.example.com/users/${id}`).then(res => res.json());
    return user;
  },
  ['user'],
  {
    revalidate: 600, // 10 minutos
    tags: ['users', 'user'],
  }
);

// Cache para estadísticas
export const getCachedStats = unstable_cache(
  async () => {
    const stats = await fetch('https://api.example.com/stats').then(res => res.json());
    return stats;
  },
  ['stats'],
  {
    revalidate: 1800, // 30 minutos
    tags: ['stats'],
  }
);
```

---

### 🔴 **NIVEL AVANZADO: Caching Inteligente y Optimizaciones**

#### **Sistema de Cache Avanzado:**
```tsx
// src/lib/advanced-cache.ts
import { unstable_cache } from 'next/cache';
import { revalidateTag, revalidatePath } from 'next/cache';

// Configuración de cache por tipo de contenido
const CACHE_CONFIGS = {
  user: { revalidate: 300, tags: ['users'] },
  post: { revalidate: 1800, tags: ['posts'] },
  comment: { revalidate: 600, tags: ['comments'] },
  stats: { revalidate: 3600, tags: ['stats'] },
  settings: { revalidate: 7200, tags: ['settings'] },
} as const;

// Factory para crear funciones cacheadas
function createCachedFunction<T extends keyof typeof CACHE_CONFIGS>(
  type: T,
  fetcher: () => Promise<any>
) {
  const config = CACHE_CONFIGS[type];
  
  return unstable_cache(
    fetcher,
    [type],
    config
  );
}

// Funciones cacheadas específicas
export const getCachedUsers = createCachedFunction('user', async () => {
  const users = await fetch('https://api.example.com/users').then(res => res.json());
  return users;
});

export const getCachedPosts = createCachedFunction('post', async () => {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  return posts;
});

// Sistema de invalidación inteligente
export class CacheManager {
  static async invalidateUser(userId: string) {
    // Invalidar cache específico del usuario
    await revalidateTag(`user-${userId}`);
    // Invalidar cache general de usuarios
    await revalidateTag('users');
  }

  static async invalidatePost(postId: string) {
    await revalidateTag(`post-${postId}`);
    await revalidateTag('posts');
    // También invalidar cache de usuarios si el post es de un usuario
    await revalidateTag('users');
  }

  static async invalidateAll() {
    // Invalidar todo el cache
    await revalidatePath('/');
  }

  static async invalidateByPattern(pattern: string) {
    // Invalidar cache por patrón
    const tags = Object.keys(CACHE_CONFIGS).filter(key => key.includes(pattern));
    for (const tag of tags) {
      await revalidateTag(tag);
    }
  }
}

// Hook personalizado para cache
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { revalidate?: number; tags?: string[] } = {}
) {
  const cacheKey = `cache-${key}`;
  
  // En un caso real, esto se implementaría con un estado global
  // como Zustand o Redux para manejar el cache del cliente
  return {
    get: async () => {
      // Verificar cache local primero
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp < (options.revalidate || 300000)) {
          return data;
        }
      }
      
      // Si no hay cache o expiró, hacer fetch
      const data = await fetcher();
      
      // Guardar en cache local
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
      
      return data;
    },
    
    invalidate: () => {
      localStorage.removeItem(cacheKey);
    },
  };
}
```

---

## 📝 **CAPÍTULO 12: FORMULARIOS AVANZADOS CON SERVER ACTIONS**

### 🟢 **NIVEL BÁSICO: Hooks de Formularios Avanzados**

#### **useTransition Hook:**
```tsx
// src/hooks/useFormTransition.ts
'use client';

import { useTransition, useFormStatus } from 'react';
import { useState } from 'react';

export function useFormTransition() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitForm = async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    
    startTransition(async () => {
      try {
        await action();
      } finally {
        setIsSubmitting(false);
      }
    });
  };
  
  return {
    isPending,
    isSubmitting,
    submitForm,
  };
}

// Componente de botón con estado de envío
export function SubmitButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  
  return (
    <button
      {...props}
      disabled={pending}
      className={`${props.className || ''} ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? 'Enviando...' : children}
    </button>
  );
}
```

#### **useFormStatus Hook:**
```tsx
// src/components/forms/FormStatus.tsx
'use client';

import { useFormStatus } from 'react-dom';

export function FormStatus() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <div className="form-status">
      {pending && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Procesando formulario...</span>
        </div>
      )}
      
      {data && (
        <div className="form-data">
          <h4>Datos del formulario:</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      <div className="form-info">
        <p>Método: {method}</p>
        <p>Acción: {action}</p>
      </div>
    </div>
  );
}
```

---

### 🟡 **NIVEL INTERMEDIO: Formularios con Validación Avanzada**

#### **Sistema de Validación Completo:**
```tsx
// src/lib/validation.ts
import { z } from 'zod';

// Esquemas de validación
export const userSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z.string()
    .email('Email inválido')
    .min(5, 'El email debe tener al menos 5 caracteres'),
  age: z.number()
    .min(18, 'Debes ser mayor de 18 años')
    .max(120, 'Edad inválida'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const ticketSchema = z.object({
  title: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  category: z.string().min(1, 'Debes seleccionar una categoría'),
  dueDate: z.date().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    size: z.number().max(10 * 1024 * 1024, 'El archivo no puede exceder 10MB'),
    type: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, 'Solo se permiten imágenes'),
  })).optional(),
});

// Tipos inferidos de los esquemas
export type UserFormData = z.infer<typeof userSchema>;
export type TicketFormData = z.infer<typeof ticketSchema>;

// Función de validación con manejo de errores
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  errors: Record<string, string[]>;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(err.message);
      });
      
      return { success: false, errors };
    }
    
    return {
      success: false,
      errors: { general: ['Error de validación desconocido'] },
    };
  }
}
```

#### **Formulario con Validación en Tiempo Real:**
```tsx
// src/components/forms/ValidatedForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { validateForm, userSchema, type UserFormData } from '@/lib/validation';

interface FormState {
  errors: Record<string, string[]>;
  message: string;
}

const initialState: FormState = {
  errors: {},
  message: '',
};

// Server Action para crear usuario
async function createUser(prevState: FormState, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: Number(formData.get('age')),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const validation = validateForm(userSchema, rawData);
  
  if (!validation.success) {
    return {
      errors: validation.errors,
      message: 'Por favor, corrige los errores del formulario',
    };
  }

  try {
    // Aquí iría la lógica para crear el usuario
    console.log('Usuario válido:', validation.data);
    
    return {
      errors: {},
      message: 'Usuario creado exitosamente',
    };
  } catch (error) {
    return {
      errors: { general: ['Error al crear el usuario'] },
      message: 'Error interno del servidor',
    };
  }
}

export function ValidatedForm() {
  const [state, formAction] = useFormState(createUser, initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [realTimeErrors, setRealTimeErrors] = useState<Record<string, string[]>>({});

  // Validación en tiempo real
  const handleFieldChange = (field: string, value: string) => {
    if (!touched[field]) return;

    const fieldData = { [field]: value };
    const validation = validateForm(userSchema.pick({ [field]: true }), fieldData);
    
    if (!validation.success) {
      setRealTimeErrors(prev => ({
        ...prev,
        [field]: validation.errors[field] || [],
      }));
    } else {
      setRealTimeErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldErrors = (field: string): string[] => {
    return realTimeErrors[field] || state.errors[field] || [];
  };

  const hasFieldErrors = (field: string): boolean => {
    return getFieldErrors(field).length > 0;
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <div className={`p-4 rounded-md ${
          state.message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => handleFieldChange('name', e.target.value)}
          onBlur={() => handleFieldBlur('name')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasFieldErrors('name') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa tu nombre"
        />
        {hasFieldErrors('name') && (
          <div className="mt-1">
            {getFieldErrors('name').map((error, index) => (
              <p key={index} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e) => handleFieldChange('email', e.target.value)}
          onBlur={() => handleFieldBlur('email')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasFieldErrors('email') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa tu email"
        />
        {hasFieldErrors('email') && (
          <div className="mt-1">
            {getFieldErrors('email').map((error, index) => (
              <p key={index} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Edad
        </label>
        <input
          type="number"
          id="age"
          name="age"
          min="18"
          max="120"
          onChange={(e) => handleFieldChange('age', e.target.value)}
          onBlur={() => handleFieldBlur('age')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasFieldErrors('age') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa tu edad"
        />
        {hasFieldErrors('age') && (
          <div className="mt-1">
            {getFieldErrors('age').map((error, index) => (
              <p key={index} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => handleFieldChange('password', e.target.value)}
          onBlur={() => handleFieldBlur('password')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasFieldErrors('password') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa tu contraseña"
        />
        {hasFieldErrors('password') && (
          <div className="mt-1">
            {getFieldErrors('password').map((error, index) => (
              <p key={index} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
          onBlur={() => handleFieldBlur('confirmPassword')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasFieldErrors('confirmPassword') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Confirma tu contraseña"
        />
        {hasFieldErrors('confirmPassword') && (
          <div className="mt-1">
            {getFieldErrors('confirmPassword').map((error, index) => (
              <p key={index} className="text-red-500 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>

      <SubmitButton className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        Crear Usuario
      </SubmitButton>
    </form>
  );
}

function SubmitButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  
  return (
    <button
      {...props}
      disabled={pending}
      className={`${props.className || ''} ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? 'Creando...' : children}
    </button>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Formularios con Estado Complejo y Optimizaciones**

#### **Formulario Multi-Step con Estado Persistente:**
```tsx
// src/components/forms/MultiStepForm.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ticketSchema, type TicketFormData } from '@/lib/validation';

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

const FORM_STEPS: FormStep[] = [
  {
    id: 'basic',
    title: 'Información Básica',
    description: 'Título y descripción del ticket',
    fields: ['title', 'description'],
  },
  {
    id: 'details',
    title: 'Detalles del Ticket',
    description: 'Prioridad y categoría',
    fields: ['priority', 'category'],
  },
  {
    id: 'attachments',
    title: 'Archivos Adjuntos',
    description: 'Documentos y capturas de pantalla',
    fields: ['attachments'],
  },
  {
    id: 'review',
    title: 'Revisar y Enviar',
    description: 'Verificar información antes de enviar',
    fields: [],
  },
];

interface MultiStepFormState {
  currentStep: number;
  formData: Partial<TicketFormData>;
  errors: Record<string, string[]>;
  message: string;
}

const initialState: MultiStepFormState = {
  currentStep: 0,
  formData: {},
  errors: {},
  message: '',
};

// Server Action para crear ticket
async function createTicket(prevState: MultiStepFormState, formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    category: formData.get('category'),
    attachments: [], // Los archivos se manejan por separado
  };

  const validation = validateForm(ticketSchema, rawData);
  
  if (!validation.success) {
    return {
      ...prevState,
      errors: validation.errors,
      message: 'Por favor, corrige los errores del formulario',
    };
  }

  try {
    // Aquí iría la lógica para crear el ticket
    console.log('Ticket válido:', validation.data);
    
    return {
      ...prevState,
      errors: {},
      message: 'Ticket creado exitosamente',
    };
  } catch (error) {
    return {
      ...prevState,
      errors: { general: ['Error al crear el ticket'] },
      message: 'Error interno del servidor',
    };
  }
}

export function MultiStepForm() {
  const [state, formAction] = useFormState(createTicket, initialState);
  const [localFormData, setLocalFormData] = useLocalStorage('ticket-form-data', {});
  const [localStep, setLocalStep] = useLocalStorage('ticket-form-step', 0);

  // Sincronizar estado local con estado del formulario
  useEffect(() => {
    if (Object.keys(localFormData).length > 0) {
      setLocalFormData(localFormData);
    }
  }, []);

  useEffect(() => {
    setLocalStep(state.currentStep);
  }, [state.currentStep]);

  const updateFormData = useCallback((field: string, value: any) => {
    const newData = { ...localFormData, [field]: value };
    setLocalFormData(newData);
  }, [localFormData, setLocalFormData]);

  const nextStep = useCallback(() => {
    if (state.currentStep < FORM_STEPS.length - 1) {
      setLocalStep(state.currentStep + 1);
    }
  }, [state.currentStep, setLocalStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 0) {
      setLocalStep(state.currentStep - 1);
    }
  }, [state.currentStep, setLocalStep]);

  const canProceedToNext = useCallback((stepIndex: number) => {
    const step = FORM_STEPS[stepIndex];
    if (!step) return false;

    // Verificar que todos los campos requeridos del paso estén completos
    return step.fields.every(field => {
      const value = localFormData[field];
      return value !== undefined && value !== null && value !== '';
    });
  }, [localFormData]);

  const renderStepContent = () => {
    const currentStepData = FORM_STEPS[state.currentStep];
    
    switch (currentStepData.id) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título del Ticket
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={localFormData.title || ''}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe brevemente el problema"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción Detallada
              </label>
              <textarea
                id="description"
                name="description"
                value={localFormData.description || ''}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Proporciona todos los detalles necesarios"
              />
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                id="priority"
                name="priority"
                value={localFormData.priority || ''}
                onChange={(e) => updateFormData('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar prioridad</option>
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                value={localFormData.category || ''}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar categoría</option>
                <option value="bug">Bug</option>
                <option value="feature">Nueva Funcionalidad</option>
                <option value="improvement">Mejora</option>
                <option value="support">Soporte</option>
              </select>
            </div>
          </div>
        );

      case 'attachments':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivos Adjuntos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    updateFormData('attachments', files);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1">Haz clic para seleccionar archivos</p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC hasta 10MB</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Revisar Información</h3>
            
            <div className="bg-gray-50 rounded-md p-4 space-y-3">
              <div>
                <span className="font-medium text-gray-700">Título:</span>
                <p className="text-gray-900">{localFormData.title}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Descripción:</span>
                <p className="text-gray-900">{localFormData.description}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Prioridad:</span>
                <p className="text-gray-900">{localFormData.priority}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Categoría:</span>
                <p className="text-gray-900">{localFormData.category}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Archivos:</span>
                <p className="text-gray-900">
                  {localFormData.attachments ? `${localFormData.attachments.length} archivo(s)` : 'Ninguno'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Ticket</h2>
        <p className="text-gray-600">Completa la información paso a paso</p>
      </div>

      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {FORM_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= state.currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {index < state.currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  index <= state.currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
              
              {index < FORM_STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < state.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navegación */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={state.currentStep === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {state.currentStep < FORM_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceedToNext(state.currentStep)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        ) : (
          <SubmitButton className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Crear Ticket
          </SubmitButton>
        )}
      </div>

      {state.message && (
        <div className={`mt-4 p-4 rounded-md ${
          state.message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {state.message}
        </div>
      )}
    </div>
  );
}

function SubmitButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  
  return (
    <button
      {...props}
      disabled={pending}
      className={`${props.className || ''} ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? 'Creando...' : children}
    </button>
  );
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Implementa un sistema de cache simple para una API de usuarios.

### **Ejercicio Intermedio:**
Crea un formulario de contacto con validación en tiempo real usando Zod.

### **Ejercicio Avanzado:**
Implementa un formulario multi-step con persistencia de estado y validación avanzada.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta sexta parte hemos cubierto:
- ✅ Caching y optimización en Next.js 15
- ✅ Router Cache y Full Route Cache
- ✅ Request Memoization y estrategias de cache
- ✅ Hooks avanzados de formularios (useTransition, useFormStatus)
- ✅ Validación con Zod y validación en tiempo real
- ✅ Formularios multi-step con estado persistente

En el siguiente capítulo aprenderemos sobre autenticación y autorización.
