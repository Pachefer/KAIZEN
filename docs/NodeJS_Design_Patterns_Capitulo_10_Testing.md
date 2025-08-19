# Node.js Design Patterns - Capítulo 10: Testing

## Introducción al Testing

El testing es una parte fundamental del desarrollo de software que asegura la calidad, confiabilidad y mantenibilidad del código. En Node.js, existen múltiples enfoques y herramientas para implementar testing efectivo.

## 1. Primer Test (Primera Prueba)

### 1.1 Test Básico con Assert

```javascript
// PRIMER TEST - PRUEBA BÁSICA CON ASSERT
// Introducción al testing usando el módulo assert nativo de Node.js

import { equal } from 'node:assert/strict'
import { calculateBasketTotal } from './calculateBasketTotal.js'

// ARRANGE - PREPARAMOS LOS DATOS DE PRUEBA
const basket = {
  items: [
    { name: 'Croissant', unitPrice: 2, quantity: 2 },
    { name: 'Olive bread', unitPrice: 3, quantity: 1 },
  ],
}

// ACT - EJECUTAMOS LA FUNCIÓN QUE QUEREMOS PROBAR
const result = calculateBasketTotal(basket)

// ASSERT - VERIFICAMOS QUE EL RESULTADO SEA EL ESPERADO
const expectedTotal = 7 // (2 * 2) + (3 * 1) = 7
equal(
  result,
  expectedTotal,
  `Expected total to be ${expectedTotal}, but got ${result}`
)
console.log('✅ Test passed!')
```

**Archivo: calculateBasketTotal.js**
```javascript
// FUNCIÓN QUE CALCULA EL TOTAL DE UNA CESTA DE COMPRAS
export function calculateBasketTotal(basket) {
  if (!basket || !basket.items || !Array.isArray(basket.items)) {
    throw new Error('Basket must have an items array')
  }
  
  return basket.items.reduce((total, item) => {
    if (!item.unitPrice || !item.quantity) {
      throw new Error('Each item must have unitPrice and quantity')
    }
    
    return total + (item.unitPrice * item.quantity)
  }, 0)
}
```

**¿Por qué usar testing?**
- **Calidad**: Asegura que el código funcione correctamente
- **Confianza**: Permite hacer cambios sin miedo a romper funcionalidad
- **Documentación**: Los tests sirven como documentación del comportamiento
- **Refactoring**: Facilita la mejora del código existente

## 2. Test Runner (Ejecutor de Pruebas)

### 2.1 Test Runner Personalizado

