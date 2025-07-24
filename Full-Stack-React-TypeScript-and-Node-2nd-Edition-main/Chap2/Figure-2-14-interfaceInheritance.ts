//*** Interface inheritance
// As explained earlier, interfaces are a way of setting rules for a type. 
// This is also sometimes called a contract. Interfaces will allow us to separate implementation from definition and, therefore, provide abstraction. 
// Let’s learn how to use interfaces with inheritance.Create a new file called interfaceInheritance.ts and add the following code:

// Como se explicó anteriormente, las interfaces son una forma de establecer reglas para un tipo.
// A esto también se le llama contrato. Las interfaces nos permiten separar la implementación de la definición y, por lo tanto, proporcionan abstracción.
// Aprendamos a usar interfaces con herencia. Cree un archivo llamado interfaceInheritance.ts y agregue el siguiente código:

namespace InterfaceNamespace {
    interface Thing {
        name: string;
        getFullName: () => string;
    }
    interface Vehicle extends Thing {
        wheelCount: number;
        updateWheelCount: (newWheelCount: number) => void;
        showNumberOfWheels: () => void;
    }
    // more code coming here
}

// After the namespace, you can see that there is an interface called Thing, and after that, the Vehicle interface is defined, and it inherits from Thing using the extends keyword. 
// I put this into the example to show that interfaces can also inherit from other interfaces. 
// The Thing interface has two members: name and getFullName—and as you can see, although Vehicle extends Thing, there is no mention of those members anywhere inside of Vehicle. 
// This is because Vehicle is an interface and therefore cannot have any implementation.
// Now, if you look at the following code, you will see that the Motorcycle class uses the implements keyword to define implementations of the Vehicle interface’s members. 
// Replace the previous code’s comment with this:

// Después del espacio de nombres, se puede ver que hay una interfaz llamada Cosa, y posteriormente, se define la interfaz Vehículo, que hereda de Cosa mediante la palabra clave extends.
// Incluí esto en el ejemplo para mostrar que las interfaces también pueden heredar de otras interfaces.
// La interfaz Cosa tiene dos miembros: name y getFullName. Como se puede ver, aunque Vehículo extiende Cosa, no se mencionan estos miembros dentro de Vehículo.
// Esto se debe a que Vehículo es una interfaz y, por lo tanto, no puede tener ninguna implementación.
// Ahora, si observa el siguiente código, verá que la clase Motocicleta usa la palabra clave implements para definir las implementaciones de los miembros de la interfaz Vehículo.
// Reemplace el comentario del código anterior por esto:

class Motorcycle implements Vehicle {
        name: string;
        wheelCount: number = 0;
        constructor(name: string) {
            // no super for interfaces
            this.name = name;
        }
        updateWheelCount(newWheelCount: number){
            this.wheelCount = newWheelCount;
            console.log(`Automobile has ${this.wheelCount}`);
        }
        showNumberOfWheels() {
            console.log(`moved Automobile ${this.wheelCount} miles`);
        }
        getFullName() {
            return "MC-" + this.name;
        }
    }
    const moto = new Motorcycle("beginner-cycle");
    console.log(moto.getFullName());
}

// Notice how by implementing the Vehicle interface, our Motorcycle class must implement both the members of Vehicle and Thing. 
// This occurs because Vehicle extends Thing. 
// So, if we compile and run this code, we get the following:

// Observe cómo, al implementar la interfaz Vehicle, nuestra clase Motorcycle debe implementar tanto los miembros de Vehicle como de Thing.
// Esto ocurre porque Vehicle extiende Thing.
// Por lo tanto, si compilamos y ejecutamos este código, obtenemos lo siguiente:

// Figure 2.14 – The interfaceInheritance result

Interfaces do not provide a means to do code reuse directly, as they have no implementation. 
However, it is still advantageous for code reuse because the structure of interfaces provides type-safe expectations around what code will receive and return. 
Hiding the implementation behind an interface is also beneficial in terms of doing encapsulation and abstraction, which are also important principles of OOP.
In this section, we learned about inheritance and how it can be used for code reuse. We learned about how to do inheritance with the three major container types: classes, abstract classes, and interfaces. 
In the next section, we will cover generics.

Las interfaces no permiten reutilizar código directamente, ya que carecen de implementación.
Sin embargo, siguen siendo ventajosas para la reutilización de código, ya que la estructura de las interfaces proporciona expectativas de tipo seguro sobre lo que el código recibirá y devolverá.
Ocultar la implementación tras una interfaz también es beneficioso para la encapsulación y la abstracción, principios importantes de la programación orientada a objetos (POO).
En esta sección, aprendimos sobre la herencia y cómo se puede utilizar para la reutilización de código. Aprendimos a heredar con los tres tipos principales de contenedores: clases, clases abstractas e interfaces.
En la siguiente sección, abordaremos los genéricos.


//DEMO BOOK
namespace InterfaceNamespace {
  interface Thing {
    name: string;

    getFullName: () => string;
  }

  interface Vehicle extends Thing {
    wheelCount: number;

    updateWheelCount: (newWheelCount: number) => void;

    showNumberOfWheels: () => void;
  }

  class Motorcycle implements Vehicle {
    name: string;
    wheelCount: number = 0;

    constructor(name: string) {
      // no super for interfaces

      this.name = name;
    }

    updateWheelCount(newWheelCount: number) {
      this.wheelCount = newWheelCount;

      console.log(`Automobile has ${this.wheelCount}`);
    }

    showNumberOfWheels() {
      console.log(`moved Automobile ${this.wheelCount} miles`);
    }

    getFullName() {
      return "MC-" + this.name;
    }
  }

  const moto = new Motorcycle("beginner-cycle");
  console.log(moto.getFullName());//[MC-beginner-cycle]
}
