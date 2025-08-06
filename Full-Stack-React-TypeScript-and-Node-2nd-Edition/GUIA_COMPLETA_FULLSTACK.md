# 🚀 GUÍA COMPLETA FULL STACK REACT TYPESCRIPT AND NODE
## Integración de Conceptos Avanzados y Arquitectura Completa

---

## 📋 **INTRODUCCIÓN A LA GUÍA COMPLETA**

Esta guía integra todos los conceptos avanzados desarrollados para complementar el curso "Full Stack React TypeScript and Node" de 10 capítulos, incluyendo patrones de diseño, arquitectura, despliegue y mejores prácticas para aplicaciones full stack.

### **🎯 Contenido Integrado:**
- **Arquitectura Full Stack** - Frontend, Backend, Base de Datos
- **Patrones de Diseño** - SOLID, Clean Architecture
- **Despliegue en la Nube** - Docker, Kubernetes, Cloud Platforms
- **Mejores Prácticas** - Testing, Performance, Seguridad
- **TypeScript Avanzado** - Tipos, Interfaces, Generics
- **DevOps Completo** - CI/CD, Monitoreo, Logging

---

## 🏗️ **ARQUITECTURA FULL STACK AVANZADA**

### **1. Estructura de Proyecto Completa**

```typescript
// Estructura recomendada para aplicaciones full stack
/*
fullstack-app/
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilidades
│   │   └── pages/         # Páginas de la aplicación
│   ├── public/
│   └── package.json
├── server/                 # Backend Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas API
│   │   ├── middleware/    # Middleware personalizado
│   │   ├── services/      # Lógica de negocio
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilidades
│   └── package.json
├── shared/                 # Tipos compartidos
│   └── types/
├── docker/                 # Configuración Docker
├── k8s/                    # Configuración Kubernetes
└── docs/                   # Documentación
*/
```

### **2. Configuración de Tipos Compartidos**

```typescript
// shared/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

---

## 🎯 **PRINCIPIOS SOLID EN FULL STACK**

### **1. Single Responsibility Principle (SRP)**

```typescript
// ✅ Separación de responsabilidades en el backend

// Modelo de Usuario (Responsabilidad: Estructura de datos)
interface IUserModel {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Servicio de Usuario (Responsabilidad: Lógica de negocio)
class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(userData: Omit<IUserModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUserModel> {
    // Validaciones de negocio
    if (await this.userRepository.findByEmail(userData.email)) {
      throw new Error('Usuario ya existe');
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear usuario
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    return user;
  }

  async authenticateUser(email: string, password: string): Promise<{ user: IUserModel; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return { user, token };
  }
}

// Controlador (Responsabilidad: Manejo de HTTP)
class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: { user: { ...user, password: undefined } }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.userService.authenticateUser(email, password);
      
      res.json({
        success: true,
        data: { user: { ...user, password: undefined }, token }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error de autenticación'
      });
    }
  }
}
```

### **2. Open/Closed Principle (OCP)**

```typescript
// ✅ Extensible sin modificación

// Interfaz para estrategias de autenticación
interface IAuthStrategy {
  authenticate(credentials: any): Promise<{ user: IUserModel; token: string }>;
}

// Estrategia de autenticación local
class LocalAuthStrategy implements IAuthStrategy {
  constructor(private userService: UserService) {}

  async authenticate(credentials: { email: string; password: string }) {
    return this.userService.authenticateUser(credentials.email, credentials.password);
  }
}

// Estrategia de autenticación con Google
class GoogleAuthStrategy implements IAuthStrategy {
  async authenticate(credentials: { token: string }) {
    // Verificar token de Google
    const googleUser = await this.verifyGoogleToken(credentials.token);
    
    // Buscar o crear usuario
    let user = await this.userRepository.findByEmail(googleUser.email);
    if (!user) {
      user = await this.userRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        password: '', // No necesaria para OAuth
        role: 'user'
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return { user, token };
  }

  private async verifyGoogleToken(token: string) {
    // Implementación de verificación de Google
  }
}

// Servicio de autenticación extensible
class AuthService {
  private strategies: Map<string, IAuthStrategy> = new Map();

  registerStrategy(name: string, strategy: IAuthStrategy) {
    this.strategies.set(name, strategy);
  }

  async authenticate(strategyName: string, credentials: any) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      throw new Error(`Estrategia de autenticación '${strategyName}' no encontrada`);
    }
    return strategy.authenticate(credentials);
  }
}

