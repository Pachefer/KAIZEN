# Guía Completa de Entrevistas TypeScript en Español

## 📚 Descripción

Esta guía es una traducción completa al español de las preguntas de entrevista de TypeScript, con ejemplos de código detallados, comentarios línea por línea y pruebas unitarias completas. Está diseñada como una guía de estudio avanzada para desarrolladores que quieren dominar TypeScript.

## 📁 Estructura de Archivos

```
TypeScript/
├── README.md                           # Este archivo
├── 01_Fundamentos_TypeScript.md        # Conceptos básicos y fundamentales
├── 02_Conceptos_Avanzados.md           # Async/await, módulos, uniones e intersecciones
├── 03_Patrones_Diseño_Expertos.md      # Patrones de diseño y tipos avanzados
└── package.json                        # Configuración del proyecto
```

## 🎯 Objetivos de Aprendizaje

### Nivel Básico (01_Fundamentos_TypeScript.md)
- ✅ Entender qué es TypeScript y sus ventajas
- ✅ Diferencias entre `let`, `const` y `var`
- ✅ Tipos genéricos y su uso
- ✅ Interfaces vs Tipos
- ✅ Decoradores y metaprogramación

### Nivel Intermedio (02_Conceptos_Avanzados.md)
- ✅ Promesas y async/await
- ✅ Módulos ES6 y organización de código
- ✅ Tipos de unión e intersección
- ✅ Type guards y discriminadores
- ✅ Manejo de errores asíncronos

### Nivel Avanzado (03_Patrones_Diseño_Expertos.md)
- ✅ Patrones de diseño (Singleton, Factory, Observer)
- ✅ Tipos condicionales y mapeados
- ✅ Tipos de utilidad avanzados
- ✅ Configuración avanzada de TypeScript
- ✅ Mejores prácticas y optimizaciones

## 🚀 Cómo Usar Esta Guía

### 1. Configuración Inicial

```bash
# Clonar o descargar los archivos
cd Interview Questions and Answers/TypeScript

# Instalar dependencias
npm install

# Configurar TypeScript
npm run setup
```

### 2. Estructura de Estudio

#### Día 1-3: Fundamentos
- Leer `01_Fundamentos_TypeScript.md`
- Ejecutar ejemplos de código
- Completar pruebas unitarias
- Practicar con los conceptos básicos

#### Día 4-7: Conceptos Avanzados
- Leer `02_Conceptos_Avanzados.md`
- Implementar los ejemplos de módulos
- Trabajar con async/await
- Entender tipos de unión e intersección

#### Día 8-14: Patrones y Expertos
- Leer `03_Patrones_Diseño_Expertos.md`
- Implementar patrones de diseño
- Dominar tipos condicionales y mapeados
- Configurar TypeScript avanzado

### 3. Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ver cobertura de pruebas
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- --grep "Fundamentos"
```

### 4. Compilar y Verificar

```bash
# Compilar TypeScript
npm run build

# Verificar tipos sin compilar
npm run type-check

# Linting del código
npm run lint
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Tipos Genéricos

```typescript
// Definición de tipo genérico
interface Contenedor<T> {
    valor: T;
    obtener(): T;
    establecer(nuevoValor: T): void;
}

// Implementación
class ContenedorString implements Contenedor<string> {
    constructor(public valor: string) {}
    
    obtener(): string {
        return this.valor;
    }
    
    establecer(nuevoValor: string): void {
        this.valor = nuevoValor;
    }
}

// Uso
const contenedor = new ContenedorString("Hola Mundo");
console.log(contenedor.obtener()); // "Hola Mundo"
```

### Ejemplo 2: Async/Await con Manejo de Errores

```typescript
// Función asíncrona con tipado fuerte
async function obtenerUsuario(id: number): Promise<Usuario | null> {
    try {
        const respuesta = await fetch(`/api/usuarios/${id}`);
        
        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
        }
        
        const usuario: Usuario = await respuesta.json();
        return usuario;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

// Uso con async/await
const usuario = await obtenerUsuario(1);
if (usuario) {
    console.log(`Usuario encontrado: ${usuario.nombre}`);
}
```

### Ejemplo 3: Patrón Observer

