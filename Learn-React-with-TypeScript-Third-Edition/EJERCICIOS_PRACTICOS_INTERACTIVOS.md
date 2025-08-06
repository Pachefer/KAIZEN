# 🎯 Ejercicios Prácticos Interactivos - React con TypeScript

## 🎓 Sistema de Aprendizaje Práctico

---

## 📝 Ejercicio 1: Sistema de Notificaciones Avanzado

### 🎯 **Objetivo**
Crear un sistema completo de notificaciones con diferentes tipos, animaciones y posiciones configurables.

### 📋 **Requisitos**
- ✅ Soporte para success, error, warning, info
- ✅ Animaciones de entrada/salida con CSS
- ✅ Auto-dismiss después de 5 segundos
- ✅ Posición configurable (top-right, bottom-left, etc.)
- ✅ Gestión de múltiples notificaciones
- ✅ Tipado completo con TypeScript

### 🚀 **Solución Paso a Paso**

#### **Paso 1: Definir Tipos**
```tsx
// types/notifications.ts
export type NotificationType = 'success' | 'error' | 'warning' | 'info'
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  position: NotificationPosition
  autoDismiss?: boolean
  duration?: number
  persistent?: boolean
}

export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}
```

#### **Paso 2: Contexto de Notificaciones**
```tsx
// contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { Notification, NotificationContextType } from '../types/notifications'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-dismiss
    if (newNotification.autoDismiss && !newNotification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, newNotification.duration)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
```

#### **Paso 3: Componente de Notificación Individual**
```tsx
// components/NotificationItem.tsx
import React, { useEffect, useState } from 'react'
import { Notification } from '../types/notifications'
import { Icon } from './Icon'

interface NotificationItemProps {
  notification: Notification
  onClose: (id: string) => void
}

const typeConfig = {
  success: { icon: 'check', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  error: { icon: 'close', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  warning: { icon: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  info: { icon: 'info', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const config = typeConfig[notification.type]

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(notification.id), 300)
  }

  return (
    <div
      className={`
        notification-item
        max-w-sm w-full
        ${config.bgColor}
        border ${config.borderColor}
        rounded-lg shadow-lg
        p-4 mb-2
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${config.color}`}>
          <Icon name={config.icon} size="md" />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {notification.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {notification.message}
          </p>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### **Paso 4: Contenedor de Notificaciones**
```tsx
// components/NotificationContainer.tsx
import React from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { NotificationItem } from './NotificationItem'

const positionClasses = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2'
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  // Agrupar notificaciones por posición
  const notificationsByPosition = notifications.reduce((acc, notification) => {
    if (!acc[notification.position]) {
      acc[notification.position] = []
    }
    acc[notification.position].push(notification)
    return acc
  }, {} as Record<string, typeof notifications>)

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Object.entries(notificationsByPosition).map(([position, positionNotifications]) => (
        <div
          key={position}
          className={`absolute p-4 ${positionClasses[position as keyof typeof positionClasses]}`}
        >
          {positionNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
```

#### **Paso 5: Hook Personalizado para Notificaciones**
```tsx
// hooks/useNotificationActions.ts
import { useNotifications } from '../contexts/NotificationContext'
import { NotificationType, NotificationPosition } from '../types/notifications'

export function useNotificationActions() {
  const { addNotification } = useNotifications()

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    options: {
      position?: NotificationPosition
      autoDismiss?: boolean
      duration?: number
      persistent?: boolean
    } = {}
  ) => {
    addNotification({
      type,
      title,
      message,
      position: options.position || 'top-right',
      autoDismiss: options.autoDismiss ?? true,
      duration: options.duration,
      persistent: options.persistent
    })
  }

  return {
    success: (title: string, message: string, options?: any) => 
      showNotification('success', title, message, options),
    error: (title: string, message: string, options?: any) => 
      showNotification('error', title, message, options),
    warning: (title: string, message: string, options?: any) => 
      showNotification('warning', title, message, options),
    info: (title: string, message: string, options?: any) => 
      showNotification('info', title, message, options)
  }
}
```

#### **Paso 6: Uso del Sistema**
```tsx
// App.tsx
import React from 'react'
import { NotificationProvider } from './contexts/NotificationContext'
import { NotificationContainer } from './components/NotificationContainer'
import { NotificationDemo } from './components/NotificationDemo'

function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sistema de Notificaciones
        </h1>
        <NotificationDemo />
        <NotificationContainer />
      </div>
    </NotificationProvider>
  )
}

export default App
```

#### **Paso 7: Componente de Demostración**
```tsx
// components/NotificationDemo.tsx
import React from 'react'
import { useNotificationActions } from '../hooks/useNotificationActions'

