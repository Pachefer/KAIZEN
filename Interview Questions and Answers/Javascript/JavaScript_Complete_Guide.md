# 🚀 Guía Completa de JavaScript - Entrevistas y Dominio

## 🎯 Introducción a JavaScript

**JavaScript** es un lenguaje de programación dinámico, interpretado y orientado a objetos que se ejecuta en el navegador y en el servidor (Node.js). Es fundamental para el desarrollo web moderno.

### 🌟 **¿Por qué JavaScript?**

- **Lenguaje universal** - Frontend, backend, móvil, desktop
- **Ecosistema masivo** - npm, frameworks, librerías
- **Comunidad activa** - Soporte y recursos abundantes
- **Evolución constante** - Nuevas características cada año
- **Demanda laboral alta** - Desarrolladores muy solicitados

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Cuál es la diferencia entre `==` y `===`?**

**Respuesta Completa:**

**`==` (Igualdad suelta):**
- Compara valores después de conversión de tipos
- Puede llevar a resultados inesperados
- No recomendado en código moderno

**`===` (Igualdad estricta):**
- Compara valores Y tipos sin conversión
- Más predecible y seguro
- Mejor práctica en JavaScript moderno

```javascript
// Ejemplos de comparación
console.log(5 == '5');    // true (conversión automática)
console.log(5 === '5');   // false (tipos diferentes)

console.log(0 == false);  // true (0 se convierte a false)
console.log(0 === false); // false (tipos diferentes)

console.log(null == undefined);  // true
console.log(null === undefined); // false

console.log('' == 0);     // true (string vacío se convierte a 0)
console.log('' === 0);    // false
```

**Simulador de Comparaciones:**

```javascript
// comparison-simulator.js
class ComparisonSimulator {
  constructor() {
    this.testCases = [
      { a: 5, b: '5', description: 'Número vs String' },
      { a: 0, b: false, description: 'Cero vs Boolean' },
      { a: null, b: undefined, description: 'Null vs Undefined' },
      { a: '', b: 0, description: 'String vacío vs Cero' },
      { a: [], b: false, description: 'Array vacío vs Boolean' },
      { a: {}, b: false, description: 'Objeto vacío vs Boolean' },
      { a: [1, 2], b: '1,2', description: 'Array vs String' },
      { a: NaN, b: NaN, description: 'NaN vs NaN' }
    ];
  }
  
  // Ejecutar comparaciones
  runComparisons() {
    console.log('🔍 SIMULADOR DE COMPARACIONES EN JAVASCRIPT\n');
    
    this.testCases.forEach((testCase, index) => {
      const { a, b, description } = testCase;
      
      console.log(`📝 Caso ${index + 1}: ${description}`);
      console.log(`   a = ${a} (${typeof a})`);
      console.log(`   b = ${b} (${typeof b})`);
      
      const looseEquality = a == b;
      const strictEquality = a === b;
      
      console.log(`   ==  (suelta): ${a} == ${b} = ${looseEquality}`);
      console.log(`   === (estricta): ${a} === ${b} = ${strictEquality}`);
      
      if (looseEquality !== strictEquality) {
        console.log(`   ⚠️  ¡Diferencia detectada! La conversión de tipos afecta el resultado`);
      }
      
      console.log('');
    });
    
    this.generateRecommendations();
  }
  
  // Generar recomendaciones
  generateRecommendations() {
    console.log('💡 RECOMENDACIONES:\n');
    console.log('✅ SIEMPRE usa === (igualdad estricta)');
    console.log('❌ NUNCA uses == (igualdad suelta)');
    console.log('🔒 === es más predecible y seguro');
    console.log('📚 === previene bugs relacionados con conversión de tipos');
    
    console.log('\n🎯 Casos especiales a recordar:');
    console.log('   • NaN === NaN siempre es false');
    console.log('   • Usa Object.is() para comparar NaN');
    console.log('   • Para arrays/objetos, compara propiedades individuales');
  }
}

// Ejecutar simulador
const comparisonSim = new ComparisonSimulator();
comparisonSim.runComparisons();
```

