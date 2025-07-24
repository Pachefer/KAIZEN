//*** Understanding inheritance
// In this section, we’ll learn about inheritance. Inheritance in OOP is a method for doing code reuse. 
//en esta sección, aprenderemos sobre la herencia. La herencia en OOP es un método para reutilizar el código.
// This will shrink our application code size; generally, shorter code tends to have fewer bugs. So, this will improve our app quality once we get started building.
//esta va a reducir el tamaño de nuestro código de aplicación; en general, el código más corto tiende a tener menos errores. Por lo tanto, mejorará la calidad de nuestra aplicación una vez que comencemos a construirla.
// As stated, inheritance is primarily about allowing code reuse. 
//como se ha indicado, la herencia se trata principalmente de permitir la reutilización del código.
// Inheritance is also conceptually designed to be like real-life inheritance so that the logical flow of inheritance relationships can be intuitive and easier to understand. 
// La herencia también está conceptualmente diseñada para ser como la herencia de la vida real, de modo que el flujo lógico de las relaciones de herencia pueda ser intuitivo y más fácil de entender.
// Let’s look at an example of this now. Create a file called classInheritance.ts and add the following code:
//vamos a ver un ejemplo de esto ahora. Crea un archivo llamado classInheritance.ts y agrega el siguiente código:

class Vehicle {// Esta es la clase base, también conocida como la clase padre.
    constructor(private wheelCount: number) {}//Este es el constructor de la clase base, que toma un parámetro llamado wheelCount.
    showNumberOfWheels() {// Este es un método de la clase base que muestra el número de ruedas.
        console.log(`wheels: ${this.wheelCount}`);// Este es un método de la clase base que muestra el número de ruedas.
    }
}
class Motorcycle extends Vehicle {//Esta es una clase hija que hereda de la clase base Vehicle.
    constructor() {// Este es el constructor de la clase hija, que llama al constructor de la clase base con el número de ruedas.
        super(2);//Esta es la llamada al constructor de la clase base con el número de ruedas.
    }
}
class Automobile extends Vehicle {//Esta es otra clase hija que hereda de la clase base Vehicle. 
    constructor() {// Este es el constructor de la clase hija, que llama al constructor de la clase base con el número de ruedas.
        super(4);//Esta es la llamada al constructor de la clase base con el número de ruedas.
    }
}
const motorCycle = new Motorcycle();// Esta es una instancia de la clase hija Motorcycle. // This is an instance of the child class Motorcycle.
motorCycle.showNumberOfWheels();// Esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Motorcycle. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Motorcycle instance.
const autoMobile = new Automobile();// Esta es una instancia de la clase hija Automobile. // This is an instance of the child class Automobile.
autoMobile.showNumberOfWheels();// Esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Automobile. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Automobile instance.


//A quick note if you’ve never seen backticks, ``, and ${} before. It’s called string interpolation and is simply a quick and easy way to insert variable values inside strings.
//una nota rápida si nunca has visto antes las comillas invertidas, `` y ${}. Se llama interpolación de cadenas y es simplemente una forma rápida y fácil de insertar valores de variables dentro de cadenas.

//As you can see, there is a base class, also known as a parent, called Vehicle. 
//como puedes ver, hay una clase base, también conocida como padre, llamada Vehículo.
// This class acts as the main container for source code that is being reused later by whatever classes inherit from it, also known as children or subclasses. The child classes inherit from Vehicle by using the extends keyword.
// Esta clase actúa como el contenedor principal para el código fuente que se reutiliza más tarde por las clases que heredan de ella, también conocidas como hijos o subclases. Las clases hijas heredan de Vehicle usando la palabra clave extends.
//  One thing to notice is that in the constructor for each child class, you see that the first line of code is the call to super. The first line of code in the constructor of a subclass must be the base class constructor, which is known as super. In this case, that would be the Vehicle class.Now, as you can see, each child is passing a different number of wheels to the parent’s wheelCount variable via the parent’s constructor. Then, at the end of the code, an instance of each child, Motorcycle and Automobile, is created and the showNumberOfWheels method is called. That method call to showNumberOfWheels might seem a bit strange since it’s defined inside the parent Vehicle class. However, that’s the point of inheritance—that we can make use of code from base classes when we extend them. If we compile and run this code, we get the following:
//una cosa a notar es que en el constructor de cada clase hija, ves que la primera línea de código es la llamada a super. La primera línea de código en el constructor de una subclase debe ser el constructor de la clase base, que se conoce como super. En este caso, eso sería la clase Vehículo. Ahora, como puedes ver, cada hijo está pasando un número diferente de ruedas a la variable wheelCount del padre a través del constructor del padre. Luego, al final del código, se crea una instancia de cada hijo, Motorcycle y Automobile, y se llama al método showNumberOfWheels. Esa llamada al método showNumberOfWheels puede parecer un poco extraña ya que está definida dentro de la clase padre Vehicle. Sin embargo, ese es el punto de la herencia: que podemos hacer uso del código de las clases base cuando las extendemos. Si compilamos y ejecutamos este código, obtenemos lo siguiente:

