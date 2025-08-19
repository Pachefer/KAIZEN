# 🚀 Performance y Optimización - JSNAD

## 🎯 Introducción a Performance

La **Performance** es crucial en aplicaciones Node.js, especialmente en entornos de producción donde la eficiencia determina la experiencia del usuario y los costos operativos. Esta sección cubre técnicas avanzadas de optimización, profiling y monitoreo que son evaluadas en el examen JSNAD.

### ¿Por qué es Importante?

- **Experiencia del Usuario**: Respuesta rápida y fluida
- **Escalabilidad**: Manejo eficiente de carga alta
- **Costos**: Menor uso de recursos = menor costo
- **Competitividad**: Mejor performance = mejor ranking
- **Mantenibilidad**: Código optimizado es más fácil de mantener

## 📊 Profiling y Monitoreo de Performance

### Herramientas de Profiling

```javascript
// performance-profiler.js
const { performance, PerformanceObserver } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

// Clase para profiling de performance
class PerformanceProfiler {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
    this.observers = [];
    this.stats = {
      totalCalls: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0,
      avgTime: 0
    };
  }
  
  // Marcar inicio de operación
  mark(name) {
    performance.mark(name);
    this.marks.set(name, Date.now());
  }
  
  // Marcar fin de operación
  endMark(name) {
    if (this.marks.has(name)) {
      const startTime = this.marks.get(name);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Actualizar estadísticas
      this.stats.totalCalls++;
      this.stats.totalTime += duration;
      this.stats.minTime = Math.min(this.stats.minTime, duration);
      this.stats.maxTime = Math.max(this.stats.maxTime, duration);
      this.stats.avgTime = this.stats.totalTime / this.stats.totalCalls;
      
      // Limpiar mark
      this.marks.delete(name);
      
      return duration;
    }
    return 0;
  }
  
  // Medir tiempo entre dos marks
  measure(name, startMark, endMark) {
    try {
      const measure = performance.measure(name, startMark, endMark);
      this.measures.set(name, measure);
      return measure.duration;
    } catch (error) {
      console.error(`Error al medir ${name}:`, error.message);
      return 0;
    }
  }
  
  // Profiler de funciones con decorador
  profileFunction(fn, functionName) {
    return async (...args) => {
      const startMark = `${functionName}-start`;
      const endMark = `${functionName}-end`;
      
      this.mark(startMark);
      
      try {
        const result = await fn(...args);
        this.mark(endMark);
        const duration = this.measure(functionName, startMark, endMark);
        
        console.log(`⏱️  ${functionName} ejecutado en ${duration.toFixed(2)}ms`);
        
        return result;
      } catch (error) {
        this.mark(endMark);
        const duration = this.measure(functionName, startMark, endMark);
        
        console.error(`❌ ${functionName} falló en ${duration.toFixed(2)}ms:`, error.message);
        throw error;
      }
    };
  }
  
  // Profiler de métodos de clase
  profileClassMethods(className, methods) {
    const profiledClass = {};
    
    for (const methodName of methods) {
      if (typeof this[methodName] === 'function') {
        profiledClass[methodName] = this.profileFunction(
          this[methodName].bind(this),
          `${className}.${methodName}`
        );
      }
    }
    
    return profiledClass;
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      ...this.stats,
      measures: Array.from(this.measures.values()).map(measure => ({
        name: measure.name,
        duration: measure.duration,
        startTime: measure.startTime,
        endTime: measure.endTime
      }))
    };
  }
  
  // Exportar reporte
  exportReport(filename = 'performance-report.json') {
    const report = {
      timestamp: new Date().toISOString(),
      stats: this.getStats(),
      summary: {
        totalOperations: this.stats.totalCalls,
        averageResponseTime: `${this.stats.avgTime.toFixed(2)}ms`,
        fastestOperation: `${this.stats.minTime}ms`,
        slowestOperation: `${this.stats.maxTime}ms`,
        totalExecutionTime: `${this.stats.totalTime}ms`
      }
    };
    
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`📊 Reporte de performance exportado a ${filename}`);
    
    return report;
  }
  
  // Limpiar datos
  clear() {
    this.marks.clear();
    this.measures.clear();
    this.stats = {
      totalCalls: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0,
      avgTime: 0
    };
    
    // Limpiar marks de performance API
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Profiler de memoria
class MemoryProfiler {
  constructor() {
    this.snapshots = [];
    this.observers = [];
  }
  
  // Tomar snapshot de memoria
  takeSnapshot(label = '') {
    const snapshot = {
      label,
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };
    
    this.snapshots.push(snapshot);
    
    console.log(`💾 Snapshot de memoria [${label}]:`, {
      rss: `${(snapshot.memory.rss / 1024 / 1024).toFixed(2)}MB`,
      heapUsed: `${(snapshot.memory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(snapshot.memory.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      external: `${(snapshot.memory.external / 1024 / 1024).toFixed(2)}MB`
    });
    
    return snapshot;
  }
  
  // Comparar snapshots
  compareSnapshots(snapshot1Index, snapshot2Index) {
    if (snapshot1Index >= this.snapshots.length || snapshot2Index >= this.snapshots.length) {
      throw new Error('Índice de snapshot inválido');
    }
    
    const snap1 = this.snapshots[snapshot1Index];
    const snap2 = this.snapshots[snapshot2Index];
    
    const comparison = {
      rss: {
        before: snap1.memory.rss,
        after: snap2.memory.rss,
        difference: snap2.memory.rss - snap1.memory.rss,
        percentage: ((snap2.memory.rss - snap1.memory.rss) / snap1.memory.rss * 100).toFixed(2)
      },
      heapUsed: {
        before: snap1.memory.heapUsed,
        after: snap2.memory.heapUsed,
        difference: snap2.memory.heapUsed - snap1.memory.heapUsed,
        percentage: ((snap2.memory.heapUsed - snap1.memory.heapUsed) / snap1.memory.heapUsed * 100).toFixed(2)
      },
      heapTotal: {
        before: snap1.memory.heapTotal,
        after: snap2.memory.heapTotal,
        difference: snap2.memory.heapTotal - snap1.memory.heapTotal,
        percentage: ((snap2.memory.heapTotal - snap1.memory.heapTotal) / snap1.memory.heapTotal * 100).toFixed(2)
      }
    };
    
    console.log(`📊 Comparación de memoria [${snap1.label}] vs [${snap2.label}]:`, comparison);
    
    return comparison;
  }
  
  // Detectar memory leaks
  detectMemoryLeaks() {
    if (this.snapshots.length < 3) {
      console.log('⚠️  Se necesitan al menos 3 snapshots para detectar memory leaks');
      return null;
    }
    
    const recentSnapshots = this.snapshots.slice(-3);
    const memoryGrowth = [];
    
    for (let i = 1; i < recentSnapshots.length; i++) {
      const growth = recentSnapshots[i].memory.heapUsed - recentSnapshots[i-1].memory.heapUsed;
      memoryGrowth.push(growth);
    }
    
    const avgGrowth = memoryGrowth.reduce((sum, growth) => sum + growth, 0) / memoryGrowth.length;
    const isLeaking = avgGrowth > 1024 * 1024; // 1MB de crecimiento promedio
    
    const analysis = {
      isLeaking,
      averageGrowth: `${(avgGrowth / 1024 / 1024).toFixed(2)}MB`,
      growthPattern: memoryGrowth.map(g => `${(g / 1024 / 1024).toFixed(2)}MB`),
      recommendation: isLeaking ? 
        '🚨 Posible memory leak detectado. Revisar gestión de memoria.' :
        '✅ No se detectaron memory leaks significativos.'
    };
    
    console.log('🔍 Análisis de Memory Leaks:', analysis);
    
    return analysis;
  }
  
  // Limpiar snapshots
  clear() {
    this.snapshots = [];
  }
}

