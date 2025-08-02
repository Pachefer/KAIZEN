# Variables y Tipos de Datos - Guía Completa

## 📚 Pregunta Original (Inglés)
**Q: What are variables and data types in programming?**

**A: Variables are containers that store data values. Data types define the kind of data a variable can hold, such as numbers, text, or boolean values.**

## 🇪🇸 Traducción y Explicación

### Pregunta
**¿Qué son las variables y tipos de datos en programación?**

### Respuesta
**Las variables son contenedores que almacenan valores de datos. Los tipos de datos definen el tipo de información que una variable puede contener, como números, texto o valores booleanos.**

## 💻 Ejemplos de Código

### JavaScript/Node.js

```javascript
// ============================================================================
// EJEMPLO 1: Variables y Tipos de Datos Básicos en JavaScript
// ============================================================================

// Declaración de variables con diferentes tipos de datos
let nombre = "Juan Pérez";           // String (texto)
let edad = 25;                       // Number (número entero)
let altura = 1.75;                   // Number (número decimal)
let esEstudiante = true;             // Boolean (verdadero/falso)
let hobbies = ["leer", "programar"]; // Array (arreglo)
let persona = {                      // Object (objeto)
    nombre: "María",
    edad: 30
};
let valorNulo = null;                // Null (valor nulo)
let valorIndefinido = undefined;     // Undefined (indefinido)

// Verificación de tipos usando typeof
console.log("Tipo de nombre:", typeof nombre);           // "string"
console.log("Tipo de edad:", typeof edad);               // "number"
console.log("Tipo de esEstudiante:", typeof esEstudiante); // "boolean"
console.log("Tipo de hobbies:", typeof hobbies);         // "object"
console.log("Tipo de persona:", typeof persona);         // "object"
console.log("Tipo de valorNulo:", typeof valorNulo);     // "object"
console.log("Tipo de valorIndefinido:", typeof valorIndefinido); // "undefined"

// Conversión de tipos (Type Coercion)
let numeroComoTexto = "42";
let numeroConvertido = Number(numeroComoTexto);  // Convierte string a number
let textoComoNumero = 123;
let textoConvertido = String(textoComoNumero);   // Convierte number a string

console.log("Número convertido:", numeroConvertido, typeof numeroConvertido);
console.log("Texto convertido:", textoConvertido, typeof textoConvertido);
```

### Python

```python
# ============================================================================
# EJEMPLO 2: Variables y Tipos de Datos en Python
# ============================================================================

# Declaración de variables con diferentes tipos de datos
nombre = "Ana García"                    # str (cadena de texto)
edad = 28                               # int (número entero)
altura = 1.68                           # float (número decimal)
es_programador = True                   # bool (booleano)
hobbies = ["música", "deportes"]        # list (lista)
persona = {                             # dict (diccionario)
    "nombre": "Carlos",
    "edad": 35
}
valor_nulo = None                       # NoneType (valor nulo)

# Verificación de tipos usando type()
print(f"Tipo de nombre: {type(nombre)}")           # <class 'str'>
print(f"Tipo de edad: {type(edad)}")               # <class 'int'>
print(f"Tipo de altura: {type(altura)}")           # <class 'float'>
print(f"Tipo de es_programador: {type(es_programador)}") # <class 'bool'>
print(f"Tipo de hobbies: {type(hobbies)}")         # <class 'list'>
print(f"Tipo de persona: {type(persona)}")         # <class 'dict'>
print(f"Tipo de valor_nulo: {type(valor_nulo)}")   # <class 'NoneType'>

# Conversión de tipos (Type Casting)
numero_como_texto = "100"
numero_convertido = int(numero_como_texto)    # Convierte str a int
decimal_como_texto = "3.14"
decimal_convertido = float(decimal_como_texto) # Convierte str a float
texto_como_numero = 456
texto_convertido = str(texto_como_numero)     # Convierte int a str

print(f"Número convertido: {numero_convertido} ({type(numero_convertido)})")
print(f"Decimal convertido: {decimal_convertido} ({type(decimal_convertido)})")
print(f"Texto convertido: {texto_convertido} ({type(texto_convertido)})")
```

### Java

