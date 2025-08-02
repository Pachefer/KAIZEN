# Excepciones - Preguntas de Entrevista Java
**Total de preguntas: 28**

## Pregunta 183
**Pregunta:** Can you provide an example of how to use a specific Locale in Java?
**Nivel:** Intermedio

1. Locale locale = new Locale("fr", "FR");
2. Locale locale = new Locale("en", "US");
3. Locale locale = new Locale("es", "ES");

**Respuesta Correcta:** 1, 2, 3

**Explicación:** Any of the options 1, 2, or 3 can be used as an example of how to use a specific Locale in Java. The first argument is the language code, and the second argument is the country code. For example, the Locale new Locale("fr", "FR") represents French as used in France, new Locale("en", "US") represents English as used in the United States, and new Locale("es", "ES") represents Spanish as used in Spain.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 290
**Pregunta:** What is Exception Handling in Java?
**Nivel:** Básico

1. A mechanism for handling errors and exceptional conditions in a program.
2. A mechanism for ignoring errors and exceptional conditions in a program.
3. A mechanism for debugging errors and exceptional conditions in a program.

**Respuesta Correcta:** 1

**Explicación:** Exception handling in Java is a mechanism for handling errors and exceptional conditions in a program. It allows the program to continue executing even in the event of an error or exception, rather than crashing or terminating.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 293
**Pregunta:** What is a finally block in Java?
**Nivel:** Básico

1. A block of code that is guaranteed to be executed after a try-catch block, regardless of whether an exception was thrown or caught.
2. A block of code that is executed before a try-catch block.
3. A block of code that is executed only if an exception was thrown.

**Respuesta Correcta:** 1

**Explicación:** A finally block in Java is a block of code that is guaranteed to be executed after a try-catch block, regardless of whether an exception was thrown or caught. The finally block can be used to clean up resources or perform other tasks that should always be executed, regardless of whether an exception was thrown or not.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 294
**Pregunta:** What is the use of finally block in Java?
**Nivel:** Básico

1. To clean up resources or perform other tasks that should always be executed, regardless of whether an exception was thrown or not.
2. To catch exceptions that were thrown but not caught by a catch block.
3. To throw exceptions that were not caught by a catch block.

**Respuesta Correcta:** 1

**Explicación:** The use of finally block in Java is to clean up resources or perform other tasks that should always be executed, regardless of whether an exception was thrown or not. For example, a finally block can be used to close a file that was opened in a try block.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 295
**Pregunta:** Can we create a finally block without creating a catch block?
**Nivel:** Básico

1. Yes
2. No
3. nan

**Respuesta Correcta:** 1

**Explicación:** Yes, we can create a finally block without creating a catch block. For example, a finally block can be used to perform cleanup tasks even if no exception was thrown in the try block.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 296
**Pregunta:** Do we have to always put a catch block after a try block?
**Nivel:** Básico

1. No
2. Yes
3. nan

**Respuesta Correcta:** 1

**Explicación:** No, we do not have to always put a catch block after a try block. A try block can be followed by a catch block, a finally block, or both. If no exception is thrown in the try block, the catch block will not be executed, but the finally block will be executed if it exists.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 297
**Pregunta:** In what scenarios, a finally block will not be executed?
**Nivel:** Básico

1. When a program exits or is terminated by a call to System.exit().
2. When an exception is thrown but not caught in the try-catch block.
3. When an exception is caught and handled in the catch block.

**Respuesta Correcta:** 1

**Explicación:** A finally block will not be executed when a program exits or is terminated by a call to System.exit(). In all other scenarios, the finally block will be executed, regardless of whether an exception was thrown or caught.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 298
**Pregunta:** Can we re-throw an Exception in Java?
**Nivel:** Básico

1. Yes
2. No
3. nan

**Respuesta Correcta:** 1

**Explicación:** Yes, we can re-throw an Exception in Java by using the throw statement in a catch block. This allows the exception to be propagated to a higher level of the program where it can be handled or logged. For example, try { ... } catch (Exception e) { throw e; } will re-throw the exception that was caught in the catch block.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 299
**Pregunta:** What is the difference between throw and throws in Java?
**Nivel:** Intermedio

1. The throw keyword is used to throw an exception, while the throws keyword is used to declare that a method may throw an exception.
2. The throws keyword is used to throw an exception, while the throw keyword is used to declare that a method may throw an exception.
3. Both the throw and throws keywords are used to throw an exception.
4. Neither the throw nor the throws keyword is used to throw an exception.

