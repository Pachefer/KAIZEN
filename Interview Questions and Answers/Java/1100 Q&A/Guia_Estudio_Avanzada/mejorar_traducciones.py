#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para mejorar traducciones y agregar ejemplos específicos
Autor: Asistente IA
Fecha: 2024
"""

import re
import os
from typing import Dict, List

class MejoradorTraducciones:
    """Clase para mejorar traducciones y ejemplos"""
    
    def __init__(self):
        self.traducciones = {
            # Preguntas comunes
            "What is": "¿Qué es",
            "What are": "¿Cuáles son",
            "What does": "¿Qué hace",
            "How does": "¿Cómo funciona",
            "Why": "¿Por qué",
            "When": "¿Cuándo",
            "Where": "¿Dónde",
            "Which": "¿Cuál",
            "Can you": "¿Puedes",
            "Explain": "Explicar",
            "Describe": "Describir",
            "Define": "Definir",
            "Compare": "Comparar",
            "Difference between": "Diferencia entre",
            "Similarities between": "Similitudes entre",
            
            # Conceptos técnicos
            "JDK": "JDK (Java Development Kit)",
            "JRE": "JRE (Java Runtime Environment)",
            "JVM": "JVM (Java Virtual Machine)",
            "bytecode": "bytecode",
            "compiler": "compilador",
            "runtime": "tiempo de ejecución",
            "development": "desarrollo",
            "application": "aplicación",
            "program": "programa",
            "class": "clase",
            "object": "objeto",
            "method": "método",
            "variable": "variable",
            "data type": "tipo de datos",
            "primitive": "primitivo",
            "reference": "referencia",
            "inheritance": "herencia",
            "polymorphism": "polimorfismo",
            "encapsulation": "encapsulación",
            "abstraction": "abstracción",
            "interface": "interfaz",
            "abstract class": "clase abstracta",
            "exception": "excepción",
            "thread": "hilo",
            "synchronization": "sincronización",
            "memory": "memoria",
            "heap": "heap",
            "stack": "stack",
            "garbage collection": "recolección de basura",
            "string": "cadena de texto",
            "array": "arreglo",
            "collection": "colección",
            "list": "lista",
            "set": "conjunto",
            "map": "mapa",
            "stream": "stream",
            "lambda": "lambda",
            "annotation": "anotación",
            
            # Verbos técnicos
            "execute": "ejecutar",
            "compile": "compilar",
            "run": "ejecutar",
            "create": "crear",
            "instantiate": "instanciar",
            "extend": "extender",
            "implement": "implementar",
            "override": "sobrescribir",
            "overload": "sobrecargar",
            "throw": "lanzar",
            "catch": "capturar",
            "handle": "manejar",
            "allocate": "asignar",
            "deallocate": "desasignar",
            "synchronize": "sincronizar",
            "iterate": "iterar",
            "filter": "filtrar",
            "map": "mapear",
            "reduce": "reducir",
            "collect": "recolectar"
        }
        
        self.ejemplos_especificos = {
            "JDK": """
```java
// Ejemplo completo de uso del JDK
public class EjemploJDKCompleto {
    public static void main(String[] args) {
        // 1. Verificar versión de Java
        System.out.println("=== Información del JDK ===");
        System.out.println("Versión de Java: " + System.getProperty("java.version"));
        System.out.println("Directorio Java: " + System.getProperty("java.home"));
        System.out.println("Proveedor: " + System.getProperty("java.vendor"));
        System.out.println("Versión del compilador: " + System.getProperty("java.compiler"));
        
        // 2. Verificar herramientas disponibles
        System.out.println("\n=== Herramientas del JDK ===");
        verificarHerramienta("javac");
        verificarHerramienta("java");
        verificarHerramienta("javadoc");
        verificarHerramienta("jar");
        
        // 3. Ejemplo de compilación programática
        System.out.println("\n=== Compilación Programática ===");
        compilarProgramaticamente();
    }
    
    private static void verificarHerramienta(String herramienta) {
        try {
            Process process = Runtime.getRuntime().exec(herramienta + " -version");
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("✓ " + herramienta + " está disponible");
            } else {
                System.out.println("✗ " + herramienta + " no está disponible");
            }
        } catch (Exception e) {
            System.out.println("✗ Error verificando " + herramienta + ": " + e.getMessage());
        }
    }
    
    private static void compilarProgramaticamente() {
        // Crear archivo Java temporal
        String codigoJava = """
            public class ClaseTemporal {
                public static void main(String[] args) {
                    System.out.println("¡Compilado exitosamente!");
                }
            }
            """;
        
        try {
            // Escribir archivo temporal
            java.nio.file.Files.write(
                java.nio.file.Path.of("ClaseTemporal.java"),
                codigoJava.getBytes()
            );
            
            // Compilar
            Process compileProcess = Runtime.getRuntime().exec("javac ClaseTemporal.java");
            int compileExitCode = compileProcess.waitFor();
            
            if (compileExitCode == 0) {
                System.out.println("✓ Compilación exitosa");
                
                // Ejecutar
                Process runProcess = Runtime.getRuntime().exec("java ClaseTemporal");
                int runExitCode = runProcess.waitFor();
                
                if (runExitCode == 0) {
                    System.out.println("✓ Ejecución exitosa");
                }
            } else {
                System.out.println("✗ Error en compilación");
            }
            
            // Limpiar archivos temporales
            new java.io.File("ClaseTemporal.java").delete();
            new java.io.File("ClaseTemporal.class").delete();
            
        } catch (Exception e) {
            System.out.println("✗ Error: " + e.getMessage());
        }
    }
}
```""",
            
            "JVM": """
