# ⚛️ React - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de React](#fundamentos-de-react)
2. [Hooks Avanzados](#hooks-avanzados)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Optimización de Rendimiento](#optimización-de-rendimiento)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de React

### Componentes Funcionales vs Clase

```jsx
// Componente Funcional (Recomendado)
// Este es el enfoque moderno de React usando hooks
const MiComponente = ({ nombre, edad }) => {
  // useState hook para manejar estado local
  const [contador, setContador] = useState(0);
  
  // useEffect hook para efectos secundarios
  useEffect(() => {
    // Este código se ejecuta después del renderizado
    console.log('Componente montado');
    
    // Función de limpieza (cleanup)
    return () => {
      console.log('Componente desmontado');
    };
  }, []); // Array vacío = solo se ejecuta una vez
  
  // Función para manejar eventos
  const incrementarContador = () => {
    setContador(prevContador => prevContador + 1);
  };
  
  // Renderizado del componente
  return (
    <div className="mi-componente">
      <h2>Hola {nombre}, tienes {edad} años</h2>
      <p>Contador: {contador}</p>
      <button onClick={incrementarContador}>
        Incrementar
      </button>
    </div>
  );
};

// Componente de Clase (Legacy)
class MiComponenteClase extends React.Component {
  // Constructor para inicializar estado
  constructor(props) {
    super(props);
    this.state = {
      contador: 0
    };
  }
  
  // Método del ciclo de vida
  componentDidMount() {
    console.log('Componente montado');
  }
  
  componentWillUnmount() {
    console.log('Componente desmontado');
  }
  
  // Método para manejar eventos
  incrementarContador = () => {
    this.setState(prevState => ({
      contador: prevState.contador + 1
    }));
  };
  
  // Método de renderizado
  render() {
    const { nombre, edad } = this.props;
    const { contador } = this.state;
    
    return (
      <div className="mi-componente">
        <h2>Hola {nombre}, tienes {edad} años</h2>
        <p>Contador: {contador}</p>
        <button onClick={this.incrementarContador}>
          Incrementar
        </button>
      </div>
    );
  }
}
```

### Props y Estado

```jsx
// Componente padre que pasa props
const App = () => {
  // Estado local del componente padre
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan', edad: 25 },
    { id: 2, nombre: 'María', edad: 30 }
  ]);
  
  // Función para agregar usuario
  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios(prevUsuarios => [...prevUsuarios, nuevoUsuario]);
  };
  
  // Función para eliminar usuario
  const eliminarUsuario = (id) => {
    setUsuarios(prevUsuarios => 
      prevUsuarios.filter(usuario => usuario.id !== id)
    );
  };
  
  return (
    <div className="app">
      {/* Pasando props al componente hijo */}
      <ListaUsuarios 
        usuarios={usuarios}
        onEliminarUsuario={eliminarUsuario}
      />
      <FormularioUsuario onAgregarUsuario={agregarUsuario} />
    </div>
  );
};

// Componente hijo que recibe props
const ListaUsuarios = ({ usuarios, onEliminarUsuario }) => {
  return (
    <div className="lista-usuarios">
      <h3>Lista de Usuarios</h3>
      {usuarios.map(usuario => (
        <div key={usuario.id} className="usuario-item">
          <span>{usuario.nombre} - {usuario.edad} años</span>
          <button onClick={() => onEliminarUsuario(usuario.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 🎣 Hooks Avanzados

### useState con Objetos Complejos

```jsx
const FormularioUsuario = ({ onAgregarUsuario }) => {
  // Estado para el formulario con objeto complejo
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    direccion: {
      calle: '',
      ciudad: '',
      codigoPostal: ''
    }
  });
  
  // Estado para validación
  const [errores, setErrores] = useState({});
  
  // Función para actualizar campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizar estado anidado
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Función para validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.includes('@')) {
      nuevosErrores.email = 'Email inválido';
    }
    
    if (formData.edad < 18) {
      nuevosErrores.edad = 'Debe ser mayor de 18 años';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  // Función para enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      const nuevoUsuario = {
        id: Date.now(), // ID temporal
        ...formData,
        edad: parseInt(formData.edad)
      };
      
      onAgregarUsuario(nuevoUsuario);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        edad: '',
        direccion: {
          calle: '',
          ciudad: '',
          codigoPostal: ''
        }
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="formulario-usuario">
      <h3>Agregar Usuario</h3>
      
      <div className="campo-formulario">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          className={errores.nombre ? 'error' : ''}
        />
        {errores.nombre && <span className="error-text">{errores.nombre}</span>}
      </div>
      
      <div className="campo-formulario">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={errores.email ? 'error' : ''}
        />
        {errores.email && <span className="error-text">{errores.email}</span>}
      </div>
      
      <div className="campo-formulario">
        <label htmlFor="edad">Edad:</label>
        <input
          type="number"
          id="edad"
          name="edad"
          value={formData.edad}
          onChange={handleInputChange}
          className={errores.edad ? 'error' : ''}
        />
        {errores.edad && <span className="error-text">{errores.edad}</span>}
      </div>
      
      <div className="campo-formulario">
        <label htmlFor="calle">Calle:</label>
        <input
          type="text"
          id="calle"
          name="direccion.calle"
          value={formData.direccion.calle}
          onChange={handleInputChange}
        />
      </div>
      
      <button type="submit">Agregar Usuario</button>
    </form>
  );
};
```

### useEffect Avanzado

```jsx
const UsuarioDetalle = ({ usuarioId }) => {
  // Estados para manejar datos y loading
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // useEffect para cargar datos del usuario
  useEffect(() => {
    // Función async para cargar datos
    const cargarUsuario = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular llamada a API
        const response = await fetch(`/api/usuarios/${usuarioId}`);
        
        if (!response.ok) {
          throw new Error('Usuario no encontrado');
        }
        
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Solo cargar si tenemos un ID válido
    if (usuarioId) {
      cargarUsuario();
    }
    
    // Cleanup function para cancelar requests pendientes
    return () => {
      // Aquí podrías cancelar requests si usas AbortController
    };
  }, [usuarioId]); // Dependencia: se ejecuta cuando cambia usuarioId
  
  // useEffect para actualizar título de la página
  useEffect(() => {
    if (usuario) {
      document.title = `Usuario: ${usuario.nombre}`;
    }
    
    // Cleanup: restaurar título original
    return () => {
      document.title = 'Mi Aplicación';
    };
  }, [usuario]);
  
  // useEffect para logging
  useEffect(() => {
    console.log('Usuario actualizado:', usuario);
  }, [usuario]);
  
  // Renderizado condicional
  if (loading) {
    return <div>Cargando usuario...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!usuario) {
    return <div>No se encontró el usuario</div>;
  }
  
  return (
    <div className="usuario-detalle">
      <h2>{usuario.nombre}</h2>
      <p>Email: {usuario.email}</p>
      <p>Edad: {usuario.edad}</p>
      <p>Dirección: {usuario.direccion.calle}, {usuario.direccion.ciudad}</p>
    </div>
  );
};
```

### Custom Hooks

```jsx
// Custom hook para manejar formularios
const useFormulario = (valoresIniciales, validaciones) => {
  // Estado para los valores del formulario
  const [valores, setValores] = useState(valoresIniciales);
  
  // Estado para los errores
  const [errores, setErrores] = useState({});
  
  // Estado para indicar si el formulario ha sido enviado
  const [enviado, setEnviado] = useState(false);
  
  // Función para actualizar valores
  const actualizarValor = (nombre, valor) => {
    setValores(prev => ({
      ...prev,
      [nombre]: valor
    }));
    
    // Validar campo específico si hay validaciones
    if (validaciones[nombre]) {
      const error = validaciones[nombre](valor);
      setErrores(prev => ({
        ...prev,
        [nombre]: error
      }));
    }
  };
  
  // Función para validar todo el formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    Object.keys(validaciones).forEach(campo => {
      const error = validaciones[campo](valores[campo]);
      if (error) {
        nuevosErrores[campo] = error;
      }
    });
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  // Función para enviar formulario
  const enviarFormulario = (callback) => {
    setEnviado(true);
    
    if (validarFormulario()) {
      callback(valores);
      // Resetear formulario después del envío exitoso
      setValores(valoresIniciales);
      setEnviado(false);
    }
  };
  
  // Función para resetear formulario
  const resetearFormulario = () => {
    setValores(valoresIniciales);
    setErrores({});
    setEnviado(false);
  };
  
  return {
    valores,
    errores,
    enviado,
    actualizarValor,
    validarFormulario,
    enviarFormulario,
    resetearFormulario
  };
};