**Respuesta Correcta:** 1

**Explicación:** The difference between throw and throws in Java is that the throw keyword is used to throw an exception, while the throws keyword is used to declare that a method may throw an exception. For example, public void foo() throws IOException { throw new IOException(); } declares that the method foo() may throw an IOException, while the line throw new IOException(); actually throws the exception.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 302
**Pregunta:** What is the purpose of using Exception Handling in Java?
**Nivel:** Básico

1. To handle errors and exceptional conditions in a program and allow the program to continue executing, rather than crashing or terminating.
2. To ignore errors and exceptional conditions in a program.
3. To debug errors and exceptional conditions in a program.

**Respuesta Correcta:** 1

**Explicación:** The purpose of using Exception Handling in Java is to handle errors and exceptional conditions in a program and allow the program to continue executing, rather than crashing or terminating. By using exception handling, we can gracefully handle and recover from errors and exceptional conditions, improving the stability and robustness of the program.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 303
**Pregunta:** What is a try-catch block in Java and how does it work?
**Nivel:** Intermedio

1. A try-catch block in Java is a mechanism for handling exceptions, where code that may throw an exception is placed in a try block, and the exception is caught and handled in a corresponding catch block.
2. A try-catch block in Java is a mechanism for ignoring exceptions, where code that may throw an exception is placed in a try block, and the exception is ignored in a corresponding catch block.
3. A try-catch block in Java is a mechanism for debugging exceptions, where code that may throw an exception is placed in a try block, and the exception is logged in a corresponding catch block.

**Respuesta Correcta:** 1

**Explicación:** A try-catch block in Java is a mechanism for handling exceptions, where code that may throw an exception is placed in a try block, and the exception is caught and handled in a corresponding catch block. The try block is executed, and if an exception is thrown, control is transferred to the corresponding catch block, where the exception can be logged, handled, or re-thrown.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 304
**Pregunta:** Can a try block be without a catch block in Java?
**Nivel:** Básico

1. No
2. Yes
3. nan

**Respuesta Correcta:** 2

**Explicación:** Yes, a try block can be without a catch block in Java. In this case, the try block must be followed by a finally block, which can be used to perform cleanup tasks or release resources. For example, try { ... } finally { ... }.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 305
**Pregunta:** What is a throw keyword in Java and when is it used?
**Nivel:** Básico

1. The throw keyword in Java is used to throw an exception, indicating that an error or exceptional condition has occurred.
2. The throw keyword in Java is used to declare that a method may throw an exception.
3. The throw keyword in Java is used to catch an exception.

**Respuesta Correcta:** 1

**Explicación:** The throw keyword in Java is used to throw an exception, indicating that an error or exceptional condition has occurred. For example, throw new IOException(); throws an IOException. The exception can then be caught and handled by a catch block in a try-catch block.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 306
**Pregunta:** What is the role of a catch block in Exception Handling in Java?
**Nivel:** Básico

1. The role of a catch block in Exception Handling in Java is to catch an exception that was thrown in a try block and handle it, either by logging it, recovering from it, or re-throwing it.
2. The role of a catch block in Exception Handling in Java is to ignore exceptions that were thrown in a try block.
3. The role of a catch block in Exception Handling in Java is to debug exceptions that were thrown in a try block.

**Respuesta Correcta:** 1

**Explicación:** The role of a catch block in Exception Handling in Java is to catch an exception that was thrown in a try block and handle it, either by logging it, recovering from it, or re-throwing it. The catch block specifies the type of exception it can handle, and the code inside the catch block is executed if an exception of that type is thrown in the try block.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 308
**Pregunta:** What is the use of throws keyword in Java?
**Nivel:** Básico

1. The throws keyword in Java is used to declare that a method may throw an exception, indicating that the caller of the method must handle the exception or propagate it to its own caller.
2. The throws keyword in Java is used to ignore exceptions that may be thrown by a method.
3. The throws keyword in Java is used to catch exceptions that may be thrown by a method.

**Respuesta Correcta:** 1

**Explicación:** The throws keyword in Java is used to declare that a method may throw an exception, indicating that the caller of the method must handle the exception or propagate it to its own caller. For example, public void foo() throws IOException { ... } declares that the method foo() may throw an IOException, and the caller of foo() must either handle the exception or propagate it.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 309
**Pregunta:** What is a finally block used for in Java and when is it executed?
**Nivel:** Básico

