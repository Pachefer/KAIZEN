// Getting Started with React18
// That brings us to the end of this section. Let’s recap:
// • The entry point of a Vite React app is located in the main.jsx file, where the createRoot
// function is used to render React components
// • A React app is structured into a tree of components
// • A React component is a regular JavaScript function that returns JSX representing the dynamic UI
// Next, it is time to create a React component.
// //Eso nos lleva al final de esta sección. Vamos a recapitular:
// //• El punto de entrada de una aplicación React Vite está en el archivo main.jsx, donde la función createRoot se utiliza para renderizar componentes React
// //• Una aplicación React está estructurada en un árbol de componentes
// //• Un componente React es una función JavaScript regular que devuelve JSX que representa la IU dinámica
// //A continuación, es hora de crear un componente React.

// Creating a component
// In this section, we will create a React component and reference this within the App component.
// Creating a basic Alert component
// We are going to create a component that displays an alert, which we will simply call Alert. It will
// consist of an icon, a heading, and a message.
// //Creando un componente
// //En esta sección, crearemos un componente React y lo referenciaremos dentro del componente App.
// //Creando un componente básico Alert
// Note
// A React component name must start with a capital letter. If a component name starts with a
// lowercase letter, it is treated as a DOM element and won’t render properly.
// Carry out the following steps to create the component in the project:
// //Un nombre de componente React debe comenzar con una letra mayúscula. Si un nombre de componente comienza con una letra minúscula, se trata como un elemento DOM y no se renderizará correctamente.
// //Realiza los siguientes pasos para crear el componente en el proyecto:
// 1. Create a new file in the src folder called Alert.jsx.
// Note
// The filename for component files isn’t important to React or the React transpiler. It is common
// practice to use the same name as the component, either in Pascal or snake case. However, the file
// extension must be .js or .jsx for React transpilers to recognize these as React components.
// //El nombre de archivo para los archivos de componentes no es importante para React o el compilador de React. Es una práctica común usar el mismo nombre que el componente, ya sea en Pascal o snake case. Sin embargo, la extensión de archivo debe ser .js o .jsx para que los compiladores de React reconozcan estos como componentes React.
// 2. Open the Alert.jsx file and enter the following code in it:
// //2. Abre el archivo Alert.jsx y escribe el siguiente código en él:
// function Alert() {
// return (
// <div>
// <div>
// <span role=”img” aria-label=”Warning”>
// ⚠</span>
// <span>Oh no!</span>
// </div>
// Creating a component 19
// <div>Something went wrong</div>
// </div>
// );
// }
// Remember that the code snippets are available online to copy. The link to the preceding snippet
// can be found at https://github.com/PacktPublishing/Learn-React-with-
// TypeScript-Third-Edition/tree/main/Chapter01/creating-a-component.
// //Recuerda que los fragmentos de código están disponibles en línea para copiar. El enlace al fragmento anterior se puede encontrar en https://github.com/PacktPublishing/Learn-React-with-TypeScript-Third-Edition/tree/main/Chapter01/creating-a-component.
// The component renders the following items:
//  A warning icon (note that this is a warning emoji)
//  A title: Oh no!
//  A message: Something went wrong
// //El componente renderiza los siguientes elementos:
// //• Un icono de advertencia (observe que este es un emoji de advertencia)
// //• Un título: ¡Oh no!
// //• Un mensaje: Algo salió mal
// Note
// The role and aria-label attributes have been added to the span element containing the
// warning icon to help screen readers understand that this is an image with a title of warning.
// For more information on the img role, see https://developer.mozilla.org/en-
// US/docs/Web/Accessibility/ARIA/Roles/img_role.
// For more information on the aria-label attribute, see https://developer.mozilla.
// org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label.
// //El atributo role y aria-label se han agregado al elemento span que contiene el icono de advertencia para ayudar a los lectores de pantalla a entender que este es un imagen con un título de advertencia.
// //Para más información sobre el rol img, consulte https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role.
// //Para más información sobre el atributo aria-label, consulte https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label.
// 3. Alternatively, a React component can be implemented using arrow function syntax. The following
// code snippet is an arrow syntax version of the Alert component:
// //Alternativamente, un componente React se puede implementar usando la sintaxis de función flecha. El siguiente fragmento de código es una versión de la sintaxis de flecha del componente Alert:
// const Alert = () => {
// return (
// <div>
// <div>
// <span role=”img” aria-label=”Warning”>
// ⚠
// </span>
// <span>Oh no!</span>
// </div>
// <div>Something went wrong</div>
// </div>
// );
// };

// Getting Started with React20
// Note
// There aren’t any significant differences between arrow functions and normal functions in
// the context of React function components. So, it is down to personal preference which one
// you choose. This book generally uses regular function syntax because it has fewer characters
// to type; however, if you wish, you can find more information on JavaScript arrow functions
// here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/
// Reference/Functions/Arrow_functions.
// //No hay diferencias significativas entre las funciones flecha y las funciones normales en el contexto de los componentes de función de React. Por lo tanto, depende de la preferencia personal cuál elegir. Este libro generalmente usa la sintaxis de función regular porque tiene menos caracteres para escribir; sin embargo, si lo deseas, puedes encontrar más información sobre las funciones flecha de JavaScript aquí: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions.

