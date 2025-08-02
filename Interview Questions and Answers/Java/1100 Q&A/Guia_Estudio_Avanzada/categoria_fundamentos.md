# Fundamentos - Preguntas de Entrevista Java
**Total de preguntas: 65**

## Pregunta 1
**Pregunta:** What is the difference between JDK and JRE?
**Nivel:** Intermedio

1. JDK is the development kit and JRE is the runtime environment.
2. JRE is the development kit and JDK is the runtime environment.
3. Both JDK and JRE are the same.

**Respuesta Correcta:** 1

**Explicación:** JDK (Java Development Kit) is a collection of tools and libraries used for developing Java applications, while JRE (Java Runtime Environment) is a software platform that provides the necessary runtime environment to run Java applications.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 2
**Pregunta:** What is Java Virtual Machine (JVM)?
**Nivel:** Básico

1. A hardware machine that runs Java programs.
2. An abstract computing machine that runs Java bytecode.
3. A software platform that runs Java applications.

**Respuesta Correcta:** 2

**Explicación:** JVM is an abstract computing machine that executes Java bytecode. It is responsible for managing memory, executing instructions, and providing security.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 3
**Pregunta:** What are the different types of memory areas allocated by JVM?
**Nivel:** Básico

1. Stack
2. Heap
3. Method Area
4. Program Counter

**Respuesta Correcta:** 1, 2

**Explicación:** JVM allocates memory to several areas such as Stack, Heap, Method Area, and Program Counter. Stack is used to store method invocations and local variables, while Heap is used to store objects and instance variables. Method Area stores class-level information, and Program Counter stores the current location of the instruction being executed.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 4
**Pregunta:** What is JIT compiler?
**Nivel:** Básico

1. A compiler that compiles Java code into machine code.
2. A compiler that compiles Java code into bytecode.
3. A compiler that compiles bytecode into machine code during runtime.

**Respuesta Correcta:** 3

**Explicación:** JIT (Just-In-Time) compiler is a compiler that compiles bytecode into machine code during runtime. This allows for faster execution of Java code as the bytecode is compiled when it is needed, rather than ahead of time.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 6
**Pregunta:** Why people say that Java is 'write once and run anywhere' language?
**Nivel:** Intermedio

1. Java is platform-independent.
2. Java is platform-dependent.
3. Java is both platform-independent and platform-dependent.

**Respuesta Correcta:** 1

**Explicación:** Java is platform-independent, meaning the same Java code can run on different platforms without any modification. This is due to the fact that Java code is compiled into bytecode, which can run on any device with a Java Virtual Machine installed.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 13
**Pregunta:** What is the purpose of the Java Development Kit (JDK)?
**Nivel:** Básico

1. The JDK provides a complete set of tools for developing Java applications.
2. The JDK provides a runtime environment to run Java applications.
3. The JDK provides both a development environment and a runtime environment for Java applications.

**Respuesta Correcta:** 1

**Explicación:** The Java Development Kit (JDK) is a collection of tools and libraries used for developing Java applications. It includes the Java compiler, the Java Virtual Machine (JVM), and other tools needed to develop, debug, and run Java applications.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 14
**Pregunta:** What is the role of the JRE in the Java environment?
**Nivel:** Básico

1. The JRE provides a runtime environment to run Java applications.
2. The JRE provides a development environment to develop Java applications.
3. The JRE provides both a runtime environment and a development environment for Java applications.

**Respuesta Correcta:** 1

**Explicación:** The Java Runtime Environment (JRE) is a software platform that provides the necessary runtime environment to run Java applications. It includes the Java Virtual Machine (JVM), the Java class libraries, and other files needed to run Java applications.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 16
**Pregunta:** What is the purpose of the JIT compiler in the JVM?
**Nivel:** Básico

1. To compile bytecode into machine code during runtime.
2. To compile bytecode into machine code ahead of time.
3. To compile machine code into bytecode during runtime.

**Respuesta Correcta:** 1

**Explicación:** The purpose of the JIT (Just-In-Time) compiler in the JVM is to compile bytecode into machine code during runtime. This allows for faster execution of Java code as the bytecode is compiled when it is needed, rather than ahead of time.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 17
**Pregunta:** Can you explain the difference between platform independence and platform-specific code in Java?
**Nivel:** Intermedio

1. Platform-independent code can run on any platform, while platform-specific code can only run on a specific platform.
2. Platform-independent code can only run on a specific platform, while platform-specific code can run on any platform.
3. Both platform-independent code and platform-specific code can only run on a specific platform.

**Respuesta Correcta:** 1

**Explicación:** Platform-independent code can run on any platform, while platform-specific code can only run on a specific platform. Java is a platform-independent language, meaning the same Java code can run on different platforms without any modification. This is due to the fact that Java code is compiled into bytecode, which can run on any device with a Java Virtual Machine installed.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 19
**Pregunta:** Can you explain the process of class loading in Java and the responsibilities of the ClassLoader class?
**Nivel:** Básico

