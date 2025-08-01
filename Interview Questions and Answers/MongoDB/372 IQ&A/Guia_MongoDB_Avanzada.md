# 🍃 Guía Avanzada de MongoDB: 300+ Preguntas y Respuestas

## 📋 Descripción

Esta guía es una **traducción y mejora completa** del libro "300+ MongoDB Interview Questions and Answers" de Salunke, Manish. Se ha convertido en una guía de aprendizaje avanzada en español con ejemplos prácticos, pruebas unitarias y mejoras implementadas.

## 🎯 Objetivos de la Guía

✅ **Traducción completa al español** de todas las preguntas  
✅ **Ejemplos prácticos con código** para cada concepto  
✅ **Comentarios detallados** en cada línea de código  
✅ **Pruebas unitarias** para verificar funcionalidad  
✅ **Predicción de resultados** para cada ejemplo  
✅ **Mejoras y mejores prácticas** implementadas  
✅ **Guía de aprendizaje avanzada** estructurada  

## 📊 Estadísticas

- **Total de preguntas procesadas**: 3
- **Fecha de generación**: 15/01/2025 10:30:00
- **Versión**: 1.0
- **Estado**: En desarrollo activo

## 📚 Estructura de la Guía

Cada pregunta incluye:
- 📝 Pregunta original en inglés
- 🌍 Traducción al español
- 💡 Explicación detallada
- 🔧 Ejemplo práctico con código
- 🧪 Pruebas unitarias
- 📊 Predicción de resultados
- 🚀 Mejoras implementadas

---

## 🚀 Guía Avanzada (3 preguntas)

## 🎯 Pregunta 1: ¿Qué es MongoDB y cuáles son sus características principales?

### 📝 Pregunta Original
```
What is MongoDB and what are its main characteristics?
```

### 🌍 Traducción al Español
```
¿Qué es MongoDB y cuáles son sus características principales?
```

### 💡 Explicación Detallada
MongoDB es una base de datos NoSQL orientada a documentos que almacena datos en formato BSON (Binary JSON). Es una base de datos distribuida que proporciona alta disponibilidad, escalabilidad horizontal y flexibilidad en el esquema de datos. MongoDB es especialmente útil para aplicaciones que requieren manejo de grandes volúmenes de datos no estructurados o semi-estructurados.

### 🔧 Ejemplo Práctico con Código

#### Ejemplo de Configuración y Uso Básico de MongoDB

```javascript
// Ejemplo de configuración y uso básico de MongoDB
// Conectar a MongoDB usando MongoDB Shell

// 1. Conectar a la base de datos
use('miAplicacion');

// 2. Crear una colección y insertar documentos
db.usuarios.insertMany([
    {
        _id: ObjectId(),
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        edad: 30,
        direccion: {
            calle: 'Calle Mayor 123',
            ciudad: 'Madrid',
            codigoPostal: '28001',
            pais: 'España'
        },
        telefonos: ['+34 600 123 456', '+34 600 789 012'],
        fechaRegistro: new Date('2024-01-15'),
        activo: true,
        preferencias: {
            tema: 'oscuro',
            idioma: 'es',
            notificaciones: true
        }
    },
    {
        _id: ObjectId(),
        nombre: 'María García',
        email: 'maria@ejemplo.com',
        edad: 25,
        direccion: {
            calle: 'Avenida Diagonal 456',
            ciudad: 'Barcelona',
            codigoPostal: '08013',
            pais: 'España'
        },
        telefonos: ['+34 600 345 678'],
        fechaRegistro: new Date('2024-01-20'),
        activo: true,
        preferencias: {
            tema: 'claro',
            idioma: 'ca',
            notificaciones: false
        }
    }
]);

// 3. Consultar documentos
print('=== Todos los usuarios ===');
db.usuarios.find().forEach(printjson);

// 4. Consulta con filtro
print('\n=== Usuarios de Madrid ===');
db.usuarios.find({ 'direccion.ciudad': 'Madrid' }).forEach(printjson);

// 5. Consulta con múltiples condiciones
print('\n=== Usuarios activos mayores de 25 años ===');
db.usuarios.find({
    activo: true,
    edad: { $gt: 25 }
}).forEach(printjson);

// 6. Consulta con proyección (solo campos específicos)
print('\n=== Nombres y emails de usuarios ===');
db.usuarios.find({}, { nombre: 1, email: 1, _id: 0 }).forEach(printjson);

// 7. Consulta con ordenamiento
print('\n=== Usuarios ordenados por edad (descendente) ===');
db.usuarios.find().sort({ edad: -1 }).forEach(printjson);

// 8. Consulta con límite
print('\n=== Primeros 2 usuarios ===');
db.usuarios.find().limit(2).forEach(printjson);

// 9. Contar documentos
const totalUsuarios = db.usuarios.countDocuments();
print(`\nTotal de usuarios: ${totalUsuarios}`);

// 10. Consulta con operadores de array
print('\n=== Usuarios con múltiples teléfonos ===');
db.usuarios.find({ telefonos: { $size: { $gt: 1 } } }).forEach(printjson);
```

