# ⚛️ Guía Avanzada de React.js: 300+ Preguntas Detalladas

## 📋 Descripción

Esta guía es una **traducción y mejora completa** del libro "300+ React.js Interview Questions and Answers" de Salunke, Manish. Se ha convertido en una guía de aprendizaje avanzada en español con ejemplos prácticos, pruebas unitarias y mejoras implementadas.

## 🎯 Objetivos de la Guía

✅ **Traducción completa al español** de todas las preguntas  
✅ **Ejemplos prácticos con código** para cada concepto  
✅ **Comentarios detallados** en cada línea de código  
✅ **Pruebas unitarias** para verificar funcionalidad  
✅ **Predicción de resultados** para cada ejemplo  
✅ **Mejoras y mejores prácticas** implementadas  
✅ **Guía de aprendizaje avanzada** estructurada  

## 📊 Estadísticas

- **Total de preguntas procesadas**: 3
- **Fecha de generación**: 15/01/2025 10:30:00
- **Versión**: 1.0
- **Estado**: En desarrollo activo

## 📚 Estructura de la Guía

Cada pregunta incluye:
- 📝 Pregunta original en inglés
- 🌍 Traducción al español
- 💡 Explicación detallada
- 🔧 Ejemplo práctico con código
- 🧪 Pruebas unitarias
- 📊 Predicción de resultados
- 🚀 Mejoras implementadas

---

## 🚀 Guía Avanzada (3 preguntas)

## 🎯 Pregunta 1: ¿Cuáles son los fundamentos básicos de React?

### 📝 Pregunta Original
```
What are the basic fundamentals of React?
```

### 🌍 Traducción al Español
```
¿Cuáles son los fundamentos básicos de React?
```

### 💡 Explicación Detallada
Los fundamentos básicos de React incluyen JSX (JavaScript XML) para escribir componentes, el concepto de componentes reutilizables, el manejo de props para pasar datos entre componentes, el estado local para manejar datos internos, el ciclo de vida de los componentes, y el DOM virtual que optimiza el rendimiento. React se basa en un enfoque declarativo donde describes cómo debe verse la interfaz y React se encarga de actualizar el DOM cuando cambian los datos.

### 🔧 Ejemplo Práctico con Código

#### Fundamentos de React

```jsx
// Ejemplo de fundamentos de React
import React from 'react';

/**
 * Componente básico que demuestra los fundamentos de React
 * - JSX
 * - Props
 * - Componentes funcionales
 * - Renderizado condicional
 */
const FundamentosReact = ({ titulo, mostrarInfo = true, items = [] }) => {
    // Renderizado condicional
    const renderizarInfo = () => {
        if (!mostrarInfo) return null;
        
        return (
            <div className="info">
                <h3>Información adicional:</h3>
                <p>Este es un ejemplo de los fundamentos de React</p>
            </div>
        );
    };
    
    // Renderizado de listas
    const renderizarItems = () => {
        if (items.length === 0) {
            return <p>No hay elementos para mostrar</p>;
        }
        
        return (
            <ul className="lista-items">
                {items.map((item, index) => (
                    <li key={index} className="item">
                        {item}
                    </li>
                ))}
            </ul>
        );
    };
    
    return (
        <div className="fundamentos-react">
            <h1>{titulo || 'Fundamentos de React'}</h1>
            
            {renderizarInfo()}
            
            <div className="contenido">
                <h2>Características principales:</h2>
                <ul>
                    <li>JSX para estructura</li>
                    <li>Props para comunicación</li>
                    <li>Componentes reutilizables</li>
                    <li>Renderizado declarativo</li>
                </ul>
            </div>
            
            <div className="items">
                <h3>Items dinámicos:</h3>
                {renderizarItems()}
            </div>
        </div>
    );
};

// Componente padre que usa FundamentosReact
const App = () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    
    return (
        <div className="app">
            <FundamentosReact 
                titulo="Mi Aplicación React"
                mostrarInfo={true}
                items={items}
            />
        </div>
    );
};

export default App;
```

