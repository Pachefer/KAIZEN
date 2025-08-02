#!/usr/bin/env node
/**
 * Ejemplo Práctico: Spring Security
 * 
 * Este archivo demuestra los conceptos de seguridad en Spring Boot
 * incluyendo autenticación, autorización, JWT tokens y configuración
 * de seguridad.
 * 
 * Basado en la pregunta: "¿Cómo configurar Spring Security?"
 */

// Importar dependencias necesarias
const express = require('express');
const crypto = require('crypto');

/**
 * Clase que simula Spring Security
 * Documenta línea por línea el funcionamiento de seguridad
 */
class SpringSecurity {
    constructor() {
        // Configuración de seguridad
        this.secretKey = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura';
        this.tokenExpiration = '24h';
        
        // Almacenamiento de usuarios (en producción usar base de datos)
        this.users = new Map();
        this.blacklistedTokens = new Set();
        
        // Configurar usuarios de ejemplo
        this.setupDefaultUsers();
        
        console.log('🔒 Inicializando Spring Security...');
    }

    /**
     * Configurar usuarios por defecto para pruebas
     * Equivalente a @Bean UserDetailsService en Spring Security
     */
    setupDefaultUsers() {
        // Usuario administrador
        this.users.set('admin', {
            username: 'admin',
            password: this.hashPassword('admin123'),
            roles: ['ADMIN', 'USER'],
            email: 'admin@example.com',
            enabled: true
        });
        
        // Usuario normal
        this.users.set('user', {
            username: 'user',
            password: this.hashPassword('user123'),
            roles: ['USER'],
            email: 'user@example.com',
            enabled: true
        });
        
        // Usuario deshabilitado
        this.users.set('disabled', {
            username: 'disabled',
            password: this.hashPassword('disabled123'),
            roles: ['USER'],
            email: 'disabled@example.com',
            enabled: false
        });
        
        console.log('👥 Usuarios configurados:', Array.from(this.users.keys()));
    }

    /**
     * Hashear contraseña usando bcrypt (equivalente a BCryptPasswordEncoder)
     * @param {string} password - Contraseña en texto plano
     * @returns {string} - Contraseña hasheada
     */
    hashPassword(password) {
        // En un caso real usarías bcrypt
        // Aquí simulamos con SHA-256 para el ejemplo
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    /**
     * Verificar contraseña (equivalente a passwordEncoder.matches())
     * @param {string} rawPassword - Contraseña en texto plano
     * @param {string} hashedPassword - Contraseña hasheada
     * @returns {boolean} - True si coinciden
     */
    verifyPassword(rawPassword, hashedPassword) {
        const hashedInput = this.hashPassword(rawPassword);
        return hashedInput === hashedPassword;
    }

    /**
     * Generar JWT token (equivalente a JwtTokenProvider)
     * @param {Object} user - Objeto usuario
     * @returns {string} - Token JWT
     */
    generateToken(user) {
        const payload = {
            username: user.username,
            roles: user.roles,
            email: user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
        };
        
        // En un caso real usarías la librería jsonwebtoken
        // Aquí simulamos la generación del token
        const header = { alg: 'HS256', typ: 'JWT' };
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const signature = crypto.createHmac('sha256', this.secretKey)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64');
        
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    /**
     * Verificar y decodificar JWT token
     * @param {string} token - Token JWT
     * @returns {Object|null} - Payload del token o null si es inválido
     */
    verifyToken(token) {
        try {
            // Verificar si el token está en la lista negra
            if (this.blacklistedTokens.has(token)) {
                return null;
            }
            
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            
            const [header, payload, signature] = parts;
            
            // Verificar firma
            const expectedSignature = crypto.createHmac('sha256', this.secretKey)
                .update(`${header}.${payload}`)
                .digest('base64');
            
            if (signature !== expectedSignature) {
                return null;
            }
            
            // Decodificar payload
            const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
            
            // Verificar expiración
            if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
                return null;
            }
            
            return decodedPayload;
        } catch (error) {
            console.error('Error verificando token:', error);
            return null;
        }
    }

    /**
     * Middleware de autenticación (equivalente a @PreAuthorize)
     * @param {Array} requiredRoles - Roles requeridos
     * @returns {Function} - Middleware de Express
     */
    requireAuth(requiredRoles = []) {
        return (req, res, next) => {
            // Obtener token del header Authorization
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Token de autenticación requerido'
                });
            }
            
            const token = authHeader.substring(7); // Remover "Bearer "
            
