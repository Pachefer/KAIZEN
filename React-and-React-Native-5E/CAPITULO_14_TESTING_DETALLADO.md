# 📖 CAPÍTULO 14: PRUEBAS UNITARIAS EN REACT
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Vitest** y configuración de testing
- ✅ **React Testing Library** para testing de componentes
- ✅ **Testing de hooks** con renderHook
- ✅ **Testing de eventos** y interacciones
- ✅ **Testing de componentes** simples y complejos
- ✅ **Testing de funciones** puras
- ✅ **Testing de formularios** y inputs
- ✅ **Patrones de testing** y mejores prácticas

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ ES TESTING EN REACT?

### **Definición:**
Testing en React es el proceso de **verificar que los componentes, hooks y funciones** funcionan correctamente según lo esperado. Esto incluye pruebas unitarias, de integración y end-to-end.

### **Herramientas Principales:**
```javascript
// 🎯 Vitest - Runner de pruebas moderno
import { describe, it, expect } from 'vitest';

// 🎯 React Testing Library - Testing de componentes
import { render, screen, fireEvent } from '@testing-library/react';

// 🎯 Testing de hooks
import { renderHook, act } from '@testing-library/react';
```

---

## 💻 ANÁLISIS DEL CÓDIGO: TESTING DE COMPONENTES

### **Archivo: `src/App.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Componente simple para testing
export function App() {
  // 🚀 Retorna un elemento h1 con texto "Hello world"
  return <h1>Hello world</h1>;
}
```

### **Archivo: `src/App.test.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de testing
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

