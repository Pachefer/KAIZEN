# 🎯 EJERCICIOS PRÁCTICOS AVANZADOS TYPESCRIPT
## Desafíos y Proyectos para Dominar React con TypeScript

---

## 📋 **INTRODUCCIÓN A LOS EJERCICIOS**

Estos ejercicios están diseñados para complementar el curso "Learn React with TypeScript" y aplicar todos los conceptos avanzados aprendidos.

### **🎯 Niveles de Dificultad:**
- **🟢 Básico** - Conceptos fundamentales
- **🟡 Intermedio** - Patrones y arquitectura
- **🔴 Avanzado** - Conceptos expertos
- **🟣 Experto** - Proyectos completos

---

## 🟢 **EJERCICIOS BÁSICOS**

### **Ejercicio 1: Tipos Básicos y Interfaces**

```typescript
// 🎯 Objetivo: Crear tipos e interfaces básicas

// 1. Define una interfaz para un producto
interface Product {
  // Completa la interfaz
}

// 2. Define un tipo para el estado de un carrito de compras
type CartState = {
  // Completa el tipo
}

// 3. Crea un componente ProductCard que use la interfaz Product
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Implementa el componente
};

// 4. Crea un hook useCart que maneje el estado del carrito
const useCart = () => {
  // Implementa el hook
};
```

**Solución:**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  image?: string;
}

type CartState = {
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  total: number;
  itemCount: number;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="product-card">
      {product.image && <img src={product.image} alt={product.name} />}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <p className="category">{product.category}</p>
      <span className={`stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
        {product.inStock ? 'En stock' : 'Agotado'}
      </span>
    </div>
  );
};

const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0
  });

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const updatedItems = prev.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        const newItems = [...prev.items, { product, quantity }];
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const updatedItems = prev.items.filter(item => item.product.id !== productId);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      const updatedItems = prev.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0, itemCount: 0 });
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
```

### **Ejercicio 2: Generics Básicos**

```typescript
// 🎯 Objetivo: Crear componentes y hooks genéricos

// 1. Crea un componente List genérico
const List = <T,>({ items, renderItem }: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) => {
  // Implementa el componente
};

// 2. Crea un hook useLocalStorage genérico
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  // Implementa el hook
};

// 3. Crea un hook useApi genérico
const useApi = <T,>(url: string) => {
  // Implementa el hook
};
```

**Solución:**
```typescript
const List = <T,>({ items, renderItem }: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) => {
  return (
    <div className="list">
      {items.map((item, index) => (
        <div key={index} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

const useApi = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

---

## 🟡 **EJERCICIOS INTERMEDIOS**

### **Ejercicio 3: Patrones de Diseño**

```typescript
// 🎯 Objetivo: Implementar patrones de diseño con TypeScript

// 1. Implementa el patrón Observer
interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

// 2. Crea un store de estado usando el patrón Observer
class Store<T> implements Subject<T> {
  // Implementa la clase
}

// 3. Crea un hook para usar el store
const useStore = <T,>(store: Store<T>) => {
  // Implementa el hook
};
```

**Solución:**
```typescript
class Store<T> implements Subject<T> {
  private observers: Observer<T>[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  subscribe(observer: Observer<T>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T): void {
    this.state = newState;
    this.notify(this.state);
  }

  updateState(updater: (state: T) => T): void {
    this.setState(updater(this.state));
  }
}

const useStore = <T,>(store: Store<T>) => {
  const [state, setState] = useState<T>(store.getState());

  useEffect(() => {
    const observer: Observer<T> = {
      update: (data: T) => setState(data)
    };

    store.subscribe(observer);
    return () => store.unsubscribe(observer);
  }, [store]);

  return [state, store.setState.bind(store), store.updateState.bind(store)] as const;
};
```

### **Ejercicio 4: Componentes Compuestos**

```typescript
// 🎯 Objetivo: Crear componentes compuestos con TypeScript

// 1. Crea un componente Modal compuesto
interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const Modal: React.FC<{ children: React.ReactNode }> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode }>;
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ children }) => {
  // Implementa el componente
};

// 2. Crea un componente Form compuesto
const Form: React.FC<{ onSubmit: (data: any) => void }> & {
  Field: React.FC<{ name: string; label: string; type?: string }>;
  Submit: React.FC<{ children: React.ReactNode }>;
} = ({ onSubmit, children }) => {
  // Implementa el componente
};
```

**Solución:**
```typescript
const ModalContext = createContext<ModalContextType | null>(null);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within Modal');
  }
  return context;
};

const Modal: React.FC<{ children: React.ReactNode }> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode }>;
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value: ModalContextType = { isOpen, open, close };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

Modal.Trigger = ({ children }) => {
  const { open } = useModal();
  return <div onClick={open}>{children}</div>;
};