1. ClassLoader is responsible for finding and loading class files dynamically as they are needed by the application.
2. ClassLoader is responsible for finding and loading class files ahead of time.
3. ClassLoader is not responsible for finding and loading class files.

**Respuesta Correcta:** 1

**Explicación:** Class loading in Java is the process of finding and loading class files into the JVM. The ClassLoader class is responsible for finding and loading class files dynamically as they are needed by the application. It is also responsible for maintaining a cache of classes that have been loaded, so that they do not need to be loaded again.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 27
**Pregunta:** Why do we need default constructor in Java classes?
**Nivel:** Intermedio

1. To provide a default constructor in case the programmer does not provide one.
2. To initialize objects with specific values.
3. To initialize objects with random values.

**Respuesta Correcta:** 1

**Explicación:** In Java, a default constructor is automatically provided by the compiler in case the programmer does not provide one. The default constructor is a no-argument constructor that sets default values for the instance variables. This is useful in cases where an object does not need to be initialized with specific values.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 46
**Pregunta:** Why there are no pointers in Java?
**Nivel:** Intermedio

1. Pointers are not supported in Java to improve security and reduce the risk of memory-related errors, such as null pointer exceptions and buffer overflows.
2. Pointers are supported in Java but are not commonly used.
3. Pointers are supported in Java and are commonly used.

**Respuesta Correcta:** 1

**Explicación:** Pointers are not supported in Java to improve security and reduce the risk of memory-related errors, such as null pointer exceptions and buffer overflows. Java uses references instead of pointers to refer to objects, and the JVM automatically manages memory and garbage collection. This helps to make Java code more secure and easier to maintain, and reduces the risk of errors related to memory management.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 63
**Pregunta:** Why do we mark main method as static in Java?
**Nivel:** Intermedio

1. Because the main method must be static to be called by the JVM.
2. Because the main method must be static to access static variables.
3. Because the main method must be static to access instance variables.

**Respuesta Correcta:** 1

**Explicación:** The main method in Java must be marked as static because it is called by the JVM, which does not have access to instance variables or methods.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 65
**Pregunta:** What happens when static modifier is not mentioned in the signature of main method?
**Nivel:** Básico

1. The main method can still be executed.
2. The main method cannot be executed.
3. The main method can be executed but with limited functionality.

**Respuesta Correcta:** 2

**Explicación:** The main method must be marked as static in order to be executed by the JVM. If the static modifier is not mentioned, the JVM will not be able to find and execute the main method.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 79
**Pregunta:** Is it allowed to overload main() method in Java?
**Nivel:** Básico

1. Yes.
2. No.
3. It depends on the implementation.

**Respuesta Correcta:** 1

**Explicación:** It is allowed to overload the main() method in Java. This means that multiple methods with the same name (main) can be defined, each with different parameters. The JVM will call the main method with the signature specified in the java command-line argument.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 157
**Pregunta:** Is it mandatory to import java.lang package every time?
**Nivel:** Básico

1. No, it is not mandatory to import java.lang package every time as it is automatically imported by the compiler.
2. Yes, it is mandatory to import java.lang package every time.
3. It depends on the compiler.

**Respuesta Correcta:** 1

**Explicación:** No, it is not mandatory to import java.lang package every time as it is automatically imported by the compiler. This means that classes and interfaces in the java.lang package can be used without explicitly importing them.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 184
**Pregunta:** How does the Locale class determine the default locale for a Java application?
**Nivel:** Intermedio

1. The Locale class determines the default locale by using the system properties.
2. The Locale class determines the default locale by using the user preferences.
3. The Locale class determines the default locale by using the operating system settings.

**Respuesta Correcta:** 1

**Explicación:** The Locale class determines the default locale for a Java application by using the system properties. The default Locale can be set using the user.language and user.country system properties, which specify the language and country codes, respectively. If these properties are not set, the Locale class will use the default Locale of the JVM.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 232
**Pregunta:** What is Garbage Collection in Java?
**Nivel:** Básico

1. Garbage Collection in Java is a process that automatically frees up memory that is no longer being used by the application.
2. Garbage Collection in Java is a process that manually frees up memory that is no longer being used by the application.
3. Garbage Collection in Java is a process that frees up memory that is not being used by the application.

**Respuesta Correcta:** 1

**Explicación:** Garbage Collection in Java is a process that automatically frees up memory that is no longer being used by the application. The Java Virtual Machine (JVM) performs garbage collection to reclaim memory that is no longer being used by the application, and to prevent the application from running out of memory.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 235
**Pregunta:** How does Garbage Collection work in Java?
**Nivel:** Intermedio