export function NotificationDemo() {
  const { success, error, warning, info } = useNotificationActions()

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => success('Éxito', 'Operación completada correctamente')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Mostrar Éxito
        </button>
        
        <button
          onClick={() => error('Error', 'Algo salió mal')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Mostrar Error
        </button>
        
        <button
          onClick={() => warning('Advertencia', 'Ten cuidado con esto')}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Mostrar Advertencia
        </button>
        
        <button
          onClick={() => info('Información', 'Aquí tienes información útil')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Mostrar Info
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => success('Top Left', 'Notificación en la esquina superior izquierda', { position: 'top-left' })}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Top Left
        </button>
        
        <button
          onClick={() => error('Bottom Right', 'Notificación en la esquina inferior derecha', { position: 'bottom-right' })}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Bottom Right
        </button>
        
        <button
          onClick={() => info('Persistente', 'Esta notificación no se cierra automáticamente', { persistent: true })}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Persistente
        </button>
      </div>
    </div>
  )
}
```

### 🧪 **Pruebas Unitarias**
```tsx
// NotificationItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationItem } from './NotificationItem'

const mockNotification = {
  id: '1',
  type: 'success' as const,
  title: 'Test Title',
  message: 'Test Message',
  position: 'top-right' as const
}

describe('NotificationItem', () => {
  test('renderiza correctamente', () => {
    render(
      <NotificationItem
        notification={mockNotification}
        onClose={jest.fn()}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  test('llama onClose al hacer clic en cerrar', () => {
    const onClose = jest.fn()
    render(
      <NotificationItem
        notification={mockNotification}
        onClose={onClose}
      />
    )

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledWith('1')
  })
})
```

---

## 🎯 Ejercicio 2: Formulario con Validación Avanzada

### 🎯 **Objetivo**
Crear un formulario de registro con validación en tiempo real, indicadores de fortaleza de contraseña y TypeScript.

### 📋 **Requisitos**
- ✅ Validación de email, contraseña, confirmación
- ✅ Mensajes de error en tiempo real
- ✅ Indicadores de fortaleza de contraseña
- ✅ Submit solo si todo es válido
- ✅ Tipado completo con TypeScript

### 🚀 **Solución Paso a Paso**

#### **Paso 1: Tipos y Validadores**
```tsx
// types/form.ts
export interface FormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  acceptTerms: boolean
}

export interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  acceptTerms?: string
}

export interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}
```

```tsx
// utils/validators.ts
import { FormData, FormErrors, PasswordStrength } from '../types/form'

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

  passwordMatch: (password: string) => (confirmPassword: string) => {
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    return null
  }
}

export function validatePassword(password: string): PasswordStrength {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) score++
  else feedback.push('Al menos 8 caracteres')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Al menos una mayúscula')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Al menos una minúscula')

  if (/\d/.test(password)) score++
  else feedback.push('Al menos un número')

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
  else feedback.push('Al menos un carácter especial')

  const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green']
  const color = colors[Math.min(score, colors.length - 1)]

  return { score, feedback, color }
}

export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  // Email
  const emailError = validators.required(data.email) || validators.email(data.email)
  if (emailError) errors.email = emailError

  // Password
  const passwordError = validators.required(data.password) || validators.minLength(8)(data.password)
  if (passwordError) errors.password = passwordError

  // Confirm Password
  const confirmPasswordError = validators.required(data.confirmPassword) || 
    validators.passwordMatch(data.password)(data.confirmPassword)
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

  // First Name
  const firstNameError = validators.required(data.firstName)
  if (firstNameError) errors.firstName = firstNameError

  // Last Name
  const lastNameError = validators.required(data.lastName)
  if (lastNameError) errors.lastName = lastNameError

  // Terms
  if (!data.acceptTerms) {
    errors.acceptTerms = 'Debes aceptar los términos y condiciones'
  }

  return errors
}
```

#### **Paso 2: Hook de Formulario**
```tsx
// hooks/useForm.ts
import { useState, useCallback } from 'react'
import { FormData, FormErrors } from '../types/form'
import { validateForm, validatePassword } from '../utils/validators'

