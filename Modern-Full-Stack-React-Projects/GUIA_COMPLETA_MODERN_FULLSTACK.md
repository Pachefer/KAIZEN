# 🚀 GUÍA COMPLETA MODERN FULL STACK REACT PROJECTS
## Integración de Conceptos Avanzados y Proyectos Modernos

---

## 📋 **INTRODUCCIÓN A LA GUÍA COMPLETA**

Esta guía integra todos los conceptos avanzados desarrollados para complementar el curso "Modern Full Stack React Projects" de 19 capítulos, incluyendo patrones de diseño, arquitectura moderna, despliegue y mejores prácticas para aplicaciones full stack contemporáneas.

### **🎯 Contenido Integrado:**
- **Arquitectura Moderna** - MERN Stack, GraphQL, Server Components
- **Patrones de Diseño** - SOLID, Clean Architecture, Event-Driven
- **Despliegue Moderno** - Docker, CI/CD, Cloud Platforms
- **Mejores Prácticas** - Testing, Performance, SEO
- **Tecnologías Modernas** - Next.js, Socket.IO, Apollo Client
- **DevOps Completo** - CI/CD, Monitoreo, Logging

---

## 🏗️ **ARQUITECTURA MODERNA FULL STACK**

### **1. Estructura de Proyecto Moderna**

```typescript
// Estructura recomendada para aplicaciones modernas
/*
modern-fullstack-app/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services (REST/GraphQL)
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilidades
│   │   ├── pages/         # Páginas de la aplicación
│   │   └── context/       # Context providers
│   ├── public/
│   └── package.json
├── server/                 # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas API
│   │   ├── middleware/    # Middleware personalizado
│   │   ├── services/      # Lógica de negocio
│   │   ├── types/         # TypeScript types
│   │   ├── graphql/       # Schema y resolvers GraphQL
│   │   └── socket/        # Socket.IO handlers
│   └── package.json
├── shared/                 # Tipos compartidos
│   └── types/
├── docker/                 # Configuración Docker
├── k8s/                    # Configuración Kubernetes
├── tests/                  # Tests E2E con Playwright
└── docs/                   # Documentación
*/
```

### **2. Configuración de Tipos Compartidos Modernos**

```typescript
// shared/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para GraphQL
export interface GraphQLContext {
  user?: User;
  isAuthenticated: boolean;
}

// Tipos para Socket.IO
export interface SocketEvents {
  'message:send': (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  'message:received': (message: ChatMessage) => void;
  'user:join': (roomId: string) => void;
  'user:leave': (roomId: string) => void;
}
```

---

## 🎯 **PRINCIPIOS SOLID EN PROYECTOS MODERNOS**

### **1. Single Responsibility Principle (SRP)**

```typescript
// ✅ Separación de responsabilidades en aplicaciones modernas

// Hook para gestión de posts (Responsabilidad: Estado de posts)
const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      const newPost = await response.json();
      setPosts(prev => [...prev, newPost]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { posts, loading, error, fetchPosts, createPost };
};

// Hook para gestión de autenticación (Responsabilidad: Estado de autenticación)
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  return { user, loading, login, logout };
};

// Hook para gestión de chat (Responsabilidad: Estado de chat)
const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('/chat');
    setSocket(newSocket);

    newSocket.on('message:received', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = useCallback((content: string, roomId: string) => {
    if (socket) {
      socket.emit('message:send', { content, roomId });
    }
  }, [socket]);

  return { messages, sendMessage };
};
```

### **2. Open/Closed Principle (OCP)**

