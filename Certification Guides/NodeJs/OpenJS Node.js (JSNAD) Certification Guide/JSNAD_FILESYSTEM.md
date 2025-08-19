# 📁 Sistema de Archivos - JSNAD

## 🎯 Introducción al Sistema de Archivos

El **Sistema de Archivos** representa el **15% del examen JSNAD** y es fundamental para cualquier aplicación Node.js que necesite interactuar con archivos y directorios. Node.js proporciona un módulo `fs` completo que permite realizar todas las operaciones necesarias de manera síncrona y asíncrona.

### ¿Qué es el Módulo fs?

El módulo `fs` (File System) de Node.js proporciona funcionalidades para:
- Leer y escribir archivos
- Crear y eliminar directorios
- Obtener información de archivos
- Monitorear cambios en archivos
- Trabajar con enlaces simbólicos
- Operaciones de permisos

### Características Principales

- **Operaciones Síncronas**: Bloquean el event loop
- **Operaciones Asíncronas**: No bloquean, usan callbacks o promises
- **Streams**: Para archivos grandes
- **Promises API**: Versión moderna con async/await
- **Cross-platform**: Funciona en Windows, macOS y Linux

## 📖 Operaciones de Lectura

### Lectura Síncrona

```javascript
const fs = require('fs');

// Leer archivo completo de forma síncrona
function readFileSyncExample() {
  try {
    // Leer como string
    const content = fs.readFileSync('archivo.txt', 'utf8');
    console.log('Contenido del archivo:', content);
    
    // Leer como buffer
    const buffer = fs.readFileSync('archivo.bin');
    console.log('Tamaño del buffer:', buffer.length);
    
    // Leer con opciones específicas
    const options = {
      encoding: 'utf8',
      flag: 'r' // Solo lectura
    };
    const contentWithOptions = fs.readFileSync('archivo.txt', options);
    console.log('Contenido con opciones:', contentWithOptions);
    
  } catch (error) {
    console.error('Error leyendo archivo:', error.message);
  }
}

// Leer archivo línea por línea
function readFileLineByLineSync(filename) {
  try {
    const content = fs.readFileSync(filename, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.trim()) {
        console.log(`Línea ${index + 1}: ${line}`);
      }
    });
    
    return lines;
  } catch (error) {
    console.error('Error leyendo archivo:', error.message);
    return [];
  }
}

// Leer archivo JSON
function readJSONFileSync(filename) {
  try {
    const content = fs.readFileSync(filename, 'utf8');
    const data = JSON.parse(content);
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Archivo no encontrado:', filename);
    } else if (error instanceof SyntaxError) {
      console.error('Archivo JSON inválido:', filename);
    } else {
      console.error('Error leyendo archivo:', error.message);
    }
    return null;
  }
}
```

### Lectura Asíncrona con Callbacks

```javascript
// Lectura asíncrona básica
function readFileAsyncExample() {
  fs.readFile('archivo.txt', 'utf8', (error, data) => {
    if (error) {
      console.error('Error leyendo archivo:', error.message);
      return;
    }
    
    console.log('Contenido del archivo:', data);
  });
}

// Lectura con manejo de errores detallado
function readFileWithErrorHandling(filename, encoding = 'utf8') {
  fs.readFile(filename, encoding, (error, data) => {
    if (error) {
      switch (error.code) {
        case 'ENOENT':
          console.error(`Archivo no encontrado: ${filename}`);
          break;
        case 'EACCES':
          console.error(`Sin permisos para leer: ${filename}`);
          break;
        case 'EISDIR':
          console.error(`${filename} es un directorio`);
          break;
        default:
          console.error(`Error leyendo archivo: ${error.message}`);
      }
      return;
    }
    
    console.log(`Archivo ${filename} leído exitosamente`);
    console.log('Tamaño:', data.length, 'caracteres');
    return data;
  });
}

// Lectura de múltiples archivos
function readMultipleFiles(filenames, callback) {
  const results = {};
  let completed = 0;
  
  filenames.forEach(filename => {
    fs.readFile(filename, 'utf8', (error, data) => {
      if (error) {
        results[filename] = { error: error.message };
      } else {
        results[filename] = { data: data, size: data.length };
      }
      
      completed++;
      
      if (completed === filenames.length) {
        callback(results);
      }
    });
  });
}

// Ejemplo de uso
readMultipleFiles(['archivo1.txt', 'archivo2.txt', 'archivo3.txt'], (results) => {
  console.log('Resultados de lectura:', results);
  
  for (const [filename, result] of Object.entries(results)) {
    if (result.error) {
      console.error(`Error en ${filename}:`, result.error);
    } else {
      console.log(`${filename}: ${result.size} caracteres`);
    }
  }
});
```