export function useForm(initialData: FormData) {
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({} as any)

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    
    // Validación en tiempo real
    if (touched[field]) {
      const newErrors = validateForm({ ...data, [field]: value })
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
    }
  }, [data, touched])

  const handleBlur = useCallback((field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const newErrors = validateForm(data)
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
  }, [data])

  const isValid = useCallback(() => {
    const formErrors = validateForm(data)
    return Object.keys(formErrors).length === 0
  }, [data])

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({} as any)
  }, [initialData])

  return {
    data,
    errors,
    touched,
    updateField,
    handleBlur,
    isValid,
    reset
  }
}
```

#### **Paso 3: Componente de Campo de Formulario**
```tsx
// components/FormField.tsx
import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  error?: string
  touched?: boolean
  onChange: (value: string) => void
  onBlur: () => void
  placeholder?: string
  required?: boolean
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  required = false
}: FormFieldProps) {
  const showError = touched && error

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${showError ? 'border-red-300' : 'border-gray-300'}
        `}
      />
      
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

#### **Paso 4: Componente de Fortaleza de Contraseña**
```tsx
// components/PasswordStrength.tsx
import React from 'react'
import { PasswordStrength } from '../types/form'

interface PasswordStrengthProps {
  strength: PasswordStrength
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthProps) {
  const { score, feedback, color } = strength

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Muy Débil'
    if (score <= 2) return 'Débil'
    if (score <= 3) return 'Media'
    if (score <= 4) return 'Fuerte'
    return 'Muy Fuerte'
  }

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-2 w-8 rounded ${
                level <= score ? `bg-${color}-500` : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className={`text-sm font-medium text-${color}-600`}>
          {getStrengthText(score)}
        </span>
      </div>
      
      {feedback.length > 0 && (
        <ul className="mt-2 text-sm text-gray-600">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="text-red-500 mr-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

#### **Paso 5: Formulario Principal**
```tsx
// components/RegistrationForm.tsx
import React, { useState } from 'react'
import { useForm } from '../hooks/useForm'
import { FormField } from './FormField'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { validatePassword } from '../utils/validators'
import { FormData } from '../types/form'

const initialData: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  acceptTerms: false
}

export function RegistrationForm() {
  const { data, errors, touched, updateField, handleBlur, isValid, reset } = useForm(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const passwordStrength = validatePassword(data.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid()) {
      return
    }

    setIsSubmitting(true)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    reset()
  }

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Registro Exitoso!
          </h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada correctamente.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Registrar Otro Usuario
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Registro de Usuario
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Nombre"
            name="firstName"
            value={data.firstName}
            error={errors.firstName}
            touched={touched.firstName}
            onChange={(value) => updateField('firstName', value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Tu nombre"
            required
          />
          
          <FormField
            label="Apellido"
            name="lastName"
            value={data.lastName}
            error={errors.lastName}
            touched={touched.lastName}
            onChange={(value) => updateField('lastName', value)}
            onBlur={() => handleBlur('lastName')}
            placeholder="Tu apellido"
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={data.email}
          error={errors.email}
          touched={touched.email}
          onChange={(value) => updateField('email', value)}
          onBlur={() => handleBlur('email')}
          placeholder="tu@email.com"
          required
        />

        <div>
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            value={data.password}
            error={errors.password}
            touched={touched.password}
            onChange={(value) => updateField('password', value)}
            onBlur={() => handleBlur('password')}
            placeholder="Tu contraseña"
            required
          />
          <PasswordStrengthIndicator strength={passwordStrength} />
        </div>

        <FormField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={data.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          onChange={(value) => updateField('confirmPassword', value)}
          onBlur={() => handleBlur('confirmPassword')}
          placeholder="Confirma tu contraseña"
          required
        />

        <div className="flex items-center">
          <input
            id="acceptTerms"
            type="checkbox"
            checked={data.acceptTerms}
            onChange={(e) => updateField('acceptTerms', e.target.checked)}
            onBlur={() => handleBlur('acceptTerms')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
            Acepto los{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              términos y condiciones
            </a>
          </label>
        </div>
        
        {touched.acceptTerms && errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms}</p>
        )}

        <button
          type="submit"
          disabled={!isValid() || isSubmitting}
          className={`
            w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${isValid() && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  )
}
```

### 🧪 **Pruebas Unitarias**
```tsx
// RegistrationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegistrationForm } from './RegistrationForm'

describe('RegistrationForm', () => {
  test('renderiza todos los campos requeridos', () => {
    render(<RegistrationForm />)
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/acepto los términos/i)).toBeInTheDocument()
  })

  test('muestra errores de validación', async () => {
    const user = userEvent.setup()
    render(<RegistrationForm />)
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/este campo es requerido/i)).toBeInTheDocument()
    })
  })

  test('valida fortaleza de contraseña', async () => {
    const user = userEvent.setup()
    render(<RegistrationForm />)
    
    const passwordInput = screen.getByLabelText(/contraseña/i)
    await user.type(passwordInput, 'weak')
    
    expect(screen.getByText(/muy débil/i)).toBeInTheDocument()
  })
})
```

---

## 🎯 Ejercicio 3: Dashboard Interactivo

### 🎯 **Objetivo**
Crear un dashboard con gráficos, filtros y datos en tiempo real usando React y TypeScript.

### 📋 **Requisitos**
- ✅ Gráficos interactivos
- ✅ Filtros avanzados
- ✅ Modo oscuro/claro
- ✅ Responsive design
- ✅ Datos en tiempo real

### 🚀 **Solución Paso a Paso**

[Continuará en la siguiente sección...]

---

## 🎓 Ejercicios Adicionales

### 📊 **Ejercicio 4: E-commerce con Carrito**
### 🎮 **Ejercicio 5: Juego de Memoria**
### 📱 **Ejercicio 6: App de Notas**
### 🔐 **Ejercicio 7: Sistema de Autenticación**
### 📈 **Ejercicio 8: Portfolio Personal**

---

*Estos ejercicios prácticos te ayudarán a dominar React con TypeScript de manera práctica y efectiva.* 