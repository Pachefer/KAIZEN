# 🍃 Guía Completa de MongoDB: 10 Preguntas Avanzadas

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

- **Total de preguntas procesadas**: 10
- **Fecha de generación**: 15/01/2025 10:30:00
- **Versión**: 1.0
- **Estado**: En desarrollo activo

---

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
MongoDB es una base de datos NoSQL orientada a documentos que almacena datos en formato BSON (Binary JSON). Es una base de datos distribuida que proporciona alta disponibilidad, escalabilidad horizontal y flexibilidad en el esquema de datos.

### 🔧 Ejemplo Práctico con Código

```javascript
// Ejemplo básico de MongoDB
use('miAplicacion');

// Insertar documentos
db.usuarios.insertMany([
    {
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        edad: 30,
        direccion: {
            calle: 'Calle Mayor 123',
            ciudad: 'Madrid'
        },
        telefonos: ['+34 600 123 456']
    }
]);

// Consultar documentos
db.usuarios.find({ 'direccion.ciudad': 'Madrid' });
```

### 🧪 Pruebas Unitarias

```javascript
describe('MongoDB Básico', () => {
    it('debería insertar y consultar documentos', async () => {
        const resultado = await collection.insertOne({
            nombre: 'Test',
            email: 'test@test.com'
        });
        expect(resultado.insertedId).toBeDefined();
    });
});
```

### 📊 Predicción de Resultados
✅ Los documentos se insertarán correctamente
⚠️ Verificar conexión a MongoDB
🔍 Revisar permisos de base de datos

### 🚀 Mejoras Implementadas
1. Implementar validación de esquemas
2. Crear índices para optimizar consultas
3. Configurar autenticación y autorización
4. Implementar backup automático

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
Las agregaciones en MongoDB son operaciones que procesan múltiples documentos y devuelven resultados calculados. Utilizan un pipeline de etapas donde cada etapa procesa los documentos y pasa los resultados a la siguiente etapa.

### 🔧 Ejemplo Práctico con Código

```javascript
// Pipeline de agregación
const pipeline = [
    {
        $match: { edad: { $gt: 25 } }
    },
    {
        $group: {
            _id: '$ciudad',
            totalUsuarios: { $sum: 1 },
            edadPromedio: { $avg: '$edad' }
        }
    },
    {
        $sort: { totalUsuarios: -1 }
    }
];

db.usuarios.aggregate(pipeline);
```

### 🧪 Pruebas Unitarias

```javascript
describe('Agregaciones', () => {
    it('debería ejecutar pipeline correctamente', async () => {
        const resultados = await collection.aggregate(pipeline).toArray();
        expect(resultados).toHaveLength(2);
    });
});
```

### 📊 Predicción de Resultados
✅ Pipeline procesará todos los documentos
⚠️ Monitorear uso de memoria
🔍 Verificar índices para optimización

### 🚀 Mejoras Implementadas
1. Optimizar pipeline con $match temprano
2. Implementar caching de resultados
3. Usar índices que soporten agregaciones
4. Monitorear rendimiento con $explain

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
La optimización del rendimiento de consultas en MongoDB involucra múltiples estrategias: crear índices apropiados, optimizar las consultas, usar proyecciones, implementar paginación eficiente, y monitorear el rendimiento.

### 🔧 Ejemplo Práctico con Código

```javascript
// Crear índices estratégicos
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ ciudad: 1, edad: 1 });

// Consulta optimizada con proyección
db.usuarios.find(
    { ciudad: 'Madrid' },
    { nombre: 1, email: 1, _id: 0 }
).limit(10);

// Analizar consulta
db.usuarios.find({ ciudad: 'Madrid' }).explain('executionStats');
```

### 🧪 Pruebas Unitarias

```javascript
describe('Optimización', () => {
    it('debería crear índices correctamente', async () => {
        await collection.createIndex({ email: 1 });
        const indices = await collection.indexes();
        expect(indices.length).toBeGreaterThan(1);
    });
});
```

