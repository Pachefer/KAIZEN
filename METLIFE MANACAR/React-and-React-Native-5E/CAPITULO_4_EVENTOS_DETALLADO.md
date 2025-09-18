# 📖 CAPÍTULO 4: MANEJO DE EVENTOS EN REACT
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Qué son los eventos** y cómo funcionan en React
- ✅ **Event handlers inline** vs funciones declaradas
- ✅ **Sintaxis de eventos** en JSX (camelCase)
- ✅ **Objeto de evento** y sus propiedades
- ✅ **Prevención de comportamiento por defecto**
- ✅ **Event bubbling** y event capturing
- ✅ **Manejo de múltiples eventos** en un componente

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ SON LOS EVENTOS?

### **Definición:**
Los eventos son **acciones o interacciones** que ocurren en el navegador (clicks, teclas, formularios, etc.). En React, los eventos se manejan de manera similar a HTML, pero con algunas diferencias importantes en la sintaxis y comportamiento.

### **Diferencias Clave:**
```javascript
// 🎯 HTML Tradicional
<button onclick="handleClick()">Click me</button>

// ✅ React JSX
<button onClick={handleClick}>Click me</button>
```

### **Características de Eventos en React:**
1. **Sintaxis camelCase**: `onClick`, `onChange`, `onSubmit`
2. **Función como prop**: Se pasa la función, no un string
3. **Event pooling**: React reutiliza objetos de evento
4. **Synthetic events**: React envuelve eventos nativos del navegador

---

## 💻 ANÁLISIS DEL CÓDIGO: EVENT HANDLERS INLINE

### **Archivo: `src/MyButton.jsx`**

```jsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Definición del componente funcional
// Recibe props como parámetro (incluyendo children)
function MyButton(props) {
  // 🚀 Retorno del JSX con event handler inline
  return (
    // 📦 Elemento button con event handler onClick
    <button onClick={(e) => console.log("clicked", e)}>
      {/* 👶 Children prop: contenido que se pasa entre las etiquetas */}
      {props.children}
    </button>
  );
}

// 📤 Exportación del componente
export default MyButton;
```

### **Archivo: `src/main.jsx`**

```jsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación del módulo de renderizado de React
import * as ReactDOM from "react-dom/client";
// 🎯 Importación del componente personalizado
import MyButton from "./MyButton";

// 🎯 Creación del punto de entrada de la aplicación
const root = ReactDOM.createRoot(document.getElementById("root"));

// 🚀 Renderizado del componente con children
root.render(<MyButton>Click Me</MyButton>);
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis del Event Handler:**

#### **Línea 4: Event Handler Inline**
```jsx
<button onClick={(e) => console.log("clicked", e)}>
```
- **`onClick`**: Prop de evento en camelCase (diferente de HTML `onclick`)
- **`(e) =>`**: Arrow function que recibe el objeto de evento
- **`console.log("clicked", e)`**: Función que se ejecuta al hacer click
- **`e`**: Objeto de evento sintético de React

#### **Línea 5: Children Prop**
```jsx
{props.children}
```
- **`props.children`**: Contenido que se pasa entre las etiquetas del componente
- **`"Click Me"`**: Texto que se renderiza dentro del botón

### **Análisis del Uso del Componente:**

#### **Línea 5: Renderizado con Children**
```jsx
root.render(<MyButton>Click Me</MyButton>);
```
- **`<MyButton>`**: Uso del componente
- **`Click Me`**: Children que se pasa al componente
- **`</MyButton>`**: Cierre del componente

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Renderizado y Event Handler**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MyButton from './MyButton';

describe('MyButton', () => {
  it('debe renderizar el children correctamente', () => {
    // Arrange: Preparar el componente con children
    const buttonText = 'Haz Click Aquí';
    
    // Act: Renderizar el componente
    render(<MyButton>{buttonText}</MyButton>);
    
    // Assert: Verificar que el texto se renderiza
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it('debe ejecutar el event handler al hacer click', () => {
    // Arrange: Mock de console.log
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Act: Renderizar y hacer click
    render(<MyButton>Click Me</MyButton>);
    fireEvent.click(screen.getByText('Click Me'));
    
    // Assert: Verificar que console.log se llamó
    expect(consoleSpy).toHaveBeenCalledWith('clicked', expect.any(Object));
    
    // Cleanup: Restaurar console.log
    consoleSpy.mockRestore();
  });

  it('debe ser un elemento button', () => {
    render(<MyButton>Click Me</MyButton>);
    
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });
});
```

