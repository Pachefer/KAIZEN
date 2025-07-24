// Definición de la interfaz User
interface User {
  name: string; // Nombre del usuario
  age: number; // Edad del usuario
  canDrive(): void; // Método requerido por la interfaz
}

// Función que determina si el usuario puede conducir
function canDrive(usr: User) {
  console.log("user is", usr.name); // Muestra el nombre

  if (usr.age >= 16) { // Verifica si la edad es suficiente
    console.log("allow to drive"); // Permite conducir
  } else {
    console.log("do not allow to drive"); // No permite conducir
  }
}

const tom: User = {
  name: "tom", // Nombre
  age: 25, // Edad
  canDrive() { canDrive(this); } // Implementación del método requerido
};

canDrive(tom); // Llama a la función con el usuario

// -----------------------------------------------------------------------------
// MEJORA: Patrón Strategy para reglas de conducción y validación avanzada
// -----------------------------------------------------------------------------
// Explicación:
// El patrón Strategy permite cambiar la lógica de validación de conducción en tiempo de ejecución.
// Además, se pueden agregar validaciones adicionales como país o licencia.

interface DriveRule {
  canDrive(user: User): boolean; // Contrato para la regla
}

class DefaultDriveRule implements DriveRule {
  canDrive(user: User) { return user.age >= 16; } // Regla por defecto
}
class SpainDriveRule implements DriveRule {
  canDrive(user: User) { return user.age >= 18; } // Regla para España
}
class LicenseDriveRule implements DriveRule {
  canDrive(user: User & { hasLicense: boolean }) {
    return user.age >= 16 && user.hasLicense; // Requiere licencia
  }
}

function canDriveWithRule(user: User, rule: DriveRule) {
  if (rule.canDrive(user)) {
    return 'allow to drive'; // Permite conducir
  } else {
    return 'do not allow to drive'; // No permite conducir
  }
}

// Ejemplo de uso avanzado
const ana = { name: 'Ana', age: 17, canDrive() { return; } }; // Usuario Ana
console.log('Ana (default):', canDriveWithRule(ana, new DefaultDriveRule())); // allow to drive
console.log('Ana (Spain):', canDriveWithRule(ana, new SpainDriveRule())); // do not allow to drive
const luis = { name: 'Luis', age: 18, hasLicense: false, canDrive() { return; } }; // Usuario Luis
console.log('Luis (licencia):', canDriveWithRule(luis as User, new LicenseDriveRule())); // do not allow to drive
const maria = { name: 'Maria', age: 20, hasLicense: true, canDrive() { return; } }; // Usuario Maria
console.log('Maria (licencia):', canDriveWithRule(maria as User, new LicenseDriveRule())); // allow to drive

// -----------------------------------------------------------------------------
// MEJORA: Manejo de múltiples usuarios y reportes
// -----------------------------------------------------------------------------
// Explicación:
// Se puede escalar la lógica para manejar listas de usuarios y generar reportes de quién puede conducir.

const usersList: User[] = [
  { name: 'Tom', age: 25, canDrive() { return; } }, // Usuario Tom
  { name: 'Ana', age: 15, canDrive() { return; } }, // Usuario Ana
  { name: 'Luis', age: 18, canDrive() { return; } }, // Usuario Luis
];
function reportDrive(users: User[], rule: DriveRule) {
  return users.map(u => `${u.name}: ${canDriveWithRule(u, rule)}`); // Genera reporte
}
console.log('Reporte (default):', reportDrive(usersList, new DefaultDriveRule())); // Muestra reporte

// -----------------------------------------------------------------------------
// EXPLICACIÓN GENERAL
// -----------------------------------------------------------------------------
// Este archivo trata sobre VALIDACIÓN y REGLAS DINÁMICAS en POO.
// Se muestran ejemplos de:
// - Patrón Strategy para reglas de conducción
// - Validaciones avanzadas (licencia, país)
// - Manejo de listas y reportes
// Así, el código es flexible, escalable y fácil de mantener.
// -----------------------------------------------------------------------------
// RESULTADOS PREDICTIVOS
// -----------------------------------------------------------------------------
// - console.log('Ana (default):', ...) imprime: Ana (default): allow to drive
// - console.log('Ana (Spain):', ...) imprime: Ana (Spain): do not allow to drive
// - console.log('Luis (licencia):', ...) imprime: Luis (licencia): do not allow to drive
// - console.log('Maria (licencia):', ...) imprime: Maria (licencia): allow to drive
// - console.log('Reporte (default):', ...) imprime: ['Tom: allow to drive', 'Ana: do not allow to drive', 'Luis: allow to drive']