```typescript
// ✅ Extensible sin modificación

// Interfaz para estrategias de renderizado
interface RenderStrategy {
  render(component: React.ReactNode): React.ReactNode;
}

// Estrategia de renderizado del lado del cliente
class ClientSideRenderStrategy implements RenderStrategy {
  render(component: React.ReactNode): React.ReactNode {
    return <ClientOnly>{component}</ClientOnly>;
  }
}

// Estrategia de renderizado del lado del servidor
class ServerSideRenderStrategy implements RenderStrategy {
  render(component: React.ReactNode): React.ReactNode {
    return <ServerOnly>{component}</ServerOnly>;
  }
}

// Estrategia de renderizado híbrido
class HybridRenderStrategy implements RenderStrategy {
  render(component: React.ReactNode): React.ReactNode {
    return (
      <div>
        <ServerOnly>{component}</ServerOnly>
        <ClientOnly>{component}</ClientOnly>
      </div>
    );
  }
}

// Componente que usa estrategias de renderizado
const RenderableComponent: React.FC<{
  strategy: RenderStrategy;
  children: React.ReactNode;
}> = ({ strategy, children }) => {
  return <>{strategy.render(children)}</>;
};

// Uso
const clientStrategy = new ClientSideRenderStrategy();
const serverStrategy = new ServerSideRenderStrategy();
const hybridStrategy = new HybridRenderStrategy();

<RenderableComponent strategy={clientStrategy}>
  <DynamicContent />
</RenderableComponent>
```

---

## 🏗️ **ARQUITECTURA CLEAN ARCHITECTURE MODERNA**

### **1. Estructura de Capas Moderna**

```typescript
// Domain Layer (Entidades y reglas de negocio)
interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive(): boolean;
  canPerformAction(action: string): boolean;
  updateProfile(updates: Partial<IUser>): void;
}

class User implements IUser {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: UserRole,
    private active: boolean = true,
    private avatar?: string
  ) {}

  isActive(): boolean {
    return this.active;
  }

  canPerformAction(action: string): boolean {
    if (!this.isActive()) return false;
    
    const permissions = {
      'user': ['read:own', 'write:own', 'comment:own'],
      'admin': ['read:all', 'write:all', 'delete:all', 'moderate:all']
    };
    
    return permissions[this.role]?.includes(action) || false;
  }

  updateProfile(updates: Partial<IUser>): void {
    if (updates.name) this.name = updates.name;
    if (updates.avatar) this.avatar = updates.avatar;
    if (updates.role) this.role = updates.role;
  }
}

// Repository Layer (Interfaces de acceso a datos)
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findWithPosts(id: string): Promise<User | null>;
}

// Use Case Layer (Casos de uso de la aplicación)
class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private emailValidator: IEmailValidator,
    private eventBus: IEventBus
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Validar email
    if (!this.emailValidator.isValid(request.email)) {
      throw new ValidationError('Email inválido');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new BusinessError('Usuario ya existe');
    }

    // Hash de contraseña
    const hashedPassword = await this.passwordHasher.hash(request.password);

    // Crear usuario
    const user = new User(
      generateId(),
      request.email,
      request.name,
      'user'
    );

    const savedUser = await this.userRepository.create(user);
    
    // Publicar evento
    await this.eventBus.publish('user.created', {
      userId: savedUser.id,
      email: savedUser.email,
      timestamp: new Date()
    });
    
    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role
    };
  }
}

// Infrastructure Layer (Implementaciones concretas)
class MongoUserRepository implements IUserRepository {
  constructor(private mongoClient: MongoClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.mongoClient
      .db('modern-app')
      .collection('users')
      .findOne({ _id: new ObjectId(id) });
    
    return user ? this.mapToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.mongoClient
      .db('modern-app')
      .collection('users')
      .findOne({ email });
    
    return user ? this.mapToUser(user) : null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const result = await this.mongoClient
      .db('modern-app')
      .collection('users')
      .insertOne({
        email: user.email,
        name: user.name,
        role: user.role,
        active: true,
        avatar: user.avatar,
        createdAt: new Date(),
        updatedAt: new Date()
      });

    return new User(
      result.insertedId.toString(),
      user.email,
      user.name,
      user.role,
      true,
      user.avatar
    );
  }

  private mapToUser(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.name,
      doc.role,
      doc.active,
      doc.avatar
    );
  }
}
```

