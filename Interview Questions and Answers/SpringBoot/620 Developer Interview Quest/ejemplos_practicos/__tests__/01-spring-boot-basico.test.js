/**
 * Pruebas Unitarias: Spring Boot Básico
 * 
 * Este archivo contiene pruebas unitarias para el ejemplo de Spring Boot básico.
 * Las pruebas cubren casos positivos, negativos y edge cases.
 */

const { SpringBootApplication } = require('../ejemplos/01-spring-boot-basico');

// Mock de Express para las pruebas
jest.mock('express', () => {
    const mockApp = {
        use: jest.fn(),
        get: jest.fn(),
        listen: jest.fn(),
        close: jest.fn()
    };
    return jest.fn(() => mockApp);
});

// Mock de process.env
const originalEnv = process.env;

describe('SpringBootApplication', () => {
    let app;
    let mockExpressApp;

    beforeEach(() => {
        // Limpiar mocks antes de cada prueba
        jest.clearAllMocks();
        
        // Configurar variables de entorno para las pruebas
        process.env = {
            ...originalEnv,
            NODE_ENV: 'test',
            PORT: '3000',
            APP_NAME: 'Test Spring Boot App'
        };
        
        // Crear nueva instancia de la aplicación
        app = new SpringBootApplication();
        mockExpressApp = app.app;
    });

    afterEach(() => {
        // Restaurar variables de entorno originales
        process.env = originalEnv;
        
        // Limpiar listeners de proceso
        jest.restoreAllMocks();
    });

    describe('Constructor', () => {
        test('debe crear una instancia válida de SpringBootApplication', () => {
            expect(app).toBeDefined();
            expect(app.app).toBeDefined();
            expect(app.port).toBe(3000);
            expect(app.isRunning).toBe(false);
            expect(app.config).toEqual({
                name: 'Test Spring Boot App',
                version: '1.0.0',
                environment: 'test'
            });
        });

        test('debe usar valores por defecto cuando no hay variables de entorno', () => {
            delete process.env.PORT;
            delete process.env.APP_NAME;
            delete process.env.NODE_ENV;
            
            const defaultApp = new SpringBootApplication();
            
            expect(defaultApp.port).toBe(8080);
            expect(defaultApp.config.name).toBe('Mi Aplicación Spring Boot');
            expect(defaultApp.config.environment).toBe('development');
        });
    });

    describe('configure()', () => {
        test('debe configurar middleware básico', () => {
            app.configure();
            
            // Verificar que se configuraron los middlewares básicos
            expect(mockExpressApp.use).toHaveBeenCalledTimes(3);
            
            // Verificar que se configuró JSON middleware
            const jsonCall = mockExpressApp.use.mock.calls.find(call => 
                call[0] === require('express').json
            );
            expect(jsonCall).toBeDefined();
            
            // Verificar que se configuró URL-encoded middleware
            const urlEncodedCall = mockExpressApp.use.mock.calls.find(call => 
                call[0] === require('express').urlencoded({ extended: true })
            );
            expect(urlEncodedCall).toBeDefined();
        });

        test('debe configurar CORS headers', () => {
            app.configure();
            
            // Verificar que se configuró CORS
            const corsCall = mockExpressApp.use.mock.calls.find(call => 
                typeof call[0] === 'function'
            );
            expect(corsCall).toBeDefined();
        });
    });

    describe('setupRoutes()', () => {
        test('debe configurar todas las rutas principales', () => {
            app.setupRoutes();
            
            // Verificar que se configuraron las rutas principales
            expect(mockExpressApp.get).toHaveBeenCalledWith('/', expect.any(Function));
            expect(mockExpressApp.get).toHaveBeenCalledWith('/config', expect.any(Function));
            expect(mockExpressApp.get).toHaveBeenCalledWith('/health', expect.any(Function));
            expect(mockExpressApp.get).toHaveBeenCalledWith('/info', expect.any(Function));
            expect(mockExpressApp.get).toHaveBeenCalledWith('/metrics', expect.any(Function));
        });

        test('debe manejar request a ruta principal correctamente', () => {
            app.setupRoutes();
            
            // Obtener el handler de la ruta principal
            const mainRouteCall = mockExpressApp.get.mock.calls.find(call => call[0] === '/');
            const mainHandler = mainRouteCall[1];
            
            // Mock de request y response
            const mockReq = {};
            const mockRes = {
                json: jest.fn()
            };
            
            // Ejecutar el handler
            mainHandler(mockReq, mockRes);
            
            // Verificar que se llamó json con los datos correctos
            expect(mockRes.json).toHaveBeenCalledWith({
                message: '¡Bienvenido a Spring Boot!',
                application: 'Test Spring Boot App',
                version: '1.0.0',
                environment: 'test',
                timestamp: expect.any(String)
            });
        });

        test('debe manejar request a /config correctamente', () => {
            app.setupRoutes();
            
            // Obtener el handler de la ruta config
            const configRouteCall = mockExpressApp.get.mock.calls.find(call => call[0] === '/config');
            const configHandler = configRouteCall[1];
            
            // Mock de request y response
            const mockReq = {};
            const mockRes = {
                json: jest.fn()
            };
            
            // Ejecutar el handler
            configHandler(mockReq, mockRes);
            
            // Verificar que se llamó json con la configuración
            expect(mockRes.json).toHaveBeenCalledWith({
                name: 'Test Spring Boot App',
                port: 3000,
                environment: 'test',
                status: 'running'
            });
        });

        test('debe manejar request a /health correctamente', () => {
            app.setupRoutes();
            
            // Obtener el handler de la ruta health
            const healthRouteCall = mockExpressApp.get.mock.calls.find(call => call[0] === '/health');
            const healthHandler = healthRouteCall[1];
            
            // Mock de request y response
            const mockReq = {};
            const mockRes = {
                json: jest.fn()
            };
            
            // Mock de process.uptime y process.memoryUsage
            const originalUptime = process.uptime;
            const originalMemoryUsage = process.memoryUsage;
            
            process.uptime = jest.fn(() => 123.45);
            process.memoryUsage = jest.fn(() => ({
                heapUsed: 1000000,
                heapTotal: 2000000,
                external: 500000,
                rss: 3000000
            }));
            
            // Ejecutar el handler
            healthHandler(mockReq, mockRes);
            
            // Verificar que se llamó json con el estado de salud
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 'UP',
                uptime: 123.45,
                memory: {
                    heapUsed: 1000000,
                    heapTotal: 2000000,
                    external: 500000,
                    rss: 3000000
                },
                timestamp: expect.any(String)
            });
            
            // Restaurar funciones originales
            process.uptime = originalUptime;
            process.memoryUsage = originalMemoryUsage;
        });
    });

    describe('setupErrorHandling()', () => {
        test('debe configurar manejo de errores 404', () => {
            app.setupErrorHandling();
            
            // Verificar que se configuró el middleware de 404
            expect(mockExpressApp.use).toHaveBeenCalledWith(expect.any(Function));
        });

        test('debe manejar rutas no encontradas correctamente', () => {
            app.setupErrorHandling();
            
            // Obtener el handler de 404
            const errorHandler = mockExpressApp.use.mock.calls[0][0];
            
            // Mock de request y response
            const mockReq = {
                method: 'GET',
                path: '/ruta-inexistente'
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockNext = jest.fn();
            
            // Ejecutar el handler
            errorHandler(mockReq, mockRes, mockNext);
            
            // Verificar que se devolvió error 404
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Not Found',
                message: 'La ruta GET /ruta-inexistente no existe',
                timestamp: expect.any(String)
            });
        });

        test('debe manejar errores internos correctamente', () => {
            app.setupErrorHandling();
            
            // Obtener el handler de errores (segundo middleware)
            const errorHandler = mockExpressApp.use.mock.calls[1][0];
            
            // Mock de request, response y error
            const mockReq = {};
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockNext = jest.fn();
            const mockError = new Error('Error de prueba');
            
            // Mock de console.error
            const originalConsoleError = console.error;
            console.error = jest.fn();
            
            // Ejecutar el handler
            errorHandler(mockError, mockReq, mockRes, mockNext);
            
            // Verificar que se manejó el error correctamente
            expect(console.error).toHaveBeenCalledWith('Error en la aplicación:', mockError);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Internal Server Error',
                message: 'Ha ocurrido un error interno en el servidor',
                timestamp: expect.any(String)
            });
            
            // Restaurar console.error
            console.error = originalConsoleError;
        });
    });

    describe('start()', () => {
        test('debe iniciar la aplicación correctamente', () => {
            // Mock de console.log
            const originalConsoleLog = console.log;
            console.log = jest.fn();
            
            // Mock del servidor
            const mockServer = {
                close: jest.fn()
            };
            mockExpressApp.listen.mockImplementation((port, callback) => {
                callback();
                return mockServer;
            });
            
            // Iniciar la aplicación
            app.start();
            
            // Verificar que se configuró la aplicación
            expect(mockExpressApp.use).toHaveBeenCalled();
            expect(mockExpressApp.get).toHaveBeenCalled();
            
            // Verificar que se inició el servidor
            expect(mockExpressApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
            expect(app.isRunning).toBe(true);
            expect(app.server).toBe(mockServer);
            
            // Restaurar console.log
            console.log = originalConsoleLog;
        });

        test('debe manejar errores durante el inicio', () => {
            // Mock de console.error
            const originalConsoleError = console.error;
            console.error = jest.fn();
            
            // Mock de process.exit
            const originalExit = process.exit;
            process.exit = jest.fn();
            
            // Hacer que configure() lance un error
            const originalConfigure = app.configure;
            app.configure = jest.fn(() => {
                throw new Error('Error de configuración');
            });
            
            // Iniciar la aplicación
            app.start();
            
            // Verificar que se manejó el error
            expect(console.error).toHaveBeenCalledWith('❌ Error al iniciar la aplicación:', expect.any(Error));
            expect(process.exit).toHaveBeenCalledWith(1);
            
            // Restaurar funciones originales
            console.error = originalConsoleError;
            process.exit = originalExit;
            app.configure = originalConfigure;
        });
    });

    describe('stop()', () => {
        test('debe detener la aplicación correctamente', () => {
            // Mock de console.log
            const originalConsoleLog = console.log;
            console.log = jest.fn();
            
            // Mock de process.exit
            const originalExit = process.exit;
            process.exit = jest.fn();
            
            // Configurar servidor mock
            const mockServer = {
                close: jest.fn((callback) => callback())
            };
            app.server = mockServer;
            app.isRunning = true;
            
            // Detener la aplicación
            app.stop();
            
            // Verificar que se cerró el servidor
            expect(mockServer.close).toHaveBeenCalled();
            expect(app.isRunning).toBe(false);
            expect(process.exit).toHaveBeenCalledWith(0);
            
            // Restaurar funciones originales
            console.log = originalConsoleLog;
            process.exit = originalExit;
        });

        test('debe manejar caso cuando no hay servidor', () => {
            // Mock de console.log
            const originalConsoleLog = console.log;
            console.log = jest.fn();
            
            // Mock de process.exit
            const originalExit = process.exit;
            process.exit = jest.fn();
            
            // No configurar servidor
            app.server = null;
            
            // Detener la aplicación
            app.stop();
            
            // Verificar que se manejó correctamente
            expect(process.exit).toHaveBeenCalledWith(0);
            
            // Restaurar funciones originales
            console.log = originalConsoleLog;
            process.exit = originalExit;
        });
    });

    describe('getStatus()', () => {
        test('debe devolver el estado correcto de la aplicación', () => {
            app.isRunning = true;
            app.port = 3000;
            
            const status = app.getStatus();
            
            expect(status).toEqual({
                isRunning: true,
                port: 3000,
                config: {
                    name: 'Test Spring Boot App',
                    version: '1.0.0',
                    environment: 'test'
                }
            });
        });
    });

    describe('Manejo de señales del sistema', () => {
        test('debe manejar SIGINT correctamente', () => {
            // Mock de stop()
            app.stop = jest.fn();
            
            // Simular señal SIGINT
            process.emit('SIGINT');
            
            // Verificar que se llamó stop()
            expect(app.stop).toHaveBeenCalled();
        });

        test('debe manejar SIGTERM correctamente', () => {
            // Mock de stop()
            app.stop = jest.fn();
            
            // Simular señal SIGTERM
            process.emit('SIGTERM');
            
            // Verificar que se llamó stop()
            expect(app.stop).toHaveBeenCalled();
        });
    });
}); 