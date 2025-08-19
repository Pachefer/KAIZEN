# 📝 Examen de Práctica - JSNAD

## 🎯 Introducción al Examen

El **OpenJS Node.js Application Developer (JSNAD)** es un examen de certificación que evalúa tu conocimiento práctico de Node.js. Esta sección contiene un examen de práctica completo con preguntas similares a las que encontrarás en el examen real.

### 📋 Información del Examen

- **Duración**: 90 minutos
- **Preguntas**: 50 preguntas de opción múltiple
- **Puntuación mínima**: 70%
- **Formato**: Examen en línea con proctor
- **Costo**: $200 USD

### 🎯 Objetivos del Examen

1. **Fundamentos de Node.js** (20%)
2. **Módulos y Sistema de Módulos** (15%)
3. **Control de Flujo Asíncrono** (25%)
4. **Control de Flujo Síncrono** (10%)
5. **Streams** (10%)
6. **Sistema de Archivos** (10%)
7. **Módulos de Utilidad** (10%)

---

## 📚 Examen de Práctica Completo

### 🔴 **PREGUNTA 1: Event Loop y Asincronía**

**¿Cuál es la salida del siguiente código?**

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');
```

**A)** 1, 2, 3, 4  
**B)** 1, 4, 3, 2  
**C)** 1, 4, 2, 3  
**D)** 1, 3, 4, 2  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) 1, 4, 3, 2**

**Explicación:**
El Event Loop de Node.js tiene diferentes fases y prioridades:

1. **console.log('1')** - Ejecución síncrona inmediata
2. **console.log('4')** - Ejecución síncrona inmediata
3. **Promise.resolve().then()** - Microtask (alta prioridad)
4. **setTimeout()** - Macrotask (baja prioridad)

**Orden de ejecución:**
- **Fase 1**: Código síncrono (1, 4)
- **Fase 2**: Microtasks (3)
- **Fase 3**: Macrotasks (2)

**Conceptos clave:**
- Las Promises son microtasks y tienen prioridad sobre los macrotasks
- setTimeout es un macrotask y se ejecuta después de todas las microtasks
- El código síncrono siempre se ejecuta primero

</details>

---

### 🔴 **PREGUNTA 2: Módulos CommonJS**

**¿Cuál es la diferencia entre `module.exports` y `exports`?**

**A)** No hay diferencia, son sinónimos  
**B)** `module.exports` es la referencia real, `exports` es solo un alias  
**C)** `exports` es más eficiente en memoria  
**D)** `module.exports` solo funciona con ES6 modules  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) `module.exports` es la referencia real, `exports` es solo un alias**

**Explicación:**
En CommonJS, `exports` es solo una referencia a `module.exports`, no la referencia real.

```javascript
// ❌ INCORRECTO - No funciona
exports = { name: 'John' };

// ✅ CORRECTO - Funciona
module.exports = { name: 'John' };

// ✅ CORRECTO - Funciona
exports.name = 'John';
```

**¿Por qué sucede esto?**
```javascript
// Internamente, Node.js hace esto:
var exports = module.exports;

// Si reasignas exports, pierdes la referencia
exports = { name: 'John' }; // exports apunta a un nuevo objeto
// module.exports sigue siendo el objeto original
```

**Mejores prácticas:**
- Usa `module.exports` para exportar objetos completos
- Usa `exports.propiedad` para agregar propiedades
- Nunca reasignes `exports`

</details>

---

### 🔴 **PREGUNTA 3: Promesas y Async/Await**

**¿Cuál es la salida del siguiente código?**

```javascript
async function test() {
  try {
    const result = await Promise.reject('Error!');
    console.log('Success:', result);
  } catch (error) {
    console.log('Caught:', error);
  }
}