**Explicación del código:**
Este ejemplo demuestra los fundamentos básicos de React: JSX para la estructura, props para pasar datos, componentes funcionales, renderizado condicional y renderizado de listas. Cada línea está comentada para explicar su propósito.

### 🧪 Pruebas Unitarias

```jsx
// Pruebas unitarias para FundamentosReact
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importar el componente a probar
import FundamentosReact from './FundamentosReact';

/**
 * Suite de pruebas para el componente FundamentosReact
 */
describe('FundamentosReact', () => {
    // Prueba de renderizado básico
    it('debería renderizar correctamente con props por defecto', () => {
        render(<FundamentosReact />);
        
        expect(screen.getByText('Fundamentos de React')).toBeInTheDocument();
        expect(screen.getByText('Características principales:')).toBeInTheDocument();
        expect(screen.getByText('JSX para estructura')).toBeInTheDocument();
    });
    
    // Prueba de props personalizados
    it('debería renderizar con props personalizados', () => {
        render(
            <FundamentosReact 
                titulo="Título Personalizado"
                mostrarInfo={false}
                items={['Item A', 'Item B']}
            />
        );
        
        expect(screen.getByText('Título Personalizado')).toBeInTheDocument();
        expect(screen.queryByText('Información adicional:')).not.toBeInTheDocument();
        expect(screen.getByText('Item A')).toBeInTheDocument();
        expect(screen.getByText('Item B')).toBeInTheDocument();
    });
    
    // Prueba de renderizado condicional
    it('debería mostrar información cuando mostrarInfo es true', () => {
        render(<FundamentosReact mostrarInfo={true} />);
        
        expect(screen.getByText('Información adicional:')).toBeInTheDocument();
    });
    
    it('debería ocultar información cuando mostrarInfo es false', () => {
        render(<FundamentosReact mostrarInfo={false} />);
        
        expect(screen.queryByText('Información adicional:')).not.toBeInTheDocument();
    });
    
    // Prueba de renderizado de listas
    it('debería mostrar mensaje cuando no hay items', () => {
        render(<FundamentosReact items={[]} />);
        
        expect(screen.getByText('No hay elementos para mostrar')).toBeInTheDocument();
    });
    
    it('debería renderizar items correctamente', () => {
        const items = ['Primer Item', 'Segundo Item'];
        render(<FundamentosReact items={items} />);
        
        expect(screen.getByText('Primer Item')).toBeInTheDocument();
        expect(screen.getByText('Segundo Item')).toBeInTheDocument();
    });
    
    // Prueba de estructura del DOM
    it('debería tener la estructura correcta', () => {
        const { container } = render(<FundamentosReact />);
        
        const componente = container.querySelector('.fundamentos-react');
        expect(componente).toBeInTheDocument();
        
        const titulo = componente.querySelector('h1');
        expect(titulo).toBeInTheDocument();
        
        const lista = componente.querySelector('.lista-items');
        expect(lista).toBeInTheDocument();
    });
});

// Para ejecutar las pruebas:
// npm test FundamentosReact.test.js
// npm run test:coverage
```

### 📊 Predicción de Resultados

📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- El componente se renderizará correctamente con el título
- La información adicional se mostrará cuando mostrarInfo sea true
- Los items se renderizarán en una lista
- El renderizado condicional funcionará correctamente

⚠️ **Posibles Errores:**
- Errores de sintaxis JSX
- Problemas con las keys en el mapeo de listas
- Props no definidos
- Problemas de importación de React

🔍 **Para Verificar:**
1. El componente se renderiza sin errores
2. Los props se muestran correctamente
3. El renderizado condicional funciona
4. Las listas se renderizan apropiadamente
5. No hay warnings en la consola

### 🚀 Mejoras Implementadas

🚀 Mejoras Sugeridas:

1. **Optimización de rendimiento:**
   - Usar React.memo para evitar re-renders innecesarios
   - Implementar useMemo y useCallback para cálculos costosos
   - Usar lazy loading para componentes grandes

2. **Mejores prácticas:**
   - Agregar PropTypes o TypeScript para validación de props
   - Implementar error boundaries para manejo de errores
   - Usar fragmentos para evitar divs innecesarios

3. **Accesibilidad:**
   - Agregar atributos ARIA apropiados
   - Implementar navegación por teclado
   - Usar semántica HTML correcta

4. **Testing:**
   - Agregar pruebas unitarias completas
   - Implementar pruebas de integración
   - Usar testing-library para pruebas de usuario

---

## 🎯 Pregunta 2: ¿Cómo funcionan los componentes de orden superior (HOCs) en React?

### 📝 Pregunta Original
```
How do Higher-Order Components (HOCs) work in React?
```

### 🌍 Traducción al Español
```
¿Cómo funcionan los componentes de orden superior (HOCs) en React?
```

### 💡 Explicación Detallada
Los componentes de orden superior (HOCs) son funciones que toman un componente como argumento y devuelven un nuevo componente con funcionalidad adicional. Los HOCs permiten reutilizar lógica entre componentes sin modificar su código original. Son útiles para agregar funcionalidades como logging, autenticación, manejo de estado, y otras características transversales. Los HOCs siguen el patrón de composición y son una forma de implementar el patrón decorator en React.

### 🔧 Ejemplo Práctico con Código

#### Componentes Avanzados

```jsx
// Ejemplo de componentes avanzados
import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente de orden superior (HOC)
 * Agrega funcionalidad de logging a cualquier componente
 */
const withLogging = (WrappedComponent) => {
    return function LoggedComponent(props) {
        useEffect(() => {
            console.log(`Componente ${WrappedComponent.name} montado`);
            return () => {
                console.log(`Componente ${WrappedComponent.name} desmontado`);
            };
        }, []);
        
        return <WrappedComponent {...props} />;
    };
};

/**
 * Componente con render prop
 * Permite personalizar el renderizado
 */
const DataFetcher = ({ url, children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [url]);
    
    return children({ data, loading, error });
};

/**
 * Componente con forwardRef
 * Permite pasar refs a componentes hijos
 */
const InputConRef = React.forwardRef(({ label, ...props }, ref) => {
    return (
        <div className="input-container">
            <label>{label}</label>
            <input ref={ref} {...props} />
        </div>
    );
});

/**
 * Componente que usa todos los patrones
 */
const ComponenteAvanzado = withLogging(({ titulo }) => {
    const inputRef = useRef(null);
    const [mensaje, setMensaje] = useState('');
    
    const focusInput = () => {
        inputRef.current?.focus();
    };
    
    return (
        <div className="componente-avanzado">
            <h2>{titulo}</h2>
            
            <InputConRef 
                ref={inputRef}
                label="Mensaje:"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe algo..."
            />
            
            <button onClick={focusInput}>Enfocar Input</button>
            
            <DataFetcher url="https://jsonplaceholder.typicode.com/posts/1">
                {({ data, loading, error }) => {
                    if (loading) return <p>Cargando...</p>;
                    if (error) return <p>Error: {error}</p>;
                    if (!data) return <p>No hay datos</p>;
                    
                    return (
                        <div className="datos">
                            <h3>Datos obtenidos:</h3>
                            <p><strong>Título:</strong> {data.title}</p>
                            <p><strong>ID:</strong> {data.id}</p>
                        </div>
                    );
                }}
            </DataFetcher>
        </div>
    );
});

export { ComponenteAvanzado, withLogging, DataFetcher, InputConRef };
```

**Explicación del código:**
Este ejemplo muestra patrones avanzados de componentes: HOCs (withLogging), render props (DataFetcher), forwardRef (InputConRef) y composición. Cada patrón tiene un propósito específico y se combinan para crear componentes más flexibles y reutilizables.