            // Verificar token
            const payload = this.verifyToken(token);
            if (!payload) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Token inválido o expirado'
                });
            }
            
            // Verificar roles si se especifican
            if (requiredRoles.length > 0) {
                const hasRequiredRole = requiredRoles.some(role => 
                    payload.roles.includes(role)
                );
                
                if (!hasRequiredRole) {
                    return res.status(403).json({
                        error: 'Forbidden',
                        message: 'No tienes permisos para acceder a este recurso'
                    });
                }
            }
            
            // Agregar información del usuario al request
            req.user = payload;
            next();
        };
    }

    /**
     * Configurar rutas de autenticación
     * @param {Object} app - Aplicación Express
     */
    setupAuthRoutes(app) {
        console.log('🔐 Configurando rutas de autenticación...');
        
        // Ruta de login (equivalente a @PostMapping("/login"))
        app.post('/auth/login', (req, res) => {
            const { username, password } = req.body;
            
            // Validar datos de entrada
            if (!username || !password) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Username y password son requeridos'
                });
            }
            
            // Buscar usuario
            const user = this.users.get(username);
            if (!user) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Credenciales inválidas'
                });
            }
            
            // Verificar si el usuario está habilitado
            if (!user.enabled) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Usuario deshabilitado'
                });
            }
            
            // Verificar contraseña
            if (!this.verifyPassword(password, user.password)) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Credenciales inválidas'
                });
            }
            
            // Generar token
            const token = this.generateToken(user);
            
            // Registrar intento de login exitoso
            console.log(`✅ Login exitoso para usuario: ${username}`);
            
            res.json({
                message: 'Login exitoso',
                token: token,
                user: {
                    username: user.username,
                    email: user.email,
                    roles: user.roles
                }
            });
        });
        
        // Ruta de logout (equivalente a @PostMapping("/logout"))
        app.post('/auth/logout', this.requireAuth(), (req, res) => {
            const authHeader = req.headers.authorization;
            const token = authHeader.substring(7);
            
            // Agregar token a la lista negra
            this.blacklistedTokens.add(token);
            
            console.log(`🚪 Logout exitoso para usuario: ${req.user.username}`);
            
            res.json({
                message: 'Logout exitoso'
            });
        });
        
        // Ruta para obtener información del usuario actual
        app.get('/auth/me', this.requireAuth(), (req, res) => {
            res.json({
                user: req.user
            });
        });
        
        // Ruta para refrescar token
        app.post('/auth/refresh', this.requireAuth(), (req, res) => {
            const user = this.users.get(req.user.username);
            if (!user || !user.enabled) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Usuario no válido'
                });
            }
            
            const newToken = this.generateToken(user);
            
            res.json({
                message: 'Token refrescado',
                token: newToken
            });
        });
        
        console.log('✅ Rutas de autenticación configuradas');
    }

    /**
     * Configurar rutas protegidas
     * @param {Object} app - Aplicación Express
     */
    setupProtectedRoutes(app) {
        console.log('🛡️ Configurando rutas protegidas...');
        
        // Ruta pública (equivalente a permitAll())
        app.get('/public/info', (req, res) => {
            res.json({
                message: 'Información pública',
                timestamp: new Date().toISOString()
            });
        });
        
        // Ruta para usuarios autenticados (equivalente a authenticated())
        app.get('/user/profile', this.requireAuth(), (req, res) => {
            res.json({
                message: 'Perfil de usuario',
                user: req.user,
                timestamp: new Date().toISOString()
            });
        });
        
        // Ruta solo para usuarios con rol USER
        app.get('/user/dashboard', this.requireAuth(['USER']), (req, res) => {
            res.json({
                message: 'Dashboard de usuario',
                user: req.user,
                data: {
                    notifications: 5,
                    tasks: 12,
                    messages: 3
                }
            });
        });
        
        // Ruta solo para administradores (equivalente a hasRole('ADMIN'))
        app.get('/admin/users', this.requireAuth(['ADMIN']), (req, res) => {
            const usersList = Array.from(this.users.values()).map(user => ({
                username: user.username,
                email: user.email,
                roles: user.roles,
                enabled: user.enabled
            }));
            
            res.json({
                message: 'Lista de usuarios (solo admin)',
                users: usersList,
                total: usersList.length
            });
        });
        
        // Ruta para crear usuarios (solo admin)
        app.post('/admin/users', this.requireAuth(['ADMIN']), (req, res) => {
            const { username, password, email, roles } = req.body;
            
            if (!username || !password || !email) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Username, password y email son requeridos'
                });
            }
            
            if (this.users.has(username)) {
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'El usuario ya existe'
                });
            }
            
            const newUser = {
                username,
                password: this.hashPassword(password),
                email,
                roles: roles || ['USER'],
                enabled: true
            };
            
            this.users.set(username, newUser);
            
            console.log(`👤 Usuario creado: ${username}`);
            
            res.status(201).json({
                message: 'Usuario creado exitosamente',
                user: {
                    username: newUser.username,
                    email: newUser.email,
                    roles: newUser.roles
                }
            });
        });
        
        console.log('✅ Rutas protegidas configuradas');
    }

    /**
     * Configurar middleware de seguridad global
     * @param {Object} app - Aplicación Express
     */
    setupSecurityMiddleware(app) {
        console.log('🔒 Configurando middleware de seguridad...');
        
        // Middleware para rate limiting (equivalente a @EnableWebSecurity)
        const requestCounts = new Map();
        const rateLimit = (req, res, next) => {
            const ip = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            const windowMs = 15 * 60 * 1000; // 15 minutos
            const maxRequests = 100; // máximo 100 requests por ventana
            
            if (!requestCounts.has(ip)) {
                requestCounts.set(ip, []);
            }
            
            const requests = requestCounts.get(ip);
            
            // Remover requests antiguos
            const validRequests = requests.filter(time => now - time < windowMs);
            requestCounts.set(ip, validRequests);
            
            if (validRequests.length >= maxRequests) {
                return res.status(429).json({
                    error: 'Too Many Requests',
                    message: 'Demasiadas requests. Intenta de nuevo más tarde.'
                });
            }
            
            validRequests.push(now);
            next();
        };
        
        app.use(rateLimit);
        
        // Middleware para headers de seguridad (equivalente a SecurityFilterChain)
        app.use((req, res, next) => {
            // Headers de seguridad
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            res.setHeader('Content-Security-Policy', "default-src 'self'");
            
            next();
        });
        
        // Middleware para logging de seguridad
        app.use((req, res, next) => {
            const start = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - start;
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    method: req.method,
                    path: req.path,
                    status: res.statusCode,
                    duration: `${duration}ms`,
                    ip: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('User-Agent')
                };
                
                // Log de seguridad para requests sospechosos
                if (res.statusCode >= 400) {
                    console.warn('⚠️ Request sospechoso:', logEntry);
                } else {
                    console.log('📝 Request:', logEntry);
                }
            });
            
            next();
        });
        
        console.log('✅ Middleware de seguridad configurado');
    }

    /**
     * Obtener estadísticas de seguridad
     * @returns {Object} - Estadísticas de seguridad
     */
    getSecurityStats() {
        return {
            totalUsers: this.users.size,
            enabledUsers: Array.from(this.users.values()).filter(u => u.enabled).length,
            blacklistedTokens: this.blacklistedTokens.size,
            activeTokens: 0, // En un caso real contarías tokens activos
            securityLevel: 'HIGH',
            lastUpdate: new Date().toISOString()
        };
    }
}

