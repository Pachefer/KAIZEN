# 🚀 Performance y Optimización - Parte 2 (JSNAD)

## 💾 Caching y Gestión de Memoria

### Sistema de Caching Inteligente

```javascript
// intelligent-cache.js
const { EventEmitter } = require('events');

// Clase para caching inteligente con múltiples estrategias
class IntelligentCache extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      maxSize: options.maxSize || 1000, // Máximo número de items
      maxAge: options.maxAge || 5 * 60 * 1000, // 5 minutos
      cleanupInterval: options.cleanupInterval || 60 * 1000, // 1 minuto
      strategy: options.strategy || 'LRU', // LRU, LFU, FIFO
      enableStats: options.enableStats !== false
    };
    
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
    
    this.accessOrder = []; // Para LRU
    this.accessCount = new Map(); // Para LFU
    
    // Iniciar limpieza automática
    this.startCleanup();
    
    console.log(`🚀 Cache inteligente iniciado con estrategia: ${this.options.strategy}`);
  }
  
  // Obtener valor del cache
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.emit('miss', key);
      return null;
    }
    
    // Verificar expiración
    if (this.isExpired(item)) {
      this.delete(key);
      this.stats.misses++;
      this.emit('miss', key);
      return null;
    }
    
    // Actualizar acceso
    this.updateAccess(key);
    this.stats.hits++;
    this.emit('hit', key, item.value);
    
    return item.value;
  }
  
  // Establecer valor en cache
  set(key, value, options = {}) {
    const item = {
      value,
      timestamp: Date.now(),
      expiresAt: options.expiresAt || (Date.now() + this.options.maxAge),
      accessCount: 0,
      lastAccess: Date.now()
    };
    
    // Verificar si ya existe
    const existing = this.cache.get(key);
    if (existing) {
      this.delete(key);
    }
    
    // Verificar límite de tamaño
    if (this.cache.size >= this.options.maxSize) {
      this.evict();
    }
    
    this.cache.set(key, item);
    this.updateAccess(key);
    this.stats.sets++;
    
    this.emit('set', key, value);
    
    return true;
  }
  
  // Eliminar item del cache
  delete(key) {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.accessCount.delete(key);
      this.stats.deletes++;
      this.emit('delete', key);
      return true;
    }
    return false;
  }
  
  // Verificar si existe
  has(key) {
    const item = this.cache.get(key);
    if (!item || this.isExpired(item)) {
      return false;
    }
    return true;
  }
  
  // Obtener estadísticas
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 ? 
      (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
      maxSize: this.options.maxSize,
      utilization: `${((this.cache.size / this.options.maxSize) * 100).toFixed(2)}%`
    };
  }
  
  // Limpiar cache
  clear() {
    this.cache.clear();
    this.accessOrder.length = 0;
    this.accessCount.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0
    };
    
    this.emit('clear');
    console.log('🧹 Cache limpiado');
  }
  
  // Obtener keys
  keys() {
    return Array.from(this.cache.keys());
  }
  
  // Obtener valores
  values() {
    return Array.from(this.cache.values()).map(item => item.value);
  }
  
  // Obtener entries
  entries() {
    return Array.from(this.cache.entries()).map(([key, item]) => [key, item.value]);
  }
  
  // Verificar expiración
  isExpired(item) {
    return Date.now() > item.expiresAt;
  }
  
  // Actualizar acceso según estrategia
  updateAccess(key) {
    const item = this.cache.get(key);
    if (!item) return;
    
    item.accessCount++;
    item.lastAccess = Date.now();
    
    switch (this.options.strategy) {
      case 'LRU':
        this.updateLRU(key);
        break;
      case 'LFU':
        this.updateLFU(key);
        break;
      case 'FIFO':
        // No hacer nada para FIFO
        break;
    }
  }
  
  // Actualizar LRU
  updateLRU(key) {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }
  
  // Actualizar LFU
  updateLFU(key) {
    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
  }
  
  // Remover de orden de acceso
  removeFromAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }
  
  // Evicción según estrategia
  evict() {
    let keyToEvict = null;
    
    switch (this.options.strategy) {
      case 'LRU':
        keyToEvict = this.accessOrder[0];
        break;
      case 'LFU':
        keyToEvict = this.getLeastFrequentlyUsed();
        break;
      case 'FIFO':
        keyToEvict = this.cache.keys().next().value;
        break;
    }
    
    if (keyToEvict) {
      this.delete(keyToEvict);
      this.stats.evictions++;
      this.emit('eviction', keyToEvict);
    }
  }
  
  // Obtener menos frecuentemente usado (LFU)
  getLeastFrequentlyUsed() {
    let minCount = Infinity;
    let minKey = null;
    
    for (const [key, count] of this.accessCount) {
      if (count < minCount) {
        minCount = count;
        minKey = key;
      }
    }
    
    return minKey;
  }
  
  // Iniciar limpieza automática
  startCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }
  
  // Limpiar items expirados
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Limpieza automática: ${cleaned} items expirados removidos`);
      this.emit('cleanup', cleaned);
    }
  }
  
  // Detener limpieza
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  
  // Obtener reporte detallado
  getDetailedReport() {
    const stats = this.getStats();
    const report = {
      timestamp: new Date().toISOString(),
      configuration: this.options,
      statistics: stats,
      items: []
    };
    
    // Analizar items del cache
    for (const [key, item] of this.cache.entries()) {
      const age = Date.now() - item.timestamp;
      const timeToExpiry = item.expiresAt - Date.now();
      
      report.items.push({
        key,
        age: `${(age / 1000).toFixed(1)}s`,
        timeToExpiry: `${(timeToExpiry / 1000).toFixed(1)}s`,
        accessCount: item.accessCount,
        lastAccess: new Date(item.lastAccess).toISOString(),
        isExpired: this.isExpired(item)
      });
    }
    
    return report;
  }
}