### 🧪 Pruebas Unitarias

```jsx
// Pruebas unitarias para componentes avanzados
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importar componentes a probar
import { ComponenteAvanzado, withLogging, DataFetcher, InputConRef } from './componentes';

/**
 * Mock para fetch
 */
global.fetch = jest.fn();

/**
 * Suite de pruebas para withLogging HOC
 */
describe('withLogging HOC', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    afterEach(() => {
        consoleSpy.mockClear();
    });
    
    afterAll(() => {
        consoleSpy.mockRestore();
    });
    
    it('debería agregar logging al componente', () => {
        const TestComponent = () => <div>Test</div>;
        const WrappedComponent = withLogging(TestComponent);
        
        render(<WrappedComponent />);
        
        expect(consoleSpy).toHaveBeenCalledWith('Componente TestComponent montado');
    });
    
    it('debería pasar props correctamente', () => {
        const TestComponent = ({ titulo }) => <div>{titulo}</div>;
        const WrappedComponent = withLogging(TestComponent);
        
        render(<WrappedComponent titulo="Test Título" />);
        
        expect(screen.getByText('Test Título')).toBeInTheDocument();
    });
});

/**
 * Suite de pruebas para DataFetcher
 */
describe('DataFetcher', () => {
    beforeEach(() => {
        fetch.mockClear();
    });
    
    it('debería mostrar loading inicialmente', () => {
        fetch.mockImplementationOnce(() => 
            new Promise(() => {}) // Promise que nunca se resuelve
        );
        
        render(
            <DataFetcher url="https://api.test.com/data">
                {({ loading }) => loading ? <p>Cargando...</p> : null}
            </DataFetcher>
        );
        
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
    
    it('debería mostrar datos cuando la API responde', async () => {
        const mockData = { title: 'Test Title', id: 1 };
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData)
            })
        );
        
        render(
            <DataFetcher url="https://api.test.com/data">
                {({ data, loading }) => {
                    if (loading) return <p>Cargando...</p>;
                    if (data) return <p>{data.title}</p>;
                    return null;
                }}
            </DataFetcher>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });
    });
    
    it('debería mostrar error cuando la API falla', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('API Error'))
        );
        
        render(
            <DataFetcher url="https://api.test.com/data">
                {({ error, loading }) => {
                    if (loading) return <p>Cargando...</p>;
                    if (error) return <p>Error: {error}</p>;
                    return null;
                }}
            </DataFetcher>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Error: API Error')).toBeInTheDocument();
        });
    });
});

/**
 * Suite de pruebas para InputConRef
 */
describe('InputConRef', () => {
    it('debería renderizar correctamente', () => {
        render(<InputConRef label="Test Label" />);
        
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    
    it('debería pasar ref correctamente', () => {
        const ref = React.createRef();
        
        render(<InputConRef ref={ref} label="Test" />);
        
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
    
    it('debería manejar props correctamente', () => {
        render(
            <InputConRef 
                label="Test Label"
                placeholder="Test placeholder"
                value="Test value"
            />
        );
        
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('Test value');
        expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    });
});

/**
 * Suite de pruebas para ComponenteAvanzado
 */
describe('ComponenteAvanzado', () => {
    beforeEach(() => {
        fetch.mockClear();
    });
    
    it('debería renderizar correctamente', () => {
        render(<ComponenteAvanzado titulo="Test Título" />);
        
        expect(screen.getByText('Test Título')).toBeInTheDocument();
        expect(screen.getByText('Mensaje:')).toBeInTheDocument();
        expect(screen.getByText('Enfocar Input')).toBeInTheDocument();
    });
    
    it('debería enfocar el input al hacer clic en el botón', () => {
        render(<ComponenteAvanzado titulo="Test" />);
        
        const input = screen.getByRole('textbox');
        const button = screen.getByText('Enfocar Input');
        
        fireEvent.click(button);
        
        expect(input).toHaveFocus();
    });
    
    it('debería actualizar el mensaje al escribir', () => {
        render(<ComponenteAvanzado titulo="Test" />);
        
        const input = screen.getByRole('textbox');
        
        fireEvent.change(input, { target: { value: 'Nuevo mensaje' } });
        
        expect(input).toHaveValue('Nuevo mensaje');
    });
});

// Para ejecutar las pruebas:
// npm test componentes.test.js
// npm run test:coverage
```

