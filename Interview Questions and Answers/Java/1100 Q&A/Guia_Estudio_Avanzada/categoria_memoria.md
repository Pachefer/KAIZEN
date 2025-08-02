# Memoria - Preguntas de Entrevista Java
**Total de preguntas: 54**

## Pregunta 233
**Pregunta:** Why Java provides Garbage Collector?
**Nivel:** Avanzado

1. Java provides a Garbage Collector to automatically free up memory that is no longer being used by the application, in order to prevent the application from running out of memory.
2. Java provides a Garbage Collector to manually free up memory that is no longer being used by the application.
3. Java provides a Garbage Collector to free up memory that is not being used by the application.

**Respuesta Correcta:** 1

**Explicación:** Java provides a Garbage Collector to automatically free up memory that is no longer being used by the application, in order to prevent the application from running out of memory. By automatically freeing up memory that is no longer being used, the Garbage Collector helps to ensure that the application has enough memory to continue running, and helps to prevent memory leaks and other memory-related problems.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 234
**Pregunta:** What is the purpose of gc() in Java?
**Nivel:** Básico

1. The purpose of the gc() method in Java is to explicitly request that the Garbage Collector run and reclaim memory that is no longer being used by the application.
2. The purpose of the gc() method in Java is to explicitly request that the Garbage Collector manually reclaim memory that is no longer being used by the application.
3. The purpose of the gc() method in Java is to explicitly request that the Garbage Collector free up memory that is not being used by the application.

**Respuesta Correcta:** 1

**Explicación:** The purpose of the gc() method in Java is to explicitly request that the Garbage Collector run and reclaim memory that is no longer being used by the application. The gc() method can be used to explicitly request that the Garbage Collector run, although it is not guaranteed that the Garbage Collector will actually run in response to a call to gc(). The Garbage Collector runs automatically, so you do not typically need to call gc() in your code.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 245
**Pregunta:** What are the advantages of using Garbage Collection in Java?
**Nivel:** Avanzado

1. The advantages of using Garbage Collection in Java include automatic memory management, improved application performance, and reduced risk of memory leaks.
2. The advantages of using Garbage Collection in Java include automatic memory management and reduced risk of memory leaks.
3. The advantages of using Garbage Collection in Java include improved application performance and reduced risk of memory leaks.
4. The advantages of using Garbage Collection in Java include improved application performance.

**Respuesta Correcta:** 1

**Explicación:** The advantages of using Garbage Collection in Java include automatic memory management, improved application performance, and reduced risk of memory leaks. Garbage Collection frees up memory that is no longer being used by the application, which can help to improve application performance. Additionally, by automatically freeing up memory, Garbage Collection reduces the risk of memory leaks, which can cause the application to run out of memory and crash.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 280
**Pregunta:** What is the difference between the == and equals() method when comparing Strings in Java?
**Nivel:** Intermedio

1. The == operator compares the memory addresses of two strings, while the equals() method compares the contents of two strings.
2. The equals() method compares the memory addresses of two strings, while the == operator compares the contents of two strings.
3. Both the == operator and the equals() method compare the memory addresses of two strings.
4. Both the == operator and the equals() method compare the contents of two strings.

**Respuesta Correcta:** 1

**Explicación:** The == operator compares the memory addresses of two strings, while the equals() method compares the contents of two strings. This means that the == operator will return true if two strings have the same memory address, while the equals() method will return true if two strings have the same contents.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 300
**Pregunta:** What is the concept of Exception Propagation?
**Nivel:** Básico

1. The process of passing an exception up the call stack to be handled by a higher level of the program.
2. The process of passing an exception down the call stack to be handled by a lower level of the program.
3. The process of logging an exception without passing it to another level of the program.

**Respuesta Correcta:** 1

**Explicación:** The concept of Exception Propagation refers to the process of passing an exception up the call stack to be handled by a higher level of the program. If an exception is not caught and handled in the method where it was thrown, it will be propagated to the caller of that method, and so on, until it is caught and handled by a catch block or until the program terminates.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 324
**Pregunta:** What is the difference between a process and a thread in Java?
**Nivel:** Intermedio

1. A process is a program in execution, while a thread is a lightweight sub-process that runs within a process and shares the process's resources.
2. A process is a lightweight sub-process that runs within a process and shares the process's resources, while a thread is a program in execution.
3. Both a process and a thread are the same thing in Java.