// Ejemplo de uso
function demonstrateProfiling() {
  const profiler = new PerformanceProfiler();
  const memoryProfiler = new MemoryProfiler();
  
  // Tomar snapshot inicial
  memoryProfiler.takeSnapshot('Inicio');
  
  // Profilar función síncrona
  const syncFunction = profiler.profileFunction(
    () => {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      return sum;
    },
    'sumaLarga'
  );
  
  // Profilar función asíncrona
  const asyncFunction = profiler.profileFunction(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'completado';
    },
    'operacionAsincrona'
  );
  
  // Ejecutar funciones
  console.log('Resultado síncrono:', syncFunction());
  asyncFunction().then(result => console.log('Resultado asíncrono:', result));
  
  // Tomar snapshot después de operaciones
  setTimeout(() => {
    memoryProfiler.takeSnapshot('Después de operaciones');
    
    // Comparar snapshots
    memoryProfiler.compareSnapshots(0, 1);
    
    // Detectar memory leaks
    memoryProfiler.detectMemoryLeaks();
    
    // Obtener estadísticas de performance
    const stats = profiler.getStats();
    console.log('📈 Estadísticas de performance:', stats);
    
    // Exportar reporte
    profiler.exportReport('performance-demo.json');
  }, 200);
}
```

### Monitoreo en Tiempo Real

```javascript
// real-time-monitor.js
const os = require('os');
const { EventEmitter } = require('events');

