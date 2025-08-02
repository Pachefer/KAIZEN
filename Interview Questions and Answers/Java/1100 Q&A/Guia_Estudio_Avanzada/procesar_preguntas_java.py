#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para procesar preguntas de entrevista de Java y generar una guía de estudio avanzada
Autor: Asistente IA
Fecha: 2024
"""

import re
import json
import os
from typing import List, Dict, Any
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Pregunta:
    """Clase para representar una pregunta de entrevista"""
    numero: int
    pregunta: str
    opciones: List[str]
    respuesta_correcta: str
    explicacion: str
    categoria: str = "General"
    nivel_dificultad: str = "Básico"

class ProcesadorPreguntasJava:
    """Clase para procesar y generar guía de estudio de Java"""
    
    def __init__(self, archivo_entrada: str):
        self.archivo_entrada = archivo_entrada
        self.preguntas: List[Pregunta] = []
        self.categorias = {
            "Fundamentos": ["JDK", "JRE", "JVM", "bytecode", "compiler"],
            "Tipos de Datos": ["int", "double", "boolean", "char", "byte", "primitive", "reference"],
            "POO": ["class", "object", "inheritance", "polymorphism", "encapsulation", "abstraction"],
            "Memoria": ["heap", "stack", "memory", "garbage", "collection"],
            "Strings": ["String", "string", "immutable", "concatenation"],
            "Colecciones": ["List", "Set", "Map", "ArrayList", "HashMap", "collection"],
            "Excepciones": ["exception", "try", "catch", "finally", "throw", "throws"],
            "Hilos": ["thread", "multithreading", "synchronization", "concurrent"],
            "Streams": ["stream", "lambda", "functional", "predicate", "consumer"],
            "Anotaciones": ["annotation", "@Override", "@Deprecated", "@SuppressWarnings"]
        }
    
    def leer_archivo(self) -> str:
        """Lee el archivo de preguntas"""
        try:
            with open(self.archivo_entrada, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"Error: No se encontró el archivo {self.archivo_entrada}")
            return ""
        except Exception as e:
            print(f"Error al leer el archivo: {e}")
            return ""
    
    def extraer_preguntas(self, contenido: str) -> List[Pregunta]:
        """Extrae las preguntas del contenido del archivo"""
        preguntas = []
        patron = r'Q:\s*(.*?)\s*\n\n(?:A:\s*(.*?)\s*\nB:\s*(.*?)\s*\n(?:C:\s*(.*?)\s*\n)?(?:D:\s*(.*?)\s*\n)?)?\n\nCorrect Response:\s*(\d+(?:,\s*\d+)*)\s*\n\nExplanation:\s*(.*?)(?=\n\nQ:|$)'
        
        matches = re.findall(patron, contenido, re.DOTALL)
        
        for i, match in enumerate(matches, 1):
            pregunta_texto = match[0].strip()
            opciones = [opt.strip() for opt in match[1:5] if opt.strip()]
            respuesta_correcta = match[5].strip()
            explicacion = match[6].strip()
            
            # Determinar categoría
            categoria = self.determinar_categoria(pregunta_texto, explicacion)
            
            # Determinar nivel de dificultad
            nivel = self.determinar_nivel_dificultad(pregunta_texto, explicacion)
            
            pregunta = Pregunta(
                numero=i,
                pregunta=pregunta_texto,
                opciones=opciones,
                respuesta_correcta=respuesta_correcta,
                explicacion=explicacion,
                categoria=categoria,
                nivel_dificultad=nivel
            )
            preguntas.append(pregunta)
        
        return preguntas
    
    def determinar_categoria(self, pregunta: str, explicacion: str) -> str:
        """Determina la categoría de la pregunta basándose en palabras clave"""
        texto_completo = (pregunta + " " + explicacion).lower()
        
        for categoria, palabras_clave in self.categorias.items():
            for palabra in palabras_clave:
                if palabra.lower() in texto_completo:
                    return categoria
        
        return "General"
    
    def determinar_nivel_dificultad(self, pregunta: str, explicacion: str) -> str:
        """Determina el nivel de dificultad de la pregunta"""
        texto_completo = (pregunta + " " + explicacion).lower()
        
        # Palabras clave para diferentes niveles
        palabras_basico = ["what is", "define", "explain", "basic", "simple"]
        palabras_intermedio = ["difference", "compare", "how", "why", "implement"]
        palabras_avanzado = ["design pattern", "algorithm", "optimization", "performance", "concurrent", "memory leak"]
        
        for palabra in palabras_avanzado:
            if palabra in texto_completo:
                return "Avanzado"
        
        for palabra in palabras_intermedio:
            if palabra in texto_completo:
                return "Intermedio"
        
        return "Básico"
    
    def generar_ejemplos_codigo(self, pregunta: Pregunta) -> str:
        """Genera ejemplos de código basándose en la pregunta"""
        ejemplos = []
        
        # Ejemplos específicos por categoría
        if pregunta.categoria == "Fundamentos":
            if "JDK" in pregunta.pregunta or "JRE" in pregunta.pregunta:
                ejemplos.append("""