// Custom hook para manejar API calls
const useApi = (url) => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const ejecutarRequest = async (opciones = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...opciones.headers
        },
        ...opciones
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const resultado = await response.json();
      setDatos(resultado);
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    datos,
    loading,
    error,
    ejecutarRequest
  };
};

// Ejemplo de uso de custom hooks
const FormularioAvanzado = () => {
  // Validaciones para el formulario
  const validaciones = {
    nombre: (valor) => !valor.trim() ? 'Nombre es requerido' : '',
    email: (valor) => !valor.includes('@') ? 'Email inválido' : '',
    edad: (valor) => valor < 18 ? 'Debe ser mayor de 18' : ''
  };
  
  // Usar custom hook para formulario
  const {
    valores,
    errores,
    enviado,
    actualizarValor,
    enviarFormulario
  } = useFormulario({
    nombre: '',
    email: '',
    edad: ''
  }, validaciones);
  
  // Usar custom hook para API
  const { ejecutarRequest, loading } = useApi('/api/usuarios');
  
  const handleSubmit = async (datosFormulario) => {
    try {
      await ejecutarRequest({
        method: 'POST',
        body: JSON.stringify(datosFormulario)
      });
      alert('Usuario creado exitosamente');
    } catch (error) {
      alert('Error al crear usuario');
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      enviarFormulario(handleSubmit);
    }}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={valores.nombre}
          onChange={(e) => actualizarValor('nombre', e.target.value)}
        />
        {enviado && errores.nombre && <span>{errores.nombre}</span>}
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={valores.email}
          onChange={(e) => actualizarValor('email', e.target.value)}
        />
        {enviado && errores.email && <span>{errores.email}</span>}
      </div>
      
      <div>
        <label>Edad:</label>
        <input
          type="number"
          value={valores.edad}
          onChange={(e) => actualizarValor('edad', e.target.value)}
        />
        {enviado && errores.edad && <span>{errores.edad}</span>}
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};
```

---

## 🎨 Patrones de Diseño

### Render Props Pattern

```jsx
// Componente que usa render props
const MouseTracker = ({ render }) => {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const actualizarPosicion = (evento) => {
      setPosicion({
        x: evento.clientX,
        y: evento.clientY
      });
    };
    
    window.addEventListener('mousemove', actualizarPosicion);
    
    return () => {
      window.removeEventListener('mousemove', actualizarPosicion);
    };
  }, []);
  
  // Renderizar usando la función proporcionada
  return render(posicion);
};