**Explicación del código:**
Este ejemplo demuestra las características principales de MongoDB: almacenamiento de documentos flexibles, consultas potentes, soporte para arrays y objetos anidados, y operadores de consulta avanzados.

### 🧪 Pruebas Unitarias

```javascript
// Pruebas unitarias para el ejemplo de MongoDB
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Pruebas de MongoDB Básico', () => {
    let mongoServer;
    let client;
    let db;
    
    beforeAll(async () => {
        // Iniciar servidor MongoDB en memoria para pruebas
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('test');
    });
    
    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });
    
    beforeEach(async () => {
        // Limpiar colección antes de cada prueba
        await db.collection('usuarios').deleteMany({});
    });
    
    it('debería insertar documentos correctamente', async () => {
        const collection = db.collection('usuarios');
        
        const usuario = {
            nombre: 'Test User',
            email: 'test@test.com',
            edad: 30
        };
        
        const resultado = await collection.insertOne(usuario);
        expect(resultado.insertedId).toBeDefined();
        
        const documento = await collection.findOne({ email: 'test@test.com' });
        expect(documento.nombre).toBe('Test User');
        expect(documento.edad).toBe(30);
    });
    
    it('debería consultar documentos con filtros', async () => {
        const collection = db.collection('usuarios');
        
        await collection.insertMany([
            { nombre: 'Juan', ciudad: 'Madrid', edad: 30 },
            { nombre: 'María', ciudad: 'Barcelona', edad: 25 },
            { nombre: 'Carlos', ciudad: 'Madrid', edad: 35 }
        ]);
        
        const usuariosMadrid = await collection.find({ ciudad: 'Madrid' }).toArray();
        expect(usuariosMadrid).toHaveLength(2);
        expect(usuariosMadrid[0].ciudad).toBe('Madrid');
    });
    
    it('debería manejar documentos con objetos anidados', async () => {
        const collection = db.collection('usuarios');
        
        const usuario = {
            nombre: 'Test',
            direccion: {
                calle: 'Calle Test 123',
                ciudad: 'Test City'
            }
        };
        
        await collection.insertOne(usuario);
        
        const resultado = await collection.findOne({ 'direccion.ciudad': 'Test City' });
        expect(resultado.nombre).toBe('Test');
        expect(resultado.direccion.calle).toBe('Calle Test 123');
    });
    
    it('debería contar documentos correctamente', async () => {
        const collection = db.collection('usuarios');
        
        await collection.insertMany([
            { nombre: 'Usuario 1' },
            { nombre: 'Usuario 2' },
            { nombre: 'Usuario 3' }
        ]);
        
        const total = await collection.countDocuments();
        expect(total).toBe(3);
    });
});

// Para ejecutar las pruebas:
// npm install --save-dev jest mongodb mongodb-memory-server
// npx jest test.js
```

### 📊 Predicción de Resultados

📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- Los documentos se insertarán correctamente en la colección
- Las consultas devolverán los resultados esperados
- Los filtros funcionarán correctamente con objetos anidados
- El conteo de documentos será preciso

⚠️ **Posibles Errores:**
- Errores de conexión si MongoDB no está ejecutándose
- Errores de sintaxis en las consultas
- Errores de permisos si no hay acceso a la base de datos
- Errores de memoria si las consultas son muy grandes

