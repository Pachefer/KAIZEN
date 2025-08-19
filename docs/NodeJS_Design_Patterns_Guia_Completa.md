# Guía Completa de Node.js Design Patterns - Traducida y Comentada

## Capítulo 2: El Sistema de Módulos

### 1. Patrón del Módulo Revelador (Revealing Module Pattern)

Este patrón permite encapsular funcionalidad privada y exponer solo lo que queremos hacer público.

```javascript
// PATRÓN DEL MÓDULO REVELADOR
// Este patrón encapsula variables y funciones privadas, exponiendo solo las públicas
const myModule = (() => {
  // FUNCIONES PRIVADAS - Solo accesibles dentro del módulo
  const privateFoo = () => {} // Función privada vacía
  const privateBar = [] // Array privado vacío

  // Mostramos las funciones privadas (solo para demostración)
  console.log('Inside:', privateFoo, privateBar)

  // OBJETO EXPORTADO - Solo esto será accesible desde fuera
  const exported = {
    publicFoo: () => {}, // Función pública
    publicBar: () => {}, // Otra función pública
  }

  // RETORNAMOS solo lo que queremos hacer público
  return exported
})() // Los paréntesis al final ejecutan la función inmediatamente (IIFE)

// INTENTAMOS acceder a las funciones privadas (serán undefined)
console.log('Outside:', myModule.privateFoo, myModule.privateBar)
// Solo podemos acceder a las funciones públicas
console.log('Module:', myModule)
```

**¿Por qué usar este patrón?**
- **Encapsulación**: Oculta implementación interna
- **Control de acceso**: Solo expone lo necesario
- **Evita contaminación global**: No hay variables globales
- **Mantenibilidad**: Fácil de modificar sin afectar código externo

**Ejemplo práctico mejorado:**
```javascript
// MÓDULO DE CALCULADORA
const calculadora = (() => {
  // FUNCIONES PRIVADAS
  const validarNumero = (num) => typeof num === 'number' && !isNaN(num)
  
  const redondear = (num) => Math.round(num * 100) / 100
  
  // FUNCIONES PÚBLICAS
  const sumar = (a, b) => {
    if (!validarNumero(a) || !validarNumero(b)) {
      throw new Error('Ambos parámetros deben ser números')
    }
    return redondear(a + b)
  }
  
  const multiplicar = (a, b) => {
    if (!validarNumero(a) || !validarNumero(b)) {
      throw new Error('Ambos parámetros deben ser números')
    }
    return redondear(a * b)
  }
  
  // Solo exponemos las funciones públicas
  return { sumar, multiplicar }
})()

// Uso del módulo
console.log(calculadora.sumar(5.123, 3.456)) // 8.58
console.log(calculadora.multiplicar(2, 3)) // 6
// console.log(calculadora.validarNumero(5)) // Error: función privada
```

### 2. Sintaxis de Módulos ES6 (ESM)

Los módulos ES6 son la forma moderna y estándar de trabajar con módulos en JavaScript.

#### Archivo: logger.js (Módulo exportador)

```javascript
// EXPORTACIÓN DE FUNCIÓN
// Exportamos una función simple para logging
export function log(message) {
  console.log(message)
}

// EXPORTACIÓN DE CONSTANTE
// Exportamos una constante con el nivel por defecto
export const DEFAULT_LEVEL = 'info'

// EXPORTACIÓN DE OBJETO
// Exportamos un objeto con niveles de logging
export const LEVELS = {
  error: 0,    // Nivel más bajo (más importante)
  debug: 1,    // Nivel de depuración
  warn: 2,     // Nivel de advertencia
  data: 3,     // Nivel de datos
  info: 4,     // Nivel de información
  verbose: 5,  // Nivel más alto (menos importante)
}

// EXPORTACIÓN DE CLASE
// Exportamos una clase Logger completa
export class Logger {
  constructor(name) {
    this.name = name // Nombre del logger
  }

  // Método para hacer logging con prefijo del nombre
  log(message) {
    console.log(`[${this.name}] ${message}`)
  }
}
```

