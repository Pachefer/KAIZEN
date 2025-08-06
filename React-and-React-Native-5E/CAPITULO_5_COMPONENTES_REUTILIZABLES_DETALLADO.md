# 📖 CAPÍTULO 5: CREACIÓN DE COMPONENTES REUTILIZABLES
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Qué son componentes monolíticos** y sus limitaciones
- ✅ **Cómo dividir componentes grandes** en componentes más pequeños
- ✅ **Patrones de composición** para crear componentes reutilizables
- ✅ **Render props** y children como patrón de composición
- ✅ **Separación de responsabilidades** en componentes
- ✅ **Mejores prácticas** para componentes reutilizables
- ✅ **Refactoring** de componentes monolíticos

---

## 🔍 CONCEPTO FUNDAMENTAL: COMPONENTES MONOLÍTICOS

### **Definición:**
Un componente monolítico es un componente que **hace demasiadas cosas** y tiene **múltiples responsabilidades**. Estos componentes son difíciles de mantener, testear y reutilizar. El objetivo es dividirlos en componentes más pequeños y especializados.

### **Problemas de los Componentes Monolíticos:**
```javascript
// ❌ Componente monolítico - Hace demasiadas cosas
function MonolithicComponent() {
  // Maneja estado de artículos
  // Maneja formularios
  // Maneja renderizado de lista
  // Maneja eventos de click
  // Todo en un solo componente
}

// ✅ Componentes especializados
function ArticleList() { /* Solo renderiza lista */ }
function ArticleForm() { /* Solo maneja formulario */ }
function ArticleItem() { /* Solo renderiza un artículo */ }
```

---

## 💻 ANÁLISIS DEL CÓDIGO: COMPONENTE MONOLÍTICO

### **Archivo: `src/MyFeature.jsx`**

```jsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React y hooks
import * as React from "react";
import { useCallback } from "react";

// 🎯 Generador de IDs únicos
// Función generadora que crea IDs incrementales
const id = (function* () {
  let i = 1;
  while (true) {
    yield i;
    i += 1;
  }
})();

// 🎯 Componente monolítico principal
function MyFeature() {
  // 📊 Estado de artículos - Array de objetos con propiedades
  const [articles, setArticles] = React.useState([
    {
      id: id.next(), // Genera ID único
      title: "Article 1",
      summary: "Article 1 Summary",
      display: "none", // Controla visibilidad del resumen
    },
    {
      id: id.next(),
      title: "Article 2",
      summary: "Article 2 Summary",
      display: "none",
    },
  ]);

  // 📝 Estado del formulario - Campos de entrada
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");

  // 🎯 Event handlers con useCallback para optimización
  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeSummary = useCallback((e) => {
    setSummary(e.target.value);
  }, []);

  // ➕ Función para agregar nuevo artículo
  const onClickAdd = useCallback(() => {
    setArticles((state) => [
      ...state, // Spread operator para crear nuevo array
      {
        id: id.next(), // Nuevo ID único
        title: title,
        summary: summary,
        display: "none",
      },
    ]);
    // 🧹 Limpiar formulario después de agregar
    setTitle("");
    setSummary("");
  }, [summary, title]);

  // 🗑️ Función para eliminar artículo
  const onClickRemove = useCallback((id) => {
    setArticles((state) => state.filter((article) => article.id !== id));
  }, []);

  // 👁️ Función para alternar visibilidad del resumen
  const onClickToggle = useCallback((id) => {
    setArticles((state) => {
      const articles = [...state]; // Crear copia del array
      const index = articles.findIndex((article) => article.id === id);

      // 🔄 Alternar entre mostrar y ocultar
      articles[index] = {
        ...articles[index], // Spread operator para mantener propiedades
        display: articles[index].display ? "" : "none",
      };

      return articles;
    });
  }, []);

  // 🚀 Renderizado del componente
  return (
    <section>
      {/* 📝 Header con formulario */}
      <header>
        <h1>Articles</h1>
        <input placeholder="Title" value={title} onChange={onChangeTitle} />
        <input
          placeholder="Summary"
          value={summary}
          onChange={onChangeSummary}
        />
        <button onClick={onClickAdd}>Add</button>
      </header>

      {/* 📄 Sección de lista de artículos */}
      <article>
        <ul>
          {articles.map((i) => (
            <li key={i.id.value}>
              {/* 🔗 Enlace para alternar visibilidad */}
              <a
                href={`#${i.id}`}
                title="Toggle Summary"
                onClick={() => onClickToggle(i.id)}
              >
                {i.title}
              </a>
              &nbsp;
              {/* 🗑️ Botón para eliminar */}
              <button
                href={`#${i.id}`}
                title="Remove"
                onClick={() => onClickRemove(i.id)}
              >
                &#10007; {/* Símbolo X */}
              </button>
              {/* 📄 Resumen con visibilidad controlada */}
              <p style={{ display: i.display }}>{i.summary}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

