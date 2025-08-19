# 🧠 Fundamentos de Node.js - JSNAD

## 📖 ¿Qué es Node.js?

Node.js es un runtime de JavaScript construido sobre el motor V8 de Chrome que permite ejecutar JavaScript en el servidor. Utiliza un modelo de **event loop** no bloqueante y **I/O asíncrono** para manejar operaciones concurrentes de manera eficiente.

### Características Principales

- **Single-threaded**: Un solo hilo principal con event loop
- **Non-blocking I/O**: Operaciones I/O no bloquean el hilo principal
- **Event-driven**: Arquitectura basada en eventos
- **Cross-platform**: Funciona en Windows, macOS y Linux

## 🔄 Event Loop

El event loop es el corazón de Node.js. Es un mecanismo que permite que Node.js realice operaciones no bloqueantes a pesar de ser single-threaded.

### Fases del Event Loop

```javascript
// Ejemplo de comprensión del event loop
console.log('1. Inicio del script');

setTimeout(() => {
  console.log('2. Timer callback');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise microtask');
});

console.log('4. Fin del script');

// Salida:
// 1. Inicio del script
// 4. Fin del script
// 3. Promise microtask
// 2. Timer callback
```

### Orden de Ejecución

1. **Call Stack**: Funciones síncronas
2. **Microtasks**: Promises, process.nextTick()
3. **Macrotasks**: setTimeout, setInterval, setImmediate
4. **I/O callbacks**: Operaciones de archivo, red

## 🧪 Pruebas Unitarias - Event Loop

```javascript
// tests/event-loop.test.js
describe('Event Loop Understanding', () => {
  test('debe ejecutar microtasks antes que macrotasks', (done) => {
    const results = [];
    
    setTimeout(() => {
      results.push('macrotask');
      expect(results).toEqual(['microtask', 'macrotask']);
      done();
    }, 0);
    
    Promise.resolve().then(() => {
      results.push('microtask');
    });
  });
  
  test('debe respetar el orden de las fases', (done) => {
    const order = [];
    
    // Macrotask
    setImmediate(() => {
      order.push('setImmediate');
    });
    
    // Timer
    setTimeout(() => {
      order.push('setTimeout');
    }, 0);
    
    // Microtask
    Promise.resolve().then(() => {
      order.push('Promise');
    });
    
    // I/O
    process.nextTick(() => {
      order.push('nextTick');
      
      setTimeout(() => {
        expect(order).toEqual(['nextTick', 'Promise', 'setTimeout', 'setImmediate']);
        done();
      }, 10);
    });
  });
});
```

## 📦 Módulos Core de Node.js

### Módulos Built-in Principales

```javascript
// Módulos que NO requieren require()
const fs = require('fs');           // Sistema de archivos
const path = require('path');       // Manejo de rutas
const http = require('http');       // Servidor HTTP
const https = require('https');     // Servidor HTTPS
const url = require('url');         // Parsing de URLs
const querystring = require('querystring'); // Parsing de query strings
const crypto = require('crypto');   // Criptografía
const stream = require('stream');   // Streams
const events = require('events');   // Sistema de eventos
const util = require('util');       // Utilidades
const assert = require('assert');   // Testing
const buffer = require('buffer');   // Manejo de buffers
const timers = require('timers');   // Timers
const os = require('os');          // Información del sistema
const child_process = require('child_process'); // Procesos hijos
```

## 🔧 Global Objects

### Objetos Globales Disponibles

```javascript
// Objetos disponibles globalmente en Node.js
console.log(global); // Muestra todos los objetos globales

// Principales objetos globales
console.log(__dirname);    // Directorio actual del módulo
console.log(__filename);   // Ruta completa del archivo actual
console.log(process);      // Información del proceso
console.log(Buffer);       // Constructor de buffers
console.log(setTimeout);   // Función global de timer
console.log(setInterval);  // Función global de timer
console.log(clearTimeout); // Limpiar timer
console.log(clearInterval); // Limpiar interval
console.log(setImmediate); // Ejecutar en la siguiente iteración
console.log(clearImmediate); // Limpiar immediate
```

## 🧪 Pruebas Unitarias - Global Objects

```javascript
// tests/global-objects.test.js
describe('Global Objects', () => {
  test('__dirname debe ser una ruta absoluta', () => {
    expect(__dirname).toMatch(/^\/.*/);
    expect(__dirname).toContain('tests');
  });
  
  test('__filename debe ser una ruta absoluta', () => {
    expect(__filename).toMatch(/^\/.*/);
    expect(__filename).toContain('global-objects.test.js');
  });
  
  test('process debe tener propiedades específicas', () => {
    expect(process).toHaveProperty('version');
    expect(process).toHaveProperty('platform');
    expect(process).toHaveProperty('arch');
    expect(process).toHaveProperty('pid');
  });
  
  test('Buffer debe estar disponible globalmente', () => {
    expect(Buffer).toBeDefined();
    expect(typeof Buffer.from).toBe('function');
  });
});
```

## 📊 Process Object

### Propiedades y Métodos Importantes

