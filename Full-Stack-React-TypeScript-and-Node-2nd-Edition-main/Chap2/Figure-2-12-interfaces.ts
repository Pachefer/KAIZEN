//*** Interfaces
// In OOP design, another important principle is abstraction. 
// en el diseño OOP, otro principio importante es la abstracción.
// The goal of abstraction is to reduce complexity and the tight coupling of code by not exposing the internal implementation (we already covered abstraction in Chapter 1, Understanding TypeScript). 
// El objetivo de la abstracción es reducir la complejidad y el acoplamiento estrecho del código al no exponer la implementación interna (ya cubrimos la abstracción en el Capítulo 1, Comprendiendo TypeScript).
// One way of doing this is to use interfaces to show only the signature of a type, as opposed to its internal workings. 
// Una forma de hacerlo es usar interfaces para mostrar solo la firma de un tipo, en lugar de su funcionamiento interno.
// An interface is also sometimes called a contract, since having specific types for parameters and return types enforces certain expectations between both the user and the creator of the interface. 
// Una interfaz también se llama a veces contrato, ya que tener tipos específicos para los parámetros y tipos de retorno impone ciertas expectativas tanto al usuario como al creador de la interfaz.
// So, another way of thinking about interfaces is as strict rules about what can come out of and go into a type instance.
// Entonces, otra forma de pensar en las interfaces es como reglas estrictas sobre lo que puede entrar y salir de una instancia de tipo.
// Now, interfaces are just a set of rules. In order to have working code, we need an implementation of those rules to get anything done.
// Ahora, las interfaces son solo un conjunto de reglas. Para tener un código funcional, necesitamos una implementación de esas reglas para hacer algo.
// So, let’s show an example of an interface with implementation to get started. Create a new file called interfaces.
// Crea un nuevo archivo llamado interfaces.ts y añade el siguiente código:
// ts and add the following interface definition:
// Crea un nuevo archivo llamado interfaces.ts y añade la siguiente definición de interfaz:

interface Employee {// La interfaz Employee define un tipo de empleado con campos específicos y una función.
    name: string;// El campo name es de tipo string y representa el nombre del empleado.
    id: number;// El campo id es de tipo number y representa el identificador único del empleado.
    isManager: boolean;// El campo isManager es de tipo booleano y indica si el empleado es un gerente o no.
    getUniqueId: () => string;// La función getUniqueId es de tipo función y no toma parámetros, pero devuelve un string que representa un identificador único para el empleado.
}

// This interface defines an Employee type, which we will create instances of later. 
// Esta interfaz define un tipo Employee, del cual crearemos instancias más adelante.
// As you can see, there is no implementation of the getUniqueId function, just its signature.
// Como puedes ver, no hay implementación de la función getUniqueId, solo su firma.
// The implementation comes later when we define it.Now, add the implementation to the interfaces.ts file. 
// Ahora, añade la implementación al archivo interfaces.ts.
// Insert the following code, which creates two instances of the Employee interface:
// Inserta el siguiente código, que crea dos instancias de la interfaz Employee:

const linda: Employee = {// La constante linda es una instancia de la interfaz Employee, que tiene los campos name, id, isManager y getUniqueId.
    name: "linda",// El campo name es de tipo string y representa el nombre del empleado.
    id: 2,// El campo id es de tipo number y representa el identificador único del empleado.
    isManager: false,// El campo isManager es de tipo booleano y indica si el empleado es un gerente o no.
    getUniqueId: (): string => {// La función getUniqueId es de tipo función y no toma parámetros, pero devuelve un string que representa un identificador único para el empleado.
        let uniqueId = linda.id + "-" + linda.name;// Inicializamos una variable uniqueId con el id y el nombre del empleado.
        if(!linda.isManager) {// Si el empleado no es un gerente, añadimos el prefijo "emp-" al identificador único.
            return "emp-" + uniqueId;// Devolvemos el identificador único con el prefijo "emp-".
        }
        return uniqueId;// De lo contrario, devolvemos el identificador único sin prefijo.
    }
}
console.log(linda.getUniqueId());// Aquí llamamos a la función getUniqueId de la instancia linda y escribimos el resultado en la consola.

console.log(linda.getUniqueId());//[emp-2-linda]