// Uso del componente
const App = () => {
  return (
    <div>
      <h1>Rastreador de Mouse</h1>
      <MouseTracker
        render={({ x, y }) => (
          <p>Posición del mouse: ({x}, {y})</p>
        )}
      />
      
      <MouseTracker
        render={({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 20,
              height: 20,
              backgroundColor: 'red',
              borderRadius: '50%'
            }}
          />
        )}
      />
    </div>
  );
};
```

### Higher-Order Components (HOC)

```jsx
// HOC para manejar loading
const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    
    useEffect(() => {
      // Simular carga de datos
      const cargarDatos = async () => {
        try {
          setLoading(true);
          // Simular delay de API
          await new Promise(resolve => setTimeout(resolve, 2000));
          setData({ mensaje: 'Datos cargados exitosamente' });
        } catch (error) {
          console.error('Error cargando datos:', error);
        } finally {
          setLoading(false);
        }
      };
      
      cargarDatos();
    }, []);
    
    if (loading) {
      return <div>Cargando...</div>;
    }
    
    // Pasar props originales más los datos cargados
    return <WrappedComponent {...props} data={data} />;
  };
};

// HOC para manejar errores
const withErrorBoundary = (WrappedComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('Error capturado:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <h2>Algo salió mal</h2>
            <p>{this.state.error.message}</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Intentar de nuevo
            </button>
          </div>
        );
      }
      
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Componente que usa los HOCs
const MiComponente = ({ data }) => {
  return (
    <div>
      <h2>Mi Componente</h2>
      <p>{data?.mensaje}</p>
    </div>
  );
};