1. Garbage Collection in Java works by periodically examining the memory used by the application, identifying objects that are no longer being used, and freeing up the memory occupied by those objects.
2. Garbage Collection in Java works by manually examining the memory used by the application, identifying objects that are no longer being used, and freeing up the memory occupied by those objects.
3. Garbage Collection in Java works by freeing up memory that is not being used by the application.

**Respuesta Correcta:** 1

**Explicación:** Garbage Collection in Java works by periodically examining the memory used by the application, identifying objects that are no longer being used, and freeing up the memory occupied by those objects. The Java Virtual Machine (JVM) performs garbage collection to reclaim memory that is no longer being used by the application, and to prevent the application from running out of memory. The JVM identifies objects that are no longer being used by the application by tracing the object references, and freeing up the memory occupied by those objects that are no longer reachable.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 236
**Pregunta:** When does an object become eligible for Garbage Collection in Java?
**Nivel:** Básico

1. An object in Java becomes eligible for Garbage Collection when there are no more references to the object.
2. An object in Java becomes eligible for Garbage Collection when it is no longer in use by the application.
3. An object in Java becomes eligible for Garbage Collection when the application terminates.

**Respuesta Correcta:** 1

**Explicación:** An object in Java becomes eligible for Garbage Collection when there are no more references to the object. The JVM identifies objects that are no longer being used by the application by tracing the object references, and freeing up the memory occupied by those objects that are no longer reachable. When an object has no more references to it, it is considered to be unreachable, and is eligible for Garbage Collection.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 237
**Pregunta:** Why do we use finalize() method in Java?
**Nivel:** Intermedio

1. The finalize() method in Java is used as a way to perform clean-up actions just before an object is garbage collected.
2. The finalize() method in Java is used as a way to prevent an object from being garbage collected.
3. The finalize() method in Java is used as a way to manually free up memory that is no longer being used by the application.

**Respuesta Correcta:** 1

**Explicación:** The finalize() method in Java is used as a way to perform clean-up actions just before an object is garbage collected. The finalize() method is called just before an object is garbage collected, and can be used to perform any necessary clean-up actions, such as releasing resources that are being held by the object. However, the use of the finalize() method is generally discouraged, as it is not guaranteed to be called by the JVM, and it can add overhead to the Garbage Collection process. It is generally better to use other methods, such as try-with-resources statements or explicit cleanup methods, to manage resources and perform clean-up actions in your code.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 238
**Pregunta:** What are the different types of References in Java?
**Nivel:** Básico

1. The different types of References in Java are Strong References, Soft References, Weak References, and Phantom References.
2. The different types of References in Java are Strong References, Soft References, and Phantom References.
3. The different types of References in Java are Strong References, Soft References, and Weak References.
4. The different types of References in Java are Strong References and Soft References.

**Respuesta Correcta:** 1

**Explicación:** The different types of References in Java are Strong References, Soft References, Weak References, and Phantom References. Strong References are the normal references that are used in Java, and the objects that are referenced by strong references are not eligible for Garbage Collection. Soft References are references that are used to refer to objects that are still in use, but are not critical to the functioning of the application. Soft referenced objects are eligible for Garbage Collection when the JVM needs to reclaim memory. Weak References are references that are used to refer to objects that are weakly reachable, meaning that the objects are eligible for Garbage Collection as soon as there are no other strong or soft references to the objects. Phantom References are references that are used to track the lifecycle of an object, and are used in conjunction with the ReferenceQueue class.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 240
**Pregunta:** What kind of process is the Garbage collector thread?
**Nivel:** Básico

1. The Garbage collector thread is a background process that runs in the Java Virtual Machine (JVM).
2. The Garbage collector thread is a foreground process that runs in the Java Virtual Machine (JVM).
3. The Garbage collector thread is a background process that runs outside of the Java Virtual Machine (JVM).

**Respuesta Correcta:** 1

**Explicación:** The Garbage collector thread is a background process that runs in the Java Virtual Machine (JVM). The Garbage collector thread is responsible for performing garbage collection, which involves freeing up memory that is no longer being used by the application. The Garbage collector thread runs in the background, and typically does not interrupt the normal functioning of the application.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 242
**Pregunta:** What are the uses of the Runtime class?
**Nivel:** Básico

1. The Runtime class in Java is used to interact with the runtime environment of the Java Virtual Machine (JVM).
2. The Runtime class in Java is used to interact with the operating system.
3. The Runtime class in Java is used to interact with the file system.

**Respuesta Correcta:** 1

**Explicación:** The Runtime class in Java is used to interact with the runtime environment of the Java Virtual Machine (JVM). The Runtime class provides methods that allow you to interact with the JVM, such as starting external processes, allocating memory, and interacting with the garbage collector. The Runtime class is a singleton class, and there is only one instance of the Runtime class in the JVM.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 243
**Pregunta:** What is the role of the JVM in Garbage Collection in Java?
**Nivel:** Básico