test();
```

**A)** Success: Error!  
**B)** Caught: Error!  
**C)** Uncaught Promise rejection  
**D)** No hay salida  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) Caught: Error!**

**Explicación:**
Cuando usas `await` con una Promise que se rechaza, el error se captura automáticamente en el bloque `catch`.

**Flujo de ejecución:**
1. `Promise.reject('Error!')` crea una Promise rechazada
2. `await` espera la resolución de la Promise
3. Como la Promise se rechaza, se lanza una excepción
4. La excepción se captura en el bloque `catch`
5. Se ejecuta `console.log('Caught:', error)`

**Equivalente sin async/await:**
```javascript
function test() {
  return Promise.reject('Error!')
    .then(result => {
      console.log('Success:', result);
    })
    .catch(error => {
      console.log('Caught:', error);
    });
}
```

**Conceptos clave:**
- `await` convierte Promise rejections en excepciones
- Las excepciones en async functions se pueden capturar con try/catch
- `await` solo funciona dentro de funciones async

</details>

---

### 🔴 **PREGUNTA 4: Streams y Piping**

**¿Cuál es la diferencia entre `stream.pipe()` y `stream.pipeline()`?**

**A)** No hay diferencia funcional  
**B)** `pipeline()` maneja errores automáticamente, `pipe()` no  
**C)** `pipe()` es más eficiente en memoria  
**D)** `pipeline()` solo funciona con streams de texto  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) `pipeline()` maneja errores automáticamente, `pipe()` no**

**Explicación:**
`stream.pipe()` y `stream.pipeline()` tienen comportamientos diferentes en el manejo de errores.

**stream.pipe():**
```javascript
const fs = require('fs');

// ❌ Los errores pueden no propagarse correctamente
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'))
  .on('error', (error) => {
    // Este error handler puede no capturar todos los errores
    console.error('Error:', error);
  });
```

**stream.pipeline():**
```javascript
const { pipeline } = require('stream');
const fs = require('fs');

// ✅ Maneja errores automáticamente
pipeline(
  fs.createReadStream('input.txt'),
  fs.createWriteStream('output.txt'),
  (error) => {
    if (error) {
      console.error('Pipeline error:', error);
    } else {
      console.log('Pipeline completed successfully');
    }
  }
);
```

**Diferencias clave:**
- `pipe()` requiere manejo manual de errores en cada stream
- `pipeline()` maneja errores automáticamente y limpia recursos
- `pipeline()` es la opción recomendada para aplicaciones de producción

</details>

---

### 🔴 **PREGUNTA 5: Sistema de Archivos**

**¿Cuál es la diferencia entre `fs.readFile()` y `fs.readFileSync()`?**

**A)** No hay diferencia en funcionalidad  
**B)** `readFileSync()` es más rápido  
**C)** `readFileSync()` bloquea el event loop, `readFile()` no  
**D)** `readFile()` solo funciona con archivos pequeños  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: C) `readFileSync()` bloquea el event loop, `readFile()` no**

**Explicación:**
La diferencia principal está en el comportamiento síncrono vs asíncrono.

**fs.readFileSync() (Síncrono):**
```javascript
const fs = require('fs');

// ❌ BLOQUEA el event loop
try {
  const data = fs.readFileSync('large-file.txt', 'utf8');
  console.log('File read:', data.length, 'characters');
} catch (error) {
  console.error('Error:', error);
}

// Este código se ejecuta DESPUÉS de leer el archivo
console.log('This runs after file is read');
```

**fs.readFile() (Asíncrono):**
```javascript
const fs = require('fs');

// ✅ NO bloquea el event loop
fs.readFile('large-file.txt', 'utf8', (error, data) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('File read:', data.length, 'characters');
});

// Este código se ejecuta INMEDIATAMENTE
console.log('This runs immediately');
```

**Impacto en performance:**
- `readFileSync()` bloquea el event loop → otras operaciones esperan
- `readFile()` permite que otras operaciones continúen
- En aplicaciones de producción, siempre usa métodos asíncronos

</details>

---

### 🔴 **PREGUNTA 6: Módulos de Utilidad**

**¿Cuál es la salida del siguiente código?**

```javascript
const util = require('util');
const fs = require('fs');