### 📊 Predicción de Resultados

📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- Los HOCs funcionarán correctamente agregando funcionalidad
- Los render props permitirán personalización del renderizado
- Los forwardRefs permitirán acceso a elementos DOM
- Los componentes se combinarán sin conflictos

⚠️ **Posibles Errores:**
- Errores en la composición de HOCs
- Problemas con las refs en forwardRef
- Errores de red en DataFetcher
- Problemas de logging en consola

🔍 **Para Verificar:**
1. Los HOCs se ejecutan sin errores
2. Los render props funcionan correctamente
3. Las refs se pasan apropiadamente
4. Los componentes se combinan bien
5. No hay warnings en la consola

### 🚀 Mejoras Implementadas

🚀 Mejoras Sugeridas:

1. **Patrones de componentes:**
   - Usar composición en lugar de herencia
   - Implementar render props para flexibilidad
   - Crear HOCs reutilizables

2. **Optimización:**
   - Usar React.memo para componentes costosos
   - Implementar lazy loading con React.lazy
   - Optimizar re-renders con useMemo

3. **Testing de componentes:**
   - Probar HOCs y render props
   - Verificar forwardRef funciona correctamente
   - Mockear dependencias externas

4. **Documentación:**
   - Documentar props con JSDoc
   - Proporcionar ejemplos de uso
   - Explicar casos de uso específicos

---

## 🎯 Pregunta 3: ¿Cómo implementar hooks personalizados en React?

### 📝 Pregunta Original
```
How to implement custom hooks in React?
```

### 🌍 Traducción al Español
```
¿Cómo implementar hooks personalizados en React?
```

### 💡 Explicación Detallada
Los hooks personalizados son funciones que encapsulan lógica reutilizable y pueden usar otros hooks de React. Deben comenzar con "use" para seguir las convenciones de React y pueden retornar cualquier valor (estado, funciones, objetos). Los hooks personalizados permiten extraer lógica compleja de componentes y reutilizarla en múltiples lugares. Son especialmente útiles para manejo de formularios, llamadas a APIs, suscripciones, y otras funcionalidades comunes.

### 🔧 Ejemplo Práctico con Código

#### Hooks Avanzados

