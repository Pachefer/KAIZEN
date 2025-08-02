#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar automáticamente las guías de estudio restantes
para todas las tecnologías mencionadas en la entrevista avanzada.
"""

import os
import json

# Configuración de tecnologías y sus contenidos
TECNOLOGIAS = {
    "typescript": {
        "titulo": "📘 TypeScript - Guía de Estudio Avanzada",
        "contenido": """
# 📘 TypeScript - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de TypeScript](#fundamentos-de-typescript)
2. [Tipos Avanzados](#tipos-avanzados)
3. [Interfaces y Clases](#interfaces-y-clases)
4. [Generics](#generics)
5. [Decoradores](#decoradores)
6. [Testing](#testing)
7. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de TypeScript

### Tipos Básicos

```typescript
// Tipos primitivos
let nombre: string = "Juan Pérez";
let edad: number = 25;
let activo: boolean = true;
let fecha: Date = new Date();

// Arrays
let numeros: number[] = [1, 2, 3, 4, 5];
let nombres: Array<string> = ["Juan", "María", "Pedro"];

// Tuplas
let usuario: [string, number, boolean] = ["Juan", 25, true];

// Enums
enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    MODERATOR = "MODERATOR"
}

let rol: UserRole = UserRole.ADMIN;

// Any y Unknown
let variableAny: any = "puede ser cualquier cosa";
let variableUnknown: unknown = "tipo desconocido";

// Void y Never
function saludar(): void {
    console.log("Hola mundo");
}

function errorFatal(): never {
    throw new Error("Error fatal");
}
```

### Interfaces

```typescript
// Interface básica
interface Usuario {
    id: number;
    nombre: string;
    email: string;
    edad?: number; // Propiedad opcional
    readonly createdAt: Date; // Propiedad de solo lectura
}

// Interface con métodos
interface ServicioUsuario {
    obtenerUsuario(id: number): Promise<Usuario>;
    crearUsuario(usuario: Omit<Usuario, 'id' | 'createdAt'>): Promise<Usuario>;
    actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario>;
    eliminarUsuario(id: number): Promise<boolean>;
}

// Interface extendida
interface UsuarioAdmin extends Usuario {
    permisos: string[];
    puedeEliminar: boolean;
}

// Interface de función
interface Comparador<T> {
    (a: T, b: T): number;
}

// Interface de constructor
interface ConstructorUsuario {
    new (nombre: string, email: string): Usuario;
}
```

### Clases

```typescript
// Clase básica
class Usuario {
    // Propiedades privadas
    private _id: number;
    private _password: string;
    
    // Propiedades públicas
    public nombre: string;
    public email: string;
    
    // Propiedades protegidas
    protected createdAt: Date;
    
    // Constructor
    constructor(nombre: string, email: string, password: string) {
        this.nombre = nombre;
        this.email = email;
        this._password = password;
        this.createdAt = new Date();
        this._id = Math.random();
    }
    
    // Getters y Setters
    get id(): number {
        return this._id;
    }
    
    set password(newPassword: string) {
        if (newPassword.length >= 8) {
            this._password = newPassword;
        } else {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }
    }
    
    // Métodos
    public saludar(): string {
        return `Hola, soy ${this.nombre}`;
    }
    
    protected validarEmail(): boolean {
        return this.email.includes('@');
    }
    
    private encriptarPassword(): string {
        return btoa(this._password); // Encriptación básica
    }
}

// Clase que extiende otra
class UsuarioAdmin extends Usuario {
    public permisos: string[];
    
    constructor(nombre: string, email: string, password: string, permisos: string[]) {
        super(nombre, email, password); // Llamar constructor padre
        this.permisos = permisos;
    }
    
    public tienePermiso(permiso: string): boolean {
        return this.permisos.includes(permiso);
    }
    
    public agregarPermiso(permiso: string): void {
        if (!this.permisos.includes(permiso)) {
            this.permisos.push(permiso);
        }
    }
}

// Clase abstracta
abstract class ServicioBase<T> {
    protected abstract obtenerPorId(id: number): Promise<T>;
    protected abstract guardar(entidad: T): Promise<T>;
    
    public async procesar(id: number): Promise<T> {
        const entidad = await this.obtenerPorId(id);
        return await this.guardar(entidad);
    }
}
```

---

## 🔧 Tipos Avanzados

### Union Types y Intersection Types

```typescript
// Union Types
type ID = string | number;
type Estado = "activo" | "inactivo" | "pendiente";

function procesarID(id: ID): string {
    if (typeof id === "string") {
        return id.toUpperCase();
    } else {
        return id.toString();
    }
}

// Intersection Types
type Empleado = {
    id: number;
    nombre: string;
    salario: number;
};

type Gerente = {
    departamento: string;
    subordinados: Empleado[];
};

type GerenteEmpleado = Empleado & Gerente;

const gerente: GerenteEmpleado = {
    id: 1,
    nombre: "Juan Pérez",
    salario: 50000,
    departamento: "IT",
    subordinados: []
};
```

### Utility Types

```typescript
// Partial - Hace todas las propiedades opcionales
type UsuarioParcial = Partial<Usuario>;

// Required - Hace todas las propiedades requeridas
type UsuarioRequerido = Required<Usuario>;

// Pick - Selecciona propiedades específicas
type UsuarioBasico = Pick<Usuario, 'nombre' | 'email'>;

// Omit - Excluye propiedades específicas
type UsuarioSinID = Omit<Usuario, 'id' | 'createdAt'>;

// Record - Crea un tipo con claves y valores específicos
type Configuracion = Record<string, string | number | boolean>;

// ReturnType - Obtiene el tipo de retorno de una función
type ResultadoFuncion = ReturnType<typeof procesarID>;

// Parameters - Obtiene los tipos de parámetros de una función
type ParametrosFuncion = Parameters<typeof procesarID>;
```

### Conditional Types

```typescript
// Conditional Type básico
type TipoResultado<T> = T extends string ? string : number;

// Conditional Type con infer
type ElementoArray<T> = T extends Array<infer U> ? U : never;

// Conditional Type para funciones
type Parametros<T> = T extends (...args: infer P) => any ? P : never;
type Retorno<T> = T extends (...args: any[]) => infer R ? R : never;

// Ejemplo de uso
type ParametrosFuncion = Parametros<typeof procesarID>; // [ID]
type RetornoFuncion = Retorno<typeof procesarID>; // string
```

---

## 🧪 Testing

### Testing con Jest

```typescript
// usuario.test.ts
import { Usuario, UsuarioAdmin } from './usuario';

describe('Usuario', () => {
    let usuario: Usuario;
    
    beforeEach(() => {
        usuario = new Usuario('Juan Pérez', 'juan@example.com', 'password123');
    });
    
    test('debe crear un usuario con datos válidos', () => {
        expect(usuario.nombre).toBe('Juan Pérez');
        expect(usuario.email).toBe('juan@example.com');
        expect(usuario.id).toBeDefined();
    });
    
    test('debe cambiar la contraseña correctamente', () => {
        usuario.password = 'nuevaPassword123';
        expect(() => usuario.password = 'corta').toThrow();
    });
    
    test('debe saludar correctamente', () => {
        expect(usuario.saludar()).toBe('Hola, soy Juan Pérez');
    });
});

describe('UsuarioAdmin', () => {
    let admin: UsuarioAdmin;
    
    beforeEach(() => {
        admin = new UsuarioAdmin('Admin', 'admin@example.com', 'password123', ['read', 'write']);
    });
    
    test('debe tener permisos', () => {
        expect(admin.tienePermiso('read')).toBe(true);
        expect(admin.tienePermiso('delete')).toBe(false);
    });
    
    test('debe agregar permisos', () => {
        admin.agregarPermiso('delete');
        expect(admin.tienePermiso('delete')).toBe(true);
    });
});
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es TypeScript y cuáles son sus ventajas?**
   - Superset de JavaScript con tipado estático
   - Detección temprana de errores, mejor IDE support

2. **¿Cuál es la diferencia entre interface y type?**
   - Interfaces: extensibles, para objetos
   - Types: más flexibles, para cualquier tipo

3. **¿Qué son los generics en TypeScript?**
   - Tipos parametrizados para reutilización de código

### Preguntas Intermedias

4. **¿Cómo funciona el sistema de tipos en TypeScript?**
   - Tipado estructural, duck typing, type inference

5. **¿Qué son los decoradores?**
   - Metadata para clases, métodos, propiedades

6. **¿Cómo optimizas el rendimiento en TypeScript?**
   - Compilación incremental, tree shaking, dead code elimination

### Preguntas Avanzadas

7. **¿Cómo implementarías un sistema de tipos para una API REST?**
   - Utility types, conditional types, mapped types

8. **¿Qué es el patrón de discriminated unions?**
   - Union types con propiedades discriminantes

9. **¿Cómo manejarías la migración de JavaScript a TypeScript?**
   - Migración gradual, archivos .d.ts, configuración tsconfig

---

## 📚 Recursos Adicionales

- [Documentación oficial de TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de TypeScript! 🚀**
"""
    },
    
    "javascript": {
        "titulo": "🟨 JavaScript - Guía de Estudio Avanzada",
        "contenido": """
# 🟨 JavaScript - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos Avanzados](#fundamentos-avanzados)
2. [Asincronía y Promesas](#asincronía-y-promesas)
3. [Closures y Scope](#closures-y-scope)
4. [Prototipos y Herencia](#prototipos-y-herencia)
5. [ES6+ Features](#es6-features)
6. [Testing](#testing)
7. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos Avanzados

### Hoisting y Scope

```javascript
// Hoisting - Las declaraciones se mueven al top
console.log(x); // undefined (no error)
var x = 5;

// Equivale a:
var x;
console.log(x);
x = 5;

// Function hoisting
saludar(); // "Hola" - funciona
function saludar() {
    console.log("Hola");
}

// Let y const NO tienen hoisting
console.log(y); // ReferenceError
let y = 5;

// Temporal Dead Zone (TDZ)
console.log(z); // ReferenceError
const z = 10;
```

### Closures

```javascript
// Closure básico
function crearContador() {
    let contador = 0; // Variable privada
    
    return {
        incrementar: function() {
            contador++;
            return contador;
        },
        obtener: function() {
            return contador;
        },
        resetear: function() {
            contador = 0;
        }
    };
}

const miContador = crearContador();
console.log(miContador.incrementar()); // 1
console.log(miContador.incrementar()); // 2
console.log(miContador.obtener()); // 2
miContador.resetear();
console.log(miContador.obtener()); // 0

// Closure con parámetros
function multiplicarPor(factor) {
    return function(numero) {
        return numero * factor;
    };
}

const duplicar = multiplicarPor(2);
const triplicar = multiplicarPor(3);

console.log(duplicar(5)); // 10
console.log(triplicar(5)); // 15

// Closure en loops (problema común)
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 3, 3, 3 (no 0, 1, 2)
    }, 1000);
}

// Solución con IIFE
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(function() {
            console.log(index); // 0, 1, 2
        }, 1000);
    })(i);
}