// As you can see, we create an instance by instantiating an object literal called linda, setting the two field names—name and id—and then implementing the getUniqueId function.
// Como puedes ver, creamos una instancia instanciando un literal de objeto llamado linda, estableciendo los dos nombres de campo: name e id, y luego implementando la función getUniqueId.
const pam: Employee = {// La constante pam es otra instancia de la interfaz Employee, con campos diferentes.
    name: "pam",// El campo name es de tipo string y representa el nombre del empleado.
    id: 1,// El campo id es de tipo number y representa el identificador único del empleado.
    isManager: true,// El campo isManager es de tipo booleano y indica si el empleado es un gerente o no.
    getUniqueId: (): string => {// La función getUniqueId es de tipo función y no toma parámetros, pero devuelve un string que representa un identificador único para el empleado.
        let uniqueId = pam.id + "-" + pam.name;// Inicializamos una variable uniqueId con el id y el nombre del empleado.
        if(pam.isManager) {// Si el empleado es un gerente, añadimos el prefijo "mgr-" al identificador único.
            return "mgr-" + uniqueId;// Devolvemos el identificador único con el prefijo "mgr-".
        }// De lo contrario, devolvemos el identificador único sin prefijo.
        return uniqueId;// De lo contrario, devolvemos el identificador único sin prefijo.
    }
}
console.log(pam.getUniqueId());// Aquí llamamos a la función getUniqueId de la instancia pam y escribimos el resultado en la consola.
console.log(pam.getUniqueId());//[mgr-1-pam]



// So, we create an instance by instantiating an object literal called linda, setting the two field names—name and id—and then implementing the getUniqueId function. 
// Entonces, creamos una instancia instanciando un literal de objeto llamado linda, estableciendo los dos nombres de campo: name e id, y luego implementando la función getUniqueId.
// Later, we console log linda.getUniqueId call. 
// Más tarde, registramos en la consola la llamada a linda.getUniqueId.
// After that, we create another object, called pam, based on the same interface. However, not only does it have different field values, but its implementation of getUniqueId is also different from the linda object. 
// Después de eso, creamos otro objeto, llamado pam, basado en la misma interfaz. Sin embargo, no solo tiene diferentes valores de campo, sino que su implementación de getUniqueId también es diferente de la del objeto linda.
// This is the main use of interfaces: to allow for a single structure across objects but to enable different implementations. 
// Este es el uso principal de las interfaces: permitir una única estructura en los objetos, pero habilitar diferentes implementaciones.
// In this way, we provide strict rules for the type structure, but also allow some flexibility in terms of how functions go about doing their work. 
// De esta manera, proporcionamos reglas estrictas para la estructura del tipo, pero también permitimos cierta flexibilidad en términos de cómo las funciones realizan su trabajo.
// Here’s the output of our code:
// Aquí está la salida de nuestro código:

Figure 2.12 – Employee interface results 

console.log(linda.getUniqueId());//[emp-2-linda]
console.log(pam.getUniqueId());//[mgr-1-pam]

// As you can see, the two objects have different unique IDs, but they both conform to the Employee interface.
//como puedes ver, los dos objetos tienen diferentes identificadores únicos, pero ambos cumplen con la interfaz Employee.
// This is the main use of interfaces: to allow for a single structure across objects but to enable different implementations.
// En este sentido, proporcionamos reglas estrictas para la estructura del tipo, pero también permitimos cierta flexibilidad en términos de cómo las funciones realizan su trabajo.
// In this way, we provide strict rules for the type structure, but also allow some flexibility
//En este sentido, proporcionamos reglas estrictas para la estructura del tipo, pero también permitimos cierta flexibilidad
// in terms of how functions go about doing their work.
// En términos de cómo las funciones realizan su trabajo.
// Interfaces are a powerful way to define contracts in TypeScript, allowing for flexible and reusable code.
//Interfaces son una forma poderosa de definir contratos en TypeScript, lo que permite un código flexible y reutilizable.
// In the next section, we will learn about how interfaces can be used to define function signatures and how they can be used to create more complex types.
//en la siguiente sección, aprenderemos cómo las interfaces pueden usarse para definir firmas de funciones y cómo pueden usarse para crear tipos más complejos.
// Interfaces can also be used to define function signatures, which allows us to create more complex types and enforce specific function behaviors.
//Interfaces pueden también usarse para definir firmas de funciones, lo que nos permite crear tipos más complejos y hacer cumplir comportamientos específicos de las funciones.
// In this section, we learned about interfaces and how they can be used to define contracts in TypeScript.
//en la siguiente sección, aprendimos sobre las interfaces y cómo pueden usarse para definir contratos en TypeScript.



