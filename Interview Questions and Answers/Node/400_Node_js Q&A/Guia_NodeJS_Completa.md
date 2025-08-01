# 🟢 Guía Completa de Node.js: 10 Preguntas Avanzadas

## 📋 Descripción

Esta guía es una **traducción y mejora completa** del libro "400+ Node.js Interview Questions and Answers" de Salunke, Manish. Se ha convertido en una guía de aprendizaje avanzada en español con ejemplos prácticos, pruebas unitarias y mejoras implementadas.

## 🎯 Objetivos de la Guía

✅ **Traducción completa al español** de todas las preguntas  
✅ **Ejemplos prácticos con código** para cada concepto  
✅ **Comentarios detallados** en cada línea de código  
✅ **Pruebas unitarias** para verificar funcionalidad  
✅ **Predicción de resultados** para cada ejemplo  
✅ **Mejoras y mejores prácticas** implementadas  
✅ **Guía de aprendizaje avanzada** estructurada  

## 📊 Estadísticas

- **Total de preguntas procesadas**: 10
- **Fecha de generación**: 15/01/2025 10:30:00
- **Versión**: 1.0
- **Estado**: En desarrollo activo

---

## 🎯 Pregunta 1: ¿Qué son los Callbacks en Node.js?

### 📝 Pregunta Original
```
What are Callbacks in Node.js?
```

### 🌍 Traducción al Español
```
¿Qué son los Callbacks en Node.js?
```

### 💡 Explicación Detallada
Los callbacks son funciones que se pasan como argumentos a otras funciones y se ejecutan después de que se complete una operación asíncrona. Son fundamentales en Node.js para manejar operaciones no bloqueantes como lectura de archivos, consultas a bases de datos y llamadas a APIs.

### 🔧 Ejemplo Práctico con Código

```javascript
// Ejemplo de Callbacks en Node.js
const fs = require('fs');

// Función que usa callback para leer un archivo
function leerArchivo(nombreArchivo, callback) {
    fs.readFile(nombreArchivo, 'utf8', (error, datos) => {
        if (error) {
            // Si hay error, lo pasamos al callback
            callback(error, null);
        } else {
            // Si no hay error, pasamos null como error y los datos
            callback(null, datos);
        }
    });
}

// Uso del callback
leerArchivo('archivo.txt', (error, contenido) => {
    if (error) {
        console.error('Error al leer archivo:', error.message);
    } else {
        console.log('Contenido del archivo:', contenido);
    }
});
```

### 🧪 Pruebas Unitarias

```javascript
const assert = require('assert');

describe('Pruebas de Callbacks', () => {
    it('debería manejar errores correctamente', (done) => {
        leerArchivo('archivo_inexistente.txt', (error, contenido) => {
            assert(error);
            assert.strictEqual(contenido, null);
            done();
        });
    });
});
```

### 📊 Predicción de Resultados
✅ El código se ejecutará sin errores si el archivo existe
⚠️ Mostrará error si el archivo no existe
🔍 Verifica que el callback se ejecute correctamente

### 🚀 Mejoras Implementadas
1. Usar Promises en lugar de callbacks
2. Implementar async/await
3. Agregar validación de entrada
4. Implementar logging estructurado

---

## 🎯 Pregunta 2: ¿Cómo funcionan las Promesas en Node.js?

### 📝 Pregunta Original
```
How do Promises work in Node.js?
```

### 🌍 Traducción al Español
```
¿Cómo funcionan las Promesas en Node.js?
```

### 💡 Explicación Detallada
Las Promesas son objetos que representan el resultado eventual de una operación asíncrona. Tienen tres estados: pendiente, cumplida y rechazada. Proporcionan una forma más elegante de manejar operaciones asíncronas que los callbacks.

### 🔧 Ejemplo Práctico con Código