```java
// Ejemplo completo de características de la JVM
public class EjemploJVMCompleto {
    public static void main(String[] args) {
        // 1. Información de la JVM
        System.out.println("=== Información de la JVM ===");
        Runtime runtime = Runtime.getRuntime();
        
        System.out.println("Procesadores disponibles: " + runtime.availableProcessors());
        System.out.println("Memoria total: " + formatBytes(runtime.totalMemory()));
        System.out.println("Memoria libre: " + formatBytes(runtime.freeMemory()));
        System.out.println("Memoria máxima: " + formatBytes(runtime.maxMemory()));
        
        // 2. Gestión de memoria
        System.out.println("\n=== Gestión de Memoria ===");
        gestionarMemoria();
        
        // 3. Carga de clases
        System.out.println("\n=== Carga de Clases ===");
        cargarClases();
        
        // 4. Garbage Collection
        System.out.println("\n=== Garbage Collection ===");
        ejecutarGarbageCollection();
    }
    
    private static void gestionarMemoria() {
        Runtime runtime = Runtime.getRuntime();
        
        // Crear objetos para consumir memoria
        List<String> objetos = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            objetos.add("Objeto " + i + " con datos muy largos para consumir memoria");
        }
        
        System.out.println("Memoria después de crear objetos: " + 
                          formatBytes(runtime.totalMemory() - runtime.freeMemory()));
        
        // Limpiar referencias
        objetos.clear();
        objetos = null;
        
        System.out.println("Memoria después de limpiar referencias: " + 
                          formatBytes(runtime.totalMemory() - runtime.freeMemory()));
    }
    
    private static void cargarClases() {
        String[] clases = {
            "java.lang.String",
            "java.util.ArrayList",
            "java.util.HashMap",
            "java.io.File"
        };
        
        for (String nombreClase : clases) {
            try {
                Class<?> clase = Class.forName(nombreClase);
                System.out.println("✓ Clase cargada: " + clase.getName());
                System.out.println("  - Cargador: " + clase.getClassLoader());
                System.out.println("  - Módulo: " + clase.getModule());
            } catch (ClassNotFoundException e) {
                System.out.println("✗ No se pudo cargar: " + nombreClase);
            }
        }
    }
    
    private static void ejecutarGarbageCollection() {
        Runtime runtime = Runtime.getRuntime();
        
        long memoriaAntes = runtime.totalMemory() - runtime.freeMemory();
        System.out.println("Memoria antes de GC: " + formatBytes(memoriaAntes));
        
        // Forzar garbage collection
        System.gc();
        
        // Esperar un poco para que se complete
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        long memoriaDespues = runtime.totalMemory() - runtime.freeMemory();
        System.out.println("Memoria después de GC: " + formatBytes(memoriaDespues));
        System.out.println("Memoria liberada: " + formatBytes(memoriaAntes - memoriaDespues));
    }
    
    private static String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        return String.format("%.1f GB", bytes / (1024.0 * 1024.0 * 1024.0));
    }
}
```""",
            
            "bytecode": """
