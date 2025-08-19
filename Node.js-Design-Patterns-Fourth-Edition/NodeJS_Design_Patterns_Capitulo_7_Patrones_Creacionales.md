# Node.js Design Patterns - Capítulo 7: Patrones de Diseño Creacionales

## Introducción a los Patrones Creacionales

Los patrones creacionales se enfocan en la creación de objetos, proporcionando flexibilidad y reutilización en el proceso de instanciación. En Node.js, estos patrones son especialmente útiles para crear objetos complejos, manejar configuraciones y gestionar el ciclo de vida de las instancias.

## 1. Factory Pattern (Patrón Fábrica)

### 1.1 Factory Simple (Fábrica Simple)

El patrón Factory más básico que encapsula la creación de objetos.

```javascript
// FACTORY SIMPLE - PATRÓN FÁBRICA BÁSICO
// Encapsula la creación de objetos en una función

import { Image } from './image.js'

// FUNCIÓN FÁBRICA
// Esta función se encarga de crear instancias de Image
function createImage(name) {
  return new Image(name)
}

// INVOCACIÓN DE LA FÁBRICA
const image = createImage('photo.jpeg')

console.log(image)
// Salida: Image { path: 'photo.jpeg' }
```

**Archivo: image.js**
```javascript
// CLASE IMAGE - Objeto que será creado por la fábrica
export class Image {
  constructor(path) {
    this.path = path
  }
}
```

**¿Por qué usar Factory Simple?**
- **Encapsulación**: Oculta la lógica de creación
- **Reutilización**: Fácil de usar en múltiples lugares
- **Mantenibilidad**: Cambios en la creación se hacen en un solo lugar
- **Simplicidad**: Patrón fácil de entender e implementar

**Ejemplo práctico mejorado:**
```javascript
// SISTEMA DE CREACIÓN DE ARCHIVOS MULTIMEDIA
class ArchivoMultimedia {
  constructor(nombre, tipo, ruta) {
    this.nombre = nombre
    this.tipo = tipo
    this.ruta = ruta
    this.fechaCreacion = new Date()
    this.tamaño = 0
  }
  
  obtenerInfo() {
    return {
      nombre: this.nombre,
      tipo: this.tipo,
      ruta: this.ruta,
      fechaCreacion: this.fechaCreacion,
      tamaño: this.tamaño
    }
  }
}

// FÁBRICA PARA DIFERENTES TIPOS DE ARCHIVOS
function crearArchivoMultimedia(nombre, tipo, ruta) {
  // Validaciones básicas
  if (!nombre || !tipo || !ruta) {
    throw new Error('Nombre, tipo y ruta son requeridos')
  }
  
  // Tipos válidos
  const tiposValidos = ['imagen', 'video', 'audio', 'documento']
  if (!tiposValidos.includes(tipo)) {
    throw new Error(`Tipo no válido. Tipos permitidos: ${tiposValidos.join(', ')}`)
  }
  
  // Creamos y retornamos la instancia
  return new ArchivoMultimedia(nombre, tipo, ruta)
}

// USO DE LA FÁBRICA
try {
  const imagen = crearArchivoMultimedia('vacaciones.jpg', 'imagen', '/fotos/')
  const video = crearArchivoMultimedia('presentacion.mp4', 'video', '/videos/')
  
  console.log('Imagen creada:', imagen.obtenerInfo())
  console.log('Video creado:', video.obtenerInfo())
  
} catch (error) {
  console.error('Error creando archivo:', error.message)
}
```

### 1.2 Factory con Clases Dinámicas

Fábrica que puede crear diferentes tipos de objetos basándose en parámetros.

```javascript
// FACTORY CON CLASES DINÁMICAS
// Crea diferentes tipos de objetos según los parámetros

class Logger {
  log(message) {
    console.log(`[LOG] ${message}`)
  }
}

class ErrorLogger {
  log(message) {
    console.error(`[ERROR] ${message}`)
  }
}

class DebugLogger {
  log(message) {
    console.debug(`[DEBUG] ${message}`)
  }
}

// FÁBRICA DINÁMICA
function createLogger(type = 'log') {
  switch (type) {
    case 'error':
      return new ErrorLogger()
    case 'debug':
      return new DebugLogger()
    case 'log':
    default:
      return new Logger()
  }
}

// USO DE LA FÁBRICA DINÁMICA
const loggers = {
  info: createLogger('log'),
  error: createLogger('error'),
  debug: createLogger('debug')
}

loggers.info.log('Aplicación iniciada')
loggers.error.log('Error de conexión')
loggers.debug.log('Variable x = 42')
```