**Respuesta Correcta:** 1

**Explicación:** A process is a program in execution, while a thread is a lightweight sub-process that runs within a process and shares the process's resources. A process is a standalone program that runs on a computer and has its own memory space, system resources, and environment. A thread, on the other hand, is a smaller unit of execution that runs within a process and shares the process's memory space, system resources, and environment.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 330
**Pregunta:** What is the use of the volatile keyword in Java multi-threading?
**Nivel:** Básico

1. The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from main memory and not from the thread cache, ensuring that multiple threads access the latest value of the variable.
2. The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from the thread cache and not from main memory, improving the performance of the program.
3. The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from both the thread cache and main memory, improving the reliability of the program.

**Respuesta Correcta:** 1

**Explicación:** The use of the volatile keyword in Java multi-threading is to ensure that a variable's value is read from main memory and not from the thread cache, ensuring that multiple threads access the latest value of the variable. The volatile keyword can be used to declare a variable as volatile, which means that its value can be changed by multiple threads and that the value of the variable is guaranteed to be the latest value when accessed from any thread. This can be useful for ensuring that multiple threads access the latest value of a variable, improving the reliability of the program.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 335
**Pregunta:** What are the differences between a List and Set collection in Java?
**Nivel:** Intermedio

1. Lists allow duplicate elements, while Sets do not.
2. Sets allow duplicate elements, while Lists do not.
3. Both Lists and Sets allow duplicate elements.

**Respuesta Correcta:** 1

**Explicación:** Lists allow duplicate elements, while Sets do not. Sets are collections that store unique elements, while Lists are collections that can store duplicate elements.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 336
**Pregunta:** What are the differences between a HashSet and TreeSet collection in Java?
**Nivel:** Intermedio

1. HashSet is unordered, while TreeSet is ordered.
2. TreeSet is unordered, while HashSet is ordered.
3. Both HashSet and TreeSet are ordered.

**Respuesta Correcta:** 1

**Explicación:** HashSet is unordered, meaning the elements are stored in a random order, while TreeSet is ordered, meaning the elements are stored in a sorted order.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 344
**Pregunta:** Is it a good idea to use Generics in collections?
**Nivel:** Básico

1. Yes, it is a good idea to use Generics in collections as it provides type safety and eliminates the need for type casting.
2. No, it is not a good idea to use Generics in collections as it adds complexity to the code.
3. It depends on the use case.

**Respuesta Correcta:** 1

**Explicación:** Yes, it is a good idea to use Generics in collections as it provides type safety and eliminates the need for type casting. This makes the code more readable and less prone to errors.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 345
**Pregunta:** What are the different types of collections in Java and what are their uses?
**Nivel:** Básico

1. List, Set, Map, and Queue. They are used for storing, manipulating, and retrieving elements.
2. Stack, Queue, Set, and Map. They are used for storing, manipulating, and retrieving elements.
3. Tree, Set, Map, and List. They are used for storing, manipulating, and retrieving elements.

**Respuesta Correcta:** 1

**Explicación:** List, Set, Map, and Queue are the different types of collections in Java. They are used for storing, manipulating, and retrieving elements. List stores elements in a specific order, Set stores unique elements, Map stores key-value pairs, and Queue stores elements in a specific order for processing.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 346
**Pregunta:** What is the difference between Iterator and ListIterator in Java?
**Nivel:** Intermedio

1. Iterator allows you to traverse elements in a collection in a forward direction, while ListIterator allows you to traverse elements in a collection in both forward and backward directions.
2. ListIterator allows you to traverse elements in a collection in a forward direction, while Iterator allows you to traverse elements in a collection in both forward and backward directions.
3. Both Iterator and ListIterator allow you to traverse elements in a collection in a forward direction.

**Respuesta Correcta:** 1

**Explicación:** Iterator allows you to traverse elements in a collection in a forward direction, while ListIterator allows you to traverse elements in a collection in both forward and backward directions. This makes ListIterator more flexible than Iterator.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 353
**Pregunta:** What is the difference between a Queue and a Stack in Java?
**Nivel:** Intermedio

1. Queue follows the First-In-First-Out (FIFO) principle, while Stack follows the Last-In-First-Out (LIFO) principle.
2. Stack follows the First-In-First-Out (FIFO) principle, while Queue follows the Last-In-First-Out (LIFO) principle.
3. Both Queue and Stack follow the First-In-First-Out (FIFO) principle.

