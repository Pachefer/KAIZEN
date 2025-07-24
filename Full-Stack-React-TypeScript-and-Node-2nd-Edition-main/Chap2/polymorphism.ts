//*** Understanding polymorphism

// Polymorphism is a bit of an intimidating name as it’s not immediately clear what it means. 
// However, it’s actually quite powerful because it allows us to maintain type safety in our code while still being able to use different code implementations as needed.
// Let’s look at some code and see how this works. 
// Create a file called polymorphism.ts and add the following code. 
// This is going to be a fair bit of code, so let’s go through it in pieces:

// El nombre "polimorfismo" puede resultar un poco intimidante, ya que no queda claro a primera vista qué significa.
// Sin embargo, es bastante potente, ya que nos permite mantener la seguridad de tipos en nuestro código y, al mismo tiempo, usar diferentes implementaciones según sea necesario.
// Veamos un poco de código para ver cómo funciona.
// Crea un archivo llamado polymorphism.ts y añade el siguiente código.
// Esto será bastante código, así que veámoslo por partes:

interface Animal {
  name: string;
  runMaxMiles(hours: number): number;
}

// First, we’ve created an interface that shows an Animal type. 
// This type has a name and a method signature of runMaxMiles. 
// Obviously, since this is an interface, our intention is to implement this interface with specific capabilities, so let’s do that now:

// Primero, hemos creado una interfaz que muestra un tipo Animal.
// Este tipo tiene un nombre y una firma de método de runMaxMiles.
// Obviamente, al ser una interfaz, nuestra intención es implementarla con capacidades específicas, así que hagámoslo ahora:

class Wolf implements Animal {
  name: string = "";
  runMaxMiles(hours: number): number {
    return hours * 45;
  }
}
class Cheetah implements Animal {
  name: string = "";
  runMaxMiles(hours: number): number {
    return hours * 75;
  }
}

Here, we’ve created two distinct implementations: Wolf and Cheetah. 
Each one has a certain distance it can cover within a given time period—in other words, miles per hour. 
Let’s continue by adding the portion of our code that displays the polymorphism:

Aquí, hemos creado dos implementaciones distintas: Wolf y Cheetah.
Cada una tiene una distancia que puede cubrir en un período de tiempo determinado; es decir, millas por hora.
Continuemos añadiendo la parte de nuestro código que muestra el polimorfismo:

const hours = 0.5;
function pickTheBestAnimalToRun(hours: number): number {
  let animal: Animal | undefined;
  if (hours >= 0.5) {
    animal = new Wolf();
    animal.name = "wolfie";
  } else {
    animal = new Cheetah();
    animal.name = "cheetos";
  }
  if (animal instanceof Wolf) {
    console.log("This is a wolf");
  }
  if (animal instanceof Cheetah) {
    console.log("This is a cheetah");
  }
  return animal.runMaxMiles(hours);
}
pickTheBestAnimalToRun(hours);

// So, what have we done in our pickTheBestAnimalToRun function? First, we created an animal variable of the Animal type. 
// Notice that although an animal has a type, it is not initially set to anything.
//  Next, we have a condition, and this is where the polymorphism is happening. 
// This condition looks at the number of hours needed to be run and selects the appropriate animal to run for that duration.
//  Since a wolf, although slower than a cheetah, is generally capable of running longer distances if the duration to be run is more than half an hour (0.5 hours), it will be selected and initialized over a cheetah.
//   Let's build and run this code and see what happens:


//   Entonces, ¿qué hemos hecho en nuestra función "pickTheBestAnimalToRun"? Primero, creamos una variable animal del tipo Animal.
// Observe que, aunque un animal tiene un tipo, inicialmente no tiene ningún valor asignado.
// A continuación, tenemos una condición, y aquí es donde se produce el polimorfismo.
// Esta condición considera el número de horas necesarias para la carrera y selecciona el animal adecuado para esa duración.
// Dado que un lobo, aunque más lento que un guepardo, generalmente es capaz de correr distancias más largas si la duración de la carrera es superior a media hora (0,5 horas), se seleccionará e inicializará sobre un guepardo.
// Construyamos y ejecutemos este código y veamos qué sucede:



//EXAMPLE BOOK
interface Animal {
  name: string;

  runMaxMiles(hours: number): number;
}

class Wolf implements Animal {
  name: string = "";
  runMaxMiles(hours: number): number {
    return hours * 45;
  }
}

class Cheetah implements Animal {
  name: string = "";
  runMaxMiles(hours: number): number {
    return hours * 75;
  }
}

const hours = 0.5;
function pickTheBestAnimalToRun(hours: number): number {
  let animal: Animal | undefined;
  if (hours >= 0.5) {
    animal = new Wolf();
    animal.name = "wolfie";
  } else {
    animal = new Cheetah();
    animal.name = "cheetos";
  }

  if (animal instanceof Wolf) {
    console.log("This is a wolf");//Print
  }
  if (animal instanceof Cheetah) {
    console.log("This is a cheetah");
  }
  return animal.runMaxMiles(hours);
}

pickTheBestAnimalToRun(hours);
