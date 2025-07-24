//*** Getters and setters
// Another feature of classes is actually available in both TypeScript and JavaScript: getters and setters:
//otras características de las clases están disponibles tanto en TypeScript como en JavaScript: getters y setters:

Getter: A property that allows modification or validation of a related field before returning it
Setter: A property that allows modification or computation of a value before setting it to a related field

// In some other languages, these types of properties are known as computed properties. 
// En algunos otros lenguajes, este tipo de propiedades se conocen como propiedades computadas.
// Let’s look at an example. Create another file called getSet.ts and add the following code:
// Crea otro archivo llamado getSet.ts y añade el siguiente código:

class Speaker {
  #message: string = ““;// El campo message es privado y se inicializa con una cadena vacía.
  constructor(private name: string) {}// El constructor toma un parámetro llamado name, que es de tipo string y se almacena como un campo privado en la clase Speaker.
  // getter setter
}

// Our code is quickly getting more complicated. If you are new to JavaScript entirely, I provide a JavaScript refresher in Chapter 3, Building Better Apps with ES6+ Features. 
//Nuestro código se está volviendo rápidamente más complicado. Si eres nuevo en JavaScript, te ofrezco un repaso de JavaScript en el Capítulo 3, Construyendo Mejores Aplicaciones con Características ES6+.
// In this chapter, I will focus on TypeScript.The code is short, but there’s a fair amount happening here, so let’s go over it. 
// En este capítulo, me centraré en TypeScript. El código es corto, pero hay bastante sucediendo aquí, así que vamos a repasarlo.
// First, near the very top, just after the class Speaker declaration starts, you can see that our message field is not set in the constructor but is set up as a private field, using the # symbol, and therefore it is not accessible directly from outside our class. 
// Primero, cerca de la parte superior, justo después de que comienza la declaración de la clase Speaker, puedes ver que nuestro campo message no se establece en el constructor, sino que se configura como un campo privado, usando el símbolo #, y por lo tanto no es accesible directamente desde fuera de nuestra clase.
// In addition, that field is set immediately on declaration, “because in TypeScript, with strict mode on, a field must have a value either on declaration or set in the constructor. 
// Además, ese campo se establece inmediatamente en la declaración, porque en TypeScript, con el modo estricto activado, un campo debe tener un valor ya sea en la declaración o establecido en el constructor.
// The only initializer the constructor takes as a parameter is our name field.Now, let’s add our actual getter and setter and overwrite the // getter setter comment with this:
// Ahora, añadamos nuestro getter y setter reales y sobrescribamos el comentario // getter setter con esto:

get Message() {// El getter toma un parámetro llamado this, que es de tipo Speaker.
  if (!this.#message.includes(this.name)) {// Si el campo message no contiene el nombre del hablante, lanzamos una excepción.
    throw Error("message is missing speaker's name");//[Error: message is missing speaker's name]
  }
  return this.#message;// De lo contrario, devolvemos el campo message.
}
set Message(val: string) {// El setter toma un parámetro llamado val, que es de tipo string.
  let tmpMessage = val;// Inicializamos una variable temporal llamada tmpMessage con el valor del parámetro val.
  if (!val.includes(this.name)) {// Si el valor del parámetro val no contiene el nombre del hablante, añadimos el nombre del hablante al mensaje temporal.
    tmpMessage = this.name + " " + val;//[john hello]
  }
  this.#message = tmpMessage;// Establecemos el campo message con el mensaje temporal.
}

