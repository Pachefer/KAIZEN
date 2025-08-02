/**
 * Pruebas Unitarias: Spring Security
 * 
 * Este archivo contiene pruebas unitarias para el ejemplo de Spring Security.
 * Las pruebas cubren autenticación, autorización, JWT tokens y middleware de seguridad.
 */

const { SpringSecurity } = require('../ejemplos/02-spring-security');

// Mock de Express para las pruebas
jest.mock('express', () => {
    const mockApp = {
        use: jest.fn(),
        post: jest.fn(),
        get: jest.fn(),
        listen: jest.fn(),
        setHeader: jest.fn()
    };
    return jest.fn(() => mockApp);
});

describe('SpringSecurity', () => {
    let security;
    let mockApp;

    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
        
        // Crear nueva instancia de Spring Security
        security = new SpringSecurity();
        mockApp = {
            use: jest.fn(),
            post: jest.fn(),
            get: jest.fn(),
            listen: jest.fn(),
            setHeader: jest.fn()
        };
    });

    describe('Constructor', () => {
        test('debe crear una instancia válida de SpringSecurity', () => {
            expect(security).toBeDefined();
            expect(security.secretKey).toBeDefined();
            expect(security.users).toBeInstanceOf(Map);
            expect(security.blacklistedTokens).toBeInstanceOf(Set);
        });

        test('debe configurar usuarios por defecto', () => {
            expect(security.users.has('admin')).toBe(true);
            expect(security.users.has('user')).toBe(true);
            expect(security.users.has('disabled')).toBe(true);
            
            const adminUser = security.users.get('admin');
            expect(adminUser.roles).toContain('ADMIN');
            expect(adminUser.roles).toContain('USER');
            expect(adminUser.enabled).toBe(true);
        });
    });

    describe('hashPassword()', () => {
        test('debe hashear contraseñas correctamente', () => {
            const password = 'test123';
            const hashed = security.hashPassword(password);
            
            expect(hashed).toBeDefined();
            expect(hashed).not.toBe(password);
            expect(typeof hashed).toBe('string');
            expect(hashed.length).toBeGreaterThan(0);
        });

        test('debe generar el mismo hash para la misma contraseña', () => {
            const password = 'test123';
            const hash1 = security.hashPassword(password);
            const hash2 = security.hashPassword(password);
            
            expect(hash1).toBe(hash2);
        });

        test('debe generar hashes diferentes para contraseñas diferentes', () => {
            const hash1 = security.hashPassword('password1');
            const hash2 = security.hashPassword('password2');
            
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('verifyPassword()', () => {
        test('debe verificar contraseñas correctas', () => {
            const password = 'test123';
            const hashed = security.hashPassword(password);
            
            const result = security.verifyPassword(password, hashed);
            expect(result).toBe(true);
        });

        test('debe rechazar contraseñas incorrectas', () => {
            const password = 'test123';
            const hashed = security.hashPassword(password);
            
            const result = security.verifyPassword('wrongpassword', hashed);
            expect(result).toBe(false);
        });

        test('debe manejar contraseñas vacías', () => {
            const hashed = security.hashPassword('');
            const result = security.verifyPassword('', hashed);
            expect(result).toBe(true);
        });
    });

    describe('generateToken()', () => {
        test('debe generar tokens válidos', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            const token = security.generateToken(user);
            
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // header.payload.signature
        });

        test('debe incluir información del usuario en el token', () => {
            const user = {
                username: 'testuser',
                roles: ['ADMIN'],
                email: 'admin@example.com'
            };
            
            const token = security.generateToken(user);
            const payload = security.verifyToken(token);
            
            expect(payload).toBeDefined();
            expect(payload.username).toBe('testuser');
            expect(payload.roles).toContain('ADMIN');
            expect(payload.email).toBe('admin@example.com');
        });

        test('debe incluir timestamps en el token', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            const token = security.generateToken(user);
            const payload = security.verifyToken(token);
            
            expect(payload.iat).toBeDefined();
            expect(payload.exp).toBeDefined();
            expect(payload.exp).toBeGreaterThan(payload.iat);
        });
    });

    describe('verifyToken()', () => {
        test('debe verificar tokens válidos', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            const token = security.generateToken(user);
            const payload = security.verifyToken(token);
            
            expect(payload).toBeDefined();
            expect(payload.username).toBe('testuser');
        });

        test('debe rechazar tokens inválidos', () => {
            const invalidToken = 'invalid.token.here';
            const payload = security.verifyToken(invalidToken);
            
            expect(payload).toBeNull();
        });

        test('debe rechazar tokens con formato incorrecto', () => {
            const malformedToken = 'just.some.text';
            const payload = security.verifyToken(malformedToken);
            
            expect(payload).toBeNull();
        });

        test('debe rechazar tokens en la lista negra', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            const token = security.generateToken(user);
            security.blacklistedTokens.add(token);
            
            const payload = security.verifyToken(token);
            expect(payload).toBeNull();
        });

        test('debe rechazar tokens expirados', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            // Crear un token con expiración en el pasado
            const payload = {
                username: user.username,
                roles: user.roles,
                email: user.email,
                iat: Math.floor(Date.now() / 1000) - 3600, // 1 hora atrás
                exp: Math.floor(Date.now() / 1000) - 1800  // 30 minutos atrás
            };
            
            const header = { alg: 'HS256', typ: 'JWT' };
            const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
            const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
            const signature = require('crypto').createHmac('sha256', security.secretKey)
                .update(`${encodedHeader}.${encodedPayload}`)
                .digest('base64');
            
            const expiredToken = `${encodedHeader}.${encodedPayload}.${signature}`;
            
            const result = security.verifyToken(expiredToken);
            expect(result).toBeNull();
        });
    });

    describe('requireAuth()', () => {
        test('debe crear middleware de autenticación', () => {
            const middleware = security.requireAuth();
            expect(typeof middleware).toBe('function');
        });

        test('debe crear middleware con roles específicos', () => {
            const middleware = security.requireAuth(['ADMIN']);
            expect(typeof middleware).toBe('function');
        });

        test('debe rechazar requests sin token', () => {
            const middleware = security.requireAuth();
            const req = { headers: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            middleware(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Token de autenticación requerido'
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe rechazar requests con token inválido', () => {
            const middleware = security.requireAuth();
            const req = {
                headers: {
                    authorization: 'Bearer invalid.token.here'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            middleware(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Token inválido o expirado'
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe permitir requests con token válido', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            const token = security.generateToken(user);
            const middleware = security.requireAuth();
            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };
            const res = {};
            const next = jest.fn();
            
            middleware(req, res, next);
            
            expect(next).toHaveBeenCalled();
            expect(req.user).toBeDefined();
            expect(req.user.username).toBe('testuser');
        });

        test('debe verificar roles requeridos', () => {
            const user = {
                username: 'testuser',
                roles: ['USER'],
                email: 'test@example.com'
            };
            
            const token = security.generateToken(user);
            const middleware = security.requireAuth(['ADMIN']);
            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            
            middleware(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Forbidden',
                message: 'No tienes permisos para acceder a este recurso'
            });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe permitir acceso con roles correctos', () => {
            const user = {
                username: 'admin',
                roles: ['ADMIN', 'USER'],
                email: 'admin@example.com'
            };
            
            const token = security.generateToken(user);
            const middleware = security.requireAuth(['ADMIN']);
            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };
            const res = {};
            const next = jest.fn();
            
            middleware(req, res, next);
            
            expect(next).toHaveBeenCalled();
            expect(req.user).toBeDefined();
            expect(req.user.roles).toContain('ADMIN');
        });
    });

    describe('setupAuthRoutes()', () => {
        test('debe configurar rutas de autenticación', () => {
            security.setupAuthRoutes(mockApp);
            
            expect(mockApp.post).toHaveBeenCalledWith('/auth/login', expect.any(Function));
            expect(mockApp.post).toHaveBeenCalledWith('/auth/logout', expect.any(Function));
            expect(mockApp.get).toHaveBeenCalledWith('/auth/me', expect.any(Function));
            expect(mockApp.post).toHaveBeenCalledWith('/auth/refresh', expect.any(Function));
        });

        test('debe manejar login exitoso', () => {
            security.setupAuthRoutes(mockApp);
            
            // Obtener el handler de login
            const loginCall = mockApp.post.mock.calls.find(call => call[0] === '/auth/login');
            const loginHandler = loginCall[1];
            
            const req = {
                body: {
                    username: 'admin',
                    password: 'admin123'
                }
            };
            const res = {
                json: jest.fn()
            };
            
            loginHandler(req, res);
            
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login exitoso',
                token: expect.any(String),
                user: {
                    username: 'admin',
                    email: 'admin@example.com',
                    roles: ['ADMIN', 'USER']
                }
            });
        });

        test('debe rechazar login con credenciales inválidas', () => {
            security.setupAuthRoutes(mockApp);
            
            const loginCall = mockApp.post.mock.calls.find(call => call[0] === '/auth/login');
            const loginHandler = loginCall[1];
            
            const req = {
                body: {
                    username: 'admin',
                    password: 'wrongpassword'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            loginHandler(req, res);
            
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Credenciales inválidas'
            });
        });

        test('debe rechazar login de usuario deshabilitado', () => {
            security.setupAuthRoutes(mockApp);
            
            const loginCall = mockApp.post.mock.calls.find(call => call[0] === '/auth/login');
            const loginHandler = loginCall[1];
            
            const req = {
                body: {
                    username: 'disabled',
                    password: 'disabled123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            loginHandler(req, res);
            
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unauthorized',
                message: 'Usuario deshabilitado'
            });
        });
    });

    describe('setupProtectedRoutes()', () => {
        test('debe configurar rutas protegidas', () => {
            security.setupProtectedRoutes(mockApp);
            
            expect(mockApp.get).toHaveBeenCalledWith('/public/info', expect.any(Function));
            expect(mockApp.get).toHaveBeenCalledWith('/user/profile', expect.any(Function));
            expect(mockApp.get).toHaveBeenCalledWith('/user/dashboard', expect.any(Function));
            expect(mockApp.get).toHaveBeenCalledWith('/admin/users', expect.any(Function));
            expect(mockApp.post).toHaveBeenCalledWith('/admin/users', expect.any(Function));
        });

        test('debe permitir acceso a rutas públicas', () => {
            security.setupProtectedRoutes(mockApp);
            
            const publicCall = mockApp.get.mock.calls.find(call => call[0] === '/public/info');
            const publicHandler = publicCall[1];
            
            const req = {};
            const res = {
                json: jest.fn()
            };
            
            publicHandler(req, res);
            
            expect(res.json).toHaveBeenCalledWith({
                message: 'Información pública',
                timestamp: expect.any(String)
            });
        });
    });

    describe('setupSecurityMiddleware()', () => {
        test('debe configurar middleware de seguridad', () => {
            security.setupSecurityMiddleware(mockApp);
            
            expect(mockApp.use).toHaveBeenCalled();
        });
    });

    describe('getSecurityStats()', () => {
        test('debe devolver estadísticas de seguridad', () => {
            const stats = security.getSecurityStats();
            
            expect(stats).toBeDefined();
            expect(stats.totalUsers).toBe(3); // admin, user, disabled
            expect(stats.enabledUsers).toBe(2); // admin, user
            expect(stats.blacklistedTokens).toBe(0);
            expect(stats.securityLevel).toBe('HIGH');
            expect(stats.lastUpdate).toBeDefined();
        });

        test('debe actualizar estadísticas cuando se agregan tokens a la lista negra', () => {
            security.blacklistedTokens.add('token1');
            security.blacklistedTokens.add('token2');
            
            const stats = security.getSecurityStats();
            expect(stats.blacklistedTokens).toBe(2);
        });
    });

    describe('Manejo de errores', () => {
        test('debe manejar errores en verificación de tokens', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            const result = security.verifyToken('invalid.token.format');
            
            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });

        test('debe manejar errores en generación de tokens', () => {
            const user = null;
            
            expect(() => {
                security.generateToken(user);
            }).not.toThrow();
        });
    });

    describe('Validación de entrada', () => {
        test('debe validar datos de entrada en login', () => {
            security.setupAuthRoutes(mockApp);
            
            const loginCall = mockApp.post.mock.calls.find(call => call[0] === '/auth/login');
            const loginHandler = loginCall[1];
            
            const req = {
                body: {
                    username: 'admin'
                    // password faltante
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            loginHandler(req, res);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Bad Request',
                message: 'Username y password son requeridos'
            });
        });

        test('debe validar datos de entrada en creación de usuarios', () => {
            security.setupProtectedRoutes(mockApp);
            
            const createUserCall = mockApp.post.mock.calls.find(call => call[0] === '/admin/users');
            const createUserHandler = createUserCall[1];
            
            const req = {
                body: {
                    username: 'newuser'
                    // password y email faltantes
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            createUserHandler(req, res);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Bad Request',
                message: 'Username, password y email son requeridos'
            });
        });
    });
}); 