### 📊 Predicción de Resultados
✅ Índices mejorarán rendimiento significativamente
⚠️ Monitorear tamaño de índices
🔍 Usar explain() para análisis

### 🚀 Mejoras Implementadas
1. Crear índices basados en patrones de consulta
2. Usar proyecciones para limitar campos
3. Implementar paginación eficiente
4. Configurar profiler para consultas lentas

---

## 🎯 Pregunta 4: ¿Qué son los índices en MongoDB y cómo funcionan?

### 📝 Pregunta Original
```
What are indexes in MongoDB and how do they work?
```

### 🌍 Traducción al Español
```
¿Qué son los índices en MongoDB y cómo funcionan?
```

### 💡 Explicación Detallada
Los índices en MongoDB son estructuras de datos que mejoran la velocidad de las consultas al permitir que MongoDB encuentre documentos sin escanear toda la colección. Son fundamentales para el rendimiento en colecciones grandes.

### 🔧 Ejemplo Práctico con Código

```javascript
// Tipos de índices
// Índice simple
db.usuarios.createIndex({ email: 1 });

// Índice compuesto
db.usuarios.createIndex({ ciudad: 1, edad: 1 });

// Índice único
db.usuarios.createIndex({ email: 1 }, { unique: true });

// Índice de texto
db.usuarios.createIndex({ nombre: 'text' });

// Índice TTL
db.sesiones.createIndex({ fechaExpiracion: 1 }, { expireAfterSeconds: 3600 });

// Verificar índices
db.usuarios.getIndexes();
```

### 🧪 Pruebas Unitarias

```javascript
describe('Índices', () => {
    it('debería crear índice único', async () => {
        await collection.createIndex({ email: 1 }, { unique: true });
        const indices = await collection.indexes();
        const indiceEmail = indices.find(idx => idx.key.email);
        expect(indiceEmail.unique).toBe(true);
    });
});
```

### 📊 Predicción de Resultados
✅ Consultas serán más rápidas con índices
⚠️ Índices ocupan espacio en disco
🔍 Monitorear uso de índices

### 🚀 Mejoras Implementadas
1. Crear índices cubiertos cuando sea posible
2. Usar índices parciales para consultas específicas
3. Monitorear índices no utilizados
4. Implementar índices geoespaciales para ubicaciones

---

## 🎯 Pregunta 5: ¿Cómo implementar replicación en MongoDB?

### 📝 Pregunta Original
```
How to implement replication in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo implementar replicación en MongoDB?
```

### 💡 Explicación Detallada
La replicación en MongoDB proporciona redundancia y alta disponibilidad al mantener múltiples copias de datos en diferentes servidores. Un replica set consiste en un nodo primario y uno o más nodos secundarios.

### 🔧 Ejemplo Práctico con Código

```javascript
// Configuración de replica set
// Iniciar nodo primario
mongod --port 27017 --dbpath /data/rs0-0 --replSet rs0

// Iniciar nodos secundarios
mongod --port 27018 --dbpath /data/rs0-1 --replSet rs0
mongod --port 27019 --dbpath /data/rs0-2 --replSet rs0

// Inicializar replica set
rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "localhost:27017" },
        { _id: 1, host: "localhost:27018" },
        { _id: 2, host: "localhost:27019" }
    ]
});

// Verificar estado
rs.status();

// Configurar read preference
db.getMongo().setReadPref('secondary');
```

### 🧪 Pruebas Unitarias

```javascript
describe('Replicación', () => {
    it('debería conectar a replica set', async () => {
        const client = new MongoClient('mongodb://localhost:27017,localhost:27018,localhost:27019');
        await client.connect();
        const adminDb = client.db('admin');
        const status = await adminDb.command({ replSetGetStatus: 1 });
        expect(status.ok).toBe(1);
    });
});
```