#### Archivo: main1.js (Importación con namespace)

```javascript
// IMPORTACIÓN CON NAMESPACE
// Importamos todo el módulo bajo un alias

// biome-ignore lint/style/noNamespaceImport: demostrando sintaxis de importación con namespace
import * as loggerModule from './logger.js'

// Mostramos todo el módulo importado
console.log(loggerModule)
// Resultado: { log: [Function], DEFAULT_LEVEL: 'info', LEVELS: {...}, Logger: [class Logger] }
```

**Ventajas de ESM:**
- **Sintaxis estándar**: Es parte de la especificación ECMAScript
- **Mejor tree-shaking**: Permite eliminar código no usado
- **Importaciones estáticas**: Se resuelven en tiempo de compilación
- **Mejor rendimiento**: Más eficiente que CommonJS

**Ejemplo práctico de uso:**
```javascript
// main.js - Uso completo del módulo logger
import { log, DEFAULT_LEVEL, LEVELS, Logger } from './logger.js'

// Usar función exportada
log('Mensaje de prueba')

// Usar constante exportada
console.log('Nivel por defecto:', DEFAULT_LEVEL)

// Usar objeto exportado
console.log('Niveles disponibles:', LEVELS)

// Usar clase exportada
const miLogger = new Logger('MiApp')
miLogger.log('Aplicación iniciada')

// Usar niveles para logging condicional
function logSegunNivel(mensaje, nivel) {
  if (nivel <= LEVELS.info) {
    miLogger.log(mensaje)
  }
}

logSegunNivel('Información importante', LEVELS.info)
logSegunNivel('Debug detallado', LEVELS.debug) // No se mostrará
```

### 3. Patrones de Callbacks y Eventos

#### 3.1 Continuation Passing Style (CPS) Síncrono

```javascript
// ESTILO DE PASO DE CONTINUACIÓN SÍNCRONO
// La función recibe un callback que se ejecuta con el resultado

function addCps(a, b, callback) {
  // Ejecutamos el callback inmediatamente con el resultado
  callback(a + b)
}

console.log('before') // Se ejecuta primero
addCps(1, 2, result => console.log(`Result: ${result}`)) // Se ejecuta segundo
console.log('after') // Se ejecuta tercero

// Salida:
// before
// Result: 3
// after
```

**¿Qué es CPS?**
- **Continuation Passing Style**: Patrón donde pasamos una función callback
- **Flujo de control**: El callback determina qué pasa después
- **Síncrono vs Asíncrono**: Puede ser inmediato o diferido

**Ejemplo práctico mejorado:**
```javascript
// SISTEMA DE VALIDACIÓN CON CPS
function validarUsuario(usuario, callback) {
  const errores = []
  
  // Validaciones síncronas
  if (!usuario.nombre || usuario.nombre.length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres')
  }
  
  if (!usuario.email || !usuario.email.includes('@')) {
    errores.push('Email inválido')
  }
  
  if (usuario.edad < 18) {
    errores.push('Debe ser mayor de edad')
  }
  
  // Ejecutamos el callback con el resultado
  callback(errores.length === 0, errores)
}

// Uso del patrón CPS
validarUsuario({
  nombre: 'Juan',
  email: 'juan@email.com',
  edad: 25
}, (esValido, errores) => {
  if (esValido) {
    console.log('Usuario válido')
  } else {
    console.log('Errores de validación:', errores)
  }
})
```

#### 3.2 EventEmitter - Sistema de Eventos

```javascript
// SISTEMA DE EVENTOS CON EVENTEMITTER
import { EventEmitter } from 'events'

// Creamos una instancia de EventEmitter
const miEventEmitter = new EventEmitter()

// REGISTRAMOS LISTENERS (escuchadores de eventos)
miEventEmitter.on('usuario:creado', (usuario) => {
  console.log('Usuario creado:', usuario.nombre)
})

miEventEmitter.on('usuario:eliminado', (id) => {
  console.log('Usuario eliminado con ID:', id)
})

// EMITIMOS EVENTOS
miEventEmitter.emit('usuario:creado', { id: 1, nombre: 'Ana' })
miEventEmitter.emit('usuario:eliminado', 1)

// Salida:
// Usuario creado: Ana
// Usuario eliminado con ID: 1
```

