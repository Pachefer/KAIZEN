# 🌊 Streams - JSNAD

## 🎯 Introducción a Streams

Los **Streams** representan el **15% del examen JSNAD** y son una de las características más poderosas de Node.js. Los streams permiten procesar datos de forma eficiente, especialmente cuando se trabaja con archivos grandes, operaciones de red o cualquier flujo de datos.

### ¿Qué son los Streams?

Los streams son objetos que permiten leer datos desde una fuente o escribir datos a un destino de forma continua. En lugar de cargar todo el archivo en memoria, los streams procesan los datos en pequeños fragmentos (chunks).

### Ventajas de los Streams

- **Eficiencia de Memoria**: No cargan todo el archivo en memoria
- **Performance**: Procesamiento en tiempo real
- **Escalabilidad**: Manejo de archivos muy grandes
- **Composabilidad**: Se pueden encadenar y combinar
- **Backpressure**: Control automático del flujo de datos

## 🔄 Tipos de Streams

### 1. Readable Streams (Lectura)

```javascript
const fs = require('fs');
const { Readable } = require('stream');

// Stream de lectura desde archivo
const readStream = fs.createReadStream('archivo-grande.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024 // 64KB por chunk
});

// Escuchar eventos del stream
readStream.on('data', (chunk) => {
  console.log('Chunk recibido:', chunk.length, 'bytes');
  console.log('Contenido:', chunk.substring(0, 100) + '...');
});

readStream.on('end', () => {
  console.log('Stream de lectura completado');
});

readStream.on('error', (error) => {
  console.error('Error en stream:', error.message);
});

// Stream de lectura personalizado
class NumberGenerator extends Readable {
  constructor(max) {
    super({ objectMode: true });
    this.max = max;
    this.current = 1;
  }
  
  _read() {
    if (this.current > this.max) {
      this.push(null); // Fin del stream
      return;
    }
    
    this.push({
      number: this.current,
      timestamp: new Date(),
      even: this.current % 2 === 0
    });
    
    this.current++;
  }
}

// Uso del stream personalizado
const numberStream = new NumberGenerator(10);
numberStream.on('data', (data) => {
  console.log('Número generado:', data);
});
```

### 2. Writable Streams (Escritura)

```javascript
const fs = require('fs');
const { Writable } = require('stream');

// Stream de escritura a archivo
const writeStream = fs.createWriteStream('output.txt', {
  encoding: 'utf8',
  flags: 'a' // Append mode
});

// Escuchar eventos del stream
writeStream.on('finish', () => {
  console.log('Stream de escritura completado');
});

writeStream.on('error', (error) => {
  console.error('Error en stream:', error.message);
});

// Escribir datos
writeStream.write('Primera línea\n');
writeStream.write('Segunda línea\n');
writeStream.write('Tercera línea\n');

// Cerrar el stream
writeStream.end();

// Stream de escritura personalizado
class DataLogger extends Writable {
  constructor(options = {}) {
    super({ objectMode: true, ...options });
    this.logs = [];
  }
  
  _write(chunk, encoding, callback) {
    const logEntry = {
      timestamp: new Date(),
      data: chunk,
      type: typeof chunk
    };
    
    this.logs.push(logEntry);
    console.log('Log registrado:', logEntry);
    
    callback(); // Indicar que el chunk fue procesado
  }
  
  _final(callback) {
    console.log('Total de logs:', this.logs.length);
    callback();
  }
  
  getLogs() {
    return this.logs;
  }
}

// Uso del stream personalizado
const logger = new DataLogger();
logger.write('Mensaje de prueba');
logger.write({ user: 'Juan', action: 'login' });
logger.write(42);
logger.end();
```

### 3. Duplex Streams (Bidireccional)