// Clase para monitoreo en tiempo real
class RealTimeMonitor extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      interval: options.interval || 1000, // 1 segundo
      maxHistory: options.maxHistory || 100, // 100 puntos de datos
      thresholds: {
        cpu: options.cpuThreshold || 80, // 80%
        memory: options.memoryThreshold || 85, // 85%
        eventLoop: options.eventLoopThreshold || 100 // 100ms
      }
    };
    
    this.history = {
      cpu: [],
      memory: [],
      eventLoop: [],
      timestamp: []
    };
    
    this.isMonitoring = false;
    this.monitorInterval = null;
    this.eventLoopStart = Date.now();
    
    // Configurar listeners
    this.setupEventLoopMonitoring();
  }
  
  // Iniciar monitoreo
  start() {
    if (this.isMonitoring) {
      console.log('⚠️  El monitoreo ya está activo');
      return;
    }
    
    this.isMonitoring = true;
    this.monitorInterval = setInterval(() => {
      this.collectMetrics();
    }, this.options.interval);
    
    console.log('🚀 Monitoreo en tiempo real iniciado');
    this.emit('monitoring:started');
  }
  
  // Detener monitoreo
  stop() {
    if (!this.isMonitoring) {
      console.log('⚠️  El monitoreo no está activo');
      return;
    }
    
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    console.log('⏹️  Monitoreo en tiempo real detenido');
    this.emit('monitoring:stopped');
  }
  
  // Recolectar métricas
  collectMetrics() {
    const timestamp = Date.now();
    
    // CPU Usage
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    
    // Memory Usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;
    
    // Event Loop Lag
    const eventLoopLag = Date.now() - this.eventLoopStart;
    
    // Almacenar métricas
    this.addToHistory('cpu', cpuUsage);
    this.addToHistory('memory', memoryUsage);
    this.addToHistory('eventLoop', eventLoopLag);
    this.addToHistory('timestamp', timestamp);
    
    // Verificar umbrales
    this.checkThresholds(cpuUsage, memoryUsage, eventLoopLag);
    
    // Emitir evento con métricas
    this.emit('metrics:collected', {
      timestamp,
      cpu: cpuUsage,
      memory: memoryUsage,
      eventLoop: eventLoopLag,
      totalMemory: totalMemory,
      freeMemory: freeMemory,
      usedMemory: usedMemory
    });
    
    // Resetear event loop timer
    this.eventLoopStart = Date.now();
  }
  
  // Agregar a historial
  addToHistory(metric, value) {
    this.history[metric].push(value);
    
    // Mantener solo el máximo de historial
    if (this.history[metric].length > this.options.maxHistory) {
      this.history[metric].shift();
    }
  }
  
  // Verificar umbrales
  checkThresholds(cpu, memory, eventLoop) {
    const alerts = [];
    
    if (cpu > this.options.thresholds.cpu) {
      alerts.push(`🚨 CPU usage alto: ${cpu.toFixed(2)}%`);
    }
    
    if (memory > this.options.thresholds.memory) {
      alerts.push(`🚨 Memory usage alto: ${memory.toFixed(2)}%`);
    }
    
    if (eventLoop > this.options.thresholds.eventLoop) {
      alerts.push(`🚨 Event loop lag alto: ${eventLoop}ms`);
    }
    
    if (alerts.length > 0) {
      this.emit('thresholds:exceeded', alerts);
      console.log('⚠️  Alertas de umbral:', alerts);
    }
  }
  
  // Configurar monitoreo del event loop
  setupEventLoopMonitoring() {
    setInterval(() => {
      const now = Date.now();
      const lag = now - this.eventLoopStart;
      
      if (lag > this.options.thresholds.eventLoop) {
        this.emit('eventloop:lag', lag);
      }
      
      this.eventLoopStart = now;
    }, 100);
  }
  
  // Obtener estadísticas del historial
  getStats() {
    const stats = {};
    
    for (const [metric, values] of Object.entries(this.history)) {
      if (metric === 'timestamp') continue;
      
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        
        stats[metric] = {
          current: values[values.length - 1],
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: sorted[0],
          max: sorted[sorted.length - 1],
          median: sorted[Math.floor(sorted.length / 2)]
        };
      }
    }
    
    return stats;
  }
  
  // Obtener gráfico ASCII simple
  getAsciiChart(metric, width = 50, height = 20) {
    if (!this.history[metric] || this.history[metric].length === 0) {
      return 'No hay datos disponibles';
    }
    
    const values = this.history[metric];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    
    if (range === 0) return 'Datos constantes';
    
    const chart = [];
    const step = values.length / width;
    
    for (let i = 0; i < height; i++) {
      let row = '';
      for (let j = 0; j < width; j++) {
        const index = Math.floor(j * step);
        if (index < values.length) {
          const value = values[index];
          const normalized = (value - min) / range;
          const y = Math.floor(normalized * (height - 1));
          
          if (i === height - 1 - y) {
            row += '█';
          } else if (i === height - 1) {
            row += '─';
          } else {
            row += ' ';
          }
        } else {
          row += ' ';
        }
      }
      chart.push(row);
    }
    
    return chart.join('\n');
  }
  
  // Obtener reporte completo
  getReport() {
    const stats = this.getStats();
    const report = {
      timestamp: new Date().toISOString(),
      isMonitoring: this.isMonitoring,
      options: this.options,
      currentMetrics: {
        cpu: stats.cpu?.current || 0,
        memory: stats.memory?.current || 0,
        eventLoop: stats.eventLoop?.current || 0
      },
      statistics: stats,
      alerts: []
    };
    
    // Verificar umbrales actuales
    if (stats.cpu?.current > this.options.thresholds.cpu) {
      report.alerts.push(`CPU usage alto: ${stats.cpu.current.toFixed(2)}%`);
    }
    
    if (stats.memory?.current > this.options.thresholds.memory) {
      report.alerts.push(`Memory usage alto: ${stats.memory.current.toFixed(2)}%`);
    }
    
    if (stats.eventLoop?.current > this.options.thresholds.eventLoop) {
      report.alerts.push(`Event loop lag alto: ${stats.eventLoop.current}ms`);
    }
    
    return report;
  }
}