// 📤 Exportación del componente
export default MyFeature;
```

### **Archivo: `src/main.jsx`**

```jsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación del módulo de renderizado de React
import * as ReactDOM from "react-dom/client";
// 🎯 Importación del componente monolítico
import MyFeature from "./MyFeature";

// 🎯 Creación del punto de entrada de la aplicación
const root = ReactDOM.createRoot(document.getElementById("root"));

// 🚀 Renderizado del componente monolítico
root.render(<MyFeature />);
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis del Generador de IDs:**

#### **Líneas 5-11: Generador de IDs Únicos**
```javascript
const id = (function* () {
  let i = 1;
  while (true) {
    yield i;
    i += 1;
  }
})();
```
- **`function*`**: Declara una función generadora
- **`yield i`**: Pausa la ejecución y retorna el valor actual
- **`id.next()`**: Llama al siguiente valor del generador
- **Propósito**: Crear IDs únicos incrementales para los artículos

### **Análisis del Estado:**

#### **Líneas 14-26: Estado de Artículos**
```javascript
const [articles, setArticles] = React.useState([
  {
    id: id.next(),
    title: "Article 1",
    summary: "Article 1 Summary",
    display: "none",
  },
  // ...
]);
```
- **`articles`**: Array de objetos que representan artículos
- **`id`**: ID único generado por el generador
- **`display`**: Controla la visibilidad del resumen ("none" o "")

#### **Líneas 28-29: Estado del Formulario**
```javascript
const [title, setTitle] = React.useState("");
const [summary, setSummary] = React.useState("");
```
- **Estado controlado**: Los inputs están controlados por React
- **Valores iniciales**: Strings vacíos

### **Análisis de Event Handlers:**

#### **Líneas 31-39: Handlers de Formulario**
```javascript
const onChangeTitle = useCallback((e) => {
  setTitle(e.target.value);
}, []);

const onChangeSummary = useCallback((e) => {
  setSummary(e.target.value);
}, []);
```
- **`useCallback`**: Optimiza el rendimiento evitando recreaciones
- **`e.target.value`**: Obtiene el valor del input
- **Dependencias vacías**: No se recrean en cada render

#### **Líneas 41-52: Handler de Agregar**
```javascript
const onClickAdd = useCallback(() => {
  setArticles((state) => [
    ...state,
    {
      id: id.next(),
      title: title,
      summary: summary,
      display: "none",
    },
  ]);
  setTitle("");
  setSummary("");
}, [summary, title]);
```
- **Función de actualización**: Usa función para acceder al estado anterior
- **Spread operator**: Crea nuevo array sin mutar el original
- **Limpieza**: Resetea los campos del formulario

#### **Líneas 54-57: Handler de Eliminar**
```javascript
const onClickRemove = useCallback((id) => {
  setArticles((state) => state.filter((article) => article.id !== id));
}, []);
```
- **`filter`**: Crea nuevo array excluyendo el artículo con el ID especificado
- **Inmutabilidad**: No modifica el array original

#### **Líneas 59-75: Handler de Alternar**
```javascript
const onClickToggle = useCallback((id) => {
  setArticles((state) => {
    const articles = [...state];
    const index = articles.findIndex((article) => article.id === id);

    articles[index] = {
      ...articles[index],
      display: articles[index].display ? "" : "none",
    };

    return articles;
  });
}, []);
```
- **`findIndex`**: Encuentra el índice del artículo
- **Operador ternario**: Alterna entre mostrar y ocultar
- **Spread operator**: Mantiene propiedades existentes

