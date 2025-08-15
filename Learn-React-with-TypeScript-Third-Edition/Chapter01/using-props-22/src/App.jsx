Understanding props

The props parameter is an optional parameter that is passed into a React component. This parameter
is an object containing the properties of our choice, allowing a parent component to pass data. The
following code snippet shows a props parameter in a ContactDetails component:
//El parámetro props es un parámetro opcional que se pasa a un componente React. Este parámetro es un objeto que contiene las propiedades de nuestra elección, permitiendo que un componente padre pase datos. El siguiente fragmento de código muestra un parámetro props en un componente ContactDetails:

function ContactDetails(props) {
console.log(props.name);
console.log(props.email);
...
}

The props parameter contains the name and email properties in the preceding code snippet.
//El parámetro props contiene las propiedades name y email en el fragmento de código anterior.
Note
The parameter doesn’t have to be named props, but it is common practice.
Using props 23
//Los props se pasan a un componente en JSX como atributos. Los nombres de los props deben coincidir con lo definido en el componente. Aquí hay un ejemplo de cómo pasar props al componente ContactDetails anterior:
Props are passed into a component in JSX as attributes. The prop names must match what is defined in
the component. Here is an example of passing props into the preceding ContactDetails component:
<ContactDetails name=”Fred” email=”fred@somewhere.com” />
So, props make the component output flexible. Consumers of the component can pass appropriate
props into the component to get the desired output.
Next, we will add some props to the Alert component we have been working on.

import { Alert } from './Alert';

function App() {
  return (
    <Alert type="information" heading="Success">
      Everything is really good!
    </Alert>
  );
}

export default App;
