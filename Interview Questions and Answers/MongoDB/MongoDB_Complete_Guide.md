# 🍃 Guía Completa de MongoDB - Entrevistas y Dominio

## 🎯 Introducción a MongoDB

**MongoDB** es una base de datos NoSQL orientada a documentos que almacena datos en formato JSON flexible (BSON), diseñada para aplicaciones modernas que requieren escalabilidad y flexibilidad.

### 🌟 **¿Por qué MongoDB?**

- **Flexibilidad de esquema** - Documentos con estructura variable
- **Escalabilidad horizontal** - Sharding automático
- **Alto rendimiento** - Índices y agregaciones optimizadas
- **Ecosistema rico** - Drivers para múltiples lenguajes
- **Comunidad activa** - Recursos y soporte abundantes

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Cuál es la diferencia entre SQL y NoSQL, y por qué elegir MongoDB?**

**Respuesta Completa:**

**SQL (Relacional):**
- Esquema fijo y rígido
- Transacciones ACID
- Relaciones entre tablas
- Consultas complejas con JOINs
- Escalabilidad vertical

**NoSQL (MongoDB):**
- Esquema flexible y dinámico
- Transacciones eventualmente consistentes
- Documentos anidados
- Consultas simples y rápidas
- Escalabilidad horizontal

```javascript
// Ejemplo de comparación SQL vs MongoDB
// =====================================

// SQL - Estructura rígida
/*
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    age INT,
    created_at TIMESTAMP
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    status VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT,
    product_name VARCHAR(100),
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
*/

// MongoDB - Estructura flexible
const users = [
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    name: "Juan Pérez",
    email: "juan@example.com",
    age: 30,
    profile: {
      bio: "Desarrollador Full Stack",
      location: "Madrid, España",
      skills: ["JavaScript", "Python", "MongoDB"]
    },
    preferences: {
      theme: "dark",
      language: "es",
      notifications: {
        email: true,
        push: false,
        sms: true
      }
    },
    created_at: new Date("2024-01-15"),
    orders: [
      {
        order_id: ObjectId("507f1f77bcf86cd799439012"),
        total: 299.99,
        status: "completed",
        items: [
          {
            product_name: "Laptop Dell XPS 13",
            quantity: 1,
            price: 299.99,
            category: "Electronics"
          }
        ],
        shipping_address: {
          street: "Calle Mayor 123",
          city: "Madrid",
          postal_code: "28001",
          country: "España"
        },
        payment_method: {
          type: "credit_card",
          last4: "1234",
          brand: "Visa"
        }
      }
    ]
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439013"),
    name: "María García",
    email: "maria@example.com",
    age: 25,
    profile: {
      bio: "Diseñadora UX/UI",
      location: "Barcelona, España",
      skills: ["Figma", "Adobe XD", "Prototyping"]
    },
    created_at: new Date("2024-01-20"),
    orders: []
  }
];

// Consultas equivalentes
// ======================

// SQL - JOINs complejos
/*
SELECT u.name, u.email, o.total, oi.product_name
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'completed'
ORDER BY o.total DESC;
*/

// MongoDB - Consulta simple
db.users.aggregate([
  { $unwind: "$orders" },
  { $match: { "orders.status": "completed" } },
  { $unwind: "$orders.items" },
  { $project: {
    name: 1,
    email: 1,
    total: "$orders.total",
    product_name: "$orders.items.product_name"
  }},
  { $sort: { total: -1 } }
]);

// MongoDB - Consulta más simple con lookup (similar a JOIN)
db.users.aggregate([
  { $lookup: {
    from: "orders",
    localField: "_id",
    foreignField: "user_id",
    as: "user_orders"
  }},
  { $unwind: "$user_orders" },
  { $match: { "user_orders.status": "completed" } },
  { $project: {
    name: 1,
    email: 1,
    total: "$user_orders.total"
  }}
]);

// Ventajas de MongoDB para este caso
// ==================================

// 1. Esquema flexible - Cada usuario puede tener diferentes campos
const flexibleUser = {
  _id: ObjectId("507f1f77bcf86cd799439014"),
  name: "Carlos López",
  email: "carlos@example.com",
  // Campos adicionales sin afectar otros usuarios
  social_media: {
    twitter: "@carlosdev",
    linkedin: "carlos-lopez-dev",
    github: "carloslopez"
  },
  // Campos opcionales
  premium_features: {
    enabled: true,
    subscription_type: "pro",
    expires_at: new Date("2024-12-31")
  }
};

// 2. Consultas complejas en un solo documento
db.users.find({
  "profile.skills": { $in: ["JavaScript", "MongoDB"] },
  "orders.total": { $gte: 100 },
  "preferences.theme": "dark"
});

// 3. Agregaciones poderosas
db.users.aggregate([
  { $unwind: "$orders" },
  { $group: {
    _id: "$profile.location",
    total_revenue: { $sum: "$orders.total" },
    order_count: { $sum: 1 },
    avg_order_value: { $avg: "$orders.total" }
  }},
  { $sort: { total_revenue: -1 } }
]);
```