// Cache con TTL (Time To Live) automático
class TTLCache extends IntelligentCache {
  constructor(options = {}) {
    super(options);
    this.ttl = options.ttl || 60 * 1000; // 1 minuto por defecto
  }
  
  set(key, value, ttl = this.ttl) {
    const expiresAt = Date.now() + ttl;
    return super.set(key, value, { expiresAt });
  }
  
  // Obtener con renovación de TTL
  get(key, renewTTL = false) {
    const item = this.cache.get(key);
    if (item && renewTTL) {
      item.expiresAt = Date.now() + this.ttl;
    }
    return super.get(key);
  }
}

// Cache con persistencia
class PersistentCache extends IntelligentCache {
  constructor(options = {}) {
    super(options);
    this.storageFile = options.storageFile || 'cache-storage.json';
    this.autoSave = options.autoSave !== false;
    
    // Cargar cache guardado
    this.loadFromStorage();
    
    // Configurar auto-guardado
    if (this.autoSave) {
      this.setupAutoSave();
    }
  }
  
  // Guardar en almacenamiento
  saveToStorage() {
    try {
      const data = {
        timestamp: Date.now(),
        cache: Array.from(this.cache.entries()),
        stats: this.stats
      };
      
      require('fs').writeFileSync(this.storageFile, JSON.stringify(data, null, 2));
      this.emit('saved', this.storageFile);
    } catch (error) {
      console.error('Error guardando cache:', error.message);
      this.emit('saveError', error);
    }
  }
  
  // Cargar desde almacenamiento
  loadFromStorage() {
    try {
      if (require('fs').existsSync(this.storageFile)) {
        const data = JSON.parse(require('fs').readFileSync(this.storageFile, 'utf8'));
        
        // Restaurar cache
        this.cache = new Map(data.cache);
        
        // Restaurar estadísticas
        this.stats = data.stats;
        
        // Reconstruir estructuras de acceso
        this.rebuildAccessStructures();
        
        console.log(`📁 Cache restaurado desde ${this.storageFile}`);
        this.emit('loaded', this.storageFile);
      }
    } catch (error) {
      console.error('Error cargando cache:', error.message);
      this.emit('loadError', error);
    }
  }
  
  // Reconstruir estructuras de acceso
  rebuildAccessStructures() {
    this.accessOrder = [];
    this.accessCount = new Map();
    
    for (const [key, item] of this.cache.entries()) {
      if (this.options.strategy === 'LRU') {
        this.accessOrder.push(key);
      }
      this.accessCount.set(key, item.accessCount);
    }
  }
  
  // Configurar auto-guardado
  setupAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.saveToStorage();
    }, 5 * 60 * 1000); // Cada 5 minutos
  }
  
  // Detener auto-guardado
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
  
  // Limpiar y guardar
  clear() {
    super.clear();
    this.saveToStorage();
  }
  
  // Destructor
  destroy() {
    this.stopCleanup();
    this.stopAutoSave();
    this.saveToStorage();
  }
}

