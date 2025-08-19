# 🔄 Control de Flujo Síncrono - JSNAD

## 🎯 Introducción al Control Síncrono

El **Control de Flujo Síncrono** representa el **25% del examen JSNAD** y se refiere a cómo se ejecuta el código de forma secuencial y bloqueante. Aunque Node.js es conocido por su naturaleza asíncrona, el control de flujo síncrono es fundamental para entender cómo funciona el event loop y cómo se ejecuta el código JavaScript.

### ¿Por qué es Importante?

- **Base del Lenguaje**: JavaScript es fundamentalmente síncrono
- **Event Loop**: Entender cómo se procesa el código síncrono
- **Debugging**: Comprender el flujo de ejecución para debugging
- **Performance**: Identificar operaciones bloqueantes
- **Lógica de Negocio**: Implementar algoritmos y validaciones

## 🔀 Estructuras de Control Básicas

### Condicionales

```javascript
// if, else if, else
function validateUser(user) {
  if (!user) {
    throw new Error('Usuario requerido');
  }
  
  if (user.age < 18) {
    return { valid: false, reason: 'Menor de edad' };
  } else if (user.age > 65) {
    return { valid: false, reason: 'Mayor de 65 años' };
  } else {
    return { valid: true, reason: 'Usuario válido' };
  }
}

// Operador ternario
function getStatusMessage(isActive) {
  return isActive ? 'Usuario activo' : 'Usuario inactivo';
}

// Operador de coalescencia nula (??)
function getDefaultValue(value) {
  return value ?? 'Valor por defecto';
}

// Operador de encadenamiento opcional (?.)
function getUserName(user) {
  return user?.profile?.name || 'Usuario sin nombre';
}
```

### Bucles

```javascript
// for tradicional
function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

// for...of (iterables)
function processArray(items) {
  const results = [];
  for (const item of items) {
    if (item.isValid) {
      results.push(processItem(item));
    }
  }
  return results;
}

// for...in (propiedades de objetos)
function getObjectKeys(obj) {
  const keys = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}

// while
function findFirstValidUser(users) {
  let index = 0;
  while (index < users.length) {
    if (users[index].isValid) {
      return users[index];
    }
    index++;
  }
  return null;
}

// do...while
function retryOperation(operation, maxAttempts = 3) {
  let attempts = 0;
  do {
    attempts++;
    try {
      return operation();
    } catch (error) {
      if (attempts >= maxAttempts) {
        throw error;
      }
      console.log(`Intento ${attempts} falló, reintentando...`);
    }
  } while (attempts < maxAttempts);
}
```

### Switch Statement

```javascript
function getDayName(dayNumber) {
  switch (dayNumber) {
    case 1:
      return 'Lunes';
    case 2:
      return 'Martes';
    case 3:
      return 'Miércoles';
    case 4:
      return 'Jueves';
    case 5:
      return 'Viernes';
    case 6:
      return 'Sábado';
    case 7:
      return 'Domingo';
    default:
      throw new Error('Número de día inválido');
  }
}

// Switch con fall-through intencional
function getSeason(month) {
  switch (month) {
    case 12:
    case 1:
    case 2:
      return 'Invierno';
    case 3:
    case 4:
    case 5:
      return 'Primavera';
    case 6:
    case 7:
    case 8:
      return 'Verano';
    case 9:
    case 10:
    case 11:
      return 'Otoño';
    default:
      throw new Error('Mes inválido');
  }
}
```

## 🧪 Pruebas Unitarias - Estructuras de Control

