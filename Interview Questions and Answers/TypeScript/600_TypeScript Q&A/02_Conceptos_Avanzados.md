# Guía de Entrevistas TypeScript - Conceptos Avanzados
## Preguntas y Respuestas con Ejemplos de Código y Pruebas Unitarias

---

## 6. ¿Qué son las promesas y async/await en TypeScript?

**Respuesta:** Las promesas representan operaciones asíncronas, mientras que async/await proporciona una sintaxis más limpia para trabajar con ellas.

### Ejemplo de Código:

```typescript
// Definición de tipos para operaciones asíncronas
interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

interface Post {
    id: number;
    titulo: string;
    contenido: string;
    autorId: number;
}

// Clase para manejar operaciones asíncronas
class ServicioUsuario {
    private usuarios: Usuario[] = [
        { id: 1, nombre: 'Ana', email: 'ana@ejemplo.com' },
        { id: 2, nombre: 'Carlos', email: 'carlos@ejemplo.com' }
    ];

    // Método que retorna una promesa
    async obtenerUsuario(id: number): Promise<Usuario | null> {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const usuario = this.usuarios.find(u => u.id === id);
        return usuario || null;
    }

    // Método que maneja múltiples promesas
    async obtenerUsuarios(ids: number[]): Promise<Usuario[]> {
        const promesas = ids.map(id => this.obtenerUsuario(id));
        const resultados = await Promise.all(promesas);
        
        // Filtrar usuarios nulos
        return resultados.filter((usuario): usuario is Usuario => usuario !== null);
    }

    // Ejemplo de uso:
    // const usuarios = await servicio.obtenerUsuarios([1, 2]);
    // Resultado esperado:
    // [
    //   { id: 1, nombre: 'Ana', email: 'ana@ejemplo.com' },
    //   { id: 2, nombre: 'Carlos', email: 'carlos@ejemplo.com' }
    // ]

    // Método con manejo de errores
    async crearUsuario(datos: Omit<Usuario, 'id'>): Promise<Usuario> {
        try {
            // Simular validación
            if (!datos.email.includes('@')) {
                throw new Error('Email inválido');
            }

            await new Promise(resolve => setTimeout(resolve, 200));
            
            const nuevoUsuario: Usuario = {
                id: Math.max(...this.usuarios.map(u => u.id)) + 1,
                ...datos
            };
            
            this.usuarios.push(nuevoUsuario);
            return nuevoUsuario;
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
}

// Clase para manejar posts con relaciones
class ServicioPost {
    private posts: Post[] = [
        { id: 1, titulo: 'Mi primer post', contenido: 'Contenido...', autorId: 1 },
        { id: 2, titulo: 'Segundo post', contenido: 'Más contenido...', autorId: 2 }
    ];

    async obtenerPostsConAutor(): Promise<(Post & { autor: Usuario })[]> {
        const servicioUsuario = new ServicioUsuario();
        
        const postsConAutor = await Promise.all(
            this.posts.map(async (post) => {
                const autor = await servicioUsuario.obtenerUsuario(post.autorId);
                if (!autor) {
                    throw new Error(`Autor no encontrado para el post ${post.id}`);
                }
                return { ...post, autor };
            })
        );
        
        return postsConAutor;
    }

    // Ejemplo de uso:
    // const postsConAutor = await servicioPost.obtenerPostsConAutor();
    // Resultado esperado:
    // [
    //   {
    //     id: 1,
    //     titulo: 'Mi primer post',
    //     contenido: 'Contenido...',
    //     autorId: 1,
    //     autor: { id: 1, nombre: 'Ana', email: 'ana@ejemplo.com' }
    //   },
    //   {
    //     id: 2,
    //     titulo: 'Segundo post',
    //     contenido: 'Más contenido...',
    //     autorId: 2,
    //     autor: { id: 2, nombre: 'Carlos', email: 'carlos@ejemplo.com' }
    //   }
    // ]
}

// Función utilitaria para retry
async function retry<T>(
    fn: () => Promise<T>,
    maxIntentos: number = 3,
    delay: number = 1000
): Promise<T> {
    let ultimoError: Error;
    
    for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
            return await fn();
        } catch (error) {
            ultimoError = error instanceof Error ? error : new Error('Error desconocido');
            
            if (intento === maxIntentos) {
                throw ultimoError;
            }
            
            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, delay * intento));
        }
    }
    
    throw ultimoError!;
}

// Ejemplo de uso:
// const funcionFallible = async () => {
//   const random = Math.random();
//   if (random < 0.7) throw new Error('Error temporal');
//   return 'éxito';
// };
// 
// const resultado = await retry(funcionFallible, 3, 100);
// Resultado esperado: 'éxito' (después de 1-3 intentos)
// O lanza el último error si todos los intentos fallan
```

