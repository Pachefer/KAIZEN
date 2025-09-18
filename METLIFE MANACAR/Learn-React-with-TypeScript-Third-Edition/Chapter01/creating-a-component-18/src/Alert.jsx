// The component renders the following items:
//  A warning icon (note that this is a warning emoji)
//  A title: Oh no!
//  A message: Something went wrong
// Note
// The role and aria-label attributes have been added to the span element containing the
// warning icon to help screen readers understand that this is an image with a title of warning.
// For more information on the img role, see https://developer.mozilla.org/en-
// US/docs/Web/Accessibility/ARIA/Roles/img_role.
// For more information on the aria-label attribute, see https://developer.mozilla.
// org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label.
// 3. Alternatively, a React component can be implemented using arrow function syntax. The following
// code snippet is an arrow syntax version of the Alert component:
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

//El componente renderiza los siguientes elementos:
//• Un icono de advertencia (observe que este es un emoji de advertencia)
//• Un título: ¡Oh no!
//• Un mensaje: Algo salió mal
//Nota
//Los atributos role y aria-label se han agregado al elemento span que contiene el icono de advertencia para ayudar a los lectores de pantalla a entender que este es una imagen con un título de advertencia.
//Para más información sobre el rol img, consulte https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role.
//Para más información sobre el atributo aria-label, consulte https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label.
//Alternativamente, un componente React se puede implementar usando la sintaxis de función flecha. El siguiente fragmento de código es una versión de la sintaxis de flecha del componente Alert:

// Note
// There aren’t any significant differences between arrow functions and normal functions in
// the context of React function components. So, it is down to personal preference which one
// you choose. This book generally uses regular function syntax because it has fewer characters
// to type; however, if you wish, you can find more information on JavaScript arrow functions
// here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/
// Reference/Functions/Arrow_functions.
// Congratulations, you have created your first React component!
// There is a linting error in the file we have just created, highlighted by ESLint. The error is that the
// Alert component is unused. Ignore the error for now – we’ll resolve it later in this chapter.
// Figure 1.11 – ESLint error
// If the app was running, the Alert component wouldn’t appear in the browser yet. This is because it
// hasn’t been added to the React component tree yet. We’ll do this in the next section.
// Adding Alert to the App component
// Going back to the Alert component in our project, we will reference Alert in the App component.
// We will also remove the existing content in the App component so that it only renders the alert. To
// do this, carry out the following steps:
// 1. First, we need to export the Alert component so that it is available in other files. Open
// Alert.jsx and add the export keyword before the Alert function:
// export function Alert() {
// ...
// }

//No hay diferencias significativas entre las funciones flecha y las funciones normales en el contexto de los componentes de función de React. Por lo tanto, depende de la preferencia personal cuál elegir. Este libro generalmente usa la sintaxis de función regular porque tiene menos caracteres para escribir; sin embargo, si lo deseas, puedes encontrar más información sobre las funciones flecha de JavaScript aquí: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions.
//Felicidades, has creado tu primer componente React!
//Hay un error de linting en el archivo que acabamos de crear, resaltado por ESLint. El error es que el componente Alert no se está usando. Ignora el error por ahora: lo resolveremos más adelante en este capítulo.
//Figure 1.11 – ESLint error
//Si la aplicación estaba en ejecución, el componente Alert no aparecería en el navegador todavía. Esto es porque aún no se ha agregado al árbol de componentes de React. Lo haremos en la siguiente sección.
//Adding Alert to the App component 
//Volviendo al componente Alert en nuestro proyecto, referenciamos Alert en el componente App. También eliminaremos el contenido existente en el componente App para que solo renderice la alerta. Para hacer esto, realiza los siguientes pasos:
//1. Primero, necesitamos exportar el componente Alert para que esté disponible en otros archivos. Abre Alert.jsx y agrega la palabra clave export antes de la función Alert:
//export function Alert() {
//...
//}
//2. Ahora, podemos importar Alert en el archivo App.jsx. Abre App.jsx y agrega la siguiente declaración de importación al inicio del archivo:
//import Alert from './Alert'
//3. Elimina las otras declaraciones de importación para que la alerta esté en la única importación.
//4. Ahora, podemos referenciar Alert en el componente App.jsx. Reemplaza la definición del componente App con la siguiente para que solo renderice la alerta:
//import Alert from './Alert'
//export default function App() {
//return <Alert />;
//}
//5. Ejecuta la aplicación en modo de desarrollo ejecutando el comando npm run dev en la terminal y abriendo la URL de la aplicación en un navegador. El componente ahora se mostrará en el navegador en la página:
//¡Bien! Si has notado que el componente Alert no está estilizado bien, no te preocupes: aprenderemos a estilizarlo en el Capítulo 4, Aproximaciones al estilo de los frontends de React.
//Aquí está un resumen de esta sección:
//• Los nombres de los componentes React comienzan con una letra mayúscula, y el nombre del archivo debe tener una extensión .js o .jsx.
//• Creamos un componente Alert que muestra un icono de advertencia, un título y un mensaje.
//• Generalmente, un componente React está estructurado en su propio archivo y por lo tanto necesita ser exportado antes de ser referenciado en otro componente React. Exportamos el componente Alert y lo importamos y usamos dentro del componente App.
//A continuación, aprenderemos a hacer que el componente Alert sea un poco más flexible.

//*************** */
export function Alert() {
  return (
    <div>
      <div>
        <span role="img" aria-label="Warning">
          ⚠️
        </span>
        <span>Oh no!</span>
      </div>
      <div>Something went wrong</div>
    </div>
  );
}