```javascript
// tests/control-flow.test.js
const { 
  validateUser, 
  getStatusMessage, 
  getDefaultValue, 
  getUserName,
  calculateSum,
  processArray,
  getObjectKeys,
  findFirstValidUser,
  retryOperation,
  getDayName,
  getSeason
} = require('../src/control-flow');

describe('Estructuras de Control', () => {
  describe('Condicionales', () => {
    test('validateUser debe validar edad correctamente', () => {
      expect(validateUser({ age: 25 })).toEqual({ valid: true, reason: 'Usuario válido' });
      expect(validateUser({ age: 16 })).toEqual({ valid: false, reason: 'Menor de edad' });
      expect(validateUser({ age: 70 })).toEqual({ valid: false, reason: 'Mayor de 65 años' });
    });
    
    test('validateUser debe lanzar error sin usuario', () => {
      expect(() => validateUser(null)).toThrow('Usuario requerido');
      expect(() => validateUser(undefined)).toThrow('Usuario requerido');
    });
    
    test('getStatusMessage debe retornar mensaje correcto', () => {
      expect(getStatusMessage(true)).toBe('Usuario activo');
      expect(getStatusMessage(false)).toBe('Usuario inactivo');
    });
    
    test('getDefaultValue debe usar coalescencia nula', () => {
      expect(getDefaultValue('valor')).toBe('valor');
      expect(getDefaultValue(null)).toBe('Valor por defecto');
      expect(getDefaultValue(undefined)).toBe('Valor por defecto');
      expect(getDefaultValue(0)).toBe(0);
      expect(getDefaultValue('')).toBe('');
    });
    
    test('getUserName debe usar encadenamiento opcional', () => {
      expect(getUserName({ profile: { name: 'Juan' } })).toBe('Juan');
      expect(getUserName({ profile: {} })).toBe('Usuario sin nombre');
      expect(getUserName({})).toBe('Usuario sin nombre');
      expect(getUserName(null)).toBe('Usuario sin nombre');
    });
  });
  
  describe('Bucles', () => {
    test('calculateSum debe sumar array correctamente', () => {
      expect(calculateSum([1, 2, 3, 4, 5])).toBe(15);
      expect(calculateSum([])).toBe(0);
      expect(calculateSum([10])).toBe(10);
    });
    
    test('processArray debe procesar items válidos', () => {
      const items = [
        { id: 1, isValid: true, value: 'a' },
        { id: 2, isValid: false, value: 'b' },
        { id: 3, isValid: true, value: 'c' }
      ];
      
      const results = processArray(items);
      expect(results).toHaveLength(2);
      expect(results[0]).toBe('PROCESSED_a');
      expect(results[1]).toBe('PROCESSED_c');
    });
    
    test('getObjectKeys debe obtener claves del objeto', () => {
      const obj = { name: 'Juan', age: 30, email: 'juan@example.com' };
      const keys = getObjectKeys(obj);
      
      expect(keys).toContain('name');
      expect(keys).toContain('age');
      expect(keys).toContain('email');
      expect(keys).toHaveLength(3);
    });
    
    test('findFirstValidUser debe encontrar primer usuario válido', () => {
      const users = [
        { id: 1, isValid: false },
        { id: 2, isValid: true },
        { id: 3, isValid: true }
      ];
      
      const validUser = findFirstValidUser(users);
      expect(validUser.id).toBe(2);
    });
    
    test('retryOperation debe reintentar operación fallida', () => {
      let attempts = 0;
      const failingOperation = () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Operación fallida');
        }
        return 'Éxito';
      };
      
      const result = retryOperation(failingOperation, 3);
      expect(result).toBe('Éxito');
      expect(attempts).toBe(3);
    });
  });
  
  describe('Switch Statement', () => {
    test('getDayName debe retornar nombre correcto del día', () => {
      expect(getDayName(1)).toBe('Lunes');
      expect(getDayName(7)).toBe('Domingo');
      expect(() => getDayName(8)).toThrow('Número de día inválido');
      expect(() => getDayName(0)).toThrow('Número de día inválido');
    });
    
    test('getSeason debe retornar estación correcta', () => {
      expect(getSeason(1)).toBe('Invierno');
      expect(getSeason(3)).toBe('Primavera');
      expect(getSeason(6)).toBe('Verano');
      expect(getSeason(9)).toBe('Otoño');
      expect(() => getSeason(13)).toThrow('Mes inválido');
    });
  });
});
```

