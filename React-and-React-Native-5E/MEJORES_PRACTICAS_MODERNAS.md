# 🚀 MEJORES PRÁCTICAS MODERNAS Y PATRONES DE DISEÑO
## React y React Native - Guía Avanzada 2024

---

## 🎯 PATRONES DE DISEÑO MODERNOS

### **1. Compound Components Pattern**
```tsx
// 🎯 Patrón de Componentes Compuestos
const Toggle = ({ children, onToggle, ...props }) => {
  const [on, setOn] = useState(false);
  
  const toggle = useCallback(() => {
    setOn(prev => !prev);
    onToggle?.(!on);
  }, [on, onToggle]);

  return (
    <ToggleContext.Provider value={{ on, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
};

Toggle.On = ({ children }) => {
  const { on } = useContext(ToggleContext);
  return on ? children : null;
};

Toggle.Off = ({ children }) => {
  const { on } = useContext(ToggleContext);
  return on ? null : children;
};

Toggle.Button = ({ ...props }) => {
  const { on, toggle } = useContext(ToggleContext);
  return <button onClick={toggle} {...props} />;
};

// Uso:
<Toggle onToggle={console.log}>
  <Toggle.On>La luz está encendida</Toggle.On>
  <Toggle.Off>La luz está apagada</Toggle.Off>
  <Toggle.Button>Cambiar</Toggle.Button>
</Toggle>
```

### **2. Render Props Pattern**
```tsx
// 🎯 Patrón Render Props
const MouseTracker = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return render(position);
};

// Uso:
<MouseTracker 
  render={({ x, y }) => (
    <h1>El mouse está en ({x}, {y})</h1>
  )}
/>
```

### **3. Custom Hooks Pattern**
```tsx
// 🎯 Hooks Personalizados Avanzados
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// Hook para formularios
const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setErrors,
  };
};
```

---

## 🔧 PATRONES DE ESTADO MODERNOS

### **1. Zustand (Estado Global Moderno)**
```tsx
// 🎯 Zustand - Estado Global Simple y Moderno
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        updateProfile: (updates) => 
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null
          })),
      }),
      { name: 'user-storage' }
    )
  )
);

// Uso:
const UserProfile = () => {
  const { user, updateProfile } = useUserStore();
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => updateProfile({ name: 'Nuevo Nombre' })}>
        Actualizar
      </button>
    </div>
  );
};
```

### **2. React Query (Server State)**
```tsx
// 🎯 React Query - Manejo de Estado del Servidor
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Hook personalizado para usuarios
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
    select: (data) => data.users,
  });
};

// Hook para crear usuario
const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData) => 
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Componente con React Query
const UserList = () => {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={() => createUser.mutate({ name: 'Nuevo Usuario' })}>
        Crear Usuario
      </button>
    </div>
  );
};
```

---

## 🎨 PATRONES DE UI MODERNOS

### **1. Headless Components**
```tsx
// 🎯 Componentes Headless (Sin UI)
const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const select = useCallback((item) => {
    setSelectedItem(item);
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    selectedItem,
    toggle,
    select,
  };
};

// Componente de UI que usa el hook
const Dropdown = ({ items, onSelect }) => {
  const { isOpen, selectedItem, toggle, select } = useDropdown();

  return (
    <div className="dropdown">
      <button onClick={toggle}>
        {selectedItem?.label || 'Seleccionar...'}
      </button>
      {isOpen && (
        <ul>
          {items.map(item => (
            <li key={item.value} onClick={() => select(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### **2. Component Composition**
```tsx
// 🎯 Composición de Componentes
const Card = ({ children, ...props }) => (
  <div className="card" {...props}>
    {children}
  </div>
);

Card.Header = ({ children, ...props }) => (
  <div className="card-header" {...props}>
    {children}
  </div>
);

Card.Body = ({ children, ...props }) => (
  <div className="card-body" {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, ...props }) => (
  <div className="card-footer" {...props}>
    {children}
  </div>
);

// Uso:
<Card>
  <Card.Header>
    <h2>Título de la Tarjeta</h2>
  </Card.Header>
  <Card.Body>
    <p>Contenido de la tarjeta</p>
  </Card.Body>
  <Card.Footer>
    <button>Acción</button>
  </Card.Footer>
