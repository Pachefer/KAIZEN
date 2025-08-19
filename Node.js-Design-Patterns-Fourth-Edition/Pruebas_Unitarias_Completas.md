# Pruebas Unitarias Completas - Node.js Design Patterns

## Configuración del Entorno de Testing

```bash
# Instalar dependencias
npm install --save-dev jest @types/jest supertest
npm install --save-dev @babel/core @babel/preset-env

# Configurar Jest en package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ]
  }
}
```

## 1. Pruebas para Patrones Creacionales

### 1.1 Factory Pattern Tests

```javascript
// tests/creational/factory.test.js
import { describe, test, expect, beforeEach } from '@jest/globals'

// Factory Simple
class Image {
  constructor(path) {
    this.path = path
  }
}

function createImage(name) {
  return new Image(name)
}

describe('Factory Pattern - Simple Factory', () => {
  test('debe crear una imagen con el nombre correcto', () => {
    const image = createImage('photo.jpg')
    expect(image).toBeInstanceOf(Image)
    expect(image.path).toBe('photo.jpg')
  })

  test('debe crear múltiples imágenes independientes', () => {
    const image1 = createImage('photo1.jpg')
    const image2 = createImage('photo2.jpg')
    
    expect(image1.path).toBe('photo1.jpg')
    expect(image2.path).toBe('photo2.jpg')
    expect(image1).not.toBe(image2)
  })
})

// Dynamic Class Factory
class UserFactory {
  static createUser(type, data) {
    switch (type) {
      case 'admin':
        return new AdminUser(data)
      case 'regular':
        return new RegularUser(data)
      default:
        throw new Error(`Tipo de usuario no soportado: ${type}`)
    }
  }
}

class AdminUser {
  constructor(data) {
    this.name = data.name
    this.role = 'admin'
    this.permissions = ['read', 'write', 'delete']
  }
}

class RegularUser {
  constructor(data) {
    this.name = data.name
    this.role = 'user'
    this.permissions = ['read']
  }
}

describe('Factory Pattern - Dynamic Class Factory', () => {
  test('debe crear usuario admin correctamente', () => {
    const admin = UserFactory.createUser('admin', { name: 'Juan' })
    
    expect(admin).toBeInstanceOf(AdminUser)
    expect(admin.role).toBe('admin')
    expect(admin.permissions).toContain('delete')
  })

  test('debe crear usuario regular correctamente', () => {
    const user = UserFactory.createUser('regular', { name: 'Ana' })
    
    expect(user).toBeInstanceOf(RegularUser)
    expect(user.role).toBe('user')
    expect(user.permissions).toContain('read')
    expect(user.permissions).not.toContain('delete')
  })

  test('debe lanzar error para tipo no soportado', () => {
    expect(() => {
      UserFactory.createUser('invalid', { name: 'Test' })
    }).toThrow('Tipo de usuario no soportado: invalid')
  })
})
```

### 1.2 Builder Pattern Tests

```javascript
// tests/creational/builder.test.js
import { describe, test, expect, beforeEach } from '@jest/globals'

class House {
  constructor(config) {
    this.floors = config.floors || 1
    this.bedrooms = config.bedrooms || 1
    this.bathrooms = config.bathrooms || 1
    this.garage = config.garage || false
    this.garden = config.garden || false
    this.pool = config.pool || false
  }
}

class HouseBuilder {
  constructor() {
    this.reset()
  }

  reset() {
    this.house = {
      floors: 1,
      bedrooms: 1,
      bathrooms: 1,
      garage: false,
      garden: false,
      pool: false
    }
    return this
  }

  withFloors(floors) {
    this.house.floors = floors
    return this
  }

  withBedrooms(bedrooms) {
    this.house.bedrooms = bedrooms
    return this
  }

  withBathrooms(bathrooms) {
    this.house.bathrooms = bathrooms
    return this
  }

  withGarage() {
    this.house.garage = true
    return this
  }

  withGarden() {
    this.house.garden = true
    return this
  }

  withPool() {
    this.house.pool = true
    return this
  }

  build() {
    const house = new House(this.house)
    this.reset()
    return house
  }
}

describe('Builder Pattern', () => {
  let builder

  beforeEach(() => {
    builder = new HouseBuilder()
  })

  test('debe construir casa básica por defecto', () => {
    const house = builder.build()
    
    expect(house.floors).toBe(1)
    expect(house.bedrooms).toBe(1)
    expect(house.bathrooms).toBe(1)
    expect(house.garage).toBe(false)
    expect(house.garden).toBe(false)
    expect(house.pool).toBe(false)
  })

  test('debe construir casa personalizada', () => {
    const house = builder
      .withFloors(2)
      .withBedrooms(3)
      .withBathrooms(2)
      .withGarage()
      .withGarden()
      .build()
    
    expect(house.floors).toBe(2)
    expect(house.bedrooms).toBe(3)
    expect(house.bathrooms).toBe(2)
    expect(house.garage).toBe(true)
    expect(house.garden).toBe(true)
    expect(house.pool).toBe(false)
  })

  test('debe resetear después de build', () => {
    builder.withFloors(3).withBedrooms(4)
    builder.build()
    
    const newHouse = builder.build()
    expect(newHouse.floors).toBe(1)
    expect(newHouse.bedrooms).toBe(1)
  })

  test('debe permitir encadenamiento de métodos', () => {
    const house = builder
      .withFloors(2)
      .withBedrooms(3)
      .withBathrooms(2)
      .withGarage()
      .withGarden()
      .withPool()
      .build()
    
    expect(house.floors).toBe(2)
    expect(house.bedrooms).toBe(3)
    expect(house.bathrooms).toBe(2)
    expect(house.garage).toBe(true)
    expect(house.garden).toBe(true)
    expect(house.pool).toBe(true)
  })
})
```

