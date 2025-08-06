# 🚀 GUÍA EXCEPCIONAL - CAPÍTULO 2: FUNDAMENTOS DE TYPESCRIPT

## 📋 CONTENIDO DEL CAPÍTULO
Este capítulo se enfoca en los fundamentos de TypeScript, incluyendo clases, herencia, interfaces, tipos y funciones. Es esencial para entender cómo Angular utiliza TypeScript.

---

## 🔍 ANÁLISIS DETALLADO DEL CÓDIGO

### 1. **user.ts - Clase Base User**

```typescript
export class User {
  firstName: string = '';
  lastName: string = '';
  private isActive: boolean = false;

  constructor(firstName: string, lastName: string, isActive: boolean = true) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = isActive;
  }  

  getFullname(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  
  get active(): boolean {
    return this.isActive;
  }  
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`export class User`**: Clase exportable que puede ser importada en otros archivos
- **`firstName: string = ''`**: Propiedad pública con tipo string e inicialización
- **`private isActive: boolean = false`**: Propiedad privada, solo accesible dentro de la clase
- **`constructor()`**: Método especial que se ejecuta al crear una instancia
- **`getFullname(): string`**: Método que retorna el nombre completo
- **`get active(): boolean`**: Getter que permite acceso controlado a la propiedad privada

**🎯 PREDICCIÓN DE RESULTADOS:**
- Se puede crear instancias de User con nombre y apellido
- El método getFullname() retornará "firstName lastName"
- Solo se puede acceder a isActive a través del getter active

### 2. **customer.ts - Herencia de Clases**

```typescript
import { User } from './user';

class Customer extends User {
  taxNumber: number;

  constructor(firstName: string, lastName: string) {
    super(firstName, lastName);
  }
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`import { User } from './user'`**: Importa la clase User desde el archivo user.ts
- **`extends User`**: Customer hereda todas las propiedades y métodos de User
- **`taxNumber: number`**: Nueva propiedad específica de Customer
- **`super(firstName, lastName)`**: Llama al constructor de la clase padre (User)

**🎯 PREDICCIÓN DE RESULTADOS:**
- Customer tendrá firstName, lastName, isActive y getFullname() de User
- Customer tendrá su propia propiedad taxNumber
- Se puede usar Customer como un User (polimorfismo)

### 3. **interfaces.ts - Definición de Interfaces**

```typescript
interface UserInterface {
  firstName: string;
  lastName: string;
  getFullname(): string;
}

interface CustomerInterface extends UserInterface {
  taxNumber: number;
}

class UserImpl implements UserInterface {
  constructor(public firstName: string, public lastName: string) {}

  getFullname(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`interface UserInterface`**: Define un contrato que las clases deben implementar
- **`extends UserInterface`**: La interfaz CustomerInterface hereda de UserInterface
- **`implements UserInterface`**: La clase UserImpl debe implementar todos los métodos de la interfaz
- **`constructor(public firstName: string)`**: Parámetro del constructor que se convierte en propiedad pública

**🎯 PREDICCIÓN DE RESULTADOS:**
- Las interfaces proporcionan tipado fuerte
- Se puede usar UserInterface como tipo para cualquier objeto que implemente la interfaz
- TypeScript verificará que todas las propiedades y métodos estén implementados

### 4. **functions.ts - Funciones y Tipos**

```typescript
// Función básica con tipos
function add(a: number, b: number): number {
  return a + b;
}

// Función con parámetros opcionales
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}