### Pruebas Unitarias:

```typescript
// tests/async-await.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Operaciones Asíncronas', () => {
    let servicioUsuario: ServicioUsuario;
    let servicioPost: ServicioPost;

    beforeEach(() => {
        servicioUsuario = new ServicioUsuario();
        servicioPost = new ServicioPost();
    });

    it('debería obtener un usuario por ID', async () => {
        const usuario = await servicioUsuario.obtenerUsuario(1);
        
        expect(usuario).toEqual({
            id: 1,
            nombre: 'Ana',
            email: 'ana@ejemplo.com'
        });
    });

    it('debería retornar null para usuario inexistente', async () => {
        const usuario = await servicioUsuario.obtenerUsuario(999);
        expect(usuario).toBeNull();
    });

    it('debería obtener múltiples usuarios', async () => {
        const usuarios = await servicioUsuario.obtenerUsuarios([1, 2]);
        
        expect(usuarios).toHaveLength(2);
        expect(usuarios[0].nombre).toBe('Ana');
        expect(usuarios[1].nombre).toBe('Carlos');
    });

    it('debería crear un nuevo usuario', async () => {
        const nuevoUsuario = await servicioUsuario.crearUsuario({
            nombre: 'Nuevo Usuario',
            email: 'nuevo@ejemplo.com'
        });
        
        expect(nuevoUsuario.id).toBe(3);
        expect(nuevoUsuario.nombre).toBe('Nuevo Usuario');
        expect(nuevoUsuario.email).toBe('nuevo@ejemplo.com');
    });

    it('debería lanzar error para email inválido', async () => {
        await expect(
            servicioUsuario.crearUsuario({
                nombre: 'Usuario',
                email: 'email-invalido'
            })
        ).rejects.toThrow('Error al crear usuario: Email inválido');
    });

    it('debería obtener posts con información del autor', async () => {
        const postsConAutor = await servicioPost.obtenerPostsConAutor();
        
        expect(postsConAutor).toHaveLength(2);
        expect(postsConAutor[0].autor.nombre).toBe('Ana');
        expect(postsConAutor[1].autor.nombre).toBe('Carlos');
    });

    it('debería hacer retry en caso de fallo', async () => {
        let intentos = 0;
        const funcionFallible = async () => {
            intentos++;
            if (intentos < 3) {
                throw new Error('Error temporal');
            }
            return 'éxito';
        };
        
        const resultado = await retry(funcionFallible, 3, 100);
        
        expect(resultado).toBe('éxito');
        expect(intentos).toBe(3);
    });
});
```

---

## 7. ¿Qué son los módulos ES6 y cómo se usan en TypeScript?

**Respuesta:** Los módulos ES6 permiten organizar código en archivos separados con import/export, facilitando la reutilización y mantenimiento del código.

### Ejemplo de Código:

```typescript
// types/index.ts - Definición de tipos compartidos
export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    stock: number;
}

export interface CarritoItem {
    producto: Producto;
    cantidad: number;
}

export type EstadoCarrito = 'vacio' | 'con-items' | 'procesando' | 'completado';

// utils/calculadora.ts - Utilidades matemáticas
export function calcularTotal(items: CarritoItem[]): number {
    return items.reduce((total, item) => {
        return total + (item.producto.precio * item.cantidad);
    }, 0);
}

export function aplicarDescuento(total: number, porcentaje: number): number {
    if (porcentaje < 0 || porcentaje > 100) {
        throw new Error('Porcentaje de descuento debe estar entre 0 y 100');
    }
    return total * (1 - porcentaje / 100);
}

export function formatearPrecio(precio: number, moneda: string = 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: moneda
    }).format(precio);
}

// Ejemplos de uso:
// const items = [
//   { producto: { precio: 10 }, cantidad: 2 },
//   { producto: { precio: 5 }, cantidad: 3 }
// ];
// calcularTotal(items) → 35 (10*2 + 5*3)
// aplicarDescuento(100, 20) → 80 (100 * 0.8)
// formatearPrecio(1234.56, 'USD') → "$1.234,56"

// services/productoService.ts - Servicio para productos
import { Producto } from '../types';

export class ProductoService {
    private productos: Producto[] = [
        { id: 1, nombre: 'Laptop', precio: 999.99, categoria: 'Electrónicos', stock: 10 },
        { id: 2, nombre: 'Mouse', precio: 29.99, categoria: 'Electrónicos', stock: 50 },
        { id: 3, nombre: 'Libro', precio: 19.99, categoria: 'Libros', stock: 100 }
    ];

    async obtenerProductos(): Promise<Producto[]> {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...this.productos];
    }

    async obtenerProductoPorId(id: number): Promise<Producto | null> {
        await new Promise(resolve => setTimeout(resolve, 50));
        return this.productos.find(p => p.id === id) || null;
    }

    async buscarProductos(termino: string): Promise<Producto[]> {
        await new Promise(resolve => setTimeout(resolve, 150));
        const terminoLower = termino.toLowerCase();
        return this.productos.filter(p => 
            p.nombre.toLowerCase().includes(terminoLower) ||
            p.categoria.toLowerCase().includes(terminoLower)
        );
    }
}

// models/carrito.ts - Modelo del carrito de compras
import { CarritoItem, EstadoCarrito, Producto } from '../types';
import { calcularTotal, aplicarDescuento, formatearPrecio } from '../utils/calculadora';

export class Carrito {
    private items: CarritoItem[] = [];
    private estado: EstadoCarrito = 'vacio';

    agregarProducto(producto: Producto, cantidad: number = 1): void {
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        const itemExistente = this.items.find(item => item.producto.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({ producto, cantidad });
        }

        this.estado = 'con-items';
    }

    removerProducto(productoId: number): void {
        this.items = this.items.filter(item => item.producto.id !== productoId);
        
        if (this.items.length === 0) {
            this.estado = 'vacio';
        }
    }

    actualizarCantidad(productoId: number, nuevaCantidad: number): void {
        if (nuevaCantidad <= 0) {
            this.removerProducto(productoId);
            return;
        }

        const item = this.items.find(item => item.producto.id === productoId);
        if (item) {
            item.cantidad = nuevaCantidad;
        }
    }

    obtenerItems(): CarritoItem[] {
        return [...this.items];
    }

    obtenerTotal(): number {
        return calcularTotal(this.items);
    }

    obtenerTotalConDescuento(porcentajeDescuento: number): number {
        const total = this.obtenerTotal();
        return aplicarDescuento(total, porcentajeDescuento);
    }

    obtenerResumen(): string {
        const total = this.obtenerTotal();
        const totalFormateado = formatearPrecio(total);
        const cantidadItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
        
        return `Carrito: ${cantidadItems} items - Total: ${totalFormateado}`;
    }

    // Ejemplo de uso:
    // carrito.agregarProducto({ id: 1, nombre: 'Laptop', precio: 999.99, categoria: 'Electrónicos', stock: 1 }, 2);
    // carrito.agregarProducto({ id: 2, nombre: 'Mouse', precio: 29.99, categoria: 'Electrónicos', stock: 1 }, 1);
    // carrito.obtenerResumen() → "Carrito: 3 items - Total: $2.029,97"

    limpiar(): void {
        this.items = [];
        this.estado = 'vacio';
    }

    getEstado(): EstadoCarrito {
        return this.estado;
    }
}

// index.ts - Archivo principal que usa todos los módulos
import { ProductoService } from './services/productoService';
import { Carrito } from './models/carrito';
import { formatearPrecio } from './utils/calculadora';

export async function ejemploUsoModulos() {
    const productoService = new ProductoService();
    const carrito = new Carrito();

    try {
        // Obtener productos
        const productos = await productoService.obtenerProductos();
        console.log('Productos disponibles:', productos.length);

        // Agregar productos al carrito
        if (productos.length > 0) {
            carrito.agregarProducto(productos[0], 2); // 2 laptops
            carrito.agregarProducto(productos[1], 1); // 1 mouse
        }

        // Mostrar resumen
        console.log(carrito.obtenerResumen());
        
        // Aplicar descuento
        const totalConDescuento = carrito.obtenerTotalConDescuento(10);
        console.log(`Total con 10% descuento: ${formatearPrecio(totalConDescuento)}`);

    } catch (error) {
        console.error('Error:', error);
    }
}
```