---

### 🔴 **PREGUNTA 2: ¿Qué es el hoisting en JavaScript?**

**Respuesta Completa:**

El **hoisting** es el comportamiento de JavaScript de mover declaraciones al inicio del scope durante la fase de compilación.

```javascript
// Ejemplo de hoisting
console.log(x); // undefined (no ReferenceError)
var x = 5;

// Es equivalente a:
var x;           // Declaración movida arriba
console.log(x);  // undefined
x = 5;           // Asignación
```

**Tipos de Hoisting:**

1. **Variable Hoisting**: Solo la declaración, no la asignación
2. **Function Hoisting**: Tanto declaración como definición
3. **Class Hoisting**: No existe (ReferenceError)

```javascript
// Variable hoisting
console.log(a); // undefined
var a = 10;

// Function hoisting
sayHello(); // "¡Hola!" - funciona
function sayHello() {
  console.log('¡Hola!');
}

// Class hoisting
try {
  new MyClass(); // ReferenceError
} catch (e) {
  console.log('Error:', e.message);
}
class MyClass {}
```

**Simulador de Hoisting:**

```javascript
// hoisting-simulator.js
class HoistingSimulator {
  constructor() {
    this.examples = [
      {
        name: 'Variable Hoisting',
        code: `console.log(x); // undefined
var x = 5;`,
        explanation: 'La declaración var se mueve arriba, pero la asignación permanece en su lugar'
      },
      {
        name: 'Function Hoisting',
        code: `sayHello(); // "¡Hola!"
function sayHello() {
  console.log('¡Hola!');
}`,
        explanation: 'Tanto la declaración como la definición de la función se mueven arriba'
      },
      {
        name: 'Class Hoisting',
        code: `try {
  new MyClass();
} catch (e) {
  console.log('Error:', e.message);
}
class MyClass {}`,
        explanation: 'Las clases NO tienen hoisting, causan ReferenceError'
      },
      {
        name: 'let/const Hoisting',
        code: `console.log(y); // ReferenceError
let y = 10;`,
        explanation: 'let/const tienen hoisting pero no se inicializan (Temporal Dead Zone)'
      }
    ];
  }
  
  // Simular ejecución de código
  simulateExecution(example) {
    console.log(`\n🔍 ${example.name}:`);
    console.log('📝 Código:');
    console.log(example.code);
    console.log('\n📖 Explicación:');
    console.log(example.explanation);
    
    // Simular resultado
    if (example.name.includes('Variable')) {
      console.log('\n🎯 Resultado simulado:');
      console.log('   undefined (x está declarada pero no inicializada)');
    } else if (example.name.includes('Function')) {
      console.log('\n🎯 Resultado simulado:');
      console.log('   ¡Hola! (función disponible antes de su declaración)');
    } else if (example.name.includes('Class')) {
      console.log('\n🎯 Resultado simulado:');
      console.log('   ReferenceError: Cannot access \'MyClass\' before initialization');
    } else if (example.name.includes('let/const')) {
      console.log('\n🎯 Resultado simulado:');
      console.log('   ReferenceError: Cannot access \'y\' before initialization');
    }
  }
  
  // Ejecutar todos los ejemplos
  runAllExamples() {
    console.log('🚀 SIMULADOR DE HOISTING EN JAVASCRIPT\n');
    
    this.examples.forEach(example => {
      this.simulateExecution(example);
      console.log('─'.repeat(50));
    });
    
    this.generateHoistingRules();
  }
  
  // Generar reglas de hoisting
  generateHoistingRules() {
    console.log('\n📚 REGLAS DE HOISTING:\n');
    
    console.log('✅ CON HOISTING:');
    console.log('   • var (declaración)');
    console.log('   • function (declaración y definición)');
    
    console.log('\n❌ SIN HOISTING:');
    console.log('   • let/const (Temporal Dead Zone)');
    console.log('   • class (ReferenceError)');
    console.log('   • function expressions');
    
    console.log('\n💡 MEJORES PRÁCTICAS:');
    console.log('   • Declara variables al inicio del scope');
    console.log('   • Usa let/const en lugar de var');
    console.log('   • No dependas del hoisting para la lógica');
  }
}

// Ejecutar simulador
const hoistingSim = new HoistingSimulator();
hoistingSim.runAllExamples();
```

