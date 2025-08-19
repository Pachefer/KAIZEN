# Node.js Design Patterns - Capítulo 8: Patrones de Diseño Estructurales

## Introducción a los Patrones Estructurales

Los patrones estructurales se enfocan en la composición de clases y objetos, facilitando la creación de estructuras complejas y flexibles. Estos patrones ayudan a organizar el código de manera que sea más fácil de mantener y extender.

## 1. Proxy Pattern (Patrón Proxy)

### 1.1 Proxy con Composición

El patrón Proxy actúa como un intermediario que controla el acceso a otro objeto, proporcionando funcionalidad adicional como validación, logging, o control de acceso.

```javascript
// PROXY PATTERN - PROXY CON COMPOSICIÓN
// El proxy actúa como intermediario y controla el acceso al objeto real

class StackCalculator {
  constructor() {
    this.stack = []
  }

  // MÉTODO PARA AGREGAR VALORES A LA PILA
  putValue(value) {
    this.stack.push(value)
  }

  // MÉTODO PARA OBTENER Y REMOVER EL ÚLTIMO VALOR
  getValue() {
    return this.stack.pop()
  }

  // MÉTODO PARA VER EL ÚLTIMO VALOR SIN REMOVERLO
  peekValue() {
    return this.stack[this.stack.length - 1]
  }

  // MÉTODO PARA LIMPIAR LA PILA
  clear() {
    this.stack = []
  }

  // MÉTODO DE DIVISIÓN (puede causar división por cero)
  divide() {
    const divisor = this.getValue()      // Obtiene el divisor
    const dividend = this.getValue()     // Obtiene el dividendo
    const result = dividend / divisor    // Realiza la división
    this.putValue(result)               // Guarda el resultado
    return result
  }

  // MÉTODO DE MULTIPLICACIÓN
  multiply() {
    const multiplicand = this.getValue()    // Obtiene el multiplicando
    const multiplier = this.getValue()      // Obtiene el multiplicador
    const result = multiplier * multiplicand // Realiza la multiplicación
    this.putValue(result)                  // Guarda el resultado
    return result
  }
}

// PROXY SEGURO QUE VALIDA ANTES DE EJECUTAR
class SafeCalculator {
  constructor(calculator) {
    this.calculator = calculator // Referencia al objeto real
  }

  // MÉTODO PROXY CON VALIDACIÓN ADICIONAL
  divide() {
    // LÓGICA DE VALIDACIÓN ADICIONAL
    const divisor = this.calculator.peekValue() // Verifica sin remover
    if (divisor === 0) {
      throw new Error('División por 0 no está permitida')
    }
    // Si es válido, delega al objeto real
    return this.calculator.divide()
  }

  // MÉTODOS DELEGADOS - Pasan directamente al objeto real
  putValue(value) {
    return this.calculator.putValue(value)
  }

  getValue() {
    return this.calculator.getValue()
  }

  peekValue() {
    return this.calculator.peekValue()
  }

  clear() {
    return this.calculator.clear()
  }

  multiply() {
    return this.calculator.multiply()
  }
}

// USO DEL PATRÓN PROXY
const calculator = new StackCalculator()
const safeCalculator = new SafeCalculator(calculator)

// PRUEBA CON CALCULADORA NORMAL
calculator.putValue(3)
calculator.putValue(2)
console.log('Calculadora normal - Multiplicación:', calculator.multiply()) // 3*2 = 6

// PRUEBA CON CALCULADORA SEGURA
safeCalculator.putValue(2)
console.log('Calculadora segura - Multiplicación:', safeCalculator.multiply()) // 6*2 = 12

// PRUEBA DE DIVISIÓN POR CERO CON CALCULADORA NORMAL
calculator.putValue(0)
console.log('Calculadora normal - División por cero:', calculator.divide()) // 12/0 = Infinity

// PRUEBA DE DIVISIÓN POR CERO CON CALCULADORA SEGURA
safeCalculator.clear()
safeCalculator.putValue(4)
safeCalculator.putValue(0)
try {
  console.log('Calculadora segura - División por cero:', safeCalculator.divide())
} catch (error) {
  console.log('✅ Error capturado:', error.message) // Error: División por 0 no está permitida
}
```