Figure 2.13 – The classInheritance result    


// So, then, each child provides a different number of wheels to the parent wheelCount variable, although they cannot access the variable directly because it’s private.
//entonces, cada hijo proporciona un número diferente de ruedas a la variable wheelCount del padre, aunque no pueden acceder a la variable directamente porque es privada.
//  Now, let’s say that there was a reason why the child classes would want to access the wheelCount variable of the parent directly. 
//ahora, supongamos que hay una razón por la cual las clases hijas querrían acceder directamente a la variable wheelCount del padre.
// For example, let’s say that if a flat tire occurred, an updated wheel count would be necessary. What could we do? Well, let’s try creating a function unique to each child class that tries to update wheelCount.
//Por ejemplo, supongamos que si ocurre un pinchazo, sería necesario un recuento actualizado de ruedas. ¿Qué podríamos hacer? Bueno, intentemos crear una función única para cada clase hija que intente actualizar wheelCount.
//  Let’s see what happens. Update the code by adding a new function, updateWheelCount, to the Motorcycle class:
//vamos a ver qué pasa. Actualiza el código agregando una nueva función, updateWheelCount, a la clase Motorcycle:

class Vehicle {//Esta es la clase base, también conocida como la clase padre. // This is the base class, also known as the parent class.
    constructor(private wheelCount: number) {}//Este es el constructor de la clase base, que toma un parámetro llamado wheelCount. // This is the constructor of the base class, which takes a parameter called wheelCount.
    showNumberOfWheels() {// Este es un método de la clase base que muestra el número de ruedas. // This is a method of the base class that shows the number of wheels.
        console.log(`wheels: ${this.wheelCount}`);// Este es un método de la clase base que muestra el número de ruedas. // This is a method of the base class that shows the number of wheels.
    }
}
class Motorcycle extends Vehicle {//Esta es una clase hija que hereda de la clase base Vehicle. // This is a child class that inherits from the base class Vehicle.
    constructor() {// Este es el constructor de la clase hija, que llama al constructor de la clase base con el número de ruedas. // This is the child class constructor, which calls the base class constructor with the number of wheels.
        super(2);//esta es la llamada al constructor de la clase base con el número de ruedas. // This is the call to the base class constructor with the number of wheels.
    }
    updateWheelCount(newWheelCount: number){// Esta es una función única de la clase hija que intenta actualizar el número de ruedas. // This is a unique function of the child class that tries to update the wheel count.
        this.wheelCount = newWheelCount;// Esto intenta actualizar el número de ruedas directamente, lo cual no es posible porque wheelCount es privado. // This tries to update the wheel count directly, which is not possible because wheelCount is private.
      }
      
}
class Automobile extends Vehicle {//Esta es otra clase hija que hereda de la clase base Vehicle. // This is another child class that inherits from the base class Vehicle.
    constructor() {// Este es el constructor de la clase hija, que llama al constructor de la clase base con el número de ruedas. // This is the child class constructor, which calls the base class constructor with the number of wheels.
        super(4);//esta es la llamada al constructor de la clase base con el número de ruedas. // This is the call to the base class constructor
    }
}
const motorCycle = new Motorcycle();// Esta es una instancia de la clase hija Motorcycle. // This is an instance of the child class Motorcycle.
motorCycle.showNumberOfWheels();// Esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Motorcycle. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Motorcycle instance.

