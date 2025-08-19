# ⚡ Control de Flujo Asíncrono - JSNAD

## 🎯 Introducción al Control Asíncrono

El **Control de Flujo Asíncrono** es fundamental en Node.js y representa el **25% del examen JSNAD**. Node.js utiliza un modelo no bloqueante donde las operaciones I/O se ejecutan de forma asíncrona, permitiendo que la aplicación continúe ejecutándose mientras espera resultados.

### ¿Por qué es Importante?

- **Performance**: Permite manejar múltiples operaciones simultáneamente
- **Escalabilidad**: Un solo hilo puede manejar miles de conexiones
- **Responsividad**: La aplicación no se bloquea durante operaciones lentas
- **Eficiencia**: Mejor uso de recursos del sistema

## 🔄 Callbacks (Estilo Tradicional)

### Concepto Básico

Los callbacks son funciones que se pasan como argumentos a otras funciones y se ejecutan cuando se completa una operación asíncrona.

```javascript
// Ejemplo básico de callback
function fetchUserData(userId, callback) {
  // Simular operación asíncrona
  setTimeout(() => {
    const user = {
      id: userId,
      name: 'Juan Pérez',
      email: 'juan@example.com'
    };
    
    // Llamar al callback con el resultado
    callback(null, user);
  }, 1000);
}

// Uso del callback
fetchUserData(123, (error, user) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Usuario:', user);
});
```

### Callbacks Anidados (Callback Hell)

```javascript
// Ejemplo de callback hell
function processUserOrder(userId, orderId, callback) {
  // 1. Obtener usuario
  fetchUserData(userId, (userError, user) => {
    if (userError) {
      return callback(userError);
    }
    
    // 2. Obtener orden
    fetchOrderData(orderId, (orderError, order) => {
      if (orderError) {
        return callback(orderError);
      }
      
      // 3. Validar inventario
      checkInventory(order.productId, (inventoryError, available) => {
        if (inventoryError) {
          return callback(inventoryError);
        }
        
        if (!available) {
          return callback(new Error('Producto no disponible'));
        }
        
        // 4. Procesar pago
        processPayment(order.paymentInfo, (paymentError, payment) => {
          if (paymentError) {
            return callback(paymentError);
          }
          
          // 5. Confirmar orden
          confirmOrder(orderId, (confirmError, confirmation) => {
            if (confirmError) {
              return callback(confirmError);
            }
            
            callback(null, { user, order, payment, confirmation });
          });
        });
      });
    });
  });
}
```

### Patrón Error-First

```javascript
// Patrón estándar de Node.js: (error, result)
function readFileAsync(filename, callback) {
  // Simular lectura de archivo
  setTimeout(() => {
    try {
      // Simular error aleatorio
      if (Math.random() < 0.3) {
        throw new Error('Error de lectura del archivo');
      }
      
      const content = `Contenido del archivo ${filename}`;
      callback(null, content); // Primer parámetro: null (sin error)
    } catch (error) {
      callback(error); // Primer parámetro: error
    }
  }, 500);
}

// Uso del patrón error-first
readFileAsync('documento.txt', (error, content) => {
  if (error) {
    console.error('Error al leer archivo:', error.message);
    return;
  }
  console.log('Contenido:', content);
});
```

## 🧪 Pruebas Unitarias - Callbacks

```javascript
// tests/callbacks.test.js
const { fetchUserData, processUserOrder, readFileAsync } = require('../src/callbacks');

describe('Callbacks', () => {
  describe('fetchUserData', () => {
    test('debe retornar usuario correctamente', (done) => {
      fetchUserData(123, (error, user) => {
        expect(error).toBeNull();
        expect(user).toEqual({
          id: 123,
          name: 'Juan Pérez',
          email: 'juan@example.com'
        });
        done();
      });
    });
    
    test('debe manejar errores correctamente', (done) => {
      // Simular error
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = (callback) => {
        callback(new Error('Error simulado'));
      };
      
      fetchUserData(123, (error, user) => {
        expect(error).toBeInstanceOf(Error);
        expect(user).toBeUndefined();
        
        // Restaurar setTimeout original
        global.setTimeout = originalSetTimeout;
        done();
      });
    });
  });
  
  describe('readFileAsync', () => {
    test('debe retornar contenido del archivo', (done) => {
      readFileAsync('test.txt', (error, content) => {
        if (error) {
          // Si hay error, es parte del test (30% probabilidad)
          expect(error).toBeInstanceOf(Error);
          done();
        } else {
          expect(content).toContain('test.txt');
          done();
        }
      });
    });
  });
});
```