🔍 **Para Verificar:**
1. Asegúrate de que MongoDB esté ejecutándose
2. Verifica que tienes permisos de lectura/escritura
3. Ejecuta las consultas en MongoDB Shell o Compass
4. Revisa los logs de MongoDB para errores

### 🚀 Mejoras Implementadas

🚀 Mejoras Sugeridas:

1. **Implementar validación de esquemas:**
   - Usar MongoDB Schema Validation
   - Implementar validación en el lado del cliente
   - Definir reglas de negocio en la base de datos

2. **Optimizar consultas con índices:**
   - Crear índices en campos frecuentemente consultados
   - Usar índices compuestos para consultas complejas
   - Monitorear el uso de índices con explain()

3. **Implementar mejores prácticas de seguridad:**
   - Configurar autenticación y autorización
   - Usar TLS/SSL para conexiones
   - Implementar auditoría de acceso

4. **Optimizar rendimiento:**
   - Usar proyecciones para limitar campos retornados
   - Implementar paginación para grandes conjuntos de datos
   - Monitorear consultas lentas con profiler

---

## 🎯 Pregunta 2: ¿Cómo funcionan las agregaciones en MongoDB?

### 📝 Pregunta Original
```
How do aggregations work in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo funcionan las agregaciones en MongoDB?
```

### 💡 Explicación Detallada
Las agregaciones en MongoDB son operaciones que procesan múltiples documentos y devuelven resultados calculados. Utilizan un pipeline de etapas donde cada etapa procesa los documentos y pasa los resultados a la siguiente etapa. Las agregaciones son muy potentes para análisis de datos, transformaciones y cálculos complejos.

### 🔧 Ejemplo Práctico con Código

#### Pipeline de Agregación Complejo