**Respuesta Correcta:** 1

**Explicación:** Queue follows the First-In-First-Out (FIFO) principle, meaning that the first element added to the queue will be the first element to be removed, while Stack follows the Last-In-First-Out (LIFO) principle, meaning that the last element added to the stack will be the first element to be removed.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 369
**Pregunta:** How will you efficiently remove elements while iterating a Collection?
**Nivel:** Avanzado

1. You can efficiently remove elements while iterating a Collection by using an Iterator and the remove() method.
2. You can efficiently remove elements while iterating a Collection by using a for loop and the remove() method.
3. You can efficiently remove elements while iterating a Collection by using a for each loop and the remove() method.

**Respuesta Correcta:** 1

**Explicación:** You can efficiently remove elements while iterating a Collection by using an Iterator and the remove() method. This allows you to remove elements from the Collection while iterating through it, without causing any ConcurrentModificationExceptions or other errors.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 376
**Pregunta:** What is the difference between Collections.emptyList() and creating new instance of Collection?
**Nivel:** Intermedio

1. Collections.emptyList() returns a read-only list, while creating a new instance of Collection allows you to add elements to the Collection.
2. Collections.emptyList() returns a write-only list, while creating a new instance of Collection allows you to add elements to the Collection.
3. Collections.emptyList() returns a fixed-size list, while creating a new instance of Collection allows you to add or remove elements from the Collection.

**Respuesta Correcta:** 1

**Explicación:** Collections.emptyList() returns a read-only list, while creating a new instance of Collection allows you to add elements to the Collection. This means that Collections.emptyList() returns an empty list that cannot be modified, while creating a new instance of a Collection such as ArrayList or LinkedList allows you to add elements to the Collection.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 383
**Pregunta:** What is the difference between a Set and a Map in Java?
**Nivel:** Intermedio

1. A Set is a collection of unique elements, while a Map is a collection of key-value pairs.
2. A Set is a collection of ordered elements, while a Map is a collection of unordered elements.
3. A Set is a collection of elements that allows duplicates, while a Map is a collection of elements that does not allow duplicates.

**Respuesta Correcta:** 1

**Explicación:** A Set is a collection of unique elements, while a Map is a collection of key-value pairs. This means that a Set stores a collection of individual elements without any associated data, while a Map stores a collection of key-value pairs, where each key is associated with a value.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 387
**Pregunta:** What are the major differences between a HashSet and a HashMap?
**Nivel:** Intermedio

1. The major difference between a HashSet and a HashMap is that a HashSet stores a collection of unique elements without any associated data, while a HashMap stores a collection of key-value pairs, where each key is associated with a value.
2. The major difference between a HashSet and a HashMap is that a HashSet stores a collection of elements in a sorted order, while a HashMap stores a collection of elements in an unsorted order.
3. The major difference between a HashSet and a HashMap is that a HashSet stores a collection of elements that allows duplicates, while a HashMap stores a collection of elements that does not allow duplicates.

**Respuesta Correcta:** 1

**Explicación:** The major difference between a HashSet and a HashMap is that a HashSet stores a collection of unique elements without any associated data, while a HashMap stores a collection of key-value pairs, where each key is associated with a value. This means that a HashSet provides a simple way to store a collection of unique elements, while a HashMap provides a way to associate data with each element in the collection.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 390
**Pregunta:** How can we synchronize the elements of a List, a Set or a Map?
**Nivel:** Intermedio

1. By using the synchronized keyword.
2. By using the volatile keyword.
3. By using the transient keyword.

**Respuesta Correcta:** 1

**Explicación:** To synchronize the elements of a List, a Set, or a Map, you can use the synchronized keyword. This ensures that only one thread can access the collection at a time, preventing data inconsistencies and race conditions.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 393
**Pregunta:** What is the difference between Queue and Stack data structures?
**Nivel:** Intermedio

1. Queue follows First-In-First-Out (FIFO) and Stack follows Last-In-First-Out (LIFO).
2. Queue follows Last-In-First-Out (LIFO) and Stack follows First-In-First-Out (FIFO).
3. Both Queue and Stack follow First-In-First-Out (FIFO).

**Respuesta Correcta:** 1

