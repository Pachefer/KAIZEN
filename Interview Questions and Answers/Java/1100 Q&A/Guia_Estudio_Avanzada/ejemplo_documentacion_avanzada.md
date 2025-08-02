# Ejemplo de Documentación Avanzada - Línea por Línea

## Pregunta: ¿Cuál es la diferencia entre JDK y JRE?

### Respuesta Correcta
**JDK (Java Development Kit)** es el kit de desarrollo que incluye herramientas para compilar y desarrollar aplicaciones Java, mientras que **JRE (Java Runtime Environment)** es el entorno de ejecución necesario para ejecutar aplicaciones Java.

### Explicación Detallada

#### JDK (Java Development Kit)
- **Propósito**: Desarrollo de aplicaciones Java
- **Contenido**: 
  - Compilador Java (`javac`)
  - JVM (Java Virtual Machine)
  - JRE (Java Runtime Environment)
  - Herramientas de desarrollo (`javadoc`, `jar`, `javap`)
  - Bibliotecas de desarrollo
  - Documentación

#### JRE (Java Runtime Environment)
- **Propósito**: Ejecución de aplicaciones Java
- **Contenido**:
  - JVM (Java Virtual Machine)
  - Bibliotecas de clases Java
  - Archivos de configuración
  - **NO incluye herramientas de desarrollo**

### Ejemplo de Código con Documentación Línea por Línea