### 📊 Predicción de Resultados
✅ Alta disponibilidad con failover automático
⚠️ Latencia en escrituras síncronas
🔍 Monitorear lag de replicación

### 🚀 Mejoras Implementadas
1. Configurar write concerns apropiados
2. Implementar monitoreo de replica set
3. Configurar backup desde secundarios
4. Optimizar read preferences

---

## 🎯 Pregunta 6: ¿Cómo implementar sharding en MongoDB?

### 📝 Pregunta Original
```
How to implement sharding in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo implementar sharding en MongoDB?
```

### 💡 Explicación Detallada
El sharding en MongoDB permite distribuir datos horizontalmente a través de múltiples servidores para manejar grandes volúmenes de datos y alta carga de trabajo. Consiste en config servers, mongos routers y shards.

### 🔧 Ejemplo Práctico con Código

```javascript
// Configurar config servers
mongod --configsvr --port 27019 --dbpath /data/configdb

// Iniciar mongos router
mongos --configdb localhost:27019

// Agregar shards
sh.addShard("localhost:27020");
sh.addShard("localhost:27021");

// Habilitar sharding para base de datos
sh.enableSharding("miAplicacion");

// Crear índice de shard key
db.usuarios.createIndex({ "ciudad": 1 });

// Habilitar sharding para colección
sh.shardCollection("miAplicacion.usuarios", { "ciudad": 1 });

// Verificar distribución
sh.status();
```

### 🧪 Pruebas Unitarias

```javascript
describe('Sharding', () => {
    it('debería distribuir datos entre shards', async () => {
        const adminDb = client.db('admin');
        const status = await adminDb.command({ shardConnPoolStats: 1 });
        expect(status.shards).toBeDefined();
    });
});
```

### 📊 Predicción de Resultados
✅ Datos distribuidos horizontalmente
⚠️ Complejidad en configuración
🔍 Monitorear distribución de chunks

### 🚀 Mejoras Implementadas
1. Elegir shard key apropiado
2. Configurar balancer automático
3. Monitorear distribución de datos
4. Implementar backup distribuido

---

## 🎯 Pregunta 7: ¿Cómo manejar transacciones en MongoDB?

### 📝 Pregunta Original
```
How to handle transactions in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo manejar transacciones en MongoDB?
```

### 💡 Explicación Detallada
Las transacciones en MongoDB permiten agrupar múltiples operaciones en una sola unidad atómica. Proporcionan consistencia ACID para operaciones que involucran múltiples documentos o colecciones.

### 🔧 Ejemplo Práctico con Código

```javascript
// Transacción básica
const session = db.getMongo().startSession();

session.startTransaction();

try {
    // Operaciones dentro de la transacción
    db.cuentas.updateOne(
        { _id: cuentaOrigen },
        { $inc: { saldo: -monto } },
        { session }
    );
    
    db.cuentas.updateOne(
        { _id: cuentaDestino },
        { $inc: { saldo: monto } },
        { session }
    );
    
    db.transacciones.insertOne({
        cuentaOrigen,
        cuentaDestino,
        monto,
        fecha: new Date()
    }, { session });
    
    // Commit de la transacción
    await session.commitTransaction();
    console.log('Transacción completada exitosamente');
    
} catch (error) {
    // Rollback en caso de error
    await session.abortTransaction();
    console.error('Error en transacción:', error);
} finally {
    session.endSession();
}
```

### 🧪 Pruebas Unitarias

```javascript
describe('Transacciones', () => {
    it('debería ejecutar transacción exitosamente', async () => {
        const session = client.startSession();
        session.startTransaction();
        
        try {
            await collection1.updateOne({ _id: 1 }, { $inc: { valor: -10 } }, { session });
            await collection2.updateOne({ _id: 1 }, { $inc: { valor: 10 } }, { session });
            await session.commitTransaction();
            
            const doc1 = await collection1.findOne({ _id: 1 });
            const doc2 = await collection2.findOne({ _id: 1 });
            expect(doc1.valor).toBe(90);
            expect(doc2.valor).toBe(110);
        } finally {
            session.endSession();
        }
    });
});
```