// Ejemplo de uso
function demonstrateRealTimeMonitoring() {
  const monitor = new RealTimeMonitor({
    interval: 500, // 500ms
    maxHistory: 50,
    thresholds: {
      cpu: 70,
      memory: 80,
      eventLoop: 50
    }
  });
  
  // Configurar listeners
  monitor.on('metrics:collected', (metrics) => {
    console.log(`📊 Métricas: CPU ${metrics.cpu.toFixed(1)}% | Memory ${metrics.memory.toFixed(1)}% | EventLoop ${metrics.eventLoop}ms`);
  });
  
  monitor.on('thresholds:exceeded', (alerts) => {
    console.log('🚨 Alertas:', alerts.join(' | '));
  });
  
  monitor.on('eventloop:lag', (lag) => {
    console.log(`🐌 Event loop lag detectado: ${lag}ms`);
  });
  
  // Iniciar monitoreo
  monitor.start();
  
  // Simular carga
  setTimeout(() => {
    console.log('\n🔥 Simulando carga alta...');
    
    // Carga de CPU
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const start = Date.now();
        while (Date.now() - start < 100) {
          Math.random() * Math.random();
        }
      }, i * 100);
    }
    
    // Carga de memoria
    setTimeout(() => {
      const largeArray = new Array(1000000).fill('data');
      console.log('💾 Array grande creado');
      
      setTimeout(() => {
        largeArray.length = 0;
        console.log('🗑️  Array liberado');
      }, 2000);
    }, 1000);
    
  }, 2000);
  
  // Mostrar estadísticas después de 10 segundos
  setTimeout(() => {
    console.log('\n📈 Reporte final:');
    const report = monitor.getReport();
    console.log(JSON.stringify(report, null, 2));
    
    console.log('\n📊 Gráfico de CPU:');
    console.log(monitor.getAsciiChart('cpu', 40, 15));
    
    monitor.stop();
  }, 10000);
}
```

## 🔧 Optimización de Código

### Optimización de Bucles y Algoritmos

```javascript
// code-optimization.js
const { performance } = require('perf_hooks');

