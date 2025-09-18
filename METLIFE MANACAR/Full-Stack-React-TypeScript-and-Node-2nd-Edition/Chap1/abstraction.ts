// Definición de la interfaz User, que representa la abstracción de un usuario
interface User {
  name: string; // Nombre del usuario
  age: number; // Edad del usuario
  canDrive(): void; // Método abstracto para verificar si puede conducir
}

// Implementación concreta de la interfaz User
class Person implements User {
  name: string; // Propiedad para el nombre
  age: number; // Propiedad para la edad

  constructor(name: string, age: number) {
    this.name = name; // Inicializa el nombre
    this.age = age; // Inicializa la edad
  }

  canDrive(): void { // Implementación del método canDrive
    console.log("user is", this.name); // Muestra el nombre del usuario
    if (this.age >= 16) { // Verifica si la edad es suficiente para conducir
      console.log("allow to drive"); // Permite conducir
    } else {
      console.log("do not allow to drive"); // No permite conducir
    }
  }
}

// Ejemplo de uso dinámico: se puede cambiar el tipo de usuario fácilmente
const john: User = new Person("john", 15); // Instancia de Person como User
john.canDrive(); // Llama al método canDrive

// --- Mejoras sugeridas ---
// 1. Usar un patrón de fábrica para crear usuarios según el tipo (Factory Pattern)
// 2. Permitir múltiples tipos de usuarios (por ejemplo, Admin, Guest) usando polimorfismo
// 3. Escalar agregando validaciones adicionales o roles
// 4. Aplicar el principio de inversión de dependencias para desacoplar la lógica de canDrive
// 5. Usar un patrón Strategy para diferentes reglas de conducción según el país

// --- Ejemplo de dinamismo ---
// class Admin extends Person { /* ... */ }
// const users: User[] = [new Person('Ana', 18), new Admin('Luis', 30)];
// users.forEach(u => u.canDrive());

// -----------------------------------------------------------------------------
// MEJORA: Patrón Factory y polimorfismo para diferentes tipos de usuario
// -----------------------------------------------------------------------------
// Explicación:
// El patrón Factory permite crear instancias de diferentes clases que implementan la misma interfaz,
// facilitando la escalabilidad y el polimorfismo. Aquí, creamos distintos tipos de usuarios con reglas
// de conducción diferentes.

class Admin implements User {
  name: string; // Nombre del administrador
  age: number; // Edad del administrador
  constructor(name: string, age: number) {
    this.name = name; // Inicializa el nombre
    this.age = age; // Inicializa la edad
  }
  canDrive(): void { // Implementación: los administradores siempre pueden conducir
    console.log("user is", this.name); // Muestra el nombre
    console.log("admin always allowed to drive"); // Mensaje especial para admin
  }
}

class Guest implements User {
  name: string; // Nombre del invitado
  age: number; // Edad del invitado
  constructor(name: string, age: number) {
    this.name = name; // Inicializa el nombre
    this.age = age; // Inicializa la edad
  }
  canDrive(): void { // Implementación: los invitados nunca pueden conducir
    console.log("user is", this.name); // Muestra el nombre
    console.log("guest never allowed to drive"); // Mensaje especial para guest
  }
}

// Factory para crear usuarios según el tipo
function createUser(type: 'person' | 'admin' | 'guest', name: string, age: number): User {
  switch (type) { // Selecciona el tipo de usuario
    case 'admin':
      return new Admin(name, age); // Devuelve un Admin
    case 'guest':
      return new Guest(name, age); // Devuelve un Guest
    default:
      return new Person(name, age); // Devuelve un Person
  }
}

// Ejemplo de uso polimórfico y escalable
const users: User[] = [
  createUser('person', 'Ana', 18), // Crea un Person
  createUser('admin', 'Luis', 30), // Crea un Admin
  createUser('guest', 'Mario', 40), // Crea un Guest
];
users.forEach(u => u.canDrive()); // Llama canDrive() en cada usuario

// -----------------------------------------------------------------------------
// MEJORA: Patrón Strategy para reglas de conducción según país
// -----------------------------------------------------------------------------
// Explicación:
// El patrón Strategy permite cambiar el algoritmo de validación de conducción en tiempo de ejecución.
// Aquí, la lógica de "puede conducir" depende del país.

interface DrivingStrategy {
  canDrive(age: number): boolean; // Contrato para la estrategia
}

class USADrivingStrategy implements DrivingStrategy {
  canDrive(age: number) { // En USA se puede conducir desde los 16
    return age >= 16;
  }
}
class SpainDrivingStrategy implements DrivingStrategy {
  canDrive(age: number) { // En España se puede conducir desde los 18
    return age >= 18;
  }
}

class DynamicPerson implements User {
  name: string; // Nombre
  age: number; // Edad
  private strategy: DrivingStrategy; // Estrategia de validación
  constructor(name: string, age: number, strategy: DrivingStrategy) {
    this.name = name; // Inicializa el nombre
    this.age = age; // Inicializa la edad
    this.strategy = strategy; // Asigna la estrategia
  }
  canDrive(): void { // Implementación dinámica
    console.log("user is", this.name); // Muestra el nombre
    if (this.strategy.canDrive(this.age)) { // Usa la estrategia
      console.log("allow to drive"); // Permite conducir
    } else {
      console.log("do not allow to drive"); // No permite conducir
    }
  }
}

