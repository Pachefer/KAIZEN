# Ejemplos Prácticos de Spring Boot

## 📚 Descripción

Este directorio contiene ejemplos prácticos y ejecutables de Spring Boot que complementan la guía de estudio. Cada ejemplo incluye código comentado línea por línea y pruebas unitarias correspondientes.

## 🏗️ Estructura del Proyecto

```
ejemplos_practicos/
├── package.json              # Configuración del proyecto
├── README.md                 # Este archivo
├── ejemplos/                 # Ejemplos de código
│   ├── 01-spring-boot-basico.js
│   ├── 02-spring-core.js
│   ├── 03-spring-data.js
│   ├── 04-spring-security.js
│   ├── 05-spring-web.js
│   ├── 06-testing.js
│   └── 07-deployment.js
└── __tests__/               # Pruebas unitarias
    ├── 01-spring-boot-basico.test.js
    ├── 02-spring-core.test.js
    ├── 03-spring-data.test.js
    ├── 04-spring-security.test.js
    ├── 05-spring-web.test.js
    ├── 06-testing.test.js
    └── 07-deployment.test.js
```

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Verificar instalación:**
   ```bash
   npm test
   ```

## 📖 Uso

### Ejecutar Ejemplos Individuales

```bash
# Ejemplo básico de Spring Boot
node ejemplos/01-spring-boot-basico.js

# Ejemplo de Spring Core
node ejemplos/02-spring-core.js

# Ejemplo de Spring Data
node ejemplos/03-spring-data.js
```

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas en modo watch
npm run test:watch

# Pruebas con cobertura
npm run test:coverage

# Prueba específica
npm test -- 01-spring-boot-basico.test.js
```

### Scripts Disponibles

- `npm start` - Ejecuta el servidor principal
- `npm run dev` - Ejecuta en modo desarrollo con nodemon
- `npm test` - Ejecuta todas las pruebas
- `npm run lint` - Verifica el código con ESLint
- `npm run lint:fix` - Corrige problemas de linting automáticamente

## 📋 Ejemplos Disponibles

### 1. Spring Boot Básico (`01-spring-boot-basico.js`)
- Configuración básica de Spring Boot
- Anotaciones principales
- Configuración de propiedades

### 2. Spring Core (`02-spring-core.js`)
- Inyección de dependencias
- Configuración de beans
- Ciclo de vida de beans

### 3. Spring Data (`03-spring-data.js`)
- Entidades JPA
- Repositorios Spring Data
- Consultas personalizadas

### 4. Spring Security (`04-spring-security.js`)
- Configuración de seguridad
- Autenticación y autorización
- JWT tokens

### 5. Spring Web (`05-spring-web.js`)
- Controladores REST
- Manejo de requests/responses
- Validación de datos

### 6. Testing (`06-testing.js`)
- Pruebas unitarias con JUnit
- Pruebas de integración
- Mocks y stubs

### 7. Deployment (`07-deployment.js`)
- Configuración Docker
- Docker Compose
- Configuración de producción

## 🧪 Pruebas Unitarias

Cada ejemplo tiene su correspondiente archivo de pruebas que incluye:

- **Casos positivos**: Verifican el comportamiento esperado
- **Casos negativos**: Manejan errores y excepciones
- **Casos edge**: Prueban límites y condiciones especiales
- **Mocks**: Simulan dependencias externas

### Ejemplo de Prueba

```javascript
describe('Spring Boot Básico', () => {
  test('debe crear una aplicación Spring Boot válida', () => {
    const app = createSpringBootApp();
    expect(app).toBeDefined();
    expect(app.isRunning()).toBe(true);
  });

  test('debe manejar errores de configuración', () => {
    expect(() => {
      createSpringBootAppWithInvalidConfig();
    }).toThrow('Configuración inválida');
  });
});
```

## 📊 Cobertura de Pruebas

Para ver la cobertura de pruebas:

```bash
npm run test:coverage
```

Esto generará un reporte HTML en `coverage/lcov-report/index.html`

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=jdbc:h2:mem:testdb
JWT_SECRET=your-secret-key
```

### Configuración de ESLint

El proyecto incluye configuración de ESLint para mantener la calidad del código:

```bash
# Verificar código
npm run lint

# Corregir automáticamente
npm run lint:fix
```

## 📝 Notas de Desarrollo

- Todos los ejemplos incluyen comentarios detallados
- Las pruebas cubren casos positivos y negativos
- Se siguen las mejores prácticas de Spring Boot
- Los ejemplos son ejecutables y verificables

## 🤝 Contribuciones

Para contribuir a los ejemplos:

1. Crea una rama para tu feature
2. Agrega ejemplos y pruebas correspondientes
3. Asegúrate de que todas las pruebas pasen
4. Envía un pull request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles. 