### 1.3 Singleton Pattern Tests

```javascript
// tests/creational/singleton.test.js
import { describe, test, expect, beforeEach } from '@jest/globals'

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance
    }
    
    this.connectionId = Date.now()
    this.isConnected = false
    DatabaseConnection.instance = this
  }

  connect() {
    this.isConnected = true
    return `Conectado a base de datos ${this.connectionId}`
  }

  disconnect() {
    this.isConnected = false
    return 'Desconectado'
  }

  getStatus() {
    return {
      connectionId: this.connectionId,
      isConnected: this.isConnected
    }
  }
}

describe('Singleton Pattern', () => {
  beforeEach(() => {
    // Limpiar instancia singleton entre tests
    DatabaseConnection.instance = null
  })

  test('debe crear solo una instancia', () => {
    const db1 = new DatabaseConnection()
    const db2 = new DatabaseConnection()
    
    expect(db1).toBe(db2)
    expect(db1.connectionId).toBe(db2.connectionId)
  })

  test('debe mantener estado entre instancias', () => {
    const db1 = new DatabaseConnection()
    db1.connect()
    
    const db2 = new DatabaseConnection()
    expect(db2.isConnected).toBe(true)
    expect(db2.getStatus().isConnected).toBe(true)
  })

  test('debe desconectar correctamente', () => {
    const db1 = new DatabaseConnection()
    db1.connect()
    
    const db2 = new DatabaseConnection()
    const result = db2.disconnect()
    
    expect(result).toBe('Desconectado')
    expect(db1.isConnected).toBe(false)
    expect(db2.isConnected).toBe(false)
  })
})
```

## 2. Pruebas para Patrones Estructurales

### 2.1 Proxy Pattern Tests

```javascript
// tests/structural/proxy.test.js
import { describe, test, expect, beforeEach, jest } from '@jest/globals'

class RealService {
  constructor() {
    this.accessCount = 0
  }

  expensiveOperation() {
    this.accessCount++
    return `Operación completada ${this.accessCount} veces`
  }

  getAccessCount() {
    return this.accessCount
  }
}

class ServiceProxy {
  constructor(realService) {
    this.realService = realService
    this.cache = new Map()
  }

  expensiveOperation(input) {
    const cacheKey = `operation_${input}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    const result = this.realService.expensiveOperation()
    this.cache.set(cacheKey, result)
    
    return result
  }

  getAccessCount() {
    return this.realService.getAccessCount()
  }

  clearCache() {
    this.cache.clear()
  }
}

describe('Proxy Pattern', () => {
  let realService, proxy

  beforeEach(() => {
    realService = new RealService()
    proxy = new ServiceProxy(realService)
  })

  test('debe delegar operaciones al servicio real', () => {
    const result = proxy.expensiveOperation('test')
    
    expect(result).toContain('Operación completada')
    expect(realService.getAccessCount()).toBe(1)
  })

  test('debe cachear resultados', () => {
    proxy.expensiveOperation('test1')
    proxy.expensiveOperation('test1')
    
    expect(realService.getAccessCount()).toBe(1) // Solo se ejecuta una vez
  })

  test('debe limpiar cache correctamente', () => {
    proxy.expensiveOperation('test')
    proxy.clearCache()
    
    proxy.expensiveOperation('test')
    expect(realService.getAccessCount()).toBe(2) // Se ejecuta de nuevo
  })
})
```

### 2.2 Decorator Pattern Tests

```javascript
// tests/structural/decorator.test.js
import { describe, test, expect, beforeEach, jest } from '@jest/globals'