const readFilePromise = util.promisify(fs.readFile);

readFilePromise('nonexistent.txt', 'utf8')
  .then(data => console.log('Success:', data))
  .catch(error => console.log('Error:', error.code));
```

**A)** Success: undefined  
**B)** Error: ENOENT  
**C)** Uncaught exception  
**D)** No hay salida  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) Error: ENOENT**

**Explicación:**
`util.promisify()` convierte funciones callback-based en funciones que retornan Promises.

**Flujo de ejecución:**
1. `util.promisify(fs.readFile)` convierte `fs.readFile` en una función que retorna una Promise
2. `readFilePromise('nonexistent.txt')` intenta leer un archivo que no existe
3. Como el archivo no existe, se rechaza la Promise
4. El error se captura en `.catch()` y se muestra `error.code`

**Código equivalente sin promisify:**
```javascript
const fs = require('fs');

fs.readFile('nonexistent.txt', 'utf8', (error, data) => {
  if (error) {
    console.log('Error:', error.code); // ENOENT
    return;
  }
  console.log('Success:', data);
});
```

**Códigos de error comunes:**
- `ENOENT`: File or directory does not exist
- `EACCES`: Permission denied
- `EISDIR`: Is a directory
- `ENOTDIR`: Not a directory

**Ventajas de promisify:**
- Código más limpio y legible
- Mejor manejo de errores con try/catch
- Compatible con async/await

</details>

---

### 🔴 **PREGUNTA 7: Control de Flujo Síncrono**

**¿Cuál es la salida del siguiente código?**

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

try {
  console.log(factorial(100000));
} catch (error) {
  console.log('Error:', error.name);
}
```

**A)** Un número muy grande  
**B)** Error: RangeError  
**C)** Error: TypeError  
**D)** Error: ReferenceError  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) Error: RangeError**

**Explicación:**
El error `RangeError: Maximum call stack size exceeded` ocurre por desbordamiento de pila (stack overflow).

**¿Por qué sucede?**
1. `factorial(100000)` hace 100,000 llamadas recursivas
2. Cada llamada agrega un frame a la pila de ejecución
3. La pila tiene un límite (típicamente ~10,000-20,000 frames)
4. Se excede el límite y se lanza `RangeError`

**Solución: Usar recursión de cola o iteración**
```javascript
// ✅ Recursión de cola (optimizada)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc);
}

// ✅ Iteración (más eficiente)
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// ✅ Con BigInt para números grandes
function factorialBigInt(n) {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}
```

**Conceptos clave:**
- La recursión tiene límites de pila
- La recursión de cola puede ser optimizada por el motor
- Para cálculos grandes, usa iteración o BigInt

</details>

---

### 🔴 **PREGUNTA 8: Event Emitters**

**¿Cuál es la salida del siguiente código?**

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('Listener 1');
});

myEmitter.on('event', () => {
  console.log('Listener 2');
});

myEmitter.emit('event');
```

**A)** Listener 1  
**B)** Listener 2  
**C)** Listener 1, Listener 2  
**D)** Listener 2, Listener 1  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: C) Listener 1, Listener 2**

**Explicación:**
Los Event Listeners se ejecutan en el orden en que fueron registrados (FIFO - First In, First Out).

**Flujo de ejecución:**
1. `myEmitter.on('event', listener1)` - Registra el primer listener
2. `myEmitter.on('event', listener2)` - Registra el segundo listener
3. `myEmitter.emit('event')` - Emite el evento
4. Los listeners se ejecutan en orden de registro: Listener 1, luego Listener 2

**Comportamiento de Event Emitters:**
```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// Los listeners se ejecutan en orden de registro
myEmitter.on('event', () => console.log('1'));
myEmitter.on('event', () => console.log('2'));
myEmitter.on('event', () => console.log('3'));

myEmitter.emit('event');
// Salida: 1, 2, 3

// Los listeners se pueden remover
myEmitter.removeAllListeners('event');