---

## 🐳 **DOCKER Y KUBERNETES PARA PROYECTOS MODERNOS**

### **1. Docker Compose para Desarrollo Moderno**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  # Redis para caché y sesiones
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # Backend API
  server:
    build: 
      context: ./server
      dockerfile: Dockerfile.dev
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://admin:password@mongodb:27017/modern-app?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-dev-secret-key
      CLIENT_URL: http://localhost:3000
      GRAPHQL_PATH: /graphql
    volumes:
      - ./server:/app
      - /app/node_modules
    depends_on:
      - mongodb
      - redis
    networks:
      - app-network
    command: npm run dev

  # Frontend React
  client:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:5000/api
      VITE_GRAPHQL_URL: http://localhost:5000/graphql
      VITE_SOCKET_URL: http://localhost:5000
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server
    networks:
      - app-network
    command: npm run dev

  # Next.js App (si aplica)
  nextjs:
    build:
      context: ./nextjs-app
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: mongodb://admin:password@mongodb:27017/modern-app?authSource=admin
      NEXTAUTH_SECRET: your-nextauth-secret
    volumes:
      - ./nextjs-app:/app
      - /app/node_modules
    depends_on:
      - mongodb
    networks:
      - app-network
    command: npm run dev

  # Nginx para producción
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - client
      - server
    networks:
      - app-network

volumes:
  mongodb_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### **2. Dockerfile para Backend Moderno**

```dockerfile
# server/Dockerfile
FROM node:20-alpine as builder

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
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar propiedad de archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Comando de inicio
CMD ["npm", "start"]
```

### **3. Dockerfile para Frontend Moderno con Vite**

```dockerfile
# client/Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY vite.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 **TESTING AVANZADO PARA PROYECTOS MODERNOS**

### **1. Testing de Backend con Jest**

```typescript
// server/src/__tests__/userService.test.ts
import { UserService } from '../services/UserService';
import { MockUserRepository } from '../__mocks__/UserRepository';
import { MockPasswordHasher } from '../__mocks__/PasswordHasher';
import { MockEventBus } from '../__mocks__/EventBus';
import { User } from '../domain/User';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;
  let mockPasswordHasher: MockPasswordHasher;
  let mockEventBus: MockEventBus;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockPasswordHasher = new MockPasswordHasher();
    mockEventBus = new MockEventBus();
    userService = new UserService(
      mockUserRepository, 
      mockPasswordHasher, 
      mockEventBus
    );
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(
        new User('1', userData.email, userData.name, 'user')
      );

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword'
      });
      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(mockEventBus.publish).toHaveBeenCalledWith('user.created', {
        userId: '1',
        email: userData.email,
        timestamp: expect.any(Date)
      });
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(
        new User('1', userData.email, userData.name, 'user')
      );

      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Usuario ya existe');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      const user = new User('1', email, 'Test User', 'user');
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockPasswordHasher.compare.mockResolvedValue(true);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockPasswordHasher.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result.user).toBe(user);
      expect(result.token).toBeDefined();
    });

    it('should throw error with invalid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.authenticateUser(email, password))
        .rejects
        .toThrow('Credenciales inválidas');
    });
  });
});
```

### **2. Testing de Frontend con React Testing Library**

```typescript
// client/src/__tests__/components/UserForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../UserForm';
import { UserService } from '../../services/UserService';

// Mock del servicio
jest.mock('../../services/UserService');
const mockUserService = UserService as jest.MockedClass<typeof UserService>;

