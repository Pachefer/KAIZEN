# 🧪 Testing y Debugging - JSNAD

## 🎯 Introducción a Testing y Debugging

El **Testing y Debugging** es fundamental para el desarrollo de aplicaciones Node.js robustas y confiables. Aunque no representa un porcentaje específico del examen JSNAD, es una habilidad esencial que se evalúa indirectamente a través de la calidad del código y el manejo de errores.

### ¿Por qué es Importante?

- **Calidad del Código**: Asegurar que el código funciona correctamente
- **Mantenibilidad**: Facilitar cambios y refactoring
- **Detección de Errores**: Identificar problemas antes de producción
- **Documentación**: Los tests sirven como documentación del código
- **Confianza**: Permitir despliegues seguros

## 🧪 Framework de Testing - Jest

### Configuración de Jest

```javascript
// jest.config.js
module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  
  // Patrones de archivos de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup y teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Verbosidad
  verbose: true,
  
  // Módulos de transformación
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};

// tests/setup.js
// Configuración global para todos los tests
beforeAll(() => {
  // Configurar variables de entorno para testing
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'test-database-url';
});

afterAll(() => {
  // Limpiar después de todos los tests
  console.log('Tests completados');
});

// Configuración global de Jest
global.testUtils = {
  // Helper para crear datos de prueba
  createTestUser: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    age: 25,
    ...overrides
  }),
  
  // Helper para limpiar base de datos
  cleanupDatabase: async () => {
    // Implementar limpieza de BD
    console.log('Base de datos limpiada');
  }
};
```

### Estructura de Tests Básica

```javascript
// tests/basic.test.js
describe('Suite de Tests Básicos', () => {
  // beforeAll - Se ejecuta una vez antes de todos los tests
  beforeAll(() => {
    console.log('Iniciando suite de tests básicos');
  });
  
  // afterAll - Se ejecuta una vez después de todos los tests
  afterAll(() => {
    console.log('Finalizando suite de tests básicos');
  });
  
  // beforeEach - Se ejecuta antes de cada test
  beforeEach(() => {
    console.log('Antes de cada test');
  });
  
  // afterEach - Se ejecuta después de cada test
  afterEach(() => {
    console.log('Después de cada test');
  });
  
  // Test básico
  test('debe sumar dos números correctamente', () => {
    const result = 2 + 3;
    expect(result).toBe(5);
  });
  
  // Test con descripción más detallada
  test('debe manejar suma con números negativos', () => {
    const result = -5 + 3;
    expect(result).toBe(-2);
  });
  
  // Test agrupado
  describe('Operaciones Matemáticas', () => {
    test('suma debe ser conmutativa', () => {
      expect(2 + 3).toBe(3 + 2);
    });
    
    test('resta no es conmutativa', () => {
      expect(5 - 3).not.toBe(3 - 5);
    });
  });
});
```

### Matchers de Jest

