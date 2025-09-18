// Clase base que representa un ítem genérico
class Item {
  id: string; // Identificador único
  description: string; // Descripción del ítem
  price: number; // Precio del ítem

  getId(): string {
    return this.id; // Devuelve el id
  }
}

// Clase derivada que hereda de Item
class Bicycle extends Item {
  wheelCount: number; // Número de ruedas

  getWheelCount(): number {
    return this.wheelCount; // Devuelve el número de ruedas
  }
}

const bicycle = new Bicycle(); // Instancia de Bicycle
bicycle.id = "123"; // Asigna id
bicycle.description = "Mountain Bike"; // Asigna descripción
bicycle.price = 299.99; // Asigna precio
bicycle.wheelCount = 2; // Asigna número de ruedas
console.log("id", bicycle.getId()); // Muestra el id
console.log("wheel count", bicycle.getWheelCount()); // Muestra el número de ruedas

// --- Mejoras sugeridas ---
// 1. Usar el patrón Composite para manejar colecciones de ítems
// 2. Aplicar el principio de sustitución de Liskov para nuevas subclases
// 3. Escalar agregando más subclases (por ejemplo, Car, Scooter)
// 4. Usar interfaces para definir comportamientos adicionales
// 5. Implementar métodos abstractos en la clase base para forzar implementación

// --- Ejemplo de dinamismo ---
// class Car extends Item { doors: number; }
// const items: Item[] = [new Bicycle(), new Car()];
// items.forEach(i => console.log(i.getId()));

// -----------------------------------------------------------------------------
// MEJORA: Clase abstracta y polimorfismo con diferentes tipos de vehículos
// -----------------------------------------------------------------------------
// Explicación:
// La herencia permite crear jerarquías de clases. Usar una clase abstracta obliga a las subclases
// a implementar ciertos métodos, promoviendo el polimorfismo y la extensibilidad.

abstract class AbstractVehicle {
  id: string; // Identificador
  description: string; // Descripción
  price: number; // Precio
  abstract getType(): string; // Método abstracto para el tipo
  abstract getDetails(): string; // Método abstracto para detalles
}

class Car extends AbstractVehicle {
  doors: number; // Número de puertas
  getType() {
    return 'Car'; // Tipo
  }
  getDetails() {
    return `Puertas: ${this.doors}`; // Detalles
  }
}

class Scooter extends AbstractVehicle {
  electric: boolean; // Si es eléctrico
  getType() {
    return 'Scooter'; // Tipo
  }
  getDetails() {
    return `Eléctrico: ${this.electric ? 'Sí' : 'No'}`; // Detalles
  }
}

// Ejemplo de uso polimórfico
const vehicles: AbstractVehicle[] = []; // Array de vehículos
const car = new Car(); // Instancia de Car
car.id = 'c1';
car.description = 'Sedán';
car.price = 20000;
car.doors = 4;
vehicles.push(car); // Agrega el coche
const scooter = new Scooter(); // Instancia de Scooter
scooter.id = 's1';
scooter.description = 'Scooter urbano';
scooter.price = 800;
scooter.electric = true;
vehicles.push(scooter); // Agrega el scooter

vehicles.forEach(v => {
  console.log(`${v.getType()} - ${v.getDetails()}`); // Muestra tipo y detalles
});

// -----------------------------------------------------------------------------
// MEJORA: Patrón Composite para colecciones de ítems
// -----------------------------------------------------------------------------
// Explicación:
// El patrón Composite permite tratar objetos individuales y colecciones de manera uniforme.
// Aquí, una tienda puede contener ítems o colecciones de ítems.

interface StoreComponent {
  getPrice(): number; // Contrato para obtener precio
}

class StoreItem implements StoreComponent {
  constructor(public price: number) {} // Ítem simple
  getPrice() { return this.price; } // Devuelve el precio
}

class StoreBundle implements StoreComponent {
  private items: StoreComponent[] = []; // Colección de ítems
  add(item: StoreComponent) { this.items.push(item); } // Agrega ítem
  getPrice() { return this.items.reduce((sum, i) => sum + i.getPrice(), 0); } // Suma precios
}