```java
// ============================================================================
// EJEMPLO 3: Variables y Tipos de Datos en Java
// ============================================================================

public class VariablesYTiposDatos {
    public static void main(String[] args) {
        // Declaración de variables con diferentes tipos de datos
        String nombre = "Luis Rodríguez";           // String (cadena de texto)
        int edad = 32;                              // int (número entero)
        double altura = 1.80;                       // double (número decimal)
        boolean esDesarrollador = true;             // boolean (booleano)
        char inicial = 'L';                         // char (carácter)
        long numeroGrande = 1234567890L;            // long (número entero largo)
        float precio = 19.99f;                      // float (número decimal)
        
        // Arrays (arreglos)
        String[] lenguajes = {"Java", "Python", "JavaScript"};
        int[] numeros = {1, 2, 3, 4, 5};
        
        // Verificación de tipos usando getClass()
        System.out.println("Tipo de nombre: " + nombre.getClass().getSimpleName());
        System.out.println("Tipo de edad: " + ((Object)edad).getClass().getSimpleName());
        System.out.println("Tipo de altura: " + ((Object)altura).getClass().getSimpleName());
        System.out.println("Tipo de esDesarrollador: " + ((Object)esDesarrollador).getClass().getSimpleName());
        System.out.println("Tipo de lenguajes: " + lenguajes.getClass().getSimpleName());
        
        // Conversión de tipos (Type Casting)
        String numeroComoTexto = "42";
        int numeroConvertido = Integer.parseInt(numeroComoTexto);  // String a int
        double decimalComoTexto = "3.14159";
        double decimalConvertido = Double.parseDouble(decimalComoTexto); // String a double
        String textoComoNumero = String.valueOf(123);             // int a String
        
        System.out.println("Número convertido: " + numeroConvertido);
        System.out.println("Decimal convertido: " + decimalConvertido);
        System.out.println("Texto convertido: " + textoComoNumero);
    }
}
```

## 🧪 Pruebas Unitarias

### JavaScript (Jest)

```javascript
// ============================================================================
// PRUEBAS UNITARIAS: Variables y Tipos de Datos en JavaScript
// ============================================================================

// Archivo: variables.test.js

describe('Variables y Tipos de Datos', () => {
    
    test('debe declarar variables con tipos correctos', () => {
        // Arrange (Preparar)
        let nombre = "Juan";
        let edad = 25;
        let esActivo = true;
        
        // Assert (Verificar)
        expect(typeof nombre).toBe('string');
        expect(typeof edad).toBe('number');
        expect(typeof esActivo).toBe('boolean');
    });
    
    test('debe convertir tipos correctamente', () => {
        // Arrange
        let numeroComoTexto = "42";
        let textoComoNumero = 123;
        
        // Act (Actuar)
        let numeroConvertido = Number(numeroComoTexto);
        let textoConvertido = String(textoComoNumero);
        
        // Assert
        expect(numeroConvertido).toBe(42);
        expect(typeof numeroConvertido).toBe('number');
        expect(textoConvertido).toBe("123");
        expect(typeof textoConvertido).toBe('string');
    });
    
    test('debe manejar arrays y objetos', () => {
        // Arrange
        let frutas = ["manzana", "banana", "naranja"];
        let persona = { nombre: "Ana", edad: 30 };
        
        // Assert
        expect(Array.isArray(frutas)).toBe(true);
        expect(typeof persona).toBe('object');
        expect(frutas.length).toBe(3);
        expect(persona.nombre).toBe("Ana");
    });
    
    test('debe manejar valores nulos e indefinidos', () => {
        // Arrange
        let valorNulo = null;
        let valorIndefinido = undefined;
        
        // Assert
        expect(valorNulo).toBeNull();
        expect(valorIndefinido).toBeUndefined();
        expect(typeof valorNulo).toBe('object');
        expect(typeof valorIndefinido).toBe('undefined');
    });
});
```

### Python (pytest)

```python
# ============================================================================
# PRUEBAS UNITARIAS: Variables y Tipos de Datos en Python
# ============================================================================

# Archivo: test_variables.py

import pytest

class TestVariablesYTiposDatos:
    
    def test_declarar_variables_con_tipos_correctos(self):
        """Prueba que las variables se declaren con los tipos correctos"""
        # Arrange
        nombre = "María"
        edad = 28
        es_estudiante = True
        
        # Assert
        assert isinstance(nombre, str)
        assert isinstance(edad, int)
        assert isinstance(es_estudiante, bool)
    
    def test_conversion_de_tipos(self):
        """Prueba la conversión correcta entre tipos de datos"""
        # Arrange
        numero_como_texto = "100"
        texto_como_numero = 456
        
        # Act
        numero_convertido = int(numero_como_texto)
        texto_convertido = str(texto_como_numero)
        
        # Assert
        assert numero_convertido == 100
        assert isinstance(numero_convertido, int)
        assert texto_convertido == "456"
        assert isinstance(texto_convertido, str)
    
    def test_manejo_de_listas_y_diccionarios(self):
        """Prueba el manejo correcto de listas y diccionarios"""
        # Arrange
        colores = ["rojo", "verde", "azul"]
        persona = {"nombre": "Carlos", "edad": 35}
        
        # Assert
        assert isinstance(colores, list)
        assert isinstance(persona, dict)
        assert len(colores) == 3
        assert persona["nombre"] == "Carlos"
    
    def test_valores_nulos(self):
        """Prueba el manejo de valores None"""
        # Arrange
        valor_nulo = None
        
        # Assert
        assert valor_nulo is None
        assert isinstance(valor_nulo, type(None))
    
    def test_operaciones_con_numeros(self):
        """Prueba operaciones matemáticas básicas"""
        # Arrange
        a = 10
        b = 5
        
        # Act
        suma = a + b
        resta = a - b
        multiplicacion = a * b
        division = a / b
        
        # Assert
        assert suma == 15
        assert resta == 5
        assert multiplicacion == 50
        assert division == 2.0
        assert isinstance(division, float)
```