## 🚨 Manejo de Errores

### Try-Catch Básico

```javascript
// Manejo básico de errores
function divideNumbers(a, b) {
  try {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('Ambos argumentos deben ser números');
    }
    
    if (b === 0) {
      throw new Error('División por cero no permitida');
    }
    
    return a / b;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Error de tipo:', error.message);
      return null;
    }
    
    if (error.message.includes('cero')) {
      console.error('Error matemático:', error.message);
      return Infinity;
    }
    
    // Re-lanzar error no manejado
    throw error;
  }
}

// Try-catch con finally
function processFile(filename) {
  let fileHandle = null;
  
  try {
    fileHandle = openFile(filename);
    const content = readFile(fileHandle);
    return processContent(content);
  } catch (error) {
    console.error('Error procesando archivo:', error.message);
    throw error;
  } finally {
    if (fileHandle) {
      closeFile(fileHandle);
      console.log('Archivo cerrado');
    }
  }
}
```

### Tipos de Errores Personalizados

```javascript
// Clases de error personalizadas
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.timestamp = new Date();
  }
}

class DatabaseError extends Error {
  constructor(message, operation, table) {
    super(message);
    this.name = 'DatabaseError';
    this.operation = operation;
    this.table = table;
    this.timestamp = new Date();
  }
}

class NetworkError extends Error {
  constructor(message, url, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.url = url;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }
}

// Uso de errores personalizados
function validateUserData(userData) {
  if (!userData.name || userData.name.trim().length < 2) {
    throw new ValidationError(
      'El nombre debe tener al menos 2 caracteres',
      'name',
      userData.name
    );
  }
  
  if (!userData.email || !userData.email.includes('@')) {
    throw new ValidationError(
      'El email debe ser válido',
      'email',
      userData.email
    );
  }
  
  if (userData.age && (userData.age < 0 || userData.age > 150)) {
    throw new ValidationError(
      'La edad debe estar entre 0 y 150',
      'age',
      userData.age
    );
  }
  
  return true;
}

function saveUserToDatabase(userData) {
  try {
    validateUserData(userData);
    
    // Simular operación de base de datos
    if (Math.random() < 0.1) {
      throw new DatabaseError(
        'Error de conexión a la base de datos',
        'INSERT',
        'users'
      );
    }
    
    return { success: true, userId: Date.now() };
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`Error de validación en campo ${error.field}:`, error.message);
      throw error;
    }
    
    if (error instanceof DatabaseError) {
      console.error(`Error de base de datos en operación ${error.operation}:`, error.message);
      throw error;
    }
    
    throw error;
  }
}
```

## 🧪 Pruebas Unitarias - Manejo de Errores