### Lectura con Promises (fs.promises)

```javascript
const fsPromises = require('fs').promises;

// Lectura asíncrona con async/await
async function readFileWithPromises(filename) {
  try {
    const content = await fsPromises.readFile(filename, 'utf8');
    console.log('Contenido leído:', content);
    return content;
  } catch (error) {
    console.error('Error leyendo archivo:', error.message);
    throw error;
  }
}

// Lectura de múltiples archivos en paralelo
async function readMultipleFilesParallel(filenames) {
  try {
    const promises = filenames.map(filename => 
      fsPromises.readFile(filename, 'utf8')
        .then(content => ({ filename, content, success: true }))
        .catch(error => ({ filename, error: error.message, success: false }))
    );
    
    const results = await Promise.all(promises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`Archivos leídos exitosamente: ${successful.length}`);
    console.log(`Archivos con errores: ${failed.length}`);
    
    return { successful, failed };
  } catch (error) {
    console.error('Error en operación de lectura:', error.message);
    throw error;
  }
}

// Lectura con timeout
async function readFileWithTimeout(filename, timeoutMs = 5000) {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeoutMs);
    });
    
    const readPromise = fsPromises.readFile(filename, 'utf8');
    
    const content = await Promise.race([readPromise, timeoutPromise]);
    return content;
  } catch (error) {
    if (error.message === 'Timeout') {
      console.error(`Lectura de ${filename} excedió el tiempo límite`);
    } else {
      console.error(`Error leyendo ${filename}:`, error.message);
    }
    throw error;
  }
}

// Ejemplo de uso
async function demonstrateFileReading() {
  try {
    // Lectura simple
    const content1 = await readFileWithPromises('archivo1.txt');
    
    // Lectura múltiple en paralelo
    const results = await readMultipleFilesParallel([
      'archivo1.txt',
      'archivo2.txt',
      'archivo3.txt'
    ]);
    
    // Lectura con timeout
    const content2 = await readFileWithTimeout('archivo-grande.txt', 3000);
    
    console.log('Todas las operaciones completadas');
  } catch (error) {
    console.error('Error en demostración:', error.message);
  }
}
```

## ✍️ Operaciones de Escritura

### Escritura Síncrona

```javascript
// Escritura básica síncrona
function writeFileSyncExample() {
  try {
    // Escribir string
    fs.writeFileSync('output.txt', 'Contenido del archivo\n');
    console.log('Archivo escrito exitosamente');
    
    // Escribir con opciones
    const options = {
      encoding: 'utf8',
      flag: 'w', // Sobrescribir
      mode: 0o644 // Permisos
    };
    
    fs.writeFileSync('output-with-options.txt', 'Contenido con opciones', options);
    console.log('Archivo escrito con opciones');
    
    // Escribir buffer
    const buffer = Buffer.from('Contenido en buffer');
    fs.writeFileSync('output.bin', buffer);
    console.log('Buffer escrito exitosamente');
    
  } catch (error) {
    console.error('Error escribiendo archivo:', error.message);
  }
}

// Escribir JSON
function writeJSONFileSync(filename, data) {
  try {
    const jsonString = JSON.stringify(data, null, 2); // Con formato
    fs.writeFileSync(filename, jsonString, 'utf8');
    console.log(`JSON escrito en ${filename}`);
    return true;
  } catch (error) {
    console.error('Error escribiendo JSON:', error.message);
    return false;
  }
}

// Escribir con append
function appendToFileSync(filename, content) {
  try {
    fs.appendFileSync(filename, content + '\n', 'utf8');
    console.log(`Contenido agregado a ${filename}`);
    return true;
  } catch (error) {
    console.error('Error agregando contenido:', error.message);
    return false;
  }
}

// Ejemplo de uso
const userData = {
  users: [
    { id: 1, name: 'Juan', email: 'juan@example.com' },
    { id: 2, name: 'Ana', email: 'ana@example.com' }
  ],
  total: 2,
  createdAt: new Date().toISOString()
};

writeJSONFileSync('users.json', userData);
appendToFileSync('log.txt', `Archivo users.json creado: ${new Date()}`);
```

