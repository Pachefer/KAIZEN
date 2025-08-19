# Node.js Design Patterns - Capítulo 6: Programando con Streams

## Introducción a Streams

Los streams son una de las características más poderosas de Node.js para el procesamiento de datos. Permiten procesar archivos grandes, datos en tiempo real y crear pipelines de transformación de manera eficiente.

## 1. Buffers vs Streams - Comparación de Rendimiento

### 1.1 Compresión con Buffer (Enfoque Tradicional)

```javascript
// COMPRESIÓN CON BUFFER - ENFOQUE TRADICIONAL
// Lee todo el archivo en memoria, lo comprime y luego lo escribe

import { readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { gzip } from 'node:zlib'

// Convertimos la función gzip basada en callbacks a promesa
const gzipPromise = promisify(gzip)

const filename = process.argv[2]

// LECTURA COMPLETA DEL ARCHIVO EN MEMORIA
const data = await readFile(filename)
console.log(`📖 Archivo leído: ${data.length} bytes en memoria`)

// COMPRESIÓN DE TODO EL CONTENIDO
const gzippedData = await gzipPromise(data)
console.log(`🗜️ Datos comprimidos: ${gzippedData.length} bytes`)

// ESCRITURA COMPLETA DEL ARCHIVO COMPRIMIDO
await writeFile(`${filename}.gz`, gzippedData)

console.log('✅ Archivo comprimido exitosamente con buffer')
```

**Características del enfoque con Buffer:**
- **Memoria**: Carga todo el archivo en memoria
- **Velocidad**: Más rápido para archivos pequeños
- **Escalabilidad**: No escala bien con archivos grandes
- **Uso de memoria**: Puede causar problemas con archivos muy grandes

### 1.2 Compresión con Streams (Enfoque Moderno)

```javascript
// COMPRESIÓN CON STREAMS - ENFOQUE MODERNO
// Procesa el archivo en chunks pequeños, sin cargar todo en memoria

import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'

const filename = process.argv[2]

// PIPELINE DE STREAMS
createReadStream(filename)           // Stream de lectura
  .pipe(createGzip())               // Stream de compresión
  .pipe(createWriteStream(`${filename}.gz`)) // Stream de escritura
  .on('finish', () => console.log('✅ Archivo comprimido exitosamente con streams'))

// El archivo se procesa chunk por chunk, no todo en memoria
```

**Ventajas del enfoque con Streams:**
- **Memoria**: Solo mantiene chunks pequeños en memoria
- **Escalabilidad**: Funciona igual de bien con archivos de cualquier tamaño
- **Eficiencia**: Mejor uso de recursos del sistema
- **Tiempo real**: Puede empezar a procesar antes de leer todo el archivo

## 2. Tipos de Streams

### 2.1 Readable Streams (Streams de Lectura)

Los streams de lectura son fuentes de datos que pueden ser consumidos.

#### 2.1.1 Stream de Lectura No Flowing (Modo Pausado)

```javascript
// STREAM DE LECTURA NO FLOWING (MODO PAUSADO)
// Los datos se leen manualmente usando .read()

import { createReadStream } from 'node:fs'

const readStream = createReadStream('archivo.txt', {
  highWaterMark: 64, // Tamaño del buffer interno
  encoding: 'utf8'    // Codificación del archivo
})

// MODO PAUSADO - Controlamos cuándo leer
readStream.on('readable', () => {
  let chunk
  // Leemos chunks hasta que no haya más datos
  while ((chunk = readStream.read()) !== null) {
    console.log(`📖 Chunk leído (${chunk.length} bytes):`, chunk)
  }
})

readStream.on('end', () => {
  console.log('🏁 Fin de la lectura del archivo')
})

readStream.on('error', (error) => {
  console.error('❌ Error en la lectura:', error.message)
})
```

#### 2.1.2 Stream de Lectura Flowing (Modo Fluyente)