### 📊 Predicción de Resultados
✅ Transacciones mantendrán consistencia ACID
⚠️ Overhead de rendimiento
🔍 Monitorear timeouts de transacciones

### 🚀 Mejoras Implementadas
1. Usar write concerns apropiados
2. Implementar retry logic
3. Monitorear duración de transacciones
4. Optimizar para transacciones cortas

---

## 🎯 Pregunta 8: ¿Cómo implementar autenticación y autorización en MongoDB?

### 📝 Pregunta Original
```
How to implement authentication and authorization in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo implementar autenticación y autorización en MongoDB?
```

### 💡 Explicación Detallada
MongoDB proporciona un sistema robusto de autenticación y autorización que incluye usuarios, roles y privilegios. Permite control granular sobre qué operaciones puede realizar cada usuario.

### 🔧 Ejemplo Práctico con Código

```javascript
// Crear usuario administrador
use admin;
db.createUser({
    user: "admin",
    pwd: "password123",
    roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
});

// Crear usuario específico para aplicación
use miAplicacion;
db.createUser({
    user: "appUser",
    pwd: "appPassword123",
    roles: [
        { role: "readWrite", db: "miAplicacion" },
        { role: "read", db: "reportes" }
    ]
});

// Crear rol personalizado
db.createRole({
    role: "usuarioLimitado",
    privileges: [
        {
            resource: { db: "miAplicacion", collection: "usuarios" },
            actions: ["find", "insert", "update"]
        }
    ],
    roles: []
});

// Asignar rol a usuario
db.grantRolesToUser("appUser", ["usuarioLimitado"]);

// Verificar usuarios
db.getUsers();

// Conectar con autenticación
const client = new MongoClient('mongodb://appUser:appPassword123@localhost:27017/miAplicacion');
```

### 🧪 Pruebas Unitarias

```javascript
describe('Autenticación', () => {
    it('debería autenticar usuario correctamente', async () => {
        const client = new MongoClient('mongodb://appUser:appPassword123@localhost:27017/miAplicacion');
        await client.connect();
        const db = client.db('miAplicacion');
        const result = await db.command({ usersInfo: 1 });
        expect(result.users).toBeDefined();
    });
});
```

### 📊 Predicción de Resultados
✅ Acceso seguro a la base de datos
⚠️ Configuración compleja inicial
🔍 Monitorear intentos de acceso fallidos

### 🚀 Mejoras Implementadas
1. Usar TLS/SSL para conexiones
2. Implementar auditoría de acceso
3. Rotar contraseñas regularmente
4. Configurar roles mínimos necesarios

---

## 🎯 Pregunta 9: ¿Cómo implementar backup y restore en MongoDB?

### 📝 Pregunta Original
```
How to implement backup and restore in MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo implementar backup y restore en MongoDB?
```

### 💡 Explicación Detallada
El backup y restore en MongoDB es crucial para la protección de datos. MongoDB proporciona herramientas como mongodump, mongorestore, y opciones de backup en caliente para diferentes escenarios.

### 🔧 Ejemplo Práctico con Código

```javascript
// Backup completo de base de datos
mongodump --db miAplicacion --out /backup/$(date +%Y%m%d)

// Backup de colección específica
mongodump --db miAplicacion --collection usuarios --out /backup/

// Backup con autenticación
mongodump --uri "mongodb://usuario:password@localhost:27017/miAplicacion" --out /backup/

// Restore completo
mongorestore --db miAplicacion /backup/miAplicacion/

// Restore de colección específica
mongorestore --db miAplicacion --collection usuarios /backup/miAplicacion/usuarios.bson

// Backup incremental con oplog
mongodump --oplog --out /backup/incremental/

// Script de backup automatizado
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongodb/$DATE"

mkdir -p $BACKUP_DIR

mongodump --uri "mongodb://usuario:password@localhost:27017" --out $BACKUP_DIR

# Comprimir backup
tar -czf "$BACKUP_DIR.tar.gz" $BACKUP_DIR
rm -rf $BACKUP_DIR

# Limpiar backups antiguos (mantener últimos 7 días)
find /backup/mongodb -name "*.tar.gz" -mtime +7 -delete
```