**¿Por qué usar el patrón Proxy?**
- **Control de acceso**: Valida o controla el acceso a métodos
- **Funcionalidad adicional**: Agrega logging, caching, validación
- **Seguridad**: Previene operaciones peligrosas
- **Transparencia**: El cliente no sabe que está usando un proxy

### 1.2 Proxy con Object Literal

```javascript
// PROXY CON OBJECT LITERAL
// Usando objetos literales para crear proxies simples

class DatabaseService {
  constructor() {
    this.connections = 0
    this.maxConnections = 5
  }
  
  connect() {
    if (this.connections >= this.maxConnections) {
      throw new Error('Límite de conexiones alcanzado')
    }
    this.connections++
    console.log(`🔌 Conexión establecida. Total: ${this.connections}`)
    return { id: this.connections, status: 'connected' }
  }
  
  disconnect(connectionId) {
    if (this.connections > 0) {
      this.connections--
      console.log(`🔌 Conexión ${connectionId} cerrada. Total: ${this.connections}`)
      return true
    }
    return false
  }
  
  query(sql) {
    if (this.connections === 0) {
      throw new Error('No hay conexiones activas')
    }
    console.log(`📊 Ejecutando query: ${sql}`)
    return { result: 'datos simulados', rows: 10 }
  }
}

// PROXY CON OBJECT LITERAL
function createDatabaseProxy(database) {
  return {
    // PROPIEDADES DEL OBJETO REAL
    connections: database.connections,
    maxConnections: database.maxConnections,
    
    // MÉTODO PROXY CON LOGGING
    connect() {
      console.log('🔄 [PROXY] Intentando conectar a la base de datos...')
      try {
        const result = database.connect()
        console.log('✅ [PROXY] Conexión exitosa')
        return result
      } catch (error) {
        console.error('❌ [PROXY] Error de conexión:', error.message)
        throw error
      }
    },
    
    // MÉTODO PROXY CON VALIDACIÓN
    disconnect(connectionId) {
      console.log(`🔄 [PROXY] Cerrando conexión ${connectionId}...`)
      const result = database.disconnect(connectionId)
      if (result) {
        console.log('✅ [PROXY] Conexión cerrada exitosamente')
      } else {
        console.log('⚠️ [PROXY] No hay conexiones para cerrar')
      }
      return result
    },
    
    // MÉTODO PROXY CON MONITOREO
    query(sql) {
      console.log(`🔄 [PROXY] Ejecutando query: ${sql}`)
      const startTime = Date.now()
      
      try {
        const result = database.query(sql)
        const endTime = Date.now()
        console.log(`✅ [PROXY] Query completada en ${endTime - startTime}ms`)
        return result
      } catch (error) {
        console.error('❌ [PROXY] Error en query:', error.message)
        throw error
      }
    }
  }
}

// USO DEL PROXY CON OBJECT LITERAL
const db = new DatabaseService()
const dbProxy = createDatabaseProxy(db)

// Probamos el proxy
try {
  const conn1 = dbProxy.connect()
  const conn2 = dbProxy.connect()
  
  dbProxy.query('SELECT * FROM usuarios')
  dbProxy.query('SELECT COUNT(*) FROM productos')
  
  dbProxy.disconnect(conn1.id)
  dbProxy.disconnect(conn2.id)
  
} catch (error) {
  console.error('Error en operaciones:', error.message)
}
```

### 1.3 Proxy Reactivo