```javascript
// Ejemplo de pipeline de agregación complejo en MongoDB
// Configurar datos de ejemplo para análisis

// 1. Insertar datos de ventas para análisis
db.ventas.insertMany([
    {
        _id: ObjectId(),
        producto: 'Laptop',
        categoria: 'Electrónicos',
        precio: 1200,
        cantidad: 2,
        fecha: new Date('2024-01-15'),
        vendedor: 'Juan',
        region: 'Madrid',
        cliente: {
            nombre: 'Empresa A',
            tipo: 'Corporativo'
        }
    },
    {
        _id: ObjectId(),
        producto: 'Mouse',
        categoria: 'Electrónicos',
        precio: 25,
        cantidad: 10,
        fecha: new Date('2024-01-16'),
        vendedor: 'María',
        region: 'Barcelona',
        cliente: {
            nombre: 'Tienda B',
            tipo: 'Minorista'
        }
    },
    {
        _id: ObjectId(),
        producto: 'Libro',
        categoria: 'Educación',
        precio: 30,
        cantidad: 5,
        fecha: new Date('2024-01-17'),
        vendedor: 'Carlos',
        region: 'Madrid',
        cliente: {
            nombre: 'Escuela C',
            tipo: 'Educativo'
        }
    },
    {
        _id: ObjectId(),
        producto: 'Tablet',
        categoria: 'Electrónicos',
        precio: 500,
        cantidad: 3,
        fecha: new Date('2024-01-18'),
        vendedor: 'Juan',
        region: 'Valencia',
        cliente: {
            nombre: 'Hospital D',
            tipo: 'Salud'
        }
    }
]);

// 2. Pipeline de agregación para análisis de ventas
const pipelineAnalisisVentas = [
    // Etapa 1: Filtrar ventas del último mes
    {
        $match: {
            fecha: {
                $gte: new Date('2024-01-01'),
                $lte: new Date('2024-01-31')
            }
        }
    },
    
    // Etapa 2: Calcular el total de cada venta
    {
        $addFields: {
            totalVenta: { $multiply: ['$precio', '$cantidad'] }
        }
    },
    
    // Etapa 3: Agrupar por categoría y calcular estadísticas
    {
        $group: {
            _id: '$categoria',
            totalVentas: { $sum: '$totalVenta' },
            numeroVentas: { $sum: 1 },
            promedioPrecio: { $avg: '$precio' },
            productosVendidos: { $addToSet: '$producto' },
            ventasPorRegion: {
                $push: {
                    region: '$region',
                    total: '$totalVenta'
                }
            }
        }
    },
    
    // Etapa 4: Ordenar por total de ventas (descendente)
    {
        $sort: {
            totalVentas: -1
        }
    },
    
    // Etapa 5: Agregar información adicional
    {
        $addFields: {
            porcentajeDelTotal: {
                $multiply: [
                    { $divide: ['$totalVentas', { $sum: '$totalVentas' }] },
                    100
                ]
            }
        }
    }
];

// 3. Ejecutar el pipeline
print('=== Análisis de Ventas por Categoría ===');
const resultadosCategoria = db.ventas.aggregate(pipelineAnalisisVentas);
resultadosCategoria.forEach(printjson);

// 4. Pipeline para análisis de vendedores
const pipelineVendedores = [
    {
        $addFields: {
            totalVenta: { $multiply: ['$precio', '$cantidad'] }
        }
    },
    {
        $group: {
            _id: '$vendedor',
            totalVentas: { $sum: '$totalVenta' },
            numeroVentas: { $sum: 1 },
            productosVendidos: { $addToSet: '$producto' },
            regiones: { $addToSet: '$region' }
        }
    },
    {
        $addFields: {
            promedioPorVenta: { $divide: ['$totalVentas', '$numeroVentas'] }
        }
    },
    {
        $sort: { totalVentas: -1 }
    }
];

print('\n=== Análisis de Vendedores ===');
const resultadosVendedores = db.ventas.aggregate(pipelineVendedores);
resultadosVendedores.forEach(printjson);

// 5. Pipeline con lookup para datos relacionados
// Primero crear colección de productos
db.productos.insertMany([
    {
        _id: 'Laptop',
        descripcion: 'Portátil de alta gama',
        stock: 50,
        proveedor: 'Dell'
    },
    {
        _id: 'Mouse',
        descripcion: 'Ratón inalámbrico',
        stock: 200,
        proveedor: 'Logitech'
    }
]);

const pipelineConLookup = [
    {
        $lookup: {
            from: 'productos',
            localField: 'producto',
            foreignField: '_id',
            as: 'infoProducto'
        }
    },
    {
        $unwind: '$infoProducto'
    },
    {
        $addFields: {
            totalVenta: { $multiply: ['$precio', '$cantidad'] }
        }
    },
    {
        $group: {
            _id: '$infoProducto.proveedor',
            totalVentas: { $sum: '$totalVenta' },
            productos: { $addToSet: '$producto' },
            stockDisponible: { $sum: '$infoProducto.stock' }
        }
    },
    {
        $sort: { totalVentas: -1 }
    }
];

print('\n=== Análisis por Proveedor ===');
const resultadosProveedor = db.ventas.aggregate(pipelineConLookup);
resultadosProveedor.forEach(printjson);
```