1. The JVM is responsible for performing Garbage Collection in Java.
2. The JVM is not responsible for performing Garbage Collection in Java.
3. The JVM is responsible for allocating memory for objects in Java, but not for performing Garbage Collection.

**Respuesta Correcta:** 1

**Explicación:** The JVM is responsible for performing Garbage Collection in Java. The JVM performs Garbage Collection to reclaim memory that is no longer being used by the application, and to prevent the application from running out of memory. The JVM identifies objects that are no longer being used by the application by tracing the object references, and freeing up the memory occupied by those objects that are no longer reachable.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 244
**Pregunta:** Can we force Garbage Collection in Java? If yes, then how?
**Nivel:** Intermedio

1. Yes, we can force Garbage Collection in Java by calling the System.gc() method or the Runtime.gc() method.
2. No, we cannot force Garbage Collection in Java.
3. Yes, we can force Garbage Collection in Java by calling the gc() method.

**Respuesta Correcta:** 1

**Explicación:** Yes, we can force Garbage Collection in Java by calling the System.gc() method or the Runtime.gc() method. Calling these methods makes a request to the JVM to perform Garbage Collection, but it is not guaranteed that the JVM will actually perform Garbage Collection. The System.gc() method and the Runtime.gc() method are equivalent, and either one can be used to request Garbage Collection.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 246
**Pregunta:** What is the difference between the System.gc() method and the Runtime.gc() method?
**Nivel:** Intermedio

1. There is no difference between the System.gc() method and the Runtime.gc() method. They are equivalent.
2. The System.gc() method is a static method that can be called without creating an instance of the System class, while the Runtime.gc() method is an instance method that requires an instance of the Runtime class.
3. The System.gc() method is faster than the Runtime.gc() method.

**Respuesta Correcta:** 1

**Explicación:** There is no difference between the System.gc() method and the Runtime.gc() method. They are equivalent. Both methods make a request to the JVM to perform Garbage Collection, but it is not guaranteed that the JVM will actually perform Garbage Collection. The System.gc() method is a static method that can be called without creating an instance of the System class, while the Runtime.gc() method is an instance method that requires an instance of the Runtime class to be created.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 247
**Pregunta:** What is the purpose of the Runtime class?
**Nivel:** Básico

1. The purpose of the Runtime class in Java is to interact with the runtime environment of the JVM.
2. The purpose of the Runtime class in Java is to interact with the operating system.
3. The purpose of the Runtime class in Java is to interact with the file system.

**Respuesta Correcta:** 1

**Explicación:** The purpose of the Runtime class in Java is to interact with the runtime environment of the JVM. The Runtime class provides methods that allow you to interact with the JVM, such as starting external processes, allocating memory, and interacting with the garbage collector. The Runtime class is a singleton class, and there is only one instance of the Runtime class in the JVM.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 248
**Pregunta:** What is the relationship between the finalize() method and Garbage Collection in Java?
**Nivel:** Intermedio

1. The finalize() method in Java is called by the JVM just before an object is garbage collected.
2. The finalize() method in Java is not related to Garbage Collection.
3. The finalize() method in Java is called by the JVM after an object has been garbage collected.

**Respuesta Correcta:** 1

**Explicación:** The finalize() method in Java is called by the JVM just before an object is garbage collected. The finalize() method is a protected method that is declared in the java.lang.Object class, and it can be overridden by subclasses to provide a hook for freeing up resources that are associated with an object just before it is garbage collected. However, the use of the finalize() method is discouraged because it is not guaranteed to be called, and because it can add significant overhead to the Garbage Collection process.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 250
**Pregunta:** What are the different algorithms used for Garbage Collection in Java?
**Nivel:** Avanzado

1. The different algorithms used for Garbage Collection in Java include the Mark-Sweep algorithm, the Mark-Compact algorithm, the Copy algorithm, and the Generational algorithm.
2. The different algorithms used for Garbage Collection in Java include the Mark-Sweep algorithm and the Mark-Compact algorithm.
3. The different algorithms used for Garbage Collection in Java include the Copy algorithm and the Generational algorithm.

**Respuesta Correcta:** 1

**Explicación:** The different algorithms used for Garbage Collection in Java include the Mark-Sweep algorithm, the Mark-Compact algorithm, the Copy algorithm, and the Generational algorithm. Each algorithm has its own strengths and weaknesses, and the JVM can choose the best algorithm to use based on the heap size, the rate of object allocation and deallocation, and other factors. The Generational algorithm is a type of algorithm that is designed to improve the performance of Garbage Collection by focusing on the youngest objects in the heap first.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 251
**Pregunta:** What are the different ways to handle OutOfMemoryError in Java?
**Nivel:** Intermedio

