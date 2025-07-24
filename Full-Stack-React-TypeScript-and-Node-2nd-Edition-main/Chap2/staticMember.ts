//*** “Static properties and methods”

//Finally, let’s discuss static properties and methods. When you mark something as static inside a class, you are saying that this member is a member of the class type and not of the class instance. 
//Finalmente, hablemos de las propiedades y métodos estáticos. Cuando marcas algo como estático dentro de una clase, estás diciendo que este miembro es un miembro del tipo de clase y no de la instancia de la clase.
// Therefore, it can be accessed without needing to create an instance of a class, but instead by prefixing with the class name.Let’s look at an example. Create a new file called staticMember.ts and add the following code:
// Por lo tanto, se puede acceder sin necesidad de crear una instancia de una clase, sino prefijando con el nombre de la clase. Veamos un ejemplo. Crea un nuevo archivo llamado staticMember.ts y añade el siguiente código:

class ClassA {// La clase ClassA tiene un miembro estático llamado typeName y un constructor vacío.
    static typeName: string;// El miembro estático typeName es de tipo string y se puede acceder sin necesidad de crear una instancia de la clase.
    constructor(){}// El constructor es vacío, lo que significa que no inicializa ningún campo o propiedad de la clase.
 
    static getFullName() {// El método estático getFullName devuelve una cadena que concatena el nombre de la clase y el valor del miembro estático typeName.
        return "ClassA " + ClassA.typeName;// El método estático getFullName se puede llamar sin necesidad de crear una instancia de la clase, utilizando el nombre de la clase seguido del nombre del método.
    }
}
const a = new ClassA();// Creamos una nueva instancia de la clase ClassA, aunque no es necesario para acceder a los miembros estáticos.
console.log(a.typeName);// Aquí intentamos acceder al miembro estático typeName a través de la instancia a, lo que generará un error, ya que los miembros estáticos deben ser accedidos a través del nombre de la clase.


// If you attempt to compile this code, it will fail, stating that typeName is a static member of the ClassA type. 
// Si intentas compilar este código, fallará, indicando que typeName es un miembro estático del tipo ClassA.
// Again, static members must be called using the class name. Here is the fixed version of the code:
// De nuevo, los miembros estáticos deben llamarse usando el nombre de la clase. Aquí está la versión corregida del código:

class ClassA {// La clase ClassA tiene un miembro estático llamado typeName y un constructor vacío.
    static typeName: string;// El miembro estático typeName es de tipo string y se puede acceder sin necesidad de crear una instancia de la clase.
    constructor(){}// El constructor es vacío, lo que significa que no inicializa ningún campo o propiedad de la clase.
 
    static getFullName() {// El método estático getFullName devuelve una cadena que concatena el nombre de la clase y el valor del miembro estático typeName.
        return "ClassA " + ClassA.typeName;// El método estático getFullName se puede llamar sin necesidad de crear una instancia de la clase, utilizando el nombre de la clase seguido del nombre del método.
    }
}
const a = new ClassA();// Creamos una nueva instancia de la clase ClassA, aunque no es necesario para acceder a los miembros estáticos.
console.log(ClassA.typeName);// Aquí accedemos al miembro estático typeName a través del nombre de la clase ClassA, lo que es correcto y no generará un error.

// As you can see, we reference typeName with the class name.
// Como puedes ver, referenciamos typeName con el nombre de la clase.
// So then, the question is, why might you want to use a static member instead of an instance member? Under certain circumstances, it may be useful to share data across class instances.
// Entonces, la pregunta es, ¿por qué querrías usar un miembro estático en lugar de un miembro de instancia? En ciertas circunstancias, puede ser útil compartir datos entre instancias de clase.
//  For example, you might want to do something like this:
// Por ejemplo, podrías querer hacer algo como esto:

class Runner { // La clase Runner tiene un miembro estático llamado lastRunTypeName y un constructor que toma un parámetro llamado typeName.
    static lastRunTypeName: string;// El miembro estático lastRunTypeName es de tipo string y se utiliza para almacenar el nombre del último tipo de instancia que ha llamado al método run.
    constructor(private typeName: string) {}// El constructor toma un parámetro llamado typeName, que es de tipo string y se almacena como un campo privado en la clase Runner.
 
    run() {     // El método run establece el valor del miembro estático lastRunTypeName al valor del campo typeName de la instancia actual.
        Runner.lastRunTypeName = this.typeName;// El método run se puede llamar en cualquier instancia de la clase Runner y actualizará el valor del miembro estático lastRunTypeName.
    }
}
const a = new Runner("a");// Creamos una nueva instancia de la clase Runner con el nombre "a".
const b = new Runner("b");// Creamos otra instancia de la clase Runner con el nombre "b".
b.run();// Aquí llamamos al método run en la instancia b, lo que actualizará el valor del miembro estático lastRunTypeName a "b".
a.run();// Aquí llamamos al método run en la instancia a, lo que actualizará el valor del miembro estático lastRunTypeName a "a".
console.log(Runner.lastRunTypeName);// Aquí accedemos al miembro estático lastRunTypeName a través del nombre de la clase Runner, lo que nos dará el valor "a", ya que el método run de la instancia a se ejecutó por último.


// In the case of this example, I am trying to determine the last class instance that has called the run function at any given time. 
// En el caso de este ejemplo, estoy tratando de determinar la última instancia de clase que ha llamado a la función run en un momento dado.
// If you compile and run this code, you will see that the displayed value in the terminal will be a, because a’s run method ran last. 
// Si compilas y ejecutas este código, verás que el valor mostrado en la terminal será a, porque el método run de a se ejecutó por último.
// Another point to be aware of is that inside a class, static members can be called by both static and instance members. However, static members cannot call instance members.
// Otro punto a tener en cuenta es que dentro de una clase, los miembros estáticos pueden ser llamados tanto por miembros estáticos como por miembros de instancia. Sin embargo, los miembros estáticos no pueden llamar a miembros de instancia.
// Now, we have learned about classes and their features in this section. This will help us design our code for encapsulation, which will enhance its quality. Next, we will learn about interfaces and contract-based coding.
// Ahora hemos aprendido sobre las clases y sus características en esta sección. Esto nos ayudará a diseñar nuestro código para la encapsulación, lo que mejorará su calidad. A continuación, aprenderemos sobre interfaces y codificación basada en contratos.






//------------------------------------------------------------------
// This file is part of the Full Stack React, TypeScript, and Node 2nd Edition book

// class ClassA {
//   static typeName: string;

//   constructor() {}

//   static getFullName() {
//     return "ClassA " + ClassA.typeName;
//   }
// }

// const a = new ClassA();

// console.log(ClassA.typeName);

class Runner {// The Runner class has a static member called lastRunTypeName and a constructor that takes a parameter called typeName.
  static lastRunTypeName: string;// The static member lastRunTypeName is of type string and is used to store the name of the last instance type that has called the run method.

  constructor(private typeName: string) {}// The constructor takes a parameter called typeName, which is of type string and is stored as a private field in the Runner class.

  run() {// The run method sets the value of the static member lastRunTypeName to the value of the typeName field of the current instance.
    Runner.lastRunTypeName = this.typeName;// The run method can be called on any instance of the Runner class and will update the value of the static member lastRunTypeName.
  }
}

const a = new Runner("a");// Create a new instance of the Runner class with the name "a".
const b = new Runner("b");// Create another instance of the Runner class with the name "b".

b.run();// Call the run method on instance b, which will update the static member lastRunTypeName to "b".
a.run();// Call the run method on instance a, which will update the static member lastRunTypeName to "a".

console.log(Runner.lastRunTypeName);// Access the static member lastRunTypeName through the Runner class name, which will give us the value "a", since instance a's run method ran last.