```javascript
// STREAM DE LECTURA FLOWING (MODO FLUYENTE)
// Los datos fluyen automáticamente cuando están disponibles

import { createReadStream } from 'node:fs'

const readStream = createReadStream('archivo.txt', {
  highWaterMark: 64,
  encoding: 'utf8'
})

// MODO FLUYENTE - Los datos llegan automáticamente
readStream.on('data', (chunk) => {
  console.log(`📖 Chunk recibido (${chunk.length} bytes):`, chunk)
})

readStream.on('end', () => {
  console.log('🏁 Fin de la lectura del archivo')
})

readStream.on('error', (error) => {
  console.error('❌ Error en la lectura:', error.message)
})

// También podemos usar async iterators (más moderno)
async function procesarArchivo() {
  try {
    for await (const chunk of readStream) {
      console.log(`📖 Chunk procesado (${chunk.length} bytes):`, chunk)
    }
    console.log('🏁 Archivo procesado completamente')
  } catch (error) {
    console.error('❌ Error procesando archivo:', error.message)
  }
}
```

### 2.2 Writable Streams (Streams de Escritura)

Los streams de escritura reciben datos y los escriben en algún destino.

```javascript
// STREAM DE ESCRITURA PERSONALIZADO
import { Writable } from 'node:stream'

class ContadorStream extends Writable {
  constructor(options = {}) {
    super(options)
    this.contador = 0
    this.bytesEscritos = 0
  }
  
  // Método que se llama para cada chunk de datos
  _write(chunk, encoding, callback) {
    this.contador++
    this.bytesEscritos += chunk.length
    
    console.log(`📝 Chunk ${this.contador} escrito:`, {
      contenido: chunk.toString(),
      tamaño: chunk.length,
      totalBytes: this.bytesEscritos
    })
    
    // Llamamos al callback para indicar que el chunk fue procesado
    callback()
  }
  
  // Método que se llama cuando se cierra el stream
  _final(callback) {
    console.log(`🏁 Stream finalizado. Total: ${this.contador} chunks, ${this.bytesEscritos} bytes`)
    callback()
  }
}

// USO DEL STREAM DE ESCRITURA
const contadorStream = new ContadorStream()

// Escribimos algunos datos
contadorStream.write('Hola')
contadorStream.write(' Mundo')
contadorStream.write('!')

// Cerramos el stream
contadorStream.end()
```

### 2.3 Transform Streams (Streams de Transformación)

Los streams de transformación modifican los datos mientras fluyen.

```javascript
// STREAM DE TRANSFORMACIÓN - REEMPLAZAR TEXTO
import { Transform } from 'node:stream'

class ReemplazarStream extends Transform {
  constructor(buscar, reemplazar, options = {}) {
    super(options)
    this.buscar = buscar
    this.reemplazar = reemplazar
    this.buffer = ''
  }
  
  // Transformamos cada chunk
  _transform(chunk, encoding, callback) {
    // Convertimos el chunk a string y lo agregamos al buffer
    this.buffer += chunk.toString()
    
    // Buscamos y reemplazamos en el buffer
    const resultado = this.buffer.replace(new RegExp(this.buscar, 'g'), this.reemplazar)
    
    // Enviamos el resultado transformado
    this.push(resultado)
    
    // Limpiamos el buffer
    this.buffer = ''
    
    callback()
  }
  
  // Procesamos cualquier dato restante en el buffer
  _flush(callback) {
    if (this.buffer.length > 0) {
      const resultado = this.buffer.replace(new RegExp(this.buscar, 'g'), this.reemplazar)
      this.push(resultado)
    }
    callback()
  }
}

// USO DEL STREAM DE TRANSFORMACIÓN
const reemplazarStream = new ReemplazarStream('mundo', 'Node.js')

// Creamos un pipeline de transformación
process.stdin
  .pipe(reemplazarStream)
  .pipe(process.stdout)

console.log('Escribe texto (Ctrl+D para terminar):')
```

### 2.4 Passthrough Streams (Streams de Paso)

Los streams de paso permiten monitorear y modificar datos sin alterar el flujo.

```javascript
// STREAM DE PASO CON MONITOREO
import { PassThrough } from 'node:stream'

class MonitoreoStream extends PassThrough {
  constructor(nombre, options = {}) {
    super(options)
    this.nombre = nombre
    this.bytesProcesados = 0
    this.chunksProcesados = 0
  }
  
  // Interceptamos datos que pasan por el stream
  _transform(chunk, encoding, callback) {
    this.bytesProcesados += chunk.length
    this.chunksProcesados++
    
    console.log(`🔍 [${this.nombre}] Chunk ${this.chunksProcesados}:`, {
      tamaño: chunk.length,
      totalBytes: this.bytesProcesados,
      contenido: chunk.toString().substring(0, 50) + '...'
    })
    
    // Pasamos el chunk sin modificar
    this.push(chunk)
    callback()
  }
}

// USO DEL STREAM DE MONITOREO
const monitoreoStream = new MonitoreoStream('Monitor')

// Pipeline con monitoreo
createReadStream('archivo.txt')
  .pipe(monitoreoStream)
  .pipe(createWriteStream('archivo_copia.txt'))
```