**Ejemplo práctico completo:**
```javascript
// SISTEMA DE LOGGING CON FÁBRICA DINÁMICA
class BaseLogger {
  constructor(nivel, formato = 'texto') {
    this.nivel = nivel
    this.formato = formato
    this.timestamp = new Date()
  }
  
  log(mensaje, datos = {}) {
    const logEntry = {
      timestamp: this.timestamp.toISOString(),
      nivel: this.nivel,
      mensaje,
      datos,
      formato: this.formato
    }
    
    this.escribirLog(logEntry)
  }
  
  escribirLog(entry) {
    // Método base que será sobrescrito
    console.log(JSON.stringify(entry, null, 2))
  }
}

class ConsoleLogger extends BaseLogger {
  constructor(nivel) {
    super(nivel, 'consola')
  }
  
  escribirLog(entry) {
    const color = this.obtenerColor(entry.nivel)
    console.log(`${color}[${entry.nivel.toUpperCase()}]${'\x1b[0m'} ${entry.mensaje}`)
  }
  
  obtenerColor(nivel) {
    const colores = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      debug: '\x1b[35m'    // Magenta
    }
    return colores[nivel] || '\x1b[37m' // White por defecto
  }
}

class FileLogger extends BaseLogger {
  constructor(nivel, archivo) {
    super(nivel, 'archivo')
    this.archivo = archivo
  }
  
  escribirLog(entry) {
    // Aquí iría la lógica para escribir a archivo
    console.log(`📁 [${this.archivo}] ${entry.nivel.toUpperCase()}: ${entry.mensaje}`)
  }
}

class DatabaseLogger extends BaseLogger {
  constructor(nivel, tabla) {
    super(nivel, 'base_datos')
    this.tabla = tabla
  }
  
  escribirLog(entry) {
    // Aquí iría la lógica para escribir a base de datos
    console.log(`🗄️ [${this.tabla}] ${entry.nivel.toUpperCase()}: ${entry.mensaje}`)
  }
}

// FÁBRICA DINÁMICA PARA LOGGERS
function createLogger(tipo, nivel = 'info', config = {}) {
  switch (tipo) {
    case 'consola':
      return new ConsoleLogger(nivel)
    
    case 'archivo':
      return new FileLogger(nivel, config.archivo || 'app.log')
    
    case 'base_datos':
      return new DatabaseLogger(nivel, config.tabla || 'logs')
    
    default:
      throw new Error(`Tipo de logger no soportado: ${tipo}`)
  }
}

// USO DEL SISTEMA DE LOGGING
const loggers = {
  consola: createLogger('consola', 'info'),
  archivo: createLogger('archivo', 'warn', { archivo: 'errores.log' }),
  baseDatos: createLogger('base_datos', 'error', { tabla: 'error_logs' })
}

// Probamos diferentes tipos de logging
loggers.consola.log('Aplicación iniciada correctamente')
loggers.archivo.log('Advertencia: conexión lenta')
loggers.baseDatos.log('Error crítico en base de datos', { 
  codigo: 'DB_CONN_001',
  timestamp: new Date().toISOString()
})
```

### 1.3 Factory con Encapsulación

Fábrica que encapsula completamente la lógica de creación y configuración.

