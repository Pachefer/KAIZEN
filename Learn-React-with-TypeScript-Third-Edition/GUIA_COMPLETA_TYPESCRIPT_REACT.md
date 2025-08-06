# 🚀 GUÍA COMPLETA REACT CON TYPESCRIPT
## Integración de Conceptos Avanzados y Mejores Prácticas

---

## 📋 **INTRODUCCIÓN A LA GUÍA COMPLETA**

Esta guía integra todos los conceptos avanzados desarrollados para complementar el curso "Learn React with TypeScript" de 12 capítulos, incluyendo patrones de diseño, arquitectura, despliegue y mejores prácticas.

### **🎯 Contenido Integrado:**
- **Patrones de Diseño Modernos** - SOLID, Componentes Reutilizables
- **Arquitectura Full Stack** - MERN, Microservicios
- **Despliegue en la Nube** - Docker, Kubernetes, Cloud Platforms
- **Mejores Prácticas** - Testing, Performance, Seguridad
- **TypeScript Avanzado** - Tipos, Interfaces, Generics

---

## 🎯 **PRINCIPIOS SOLID EN REACT CON TYPESCRIPT**

### **1. Single Responsibility Principle (SRP)**

```typescript
// ✅ Separación de responsabilidades con TypeScript

// Hook para gestión de usuarios
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const useUsers = (): UserState & {
  fetchUsers: () => Promise<void>;
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
} => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id'>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const newUser = await response.json();
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedUser = await response.json();
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
};

// Componente para mostrar lista de usuarios
const UserList: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

// Componente para formulario de usuario
const UserForm: React.FC<{ onSubmit: (user: Omit<User, 'id'>) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'user'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Nombre"
      />
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
      />
      <select
        value={formData.role}
        onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
      >
        <option value="user">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit">Crear Usuario</button>
    </form>
  );
};
```

### **2. Open/Closed Principle (OCP)**

```typescript
// ✅ Extensible sin modificación

// Configuración de temas
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

const themeConfigs: Record<string, ThemeConfig> = {
  light: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      text: '#000000'
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    typography: {
      fontFamily: 'System, -apple-system, sans-serif',
      fontSize: {
        small: '14px',
        medium: '16px',
        large: '20px'
      }
    }
  },
  dark: {
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      text: '#FFFFFF'
    },
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    },
    typography: {
      fontFamily: 'System, -apple-system, sans-serif',
      fontSize: {
        small: '14px',
        medium: '16px',
        large: '20px'
      }
    }
  }
};

// Hook para gestión de tema
const useTheme = (themeName: string = 'light') => {
  const theme = themeConfigs[themeName] || themeConfigs.light;
  
  return {
    theme,
    setTheme: (newTheme: string) => {
      // Lógica para cambiar tema
    }
  };
};

// Componente de botón extensible
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false
}) => {
  const { theme } = useTheme();
  
  const getButtonStyles = () => {
    const baseStyles = {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize[size],
      padding: theme.spacing[size],
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease'
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary,
          color: '#FFFFFF'
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.secondary,
          color: '#FFFFFF'
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `2px solid ${theme.colors.primary}`
        };
      default:
        return baseStyles;
    }
  };

  return (
    <button
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

---

## 🏗️ **ARQUITECTURA FULL STACK CON TYPESCRIPT**

### **1. Configuración de Proyecto MERN con TypeScript**

```typescript
// shared/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

// shared/constants/index.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  AUTH: '/api/auth'
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;
```

### **2. Backend con Express y TypeScript**

```typescript
// server/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);

// server/src/controllers/UserController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth';
import { generateToken } from '../utils/jwt';

export class UserController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'El usuario ya existe' });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      await user.save();

      const token = generateToken(user._id);
      res.status(201).json({
        message: 'Usuario creado exitosamente',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  }
}
```

### **3. Frontend con React y TypeScript**

```typescript
// client/src/services/api.ts
import { User, Product, Order } from '../../shared/types';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users');
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/api/orders');
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const apiService = new ApiService();
```

---

## 🐳 **DOCKER Y KUBERNETES CON TYPESCRIPT**

### **1. Dockerfile para Aplicación TypeScript**

```dockerfile
# Dockerfile para backend TypeScript
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile para frontend TypeScript
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### **2. Kubernetes con TypeScript**

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: typescript-backend
  namespace: mern-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: typescript-backend
  template:
    metadata:
      labels:
        app: typescript-backend
    spec:
      containers:
      - name: backend
        image: your-registry/typescript-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## 🧪 **TESTING AVANZADO CON TYPESCRIPT**

### **1. Testing de Componentes**

```typescript
// client/src/components/__tests__/UserList.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserList } from '../UserList';
import { User } from '../../../shared/types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockApiService = {
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

jest.mock('../../services/api', () => ({
  apiService: mockApiService
}));

const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithClient = (component: React.ReactElement) => {
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

describe('UserList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display users when data is loaded', async () => {
    mockApiService.getUsers.mockResolvedValue(mockUsers);

    renderWithClient(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    mockApiService.getUsers.mockImplementation(() => new Promise(() => {}));

    renderWithClient(<UserList />);

    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    mockApiService.getUsers.mockRejectedValue(new Error('Network error'));

    renderWithClient(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
```