// Congratulations, you have created your first React component!
// There is a linting error in the file we have just created, highlighted by ESLint. The error is that the
// Alert component is unused. Ignore the error for now – we’ll resolve it later in this chapter.
// //Felicidades, has creado tu primer componente React!
// //Hay un error de linting en el archivo que acabamos de crear, resaltado por ESLint. El error es que el componente Alert no se está usando. Ignora el error por ahora: lo resolveremos más adelante en este capítulo.
// Figure 1.11 – ESLint error
// If the app was running, the Alert component wouldn’t appear in the browser yet. This is because it
// hasn’t been added to the React component tree yet. We’ll do this in the next section.
// //Si la aplicación estaba en ejecución, el componente Alert no aparecería en el navegador todavía. Esto es porque aún no se ha agregado al árbol de componentes de React. Lo haremos en la siguiente sección.
// Adding Alert to the App component
// //traduce el texto en español
// //Agregando Alert al componente App
// Going back to the Alert component in our project, we will reference Alert in the App component.
// We will also remove the existing content in the App component so that it only renders the alert. To
// do this, carry out the following steps:
// //Volviendo al componente Alert en nuestro proyecto, referenciamos Alert en el componente App. También eliminaremos el contenido existente en el componente App para que solo renderice la alerta. Para hacer esto, realiza los siguientes pasos:
// 1. First, we need to export the Alert component so that it is available in other files. Open
// Alert.jsx and add the export keyword before the Alert function:
// //Primero, necesitamos exportar el componente Alert para que esté disponible en otros archivos. Abre Alert.jsx y agrega la palabra clave export antes de la función Alert:
// export function Alert() {
// ...
// }
// Creating a component 21
// Note
// It is common practice to have each React component in a separate file. This helps prevent files
// from becoming too large and helps the readability of the code base.
// //Es común tener cada componente React en un archivo separado. Esto ayuda a evitar que los archivos se tornen demasiado grandes y ayuda a la legibilidad del código base.
// Notice that the ESLint error is now resolved because Alert can now potentially be used by
// other files.
// //Observa que el error de ESLint ahora se ha resuelto porque Alert ahora puede potencialmente ser utilizado por otros archivos.
// 2. Now, we can import Alert into the App.jsx file. Open App.jsx and add the following
// import statement at the top of the file:
// //Ahora, podemos importar Alert en el archivo App.jsx. Abre App.jsx y agrega la siguiente declaración de importación al inicio del archivo:
// import { Alert } from ‘./Alert’;
// 3. Remove the other import statements so that the alert is in the only import.
// //3. Elimina las otras declaraciones de importación para que la alerta esté en la única importación.
// 4. We can now reference Alert in the App component’s JSX. Replace the App component
// definition with the following so that it only renders the alert:
// //4. Ahora, podemos referenciar Alert en el componente App.jsx. Reemplaza la definición del componente App con la siguiente para que solo renderice la alerta:
// function App() {
// return <Alert />;
// }
// 5. Run the app in development mode by executing the npm run dev command in the terminal
// and opening the app’s URL in a browser. The component will now display in the browser on
// the page:
// //5. Ejecuta la aplicación en modo de desarrollo ejecutando el comando npm run dev en la terminal y abriendo la URL de la aplicación en un navegador. El componente ahora se mostrará en el navegador en la página:
// Figure 1.12 – Alert component in the app
// Getting Started with React22
// Nice! If you have noticed that the Alert component isn’t styled nicely, don’t worry – we will learn
// how to style it in Chapter 4, Approaches to Styling React Frontends.
// //¡Bien! Si has notado que el componente Alert no está estilizado bien, no te preocupes: aprenderemos a estilizarlo en el Capítulo 4, Aproximaciones al estilo de los frontends de React.
// //Aquí está un resumen de esta sección:
// //• Los nombres de los componentes React comienzan con una letra mayúscula, y el nombre del archivo debe tener una extensión .js o .jsx.
// //• Creamos un componente Alert que muestra un icono de advertencia, un título y un mensaje.
// //• Generalmente, un componente React está estructurado en su propio archivo y por lo tanto necesita ser exportado antes de ser referenciado en otro componente React. Exportamos el componente Alert y lo importamos y usamos dentro del componente App.
// //A continuación, aprenderemos a hacer que el componente Alert sea un poco más flexible.
// Here’s a recap of this section:
// • React component names start with an uppercase letter, and the filename should have a .js
// or .jsx extension.
// //• Los nombres de los componentes React comienzan con una letra mayúscula, y el nombre del archivo debe tener una extensión .js o .jsx.
// • We created an Alert component that displays a warning icon, a title, and a message.
// • Generally, a React component is structured in its own file and so needs to be exported before
// being referenced in another React component. We exported the Alert component and
// imported and used it within the App component.
// //• Generalmente, un componente React está estructurado en su propio archivo y por lo tanto necesita ser exportado antes de ser referenciado en otro componente React. Exportamos el componente Alert y lo importamos y usamos dentro del componente App.
// Next, we will learn how to make the Alert component a little more flexible.
// //A continuación, aprenderemos a hacer que el componente Alert sea un poco más flexible.






//------

import { Alert } from './Alert';

function App() {
  return <Alert />;
}

export default App;