```javascript
// FACTORY CON ENCAPSULACIÓN
// Oculta completamente la implementación interna

class ConfiguracionServidor {
  constructor(config) {
    this.puerto = config.puerto || 3000
    this.host = config.host || 'localhost'
    this.baseDatos = config.baseDatos || 'mongodb://localhost:27017'
    this.secreto = config.secreto || 'secreto_por_defecto'
  }
  
  obtenerConfiguracion() {
    return {
      puerto: this.puerto,
      host: this.host,
      baseDatos: this.baseDatos,
      secreto: this.secreto
    }
  }
}

// FÁBRICA ENCAPSULADA
function createServerConfig(ambiente = 'desarrollo') {
  const configs = {
    desarrollo: {
      puerto: 3000,
      host: 'localhost',
      baseDatos: 'mongodb://localhost:27017/dev_db',
      secreto: 'dev_secret_123'
    },
    produccion: {
      puerto: process.env.PORT || 8080,
      host: process.env.HOST || '0.0.0.0',
      baseDatos: process.env.MONGODB_URI || 'mongodb://prod-server:27017/prod_db',
      secreto: process.env.JWT_SECRET || 'prod_secret_456'
    },
    testing: {
      puerto: 0, // Puerto aleatorio
      host: 'localhost',
      baseDatos: 'mongodb://localhost:27017/test_db',
      secreto: 'test_secret_789'
    }
  }
  
  const config = configs[ambiente]
  if (!config) {
    throw new Error(`Ambiente no válido: ${ambiente}`)
  }
  
  return new ConfiguracionServidor(config)
}

// USO DE LA FÁBRICA ENCAPSULADA
const configDev = createServerConfig('desarrollo')
const configProd = createServerConfig('produccion')

console.log('Configuración desarrollo:', configDev.obtenerConfiguracion())
console.log('Configuración producción:', configProd.obtenerConfiguracion())
```

## 2. Builder Pattern (Patrón Constructor)

### 2.1 Builder Básico

El patrón Builder permite construir objetos complejos paso a paso.

```javascript
// BUILDER PATTERN - CONSTRUCCIÓN PASO A PASO
// Permite construir objetos complejos de manera fluida

class Boat {
  constructor(config) {
    this.hasMotor = Boolean(config.hasMotor)
    this.motorCount = config.motorCount || 0
    this.motorBrand = config.motorBrand || ''
    this.motorModel = config.motorModel || ''
    this.hasSails = Boolean(config.hasSails)
    this.sailsCount = config.sailsCount || 0
    this.sailsMaterial = config.sailsMaterial || ''
    this.sailsColor = config.sailsColor || ''
    this.hullColor = config.hullColor || ''
    this.hasCabin = Boolean(config.hasCabin)
  }
}

export class BoatBuilder {
  // MÉTODO PARA AGREGAR MOTORES
  withMotors(count, brand, model) {
    this.hasMotor = true
    this.motorCount = count
    this.motorBrand = brand
    this.motorModel = model
    return this // Retornamos this para encadenar métodos
  }

  // MÉTODO PARA AGREGAR VELAS
  withSails(count, material, color) {
    this.hasSails = true
    this.sailsCount = count
    this.sailsMaterial = material
    this.sailsColor = color
    return this // Retornamos this para encadenar métodos
  }

  // MÉTODO PARA ESTABLECER COLOR DEL CASCO
  hullColor(color) {
    this.hullColor = color
    return this // Retornamos this para encadenar métodos
  }

  // MÉTODO PARA AGREGAR CABINA
  withCabin() {
    this.hasCabin = true
    return this // Retornamos this para encadenar métodos
  }

  // MÉTODO FINAL PARA CONSTRUIR EL OBJETO
  build() {
    return new Boat({
      hasMotor: this.hasMotor,
      motorCount: this.motorCount,
      motorBrand: this.motorBrand,
      motorModel: this.motorModel,
      hasSails: this.hasSails,
      sailsCount: this.sailsCount,
      sailsMaterial: this.sailsMaterial,
      sailsColor: this.sailsColor,
      hullColor: this.hullColor,
      hasCabin: this.hasCabin,
    })
  }
}
```