**Simulador de Comparación SQL vs MongoDB:**

```javascript
// sql-vs-mongodb-simulator.js
class SQLvsMongoDBSimulator {
  constructor() {
    this.testCount = 0;
    this.correctAnswers = 0;
    this.scenarios = this.setupScenarios();
  }

  // Configurar escenarios de prueba
  setupScenarios() {
    return [
      {
        name: 'Consulta de Usuarios con Órdenes',
        description: 'Obtener usuarios que han realizado órdenes completadas',
        sqlQuery: `
          SELECT u.name, u.email, o.total
          FROM users u
          JOIN orders o ON u.id = o.user_id
          WHERE o.status = 'completed'
        `,
        mongoQuery: `
          db.users.aggregate([
            { $unwind: "$orders" },
            { $match: { "orders.status": "completed" } },
            { $project: { name: 1, email: 1, total: "$orders.total" }}
          ])
        `,
        complexity: 'SQL: Alta (JOINs), MongoDB: Baja (unwind)',
        performance: 'SQL: Media, MongoDB: Alta',
        flexibility: 'SQL: Baja, MongoDB: Alta'
      },
      {
        name: 'Agregación de Ventas por Región',
        description: 'Calcular total de ventas agrupado por región',
        sqlQuery: `
          SELECT u.region, SUM(o.total) as total_revenue, COUNT(*) as order_count
          FROM users u
          JOIN orders o ON u.id = o.user_id
          GROUP BY u.region
          ORDER BY total_revenue DESC
        `,
        mongoQuery: `
          db.users.aggregate([
            { $unwind: "$orders" },
            { $group: {
              _id: "$profile.location",
              total_revenue: { $sum: "$orders.total" },
              order_count: { $sum: 1 }
            }},
            { $sort: { total_revenue: -1 }}
          ])
        `,
        complexity: 'SQL: Media (GROUP BY), MongoDB: Media (aggregate)',
        performance: 'SQL: Media, MongoDB: Alta',
        flexibility: 'SQL: Baja, MongoDB: Alta'
      },
      {
        name: 'Búsqueda de Texto Completo',
        description: 'Buscar usuarios por habilidades o descripción',
        sqlQuery: `
          SELECT name, email
          FROM users
          WHERE skills LIKE '%JavaScript%' 
          OR bio LIKE '%developer%'
        `,
        mongoQuery: `
          db.users.find({
            $or: [
              { "profile.skills": { $in: ["JavaScript"] }},
              { "profile.bio": { $regex: "developer", $options: "i" }}
            ]
          })
        `,
        complexity: 'SQL: Baja (LIKE), MongoDB: Baja (regex)',
        performance: 'SQL: Baja (sin índices), MongoDB: Media (con índices)',
        flexibility: 'SQL: Baja, MongoDB: Alta'
      },
      {
        name: 'Esquema Flexible',
        description: 'Agregar campos nuevos sin modificar estructura',
        sqlQuery: `
          -- Requiere ALTER TABLE para nuevos campos
          ALTER TABLE users ADD COLUMN social_media JSON;
          ALTER TABLE users ADD COLUMN preferences JSON;
        `,
        mongoQuery: `
          // No requiere cambios en la colección
          db.users.updateOne(
            { _id: ObjectId("...") },
            { $set: { 
              social_media: { twitter: "@user", linkedin: "user-profile" },
              preferences: { theme: "dark", language: "es" }
            }}
          )
        `,
        complexity: 'SQL: Alta (migración), MongoDB: Baja (flexible)',
        performance: 'SQL: Media, MongoDB: Alta',
        flexibility: 'SQL: Baja, MongoDB: Muy Alta'
      },
      {
        name: 'Transacciones',
        description: 'Operaciones atómicas en múltiples documentos',
        sqlQuery: `
          BEGIN TRANSACTION;
          UPDATE users SET balance = balance - 100 WHERE id = 1;
          UPDATE users SET balance = balance + 100 WHERE id = 2;
          COMMIT;
        `,
        mongoQuery: `
          // Transacciones disponibles desde MongoDB 4.0
          const session = db.getMongo().startSession();
          session.startTransaction();
          try {
            db.users.updateOne({ _id: 1 }, { $inc: { balance: -100 }}, { session });
            db.users.updateOne({ _id: 2 }, { $inc: { balance: 100 }}, { session });
            session.commitTransaction();
          } catch (error) {
            session.abortTransaction();
          }
        `,
        complexity: 'SQL: Baja (nativo), MongoDB: Media (disponible)',
        performance: 'SQL: Alta, MongoDB: Media',
        flexibility: 'SQL: Baja, MongoDB: Alta'
      }
    ];
  }

  // Ejecutar simulación
  runSimulation() {
    console.log('🍃 SIMULADOR DE COMPARACIÓN SQL vs MONGODB');
    console.log('=' .repeat(60));

    console.log('\n📋 Analizando escenarios de uso...\n');

    this.scenarios.forEach((scenario, index) => {
      this.testCount++;
      console.log(`🧪 ESCENARIO ${index + 1}: ${scenario.name}`);
      console.log('-'.repeat(60));
      console.log(`📝 Descripción: ${scenario.description}`);
      
      console.log('\n🔍 ANÁLISIS COMPARATIVO:');
      console.log(`   Complejidad: ${scenario.complexity}`);
      console.log(`   Rendimiento: ${scenario.performance}`);
      console.log(`   Flexibilidad: ${scenario.flexibility}`);
      
      // Mostrar consultas
      console.log('\n💻 CONSULTA SQL:');
      console.log(scenario.sqlQuery);
      
      console.log('\n🍃 CONSULTA MONGODB:');
      console.log(scenario.mongoQuery);
      
      // Evaluar escenario
      this.evaluateScenario(scenario);
      
      console.log('\n' + '='.repeat(60) + '\n');
    });

    this.showFinalSummary();
  }

  // Evaluar escenario
  evaluateScenario(scenario) {
    console.log('\n📊 EVALUACIÓN:');
    
    // Determinar qué base de datos es mejor para este escenario
    let recommendation = '';
    let reasoning = '';
    
    if (scenario.name.includes('Esquema Flexible')) {
      recommendation = 'MongoDB';
      reasoning = 'MongoDB permite esquemas flexibles sin migraciones';
    } else if (scenario.name.includes('Transacciones')) {
      recommendation = 'SQL';
      reasoning = 'SQL tiene transacciones ACID nativas y maduras';
    } else if (scenario.name.includes('Agregación')) {
      recommendation = 'MongoDB';
      reasoning = 'MongoDB tiene pipeline de agregación muy potente';
    } else if (scenario.name.includes('Búsqueda')) {
      recommendation = 'MongoDB';
      reasoning = 'MongoDB tiene capacidades de búsqueda de texto avanzadas';
    } else {
      recommendation = 'Depende del caso';
      reasoning = 'Ambas opciones son válidas, depende de los requisitos específicos';
    }
    
    console.log(`   🎯 Recomendación: ${recommendation}`);
    console.log(`   💡 Razón: ${reasoning}`);
    
    // Simular métricas de rendimiento
    this.simulatePerformanceMetrics(scenario);
  }

  // Simular métricas de rendimiento
  simulatePerformanceMetrics(scenario) {
    console.log('\n⚡ MÉTRICAS DE RENDIMIENTO SIMULADAS:');
    
    // Simular tiempos de ejecución
    const sqlTime = Math.random() * 100 + 50; // 50-150ms
    const mongoTime = Math.random() * 80 + 30; // 30-110ms
    
    console.log(`   SQL: ${sqlTime.toFixed(2)}ms`);
    console.log(`   MongoDB: ${mongoTime.toFixed(2)}ms`);
    
    if (mongoTime < sqlTime) {
      console.log('   🏆 MongoDB es más rápido en este escenario');
      this.correctAnswers++;
    } else {
      console.log('   🏆 SQL es más rápido en este escenario');
    }
    
    // Simular uso de memoria
    const sqlMemory = Math.random() * 50 + 100; // 100-150MB
    const mongoMemory = Math.random() * 40 + 80; // 80-120MB
    
    console.log(`   SQL Memoria: ${sqlMemory.toFixed(2)}MB`);
    console.log(`   MongoDB Memoria: ${mongoMemory.toFixed(2)}MB`);
  }

  // Mostrar resumen final
  showFinalSummary() {
    console.log('🎉 RESUMEN FINAL DE LA COMPARACIÓN');
    console.log('=' .repeat(50));

    console.log('\n📊 Estadísticas:');
    console.log(`   Escenarios analizados: ${this.testCount}`);
    console.log(`   MongoDB recomendado: ${this.correctAnswers}`);
    console.log(`   SQL recomendado: ${this.testCount - this.correctAnswers}`);

    console.log('\n💡 LECCIONES APRENDIDAS:');
    console.log('   ✅ SQL:');
    console.log('      - Transacciones ACID nativas');
    console.log('      - Esquema rígido y consistente');
    console.log('      - Relaciones complejas con JOINs');
    console.log('      - Escalabilidad vertical');
    
    console.log('   ✅ MongoDB:');
    console.log('      - Esquema flexible y dinámico');
    console.log('      - Escalabilidad horizontal');
    console.log('      - Consultas y agregaciones potentes');
    console.log('      - Alto rendimiento para operaciones de lectura');

    console.log('\n🚨 CUÁNDO USAR CADA UNO:');
    console.log('   🔴 Usa SQL cuando:');
    console.log('      - Necesitas transacciones ACID complejas');
    console.log('      - Tu esquema es estable y bien definido');
    console.log('      - Requieres relaciones complejas entre entidades');
    console.log('      - Trabajas con datos financieros o críticos');
    
    console.log('   🔴 Usa MongoDB cuando:');
    console.log('      - Tu esquema cambia frecuentemente');
    console.log('      - Necesitas escalabilidad horizontal');
    console.log('      - Trabajas con datos no estructurados');
    console.log('      - Requieres alto rendimiento de lectura');

    console.log('\n🌟 CONCLUSIÓN:');
    console.log('   📱 No hay una opción "mejor" universal');
    console.log('   🔄 La elección depende de los requisitos específicos');
    console.log('   🎯 MongoDB es excelente para aplicaciones modernas y flexibles');
    console.log('   🎯 SQL es ideal para sistemas transaccionales y relacionales');
  }
}

// Ejecutar simulador
const simulator = new SQLvsMongoDBSimulator();
simulator.runSimulation();
```