// Ejemplo de uso del patrón Composite
const item1 = new StoreItem(100); // Ítem 1
const item2 = new StoreItem(200); // Ítem 2
const bundle = new StoreBundle(); // Bundle
bundle.add(item1);
bundle.add(item2);
console.log('Precio total del bundle:', bundle.getPrice()); // 300

// -----------------------------------------------------------------------------
// EXPLICACIÓN GENERAL
// -----------------------------------------------------------------------------
// Este archivo trata sobre HERENCIA en POO.
// La herencia permite reutilizar código y crear jerarquías de clases.
// Se muestran ejemplos de:
// - Clases abstractas y polimorfismo
// - Patrón Composite para colecciones
// Así, el código es más flexible, escalable y fácil de mantener.
// -----------------------------------------------------------------------------
// RESULTADOS PREDICTIVOS
// -----------------------------------------------------------------------------
// - Al ejecutar vehicles.forEach(...) se imprimirá:
//   Car - Puertas: 4
//   Scooter - Eléctrico: Sí
// - Al ejecutar console.log('Precio total del bundle:', bundle.getPrice());
//   Se imprimirá: Precio total del bundle: 300

// --- Mejoras sugeridas ---
// 1. Usar el patrón Composite para manejar colecciones de ítems
// 2. Aplicar el principio de sustitución de Liskov para nuevas subclases
// 3. Escalar agregando más subclases (por ejemplo, Car, Scooter)
// 4. Usar interfaces para definir comportamientos adicionales
// 5. Implementar métodos abstractos en la clase base para forzar implementación

// --- Ejemplo de dinamismo ---
// class Car extends Item { doors: number; }
// const items: Item[] = [new Bicycle(), new Car()];
// items.forEach(i => console.log(i.getId()));

// --- Pruebas unitarias ---
import { describe, it, expect } from 'vitest';

describe('Bicycle', () => {
  it('debe devolver el id y el número de ruedas correctamente', () => {
    const b = new Bicycle();
    b.id = 'abc';
    b.description = 'Bici urbana';
    b.price = 100;
    b.wheelCount = 2;
    expect(b.getId()).toBe('abc');
    expect(b.getWheelCount()).toBe(2);
  });
});

// -----------------------------------------------------------------------------
// EXPLICACIÓN EN PROFUNDIDAD DEL CÓDIGO
// -----------------------------------------------------------------------------
/*
Este archivo explora el concepto de HERENCIA en la Programación Orientada a Objetos (POO) usando TypeScript.

1. Item y Bicycle:
   - Bicycle hereda de Item y añade la propiedad wheelCount.
   - Permite reutilizar código y extender funcionalidades.

2. Clases abstractas y polimorfismo:
   - AbstractVehicle es una clase abstracta que obliga a las subclases a implementar getType y getDetails.
   - Car y Scooter implementan detalles específicos.
   - Se demuestra polimorfismo recorriendo un array de AbstractVehicle y llamando métodos comunes.

3. Patrón Composite:
   - Permite tratar objetos individuales y colecciones de manera uniforme.
   - StoreItem representa un ítem simple, StoreBundle una colección de ítems.
   - Se puede calcular el precio total de un bundle sumando los precios de sus componentes.

4. Pruebas unitarias:
   - Se asegura que los métodos de las subclases funcionen correctamente.

-------------------------------------------------------------------------------
RESULTADOS PREDICTIVOS AL EJECUTAR EL CÓDIGO:
-------------------------------------------------------------------------------
- vehicles.forEach(...):
  Car - Puertas: 4
  Scooter - Eléctrico: Sí
- console.log('Precio total del bundle:', bundle.getPrice());
  Precio total del bundle: 300
*/

// -----------------------------------------------------------------------------
// ERRORES CORREGIDOS EN ESTE ARCHIVO
// -----------------------------------------------------------------------------
/*
- Se corrigió la implementación de métodos en las subclases para cumplir con la clase abstracta.
- Se mejoró la estructura de las clases para evitar errores de tipado y polimorfismo.
- Se añadió el uso correcto de interfaces y clases abstractas para evitar errores de compilación.
*/