```javascript
// tests/error-handling.test.js
const { 
  divideNumbers, 
  processFile,
  ValidationError,
  DatabaseError,
  NetworkError,
  validateUserData,
  saveUserToDatabase
} = require('../src/error-handling');

describe('Manejo de Errores', () => {
  describe('divideNumbers', () => {
    test('debe dividir números correctamente', () => {
      expect(divideNumbers(10, 2)).toBe(5);
      expect(divideNumbers(15, 3)).toBe(5);
      expect(divideNumbers(-10, 2)).toBe(-5);
    });
    
    test('debe manejar división por cero', () => {
      expect(divideNumbers(10, 0)).toBe(Infinity);
    });
    
    test('debe manejar argumentos no numéricos', () => {
      expect(divideNumbers('10', 2)).toBeNull();
      expect(divideNumbers(10, '2')).toBeNull();
      expect(divideNumbers(null, 2)).toBeNull();
    });
  });
  
  describe('Errores Personalizados', () => {
    test('ValidationError debe tener propiedades correctas', () => {
      const error = new ValidationError('Mensaje de error', 'name', 'valor');
      
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Mensaje de error');
      expect(error.field).toBe('name');
      expect(error.value).toBe('valor');
      expect(error.timestamp).toBeInstanceOf(Date);
    });
    
    test('DatabaseError debe tener propiedades correctas', () => {
      const error = new DatabaseError('Error de BD', 'SELECT', 'users');
      
      expect(error.name).toBe('DatabaseError');
      expect(error.operation).toBe('SELECT');
      expect(error.table).toBe('users');
    });
    
    test('NetworkError debe tener propiedades correctas', () => {
      const error = new NetworkError('Error de red', 'https://api.example.com', 500);
      
      expect(error.name).toBe('NetworkError');
      expect(error.url).toBe('https://api.example.com');
      expect(error.statusCode).toBe(500);
    });
  });
  
  describe('validateUserData', () => {
    test('debe validar datos correctos', () => {
      const userData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        age: 30
      };
      
      expect(validateUserData(userData)).toBe(true);
    });
    
    test('debe lanzar ValidationError para nombre inválido', () => {
      const userData = { name: 'J', email: 'juan@example.com' };
      
      expect(() => validateUserData(userData)).toThrow(ValidationError);
      expect(() => validateUserData(userData)).toThrow('El nombre debe tener al menos 2 caracteres');
    });
    
    test('debe lanzar ValidationError para email inválido', () => {
      const userData = { name: 'Juan Pérez', email: 'email-invalido' };
      
      expect(() => validateUserData(userData)).toThrow(ValidationError);
      expect(() => validateUserData(userData)).toThrow('El email debe ser válido');
    });
    
    test('debe lanzar ValidationError para edad inválida', () => {
      const userData = { name: 'Juan Pérez', email: 'juan@example.com', age: -5 };
      
      expect(() => validateUserData(userData)).toThrow(ValidationError);
      expect(() => validateUserData(userData)).toThrow('La edad debe estar entre 0 y 150');
    });
  });
  
  describe('saveUserToDatabase', () => {
    test('debe guardar usuario válido', () => {
      const userData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        age: 30
      };
      
      const result = saveUserToDatabase(userData);
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('userId');
    });
    
    test('debe lanzar ValidationError para datos inválidos', () => {
      const userData = { name: 'J', email: 'email-invalido' };
      
      expect(() => saveUserToDatabase(userData)).toThrow(ValidationError);
    });
  });
});
```

## 🔄 Recursión

### Conceptos Básicos

```javascript
// Recursión simple - Factorial
function factorial(n) {
  // Caso base
  if (n <= 1) {
    return 1;
  }
  
  // Caso recursivo
  return n * factorial(n - 1);
}

// Recursión con múltiples casos base
function fibonacci(n) {
  if (n <= 0) {
    return 0;
  }
  
  if (n === 1) {
    return 1;
  }
  
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Recursión con optimización (memoización)
function fibonacciMemo(n, memo = {}) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  if (memo[n] !== undefined) {
    return memo[n];
  }
  
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// Recursión para recorrer estructuras de datos
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

// Recursión para búsqueda en árbol
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function searchInTree(root, target) {
  if (!root) {
    return false;
  }
  
  if (root.value === target) {
    return true;
  }
  
  if (target < root.value) {
    return searchInTree(root.left, target);
  } else {
    return searchInTree(root.right, target);
  }
}

function traverseTreeInOrder(root, result = []) {
  if (root) {
    traverseTreeInOrder(root.left, result);
    result.push(root.value);
    traverseTreeInOrder(root.right, result);
  }
  return result;
}
```

## 🧪 Pruebas Unitarias - Recursión