**Explicación:** Queue follows First-In-First-Out (FIFO) and Stack follows Last-In-First-Out (LIFO). In Queue, the first element added to the queue is the first one to be removed, while in Stack, the last element added to the stack is the first one to be removed.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 395
**Pregunta:** What is the difference between Iterator and Enumeration in Java?
**Nivel:** Intermedio

1. Iterator has a remove() method, while Enumeration does not.
2. Enumeration has a remove() method, while Iterator does not.
3. Both Iterator and Enumeration have a remove() method.

**Respuesta Correcta:** 1

**Explicación:** Iterator has a remove() method, while Enumeration does not. Iterator is a more advanced version of Enumeration, offering more functionality and flexibility when working with collections.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 411
**Pregunta:** What is the difference between Fail-fast and Fail-safe iterator in Java?
**Nivel:** Avanzado

1. Fail-fast iterator throws a ConcurrentModificationException if the underlying collection is modified during iteration, while fail-safe iterator does not.
2. Fail-safe iterator throws a ConcurrentModificationException if the underlying collection is modified during iteration, while fail-fast iterator does not.
3. Both Fail-fast and Fail-safe iterator do not throw a ConcurrentModificationException if the underlying collection is modified during iteration.

**Respuesta Correcta:** 1

**Explicación:** Fail-fast iterator throws a ConcurrentModificationException if the underlying collection is modified during iteration, while fail-safe iterator does not. Fail-fast iterator works on the original collection, while fail-safe iterator works on a copy of the collection.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 424
**Pregunta:** When is UnsupportedOperationException thrown in Java?
**Nivel:** Básico

1. UnsupportedOperationException is thrown when an unsupported operation is attempted on a Collection.
2. UnsupportedOperationException is thrown when an supported operation is attempted on a Collection.
3. UnsupportedOperationException is thrown when an error occurs during an operation on a Collection.

**Respuesta Correcta:** 1

**Explicación:** UnsupportedOperationException is thrown in Java when an unsupported operation is attempted on a Collection. For example, if a Collection is made read-only using the unmodifiableCollection() method, and an attempt is made to modify the Collection, an UnsupportedOperationException will be thrown.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 425
**Pregunta:** What is the difference between Synchronized Collection and Concurrent Collection?
**Nivel:** Avanzado

1. Synchronized Collection is a Collection that is synchronized for thread-safety, while Concurrent Collection is a Collection that is designed for high performance and thread-safety.
2. Synchronized Collection is a Collection that is designed for high performance and thread-safety, while Concurrent Collection is a Collection that is synchronized for thread-safety.
3. Both Synchronized Collection and Concurrent Collection are Collections that are synchronized for thread-safety.

**Respuesta Correcta:** 2

**Explicación:** The difference between a Synchronized Collection and a Concurrent Collection is that a Synchronized Collection is a Collection that is synchronized for thread-safety, while a Concurrent Collection is a Collection that is designed for high performance and thread-safety. A Synchronized Collection provides basic thread-safety by synchronizing access to the Collection, while a Concurrent Collection provides high performance and thread-safety by using advanced techniques such as lock-free data structures and fine-grained locking.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 428
**Pregunta:** What is the difference between remove() method of Collection and remove() method of Iterator?
**Nivel:** Intermedio

1. The remove() method of Collection removes the specified element from the Collection, while the remove() method of Iterator removes the current element from the Collection.
2. The remove() method of Collection removes the current element from the Collection, while the remove() method of Iterator removes the specified element from the Collection.
3. Both the remove() method of Collection and the remove() method of Iterator remove the specified element from the Collection.

**Respuesta Correcta:** 2

**Explicación:** The difference between the remove() method of Collection and the remove() method of Iterator is that the remove() method of Collection removes the specified element from the Collection, while the remove() method of Iterator removes the current element from the Collection. The remove() method of Iterator is used to remove elements while iterating over a Collection, while the remove() method of Collection is used to remove elements from the Collection.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 434
**Pregunta:** How will you convert a Map to a List in Java?
**Nivel:** Intermedio

1. By using the values() method of the Map to get a Collection of the values in the Map, and then converting the Collection to a List using the List constructor.
2. By using the keys() method of the Map to get a Set of the keys in the Map, and then converting the Set to a List using the List constructor.
3. By using the entrySet() method of the Map to get a Set of the entries in the Map, and then converting the Set to a List using the List constructor.