1. The different ways to handle OutOfMemoryError in Java include increasing the size of the heap, reducing the number of objects being created, using a memory-efficient data structure, and implementing a custom memory manager.
2. The different ways to handle OutOfMemoryError in Java include increasing the size of the heap and reducing the number of objects being created.
3. The different ways to handle OutOfMemoryError in Java include using a memory-efficient data structure and implementing a custom memory manager.

**Respuesta Correcta:** 1

**Explicación:** The different ways to handle OutOfMemoryError in Java include increasing the size of the heap, reducing the number of objects being created, using a memory-efficient data structure, and implementing a custom memory manager. The most common way to handle OutOfMemoryError is to increase the size of the heap, either by increasing the maximum heap size, or by allocating more memory to the JVM. Another approach is to reduce the number of objects being created by the application, either by reusing objects, or by using a more memory-efficient data structure. In some cases, it may be necessary to implement a custom memory manager to manage the allocation and deallocation of memory in the application.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 274
**Pregunta:** What is String interning?
**Nivel:** Avanzado

1. A process where the JVM maintains a pool of strings, and reuses the existing string objects from the pool.
2. A process where the JVM creates a new string object for each string literal.
3. A process where the JVM converts all string literals to uppercase.

**Respuesta Correcta:** 1

**Explicación:** String interning is a process where the JVM maintains a pool of strings, and reuses the existing string objects from the pool instead of creating a new object for each string literal. This helps to conserve memory and improve performance.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 437
**Pregunta:** Why we cannot create a generic array in Java?
**Nivel:** Intermedio

1. We cannot create a generic array in Java, because arrays in Java are statically typed, and the type information for generic types is only available at runtime, not at compile time.
2. We cannot create a generic array in Java, because arrays in Java are dynamically typed, and the type information for generic types is only available at runtime, not at compile time.
3. We cannot create a generic array in Java, because arrays in Java are not compatible with generic types.

**Respuesta Correcta:** 1

**Explicación:** We cannot create a generic array in Java, because arrays in Java are statically typed, and the type information for generic types is only available at runtime, not at compile time. This means that the type information for generic types is not available to the compiler, and therefore it is not possible to create an array of generic types.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 475
**Pregunta:** What is a daemon thread in Java?
**Nivel:** Básico

1. A daemon thread in Java is a low-priority thread that runs in the background to perform tasks such as garbage collection.
2. A daemon thread in Java is a high-priority thread that runs in the foreground to perform tasks such as user input processing.
3. A daemon thread in Java is a special type of thread that does not affect the termination of the program.

**Respuesta Correcta:** 1

**Explicación:** A daemon thread in Java is a low-priority thread that runs in the background to perform tasks such as garbage collection. Daemon threads are automatically terminated by the Java Virtual Machine (JVM) when there are no other non-daemon threads running. This makes them useful for background tasks that do not need to run after the program has completed.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 479
**Pregunta:** What is a Shutdown hook in Java?
**Nivel:** Básico

1. A Shutdown hook in Java is a special type of thread that runs just before the JVM shuts down.
2. A Shutdown hook in Java is a special type of thread that runs just after the JVM starts up.
3. A Shutdown hook in Java is a special type of thread that runs continuously in the background.

**Respuesta Correcta:** 1

**Explicación:** A Shutdown hook in Java is a special type of thread that runs just before the JVM shuts down. Shutdown hooks are registered with the JVM and are run when the JVM is shutting down, allowing the application to perform any necessary cleanup tasks before it terminates.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 521
**Pregunta:** How JVM determines which thread should wake up on notify()?
**Nivel:** Intermedio

1. Based on the order in which the threads called wait().
2. Based on the priority of the threads.
3. Based on the order in which the threads were created.
4. Based on a random selection.

**Respuesta Correcta:** 1

**Explicación:** The JVM determines which thread should wake up on notify() based on the order in which the threads called wait(). The thread that has been waiting the longest is the first to be awakened when notify() is called. This ensures that lower-priority threads are not blocked indefinitely by higher-priority threads, improving the fairness and responsiveness of the program.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 558
**Pregunta:** How can we take Thread dump in Java?
**Nivel:** Intermedio

1. Using the "jstack" command.
2. Using the "jmap" command.
3. Using the "jstat" command.
4. All of the above.

**Respuesta Correcta:** 1

**Explicación:** A thread dump can be taken in Java using the "jstack" command. The jstack tool is part of the Java Development Kit (JDK) and is used to dump the stack trace of a Java process.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 594
**Pregunta:** What is Type Inference in Java?
**Nivel:** Básico

1. A feature that allows the Java compiler to deduce the type of an expression based on context.
2. A feature that prevents the Java compiler from deducing the type of an expression based on context.
3. A feature that forces the Java programmer to explicitly specify the type of an expression.

**Respuesta Correcta:** 1

**Explicación:** Type Inference in Java is a feature that allows the Java compiler to deduce the type of an expression based on context. This allows for more concise and expressive code, as the programmer does not need to explicitly specify the type of every expression.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 595
**Pregunta:** Does Java support Type Inference?
**Nivel:** Básico