// Clase para optimización de código
class CodeOptimizer {
  constructor() {
    this.benchmarks = new Map();
  }
  
  // Benchmark de diferentes implementaciones
  benchmark(name, implementations, iterations = 1000) {
    console.log(`\n🏃 Benchmark: ${name}`);
    console.log('='.repeat(50));
    
    const results = [];
    
    for (const [implName, implementation] of Object.entries(implementations)) {
      // Warmup
      for (let i = 0; i < 100; i++) {
        implementation();
      }
      
      // Benchmark real
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        implementation();
      }
      const end = performance.now();
      
      const duration = end - start;
      const avgTime = duration / iterations;
      
      results.push({
        name: implName,
        totalTime: duration,
        avgTime: avgTime,
        iterations: iterations
      });
      
      console.log(`${implName.padEnd(20)}: ${duration.toFixed(2)}ms total, ${avgTime.toFixed(4)}ms avg`);
    }
    
    // Encontrar el más rápido
    const fastest = results.reduce((fastest, current) => 
      current.avgTime < fastest.avgTime ? current : fastest
    );
    
    console.log(`\n🏆 Más rápido: ${fastest.name} (${fastest.avgTime.toFixed(4)}ms avg)`);
    
    // Comparar con el más rápido
    results.forEach(result => {
      if (result.name !== fastest.name) {
        const ratio = result.avgTime / fastest.avgTime;
        console.log(`${result.name.padEnd(20)}: ${ratio.toFixed(2)}x más lento que ${fastest.name}`);
      }
    });
    