// Another possible use of interfaces is when using third-party APIs. 
// Otro posible uso de las interfaces es cuando se utilizan APIs de terceros.
// Sometimes, the type information is not well documented, and all you're getting back is untyped JSON or the object type is extremely large and has many fields you will never use. 
// A veces, la información de tipo no está bien documentada, y todo lo que obtienes es JSON sin tipo o el tipo de objeto es extremadamente grande y tiene muchos campos que nunca usarás.
// It is quite tempting, under these circumstances, to just use any as the type and be done with it. However, you should prefer providing a type declaration if at all possible.
// Es muy tentador, en estas circunstancias, simplemente usar any como tipo y terminar con eso. Sin embargo, deberías preferir proporcionar una declaración de tipo si es posible.
// What you can do under these circumstances is to create an interface that has only the fields that you know and care about. 
// Lo que puedes hacer en estas circunstancias es crear una interfaz que tenga solo los campos que conoces y te importan.
// Then, you can declare your data type to be of this type. At development time, TypeScript will not be able to check the type since for API network calls, data will be coming in at runtime.
// Luego, puedes declarar tu tipo de datos como de este tipo. En tiempo de desarrollo, TypeScript no podrá verificar el tipo ya que para las llamadas a la red de la API, los datos llegarán en tiempo de ejecución.
// Regardless, since TypeScript only cares about the shape of any given type, it will ignore the fields not mentioned in your type declaration, and as long as the data comes in with the fields you defined in your interface, the runtime will not complain and you will maintain development-time type safety. 
// De todos modos, dado que TypeScript solo se preocupa por la forma de cualquier tipo dado, ignorará los campos no mencionados en tu declaración de tipo, y siempre que los datos lleguen con los campos que definiste en tu interfaz, el tiempo de ejecución no se quejará y mantendrás la seguridad de tipo en tiempo de desarrollo.
// However, please do ensure you handle null and undefined fields appropriately, “, as they can cause exceptions during runtime.
// Sin embargo, asegúrate de manejar los campos nulos y undefined adecuadamente, ya que pueden causar excepciones durante el tiempo de ejecución.
// In this section, we learned about interfaces and the differences between interfaces and classes.
// En esta sección, aprendimos sobre las interfaces y las diferencias entre las interfaces y las clases.
// We will be able to use interfaces to abstract away the implementation details of a class and, therefore, produce loose coupling between our code and, thus, better code quality. 
// También podremos usar las interfaces para abstraer los detalles de implementación de una clase y, por lo tanto, producir un acoplamiento suelto entre nuestro código y, por lo tanto, una mejor calidad de código.
// In the next section, we will learn about how classes and interfaces allow us to perform inheritance and, therefore, code reuse.
// En la siguiente sección, aprenderemos cómo las clases y las interfaces nos permiten realizar herencia y, por lo tanto, reutilizar el código.





// example book: Full Stack React, TypeScript, and Node 2nd Edition


interface Employee {// La interfaz Employee define un tipo de empleado con campos específicos y una función.
  name: string;// El campo name es de tipo string y representa el nombre del empleado.

  id: number;// El campo id es de tipo number y representa el identificador único del empleado.

  isManager: boolean;// El campo isManager es de tipo booleano y indica si el empleado es un gerente o no.

  getUniqueId: () => string;// La función getUniqueId es de tipo función y no toma parámetros, pero devuelve un string que representa un identificador único para el empleado.
}

const linda: Employee = {// La constante linda es una instancia de la interfaz Employee, que tiene los campos name, id, isManager y getUniqueId.
  name: "linda",// El campo name es de tipo string y representa el nombre del empleado.
  id: 2,// El campo id es de tipo number y representa el identificador único del empleado.
  isManager: false,// El campo isManager es de tipo booleano y indica si el empleado es un gerente o no.
  getUniqueId: (): string => {// La función getUniqueId es de tipo función y no toma parámetros, pero devuelve un string que representa un identificador único para el empleado.
    let uniqueId = linda.id + "-" + linda.name;// Inicializamos una variable uniqueId con el id y el nombre del empleado.
    if (!linda.isManager) {// Si el empleado no es un gerente, añadimos el prefijo "emp-" al identificador único.
      return "emp-" + uniqueId;// Devolvemos el identificador único con el prefijo "emp-".
    }
    return uniqueId;// De lo contrario, devolvemos el identificador único sin prefijo.
  },
};
console.log(linda.getUniqueId());// Aquí llamamos a la función getUniqueId de la instancia linda y escribimos el resultado en la consola.
console.log(linda.getUniqueId());//[emp-2-linda]