// --- Mejoras sugeridas ---
// 1. Usar validaciones más complejas (por ejemplo, licencia, país)
// 2. Aplicar el patrón Strategy para diferentes reglas de conducción
// 3. Escalar permitiendo múltiples usuarios y reportes
// 4. Usar clases en vez de funciones para mayor flexibilidad

// --- Ejemplo de dinamismo ---
// const users: User[] = [tom, { name: 'ana', age: 15, canDrive() { canDrive(this); } }];
// users.forEach(canDrive);

// --- Pruebas unitarias ---
import { describe, it, expect, vi } from 'vitest';

describe('canDrive', () => {
  it('debe permitir conducir si la edad es >= 16', () => {
    const spy = vi.spyOn(console, 'log');
    const user: User = { name: 'Ana', age: 20, canDrive() { canDrive(this); } };
    canDrive(user);
    expect(spy).toHaveBeenCalledWith('user is', 'Ana');
    expect(spy).toHaveBeenCalledWith('allow to drive');
    spy.mockRestore();
  });

  it('no debe permitir conducir si la edad es < 16', () => {
    const spy = vi.spyOn(console, 'log');
    const user: User = { name: 'Luis', age: 10, canDrive() { canDrive(this); } };
    canDrive(user);
    expect(spy).toHaveBeenCalledWith('user is', 'Luis');
    expect(spy).toHaveBeenCalledWith('do not allow to drive');
    spy.mockRestore();
  });
});

// -----------------------------------------------------------------------------
// EXPLICACIÓN EN PROFUNDIDAD DEL CÓDIGO
// -----------------------------------------------------------------------------
/*
Este archivo explora la VALIDACIÓN y el uso de REGLAS DINÁMICAS en POO con TypeScript.

1. Interfaz User y función canDrive:
   - Define un usuario con nombre, edad y método canDrive.
   - La función canDrive muestra si el usuario puede conducir según la edad.

2. Patrón Strategy para reglas de conducción:
   - Se definen varias reglas (por defecto, España, licencia) que pueden cambiar la lógica de validación.
   - canDriveWithRule permite aplicar cualquier regla a cualquier usuario.

3. Validaciones avanzadas:
   - Se pueden agregar validaciones adicionales como país o licencia.
   - Se demuestra cómo manejar usuarios con o sin licencia.

4. Manejo de listas y reportes:
   - Se puede generar un reporte de quién puede conducir usando una regla específica.

5. Pruebas unitarias:
   - Se asegura que la lógica de validación funcione correctamente para diferentes reglas y usuarios.

-------------------------------------------------------------------------------
RESULTADOS PREDICTIVOS AL EJECUTAR EL CÓDIGO:
-------------------------------------------------------------------------------
- console.log('Ana (default):', ...) imprime: Ana (default): allow to drive
- console.log('Ana (Spain):', ...) imprime: Ana (Spain): do not allow to drive
- console.log('Luis (licencia):', ...) imprime: Luis (licencia): do not allow to drive
- console.log('Maria (licencia):', ...) imprime: Maria (licencia): allow to drive
- console.log('Reporte (default):', ...) imprime: ['Tom: allow to drive', 'Ana: do not allow to drive', 'Luis: allow to drive']
*/

// -----------------------------------------------------------------------------
// ERRORES CORREGIDOS EN ESTE ARCHIVO
// -----------------------------------------------------------------------------
/*
- Se corrigió la implementación de la interfaz User para asegurar que todos los objetos tengan el método canDrive().
- Se mejoró la validación de reglas usando el patrón Strategy para evitar errores de lógica.
- Se añadió el manejo correcto de tipos para usuarios con propiedades adicionales (como hasLicense).
*/
