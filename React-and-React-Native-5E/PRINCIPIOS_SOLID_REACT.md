# 🎯 PRINCIPIOS SOLID EN REACT Y REACT NATIVE
## Guía Completa de Aplicación de Principios de Diseño

---

## 📋 **INTRODUCCIÓN A LOS PRINCIPIOS SOLID**

Los principios SOLID son fundamentales para crear código mantenible, escalable y de alta calidad. En React y React Native, estos principios nos ayudan a diseñar componentes y aplicaciones robustas.

### **¿Qué son los principios SOLID?**
- **S** - Single Responsibility Principle (Principio de Responsabilidad Única)
- **O** - Open/Closed Principle (Principio Abierto/Cerrado)
- **L** - Liskov Substitution Principle (Principio de Sustitución de Liskov)
- **I** - Interface Segregation Principle (Principio de Segregación de Interfaces)
- **D** - Dependency Inversion Principle (Principio de Inversión de Dependencias)

---

## 🎯 **S - SINGLE RESPONSIBILITY PRINCIPLE**

### **Definición:**
Una clase o componente debe tener una sola razón para cambiar, es decir, una sola responsabilidad.

### **❌ Ejemplo Incorrecto:**
```tsx
// 🚫 Componente con múltiples responsabilidades
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Responsabilidad 1: Obtener datos del usuario
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  // Responsabilidad 2: Obtener posts del usuario
  useEffect(() => {
    fetchUserPosts(userId);
  }, [userId]);

  // Responsabilidad 3: Renderizar UI
  const fetchUser = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **✅ Ejemplo Correcto:**
```tsx
// ✅ Separación de responsabilidades

// Hook para obtener datos del usuario
const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};

// Hook para obtener posts del usuario
const useUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/posts`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return { posts, loading, error };
};

// Componente para mostrar información del usuario
const UserInfo = ({ user }) => (
  <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
  </div>
);

// Componente para mostrar posts del usuario
const UserPosts = ({ posts }) => (
  <div>
    {posts.map(post => (
      <div key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
    ))}
  </div>
);

// Componente principal con responsabilidad única
const UserProfile = ({ userId }) => {
  const { user, loading: userLoading, error: userError } = useUser(userId);
  const { posts, loading: postsLoading, error: postsError } = useUserPosts(userId);

  if (userLoading || postsLoading) return <div>Cargando...</div>;
  if (userError || postsError) return <div>Error: {userError || postsError}</div>;

  return (
    <div>
      <UserInfo user={user} />
      <UserPosts posts={posts} />
    </div>
  );
};
```

### **🎯 Beneficios del SRP:**
1. **Mantenibilidad** - Cambios más fáciles de implementar
2. **Testabilidad** - Cada componente es más fácil de probar
3. **Reutilización** - Componentes más específicos y reutilizables
4. **Legibilidad** - Código más claro y comprensible

---

## 🔓 **O - OPEN/CLOSED PRINCIPLE**

### **Definición:**
Las entidades de software deben estar abiertas para extensión pero cerradas para modificación.

### **❌ Ejemplo Incorrecto:**
```tsx
// 🚫 Componente que requiere modificación para agregar nuevos tipos
const Notification = ({ type, message }) => {
  if (type === 'success') {
    return (
      <div className="notification success">
        <span>✅ {message}</span>
      </div>
    );
  }
  
  if (type === 'error') {
    return (
      <div className="notification error">
        <span>❌ {message}</span>
      </div>
    );
  }
  
  if (type === 'warning') {
    return (
      <div className="notification warning">
        <span>⚠️ {message}</span>
      </div>
    );
  }
  
  // Necesitamos modificar este componente para agregar nuevos tipos
  return null;
};
```