</Card>
```

---

## ⚡ OPTIMIZACIÓN Y RENDIMIENTO

### **1. React.memo y useMemo Avanzados**
```tsx
// 🎯 Optimización con React.memo
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: item.value * 2,
    }));
  }, [data]);

  const handleClick = useCallback(() => {
    onAction(processedData);
  }, [processedData, onAction]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={handleClick}>
          {item.processed}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada
  return prevProps.data.length === nextProps.data.length &&
         prevProps.data.every((item, index) => 
           item.id === nextProps.data[index].id
         );
});
```

### **2. Virtual Scrolling**
```tsx
// 🎯 Virtual Scrolling con react-window
import { FixedSizeList as List } from 'react-window';

const VirtualList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### **3. Lazy Loading Avanzado**
```tsx
// 🎯 Lazy Loading con Suspense
const LazyComponent = React.lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);

const App = () => {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>
        Cargar Componente Pesado
      </button>
      {showHeavy && (
        <Suspense fallback={<div>Cargando...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
};
```

---

## 🔐 PATRONES DE SEGURIDAD

### **1. Error Boundaries Modernos**
```tsx
// 🎯 Error Boundary con Hooks
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Enviar a servicio de monitoreo
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo salió mal</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para manejo de errores
const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    setError(error);
    // Log del error
    console.error('Error handled:', error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
```

### **2. Autenticación Moderna**
```tsx
// 🎯 Context de Autenticación Moderno
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token al iniciar
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user } = await loginAPI(credentials);
    localStorage.setItem('token', token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar autenticación
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

---

## 📱 PATRONES ESPECÍFICOS DE REACT NATIVE

### **1. Gestión de Estado en React Native**
```tsx
// 🎯 Estado Global con Zustand para React Native
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppStore {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'es',
      notifications: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({ 
        notifications: !state.notifications 
      })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### **2. Navegación Moderna con React Navigation v6**
```tsx
// 🎯 Navegación Tipada y Moderna
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
  Chat: { roomId: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 34,
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Inicio',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={({ route }) => ({
            title: `Perfil de ${route.params.userId}`,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### **3. Hooks Personalizados para React Native**
```tsx
// 🎯 Hook para Permisos
const usePermissions = () => {
  const [permissions, setPermissions] = useState({});

  const requestPermission = useCallback(async (permission) => {
    try {
      const result = await request(permission);
      setPermissions(prev => ({ ...prev, [permission]: result }));
      return result;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return 'denied';
    }
  }, []);

  return { permissions, requestPermission };
};

// Hook para Geolocalización
const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return { location, error, getCurrentLocation };
};

// Hook para Notificaciones
const useNotifications = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        setToken(fcmToken);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    getToken();
  }, []);

  const sendNotification = useCallback(async (title, body) => {
    try {
      await PushNotification.localNotification({
        title,
        body,
        playSound: true,
        soundName: 'default',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, []);

  return { token, sendNotification };
};
```

---

## 🧪 TESTING MODERNO

### **1. Testing con React Testing Library**
```tsx
// 🎯 Testing Moderno y Completo
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithClient = (component) => {
  const testQueryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>
        {component}
      </QueryClientProvider>
    ),
    testQueryClient,
  };
};

describe('UserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display user information', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    renderWithClient(<UserProfile userId={1} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('should handle update profile', async () => {
    const { user } = renderWithClient(<UserProfile userId={1} />);

    const nameInput = screen.getByLabelText('Name');
    const updateButton = screen.getByText('Update');

    await user.type(nameInput, 'Jane Doe');
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Profile updated!')).toBeInTheDocument();
    });
  });
});
```

### **2. Testing de Hooks Personalizados**
```tsx
// 🎯 Testing de Hooks
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('should reset counter', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(0);
  });
});
```

---

## 🚀 PATRONES DE DESPLIEGUE MODERNO

### **1. CI/CD con GitHub Actions**
```yaml
# 🎯 GitHub Actions para React Native
name: React Native CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '11'
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Android APK
        run: |
          cd android
          ./gradlew assembleRelease
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/
```

### **2. Code Push para Actualizaciones OTA**
```tsx
// 🎯 Configuración de Code Push
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    title: 'Actualización disponible',
    mandatoryUpdateMessage: 'Una actualización obligatoria está disponible.',
    mandatoryContinueButtonLabel: 'Actualizar',
    optionalUpdateMessage: 'Una actualización opcional está disponible.',
    optionalIgnoreButtonLabel: 'Más tarde',
    optionalInstallButtonLabel: 'Actualizar',
  },
};