```java
// Ejemplo de compilación y ejecución con JDK
public class EjemploJDK {
    public static void main(String[] args) {
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Java Home: " + System.getProperty("java.home"));
        System.out.println("Java Vendor: " + System.getProperty("java.vendor"));
    }
}

// Compilar: javac EjemploJDK.java
// Ejecutar: java EjemploJDK
```""")
        
        elif pregunta.categoria == "Tipos de Datos":
            ejemplos.append("""
```java
// Ejemplos de tipos de datos primitivos y referencias
public class TiposDatos {
    public static void main(String[] args) {
        // Tipos primitivos (almacenados en stack)
        int numero = 42;
        double decimal = 3.14;
        boolean verdadero = true;
        char caracter = 'A';
        byte byteValor = 127;
        
        // Tipos de referencia (almacenados en heap)
        String texto = "Hola Mundo";
        Integer numeroObjeto = Integer.valueOf(42);
        Double decimalObjeto = Double.valueOf(3.14);
        
        // Arrays
        int[] numeros = {1, 2, 3, 4, 5};
        String[] palabras = {"Java", "Python", "JavaScript"};
        
        System.out.println("Primitivo: " + numero);
        System.out.println("Referencia: " + texto);
    }
}
```""")
        
        elif pregunta.categoria == "POO":
            ejemplos.append("""
```java
// Ejemplo de Programación Orientada a Objetos
abstract class Animal {
    protected String nombre;
    
    public Animal(String nombre) {
        this.nombre = nombre;
    }
    
    // Método abstracto
    public abstract void hacerSonido();
    
    // Método concreto
    public void comer() {
        System.out.println(nombre + " está comiendo");
    }
}

class Perro extends Animal {
    public Perro(String nombre) {
        super(nombre);
    }
    
    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: ¡Guau!");
    }
}

class Gato extends Animal {
    public Gato(String nombre) {
        super(nombre);
    }
    
    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: ¡Miau!");
    }
}

// Ejemplo de polimorfismo
public class EjemploPOO {
    public static void main(String[] args) {
        Animal[] animales = {
            new Perro("Rex"),
            new Gato("Mittens")
        };
        
        for (Animal animal : animales) {
            animal.hacerSonido(); // Polimorfismo
            animal.comer();
        }
    }
}
```""")
        
        elif pregunta.categoria == "Memoria":
            ejemplos.append("""
```java
// Ejemplo de gestión de memoria en Java
public class GestionMemoria {
    public static void main(String[] args) {
        // Stack: variables locales y primitivas
        int numeroLocal = 42;
        String textoLocal = "Hola";
        
        // Heap: objetos
        StringBuilder builder = new StringBuilder("Texto dinámico");
        List<String> lista = new ArrayList<>();
        
        // Método que crea objetos en heap
        crearObjetos();
        
        // Forzar garbage collection (no recomendado en producción)
        System.gc();
        
        // Información de memoria
        Runtime runtime = Runtime.getRuntime();
        long memoriaTotal = runtime.totalMemory();
        long memoriaLibre = runtime.freeMemory();
        long memoriaUsada = memoriaTotal - memoriaLibre;
        
        System.out.println("Memoria total: " + memoriaTotal / 1024 / 1024 + " MB");
        System.out.println("Memoria usada: " + memoriaUsada / 1024 / 1024 + " MB");
    }
    
    private static void crearObjetos() {
        // Estos objetos se crean en el heap
        for (int i = 0; i < 1000; i++) {
            new String("Objeto " + i);
        }
    }
}
```""")
        
        elif pregunta.categoria == "Strings":
            ejemplos.append("""