// You can see that we start by declaring the get Message() property accessor. 
// Tu puedes ver que comenzamos declarando el accesorio de propiedad get Message().
// This is our getter. 
// este es nuestro getter.
// In the getter, we test to see whether our message field value has the speaker’s name in it by using the JavaScript includes function. 
// En el getter, probamos si el valor de nuestro campo message tiene el nombre del hablante usando la función includes de JavaScript.
// This function is like contains in other languages, and it searches for the given parameter as a substring of the original string. 
//esta función es como contains en otros lenguajes, y busca el parámetro dado como una subcadena de la cadena original.
// Now, if our if statement does not find the speaker’s name (the ! symbol is a negation symbol), we throw an exception to indicate an unwanted situation. Notice also that our message field is called this.#message. 
// Ahora, si nuestra declaración if no encuentra el nombre del hablante (el símbolo ! es un símbolo de negación), lanzamos una excepción para indicar una situación no deseada.
// This is because when we use the # symbol when declaring a field, we must always use it subsequently “when calling the associated field. 
// Esto se debe a que cuando usamos el símbolo # al declarar un campo, siempre debemos usarlo posteriormente al llamar al campo asociado.
// The setter, also called Message, is indicated by the set keyword, and this property receives a string and adds the speaker’s name if needed by checking whether it is missing from the message field.
// El setter, también llamado Message, se indica con la palabra clave set, y esta propiedad recibe una cadena y añade el nombre del hablante si es necesario comprobando si falta en el campo message.
// Note that although both getter and setter look like functions, they are not. When they are called later in code, they are called just like a field would be called without the parentheses.
// Ten en cuenta que aunque tanto el getter como el setter parecen funciones, no lo son. Cuando se llaman más tarde en el código, se llaman como si fuera un campo sin los paréntesis.
// Now then, after the definition of our Speaker class is finished, we have the actual instantiation and usage of our class, as shown here. Add this code below the setter:
// Ahora bien, después de que se haya terminado la definición de nuestra clase Speaker, tenemos la instanciación real y el uso de nuestra clase, como se muestra aquí. Añade este código debajo del setter:

const speaker = new Speaker("john");// Aquí estamos creando una nueva instancia de la clase Speaker con el nombre "john".
speaker.Message = "hello";// Aquí estamos usando el setter para establecer el mensaje del hablante.
console.log(speaker.Message);// Aquí estamos usando el getter para obtener el mensaje del hablante y escribirlo en la consola.

// The speaker object is instantiated as a new speaker with the name john and its Message property is set to hello. 
//el objeto speaker se instancia como un nuevo hablante con el nombre john y su propiedad Message se establece en hello.
// This mechanism allows us to set the message field without actually exposing it to the outside world. Thereafter, the message is written to the console.
//este mecanismo nos permite establecer el campo message sin exponerlo al mundo exterior. Después de eso, el mensaje se escribe en la consola.
// Let’s compile and run this code:
//vamos a compilar y ejecutar este código:

//INICIA IA CONTENT
// Figure 2.10 – getSet output
console.log(speaker.Message);// [john hello]
// You should see the following output:
// Deberías ver la siguiente salida:
// [john hello]

// To drive the point home further, let’s try switching the speaker.Message = "hello" line to speaker.message = "hello".
// Para enfatizar aún más el punto, intentemos cambiar la línea speaker.Message = "hello" a speaker.message = "hello".
//  If you compile, you should see this error:”
//si compilas, deberías ver este error:

// Figure 2.11 – Message field error

console.log(speaker.message);// [Error: Property 'message' does not exist on type 'Speaker'. Did you mean 'Message'?]

// [Error: Property 'message' does not exist on type 'Speaker'. Did you mean 'Message'?]
// [Error: La propiedad 'message' no existe en el tipo 'Speaker'. ¿Quiso decir 'Message'?]
// This error indicates that the message field does not exist on the Speaker class, and it suggests
//es la razón por la que no podemos acceder al campo message directamente desde fuera de nuestra clase.
// that you might have meant to use the Message property instead.
// Esto indica que el campo message no existe en la clase Speaker, y sugiere que podrías haber querido usar la propiedad Message en su lugar.
// This is because message is a private field and cannot be accessed from outside our class directly.
//es la razón por la que no podemos acceder al campo message directamente desde fuera de nuestra clase.
// You may be wondering why I mentioned getters and setters here when they are available in regular JavaScript, too. 
//tu puedes preguntarte por qué mencioné los getters y setters aquí cuando también están disponibles en JavaScript normal,
// Si te estás preguntando por qué mencioné los getters y setters aquí    cuando también están disponibles en JavaScript normal,
// If you look at the example, you can see that the message field is private and the getter and setter properties are public. 
//// Si te estás preguntando por qué mencioné los getters y setters aquí cuando también están disponibles en JavaScript normal,
// Si miras el ejemplo, puedes ver que el campo message es privado y las propiedades getter y setter son públicas.
// So, to allow good encapsulation,
// it is a best practice to hide our field and only expose it when needed via a getter and/or setter or some method that allows modification of the field.
// Por lo tanto, para permitir una buena encapsulación, es una buena práctica ocultar nuestro campo y solo exponerlo cuando sea necesario
// a través de un getter y/o setter o algún método que permita la modificación del campo.
// Also, remember that when deciding on an access level for your members, you want to start with the most restrictive capabilities first and then become less restrictive as needed.
// Además, recuerda que al decidir sobre un nivel de acceso para tus miembros, quieres comenzar con las capacidades más restrictivas primero y luego
// volverte menos restrictivo según sea necesario.  
// Additionally, by allowing field access via getters and setters, we can do many different types of checks and modifications, as we’ve done in our example, so that we have ultimate control over what comes in and out of our class.