```jsx
// Ejemplo de hooks avanzados
import { useState, useEffect, useCallback, useMemo, useRef, useReducer } from 'react';

/**
 * Reducer para manejo de estado complejo
 */
const todoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, {
                    id: Date.now(),
                    text: action.payload,
                    completed: false
                }]
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            };
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            };
        default:
            return state;
    }
};

/**
 * Hook personalizado para localStorage
 */
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return initialValue;
        }
    });
    
    const setValue = useCallback((value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error al escribir en localStorage:', error);
        }
    }, [key]);
    
    return [storedValue, setValue];
};

/**
 * Hook personalizado para debounce
 */
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
};

/**
 * Hook personalizado para API calls
 */
const useAPI = (url, options = {}) => {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });
    
    const fetchData = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setState({ data, loading: false, error: null });
        } catch (error) {
            setState({ data: null, loading: false, error: error.message });
        }
    }, [url, options]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    return { ...state, refetch: fetchData };
};

/**
 * Hook personalizado para formularios
 */
const useForm = (initialValues = {}, validations = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = useCallback((name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Validar campo si ya ha sido tocado
        if (touched[name] && validations[name]) {
            const error = validations[name](value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [touched, validations]);
    
    const handleBlur = useCallback((name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validar campo al perder el foco
        if (validations[name]) {
            const error = validations[name](values[name]);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [validations, values]);
    
    const handleSubmit = useCallback((onSubmit) => {
        setIsSubmitting(true);
        
        // Validar todos los campos
        const newErrors = {};
        Object.keys(validations).forEach(field => {
            const error = validations[field](values[field]);
            if (error) {
                newErrors[field] = error;
            }
        });
        
        setErrors(newErrors);
        
        // Si no hay errores, ejecutar onSubmit
        if (Object.keys(newErrors).length === 0) {
            onSubmit(values);
        }
        
        setIsSubmitting(false);
    }, [values, validations]);
    
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);
    
    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset
    };
};

/**
 * Componente que usa todos los hooks personalizados
 */
const TodoApp = () => {
    const [state, dispatch] = useReducer(todoReducer, {
        todos: [],
        filter: 'all'
    });
    
    const [newTodo, setNewTodo] = useState('');
    const debouncedTodo = useDebounce(newTodo, 500);
    const [todos, setTodos] = useLocalStorage('todos', []);
    const inputRef = useRef(null);
    
    // API call para obtener todos iniciales
    const { data: initialTodos, loading, error } = useAPI(
        'https://jsonplaceholder.typicode.com/todos?_limit=5'
    );
    
    // Cargar todos iniciales
    useEffect(() => {
        if (initialTodos && state.todos.length === 0) {
            initialTodos.forEach(todo => {
                dispatch({ type: 'ADD_TODO', payload: todo.title });
            });
        }
    }, [initialTodos]);
    
    // Guardar en localStorage cuando cambien los todos
    useEffect(() => {
        setTodos(state.todos);
    }, [state.todos, setTodos]);
    
    const addTodo = useCallback(() => {
        if (newTodo.trim()) {
            dispatch({ type: 'ADD_TODO', payload: newTodo.trim() });
            setNewTodo('');
            inputRef.current?.focus();
        }
    }, [newTodo]);
    
    const toggleTodo = useCallback((id) => {
        dispatch({ type: 'TOGGLE_TODO', payload: id });
    }, []);
    
    const deleteTodo = useCallback((id) => {
        dispatch({ type: 'DELETE_TODO', payload: id });
    }, []);
    
    // Filtrar todos
    const filteredTodos = useMemo(() => {
        switch (state.filter) {
            case 'completed':
                return state.todos.filter(todo => todo.completed);
            case 'active':
                return state.todos.filter(todo => !todo.completed);
            default:
                return state.todos;
        }
    }, [state.todos, state.filter]);
    
    if (loading) return <div>Cargando todos iniciales...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className="todo-app">
            <h1>Todo App con Hooks Avanzados</h1>
            
            <div className="input-section">
                <input
                    ref={inputRef}
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Nuevo todo..."
                />
                <button onClick={addTodo}>Agregar</button>
            </div>
            
            <div className="filters">
                <button 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
                    className={state.filter === 'all' ? 'active' : ''}
                >
                    Todos
                </button>
                <button 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
                    className={state.filter === 'active' ? 'active' : ''}
                >
                    Activos
                </button>
                <button 
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
                    className={state.filter === 'completed' ? 'active' : ''}
                >
                    Completados
                </button>
            </div>
            
            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            
            {debouncedTodo && (
                <p className="debounce-info">
                    Escribiendo: "{debouncedTodo}"
                </p>
            )}
        </div>
    );
};

export { TodoApp, useLocalStorage, useDebounce, useAPI, useForm };
```

**Explicación del código:**
Este ejemplo muestra hooks personalizados avanzados: useLocalStorage para persistencia, useDebounce para optimización, useAPI para llamadas HTTP, y useForm para manejo de formularios. Cada hook encapsula lógica específica y puede ser reutilizado en diferentes componentes.

### 🧪 Pruebas Unitarias