```java
// Ejemplo de inmutabilidad de Strings
public class EjemploStrings {
    public static void main(String[] args) {
        // Strings son inmutables
        String str1 = "Hola";
        String str2 = str1;
        str1 = str1 + " Mundo"; // Crea un nuevo objeto
        
        System.out.println("str1: " + str1); // "Hola Mundo"
        System.out.println("str2: " + str2); // "Hola" (sin cambios)
        
        // StringBuilder para concatenación eficiente
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            sb.append("número ").append(i).append(" ");
        }
        String resultado = sb.toString();
        
        // Comparación de Strings
        String a = "Java";
        String b = "Java";
        String c = new String("Java");
        
        System.out.println("a == b: " + (a == b)); // true (mismo objeto en pool)
        System.out.println("a == c: " + (a == c)); // false (objetos diferentes)
        System.out.println("a.equals(c): " + a.equals(c)); // true (mismo contenido)
    }
}
```""")
        
        return "\n".join(ejemplos) if ejemplos else "```java\n// Ejemplo específico para esta pregunta\n// TODO: Implementar ejemplo personalizado\n```"
    
    def generar_pruebas_unitarias(self, pregunta: Pregunta) -> str:
        """Genera pruebas unitarias basándose en la pregunta"""
        pruebas = []
        
        if pregunta.categoria == "Fundamentos":
            pruebas.append("""
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class FundamentosJavaTest {
    
    @Test
    public void testJavaVersion() {
        // Verificar que Java está disponible
        String version = System.getProperty("java.version");
        assertNotNull(version);
        assertTrue(version.matches("\\d+\\.\\d+\\.\\d+"));
    }
    
    @Test
    public void testJavaHome() {
        // Verificar que JAVA_HOME está configurado
        String javaHome = System.getProperty("java.home");
        assertNotNull(javaHome);
        assertTrue(new java.io.File(javaHome).exists());
    }
    
    @Test
    public void testMainMethod() {
        // Verificar que la clase principal puede ejecutarse
        try {
            Class.forName("java.lang.String");
            assertTrue(true);
        } catch (ClassNotFoundException e) {
            fail("No se pudo cargar la clase String");
        }
    }
}
```""")
        
        elif pregunta.categoria == "Tipos de Datos":
            pruebas.append("""
```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TiposDatosTest {
    
    @Test
    public void testTiposPrimitivos() {
        // Verificar rangos de tipos primitivos
        byte byteMin = Byte.MIN_VALUE;
        byte byteMax = Byte.MAX_VALUE;
        assertEquals(-128, byteMin);
        assertEquals(127, byteMax);
        
        int intMin = Integer.MIN_VALUE;
        int intMax = Integer.MAX_VALUE;
        assertEquals(-2147483648, intMin);
        assertEquals(2147483647, intMax);
    }
    
    @Test
    public void testTiposReferencia() {
        // Verificar tipos de referencia
        String str1 = "test";
        String str2 = new String("test");
        
        assertNotSame(str1, str2); // Objetos diferentes
        assertEquals(str1, str2);  // Contenido igual
    }
    
    @Test
    public void testArrays() {
        int[] numeros = {1, 2, 3, 4, 5};
        assertEquals(5, numeros.length);
        assertEquals(1, numeros[0]);
        assertEquals(5, numeros[4]);
    }
}
```""")
        
        elif pregunta.categoria == "POO":
            pruebas.append("""
```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

abstract class Animal {
    protected String nombre;
    
    public Animal(String nombre) {
        this.nombre = nombre;
    }
    
    public abstract String hacerSonido();
    public String getNombre() { return nombre; }
}

class Perro extends Animal {
    public Perro(String nombre) { super(nombre); }
    
    @Override
    public String hacerSonido() {
        return "Guau";
    }
}

class Gato extends Animal {
    public Gato(String nombre) { super(nombre); }
    
    @Override
    public String hacerSonido() {
        return "Miau";
    }
}

public class POOTest {
    
    @Test
    public void testHerencia() {
        Perro perro = new Perro("Rex");
        assertEquals("Rex", perro.getNombre());
        assertEquals("Guau", perro.hacerSonido());
    }
    
    @Test
    public void testPolimorfismo() {
        Animal[] animales = {
            new Perro("Rex"),
            new Gato("Mittens")
        };
        
        assertEquals("Guau", animales[0].hacerSonido());
        assertEquals("Miau", animales[1].hacerSonido());
    }
    