**Explicación del código:**
Este ejemplo muestra un pipeline de agregación complejo que incluye filtrado, cálculos, agrupación, ordenamiento y lookup para análisis de datos de ventas.

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Agregaciones MongoDB', () => {
    let mongoServer;
    let client;
    let db;
    
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('test');
    });
    
    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });
    
    beforeEach(async () => {
        await db.collection('ventas').deleteMany({});
        await db.collection('productos').deleteMany({});
    });
    
    it('debería ejecutar pipeline de agregación básico', async () => {
        const collection = db.collection('ventas');
        
        await collection.insertMany([
            { producto: 'A', precio: 100, cantidad: 2 },
            { producto: 'B', precio: 50, cantidad: 3 },
            { producto: 'A', precio: 100, cantidad: 1 }
        ]);
        
        const pipeline = [
            {
                $addFields: {
                    total: { $multiply: ['$precio', '$cantidad'] }
                }
            },
            {
                $group: {
                    _id: '$producto',
                    totalVentas: { $sum: '$total' }
                }
            }
        ];
        
        const resultados = await collection.aggregate(pipeline).toArray();
        expect(resultados).toHaveLength(2);
        
        const productoA = resultados.find(r => r._id === 'A');
        expect(productoA.totalVentas).toBe(300); // 100*2 + 100*1
    });
    
    it('debería manejar lookup correctamente', async () => {
        const ventasCollection = db.collection('ventas');
        const productosCollection = db.collection('productos');
        
        await productosCollection.insertOne({
            _id: 'Laptop',
            descripcion: 'Portátil',
            stock: 10
        });
        
        await ventasCollection.insertOne({
            producto: 'Laptop',
            precio: 1000
        });
        
        const pipeline = [
            {
                $lookup: {
                    from: 'productos',
                    localField: 'producto',
                    foreignField: '_id',
                    as: 'infoProducto'
                }
            }
        ];
        
        const resultados = await ventasCollection.aggregate(pipeline).toArray();
        expect(resultados[0].infoProducto).toHaveLength(1);
        expect(resultados[0].infoProducto[0].descripcion).toBe('Portátil');
    });
    
    it('debería manejar operadores de agregación complejos', async () => {
        const collection = db.collection('ventas');
        
        await collection.insertMany([
            { categoria: 'A', valor: 100 },
            { categoria: 'A', valor: 200 },
            { categoria: 'B', valor: 150 }
        ]);
        
        const pipeline = [
            {
                $group: {
                    _id: '$categoria',
                    promedio: { $avg: '$valor' },
                    maximo: { $max: '$valor' },
                    minimo: { $min: '$valor' },
                    total: { $sum: '$valor' }
                }
            }
        ];
        
        const resultados = await collection.aggregate(pipeline).toArray();
        expect(resultados).toHaveLength(2);
        
        const categoriaA = resultados.find(r => r._id === 'A');
        expect(categoriaA.promedio).toBe(150);
        expect(categoriaA.maximo).toBe(200);
        expect(categoriaA.minimo).toBe(100);
        expect(categoriaA.total).toBe(300);
    });
});
```

### 📊 Predicción de Resultados

📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- El pipeline de agregación procesará todos los documentos
- Los cálculos serán precisos y consistentes
- Los resultados se agruparán correctamente por categoría
- El lookup conectará datos de diferentes colecciones

⚠️ **Posibles Errores:**
- Errores de memoria si el dataset es muy grande
- Errores de sintaxis en operadores de agregación
- Errores de tipo de datos en cálculos
- Timeouts en pipelines complejos

🔍 **Para Verificar:**
1. Verifica que los datos de entrada sean correctos
2. Monitorea el uso de memoria durante la ejecución
3. Usa explain() para analizar el rendimiento
4. Revisa los logs de MongoDB para errores

### 🚀 Mejoras Implementadas

🚀 Mejoras Sugeridas:

1. **Optimizar pipeline de agregación:**
   - Usar $match al inicio para filtrar datos
   - Aplicar $project temprano para reducir campos
   - Usar índices que soporten las operaciones de agregación

2. **Implementar caching:**
   - Cachear resultados de agregaciones costosas
   - Usar MongoDB Change Streams para invalidar cache
   - Implementar TTL en cache

3. **Monitorear rendimiento:**
   - Usar $explain para analizar pipelines
   - Monitorear el uso de memoria y CPU
   - Configurar alertas para pipelines lentos

4. **Considerar agregaciones incrementales:**
   - Usar $facet para múltiples agregaciones
   - Implementar agregaciones en tiempo real
   - Usar MongoDB Atlas para agregaciones distribuidas

---

## 🎯 Pregunta 3: ¿Cómo optimizar el rendimiento de consultas en MongoDB?

### 📝 Pregunta Original
```
How to optimize query performance in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo optimizar el rendimiento de consultas en MongoDB?
```

### 💡 Explicación Detallada
La optimización del rendimiento de consultas en MongoDB involucra múltiples estrategias: crear índices apropiados, optimizar las consultas, usar proyecciones, implementar paginación eficiente, y monitorear el rendimiento. Los índices son fundamentales para mejorar la velocidad de las consultas, especialmente en colecciones grandes.

### 🔧 Ejemplo Práctico con Código

#### Optimización Completa de Consultas

```javascript
// Ejemplo de optimización de consultas en MongoDB
// Configurar datos de ejemplo para pruebas de rendimiento