```javascript
// tests/matchers.test.js
describe('Matchers de Jest', () => {
  describe('Matchers de Igualdad', () => {
    test('toBe para valores primitivos', () => {
      expect(2 + 2).toBe(4);
      expect('hello').toBe('hello');
      expect(true).toBe(true);
      expect(undefined).toBe(undefined);
    });
    
    test('toEqual para objetos y arrays', () => {
      const obj1 = { name: 'Juan', age: 30 };
      const obj2 = { name: 'Juan', age: 30 };
      
      expect(obj1).toEqual(obj2);
      expect(obj1).not.toBe(obj2); // Diferentes referencias
      
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      
      expect(arr1).toEqual(arr2);
    });
    
    test('toStrictEqual para comparación estricta', () => {
      const obj1 = { name: 'Juan', age: 30 };
      const obj2 = { age: 30, name: 'Juan' };
      
      expect(obj1).toEqual(obj2); // ✅ Pasa
      expect(obj1).toStrictEqual(obj2); // ✅ Pasa (propiedades en orden diferente)
      
      const obj3 = { name: 'Juan', age: 30, extra: undefined };
      const obj4 = { name: 'Juan', age: 30 };
      
      expect(obj3).toEqual(obj4); // ✅ Pasa
      expect(obj3).toStrictEqual(obj4); // ❌ Falla (propiedades undefined)
    });
  });
  
  describe('Matchers de Verdad', () => {
    test('toBeTruthy y toBeFalsy', () => {
      expect(1).toBeTruthy();
      expect('hello').toBeTruthy();
      expect({}).toBeTruthy();
      expect([]).toBeTruthy();
      
      expect(0).toBeFalsy();
      expect('').toBeFalsy();
      expect(false).toBeFalsy();
      expect(null).toBeFalsy();
      expect(undefined).toBeFalsy();
    });
    
    test('toBeNull y toBeUndefined', () => {
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
      
      expect(0).not.toBeNull();
      expect('').not.toBeUndefined();
    });
  });
  
  describe('Matchers de Números', () => {
    test('toBeGreaterThan y toBeLessThan', () => {
      expect(10).toBeGreaterThan(5);
      expect(5).toBeLessThan(10);
      expect(10).toBeGreaterThanOrEqual(10);
      expect(5).toBeLessThanOrEqual(5);
    });
    
    test('toBeCloseTo para números de punto flotante', () => {
      expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
      expect(Math.PI).toBeCloseTo(3.14, 2);
    });
  });
  
  describe('Matchers de Strings', () => {
    test('toMatch para expresiones regulares', () => {
      expect('Hello World').toMatch(/World/);
      expect('Hello World').toMatch('World');
      expect('Hello World').not.toMatch(/Python/);
    });
    
    test('toContain para substrings', () => {
      expect('Hello World').toContain('World');
      expect('Hello World').not.toContain('Python');
    });
  });
  
  describe('Matchers de Arrays', () => {
    test('toContain para elementos', () => {
      const array = [1, 2, 3, 4, 5];
      
      expect(array).toContain(3);
      expect(array).not.toContain(6);
      expect(array).toHaveLength(5);
    });
    
    test('toContainEqual para objetos', () => {
      const users = [
        { name: 'Juan', age: 30 },
        { name: 'Ana', age: 25 }
      ];
      
      expect(users).toContainEqual({ name: 'Juan', age: 30 });
      expect(users).not.toContainEqual({ name: 'Juan', age: 31 });
    });
  });
  
  describe('Matchers de Objetos', () => {
    test('toHaveProperty para propiedades', () => {
      const user = { name: 'Juan', age: 30, email: 'juan@example.com' };
      
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('age', 30);
      expect(user).not.toHaveProperty('phone');
    });
    
    test('toMatchObject para coincidencia parcial', () => {
      const user = { name: 'Juan', age: 30, email: 'juan@example.com', role: 'admin' };
      
      expect(user).toMatchObject({ name: 'Juan', age: 30 });
      expect(user).not.toMatchObject({ name: 'Juan', age: 31 });
    });
  });
  
  describe('Matchers de Excepciones', () => {
    test('toThrow para funciones que lanzan errores', () => {
      const throwError = () => {
        throw new Error('Error de prueba');
      };
      
      const noThrow = () => {
        return 'sin error';
      };
      
      expect(throwError).toThrow();
      expect(throwError).toThrow('Error de prueba');
      expect(throwError).toThrow(Error);
      expect(noThrow).not.toThrow();
    });
  });
  
  describe('Matchers de Promises', () => {
    test('resolves para promises exitosas', async () => {
      const successfulPromise = Promise.resolve('éxito');
      
      await expect(successfulPromise).resolves.toBe('éxito');
    });
    
    test('rejects para promises fallidas', async () => {
      const failedPromise = Promise.reject(new Error('fallo'));
      
      await expect(failedPromise).rejects.toThrow('fallo');
    });
  });
});
```

### Testing de Funciones Asíncronas