**Ventajas de EventEmitter:**
- **Desacoplamiento**: Los componentes no necesitan conocerse
- **Escalabilidad**: Fácil agregar/remover listeners
- **Flexibilidad**: Múltiples listeners por evento
- **Patrón estándar**: Ampliamente usado en Node.js

**Ejemplo práctico completo:**
```javascript
// SISTEMA DE NOTIFICACIONES CON EVENTEMITTER
import { EventEmitter } from 'events'

class SistemaNotificaciones extends EventEmitter {
  constructor() {
    super()
    this.usuarios = new Map()
  }
  
  // Método para registrar usuario
  registrarUsuario(id, nombre, email) {
    const usuario = { id, nombre, email, activo: true }
    this.usuarios.set(id, usuario)
    
    // Emitimos evento de usuario registrado
    this.emit('usuario:registrado', usuario)
    
    return usuario
  }
  
  // Método para enviar notificación
  enviarNotificacion(usuarioId, mensaje) {
    const usuario = this.usuarios.get(usuarioId)
    if (usuario && usuario.activo) {
      // Emitimos evento de notificación enviada
      this.emit('notificacion:enviada', { usuario, mensaje })
      
      // Emitimos evento específico del usuario
      this.emit(`usuario:${usuarioId}:notificacion`, mensaje)
    }
  }
  
  // Método para desactivar usuario
  desactivarUsuario(id) {
    const usuario = this.usuarios.get(id)
    if (usuario) {
      usuario.activo = false
      this.emit('usuario:desactivado', usuario)
    }
  }
}

// CREAMOS INSTANCIA
const notificaciones = new SistemaNotificaciones()

// REGISTRAMOS LISTENERS
notificaciones.on('usuario:registrado', (usuario) => {
  console.log(`🎉 Usuario ${usuario.nombre} se ha registrado`)
})

notificaciones.on('notificacion:enviada', ({ usuario, mensaje }) => {
  console.log(`📧 Notificación enviada a ${usuario.nombre}: ${mensaje}`)
})

notificaciones.on('usuario:desactivado', (usuario) => {
  console.log(`❌ Usuario ${usuario.nombre} ha sido desactivado`)
})

// USO DEL SISTEMA
const usuario1 = notificaciones.registrarUsuario(1, 'María', 'maria@email.com')
notificaciones.enviarNotificacion(1, '¡Bienvenida a nuestra plataforma!')
notificaciones.desactivarUsuario(1)

// Salida:
// 🎉 Usuario María se ha registrado
// 📧 Notificación enviada a María: ¡Bienvenida a nuestra plataforma!
// ❌ Usuario María ha sido desactivado
```

## Resumen de Patrones del Capítulo 2

### 1. **Patrón del Módulo Revelador**
- **Propósito**: Encapsular funcionalidad privada
- **Cuándo usar**: Cuando quieres controlar qué se expone
- **Ventajas**: Encapsulación, control de acceso, mantenibilidad

### 2. **Módulos ES6 (ESM)**
- **Propósito**: Sistema de módulos estándar moderno
- **Cuándo usar**: En proyectos nuevos o cuando quieres tree-shaking
- **Ventajas**: Sintaxis estándar, mejor rendimiento, tree-shaking

### 3. **Patrón CPS (Continuation Passing Style)**
- **Propósito**: Controlar el flujo de ejecución con callbacks
- **Cuándo usar**: Para operaciones que necesitan continuar en otro lugar
- **Ventajas**: Control del flujo, flexibilidad, desacoplamiento

### 4. **EventEmitter**
- **Propósito**: Sistema de eventos desacoplado
- **Cuándo usar**: Cuando necesitas comunicación entre componentes
- **Ventajas**: Desacoplamiento, escalabilidad, patrón estándar

---

*Esta es la primera parte de la guía. Continuaré con los siguientes capítulos en archivos separados para mantener la claridad y facilitar el aprendizaje.*