// Solución con let (ES6)
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i); // 0, 1, 2
    }, 1000);
}
```

### This y Contexto

```javascript
// This en diferentes contextos
console.log(this); // window (en navegador) o global (en Node.js)

const objeto = {
    nombre: "Juan",
    saludar: function() {
        console.log(`Hola, soy ${this.nombre}`);
    }
};

objeto.saludar(); // "Hola, soy Juan"

// Problema con this en callbacks
const usuario = {
    nombre: "María",
    amigos: ["Juan", "Pedro"],
    saludarAmigos: function() {
        this.amigos.forEach(function(amigo) {
            console.log(`Hola ${amigo}, soy ${this.nombre}`); // this.nombre es undefined
        });
    }
};

// Soluciones
const usuario2 = {
    nombre: "María",
    amigos: ["Juan", "Pedro"],
    saludarAmigos: function() {
        const self = this; // Guardar referencia
        this.amigos.forEach(function(amigo) {
            console.log(`Hola ${amigo}, soy ${self.nombre}`);
        });
    }
};

// Con arrow function
const usuario3 = {
    nombre: "María",
    amigos: ["Juan", "Pedro"],
    saludarAmigos: function() {
        this.amigos.forEach(amigo => {
            console.log(`Hola ${amigo}, soy ${this.nombre}`);
        });
    }
};