### **✅ Ejemplo Correcto:**
```tsx
// ✅ Extensible sin modificación

// Configuración de tipos de notificación
const notificationTypes = {
  success: {
    icon: '✅',
    className: 'success',
    color: '#4caf50'
  },
  error: {
    icon: '❌',
    className: 'error',
    color: '#f44336'
  },
  warning: {
    icon: '⚠️',
    className: 'warning',
    color: '#ff9800'
  },
  info: {
    icon: 'ℹ️',
    className: 'info',
    color: '#2196f3'
  }
};

// Componente base extensible
const Notification = ({ type, message, customConfig = {} }) => {
  const config = notificationTypes[type] || notificationTypes.info;
  const finalConfig = { ...config, ...customConfig };

  return (
    <div 
      className={`notification ${finalConfig.className}`}
      style={{ borderColor: finalConfig.color }}
    >
      <span>{finalConfig.icon} {message}</span>
    </div>
  );
};

// Uso básico
<Notification type="success" message="Operación completada" />

// Uso con configuración personalizada
<Notification 
  type="success" 
  message="Operación completada"
  customConfig={{ 
    icon: '🎉',
    color: '#9c27b0'
  }}
/>

// Agregar nuevos tipos sin modificar el componente
const extendedNotificationTypes = {
  ...notificationTypes,
  custom: {
    icon: '🚀',
    className: 'custom',
    color: '#ff5722'
  }
};
```

### **🎯 Patrón de Estrategia:**
```tsx
// ✅ Patrón de estrategia para renderizado
const renderStrategies = {
  card: (data) => <CardView data={data} />,
  list: (data) => <ListView data={data} />,
  grid: (data) => <GridView data={data} />,
  table: (data) => <TableView data={data} />
};

const DataRenderer = ({ data, renderType = 'card', customRenderer }) => {
  const renderStrategy = customRenderer || renderStrategies[renderType];
  
  if (!renderStrategy) {
    throw new Error(`Tipo de renderizado no soportado: ${renderType}`);
  }
  
  return renderStrategy(data);
};

// Uso
<DataRenderer data={users} renderType="card" />
<DataRenderer data={users} renderType="list" />
<DataRenderer 
  data={users} 
  customRenderer={(data) => <CustomView data={data} />}
/>
```

---

## 🔄 **L - LISKOV SUBSTITUTION PRINCIPLE**

### **Definición:**
Los objetos de una superclase deben poder ser reemplazados por objetos de una subclase sin afectar la funcionalidad del programa.

### **❌ Ejemplo Incorrecto:**
```tsx
// 🚫 Violación del LSP
class BaseButton {
  render() {
    return <button>Base Button</button>;
  }
}

class DisabledButton extends BaseButton {
  render() {
    // ❌ Comportamiento diferente al padre
    return <div>Button Disabled</div>;
  }
}

// Uso que puede fallar
const renderButton = (ButtonComponent) => {
  return <ButtonComponent />;
};

// Esto puede causar problemas porque DisabledButton no es un botón real
renderButton(DisabledButton);
```

### **✅ Ejemplo Correcto:**
```tsx
// ✅ Cumpliendo el LSP

// Interfaz base
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

// Componente base
const BaseButton: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  children 
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn ${disabled ? 'btn-disabled' : 'btn-active'}`}
    >
      {children}
    </button>
  );
};

// Componente que extiende correctamente
const PrimaryButton: React.FC<ButtonProps> = (props) => {
  return (
    <BaseButton 
      {...props} 
      className={`btn-primary ${props.disabled ? 'btn-disabled' : 'btn-active'}`}
    />
  );
};

// Componente que extiende correctamente
const SecondaryButton: React.FC<ButtonProps> = (props) => {
  return (
    <BaseButton 
      {...props} 
      className={`btn-secondary ${props.disabled ? 'btn-disabled' : 'btn-active'}`}
    />
  );
};

// Hook que funciona con cualquier tipo de botón
const useButtonHandler = (ButtonComponent: React.ComponentType<ButtonProps>) => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <ButtonComponent onClick={handleClick}>
      Click me
    </ButtonComponent>
  );
};

