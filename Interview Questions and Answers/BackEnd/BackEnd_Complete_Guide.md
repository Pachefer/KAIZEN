# 🔧 Guía Completa de BackEnd - Entrevistas y Dominio

## 🎯 Introducción al BackEnd

**BackEnd** es la parte del software que se ejecuta en el servidor, gestiona la lógica de negocio, bases de datos, autenticación y proporciona APIs para que el frontend se comunique con el sistema.

### 🌟 **¿Por qué BackEnd?**

- **Lógica de negocio** - Procesamiento de datos y reglas empresariales
- **Seguridad** - Autenticación, autorización y protección de datos
- **Escalabilidad** - Manejo de múltiples usuarios y cargas
- **Persistencia** - Almacenamiento y gestión de datos
- **Integración** - Conexión con servicios externos y APIs

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Qué es una API REST y cuáles son sus principios?**

**Respuesta Completa:**

**REST (Representational State Transfer)** es un estilo arquitectónico para sistemas distribuidos, especialmente aplicaciones web.

**Principios fundamentales:**
- **Stateless** - Cada request contiene toda la información necesaria
- **Client-Server** - Separación clara de responsabilidades
- **Cacheable** - Las respuestas pueden ser cacheadas
- **Uniform Interface** - Interfaz consistente y predecible
- **Layered System** - Arquitectura en capas
- **Code on Demand** - Ejecución de código en el cliente (opcional)

```javascript
// Ejemplo de API REST completa
// =============================

// server.js - Servidor Express con API REST
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP'
});
app.use('/api/', limiter);

// Base de datos simulada
let users = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'user' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'admin' }
];

let posts = [
  { id: 1, title: 'Primer Post', content: 'Contenido del primer post', userId: 1 },
  { id: 2, title: 'Segundo Post', content: 'Contenido del segundo post', userId: 1 }
];

// Middleware de validación
const validateUser = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Nombre debe tener entre 2 y 50 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('role').isIn(['user', 'admin']).withMessage('Rol debe ser user o admin')
];

const validatePost = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Título debe tener entre 5 y 100 caracteres'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Contenido debe tener entre 10 y 1000 caracteres'),
  body('userId').isInt({ min: 1 }).withMessage('UserId debe ser un entero positivo')
];

// Middleware de manejo de errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Middleware de autenticación
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Simular validación de token
  if (token === 'valid-token') {
    req.user = { id: 1, role: 'admin' };
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware de autorización
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }
    
    next();
  };
};

// ===== ENDPOINTS DE USUARIOS =====

// GET /api/users - Listar usuarios
app.get('/api/users', authenticateUser, authorizeRole(['admin']), (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    let filteredUsers = users;
    
    // Filtrado por búsqueda
    if (search) {
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/users/:id - Obtener usuario por ID
app.get('/api/users/:id', authenticateUser, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Solo admins pueden ver todos los usuarios, usuarios normales solo ven su propio perfil
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/users - Crear usuario
app.post('/api/users', authenticateUser, authorizeRole(['admin']), validateUser, handleValidationErrors, (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Verificar si el email ya existe
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Actualizar usuario
app.put('/api/users/:id', authenticateUser, authorizeRole(['admin']), validateUser, handleValidationErrors, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const { name, email, role } = req.body;
    
    // Verificar si el email ya existe en otro usuario
    const existingUser = users.find(u => u.email === email && u.id !== userId);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado por otro usuario'
      });
    }
    
    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      role,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Eliminar usuario
app.delete('/api/users/:id', authenticateUser, authorizeRole(['admin']), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Verificar si el usuario tiene posts
    const userPosts = posts.filter(p => p.userId === userId);
    if (userPosts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un usuario que tiene posts'
      });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ===== ENDPOINTS DE POSTS =====

// GET /api/posts - Listar posts
app.get('/api/posts', (req, res) => {
  try {
    const { page = 1, limit = 10, userId, search = '' } = req.query;
    
    let filteredPosts = posts;
    
    // Filtrado por usuario
    if (userId) {
      filteredPosts = filteredPosts.filter(p => p.userId === parseInt(userId));
    }
    
    // Filtrado por búsqueda
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Enriquecer con información del usuario
    const enrichedPosts = paginatedPosts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        author: user ? { id: user.id, name: user.name, email: user.email } : null
      };
    });
    
    res.json({
      success: true,
      data: enrichedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredPosts.length,
        pages: Math.ceil(filteredPosts.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/posts/:id - Obtener post por ID
app.get('/api/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }
    
    // Enriquecer con información del usuario
    const user = users.find(u => u.id === post.userId);
    const enrichedPost = {
      ...post,
      author: user ? { id: user.id, name: user.name, email: user.email } : null
    };
    
    res.json({
      success: true,
      data: enrichedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/posts - Crear post
app.post('/api/posts', authenticateUser, validatePost, handleValidationErrors, (req, res) => {
  try {
    const { title, content, userId } = req.body;
    
    // Verificar si el usuario existe
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const newPost = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      title,
      content,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    
    res.status(201).json({
      success: true,
      message: 'Post creado exitosamente',
      data: newPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/posts/:id - Actualizar post
app.put('/api/posts/:id', authenticateUser, validatePost, handleValidationErrors, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }
    
    const post = posts[postIndex];
    
    // Solo el autor o un admin puede editar el post
    if (req.user.role !== 'admin' && req.user.id !== post.userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes editar tus propios posts'
      });
    }
    
    const { title, content, userId } = req.body;
    
    posts[postIndex] = {
      ...post,
      title,
      content,
      userId,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Post actualizado exitosamente',
      data: posts[postIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/posts/:id - Eliminar post
app.delete('/api/posts/:id', authenticateUser, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }
    
    const post = posts[postIndex];
    
    // Solo el autor o un admin puede eliminar el post
    if (req.user.role !== 'admin' && req.user.id !== post.userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes eliminar tus propios posts'
      });
    }
    
    const deletedPost = posts.splice(postIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Post eliminado exitosamente',
      data: deletedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ===== ENDPOINTS DE AUTENTICACIÓN =====

// POST /api/auth/login - Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    // Simular validación de credenciales
    const user = users.find(u => u.email === email);
    if (!user || password !== 'password123') { // En producción usar hash
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token (en producción usar JWT)
    const token = 'valid-token';
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ===== MANEJO DE ERRORES GLOBAL =====

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor BackEnd ejecutándose en puerto ${PORT}`);
  console.log(`📚 API REST disponible en http://localhost:${PORT}/api`);
  console.log(`🔐 Endpoint de autenticación: http://localhost:${PORT}/api/auth/login`);
});

