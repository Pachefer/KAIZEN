#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de MongoDB
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class MongoDBQuestionProcessor:
    def __init__(self, input_file="mongodb_questions_structured.json"):
        self.input_file = input_file
        self.questions = []
        self.processed_questions = []
        
    def load_questions(self):
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.questions = data.get('questions', [])
            print(f"✅ Cargadas {len(self.questions)} preguntas desde {self.input_file}")
            return True
        except FileNotFoundError:
            print(f"❌ No se encontró el archivo {self.input_file}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Error al parsear JSON: {e}")
            return False
    
    def translate_question(self, question_text):
        translations = {
            'What is': '¿Qué es',
            'How does': '¿Cómo funciona',
            'Explain': 'Explica',
            'Describe': 'Describe',
            'What are': '¿Cuáles son',
            'How to': '¿Cómo',
            'Why': '¿Por qué',
            'When': '¿Cuándo',
            'Where': '¿Dónde',
            'Which': '¿Cuál',
            'MongoDB': 'MongoDB',
            'database': 'base de datos',
            'collection': 'colección',
            'document': 'documento',
            'index': 'índice',
            'query': 'consulta',
            'aggregation': 'agregación',
            'replication': 'replicación',
            'sharding': 'fragmentación',
            'transaction': 'transacción',
            'BSON': 'BSON',
            'JSON': 'JSON',
            'NoSQL': 'NoSQL',
            'CRUD': 'CRUD',
            'ACID': 'ACID',
            'CAP': 'CAP',
            'consistency': 'consistencia',
            'availability': 'disponibilidad',
            'partition': 'partición',
            'tolerance': 'tolerancia',
            'primary': 'primario',
            'secondary': 'secundario',
            'arbiter': 'árbitro',
            'mongod': 'mongod',
            'mongos': 'mongos',
            'mongoimport': 'mongoimport',
            'mongoexport': 'mongoexport',
            'mongodump': 'mongodump',
            'mongorestore': 'mongorestore',
            'GridFS': 'GridFS',
            'MapReduce': 'MapReduce',
            'aggregation pipeline': 'pipeline de agregación',
            'lookup': 'lookup',
            'match': 'match',
            'group': 'group',
            'sort': 'sort',
            'limit': 'limit',
            'skip': 'skip',
            'project': 'project',
            'unwind': 'unwind',
            'facet': 'facet',
            'bucket': 'bucket',
            'geoNear': 'geoNear',
            'geoWithin': 'geoWithin',
            'geoIntersects': 'geoIntersects',
            'text': 'text',
            'regex': 'regex',
            'wildcard': 'wildcard',
            'compound': 'compuesto',
            'unique': 'único',
            'sparse': 'disperso',
            'TTL': 'TTL',
            'background': 'background',
            'partial': 'parcial',
            'covered': 'cubierto',
            'hint': 'hint',
            'explain': 'explain',
            'profiler': 'profiler',
            'slow query': 'consulta lenta',
            'performance': 'rendimiento',
            'optimization': 'optimización',
            'monitoring': 'monitoreo',
            'backup': 'respaldo',
            'restore': 'restaurar',
            'authentication': 'autenticación',
            'authorization': 'autorización',
            'role': 'rol',
            'privilege': 'privilegio',
            'audit': 'auditoría',
            'encryption': 'encriptación',
            'compression': 'compresión',
            'journaling': 'journaling',
            'write concern': 'write concern',
            'read preference': 'read preference',
            'write majority': 'write majority',
            'read majority': 'read majority',
            'local': 'local',
            'available': 'available',
            'linearizable': 'linearizable',
            'snapshot': 'snapshot',
            'causal': 'causal',
            'session': 'sesión',
            'retryable write': 'escritura reintentable',
            'change stream': 'change stream',
            'oplog': 'oplog',
            'election': 'elección',
            'heartbeat': 'heartbeat',
            'config server': 'servidor de configuración',
            'mongos router': 'enrutador mongos',
            'chunk': 'chunk',
            'balancer': 'balancer',
            'jumbo chunk': 'chunk jumbo',
            'zone': 'zona',
            'tag': 'tag',
            'range': 'rango',
            'hash': 'hash'
        }
        
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text):
        examples = {
            'basic_query': {
                'title': 'Consulta Básica en MongoDB',
                'code': '''// Ejemplo de consulta básica en MongoDB
// Conectar a la base de datos
use('miBaseDeDatos');

// Insertar documentos de ejemplo
db.usuarios.insertMany([
    {
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        edad: 30,
        ciudad: 'Madrid',
        fecha_registro: new Date('2024-01-15')
    },
    {
        nombre: 'María García',
        email: 'maria@ejemplo.com',
        edad: 25,
        ciudad: 'Barcelona',
        fecha_registro: new Date('2024-01-20')
    },
    {
        nombre: 'Carlos López',
        email: 'carlos@ejemplo.com',
        edad: 35,
        ciudad: 'Madrid',
        fecha_registro: new Date('2024-01-25')
    }
]);

// Consulta básica: encontrar todos los usuarios
const todosUsuarios = db.usuarios.find();
print('Todos los usuarios:');
todosUsuarios.forEach(printjson);

// Consulta con filtro: usuarios de Madrid
const usuariosMadrid = db.usuarios.find({ ciudad: 'Madrid' });
print('\\nUsuarios de Madrid:');
usuariosMadrid.forEach(printjson);

// Consulta con múltiples filtros: usuarios mayores de 25 años en Madrid
const usuariosFiltrados = db.usuarios.find({
    ciudad: 'Madrid',
    edad: { $gt: 25 }
});
print('\\nUsuarios mayores de 25 años en Madrid:');
usuariosFiltrados.forEach(printjson);''',
                'explanation': 'Este ejemplo muestra consultas básicas en MongoDB usando la sintaxis de MongoDB Shell.'
            },
            'aggregation': {
                'title': 'Pipeline de Agregación',
                'code': '''// Ejemplo de pipeline de agregación en MongoDB
// Pipeline para analizar usuarios por ciudad
const pipeline = [
    // Fase 1: Filtrar usuarios mayores de 20 años
    {
        $match: {
            edad: { $gt: 20 }
        }
    },
    // Fase 2: Agrupar por ciudad y calcular estadísticas
    {
        $group: {
            _id: '$ciudad',
            totalUsuarios: { $sum: 1 },
            edadPromedio: { $avg: '$edad' },
            edadMinima: { $min: '$edad' },
            edadMaxima: { $max: '$edad' }
        }
    },
    // Fase 3: Ordenar por total de usuarios (descendente)
    {
        $sort: {
            totalUsuarios: -1
        }
    },
    // Fase 4: Limitar a los primeros 5 resultados
    {
        $limit: 5
    }
];

// Ejecutar el pipeline
const resultados = db.usuarios.aggregate(pipeline);
print('Análisis de usuarios por ciudad:');
resultados.forEach(printjson);

// Pipeline con lookup para datos relacionados
const pipelineConLookup = [
    {
        $lookup: {
            from: 'pedidos',
            localField: '_id',
            foreignField: 'usuario_id',
            as: 'pedidos'
        }
    },
    {
        $addFields: {
            totalPedidos: { $size: '$pedidos' },
            totalGastado: {
                $sum: '$pedidos.monto'
            }
        }
    },
    {
        $project: {
            nombre: 1,
            email: 1,
            totalPedidos: 1,
            totalGastado: 1,
            pedidos: 0 // Excluir el array de pedidos del resultado
        }
    }
];''',
                'explanation': 'Este ejemplo muestra cómo usar pipelines de agregación para análisis complejos de datos.'
            },
            'indexes': {
                'title': 'Creación y Uso de Índices',
                'code': '''// Ejemplo de creación y uso de índices en MongoDB
// Crear índice simple en el campo email
db.usuarios.createIndex({ email: 1 });
print('Índice creado en campo email');

// Crear índice compuesto en ciudad y edad
db.usuarios.createIndex({ ciudad: 1, edad: 1 });
print('Índice compuesto creado en ciudad y edad');

// Crear índice único en email
db.usuarios.createIndex({ email: 1 }, { unique: true });
print('Índice único creado en email');

// Crear índice de texto para búsquedas de texto
db.usuarios.createIndex({ nombre: 'text', email: 'text' });
print('Índice de texto creado en nombre y email');

// Crear índice TTL para documentos que expiran
db.sesiones.createIndex({ fechaExpiracion: 1 }, { expireAfterSeconds: 3600 });
print('Índice TTL creado para sesiones (expiran en 1 hora)');

// Crear índice geoespacial para ubicaciones
db.ubicaciones.createIndex({ ubicacion: '2dsphere' });
print('Índice geoespacial creado');

// Verificar índices existentes
const indices = db.usuarios.getIndexes();
print('Índices en la colección usuarios:');
indices.forEach(printjson);

// Analizar consulta con explain()
const explicacion = db.usuarios.find({ ciudad: 'Madrid' }).explain('executionStats');
print('Análisis de consulta:');
printjson(explicacion);''',
                'explanation': 'Este ejemplo muestra cómo crear diferentes tipos de índices para optimizar consultas.'
            }
        }
        
        question_lower = question_text.lower()
        
        if 'query' in question_lower or 'find' in question_lower:
            return examples['basic_query']
        elif 'aggregation' in question_lower or 'pipeline' in question_lower:
            return examples['aggregation']
        elif 'index' in question_lower:
            return examples['indexes']
        else:
            return {
                'title': 'Ejemplo Genérico de MongoDB',
                'code': '''// Ejemplo genérico de MongoDB
// Conectar a la base de datos
use('miBaseDeDatos');

// Insertar un documento
db.ejemplo.insertOne({
    nombre: 'Ejemplo',
    valor: 42,
    fecha: new Date()
});

// Consultar el documento
const resultado = db.ejemplo.findOne();
printjson(resultado);''',
                'explanation': 'Este es un ejemplo básico de MongoDB que muestra operaciones CRUD fundamentales.'
            }
    
    def generate_unit_tests(self, example_code):
        return f'''// Pruebas unitarias para el ejemplo de MongoDB
const { MongoClient } = require('mongodb');
const {{ MongoMemoryServer }} = require('mongodb-memory-server');

describe('Pruebas de MongoDB', () => {{
    let mongoServer;
    let client;
    let db;
    
    beforeAll(async () => {{
        // Iniciar servidor MongoDB en memoria
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('test');
    }});
    
    afterAll(async () => {{
        await client.close();
        await mongoServer.stop();
    }});
    
    beforeEach(async () => {{
        // Limpiar colección antes de cada prueba
        await db.collection('usuarios').deleteMany({{}});
    }});
    
    it('debería insertar y consultar documentos', async () => {{
        const collection = db.collection('usuarios');
        
        // Insertar documento
        const resultado = await collection.insertOne({{
            nombre: 'Test',
            email: 'test@test.com'
        }});
        
        expect(resultado.insertedId).toBeDefined();
        
        // Consultar documento
        const documento = await collection.findOne({{ email: 'test@test.com' }});
        expect(documento.nombre).toBe('Test');
    }});
    
    it('debería ejecutar agregaciones correctamente', async () => {{
        const collection = db.collection('usuarios');
        
        // Insertar datos de prueba
        await collection.insertMany([
            {{ nombre: 'Juan', ciudad: 'Madrid', edad: 30 }},
            {{ nombre: 'María', ciudad: 'Madrid', edad: 25 }},
            {{ nombre: 'Carlos', ciudad: 'Barcelona', edad: 35 }}
        ]);
        
        // Ejecutar agregación
        const pipeline = [
            {{ $group: {{ _id: '$ciudad', total: {{ $sum: 1 }} }} }}
        ];
        
        const resultados = await collection.aggregate(pipeline).toArray();
        expect(resultados).toHaveLength(2);
    }});
}});

// Para ejecutar las pruebas:
// npm install --save-dev jest mongodb mongodb-memory-server
// npx jest test.js''';
    
    def predict_results(self, example_code):
        return '''📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- Las consultas se ejecutarán sin errores
- Los documentos se insertarán correctamente
- Las agregaciones devolverán los resultados esperados
- Los índices mejorarán el rendimiento de las consultas

⚠️ **Posibles Errores:**
- Errores de conexión si MongoDB no está ejecutándose
- Errores de sintaxis en las consultas
- Errores de permisos si no hay acceso a la base de datos
- Errores de memoria si las consultas son muy grandes

🔍 **Para Verificar:**
1. Asegúrate de que MongoDB esté ejecutándose
2. Verifica que tienes permisos de lectura/escritura
3. Ejecuta las consultas en MongoDB Shell o Compass
4. Revisa los logs de MongoDB para errores'''
    
    def suggest_improvements(self, question_text):
        improvements = {
            'query': '''🚀 Mejoras Sugeridas:

1. **Optimizar consultas con índices:**
   - Crear índices en campos frecuentemente consultados
   - Usar índices compuestos para consultas complejas
   - Monitorear el uso de índices con explain()

2. **Implementar paginación:**
   - Usar limit() y skip() para grandes conjuntos de datos
   - Considerar cursor-based pagination para mejor rendimiento

3. **Agregar validación de esquemas:**
   - Usar MongoDB Schema Validation
   - Implementar validación en el lado del cliente

4. **Optimizar proyecciones:**
   - Seleccionar solo los campos necesarios
   - Excluir campos grandes cuando sea posible''',
            
            'aggregation': '''🚀 Mejoras Sugeridas:

1. **Optimizar pipeline de agregación:**
   - Usar $match al inicio para filtrar datos
   - Aplicar $project temprano para reducir campos
   - Usar índices que soporten las operaciones de agregación

2. **Implementar caching:**
   - Cachear resultados de agregaciones costosas
   - Usar MongoDB Change Streams para invalidar cache

3. **Monitorear rendimiento:**
   - Usar $explain para analizar pipelines
   - Monitorear el uso de memoria y CPU

4. **Considerar agregaciones incrementales:**
   - Usar $facet para múltiples agregaciones
   - Implementar agregaciones en tiempo real''',
            
            'indexes': '''🚀 Mejoras Sugeridas:

1. **Estrategia de índices:**
   - Crear índices basados en patrones de consulta
   - Usar índices cubiertos cuando sea posible
   - Considerar índices parciales para consultas específicas

2. **Monitoreo de índices:**
   - Usar db.collection.getIndexes() regularmente
   - Monitorear el tamaño y uso de índices
   - Eliminar índices no utilizados

3. **Optimización de índices:**
   - Usar índices TTL para datos que expiran
   - Considerar índices geoespaciales para ubicaciones
   - Implementar índices de texto para búsquedas'''

        }
        
        question_lower = question_text.lower()
        
        if 'query' in question_lower or 'find' in question_lower:
            return improvements['query']
        elif 'aggregation' in question_lower or 'pipeline' in question_lower:
            return improvements['aggregation']
        elif 'index' in question_lower:
            return improvements['indexes']
        else:
            return '''🚀 Mejoras Sugeridas:

1. **Implementar mejores prácticas de MongoDB:**
   - Usar conexiones pooling
   - Implementar retry logic para operaciones
   - Usar write concerns apropiados

2. **Optimizar rendimiento:**
   - Monitorear consultas lentas
   - Usar MongoDB Compass para análisis
   - Implementar caching donde sea apropiado

3. **Mejorar seguridad:**
   - Implementar autenticación y autorización
   - Usar TLS/SSL para conexiones
   - Validar entrada de datos

4. **Implementar monitoreo:**
   - Usar MongoDB Ops Manager
   - Configurar alertas para métricas clave
   - Implementar logging estructurado'''
    
    def process_question(self, question_data):
        question_text = question_data['question']
        answer_text = question_data['answer']
        
        translated_question = self.translate_question(question_text)
        example = self.generate_example_code(question_text)
        unit_tests = self.generate_unit_tests(example['code'])
        results_prediction = self.predict_results(example['code'])
        improvements = self.suggest_improvements(question_text)
        
        processed_question = {
            'original_question': question_text,
            'translated_question': translated_question,
            'original_answer': answer_text,
            'example': example,
            'unit_tests': unit_tests,
            'results_prediction': results_prediction,
            'improvements': improvements,
            'page': question_data.get('page', ''),
            'processed_at': datetime.now().isoformat()
        }
        
        return processed_question
    
    def process_all_questions(self, limit=None):
        print(f"\n🔄 Procesando preguntas...")
        
        questions_to_process = self.questions[:limit] if limit else self.questions
        
        for i, question_data in enumerate(questions_to_process, 1):
            print(f"📝 Procesando pregunta {i}/{len(questions_to_process)}")
            
            try:
                processed_question = self.process_question(question_data)
                self.processed_questions.append(processed_question)
            except Exception as e:
                print(f"❌ Error procesando pregunta {i}: {e}")
        
        print(f"✅ Procesadas {len(self.processed_questions)} preguntas")
    
    def save_processed_questions(self, output_file="mongodb_questions_processed.json"):
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '300+ MongoDB Interview Questions and Answers',
                'author': 'Salunke, Manish',
                'processed_at': datetime.now().isoformat(),
                'total_processed': len(self.processed_questions),
                'version': '1.0'
            },
            'questions': self.processed_questions
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Preguntas procesadas guardadas en {output_file}")
    
    def run_processing(self, limit=None):
        print("🚀 Iniciando procesamiento de preguntas de MongoDB")
        print("=" * 60)
        
        if not self.load_questions():
            return False
        
        self.process_all_questions(limit)
        self.save_processed_questions()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    input_file = "mongodb_questions_structured.json"
    
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_mongodb_questions.py")
        return
    
    processor = MongoDBQuestionProcessor(input_file)
    success = processor.run_processing(limit=10)
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: mongodb_questions_processed.json")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 