const pam: Employee = {// La constante pam es otra instancia de la interfaz Employee, con campos diferentes.
  name: "pam",// El campo name es de tipo string y representa el nombre del empleado.
  id: 1,// El campo id es de tipo number y representa el identificador único del empleado.
  isManager: true,// El campo isManager es de tipo booleano y indica si el empleado es un gerente o no.
  getUniqueId: (): string => {// La función getUniqueId es de tipo función y no toma parámetros, pero devuelve un string que representa un identificador único para el empleado.
    let uniqueId = pam.id + "-" + pam.name;// Inicializamos una variable uniqueId con el id y el nombre del empleado.
    if (pam.isManager) {// Si el empleado es un gerente, añadimos el prefijo "mgr-" al identificador único.
      return "mgr-" + uniqueId;// Devolvemos el identificador único con el prefijo "mgr-".
    }
    return uniqueId;// De lo contrario, devolvemos el identificador único sin prefijo.
  },
};

console.log(pam.getUniqueId());// Aquí llamamos a la función getUniqueId de la instancia pam y escribimos el resultado en la consola.
console.log(pam.getUniqueId());//[mgr-1-pam]
console.log(linda.getUniqueId());//[emp-2-linda]
// As you can see, the two objects have different unique IDs, but they both conform to the Employee interface.
// Como puedes ver, los dos objetos tienen diferentes identificadores únicos, pero ambos cumplen con la interfaz Employee.
// This is the main use of interfaces: to allow for a single structure across objects but to enable different implementations.
// Este es el uso principal de las interfaces: permitir una única estructura en los objetos, pero habilitar diferentes implementaciones.
// In this way, we provide strict rules for the type structure, but also allow some flexibility in terms of how functions go about doing their work.
// De esta manera, proporcionamos reglas estrictas para la estructura del tipo, pero también permitimos cierta flexibilidad
// In terms of how functions go about doing their work.
// En términos de cómo las funciones realizan su trabajo.
// Interfaces are a powerful way to define contracts in TypeScript, allowing for flexible and reusable code.
// Las interfaces son una forma poderosa de definir contratos en TypeScript, lo que permite un código flexible y reutilizable.
// In the next section, we will learn about how interfaces can be used to define function signatures and how they can be used to create more complex types.
// En la siguiente sección, aprenderemos cómo las interfaces pueden usarse para definir firmas de funciones y cómo pueden usarse para crear tipos más complejos.
// Interfaces can also be used to define function signatures, which allows us to create more complex types and enforce specific function behaviors.
// Las interfaces también pueden usarse para definir firmas de funciones, lo que nos permite crear tipos más complejos y hacer cumplir comportamientos específicos de las funciones.
// In this section, we learned about interfaces and how they can be used to define contracts in TypeScript.
//// En esta sección, aprendimos sobre las interfaces y cómo pueden usarse para definir contratos en TypeScript.
// We will be able to use interfaces to abstract away the implementation details of a class and, therefore, produce loose coupling between our code and, thus, better code quality. 
// Podremos usar las interfaces para abstraer los detalles de implementación de una clase y, por lo tanto, producir un acoplamiento suelto entre nuestro código y, por lo tanto, una mejor calidad de código.
// In the next section, we will learn about how classes and interfaces allow us to perform inheritance and, therefore, code reuse.
// En la siguiente sección, aprenderemos cómo las clases y las interfaces nos permiten realizar herencia y, por lo tanto, reutilizar el código.
// In this section, we learned about interfaces and the differences between interfaces and classes.
// En esta sección, aprendimos sobre las interfaces y las diferencias entre las interfaces y las clases.
// We will be able to use interfaces to abstract away the implementation details of a class and, therefore, produce loose coupling between our code and, thus, better code quality. 
// Podremos usar las interfaces para abstraer los detalles de implementación de una clase y, por lo tanto, producir un acoplamiento suelto entre nuestro código y, por lo tanto, una mejor calidad de código.
// In the next section, we will learn about how classes and interfaces allow us to perform inheritance and, therefore, code reuse.
// En la siguiente sección, aprenderemos cómo las clases y las interfaces nos permiten realizar herencia y, por lo tanto, reutilizar el código.
// In the next section, we will learn about how classes and interfaces allow us to perform inheritance and, therefore, code reuse.
// En la siguiente sección, aprenderemos cómo las clases
// and interfaces allow us to perform inheritance and, therefore, code reuse.
//y las interfaces nos permiten realizar herencia y, por lo tanto, reutilizar el código.
// In the next section, we will learn about how classes and interfaces allow us to perform inheritance and, therefore, code reuse.
// En la siguiente sección, aprenderemos cómo las clases y las interfaces nos permiten realizar herencia
// and, therefore, code reuse.
//y, por lo tanto, reutilizar el código.  



