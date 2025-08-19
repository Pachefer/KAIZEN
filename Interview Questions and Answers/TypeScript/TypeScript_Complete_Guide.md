# 🔷 Guía Completa de TypeScript - Entrevistas y Dominio

## 🎯 Introducción a TypeScript

**TypeScript** es un superset de JavaScript que agrega tipado estático opcional, clases, interfaces y otras características modernas de programación.

### 🌟 **¿Por qué TypeScript?**

- **Tipado estático** - Detección temprana de errores
- **IntelliSense mejorado** - Mejor experiencia de desarrollo
- **Características modernas** - ES6+ con tipado
- **Compatibilidad total** - Compila a JavaScript puro
- **Ecosistema empresarial** - Angular, React, Node.js

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Cuál es la diferencia entre `type` y `interface` en TypeScript?**

**Respuesta Completa:**

**Type:**
- Alias de tipos más flexible
- Puede representar uniones, intersecciones, primitivos
- No se puede extender después de la declaración
- Más versátil para tipos complejos

**Interface:**
- Contrato de objeto más específico
- Se puede extender y implementar
- Mejor para definir formas de objetos
- Más orientado a la programación orientada a objetos

```typescript
// Ejemplo de Type vs Interface
// =============================

// INTERFACE - Mejor para objetos
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Propiedad opcional
}

interface AdminUser extends User {
  role: 'admin' | 'super-admin';
  permissions: string[];
}

// TYPE - Más versátil
type UserID = number | string;
type UserStatus = 'active' | 'inactive' | 'pending';

type UserType = {
  id: UserID;
  name: string;
  email: string;
  status: UserStatus;
}

// Unión de tipos
type ApiResponse<T> = {
  data: T;
  success: true;
} | {
  error: string;
  success: false;
}

// Función genérica con tipos
function createUser<T extends User>(userData: T): T {
  return {
    ...userData,
    id: Date.now(),
    isActive: true
  };
}

// Implementación de interfaces
class UserService implements User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public isActive: boolean = true
  ) {}
  
  activate(): void {
    this.isActive = true;
  }
  
  deactivate(): void {
    this.isActive = false;
  }
}

// Uso de tipos y interfaces
const user: User = {
  id: 1,
  name: 'Juan Pérez',
  email: 'juan@example.com'
};

const adminUser: AdminUser = {
  ...user,
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};

const userService = new UserService(2, 'María García', 'maria@example.com');

// Función que acepta tanto User como AdminUser
function processUser(user: User | AdminUser): void {
  console.log(`Procesando usuario: ${user.name}`);
  
  // Type guard para verificar si es AdminUser
  if ('role' in user) {
    console.log(`Rol: ${user.role}`);
    console.log(`Permisos: ${user.permissions.join(', ')}`);
  }
}

// Ejemplos de uso
processUser(user);
processUser(adminUser);
```

**Simulador de Type vs Interface:**