// Con bind
const usuario4 = {
    nombre: "María",
    amigos: ["Juan", "Pedro"],
    saludarAmigos: function() {
        this.amigos.forEach(function(amigo) {
            console.log(`Hola ${amigo}, soy ${this.nombre}`);
        }.bind(this));
    }
};
```

---

## ⚡ Asincronía y Promesas

### Callbacks

```javascript
// Callback hell (problema)
function obtenerUsuario(id, callback) {
    setTimeout(() => {
        const usuario = { id, nombre: "Juan" };
        callback(null, usuario);
    }, 1000);
}

function obtenerPosts(usuarioId, callback) {
    setTimeout(() => {
        const posts = [{ id: 1, titulo: "Post 1" }];
        callback(null, posts);
    }, 1000);
}

function obtenerComentarios(postId, callback) {
    setTimeout(() => {
        const comentarios = [{ id: 1, texto: "Comentario 1" }];
        callback(null, comentarios);
    }, 1000);
}

// Uso (callback hell)
obtenerUsuario(1, (error, usuario) => {
    if (error) {
        console.error(error);
        return;
    }
    
    obtenerPosts(usuario.id, (error, posts) => {
        if (error) {
            console.error(error);
            return;
        }
        
        obtenerComentarios(posts[0].id, (error, comentarios) => {
            if (error) {
                console.error(error);
                return;
            }
            
            console.log(comentarios);
        });
    });
});
```

### Promesas

```javascript
// Crear promesas
function obtenerUsuario(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                const usuario = { id, nombre: "Juan" };
                resolve(usuario);
            } else {
                reject(new Error("ID inválido"));
            }
        }, 1000);
    });
}