## 3. Creación de Streams Personalizados

### 3.1 Stream de Lectura Personalizado

```javascript
// STREAM DE LECTURA PERSONALIZADO - GENERADOR DE DATOS ALEATORIOS
import { Readable } from 'node:stream'

export class RandomStream extends Readable {
  constructor(options = {}) {
    super(options)
    this.emittedBytes = 0
    this.chunkCount = 0
  }

  // Método que se llama cuando se necesita más datos
  _read(size) {
    // Generamos un string aleatorio del tamaño solicitado
    const chunk = this.generateRandomString(size)
    
    // Enviamos el chunk al stream
    this.push(chunk, 'utf8')
    
    // Actualizamos contadores
    this.emittedBytes += chunk.length
    this.chunkCount++
    
    // 5% de probabilidad de terminar el stream
    if (Math.random() < 0.05) {
      console.log(`🎲 Stream terminado después de ${this.chunkCount} chunks`)
      this.push(null) // Señal de fin del stream
    }
  }
  
  // Generador de strings aleatorios
  generateRandomString(length) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let resultado = ''
    for (let i = 0; i < length; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return resultado
  }
}

// USO DEL STREAM PERSONALIZADO
const randomStream = new RandomStream()

randomStream
  .on('data', chunk => {
    console.log(`📖 Chunk recibido (${chunk.length} bytes): ${chunk.toString()}`)
  })
  .on('end', () => {
    console.log(`🏁 Produjo ${randomStream.emittedBytes} bytes de datos aleatorios`)
  })
  .on('error', error => {
    console.error('❌ Error en el stream:', error.message)
  })
```

### 3.2 Stream de Escritura Personalizado

```javascript
// STREAM DE ESCRITURA PERSONALIZADO - ESCRITURA A ARCHIVO CON LOGGING
import { Writable } from 'node:stream'
import { createWriteStream } from 'node:fs'

class ArchivoLogStream extends Writable {
  constructor(nombreArchivo, options = {}) {
    super(options)
    this.nombreArchivo = nombreArchivo
    this.writeStream = createWriteStream(nombreArchivo)
    this.contador = 0
    this.totalBytes = 0
  }
  
  // Escribimos cada chunk
  _write(chunk, encoding, callback) {
    this.contador++
    this.totalBytes += chunk.length
    
    // Log del chunk
    console.log(`📝 [${this.nombreArchivo}] Chunk ${this.contador}:`, {
      contenido: chunk.toString(),
      tamaño: chunk.length,
      totalBytes: this.totalBytes
    })
    
    // Escribimos al archivo
    this.writeStream.write(chunk, encoding, (error) => {
      if (error) {
        callback(error)
      } else {
        callback()
      }
    })
  }
  
  // Finalizamos el stream
  _final(callback) {
    console.log(`🏁 [${this.nombreArchivo}] Stream finalizado:`, {
      chunks: this.contador,
      totalBytes: this.totalBytes
    })
    
    this.writeStream.end(callback)
  }
}

// USO DEL STREAM DE ESCRITURA PERSONALIZADO
const archivoStream = new ArchivoLogStream('datos.log')

// Escribimos algunos datos
archivoStream.write('Primera línea de datos\n')
archivoStream.write('Segunda línea de datos\n')
archivoStream.write('Tercera línea de datos\n')

// Cerramos el stream
archivoStream.end()
```

## 4. Patrones de Conectividad de Streams

### 4.1 Conectando Streams con Pipes