### **Test 2: Verificación de Event Object**
```javascript
it('debe recibir el objeto de evento correcto', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  
  render(<MyButton>Click Me</MyButton>);
  fireEvent.click(screen.getByText('Click Me'));
  
  // Verificar que el segundo argumento es un objeto de evento
  const eventCall = consoleSpy.mock.calls[0];
  expect(eventCall[1]).toBeInstanceOf(Object);
  expect(eventCall[1]).toHaveProperty('type', 'click');
  
  consoleSpy.mockRestore();
});
```

### **Test 3: Verificación de Múltiples Clicks**
```javascript
it('debe manejar múltiples clicks correctamente', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  
  render(<MyButton>Click Me</MyButton>);
  const button = screen.getByText('Click Me');
  
  // Hacer múltiples clicks
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  
  // Verificar que se llamó 3 veces
  expect(consoleSpy).toHaveBeenCalledTimes(3);
  
  consoleSpy.mockRestore();
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en el Navegador:**
```html
<!-- HTML generado por React -->
<div id="root">
  <button>Click Me</button>
</div>
```

### **Comportamiento Interactivo:**
1. **Visual**: Se muestra un botón con el texto "Click Me"
2. **Click**: Al hacer click, se ejecuta `console.log("clicked", e)`
3. **Console**: Se imprime en la consola del navegador:
   ```
   clicked Event {type: "click", target: button, ...}
   ```

### **Análisis del Event Object:**
```javascript
// Objeto de evento que se recibe en el handler
{
  type: "click",
  target: <button>,
  currentTarget: <button>,
  bubbles: true,
  cancelable: true,
  defaultPrevented: false,
  // ... más propiedades
}
```

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Event Handler con Función Declarada**
```jsx
function MyButton(props) {
  // 🎯 Función declarada fuera del JSX
  const handleClick = (e) => {
    console.log("Botón clickeado:", e.target.textContent);
    alert("¡Botón clickeado!");
  };

  return (
    <button onClick={handleClick}>
      {props.children}
    </button>
  );
}
```

### **Ejercicio 2: Event Handler con Estado**
```jsx
import { useState } from 'react';

function CounterButton() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

### **Ejercicio 3: Múltiples Event Handlers**
```jsx
function InteractiveButton() {
  const handleClick = (e) => {
    console.log("Click event:", e);
  };

  const handleMouseEnter = (e) => {
    console.log("Mouse enter:", e);
  };

  const handleMouseLeave = (e) => {
    console.log("Mouse leave:", e);
  };

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Interactive Button
    </button>
  );
}
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Diferencias Clave con HTML:**

| **Aspecto** | **HTML** | **React** |
|-------------|----------|-----------|
| **Sintaxis** | `onclick="func()"` | `onClick={func}` |
| **Función** | String | Función real |
| **Evento** | Evento nativo | Synthetic event |
| **Binding** | Automático | Manual |

### **Eventos Comunes en React:**
```jsx
// 🎯 Eventos de Mouse
onClick, onDoubleClick, onMouseEnter, onMouseLeave

// 🎯 Eventos de Teclado
onKeyDown, onKeyUp, onKeyPress

// 🎯 Eventos de Formulario
onChange, onSubmit, onFocus, onBlur

// 🎯 Eventos de Drag & Drop
onDragStart, onDragOver, onDrop