    @Test
    public void testInstanciaDe() {
        Animal perro = new Perro("Rex");
        assertTrue(perro instanceof Animal);
        assertTrue(perro instanceof Perro);
        assertFalse(perro instanceof Gato);
    }
}
```""")
        
        return "\n".join(pruebas) if pruebas else "```java\n// Pruebas unitarias específicas para esta pregunta\n// TODO: Implementar pruebas personalizadas\n```"
    
    def procesar_preguntas(self) -> None:
        """Procesa todas las preguntas y genera la guía de estudio"""
        contenido = self.leer_archivo()
        if not contenido:
            return
        
        self.preguntas = self.extraer_preguntas(contenido)
        print(f"Se procesaron {len(self.preguntas)} preguntas")
        
        # Generar archivos de salida
        self.generar_guia_completa()
        self.generar_archivos_por_categoria()
        self.generar_indice()
    
    def generar_guia_completa(self) -> None:
        """Genera la guía completa de estudio"""
        contenido = []
        contenido.append("# Guía de Estudio Avanzada: 1100+ Preguntas de Entrevista Java\n")
        contenido.append("## Índice\n")
        contenido.append("1. [Fundamentos de Java](#fundamentos-de-java)\n")
        contenido.append("2. [Tipos de Datos](#tipos-de-datos)\n")
        contenido.append("3. [Programación Orientada a Objetos](#programación-orientada-a-objetos)\n")
        contenido.append("4. [Gestión de Memoria](#gestión-de-memoria)\n")
        contenido.append("5. [Strings](#strings)\n")
        contenido.append("6. [Colecciones](#colecciones)\n")
        contenido.append("7. [Excepciones](#excepciones)\n")
        contenido.append("8. [Hilos y Concurrencia](#hilos-y-concurrencia)\n")
        contenido.append("9. [Streams y Programación Funcional](#streams-y-programación-funcional)\n")
        contenido.append("10. [Anotaciones](#anotaciones)\n")
        contenido.append("11. [Pruebas Unitarias](#pruebas-unitarias)\n\n")
        
        # Agrupar preguntas por categoría
        preguntas_por_categoria = {}
        for pregunta in self.preguntas:
            if pregunta.categoria not in preguntas_por_categoria:
                preguntas_por_categoria[pregunta.categoria] = []
            preguntas_por_categoria[pregunta.categoria].append(pregunta)
        
        # Generar contenido por categoría
        for categoria, preguntas in preguntas_por_categoria.items():
            contenido.append(f"## {categoria}\n")
            contenido.append(f"**Total de preguntas: {len(preguntas)}**\n\n")
            
            for pregunta in preguntas[:10]:  # Limitar a 10 preguntas por categoría para el resumen
                contenido.append(f"### Pregunta {pregunta.numero}: {pregunta.pregunta}\n")
                contenido.append(f"**Nivel:** {pregunta.nivel_dificultad}\n\n")
                
                # Opciones
                for i, opcion in enumerate(pregunta.opciones, 1):
                    contenido.append(f"{i}. {opcion}\n")
                contenido.append("\n")
                
                # Respuesta correcta
                contenido.append(f"**Respuesta Correcta:** {pregunta.respuesta_correcta}\n\n")
                
                # Explicación
                contenido.append(f"**Explicación:** {pregunta.explicacion}\n\n")
                
                # Ejemplos de código
                contenido.append("#### Ejemplos de Código\n")
                contenido.append(self.generar_ejemplos_codigo(pregunta))
                contenido.append("\n\n")
                
                # Pruebas unitarias
                contenido.append("#### Pruebas Unitarias\n")
                contenido.append(self.generar_pruebas_unitarias(pregunta))
                contenido.append("\n\n")
                
                contenido.append("---\n\n")
        
        # Guardar archivo
        with open("guia_completa_java.md", "w", encoding="utf-8") as f:
            f.write("".join(contenido))
        
        print("Guía completa generada: guia_completa_java.md")
    
    def generar_archivos_por_categoria(self) -> None:
        """Genera archivos separados por categoría"""
        preguntas_por_categoria = {}
        for pregunta in self.preguntas:
            if pregunta.categoria not in preguntas_por_categoria:
                preguntas_por_categoria[pregunta.categoria] = []
            preguntas_por_categoria[pregunta.categoria].append(pregunta)
        
        for categoria, preguntas in preguntas_por_categoria.items():
            nombre_archivo = f"categoria_{categoria.lower().replace(' ', '_')}.md"
            
            contenido = []
            contenido.append(f"# {categoria} - Preguntas de Entrevista Java\n")
            contenido.append(f"**Total de preguntas: {len(preguntas)}**\n\n")
            
            for pregunta in preguntas:
                contenido.append(f"## Pregunta {pregunta.numero}\n")
                contenido.append(f"**Pregunta:** {pregunta.pregunta}\n")
                contenido.append(f"**Nivel:** {pregunta.nivel_dificultad}\n\n")
                
                # Opciones
                for i, opcion in enumerate(pregunta.opciones, 1):
                    contenido.append(f"{i}. {opcion}\n")
                contenido.append("\n")
                
                # Respuesta correcta
                contenido.append(f"**Respuesta Correcta:** {pregunta.respuesta_correcta}\n\n")
                
                # Explicación
                contenido.append(f"**Explicación:** {pregunta.explicacion}\n\n")
                
                # Ejemplos de código
                contenido.append("### Ejemplos de Código\n")
                contenido.append(self.generar_ejemplos_codigo(pregunta))
                contenido.append("\n\n")
                
                # Pruebas unitarias
                contenido.append("### Pruebas Unitarias\n")
                contenido.append(self.generar_pruebas_unitarias(pregunta))
                contenido.append("\n\n")
                
                contenido.append("---\n\n")
            
            with open(nombre_archivo, "w", encoding="utf-8") as f:
                f.write("".join(contenido))
            
            print(f"Archivo generado: {nombre_archivo}")
    
    def generar_indice(self) -> None:
        """Genera un índice de todas las preguntas"""
        contenido = []
        contenido.append("# Índice de Preguntas de Entrevista Java\n\n")
        
        # Estadísticas generales
        total_preguntas = len(self.preguntas)
        preguntas_por_categoria = {}
        preguntas_por_nivel = {}
        
        for pregunta in self.preguntas:
            # Contar por categoría
            if pregunta.categoria not in preguntas_por_categoria:
                preguntas_por_categoria[pregunta.categoria] = 0
            preguntas_por_categoria[pregunta.categoria] += 1
            
            # Contar por nivel
            if pregunta.nivel_dificultad not in preguntas_por_nivel:
                preguntas_por_nivel[pregunta.nivel_dificultad] = 0
            preguntas_por_nivel[pregunta.nivel_dificultad] += 1
        
        contenido.append("## Estadísticas Generales\n")
        contenido.append(f"- **Total de preguntas:** {total_preguntas}\n")
        contenido.append(f"- **Categorías:** {len(preguntas_por_categoria)}\n")
        contenido.append(f"- **Niveles de dificultad:** {len(preguntas_por_nivel)}\n\n")
        
        contenido.append("### Distribución por Categoría\n")
        for categoria, cantidad in sorted(preguntas_por_categoria.items()):
            porcentaje = (cantidad / total_preguntas) * 100
            contenido.append(f"- **{categoria}:** {cantidad} preguntas ({porcentaje:.1f}%)\n")
        contenido.append("\n")
        
        contenido.append("### Distribución por Nivel de Dificultad\n")
        for nivel, cantidad in sorted(preguntas_por_nivel.items()):
            porcentaje = (cantidad / total_preguntas) * 100
            contenido.append(f"- **{nivel}:** {cantidad} preguntas ({porcentaje:.1f}%)\n")
        contenido.append("\n")
        
        contenido.append("## Lista Completa de Preguntas\n\n")
        
        # Agrupar por categoría
        preguntas_por_categoria = {}
        for pregunta in self.preguntas:
            if pregunta.categoria not in preguntas_por_categoria:
                preguntas_por_categoria[pregunta.categoria] = []
            preguntas_por_categoria[pregunta.categoria].append(pregunta)
        
        for categoria, preguntas in sorted(preguntas_por_categoria.items()):
            contenido.append(f"### {categoria}\n")
            for pregunta in preguntas:
                contenido.append(f"- **{pregunta.numero}.** {pregunta.pregunta} [{pregunta.nivel_dificultad}]\n")
            contenido.append("\n")
        
        with open("indice_preguntas.md", "w", encoding="utf-8") as f:
            f.write("".join(contenido))
        
        print("Índice generado: indice_preguntas.md")

def main():
    """Función principal"""
    archivo_entrada = "../1100_ Java Interview Questions and Answers - Salunke, Manish.txt"
    
    if not os.path.exists(archivo_entrada):
        print(f"Error: No se encontró el archivo {archivo_entrada}")
        return
    
    procesador = ProcesadorPreguntasJava(archivo_entrada)
    procesador.procesar_preguntas()
    
    print("\n¡Procesamiento completado!")
    print("Archivos generados:")
    print("- guia_completa_java.md")
    print("- categoria_*.md (archivos por categoría)")
    print("- indice_preguntas.md")

if __name__ == "__main__":
    main() 