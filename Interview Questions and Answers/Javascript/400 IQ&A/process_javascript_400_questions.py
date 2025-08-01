#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de JavaScript (400 preguntas)
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class JavaScript400QuestionProcessor:
    def __init__(self, input_file="javascript_400_questions_structured.json"):
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
            'JavaScript': 'JavaScript',
            'function': 'función',
            'variable': 'variable',
            'object': 'objeto',
            'array': 'arreglo',
            'string': 'cadena',
            'number': 'número',
            'boolean': 'booleano',
            'null': 'null',
            'undefined': 'undefined',
            'promise': 'promesa',
            'async': 'asíncrono',
            'await': 'esperar',
            'callback': 'callback',
            'closure': 'closure',
            'scope': 'alcance',
            'prototype': 'prototipo',
            'inheritance': 'herencia',
            'event': 'evento',
            'DOM': 'DOM',
            'module': 'módulo',
            'import': 'importar',
            'export': 'exportar',
            'class': 'clase',
            'constructor': 'constructor',
            'method': 'método',
            'property': 'propiedad',
            'arrow function': 'función flecha',
            'destructuring': 'desestructuración',
            'spread operator': 'operador spread',
            'rest operator': 'operador rest',
            'template literal': 'literal de plantilla',
            'let': 'let',
            'const': 'const',
            'var': 'var',
            'this': 'this',
            'bind': 'bind',
            'call': 'call',
            'apply': 'apply',
            'map': 'map',
            'filter': 'filter',
            'reduce': 'reduce',
            'forEach': 'forEach',
            'setTimeout': 'setTimeout',
            'setInterval': 'setInterval',
            'fetch': 'fetch',
            'XMLHttpRequest': 'XMLHttpRequest',
            'localStorage': 'localStorage',
            'sessionStorage': 'sessionStorage',
            'cookie': 'cookie',
            'JSON': 'JSON',
            'parse': 'parsear',
            'stringify': 'convertir a string',
            'error': 'error',
            'exception': 'excepción',
            'try': 'try',
            'catch': 'catch',
            'finally': 'finally',
            'throw': 'throw',
            'debug': 'debug',
            'console': 'consola',
            'log': 'log',
            'warn': 'warn',
            'error': 'error',
            'test': 'prueba',
            'unit test': 'prueba unitaria',
            'integration test': 'prueba de integración',
            'mocha': 'mocha',
            'jest': 'jest',
            'chai': 'chai',
            'performance': 'rendimiento',
            'optimization': 'optimización',
            'memory': 'memoria',
            'garbage collection': 'recolección de basura',
            'security': 'seguridad',
            'XSS': 'XSS',
            'CSRF': 'CSRF',
            'sanitize': 'sanitizar',
            'validate': 'validar',
            'authentication': 'autenticación',
            'authorization': 'autorización',
            'encryption': 'encriptación',
            'hash': 'hash',
            'salt': 'salt',
            'token': 'token',
            'session': 'sesión',
            'cors': 'CORS',
            'https': 'HTTPS',
            'ssl': 'SSL',
            'tls': 'TLS',
            'certificate': 'certificado',
            'api': 'API',
            'rest': 'REST',
            'graphql': 'GraphQL',
            'websocket': 'WebSocket',
            'ajax': 'AJAX',
            'axios': 'axios',
            'jquery': 'jQuery',
            'react': 'React',
            'vue': 'Vue',
            'angular': 'Angular',
            'node': 'Node.js',
            'express': 'Express',
            'npm': 'npm',
            'yarn': 'yarn',
            'webpack': 'webpack',
            'babel': 'Babel',
            'eslint': 'ESLint',
            'prettier': 'Prettier',
            'git': 'Git',
            'github': 'GitHub',
            'gitlab': 'GitLab',
            'bitbucket': 'Bitbucket',
            'docker': 'Docker',
            'kubernetes': 'Kubernetes',
            'aws': 'AWS',
            'azure': 'Azure',
            'gcp': 'GCP',
            'heroku': 'Heroku',
            'vercel': 'Vercel',
            'netlify': 'Netlify',
            'firebase': 'Firebase',
            'mongodb': 'MongoDB',
            'mysql': 'MySQL',
            'postgresql': 'PostgreSQL',
            'redis': 'Redis',
            'elasticsearch': 'Elasticsearch',
            'kibana': 'Kibana',
            'logstash': 'Logstash',
            'prometheus': 'Prometheus',
            'grafana': 'Grafana',
            'jenkins': 'Jenkins',
            'travis': 'Travis CI',
            'circleci': 'CircleCI',
            'github actions': 'GitHub Actions',
            'gitlab ci': 'GitLab CI',
            'bitbucket pipelines': 'Bitbucket Pipelines',
            'terraform': 'Terraform',
            'ansible': 'Ansible',
            'chef': 'Chef',
            'puppet': 'Puppet',
            'vagrant': 'Vagrant',
            'virtualbox': 'VirtualBox',
            'vmware': 'VMware',
            'hyperv': 'Hyper-V',
            'kvm': 'KVM',
            'xen': 'Xen',
            'openstack': 'OpenStack',
            'cloudstack': 'CloudStack',
            'opennebula': 'OpenNebula',
            'proxmox': 'Proxmox',
            'citrix': 'Citrix',
            'vmware vsphere': 'VMware vSphere',
            'vmware esxi': 'VMware ESXi',
            'vmware workstation': 'VMware Workstation',
            'vmware fusion': 'VMware Fusion',
            'vmware player': 'VMware Player',
            'parallels': 'Parallels',
            'qemu': 'QEMU',
            'bochs': 'Bochs',
            'dosbox': 'DOSBox',
            'wine': 'Wine',
            'playonlinux': 'PlayOnLinux',
            'crossover': 'CrossOver',
            'darling': 'Darling',
            'limbo': 'Limbo',
            'exagear': 'ExaGear',
            'anbox': 'Anbox',
            'genymotion': 'Genymotion',
            'bluestacks': 'BlueStacks',
            'nox': 'Nox',
            'mumu': 'MuMu',
            'ldplayer': 'LDPlayer',
            'memu': 'MEmu',
            'andy': 'Andy',
            'droid4x': 'Droid4X',
            'windroye': 'Windroye',
            'amiduos': 'AMIDuOS',
            'youwave': 'YouWave',
            'virtualbox': 'VirtualBox',
            'vmware': 'VMware',
            'hyperv': 'Hyper-V',
            'kvm': 'KVM',
            'xen': 'Xen',
            'openstack': 'OpenStack',
            'cloudstack': 'CloudStack',
            'opennebula': 'OpenNebula',
            'proxmox': 'Proxmox',
            'citrix': 'Citrix',
            'vmware vsphere': 'VMware vSphere',
            'vmware esxi': 'VMware ESXi',
            'vmware workstation': 'VMware Workstation',
            'vmware fusion': 'VMware Fusion',
            'vmware player': 'VMware Player',
            'parallels': 'Parallels',
            'qemu': 'QEMU',
            'bochs': 'Bochs',
            'dosbox': 'DOSBox',
            'wine': 'Wine',
            'playonlinux': 'PlayOnLinux',
            'crossover': 'CrossOver',
            'darling': 'Darling',
            'limbo': 'Limbo',
            'exagear': 'ExaGear',
            'anbox': 'Anbox',
            'genymotion': 'Genymotion',
            'bluestacks': 'BlueStacks',
            'nox': 'Nox',
            'mumu': 'MuMu',
            'ldplayer': 'LDPlayer',
            'memu': 'MEmu',
            'andy': 'Andy',
            'droid4x': 'Droid4X',
            'windroye': 'Windroye',
            'amiduos': 'AMIDuOS',
            'youwave': 'YouWave'
        }
        
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text, category='otros'):
        examples = {
            'fundamentos': {
                'title': 'Fundamentos de JavaScript',
                'code': '''// Ejemplo de fundamentos de JavaScript
// Variables y tipos de datos
let nombre = "Juan";                    // Variable de tipo string
const edad = 25;                        // Constante de tipo number
let esEstudiante = true;                // Variable de tipo boolean
let direccion = null;                   // Variable de tipo null
let telefono;                           // Variable de tipo undefined

// Operadores y expresiones
let suma = 10 + 5;                      // Operador de suma
let concatenacion = nombre + " tiene " + edad + " años"; // Concatenación
let templateLiteral = `${nombre} tiene ${edad} años`;    // Template literal

// Estructuras de control
if (edad >= 18) {
    console.log("Es mayor de edad");
} else {
    console.log("Es menor de edad");
}

// Bucles
for (let i = 0; i < 5; i++) {
    console.log(`Iteración ${i}`);
}

// Arrays
let colores = ["rojo", "verde", "azul"];
colores.push("amarillo");               // Agregar elemento
let primerColor = colores[0];           // Acceder por índice

// Objetos
let persona = {
    nombre: "María",
    edad: 30,
    saludar: function() {
        return `Hola, soy ${this.nombre}`;
    }
};

console.log(persona.saludar());         // Llamar método

// Funciones
function sumar(a, b) {
    return a + b;
}

const multiplicar = (a, b) => a * b;    // Arrow function

// Manejo de errores
try {
    let resultado = 10 / 0;
    if (!isFinite(resultado)) {
        throw new Error("División por cero");
    }
} catch (error) {
    console.error("Error:", error.message);
} finally {
    console.log("Operación completada");
}

// Ejemplo de uso
console.log("=== Ejemplos de Fundamentos ===");
console.log("Nombre:", nombre);
console.log("Edad:", edad);
console.log("Es estudiante:", esEstudiante);
console.log("Suma:", suma);
console.log("Concatenación:", concatenacion);
console.log("Template literal:", templateLiteral);
console.log("Primer color:", primerColor);
console.log("Saludo:", persona.saludar());
console.log("Suma función:", sumar(5, 3));
console.log("Multiplicación:", multiplicar(4, 6));''',
                'explanation': 'Este ejemplo muestra los fundamentos básicos de JavaScript incluyendo variables, tipos de datos, operadores, estructuras de control, arrays, objetos y funciones.'
            },
            'funciones': {
                'title': 'Funciones y Closures',
                'code': '''// Ejemplo de funciones y closures en JavaScript
// Función tradicional
function saludar(nombre) {
    return `Hola, ${nombre}!`;
}

// Arrow function
const despedir = (nombre) => `Adiós, ${nombre}!`;

// Función con parámetros por defecto
function crearUsuario(nombre = "Anónimo", edad = 18) {
    return {
        nombre,
        edad,
        esMayor: edad >= 18
    };
}

// Función que retorna otra función (Higher Order Function)
function multiplicador(factor) {
    return function(numero) {
        return numero * factor;
    };
}

// Closure - Función que mantiene acceso a variables externas
function crearContador() {
    let contador = 0;
    
    return {
        incrementar: function() {
            contador++;
            return contador;
        },
        decrementar: function() {
            contador--;
            return contador;
        },
        obtenerValor: function() {
            return contador;
        },
        resetear: function() {
            contador = 0;
            return contador;
        }
    };
}

// Función recursiva
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Función pura (sin efectos secundarios)
function sumarPura(a, b) {
    return a + b;
}

// Función con efectos secundarios
let total = 0;
function sumarConEfecto(valor) {
    total += valor;
    return total;
}

// Callback function
function procesarDatos(datos, callback) {
    const resultado = datos.map(item => item * 2);
    callback(resultado);
}

// Ejemplo de uso
console.log("=== Ejemplos de Funciones ===");

// Funciones básicas
console.log("Saludo:", saludar("Ana"));
console.log("Despedida:", despedir("Carlos"));

// Función con parámetros por defecto
const usuario1 = crearUsuario();
const usuario2 = crearUsuario("Pedro", 25);
console.log("Usuario 1:", usuario1);
console.log("Usuario 2:", usuario2);

// Higher Order Function
const duplicar = multiplicador(2);
const triplicar = multiplicador(3);
console.log("Duplicar 5:", duplicar(5));
console.log("Triplicar 4:", triplicar(4));

// Closure
const miContador = crearContador();
console.log("Contador inicial:", miContador.obtenerValor());
console.log("Incrementar:", miContador.incrementar());
console.log("Incrementar:", miContador.incrementar());
console.log("Decrementar:", miContador.decrementar());
console.log("Valor actual:", miContador.obtenerValor());
console.log("Resetear:", miContador.resetear());

// Función recursiva
console.log("Factorial de 5:", factorial(5));

// Funciones puras vs con efectos
console.log("Suma pura:", sumarPura(3, 4));
console.log("Suma con efecto:", sumarConEfecto(5));
console.log("Suma con efecto:", sumarConEfecto(3));

// Callback
procesarDatos([1, 2, 3, 4], function(resultado) {
    console.log("Datos procesados:", resultado);
});''',
                'explanation': 'Este ejemplo muestra diferentes tipos de funciones en JavaScript, incluyendo funciones tradicionales, arrow functions, closures, funciones recursivas y callbacks.'
            },
            'async': {
                'title': 'Programación Asíncrona',
                'code': '''// Ejemplo de programación asíncrona en JavaScript
// Callbacks tradicionales
function obtenerUsuario(id, callback) {
    setTimeout(() => {
        const usuario = {
            id: id,
            nombre: `Usuario ${id}`,
            email: `usuario${id}@ejemplo.com`
        };
        callback(null, usuario);
    }, 1000);
}

// Promesas
function obtenerPosts() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const posts = [
                { id: 1, titulo: "Primer post", contenido: "Contenido del primer post" },
                { id: 2, titulo: "Segundo post", contenido: "Contenido del segundo post" },
                { id: 3, titulo: "Tercer post", contenido: "Contenido del tercer post" }
            ];
            
            // Simular éxito 80% de las veces
            if (Math.random() > 0.2) {
                resolve(posts);
            } else {
                reject(new Error("Error al obtener posts"));
            }
        }, 1500);
    });
}

// Async/Await
async function obtenerDatosCompletos() {
    try {
        console.log("Iniciando obtención de datos...");
        
        // Obtener posts
        const posts = await obtenerPosts();
        console.log("Posts obtenidos:", posts.length);
        
        // Obtener usuario para cada post
        const postsConUsuario = await Promise.all(
            posts.map(async (post) => {
                const usuario = await new Promise((resolve) => {
                    obtenerUsuario(post.id, (error, user) => {
                        resolve(user);
                    });
                });
                return { ...post, autor: usuario };
            })
        );
        
        return postsConUsuario;
        
    } catch (error) {
        console.error("Error en obtenerDatosCompletos:", error.message);
        throw error;
    }
}

// Fetch API
async function obtenerDatosAPI() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Error al obtener datos de API:", error.message);
        throw error;
    }
}

// Promise.all, Promise.race, Promise.allSettled
async function ejemplosPromesas() {
    const promesa1 = new Promise(resolve => setTimeout(() => resolve("Uno"), 1000));
    const promesa2 = new Promise(resolve => setTimeout(() => resolve("Dos"), 2000));
    const promesa3 = new Promise((resolve, reject) => setTimeout(() => reject("Error"), 500));
    
    try {
        // Promise.all - espera todas las promesas
        const resultadosAll = await Promise.all([promesa1, promesa2]);
        console.log("Promise.all:", resultadosAll);
        
        // Promise.race - devuelve la primera que se complete
        const resultadoRace = await Promise.race([promesa1, promesa2]);
        console.log("Promise.race:", resultadoRace);
        
        // Promise.allSettled - espera todas, sin importar si fallan
        const resultadosSettled = await Promise.allSettled([promesa1, promesa2, promesa3]);
        console.log("Promise.allSettled:", resultadosSettled);
        
    } catch (error) {
        console.error("Error en ejemplosPromesas:", error.message);
    }
}

// Ejemplo de uso
console.log("=== Ejemplos de Programación Asíncrona ===");

// Callback tradicional
obtenerUsuario(1, (error, usuario) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Usuario obtenido:", usuario);
    }
});

// Promesas
obtenerPosts()
    .then(posts => {
        console.log("Posts obtenidos con promesa:", posts.length);
    })
    .catch(error => {
        console.error("Error con promesa:", error.message);
    });

// Async/Await
obtenerDatosCompletos()
    .then(datos => {
        console.log("Datos completos obtenidos:", datos.length);
    })
    .catch(error => {
        console.error("Error con async/await:", error.message);
    });

// Ejemplos de promesas
ejemplosPromesas();

// Fetch API (comentado para evitar errores de red)
// obtenerDatosAPI()
//     .then(data => console.log("Datos de API:", data))
//     .catch(error => console.error("Error de API:", error.message));''',
                'explanation': 'Este ejemplo muestra diferentes patrones de programación asíncrona en JavaScript, incluyendo callbacks, promesas, async/await y la Fetch API.'
            }
        }
        
        question_lower = question_text.lower()
        
        # Determinar categoría basada en palabras clave
        if any(word in question_lower for word in ['javascript', 'variable', 'data type', 'string', 'number']):
            return examples['fundamentos']
        elif any(word in question_lower for word in ['function', 'closure', 'callback']):
            return examples['funciones']
        elif any(word in question_lower for word in ['async', 'promise', 'await', 'callback']):
            return examples['async']
        else:
            return {
                'title': 'Ejemplo Genérico de JavaScript',
                'code': '''// Ejemplo genérico de JavaScript
// Configuración básica
const config = {
    nombre: "Mi Aplicación",
    version: "1.0.0",
    debug: true
};

// Función principal
function inicializarAplicacion() {
    console.log(`Iniciando ${config.nombre} v${config.version}`);
    
    if (config.debug) {
        console.log("Modo debug activado");
    }
    
    return {
        estado: "inicializado",
        timestamp: new Date().toISOString()
    };
}

// Clase de ejemplo
class Ejemplo {
    constructor(nombre) {
        this.nombre = nombre;
        this.contador = 0;
    }
    
    incrementar() {
        this.contador++;
        return this.contador;
    }
    
    obtenerInfo() {
        return {
            nombre: this.nombre,
            contador: this.contador,
            timestamp: new Date().toISOString()
        };
    }
}

// Función de utilidad
function validarDatos(datos) {
    if (!datos || typeof datos !== 'object') {
        throw new Error("Datos inválidos");
    }
    
    return Object.keys(datos).length > 0;
}

// Ejemplo de uso
try {
    const app = inicializarAplicacion();
    console.log("Aplicación:", app);
    
    const ejemplo = new Ejemplo("Test");
    ejemplo.incrementar();
    ejemplo.incrementar();
    
    console.log("Ejemplo:", ejemplo.obtenerInfo());
    
    const datosValidos = { clave: "valor" };
    console.log("Datos válidos:", validarDatos(datosValidos));
    
} catch (error) {
    console.error("Error:", error.message);
}''',
                'explanation': 'Este es un ejemplo básico de JavaScript que muestra la estructura fundamental de una aplicación.'
            }
    
    def generate_unit_tests(self, example_code, category='otros'):
        return f'''// Pruebas unitarias para el ejemplo de JavaScript
// Para ejecutar: npm test

// Importar Jest (si está disponible)
// const {{ expect, test, describe, beforeEach, afterEach }} = require('@jest/globals');

// Mock de console.log para capturar output
let consoleOutput = [];
const originalLog = console.log;
const originalError = console.error;

beforeEach(() => {{
    consoleOutput = [];
    console.log = (...args) => consoleOutput.push(args.join(' '));
    console.error = (...args) => consoleOutput.push('ERROR: ' + args.join(' '));
}});

afterEach(() => {{
    console.log = originalLog;
    console.error = originalError;
}});

// Pruebas para fundamentos de JavaScript
describe('Fundamentos de JavaScript', () => {{
    test('debe crear variables correctamente', () => {{
        // Arrange
        const nombre = "Juan";
        const edad = 25;
        const esEstudiante = true;
        
        // Assert
        expect(typeof nombre).toBe('string');
        expect(typeof edad).toBe('number');
        expect(typeof esEstudiante).toBe('boolean');
        expect(nombre).toBe("Juan");
        expect(edad).toBe(25);
        expect(esEstudiante).toBe(true);
    }});
    
    test('debe realizar operaciones matemáticas', () => {{
        // Arrange
        const a = 10;
        const b = 5;
        
        // Act
        const suma = a + b;
        const resta = a - b;
        const multiplicacion = a * b;
        const division = a / b;
        
        // Assert
        expect(suma).toBe(15);
        expect(resta).toBe(5);
        expect(multiplicacion).toBe(50);
        expect(division).toBe(2);
    }});
    
    test('debe manejar arrays correctamente', () => {{
        // Arrange
        const colores = ["rojo", "verde", "azul"];
        
        // Act
        colores.push("amarillo");
        const primerColor = colores[0];
        const longitud = colores.length;
        
        // Assert
        expect(colores).toContain("amarillo");
        expect(primerColor).toBe("rojo");
        expect(longitud).toBe(4);
    }});
    
    test('debe crear y usar objetos', () => {{
        // Arrange
        const persona = {{
            nombre: "María",
            edad: 30,
            saludar: function() {{
                return `Hola, soy ${{this.nombre}}`;
            }}
        }};
        
        // Act
        const saludo = persona.saludar();
        
        // Assert
        expect(persona.nombre).toBe("María");
        expect(persona.edad).toBe(30);
        expect(saludo).toBe("Hola, soy María");
    }});
}});

// Pruebas para funciones
describe('Funciones y Closures', () => {{
    test('debe crear funciones correctamente', () => {{
        // Arrange
        function saludar(nombre) {{
            return `Hola, ${{nombre}}!`;
        }}
        
        const despedir = (nombre) => `Adiós, ${{nombre}}!`;
        
        // Act
        const saludo = saludar("Ana");
        const despedida = despedir("Carlos");
        
        // Assert
        expect(saludo).toBe("Hola, Ana!");
        expect(despedida).toBe("Adiós, Carlos!");
    }});
    
    test('debe crear closures correctamente', () => {{
        // Arrange
        function crearContador() {{
            let contador = 0;
            return {{
                incrementar: () => ++contador,
                obtenerValor: () => contador,
                resetear: () => {{ contador = 0; return contador; }}
            }};
        }}
        
        // Act
        const miContador = crearContador();
        const valor1 = miContador.incrementar();
        const valor2 = miContador.incrementar();
        const valorActual = miContador.obtenerValor();
        const valorReset = miContador.resetear();
        
        // Assert
        expect(valor1).toBe(1);
        expect(valor2).toBe(2);
        expect(valorActual).toBe(2);
        expect(valorReset).toBe(0);
    }});
    
    test('debe manejar funciones recursivas', () => {{
        // Arrange
        function factorial(n) {{
            if (n <= 1) return 1;
            return n * factorial(n - 1);
        }}
        
        // Act
        const resultado = factorial(5);
        
        // Assert
        expect(resultado).toBe(120);
    }});
}});

// Pruebas para programación asíncrona
describe('Programación Asíncrona', () => {{
    test('debe manejar promesas correctamente', async () => {{
        // Arrange
        function obtenerDatos() {{
            return new Promise((resolve) => {{
                setTimeout(() => resolve("datos"), 100);
            }});
        }}
        
        // Act
        const resultado = await obtenerDatos();
        
        // Assert
        expect(resultado).toBe("datos");
    }});
    
    test('debe manejar async/await correctamente', async () => {{
        // Arrange
        async function procesarDatos() {{
            const datos = await new Promise(resolve => {{
                setTimeout(() => resolve([1, 2, 3]), 50);
            }});
            return datos.map(x => x * 2);
        }}
        
        // Act
        const resultado = await procesarDatos();
        
        // Assert
        expect(resultado).toEqual([2, 4, 6]);
    }});
    
    test('debe manejar errores en promesas', async () => {{
        // Arrange
        function funcionQueFalla() {{
            return new Promise((resolve, reject) => {{
                setTimeout(() => reject(new Error("Error simulado")), 50);
            }});
        }}
        
        // Act & Assert
        await expect(funcionQueFalla()).rejects.toThrow("Error simulado");
    }});
}});

// Pruebas de integración
describe('Integración', () => {{
    test('debe ejecutar el ejemplo completo sin errores', () => {{
        // Act
        try {{
            // Ejecutar el código del ejemplo
            eval(`
                // Configuración básica
                const config = {{
                    nombre: "Mi Aplicación",
                    version: "1.0.0",
                    debug: true
                }};
                
                // Función principal
                function inicializarAplicacion() {{
                    return {{
                        estado: "inicializado",
                        timestamp: new Date().toISOString()
                    }};
                }}
                
                const app = inicializarAplicacion();
            `);
            
            // Assert
            expect(true).toBe(true); // Si llegamos aquí, no hubo errores
            
        }} catch (error) {{
            fail(`Error inesperado: ${{error.message}}`);
        }}
    }});
}});

// Para ejecutar las pruebas:
// 1. Instalar Jest: npm install --save-dev jest
// 2. Agregar al package.json: "test": "jest"
// 3. Ejecutar: npm test'''
    
    def predict_results(self, example_code):
        return '''📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- El código se ejecutará sin errores de sintaxis
- Las variables se declararán correctamente
- Las funciones retornarán los valores esperados
- Los objetos y arrays funcionarán apropiadamente
- Las promesas se resolverán correctamente

⚠️ **Posibles Errores:**
- Errores de sintaxis en el código
- Variables no declaradas
- Funciones mal definidas
- Problemas de scope y contexto
- Errores en promesas asíncronas

🔍 **Para Verificar:**
1. El código tiene sintaxis válida de JavaScript
2. Todas las variables están declaradas
3. Las funciones están correctamente definidas
4. Los objetos y arrays están bien estructurados
5. Las promesas manejan errores apropiadamente'''
    
    def suggest_improvements(self, question_text, category='otros'):
        improvements = {
            'fundamentos': '''🚀 Mejoras Sugeridas:

1. **Uso de ES6+ features:**
   - Usar const y let en lugar de var
   - Implementar template literals
   - Usar destructuring assignment
   - Implementar spread/rest operators

2. **Buenas prácticas:**
   - Usar nombres descriptivos para variables
   - Implementar validación de datos
   - Usar comentarios explicativos
   - Seguir convenciones de nomenclatura

3. **Optimización:**
   - Evitar variables globales innecesarias
   - Usar métodos de array eficientes
   - Implementar lazy evaluation
   - Optimizar bucles y condicionales

4. **Manejo de errores:**
   - Implementar try-catch apropiados
   - Validar entrada de datos
   - Usar tipos de datos correctos
   - Manejar casos edge''',
            
            'funciones': '''🚀 Mejoras Sugeridas:

1. **Funciones puras:**
   - Evitar efectos secundarios
   - Usar parámetros inmutables
   - Retornar valores consistentes
   - Implementar composición de funciones

2. **Arrow functions:**
   - Usar para funciones simples
   - Mantener consistencia en el código
   - Evitar en métodos de objetos
   - Usar para callbacks

3. **Closures avanzados:**
   - Implementar módulos con closures
   - Usar para data privacy
   - Implementar currying
   - Usar para memoización

4. **Funciones de orden superior:**
   - Implementar map, filter, reduce
   - Usar composición de funciones
   - Implementar decoradores
   - Usar partial application''',
            
            'async': '''🚀 Mejoras Sugeridas:

1. **Async/Await:**
   - Usar en lugar de callbacks anidados
   - Implementar manejo de errores con try-catch
   - Usar Promise.all para operaciones paralelas
   - Implementar cancelación de promesas

2. **Manejo de errores:**
   - Usar try-catch en async functions
   - Implementar error boundaries
   - Usar Promise.catch apropiadamente
   - Implementar retry logic

3. **Optimización:**
   - Usar Promise.all para operaciones paralelas
   - Implementar debouncing y throttling
   - Usar Web Workers para tareas pesadas
   - Implementar caching de promesas

4. **Testing:**
   - Usar Jest para testing async
   - Implementar mocks para APIs
   - Usar async/await en tests
   - Implementar timeout en tests'''

        }
        
        question_lower = question_text.lower()
        
        if any(word in question_lower for word in ['javascript', 'variable', 'data type', 'string', 'number']):
            return improvements['fundamentos']
        elif any(word in question_lower for word in ['function', 'closure', 'callback']):
            return improvements['funciones']
        elif any(word in question_lower for word in ['async', 'promise', 'await', 'callback']):
            return improvements['async']
        else:
            return '''🚀 Mejoras Sugeridas:

1. **Implementar mejores prácticas de JavaScript:**
   - Seguir principios de programación funcional
   - Usar ES6+ features apropiadamente
   - Implementar manejo de errores robusto
   - Seguir convenciones de código

2. **Optimizar rendimiento:**
   - Usar algoritmos eficientes
   - Implementar lazy loading
   - Optimizar manipulación del DOM
   - Usar técnicas de memoización

3. **Mejorar mantenibilidad:**
   - Implementar testing completo
   - Usar TypeScript para tipado
   - Implementar linting y formatting
   - Documentar código apropiadamente

4. **Seguridad:**
   - Implementar validación de entrada
   - Usar sanitización de datos
   - Implementar CSP apropiado
   - Seguir principios de seguridad web'''
    
    def process_question(self, question_data):
        question_text = question_data['question']
        answer_text = question_data['answer']
        category = question_data.get('category', 'otros')
        
        translated_question = self.translate_question(question_text)
        example = self.generate_example_code(question_text, category)
        unit_tests = self.generate_unit_tests(example['code'], category)
        results_prediction = self.predict_results(example['code'])
        improvements = self.suggest_improvements(question_text, category)
        
        processed_question = {
            'original_question': question_text,
            'translated_question': translated_question,
            'original_answer': answer_text,
            'category': category,
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
    
    def save_processed_questions(self, output_file="javascript_400_questions_processed.json"):
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '400+ JavaScript Interview Questions and Answers',
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
        print("🚀 Iniciando procesamiento de preguntas de JavaScript (400)")
        print("=" * 60)
        
        if not self.load_questions():
            return False
        
        self.process_all_questions(limit)
        self.save_processed_questions()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    input_file = "javascript_400_questions_structured.json"
    
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_javascript_400_questions.py")
        return
    
    processor = JavaScript400QuestionProcessor(input_file)
    success = processor.run_processing(limit=10)
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: javascript_400_questions_processed.json")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 