**Respuesta Correcta:** 1

**Explicación:** You can convert a Map to a List in Java by using the values() method of the Map to get a Collection of the values in the Map, and then converting the Collection to a List using the List constructor. The values() method returns a Collection of the values in the Map, which can be converted to a List using the List constructor.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 440
**Pregunta:** How can we pass a Collection as an argument to a method and ensure that method will not be able to modify it?
**Nivel:** Intermedio

1. By passing a read-only Collection, such as an instance of Collections.unmodifiableCollection(), to the method.
2. By passing a synchronized Collection, such as an instance of Collections.synchronizedCollection(), to the method.
3. By passing a copy of the Collection, such as an instance of a new ArrayList created from the original Collection, to the method.

**Respuesta Correcta:** 1

**Explicación:** You can pass a Collection as an argument to a method and ensure that the method will not be able to modify it by passing a read-only Collection, such as an instance of Collections.unmodifiableCollection(), to the method. The unmodifiableCollection() method returns a Collection that cannot be modified, and any attempt to modify the Collection will result in an UnsupportedOperationException being thrown.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 454
**Pregunta:** What is the difference between Iterator and ListIterator in terms of functionality?
**Nivel:** Intermedio

1. Iterator allows you to traverse a collection in a single direction and remove elements, while ListIterator allows you to traverse a list in both directions and add and remove elements.
2. Iterator allows you to traverse a collection in both directions and add and remove elements, while ListIterator allows you to traverse a list in a single direction and remove elements.
3. Both Iterator and ListIterator have the same functionality.

**Respuesta Correcta:** 1

**Explicación:** Iterator allows you to traverse a collection in a single direction and remove elements, while ListIterator allows you to traverse a list in both directions and add and remove elements. ListIterator also provides methods to access the previous and next elements in the list, and to retrieve the index of the current element.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 456
**Pregunta:** What is the difference between a Stack and a Queue in Java?
**Nivel:** Intermedio

1. Stack is a last-in-first-out (LIFO) data structure, while Queue is a first-in-first-out (FIFO) data structure.
2. Stack is a first-in-first-out (FIFO) data structure, while Queue is a last-in-first-out (LIFO) data structure.
3. Both Stack and Queue are the same.

**Respuesta Correcta:** 1

**Explicación:** Stack is a last-in-first-out (LIFO) data structure, meaning that the last element added to the stack is the first one to be removed. Queue, on the other hand, is a first-in-first-out (FIFO) data structure, meaning that the first element added to the queue is the first one to be removed.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 461
**Pregunta:** What is the difference between the keySet() and values() methods of a Map in Java?
**Nivel:** Intermedio

1. The keySet() method returns a set of all the keys in a Map, while the values() method returns a collection of all the values in a Map.
2. The keySet() method returns a collection of all the values in a Map, while the values() method returns a set of all the keys in a Map.
3. Both the keySet() and values() methods return the same information.

**Respuesta Correcta:** 1

**Explicación:** The keySet() method returns a set of all the keys in a Map, while the values() method returns a collection of all the values in a Map. This allows you to access either the keys or the values of a Map independently, depending on your use case.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 463
**Pregunta:** What is the difference between the for-each loop and the Iterator in Java?
**Nivel:** Intermedio

1. The for-each loop is used to traverse a collection in a single direction, while the Iterator is used to traverse a collection in both directions and remove elements.
2. The for-each loop is used to traverse a collection in both directions and remove elements, while the Iterator is used to traverse a collection in a single direction.
3. Both the for-each loop and the Iterator have the same functionality.

**Respuesta Correcta:** 2

**Explicación:** The for-each loop is used to traverse a collection in a single direction, allowing you to access elements one by one. The Iterator, on the other hand, is used to traverse a collection in both directions and remove elements, allowing you to access elements one by one and remove elements as needed.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 464
**Pregunta:** What is the difference between a Set and a List in Java?
**Nivel:** Intermedio

1. A Set is an unordered collection that does not allow duplicates, while a List is an ordered collection that allows duplicates.
2. A Set is an ordered collection that allows duplicates, while a List is an unordered collection that does not allow duplicates.
3. Both Set and List have the same functionality.

**Respuesta Correcta:** 1

