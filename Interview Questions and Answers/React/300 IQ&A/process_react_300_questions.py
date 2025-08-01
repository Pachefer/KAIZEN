#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de React.js (300 preguntas)
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class React300QuestionProcessor:
    def __init__(self, input_file="react_300_questions_structured.json"):
        self.input_file = input_file
        self.questions = []
        self.processed_questions = []
        
    def load_questions(self):
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.questions = data.get('questions', [])
            print(f"✅ Cargadas {len(self.questions)} preguntas desde {self.input_file}")
            return True
        except FileNotFoundError:
            print(f"❌ No se encontró el archivo {self.input_file}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Error al parsear JSON: {e}")
            return False
    
    def translate_question(self, question_text):
        translations = {
            'What is': '¿Qué es',
            'How does': '¿Cómo funciona',
            'Explain': 'Explica',
            'Describe': 'Describe',
            'What are': '¿Cuáles son',
            'How to': '¿Cómo',
            'Why': '¿Por qué',
            'When': '¿Cuándo',
            'Where': '¿Dónde',
            'Which': '¿Cuál',
            'React': 'React',
            'component': 'componente',
            'props': 'props',
            'state': 'estado',
            'hook': 'hook',
            'JSX': 'JSX',
            'virtual DOM': 'DOM virtual',
            'lifecycle': 'ciclo de vida',
            'rendering': 'renderizado',
            'event': 'evento',
            'handler': 'manejador',
            'callback': 'callback',
            'function': 'función',
            'class': 'clase',
            'functional': 'funcional',
            'component': 'componente',
            'context': 'contexto',
            'provider': 'proveedor',
            'consumer': 'consumidor',
            'reducer': 'reducer',
            'action': 'acción',
            'dispatch': 'dispatch',
            'store': 'store',
            'middleware': 'middleware',
            'router': 'enrutador',
            'route': 'ruta',
            'navigation': 'navegación',
            'link': 'enlace',
            'parameter': 'parámetro',
            'query': 'consulta',
            'fragment': 'fragmento',
            'portal': 'portal',
            'ref': 'ref',
            'forwardRef': 'forwardRef',
            'memo': 'memo',
            'lazy': 'lazy',
            'suspense': 'suspense',
            'error boundary': 'error boundary',
            'higher-order component': 'componente de orden superior',
            'render prop': 'render prop',
            'children': 'children',
            'key': 'key',
            'ref': 'ref',
            'defaultProps': 'defaultProps',
            'propTypes': 'propTypes',
            'useState': 'useState',
            'useEffect': 'useEffect',
            'useContext': 'useContext',
            'useReducer': 'useReducer',
            'useCallback': 'useCallback',
            'useMemo': 'useMemo',
            'useRef': 'useRef',
            'useImperativeHandle': 'useImperativeHandle',
            'useLayoutEffect': 'useLayoutEffect',
            'useDebugValue': 'useDebugValue',
            'custom hook': 'hook personalizado',
            'side effect': 'efecto secundario',
            'cleanup': 'limpieza',
            'dependency': 'dependencia',
            'array': 'array',
            'object': 'objeto',
            'string': 'string',
            'number': 'número',
            'boolean': 'booleano',
            'null': 'null',
            'undefined': 'undefined',
            'async': 'async',
            'await': 'await',
            'promise': 'promesa',
            'fetch': 'fetch',
            'API': 'API',
            'HTTP': 'HTTP',
            'GET': 'GET',
            'POST': 'POST',
            'PUT': 'PUT',
            'DELETE': 'DELETE',
            'JSON': 'JSON',
            'XML': 'XML',
            'form': 'formulario',
            'input': 'input',
            'button': 'botón',
            'select': 'select',
            'textarea': 'textarea',
            'checkbox': 'checkbox',
            'radio': 'radio',
            'validation': 'validación',
            'error': 'error',
            'warning': 'advertencia',
            'success': 'éxito',
            'loading': 'cargando',
            'spinner': 'spinner',
            'modal': 'modal',
            'dialog': 'diálogo',
            'popup': 'popup',
            'tooltip': 'tooltip',
            'dropdown': 'dropdown',
            'menu': 'menú',
            'navigation': 'navegación',
            'header': 'header',
            'footer': 'footer',
            'sidebar': 'sidebar',
            'layout': 'layout',
            'grid': 'grid',
            'flexbox': 'flexbox',
            'CSS': 'CSS',
            'styling': 'estilos',
            'theme': 'tema',
            'dark mode': 'modo oscuro',
            'light mode': 'modo claro',
            'responsive': 'responsivo',
            'mobile': 'móvil',
            'desktop': 'escritorio',
            'tablet': 'tablet',
            'breakpoint': 'breakpoint',
            'media query': 'media query',
            'animation': 'animación',
            'transition': 'transición',
            'transform': 'transform',
            'keyframe': 'keyframe',
            'performance': 'rendimiento',
            'optimization': 'optimización',
            'bundle': 'bundle',
            'webpack': 'webpack',
            'babel': 'babel',
            'eslint': 'eslint',
            'prettier': 'prettier',
            'testing': 'testing',
            'unit test': 'prueba unitaria',
            'integration test': 'prueba de integración',
            'end-to-end test': 'prueba end-to-end',
            'jest': 'jest',
            'enzyme': 'enzyme',
            'react testing library': 'react testing library',
            'mock': 'mock',
            'stub': 'stub',
            'spy': 'spy',
            'coverage': 'cobertura',
            'debug': 'debug',
            'console': 'console',
            'log': 'log',
            'error': 'error',
            'warning': 'warning',
            'info': 'info',
            'debugger': 'debugger',
            'breakpoint': 'breakpoint',
            'step': 'step',
            'inspect': 'inspect',
            'element': 'elemento',
            'attribute': 'atributo',
            'property': 'propiedad',
            'method': 'método',
            'function': 'función',
            'variable': 'variable',
            'constant': 'constante',
            'let': 'let',
            'const': 'const',
            'var': 'var',
            'arrow function': 'función flecha',
            'template literal': 'template literal',
            'destructuring': 'destructuring',
            'spread operator': 'operador spread',
            'rest operator': 'operador rest',
            'default parameter': 'parámetro por defecto',
            'optional chaining': 'optional chaining',
            'nullish coalescing': 'nullish coalescing',
            'async/await': 'async/await',
            'promise': 'promesa',
            'then': 'then',
            'catch': 'catch',
            'finally': 'finally',
            'resolve': 'resolve',
            'reject': 'reject',
            'all': 'all',
            'race': 'race',
            'any': 'any',
            'allSettled': 'allSettled',
            'redux': 'redux',
            'flux': 'flux',
            'mobx': 'mobx',
            'zustand': 'zustand',
            'recoil': 'recoil',
            'jotai': 'jotai',
            'valtio': 'valtio',
            'next.js': 'next.js',
            'gatsby': 'gatsby',
            'remix': 'remix',
            'nuxt': 'nuxt',
            'svelte': 'svelte',
            'vue': 'vue',
            'angular': 'angular',
            'typescript': 'typescript',
            'javascript': 'javascript',
            'ecmascript': 'ecmascript',
            'es6': 'es6',
            'es2015': 'es2015',
            'es2020': 'es2020',
            'es2022': 'es2022'
        }
        
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text, category='otros'):
        examples = {
            'fundamentos': {
                'title': 'Fundamentos de React',
                'code': '''// Ejemplo de fundamentos de React
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

export default App;''',
                'explanation': 'Este ejemplo muestra los fundamentos básicos de React: JSX, props, componentes funcionales y renderizado condicional.'
            },
            'componentes': {
                'title': 'Componentes Avanzados',
                'code': '''// Ejemplo de componentes avanzados
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

export { ComponenteAvanzado, withLogging, DataFetcher, InputConRef };''',
                'explanation': 'Este ejemplo muestra patrones avanzados de componentes: HOCs, render props, forwardRef y composición.'
            },
            'hooks': {
                'title': 'Hooks Avanzados',
                'code': '''// Ejemplo de hooks avanzados
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
 * Componente que usa todos los hooks avanzados
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

export { TodoApp, useLocalStorage, useDebounce, useAPI };''',
                'explanation': 'Este ejemplo muestra hooks avanzados: useReducer, hooks personalizados, useCallback, useMemo y useRef.'
            }
        }
        
        question_lower = question_text.lower()
        
        # Determinar categoría basada en palabras clave
        if any(word in question_lower for word in ['fundamental', 'basic', 'jsx', 'virtual dom']):
            return examples['fundamentos']
        elif any(word in question_lower for word in ['component', 'hoc', 'render prop', 'forwardref']):
            return examples['componentes']
        elif any(word in question_lower for word in ['hook', 'useState', 'useEffect', 'useReducer']):
            return examples['hooks']
        else:
            return {
                'title': 'Ejemplo Genérico de React',
                'code': '''// Ejemplo genérico de React
import React from 'react';

/**
 * Componente funcional básico
 * Demuestra la estructura fundamental de un componente React
 */
const MiComponente = ({ titulo, descripcion, children }) => {
    return (
        <div className="mi-componente">
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
            {children}
        </div>
    );
};

// Uso del componente
const App = () => {
    return (
        <div className="app">
            <MiComponente 
                titulo="Mi Título" 
                descripcion="Esta es una descripción"
            >
                <p>Contenido adicional</p>
            </MiComponente>
        </div>
    );
};

export default App;''',
                'explanation': 'Este es un ejemplo básico de React que muestra la estructura fundamental de un componente.'
            }
    
    def generate_unit_tests(self, example_code, category='otros'):
        return f'''// Pruebas unitarias para el ejemplo de React
import React from 'react';
import {{ render, screen, fireEvent, waitFor }} from '@testing-library/react';
import '@testing-library/jest-dom';

// Importar el componente a probar
import MiComponente from './MiComponente';

/**
 * Suite de pruebas para el componente MiComponente
 */
describe('MiComponente', () => {{
    // Prueba de renderizado básico
    it('debería renderizar correctamente con props', () => {{
        render(
            <MiComponente 
                titulo="Test Título" 
                descripcion="Test Descripción"
            />
        );
        
        expect(screen.getByText('Test Título')).toBeInTheDocument();
        expect(screen.getByText('Test Descripción')).toBeInTheDocument();
    }});
    
    // Prueba de children
    it('debería renderizar children correctamente', () => {{
        render(
            <MiComponente titulo="Test" descripcion="Test">
                <p>Contenido hijo</p>
            </MiComponente>
        );
        
        expect(screen.getByText('Contenido hijo')).toBeInTheDocument();
    }});
    
    // Prueba de props por defecto
    it('debería manejar props faltantes', () => {{
        render(<MiComponente />);
        
        expect(screen.getByText('undefined')).toBeInTheDocument();
    }});
    
    // Prueba de estructura del DOM
    it('debería tener la estructura correcta', () => {{
        const {{ container }} = render(
            <MiComponente titulo="Test" descripcion="Test" />
        );
        
        const componente = container.querySelector('.mi-componente');
        expect(componente).toBeInTheDocument();
        
        const titulo = componente.querySelector('h2');
        expect(titulo).toBeInTheDocument();
        
        const descripcion = componente.querySelector('p');
        expect(descripcion).toBeInTheDocument();
    }});
}});

// Para ejecutar las pruebas:
// npm test MiComponente.test.js
// npm run test:coverage''';
    
    def predict_results(self, example_code):
        return '''📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- El componente se renderizará correctamente
- Los props se mostrarán en el DOM
- Los children se renderizarán dentro del componente
- No habrá errores en la consola

⚠️ **Posibles Errores:**
- Errores de sintaxis JSX
- Props no definidos
- Problemas de importación
- Errores de TypeScript si se usa

🔍 **Para Verificar:**
1. El componente se renderiza sin errores
2. Los props se muestran correctamente
3. Los children se renderizan
4. La estructura del DOM es correcta
5. No hay warnings en la consola'''
    
    def suggest_improvements(self, question_text, category='otros'):
        improvements = {
            'fundamentos': '''🚀 Mejoras Sugeridas:

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
   - Usar testing-library para pruebas de usuario''',
            
            'componentes': '''🚀 Mejoras Sugeridas:

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
   - Explicar casos de uso específicos''',
            
            'hooks': '''🚀 Mejoras Sugeridas:

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
   - Explicar dependencias y efectos'''

        }
        
        question_lower = question_text.lower()
        
        if any(word in question_lower for word in ['fundamental', 'basic', 'jsx']):
            return improvements['fundamentos']
        elif any(word in question_lower for word in ['component', 'hoc', 'render prop']):
            return improvements['componentes']
        elif any(word in question_lower for word in ['hook', 'useState', 'useEffect']):
            return improvements['hooks']
        else:
            return '''🚀 Mejoras Sugeridas:

1. **Implementar mejores prácticas de React:**
   - Usar componentes funcionales con hooks
   - Implementar PropTypes o TypeScript
   - Seguir las reglas de hooks

2. **Optimizar rendimiento:**
   - Usar React.memo para componentes
   - Implementar lazy loading
   - Optimizar re-renders

3. **Mejorar testing:**
   - Agregar pruebas unitarias
   - Implementar pruebas de integración
   - Usar testing-library

4. **Implementar accesibilidad:**
   - Agregar atributos ARIA
   - Implementar navegación por teclado
   - Usar semántica HTML correcta'''
    
    def process_question(self, question_data):
        question_text = question_data['question']
        answer_text = question_data['answer']
        category = question_data.get('category', 'otros')
        
        translated_question = self.translate_question(question_text)
        example = self.generate_example_code(question_text, category)
        unit_tests = self.generate_unit_tests(example['code'], category)
        results_prediction = self.predict_results(example['code'])
        improvements = self.suggest_improvements(question_text, category)
        
        processed_question = {
            'original_question': question_text,
            'translated_question': translated_question,
            'original_answer': answer_text,
            'category': category,
            'example': example,
            'unit_tests': unit_tests,
            'results_prediction': results_prediction,
            'improvements': improvements,
            'page': question_data.get('page', ''),
            'processed_at': datetime.now().isoformat()
        }
        
        return processed_question
    
    def process_all_questions(self, limit=None):
        print(f"\n🔄 Procesando preguntas...")
        
        questions_to_process = self.questions[:limit] if limit else self.questions
        
        for i, question_data in enumerate(questions_to_process, 1):
            print(f"📝 Procesando pregunta {i}/{len(questions_to_process)}")
            
            try:
                processed_question = self.process_question(question_data)
                self.processed_questions.append(processed_question)
            except Exception as e:
                print(f"❌ Error procesando pregunta {i}: {e}")
        
        print(f"✅ Procesadas {len(self.processed_questions)} preguntas")
    
    def save_processed_questions(self, output_file="react_300_questions_processed.json"):
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '300+ React.js Interview Questions and Answers',
                'author': 'Salunke, Manish',
                'processed_at': datetime.now().isoformat(),
                'total_processed': len(self.processed_questions),
                'version': '1.0'
            },
            'questions': self.processed_questions
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Preguntas procesadas guardadas en {output_file}")
    
    def run_processing(self, limit=None):
        print("🚀 Iniciando procesamiento de preguntas de React.js (300)")
        print("=" * 60)
        
        if not self.load_questions():
            return False
        
        self.process_all_questions(limit)
        self.save_processed_questions()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    input_file = "react_300_questions_structured.json"
    
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_react_300_questions.py")
        return
    
    processor = React300QuestionProcessor(input_file)
    success = processor.run_processing(limit=10)
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: react_300_questions_processed.json")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 