### Java (JUnit)

```java
// ============================================================================
// PRUEBAS UNITARIAS: Variables y Tipos de Datos en Java
// ============================================================================

// Archivo: VariablesYTiposDatosTest.java

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class VariablesYTiposDatosTest {
    
    private String nombre;
    private int edad;
    private boolean esActivo;
    
    @BeforeEach
    void setUp() {
        // Configuración inicial para cada prueba
        nombre = "Pedro";
        edad = 30;
        esActivo = true;
    }
    
    @Test
    void testDeclararVariablesConTiposCorrectos() {
        // Verificar que las variables tienen los tipos correctos
        assertTrue(nombre instanceof String);
        assertTrue(Integer.class.isInstance(edad));
        assertTrue(Boolean.class.isInstance(esActivo));
    }
    
    @Test
    void testConversionDeTipos() {
        // Probar conversión de tipos
        String numeroComoTexto = "42";
        int numeroConvertido = Integer.parseInt(numeroComoTexto);
        String textoComoNumero = String.valueOf(123);
        
        assertEquals(42, numeroConvertido);
        assertEquals("123", textoComoNumero);
    }
    
    @Test
    void testManejoDeArrays() {
        // Probar manejo de arrays
        String[] frutas = {"manzana", "banana", "naranja"};
        int[] numeros = {1, 2, 3, 4, 5};
        
        assertEquals(3, frutas.length);
        assertEquals(5, numeros.length);
        assertEquals("manzana", frutas[0]);
        assertEquals(1, numeros[0]);
    }
    
    @Test
    void testOperacionesMatematicas() {
        // Probar operaciones matemáticas
        int a = 10;
        int b = 5;
        
        assertEquals(15, a + b);
        assertEquals(5, a - b);
        assertEquals(50, a * b);
        assertEquals(2, a / b);
    }
    
    @Test
    void testValoresNulos() {
        // Probar manejo de valores nulos
        String valorNulo = null;
        
        assertNull(valorNulo);
    }
}
```

## 📝 Documentación Línea por Línea

### JavaScript - Explicación Detallada

```javascript
// Línea 1: Comentario que indica el propósito del ejemplo
// ============================================================================
// EJEMPLO 1: Variables y Tipos de Datos Básicos en JavaScript
// ============================================================================

// Línea 5: Declaración de variable 'nombre' con valor string
// 'let' es la palabra clave para declarar variables en ES6+
// Las comillas dobles o simples indican que es un string
let nombre = "Juan Pérez";           // String (texto)

// Línea 6: Declaración de variable 'edad' con valor numérico
// Los números en JavaScript no necesitan comillas
// JavaScript no distingue entre enteros y decimales
let edad = 25;                       // Number (número entero)

// Línea 7: Declaración de variable 'altura' con valor decimal
// Los números decimales usan punto como separador
// JavaScript maneja automáticamente la precisión
let altura = 1.75;                   // Number (número decimal)

// Línea 8: Declaración de variable booleana
// 'true' y 'false' son los únicos valores booleanos
// Se usan para lógica condicional
let esEstudiante = true;             // Boolean (verdadero/falso)

// Línea 9: Declaración de array (arreglo)
// Los corchetes [] indican un array
// Los elementos se separan por comas
let hobbies = ["leer", "programar"]; // Array (arreglo)

// Línea 10-13: Declaración de objeto
// Las llaves {} indican un objeto
// Los pares clave-valor se separan por comas
let persona = {                      // Object (objeto)
    nombre: "María",                 // Propiedad 'nombre' con valor "María"
    edad: 30                         // Propiedad 'edad' con valor 30
};

// Línea 14: Declaración de valor null
// 'null' representa la ausencia intencional de valor
let valorNulo = null;                // Null (valor nulo)

// Línea 15: Declaración de valor undefined
// 'undefined' representa una variable declarada pero sin valor asignado
let valorIndefinido = undefined;     // Undefined (indefinido)

// Línea 17: Verificación de tipos usando el operador typeof
// typeof devuelve una cadena que indica el tipo de dato
console.log("Tipo de nombre:", typeof nombre);           // "string"

// Línea 18: Verificación del tipo de variable numérica
console.log("Tipo de edad:", typeof edad);               // "number"

// Línea 19: Verificación del tipo de variable booleana
console.log("Tipo de esEstudiante:", typeof esEstudiante); // "boolean"

// Línea 20: Verificación del tipo de array
// Nota: typeof devuelve "object" para arrays (limitación de JavaScript)
console.log("Tipo de hobbies:", typeof hobbies);         // "object"

// Línea 21: Verificación del tipo de objeto
console.log("Tipo de persona:", typeof persona);         // "object"

// Línea 22: Verificación del tipo de null
// Nota: typeof null devuelve "object" (error histórico de JavaScript)
console.log("Tipo de valorNulo:", typeof valorNulo);     // "object"

// Línea 23: Verificación del tipo de undefined
console.log("Tipo de valorIndefinido:", typeof valorIndefinido); // "undefined"

// Línea 25: Ejemplo de conversión de tipos (Type Coercion)
// Conversión explícita de string a number usando Number()
let numeroComoTexto = "42";
let numeroConvertido = Number(numeroComoTexto);  // Convierte string a number

// Línea 26: Conversión explícita de number a string usando String()
let textoComoNumero = 123;
let textoConvertido = String(textoComoNumero);   // Convierte number a string

// Línea 28-29: Verificación de las conversiones realizadas
console.log("Número convertido:", numeroConvertido, typeof numeroConvertido);
console.log("Texto convertido:", textoConvertido, typeof textoConvertido);
```