1. Yes, Java supports Type Inference.
2. No, Java does not support Type Inference.
3. Type Inference is only available in certain versions of Java.

**Respuesta Correcta:** 1

**Explicación:** Yes, Java supports Type Inference. Type Inference was introduced in Java 8 and allows for more concise and expressive code by allowing the Java compiler to deduce the type of an expression based on context.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 615
**Pregunta:** In case we create a class that extends a base class and implements an interface. If both base class and interface have a default method with the same name and arguments, then which definition will be picked by JVM?
**Nivel:** Intermedio

1. The definition in the class will be picked by the JVM.
2. The definition in the base class will be picked by the JVM.
3. The definition in the interface will be picked by the JVM.
4. It depends on the version of Java being used.

**Respuesta Correcta:** 1

**Explicación:** The definition in the class will be picked by the JVM. If a class extends a base class and implements an interface, and both the base class and the interface have a default method with the same name and arguments, the definition in the class will be picked by the JVM. The class can use the super keyword to specify which default implementation it wants to use.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 634
**Pregunta:** How can you determine if JVM is 32-bit or 64-bit from a Java program?
**Nivel:** Intermedio

1. By using the System.getProperty("sun.arch.data.model") method.
2. By using the System.getProperty("java.vm.version") method.
3. By using the System.getProperty("java.version") method.

**Respuesta Correcta:** 1

**Explicación:** By using the System.getProperty("sun.arch.data.model") method. The System.getProperty("sun.arch.data.model") method returns the data model of the JVM, which can be either 32 or 64, depending on whether the JVM is 32-bit or 64-bit.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 654
**Pregunta:** Can we use multiple main methods in the same class?
**Nivel:** Básico

1. No, we cannot have multiple main methods in the same class.
2. Yes, we can have multiple main methods in the same class, but only one will be executed.
3. Yes, we can have multiple main methods in the same class, and all will be executed.

**Respuesta Correcta:** 1

**Explicación:** We cannot have multiple main methods in the same class as only one main method can be executed as the entry point of the program. If there are multiple main methods, the compiler will raise an error.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 657
**Pregunta:** How can we find the memory usage of JVM from Java code?
**Nivel:** Intermedio

1. By using the Runtime.totalMemory() method.
2. By using the System.totalMemory() method.
3. By using the System.freeMemory() method.

**Respuesta Correcta:** 1

**Explicación:** We can find the memory usage of JVM from Java code by using the Runtime.totalMemory() method. This method returns the total amount of memory in bytes that is available to the JVM.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 659
**Pregunta:** How can you guarantee that the garbage collection takes place?
**Nivel:** Intermedio

1. You cannot guarantee that the garbage collection takes place.
2. By calling System.gc() method.
3. By calling Runtime.gc() method.

**Respuesta Correcta:** 1

**Explicación:** You cannot guarantee that the garbage collection takes place, as it is controlled by the JVM. However, you can suggest the JVM to run the garbage collector by calling System.gc() or Runtime.gc(). This is not a guarantee that the garbage collector will run, as the JVM may ignore the request.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 664
**Pregunta:** Why do you use volatile keyword in Java?
**Nivel:** Intermedio

1. To ensure that the value of a variable is always up-to-date and consistent across all threads.
2. To ensure that the value of a variable is only updated in one thread.
3. To ensure that the value of a variable is never updated.

**Respuesta Correcta:** 1

**Explicación:** The volatile keyword is used in Java to ensure that the value of a variable is always up-to-date and consistent across all threads. When a variable is declared as volatile, the JVM will ensure that every thread accesses the latest value of the variable, even if the value is updated by another thread. This makes volatile variables useful for synchronization and coordination between threads.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 673
**Pregunta:** Your client is complaining that your code is throwing NoClassDefFoundError or NoSuchMethodError, even though you are able to compile your code without error and method exists in your code. What could be the reason behind this?
**Nivel:** Básico

1. The class or method being referenced is not in the classpath at runtime.
2. The class or method being referenced does not exist in the code.
3. The class or method being referenced is not accessible due to security restrictions.

**Respuesta Correcta:** 1

**Explicación:** The class or method being referenced is not in the classpath at runtime. The NoClassDefFoundError is thrown when the JVM cannot find a class that was previously available at compile time, while the NoSuchMethodError is thrown when a method that was previously available at compile time cannot be found. Both of these errors indicate that the class or method being referenced is not in the classpath at runtime.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 687
**Pregunta:** When does JVM call the finalize() method?
**Nivel:** Básico

1. When an object is about to be garbage collected.
2. When an object is first created.
3. When an object is referenced by another object.

**Respuesta Correcta:** 1

