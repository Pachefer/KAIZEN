# Node.js Design Patterns - Capítulos 4 y 5: Control de Flujo Asíncrono

## Capítulo 4: Patrones de Control de Flujo Asíncrono con Callbacks

### 1. Ejecución Secuencial con Callbacks

Uno de los patrones más importantes para manejar operaciones asíncronas en secuencia.

```javascript
// EJECUCIÓN SECUENCIAL CON CALLBACKS
// Las tareas se ejecutan una después de otra, no en paralelo

function asyncOperation(cb) {
  // Simulamos una operación asíncrona usando process.nextTick
  // process.nextTick ejecuta el callback en el siguiente tick del event loop
  process.nextTick(cb)
}

// TAREA 1: Primera operación asíncrona
function task1(cb) {
  asyncOperation(() => {
    // Solo cuando task1 termina, ejecutamos task2
    task2(cb)
  })
}

// TAREA 2: Segunda operación asíncrona
function task2(cb) {
  asyncOperation(() => {
    // Solo cuando task2 termina, ejecutamos task3
    task3(cb)
  })
}

// TAREA 3: Tercera operación asíncrona
function task3(cb) {
  asyncOperation(() => {
    // Finalmente ejecutamos el callback principal
    cb() // Aquí se ejecuta el callback final
  })
}

// EJECUTAMOS LA SECUENCIA
task1(() => {
  // Este callback se ejecuta cuando task1, task2 y task3 están completados
  console.log('Tareas 1, 2 y 3 ejecutadas en secuencia')
})

// Salida:
// Tareas 1, 2 y 3 ejecutadas en secuencia
```

**¿Por qué usar ejecución secuencial?**
- **Orden garantizado**: Las tareas se ejecutan en el orden correcto
- **Dependencias**: Cuando una tarea depende de otra
- **Control de recursos**: Evita sobrecargar el sistema
- **Simplicidad**: Más fácil de entender y debuggear

**Ejemplo práctico mejorado:**
```javascript
// SISTEMA DE PROCESAMIENTO DE ARCHIVOS SECUENCIAL
function procesarArchivo(nombreArchivo, callback) {
  // Simulamos lectura de archivo
  setTimeout(() => {
    console.log(`📖 Leyendo archivo: ${nombreArchivo}`)
    callback(null, `Contenido de ${nombreArchivo}`)
  }, Math.random() * 1000)
}

function validarContenido(contenido, callback) {
  // Simulamos validación
  setTimeout(() => {
    console.log(`✅ Validando contenido...`)
    const esValido = contenido.length > 0
    callback(null, esValido)
  }, Math.random() * 1000)
}

function transformarContenido(contenido, callback) {
  // Simulamos transformación
  setTimeout(() => {
    console.log(`🔄 Transformando contenido...`)
    const transformado = contenido.toUpperCase()
    callback(null, transformado)
  }, Math.random() * 1000)
}

function guardarArchivo(contenido, callback) {
  // Simulamos guardado
  setTimeout(() => {
    console.log(`💾 Guardando archivo transformado...`)
    callback(null, `Archivo guardado: ${contenido}`)
  }, Math.random() * 1000)
}

// PIPELINE SECUENCIAL
function pipelineProcesamiento(nombreArchivo, callbackFinal) {
  procesarArchivo(nombreArchivo, (error, contenido) => {
    if (error) return callbackFinal(error)
    
    validarContenido(contenido, (error, esValido) => {
      if (error) return callbackFinal(error)
      if (!esValido) return callbackFinal(new Error('Contenido inválido'))
      
      transformarContenido(contenido, (error, transformado) => {
        if (error) return callbackFinal(error)
        
        guardarArchivo(transformado, (error, resultado) => {
          if (error) return callbackFinal(error)
          callbackFinal(null, resultado)
        })
      })
    })
  })
}

// USO DEL PIPELINE
pipelineProcesamiento('documento.txt', (error, resultado) => {
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('🎉 Éxito:', resultado)
  }
})
```

### 2. Patrón de Iteración con Callbacks

Para procesar colecciones de manera asíncrona manteniendo el control.