function obtenerPosts(usuarioId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const posts = [{ id: 1, titulo: "Post 1" }];
            resolve(posts);
        }, 1000);
    });
}

function obtenerComentarios(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const comentarios = [{ id: 1, texto: "Comentario 1" }];
            resolve(comentarios);
        }, 1000);
    });
}

// Uso con .then()
obtenerUsuario(1)
    .then(usuario => {
        console.log("Usuario:", usuario);
        return obtenerPosts(usuario.id);
    })
    .then(posts => {
        console.log("Posts:", posts);
        return obtenerComentarios(posts[0].id);
    })
    .then(comentarios => {
        console.log("Comentarios:", comentarios);
    })
    .catch(error => {
        console.error("Error:", error);
    });

// Promise.all() - Ejecutar múltiples promesas en paralelo
Promise.all([
    obtenerUsuario(1),
    obtenerUsuario(2),
    obtenerUsuario(3)
])
.then(usuarios => {
    console.log("Todos los usuarios:", usuarios);
})
.catch(error => {
    console.error("Error:", error);
});

// Promise.race() - Primera promesa que se complete
Promise.race([
    obtenerUsuario(1),
    obtenerUsuario(2)
])
.then(primerUsuario => {
    console.log("Primer usuario:", primerUsuario);
});
```

### Async/Await

```javascript
// Función async
async function obtenerDatosCompletos() {
    try {
        const usuario = await obtenerUsuario(1);
        console.log("Usuario:", usuario);
        
        const posts = await obtenerPosts(usuario.id);
        console.log("Posts:", posts);
        
        const comentarios = await obtenerComentarios(posts[0].id);
        console.log("Comentarios:", comentarios);
        
        return { usuario, posts, comentarios };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Uso
obtenerDatosCompletos()
    .then(datos => {
        console.log("Datos completos:", datos);
    })
    .catch(error => {
        console.error("Error final:", error);
    });

// Async/Await con Promise.all
async function obtenerUsuariosParalelo() {
    try {
        const usuarios = await Promise.all([
            obtenerUsuario(1),
            obtenerUsuario(2),
            obtenerUsuario(3)
        ]);
        
        console.log("Usuarios en paralelo:", usuarios);
        return usuarios;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Async/Await con Promise.race
async function obtenerPrimerUsuario() {
    try {
        const usuario = await Promise.race([
            obtenerUsuario(1),
            obtenerUsuario(2)
        ]);
        
        console.log("Primer usuario:", usuario);
        return usuario;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
```

---

## 🧪 Testing

### Testing con Jest

```javascript
// usuario.test.js
const { Usuario, crearContador } = require('./usuario');

describe('Usuario', () => {
    let usuario;
    
    beforeEach(() => {
        usuario = new Usuario('Juan Pérez', 'juan@example.com');
    });
    
    test('debe crear un usuario con datos válidos', () => {
        expect(usuario.nombre).toBe('Juan Pérez');
        expect(usuario.email).toBe('juan@example.com');
    });
    
    test('debe cambiar el nombre correctamente', () => {
        usuario.setNombre('María García');
        expect(usuario.nombre).toBe('María García');
    });
    
    test('debe validar email correctamente', () => {
        expect(usuario.validarEmail()).toBe(true);
        
        usuario.email = 'email-invalido';
        expect(usuario.validarEmail()).toBe(false);
    });
});

describe('Closures', () => {
    test('debe mantener el estado del contador', () => {
        const contador = crearContador();
        
        expect(contador.obtener()).toBe(0);
        expect(contador.incrementar()).toBe(1);
        expect(contador.incrementar()).toBe(2);
        expect(contador.obtener()).toBe(2);
    });
});

describe('Promesas', () => {
    test('debe resolver promesa correctamente', async () => {
        const resultado = await obtenerUsuario(1);
        expect(resultado.id).toBe(1);
        expect(resultado.nombre).toBe('Juan');
    });
    
    test('debe manejar errores en promesas', async () => {
        await expect(obtenerUsuario(-1)).rejects.toThrow('ID inválido');
    });
});
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es JavaScript y cuáles son sus características?**
   - Lenguaje interpretado, dinámico, orientado a objetos

2. **¿Cuál es la diferencia entre var, let y const?**
   - var: hoisting, function scope
   - let: block scope, temporal dead zone
   - const: block scope, no reasignación

3. **¿Qué son los closures?**
   - Función que accede a variables de su scope externo

### Preguntas Intermedias

4. **¿Cómo funciona el prototipo en JavaScript?**
   - Herencia prototipal, __proto__, prototype

5. **¿Qué es el event loop?**
   - Call stack, web APIs, callback queue, microtask queue

6. **¿Cómo optimizas el rendimiento en JavaScript?**
   - Debouncing, throttling, lazy loading, code splitting

### Preguntas Avanzadas

7. **¿Cómo implementarías un sistema de módulos?**
   - ES6 modules, CommonJS, AMD, dynamic imports

8. **¿Qué es el patrón de observadores?**
   - Event emitters, pub/sub, custom events

9. **¿Cómo manejarías la memoria en JavaScript?**
   - Garbage collection, memory leaks, profiling

---

## 📚 Recursos Adicionales

- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [JavaScript.info](https://javascript.info/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de JavaScript! 🚀**
"""
    }
}

def crear_guia_tecnologia(tecnologia, config):
    """Crear guía de estudio para una tecnología específica"""
    ruta_archivo = f"categorias/frontend/{tecnologia}/README.md"
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(ruta_archivo), exist_ok=True)
    
    # Escribir contenido
    with open(ruta_archivo, 'w', encoding='utf-8') as f:
        f.write(config["contenido"])
    
    print(f"✅ Guía creada: {ruta_archivo}")

def main():
    """Función principal"""
    print("🚀 Generando guías de estudio avanzadas...")
    
    # Generar guías para cada tecnología
    for tecnologia, config in TECNOLOGIAS.items():
        crear_guia_tecnologia(tecnologia, config)
    
    print("\n🎉 ¡Todas las guías han sido generadas exitosamente!")
    print("\n📁 Estructura creada:")
    for tecnologia in TECNOLOGIAS.keys():
        print(f"   - categorias/frontend/{tecnologia}/README.md")

if __name__ == "__main__":
    main() 