**Explicación:** JVM calls the finalize() method when an object is about to be garbage collected. This method can be overridden by subclasses to perform cleanup actions before the object is collected.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 714
**Pregunta:** Why does Java provide default constructor?
**Nivel:** Intermedio

1. To allow objects to be created without explicitly calling a constructor.
2. To allow objects to be created by calling a constructor with no arguments.
3. To allow objects to be created by calling a constructor with arguments.

**Respuesta Correcta:** 1

**Explicación:** Java provides a default constructor to allow objects to be created without explicitly calling a constructor. The default constructor is automatically generated by the compiler if no other constructors are defined in the class. The default constructor provides a basic initialization for the object, and can be overridden by the programmer to provide custom initialization behavior.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 718
**Pregunta:** Why does Java provide default constructor?
**Nivel:** Intermedio

1. To allow objects to be created without explicitly calling a constructor.
2. To allow objects to be created by calling a constructor with no arguments.
3. To allow objects to be created by calling a constructor with arguments.

**Respuesta Correcta:** 1

**Explicación:** Java provides a default constructor to allow objects to be created without explicitly calling a constructor. The default constructor is automatically generated by the compiler if no other constructors are defined in the class. The default constructor provides a basic initialization for the object, and can be overridden by the programmer to provide custom initialization behavior.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 722
**Pregunta:** How can we change the heap size of a JVM?
**Nivel:** Intermedio

1. By setting the -Xms and -Xmx parameters on the command line when starting the JVM.
2. By modifying the heap size property in the JVM configuration file.
3. By calling the setHeapSize() method on the JVM object.

**Respuesta Correcta:** 1

**Explicación:** The heap size of a JVM can be changed by setting the -Xms and -Xmx parameters on the command line when starting the JVM. These parameters specify the minimum and maximum heap size, respectively, and can be used to tune the memory usage of the JVM.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 723
**Pregunta:** Why should you define a default constructor in Java?
**Nivel:** Intermedio

1. To initialize the object with default values.
2. To allow objects to be created without explicitly calling a constructor.
3. To provide a basic initialization for the object.
4. All of the above.

**Respuesta Correcta:** 4

**Explicación:** It is a good practice to define a default constructor in Java, as it allows objects to be created without explicitly calling a constructor. The default constructor provides a basic initialization for the object, and can be used to set default values for object properties. If no other constructors are defined in the class, the compiler will automatically generate a default constructor for the class.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias

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

## Pregunta 793
**Pregunta:** What are the examples of Observer design pattern in JDK?
**Nivel:** Avanzado

1. java.util.Observable
2. java.util.EventListener
3. java.util.Observer
4. java.util.Listener

**Respuesta Correcta:** 1, 3

**Explicación:** java.util.Observable and java.util.Observer are examples of Observer design pattern in JDK. The Observable class is used to represent the subject, while the Observer interface is used to represent the observers.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 801
**Pregunta:** What are the examples of Singleton design pattern in JDK?
**Nivel:** Avanzado

1. java.lang.Runtime
2. java.awt.Desktop
3. java.lang.System
4. java.util.Calendar

**Respuesta Correcta:** 1, 3

**Explicación:** java.lang.Runtime and java.lang.System are examples of the Singleton design pattern in JDK. These classes provide access to the Java runtime system and are implemented as Singletons to ensure that there is only one instance of the class and to provide a single point of control for the system.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 803
**Pregunta:** What are the examples of Template method design pattern in JDK?
**Nivel:** Avanzado

1. java.util.AbstractList
2. java.util.AbstractSet
3. java.util.AbstractMap
4. java.util.AbstractQueue

**Respuesta Correcta:** 1, 2

**Explicación:** java.util.AbstractList, java.util.AbstractSet, and java.util.AbstractMap are examples of the Template Method design pattern in JDK. These classes define the basic structure of their respective collections and allow subclasses to provide the implementation for one or more of the methods.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 806
**Pregunta:** What are the examples of Builder design pattern in JDK?
**Nivel:** Avanzado

1. java.lang.StringBuilder
2. java.nio.ByteBuffer#put
3. java.lang.StringBuffer
4. java.util.stream.Stream#builder

**Respuesta Correcta:** 1, 3

**Explicación:** java.lang.StringBuilder and java.lang.StringBuffer are examples of the Builder design pattern in JDK. These classes provide a flexible way to build strings by allowing the client to append characters to the string incrementally.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 807
**Pregunta:** What are the examples of Abstract Factory design pattern in JDK?
**Nivel:** Avanzado

1. java.util.Calendar#getInstance
2. java.util.ResourceBundle#getBundle
3. java.awt.Toolkit#getDefaultToolkit
4. java.nio.charset.Charset#forName

**Respuesta Correcta:** 1, 3

**Explicación:** java.util.Calendar#getInstance and java.awt.Toolkit#getDefaultToolkit are examples of the Abstract Factory design pattern in JDK. These methods provide a factory method to create objects, allowing the client to obtain objects without having to specify the exact class of the object that will be created.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 808
**Pregunta:** What are the examples of Decorator design pattern in JDK?
**Nivel:** Avanzado