// 🎯 Eventos de Touch
onTouchStart, onTouchMove, onTouchEnd
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```jsx
// ✅ Función declarada para handlers complejos
const handleClick = (e) => {
  // Lógica compleja aquí
  console.log("Click handled");
};

// ✅ Arrow functions para handlers simples
<button onClick={() => setCount(count + 1)}>

// ✅ Prevención de comportamiento por defecto
const handleSubmit = (e) => {
  e.preventDefault();
  // Lógica del formulario
};

// ✅ Acceso a datos del evento
const handleChange = (e) => {
  console.log("Nuevo valor:", e.target.value);
};
```

### **❌ Evitar:**
```jsx
// ❌ Llamar función directamente
<button onClick={handleClick()}>

// ❌ Función inline muy compleja
<button onClick={(e) => {
  // Mucha lógica aquí
  console.log(e);
  setState(newState);
  callAPI();
}}>

// ❌ No prevenir comportamiento por defecto cuando es necesario
const handleSubmit = () => {
  // Sin e.preventDefault()
};
```

---

## 🔄 CONCEPTOS AVANZADOS

### **Event Pooling (React 16 y anteriores):**
```jsx
// ⚠️ En React 16, los eventos se reutilizaban
const handleClick = (e) => {
  // ❌ Esto no funcionaba en React 16
  setTimeout(() => {
    console.log(e.type); // undefined
  }, 0);
};

// ✅ Solución: persistir el evento
const handleClick = (e) => {
  e.persist();
  setTimeout(() => {
    console.log(e.type); // "click"
  }, 0);
};
```

### **Event Delegation:**
```jsx
// 🎯 Manejar múltiples elementos con un solo handler
function List({ items }) {
  const handleItemClick = (e) => {
    const itemId = e.target.dataset.id;
    console.log("Item clicked:", itemId);
  };

  return (
    <ul onClick={handleItemClick}>
      {items.map(item => (
        <li key={item.id} data-id={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### **Custom Events:**
```jsx
// 🎯 Crear eventos personalizados
const CustomButton = ({ onCustomEvent }) => {
  const handleClick = (e) => {
    // Crear evento personalizado
    const customEvent = new CustomEvent('customClick', {
      detail: { message: 'Custom event fired!' }
    });
    
    // Disparar el evento
    e.target.dispatchEvent(customEvent);
    
    // Llamar callback si existe
    if (onCustomEvent) {
      onCustomEvent(e);
    }
  };

  return <button onClick={handleClick}>Custom Button</button>;
};
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **Eventos en React** usan sintaxis camelCase
2. **Event handlers** pueden ser inline o funciones declaradas
3. **Synthetic events** envuelven eventos nativos del navegador
4. **Children props** permiten contenido personalizable
5. **Event pooling** fue eliminado en React 17+

### **Habilidades Desarrolladas:**
- ✅ Crear event handlers inline
- ✅ Usar funciones declaradas para eventos
- ✅ Acceder a propiedades del evento
- ✅ Manejar múltiples eventos
- ✅ Escribir pruebas para eventos
- ✅ Aplicar mejores prácticas

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Componentes Reutilizables**, construyendo componentes más complejos y flexibles.

---

## 🎯 EJERCICIOS PRÁCTICOS

### **Ejercicio 1: Formulario Interactivo**
```jsx
// Crear un formulario con:
// - Campo de texto con validación
// - Botón de envío
// - Mensajes de error/éxito
// - Event handlers para todos los campos
```

### **Ejercicio 2: Lista Interactiva**
```jsx
// Crear una lista con:
// - Elementos clickeables
// - Botón de eliminar para cada elemento
// - Contador de elementos
// - Filtro de búsqueda
```

### **Ejercicio 3: Componente de Navegación**
```jsx
// Crear una navegación con:
// - Enlaces clickeables
// - Indicador de página activa
// - Menú desplegable
// - Event handlers para todos los elementos
```

---

*¡Excelente! Has completado el análisis detallado del Capítulo 4. Ahora entiendes cómo manejar eventos en React de manera efectiva. Estás listo para continuar con Componentes Reutilizables en el siguiente capítulo.* 