    this.benchmarks.set(name, results);
    return results;
  }
  
  // Optimización de bucles
  demonstrateLoopOptimization() {
    const array = Array.from({ length: 100000 }, (_, i) => i);
    
    console.log('\n🔄 Optimización de Bucles');
    console.log('='.repeat(50));
    
    // Implementación 1: for tradicional
    const forTraditional = () => {
      let sum = 0;
      for (let i = 0; i < array.length; i++) {
        sum += array[i];
      }
      return sum;
    };
    
    // Implementación 2: for...of
    const forOf = () => {
      let sum = 0;
      for (const num of array) {
        sum += num;
      }
      return sum;
    };
    
    // Implementación 3: forEach
    const forEach = () => {
      let sum = 0;
      array.forEach(num => sum += num);
      return sum;
    };
    
    // Implementación 4: reduce
    const reduce = () => {
      return array.reduce((sum, num) => sum + num, 0);
    };
    
    // Implementación 5: for optimizado (cache length)
    const forOptimized = () => {
      let sum = 0;
      const len = array.length;
      for (let i = 0; i < len; i++) {
        sum += array[i];
      }
      return sum;
    };
    
    // Implementación 6: while
    const whileLoop = () => {
      let sum = 0;
      let i = 0;
      while (i < array.length) {
        sum += array[i];
        i++;
      }
      return sum;
    };
    
    this.benchmark('Suma de Array', {
      'for tradicional': forTraditional,
      'for...of': forOf,
      'forEach': forEach,
      'reduce': reduce,
      'for optimizado': forOptimized,
      'while': whileLoop
    }, 1000);
  }
  
  // Optimización de strings
  demonstrateStringOptimization() {
    console.log('\n📝 Optimización de Strings');
    console.log('='.repeat(50));
    
    const iterations = 10000;
    const testString = 'Hello World';
    
    // Implementación 1: Concatenación con +
    const concatPlus = () => {
      let result = '';
      for (let i = 0; i < iterations; i++) {
        result += testString + i;
      }
      return result;
    };
    
    // Implementación 2: Array + join
    const arrayJoin = () => {
      const parts = [];
      for (let i = 0; i < iterations; i++) {
        parts.push(testString + i);
      }
      return parts.join('');
    };
    
    // Implementación 3: Template literals
    const templateLiterals = () => {
      let result = '';
      for (let i = 0; i < iterations; i++) {
        result += `${testString}${i}`;
      }
      return result;
    };
    
    // Implementación 4: StringBuilder pattern
    const stringBuilder = () => {
      const builder = [];
      for (let i = 0; i < iterations; i++) {
        builder.push(testString, i.toString());
      }
      return builder.join('');
    };
    
    this.benchmark('Concatenación de Strings', {
      'Concatenación +': concatPlus,
      'Array + join': arrayJoin,
      'Template literals': templateLiterals,
      'StringBuilder': stringBuilder
    }, 100);
  }
  
  // Optimización de objetos
  demonstrateObjectOptimization() {
    console.log('\n🏗️  Optimización de Objetos');
    console.log('='.repeat(50));
    
    const iterations = 100000;
    
    // Implementación 1: Crear objeto en cada iteración
    const createObjectEachTime = () => {
      for (let i = 0; i < iterations; i++) {
        const obj = {
          id: i,
          name: `Item ${i}`,
          value: Math.random(),
          timestamp: Date.now()
        };
        // Simular uso del objeto
        const id = obj.id;
      }
    };
    
    // Implementación 2: Reutilizar objeto
    const reuseObject = () => {
      const obj = {};
      for (let i = 0; i < iterations; i++) {
        obj.id = i;
        obj.name = `Item ${i}`;
        obj.value = Math.random();
        obj.timestamp = Date.now();
        // Simular uso del objeto
        const id = obj.id;
      }
    };
    
    // Implementación 3: Object.create
    const objectCreate = () => {
      for (let i = 0; i < iterations; i++) {
        const obj = Object.create(null);
        obj.id = i;
        obj.name = `Item ${i}`;
        obj.value = Math.random();
        obj.timestamp = Date.now();
        const id = obj.id;
      }
    };
    
    // Implementación 4: Map
    const useMap = () => {
      const map = new Map();
      for (let i = 0; i < iterations; i++) {
        map.set('id', i);
        map.set('name', `Item ${i}`);
        map.set('value', Math.random());
        map.set('timestamp', Date.now());
        const id = map.get('id');
      }
    };
    
    this.benchmark('Creación de Objetos', {
      'Crear cada vez': createObjectEachTime,
      'Reutilizar objeto': reuseObject,
      'Object.create': objectCreate,
      'Map': useMap
    }, 100);
  }
  
  // Optimización de arrays
  demonstrateArrayOptimization() {
    console.log('\n📊 Optimización de Arrays');
    console.log('='.repeat(50));
    
    const iterations = 10000;
    const arraySize = 1000;
    
    // Implementación 1: push en cada iteración
    const pushEachTime = () => {
      const arr = [];
      for (let i = 0; i < iterations; i++) {
        arr.push(i);
      }
      return arr;
    };
    
    // Implementación 2: Pre-allocar array
    const preAllocate = () => {
      const arr = new Array(iterations);
      for (let i = 0; i < iterations; i++) {
        arr[i] = i;
      }
      return arr;
    };
    
    // Implementación 3: Array.from
    const arrayFrom = () => {
      return Array.from({ length: iterations }, (_, i) => i);
    };
    
    // Implementación 4: Spread operator
    const spreadOperator = () => {
      return [...Array(iterations)].map((_, i) => i);
    };
    
    // Implementación 5: Uint32Array para números
    const uint32Array = () => {
      const arr = new Uint32Array(iterations);
      for (let i = 0; i < iterations; i++) {
        arr[i] = i;
      }
      return arr;
    };
    
    this.benchmark('Creación de Arrays', {
      'push cada vez': pushEachTime,
      'Pre-allocar': preAllocate,
      'Array.from': arrayFrom,
      'Spread operator': spreadOperator,
      'Uint32Array': uint32Array
    }, 100);
  }
  
  // Optimización de funciones
  demonstrateFunctionOptimization() {
    console.log('\n⚡ Optimización de Funciones');
    console.log('='.repeat(50));
    
    const iterations = 1000000;
    
    // Implementación 1: Función inline
    const inlineFunction = () => {
      let sum = 0;
      for (let i = 0; i < iterations; i++) {
        sum += Math.sqrt(i) * Math.sin(i);
      }
      return sum;
    };
    
    // Implementación 2: Función separada
    const calculateValue = (i) => Math.sqrt(i) * Math.sin(i);
    const separateFunction = () => {
      let sum = 0;
      for (let i = 0; i < iterations; i++) {
        sum += calculateValue(i);
      }
      return sum;
    };
    
    // Implementación 3: Función memoizada
    const memoizedFunction = () => {
      const cache = new Map();
      let sum = 0;
      
      for (let i = 0; i < iterations; i++) {
        if (!cache.has(i)) {
          cache.set(i, Math.sqrt(i) * Math.sin(i));
        }
        sum += cache.get(i);
      }
      return sum;
    };
    
    // Implementación 4: Función con bind
    const boundFunction = () => {
      const boundCalc = calculateValue.bind(null);
      let sum = 0;
      for (let i = 0; i < iterations; i++) {
        sum += boundCalc(i);
      }
      return sum;
    };
    
    this.benchmark('Ejecución de Funciones', {
      'Función inline': inlineFunction,
      'Función separada': separateFunction,
      'Función memoizada': memoizedFunction,
      'Función con bind': boundFunction
    }, 10);
  }
  
  // Obtener todos los benchmarks
  getAllBenchmarks() {
    const allResults = {};
    
    for (const [name, results] of this.benchmarks) {
      allResults[name] = results;
    }
    
    return allResults;
  }
  
  // Exportar resultados
  exportResults(filename = 'optimization-results.json') {
    const results = {
      timestamp: new Date().toISOString(),
      benchmarks: this.getAllBenchmarks(),
      summary: this.generateSummary()
    };
    
    require('fs').writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`📊 Resultados exportados a ${filename}`);
    
    return results;
  }
  
  // Generar resumen
  generateSummary() {
    const summary = {};
    
    for (const [benchmarkName, results] of this.benchmarks) {
      const fastest = results.reduce((fastest, current) => 
        current.avgTime < fastest.avgTime ? current : fastest
      );
      
      summary[benchmarkName] = {
        fastest: fastest.name,
        fastestTime: fastest.avgTime,
        totalImplementations: results.length,
        recommendations: this.generateRecommendations(benchmarkName, results)
      };
    }
    
    return summary;
  }
  
  // Generar recomendaciones
  generateRecommendations(benchmarkName, results) {
    const fastest = results.reduce((fastest, current) => 
      current.avgTime < fastest.avgTime ? current : fastest
    );
    
    const recommendations = [];
    
    results.forEach(result => {
      if (result.name !== fastest.name) {
        const ratio = result.avgTime / fastest.avgTime;
        
        if (ratio > 2) {
          recommendations.push(`Evitar ${result.name} - ${ratio.toFixed(1)}x más lento`);
        } else if (ratio > 1.5) {
          recommendations.push(`Considerar alternativas a ${result.name} - ${ratio.toFixed(1)}x más lento`);
        }
      }
    });
    
    return recommendations;
  }
}