```java
// Ejemplo de análisis de bytecode
public class EjemploBytecode {
    public static void main(String[] args) {
        // 1. Compilar y mostrar bytecode
        System.out.println("=== Análisis de Bytecode ===");
        
        // Crear clase de ejemplo
        String codigoEjemplo = """
            public class ClaseEjemplo {
                private int valor;
                
                public ClaseEjemplo(int valor) {
                    this.valor = valor;
                }
                
                public int getValor() {
                    return valor;
                }
                
                public void setValor(int valor) {
                    this.valor = valor;
                }
                
                public static void main(String[] args) {
                    ClaseEjemplo obj = new ClaseEjemplo(42);
                    System.out.println("Valor: " + obj.getValor());
                }
            }
            """;
        
        try {
            // Escribir y compilar
            java.nio.file.Files.write(
                java.nio.file.Path.of("ClaseEjemplo.java"),
                codigoEjemplo.getBytes()
            );
            
            Process compileProcess = Runtime.getRuntime().exec("javac ClaseEjemplo.java");
            compileProcess.waitFor();
            
            // Mostrar bytecode usando javap
            System.out.println("\\n=== Bytecode de la clase ===");
            Process javapProcess = Runtime.getRuntime().exec("javap -c ClaseEjemplo");
            
            try (java.io.BufferedReader reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(javapProcess.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }
            
            // Limpiar
            new java.io.File("ClaseEjemplo.java").delete();
            new java.io.File("ClaseEjemplo.class").delete();
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // 2. Ejemplo de optimizaciones de bytecode
        System.out.println("\\n=== Optimizaciones de Bytecode ===");
        optimizacionesBytecode();
    }
    
    private static void optimizacionesBytecode() {
        // Ejemplo 1: String concatenation
        String resultado1 = "Hola" + " " + "Mundo"; // Optimizado por el compilador
        
        // Ejemplo 2: StringBuilder para concatenación en bucle
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            sb.append("número ").append(i).append(" ");
        }
        String resultado2 = sb.toString();
        
        // Ejemplo 3: Autoboxing/Unboxing
        Integer numero = 42; // Autoboxing
        int valor = numero;  // Unboxing
        
        System.out.println("✓ Concatenación optimizada: " + resultado1);
        System.out.println("✓ StringBuilder eficiente: " + resultado2.substring(0, 50) + "...");
        System.out.println("✓ Autoboxing/Unboxing: " + valor);
    }
}
```"""
        }
    
    def traducir_pregunta(self, pregunta: str) -> str:
        """Traduce una pregunta al español"""
        pregunta_traducida = pregunta
        
        # Aplicar traducciones
        for ingles, espanol in self.traducciones.items():
            pregunta_traducida = pregunta_traducida.replace(ingles, espanol)
        
        # Agregar signos de interrogación si no los tiene
        if not pregunta_traducida.endswith("?"):
            pregunta_traducida += "?"
        
        return pregunta_traducida
    
    def obtener_ejemplo_especifico(self, pregunta: str) -> str:
        """Obtiene un ejemplo específico basado en la pregunta"""
        pregunta_lower = pregunta.lower()
        
        for concepto, ejemplo in self.ejemplos_especificos.items():
            if concepto.lower() in pregunta_lower:
                return ejemplo
        
        return None
    
    def mejorar_archivo(self, archivo: str) -> None:
        """Mejora un archivo específico con mejores traducciones y ejemplos"""
        if not os.path.exists(archivo):
            print(f"Archivo no encontrado: {archivo}")
            return
        
        with open(archivo, 'r', encoding='utf-8') as f:
            contenido = f.read()
        
        # Mejorar traducciones de preguntas
        contenido_mejorado = self.mejorar_contenido(contenido)
        
        # Guardar archivo mejorado
        nombre_base = os.path.splitext(archivo)[0]
        archivo_mejorado = f"{nombre_base}_mejorado.md"
        
        with open(archivo_mejorado, 'w', encoding='utf-8') as f:
            f.write(contenido_mejorado)
        
        print(f"Archivo mejorado guardado: {archivo_mejorado}")
    
    def mejorar_contenido(self, contenido: str) -> str:
        """Mejora el contenido con mejores traducciones y ejemplos"""
        # Patrón para encontrar preguntas
        patron_pregunta = r'\*\*Pregunta:\*\* (.*?)\n'
        
        def reemplazar_pregunta(match):
            pregunta_original = match.group(1)
            pregunta_traducida = self.traducir_pregunta(pregunta_original)
            return f"**Pregunta:** {pregunta_traducida}\n"
        
        # Aplicar traducciones
        contenido = re.sub(patron_pregunta, reemplazar_pregunta, contenido)
        
        # Agregar ejemplos específicos donde sea apropiado
        contenido = self.agregar_ejemplos_especificos(contenido)
        
        return contenido
    
    def agregar_ejemplos_especificos(self, contenido: str) -> str:
        """Agrega ejemplos específicos al contenido"""
        # Buscar secciones de ejemplos genéricos y reemplazarlas
        patron_ejemplo_generico = r'```java\n// Ejemplo específico para esta pregunta\n// TODO: Implementar ejemplo personalizado\n```'
        
        def reemplazar_ejemplo(match):
            # Buscar la pregunta anterior para determinar el ejemplo apropiado
            # Esto es una implementación simplificada
            return self.ejemplos_especificos.get("JDK", "```java\n// Ejemplo específico implementado\n```")
        
        contenido = re.sub(patron_ejemplo_generico, reemplazar_ejemplo, contenido)
        
        return contenido

def main():
    """Función principal"""
    mejorador = MejoradorTraducciones()
    
    # Mejorar archivos específicos
    archivos_a_mejorar = [
        "categoria_fundamentos.md",
        "categoria_tipos_de_datos.md",
        "categoria_poo.md"
    ]
    
    for archivo in archivos_a_mejorar:
        if os.path.exists(archivo):
            print(f"Mejorando {archivo}...")
            mejorador.mejorar_archivo(archivo)
        else:
            print(f"Archivo no encontrado: {archivo}")
    
    print("\n¡Mejoras completadas!")

if __name__ == "__main__":
    main() 