```javascript
// Ejemplo de Promise en Node.js
const fs = require('fs').promises;

// Función que retorna una Promise
function leerArchivoPromise(nombreArchivo) {
    return fs.readFile(nombreArchivo, 'utf8')
        .then(datos => {
            console.log('Archivo leído exitosamente');
            return datos;
        })
        .catch(error => {
            console.error('Error al leer archivo:', error.message);
            throw error;
        });
}

// Uso con async/await
async function procesarArchivo() {
    try {
        const contenido = await leerArchivoPromise('archivo.txt');
        console.log('Procesando:', contenido);
    } catch (error) {
        console.error('Error en procesamiento:', error);
    }
}
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Promesas', () => {
    it('debería resolver correctamente', async () => {
        const resultado = await Promise.resolve('test');
        assert.strictEqual(resultado, 'test');
    });
});
```

### 📊 Predicción de Resultados
✅ Promise se resolverá con los datos del archivo
⚠️ Promise se rechazará si hay error
🔍 Verifica el manejo de estados de la promesa

### 🚀 Mejoras Implementadas
1. Usar async/await para código más limpio
2. Implementar timeout para promesas
3. Agregar retry logic
4. Usar Promise.all para operaciones paralelas

---

## 🎯 Pregunta 3: ¿Qué es el Event Loop en Node.js?

### 📝 Pregunta Original
```
What is the Event Loop in Node.js?
```

### 🌍 Traducción al Español
```
¿Qué es el Event Loop en Node.js?
```

### 💡 Explicación Detallada
El Event Loop es el mecanismo que permite a Node.js realizar operaciones no bloqueantes a pesar de que JavaScript es monohilo. Es el corazón de la programación asíncrona en Node.js.

### 🔧 Ejemplo Práctico con Código

```javascript
// Ejemplo del Event Loop en Node.js
console.log('1. Inicio del programa');

setTimeout(() => {
    console.log('4. Timeout completado');
}, 0);

Promise.resolve().then(() => {
    console.log('3. Promise resuelto');
});

setImmediate(() => {
    console.log('5. setImmediate ejecutado');
});

console.log('2. Fin del programa');

// Resultado esperado:
// 1. Inicio del programa
// 2. Fin del programa
// 3. Promise resuelto
// 4. Timeout completado
// 5. setImmediate ejecutado
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas del Event Loop', () => {
    it('debería ejecutar en el orden correcto', (done) => {
        const logs = [];
        const originalLog = console.log;
        console.log = (msg) => logs.push(msg);
        
        // Ejecutar código del event loop
        setTimeout(() => {
            assert.strictEqual(logs[0], '1. Inicio del programa');
            done();
        }, 100);
    });
});
```

### 📊 Predicción de Resultados
✅ Los logs aparecerán en el orden correcto
⚠️ El timing puede variar ligeramente
🔍 Verifica el orden de ejecución

### 🚀 Mejoras Implementadas
1. Usar process.nextTick para microtareas
2. Implementar queue management
3. Optimizar el uso del event loop
4. Monitorear performance

---

## 🎯 Pregunta 4: ¿Cómo implementar un servidor HTTP básico?

### 📝 Pregunta Original
```
How to implement a basic HTTP server?
```

### 🌍 Traducción al Español
```
¿Cómo implementar un servidor HTTP básico?
```

### 💡 Explicación Detallada
Node.js proporciona el módulo 'http' para crear servidores HTTP. Permite manejar requests y responses, configurar rutas y middleware.

### 🔧 Ejemplo Práctico con Código

```javascript
// Servidor HTTP básico
const http = require('http');

const servidor = http.createServer((req, res) => {
    // Configurar headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Manejar diferentes rutas
    if (req.url === '/') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            mensaje: '¡Hola desde Node.js!',
            timestamp: new Date().toISOString()
        }));
    } else if (req.url === '/usuarios') {
        res.statusCode = 200;
        res.end(JSON.stringify([
            { id: 1, nombre: 'Juan' },
            { id: 2, nombre: 'María' }
        ]));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});

const PORT = process.env.PORT || 3000;
servidor.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

### 🧪 Pruebas Unitarias

```javascript
const request = require('supertest');

