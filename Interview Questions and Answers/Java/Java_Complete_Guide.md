# ☕ Guía Completa de Java - Entrevistas y Dominio

## 🎯 Introducción a Java

**Java** es un lenguaje de programación orientado a objetos, robusto, seguro y multiplataforma. Desarrollado por Sun Microsystems (ahora Oracle), es fundamental para el desarrollo empresarial y móvil.

### 🌟 **¿Por qué Java?**

- **Multiplataforma** - "Write Once, Run Anywhere"
- **Orientado a Objetos** - Paradigma sólido y maduro
- **Ecosistema empresarial** - Spring, Hibernate, Maven
- **Alta demanda laboral** - Desarrolladores muy solicitados
- **Comunidad masiva** - Recursos y soporte abundantes

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Cuál es la diferencia entre == y equals() en Java?**

**Respuesta Completa:**

**== (Operador de igualdad):**
- Compara referencias de memoria
- Compara valores primitivos directamente
- No se puede sobrescribir
- Más rápido en ejecución

**equals() (Método de igualdad):**
- Compara contenido/estado de objetos
- Se puede sobrescribir
- Compara lógica de negocio
- Más lento pero más preciso

```java
// Ejemplo de == vs equals()
public class StringComparison {
    public static void main(String[] args) {
        // Crear strings con new
        String str1 = new String("Hello");
        String str2 = new String("Hello");
        
        // Crear strings literales
        String str3 = "Hello";
        String str4 = "Hello";
        
        System.out.println("=== COMPARACIÓN CON == ===");
        System.out.println("str1 == str2: " + (str1 == str2));        // false
        System.out.println("str3 == str4: " + (str3 == str4));        // true (string pool)
        System.out.println("str1 == str3: " + (str1 == str3));        // false
        
        System.out.println("\n=== COMPARACIÓN CON equals() ===");
        System.out.println("str1.equals(str2): " + str1.equals(str2)); // true
        System.out.println("str3.equals(str4): " + str3.equals(str4)); // true
        System.out.println("str1.equals(str3): " + str1.equals(str3)); // true
        
        // Comparación de objetos personalizados
        Person person1 = new Person("Juan", 25);
        Person person2 = new Person("Juan", 25);
        Person person3 = new Person("María", 30);
        
        System.out.println("\n=== OBJETOS PERSONALIZADOS ===");
        System.out.println("person1 == person2: " + (person1 == person2));           // false
        System.out.println("person1.equals(person2): " + person1.equals(person2));   // true
        System.out.println("person1.equals(person3): " + person1.equals(person3));   // false
    }
}

class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;                    // Misma referencia
        if (obj == null || getClass() != obj.getClass()) return false; // null o clase diferente
        
        Person person = (Person) obj;
        return age == person.age && Objects.equals(name, person.name); // Comparar campos
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age); // Hash consistente con equals
    }
}
```

**Simulador de Comparaciones:**

