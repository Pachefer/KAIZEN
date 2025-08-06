# 📖 CAPÍTULO 6: VERIFICACIÓN DE TIPOS CON TYPESCRIPT
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Qué es TypeScript** y por qué es beneficioso en React
- ✅ **Configuración de TypeScript** en proyectos React
- ✅ **Tipos básicos** y cómo definirlos
- ✅ **Interfaces y tipos** para props de componentes
- ✅ **Genéricos** en React con TypeScript
- ✅ **Hooks tipados** y useState con tipos
- ✅ **Refs tipados** y forwardRef
- ✅ **Context API** con TypeScript

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ ES TYPESCRIPT?

### **Definición:**
TypeScript es un **superset de JavaScript** que agrega verificación de tipos estática. Permite detectar errores en tiempo de compilación, mejorar la experiencia de desarrollo y hacer el código más mantenible.

### **Beneficios en React:**
```typescript
// ❌ JavaScript - Sin verificación de tipos
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// ✅ TypeScript - Con verificación de tipos
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

---

## 💻 ANÁLISIS DEL CÓDIGO: COMPONENTES CON TYPESCRIPT

### **Archivo: `src/App.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de componentes tipados
import Greeting from "./Greeting";
import UserCard from "./UserCard";
import Button from "./Button";
import Counter from "./Counter";
import InputField from "./InputField";
import InputWithRef from "./InputWithRef";

// 🎯 Componente principal App
// TypeScript infiere automáticamente el tipo de retorno como JSX.Element
function App() {
  // 🚀 Renderizado de múltiples componentes con props tipadas
  return (
    <div>
      {/* 👋 Componente con prop name de tipo string */}
      <Greeting name="Mike" />
      
      {/* 👤 Componente con prop user de tipo objeto */}
      <UserCard user={{ name: "Mike", email: "mikes@email.com" }} />
      
      {/* 🔘 Componente Button con children y prop opcional disabled */}
      <Button>Click me!</Button>
      <Button disabled>Don't click me!</Button>
      
      {/* 🔢 Componente Counter sin props */}
      <Counter />
      
      {/* 📝 Componentes de input */}
      <InputField />
      <InputWithRef />
    </div>
  );
}

// 📤 Exportación del componente
export default App;
```

### **Archivo: `src/Greeting.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Definición de tipo para las props del componente
// type es una forma de definir tipos en TypeScript
type GreetingProps = {
  name: string; // Prop requerida de tipo string
};

// 🎯 Componente funcional con props tipadas
// { name }: GreetingProps es destructuring con tipado
const Greeting = ({ name }: GreetingProps) => {
  // 🚀 Retorno de JSX con interpolación de la prop tipada
  return <h1>Hello, {name}!</h1>;
};

// 📤 Exportación del componente
export default Greeting;
```

### **Archivo: `src/UserCard.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Definición de tipo para las props del componente
type UserProps = {
  user: {
    name: string;   // Prop anidada: objeto con name de tipo string
    email: string;  // Prop anidada: objeto con email de tipo string
  };
};

// 🎯 Componente funcional con props tipadas
// { user }: UserProps es destructuring con tipado de objeto anidado
const UserCard = ({ user }: UserProps) => {
  // 🚀 Retorno de JSX con acceso a propiedades del objeto tipado
  return (
    <div>
      {/* 📝 Título con nombre del usuario */}
      <h1>{user.name}</h1>
      {/* 📧 Párrafo con email del usuario */}
      <p>{user.email}</p>
    </div>
  );
};

// 📤 Exportación del componente
export default UserCard;
```

### **Archivo: `src/Button.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación de React para acceder a tipos
import React from "react";

// 🎯 Definición de tipo para las props del componente
type ButtonProps = {
  children: React.ReactNode; // Prop children de tipo ReactNode (cualquier contenido JSX)
  disabled?: boolean;        // Prop opcional (?) de tipo boolean
};

// 🎯 Componente funcional con props tipadas y valor por defecto
// disabled = false proporciona un valor por defecto para la prop opcional
const Button = ({ children, disabled = false }: ButtonProps) => {
  // 🚀 Retorno de JSX con prop tipada aplicada al elemento button
  return <button disabled={disabled}>{children}</button>;
};