```javascript
// PATRÓN DE ITERACIÓN CON CALLBACKS
// Procesa elementos de una colección de forma asíncrona

function callbackIterationPattern(items, iterator, callback) {
  let completed = 0
  const hasErrors = false
  
  // Función interna para manejar la finalización de cada iteración
  const iterate = (index) => {
    // Si ya hay errores, no continuamos
    if (hasErrors) return
    
    // Si hemos procesado todos los elementos
    if (index >= items.length) {
      return callback()
    }
    
    // Procesamos el elemento actual
    iterator(items[index], (err) => {
      if (err) {
        hasErrors = true
        return callback(err)
      }
      
      // Incrementamos contador y procesamos el siguiente
      completed++
      iterate(index + 1)
    })
  }
  
  // Iniciamos la iteración desde el primer elemento
  iterate(0)
}

// EJEMPLO DE USO
const archivos = ['archivo1.txt', 'archivo2.txt', 'archivo3.txt']

callbackIterationPattern(
  archivos,
  (archivo, callback) => {
    // Simulamos procesamiento de archivo
    setTimeout(() => {
      console.log(`Procesando: ${archivo}`)
      callback() // Sin error
    }, Math.random() * 1000)
  },
  (err) => {
    if (err) {
      console.error('Error en el procesamiento:', err)
    } else {
      console.log('Todos los archivos procesados')
    }
  }
)
```

**Ejemplo práctico completo:**
```javascript
// SISTEMA DE PROCESAMIENTO DE USUARIOS EN LOTE
class ProcesadorUsuarios {
  constructor() {
    this.usuarios = []
    this.resultados = []
  }
  
  // Agregar usuarios al lote
  agregarUsuario(usuario) {
    this.usuarios.push(usuario)
  }
  
  // Procesar usuarios en secuencia
  procesarLote(callback) {
    if (this.usuarios.length === 0) {
      return callback(null, [])
    }
    
    let index = 0
    const procesarSiguiente = () => {
      if (index >= this.usuarios.length) {
        // Todos procesados
        return callback(null, this.resultados)
      }
      
      const usuario = this.usuarios[index]
      this.procesarUsuario(usuario, (error, resultado) => {
        if (error) {
          return callback(error)
        }
        
        this.resultados.push(resultado)
        index++
        procesarSiguiente()
      })
    }
    
    procesarSiguiente()
  }
  
  // Procesar un usuario individual
  procesarUsuario(usuario, callback) {
    console.log(`🔄 Procesando usuario: ${usuario.nombre}`)
    
    // Simulamos validación
    setTimeout(() => {
      if (!usuario.email || !usuario.email.includes('@')) {
        return callback(new Error(`Email inválido para ${usuario.nombre}`))
      }
      
      // Simulamos procesamiento
      setTimeout(() => {
        const resultado = {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          procesado: true,
          timestamp: new Date().toISOString()
        }
        
        console.log(`✅ Usuario procesado: ${usuario.nombre}`)
        callback(null, resultado)
      }, Math.random() * 500)
    }, Math.random() * 300)
  }
}

// USO DEL SISTEMA
const procesador = new ProcesadorUsuarios()

// Agregamos usuarios al lote
procesador.agregarUsuario({ id: 1, nombre: 'Ana', email: 'ana@email.com' })
procesador.agregarUsuario({ id: 2, nombre: 'Juan', email: 'juan@email.com' })
procesador.agregarUsuario({ id: 3, nombre: 'María', email: 'maria@email.com' })

// Procesamos el lote completo
procesador.procesarLote((error, resultados) => {
  if (error) {
    console.error('❌ Error en el lote:', error.message)
  } else {
    console.log('🎉 Lote procesado exitosamente:', resultados.length, 'usuarios')
    console.log('Resultados:', resultados)
  }
})
```

## Capítulo 5: Patrones de Control de Flujo con Promesas y Async/Await

### 1. Creación de Promesas

Las promesas simplifican el manejo de operaciones asíncronas.