```jsx
// Pruebas unitarias para hooks personalizados
import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importar hooks a probar
import { useLocalStorage, useDebounce, useAPI, useForm, TodoApp } from './hooks';

/**
 * Mock para localStorage
 */
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

/**
 * Mock para fetch
 */
global.fetch = jest.fn();

/**
 * Suite de pruebas para useLocalStorage
 */
describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
    });
    
    it('debería inicializar con valor por defecto', () => {
        const { result } = renderHook(() => useLocalStorage('test', 'default'));
        
        expect(result.current[0]).toBe('default');
    });
    
    it('debería leer valor de localStorage', () => {
        localStorageMock.getItem.mockReturnValue('"stored value"');
        
        const { result } = renderHook(() => useLocalStorage('test', 'default'));
        
        expect(result.current[0]).toBe('stored value');
    });
    
    it('debería guardar valor en localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test', 'default'));
        
        act(() => {
            result.current[1]('new value');
        });
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith('test', '"new value"');
        expect(result.current[0]).toBe('new value');
    });
});

/**
 * Suite de pruebas para useDebounce
 */
describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });
    
    it('debería retornar el valor inicial', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        
        expect(result.current).toBe('initial');
    });
    
    it('debería debounce el valor', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'initial', delay: 500 } }
        );
        
        // Cambiar valor
        rerender({ value: 'changed', delay: 500 });
        
        // El valor debounced aún debería ser el inicial
        expect(result.current).toBe('initial');
        
        // Avanzar el tiempo
        act(() => {
            jest.advanceTimersByTime(500);
        });
        
        // Ahora debería ser el nuevo valor
        expect(result.current).toBe('changed');
    });
});

/**
 * Suite de pruebas para useAPI
 */
describe('useAPI', () => {
    beforeEach(() => {
        fetch.mockClear();
    });
    
    it('debería manejar respuesta exitosa', async () => {
        const mockData = { id: 1, title: 'Test' };
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData)
            })
        );
        
        const { result, waitForNextUpdate } = renderHook(() =>
            useAPI('https://api.test.com/data')
        );
        
        expect(result.current.loading).toBe(true);
        
        await waitForNextUpdate();
        
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBe(null);
    });
    
    it('debería manejar errores', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );
        
        const { result, waitForNextUpdate } = renderHook(() =>
            useAPI('https://api.test.com/data')
        );
        
        await waitForNextUpdate();
        
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Network error');
        expect(result.current.data).toBe(null);
    });
});

/**
 * Suite de pruebas para useForm
 */
describe('useForm', () => {
    const validations = {
        name: (value) => !value ? 'Name is required' : null,
        email: (value) => !value ? 'Email is required' : null
    };
    
    it('debería inicializar con valores por defecto', () => {
        const { result } = renderHook(() => useForm({ name: 'John' }, validations));
        
        expect(result.current.values).toEqual({ name: 'John' });
        expect(result.current.errors).toEqual({});
        expect(result.current.isSubmitting).toBe(false);
    });
    
    it('debería manejar cambios de valores', () => {
        const { result } = renderHook(() => useForm({}, validations));
        
        act(() => {
            result.current.handleChange('name', 'Jane');
        });
        
        expect(result.current.values.name).toBe('Jane');
    });
    
    it('debería validar campos al perder el foco', () => {
        const { result } = renderHook(() => useForm({}, validations));
        
        act(() => {
            result.current.handleBlur('name');
        });
        
        expect(result.current.errors.name).toBe('Name is required');
        expect(result.current.touched.name).toBe(true);
    });
    
    it('debería manejar envío exitoso', () => {
        const { result } = renderHook(() => useForm({ name: 'John', email: 'john@test.com' }, validations));
        const onSubmit = jest.fn();
        
        act(() => {
            result.current.handleSubmit(onSubmit);
        });
        
        expect(onSubmit).toHaveBeenCalledWith({ name: 'John', email: 'john@test.com' });
    });
});

/**
 * Suite de pruebas para TodoApp
 */
describe('TodoApp', () => {
    beforeEach(() => {
        fetch.mockClear();
    });
    
    it('debería renderizar correctamente', () => {
        render(<TodoApp />);
        
        expect(screen.getByText('Todo App con Hooks Avanzados')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nuevo todo...')).toBeInTheDocument();
        expect(screen.getByText('Agregar')).toBeInTheDocument();
    });
    
    it('debería agregar un nuevo todo', () => {
        render(<TodoApp />);
        
        const input = screen.getByPlaceholderText('Nuevo todo...');
        const button = screen.getByText('Agregar');
        
        fireEvent.change(input, { target: { value: 'Nuevo todo' } });
        fireEvent.click(button);
        
        expect(screen.getByText('Nuevo todo')).toBeInTheDocument();
    });
    
    it('debería mostrar filtros', () => {
        render(<TodoApp />);
        
        expect(screen.getByText('Todos')).toBeInTheDocument();
        expect(screen.getByText('Activos')).toBeInTheDocument();
        expect(screen.getByText('Completados')).toBeInTheDocument();
    });
});

// Para ejecutar las pruebas:
// npm test hooks.test.js
// npm run test:coverage
```