// Función con parámetros rest
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Función genérica
function identity<T>(arg: T): T {
  return arg;
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`function add(a: number, b: number): number`**: Función con tipos de parámetros y retorno
- **`greeting: string = 'Hello'`**: Parámetro opcional con valor por defecto
- **`...numbers: number[]`**: Parámetros rest que se convierten en array
- **`const multiply = (a: number, b: number): number =>`**: Arrow function con tipos
- **`function identity<T>(arg: T): T`**: Función genérica que mantiene el tipo

**🎯 PREDICCIÓN DE RESULTADOS:**
- add(5, 3) retornará 8
- greet('Juan') retornará "Hello, Juan!"
- sum(1, 2, 3, 4) retornará 10
- multiply(4, 5) retornará 20
- identity<string>('test') retornará 'test'

### 5. **variables.ts - Tipos de Variables**

```typescript
// Tipos básicos
let name: string = 'Juan';
let age: number = 25;
let isActive: boolean = true;
let hobbies: string[] = ['reading', 'gaming'];
let tuple: [string, number] = ['Juan', 25];

// Tipos union
let id: string | number = 'ABC123';
id = 12345; // También válido

// Tipos any y unknown
let anyValue: any = 'anything';
let unknownValue: unknown = 'something';

// Tipos de objeto
interface Person {
  name: string;
  age: number;
}

let person: Person = {
  name: 'Juan',
  age: 25
};
```

**📝 COMENTARIOS DETALLADOS:**

- **`let name: string`**: Variable con tipo explícito
- **`string[]`**: Array de strings
- **`[string, number]`**: Tupla con tipos específicos en cada posición
- **`string | number`**: Union type, puede ser string o number
- **`any`**: Tipo que permite cualquier valor (evitar usar)
- **`unknown`**: Tipo más seguro que any, requiere verificación de tipo

**🎯 PREDICCIÓN DE RESULTADOS:**
- Las variables tendrán tipado fuerte
- TypeScript detectará errores de tipo en tiempo de compilación
- Los arrays y tuplas tendrán métodos y propiedades específicas de su tipo

---

## 🧪 PRUEBAS UNITARIAS

### Prueba para la Clase User

```typescript
import { User } from './user';

describe('User Class', () => {
  let user: User;

  beforeEach(() => {
    user = new User('Juan', 'Pérez');
  });

  it('should create a user with firstName and lastName', () => {
    expect(user.firstName).toBe('Juan');
    expect(user.lastName).toBe('Pérez');
  });

  it('should return full name correctly', () => {
    expect(user.getFullname()).toBe('Juan Pérez');
  });

  it('should have active property accessible via getter', () => {
    expect(user.active).toBe(true); // Valor por defecto del constructor
  });

  it('should create inactive user when specified', () => {
    const inactiveUser = new User('Ana', 'García', false);
    expect(inactiveUser.active).toBe(false);
  });
});
```

### Prueba para la Clase Customer

```typescript
import { Customer } from './customer';

describe('Customer Class', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer('María', 'López');
  });

  it('should inherit from User class', () => {
    expect(customer.getFullname()).toBe('María López');
    expect(customer.firstName).toBe('María');
    expect(customer.lastName).toBe('López');
  });

  it('should have taxNumber property', () => {
    expect(customer.taxNumber).toBeDefined();
  });

  it('should be instance of both Customer and User', () => {
    expect(customer instanceof Customer).toBe(true);
    expect(customer instanceof User).toBe(true);
  });
});
```

### Prueba para Funciones

```typescript
import { add, greet, sum, multiply } from './functions';

describe('Functions', () => {
  describe('add function', () => {
    it('should add two numbers correctly', () => {
      expect(add(5, 3)).toBe(8);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('greet function', () => {
    it('should greet with default greeting', () => {
      expect(greet('Juan')).toBe('Hello, Juan!');
    });

    it('should greet with custom greeting', () => {
      expect(greet('Ana', 'Hola')).toBe('Hola, Ana!');
    });
  });

  describe('sum function', () => {
    it('should sum multiple numbers', () => {
      expect(sum(1, 2, 3)).toBe(6);
      expect(sum(1)).toBe(1);
      expect(sum()).toBe(0);
    });
  });

  describe('multiply function', () => {
    it('should multiply two numbers', () => {
      expect(multiply(4, 5)).toBe(20);
      expect(multiply(0, 10)).toBe(0);
      expect(multiply(-2, 3)).toBe(-6);
    });
  });
});
```

---

## 🎯 EJERCICIOS PRÁCTICOS

### Ejercicio 1: Crear una Clase Employee
**Objetivo**: Crear una clase que herede de User y agregue funcionalidad específica

```typescript
import { User } from './user';

export class Employee extends User {
  employeeId: string;
  department: string;
  salary: number;

  constructor(
    firstName: string, 
    lastName: string, 
    employeeId: string,
    department: string,
    salary: number
  ) {
    super(firstName, lastName);
    this.employeeId = employeeId;
    this.department = department;
    this.salary = salary;
  }

  getEmployeeInfo(): string {
    return `${this.getFullname()} - ${this.department} (ID: ${this.employeeId})`;
  }

  getSalaryWithBonus(bonusPercentage: number): number {
    return this.salary * (1 + bonusPercentage / 100);
  }
}
```

**Resultado Esperado**: Nueva clase con funcionalidad específica para empleados

### Ejercicio 2: Crear Interfaces para Formularios
**Objetivo**: Definir interfaces para validación de formularios

```typescript
interface FormField {
  value: string;
  isValid: boolean;
  errorMessage: string;
}

interface LoginForm {
  email: FormField;
  password: FormField;
  rememberMe: boolean;
}

interface RegistrationForm extends LoginForm {
  confirmPassword: FormField;
  firstName: FormField;
  lastName: FormField;
  acceptTerms: boolean;
}
```

**Resultado Esperado**: Interfaces reutilizables para formularios

### Ejercicio 3: Crear Funciones Utilitarias
**Objetivo**: Crear funciones genéricas para validación

```typescript
// Validación de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de contraseña
const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

// Formateo de fecha
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

**Resultado Esperado**: Funciones reutilizables para validación y formateo

---

## 🔧 CONFIGURACIÓN DE TYPESCRIPT

### tsconfig.json - Configuración Básica

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Explicación de Opciones:
- **`target`**: Versión de JavaScript a la que compilar
- **`strict`**: Habilita todas las verificaciones estrictas de tipo
- **`esModuleInterop`**: Permite importar módulos CommonJS como ES6
- **`declaration`**: Genera archivos .d.ts con definiciones de tipos

---

## 📊 RESUMEN DEL CAPÍTULO

### ✅ CONCEPTOS APRENDIDOS:
1. **Clases y Herencia**: Cómo crear y extender clases en TypeScript
2. **Interfaces**: Definir contratos para objetos y clases
3. **Tipos**: Sistema de tipos estático de TypeScript
4. **Funciones**: Diferentes formas de definir funciones con tipos
5. **Modificadores de Acceso**: public, private, protected

### 🎯 HABILIDADES DESARROLLADAS:
- Crear clases con propiedades y métodos tipados
- Implementar herencia entre clases
- Definir interfaces para contratos
- Escribir funciones con tipos explícitos
- Usar tipos union, generics y avanzados

### 🚀 PRÓXIMOS PASOS:
- Aplicar estos conceptos en componentes Angular
- Crear servicios con tipos fuertes
- Trabajar con observables y promesas
- Implementar validación de formularios

---

## 🔍 CONSEJOS DE APRENDIZAJE

1. **Usa el Compilador**: TypeScript te ayudará a detectar errores temprano
2. **Experimenta con Tipos**: Prueba diferentes tipos para entender sus limitaciones
3. **Lee los Errores**: Los mensajes de error de TypeScript son muy informativos
4. **Practica la Herencia**: Crea jerarquías de clases para entender mejor el concepto

---

## 🎯 EJEMPLOS PRÁCTICOS ADICIONALES

### Ejemplo: Sistema de Gestión de Biblioteca

```typescript
// Interfaces
interface Book {
  id: string;
  title: string;
  author: string;
  isAvailable: boolean;
}

interface Member {
  id: string;
  name: string;
  borrowedBooks: string[];
}

// Clases
class Library {
  private books: Book[] = [];
  private members: Member[] = [];

  addBook(book: Book): void {
    this.books.push(book);
  }

  borrowBook(memberId: string, bookId: string): boolean {
    const member = this.members.find(m => m.id === memberId);
    const book = this.books.find(b => b.id === bookId);
    
    if (member && book && book.isAvailable) {
      book.isAvailable = false;
      member.borrowedBooks.push(bookId);
      return true;
    }
    return false;
  }
}
```

**Resultado Esperado**: Sistema completo con tipos fuertes y funcionalidad real

---

*¡Excelente trabajo! Has dominado los fundamentos de TypeScript. Estás listo para aplicarlos en Angular.* 🎉 