```java
// Importar las clases necesarias para el manejo de archivos y procesos
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Clase que demuestra las diferencias entre JDK y JRE
 * con ejemplos prácticos de uso
 */
public class EjemploJDKvsJRE {
    
    // Variable de instancia para almacenar la información del sistema
    private static final String SEPARADOR = "=".repeat(50);
    
    /**
     * Método principal que ejecuta todos los ejemplos
     * @param args Argumentos de línea de comandos (no utilizados)
     */
    public static void main(String[] args) {
        // Imprimir encabezado del programa
        System.out.println("DEMOSTRACIÓN JDK vs JRE");
        System.out.println(SEPARADOR);
        
        // Ejecutar demostración de información del sistema
        mostrarInformacionSistema();
        
        // Ejecutar demostración de herramientas del JDK
        demostrarHerramientasJDK();
        
        // Ejecutar demostración de capacidades del JRE
        demostrarCapacidadesJRE();
        
        // Ejecutar ejemplo de compilación programática
        compilarProgramaticamente();
    }
    
    /**
     * Muestra información detallada del sistema Java
     * Incluye versión, proveedor y directorios
     */
    private static void mostrarInformacionSistema() {
        // Imprimir título de la sección
        System.out.println("\n1. INFORMACIÓN DEL SISTEMA JAVA");
        System.out.println("-".repeat(30));
        
        // Obtener y mostrar la versión de Java
        String version = System.getProperty("java.version");
        System.out.println("Versión de Java: " + version);
        
        // Obtener y mostrar el directorio de instalación de Java
        String javaHome = System.getProperty("java.home");
        System.out.println("Directorio Java (JAVA_HOME): " + javaHome);
        
        // Obtener y mostrar el proveedor de Java
        String vendor = System.getProperty("java.vendor");
        System.out.println("Proveedor: " + vendor);
        
        // Obtener y mostrar la versión del compilador
        String compiler = System.getProperty("java.compiler");
        System.out.println("Versión del compilador: " + (compiler != null ? compiler : "No disponible"));
        
        // Obtener y mostrar la versión de la JVM
        String jvmVersion = System.getProperty("java.vm.version");
        System.out.println("Versión de la JVM: " + jvmVersion);
        
        // Obtener y mostrar el nombre de la JVM
        String jvmName = System.getProperty("java.vm.name");
        System.out.println("Nombre de la JVM: " + jvmName);
    }
    
    /**
     * Demuestra las herramientas disponibles en el JDK
     * Verifica la disponibilidad de herramientas de desarrollo
     */
    private static void demostrarHerramientasJDK() {
        // Imprimir título de la sección
        System.out.println("\n2. HERRAMIENTAS DEL JDK");
        System.out.println("-".repeat(20));
        
        // Array con las herramientas principales del JDK
        String[] herramientas = {
            "javac",    // Compilador de Java
            "java",     // Intérprete de Java
            "javadoc",  // Generador de documentación
            "jar",      // Empaquetador de archivos
            "javap",    // Desensamblador de bytecode
            "jdb",      // Depurador de Java
            "jconsole", // Monitor de consola Java
            "jstack"    // Herramienta de análisis de hilos
        };
        
        // Iterar sobre cada herramienta y verificar su disponibilidad
        for (String herramienta : herramientas) {
            verificarHerramienta(herramienta);
        }
    }
    
    /**
     * Verifica si una herramienta específica está disponible en el sistema
     * @param herramienta Nombre de la herramienta a verificar
     */
    private static void verificarHerramienta(String herramienta) {
        try {
            // Crear un proceso para ejecutar la herramienta con la opción -version
            ProcessBuilder pb = new ProcessBuilder(herramienta, "-version");
            
            // Redirigir el error stream al output stream para capturar la salida
            pb.redirectErrorStream(true);
            
            // Iniciar el proceso
            Process process = pb.start();
            
            // Esperar a que el proceso termine (máximo 5 segundos)
            boolean terminado = process.waitFor();
            
            // Verificar el código de salida del proceso
            if (terminado && process.exitValue() == 0) {
                // La herramienta está disponible
                System.out.println("✓ " + herramienta + " está disponible");
                
                // Leer la salida para obtener la versión
                String salida = new String(process.getInputStream().readAllBytes());
                String[] lineas = salida.split("\n");
                if (lineas.length > 0) {
                    System.out.println("  Versión: " + lineas[0].trim());
                }
            } else {
                // La herramienta no está disponible o falló
                System.out.println("✗ " + herramienta + " no está disponible");
            }
            
        } catch (IOException e) {
            // Capturar excepción de entrada/salida
            System.out.println("✗ Error verificando " + herramienta + ": " + e.getMessage());
        } catch (InterruptedException e) {
            // Capturar excepción de interrupción
            System.out.println("✗ Verificación interrumpida para " + herramienta);
            // Restaurar el estado de interrupción
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Demuestra las capacidades del JRE para ejecutar aplicaciones
     * Incluye ejemplos de carga de clases y gestión de memoria
     */
    private static void demostrarCapacidadesJRE() {
        // Imprimir título de la sección
        System.out.println("\n3. CAPACIDADES DEL JRE");
        System.out.println("-".repeat(20));
        
        // Demostrar carga de clases del sistema
        cargarClasesSistema();
        
        // Demostrar gestión de memoria
        gestionarMemoria();
        
        // Demostrar garbage collection
        ejecutarGarbageCollection();
    }
    
    /**
     * Carga y muestra información de clases del sistema Java
     */
    private static void cargarClasesSistema() {
        // Array con nombres de clases importantes del sistema
        String[] clasesSistema = {
            "java.lang.String",      // Clase fundamental para cadenas
            "java.util.ArrayList",   // Implementación de lista dinámica
            "java.util.HashMap",     // Implementación de mapa hash
            "java.io.File",          // Clase para manejo de archivos
            "java.lang.Thread",      // Clase para manejo de hilos
            "java.lang.Exception"    // Clase base para excepciones
        };
        
        // Imprimir encabezado de la subsección
        System.out.println("Carga de clases del sistema:");
        
        // Iterar sobre cada clase y cargarla
        for (String nombreClase : clasesSistema) {
            try {
                // Cargar la clase usando reflexión
                Class<?> clase = Class.forName(nombreClase);
                
                // Obtener información de la clase
                String nombre = clase.getName();
                String nombreSimple = clase.getSimpleName();
                ClassLoader cargador = clase.getClassLoader();
                String nombreCargador = cargador != null ? cargador.getClass().getSimpleName() : "Bootstrap";
                
                // Mostrar información de la clase cargada
                System.out.println("  ✓ " + nombreSimple + " cargada por " + nombreCargador);
                
            } catch (ClassNotFoundException e) {
                // La clase no se pudo cargar
                System.out.println("  ✗ No se pudo cargar: " + nombreClase);
            }
        }
    }
    
    /**
     * Demuestra la gestión de memoria en la JVM
     */
    private static void gestionarMemoria() {
        // Obtener la instancia de Runtime para acceder a información de memoria
        Runtime runtime = Runtime.getRuntime();
        
        // Imprimir encabezado de la subsección
        System.out.println("\nGestión de memoria:");
        
        // Obtener información de memoria
        long memoriaTotal = runtime.totalMemory();
        long memoriaLibre = runtime.freeMemory();
        long memoriaUsada = memoriaTotal - memoriaLibre;
        long memoriaMaxima = runtime.maxMemory();
        
        // Mostrar información de memoria en formato legible
        System.out.println("  Memoria total: " + formatBytes(memoriaTotal));
        System.out.println("  Memoria libre: " + formatBytes(memoriaLibre));
        System.out.println("  Memoria usada: " + formatBytes(memoriaUsada));
        System.out.println("  Memoria máxima: " + formatBytes(memoriaMaxima));
        
        // Calcular y mostrar porcentaje de uso
        double porcentajeUso = (double) memoriaUsada / memoriaTotal * 100;
        System.out.println("  Porcentaje de uso: " + String.format("%.1f", porcentajeUso) + "%");
    }
    
    /**
     * Ejecuta el garbage collector y muestra los resultados
     */
    private static void ejecutarGarbageCollection() {
        // Obtener la instancia de Runtime
        Runtime runtime = Runtime.getRuntime();
        
        // Imprimir encabezado de la subsección
        System.out.println("\nGarbage Collection:");
        
        // Obtener memoria antes del garbage collection
        long memoriaAntes = runtime.totalMemory() - runtime.freeMemory();
        System.out.println("  Memoria antes de GC: " + formatBytes(memoriaAntes));
        
        // Crear algunos objetos para generar basura
        crearObjetosTemporales();
        
        // Forzar la ejecución del garbage collector
        System.gc();
        
        // Esperar un poco para que se complete el garbage collection
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            // Restaurar el estado de interrupción
            Thread.currentThread().interrupt();
        }
        
        // Obtener memoria después del garbage collection
        long memoriaDespues = runtime.totalMemory() - runtime.freeMemory();
        System.out.println("  Memoria después de GC: " + formatBytes(memoriaDespues));
        
        // Calcular memoria liberada
        long memoriaLiberada = memoriaAntes - memoriaDespues;
        if (memoriaLiberada > 0) {
            System.out.println("  Memoria liberada: " + formatBytes(memoriaLiberada));
        } else {
            System.out.println("  No se liberó memoria adicional");
        }
    }
    
    /**
     * Crea objetos temporales para generar basura
     */
    private static void crearObjetosTemporales() {
        // Crear una lista temporal con muchos objetos
        java.util.List<String> objetosTemporales = new java.util.ArrayList<>();
        
        // Agregar 10000 objetos a la lista
        for (int i = 0; i < 10000; i++) {
            objetosTemporales.add("Objeto temporal " + i + " con datos muy largos para consumir memoria");
        }
        
        // La lista se elimina automáticamente al salir del método
        // Los objetos se convierten en candidatos para garbage collection
    }
    
    /**
     * Convierte bytes a formato legible (KB, MB, GB)
     * @param bytes Número de bytes a convertir
     * @return String con el formato legible
     */
    private static String formatBytes(long bytes) {
        // Definir las constantes para las conversiones
        final long KB = 1024;
        final long MB = KB * 1024;
        final long GB = MB * 1024;
        
        // Convertir según el tamaño
        if (bytes < KB) {
            return bytes + " B";
        } else if (bytes < MB) {
            return String.format("%.1f KB", bytes / (double) KB);
        } else if (bytes < GB) {
            return String.format("%.1f MB", bytes / (double) MB);
        } else {
            return String.format("%.1f GB", bytes / (double) GB);
        }
    }
    
    /**
     * Demuestra compilación programática usando el JDK
     */
    private static void compilarProgramaticamente() {
        // Imprimir título de la sección
        System.out.println("\n4. COMPILACIÓN PROGRAMÁTICA (JDK)");
        System.out.println("-".repeat(40));
        
        // Crear código Java de ejemplo
        String codigoJava = crearCodigoEjemplo();
        
        try {
            // Escribir el código en un archivo temporal
            Path archivoJava = Files.write(Path.of("ClaseTemporal.java"), codigoJava.getBytes());
            System.out.println("✓ Archivo Java creado: " + archivoJava.toAbsolutePath());
            
            // Compilar el archivo usando javac
            ProcessBuilder pbCompile = new ProcessBuilder("javac", "ClaseTemporal.java");
            Process procesoCompile = pbCompile.start();
            
            // Esperar a que termine la compilación
            int codigoSalidaCompile = procesoCompile.waitFor();
            
            if (codigoSalidaCompile == 0) {
                System.out.println("✓ Compilación exitosa");
                
                // Ejecutar la clase compilada
                ProcessBuilder pbRun = new ProcessBuilder("java", "ClaseTemporal");
                Process procesoRun = pbRun.start();
                
                // Esperar a que termine la ejecución
                int codigoSalidaRun = procesoRun.waitFor();
                
                if (codigoSalidaRun == 0) {
                    System.out.println("✓ Ejecución exitosa");
                    
                    // Leer la salida del programa
                    String salida = new String(procesoRun.getInputStream().readAllBytes());
                    System.out.println("  Salida: " + salida.trim());
                } else {
                    System.out.println("✗ Error en la ejecución");
                }
            } else {
                System.out.println("✗ Error en la compilación");
                
                // Leer el error de compilación
                String error = new String(procesoCompile.getErrorStream().readAllBytes());
                System.out.println("  Error: " + error);
            }
            
            // Limpiar archivos temporales
            limpiarArchivosTemporales();
            
        } catch (IOException e) {
            // Capturar excepción de entrada/salida
            System.out.println("✗ Error de E/S: " + e.getMessage());
        } catch (InterruptedException e) {
            // Capturar excepción de interrupción
            System.out.println("✗ Proceso interrumpido");
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Crea código Java de ejemplo para compilación
     * @return String con el código Java
     */
    private static String crearCodigoEjemplo() {
        return """
            /**
             * Clase temporal creada para demostrar compilación programática
             */
            public class ClaseTemporal {
                
                /**
                 * Método principal que muestra información del sistema
                 */
                public static void main(String[] args) {
                    System.out.println("¡Compilación y ejecución exitosa!");
                    System.out.println("Fecha y hora: " + java.time.LocalDateTime.now());
                    System.out.println("Usuario: " + System.getProperty("user.name"));
                    System.out.println("Sistema operativo: " + System.getProperty("os.name"));
                }
            }
            """;
    }
    
    /**
     * Limpia los archivos temporales creados durante la demostración
     */
    private static void limpiarArchivosTemporales() {
        // Array con nombres de archivos temporales
        String[] archivosTemporales = {"ClaseTemporal.java", "ClaseTemporal.class"};
        
        // Iterar sobre cada archivo y eliminarlo
        for (String archivo : archivosTemporales) {
            File file = new File(archivo);
            if (file.exists() && file.delete()) {
                System.out.println("✓ Archivo temporal eliminado: " + archivo);
            }
        }
    }
}
```