```javascript
// PROXY REACTIVO - REACCIONA A CAMBIOS EN TIEMPO REAL
// Usando Proxy de ES6 para interceptar operaciones

class ReactiveObject {
  constructor(data = {}) {
    this.data = data
    this.listeners = new Map()
    this.proxy = this.createReactiveProxy()
  }
  
  // CREAMOS UN PROXY REACTIVO
  createReactiveProxy() {
    const self = this
    
    return new Proxy(this.data, {
      // INTERCEPTAMOS ASIGNACIONES DE PROPIEDADES
      set(target, property, value) {
        const oldValue = target[property]
        target[property] = value
        
        // NOTIFICAMOS A LOS LISTENERS SI EL VALOR CAMBIÓ
        if (oldValue !== value) {
          self.notifyListeners(property, value, oldValue)
        }
        
        return true
      },
      
      // INTERCEPTAMOS LECTURAS DE PROPIEDADES
      get(target, property) {
        return target[property]
      },
      
      // INTERCEPTAMOS ELIMINACIÓN DE PROPIEDADES
      deleteProperty(target, property) {
        const oldValue = target[property]
        delete target[property]
        
        // NOTIFICAMOS A LOS LISTENERS
        self.notifyListeners(property, undefined, oldValue)
        
        return true
      }
    })
  }
  
  // AGREGAR LISTENER PARA UNA PROPIEDAD
  on(property, callback) {
    if (!this.listeners.has(property)) {
      this.listeners.set(property, [])
    }
    this.listeners.get(property).push(callback)
  }
  
  // REMOVER LISTENER
  off(property, callback) {
    if (this.listeners.has(property)) {
      const callbacks = this.listeners.get(property)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  
  // NOTIFICAR A TODOS LOS LISTENERS
  notifyListeners(property, newValue, oldValue) {
    if (this.listeners.has(property)) {
      this.listeners.get(property).forEach(callback => {
        callback(newValue, oldValue, property)
      })
    }
  }
  
  // OBTENER EL PROXY REACTIVO
  getProxy() {
    return this.proxy
  }
}

// USO DEL OBJETO REACTIVO
const reactiveUser = new ReactiveObject({
  nombre: 'Juan',
  edad: 25,
  email: 'juan@email.com'
})

const userProxy = reactiveUser.getProxy()

// AGREGAMOS LISTENERS PARA DIFERENTES PROPIEDADES
reactiveUser.on('nombre', (newValue, oldValue, property) => {
  console.log(`🔄 [REACTIVO] ${property} cambió de "${oldValue}" a "${newValue}"`)
})

reactiveUser.on('edad', (newValue, oldValue, property) => {
  console.log(`🔄 [REACTIVO] ${property} cambió de ${oldValue} a ${newValue}`)
  
  // LÓGICA ADICIONAL BASADA EN EL CAMBIO
  if (newValue >= 18) {
    console.log('🎉 Usuario es mayor de edad')
  } else {
    console.log('⚠️ Usuario es menor de edad')
  }
})

reactiveUser.on('email', (newValue, oldValue, property) => {
  console.log(`🔄 [REACTIVO] ${property} cambió de "${oldValue}" a "${newValue}"`)
  
  // VALIDACIÓN DE EMAIL
  if (newValue && !newValue.includes('@')) {
    console.log('❌ Email inválido detectado')
  }
})

// MODIFICAMOS LAS PROPIEDADES - LOS LISTENERS SE EJECUTAN AUTOMÁTICAMENTE
console.log('👤 Usuario inicial:', userProxy)

userProxy.nombre = 'Juan Carlos'
userProxy.edad = 26
userProxy.email = 'juan.carlos@email.com'

console.log('👤 Usuario final:', userProxy)
```

## 2. Decorator Pattern (Patrón Decorador)

### 2.1 Decorator con Composición