```typescript
// type-vs-interface-simulator.ts
class TypeVsInterfaceSimulator {
  private testCount = 0;
  private correctAnswers = 0;
  private examples: Array<{
    name: string;
    type: any;
    interface: any;
    description: string;
    expected: 'type' | 'interface' | 'both';
  }> = [];

  constructor() {
    this.setupExamples();
  }

  // Configurar ejemplos de prueba
  private setupExamples(): void {
    // Ejemplo 1: Objeto simple
    this.examples.push({
      name: 'Objeto Simple',
      type: { id: 1, name: 'Test' },
      interface: { id: 1, name: 'Test' },
      description: 'Objeto con propiedades básicas',
      expected: 'both'
    });

    // Ejemplo 2: Unión de tipos
    this.examples.push({
      name: 'Unión de Tipos',
      type: 'string' | 'number',
      interface: 'string' | 'number', // Esto no es válido en interfaces
      description: 'Representar múltiples tipos posibles',
      expected: 'type'
    });

    // Ejemplo 3: Extensión
    this.examples.push({
      name: 'Extensión',
      type: { base: 'extended' },
      interface: { base: 'extended' },
      description: 'Capacidad de extender/heredar',
      expected: 'interface'
    });

    // Ejemplo 4: Tipos primitivos
    this.examples.push({
      name: 'Tipos Primitivos',
      type: string,
      interface: string, // Esto no es válido en interfaces
      description: 'Alias para tipos primitivos',
      expected: 'type'
    });

    // Ejemplo 5: Objetos complejos
    this.examples.push({
      name: 'Objetos Complejos',
      type: { complex: { nested: true } },
      interface: { complex: { nested: true } },
      description: 'Objetos con estructura anidada',
      expected: 'both'
    });
  }

  // Ejecutar simulación
  public runSimulation(): void {
    console.log('🔷 SIMULADOR DE TYPE VS INTERFACE EN TYPESCRIPT');
    console.log('=' .repeat(60));

    console.log('\n📋 Ejecutando ejemplos de comparación...\n');

    this.examples.forEach((example, index) => {
      this.testCount++;
      console.log(`🧪 EJEMPLO ${index + 1}: ${example.name}`);
      console.log('-'.repeat(50));
      console.log(`📝 Descripción: ${example.description}`);
      
      // Probar con type
      const typeResult = this.testWithType(example.type);
      console.log(`   Type: ${typeResult ? '✅ Válido' : '❌ Inválido'}`);
      
      // Probar con interface
      const interfaceResult = this.testWithInterface(example.interface);
      console.log(`   Interface: ${interfaceResult ? '✅ Válido' : '❌ Inválido'}`);
      
      // Determinar resultado
      let actual: 'type' | 'interface' | 'both';
      if (typeResult && interfaceResult) {
        actual = 'both';
      } else if (typeResult) {
        actual = 'type';
      } else {
        actual = 'interface';
      }
      
      // Verificar si coincide con lo esperado
      if (actual === example.expected) {
        console.log('   🎯 Resultado: CORRECTO');
        this.correctAnswers++;
      } else {
        console.log(`   ❌ Resultado: INCORRECTO (esperado: ${example.expected}, obtenido: ${actual})`);
      }
      
      console.log();
    });

    this.showFinalSummary();
  }

  // Probar con type
  private testWithType(value: any): boolean {
    try {
      // Simular validación de type
      if (typeof value === 'string' || typeof value === 'number') {
        return true; // Tipos primitivos son válidos para type
      }
      
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return true; // Arrays son válidos para type
        }
        
        // Verificar si es un objeto válido
        return value !== null && !(value instanceof Date);
      }
      
      return true;
    } catch {
      return false;
    }
  }

  // Probar con interface
  private testWithInterface(value: any): boolean {
    try {
      // Interfaces solo pueden representar objetos
      if (typeof value === 'string' || typeof value === 'number') {
        return false; // Tipos primitivos no son válidos para interfaces
      }
      
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return false; // Arrays no son válidos para interfaces básicas
        }
        
        // Verificar si es un objeto válido
        return value !== null && !(value instanceof Date);
      }
      
      return false;
    } catch {
      return false;
    }
  }

  // Mostrar resumen final
  private showFinalSummary(): void {
    console.log('🎉 RESUMEN FINAL DE LA SIMULACIÓN');
    console.log('=' .repeat(50));

    console.log('\n📊 Estadísticas:');
    console.log(`   Total de ejemplos: ${this.testCount}`);
    console.log(`   Ejemplos correctos: ${this.correctAnswers}`);
    console.log(`   Tasa de éxito: ${((this.correctAnswers / this.testCount) * 100).toFixed(1)}%`);

    console.log('\n💡 LECCIONES APRENDIDAS:');
    console.log('   ✅ TYPE:');
    console.log('      - Más versátil y flexible');
    console.log('      - Puede representar uniones, intersecciones, primitivos');
    console.log('      - No se puede extender después de la declaración');
    console.log('      - Mejor para tipos complejos y uniones');
    
    console.log('   ✅ INTERFACE:');
    console.log('      - Mejor para definir formas de objetos');
    console.log('      - Se puede extender e implementar');
    console.log('      - Más orientado a POO');
    console.log('      - Mejor para contratos de API');

    console.log('\n🚨 CASOS DE USO RECOMENDADOS:');
    console.log('   🔴 Usa INTERFACE para:');
    console.log('      - Definir contratos de objetos');
    console.log('      - Crear jerarquías de clases');
    console.log('      - Definir APIs y servicios');
    
    console.log('   🔴 Usa TYPE para:');
    console.log('      - Uniones e intersecciones');
    console.log('      - Alias de tipos primitivos');
    console.log('      - Tipos complejos y condicionales');
    console.log('      - Mapeo de tipos');

    console.log('\n🌟 BENEFICIOS DE CADA UNO:');
    console.log('   📱 Type: Flexibilidad máxima, expresividad');
    console.log('   🔄 Interface: Extensibilidad, implementación');
    console.log('   🎯 Ambos: Mejor código, menos errores');
  }
}

// Ejecutar simulador
const simulator = new TypeVsInterfaceSimulator();
simulator.runSimulation();
```