## 🎯 Mejoras y Casos de Uso Avanzados

### 1. **Constantes y Inmutabilidad**

```javascript
// Uso de const para valores que no cambian
const PI = 3.14159;
const CONFIGURACION = {
    puerto: 3000,
    host: 'localhost'
};

// Object.freeze() para hacer objetos inmutables
const USUARIO = Object.freeze({
    nombre: "Admin",
    rol: "administrador"
});
```

### 2. **Destructuring Assignment**

```javascript
// Extracción de valores de arrays
const [primerElemento, segundoElemento] = ["a", "b", "c"];

// Extracción de propiedades de objetos
const { nombre, edad } = { nombre: "Juan", edad: 25, ciudad: "Madrid" };

// Destructuring con valores por defecto
const { titulo = "Sin título", autor = "Anónimo" } = {};
```

### 3. **Template Literals**

```javascript
// Interpolación de variables en strings
const nombre = "María";
const edad = 30;
const mensaje = `Hola, me llamo ${nombre} y tengo ${edad} años.`;

// Expresiones en template literals
const precio = 19.99;
const cantidad = 3;
const total = `Total: $${(precio * cantidad).toFixed(2)}`;
```

## 📊 Ejercicios Prácticos

### Ejercicio 1: Calculadora de Tipos
```javascript
// Crea una función que reciba cualquier valor y devuelva:
// - El tipo de dato
// - Si es primitivo o no
// - Una descripción del valor

function analizarTipo(valor) {
    // Tu código aquí
}

// Pruebas
console.log(analizarTipo("Hola"));     // { tipo: "string", primitivo: true, descripcion: "Cadena de texto" }
console.log(analizarTipo(42));         // { tipo: "number", primitivo: true, descripcion: "Número entero" }
console.log(analizarTipo([1,2,3]));    // { tipo: "object", primitivo: false, descripcion: "Array con 3 elementos" }
```

### Ejercicio 2: Conversor de Tipos
```python
# Crea una función que convierta entre diferentes tipos de datos
# y maneje errores apropiadamente

def convertir_tipo(valor, tipo_destino):
    """
    Convierte un valor al tipo especificado
    
    Args:
        valor: El valor a convertir
        tipo_destino: El tipo al que convertir (str, int, float, bool)
    
    Returns:
        El valor convertido o None si no es posible
    """
    # Tu código aquí
    pass

# Pruebas
print(convertir_tipo("123", int))      # 123
print(convertir_tipo("3.14", float))   # 3.14
print(convertir_tipo(1, bool))         # True
print(convertir_tipo("abc", int))      # None (error)
```

## 🔍 Preguntas de Reflexión

1. **¿Cuál es la diferencia entre `null` y `undefined` en JavaScript?**
2. **¿Por qué `typeof null` devuelve "object" en JavaScript?**
3. **¿Cuándo usarías `const` en lugar de `let`?**
4. **¿Qué ventajas tiene el destructuring assignment?**
5. **¿Cómo manejarías la conversión de tipos de forma segura?**

## 📚 Recursos Adicionales

- [MDN Web Docs - Variables](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Grammar_and_types#Variables)
- [Python Documentation - Data Types](https://docs.python.org/3/library/stdtypes.html)
- [Java Tutorial - Variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) (Para tipado estático)

---

**¡Práctica estos conceptos hasta que te sientas cómodo con ellos!** 💪 