// Ejemplo de uso
function demonstrateCaching() {
  console.log('🚀 Demostrando sistemas de caching...\n');
  
  // Cache LRU básico
  const lruCache = new IntelligentCache({
    maxSize: 5,
    maxAge: 10 * 1000, // 10 segundos
    strategy: 'LRU'
  });
  
  // Cache con TTL
  const ttlCache = new TTLCache({
    maxSize: 10,
    ttl: 5 * 1000 // 5 segundos
  });
  
  // Cache persistente
  const persistentCache = new PersistentCache({
    maxSize: 20,
    strategy: 'LFU',
    storageFile: 'demo-cache.json'
  });
  
  // Configurar listeners
  lruCache.on('hit', (key, value) => console.log(`🎯 LRU Cache HIT: ${key}`));
  lruCache.on('miss', (key) => console.log(`❌ LRU Cache MISS: ${key}`));
  lruCache.on('eviction', (key) => console.log(`🗑️  LRU Cache EVICTION: ${key}`));
  
  ttlCache.on('hit', (key, value) => console.log(`🎯 TTL Cache HIT: ${key}`));
  ttlCache.on('miss', (key) => console.log(`❌ TTL Cache MISS: ${key}`));
  
  // Demostrar LRU
  console.log('🔄 Demostrando LRU Cache:');
  for (let i = 1; i <= 7; i++) {
    lruCache.set(`key${i}`, `value${i}`);
    console.log(`✅ Agregado: key${i}`);
  }
  
  // Acceder a key1 para hacerla más reciente
  lruCache.get('key1');
  
  // Agregar otro item para forzar evicción
  lruCache.set('key8', 'value8');
  
  console.log('\n📊 Estado del LRU Cache:');
  console.log('Keys:', lruCache.keys());
  console.log('Stats:', lruCache.getStats());
  
  // Demostrar TTL
  console.log('\n⏰ Demostrando TTL Cache:');
  ttlCache.set('temp1', 'data1', 2000); // 2 segundos
  ttlCache.set('temp2', 'data2', 4000); // 4 segundos
  
  console.log('✅ Items agregados con TTL');
  
  // Verificar después de 3 segundos
  setTimeout(() => {
    console.log('\n🔍 Verificando TTL después de 3 segundos:');
    console.log('temp1 existe:', ttlCache.has('temp1'));
    console.log('temp2 existe:', ttlCache.has('temp2'));
    
    // Verificar después de 5 segundos
    setTimeout(() => {
      console.log('\n🔍 Verificando TTL después de 5 segundos:');
      console.log('temp1 existe:', ttlCache.has('temp1'));
      console.log('temp2 existe:', ttlCache.has('temp2'));
      
      // Mostrar estadísticas finales
      console.log('\n📊 Estadísticas finales:');
      console.log('LRU Cache:', lruCache.getStats());
      console.log('TTL Cache:', ttlCache.getStats());
      
      // Limpiar
      lruCache.clear();
      ttlCache.clear();
      persistentCache.destroy();
      
    }, 2000);
  }, 3000);
}
```

## 🧠 Gestión Avanzada de Memoria

### Pool de Objetos y Memoria

```javascript
// memory-pool.js
const { performance } = require('perf_hooks');

// Clase para pool de objetos
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.initialSize = initialSize;
    this.maxSize = maxSize;
    
    this.available = [];
    this.inUse = new Set();
    this.stats = {
      created: 0,
      acquired: 0,
      released: 0,
      peakUsage: 0
    };
    
    // Pre-llenar pool
    this.preallocate();
  }
  
  // Pre-llenar pool
  preallocate() {
    for (let i = 0; i < this.initialSize; i++) {
      const obj = this.createFn();
      this.available.push(obj);
      this.stats.created++;
    }
  }
  
  // Obtener objeto del pool
  acquire() {
    let obj;
    
    if (this.available.length > 0) {
      obj = this.available.pop();
    } else if (this.inUse.size < this.maxSize) {
      obj = this.createFn();
      this.stats.created++;
    } else {
      throw new Error('Pool agotado - máximo de objetos alcanzado');
    }
    
    this.inUse.add(obj);
    this.stats.acquired++;
    this.stats.peakUsage = Math.max(this.stats.peakUsage, this.inUse.size);
    
    return obj;
  }
  
  // Liberar objeto al pool
  release(obj) {
    if (!this.inUse.has(obj)) {
      throw new Error('Objeto no está en uso');
    }
    
    this.inUse.delete(obj);
    this.resetFn(obj);
    
    if (this.available.length < this.maxSize) {
      this.available.push(obj);
    }
    
    this.stats.released++;
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      ...this.stats,
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
      utilization: `${((this.inUse.size / (this.available.length + this.inUse.size)) * 100).toFixed(2)}%`
    };
  }
  
  // Limpiar pool
  clear() {
    this.available.length = 0;
    this.inUse.clear();
    this.stats = {
      created: 0,
      acquired: 0,
      released: 0,
      peakUsage: 0
    };
  }
}