```javascript
// tests/recursion.test.js
const { 
  factorial, 
  fibonacci, 
  fibonacciMemo,
  deepClone,
  TreeNode,
  searchInTree,
  traverseTreeInOrder
} = require('../src/recursion');

describe('Recursión', () => {
  describe('factorial', () => {
    test('debe calcular factorial correctamente', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });
    
    test('debe manejar números negativos', () => {
      expect(() => factorial(-1)).toThrow();
    });
  });
  
  describe('fibonacci', () => {
    test('debe calcular fibonacci correctamente', () => {
      expect(fibonacci(0)).toBe(0);
      expect(fibonacci(1)).toBe(1);
      expect(fibonacci(2)).toBe(1);
      expect(fibonacci(3)).toBe(2);
      expect(fibonacci(4)).toBe(3);
      expect(fibonacci(5)).toBe(5);
      expect(fibonacci(6)).toBe(8);
    });
  });
  
  describe('fibonacciMemo', () => {
    test('debe calcular fibonacci con memoización', () => {
      expect(fibonacciMemo(0)).toBe(0);
      expect(fibonacciMemo(1)).toBe(1);
      expect(fibonacciMemo(10)).toBe(55);
      expect(fibonacciMemo(20)).toBe(6765);
    });
    
    test('debe ser más rápido que fibonacci normal', () => {
      const startTime = Date.now();
      fibonacciMemo(30);
      const memoTime = Date.now() - startTime;
      
      const startTime2 = Date.now();
      fibonacci(30);
      const normalTime = Date.now() - startTime2;
      
      expect(memoTime).toBeLessThan(normalTime);
    });
  });
  
  describe('deepClone', () => {
    test('debe clonar objetos simples', () => {
      const obj = { name: 'Juan', age: 30 };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });
    
    test('debe clonar arrays anidados', () => {
      const obj = { 
        users: [
          { name: 'Juan', age: 30 },
          { name: 'Ana', age: 25 }
        ]
      };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned.users).not.toBe(obj.users);
      expect(cloned.users[0]).not.toBe(obj.users[0]);
    });
    
    test('debe clonar fechas', () => {
      const date = new Date('2023-01-01');
      const obj = { createdAt: date };
      const cloned = deepClone(obj);
      
      expect(cloned.createdAt).toEqual(date);
      expect(cloned.createdAt).not.toBe(date);
    });
  });
  
  describe('Árbol Binario', () => {
    let root;
    
    beforeEach(() => {
      // Crear árbol de prueba
      root = new TreeNode(10);
      root.left = new TreeNode(5);
      root.right = new TreeNode(15);
      root.left.left = new TreeNode(3);
      root.left.right = new TreeNode(7);
      root.right.left = new TreeNode(12);
      root.right.right = new TreeNode(18);
    });
    
    test('searchInTree debe encontrar valores existentes', () => {
      expect(searchInTree(root, 10)).toBe(true);
      expect(searchInTree(root, 5)).toBe(true);
      expect(searchInTree(root, 15)).toBe(true);
      expect(searchInTree(root, 3)).toBe(true);
      expect(searchInTree(root, 7)).toBe(true);
      expect(searchInTree(root, 12)).toBe(true);
      expect(searchInTree(root, 18)).toBe(true);
    });
    
    test('searchInTree debe retornar false para valores inexistentes', () => {
      expect(searchInTree(root, 1)).toBe(false);
      expect(searchInTree(root, 20)).toBe(false);
      expect(searchInTree(root, 8)).toBe(false);
    });
    
    test('traverseTreeInOrder debe recorrer en orden correcto', () => {
      const result = traverseTreeInOrder(root);
      expect(result).toEqual([3, 5, 7, 10, 12, 15, 18]);
    });
  });
});
```

## 📊 Estructuras de Datos

### Arrays y Métodos