```javascript
// TEST RUNNER PERSONALIZADO
// Sistema básico para ejecutar múltiples tests de manera organizada

class TestRunner {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
    this.total = 0
  }
  
  // AGREGAR UN TEST A LA SUITE
  test(name, testFunction) {
    this.tests.push({ name, testFunction })
  }
  
  // EJECUTAR TODOS LOS TESTS
  async run() {
    console.log('🚀 Iniciando ejecución de tests...\n')
    
    for (const test of this.tests) {
      try {
        console.log(`🔄 Ejecutando: ${test.name}`)
        
        // Ejecutamos el test
        await test.testFunction()
        
        console.log(`✅ PASSED: ${test.name}`)
        this.passed++
        
      } catch (error) {
        console.error(`❌ FAILED: ${test.name}`)
        console.error(`   Error: ${error.message}`)
        this.failed++
      }
      
      this.total++
      console.log('') // Línea en blanco para separar tests
    }
    
    this.printSummary()
  }
  
  // IMPRIMIR RESUMEN DE RESULTADOS
  printSummary() {
    console.log('📊 RESUMEN DE TESTS')
    console.log('===================')
    console.log(`Total: ${this.total}`)
    console.log(`✅ Passed: ${this.passed}`)
    console.log(`❌ Failed: ${this.failed}`)
    console.log(`📈 Success Rate: ${((this.passed / this.total) * 100).toFixed(1)}%`)
    
    if (this.failed === 0) {
      console.log('\n🎉 ¡Todos los tests pasaron!')
    } else {
      console.log(`\n⚠️ ${this.failed} test(s) fallaron`)
    }
  }
}

// FUNCIÓN DE ASERTACIÓN MEJORADA
function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(
      `${message} Expected ${expected}, but got ${actual}`
    )
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(`${message} Expected true, but got ${condition}`)
  }
}

function assertFalse(condition, message = '') {
  if (condition) {
    throw new Error(`${message} Expected false, but got ${condition}`)
  }
}

function assertThrows(fn, expectedError = Error) {
  try {
    fn()
    throw new Error('Expected function to throw an error')
  } catch (error) {
    if (!(error instanceof expectedError)) {
      throw new Error(`Expected ${expectedError.name}, but got ${error.constructor.name}`)
    }
  }
}

// USO DEL TEST RUNNER
const runner = new TestRunner()

// TESTS PARA LA FUNCIÓN calculateBasketTotal
runner.test('Calcula total correctamente para cesta simple', () => {
  const basket = {
    items: [
      { name: 'Croissant', unitPrice: 2, quantity: 2 },
      { name: 'Olive bread', unitPrice: 3, quantity: 1 },
    ],
  }
  
  const result = calculateBasketTotal(basket)
  assertEqual(result, 7, 'Total should be 7')
})

runner.test('Maneja cesta vacía correctamente', () => {
  const basket = { items: [] }
  
  const result = calculateBasketTotal(basket)
  assertEqual(result, 0, 'Empty basket should total 0')
})

runner.test('Maneja items con cantidad 0', () => {
  const basket = {
    items: [
      { name: 'Croissant', unitPrice: 2, quantity: 0 },
      { name: 'Olive bread', unitPrice: 3, quantity: 1 },
    ],
  }
  
  const result = calculateBasketTotal(basket)
  assertEqual(result, 3, 'Items with quantity 0 should not affect total')
})

runner.test('Lanza error para basket inválido', () => {
  assertThrows(() => calculateBasketTotal(null), Error)
  assertThrows(() => calculateBasketTotal({}), Error)
  assertThrows(() => calculateBasketTotal({ items: 'not an array' }), Error)
})

runner.test('Lanza error para items inválidos', () => {
  const basket = {
    items: [
      { name: 'Croissant', unitPrice: 2 }, // Sin quantity
      { name: 'Olive bread', quantity: 1 }, // Sin unitPrice
    ],
  }
  
  assertThrows(() => calculateBasketTotal(basket), Error)
})

// EJECUTAMOS LOS TESTS
runner.run()
```

## 3. Test Functions (Funciones de Prueba)

### 3.1 Test Functions Avanzadas

```javascript
// TEST FUNCTIONS AVANZADAS
// Funciones de prueba más sofisticadas con setup y teardown

class AdvancedTestRunner {
  constructor() {
    this.tests = []
    this.beforeEachHooks = []
    this.afterEachHooks = []
    this.beforeAllHooks = []
    this.afterAllHooks = []
    this.testContext = {}
  }
  
  // HOOKS PARA CONFIGURACIÓN
  beforeAll(fn) {
    this.beforeAllHooks.push(fn)
  }
  
  afterAll(fn) {
    this.afterAllHooks.push(fn)
  }
  
  beforeEach(fn) {
    this.beforeEachHooks.push(fn)
  }
  
  afterEach(fn) {
    this.afterEachHooks.push(fn)
  }
  
  // AGREGAR TEST
  test(name, testFunction) {
    this.tests.push({ name, testFunction })
  }
  
  // TEST ASÍNCRONO
  testAsync(name, testFunction) {
    this.tests.push({ name, testFunction, async: true })
  }
  
  // TEST CON TIMEOUT
  testWithTimeout(name, testFunction, timeout = 5000) {
    this.tests.push({ name, testFunction, timeout })
  }
  
  // EJECUTAR HOOKS
  async executeHooks(hooks, context = {}) {
    for (const hook of hooks) {
      await hook.call(this, context)
    }
  }
  
  // EJECUTAR TESTS
  async run() {
    console.log('🚀 Iniciando ejecución de tests avanzados...\n')
    
    // Ejecutamos beforeAll hooks
    await this.executeHooks(this.beforeAllHooks, this.testContext)
    
    for (const test of this.tests) {
      try {
        console.log(`🔄 Ejecutando: ${test.name}`)
        
        // Ejecutamos beforeEach hooks
        await this.executeHooks(this.beforeEachHooks, this.testContext)
        
        // Ejecutamos el test
        if (test.async) {
          await test.testFunction.call(this, this.testContext)
        } else if (test.timeout) {
          await this.runWithTimeout(test.testFunction, test.timeout, this.testContext)
        } else {
          test.testFunction.call(this, this.testContext)
        }
        
        console.log(`✅ PASSED: ${test.name}`)
        
        // Ejecutamos afterEach hooks
        await this.executeHooks(this.afterEachHooks, this.testContext)
        
      } catch (error) {
        console.error(`❌ FAILED: ${test.name}`)
        console.error(`   Error: ${error.message}`)
        if (error.stack) {
          console.error(`   Stack: ${error.stack}`)
        }
      }
    }
    
    // Ejecutamos afterAll hooks
    await this.executeHooks(this.afterAllHooks, this.testContext)
    
    console.log('\n🎉 Ejecución de tests completada')
  }
  
  // EJECUTAR TEST CON TIMEOUT
  async runWithTimeout(testFunction, timeout, context) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Test timed out after ${timeout}ms`))
      }, timeout)
      
      Promise.resolve(testFunction.call(this, context))
        .then(result => {
          clearTimeout(timer)
          resolve(result)
        })
        .catch(error => {
          clearTimeout(timer)
          reject(error)
        })
    })
  }
}