// Aplicar múltiples HOCs
const MiComponenteConHOCs = withErrorBoundary(withLoading(MiComponente));

// Uso
const App = () => {
  return (
    <div>
      <h1>Ejemplo de HOCs</h1>
      <MiComponenteConHOCs />
    </div>
  );
};
```

---

## ⚡ Optimización de Rendimiento

### React.memo

```jsx
// Componente optimizado con React.memo
const UsuarioItem = React.memo(({ usuario, onEliminar, onEditar }) => {
  console.log(`Renderizando UsuarioItem: ${usuario.nombre}`);
  
  return (
    <div className="usuario-item">
      <h3>{usuario.nombre}</h3>
      <p>{usuario.email}</p>
      <div className="acciones">
        <button onClick={() => onEditar(usuario.id)}>
          Editar
        </button>
        <button onClick={() => onEliminar(usuario.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
});

// Componente padre que maneja la lista
const ListaUsuariosOptimizada = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan', email: 'juan@email.com' },
    { id: 2, nombre: 'María', email: 'maria@email.com' },
    { id: 3, nombre: 'Pedro', email: 'pedro@email.com' }
  ]);
  
  // Funciones memoizadas con useCallback
  const handleEliminar = useCallback((id) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  }, []);
  
  const handleEditar = useCallback((id) => {
    console.log(`Editando usuario ${id}`);
  }, []);
  
  return (
    <div className="lista-usuarios">
      {usuarios.map(usuario => (
        <UsuarioItem
          key={usuario.id}
          usuario={usuario}
          onEliminar={handleEliminar}
          onEditar={handleEditar}
        />
      ))}
    </div>
  );
};
```

### useMemo y useCallback

```jsx
const CalculadoraAvanzada = ({ numeros, operacion }) => {
  // useMemo para cálculos costosos
  const resultado = useMemo(() => {
    console.log('Calculando resultado...');
    
    switch (operacion) {
      case 'suma':
        return numeros.reduce((acc, num) => acc + num, 0);
      case 'multiplicacion':
        return numeros.reduce((acc, num) => acc * num, 1);
      case 'promedio':
        return numeros.reduce((acc, num) => acc + num, 0) / numeros.length;
      default:
        return 0;
    }
  }, [numeros, operacion]); // Solo recalcular si cambian numeros o operacion
  
  // useCallback para funciones que se pasan como props
  const handleReset = useCallback(() => {
    console.log('Reseteando calculadora');
  }, []); // Array vacío = función nunca cambia
  
  const handleExportar = useCallback((formato) => {
    console.log(`Exportando en formato ${formato}`);
  }, []); // Sin dependencias = función nunca cambia
  
  return (
    <div className="calculadora">
      <h3>Calculadora</h3>
      <p>Operación: {operacion}</p>
      <p>Números: {numeros.join(', ')}</p>
      <p>Resultado: {resultado}</p>
      
      <div className="acciones">
        <button onClick={handleReset}>Reset</button>
        <button onClick={() => handleExportar('JSON')}>Exportar JSON</button>
        <button onClick={() => handleExportar('CSV')}>Exportar CSV</button>
      </div>
    </div>
  );
};
```

---

## 🧪 Testing

### Testing con Jest y React Testing Library

```jsx
// Componente a testear
const Contador = ({ valorInicial = 0 }) => {
  const [contador, setContador] = useState(valorInicial);
  
  const incrementar = () => setContador(prev => prev + 1);
  const decrementar = () => setContador(prev => prev - 1);
  const resetear = () => setContador(valorInicial);
  
  return (
    <div className="contador">
      <h2>Contador: {contador}</h2>
      <div className="controles">
        <button onClick={decrementar} data-testid="decrementar">
          -
        </button>
        <button onClick={resetear} data-testid="resetear">
          Reset
        </button>
        <button onClick={incrementar} data-testid="incrementar">
          +
        </button>
      </div>
    </div>
  );
};