```java
// comparison-simulator.java
import java.util.*;

public class ComparisonSimulator {
    private int testCount = 0;
    private int correctAnswers = 0;
    private List<ComparisonTest> tests = new ArrayList<>();
    
    public static void main(String[] args) {
        ComparisonSimulator simulator = new ComparisonSimulator();
        simulator.runSimulation();
    }
    
    // Clase para representar una prueba de comparación
    static class ComparisonTest {
        String description;
        Object obj1;
        Object obj2;
        boolean expectedEquals;
        boolean expectedReference;
        
        public ComparisonTest(String description, Object obj1, Object obj2, 
                            boolean expectedEquals, boolean expectedReference) {
            this.description = description;
            this.obj1 = obj1;
            this.obj2 = obj2;
            this.expectedEquals = expectedEquals;
            this.expectedReference = expectedReference;
        }
    }
    
    // Configurar pruebas
    private void setupTests() {
        // Pruebas con Strings
        tests.add(new ComparisonTest(
            "Strings creados con new - mismo contenido",
            new String("Hello"),
            new String("Hello"),
            true,   // equals() debe ser true
            false   // == debe ser false
        ));
        
        tests.add(new ComparisonTest(
            "Strings literales - mismo contenido",
            "Hello",
            "Hello",
            true,   // equals() debe ser true
            true    // == debe ser true (string pool)
        ));
        
        // Pruebas con Integers
        tests.add(new ComparisonTest(
            "Integers pequeños (cache)",
            Integer.valueOf(127),
            Integer.valueOf(127),
            true,   // equals() debe ser true
            true    // == debe ser true (cache de -128 a 127)
        ));
        
        tests.add(new ComparisonTest(
            "Integers grandes (sin cache)",
            Integer.valueOf(1000),
            Integer.valueOf(1000),
            true,   // equals() debe ser true
            false   // == debe ser false
        ));
        
        // Pruebas con objetos personalizados
        Person person1 = new Person("Juan", 25);
        Person person2 = new Person("Juan", 25);
        Person person3 = new Person("María", 30);
        
        tests.add(new ComparisonTest(
            "Personas con mismo contenido",
            person1,
            person2,
            true,   // equals() debe ser true
            false   // == debe ser false
        ));
        
        tests.add(new ComparisonTest(
            "Personas con contenido diferente",
            person1,
            person3,
            false,  // equals() debe ser false
            false   // == debe ser false
        ));
        
        // Pruebas con null
        tests.add(new ComparisonTest(
            "Comparación con null",
            "Hello",
            null,
            false,  // equals() debe ser false
            false   // == debe ser false
        ));
    }
    
    // Ejecutar simulación
    public void runSimulation() {
        System.out.println("🔍 SIMULADOR DE COMPARACIONES EN JAVA");
        System.out.println("=" .repeat(50));
        
        setupTests();
        
        System.out.println("\n📋 Ejecutando " + tests.size() + " pruebas de comparación...\n");
        
        for (int i = 0; i < tests.size(); i++) {
            ComparisonTest test = tests.get(i);
            System.out.println("🧪 PRUEBA " + (i + 1) + ": " + test.description);
            System.out.println("-".repeat(60));
            
            // Ejecutar comparaciones
            boolean actualEquals = safeEquals(test.obj1, test.obj2);
            boolean actualReference = test.obj1 == test.obj2;
            
            // Mostrar resultados
            System.out.println("📊 Resultados:");
            System.out.println("   equals(): " + actualEquals + " (esperado: " + test.expectedEquals + ")");
            System.out.println("   ==:       " + actualReference + " (esperado: " + test.expectedReference + ")");
            
            // Verificar resultados
            boolean equalsCorrect = actualEquals == test.expectedEquals;
            boolean referenceCorrect = actualReference == test.expectedReference;
            
            if (equalsCorrect && referenceCorrect) {
                System.out.println("✅ ¡Prueba exitosa!");
                correctAnswers++;
            } else {
                System.out.println("❌ Prueba fallida!");
                if (!equalsCorrect) {
                    System.out.println("   ❌ equals() no coincide con lo esperado");
                }
                if (!referenceCorrect) {
                    System.out.println("   ❌ == no coincide con lo esperado");
                }
            }
            
            // Mostrar detalles de la comparación
            showComparisonDetails(test.obj1, test.obj2);
            
            testCount++;
            System.out.println();
        }
        
        // Mostrar resumen final
        showFinalSummary();
    }
    
    // Comparación segura con equals
    private boolean safeEquals(Object obj1, Object obj2) {
        if (obj1 == null) return obj2 == null;
        return obj1.equals(obj2);
    }
    
    // Mostrar detalles de la comparación
    private void showComparisonDetails(Object obj1, Object obj2) {
        System.out.println("🔍 Detalles de la comparación:");
        System.out.println("   Objeto 1: " + formatObject(obj1));
        System.out.println("   Objeto 2: " + formatObject(obj2));
        
        if (obj1 != null && obj2 != null) {
            System.out.println("   Clase 1: " + obj1.getClass().getSimpleName());
            System.out.println("   Clase 2: " + obj2.getClass().getSimpleName());
            System.out.println("   Hash 1: " + System.identityHashCode(obj1));
            System.out.println("   Hash 2: " + System.identityHashCode(obj2));
        }
    }
    
    // Formatear objeto para mostrar
    private String formatObject(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return "\"" + obj + "\"";
        if (obj instanceof Person) {
            Person p = (Person) obj;
            return "Person{name='" + p.getName() + "', age=" + p.getAge() + "}";
        }
        return obj.toString();
    }
    
    // Mostrar resumen final
    private void showFinalSummary() {
        System.out.println("🎉 RESUMEN FINAL DE LA SIMULACIÓN");
        System.out.println("=" .repeat(50));
        
        System.out.println("📊 Estadísticas:");
        System.out.println("   Total de pruebas: " + testCount);
        System.out.println("   Pruebas exitosas: " + correctAnswers);
        System.out.println("   Pruebas fallidas: " + (testCount - correctAnswers));
        System.out.println("   Tasa de éxito: " + String.format("%.1f%%", (correctAnswers * 100.0 / testCount)));
        
        System.out.println("\n💡 LECCIONES APRENDIDAS:");
        System.out.println("   ✅ == compara referencias de memoria");
        System.out.println("   ✅ equals() compara contenido de objetos");
        System.out.println("   ✅ Strings literales pueden compartir referencia (string pool)");
        System.out.println("   ✅ Integers pequeños (-128 a 127) usan cache");
        System.out.println("   ✅ Siempre implementa equals() y hashCode() juntos");
        System.out.println("   ✅ equals() debe ser reflexivo, simétrico y transitivo");
        
        System.out.println("\n🚨 CASOS ESPECIALES:");
        System.out.println("   🔴 String pool para literales");
        System.out.println("   🔴 Cache de Integer para valores pequeños");
        System.out.println("   🔴 Comparación con null");
        System.out.println("   🔴 Objetos de diferentes clases");
    }
    
    // Clase Person para las pruebas
    static class Person {
        private String name;
        private int age;
        
        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
        
        public String getName() { return name; }
        public int getAge() { return age; }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            
            Person person = (Person) obj;
            return age == person.age && Objects.equals(name, person.name);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(name, age);
        }
        
        @Override
        public String toString() {
            return "Person{name='" + name + "', age=" + age + "}";
        }
    }
}
```