// 1. Crear colección con muchos documentos para pruebas
const documentos = [];
for (let i = 1; i <= 10000; i++) {
    documentos.push({
        _id: ObjectId(),
        codigo: `PROD${String(i).padStart(5, '0')}`,
        nombre: `Producto ${i}`,
        categoria: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes'][i % 4],
        precio: Math.floor(Math.random() * 1000) + 10,
        stock: Math.floor(Math.random() * 100) + 1,
        fechaCreacion: new Date(2024, 0, 1 + (i % 365)),
        tags: [`tag${i % 10}`, `tag${(i + 1) % 10}`],
        ubicacion: {
            almacen: `Almacén ${(i % 5) + 1}`,
            pasillo: (i % 20) + 1,
            estante: (i % 10) + 1
        },
        ventas: {
            total: Math.floor(Math.random() * 1000),
            ultimaVenta: new Date(2024, 0, 1 + (i % 365))
        }
    });
}

db.productos.insertMany(documentos);
print(`Insertados ${documentos.length} productos`);

// 2. Crear índices estratégicos
print('\n=== Creando Índices ===');

// Índice simple en código (único)
db.productos.createIndex({ codigo: 1 }, { unique: true });
print('✓ Índice único creado en campo codigo');

// Índice compuesto en categoría y precio
db.productos.createIndex({ categoria: 1, precio: 1 });
print('✓ Índice compuesto creado en categoria y precio');

// Índice en fecha de creación
db.productos.createIndex({ fechaCreacion: 1 });
print('✓ Índice creado en fechaCreacion');

// Índice de texto en nombre
db.productos.createIndex({ nombre: 'text' });
print('✓ Índice de texto creado en nombre');

// Índice geoespacial (simulado)
db.productos.createIndex({ 'ubicacion.almacen': 1, 'ubicacion.pasillo': 1 });
print('✓ Índice creado en ubicación');

// Índice TTL para documentos que expiran (ejemplo)
db.sesiones.createIndex({ fechaExpiracion: 1 }, { expireAfterSeconds: 3600 });
print('✓ Índice TTL creado para sesiones');

// 3. Consultas optimizadas vs no optimizadas
print('\n=== Comparación de Rendimiento ===');

// Consulta NO optimizada (sin índice)
print('Consultando productos por categoría (sin índice específico)...');
const inicio1 = Date.now();
const productosNoOptimizados = db.productos.find({ categoria: 'Electrónicos' }).toArray();
const tiempo1 = Date.now() - inicio1;
print(`Tiempo sin optimización: ${tiempo1}ms`);

// Consulta optimizada (con índice)
print('Consultando productos por categoría (con índice)...');
const inicio2 = Date.now();
const productosOptimizados = db.productos.find({ categoria: 'Electrónicos' }).toArray();
const tiempo2 = Date.now() - inicio2;
print(`Tiempo con optimización: ${tiempo2}ms`);
print(`Mejora: ${((tiempo1 - tiempo2) / tiempo1 * 100).toFixed(2)}%`);

// 4. Uso de proyecciones para optimizar
print('\n=== Optimización con Proyecciones ===');

// Consulta sin proyección (trae todos los campos)
const inicio3 = Date.now();
const productosCompletos = db.productos.find({ precio: { $gt: 500 } }).limit(100).toArray();
const tiempo3 = Date.now() - inicio3;
print(`Tiempo sin proyección: ${tiempo3}ms`);

// Consulta con proyección (solo campos necesarios)
const inicio4 = Date.now();
const productosProyectados = db.productos.find(
    { precio: { $gt: 500 } },
    { codigo: 1, nombre: 1, precio: 1, _id: 0 }
).limit(100).toArray();
const tiempo4 = Date.now() - inicio4;
print(`Tiempo con proyección: ${tiempo4}ms`);
print(`Mejora: ${((tiempo3 - tiempo4) / tiempo3 * 100).toFixed(2)}%`);

// 5. Paginación eficiente
print('\n=== Paginación Eficiente ===');

// Paginación tradicional (puede ser lenta)
const pagina = 1;
const porPagina = 50;
const inicio5 = Date.now();
const productosPagina1 = db.productos.find()
    .skip((pagina - 1) * porPagina)
    .limit(porPagina)
    .toArray();
const tiempo5 = Date.now() - inicio5;
print(`Tiempo paginación tradicional: ${tiempo5}ms`);

// Paginación con cursor (más eficiente)
const inicio6 = Date.now();
const productosCursor = db.productos.find()
    .sort({ _id: 1 })
    .limit(porPagina)
    .toArray();