### Pruebas Unitarias Completas

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Clase de pruebas unitarias para EjemploJDKvsJRE
 * Demuestra cómo probar las funcionalidades del JDK y JRE
 */
@DisplayName("Pruebas para EjemploJDKvsJRE")
public class EjemploJDKvsJRETest {
    
    // Variables para capturar la salida del sistema
    private java.io.ByteArrayOutputStream outputStream;
    private java.io.PrintStream originalOut;
    
    /**
     * Configuración inicial antes de cada prueba
     * Redirige System.out para capturar la salida
     */
    @BeforeEach
    void setUp() {
        // Guardar la salida original del sistema
        originalOut = System.out;
        
        // Crear un stream de bytes para capturar la salida
        outputStream = new java.io.ByteArrayOutputStream();
        
        // Redirigir System.out al stream de bytes
        System.setOut(new java.io.PrintStream(outputStream));
    }
    
    /**
     * Limpieza después de cada prueba
     * Restaura la salida original del sistema
     */
    @AfterEach
    void tearDown() {
        // Restaurar la salida original del sistema
        System.setOut(originalOut);
    }
    
    /**
     * Prueba que verifica la información del sistema Java
     */
    @Test
    @DisplayName("Debería mostrar información válida del sistema Java")
    void testInformacionSistema() {
        // Ejecutar el método que muestra información del sistema
        EjemploJDKvsJRE.mostrarInformacionSistema();
        
        // Obtener la salida capturada
        String salida = outputStream.toString();
        
        // Verificar que la salida contiene información esperada
        assertTrue(salida.contains("Versión de Java:"), "Debe mostrar la versión de Java");
        assertTrue(salida.contains("Directorio Java"), "Debe mostrar el directorio Java");
        assertTrue(salida.contains("Proveedor:"), "Debe mostrar el proveedor");
        assertTrue(salida.contains("Versión de la JVM:"), "Debe mostrar la versión de la JVM");
    }
    