```javascript
// Métodos de array importantes
function demonstrateArrayMethods() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // filter - Filtrar elementos
  const evenNumbers = numbers.filter(n => n % 2 === 0);
  console.log('Números pares:', evenNumbers); // [2, 4, 6, 8, 10]
  
  // map - Transformar elementos
  const doubledNumbers = numbers.map(n => n * 2);
  console.log('Números duplicados:', doubledNumbers); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  
  // reduce - Reducir a un valor
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  console.log('Suma total:', sum); // 55
  
  // find - Encontrar primer elemento
  const firstEven = numbers.find(n => n % 2 === 0);
  console.log('Primer número par:', firstEven); // 2
  
  // some - Verificar si algún elemento cumple condición
  const hasEven = numbers.some(n => n % 2 === 0);
  console.log('¿Tiene números pares?', hasEven); // true
  
  // every - Verificar si todos los elementos cumplen condición
  const allPositive = numbers.every(n => n > 0);
  console.log('¿Todos son positivos?', allPositive); // true
  
  // sort - Ordenar elementos
  const sortedDesc = numbers.sort((a, b) => b - a);
  console.log('Ordenados descendente:', sortedDesc); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  
  // slice - Extraer porción del array
  const firstFive = numbers.slice(0, 5);
  console.log('Primeros 5:', firstFive); // [1, 2, 3, 4, 5]
  
  // splice - Modificar array
  const numbersCopy = [...numbers];
  numbersCopy.splice(2, 3, 'a', 'b', 'c');
  console.log('Después de splice:', numbersCopy); // [1, 2, 'a', 'b', 'c', 6, 7, 8, 9, 10]
}

// Algoritmos de array
function findDuplicates(array) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}

function rotateArray(array, positions) {
  const length = array.length;
  const normalizedPositions = positions % length;
  
  if (normalizedPositions === 0) {
    return array;
  }
  
  const rotated = [];
  for (let i = 0; i < length; i++) {
    const newIndex = (i + normalizedPositions) % length;
    rotated[newIndex] = array[i];
  }
  
  return rotated;
}

function findMissingNumber(array) {
  const n = array.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = array.reduce((sum, num) => sum + num, 0);
  
  return expectedSum - actualSum;
}
```

### Objetos y Manipulación

```javascript
// Manipulación de objetos
function demonstrateObjectMethods() {
  const user = {
    name: 'Juan Pérez',
    age: 30,
    email: 'juan@example.com',
    address: {
      street: 'Calle Principal 123',
      city: 'Madrid',
      country: 'España'
    },
    hobbies: ['programación', 'música', 'deportes']
  };
  
  // Object.keys - Obtener claves
  const keys = Object.keys(user);
  console.log('Claves del usuario:', keys);
  
  // Object.values - Obtener valores
  const values = Object.values(user);
  console.log('Valores del usuario:', values);
  
  // Object.entries - Obtener pares clave-valor
  const entries = Object.entries(user);
  console.log('Entradas del usuario:', entries);
  
  // Object.assign - Combinar objetos
  const additionalInfo = { phone: '123-456-789', verified: true };
  const userWithPhone = Object.assign({}, user, additionalInfo);
  console.log('Usuario con teléfono:', userWithPhone);
  
  // Object.freeze - Hacer objeto inmutable
  const frozenUser = Object.freeze({ ...user });
  // frozenUser.age = 31; // Esto lanzará error en modo estricto
  
  // Object.seal - Permitir modificar propiedades existentes pero no agregar/eliminar
  const sealedUser = Object.seal({ ...user });
  sealedUser.age = 31; // ✅ Permitido
  // sealedUser.newProperty = 'value'; // ❌ No permitido
  
  // Destructuring
  const { name, age, email, ...rest } = user;
  console.log('Nombre:', name);
  console.log('Edad:', age);
  console.log('Email:', email);
  console.log('Resto:', rest);
  
  // Spread operator
  const userCopy = { ...user };
  const userWithUpdates = { ...user, age: 31, verified: true };
  
  // Deep clone
  const deepUserCopy = JSON.parse(JSON.stringify(user));
}

// Utilidades de objetos
function mergeObjects(target, ...sources) {
  return sources.reduce((merged, source) => {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          merged[key] = mergeObjects(merged[key] || {}, source[key]);
        } else {
          merged[key] = source[key];
        }
      }
    }
    return merged;
  }, { ...target });
}

function pick(object, keys) {
  return keys.reduce((picked, key) => {
    if (object.hasOwnProperty(key)) {
      picked[key] = object[key];
    }
    return picked;
  }, {});
}

function omit(object, keys) {
  return Object.keys(object)
    .filter(key => !keys.includes(key))
    .reduce((omitted, key) => {
      omitted[key] = object[key];
      return omitted;
    }, {});
}
```