const autoMobile = new Automobile();// Esta es una instancia de la clase hija Automobile. // This is an instance of the child class Automobile.
autoMobile.showNumberOfWheels();// Esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Automobile. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Automobile instance.

// As a test, we updated only the Motorcycle class and added an updateWheelCount method to it, and this gave us an error. 
// Como prueba, actualizamos solo la clase Motorcycle y le agregamos un método updateWheelCount, y esto nos dio un error.
// Can you guess why? It’s because we are trying to access a private member of the parent class. Even when child classes inherit their members from a parent, “they still do not have access to that parent’s private members. 
// ¿Puedes adivinar por qué? Es porque estamos tratando de acceder a un miembro privado de la clase padre. Incluso cuando las clases hijas heredan sus miembros de un padre, "todavía no tienen acceso a los miembros privados de ese padre.
// This is the right behavior, again, to promote encapsulation. So, then, what do we do? Well, let’s try editing the code again to allow this:
//Vamos a intentar editar el código nuevamente para permitir esto:

class Vehicle {// Esta es la clase base, también conocida como la clase padre. // This is the base class, also known as the parent class.
    constructor(protected wheelCount: number) {}// Este es el constructor de la clase base, que toma un parámetro llamado wheelCount. // This is the constructor of the base class, which takes a parameter called wheelCount.
    showNumberOfWheels() {// Este es un método de la clase base que muestra el número de ruedas. // This is a method of the base class that shows the number of wheels.
        console.log(`wheels: ${this.wheelCount}`);// Este es un método de la clase base que muestra el número de ruedas. // This is a method of the base class that shows the number of wheels.
    }
}
class Motorcycle extends Vehicle {// Esta es una clase hija que hereda de la clase base Vehicle. // This is a child class that inherits from the base class Vehicle.
    constructor() {
        super(2);
    }
    updateWheelCount(newWheelCount: number){// Esta es una función única de la clase hija que intenta actualizar el número de ruedas. // This is a unique function of the child class that tries to update the wheel count.
        this.wheelCount = newWheelCount;// Esto intenta actualizar el número de ruedas directamente, lo cual ahora es posible porque wheelCount es protegido. // This tries to update the wheel count directly, which is now possible because wheelCount is protected.
    }
}
class Automobile extends Vehicle {// Esta es otra clase hija que hereda de la clase base Vehicle. // This is another child class that inherits from the base class Vehicle.
    constructor() {// This is the child class constructor
        super(4);// Esta es la llamada al constructor de la clase base con el número de ruedas. // This is the call to the base class constructor
    }
}
const motorCycle = new Motorcycle();// Esta es una instancia de la clase hija Motorcycle. // This is an instance of the child class Motorcycle.
motorCycle.showNumberOfWheels();// Esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Motorcycle. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Motorcycle instance.
const autoMobile = new Automobile();// Esta es una instancia de la clase hija Automobile. // This is an instance of the child class Automobile.
autoMobile.showNumberOfWheels();// Esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Automobile. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Automobile instance.

// Do you see the small change we made? We changed the wheelCount parameter on the Vehicle parent class constructor to be of the protected accessor type.
// puedes el ver el pequeño cambio que hicimos? Cambiamos el parámetro wheelCount en el constructor de la clase padre Vehicle para que sea del tipo de acceso protegido.
// The protected type allows the class and any inheriting classes to have access to the member.Before we move on to the next topic, let’s introduce the concept of namespaces. 
//el tipo protegido permite que la clase y cualquier clase heredada tengan acceso al miembro. Antes de pasar al siguiente tema, introduzcamos el concepto de espacios de nombres.
// Namespaces are like containers that hide their contents from whatever is outside of the namespace. 
// Los espacios de nombres son como contenedores que ocultan su contenido de lo que está fuera del espacio de nombres.
// In that sense, it’s sort of like a class, but it is capable of containing any number of classes, functions, variables, or any other types. Here’s a simple example of using namespaces. 
//en ese sentido, es algo así como una clase, pero es capaz de contener cualquier número de clases, funciones, variables o cualquier otro tipo. Aquí hay un ejemplo simple de uso de espacios de nombres.
// Create a new file called namespaces and add the following code:
//crea un nuevo archivo llamado namespaces y agrega el siguiente código:

namespace A {// Este es el espacio de nombres A. // This is namespace A.
    class FirstClass {}// Esta es la primera clase dentro del espacio de nombres A. // This is the first class inside namespace A.
}

namespace B {// Este es el espacio de nombres B. // This is namespace B.
    class SecondClass {}// Esta es la segunda clase dentro del espacio de nombres B. // This is the second class inside namespace B.
    const test = new FirstClass();// Esto dará un error porque FirstClass no está definido en el espacio de nombres B. // This will give an error because FirstClass is not defined in namespace B.
}

// As you can see from this code, even before compiling, VSCode IntelliSense is already complaining that FirstClass cannot be found.
//como puedes ver en este código, incluso antes de compilar, IntelliSense de VSCode ya se está quejando de que FirstClass no se puede
//  This is because it is hidden from namespace B, since it is only defined in namespace A. 
// esto se debe a que está oculto del espacio de nombres B, ya que solo está definido en el espacio de nombres A.
// This is the purpose of namespaces: to hide information within one scope, away from other scopes.In this section, we learned about inheriting from classes.
//este en esta sección, aprendimos sobre la herencia de clases.
//  Class inheritance is a very important tool for reusing code. In the next section, we’ll look at using abstract classes, which is a more flexible way of doing inheritance.
//la herencia de clases es una herramienta muy importante para reutilizar código. En la siguiente sección, veremos el uso de clases abstractas, que es una forma más flexible de hacer herencia.


//example book  
class Vehicle {// esta es la clase base, también conocida como la clase padre. // This is the base class, also known as the parent class.
  constructor(protected wheelCount: number) {}// este es el constructor de la clase base, que toma un parámetro llamado wheelCount. // This is the constructor of the base class, which takes a parameter called wheelCount.

  showNumberOfWheels() {// este es un método de la clase base que muestra el número de ruedas. // This is a method of the base class that shows the number of wheels.
    console.log(`wheels: ${this.wheelCount}`);// este es un método de la clase base que muestra el número de ruedas. // This is a method of the base class that shows the number of wheels.
  }
}

class Motorcycle extends Vehicle {// esta es una clase hija que hereda de la clase base Vehicle. // This is a child class that inherits from the base class Vehicle.
  constructor() {// este es el constructor de la clase hija, que llama al constructor de la clase base con el número de ruedas. // This is the child class constructor, which calls the base class constructor with the number of wheels.
    super(2);// esta es la llamada al constructor de la clase base con el número de ruedas. // This is the call to the base class constructor
  }

  updateWheelCount(newWheelCount: number) {// esta es una función única de la clase hija que intenta actualizar el número de ruedas. // This is a unique function of the child class that tries to update the wheel count.
    this.wheelCount = newWheelCount;// esto intenta actualizar el número de ruedas directamente, lo cual ahora es posible porque wheelCount es protegido. // This tries to update the wheel count directly, which is now possible because wheelCount is protected.
  }
}

class Automobile extends Vehicle {// esta es otra clase hija que hereda de la clase base Vehicle. // This is another child class that inherits from the base class Vehicle.
  constructor() {//este es el constructor de la clase hija, que llama al constructor de la clase base con el número de ruedas. // This is the child class constructor, which calls the base class constructor with the number of wheels.
    super(4);// esta es la llamada al constructor de la clase base con el número de ruedas. // This is the call to the base class constructor
  }
}

const motorCycle = new Motorcycle();// esta es una instancia de la clase hija Motorcycle. // This is an instance of the child class Motorcycle.

motorCycle.showNumberOfWheels();// esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Motorcycle. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Motorcycle instance.

const autoMobile = new Automobile();// esta es una instancia de la clase hija Automobile. // This is an instance of the child class Automobile.

autoMobile.showNumberOfWheels();// esta es una llamada al método de la clase base Vehicle que muestra el número de ruedas de la instancia de Automobile. // This is a call to the method of the base class Vehicle that shows the number of wheels of the Automobile instance.
