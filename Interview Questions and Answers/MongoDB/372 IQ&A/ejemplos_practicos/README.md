# 🍃 Ejemplos Prácticos de MongoDB

## 📋 Descripción

Este directorio contiene **ejemplos prácticos y ejecutables** de MongoDB que complementan la guía de estudio. Cada ejemplo incluye código comentado, pruebas unitarias y mejores prácticas implementadas.

## 🎯 Objetivos

✅ **Ejemplos ejecutables** con código comentado  
✅ **Pruebas unitarias** completas con Jest  
✅ **Manejo de errores** robusto  
✅ **Mejores prácticas** implementadas  
✅ **Documentación detallada** en español  

## 📁 Estructura del Proyecto

```
ejemplos_practicos/
├── package.json              # Dependencias y scripts
├── README.md                 # Este archivo
├── ejemplos/                 # Ejemplos ejecutables
│   ├── 01-basico.js         # Operaciones CRUD básicas
│   ├── 02-agregacion.js     # Pipeline de agregación
│   ├── 03-indices.js        # Creación y uso de índices
│   ├── 04-replicacion.js    # Configuración de replica set
│   ├── 05-sharding.js       # Configuración de sharding
│   ├── 06-transacciones.js  # Manejo de transacciones
│   ├── 07-autenticacion.js  # Autenticación y autorización
│   ├── 08-backup.js         # Backup y restore
│   ├── 09-monitoreo.js      # Monitoreo y métricas
│   └── 10-rendimiento.js    # Optimización de rendimiento
└── __tests__/               # Pruebas unitarias
    ├── 01-basico.test.js    # Pruebas para operaciones básicas
    ├── 02-agregacion.test.js # Pruebas para agregaciones
    └── ...                  # Más archivos de prueba
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** >= 6.0 (opcional, se usa MongoDB Memory Server para pruebas)

### Instalar Dependencias

```bash
# Navegar al directorio
cd ejemplos_practicos

# Instalar dependencias
npm install
```

### Configuración

1. **Para ejemplos locales**: Asegúrate de que MongoDB esté ejecutándose en `localhost:27017`
2. **Para pruebas**: Se usa MongoDB Memory Server automáticamente
3. **Variables de entorno**: Crea un archivo `.env` si necesitas configuración personalizada

## 📖 Uso

### Ejecutar Ejemplos Individuales

```bash
# Operaciones básicas de MongoDB
npm run example:basic

# Pipeline de agregación
npm run example:aggregation

# Creación y uso de índices
npm run example:indexes

# Configuración de replicación
npm run example:replication

# Configuración de sharding
npm run example:sharding

# Manejo de transacciones
npm run example:transactions

# Autenticación y autorización
npm run example:auth

# Backup y restore
npm run example:backup

# Monitoreo y métricas
npm run example:monitoring

# Optimización de rendimiento
npm run example:performance
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas específicas
npm test __tests__/01-basico.test.js
```

### Desarrollo

```bash
# Ejecutar en modo desarrollo con nodemon
npm run dev

# Linting del código
npm run lint

