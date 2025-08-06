# 🏗️ ARQUITECTURA FULL STACK MERN
## Patrones y Mejores Prácticas para Aplicaciones Completas

---

## 📋 **INTRODUCCIÓN A LA ARQUITECTURA MERN**

La arquitectura MERN es una de las más populares para aplicaciones full stack modernas, utilizando tecnologías JavaScript/TypeScript en toda la pila.

### **¿Qué es MERN?**
- **M** - MongoDB (Base de datos NoSQL)
- **E** - Express.js (Framework de backend)
- **R** - React (Frontend)
- **N** - Node.js (Runtime de JavaScript)

### **🎯 Ventajas de MERN:**
1. **JavaScript/TypeScript** en toda la pila
2. **Desarrollo rápido** y eficiente
3. **Comunidad grande** y activa
4. **Escalabilidad** y flexibilidad
5. **JSON nativo** en toda la aplicación

---

## 🏛️ **PATRONES DE ARQUITECTURA**

### **1. Arquitectura en Capas (Layered Architecture)**

```typescript
// 🎯 Estructura de carpetas recomendada
project/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas/views
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios de API
│   │   ├── store/         # Estado global
│   │   ├── utils/         # Utilidades
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── server/                 # Backend Node.js/Express
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos MongoDB
│   │   ├── routes/        # Rutas API
│   │   ├── middleware/    # Middleware personalizado
│   │   ├── services/      # Lógica de negocio
│   │   ├── utils/         # Utilidades
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── shared/                 # Código compartido
│   ├── types/             # Tipos compartidos
│   └── constants/         # Constantes compartidas
└── package.json
```

### **2. Patrón MVC (Model-View-Controller)**

```typescript
// 🎯 Implementación MVC en Express

// Model (MongoDB Schema)
// server/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
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
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);

// Controller (Lógica de negocio)
// server/src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth';
import { generateToken } from '../utils/jwt';

export class UserController {
  // GET /api/users
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  }

  // POST /api/users
  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Validar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Hashear contraseña
      const hashedPassword = await hashPassword(password);

      // Crear usuario
      const user = new User({
        name,
        email,
        password: hashedPassword
      });

      await user.save();

      // Generar token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  }

  // POST /api/users/login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Generar token
      const token = generateToken(user._id);

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error en el login' });
    }
  }
}

// Routes (Rutas API)
// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/register', UserController.createUser);
router.post('/login', UserController.login);

// Rutas protegidas
router.get('/', authMiddleware, UserController.getUsers);

export default router;
```

---

## 🔧 **BACKEND - EXPRESS.JS Y NODE.JS**

### **1. Configuración del Servidor**

```typescript
// server/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar rutas
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
```

### **2. Conexión a MongoDB**

```typescript
// server/src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-app';
    
    await mongoose.connect(mongoURI, {
      // Opciones de conexión
    });

    console.log('✅ MongoDB conectado exitosamente');

    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    // Manejar cierre graceful
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexión a MongoDB cerrada');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### **3. Middleware de Autenticación**

```typescript
// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Token no proporcionado' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware de roles
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Acceso denegado' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Permisos insuficientes' });
      return;
    }

    next();
  };
};
```

### **4. Servicios de Negocio**

```typescript
// server/src/services/userService.ts
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth';
import { generateToken } from '../utils/jwt';

export class UserService {
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const { name, email, password } = userData;

    // Validar email único
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generar token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  static async authenticateUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  static async getUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}
```

---

## ⚛️ **FRONTEND - REACT**

### **1. Configuración de la Aplicación**

```typescript
// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Componentes
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### **2. Context de Autenticación**

```typescript
// client/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer para manejar el estado
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  });

  // Verificar token al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const user = await authService.getCurrentUser();
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user, token } 
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ 
            type: 'AUTH_FAILURE', 
            payload: 'Sesión expirada' 
          });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { user, token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { user, token } = await authService.register(name, email, password);
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### **3. Servicios de API**

```typescript
// client/src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();
```

```typescript
// client/src/services/authService.ts
import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/users/login', credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/users/register', data);
  }

  async getCurrentUser() {
    return apiService.get('/users/me');
  }

  async updateProfile(data: Partial<RegisterData>) {
    return apiService.put('/users/profile', data);
  }
}