## 🌟 Promises

### Introducción a Promises

Las Promises son objetos que representan el resultado eventual de una operación asíncrona. Resuelven el problema del "callback hell" y proporcionan una API más limpia.

### Estados de una Promise

1. **Pending**: Estado inicial, ni cumplida ni rechazada
2. **Fulfilled**: Operación completada exitosamente
3. **Rejected**: Operación falló

### Creando Promises

```javascript
// Crear una Promise
function fetchUserDataPromise(userId) {
  return new Promise((resolve, reject) => {
    // Simular operación asíncrona
    setTimeout(() => {
      try {
        // Simular validación
        if (userId <= 0) {
          throw new Error('ID de usuario inválido');
        }
        
        const user = {
          id: userId,
          name: 'Juan Pérez',
          email: 'juan@example.com',
          createdAt: new Date()
        };
        
        resolve(user); // Promise cumplida exitosamente
      } catch (error) {
        reject(error); // Promise rechazada
      }
    }, 1000);
  });
}

// Uso básico de Promise
fetchUserDataPromise(123)
  .then(user => {
    console.log('Usuario obtenido:', user);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

### Métodos de Promise

```javascript
// Promise.all() - Todas las promises deben cumplirse
function fetchMultipleUsers(userIds) {
  const promises = userIds.map(id => fetchUserDataPromise(id));
  
  return Promise.all(promises);
}

// Promise.race() - Primera promise que se complete
function fetchUserWithTimeout(userId, timeoutMs) {
  const userPromise = fetchUserDataPromise(userId);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeoutMs);
  });
  
  return Promise.race([userPromise, timeoutPromise]);
}

// Promise.allSettled() - Todas las promises se resuelven (cumplidas o rechazadas)
function fetchUsersWithFallback(userIds) {
  const promises = userIds.map(id => 
    fetchUserDataPromise(id).catch(error => ({ error, userId: id }))
  );
  
  return Promise.allSettled(promises);
}

// Promise.any() - Primera promise cumplida (ignora rechazos)
function fetchUserFromMultipleSources(userId) {
  const source1 = fetchUserDataPromise(userId);
  const source2 = fetchUserDataPromise(userId);
  const source3 = fetchUserDataPromise(userId);
  
  return Promise.any([source1, source2, source3]);
}
```

### Encadenamiento de Promises

```javascript
// Encadenamiento para evitar callback hell
function processUserOrderPromise(userId, orderId) {
  return fetchUserDataPromise(userId)
    .then(user => {
      console.log('Usuario obtenido:', user.name);
      return fetchOrderDataPromise(orderId);
    })
    .then(order => {
      console.log('Orden obtenida:', order.id);
      return checkInventoryPromise(order.productId);
    })
    .then(available => {
      if (!available) {
        throw new Error('Producto no disponible');
      }
      return processPaymentPromise(order.paymentInfo);
    })
    .then(payment => {
      console.log('Pago procesado:', payment.id);
      return confirmOrderPromise(orderId);
    })
    .then(confirmation => {
      return { user, order, payment, confirmation };
    });
}

// Uso del encadenamiento
processUserOrderPromise(123, 456)
  .then(result => {
    console.log('Orden procesada exitosamente:', result);
  })
  .catch(error => {
    console.error('Error al procesar orden:', error.message);
  });
```

## 🧪 Pruebas Unitarias - Promises

```javascript
// tests/promises.test.js
const { 
  fetchUserDataPromise, 
  fetchMultipleUsers, 
  fetchUserWithTimeout,
  processUserOrderPromise 
} = require('../src/promises');