describe('UserForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Enviar formulario
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));

    // Verificar que se llamó onSubmit
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });
  });

  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Intentar enviar formulario vacío
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));

    // Verificar errores de validación
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Ingresar email inválido
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /crear usuario/i }));

    // Verificar error de email
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
});
```

### **3. Testing E2E con Playwright**

```typescript
// tests/e2e/user-authentication.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should register a new user successfully', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('/register');

    // Llenar formulario de registro
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');

    // Enviar formulario
    await page.click('[data-testid="register-button"]');

    // Verificar redirección al dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('John Doe');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');

    // Llenar formulario de login
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');

    // Enviar formulario
    await page.click('[data-testid="login-button"]');

    // Verificar redirección al dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');

    // Llenar formulario con credenciales inválidas
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');

    // Enviar formulario
    await page.click('[data-testid="login-button"]');

    // Verificar mensaje de error
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Credenciales inválidas');
  });

  test('should logout successfully', async ({ page }) => {
    // Login primero
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verificar que estamos en el dashboard
    await expect(page).toHaveURL('/dashboard');

    // Hacer logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // Verificar redirección al login
    await expect(page).toHaveURL('/login');
  });
});
```

---

## 🚀 **DESPLIEGUE EN LA NUBE PARA PROYECTOS MODERNOS**

### **1. Kubernetes para Aplicación Moderna**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: modern-fullstack-app
```

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: modern-fullstack-app
data:
  NODE_ENV: "production"
  CLIENT_URL: "https://app.example.com"
  MONGODB_URI: "mongodb://mongodb-service:27017/modern-app"
  REDIS_URL: "redis://redis-service:6379"
  GRAPHQL_PATH: "/graphql"
  SOCKET_PATH: "/socket.io"
```

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: modern-fullstack-app
type: Opaque
data:
  JWT_SECRET: eW91ci1zZWNyZXQta2V5 # base64 encoded
  MONGODB_PASSWORD: cGFzc3dvcmQ= # base64 encoded
  NEXTAUTH_SECRET: bmV4dGF1dGgtc2VjcmV0 # base64 encoded
```

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: modern-fullstack-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/modern-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        - name: MONGODB_URI
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: MONGODB_URI
        - name: GRAPHQL_PATH
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: GRAPHQL_PATH
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

### **2. CI/CD Pipeline Moderno**

```yaml
# .github/workflows/modern-fullstack-deploy.yml
name: Modern Full Stack Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: server/package-lock.json
    
    - name: Install backend dependencies
      run: cd server && npm ci
    
    - name: Run backend tests
      run: cd server && npm test
    
    - name: Run backend linting
      run: cd server && npm run lint

  test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: client/package-lock.json
    
    - name: Install frontend dependencies
      run: cd client && npm ci
    
    - name: Run frontend tests
      run: cd client && npm test
    
    - name: Run frontend linting
      run: cd client && npm run lint

  test-e2e:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: tests/package-lock.json
    
    - name: Install Playwright
      run: cd tests && npm ci
    
    - name: Run E2E tests
      run: cd tests && npm run test:e2e

  build-and-deploy:
    needs: [test-backend, test-frontend, test-e2e]
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
    
    - name: Build and push backend
      uses: docker/build-push-action@v4
      with:
        context: ./server
        file: ./server/Dockerfile
        push: true
        tags: your-username/modern-backend:latest
    
    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./client
        file: ./client/Dockerfile
        push: true
        tags: your-username/modern-frontend:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: apply -f k8s/
```

---

## 🎯 **MEJORES PRÁCTICAS PARA PROYECTOS MODERNOS**

### **1. Seguridad Avanzada**

```typescript
// server/src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Express } from 'express';

export const configureSecurity = (app: Express) => {
  // Helmet para headers de seguridad
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: 'Demasiadas requests desde esta IP',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // CORS configurado
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Sanitización de datos
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

// Middleware de autenticación
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware de autorización
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    next();
  };
};
```

### **2. Performance Optimization**

```typescript
// server/src/middleware/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheMiddleware = (duration: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Interceptar la respuesta
      const originalSend = res.json;
      res.json = function(data) {
        redis.setex(key, duration, JSON.stringify(data));
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

// server/src/middleware/compression.ts
import compression from 'compression';

export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
});
```

---

*¡Esta guía completa integra todos los conceptos avanzados para crear aplicaciones full stack modernas y profesionales!* 🚀✨ 