export const authService = new AuthService();
```

### **4. Custom Hooks para API**

```typescript
// client/src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    payload?: any
  ) => {
    try {
      setLoading(true);
      setError(null);

      let result: T;
      switch (method) {
        case 'get':
          result = await apiService.get<T>(url);
          break;
        case 'post':
          result = await apiService.post<T>(url, payload);
          break;
        case 'put':
          result = await apiService.put<T>(url, payload);
          break;
        case 'delete':
          result = await apiService.delete<T>(url);
          break;
        default:
          throw new Error('Método no soportado');
      }

      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}
```

---

## 🔄 **COMUNICACIÓN CLIENTE-SERVIDOR**

### **1. WebSocket para Tiempo Real**

```typescript
// server/src/services/websocketService.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

export class WebSocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Middleware de autenticación
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token no proporcionado'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.data.userId = decoded.userId;
        next();
      } catch (error) {
        next(new Error('Token inválido'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.data.userId}`);

      // Unirse a sala personal
      socket.join(`user_${socket.data.userId}`);

      // Manejar mensajes privados
      socket.on('send_message', (data) => {
        this.handlePrivateMessage(socket, data);
      });

      // Manejar notificaciones
      socket.on('send_notification', (data) => {
        this.handleNotification(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.data.userId}`);
      });
    });
  }

  private handlePrivateMessage(socket: any, data: any) {
    const { recipientId, message } = data;
    
    // Enviar mensaje al destinatario
    this.io.to(`user_${recipientId}`).emit('new_message', {
      senderId: socket.data.userId,
      message,
      timestamp: new Date()
    });
  }

  private handleNotification(socket: any, data: any) {
    const { recipientId, notification } = data;
    
    this.io.to(`user_${recipientId}`).emit('new_notification', {
      ...notification,
      timestamp: new Date()
    });
  }

  // Método para enviar notificaciones desde el servidor
  public sendNotification(userId: string, notification: any) {
    this.io.to(`user_${userId}`).emit('new_notification', {
      ...notification,
      timestamp: new Date()
    });
  }
}
```

### **2. React Query para Caché y Sincronización**

```typescript
// client/src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => userService.getUsers(page, limit),
    keepPreviousData: true,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      // Invalidar y refetch queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Actualizar cache optimísticamente
      queryClient.setQueryData(['user', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

---

## 🚀 **DESPLIEGUE Y PRODUCCIÓN**

### **1. Configuración de Producción**

```typescript
// server/src/config/production.ts
import dotenv from 'dotenv';

dotenv.config();

export const productionConfig = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  clientURL: process.env.CLIENT_URL!,
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite por IP
  }
};
```

### **2. Docker Configuration**

```dockerfile
# Dockerfile para el servidor
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/mern-app?authSource=admin
      JWT_SECRET: your-secret-key
      CLIENT_URL: http://localhost:3000
    depends_on:
      - mongodb

  client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - server

volumes:
  mongodb_data:
```

### **3. Scripts de Despliegue**

```json
// package.json scripts
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server/src/index.ts",
    "client": "cd client && npm start",
    "build": "npm run build:server && npm run build:client",
    "build:server": "cd server && npm run build",
    "build:client": "cd client && npm run build",
    "start": "cd server && npm start",
    "test": "npm run test:server && npm run test:client",
    "test:server": "cd server && npm test",
    "test:client": "cd client && npm test",
    "lint": "npm run lint:server && npm run lint:client",
    "lint:server": "cd server && npm run lint",
    "lint:client": "cd client && npm run lint"
  }
}
```

---

## 🎯 **MEJORES PRÁCTICAS MERN**

### **✅ Seguridad:**
1. **Validación de datos** con Joi o Yup
2. **Sanitización** de inputs
3. **Rate limiting** para prevenir ataques
4. **CORS** configurado correctamente
5. **Helmet** para headers de seguridad
6. **JWT** con expiración
7. **Hashing** de contraseñas con bcrypt

### **✅ Performance:**
1. **Indexación** en MongoDB
2. **Paginación** en APIs
3. **Caché** con Redis
4. **Compresión** de respuestas
5. **Lazy loading** en React
6. **Code splitting** y bundle optimization
7. **CDN** para assets estáticos

### **✅ Escalabilidad:**
1. **Microservicios** para funcionalidades complejas
2. **Load balancing** con Nginx
3. **Clustering** de Node.js
4. **Sharding** de MongoDB
5. **Caché distribuido** con Redis
6. **Message queues** para tareas pesadas
7. **Monitoring** y logging

### **✅ Testing:**
1. **Unit tests** para lógica de negocio
2. **Integration tests** para APIs
3. **E2E tests** con Cypress
4. **Testing de componentes** con React Testing Library
5. **Mocking** de servicios externos
6. **Coverage** de código
7. **CI/CD** pipeline

---

*¡Esta arquitectura MERN te permitirá crear aplicaciones full stack robustas, escalables y mantenibles!* 🏗️✨ 