// Tests
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Contador', () => {
  // Test de renderizado inicial
  test('renderiza con valor inicial correcto', () => {
    render(<Contador valorInicial={5} />);
    
    // Verificar que el contador muestra el valor inicial
    expect(screen.getByText('Contador: 5')).toBeInTheDocument();
  });
  
  // Test de incremento
  test('incrementa el contador al hacer clic en +', () => {
    render(<Contador />);
    
    const botonIncrementar = screen.getByTestId('incrementar');
    const contadorElement = screen.getByText('Contador: 0');
    
    // Hacer clic en el botón de incrementar
    fireEvent.click(botonIncrementar);
    
    // Verificar que el contador se incrementó
    expect(contadorElement).toHaveTextContent('Contador: 1');
  });
  
  // Test de decremento
  test('decrementa el contador al hacer clic en -', () => {
    render(<Contador valorInicial={5} />);
    
    const botonDecrementar = screen.getByTestId('decrementar');
    const contadorElement = screen.getByText('Contador: 5');
    
    // Hacer clic en el botón de decrementar
    fireEvent.click(botonDecrementar);
    
    // Verificar que el contador se decrementó
    expect(contadorElement).toHaveTextContent('Contador: 4');
  });
  
  // Test de reset
  test('resetea el contador al valor inicial', () => {
    render(<Contador valorInicial={10} />);
    
    const botonIncrementar = screen.getByTestId('incrementar');
    const botonResetear = screen.getByTestId('resetear');
    const contadorElement = screen.getByText('Contador: 10');
    
    // Incrementar el contador
    fireEvent.click(botonIncrementar);
    fireEvent.click(botonIncrementar);
    
    // Verificar que se incrementó
    expect(contadorElement).toHaveTextContent('Contador: 12');
    
    // Resetear el contador
    fireEvent.click(botonResetear);
    
    // Verificar que volvió al valor inicial
    expect(contadorElement).toHaveTextContent('Contador: 10');
  });
  
  // Test de múltiples interacciones
  test('maneja múltiples interacciones correctamente', () => {
    render(<Contador />);
    
    const botonIncrementar = screen.getByTestId('incrementar');
    const botonDecrementar = screen.getByTestId('decrementar');
    const contadorElement = screen.getByText('Contador: 0');
    
    // Secuencia de interacciones
    fireEvent.click(botonIncrementar); // 1
    fireEvent.click(botonIncrementar); // 2
    fireEvent.click(botonDecrementar); // 1
    fireEvent.click(botonIncrementar); // 2
    fireEvent.click(botonIncrementar); // 3
    
    // Verificar resultado final
    expect(contadorElement).toHaveTextContent('Contador: 3');
  });
});

// Test de custom hooks
import { renderHook, act } from '@testing-library/react-hooks';
import { useFormulario } from './hooks/useFormulario';

