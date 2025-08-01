# 🟢 Ejemplos Prácticos de Node.js

## 📋 Descripción

Este directorio contiene ejemplos prácticos y ejecutables de Node.js que complementan la guía de preguntas y respuestas. Cada ejemplo incluye código comentado, pruebas unitarias y mejores prácticas implementadas.

## 🎯 Objetivos

✅ **Ejemplos ejecutables** con código real  
✅ **Pruebas unitarias** completas  
✅ **Comentarios detallados** en cada línea  
✅ **Manejo de errores** robusto  
✅ **Mejores prácticas** implementadas  
✅ **Documentación** completa  

## 📁 Estructura del Proyecto

```
ejemplos_practicos/
├── package.json              # Dependencias y scripts
├── README.md                 # Este archivo
├── ejemplos/                 # Ejemplos de código
│   ├── 01-callbacks.js       # Ejemplo de callbacks
│   ├── 02-promises.js        # Ejemplo de promesas
│   ├── 03-event-loop.js      # Ejemplo del event loop
│   ├── 04-http-server.js     # Servidor HTTP básico
│   ├── 05-error-handling.js  # Manejo de errores
│   ├── 06-streams.js         # Ejemplo de streams
│   ├── 07-jwt-auth.js        # Autenticación JWT
│   ├── 08-performance.js     # Optimización de rendimiento
│   ├── 09-testing.js         # Ejemplos de testing
│   └── 10-deployment.js      # Configuración de despliegue
├── __tests__/                # Pruebas unitarias
│   ├── 01-callbacks.test.js  # Pruebas de callbacks
│   ├── 02-promises.test.js   # Pruebas de promesas
│   └── ...                   # Más pruebas
└── docs/                     # Documentación adicional
    ├── setup.md              # Guía de configuración
    └── best-practices.md     # Mejores prácticas
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18.0.0 o superior
- npm 8.0.0 o superior

### Instalación de Dependencias

```bash
# Clonar el repositorio (si aplica)
git clone <repository-url>
cd ejemplos_practicos

# Instalar dependencias
npm install

# Verificar instalación
npm test
```

## 📖 Cómo Usar

### Ejecutar Ejemplos Individuales

```bash
# Ejemplo de callbacks
npm run example:callback

# Ejemplo de promesas
npm run example:promise

# Ejemplo del event loop
npm run example:eventloop

# Servidor HTTP
npm run example:http

# Manejo de errores
npm run example:errors

# Streams
npm run example:streams

# Autenticación JWT
npm run example:jwt

# Optimización de rendimiento
npm run example:performance

# Testing
npm run example:testing

# Despliegue
npm run example:deployment
```

### Ejecutar Todas las Pruebas

```bash
# Ejecutar pruebas una vez
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

### Desarrollo

```bash
# Modo desarrollo con nodemon
npm run dev

# Linting
npm run lint

# Linting con auto-fix
npm run lint:fix
```

## 🔧 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `start` | Ejecuta el archivo principal |
| `dev` | Ejecuta en modo desarrollo con nodemon |
| `test` | Ejecuta todas las pruebas |
| `test:watch` | Ejecuta pruebas en modo watch |
| `test:coverage` | Ejecuta pruebas con reporte de cobertura |
| `lint` | Ejecuta ESLint |
| `lint:fix` | Ejecuta ESLint con auto-corrección |
| `example:*` | Ejecuta ejemplos específicos |

## 📚 Ejemplos Disponibles

### 1. Callbacks (`01-callbacks.js`)

**Descripción**: Demuestra el uso de callbacks para operaciones asíncronas.

**Características**:
- Lectura y escritura de archivos
- Procesamiento de múltiples archivos
- Manejo de timeouts
- Validación de entrada
- Logging estructurado

**Ejecutar**:
```bash
npm run example:callback
```

### 2. Promesas (`02-promises.js`)

**Descripción**: Muestra cómo usar promesas y async/await.

**Características**:
- Conversión de callbacks a promesas
- Manejo de errores con try/catch
- Promise.all para operaciones paralelas
- Retry logic
- Timeout para promesas

**Ejecutar**:
```bash
npm run example:promise
```

### 3. Event Loop (`03-event-loop.js`)

**Descripción**: Demuestra el funcionamiento del event loop.

**Características**:
- Orden de ejecución
- setTimeout vs setImmediate
- Microtareas vs macrotareas
- process.nextTick
- Monitoreo de performance

**Ejecutar**:
```bash
npm run example:eventloop
```