// FUNCIONES DE ASERTACIÓN AVANZADAS
function assertDeepEqual(actual, expected, message = '') {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  
  if (actualStr !== expectedStr) {
    throw new Error(
      `${message} Expected ${expectedStr}, but got ${actualStr}`
    )
  }
}

function assertIncludes(array, item, message = '') {
  if (!array.includes(item)) {
    throw new Error(`${message} Expected array to include ${item}`)
  }
}

function assertLength(array, expectedLength, message = '') {
  if (array.length !== expectedLength) {
    throw new Error(`${message} Expected length ${expectedLength}, but got ${array.length}`)
  }
}

function assertType(value, expectedType, message = '') {
  const actualType = typeof value
  if (actualType !== expectedType) {
    throw new Error(`${message} Expected type ${expectedType}, but got ${actualType}`)
  }
}

// USO DEL TEST RUNNER AVANZADO
const advancedRunner = new AdvancedTestRunner()

// CONFIGURACIÓN GLOBAL
advancedRunner.beforeAll(async (context) => {
  console.log('🔧 Configuración global iniciada')
  context.database = {
    users: [
      { id: 1, name: 'Juan', email: 'juan@email.com' },
      { id: 2, name: 'Ana', email: 'ana@email.com' }
    ]
  }
  context.config = { environment: 'test', debug: true }
  console.log('✅ Configuración global completada')
})

advancedRunner.afterAll(async (context) => {
  console.log('🧹 Limpieza global iniciada')
  // Aquí iría la limpieza de recursos
  console.log('✅ Limpieza global completada')
})

// CONFIGURACIÓN POR TEST
advancedRunner.beforeEach(async (context) => {
  console.log('  🔧 Configuración del test iniciada')
  context.testStartTime = Date.now()
  context.testData = { ...context.database } // Copia para cada test
})

advancedRunner.afterEach(async (context) => {
  const duration = Date.now() - context.testStartTime
  console.log(`  ⏱️ Test completado en ${duration}ms`)
  console.log('  🧹 Limpieza del test completada')
})

// TESTS AVANZADOS
advancedRunner.test('Test básico con contexto compartido', (context) => {
  assertType(context.database, 'object', 'Database should be an object')
  assertLength(context.database.users, 2, 'Should have 2 users')
  assertIncludes(context.database.users.map(u => u.name), 'Juan', 'Should include user Juan')
})

advancedRunner.testAsync('Test asíncrono', async (context) => {
  // Simulamos operación asíncrona
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const user = context.database.users.find(u => u.id === 1)
  assertDeepEqual(user, {
    id: 1,
    name: 'Juan',
    email: 'juan@email.com'
  }, 'User should match expected structure')
})

advancedRunner.testWithTimeout('Test con timeout personalizado', async (context) => {
  // Simulamos operación que toma tiempo
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  assertTrue(context.config.environment === 'test', 'Environment should be test')
  assertTrue(context.config.debug === true, 'Debug should be enabled')
}, 3000)

advancedRunner.test('Test de modificación de datos', (context) => {
  // Modificamos los datos del contexto
  context.testData.users.push({
    id: 3,
    name: 'Carlos',
    email: 'carlos@email.com'
  })
  
  assertLength(context.testData.users, 3, 'Should have 3 users after modification')
  
  // Verificamos que el contexto original no cambió
  assertLength(context.database.users, 2, 'Original context should remain unchanged')
})