myEmitter.emit('event');
// No hay salida - no hay listeners
```

**Conceptos clave:**
- Los listeners se ejecutan en orden de registro
- Un evento puede tener múltiples listeners
- Los listeners se ejecutan síncronamente por defecto
- Se puede usar `prependListener()` para agregar al inicio

</details>

---

### 🔴 **PREGUNTA 9: Buffer y Streams**

**¿Cuál es la salida del siguiente código?**

```javascript
const { Transform } = require('stream');

const transform = new Transform({
  transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  }
});

transform.write('hello');
transform.write(' world');
transform.end();

transform.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});
```

**A)** Received: HELLO, Received: WORLD  
**B)** Received: HELLO WORLD  
**C)** No hay salida  
**D)** Error: Stream not readable  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: C) No hay salida**

**Explicación:**
El problema está en el orden de las operaciones. Los datos se escriben antes de que se configure el listener de 'data'.

**Problema en el código:**
1. Se escriben los datos con `transform.write()`
2. Se cierra el stream con `transform.end()`
3. Se configura el listener de 'data' DESPUÉS de que los datos ya fueron procesados

**Solución 1: Configurar listener antes de escribir**
```javascript
const { Transform } = require('stream');

const transform = new Transform({
  transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  }
});

// ✅ Configurar listener ANTES de escribir
transform.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

transform.write('hello');
transform.write(' world');
transform.end();
// Salida: Received: HELLO, Received: WORLD
```

**Solución 2: Usar pipeline o pipe**
```javascript
const { Transform } = require('stream');
const { pipeline } = require('stream');

const transform = new Transform({
  transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  }
});

// ✅ Usar pipeline para manejo automático
pipeline(
  transform,
  process.stdout,
  (error) => {
    if (error) console.error('Error:', error);
  }
);

transform.write('hello');
transform.write(' world');
transform.end();
// Salida: HELLO WORLD
```

**Conceptos clave:**
- Los listeners deben configurarse antes de emitir eventos
- Los streams tienen diferentes modos (flowing vs paused)
- `pipeline()` maneja el flujo automáticamente

</details>

---

### 🔴 **PREGUNTA 10: Módulos ES6**

**¿Cuál es la diferencia entre `import` y `require`?**

**A)** No hay diferencia funcional  
**B)** `import` es más rápido en tiempo de ejecución  
**C)** `import` es estático, `require` es dinámico  
**D)** `require` solo funciona en Node.js  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: C) `import` es estático, `require` es dinámico**

**Explicación:**
`import` y `require` tienen diferentes características de resolución y ejecución.

**import (ES6 Modules):**
```javascript
// ✅ Importación estática - se resuelve en tiempo de compilación
import { readFile } from 'fs';
import * as path from 'path';

// ❌ No se puede usar en condicionales
if (condition) {
  import { something } from './module'; // Error de sintaxis
}

// ❌ No se puede usar con variables
const moduleName = './dynamic-module';
import { func } from moduleName; // Error de sintaxis
```

**require (CommonJS):**
```javascript
// ✅ Importación dinámica - se resuelve en tiempo de ejecución
const fs = require('fs');
const path = require('path');

// ✅ Se puede usar en condicionales
if (condition) {
  const module = require('./conditional-module');
}

// ✅ Se puede usar con variables
const moduleName = './dynamic-module';
const module = require(moduleName);

// ✅ Se puede usar en funciones
function loadModule(name) {
  return require(name);
}
```

**Diferencias clave:**
- **import**: Estático, se resuelve en tiempo de compilación
- **require**: Dinámico, se resuelve en tiempo de ejecución
- **import**: Mejor para tree-shaking y optimización
- **require**: Más flexible para cargas condicionales

**Compatibilidad:**
- `import` requiere Node.js 12+ o transpilación
- `require` funciona en todas las versiones de Node.js
- Los archivos `.mjs` solo soportan `import`
- Los archivos `.cjs` solo soportan `require`

</details>

---

## 🧪 Preguntas Adicionales de Práctica

### 🔴 **PREGUNTA 11: Async/Await y Promises**

**¿Cuál es la salida del siguiente código?**

```javascript
async function test() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('3');
}

