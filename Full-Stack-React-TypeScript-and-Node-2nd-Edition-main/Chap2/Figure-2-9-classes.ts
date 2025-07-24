
// Figure 2.9 – Classes error”


//*** Understanding classes and interfaces
// We’ve already briefly looked at classes and interfaces in previous sections. 
// Let’s take a deeper look and see why these types can help us write better code. 
// Once we complete this section, we will be better prepared to write more readable, reusable code with fewer bugs.

//*** Classes
//At a high level, classes in TypeScript look like classes in JavaScript. 
//They are a container for a related set of fields and methods that can be instantiated and reused. 
//However, classes in TypeScript support extra features for encapsulation that JavaScript does not. 
//Let’s take a look at a new example.

//IMPORTANT NOTE

//We will be creating many files in this project, and some of them will use the same name for some types. 
// If you get errors about “duplicate identifiers,” just go to the other file and comment out that code.


// Create a new file called classes.ts and enter the following code:

class Person {
    constructor() {}
    msg: string = ““;
    speak() {
        console.log(this.msg);//[speak hello]
    }
}
const tom = new Person();
tom.msg = "hello";
tom.speak();

// This example has a simple class called Person that is very similar to something you would see in JavaScript. 
// Let’s explain this code in bullet form to make it easier to follow:

// Person: Firstly, we have a name for the class so that it can be easily reused.
// constructor: Next, we have a method called constructor that can help build an instance of the class. 
// Constructors are used to initialize any fields that the class might have and to do any other setup for the class instance, such as running functions (in this case, it does nothing).

// msg: Then, we have a single field called msg, which is called using the this keyword.

// this: The this keyword represents the running instance of the class, in other words, an actual object instance of the Person class. 
// This is a JavaScript feature and indicates that the field or method being called belongs to that object and that object alone. In addition, the this keyword can only be called inside the running object within one of its methods.
// speak: Next, there is a method called speak that writes the msg value to the console. 
// Finally, we set the msg field to a value of hello and call the speak method.

// Now, let’s look at how classes differ between TypeScript and JavaScript.

// *** Access modifiers
// We stated previously that one of the main principles of object-oriented development is encapsulation, or information hiding.
// Well, if we take a look at the code again, clearly, we are not hiding the msg variable as it is exposed and editable outside of the class. 
// This is the default accessibility of all class members in TypeScript. 
// If an explicit accessor is not set, that member is accessible and modifiable outside of the class. 
// If you want this behavior explicitly, you can set the public accessor, but this shouldn’t be necessary since again, it is the default.Let's see what TypeScript allows us to do with accessors. 
// Let’s update the code like this:

class Person {
    constructor(private msg: string) {}
 
    speak() {
        console.log(this.msg);
    }
}
const tom = new Person("hello");
// tom.msg = "hello";
tom.speak();

// As you can see, we updated the constructor with a parameter that uses a keyword called private. 
// This method of declaring a constructor parameter and also adding an access modifier is doing several things in one line. 
// Firstly, “ it tells the compiler that the class has a field called msg of the string type that should be private.Secondly, by adding this field to the constructor, we are saying that whenever we call the “constructor, e.g., new Person("hello"), we want the msg field to be set to whatever the parameter is set to.Now, what does setting something to private actually do? By setting the field to private, we make it inaccessible from outside the class. 
// The result of this is that tom.msg = "hello" no longer works and causes an error. Try removing the comments, //, before tom.msg = “hello” and compiling. You should see this message:”


//Figure 2.9 – Classes error”
//AI CONTENT
//console.log(tom.msg); // [Error: Property 'msg' is private and only accessible within class 'Person'.]
// This error message indicates that the msg field is private and cannot be accessed from outside the class
// This is a powerful feature of TypeScript that allows us to encapsulate our code and prevent unintended modifications to class members.
// It also helps us enforce the principle of encapsulation, which is a key aspect of object-oriented programming.
// By using access modifiers, we can control the visibility and accessibility of class members, making our code more robust and maintainable.
// In this case, we used the private modifier to restrict access to the msg field, ensuring that it can only be modified within the class itself
// This is a powerful feature of TypeScript that allows us to encapsulate our code and prevent unintended modifications to class members.


// As you can see, it complains that a private member, msg, cannot be accessed from outside of the class. 
// Also, please note that we only applied our modifier to a field, but access modifiers can be applied to any member field or method.
// Let’s continue modifying this code. Update the Person type with this code:

class Person {
  private msg: string;
  constructor(msg: string) {
    this.msg = msg;
  }
  speak() {
    this.msg = "speak " + this.msg;
    console.log(this.msg);
  }
}
const tom = new Person("hello");
// tom.msg = "hello";
tom.speak();

// As you can see, we’ve modified how the msg variable is being set and initialized. 
// This code does the same thing as the code we just saw previously. 
// However, it’s a more verbose version.Now, thus far, we’ve only been using the private accessor. 
// However, keep in mind that as we discussed in Chapter 1, Understanding TypeScript, there is the alternative # symbol, which is part of JavaScript, for making members private. 
// Once we begin building our application, I will utilize that symbol most of the time unless there is some particular capability that only the TypeScript-style accessor can provide.
// Now, let’s learn about the readonly modifier. This one is relatively straightforward; it causes a field to become read-only after it “after it has been set one time in the constructor. 
// Let’s see what this looks like. Replace the Person code with this update by adding readonly to the declaration of the msg field, like this:

class Person {
    constructor(private readonly msg: string) {}
 
    speak () {
        this.msg = "speak " + this.msg;
        console.log(this.msg);
    }
}
const tom = new Person("hello");
// tom.msg = "hello";
tom.speak();

// Once you complete this update, VSCode IntelliSense complains because, in the speak function, we are attempting to change the value of msg even though it has already been set once through the constructor, which again is not allowed once you use readonly on a field.
// The private and readonly access modifiers are not the only modifiers available in TypeScript. 
// There are several other types of access modifiers. However, they will make more sense if we explain them in the context of inheritance later.
// Now, as we continue this chapter, we will be introducing more features of newer versions of JavaScript, which forces us to modify the TypeScript compiler configuration. 
// So, let’s take a short detour and discuss TypeScript configuration.










// *** TypeScript configuration// TypeScript is a superset of JavaScript, which means that it can compile to any version
// of JavaScript. However, by default, TypeScript compiles to the latest version of JavaScript, which may not be compatible with all browsers or environments.
// To change the target version of JavaScript that TypeScript compiles to, you can modify the tsconfig.json file in your project
// This file contains the configuration options for the TypeScript compiler, including the target version of JavaScript.
// For example, to compile to ES5, you can set the target option to "es5" like this:
{
  "compilerOptions": {
    "target": "es5",
    // other options...
  }
}
// This will ensure that TypeScript compiles to a version of JavaScript that is compatible with older browsers and environments.
// You can also set the target option to "es6" or "es     
2015" to compile to the latest version of JavaScript.  
// This is useful if you want to take advantage of the latest features of JavaScript, such as arrow functions, classes, and modules.
// However, keep in mind that not all browsers or environments support the latest version of JavaScript, so you may need to use a polyfill or transpiler to ensure compatibility.
// In addition to the target option, you can also set other options in the tsconfig.json file, such as the module system, source maps, and strict type checking.
// These options can help you customize the behavior of the TypeScript compiler and ensure that your code is compatible with your target environment.
// For example, to use the CommonJS module system, you can set the module option to "commonjs" like this:
{
  "compilerOptions": {
    "module": "commonjs",
    // other options...
  }
}
// This will ensure that TypeScript compiles your code to use the CommonJS module system,
// which is commonly used in Node.js and other server-side environments.
// You can also set the sourceMap option to true to generate source maps for your TypeScript code, which can help with debugging and development.
// This will ensure that TypeScript generates source maps for your code, which can help you debug your code in the browser or other environments.
// Finally, you can set the strict option to true to enable strict type checking in TypeScript. 
// This will ensure that TypeScript checks your code for type errors and ensures that your code is type-safe. 
// This is a good practice to follow as it can help you catch errors early in the development process and ensure that your code is robust and maintainable.
// For example, to enable strict type checking, you can set the strict option to true like this:
{
  "compilerOptions": {
    "strict": true,
    // other options...
  }
}   
// This will ensure that TypeScript checks your code for type errors and ensures that your code is type-safe.   
// This is a good practice to follow as it can help you catch errors early in the development process and ensure that your code is robust and maintainable.
// In summary, TypeScript is a powerful tool that can help you write type-safe and maintainable code.
// By configuring the TypeScript compiler options, you can customize the behavior of TypeScript and ensure that your code is compatible with your target environment.
// Whether you are targeting an older version of JavaScript, using a specific module system, or enabling strict type checking, TypeScript provides the flexibility and power    
// to help you write better code.
// Now, let’s look at how classes differ between TypeScript and JavaScript. 
// *** Interfaces  