// EJECUTAMOS LOS TESTS AVANZADOS
advancedRunner.run()
```

## 4. Subtests (Subpruebas)

### 4.1 Organización de Tests con Subtests

```javascript
// SUBTESTS - ORGANIZACIÓN DE TESTS CON SUBPRUEBAS
// Permite organizar tests en grupos lógicos y jerárquicos

class TestSuite {
  constructor(name) {
    this.name = name
    this.tests = []
    this.suites = []
    this.beforeEachHooks = []
    this.afterEachHooks = []
    this.beforeAllHooks = []
    this.afterAllHooks = []
  }
  
  // AGREGAR TEST SIMPLE
  test(name, testFunction) {
    this.tests.push({ name, testFunction, type: 'test' })
  }
  
  // AGREGAR SUBSUTE
  describe(name, suiteFunction) {
    const subSuite = new TestSuite(name)
    suiteFunction(subSuite)
    this.suites.push(subSuite)
  }
  
  // HOOKS
  beforeAll(fn) {
    this.beforeAllHooks.push(fn)
  }
  
  afterAll(fn) {
    this.afterAllHooks.push(fn)
  }
  
  beforeEach(fn) {
    this.beforeEachHooks.push(fn)
  }
  
  afterEach(fn) {
    this.afterEachHooks.push(fn)
  }
  
  // EJECUTAR SUITE COMPLETA
  async run(context = {}, level = 0) {
    const indent = '  '.repeat(level)
    
    console.log(`${indent}🚀 Ejecutando suite: ${this.name}`)
    
    // Ejecutamos beforeAll hooks
    for (const hook of this.beforeAllHooks) {
      await hook.call(this, context)
    }
    
    // Ejecutamos tests
    for (const test of this.tests) {
      try {
        console.log(`${indent}🔄 Ejecutando test: ${test.name}`)
        
        // Ejecutamos beforeEach hooks
        for (const hook of this.beforeEachHooks) {
          await hook.call(this, context)
        }
        
        // Ejecutamos el test
        if (test.testFunction.constructor.name === 'AsyncFunction') {
          await test.testFunction.call(this, context)
        } else {
          test.testFunction.call(this, context)
        }
        
        console.log(`${indent}✅ PASSED: ${test.name}`)
        
        // Ejecutamos afterEach hooks
        for (const hook of this.afterEachHooks) {
          await hook.call(this, context)
        }
        
      } catch (error) {
        console.error(`${indent}❌ FAILED: ${test.name}`)
        console.error(`${indent}   Error: ${error.message}`)
      }
    }
    
    // Ejecutamos subsuites
    for (const suite of this.suites) {
      await suite.run(context, level + 1)
    }
    
    // Ejecutamos afterAll hooks
    for (const hook of this.afterAllHooks) {
      await hook.call(this, context)
    }
    
    console.log(`${indent}✅ Suite completada: ${this.name}`)
  }
}

// FUNCIONES DE ASERTACIÓN PARA LOS TESTS
function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${expected}, but got ${value}`)
      }
    },
    
    toEqual(expected) {
      const actualStr = JSON.stringify(value)
      const expectedStr = JSON.stringify(expected)
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${expectedStr}, but got ${actualStr}`)
      }
    },
    
    toBeDefined() {
      if (value === undefined) {
        throw new Error('Expected value to be defined')
      }
    },
    
    toBeNull() {
      if (value !== null) {
        throw new Error(`Expected null, but got ${value}`)
      }
    },
    
    toContain(item) {
      if (!value.includes(item)) {
        throw new Error(`Expected array to contain ${item}`)
      }
    },
    
    toHaveLength(expectedLength) {
      if (value.length !== expectedLength) {
        throw new Error(`Expected length ${expectedLength}, but got ${value.length}`)
      }
    }
  }
}

// USO DE TEST SUITE CON SUBTESTS
const mainSuite = new TestSuite('Calculadora de Cesta de Compras')

// CONFIGURACIÓN GLOBAL
mainSuite.beforeAll(async (context) => {
  console.log('🔧 Configuración global de la suite')
  context.testData = {
    emptyBasket: { items: [] },
    simpleBasket: {
      items: [
        { name: 'Croissant', unitPrice: 2, quantity: 2 },
        { name: 'Olive bread', unitPrice: 3, quantity: 1 }
      ]
    },
    complexBasket: {
      items: [
        { name: 'Croissant', unitPrice: 2.50, quantity: 3 },
        { name: 'Olive bread', unitPrice: 3.75, quantity: 2 },
        { name: 'Coffee', unitPrice: 1.80, quantity: 4 }
      ]
    }
  }
})

