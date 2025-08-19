# 🛠️ Módulos de Utilidad - JSNAD

## 🎯 Introducción a los Módulos de Utilidad

Los **Módulos de Utilidad** son módulos built-in de Node.js que proporcionan funcionalidades auxiliares para tareas comunes. Aunque no representan un porcentaje específico del examen JSNAD, son fundamentales para el desarrollo efectivo en Node.js y aparecen en preguntas relacionadas con otros temas.

### Módulos de Utilidad Principales

- **util**: Funciones de utilidad general
- **path**: Manipulación de rutas de archivos
- **url**: Parsing y formateo de URLs
- **querystring**: Parsing de query strings
- **crypto**: Funcionalidades criptográficas
- **os**: Información del sistema operativo
- **assert**: Testing y validaciones

## 🔧 Módulo util

### Funciones de Utilidad General

```javascript
const util = require('util');

// util.inspect - Formatear objetos para debugging
function demonstrateUtilInspect() {
  const complexObject = {
    name: 'Juan Pérez',
    age: 30,
    hobbies: ['programación', 'música', 'deportes'],
    address: {
      street: 'Calle Principal 123',
      city: 'Madrid',
      country: 'España'
    },
    createdAt: new Date(),
    metadata: {
      tags: ['usuario', 'activo'],
      preferences: {
        theme: 'dark',
        language: 'es'
      }
    }
  };
  
  // Formateo básico
  console.log(util.inspect(complexObject));
  
  // Formateo con opciones
  console.log(util.inspect(complexObject, {
    depth: 2,           // Profundidad máxima
    colors: true,        // Colores en terminal
    maxArrayLength: 5,   // Máximo elementos en arrays
    showHidden: true,    // Mostrar propiedades ocultas
    compact: false       // Formato compacto
  }));
  
  // Formateo para objetos circulares
  const circularObj = {};
  circularObj.self = circularObj;
  
  console.log(util.inspect(circularObj, {
    depth: 3,
    colors: true
  }));
}

// util.format - Formatear strings
function demonstrateUtilFormat() {
  // Formateo básico
  const name = 'Juan';
  const age = 30;
  const city = 'Madrid';
  
  const message = util.format('Hola %s, tienes %d años y vives en %s', name, age, city);
  console.log(message); // Hola Juan, tienes 30 años y vives en Madrid
  
  // Formateo con placeholders
  const user = { name: 'Ana', role: 'admin' };
  const logMessage = util.format('Usuario %s con rol %s', user.name, user.role);
  console.log(logMessage);
  
  // Formateo con múltiples argumentos
  const debugInfo = util.format('Debug: %o', { timestamp: new Date(), level: 'info' });
  console.log(debugInfo);
}

// util.promisify - Convertir callbacks a promises
function demonstrateUtilPromisify() {
  const fs = require('fs');
  
  // Convertir fs.readFile a promise
  const readFilePromise = util.promisify(fs.readFile);
  
  // Usar como promise
  async function readFileExample() {
    try {
      const content = await readFilePromise('archivo.txt', 'utf8');
      console.log('Contenido del archivo:', content);
    } catch (error) {
      console.error('Error leyendo archivo:', error.message);
    }
  }
  
  // Convertir función personalizada
  function callbackFunction(data, callback) {
    setTimeout(() => {
      if (data > 0) {
        callback(null, data * 2);
      } else {
        callback(new Error('Número debe ser positivo'));
      }
    }, 1000);
  }
  
  const promiseFunction = util.promisify(callbackFunction);
  
  // Usar la función promisificada
  promiseFunction(5)
    .then(result => console.log('Resultado:', result))
    .catch(error => console.error('Error:', error.message));
}

// util.callbackify - Convertir promises a callbacks
function demonstrateUtilCallbackify() {
  // Función que retorna una promise
  async function promiseFunction(data) {
    if (data > 0) {
      return data * 2;
    } else {
      throw new Error('Número debe ser positivo');
    }
  }
  
  // Convertir a callback
  const callbackFunction = util.callbackify(promiseFunction);
  
  // Usar como callback
  callbackFunction(10, (error, result) => {
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    console.log('Resultado:', result);
  });
  
  // Con error
  callbackFunction(-5, (error, result) => {
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    console.log('Resultado:', result);
  });
}

// util.inherits - Herencia clásica (deprecated, usar ES6 classes)
function demonstrateUtilInherits() {
  const EventEmitter = require('events');
  
  function MyEmitter() {
    EventEmitter.call(this);
  }
  
  util.inherits(MyEmitter, EventEmitter);
  
  MyEmitter.prototype.emit = function() {
    console.log('Evento emitido');
    EventEmitter.prototype.emit.apply(this, arguments);
  };
  
  const myEmitter = new MyEmitter();
  myEmitter.on('event', () => {
    console.log('Evento recibido');
  });
  
  myEmitter.emit('event');
}

// util.types - Verificar tipos de objetos
function demonstrateUtilTypes() {
  const buffer = Buffer.from('Hello');
  const arrayBuffer = new ArrayBuffer(8);
  const dataView = new DataView(arrayBuffer);
  
  console.log('Buffer:', util.types.isBuffer(buffer));           // true
  console.log('ArrayBuffer:', util.types.isArrayBuffer(arrayBuffer)); // true
  console.log('DataView:', util.types.isDataView(dataView));     // true
  
  // Verificar otros tipos
  console.log('Date:', util.types.isDate(new Date()));           // true
  console.log('Error:', util.types.isError(new Error()));       // true
  console.log('RegExp:', util.types.isRegExp(/test/));          // true
  
  // Verificar tipos primitivos
  console.log('String:', util.types.isString('hello'));         // true
  console.log('Number:', util.types.isNumber(42));              // true
  console.log('Boolean:', util.types.isBoolean(true));          // true
}
```

