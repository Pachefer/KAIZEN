//*** Abstract classes

// As mentioned previously, interfaces can be useful for defining contracts, but they have no implementation of working code themselves. 
// Classes have working implementations, but sometimes only a signature is required. It is possible, for certain situations, that we may want to have both classes and interfaces in one object type. 
// For these types of scenarios, you would use an abstract class instead of either a class or an interface. 
// Let’s create a new file called abstractClass.ts and copy and paste our code from our classInheritance.ts file into it. 
// If you do this, you might get some errors, since the two files both have the same class and variable names. 
// Please feel free to comment out the code in the file you are not using whenever this occurs.
// So, in our new abstractClass.ts file, we are going to update it with namespaces and modify the Vehicle class to be abstract. 
// Add the namespace and update the Vehicle class like this:

// Como se mencionó anteriormente, las interfaces pueden ser útiles para definir contratos, pero no tienen una implementación de código funcional.
// Las clases tienen implementaciones funcionales, pero a veces solo se requiere una firma. Es posible, en ciertas situaciones, que queramos tener clases e interfaces en un mismo tipo de objeto.
// Para estos casos, se usaría una clase abstracta en lugar de una clase o una interfaz.
// Creemos un nuevo archivo llamado abstractClass.ts y copiemos y peguemos el código de nuestro archivo classInheritance.ts.
// Si lo hace, podría obtener algunos errores, ya que ambos archivos tienen los mismos nombres de clase y variable.
// Si esto ocurre, puede comentar el código del archivo que no esté utilizando.
// Por lo tanto, en nuestro nuevo archivo abstractClass.ts, lo actualizaremos con espacios de nombres y modificaremos la clase Vehicle para que sea abstracta.
// Agregue el espacio de nombres y actualice la clase Vehicle de la siguiente manera:

namespace AbstractNamespace {
    abstract class Vehicle {
        constructor(protected wheelCount: number) {}
        abstract updateWheelCount(newWheelCount: number): void;
        showNumberOfWheels() {
            console.log(`wheels: ${this.wheelCount}`);
        }
    }
  // the rest of our existing code
}

So, to start, we’ve wrapped all the code within a scope called namespace AbstractNamespace. 
Again, this is merely a container that allows us to control scoping so that the members of our abstractClass.ts file do not bleed out into the global scope.
If you look at the new Vehicle code, we have a new keyword before the class called abstract. 
This is what indicates that the class will be an abstract one. You can also see that we have a new function called updateWheelCount. 
This function has an abstract keyword in front of it, which indicates that it will have no implementation within the Vehicle class and needs to be implemented by an inheriting class.
Now, after the Vehicle abstract class definition, we want our child classes to implement our Vehicle class. So, add the Motorcycle and Automobile classes below the Vehicle class:


Para empezar, hemos encapsulado todo el código dentro de un ámbito llamado espacio de nombres AbstractNamespace.
Nuevamente, este es simplemente un contenedor que nos permite controlar el ámbito para que los miembros de nuestro archivo abstractClass.ts no se filtren al ámbito global.
Si observan el nuevo código de Vehicle, tenemos una nueva palabra clave antes de la clase llamada abstract.
Esto indica que la clase será abstracta. También pueden ver que tenemos una nueva función llamada updateWheelCount.
Esta función tiene una palabra clave abstract delante, lo que indica que no tendrá implementación dentro de la clase Vehicle y que debe ser implementada por una clase heredada.
Ahora, después de la definición de la clase abstracta Vehicle, queremos que nuestras clases hijas implementen nuestra clase Vehicle. Por lo tanto, agreguen las clases Motorcycle y Automobile debajo de la clase Vehicle:

    class Motorcycle extends Vehicle {
        constructor() {
            super(2);
        }
        updateWheelCount(newWheelCount: number){
            this.wheelCount = newWheelCount;
            console.log(`Motorcycle has ${this.wheelCount}`);
        }
    }
    class Automobile extends Vehicle {
        constructor() {
            super(4);
        }
        updateWheelCount(newWheelCount: number){
            this.wheelCount = newWheelCount;
            console.log(`Automobile has ${this.wheelCount}`);
        }
        showNumberOfWheels() {
            console.log(`wheels: ${this.wheelCount}`);
        }
    }
    // more code here

// After adding the classes, we instantiate them and call their respective updateWheelCount methods, as shown:
// Después de agregar las clases, las instanciamos y llamamos a sus respectivos métodos updateWheelCount, como se muestra:

  const motorCycle = new Motorcycle();
    motorCycle.updateWheelCount(1);
    const autoMobile = new Automobile();
    autoMobile.updateWheelCount(3);

// As you can see, the implementation of the abstract member updateWheelCount is in the child classes. This is the capability that an abstract class provides. 
// An abstract class can act both like a regular class, providing member implementations, and like an interface, providing only the rules to be implemented by a sub-class.
// Since an abstract class can have abstract members, you cannot instantiate an abstract class.
// If you review the code of the Automobile class, you can see that it has its own implementation of showNumberOfWheels, even though this function is not abstract.
// This demonstrates something called overriding, which is the ability of a child to create a unique implementation of the parent’s member and use that implementation instead.
// In this section, we learned about the different kinds of class-based inheritance. Learning about inheritance will allow us to reuse more of our code, reducing both code size and potential bugs. 
// In the next section, we’ll learn about doing inheritance with interfaces and how it’s different from class-based inheritance.

// Como puede ver, la implementación del miembro abstracto updateWheelCount se encuentra en las clases hijas. Esta es la capacidad que proporciona una clase abstracta.
// Una clase abstracta puede actuar como una clase normal, proporcionando implementaciones de sus miembros, y como una interfaz, proporcionando únicamente las reglas que implementará una subclase.
// Dado que una clase abstracta puede tener miembros abstractos, no se puede instanciar una clase abstracta.
// Si revisa el código de la clase Automobile, puede ver que tiene su propia implementación de showNumberOfWheels, aunque esta función no es abstracta.
// Esto demuestra la sobreescritura, que es la capacidad de una clase hija de crear una implementación única del miembro de la clase padre y usar esa implementación en su lugar.
// En esta sección, aprendimos sobre los diferentes tipos de herencia basada en clases. Aprender sobre la herencia nos permitirá reutilizar más código, reduciendo tanto el tamaño del código como los posibles errores.
// En la siguiente sección, aprenderemos sobre la herencia con interfaces y sus diferencias con la herencia basada en clases.




//EXAMPLE BOOK
namespace AbstractNamespace {
  abstract class Vehicle {
    constructor(protected wheelCount: number) {}

    abstract updateWheelCount(newWheelCount: number): void;

    showNumberOfWheels() {
      console.log(`wheels: ${this.wheelCount}`);
    }
  }

  class Motorcycle extends Vehicle {
    constructor() {
      super(2);
    }

    updateWheelCount(newWheelCount: number) {
      this.wheelCount = newWheelCount;

      console.log(`Motorcycle has ${this.wheelCount}`);
    }
  }

  class Automobile extends Vehicle {
    constructor() {
      super(4);
    }

    updateWheelCount(newWheelCount: number) {
      this.wheelCount = newWheelCount;

      console.log(`Automobile has ${this.wheelCount}`);
    }

    showNumberOfWheels() {
      console.log(`wheels: ${this.wheelCount}`);
    }
  }

  const motorCycle = new Motorcycle();

  motorCycle.showNumberOfWheels();

  const autoMobile = new Automobile();

  autoMobile.showNumberOfWheels();
}