// Uso
const authService = new AuthService();
authService.registerStrategy('local', new LocalAuthStrategy(userService));
authService.registerStrategy('google', new GoogleAuthStrategy());
```

---

## 🏗️ **ARQUITECTURA CLEAN ARCHITECTURE**

### **1. Estructura de Capas**

```typescript
// Domain Layer (Entidades y reglas de negocio)
interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive(): boolean;
  canPerformAction(action: string): boolean;
}

class User implements IUser {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: UserRole,
    private active: boolean = true
  ) {}

  isActive(): boolean {
    return this.active;
  }

  canPerformAction(action: string): boolean {
    if (!this.isActive()) return false;
    
    const permissions = {
      'user': ['read:own', 'write:own'],
      'admin': ['read:all', 'write:all', 'delete:all']
    };
    
    return permissions[this.role]?.includes(action) || false;
  }
}

// Repository Layer (Interfaces de acceso a datos)
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// Use Case Layer (Casos de uso de la aplicación)
class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private emailValidator: IEmailValidator
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
      .db('blog')
      .collection('users')
      .findOne({ _id: new ObjectId(id) });
    
    return user ? this.mapToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.mongoClient
      .db('blog')
      .collection('users')
      .findOne({ email });
    
    return user ? this.mapToUser(user) : null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const result = await this.mongoClient
      .db('blog')
      .collection('users')
      .insertOne({
        email: user.email,
        name: user.name,
        role: user.role,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

    return new User(
      result.insertedId.toString(),
      user.email,
      user.name,
      user.role
    );
  }

  private mapToUser(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.name,
      doc.role,
      doc.active
    );
  }
}
```

---

## 🐳 **DOCKER Y KUBERNETES PARA FULL STACK**

### **1. Docker Compose para Desarrollo**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos
  mongodb:
    image: mongo:6
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
      MONGODB_URI: mongodb://admin:password@mongodb:27017/blog?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-dev-secret-key
      CLIENT_URL: http://localhost:3000
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
      REACT_APP_API_URL: http://localhost:5000/api
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server
    networks:
      - app-network
    command: npm start

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

### **2. Dockerfile para Backend**

```dockerfile
# server/Dockerfile
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

### **3. Dockerfile para Frontend**

```dockerfile
# client/Dockerfile
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

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 **TESTING AVANZADO FULL STACK**

### **1. Testing de Backend**

```typescript
// server/src/__tests__/userService.test.ts
import { UserService } from '../services/UserService';
import { MockUserRepository } from '../__mocks__/UserRepository';
import { MockPasswordHasher } from '../__mocks__/PasswordHasher';
import { User } from '../domain/User';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;
  let mockPasswordHasher: MockPasswordHasher;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockPasswordHasher = new MockPasswordHasher();
    userService = new UserService(mockUserRepository, mockPasswordHasher);
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

### **2. Testing de Frontend**

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

---

## 🚀 **DESPLIEGUE EN LA NUBE FULL STACK**

### **1. Kubernetes para Aplicación Completa**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fullstack-app
```

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: fullstack-app
data:
  NODE_ENV: "production"
  CLIENT_URL: "https://app.example.com"
  MONGODB_URI: "mongodb://mongodb-service:27017/blog"
  REDIS_URL: "redis://redis-service:6379"
```

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: fullstack-app
type: Opaque
data:
  JWT_SECRET: eW91ci1zZWNyZXQta2V5 # base64 encoded
  MONGODB_PASSWORD: cGFzc3dvcmQ= # base64 encoded
```

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: fullstack-app
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
        image: your-registry/fullstack-backend:latest
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

```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: fullstack-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/fullstack-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "https://api.example.com"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

### **2. CI/CD Pipeline Completo**

```yaml
# .github/workflows/fullstack-deploy.yml
name: Full Stack Deploy

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
        node-version: '18'
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
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: client/package-lock.json
    
    - name: Install frontend dependencies
      run: cd client && npm ci
    
    - name: Run frontend tests
      run: cd client && npm test
    
    - name: Run frontend linting
      run: cd client && npm run lint

  build-and-deploy:
    needs: [test-backend, test-frontend]
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
        tags: your-username/fullstack-backend:latest
    
    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./client
        file: ./client/Dockerfile
        push: true
        tags: your-username/fullstack-frontend:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: apply -f k8s/
```

---

## 🎯 **MEJORES PRÁCTICAS FULL STACK**

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

*¡Esta guía completa integra todos los conceptos avanzados para crear aplicaciones full stack profesionales con React, TypeScript y Node.js!* 🚀✨ 