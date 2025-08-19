# 📦 Módulos y Sistema de Módulos - JSNAD

## 🎯 Sistema de Módulos CommonJS

Node.js utiliza el sistema de módulos **CommonJS** como estándar para organizar y reutilizar código. Este sistema permite dividir aplicaciones en archivos más pequeños y manejables.

### Características Principales

- **Sincrónico**: Los módulos se cargan de forma síncrona
- **Caching**: Los módulos se cachean después de la primera carga
- **Scope**: Cada módulo tiene su propio scope aislado
- **exports**: Objeto para exportar funcionalidad
- **require()**: Función para importar módulos

## 📤 Exportando Módulos

### Múltiples Formas de Exportar

```javascript
// math.js - Módulo de utilidades matemáticas

// 1. Exportar funciones individuales
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('División por cero no permitida');
  }
  return a / b;
}

// 2. Exportar usando module.exports
module.exports = {
  add,
  subtract,
  multiply,
  divide
};

// 3. Alternativa: exportar directamente
// module.exports.add = add;
// module.exports.subtract = subtract;
// module.exports.multiply = multiply;
// module.exports.divide = divide;
```

### Exportando Clases

```javascript
// user.js - Clase de usuario
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
  
  getName() {
    return this.name;
  }
  
  getEmail() {
    return this.email;
  }
  
  getCreatedAt() {
    return this.createdAt;
  }
  
  updateName(newName) {
    this.name = newName;
    return this;
  }
  
  updateEmail(newEmail) {
    this.email = newEmail;
    return this;
  }
}

module.exports = User;
```

### Exportando Funciones Constructoras

```javascript
// database.js - Función constructora para conexión a BD
function Database(config) {
  this.host = config.host || 'localhost';
  this.port = config.port || 27017;
  this.name = config.name || 'default';
  this.connected = false;
}

Database.prototype.connect = function() {
  this.connected = true;
  console.log(`Conectado a ${this.host}:${this.port}/${this.name}`);
  return this;
};

Database.prototype.disconnect = function() {
  this.connected = false;
  console.log('Desconectado de la base de datos');
  return this;
};

Database.prototype.isConnected = function() {
  return this.connected;
};

module.exports = Database;
```

## 📥 Importando Módulos

### Diferentes Formas de Importar

```javascript
// main.js - Archivo principal que importa módulos

// 1. Importar módulo completo
const math = require('./math');
console.log(math.add(5, 3));        // 8
console.log(math.multiply(4, 6));   // 24

// 2. Destructuring para importar funciones específicas
const { add, multiply, divide } = require('./math');
console.log(add(10, 5));            // 15
console.log(multiply(7, 8));        // 56
console.log(divide(20, 4));         // 5

// 3. Importar clase
const User = require('./user');
const user = new User('Juan Pérez', 'juan@example.com');
console.log(user.getName());         // Juan Pérez

// 4. Importar función constructora
const Database = require('./database');
const db = new Database({ host: 'localhost', port: 5432, name: 'myapp' });
db.connect();
```

### Importando Módulos Core

```javascript
// Módulos built-in de Node.js
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const util = require('util');

// Módulos de terceros (instalados via npm)
const express = require('express');
const mongoose = require('mongoose');
const lodash = require('lodash');
```

## 🔍 Resolución de Módulos

### Algoritmo de Resolución

Node.js sigue un algoritmo específico para resolver módulos:

```javascript
// 1. Módulos core (built-in)
const fs = require('fs');           // ✅ Módulo core
const path = require('path');       // ✅ Módulo core

// 2. Módulos locales (con ./ o ../)
const math = require('./math');     // ✅ Módulo local
const utils = require('../utils');  // ✅ Módulo local

// 3. Módulos de node_modules
const express = require('express'); // ✅ Busca en node_modules

// 4. Módulos con extensión
const config = require('./config.json'); // ✅ Con extensión específica
const helper = require('./helper.js');   // ✅ Con extensión .js
```

### Estructura de Resolución

```bash
proyecto/
├── app.js
├── package.json
├── node_modules/
│   ├── express/
│   ├── lodash/
│   └── ...
├── src/
│   ├── math.js
│   ├── user.js
│   └── database.js
└── utils/
    └── helper.js
```