```javascript
const { Duplex } = require('stream');

// Stream duplex personalizado
class DataTransformer extends Duplex {
  constructor(options = {}) {
    super({ objectMode: true, ...options });
    this.buffer = [];
  }
  
  _write(chunk, encoding, callback) {
    // Transformar datos de entrada
    const transformed = this.transformData(chunk);
    this.buffer.push(transformed);
    callback();
  }
  
  _read() {
    // Enviar datos transformados
    if (this.buffer.length > 0) {
      this.push(this.buffer.shift());
    } else {
      this.push(null);
    }
  }
  
  transformData(data) {
    if (typeof data === 'string') {
      return data.toUpperCase();
    } else if (typeof data === 'number') {
      return data * 2;
    } else if (Array.isArray(data)) {
      return data.map(item => this.transformData(item));
    } else if (typeof data === 'object') {
      const transformed = {};
      for (const [key, value] of Object.entries(data)) {
        transformed[key.toUpperCase()] = this.transformData(value);
      }
      return transformed;
    }
    return data;
  }
}

// Uso del stream duplex
const transformer = new DataTransformer();

transformer.on('data', (transformed) => {
  console.log('Datos transformados:', transformed);
});

transformer.write('hola mundo');
transformer.write(42);
transformer.write(['a', 'b', 'c']);
transformer.write({ name: 'Juan', age: 30 });
transformer.end();
```

### 4. Transform Streams (Transformación)

```javascript
const { Transform } = require('stream');

// Stream de transformación para encriptar datos
class Encryptor extends Transform {
  constructor(algorithm = 'aes-256-cbc', password = 'secret') {
    super({ objectMode: true });
    this.algorithm = algorithm;
    this.password = password;
    this.crypto = require('crypto');
  }
  
  _transform(chunk, encoding, callback) {
    try {
      const encrypted = this.encrypt(chunk);
      this.push({
        original: chunk,
        encrypted: encrypted,
        algorithm: this.algorithm,
        timestamp: new Date()
      });
      callback();
    } catch (error) {
      callback(error);
    }
  }
  
  encrypt(data) {
    const cipher = this.crypto.createCipher(this.algorithm, this.password);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
}

// Stream de transformación para validar JSON
class JSONValidator extends Transform {
  constructor(options = {}) {
    super({ objectMode: true, ...options });
    this.validCount = 0;
    this.invalidCount = 0;
  }
  
  _transform(chunk, encoding, callback) {
    try {
      const parsed = JSON.parse(chunk);
      this.validCount++;
      this.push({
        data: parsed,
        valid: true,
        timestamp: new Date()
      });
    } catch (error) {
      this.invalidCount++;
      this.push({
        data: chunk,
        valid: false,
        error: error.message,
        timestamp: new Date()
      });
    }
    callback();
  }
  
  _flush(callback) {
    this.push({
      summary: {
        valid: this.validCount,
        invalid: this.invalidCount,
        total: this.validCount + this.invalidCount
      }
    });
    callback();
  }
}

// Uso de streams de transformación
const validator = new JSONValidator();
const encryptor = new Encryptor();

validator.pipe(encryptor);

encryptor.on('data', (result) => {
  if (result.summary) {
    console.log('Resumen de validación:', result.summary);
  } else {
    console.log('Datos procesados:', result);
  }
});

// Enviar datos para validar y encriptar
validator.write('{"name": "Juan", "age": 30}');
validator.write('{"invalid": json}');
validator.write('{"status": "active", "role": "admin"}');
validator.end();
```

## 🔗 Piping y Encadenamiento

### Concepto de Piping

El piping permite conectar streams de forma que la salida de uno se convierte en la entrada del siguiente.

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Streams de transformación
class UpperCaseTransform extends Transform {
  constructor() {
    super({ encoding: 'utf8' });
  }
  
  _transform(chunk, encoding, callback) {
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    callback();
  }
}

class LineNumberTransform extends Transform {
  constructor() {
    super({ encoding: 'utf8' });
    this.lineNumber = 1;
  }
  
  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    const numberedLines = lines
      .filter(line => line.trim())
      .map(line => `${this.lineNumber++}: ${line}`)
      .join('\n');
    
