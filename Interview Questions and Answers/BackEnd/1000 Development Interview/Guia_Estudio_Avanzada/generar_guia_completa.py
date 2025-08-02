#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar automáticamente la guía de estudio avanzada completa
Basado en las preguntas extraídas del PDF de Backend Development
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any
import shutil

class GuiaEstudioGenerator:
    def __init__(self, questions_file: str):
        """
        Inicializa el generador de guías de estudio
        
        Args:
            questions_file (str): Ruta al archivo JSON con las preguntas extraídas
        """
        self.questions_file = questions_file
        self.questions_data = {}
        self.categories = {
            'programming_fundamentals': {
                'title': 'Fundamentos de Programación',
                'icon': '🔰',
                'description': 'Conceptos básicos de programación, variables, tipos de datos, estructuras de control'
            },
            'data_structures': {
                'title': 'Estructuras de Datos',
                'icon': '🏗️',
                'description': 'Arrays, listas, pilas, colas, árboles, grafos y tablas hash'
            },
            'algorithms': {
                'title': 'Algoritmos',
                'icon': '⚡',
                'description': 'Algoritmos de búsqueda, ordenamiento, complejidad y programación dinámica'
            },
            'databases': {
                'title': 'Bases de Datos',
                'icon': '🗄️',
                'description': 'Diseño de bases de datos, SQL, NoSQL, optimización de consultas'
            },
            'api_design': {
                'title': 'Diseño de APIs',
                'icon': '🌐',
                'description': 'REST, GraphQL, diseño de endpoints, autenticación y documentación'
            },
            'security': {
                'title': 'Seguridad',
                'icon': '🔒',
                'description': 'Autenticación, autorización, criptografía, vulnerabilidades OWASP'
            },
            'performance': {
                'title': 'Rendimiento',
                'icon': '⚡',
                'description': 'Optimización, caching, load balancing, monitoreo y métricas'
            },
            'testing': {
                'title': 'Testing',
                'icon': '🧪',
                'description': 'Pruebas unitarias, integración, TDD, BDD y automatización'
            },
            'deployment': {
                'title': 'Deployment',
                'icon': '🚀',
                'description': 'CI/CD, Docker, Kubernetes, monitoreo en producción'
            },
            'system_design': {
                'title': 'Diseño de Sistemas',
                'icon': '🏛️',
                'description': 'Arquitecturas escalables, patrones de diseño, sistemas distribuidos'
            },
            'microservices': {
                'title': 'Microservicios',
                'icon': '🔧',
                'description': 'Arquitectura de microservicios, service mesh, API gateway'
            },
            'cloud_computing': {
                'title': 'Computación en la Nube',
                'icon': '☁️',
                'description': 'AWS, Azure, GCP, serverless, escalabilidad automática'
            }
        }
        
    def load_questions(self) -> bool:
        """
        Carga las preguntas desde el archivo JSON
        
        Returns:
            bool: True si la carga fue exitosa
        """
        try:
            with open(self.questions_file, 'r', encoding='utf-8') as f:
                self.questions_data = json.load(f)
            print(f"✅ Cargadas {len(self.questions_data.get('questions', []))} preguntas")
            return True
        except Exception as e:
            print(f"❌ Error al cargar preguntas: {e}")
            return False
    
    def create_directory_structure(self):
        """
        Crea la estructura de directorios para la guía
        """
        base_dir = Path("Guia_Estudio_Avanzada")
        
        # Directorios principales
        directories = [
            "categorias",
            "ejemplos_codigo/javascript",
            "ejemplos_codigo/python", 
            "ejemplos_codigo/java",
            "ejemplos_codigo/csharp",
            "ejemplos_codigo/go",
            "pruebas_unitarias",
            "ejercicios_practicos",
            "recursos_adicionales"
        ]
        
        # Crear directorios de categorías
        for category in self.categories.keys():
            directories.append(f"categorias/{category}")
        
        # Crear todos los directorios
        for directory in directories:
            dir_path = base_dir / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"📁 Creado directorio: {dir_path}")
    
    def generate_category_guides(self):
        """
        Genera las guías para cada categoría
        """
        questions = self.questions_data.get('questions', [])
        
        for category_key, category_info in self.categories.items():
            print(f"\n📝 Generando guía para: {category_info['title']}")
            
            # Filtrar preguntas por categoría
            category_questions = [q for q in questions if q.get('category') == category_key]
            
            if not category_questions:
                print(f"⚠️ No hay preguntas para la categoría: {category_key}")
                continue
            
            # Generar archivo de guía para la categoría
            self.generate_category_file(category_key, category_info, category_questions)
    
    def generate_category_file(self, category_key: str, category_info: Dict, questions: List[Dict]):
        """
        Genera el archivo de guía para una categoría específica
        
        Args:
            category_key (str): Clave de la categoría
            category_info (Dict): Información de la categoría
            questions (List[Dict]): Lista de preguntas de la categoría
        """
        file_path = Path("Guia_Estudio_Avanzada") / "categorias" / category_key / "README.md"
        
        content = f"""# {category_info['icon']} {category_info['title']}

## 📚 Descripción

{category_info['description']}

## 📊 Estadísticas

- **Total de preguntas:** {len(questions)}
- **Dificultad promedio:** {self.calculate_average_difficulty(questions)}
- **Tecnologías principales:** {', '.join(self.get_main_technologies(questions))}

## 🎯 Objetivos de Aprendizaje

Al completar esta sección, serás capaz de:

{self.generate_learning_objectives(category_key)}

## 📋 Preguntas y Respuestas

"""
        
        # Agregar preguntas organizadas por dificultad
        for difficulty in ['beginner', 'intermediate', 'advanced']:
            difficulty_questions = [q for q in questions if q.get('difficulty') == difficulty]
            
            if difficulty_questions:
                content += f"\n### {difficulty.title()}\n\n"
                
                for i, question in enumerate(difficulty_questions[:5], 1):  # Limitar a 5 por dificultad
                    content += f"#### {i}. {question.get('question', 'Sin pregunta')}\n\n"
                    content += f"**Respuesta:** {question.get('answer', 'Sin respuesta')}\n\n"
                    content += f"**Tags:** {', '.join(question.get('tags', []))}\n\n"
                    content += "---\n\n"
        
        # Agregar secciones adicionales
        content += self.generate_additional_sections(category_key)
        
        # Guardar archivo
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Generado: {file_path}")
    
    def calculate_average_difficulty(self, questions: List[Dict]) -> str:
        """
        Calcula la dificultad promedio de las preguntas
        
        Args:
            questions (List[Dict]): Lista de preguntas
            
        Returns:
            str: Dificultad promedio
        """
        difficulty_scores = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3
        }
        
        if not questions:
            return "N/A"
        
        total_score = sum(difficulty_scores.get(q.get('difficulty', 'beginner'), 1) for q in questions)
        average_score = total_score / len(questions)
        
        if average_score < 1.5:
            return "Principiante"
        elif average_score < 2.5:
            return "Intermedio"
        else:
            return "Avanzado"
    
    def get_main_technologies(self, questions: List[Dict]) -> List[str]:
        """
        Obtiene las tecnologías principales de las preguntas
        
        Args:
            questions (List[Dict]): Lista de preguntas
            
        Returns:
            List[str]: Lista de tecnologías principales
        """
        all_tags = []
        for question in questions:
            all_tags.extend(question.get('tags', []))
        
        # Contar frecuencia de tags
        tag_counts = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        # Retornar los 5 tags más frecuentes
        sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
        return [tag for tag, count in sorted_tags[:5]]
    
    def generate_learning_objectives(self, category_key: str) -> str:
        """
        Genera objetivos de aprendizaje para una categoría
        
        Args:
            category_key (str): Clave de la categoría
            
        Returns:
            str: Objetivos de aprendizaje en formato markdown
        """
        objectives = {
            'programming_fundamentals': [
                "Comprender los conceptos básicos de programación",
                "Dominar el uso de variables y tipos de datos",
                "Implementar estructuras de control y funciones",
                "Aplicar principios de programación orientada a objetos"
            ],
            'data_structures': [
                "Implementar estructuras de datos básicas y avanzadas",
                "Analizar la complejidad de tiempo y espacio",
                "Elegir la estructura de datos apropiada para cada problema",
                "Optimizar el rendimiento de las estructuras de datos"
            ],
            'algorithms': [
                "Implementar algoritmos de búsqueda y ordenamiento",
                "Analizar la complejidad algorítmica (Big O)",
                "Resolver problemas usando programación dinámica",
                "Optimizar algoritmos para mejor rendimiento"
            ],
            'databases': [
                "Diseñar esquemas de bases de datos eficientes",
                "Escribir consultas SQL optimizadas",
                "Implementar bases de datos NoSQL",
                "Gestionar transacciones y concurrencia"
            ],
            'api_design': [
                "Diseñar APIs RESTful siguiendo mejores prácticas",
                "Implementar autenticación y autorización",
                "Documentar APIs de forma efectiva",
                "Optimizar el rendimiento de APIs"
            ],
            'security': [
                "Implementar autenticación y autorización seguras",
                "Proteger contra vulnerabilidades comunes (OWASP)",
                "Aplicar criptografía y hashing",
                "Auditar la seguridad de aplicaciones"
            ],
            'performance': [
                "Optimizar el rendimiento de aplicaciones",
                "Implementar estrategias de caching efectivas",
                "Configurar load balancing",
                "Monitorear y analizar métricas de rendimiento"
            ],
            'testing': [
                "Escribir pruebas unitarias y de integración",
                "Implementar TDD y BDD",
                "Automatizar el proceso de testing",
                "Mantener alta cobertura de código"
            ],
            'deployment': [
                "Configurar pipelines de CI/CD",
                "Desplegar aplicaciones usando contenedores",
                "Gestionar orquestación con Kubernetes",
                "Monitorear aplicaciones en producción"
            ],
            'system_design': [
                "Diseñar arquitecturas escalables",
                "Aplicar patrones de diseño",
                "Implementar sistemas distribuidos",
                "Optimizar para alta disponibilidad"
            ],
            'microservices': [
                "Diseñar arquitecturas de microservicios",
                "Implementar service mesh",
                "Configurar API gateways",
                "Gestionar la comunicación entre servicios"
            ],
            'cloud_computing': [
                "Utilizar servicios de AWS, Azure o GCP",
                "Implementar arquitecturas serverless",
                "Configurar escalabilidad automática",
                "Optimizar costos en la nube"
            ]
        }
        
        category_objectives = objectives.get(category_key, [
            "Comprender los conceptos fundamentales",
            "Aplicar mejores prácticas",
            "Implementar soluciones robustas"
        ])
        
        return '\n'.join([f"- {objective}" for objective in category_objectives])
    
    def generate_additional_sections(self, category_key: str) -> str:
        """
        Genera secciones adicionales para cada categoría
        
        Args:
            category_key (str): Clave de la categoría
            
        Returns:
            str: Contenido de secciones adicionales
        """
        sections = {
            'programming_fundamentals': """
## 💻 Ejemplos de Código

### JavaScript
```javascript
// Ejemplo básico de variables y tipos
let nombre = "Juan";
let edad = 25;
let esProgramador = true;

console.log(`Hola, soy ${nombre} y tengo ${edad} años`);
```

### Python
```python
# Ejemplo básico de variables y tipos
nombre = "María"
edad = 28
es_programador = True

print(f"Hola, soy {nombre} y tengo {edad} años")
```

## 🧪 Pruebas Unitarias

```javascript
// test_fundamentals.js
describe('Fundamentos de Programación', () => {
    test('debe declarar variables correctamente', () => {
        let nombre = "Test";
        expect(typeof nombre).toBe('string');
    });
});
```

## 📊 Ejercicios Prácticos

1. **Calculadora Simple**: Crea una calculadora que maneje diferentes tipos de datos
2. **Validador de Formularios**: Implementa validación de tipos de entrada
3. **Conversor de Unidades**: Practica conversiones entre tipos de datos
""",
            'data_structures': """
## 💻 Ejemplos de Código

### Implementación de Stack
```javascript
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        return this.items.pop();
    }
    
    peek() {
        return this.items[this.items.length - 1];
    }
}
```

## 🧪 Pruebas Unitarias

```javascript
// test_data_structures.js
describe('Stack', () => {
    test('debe agregar y remover elementos correctamente', () => {
        const stack = new Stack();
        stack.push(1);
        stack.push(2);
        expect(stack.pop()).toBe(2);
    });
});
```

## 📊 Ejercicios Prácticos

1. **Implementa una Queue**: Crea una cola usando arrays
2. **Árbol Binario**: Implementa un árbol binario de búsqueda
3. **Tabla Hash**: Crea una implementación de tabla hash
""",
            'databases': """
## 💻 Ejemplos de Código

### Conexión a Base de Datos
```javascript
// Ejemplo con Node.js y MySQL
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test_db'
});

connection.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    console.log(results);
});
```

## 🧪 Pruebas Unitarias

```javascript
// test_database.js
describe('Database Operations', () => {
    test('debe conectar a la base de datos', async () => {
        const connection = await createTestConnection();
        expect(connection).toBeDefined();
    });
});
```

## 📊 Ejercicios Prácticos

1. **CRUD Completo**: Implementa operaciones CRUD para una entidad
2. **Consultas Complejas**: Escribe consultas SQL con JOINs y agregaciones
3. **Optimización**: Optimiza consultas lentas usando índices
"""
        }
        
        return sections.get(category_key, """
## 💻 Ejemplos de Código

```javascript
// Ejemplo básico
console.log("Implementa ejemplos específicos para esta categoría");
```

## 🧪 Pruebas Unitarias

```javascript
// test_category.js
describe('Categoría', () => {
    test('debe funcionar correctamente', () => {
        expect(true).toBe(true);
    });
});
```

## 📊 Ejercicios Prácticos

1. **Ejercicio 1**: Descripción del ejercicio
2. **Ejercicio 2**: Descripción del ejercicio
3. **Ejercicio 3**: Descripción del ejercicio
""")
    
    def generate_index_file(self):
        """
        Genera el archivo índice principal de la guía
        """
        file_path = Path("Guia_Estudio_Avanzada") / "INDICE.md"
        
        content = """# 📚 Índice de la Guía de Estudio Avanzada

## 🎯 Categorías de Estudio

"""
        
        questions = self.questions_data.get('questions', [])
        
        for category_key, category_info in self.categories.items():
            category_questions = [q for q in questions if q.get('category') == category_key]
            
            content += f"""
### {category_info['icon']} [{category_info['title']}](categorias/{category_key}/README.md)

{category_info['description']}

- **Preguntas:** {len(category_questions)}
- **Dificultad:** {self.calculate_average_difficulty(category_questions)}
- **Tecnologías:** {', '.join(self.get_main_technologies(category_questions)[:3])}

"""
        
        content += """
## 📊 Estadísticas Generales

"""
        
        # Estadísticas generales
        total_questions = len(questions)
        difficulties = {}
        all_tags = []
        
        for question in questions:
            difficulty = question.get('difficulty', 'beginner')
            difficulties[difficulty] = difficulties.get(difficulty, 0) + 1
            all_tags.extend(question.get('tags', []))
        
        content += f"- **Total de preguntas:** {total_questions}\n"
        content += f"- **Preguntas por dificultad:**\n"
        for diff, count in difficulties.items():
            content += f"  - {diff.title()}: {count}\n"
        
        # Tags más populares
        tag_counts = {}
        for tag in all_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        top_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        content += f"- **Tecnologías más populares:** {', '.join([tag for tag, count in top_tags])}\n"
        
        content += """
## 🚀 Cómo Usar Esta Guía

1. **Comienza por los fundamentos** si eres principiante
2. **Practica con los ejemplos de código** en cada categoría
3. **Ejecuta las pruebas unitarias** para verificar tu comprensión
4. **Completa los ejercicios prácticos** para reforzar el aprendizaje
5. **Avanza progresivamente** por las categorías más avanzadas

## 📞 Recursos Adicionales

- [Documentación oficial de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [Documentación oficial de Python](https://docs.python.org/3/)
- [Documentación oficial de Java](https://docs.oracle.com/javase/)
- [Stack Overflow](https://stackoverflow.com/) - Para preguntas específicas
- [GitHub](https://github.com/) - Para ejemplos de código reales

---

**¡Comienza tu viaje hacia el dominio del desarrollo backend!** 🚀
"""
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Generado índice: {file_path}")
    
    def generate_example_code_files(self):
        """
        Genera archivos de ejemplo de código para cada lenguaje
        """
        examples = {
            'javascript': {
                'variables.js': self.get_javascript_variables_example(),
                'functions.js': self.get_javascript_functions_example(),
                'classes.js': self.get_javascript_classes_example()
            },
            'python': {
                'variables.py': self.get_python_variables_example(),
                'functions.py': self.get_python_functions_example(),
                'classes.py': self.get_python_classes_example()
            },
            'java': {
                'Variables.java': self.get_java_variables_example(),
                'Functions.java': self.get_java_functions_example(),
                'Classes.java': self.get_java_classes_example()
            }
        }
        
        for language, files in examples.items():
            lang_dir = Path("Guia_Estudio_Avanzada") / "ejemplos_codigo" / language
            lang_dir.mkdir(parents=True, exist_ok=True)
            
            for filename, content in files.items():
                file_path = lang_dir / filename
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Generado ejemplo: {file_path}")
    
    def get_javascript_variables_example(self) -> str:
        """Retorna ejemplo de variables en JavaScript"""
        return '''// ============================================================================
// EJEMPLO: Variables y Tipos de Datos en JavaScript
// ============================================================================

// Declaración de variables
let nombre = "Juan Pérez";
const edad = 25;
var altura = 1.75; // var es legacy, usar let/const

// Tipos de datos
let esProgramador = true;             // Boolean
let hobbies = ["leer", "programar"];  // Array
let persona = {                       // Object
    nombre: "María",
    edad: 30
};

// Verificación de tipos
console.log(typeof nombre);           // "string"
console.log(typeof edad);             // "number"
console.log(typeof esProgramador);    // "boolean"

// Conversión de tipos
let numeroComoTexto = "42";
let numeroConvertido = Number(numeroComoTexto);
let textoComoNumero = String(123);

console.log(numeroConvertido);        // 42
console.log(textoComoNumero);         // "123"
'''
    
    def get_javascript_functions_example(self) -> str:
        """Retorna ejemplo de funciones en JavaScript"""
        return '''// ============================================================================
// EJEMPLO: Funciones en JavaScript
// ============================================================================

// Función tradicional
function saludar(nombre) {
    return `Hola, ${nombre}!`;
}

// Función flecha (arrow function)
const sumar = (a, b) => a + b;

// Función con parámetros por defecto
const crearUsuario = (nombre, edad = 18, ciudad = "Madrid") => {
    return {
        nombre,
        edad,
        ciudad
    };
};

// Función que retorna una promesa
const obtenerDatos = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// Uso de las funciones
console.log(saludar("Juan"));                    // "Hola, Juan!"
console.log(sumar(5, 3));                        // 8
console.log(crearUsuario("Ana", 25));           // { nombre: "Ana", edad: 25, ciudad: "Madrid" }
'''
    
    def get_javascript_classes_example(self) -> str:
        """Retorna ejemplo de clases en JavaScript"""
        return '''// ============================================================================
// EJEMPLO: Clases en JavaScript
// ============================================================================

class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    saludar() {
        return `Hola, soy ${this.nombre} y tengo ${this.edad} años`;
    }
    
    static crearPersona(nombre, edad) {
        return new Persona(nombre, edad);
    }
}

class Programador extends Persona {
    constructor(nombre, edad, lenguajes = []) {
        super(nombre, edad);
        this.lenguajes = lenguajes;
    }
    
    programar() {
        return `${this.nombre} está programando en ${this.lenguajes.join(", ")}`;
    }
    
    agregarLenguaje(lenguaje) {
        this.lenguajes.push(lenguaje);
    }
}

// Uso de las clases
const persona = new Persona("Juan", 25);
const programador = new Programador("María", 30, ["JavaScript", "Python"]);

console.log(persona.saludar());
console.log(programador.programar());
programador.agregarLenguaje("Java");
console.log(programador.lenguajes);
'''
    
    def get_python_variables_example(self) -> str:
        """Retorna ejemplo de variables en Python"""
        return '''# ============================================================================
# EJEMPLO: Variables y Tipos de Datos en Python
# ============================================================================

# Declaración de variables
nombre = "Ana García"
edad = 28
altura = 1.68

# Tipos de datos
es_programador = True                    # bool
hobbies = ["música", "deportes"]         # list
persona = {                              # dict
    "nombre": "Carlos",
    "edad": 35
}
valor_nulo = None                        # NoneType

# Verificación de tipos
print(type(nombre))                      # <class 'str'>
print(type(edad))                        # <class 'int'>
print(type(es_programador))              # <class 'bool'>

# Conversión de tipos
numero_como_texto = "100"
numero_convertido = int(numero_como_texto)
texto_como_numero = str(456)

print(numero_convertido)                 # 100
print(texto_como_numero)                 # "456"

# Tipos de datos avanzados
from typing import List, Dict, Optional

def procesar_datos(nombres: List[str], config: Dict[str, str]) -> Optional[str]:
    if not nombres:
        return None
    return f"Procesados {len(nombres)} nombres"
'''
    
    def get_python_functions_example(self) -> str:
        """Retorna ejemplo de funciones en Python"""
        return '''# ============================================================================
# EJEMPLO: Funciones en Python
# ============================================================================

# Función básica
def saludar(nombre: str) -> str:
    return f"Hola, {nombre}!"

# Función con parámetros por defecto
def crear_usuario(nombre: str, edad: int = 18, ciudad: str = "Madrid") -> dict:
    return {
        "nombre": nombre,
        "edad": edad,
        "ciudad": ciudad
    }

# Función con argumentos variables
def sumar(*numeros: int) -> int:
    return sum(numeros)

# Función con argumentos de palabra clave
def configurar(**opciones: str) -> dict:
    return opciones

# Función lambda (anónima)
cuadrado = lambda x: x ** 2

# Función asíncrona
import asyncio

async def obtener_datos(url: str) -> dict:
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# Uso de las funciones
print(saludar("Juan"))                   # "Hola, Juan!"
print(crear_usuario("Ana", 25))         # {'nombre': 'Ana', 'edad': 25, 'ciudad': 'Madrid'}
print(sumar(1, 2, 3, 4, 5))            # 15
print(configurar(host="localhost", puerto="3000"))
print(cuadrado(5))                      # 25
'''
    
    def get_python_classes_example(self) -> str:
        """Retorna ejemplo de clases en Python"""
        return '''# ============================================================================
# EJEMPLO: Clases en Python
# ============================================================================

from typing import List, Optional
from abc import ABC, abstractmethod

class Persona:
    def __init__(self, nombre: str, edad: int):
        self.nombre = nombre
        self.edad = edad
    
    def saludar(self) -> str:
        return f"Hola, soy {self.nombre} y tengo {self.edad} años"
    
    @property
    def es_mayor_de_edad(self) -> bool:
        return self.edad >= 18
    
    @classmethod
    def crear_persona(cls, nombre: str, edad: int) -> "Persona":
        return cls(nombre, edad)
    
    @staticmethod
    def validar_edad(edad: int) -> bool:
        return 0 <= edad <= 150

class Programador(Persona):
    def __init__(self, nombre: str, edad: int, lenguajes: List[str] = None):
        super().__init__(nombre, edad)
        self.lenguajes = lenguajes or []
    
    def programar(self) -> str:
        return f"{self.nombre} está programando en {', '.join(self.lenguajes)}"
    
    def agregar_lenguaje(self, lenguaje: str) -> None:
        if lenguaje not in self.lenguajes:
            self.lenguajes.append(lenguaje)

# Clase abstracta
class BaseDatos(ABC):
    @abstractmethod
    def conectar(self) -> bool:
        pass
    
    @abstractmethod
    def desconectar(self) -> None:
        pass

# Uso de las clases
persona = Persona("Juan", 25)
programador = Programador("María", 30, ["Python", "JavaScript"])

print(persona.saludar())
print(programador.programar())
print(persona.es_mayor_de_edad)
'''
    
    def get_java_variables_example(self) -> str:
        """Retorna ejemplo de variables en Java"""
        return '''// ============================================================================
// EJEMPLO: Variables y Tipos de Datos en Java
// ============================================================================

public class VariablesYTiposDatos {
    public static void main(String[] args) {
        // Declaración de variables
        String nombre = "Luis Rodríguez";
        int edad = 32;
        double altura = 1.80;
        boolean esDesarrollador = true;
        char inicial = 'L';
        
        // Arrays
        String[] lenguajes = {"Java", "Python", "JavaScript"};
        int[] numeros = {1, 2, 3, 4, 5};
        
        // Verificación de tipos
        System.out.println("Tipo de nombre: " + nombre.getClass().getSimpleName());
        System.out.println("Tipo de edad: " + ((Object)edad).getClass().getSimpleName());
        
        // Conversión de tipos
        String numeroComoTexto = "42";
        int numeroConvertido = Integer.parseInt(numeroComoTexto);
        String textoComoNumero = String.valueOf(123);
        
        System.out.println("Número convertido: " + numeroConvertido);
        System.out.println("Texto convertido: " + textoComoNumero);
        
        // Constantes
        final double PI = 3.14159;
        final String VERSION = "1.0.0";
        
        // Tipos de datos avanzados
        java.util.List<String> lista = new java.util.ArrayList<>();
        java.util.Map<String, Object> mapa = new java.util.HashMap<>();
        
        lista.add("Elemento 1");
        mapa.put("clave", "valor");
    }
}
'''
    
    def get_java_functions_example(self) -> str:
        """Retorna ejemplo de funciones en Java"""
        return '''// ============================================================================
// EJEMPLO: Funciones en Java
// ============================================================================

import java.util.List;
import java.util.Arrays;

public class Funciones {
    
    // Método básico
    public static String saludar(String nombre) {
        return "Hola, " + nombre + "!";
    }
    
    // Método con parámetros por defecto (usando sobrecarga)
    public static String crearUsuario(String nombre) {
        return crearUsuario(nombre, 18, "Madrid");
    }
    
    public static String crearUsuario(String nombre, int edad) {
        return crearUsuario(nombre, edad, "Madrid");
    }
    
    public static String crearUsuario(String nombre, int edad, String ciudad) {
        return String.format("Usuario: %s, Edad: %d, Ciudad: %s", nombre, edad, ciudad);
    }
    
    // Método con argumentos variables
    public static int sumar(int... numeros) {
        return Arrays.stream(numeros).sum();
    }
    
    // Método genérico
    public static <T> void imprimirLista(List<T> lista) {
        for (T elemento : lista) {
            System.out.println(elemento);
        }
    }
    
    // Método que lanza excepción
    public static int dividir(int a, int b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("División por cero");
        }
        return a / b;
    }
    
    // Método principal para pruebas
    public static void main(String[] args) {
        System.out.println(saludar("Juan"));
        System.out.println(crearUsuario("Ana", 25));
        System.out.println("Suma: " + sumar(1, 2, 3, 4, 5));
        
        List<String> nombres = Arrays.asList("Juan", "Ana", "Carlos");
        imprimirLista(nombres);
        
        try {
            System.out.println("División: " + dividir(10, 2));
        } catch (ArithmeticException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
'''
    
    def get_java_classes_example(self) -> str:
        """Retorna ejemplo de clases en Java"""
        return '''// ============================================================================
// EJEMPLO: Clases en Java
// ============================================================================

import java.util.List;
import java.util.ArrayList;

// Clase abstracta
abstract class BaseDatos {
    protected String url;
    protected String usuario;
    
    public BaseDatos(String url, String usuario) {
        this.url = url;
        this.usuario = usuario;
    }
    
    public abstract boolean conectar();
    public abstract void desconectar();
    
    public String getUrl() {
        return url;
    }
}

// Clase concreta
class Persona {
    private String nombre;
    private int edad;
    
    // Constructor
    public Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    // Getters y Setters
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public int getEdad() {
        return edad;
    }
    
    public void setEdad(int edad) {
        this.edad = edad;
    }
    
    // Método de instancia
    public String saludar() {
        return "Hola, soy " + nombre + " y tengo " + edad + " años";
    }
    
    // Método estático
    public static boolean validarEdad(int edad) {
        return edad >= 0 && edad <= 150;
    }
    
    // Sobrescritura de toString
    @Override
    public String toString() {
        return "Persona{nombre='" + nombre + "', edad=" + edad + "}";
    }
}

// Clase que hereda
class Programador extends Persona {
    private List<String> lenguajes;
    
    public Programador(String nombre, int edad, List<String> lenguajes) {
        super(nombre, edad);
        this.lenguajes = new ArrayList<>(lenguajes);
    }
    
    public void agregarLenguaje(String lenguaje) {
        if (!lenguajes.contains(lenguaje)) {
            lenguajes.add(lenguaje);
        }
    }
    
    public String programar() {
        return nombre + " está programando en " + String.join(", ", lenguajes);
    }
    
    // Sobrescritura de método
    @Override
    public String saludar() {
        return super.saludar() + " y soy programador";
    }
}

// Clase principal para pruebas
public class Clases {
    public static void main(String[] args) {
        Persona persona = new Persona("Juan", 25);
        Programador programador = new Programador("María", 30, 
            List.of("Java", "Python"));
        
        System.out.println(persona.saludar());
        System.out.println(programador.programar());
        System.out.println(Persona.validarEdad(25));
        
        programador.agregarLenguaje("JavaScript");
        System.out.println(programador.programar());
    }
}
'''
    
    def run_generation(self):
        """
        Ejecuta el proceso completo de generación
        """
        print("🚀 Iniciando generación de guía de estudio avanzada...")
        
        # Cargar preguntas
        if not self.load_questions():
            return False
        
        # Crear estructura de directorios
        self.create_directory_structure()
        
        # Generar guías por categoría
        self.generate_category_guides()
        
        # Generar archivo índice
        self.generate_index_file()
        
        # Generar ejemplos de código
        self.generate_example_code_files()
        
        print("\n✅ ¡Guía de estudio avanzada generada exitosamente!")
        print("📁 Revisa el directorio 'Guia_Estudio_Avanzada' para ver todos los archivos")
        
        return True

def main():
    """
    Función principal
    """
    # Ruta al archivo de preguntas extraídas
    questions_file = "../backend_questions_structured.json"
    
    # Verificar que el archivo existe
    if not os.path.exists(questions_file):
        print(f"❌ Error: No se encontró el archivo {questions_file}")
        print("💡 Ejecuta primero el extractor de preguntas")
        return
    
    # Crear y ejecutar el generador
    generator = GuiaEstudioGenerator(questions_file)
    generator.run_generation()

if __name__ == "__main__":
    main() 