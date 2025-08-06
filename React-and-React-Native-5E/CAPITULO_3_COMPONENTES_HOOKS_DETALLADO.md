# 📖 CAPÍTULO 3: COMPONENTES Y HOOKS DE REACT
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Qué son los componentes** y por qué son fundamentales en React
- ✅ **Componentes funcionales** vs componentes de clase
- ✅ **Props (propiedades)** y cómo pasarlas entre componentes
- ✅ **Hooks básicos** (useState, useEffect)
- ✅ **Estado local** y cómo manejarlo
- ✅ **Ciclo de vida** de los componentes
- ✅ **Componentes reutilizables** y composición

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ SON LOS COMPONENTES?

### **Definición:**
Los componentes son las **unidades básicas de construcción** en React. Son funciones o clases que retornan JSX y pueden ser reutilizadas en toda la aplicación. Cada componente representa una parte de la interfaz de usuario.

### **Tipos de Componentes:**
```javascript
// 🎯 Componente Funcional (Recomendado)
const MiComponente = (props) => {
  return <div>Hola Mundo</div>;
};

// 🏗️ Componente de Clase (Legacy)
class MiComponenteClase extends React.Component {
  render() {
    return <div>Hola Mundo</div>;
  }
}
```

---

## 💻 ANÁLISIS DEL CÓDIGO: COMPONENTE CON PROPIEDADES

### **Archivo: `src/MyComponent.jsx`**

```jsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Definición del componente funcional
// Los componentes funcionales son funciones que retornan JSX
// Reciben props como parámetro (destructurado en este caso)
const MyComponent = ({ title, description }) => {
  // 🚀 Retorno del JSX que representa la UI del componente
  return (
    // 📦 Contenedor div que envuelve todo el contenido
    <div>
      {/* 📝 Título dinámico usando la prop 'title' */}
      <h1>{title}</h1>
      {/* 📄 Descripción dinámica usando la prop 'description' */}
      <p>{description}</p>
    </div>
  );
};

// 📤 Exportación del componente para uso en otros archivos
// 'default' permite importar con cualquier nombre
export default MyComponent;
```

### **Archivo: `src/main.jsx`**

```jsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación del módulo de renderizado de React
import * as ReactDOM from "react-dom/client";
// 🎯 Importación del componente personalizado
// Se puede importar con cualquier nombre debido al 'export default'
import MyComponent from "./MyComponent";

// 🎯 Creación del punto de entrada de la aplicación
const root = ReactDOM.createRoot(document.getElementById("root"));

// 🚀 Renderizado del componente con props
root.render(
  // 📦 Elemento semántico que envuelve el componente
  <section>
    {/* 🎯 Uso del componente con propiedades específicas */}
    <MyComponent
      title="Welcome to My App"
      description="This is a sample component."
    />
  </section>
);
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis del Componente:**

#### **Línea 1: Definición del Componente**
```javascript
const MyComponent = ({ title, description }) => {
```
- **`const MyComponent`**: Declaración del componente como función constante
- **`({ title, description })`**: Destructuración de props directamente en los parámetros
- **`=>`**: Arrow function (función flecha) para definición concisa

#### **Líneas 2-8: Cuerpo del Componente**
```jsx
return (
  <div>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);
```
- **`return`**: Retorna el JSX que se renderizará
- **`{title}`**: Interpolación de la prop `title` en el JSX
- **`{description}`**: Interpolación de la prop `description` en el JSX

#### **Línea 10: Exportación**
```javascript
export default MyComponent;
```
- **`export default`**: Exporta el componente como exportación por defecto
- Permite importar con cualquier nombre: `import MiComponente from "./MyComponent"`

### **Análisis del Uso del Componente:**

#### **Línea 5: Importación**
```javascript
import MyComponent from "./MyComponent";
```
- **`import`**: Importa el componente desde el archivo especificado
- **`"./MyComponent"`**: Ruta relativa al archivo (sin extensión .jsx)

#### **Líneas 9-13: Renderizado con Props**
```jsx
<MyComponent
  title="Welcome to My App"
  description="This is a sample component."
/>
```
- **`<MyComponent>`**: Uso del componente como elemento JSX
- **`title="..."`**: Prop `title` con valor string
- **`description="..."`**: Prop `description` con valor string

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Props Básicas**
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('debe renderizar el título y descripción correctamente', () => {
    // Arrange: Preparar props de prueba
    const testProps = {
      title: 'Mi Título de Prueba',
      description: 'Mi descripción de prueba'
    };
    
    // Act: Renderizar el componente con props
    render(<MyComponent {...testProps} />);
    
    // Assert: Verificar que las props se renderizan correctamente
    expect(screen.getByText('Mi Título de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Mi descripción de prueba')).toBeInTheDocument();
  });

  it('debe renderizar elementos h1 y p con el contenido correcto', () => {
    const testProps = {
      title: 'Título Test',
      description: 'Descripción Test'
    };
    
    render(<MyComponent {...testProps} />);
    
    // Verificar que el título está en un h1
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveTextContent('Título Test');
    
    // Verificar que la descripción está en un p
    const descriptionElement = screen.getByText('Descripción Test');
    expect(descriptionElement.tagName).toBe('P');
  });
});
```

### **Test 2: Verificación de Estructura DOM**
```javascript
it('debe tener la estructura DOM correcta', () => {
  const { container } = render(
    <MyComponent 
      title="Test Title" 
      description="Test Description" 
    />
  );
  
  // Verificar que existe un div contenedor
  const div = container.querySelector('div');
  expect(div).toBeTruthy();
  
  // Verificar que el div contiene h1 y p
  const h1 = div.querySelector('h1');
  const p = div.querySelector('p');
  
  expect(h1).toBeTruthy();
  expect(p).toBeTruthy();
  expect(h1.textContent).toBe('Test Title');
  expect(p.textContent).toBe('Test Description');
});
```

### **Test 3: Verificación de Props Opcionales**
```javascript
it('debe manejar props faltantes graciosamente', () => {
  // Renderizar sin props
  render(<MyComponent />);
  
  // Debería mostrar undefined o string vacío
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('undefined');
  expect(screen.getByText('undefined')).toBeInTheDocument();
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en el Navegador:**
```html
<!-- HTML generado por React -->
<div id="root">
  <section>
    <div>
      <h1>Welcome to My App</h1>
      <p>This is a sample component.</p>
    </div>
  </section>
</div>
```

### **Análisis del DOM Generado:**
1. **Elemento raíz**: `<div id="root">` (contenedor de React)
2. **Elemento section**: `<section>` (envoltorio semántico)
3. **Elemento div**: `<div>` (contenedor del componente)
4. **Elemento h1**: `<h1>Welcome to My App</h1>` (título dinámico)
5. **Elemento p**: `<p>This is a sample component.</p>` (descripción dinámica)

### **Comportamiento Visual:**
- **Título**: "Welcome to My App" se muestra como encabezado principal
- **Descripción**: "This is a sample component." se muestra como párrafo
- **Estructura**: Título y descripción están contenidos en un div

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Componente con Múltiples Props**
```jsx
// Crear un componente UserCard
const UserCard = ({ name, email, avatar, isOnline }) => {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
      <span className={isOnline ? 'online' : 'offline'}>
        {isOnline ? 'En línea' : 'Desconectado'}
      </span>
    </div>
  );
};

// Uso:
<UserCard 
  name="Juan Pérez"
  email="juan@ejemplo.com"
  avatar="/avatar.jpg"
  isOnline={true}