```typescript
// Implementación del patrón Observer
class GestorEventos {
    private observers: Map<string, Function[]> = new Map();
    
    suscribir(evento: string, callback: Function): void {
        if (!this.observers.has(evento)) {
            this.observers.set(evento, []);
        }
        this.observers.get(evento)!.push(callback);
    }
    
    publicar(evento: string, datos: any): void {
        const callbacks = this.observers.get(evento);
        if (callbacks) {
            callbacks.forEach(callback => callback(datos));
        }
    }
}

// Uso
const gestor = new GestorEventos();
gestor.suscribir('usuario:creado', (usuario: Usuario) => {
    console.log(`Nuevo usuario creado: ${usuario.nombre}`);
});
```

## 🧪 Pruebas Unitarias

Cada concepto incluye pruebas unitarias completas usando Vitest:

```typescript
// Ejemplo de prueba unitaria
import { describe, it, expect } from 'vitest';

describe('Contenedor Genérico', () => {
    it('debería almacenar y recuperar valores', () => {
        const contenedor = new ContenedorString("test");
        
        expect(contenedor.obtener()).toBe("test");
        
        contenedor.establecer("nuevo valor");
        expect(contenedor.obtener()).toBe("nuevo valor");
    });
});
```

## ⚙️ Configuración de TypeScript

### tsconfig.json Recomendado

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

### package.json

```json
{
  "name": "typescript-interview-guide",
  "version": "1.0.0",
  "description": "Guía completa de entrevistas TypeScript en español",
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/**/*.ts",
    "setup": "npm install && npm run build"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

## 📋 Checklist de Dominio

### ✅ Conceptos Básicos
- [ ] Variables y tipos básicos
- [ ] Interfaces y tipos
- [ ] Genéricos
- [ ] Decoradores
- [ ] Scope y hoisting

### ✅ Conceptos Intermedios
- [ ] Async/await y promesas
- [ ] Módulos ES6
- [ ] Tipos de unión e intersección
- [ ] Type guards
- [ ] Manejo de errores

### ✅ Conceptos Avanzados
- [ ] Patrones de diseño
- [ ] Tipos condicionales
- [ ] Tipos mapeados
- [ ] Tipos de utilidad
- [ ] Configuración avanzada

## 🎯 Preguntas de Entrevista Comunes

### Básicas
1. ¿Qué es TypeScript y cuáles son sus ventajas?
2. ¿Cuál es la diferencia entre `let`, `const` y `var`?
3. ¿Qué son los tipos genéricos?
4. ¿Cuál es la diferencia entre interfaces y tipos?

### Intermedias
5. ¿Cómo funciona async/await en TypeScript?
6. ¿Qué son los módulos ES6?
7. ¿Cómo se usan los tipos de unión e intersección?
8. ¿Qué son los type guards?

### Avanzadas
9. ¿Cómo implementarías el patrón Singleton en TypeScript?
10. ¿Qué son los tipos condicionales y mapeados?
11. ¿Cómo usarías los tipos de utilidad de TypeScript?
12. ¿Cómo configurarías TypeScript para un proyecto grande?

## 🔧 Herramientas Recomendadas

### IDEs y Editores
- **VS Code** con extensiones TypeScript
- **WebStorm** con soporte nativo
- **Neovim** con plugins TypeScript

### Herramientas de Desarrollo
- **TypeScript Compiler (tsc)**
- **Vitest** para pruebas
- **ESLint** para linting
- **Prettier** para formateo

### Herramientas de Análisis
- **TypeScript Language Server**
- **TypeScript Playground** (online)
- **TypeScript AST Viewer**

## 📚 Recursos Adicionales

### Documentación Oficial
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript GitHub](https://github.com/microsoft/TypeScript)

### Libros Recomendados
- "Programming TypeScript" por Boris Cherny
- "Effective TypeScript" por Dan Vanderkam
- "TypeScript in 50 Lessons" por Stefan Baumgartner

### Cursos Online
- TypeScript Fundamentals (Pluralsight)
- Advanced TypeScript (Frontend Masters)
- TypeScript Deep Dive (GitBook)

## 🤝 Contribuciones

Si encuentras errores o quieres mejorar esta guía:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz tus cambios
4. Añade pruebas unitarias
5. Envía un pull request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

1. Revisa la documentación oficial de TypeScript
2. Consulta los ejemplos en esta guía
3. Ejecuta las pruebas unitarias para verificar tu código
4. Únete a comunidades de TypeScript en Discord/Slack

---

**¡Feliz aprendizaje de TypeScript! 🚀**

*Esta guía está diseñada para llevarte desde principiante hasta experto en TypeScript, con ejemplos prácticos y pruebas unitarias que refuerzan cada concepto.* 