1. A finally block in Java is used to perform cleanup tasks or release resources, and it is executed regardless of whether an exception was thrown or caught in the try block.
2. A finally block in Java is used to ignore exceptions that were thrown in a try block, and it is executed only if an exception was thrown and not caught in the try block.
3. A finally block in Java is used to log exceptions that were thrown in a try block, and it is executed only if an exception was thrown and caught in the try block.

**Respuesta Correcta:** 1

**Explicación:** A finally block in Java is used to perform cleanup tasks or release resources, and it is executed regardless of whether an exception was thrown or caught in the try block. The finally block is optional, but if it is specified, it is executed after the try block and any corresponding catch blocks. The finally block can be used to ensure that resources are released, even if an exception occurs.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 310
**Pregunta:** Can we use multiple catch blocks with a single try block in Java?
**Nivel:** Básico

1. Yes
2. No
3. nan

**Respuesta Correcta:** 1

**Explicación:** Yes, we can use multiple catch blocks with a single try block in Java. This allows us to handle different types of exceptions in separate catch blocks, based on the type of exception that was thrown. Each catch block specifies a different exception type, and the first catch block that matches the type of the thrown exception is executed.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 318
**Pregunta:** Can we start a thread two times in Java?
**Nivel:** Básico

1. No, a thread can only be started once in Java. Attempting to start a thread that has already been started will result in an IllegalThreadStateException.
2. Yes, a thread can be started multiple times in Java.
3. It depends on the implementation of the thread.

**Respuesta Correcta:** 1

**Explicación:** No, a thread can only be started once in Java. Attempting to start a thread that has already been started will result in an IllegalThreadStateException. Once a thread has completed its execution, it cannot be restarted, and a new thread must be created for a new task.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 322
**Pregunta:** What is the purpose of using synchronized keyword in Java multi-threading?
**Nivel:** Básico

1. The purpose of using the synchronized keyword in Java multi-threading is to ensure that only one thread can access a shared resource at a time, preventing race conditions and other synchronization-related issues.
2. The purpose of using the synchronized keyword in Java multi-threading is to improve the performance of multi-threaded applications.
3. The purpose of using the synchronized keyword in Java multi-threading is to provide a mechanism for inter-thread communication.

**Respuesta Correcta:** 1

**Explicación:** The purpose of using the synchronized keyword in Java multi-threading is to ensure that only one thread can access a shared resource at a time, preventing race conditions and other synchronization-related issues. The synchronized keyword can be used to synchronize the access to a shared resource, ensuring that only one thread can access the resource at a time. This can be useful for preventing race conditions, where multiple threads try to access and modify the same resource simultaneously, leading to unpredictable and incorrect results.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 331
**Pregunta:** What is the difference between producer-consumer problem and readers-writers problem in Java multi-threading?
**Nivel:** Intermedio

1. The producer-consumer problem is when multiple producers try to write to a single buffer, while the readers-writers problem is when multiple readers try to read from a single buffer.
2. The producer-consumer problem is when multiple consumers try to read from a single buffer, while the readers-writers problem is when multiple writers try to write to a single buffer.
3. The producer-consumer problem and readers-writers problem are the same thing.

**Respuesta Correcta:** 1

**Explicación:** The producer-consumer problem is when multiple producers try to write to a single buffer, while the readers-writers problem is when multiple readers try to read from a single buffer. These are both synchronization problems that can occur in multi-threaded systems.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 433
**Pregunta:** Why do we sometimes get ConcurrentModificationException during iteration?
**Nivel:** Avanzado

1. We sometimes get ConcurrentModificationException during iteration, because the underlying data structure was modified while the iteration was in progress, causing the iteration to become invalid.
2. We sometimes get ConcurrentModificationException during iteration, because the underlying data structure was not modified while the iteration was in progress, causing the iteration to become invalid.
3. We sometimes get ConcurrentModificationException during iteration, because the iteration was not properly initialized.

**Respuesta Correcta:** 1

**Explicación:** We sometimes get ConcurrentModificationException during iteration, because the underlying data structure was modified while the iteration was in progress, causing the iteration to become invalid. This can happen if multiple threads access and modify the same data structure simultaneously, or if the data structure is modified within the iteration loop. ConcurrentModificationException is thrown to prevent data inconsistencies or race conditions.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 478
**Pregunta:** Can we start a thread two times in Java?
**Nivel:** Básico

1. No, a thread can only be started once in Java.
2. Yes, a thread can be started multiple times in Java.
3. It depends on the implementation of the Thread class.

