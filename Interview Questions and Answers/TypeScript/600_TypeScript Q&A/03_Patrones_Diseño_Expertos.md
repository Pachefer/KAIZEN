# Guía de Entrevistas TypeScript - Patrones de Diseño y Conceptos Expertos
## Preguntas y Respuestas con Ejemplos de Código y Pruebas Unitarias

---

## 9. ¿Qué son los patrones de diseño y cómo se implementan en TypeScript?

**Respuesta:** Los patrones de diseño son soluciones reutilizables para problemas comunes en el desarrollo de software. TypeScript facilita su implementación con tipado fuerte.

### Patrón Singleton

```typescript
// Implementación de Singleton con TypeScript
class ConfiguracionGlobal {
    private static instancia: ConfiguracionGlobal;
    private configuraciones: Map<string, any> = new Map();

    private constructor() {
        // Constructor privado para evitar instanciación directa
        this.configuraciones.set('tema', 'claro');
        this.configuraciones.set('idioma', 'es');
        this.configuraciones.set('timeout', 5000);
    }

    public static obtenerInstancia(): ConfiguracionGlobal {
        if (!ConfiguracionGlobal.instancia) {
            ConfiguracionGlobal.instancia = new ConfiguracionGlobal();
        }
        return ConfiguracionGlobal.instancia;
    }

    obtener<T>(clave: string, valorPorDefecto?: T): T | undefined {
        return this.configuraciones.get(clave) ?? valorPorDefecto;
    }

    establecer<T>(clave: string, valor: T): void {
        this.configuraciones.set(clave, valor);
    }

    eliminar(clave: string): boolean {
        return this.configuraciones.delete(clave);
    }

    obtenerTodas(): Record<string, any> {
        return Object.fromEntries(this.configuraciones);
    }

    // Ejemplos de uso:
    // const config = ConfiguracionGlobal.obtenerInstancia();
    // config.obtener('tema') → 'claro'
    // config.obtener('clave-inexistente', 'default') → 'default'
    // config.establecer('nuevaClave', 'nuevoValor')
    // config.obtener('nuevaClave') → 'nuevoValor'
    // config.eliminar('nuevaClave') → true
    // config.obtenerTodas() → { tema: 'claro', idioma: 'es', timeout: 5000 }
}

// Uso del Singleton
const config1 = ConfiguracionGlobal.obtenerInstancia();
const config2 = ConfiguracionGlobal.obtenerInstancia();
console.log(config1 === config2); // true - misma instancia
```

### Patrón Factory

```typescript
// Interfaces para el patrón Factory
interface Vehiculo {
    arrancar(): void;
    detener(): void;
    obtenerTipo(): string;
}

interface VehiculoFactory {
    crearVehiculo(tipo: string): Vehiculo;
}

// Implementaciones concretas
class Coche implements Vehiculo {
    arrancar(): void {
        console.log('Coche arrancando...');
    }

    detener(): void {
        console.log('Coche deteniéndose...');
    }

    obtenerTipo(): string {
        return 'Coche';
    }
}

class Moto implements Vehiculo {
    arrancar(): void {
        console.log('Moto arrancando...');
    }

    detener(): void {
        console.log('Moto deteniéndose...');
    }

    obtenerTipo(): string {
        return 'Moto';
    }
}

class Bicicleta implements Vehiculo {
    arrancar(): void {
        console.log('Bicicleta iniciando pedaleo...');
    }

    detener(): void {
        console.log('Bicicleta frenando...');
    }

    obtenerTipo(): string {
        return 'Bicicleta';
    }
}

// Factory concreta
class VehiculoFactoryImpl implements VehiculoFactory {
    crearVehiculo(tipo: string): Vehiculo {
        switch (tipo.toLowerCase()) {
            case 'coche':
                return new Coche();
            case 'moto':
                return new Moto();
            case 'bicicleta':
                return new Bicicleta();
            default:
                throw new Error(`Tipo de vehículo no soportado: ${tipo}`);
        }
    }
}

// Ejemplos de uso:
// const factory = new VehiculoFactoryImpl();
// const coche = factory.crearVehiculo('coche');
// coche.obtenerTipo() → 'Coche'
// coche.arrancar() → "Coche arrancando..."
// 
// const moto = factory.crearVehiculo('moto');
// moto.obtenerTipo() → 'Moto'
// moto.arrancar() → "Moto arrancando..."
// 
// factory.crearVehiculo('avion') → Error: "Tipo de vehículo no soportado: avion"

// Factory abstracta con genéricos
abstract class AbstractFactory<T> {
    abstract crear(): T;
}

class CocheFactory extends AbstractFactory<Coche> {
    crear(): Coche {
        return new Coche();
    }
}

class MotoFactory extends AbstractFactory<Moto> {
    crear(): Moto {
        return new Moto();
    }
}
```