// Pool de buffers
class BufferPool {
  constructor(bufferSize, initialCount = 10, maxCount = 100) {
    this.bufferSize = bufferSize;
    this.initialCount = initialCount;
    this.maxCount = maxCount;
    
    this.available = [];
    this.inUse = new Set();
    this.stats = {
      created: 0,
      acquired: 0,
      released: 0,
      totalMemory: 0
    };
    
    this.preallocate();
  }
  
  preallocate() {
    for (let i = 0; i < this.initialCount; i++) {
      const buffer = Buffer.allocUnsafe(this.bufferSize);
      this.available.push(buffer);
      this.stats.created++;
      this.stats.totalMemory += this.bufferSize;
    }
  }
  
  acquire() {
    let buffer;
    
    if (this.available.length > 0) {
      buffer = this.available.pop();
    } else if (this.inUse.size < this.maxCount) {
      buffer = Buffer.allocUnsafe(this.bufferSize);
      this.stats.created++;
      this.stats.totalMemory += this.bufferSize;
    } else {
      throw new Error('Buffer pool agotado');
    }
    
    this.inUse.add(buffer);
    this.stats.acquired++;
    
    return buffer;
  }
  
  release(buffer) {
    if (!this.inUse.has(buffer)) {
      throw new Error('Buffer no está en uso');
    }
    
    this.inUse.delete(buffer);
    buffer.fill(0); // Limpiar contenido
    
    if (this.available.length < this.maxCount) {
      this.available.push(buffer);
    }
    
    this.stats.released++;
  }
  
  getStats() {
    return {
      ...this.stats,
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
      memoryUsage: `${(this.stats.totalMemory / (1024 * 1024)).toFixed(2)}MB`
    };
  }
}

// Gestor de memoria con pools
class MemoryManager {
  constructor() {
    this.pools = new Map();
    this.memoryUsage = [];
    this.maxMemoryUsage = 0;
    
    // Monitorear uso de memoria
    this.startMemoryMonitoring();
  }
  
  // Crear pool de objetos
  createObjectPool(name, createFn, resetFn, options = {}) {
    const pool = new ObjectPool(createFn, resetFn, options.initialSize, options.maxSize);
    this.pools.set(name, pool);
    
    console.log(`🏊 Pool de objetos '${name}' creado`);
    return pool;
  }
  
  // Crear pool de buffers
  createBufferPool(name, bufferSize, options = {}) {
    const pool = new BufferPool(bufferSize, options.initialCount, options.maxCount);
    this.pools.set(name, pool);
    
    console.log(`🏊 Pool de buffers '${name}' creado (${bufferSize} bytes)`);
    return pool;
  }
  
  // Obtener pool
  getPool(name) {
    return this.pools.get(name);
  }
  
  // Obtener estadísticas de todos los pools
  getAllPoolStats() {
    const stats = {};
    
    for (const [name, pool] of this.pools) {
      stats[name] = pool.getStats();
    }
    
    return stats;
  }
  
  // Monitorear uso de memoria
  startMemoryMonitoring() {
    this.monitorInterval = setInterval(() => {
      const usage = process.memoryUsage();
      this.memoryUsage.push({
        timestamp: Date.now(),
        ...usage
      });
      
      // Mantener solo últimos 100 puntos
      if (this.memoryUsage.length > 100) {
        this.memoryUsage.shift();
      }
      
      // Actualizar máximo
      const currentUsage = usage.heapUsed + usage.external;
      this.maxMemoryUsage = Math.max(this.maxMemoryUsage, currentUsage);
      
      // Verificar umbrales
      this.checkMemoryThresholds(usage);
      
    }, 1000); // Cada segundo
  }
  
  // Verificar umbrales de memoria
  checkMemoryThresholds(usage) {
    const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;
    const externalUsageMB = usage.external / (1024 * 1024);
    
    if (heapUsagePercent > 80) {
      console.warn(`⚠️  Uso de heap alto: ${heapUsagePercent.toFixed(1)}%`);
    }
    
    if (externalUsageMB > 100) {
      console.warn(`⚠️  Memoria externa alta: ${externalUsageMB.toFixed(1)}MB`);
    }
  }
  