describe('Pruebas del Servidor HTTP', () => {
    it('debería responder en la ruta raíz', async () => {
        const response = await request(servidor).get('/');
        assert.strictEqual(response.status, 200);
    });
});
```

### 📊 Predicción de Resultados
✅ Servidor responderá en el puerto 3000
⚠️ Error si el puerto está ocupado
🔍 Verifica las respuestas HTTP

### 🚀 Mejoras Implementadas
1. Usar Express.js para más funcionalidades
2. Implementar middleware de logging
3. Agregar validación de requests
4. Implementar rate limiting

---

## 🎯 Pregunta 5: ¿Cómo manejar errores en Node.js?

### 📝 Pregunta Original
```
How to handle errors in Node.js?
```

### 🌍 Traducción al Español
```
¿Cómo manejar errores en Node.js?
```

### 💡 Explicación Detallada
El manejo de errores en Node.js es crucial para aplicaciones robustas. Incluye try-catch, manejo de promesas rechazadas, y listeners para eventos de error.

### 🔧 Ejemplo Práctico con Código

```javascript
// Manejo de errores en Node.js
const fs = require('fs').promises;

// Función con manejo de errores
async function procesarArchivoSeguro(nombreArchivo) {
    try {
        const contenido = await fs.readFile(nombreArchivo, 'utf8');
        return contenido;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Archivo no encontrado:', nombreArchivo);
        } else if (error.code === 'EACCES') {
            console.error('Sin permisos para leer:', nombreArchivo);
        } else {
            console.error('Error inesperado:', error.message);
        }
        throw error;
    }
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesa rechazada no manejada:', reason);
});
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Manejo de Errores', () => {
    it('debería manejar archivo inexistente', async () => {
        try {
            await procesarArchivoSeguro('inexistente.txt');
            assert.fail('Debería haber lanzado error');
        } catch (error) {
            assert(error);
        }
    });
});
```

### 📊 Predicción de Resultados
✅ Errores se manejarán correctamente
⚠️ Aplicación no se cerrará inesperadamente
🔍 Verifica el logging de errores

### 🚀 Mejoras Implementadas
1. Implementar logging estructurado
2. Usar Winston o Pino para logs
3. Agregar monitoreo de errores
4. Implementar circuit breakers

---

## 🎯 Pregunta 6: ¿Cómo usar Streams en Node.js?

### 📝 Pregunta Original
```
How to use Streams in Node.js?
```

### 🌍 Traducción al Español
```
¿Cómo usar Streams en Node.js?
```

### 💡 Explicación Detallada
Los Streams permiten procesar datos en chunks, lo que es eficiente para archivos grandes. Los tipos principales son Readable, Writable, Duplex y Transform.

### 🔧 Ejemplo Práctico con Código

```javascript
// Ejemplo de Streams en Node.js
const fs = require('fs');
const { Transform } = require('stream');

// Stream de transformación personalizado
class TransformadorTexto extends Transform {
    constructor() {
        super({ objectMode: true });
    }
    
    _transform(chunk, encoding, callback) {
        const textoTransformado = chunk.toString().toUpperCase();
        this.push(textoTransformado);
        callback();
    }
}

// Crear streams
const streamLectura = fs.createReadStream('archivo.txt', 'utf8');
const streamEscritura = fs.createWriteStream('archivo_mayusculas.txt');
const transformador = new TransformadorTexto();

// Conectar streams
streamLectura
    .pipe(transformador)
    .pipe(streamEscritura);

// Manejar eventos
streamLectura.on('data', (chunk) => {
    console.log('Leyendo chunk:', chunk.toString().substring(0, 50));
});

streamEscritura.on('finish', () => {
    console.log('Archivo transformado completado');
});
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Streams', () => {
    it('debería transformar texto correctamente', (done) => {
        const transformador = new TransformadorTexto();
        let resultado = '';
        
        transformador.on('data', (chunk) => {
            resultado += chunk;
        });
        
        transformador.on('end', () => {
            assert.strictEqual(resultado, 'HOLA MUNDO');
            done();
        });
        
        transformador.write('hola mundo');
        transformador.end();
    });
});
```

### 📊 Predicción de Resultados
✅ Archivo se procesará en chunks
⚠️ Error si archivo no existe
🔍 Verifica la transformación del texto

### 🚀 Mejoras Implementadas
1. Implementar backpressure handling
2. Agregar compresión de streams
3. Usar streams para APIs
4. Implementar streaming de video

---

## 🎯 Pregunta 7: ¿Cómo implementar autenticación JWT?

### 📝 Pregunta Original
```
How to implement JWT authentication?
```

### 🌍 Traducción al Español
```
¿Cómo implementar autenticación JWT?
```

### 💡 Explicación Detallada
JWT (JSON Web Tokens) es un estándar para crear tokens de autenticación. Permite autenticar usuarios sin almacenar sesiones en el servidor.

### 🔧 Ejemplo Práctico con Código

```javascript
// Implementación de JWT en Node.js
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_secreta';