//----------SPANISH----------// *** Comprensión de clases e interfaces

//*** Comprensión de clases e interfaces
// Ya hemos analizado brevemente las clases e interfaces en secciones anteriores.
// Profundicemos en el tema y veamos por qué estos tipos pueden ayudarnos a escribir mejor código.
// Una vez que completemos esta sección, estaremos mejor preparados para escribir código más legible y reutilizable con menos errores.

//*** Clases
// A grandes rasgos, las clases en TypeScript se parecen a las clases en JavaScript.
// Son un contenedor para un conjunto relacionado de campos y métodos que se pueden instanciar y reutilizar.
// Sin embargo, las clases en TypeScript admiten funciones adicionales de encapsulación que JavaScript no ofrece.
// Veamos un nuevo ejemplo.

//NOTA IMPORTANTE

//Crearemos muchos archivos en este proyecto, y algunos usarán el mismo nombre para algunos tipos.
// Si recibes errores sobre "identificadores duplicados", simplemente ve al otro archivo y comenta ese código.

// Crea un nuevo archivo llamado classes.ts e introduce el siguiente código:

class Person {
constructor() {}
msg: string = ““;
speak() {
console.log(this.msg);//[speak hello]
}
}
const tom = new Person();
tom.msg = "hello";
tom.speak();

// Este ejemplo tiene una clase simple llamada Person, muy similar a la que se ve en JavaScript.
// Expliquemos este código en viñetas para que sea más fácil de seguir:

// Person: Primero, le damos un nombre a la clase para que pueda reutilizarse fácilmente.
// constructor: Luego, tenemos un método llamado constructor que ayuda a crear una instancia de la clase.
// Los constructores se utilizan para inicializar los campos que pueda tener la clase y para realizar cualquier otra configuración para la instancia de la clase, como ejecutar funciones (en este caso, no hace nada).

// msg: Tenemos un solo campo llamado msg, que se invoca con la palabra clave this.

// this: La palabra clave this representa la instancia en ejecución de la clase; es decir, una instancia de objeto real de la clase Person.
// Esta es una característica de JavaScript que indica que el campo o método que se invoca pertenece únicamente a ese objeto. 
// Además, la palabra clave this solo se puede invocar dentro del objeto en ejecución, dentro de uno de sus métodos.
// speak: A continuación, hay un método llamado speak que escribe el valor msg en la consola.
// Finalmente, asignamos el valor hello al campo msg y llamamos al método speak.

// Ahora, veamos cómo se diferencian las clases entre TypeScript y JavaScript.

// *** Modificadores de acceso
// Ya mencionamos que uno de los principios fundamentales del desarrollo orientado a objetos es la encapsulación, u ocultación de información.
// Si volvemos a revisar el código, queda claro que no estamos ocultando la variable msg, ya que está expuesta y es editable fuera de la clase. 
// Esta es la accesibilidad predeterminada de todos los miembros de clase en TypeScript.
// Si no se establece un descriptor de acceso explícito, ese miembro es accesible y modificable fuera de la clase.
// Si desea este comportamiento explícitamente, puede establecer el descriptor de acceso público, pero esto no debería ser necesario, ya que, de nuevo, es el predeterminado.
// Veamos qué nos permite hacer TypeScript con los descriptores de acceso.
// Actualicemos el código de la siguiente manera:

class Person {
constructor(private msg: string) {}

speak() {
console.log(this.msg);//[speak hello]
}
}
const tom = new Person("hello");
// tom.msg = "hello";
tom.speak();

// Como pueden ver, actualizamos el constructor con un parámetro que usa una palabra clave llamada "private".
// Este método, que consiste en declarar un parámetro del constructor y añadir un modificador de acceso, realiza varias acciones en una sola línea.
// En primer lugar, "le indica al compilador que la clase tiene un campo llamado "msg" de tipo cadena que debe ser privado. 
// En segundo lugar, al añadir este campo al constructor, indicamos que cada vez que llamamos al constructor ", por ejemplo, new Person("hello"), queremos que el campo "msg" se establezca con el valor del parámetro.
// Ahora bien, ¿qué hace realmente establecer algo como "private"? Al establecer el campo como "private", lo hacemos inaccesible desde fuera de la clase. 
// Como resultado, tom.msg = "hello" deja de funcionar y genera un error. Intente eliminar los comentarios, 
//, antes de tom.msg = “hello” y compile. Debería ver este mensaje:

//Figura 2.9 – Error de clases

//console.log(tom.msg); // [Error: La propiedad 'msg' es privada y solo se puede acceder a ella dentro de la clase 'Person'.]
// Este mensaje de error indica que el campo 'msg' es privado y no se puede acceder desde fuera de la clase.
// Esta es una potente función de TypeScript que nos permite encapsular nuestro código y evitar modificaciones no deseadas en los miembros de la clase.
// También nos ayuda a aplicar el principio de encapsulación, un aspecto clave de la programación orientada a objetos.
// Mediante el uso de modificadores de acceso, podemos controlar la visibilidad y la accesibilidad de los miembros de la clase, lo que hace que nuestro código sea más robusto y fácil de mantener. 
// En este caso, usamos el modificador "private" para restringir el acceso al campo "msg", garantizando que solo se pueda modificar dentro de la propia clase.

// Esta es una potente función de TypeScript que nos permite encapsular nuestro código y evitar modificaciones no deseadas en los miembros de la clase.

// Como pueden ver, se informa que no se puede acceder a un miembro privado, "msg", desde fuera de la clase.

// Tengan en cuenta que solo aplicamos nuestro modificador a un campo, pero los modificadores de acceso se pueden aplicar a cualquier campo o método miembro.

// Sigamos modificando este código. Actualicen el tipo "Persona" con este código:

clase Persona {
private msg: string;
constructor(msg: string) {
this.msg = msg;
}
hablar() {
this.msg = "hablar " + this.msg;
console.log(this.msg);// [speak hello]
}
}
const tom = new Persona("hola");
// tom.msg = "hola";
tom.hablar();

// Como puede ver, hemos modificado la configuración e inicialización de la variable msg.
// Este código hace lo mismo que el que vimos anteriormente.
// Sin embargo, es una versión más detallada. Hasta ahora, solo hemos usado el accesor privado.
// Sin embargo, tenga en cuenta que, como se explicó en el Capítulo 1, "Comprendiendo TypeScript", existe el símbolo alternativo #, que forma parte de JavaScript, para hacer que los miembros sean privados. 
// Una vez que comencemos a crear nuestra aplicación, usaré ese símbolo la mayor parte del tiempo, a menos que exista alguna función específica que solo el accesor de estilo TypeScript pueda proporcionar.
// Ahora, aprendamos sobre el modificador de solo lectura. Este es relativamente sencillo. Hace que un campo pase a ser de solo lectura después de haber sido configurado una vez en el constructor.
// Veamos cómo se ve esto. Reemplace el código de Person con esta actualización añadiendo "readonly" a la declaración del campo msg, así:

class Person {
constructor(private readonly msg: string) {}

speak() {
this.msg = "speak " + this.msg;
console.log(this.msg);// [speak hello]
}
}
const tom = new Person("hello");
// tom.msg = "hello";
tom.speak();

// Una vez completada esta actualización, VSCode IntelliSense se queja porque, en la función speak, intentamos cambiar el valor de msg aunque ya se haya configurado una vez a través del constructor, lo cual, nuevamente, no está permitido al usar "readonly" en un campo.
// Los modificadores de acceso "private" y "readonly" no son los únicos modificadores disponibles en TypeScript.
// Existen otros tipos de modificadores de acceso. Sin embargo, tendrán más sentido si los explicamos en el contexto de la herencia más adelante.
// A medida que avancemos en este capítulo, presentaremos más características de las versiones más recientes de JavaScript, lo que nos obliga a modificar la configuración del compilador de TypeScript.
// Así que, desviémonos un poco del tema y analicemos la configuración de TypeScript.


