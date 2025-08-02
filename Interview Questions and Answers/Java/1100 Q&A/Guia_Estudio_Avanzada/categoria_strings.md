# Strings - Preguntas de Entrevista Java
**Total de preguntas: 4**

## Pregunta 282
**Pregunta:** How can you concatenate two Strings in Java?
**Nivel:** Intermedio

1. By using the + operator.
2. By using the concat() method.
3. By using the append() method.
4. By using the add() method.

**Respuesta Correcta:** 1

**Explicación:** You can concatenate two Strings in Java by using the + operator. For example, String s = "Hello" + "World"; will create a new string s with the contents "HelloWorld".

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 285
**Pregunta:** How can you split a String in Java?
**Nivel:** Intermedio

1. By using the split() method.
2. By using the substring() method.
3. By using the replace() method.
4. By using the trim() method.

**Respuesta Correcta:** 1

**Explicación:** You can split a String in Java by using the split() method. For example, String s = "Hello,World"; String[] words = s.split(","); will create an array words with two elements, "Hello" and "World".

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 674
**Pregunta:** How can you check if a String is a number by using regular expression?
**Nivel:** Intermedio

1. By using the pattern ^[0-9]+$.
2. By using the pattern [0-9]+.
3. By using the pattern ^[0-9]*$.
4. By using the pattern [0-9]*.

**Respuesta Correcta:** 1

**Explicación:** By using the pattern ^[0-9]+$. This regular expression pattern matches strings that consist of one or more digits and nothing else. This can be used to check if a string is a number.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

## Pregunta 900
**Pregunta:** Is it allowed to inject null or empty String values in Spring?
**Nivel:** Intermedio

1. Yes, it is allowed to inject null or empty String values in Spring.
2. No, it is not allowed to inject null or empty String values in Spring.
3. It depends on the implementation of the Bean.

**Respuesta Correcta:** 1

**Explicación:** Yes, it is allowed to inject null or empty String values in Spring. However, it is important to note that this may lead to issues in the application if the Bean depends on the injected value being non-null or non-empty.

### Ejemplos de Código

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

### Pruebas Unitarias
```java
// Pruebas unitarias específicas para esta pregunta
// TODO: Implementar pruebas personalizadas
```

---

