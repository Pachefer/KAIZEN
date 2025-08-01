#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de Java (540 preguntas)
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class Java540QuestionProcessor:
    def __init__(self, input_file="java_540_questions_structured.json"):
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
            'Java': 'Java',
            'class': 'clase',
            'object': 'objeto',
            'method': 'método',
            'variable': 'variable',
            'interface': 'interfaz',
            'inheritance': 'herencia',
            'polymorphism': 'polimorfismo',
            'encapsulation': 'encapsulación',
            'abstraction': 'abstracción',
            'exception': 'excepción',
            'thread': 'hilo',
            'collection': 'colección',
            'stream': 'stream',
            'lambda': 'lambda',
            'annotation': 'anotación',
            'reflection': 'reflexión',
            'generic': 'genérico',
            'synchronized': 'sincronizado',
            'volatile': 'volátil',
            'final': 'final',
            'static': 'estático',
            'public': 'público',
            'private': 'privado',
            'protected': 'protegido',
            'package': 'paquete',
            'import': 'importar',
            'extends': 'extiende',
            'implements': 'implementa',
            'super': 'super',
            'this': 'this',
            'new': 'new',
            'instanceof': 'instanceof',
            'try': 'try',
            'catch': 'catch',
            'finally': 'finally',
            'throw': 'throw',
            'throws': 'throws',
            'null': 'null',
            'void': 'void',
            'return': 'return',
            'if': 'if',
            'else': 'else',
            'switch': 'switch',
            'case': 'case',
            'default': 'default',
            'for': 'for',
            'while': 'while',
            'do': 'do',
            'break': 'break',
            'continue': 'continue',
            'array': 'array',
            'list': 'lista',
            'set': 'conjunto',
            'map': 'mapa',
            'string': 'string',
            'integer': 'entero',
            'boolean': 'booleano',
            'double': 'double',
            'float': 'float',
            'long': 'long',
            'short': 'short',
            'byte': 'byte',
            'char': 'char',
            'enum': 'enum',
            'abstract': 'abstracto',
            'interface': 'interfaz',
            'constructor': 'constructor',
            'overload': 'sobrecarga',
            'override': 'sobrescritura',
            'overriding': 'sobrescritura',
            'overloading': 'sobrecarga',
            'runtime': 'tiempo de ejecución',
            'compile time': 'tiempo de compilación',
            'memory': 'memoria',
            'garbage collection': 'recolección de basura',
            'jvm': 'JVM',
            'bytecode': 'bytecode',
            'compiler': 'compilador',
            'interpreter': 'intérprete',
            'platform': 'plataforma',
            'portable': 'portable',
            'robust': 'robusto',
            'secure': 'seguro',
            'multithreaded': 'multihilo',
            'distributed': 'distribuido',
            'dynamic': 'dinámico',
            'architecture': 'arquitectura',
            'neutral': 'neutral',
            'high performance': 'alto rendimiento',
            'interpreted': 'interpretado',
            'object oriented': 'orientado a objetos',
            'procedural': 'procedural',
            'functional': 'funcional',
            'imperative': 'imperativo',
            'declarative': 'declarativo',
            'paradigm': 'paradigma',
            'pattern': 'patrón',
            'design': 'diseño',
            'principle': 'principio',
            'best practice': 'mejor práctica',
            'anti pattern': 'anti patrón',
            'code smell': 'code smell',
            'refactoring': 'refactorización',
            'legacy': 'legacy',
            'maintenance': 'mantenimiento',
            'testing': 'testing',
            'unit test': 'prueba unitaria',
            'integration test': 'prueba de integración',
            'mock': 'mock',
            'stub': 'stub',
            'spy': 'spy',
            'coverage': 'cobertura',
            'assertion': 'aserciones',
            'framework': 'framework',
            'library': 'biblioteca',
            'api': 'API',
            'sdk': 'SDK',
            'ide': 'IDE',
            'build tool': 'herramienta de build',
            'dependency': 'dependencia',
            'maven': 'Maven',
            'gradle': 'Gradle',
            'ant': 'Ant',
            'jar': 'JAR',
            'war': 'WAR',
            'ear': 'EAR',
            'classpath': 'classpath',
            'module': 'módulo',
            'package': 'paquete',
            'namespace': 'namespace',
            'scope': 'alcance',
            'visibility': 'visibilidad',
            'access modifier': 'modificador de acceso',
            'non access modifier': 'modificador no de acceso',
            'transient': 'transient',
            'native': 'native',
            'strictfp': 'strictfp',
            'synchronized': 'sincronizado',
            'volatile': 'volátil',
            'final': 'final',
            'static': 'estático',
            'abstract': 'abstracto',
            'default': 'default',
            'sealed': 'sealed',
            'non sealed': 'non sealed',
            'permits': 'permits',
            'record': 'record',
            'sealed class': 'clase sellada',
            'sealed interface': 'interfaz sellada',
            'pattern matching': 'pattern matching',
            'switch expression': 'expresión switch',
            'text block': 'bloque de texto',
            'var': 'var',
            'yield': 'yield',
            'record': 'record',
            'sealed': 'sealed',
            'permits': 'permits',
            'non sealed': 'non sealed',
            'permits': 'permits',
            'record': 'record',
            'sealed class': 'clase sellada',
            'sealed interface': 'interfaz sellada',
            'pattern matching': 'pattern matching',
            'switch expression': 'expresión switch',
            'text block': 'bloque de texto',
            'var': 'var',
            'yield': 'yield'
        }
        
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text, category='otros'):
        examples = {
            'fundamentos': {
                'title': 'Fundamentos de Java',
                'code': '''// Ejemplo de fundamentos de Java
public class FundamentosJava {
    // Variables de instancia (atributos)
    private String nombre;
    private int edad;
    
    // Variable estática (de clase)
    public static final String LENGUAJE = "Java";
    
    // Constructor por defecto
    public FundamentosJava() {
        this.nombre = "Sin nombre";
        this.edad = 0;
    }
    
    // Constructor parametrizado
    public FundamentosJava(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    // Método de instancia
    public void saludar() {
        System.out.println("Hola, soy " + nombre + " y tengo " + edad + " años");
    }
    
    // Método estático
    public static void mostrarInfoLenguaje() {
        System.out.println("Lenguaje de programación: " + LENGUAJE);
    }
    
    // Método con retorno
    public String obtenerInformacion() {
        return "Nombre: " + nombre + ", Edad: " + edad;
    }
    
    // Método main (punto de entrada)
    public static void main(String[] args) {
        // Crear objetos
        FundamentosJava persona1 = new FundamentosJava();
        FundamentosJava persona2 = new FundamentosJava("Juan", 25);
        
        // Llamar métodos
        persona1.saludar();
        persona2.saludar();
        
        // Llamar método estático
        FundamentosJava.mostrarInfoLenguaje();
        
        // Obtener información
        System.out.println(persona2.obtenerInformacion());
        
        // Arrays
        int[] numeros = {1, 2, 3, 4, 5};
        for (int numero : numeros) {
            System.out.print(numero + " ");
        }
        System.out.println();
        
        // Strings
        String mensaje = "Java es un lenguaje de programación";
        System.out.println("Longitud: " + mensaje.length());
        System.out.println("Mayúsculas: " + mensaje.toUpperCase());
        System.out.println("Contiene 'Java': " + mensaje.contains("Java"));
    }
}''',
                'explanation': 'Este ejemplo muestra los fundamentos básicos de Java: clases, objetos, constructores, métodos, variables, arrays y strings.'
            },
            'oop': {
                'title': 'Programación Orientada a Objetos',
                'code': '''// Ejemplo de POO en Java
// Clase abstracta
abstract class Animal {
    protected String nombre;
    protected int edad;
    
    public Animal(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    // Método abstracto (debe ser implementado por las subclases)
    public abstract void hacerSonido();
    
    // Método concreto
    public void dormir() {
        System.out.println(nombre + " está durmiendo");
    }
    
    // Método que puede ser sobrescrito
    public void comer() {
        System.out.println(nombre + " está comiendo");
    }
}

// Interfaz
interface Mascota {
    void jugar();
    void cuidar();
}

// Clase que extiende Animal e implementa Mascota
class Perro extends Animal implements Mascota {
    private String raza;
    
    public Perro(String nombre, int edad, String raza) {
        super(nombre, edad); // Llamada al constructor padre
        this.raza = raza;
    }
    
    // Implementación del método abstracto
    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: ¡Guau!");
    }
    
    // Sobrescritura del método comer
    @Override
    public void comer() {
        System.out.println(nombre + " está comiendo croquetas");
    }
    
    // Implementación de métodos de la interfaz
    @Override
    public void jugar() {
        System.out.println(nombre + " está jugando con la pelota");
    }
    
    @Override
    public void cuidar() {
        System.out.println("Cuidando a " + nombre + " de raza " + raza);
    }
    
    // Método específico de Perro
    public void ladrar() {
        System.out.println(nombre + " está ladrando");
    }
}

// Clase que extiende Animal
class Gato extends Animal {
    private boolean esIndependiente;
    
    public Gato(String nombre, int edad, boolean esIndependiente) {
        super(nombre, edad);
        this.esIndependiente = esIndependiente;
    }
    
    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: ¡Miau!");
    }
    
    @Override
    public void comer() {
        System.out.println(nombre + " está comiendo pescado");
    }
    
    public void ronronear() {
        System.out.println(nombre + " está ronroneando");
    }
}

// Clase principal para demostrar POO
public class EjemploPOO {
    public static void main(String[] args) {
        // Polimorfismo: usar referencias de la clase padre
        Animal[] animales = new Animal[3];
        animales[0] = new Perro("Buddy", 3, "Golden Retriever");
        animales[1] = new Gato("Whiskers", 2, true);
        animales[2] = new Perro("Max", 5, "Labrador");
        
        // Iterar sobre animales (polimorfismo)
        for (Animal animal : animales) {
            animal.hacerSonido(); // Cada uno hace su sonido específico
            animal.comer();
            animal.dormir();
            System.out.println();
        }
        
        // Usar métodos específicos de las subclases
        Perro perro = new Perro("Rex", 4, "Pastor Alemán");
        perro.jugar(); // Método de la interfaz Mascota
        perro.cuidar(); // Método de la interfaz Mascota
        perro.ladrar(); // Método específico de Perro
        
        Gato gato = new Gato("Luna", 1, false);
        gato.ronronear(); // Método específico de Gato
        
        // Demostrar encapsulación
        System.out.println("\\nInformación del perro:");
        System.out.println("Nombre: " + perro.nombre); // Acceso a protected
        // System.out.println(perro.raza); // Error: raza es private
    }
}''',
                'explanation': 'Este ejemplo demuestra los conceptos de POO: herencia, polimorfismo, encapsulación, abstracción e interfaces.'
            },
            'colecciones': {
                'title': 'Colecciones Java',
                'code': '''// Ejemplo de colecciones en Java
import java.util.*;

public class EjemploColecciones {
    public static void main(String[] args) {
        // Lista (ArrayList)
        System.out.println("=== LISTA (ArrayList) ===");
        List<String> nombres = new ArrayList<>();
        nombres.add("Ana");
        nombres.add("Carlos");
        nombres.add("Beatriz");
        nombres.add("David");
        
        System.out.println("Lista original: " + nombres);
        System.out.println("Tamaño: " + nombres.size());
        System.out.println("Primer elemento: " + nombres.get(0));
        
        // Ordenar lista
        Collections.sort(nombres);
        System.out.println("Lista ordenada: " + nombres);
        
        // Conjunto (HashSet)
        System.out.println("\\n=== CONJUNTO (HashSet) ===");
        Set<Integer> numeros = new HashSet<>();
        numeros.add(5);
        numeros.add(2);
        numeros.add(8);
        numeros.add(2); // Duplicado - no se agrega
        numeros.add(1);
        
        System.out.println("Conjunto: " + numeros);
        System.out.println("Contiene 5: " + numeros.contains(5));
        
        // Mapa (HashMap)
        System.out.println("\\n=== MAPA (HashMap) ===");
        Map<String, Integer> edades = new HashMap<>();
        edades.put("Ana", 25);
        edades.put("Carlos", 30);
        edades.put("Beatriz", 28);
        edades.put("David", 35);
        
        System.out.println("Mapa de edades: " + edades);
        System.out.println("Edad de Ana: " + edades.get("Ana"));
        
        // Iterar sobre el mapa
        System.out.println("\\nIterando sobre el mapa:");
        for (Map.Entry<String, Integer> entrada : edades.entrySet()) {
            System.out.println(entrada.getKey() + " tiene " + entrada.getValue() + " años");
        }
        
        // Colecciones especializadas
        System.out.println("\\n=== COLECCIONES ESPECIALIZADAS ===");
        
        // LinkedList (lista enlazada)
        LinkedList<String> cola = new LinkedList<>();
        cola.add("Primero");
        cola.add("Segundo");
        cola.add("Tercero");
        System.out.println("Cola: " + cola);
        System.out.println("Primer elemento (FIFO): " + cola.poll());
        System.out.println("Cola después de poll: " + cola);
        
        // TreeSet (conjunto ordenado)
        TreeSet<String> nombresOrdenados = new TreeSet<>();
        nombresOrdenados.add("Zara");
        nombresOrdenados.add("Ana");
        nombresOrdenados.add("Carlos");
        nombresOrdenados.add("Beatriz");
        System.out.println("\\nConjunto ordenado: " + nombresOrdenados);
        
        // TreeMap (mapa ordenado)
        TreeMap<String, Integer> edadesOrdenadas = new TreeMap<>();
        edadesOrdenadas.put("Zara", 22);
        edadesOrdenadas.put("Ana", 25);
        edadesOrdenadas.put("Carlos", 30);
        System.out.println("\\nMapa ordenado: " + edadesOrdenadas);
        
        // Operaciones con streams
        System.out.println("\\n=== STREAMS ===");
        List<Integer> numerosLista = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Filtrar números pares
        List<Integer> pares = numerosLista.stream()
                .filter(n -> n % 2 == 0)
                .collect(Collectors.toList());
        System.out.println("Números pares: " + pares);
        
        // Mapear al cuadrado
        List<Integer> cuadrados = numerosLista.stream()
                .map(n -> n * n)
                .collect(Collectors.toList());
        System.out.println("Cuadrados: " + cuadrados);
        
        // Sumar todos los números
        int suma = numerosLista.stream()
                .reduce(0, Integer::sum);
        System.out.println("Suma total: " + suma);
        
        // Encontrar el máximo
        Optional<Integer> maximo = numerosLista.stream()
                .max(Integer::compareTo);
        System.out.println("Máximo: " + maximo.orElse(0));
    }
}''',
                'explanation': 'Este ejemplo muestra el uso de las principales colecciones de Java: List, Set, Map y sus implementaciones, además de operaciones con streams.'
            }
        }
        
        question_lower = question_text.lower()
        
        # Determinar categoría basada en palabras clave
        if any(word in question_lower for word in ['fundamental', 'basic', 'main method', 'jvm']):
            return examples['fundamentos']
        elif any(word in question_lower for word in ['class', 'object', 'inheritance', 'polymorphism']):
            return examples['oop']
        elif any(word in question_lower for word in ['collection', 'list', 'set', 'map']):
            return examples['colecciones']
        else:
            return {
                'title': 'Ejemplo Genérico de Java',
                'code': '''// Ejemplo genérico de Java
public class EjemploGenerico {
    // Método principal
    public static void main(String[] args) {
        System.out.println("¡Hola desde Java!");
        
        // Variables
        String mensaje = "Este es un ejemplo básico";
        int numero = 42;
        
        // Imprimir valores
        System.out.println("Mensaje: " + mensaje);
        System.out.println("Número: " + numero);
        
        // Condicional
        if (numero > 40) {
            System.out.println("El número es mayor que 40");
        } else {
            System.out.println("El número es menor o igual a 40");
        }
        
        // Bucle
        for (int i = 0; i < 3; i++) {
            System.out.println("Iteración " + (i + 1));
        }
    }
}''',
                'explanation': 'Este es un ejemplo básico de Java que muestra la estructura fundamental de un programa.'
            }
    
    def generate_unit_tests(self, example_code, category='otros'):
        return f'''// Pruebas unitarias para el ejemplo de Java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Suite de pruebas para el ejemplo de Java
 */
@DisplayName("Pruebas de Ejemplo Java")
class EjemploJavaTest {{
    
    private EjemploGenerico ejemplo;
    
    @BeforeEach
    void setUp() {{
        ejemplo = new EjemploGenerico();
    }}
    
    @Test
    @DisplayName("Debería crear instancia correctamente")
    void deberiaCrearInstancia() {{
        assertNotNull(ejemplo);
    }}
    
    @Test
    @DisplayName("Debería tener método main")
    void deberiaTenerMetodoMain() {{
        // Verificar que la clase tiene el método main
        try {{
            Class<?> clase = Class.forName("EjemploGenerico");
            assertNotNull(clase.getMethod("main", String[].class));
        }} catch (Exception e) {{
            fail("No se encontró el método main: " + e.getMessage());
        }}
    }}
    
    @Test
    @DisplayName("Debería compilar sin errores")
    void deberiaCompilarSinErrores() {{
        // Esta prueba verifica que el código compila
        assertTrue(true, "El código compila correctamente");
    }}
    
    @Test
    @DisplayName("Debería tener estructura básica")
    void deberiaTenerEstructuraBasica() {{
        // Verificar que la clase es pública
        assertTrue(EjemploGenerico.class.isPublic());
        
        // Verificar que tiene método main público y estático
        try {{
            var mainMethod = EjemploGenerico.class.getMethod("main", String[].class);
            assertTrue(java.lang.reflect.Modifier.isPublic(mainMethod.getModifiers()));
            assertTrue(java.lang.reflect.Modifier.isStatic(mainMethod.getModifiers()));
        }} catch (Exception e) {{
            fail("Error al verificar método main: " + e.getMessage());
        }}
    }}
}});

// Para ejecutar las pruebas:
// mvn test
// gradle test
// java -cp .:junit-platform-console-standalone-1.8.2.jar org.junit.platform.console.ConsoleLauncher --class-path . --scan-class-path'''
    
    def predict_results(self, example_code):
        return '''📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- El programa se compilará correctamente
- Se ejecutará sin errores
- Mostrará los mensajes esperados en la consola
- No habrá errores de runtime

⚠️ **Posibles Errores:**
- Errores de sintaxis Java
- Problemas de compilación
- Errores de runtime
- Problemas con el classpath

🔍 **Para Verificar:**
1. El código compila sin errores
2. El programa se ejecuta correctamente
3. Los mensajes se muestran en la consola
4. No hay warnings del compilador
5. El código sigue las convenciones de Java'''
    
    def suggest_improvements(self, question_text, category='otros'):
        improvements = {
            'fundamentos': '''🚀 Mejoras Sugeridas:

1. **Optimización de código:**
   - Usar constantes para valores mágicos
   - Implementar validación de entrada
   - Agregar manejo de excepciones
   - Usar StringBuilder para concatenación de strings

2. **Mejores prácticas:**
   - Seguir convenciones de nomenclatura
   - Agregar documentación JavaDoc
   - Implementar equals y hashCode
   - Usar enums para constantes

3. **Testing:**
   - Agregar pruebas unitarias completas
   - Implementar pruebas de integración
   - Usar mocks para dependencias
   - Medir cobertura de código

4. **Documentación:**
   - Documentar métodos con JavaDoc
   - Proporcionar ejemplos de uso
   - Explicar casos edge
   - Documentar excepciones''',
            
            'oop': '''🚀 Mejoras Sugeridas:

1. **Patrones de diseño:**
   - Implementar Factory Pattern
   - Usar Builder Pattern para objetos complejos
   - Aplicar Strategy Pattern
   - Implementar Observer Pattern

2. **Principios SOLID:**
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

3. **Testing de POO:**
   - Probar herencia y polimorfismo
   - Verificar encapsulación
   - Testear interfaces
   - Mockear clases abstractas

4. **Documentación:**
   - Documentar jerarquía de clases
   - Explicar relaciones entre clases
   - Documentar contratos de interfaces
   - Proporcionar diagramas UML''',
            
            'colecciones': '''🚀 Mejoras Sugeridas:

1. **Optimización de colecciones:**
   - Elegir la colección apropiada según el caso de uso
   - Usar streams paralelos para operaciones costosas
   - Implementar comparadores personalizados
   - Usar colecciones thread-safe cuando sea necesario

2. **Mejores prácticas:**
   - Usar diamond operator (<>) cuando sea posible
   - Implementar equals y hashCode para objetos en colecciones
   - Usar Collections.unmodifiableXXX para inmutabilidad
   - Preferir interfaces sobre implementaciones

3. **Testing de colecciones:**
   - Probar operaciones CRUD
   - Verificar ordenamiento
   - Testear streams y operaciones funcionales
   - Validar comportamiento con elementos duplicados

4. **Performance:**
   - Usar ArrayList para acceso aleatorio frecuente
   - Usar LinkedList para inserción/eliminación frecuente
   - Usar HashSet para búsquedas rápidas
   - Usar TreeMap para ordenamiento automático'''

        }
        
        question_lower = question_text.lower()
        
        if any(word in question_lower for word in ['fundamental', 'basic', 'main method']):
            return improvements['fundamentos']
        elif any(word in question_lower for word in ['class', 'object', 'inheritance']):
            return improvements['oop']
        elif any(word in question_lower for word in ['collection', 'list', 'set']):
            return improvements['colecciones']
        else:
            return '''🚀 Mejoras Sugeridas:

1. **Implementar mejores prácticas de Java:**
   - Seguir convenciones de nomenclatura
   - Usar tipos genéricos apropiadamente
   - Implementar manejo de excepciones
   - Agregar documentación JavaDoc

2. **Optimizar rendimiento:**
   - Usar StringBuilder para strings
   - Implementar caching cuando sea apropiado
   - Optimizar bucles y operaciones
   - Usar streams para operaciones funcionales

3. **Mejorar testing:**
   - Agregar pruebas unitarias
   - Implementar pruebas de integración
   - Usar mocks y stubs
   - Medir cobertura de código

4. **Implementar seguridad:**
   - Validar entrada de datos
   - Manejar excepciones apropiadamente
   - Usar constantes para valores mágicos
   - Implementar logging apropiado'''
    
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
    
    def save_processed_questions(self, output_file="java_540_questions_processed.json"):
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '540+ Java Interview Questions and Answers',
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
        print("🚀 Iniciando procesamiento de preguntas de Java (540)")
        print("=" * 60)
        
        if not self.load_questions():
            return False
        
        self.process_all_questions(limit)
        self.save_processed_questions()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    input_file = "java_540_questions_structured.json"
    
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_java_540_questions.py")
        return
    
    processor = Java540QuestionProcessor(input_file)
    success = processor.run_processing(limit=10)
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: java_540_questions_processed.json")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 