    if (numberedLines) {
      this.push(numberedLines + '\n');
    }
    callback();
  }
}

class WordCountTransform extends Transform {
  constructor() {
    super({ objectMode: true });
    this.wordCount = 0;
    this.charCount = 0;
  }
  
  _transform(chunk, encoding, callback) {
    const text = chunk.toString();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const chars = text.replace(/\s/g, '').length;
    
    this.wordCount += words.length;
    this.charCount += chars;
    
    this.push({
      chunk: chunk.toString(),
      words: words.length,
      chars: chars,
      runningTotal: {
        words: this.wordCount,
        chars: this.charCount
      }
    });
    
    callback();
  }
  
  _flush(callback) {
    this.push({
      final: {
        totalWords: this.wordCount,
        totalChars: this.charCount
      }
    });
    callback();
  }
}

// Encadenar streams
const readStream = fs.createReadStream('input.txt');
const upperTransform = new UpperCaseTransform();
const lineNumberTransform = new LineNumberTransform();
const wordCountTransform = new WordCountTransform();
const writeStream = fs.createWriteStream('output.txt');

// Pipeline completo
readStream
  .pipe(upperTransform)
  .pipe(lineNumberTransform)
  .pipe(wordCountTransform)
  .pipe(writeStream);

// Escuchar resultados del contador de palabras
wordCountTransform.on('data', (data) => {
  if (data.final) {
    console.log('Estadísticas finales:', data.final);
  } else {
    console.log('Chunk procesado:', data);
  }
});

// Manejo de errores en el pipeline
readStream.on('error', (error) => {
  console.error('Error en lectura:', error.message);
});

writeStream.on('error', (error) => {
  console.error('Error en escritura:', error.message);
});
```

### Pipeline con Promesas

```javascript
const { pipeline } = require('stream/promises');
const fs = require('fs');

async function processFileWithPipeline() {
  try {
    const readStream = fs.createReadStream('input.txt');
    const upperTransform = new UpperCaseTransform();
    const writeStream = fs.createWriteStream('output.txt');
    
    await pipeline(readStream, upperTransform, writeStream);
    console.log('Archivo procesado exitosamente');
  } catch (error) {
    console.error('Error en pipeline:', error.message);
  }
}

// Pipeline con transformaciones personalizadas
async function processDataWithTransformations() {
  try {
    const sourceStream = createSourceStream();
    const validator = new JSONValidator();
    const encryptor = new Encryptor();
    const destinationStream = createDestinationStream();
    
    await pipeline(sourceStream, validator, encryptor, destinationStream);
    console.log('Datos procesados y encriptados');
  } catch (error) {
    console.error('Error en procesamiento:', error.message);
  }
}

// Función helper para crear stream de origen
function createSourceStream() {
  const { Readable } = require('stream');
  
  return new Readable({
    objectMode: true,
    read() {
      this.push('{"id": 1, "name": "Juan"}');
      this.push('{"id": 2, "name": "Ana"}');
      this.push('{"id": 3, "name": "Carlos"}');
      this.push(null);
    }
  });
}

// Función helper para crear stream de destino
function createDestinationStream() {
  const { Writable } = require('stream');
  
  return new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      console.log('Datos recibidos en destino:', chunk);
      callback();
    }
  });
}
```

## 🧪 Pruebas Unitarias - Streams

```javascript
// tests/streams.test.js
const { 
  NumberGenerator, 
  DataLogger, 
  DataTransformer,
  Encryptor,
  JSONValidator,
  UpperCaseTransform,
  LineNumberTransform,
  WordCountTransform
} = require('../src/streams');