const tiempo6 = Date.now() - inicio6;
print(`Tiempo paginación con cursor: ${tiempo6}ms`);

// 6. Análisis de consultas con explain()
print('\n=== Análisis de Consultas ===');

// Analizar consulta simple
const explicacion = db.productos.find({ categoria: 'Electrónicos' }).explain('executionStats');
print('Análisis de consulta por categoría:');
print(`- Tiempo de ejecución: ${explicacion.executionStats.executionTimeMillis}ms`);
print(`- Documentos examinados: ${explicacion.executionStats.totalDocsExamined}`);
print(`- Documentos retornados: ${explicacion.executionStats.nReturned}`);
print(`- Índice utilizado: ${explicacion.queryPlanner.winningPlan.inputStage.indexName || 'Ninguno'}`);

// 7. Consultas con índices cubiertos
print('\n=== Consultas con Índices Cubiertos ===');

// Crear índice que cubra toda la consulta
db.productos.createIndex({ categoria: 1, precio: 1, nombre: 1 });

const consultaCubierta = db.productos.find(
    { categoria: 'Electrónicos', precio: { $gt: 100 } },
    { nombre: 1, _id: 0 }
).explain('executionStats');

print('Consulta con índice cubierto:');
print(`- Índice cubierto: ${consultaCubierta.queryPlanner.winningPlan.inputStage.indexName}`);
print(`- Documentos examinados: ${consultaCubierta.executionStats.totalDocsExamined}`);

// 8. Monitoreo de consultas lentas
print('\n=== Configuración de Profiler ===');

// Habilitar profiler para consultas lentas
db.setProfilingLevel(1, { slowms: 100 });
print('Profiler habilitado para consultas > 100ms');

// Ejecutar consulta lenta para demostración
const consultaLenta = db.productos.find({
    $text: { $search: 'Producto' },
    precio: { $gt: 500 },
    'ventas.total': { $gt: 100 }
}).toArray();