---

### 🔴 **PREGUNTA 2: ¿Qué son los índices en MongoDB y cómo optimizan las consultas?**

**Respuesta Completa:**

Los **índices** en MongoDB son estructuras de datos que mejoran la velocidad de las consultas al mantener referencias ordenadas a los documentos, similar a un índice en un libro.

**Tipos de Índices:**

1. **Índices Simples** - Un solo campo
2. **Índices Compuestos** - Múltiples campos
3. **Índices Multikey** - Arrays
4. **Índices de Texto** - Búsqueda de texto completo
5. **Índices Geospaciales** - Coordenadas geográficas
6. **Índices Hashed** - Distribución uniforme

```javascript
// Ejemplo de Índices en MongoDB
// ==============================

// Colección de usuarios para demostrar índices
const users = [
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    username: "juan_dev",
    email: "juan@example.com",
    age: 30,
    location: {
      type: "Point",
      coordinates: [-3.7038, 40.4168] // Madrid
    },
    tags: ["developer", "javascript", "mongodb"],
    created_at: new Date("2024-01-15"),
    last_login: new Date("2024-01-20"),
    profile: {
      bio: "Desarrollador Full Stack con 5 años de experiencia",
      skills: ["JavaScript", "Python", "MongoDB", "React"],
      experience: 5
    }
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    username: "maria_design",
    email: "maria@example.com",
    age: 25,
    location: {
      type: "Point",
      coordinates: [2.1734, 41.3851] // Barcelona
    },
    tags: ["designer", "ux", "ui"],
    created_at: new Date("2024-01-10"),
    last_login: new Date("2024-01-19"),
    profile: {
      bio: "Diseñadora UX/UI apasionada por la experiencia del usuario",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      experience: 3
    }
  }
];

// 1. ÍNDICES SIMPLES
// ===================

// Índice en campo email (único)
db.users.createIndex({ "email": 1 }, { unique: true });

// Índice en campo username
db.users.createIndex({ "username": 1 });

// Índice en campo age
db.users.createIndex({ "age": 1 });

// Índice en campo created_at
db.users.createIndex({ "created_at": 1 });

// 2. ÍNDICES COMPUESTOS
// =====================

// Índice compuesto: username + email
db.users.createIndex({ "username": 1, "email": 1 });

// Índice compuesto: age + created_at
db.users.createIndex({ "age": 1, "created_at": -1 });

// Índice compuesto: tags + experience
db.users.createIndex({ "tags": 1, "profile.experience": 1 });

// 3. ÍNDICES MULTIKEY (para arrays)
// =================================

// Índice en array de tags
db.users.createIndex({ "tags": 1 });

// Índice en array de skills
db.users.createIndex({ "profile.skills": 1 });

// 4. ÍNDICES DE TEXTO
// ===================

// Índice de texto en bio y username
db.users.createIndex({
  "profile.bio": "text",
  "username": "text"
}, {
  name: "user_search_index",
  weights: {
    "profile.bio": 3,    // Mayor peso para bio
    "username": 1        // Peso normal para username
  }
});

// 5. ÍNDICES GEOSPACIALES
// ========================

// Índice 2dsphere para consultas geográficas
db.users.createIndex({ "location": "2dsphere" });

// 6. ÍNDICES HASHED
// =================

// Índice hashed para distribución uniforme en sharding
db.users.createIndex({ "email": "hashed" });

// CONSULTAS OPTIMIZADAS CON ÍNDICES
// =================================

// Consulta 1: Búsqueda por email (índice simple)
db.users.find({ "email": "juan@example.com" });
// Plan de ejecución: IXSCAN en índice email

// Consulta 2: Búsqueda por rango de edad (índice simple)
db.users.find({ "age": { $gte: 25, $lte: 35 } });
// Plan de ejecución: IXSCAN en índice age

// Consulta 3: Búsqueda por tags (índice multikey)
db.users.find({ "tags": "developer" });
// Plan de ejecución: IXSCAN en índice tags

// Consulta 4: Búsqueda de texto completo
db.users.find({
  $text: { $search: "desarrollador javascript" }
});
// Plan de ejecución: TEXT en índice de texto

// Consulta 5: Búsqueda geográfica (índice 2dsphere)
db.users.find({
  "location": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-3.7038, 40.4168] // Madrid
      },
      $maxDistance: 50000 // 50km
    }
  }
});
// Plan de ejecución: GEO_NEAR en índice location

// Consulta 6: Búsqueda compuesta (índice compuesto)
db.users.find({
  "age": { $gte: 25 },
  "created_at": { $gte: new Date("2024-01-01") }
}).sort({ "age": 1, "created_at": -1 });
// Plan de ejecución: IXSCAN en índice compuesto age + created_at

// ANÁLISIS DE PLANES DE EJECUCIÓN
// ================================

// Analizar plan de ejecución de una consulta
db.users.find({ "email": "juan@example.com" }).explain("executionStats");

// Resultado esperado:
/*
{
  "queryPlanner": {
    "winningPlan": {
      "stage": "IXSCAN",
      "indexName": "email_1",
      "direction": "forward"
    }
  },
  "executionStats": {
    "totalDocsExamined": 1,
    "totalKeysExamined": 1,
    "executionTimeMillis": 0
  }
}
*/

// OPTIMIZACIÓN DE CONSULTAS
// =========================

// 1. Crear índice para consulta específica
db.users.createIndex({ "profile.skills": 1, "age": 1, "created_at": -1 });

// 2. Consulta optimizada
db.users.find({
  "profile.skills": { $in: ["JavaScript", "MongoDB"] },
  "age": { $gte: 25 }
}).sort({ "created_at": -1 });

// 3. Usar proyección para limitar campos retornados
db.users.find(
  { "tags": "developer" },
  { "username": 1, "email": 1, "profile.skills": 1, "_id": 0 }
);

// 4. Usar límites para paginación
db.users.find({ "age": { $gte: 25 } })
  .sort({ "created_at": -1 })
  .limit(10)
  .skip(0);

// MONITOREO Y MANTENIMIENTO DE ÍNDICES
// =====================================

// Listar todos los índices
db.users.getIndexes();

// Estadísticas de uso de índices
db.users.aggregate([
  { $indexStats: {} }
]);

// Eliminar índice no utilizado
db.users.dropIndex("index_name");

// Reconstruir índice
db.users.reIndex();
```