---

### 🔴 **PREGUNTA 3: ¿Qué son las closures en JavaScript?**

**Respuesta Completa:**

Una **closure** es una función que tiene acceso a variables de su scope externo incluso después de que el scope externo haya terminado de ejecutarse.

```javascript
// Ejemplo básico de closure
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (scope separado)
```

**Casos de Uso Comunes:**

1. **Data Privacy** - Variables privadas
2. **Function Factories** - Crear funciones con configuración
3. **Event Handlers** - Mantener estado en callbacks
4. **Module Pattern** - Encapsulación de código

```javascript
// Data Privacy
function createBankAccount(initialBalance) {
  let balance = initialBalance;
  
  return {
    deposit: function(amount) {
      balance += amount;
      return balance;
    },
    withdraw: function(amount) {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      throw new Error('Saldo insuficiente');
    },
    getBalance: function() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500);
console.log(account.getBalance()); // 1500
// balance no es accesible desde fuera
```

**Simulador de Closures:**

```javascript
// closure-simulator.js
class ClosureSimulator {
  constructor() {
    this.examples = [];
  }
  
  // Ejemplo 1: Contador simple
  demonstrateSimpleCounter() {
    console.log('🔢 DEMOSTRACIÓN 1: Contador Simple\n');
    
    function createCounter() {
      let count = 0;
      
      return function() {
        count++;
        return count;
      };
    }
    
    const counter1 = createCounter();
    const counter2 = createCounter();
    
    console.log('📊 Ejecutando contadores:');
    console.log(`   Counter1: ${counter1()}, ${counter1()}, ${counter1()}`);
    console.log(`   Counter2: ${counter2()}, ${counter2()}`);
    
    console.log('\n💡 Explicación:');
    console.log('   • Cada contador mantiene su propio scope de count');
    console.log('   • Los valores persisten entre llamadas');
    console.log('   • Los contadores son independientes');
  }
  
  // Ejemplo 2: Function Factory
  demonstrateFunctionFactory() {
    console.log('\n🏭 DEMOSTRACIÓN 2: Function Factory\n');
    
    function createMultiplier(factor) {
      return function(number) {
        return number * factor;
      };
    }
    
    const double = createMultiplier(2);
    const triple = createMultiplier(3);
    const quadruple = createMultiplier(4);
    
    console.log('📊 Multiplicadores creados:');
    console.log(`   double(5): ${double(5)}`);
    console.log(`   triple(5): ${triple(5)}`);
    console.log(`   quadruple(5): ${quadruple(5)}`);
    
    console.log('\n💡 Explicación:');
    console.log('   • Cada función recuerda su factor');
    console.log('   • Se pueden crear múltiples funciones con diferentes configuraciones');
    console.log('   • El factor está "encerrado" en cada función');
  }
  
  // Ejemplo 3: Data Privacy
  demonstrateDataPrivacy() {
    console.log('\n🔒 DEMOSTRACIÓN 3: Data Privacy\n');
    
    function createPerson(name, age) {
      let privateData = {
        name: name,
        age: age,
        ssn: '123-45-6789'
      };
      
      return {
        getName: function() {
          return privateData.name;
        },
        getAge: function() {
          return privateData.age;
        },
        setAge: function(newAge) {
          if (newAge >= 0) {
            privateData.age = newAge;
            return true;
          }
          return false;
        },
        getInfo: function() {
          return `${privateData.name}, ${privateData.age} años`;
        }
        // SSN no es accesible desde fuera
      };
    }
    
    const person = createPerson('Juan', 30);
    
    console.log('📊 Accediendo a datos públicos:');
    console.log(`   Nombre: ${person.getName()}`);
    console.log(`   Edad: ${person.getAge()}`);
    console.log(`   Info: ${person.getInfo()}`);
    
    console.log('\n🔒 Intentando acceder a datos privados:');
    console.log(`   person.privateData: ${person.privateData}`);
    console.log(`   person.ssn: ${person.ssn}`);
    
    console.log('\n💡 Explicación:');
    console.log('   • privateData no es accesible desde fuera');
    console.log('   • Solo se puede acceder a través de métodos públicos');
    console.log('   • Los datos están encapsulados y protegidos');
  }
  
  // Ejemplo 4: Event Handler
  demonstrateEventHandler() {
    console.log('\n🎯 DEMOSTRACIÓN 4: Event Handler\n');
    
    function createButtonHandler(buttonId) {
      let clickCount = 0;
      
      return function() {
        clickCount++;
        console.log(`   Botón ${buttonId} clickeado ${clickCount} veces`);
        
        if (clickCount >= 3) {
          console.log(`   ⚠️  Botón ${buttonId} deshabilitado después de 3 clicks`);
        }
      };
    }
    
    const button1Handler = createButtonHandler('A');
    const button2Handler = createButtonHandler('B');
    
    console.log('📊 Simulando clicks en botones:');
    
    for (let i = 0; i < 4; i++) {
      button1Handler();
    }
    
    console.log('');
    
    for (let i = 0; i < 2; i++) {
      button2Handler();
    }
    
    console.log('\n💡 Explicación:');
    console.log('   • Cada botón mantiene su propio contador de clicks');
    console.log('   • El estado persiste entre eventos');
    console.log('   • Se puede implementar lógica compleja basada en el estado');
  }
  
  // Ejecutar todas las demostraciones
  runAllDemonstrations() {
    console.log('🚀 SIMULADOR DE CLOSURES EN JAVASCRIPT\n');
    
    this.demonstrateSimpleCounter();
    this.demonstrateFunctionFactory();
    this.demonstrateDataPrivacy();
    this.demonstrateEventHandler();
    
    console.log('\n🎉 Todas las demostraciones completadas');
    this.generateClosureBenefits();
  }
  
  // Generar beneficios de closures
  generateClosureBenefits() {
    console.log('\n🌟 BENEFICIOS DE LAS CLOSURES:\n');
    
    console.log('✅ Data Privacy:');
    console.log('   • Variables privadas no accesibles desde fuera');
    console.log('   • Encapsulación de datos sensibles');
    
    console.log('\n✅ State Persistence:');
    console.log('   • Mantener estado entre llamadas de función');
    console.log('   • Implementar contadores y acumuladores');
    
    console.log('\n✅ Function Factories:');
    console.log('   • Crear funciones con configuración específica');
    console.log('   • Reutilización de código con parámetros');
    
    console.log('\n✅ Module Pattern:');
    console.log('   • Encapsulación de código');
    console.log('   • APIs públicas y privadas');
  }
}

// Ejecutar simulador
const closureSim = new ClosureSimulator();
closureSim.runAllDemonstrations();
```