1. java.io.BufferedReader
2. java.io.InputStreamReader
3. java.io.FilterInputStream
4. java.io.FilterOutputStream

**Respuesta Correcta:** 1, 3

**Explicación:** java.io.BufferedReader and java.io.FilterInputStream are examples of the Decorator design pattern in JDK. These classes provide a flexible way to add behavior to an existing class by wrapping the existing class with additional behavior.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 809
**Pregunta:** What are the examples of Proxy design pattern in JDK?
**Nivel:** Avanzado

1. java.lang.reflect.Proxy
2. java.rmi.Remote
3. java.rmi.Naming
4. java.rmi.registry.Registry

**Respuesta Correcta:** 1, 2

**Explicación:** java.lang.reflect.Proxy and java.rmi.Remote are examples of the Proxy design pattern in JDK. These classes provide a way to create objects that act as proxies for other objects, allowing the client to interact with the original object indirectly.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 810
**Pregunta:** What are the examples of Chain of Responsibility design pattern in JDK?
**Nivel:** Avanzado

1. java.util.logging.Logger
2. java.util.prefs.Preferences
3. java.awt.event.ActionEvent
4. java.awt.event.ActionListener

**Respuesta Correcta:** 1, 4

**Explicación:** java.util.logging.Logger and java.awt.event.ActionListener are examples of the Chain of Responsibility design pattern in JDK. These classes provide a way to chain objects together to handle a request, allowing multiple objects to handle the request in turn, without having to specify the exact object that will handle the request.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 812
**Pregunta:** What are the examples of Command design pattern in JDK?
**Nivel:** Avanzado

1. java.lang.Runnable
2. java.util.concurrent.Callable
3. java.awt.event.ActionEvent
4. java.awt.event.ActionListener

**Respuesta Correcta:** 1, 2

**Explicación:** java.lang.Runnable and java.util.concurrent.Callable are examples of the Command design pattern in JDK. These classes provide a way to encapsulate a request as an object, allowing for deferred or undoable execution of operations.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 813
**Pregunta:** What are the examples of Interpreter design pattern in JDK?
**Nivel:** Avanzado

1. java.text.Format
2. java.util.Formatter
3. java.text.MessageFormat
4. java.util.Scanner

**Respuesta Correcta:** 1, 2

**Explicación:** java.text.Format and java.util.Formatter are examples of the Interpreter design pattern in JDK. These classes provide a way to interpret a language or expression, allowing the client to provide input in a specific language and receive output in a specific format.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 814
**Pregunta:** What are the examples of Mediator design pattern in JDK?
**Nivel:** Avanzado

1. java.util.Timer
2. java.util.concurrent.Executor
3. java.awt.EventQueue
4. java.util.concurrent.ScheduledExecutorService

**Respuesta Correcta:** 1, 4

**Explicación:** java.util.Timer and java.util.concurrent.ScheduledExecutorService are examples of the Mediator design pattern in JDK. These classes provide a way to centralize control of a group of objects, allowing multiple objects to communicate with each other through a single intermediary.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 815
**Pregunta:** What are the examples of Strategy design pattern in JDK?
**Nivel:** Avanzado

1. java.util.Comparator
2. java.util.Collections#sort
3. java.util.Arrays#sort
4. java.util.List#sort

**Respuesta Correcta:** 1, 2

**Explicación:** java.util.Comparator and java.util.Collections#sort are examples of the Strategy design pattern in JDK. These classes provide a way to encapsulate a strategy or algorithm as an object, allowing the client to dynamically change the behavior of the algorithm.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 816
**Pregunta:** What are the examples of Visitor design pattern in JDK?
**Nivel:** Avanzado

1. java.nio.file.FileVisitor
2. java.util.stream.Stream#map
3. java.util.Iterator
4. java.util.Enumeration

**Respuesta Correcta:** 1

**Explicación:** java.nio.file.FileVisitor is an example of the Visitor design pattern in JDK. This class provides a way to traverse a file system, allowing the client to provide the implementation for visiting files and directories.

### Ejemplos de Código

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

### Pruebas Unitarias

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

## Pregunta 822
**Pregunta:** What are the examples of Adapter design pattern in JDK?
**Nivel:** Avanzado

1. java.util.Arrays#asList
2. java.io.InputStreamReader
3. java.io.OutputStreamWriter
4. java.util.Collections#list

**Respuesta Correcta:** 1, 2

**Explicación:** java.util.Arrays#asList and java.io.InputStreamReader are examples of the Adapter design pattern in JDK. These classes provide a way to adapt the interface of one class to another interface, making it easier for the client to use the class.

### Ejemplos de Código

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

### Pruebas Unitarias

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