## 🧪 Pruebas Unitarias - Estructuras de Datos

```javascript
// tests/data-structures.test.js
const { 
  demonstrateArrayMethods,
  findDuplicates,
  rotateArray,
  findMissingNumber,
  demonstrateObjectMethods,
  mergeObjects,
  pick,
  omit
} = require('../src/data-structures');

describe('Estructuras de Datos', () => {
  describe('Métodos de Array', () => {
    test('findDuplicates debe encontrar duplicados', () => {
      const array = [1, 2, 3, 2, 4, 5, 3, 6];
      const duplicates = findDuplicates(array);
      
      expect(duplicates).toContain(2);
      expect(duplicates).toContain(3);
      expect(duplicates).toHaveLength(2);
    });
    
    test('rotateArray debe rotar array correctamente', () => {
      const array = [1, 2, 3, 4, 5];
      
      expect(rotateArray(array, 1)).toEqual([5, 1, 2, 3, 4]);
      expect(rotateArray(array, 2)).toEqual([4, 5, 1, 2, 3]);
      expect(rotateArray(array, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(rotateArray(array, 0)).toEqual([1, 2, 3, 4, 5]);
    });
    
    test('findMissingNumber debe encontrar número faltante', () => {
      expect(findMissingNumber([1, 2, 4, 5, 6])).toBe(3);
      expect(findMissingNumber([1, 3, 4, 5, 6])).toBe(2);
      expect(findMissingNumber([2, 3, 4, 5, 6])).toBe(1);
    });
  });
  
  describe('Manipulación de Objetos', () => {
    test('mergeObjects debe combinar objetos correctamente', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 }, e: 4 };
      const obj3 = { f: 5 };
      
      const merged = mergeObjects(obj1, obj2, obj3);
      
      expect(merged).toEqual({
        a: 1,
        b: { c: 2, d: 3 },
        e: 4,
        f: 5
      });
    });
    
    test('pick debe extraer propiedades específicas', () => {
      const obj = { name: 'Juan', age: 30, email: 'juan@example.com' };
      const picked = pick(obj, ['name', 'email']);
      
      expect(picked).toEqual({
        name: 'Juan',
        email: 'juan@example.com'
      });
      expect(picked).not.toHaveProperty('age');
    });
    
    test('omit debe excluir propiedades específicas', () => {
      const obj = { name: 'Juan', age: 30, email: 'juan@example.com' };
      const omitted = omit(obj, ['age']);
      
      expect(omitted).toEqual({
        name: 'Juan',
        email: 'juan@example.com'
      });
      expect(omitted).not.toHaveProperty('age');
    });
  });
});
```

## 📝 Puntos Clave - Control de Flujo Síncrono

### ✅ Conceptos Esenciales

1. **Estructuras de Control**: if, else, switch, loops
2. **Manejo de Errores**: try-catch, throw, tipos de error personalizados
3. **Recursión**: Casos base, casos recursivos, optimización
4. **Arrays**: Métodos funcionales (map, filter, reduce, etc.)
5. **Objetos**: Manipulación, clonación, inmutabilidad
6. **Operadores**: Ternario, coalescencia nula, encadenamiento opcional

### ⚠️ Errores Comunes

1. **Recursión infinita** sin caso base
2. **No manejar errores** en operaciones críticas
3. **Mutación accidental** de objetos
4. **Uso incorrecto** de métodos de array
5. **Olvidar return** en funciones recursivas
6. **No validar** entrada de datos

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre `Object.freeze()` y `Object.seal()`?
2. ¿Cómo se evita la recursión infinita?
3. ¿Qué método de array se usa para transformar elementos?
4. ¿Cómo se clona un objeto de forma profunda?
5. ¿Cuál es la diferencia entre `some()` y `every()` en arrays?

---

**¡Continuemos con la siguiente sección: Streams!**