### **Análisis del Renderizado:**

#### **Líneas 77-111: JSX del Componente**
```jsx
return (
  <section>
    <header>
      <h1>Articles</h1>
      <input placeholder="Title" value={title} onChange={onChangeTitle} />
      <input placeholder="Summary" value={summary} onChange={onChangeSummary} />
      <button onClick={onClickAdd}>Add</button>
    </header>
    <article>
      <ul>
        {articles.map((i) => (
          <li key={i.id.value}>
            <a href={`#${i.id}`} title="Toggle Summary" onClick={() => onClickToggle(i.id)}>
              {i.title}
            </a>
            &nbsp;
            <button href={`#${i.id}`} title="Remove" onClick={() => onClickRemove(i.id)}>
              &#10007;
            </button>
            <p style={{ display: i.display }}>{i.summary}</p>
          </li>
        ))}
      </ul>
    </article>
  </section>
);
```
- **Formulario**: Inputs controlados para título y resumen
- **Lista**: Mapeo de artículos con funcionalidades de toggle y remove
- **Estilos inline**: Control de visibilidad con `display`

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Renderizado Inicial**
```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyFeature from './MyFeature';

describe('MyFeature', () => {
  it('debe renderizar el título y formulario correctamente', () => {
    render(<MyFeature />);
    
    // Verificar título
    expect(screen.getByText('Articles')).toBeInTheDocument();
    
    // Verificar inputs del formulario
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Summary')).toBeInTheDocument();
    
    // Verificar botón de agregar
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('debe renderizar los artículos iniciales', () => {
    render(<MyFeature />);
    
    // Verificar artículos iniciales
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.getByText('Article 1 Summary')).toBeInTheDocument();
    expect(screen.getByText('Article 2 Summary')).toBeInTheDocument();
  });
});
```

### **Test 2: Verificación de Funcionalidad de Agregar**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('MyFeature - Agregar Artículos', () => {
  it('debe agregar un nuevo artículo al hacer click en Add', () => {
    render(<MyFeature />);
    
    // Obtener elementos del formulario
    const titleInput = screen.getByPlaceholderText('Title');
    const summaryInput = screen.getByPlaceholderText('Summary');
    const addButton = screen.getByText('Add');
    
    // Llenar formulario
    fireEvent.change(titleInput, { target: { value: 'Nuevo Artículo' } });
    fireEvent.change(summaryInput, { target: { value: 'Nuevo Resumen' } });
    
    // Hacer click en Add
    fireEvent.click(addButton);
    
    // Verificar que el nuevo artículo se agregó
    expect(screen.getByText('Nuevo Artículo')).toBeInTheDocument();
    expect(screen.getByText('Nuevo Resumen')).toBeInTheDocument();
    
    // Verificar que el formulario se limpió
    expect(titleInput.value).toBe('');
    expect(summaryInput.value).toBe('');
  });
});
```

### **Test 3: Verificación de Funcionalidad de Eliminar**
```javascript
describe('MyFeature - Eliminar Artículos', () => {
  it('debe eliminar un artículo al hacer click en el botón X', () => {
    render(<MyFeature />);
    
    // Verificar que el artículo existe inicialmente
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    
    // Encontrar y hacer click en el botón de eliminar del primer artículo
    const removeButtons = screen.getAllByTitle('Remove');
    fireEvent.click(removeButtons[0]);
    
    // Verificar que el artículo se eliminó
    expect(screen.queryByText('Article 1')).not.toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument(); // El segundo debe permanecer
  });
});
```

### **Test 4: Verificación de Funcionalidad de Toggle**
```javascript
describe('MyFeature - Toggle de Resumen', () => {
  it('debe alternar la visibilidad del resumen al hacer click en el título', () => {
    render(<MyFeature />);
    
    // El resumen debe estar oculto inicialmente
    const summary = screen.getByText('Article 1 Summary');
    expect(summary).toHaveStyle({ display: 'none' });
    
    // Hacer click en el título para mostrar el resumen
    const titleLink = screen.getByText('Article 1');
    fireEvent.click(titleLink);
    
    // Verificar que el resumen ahora está visible
    expect(summary).toHaveStyle({ display: '' });
    
    // Hacer click nuevamente para ocultar
    fireEvent.click(titleLink);
    
    // Verificar que el resumen está oculto nuevamente
    expect(summary).toHaveStyle({ display: 'none' });
  });
});
```

### **Test 5: Verificación de Generador de IDs**
```javascript
describe('MyFeature - Generador de IDs', () => {
  it('debe generar IDs únicos para cada artículo', () => {
    render(<MyFeature />);
    
    // Agregar múltiples artículos
    const titleInput = screen.getByPlaceholderText('Title');
    const summaryInput = screen.getByPlaceholderText('Summary');
    const addButton = screen.getByText('Add');
    
    // Agregar primer artículo
    fireEvent.change(titleInput, { target: { value: 'Artículo A' } });
    fireEvent.change(summaryInput, { target: { value: 'Resumen A' } });
    fireEvent.click(addButton);
    
    // Agregar segundo artículo
    fireEvent.change(titleInput, { target: { value: 'Artículo B' } });
    fireEvent.change(summaryInput, { target: { value: 'Resumen B' } });
    fireEvent.click(addButton);
    
    // Verificar que ambos artículos existen
    expect(screen.getByText('Artículo A')).toBeInTheDocument();
    expect(screen.getByText('Artículo B')).toBeInTheDocument();
  });
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en el Navegador:**
```html
<!-- HTML generado por React -->
<div id="root">
  <section>
    <header>
      <h1>Articles</h1>
      <input placeholder="Title" value="" />
      <input placeholder="Summary" value="" />
      <button>Add</button>
    </header>
    <article>
      <ul>
        <li>
          <a href="#1" title="Toggle Summary">Article 1</a>
          <button href="#1" title="Remove">✗</button>
          <p style="display: none;">Article 1 Summary</p>
        </li>
        <li>
          <a href="#2" title="Toggle Summary">Article 2</a>
          <button href="#2" title="Remove">✗</button>
          <p style="display: none;">Article 2 Summary</p>
        </li>
      </ul>
    </article>
  </section>
</div>
```

### **Comportamiento Interactivo:**
1. **Formulario**: Los inputs permiten escribir título y resumen
2. **Botón Add**: Agrega nuevo artículo y limpia el formulario
3. **Enlaces de título**: Alternan la visibilidad del resumen
4. **Botones X**: Eliminan artículos de la lista
5. **IDs únicos**: Cada artículo tiene un ID incremental

### **Flujo de Datos:**
```
Usuario escribe → onChange → setState → Re-render → UI actualizada
Usuario hace click → onClick → setState → Re-render → UI actualizada
```

---

## 🔧 REFACTORING: DIVIDIENDO EL COMPONENTE MONOLÍTICO

### **Ejercicio 1: Separación en Componentes Especializados**
```jsx
// 🎯 Componente para el formulario
const ArticleForm = ({ title, summary, onTitleChange, onSummaryChange, onAdd }) => {
  return (
    <header>
      <h1>Articles</h1>
      <input 
        placeholder="Title" 
        value={title} 
        onChange={onTitleChange} 
      />
      <input
        placeholder="Summary"
        value={summary}
        onChange={onSummaryChange}
      />
      <button onClick={onAdd}>Add</button>
    </header>
  );
};

// 🎯 Componente para un artículo individual
const ArticleItem = ({ article, onToggle, onRemove }) => {
  return (
    <li>
      <a
        href={`#${article.id}`}
        title="Toggle Summary"
        onClick={() => onToggle(article.id)}
      >
        {article.title}
      </a>
      &nbsp;
      <button
        href={`#${article.id}`}
        title="Remove"
        onClick={() => onRemove(article.id)}
      >
        &#10007;
      </button>
      <p style={{ display: article.display }}>{article.summary}</p>
    </li>
  );
};

// 🎯 Componente para la lista de artículos
const ArticleList = ({ articles, onToggle, onRemove }) => {
  return (
    <article>
      <ul>
        {articles.map((article) => (
          <ArticleItem
            key={article.id.value}
            article={article}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </article>
  );
};

// 🎯 Componente principal refactorizado
function MyFeatureRefactored() {
  const [articles, setArticles] = React.useState([
    {
      id: id.next(),
      title: "Article 1",
      summary: "Article 1 Summary",
      display: "none",
    },
    {
      id: id.next(),
      title: "Article 2",
      summary: "Article 2 Summary",
      display: "none",
    },
  ]);
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeSummary = useCallback((e) => {
    setSummary(e.target.value);
  }, []);

  const onClickAdd = useCallback(() => {
    setArticles((state) => [
      ...state,
      {
        id: id.next(),
        title: title,
        summary: summary,
        display: "none",
      },
    ]);
    setTitle("");
    setSummary("");
  }, [summary, title]);

  const onClickRemove = useCallback((id) => {
    setArticles((state) => state.filter((article) => article.id !== id));
  }, []);

  const onClickToggle = useCallback((id) => {
    setArticles((state) => {
      const articles = [...state];
      const index = articles.findIndex((article) => article.id === id);
      articles[index] = {
        ...articles[index],
        display: articles[index].display ? "" : "none",
      };
      return articles;
    });
  }, []);

  return (
    <section>
      <ArticleForm
        title={title}
        summary={summary}
        onTitleChange={onChangeTitle}
        onSummaryChange={onChangeSummary}
        onAdd={onClickAdd}
      />
      <ArticleList
        articles={articles}
        onToggle={onClickToggle}
        onRemove={onClickRemove}
      />
    </section>
  );
}
```

### **Ejercicio 2: Hook Personalizado para Gestión de Artículos**
```jsx
// 🎯 Hook personalizado para gestión de artículos
const useArticles = () => {
  const [articles, setArticles] = React.useState([
    {
      id: id.next(),
      title: "Article 1",
      summary: "Article 1 Summary",
      display: "none",
    },
    {
      id: id.next(),
      title: "Article 2",
      summary: "Article 2 Summary",
      display: "none",
    },
  ]);

  const addArticle = useCallback((title, summary) => {
    setArticles((state) => [
      ...state,
      {
        id: id.next(),
        title,
        summary,
        display: "none",
      },
    ]);
  }, []);

  const removeArticle = useCallback((id) => {
    setArticles((state) => state.filter((article) => article.id !== id));
  }, []);

  const toggleArticle = useCallback((id) => {
    setArticles((state) => {
      const articles = [...state];
      const index = articles.findIndex((article) => article.id === id);
      articles[index] = {
        ...articles[index],
        display: articles[index].display ? "" : "none",
      };
      return articles;
    });
  }, []);

  return {
    articles,
    addArticle,
    removeArticle,
    toggleArticle,
  };
};

// 🎯 Hook personalizado para gestión del formulario
const useArticleForm = (onAdd) => {
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeSummary = useCallback((e) => {
    setSummary(e.target.value);
  }, []);

  const handleAdd = useCallback(() => {
    if (title.trim() && summary.trim()) {
      onAdd(title, summary);
      setTitle("");
      setSummary("");
    }
  }, [title, summary, onAdd]);

  return {
    title,
    summary,
    onChangeTitle,
    onChangeSummary,
    handleAdd,
  };
};

// 🎯 Componente principal con hooks personalizados
function MyFeatureWithHooks() {
  const { articles, addArticle, removeArticle, toggleArticle } = useArticles();
  const { title, summary, onChangeTitle, onChangeSummary, handleAdd } = useArticleForm(addArticle);

  return (
    <section>
      <ArticleForm
        title={title}
        summary={summary}
        onTitleChange={onChangeTitle}
        onSummaryChange={onChangeSummary}
        onAdd={handleAdd}
      />
      <ArticleList
        articles={articles}
        onToggle={toggleArticle}
        onRemove={removeArticle}
      />
    </section>
  );
}
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Problemas del Componente Monolítico:**
1. **Responsabilidades múltiples** - Hace demasiadas cosas
2. **Difícil de testear** - Mucha lógica en un solo lugar
3. **Difícil de reutilizar** - No se puede usar partes individuales
4. **Difícil de mantener** - Cambios afectan todo el componente
5. **Rendimiento** - Re-renderiza todo cuando cambia cualquier parte

### **Beneficios de la Separación:**
```jsx
// ✅ Componentes especializados
// - Cada uno tiene una responsabilidad
// - Fáciles de testear individualmente
// - Reutilizables en otros contextos
// - Fáciles de mantener y modificar
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```jsx
// ✅ Separar responsabilidades
const FormComponent = () => { /* Solo maneja formularios */ };
const ListComponent = () => { /* Solo maneja listas */ };

// ✅ Usar hooks personalizados
const useData = () => { /* Lógica de datos */ };
const useForm = () => { /* Lógica de formularios */ };

// ✅ Props bien definidas
const Component = ({ data, onAction, children }) => { /* ... */ };

// ✅ Componentes pequeños y enfocados
const Button = ({ children, onClick, variant }) => { /* ... */ };
```

### **❌ Evitar:**
```jsx
// ❌ Componentes monolíticos
const BigComponent = () => {
  // Maneja formularios, listas, estado, efectos, etc.
};

// ❌ Props excesivas
const Component = ({ data, setData, onAction, onCancel, onSave, ... }) => { /* ... */ };

// ❌ Lógica mezclada
const Component = () => {
  // Lógica de UI mezclada con lógica de negocio
};
```

---

## 🔄 CONCEPTOS AVANZADOS

### **Render Props Pattern:**
```jsx
// 🎯 Componente con render props
const DataFetcher = ({ url, children }) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading });
};

// Uso:
<DataFetcher url="/api/articles">
  {({ data, loading }) => (
    loading ? <div>Loading...</div> : <ArticleList articles={data} />
  )}
</DataFetcher>
```

### **Compound Components Pattern:**
```jsx
// 🎯 Componentes compuestos
const Article = {
  Container: ({ children }) => <section>{children}</section>,
  Header: ({ children }) => <header>{children}</header>,
  List: ({ children }) => <ul>{children}</ul>,
  Item: ({ children }) => <li>{children}</li>,
};

// Uso:
<Article.Container>
  <Article.Header>
    <h1>Articles</h1>
  </Article.Header>
  <Article.List>
    <Article.Item>Article 1</Article.Item>
    <Article.Item>Article 2</Article.Item>
  </Article.List>
</Article.Container>
```

### **Higher-Order Components (HOC):**
```jsx
// 🎯 HOC para funcionalidad común
const withLoading = (Component) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = React.useState(false);
    
    return (
      <div>
        {loading && <div>Loading...</div>}
        <Component {...props} setLoading={setLoading} />
      </div>
    );
  };
};