console.log('4');
test();
console.log('5');
```

**A)** 4, 1, 2, 3, 5  
**B)** 4, 1, 5, 2, 3  
**C)** 4, 5, 1, 2, 3  
**D)** 1, 2, 3, 4, 5  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) 4, 1, 5, 2, 3**

**Explicación:**
El flujo de ejecución sigue las reglas del Event Loop y async/await.

**Flujo detallado:**
1. `console.log('4')` - Ejecución síncrona inmediata
2. `test()` - Se llama la función async
3. `console.log('1')` - Dentro de test, ejecución síncrona
4. `await Promise.resolve()` - Microtask, se ejecuta inmediatamente
5. `console.log('2')` - Después del primer await
6. `await new Promise(resolve => setTimeout(resolve, 100))` - Macrotask, se ejecuta después
7. `console.log('3')` - Después del segundo await
8. `console.log('5')` - Ejecución síncrona después de llamar test()

**Orden de ejecución:**
- **Fase 1**: Código síncrono (4, 1, 5)
- **Fase 2**: Microtasks (2)
- **Fase 3**: Macrotasks (3)

**Conceptos clave:**
- Las funciones async retornan Promises automáticamente
- `await` pausa la ejecución de la función async
- El código después de `test()` se ejecuta inmediatamente
- Los `await` se procesan en el Event Loop

</details>

---

### 🔴 **PREGUNTA 12: Módulos y Caching**

**¿Cuál es la salida del siguiente código?**

```javascript
// module1.js
let counter = 0;
module.exports = {
  increment: () => ++counter,
  getValue: () => counter
};

// main.js
const module1 = require('./module1');
const module1Copy = require('./module1');

console.log(module1.increment()); // 1
console.log(module1Copy.increment()); // 2
console.log(module1.getValue()); // ?
```

**A)** 1  
**B)** 2  
**C)** 3  
**D)** Error  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) 2**

**Explicación:**
Node.js cachea los módulos por defecto. Múltiples `require()` del mismo módulo retornan la misma instancia.

**Flujo de ejecución:**
1. `require('./module1')` - Primera carga del módulo
2. `require('./module1')` - Segunda carga, retorna la instancia cacheada
3. `module1.increment()` - Incrementa counter a 1
4. `module1Copy.increment()` - Incrementa el MISMO counter a 2
5. `module1.getValue()` - Retorna 2 (el valor actual del counter compartido)

**Código equivalente:**
```javascript
// module1.js
let counter = 0;
module.exports = {
  increment: () => ++counter,
  getValue: () => counter
};

// main.js
const module1 = require('./module1');
const module1Copy = require('./module1');

// module1 y module1Copy son la MISMA instancia
console.log(module1 === module1Copy); // true

console.log(module1.increment()); // 1
console.log(module1Copy.increment()); // 2
console.log(module1.getValue()); // 2
```

**Conceptos clave:**
- Node.js cachea módulos en `require.cache`
- Múltiples `require()` retornan la misma instancia
- El estado se comparte entre todas las referencias
- Para evitar esto, exporta funciones en lugar de estado mutable

**Solución: Exportar funciones en lugar de estado**
```javascript
// module1.js
module.exports = {
  createCounter: () => {
    let counter = 0;
    return {
      increment: () => ++counter,
      getValue: () => counter
    };
  }
};

// main.js
const { createCounter } = require('./module1');
const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1.increment()); // 1
console.log(counter2.increment()); // 1 (instancia separada)
```

</details>

---

### 🔴 **PREGUNTA 13: Streams y Backpressure**

**¿Qué es el backpressure en Node.js streams?**

**A)** Un error que ocurre cuando los streams fallan  
**B)** Un mecanismo para controlar la velocidad de flujo de datos  
**C)** Una característica que hace los streams más lentos  
**D)** Un tipo de stream especial  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) Un mecanismo para controlar la velocidad de flujo de datos**

**Explicación:**
El backpressure es un mecanismo automático que previene que un stream rápido sobrecargue un stream lento.

**¿Cómo funciona?**
```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Stream lento (procesa 1 byte por segundo)
const slowTransform = new Transform({
  transform(chunk, encoding, callback) {
    setTimeout(() => {
      callback(null, chunk);
    }, 1000); // 1 segundo de delay
  }
});