```javascript
// tests/async.test.js
describe('Testing de Funciones Asíncronas', () => {
  describe('Callbacks', () => {
    test('debe manejar callback exitoso', (done) => {
      function asyncFunction(data, callback) {
        setTimeout(() => {
          callback(null, data * 2);
        }, 100);
      }
      
      asyncFunction(5, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBe(10);
        done();
      });
    });
    
    test('debe manejar callback con error', (done) => {
      function asyncFunctionWithError(data, callback) {
        setTimeout(() => {
          if (data < 0) {
            callback(new Error('Número debe ser positivo'));
          } else {
            callback(null, data * 2);
          }
        }, 100);
      }
      
      asyncFunctionWithError(-5, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Número debe ser positivo');
        expect(result).toBeUndefined();
        done();
      });
    });
  });
  
  describe('Promises', () => {
    test('debe resolver promise exitosamente', async () => {
      function successfulPromise(data) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data * 2);
          }, 100);
        });
      }
      
      const result = await successfulPromise(5);
      expect(result).toBe(10);
    });
    
    test('debe rechazar promise con error', async () => {
      function failedPromise(data) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (data < 0) {
              reject(new Error('Número debe ser positivo'));
            } else {
              resolve(data * 2);
            }
          }, 100);
        });
      }
      
      await expect(failedPromise(-5)).rejects.toThrow('Número debe ser positivo');
    });
    
    test('debe usar resolves matcher', async () => {
      const promise = Promise.resolve(42);
      await expect(promise).resolves.toBe(42);
    });
    
    test('debe usar rejects matcher', async () => {
      const promise = Promise.reject(new Error('Error de prueba'));
      await expect(promise).rejects.toThrow('Error de prueba');
    });
  });
  
  describe('Async/Await', () => {
    test('debe manejar múltiples operaciones async', async () => {
      async function fetchUserData(userId) {
        // Simular operación async
        await new Promise(resolve => setTimeout(resolve, 50));
        return { id: userId, name: 'Test User' };
      }
      
      async function fetchUserOrders(userId) {
        // Simular operación async
        await new Promise(resolve => setTimeout(resolve, 50));
        return [{ id: 1, total: 100 }, { id: 2, total: 200 }];
      }
      
      const [user, orders] = await Promise.all([
        fetchUserData(123),
        fetchUserOrders(123)
      ]);
      
      expect(user).toHaveProperty('id', 123);
      expect(user).toHaveProperty('name', 'Test User');
      expect(orders).toHaveLength(2);
      expect(orders[0]).toHaveProperty('total', 100);
    });
    
    test('debe manejar errores en async/await', async () => {
      async function riskyOperation() {
        await new Promise(resolve => setTimeout(resolve, 50));
        throw new Error('Operación falló');
      }
      
      try {
        await riskyOperation();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error.message).toBe('Operación falló');
      }
    });
  });
  
  describe('Timeouts', () => {
    test('debe fallar por timeout', async () => {
      const slowPromise = new Promise(resolve => {
        setTimeout(resolve, 2000);
      });
      
      await expect(slowPromise).resolves.toBeUndefined();
    }, 3000); // Timeout de 3 segundos para este test
  });
});
```

### Testing de Módulos

