# Node.js Design Patterns - Capítulo 9: Patrones de Diseño Comportamentales

## Introducción a los Patrones Comportamentales

Los patrones comportamentales se enfocan en la comunicación entre objetos, la asignación de responsabilidades y la encapsulación de algoritmos. Estos patrones ayudan a crear sistemas más flexibles y mantenibles.

## 1. Strategy Pattern (Patrón Estrategia)

### 1.1 Estrategia para Configuraciones Multiformato

El patrón Strategy permite definir una familia de algoritmos, encapsular cada uno y hacerlos intercambiables.

```javascript
// STRATEGY PATTERN - ESTRATEGIA PARA CONFIGURACIONES MULTIFORMATO
// Permite intercambiar algoritmos de procesamiento en tiempo de ejecución

// INTERFAZ COMÚN PARA TODAS LAS ESTRATEGIAS
class ConfigStrategy {
  async load(source) {
    throw new Error('Método load debe ser implementado')
  }
  
  async save(data, destination) {
    throw new Error('Método save debe ser implementado')
  }
  
  getSupportedExtensions() {
    throw new Error('Método getSupportedExtensions debe ser implementado')
  }
}

// ESTRATEGIA PARA ARCHIVOS JSON
class JsonStrategy extends ConfigStrategy {
  async load(source) {
    console.log(`📁 [JSON] Cargando configuración desde: ${source}`)
    
    // Simulamos lectura de archivo JSON
    return new Promise((resolve) => {
      setTimeout(() => {
        const config = {
          app: {
            name: 'Mi Aplicación',
            version: '1.0.0'
          },
          database: {
            host: 'localhost',
            port: 27017,
            name: 'mi_app_db'
          },
          env: {
            NODE_ENV: 'development',
            PORT: 3000
          }
        }
        
        console.log('✅ [JSON] Configuración cargada exitosamente')
        resolve(config)
      }, 100)
    })
  }
  
  async save(data, destination) {
    console.log(`💾 [JSON] Guardando configuración en: ${destination}`)
    
    // Simulamos escritura de archivo JSON
    return new Promise((resolve) => {
      setTimeout(() => {
        const jsonContent = JSON.stringify(data, null, 2)
        console.log(`📝 [JSON] Contenido a guardar:\n${jsonContent}`)
        console.log('✅ [JSON] Configuración guardada exitosamente')
        resolve({ success: true, format: 'json', destination })
      }, 150)
    })
  }
  
  getSupportedExtensions() {
    return ['.json']
  }
}

// ESTRATEGIA PARA ARCHIVOS YAML
class YamlStrategy extends ConfigStrategy {
  async load(source) {
    console.log(`📁 [YAML] Cargando configuración desde: ${source}`)
    
    // Simulamos lectura de archivo YAML
    return new Promise((resolve) => {
      setTimeout(() => {
        const config = {
          app: {
            name: 'Mi Aplicación',
            version: '1.0.0'
          },
          database: {
            host: 'localhost',
            port: 27017,
            name: 'mi_app_db'
          },
          env: {
            NODE_ENV: 'development',
            PORT: 3000
          }
        }
        
        console.log('✅ [YAML] Configuración cargada exitosamente')
        resolve(config)
      }, 120)
    })
  }
  
  async save(data, destination) {
    console.log(`💾 [YAML] Guardando configuración en: ${destination}`)
    
    // Simulamos escritura de archivo YAML
    return new Promise((resolve) => {
      setTimeout(() => {
        const yamlContent = this.convertToYaml(data)
        console.log(`📝 [YAML] Contenido a guardar:\n${yamlContent}`)
        console.log('✅ [YAML] Configuración guardada exitosamente')
        resolve({ success: true, format: 'yaml', destination })
      }, 180)
    })
  }
  
  // CONVERTIR OBJETO A FORMATO YAML SIMULADO
  convertToYaml(obj, indent = 0) {
    const spaces = '  '.repeat(indent)
    let yaml = ''
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${this.convertToYaml(value, indent + 1)}`
      } else {
        yaml += `${spaces}${key}: ${value}\n`
      }
    }
    
    return yaml
  }
  
  getSupportedExtensions() {
    return ['.yml', '.yaml']
  }
}