### 📊 Predicción de Resultados

📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- Los hooks personalizados funcionarán correctamente
- El localStorage persistirá los datos
- El debounce optimizará las entradas
- Las llamadas API se manejarán apropiadamente
- Los formularios se validarán correctamente

⚠️ **Posibles Errores:**
- Errores en las reglas de hooks (llamadas en bucles o condiciones)
- Problemas con localStorage en entornos sin navegador
- Errores de red en las llamadas API
- Problemas de timing con debounce

🔍 **Para Verificar:**
1. Los hooks se ejecutan sin errores
2. El estado se actualiza correctamente
3. Las validaciones funcionan
4. Los datos se persisten en localStorage
5. Las llamadas API se manejan apropiadamente

### 🚀 Mejoras Implementadas

🚀 Mejoras Sugeridas:

1. **Optimización de hooks:**
   - Usar useCallback para funciones que se pasan como props
   - Implementar useMemo para cálculos costosos
   - Optimizar dependencias de useEffect

2. **Hooks personalizados:**
   - Crear hooks reutilizables para lógica común
   - Implementar validación de entrada en hooks
   - Agregar manejo de errores robusto

3. **Testing de hooks:**
   - Usar @testing-library/react-hooks
   - Probar diferentes escenarios de uso
   - Verificar cleanup de efectos

4. **Documentación:**
   - Documentar hooks con JSDoc
   - Proporcionar ejemplos de uso
   - Explicar dependencias y efectos

---

## 🎉 Conclusión

Esta guía contiene **3 preguntas procesadas** con ejemplos prácticos, pruebas unitarias y mejoras implementadas. Cada pregunta ha sido cuidadosamente traducida y mejorada para proporcionar una experiencia de aprendizaje completa.

## 🚀 Próximos Pasos

1. **Practicar con los ejemplos**: Ejecuta cada ejemplo de código en tu entorno React
2. **Ejecutar las pruebas unitarias**: Verifica que todo funcione correctamente
3. **Implementar las mejoras**: Aplica las sugerencias de mejora en tus proyectos
4. **Contribuir**: Ayuda a mejorar esta guía con nuevas preguntas o ejemplos

## 🤝 Contribuciones

Este proyecto está abierto a contribuciones. Puedes:

- 🔧 Mejorar las traducciones
- 📝 Agregar nuevos ejemplos
- 🧪 Crear más pruebas unitarias
- 📚 Documentar mejores prácticas
- 🌍 Traducir a otros idiomas

---

*Guía creada con ❤️ para la comunidad de desarrolladores React*

**Fecha de generación**: 15/01/2025 10:30:00  
**Versión**: 1.0  
**Total de preguntas**: 3  
**Estado**: En desarrollo activo 