class Coffee {
  cost() {
    return 10
  }

  description() {
    return 'Café simple'
  }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee
  }

  cost() {
    return this.coffee.cost() + 2
  }

  description() {
    return this.coffee.description() + ', con leche'
  }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee
  }

  cost() {
    return this.coffee.cost() + 1
  }

  description() {
    return this.coffee.description() + ', con azúcar'
  }
}

describe('Decorator Pattern', () => {
  test('debe decorar café con leche', () => {
    const coffee = new Coffee()
    const coffeeWithMilk = new MilkDecorator(coffee)
    
    expect(coffeeWithMilk.cost()).toBe(12)
    expect(coffeeWithMilk.description()).toBe('Café simple, con leche')
  })

  test('debe decorar café con múltiples ingredientes', () => {
    const coffee = new Coffee()
    const coffeeWithMilk = new MilkDecorator(coffee)
    const coffeeWithMilkAndSugar = new SugarDecorator(coffeeWithMilk)
    
    expect(coffeeWithMilkAndSugar.cost()).toBe(13)
    expect(coffeeWithMilkAndSugar.description()).toBe('Café simple, con leche, con azúcar')
  })

  test('debe mantener café original sin cambios', () => {
    const coffee = new Coffee()
    const originalCost = coffee.cost()
    const originalDescription = coffee.description()
    
    new MilkDecorator(coffee)
    
    expect(coffee.cost()).toBe(originalCost)
    expect(coffee.description()).toBe(originalDescription)
  })
})
```

## 3. Pruebas para Patrones Comportamentales

### 3.1 Strategy Pattern Tests

```javascript
// tests/behavioral/strategy.test.js
import { describe, test, expect, beforeEach } from '@jest/globals'

class PaymentStrategy {
  pay(amount) {
    throw new Error('Método pay debe ser implementado')
  }
}

class CreditCardStrategy extends PaymentStrategy {
  pay(amount) {
    return `Pagado $${amount} con tarjeta de crédito`
  }
}

class PayPalStrategy extends PaymentStrategy {
  pay(amount) {
    return `Pagado $${amount} con PayPal`
  }
}

class CryptoStrategy extends PaymentStrategy {
  pay(amount) {
    return `Pagado $${amount} con criptomonedas`
  }
}

class PaymentProcessor {
  constructor(strategy = new CreditCardStrategy()) {
    this.strategy = strategy
  }

  setStrategy(strategy) {
    this.strategy = strategy
  }

  processPayment(amount) {
    return this.strategy.pay(amount)
  }
}

describe('Strategy Pattern', () => {
  let processor

  beforeEach(() => {
    processor = new PaymentProcessor()
  })

  test('debe usar estrategia por defecto', () => {
    const result = processor.processPayment(100)
    expect(result).toContain('tarjeta de crédito')
  })

  test('debe cambiar estrategia dinámicamente', () => {
    processor.setStrategy(new PayPalStrategy())
    const result = processor.processPayment(100)
    
    expect(result).toContain('PayPal')
  })

  test('debe procesar pagos con diferentes estrategias', () => {
    const strategies = [
      new CreditCardStrategy(),
      new PayPalStrategy(),
      new CryptoStrategy()
    ]
    
    strategies.forEach(strategy => {
      processor.setStrategy(strategy)
      const result = processor.processPayment(50)
      expect(result).toContain('$50')
    })
  })
})
```

### 3.2 State Pattern Tests

```javascript
// tests/behavioral/state.test.js
import { describe, test, expect, beforeEach } from '@jest/globals'

class VendingMachineState {
  insertCoin(machine) {
    throw new Error('Método insertCoin debe ser implementado')
  }
  
  selectProduct(machine) {
    throw new Error('Método selectProduct debe ser implementado')
  }
}

class IdleState extends VendingMachineState {
  insertCoin(machine) {
    machine.setState(new HasCoinState())
    return 'Moneda insertada'
  }
  
  selectProduct(machine) {
    return 'Por favor, inserte una moneda primero'
  }
}

class HasCoinState extends VendingMachineState {
  insertCoin(machine) {
    return 'Ya hay una moneda insertada'
  }
  
  selectProduct(machine) {
    machine.setState(new IdleState())
    return 'Producto entregado'
  }
}

class VendingMachine {
  constructor() {
    this.state = new IdleState()
  }
  
  setState(state) {
    this.state = state
  }
  