  // Obtener reporte de memoria
  getMemoryReport() {
    const currentUsage = process.memoryUsage();
    const stats = this.getAllPoolStats();
    
    return {
      timestamp: new Date().toISOString(),
      currentMemory: {
        rss: `${(currentUsage.rss / (1024 * 1024)).toFixed(2)}MB`,
        heapUsed: `${(currentUsage.heapUsed / (1024 * 1024)).toFixed(2)}MB`,
        heapTotal: `${(currentUsage.heapTotal / (1024 * 1024)).toFixed(2)}MB`,
        external: `${(currentUsage.external / (1024 * 1024)).toFixed(2)}MB`
      },
      maxMemoryUsage: `${(this.maxMemoryUsage / (1024 * 1024)).toFixed(2)}MB`,
      pools: stats,
      totalPools: this.pools.size
    };
  }
  
  // Limpiar todos los pools
  clearAllPools() {
    for (const [name, pool] of this.pools) {
      pool.clear();
    }
    
    console.log('🧹 Todos los pools limpiados');
  }
  
  // Detener monitoreo
  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }
}

// Ejemplo de uso
function demonstrateMemoryManagement() {
  console.log('🧠 Demostrando gestión avanzada de memoria...\n');
  
  const memoryManager = new MemoryManager();
  
  // Pool de usuarios
  const userPool = memoryManager.createObjectPool('users', 
    () => ({ id: 0, name: '', email: '', lastLogin: null }),
    (user) => {
      user.id = 0;
      user.name = '';
      user.email = '';
      user.lastLogin = null;
    },
    { initialSize: 5, maxSize: 20 }
  );
  
  // Pool de buffers para procesamiento de datos
  const dataBufferPool = memoryManager.createBufferPool('dataBuffers', 1024, {
    initialCount: 10,
    maxCount: 50
  });
  
  // Simular uso intensivo
  console.log('🔥 Simulando uso intensivo de pools...');
  
  const users = [];
  const buffers = [];
  
  // Usar pools
  for (let i = 0; i < 15; i++) {
    const user = userPool.acquire();
    user.id = i + 1;
    user.name = `User ${i + 1}`;
    user.email = `user${i + 1}@example.com`;
    users.push(user);
    
    const buffer = dataBufferPool.acquire();
    buffer.write(`Data for user ${i + 1}`);
    buffers.push(buffer);
  }
  
  console.log('\n📊 Estado de los pools:');
  console.log('User Pool:', userPool.getStats());
  console.log('Buffer Pool:', dataBufferPool.getStats());
  
  // Liberar algunos objetos
  console.log('\n🔄 Liberando algunos objetos...');
  
  for (let i = 0; i < 5; i++) {
    userPool.release(users[i]);
    dataBufferPool.release(buffers[i]);
  }
  
  console.log('\n📊 Estado después de liberar:');
  console.log('User Pool:', userPool.getStats());
  console.log('Buffer Pool:', dataBufferPool.getStats());
  
  // Mostrar reporte completo
  setTimeout(() => {
    console.log('\n📈 Reporte completo de memoria:');
    const report = memoryManager.getMemoryReport();
    console.log(JSON.stringify(report, null, 2));
    
    // Limpiar
    memoryManager.clearAllPools();
    memoryManager.stop();
    
  }, 2000);
}
```

## 📝 Puntos Clave - Performance (Parte 2)

### ✅ Conceptos Esenciales

1. **Caching Inteligente**: Estrategias LRU, LFU, FIFO con TTL
2. **Pools de Objetos**: Reutilización eficiente de memoria
3. **Gestión de Memoria**: Monitoreo y optimización automática
4. **Persistencia**: Cache que sobrevive a reinicios
5. **Estadísticas**: Métricas detalladas de performance

### ⚠️ Errores Comunes

1. **No configurar TTL** en caches
2. **Ignorar memory leaks** en pools
3. **No monitorear** uso de memoria
4. **Configurar pools muy grandes** innecesariamente
5. **No limpiar** objetos antes de liberarlos

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre LRU y LFU?
2. ¿Cuándo deberías usar un pool de objetos?
3. ¿Cómo evitas memory leaks en caches?
4. ¿Qué estrategia de cache es mejor para datos frecuentemente accedidos?
5. ¿Cómo optimizas el uso de memoria en aplicaciones Node.js?

---

**¡Continuemos con la tercera parte: Optimización de Base de Datos y Escalabilidad!**