// Stream rápido (lee archivo completo)
const readStream = fs.createReadStream('large-file.txt');

// El backpressure se maneja automáticamente
readStream.pipe(slowTransform).pipe(process.stdout);
```

**Mecanismo de backpressure:**
1. El stream lento no puede procesar datos tan rápido como llegan
2. Su buffer interno se llena
3. Emite el evento `'drain'` cuando está listo para más datos
4. El stream rápido pausa la lectura hasta que recibe `'drain'`
5. El proceso continúa de manera controlada

**Control manual del backpressure:**
```javascript
const { Transform } = require('stream');

class ControlledTransform extends Transform {
  constructor(options = {}) {
    super(options);
    this.processing = false;
  }

  _transform(chunk, encoding, callback) {
    if (this.processing) {
      // Pausar el stream de entrada
      this.pause();
    }

    this.processing = true;
    
    // Simular procesamiento lento
    setTimeout(() => {
      this.push(chunk);
      this.processing = false;
      callback();
      
      // Reanudar el stream de entrada
      this.resume();
    }, 100);
  }
}
```

**Conceptos clave:**
- El backpressure es automático en streams pipeados
- Se puede controlar manualmente con `pause()` y `resume()`
- Es esencial para aplicaciones que procesan grandes cantidades de datos
- Previene el uso excesivo de memoria

</details>

---

### 🔴 **PREGUNTA 14: Error Handling en Async Functions**

**¿Cuál es la salida del siguiente código?**

```javascript
async function riskyOperation() {
  throw new Error('Something went wrong');
}

async function main() {
  try {
    const result = await riskyOperation();
    console.log('Success:', result);
  } catch (error) {
    console.log('Caught:', error.message);
  }
}

main();
```

**A)** Success: undefined  
**B)** Caught: Something went wrong  
**C)** Uncaught exception  
**D)** No hay salida  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) Caught: Something went wrong**

**Explicación:**
En async functions, las excepciones se pueden capturar con try/catch estándar.

**Flujo de ejecución:**
1. `riskyOperation()` se ejecuta y lanza una excepción
2. Como está dentro de `await`, la excepción se convierte en un rejection de Promise
3. El rejection se captura en el bloque `catch`
4. Se ejecuta `console.log('Caught:', error.message)`

**Equivalente con Promises:**
```javascript
function riskyOperation() {
  return Promise.reject(new Error('Something went wrong'));
}

function main() {
  riskyOperation()
    .then(result => {
      console.log('Success:', result);
    })
    .catch(error => {
      console.log('Caught:', error.message);
    });
}
```

**Manejo de errores en async/await:**
```javascript
async function example() {
  try {
    // Múltiples operaciones async
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    
    return { user, posts, comments };
  } catch (error) {
    // Captura errores de CUALQUIERA de las operaciones async
    console.error('Error in async operation:', error.message);
    throw error; // Re-lanzar para manejo superior
  }
}

// Manejo de errores en el nivel superior
example()
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Failed:', error.message));
```

**Conceptos clave:**
- `await` convierte Promise rejections en excepciones
- try/catch funciona igual que en código síncrono
- Un solo try/catch puede capturar errores de múltiples awaits
- Es más legible que `.catch()` en cadenas de Promises

</details>

---

### 🔴 **PREGUNTA 15: Módulos de Utilidad Avanzados**

**¿Cuál es la diferencia entre `util.inspect` y `util.format`?**

**A)** No hay diferencia funcional  
**B)** `inspect` es para objetos, `format` es para strings  
**C)** `inspect` es más detallado, `format` es más simple  
**D)** `inspect` solo funciona en Node.js, `format` es universal  

<details>
<summary>📖 **Respuesta y Explicación**</summary>

**Respuesta Correcta: B) `inspect` es para objetos, `format` es para strings**

**Explicación:**
`util.inspect` y `util.format` tienen propósitos diferentes y se usan en diferentes contextos.

**util.inspect - Para objetos:**
```javascript
const util = require('util');