```javascript
// CREACIÓN DE PROMESAS
// Las promesas representan el resultado eventual de una operación asíncrona

function delay(milliseconds) {
  // Retornamos una nueva promesa
  return new Promise((resolve, _reject) => {
    // setTimeout simula una operación asíncrona
    setTimeout(() => {
      // Resolvemos la promesa con el timestamp actual
      resolve(Date.now())
    }, milliseconds)
  })
}

// FUNCIÓN ASÍNCRONA CON ASYNC/AWAIT
async function playingWithDelays() {
  console.log('⏳ Iniciando delays...', Date.now())

  // Esperamos a que se complete el primer delay
  const timeAfterOneSecond = await delay(1000)
  console.log('⏰ Después de 1 segundo:', timeAfterOneSecond)

  // Esperamos a que se complete el segundo delay
  const timeAfterThreeSeconds = await delay(3000)
  console.log('⏰ Después de 3 segundos:', timeAfterThreeSeconds)

  return '✅ Completado'
}

// EJECUTAMOS LA FUNCIÓN ASÍNCRONA
playingWithDelays().then(result => {
  console.log(`🎉 Después de 4 segundos: ${result}`)
})

// Salida:
// ⏳ Iniciando delays... [timestamp]
// ⏰ Después de 1 segundo: [timestamp + 1000ms]
// ⏰ Después de 3 segundos: [timestamp + 4000ms]
// 🎉 Después de 4 segundos: ✅ Completado
```

**¿Por qué usar Promesas?**
- **Mejor legibilidad**: Código más limpio y fácil de entender
- **Manejo de errores**: Try-catch más intuitivo
- **Composición**: Fácil encadenar operaciones
- **Estándar**: Parte de ECMAScript

### 2. Conversión de Callbacks a Promesas (Promisify)

```javascript
// PROMISIFY - CONVERTIR CALLBACKS A PROMESAS
// Útil para modernizar código legacy o APIs basadas en callbacks

const fs = require('fs').promises // Usamos la versión con promesas

// Función que convierte cualquier función con callback a promesa
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // Agregamos el callback como último argumento
      fn(...args, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

// EJEMPLO: Convertir fs.readFile a promesa
const readFilePromise = promisify(require('fs').readFile)

// USO CON PROMESAS
readFilePromise('archivo.txt', 'utf8')
  .then(contenido => {
    console.log('📖 Contenido del archivo:', contenido)
  })
  .catch(error => {
    console.error('❌ Error leyendo archivo:', error.message)
  })

// USO CON ASYNC/AWAIT
async function leerArchivo() {
  try {
    const contenido = await readFilePromise('archivo.txt', 'utf8')
    console.log('📖 Contenido del archivo:', contenido)
    return contenido
  } catch (error) {
    console.error('❌ Error leyendo archivo:', error.message)
    throw error
  }
}
```

**Ejemplo práctico completo:**
```javascript
// SISTEMA DE BASE DE DATOS CON PROMESAS
class BaseDatosSimulada {
  constructor() {
    this.datos = new Map()
    this.contador = 1
  }
  
  // Método con callback (estilo legacy)
  crearUsuario(usuario, callback) {
    setTimeout(() => {
      const id = this.contador++
      const usuarioConId = { ...usuario, id, creado: new Date() }
      this.datos.set(id, usuarioConId)
      callback(null, usuarioConId)
    }, Math.random() * 500)
  }
  
  // Método con callback (estilo legacy)
  obtenerUsuario(id, callback) {
    setTimeout(() => {
      const usuario = this.datos.get(id)
      if (!usuario) {
        return callback(new Error('Usuario no encontrado'))
      }
      callback(null, usuario)
    }, Math.random() * 300)
  }
  
  // Método con callback (estilo legacy)
  actualizarUsuario(id, datos, callback) {
    setTimeout(() => {
      const usuario = this.datos.get(id)
      if (!usuario) {
        return callback(new Error('Usuario no encontrado'))
      }
      
      const usuarioActualizado = { ...usuario, ...datos, actualizado: new Date() }
      this.datos.set(id, usuarioActualizado)
      callback(null, usuarioActualizado)
    }, Math.random() * 400)
  }
}

// PROMISIFY DE LA CLASE COMPLETA
function promisifyClass(instance) {
  const promisified = {}
  
  // Obtenemos todos los métodos de la instancia
  Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
    .filter(name => name !== 'constructor')
    .forEach(methodName => {
      promisified[methodName] = promisify(instance[methodName].bind(instance))
    })
  
  return promisified
}

// USO DEL SISTEMA PROMISIFICADO
const db = new BaseDatosSimulada()
const dbPromise = promisifyClass(db)

// FUNCIÓN ASÍNCRONA QUE USA TODOS LOS MÉTODOS
async function gestionarUsuario() {
  try {
    // Crear usuario
    console.log('🔄 Creando usuario...')
    const usuario = await dbPromise.crearUsuario({
      nombre: 'Carlos',
      email: 'carlos@email.com',
      edad: 30
    })
    console.log('✅ Usuario creado:', usuario)
    
    // Obtener usuario
    console.log('🔄 Obteniendo usuario...')
    const usuarioObtenido = await dbPromise.obtenerUsuario(usuario.id)
    console.log('✅ Usuario obtenido:', usuarioObtenido)
    
    // Actualizar usuario
    console.log('🔄 Actualizando usuario...')
    const usuarioActualizado = await dbPromise.actualizarUsuario(usuario.id, {
      edad: 31,
      activo: true
    })
    console.log('✅ Usuario actualizado:', usuarioActualizado)
    
    return usuarioActualizado
    
  } catch (error) {
    console.error('❌ Error en la gestión:', error.message)
    throw error
  }
}

// EJECUTAMOS LA GESTIÓN
gestionarUsuario()
  .then(resultado => {
    console.log('🎉 Gestión completada:', resultado)
  })
  .catch(error => {
    console.error('💥 Error final:', error.message)
  })
```