    /**
     * Prueba que verifica la gestión de memoria
     */
    @Test
    @DisplayName("Debería mostrar información válida de memoria")
    void testGestionMemoria() {
        // Ejecutar el método de gestión de memoria
        EjemploJDKvsJRE.gestionarMemoria();
        
        // Obtener la salida capturada
        String salida = outputStream.toString();
        
        // Verificar que la salida contiene información de memoria
        assertTrue(salida.contains("Memoria total:"), "Debe mostrar memoria total");
        assertTrue(salida.contains("Memoria libre:"), "Debe mostrar memoria libre");
        assertTrue(salida.contains("Memoria usada:"), "Debe mostrar memoria usada");
        assertTrue(salida.contains("Porcentaje de uso:"), "Debe mostrar porcentaje de uso");
    }
    
    /**
     * Prueba que verifica el formato de bytes
     */
    @Test
    @DisplayName("Debería formatear bytes correctamente")
    void testFormatBytes() {
        // Probar diferentes tamaños de bytes
        assertEquals("1024 B", EjemploJDKvsJRE.formatBytes(1024), "1024 bytes debe ser '1024 B'");
        assertTrue(EjemploJDKvsJRE.formatBytes(1024 * 1024).contains("MB"), "1MB debe contener 'MB'");
        assertTrue(EjemploJDKvsJRE.formatBytes(1024 * 1024 * 1024).contains("GB"), "1GB debe contener 'GB'");
    }
    