```javascript
// tests/module.test.js
const { 
  UserService, 
  DatabaseService, 
  EmailService 
} = require('../src/services');

// Mock de módulos externos
jest.mock('../src/services/database');
jest.mock('../src/services/email');

describe('Testing de Módulos', () => {
  let userService;
  let mockDatabase;
  let mockEmail;
  
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Crear instancias de los servicios
    userService = new UserService();
    mockDatabase = require('../src/services/database');
    mockEmail = require('../src/services/email');
  });
  
  describe('UserService', () => {
    test('debe crear usuario exitosamente', async () => {
      // Configurar mocks
      const mockUser = { id: 1, name: 'Juan', email: 'juan@example.com' };
      mockDatabase.createUser.mockResolvedValue(mockUser);
      mockEmail.sendWelcome.mockResolvedValue(true);
      
      // Ejecutar test
      const result = await userService.createUser({
        name: 'Juan',
        email: 'juan@example.com'
      });
      
      // Verificar resultado
      expect(result).toEqual(mockUser);
      
      // Verificar que se llamaron los mocks
      expect(mockDatabase.createUser).toHaveBeenCalledWith({
        name: 'Juan',
        email: 'juan@example.com'
      });
      expect(mockEmail.sendWelcome).toHaveBeenCalledWith('juan@example.com');
      expect(mockDatabase.createUser).toHaveBeenCalledTimes(1);
      expect(mockEmail.sendWelcome).toHaveBeenCalledTimes(1);
    });
    
    test('debe manejar error en creación de usuario', async () => {
      // Configurar mock para fallar
      mockDatabase.createUser.mockRejectedValue(new Error('Error de BD'));
      
      // Verificar que se lanza el error
      await expect(userService.createUser({
        name: 'Juan',
        email: 'juan@example.com'
      })).rejects.toThrow('Error de BD');
      
      // Verificar que no se envió email
      expect(mockEmail.sendWelcome).not.toHaveBeenCalled();
    });
    
    test('debe actualizar usuario existente', async () => {
      // Configurar mocks
      const existingUser = { id: 1, name: 'Juan', email: 'juan@example.com' };
      const updatedUser = { ...existingUser, name: 'Juan Carlos' };
      
      mockDatabase.getUserById.mockResolvedValue(existingUser);
      mockDatabase.updateUser.mockResolvedValue(updatedUser);
      
      // Ejecutar test
      const result = await userService.updateUser(1, { name: 'Juan Carlos' });
      
      // Verificar resultado
      expect(result).toEqual(updatedUser);
      expect(mockDatabase.getUserById).toHaveBeenCalledWith(1);
      expect(mockDatabase.updateUser).toHaveBeenCalledWith(1, { name: 'Juan Carlos' });
    });
    
    test('debe fallar al actualizar usuario inexistente', async () => {
      // Configurar mock para usuario inexistente
      mockDatabase.getUserById.mockResolvedValue(null);
      
      // Verificar que se lanza el error
      await expect(userService.updateUser(999, { name: 'Juan' }))
        .rejects.toThrow('Usuario no encontrado');
      
      // Verificar que no se llamó updateUser
      expect(mockDatabase.updateUser).not.toHaveBeenCalled();
    });
  });
  
  describe('Mock Implementations', () => {
    test('debe usar implementación personalizada del mock', () => {
      // Implementación personalizada
      mockDatabase.getUserById.mockImplementation((id) => {
        if (id === 1) {
          return Promise.resolve({ id: 1, name: 'Juan' });
        }
        return Promise.resolve(null);
      });
      
      // Verificar comportamiento
      expect(mockDatabase.getUserById(1)).resolves.toEqual({ id: 1, name: 'Juan' });
      expect(mockDatabase.getUserById(999)).resolves.toBeNull();
    });
    
    test('debe usar mockReturnValue para valores síncronos', () => {
      mockDatabase.getConnectionStatus.mockReturnValue('connected');
      
      expect(mockDatabase.getConnectionStatus()).toBe('connected');
    });
    
    test('debe usar mockResolvedValue para promises', async () => {
      mockDatabase.ping.mockResolvedValue('pong');
      
      const result = await mockDatabase.ping();
      expect(result).toBe('pong');
    });
  });
});
```

## 🐛 Debugging y Logging

### Debugging con Node.js

