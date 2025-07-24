//Functions as types

// It may seem a bit odd, but in TypeScript, a type can also be an entire function signature. In TypeScript, this signature can also act as a type for an object’s fields or another function’s parameters.Let's take a look at an example of this. 
//Puede parecer un poco extraño, pero en TypeScript, un tipo también puede ser la firma de una función completa. En TypeScript, esta firma también puede actuar como tipo para los campos de un objeto o los parámetros de otra función. Veamos un ejemplo. 

// Create a new file called functionSignature.ts and add the following code to it:
// Cree un archivo llamado functionSignature.ts y añada el siguiente código:



type Run = (miles: number) => boolean;

let runner: Run = function (miles: number): boolean {
    if (miles > 10) {
        return true;
    }
    return false;
}
// This call is passed directly into console.log, which writes out the result of the function call. 
// Compile and run this code and you should see this:
// Esta llamada se pasa directamente a console.log, que escribe el resultado de la llamada a la función. 
// Compila y ejecuta este código y verás lo siguiente:
console.log(runner(9));//[false]
console.log(runner(11));//[true]


//Function signature
// A function signature is a way to define the types of parameters and return values for a function
// La firma de una función es una forma de definir los tipos de parámetros y valores de retorno para una función.

// It helps TypeScript understand how to use the function correctly and ensures type safety
// Ayuda a TypeScript a entender cómo usar la función correctamente y garantiza la seguridad de tipos


// The first line shows us a function type that we will be using in this code. The Run type alias is only there to make it easier to reuse the long function signature. 
// La primera línea muestra el tipo de función que usaremos en este código. El alias de tipo "Run" solo sirve para facilitar la reutilización de la firma larga de la función.

// The actual function type is (miles: number) => boolean. This looks odd, but it’s just TypeScript’s syntax for creating types from functions. 
// El tipo de función real es (miles: number) => boolean. Parece extraño, pero es la sintaxis de TypeScript para crear tipos a partir de funciones.

// So, the only things needed then are the parentheses to indicate parameters, the => symbol, which indicates that this is a function, and then the return type.
// Por lo tanto, solo se necesitan los paréntesis para indicar los parámetros, el símbolo =>, que indica que se trata de una función, y el tipo de retorno.

// In the code after the function definition line, you have the declaration of the runner variable, which is of the Run type—our function type. 
// En el código, después de la línea de definición de la función, se encuentra la declaración de la variable "runner", que es del tipo "Run", nuestro tipo de función.

// This function simply checks whether the person has run more than 10 miles and returns true if they have and false if they have not.
// Esta función simplemente comprueba si la persona ha corrido más de 10 millas y devuelve "true" si lo ha hecho y "false" si no.