```javascript
// CONECTANDO STREAMS USANDO PIPES
// Los pipes crean un flujo de datos entre streams

import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'
import { createHash } from 'node:crypto'

// PIPELINE COMPLEJO DE TRANSFORMACIÓN
createReadStream('archivo.txt')
  .pipe(createHash('sha256'))        // Calcula hash
  .pipe(createGzip())                // Comprime
  .pipe(createWriteStream('archivo.txt.gz'))
  .on('finish', () => {
    console.log('✅ Pipeline completado: archivo comprimido y con hash')
  })
  .on('error', (error) => {
    console.error('❌ Error en el pipeline:', error.message)
  })
```

### 4.2 Pipeline Helper (Función de Ayuda)

```javascript
// PIPELINE HELPER - MANEJO AUTOMÁTICO DE ERRORES
import { pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'

async function comprimirArchivo(entrada, salida) {
  try {
    await pipeline(
      createReadStream(entrada),
      createGzip(),
      createWriteStream(salida)
    )
    console.log(`✅ Archivo ${entrada} comprimido como ${salida}`)
  } catch (error) {
    console.error(`❌ Error comprimiendo archivo:`, error.message)
    throw error
  }
}

// USO DEL PIPELINE HELPER
comprimirArchivo('documento.txt', 'documento.txt.gz')
  .then(() => console.log('🎉 Compresión completada'))
  .catch(error => console.error('💥 Error final:', error.message))
```

## 5. Patrones de Ejecución con Streams

### 5.1 Ejecución Secuencial

```javascript
// EJECUCIÓN SECUENCIAL CON STREAMS
// Los streams se procesan uno después de otro

import { Transform } from 'node:stream'

class ProcesadorSecuencial extends Transform {
  constructor() {
    super({ objectMode: true })
    this.procesados = 0
  }
  
  _transform(item, encoding, callback) {
    // Simulamos procesamiento secuencial
    setTimeout(() => {
      const procesado = {
        ...item,
        procesado: true,
        orden: ++this.procesados,
        timestamp: new Date().toISOString()
      }
      
      console.log(`🔄 Procesando item ${procesado.orden}:`, item.nombre)
      this.push(procesado)
      callback()
    }, Math.random() * 1000)
  }
}

// USO DEL PROCESADOR SECUENCIAL
const procesador = new ProcesadorSecuencial()

// Creamos datos de prueba
const datos = [
  { id: 1, nombre: 'Item A' },
  { id: 2, nombre: 'Item B' },
  { id: 3, nombre: 'Item C' }
]

// Pipeline de procesamiento secuencial
const { Readable } = require('stream')
Readable.from(datos)
  .pipe(procesador)
  .on('data', (item) => {
    console.log(`✅ Item procesado:`, item)
  })
  .on('end', () => {
    console.log('🏁 Todos los items procesados secuencialmente')
  })
```

### 5.2 Ejecución Concurrente Limitada

```javascript
// EJECUCIÓN CONCURRENTE LIMITADA CON STREAMS
// Procesa múltiples items en paralelo, pero con límite de concurrencia

import { Transform } from 'node:stream'

class ProcesadorConcurrente extends Transform {
  constructor(concurrencia = 3) {
    super({ objectMode: true })
    this.concurrencia = concurrencia
    this.procesando = 0
    this.cola = []
  }
  
  _transform(item, encoding, callback) {
    // Si no hemos alcanzado el límite de concurrencia
    if (this.procesando < this.concurrencia) {
      this.procesarItem(item, callback)
    } else {
      // Agregamos a la cola
      this.cola.push({ item, callback })
    }
  }
  
  procesarItem(item, callback) {
    this.procesando++
    
    console.log(`🚀 Iniciando procesamiento de: ${item.nombre} (${this.procesando} activos)`)
    
    // Simulamos procesamiento asíncrono
    setTimeout(() => {
      const resultado = {
        ...item,
        procesado: true,
        timestamp: new Date().toISOString()
      }
      
      this.procesando--
      console.log(`✅ Completado: ${item.nombre} (${this.procesando} activos)`)
      
      this.push(resultado)
      callback()
      
      // Procesamos siguiente item de la cola si hay
      if (this.cola.length > 0) {
        const { item: nextItem, callback: nextCallback } = this.cola.shift()
        this.procesarItem(nextItem, nextCallback)
      }
    }, Math.random() * 2000)
  }
}

// USO DEL PROCESADOR CONCURRENTE
const procesadorConcurrente = new ProcesadorConcurrente(2) // Máximo 2 en paralelo

const datos = [
  { id: 1, nombre: 'Tarea A' },
  { id: 2, nombre: 'Tarea B' },
  { id: 3, nombre: 'Tarea C' },
  { id: 4, nombre: 'Tarea D' },
  { id: 5, nombre: 'Tarea E' }
]

Readable.from(datos)
  .pipe(procesadorConcurrente)
  .on('data', (item) => {
    console.log(`📊 Resultado recibido:`, item)
  })
  .on('end', () => {
    console.log('🏁 Todas las tareas procesadas con concurrencia limitada')
  })
```