# Linting con auto-fix
npm run lint:fix
```

## 📚 Ejemplos Disponibles

### 1. Operaciones Básicas (`01-basico.js`)

**Descripción**: Demuestra las operaciones CRUD fundamentales de MongoDB.

**Características**:
- Conexión a MongoDB
- Inserción de documentos (uno y múltiples)
- Búsqueda con filtros y proyecciones
- Actualización de documentos
- Eliminación de documentos
- Conteo y estadísticas

**Uso**:
```bash
npm run example:basic
```

### 2. Pipeline de Agregación (`02-agregacion.js`)

**Descripción**: Ejemplos de pipelines de agregación complejos.

**Características**:
- Pipeline básico de agregación
- Operadores de agregación ($match, $group, $sort)
- Lookup entre colecciones
- Agregaciones con facetas
- Optimización de pipelines

**Uso**:
```bash
npm run example:aggregation
```

### 3. Índices (`03-indices.js`)

**Descripción**: Creación y uso de diferentes tipos de índices.

**Características**:
- Índices simples y compuestos
- Índices únicos
- Índices de texto
- Índices TTL
- Índices geoespaciales
- Análisis de consultas con explain()

**Uso**:
```bash
npm run example:indexes
```

### 4. Replicación (`04-replicacion.js`)

**Descripción**: Configuración y uso de replica sets.

**Características**:
- Configuración de replica set
- Failover automático
- Read preferences
- Write concerns
- Monitoreo de replica set

**Uso**:
```bash
npm run example:replication
```

### 5. Sharding (`05-sharding.js`)

**Descripción**: Configuración de sharding para escalabilidad horizontal.

**Características**:
- Configuración de config servers
- Configuración de mongos router
- Creación de shards
- Shard keys
- Balancer automático

**Uso**:
```bash
npm run example:sharding
```

### 6. Transacciones (`06-transacciones.js`)

**Descripción**: Manejo de transacciones ACID en MongoDB.

**Características**:
- Transacciones básicas
- Transacciones distribuidas
- Manejo de errores y rollback
- Write concerns
- Timeouts de transacciones

**Uso**:
```bash
npm run example:transactions
```

### 7. Autenticación (`07-autenticacion.js`)

**Descripción**: Implementación de autenticación y autorización.

**Características**:
- Creación de usuarios
- Roles y privilegios
- Autenticación con JWT
- Auditoría de acceso
- Seguridad de conexiones

**Uso**:
```bash
npm run example:auth
```

### 8. Backup (`08-backup.js`)

**Descripción**: Estrategias de backup y restore.

**Características**:
- Backup completo con mongodump
- Backup incremental
- Restore de datos
- Scripts automatizados
- Verificación de integridad

**Uso**:
```bash
npm run example:backup
```

### 9. Monitoreo (`09-monitoreo.js`)

**Descripción**: Monitoreo y métricas de MongoDB.

**Características**:
- Profiler de consultas
- Métricas del servidor
- Monitoreo de operaciones
- Alertas automáticas
- Logging estructurado

**Uso**:
```bash
npm run example:monitoring
```

### 10. Rendimiento (`10-rendimiento.js`)

**Descripción**: Optimización de rendimiento y consultas.

**Características**:
- Optimización de consultas
- Análisis de rendimiento
- Caching strategies
- Paginación eficiente
- Monitoreo de performance

**Uso**:
```bash
npm run example:performance
```

## 🧪 Pruebas Unitarias

### Estructura de Pruebas

Cada ejemplo tiene su correspondiente archivo de prueba que incluye:

- **Pruebas de funcionalidad**: Verificación de operaciones básicas
- **Pruebas de integración**: Verificación de flujos completos
- **Pruebas de error**: Manejo de casos de error
- **Pruebas de rendimiento**: Verificación de optimizaciones

### Ejecutar Pruebas Específicas

```bash
# Pruebas de operaciones básicas
npm test __tests__/01-basico.test.js

# Pruebas de agregaciones
npm test __tests__/02-agregacion.test.js

# Todas las pruebas con cobertura
npm run test:coverage
```

### Configuración de Pruebas

Las pruebas usan **MongoDB Memory Server** para garantizar:

- **Aislamiento**: Cada prueba usa una base de datos limpia
- **Velocidad**: No requiere instalación de MongoDB
- **Portabilidad**: Funciona en cualquier entorno
- **Confiabilidad**: No depende de servicios externos

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env` para configuración personalizada:

```env
# Conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ejemplos_practicos

# Configuración de autenticación
MONGODB_USER=usuario
MONGODB_PASSWORD=password

# Configuración de logging
LOG_LEVEL=info
LOG_FILE=logs/mongodb.log

# Configuración de pruebas
TEST_TIMEOUT=30000
```

### Configuración de Jest

El proyecto incluye configuración de Jest optimizada para MongoDB:

```javascript
// jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testTimeout: 30000,
    collectCoverageFrom: [
        'ejemplos/**/*.js',
        '!ejemplos/**/*.test.js'
    ],
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

## 📊 Métricas y Monitoreo

### Cobertura de Código

```bash
# Generar reporte de cobertura
npm run test:coverage

# Ver reporte en navegador
open coverage/lcov-report/index.html
```

### Rendimiento

```bash
# Ejecutar benchmarks
npm run benchmark

# Analizar rendimiento
npm run profile
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

### Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017
```

## 🤝 Contribuciones

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

### Estándares de Código

- **ESLint**: Configuración estándar de JavaScript
- **Prettier**: Formateo automático de código
- **JSDoc**: Documentación de funciones
- **Tests**: Cobertura mínima del 80%

### Checklist para Contribuciones

- [ ] Código sigue los estándares de ESLint
- [ ] Funciones documentadas con JSDoc
- [ ] Pruebas unitarias incluidas
- [ ] Cobertura de código >= 80%
- [ ] README actualizado si es necesario
- [ ] Ejemplos funcionan correctamente

## 📞 Soporte

### Problemas Comunes

**Error de conexión a MongoDB**:
```bash
# Verificar que MongoDB esté ejecutándose
sudo systemctl status mongod

# Iniciar MongoDB si no está ejecutándose
sudo systemctl start mongod
```

**Error de permisos**:
```bash
# Verificar permisos de directorio
ls -la /data/db

# Corregir permisos si es necesario
sudo chown -R $USER /data/db
```

**Error de dependencias**:
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Recursos Adicionales

- [Documentación oficial de MongoDB](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Jest Testing Framework](https://jestjs.io/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

*Ejemplos creados con ❤️ para la comunidad de desarrolladores MongoDB*

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Estado**: En desarrollo activo 