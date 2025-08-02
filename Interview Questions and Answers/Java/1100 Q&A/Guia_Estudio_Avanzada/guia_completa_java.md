# Guía de Estudio Avanzada: 1100+ Preguntas de Entrevista Java
## Índice
1. [Fundamentos de Java](#fundamentos-de-java)
2. [Tipos de Datos](#tipos-de-datos)
3. [Programación Orientada a Objetos](#programación-orientada-a-objetos)
4. [Gestión de Memoria](#gestión-de-memoria)
5. [Strings](#strings)
6. [Colecciones](#colecciones)
7. [Excepciones](#excepciones)
8. [Hilos y Concurrencia](#hilos-y-concurrencia)
9. [Streams y Programación Funcional](#streams-y-programación-funcional)
10. [Anotaciones](#anotaciones)
11. [Pruebas Unitarias](#pruebas-unitarias)

## Fundamentos
**Total de preguntas: 65**

### Pregunta 1: What is the difference between JDK and JRE?
**Nivel:** Intermedio

1. JDK is the development kit and JRE is the runtime environment.
2. JRE is the development kit and JDK is the runtime environment.
3. Both JDK and JRE are the same.

**Respuesta Correcta:** 1

**Explicación:** JDK (Java Development Kit) is a collection of tools and libraries used for developing Java applications, while JRE (Java Runtime Environment) is a software platform that provides the necessary runtime environment to run Java applications.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 2: What is Java Virtual Machine (JVM)?
**Nivel:** Básico

1. A hardware machine that runs Java programs.
2. An abstract computing machine that runs Java bytecode.
3. A software platform that runs Java applications.

**Respuesta Correcta:** 2

**Explicación:** JVM is an abstract computing machine that executes Java bytecode. It is responsible for managing memory, executing instructions, and providing security.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 3: What are the different types of memory areas allocated by JVM?
**Nivel:** Básico

1. Stack
2. Heap
3. Method Area
4. Program Counter

**Respuesta Correcta:** 1, 2

**Explicación:** JVM allocates memory to several areas such as Stack, Heap, Method Area, and Program Counter. Stack is used to store method invocations and local variables, while Heap is used to store objects and instance variables. Method Area stores class-level information, and Program Counter stores the current location of the instruction being executed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 4: What is JIT compiler?
**Nivel:** Básico

1. A compiler that compiles Java code into machine code.
2. A compiler that compiles Java code into bytecode.
3. A compiler that compiles bytecode into machine code during runtime.

**Respuesta Correcta:** 3

**Explicación:** JIT (Just-In-Time) compiler is a compiler that compiles bytecode into machine code during runtime. This allows for faster execution of Java code as the bytecode is compiled when it is needed, rather than ahead of time.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 6: Why people say that Java is 'write once and run anywhere' language?
**Nivel:** Intermedio

1. Java is platform-independent.
2. Java is platform-dependent.
3. Java is both platform-independent and platform-dependent.

**Respuesta Correcta:** 1

**Explicación:** Java is platform-independent, meaning the same Java code can run on different platforms without any modification. This is due to the fact that Java code is compiled into bytecode, which can run on any device with a Java Virtual Machine installed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 13: What is the purpose of the Java Development Kit (JDK)?
**Nivel:** Básico

1. The JDK provides a complete set of tools for developing Java applications.
2. The JDK provides a runtime environment to run Java applications.
3. The JDK provides both a development environment and a runtime environment for Java applications.

**Respuesta Correcta:** 1

**Explicación:** The Java Development Kit (JDK) is a collection of tools and libraries used for developing Java applications. It includes the Java compiler, the Java Virtual Machine (JVM), and other tools needed to develop, debug, and run Java applications.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 14: What is the role of the JRE in the Java environment?
**Nivel:** Básico

1. The JRE provides a runtime environment to run Java applications.
2. The JRE provides a development environment to develop Java applications.
3. The JRE provides both a runtime environment and a development environment for Java applications.

**Respuesta Correcta:** 1

**Explicación:** The Java Runtime Environment (JRE) is a software platform that provides the necessary runtime environment to run Java applications. It includes the Java Virtual Machine (JVM), the Java class libraries, and other files needed to run Java applications.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 16: What is the purpose of the JIT compiler in the JVM?
**Nivel:** Básico

1. To compile bytecode into machine code during runtime.
2. To compile bytecode into machine code ahead of time.
3. To compile machine code into bytecode during runtime.

**Respuesta Correcta:** 1

**Explicación:** The purpose of the JIT (Just-In-Time) compiler in the JVM is to compile bytecode into machine code during runtime. This allows for faster execution of Java code as the bytecode is compiled when it is needed, rather than ahead of time.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 17: Can you explain the difference between platform independence and platform-specific code in Java?
**Nivel:** Intermedio

1. Platform-independent code can run on any platform, while platform-specific code can only run on a specific platform.
2. Platform-independent code can only run on a specific platform, while platform-specific code can run on any platform.
3. Both platform-independent code and platform-specific code can only run on a specific platform.

**Respuesta Correcta:** 1

**Explicación:** Platform-independent code can run on any platform, while platform-specific code can only run on a specific platform. Java is a platform-independent language, meaning the same Java code can run on different platforms without any modification. This is due to the fact that Java code is compiled into bytecode, which can run on any device with a Java Virtual Machine installed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

### Pregunta 19: Can you explain the process of class loading in Java and the responsibilities of the ClassLoader class?
**Nivel:** Básico

1. ClassLoader is responsible for finding and loading class files dynamically as they are needed by the application.
2. ClassLoader is responsible for finding and loading class files ahead of time.
3. ClassLoader is not responsible for finding and loading class files.

**Respuesta Correcta:** 1

**Explicación:** Class loading in Java is the process of finding and loading class files into the JVM. The ClassLoader class is responsible for finding and loading class files dynamically as they are needed by the application. It is also responsible for maintaining a cache of classes that have been loaded, so that they do not need to be loaded again.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias

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
        assertTrue(version.matches("\d+\.\d+\.\d+"));
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
```

---

## General
**Total de preguntas: 147**

### Pregunta 5: How Java platform is different from other platforms?
**Nivel:** Intermedio

1. Java platform is a software-based platform.
2. Java platform is a hardware-based platform.
3. Java platform is both software and hardware based.

**Respuesta Correcta:** 1

**Explicación:** Java platform is a software-based platform, meaning it runs on top of an operating system and hardware. This allows Java applications to run on any device with a Java Virtual Machine installed, making it highly portable.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 10: In Java, if we do not specify any value for local variables, then what will be the default value of the local variables?
**Nivel:** Básico

1. 0
2. nan
3. undefined

**Respuesta Correcta:** 2

**Explicación:** In Java, if we do not specify a value for a local variable, its default value is null. Local variables in Java must be initialized before they can be used.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 20: What are the implications of not specifying a value for local variables in Java?
**Nivel:** Básico

1. Local variables must be initialized before they can be used.
2. Local variables do not need to be initialized before they can be used.
3. Local variables are automatically initialized to 0.

**Respuesta Correcta:** 1

**Explicación:** In Java, local variables must be initialized before they can be used. If a value is not specified for a local variable, the code will not compile and an error will be generated.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 37: What is method overriding in Java?
**Nivel:** Básico

1. Method overriding is the ability of a subclass to provide a different implementation for a method that is already defined in its superclass.
2. Method overriding is the inability of a subclass to provide a different implementation for a method that is already defined in its superclass.
3. Method overriding is the ability of a subclass to provide the same implementation for a method that is already defined in its superclass.

**Respuesta Correcta:** 1

**Explicación:** nan

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 76: How will you implement method overloading in Java?
**Nivel:** Intermedio

1. By defining multiple methods with the same name but different parameters.
2. By defining a single method with different implementations for different parameters.
3. By defining a single method with different return types for different parameters.

**Respuesta Correcta:** 1

**Explicación:** Method overloading in Java is implemented by defining multiple methods with the same name but different parameters. This allows for multiple methods with the same name to be called with different arguments, and the correct method to be called is determined based on the arguments passed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 77: What kinds of argument variations are allowed in Method Overloading?
**Nivel:** Básico

1. Number of arguments.
2. Data type of arguments.
3. Order of arguments.
4. All of the above.

**Respuesta Correcta:** 4

**Explicación:** In Java, method overloading can be achieved by varying the number of arguments, the data type of the arguments, or the order of the arguments. This allows for multiple methods with the same name to be called with different arguments, and the correct method to be called is determined based on the arguments passed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 78: Why it is not possible to do method overloading by changing return type of method in java?
**Nivel:** Intermedio

1. Because it can lead to ambiguity and confusion.
2. Because the return type is not considered in method overloading.
3. Because it is not supported by the Java language.

**Respuesta Correcta:** 1

**Explicación:** It is not possible to do method overloading by changing the return type of a method in Java because it can lead to ambiguity and confusion. The Java language considers only the method name and the number, types, and order of the parameters when determining which method to call.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 140: How can you change the value of a final variable in Java?
**Nivel:** Intermedio

1. You cannot change the value of a final variable in Java once it has been assigned.
2. By re-assigning the value to the final variable.
3. By using a setter method.

**Respuesta Correcta:** 1

**Explicación:** You cannot change the value of a final variable in Java once it has been assigned. A final variable is a constant that cannot be changed after it has been assigned a value.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 147: Is it allowed to declare main method as final?
**Nivel:** Intermedio

1. Yes
2. No
3. It depends

**Respuesta Correcta:** 1

**Explicación:** Yes, it is allowed to declare the main method as final in Java. However, declaring the main method as final will not change its behavior, as the main method is not meant to be overridden.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 148: What is the difference between a final variable and a constant in Java?
**Nivel:** Intermedio

1. A final variable is a variable that cannot be changed after it has been assigned a value, while a constant is a variable that has a value that cannot be changed.
2. A constant is a variable that cannot be changed after it has been assigned a value, while a final variable is a variable that has a value that can be changed.
3. There is no difference between a final variable and a constant in Java.

**Respuesta Correcta:** 1

**Explicación:** A final variable is a variable that cannot be changed after it has been assigned a value, while a constant is a variable that has a value that cannot be changed. Constants in Java are typically declared using the final keyword and all uppercase letters to indicate that their value should not change.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## POO
**Total de preguntas: 305**

### Pregunta 7: How does ClassLoader work in Java?
**Nivel:** Intermedio

1. ClassLoader loads classes from the file system when the application starts.
2. ClassLoader loads classes dynamically as they are needed by the application.
3. ClassLoader loads classes from the database when the application starts.

**Respuesta Correcta:** 2

**Explicación:** ClassLoader in Java works by loading classes dynamically as they are needed by the application. It is responsible for finding and loading class files from the file system, network, or other sources.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 9: Can we write main method as public void static instead of public static void?
**Nivel:** Básico

1. Yes, we can write the main method as public void static.
2. No, we cannot write the main method as public void static.
3. It depends on the Java version.

**Respuesta Correcta:** 2

**Explicación:** The main method must be declared as public static void, and cannot be declared as public void static. This is because the main method must be a static method so that it can be called without creating an instance of the class, and it must return void as it does not return a value.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 11: Let say, we run a java class without passing any arguments. What will be the value of String array of arguments in Main method?
**Nivel:** Básico

1. An empty array
2. A null array
3. An array with one element

**Respuesta Correcta:** 1

**Explicación:** If a Java class is run without passing any arguments, the value of the String array of arguments in the Main method will be an empty array. The length of the array will be 0, but it will not be null.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 15: Can you explain the difference between a stack and a heap in Java memory management?
**Nivel:** Intermedio

1. A stack is used for method invocations and local variables, while a heap is used for objects and instance variables.
2. A stack is used for objects and instance variables, while a heap is used for method invocations and local variables.
3. Both the stack and heap are used for the same purpose.

**Respuesta Correcta:** 1

**Explicación:** In Java, the stack is used to store method invocations and local variables, while the heap is used to store objects and instance variables. The stack is used for temporary storage and has a limited size, while the heap is used for long-term storage and can grow or shrink as needed.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 23: What are the main principles of Object Oriented Programming?
**Nivel:** Básico

1. Encapsulation
2. Inheritance
3. Polymorphism
4. Abstraction

**Respuesta Correcta:** 1, 2, 3, 4

**Explicación:** The main principles of Object Oriented Programming are Encapsulation, Inheritance, Polymorphism, and Abstraction. Encapsulation refers to the idea of wrapping data and behavior within an object. Inheritance allows objects to inherit properties from a parent object. Polymorphism allows objects to take on multiple forms. Abstraction refers to the act of representing essential features without including the background details.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 24: What is the difference between Object Oriented Programming language and Object Based Programming language?
**Nivel:** Intermedio

1. Object Oriented Programming languages support inheritance and polymorphism, while Object Based Programming languages do not.
2. Object Oriented Programming languages do not support inheritance and polymorphism, while Object Based Programming languages do.
3. Both Object Oriented Programming languages and Object Based Programming languages support inheritance and polymorphism.

**Respuesta Correcta:** 1

**Explicación:** Object Oriented Programming (OOP) languages, such as Java and C++, support inheritance and polymorphism, while Object Based Programming (OBP) languages, such as JavaScript and VBScript, do not. OOP languages are designed around the concept of objects and the relationships between them, while OBP languages are focused on procedures and functions.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 26: Why do we need constructor in Java?
**Nivel:** Intermedio

1. To initialize objects and set default values for instance variables.
2. To declare methods in a class.
3. To declare variables in a class.

**Respuesta Correcta:** 1

**Explicación:** Constructors in Java are used to initialize objects and set default values for instance variables. They are called when an object is created and allow the programmer to specify the initial state of the object. Constructors have the same name as the class and do not have a return type.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 28: What is the value returned by Constructor in Java?
**Nivel:** Básico

1. Constructors do not return any value.
2. Constructors return an int value.
3. Constructors return a double value.
4. Constructors return a boolean value.

**Respuesta Correcta:** 1

**Explicación:** In Java, constructors do not return any value. They are called when an object is created and are used to initialize the object and set default values for instance variables.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 29: Can we inherit a Constructor?
**Nivel:** Básico

1. No, constructors cannot be inherited.
2. Yes, constructors can be inherited.
3. Constructors can only be inherited in some cases.

**Respuesta Correcta:** 1

**Explicación:** In Java, constructors cannot be inherited. Each class has its own constructor and the constructor of a subclass must call the constructor of its superclass explicitly.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 30: Why constructors cannot be final, static, or abstract in Java?
**Nivel:** Intermedio

1. Constructors are not meant to be overridden or modified, so they cannot be declared final. Constructors are not methods, so they cannot be declared static. Constructors are not meant to be subclassed, so they cannot be declared abstract.
2. Constructors are meant to be overridden or modified, so they must be declared final. Constructors are methods, so they must be declared static. Constructors are meant to be subclassed, so they must be declared abstract.
3. Both Constructors are meant to be overridden or modified and Constructors are not methods.

**Respuesta Correcta:** 1

**Explicación:** In Java, constructors cannot be declared final, static, or abstract. Constructors are not meant to be overridden or modified, so they cannot be declared final. Constructors are not methods, so they cannot be declared static. Constructors are not meant to be subclassed, so they cannot be declared abstract.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

## Tipos de Datos
**Total de preguntas: 364**

### Pregunta 8: Do you think ‘main’ used for main method is a keyword in Java?
**Nivel:** Básico

1. Yes, 'main' is a keyword in Java.
2. No, 'main' is not a keyword in Java.
3. Sometimes, 'main' is a keyword in Java.

**Respuesta Correcta:** 2

**Explicación:** 'main' is not a keyword in Java, it is just a conventional name for the entry point of a Java application. The main method must be declared as public static void and must take an array of Strings as a parameter.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 12: What is the difference between byte and char data types in Java?
**Nivel:** Intermedio

1. byte is a signed 8-bit type and char is an unsigned 16-bit type.
2. byte is an unsigned 8-bit type and char is a signed 16-bit type.
3. byte is a signed 8-bit type and char is a signed 16-bit type.
4. byte is an unsigned 8-bit type and char is an unsigned 16-bit type.

**Respuesta Correcta:** 1

**Explicación:** In Java, byte is a signed 8-bit type that can hold values from -128 to 127, while char is an unsigned 16-bit type that can hold values from 0 to 65535.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 18: What is the significance of the public static void main(String[] args) method in Java?
**Nivel:** Básico

1. The main method is the entry point of a Java application.
2. The main method is not important in a Java application.
3. The main method is used to initialize an object in a Java application.

**Respuesta Correcta:** 1

**Explicación:** The public static void main(String[] args) method in Java is the entry point of a Java application. It is used to specify the starting point of the application and must be declared as public static void so that it can be called without creating an instance of the class.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 21: Can you explain the difference between a primitive data type and a reference data type in Java?
**Nivel:** Intermedio

1. Primitive data types are stored directly on the stack, while reference data types are stored on the heap and accessed through references.
2. Primitive data types are stored on the heap, while reference data types are stored directly on the stack and accessed through references.
3. Both primitive data types and reference data types are stored on the stack.

**Respuesta Correcta:** 1

**Explicación:** In Java, primitive data types such as int, double, and boolean are stored directly on the stack, while reference data types such as objects and arrays are stored on the heap and accessed through references. Primitive data types hold their values directly, while reference data types hold references to their values.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 22: What is the difference between the byte and char data types in terms of memory size and value range?
**Nivel:** Intermedio

1. byte is a signed 8-bit type and char is an unsigned 16-bit type.
2. byte is an unsigned 8-bit type and char is a signed 16-bit type.
3. byte is a signed 8-bit type and char is a signed 16-bit type.
4. byte is an unsigned 8-bit type and char is an unsigned 16-bit type.

**Respuesta Correcta:** 1

**Explicación:** In Java, byte is a signed 8-bit type that can hold values from -128 to 127, while char is an unsigned 16-bit type that can hold values from 0 to 65535.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 25: In Java what is the default value of an object reference defined as an instance variable in an Object?
**Nivel:** Básico

1. 0
2. nan
3. undefined

**Respuesta Correcta:** 2

**Explicación:** In Java, the default value of an object reference defined as an instance variable in an Object is null. Object references must be initialized before they can be used, otherwise a NullPointerException will be thrown at runtime.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 33: What is encapsulation in Object Oriented Programming?
**Nivel:** Básico

1. Encapsulation is the process of wrapping data and behavior within an object.
2. Encapsulation is the process of unwrapping data and behavior from an object.
3. Encapsulation is the process of modifying data and behavior within an object.

**Respuesta Correcta:** 1

**Explicación:** Encapsulation is the process of wrapping data and behavior within an object. It refers to the idea of hiding the internal details of an object and exposing only the essential features to the outside world. Encapsulation helps to promote encapsulation of data and reduces the risk of data corruption.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 34: What is abstraction in Object Oriented Programming?
**Nivel:** Básico

1. Abstraction is the act of representing essential features without including the background details.
2. Abstraction is the act of including all details, even the background details.
3. Abstraction is the act of modifying essential features.

**Respuesta Correcta:** 1

**Explicación:** Abstraction is the act of representing essential features without including the background details. It refers to the process of focusing on the essential characteristics of an object and ignoring the non-essential details. Abstraction helps to reduce complexity and improve maintainability by providing a clear and simplified view of an object.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 36: What is method overloading in Java?
**Nivel:** Básico

1. Method overloading is the ability of a class to have multiple methods with the same name but different parameters.
2. Method overloading is the inability of a class to have multiple methods with the same name but different parameters.
3. Method overloading is the ability of a class to have only one method with the same name.

**Respuesta Correcta:** 1

**Explicación:** Method overloading is the ability of a class to have multiple methods with the same name but different parameters. Method overloading allows for methods with the same name to be used for different purposes, based on the number and type of parameters passed in. Method overloading is useful for creating more readable and maintainable code.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

### Pregunta 43: Why Java does not support multiple inheritance?
**Nivel:** Intermedio

1. Java does not support multiple inheritance to avoid the ambiguity and complexity that can arise from a class inheriting behavior from multiple superclasses.
2. Java supports multiple inheritance to allow a class to inherit behavior from multiple superclasses.
3. Java supports multiple inheritance in some cases, but not in others.

**Respuesta Correcta:** 1

**Explicación:** Java does not support multiple inheritance to avoid the ambiguity and complexity that can arise from a class inheriting behavior from multiple superclasses. In cases where a class needs to inherit behavior from multiple sources, Java uses interface implementation or aggregation (composition) instead of inheritance. This helps to simplify the class hierarchy and reduce the risk of conflicts between the superclasses.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias

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
```

---

## Hilos
**Total de preguntas: 49**

### Pregunta 61: Why it is not a good practice to create static variables in Java?
**Nivel:** Intermedio

1. Because they are not thread-safe.
2. Because they cannot be modified.
3. Because they do not follow object-oriented principles.

**Respuesta Correcta:** 1

**Explicación:** Creating static variables in Java can lead to race conditions and other concurrency issues because they are not thread-safe. This means that multiple threads can access and modify the same static variable at the same time, leading to unexpected results.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 70: Can a static method be synchronized in Java?
**Nivel:** Básico

1. Yes.
2. No.
3. It depends on the implementation.

**Respuesta Correcta:** 1

**Explicación:** Static methods in Java can be synchronized, just like instance methods. Synchronization is used to control access to a shared resource by multiple threads and ensure that only one thread can access the resource at a time.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 314: What is a Thread in Java?
**Nivel:** Avanzado

1. A Thread in Java is a lightweight and independent unit of execution, representing a single task or operation within a program.
2. A Thread in Java is a heavyweight and dependent unit of execution, representing a single task or operation within a program.
3. A Thread in Java is not supported.

**Respuesta Correcta:** 1

**Explicación:** A Thread in Java is a lightweight and independent unit of execution, representing a single task or operation within a program. Threads are scheduled and executed by the Java Virtual Machine, and can run concurrently and independently of other threads in the same program.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 321: How notify() method is different from notifyAll() method?
**Nivel:** Intermedio

1. The notify() method is used to signal a single waiting thread to wake up and continue execution. The notifyAll() method is used to signal all waiting threads to wake up and continue execution.
2. The notify() method is used to signal all waiting threads to wake up and continue execution. The notifyAll() method is used to signal a single waiting thread to wake up and continue execution.
3. Both the notify() and notifyAll() methods are used to signal all waiting threads to wake up and continue execution.

**Respuesta Correcta:** 1

**Explicación:** The notify() method is used to signal a single waiting thread to wake up and continue execution. The notifyAll() method is used to signal all waiting threads to wake up and continue execution. The notify() method is used when you want to wake up only one of the waiting threads, while the notifyAll() method is used when you want to wake up all of the waiting threads.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 327: What is the role of the thread scheduler in Java multi-threading?
**Nivel:** Básico

1. The role of the thread scheduler in Java multi-threading is to determine which thread should run next, based on the priority and status of the available threads.
2. The role of the thread scheduler in Java multi-threading is to create new threads and manage the execution of existing threads.
3. The role of the thread scheduler in Java multi-threading is to coordinate the communication between threads.

**Respuesta Correcta:** 1

**Explicación:** The role of the thread scheduler in Java multi-threading is to determine which thread should run next, based on the priority and status of the available threads. The thread scheduler is responsible for selecting the next thread to be executed, based on the priority of the available threads and the current state of the system. The scheduler is responsible for deciding when a running thread should be preempted and when a waiting thread should be resumed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 328: What is the use of the join() method in Java multi-threading?
**Nivel:** Básico

1. The use of the join() method in Java multi-threading is to wait for a thread to complete its execution before continuing with the next statement.
2. The use of the join() method in Java multi-threading is to start a new thread and run a task concurrently.
3. The use of the join() method in Java multi-threading is to signal a waiting thread to wake up and continue execution.

**Respuesta Correcta:** 1

**Explicación:** The use of the join() method in Java multi-threading is to wait for a thread to complete its execution before continuing with the next statement. The join() method can be used to wait for a thread to complete its execution, ensuring that the current thread does not proceed to the next statement until the specified thread has finished. The join() method can be useful for coordinating the execution of multiple threads and ensuring that the program runs in the desired order.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 329: What is the difference between yield() and join() methods in Java?
**Nivel:** Intermedio

1. The difference between yield() and join() methods in Java is that the yield() method is used to temporarily pause the execution of the current thread to allow other threads with the same priority to run, while the join() method is used to wait for a thread to complete its execution before continuing with the next statement.
2. The difference between yield() and join() methods in Java is that the join() method is used to temporarily pause the execution of the current thread to allow other threads with the same priority to run, while the yield() method is used to wait for a thread to complete its execution before continuing with the next statement.
3. Both the yield() and join() methods are used to start a new thread and run a task concurrently.

**Respuesta Correcta:** 1

**Explicación:** The difference between yield() and join() methods in Java is that the yield() method is used to temporarily pause the execution of the current thread to allow other threads with the same priority to run, while the join() method is used to wait for a thread to complete its execution before continuing with the next statement. The yield() method can be used to temporarily pause the execution of the current thread and allow other threads with the same priority to run, improving the overall responsiveness of the program. The join() method, on the other hand, can be used to wait for a thread to complete its execution, ensuring that the current thread does not proceed to the next statement until the specified thread has finished.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 468: What is a Thread in Java?
**Nivel:** Básico

1. A Thread is a separate flow of execution in a program.
2. A Thread is a data structure used to store elements in a specific order.
3. A Thread is a class used to handle exceptions in a program.

**Respuesta Correcta:** 1

**Explicación:** A Thread is a separate flow of execution in a program, meaning that a program can have multiple threads executing simultaneously, each in its own flow of execution. This allows for multitasking and parallel processing in a program.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 469: What is the priority of a Thread and how it is used in scheduling?
**Nivel:** Intermedio

1. The priority of a Thread is a value that determines the order in which it is executed by the scheduler. The scheduler uses the priority of a Thread to determine which Thread to run next.
2. The priority of a Thread has no effect on its execution.
3. The priority of a Thread determines the amount of memory it is allocated.

**Respuesta Correcta:** 1

**Explicación:** The priority of a Thread is a value that determines the order in which it is executed by the scheduler. The scheduler uses the priority of a Thread to determine which Thread to run next. Higher priority Threads are executed before lower priority Threads, but the exact order of execution depends on the scheduler implementation.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 473: What is the fundamental difference between wait() and sleep() methods?
**Nivel:** Intermedio

1. The fundamental difference between wait() and sleep() methods is that wait() releases the lock, while sleep() does not.
2. The fundamental difference between wait() and sleep() methods is that sleep() releases the lock, while wait() does not.
3. There is no difference between wait() and sleep() methods.

**Respuesta Correcta:** 1

**Explicación:** The fundamental difference between wait() and sleep() methods is that wait() releases the lock, while sleep() does not. When a Thread calls wait(), it releases the lock and enters a waiting state, allowing other Threads to access the shared resources. When a Thread calls sleep(), it does not release the lock, but simply goes to sleep for the specified amount of time.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Excepciones
**Total de preguntas: 28**

### Pregunta 183: Can you provide an example of how to use a specific Locale in Java?
**Nivel:** Intermedio

1. Locale locale = new Locale("fr", "FR");
2. Locale locale = new Locale("en", "US");
3. Locale locale = new Locale("es", "ES");

**Respuesta Correcta:** 1, 2, 3

**Explicación:** Any of the options 1, 2, or 3 can be used as an example of how to use a specific Locale in Java. The first argument is the language code, and the second argument is the country code. For example, the Locale new Locale("fr", "FR") represents French as used in France, new Locale("en", "US") represents English as used in the United States, and new Locale("es", "ES") represents Spanish as used in Spain.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 290: What is Exception Handling in Java?
**Nivel:** Básico

1. A mechanism for handling errors and exceptional conditions in a program.
2. A mechanism for ignoring errors and exceptional conditions in a program.
3. A mechanism for debugging errors and exceptional conditions in a program.

**Respuesta Correcta:** 1

**Explicación:** Exception handling in Java is a mechanism for handling errors and exceptional conditions in a program. It allows the program to continue executing even in the event of an error or exception, rather than crashing or terminating.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 293: What is a finally block in Java?
**Nivel:** Básico

1. A block of code that is guaranteed to be executed after a try-catch block, regardless of whether an exception was thrown or caught.
2. A block of code that is executed before a try-catch block.
3. A block of code that is executed only if an exception was thrown.

**Respuesta Correcta:** 1

**Explicación:** A finally block in Java is a block of code that is guaranteed to be executed after a try-catch block, regardless of whether an exception was thrown or caught. The finally block can be used to clean up resources or perform other tasks that should always be executed, regardless of whether an exception was thrown or not.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 294: What is the use of finally block in Java?
**Nivel:** Básico

1. To clean up resources or perform other tasks that should always be executed, regardless of whether an exception was thrown or not.
2. To catch exceptions that were thrown but not caught by a catch block.
3. To throw exceptions that were not caught by a catch block.

**Respuesta Correcta:** 1

**Explicación:** The use of finally block in Java is to clean up resources or perform other tasks that should always be executed, regardless of whether an exception was thrown or not. For example, a finally block can be used to close a file that was opened in a try block.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 295: Can we create a finally block without creating a catch block?
**Nivel:** Básico

1. Yes
2. No
3. nan

**Respuesta Correcta:** 1

**Explicación:** Yes, we can create a finally block without creating a catch block. For example, a finally block can be used to perform cleanup tasks even if no exception was thrown in the try block.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 296: Do we have to always put a catch block after a try block?
**Nivel:** Básico

1. No
2. Yes
3. nan

**Respuesta Correcta:** 1

**Explicación:** No, we do not have to always put a catch block after a try block. A try block can be followed by a catch block, a finally block, or both. If no exception is thrown in the try block, the catch block will not be executed, but the finally block will be executed if it exists.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 297: In what scenarios, a finally block will not be executed?
**Nivel:** Básico

1. When a program exits or is terminated by a call to System.exit().
2. When an exception is thrown but not caught in the try-catch block.
3. When an exception is caught and handled in the catch block.

**Respuesta Correcta:** 1

**Explicación:** A finally block will not be executed when a program exits or is terminated by a call to System.exit(). In all other scenarios, the finally block will be executed, regardless of whether an exception was thrown or caught.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 298: Can we re-throw an Exception in Java?
**Nivel:** Básico

1. Yes
2. No
3. nan

**Respuesta Correcta:** 1

**Explicación:** Yes, we can re-throw an Exception in Java by using the throw statement in a catch block. This allows the exception to be propagated to a higher level of the program where it can be handled or logged. For example, try { ... } catch (Exception e) { throw e; } will re-throw the exception that was caught in the catch block.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 299: What is the difference between throw and throws in Java?
**Nivel:** Intermedio

1. The throw keyword is used to throw an exception, while the throws keyword is used to declare that a method may throw an exception.
2. The throws keyword is used to throw an exception, while the throw keyword is used to declare that a method may throw an exception.
3. Both the throw and throws keywords are used to throw an exception.
4. Neither the throw nor the throws keyword is used to throw an exception.

**Respuesta Correcta:** 1

**Explicación:** The difference between throw and throws in Java is that the throw keyword is used to throw an exception, while the throws keyword is used to declare that a method may throw an exception. For example, public void foo() throws IOException { throw new IOException(); } declares that the method foo() may throw an IOException, while the line throw new IOException(); actually throws the exception.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 302: What is the purpose of using Exception Handling in Java?
**Nivel:** Básico

1. To handle errors and exceptional conditions in a program and allow the program to continue executing, rather than crashing or terminating.
2. To ignore errors and exceptional conditions in a program.
3. To debug errors and exceptional conditions in a program.

**Respuesta Correcta:** 1

**Explicación:** The purpose of using Exception Handling in Java is to handle errors and exceptional conditions in a program and allow the program to continue executing, rather than crashing or terminating. By using exception handling, we can gracefully handle and recover from errors and exceptional conditions, improving the stability and robustness of the program.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Memoria
**Total de preguntas: 54**

### Pregunta 233: Why Java provides Garbage Collector?
**Nivel:** Avanzado

1. Java provides a Garbage Collector to automatically free up memory that is no longer being used by the application, in order to prevent the application from running out of memory.
2. Java provides a Garbage Collector to manually free up memory that is no longer being used by the application.
3. Java provides a Garbage Collector to free up memory that is not being used by the application.

**Respuesta Correcta:** 1

**Explicación:** Java provides a Garbage Collector to automatically free up memory that is no longer being used by the application, in order to prevent the application from running out of memory. By automatically freeing up memory that is no longer being used, the Garbage Collector helps to ensure that the application has enough memory to continue running, and helps to prevent memory leaks and other memory-related problems.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 234: What is the purpose of gc() in Java?
**Nivel:** Básico

1. The purpose of the gc() method in Java is to explicitly request that the Garbage Collector run and reclaim memory that is no longer being used by the application.
2. The purpose of the gc() method in Java is to explicitly request that the Garbage Collector manually reclaim memory that is no longer being used by the application.
3. The purpose of the gc() method in Java is to explicitly request that the Garbage Collector free up memory that is not being used by the application.

**Respuesta Correcta:** 1

**Explicación:** The purpose of the gc() method in Java is to explicitly request that the Garbage Collector run and reclaim memory that is no longer being used by the application. The gc() method can be used to explicitly request that the Garbage Collector run, although it is not guaranteed that the Garbage Collector will actually run in response to a call to gc(). The Garbage Collector runs automatically, so you do not typically need to call gc() in your code.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 245: What are the advantages of using Garbage Collection in Java?
**Nivel:** Avanzado

1. The advantages of using Garbage Collection in Java include automatic memory management, improved application performance, and reduced risk of memory leaks.
2. The advantages of using Garbage Collection in Java include automatic memory management and reduced risk of memory leaks.
3. The advantages of using Garbage Collection in Java include improved application performance and reduced risk of memory leaks.
4. The advantages of using Garbage Collection in Java include improved application performance.

**Respuesta Correcta:** 1

**Explicación:** The advantages of using Garbage Collection in Java include automatic memory management, improved application performance, and reduced risk of memory leaks. Garbage Collection frees up memory that is no longer being used by the application, which can help to improve application performance. Additionally, by automatically freeing up memory, Garbage Collection reduces the risk of memory leaks, which can cause the application to run out of memory and crash.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 280: What is the difference between the == and equals() method when comparing Strings in Java?
**Nivel:** Intermedio

1. The == operator compares the memory addresses of two strings, while the equals() method compares the contents of two strings.
2. The equals() method compares the memory addresses of two strings, while the == operator compares the contents of two strings.
3. Both the == operator and the equals() method compare the memory addresses of two strings.
4. Both the == operator and the equals() method compare the contents of two strings.

**Respuesta Correcta:** 1

**Explicación:** The == operator compares the memory addresses of two strings, while the equals() method compares the contents of two strings. This means that the == operator will return true if two strings have the same memory address, while the equals() method will return true if two strings have the same contents.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 300: What is the concept of Exception Propagation?
**Nivel:** Básico

1. The process of passing an exception up the call stack to be handled by a higher level of the program.
2. The process of passing an exception down the call stack to be handled by a lower level of the program.
3. The process of logging an exception without passing it to another level of the program.

**Respuesta Correcta:** 1

**Explicación:** The concept of Exception Propagation refers to the process of passing an exception up the call stack to be handled by a higher level of the program. If an exception is not caught and handled in the method where it was thrown, it will be propagated to the caller of that method, and so on, until it is caught and handled by a catch block or until the program terminates.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 324: What is the difference between a process and a thread in Java?
**Nivel:** Intermedio

1. A process is a program in execution, while a thread is a lightweight sub-process that runs within a process and shares the process's resources.
2. A process is a lightweight sub-process that runs within a process and shares the process's resources, while a thread is a program in execution.
3. Both a process and a thread are the same thing in Java.

**Respuesta Correcta:** 1

**Explicación:** A process is a program in execution, while a thread is a lightweight sub-process that runs within a process and shares the process's resources. A process is a standalone program that runs on a computer and has its own memory space, system resources, and environment. A thread, on the other hand, is a smaller unit of execution that runs within a process and shares the process's memory space, system resources, and environment.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 330: What is the use of the volatile keyword in Java multi-threading?
**Nivel:** Básico

1. The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from main memory and not from the thread cache, ensuring that multiple threads access the latest value of the variable.
2. The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from the thread cache and not from main memory, improving the performance of the program.
3. The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from both the thread cache and main memory, improving the reliability of the program.

**Respuesta Correcta:** 1

**Explicación:** The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from main memory and not from the thread cache, ensuring that multiple threads access the latest value of the variable. The volatile keyword can be used to declare a variable as volatile, which means that its value can be changed by multiple threads and that the value of the variable is guaranteed to be the latest value when accessed from any thread. This can be useful for ensuring that multiple threads access the latest value of a variable, improving the reliability of the program.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 335: What are the differences between a List and Set collection in Java?
**Nivel:** Intermedio

1. Lists allow duplicate elements, while Sets do not.
2. Sets allow duplicate elements, while Lists do not.
3. Both Lists and Sets allow duplicate elements.

**Respuesta Correcta:** 1

**Explicación:** Lists allow duplicate elements, while Sets do not. Sets are collections that store unique elements, while Lists are collections that can store duplicate elements.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 336: What are the differences between a HashSet and TreeSet collection in Java?
**Nivel:** Intermedio

1. HashSet is unordered, while TreeSet is ordered.
2. TreeSet is unordered, while HashSet is ordered.
3. Both HashSet and TreeSet are ordered.

**Respuesta Correcta:** 1

**Explicación:** HashSet is unordered, meaning the elements are stored in a random order, while TreeSet is ordered, meaning the elements are stored in a sorted order.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 344: Is it a good idea to use Generics in collections?
**Nivel:** Básico

1. Yes, it is a good idea to use Generics in collections as it provides type safety and eliminates the need for type casting.
2. No, it is not a good idea to use Generics in collections as it adds complexity to the code.
3. It depends on the use case.

**Respuesta Correcta:** 1

**Explicación:** Yes, it is a good idea to use Generics in collections as it provides type safety and eliminates the need for type casting. This makes the code more readable and less prone to errors.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Strings
**Total de preguntas: 4**

### Pregunta 282: How can you concatenate two Strings in Java?
**Nivel:** Intermedio

1. By using the + operator.
2. By using the concat() method.
3. By using the append() method.
4. By using the add() method.

**Respuesta Correcta:** 1

**Explicación:** You can concatenate two Strings in Java by using the + operator. For example, String s = "Hello" + "World"; will create a new string s with the contents "HelloWorld".

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 285: How can you split a String in Java?
**Nivel:** Intermedio

1. By using the split() method.
2. By using the substring() method.
3. By using the replace() method.
4. By using the trim() method.

**Respuesta Correcta:** 1

**Explicación:** You can split a String in Java by using the split() method. For example, String s = "Hello,World"; String[] words = s.split(","); will create an array words with two elements, "Hello" and "World".

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 674: How can you check if a String is a number by using regular expression?
**Nivel:** Intermedio

1. By using the pattern ^[0-9]+$.
2. By using the pattern [0-9]+.
3. By using the pattern ^[0-9]*$.
4. By using the pattern [0-9]*.

**Respuesta Correcta:** 1

**Explicación:** By using the pattern ^[0-9]+$. This regular expression pattern matches strings that consist of one or more digits and nothing else. This can be used to check if a string is a number.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 900: Is it allowed to inject null or empty String values in Spring?
**Nivel:** Intermedio

1. Yes, it is allowed to inject null or empty String values in Spring.
2. No, it is not allowed to inject null or empty String values in Spring.
3. It depends on the implementation of the Bean.

**Respuesta Correcta:** 1

**Explicación:** Yes, it is allowed to inject null or empty String values in Spring. However, it is important to note that this may lead to issues in the application if the Bean depends on the injected value being non-null or non-empty.

#### Ejemplos de Código

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
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Colecciones
**Total de preguntas: 65**

### Pregunta 332: What are the differences between the two data structures: a Vector and an ArrayList?
**Nivel:** Intermedio

1. Vectors are synchronized while ArrayLists are not.
2. ArrayLists are synchronized while Vectors are not.
3. Both Vectors and ArrayLists are synchronized.

**Respuesta Correcta:** 1

**Explicación:** Vectors are synchronized, meaning multiple threads can access a Vector without causing any problems, while ArrayLists are not synchronized. This makes ArrayLists faster, but it also means that they are not thread-safe.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 334: In which scenario, LinkedList is better than ArrayList in Java?
**Nivel:** Básico

1. When inserting or deleting elements in the middle of a list.
2. When accessing elements at the beginning or end of a list.
3. When accessing elements in the middle of a list.

**Respuesta Correcta:** 1

**Explicación:** LinkedList is better than ArrayList when inserting or deleting elements in the middle of a list, as it requires less shifting of elements. ArrayList is better for accessing elements at the beginning or end of a list, as it has faster access times due to its index-based structure.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 338: What are the differences between a HashMap and a Hashtable in Java?
**Nivel:** Intermedio

1. HashMap is unsynchronized, while Hashtable is synchronized.
2. Hashtable is unsynchronized, while HashMap is synchronized.
3. Both HashMap and Hashtable are synchronized.

**Respuesta Correcta:** 1

**Explicación:** HashMap is unsynchronized, meaning multiple threads can access it at the same time, while Hashtable is synchronized, meaning only one thread can access it at a time. This makes Hashtable slower, but it also makes it thread-safe.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 339: What are the differences between a HashMap and a TreeMap?
**Nivel:** Intermedio

1. HashMap is unordered, while TreeMap is ordered.
2. TreeMap is unordered, while HashMap is ordered.
3. Both HashMap and TreeMap are ordered.

**Respuesta Correcta:** 1

**Explicación:** HashMap is unordered, meaning the elements are stored in a random order, while TreeMap is ordered, meaning the elements are stored in a sorted order.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 347: What is the difference between ArrayList and LinkedList in terms of performance?
**Nivel:** Avanzado

1. ArrayList is faster for accessing elements at the beginning or end of a list, while LinkedList is faster for inserting or deleting elements in the middle of a list.
2. LinkedList is faster for accessing elements at the beginning or end of a list, while ArrayList is faster for inserting or deleting elements in the middle of a list.
3. Both ArrayList and LinkedList have the same performance.

**Respuesta Correcta:** 1

**Explicación:** ArrayList is faster for accessing elements at the beginning or end of a list, while LinkedList is faster for inserting or deleting elements in the middle of a list. This is because ArrayList uses an index-based structure, while LinkedList uses a linked structure.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 348: What is the difference between HashMap and HashSet in Java?
**Nivel:** Intermedio

1. HashMap stores key-value pairs, while HashSet stores unique elements.
2. HashSet stores key-value pairs, while HashMap stores unique elements.
3. Both HashMap and HashSet store key-value pairs.

**Respuesta Correcta:** 1

**Explicación:** HashMap stores key-value pairs, while HashSet stores unique elements. This means that HashMap allows you to store data as key-value pairs, while HashSet only allows you to store unique elements.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 352: What is the difference between a SortedSet and a NavigableSet in Java?
**Nivel:** Intermedio

1. SortedSet provides a sorted view of elements, while NavigableSet provides a sorted view of elements and additional navigation methods.
2. NavigableSet provides a sorted view of elements, while SortedSet provides a sorted view of elements and additional navigation methods.
3. Both SortedSet and NavigableSet provide the same view of elements.

**Respuesta Correcta:** 2

**Explicación:** NavigableSet provides a sorted view of elements and additional navigation methods, such as retrieving the next element or the previous element, while SortedSet only provides a sorted view of elements.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 354: What is the difference between a Set and a Map in Java?
**Nivel:** Intermedio

1. Set stores unique elements, while Map stores key-value pairs.
2. Map stores unique elements, while Set stores key-value pairs.
3. Both Set and Map store unique elements.

**Respuesta Correcta:** 1

**Explicación:** Set stores unique elements, while Map stores key-value pairs. This means that Set only allows you to store unique elements, while Map allows you to store data as key-value pairs.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 374: How will you remove duplicate elements from an ArrayList?
**Nivel:** Intermedio

1. You can remove duplicate elements from an ArrayList by using the removeDuplicates() method of the ArrayList class.
2. You can remove duplicate elements from an ArrayList by using the distinct() method of the Stream interface.
3. You can remove duplicate elements from an ArrayList by using the Set view of the List and then copying back to the List.

**Respuesta Correcta:** 3

**Explicación:** You can remove duplicate elements from an ArrayList by using the Set view of the List and then copying back to the List. This allows you to remove duplicates from an ArrayList by converting it to a Set, which does not allow duplicates, and then copying the unique elements back to the ArrayList.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 377: How will you copy elements from a Source List to another list?
**Nivel:** Intermedio

1. You can copy elements from a Source List to another list by using the addAll() method of the Destination List.
2. You can copy elements from a Source List to another list by using the copy() method of the Collections class.
3. You can copy elements from a Source List to another list by using the new ArrayList<>(sourceList) constructor.

**Respuesta Correcta:** 1

**Explicación:** You can copy elements from a Source List to another list by using either the addAll() method of the Destination List or the new ArrayList<>(sourceList) constructor. This allows you to copy the elements from one List to another, creating a new List that is a copy of the original.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Streams
**Total de preguntas: 7**

### Pregunta 357: What is the purpose of native method in Java?
**Nivel:** Básico

1. A native method is used to access system-specific functionality that is not available in Java.
2. A native method is used to access platform-independent functionality in Java.
3. A native method is used to access platform-specific functionality in Java.

**Respuesta Correcta:** 1

**Explicación:** A native method is used to access system-specific functionality that is not available in Java. This allows you to access functionality that is not provided by the Java platform, such as operating system-specific features or low-level hardware access.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 578: What is a Lambda expression in Java?
**Nivel:** Avanzado

1. A block of code that can be passed around as a value.
2. A value that can be passed around as a block of code.
3. A block of code that cannot be passed around as a value.

**Respuesta Correcta:** 1

**Explicación:** A Lambda expression in Java is a block of code that can be passed around as a value. This allows for more concise and expressive coding, as well as improved performance and increased efficiency.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 579: What are the three main parts of a Lambda expression in Java?
**Nivel:** Básico

1. The parameters, the arrow, and the body.
2. The body, the arrow, and the return type.
3. The parameters, the body, and the return type.

**Respuesta Correcta:** 1

**Explicación:** The three main parts of a Lambda expression in Java are the parameters, the arrow, and the body. The parameters specify the inputs to the lambda expression, the arrow separates the parameters from the body, and the body specifies the code to be executed.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 856: What are the modules in Core Container of Spring framework?
**Nivel:** Básico

1. Spring Core
2. Spring Beans
3. Spring Context
4. All of the above.

**Respuesta Correcta:** 4

**Explicación:** The Core Container of Spring framework includes the following modules: Spring Core, Spring Beans, and Spring Context. These modules provide the core functionality of the framework, including the management of beans and their dependencies, and the application context.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 859: What is the main use of Core Container module in Spring framework?
**Nivel:** Básico

1. To provide the core functionality of the framework.
2. To provide support for data access and integration with relational databases.
3. To provide support for building web applications and handling HTTP requests.

**Respuesta Correcta:** 1

**Explicación:** The Core Container module of Spring framework provides the core functionality of the framework, including the management of beans and their dependencies, and the application context.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 1061: What are the main uses of a Maven plugin?
**Nivel:** Básico

1. The main uses of a Maven plugin are to provide additional functionality to the build process, such as compiling source code, generating documentation, or deploying applications.
2. The main uses of a Maven plugin are to manage project dependencies and resolve conflicts.
3. The main uses of a Maven plugin are to create and manage archetypes.

**Respuesta Correcta:** 1

**Explicación:** The main uses of a Maven plugin are to provide additional functionality to the build process, such as compiling source code, generating documentation, or deploying applications. Maven plugins are executed as part of the build lifecycle and can be used to perform a wide range of tasks, making it easier to automate the build and deployment process.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 1092: What is a plugin in Maven and how does it work?
**Nivel:** Intermedio

1. A plugin is a piece of software that extends the functionality of Maven, allowing it to perform additional tasks such as compiling code or generating documentation.
2. A plugin is a piece of software that replaces the functionality of Maven, allowing it to perform additional tasks such as compiling code or generating documentation.
3. A plugin is a piece of software that enhances the functionality of Java, allowing it to perform additional tasks such as compiling code or generating documentation.

**Respuesta Correcta:** 1

**Explicación:** A plugin in Maven is a piece of software that extends the functionality of Maven, allowing it to perform additional tasks such as compiling code, generating documentation, or performing tests. Plugins are executed during the build process and can be added to a Maven project by specifying them in the project's POM file.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Anotaciones
**Total de preguntas: 12**

### Pregunta 886: What are the different ways to provide configuration metadata to a Spring Container?
**Nivel:** Básico

1. XML configuration files.
2. Annotation-based configuration.
3. Java-based configuration.
4. All of the above.

**Respuesta Correcta:** 4

**Explicación:** There are several ways to provide configuration metadata to a Spring Container, including XML configuration files, Annotation-based configuration, and Java-based configuration. This allows for a flexible and configurable approach to managing the configuration of a Spring-based application.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 888: How will you define the scope of a bean in Spring?
**Nivel:** Intermedio

1. By using @Scope annotation.
2. By using XML configuration.
3. By using Java configuration.

**Respuesta Correcta:** 1

**Explicación:** The scope of a bean in Spring can be defined by using the @Scope annotation. This annotation allows for the configuration of the scope of a bean, determining its lifecycle and scope within the Spring IoC container.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 904: In Spring framework, what is Annotation-based container configuration?
**Nivel:** Básico

1. Annotation-based container configuration in Spring refers to the configuration of the Spring IoC container using annotations, rather than XML or other configuration files.
2. Annotation-based container configuration in Spring refers to the configuration of the Spring IoC container using XML or other configuration files.
3. Annotation-based container configuration in Spring refers to the configuration of annotations within the code.

**Respuesta Correcta:** 1

**Explicación:** Annotation-based container configuration in Spring refers to the configuration of the Spring IoC container using annotations, rather than XML or other configuration files. This allows for a more flexible and configurable approach to managing the configuration of a Spring-based application.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 905: How will you switch on Annotation based wiring in Spring?
**Nivel:** Intermedio

1. In order to switch on Annotation based wiring in Spring, we need to add the <context:annotation-config /> element to our application context XML configuration file.
2. In order to switch on Annotation based wiring in Spring, we need to remove the <context:annotation-config /> element from our application context XML configuration file.
3. In order to switch on Annotation based wiring in Spring, we need to use a different configuration file that supports Annotation based wiring.

**Respuesta Correcta:** 1

**Explicación:** In order to switch on Annotation based wiring in Spring, we need to add the <context:annotation-config /> element to our application context XML configuration file. This allows for the use of annotations for configuring the Spring IoC container, rather than using XML or other configuration

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 906: What is @Autowired annotation?
**Nivel:** Básico

1. The @Autowired annotation in Spring is used to automatically wire a Bean with its dependencies.
2. The @Autowired annotation in Spring is used to prevent a Bean from being automatically wired with its dependencies.
3. The @Autowired annotation in Spring is used to manually wire a Bean with its dependencies.

**Respuesta Correcta:** 1

**Explicación:** The @Autowired annotation in Spring is used to automatically wire a Bean with its dependencies. This allows for the resolution of dependencies between Beans in a flexible and configurable manner, making it easier to manage the configuration of a Spring-based application.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 908: What are the two ways to enable RequiredAnnotationBeanPostProcessor in Spring?
**Nivel:** Básico

1. By including the <context:annotation-config /> element in the application context XML configuration file.
2. By including the <context:required-annotation /> element in the application context XML configuration file.
3. By adding the @Autowired annotation to the Bean property.
4. All of the above.

**Respuesta Correcta:** 1, 2

**Explicación:** The two ways to enable RequiredAnnotationBeanPostProcessor in Spring are by including the <context:annotation-config /> element in the application context XML configuration file, and by including the <context:required-annotation /> element in the application context XML configuration file. These elements allow for the enforcement of mandatory dependencies between Beans, helping to ensure that the configuration of a Spring-based application is consistent and complete.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 909: What is @Qualifier annotation in Spring?
**Nivel:** Básico

1. The @Qualifier annotation in Spring is used to resolve any ambiguity in the resolution of dependencies between Beans.
2. The @Qualifier annotation in Spring is used to create ambiguity in the resolution of dependencies between Beans.
3. The @Qualifier annotation in Spring is used to manually wire a Bean with its dependencies.

**Respuesta Correcta:** 1

**Explicación:** The @Qualifier annotation in Spring is used to resolve any ambiguity in the resolution of dependencies between Beans. This allows for the specification of which Bean should be used for a particular dependency, making it easier to manage the configuration of a Spring-based application.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 928: What are the different types of AutoProxy creators in Spring?
**Nivel:** Básico

1. BeanNameAutoProxyCreator
2. DefaultAdvisorAutoProxyCreator
3. AnnotationAwareAspectJAutoProxyCreator
4. All of the above.

**Respuesta Correcta:** 4

**Explicación:** The different types of AutoProxy creators in Spring include BeanNameAutoProxyCreator, DefaultAdvisorAutoProxyCreator, and AnnotationAwareAspectJAutoProxyCreator. These different types of AutoProxy creators allow for a flexible and configurable approach to software development, making it easier to manage the complexity of large-scale applications.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 932: What is Annotation-based aspect implementation in Spring AOP?
**Nivel:** Intermedio

1. Annotation-based aspect implementation in Spring AOP is a way to define Aspects and their configuration in a Spring AOP application using annotations.
2. Annotation-based aspect implementation in Spring AOP is not related to defining Aspects and their configuration in a Spring AOP application.
3. Annotation-based aspect implementation in Spring AOP is a way to define Aspects and their configuration in a non-Spring AOP application.

**Respuesta Correcta:** 1

**Explicación:** Annotation-based aspect implementation in Spring AOP is a way to define Aspects and their configuration in a Spring AOP application using annotations. This allows for a more organized and efficient approach to software development, while also making it easier to manage the complexity of large-scale applications.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

### Pregunta 951: What are the best practices of Spring Framework?
**Nivel:** Básico

1. Use annotations instead of XML configuration
2. Use Dependency Injection (DI) for loosely coupled architecture
3. Use Aspect Oriented Programming (AOP) for modularizing cross-cutting concerns
4. Use a layered architecture

**Respuesta Correcta:** 1, 2, 3

**Explicación:** All of the options are considered best practices in Spring framework. Using annotations instead of XML configuration makes the code more concise and readable. Using Dependency Injection (DI) helps create a loosely coupled architecture. Using Aspect Oriented Programming (AOP) helps modularize cross-cutting concerns.

#### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

#### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

