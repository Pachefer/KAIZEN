# Guía de Entrevistas TypeScript - Fundamentos
## Preguntas y Respuestas con Ejemplos de Código y Pruebas Unitarias

---

## 1. ¿Qué es TypeScript y cuáles son sus ventajas?

**Respuesta:** TypeScript es un superset de JavaScript que añade tipado estático opcional, clases, interfaces y otras características de programación orientada a objetos.

### Ventajas principales:
- **Detección temprana de errores** en tiempo de compilación
- **Mejor IntelliSense** y autocompletado
- **Código más mantenible** y legible
- **Refactoring más seguro**

### Ejemplo de Código:

```typescript
// Definición de tipos básicos
interface Usuario {
    id: number;
    nombre: string;
    email: string;
    activo: boolean;
}

// Función con tipado fuerte
function crearUsuario(datos: Partial<Usuario>): Usuario {
    return {
        id: Math.floor(Math.random() * 1000),
        nombre: datos.nombre || 'Usuario Anónimo',
        email: datos.email || 'usuario@ejemplo.com',
        activo: datos.activo ?? true
    };
}

// Uso de la función
const nuevoUsuario = crearUsuario({
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com'
});

// Resultado esperado:
// nuevoUsuario = {
//   id: 123,           // Número aleatorio generado
//   nombre: 'Juan Pérez',
//   email: 'juan@ejemplo.com',
//   activo: true       // Valor por defecto
// }
```

### Pruebas Unitarias:

```typescript
// tests/fundamentos.test.ts
import { describe, it, expect } from 'vitest';

describe('Fundamentos TypeScript', () => {
    it('debería crear un usuario con datos completos', () => {
        const datosUsuario = {
            nombre: 'María García',
            email: 'maria@ejemplo.com',
            activo: false
        };
        
        const usuario = crearUsuario(datosUsuario);
        
        expect(usuario.id).toBeTypeOf('number');
        expect(usuario.nombre).toBe('María García');
        expect(usuario.email).toBe('maria@ejemplo.com');
        expect(usuario.activo).toBe(false);
    });

    it('debería crear un usuario con valores por defecto', () => {
        const usuario = crearUsuario({});
        
        expect(usuario.nombre).toBe('Usuario Anónimo');
        expect(usuario.email).toBe('usuario@ejemplo.com');
        expect(usuario.activo).toBe(true);
    });
});
```

---

## 2. ¿Cuál es la diferencia entre `let`, `const` y `var`?

**Respuesta:** 
- `const`: Para valores que no cambiarán (inmutable)
- `let`: Para variables que pueden cambiar (scope de bloque)
- `var`: Función-scoped, puede causar problemas de hoisting

### Ejemplo de Código:

```typescript
// Ejemplo de scope y hoisting
function demostrarScope() {
    // var tiene function scope
    var variableVar = 'soy var';
    
    // let y const tienen block scope
    if (true) {
        let variableLet = 'soy let';
        const variableConst = 'soy const';
        
        console.log(variableLet); // ✅ Funciona
        console.log(variableConst); // ✅ Funciona
    }
    
    // console.log(variableLet); // ❌ Error: variableLet no está definida
    // console.log(variableConst); // ❌ Error: variableConst no está definida
    console.log(variableVar); // ✅ Funciona (function scope)
}

// Ejemplo de const con objetos
const usuario = {
    nombre: 'Ana',
    edad: 25
};

// usuario = {}; // ❌ Error: no se puede reasignar
usuario.edad = 26; // ✅ Funciona: modificamos propiedades, no la referencia

// Resultado esperado:
// usuario = {
//   nombre: 'Ana',
//   edad: 26        // Propiedad modificada exitosamente
// }
```

### Pruebas Unitarias:

```typescript
// tests/variables.test.ts
describe('Variables y Scope', () => {
    it('debería demostrar el comportamiento de const con objetos', () => {
        const persona = {
            nombre: 'Carlos',
            edad: 30
        };
        
        // Modificar propiedades es válido
        persona.edad = 31;
        expect(persona.edad).toBe(31);
        
        // Reasignar la variable no es válido
        expect(() => {
            // @ts-ignore - Ignoramos el error de TypeScript para la prueba
            persona = { nombre: 'Otro', edad: 25 };
        }).toThrow();
    });

    it('debería demostrar el block scope de let', () => {
        let contador = 0;
        
        if (true) {
            let contador = 10; // Variable local
            expect(contador).toBe(10);
        }
        
        expect(contador).toBe(0); // Variable externa no afectada
    });
});
```

---

## 3. ¿Qué son los tipos genéricos y cómo se usan?

**Respuesta:** Los genéricos permiten crear funciones, clases e interfaces que pueden trabajar con múltiples tipos de datos manteniendo la seguridad de tipos.

### Ejemplo de Código:

```typescript
// Función genérica simple
function intercambiar<T>(a: T, b: T): [T, T] {
    return [b, a];
}

// Clase genérica
class Contenedor<T> {
    private elementos: T[] = [];
    
    agregar(elemento: T): void {
        this.elementos.push(elemento);
    }
    
    obtener(indice: number): T | undefined {
        return this.elementos[indice];
    }
    
    obtenerTodos(): T[] {
        return [...this.elementos];
    }
}

// Interface genérica
interface Resultado<T, E = Error> {
    datos: T | null;
    error: E | null;
    exito: boolean;
}

// Función que usa la interface genérica
function procesarDatos<T>(datos: T[]): Resultado<T[]> {
    try {
        const resultado = datos.map(item => item);
        return {
            datos: resultado,
            error: null,
            exito: true
        };
    } catch (error) {
        return {
            datos: null,
            error: error as Error,
            exito: false
        };
    }
}

// Ejemplo de uso:
// const resultado = procesarDatos([1, 2, 3, 4, 5]);
// Resultado esperado:
// {
//   datos: [1, 2, 3, 4, 5],
//   error: null,
//   exito: true
// }
```

### Pruebas Unitarias:

```typescript
// tests/genericos.test.ts
describe('Genéricos', () => {
    it('debería intercambiar valores de cualquier tipo', () => {
        const resultado = intercambiar('hola', 'mundo');
        expect(resultado).toEqual(['mundo', 'hola']);
        
        const numeros = intercambiar(1, 2);
        expect(numeros).toEqual([2, 1]);
    });

    it('debería manejar contenedor genérico', () => {
        const contenedor = new Contenedor<string>();
        contenedor.agregar('elemento1');
        contenedor.agregar('elemento2');
        
        expect(contenedor.obtener(0)).toBe('elemento1');
        expect(contenedor.obtenerTodos()).toEqual(['elemento1', 'elemento2']);
    });

    it('debería procesar datos correctamente', () => {
        const datos = [1, 2, 3, 4, 5];
        const resultado = procesarDatos(datos);
        
        expect(resultado.exito).toBe(true);
        expect(resultado.datos).toEqual([1, 2, 3, 4, 5]);
        expect(resultado.error).toBeNull();
    });
});
```

---

## 4. ¿Qué son las interfaces y cómo se diferencian de los tipos?

**Respuesta:** Las interfaces definen contratos que las clases deben implementar, mientras que los tipos pueden representar uniones, intersecciones y tipos primitivos.

### Ejemplo de Código:

```typescript
// Interface básica
interface Vehiculo {
    marca: string;
    modelo: string;
    año: number;
    encender(): void;
    apagar(): void;
}

// Interface que extiende otra
interface Coche extends Vehiculo {
    numPuertas: number;
    combustible: 'gasolina' | 'diesel' | 'electrico';
}

// Interface con métodos opcionales
interface Configuracion {
    tema: string;
    idioma?: string; // Propiedad opcional
    notificaciones?: boolean;
}

// Interface con índices
interface Diccionario {
    [key: string]: string;
}

// Tipo de unión
type Estado = 'cargando' | 'exito' | 'error';

// Tipo de intersección
type UsuarioAutenticado = Usuario & {
    token: string;
    expiracion: Date;
};

// Implementación de interface
class MiCoche implements Coche {
    constructor(
        public marca: string,
        public modelo: string,
        public año: number,
        public numPuertas: number,
        public combustible: 'gasolina' | 'diesel' | 'electrico'
    ) {}
    
    encender(): void {
        console.log(`${this.marca} ${this.modelo} encendido`);
    }
    
    apagar(): void {
        console.log(`${this.marca} ${this.modelo} apagado`);
    }
}

// Ejemplo de uso:
// const miCoche = new MiCoche('Toyota', 'Corolla', 2023, 4, 'gasolina');
// miCoche.encender();
// Resultado esperado en consola: "Toyota Corolla encendido"
// miCoche.apagar();
// Resultado esperado en consola: "Toyota Corolla apagado"
```

### Pruebas Unitarias:

```typescript
// tests/interfaces.test.ts
describe('Interfaces y Tipos', () => {
    it('debería crear un coche que implementa la interface Vehiculo', () => {
        const miCoche = new MiCoche('Toyota', 'Corolla', 2023, 4, 'gasolina');
        
        expect(miCoche.marca).toBe('Toyota');
        expect(miCoche.modelo).toBe('Corolla');
        expect(miCoche.numPuertas).toBe(4);
        expect(miCoche.combustible).toBe('gasolina');
        
        // Verificar que tiene los métodos requeridos
        expect(typeof miCoche.encender).toBe('function');
        expect(typeof miCoche.apagar).toBe('function');
    });

    it('debería manejar tipos de unión', () => {
        const estados: Estado[] = ['cargando', 'exito', 'error'];
        
        estados.forEach(estado => {
            expect(['cargando', 'exito', 'error']).toContain(estado);
        });
    });

    it('debería crear configuración con propiedades opcionales', () => {
        const config1: Configuracion = { tema: 'oscuro' };
        const config2: Configuracion = { 
            tema: 'claro', 
            idioma: 'es', 
            notificaciones: true 
        };
        
        expect(config1.tema).toBe('oscuro');
        expect(config1.idioma).toBeUndefined();
        
        expect(config2.tema).toBe('claro');
        expect(config2.idioma).toBe('es');
        expect(config2.notificaciones).toBe(true);
    });
});
```