//FIN IA CONTENT

// This occurred because message is a private field and cannot be accessed from outside our class directly.
//es la razón por la que no podemos acceder al campo message directamente desde fuera de nuestra clase.
// You may be wondering why I mentioned getters and setters here when they are available in regular JavaScript, too. 
//tu puedes preguntarte por qué mencioné los getters y setters aquí cuando también están disponibles en JavaScript normal,  
// If you look at the example, you can see that the message field is private and the getter and setter properties are public.
// Si miras el ejemplo, puedes ver que el campo message es privado y las propiedades getter y setter son públicas. 
// So, to allow good encapsulation, it is a best practice to hide our field and only expose it when needed via a getter and/or setter or some method that allows modification of the field.
// Por lo tanto, para permitir una buena encapsulación, es una buena práctica ocultar nuestro campo y solo exponerlo cuando sea necesario a través de un getter y/o setter o algún método que permita la modificación del campo.
//  Also, remember that when deciding on an access level for your members, you want to start with the most restrictive capabilities first and then become less restrictive as needed.
// Además, recuerda que al decidir sobre un nivel de acceso para tus miembros, quieres comenzar con las capacidades más restrictivas primero y luego volverte menos restrictivo según sea necesario.
// Additionally, by allowing field access via getters and setters, we can do many different types of checks and modifications, as we’ve done in our example, so that we have ultimate control over what comes in and out of our class.
//además, al permitir el acceso a los campos a través de getters y setters, podemos realizar muchos tipos diferentes de comprobaciones y modificaciones, como hemos hecho en nuestro ejemplo, para que tengamos un control total sobre lo que entra y sale de nuestra clase.


//EXAMPLE BOOK// This code demonstrates the use of getters and setters in TypeScript.
// It shows how to define a class with private fields, and how to use getter and setter
//este código demuestra el uso de getters y setters en TypeScript.


class Speaker {// La clase Speaker tiene un campo privado llamado message y un constructor que toma un parámetro llamado name.
  #message: string = "";// El campo message es privado y se inicializa con una cadena vacía.

  constructor(private name: string) {}// El constructor toma un parámetro llamado name, que es de tipo string y se almacena como un campo privado en la clase Speaker.

  get Message() {// El getter toma un parámetro llamado this, que es de tipo Speaker.
    if (!this.#message.includes(this.name)) {// Si el campo message no contiene el nombre del hablante, lanzamos una excepción.
      throw Error("message is missing speaker's name");//[Error: message is missing speaker's name]
    }

    return this.#message;// De lo contrario, devolvemos el campo message.
  }

  set Message(val: string) {// El setter toma un parámetro llamado val, que es de tipo string.
    let tmpMessage = val;// Inicializamos una variable temporal llamada tmpMessage con el valor del parámetro val.

    if (!val.includes(this.name)) {// Si el valor del parámetro val no contiene el nombre del hablante, añadimos el nombre del hablante al mensaje temporal.
      tmpMessage = this.name + " " + val;//[john hello]
    }

    this.#message = tmpMessage;// Establecemos el campo message con el mensaje temporal.
  }
}

const speaker = new Speaker("john");// Aquí estamos creando una nueva instancia de la clase Speaker con el nombre "john".
// speaker.message = "hello";// Aquí estamos usando el setter para establecer el mensaje del hablante.
console.log(speaker.Message);// Aquí estamos usando el getter para obtener el mensaje del hablante y escribirlo en la consola.