## 🧪 Pruebas Unitarias - Módulo util

```javascript
// tests/util.test.js
const util = require('util');
const { 
  demonstrateUtilInspect,
  demonstrateUtilFormat,
  demonstrateUtilPromisify,
  demonstrateUtilCallbackify,
  demonstrateUtilInherits,
  demonstrateUtilTypes
} = require('../src/util');

describe('Módulo util', () => {
  describe('util.inspect', () => {
    test('debe formatear objetos correctamente', () => {
      const obj = { name: 'Test', value: 42 };
      const result = util.inspect(obj);
      
      expect(result).toContain('name: \'Test\'');
      expect(result).toContain('value: 42');
    });
    
    test('debe manejar objetos circulares', () => {
      const circular = {};
      circular.self = circular;
      
      const result = util.inspect(circular, { depth: 3 });
      expect(result).toContain('[Circular]');
    });
  });
  
  describe('util.format', () => {
    test('debe formatear strings con placeholders', () => {
      const result = util.format('Hola %s, tienes %d años', 'Juan', 30);
      expect(result).toBe('Hola Juan, tienes 30 años');
    });
    
    test('debe manejar múltiples argumentos', () => {
      const result = util.format('Debug: %o', { level: 'info' });
      expect(result).toContain('Debug:');
      expect(result).toContain('level: \'info\'');
    });
  });
  
  describe('util.promisify', () => {
    test('debe convertir callback a promise', async () => {
      function callbackFunction(data, callback) {
        setTimeout(() => {
          callback(null, data * 2);
        }, 10);
      }
      
      const promiseFunction = util.promisify(callbackFunction);
      const result = await promiseFunction(5);
      
      expect(result).toBe(10);
    });
    
    test('debe manejar errores en callbacks', async () => {
      function errorCallback(data, callback) {
        setTimeout(() => {
          callback(new Error('Error de prueba'));
        }, 10);
      }
      
      const promiseFunction = util.promisify(errorCallback);
      
      await expect(promiseFunction(5)).rejects.toThrow('Error de prueba');
    });
  });
  
  describe('util.callbackify', () => {
    test('debe convertir promise a callback', (done) => {
      async function promiseFunction(data) {
        return data * 2;
      }
      
      const callbackFunction = util.callbackify(promiseFunction);
      
      callbackFunction(5, (error, result) => {
        expect(error).toBeNull();
        expect(result).toBe(10);
        done();
      });
    });
    
    test('debe manejar errores en promises', (done) => {
      async function errorPromise(data) {
        throw new Error('Error de prueba');
      }
      
      const callbackFunction = util.callbackify(errorPromise);
      
      callbackFunction(5, (error, result) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error de prueba');
        expect(result).toBeUndefined();
        done();
      });
    });
  });
  
  describe('util.types', () => {
    test('debe verificar tipos correctamente', () => {
      expect(util.types.isString('test')).toBe(true);
      expect(util.types.isNumber(42)).toBe(true);
      expect(util.types.isBoolean(true)).toBe(true);
      expect(util.types.isDate(new Date())).toBe(true);
      expect(util.types.isError(new Error())).toBe(true);
      expect(util.types.isRegExp(/test/)).toBe(true);
    });
    
    test('debe verificar tipos de buffer', () => {
      const buffer = Buffer.from('test');
      const arrayBuffer = new ArrayBuffer(8);
      
      expect(util.types.isBuffer(buffer)).toBe(true);
      expect(util.types.isArrayBuffer(arrayBuffer)).toBe(true);
    });
  });
});
```