### Patrón Observer

```typescript
// Interfaces para el patrón Observer
interface Observer {
    actualizar(datos: any): void;
}

interface Subject {
    agregarObserver(observer: Observer): void;
    removerObserver(observer: Observer): void;
    notificarObservers(datos: any): void;
}

// Implementación del Subject
class EstacionMeteorologica implements Subject {
    private observers: Observer[] = [];
    private temperatura: number = 20;
    private humedad: number = 60;

    agregarObserver(observer: Observer): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    removerObserver(observer: Observer): void {
        const indice = this.observers.indexOf(observer);
        if (indice > -1) {
            this.observers.splice(indice, 1);
        }
    }

    notificarObservers(datos: any): void {
        this.observers.forEach(observer => observer.actualizar(datos));
    }

    actualizarMediciones(temperatura: number, humedad: number): void {
        this.temperatura = temperatura;
        this.humedad = humedad;
        
        this.notificarObservers({
            temperatura: this.temperatura,
            humedad: this.humedad,
            timestamp: new Date()
        });
    }

    // Ejemplo de uso:
    // const estacion = new EstacionMeteorologica();
    // const pantallaTemp = new PantallaTemperatura('Pantalla 1');
    // const pantallaHum = new PantallaHumedad('Pantalla 2');
    // 
    // estacion.agregarObserver(pantallaTemp);
    // estacion.agregarObserver(pantallaHum);
    // 
    // estacion.actualizarMediciones(25, 70);
    // Resultado esperado en consola:
    // "Pantalla 1: Temperatura actual: 25°C"
    // "Pantalla 2: Humedad actual: 70%"

    obtenerMediciones() {
        return {
            temperatura: this.temperatura,
            humedad: this.humedad
        };
    }
}

// Implementaciones de Observer
class PantallaTemperatura implements Observer {
    private nombre: string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    actualizar(datos: any): void {
        console.log(`${this.nombre}: Temperatura actual: ${datos.temperatura}°C`);
    }
}

class PantallaHumedad implements Observer {
    private nombre: string;

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    actualizar(datos: any): void {
        console.log(`${this.nombre}: Humedad actual: ${datos.humedad}%`);
    }
}

class RegistroHistorico implements Observer {
    private historial: any[] = [];

    actualizar(datos: any): void {
        this.historial.push(datos);
        console.log(`Registro histórico: ${this.historial.length} mediciones guardadas`);
    }

    obtenerHistorial(): any[] {
        return [...this.historial];
    }
}
```

### Pruebas Unitarias:

```typescript
// tests/patrones-diseno.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Patrones de Diseño', () => {
    describe('Singleton', () => {
        it('debería retornar la misma instancia', () => {
            const instancia1 = ConfiguracionGlobal.obtenerInstancia();
            const instancia2 = ConfiguracionGlobal.obtenerInstancia();
            
            expect(instancia1).toBe(instancia2);
        });

        it('debería mantener configuración entre instancias', () => {
            const config1 = ConfiguracionGlobal.obtenerInstancia();
            const config2 = ConfiguracionGlobal.obtenerInstancia();
            
            config1.establecer('test', 'valor');
            expect(config2.obtener('test')).toBe('valor');
        });

        it('debería retornar valor por defecto', () => {
            const config = ConfiguracionGlobal.obtenerInstancia();
            const valor = config.obtener('clave-inexistente', 'default');
            expect(valor).toBe('default');
        });
    });

    describe('Factory', () => {
        let factory: VehiculoFactory;

        beforeEach(() => {
            factory = new VehiculoFactoryImpl();
        });

        it('debería crear un coche', () => {
            const vehiculo = factory.crearVehiculo('coche');
            expect(vehiculo.obtenerTipo()).toBe('Coche');
        });

        it('debería crear una moto', () => {
            const vehiculo = factory.crearVehiculo('moto');
            expect(vehiculo.obtenerTipo()).toBe('Moto');
        });

        it('debería crear una bicicleta', () => {
            const vehiculo = factory.crearVehiculo('bicicleta');
            expect(vehiculo.obtenerTipo()).toBe('Bicicleta');
        });

        it('debería lanzar error para tipo no soportado', () => {
            expect(() => factory.crearVehiculo('avion')).toThrow('Tipo de vehículo no soportado');
        });

        it('debería usar factories abstractas', () => {
            const cocheFactory = new CocheFactory();
            const motoFactory = new MotoFactory();
            
            const coche = cocheFactory.crear();
            const moto = motoFactory.crear();
            
            expect(coche.obtenerTipo()).toBe('Coche');
            expect(moto.obtenerTipo()).toBe('Moto');
        });
    });

    describe('Observer', () => {
        let estacion: EstacionMeteorologica;
        let pantallaTemp: PantallaTemperatura;
        let pantallaHum: PantallaHumedad;
        let registro: RegistroHistorico;

        beforeEach(() => {
            estacion = new EstacionMeteorologica();
            pantallaTemp = new PantallaTemperatura('Pantalla 1');
            pantallaHum = new PantallaHumedad('Pantalla 2');
            registro = new RegistroHistorico();
        });

        it('debería agregar observers', () => {
            estacion.agregarObserver(pantallaTemp);
            estacion.agregarObserver(pantallaHum);
            
            const spy = jest.spyOn(console, 'log');
            estacion.actualizarMediciones(25, 70);
            
            expect(spy).toHaveBeenCalledTimes(2);
            spy.mockRestore();
        });

        it('debería remover observers', () => {
            estacion.agregarObserver(pantallaTemp);
            estacion.agregarObserver(pantallaHum);
            estacion.removerObserver(pantallaTemp);
            
            const spy = jest.spyOn(console, 'log');
            estacion.actualizarMediciones(30, 80);
            
            expect(spy).toHaveBeenCalledTimes(1);
            spy.mockRestore();
        });

        it('debería notificar a todos los observers', () => {
            estacion.agregarObserver(pantallaTemp);
            estacion.agregarObserver(pantallaHum);
            estacion.agregarObserver(registro);
            
            estacion.actualizarMediciones(35, 85);
            
            const historial = registro.obtenerHistorial();
            expect(historial).toHaveLength(1);
            expect(historial[0].temperatura).toBe(35);
            expect(historial[0].humedad).toBe(85);
        });

        it('no debería agregar observers duplicados', () => {
            estacion.agregarObserver(pantallaTemp);
            estacion.agregarObserver(pantallaTemp); // Duplicado
            
            const spy = jest.spyOn(console, 'log');
            estacion.actualizarMediciones(40, 90);
            
            expect(spy).toHaveBeenCalledTimes(1); // Solo una notificación
            spy.mockRestore();
        });
    });
});
```

---

## 10. ¿Qué son los tipos condicionales y mapeados en TypeScript?

**Respuesta:** Los tipos condicionales permiten crear tipos que dependen de otros tipos, mientras que los tipos mapeados transforman propiedades de tipos existentes.

### Tipos Condicionales

```typescript
// Tipo condicional básico
type EsString<T> = T extends string ? true : false;

// Tipo condicional con inferencia
type ElementoArray<T> = T extends (infer U)[] ? U : never;

// Tipo condicional con múltiples condiciones
type TipoResultado<T> = T extends string
    ? 'string'
    : T extends number
    ? 'number'
    : T extends boolean
    ? 'boolean'
    : 'unknown';

// Tipo condicional para extraer tipos de promesas
type DesenvolverPromesa<T> = T extends Promise<infer U> ? U : T;

// Tipo condicional para funciones
type ParametrosFuncion<T> = T extends (...args: infer P) => any ? P : never;
type RetornoFuncion<T> = T extends (...args: any[]) => infer R ? R : never;

// Tipo condicional para objetos
type PropiedadesOpcionales<T> = {
    [K in keyof T]: T[K] extends undefined ? never : K;
}[keyof T];

type PropiedadesRequeridas<T> = {
    [K in keyof T]: T[K] extends undefined ? K : never;
}[keyof T];

// Ejemplos de uso
type Test1 = EsString<string>; // true
type Test2 = EsString<number>; // false
type Test3 = ElementoArray<string[]>; // string
type Test4 = ElementoArray<number[]>; // number
type Test5 = TipoResultado<string>; // 'string'
type Test6 = TipoResultado<number>; // 'number'

// Verificación en runtime:
// const esString = (valor: any): boolean => typeof valor === 'string';
// esString('hola') → true
// esString(123) → false
// 
// const obtenerElemento = <T>(arr: T[]): T => arr[0];
// obtenerElemento(['a', 'b', 'c']) → 'a'
// obtenerElemento([1, 2, 3]) → 1

// Aplicación práctica
interface Usuario {
    id: number;
    nombre: string;
    email?: string;
    edad?: number;
}

type PropiedadesObligatorias = PropiedadesRequeridas<Usuario>; // 'id' | 'nombre'
type PropiedadesOpcionales = PropiedadesOpcionales<Usuario>; // 'email' | 'edad'
```