describe('Promises', () => {
  describe('fetchUserDataPromise', () => {
    test('debe resolver con usuario válido', async () => {
      const user = await fetchUserDataPromise(123);
      
      expect(user).toHaveProperty('id', 123);
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('createdAt');
    });
    
    test('debe rechazar con ID inválido', async () => {
      await expect(fetchUserDataPromise(0)).rejects.toThrow('ID de usuario inválido');
      await expect(fetchUserDataPromise(-1)).rejects.toThrow('ID de usuario inválido');
    });
  });
  
  describe('fetchMultipleUsers', () => {
    test('debe resolver todas las promises', async () => {
      const users = await fetchMultipleUsers([1, 2, 3]);
      
      expect(users).toHaveLength(3);
      expect(users[0]).toHaveProperty('id', 1);
      expect(users[1]).toHaveProperty('id', 2);
      expect(users[2]).toHaveProperty('id', 3);
    });
    
    test('debe rechazar si alguna promise falla', async () => {
      await expect(fetchMultipleUsers([1, 0, 3])).rejects.toThrow('ID de usuario inválido');
    });
  });
  
  describe('fetchUserWithTimeout', () => {
    test('debe resolver antes del timeout', async () => {
      const user = await fetchUserWithTimeout(123, 2000);
      expect(user).toHaveProperty('id', 123);
    });
    
    test('debe rechazar por timeout', async () => {
      await expect(fetchUserWithTimeout(123, 100)).rejects.toThrow('Timeout');
    });
  });
  
  describe('processUserOrderPromise', () => {
    test('debe procesar orden completa', async () => {
      const result = await processUserOrderPromise(123, 456);
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('order');
      expect(result).toHaveProperty('payment');
      expect(result).toHaveProperty('confirmation');
    });
  });
});
```

## 🚀 Async/Await

### Sintaxis Moderna

Async/await es una sintaxis más limpia para trabajar con Promises, introducida en ES2017. Hace que el código asíncrono se vea más como código síncrono.

### Función Async

```javascript
// Función async básica
async function fetchUserDataAsync(userId) {
  try {
    // Simular operación asíncrona
    const user = await fetchUserDataPromise(userId);
    return user;
  } catch (error) {
    throw new Error(`Error al obtener usuario: ${error.message}`);
  }
}

// Función async con múltiples awaits
async function processUserOrderAsync(userId, orderId) {
  try {
    // Obtener usuario
    const user = await fetchUserDataPromise(userId);
    console.log('Usuario obtenido:', user.name);
    
    // Obtener orden
    const order = await fetchOrderDataPromise(orderId);
    console.log('Orden obtenida:', order.id);
    
    // Verificar inventario
    const available = await checkInventoryPromise(order.productId);
    if (!available) {
      throw new Error('Producto no disponible');
    }
    
    // Procesar pago
    const payment = await processPaymentPromise(order.paymentInfo);
    console.log('Pago procesado:', payment.id);
    
    // Confirmar orden
    const confirmation = await confirmOrderPromise(orderId);
    
    return { user, order, payment, confirmation };
  } catch (error) {
    console.error('Error en proceso:', error.message);
    throw error;
  }
}
```

### Manejo de Errores con Try-Catch

```javascript
// Manejo de errores con async/await
async function handleUserOperation(userId) {
  try {
    const user = await fetchUserDataAsync(userId);
    const orders = await fetchUserOrdersAsync(userId);
    const profile = await fetchUserProfileAsync(userId);
    
    return { user, orders, profile };
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      console.log('Usuario no encontrado, creando perfil por defecto');
      return createDefaultProfile(userId);
    }
    
    if (error.message.includes('timeout')) {
      console.log('Operación tardó demasiado, reintentando...');
      return retryOperation(userId);
    }
    
    // Re-lanzar error para manejo superior
    throw error;
  }
}

// Función async que siempre retorna una Promise
async function alwaysReturnsPromise() {
  return 'Este valor se envuelve en una Promise';
}

// Función async que puede retornar undefined
async function mightReturnUndefined() {
  if (Math.random() > 0.5) {
    return 'Valor retornado';
  }
  // Retorna undefined (se convierte en Promise.resolve(undefined))
}
```

### Promises en Paralelo

```javascript
// Ejecutar promises en paralelo para mejor performance
async function fetchUserDataParallel(userId) {
  try {
    // Ejecutar todas las operaciones en paralelo
    const [user, orders, profile, preferences] = await Promise.all([
      fetchUserDataPromise(userId),
      fetchUserOrdersPromise(userId),
      fetchUserProfilePromise(userId),
      fetchUserPreferencesPromise(userId)
    ]);
    
    return { user, orders, profile, preferences };
  } catch (error) {
    console.error('Error al obtener datos en paralelo:', error);
    throw error;
  }
}