const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  metadata: {
    createdAt: new Date(),
    isActive: true
  }
};

// Inspección básica
console.log(util.inspect(obj));
// Salida: { name: 'John', age: 30, hobbies: [ 'reading', 'coding' ], metadata: { createdAt: 2024-01-01T00:00:00.000Z, isActive: true } }

// Inspección con opciones
console.log(util.inspect(obj, {
  depth: 1,           // Profundidad máxima
  colors: true,        // Colores en terminal
  compact: false,      // Formato compacto
  showHidden: true     // Mostrar propiedades ocultas
}));
```

**util.format - Para strings:**
```javascript
const util = require('util');

// Formateo básico
console.log(util.format('Hello %s, you are %d years old', 'John', 30));
// Salida: Hello John, you are 30 years old

// Múltiples argumentos
console.log(util.format('User: %s, Age: %d, Active: %s', 'Alice', 25, true));
// Salida: User: Alice, Age: 25, Active: true

// Placeholders disponibles
console.log(util.format('String: %s, Number: %d, Float: %f, Object: %o', 'text', 42, 3.14, { key: 'value' }));
// Salida: String: text, Number: 42, Float: 3.14, Object: { key: 'value' }
```

**Casos de uso:**
```javascript
const util = require('util');

// util.inspect para debugging
function debugObject(obj, label = 'Object') {
  console.log(`${label}:`, util.inspect(obj, {
    depth: null,      // Sin límite de profundidad
    colors: true,     // Colores en terminal
    compact: false    // Formato legible
  }));
}

// util.format para logging
function logMessage(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const formattedMessage = util.format(message, ...args);
  console.log(`[${timestamp}] [${level}] ${formattedMessage}`);
}

// Uso
debugObject({ user: 'John', data: [1, 2, 3] }, 'User Data');
logMessage('INFO', 'User %s logged in from %s', 'John', '192.168.1.1');
```

**Diferencias clave:**
- **util.inspect**: Para inspeccionar y visualizar objetos
- **util.format**: Para formatear strings con placeholders
- **util.inspect**: Más útil para debugging y desarrollo
- **util.format**: Más útil para logging y presentación de datos

</details>

---

## 📊 Simulador de Examen

### 🎯 **Instrucciones del Simulador**

1. **Tiempo**: 90 minutos
2. **Preguntas**: 50 preguntas de opción múltiple
3. **Puntuación**: 70% mínimo para aprobar
4. **Formato**: Una pregunta por pantalla
5. **Navegación**: Puedes revisar respuestas anteriores

### 📝 **Configuración del Simulador**

```javascript
// exam-simulator.js
class JSNADExamSimulator {
  constructor() {
    this.questions = this.loadQuestions();
    this.currentQuestion = 0;
    this.answers = new Map();
    this.startTime = null;
    this.timeLimit = 90 * 60 * 1000; // 90 minutos en milisegundos
  }
  
  // Cargar preguntas del examen
  loadQuestions() {
    return [
      {
        id: 1,
        question: "¿Cuál es la salida del siguiente código?",
        code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        options: [
          "1, 2, 3, 4",
          "1, 4, 3, 2",
          "1, 4, 2, 3",
          "1, 3, 4, 2"
        ],
        correct: 1,
        explanation: "El Event Loop ejecuta primero el código síncrono, luego microtasks (Promises), y finalmente macrotasks (setTimeout).",
        category: "Event Loop y Asincronía"
      },
      // ... más preguntas
    ];
  }
  