const App = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    codePush.checkForUpdate().then((update) => {
      if (update) {
        setUpdateAvailable(true);
      }
    });
  }, []);

  return (
    <div>
      {updateAvailable && (
        <div className="update-banner">
          <p>Nueva actualización disponible</p>
          <button onClick={() => codePush.sync()}>
            Actualizar ahora
          </button>
        </div>
      )}
      {/* Resto de la app */}
    </div>
  );
};

export default codePush(codePushOptions)(App);
```

---

## 📊 MONITOREO Y ANALÍTICAS

### **1. Error Tracking con Sentry**
```tsx
// 🎯 Configuración de Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
  enableAutoSessionTracking: true,
  debug: __DEV__,
  beforeSend(event) {
    // Filtrar eventos sensibles
    if (event.user?.email) {
      delete event.user.email;
    }
    return event;
  },
});

// Error Boundary con Sentry
const SentryErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: (error, componentStack, eventId) => (
    <div className="error-boundary">
      <h2>Algo salió mal</h2>
      <p>Error ID: {eventId}</p>
      <button onClick={() => window.location.reload()}>
        Recargar página
      </button>
    </div>
  ),
});
```

### **2. Analytics con Firebase**
```tsx
// 🎯 Analytics Moderno
import analytics from '@react-native-firebase/analytics';

const useAnalytics = () => {
  const logEvent = useCallback((eventName, parameters = {}) => {
    analytics().logEvent(eventName, parameters);
  }, []);

  const setUserProperties = useCallback((properties) => {
    analytics().setUserProperties(properties);
  }, []);

  const setCurrentScreen = useCallback((screenName) => {
    analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  }, []);

  return { logEvent, setUserProperties, setCurrentScreen };
};

// Uso en componentes
const ProductScreen = () => {
  const { logEvent, setCurrentScreen } = useAnalytics();

  useEffect(() => {
    setCurrentScreen('ProductScreen');
  }, [setCurrentScreen]);

  const handlePurchase = (productId, price) => {
    logEvent('purchase', {
      product_id: productId,
      price: price,
      currency: 'USD',
    });
  };

  return (
    <div>
      <button onClick={() => handlePurchase('prod_123', 29.99)}>
        Comprar
      </button>
    </div>
  );
};
```

---

## 🎯 RESUMEN DE MEJORES PRÁCTICAS

### **✅ Patrones Recomendados:**
1. **Compound Components** - Para componentes reutilizables
2. **Custom Hooks** - Para lógica reutilizable
3. **Zustand** - Para estado global simple
4. **React Query** - Para estado del servidor
5. **Error Boundaries** - Para manejo de errores
6. **Code Splitting** - Para optimización
7. **Testing Moderno** - Para calidad de código

### **✅ Optimizaciones Clave:**
1. **React.memo** - Para evitar re-renders innecesarios
2. **useMemo/useCallback** - Para memoización
3. **Virtual Scrolling** - Para listas grandes
4. **Lazy Loading** - Para carga progresiva
5. **Bundle Splitting** - Para reducir tamaño inicial

### **✅ Seguridad:**
1. **Error Boundaries** - Para capturar errores
2. **Input Validation** - Para validar datos
3. **Authentication** - Para autenticación segura
4. **HTTPS** - Para comunicación segura
5. **Code Obfuscation** - Para proteger código

### **✅ Monitoreo:**
1. **Error Tracking** - Para detectar errores
2. **Performance Monitoring** - Para optimizar rendimiento
3. **Analytics** - Para entender usuarios
4. **Logging** - Para debugging
5. **Health Checks** - Para verificar estado

---

*¡Estos patrones y mejores prácticas te ayudarán a crear aplicaciones React y React Native modernas, escalables y mantenibles!* 🚀✨ 