## 🛤️ Módulo path

### Manipulación de Rutas de Archivos

```javascript
const path = require('path');

// path.join - Unir segmentos de ruta
function demonstratePathJoin() {
  // Unir segmentos básicos
  const fullPath = path.join('usr', 'local', 'bin');
  console.log('Ruta unida:', fullPath); // usr/local/bin (Unix) o usr\local\bin (Windows)
  
  // Con directorio actual
  const currentPath = path.join('.', 'src', 'components');
  console.log('Ruta actual:', currentPath); // ./src/components
  
  // Con directorio padre
  const parentPath = path.join('..', 'config', 'database.json');
  console.log('Ruta padre:', parentPath); // ../config/database.json
  
  // Con separadores múltiples
  const messyPath = path.join('usr', '', 'local', 'bin');
  console.log('Ruta limpia:', messyPath); // usr/local/bin
  
  // Con separadores del sistema
  const systemPath = path.join('C:', 'Users', 'Juan', 'Documents');
  console.log('Ruta del sistema:', systemPath);
}

// path.resolve - Resolver ruta absoluta
function demonstratePathResolve() {
  // Resolver desde directorio actual
  const absolutePath = path.resolve('config', 'app.json');
  console.log('Ruta absoluta:', absolutePath);
  
  // Resolver desde directorio específico
  const fromSpecificDir = path.resolve('/home/user', 'projects', 'app');
  console.log('Desde directorio específico:', fromSpecificDir);
  
  // Resolver con directorio actual
  const withCurrentDir = path.resolve('.', 'src', 'index.js');
  console.log('Con directorio actual:', withCurrentDir);
  
  // Resolver con directorio padre
  const withParentDir = path.resolve('..', 'shared', 'utils.js');
  console.log('Con directorio padre:', withParentDir);
}

// path.dirname - Obtener directorio
function demonstratePathDirname() {
  const filePath = '/home/user/projects/app/src/components/Button.js';
  
  // Obtener directorio del archivo
  const dirname = path.dirname(filePath);
  console.log('Directorio del archivo:', dirname); // /home/user/projects/app/src/components
  
  // Obtener directorio del directorio
  const parentDir = path.dirname(dirname);
  console.log('Directorio padre:', parentDir); // /home/user/projects/app/src
  
  // Obtener directorio raíz
  const rootDir = path.dirname('/');
  console.log('Directorio raíz:', rootDir); // /
}

// path.basename - Obtener nombre del archivo
function demonstratePathBasename() {
  const filePath = '/home/user/projects/app/src/components/Button.js';
  
  // Obtener nombre completo del archivo
  const basename = path.basename(filePath);
  console.log('Nombre del archivo:', basename); // Button.js
  
  // Obtener nombre sin extensión
  const nameWithoutExt = path.basename(filePath, '.js');
  console.log('Nombre sin extensión:', nameWithoutExt); // Button
  
  // Obtener nombre con extensión específica
  const nameWithExt = path.basename(filePath, path.extname(filePath));
  console.log('Nombre con extensión:', nameWithExt); // Button
  
  // Obtener nombre de directorio
  const dirPath = '/home/user/projects/app/src/components';
  const dirName = path.basename(dirPath);
  console.log('Nombre del directorio:', dirName); // components
}

// path.extname - Obtener extensión del archivo
function demonstratePathExtname() {
  // Archivos con extensión
  console.log('Extensión .js:', path.extname('app.js'));           // .js
  console.log('Extensión .tsx:', path.extname('Component.tsx'));   // .tsx
  console.log('Extensión .json:', path.extname('config.json'));    // .json
  
  // Archivos sin extensión
  console.log('Sin extensión:', path.extname('README'));           // ''
  console.log('Punto final:', path.extname('file.'));             // ''
  
  // Archivos con múltiples puntos
  console.log('Múltiples puntos:', path.extname('app.min.js'));    // .js
  
  // Rutas completas
  const fullPath = '/home/user/projects/app/src/index.js';
  console.log('Extensión de ruta completa:', path.extname(fullPath)); // .js
}

// path.parse - Parsear ruta completa
function demonstratePathParse() {
  const filePath = '/home/user/projects/app/src/components/Button.js';
  
  const parsed = path.parse(filePath);
  console.log('Ruta parseada:', parsed);
  
  // Resultado:
  // {
  //   root: '/',
  //   dir: '/home/user/projects/app/src/components',
  //   base: 'Button.js',
  //   ext: '.js',
  //   name: 'Button'
  // }
  
  // Reconstruir ruta
  const reconstructed = path.format(parsed);
  console.log('Ruta reconstruida:', reconstructed); // /home/user/projects/app/src/components/Button.js
  
  // Modificar componentes
  parsed.name = 'NewButton';
  parsed.ext = '.tsx';
  const modifiedPath = path.format(parsed);
  console.log('Ruta modificada:', modifiedPath); // /home/user/projects/app/src/components/NewButton.tsx
}

// path.normalize - Normalizar ruta
function demonstratePathNormalize() {
  // Rutas con separadores múltiples
  const messyPath = '/home//user///projects//app//src//index.js';
  const normalized = path.normalize(messyPath);
  console.log('Ruta normalizada:', normalized); // /home/user/projects/app/src/index.js
  
  // Rutas con directorios especiales
  const specialPath = '/home/user/projects/app/src/../config/database.json';
  const resolved = path.normalize(specialPath);
  console.log('Ruta resuelta:', resolved); // /home/user/projects/app/config/database.json
  
  // Rutas relativas
  const relativePath = './src/../dist/./assets/image.png';
  const cleanPath = path.normalize(relativePath);
  console.log('Ruta relativa limpia:', cleanPath); // dist/assets/image.png
}

// path.relative - Obtener ruta relativa
function demonstratePathRelative() {
  const from = '/home/user/projects/app';
  const to = '/home/user/projects/app/src/components/Button.js';
  
  const relative = path.relative(from, to);
  console.log('Ruta relativa:', relative); // src/components/Button.js
  
  // Con directorio padre
  const fromParent = '/home/user/projects';
  const toFile = '/home/user/projects/app/src/index.js';
  
  const relativeFromParent = path.relative(fromParent, toFile);
  console.log('Ruta relativa desde padre:', relativeFromParent); // app/src/index.js
  
  // Con directorio hijo
  const fromChild = '/home/user/projects/app/src';
  const toComponent = '/home/user/projects/app/src/components/Button.js';
  
  const relativeFromChild = path.relative(fromChild, toComponent);
  console.log('Ruta relativa desde hijo:', relativeFromChild); // components/Button.js
}

// path.isAbsolute - Verificar si es ruta absoluta
function demonstratePathIsAbsolute() {
  // Rutas absolutas
  console.log('Ruta absoluta Unix:', path.isAbsolute('/home/user'));        // true
  console.log('Ruta absoluta Windows:', path.isAbsolute('C:\\Users\\Juan')); // true (en Windows)
  
  // Rutas relativas
  console.log('Ruta relativa:', path.isAbsolute('./src'));                  // false
  console.log('Ruta relativa:', path.isAbsolute('../config'));              // false
  console.log('Ruta relativa:', path.isAbsolute('components/Button.js'));   // false
  
  // Rutas especiales
  console.log('Directorio actual:', path.isAbsolute('.'));                  // false
  console.log('Directorio padre:', path.isAbsolute('..'));                  // false
}
```