### Escritura Asíncrona

```javascript
// Escritura asíncrona básica
function writeFileAsyncExample() {
  const content = 'Contenido asíncrono del archivo\n';
  
  fs.writeFile('output-async.txt', content, 'utf8', (error) => {
    if (error) {
      console.error('Error escribiendo archivo:', error.message);
      return;
    }
    
    console.log('Archivo escrito asíncronamente');
  });
}

// Escritura con manejo de errores
function writeFileWithErrorHandling(filename, content, options = {}) {
  const defaultOptions = {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o644
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  fs.writeFile(filename, content, finalOptions, (error) => {
    if (error) {
      switch (error.code) {
        case 'ENOENT':
          console.error(`Directorio no encontrado para: ${filename}`);
          break;
        case 'EACCES':
          console.error(`Sin permisos para escribir: ${filename}`);
          break;
        case 'ENOSPC':
          console.error(`Espacio en disco insuficiente`);
          break;
        default:
          console.error(`Error escribiendo archivo: ${error.message}`);
      }
      return;
    }
    
    console.log(`Archivo ${filename} escrito exitosamente`);
  });
}

// Escritura de múltiples archivos
function writeMultipleFiles(files, callback) {
  const results = {};
  let completed = 0;
  
  files.forEach(({ filename, content, options }) => {
    fs.writeFile(filename, content, options || 'utf8', (error) => {
      if (error) {
        results[filename] = { error: error.message };
      } else {
        results[filename] = { success: true, size: content.length };
      }
      
      completed++;
      
      if (completed === files.length) {
        callback(results);
      }
    });
  });
}

// Ejemplo de uso
const filesToWrite = [
  { filename: 'archivo1.txt', content: 'Contenido del archivo 1' },
  { filename: 'archivo2.txt', content: 'Contenido del archivo 2' },
  { filename: 'archivo3.txt', content: 'Contenido del archivo 3' }
];

writeMultipleFiles(filesToWrite, (results) => {
  console.log('Resultados de escritura:', results);
  
  for (const [filename, result] of Object.entries(results)) {
    if (result.error) {
      console.error(`Error en ${filename}:`, result.error);
    } else {
      console.log(`${filename}: ${result.size} caracteres escritos`);
    }
  }
});
```

### Escritura con Promises

```javascript
// Escritura asíncrona con async/await
async function writeFileWithPromises(filename, content, options = {}) {
  try {
    await fsPromises.writeFile(filename, content, options);
    console.log(`Archivo ${filename} escrito exitosamente`);
    return true;
  } catch (error) {
    console.error(`Error escribiendo ${filename}:`, error.message);
    throw error;
  }
}

// Escritura de múltiples archivos en paralelo
async function writeMultipleFilesParallel(files) {
  try {
    const promises = files.map(({ filename, content, options }) =>
      fsPromises.writeFile(filename, content, options || 'utf8')
        .then(() => ({ filename, success: true }))
        .catch(error => ({ filename, error: error.message, success: false }))
    );
    
    const results = await Promise.all(promises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`Archivos escritos exitosamente: ${successful.length}`);
    console.log(`Archivos con errores: ${failed.length}`);
    
    return { successful, failed };
  } catch (error) {
    console.error('Error en operación de escritura:', error.message);
    throw error;
  }
}

// Escritura con retry
async function writeFileWithRetry(filename, content, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fsPromises.writeFile(filename, content, 'utf8');
      console.log(`Archivo ${filename} escrito en intento ${attempt}`);
      return true;
    } catch (error) {
      console.error(`Intento ${attempt} falló:`, error.message);
      
      if (attempt === maxRetries) {
        console.error(`Todos los intentos fallaron para ${filename}`);
        throw error;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## 📁 Operaciones de Directorios

### Crear y Eliminar Directorios

```javascript
// Crear directorio
function createDirectoryExample() {
  try {
    // Crear directorio simple
    fs.mkdirSync('nuevo-directorio');
    console.log('Directorio creado: nuevo-directorio');
    
    // Crear directorio con permisos
    fs.mkdirSync('directorio-con-permisos', 0o755);
    console.log('Directorio con permisos creado');
    
    // Crear directorios anidados
    fs.mkdirSync('directorio/padre/hijo', { recursive: true });
    console.log('Directorio anidado creado');
    
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('El directorio ya existe');
    } else {
      console.error('Error creando directorio:', error.message);
    }
  }
}