// Ejemplo con Promise.allSettled para operaciones independientes
async function fetchUserDataResilient(userId) {
  const results = await Promise.allSettled([
    fetchUserDataPromise(userId),
    fetchUserOrdersPromise(userId),
    fetchUserProfilePromise(userId),
    fetchUserPreferencesPromise(userId)
  ]);
  
  const [userResult, ordersResult, profileResult, preferencesResult] = results;
  
  return {
    user: userResult.status === 'fulfilled' ? userResult.value : null,
    orders: ordersResult.status === 'fulfilled' ? ordersResult.value : [],
    profile: profileResult.status === 'fulfilled' ? profileResult.value : {},
    preferences: preferencesResult.status === 'fulfilled' ? preferencesResult.value : {}
  };
}
```

## 🧪 Pruebas Unitarias - Async/Await

```javascript
// tests/async-await.test.js
const { 
  fetchUserDataAsync, 
  processUserOrderAsync, 
  fetchUserDataParallel,
  fetchUserDataResilient 
} = require('../src/async-await');

describe('Async/Await', () => {
  describe('fetchUserDataAsync', () => {
    test('debe retornar usuario correctamente', async () => {
      const user = await fetchUserDataAsync(123);
      
      expect(user).toHaveProperty('id', 123);
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });
    
    test('debe manejar errores correctamente', async () => {
      await expect(fetchUserDataAsync(0)).rejects.toThrow('Error al obtener usuario');
    });
  });
  
  describe('processUserOrderAsync', () => {
    test('debe procesar orden completa', async () => {
      const result = await processUserOrderAsync(123, 456);
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('order');
      expect(result).toHaveProperty('payment');
      expect(result).toHaveProperty('confirmation');
    });
    
    test('debe manejar errores en el proceso', async () => {
      // Mock de checkInventoryPromise para que falle
      jest.spyOn(global, 'checkInventoryPromise').mockRejectedValue(new Error('Producto no disponible'));
      
      await expect(processUserOrderAsync(123, 456)).rejects.toThrow('Producto no disponible');
    });
  });
  
  describe('fetchUserDataParallel', () => {
    test('debe ejecutar operaciones en paralelo', async () => {
      const startTime = Date.now();
      const result = await fetchUserDataParallel(123);
      const endTime = Date.now();
      
      // Debe tomar menos de 2 segundos (operaciones en paralelo)
      expect(endTime - startTime).toBeLessThan(2000);
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('orders');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('preferences');
    });
  });
  
  describe('fetchUserDataResilient', () => {
    test('debe manejar fallos parciales', async () => {
      const result = await fetchUserDataResilient(123);
      
      // Al menos el usuario debe estar disponible
      expect(result.user).not.toBeNull();
      
      // Otros campos pueden ser null/empty si fallan
      expect(result).toHaveProperty('orders');
      expect(result).toHaveProperty('profile');
      expect(result).toHaveProperty('preferences');
    });
  });
});
```

## 🔄 Event Emitters

### Sistema de Eventos de Node.js

Node.js tiene un sistema de eventos integrado que permite crear aplicaciones basadas en eventos.

```javascript
const EventEmitter = require('events');

// Crear clase que extiende EventEmitter
class UserService extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
  }
  
  createUser(userData) {
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date()
    };
    
    this.users.set(user.id, user);
    
    // Emitir evento de usuario creado
    this.emit('user:created', user);
    
    return user;
  }
  
  updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      this.emit('user:error', error);
      throw error;
    }
    
    Object.assign(user, updates, { updatedAt: new Date() });
    
    // Emitir evento de usuario actualizado
    this.emit('user:updated', user);
    
    return user;
  }
  
  deleteUser(id) {
    const user = this.users.get(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      this.emit('user:error', error);
      throw error;
    }
    
    this.users.delete(id);
    
    // Emitir evento de usuario eliminado
    this.emit('user:deleted', user);
    
    return user;
  }
}

// Uso del servicio de usuarios
const userService = new UserService();

// Escuchar eventos
userService.on('user:created', (user) => {
  console.log('Usuario creado:', user.name);
});

userService.on('user:updated', (user) => {
  console.log('Usuario actualizado:', user.name);
});

