
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
