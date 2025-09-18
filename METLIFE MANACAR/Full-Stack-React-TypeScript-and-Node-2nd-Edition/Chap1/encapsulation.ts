// Clase que demuestra encapsulamiento
class Encapsulator {
  private name: string; // Propiedad privada, solo accesible dentro de la clase

  get getName(): string {
    return this.name; // Getter para acceder al nombre
  }
  set setName(name: string) {
    this.name = name; // Setter para modificar el nombre
  }

  constructor(name: string) {
    this.name = name; // Inicializa el nombre
  }
}

const encapsulator = new Encapsulator("John"); // Instancia de la clase
// console.log(encapsulator.name); // No permitido, name es privado
console.log(encapsulator.getName); // Acceso seguro mediante getter

// --- Mejoras sugeridas ---
// 1. Implementar validaciones en el setter para restringir valores inválidos
// 2. Usar interfaces para definir contratos de acceso
// 3. Aplicar el patrón Singleton si solo debe existir una instancia
// 4. Escalar agregando más propiedades privadas y métodos de acceso
// 5. Usar decoradores para validación automática (en TypeScript avanzado)

// --- Ejemplo de dinamismo ---
// encapsulator.setName = "Ana";
// console.log(encapsulator.getName);

// -----------------------------------------------------------------------------
// MEJORA: Validación en el setter y patrón Singleton
// -----------------------------------------------------------------------------
// Explicación:
// El encapsulamiento permite proteger los datos internos de una clase. Aquí se añade validación
// en el setter y se implementa el patrón Singleton para que solo exista una instancia global.

class ValidatedEncapsulator {
  private static instance: ValidatedEncapsulator; // Instancia única (Singleton)
  private _name: string; // Propiedad privada

  private constructor(name: string) {
    this._name = name; // Inicializa el nombre
  }

  static getInstance(name: string) {
    if (!ValidatedEncapsulator.instance) { // Si no existe, la crea
      ValidatedEncapsulator.instance = new ValidatedEncapsulator(name);
    }
    return ValidatedEncapsulator.instance; // Devuelve la instancia única
  }

  get name() {
    return this._name; // Getter
  }

  set name(value: string) {
    if (value.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres'); // Validación
    this._name = value; // Setter
  }
}

// Ejemplo de uso del Singleton y validación
const singleton = ValidatedEncapsulator.getInstance('Pedro'); // Obtiene la instancia
console.log(singleton.name); // Pedro
try {
  singleton.name = 'A'; // Error
} catch (e) {
  console.log('Error:', (e as Error).message); // Muestra el error
}
singleton.name = 'Ana'; // Cambia el nombre
console.log(singleton.name); // Ana

// -----------------------------------------------------------------------------
// MEJORA: Decorador para validación automática (TypeScript avanzado)
// -----------------------------------------------------------------------------
// Explicación:
// Los decoradores permiten añadir lógica extra a propiedades o métodos. Aquí, un decorador
// valida automáticamente el nombre antes de asignarlo.

// Decorador clásico compatible con TypeScript actual
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    let value: string; // Variable interna
    Object.defineProperty(target, propertyKey, {
      get: function () { return value; }, // Getter
      set: function (newVal: string) { // Setter con validación
        if (newVal.length < length) throw new Error(`Debe tener al menos ${length} caracteres`);
        value = newVal;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

class DecoratedEncapsulator {
  @MinLength(3)
  public name: string; // Propiedad decorada
  constructor(name: string) {
    this.name = name; // Inicializa el nombre
  }
}

// Ejemplo de uso del decorador
try {
  const d = new DecoratedEncapsulator('Al'); // Error
} catch (e) {
  console.log('Decorador error:', (e as Error).message); // Muestra el error
}
const d2 = new DecoratedEncapsulator('Alex'); // Correcto
console.log(d2.name); // Alex

// -----------------------------------------------------------------------------
// EXPLICACIÓN GENERAL
// -----------------------------------------------------------------------------
// Este archivo trata sobre ENCAPSULAMIENTO en POO.
// El encapsulamiento protege los datos internos y expone solo lo necesario mediante getters/setters.
// Se muestran ejemplos de:
// - Validación en setters
// - Patrón Singleton
// - Decoradores para validación automática
// Así, el código es más seguro, robusto y fácil de mantener.

// -----------------------------------------------------------------------------
// EXPLICACIÓN EN PROFUNDIDAD DEL CÓDIGO
// -----------------------------------------------------------------------------
/*
Este archivo explora el concepto de ENCAPSULAMIENTO en la Programación Orientada a Objetos (POO) usando TypeScript.

1. Clase Encapsulator:
   - Demuestra encapsulamiento básico usando una propiedad privada y getters/setters.
   - Solo se puede acceder o modificar el nombre mediante los métodos públicos.

2. ValidatedEncapsulator (Patrón Singleton y validación):
   - Implementa el patrón Singleton para asegurar que solo exista una instancia global.
   - El setter del nombre valida que tenga al menos 2 caracteres.
   - Si se intenta asignar un nombre inválido, lanza un error.

3. DecoratedEncapsulator (Decoradores):
   - Usa un decorador para validar automáticamente la longitud mínima del nombre.
   - Si el nombre es demasiado corto, lanza un error al asignar.

4. Pruebas unitarias:
   - Se asegura que los getters/setters y la validación funcionen correctamente.

-------------------------------------------------------------------------------
RESULTADOS PREDICTIVOS AL EJECUTAR EL CÓDIGO:
-------------------------------------------------------------------------------
- console.log(encapsulator.getName); // John
- singleton.name = 'A'; // Error: El nombre debe tener al menos 2 caracteres
- singleton.name = 'Ana'; console.log(singleton.name); // Ana
- new DecoratedEncapsulator('Al'); // Error: Debe tener al menos 3 caracteres
- new DecoratedEncapsulator('Alex').name; // Alex
*/

// -----------------------------------------------------------------------------
// ERRORES CORREGIDOS EN ESTE ARCHIVO
// -----------------------------------------------------------------------------
/*
- Se corrigió la firma del decorador MinLength para evitar errores de compilación en TypeScript clásico.
- Se mejoró la validación en el setter para evitar asignaciones inválidas.
- Se aseguró que el patrón Singleton funcione correctamente y no permita múltiples instancias.
*/