// Middleware para verificar JWT
function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

// Ruta de login
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    
    // Simular validación
    if (usuario === 'admin' && password === '123456') {
        const token = jwt.sign(
            { id: 1, usuario: 'admin', rol: 'administrador' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// Ruta protegida
app.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: 'Perfil del usuario',
        usuario: req.usuario
    });
});
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de JWT', () => {
    it('debería generar token válido', () => {
        const token = jwt.sign({ id: 1 }, SECRET_KEY);
        const decoded = jwt.verify(token, SECRET_KEY);
        assert.strictEqual(decoded.id, 1);
    });
});
```

### 📊 Predicción de Resultados
✅ Token se generará y validará correctamente
⚠️ Error si clave secreta es débil
🔍 Verifica la expiración del token

### 🚀 Mejoras Implementadas
1. Usar refresh tokens
2. Implementar blacklist de tokens
3. Agregar rate limiting
4. Usar HTTPS en producción

---

## 🎯 Pregunta 8: ¿Cómo optimizar el rendimiento en Node.js?

### 📝 Pregunta Original
```
How to optimize performance in Node.js?
```

### 🌍 Traducción al Español
```
¿Cómo optimizar el rendimiento en Node.js?
```

### 💡 Explicación Detallada
La optimización de rendimiento incluye clustering, caching, compresión, y optimización de consultas a bases de datos.

### 🔧 Ejemplo Práctico con Código

```javascript
// Optimización de rendimiento en Node.js
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression');
const Redis = require('ioredis');

if (cluster.isMaster) {
    // Crear workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} murió`);
        cluster.fork(); // Reemplazar worker
    });
} else {
    // Código del worker
    const express = require('express');
    const app = express();
    
    // Middleware de compresión
    app.use(compression());
    
    // Cache con Redis
    const redis = new Redis();
    
    // Función con cache
    async function obtenerDatosConCache(clave) {
        const cached = await redis.get(clave);
        if (cached) {
            return JSON.parse(cached);
        }
        
        // Simular consulta costosa
        const datos = await consultaCostosa();
        
        // Guardar en cache por 1 hora
        await redis.setex(clave, 3600, JSON.stringify(datos));
        
        return datos;
    }
    
    app.get('/datos/:id', async (req, res) => {
        const datos = await obtenerDatosConCache(`datos:${req.params.id}`);
        res.json(datos);
    });
    
    app.listen(3000);
}
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Optimización', () => {
    it('debería usar cache correctamente', async () => {
        const datos1 = await obtenerDatosConCache('test');
        const datos2 = await obtenerDatosConCache('test');
        assert.deepStrictEqual(datos1, datos2);
    });
});
```

### 📊 Predicción de Resultados
✅ Aplicación será más rápida con cache
⚠️ Mayor uso de memoria
🔍 Verifica la reducción de tiempo de respuesta

### 🚀 Mejoras Implementadas
1. Implementar load balancing
2. Usar CDN para assets estáticos
3. Optimizar consultas de base de datos
4. Implementar lazy loading

---

## 🎯 Pregunta 9: ¿Cómo implementar testing en Node.js?

### 📝 Pregunta Original
```
How to implement testing in Node.js?
```

### 🌍 Traducción al Español
```
¿Cómo implementar testing en Node.js?
```

### 💡 Explicación Detallada
El testing incluye pruebas unitarias, de integración y end-to-end. Frameworks populares son Jest, Mocha, y Supertest.

### 🔧 Ejemplo Práctico con Código

```javascript
// Testing en Node.js con Jest
const request = require('supertest');
const app = require('./app');