/>
```

### **Ejercicio 2: Componente con Props por Defecto**
```jsx
const Button = ({ 
  text = 'Click me', 
  variant = 'primary', 
  onClick = () => {} 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

// Uso:
<Button text="Guardar" variant="success" />
<Button /> {/* Usa valores por defecto */}
```

### **Ejercicio 3: Componente con Children**
```jsx
const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

// Uso:
<Card title="Mi Tarjeta">
  <p>Contenido personalizado aquí</p>
  <button>Acción</button>
</Card>
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Reglas de Props:**
1. **Props son inmutables** - No se pueden modificar dentro del componente
2. **Props son opcionales** - Siempre verificar si existen antes de usar
3. **Props pueden ser cualquier tipo** - strings, numbers, objects, functions
4. **Props se pasan de padre a hijo** - Flujo unidireccional de datos

### **Mejores Prácticas:**
```jsx
// ✅ Destructuración de props
const MyComponent = ({ title, description }) => {
  return <div>{title}</div>;
};

// ✅ Props por defecto
const MyComponent = ({ title = 'Título por defecto' }) => {
  return <div>{title}</div>;
};

// ✅ Validación de props
const MyComponent = ({ title, description }) => {
  if (!title) return <div>Cargando...</div>;
  return <div>{title}</div>;
};
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```jsx
// ✅ Nombres descriptivos para componentes
const UserProfile = ({ user }) => { /* ... */ };

// ✅ Destructuración de props
const Button = ({ text, onClick, disabled }) => { /* ... */ };

// ✅ Props por defecto
const Input = ({ placeholder = 'Escribe aquí...' }) => { /* ... */ };

// ✅ Validación de props
const Avatar = ({ src, alt }) => {
  if (!src) return <div>Sin imagen</div>;
  return <img src={src} alt={alt} />;
};
```

### **❌ Evitar:**
```jsx
// ❌ Nombres genéricos
const Component = (props) => { /* ... */ };

// ❌ Acceso directo a props
const Button = (props) => {
  return <button>{props.text}</button>;
};

// ❌ Sin validación de props
const Image = ({ src }) => {
  return <img src={src} />; // Puede romper si src es undefined
};
```

---

## 🔄 CONCEPTOS AVANZADOS

### **Props vs State:**
```jsx
// 🎯 Props: Datos que vienen del componente padre
const ChildComponent = ({ data }) => {
  return <div>{data}</div>;
};

// 🎯 State: Datos internos del componente
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent data={count} />
    </div>
  );
};
```

### **Composición de Componentes:**
```jsx
// 🎯 Componente compuesto
const Layout = ({ header, sidebar, content, footer }) => {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="main">
        <aside>{sidebar}</aside>
        <main>{content}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
};

// Uso:
<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  content={<MainContent />}
  footer={<Footer />}
/>
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **Componentes** son funciones que retornan JSX
2. **Props** son datos que se pasan de padre a hijo
3. **Destructuración** simplifica el acceso a props
4. **Exportación/Importación** permite reutilizar componentes
5. **Composición** es la base del diseño de componentes

### **Habilidades Desarrolladas:**
- ✅ Crear componentes funcionales
- ✅ Pasar y recibir props
- ✅ Destructurar props eficientemente
- ✅ Exportar e importar componentes
- ✅ Escribir pruebas para componentes
- ✅ Aplicar mejores prácticas

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Manejo de Eventos**, construyendo componentes interactivos que responden a las acciones del usuario.

---

## 🎯 EJERCICIOS PRÁCTICOS

### **Ejercicio 1: Componente ProductCard**
```jsx
// Crear un componente que muestre:
// - Imagen del producto
// - Nombre del producto
// - Precio
// - Botón de "Agregar al carrito"
// - Indicador de stock disponible
```

### **Ejercicio 2: Componente FormField**
```jsx
// Crear un componente de campo de formulario con:
// - Label
// - Input (text, email, password)
// - Mensaje de error
// - Indicador de validación
```

### **Ejercicio 3: Componente Modal**
```jsx
// Crear un componente modal con:
// - Título
// - Contenido personalizable
// - Botones de acción
// - Función de cierre
```

---

*¡Excelente! Has completado el análisis detallado del Capítulo 3. Ahora entiendes cómo crear componentes reutilizables con props. Estás listo para continuar con el manejo de eventos en el siguiente capítulo.* 