// Crear directorio asíncrono
function createDirectoryAsync(dirname, callback) {
  fs.mkdir(dirname, { recursive: true }, (error) => {
    if (error) {
      console.error(`Error creando directorio ${dirname}:`, error.message);
      callback(error);
      return;
    }
    
    console.log(`Directorio ${dirname} creado exitosamente`);
    callback(null, dirname);
  });
}

// Eliminar directorio
function removeDirectoryExample() {
  try {
    // Eliminar directorio vacío
    fs.rmdirSync('directorio-vacio');
    console.log('Directorio vacío eliminado');
    
    // Eliminar directorio con contenido (recursivo)
    fs.rmSync('directorio-con-contenido', { recursive: true, force: true });
    console.log('Directorio con contenido eliminado');
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('El directorio no existe');
    } else if (error.code === 'ENOTEMPTY') {
      console.log('El directorio no está vacío');
    } else {
      console.error('Error eliminando directorio:', error.message);
    }
  }
}

// Eliminar directorio asíncrono
function removeDirectoryAsync(dirname, callback) {
  fs.rm(dirname, { recursive: true, force: true }, (error) => {
    if (error) {
      console.error(`Error eliminando directorio ${dirname}:`, error.message);
      callback(error);
      return;
    }
    
    console.log(`Directorio ${dirname} eliminado exitosamente`);
    callback(null);
  });
}
```

### Listar Contenido de Directorios

```javascript
// Listar directorio síncrono
function listDirectorySync(dirname = '.') {
  try {
    const items = fs.readdirSync(dirname);
    
    console.log(`Contenido de ${dirname}:`);
    items.forEach(item => {
      const stats = fs.statSync(`${dirname}/${item}`);
      const type = stats.isDirectory() ? 'DIR' : 'FILE';
      const size = stats.size;
      console.log(`${type} ${item.padEnd(20)} ${size} bytes`);
    });
    
    return items;
  } catch (error) {
    console.error(`Error listando directorio ${dirname}:`, error.message);
    return [];
  }
}

// Listar directorio asíncrono
function listDirectoryAsync(dirname = '.', callback) {
  fs.readdir(dirname, (error, items) => {
    if (error) {
      console.error(`Error listando directorio ${dirname}:`, error.message);
      callback(error);
      return;
    }
    
    console.log(`Contenido de ${dirname}:`);
    callback(null, items);
  });
}

// Listar con información detallada
async function listDirectoryDetailed(dirname = '.') {
  try {
    const items = await fsPromises.readdir(dirname);
    const detailedItems = [];
    
    for (const item of items) {
      const fullPath = `${dirname}/${item}`;
      const stats = await fsPromises.stat(fullPath);
      
      detailedItems.push({
        name: item,
        path: fullPath,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        permissions: stats.mode.toString(8)
      });
    }
    
    // Ordenar: directorios primero, luego archivos
    detailedItems.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    return detailedItems;
  } catch (error) {
    console.error(`Error listando directorio ${dirname}:`, error.message);
    throw error;
  }
}

// Ejemplo de uso
async function demonstrateDirectoryListing() {
  try {
    const items = await listDirectoryDetailed('.');
    
    console.log('Listado detallado del directorio:');
    items.forEach(item => {
      const type = item.isDirectory ? '📁' : '📄';
      const size = item.isDirectory ? '--' : `${item.size} bytes`;
      console.log(`${type} ${item.name.padEnd(20)} ${size.padStart(10)}`);
    });
    
  } catch (error) {
    console.error('Error en demostración:', error.message);
  }
}
```

## 🔍 Información de Archivos y Directorios

### Estadísticas de Archivos

```javascript
// Obtener estadísticas síncronas
function getFileStatsSync(filename) {
  try {
    const stats = fs.statSync(filename);
    
    console.log(`Estadísticas de ${filename}:`);
    console.log(`- Tamaño: ${stats.size} bytes`);
    console.log(`- Es directorio: ${stats.isDirectory()}`);
    console.log(`- Es archivo: ${stats.isFile()}`);
    console.log(`- Es enlace simbólico: ${stats.isSymbolicLink()}`);
    console.log(`- Creado: ${stats.birthtime}`);
    console.log(`- Modificado: ${stats.mtime}`);
    console.log(`- Accedido: ${stats.atime}`);
    console.log(`- Permisos: ${stats.mode.toString(8)}`);
    
    return stats;
  } catch (error) {
    console.error(`Error obteniendo estadísticas de ${filename}:`, error.message);
    return null;
  }
}