**Explicación:** A Set is an unordered collection that does not allow duplicates, meaning that each element in a Set is unique. A List, on the other hand, is an ordered collection that allows duplicates, meaning that you can have multiple elements with the same value in a List.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 465
**Pregunta:** What is the difference between a Map and a Set in Java?
**Nivel:** Intermedio

1. A Map is a collection of key-value pairs, while a Set is a collection of unique elements.
2. A Map is a collection of unique elements, while a Set is a collection of key-value pairs.
3. Both Map and Set have the same functionality.

**Respuesta Correcta:** 1

**Explicación:** A Map is a collection of key-value pairs, meaning that each element in a Map is a combination of a key and a value. A Set, on the other hand, is a collection of unique elements, meaning that each element in a Set is a single value.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 485
**Pregunta:** What is the main difference between process and thread?
**Nivel:** Intermedio

1. A process is a self-contained program, while a thread is a lightweight sub-process.
2. A process is a lightweight sub-process, while a thread is a self-contained program.
3. Both process and thread are the same.

**Respuesta Correcta:** 1

**Explicación:** A process is a self-contained program with its own memory space, while a thread is a lightweight sub-process that shares the memory space of its parent process. Threads are used to perform multiple tasks within a single process.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 533
**Pregunta:** What are the techniques to reduce Lock contention?
**Nivel:** Avanzado

1. By using finer-grained locks.
2. By using coarser-grained locks.
3. By using lock-free algorithms.
4. By using lock-based algorithms.

**Respuesta Correcta:** 1

**Explicación:** One technique to reduce lock contention in multi-threading is to use finer-grained locks. This means that instead of using a single, coarse-grained lock to protect a large region of shared memory, multiple smaller locks are used to protect smaller regions of memory. This can help to reduce the frequency and duration of lock contention, improving the performance and responsiveness of the program.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 534
**Pregunta:** What technique can be used in following code to reduce Lock contention?
**Nivel:** Avanzado

1. Finer-grained locks.
2. Coarser-grained locks.
3. Lock-free algorithms.
4. Lock-based algorithms.

**Respuesta Correcta:** 1

**Explicación:** One technique that can be used in code to reduce lock contention is to use finer-grained locks. This means that instead of using a single, coarse-grained lock to protect a large region of shared memory, multiple smaller locks are used to protect smaller regions of memory. This can help to reduce the frequency and duration of lock contention, improving the performance and responsiveness of the program.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 535
**Pregunta:** What is Lock splitting technique?
**Nivel:** Avanzado

1. A technique for reducing lock contention by using multiple locks to protect different regions of shared memory.
2. A technique for increasing lock contention by using a single lock to protect a large region of shared memory.
3. A technique for avoiding lock contention by using lock-free algorithms.

**Respuesta Correcta:** 1

**Explicación:** Lock splitting is a technique for reducing lock contention by using multiple locks to protect different regions of shared memory. This can help to reduce the frequency and duration of lock contention, improving the performance and responsiveness of the program.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 537
**Pregunta:** What is Lock striping?
**Nivel:** Avanzado

1. A technique for reducing lock contention by using multiple locks to protect different regions of shared memory.
2. A technique for increasing lock contention by using a single lock to protect a large region of shared memory.
3. A technique for avoiding lock contention by using lock-free algorithms.

**Respuesta Correcta:** 1

**Explicación:** Lock striping is a technique for reducing lock contention by using multiple locks to protect different regions of shared memory. This can help to reduce the frequency and duration of lock contention, improving the performance and responsiveness of the program.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 538
**Pregunta:** What is a CAS operation?
**Nivel:** Avanzado

1. A Compare-And-Swap operation is an atomic operation that compares the contents of a memory location with a given value, and if the contents match, updates the memory location with a new value.
2. A Create-And-Swap operation is an atomic operation that creates a new memory location and swaps its contents with a given value.
3. A Copy-And-Swap operation is an atomic operation that copies the contents of a memory location to a new location and swaps its contents with a given value.

**Respuesta Correcta:** 1

**Explicación:** A Compare-And-Swap (CAS) operation is an atomic operation that compares the contents of a memory location with a given value, and if the contents match, updates the memory location with a new value. This can be used to implement efficient, thread-safe algorithms without the need for locks.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 559
**Pregunta:** Which parameter can be used to control stack size of a thread in Java?
**Nivel:** Básico

1. -Xss
2. -Xmx
3. -Xms
4. -Xgc

**Respuesta Correcta:** 1