### 3. Manejo de Errores con Async/Await

```javascript
// MANEJO DE ERRORES CON ASYNC/AWAIT
// Try-catch es más intuitivo que .catch() en promesas

async function manejoErrores() {
  try {
    console.log('🚀 Iniciando operaciones...')
    
    // Primera operación que puede fallar
    const resultado1 = await operacionRiesgosa(1000)
    console.log('✅ Operación 1 exitosa:', resultado1)
    
    // Segunda operación que puede fallar
    const resultado2 = await operacionRiesgosa(2000)
    console.log('✅ Operación 2 exitosa:', resultado2)
    
    return '🎉 Todas las operaciones completadas'
    
  } catch (error) {
    // Capturamos cualquier error que ocurra
    console.error('❌ Error capturado:', error.message)
    
    // Podemos hacer logging, notificaciones, etc.
    await logError(error)
    
    // Re-lanzamos el error si es necesario
    throw error
  }
}

// FUNCIÓN QUE PUEDE FALLAR
function operacionRiesgosa(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulamos fallo aleatorio
      if (Math.random() < 0.3) {
        reject(new Error(`Operación falló después de ${delay}ms`))
      } else {
        resolve(`Operación exitosa en ${delay}ms`)
      }
    }, delay)
  })
}

// FUNCIÓN DE LOGGING DE ERRORES
async function logError(error) {
  console.log('📝 Registrando error en logs...')
  // Aquí iría la lógica real de logging
  await new Promise(resolve => setTimeout(resolve, 100))
  console.log('📝 Error registrado')
}
```

## Resumen de Patrones de Control de Flujo

### **Callbacks (Capítulo 4)**
- **Ejecución Secuencial**: Para operaciones que dependen entre sí
- **Iteración Controlada**: Para procesar colecciones de forma ordenada
- **Manejo de Errores**: Callback de error como primer parámetro
- **Ventajas**: Control total, compatibilidad con código legacy
- **Desventajas**: Callback hell, difícil de leer

### **Promesas y Async/Await (Capítulo 5)**
- **Creación de Promesas**: new Promise() para operaciones asíncronas
- **Promisify**: Convertir callbacks a promesas
- **Async/Await**: Sintaxis más limpia para promesas
- **Manejo de Errores**: Try-catch más intuitivo
- **Ventajas**: Mejor legibilidad, composición fácil, estándar moderno

### **Cuándo usar cada uno:**
- **Callbacks**: Código legacy, APIs existentes, control granular
- **Promesas**: Nuevo código, composición de operaciones
- **Async/Await**: Código moderno, mejor legibilidad, manejo de errores

---

*Esta es la segunda parte de la guía. Continuaré con los siguientes capítulos sobre streams, patrones de diseño y más.*