userService.on('user:deleted', (user) => {
  console.log('Usuario eliminado:', user.name);
});

userService.on('user:error', (error) => {
  console.error('Error en servicio de usuarios:', error.message);
});

// Crear usuarios
const user1 = userService.createUser({ name: 'Juan', email: 'juan@example.com' });
const user2 = userService.createUser({ name: 'Ana', email: 'ana@example.com' });

// Actualizar usuario
userService.updateUser(user1.id, { name: 'Juan Carlos' });

// Eliminar usuario
userService.deleteUser(user2.id);
```

## 🧪 Pruebas Unitarias - Event Emitters

```javascript
// tests/event-emitters.test.js
const EventEmitter = require('events');
const { UserService } = require('../src/event-emitters');

describe('Event Emitters', () => {
  let userService;
  
  beforeEach(() => {
    userService = new UserService();
  });
  
  test('debe emitir evento user:created al crear usuario', (done) => {
    userService.on('user:created', (user) => {
      expect(user).toHaveProperty('name', 'Test User');
      expect(user).toHaveProperty('email', 'test@example.com');
      done();
    });
    
    userService.createUser({ name: 'Test User', email: 'test@example.com' });
  });
  
  test('debe emitir evento user:updated al actualizar usuario', (done) => {
    const user = userService.createUser({ name: 'Test User', email: 'test@example.com' });
    
    userService.on('user:updated', (updatedUser) => {
      expect(updatedUser.name).toBe('Updated User');
      expect(updatedUser).toHaveProperty('updatedAt');
      done();
    });
    
    userService.updateUser(user.id, { name: 'Updated User' });
  });
  
  test('debe emitir evento user:deleted al eliminar usuario', (done) => {
    const user = userService.createUser({ name: 'Test User', email: 'test@example.com' });
    
    userService.on('user:deleted', (deletedUser) => {
      expect(deletedUser.id).toBe(user.id);
      done();
    });
    
    userService.deleteUser(user.id);
  });
  
  test('debe emitir evento user:error al intentar operación inválida', (done) => {
    userService.on('user:error', (error) => {
      expect(error.message).toBe('Usuario no encontrado');
      done();
    });
    
    expect(() => {
      userService.updateUser(999, { name: 'Test' });
    }).toThrow('Usuario no encontrado');
  });
  
  test('debe permitir múltiples listeners para el mismo evento', () => {
    const events = [];
    
    userService.on('user:created', (user) => {
      events.push(`Listener 1: ${user.name}`);
    });
    
    userService.on('user:created', (user) => {
      events.push(`Listener 2: ${user.name}`);
    });
    
    userService.createUser({ name: 'Test User', email: 'test@example.com' });
    
    expect(events).toHaveLength(2);
    expect(events[0]).toBe('Listener 1: Test User');
    expect(events[1]).toBe('Listener 2: Test User');
  });
});
```

## 📝 Puntos Clave - Control de Flujo Asíncrono

### ✅ Conceptos Esenciales

1. **Callbacks**: Función que se ejecuta cuando se completa una operación
2. **Patrón Error-First**: (error, result) es el estándar de Node.js
3. **Promises**: Objetos que representan operaciones asíncronas
4. **Async/Await**: Sintaxis moderna para trabajar con Promises
5. **Event Emitters**: Sistema de eventos para comunicación entre componentes
6. **Promise.all()**: Ejecutar múltiples promises en paralelo
7. **Promise.race()**: Primera promise que se complete
8. **Promise.allSettled()**: Todas las promises se resuelven

### ⚠️ Errores Comunes

1. **Callback Hell**: Anidar demasiados callbacks
2. **No manejar errores en Promises**
3. **Olvidar await en funciones async**
4. **No usar try-catch con async/await**
5. **Confundir Promise.all() con Promise.race()**
6. **No limpiar event listeners**

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre `Promise.all()` y `Promise.race()`?
2. ¿Cómo se maneja un error en una función async?
3. ¿Qué es el patrón error-first en Node.js?
4. ¿Cómo se ejecutan múltiples promises en paralelo?
5. ¿Cuál es la diferencia entre `process.nextTick()` y `setImmediate()`?

---

**¡Continuemos con la siguiente sección: Control de Flujo Síncrono!**