// Uso:
const ArticleListWithLoading = withLoading(ArticleList);
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **Componentes monolíticos** son difíciles de mantener
2. **Separación de responsabilidades** mejora la mantenibilidad
3. **Hooks personalizados** encapsulan lógica reutilizable
4. **Patrones de composición** crean componentes flexibles
5. **Refactoring** mejora la estructura del código

### **Habilidades Desarrolladas:**
- ✅ Identificar componentes monolíticos
- ✅ Dividir componentes en partes más pequeñas
- ✅ Crear hooks personalizados
- ✅ Implementar patrones de composición
- ✅ Refactorizar código existente
- ✅ Aplicar mejores prácticas

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **TypeScript**, agregando verificación de tipos a nuestros componentes.

---

## 🎯 EJERCICIOS PRÁCTICOS

### **Ejercicio 1: Refactorizar Componente de Usuario**
```jsx
// Refactoriza este componente monolítico:
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Lógica de fetch, formularios, validación, etc.
  
  return (
    <div>
      {/* UI compleja con múltiples responsabilidades */}
    </div>
  );
}
```

### **Ejercicio 2: Crear Sistema de Componentes**
```jsx
// Crea un sistema de componentes para una aplicación de blog:
// - BlogPost (con título, contenido, autor, fecha)
// - CommentSection (con lista de comentarios)
// - LikeButton (con contador de likes)
// - ShareButton (con opciones de compartir)
```

### **Ejercicio 3: Hook Personalizado para API**
```jsx
// Crea un hook personalizado que maneje:
// - Fetch de datos
// - Estado de loading
// - Manejo de errores
// - Cache de datos
// - Re-fetch automático
```

---

*¡Excelente! Has completado el análisis detallado del Capítulo 5. Ahora entiendes cómo crear componentes reutilizables y refactorizar componentes monolíticos. Estás listo para continuar con TypeScript en el siguiente capítulo.* 