---

### 🔴 **PREGUNTA 4: ¿Qué es el prototipo en JavaScript?**

**Respuesta Completa:**

El **prototipo** es el mecanismo por el cual JavaScript implementa la herencia. Cada objeto tiene una propiedad interna `[[Prototype]]` que apunta a otro objeto.

```javascript
// Herencia prototipal
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} hace un sonido`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Establecer la cadena prototipal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} ladra: ¡Guau!`;
};

const myDog = new Dog('Rex', 'Pastor Alemán');
console.log(myDog.speak()); // "Rex hace un sonido"
console.log(myDog.bark());  // "Rex ladra: ¡Guau!"
```

**Simulador de Prototipos:**

```javascript
// prototype-simulator.js
class PrototypeSimulator {
  constructor() {
    this.examples = [];
  }
  
  // Demostrar herencia básica
  demonstrateBasicInheritance() {
    console.log('🐾 DEMOSTRACIÓN 1: Herencia Básica\n');
    
    // Constructor base
    function Animal(name) {
      this.name = name;
    }
    
    // Métodos del prototipo
    Animal.prototype.speak = function() {
      return `${this.name} hace un sonido`;
    };
    
    Animal.prototype.move = function() {
      return `${this.name} se mueve`;
    };
    
    // Constructor derivado
    function Dog(name, breed) {
      Animal.call(this, name); // Llamar constructor padre
      this.breed = breed;
    }
    
    // Establecer herencia
    Dog.prototype = Object.create(Animal.prototype);
    Dog.prototype.constructor = Dog;
    
    // Métodos específicos del perro
    Dog.prototype.bark = function() {
      return `${this.name} ladra: ¡Guau!`;
    };
    
    Dog.prototype.fetch = function() {
      return `${this.name} busca la pelota`;
    };
    
    // Crear instancias
    const animal = new Animal('Criatura');
    const dog = new Dog('Rex', 'Pastor Alemán');
    
    console.log('📊 Métodos del Animal:');
    console.log(`   ${animal.speak()}`);
    console.log(`   ${animal.move()}`);
    
    console.log('\n📊 Métodos del Perro (herencia + específicos):');
    console.log(`   ${dog.speak()}`);    // Heredado
    console.log(`   ${dog.move()}`);     // Heredado
    console.log(`   ${dog.bark()}`);     // Específico
    console.log(`   ${dog.fetch()}`);    // Específico
    
    console.log('\n🔍 Verificando herencia:');
    console.log(`   dog instanceof Animal: ${dog instanceof Animal}`);
    console.log(`   dog instanceof Dog: ${dog instanceof Dog}`);
    console.log(`   Object.getPrototypeOf(dog): ${Object.getPrototypeOf(dog).constructor.name}`);
  }
  
  // Demostrar métodos estáticos
  demonstrateStaticMethods() {
    console.log('\n⚡ DEMOSTRACIÓN 2: Métodos Estáticos\n');
    
    function User(name, email) {
      this.name = name;
      this.email = email;
    }
    
    // Método de instancia
    User.prototype.getInfo = function() {
      return `${this.name} (${this.email})`;
    };
    
    // Método estático
    User.createAdmin = function(name, email) {
      const user = new User(name, email);
      user.isAdmin = true;
      return user;
    };
    
    // Método estático de validación
    User.validateEmail = function(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    const user1 = new User('Juan', 'juan@example.com');
    const admin = User.createAdmin('Admin', 'admin@example.com');
    
    console.log('📊 Usuario normal:');
    console.log(`   ${user1.getInfo()}`);
    console.log(`   Es admin: ${user1.isAdmin || false}`);
    
    console.log('\n📊 Usuario admin:');
    console.log(`   ${admin.getInfo()}`);
    console.log(`   Es admin: ${admin.isAdmin}`);
    
    console.log('\n📊 Validación de email:');
    console.log(`   'test@example.com' válido: ${User.validateEmail('test@example.com')}`);
    console.log(`   'invalid-email' válido: ${User.validateEmail('invalid-email')}`);
    
    console.log('\n💡 Explicación:');
    console.log('   • Los métodos estáticos pertenecen a la función constructora');
    console.log('   • No requieren una instancia para ser llamados');
    console.log('   • Útiles para utilidades y factory methods');
  }
  
  // Demostrar Object.create
  demonstrateObjectCreate() {
    console.log('\n🏗️  DEMOSTRACIÓN 3: Object.create\n');
    
    // Objeto base
    const vehicle = {
      start() {
        return `${this.name} está arrancando`;
      },
      stop() {
        return `${this.name} se está deteniendo`;
      }
    };
    
    // Crear objeto con prototipo específico
    const car = Object.create(vehicle, {
      name: {
        value: 'Mi Coche',
        writable: true,
        enumerable: true
      },
      brand: {
        value: 'Toyota',
        writable: false,
        enumerable: true
      },
      drive() {
        return `${this.name} está conduciendo`;
      }
    });
    
    // Crear otro objeto heredando del mismo prototipo
    const motorcycle = Object.create(vehicle, {
      name: {
        value: 'Mi Moto',
        writable: true,
        enumerable: true
      },
      ride() {
        return `${this.name} está rodando`;
      }
    });
    
    console.log('📊 Vehículo base:');
    console.log(`   Métodos: ${Object.getOwnPropertyNames(vehicle)}`);
    
    console.log('\n📊 Coche:');
    console.log(`   ${car.start()}`);
    console.log(`   ${car.drive()}`);
    console.log(`   ${car.stop()}`);
    console.log(`   Marca: ${car.brand}`);
    
    console.log('\n📊 Moto:');
    console.log(`   ${motorcycle.start()}`);
    console.log(`   ${motorcycle.ride()}`);
    console.log(`   ${motorcycle.stop()}`);
    
    console.log('\n🔍 Verificando prototipos:');
    console.log(`   car.__proto__ === vehicle: ${car.__proto__ === vehicle}`);
    console.log(`   motorcycle.__proto__ === vehicle: ${motorcycle.__proto__ === vehicle}`);
    console.log(`   car.__proto__ === motorcycle.__proto__: ${car.__proto__ === motorcycle.__proto__}`);
  }
  
  // Ejecutar todas las demostraciones
  runAllDemonstrations() {
    console.log('🚀 SIMULADOR DE PROTOTIPOS EN JAVASCRIPT\n');
    
    this.demonstrateBasicInheritance();
    this.demonstrateStaticMethods();
    this.demonstrateObjectCreate();
    
    console.log('\n🎉 Todas las demostraciones completadas');
    this.generatePrototypeBenefits();
  }
  
  // Generar beneficios de prototipos
  generatePrototypeBenefits() {
    console.log('\n🌟 BENEFICIOS DE LOS PROTOTIPOS:\n');
    
    console.log('✅ Herencia:');
    console.log('   • Reutilización de código');
    console.log('   • Jerarquías de objetos');
    
    console.log('\n✅ Memoria eficiente:');
    console.log('   • Los métodos se comparten entre instancias');
    console.log('   • No se duplican en cada objeto');
    
    console.log('\n✅ Flexibilidad:');
    console.log('   • Modificar comportamiento en tiempo de ejecución');
    console.log('   • Agregar métodos dinámicamente');
    
    console.log('\n✅ Compatibilidad:');
    console.log('   • Funciona en todos los navegadores');
    console.log('   • Base de frameworks modernos');
  }
}

// Ejecutar simulador
const prototypeSim = new PrototypeSimulator();
prototypeSim.runAllDemonstrations();
```