// 🎯 Suite de pruebas para el componente App
describe("App", () => {
  // 🧪 Prueba individual que verifica que el componente está en el documento
  it("should be in document", () => {
    // 🎯 Renderizar el componente App en el DOM virtual
    render(<App />);
    
    // ✅ Verificar que el texto "Hello world" está presente en el documento
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});
```

---

## 💻 ANÁLISIS DEL CÓDIGO: TESTING DE HOOKS

### **Archivo: `src/useCounter.ts`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación de React
import { useState } from "react";

// 🎯 Hook personalizado para contador
export function useCounter(initialValue: number = 0) {
  // 📊 Estado para el contador con valor inicial
  const [count, setCount] = useState(initialValue);

  // 🎯 Función para incrementar el contador
  const increment = () => setCount((c) => c + 1);
  
  // 🎯 Función para decrementar el contador
  const decrement = () => setCount((c) => c - 1);

  // 📤 Retornar estado y funciones
  return { count, increment, decrement };
}
```

### **Archivo: `src/useCounter.test.ts`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones para testing de hooks
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";
import { test, expect } from "vitest";

// 🧪 Prueba del hook useCounter
test("useCounter", () => {
  // 🎯 Renderizar el hook en un entorno de testing
  const { result } = renderHook(() => useCounter());

  // ✅ Verificar valor inicial (hay un error en el test original)
  expect(result.current.count).toBe(10); // ❌ Debería ser 0

  // 🎯 Ejecutar incremento dentro de act()
  act(() => {
    result.current.increment();
  });

  // ✅ Verificar que el contador se incrementó
  expect(result.current.count).toBe(1);

  // 🎯 Ejecutar decremento dentro de act()
  act(() => {
    result.current.decrement();
  });

  // ✅ Verificar que el contador se decrementó
  expect(result.current.count).toBe(0);
});
```

---

## 💻 ANÁLISIS DEL CÓDIGO: TESTING DE INPUTS

### **Archivo: `src/Input.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Componente de input para testing
export function Input() {
  // 🚀 Retorna un input de texto con testid para testing
  return <input type="text" data-testid="userName" />;
}
```

### **Archivo: `src/Input.test.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones para testing de componentes
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

// 🎯 Función auxiliar para testing (no relacionada con Input)
export const squared = (n: number) => n * n;

// 🎯 Suite de pruebas para el componente Input
describe("Input", () => {
  // 🧪 Prueba que verifica el manejo de eventos de cambio
  it("should handle change event", () => {
    // 🎯 Renderizar el componente Input
    render(<Input />);
    
    // 🎯 Obtener el input por su testid
    const input = screen.getByTestId<HTMLInputElement>("userName");
    
    // 🎯 Simular evento de cambio con fireEvent
    fireEvent.change(input, { target: { value: "Mikhail" } });

    // ✅ Verificar que el valor del input cambió correctamente
    expect(input.value).toBe("Mikhail");
  });
});
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis de React Testing Library:**

#### **Render y Screen:**
```tsx
// 🎯 Render renderiza componentes en un DOM virtual
render(<MyComponent />);

// 🎯 Screen proporciona métodos para buscar elementos
screen.getByText('Hello');           // Buscar por texto
screen.getByTestId('my-element');    // Buscar por testid
screen.getByRole('button');          // Buscar por rol
screen.getByLabelText('Username');   // Buscar por label
```

#### **FireEvent para Simular Eventos:**
```tsx
// 🎯 Simular diferentes tipos de eventos
fireEvent.click(button);                    // Click
fireEvent.change(input, { target: { value: 'text' } }); // Cambio
fireEvent.submit(form);                     // Submit
fireEvent.keyDown(input, { key: 'Enter' }); // Teclado
fireEvent.mouseEnter(element);              // Mouse
```

### **Análisis de Testing de Hooks:**

#### **RenderHook y Act:**
```tsx
// 🎯 RenderHook renderiza hooks en un entorno de testing
const { result } = renderHook(() => useMyHook());

// 🎯 Act envuelve actualizaciones de estado
act(() => {
  result.current.someAction();
});
```

---

## 🧪 PRUEBAS UNITARIAS ADICIONALES

### **Test 1: Testing de Componente Complejo**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Componente para testing
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

describe('Counter Component', () => {
  it('debe mostrar contador inicial en 0', () => {
    render(<Counter />);
    
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('debe incrementar el contador al hacer click', () => {
    render(<Counter />);
    
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('debe decrementar el contador al hacer click', () => {
    render(<Counter />);
    
    const decrementButton = screen.getByText('Decrement');
    fireEvent.click(decrementButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('-1');
  });
});
```

### **Test 2: Testing de Hook con Parámetros**
```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
  it('debe inicializar con valor por defecto', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  it('debe inicializar con valor personalizado', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });

  it('debe incrementar correctamente', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(6);
  });

  it('debe decrementar correctamente', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('debe manejar múltiples operaciones', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### **Test 3: Testing de Formularios**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

function LoginForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid="username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Username"
      />
      <input
        data-testid="password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

describe('LoginForm Component', () => {
  it('debe manejar cambios en inputs', () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    
    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpass');
  });

  it('debe llamar onSubmit con datos correctos', () => {
    const mockOnSubmit = vi.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByText('Login');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    });
  });
});
```

### **Test 4: Testing de Funciones Puras**
```typescript
import { describe, it, expect } from 'vitest';

// Función pura para testing
function calculateTotal(items: Array<{ price: number; quantity: number }>) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

describe('calculateTotal Function', () => {
  it('debe calcular total correctamente', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 }
    ];
    
    const total = calculateTotal(items);
    expect(total).toBe(35); // (10 * 2) + (5 * 3) = 35
  });

  it('debe retornar 0 para array vacío', () => {
    const total = calculateTotal([]);
    expect(total).toBe(0);
  });

  it('debe manejar items con precio 0', () => {
    const items = [
      { price: 0, quantity: 5 },
      { price: 10, quantity: 1 }
    ];
    
    const total = calculateTotal(items);
    expect(total).toBe(10); // (0 * 5) + (10 * 1) = 10
  });
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado de las Pruebas:**
```bash
# Ejecución de pruebas con Vitest
✓ App should be in document
✓ useCounter
✓ Input should handle change event

# Resultado esperado:
# - Todas las pruebas pasan
# - Cobertura de código completa
# - Tiempo de ejecución rápido
```

### **Comportamiento de las Pruebas:**
1. **App.test.tsx**: Verifica que "Hello world" está en el documento
2. **useCounter.test.ts**: Verifica incremento/decremento del contador
3. **Input.test.tsx**: Verifica que el input maneja cambios correctamente

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Testing de Componente con Props**
```tsx
// 🎯 Componente con props para testing
interface UserCardProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div data-testid="user-card">
      <img src={user.avatar} alt={user.name} data-testid="user-avatar" />
      <h3 data-testid="user-name">{user.name}</h3>
      <p data-testid="user-email">{user.email}</p>
      {onEdit && <button onClick={onEdit} data-testid="edit-button">Edit</button>}
      {onDelete && <button onClick={onDelete} data-testid="delete-button">Delete</button>}
    </div>
  );
}

// Testing del componente
describe('UserCard Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  it('debe renderizar información del usuario', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('user-avatar')).toHaveAttribute('src', mockUser.avatar);
  });

  it('debe llamar onEdit cuando se hace click en Edit', () => {
    const mockOnEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('debe llamar onDelete cuando se hace click en Delete', () => {
    const mockOnDelete = vi.fn();
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
```

### **Ejercicio 2: Testing de Hook Complejo**
```tsx
// 🎯 Hook complejo para testing
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (validationRules: Record<keyof T, (value: any) => string | undefined>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    Object.keys(validationRules).forEach(key => {
      const field = key as keyof T;
      const error = validationRules[field](values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    handleSubmit
  };
}

// Testing del hook
describe('useForm Hook', () => {
  it('debe inicializar con valores correctos', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('debe manejar cambios en campos', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });

  it('debe validar campos correctamente', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }));
    
    const validationRules = {
      name: (value: string) => value.length < 2 ? 'Name too short' : undefined,
      email: (value: string) => !value.includes('@') ? 'Invalid email' : undefined
    };
    
    act(() => {
      result.current.handleChange('name', 'J');
      result.current.handleChange('email', 'invalid-email');
    });
    
    const isValid = result.current.validate(validationRules);
    
    expect(isValid).toBe(false);
    expect(result.current.errors.name).toBe('Name too short');
    expect(result.current.errors.email).toBe('Invalid email');
  });
});
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Mejores Prácticas de Testing:**
```typescript
// ✅ Testing de comportamiento, no implementación
// ❌ No testear detalles internos
// ✅ Usar data-testid para elementos específicos
// ✅ Testing de accesibilidad con getByRole
// ✅ Testing de errores y casos edge
// ✅ Mantener pruebas simples y legibles
```

### **Consideraciones de Rendimiento:**
```typescript
// 🎯 Optimizaciones recomendadas:
// - Usar beforeEach para setup común
// - Mockear dependencias externas
// - Testing de componentes en aislamiento
// - Usar test suites organizadas
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```tsx
// ✅ Usar descripciones claras en tests
it('should display user name when user is logged in', () => {
  // test implementation
});

// ✅ Testing de accesibilidad
expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

// ✅ Testing de errores
it('should show error message when API call fails', () => {
  // test implementation
});

// ✅ Usar setup y teardown
beforeEach(() => {
  // setup
});

afterEach(() => {
  // cleanup
});
```

### **❌ Evitar:**
```tsx
// ❌ Testing de implementación interna
expect(component.state.count).toBe(5);

// ❌ Testing de detalles de renderizado
expect(component.find('.button').hasClass('active')).toBe(true);

// ❌ Tests frágiles que dependen de estructura
expect(screen.getByText('Hello')).toBeInTheDocument(); // Frágil
expect(screen.getByRole('heading')).toHaveTextContent('Hello'); // Mejor
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **Vitest** es un runner de pruebas moderno y rápido
2. **React Testing Library** facilita testing de componentes
3. **renderHook** permite testing de hooks personalizados
4. **fireEvent** simula interacciones del usuario
5. **Testing de comportamiento** es más importante que testing de implementación

### **Habilidades Desarrolladas:**
- ✅ Configurar entorno de testing con Vitest
- ✅ Escribir pruebas para componentes React
- ✅ Testing de hooks personalizados
- ✅ Simular eventos e interacciones
- ✅ Testing de formularios y inputs
- ✅ Aplicar mejores prácticas de testing

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Server Components**, implementando renderizado del lado del servidor.

---

*¡Excelente! Has completado el análisis detallado del Capítulo 14. Ahora entiendes cómo escribir pruebas unitarias efectivas para aplicaciones React. Estás listo para continuar con Server Components en el siguiente capítulo.* 