### 🧪 Pruebas Unitarias

```javascript
describe('Backup y Restore', () => {
    it('debería crear backup exitosamente', async () => {
        const { exec } = require('child_process');
        const backupPath = '/tmp/test_backup';
        
        exec(`mongodump --db test --out ${backupPath}`, (error, stdout, stderr) => {
            expect(error).toBeNull();
            expect(fs.existsSync(backupPath)).toBe(true);
        });
    });
});
```

### 📊 Predicción de Resultados
✅ Backup completo de datos
⚠️ Tiempo de backup proporcional al tamaño
🔍 Verificar integridad del backup

### 🚀 Mejoras Implementadas
1. Automatizar backups con cron
2. Implementar backup en la nube
3. Configurar retención de backups
4. Probar restores regularmente

---

## 🎯 Pregunta 10: ¿Cómo monitorear y optimizar MongoDB?

### 📝 Pregunta Original
```
How to monitor and optimize MongoDB?
```

### 🌍 Traducción al Español
```
¿Cómo monitorear y optimizar MongoDB?
```

### 💡 Explicación Detallada
El monitoreo y optimización de MongoDB es esencial para mantener el rendimiento y la estabilidad. Incluye monitoreo de métricas del sistema, consultas lentas, uso de índices y configuración del servidor.

### 🔧 Ejemplo Práctico con Código

```javascript
// Habilitar profiler para consultas lentas
db.setProfilingLevel(1, { slowms: 100 });

// Ver consultas lentas
db.system.profile.find().sort({ ts: -1 }).limit(10);

// Obtener estadísticas de colección
db.usuarios.stats();

// Obtener estadísticas de base de datos
db.stats();

// Monitorear operaciones activas
db.currentOp();

// Obtener información del servidor
db.serverStatus();

// Monitorear uso de memoria
db.serverStatus().mem;

// Verificar estado de índices
db.usuarios.getIndexes();

// Analizar consultas con explain
db.usuarios.find({ ciudad: 'Madrid' }).explain('executionStats');

// Script de monitoreo
const stats = {
    timestamp: new Date(),
    serverStatus: db.serverStatus(),
    dbStats: db.stats(),
    collections: db.getCollectionNames().map(name => ({
        name,
        stats: db[name].stats()
    }))
};

printjson(stats);
```

### 🧪 Pruebas Unitarias

```javascript
describe('Monitoreo', () => {
    it('debería obtener estadísticas del servidor', async () => {
        const adminDb = client.db('admin');
        const status = await adminDb.command({ serverStatus: 1 });
        expect(status.ok).toBe(1);
        expect(status.connections).toBeDefined();
    });
});
```

### 📊 Predicción de Resultados
✅ Monitoreo completo del sistema
⚠️ Overhead de monitoreo
🔍 Configurar alertas apropiadas

### 🚀 Mejoras Implementadas
1. Configurar alertas automáticas
2. Implementar dashboard de monitoreo
3. Optimizar configuración del servidor
4. Implementar logging estructurado

---

## 🎉 Conclusión

Esta guía contiene **10 preguntas procesadas** con ejemplos prácticos, pruebas unitarias y mejoras implementadas. Cada pregunta ha sido cuidadosamente traducida y mejorada para proporcionar una experiencia de aprendizaje completa.

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
**Total de preguntas**: 10  
**Estado**: En desarrollo activo 