---

### 🔴 **PREGUNTA 2: ¿Qué son los genéricos en TypeScript y cómo funcionan?**

**Respuesta Completa:**

Los **genéricos** en TypeScript permiten crear funciones, clases e interfaces que pueden trabajar con múltiples tipos de datos manteniendo la seguridad de tipos.

**Características principales:**
- **Reutilización de código** - Una implementación para múltiples tipos
- **Seguridad de tipos** - El compilador verifica la consistencia
- **Flexibilidad** - Se adaptan al tipo de datos proporcionado

```typescript
// Ejemplo de Genéricos en TypeScript
// ===================================

// Función genérica simple
function identity<T>(arg: T): T {
  return arg;
}

// Función genérica con restricciones
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Clase genérica
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }

  remove(index: number): T | undefined {
    return this.items.splice(index, 1)[0];
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// Interface genérica
interface Repository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
}

// Implementación de repository genérico
class UserRepository implements Repository<User> {
  private users: User[] = [];

  async findById(id: string | number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async save(user: User): Promise<User> {
    const newUser = { ...user, id: Date.now() };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string | number, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async delete(id: string | number): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }
    
    this.users.splice(index, 1);
    return true;
  }
}

// Función genérica con múltiples tipos
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Función genérica con restricciones de tipo
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(`Longitud: ${arg.length}`);
  return arg;
}

// Función genérica con valores por defecto
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

// Uso de genéricos
const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
numberContainer.add(3);

const stringContainer = new Container<string>();
stringContainer.add('Hola');
stringContainer.add('Mundo');

const userRepo = new UserRepository();

// Ejemplos de uso
console.log('Container de números:', numberContainer.getAll());
console.log('Container de strings:', stringContainer.getAll());

// Función identity
const num = identity<number>(42);
const str = identity<string>('Hola');
const bool = identity(true); // Inferencia de tipo

// Función getProperty
const user = { name: 'Juan', age: 30 };
const userName = getProperty(user, 'name');
const userAge = getProperty(user, 'age');

// Función merge
const merged = merge({ name: 'Juan' }, { age: 30 });

// Función logLength
logLength('Hola Mundo');
logLength([1, 2, 3, 4, 5]);

// Función createArray
const stringArray = createArray(3, 'default');
const numberArray = createArray<number>(3, 0);
```

**Simulador de Genéricos:**