// Obtener estadísticas asíncronas
async function getFileStatsAsync(filename) {
  try {
    const stats = await fsPromises.stat(filename);
    
    const fileInfo = {
      name: filename,
      size: stats.size,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      isSymbolicLink: stats.isSymbolicLink(),
      created: stats.birthtime,
      modified: stats.mtime,
      accessed: stats.atime,
      permissions: stats.mode.toString(8),
      sizeFormatted: formatFileSize(stats.size)
    };
    
    return fileInfo;
  } catch (error) {
    console.error(`Error obteniendo estadísticas de ${filename}:`, error.message);
    throw error;
  }
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Verificar existencia de archivo
function checkFileExists(filename) {
  try {
    fs.accessSync(filename, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

// Verificar permisos
function checkFilePermissions(filename) {
  try {
    // Verificar lectura
    fs.accessSync(filename, fs.constants.R_OK);
    console.log(`${filename} es legible`);
    
    // Verificar escritura
    fs.accessSync(filename, fs.constants.W_OK);
    console.log(`${filename} es escribible`);
    
    // Verificar ejecución
    fs.accessSync(filename, fs.constants.X_OK);
    console.log(`${filename} es ejecutable`);
    
    return { readable: true, writable: true, executable: true };
  } catch (error) {
    if (error.code === 'EACCES') {
      console.log(`${filename} no tiene permisos suficientes`);
      return { readable: false, writable: false, executable: false };
    } else if (error.code === 'ENOENT') {
      console.log(`${filename} no existe`);
      return { readable: false, writable: false, executable: false };
    }
    
    console.error(`Error verificando permisos de ${filename}:`, error.message);
    return null;
  }
}
```

## 🧪 Pruebas Unitarias - Sistema de Archivos

```javascript
// tests/filesystem.test.js
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { 
  readFileWithPromises,
  readMultipleFilesParallel,
  readFileWithTimeout,
  writeFileWithPromises,
  writeMultipleFilesParallel,
  writeFileWithRetry,
  listDirectoryDetailed,
  getFileStatsAsync,
  formatFileSize,
  checkFileExists,
  checkFilePermissions
} = require('../src/filesystem');

describe('Sistema de Archivos', () => {
  const testDir = 'test-files';
  const testFile = path.join(testDir, 'test.txt');
  const testJSONFile = path.join(testDir, 'test.json');
  
  beforeAll(async () => {
    // Crear directorio de prueba
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Crear archivo de prueba
    fs.writeFileSync(testFile, 'Contenido de prueba\nSegunda línea');
    
    // Crear archivo JSON de prueba
    const testData = { name: 'Test', value: 42 };
    fs.writeFileSync(testJSONFile, JSON.stringify(testData));
  });
  
  afterAll(async () => {
    // Limpiar archivos de prueba
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });
  
  describe('Lectura de Archivos', () => {
    test('readFileWithPromises debe leer archivo correctamente', async () => {
      const content = await readFileWithPromises(testFile);
      expect(content).toContain('Contenido de prueba');
      expect(content).toContain('Segunda línea');
    });
    
    test('readFileWithPromises debe manejar archivo inexistente', async () => {
      await expect(readFileWithPromises('archivo-inexistente.txt'))
        .rejects.toThrow();
    });
    
    test('readMultipleFilesParallel debe leer múltiples archivos', async () => {
      const results = await readMultipleFilesParallel([testFile, testJSONFile]);
      
      expect(results.successful).toHaveLength(2);
      expect(results.failed).toHaveLength(0);
      expect(results.successful[0].filename).toBe(testFile);
      expect(results.successful[1].filename).toBe(testJSONFile);
    });
    
    test('readFileWithTimeout debe fallar por timeout', async () => {
      // Crear un archivo muy grande para simular timeout
      const bigFile = path.join(testDir, 'big.txt');
      const bigContent = 'x'.repeat(1000000); // 1MB
      fs.writeFileSync(bigFile, bigContent);
      
      await expect(readFileWithTimeout(bigFile, 1))
        .rejects.toThrow('Timeout');
      
      // Limpiar
      fs.unlinkSync(bigFile);
    });
  });
  
  describe('Escritura de Archivos', () => {
    test('writeFileWithPromises debe escribir archivo correctamente', async () => {
      const testContent = 'Contenido de prueba de escritura';
      const testOutputFile = path.join(testDir, 'output.txt');
      
      const result = await writeFileWithPromises(testOutputFile, testContent);
      expect(result).toBe(true);
      
      // Verificar que se escribió correctamente
      const writtenContent = fs.readFileSync(testOutputFile, 'utf8');
      expect(writtenContent).toBe(testContent);
      
      // Limpiar
      fs.unlinkSync(testOutputFile);
    });
    
    test('writeMultipleFilesParallel debe escribir múltiples archivos', async () => {
      const filesToWrite = [
        { filename: path.join(testDir, 'file1.txt'), content: 'Contenido 1' },
        { filename: path.join(testDir, 'file2.txt'), content: 'Contenido 2' }
      ];
      
      const results = await writeMultipleFilesParallel(filesToWrite);
      
      expect(results.successful).toHaveLength(2);
      expect(results.failed).toHaveLength(0);
      
      // Limpiar
      filesToWrite.forEach(file => {
        if (fs.existsSync(file.filename)) {
          fs.unlinkSync(file.filename);
        }
      });
    });
    
    test('writeFileWithRetry debe reintentar en caso de fallo', async () => {
      // Simular fallo temporal
      const testFile = path.join(testDir, 'retry-test.txt');
      const content = 'Contenido de prueba';
      
      const result = await writeFileWithRetry(testFile, content, 3);
      expect(result).toBe(true);
      
      // Limpiar
      fs.unlinkSync(testFile);
    });
  });
  
  describe('Operaciones de Directorios', () => {
    test('listDirectoryDetailed debe listar directorio correctamente', async () => {
      const items = await listDirectoryDetailed(testDir);
      
      expect(items.length).toBeGreaterThan(0);
      expect(items.some(item => item.name === 'test.txt')).toBe(true);
      expect(items.some(item => item.name === 'test.json')).toBe(true);
      
      // Verificar propiedades de los items
      const testItem = items.find(item => item.name === 'test.txt');
      expect(testItem.isFile).toBe(true);
      expect(testItem.isDirectory).toBe(false);
      expect(testItem.size).toBeGreaterThan(0);
    });
  });
  
  describe('Información de Archivos', () => {
    test('getFileStatsAsync debe obtener estadísticas correctamente', async () => {
      const stats = await getFileStatsAsync(testFile);
      
      expect(stats.name).toBe(testFile);
      expect(stats.isFile).toBe(true);
      expect(stats.isDirectory).toBe(false);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.created).toBeInstanceOf(Date);
      expect(stats.modified).toBeInstanceOf(Date);
      expect(stats.sizeFormatted).toMatch(/^\d+(\.\d+)? (Bytes|KB|MB|GB|TB)$/);
    });
    
    test('formatFileSize debe formatear tamaños correctamente', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
    
    test('checkFileExists debe verificar existencia correctamente', () => {
      expect(checkFileExists(testFile)).toBe(true);
      expect(checkFileExists('archivo-inexistente.txt')).toBe(false);
    });
    
    test('checkFilePermissions debe verificar permisos correctamente', () => {
      const permissions = checkFilePermissions(testFile);
      
      expect(permissions).toBeDefined();
      expect(typeof permissions.readable).toBe('boolean');
      expect(typeof permissions.writable).toBe('boolean');
    });
  });
});
```

## 📊 Monitoreo de Archivos

### Watchers de Archivos

```javascript
const fs = require('fs');
const path = require('path');

// Monitorear cambios en archivo
function watchFile(filename) {
  const watcher = fs.watch(filename, (eventType, filename) => {
    console.log(`Evento en ${filename}: ${eventType}`);
    
    if (eventType === 'change') {
      console.log('Archivo modificado');
      
      // Leer contenido actualizado
      fs.readFile(filename, 'utf8', (error, data) => {
        if (error) {
          console.error('Error leyendo archivo modificado:', error.message);
          return;
        }
        
        console.log('Contenido actualizado:', data);
      });
    } else if (eventType === 'rename') {
      console.log('Archivo renombrado o eliminado');
    }
  });
  
  // Manejar errores del watcher
  watcher.on('error', (error) => {
    console.error('Error en watcher:', error.message);
  });
  
  return watcher;
}

// Monitorear directorio
function watchDirectory(dirname) {
  const watcher = fs.watch(dirname, { recursive: true }, (eventType, filename) => {
    if (filename) {
      const fullPath = path.join(dirname, filename);
      console.log(`Evento en ${fullPath}: ${eventType}`);
      
      if (eventType === 'change') {
        console.log('Archivo modificado:', filename);
      } else if (eventType === 'rename') {
        // Verificar si el archivo existe
        if (fs.existsSync(fullPath)) {
          console.log('Archivo creado:', filename);
        } else {
          console.log('Archivo eliminado:', filename);
        }
      }
    }
  });
  
  watcher.on('error', (error) => {
    console.error('Error en watcher de directorio:', error.message);
  });
  
  return watcher;
}

// Monitorear con polling (más confiable pero menos eficiente)
function watchFileWithPolling(filename, interval = 1000) {
  let lastModified = null;
  
  const intervalId = setInterval(() => {
    fs.stat(filename, (error, stats) => {
      if (error) {
        if (error.code === 'ENOENT') {
          console.log('Archivo eliminado:', filename);
          clearInterval(intervalId);
        } else {
          console.error('Error obteniendo estadísticas:', error.message);
        }
        return;
      }
      
      if (lastModified && stats.mtime > lastModified) {
        console.log('Archivo modificado:', filename);
        
        // Leer contenido
        fs.readFile(filename, 'utf8', (error, data) => {
          if (error) {
            console.error('Error leyendo archivo:', error.message);
            return;
          }
          
          console.log('Contenido actualizado:', data);
        });
      }
      
      lastModified = stats.mtime;
    });
  }, interval);
  
  return intervalId;
}

// Ejemplo de uso
function demonstrateFileWatching() {
  console.log('Iniciando monitoreo de archivos...');
  
  // Monitorear archivo específico
  const fileWatcher = watchFile('archivo-monitoreado.txt');
  
  // Monitorear directorio
  const dirWatcher = watchDirectory('.');
  
  // Monitorear con polling
  const pollingWatcher = watchFileWithPolling('archivo-polling.txt', 2000);
  
  // Detener monitoreo después de 30 segundos
  setTimeout(() => {
    console.log('Deteniendo monitoreo...');
    fileWatcher.close();
    dirWatcher.close();
    clearInterval(pollingWatcher);
  }, 30000);
}
```

## 📝 Puntos Clave - Sistema de Archivos

### ✅ Conceptos Esenciales

1. **Módulo fs**: Operaciones de archivos y directorios
2. **Operaciones Síncronas vs Asíncronas**: Bloqueantes vs no bloqueantes
3. **fs.promises**: API moderna con async/await
4. **Streams**: Para archivos grandes
5. **Watchers**: Monitoreo de cambios en tiempo real
6. **Permisos**: Control de acceso a archivos

### ⚠️ Errores Comunes

1. **Usar operaciones síncronas** en aplicaciones de producción
2. **No manejar errores** en operaciones de archivo
3. **Olvidar cerrar streams** y watchers
4. **No verificar permisos** antes de operaciones
5. **Usar rutas relativas** incorrectamente

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre `fs.readFile` y `fs.createReadStream`?
2. ¿Cómo se maneja el monitoreo de archivos en Node.js?
3. ¿Qué significa el flag 'w' en `fs.writeFile`?
4. ¿Cómo se crean directorios anidados?
5. ¿Cuál es la diferencia entre `fs.stat` y `fs.access`?

---

**¡Continuemos con la siguiente sección: Módulos de Utilidad!**