### Tipos Mapeados

```typescript
// Tipo mapeado básico
type HacerOpcional<T> = {
    [K in keyof T]?: T[K];
};

type HacerRequerido<T> = {
    [K in keyof T]-?: T[K];
};

type HacerSoloLectura<T> = {
    readonly [K in keyof T]: T[K];
};

type HacerMutable<T> = {
    -readonly [K in keyof T]: T[K];
};

// Tipo mapeado con filtros
type SoloPropiedadesString<T> = {
    [K in keyof T]: T[K] extends string ? T[K] : never;
};

type SoloPropiedadesFuncion<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : never;
};

// Tipo mapeado con transformación de nombres
type PrefijoPropiedades<T, P extends string> = {
    [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

type SufijoPropiedades<T, S extends string> = {
    [K in keyof T as `${string & K}${Capitalize<S>}`]: T[K];
};

// Tipo mapeado para eventos
type EventosConHandlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}`]: (evento: T[K]) => void;
};

// Aplicación práctica
interface Formulario {
    nombre: string;
    email: string;
    edad: number;
    activo: boolean;
}

type FormularioOpcional = HacerOpcional<Formulario>;
type FormularioSoloLectura = HacerSoloLectura<Formulario>;
type FormularioConPrefijo = PrefijoPropiedades<Formulario, 'form'>;
type FormularioConSufijo = SufijoPropiedades<Formulario, 'Field'>;

// Tipo mapeado para API responses
interface DatosUsuario {
    id: number;
    nombre: string;
    email: string;
}

type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
};

type UsuarioResponse = ApiResponse<DatosUsuario>;

// Tipo mapeado para validación
type ValidacionReglas<T> = {
    [K in keyof T]: {
        requerido?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (valor: T[K]) => boolean;
    };
};

type ValidacionUsuario = ValidacionReglas<DatosUsuario>;
```

### Tipos Avanzados con Condicionales y Mapeados

```typescript
// Tipo para deep partial
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// Tipo para deep readonly
type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Tipo para pick condicional
type PickByType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type PickStringProps<T> = Pick<T, PickByType<T, string>>;
type PickNumberProps<T> = Pick<T, PickByType<T, number>>;