**Simulador de Índices:**

```javascript
// indexes-simulator.js
class MongoDBIndexesSimulator {
  constructor() {
    this.indexes = new Map();
    this.queries = [];
    this.performanceData = new Map();
    this.indexTypes = {
      'simple': { cost: 1, speed: 'fast' },
      'compound': { cost: 2, speed: 'fast' },
      'multikey': { cost: 1.5, speed: 'medium' },
      'text': { cost: 3, speed: 'slow' },
      'geospatial': { cost: 2.5, speed: 'medium' },
      'hashed': { cost: 1, speed: 'fast' }
    };
  }

  // Crear índice
  createIndex(collection, fields, options = {}) {
    const indexName = this.generateIndexName(fields);
    const indexType = this.determineIndexType(fields, options);
    
    const index = {
      name: indexName,
      collection: collection,
      fields: fields,
      type: indexType,
      options: options,
      created_at: new Date(),
      usage_count: 0,
      size_bytes: this.calculateIndexSize(fields, options)
    };
    
    this.indexes.set(indexName, index);
    
    console.log(`✅ Índice creado: ${indexName}`);
    console.log(`   Tipo: ${indexType}`);
    console.log(`   Campos: ${Object.keys(fields).join(', ')}`);
    console.log(`   Tamaño estimado: ${(index.size_bytes / 1024).toFixed(2)} KB`);
    
    return index;
  }

  // Generar nombre del índice
  generateIndexName(fields) {
    const fieldNames = Object.keys(fields);
    const directions = Object.values(fields);
    
    return fieldNames.map((field, i) => {
      const direction = directions[i] === 1 ? 'asc' : 'desc';
      return `${field}_${direction}`;
    }).join('_');
  }

  // Determinar tipo de índice
  determineIndexType(fields, options) {
    if (options.text) return 'text';
    if (options['2dsphere']) return 'geospatial';
    if (options.hashed) return 'hashed';
    if (Object.keys(fields).length > 1) return 'compound';
    if (this.hasArrayFields(fields)) return 'multikey';
    return 'simple';
  }

  // Verificar si hay campos de array
  hasArrayFields(fields) {
    // Simulación: considerar ciertos campos como arrays
    const arrayFields = ['tags', 'skills', 'categories'];
    return Object.keys(fields).some(field => arrayFields.includes(field));
  }

  // Calcular tamaño estimado del índice
  calculateIndexSize(fields, options) {
    let baseSize = 100; // Tamaño base en bytes
    
    // Agregar tamaño por campo
    Object.keys(fields).forEach(field => {
      baseSize += 50; // 50 bytes por campo
    });
    
    // Multiplicador por tipo de índice
    const indexType = this.determineIndexType(fields, options);
    const multiplier = this.indexTypes[indexType].cost;
    
    return Math.round(baseSize * multiplier);
  }

  // Ejecutar consulta y analizar rendimiento
  executeQuery(collection, query, sort = {}, limit = 0) {
    console.log(`\n🔍 Ejecutando consulta en ${collection}:`);
    console.log(`   Filtros: ${JSON.stringify(query)}`);
    if (Object.keys(sort).length > 0) {
      console.log(`   Ordenamiento: ${JSON.stringify(sort)}`);
    }
    if (limit > 0) {
      console.log(`   Límite: ${limit}`);
    }
    
    // Encontrar mejor índice para la consulta
    const bestIndex = this.findBestIndex(query, sort);
    
    if (bestIndex) {
      console.log(`   ✅ Usando índice: ${bestIndex.name}`);
      this.optimizeQueryWithIndex(query, sort, bestIndex);
    } else {
      console.log(`   ❌ No se encontró índice apropiado - COLLSCAN`);
      this.executeCollectionScan(query, sort, limit);
    }
    
    // Registrar consulta
    this.queries.push({
      collection,
      query,
      sort,
      limit,
      index_used: bestIndex?.name || 'COLLSCAN',
      timestamp: new Date()
    });
  }

  // Encontrar mejor índice para la consulta
  findBestIndex(query, sort) {
    let bestIndex = null;
    let bestScore = 0;
    
    for (const [name, index] of this.indexes) {
      const score = this.calculateIndexScore(index, query, sort);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
    
    return bestIndex;
  }

  // Calcular puntuación del índice para la consulta
  calculateIndexScore(index, query, sort) {
    let score = 0;
    
    // Puntuación por campos de consulta
    Object.keys(query).forEach(field => {
      if (index.fields[field]) {
        score += 10; // 10 puntos por campo coincidente
      }
    });
    
    // Puntuación por campos de ordenamiento
    Object.keys(sort).forEach(field => {
      if (index.fields[field]) {
        score += 5; // 5 puntos por campo de ordenamiento
      }
    });
    
    // Bonus por tipo de índice
    const typeBonus = {
      'simple': 1,
      'compound': 1.2,
      'multikey': 0.8,
      'text': 0.6,
      'geospatial': 0.7,
      'hashed': 1
    };
    
    score *= typeBonus[index.type] || 1;
    
    return score;
  }

  // Optimizar consulta con índice
  optimizeQueryWithIndex(query, sort, index) {
    // Simular tiempo de ejecución optimizado
    const baseTime = 10; // ms base
    const indexMultiplier = this.indexTypes[index.type].cost;
    const executionTime = baseTime * indexMultiplier;
    
    console.log(`   ⚡ Tiempo de ejecución: ${executionTime.toFixed(2)}ms`);
    console.log(`   📊 Plan de ejecución: IXSCAN en ${index.name}`);
    
    // Incrementar contador de uso
    index.usage_count++;
    
    // Registrar métricas de rendimiento
    this.performanceData.set(index.name, {
      execution_time: executionTime,
      usage_count: index.usage_count,
      last_used: new Date()
    });
  }

  // Ejecutar scan de colección (sin índice)
  executeCollectionScan(query, sort, limit) {
    const executionTime = 100 + Math.random() * 200; // 100-300ms
    
    console.log(`   ⚡ Tiempo de ejecución: ${executionTime.toFixed(2)}ms`);
    console.log(`   📊 Plan de ejecución: COLLSCAN (ineficiente)`);
    console.log(`   ⚠️  Advertencia: Esta consulta podría beneficiarse de un índice`);
  }

  // Analizar rendimiento de índices
  analyzeIndexPerformance() {
    console.log('\n📊 ANÁLISIS DE RENDIMIENTO DE ÍNDICES');
    console.log('-'.repeat(50));
    
    const performanceArray = Array.from(this.performanceData.entries());
    
    if (performanceArray.length === 0) {
      console.log('   No hay datos de rendimiento disponibles');
      return;
    }
    
    // Ordenar por tiempo de ejecución promedio
    performanceArray.sort((a, b) => a[1].execution_time - b[1].execution_time);
    
    performanceArray.forEach(([indexName, data]) => {
      const index = this.indexes.get(indexName);
      console.log(`\n📈 Índice: ${indexName}`);
      console.log(`   Tipo: ${index.type}`);
      console.log(`   Uso: ${data.usage_count} consultas`);
      console.log(`   Tiempo promedio: ${data.execution_time.toFixed(2)}ms`);
      console.log(`   Último uso: ${data.last_used.toLocaleString()}`);
      
      // Recomendaciones
      if (data.usage_count === 0) {
        console.log(`   💡 Recomendación: Considerar eliminar índice no utilizado`);
      } else if (data.execution_time > 50) {
        console.log(`   ⚠️  Recomendación: Revisar optimización del índice`);
      } else {
        console.log(`   ✅ Rendimiento óptimo`);
      }
    });
  }

  // Generar recomendaciones de índices
  generateIndexRecommendations() {
    console.log('\n💡 RECOMENDACIONES DE ÍNDICES');
    console.log('-'.repeat(50));
    
    // Analizar consultas sin índice
    const queriesWithoutIndex = this.queries.filter(q => q.index_used === 'COLLSCAN');
    
    if (queriesWithoutIndex.length > 0) {
      console.log('🔍 Consultas que podrían beneficiarse de índices:');
      
      queriesWithoutIndex.forEach((query, index) => {
        console.log(`\n   Consulta ${index + 1}:`);
        console.log(`     Filtros: ${JSON.stringify(query.query)}`);
        console.log(`     Ordenamiento: ${JSON.stringify(query.sort)}`);
        
        // Sugerir índice
        const suggestedFields = this.suggestIndexFields(query.query, query.sort);
        console.log(`     💡 Índice sugerido: ${JSON.stringify(suggestedFields)}`);
      });
    } else {
      console.log('✅ Todas las consultas están utilizando índices apropiados');
    }
    
    // Recomendaciones generales
    console.log('\n🌟 RECOMENDACIONES GENERALES:');
    console.log('   📱 Crear índices en campos frecuentemente consultados');
    console.log('   🔄 Usar índices compuestos para consultas complejas');
    console.log('   🎯 Evitar índices en campos con baja selectividad');
    console.log('   📊 Monitorear el uso de índices regularmente');
    console.log('   🗑️  Eliminar índices no utilizados');
  }

  // Sugerir campos para índice
  suggestIndexFields(query, sort) {
    const suggestedFields = {};
    
    // Agregar campos de consulta
    Object.keys(query).forEach(field => {
      suggestedFields[field] = 1;
    });
    
    // Agregar campos de ordenamiento
    Object.keys(sort).forEach(field => {
      if (!suggestedFields[field]) {
        suggestedFields[field] = 1;
      }
    });
    
    return suggestedFields;
  }

  // Ejecutar demostración completa
  runDemo() {
    console.log('🍃 SIMULADOR DE ÍNDICES DE MONGODB');
    console.log('=' .repeat(60));
    
    // Crear índices de ejemplo
    console.log('\n🚀 CREANDO ÍNDICES...');
    
    // Índices simples
    this.createIndex('users', { 'email': 1 }, { unique: true });
    this.createIndex('users', { 'username': 1 });
    this.createIndex('users', { 'age': 1 });
    this.createIndex('users', { 'created_at': -1 });
    
    // Índices compuestos
    this.createIndex('users', { 'age': 1, 'created_at': -1 });
    this.createIndex('users', { 'tags': 1, 'profile.experience': 1 });
    
    // Índices especializados
    this.createIndex('users', { 'tags': 1 }); // multikey
    this.createIndex('users', { 'profile.bio': 'text' }, { text: true });
    this.createIndex('users', { 'location': '2dsphere' }, { '2dsphere': true });
    
    // Ejecutar consultas de ejemplo
    console.log('\n🔍 EJECUTANDO CONSULTAS...');
    
    this.executeQuery('users', { 'email': 'juan@example.com' });
    this.executeQuery('users', { 'age': { $gte: 25 } });
    this.executeQuery('users', { 'tags': 'developer' });
    this.executeQuery('users', { 'age': { $gte: 25 } }, { 'created_at': -1 });
    this.executeQuery('users', { 'profile.skills': 'JavaScript' });
    
    // Consultas sin índice (para demostrar COLLSCAN)
    this.executeQuery('users', { 'profile.bio': { $regex: 'desarrollador' } });
    this.executeQuery('users', { 'last_login': { $gte: new Date('2024-01-01') } });
    
    // Analizar rendimiento
    this.analyzeIndexPerformance();
    
    // Generar recomendaciones
    this.generateIndexRecommendations();
    
    console.log('\n🎉 Demostración completada!');
  }
}

// Ejecutar simulador
const indexSimulator = new MongoDBIndexesSimulator();
indexSimulator.runDemo();
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos de MongoDB**
   - Documentos y colecciones
   - BSON y tipos de datos
   - Operadores de consulta

2. **Agregaciones y Pipeline**
   - $match, $group, $sort
   - $lookup, $unwind, $project
   - Expresiones de agregación

3. **Índices y Optimización**
   - Tipos de índices
   - Planes de ejecución
   - Profiling y monitoreo

4. **Replicación y Sharding**
   - Replica sets
   - Sharding strategies
   - Balanceo de carga

5. **Seguridad y Administración**
   - Autenticación y autorización
   - Backup y restauración
   - Monitoreo y alertas

### 🚀 **Proyectos Prácticos Recomendados:**

1. **API REST con MongoDB y Node.js**
2. **Sistema de gestión de usuarios**
3. **Blog con comentarios anidados**
4. **Dashboard de analytics**
5. **Sistema de notificaciones en tiempo real**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de MongoDB! 🍃**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador MongoDB! 🎯**