//AI CONTENT
// *** Configuración de TypeScript // TypeScript es un superconjunto de JavaScript, lo que significa que puede compilarse en cualquier versión de JavaScript.
//  Sin embargo, por defecto, TypeScript compila a la versión más reciente de JavaScript, que podría no ser compatible con todos los navegadores o entornos.
// Para cambiar la versión de destino de JavaScript a la que compila TypeScript, puede modificar el archivo tsconfig.json en su proyecto.
// Este archivo contiene las opciones de configuración del compilador de TypeScript, incluyendo la versión de destino de JavaScript.
// Por ejemplo, para compilar en ES5, puede establecer la opción de destino en "es5" de la siguiente manera:
{
"compilerOptions": {
"target": "es5",
// otras opciones...
}
}
// Esto garantizará que TypeScript compile a una versión de JavaScript compatible con navegadores y entornos más antiguos.
// También puede establecer la opción de destino en "es6" o "es 2015" para compilar a la versión más reciente de JavaScript. 
// Esto es útil si desea aprovechar las características más recientes de JavaScript, como las funciones de flecha, las clases y los módulos.
// Sin embargo, tenga en cuenta que no todos los navegadores o entornos son compatibles con la última versión de JavaScript, por lo que podría necesitar usar un polyfill o un transpilador para garantizar la compatibilidad.
// Además de la opción de destino, también puede configurar otras opciones en el archivo tsconfig.json, como el sistema de módulos, los mapas de origen y la comprobación estricta de tipos.
// Estas opciones pueden ayudarle a personalizar el comportamiento del compilador de TypeScript y garantizar que su código sea compatible con su entorno de destino.
// Por ejemplo, para usar el sistema de módulos CommonJS, puede configurar la opción del módulo en "commonjs" de la siguiente manera:
{
"compilerOptions": {
"module": "commonjs",
// otras opciones...
}
}
// Esto garantizará que TypeScript compile su código para usar el sistema de módulos CommonJS, que se usa comúnmente en Node.js y otros entornos del lado del servidor. 
// También puedes establecer la opción sourceMap en true para generar mapas de origen para tu código TypeScript, lo que puede facilitar la depuración y el desarrollo.
// Esto garantizará que TypeScript genere mapas de origen para tu código, lo que puede ayudarte a depurarlo en el navegador u otros entornos.
// Finalmente, puedes establecer la opción strict en true para habilitar la comprobación de tipos estricta en TypeScript.
// Esto garantizará que TypeScript revise tu código en busca de errores de tipo y que sea seguro para los tipos.
// Esta es una buena práctica, ya que puede ayudarte a detectar errores en las primeras etapas del proceso de desarrollo y a garantizar que tu código sea robusto y fácil de mantener.
// Por ejemplo, para habilitar la comprobación de tipos estricta, puedes establecer la opción strict en true de la siguiente manera:


{
"compilerOptions": {
"strict": true,
// otras opciones...
}
}
// Esto garantizará que TypeScript revise tu código en busca de errores de tipo y que sea seguro para los tipos.
// Esta es una buena práctica, ya que puede ayudarte a detectar errores en las primeras etapas del proceso de desarrollo y a garantizar que tu código sea robusto y fácil de mantener.
// En resumen, TypeScript es una herramienta potente que te ayuda a escribir código seguro para los tipos y fácil de mantener.
// Al configurar las opciones del compilador de TypeScript, puedes personalizar su comportamiento y asegurar que tu código sea compatible con tu entorno de destino.
// Ya sea que uses una versión anterior de JavaScript, uses un sistema de módulos específico o actives la comprobación de tipos estricta, TypeScript te proporciona la flexibilidad y la potencia
// para ayudarte a escribir mejor código.
// Ahora, veamos cómo se diferencian las clases entre TypeScript y JavaScript.





//BOOk



//*** Configuración de TypeScript
// TypeScript se lanzó por primera vez a finales de 2012. Desde entonces, se han publicado múltiples versiones de ECMAScript, el estándar oficial de JavaScript. 
// Por lo tanto, para que los desarrolladores puedan usar las versiones de JavaScript que deseen y controlar diversas opciones de configuración relacionadas con la compilación y la configuración del proyecto, se creó tsconfig.json. 
// Este archivo de configuración es bastante completo y permite controlar muchos aspectos de la configuración y transpilación de TypeScript. Sin embargo, para nuestros propósitos, nos centraremos en algunas de las opciones más utilizadas. 
// Aprendamos sobre la configuración de TypeScript añadiendo un archivo tsconfig.json a la raíz de nuestro Capítulo 2:

// NOTA IMPORTANTE

// Como recordará del principio de este capítulo, copiamos un archivo tsconfig.json existente. 
// Las opciones que vamos a crear serán las mismas que las de ese archivo, por lo que, si lo desea, puede seguir las instrucciones sin tener que volver a crearlo.

// Primero, abra su terminal e introduzca este comando:

// npx tsc –-init

