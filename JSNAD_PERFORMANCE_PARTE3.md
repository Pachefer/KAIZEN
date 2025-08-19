# 🚀 Performance y Optimización - Parte 3 (JSNAD)

## 🗄️ Optimización de Base de Datos

### Connection Pooling y Query Optimization

```javascript
// database-optimization.js
const { EventEmitter } = require('events');

// Clase para connection pooling
class DatabaseConnectionPool extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      minConnections: options.minConnections || 5,
      maxConnections: options.maxConnections || 20,
      acquireTimeout: options.acquireTimeout || 30000, // 30 segundos
      idleTimeout: options.idleTimeout || 60000, // 1 minuto
      reapInterval: options.reapInterval || 1000, // 1 segundo
      createConnection: options.createConnection || this.createMockConnection,
      destroyConnection: options.destroyConnection || this.destroyMockConnection
    };
    
    this.connections = new Map();
    this.available = [];
    this.inUse = new Set();
    this.waiting = [];
    
    this.stats = {
      created: 0,
      acquired: 0,
      released: 0,
      destroyed: 0,
      errors: 0,
      waitTime: 0,
      totalWaiters: 0
    };
    
    // Inicializar pool
    this.initialize();
    
    // Iniciar mantenimiento
    this.startMaintenance();
    
    console.log(`🏊 Pool de conexiones iniciado: ${this.options.minConnections}-${this.options.maxConnections} conexiones`);
  }
  
  // Inicializar pool
  async initialize() {
    try {
      // Crear conexiones mínimas
      for (let i = 0; i < this.options.minConnections; i++) {
        await this.createConnection();
      }
      
      this.emit('initialized');
    } catch (error) {
      this.emit('error', error);
      console.error('Error inicializando pool:', error.message);
    }
  }
  
  // Crear conexión mock (reemplazar con implementación real)
  async createMockConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const connection = {
          id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          lastUsed: Date.now(),
          isHealthy: true,
          queryCount: 0
        };
        
        resolve(connection);
      }, Math.random() * 100); // Simular tiempo variable de creación
    });
  }
  
  // Destruir conexión mock
  async destroyMockConnection(connection) {
    return new Promise((resolve) => {
      setTimeout(() => {
        connection.isHealthy = false;
        resolve();
      }, Math.random() * 50);
    });
  }
  
  // Crear nueva conexión
  async createConnection() {
    try {
      const connection = await this.options.createConnection();
      
      this.connections.set(connection.id, connection);
      this.available.push(connection);
      this.stats.created++;
      
      this.emit('connection:created', connection);
      
      return connection;
    } catch (error) {
      this.stats.errors++;
      this.emit('connection:error', error);
      throw error;
    }
  }
  
  // Obtener conexión del pool
  async acquire() {
    const startTime = Date.now();
    
    // Verificar si hay conexiones disponibles
    if (this.available.length > 0) {
      const connection = this.available.pop();
      this.inUse.add(connection);
      connection.lastUsed = Date.now();
      
      this.stats.acquired++;
      this.emit('connection:acquired', connection);
      
      return connection;
    }
    
    // Verificar si podemos crear más conexiones
    if (this.connections.size < this.options.maxConnections) {
      try {
        const connection = await this.createConnection();
        this.inUse.add(connection);
        connection.lastUsed = Date.now();
        
        this.stats.acquired++;
        this.emit('connection:acquired', connection);
        
        return connection;
      } catch (error) {
        this.stats.errors++;
        throw error;
      }
    }
    
    // Esperar por una conexión disponible
    return new Promise((resolve, reject) => {
      const waiter = {
        resolve,
        reject,
        timestamp: Date.now(),
        timeout: setTimeout(() => {
          this.stats.errors++;
          reject(new Error('Timeout esperando conexión'));
        }, this.options.acquireTimeout)
      };
      
      this.waiting.push(waiter);
      this.stats.totalWaiters++;
      
      this.emit('connection:waiting', this.waiting.length);
    });
  }
  
  // Liberar conexión al pool
  release(connection) {
    if (!this.inUse.has(connection)) {
      throw new Error('Conexión no está en uso');
    }
    
    this.inUse.delete(connection);
    connection.lastUsed = Date.now();
    
    // Verificar si la conexión está saludable
    if (connection.isHealthy && this.available.length < this.options.maxConnections) {
      this.available.push(connection);
    } else {
      this.destroyConnection(connection);
    }
    
    this.stats.released++;
    this.emit('connection:released', connection);
    
    // Procesar waiters si hay conexiones disponibles
    this.processWaiters();
  }
  
  // Procesar waiters
  processWaiters() {
    while (this.waiting.length > 0 && this.available.length > 0) {
      const waiter = this.waiting.shift();
      const connection = this.available.pop();
      
      clearTimeout(waiter.timeout);
      
      this.inUse.add(connection);
      connection.lastUsed = Date.now();
      
      this.stats.acquired++;
      this.stats.waitTime += Date.now() - waiter.timestamp;
      
      waiter.resolve(connection);
      this.emit('connection:acquired', connection);
    }
  }
  
  // Destruir conexión
  async destroyConnection(connection) {
    try {
      await this.options.destroyConnection(connection);
      this.connections.delete(connection.id);
      this.stats.destroyed++;
      
      this.emit('connection:destroyed', connection);
    } catch (error) {
      this.stats.errors++;
      this.emit('connection:error', error);
    }
  }
  
  // Ejecutar query con conexión del pool
  async executeQuery(query, params = []) {
    const connection = await this.acquire();
    
    try {
      // Simular ejecución de query
      const result = await this.executeMockQuery(connection, query, params);
      connection.queryCount++;
      
      return result;
    } finally {
      this.release(connection);
    }
  }
  
  // Ejecutar query mock
  async executeMockQuery(connection, query, params) {
    return new Promise((resolve) => {
      const executionTime = Math.random() * 100 + 10; // 10-110ms
      
      setTimeout(() => {
        resolve({
          connectionId: connection.id,
          query,
          params,
          executionTime: `${executionTime.toFixed(2)}ms`,
          rows: Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString()
        });
      }, executionTime);
    });
  }
  
  // Iniciar mantenimiento del pool
  startMaintenance() {
    this.maintenanceInterval = setInterval(() => {
      this.performMaintenance();
    }, this.options.reapInterval);
  }
  
  // Realizar mantenimiento
  performMaintenance() {
    const now = Date.now();
    
    // Limpiar conexiones inactivas
    for (const connection of this.available) {
      if (now - connection.lastUsed > this.options.idleTimeout) {
        this.destroyConnection(connection);
      }
    }
    
    // Verificar conexiones en uso
    for (const connection of this.inUse) {
      if (now - connection.lastUsed > this.options.acquireTimeout * 2) {
        console.warn(`⚠️  Conexión ${connection.id} ha estado en uso por mucho tiempo`);
      }
    }
    
    // Recrear conexiones si es necesario
    if (this.available.length < this.options.minConnections) {
      const needed = this.options.minConnections - this.available.length;
      for (let i = 0; i < needed; i++) {
        this.createConnection();
      }
    }
  }
  
  // Obtener estadísticas del pool
  getStats() {
    const avgWaitTime = this.stats.totalWaiters > 0 ? 
      this.stats.waitTime / this.stats.totalWaiters : 0;
    
    return {
      ...this.stats,
      totalConnections: this.connections.size,
      availableConnections: this.available.length,
      inUseConnections: this.inUse.size,
      waitingCount: this.waiting.length,
      utilization: `${((this.inUse.size / this.connections.size) * 100).toFixed(2)}%`,
      avgWaitTime: `${avgWaitTime.toFixed(2)}ms`,
      errorRate: `${((this.stats.errors / (this.stats.acquired + this.stats.errors)) * 100).toFixed(2)}%`
    };
  }
  
  // Obtener reporte detallado
  getDetailedReport() {
    const stats = this.getStats();
    const report = {
      timestamp: new Date().toISOString(),
      configuration: this.options,
      statistics: stats,
      connections: []
    };
    
    // Información de conexiones
    for (const [id, connection] of this.connections) {
      const age = Date.now() - connection.createdAt;
      const lastUsed = Date.now() - connection.lastUsed;
      
      report.connections.push({
        id: connection.id,
        age: `${(age / 1000).toFixed(1)}s`,
        lastUsed: `${(lastUsed / 1000).toFixed(1)}s ago`,
        queryCount: connection.queryCount,
        isHealthy: connection.isHealthy,
        status: this.inUse.has(connection) ? 'in-use' : 'available'
      });
    }
    
    return report;
  }
  
  // Detener pool
  async stop() {
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
      this.maintenanceInterval = null;
    }
    
    // Destruir todas las conexiones
    const destroyPromises = Array.from(this.connections.values()).map(conn => 
      this.destroyConnection(conn)
    );
    
    await Promise.all(destroyPromises);
    
    this.emit('stopped');
    console.log('🛑 Pool de conexiones detenido');
  }
}

// Query Optimizer
class QueryOptimizer {
  constructor() {
    this.queryCache = new Map();
    this.queryStats = new Map();
    this.slowQueryThreshold = 100; // 100ms
  }
  
  // Analizar query
  analyzeQuery(query, params = []) {
    const analysis = {
      query,
      params,
      timestamp: Date.now(),
      complexity: this.analyzeComplexity(query),
      recommendations: [],
      estimatedCost: 0
    };
    
    // Analizar complejidad
    if (analysis.complexity > 5) {
      analysis.recommendations.push('Query muy compleja - considerar simplificar');
    }
    
    // Buscar patrones problemáticos
    if (query.toLowerCase().includes('select *')) {
      analysis.recommendations.push('Evitar SELECT * - especificar columnas necesarias');
    }
    
    if (query.toLowerCase().includes('like %')) {
      analysis.recommendations.push('LIKE con comodín inicial puede ser lento - usar índices');
    }
    
    if (query.toLowerCase().includes('order by') && !query.toLowerCase().includes('limit')) {
      analysis.recommendations.push('ORDER BY sin LIMIT puede ser costoso');
    }
    
    // Calcular costo estimado
    analysis.estimatedCost = this.calculateEstimatedCost(query, params);
    
    return analysis;
  }
  
  // Analizar complejidad de query
  analyzeComplexity(query) {
    let complexity = 0;
    
    // Contar JOINs
    const joinMatches = query.match(/join/gi);
    if (joinMatches) complexity += joinMatches.length;
    
    // Contar subqueries
    const subqueryMatches = query.match(/\(/g);
    if (subqueryMatches) complexity += subqueryMatches.length;
    
    // Contar funciones agregadas
    const aggregateMatches = query.match(/(count|sum|avg|min|max|group by)/gi);
    if (aggregateMatches) complexity += aggregateMatches.length;
    
    // Contar condiciones OR
    const orMatches = query.match(/\bor\b/gi);
    if (orMatches) complexity += orMatches.length;
    
    return complexity;
  }
  
  // Calcular costo estimado
  calculateEstimatedCost(query, params) {
    let cost = 10; // Costo base
    
    // Penalizar queries complejas
    const complexity = this.analyzeComplexity(query);
    cost += complexity * 5;
    
    // Penalizar parámetros
    cost += params.length * 2;
    
    // Penalizar queries largas
    cost += query.length / 100;
    
    return Math.round(cost);
  }
  
  // Cache de queries
  cacheQuery(query, params, result) {
    const key = this.generateQueryKey(query, params);
    const cacheEntry = {
      query,
      params,
      result,
      timestamp: Date.now(),
      hitCount: 0
    };
    
    this.queryCache.set(key, cacheEntry);
  }
  
  // Obtener query del cache
  getCachedQuery(query, params) {
    const key = this.generateQueryKey(query, params);
    const cached = this.queryCache.get(key);
    
    if (cached) {
      cached.hitCount++;
      return cached.result;
    }
    
    return null;
  }
  
  // Generar clave para cache
  generateQueryKey(query, params) {
    return `${query}_${JSON.stringify(params)}`;
  }
  
  // Registrar estadísticas de query
  recordQueryStats(query, executionTime, success) {
    const key = this.generateQueryKey(query, []);
    
    if (!this.queryStats.has(key)) {
      this.queryStats.set(key, {
        query,
        executionCount: 0,
        totalTime: 0,
        avgTime: 0,
        minTime: Infinity,
        maxTime: 0,
        successCount: 0,
        errorCount: 0,
        slowQueryCount: 0
      });
    }
    
    const stats = this.queryStats.get(key);
    stats.executionCount++;
    stats.totalTime += executionTime;
    stats.avgTime = stats.totalTime / stats.executionCount;
    stats.minTime = Math.min(stats.minTime, executionTime);
    stats.maxTime = Math.max(stats.maxTime, executionTime);
    
    if (success) {
      stats.successCount++;
    } else {
      stats.errorCount++;
    }
    
    if (executionTime > this.slowQueryThreshold) {
      stats.slowQueryCount++;
    }
  }
  
  // Obtener queries lentas
  getSlowQueries() {
    const slowQueries = [];
    
    for (const [key, stats] of this.queryStats) {
      if (stats.avgTime > this.slowQueryThreshold) {
        slowQueries.push({
          query: stats.query,
          avgTime: stats.avgTime,
          executionCount: stats.executionCount,
          slowQueryCount: stats.slowQueryCount
        });
      }
    }
    
    return slowQueries.sort((a, b) => b.avgTime - a.avgTime);
  }
  
  // Obtener reporte de optimización
  getOptimizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      cacheStats: {
        size: this.queryCache.size,
        hitRate: this.calculateCacheHitRate()
      },
      queryStats: {
        total: this.queryStats.size,
        slowQueries: this.getSlowQueries().length
      },
      recommendations: this.generateRecommendations(),
      slowQueries: this.getSlowQueries().slice(0, 10) // Top 10
    };
    
    return report;
  }
  
  // Calcular tasa de hit del cache
  calculateCacheHitRate() {
    let totalHits = 0;
    let totalQueries = 0;
    
    for (const entry of this.queryCache.values()) {
      totalHits += entry.hitCount;
      totalQueries += entry.hitCount + 1; // +1 por la primera ejecución
    }
    
    return totalQueries > 0 ? (totalHits / totalQueries * 100).toFixed(2) : '0.00';
  }
  
  // Generar recomendaciones
  generateRecommendations() {
    const recommendations = [];
    const slowQueries = this.getSlowQueries();
    
    if (slowQueries.length > 0) {
      recommendations.push(`Optimizar ${slowQueries.length} queries lentas`);
    }
    
    const cacheHitRate = parseFloat(this.calculateCacheHitRate());
    if (cacheHitRate < 50) {
      recommendations.push('Mejorar tasa de hit del cache de queries');
    }
    
    if (this.queryCache.size > 1000) {
      recommendations.push('Considerar limpiar cache de queries antiguas');
    }
    
    return recommendations;
  }
}

// Ejemplo de uso
function demonstrateDatabaseOptimization() {
  console.log('🗄️  Demostrando optimización de base de datos...\n');
  
  // Crear pool de conexiones
  const connectionPool = new DatabaseConnectionPool({
    minConnections: 3,
    maxConnections: 10,
    acquireTimeout: 10000,
    idleTimeout: 30000
  });
  
  // Crear optimizador de queries
  const queryOptimizer = new QueryOptimizer();
  
  // Configurar listeners
  connectionPool.on('connection:acquired', (conn) => {
    console.log(`🔗 Conexión adquirida: ${conn.id}`);
  });
  
  connectionPool.on('connection:released', (conn) => {
    console.log(`🔓 Conexión liberada: ${conn.id}`);
  });
  
  connectionPool.on('connection:waiting', (count) => {
    console.log(`⏳ ${count} conexiones esperando...`);
  });
  
  // Simular queries concurrentes
  async function simulateConcurrentQueries() {
    const queries = [
      'SELECT * FROM users WHERE status = ?',
      'SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id WHERE u.active = ?',
      'SELECT COUNT(*) FROM orders WHERE created_at > ? GROUP BY user_id ORDER BY COUNT(*) DESC',
      'SELECT * FROM products WHERE category IN (?, ?, ?) AND price BETWEEN ? AND ?'
    ];
    
    const params = [
      ['active'],
      [true],
      ['2024-01-01'],
      ['electronics', 'clothing', 'books', 10, 100]
    ];
    
    console.log('🔥 Simulando queries concurrentes...\n');
    
    const promises = [];
    
    for (let i = 0; i < 15; i++) {
      const queryIndex = i % queries.length;
      const query = queries[queryIndex];
      const queryParams = params[queryIndex];
      
      // Analizar query
      const analysis = queryOptimizer.analyzeQuery(query, queryParams);
      
      // Verificar cache
      let result = queryOptimizer.getCachedQuery(query, queryParams);
      
      if (!result) {
        // Ejecutar query
        const startTime = Date.now();
        result = await connectionPool.executeQuery(query, queryParams);
        const executionTime = Date.now() - startTime;
        
        // Registrar estadísticas
        queryOptimizer.recordQueryStats(query, executionTime, true);
        
        // Cachear resultado
        queryOptimizer.cacheQuery(query, queryParams, result);
        
        console.log(`📊 Query ${i + 1}: ${executionTime}ms | ${analysis.recommendations.length} recomendaciones`);
      } else {
        console.log(`🎯 Query ${i + 1}: CACHE HIT | ${analysis.recommendations.length} recomendaciones`);
      }
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    }
    
    // Mostrar estadísticas
    setTimeout(() => {
      console.log('\n📈 Estadísticas del Pool:');
      console.log(connectionPool.getStats());
      
      console.log('\n📊 Reporte de Optimización:');
      console.log(queryOptimizer.getOptimizationReport());
      
      // Limpiar
      connectionPool.stop();
      
    }, 2000);
  }
  
  // Iniciar simulación cuando el pool esté listo
  connectionPool.on('initialized', () => {
    simulateConcurrentQueries();
  });
}
```