```javascript
// DECORATOR PATTERN - DECORADOR CON COMPOSICIÓN
// Agrega funcionalidad a objetos existentes sin modificar su clase

// INTERFAZ BASE PARA SERVICIOS
class BaseService {
  execute(data) {
    console.log('🔧 Ejecutando servicio base con:', data)
    return { success: true, data }
  }
}

// DECORADOR PARA LOGGING
class LoggingDecorator {
  constructor(service) {
    this.service = service
  }
  
  execute(data) {
    console.log('📝 [LOGGING] Iniciando ejecución del servicio')
    const startTime = Date.now()
    
    try {
      const result = this.service.execute(data)
      const endTime = Date.now()
      
      console.log('📝 [LOGGING] Servicio completado exitosamente')
      console.log(`📝 [LOGGING] Tiempo de ejecución: ${endTime - startTime}ms`)
      
      return result
    } catch (error) {
      console.error('📝 [LOGGING] Error en el servicio:', error.message)
      throw error
    }
  }
}

// DECORADOR PARA CACHING
class CachingDecorator {
  constructor(service) {
    this.service = service
    this.cache = new Map()
  }
  
  execute(data) {
    const cacheKey = JSON.stringify(data)
    
    // VERIFICAMOS SI TENEMOS EL RESULTADO EN CACHE
    if (this.cache.has(cacheKey)) {
      console.log('💾 [CACHE] Resultado obtenido del cache')
      return this.cache.get(cacheKey)
    }
    
    // EJECUTAMOS EL SERVICIO Y GUARDAMOS EN CACHE
    console.log('💾 [CACHE] Ejecutando servicio y guardando en cache')
    const result = this.service.execute(data)
    this.cache.set(cacheKey, result)
    
    return result
  }
  
  // MÉTODO PARA LIMPIAR EL CACHE
  clearCache() {
    this.cache.clear()
    console.log('💾 [CACHE] Cache limpiado')
  }
}

// DECORADOR PARA VALIDACIÓN
class ValidationDecorator {
  constructor(service, validator) {
    this.service = service
    this.validator = validator
  }
  
  execute(data) {
    console.log('✅ [VALIDATION] Validando datos de entrada')
    
    // VALIDAMOS LOS DATOS ANTES DE EJECUTAR
    const validationResult = this.validator.validate(data)
    if (!validationResult.isValid) {
      throw new Error(`Datos inválidos: ${validationResult.errors.join(', ')}`)
    }
    
    console.log('✅ [VALIDATION] Datos válidos, ejecutando servicio')
    return this.service.execute(data)
  }
}

// VALIDADOR SIMPLE
class DataValidator {
  validate(data) {
    const errors = []
    
    if (!data || typeof data !== 'object') {
      errors.push('Los datos deben ser un objeto')
    }
    
    if (data.id && typeof data.id !== 'number') {
      errors.push('El ID debe ser un número')
    }
    
    if (data.nombre && typeof data.nombre !== 'string') {
      errors.push('El nombre debe ser una cadena')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// USO DE LOS DECORADORES
const baseService = new BaseService()
const validator = new DataValidator()

// APLICAMOS DECORADORES EN CADENA
const decoratedService = new ValidationDecorator(
  new CachingDecorator(
    new LoggingDecorator(baseService)
  ),
  validator
)

// PROBAMOS EL SERVICIO DECORADO
try {
  console.log('🚀 Primera ejecución:')
  const result1 = decoratedService.execute({ id: 1, nombre: 'Juan' })
  console.log('Resultado 1:', result1)
  
  console.log('\n🚀 Segunda ejecución (debería usar cache):')
  const result2 = decoratedService.execute({ id: 1, nombre: 'Juan' })
  console.log('Resultado 2:', result2)
  
  console.log('\n🚀 Ejecución con datos inválidos:')
  decoratedService.execute({ id: 'inválido', nombre: 123 })
  
} catch (error) {
  console.error('❌ Error:', error.message)
}
```

### 2.2 Decorator con Object Augmentation