// Asegúrese de usar dos guiones antes de... init.) Este código activa el compilador de TypeScript, tsc, y crea un archivo llamado tsconfig.json en la raíz de nuestra carpeta Chap2. 
// También notarás que, a diferencia de nuestra instalación de TypeScript, No estamos usando npm. 
// Aunque ambas herramientas de línea de comandos están relacionadas, npm está diseñado para instalar dependencias y npx para ejecutarlas. 
// Además, npx permite la ejecución de algunos comandos sin tener que instalarlos globalmente. Continuemos.
// Ahora que hemos creado nuestro archivo tsconfig.json, veamos algunas de las configuraciones.
//  Empezando por la parte superior, podemos ver un campo llamado compilerOptions, y esto es exactamente lo que parece. 
// Esta sección tiene varios indicadores para configurar la compilación/transpilación y el IntelliSense en tiempo de desarrollo. Aquí hay una lista de algunos de los indicadores más utilizados:

// target: Este indicador se usa para controlar la versión de ECMAScript a la que se transpilará nuestro código. 
// Recuerde que TypeScript es una tecnología de desarrollo y, por lo tanto, debemos seleccionar la versión de ECMAScript que deseamos que se ejecute.
//  Después de TypeScript 5.x, el valor predeterminado es ES2016 (ES es la abreviatura de ECMAScript). Pero en versiones anteriores de TypeScript Versiones, era ES3. 
// Para nuestros propósitos, necesitamos la versión más reciente, así que escribe ESNext en tu archivo, así:

 “target”: “ESNext”, // Este valor indica que queremos que nuestro código se transpile a la versión más reciente de ECMAScript.

// lib: Esta configuración configurará la versión de ECMAScript y las distintas API disponibles durante el desarrollo. 
// En otras palabras, proporcionará IntelliSense, que pone a disposición las capacidades y métodos de ECMAScript que solo se encuentran en las versiones de ECMAScript y la API que seleccionemos.
//  Como puede ver, es un array y puede tomar múltiples valores. Para nuestro desarrollo, usaremos lo siguiente:

"lib": [
"ESNext",// Este valor indica que queremos usar la versión más reciente de ECMAScript.
"DOM",// Este valor indica que queremos usar la API del DOM, que es la interfaz de programación de aplicaciones que nos permite interactuar con los nodos del DOM.
"DOM.Iterable"// Este valor indica que queremos usar la API del DOM iterable, que nos permite trabajar con colecciones de nodos del DOM.
]

// Ya sabe qué es ESNext. DOM se refiere a la API que nos permite interactuar con los nodos DOM. 
// Otra forma de llamar a los nodos DOM es usar elementos HTML. DOM.Iterable nos permite trabajar con colecciones de nodos DOM, como NodeList.
// module: Esta opción nos permite controlar el tipo de formato de módulo que usaremos. 
// Un módulo es simplemente un conjunto de código encapsulado, similar a una clase, donde podemos ser selectivos sobre qué exponer al mundo exterior. 
// Un módulo siempre es un único archivo JavaScript o TypeScript.
// La forma moderna La creación de módulos utiliza la sintaxis ES6, que aprenderemos pronto. Sin embargo, existe una forma más antigua, llamada CommonJS. 
// Este formato antiguo aún es compatible, por lo que TypeScript permite elegir el formato deseado. Volveremos a usar el formato más reciente basado en ESNext. 
// Actualice la bandera del módulo de la siguiente manera:

// “module”: “ESNext”

// strict: Esta bandera fuerza más comprobaciones de tipos y una aplicación más estricta de las reglas de tipos.
// En realidad, representa varias banderas relacionadas, pero existe como una única bandera de conveniencia, ya que muchos desarrolladores desean el conjunto completo de reglas de rigurosidad. 
// Por ejemplo, la subbandera strictNullChecks.


// La bandera obliga a cualquier variable que pueda obtener un valor nulo o indefinido a establecerse explícitamente en esos tipos en su declaración de variables. 
// Esta es una bandera bastante importante, ya que evita que las variables se establezcan involuntariamente como indefinidas y potencialmente causen excepciones en tiempo de ejecución. 
// Otra subbandera importante para fines de OOP es strictPropertyInitialization. Esta bandera obliga a que los campos creados dentro de las clases se inicialicen en la declaración o en el constructor.
// Vamos a establecer la bandera estricta como verdadera para nuestro proyecto.

// Bien, ahora tenemos la capacidad de seleccionar nuestras versiones deseadas de ECMAScript y API. Entonces, sigamos aprendiendo sobre las capacidades de la clase TypeScript.