```javascript
// app.js - Ejemplo de importaciones
const math = require('./src/math');           // Ruta relativa
const User = require('./src/user');           // Ruta relativa
const helper = require('./utils/helper');     // Ruta relativa
const express = require('express');           // Módulo de terceros
const fs = require('fs');                     // Módulo core
```

## 🧪 Pruebas Unitarias - Sistema de Módulos

```javascript
// tests/modules.test.js
const math = require('../src/math');
const User = require('../src/user');
const Database = require('../src/database');

describe('Sistema de Módulos', () => {
  describe('Módulo Math', () => {
    test('debe exportar todas las funciones matemáticas', () => {
      expect(math).toHaveProperty('add');
      expect(math).toHaveProperty('subtract');
      expect(math).toHaveProperty('multiply');
      expect(math).toHaveProperty('divide');
    });
    
    test('add debe sumar dos números correctamente', () => {
      expect(math.add(5, 3)).toBe(8);
      expect(math.add(-1, 1)).toBe(0);
      expect(math.add(0, 0)).toBe(0);
    });
    
    test('multiply debe multiplicar dos números correctamente', () => {
      expect(math.multiply(4, 6)).toBe(24);
      expect(math.multiply(-2, 3)).toBe(-6);
      expect(math.multiply(0, 5)).toBe(0);
    });
    
    test('divide debe dividir correctamente y manejar división por cero', () => {
      expect(math.divide(10, 2)).toBe(5);
      expect(math.divide(7, 3)).toBeCloseTo(2.333, 3);
      expect(() => math.divide(5, 0)).toThrow('División por cero no permitida');
    });
  });
  
  describe('Clase User', () => {
    let user;
    
    beforeEach(() => {
      user = new User('Ana García', 'ana@example.com');
    });
    
    test('debe crear usuario con propiedades correctas', () => {
      expect(user.name).toBe('Ana García');
      expect(user.email).toBe('ana@example.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
    
    test('debe actualizar nombre correctamente', () => {
      user.updateName('Ana María García');
      expect(user.name).toBe('Ana María García');
    });
    
    test('debe actualizar email correctamente', () => {
      user.updateEmail('ana.maria@example.com');
      expect(user.email).toBe('ana.maria@example.com');
    });
  });
  
  describe('Clase Database', () => {
    let db;
    
    beforeEach(() => {
      db = new Database({ host: 'testhost', port: 1234, name: 'testdb' });
    });
    
    test('debe inicializar con configuración correcta', () => {
      expect(db.host).toBe('testhost');
      expect(db.port).toBe(1234);
      expect(db.name).toBe('testdb');
      expect(db.connected).toBe(false);
    });
    
    test('debe conectar y desconectar correctamente', () => {
      expect(db.isConnected()).toBe(false);
      
      db.connect();
      expect(db.isConnected()).toBe(true);
      
      db.disconnect();
      expect(db.isConnected()).toBe(false);
    });
  });
});
```

## 🔄 Módulos ES6 (ESM)

### Configuración para ES Modules

```json
// package.json
{
  "name": "jsnad-practice",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/.bin/jest"
  }
}
```

### Sintaxis de ES Modules

```javascript
// math-es6.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('División por cero no permitida');
  }
  return a / b;
}

// Exportación por defecto
export default {
  add,
  subtract,
  multiply,
  divide
};
```

```javascript
// main-es6.js
import { add, multiply } from './math-es6.js';
import mathDefault from './math-es6.js';

console.log(add(5, 3));                    // 8
console.log(multiply(4, 6));               // 24
console.log(mathDefault.subtract(10, 4));  // 6
```

## 📁 Módulos de Directorio

### Estructura de Módulos de Directorio

```bash
proyecto/
├── models/
│   ├── index.js          # Archivo principal del módulo
│   ├── user.js
│   ├── product.js
│   └── order.js
├── services/
│   ├── index.js
│   ├── auth.js
│   └── email.js
└── utils/
    ├── index.js
    ├── validation.js
    └── formatting.js
```

### Archivo Index del Módulo

```javascript
// models/index.js
const User = require('./user');
const Product = require('./product');
const Order = require('./order');

module.exports = {
  User,
  Product,
  Order
};

// services/index.js
const authService = require('./auth');
const emailService = require('./email');

module.exports = {
  auth: authService,
  email: emailService
};

// utils/index.js
const validation = require('./validation');
const formatting = require('./formatting');

module.exports = {
  validation,
  formatting
};
```