**Respuesta Correcta:** 1

**Explicación:** No, a thread can only be started once in Java. Attempting to start a thread that has already been started will result in an IllegalThreadStateException.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 532
**Pregunta:** What is Lock contention in multi-threading?
**Nivel:** Avanzado

1. The situation in which multiple threads are trying to access the same resource simultaneously.
2. The situation in which multiple threads are trying to access different resources simultaneously.
3. The situation in which a single thread is trying to access multiple resources simultaneously.

**Respuesta Correcta:** 1

**Explicación:** Lock contention in multi-threading refers to the situation in which multiple threads are trying to access the same resource simultaneously. This can lead to performance problems and decreased responsiveness, as the threads compete for access to the shared resource.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 665
**Pregunta:** What is the difference between poll() and remove() methods of Queue in Java?
**Nivel:** Intermedio

1. The poll() method returns and removes the head of the queue or returns null if the queue is empty, while the remove() method returns and removes the head of the queue and throws NoSuchElementException if the queue is empty.
2. The poll() method returns and removes the head of the queue and throws NoSuchElementException if the queue is empty, while the remove() method returns and removes the head of the queue or returns null if the queue is empty.
3. Both the poll() method and the remove() method return and remove the head of the queue and throw NoSuchElementException if the queue is empty.

**Respuesta Correcta:** 1

**Explicación:** The poll() method returns and removes the head of the queue or returns null if the queue is empty, while the remove() method returns and removes the head of the queue and throws NoSuchElementException if the queue is empty. The poll() method is a safer alternative to remove() as it returns null instead of throwing an exception if the queue is empty.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 666
**Pregunta:** Can you catch an exception thrown by another thread in Java?
**Nivel:** Básico

1. No, you cannot catch an exception thrown by another thread.
2. Yes, you can catch an exception thrown by another thread by using a try-catch block in the main thread.
3. Yes, you can catch an exception thrown by another thread by using a try-catch block in the other thread.

**Respuesta Correcta:** 2

**Explicación:** Yes, you can catch an exception thrown by another thread by using a try-catch block in the main thread. When an exception is thrown by a different thread, it can be caught and handled by the main thread, just like any other exception.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 693
**Pregunta:** In Java, what is the difference between throw and throws keywords?
**Nivel:** Intermedio

1. The throw keyword is used to throw an exception, while the throws keyword is used to declare that a method may throw an exception.
2. The throws keyword is used to throw an exception, while the throw keyword is used to declare that a method may throw an exception.
3. Both throw and throws are used to throw an exception.

**Respuesta Correcta:** 1

**Explicación:** The throw keyword is used to throw an exception, while the throws keyword is used to declare that a method may throw an exception. The throws keyword is used in the method signature to indicate that the method may throw a specific type of exception.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 732
**Pregunta:** How will you handle runtime exceptions in JSP?
**Nivel:** Intermedio

1. By using a try-catch block in the JSP code.
2. By using the errorPage attribute of the page directive.
3. By using the error-page element in the deployment descriptor.
4. All of the above.

**Respuesta Correcta:** 3

**Explicación:** One way to handle runtime exceptions in JSP is by using the error-page element in the deployment descriptor. The error-page element allows you to specify a JSP page or Servlet that should be used to handle errors that occur during the processing of a JSP page. This allows you to centralize error handling in your application, and to provide a consistent and user-friendly experience for your users. Other techniques such as using a try-catch block in the JSP code, or using the errorPage attribute of the page directive can also be used, but using the error-page element in the deployment descriptor is often the most flexible and effective approach.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 907
**Pregunta:** What is @Required annotation?
**Nivel:** Básico

1. The @Required annotation in Spring is used to indicate that a Bean property must be wired with a dependency, otherwise an error will be thrown.
2. The @Required annotation in Spring is used to indicate that a Bean property must not be wired with a dependency, otherwise an error will be thrown.
3. The @Required annotation in Spring is used to manually wire a Bean property with a dependency.

**Respuesta Correcta:** 1

**Explicación:** The @Required annotation in Spring is used to indicate that a Bean property must be wired with a dependency, otherwise an error will be thrown. This allows for the enforcement of mandatory dependencies between Beans, helping to ensure that the configuration of a Spring-based application is consistent and complete.

### Ejemplos de Código
```java
// Ejemplo específico para esta pregunta
// TODO: Implementar ejemplo personalizado
```

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