### Pruebas Unitarias:

```typescript
// tests/modulos.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ProductoService } from '../services/productoService';
import { Carrito } from '../models/carrito';
import { calcularTotal, aplicarDescuento, formatearPrecio } from '../utils/calculadora';
import { Producto, CarritoItem } from '../types';

describe('Módulos ES6', () => {
    let productoService: ProductoService;
    let carrito: Carrito;

    beforeEach(() => {
        productoService = new ProductoService();
        carrito = new Carrito();
    });

    describe('Utilidades', () => {
        it('debería calcular el total correctamente', () => {
            const items: CarritoItem[] = [
                { producto: { id: 1, nombre: 'Item1', precio: 10, categoria: 'Test', stock: 1 }, cantidad: 2 },
                { producto: { id: 2, nombre: 'Item2', precio: 5, categoria: 'Test', stock: 1 }, cantidad: 3 }
            ];
            
            const total = calcularTotal(items);
            expect(total).toBe(35); // (10 * 2) + (5 * 3)
        });

        it('debería aplicar descuento correctamente', () => {
            const total = aplicarDescuento(100, 20);
            expect(total).toBe(80);
        });

        it('debería lanzar error para descuento inválido', () => {
            expect(() => aplicarDescuento(100, 150)).toThrow();
            expect(() => aplicarDescuento(100, -10)).toThrow();
        });

        it('debería formatear precio correctamente', () => {
            const precioFormateado = formatearPrecio(1234.56, 'USD');
            expect(precioFormateado).toMatch(/\$1\.234,56/);
        });
    });

    describe('Servicio de Productos', () => {
        it('debería obtener todos los productos', async () => {
            const productos = await productoService.obtenerProductos();
            expect(productos).toHaveLength(3);
            expect(productos[0].nombre).toBe('Laptop');
        });

        it('debería obtener producto por ID', async () => {
            const producto = await productoService.obtenerProductoPorId(1);
            expect(producto?.nombre).toBe('Laptop');
        });

        it('debería buscar productos por término', async () => {
            const productos = await productoService.buscarProductos('laptop');
            expect(productos).toHaveLength(1);
            expect(productos[0].nombre).toBe('Laptop');
        });
    });

    describe('Carrito de Compras', () => {
        it('debería agregar productos al carrito', () => {
            const producto: Producto = {
                id: 1,
                nombre: 'Test Product',
                precio: 10,
                categoria: 'Test',
                stock: 1
            };

            carrito.agregarProducto(producto, 2);
            const items = carrito.obtenerItems();
            
            expect(items).toHaveLength(1);
            expect(items[0].cantidad).toBe(2);
            expect(carrito.getEstado()).toBe('con-items');
        });

        it('debería actualizar cantidad de producto existente', () => {
            const producto: Producto = {
                id: 1,
                nombre: 'Test Product',
                precio: 10,
                categoria: 'Test',
                stock: 1
            };

            carrito.agregarProducto(producto, 1);
            carrito.agregarProducto(producto, 2);
            
            const items = carrito.obtenerItems();
            expect(items[0].cantidad).toBe(3);
        });

        it('debería calcular total correctamente', () => {
            const producto: Producto = {
                id: 1,
                nombre: 'Test Product',
                precio: 10,
                categoria: 'Test',
                stock: 1
            };

            carrito.agregarProducto(producto, 3);
            expect(carrito.obtenerTotal()).toBe(30);
        });

        it('debería aplicar descuento al total', () => {
            const producto: Producto = {
                id: 1,
                nombre: 'Test Product',
                precio: 100,
                categoria: 'Test',
                stock: 1
            };

            carrito.agregarProducto(producto, 1);
            const totalConDescuento = carrito.obtenerTotalConDescuento(20);
            expect(totalConDescuento).toBe(80);
        });

        it('debería limpiar el carrito', () => {
            const producto: Producto = {
                id: 1,
                nombre: 'Test Product',
                precio: 10,
                categoria: 'Test',
                stock: 1
            };

            carrito.agregarProducto(producto, 1);
            expect(carrito.getEstado()).toBe('con-items');
            
            carrito.limpiar();
            expect(carrito.getEstado()).toBe('vacio');
            expect(carrito.obtenerItems()).toHaveLength(0);
        });
    });
});
```

---

## 8. ¿Qué son los tipos de unión e intersección?

