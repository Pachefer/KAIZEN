// Ejemplo de suma entre número y string (comentado)
// let a = 5; // Variable numérica
// let b = "6"; // Variable string
// console.log(a + b); // Resultado: "56" (concatenación)

let a: number = 5; // Declaración de variable numérica
let b: number = 6; // Declaración de otra variable numérica
console.log(a + b); // Suma numérica: 11

// -----------------------------------------------------------------------------
// MEJORA: Función genérica y patrón Strategy para operaciones dinámicas
// -----------------------------------------------------------------------------
// Explicación:
// Usar funciones genéricas y el patrón Strategy permite realizar operaciones dinámicas
// según el tipo de dato (número o string), escalando la lógica de suma o concatenación.

// Estrategias para sumar o concatenar
interface AddStrategy<T> {
  add(a: T, b: T): T | string; // Contrato para sumar/concatenar
}

class NumberAddStrategy implements AddStrategy<number> {
  add(a: number, b: number) { return a + b; } // Suma números
}
class StringAddStrategy implements AddStrategy<string> {
  add(a: string, b: string) { return a + b; } // Concatena strings
}

function dynamicAdd<T extends number | string>(a: T, b: T, strategy: AddStrategy<T>): T | string {
  return strategy.add(a, b); // Usa la estrategia
}

// Ejemplo de uso dinámico
const sumResult = dynamicAdd(10, 20, new NumberAddStrategy()); // 30
const concatResult = dynamicAdd('foo', 'bar', new StringAddStrategy()); // 'foobar'
console.log('Suma dinámica:', sumResult); // Imprime 30
console.log('Concatenación dinámica:', concatResult); // Imprime 'foobar'

// -----------------------------------------------------------------------------
// MEJORA: Operaciones con arrays y validación de tipos
// -----------------------------------------------------------------------------
// Explicación:
// Se puede escalar la lógica para operar con arrays de números o strings, validando tipos.

function sumArray(arr: (number | string)[]): number | string {
  if (arr.every(x => typeof x === 'number')) { // Si todos son números
    return (arr as number[]).reduce((a, b) => a + b, 0); // Suma
  } else if (arr.every(x => typeof x === 'string')) { // Si todos son strings
    return (arr as string[]).join(''); // Concatena
  }
  throw new Error('Array mixto no soportado'); // Error si es mixto
}

console.log('Suma de array numérico:', sumArray([1, 2, 3])); // 6
console.log('Concatenación de array string:', sumArray(['a', 'b', 'c'])); // 'abc'

// -----------------------------------------------------------------------------
// EXPLICACIÓN GENERAL
// -----------------------------------------------------------------------------
// Este archivo trata sobre OPERACIONES DINÁMICAS y tipos en TypeScript.
// Se muestran ejemplos de:
// - Suma y concatenación con validación de tipos
// - Funciones genéricas
// - Patrón Strategy para operaciones
// - Operaciones con arrays
// Así, el código es flexible, seguro y escalable.
// -----------------------------------------------------------------------------
// RESULTADOS PREDICTIVOS
// -----------------------------------------------------------------------------
// - console.log(a + b) imprime: 11
// - console.log(5 + '6') imprime: '56'
// - console.log('Suma dinámica:', sumResult) imprime: Suma dinámica: 30
// - console.log('Concatenación dinámica:', concatResult) imprime: Concatenación dinámica: foobar
// - console.log('Suma de array numérico:', sumArray([1,2,3])) imprime: 6
// - console.log('Concatenación de array string:', sumArray(['a','b','c'])) imprime: abc

// --- Pruebas unitarias ---
import { describe, it, expect } from 'vitest';

describe('Suma de números y strings', () => {
  it('debe sumar dos números correctamente', () => {
    expect(a + b).toBe(11);
  });

  it('debe concatenar si uno es string', () => {
    // @ts-ignore
    expect(5 + '6').toBe('56');
  });
});

// -----------------------------------------------------------------------------
// EXPLICACIÓN EN PROFUNDIDAD DEL CÓDIGO
// -----------------------------------------------------------------------------
/*
Este archivo explora el manejo de TIPOS y OPERACIONES DINÁMICAS en TypeScript.

1. Suma y concatenación:
   - Muestra la diferencia entre sumar números y concatenar strings.
   - Si uno de los operandos es string, el resultado es concatenación.

2. Función genérica y patrón Strategy:
   - Permite realizar operaciones dinámicas (suma o concatenación) según el tipo de dato.
   - Se usan estrategias para separar la lógica de suma y concatenación.

3. Operaciones con arrays:
   - sumArray permite sumar todos los elementos si son números o concatenar si son strings.
   - Lanza error si el array es mixto.

4. Pruebas unitarias:
   - Se asegura que las operaciones funcionen correctamente para diferentes tipos.

-------------------------------------------------------------------------------
RESULTADOS PREDICTIVOS AL EJECUTAR EL CÓDIGO:
-------------------------------------------------------------------------------
- console.log(a + b) imprime: 11
- console.log(5 + '6') imprime: '56'
- console.log('Suma dinámica:', sumResult) imprime: Suma dinámica: 30
- console.log('Concatenación dinámica:', concatResult) imprime: Concatenación dinámica: foobar
- console.log('Suma de array numérico:', sumArray([1,2,3])) imprime: 6
- console.log('Concatenación de array string:', sumArray(['a','b','c'])) imprime: abc
*/

// -----------------------------------------------------------------------------
// ERRORES CORREGIDOS EN ESTE ARCHIVO
// -----------------------------------------------------------------------------
/*
- Se corrigió la validación de tipos para evitar errores de concatenación inesperada.
- Se mejoró la función sumArray para lanzar error si el array es mixto.
- Se añadió el uso correcto de funciones genéricas y estrategias para evitar errores de tipado.
*/
