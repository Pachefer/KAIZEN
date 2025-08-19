# Node.js Design Patterns - Capítulos Finales: Patrones Avanzados y Escalabilidad

## Capítulo 11: Patrones Avanzados (Advanced Recipes)

### 1. Patrón de Retry con Backoff Exponencial

```javascript
// PATRÓN DE RETRY CON BACKOFF EXPONENCIAL
// Reintenta operaciones fallidas con delays incrementales

class RetryManager {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay
  }
  
  async executeWithRetry(operation, context = {}) {
    let lastError
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt + 1}/${this.maxRetries + 1}`)
        return await operation(context)
        
      } catch (error) {
        lastError = error
        console.log(`❌ Intento ${attempt + 1} falló: ${error.message}`)
        
        if (attempt < this.maxRetries) {
          const delay = this.calculateDelay(attempt)
          console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`)
          await this.sleep(delay)
        }
      }
    }
    
    throw new Error(`Operación falló después de ${this.maxRetries + 1} intentos. Último error: ${lastError.message}`)
  }
  
  calculateDelay(attempt) {
    // Backoff exponencial: 1s, 2s, 4s, 8s...
    return this.baseDelay * Math.pow(2, attempt)
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// USO DEL PATRÓN DE RETRY
const retryManager = new RetryManager(3, 1000)

async function operacionRiesgosa() {
  const success = Math.random() > 0.7
  if (!success) {
    throw new Error('Operación falló aleatoriamente')
  }
  return 'Operación exitosa'
}

retryManager.executeWithRetry(operacionRiesgosa)
  .then(result => console.log('✅ Resultado:', result))
  .catch(error => console.error('💥 Error final:', error.message))
```

### 2. Patrón de Circuit Breaker

```javascript
// PATRÓN CIRCUIT BREAKER
// Previene fallos en cascada y mejora la resiliencia

class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold
    this.resetTimeout = resetTimeout
    this.failureCount = 0
    this.lastFailureTime = null
    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN'
        console.log('🔄 Circuit breaker cambiando a HALF_OPEN')
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
    console.log('✅ Operación exitosa, circuit breaker en CLOSED')
  }
  
  onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
      console.log('💥 Circuit breaker cambiando a OPEN')
    }
  }
  
  shouldAttemptReset() {
    return Date.now() - this.lastFailureTime >= this.resetTimeout
  }
  
  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    }
  }
}

// USO DEL CIRCUIT BREAKER
const circuitBreaker = new CircuitBreaker(3, 10000)

async function operacionInestable() {
  const success = Math.random() > 0.3
  if (!success) {
    throw new Error('Operación inestable falló')
  }
  return 'Operación estable completada'
}

// Simulamos múltiples ejecuciones
async function probarCircuitBreaker() {
  for (let i = 0; i < 10; i++) {
    try {
      const result = await circuitBreaker.execute(operacionInestable)
      console.log(`✅ Ejecución ${i + 1}: ${result}`)
    } catch (error) {
      console.log(`❌ Ejecución ${i + 1}: ${error.message}`)
    }
    
    console.log('Estado:', circuitBreaker.getStatus())
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

probarCircuitBreaker()
```

## Capítulo 12: Patrones de Escalabilidad y Arquitectura

### 1. Patrón de Load Balancer

```javascript
// PATRÓN DE LOAD BALANCER
// Distribuye carga entre múltiples instancias

class LoadBalancer {
  constructor(strategy = 'round-robin') {
    this.strategy = strategy
    this.servers = []
    this.currentIndex = 0
    this.healthChecks = new Map()
  }
  
  addServer(server) {
    this.servers.push(server)
    this.healthChecks.set(server.id, { healthy: true, lastCheck: Date.now() })
    console.log(`➕ Servidor agregado: ${server.id}`)
  }
  
  removeServer(serverId) {
    const index = this.servers.findIndex(s => s.id === serverId)
    if (index > -1) {
      this.servers.splice(index, 1)
      this.healthChecks.delete(serverId)
      console.log(`➖ Servidor removido: ${serverId}`)
    }
  }
  
  getNextServer() {
    if (this.servers.length === 0) {
      throw new Error('No hay servidores disponibles')
    }
    
    const healthyServers = this.servers.filter(server => 
      this.healthChecks.get(server.id)?.healthy
    )
    
    if (healthyServers.length === 0) {
      throw new Error('No hay servidores saludables')
    }
    
    switch (this.strategy) {
      case 'round-robin':
        return this.roundRobin(healthyServers)
      case 'least-connections':
        return this.leastConnections(healthyServers)
      case 'random':
        return this.random(healthyServers)
      default:
        return this.roundRobin(healthyServers)
    }
  }
  
  roundRobin(servers) {
    const server = servers[this.currentIndex % servers.length]
    this.currentIndex = (this.currentIndex + 1) % servers.length
    return server
  }
  
  leastConnections(servers) {
    return servers.reduce((min, server) => 
      server.connections < min.connections ? server : min
    )
  }
  
  random(servers) {
    return servers[Math.floor(Math.random() * servers.length)]
  }
  
  async healthCheck(server) {
    try {
      // Simulamos health check
      await new Promise(resolve => setTimeout(resolve, 100))
      const healthy = Math.random() > 0.1
      
      this.healthChecks.set(server.id, {
        healthy,
        lastCheck: Date.now()
      })
      
      return healthy
    } catch (error) {
      this.healthChecks.set(server.id, {
        healthy: false,
        lastCheck: Date.now()
      })
      return false
    }
  }
  
  async routeRequest(request) {
    const server = this.getNextServer()
    console.log(`🔄 Enrutando request a servidor: ${server.id}`)
    
    try {
      const response = await server.handleRequest(request)
      server.connections++
      return response
    } catch (error) {
      console.error(`❌ Error en servidor ${server.id}:`, error.message)
      throw error
    } finally {
      server.connections--
    }
  }
}

// SERVIDOR SIMULADO
class Server {
  constructor(id, capacity = 100) {
    this.id = id
    this.capacity = capacity
    this.connections = 0
  }
  
  async handleRequest(request) {
    if (this.connections >= this.capacity) {
      throw new Error('Servidor sobrecargado')
    }
    
    // Simulamos procesamiento
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500))
    
    return {
      serverId: this.id,
      requestId: request.id,
      response: `Respuesta del servidor ${this.id}`,
      timestamp: new Date().toISOString()
    }
  }
}

// USO DEL LOAD BALANCER
const loadBalancer = new LoadBalancer('round-robin')

// Agregamos servidores
loadBalancer.addServer(new Server('server-1', 50))
loadBalancer.addServer(new Server('server-2', 75))
loadBalancer.addServer(new Server('server-3', 100))

// Simulamos requests
async function simularRequests() {
  for (let i = 0; i < 10; i++) {
    try {
      const response = await loadBalancer.routeRequest({ id: `req-${i + 1}` })
      console.log(`✅ Request ${i + 1}:`, response.response)
    } catch (error) {
      console.error(`❌ Request ${i + 1} falló:`, error.message)
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

simularRequests()
```

### 2. Patrón de Microservicios

```javascript
// PATRÓN DE MICROSERVICIOS
// Arquitectura distribuida con servicios independientes

class Microservice {
  constructor(name, port) {
    this.name = name
    this.port = port
    this.endpoints = new Map()
    this.dependencies = new Map()
    this.healthStatus = 'healthy'
  }
  
  addEndpoint(method, path, handler) {
    const key = `${method.toUpperCase()}:${path}`
    this.endpoints.set(key, handler)
    console.log(`🔗 Endpoint agregado: ${method.toUpperCase()} ${path}`)
  }
  
  addDependency(serviceName, serviceUrl) {
    this.dependencies.set(serviceName, serviceUrl)
    console.log(`🔗 Dependencia agregada: ${serviceName} -> ${serviceUrl}`)
  }
  
  async handleRequest(method, path, data) {
    const key = `${method.toUpperCase()}:${path}`
    const handler = this.endpoints.get(key)
    
    if (!handler) {
      throw new Error(`Endpoint no encontrado: ${method} ${path}`)
    }
    
    try {
      return await handler(data)
    } catch (error) {
      console.error(`❌ Error en ${this.name}:`, error.message)
      throw error
    }
  }
  
  async healthCheck() {
    const checks = []
    
    // Verificamos dependencias
    for (const [serviceName, serviceUrl] of this.dependencies) {
      try {
        // Simulamos health check de dependencia
        await new Promise(resolve => setTimeout(resolve, 50))
        checks.push({ service: serviceName, status: 'healthy' })
      } catch (error) {
        checks.push({ service: serviceName, status: 'unhealthy' })
      }
    }
    
    const allHealthy = checks.every(check => check.status === 'healthy')
    this.healthStatus = allHealthy ? 'healthy' : 'degraded'
    
    return {
      service: this.name,
      status: this.healthStatus,
      timestamp: new Date().toISOString(),
      dependencies: checks
    }
  }
}

// SERVICIO DE USUARIOS
class UserService extends Microservice {
  constructor() {
    super('user-service', 3001)
    this.users = new Map()
    this.setupEndpoints()
  }
  
  setupEndpoints() {
    this.addEndpoint('GET', '/users', async () => {
      return Array.from(this.users.values())
    })
    
    this.addEndpoint('GET', '/users/:id', async (data) => {
      const user = this.users.get(data.params.id)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }
      return user
    })
    
    this.addEndpoint('POST', '/users', async (data) => {
      const user = {
        id: Date.now().toString(),
        ...data.body,
        createdAt: new Date().toISOString()
      }
      this.users.set(user.id, user)
      return user
    })
  }
}

// SERVICIO DE NOTIFICACIONES
class NotificationService extends Microservice {
  constructor() {
    super('notification-service', 3002)
    this.notifications = []
    this.setupEndpoints()
  }
  
  setupEndpoints() {
    this.addEndpoint('POST', '/notifications', async (data) => {
      const notification = {
        id: Date.now().toString(),
        ...data.body,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      this.notifications.push(notification)
      
      // Simulamos envío
      await this.sendNotification(notification)
      
      return notification
    })
    
    this.addEndpoint('GET', '/notifications', async () => {
      return this.notifications
    })
  }
  
  async sendNotification(notification) {
    // Simulamos envío asíncrono
    setTimeout(() => {
      notification.status = 'sent'
      notification.sentAt = new Date().toISOString()
      console.log(`📧 Notificación enviada: ${notification.id}`)
    }, 1000)
  }
}

// API GATEWAY
class ApiGateway {
  constructor() {
    this.services = new Map()
    this.routes = new Map()
  }
  
  registerService(service) {
    this.services.set(service.name, service)
    console.log(`🔗 Servicio registrado: ${service.name}`)
  }
  
  addRoute(path, serviceName, method = 'GET') {
    this.routes.set(path, { serviceName, method })
    console.log(`🛣️ Ruta agregada: ${method} ${path} -> ${serviceName}`)
  }
  
  async routeRequest(method, path, data) {
    const route = this.routes.get(path)
    
    if (!route) {
      throw new Error(`Ruta no encontrada: ${method} ${path}`)
    }
    
    const service = this.services.get(route.serviceName)
    if (!service) {
      throw new Error(`Servicio no encontrado: ${route.serviceName}`)
    }
    
    console.log(`🔄 Gateway enrutando ${method} ${path} a ${service.name}`)
    return await service.handleRequest(method, path, data)
  }
  
  async healthCheck() {
    const checks = []
    
    for (const [name, service] of this.services) {
      try {
        const health = await service.healthCheck()
        checks.push(health)
      } catch (error) {
        checks.push({
          service: name,
          status: 'unhealthy',
          error: error.message
        })
      }
    }
    
    return {
      gateway: 'healthy',
      timestamp: new Date().toISOString(),
      services: checks
    }
  }
}

// USO DEL SISTEMA DE MICROSERVICIOS
const userService = new UserService()
const notificationService = new NotificationService()

const apiGateway = new ApiGateway()

// Registramos servicios
apiGateway.registerService(userService)
apiGateway.registerService(notificationService)

// Configuramos rutas
apiGateway.addRoute('/users', 'user-service', 'GET')
apiGateway.addRoute('/users/:id', 'user-service', 'GET')
apiGateway.addRoute('/users', 'user-service', 'POST')
apiGateway.addRoute('/notifications', 'notification-service', 'POST')
apiGateway.addRoute('/notifications', 'notification-service', 'GET')

// Simulamos requests
async function probarMicroservicios() {
  try {
    // Crear usuario
    const user = await apiGateway.routeRequest('POST', '/users', {
      body: { name: 'Juan', email: 'juan@email.com' }
    })
    console.log('✅ Usuario creado:', user)
    
    // Obtener usuarios
    const users = await apiGateway.routeRequest('GET', '/users')
    console.log('✅ Usuarios obtenidos:', users)
    
    // Crear notificación
    const notification = await apiGateway.routeRequest('POST', '/notifications', {
      body: { message: 'Bienvenido Juan!', userId: user.id }
    })
    console.log('✅ Notificación creada:', notification)
    
    // Health check
    const health = await apiGateway.healthCheck()
    console.log('✅ Health check:', health)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

probarMicroservicios()
```

## Capítulo 13: Patrones de Mensajería e Integración

### 1. Patrón de Message Queue

```javascript
// PATRÓN DE MESSAGE QUEUE
// Sistema de cola de mensajes para comunicación asíncrona

class MessageQueue {
  constructor() {
    this.queues = new Map()
    this.subscribers = new Map()
    this.processing = false
  }
  
  // CREAR COLA
  createQueue(name) {
    if (!this.queues.has(name)) {
      this.queues.set(name, [])
      this.subscribers.set(name, [])
      console.log(`📬 Cola creada: ${name}`)
    }
  }
  
  // PUBLICAR MENSAJE
  publish(queueName, message) {
    if (!this.queues.has(queueName)) {
      throw new Error(`Cola no encontrada: ${queueName}`)
    }
    
    const messageWithMetadata = {
      id: Date.now().toString(),
      data: message,
      timestamp: new Date().toISOString(),
      attempts: 0
    }
    
    this.queues.get(queueName).push(messageWithMetadata)
    console.log(`📤 Mensaje publicado en ${queueName}:`, messageWithMetadata.id)
    
    // Procesar cola si no está procesando
    if (!this.processing) {
      this.processQueue(queueName)
    }
  }
  
  // SUSCRIBIRSE A COLA
  subscribe(queueName, handler) {
    if (!this.subscribers.has(queueName)) {
      throw new Error(`Cola no encontrada: ${queueName}`)
    }
    
    this.subscribers.get(queueName).push(handler)
    console.log(`👂 Suscriptor agregado a ${queueName}`)
  }
  
  // PROCESAR COLA
  async processQueue(queueName) {
    if (this.processing) return
    
    this.processing = true
    const queue = this.queues.get(queueName)
    const subscribers = this.subscribers.get(queueName)
    
    while (queue.length > 0 && subscribers.length > 0) {
      const message = queue.shift()
      const handler = subscribers[0] // Round-robin simple
      
      try {
        console.log(`🔄 Procesando mensaje ${message.id} en ${queueName}`)
        await handler(message.data)
        console.log(`✅ Mensaje ${message.id} procesado exitosamente`)
        
      } catch (error) {
        console.error(`❌ Error procesando mensaje ${message.id}:`, error.message)
        
        // Reintentar si no excedió el límite
        if (message.attempts < 3) {
          message.attempts++
          message.timestamp = new Date().toISOString()
          queue.unshift(message)
          console.log(`🔄 Reintentando mensaje ${message.id} (intento ${message.attempts})`)
        } else {
          console.log(`💥 Mensaje ${message.id} descartado después de 3 intentos`)
        }
      }
    }
    
    this.processing = false
    
    // Si quedan mensajes, continuar procesando
    if (queue.length > 0) {
      setTimeout(() => this.processQueue(queueName), 100)
    }
  }
  
  // OBTENER ESTADÍSTICAS
  getStats() {
    const stats = {}
    
    for (const [name, queue] of this.queues) {
      stats[name] = {
        queueLength: queue.length,
        subscribers: this.subscribers.get(name).length,
        processing: this.processing
      }
    }
    
    return stats
  }
}

// USO DEL MESSAGE QUEUE
const messageQueue = new MessageQueue()

// Creamos colas
messageQueue.createQueue('user-events')
messageQueue.createQueue('notifications')
messageQueue.createQueue('analytics')

// Handlers para diferentes tipos de mensajes
const userEventHandler = async (data) => {
  console.log(`👤 Procesando evento de usuario:`, data)
  // Simulamos procesamiento
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log(`✅ Evento de usuario procesado`)
}

const notificationHandler = async (data) => {
  console.log(`📧 Procesando notificación:`, data)
  // Simulamos procesamiento
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`✅ Notificación procesada`)
}

const analyticsHandler = async (data) => {
  console.log(`📊 Procesando analytics:`, data)
  // Simulamos procesamiento
  await new Promise(resolve => setTimeout(resolve, 150))
  console.log(`✅ Analytics procesado`)
}

// Nos suscribimos a las colas
messageQueue.subscribe('user-events', userEventHandler)
messageQueue.subscribe('notifications', notificationHandler)
messageQueue.subscribe('analytics', analyticsHandler)

// Publicamos mensajes
messageQueue.publish('user-events', {
  type: 'user_registered',
  userId: '123',
  email: 'juan@email.com'
})

messageQueue.publish('notifications', {
  type: 'welcome_email',
  userId: '123',
  template: 'welcome'
})

messageQueue.publish('analytics', {
  event: 'page_view',
  page: '/dashboard',
  userId: '123'
})

// Verificamos estadísticas
setTimeout(() => {
  console.log('📊 Estadísticas de colas:', messageQueue.getStats())
}, 1000)
```

## Resumen Final de Patrones Avanzados

### **Patrones de Resiliencia:**
- **Retry Pattern**: Reintentos con backoff exponencial
- **Circuit Breaker**: Previene fallos en cascada
- **Health Checks**: Monitoreo de estado de servicios

### **Patrones de Escalabilidad:**
- **Load Balancer**: Distribución de carga
- **Microservicios**: Arquitectura distribuida
- **API Gateway**: Punto de entrada unificado

### **Patrones de Mensajería:**
- **Message Queue**: Comunicación asíncrona
- **Event-Driven**: Arquitectura basada en eventos
- **Pub/Sub**: Patrón publicador/suscriptor

### **Cuándo usar cada patrón:**
- **Retry**: Operaciones temporales que pueden fallar
- **Circuit Breaker**: Servicios externos inestables
- **Load Balancer**: Distribuir carga entre instancias
- **Microservicios**: Aplicaciones complejas y grandes
- **Message Queue**: Comunicación asíncrona entre servicios

---

## 🎉 Guía Completa Finalizada

Esta guía completa del libro "Node.js Design Patterns" incluye:

✅ **Capítulo 2**: Sistema de Módulos
✅ **Capítulos 4-5**: Control de Flujo Asíncrono
✅ **Capítulo 6**: Programando con Streams
✅ **Capítulo 7**: Patrones Creacionales
✅ **Capítulo 8**: Patrones Estructurales
✅ **Capítulo 9**: Patrones Comportamentales
✅ **Capítulo 10**: Testing
✅ **Capítulos 11-13**: Patrones Avanzados y Escalabilidad

### **Características de la Guía:**
- **Traducción completa al español**
- **Comentarios línea por línea**
- **Ejemplos prácticos y ejecutables**
- **Explicaciones detalladas**
- **Casos de uso reales**
- **Mejores prácticas**
- **Código moderno y actualizado**

### **Patrones Cubiertos:**
- **Creacionales**: Factory, Builder, Singleton, DI
- **Estructurales**: Proxy, Decorator, Adapter
- **Comportamentales**: Strategy, State, Iterator, Middleware
- **Avanzados**: Retry, Circuit Breaker, Load Balancer
- **Arquitectura**: Microservicios, Message Queue, API Gateway

La guía está diseñada para facilitar el aprendizaje y la implementación práctica de todos los patrones de diseño en Node.js.
