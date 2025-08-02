
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