// SUITE PARA CÁLCULOS BÁSICOS
mainSuite.describe('Cálculos Básicos', (suite) => {
  suite.test('Cesta vacía retorna 0', (context) => {
    const result = calculateBasketTotal(context.testData.emptyBasket)
    expect(result).toBe(0)
  })
  
  suite.test('Cesta simple calcula correctamente', (context) => {
    const result = calculateBasketTotal(context.testData.simpleBasket)
    expect(result).toBe(7) // (2 * 2) + (3 * 1) = 7
  })
  
  suite.test('Cesta compleja con decimales', (context) => {
    const result = calculateBasketTotal(context.testData.complexBasket)
    const expected = (2.50 * 3) + (3.75 * 2) + (1.80 * 4)
    expect(result).toBe(expected)
  })
})

// SUITE PARA VALIDACIONES
mainSuite.describe('Validaciones', (suite) => {
  suite.test('Lanza error para basket null', () => {
    expect(() => calculateBasketTotal(null)).toThrow()
  })
  
  suite.test('Lanza error para basket sin items', () => {
    expect(() => calculateBasketTotal({})).toThrow()
  })
  
  suite.test('Lanza error para items no array', () => {
    expect(() => calculateBasketTotal({ items: 'not array' })).toThrow()
  })
  
  suite.test('Lanza error para item sin unitPrice', () => {
    const invalidBasket = {
      items: [{ name: 'Test', quantity: 1 }]
    }
    expect(() => calculateBasketTotal(invalidBasket)).toThrow()
  })
  
  suite.test('Lanza error para item sin quantity', () => {
    const invalidBasket = {
      items: [{ name: 'Test', unitPrice: 1 }]
    }
    expect(() => calculateBasketTotal(invalidBasket)).toThrow()
  })
})

// SUITE PARA CASOS ESPECIALES
mainSuite.describe('Casos Especiales', (suite) => {
  suite.test('Maneja cantidad 0 correctamente', (context) => {
    const basketWithZero = {
      items: [
        { name: 'Croissant', unitPrice: 2, quantity: 0 },
        { name: 'Olive bread', unitPrice: 3, quantity: 1 }
      ]
    }
    
    const result = calculateBasketTotal(basketWithZero)
    expect(result).toBe(3) // Solo el segundo item
  })
  
  suite.test('Maneja precio 0 correctamente', (context) => {
    const basketWithZeroPrice = {
      items: [
        { name: 'Free item', unitPrice: 0, quantity: 5 },
        { name: 'Paid item', unitPrice: 2, quantity: 1 }
      ]
    }
    
    const result = calculateBasketTotal(basketWithZeroPrice)
    expect(result).toBe(2) // Solo el segundo item
  })
  
  suite.test('Maneja items con nombres vacíos', (context) => {
    const basketWithEmptyNames = {
      items: [
        { name: '', unitPrice: 2, quantity: 1 },
        { name: 'Valid item', unitPrice: 3, quantity: 1 }
      ]
    }
    
    const result = calculateBasketTotal(basketWithEmptyNames)
    expect(result).toBe(5) // Ambos items se calculan normalmente
  })
})

// SUITE PARA RENDIMIENTO
mainSuite.describe('Rendimiento', (suite) => {
  suite.test('Maneja cesta grande eficientemente', () => {
    const largeBasket = {
      items: Array.from({ length: 1000 }, (_, i) => ({
        name: `Item ${i}`,
        unitPrice: Math.random() * 10,
        quantity: Math.floor(Math.random() * 5) + 1
      }))
    }
    
    const startTime = Date.now()
    const result = calculateBasketTotal(largeBasket)
    const endTime = Date.now()
    
    expect(result).toBeDefined()
    expect(endTime - startTime).toBeLessThan(100) // Debe completarse en menos de 100ms
  })
})

// EJECUTAMOS LA SUITE COMPLETA
mainSuite.run()
```

## 5. Test Coverage (Cobertura de Pruebas)

### 5.1 Análisis de Cobertura

```javascript
// TEST COVERAGE - ANÁLISIS DE COBERTURA
// Sistema para medir qué tanto del código está cubierto por tests