  insertCoin() {
    return this.state.insertCoin(this)
  }
  
  selectProduct() {
    return this.state.selectProduct(this)
  }
}

describe('State Pattern', () => {
  let machine

  beforeEach(() => {
    machine = new VendingMachine()
  })

  test('debe estar en estado idle inicialmente', () => {
    expect(machine.state).toBeInstanceOf(IdleState)
  })

  test('debe cambiar a estado hasCoin al insertar moneda', () => {
    machine.insertCoin()
    expect(machine.state).toBeInstanceOf(HasCoinState)
  })

  test('debe entregar producto y volver a idle', () => {
    machine.insertCoin()
    const result = machine.selectProduct()
    
    expect(result).toBe('Producto entregado')
    expect(machine.state).toBeInstanceOf(IdleState)
  })

  test('debe rechazar moneda en estado hasCoin', () => {
    machine.insertCoin()
    const result = machine.insertCoin()
    
    expect(result).toBe('Ya hay una moneda insertada')
  })
})
```

## 4. Pruebas para Streams

### 4.1 Stream Tests

```javascript
// tests/streams/streams.test.js
import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import { Readable, Writable, Transform } from 'stream'

class NumberGenerator extends Readable {
  constructor(options = {}) {
    super(options)
    this.current = 0
    this.max = options.max || 10
  }

  _read() {
    if (this.current >= this.max) {
      this.push(null)
      return
    }
    
    this.push(this.current.toString())
    this.current++
  }
}

class NumberMultiplier extends Transform {
  constructor(factor = 2) {
    super()
    this.factor = factor
  }

  _transform(chunk, encoding, callback) {
    const number = parseInt(chunk.toString())
    const result = number * this.factor
    callback(null, result.toString())
  }
}

class NumberCollector extends Writable {
  constructor() {
    super()
    this.numbers = []
  }

  _write(chunk, encoding, callback) {
    this.numbers.push(parseInt(chunk.toString()))
    callback()
  }

  getNumbers() {
    return this.numbers
  }
}

describe('Streams', () => {
  test('debe generar números correctamente', (done) => {
    const generator = new NumberGenerator({ max: 5 })
    const numbers = []
    
    generator.on('data', (chunk) => {
      numbers.push(parseInt(chunk.toString()))
    })
    
    generator.on('end', () => {
      expect(numbers).toEqual([0, 1, 2, 3, 4])
      done()
    })
  })

  test('debe transformar números correctamente', (done) => {
    const generator = new NumberGenerator({ max: 3 })
    const multiplier = new NumberMultiplier(3)
    const collector = new NumberCollector()
    
    generator.pipe(multiplier).pipe(collector)
    
    collector.on('finish', () => {
      expect(collector.getNumbers()).toEqual([0, 3, 6])
      done()
    })
  })

  test('debe manejar streams vacíos', (done) => {
    const generator = new NumberGenerator({ max: 0 })
    const numbers = []
    
    generator.on('data', (chunk) => {
      numbers.push(parseInt(chunk.toString()))
    })
    
    generator.on('end', () => {
      expect(numbers).toEqual([])
      done()
    })
  })
})
```

## 5. Pruebas para Middleware

### 5.1 Middleware Tests

```javascript
// tests/middleware/middleware.test.js
import { describe, test, expect, beforeEach, jest } from '@jest/globals'

class Middleware {
  execute(context, next) {
    throw new Error('Método execute debe ser implementado')
  }
}

class LoggingMiddleware extends Middleware {
  execute(context, next) {
    context.logs = context.logs || []
    context.logs.push(`Logging: ${context.action}`)
    
    const result = next()
    
    context.logs.push(`Logging: ${context.action} completado`)
    return result
  }
}

class ValidationMiddleware extends Middleware {
  execute(context, next) {
    if (!context.data) {
      throw new Error('Datos requeridos')
    }
    
    context.logs = context.logs || []
    context.logs.push(`Validación: ${context.action} válido`)
    
    return next()
  }
}

class MiddlewareChain {
  constructor() {
    this.middlewares = []
  }
  
  use(middleware) {
    this.middlewares.push(middleware)
  }
  
  execute(context) {
    let index = 0
    
    const next = () => {
      if (index >= this.middlewares.length) {
        return context.result || 'Operación completada'
      }
      
      const middleware = this.middlewares[index++]
      return middleware.execute(context, next)
    }
    
    return next()
  }
}