**Ejemplo práctico completo:**
```javascript
// SISTEMA DE CONSTRUCCIÓN DE CASAS CON BUILDER
class Casa {
  constructor(config) {
    this.habitaciones = config.habitaciones || []
    this.baños = config.baños || []
    this.cocina = config.cocina || {}
    this.sala = config.sala || {}
    this.garaje = config.garaje || {}
    this.jardin = config.jardin || {}
    this.piscina = config.piscina || false
    this.areaTotal = config.areaTotal || 0
    this.precio = config.precio || 0
  }
  
  obtenerEspecificaciones() {
    return {
      habitaciones: this.habitaciones.length,
      baños: this.baños.length,
      cocina: this.cocina,
      sala: this.sala,
      garaje: this.garaje,
      jardin: this.jardin,
      piscina: this.piscina,
      areaTotal: this.areaTotal,
      precio: this.precio
    }
  }
}

class CasaBuilder {
  constructor() {
    this.reset()
  }
  
  // Reiniciamos el builder
  reset() {
    this.casa = {
      habitaciones: [],
      baños: [],
      cocina: {},
      sala: {},
      garaje: {},
      jardin: {},
      piscina: false,
      areaTotal: 0,
      precio: 0
    }
    return this
  }
  
  // Agregamos habitación
  agregarHabitacion(tipo, area, precio) {
    this.casa.habitaciones.push({
      tipo: tipo, // 'principal', 'secundaria', 'estudio'
      area: area,
      precio: precio
    })
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Agregamos baño
  agregarBaño(tipo, area, precio) {
    this.casa.baños.push({
      tipo: tipo, // 'completo', 'medio baño'
      area: area,
      precio: precio
    })
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Configuramos cocina
  configurarCocina(area, electrodomesticos, precio) {
    this.casa.cocina = {
      area: area,
      electrodomesticos: electrodomesticos,
      precio: precio
    }
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Configuramos sala
  configurarSala(area, muebles, precio) {
    this.casa.sala = {
      area: area,
      muebles: muebles,
      precio: precio
    }
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Agregamos garaje
  agregarGaraje(capacidad, area, precio) {
    this.casa.garaje = {
      capacidad: capacidad, // número de autos
      area: area,
      precio: precio
    }
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Agregamos jardín
  agregarJardin(area, tipo, precio) {
    this.casa.jardin = {
      area: area,
      tipo: tipo, // 'tropical', 'mediterráneo', 'minimalista'
      precio: precio
    }
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Agregamos piscina
  agregarPiscina(area, tipo, precio) {
    this.casa.piscina = {
      area: area,
      tipo: tipo, // 'rectangular', 'ovalada', 'infinito'
      precio: precio
    }
    this.casa.areaTotal += area
    this.casa.precio += precio
    return this
  }
  
  // Construimos la casa
  build() {
    const casa = new Casa(this.casa)
    this.reset() // Reiniciamos para futuras construcciones
    return casa
  }
}

// USO DEL BUILDER
const constructor = new CasaBuilder()

const casaLujosa = constructor
  .agregarHabitacion('principal', 25, 50000)
  .agregarHabitacion('secundaria', 20, 30000)
  .agregarHabitacion('estudio', 15, 25000)
  .agregarBaño('completo', 8, 15000)
  .agregarBaño('completo', 6, 12000)
  .configurarCocina(20, ['refrigerador', 'horno', 'microondas'], 40000)
  .configurarSala(30, ['sofá', 'mesa de centro', 'TV'], 25000)
  .agregarGaraje(2, 40, 30000)
  .agregarJardin(100, 'tropical', 35000)
  .agregarPiscina(50, 'rectangular', 80000)
  .build()

console.log('🏠 Casa lujosa construida:')
console.log(casaLujosa.obtenerEspecificaciones())

// Construimos otra casa más simple
const casaSimple = constructor
  .agregarHabitacion('principal', 20, 30000)
  .agregarHabitacion('secundaria', 15, 20000)
  .agregarBaño('completo', 6, 10000)
  .configurarCocina(15, ['refrigerador', 'horno'], 25000)
  .configurarSala(25, ['sofá', 'mesa'], 15000)
  .build()

console.log('\n🏠 Casa simple construida:')
console.log(casaSimple.obtenerEspecificaciones())
```

### 2.2 Builder para URLs