**Respuesta:** Los tipos de unión permiten que una variable tenga uno de varios tipos, mientras que los tipos de intersección combinan múltiples tipos en uno solo.

### Ejemplo de Código:

```typescript
// Tipos de unión básicos
type ID = string | number;
type Estado = 'activo' | 'inactivo' | 'pendiente';
type TipoUsuario = 'admin' | 'usuario' | 'moderador';

// Tipos de intersección
interface Persona {
    nombre: string;
    edad: number;
}

interface Empleado {
    id: number;
    departamento: string;
    salario: number;
}

interface Cliente {
    numeroCliente: string;
    historialCompras: string[];
}

// Intersección: EmpleadoCliente tiene propiedades de ambos
type EmpleadoCliente = Empleado & Cliente;

// Unión: puede ser cualquiera de los tres tipos
type Usuario = Persona | Empleado | Cliente;

// Función que maneja tipos de unión
function procesarUsuario(usuario: Usuario): string {
    // Type guard para verificar el tipo
    if ('nombre' in usuario) {
        return `Persona: ${usuario.nombre}, Edad: ${usuario.edad}`;
    } else if ('id' in usuario) {
        return `Empleado: ${usuario.id}, Depto: ${usuario.departamento}`;
    } else {
        return `Cliente: ${usuario.numeroCliente}, Compras: ${usuario.historialCompras.length}`;
    }
}

// Ejemplos de uso:
// const persona: Persona = { nombre: 'Juan', edad: 30 };
// procesarUsuario(persona) → "Persona: Juan, Edad: 30"
// 
// const empleado: Empleado = { id: 1, departamento: 'IT', salario: 50000 };
// procesarUsuario(empleado) → "Empleado: 1, Depto: IT"
// 
// const cliente: Cliente = { numeroCliente: 'CLI001', historialCompras: ['compra1', 'compra2'] };
// procesarUsuario(cliente) → "Cliente: CLI001, Compras: 2"

// Función con tipos de unión más complejos
type ResultadoOperacion<T> = 
    | { exito: true; datos: T }
    | { exito: false; error: string };

async function operacionAsincrona<T>(fn: () => Promise<T>): Promise<ResultadoOperacion<T>> {
    try {
        const datos = await fn();
        return { exito: true, datos };
    } catch (error) {
        return { 
            exito: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        };
    }
}

// Clase que usa tipos de unión e intersección
class GestorUsuarios {
    private usuarios: Map<ID, Usuario> = new Map();

    agregarUsuario(id: ID, usuario: Usuario): void {
        this.usuarios.set(id, usuario);
    }

    obtenerUsuario(id: ID): Usuario | undefined {
        return this.usuarios.get(id);
    }

    // Función que retorna diferentes tipos según el parámetro
    procesarPorTipo<T extends 'persona' | 'empleado' | 'cliente'>(
        tipo: T,
        datos: T extends 'persona' ? Persona : 
              T extends 'empleado' ? Empleado : Cliente
    ): string {
        switch (tipo) {
            case 'persona':
                const persona = datos as Persona;
                return `Procesando persona: ${persona.nombre}`;
            case 'empleado':
                const empleado = datos as Empleado;
                return `Procesando empleado: ${empleado.id}`;
            case 'cliente':
                const cliente = datos as Cliente;
                return `Procesando cliente: ${cliente.numeroCliente}`;
        }
    }

    // Función que crea un empleado-cliente
    crearEmpleadoCliente(
        datosEmpleado: Empleado,
        datosCliente: Cliente
    ): EmpleadoCliente {
        return {
            ...datosEmpleado,
            ...datosCliente
        };
    }
}

// Tipos de unión con discriminadores
type Evento = 
    | { tipo: 'click'; x: number; y: number }
    | { tipo: 'keypress'; tecla: string }
    | { tipo: 'scroll'; posicion: number };

function manejarEvento(evento: Evento): void {
    switch (evento.tipo) {
        case 'click':
            console.log(`Click en (${evento.x}, ${evento.y})`);
            break;
        case 'keypress':
            console.log(`Tecla presionada: ${evento.tecla}`);
            break;
        case 'scroll':
            console.log(`Scroll en posición: ${evento.posicion}`);
            break;
    }
}

// Tipos de unión con genéricos
type Opcional<T> = T | null | undefined;
type NoNulo<T> = T extends null | undefined ? never : T;

function filtrarNoNulos<T>(items: Opcional<T>[]): NoNulo<T>[] {
    return items.filter((item): item is NoNulo<T> => item !== null && item !== undefined);
}
```