### Uso de Módulos de Directorio

```javascript
// app.js
const { User, Product, Order } = require('./models');
const { auth, email } = require('./services');
const { validation, formatting } = require('./utils');

// Crear instancias
const user = new User('Juan', 'juan@example.com');
const product = new Product('Laptop', 999.99);
const order = new Order(user.id, [product.id]);

// Usar servicios
const token = auth.generateToken(user);
email.sendWelcome(user.email);

// Usar utilidades
const isValid = validation.isValidEmail(user.email);
const formatted = formatting.formatPrice(product.price);
```

## 🧪 Pruebas Unitarias - Módulos de Directorio

```javascript
// tests/module-directory.test.js
const models = require('../models');
const services = require('../services');
const utils = require('../utils');

describe('Módulos de Directorio', () => {
  describe('Models', () => {
    test('debe exportar todas las clases de modelo', () => {
      expect(models).toHaveProperty('User');
      expect(models).toHaveProperty('Product');
      expect(models).toHaveProperty('Order');
    });
    
    test('debe permitir crear instancias de User', () => {
      const user = new models.User('Test User', 'test@example.com');
      expect(user).toBeInstanceOf(models.User);
      expect(user.name).toBe('Test User');
    });
  });
  
  describe('Services', () => {
    test('debe exportar servicios de autenticación y email', () => {
      expect(services).toHaveProperty('auth');
      expect(services).toHaveProperty('email');
    });
    
    test('debe tener métodos de autenticación', () => {
      expect(typeof services.auth.generateToken).toBe('function');
    });
  });
  
  describe('Utils', () => {
    test('debe exportar utilidades de validación y formateo', () => {
      expect(utils).toHaveProperty('validation');
      expect(utils).toHaveProperty('formatting');
    });
  });
});
```

## ⚠️ Casos Edge y Mejores Práctica

### Manejo de Errores en Módulos

```javascript
// error-handling.js
function riskyOperation(data) {
  if (!data) {
    throw new Error('Datos requeridos');
  }
  
  if (typeof data !== 'object') {
    throw new TypeError('Los datos deben ser un objeto');
  }
  
  try {
    // Operación que puede fallar
    const result = JSON.parse(JSON.stringify(data));
    return result;
  } catch (error) {
    throw new Error(`Error en operación: ${error.message}`);
  }
}

module.exports = { riskyOperation };
```

### Módulos Cíclicos

```javascript
// a.js
const b = require('./b');

function functionA() {
  console.log('Función A');
  b.functionB();
}

module.exports = { functionA };

// b.js
const a = require('./a');

function functionB() {
  console.log('Función B');
  // Evitar llamada cíclica
  // a.functionA(); // ❌ Esto causaría un loop infinito
}

module.exports = { functionB };
```

### Caching de Módulos

```javascript
// Node.js cachea módulos automáticamente
const math1 = require('./math');
const math2 = require('./math');

console.log(math1 === math2); // true - Es la misma instancia

// Para forzar recarga (en desarrollo)
delete require.cache[require.resolve('./math')];
const math3 = require('./math');
console.log(math1 === math3); // false - Nueva instancia
```

## 📝 Puntos Clave - Sistema de Módulos

### ✅ Conceptos Esenciales

1. **CommonJS**: Sistema de módulos estándar de Node.js
2. **require()**: Función para importar módulos
3. **module.exports**: Objeto para exportar funcionalidad
4. **Resolución**: Algoritmo para encontrar módulos
5. **Caching**: Los módulos se cachean automáticamente
6. **Scope**: Cada módulo tiene su propio scope aislado

### ⚠️ Errores Comunes

1. **Olvidar la extensión .js en rutas relativas**
2. **Confundir require() con import/export de ES6**
3. **No manejar errores en módulos**
4. **Crear dependencias cíclicas**
5. **No entender el sistema de resolución de módulos**

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre `module.exports` y `exports`?
2. ¿En qué orden resuelve Node.js los módulos?
3. ¿Cómo se evitan las dependencias cíclicas?
4. ¿Qué significa el caching de módulos en Node.js?
5. ¿Cómo se importa un módulo de directorio?

---

**¡Continuemos con la siguiente sección: Control de Flujo Asíncrono!**