```javascript
// BUILDER PARA CONSTRUCCIÓN DE URLs
// Permite construir URLs complejas de manera fluida

class URLBuilder {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.params = new Map()
    this.pathSegments = []
    this.fragment = ''
  }
  
  // Agregar segmentos de ruta
  addPath(segment) {
    this.pathSegments.push(segment)
    return this
  }
  
  // Agregar parámetros de query
  addParam(key, value) {
    this.params.set(key, value)
    return this
  }
  
  // Agregar fragmento
  addFragment(fragment) {
    this.fragment = fragment
    return this
  }
  
  // Construir la URL final
  build() {
    let url = this.baseURL
    
    // Agregar segmentos de ruta
    if (this.pathSegments.length > 0) {
      url += '/' + this.pathSegments.join('/')
    }
    
    // Agregar parámetros de query
    if (this.params.size > 0) {
      const queryString = Array.from(this.params.entries())
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
      url += '?' + queryString
    }
    
    // Agregar fragmento
    if (this.fragment) {
      url += '#' + this.fragment
    }
    
    return url
  }
}

// USO DEL BUILDER DE URL
const urlBuilder = new URLBuilder('https://api.ejemplo.com')

const url = urlBuilder
  .addPath('usuarios')
  .addPath('123')
  .addPath('perfil')
  .addParam('incluir', 'datos_personales')
  .addParam('formato', 'json')
  .addFragment('seccion_contacto')
  .build()

console.log('🔗 URL construida:', url)
// Salida: https://api.ejemplo.com/usuarios/123/perfil?incluir=datos_personales&formato=json#seccion_contacto
```

## 3. Singleton Pattern (Patrón Singleton)

### 3.1 Singleton Básico

```javascript
// SINGLETON PATTERN - UNA SOLA INSTANCIA
// Garantiza que una clase tenga solo una instancia

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance
    }
    
    this.connectionString = 'mongodb://localhost:27017'
    this.isConnected = false
    this.connectionCount = 0
    
    DatabaseConnection.instance = this
  }
  
  connect() {
    if (!this.isConnected) {
      this.isConnected = true
      this.connectionCount++
      console.log('🔌 Conectado a la base de datos')
    }
    return this
  }
  
  disconnect() {
    if (this.isConnected) {
      this.isConnected = false
      console.log('🔌 Desconectado de la base de datos')
    }
    return this
  }
  
  getStatus() {
    return {
      isConnected: this.isConnected,
      connectionCount: this.connectionCount,
      connectionString: this.connectionString
    }
  }
}

// USO DEL SINGLETON
const db1 = new DatabaseConnection()
const db2 = new DatabaseConnection()

console.log('¿Son la misma instancia?', db1 === db2) // true

db1.connect()
console.log('Estado DB1:', db1.getStatus())
console.log('Estado DB2:', db2.getStatus()) // Mismo estado
```

### 3.2 Singleton con Dependencias

```javascript
// SINGLETON CON DEPENDENCIAS
// Singleton que maneja dependencias externas

class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance
    }
    
    this.config = new Map()
    this.loaders = new Map()
    this.isLoaded = false
    
    ConfigManager.instance = this
  }
  
  // Registrar un loader para un tipo de configuración
  registerLoader(type, loader) {
    this.loaders.set(type, loader)
    return this
  }
  
  // Cargar configuración
  async loadConfig(type, source) {
    const loader = this.loaders.get(type)
    if (!loader) {
      throw new Error(`Loader no encontrado para tipo: ${type}`)
    }
    
    try {
      const config = await loader(source)
      this.config.set(type, config)
      this.isLoaded = true
      console.log(`✅ Configuración ${type} cargada desde ${source}`)
      return config
    } catch (error) {
      console.error(`❌ Error cargando configuración ${type}:`, error.message)
      throw error
    }
  }
  
  // Obtener configuración
  getConfig(type) {
    return this.config.get(type)
  }
  
  // Verificar si está cargado
  isConfigLoaded() {
    return this.isLoaded
  }
}

// LOADERS PARA DIFERENTES TIPOS DE CONFIGURACIÓN
const fileLoader = async (filePath) => {
  // Simulamos lectura de archivo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        puerto: 3000,
        host: 'localhost',
        entorno: 'desarrollo'
      })
    }, 100)
  })
}

const envLoader = async () => {
  // Simulamos carga de variables de entorno
  return {
    puerto: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
    entorno: process.env.NODE_ENV || 'produccion'
  }
}

// USO DEL SINGLETON CON DEPENDENCIAS
const configManager = new ConfigManager()

// Registramos loaders
configManager
  .registerLoader('file', fileLoader)
  .registerLoader('env', envLoader)

// Cargamos configuraciones
async function cargarConfiguraciones() {
  try {
    await configManager.loadConfig('file', './config.json')
    await configManager.loadConfig('env')
    
    console.log('📁 Configuración de archivo:', configManager.getConfig('file'))
    console.log('🌍 Configuración de entorno:', configManager.getConfig('env'))
    console.log('✅ Todas las configuraciones cargadas')
    
  } catch (error) {
    console.error('💥 Error cargando configuraciones:', error.message)
  }
}

cargarConfiguraciones()
```