```javascript
// DECORADOR CON AUGMENTACIÓN DE OBJETOS
// Modifica objetos existentes agregando métodos y propiedades

class UserService {
  constructor() {
    this.users = new Map()
  }
  
  createUser(userData) {
    const id = Date.now()
    const user = { id, ...userData, createdAt: new Date() }
    this.users.set(id, user)
    return user
  }
  
  getUser(id) {
    return this.users.get(id)
  }
  
  updateUser(id, updates) {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }
  
  deleteUser(id) {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    
    this.users.delete(id)
    return user
  }
}

// FUNCIÓN PARA DECORAR CON LOGGING
function addLogging(service) {
  const originalMethods = {}
  
  // GUARDAMOS REFERENCIAS A LOS MÉTODOS ORIGINALES
  Object.getOwnPropertyNames(Object.getPrototypeOf(service))
    .filter(name => name !== 'constructor')
    .forEach(methodName => {
      originalMethods[methodName] = service[methodName]
    })
  
  // DECORAMOS CADA MÉTODO
  Object.keys(originalMethods).forEach(methodName => {
    service[methodName] = function(...args) {
      console.log(`📝 [LOGGING] Llamando a ${methodName} con argumentos:`, args)
      
      try {
        const result = originalMethods[methodName].apply(this, args)
        console.log(`📝 [LOGGING] ${methodName} ejecutado exitosamente`)
        return result
      } catch (error) {
        console.error(`📝 [LOGGING] Error en ${methodName}:`, error.message)
        throw error
      }
    }
  })
  
  return service
}

// FUNCIÓN PARA DECORAR CON VALIDACIÓN
function addValidation(service) {
  const originalMethods = {}
  
  // GUARDAMOS REFERENCIAS A LOS MÉTODOS ORIGINALES
  Object.getOwnPropertyNames(Object.getPrototypeOf(service))
    .filter(name => name !== 'constructor')
    .forEach(methodName => {
      originalMethods[methodName] = service[methodName]
    })
  
  // DECORAMOS CADA MÉTODO
  Object.keys(originalMethods).forEach(methodName => {
    service[methodName] = function(...args) {
      console.log(`✅ [VALIDATION] Validando entrada para ${methodName}`)
      
      // VALIDACIONES ESPECÍFICAS PARA CADA MÉTODO
      if (methodName === 'createUser') {
        if (!args[0] || typeof args[0] !== 'object') {
          throw new Error('createUser requiere un objeto con datos del usuario')
        }
        if (!args[0].nombre || !args[0].email) {
          throw new Error('createUser requiere nombre y email')
        }
      }
      
      if (methodName === 'updateUser') {
        if (typeof args[0] !== 'number') {
          throw new Error('updateUser requiere un ID numérico')
        }
        if (!args[1] || typeof args[1] !== 'object') {
          throw new Error('updateUser requiere un objeto con actualizaciones')
        }
      }
      
      console.log(`✅ [VALIDATION] Validación exitosa para ${methodName}`)
      return originalMethods[methodName].apply(this, args)
    }
  })
  
  return service
}

// FUNCIÓN PARA DECORAR CON CACHING
function addCaching(service) {
  const cache = new Map()
  
  // AGREGAMOS MÉTODO PARA LIMPIAR CACHE
  service.clearCache = function() {
    cache.clear()
    console.log('💾 [CACHE] Cache limpiado')
  }
  
  // DECORAMOS SOLO EL MÉTODO GET
  const originalGetUser = service.getUser
  service.getUser = function(id) {
    const cacheKey = `user_${id}`
    
    if (cache.has(cacheKey)) {
      console.log(`💾 [CACHE] Usuario ${id} obtenido del cache`)
      return cache.get(cacheKey)
    }
    
    console.log(`💾 [CACHE] Usuario ${id} no encontrado en cache, consultando servicio`)
    const user = originalGetUser.call(this, id)
    
    if (user) {
      cache.set(cacheKey, user)
      console.log(`💾 [CACHE] Usuario ${id} guardado en cache`)
    }
    
    return user
  }
  
  return service
}

// USO DE LOS DECORADORES CON AUGMENTACIÓN
const userService = new UserService()

// APLICAMOS DECORADORES
addLogging(userService)
addValidation(userService)
addCaching(userService)

// PROBAMOS EL SERVICIO DECORADO
try {
  console.log('🚀 Creando usuario:')
  const user1 = userService.createUser({
    nombre: 'Ana',
    email: 'ana@email.com',
    edad: 28
  })
  console.log('Usuario creado:', user1)
  
  console.log('\n🚀 Obteniendo usuario (primera vez):')
  const retrievedUser1 = userService.getUser(user1.id)
  console.log('Usuario obtenido:', retrievedUser1)
  
  console.log('\n🚀 Obteniendo usuario (segunda vez, debería usar cache):')
  const retrievedUser2 = userService.getUser(user1.id)
  console.log('Usuario obtenido:', retrievedUser2)
  
  console.log('\n🚀 Actualizando usuario:')
  const updatedUser = userService.updateUser(user1.id, { edad: 29 })
  console.log('Usuario actualizado:', updatedUser)
  
  console.log('\n🚀 Limpiando cache:')
  userService.clearCache()
  
} catch (error) {
  console.error('❌ Error:', error.message)
}
```

