


// This code demonstrates the use of the never type in TypeScript.
// It shows how to define a function that never returns and how to use it in a type
// It uses TypeScript's type system to ensure type safety and indicate intent in the code.
// The code is concise, type-safe, and easy to extend with new functions that may never return.
// This code is a test for the never type in TypeScript

// Este código demuestra el uso del tipo "never" en TypeScript.
// Muestra cómo definir una función que nunca retorna y cómo usarla en un tipo.
// Utiliza el sistema de tipos de TypeScript para garantizar la seguridad de tipos e indicar la intención en el código.
// El código es conciso, seguro para tipos y fácil de extender con nuevas funciones que podrían no retornarse nunca.
// Este código es una prueba del tipo "never" en TypeScript.


//The never type

//A type called never seems quite strange at first glance, so let’s try and understand it. 
// El tipo never parece extraño a primera vista, así que intentemos comprenderlo.

// The never type is used as a return type for a function that never returns (i.e., does not complete), or a variable that is not set to anything, not even null.
// El tipo never se utiliza como tipo de retorno para una función que nunca retorna (es decir, no se completa) o una variable que no tiene ningún valor asignado, ni siquiera null.

// At first, this sounds like the void type. However, they are quite different. 
// En un principio, esto suena como el tipo void. Sin embargo, son bastante diferentes. 

// In void, a function does return, in the completed sense of the word; it just does not return any value (it returns undefined, which is effectively no value). 
// En void, una función retorna, en el sentido completo de la palabra; simplemente no devuelve ningún valor (devuelve undefined, que en realidad no tiene ningún valor).

// In the case of never, the function does not finish at all. 
// En el caso de never, la función no termina en absoluto.

// Crea un archivo llamado never.ts y añade el siguiente código:

function oldEnough(age: number): never | boolean {
    if (age > 59) {
        throw Error("Too old!");//[Error: Too old!]
    }
    if (age <= 18) {
        return false;//[false]
    }
    return true;//[true]
}

//As you can see, this function returns a union type that is either never or boolean.
//como puedes ver, esta función devuelve un tipo de unión que puede ser never o booleano. 
// Now, we could have only indicated boolean, and the code would still work. 
// Sin embargo, en esta función, generamos un error si la persona es mayor de cierta edad, lo que indica que nunca se completará la función y, por lo tanto, el tipo de retorno es never.
// However, in this function, we are throwing an error if the person is over a certain age, indicating that[…]”
//como sea, en esta función, lanzamos un error si la persona es mayor de cierta edad, lo que indica que nunca se completará la función y, por lo tanto, el tipo de retorno es never.



// *El tipo never
// Un tipo llamado never parece extraño a primera vista, así que intentemos comprenderlo.
// El tipo never se utiliza como tipo de retorno para una función que nunca retorna (es decir, no se completa) o una variable que no tiene ningún valor asignado, ni siquiera null.
// A primera vista, esto suena similar al tipo void. Sin embargo, son bastante diferentes. 
// En void, una función retorna, en el sentido completo de la palabra; simplemente no devuelve ningún valor (devuelve undefined, que en realidad no tiene ningún valor).
// En el caso de never, la función no termina. 
// Esto puede parecer totalmente inútil, pero en realidad es bastante eficaz para indicar intención. Veamos un ejemplo.
// Crea un archivo llamado never.ts y añade el siguiente código:

// function oldEnough(age: number): never | boolean {
// if (age > 59) {
// throw Error("Too old!");// [Error: Too old!]
// }
// if (age <= 18) {
// return false;//[false]
// }
// return true;// [true]
// }

//Como puedes ver, esta función devuelve un tipo de unión que puede ser never o booleano.
// Podríamos haber indicado solo booleano y el código seguiría funcionando.
// Sin embargo, en esta función, generamos un error si la persona es mayor de cierta edad, lo que indica que […]


console.log(oldEnough(20));//[true]
console.log(oldEnough(15));//[false]
//console.log(oldEnough(60));//[Error: Too old!]  

//*AI
// As you can see, this function returns a union type that is either never or boolean.
// Now, we could have only indicated boolean, and the code would still work.
// Sin embargo, en esta función, generamos un error si la persona es mayor de cierta edad, lo que indica que nunca se completará la función y, por lo tanto, el tipo de retorno es never.
// However, in this function, we are throwing an error if the person is over a certain age, indicating that the function will never complete, and thus the return type is never
// If we had only indicated boolean, the code would still work, but it would not convey the intent that this function can never return a value if the age is over 59.
// Si solo hubiéramos indicado booleano, el código seguiría funcionando, pero no transmitiría la intención de que esta función nunca puede devolver un valor si la edad es superior a 59.
// If you compile and run this code, you will see the following output:
// Si compilas y ejecutas este código, verás la siguiente salida:
// [true]
// [false]
// [Error: Too old!]
// If you uncomment the last line, it will throw an error when you try to run it, indicating that the function does not complete for ages over 59.
// Si descomentamos la última línea, se generará un error al intentar ejecutarlo, indicando que la función no se completa para edades superiores a 59.
// This is a useful way to indicate intent in your code, especially when dealing with functions that can throw errors or have conditions that prevent them from returning a value.
// This is a useful way to indicate intent in your code, especially when dealing with functions that can throw errors or have conditions that prevent them from returning a value.
// Este es un modo útil de indicar la intención en tu código, especialmente cuando se trata de funciones que pueden lanzar errores o tener condiciones que impiden que devuelvan un valor.
// Now, if we use functions as type parameters, it looks a bit different. Let’s take a look at that in the next section.
// Ahora, si usamos funciones como parámetros de tipo, el resultado es un poco diferente. Veamos esto en la siguiente sección.