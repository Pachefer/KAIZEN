# 🟢 Node.js - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Node.js](#fundamentos-de-nodejs)
2. [Express.js Framework](#expressjs-framework)
3. [Asincronía y Event Loop](#asincronía-y-event-loop)
4. [Módulos y NPM](#módulos-y-npm)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Node.js

### Servidor HTTP Básico

```javascript
// server.js - Servidor HTTP básico
const http = require('http'); // Importar módulo HTTP nativo
const url = require('url'); // Importar módulo URL para parsear URLs
const fs = require('fs'); // Importar módulo File System

// Configuración del servidor
const PORT = process.env.PORT || 3000; // Puerto desde variable de entorno o 3000 por defecto
const HOST = 'localhost'; // Host del servidor

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    // Parsear la URL de la petición
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname; // Obtener la ruta
    const query = parsedUrl.query; // Obtener parámetros de query
    
    // Configurar headers de respuesta
    res.setHeader('Content-Type', 'application/json'); // Tipo de contenido JSON
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir CORS
    
    // Log de la petición para debugging
    console.log(`${new Date().toISOString()} - ${req.method} ${path}`);
    
    // Manejar diferentes rutas
    switch (path) {
        case '/':
            // Ruta raíz - información del servidor
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Servidor Node.js funcionando',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }));
            break;
            
        case '/api/usuarios':
            // Ruta para obtener usuarios
            if (req.method === 'GET') {
                // Simular datos de usuarios
                const usuarios = [
                    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com' },
                    { id: 2, nombre: 'María García', email: 'maria@example.com' }
                ];
                
                res.writeHead(200);
                res.end(JSON.stringify(usuarios));
            } else if (req.method === 'POST') {
                // Manejar creación de usuario
                let body = '';
                
                // Recibir datos del body
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                
                req.on('end', () => {
                    try {
                        const nuevoUsuario = JSON.parse(body);
                        // Aquí iría la lógica para guardar en base de datos
                        
                        res.writeHead(201);
                        res.end(JSON.stringify({
                            message: 'Usuario creado exitosamente',
                            usuario: { id: Date.now(), ...nuevoUsuario }
                        }));
                    } catch (error) {
                        res.writeHead(400);
                        res.end(JSON.stringify({
                            error: 'Datos JSON inválidos'
                        }));
                    }
                });
            } else {
                // Método no permitido
                res.writeHead(405);
                res.end(JSON.stringify({
                    error: 'Método no permitido'
                }));
            }
            break;
            
        default:
            // Ruta no encontrada
            res.writeHead(404);
            res.end(JSON.stringify({
                error: 'Ruta no encontrada',
                path: path
            }));
    }
});

// Manejar errores del servidor
server.on('error', (error) => {
    console.error('Error en el servidor:', error);
});

// Iniciar el servidor
server.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`📊 PID: ${process.pid}`);
    console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
});

// Manejar señales de terminación
process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado exitosamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Recibida señal SIGINT (Ctrl+C), cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado exitosamente');
        process.exit(0);
    });
});
```

### Módulo de Usuarios

```javascript
// models/Usuario.js - Modelo de usuario
const fs = require('fs').promises; // Versión promesas del módulo fs
const path = require('path');

class Usuario {
    constructor(id, nombre, email, createdAt = new Date()) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.createdAt = createdAt;
    }
    
    // Validar datos del usuario
    static validar(datos) {
        const errores = [];
        
        if (!datos.nombre || datos.nombre.trim().length < 2) {
            errores.push('El nombre debe tener al menos 2 caracteres');
        }
        
        if (!datos.email || !datos.email.includes('@')) {
            errores.push('El email debe ser válido');
        }
        
        return {
            esValido: errores.length === 0,
            errores: errores
        };
    }
    
    // Convertir a objeto plano
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            createdAt: this.createdAt.toISOString()
        };
    }
}

// Servicio para manejar usuarios
class UsuarioService {
    constructor() {
        this.archivoDatos = path.join(__dirname, '../data/usuarios.json');
        this.usuarios = [];
        this.siguienteId = 1;
    }
    
    // Cargar usuarios desde archivo
    async cargarUsuarios() {
        try {
            const datos = await fs.readFile(this.archivoDatos, 'utf8');
            const usuariosData = JSON.parse(datos);
            
            this.usuarios = usuariosData.map(u => new Usuario(
                u.id,
                u.nombre,
                u.email,
                new Date(u.createdAt)
            ));
            
            // Calcular siguiente ID
            this.siguienteId = Math.max(...this.usuarios.map(u => u.id), 0) + 1;
            
            console.log(`📂 Cargados ${this.usuarios.length} usuarios`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Archivo no existe, crear directorio y archivo vacío
                await this.crearArchivoDatos();
                console.log('📁 Archivo de datos creado');
            } else {
                throw error;
            }
        }
    }
    
    // Guardar usuarios en archivo
    async guardarUsuarios() {
        try {
            const datos = this.usuarios.map(u => u.toJSON());
            await fs.writeFile(this.archivoDatos, JSON.stringify(datos, null, 2));
            console.log('💾 Usuarios guardados exitosamente');
        } catch (error) {
            console.error('❌ Error guardando usuarios:', error);
            throw error;
        }
    }
    
    // Crear archivo de datos si no existe
    async crearArchivoDatos() {
        const directorio = path.dirname(this.archivoDatos);
        await fs.mkdir(directorio, { recursive: true });
        await fs.writeFile(this.archivoDatos, '[]');
    }
    
    // Obtener todos los usuarios
    obtenerTodos() {
        return this.usuarios.map(u => u.toJSON());
    }
    
    // Obtener usuario por ID
    obtenerPorId(id) {
        const usuario = this.usuarios.find(u => u.id === parseInt(id));
        return usuario ? usuario.toJSON() : null;
    }
    
    // Crear nuevo usuario
    async crear(datos) {
        // Validar datos
        const validacion = Usuario.validar(datos);
        if (!validacion.esValido) {
            throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
        }
        
        // Verificar email único
        if (this.usuarios.some(u => u.email === datos.email)) {
            throw new Error('El email ya existe');
        }
        
        // Crear usuario
        const usuario = new Usuario(
            this.siguienteId++,
            datos.nombre,
            datos.email
        );
        
        this.usuarios.push(usuario);
        
        // Guardar en archivo
        await this.guardarUsuarios();
        
        return usuario.toJSON();
    }
    
    // Actualizar usuario
    async actualizar(id, datos) {
        const usuario = this.usuarios.find(u => u.id === parseInt(id));
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        
        // Validar datos
        const validacion = Usuario.validar(datos);
        if (!validacion.esValido) {
            throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
        }
        
        // Verificar email único (excluyendo el usuario actual)
        if (datos.email !== usuario.email && 
            this.usuarios.some(u => u.email === datos.email)) {
            throw new Error('El email ya existe');
        }
        
        // Actualizar datos
        usuario.nombre = datos.nombre;
        usuario.email = datos.email;
        
        // Guardar en archivo
        await this.guardarUsuarios();
        
        return usuario.toJSON();
    }
    
    // Eliminar usuario
    async eliminar(id) {
        const index = this.usuarios.findIndex(u => u.id === parseInt(id));
        if (index === -1) {
            throw new Error('Usuario no encontrado');
        }
        
        this.usuarios.splice(index, 1);
        
        // Guardar en archivo
        await this.guardarUsuarios();
        
        return true;
    }
    
    // Buscar usuarios por nombre
    buscarPorNombre(nombre) {
        const termino = nombre.toLowerCase();
        return this.usuarios
            .filter(u => u.nombre.toLowerCase().includes(termino))
            .map(u => u.toJSON());
    }
}

module.exports = { Usuario, UsuarioService };
```

---

## 🚀 Express.js Framework

### Aplicación Express Completa

```javascript
// app.js - Aplicación Express completa
const express = require('express'); // Importar Express
const cors = require('cors'); // Middleware para CORS
const helmet = require('helmet'); // Middleware de seguridad
const morgan = require('morgan'); // Middleware de logging
const rateLimit = require('express-rate-limit'); // Rate limiting

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

// Importar middleware personalizado
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Crear aplicación Express
const app = express();

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 peticiones por ventana
    message: {
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos'
    },
    standardHeaders: true, // Incluir headers de rate limit
    legacyHeaders: false
});

// Aplicar rate limiting a todas las rutas
app.use(limiter);

// Middleware de seguridad
app.use(helmet());

// Middleware de CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));

// Middleware para parsear URL encoded
app.use(express.urlencoded({ extended: true }));

// Middleware de timestamp
app.use((req, res, next) => {
    req.timestamp = new Date().toISOString();
    next();
});

// Middleware de request ID
app.use((req, res, next) => {
    req.id = Math.random().toString(36).substr(2, 9);
    res.setHeader('X-Request-ID', req.id);
    next();
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: req.timestamp,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Usuarios',
        version: '1.0.0',
        timestamp: req.timestamp,
        endpoints: {
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            health: '/health'
        }
    });
});

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Exportar app para testing
module.exports = app;
```

---

## ⚡ Asincronía y Event Loop

### Promesas y Async/Await

```javascript
// utils/database.js - Ejemplo de operaciones asíncronas
const fs = require('fs').promises;
const path = require('path');

class Database {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.data = {};
    }
    
    // Cargar datos de forma asíncrona
    async load() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf8');
            this.data = JSON.parse(data);
            console.log('📂 Base de datos cargada');
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Archivo no existe, crear uno vacío
                await this.save();
                console.log('📁 Base de datos creada');
            } else {
                throw error;
            }
        }
    }
    
    // Guardar datos de forma asíncrona
    async save() {
        try {
            await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
            console.log('💾 Base de datos guardada');
        } catch (error) {
            console.error('❌ Error guardando base de datos:', error);
            throw error;
        }
    }
    
    // Operaciones CRUD con promesas
    async create(collection, document) {
        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        
        const newDoc = {
            id: Date.now().toString(),
            ...document,
            createdAt: new Date().toISOString()
        };
        
        this.data[collection].push(newDoc);
        await this.save();
        
        return newDoc;
    }
    
    async read(collection, id = null) {
        if (!this.data[collection]) {
            return id ? null : [];
        }
        
        if (id) {
            return this.data[collection].find(doc => doc.id === id) || null;
        }
        
        return this.data[collection];
    }
    
    async update(collection, id, updates) {
        if (!this.data[collection]) {
            throw new Error('Colección no encontrada');
        }
        
        const index = this.data[collection].findIndex(doc => doc.id === id);
        if (index === -1) {
            throw new Error('Documento no encontrado');
        }
        
        this.data[collection][index] = {
            ...this.data[collection][index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await this.save();
        return this.data[collection][index];
    }
    
    async delete(collection, id) {
        if (!this.data[collection]) {
            throw new Error('Colección no encontrada');
        }
        
        const index = this.data[collection].findIndex(doc => doc.id === id);
        if (index === -1) {
            throw new Error('Documento no encontrado');
        }
        
        const deleted = this.data[collection].splice(index, 1)[0];
        await this.save();
        
        return deleted;
    }
}

// Ejemplo de uso con async/await
async function ejemploUsoDatabase() {
    const db = new Database('./data/database.json');
    
    try {
        // Cargar base de datos
        await db.load();
        
        // Crear usuario
        const usuario = await db.create('usuarios', {
            nombre: 'Juan Pérez',
            email: 'juan@example.com'
        });
        console.log('Usuario creado:', usuario);
        
        // Leer usuario
        const usuarioLeido = await db.read('usuarios', usuario.id);
        console.log('Usuario leído:', usuarioLeido);
        
        // Actualizar usuario
        const usuarioActualizado = await db.update('usuarios', usuario.id, {
            nombre: 'Juan Carlos Pérez'
        });
        console.log('Usuario actualizado:', usuarioActualizado);
        
        // Leer todos los usuarios
        const todosLosUsuarios = await db.read('usuarios');
        console.log('Todos los usuarios:', todosLosUsuarios);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { Database, ejemploUsoDatabase };
```

---

## 🧪 Testing

### Testing con Jest

```javascript
// tests/usuario.test.js - Pruebas unitarias
const { Usuario, UsuarioService } = require('../models/Usuario');
const fs = require('fs').promises;
const path = require('path');

// Mock del módulo fs
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        mkdir: jest.fn()
    }
}));

describe('Usuario', () => {
    let usuario;
    
    beforeEach(() => {
        usuario = new Usuario(1, 'Juan Pérez', 'juan@example.com');
    });
    
    test('debe crear un usuario con datos válidos', () => {
        expect(usuario.id).toBe(1);
        expect(usuario.nombre).toBe('Juan Pérez');
        expect(usuario.email).toBe('juan@example.com');
        expect(usuario.createdAt).toBeInstanceOf(Date);
    });
    
    test('debe validar datos correctamente', () => {
        // Datos válidos
        const datosValidos = {
            nombre: 'Juan Pérez',
            email: 'juan@example.com'
        };
        
        const validacion = Usuario.validar(datosValidos);
        expect(validacion.esValido).toBe(true);
        expect(validacion.errores).toHaveLength(0);
        
        // Datos inválidos
        const datosInvalidos = {
            nombre: 'J',
            email: 'email-invalido'
        };
        
        const validacionInvalida = Usuario.validar(datosInvalidos);
        expect(validacionInvalida.esValido).toBe(false);
        expect(validacionInvalida.errores).toHaveLength(2);
    });
    
    test('debe convertir a JSON correctamente', () => {
        const json = usuario.toJSON();
        
        expect(json).toEqual({
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            createdAt: usuario.createdAt.toISOString()
        });
    });
});

describe('UsuarioService', () => {
    let service;
    let mockData;
    
    beforeEach(() => {
        service = new UsuarioService();
        mockData = [
            {
                id: 1,
                nombre: 'Juan Pérez',
                email: 'juan@example.com',
                createdAt: '2023-01-01T00:00:00.000Z'
            }
        ];
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('debe cargar usuarios desde archivo', async () => {
        fs.readFile.mockResolvedValue(JSON.stringify(mockData));
        
        await service.cargarUsuarios();
        
        expect(service.usuarios).toHaveLength(1);
        expect(service.usuarios[0].nombre).toBe('Juan Pérez');
        expect(service.siguienteId).toBe(2);
    });
    
    test('debe crear usuario correctamente', async () => {
        fs.readFile.mockResolvedValue('[]');
        fs.writeFile.mockResolvedValue();
        
        await service.cargarUsuarios();
        
        const nuevoUsuario = await service.crear({
            nombre: 'María García',
            email: 'maria@example.com'
        });
        
        expect(nuevoUsuario.id).toBe(1);
        expect(nuevoUsuario.nombre).toBe('María García');
        expect(nuevoUsuario.email).toBe('maria@example.com');
        expect(service.usuarios).toHaveLength(1);
    });
    
    test('debe validar email único', async () => {
        fs.readFile.mockResolvedValue(JSON.stringify(mockData));
        await service.cargarUsuarios();
        
        await expect(service.crear({
            nombre: 'Otro Usuario',
            email: 'juan@example.com' // Email duplicado
        })).rejects.toThrow('El email ya existe');
    });
    
    test('debe actualizar usuario correctamente', async () => {
        fs.readFile.mockResolvedValue(JSON.stringify(mockData));
        fs.writeFile.mockResolvedValue();
        
        await service.cargarUsuarios();
        
        const usuarioActualizado = await service.actualizar(1, {
            nombre: 'Juan Carlos Pérez',
            email: 'juan@example.com'
        });
        
        expect(usuarioActualizado.nombre).toBe('Juan Carlos Pérez');
        expect(service.usuarios[0].nombre).toBe('Juan Carlos Pérez');
    });
    
    test('debe eliminar usuario correctamente', async () => {
        fs.readFile.mockResolvedValue(JSON.stringify(mockData));
        fs.writeFile.mockResolvedValue();
        
        await service.cargarUsuarios();
        
        const resultado = await service.eliminar(1);
        
        expect(resultado).toBe(true);
        expect(service.usuarios).toHaveLength(0);
    });
    
    test('debe buscar usuarios por nombre', async () => {
        fs.readFile.mockResolvedValue(JSON.stringify(mockData));
        
        await service.cargarUsuarios();
        
        const resultados = service.buscarPorNombre('Juan');
        
        expect(resultados).toHaveLength(1);
        expect(resultados[0].nombre).toBe('Juan Pérez');
    });
});
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Node.js y cuáles son sus características?**
   - Runtime de JavaScript, event-driven, non-blocking I/O

2. **¿Cuál es la diferencia entre Node.js y JavaScript del navegador?**
   - Node.js: servidor, módulos, APIs del sistema
   - Browser: DOM, window object, APIs web

3. **¿Qué es el event loop en Node.js?**
   - Mecanismo para manejar operaciones asíncronas

### Preguntas Intermedias

4. **¿Cómo funciona el sistema de módulos en Node.js?**
   - CommonJS, require/exports, ES6 modules

5. **¿Qué son los streams en Node.js?**
   - Lectura/escritura de datos en chunks, memory efficient

6. **¿Cómo optimizas el rendimiento en Node.js?**
   - Clustering, caching, profiling, memory management

### Preguntas Avanzadas

7. **¿Cómo implementarías un sistema de microservicios?**
   - Service discovery, load balancing, circuit breakers

8. **¿Qué es el patrón de middleware en Express?**
   - Funciones que procesan requests, next(), error handling

9. **¿Cómo manejarías la concurrencia en Node.js?**
   - Worker threads, child processes, async/await

---

## 📚 Recursos Adicionales

- [Documentación oficial de Node.js](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Node.js! 🚀** 