Modal.Content = ({ children }) => {
  const { isOpen, close } = useModal();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }) => (
  <div className="modal-header">{children}</div>
);

Modal.Body = ({ children }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="modal-footer">{children}</div>
);

// Form Component
const FormContext = createContext<{
  values: Record<string, any>;
  setValue: (name: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
} | null>(null);

const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within Form');
  }
  return context;
};

const Form: React.FC<{ onSubmit: (data: any) => void }> & {
  Field: React.FC<{ name: string; label: string; type?: string }>;
  Submit: React.FC<{ children: React.ReactNode }>;
} = ({ onSubmit, children }) => {
  const [values, setValues] = useState<Record<string, any>>({});

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  }, [values, onSubmit]);

  const value = { values, setValue, handleSubmit };

  return (
    <FormContext.Provider value={value}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
};

Form.Field = ({ name, label, type = 'text' }) => {
  const { values, setValue } = useForm();

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        value={values[name] || ''}
        onChange={e => setValue(name, e.target.value)}
      />
    </div>
  );
};

Form.Submit = ({ children }) => {
  return <button type="submit">{children}</button>;
};
```

---

## 🔴 **EJERCICIOS AVANZADOS**

### **Ejercicio 5: Sistema de Autenticación Completo**

```typescript
// 🎯 Objetivo: Crear un sistema de autenticación completo

// 1. Define los tipos para autenticación
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

// 2. Crea un contexto de autenticación
const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

// 3. Implementa el provider de autenticación
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementa el provider
};

// 4. Crea un hook para usar la autenticación
const useAuth = () => {
  // Implementa el hook
};

// 5. Crea un componente de ruta protegida
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementa el componente
};
```

**Solución:**
```typescript
const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const user = await response.json();
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } else {
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Sesión expirada' });
          }
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Error de autenticación' });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const { user, token } = await response.json();
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Error de login' });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const { user, token } = await response.json();
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Error de registro' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = { state, login, register, logout, clearError };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();

  if (state.loading) {
    return <div>Cargando...</div>;
  }

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

## 🟣 **PROYECTOS COMPLETOS**

### **Proyecto 1: E-commerce con TypeScript**

```typescript
// 🎯 Objetivo: Crear una aplicación de e-commerce completa

// Estructura del proyecto:
/*
src/
├── components/
│   ├── ProductList.tsx
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── UserProfile.tsx
├── hooks/
│   ├── useProducts.ts
│   ├── useCart.ts
│   └── useOrders.ts
├── services/
│   ├── api.ts
│   └── auth.ts
├── types/
│   ├── product.ts
│   ├── cart.ts
│   └── order.ts
└── utils/
    ├── formatters.ts
    └── validators.ts
*/

// Implementa cada archivo con TypeScript completo
```

### **Proyecto 2: Dashboard Administrativo**

```typescript
// 🎯 Objetivo: Crear un dashboard administrativo completo

// Características:
// - Autenticación y autorización
// - Gestión de usuarios
// - Estadísticas y gráficos
// - CRUD completo
// - Filtros y búsqueda
// - Exportación de datos
// - Notificaciones en tiempo real
```

---

## 🎯 **DESAFÍOS EXTRA**

### **Desafío 1: Implementar un Sistema de Notificaciones**

```typescript
// Crea un sistema de notificaciones con:
// - Diferentes tipos (success, error, warning, info)
// - Posiciones configurables
// - Auto-dismiss
// - Animaciones
// - Cola de notificaciones
```

### **Desafío 2: Crear un Editor de Código**

```typescript
// Implementa un editor de código con:
// - Resaltado de sintaxis
// - Autocompletado
// - Línea de números
// - Temas configurables
// - Múltiples lenguajes
```

### **Desafío 3: Sistema de Chat en Tiempo Real**

```typescript
// Crea un sistema de chat con:
// - WebSockets
// - Mensajes en tiempo real
// - Indicador de escritura
// - Emojis y archivos
// - Grupos y canales
```

---

## 📊 **EVALUACIÓN Y METRICAS**

### **Criterios de Evaluación:**

1. **Tipado Correcto** - Uso apropiado de TypeScript
2. **Arquitectura Limpia** - Separación de responsabilidades
3. **Performance** - Optimización y rendimiento
4. **Testing** - Cobertura de pruebas
5. **Documentación** - Código bien documentado
6. **Buenas Prácticas** - Patrones y convenciones

### **Herramientas de Evaluación:**

```bash
# Linting y formateo
npm run lint
npm run format

# Testing
npm run test
npm run test:coverage

# Type checking
npm run type-check

# Build
npm run build
```

---

*¡Estos ejercicios te ayudarán a dominar React con TypeScript y convertirte en un desarrollador experto!* 🚀✨ 