### 4. Servidor HTTP (`04-http-server.js`)

**Descripción**: Implementación de servidor HTTP básico.

**Características**:
- Servidor HTTP nativo
- Manejo de rutas
- Headers personalizados
- CORS básico
- Respuestas JSON

**Ejecutar**:
```bash
npm run example:http
```

### 5. Manejo de Errores (`05-error-handling.js`)

**Descripción**: Patrones de manejo de errores en Node.js.

**Características**:
- Try/catch con async/await
- Manejo de errores no capturados
- Error boundaries
- Logging de errores
- Circuit breakers

**Ejecutar**:
```bash
npm run example:errors
```

### 6. Streams (`06-streams.js`)

**Descripción**: Uso de streams para procesamiento eficiente.

**Características**:
- Streams de lectura y escritura
- Streams de transformación
- Piping de streams
- Manejo de backpressure
- Eventos de streams

**Ejecutar**:
```bash
npm run example:streams
```

### 7. Autenticación JWT (`07-jwt-auth.js`)

**Descripción**: Implementación de autenticación con JWT.

**Características**:
- Generación de tokens
- Verificación de tokens
- Middleware de autenticación
- Refresh tokens
- Blacklist de tokens

**Ejecutar**:
```bash
npm run example:jwt
```

### 8. Optimización (`08-performance.js`)

**Descripción**: Técnicas de optimización de rendimiento.

**Características**:
- Clustering
- Caching con Redis
- Compresión
- Load balancing
- Monitoreo de performance

**Ejecutar**:
```bash
npm run example:performance
```

### 9. Testing (`09-testing.js`)

**Descripción**: Ejemplos de testing con Jest.

**Características**:
- Pruebas unitarias
- Pruebas de integración
- Mocks y stubs
- Cobertura de código
- Testing de APIs

**Ejecutar**:
```bash
npm run example:testing
```

### 10. Despliegue (`10-deployment.js`)

**Descripción**: Configuración para despliegue en producción.

**Características**:
- Variables de entorno
- Configuración de seguridad
- Rate limiting
- Health checks
- Docker configuration

**Ejecutar**:
```bash
npm run example:deployment
```

## 🧪 Pruebas Unitarias

### Estructura de Pruebas

Cada ejemplo tiene su correspondiente archivo de pruebas en el directorio `__tests__/`:

- **Cobertura completa**: Todas las funciones están probadas
- **Casos de error**: Se prueban todos los escenarios de error
- **Mocks**: Uso de mocks para dependencias externas
- **Integración**: Pruebas de integración entre componentes

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas específicas
npm test -- --testNamePattern="callbacks"

# Con cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

### Configuración de Jest

```javascript
// jest.config.js
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
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

## 🔍 Debugging

### Configuración de VS Code

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Ejemplo",
      "program": "${workspaceFolder}/ejemplos/01-callbacks.js",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Logs y Debugging

```bash
# Ejecutar con logs detallados
DEBUG=* npm run example:callback

# Ejecutar con Node.js inspector
node --inspect ejemplos/01-callbacks.js
```

## 📊 Métricas y Monitoreo

### Cobertura de Código

```bash
# Generar reporte de cobertura
npm run test:coverage

# Ver reporte en navegador
open coverage/lcov-report/index.html
```

### Performance

```bash
# Medir performance
node --prof ejemplos/08-performance.js

# Analizar resultados
node --prof-process isolate-*.log > processed.txt
```

## 🚀 Despliegue

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Entorno

```bash
# .env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

## 🤝 Contribuciones

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

### Estándares de Código

- Usar ESLint con configuración estándar
- Seguir convenciones de naming
- Documentar todas las funciones
- Escribir pruebas para nuevo código
- Mantener cobertura > 80%

## 📞 Soporte

### Problemas Comunes

**Error: "Cannot find module"**
```bash
npm install
```

**Error: "Permission denied"**
```bash
chmod +x ejemplos/*.js
```

**Error: "Port already in use"**
```bash
# Cambiar puerto en el código o matar proceso
lsof -ti:3000 | xargs kill -9
```

### Recursos Adicionales

- [Documentación oficial de Node.js](https://nodejs.org/docs/)
- [Guía de Express.js](https://expressjs.com/)
- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Mejores prácticas de Node.js](https://github.com/goldbergyoni/nodebestpractices)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

*Ejemplos creados con ❤️ para la comunidad de desarrolladores Node.js*

**Versión**: 1.0  
**Fecha**: 2025-01-15  
**Autor**: Guía Node.js 