## 4. Dependency Injection (Inyección de Dependencias)

### 4.1 Inyección Básica

```javascript
// DEPENDENCY INJECTION - INYECCIÓN DE DEPENDENCIAS
// Permite inyectar dependencias desde el exterior

class EmailService {
  constructor(transporter) {
    this.transporter = transporter
  }
  
  async sendEmail(to, subject, body) {
    return await this.transporter.send({
      to,
      subject,
      body
    })
  }
}

class SMTPTransporter {
  async send(emailData) {
    console.log(`📧 Email enviado vía SMTP a ${emailData.to}`)
    return { success: true, method: 'SMTP' }
  }
}

class SendGridTransporter {
  async send(emailData) {
    console.log(`📧 Email enviado vía SendGrid a ${emailData.to}`)
    return { success: true, method: 'SendGrid' }
  }
}

// SERVICIO DE NOTIFICACIONES QUE USA EMAIL SERVICE
class NotificationService {
  constructor(emailService) {
    this.emailService = emailService
  }
  
  async notifyUser(userId, message) {
    // Lógica para obtener email del usuario
    const userEmail = `usuario${userId}@ejemplo.com`
    
    return await this.emailService.sendEmail(
      userEmail,
      'Notificación importante',
      message
    )
  }
}

// USO CON INYECCIÓN DE DEPENDENCIAS
const smtpTransporter = new SMTPTransporter()
const sendGridTransporter = new SendGridTransporter()

const emailServiceSMTP = new EmailService(smtpTransporter)
const emailServiceSendGrid = new EmailService(sendGridTransporter)

const notificationServiceSMTP = new NotificationService(emailServiceSMTP)
const notificationServiceSendGrid = new NotificationService(emailServiceSendGrid)

// Probamos ambos servicios
async function probarServicios() {
  console.log('🔧 Probando con SMTP:')
  await notificationServiceSMTP.notifyUser(1, 'Tu cuenta ha sido activada')
  
  console.log('\n🔧 Probando con SendGrid:')
  await notificationServiceSendGrid.notifyUser(2, 'Bienvenido a nuestra plataforma')
}

probarServicios()
```

## Resumen de Patrones Creacionales

### **Factory Pattern:**
- **Propósito**: Encapsular la creación de objetos
- **Cuándo usar**: Cuando la creación es compleja o variable
- **Ventajas**: Encapsulación, reutilización, mantenibilidad
- **Tipos**: Simple, dinámica, encapsulada

### **Builder Pattern:**
- **Propósito**: Construir objetos complejos paso a paso
- **Cuándo usar**: Objetos con muchos parámetros opcionales
- **Ventajas**: Legibilidad, flexibilidad, validación
- **Características**: Métodos encadenables, método build()

### **Singleton Pattern:**
- **Propósito**: Garantizar una sola instancia de una clase
- **Cuándo usar**: Recursos compartidos, configuraciones globales
- **Ventajas**: Control de instancias, acceso global
- **Consideraciones**: Testing, acoplamiento

### **Dependency Injection:**
- **Propósito**: Inyectar dependencias desde el exterior
- **Cuándo usar**: Para desacoplar componentes
- **Ventajas**: Testabilidad, flexibilidad, mantenibilidad
- **Tipos**: Constructor, setter, método

### **Cuándo usar cada patrón:**
- **Factory**: Creación simple o compleja de objetos
- **Builder**: Objetos con muchos parámetros opcionales
- **Singleton**: Recursos que deben ser únicos
- **DI**: Para desacoplar y hacer testeable el código

---

*Esta es la cuarta parte de la guía sobre patrones creacionales. Continuaré con los siguientes capítulos sobre patrones estructurales y comportamentales.*