describe('Streams', () => {
  describe('NumberGenerator (Readable)', () => {
    test('debe generar números secuenciales', (done) => {
      const numbers = [];
      const stream = new NumberGenerator(5);
      
      stream.on('data', (data) => {
        numbers.push(data.number);
      });
      
      stream.on('end', () => {
        expect(numbers).toEqual([1, 2, 3, 4, 5]);
        done();
      });
    });
    
    test('debe incluir propiedades adicionales', (done) => {
      const stream = new NumberGenerator(3);
      let count = 0;
      
      stream.on('data', (data) => {
        expect(data).toHaveProperty('number');
        expect(data).toHaveProperty('timestamp');
        expect(data).toHaveProperty('even');
        expect(data.timestamp).toBeInstanceOf(Date);
        expect(typeof data.even).toBe('boolean');
        count++;
      });
      
      stream.on('end', () => {
        expect(count).toBe(3);
        done();
      });
    });
  });
  
  describe('DataLogger (Writable)', () => {
    test('debe registrar logs correctamente', (done) => {
      const logger = new DataLogger();
      
      logger.write('test message');
      logger.write({ key: 'value' });
      logger.write(42);
      
      logger.end();
      
      logger.on('finish', () => {
        const logs = logger.getLogs();
        expect(logs).toHaveLength(3);
        expect(logs[0].data).toBe('test message');
        expect(logs[1].data).toEqual({ key: 'value' });
        expect(logs[2].data).toBe(42);
        done();
      });
    });
    
    test('debe incluir timestamp en cada log', (done) => {
      const logger = new DataLogger();
      
      logger.write('test');
      logger.end();
      
      logger.on('finish', () => {
        const logs = logger.getLogs();
        expect(logs[0].timestamp).toBeInstanceOf(Date);
        done();
      });
    });
  });
  
  describe('DataTransformer (Duplex)', () => {
    test('debe transformar strings a mayúsculas', (done) => {
      const transformer = new DataTransformer();
      const results = [];
      
      transformer.on('data', (data) => {
        results.push(data);
      });
      
      transformer.write('hola');
      transformer.write('mundo');
      transformer.end();
      
      transformer.on('end', () => {
        expect(results).toHaveLength(2);
        expect(results[0]).toBe('HOLA');
        expect(results[1]).toBe('MUNDO');
        done();
      });
    });
    
    test('debe transformar números multiplicándolos por 2', (done) => {
      const transformer = new DataTransformer();
      const results = [];
      
      transformer.on('data', (data) => {
        results.push(data);
      });
      
      transformer.write(5);
      transformer.write(10);
      transformer.end();
      
      transformer.on('end', () => {
        expect(results).toHaveLength(2);
        expect(results[0]).toBe(10);
        expect(results[1]).toBe(20);
        done();
      });
    });
  });
  
  describe('JSONValidator (Transform)', () => {
    test('debe validar JSON válido', (done) => {
      const validator = new JSONValidator();
      const results = [];
      
      validator.on('data', (data) => {
        results.push(data);
      });
      
      validator.write('{"name": "Juan"}');
      validator.end();
      
      validator.on('end', () => {
        expect(results).toHaveLength(2);
        expect(results[0].valid).toBe(true);
        expect(results[0].data).toEqual({ name: 'Juan' });
        expect(results[1].summary).toBeDefined();
        done();
      });
    });
    
    test('debe detectar JSON inválido', (done) => {
      const validator = new JSONValidator();
      const results = [];
      
      validator.on('data', (data) => {
        results.push(data);
      });
      
      validator.write('{"invalid": json}');
      validator.end();
      
      validator.on('end', () => {
        expect(results).toHaveLength(2);
        expect(results[0].valid).toBe(false);
        expect(results[0].error).toBeDefined();
        done();
      });
    });
  });
  
  describe('UpperCaseTransform (Transform)', () => {
    test('debe convertir texto a mayúsculas', (done) => {
      const transform = new UpperCaseTransform();
      const results = [];
      
      transform.on('data', (data) => {
        results.push(data.toString());
      });
      
      transform.write('hola mundo');
      transform.end();
      
      transform.on('end', () => {
        expect(results.join('')).toBe('HOLA MUNDO');
        done();
      });
    });
  });
  
  describe('LineNumberTransform (Transform)', () => {
    test('debe agregar números de línea', (done) => {
      const transform = new LineNumberTransform();
      const results = [];
      
      transform.on('data', (data) => {
        results.push(data.toString());
      });
      
      transform.write('primera línea\nsegunda línea');
      transform.end();
      
      transform.on('end', () => {
        const output = results.join('');
        expect(output).toContain('1: primera línea');
        expect(output).toContain('2: segunda línea');
        done();
      });
    });
  });
  
  describe('WordCountTransform (Transform)', () => {
    test('debe contar palabras y caracteres', (done) => {
      const transform = new WordCountTransform();
      const results = [];
      
      transform.on('data', (data) => {
        results.push(data);
      });
      
      transform.write('hola mundo');
      transform.end();
      
      transform.on('end', () => {
        const finalResult = results.find(r => r.final);
        expect(finalResult.final.totalWords).toBe(2);
        expect(finalResult.final.totalChars).toBe(9);
        done();
      });
    });
  });
});
```

## 📊 Backpressure y Control de Flujo

### Concepto de Backpressure

El backpressure es un mecanismo que controla la velocidad de flujo de datos entre streams para evitar que el productor genere datos más rápido de lo que el consumidor puede procesar.

```javascript
const { Transform } = require('stream');