```javascript
// debugging.js
const util = require('util');

// Debugger nativo de Node.js
function demonstrateDebugger() {
  let counter = 0;
  
  // Punto de interrupción
  debugger;
  
  for (let i = 0; i < 5; i++) {
    counter += i;
    console.log(`Iteración ${i}: counter = ${counter}`);
  }
  
  return counter;
}

// Logging estructurado
function demonstrateStructuredLogging() {
  const logger = {
    info: (message, data = {}) => {
      const logEntry = {
        level: 'INFO',
        timestamp: new Date().toISOString(),
        message,
        data,
        pid: process.pid,
        memory: process.memoryUsage()
      };
      
      console.log(JSON.stringify(logEntry));
    },
    
    error: (message, error = null, data = {}) => {
      const logEntry = {
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        message,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : null,
        data,
        pid: process.pid
      };
      
      console.error(JSON.stringify(logEntry));
    },
    
    warn: (message, data = {}) => {
      const logEntry = {
        level: 'WARN',
        timestamp: new Date().toISOString(),
        message,
        data,
        pid: process.pid
      };
      
      console.warn(JSON.stringify(logEntry));
    },
    
    debug: (message, data = {}) => {
      if (process.env.NODE_ENV === 'development') {
        const logEntry = {
          level: 'DEBUG',
          timestamp: new Date().toISOString(),
          message,
          data,
          pid: process.pid
        };
        
        console.log(util.inspect(logEntry, { colors: true, depth: null }));
      }
    }
  };
  
  return logger;
}

// Performance monitoring
function demonstratePerformanceMonitoring() {
  const performance = {
    marks: new Map(),
    
    mark: (name) => {
      performance.marks.set(name, process.hrtime.bigint());
    },
    
    measure: (name, startMark, endMark) => {
      const start = performance.marks.get(startMark);
      const end = performance.marks.get(endMark);
      
      if (!start || !end) {
        throw new Error('Marca no encontrada');
      }
      
      const duration = Number(end - start) / 1000000; // Convertir a milisegundos
      
      return {
        name,
        duration: `${duration.toFixed(2)}ms`,
        startMark,
        endMark
      };
    },
    
    time: async (name, fn) => {
      const start = process.hrtime.bigint();
      const result = await fn();
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1000000;
      
      console.log(`${name} tomó ${duration.toFixed(2)}ms`);
      
      return result;
    }
  };
  
  return performance;
}

// Error tracking
function demonstrateErrorTracking() {
  const errorTracker = {
    errors: [],
    
    track: (error, context = {}) => {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
          pid: process.pid,
          memory: process.memoryUsage(),
          ...context
        }
      };
      
      errorTracker.errors.push(errorInfo);
      
      // En producción, enviar a servicio de monitoreo
      if (process.env.NODE_ENV === 'production') {
        // sendToMonitoringService(errorInfo);
        console.error('Error enviado a servicio de monitoreo:', errorInfo);
      }
      
      return errorInfo;
    },
    
    getErrors: () => errorTracker.errors,
    
    clearErrors: () => {
      errorTracker.errors = [];
    },
    
    getErrorCount: () => errorTracker.errors.length
  };
  
  return errorTracker;
}

// Ejemplo de uso
async function demonstrateDebuggingFeatures() {
  const logger = demonstrateStructuredLogging();
  const perf = demonstratePerformanceMonitoring();
  const errorTracker = demonstrateErrorTracking();
  
  try {
    logger.info('Iniciando operación de debugging');
    
    // Medir performance
    perf.mark('start');
    
    await perf.time('operación async', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'resultado';
    });
    
    perf.mark('end');
    const measurement = perf.measure('operación completa', 'start', 'end');
    logger.info('Medición de performance', measurement);
    
    // Simular error
    throw new Error('Error de prueba para tracking');
    
  } catch (error) {
    const trackedError = errorTracker.track(error, {
      operation: 'debugging demo',
      userId: 123
    });
    
    logger.error('Error capturado y trackeado', error, {
      errorId: trackedError.timestamp
    });
  }
  
  logger.info('Resumen de errores', {
    totalErrors: errorTracker.getErrorCount(),
    recentErrors: errorTracker.getErrors().slice(-3)
  });
}
```

### Configuración de Debugging

```javascript
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.js",
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "*"
      },
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "test"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Attach to Process",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "${workspaceFolder}"
    }
  ]
}

// package.json scripts
{
  "scripts": {
    "debug": "node --inspect src/index.js",
    "debug-brk": "node --inspect-brk src/index.js",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

## 🧪 Pruebas Unitarias - Testing y Debugging

```javascript
// tests/testing-debugging.test.js
const { 
  demonstrateDebugger,
  demonstrateStructuredLogging,
  demonstratePerformanceMonitoring,
  demonstrateErrorTracking,
  demonstrateDebuggingFeatures
} = require('../src/debugging');