## 3. Adapter Pattern (Patrón Adaptador)

### 3.1 Adaptador Básico

```javascript
// ADAPTER PATTERN - PATRÓN ADAPTADOR
// Permite que interfaces incompatibles trabajen juntas

// INTERFAZ ANTIGUA (LEGACY)
class LegacyPaymentSystem {
  processPayment(amount, currency, cardNumber) {
    console.log(`💳 [LEGACY] Procesando pago de ${amount} ${currency}`)
    console.log(`💳 [LEGACY] Tarjeta: ${cardNumber}`)
    
    // Simulamos procesamiento
    const success = Math.random() > 0.2
    if (success) {
      return {
        success: true,
        transactionId: `LEG_${Date.now()}`,
        amount: amount,
        currency: currency,
        status: 'completed'
      }
    } else {
      throw new Error('Pago rechazado por el sistema legacy')
    }
  }
  
  refundPayment(transactionId, amount) {
    console.log(`💳 [LEGACY] Reembolsando ${amount} para transacción ${transactionId}`)
    
    return {
      success: true,
      refundId: `REF_${Date.now()}`,
      transactionId: transactionId,
      amount: amount,
      status: 'refunded'
    }
  }
}

// NUEVA INTERFAZ MODERNA
class ModernPaymentAPI {
  async charge(amount, currency, paymentMethod) {
    console.log(`💳 [MODERN] Cargando ${amount} ${currency}`)
    console.log(`💳 [MODERN] Método: ${paymentMethod.type}`)
    
    // Simulamos procesamiento asíncrono
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1
        if (success) {
          resolve({
            id: `MOD_${Date.now()}`,
            amount: amount,
            currency: currency,
            status: 'succeeded',
            payment_method: paymentMethod
          })
        } else {
          reject(new Error('Pago falló en el sistema moderno'))
        }
      }, 100)
    })
  }
  
  async refund(chargeId, amount) {
    console.log(`💳 [MODERN] Reembolsando ${amount} para cargo ${chargeId}`)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `REF_${Date.now()}`,
          charge: chargeId,
          amount: amount,
          status: 'succeeded'
        })
      }, 50)
    })
  }
}

// ADAPTADOR QUE CONVIERTE LA INTERFAZ ANTIGUA A LA MODERNA
class PaymentAdapter {
  constructor(legacySystem) {
    this.legacySystem = legacySystem
  }
  
  // ADAPTAMOS EL MÉTODO DE CARGO
  async charge(amount, currency, paymentMethod) {
    try {
      // CONVERTIMOS LA INTERFAZ MODERNA A LA LEGACY
      const cardNumber = paymentMethod.details?.card_number || '0000000000000000'
      
      const result = this.legacySystem.processPayment(amount, currency, cardNumber)
      
      // CONVERTIMOS LA RESPUESTA LEGACY A LA INTERFAZ MODERNA
      return {
        id: result.transactionId,
        amount: result.amount,
        currency: result.currency,
        status: result.status === 'completed' ? 'succeeded' : 'failed',
        payment_method: paymentMethod
      }
    } catch (error) {
      throw new Error(`Error en adaptador: ${error.message}`)
    }
  }
  
  // ADAPTAMOS EL MÉTODO DE REEMBOLSO
  async refund(chargeId, amount) {
    try {
      const result = this.legacySystem.refundPayment(chargeId, amount)
      
      return {
        id: result.refundId,
        charge: result.transactionId,
        amount: result.amount,
        status: result.status === 'refunded' ? 'succeeded' : 'failed'
      }
    } catch (error) {
      throw new Error(`Error en adaptador de reembolso: ${error.message}`)
    }
  }
}

// CLIENTE QUE USA LA INTERFAZ MODERNA
class PaymentClient {
  constructor(paymentAPI) {
    this.paymentAPI = paymentAPI
  }
  
  async processPayment(amount, currency, paymentMethod) {
    try {
      const result = await this.paymentAPI.charge(amount, currency, paymentMethod)
      console.log('✅ Pago procesado exitosamente:', result)
      return result
    } catch (error) {
      console.error('❌ Error procesando pago:', error.message)
      throw error
    }
  }
  
  async processRefund(chargeId, amount) {
    try {
      const result = await this.paymentAPI.refund(chargeId, amount)
      console.log('✅ Reembolso procesado exitosamente:', result)
      return result
    } catch (error) {
      console.error('❌ Error procesando reembolso:', error.message)
      throw error
    }
  }
}

// USO DEL ADAPTADOR
const legacySystem = new LegacyPaymentSystem()
const paymentAdapter = new PaymentAdapter(legacySystem)

// CLIENTE USANDO EL ADAPTADOR
const paymentClient = new PaymentClient(paymentAdapter)

// PROBAMOS EL SISTEMA ADAPTADO
async function probarSistemaAdaptado() {
  try {
    console.log('🚀 Procesando pago con sistema adaptado:')
    const paymentResult = await paymentClient.processPayment(
      100.50,
      'USD',
      { type: 'card', details: { card_number: '4111111111111111' } }
    )
    
    console.log('\n🚀 Procesando reembolso:')
    await paymentClient.processRefund(paymentResult.id, 50.25)
    
  } catch (error) {
    console.error('💥 Error en el sistema:', error.message)
  }
}

probarSistemaAdaptado()
```