**Explicación:** The "-Xss" parameter can be used to control the stack size of a thread in Java. This parameter specifies the maximum stack size that a thread can use.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 563
**Pregunta:** What is the use of volatile keyword in Java?
**Nivel:** Básico

1. To ensure that a variable is read from main memory, not from cache.
2. To ensure that a variable is read from cache, not from main memory.
3. To ensure that a variable is read from both cache and main memory.

**Respuesta Correcta:** 1

**Explicación:** The volatile keyword in Java is used to ensure that a variable is read from main memory, not from cache. This helps prevent race conditions and data corruption in multi-threaded environments.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 589
**Pregunta:** What are the differences between Collection and Stream API in Java?
**Nivel:** Intermedio

1. Collections are used to store data, while Streams are used to process data.
2. Streams are used to store data, while Collections are used to process data.
3. Both Collections and Streams are used to store data.
4. Neither Collections nor Streams are used to store or process data.

**Respuesta Correcta:** 1

**Explicación:** The main difference between Collection and Stream API in Java is that Collections are used to store data, while Streams are used to process data. Streams provide a way to perform operations on data in a functional and efficient manner, while Collections are used to store and manipulate data.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 648
**Pregunta:** How will you take thread dump in Java?
**Nivel:** Intermedio

1. Using jstack command line tool.
2. Using jmap command line tool.
3. Using jstat command line tool.

**Respuesta Correcta:** 1

**Explicación:** A thread dump in Java can be taken using the jstack command line tool. This tool provides a snapshot of the state of all threads in a Java process.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 662
**Pregunta:** Explain the difference between fail-fast and fail-safe iterators?
**Nivel:** Avanzado

1. Fail-fast iterators throw a ConcurrentModificationException if the underlying collection is modified during iteration, while fail-safe iterators do not throw any exception and continue to work with the modified collection.
2. Fail-fast iterators do not throw any exception and continue to work with the modified collection, while fail-safe iterators throw a ConcurrentModificationException if the underlying collection is modified during iteration.
3. Fail-fast and fail-safe iterators both throw a ConcurrentModificationException if the underlying collection is modified during iteration.

**Respuesta Correcta:** 1

**Explicación:** Fail-fast iterators throw a ConcurrentModificationException if the underlying collection is modified during iteration, while fail-safe iterators do not throw any exception and continue to work with the modified collection. Fail-safe iterators are usually slower than fail-fast iterators and make a copy of the underlying collection before iterating it.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 682
**Pregunta:** What are the different ways to sort a collection in Java?
**Nivel:** Avanzado

1. Bubble sort
2. Insertion sort
3. Selection sort
4. Collections.sort method

**Respuesta Correcta:** 4

**Explicación:** In Java, collections can be sorted using the built-in method Collections.sort, as well as various sorting algorithms such as bubble sort, insertion sort, and selection sort.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 686
**Pregunta:** Between HashSet and TreeSet collections in Java, which one is better?
**Nivel:** Básico

1. HashSet is better.
2. TreeSet is better.
3. Both HashSet and TreeSet are the same.

**Respuesta Correcta:** 3

**Explicación:** The choice between HashSet and TreeSet depends on the specific use case. HashSet provides faster access and insertion times, while TreeSet provides sorted elements and faster search times.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 688
**Pregunta:** When would you use Serial Garbage collector or Throughput Garbage collector in Java?
**Nivel:** Avanzado

1. Use Serial Garbage collector when you have a single processor.
2. Use Throughput Garbage collector when you have multiple processors.
3. Use Serial Garbage collector when you have limited memory.

**Respuesta Correcta:** 2

**Explicación:** Use the Serial Garbage collector when you have a single processor and limited memory, and use the Throughput Garbage collector when you have multiple processors and a large amount of memory. The Throughput Garbage collector is designed to run in parallel with application threads, allowing for increased collection performance on multi-processor systems.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 691
**Pregunta:** When do you use Exception or Error in Java? What is the difference between these two?
**Nivel:** Intermedio

1. Use Exceptions for expected error conditions and Errors for unexpected conditions.
2. Use Exceptions for unexpected error conditions and Errors for expected conditions.
3. Both Exceptions and Errors are used for expected conditions.
4. Both Exceptions and Errors are used for unexpected conditions.

**Respuesta Correcta:** 1