// Stream con control de backpressure
class ControlledTransform extends Transform {
  constructor(options = {}) {
    super({ 
      objectMode: true,
      highWaterMark: options.highWaterMark || 16
    });
    this.processingDelay = options.processingDelay || 100;
  }
  
  _transform(chunk, encoding, callback) {
    // Simular procesamiento lento
    setTimeout(() => {
      const transformed = this.processChunk(chunk);
      this.push(transformed);
      callback();
    }, this.processingDelay);
  }
  
  processChunk(chunk) {
    return {
      processed: chunk,
      timestamp: new Date(),
      processedBy: 'ControlledTransform'
    };
  }
}

// Stream productor rápido
class FastProducer extends Transform {
  constructor() {
    super({ objectMode: true });
    this.counter = 0;
  }
  
  _transform(chunk, encoding, callback) {
    // Generar datos rápidamente
    for (let i = 0; i < 10; i++) {
      const data = {
        id: this.counter++,
        value: `data-${this.counter}`,
        timestamp: new Date()
      };
      
      // Verificar si el stream puede recibir más datos
      if (this.push(data)) {
        // Stream puede recibir más datos
        console.log('Datos enviados rápidamente');
      } else {
        // Stream está lleno, esperar
        console.log('Stream lleno, esperando...');
        this.once('drain', () => {
          console.log('Stream drenado, continuando...');
        });
        break;
      }
    }
    
    callback();
  }
}

// Uso de streams con backpressure
const producer = new FastProducer();
const processor = new ControlledTransform({ 
  processingDelay: 200,
  highWaterMark: 5
});

producer.pipe(processor);

processor.on('data', (data) => {
  console.log('Datos procesados:', data.id);
});

// Monitorear eventos de backpressure
producer.on('drain', () => {
  console.log('Productor puede enviar más datos');
});