describe('Middleware Pattern', () => {
  let chain

  beforeEach(() => {
    chain = new MiddlewareChain()
  })

  test('debe ejecutar middleware en orden', () => {
    chain.use(new LoggingMiddleware())
    chain.use(new ValidationMiddleware())
    
    const context = {
      action: 'test',
      data: 'test data'
    }
    
    const result = chain.execute(context)
    
    expect(result).toBe('Operación completada')
    expect(context.logs).toEqual([
      'Logging: test',
      'Validación: test válido',
      'Logging: test completado'
    ])
  })

  test('debe lanzar error si validación falla', () => {
    chain.use(new ValidationMiddleware())
    
    const context = {
      action: 'test'
      // Sin data
    }
    
    expect(() => {
      chain.execute(context)
    }).toThrow('Datos requeridos')
  })

  test('debe ejecutar sin middleware', () => {
    const context = { action: 'test' }
    const result = chain.execute(context)
    
    expect(result).toBe('Operación completada')
  })
})
```

## 6. Pruebas para Patrones Avanzados

### 6.1 Circuit Breaker Tests

```javascript
// tests/advanced/circuit-breaker.test.js
import { describe, test, expect, beforeEach, jest } from '@jest/globals'

class CircuitBreaker {
  constructor(failureThreshold = 3, resetTimeout = 5000) {
    this.failureThreshold = failureThreshold
    this.resetTimeout = resetTimeout
    this.failureCount = 0
    this.lastFailureTime = null
    this.state = 'CLOSED'
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker está OPEN')
      }
    }
    
    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
  
  onSuccess() {
    this.failureCount = 0
    this.state = 'CLOSED'
  }
  
  onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }
  
  shouldAttemptReset() {
    return Date.now() - this.lastFailureTime >= this.resetTimeout
  }
  
  getState() {
    return this.state
  }
}

describe('Circuit Breaker Pattern', () => {
  let circuitBreaker

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker(2, 1000)
  })

  test('debe estar cerrado inicialmente', () => {
    expect(circuitBreaker.getState()).toBe('CLOSED')
  })

  test('debe abrir después de fallos consecutivos', async () => {
    const failingOperation = jest.fn().mockRejectedValue(new Error('Falló'))
    
    // Primer fallo
    await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow('Falló')
    expect(circuitBreaker.getState()).toBe('CLOSED')
    
    // Segundo fallo - abre el circuito
    await expect(circuitBreaker.execute(failingOperation)).rejects.toThrow('Falló')
    expect(circuitBreaker.getState()).toBe('OPEN')
  })

  test('debe rechazar operaciones cuando está abierto', async () => {
    circuitBreaker.state = 'OPEN'
    circuitBreaker.lastFailureTime = Date.now()
    
    const operation = jest.fn()
    
    await expect(circuitBreaker.execute(operation)).rejects.toThrow('Circuit breaker está OPEN')
    expect(operation).not.toHaveBeenCalled()
  })

  test('debe resetear después del timeout', async () => {
    circuitBreaker.state = 'OPEN'
    circuitBreaker.lastFailureTime = Date.now() - 2000 // 2 segundos atrás
    
    const operation = jest.fn().mockResolvedValue('Éxito')
    
    const result = await circuitBreaker.execute(operation)
    
    expect(result).toBe('Éxito')
    expect(circuitBreaker.getState()).toBe('CLOSED')
  })
})
```

## 7. Ejecución de Tests

### 7.1 Script de Ejecución

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testPathPattern=creational
npm test -- --testPathPattern=structural
npm test -- --testPathPattern=behavioral

# Ejecutar tests en modo watch
npm run test:watch
```

### 7.2 Configuración de Coverage

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js",
      "!src/**/*.spec.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 8. Mejores Prácticas de Testing

### 8.1 Estructura de Tests

- **Arrange**: Preparar datos y objetos
- **Act**: Ejecutar la funcionalidad a probar
- **Assert**: Verificar resultados esperados

### 8.2 Naming de Tests

```javascript
describe('Clase o Módulo', () => {
  test('debe hacer algo específico cuando ocurre cierta condición', () => {
    // test implementation
  })
  
  test('debe manejar caso edge correctamente', () => {
    // test implementation
  })
})
```

### 8.3 Mocks y Stubs

```javascript
// Mock de función
const mockFunction = jest.fn().mockReturnValue('mocked value')

// Mock de módulo
jest.mock('./database', () => ({
  connect: jest.fn().mockResolvedValue({ id: 'mock-connection' })
}))

// Spy en método existente
const spy = jest.spyOn(object, 'method')
```

Esta suite completa de pruebas unitarias cubre todos los patrones de diseño implementados y proporciona una base sólida para asegurar la calidad del código.