## 🌐 Escalabilidad y Load Balancing

### Clustering y Balanceo de Carga

```javascript
// scalability-clustering.js
const cluster = require('cluster');
const os = require('os');
const { EventEmitter } = require('events');

// Clase para clustering avanzado
class AdvancedClustering extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      workers: options.workers || os.cpus().length,
      restartDelay: options.restartDelay || 1000,
      maxRestarts: options.maxRestarts || 5,
      enableGracefulShutdown: options.enableGracefulShutdown !== false,
      healthCheckInterval: options.healthCheckInterval || 30000
    };
    
    this.workers = new Map();
    this.workerStats = new Map();
    this.restartCounts = new Map();
    this.isShuttingDown = false;
    
    if (cluster.isPrimary) {
      this.setupPrimary();
    } else {
      this.setupWorker();
    }
  }
  
  // Configurar proceso principal
  setupPrimary() {
    console.log(`🚀 Proceso principal iniciado (PID: ${process.pid})`);
    console.log(`👥 Creando ${this.options.workers} workers...`);
    
    // Crear workers
    for (let i = 0; i < this.options.workers; i++) {
      this.createWorker();
    }
    
    // Configurar listeners
    this.setupPrimaryListeners();
    
    // Iniciar monitoreo de salud
    this.startHealthMonitoring();
    
    // Configurar graceful shutdown
    if (this.options.enableGracefulShutdown) {
      this.setupGracefulShutdown();
    }
    
    this.emit('primary:ready');
  }
  
  // Crear worker
  createWorker() {
    const worker = cluster.fork();
    const workerId = worker.id;
    
    this.workers.set(workerId, worker);
    this.workerStats.set(workerId, {
      id: workerId,
      pid: worker.process.pid,
      createdAt: Date.now(),
      startTime: Date.now(),
      restarts: 0,
      messagesSent: 0,
      messagesReceived: 0,
      lastHeartbeat: Date.now(),
      isHealthy: true
    });
    
    this.restartCounts.set(workerId, 0);
    
    console.log(`👷 Worker ${workerId} creado (PID: ${worker.process.pid})`);
    
    return worker;
  }
  
  // Configurar listeners del proceso principal
  setupPrimaryListeners() {
    cluster.on('exit', (worker, code, signal) => {
      const workerId = worker.id;
      const stats = this.workerStats.get(workerId);
      
      if (stats) {
        stats.restarts++;
        console.log(`💀 Worker ${workerId} terminó (código: ${code}, señal: ${signal})`);
        
        // Verificar si debemos reiniciar
        if (!this.isShuttingDown && this.restartCounts.get(workerId) < this.options.maxRestarts) {
          this.restartWorker(workerId);
        } else {
          console.log(`⚠️  Worker ${workerId} excedió límite de reinicios`);
          this.workers.delete(workerId);
          this.workerStats.delete(workerId);
        }
      }
    });
    
    cluster.on('message', (worker, message) => {
      this.handleWorkerMessage(worker, message);
    });
    
    cluster.on('listening', (worker, address) => {
      console.log(`👂 Worker ${worker.id} escuchando en ${address.address}:${address.port}`);
    });
  }
  
  // Manejar mensajes de workers
  handleWorkerMessage(worker, message) {
    const workerId = worker.id;
    const stats = this.workerStats.get(workerId);
    
    if (stats) {
      stats.messagesReceived++;
      stats.lastHeartbeat = Date.now();
      
      switch (message.type) {
        case 'heartbeat':
          stats.isHealthy = true;
          break;
          
        case 'stats':
          Object.assign(stats, message.data);
          break;
          
        case 'error':
          console.error(`❌ Error en worker ${workerId}:`, message.error);
          stats.isHealthy = false;
          break;
          
        case 'ready':
          console.log(`✅ Worker ${workerId} listo`);
          break;
      }
    }
    
    this.emit('worker:message', worker, message);
  }
  
  // Reiniciar worker
  restartWorker(workerId) {
    const restartCount = this.restartCounts.get(workerId) + 1;
    this.restartCounts.set(workerId, restartCount);
    
    console.log(`🔄 Reiniciando worker ${workerId} (intento ${restartCount})`);
    
    setTimeout(() => {
      if (!this.isShuttingDown) {
        const newWorker = this.createWorker();
        console.log(`✅ Worker ${workerId} reiniciado como ${newWorker.id}`);
      }
    }, this.options.restartDelay);
  }
  
  // Iniciar monitoreo de salud
  startHealthMonitoring() {
    this.healthInterval = setInterval(() => {
      this.checkWorkersHealth();
    }, this.options.healthCheckInterval);
  }
  
  // Verificar salud de workers
  checkWorkersHealth() {
    const now = Date.now();
    const healthTimeout = this.options.healthCheckInterval * 2;
    
    for (const [workerId, stats] of this.workerStats) {
      const timeSinceHeartbeat = now - stats.lastHeartbeat;
      
      if (timeSinceHeartbeat > healthTimeout) {
        console.warn(`⚠️  Worker ${workerId} no responde (último heartbeat: ${timeSinceHeartbeat}ms atrás)`);
        stats.isHealthy = false;
      }
    }
  }
  
  // Configurar graceful shutdown
  setupGracefulShutdown() {
    const signals = ['SIGTERM', 'SIGINT'];
    
    signals.forEach(signal => {
      process.on(signal, () => {
        console.log(`\n🛑 Recibida señal ${signal}, iniciando shutdown graceful...`);
        this.gracefulShutdown();
      });
    });
  }
  
  // Shutdown graceful
  async gracefulShutdown() {
    this.isShuttingDown = true;
    
    console.log('🔄 Cerrando workers...');
    
    // Enviar señal de shutdown a todos los workers
    for (const [workerId, worker] of this.workers) {
      worker.send({ type: 'shutdown' });
    }
    
    // Esperar a que los workers se cierren
    const shutdownPromises = Array.from(this.workers.values()).map(worker => {
      return new Promise((resolve) => {
        worker.on('exit', resolve);
      });
    });
    
    await Promise.all(shutdownPromises);
    
    console.log('✅ Todos los workers cerrados');
    process.exit(0);
  }
  
  // Obtener estadísticas del cluster
  getClusterStats() {
    const stats = {
      primary: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      },
      workers: Array.from(this.workerStats.values()),
      totalWorkers: this.workers.size,
      healthyWorkers: Array.from(this.workerStats.values()).filter(w => w.isHealthy).length,
      restartCounts: Object.fromEntries(this.restartCounts)
    };
    
    return stats;
  }
  
  // Configurar worker
  setupWorker() {
    console.log(`👷 Worker iniciado (ID: ${cluster.worker.id}, PID: ${process.pid})`);
    
    // Configurar listeners del worker
    this.setupWorkerListeners();
    
    // Iniciar heartbeat
    this.startHeartbeat();
    
    // Simular trabajo del worker
    this.simulateWorker();
    
    // Notificar que está listo
    process.send({ type: 'ready' });
  }
  
  // Configurar listeners del worker
  setupWorkerListeners() {
    process.on('message', (message) => {
      this.handlePrimaryMessage(message);
    });
    
    process.on('exit', (code) => {
      console.log(`👷 Worker ${cluster.worker.id} terminando (código: ${code})`);
    });
  }
  
  // Manejar mensajes del proceso principal
  handlePrimaryMessage(message) {
    switch (message.type) {
      case 'shutdown':
        console.log(`🛑 Worker ${cluster.worker.id} recibió señal de shutdown`);
        process.exit(0);
        break;
        
      case 'ping':
        process.send({ type: 'pong', workerId: cluster.worker.id });
        break;
    }
  }
  
  // Iniciar heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      process.send({ type: 'heartbeat', workerId: cluster.worker.id });
    }, 10000); // Cada 10 segundos
  }
  
  // Simular trabajo del worker
  simulateWorker() {
    // Simular carga de trabajo
    setInterval(() => {
      const load = Math.random() * 100;
      
      process.send({
        type: 'stats',
        data: {
          load: load.toFixed(2),
          memory: process.memoryUsage(),
          uptime: process.uptime()
        }
      });
      
      // Simular errores ocasionales
      if (Math.random() < 0.01) { // 1% de probabilidad
        process.send({
          type: 'error',
          error: 'Error simulado del worker'
        });
      }
    }, 5000); // Cada 5 segundos
  }
}

// Load Balancer simple
class SimpleLoadBalancer extends EventEmitter {
  constructor(workers) {
    super();
    
    this.workers = workers;
    this.currentIndex = 0;
    this.workerStats = new Map();
    
    // Inicializar estadísticas
    for (const worker of workers) {
      this.workerStats.set(worker.id, {
        id: worker.id,
        requests: 0,
        lastRequest: null,
        isHealthy: true
      });
    }
    
    console.log(`⚖️  Load balancer iniciado con ${workers.length} workers`);
  }
  
  // Obtener siguiente worker (Round Robin)
  getNextWorker() {
    const availableWorkers = Array.from(this.workers).filter(worker => 
      this.workerStats.get(worker.id)?.isHealthy
    );
    
    if (availableWorkers.length === 0) {
      throw new Error('No hay workers disponibles');
    }
    
    const worker = availableWorkers[this.currentIndex % availableWorkers.length];
    this.currentIndex = (this.currentIndex + 1) % availableWorkers.length;
    
    // Actualizar estadísticas
    const stats = this.workerStats.get(worker.id);
    if (stats) {
      stats.requests++;
      stats.lastRequest = Date.now();
    }
    
    return worker;
  }
  
  // Obtener worker con menor carga
  getLeastLoadedWorker() {
    let minLoad = Infinity;
    let selectedWorker = null;
    
    for (const worker of this.workers) {
      const stats = this.workerStats.get(worker.id);
      if (stats && stats.isHealthy && stats.requests < minLoad) {
        minLoad = stats.requests;
        selectedWorker = worker;
      }
    }
    
    if (selectedWorker) {
      const stats = this.workerStats.get(selectedWorker.id);
      stats.requests++;
      stats.lastRequest = Date.now();
    }
    
    return selectedWorker;
  }
  
  // Marcar worker como no saludable
  markWorkerUnhealthy(workerId) {
    const stats = this.workerStats.get(workerId);
    if (stats) {
      stats.isHealthy = false;
      console.log(`⚠️  Worker ${workerId} marcado como no saludable`);
    }
  }
  
  // Marcar worker como saludable
  markWorkerHealthy(workerId) {
    const stats = this.workerStats.get(workerId);
    if (stats) {
      stats.isHealthy = true;
      console.log(`✅ Worker ${workerId} marcado como saludable`);
    }
  }
  
  // Obtener estadísticas del load balancer
  getStats() {
    const stats = {
      totalWorkers: this.workers.length,
      healthyWorkers: Array.from(this.workerStats.values()).filter(w => w.isHealthy).length,
      totalRequests: Array.from(this.workerStats.values()).reduce((sum, w) => sum + w.requests, 0),
      workerStats: Array.from(this.workerStats.values())
    };
    
    return stats;
  }
}

// Ejemplo de uso
function demonstrateScalability() {
  console.log('🌐 Demostrando escalabilidad y clustering...\n');
  
  // Crear cluster avanzado
  const cluster = new AdvancedClustering({
    workers: 4,
    restartDelay: 2000,
    maxRestarts: 3,
    enableGracefulShutdown: true
  });
  
  // Esperar a que el cluster esté listo
  cluster.on('primary:ready', () => {
    console.log('🎯 Cluster listo, iniciando load balancer...\n');
    
    // Crear load balancer
    const loadBalancer = new SimpleLoadBalancer(Array.from(cluster.workers.values()));
    
    // Simular requests
    let requestCount = 0;
    const requestInterval = setInterval(() => {
      try {
        const worker = loadBalancer.getNextWorker();
        requestCount++;
        
        console.log(`📨 Request ${requestCount} enviado a worker ${worker.id}`);
        
        // Simular respuesta del worker
        setTimeout(() => {
          console.log(`✅ Request ${requestCount} completado por worker ${worker.id}`);
        }, Math.random() * 1000 + 500);
        
        // Simular error ocasional
        if (Math.random() < 0.1) { // 10% de probabilidad
          setTimeout(() => {
            loadBalancer.markWorkerUnhealthy(worker.id);
            
            // Recuperar worker después de un tiempo
            setTimeout(() => {
              loadBalancer.markWorkerHealthy(worker.id);
            }, 3000);
          }, Math.random() * 2000);
        }
        
      } catch (error) {
        console.error('❌ Error en load balancer:', error.message);
      }
      
      // Detener después de 20 requests
      if (requestCount >= 20) {
        clearInterval(requestInterval);
        
        setTimeout(() => {
          console.log('\n📊 Estadísticas finales:');
          console.log('Cluster:', cluster.getClusterStats());
          console.log('Load Balancer:', loadBalancer.getStats());
          
          // Shutdown graceful
          console.log('\n🛑 Iniciando shutdown...');
          process.emit('SIGTERM');
          
        }, 2000);
      }
    }, 1000);
  });
}
```

## 📝 Puntos Clave - Performance (Parte 3)

### ✅ Conceptos Esenciales

1. **Connection Pooling**: Reutilización eficiente de conexiones de BD
2. **Query Optimization**: Análisis y optimización de consultas
3. **Clustering**: Múltiples procesos para escalabilidad
4. **Load Balancing**: Distribución inteligente de carga
5. **Graceful Shutdown**: Cierre ordenado de aplicaciones

### ⚠️ Errores Comunes

1. **No usar connection pooling** en aplicaciones de producción
2. **Ignorar queries lentas** sin optimizar
3. **No monitorear** la salud de workers
4. **Configurar demasiados workers** innecesariamente
5. **No implementar graceful shutdown**

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre clustering y load balancing?
2. ¿Cómo optimizas una query lenta en Node.js?
3. ¿Cuándo deberías usar connection pooling?
4. ¿Qué estrategias de load balancing conoces?
5. ¿Cómo manejas el graceful shutdown en aplicaciones Node.js?

---

**¡Continuemos con la sección final: Examen de Práctica!**