### Pruebas Unitarias:

```typescript
// tests/union-intersection.test.ts
import { describe, it, expect } from 'vitest';

describe('Tipos de Unión e Intersección', () => {
    it('debería procesar diferentes tipos de usuario', () => {
        const persona: Persona = { nombre: 'Juan', edad: 30 };
        const empleado: Empleado = { id: 1, departamento: 'IT', salario: 50000 };
        const cliente: Cliente = { numeroCliente: 'CLI001', historialCompras: ['compra1', 'compra2'] };

        expect(procesarUsuario(persona)).toBe('Persona: Juan, Edad: 30');
        expect(procesarUsuario(empleado)).toBe('Empleado: 1, Depto: IT');
        expect(procesarUsuario(cliente)).toBe('Cliente: CLI001, Compras: 2');
    });

    it('debería manejar operaciones asíncronas con resultado tipado', async () => {
        const operacionExitosa = async () => 'datos exitosos';
        const operacionFallida = async () => { throw new Error('Error de prueba'); };

        const resultadoExitoso = await operacionAsincrona(operacionExitosa);
        const resultadoFallido = await operacionAsincrona(operacionFallida);

        expect(resultadoExitoso.exito).toBe(true);
        if (resultadoExitoso.exito) {
            expect(resultadoExitoso.datos).toBe('datos exitosos');
        }

        expect(resultadoFallido.exito).toBe(false);
        if (!resultadoFallido.exito) {
            expect(resultadoFallido.error).toBe('Error de prueba');
        }
    });

    it('debería crear empleado-cliente con intersección', () => {
        const gestor = new GestorUsuarios();
        const empleado: Empleado = { id: 1, departamento: 'Ventas', salario: 40000 };
        const cliente: Cliente = { numeroCliente: 'CLI002', historialCompras: ['compra3'] };

        const empleadoCliente = gestor.crearEmpleadoCliente(empleado, cliente);

        expect(empleadoCliente.id).toBe(1);
        expect(empleadoCliente.departamento).toBe('Ventas');
        expect(empleadoCliente.numeroCliente).toBe('CLI002');
        expect(empleadoCliente.historialCompras).toEqual(['compra3']);
    });

    it('debería manejar eventos con discriminadores', () => {
        const eventos: Evento[] = [
            { tipo: 'click', x: 100, y: 200 },
            { tipo: 'keypress', tecla: 'Enter' },
            { tipo: 'scroll', posicion: 500 }
        ];

        const spy = jest.spyOn(console, 'log');
        
        eventos.forEach(manejarEvento);

        expect(spy).toHaveBeenCalledWith('Click en (100, 200)');
        expect(spy).toHaveBeenCalledWith('Tecla presionada: Enter');
        expect(spy).toHaveBeenCalledWith('Scroll en posición: 500');

        spy.mockRestore();
    });

    it('debería filtrar valores no nulos', () => {
        const items: Opcional<string>[] = ['hola', null, 'mundo', undefined, 'test'];
        const resultado = filtrarNoNulos(items);

        expect(resultado).toEqual(['hola', 'mundo', 'test']);
    });

    it('debería procesar por tipo con tipos específicos', () => {
        const gestor = new GestorUsuarios();
        const persona: Persona = { nombre: 'Ana', edad: 25 };
        const empleado: Empleado = { id: 2, departamento: 'HR', salario: 45000 };

        expect(gestor.procesarPorTipo('persona', persona)).toBe('Procesando persona: Ana');
        expect(gestor.procesarPorTipo('empleado', empleado)).toBe('Procesando empleado: 2');
    });
});
```

---

## Configuración de TypeScript para Módulos

Para usar módulos ES6, necesitas configurar tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Resumen de Conceptos Avanzados

1. **Async/Await** proporciona sintaxis limpia para promesas
2. **Módulos ES6** organizan código en archivos reutilizables
3. **Tipos de Unión** permiten múltiples tipos posibles
4. **Tipos de Intersección** combinan propiedades de múltiples tipos
5. **Type Guards** verifican tipos en tiempo de ejecución

Cada concepto incluye ejemplos prácticos y pruebas unitarias completas para un aprendizaje efectivo. 