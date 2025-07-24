// Function return types
// For completeness’ sake, I wanted to show one example of a function return declaration. It’s quite similar to a typical variable declaration. 
// Create a new file called functionReturn.ts and add this code to it:
//Para completar, quería mostrar un ejemplo de declaración de retorno de función. Es bastante similar a la declaración típica de una variable.
//Crea un nuevo archivo llamado functionReturn.ts y añade este código:
function runMore(distance: number): number {
    return distance + 10;
}
console.log(runMore(20));//[30]

// The runMore function takes a parameter called distance of type number and returns a number. 
// The parameter declaration is just like any variable declaration, but the function return comes after the parentheses and indicates what type is returned by the function. 
// If you compile and run this function, it will, of course, display 30 in the terminal.
// If a function returns nothing, then you can either not declare any type for the return or you can declare void to be more explicit.
//  Let’s look at an example of returning void.
//  Comment out the runMore function and console log, and then compile and run this code:

// La función runMore toma un parámetro llamado distancia de tipo número y devuelve un número. 
// La declaración del parámetro es igual que la de cualquier variable, pero el valor de retorno de la función va después del paréntesis e indica el tipo de retorno de la función. 
// Si compila y ejecuta esta función, mostrará, por supuesto, 30 en la terminal.
// Si una función no devuelve nada, puede omitir cualquier tipo de retorno o declarar void para ser más explícito.
// Veamos un ejemplo de retorno void.
// Comente la función runMore y el registro de la consola, y luego compile y ejecute este código:

function eat(calories: number) {
    console.log("I ate " + calories + " calories"); //[I ate 100 calories]
}
function sleepIn(hours: number): void {
    console.log("I slept " + hours + " hours"); // [I slept 10 hours]
    // The two functions both return void, but only the sleepIn function is explicit about that. 
    // Here’s a quick example of how you can use these functions:
    // Las dos funciones devuelven void, pero solo la función sleepIn lo explica explícitamente.
// Aquí tienes un ejemplo rápido de cómo puedes usar estas funciones:
    // The first function, eat, does not declare a return type, so it defaults to undefined. 
    // The second function, sleepIn, explicitly declares that it returns void, which means it does not return any value.
// La primera función, eat, no declara un tipo de retorno, por lo que por defecto es undefined.
// La segunda función, sleepIn, declara explícitamente que devuelve void, lo que significa que no devuelve ningún valor.
    // The two functions both return void, but only the sleepIn function is explicit about that.
// Las dos funciones devuelven void, pero solo la función sleepIn lo explica explícitamente.
    // Here’s how you can call these functions and see their behavior:
    // Aquí tienes cómo puedes llamar a estas funciones y ver su comportamiento:
   
   
let ate = eat(100);
console.log(ate);
let slept = sleepIn(10);
console.log(slept);
// As you can see, their internal console.log statements do run and display messages.
// However, the two variables, ate and slept, which accept the function returns, are both undefined—since that is the value of something without a value in JavaScript.
// So, the function return type declaration is quite similar to variable declarations.
// Now, if we use functions as type parameters,
// it looks a bit different. Let’s take a look at that in the next section.

// Como puedes ver, sus declaraciones internas de console.log se ejecutan y muestran mensajes.
// Sin embargo, las dos variables, ate y slept, que aceptan los retornos de la función, son ambas undefined, ya que ese es el valor de algo sin valor en JavaScript.
// Por lo tanto, la declaración del tipo de retorno de una función es bastante similar a la de las variables.
// Ahora bien, si usamos funciones como parámetros de tipo,
// el resultado es un poco diferente. Veamos esto en la siguiente sección.

// The two functions both return void, but only the sleepIn function is explicit about that. Here’s[…]”

//RESULT



//As you can see, their internal console.log statements do run and display messages. 
// However, the two variables, ate and slept, which accept the function returns, are both undefined—since that is the value of something without a value in JavaScript.
// So, the function return type declaration is quite similar to variable declarations.Now, if we use functions as type parameters, it looks a bit different. 
// Let’s take a look at that in the next section.

//Como puede ver, sus sentencias internas console.log se ejecutan y muestran mensajes.
// Sin embargo, las dos variables, ate y slept, que aceptan los retornos de la función, no están definidas, ya que ese es el valor de algo sin valor en JavaScript.
// Por lo tanto, la declaración del tipo de retorno de una función es bastante similar a la de las variables. Ahora bien, si usamos funciones como parámetros de tipo, el resultado es un poco diferente.
// Veamos esto en la siguiente sección.