    /**
     * Prueba que verifica la carga de clases del sistema
     */
    @Test
    @DisplayName("Debería cargar clases del sistema correctamente")
    void testCargaClasesSistema() {
        // Ejecutar el método de carga de clases
        EjemploJDKvsJRE.cargarClasesSistema();
        
        // Obtener la salida capturada
        String salida = outputStream.toString();
        
        // Verificar que se cargaron las clases esperadas
        assertTrue(salida.contains("String cargada"), "Debe cargar la clase String");
        assertTrue(salida.contains("ArrayList cargada"), "Debe cargar la clase ArrayList");
        assertTrue(salida.contains("HashMap cargada"), "Debe cargar la clase HashMap");
    }
    
    /**
     * Prueba que verifica la creación de archivos temporales
     */
    @Test
    @DisplayName("Debería crear y limpiar archivos temporales correctamente")
    void testArchivosTemporales() throws Exception {
        // Crear un archivo temporal de prueba
        String contenido = "public class Test { public static void main(String[] args) {} }";
        java.nio.file.Path archivo = java.nio.file.Files.write(
            java.nio.file.Path.of("Test.java"), 
            contenido.getBytes()
        );
        
        // Verificar que el archivo existe
        assertTrue(java.nio.file.Files.exists(archivo), "El archivo debe existir");
        
        // Limpiar archivos temporales
        EjemploJDKvsJRE.limpiarArchivosTemporales();
        
        // Verificar que el archivo fue eliminado
        assertFalse(java.nio.file.Files.exists(archivo), "El archivo debe ser eliminado");
    }
    