// Todos funcionan correctamente
useButtonHandler(BaseButton);
useButtonHandler(PrimaryButton);
useButtonHandler(SecondaryButton);
```

### **🎯 Ejemplo con Hooks:**
```tsx
// ✅ Hooks que cumplen LSP
interface DataFetcher {
  fetch: () => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

// Hook base
const useDataFetcher = (url: string): DataFetcher => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [url]);

  return { fetch: () => fetch(url), isLoading, error };
};

// Hook especializado que cumple LSP
const useUserFetcher = (userId: string): DataFetcher => {
  const baseFetcher = useDataFetcher(`/api/users/${userId}`);
  
  return {
    ...baseFetcher,
    fetch: async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    }
  };
};

// Hook especializado que cumple LSP
const usePostFetcher = (postId: string): DataFetcher => {
  const baseFetcher = useDataFetcher(`/api/posts/${postId}`);
  
  return {
    ...baseFetcher,
    fetch: async () => {
      const response = await fetch(`/api/posts/${postId}`);
      return response.json();
    }
  };
};

// Componente que funciona con cualquier DataFetcher
const DataDisplay = ({ fetcher }: { fetcher: DataFetcher }) => {
  const { isLoading, error } = fetcher;

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Datos cargados</div>;
};

// Todos funcionan correctamente
<DataDisplay fetcher={useUserFetcher('123')} />
<DataDisplay fetcher={usePostFetcher('456')} />
```

---

## 🎯 **I - INTERFACE SEGREGATION PRINCIPLE**

### **Definición:**
Los clientes no deben verse forzados a depender de interfaces que no utilizan.

### **❌ Ejemplo Incorrecto:**
```tsx
// 🚫 Interfaz monolítica
interface UserManager {
  createUser: (userData: any) => Promise<User>;
  updateUser: (id: string, userData: any) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => Promise<User>;
  getAllUsers: () => Promise<User[]>;
  authenticateUser: (credentials: any) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<void>;
  sendEmail: (to: string, subject: string, body: string) => Promise<void>;
  generateReport: (filters: any) => Promise<Report>;
  backupData: () => Promise<void>;
}