class CoverageAnalyzer {
  constructor() {
    this.coverage = new Map()
    this.functions = new Map()
    this.branches = new Map()
    this.lines = new Map()
  }
  
  // REGISTRAR FUNCIÓN PARA ANÁLISIS
  registerFunction(name, fn) {
    const originalFn = fn
    let callCount = 0
    
    const wrappedFn = function(...args) {
      callCount++
      return originalFn.apply(this, args)
    }
    
    this.functions.set(name, { fn: wrappedFn, callCount, originalFn })
    return wrappedFn
  }
  
  // REGISTRAR BRANCH (CONDICIONAL)
  registerBranch(name, condition, trueBranch, falseBranch) {
    if (!this.branches.has(name)) {
      this.branches.set(name, { true: 0, false: 0 })
    }
    
    const branch = this.branches.get(name)
    
    if (condition) {
      branch.true++
      return trueBranch
    } else {
      branch.false++
      return falseBranch
    }
  }
  
  // REGISTRAR LÍNEA EJECUTADA
  registerLine(lineNumber) {
    if (!this.lines.has(lineNumber)) {
      this.lines.set(lineNumber, 0)
    }
    this.lines.set(lineNumber, this.lines.get(lineNumber) + 1)
  }
  
  // OBTENER ESTADÍSTICAS DE COBERTURA
  getCoverageStats() {
    const totalFunctions = this.functions.size
    const calledFunctions = Array.from(this.functions.values())
      .filter(f => f.callCount > 0).length
    
    const totalBranches = this.branches.size * 2
    const coveredBranches = Array.from(this.branches.values())
      .reduce((sum, b) => sum + (b.true > 0 ? 1 : 0) + (b.false > 0 ? 1 : 0), 0)
    
    const totalLines = this.lines.size
    const coveredLines = Array.from(this.lines.values())
      .filter(count => count > 0).length
    
    return {
      functions: {
        total: totalFunctions,
        covered: calledFunctions,
        percentage: totalFunctions > 0 ? (calledFunctions / totalFunctions) * 100 : 0
      },
      branches: {
        total: totalBranches,
        covered: coveredBranches,
        percentage: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0
      },
      lines: {
        total: totalLines,
        covered: coveredLines,
        percentage: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0
      },
      overall: {
        percentage: totalFunctions + totalBranches + totalLines > 0 
          ? ((calledFunctions + coveredBranches + coveredLines) / (totalFunctions + totalBranches + totalLines)) * 100 
          : 0
      }
    }
  }
  
  // IMPRIMIR REPORTE DE COBERTURA
  printCoverageReport() {
    const stats = this.getCoverageStats()
    
    console.log('\n📊 REPORTE DE COBERTURA DE TESTS')
    console.log('==================================')
    
    console.log(`\n🔧 FUNCIONES:`)
    console.log(`   Total: ${stats.functions.total}`)
    console.log(`   Cubiertas: ${stats.functions.covered}`)
    console.log(`   Cobertura: ${stats.functions.percentage.toFixed(1)}%`)
    
    console.log(`\n🌿 RAMAS:`)
    console.log(`   Total: ${stats.branches.total}`)
    console.log(`   Cubiertas: ${stats.branches.covered}`)
    console.log(`   Cobertura: ${stats.branches.percentage.toFixed(1)}%`)
    
    console.log(`\n📝 LÍNEAS:`)
    console.log(`   Total: ${stats.lines.total}`)
    console.log(`   Cubiertas: ${stats.lines.covered}`)
    console.log(`   Cobertura: ${stats.lines.percentage.toFixed(1)}%`)
    
    console.log(`\n🎯 COBERTURA GENERAL:`)
    console.log(`   ${stats.overall.percentage.toFixed(1)}%`)
    
    // Detalles de funciones
    if (this.functions.size > 0) {
      console.log(`\n📋 DETALLES DE FUNCIONES:`)
      for (const [name, info] of this.functions) {
        const status = info.callCount > 0 ? '✅' : '❌'
        console.log(`   ${status} ${name}: ${info.callCount} llamadas`)
      }
    }
    
    // Detalles de ramas
    if (this.branches.size > 0) {
      console.log(`\n🌿 DETALLES DE RAMAS:`)
      for (const [name, info] of this.branches) {
        const trueStatus = info.true > 0 ? '✅' : '❌'
        const falseStatus = info.false > 0 ? '✅' : '❌'
        console.log(`   ${name}: true=${trueStatus} (${info.true}), false=${falseStatus} (${info.false})`)
      }
    }
  }
}