### **2. Testing de Hooks**

```typescript
// client/src/hooks/__tests__/useUsers.test.ts
import { renderHook, act } from '@testing-library/react';
import { useUsers } from '../useUsers';
import { User } from '../../../shared/types';

const mockApiService = {
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

jest.mock('../../services/api', () => ({
  apiService: mockApiService
}));

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users successfully', async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockApiService.getUsers.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual([]);

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it('should handle error when fetching users fails', async () => {
    const errorMessage = 'Network error';
    mockApiService.getUsers.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.users).toEqual([]);
  });

  it('should create user successfully', async () => {
    const newUser = {
      name: 'New User',
      email: 'new@example.com',
      role: 'user' as const
    };

    const createdUser: User = {
      id: '3',
      ...newUser,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockApiService.createUser.mockResolvedValue(createdUser);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.createUser(newUser);
    });

    expect(mockApiService.createUser).toHaveBeenCalledWith(newUser);
    expect(result.current.users).toContainEqual(createdUser);
  });
});
```

---

## 🚀 **DESPLIEGUE EN LA NUBE CON TYPESCRIPT**

### **1. Azure DevOps Pipeline**

```yaml
# azure-pipelines.yml
trigger:
- main

variables:
  dockerRegistryServiceConnection: 'your-acr-service-connection'
  imageRepository: 'typescript-backend'
  containerRegistry: 'your-registry.azurecr.io'
  dockerfilePath: '**/Dockerfile'
  tag: '$(Build.BuildId)'

stages:
- stage: Test
  displayName: 'Test'
  jobs:
  - job: Test
    displayName: 'Run Tests'
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'
    
    - script: |
        npm ci
        npm run test
        npm run test:coverage
      displayName: 'Run Tests'
    
    - task: PublishTestResults@2
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: '**/test-results.xml'
        mergeTestResults: true
        testRunTitle: 'TypeScript React Tests'

- stage: Build
  displayName: 'Build and Push'
  dependsOn: Test
  jobs:
  - job: Build
    displayName: 'Build'
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: Docker@2
      displayName: 'Build and push TypeScript backend'
      inputs:
        command: 'buildAndPush'
        repository: '$(imageRepository)'
        dockerfile: '$(dockerfilePath)'
        containerRegistry: '$(dockerRegistryServiceConnection)'
        tags: |
          $(tag)
          latest

- stage: Deploy
  displayName: 'Deploy to AKS'
  dependsOn: Build
  jobs:
  - deployment: Deploy
    displayName: 'Deploy to AKS'
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: KubernetesManifest@0
            displayName: 'Deploy TypeScript backend'
            inputs:
              action: 'deploy'
              kubernetesServiceConnection: 'your-aks-service-connection'
              namespace: 'mern-app'
              manifests: 'k8s/*.yaml'
              containers: '$(containerRegistry)/$(imageRepository):$(tag)'
```

### **2. GitHub Actions para TypeScript**

```yaml
# .github/workflows/typescript-deploy.yml
name: TypeScript React Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript compilation
      run: npm run build
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push TypeScript backend
      uses: docker/build-push-action@v4
      with:
        context: ./server
        file: ./server/Dockerfile
        push: true
        tags: your-username/typescript-backend:latest
    
    - name: Build and push TypeScript frontend
      uses: docker/build-push-action@v4
      with:
        context: ./client
        file: ./client/Dockerfile
        push: true
        tags: your-username/typescript-frontend:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: apply -f k8s/
```

---

## 🎯 **MEJORES PRÁCTICAS TYPESCRIPT**

### **1. Tipos Avanzados**

```typescript
// Tipos utilitarios
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Tipos para formularios
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Hook para formularios tipados
const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setFieldValue = useCallback(<K extends keyof T>(
    field: K,
    value: T[K]
  ) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldError = useCallback(<K extends keyof T>(
    field: K,
    error: string
  ) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback(<K extends keyof T>(
    field: K,
    touched: boolean = true
  ) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void>
  ) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [values]);

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleSubmit,
    isValid: Object.keys(errors).length === 0,
    isDirty: Object.keys(touched).length > 0
  };
};
```

### **2. Generics Avanzados**

```typescript
// Componente genérico para listas
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
}

const List = <T,>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No hay elementos',
  loading = false,
  error
}: ListProps<T>) => {
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (items.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

// Hook genérico para datos
interface UseDataOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
}

const useData = <T,>(
  fetchFn: () => Promise<T>,
  options: UseDataOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, options]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options.enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
```

---

*¡Esta guía completa integra todos los conceptos avanzados para crear aplicaciones React con TypeScript de nivel profesional!* 🚀✨ 