processor.on('drain', () => {
  console.log('Procesador puede recibir más datos');
});
```

## 🎯 Casos de Uso Prácticos

### Procesamiento de Archivos CSV

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Parser CSV
class CSVParser extends Transform {
  constructor() {
    super({ objectMode: true });
    this.buffer = '';
    this.headers = null;
    this.rowNumber = 0;
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop(); // Mantener línea incompleta en buffer
    
    for (const line of lines) {
      if (line.trim()) {
        this.processLine(line);
      }
    }
    
    callback();
  }
  
  _flush(callback) {
    if (this.buffer.trim()) {
      this.processLine(this.buffer);
    }
    callback();
  }
  
  processLine(line) {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (!this.headers) {
      this.headers = values;
    } else {
      this.rowNumber++;
      const row = {};
      
      this.headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      row.rowNumber = this.rowNumber;
      this.push(row);
    }
  }
}

// Filtro de datos
class DataFilter extends Transform {
  constructor(filterFunction) {
    super({ objectMode: true });
    this.filterFunction = filterFunction;
    this.filteredCount = 0;
    this.totalCount = 0;
  }
  
  _transform(chunk, encoding, callback) {
    this.totalCount++;
    
    if (this.filterFunction(chunk)) {
      this.filteredCount++;
      this.push(chunk);
    }
    
    callback();
  }
  
  _flush(callback) {
    this.push({
      summary: {
        total: this.totalCount,
        filtered: this.filteredCount,
        filteredOut: this.totalCount - this.filteredCount
      }
    });
    callback();
  }
}

// Formateador de salida
class OutputFormatter extends Transform {
  constructor(format = 'json') {
    super({ objectMode: true });
    this.format = format;
  }
  
  _transform(chunk, encoding, callback) {
    if (chunk.summary) {
      // Es un resumen, no formatear
      this.push(chunk);
    } else {
      let formatted;
      
      switch (this.format) {
        case 'json':
          formatted = JSON.stringify(chunk);
          break;
        case 'csv':
          formatted = Object.values(chunk).join(',');
          break;
        case 'table':
          formatted = `| ${Object.values(chunk).join(' | ')} |`;
          break;
        default:
          formatted = JSON.stringify(chunk);
      }
      
      this.push(formatted + '\n');
    }
    
    callback();
  }
}

// Pipeline completo para procesar CSV
function processCSVFile(inputFile, outputFile, filterFunction, format = 'json') {
  const readStream = fs.createReadStream(inputFile);
  const parser = new CSVParser();
  const filter = new DataFilter(filterFunction);
  const formatter = new OutputFormatter(format);
  const writeStream = fs.createWriteStream(outputFile);
  
  // Pipeline
  readStream
    .pipe(parser)
    .pipe(filter)
    .pipe(formatter)
    .pipe(writeStream);
  
  // Manejo de errores
  readStream.on('error', (error) => {
    console.error('Error leyendo archivo:', error.message);
  });
  
  writeStream.on('error', (error) => {
    console.error('Error escribiendo archivo:', error.message);
  });
  
  // Monitorear progreso
  filter.on('data', (data) => {
    if (data.summary) {
      console.log('Resumen del procesamiento:', data.summary);
    }
  });
  
  return { readStream, writeStream };
}

// Ejemplo de uso
const filterFunction = (row) => {
  // Filtrar solo usuarios mayores de 18 años
  return parseInt(row.age) >= 18;
};

const { readStream, writeStream } = processCSVFile(
  'users.csv',
  'adult-users.json',
  filterFunction,
  'json'
);
```

## 📝 Puntos Clave - Streams

### ✅ Conceptos Esenciales

1. **Tipos de Streams**: Readable, Writable, Duplex, Transform
2. **Piping**: Conectar streams con `.pipe()`
3. **Backpressure**: Control automático del flujo de datos
4. **Chunks**: Fragmentos de datos procesados
5. **Eventos**: 'data', 'end', 'error', 'finish'
6. **Pipeline**: Encadenamiento de múltiples streams

### ⚠️ Errores Comunes

1. **No manejar eventos de error** en streams
2. **Olvidar llamar callback()** en streams personalizados
3. **No considerar backpressure** en streams de alta velocidad
4. **Mezclar objectMode** y encoding en el mismo pipeline
5. **No cerrar streams** después de su uso

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre un Duplex stream y un Transform stream?
2. ¿Qué es el backpressure y cómo se maneja?
3. ¿Cómo se conectan múltiples streams?
4. ¿Cuándo usar `objectMode: true` en un stream?
5. ¿Qué eventos emite un Readable stream?

---

**¡Continuemos con la siguiente sección: Sistema de Archivos!**