// FUNCIÓN MEJORADA CON COBERTURA
function createCoverageCalculator() {
  const analyzer = new CoverageAnalyzer()
  
  // Registramos la función para análisis
  const coveredCalculateBasketTotal = analyzer.registerFunction(
    'calculateBasketTotal',
    function(basket) {
      analyzer.registerLine(1)
      
      if (!basket || !basket.items || !Array.isArray(basket.items)) {
        analyzer.registerLine(2)
        throw new Error('Basket must have an items array')
      }
      
      analyzer.registerLine(4)
      
      const result = basket.items.reduce((total, item) => {
        analyzer.registerLine(5)
        
        if (!item.unitPrice || !item.quantity) {
          analyzer.registerLine(6)
          throw new Error('Each item must have unitPrice and quantity')
        }
        
        analyzer.registerLine(8)
        return total + (item.unitPrice * item.quantity)
      }, 0)
      
      analyzer.registerLine(10)
      return result
    }
  )
  
  return { calculator: coveredCalculateBasketTotal, analyzer }
}

// USO DEL ANALIZADOR DE COBERTURA
const { calculator, analyzer } = createCoverageCalculator()

// TESTS PARA GENERAR COBERTURA
console.log('🧪 Ejecutando tests para análisis de cobertura...')

try {
  // Test 1: Cesta válida
  const result1 = calculator({
    items: [
      { name: 'Croissant', unitPrice: 2, quantity: 2 },
      { name: 'Olive bread', unitPrice: 3, quantity: 1 }
    ]
  })
  console.log('✅ Test 1 pasado, resultado:', result1)
  
  // Test 2: Cesta vacía
  const result2 = calculator({ items: [] })
  console.log('✅ Test 2 pasado, resultado:', result2)
  
  // Test 3: Error - basket null
  try {
    calculator(null)
  } catch (error) {
    console.log('✅ Test 3 pasado, error capturado:', error.message)
  }
  
  // Test 4: Error - basket sin items
  try {
    calculator({})
  } catch (error) {
    console.log('✅ Test 4 pasado, error capturado:', error.message)
  }
  
  // Test 5: Error - items no array
  try {
    calculator({ items: 'not array' })
  } catch (error) {
    console.log('✅ Test 5 pasado, error capturado:', error.message)
  }
  
  // Test 6: Error - item sin unitPrice
  try {
    calculator({
      items: [{ name: 'Test', quantity: 1 }]
    })
  } catch (error) {
    console.log('✅ Test 6 pasado, error capturado:', error.message)
  }
  
  // Test 7: Error - item sin quantity
  try {
    calculator({
      items: [{ name: 'Test', unitPrice: 1 }]
    })
  } catch (error) {
    console.log('✅ Test 7 pasado, error capturado:', error.message)
  }
  
} catch (error) {
  console.error('❌ Error en tests:', error.message)
}

// IMPRIMIMOS EL REPORTE DE COBERTURA
analyzer.printCoverageReport()
```

## Resumen de Testing

### **Tipos de Tests:**
- **Unit Tests**: Prueban funciones individuales
- **Integration Tests**: Prueban la interacción entre componentes
- **E2E Tests**: Prueban el flujo completo de la aplicación

### **Herramientas de Testing:**
- **Assert**: Módulo nativo de Node.js para aserciones
- **Test Runners**: Herramientas para ejecutar tests organizadamente
- **Coverage**: Análisis de qué tanto del código está cubierto

### **Mejores Prácticas:**
- **AAA Pattern**: Arrange, Act, Assert
- **Test Isolation**: Cada test debe ser independiente
- **Descriptive Names**: Nombres claros para los tests
- **Coverage Goals**: Apuntar a alta cobertura de código

### **Ventajas del Testing:**
- **Calidad**: Código más confiable y robusto
- **Mantenibilidad**: Facilita cambios y refactoring
- **Documentación**: Los tests documentan el comportamiento esperado
- **Confianza**: Permite hacer cambios sin miedo

---

*Esta es la séptima parte de la guía sobre testing. Continuaré con los siguientes capítulos sobre patrones avanzados y de escalabilidad.*