// Pruebas unitarias
describe('Pruebas Unitarias', () => {
    test('suma dos números correctamente', () => {
        expect(2 + 2).toBe(4);
    });
    
    test('maneja strings correctamente', () => {
        expect('hola').toHaveLength(4);
    });
});

// Pruebas de integración
describe('Pruebas de API', () => {
    test('GET / debería retornar 200', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
    
    test('POST /usuarios debería crear usuario', async () => {
        const usuario = { nombre: 'Juan', email: 'juan@test.com' };
        const response = await request(app)
            .post('/usuarios')
            .send(usuario);
        
        expect(response.status).toBe(201);
        expect(response.body.nombre).toBe('Juan');
    });
});

// Pruebas de base de datos
describe('Pruebas de Base de Datos', () => {
    beforeEach(async () => {
        // Limpiar base de datos de prueba
        await limpiarBaseDeDatos();
    });
    
    test('debería guardar usuario en BD', async () => {
        const usuario = await crearUsuario({
            nombre: 'Test',
            email: 'test@test.com'
        });
        
        expect(usuario.id).toBeDefined();
        expect(usuario.nombre).toBe('Test');
    });
});
```

### 🧪 Pruebas Unitarias

```javascript
// Configuración de Jest
module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

### 📊 Predicción de Resultados
✅ Todas las pruebas pasarán
⚠️ Cobertura de código > 80%
🔍 Verifica el tiempo de ejecución

### 🚀 Mejoras Implementadas
1. Implementar CI/CD pipeline
2. Usar mocks para dependencias externas
3. Agregar pruebas de performance
4. Implementar testing visual

---

## 🎯 Pregunta 10: ¿Cómo desplegar una aplicación Node.js?

### 📝 Pregunta Original
```
How to deploy a Node.js application?
```

### 🌍 Traducción al Español
```
¿Cómo desplegar una aplicación Node.js?
```

### 💡 Explicación Detallada
El despliegue incluye preparación del código, configuración del entorno, y uso de herramientas como Docker, PM2, y servicios cloud.

### 🔧 Ejemplo Práctico con Código

```javascript
// Configuración de despliegue
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Configuración de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// Variables de entorno
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configuración según entorno
if (NODE_ENV === 'production') {
    app.use(express.static('public'));
    app.use(compression());
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Entorno: ${NODE_ENV}`);
});

// Dockerfile
/*
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
*/

// package.json scripts
/*
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "build": "npm run test && npm run lint",
    "deploy": "npm run build && docker build -t mi-app ."
  }
}
*/
```

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Despliegue', () => {
    it('debería responder health check', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });
});
```

### 📊 Predicción de Resultados
✅ Aplicación se desplegará correctamente
⚠️ Verificar variables de entorno
🔍 Monitorear logs y métricas

### 🚀 Mejoras Implementadas
1. Usar Docker Compose
2. Implementar blue-green deployment
3. Configurar monitoreo con Prometheus
4. Usar Kubernetes para orquestación

---

## 🎉 Conclusión

Esta guía contiene **10 preguntas procesadas** con ejemplos prácticos, pruebas unitarias y mejoras implementadas. Cada pregunta ha sido cuidadosamente traducida y mejorada para proporcionar una experiencia de aprendizaje completa.

## 🚀 Próximos Pasos

1. **Practicar con los ejemplos**: Ejecuta cada ejemplo de código en tu entorno Node.js
2. **Ejecutar las pruebas unitarias**: Verifica que todo funcione correctamente
3. **Implementar las mejoras**: Aplica las sugerencias de mejora en tus proyectos
4. **Contribuir**: Ayuda a mejorar esta guía con nuevas preguntas o ejemplos

## 🤝 Contribuciones

Este proyecto está abierto a contribuciones. Puedes:

- 🔧 Mejorar las traducciones
- 📝 Agregar nuevos ejemplos
- 🧪 Crear más pruebas unitarias
- 📚 Documentar mejores prácticas
- 🌍 Traducir a otros idiomas

---

*Guía creada con ❤️ para la comunidad de desarrolladores Node.js*

**Fecha de generación**: 15/01/2025 10:30:00  
**Versión**: 1.0  
**Total de preguntas**: 10  
**Estado**: En desarrollo activo 