```typescript
// generics-simulator.ts
class GenericsSimulator {
  private testCount = 0;
  private correctAnswers = 0;
  private examples: Array<{
    name: string;
    description: string;
    code: string;
    expectedOutput: string;
    difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  }> = [];

  constructor() {
    this.setupExamples();
  }

  // Configurar ejemplos de prueba
  private setupExamples(): void {
    // Ejemplo 1: Función genérica simple
    this.examples.push({
      name: 'Función Genérica Simple',
      description: 'Función que mantiene el tipo de entrada',
      code: `function identity<T>(arg: T): T {
  return arg;
}
const result = identity<string>("Hola Mundo");`,
      expectedOutput: 'Hola Mundo',
      difficulty: 'Básico'
    });

    // Ejemplo 2: Clase genérica
    this.examples.push({
      name: 'Clase Genérica',
      description: 'Clase que puede trabajar con cualquier tipo',
      code: `class Box<T> {
  private content: T;
  constructor(value: T) {
    this.content = value;
  }
  getValue(): T {
    return this.content;
  }
}
const box = new Box<number>(42);`,
      expectedOutput: '42',
      difficulty: 'Básico'
    });

    // Ejemplo 3: Restricciones de tipo
    this.examples.push({
      name: 'Restricciones de Tipo',
      description: 'Genérico con restricciones específicas',
      code: `interface Lengthwise {
  length: number;
}
function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
logLength("Hola");`,
      expectedOutput: '4',
      difficulty: 'Intermedio'
    });

    // Ejemplo 4: Múltiples tipos genéricos
    this.examples.push({
      name: 'Múltiples Tipos Genéricos',
      description: 'Función con múltiples parámetros de tipo',
      code: `function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
const result = merge({name: "Juan"}, {age: 30});`,
      expectedOutput: '{name: "Juan", age: 30}',
      difficulty: 'Intermedio'
    });

    // Ejemplo 5: Genéricos con valores por defecto
    this.examples.push({
      name: 'Valores por Defecto',
      description: 'Genérico con tipo por defecto',
      code: `function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}