## 🧪 Pruebas Unitarias - Módulo path

```javascript
// tests/path.test.js
const path = require('path');
const { 
  demonstratePathJoin,
  demonstratePathResolve,
  demonstratePathDirname,
  demonstratePathBasename,
  demonstratePathExtname,
  demonstratePathParse,
  demonstratePathNormalize,
  demonstratePathRelative,
  demonstratePathIsAbsolute
} = require('../src/path');

describe('Módulo path', () => {
  describe('path.join', () => {
    test('debe unir segmentos de ruta correctamente', () => {
      const result = path.join('usr', 'local', 'bin');
      expect(result).toMatch(/usr[\/\\]local[\/\\]bin/);
    });
    
    test('debe manejar directorio actual', () => {
      const result = path.join('.', 'src', 'components');
      expect(result).toMatch(/\.?[\/\\]src[\/\\]components/);
    });
    
    test('debe manejar directorio padre', () => {
      const result = path.join('..', 'config', 'database.json');
      expect(result).toMatch(/\.\.[\/\\]config[\/\\]database\.json/);
    });
  });
  
  describe('path.resolve', () => {
    test('debe resolver ruta absoluta', () => {
      const result = path.resolve('config', 'app.json');
      expect(path.isAbsolute(result)).toBe(true);
    });
    
    test('debe resolver desde directorio específico', () => {
      const result = path.resolve('/home/user', 'projects', 'app');
      expect(result).toMatch(/\/home\/user\/projects\/app/);
    });
  });
  
  describe('path.dirname', () => {
    test('debe obtener directorio del archivo', () => {
      const result = path.dirname('/home/user/projects/app/src/index.js');
      expect(result).toBe('/home/user/projects/app/src');
    });
    
    test('debe obtener directorio padre', () => {
      const result = path.dirname('/home/user/projects/app/src');
      expect(result).toBe('/home/user/projects/app');
    });
  });
  
  describe('path.basename', () => {
    test('debe obtener nombre del archivo', () => {
      const result = path.basename('/home/user/projects/app/src/index.js');
      expect(result).toBe('index.js');
    });
    
    test('debe obtener nombre sin extensión', () => {
      const result = path.basename('/home/user/projects/app/src/index.js', '.js');
      expect(result).toBe('index');
    });
  });
  
  describe('path.extname', () => {
    test('debe obtener extensión correcta', () => {
      expect(path.extname('app.js')).toBe('.js');
      expect(path.extname('Component.tsx')).toBe('.tsx');
      expect(path.extname('config.json')).toBe('.json');
    });
    
    test('debe manejar archivos sin extensión', () => {
      expect(path.extname('README')).toBe('');
      expect(path.extname('file.')).toBe('');
    });
  });
  
  describe('path.parse', () => {
    test('debe parsear ruta correctamente', () => {
      const result = path.parse('/home/user/projects/app/src/index.js');
      
      expect(result.root).toBe('/');
      expect(result.dir).toBe('/home/user/projects/app/src');
      expect(result.base).toBe('index.js');
      expect(result.ext).toBe('.js');
      expect(result.name).toBe('index');
    });
    
    test('debe reconstruir ruta correctamente', () => {
      const original = '/home/user/projects/app/src/index.js';
      const parsed = path.parse(original);
      const reconstructed = path.format(parsed);
      
      expect(reconstructed).toBe(original);
    });
  });
  
  describe('path.normalize', () => {
    test('debe normalizar separadores múltiples', () => {
      const result = path.normalize('/home//user///projects//app//src//index.js');
      expect(result).toBe('/home/user/projects/app/src/index.js');
    });
    
    test('debe resolver directorios especiales', () => {
      const result = path.normalize('/home/user/projects/app/src/../config/database.json');
      expect(result).toBe('/home/user/projects/app/config/database.json');
    });
  });
  
  describe('path.relative', () => {
    test('debe obtener ruta relativa correctamente', () => {
      const result = path.relative('/home/user/projects/app', '/home/user/projects/app/src/components/Button.js');
      expect(result).toBe('src/components/Button.js');
    });
  });
  
  describe('path.isAbsolute', () => {
    test('debe identificar rutas absolutas', () => {
      expect(path.isAbsolute('/home/user')).toBe(true);
      expect(path.isAbsolute('./src')).toBe(false);
      expect(path.isAbsolute('../config')).toBe(false);
    });
  });
});
```