## Resumen de Patrones Estructurales

### **Proxy Pattern:**
- **Propósito**: Controlar acceso a objetos, agregar funcionalidad
- **Cuándo usar**: Validación, logging, caching, control de acceso
- **Ventajas**: Separación de responsabilidades, funcionalidad adicional
- **Tipos**: Composición, object literal, ES6 Proxy

### **Decorator Pattern:**
- **Propósito**: Agregar funcionalidad dinámicamente
- **Cuándo usar**: Cuando necesitas funcionalidad opcional
- **Ventajas**: Flexibilidad, composición, no modifica clases existentes
- **Tipos**: Composición, object augmentation

### **Adapter Pattern:**
- **Propósito**: Hacer interfaces incompatibles trabajen juntas
- **Cuándo usar**: Integración con sistemas legacy, APIs externas
- **Ventajas**: Reutilización de código existente, compatibilidad
- **Consideraciones**: Puede agregar complejidad

### **Cuándo usar cada patrón:**
- **Proxy**: Control de acceso, logging, validación
- **Decorator**: Funcionalidad opcional, composición
- **Adapter**: Integración de sistemas incompatibles

---

*Esta es la quinta parte de la guía sobre patrones estructurales. Continuaré con los siguientes capítulos sobre patrones comportamentales, testing y patrones avanzados.*
