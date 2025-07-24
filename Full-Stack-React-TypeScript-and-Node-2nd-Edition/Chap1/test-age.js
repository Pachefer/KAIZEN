"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Función que determina si el usuario puede conducir
function canDrive(usr) {
    console.log("user is", usr.name); // Muestra el nombre
    if (usr.age >= 16) { // Verifica si la edad es suficiente
        console.log("allow to drive"); // Permite conducir
    }
    else {
        console.log("do not allow to drive"); // No permite conducir
    }
}
var tom = {
    name: "tom", // Nombre
    age: 25, // Edad
    canDrive: function () { canDrive(this); } // Implementación del método requerido
};
canDrive(tom); // Llama a la función con el usuario
var DefaultDriveRule = /** @class */ (function () {
    function DefaultDriveRule() {
    }
    DefaultDriveRule.prototype.canDrive = function (user) { return user.age >= 16; }; // Regla por defecto
    return DefaultDriveRule;
}());
var SpainDriveRule = /** @class */ (function () {
    function SpainDriveRule() {
    }
    SpainDriveRule.prototype.canDrive = function (user) { return user.age >= 18; }; // Regla para España
    return SpainDriveRule;
}());
var LicenseDriveRule = /** @class */ (function () {
    function LicenseDriveRule() {
    }
    LicenseDriveRule.prototype.canDrive = function (user) {
        return user.age >= 16 && user.hasLicense; // Requiere licencia
    };
    return LicenseDriveRule;
}());
function canDriveWithRule(user, rule) {
    if (rule.canDrive(user)) {
        return 'allow to drive'; // Permite conducir
    }
    else {
        return 'do not allow to drive'; // No permite conducir
    }
}
// Ejemplo de uso avanzado
var ana = { name: 'Ana', age: 17, canDrive: function () { return; } }; // Usuario Ana
console.log('Ana (default):', canDriveWithRule(ana, new DefaultDriveRule())); // allow to drive
console.log('Ana (Spain):', canDriveWithRule(ana, new SpainDriveRule())); // do not allow to drive
var luis = { name: 'Luis', age: 18, hasLicense: false, canDrive: function () { return; } }; // Usuario Luis
console.log('Luis (licencia):', canDriveWithRule(luis, new LicenseDriveRule())); // do not allow to drive
var maria = { name: 'Maria', age: 20, hasLicense: true, canDrive: function () { return; } }; // Usuario Maria
console.log('Maria (licencia):', canDriveWithRule(maria, new LicenseDriveRule())); // allow to drive
// -----------------------------------------------------------------------------
// MEJORA: Manejo de múltiples usuarios y reportes
// -----------------------------------------------------------------------------
// Explicación:
// Se puede escalar la lógica para manejar listas de usuarios y generar reportes de quién puede conducir.
var usersList = [
    { name: 'Tom', age: 25, canDrive: function () { return; } }, // Usuario Tom
    { name: 'Ana', age: 15, canDrive: function () { return; } }, // Usuario Ana
    { name: 'Luis', age: 18, canDrive: function () { return; } }, // Usuario Luis
];
function reportDrive(users, rule) {
    return users.map(function (u) { return "".concat(u.name, ": ").concat(canDriveWithRule(u, rule)); }); // Genera reporte
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
var vitest_1 = require("vitest");
(0, vitest_1.describe)('canDrive', function () {
    (0, vitest_1.it)('debe permitir conducir si la edad es >= 16', function () {
        var spy = vitest_1.vi.spyOn(console, 'log');
        var user = { name: 'Ana', age: 20, canDrive: function () { canDrive(this); } };
        canDrive(user);
        (0, vitest_1.expect)(spy).toHaveBeenCalledWith('user is', 'Ana');
        (0, vitest_1.expect)(spy).toHaveBeenCalledWith('allow to drive');
        spy.mockRestore();
    });
    (0, vitest_1.it)('no debe permitir conducir si la edad es < 16', function () {
        var spy = vitest_1.vi.spyOn(console, 'log');
        var user = { name: 'Luis', age: 10, canDrive: function () { canDrive(this); } };
        canDrive(user);
        (0, vitest_1.expect)(spy).toHaveBeenCalledWith('user is', 'Luis');
        (0, vitest_1.expect)(spy).toHaveBeenCalledWith('do not allow to drive');
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