// 📤 Exportación del componente
export default Button;
```

### **Archivo: `src/Counter.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación de React para acceder a hooks
import React from "react";

// 🎯 Componente funcional con hook useState tipado
const Counter = () => {
  // 📊 Hook useState con tipo explícito number
  // React.useState<number>(0) especifica que el estado será de tipo number
  const [count, setCount] = React.useState<number>(0);

  // 🚀 Retorno de JSX con estado tipado
  return (
    <div>
      {/* 📝 Párrafo que muestra el contador tipado */}
      <p>Count: {count}</p>
      
      {/* 🔘 Botón con event handler que actualiza el estado tipado */}
      <button
        onClick={() => {
          // ✅ TypeScript verifica que count + 1 es válido para number
          setCount(count + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};

// 📤 Exportación del componente
export default Counter;
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis de Tipos en TypeScript:**

#### **Tipos Básicos:**
```typescript
// 🎯 Tipos primitivos
type StringType = string;
type NumberType = number;
type BooleanType = boolean;
type ArrayType = string[];
type ObjectType = { name: string; age: number };

// 🎯 Tipos de React
type ReactNodeType = React.ReactNode; // Cualquier contenido JSX
type ReactElementType = React.ReactElement; // Elemento JSX
type ReactComponentType = React.ComponentType; // Tipo de componente
```

#### **Props Tipadas:**
```typescript
// 🎯 Props simples
type SimpleProps = {
  name: string;
  age: number;
  isActive: boolean;
};

// 🎯 Props opcionales
type OptionalProps = {
  title: string;
  subtitle?: string; // El ? hace la prop opcional
};

// 🎯 Props con valores por defecto
type DefaultProps = {
  variant: 'primary' | 'secondary' | 'danger'; // Union types
  size?: 'small' | 'medium' | 'large';
};
```

#### **Hooks Tipados:**
```typescript
// 🎯 useState tipado
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// 🎯 useEffect tipado
useEffect(() => {
  // Lógica del efecto
}, [dependencies]);

// 🎯 useRef tipado
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
```

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Componentes Tipados**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Greeting from './Greeting';
import UserCard from './UserCard';
import Button from './Button';

describe('Componentes TypeScript', () => {
  it('debe renderizar Greeting con prop name tipada', () => {
    render(<Greeting name="Juan" />);
    expect(screen.getByText('Hello, Juan!')).toBeInTheDocument();
  });

  it('debe renderizar UserCard con prop user tipada', () => {
    const user = { name: 'María', email: 'maria@ejemplo.com' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('María')).toBeInTheDocument();
    expect(screen.getByText('maria@ejemplo.com')).toBeInTheDocument();
  });

  it('debe renderizar Button con children y disabled opcional', () => {
    render(
      <div>
        <Button>Click me!</Button>
        <Button disabled>Don't click me!</Button>
      </div>
    );
    
    expect(screen.getByText('Click me!')).toBeInTheDocument();
    expect(screen.getByText("Don't click me!")).toBeInTheDocument();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toBeDisabled();
  });
});
```

### **Test 2: Verificación de Hook useState Tipado**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Counter from './Counter';

describe('Counter con useState tipado', () => {
  it('debe inicializar con count = 0', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('debe incrementar el contador al hacer click', () => {
    render(<Counter />);
    
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });

  it('debe mantener el tipo number en las operaciones', () => {
    render(<Counter />);
    
    // TypeScript verifica que las operaciones son válidas
    const button = screen.getByText('Increment');
    
    // Múltiples clicks para verificar que sigue siendo number
    for (let i = 0; i < 5; i++) {
      fireEvent.click(button);
    }
    
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
});
```

### **Test 3: Verificación de Tipos en Props**
```typescript
describe('Verificación de tipos en props', () => {
  it('debe aceptar props con tipos correctos', () => {
    // ✅ Props válidas
    render(<Greeting name="Test" />);
    render(<UserCard user={{ name: "Test", email: "test@test.com" }} />);
    render(<Button>Test Button</Button>);
    
    // ✅ Props opcionales
    render(<Button disabled>Disabled Button</Button>);
    
    expect(screen.getByText('Hello, Test!')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('debe manejar valores por defecto correctamente', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByText('Default Button');
    expect(button).not.toBeDisabled(); // disabled = false por defecto
  });
});
```

### **Test 4: Verificación de TypeScript en Tiempo de Compilación**
```typescript
// 🎯 Estos tests verifican que TypeScript detecta errores de tipos

describe('Verificación de tipos en tiempo de compilación', () => {
  it('debe detectar errores de tipos en props', () => {
    // ❌ Estos errores serían detectados por TypeScript:
    // render(<Greeting name={123} />); // Error: number no es asignable a string
    // render(<UserCard user={{ name: "Test" }} />); // Error: falta email
    // render(<Button disabled="true" />); // Error: string no es asignable a boolean
    
    // ✅ Solo código válido se ejecuta
    render(<Greeting name="Valid" />);
    expect(screen.getByText('Hello, Valid!')).toBeInTheDocument();
  });
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en el Navegador:**
```html
<!-- HTML generado por React con TypeScript -->
<div id="root">
  <div>
    <h1>Hello, Mike!</h1>
    <div>
      <h1>Mike</h1>
      <p>mikes@email.com</p>
    </div>
    <button>Click me!</button>
    <button disabled>Don't click me!</button>
    <div>
      <p>Count: 0</p>
      <button>Increment</button>
    </div>
    <!-- InputField y InputWithRef se renderizarían aquí -->
  </div>
</div>
```

### **Comportamiento Interactivo:**
1. **Greeting**: Muestra "Hello, Mike!" con el nombre tipado
2. **UserCard**: Muestra nombre y email del usuario tipado
3. **Button**: Primer botón clickeable, segundo botón deshabilitado
4. **Counter**: Contador que incrementa al hacer click (estado tipado como number)

### **Verificación de Tipos:**
```typescript
// ✅ TypeScript verifica estos tipos en tiempo de compilación:
// - name debe ser string
// - user debe tener name y email como strings
// - children debe ser ReactNode
// - disabled debe ser boolean opcional
// - count debe ser number
```

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Interfaces vs Types**
```typescript
// 🎯 Usando interface
interface UserInterface {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
}

// 🎯 Usando type
type UserType = {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
};

// 🎯 Componente con interface
const UserProfile: React.FC<{ user: UserInterface }> = ({ user }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {user.isActive && <span>Activo</span>}
    </div>
  );
};
```

### **Ejercicio 2: Genéricos en React**
```typescript
// 🎯 Componente genérico
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

const List = <T,>({ items, renderItem, keyExtractor }: ListProps<T>) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};

// Uso:
const users = [
  { id: 1, name: 'Juan' },
  { id: 2, name: 'María' }
];

<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### **Ejercicio 3: Hooks Personalizados Tipados**
```typescript
// 🎯 Hook personalizado tipado
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounter = (initialValue: number = 0): UseCounterReturn => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// Uso en componente:
const CounterWithHook = () => {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### **Ejercicio 4: Context API con TypeScript**
```typescript
// 🎯 Context tipado
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 🎯 Provider tipado
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🎯 Hook personalizado para usar el context
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Diferencias entre Type y Interface:**
```typescript
// 🎯 Interface - Extensible
interface User {
  name: string;
}
interface User {
  email: string; // Se extiende automáticamente
}

// 🎯 Type - No extensible
type User = {
  name: string;
};
// type User = { email: string }; // ❌ Error: redeclaración

// 🎯 Type - Más flexible
type Status = 'loading' | 'success' | 'error'; // Union types
type UserOrNull = User | null; // Union con null
```

### **Mejores Prácticas:**
```typescript
// ✅ Usar interfaces para objetos
interface Props {
  name: string;
  age: number;
}

// ✅ Usar types para unions y primitivos
type Status = 'idle' | 'loading' | 'success' | 'error';
type ID = string | number;

// ✅ Props opcionales con ?
interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

// ✅ Valores por defecto
const Button = ({ text, onClick, disabled = false }: ButtonProps) => {
  return <button disabled={disabled} onClick={onClick}>{text}</button>;
};
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```typescript
// ✅ Definir tipos explícitos para props
interface ComponentProps {
  title: string;
  count: number;
  isActive?: boolean;
}

// ✅ Usar genéricos para componentes reutilizables
const List = <T,>({ items, renderItem }: ListProps<T>) => { /* ... */ };

// ✅ Tipar hooks personalizados
const useData = (): { data: Data[]; loading: boolean } => { /* ... */ };

// ✅ Usar React.FC para componentes funcionales
const MyComponent: React.FC<Props> = ({ title }) => { /* ... */ };

// ✅ Validar props con TypeScript
const validateProps = (props: Props): boolean => {
  return props.title.length > 0 && props.count >= 0;
};
```

### **❌ Evitar:**
```typescript
// ❌ Usar any
const Component = (props: any) => { /* ... */ };

// ❌ No tipar props
const Component = (props) => { /* ... */ };

// ❌ Ignorar errores de TypeScript
// @ts-ignore
const result = someFunction();

// ❌ Usar tipos muy amplios
const Component = (props: object) => { /* ... */ };
```

---

## 🔄 CONCEPTOS AVANZADOS

### **Utility Types:**
```typescript
// 🎯 Partial - Hace todas las props opcionales
type PartialUser = Partial<User>;

// 🎯 Required - Hace todas las props requeridas
type RequiredUser = Required<User>;

// 🎯 Pick - Selecciona propiedades específicas
type UserName = Pick<User, 'name' | 'email'>;

// 🎯 Omit - Excluye propiedades específicas
type UserWithoutId = Omit<User, 'id'>;

// 🎯 Record - Crea objeto con keys y values tipados
type UserMap = Record<string, User>;
```

### **Conditional Types:**
```typescript
// 🎯 Tipo condicional
type NonNullable<T> = T extends null | undefined ? never : T;

// 🎯 Tipo condicional con inferencia
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 🎯 Uso en componentes
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}
```

### **Mapped Types:**
```typescript
// 🎯 Mapped type para hacer todas las props opcionales
type OptionalProps<T> = {
  [K in keyof T]?: T[K];
};

// 🎯 Mapped type para hacer todas las props readonly
type ReadonlyProps<T> = {
  readonly [K in keyof T]: T[K];
};

// 🎯 Uso en componentes
interface User {
  id: number;
  name: string;
  email: string;
}

type OptionalUser = OptionalProps<User>;
// Resultado: { id?: number; name?: string; email?: string; }
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **TypeScript** agrega verificación de tipos estática a JavaScript
2. **Interfaces y types** definen la estructura de props
3. **Hooks tipados** mejoran la seguridad de tipos
4. **Genéricos** crean componentes reutilizables
5. **Utility types** simplifican la definición de tipos

### **Habilidades Desarrolladas:**
- ✅ Configurar TypeScript en proyectos React
- ✅ Definir tipos para props de componentes
- ✅ Usar hooks con tipos explícitos
- ✅ Crear interfaces y types
- ✅ Implementar genéricos en React
- ✅ Aplicar mejores prácticas de TypeScript

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Navegación con Rutas**, implementando routing en aplicaciones React.

---

## 🎯 EJERCICIOS PRÁCTICOS

### **Ejercicio 1: Sistema de Tipos Completo**
```typescript
// Crea un sistema de tipos para una aplicación de e-commerce:
// - Product (id, name, price, category, inStock)
// - Cart (items, total, itemCount)
// - User (id, name, email, address)
// - Order (id, userId, products, total, status)
```

### **Ejercicio 2: Componentes Genéricos**
```typescript
// Crea componentes genéricos:
// - DataTable<T> (datos, columnas, acciones)
// - FormField<T> (label, value, onChange, validation)
// - Modal<T> (isOpen, data, onClose, onConfirm)
```

### **Ejercicio 3: Hooks Tipados Avanzados**
```typescript
// Crea hooks tipados para:
// - useLocalStorage<T> (key, initialValue)
// - useFetch<T> (url, options)
// - useForm<T> (initialValues, validation)
// - useDebounce<T> (value, delay)
```

---

*¡Excelente! Has completado el análisis detallado del Capítulo 6. Ahora entiendes cómo usar TypeScript en React para crear código más seguro y mantenible. Estás listo para continuar con Navegación en el siguiente capítulo.* 