---

## 🧪 **SIMULADOR COMPLETO DE JAVASCRIPT**

### 🎯 **Simulador de Entrevista Técnica**

```javascript
// javascript-interview-simulator.js
class JavaScriptInterviewSimulator {
  constructor() {
    this.questions = this.loadQuestions();
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = new Map();
    this.categories = {
      'Fundamentos': 0,
      'Funciones': 0,
      'Objetos': 0,
      'Asincronía': 0,
      'ES6+': 0,
      'DOM': 0
    };
  }
  
  // Cargar preguntas de entrevista
  loadQuestions() {
    return [
      {
        id: 1,
        category: 'Fundamentos',
        question: '¿Cuál es la diferencia entre var, let y const?',
        code: `var x = 1;
let y = 2;
const z = 3;

// ¿Qué sucede aquí?
x = 10;
y = 20;
z = 30;`,
        options: [
          'Todas las variables se pueden reasignar',
          'Solo var y let se pueden reasignar',
          'Solo var se puede reasignar',
          'Ninguna se puede reasignar'
        ],
        correct: 1,
        explanation: 'var y let permiten reasignación, const no. Además, let y const tienen block scope, var tiene function scope.',
        difficulty: 'Básico'
      },
      {
        id: 2,
        category: 'Funciones',
        question: '¿Cuál es la salida del siguiente código?',
        code: `function test() {
  console.log(this);
}

