#!/usr/bin/env node
/**
 * Ejemplo Práctico: Spring Boot Básico
 * 
 * Este archivo demuestra los conceptos fundamentales de Spring Boot
 * incluyendo configuración básica, anotaciones principales y
 * configuración de propiedades.
 * 
 * Basado en la pregunta: "¿Qué es Spring Boot?"
 */

// Importar dependencias necesarias
const express = require('express');
const path = require('path');

/**
 * Clase que simula una aplicación Spring Boot básica
 * Documenta línea por línea el funcionamiento
 */
class SpringBootApplication {
    constructor() {
        // Inicializar el servidor Express (equivalente a Spring Boot)
        this.app = express();
        
        // Configurar el puerto desde variables de entorno (equivalente a application.properties)
        this.port = process.env.PORT || 8080;
        
        // Estado de la aplicación
        this.isRunning = false;
        
        // Configuración de la aplicación
        this.config = {
            name: process.env.APP_NAME || 'Mi Aplicación Spring Boot',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        };
        
        console.log('🚀 Inicializando aplicación Spring Boot...');
    }

    /**
     * Configuración básica de la aplicación
     * Equivalente a @Configuration en Spring Boot
     */
    configure() {
        console.log('⚙️ Configurando aplicación...');
        
        // Middleware para parsear JSON (equivalente a @RequestBody)
        this.app.use(express.json());
        
        // Middleware para parsear URL-encoded (equivalente a @RequestParam)
        this.app.use(express.urlencoded({ extended: true }));
        
        // Configurar CORS (equivalente a @CrossOrigin)
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
        
        console.log('✅ Configuración completada');
    }

    /**
     * Configurar rutas (equivalente a @RestController)
     * Simula los controladores de Spring Boot
     */
    setupRoutes() {
        console.log('🛣️ Configurando rutas...');
        
        // Ruta principal (equivalente a @GetMapping("/"))
        this.app.get('/', (req, res) => {
            res.json({
                message: '¡Bienvenido a Spring Boot!',
                application: this.config.name,
                version: this.config.version,
                environment: this.config.environment,
                timestamp: new Date().toISOString()
            });
        });
        
        // Ruta de configuración (equivalente a @Value("${app.name}"))
        this.app.get('/config', (req, res) => {
            res.json({
                name: this.config.name,
                port: this.port,
                environment: this.config.environment,
                status: 'running'
            });
        });
        
        // Ruta de health check (equivalente a @Component con @HealthIndicator)
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'UP',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: new Date().toISOString()
            });
        });
        
        // Ruta de información de la aplicación (equivalente a /actuator/info)
        this.app.get('/info', (req, res) => {
            res.json({
                app: {
                    name: this.config.name,
                    version: this.config.version,
                    description: 'Aplicación Spring Boot de ejemplo'
                },
                build: {
                    artifact: 'spring-boot-example',
                    version: this.config.version,
                    time: new Date().toISOString()
                }
            });
        });
        
        // Ruta de métricas (equivalente a /actuator/metrics)
        this.app.get('/metrics', (req, res) => {
            res.json({
                jvm: {
                    memory: {
                        used: process.memoryUsage().heapUsed,
                        max: process.memoryUsage().heapTotal
                    },
                    threads: {
                        count: process.env.UV_THREADPOOL_SIZE || 4
                    }
                },
                process: {
                    uptime: process.uptime(),
                    cpu: process.cpuUsage()
                }
            });
        });
        
        console.log('✅ Rutas configuradas');
    }

    /**
     * Configurar manejo de errores (equivalente a @ControllerAdvice)
     */
    setupErrorHandling() {
        console.log('⚠️ Configurando manejo de errores...');
        
        // Middleware para manejar rutas no encontradas (equivalente a @ExceptionHandler)
        this.app.use((req, res, next) => {
            res.status(404).json({
                error: 'Not Found',
                message: `La ruta ${req.method} ${req.path} no existe`,
                timestamp: new Date().toISOString()
            });
        });
        
        // Middleware para manejar errores globales (equivalente a @ExceptionHandler)
        this.app.use((error, req, res, next) => {
            console.error('Error en la aplicación:', error);
            
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Ha ocurrido un error interno en el servidor',
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('✅ Manejo de errores configurado');
    }

    /**
     * Iniciar la aplicación (equivalente a SpringApplication.run())
     */
    start() {
        try {
            console.log('🚀 Iniciando aplicación Spring Boot...');
            
            // Configurar la aplicación
            this.configure();
            
            // Configurar rutas
            this.setupRoutes();
            
            // Configurar manejo de errores
            this.setupErrorHandling();
            
            // Iniciar el servidor
            this.server = this.app.listen(this.port, () => {
                this.isRunning = true;
                console.log(`✅ Aplicación Spring Boot iniciada en puerto ${this.port}`);
                console.log(`🌐 URL: http://localhost:${this.port}`);
                console.log(`📊 Health Check: http://localhost:${this.port}/health`);
                console.log(`⚙️ Configuración: http://localhost:${this.port}/config`);
                console.log(`📈 Métricas: http://localhost:${this.port}/metrics`);
                console.log(`ℹ️ Información: http://localhost:${this.port}/info`);
                console.log('');
                console.log('🎯 Endpoints disponibles:');
                console.log('   GET /          - Página principal');
                console.log('   GET /config    - Configuración de la aplicación');
                console.log('   GET /health    - Estado de salud');
                console.log('   GET /metrics   - Métricas del sistema');
                console.log('   GET /info      - Información de la aplicación');
                console.log('');
                console.log('⏹️ Presiona Ctrl+C para detener la aplicación');
            });
            
            // Manejar señales de terminación (equivalente a @PreDestroy)
            process.on('SIGINT', () => {
                this.stop();
            });
            
            process.on('SIGTERM', () => {
                this.stop();
            });
            
        } catch (error) {
            console.error('❌ Error al iniciar la aplicación:', error);
            process.exit(1);
        }
    }

    /**
     * Detener la aplicación (equivalente a @PreDestroy)
     */
    stop() {
        console.log('\n🛑 Deteniendo aplicación Spring Boot...');
        
        if (this.server) {
            this.server.close(() => {
                this.isRunning = false;
                console.log('✅ Aplicación detenida correctamente');
                process.exit(0);
            });
        } else {
            console.log('✅ Aplicación ya estaba detenida');
            process.exit(0);
        }
    }

    /**
     * Obtener el estado de la aplicación
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            port: this.port,
            config: this.config
        };
    }
}

/**
 * Función principal que ejecuta el ejemplo
 */
function main() {
    console.log('📚 Ejemplo Práctico: Spring Boot Básico');
    console.log('=' .repeat(50));
    console.log('');
    console.log('Este ejemplo demuestra:');
    console.log('✅ Configuración básica de Spring Boot');
    console.log('✅ Anotaciones principales (@SpringBootApplication, @RestController)');
    console.log('✅ Configuración de propiedades (application.properties)');
    console.log('✅ Health checks y métricas (/actuator)');
    console.log('✅ Manejo de errores global');
    console.log('✅ Ciclo de vida de la aplicación');
    console.log('');
    
    // Crear y ejecutar la aplicación
    const app = new SpringBootApplication();
    app.start();
}

// Ejecutar el ejemplo si este archivo se ejecuta directamente
if (require.main === module) {
    main();
}

// Exportar para uso en pruebas
module.exports = {
    SpringBootApplication,
    main
}; 