describe('useFormulario', () => {
  const valoresIniciales = { nombre: '', email: '' };
  const validaciones = {
    nombre: (valor) => !valor.trim() ? 'Nombre requerido' : '',
    email: (valor) => !valor.includes('@') ? 'Email inválido' : ''
  };
  
  test('inicializa con valores correctos', () => {
    const { result } = renderHook(() => 
      useFormulario(valoresIniciales, validaciones)
    );
    
    expect(result.current.valores).toEqual(valoresIniciales);
    expect(result.current.errores).toEqual({});
    expect(result.current.enviado).toBe(false);
  });
  
  test('actualiza valores correctamente', () => {
    const { result } = renderHook(() => 
      useFormulario(valoresIniciales, validaciones)
    );
    
    act(() => {
      result.current.actualizarValor('nombre', 'Juan');
    });
    
    expect(result.current.valores.nombre).toBe('Juan');
  });
  
  test('valida campos correctamente', () => {
    const { result } = renderHook(() => 
      useFormulario(valoresIniciales, validaciones)
    );
    
    act(() => {
      result.current.actualizarValor('nombre', '');
      result.current.actualizarValor('email', 'email-invalido');
    });
    
    expect(result.current.errores.nombre).toBe('Nombre requerido');
    expect(result.current.errores.email).toBe('Email inválido');
  });
});
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es React y cuáles son sus características principales?**
   - React es una biblioteca de JavaScript para construir interfaces de usuario
   - Características: Componentes, Virtual DOM, JSX, Unidireccional data flow

2. **¿Cuál es la diferencia entre componentes funcionales y de clase?**
   - Funcionales: Usan hooks, más simples, mejor rendimiento
   - Clase: Usan métodos del ciclo de vida, más verbosos

3. **¿Qué son los hooks y cuáles son los más importantes?**
   - useState: Para estado local
   - useEffect: Para efectos secundarios
   - useContext: Para contexto global
   - useRef: Para referencias DOM
   - useMemo/useCallback: Para optimización

### Preguntas Intermedias

4. **¿Cómo funciona el Virtual DOM?**
   - Representación en memoria del DOM real
   - Comparación eficiente de cambios
   - Actualización mínima del DOM real

5. **¿Qué es el patrón de render props?**
   - Pasar una función como prop para renderizar contenido
   - Permite compartir lógica entre componentes
   - Alternativa a HOCs

6. **¿Cómo optimizas el rendimiento en React?**
   - React.memo para componentes
   - useMemo para cálculos costosos
   - useCallback para funciones
   - Lazy loading de componentes

### Preguntas Avanzadas

7. **¿Cómo implementarías un sistema de autenticación en React?**
   - Context API para estado global
   - Protected routes
   - Token management
   - Refresh tokens

8. **¿Qué es el patrón de compound components?**
   - Componentes que trabajan juntos
   - Comparten estado implícitamente
   - API más flexible

9. **¿Cómo manejarías el estado global en una aplicación grande?**
   - Redux para estado complejo
   - Context API para estado simple
   - Zustand como alternativa ligera
   - Considerar arquitectura de estado

### Preguntas de Código

10. **Implementa un hook personalizado para manejar formularios**
    ```jsx
    const useForm = (initialValues) => {
      const [values, setValues] = useState(initialValues);
      const [errors, setErrors] = useState({});
      
      const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
      };
      
      const handleSubmit = (callback) => {
        callback(values);
      };
      
      return { values, errors, handleChange, handleSubmit };
    };
    ```

11. **Crea un componente de lista virtualizada**
    ```jsx
    const VirtualList = ({ items, itemHeight, containerHeight }) => {
      const [scrollTop, setScrollTop] = useState(0);
      
      const visibleItems = items.slice(
        Math.floor(scrollTop / itemHeight),
        Math.floor(scrollTop / itemHeight) + Math.ceil(containerHeight / itemHeight)
      );
      
      return (
        <div 
          style={{ height: containerHeight, overflow: 'auto' }}
          onScroll={(e) => setScrollTop(e.target.scrollTop)}
        >
          <div style={{ height: items.length * itemHeight }}>
            {visibleItems.map(item => (
              <div key={item.id} style={{ height: itemHeight }}>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      );
    };
    ```

---

## 📚 Recursos Adicionales

- [Documentación oficial de React](https://reactjs.org/docs/getting-started.html)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de React! 🚀** 