## 6. Streams Web y Consumidores

### 6.1 Web Streams (Streams del Navegador)

```javascript
// WEB STREAMS - COMPATIBLES CON NAVEGADORES
// Los Web Streams son estándar y funcionan tanto en Node.js como en navegadores

import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web'

// Creamos un stream de lectura web
const readableStream = new ReadableStream({
  start(controller) {
    const datos = ['Hola', 'Mundo', 'Node.js', 'Streams']
    let index = 0
    
    const enviarDato = () => {
      if (index < datos.length) {
        controller.enqueue(datos[index++])
        setTimeout(enviarDato, 1000)
      } else {
        controller.close()
      }
    }
    
    enviarDato()
  }
})

// Creamos un stream de transformación web
const transformStream = new TransformStream({
  transform(chunk, controller) {
    const transformado = chunk.toString().toUpperCase()
    controller.enqueue(transformado)
  }
})

// Creamos un stream de escritura web
const writableStream = new WritableStream({
  write(chunk) {
    console.log(`📝 Dato recibido: ${chunk}`)
  },
  close() {
    console.log('🏁 Stream de escritura cerrado')
  }
})

// Conectamos los streams
readableStream
  .pipeThrough(transformStream)
  .pipeTo(writableStream)
```

### 6.2 Stream Consumers (Consumidores de Streams)

```javascript
// STREAM CONSUMERS - FUNCIONES DE AYUDA PARA CONSUMIR STREAMS
import { finished, pipeline } from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs'

// FINISHED - Espera a que un stream termine
async function esperarStream() {
  const readStream = createReadStream('archivo.txt')
  const writeStream = createWriteStream('copia.txt')
  
  // Copiamos datos
  readStream.pipe(writeStream)
  
  // Esperamos a que ambos streams terminen
  await finished(readStream)
  await finished(writeStream)
  
  console.log('✅ Copia completada')
}

// PIPELINE - Manejo automático de errores y limpieza
async function procesarConPipeline() {
  try {
    await pipeline(
      createReadStream('entrada.txt'),
      createGzip(),
      createWriteStream('salida.gz')
    )
    console.log('✅ Pipeline completado exitosamente')
  } catch (error) {
    console.error('❌ Error en pipeline:', error.message)
  }
}

// USO DE LOS CONSUMIDORES
Promise.all([
  esperarStream(),
  procesarConPipeline()
]).then(() => {
  console.log('🎉 Todas las operaciones completadas')
}).catch(error => {
  console.error('💥 Error en operaciones:', error.message)
})
```

## Resumen de Patrones de Streams

### **Tipos de Streams:**
- **Readable**: Fuentes de datos (archivos, APIs, etc.)
- **Writable**: Destinos de datos (archivos, bases de datos, etc.)
- **Transform**: Modifican datos en el flujo
- **Passthrough**: Monitorean sin modificar

### **Patrones de Conectividad:**
- **Pipes**: Conectan streams en secuencia
- **Pipeline**: Manejo automático de errores
- **Forking**: Dividen streams en múltiples destinos
- **Merging**: Combinan múltiples streams

### **Patrones de Ejecución:**
- **Secuencial**: Un item a la vez
- **Concurrente**: Múltiples items en paralelo
- **Concurrente Limitado**: Paralelo con control de recursos

### **Ventajas de los Streams:**
- **Eficiencia de memoria**: Procesan datos en chunks
- **Escalabilidad**: Funcionan con archivos de cualquier tamaño
- **Composición**: Fácil crear pipelines complejos
- **Tiempo real**: Procesamiento inmediato sin esperar todo el archivo

---

*Esta es la tercera parte de la guía sobre streams. Continuaré con los siguientes capítulos sobre patrones de diseño creacionales, estructurales y comportamentales.*