// Ejemplo de uso
function demonstrateCodeOptimization() {
  const optimizer = new CodeOptimizer();
  
  console.log('🚀 Iniciando benchmarks de optimización...\n');
  
  // Ejecutar todos los benchmarks
  optimizer.demonstrateLoopOptimization();
  optimizer.demonstrateStringOptimization();
  optimizer.demonstrateObjectOptimization();
  optimizer.demonstrateArrayOptimization();
  optimizer.demonstrateFunctionOptimization();
  
  // Exportar resultados
  setTimeout(() => {
    const results = optimizer.exportResults('optimization-benchmarks.json');
    console.log('\n📊 Resumen de optimizaciones:');
    console.log(JSON.stringify(results.summary, null, 2));
  }, 1000);
}
```

## 📝 Puntos Clave - Performance (Parte 1)

### ✅ Conceptos Esenciales

1. **Profiling**: Medición precisa del rendimiento del código
2. **Monitoreo en Tiempo Real**: Seguimiento continuo de métricas
3. **Benchmarking**: Comparación de diferentes implementaciones
4. **Optimización de Bucles**: Elección del tipo de bucle más eficiente
5. **Gestión de Memoria**: Prevención de memory leaks

### ⚠️ Errores Comunes

1. **No medir antes de optimizar**
2. **Optimizaciones prematuras**
3. **Ignorar el event loop lag**
4. **No monitorear en producción**
5. **Optimizar código que se ejecuta raramente**

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre profiling y benchmarking?
2. ¿Por qué es importante el monitoreo del event loop?
3. ¿Cuándo deberías usar `for...of` vs `forEach`?
4. ¿Cómo detectas memory leaks en Node.js?
5. ¿Qué métricas son más importantes para monitorear?

---

**¡Continuemos con la segunda parte: Caching, Memoria y Optimización Avanzada!**