---

### 🔴 **PREGUNTA 2: ¿Qué es la sobrecarga y sobrescritura de métodos en Java?**

**Respuesta Completa:**

**Sobrecarga (Overloading):**
- Mismo nombre, diferentes parámetros
- Mismo tipo de retorno o diferente
- Se resuelve en tiempo de compilación
- Puede estar en la misma clase o heredada

**Sobrescritura (Overriding):**
- Mismo nombre, mismos parámetros
- Mismo tipo de retorno o covariante
- Se resuelve en tiempo de ejecución
- Solo en clases heredadas

```java
// Ejemplo de Overloading vs Overriding
public class MethodExamples {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        AdvancedCalculator advCalc = new AdvancedCalculator();
        
        System.out.println("=== SOBRECARGA (OVERLOADING) ===");
        System.out.println("calc.add(5, 3): " + calc.add(5, 3));           // int + int
        System.out.println("calc.add(5.5, 3.2): " + calc.add(5.5, 3.2));   // double + double
        System.out.println("calc.add(5, 3, 2): " + calc.add(5, 3, 2));     // int + int + int
        System.out.println("calc.add(\"5\", \"3\"): " + calc.add("5", "3")); // String + String
        
        System.out.println("\n=== SOBRESCRITURA (OVERRIDING) ===");
        System.out.println("calc.calculate(10): " + calc.calculate(10));     // Método de Calculator
        System.out.println("advCalc.calculate(10): " + advCalc.calculate(10)); // Método sobrescrito
        
        // Polimorfismo
        Calculator polyCalc = new AdvancedCalculator();
        System.out.println("polyCalc.calculate(10): " + polyCalc.calculate(10)); // Método sobrescrito
    }
}

// Clase base con sobrecarga
class Calculator {
    // Sobrecarga: diferentes tipos de parámetros
    public int add(int a, int b) {
        System.out.println("   Llamando: add(int, int)");
        return a + b;
    }
    
    public double add(double a, double b) {
        System.out.println("   Llamando: add(double, double)");
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        System.out.println("   Llamando: add(int, int, int)");
        return a + b + c;
    }
    
    public String add(String a, String b) {
        System.out.println("   Llamando: add(String, String)");
        return a + b;
    }
    
    // Método que será sobrescrito
    public int calculate(int value) {
        System.out.println("   Llamando: Calculator.calculate()");
        return value * 2;
    }
}

// Clase derivada con sobrescritura
class AdvancedCalculator extends Calculator {
    // Sobrescritura: mismo nombre, mismos parámetros
    @Override
    public int calculate(int value) {
        System.out.println("   Llamando: AdvancedCalculator.calculate()");
        return value * 3; // Comportamiento diferente
    }
    
    // Sobrecarga adicional
    public int calculate(int value, int multiplier) {
        System.out.println("   Llamando: AdvancedCalculator.calculate(int, int)");
        return value * multiplier;
    }
}
```

**Simulador de Métodos:**

