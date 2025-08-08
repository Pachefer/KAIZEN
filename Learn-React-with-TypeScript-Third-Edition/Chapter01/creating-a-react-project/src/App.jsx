// Understanding a React component
// We will now understand the implementation of a basic React component.
// Open App.jsx, which contains the definition for the App component. We won’t fully understand
// the component at this stage, but notice it’s just a regular JavaScript function.
// Let’s focus on what the function returns – it returns JSX representing the UI. Notice that the JSX
// references HTML elements such as div, a, h1, button, and p. So, JSX can output HTML elements
// as well as other React components. The App component currently only outputs HTML elements and
// not any other React components.
// Notice the top-level JSX element in the return statement, <>, that doesn’t have a name. This is a React
// fragment, which provides a way to group elements without creating a DOM element.
// Still focusing on the JSX, notice the JavaScript code in curly brackets. For example, look at the JSX
// for the button element:
// <button onClick={() => setCount((count) => count + 1)}>
// count is {count}
// </button>
// The onClick attribute is set to an anonymous JavaScript function that calls another function called
// setCount. We will understand what the onClick attribute does later in this chapter – the key
// point for now is that JSX can include JavaScript. Notice also that the button content also contains
// a reference to a JavaScript variable called count. Referencing JavaScript functions and variables in
// JSX allows component output to be dynamic.
// Getting Started with React18
// That brings us to the end of this section. Let’s recap:
// • The entry point of a Vite React app is located in the main.jsx file, where the createRoot
// function is used to render React components
// • A React app is structured into a tree of components
// • A React component is a regular JavaScript function that returns JSX representing the dynamic UI
// Next, it is time to create a React componen

//traduce el texto en español
//Entendiendo un componente de React
//Ahora entenderemos la implementación de un componente de React básico.
//Abre App.jsx, que contiene la definición del componente App. No entenderemos el componente en este momento, pero observa que es solo una función JavaScript regular.
//Concentrémonos en lo que la función devuelve: devuelve JSX que representa la IU. Observa que el JSX hace referencia a elementos HTML como div, a, h1, button y p. Por lo tanto, JSX puede generar elementos HTML, así como otros componentes de React. El componente App actualmente solo genera elementos HTML y no otros componentes de React.
//Observa el elemento JSX de nivel superior en el return, <>, que no tiene nombre. Este es un fragmento de React, que proporciona una forma de agrupar elementos sin crear un elemento DOM.
//Aún centrándonos en el JSX, observa el código JavaScript en llaves. Por ejemplo, observa el JSX para el elemento button:



import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