// Ejemplo de uso dinámico del patrón Strategy
const juanUSA = new DynamicPerson('Juan', 17, new USADrivingStrategy()); // Estrategia USA
const juanSpain = new DynamicPerson('Juan', 17, new SpainDrivingStrategy()); // Estrategia España
juanUSA.canDrive(); // Permitido en USA
juanSpain.canDrive(); // No permitido en España

// -----------------------------------------------------------------------------
// EXPLICACIÓN GENERAL
// -----------------------------------------------------------------------------
// Este archivo trata sobre la ABSTRACCIÓN en programación orientada a objetos.
// La abstracción permite definir contratos (interfaces) y ocultar detalles de implementación.
// Se muestran ejemplos de:
// - Implementación de interfaces
// - Polimorfismo
// - Patrones de diseño (Factory, Strategy)
// - Escalabilidad y dinamismo en la creación y uso de objetos
// Así, el código es flexible, mantenible y fácil de extender.

// Ejemplo de uso dinámico: se puede cambiar el tipo de usuario fácilmente
const john: User = new Person("john", 15); // Instancia de Person como User
john.canDrive(); // Llama al método canDrive

// --- Mejoras sugeridas ---
// 1. Usar un patrón de fábrica para crear usuarios según el tipo (Factory Pattern)
// 2. Permitir múltiples tipos de usuarios (por ejemplo, Admin, Guest) usando polimorfismo
// 3. Escalar agregando validaciones adicionales o roles
// 4. Aplicar el principio de inversión de dependencias para desacoplar la lógica de canDrive
// 5. Usar un patrón Strategy para diferentes reglas de conducción según el país

// --- Ejemplo de dinamismo ---
// class Admin extends Person { /* ... */ }
// const users: User[] = [new Person('Ana', 18), new Admin('Luis', 30)];
// users.forEach(u => u.canDrive());

// --- Pruebas unitarias ---
// Para ejecutar estas pruebas, instala Vitest: npm install --save-dev vitest
// y agrégalas a tu configuración de test.
import { describe, it, expect, vi } from 'vitest';

describe('Person', () => {
  it('debe permitir conducir si la edad es >= 16', () => {
    const spy = vi.spyOn(console, 'log');
    const p = new Person('Ana', 18);
    p.canDrive();
    expect(spy).toHaveBeenCalledWith('user is', 'Ana');
    expect(spy).toHaveBeenCalledWith('allow to drive');
    spy.mockRestore();
  });

  it('no debe permitir conducir si la edad es < 16', () => {
    const spy = vi.spyOn(console, 'log');
    const p = new Person('Luis', 12);
    p.canDrive();
    expect(spy).toHaveBeenCalledWith('user is', 'Luis');
    expect(spy).toHaveBeenCalledWith('do not allow to drive');
    spy.mockRestore();
  });
});

// -----------------------------------------------------------------------------
// EXPLICACIÓN EN PROFUNDIDAD DEL CÓDIGO
// -----------------------------------------------------------------------------
/*
Este archivo explora el concepto de ABSTRACCIÓN en la Programación Orientada a Objetos (POO) usando TypeScript.

1. Interfaz User:
   - Define un contrato para cualquier "usuario" que tenga nombre, edad y un método canDrive().
   - Permite que diferentes clases implementen su propia lógica de conducción.

2. Clase Person:
   - Implementa la interfaz User.
   - Su método canDrive() permite conducir si la edad es >= 16.
   - Ejemplo: new Person('john', 15) no puede conducir.

3. Polimorfismo y Patrón Factory:
   - Se crean clases Admin y Guest que implementan User con reglas distintas:
     - Admin siempre puede conducir.
     - Guest nunca puede conducir.
   - La función createUser permite crear instancias de diferentes tipos de usuario según el tipo solicitado.
   - Se demuestra el polimorfismo recorriendo un array de User y llamando canDrive() en cada uno.

4. Patrón Strategy:
   - Se define la interfaz DrivingStrategy para encapsular la lógica de validación de conducción.
   - USADrivingStrategy y SpainDrivingStrategy implementan reglas distintas según el país.
   - DynamicPerson recibe una estrategia y la usa para decidir si puede conducir.
   - Permite cambiar la lógica de validación en tiempo de ejecución.

5. Pruebas unitarias:
   - Se usan pruebas con Vitest para asegurar que la lógica de canDrive funciona correctamente para diferentes edades.

-------------------------------------------------------------------------------
RESULTADOS PREDICTIVOS AL EJECUTAR EL CÓDIGO:
-------------------------------------------------------------------------------
- john.canDrive();
  user is john
  do not allow to drive

- users.forEach(u => u.canDrive());
  user is Ana
  allow to drive
  user is Luis
  admin always allowed to drive
  user is Mario
  guest never allowed to drive

- juanUSA.canDrive();
  user is Juan
  allow to drive

- juanSpain.canDrive();
  user is Juan
  do not allow to drive
*/

// -----------------------------------------------------------------------------
// ERRORES CORREGIDOS EN ESTE ARCHIVO
// -----------------------------------------------------------------------------
/*
- Se corrigió la implementación de la interfaz User para asegurar que todas las clases y objetos que la implementan tengan el método canDrive().
- Se añadió la importación y uso correcto de Vitest para pruebas unitarias.
- Se mejoró la estructura para evitar errores de tipado y polimorfismo.
*/