```java
// method-simulator.java
import java.lang.reflect.Method;
import java.util.*;

public class MethodSimulator {
    private int testCount = 0;
    private int correctAnswers = 0;
    private List<MethodTest> tests = new ArrayList<>();
    
    public static void main(String[] args) {
        MethodSimulator simulator = new MethodSimulator();
        simulator.runSimulation();
    }
    
    // Clase para representar una prueba de método
    static class MethodTest {
        String description;
        Object instance;
        String methodName;
        Object[] parameters;
        Object expectedResult;
        String expectedMethodCalled;
        
        public MethodTest(String description, Object instance, String methodName, 
                         Object[] parameters, Object expectedResult, String expectedMethodCalled) {
            this.description = description;
            this.instance = instance;
            this.methodName = methodName;
            this.parameters = parameters;
            this.expectedResult = expectedResult;
            this.expectedMethodCalled = expectedMethodCalled;
        }
    }
    
    // Configurar pruebas
    private void setupTests() {
        Calculator calc = new Calculator();
        AdvancedCalculator advCalc = new AdvancedCalculator();
        
        // Pruebas de sobrecarga
        tests.add(new MethodTest(
            "Sobrecarga: add(int, int)",
            calc, "add", new Object[]{5, 3}, 8, "add(int, int)"
        ));
        
        tests.add(new MethodTest(
            "Sobrecarga: add(double, double)",
            calc, "add", new Object[]{5.5, 3.2}, 8.7, "add(double, double)"
        ));
        
        tests.add(new MethodTest(
            "Sobrecarga: add(int, int, int)",
            calc, "add", new Object[]{5, 3, 2}, 10, "add(int, int, int)"
        ));
        
        tests.add(new MethodTest(
            "Sobrecarga: add(String, String)",
            calc, "add", new Object[]{"5", "3"}, "53", "add(String, String)"
        ));
        
        // Pruebas de sobrescritura
        tests.add(new MethodTest(
            "Sobrescritura: Calculator.calculate()",
            calc, "calculate", new Object[]{10}, 20, "Calculator.calculate()"
        ));
        
        tests.add(new MethodTest(
            "Sobrescritura: AdvancedCalculator.calculate()",
            advCalc, "calculate", new Object[]{10}, 30, "AdvancedCalculator.calculate()"
        ));
        
        // Pruebas de polimorfismo
        Calculator polyCalc = new AdvancedCalculator();
        tests.add(new MethodTest(
            "Polimorfismo: Calculator referenciando AdvancedCalculator",
            polyCalc, "calculate", new Object[]{10}, 30, "AdvancedCalculator.calculate()"
        ));
    }
    
    // Ejecutar simulación
    public void runSimulation() {
        System.out.println("🔧 SIMULADOR DE MÉTODOS EN JAVA");
        System.out.println("=" .repeat(50));
        
        setupTests();
        
        System.out.println("\n📋 Ejecutando " + tests.size() + " pruebas de métodos...\n");
        
        for (int i = 0; i < tests.size(); i++) {
            MethodTest test = tests.get(i);
            System.out.println("🧪 PRUEBA " + (i + 1) + ": " + test.description);
            System.out.println("-".repeat(60));
            
            try {
                // Ejecutar método usando reflexión
                Object result = invokeMethod(test.instance, test.methodName, test.parameters);
                
                // Mostrar resultados
                System.out.println("📊 Resultados:");
                System.out.println("   Resultado obtenido: " + result);
                System.out.println("   Resultado esperado: " + test.expectedResult);
                System.out.println("   Método esperado: " + test.expectedMethodCalled);
                
                // Verificar resultado
                boolean resultCorrect = Objects.equals(result, test.expectedResult);
                
                if (resultCorrect) {
                    System.out.println("✅ ¡Resultado correcto!");
                    correctAnswers++;
                } else {
                    System.out.println("❌ Resultado incorrecto!");
                }
                
                // Mostrar detalles del método
                showMethodDetails(test.instance, test.methodName, test.parameters);
                
            } catch (Exception e) {
                System.out.println("❌ Error ejecutando método: " + e.getMessage());
            }
            
            testCount++;
            System.out.println();
        }
        
        // Mostrar resumen final
        showFinalSummary();
    }
    
    // Invocar método usando reflexión
    private Object invokeMethod(Object instance, String methodName, Object[] parameters) throws Exception {
        Class<?>[] paramTypes = new Class<?>[parameters.length];
        for (int i = 0; i < parameters.length; i++) {
            paramTypes[i] = parameters[i] != null ? parameters[i].getClass() : Object.class;
        }
        
        Method method = instance.getClass().getMethod(methodName, paramTypes);
        return method.invoke(instance, parameters);
    }
    
    // Mostrar detalles del método
    private void showMethodDetails(Object instance, String methodName, Object[] parameters) {
        System.out.println("🔍 Detalles del método:");
        System.out.println("   Instancia: " + instance.getClass().getSimpleName());
        System.out.println("   Método: " + methodName);
        System.out.println("   Parámetros: " + Arrays.toString(parameters));
        System.out.println("   Tipo de instancia: " + instance.getClass().getName());
        
        // Mostrar métodos disponibles
        System.out.println("   Métodos disponibles:");
        Method[] methods = instance.getClass().getMethods();
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                System.out.println("     - " + method.toString());
            }
        }
    }
    
    // Mostrar resumen final
    private void showFinalSummary() {
        System.out.println("🎉 RESUMEN FINAL DE LA SIMULACIÓN");
        System.out.println("=" .repeat(50));
        
        System.out.println("📊 Estadísticas:");
        System.out.println("   Total de pruebas: " + testCount);
        System.out.println("   Pruebas exitosas: " + correctAnswers);
        System.out.println("   Pruebas fallidas: " + (testCount - correctAnswers));
        System.out.println("   Tasa de éxito: " + String.format("%.1f%%", (correctAnswers * 100.0 / testCount)));
        
        System.out.println("\n💡 LECCIONES APRENDIDAS:");
        System.out.println("   ✅ SOBRECARGA (Overloading):");
        System.out.println("      - Mismo nombre, diferentes parámetros");
        System.out.println("      - Se resuelve en tiempo de compilación");
        System.out.println("      - Puede estar en la misma clase");
        
        System.out.println("   ✅ SOBRESCRITURA (Overriding):");
        System.out.println("      - Mismo nombre, mismos parámetros");
        System.out.println("      - Se resuelve en tiempo de ejecución");
        System.out.println("      - Solo en clases heredadas");
        
        System.out.println("   ✅ POLIMORFISMO:");
        System.out.println("      - Referencia de clase base puede apuntar a clase derivada");
        System.out.println("      - Se ejecuta el método de la clase real del objeto");
        System.out.println("      - No el método de la clase de la referencia");
        
        System.out.println("\n🚨 REGLAS IMPORTANTES:");
        System.out.println("   🔴 Sobrecarga: parámetros diferentes, mismo nombre");
        System.out.println("   🔴 Sobrescritura: parámetros iguales, mismo nombre");
        System.out.println("   🔴 Sobrescritura: usar @Override para claridad");
        System.out.println("   🔴 Polimorfismo: se resuelve en tiempo de ejecución");
    }
    
    // Clases para las pruebas
    static class Calculator {
        public int add(int a, int b) {
            System.out.println("   Llamando: add(int, int)");
            return a + b;
        }
        
        public double add(double a, double b) {
            System.out.println("   Llamando: add(double, double)");
            return a + b;
        }
        
        public int add(int a, int b, int c) {
            System.out.println("   Llamando: add(int, int, int)");
            return a + b + c;
        }
        
        public String add(String a, String b) {
            System.out.println("   Llamando: add(String, String)");
            return a + b;
        }
        
        public int calculate(int value) {
            System.out.println("   Llamando: Calculator.calculate()");
            return value * 2;
        }
    }
    
    static class AdvancedCalculator extends Calculator {
        @Override
        public int calculate(int value) {
            System.out.println("   Llamando: AdvancedCalculator.calculate()");
            return value * 3;
        }
        
        public int calculate(int value, int multiplier) {
            System.out.println("   Llamando: AdvancedCalculator.calculate(int, int)");
            return value * multiplier;
        }
    }
}
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos**
   - Tipos de datos y variables
   - Control de flujo
   - Arrays y colecciones

2. **Orientación a Objetos**
   - Clases y objetos
   - Herencia y polimorfismo
   - Encapsulamiento y abstracción

3. **Características Avanzadas**
   - Genéricos
   - Anotaciones
   - Reflexión

4. **Concurrencia**
   - Threads
   - Sincronización
   - Executor framework

5. **Testing**
   - JUnit
   - Mocking
   - Test-driven development

### 🚀 **Proyectos Prácticos Recomendados:**

1. **Sistema de gestión de biblioteca**
2. **API REST con Spring Boot**
3. **Aplicación de chat multihilo**
4. **Sistema de base de datos con Hibernate**
5. **Microservicios con Spring Cloud**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de Java! ☕**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador Java! 🎯**