module.exports = app;
```

**Simulador de API REST:**

```javascript
// rest-api-simulator.js
class RESTAPISimulator {
  constructor() {
    this.endpoints = new Map();
    this.requests = [];
    this.responses = [];
    this.errors = [];
    this.performance = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0
    };
    
    this.httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    this.statusCodes = {
      200: 'OK',
      201: 'Created',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error'
    };
  }

  // Crear endpoint
  createEndpoint(method, path, handler, options = {}) {
    const endpointKey = `${method} ${path}`;
    
    const endpoint = {
      method: method.toUpperCase(),
      path: path,
      handler: handler,
      authentication: options.authentication || false,
      authorization: options.authorization || [],
      rateLimit: options.rateLimit || null,
      validation: options.validation || null,
      description: options.description || '',
      examples: options.examples || []
    };

    this.endpoints.set(endpointKey, endpoint);
    console.log(`✅ Endpoint creado: ${method.toUpperCase()} ${path}`);
    
    return endpoint;
  }

  // Simular request HTTP
  async simulateRequest(method, path, data = {}, headers = {}) {
    const startTime = Date.now();
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`\n🌐 ${method.toUpperCase()} ${path}`);
    console.log(`📝 Request ID: ${requestId}`);
    
    const request = {
      id: requestId,
      method: method.toUpperCase(),
      path: path,
      data: data,
      headers: headers,
      timestamp: new Date(),
      startTime: startTime
    };

    this.requests.push(request);
    this.performance.totalRequests++;

    try {
      // Validar método HTTP
      if (!this.httpMethods.includes(method.toUpperCase())) {
        throw new Error(`Método HTTP no válido: ${method}`);
      }

      // Buscar endpoint
      const endpointKey = `${method.toUpperCase()} ${path}`;
      const endpoint = this.endpoints.get(endpointKey);
      
      if (!endpoint) {
        throw new Error(`Endpoint no encontrado: ${endpointKey}`);
      }

      // Simular autenticación
      if (endpoint.authentication) {
        const authHeader = headers.authorization || headers.Authorization;
        if (!authHeader) {
          throw new Error('Header de autorización requerido');
        }
        
        if (!authHeader.startsWith('Bearer ')) {
          throw new Error('Formato de token inválido');
        }
        
        const token = authHeader.split(' ')[1];
        if (token !== 'valid-token') {
          throw new Error('Token inválido');
        }
      }

      // Simular autorización
      if (endpoint.authorization.length > 0) {
        const userRole = headers['x-user-role'] || 'user';
        if (!endpoint.authorization.includes(userRole)) {
          throw new Error(`Rol '${userRole}' no tiene acceso a este endpoint`);
        }
      }

      // Simular validación
      if (endpoint.validation) {
        const validationResult = this.validateData(data, endpoint.validation);
        if (!validationResult.isValid) {
          throw new Error(`Validación fallida: ${validationResult.errors.join(', ')}`);
        }
      }

      // Simular rate limiting
      if (endpoint.rateLimit) {
        const clientIP = headers['x-forwarded-for'] || '127.0.0.1';
        if (this.isRateLimited(clientIP, endpoint.rateLimit)) {
          throw new Error('Rate limit excedido');
        }
      }

      // Simular procesamiento
      const processingTime = 100 + Math.random() * 400; // 100-500ms
      await this.sleep(processingTime);

      // Ejecutar handler
      const result = await endpoint.handler(data, headers);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const response = {
        requestId: requestId,
        statusCode: 200,
        data: result,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`
        },
        timestamp: new Date(),
        responseTime: responseTime
      };

      this.responses.push(response);
      this.performance.successfulRequests++;
      this.performance.averageResponseTime = 
        (this.performance.averageResponseTime * (this.performance.successfulRequests - 1) + responseTime) / 
        this.performance.successfulRequests;

      console.log(`   ✅ Status: 200 OK`);
      console.log(`   ⏱️  Response Time: ${responseTime}ms`);
      console.log(`   📊 Data: ${JSON.stringify(result, null, 2)}`);

      return response;

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const errorResponse = {
        requestId: requestId,
        statusCode: this.getStatusCodeFromError(error),
        error: {
          message: error.message,
          type: error.constructor.name
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`
        },
        timestamp: new Date(),
        responseTime: responseTime
      };

      this.errors.push(errorResponse);
      this.performance.failedRequests++;

      console.log(`   ❌ Status: ${errorResponse.statusCode} ${this.statusCodes[errorResponse.statusCode]}`);
      console.log(`   ⏱️  Response Time: ${responseTime}ms`);
      console.log(`   🚨 Error: ${error.message}`);

      return errorResponse;
    }
  }

  // Validar datos
  validateData(data, validationRules) {
    const errors = [];
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = data[field];
      
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`Campo '${field}' es requerido`);
      }
      
      if (value !== undefined && value !== null) {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`Campo '${field}' debe tener al menos ${rule.minLength} caracteres`);
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`Campo '${field}' debe tener máximo ${rule.maxLength} caracteres`);
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`Campo '${field}' no cumple con el formato requerido`);
        }
        
        if (rule.type && typeof value !== rule.type) {
          errors.push(`Campo '${field}' debe ser de tipo ${rule.type}`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Verificar rate limiting
  isRateLimited(clientIP, rateLimit) {
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;
    
    const clientRequests = this.requests.filter(req => 
      req.headers['x-forwarded-for'] === clientIP && 
      req.timestamp.getTime() > windowStart
    );
    
    return clientRequests.length >= rateLimit.max;
  }

  // Obtener código de estado basado en el error
  getStatusCodeFromError(error) {
    if (error.message.includes('no encontrado')) return 404;
    if (error.message.includes('no autorizado')) return 401;
    if (error.message.includes('acceso denegado')) return 403;
    if (error.message.includes('validación')) return 400;
    if (error.message.includes('rate limit')) return 429;
    return 500;
  }

  // Crear endpoints de ejemplo
  setupExampleEndpoints() {
    // GET /api/users
    this.createEndpoint('GET', '/api/users', 
      async (data, headers) => {
        return {
          success: true,
          data: [
            { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
            { id: 2, name: 'María García', email: 'maria@example.com' }
          ],
          total: 2
        };
      },
      {
        authentication: true,
        authorization: ['admin'],
        description: 'Listar todos los usuarios',
        examples: [
          {
            method: 'GET',
            path: '/api/users',
            headers: { 'Authorization': 'Bearer valid-token' },
            response: { success: true, data: [], total: 0 }
          }
        ]
      }
    );

    // POST /api/users
    this.createEndpoint('POST', '/api/users',
      async (data, headers) => {
        return {
          success: true,
          message: 'Usuario creado exitosamente',
          data: { id: 3, ...data }
        };
      },
      {
        authentication: true,
        authorization: ['admin'],
        validation: {
          name: { required: true, minLength: 2, maxLength: 50, type: 'string' },
          email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, type: 'string' }
        },
        description: 'Crear nuevo usuario',
        examples: [
          {
            method: 'POST',
            path: '/api/users',
            headers: { 'Authorization': 'Bearer valid-token' },
            data: { name: 'Nuevo Usuario', email: 'nuevo@example.com' },
            response: { success: true, message: 'Usuario creado exitosamente' }
          }
        ]
      }
    );

    // GET /api/posts
    this.createEndpoint('GET', '/api/posts',
      async (data, headers) => {
        return {
          success: true,
          data: [
            { id: 1, title: 'Primer Post', content: 'Contenido del post' },
            { id: 2, title: 'Segundo Post', content: 'Otro contenido' }
          ]
        };
      },
      {
        authentication: false,
        description: 'Listar posts públicos',
        examples: [
          {
            method: 'GET',
            path: '/api/posts',
            response: { success: true, data: [] }
          }
        ]
      }
    );
  }

  // Ejecutar demostración
  async runDemo() {
    console.log('🔧 SIMULADOR DE API REST');
    console.log('=' .repeat(60));
    
    // Configurar endpoints de ejemplo
    console.log('\n🚀 CONFIGURANDO ENDPOINTS...');
    this.setupExampleEndpoints();
    
    // Simular requests exitosos
    console.log('\n✅ SIMULANDO REQUESTS EXITOSOS...');
    
    // GET /api/posts (sin autenticación)
    await this.simulateRequest('GET', '/api/posts');
    
    // GET /api/users (con autenticación y autorización)
    await this.simulateRequest('GET', '/api/users', {}, {
      'Authorization': 'Bearer valid-token',
      'x-user-role': 'admin'
    });
    
    // POST /api/users (con validación)
    await this.simulateRequest('POST', '/api/users', {
      name: 'Pedro López',
      email: 'pedro@example.com'
    }, {
      'Authorization': 'Bearer valid-token',
      'x-user-role': 'admin'
    });
    
    // Simular requests con errores
    console.log('\n❌ SIMULANDO REQUESTS CON ERRORES...');
    
    // Endpoint no encontrado
    await this.simulateRequest('GET', '/api/unknown');
    
    // Sin autenticación
    await this.simulateRequest('GET', '/api/users');
    
    // Sin autorización
    await this.simulateRequest('GET', '/api/users', {}, {
      'Authorization': 'Bearer valid-token',
      'x-user-role': 'user'
    });
    
    // Validación fallida
    await this.simulateRequest('POST', '/api/users', {
      name: 'A', // Muy corto
      email: 'invalid-email' // Formato inválido
    }, {
      'Authorization': 'Bearer valid-token',
      'x-user-role': 'admin'
    });
    
    // Mostrar estadísticas
    this.showPerformanceStats();
    
    console.log('\n🎉 Demostración completada!');
  }

  // Mostrar estadísticas de rendimiento
  showPerformanceStats() {
    console.log('\n📊 ESTADÍSTICAS DE RENDIMIENTO');
    console.log('-'.repeat(50));
    
    console.log(`Total de requests: ${this.performance.totalRequests}`);
    console.log(`Requests exitosos: ${this.performance.successfulRequests}`);
    console.log(`Requests fallidos: ${this.performance.failedRequests}`);
    console.log(`Tasa de éxito: ${((this.performance.successfulRequests / this.performance.totalRequests) * 100).toFixed(1)}%`);
    console.log(`Tiempo de respuesta promedio: ${this.performance.averageResponseTime.toFixed(2)}ms`);
    
    console.log('\n📋 ENDPOINTS DISPONIBLES:');
    this.endpoints.forEach((endpoint, key) => {
      console.log(`   ${endpoint.method} ${endpoint.path}`);
      console.log(`      Autenticación: ${endpoint.authentication ? 'Sí' : 'No'}`);
      console.log(`      Roles autorizados: ${endpoint.authorization.length > 0 ? endpoint.authorization.join(', ') : 'Todos'}`);
      console.log(`      Descripción: ${endpoint.description}`);
    });
  }

  // Utilidad para sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar simulador
const restAPISimulator = new RESTAPISimulator();
restAPISimulator.runDemo();
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos de BackEnd**
   - Arquitectura cliente-servidor
   - APIs y microservicios
   - Patrones de diseño

2. **Bases de Datos**
   - SQL y NoSQL
   - Diseño de esquemas
   - Optimización de consultas

3. **Seguridad**
   - Autenticación y autorización
   - JWT y OAuth
   - Protección contra ataques comunes

4. **Performance**
   - Caching y optimización
   - Load balancing
   - Monitoreo y profiling

5. **DevOps para BackEnd**
   - CI/CD pipelines
   - Containerización
   - Monitoreo en producción

### 🚀 **Proyectos Prácticos Recomendados:**

1. **API REST completa con Node.js/Express**
2. **Sistema de autenticación con JWT**
3. **Microservicio con comunicación asíncrona**
4. **API GraphQL con resolvers**
5. **Sistema de caché con Redis**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de BackEnd! 🔧**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador BackEnd! 🎯**