// ESTRATEGIA PARA ARCHIVOS TOML
class TomlStrategy extends ConfigStrategy {
  async load(source) {
    console.log(`📁 [TOML] Cargando configuración desde: ${source}`)
    
    // Simulamos lectura de archivo TOML
    return new Promise((resolve) => {
      setTimeout(() => {
        const config = {
          app: {
            name: 'Mi Aplicación',
            version: '1.0.0'
          },
          database: {
            host: 'localhost',
            port: 27017,
            name: 'mi_app_db'
          },
          env: {
            NODE_ENV: 'development',
            PORT: 3000
          }
        }
        
        console.log('✅ [TOML] Configuración cargada exitosamente')
        resolve(config)
      }, 90)
    })
  }
  
  async save(data, destination) {
    console.log(`💾 [TOML] Guardando configuración en: ${destination}`)
    
    // Simulamos escritura de archivo TOML
    return new Promise((resolve) => {
      setTimeout(() => {
        const tomlContent = this.convertToToml(data)
        console.log(`📝 [TOML] Contenido a guardar:\n${tomlContent}`)
        console.log('✅ [TOML] Configuración guardada exitosamente')
        resolve({ success: true, format: 'toml', destination })
      }, 200)
    })
  }
  
  // CONVERTIR OBJETO A FORMATO TOML SIMULADO
  convertToToml(obj, section = '') {
    let toml = ''
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = section ? `${section}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        toml += `[${fullKey}]\n${this.convertToToml(value, fullKey)}`
      } else {
        toml += `${key} = ${typeof value === 'string' ? `"${value}"` : value}\n`
      }
    }
    
    return toml
  }
  
  getSupportedExtensions() {
    return ['.toml']
  }
}

// CLASE PRINCIPAL QUE USA LAS ESTRATEGIAS
class Config {
  constructor(strategy) {
    this.strategy = strategy
    this.data = null
  }
  
  // CAMBIAR ESTRATEGIA EN TIEMPO DE EJECUCIÓN
  setStrategy(strategy) {
    this.strategy = strategy
    console.log(`🔄 [CONFIG] Estrategia cambiada a: ${strategy.constructor.name}`)
  }
  
  // CARGAR CONFIGURACIÓN USANDO LA ESTRATEGIA ACTUAL
  async load(source) {
    this.data = await this.strategy.load(source)
    return this.data
  }
  
  // GUARDAR CONFIGURACIÓN USANDO LA ESTRATEGIA ACTUAL
  async save(destination) {
    if (!this.data) {
      throw new Error('No hay datos para guardar. Carga la configuración primero.')
    }
    
    return await this.strategy.save(this.data, destination)
  }
  
  // OBTENER DATOS DE CONFIGURACIÓN
  getData() {
    return this.data
  }
  
  // MODIFICAR DATOS DE CONFIGURACIÓN
  updateData(updates) {
    if (!this.data) {
      throw new Error('No hay datos para actualizar. Carga la configuración primero.')
    }
    
    this.data = { ...this.data, ...updates }
    console.log('✅ [CONFIG] Datos actualizados:', updates)
  }
  
  // OBTENER EXTENSIONES SOPORTADAS
  getSupportedExtensions() {
    return this.strategy.getSupportedExtensions()
  }
}

// USO DEL PATRÓN STRATEGY
async function probarEstrategias() {
  try {
    // CREAMOS INSTANCIAS DE LAS ESTRATEGIAS
    const jsonStrategy = new JsonStrategy()
    const yamlStrategy = new YamlStrategy()
    const tomlStrategy = new TomlStrategy()
    
    // CONFIGURACIÓN CON ESTRATEGIA JSON
    console.log('🚀 === PRUEBA CON ESTRATEGIA JSON ===')
    const jsonConfig = new Config(jsonStrategy)
    
    await jsonConfig.load('./config.json')
    jsonConfig.updateData({
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--enable-source-maps'
      }
    })
    await jsonConfig.save('./config_mod.json')
    
    // CAMBIAMOS A ESTRATEGIA YAML
    console.log('\n🚀 === CAMBIANDO A ESTRATEGIA YAML ===')
    jsonConfig.setStrategy(yamlStrategy)
    await jsonConfig.save('./config_mod.yaml')
    
    // CONFIGURACIÓN CON ESTRATEGIA TOML
    console.log('\n🚀 === PRUEBA CON ESTRATEGIA TOML ===')
    const tomlConfig = new Config(tomlStrategy)
    
    await tomlConfig.load('./config.toml')
    tomlConfig.updateData({
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--enable-source-maps'
      }
    })
    await tomlConfig.save('./config_mod.toml')
    
    console.log('\n🎉 Todas las estrategias probadas exitosamente')
    
  } catch (error) {
    console.error('❌ Error probando estrategias:', error.message)
  }
}

// EJECUTAMOS LAS PRUEBAS
probarEstrategias()
```

**¿Por qué usar el patrón Strategy?**
- **Flexibilidad**: Cambiar algoritmos en tiempo de ejecución
- **Extensibilidad**: Fácil agregar nuevas estrategias
- **Mantenibilidad**: Cada estrategia es independiente
- **Testabilidad**: Fácil probar cada estrategia por separado

## 2. State Pattern (Patrón Estado)

### 2.1 Estado para Socket Failsafe

```javascript
// STATE PATTERN - ESTADO PARA SOCKET FAILSAFE
// Permite que un objeto cambie su comportamiento cuando cambia su estado interno

// INTERFAZ PARA TODOS LOS ESTADOS
class SocketState {
  connect(socket) {
    throw new Error('Método connect debe ser implementado')
  }
  
  disconnect(socket) {
    throw new Error('Método disconnect debe ser implementado')
  }
  
  send(socket, data) {
    throw new Error('Método send debe ser implementado')
  }
  
  receive(socket) {
    throw new Error('Método receive debe ser implementado')
  }
  
  getName() {
    return this.constructor.name
  }
}

// ESTADO DESCONECTADO
class DisconnectedState extends SocketState {
  connect(socket) {
    console.log('🔄 [DISCONNECTED] Intentando conectar...')
    
    // Simulamos intento de conexión
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        console.log('✅ [DISCONNECTED] Conexión exitosa')
        socket.setState(new ConnectedState())
      } else {
        console.log('❌ [DISCONNECTED] Conexión fallida, reintentando...')
        // Reintentamos después de un delay
        setTimeout(() => socket.connect(), 1000)
      }
    }, 500)
    
    return { status: 'connecting', message: 'Intentando conectar...' }
  }
  
  disconnect(socket) {
    console.log('⚠️ [DISCONNECTED] Ya está desconectado')
    return { status: 'disconnected', message: 'Ya está desconectado' }
  }
  
  send(socket, data) {
    console.log('❌ [DISCONNECTED] No se puede enviar datos - socket desconectado')
    throw new Error('Socket desconectado - no se pueden enviar datos')
  }
  
  receive(socket) {
    console.log('❌ [DISCONNECTED] No se puede recibir datos - socket desconectado')
    throw new Error('Socket desconectado - no se pueden recibir datos')
  }
}

// ESTADO CONECTADO
class ConnectedState extends SocketState {
  connect(socket) {
    console.log('⚠️ [CONNECTED] Ya está conectado')
    return { status: 'connected', message: 'Ya está conectado' }
  }
  
  disconnect(socket) {
    console.log('🔄 [CONNECTED] Desconectando...')
    
    // Simulamos desconexión
    setTimeout(() => {
      console.log('✅ [CONNECTED] Desconexión exitosa')
      socket.setState(new DisconnectedState())
    }, 300)
    
    return { status: 'disconnecting', message: 'Desconectando...' }
  }
  
  send(socket, data) {
    console.log(`📤 [CONNECTED] Enviando datos: ${JSON.stringify(data)}`)
    
    // Simulamos envío
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1
        if (success) {
          console.log('✅ [CONNECTED] Datos enviados exitosamente')
          resolve({ status: 'sent', data, timestamp: new Date().toISOString() })
        } else {
          console.log('❌ [CONNECTED] Error enviando datos, reconectando...')
          socket.setState(new ReconnectingState())
          reject(new Error('Error de envío - reconectando'))
        }
      }, 200)
    })
  }
  
  receive(socket) {
    console.log('📥 [CONNECTED] Esperando datos...')
    
    // Simulamos recepción
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = {
          id: Date.now(),
          message: 'Datos simulados recibidos',
          timestamp: new Date().toISOString()
        }
        console.log('✅ [CONNECTED] Datos recibidos:', data)
        resolve(data)
      }, 150)
    })
  }
}

// ESTADO RECONECTANDO
class ReconnectingState extends SocketState {
  constructor() {
    super()
    this.attempts = 0
    this.maxAttempts = 3
  }
  
  connect(socket) {
    this.attempts++
    console.log(`🔄 [RECONNECTING] Intento de reconexión ${this.attempts}/${this.maxAttempts}`)
    
    // Simulamos intento de reconexión
    setTimeout(() => {
      const success = Math.random() > 0.4
      if (success) {
        console.log('✅ [RECONNECTING] Reconexión exitosa')
        socket.setState(new ConnectedState())
      } else if (this.attempts < this.maxAttempts) {
        console.log(`❌ [RECONNECTING] Reconexión fallida, reintentando...`)
        setTimeout(() => socket.connect(), 1000)
      } else {
        console.log('💥 [RECONNECTING] Máximo de intentos alcanzado, desconectando')
        socket.setState(new DisconnectedState())
      }
    }, 800)
    
    return { status: 'reconnecting', attempts: this.attempts, maxAttempts: this.maxAttempts }
  }
  
  disconnect(socket) {
    console.log('🔄 [RECONNECTING] Cancelando reconexión y desconectando...')
    socket.setState(new DisconnectedState())
    return { status: 'disconnected', message: 'Reconexión cancelada' }
  }
  
  send(socket, data) {
    console.log('❌ [RECONNECTING] No se puede enviar datos - reconectando')
    throw new Error('Socket reconectando - no se pueden enviar datos')
  }
  
  receive(socket) {
    console.log('❌ [RECONNECTING] No se puede recibir datos - reconectando')
    throw new Error('Socket reconectando - no se pueden recibir datos')
  }
}

// CLASE PRINCIPAL DEL SOCKET
class FailsafeSocket {
  constructor() {
    this.state = new DisconnectedState()
    this.dataBuffer = []
    this.isActive = true
  }
  
  // CAMBIAR ESTADO
  setState(newState) {
    console.log(`🔄 [SOCKET] Cambiando estado de ${this.state.getName()} a ${newState.getName()}`)
    this.state = newState
  }
  
  // MÉTODOS QUE DELEGAN AL ESTADO ACTUAL
  connect() {
    return this.state.connect(this)
  }
  
  disconnect() {
    return this.state.disconnect(this)
  }
  
  async send(data) {
    try {
      const result = await this.state.send(this, data)
      return result
    } catch (error) {
      // Si falla el envío, guardamos en buffer para reintentar
      this.dataBuffer.push(data)
      console.log(`💾 [SOCKET] Datos guardados en buffer: ${this.dataBuffer.length} items`)
      throw error
    }
  }
  
  async receive() {
    return await this.state.receive(this)
  }
  
  // OBTENER ESTADO ACTUAL
  getCurrentState() {
    return {
      state: this.state.getName(),
      isActive: this.isActive,
      bufferSize: this.dataBuffer.length
    }
  }
  
  // REINTENTAR ENVÍO DE DATOS EN BUFFER
  async retryBufferedData() {
    if (this.dataBuffer.length === 0) {
      return { message: 'No hay datos en buffer' }
    }
    
    console.log(`🔄 [SOCKET] Reintentando envío de ${this.dataBuffer.length} items del buffer`)
    
    const results = []
    const failedItems = []
    
    for (const data of this.dataBuffer) {
      try {
        const result = await this.send(data)
        results.push(result)
      } catch (error) {
        failedItems.push(data)
      }
    }
    
    // Actualizamos el buffer con solo los items que fallaron
    this.dataBuffer = failedItems
    
    return {
      successful: results.length,
      failed: failedItems.length,
      remainingInBuffer: this.dataBuffer.length
    }
  }
}

// USO DEL SOCKET FAILSAFE
async function probarSocketFailsafe() {
  const socket = new FailsafeSocket()
  
  try {
    console.log('🚀 === INICIANDO PRUEBAS DEL SOCKET ===')
    
    // Estado inicial
    console.log('Estado inicial:', socket.getCurrentState())
    
    // Intentar conectar
    console.log('\n🔄 Conectando socket...')
    await socket.connect()
    
    // Esperar un poco para que se conecte
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Estado después de conexión:', socket.getCurrentState())
    
    // Enviar datos
    console.log('\n📤 Enviando datos...')
    const sendResult = await socket.send({ message: 'Hola mundo', timestamp: Date.now() })
    console.log('Resultado del envío:', sendResult)
    
    // Recibir datos
    console.log('\n📥 Recibiendo datos...')
    const receivedData = await socket.receive()
    console.log('Datos recibidos:', receivedData)
    
    // Estado actual
    console.log('\nEstado actual:', socket.getCurrentState())
    
    // Desconectar
    console.log('\n🔄 Desconectando socket...')
    socket.disconnect()
    
    // Esperar desconexión
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Estado final:', socket.getCurrentState())
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message)
  }
}

// EJECUTAMOS LAS PRUEBAS
probarSocketFailsafe()
```

## 3. Iterator Pattern (Patrón Iterador)

### 3.1 Iterador de Alfabeto

```javascript
// ITERATOR PATTERN - ITERADOR DE ALFABETO
// Proporciona una forma de acceder secuencialmente a los elementos de una colección

// INTERFAZ DEL ITERADOR
class Iterator {
  hasNext() {
    throw new Error('Método hasNext debe ser implementado')
  }
  
  next() {
    throw new Error('Método next debe ser implementado')
  }
  
  current() {
    throw new Error('Método current debe ser implementado')
  }
  
  reset() {
    throw new Error('Método reset debe ser implementado')
  }
}

// ITERADOR SIMPLE PARA ALFABETO
class AlphabetIterator extends Iterator {
  constructor(startChar = 'A', endChar = 'Z') {
    super()
    this.startChar = startChar.charCodeAt(0)
    this.endChar = endChar.charCodeAt(0)
    this.currentChar = this.startChar
  }
  
  hasNext() {
    return this.currentChar <= this.endChar
  }
  
  next() {
    if (!this.hasNext()) {
      throw new Error('No hay más elementos para iterar')
    }
    
    const char = String.fromCharCode(this.currentChar)
    this.currentChar++
    return char
  }
  
  current() {
    return String.fromCharCode(this.currentChar - 1)
  }
  
  reset() {
    this.currentChar = this.startChar
  }
  
  // MÉTODO ADICIONAL PARA OBTENER EL RANGO
  getRange() {
    return {
      start: String.fromCharCode(this.startChar),
      end: String.fromCharCode(this.endChar),
      total: this.endChar - this.startChar + 1
    }
  }
}

// ITERADOR BIDIRECCIONAL
class BidirectionalIterator extends Iterator {
  constructor(startChar = 'A', endChar = 'Z') {
    super()
    this.startChar = startChar.charCodeAt(0)
    this.endChar = endChar.charCodeAt(0)
    this.currentChar = this.startChar
    this.direction = 'forward' // 'forward' o 'backward'
  }
  
  hasNext() {
    if (this.direction === 'forward') {
      return this.currentChar <= this.endChar
    } else {
      return this.currentChar >= this.startChar
    }
  }
  
  next() {
    if (!this.hasNext()) {
      throw new Error('No hay más elementos para iterar')
    }
    
    const char = String.fromCharCode(this.currentChar)
    
    if (this.direction === 'forward') {
      this.currentChar++
    } else {
      this.currentChar--
    }
    
    return char
  }
  
  current() {
    return String.fromCharCode(this.currentChar)
  }
  
  reset() {
    this.currentChar = this.startChar
    this.direction = 'forward'
  }
  
  // CAMBIAR DIRECCIÓN
  reverse() {
    this.direction = this.direction === 'forward' ? 'backward' : 'forward'
    if (this.direction === 'backward') {
      this.currentChar = this.endChar
    } else {
      this.currentChar = this.startChar
    }
    console.log(`🔄 [ITERATOR] Dirección cambiada a: ${this.direction}`)
  }
  
  // IR AL PRINCIPIO
  goToStart() {
    this.currentChar = this.startChar
    this.direction = 'forward'
  }
  
  // IR AL FINAL
  goToEnd() {
    this.currentChar = this.endChar
    this.direction = 'backward'
  }
}

// ITERADOR CON FILTROS
class FilteredIterator extends Iterator {
  constructor(iterator, filter) {
    super()
    this.iterator = iterator
    this.filter = filter
    this.nextItem = null
    this.findNext()
  }
  
  // ENCONTRAR EL SIGUIENTE ELEMENTO QUE PASE EL FILTRO
  findNext() {
    this.nextItem = null
    while (this.iterator.hasNext()) {
      const item = this.iterator.next()
      if (this.filter(item)) {
        this.nextItem = item
        break
      }
    }
  }
  
  hasNext() {
    return this.nextItem !== null
  }
  
  next() {
    if (!this.hasNext()) {
      throw new Error('No hay más elementos para iterar')
    }
    
    const item = this.nextItem
    this.findNext()
    return item
  }
  
  current() {
    return this.nextItem
  }
  
  reset() {
    this.iterator.reset()
    this.findNext()
  }
}

// USO DE LOS ITERADORES
function probarIteradores() {
  console.log('🚀 === PRUEBA DE ITERADOR SIMPLE ===')
  
  const simpleIterator = new AlphabetIterator('A', 'F')
  console.log('Rango del iterador:', simpleIterator.getRange())
  
  console.log('Iterando hacia adelante:')
  while (simpleIterator.hasNext()) {
    console.log('Carácter actual:', simpleIterator.current())
    console.log('Siguiente:', simpleIterator.next())
  }
  
  console.log('\n🚀 === PRUEBA DE ITERADOR BIDIRECCIONAL ===')
  
  const biIterator = new BidirectionalIterator('A', 'E')
  
  console.log('Iterando hacia adelante:')
  while (biIterator.hasNext()) {
    console.log(biIterator.next())
  }
  
  biIterator.reverse()
  console.log('\nIterando hacia atrás:')
  while (biIterator.hasNext()) {
    console.log(biIterator.next())
  }
  
  console.log('\n🚀 === PRUEBA DE ITERADOR CON FILTRO ===')
  
  const vowelIterator = new FilteredIterator(
    new AlphabetIterator('A', 'Z'),
    (char) => 'AEIOU'.includes(char)
  )
  
  console.log('Solo vocales:')
  while (vowelIterator.hasNext()) {
    console.log(vowelIterator.next())
  }
  
  console.log('\n🚀 === PRUEBA DE ITERADOR CON FILTRO DE CONSONANTES ===')
  
  const consonantIterator = new FilteredIterator(
    new AlphabetIterator('A', 'Z'),
    (char) => !'AEIOU'.includes(char)
  )
  
  console.log('Solo consonantes:')
  const consonants = []
  while (consonantIterator.hasNext()) {
    consonants.push(consonantIterator.next())
  }
  
  console.log('Consonantes encontradas:', consonants.join(', '))
}

// EJECUTAMOS LAS PRUEBAS
probarIteradores()
```

## 4. Middleware Pattern (Patrón Middleware)

### 4.1 Middleware con ZMQ

```javascript
// MIDDLEWARE PATTERN - MIDDLEWARE CON ZMQ
// Permite procesar requests a través de una cadena de funciones

// INTERFAZ BASE PARA MIDDLEWARE
class Middleware {
  execute(context, next) {
    throw new Error('Método execute debe ser implementado')
  }
}

// MIDDLEWARE DE LOGGING
class LoggingMiddleware extends Middleware {
  execute(context, next) {
    console.log(`📝 [LOGGING] Request recibido: ${context.type}`)
    console.log(`📝 [LOGGING] Datos:`, context.data)
    console.log(`📝 [LOGGING] Timestamp: ${new Date().toISOString()}`)
    
    const startTime = Date.now()
    
    // Ejecutamos el siguiente middleware
    const result = next()
    
    const endTime = Date.now()
    console.log(`📝 [LOGGING] Request procesado en ${endTime - startTime}ms`)
    console.log(`📝 [LOGGING] Resultado:`, result)
    
    return result
  }
}

// MIDDLEWARE DE VALIDACIÓN
class ValidationMiddleware extends Middleware {
  execute(context, next) {
    console.log(`✅ [VALIDATION] Validando request: ${context.type}`)
    
    // Validaciones básicas
    if (!context.type) {
      throw new Error('Tipo de request requerido')
    }
    
    if (!context.data) {
      throw new Error('Datos requeridos')
    }
    
    if (context.type === 'user' && !context.data.email) {
      throw new Error('Email requerido para requests de usuario')
    }
    
    if (context.type === 'payment' && !context.data.amount) {
      throw new Error('Monto requerido para requests de pago')
    }
    
    console.log(`✅ [VALIDATION] Request válido`)
    
    // Ejecutamos el siguiente middleware
    return next()
  }
}

// MIDDLEWARE DE AUTENTICACIÓN
class AuthenticationMiddleware extends Middleware {
  constructor(validTokens = new Set()) {
    super()
    this.validTokens = validTokens
  }
  
  execute(context, next) {
    console.log(`🔐 [AUTH] Verificando autenticación`)
    
    const token = context.headers?.authorization?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error('Token de autorización requerido')
    }
    
    if (!this.validTokens.has(token)) {
      throw new Error('Token inválido')
    }
    
    console.log(`🔐 [AUTH] Usuario autenticado`)
    
    // Ejecutamos el siguiente middleware
    return next()
  }
  
  // AGREGAR TOKEN VÁLIDO
  addValidToken(token) {
    this.validTokens.add(token)
    console.log(`🔐 [AUTH] Token agregado: ${token}`)
  }
}

// MIDDLEWARE DE CACHING
class CachingMiddleware extends Middleware {
  constructor() {
    super()
    this.cache = new Map()
    this.ttl = 60000 // 1 minuto
  }
  
  execute(context, next) {
    const cacheKey = `${context.type}_${JSON.stringify(context.data)}`
    
    // Verificamos si tenemos el resultado en cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.ttl) {
        console.log(`💾 [CACHE] Resultado obtenido del cache`)
        return cached.data
      } else {
        // Cache expirado
        this.cache.delete(cacheKey)
      }
    }
    
    console.log(`💾 [CACHE] Ejecutando request y guardando en cache`)
    
    // Ejecutamos el siguiente middleware
    const result = next()
    
    // Guardamos en cache
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    })
    
    return result
  }
  
  // LIMPIAR CACHE
  clearCache() {
    this.cache.clear()
    console.log(`💾 [CACHE] Cache limpiado`)
  }
}

// PROCESADOR DE REQUESTS CON MIDDLEWARE
class RequestProcessor {
  constructor() {
    this.middlewareChain = []
  }
  
  // AGREGAR MIDDLEWARE A LA CADENA
  use(middleware) {
    this.middlewareChain.push(middleware)
    console.log(`🔗 [PROCESSOR] Middleware agregado: ${middleware.constructor.name}`)
  }
  
  // PROCESAR REQUEST A TRAVÉS DE LA CADENA DE MIDDLEWARE
  async processRequest(context) {
    console.log(`🚀 [PROCESSOR] Iniciando procesamiento de request: ${context.type}`)
    
    let index = 0
    
    // FUNCIÓN NEXT QUE se pasa entre middleware
    const next = () => {
      if (index >= this.middlewareChain.length) {
        // Llegamos al final de la cadena, ejecutamos la lógica del negocio
        return this.executeBusinessLogic(context)
      }
      
      const middleware = this.middlewareChain[index++]
      return middleware.execute(context, next)
    }
    
    try {
      const result = await next()
      console.log(`✅ [PROCESSOR] Request procesado exitosamente`)
      return result
    } catch (error) {
      console.error(`❌ [PROCESSOR] Error procesando request:`, error.message)
      throw error
    }
  }
  
  // LÓGICA DEL NEGOCIO (ejecutada al final de la cadena)
  async executeBusinessLogic(context) {
    console.log(`🏢 [BUSINESS] Ejecutando lógica del negocio para: ${context.type}`)
    
    // Simulamos diferentes tipos de lógica del negocio
    switch (context.type) {
      case 'user':
        return await this.processUserRequest(context.data)
      
      case 'payment':
        return await this.processPaymentRequest(context.data)
      
      case 'notification':
        return await this.processNotificationRequest(context.data)
      
      default:
        throw new Error(`Tipo de request no soportado: ${context.type}`)
    }
  }
  
  // PROCESAR REQUEST DE USUARIO
  async processUserRequest(data) {
    console.log(`👤 [USER] Procesando usuario:`, data)
    
    // Simulamos procesamiento
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
      id: Date.now(),
      ...data,
      status: 'processed',
      timestamp: new Date().toISOString()
    }
  }
  
  // PROCESAR REQUEST DE PAGO
  async processPaymentRequest(data) {
    console.log(`💳 [PAYMENT] Procesando pago:`, data)
    
    // Simulamos procesamiento
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      transactionId: `TXN_${Date.now()}`,
      ...data,
      status: 'completed',
      timestamp: new Date().toISOString()
    }
  }
  
  // PROCESAR REQUEST DE NOTIFICACIÓN
  async processNotificationRequest(data) {
    console.log(`📢 [NOTIFICATION] Procesando notificación:`, data)
    
    // Simulamos procesamiento
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      notificationId: `NOT_${Date.now()}`,
      ...data,
      status: 'sent',
      timestamp: new Date().toISOString()
    }
  }
}

// USO DEL SISTEMA DE MIDDLEWARE
async function probarMiddleware() {
  try {
    // CREAMOS EL PROCESADOR
    const processor = new RequestProcessor()
    
    // AGREGAMOS MIDDLEWARE EN ORDEN
    processor.use(new LoggingMiddleware())
    processor.use(new ValidationMiddleware())
    processor.use(new AuthenticationMiddleware())
    processor.use(new CachingMiddleware())
    
    // AGREGAMOS TOKENS VÁLIDOS
    const authMiddleware = processor.middlewareChain.find(m => m instanceof AuthenticationMiddleware)
    authMiddleware.addValidToken('token123')
    authMiddleware.addValidToken('token456')
    
    // PROBAMOS DIFERENTES TIPOS DE REQUESTS
    console.log('🚀 === PRUEBA DE REQUEST DE USUARIO ===')
    const userResult = await processor.processRequest({
      type: 'user',
      data: { nombre: 'Juan', email: 'juan@email.com' },
      headers: { authorization: 'Bearer token123' }
    })
    console.log('Resultado usuario:', userResult)
    
    console.log('\n🚀 === PRUEBA DE REQUEST DE PAGO ===')
    const paymentResult = await processor.processRequest({
      type: 'payment',
      data: { amount: 100.50, currency: 'USD' },
      headers: { authorization: 'Bearer token456' }
    })
    console.log('Resultado pago:', paymentResult)
    
    console.log('\n🚀 === PRUEBA DE REQUEST DE NOTIFICACIÓN ===')
    const notificationResult = await processor.processRequest({
      type: 'notification',
      data: { message: 'Hola mundo', priority: 'high' },
      headers: { authorization: 'Bearer token123' }
    })
    console.log('Resultado notificación:', notificationResult)
    
    // PROBAMOS CACHE (segunda ejecución del mismo request)
    console.log('\n🚀 === PRUEBA DE CACHE ===')
    const cachedResult = await processor.processRequest({
      type: 'user',
      data: { nombre: 'Juan', email: 'juan@email.com' },
      headers: { authorization: 'Bearer token123' }
    })
    console.log('Resultado cacheado:', cachedResult)
    
  } catch (error) {
    console.error('💥 Error en las pruebas:', error.message)
  }
}

// EJECUTAMOS LAS PRUEBAS
probarMiddleware()
```

## Resumen de Patrones Comportamentales

### **Strategy Pattern:**
- **Propósito**: Intercambiar algoritmos en tiempo de ejecución
- **Cuándo usar**: Cuando tienes múltiples algoritmos para la misma tarea
- **Ventajas**: Flexibilidad, extensibilidad, fácil testing
- **Ejemplos**: Procesamiento de archivos, validaciones, algoritmos de pago

### **State Pattern:**
- **Propósito**: Cambiar comportamiento basado en estado interno
- **Cuándo usar**: Cuando un objeto tiene múltiples estados con comportamientos diferentes
- **Ventajas**: Elimina condicionales complejos, encapsula lógica de estado
- **Ejemplos**: Máquinas de estado, conexiones de red, workflows

### **Iterator Pattern:**
- **Propósito**: Acceder secuencialmente a elementos de una colección
- **Cuándo usar**: Cuando necesitas iterar sobre estructuras de datos complejas
- **Ventajas**: Encapsula lógica de iteración, permite diferentes estrategias
- **Tipos**: Simple, bidireccional, con filtros

### **Middleware Pattern:**
- **Propósito**: Procesar requests a través de una cadena de funciones
- **Cuándo usar**: Cuando necesitas aplicar múltiples transformaciones
- **Ventajas**: Modularidad, reutilización, fácil testing
- **Ejemplos**: Frameworks web, procesamiento de datos, validaciones

### **Cuándo usar cada patrón:**
- **Strategy**: Múltiples algoritmos para la misma tarea
- **State**: Comportamiento que cambia con el estado
- **Iterator**: Iteración sobre colecciones complejas
- **Middleware**: Procesamiento en cadena de requests

---

*Esta es la sexta parte de la guía sobre patrones comportamentales. Continuaré con los siguientes capítulos sobre testing y patrones avanzados.*
