#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de React.js
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class ReactQuestionProcessor:
    def __init__(self, input_file="react_questions_structured.json"):
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
            'allSettled': 'allSettled'
        }
        
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text):
        examples = {
            'component': {
                'title': 'Componente Funcional con Hooks',
                'code': '''// Ejemplo de componente funcional con hooks
import React, { useState, useEffect } from 'react';

/**
 * Componente de contador con hooks
 * Demuestra el uso de useState y useEffect
 */
const Contador = ({ inicial = 0, paso = 1 }) => {
    // Hook de estado para el contador
    const [contador, setContador] = useState(inicial);
    
    // Hook de estado para el historial
    const [historial, setHistorial] = useState([]);
    
    // Hook de efecto para logging
    useEffect(() => {
        console.log('Contador actualizado:', contador);
        
        // Agregar al historial
        setHistorial(prev => [...prev, contador]);
        
        // Cleanup function
        return () => {
            console.log('Componente se desmontará');
        };
    }, [contador]); // Dependencia: se ejecuta cuando cambia contador
    
    // Función para incrementar
    const incrementar = () => {
        setContador(prev => prev + paso);
    };
    
    // Función para decrementar
    const decrementar = () => {
        setContador(prev => prev - paso);
    };
    
    // Función para resetear
    const resetear = () => {
        setContador(inicial);
        setHistorial([]);
    };
    
    return (
        <div className="contador">
            <h2>Contador: {contador}</h2>
            <div className="controles">
                <button onClick={decrementar}>-</button>
                <button onClick={incrementar}>+</button>
                <button onClick={resetear}>Reset</button>
            </div>
            <div className="historial">
                <h3>Historial:</h3>
                <ul>
                    {historial.map((valor, index) => (
                        <li key={index}>{valor}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Componente padre que usa el contador
const App = () => {
    return (
        <div className="app">
            <h1>Ejemplo de Componente React</h1>
            <Contador inicial={10} paso={2} />
        </div>
    );
};

export default App;''',
                'explanation': 'Este ejemplo muestra un componente funcional que usa hooks de React para manejar estado y efectos secundarios.'
            },
            'hooks': {
                'title': 'Hooks Personalizados',
                'code': '''// Ejemplo de hooks personalizados
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejo de formularios
 * Proporciona estado y validación automática
 */
const useFormulario = (valoresIniciales = {}, validaciones = {}) => {
    const [valores, setValores] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});
    const [enviado, setEnviado] = useState(false);
    
    // Función para actualizar valores
    const cambiarValor = useCallback((nombre, valor) => {
        setValores(prev => ({
            ...prev,
            [nombre]: valor
        }));
        
        // Validar campo si ya se ha enviado
        if (enviado && validaciones[nombre]) {
            const error = validaciones[nombre](valor);
            setErrores(prev => ({
                ...prev,
                [nombre]: error
            }));
        }
    }, [enviado, validaciones]);
    
    // Función para enviar formulario
    const enviarFormulario = useCallback((callback) => {
        setEnviado(true);
        
        // Validar todos los campos
        const nuevosErrores = {};
        Object.keys(validaciones).forEach(campo => {
            const error = validaciones[campo](valores[campo]);
            if (error) {
                nuevosErrores[campo] = error;
            }
        });
        
        setErrores(nuevosErrores);
        
        // Si no hay errores, ejecutar callback
        if (Object.keys(nuevosErrores).length === 0) {
            callback(valores);
        }
    }, [valores, validaciones]);
    
    // Función para resetear formulario
    const resetearFormulario = useCallback(() => {
        setValores(valoresIniciales);
        setErrores({});
        setEnviado(false);
    }, [valoresIniciales]);
    
    return {
        valores,
        errores,
        enviado,
        cambiarValor,
        enviarFormulario,
        resetearFormulario
    };
};

/**
 * Hook personalizado para llamadas a API
 * Maneja loading, error y datos
 */
const useAPI = (url) => {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setCargando(true);
                setError(null);
                
                const respuesta = await fetch(url);
                if (!respuesta.ok) {
                    throw new Error(`HTTP error! status: ${respuesta.status}`);
                }
                
                const datos = await respuesta.json();
                setDatos(datos);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };
        
        obtenerDatos();
    }, [url]);
    
    return { datos, cargando, error };
};

// Componente que usa los hooks personalizados
const FormularioUsuario = () => {
    // Validaciones
    const validaciones = {
        nombre: (valor) => {
            if (!valor) return 'El nombre es requerido';
            if (valor.length < 2) return 'El nombre debe tener al menos 2 caracteres';
            return null;
        },
        email: (valor) => {
            if (!valor) return 'El email es requerido';
            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(valor)) {
                return 'El email no es válido';
            }
            return null;
        }
    };
    
    // Usar hook personalizado de formulario
    const {
        valores,
        errores,
        enviado,
        cambiarValor,
        enviarFormulario,
        resetearFormulario
    } = useFormulario({
        nombre: '',
        email: ''
    }, validaciones);
    
    // Función para manejar envío
    const manejarEnvio = (datos) => {
        console.log('Datos del formulario:', datos);
        // Aquí se enviarían los datos a una API
        alert('Formulario enviado exitosamente!');
        resetearFormulario();
    };
    
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            enviarFormulario(manejarEnvio);
        }}>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    value={valores.nombre}
                    onChange={(e) => cambiarValor('nombre', e.target.value)}
                />
                {enviado && errores.nombre && (
                    <span className="error">{errores.nombre}</span>
                )}
            </div>
            
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={valores.email}
                    onChange={(e) => cambiarValor('email', e.target.value)}
                />
                {enviado && errores.email && (
                    <span className="error">{errores.email}</span>
                )}
            </div>
            
            <button type="submit">Enviar</button>
            <button type="button" onClick={resetearFormulario}>
                Resetear
            </button>
        </form>
    );
};

export { useFormulario, useAPI, FormularioUsuario };''',
                'explanation': 'Este ejemplo muestra cómo crear hooks personalizados para reutilizar lógica entre componentes.'
            },
            'context': {
                'title': 'Context API y Providers',
                'code': '''// Ejemplo de Context API
import React, { createContext, useContext, useReducer } from 'react';

// Definir el contexto
const TemaContext = createContext();

// Estado inicial
const estadoInicial = {
    tema: 'claro',
    idioma: 'es'
};

// Reducer para manejar cambios de estado
const temaReducer = (estado, accion) => {
    switch (accion.tipo) {
        case 'CAMBIAR_TEMA':
            return {
                ...estado,
                tema: accion.payload
            };
        case 'CAMBIAR_IDIOMA':
            return {
                ...estado,
                idioma: accion.payload
            };
        default:
            return estado;
    }
};

/**
 * Provider del tema
 * Proporciona el contexto a toda la aplicación
 */
const TemaProvider = ({ children }) => {
    const [estado, dispatch] = useReducer(temaReducer, estadoInicial);
    
    // Función para cambiar tema
    const cambiarTema = (nuevoTema) => {
        dispatch({
            tipo: 'CAMBIAR_TEMA',
            payload: nuevoTema
        });
    };
    
    // Función para cambiar idioma
    const cambiarIdioma = (nuevoIdioma) => {
        dispatch({
            tipo: 'CAMBIAR_IDIOMA',
            payload: nuevoIdioma
        });
    };
    
    const valor = {
        ...estado,
        cambiarTema,
        cambiarIdioma
    };
    
    return (
        <TemaContext.Provider value={valor}>
            {children}
        </TemaContext.Provider>
    );
};

/**
 * Hook personalizado para usar el contexto
 * Facilita el acceso al contexto del tema
 */
const useTema = () => {
    const contexto = useContext(TemaContext);
    if (!contexto) {
        throw new Error('useTema debe usarse dentro de un TemaProvider');
    }
    return contexto;
};

/**
 * Componente que usa el contexto
 * Muestra información del tema actual
 */
const InformacionTema = () => {
    const { tema, idioma, cambiarTema, cambiarIdioma } = useTema();
    
    return (
        <div className={`tema-${tema}`}>
            <h2>Información del Tema</h2>
            <p>Tema actual: {tema}</p>
            <p>Idioma actual: {idioma}</p>
            
            <div className="controles">
                <button onClick={() => cambiarTema(tema === 'claro' ? 'oscuro' : 'claro')}>
                    Cambiar Tema
                </button>
                <button onClick={() => cambiarIdioma(idioma === 'es' ? 'en' : 'es')}>
                    Cambiar Idioma
                </button>
            </div>
        </div>
    );
};

/**
 * Componente que también usa el contexto
 * Muestra contenido basado en el tema
 */
const ContenidoDinamico = () => {
    const { tema, idioma } = useTema();
    
    const textos = {
        es: {
            titulo: 'Bienvenido',
            descripcion: 'Este es un ejemplo de Context API'
        },
        en: {
            titulo: 'Welcome',
            descripcion: 'This is a Context API example'
        }
    };
    
    return (
        <div className={`contenido tema-${tema}`}>
            <h1>{textos[idioma].titulo}</h1>
            <p>{textos[idioma].descripcion}</p>
        </div>
    );
};

// Componente principal que envuelve todo con el provider
const App = () => {
    return (
        <TemaProvider>
            <div className="app">
                <InformacionTema />
                <ContenidoDinamico />
            </div>
        </TemaProvider>
    );
};

export { TemaProvider, useTema, InformacionTema, ContenidoDinamico, App };''',
                'explanation': 'Este ejemplo muestra cómo usar Context API para compartir estado global entre componentes.'
            }
        }
        
        question_lower = question_text.lower()
        
        if 'component' in question_lower or 'hook' in question_lower:
            return examples['component']
        elif 'context' in question_lower or 'provider' in question_lower:
            return examples['context']
        elif 'custom' in question_lower or 'personalizado' in question_lower:
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
    
    def generate_unit_tests(self, example_code):
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
    
    def suggest_improvements(self, question_text):
        improvements = {
            'component': '''🚀 Mejoras Sugeridas:

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
   - Explicar dependencias y efectos''',
            
            'context': '''🚀 Mejoras Sugeridas:

1. **Optimización de Context:**
   - Dividir contextos grandes en contextos más pequeños
   - Usar useMemo para valores del contexto
   - Implementar selectores para evitar re-renders

2. **Patrones avanzados:**
   - Combinar Context con useReducer
   - Implementar middleware para context
   - Usar context para estado global

3. **Testing de Context:**
   - Probar providers y consumers
   - Verificar actualizaciones de contexto
   - Mockear context para pruebas

4. **Alternativas:**
   - Considerar Redux para estado complejo
   - Usar Zustand para estado simple
   - Implementar React Query para estado del servidor'''

        }
        
        question_lower = question_text.lower()
        
        if 'component' in question_lower or 'hook' in question_lower:
            return improvements['component']
        elif 'context' in question_lower or 'provider' in question_lower:
            return improvements['context']
        elif 'custom' in question_lower or 'personalizado' in question_lower:
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
        
        translated_question = self.translate_question(question_text)
        example = self.generate_example_code(question_text)
        unit_tests = self.generate_unit_tests(example['code'])
        results_prediction = self.predict_results(example['code'])
        improvements = self.suggest_improvements(question_text)
        
        processed_question = {
            'original_question': question_text,
            'translated_question': translated_question,
            'original_answer': answer_text,
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
    
    def save_processed_questions(self, output_file="react_questions_processed.json"):
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '640+ React.js Interview Questions and Answers',
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
        print("🚀 Iniciando procesamiento de preguntas de React.js")
        print("=" * 60)
        
        if not self.load_questions():
            return False
        
        self.process_all_questions(limit)
        self.save_processed_questions()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    input_file = "react_questions_structured.json"
    
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_react_questions.py")
        return
    
    processor = ReactQuestionProcessor(input_file)
    success = processor.run_processing(limit=10)
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: react_questions_processed.json")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 