const result = createArray(3, "default");`,
      expectedOutput: '["default", "default", "default"]',
      difficulty: 'Avanzado'
    });
  }

  // Ejecutar simulación
  public runSimulation(): void {
    console.log('🔷 SIMULADOR DE GENÉRICOS EN TYPESCRIPT');
    console.log('=' .repeat(60));

    console.log('\n📋 Ejecutando ejemplos de genéricos...\n');

    this.examples.forEach((example, index) => {
      this.testCount++;
      console.log(`🧪 EJEMPLO ${index + 1}: ${example.name}`);
      console.log('-'.repeat(50));
      console.log(`📝 Descripción: ${example.description}`);
      console.log(`📊 Dificultad: ${example.difficulty}`);
      console.log(`💻 Código:`);
      console.log(example.code);
      
      // Simular ejecución
      const result = this.simulateExecution(example);
      console.log(`\n📤 Resultado esperado: ${example.expectedOutput}`);
      console.log(`📥 Resultado obtenido: ${result}`);
      
      // Verificar resultado
      if (this.verifyResult(result, example.expectedOutput)) {
        console.log('   ✅ Resultado: CORRECTO');
        this.correctAnswers++;
      } else {
        console.log('   ❌ Resultado: INCORRECTO');
      }
      
      console.log('\n' + '='.repeat(50) + '\n');
    });

    this.showFinalSummary();
  }

  // Simular ejecución del código
  private simulateExecution(example: any): string {
    try {
      switch (example.name) {
        case 'Función Genérica Simple':
          return this.executeIdentityExample();
        case 'Clase Genérica':
          return this.executeBoxExample();
        case 'Restricciones de Tipo':
          return this.executeLengthExample();
        case 'Múltiples Tipos Genéricos':
          return this.executeMergeExample();
        case 'Valores por Defecto':
          return this.executeCreateArrayExample();
        default:
          return 'No implementado';
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  // Ejecutar ejemplo de identity
  private executeIdentityExample(): string {
    function identity<T>(arg: T): T {
      return arg;
    }
    const result = identity<string>("Hola Mundo");
    return result;
  }

  // Ejecutar ejemplo de Box
  private executeBoxExample(): string {
    class Box<T> {
      private content: T;
      constructor(value: T) {
        this.content = value;
      }
      getValue(): T {
        return this.content;
      }
    }
    const box = new Box<number>(42);
    return box.getValue().toString();
  }

  // Ejecutar ejemplo de length
  private executeLengthExample(): string {
    interface Lengthwise {
      length: number;
    }
    function logLength<T extends Lengthwise>(arg: T): T {
      return arg;
    }
    const result = logLength("Hola");
    return result.length.toString();
  }

  // Ejecutar ejemplo de merge
  private executeMergeExample(): string {
    function merge<T, U>(obj1: T, obj2: U): T & U {
      return { ...obj1, ...obj2 } as T & U;
    }
    const result = merge({name: "Juan"}, {age: 30});
    return JSON.stringify(result);
  }

  // Ejecutar ejemplo de createArray
  private executeCreateArrayExample(): string {
    function createArray<T = string>(length: number, value: T): T[] {
      return Array(length).fill(value);
    }
    const result = createArray(3, "default");
    return JSON.stringify(result);
  }

  // Verificar resultado
  private verifyResult(actual: string, expected: string): boolean {
    // Normalizar strings para comparación
    const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
    return normalize(actual) === normalize(expected);
  }

  // Mostrar resumen final
  private showFinalSummary(): void {
    console.log('🎉 RESUMEN FINAL DE LA SIMULACIÓN');
    console.log('=' .repeat(50));

    console.log('\n📊 Estadísticas:');
    console.log(`   Total de ejemplos: ${this.testCount}`);
    console.log(`   Ejemplos correctos: ${this.correctAnswers}`);
    console.log(`   Tasa de éxito: ${((this.correctAnswers / this.testCount) * 100).toFixed(1)}%`);

    console.log('\n💡 LECCIONES APRENDIDAS SOBRE GENÉRICOS:');
    console.log('   ✅ Reutilización de código para múltiples tipos');
    console.log('   ✅ Seguridad de tipos en tiempo de compilación');
    console.log('   ✅ Flexibilidad para diferentes estructuras de datos');
    console.log('   ✅ Mejor IntelliSense y autocompletado');

    console.log('\n🚨 CASOS DE USO COMUNES:');
    console.log('   🔴 Contenedores y colecciones genéricas');
    console.log('   🔴 Funciones utilitarias reutilizables');
    console.log('   🔴 APIs y servicios genéricos');
    console.log('   🔴 Patrones de diseño flexibles');

    console.log('\n🌟 BENEFICIOS DE LOS GENÉRICOS:');
    console.log('   📱 Código más DRY (Don\'t Repeat Yourself)');
    console.log('   🔄 Tipos seguros y verificables');
    console.log('   🎯 Mejor mantenibilidad del código');
    console.log('   🚀 Performance en tiempo de ejecución');
  }
}

// Ejecutar simulador
const genericsSimulator = new GenericsSimulator();
genericsSimulator.runSimulation();
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos**
   - Tipos básicos y avanzados
   - Interfaces y clases
   - Enums y namespaces

2. **Características Avanzadas**
   - Genéricos
   - Decoradores
   - Módulos y namespaces
   - Utility types

3. **Integración con Frameworks**
   - Angular con TypeScript
   - React con TypeScript
   - Node.js con TypeScript

4. **Patrones de Diseño**
   - Singleton
   - Factory
   - Observer
   - Strategy

5. **Testing**
   - Jest con TypeScript
   - Mocha con TypeScript
   - Test-driven development

### 🚀 **Proyectos Prácticos Recomendados:**

1. **API REST con Express y TypeScript**
2. **Aplicación React con TypeScript**
3. **CLI tool con TypeScript**
4. **Biblioteca de utilidades**
5. **Sistema de gestión de tareas**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de TypeScript! 🔷**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador TypeScript! 🎯**