// Componente que solo necesita lectura
const UserList = ({ userManager }: { userManager: UserManager }) => {
  // ❌ Forzado a implementar métodos que no usa
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userManager.getAllUsers().then(setUsers);
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

### **✅ Ejemplo Correcto:**
```tsx
// ✅ Interfaces segregadas

// Interfaz para lectura de usuarios
interface UserReader {
  getUser: (id: string) => Promise<User>;
  getAllUsers: () => Promise<User[]>;
  searchUsers: (query: string) => Promise<User[]>;
}

// Interfaz para escritura de usuarios
interface UserWriter {
  createUser: (userData: any) => Promise<User>;
  updateUser: (id: string, userData: any) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

// Interfaz para autenticación
interface UserAuthenticator {
  authenticateUser: (credentials: any) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Interfaz para notificaciones
interface NotificationService {
  sendEmail: (to: string, subject: string, body: string) => Promise<void>;
  sendSMS: (to: string, message: string) => Promise<void>;
  sendPushNotification: (userId: string, notification: any) => Promise<void>;
}

// Interfaz para reportes
interface ReportGenerator {
  generateReport: (filters: any) => Promise<Report>;
  exportReport: (reportId: string, format: string) => Promise<string>;
}

// Componente que solo necesita lectura
const UserList = ({ userReader }: { userReader: UserReader }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userReader.getAllUsers().then(setUsers);
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// Componente que solo necesita escritura
const UserForm = ({ userWriter }: { userWriter: UserWriter }) => {
  const handleSubmit = async (userData) => {
    await userWriter.createUser(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
    </form>
  );
};

// Componente que solo necesita autenticación
const LoginForm = ({ authenticator }: { authenticator: UserAuthenticator }) => {
  const handleLogin = async (credentials) => {
    await authenticator.authenticateUser(credentials);
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Formulario de login */}
    </form>
  );
};
```

### **🎯 Hooks Segregados:**
```tsx
// ✅ Hooks con responsabilidades específicas

// Hook solo para lectura
const useUserReader = (userId?: string) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, users, loading, getUser, getAllUsers };
};

// Hook solo para escritura
const useUserWriter = () => {
  const [loading, setLoading] = useState(false);

  const createUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, createUser, updateUser };
};

// Hook solo para autenticación
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return { user, loading, login, logout };
};
```

---

## 🔄 **D - DEPENDENCY INVERSION PRINCIPLE**

### **Definición:**
Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.

### **❌ Ejemplo Incorrecto:**
```tsx
// 🚫 Dependencia directa de implementaciones concretas
const UserService = {
  async getUsers() {
    const response = await fetch('/api/users');
    return response.json();
  },
  
  async createUser(userData) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // ❌ Dependencia directa de UserService
    UserService.getUsers().then(setUsers);
  }, []);
  
  return (
    <div>
      {users.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};
```

### **✅ Ejemplo Correcto:**
```tsx
// ✅ Dependencia de abstracciones

// Abstracción (interfaz)
interface UserRepository {
  getUsers(): Promise<User[]>;
  createUser(userData: any): Promise<User>;
  updateUser(id: string, userData: any): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// Implementación concreta
class ApiUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }
  
  async createUser(userData: any): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
  
  async updateUser(id: string, userData: any): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
  
  async deleteUser(id: string): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
  }
}

// Implementación alternativa (para testing)
class MockUserRepository implements UserRepository {
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  async getUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
  
  async createUser(userData: any): Promise<User> {
    const newUser = { id: Date.now().toString(), ...userData };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }
  
  async updateUser(id: string, userData: any): Promise<User> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return Promise.resolve(this.users[index]);
    }
    throw new Error('User not found');
  }
  
  async deleteUser(id: string): Promise<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }
}

// Hook que depende de la abstracción
const useUsers = (userRepository: UserRepository) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userRepository.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userRepository]);

  const createUser = useCallback(async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userRepository.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userRepository]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, createUser, refetch: fetchUsers };
};

// Componente que recibe la dependencia
const UserList = ({ userRepository }: { userRepository: UserRepository }) => {
  const { users, loading, error } = useUsers(userRepository);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// Uso con diferentes implementaciones
const App = () => {
  // Para producción
  const apiRepository = new ApiUserRepository();
  
  // Para testing
  const mockRepository = new MockUserRepository();

  return (
    <div>
      <UserList userRepository={apiRepository} />
      {/* o */}
      <UserList userRepository={mockRepository} />
    </div>
  );
};
```

### **🎯 Context Provider Pattern:**
```tsx
// ✅ Provider pattern para inyección de dependencias

// Context para el repositorio
const UserRepositoryContext = createContext<UserRepository | null>(null);

// Provider
const UserRepositoryProvider: React.FC<{ 
  repository: UserRepository; 
  children: React.ReactNode; 
}> = ({ repository, children }) => {
  return (
    <UserRepositoryContext.Provider value={repository}>
      {children}
    </UserRepositoryContext.Provider>
  );
};

// Hook para usar el repositorio
const useUserRepository = () => {
  const repository = useContext(UserRepositoryContext);
  if (!repository) {
    throw new Error('useUserRepository must be used within UserRepositoryProvider');
  }
  return repository;
};

// Componente que usa la dependencia inyectada
const UserList = () => {
  const userRepository = useUserRepository();
  const { users, loading, error } = useUsers(userRepository);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// App con inyección de dependencias
const App = () => {
  const repository = new ApiUserRepository(); // o MockUserRepository

  return (
    <UserRepositoryProvider repository={repository}>
      <UserList />
    </UserRepositoryProvider>
  );
};
```

---

## 🎯 **APLICACIÓN PRÁCTICA EN REACT NATIVE**

### **✅ Ejemplo Completo con SOLID:**
```tsx
// ✅ Aplicación de todos los principios SOLID en React Native

// 1. SRP - Separación de responsabilidades
interface NavigationService {
  navigate(route: string, params?: any): void;
  goBack(): void;
  getCurrentRoute(): string;
}

interface StorageService {
  save(key: string, value: any): Promise<void>;
  load(key: string): Promise<any>;
  remove(key: string): Promise<void>;
}

interface ApiService {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete(url: string): Promise<void>;
}

// 2. OCP - Extensible sin modificación
const themeConfig = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    primaryColor: '#007AFF'
  },
  dark: {
    backgroundColor: '#000000',
    textColor: '#ffffff',
    primaryColor: '#0A84FF'
  }
};

const ThemeProvider: React.FC<{ 
  theme: keyof typeof themeConfig; 
  children: React.ReactNode; 
}> = ({ theme, children }) => {
  const themeData = themeConfig[theme];
  
  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. LSP - Sustitución correcta
interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

const BaseButton: React.FC<ButtonProps> = ({ onPress, title, disabled }) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={disabled}
    style={[styles.button, disabled && styles.buttonDisabled]}
  >
    <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton {...props} style={[styles.primaryButton, props.style]} />
);

const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <BaseButton {...props} style={[styles.secondaryButton, props.style]} />
);

// 4. ISP - Interfaces segregadas
interface UserReader {
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User>;
}

interface UserWriter {
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

interface UserAuthenticator {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}

// 5. DIP - Inversión de dependencias
const UserRepository = (apiService: ApiService, storageService: StorageService) => ({
  async getUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  },
  
  async getUser(id: string): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  },
  
  async createUser(user: User): Promise<User> {
    return apiService.post<User>('/users', user);
  },
  
  async saveUserToCache(user: User): Promise<void> {
    await storageService.save(`user_${user.id}`, user);
  }
});

// Hook que usa las abstracciones
const useUsers = (userRepository: ReturnType<typeof UserRepository>) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userRepository.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userRepository]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};

// Componente principal
const UserListScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  // Inyección de dependencias
  const apiService = new ApiServiceImpl();
  const storageService = new AsyncStorageService();
  const userRepository = UserRepository(apiService, storageService);
  
  const { users, loading, error } = useUsers(userRepository);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={{ color: theme.textColor }}>Error: {error}</Text>
        <PrimaryButton 
          title="Reintentar" 
          onPress={() => userRepository.getUsers()} 
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
            style={styles.userItem}
          >
            <Text style={{ color: theme.textColor }}>{item.name}</Text>
            <Text style={{ color: theme.textColor }}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
```

---

## 🎯 **BENEFICIOS DE APLICAR SOLID**

### **✅ Mantenibilidad:**
- Código más fácil de entender y modificar
- Cambios localizados y controlados
- Menor riesgo de introducir bugs

### **✅ Escalabilidad:**
- Fácil agregar nuevas funcionalidades
- Componentes reutilizables
- Arquitectura flexible

### **✅ Testabilidad:**
- Componentes más fáciles de probar
- Mocks y stubs simples de crear
- Cobertura de pruebas más alta

### **✅ Reutilización:**
- Componentes modulares
- Lógica de negocio separada
- Interfaces claras

### **✅ Legibilidad:**
- Código más claro y comprensible
- Responsabilidades bien definidas
- Nombres descriptivos

---

## 🚀 **MEJORES PRÁCTICAS IMPLEMENTACIÓN**

### **✅ Recomendaciones:**
1. **Empieza con SRP** - Separa responsabilidades claramente
2. **Usa interfaces** - Define contratos claros
3. **Inyecta dependencias** - Evita acoplamiento directo
4. **Testea cada principio** - Verifica que se cumplan
5. **Refactoriza gradualmente** - No reescribas todo de una vez

### **✅ Herramientas Útiles:**
- **TypeScript** - Para interfaces y tipos
- **React Context** - Para inyección de dependencias
- **Custom Hooks** - Para lógica reutilizable
- **Testing Library** - Para pruebas de componentes

---

*¡Aplicar los principios SOLID en React y React Native te ayudará a crear aplicaciones más robustas, mantenibles y escalables!* 🎯✨ 