describe('Testing y Debugging', () => {
  describe('Structured Logging', () => {
    let logger;
    let consoleSpy;
    
    beforeEach(() => {
      logger = demonstrateStructuredLogging();
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });
    
    afterEach(() => {
      consoleSpy.mockRestore();
    });
    
    test('debe crear log info estructurado', () => {
      logger.info('Mensaje de prueba', { userId: 123 });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"INFO"')
      );
      
      const logCall = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(logCall.level).toBe('INFO');
      expect(logCall.message).toBe('Mensaje de prueba');
      expect(logCall.data.userId).toBe(123);
      expect(logCall).toHaveProperty('timestamp');
      expect(logCall).toHaveProperty('pid');
    });
    
    test('debe crear log error estructurado', () => {
      const error = new Error('Error de prueba');
      logger.error('Error capturado', error, { operation: 'test' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"ERROR"')
      );
      
      const logCall = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(logCall.level).toBe('ERROR');
      expect(logCall.error.name).toBe('Error');
      expect(logCall.error.message).toBe('Error de prueba');
      expect(logCall.data.operation).toBe('test');
    });
  });
  
  describe('Performance Monitoring', () => {
    let perf;
    
    beforeEach(() => {
      perf = demonstratePerformanceMonitoring();
    });
    
    test('debe marcar y medir performance', () => {
      perf.mark('start');
      
      // Simular trabajo
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += i;
      }
      
      perf.mark('end');
      
      const measurement = perf.measure('test', 'start', 'end');
      
      expect(measurement.name).toBe('test');
      expect(measurement.startMark).toBe('start');
      expect(measurement.endMark).toBe('end');
      expect(measurement.duration).toMatch(/^\d+\.\d+ms$/);
    });
    
    test('debe medir tiempo de función async', async () => {
      const result = await perf.time('async test', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'resultado';
      });
      
      expect(result).toBe('resultado');
    });
  });
  
  describe('Error Tracking', () => {
    let errorTracker;
    
    beforeEach(() => {
      errorTracker = demonstrateErrorTracking();
    });
    
    test('debe trackear errores correctamente', () => {
      const error = new Error('Error de prueba');
      const context = { operation: 'test', userId: 123 };
      
      const trackedError = errorTracker.track(error, context);
      
      expect(trackedError.name).toBe('Error');
      expect(trackedError.message).toBe('Error de prueba');
      expect(trackedError.context.operation).toBe('test');
      expect(trackedError.context.userId).toBe(123);
      expect(trackedError).toHaveProperty('timestamp');
      expect(trackedError).toHaveProperty('stack');
    });
    
    test('debe mantener contador de errores', () => {
      expect(errorTracker.getErrorCount()).toBe(0);
      
      errorTracker.track(new Error('Error 1'));
      errorTracker.track(new Error('Error 2'));
      
      expect(errorTracker.getErrorCount()).toBe(2);
      
      errorTracker.clearErrors();
      expect(errorTracker.getErrorCount()).toBe(0);
    });
  });
  
  describe('Debugging Features Integration', () => {
    test('debe ejecutar todas las características de debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      try {
        await demonstrateDebuggingFeatures();
        
        // Verificar que se ejecutaron los logs
        expect(consoleSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
        
      } finally {
        consoleSpy.mockRestore();
        errorSpy.mockRestore();
      }
    });
  });
});
```

## 📝 Puntos Clave - Testing y Debugging

### ✅ Conceptos Esenciales

1. **Jest**: Framework de testing principal para Node.js
2. **Matchers**: toBe, toEqual, toContain, toThrow, etc.
3. **Testing Async**: Callbacks, Promises, async/await
4. **Mocks**: jest.mock(), mockImplementation, mockReturnValue
5. **Debugging**: Debugger nativo, VS Code, logging estructurado
6. **Performance**: Monitoreo y medición de tiempos

### ⚠️ Errores Comunes

1. **No limpiar mocks** entre tests
2. **Olvidar await** en tests async
3. **No manejar timeouts** en tests lentos
4. **Usar console.log** en lugar de logging estructurado
5. **No configurar debugging** en VS Code

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre `toBe` y `toEqual`?
2. ¿Cómo se mockea un módulo en Jest?
3. ¿Qué es el matcher `resolves` usado para?
4. ¿Cómo se configura debugging en VS Code?
5. ¿Cuál es la diferencia entre `beforeEach` y `beforeAll`?

---

**¡Continuemos con la siguiente sección: Seguridad!**