```javascript
// Información del proceso
console.log('Process ID:', process.pid);
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Working directory:', process.cwd());
console.log('Environment variables:', process.env.NODE_ENV);

// Eventos del proceso
process.on('exit', (code) => {
  console.log(`Proceso terminando con código: ${code}`);
});

process.on('uncaughtException', (error) => {
  console.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rechazada no manejada:', reason);
});

// Métodos del proceso
process.exit(0);           // Salir exitosamente
process.kill(process.pid); // Terminar el proceso
process.nextTick(() => {}); // Ejecutar en la siguiente iteración
```

## 🧪 Pruebas Unitarias - Process Object

```javascript
// tests/process-object.test.js
describe('Process Object', () => {
  test('debe tener propiedades básicas', () => {
    expect(process.pid).toBeGreaterThan(0);
    expect(process.version).toMatch(/^v\d+\.\d+\.\d+$/);
    expect(process.platform).toMatch(/^(win32|darwin|linux)$/);
    expect(process.arch).toMatch(/^(x64|arm64|ia32)$/);
  });
  
  test('process.cwd() debe retornar directorio actual', () => {
    const cwd = process.cwd();
    expect(cwd).toMatch(/^\/.*/);
    expect(cwd).toContain('jsnad-practice');
  });
  
  test('process.env debe contener variables de entorno', () => {
    expect(process.env).toBeDefined();
    expect(typeof process.env).toBe('object');
  });
  
  test('process.nextTick debe ejecutar callback', (done) => {
    let executed = false;
    process.nextTick(() => {
      executed = true;
      expect(executed).toBe(true);
      done();
    });
    expect(executed).toBe(false);
  });
});
```

## 🔄 Buffer y TypedArray

### Manejo de Datos Binarios

```javascript
// Crear buffers
const buf1 = Buffer.alloc(10);           // Buffer de 10 bytes inicializados en 0
const buf2 = Buffer.allocUnsafe(10);     // Buffer no inicializado (más rápido)
const buf3 = Buffer.from('Hello World'); // Buffer desde string
const buf4 = Buffer.from([1, 2, 3, 4]); // Buffer desde array

// Operaciones con buffers
const buf = Buffer.from('Hello World');
console.log(buf.toString());              // 'Hello World'
console.log(buf.toString('hex'));        // '48656c6c6f20576f726c64'
console.log(buf.toString('base64'));     // 'SGVsbG8gV29ybGQ='

// Manipulación de buffers
const buf5 = Buffer.alloc(5);
buf5.write('Hello');
console.log(buf5.toString());            // 'Hello'

// Concatenación
const buf6 = Buffer.concat([buf3, buf4]);
console.log(buf6.toString());            // 'Hello World123'
```

## 🧪 Pruebas Unitarias - Buffer

```javascript
// tests/buffer.test.js
describe('Buffer Operations', () => {
  test('Buffer.alloc debe crear buffer inicializado en 0', () => {
    const buf = Buffer.alloc(5);
    expect(buf.length).toBe(5);
    expect(buf[0]).toBe(0);
    expect(buf[4]).toBe(0);
  });
  
  test('Buffer.from debe crear buffer desde string', () => {
    const buf = Buffer.from('Hello');
    expect(buf.length).toBe(5);
    expect(buf.toString()).toBe('Hello');
  });
  
  test('Buffer.from debe crear buffer desde array', () => {
    const buf = Buffer.from([72, 101, 108, 108, 111]);
    expect(buf.toString()).toBe('Hello');
  });
  
  test('Buffer.write debe escribir datos', () => {
    const buf = Buffer.alloc(5);
    const bytesWritten = buf.write('Hello');
    expect(bytesWritten).toBe(5);
    expect(buf.toString()).toBe('Hello');
  });
  
  test('Buffer.concat debe concatenar buffers', () => {
    const buf1 = Buffer.from('Hello');
    const buf2 = Buffer.from('World');
    const result = Buffer.concat([buf1, buf2]);
    expect(result.toString()).toBe('HelloWorld');
  });
});
```

## 📝 Puntos Clave - Fundamentos

### ✅ Conceptos Esenciales

1. **Event Loop**: Entender las fases y el orden de ejecución
2. **Single-threaded**: Node.js usa un solo hilo con event loop
3. **Non-blocking I/O**: Operaciones I/O no bloquean el hilo principal
4. **Global Objects**: __dirname, __filename, process, Buffer
5. **Process Object**: Manejo del proceso actual y eventos
6. **Buffer**: Manejo de datos binarios

### ⚠️ Errores Comunes

1. **Confundir el orden del event loop**
2. **No entender la diferencia entre microtasks y macrotasks**
3. **Olvidar que __dirname y __filename son relativos al módulo**
4. **No manejar excepciones no capturadas**

### 🎯 Preguntas de Práctica

1. ¿En qué orden se ejecutan setTimeout(0), Promise.resolve(), y process.nextTick()?
2. ¿Qué diferencia hay entre Buffer.alloc() y Buffer.allocUnsafe()?
3. ¿Cómo se puede terminar un proceso Node.js programáticamente?
4. ¿Qué representa __dirname en Node.js?

---

**¡Continuemos con la siguiente sección: Módulos y Sistema de Módulos!**