/**
 * Función principal que ejecuta el ejemplo
 */
function main() {
    console.log('📚 Ejemplo Práctico: Spring Security');
    console.log('=' .repeat(50));
    console.log('');
    console.log('Este ejemplo demuestra:');
    console.log('✅ Configuración de Spring Security');
    console.log('✅ Autenticación con JWT');
    console.log('✅ Autorización basada en roles');
    console.log('✅ Middleware de seguridad');
    console.log('✅ Rate limiting');
    console.log('✅ Headers de seguridad');
    console.log('✅ Logging de seguridad');
    console.log('');
    
    // Crear instancia de Spring Security
    const security = new SpringSecurity();
    
    // Crear aplicación Express
    const app = express();
    app.use(express.json());
    
    // Configurar seguridad
    security.setupSecurityMiddleware(app);
    security.setupAuthRoutes(app);
    security.setupProtectedRoutes(app);
    
    // Ruta de estadísticas de seguridad (solo admin)
    app.get('/admin/security/stats', security.requireAuth(['ADMIN']), (req, res) => {
        res.json({
            message: 'Estadísticas de seguridad',
            stats: security.getSecurityStats()
        });
    });
    
    // Manejo de errores
    app.use((req, res) => {
        res.status(404).json({
            error: 'Not Found',
            message: 'Ruta no encontrada'
        });
    });
    
    app.use((error, req, res, next) => {
        console.error('Error en la aplicación:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Error interno del servidor'
        });
    });
    
    // Iniciar servidor
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`🔒 Servidor de seguridad iniciado en puerto ${port}`);
        console.log(`🌐 URL: http://localhost:${port}`);
        console.log('');
        console.log('🎯 Endpoints disponibles:');
        console.log('   POST /auth/login     - Iniciar sesión');
        console.log('   POST /auth/logout    - Cerrar sesión');
        console.log('   GET  /auth/me        - Información del usuario');
        console.log('   POST /auth/refresh   - Refrescar token');
        console.log('   GET  /public/info    - Información pública');
        console.log('   GET  /user/profile   - Perfil de usuario (autenticado)');
        console.log('   GET  /user/dashboard - Dashboard (rol USER)');
        console.log('   GET  /admin/users    - Lista de usuarios (rol ADMIN)');
        console.log('   POST /admin/users    - Crear usuario (rol ADMIN)');
        console.log('   GET  /admin/security/stats - Estadísticas (rol ADMIN)');
        console.log('');
        console.log('👥 Usuarios de prueba:');
        console.log('   admin/admin123       - Administrador');
        console.log('   user/user123         - Usuario normal');
        console.log('   disabled/disabled123 - Usuario deshabilitado');
        console.log('');
        console.log('⏹️ Presiona Ctrl+C para detener el servidor');
    });
}

// Ejecutar el ejemplo si este archivo se ejecuta directamente
if (require.main === module) {
    main();
}

// Exportar para uso en pruebas
module.exports = {
    SpringSecurity,
    main
}; 