## 🌐 Módulo url

### Parsing y Formateo de URLs

```javascript
const url = require('url');

// url.parse - Parsear URL (deprecated, usar URL constructor)
function demonstrateUrlParse() {
  // URL básica
  const urlString = 'https://www.example.com:8080/path/to/page?query=value&sort=asc#section1';
  
  const parsed = url.parse(urlString, true); // true para parsear query string
  console.log('URL parseada:', parsed);
  
  // Resultado:
  // {
  //   protocol: 'https:',
  //   slashes: true,
  //   auth: null,
  //   host: 'www.example.com:8080',
  //   port: '8080',
  //   hostname: 'www.example.com',
  //   hash: '#section1',
  //   search: '?query=value&sort=asc',
  //   query: { query: 'value', sort: 'asc' },
  //   pathname: '/path/to/page',
  //   path: '/path/to/page?query=value&sort=asc',
  //   href: 'https://www.example.com:8080/path/to/page?query=value&sort=asc#section1'
  // }
  
  // Acceder a componentes específicos
  console.log('Protocolo:', parsed.protocol);
  console.log('Hostname:', parsed.hostname);
  console.log('Puerto:', parsed.port);
  console.log('Pathname:', parsed.pathname);
  console.log('Query:', parsed.query);
  console.log('Hash:', parsed.hash);
}

// URL constructor (recomendado)
function demonstrateUrlConstructor() {
  // Crear URL desde string
  const url1 = new URL('https://www.example.com:8080/path/to/page?query=value&sort=asc#section1');
  
  console.log('URL completa:', url1.href);
  console.log('Protocolo:', url1.protocol);
  console.log('Hostname:', url1.hostname);
  console.log('Puerto:', url1.port);
  console.log('Pathname:', url1.pathname);
  console.log('Search:', url1.search);
  console.log('Hash:', url1.hash);
  
  // Acceder a parámetros de query
  console.log('Query query:', url1.searchParams.get('query'));
  console.log('Query sort:', url1.searchParams.get('sort'));
  
  // Iterar sobre parámetros de query
  console.log('Todos los parámetros:');
  url1.searchParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  
  // Crear URL desde componentes
  const url2 = new URL('/path/to/page', 'https://www.example.com');
  url2.searchParams.set('query', 'value');
  url2.searchParams.set('sort', 'asc');
  url2.hash = 'section1';
  
  console.log('URL construida:', url2.href);
}

// url.format - Formatear URL
function demonstrateUrlFormat() {
  // Formatear desde objeto parseado
  const urlObject = {
    protocol: 'https:',
    host: 'www.example.com:8080',
    pathname: '/path/to/page',
    search: '?query=value&sort=asc',
    hash: '#section1'
  };
  
  const formatted = url.format(urlObject);
  console.log('URL formateada:', formatted);
  
  // Formatear desde URL constructor
  const urlInstance = new URL('https://www.example.com');
  urlInstance.pathname = '/api/users';
  urlInstance.searchParams.set('page', '1');
  urlInstance.searchParams.set('limit', '10');
  
  console.log('URL formateada desde instancia:', urlInstance.href);
}

// Manipulación de parámetros de query
function demonstrateQueryParams() {
  const url = new URL('https://api.example.com/users');
  
  // Agregar parámetros
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '20');
  url.searchParams.set('sort', 'name');
  url.searchParams.set('order', 'asc');
  
  console.log('URL con parámetros:', url.href);
  
  // Obtener parámetros
  console.log('Página:', url.searchParams.get('page'));
  console.log('Límite:', url.searchParams.get('limit'));
  console.log('Ordenamiento:', url.searchParams.get('sort'));
  
  // Verificar existencia
  console.log('¿Tiene página?', url.searchParams.has('page'));
  console.log('¿Tiene filtro?', url.searchParams.has('filter'));
  
  // Eliminar parámetros
  url.searchParams.delete('sort');
  console.log('URL sin sort:', url.href);
  
  // Obtener todos los parámetros
  const allParams = {};
  url.searchParams.forEach((value, key) => {
    allParams[key] = value;
  });
  console.log('Todos los parámetros:', allParams);
  
  // Agregar múltiples valores para el mismo parámetro
  url.searchParams.append('tag', 'javascript');
  url.searchParams.append('tag', 'nodejs');
  console.log('Tags:', url.searchParams.getAll('tag'));
}

// URLs relativas y absolutas
function demonstrateRelativeUrls() {
  // URL base
  const baseUrl = 'https://www.example.com/api/v1';
  
  // Resolver URL relativa
  const relativeUrl = new URL('users/123', baseUrl);
  console.log('URL relativa resuelta:', relativeUrl.href);
  
  // Resolver con parámetros
  const relativeWithParams = new URL('users?page=1&limit=10', baseUrl);
  console.log('URL relativa con parámetros:', relativeWithParams.href);
  
  // Resolver desde directorio
  const fromDirectory = new URL('../v2/users', baseUrl);
  console.log('Desde directorio:', fromDirectory.href);
  
  // Resolver desde raíz
  const fromRoot = new URL('/docs/api', baseUrl);
  console.log('Desde raíz:', fromRoot.href);
}

// Validación de URLs
function demonstrateUrlValidation() {
  // URLs válidas
  const validUrls = [
    'https://www.example.com',
    'http://localhost:3000',
    'ftp://ftp.example.com/files',
    'mailto:user@example.com',
    'tel:+1234567890'
  ];
  
  validUrls.forEach(urlString => {
    try {
      const url = new URL(urlString);
      console.log(`✅ ${urlString} es válida`);
      console.log(`   Protocolo: ${url.protocol}`);
      console.log(`   Host: ${url.host}`);
    } catch (error) {
      console.log(`❌ ${urlString} no es válida: ${error.message}`);
    }
  });
  
  // URLs inválidas
  const invalidUrls = [
    'not-a-url',
    'http://',
    'https://.com',
    'ftp://invalid:port:',
    'mailto:'
  ];
  
  invalidUrls.forEach(urlString => {
    try {
      const url = new URL(urlString);
      console.log(`✅ ${urlString} es válida (inesperado)`);
    } catch (error) {
      console.log(`❌ ${urlString} no es válida: ${error.message}`);
    }
  });
}
```