const obj = { name: 'test' };
const boundTest = test.bind(obj);
boundTest();`,
        options: [
          'undefined',
          'window (objeto global)',
          '{ name: "test" }',
          'Error'
        ],
        correct: 2,
        explanation: 'bind() crea una nueva función con this fijado al objeto especificado.',
        difficulty: 'Intermedio'
      },
      {
        id: 3,
        category: 'Objetos',
        question: '¿Cómo clonar un objeto en JavaScript?',
        code: `const original = { a: 1, b: { c: 2 } };
// ¿Cuál es la mejor opción?`,
        options: [
          'const clone = original;',
          'const clone = Object.assign({}, original);',
          'const clone = { ...original };',
          'const clone = JSON.parse(JSON.stringify(original));'
        ],
        correct: 2,
        explanation: 'El spread operator (...) es la forma más moderna y legible para clonación superficial.',
        difficulty: 'Intermedio'
      },
      {
        id: 4,
        category: 'Asincronía',
        question: '¿Cuál es la salida del siguiente código?',
        code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        options: [
          '1, 2, 3, 4',
          '1, 4, 3, 2',
          '1, 4, 2, 3',
          '1, 3, 4, 2'
        ],
        correct: 1,
        explanation: 'Event Loop: código síncrono → microtasks (Promises) → macrotasks (setTimeout).',
        difficulty: 'Avanzado'
      },
      {
        id: 5,
        category: 'ES6+',
        question: '¿Qué hace el operador de coalescencia nula (??)?',
        code: `const value1 = 0 ?? 'default';
const value2 = '' ?? 'default';
const value3 = null ?? 'default';
const value4 = undefined ?? 'default';`,
        options: [
          'Solo verifica null y undefined',
          'Verifica todos los valores falsy',
          'Verifica solo null',
          'Verifica solo undefined'
        ],
        correct: 0,
        explanation: '?? solo verifica null y undefined, no otros valores falsy como 0 o "".',
        difficulty: 'Intermedio'
      }
    ];
  }
  
  // Mostrar pregunta actual
  showCurrentQuestion() {
    const question = this.questions[this.currentQuestion];
    
    console.log(`\n📝 PREGUNTA ${this.currentQuestion + 1} de ${this.questions.length}`);
    console.log(`🏷️  Categoría: ${question.category}`);
    console.log(`📊 Dificultad: ${question.difficulty}`);
    console.log(`\n❓ ${question.question}`);
    
    if (question.code) {
      console.log('\n💻 Código:');
      console.log(question.code);
    }
    
    console.log('\n📋 Opciones:');
    question.options.forEach((option, index) => {
      console.log(`   ${index + 1}. ${option}`);
    });
    
    return question;
  }
  
  // Responder pregunta
  answerQuestion(answerIndex) {
    const question = this.questions[this.currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    this.answers.set(question.id, {
      answer: answerIndex,
      correct: isCorrect,
      explanation: question.explanation
    });
    
    if (isCorrect) {
      this.score++;
      this.categories[question.category]++;
      console.log('\n✅ ¡Respuesta correcta!');
    } else {
      console.log('\n❌ Respuesta incorrecta');
    }
    
    console.log(`\n📖 Explicación: ${question.explanation}`);
    
    return isCorrect;
  }
  
  // Calcular puntuación final
  calculateFinalScore() {
    const totalQuestions = this.questions.length;
    const percentage = (this.score / totalQuestions) * 100;
    
    let level = '';
    if (percentage >= 90) level = '🚀 Experto';
    else if (percentage >= 80) level = '⭐ Avanzado';
    else if (percentage >= 70) level = '✅ Intermedio';
    else if (percentage >= 60) level = '📚 Básico';
    else level = '🔴 Necesita mejorar';
    
    return {
      score: this.score,
      total: totalQuestions,
      percentage: percentage.toFixed(1),
      level: level
    };
  }
  
  // Generar reporte detallado
  generateDetailedReport() {
    const finalScore = this.calculateFinalScore();
    
    console.log('\n📊 REPORTE FINAL DE LA ENTREVISTA');
    console.log('=' .repeat(50));
    
    console.log(`\n🎯 Puntuación General:`);
    console.log(`   📈 Respuestas correctas: ${finalScore.score}/${finalScore.total}`);
    console.log(`   📊 Porcentaje: ${finalScore.percentage}%`);
    console.log(`   🏆 Nivel: ${finalScore.level}`);
    
    console.log(`\n📚 Análisis por Categoría:`);
    Object.entries(this.categories).forEach(([category, correct]) => {
      const totalInCategory = this.questions.filter(q => q.category === category).length;
      const percentage = totalInCategory > 0 ? (correct / totalInCategory * 100).toFixed(1) : 0;
      console.log(`   ${category}: ${correct}/${totalInCategory} (${percentage}%)`);
    });
    
    // Recomendaciones
    console.log(`\n💡 RECOMENDACIONES:`);
    
    if (finalScore.percentage < 70) {
      console.log(`   📖 Revisa los fundamentos de JavaScript`);
      console.log(`   🔄 Practica con funciones y objetos`);
      console.log(`   🧪 Construye proyectos pequeños para aplicar conceptos`);
    } else if (finalScore.percentage < 85) {
      console.log(`   🚀 Profundiza en conceptos avanzados`);
      console.log(`   📊 Mejora tu comprensión de asincronía y ES6+`);
      console.log(`   🔒 Estudia patrones de diseño y mejores prácticas`);
    } else {
      console.log(`   🎉 ¡Excelente! Estás listo para entrevistas técnicas`);
      console.log(`   🌟 Considera certificaciones y posiciones senior`);
      console.log(`   💼 Busca roles de arquitecto o tech lead`);
    }
  }
  
  // Ejecutar simulador completo
  async runSimulator() {
    console.log('🎯 SIMULADOR DE ENTREVISTA TÉCNICA - JAVASCRIPT');
    console.log('=' .repeat(60));
    console.log('\n📋 Instrucciones:');
    console.log('   • Lee cada pregunta cuidadosamente');
    console.log('   • Analiza el código si está presente');
    console.log('   • Selecciona la mejor respuesta');
    console.log('   • Revisa las explicaciones para aprender');
    console.log('\n🚀 ¡Comencemos!\n');
    
    // Simular respuestas automáticas para demostración
    for (let i = 0; i < this.questions.length; i++) {
      this.showCurrentQuestion();
      
      // Simular respuesta (en una entrevista real, el usuario respondería)
      const randomAnswer = Math.floor(Math.random() * 4);
      this.answerQuestion(randomAnswer);
      
      // Pausa entre preguntas
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (i < this.questions.length - 1) {
        console.log('\n⏭️  Siguiente pregunta...\n');
      }
    }
    
    // Mostrar reporte final
    this.generateDetailedReport();
  }
}

// Ejecutar simulador
const interviewSimulator = new JavaScriptInterviewSimulator();
interviewSimulator.runSimulator();
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos**
   - Tipos de datos y conversiones
   - Scope y hoisting
   - Event Loop y asincronía

2. **Funciones**
   - Closures y scope
   - this y binding
   - Arrow functions

3. **Objetos y Prototipos**
   - Herencia prototipal
   - Object methods
   - Classes (ES6)

4. **ES6+ Features**
   - Destructuring
   - Spread/Rest operators
   - Modules
   - Promises y async/await

5. **DOM y Eventos**
   - Manipulación del DOM
   - Event handling
   - Event delegation

### 🚀 **Proyectos Prácticos Recomendados:**

1. **Todo App con localStorage**
2. **Weather App con APIs**
3. **Game de memoria**
4. **Formulario con validación**
5. **Dashboard interactivo**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de JavaScript! 🚀**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador JavaScript! 🎯**