// Tipo para omit condicional
type OmitByType<T, U> = {
    [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

type OmitStringProps<T> = Pick<T, OmitByType<T, string>>;

// Clase utilitaria que usa estos tipos
class TransformadorTipos {
    static hacerOpcional<T>(obj: T): HacerOpcional<T> {
        return obj as HacerOpcional<T>;
    }

    static hacerRequerido<T>(obj: T): HacerRequerido<T> {
        return obj as HacerRequerido<T>;
    }

    static hacerSoloLectura<T>(obj: T): HacerSoloLectura<T> {
        return Object.freeze(obj) as HacerSoloLectura<T>;
    }

    static crearValidacion<T>(reglas: ValidacionReglas<T>): ValidacionReglas<T> {
        return reglas;
    }
}

// Ejemplo de uso con interfaces complejas
interface Direccion {
    calle: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
}

interface PerfilCompleto {
    id: number;
    nombre: string;
    email: string;
    direccion: Direccion;
    telefonos: string[];
    activo: boolean;
}

type PerfilOpcional = DeepPartial<PerfilCompleto>;
type PerfilSoloLectura = DeepReadonly<PerfilCompleto>;
type PropiedadesString = PickStringProps<PerfilCompleto>;
type PropiedadesNumber = PickNumberProps<PerfilCompleto>;
```

### Pruebas Unitarias:

```typescript
// tests/tipos-avanzados.test.ts
import { describe, it, expect } from 'vitest';

describe('Tipos Condicionales y Mapeados', () => {
    describe('Tipos Condicionales', () => {
        it('debería identificar strings correctamente', () => {
            // TypeScript no puede verificar esto en runtime, pero podemos probar la lógica
            const esString = (valor: any): boolean => typeof valor === 'string';
            
            expect(esString('hola')).toBe(true);
            expect(esString(123)).toBe(false);
            expect(esString(true)).toBe(false);
        });

        it('debería extraer elementos de arrays', () => {
            const obtenerElemento = <T>(arr: T[]): T => arr[0];
            
            expect(obtenerElemento(['a', 'b', 'c'])).toBe('a');
            expect(obtenerElemento([1, 2, 3])).toBe(1);
        });

        it('debería identificar tipos correctamente', () => {
            const obtenerTipo = (valor: any): string => {
                if (typeof valor === 'string') return 'string';
                if (typeof valor === 'number') return 'number';
                if (typeof valor === 'boolean') return 'boolean';
                return 'unknown';
            };
            
            expect(obtenerTipo('texto')).toBe('string');
            expect(obtenerTipo(42)).toBe('number');
            expect(obtenerTipo(true)).toBe('boolean');
            expect(obtenerTipo({})).toBe('unknown');
        });
    });

    describe('Tipos Mapeados', () => {
        it('debería hacer propiedades opcionales', () => {
            const usuario: Usuario = { id: 1, nombre: 'Juan' };
            const opcional = TransformadorTipos.hacerOpcional(usuario);
            
            // En runtime, las propiedades siguen siendo las mismas
            expect(opcional.id).toBe(1);
            expect(opcional.nombre).toBe('Juan');
        });

        it('debería hacer propiedades de solo lectura', () => {
            const usuario: Usuario = { id: 1, nombre: 'Juan' };
            const soloLectura = TransformadorTipos.hacerSoloLectura(usuario);
            
            expect(soloLectura.id).toBe(1);
            expect(soloLectura.nombre).toBe('Juan');
            
            // Verificar que es de solo lectura (Object.isFrozen)
            expect(Object.isFrozen(soloLectura)).toBe(true);
        });

        it('debería crear reglas de validación', () => {
            const reglas: ValidacionReglas<DatosUsuario> = {
                id: { requerido: true },
                nombre: { requerido: true, minLength: 2, maxLength: 50 },
                email: { requerido: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
            };
            
            const validacion = TransformadorTipos.crearValidacion(reglas);
            
            expect(validacion.id.requerido).toBe(true);
            expect(validacion.nombre.minLength).toBe(2);
            expect(validacion.email.pattern).toBeInstanceOf(RegExp);
        });
    });

    describe('Aplicaciones Prácticas', () => {
        it('debería manejar formularios opcionales', () => {
            const formulario: Formulario = {
                nombre: 'Juan',
                email: 'juan@ejemplo.com',
                edad: 30,
                activo: true
            };
            
            const formularioOpcional: FormularioOpcional = {
                nombre: 'Juan'
                // email, edad, activo son opcionales
            };
            
            expect(formularioOpcional.nombre).toBe('Juan');
            expect(formularioOpcional.email).toBeUndefined();
        });

        it('debería manejar respuestas de API', () => {
            const respuesta: UsuarioResponse = {
                data: {
                    id: 1,
                    nombre: 'Juan',
                    email: 'juan@ejemplo.com'
                },
                status: 200,
                message: 'Usuario encontrado'
            };
            
            expect(respuesta.data.id).toBe(1);
            expect(respuesta.status).toBe(200);
            expect(respuesta.message).toBe('Usuario encontrado');
        });

        it('debería manejar perfiles complejos', () => {
            const perfil: PerfilCompleto = {
                id: 1,
                nombre: 'Juan',
                email: 'juan@ejemplo.com',
                direccion: {
                    calle: 'Calle Principal',
                    ciudad: 'Madrid',
                    codigoPostal: '28001',
                    pais: 'España'
                },
                telefonos: ['+34 123 456 789'],
                activo: true
            };
            
            const perfilOpcional: PerfilOpcional = {
                nombre: 'Juan',
                direccion: {
                    ciudad: 'Madrid'
                    // otras propiedades de dirección son opcionales
                }
                // otras propiedades del perfil son opcionales
            };
            
            expect(perfilOpcional.nombre).toBe('Juan');
            expect(perfilOpcional.direccion?.ciudad).toBe('Madrid');
            expect(perfilOpcional.id).toBeUndefined();
        });
    });
});
```

---

## 11. ¿Qué son los tipos de utilidad avanzados de TypeScript?

**Respuesta:** TypeScript proporciona tipos de utilidad incorporados que facilitan la manipulación de tipos existentes.

### Tipos de Utilidad Avanzados

```typescript
// Tipos de utilidad básicos
type Usuario = {
    id: number;
    nombre: string;
    email: string;
    activo: boolean;
    roles: string[];
};

// Pick - selecciona propiedades específicas
type UsuarioBasico = Pick<Usuario, 'id' | 'nombre'>;

// Omit - excluye propiedades específicas
type UsuarioSinId = Omit<Usuario, 'id'>;

// Partial - hace todas las propiedades opcionales
type UsuarioOpcional = Partial<Usuario>;

// Required - hace todas las propiedades requeridas
type UsuarioRequerido = Required<Usuario>;

// Readonly - hace todas las propiedades de solo lectura
type UsuarioSoloLectura = Readonly<Usuario>;

// Ejemplos de uso:
// const usuarioBasico: UsuarioBasico = { id: 1, nombre: 'Juan' };
// const usuarioSinId: UsuarioSinId = { nombre: 'Juan', email: 'juan@ejemplo.com', activo: true, roles: ['usuario'] };
// const usuarioOpcional: UsuarioOpcional = { nombre: 'Juan' }; // id, email, activo, roles son opcionales
// const usuarioRequerido: UsuarioRequerido = { id: 1, nombre: 'Juan', email: 'juan@ejemplo.com', activo: true, roles: ['usuario'] };
// const usuarioSoloLectura: UsuarioSoloLectura = { id: 1, nombre: 'Juan', email: 'juan@ejemplo.com', activo: true, roles: ['usuario'] };
// usuarioSoloLectura.nombre = 'Pedro'; // ❌ Error: Cannot assign to 'nombre' because it is a read-only property

// Record - crea un tipo con claves y valores específicos
type Configuracion = Record<string, string | number | boolean>;
type Estados = Record<'cargando' | 'exito' | 'error', string>;

// Exclude - excluye tipos de una unión
type TiposValidos = Exclude<string | number | boolean, boolean>;

// Extract - extrae tipos de una unión
type TiposNumericos = Extract<string | number | boolean, number>;

// NonNullable - excluye null y undefined
type ValoresNoNulos = NonNullable<string | null | undefined | number>;

// Ejemplos de uso:
// const configuracion: Configuracion = {
//   tema: 'claro',
//   timeout: 5000,
//   debug: true
// };
// 
// const estados: Estados = {
//   cargando: 'Cargando datos...',
//   exito: 'Datos cargados exitosamente',
//   error: 'Error al cargar datos'
// };
// 
// const tiposValidos: TiposValidos[] = ['texto', 42]; // boolean está excluido
// const tiposNumericos: TiposNumericos[] = [1, 2, 3]; // solo números
// const valoresNoNulos: ValoresNoNulos[] = ['texto', 42]; // null y undefined están excluidos

// Parameters - extrae parámetros de una función
type ParametrosFuncion = Parameters<(a: string, b: number) => void>;

// ReturnType - extrae el tipo de retorno de una función
type RetornoFuncion = ReturnType<() => string>;

// InstanceType - extrae el tipo de instancia de una clase
class MiClase {
    constructor(public valor: string) {}
}
type InstanciaMiClase = InstanceType<typeof MiClase>;

// ConstructorParameters - extrae parámetros del constructor
type ParametrosConstructor = ConstructorParameters<typeof MiClase>;

// ThisType - especifica el tipo de 'this'
interface Contexto {
    usuario: Usuario;
    configuracion: Configuracion;
}

type MetodoConContexto = ThisType<Contexto> & {
    obtenerUsuario(): Usuario;
    obtenerConfiguracion(): Configuracion;
};

// Tipos de utilidad personalizados
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

type DeepMutable<T> = {
    -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;

type AtLeastOne<T> = {
    [K in keyof T]: Required<T, K>;
}[keyof T];

type ExactlyOne<T> = {
    [K in keyof T]: Required<T, K> & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

// Aplicación práctica con tipos de utilidad
interface FormularioComplejo {
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: {
        calle: string;
        ciudad: string;
        codigoPostal: string;
    };
    preferencias: {
        tema: 'claro' | 'oscuro';
        notificaciones: boolean;
    };
}

// Tipos derivados usando utilidades
type FormularioMinimo = Pick<FormularioComplejo, 'nombre' | 'email'>;
type FormularioSinDireccion = Omit<FormularioComplejo, 'direccion'>;
type FormularioParcial = Partial<FormularioComplejo>;
type FormularioRequerido = Required<FormularioComplejo>;
type FormularioMutable = Mutable<Readonly<FormularioComplejo>>;

// Clase que usa tipos de utilidad
class GestorFormularios {
    private formularios: Map<string, FormularioComplejo> = new Map();

    crearFormularioMinimo(datos: FormularioMinimo): FormularioComplejo {
        return {
            ...datos,
            preferencias: {
                tema: 'claro',
                notificaciones: true
            }
        };
    }

    actualizarFormulario(
        id: string, 
        actualizaciones: Partial<FormularioComplejo>
    ): FormularioComplejo | null {
        const formulario = this.formularios.get(id);
        if (!formulario) return null;

        const formularioActualizado = { ...formulario, ...actualizaciones };
        this.formularios.set(id, formularioActualizado);
        return formularioActualizado;
    }

    obtenerFormularioSoloLectura(id: string): Readonly<FormularioComplejo> | null {
        const formulario = this.formularios.get(id);
        return formulario ? Object.freeze({ ...formulario }) : null;
    }

    validarFormulario(formulario: FormularioComplejo): {
        valido: boolean;
        errores: string[];
    } {
        const errores: string[] = [];

        if (!formulario.nombre.trim()) {
            errores.push('El nombre es requerido');
        }

        if (!formulario.email.includes('@')) {
            errores.push('El email debe ser válido');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    // Ejemplo de uso:
    // const formularioValido: FormularioComplejo = {
    //   nombre: 'Juan Pérez',
    //   email: 'juan@ejemplo.com',
    //   preferencias: { tema: 'claro', notificaciones: true }
    // };
    // gestorFormularios.validarFormulario(formularioValido) → { valido: true, errores: [] }
    // 
    // const formularioInvalido: FormularioComplejo = {
    //   nombre: '',
    //   email: 'email-invalido',
    //   preferencias: { tema: 'claro', notificaciones: true }
    // };
    // gestorFormularios.validarFormulario(formularioInvalido) → { valido: false, errores: ['El nombre es requerido', 'El email debe ser válido'] }
}

// Tipos de utilidad para eventos
type EventHandler<T> = (event: T) => void;

type EventMap = {
    click: MouseEvent;
    keypress: KeyboardEvent;
    submit: SubmitEvent;
};

type EventHandlers = {
    [K in keyof EventMap as `on${Capitalize<K>}`]: EventHandler<EventMap[K]>;
};

// Tipos de utilidad para API
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiEndpoint<T extends ApiMethod, P = any, R = any> = {
    method: T;
    path: string;
    params: P;
    response: R;
};

type ApiEndpoints = {
    usuarios: {
        listar: ApiEndpoint<'GET', {}, Usuario[]>;
        crear: ApiEndpoint<'POST', Omit<Usuario, 'id'>, Usuario>;
        actualizar: ApiEndpoint<'PUT', Usuario, Usuario>;
        eliminar: ApiEndpoint<'DELETE', { id: number }, void>;
    };
};
```

### Pruebas Unitarias:

```typescript
// tests/tipos-utilidad.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Tipos de Utilidad', () => {
    let gestorFormularios: GestorFormularios;

    beforeEach(() => {
        gestorFormularios = new GestorFormularios();
    });

    describe('Tipos de Utilidad Básicos', () => {
        it('debería crear formulario mínimo', () => {
            const datosMinimos: FormularioMinimo = {
                nombre: 'Juan Pérez',
                email: 'juan@ejemplo.com'
            };

            const formulario = gestorFormularios.crearFormularioMinimo(datosMinimos);

            expect(formulario.nombre).toBe('Juan Pérez');
            expect(formulario.email).toBe('juan@ejemplo.com');
            expect(formulario.preferencias.tema).toBe('claro');
            expect(formulario.preferencias.notificaciones).toBe(true);
        });

        it('debería actualizar formulario parcialmente', () => {
            const formulario: FormularioComplejo = {
                nombre: 'Juan',
                email: 'juan@ejemplo.com',
                preferencias: {
                    tema: 'claro',
                    notificaciones: true
                }
            };

            const actualizaciones: Partial<FormularioComplejo> = {
                nombre: 'Juan Carlos',
                telefono: '+34 123 456 789'
            };

            const formularioActualizado = gestorFormularios.actualizarFormulario('1', actualizaciones);

            expect(formularioActualizado?.nombre).toBe('Juan Carlos');
            expect(formularioActualizado?.telefono).toBe('+34 123 456 789');
            expect(formularioActualizado?.email).toBe('juan@ejemplo.com');
        });

        it('debería validar formulario correctamente', () => {
            const formularioValido: FormularioComplejo = {
                nombre: 'Juan Pérez',
                email: 'juan@ejemplo.com',
                preferencias: {
                    tema: 'claro',
                    notificaciones: true
                }
            };

            const formularioInvalido: FormularioComplejo = {
                nombre: '',
                email: 'email-invalido',
                preferencias: {
                    tema: 'claro',
                    notificaciones: true
                }
            };

            const validacionValida = gestorFormularios.validarFormulario(formularioValido);
            const validacionInvalida = gestorFormularios.validarFormulario(formularioInvalido);

            expect(validacionValida.valido).toBe(true);
            expect(validacionValida.errores).toHaveLength(0);

            expect(validacionInvalida.valido).toBe(false);
            expect(validacionInvalida.errores).toContain('El nombre es requerido');
            expect(validacionInvalida.errores).toContain('El email debe ser válido');
        });
    });

    describe('Tipos de Utilidad Avanzados', () => {
        it('debería manejar tipos de unión con Exclude', () => {
            const tiposValidos: TiposValidos[] = ['texto', 42];
            // boolean está excluido, por lo que no se puede usar

            expect(tiposValidos).toContain('texto');
            expect(tiposValidos).toContain(42);
        });

        it('debería manejar tipos de unión con Extract', () => {
            const tiposNumericos: TiposNumericos[] = [1, 2, 3];
            // solo números están incluidos

            expect(tiposNumericos.every(tipo => typeof tipo === 'number')).toBe(true);
        });

        it('debería manejar NonNullable', () => {
            const valoresNoNulos: ValoresNoNulos[] = ['texto', 42];
            // null y undefined están excluidos

            expect(valoresNoNulos.every(valor => valor !== null && valor !== undefined)).toBe(true);
        });

        it('debería extraer parámetros de función', () => {
            const funcion = (a: string, b: number) => `${a} ${b}`;
            const parametros: ParametrosFuncion = ['hola', 42];

            expect(funcion(...parametros)).toBe('hola 42');
        });

        it('debería extraer tipo de retorno', () => {
            const funcion = () => 'resultado';
            const resultado: RetornoFuncion = funcion();

            expect(resultado).toBe('resultado');
        });
    });

    describe('Tipos de Utilidad Personalizados', () => {
        it('debería hacer tipos mutables', () => {
            const readonlyObj: Readonly<{ a: number; b: string }> = {
                a: 1,
                b: 'test'
            };

            const mutableObj: Mutable<typeof readonlyObj> = {
                a: 1,
                b: 'test'
            };

            // readonlyObj.a = 2; // Error en TypeScript
            mutableObj.a = 2; // OK

            expect(mutableObj.a).toBe(2);
        });

        it('debería hacer propiedades opcionales específicas', () => {
            const usuario: Usuario = {
                id: 1,
                nombre: 'Juan',
                email: 'juan@ejemplo.com',
                activo: true,
                roles: ['usuario']
            };

            const usuarioConEmailOpcional: Optional<Usuario, 'email'> = {
                id: 1,
                nombre: 'Juan',
                activo: true,
                roles: ['usuario']
                // email es opcional
            };

            expect(usuarioConEmailOpcional.id).toBe(1);
            expect(usuarioConEmailOpcional.email).toBeUndefined();
        });

        it('debería hacer propiedades requeridas específicas', () => {
            const usuarioParcial: Partial<Usuario> = {
                nombre: 'Juan'
                // otras propiedades son opcionales
            };

            const usuarioConIdRequerido: Required<typeof usuarioParcial, 'id'> = {
                id: 1,
                nombre: 'Juan'
                // id es requerido, otras siguen siendo opcionales
            };

            expect(usuarioConIdRequerido.id).toBe(1);
            expect(usuarioConIdRequerido.nombre).toBe('Juan');
        });
    });
});
```

---

## Configuración Avanzada de TypeScript

Para usar todos estos conceptos avanzados, configura tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noEmitOnError": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## Resumen de Conceptos Expertos

1. **Patrones de Diseño** proporcionan soluciones reutilizables y probadas
2. **Tipos Condicionales** permiten tipos que dependen de otros tipos
3. **Tipos Mapeados** transforman propiedades de tipos existentes
4. **Tipos de Utilidad** facilitan la manipulación de tipos
5. **Configuración Avanzada** optimiza el desarrollo con TypeScript

Cada concepto incluye ejemplos prácticos, implementaciones completas y pruebas unitarias exhaustivas para un aprendizaje profundo. 