## 🧪 Pruebas Unitarias - Módulo url

```javascript
// tests/url.test.js
const url = require('url');
const { 
  demonstrateUrlParse,
  demonstrateUrlConstructor,
  demonstrateUrlFormat,
  demonstrateQueryParams,
  demonstrateRelativeUrls,
  demonstrateUrlValidation
} = require('../src/url');

describe('Módulo url', () => {
  describe('URL Constructor', () => {
    test('debe parsear URL correctamente', () => {
      const urlInstance = new URL('https://www.example.com:8080/path?query=value#hash');
      
      expect(urlInstance.protocol).toBe('https:');
      expect(urlInstance.hostname).toBe('www.example.com');
      expect(urlInstance.port).toBe('8080');
      expect(urlInstance.pathname).toBe('/path');
      expect(urlInstance.search).toBe('?query=value');
      expect(urlInstance.hash).toBe('#hash');
    });
    
    test('debe manejar parámetros de query', () => {
      const urlInstance = new URL('https://api.example.com/users?page=1&limit=10');
      
      expect(urlInstance.searchParams.get('page')).toBe('1');
      expect(urlInstance.searchParams.get('limit')).toBe('10');
      expect(urlInstance.searchParams.has('page')).toBe(true);
      expect(urlInstance.searchParams.has('filter')).toBe(false);
    });
    
    test('debe agregar y eliminar parámetros', () => {
      const urlInstance = new URL('https://api.example.com/users');
      
      urlInstance.searchParams.set('page', '1');
      urlInstance.searchParams.set('limit', '20');
      
      expect(urlInstance.searchParams.get('page')).toBe('1');
      expect(urlInstance.searchParams.get('limit')).toBe('20');
      
      urlInstance.searchParams.delete('page');
      expect(urlInstance.searchParams.has('page')).toBe(false);
    });
  });
  
  describe('URLs Relativas', () => {
    test('debe resolver URLs relativas correctamente', () => {
      const baseUrl = 'https://www.example.com/api/v1';
      const relativeUrl = new URL('users/123', baseUrl);
      
      expect(relativeUrl.href).toBe('https://www.example.com/api/v1/users/123');
    });
    
    test('debe resolver desde directorio', () => {
      const baseUrl = 'https://www.example.com/api/v1/users';
      const relativeUrl = new URL('../v2/users', baseUrl);
      
      expect(relativeUrl.href).toBe('https://www.example.com/api/v2/users');
    });
  });
  
  describe('Validación de URLs', () => {
    test('debe validar URLs válidas', () => {
      const validUrls = [
        'https://www.example.com',
        'http://localhost:3000',
        'ftp://ftp.example.com'
      ];
      
      validUrls.forEach(urlString => {
        expect(() => new URL(urlString)).not.toThrow();
      });
    });
    
    test('debe rechazar URLs inválidas', () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        'https://.com'
      ];
      
      invalidUrls.forEach(urlString => {
        expect(() => new URL(urlString)).toThrow();
      });
    });
  });
});
```

## 📝 Puntos Clave - Módulos de Utilidad

### ✅ Conceptos Esenciales

1. **util**: Funciones de utilidad general, promisify, callbackify
2. **path**: Manipulación de rutas de archivos, join, resolve, dirname, basename
3. **url**: Parsing y formateo de URLs, URL constructor, searchParams
4. **querystring**: Parsing de query strings (deprecated, usar URL)
5. **crypto**: Funcionalidades criptográficas
6. **os**: Información del sistema operativo
7. **assert**: Testing y validaciones

### ⚠️ Errores Comunes

1. **Usar url.parse** (deprecated) en lugar de URL constructor
2. **No manejar errores** en operaciones de utilidad
3. **Confundir path.join** con path.resolve
4. **No validar URLs** antes de usarlas
5. **Olvidar promisify** para convertir callbacks a promises

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre `path.join` y `path.resolve`?
2. ¿Cómo se convierte una función callback a promise usando util?
3. ¿Qué método se usa para obtener la extensión de un archivo?
4. ¿Cómo se accede a los parámetros de query en una URL?
5. ¿Cuál es la diferencia entre `util.inspect` y `util.format`?

---

**¡Continuemos con la siguiente sección: Testing y Debugging!**