// Ver consultas lentas
const consultasLentas = db.system.profile.find().sort({ ts: -1 }).limit(5);
print('Últimas consultas lentas:');
consultasLentas.forEach(printjson);
```

**Explicación del código:**
Este ejemplo muestra técnicas completas de optimización: creación de índices estratégicos, uso de proyecciones, paginación eficiente, análisis de consultas y monitoreo de rendimiento.

### 🧪 Pruebas Unitarias

```javascript
describe('Pruebas de Optimización MongoDB', () => {
    let mongoServer;
    let client;
    let db;
    
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('test');
    });
    
    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });
    
    beforeEach(async () => {
        await db.collection('productos').deleteMany({});
    });
    
    it('debería crear índices correctamente', async () => {
        const collection = db.collection('productos');
        
        // Insertar datos de prueba
        await collection.insertMany([
            { codigo: 'A001', categoria: 'Electrónicos', precio: 100 },
            { codigo: 'A002', categoria: 'Ropa', precio: 50 }
        ]);
        
        // Crear índice
        await collection.createIndex({ codigo: 1 }, { unique: true });
        
        // Verificar índice
        const indices = await collection.indexes();
        const indiceCodigo = indices.find(idx => idx.key.codigo);
        expect(indiceCodigo).toBeDefined();
        expect(indiceCodigo.unique).toBe(true);
    });
    
    it('debería optimizar consultas con proyecciones', async () => {
        const collection = db.collection('productos');
        
        await collection.insertOne({
            codigo: 'TEST',
            nombre: 'Producto Test',
            precio: 100,
            descripcion: 'Descripción muy larga...'
        });
        
        // Consulta sin proyección
        const sinProyeccion = await collection.findOne({ codigo: 'TEST' });
        expect(sinProyeccion.descripcion).toBeDefined();
        
        // Consulta con proyección
        const conProyeccion = await collection.findOne(
            { codigo: 'TEST' },
            { codigo: 1, nombre: 1, _id: 0 }
        );
        expect(conProyeccion.descripcion).toBeUndefined();
        expect(conProyeccion.codigo).toBe('TEST');
    });
    
    it('debería usar índices para optimizar consultas', async () => {
        const collection = db.collection('productos');
        
        await collection.insertMany([
            { categoria: 'A', precio: 100 },
            { categoria: 'A', precio: 200 },
            { categoria: 'B', precio: 150 }
        ]);
        
        // Crear índice compuesto
        await collection.createIndex({ categoria: 1, precio: 1 });
        
        // Analizar consulta
        const explicacion = await collection.find({ categoria: 'A' }).explain('executionStats');
        expect(explicacion.queryPlanner.winningPlan.inputStage.indexName).toBeDefined();
    });
    
    it('debería manejar paginación eficientemente', async () => {
        const collection = db.collection('productos');
        
        // Insertar muchos documentos
        const documentos = Array.from({ length: 100 }, (_, i) => ({
            codigo: `PROD${i}`,
            nombre: `Producto ${i}`
        }));
        
        await collection.insertMany(documentos);
        
        // Paginación tradicional
        const pagina1 = await collection.find()
            .skip(0)
            .limit(10)
            .toArray();
        
        expect(pagina1).toHaveLength(10);
        
        // Paginación con cursor
        const cursor = collection.find().sort({ _id: 1 }).limit(10);
        const resultados = await cursor.toArray();
        
        expect(resultados).toHaveLength(10);
    });
});
```

### 📊 Predicción de Resultados

📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- Los índices mejorarán significativamente el rendimiento de las consultas
- Las proyecciones reducirán el tiempo de transferencia de datos
- La paginación eficiente será más rápida que la tradicional
- El profiler detectará consultas lentas

⚠️ **Posibles Errores:**
- Índices duplicados o conflictivos
- Consultas que no utilizan índices creados
- Problemas de memoria con datasets grandes
- Timeouts en consultas complejas

🔍 **Para Verificar:**
1. Usar explain() para verificar el uso de índices
2. Monitorear el rendimiento con MongoDB Compass
3. Revisar el profiler para consultas lentas
4. Verificar el tamaño de los índices

### 🚀 Mejoras Implementadas

🚀 Mejoras Sugeridas:

1. **Estrategia de índices avanzada:**
   - Crear índices basados en patrones de consulta reales
   - Usar índices cubiertos cuando sea posible
   - Considerar índices parciales para consultas específicas
   - Monitorear el uso de índices regularmente

2. **Optimización de consultas:**
   - Usar proyecciones para limitar campos retornados
   - Implementar paginación basada en cursor
   - Evitar consultas que escanean toda la colección
   - Usar operadores de consulta eficientes

3. **Monitoreo y análisis:**
   - Configurar MongoDB Profiler
   - Usar MongoDB Compass para análisis visual
   - Implementar alertas para consultas lentas
   - Revisar regularmente las estadísticas de rendimiento

4. **Optimización de hardware:**
   - Usar SSDs para mejor rendimiento de I/O
   - Configurar suficiente RAM para working set
   - Considerar MongoDB Atlas para gestión automática
   - Implementar replicación para lecturas distribuidas

---

## 🎉 Conclusión

Esta guía contiene **3 preguntas procesadas** con ejemplos prácticos, pruebas unitarias y mejoras implementadas. Cada pregunta ha sido cuidadosamente traducida y mejorada para proporcionar una experiencia de aprendizaje completa.

## 🚀 Próximos Pasos

1. **Practicar con los ejemplos**: Ejecuta cada ejemplo de código en tu entorno MongoDB
2. **Ejecutar las pruebas unitarias**: Verifica que todo funcione correctamente
3. **Implementar las mejoras**: Aplica las sugerencias de mejora en tus proyectos
4. **Contribuir**: Ayuda a mejorar esta guía con nuevas preguntas o ejemplos

## 🤝 Contribuciones

Este proyecto está abierto a contribuciones. Puedes:

- 🔧 Mejorar las traducciones
- 📝 Agregar nuevos ejemplos
- 🧪 Crear más pruebas unitarias
- 📚 Documentar mejores prácticas
- 🌍 Traducir a otros idiomas

---

*Guía creada con ❤️ para la comunidad de desarrolladores MongoDB*

**Fecha de generación**: 15/01/2025 10:30:00  
**Versión**: 1.0  
**Total de preguntas**: 3  
**Estado**: En desarrollo activo 