---

## 5. ¿Qué son los decoradores y cómo se usan?

**Respuesta:** Los decoradores son funciones que modifican el comportamiento de clases, métodos, propiedades o parámetros usando metaprogramación.

### Ejemplo de Código:

```typescript
// Decorador de clase
function log(constructor: Function) {
    console.log(`Clase ${constructor.name} creada`);
}

// Decorador de método
function logMetodo(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metodoOriginal = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Ejecutando método ${propertyKey} con argumentos:`, args);
        const resultado = metodoOriginal.apply(this, args);
        console.log(`Resultado de ${propertyKey}:`, resultado);
        return resultado;
    };
    
    return descriptor;
}

// Decorador de propiedad
function readonly(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        writable: false,
        configurable: false
    });
}

// Decorador de parámetro
function validar(target: any, propertyKey: string, parameterIndex: number) {
    // Guardar información de validación
    if (!target.validaciones) {
        target.validaciones = [];
    }
    target.validaciones.push({ propertyKey, parameterIndex });
}

// Clase con decoradores
@log
class Calculadora {
    @readonly
    version = '1.0.0';
    
    @logMetodo
    sumar(@validar a: number, @validar b: number): number {
        return a + b;
    }
    
    @logMetodo
    multiplicar(a: number, b: number): number {
        return a * b;
    }
}

// Ejemplo de uso:
// const calc = new Calculadora();
// Resultado esperado en consola: "Clase Calculadora creada"
// 
// const resultado = calc.sumar(5, 3);
// Resultado esperado en consola:
// "Ejecutando método sumar con argumentos: [5, 3]"
// "Resultado de sumar: 8"
// resultado = 8
// 
// calc.version = '2.0.0'; // ❌ Error: Cannot assign to 'version' because it is a read-only property

// Decorador factory
function tiempoEjecucion(ms: number) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const metodoOriginal = descriptor.value;
        
        descriptor.value = function(...args: any[]) {
            const inicio = Date.now();
            const resultado = metodoOriginal.apply(this, args);
            const fin = Date.now();
            
            if (fin - inicio > ms) {
                console.warn(`Método ${propertyKey} tardó ${fin - inicio}ms (límite: ${ms}ms)`);
            }
            
            return resultado;
        };
        
        return descriptor;
    };
}

class ServicioLento {
    @tiempoEjecucion(100)
    async procesarDatos(datos: any[]) {
        await new Promise(resolve => setTimeout(resolve, 150));
        return datos.map(item => item * 2);
    }
}
```

### Pruebas Unitarias:

```typescript
// tests/decoradores.test.ts
describe('Decoradores', () => {
    it('debería aplicar decorador de clase', () => {
        const spy = jest.spyOn(console, 'log');
        const calculadora = new Calculadora();
        
        expect(spy).toHaveBeenCalledWith('Clase Calculadora creada');
        spy.mockRestore();
    });

    it('debería aplicar decorador de método', () => {
        const spy = jest.spyOn(console, 'log');
        const calculadora = new Calculadora();
        
        const resultado = calculadora.sumar(5, 3);
        
        expect(resultado).toBe(8);
        expect(spy).toHaveBeenCalledWith('Ejecutando método sumar con argumentos:', [5, 3]);
        expect(spy).toHaveBeenCalledWith('Resultado de sumar:', 8);
        
        spy.mockRestore();
    });

    it('debería hacer la propiedad readonly', () => {
        const calculadora = new Calculadora();
        
        expect(() => {
            calculadora.version = '2.0.0';
        }).toThrow();
        
        expect(calculadora.version).toBe('1.0.0');
    });

    it('debería aplicar decorador de tiempo de ejecución', async () => {
        const spy = jest.spyOn(console, 'warn');
        const servicio = new ServicioLento();
        
        await servicio.procesarDatos([1, 2, 3]);
        
        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining('Método procesarDatos tardó')
        );
        
        spy.mockRestore();
    });
});
```

---

## Configuración de Pruebas

Para ejecutar las pruebas, necesitas configurar Vitest en tu `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

Y crear un archivo `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

---

## Resumen de Conceptos Clave

1. **TypeScript** es un superset de JavaScript con tipado estático
2. **Variables**: `const` (inmutable), `let` (block scope), `var` (function scope)
3. **Genéricos** permiten código reutilizable con tipos seguros
4. **Interfaces** definen contratos, **Tipos** pueden ser uniones/intersecciones
5. **Decoradores** modifican comportamiento usando metaprogramación

Cada concepto incluye ejemplos prácticos y pruebas unitarias para reforzar el aprendizaje. 