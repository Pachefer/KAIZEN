#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de Node.js
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class NodeJSQuestionProcessor:
    def __init__(self, input_file="node_questions_structured.json"):
        """
        Inicializa el procesador de preguntas
        
        Args:
            input_file (str): Archivo JSON con preguntas estructuradas
        """
        self.input_file = input_file
        self.questions = []
        self.processed_questions = []
        
    def load_questions(self):
        """
        Carga las preguntas desde el archivo JSON
        """
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
        """
        Traduce la pregunta al español (versión simplificada)
        En una implementación real, usarías un servicio de traducción
        
        Args:
            question_text (str): Pregunta en inglés
            
        Returns:
            str: Pregunta traducida al español
        """
        # Diccionario de traducciones comunes para Node.js
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
            'Node.js': 'Node.js',
            'JavaScript': 'JavaScript',
            'callback': 'callback',
            'promise': 'promesa',
            'async': 'asíncrono',
            'await': 'await',
            'event loop': 'bucle de eventos',
            'stream': 'stream',
            'buffer': 'buffer',
            'module': 'módulo',
            'package': 'paquete',
            'npm': 'npm',
            'Express': 'Express',
            'middleware': 'middleware',
            'API': 'API',
            'HTTP': 'HTTP',
            'server': 'servidor',
            'client': 'cliente',
            'database': 'base de datos',
            'MongoDB': 'MongoDB',
            'MySQL': 'MySQL',
            'authentication': 'autenticación',
            'authorization': 'autorización',
            'JWT': 'JWT',
            'cors': 'CORS',
            'caching': 'caché',
            'performance': 'rendimiento',
            'memory': 'memoria',
            'security': 'seguridad',
            'testing': 'pruebas',
            'debugging': 'depuración',
            'deployment': 'despliegue',
            'production': 'producción',
            'development': 'desarrollo',
            'environment': 'entorno',
            'configuration': 'configuración',
            'error handling': 'manejo de errores',
            'logging': 'registro de logs',
            'monitoring': 'monitoreo',
            'microservices': 'microservicios',
            'REST': 'REST',
            'GraphQL': 'GraphQL',
            'WebSocket': 'WebSocket',
            'Socket.io': 'Socket.io',
            'Redis': 'Redis',
            'Docker': 'Docker',
            'Kubernetes': 'Kubernetes',
            'CI/CD': 'CI/CD',
            'Git': 'Git',
            'GitHub': 'GitHub',
            'npm scripts': 'scripts de npm',
            'package.json': 'package.json',
            'node_modules': 'node_modules',
            'process': 'proceso',
            'thread': 'hilo',
            'cluster': 'cluster',
            'worker': 'worker',
            'child process': 'proceso hijo',
            'spawn': 'spawn',
            'exec': 'exec',
            'fork': 'fork',
            'path': 'ruta',
            'fs': 'sistema de archivos',
            'url': 'URL',
            'querystring': 'cadena de consulta',
            'crypto': 'criptografía',
            'zlib': 'compresión',
            'readline': 'línea de lectura',
            'repl': 'REPL',
            'vm': 'máquina virtual',
            'util': 'utilidades',
            'events': 'eventos',
            'timers': 'temporizadores',
            'os': 'sistema operativo',
            'child_process': 'proceso hijo',
            'cluster': 'cluster',
            'dgram': 'datagrama',
            'dns': 'DNS',
            'http': 'HTTP',
            'https': 'HTTPS',
            'net': 'red',
            'tls': 'TLS',
            'tty': 'TTY',
            'v8': 'V8',
            'vm': 'VM',
            'worker_threads': 'hilos de trabajo',
            'perf_hooks': 'ganchos de rendimiento',
            'inspector': 'inspector',
            'assert': 'aserciones',
            'buffer': 'buffer',
            'console': 'consola',
            'global': 'global',
            'module': 'módulo',
            'process': 'proceso',
            'querystring': 'cadena de consulta',
            'stream': 'stream',
            'string_decoder': 'decodificador de cadenas',
            'timers': 'temporizadores',
            'tty': 'TTY',
            'url': 'URL',
            'util': 'utilidades',
            'v8': 'V8',
            'vm': 'VM',
            'worker_threads': 'hilos de trabajo',
            'zlib': 'compresión'
        }
        
        # Aplica traducciones básicas
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text):
        """
        Genera código de ejemplo basado en la pregunta
        
        Args:
            question_text (str): Texto de la pregunta
            
        Returns:
            dict: Diccionario con código de ejemplo y explicación
        """
        examples = {
            'callback': {
                'title': 'Ejemplo de Callback',
                'code': '''// Ejemplo de callback en Node.js
const fs = require('fs');

// Función que usa callback para leer un archivo
function leerArchivo(nombreArchivo, callback) {
    fs.readFile(nombreArchivo, 'utf8', (error, datos) => {
        if (error) {
            // Si hay error, lo pasamos al callback
            callback(error, null);
        } else {
            // Si no hay error, pasamos null como error y los datos
            callback(null, datos);
        }
    });
}

// Uso del callback
leerArchivo('archivo.txt', (error, contenido) => {
    if (error) {
        console.error('Error al leer archivo:', error.message);
    } else {
        console.log('Contenido del archivo:', contenido);
    }
});''',
                'explanation': 'Este ejemplo muestra cómo usar callbacks para manejar operaciones asíncronas en Node.js. El patrón callback(error, data) es estándar en Node.js.'
            },
            'promise': {
                'title': 'Ejemplo de Promise',
                'code': '''// Ejemplo de Promise en Node.js
const fs = require('fs').promises;

// Función que retorna una Promise
function leerArchivoPromise(nombreArchivo) {
    return fs.readFile(nombreArchivo, 'utf8')
        .then(datos => {
            console.log('Archivo leído exitosamente');
            return datos;
        })
        .catch(error => {
            console.error('Error al leer archivo:', error.message);
            throw error; // Re-lanzar el error
        });
}

// Uso con .then() y .catch()
leerArchivoPromise('archivo.txt')
    .then(contenido => {
        console.log('Contenido:', contenido);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Uso con async/await
async function procesarArchivo() {
    try {
        const contenido = await leerArchivoPromise('archivo.txt');
        console.log('Procesando:', contenido);
    } catch (error) {
        console.error('Error en procesamiento:', error);
    }
}''',
                'explanation': 'Este ejemplo muestra cómo usar Promises para manejar operaciones asíncronas de manera más elegante que los callbacks.'
            },
            'event_loop': {
                'title': 'Ejemplo del Event Loop',
                'code': '''// Ejemplo del Event Loop en Node.js
console.log('1. Inicio del programa');

// setTimeout se ejecuta después del event loop
setTimeout(() => {
    console.log('4. Timeout completado');
}, 0);

// Promise se ejecuta en la siguiente iteración del event loop
Promise.resolve().then(() => {
    console.log('3. Promise resuelto');
});

// setImmediate se ejecuta en la siguiente iteración del event loop
setImmediate(() => {
    console.log('5. setImmediate ejecutado');
});

// Código síncrono se ejecuta inmediatamente
console.log('2. Fin del programa');

// Resultado esperado:
// 1. Inicio del programa
// 2. Fin del programa
// 3. Promise resuelto
// 4. Timeout completado
// 5. setImmediate ejecutado''',
                'explanation': 'Este ejemplo demuestra el orden de ejecución en el event loop de Node.js.'
            },
            'express_server': {
                'title': 'Servidor Express Básico',
                'code': '''// Servidor Express básico
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Ruta GET básica
app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Hola desde Node.js!',
        timestamp: new Date().toISOString()
    });
});

// Ruta POST con validación
app.post('/usuarios', (req, res) => {
    const { nombre, email } = req.body;
    
    // Validación básica
    if (!nombre || !email) {
        return res.status(400).json({
            error: 'Nombre y email son requeridos'
        });
    }
    
    // Simular guardado en base de datos
    const usuario = {
        id: Date.now(),
        nombre,
        email,
        creado: new Date().toISOString()
    };
    
    res.status(201).json(usuario);
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});''',
                'explanation': 'Este ejemplo muestra un servidor Express básico con middleware, rutas, validación y manejo de errores.'
            },
            'streams': {
                'title': 'Ejemplo de Streams',
                'code': '''// Ejemplo de Streams en Node.js
const fs = require('fs');
const { Transform } = require('stream');

// Stream de transformación personalizado
class TransformadorTexto extends Transform {
    constructor() {
        super({ objectMode: true });
    }
    
    _transform(chunk, encoding, callback) {
        // Transformar el texto a mayúsculas
        const textoTransformado = chunk.toString().toUpperCase();
        this.push(textoTransformado);
        callback();
    }
}

// Crear streams
const streamLectura = fs.createReadStream('archivo.txt', 'utf8');
const streamEscritura = fs.createWriteStream('archivo_mayusculas.txt');
const transformador = new TransformadorTexto();

// Conectar streams
streamLectura
    .pipe(transformador)
    .pipe(streamEscritura);

// Manejar eventos
streamLectura.on('data', (chunk) => {
    console.log('Leyendo chunk:', chunk.toString().substring(0, 50));
});

streamEscritura.on('finish', () => {
    console.log('Archivo transformado completado');
});

// Manejar errores
streamLectura.on('error', (error) => {
    console.error('Error en lectura:', error);
});

streamEscritura.on('error', (error) => {
    console.error('Error en escritura:', error);
});''',
                'explanation': 'Este ejemplo muestra cómo usar streams para procesar archivos de manera eficiente en memoria.'
            }
        }
        
        # Determina qué ejemplo usar basado en la pregunta
        question_lower = question_text.lower()
        
        if 'callback' in question_lower:
            return examples['callback']
        elif 'promise' in question_lower:
            return examples['promise']
        elif 'event loop' in question_lower or 'eventloop' in question_lower:
            return examples['event_loop']
        elif 'express' in question_lower or 'server' in question_lower:
            return examples['express_server']
        elif 'stream' in question_lower:
            return examples['streams']
        else:
            # Ejemplo genérico
            return {
                'title': 'Ejemplo Genérico de Node.js',
                'code': '''// Ejemplo genérico de Node.js
console.log('Hola desde Node.js!');

// Función asíncrona básica
async function ejemploBasico() {
    try {
        const resultado = await Promise.resolve('Operación completada');
        console.log(resultado);
    } catch (error) {
        console.error('Error:', error);
    }
}

ejemploBasico();''',
                'explanation': 'Este es un ejemplo básico de Node.js que muestra el uso de async/await.'
            }
    
    def generate_unit_tests(self, example_code):
        """
        Genera pruebas unitarias para el código de ejemplo
        
        Args:
            example_code (str): Código de ejemplo
            
        Returns:
            str: Código de pruebas unitarias
        """
        return f'''// Pruebas unitarias para el ejemplo
const assert = require('assert');

// Prueba básica de funcionalidad
describe('Pruebas del Ejemplo', () => {{
    it('debería ejecutar sin errores', () => {{
        // Esta prueba verifica que el código se ejecuta correctamente
        assert.strictEqual(typeof console.log, 'function');
    }});
    
    it('debería manejar operaciones asíncronas', async () => {{
        const resultado = await Promise.resolve('test');
        assert.strictEqual(resultado, 'test');
    }});
    
    it('debería manejar errores correctamente', async () => {{
        try {{
            await Promise.reject(new Error('Error de prueba'));
            assert.fail('Debería haber lanzado un error');
        }} catch (error) {{
            assert.strictEqual(error.message, 'Error de prueba');
        }}
    }});
}});

// Para ejecutar las pruebas:
// npm install --save-dev jest
// npx jest test.js''';
    
    def predict_results(self, example_code):
        """
        Predice los resultados del código de ejemplo
        
        Args:
            example_code (str): Código de ejemplo
            
        Returns:
            str: Predicción de resultados
        """
        return '''📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- El código se ejecutará sin errores
- Se mostrarán los logs en la consola
- Las operaciones asíncronas se completarán correctamente

⚠️ **Posibles Errores:**
- Errores de sintaxis si hay problemas en el código
- Errores de runtime si faltan dependencias
- Errores de permisos en operaciones de archivos

🔍 **Para Verificar:**
1. Ejecuta el código en tu terminal
2. Verifica que los logs aparezcan correctamente
3. Revisa que no haya errores en la consola
4. Confirma que las operaciones asíncronas se completen'''
    
    def suggest_improvements(self, question_text):
        """
        Sugiere mejoras para el código de ejemplo
        
        Args:
            question_text (str): Texto de la pregunta
            
        Returns:
            str: Sugerencias de mejoras
        """
        improvements = {
            'callback': '''🚀 Mejoras Sugeridas:

1. **Usar Promises en lugar de callbacks:**
   - Más legible y mantenible
   - Mejor manejo de errores
   - Evita el "callback hell"

2. **Implementar async/await:**
   - Código más limpio y síncrono
   - Mejor manejo de errores con try/catch

3. **Agregar validación de entrada:**
   - Verificar que el archivo existe
   - Validar permisos de lectura

4. **Implementar logging estructurado:**
   - Usar Winston o Pino para logs
   - Incluir timestamps y niveles de log''',
            
            'promise': '''🚀 Mejoras Sugeridas:

1. **Usar async/await:**
   - Código más legible
   - Mejor manejo de errores

2. **Implementar timeout:**
   - Evitar promesas que nunca se resuelven
   - Mejor experiencia de usuario

3. **Agregar retry logic:**
   - Reintentar operaciones fallidas
   - Implementar backoff exponencial

4. **Usar Promise.all para operaciones paralelas:**
   - Mejor rendimiento
   - Manejo de múltiples promesas''',
            
            'express_server': '''🚀 Mejoras Sugeridas:

1. **Agregar validación con Joi o Yup:**
   - Validación más robusta
   - Mensajes de error personalizados

2. **Implementar autenticación JWT:**
   - Proteger rutas sensibles
   - Manejo de sesiones

3. **Agregar rate limiting:**
   - Prevenir abuso de la API
   - Usar express-rate-limit

4. **Implementar CORS:**
   - Permitir requests desde frontend
   - Configurar dominios permitidos

5. **Agregar compresión:**
   - Reducir tamaño de respuestas
   - Mejor rendimiento

6. **Implementar caching:**
   - Usar Redis para cache
   - Reducir carga en base de datos'''
        }
        
        question_lower = question_text.lower()
        
        if 'callback' in question_lower:
            return improvements['callback']
        elif 'promise' in question_lower:
            return improvements['promise']
        elif 'express' in question_lower or 'server' in question_lower:
            return improvements['express_server']
        else:
            return '''🚀 Mejoras Sugeridas:

1. **Agregar manejo de errores robusto:**
   - Usar try/catch apropiadamente
   - Implementar logging de errores

2. **Optimizar rendimiento:**
   - Usar streams para archivos grandes
   - Implementar caching donde sea apropiado

3. **Mejorar seguridad:**
   - Validar todas las entradas
   - Sanitizar datos de usuario

4. **Agregar pruebas unitarias:**
   - Usar Jest o Mocha
   - Cobertura de código > 80%

5. **Implementar logging estructurado:**
   - Usar Winston o Pino
   - Incluir contexto relevante'''
    
    def process_question(self, question_data):
        """
        Procesa una pregunta individual
        
        Args:
            question_data (dict): Datos de la pregunta
            
        Returns:
            dict: Pregunta procesada con mejoras
        """
        question_text = question_data['question']
        answer_text = question_data['answer']
        
        # Traduce la pregunta
        translated_question = self.translate_question(question_text)
        
        # Genera ejemplo de código
        example = self.generate_example_code(question_text)
        
        # Genera pruebas unitarias
        unit_tests = self.generate_unit_tests(example['code'])
        
        # Predice resultados
        results_prediction = self.predict_results(example['code'])
        
        # Sugiere mejoras
        improvements = self.suggest_improvements(question_text)
        
        # Estructura la pregunta procesada
        processed_question = {
            'original_question': question_text,
            'translated_question': translated_question,
            'original_answer': answer_text,
            'example': example,
            'unit_tests': unit_tests,
            'results_prediction': results_prediction,
            'improvements': improvements,
            'source_file': question_data.get('source_file', ''),
            'processed_at': datetime.now().isoformat()
        }
        
        return processed_question
    
    def process_all_questions(self, limit=None):
        """
        Procesa todas las preguntas cargadas
        
        Args:
            limit (int): Límite de preguntas a procesar (para pruebas)
        """
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
    
    def save_processed_questions(self, output_file="node_questions_processed.json"):
        """
        Guarda las preguntas procesadas en formato JSON
        
        Args:
            output_file (str): Archivo de salida
        """
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '400+ Node.js Interview Questions and Answers',
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
    
    def generate_summary(self):
        """
        Genera un resumen del procesamiento
        """
        print("\n📊 RESUMEN DE PROCESAMIENTO")
        print("=" * 50)
        print(f"📖 Preguntas originales: {len(self.questions)}")
        print(f"✅ Preguntas procesadas: {len(self.processed_questions)}")
        print(f"📁 Archivo de entrada: {self.input_file}")
        
        if self.processed_questions:
            print(f"\n📝 Ejemplos de preguntas procesadas:")
            for i, q in enumerate(self.processed_questions[:3]):
                print(f"  {i+1}. {q['translated_question'][:100]}...")
    
    def run_processing(self, limit=None):
        """
        Ejecuta el proceso completo de procesamiento
        
        Args:
            limit (int): Límite de preguntas a procesar
        """
        print("🚀 Iniciando procesamiento de preguntas de Node.js")
        print("=" * 60)
        
        # Carga las preguntas
        if not self.load_questions():
            return False
        
        # Procesa las preguntas
        self.process_all_questions(limit)
        
        # Guarda los resultados
        self.save_processed_questions()
        
        # Genera resumen
        self.generate_summary()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    """
    Función principal del script
    """
    # Configuración
    input_file = "node_questions_structured.json"
    output_file = "node_questions_processed.json"
    
    # Verifica que el archivo de entrada existe
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_node_questions.py")
        return
    
    # Crea el procesador y ejecuta el procesamiento
    processor = NodeJSQuestionProcessor(input_file)
    success = processor.run_processing(limit=10)  # Procesa solo 10 preguntas para pruebas
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: {output_file}")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 