**Explicación:** Exceptions are used for expected error conditions, such as invalid user input or a missing file, while Errors are used for unexpected conditions, such as a stack overflow or an out-of-memory error.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 828
**Pregunta:** What is the design pattern suitable to access elements of a Collection?
**Nivel:** Avanzado

1. The design pattern suitable to access elements of a Collection is the Iterator design pattern.
2. The design pattern suitable to access elements of a Collection is the Factory design pattern.
3. The design pattern suitable to access elements of a Collection is the Singleton design pattern.
4. The design pattern suitable to access elements of a Collection is the Observer design pattern.

**Respuesta Correcta:** 1

**Explicación:** The design pattern suitable to access elements of a Collection is the Iterator design pattern. The Iterator design pattern provides a way to access the elements of a Collection one by one without exposing the underlying implementation.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 953
**Pregunta:** What is the purpose of Spring Boot Starter POMs?
**Nivel:** Básico

1. To provide a convenient way to include a collection of dependencies in a project
2. To provide a convenient way to exclude a collection of dependencies in a project
3. To provide a convenient way to manage dependencies in a project
4. To provide a convenient way to exclude dependencies from a project

**Respuesta Correcta:** 1

**Explicación:** The purpose of Spring Boot Starter POMs is to provide a convenient way to include a collection of dependencies in a project. Starter POMs are pre-configured POM files that include a set of dependencies for a particular task, such as web development or data access.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 984
**Pregunta:** What are the different types of collections supported by Hibernate?
**Nivel:** Básico

1. Set
2. List
3. Map
4. Array

**Respuesta Correcta:** 1, 2, 3

**Explicación:** Hibernate supports several different types of collections, including Set, List, and Map. These collections allow you to store multiple values in a single property, making it easier to manage related data.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 994
**Pregunta:** What is Query Cache in Hibernate?
**Nivel:** Avanzado

1. Query Cache is a mechanism used in Hibernate to cache the results of database queries in memory, improving performance.
2. Query Cache is a mechanism used in Hibernate to prevent changes from being made to the results of database queries.
3. Query Cache is a mechanism used in Hibernate to manually manage the results of database queries.

**Respuesta Correcta:** 1

**Explicación:** Query Cache is a mechanism used in Hibernate to cache the results of database queries in memory, improving performance. This allows Hibernate to return the cached results for a query, rather than executing the query again and retrieving the results from the database.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 1002
**Pregunta:** How can we mark an entity/collection as immutable in Hibernate?
**Nivel:** Avanzado

1. You can mark an entity/collection as immutable in Hibernate by using the @Immutable annotation.
2. You can mark an entity/collection as immutable in Hibernate by using the @Mutable annotation.
3. You can mark an entity/collection as immutable in Hibernate by using the @ReadOnly annotation.

**Respuesta Correcta:** 1

**Explicación:** You can mark an entity/collection as immutable in Hibernate by using the @Immutable annotation. This indicates to Hibernate that the entity/collection should not be updated, and can improve performance by allowing Hibernate to make certain optimizations.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 1012
**Pregunta:** What is ‘Extra lazy fetching’ in Hibernate?
**Nivel:** Avanzado

1. Extra lazy fetching is a fetching strategy in Hibernate that retrieves collection elements one at a time, as they are accessed.
2. Extra lazy fetching is a fetching strategy in Hibernate that retrieves all collection elements at once.
3. Extra lazy fetching is a fetching strategy in Hibernate that retrieves only a portion of the collection elements at a time.

**Respuesta Correcta:** 1

**Explicación:** Extra lazy fetching is a fetching strategy in Hibernate that retrieves collection elements one at a time, as they are accessed. This provides the ultimate in flexibility and performance optimization, as you only retrieve the collection elements that are actually needed.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 1015
**Pregunta:** What is the difference between a Set and a Bag in Hibernate?
**Nivel:** Intermedio

1. A Set is a collection that does not allow duplicates and is ordered, while a Bag is a collection that allows duplicates and is unordered.
2. A Set is a collection that allows duplicates and is ordered, while a Bag is a collection that does not allow duplicates and is unordered.
3. A Set and a Bag are the same thing in Hibernate.

**Respuesta Correcta:** 1

**Explicación:** A Set is a collection that does not allow duplicates and is ordered, while a Bag is a collection that allows duplicates and is unordered. This allows you to choose the appropriate collection type based on the specific needs of your application.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