  // Iniciar examen
  startExam() {
    this.startTime = Date.now();
    this.showQuestion();
    this.startTimer();
  }
  
  // Mostrar pregunta actual
  showQuestion() {
    const question = this.questions[this.currentQuestion];
    // Implementar interfaz de usuario
  }
  
  // Responder pregunta
  answerQuestion(questionId, answerIndex) {
    this.answers.set(questionId, answerIndex);
  }
  
  // Calcular puntuación
  calculateScore() {
    let correct = 0;
    let total = this.questions.length;
    
    for (const [questionId, answerIndex] of this.answers) {
      const question = this.questions.find(q => q.id === questionId);
      if (question && answerIndex === question.correct) {
        correct++;
      }
    }
    
    return {
      correct,
      total,
      percentage: (correct / total * 100).toFixed(2),
      passed: (correct / total) >= 0.7
    };
  }
  
  // Generar reporte
  generateReport() {
    const score = this.calculateScore();
    const timeUsed = Date.now() - this.startTime;
    
    return {
      score,
      timeUsed: `${Math.floor(timeUsed / 60000)}:${Math.floor((timeUsed % 60000) / 1000).toString().padStart(2, '0')}`,
      questions: this.questions.map(q => ({
        id: q.id,
        category: q.category,
        answered: this.answers.has(q.id),
        correct: this.answers.has(q.id) && this.answers.get(q.id) === q.correct
      }))
    };
  }
}
```

---

## 📈 Estrategias para el Examen

### 🎯 **Antes del Examen**

1. **Repasa los conceptos clave** de cada sección
2. **Practica con código real** - no solo teoría
3. **Entiende el Event Loop** - es fundamental
4. **Maneja bien async/await** y Promises
5. **Conoce los módulos de utilidad** principales

### ⏱️ **Durante el Examen**

1. **Lee cuidadosamente** cada pregunta
2. **Analiza el código** paso a paso
3. **Elimina opciones obvias** primero
4. **Maneja tu tiempo** - ~1.8 minutos por pregunta
5. **Marca preguntas difíciles** para revisar después

### 🔍 **Tipos de Preguntas Comunes**

1. **"¿Cuál es la salida?"** - Analiza el código paso a paso
2. **"¿Cuál es la diferencia?"** - Compara características específicas
3. **"¿Qué sucede si...?"** - Piensa en casos edge
4. **"¿Cuál es la mejor práctica?"** - Considera performance y mantenibilidad

### 📚 **Recursos de Estudio**

1. **Documentación oficial** de Node.js
2. **Ejemplos prácticos** de cada concepto
3. **Pruebas unitarias** para validar entendimiento
4. **Proyectos pequeños** que implementen cada tema
5. **Comunidad y foros** para resolver dudas

---

## 🎉 Conclusión

### ✅ **Lo que has Aprendido**

1. **Fundamentos sólidos** de Node.js y JavaScript
2. **Patrones de programación** asíncrona y síncrona
3. **Optimización y performance** de aplicaciones
4. **Seguridad y mejores prácticas** de desarrollo
5. **Escalabilidad y arquitectura** de sistemas

### 🚀 **Próximos Pasos**

1. **Practica con el código** de esta guía
2. **Construye proyectos** que implementen cada concepto
3. **Toma el examen de práctica** completo
4. **Identifica áreas** de mejora
5. **Programa tu examen** oficial cuando estés listo

### 💡 **Consejos Finales**

- **La práctica hace al maestro** - escribe código todos los días
- **Entiende, no memorices** - los conceptos se aplican en el mundo real
- **Construye algo real** - aplica lo aprendido en proyectos prácticos
- **Mantente actualizado** - Node.js evoluciona constantemente
- **Confía en ti mismo** - has cubierto todo el material necesario

---

**¡Felicitaciones por completar la guía JSNAD! 🎓**

**Ahora tienes todo el conocimiento necesario para aprobar el examen y convertirte en un Node.js Application Developer certificado. ¡Buena suerte! 🚀**