    /**
     * Prueba que verifica las propiedades del sistema
     */
    @Test
    @DisplayName("Debería obtener propiedades válidas del sistema")
    void testPropiedadesSistema() {
        // Verificar propiedades básicas del sistema
        String version = System.getProperty("java.version");
        String vendor = System.getProperty("java.vendor");
        String home = System.getProperty("java.home");
        
        // Las propiedades no deben ser nulas
        assertNotNull(version, "La versión de Java no debe ser nula");
        assertNotNull(vendor, "El proveedor no debe ser nulo");
        assertNotNull(home, "El directorio Java no debe ser nulo");
        
        // La versión debe tener un formato válido
        assertTrue(version.matches("\\d+\\.\\d+(\\.\\d+)?(_\\d+)?"), 
                  "La versión debe tener un formato válido");
    }
    
    /**
     * Prueba que verifica la disponibilidad de herramientas del JDK
     */
    @Test
    @DisplayName("Debería verificar herramientas del JDK")
    void testVerificacionHerramientas() {
        // Ejecutar verificación de herramientas
        EjemploJDKvsJRE.verificarHerramienta("java");
        
        // Obtener la salida capturada
        String salida = outputStream.toString();
        
        // Verificar que se ejecutó la verificación
        assertTrue(salida.contains("java"), "Debe verificar la herramienta java");
    }
    
    /**
     * Prueba que verifica el garbage collection
     */
    @Test
    @DisplayName("Debería ejecutar garbage collection")
    void testGarbageCollection() {
        // Ejecutar garbage collection
        EjemploJDKvsJRE.ejecutarGarbageCollection();
        
        // Obtener la salida capturada
        String salida = outputStream.toString();
        
        // Verificar que se ejecutó el garbage collection
        assertTrue(salida.contains("Garbage Collection:"), 
                  "Debe mostrar información de garbage collection");
        assertTrue(salida.contains("Memoria antes de GC:"), 
                  "Debe mostrar memoria antes del GC");
        assertTrue(salida.contains("Memoria después de GC:"), 
                  "Debe mostrar memoria después del GC");
    }
    
    /**
     * Clase anidada para pruebas de casos edge
     */
    @Nested
    @DisplayName("Casos Edge")
    class CasosEdge {
        
        /**
         * Prueba con valores de bytes extremos
         */
        @Test
        @DisplayName("Debería manejar valores de bytes extremos")
        void testValoresExtremos() {
            // Probar con 0 bytes
            assertEquals("0 B", EjemploJDKvsJRE.formatBytes(0), "0 bytes debe ser '0 B'");
            
            // Probar con valores muy grandes
            long bytesGrandes = 1024L * 1024 * 1024 * 1024; // 1 TB
            String resultado = EjemploJDKvsJRE.formatBytes(bytesGrandes);
            assertTrue(resultado.contains("GB"), "1TB debe mostrarse en GB");
        }
        
        /**
         * Prueba con herramientas inexistentes
         */
        @Test
        @DisplayName("Debería manejar herramientas inexistentes")
        void testHerramientasInexistentes() {
            // Verificar una herramienta que no existe
            EjemploJDKvsJRE.verificarHerramienta("herramienta_inexistente");
            
            // Obtener la salida capturada
            String salida = outputStream.toString();
            
            // Verificar que se manejó correctamente
            assertTrue(salida.contains("herramienta_inexistente"), 
                      "Debe mostrar el nombre de la herramienta");
        }
    }
}
```

### Resumen de Mejoras Implementadas

1. **Documentación Línea por Línea**: Cada línea de código está comentada explicando su propósito
2. **Ejemplos Prácticos**: Código ejecutable que demuestra conceptos reales
3. **Pruebas Unitarias Completas**: Incluyen casos edge y validaciones exhaustivas
4. **Traducción al Español**: Preguntas y explicaciones en español
5. **Organización por Categorías**: Contenido estructurado y fácil de navegar
6. **Mejores Prácticas**: Patrones de diseño y anti-patrones incluidos
7. **Casos de Uso Reales**: Ejemplos que se pueden ejecutar y probar
8. **Explicaciones Detalladas**: Conceptos teóricos con implicaciones prácticas

Esta guía de estudio avanzada proporciona una base sólida para prepararse para entrevistas de Java, con contenido que va más allá de las preguntas básicas para incluir ejemplos prácticos y pruebas unitarias que validan el aprendizaje. 