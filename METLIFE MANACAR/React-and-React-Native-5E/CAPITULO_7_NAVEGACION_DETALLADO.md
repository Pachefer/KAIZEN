# 📖 CAPÍTULO 7: NAVEGACIÓN CON RUTAS
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Qué es React Router** y por qué es necesario
- ✅ **Configuración básica** de React Router v6
- ✅ **Creación de rutas** y navegación entre páginas
- ✅ **Rutas anidadas** y layouts compartidos
- ✅ **Parámetros de URL** y query parameters
- ✅ **Navegación programática** con useNavigate
- ✅ **Protección de rutas** y autenticación
- ✅ **Lazy loading** de rutas

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ ES REACT ROUTER?

### **Definición:**
React Router es una **biblioteca de navegación** para aplicaciones React que permite crear aplicaciones de una sola página (SPA) con múltiples vistas y navegación entre ellas sin recargar la página.

### **Beneficios:**
```javascript
// ❌ Sin React Router - Navegación manual
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  
  return (
    <div>
      {currentPage === 'home' && <Home />}
      {currentPage === 'about' && <About />}
      {currentPage === 'contact' && <Contact />}
    </div>
  );
}

// ✅ Con React Router - Navegación declarativa
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
```

---

## 💻 ANÁLISIS DEL CÓDIGO: NAVEGACIÓN BÁSICA

### **Archivo: `src/App.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React Router v6
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// 🎯 Importaciones de componentes de página
import Layout from "./Layout";
import First from "./First";
import Second from "./Second";

// 🎯 Configuración del router principal
// createBrowserRouter es la API moderna de React Router v6
const router = createBrowserRouter([
  {
    path: "/",           // Ruta raíz de la aplicación
    element: <Layout />, // Componente que se renderiza en la ruta raíz
    children: [          // Rutas hijas que se renderizan dentro del Layout
      {
        path: "/first",  // Ruta para la página First
        element: <First />,
      },
      {
        path: "/second", // Ruta para la página Second
        element: <Second />,
      },
    ],
  },
]);

// 🎯 Componente principal de la aplicación
function App() {
  // 🚀 RouterProvider envuelve toda la aplicación con el router configurado
  return <RouterProvider router={router} />;
}

// 📤 Exportación del componente
export default App;
```

### **Archivo: `src/Layout.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React Router
import { Link, Outlet } from "react-router-dom";

// 🎯 Componente Layout que actúa como contenedor principal
function Layout() {
  return (
    <>
      {/* 🧭 Navegación principal de la aplicación */}
      <nav>
        <p>
          {/* 🔗 Link crea enlaces de navegación sin recargar la página */}
          <Link to="first">First</Link>
        </p>
        <p>
          <Link to="second">Second</Link>
        </p>
      </nav>
      
      {/* 📄 Contenedor principal donde se renderizan las rutas hijas */}
      <main>
        {/* 🎯 Outlet renderiza el componente de la ruta activa */}
        <Outlet />
      </main>
    </>
  );
}

// 📤 Exportación del componente
export default Layout;
```

### **Archivo: `src/First.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Componente de página First
function First() {
  // 🚀 Retorno de JSX simple para la página First
  return <h1>First</h1>;
}

// 📤 Exportación del componente
export default First;
```

### **Archivo: `src/Second.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Componente de página Second
function First() {
  // 🚀 Retorno de JSX simple para la página Second
  return <h1>Second</h1>;
}

// 📤 Exportación del componente
export default First;
```

---

## 🔍 DESGLOSE DETALLADO

### **Análisis de la Configuración del Router:**

#### **createBrowserRouter:**
```typescript
// 🎯 Configuración del router con rutas anidadas
const router = createBrowserRouter([
  {
    path: "/",           // Ruta raíz
    element: <Layout />, // Layout compartido
    children: [          // Rutas hijas
      {
        path: "/first",  // Ruta absoluta
        element: <First />,
      },
      {
        path: "/second", // Ruta absoluta
        element: <Second />,
      },
    ],
  },
]);
```

#### **Estructura de Rutas:**
```typescript
// 🎯 Tipos de rutas en React Router
interface RouteConfig {
  path: string;           // Patrón de URL
  element: React.ReactNode; // Componente a renderizar
  children?: RouteConfig[]; // Rutas hijas (anidadas)
  index?: boolean;        // Ruta por defecto
}
```

### **Análisis de Componentes de Navegación:**

#### **Link Component:**
```tsx
// 🎯 Link crea enlaces de navegación
<Link to="first">First</Link>
<Link to="/absolute/path">Absolute Path</Link>
<Link to="../relative/path">Relative Path</Link>
```

#### **Outlet Component:**
```tsx
// 🎯 Outlet renderiza rutas hijas
<main>
  <Outlet /> {/* Aquí se renderiza First o Second */}
</main>
```

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Configuración del Router**
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App con React Router', () => {
  it('debe renderizar el layout con navegación', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Verificar que los enlaces de navegación están presentes
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('debe renderizar la página First por defecto', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Verificar que se renderiza el contenido de First
    expect(screen.getByText('First')).toBeInTheDocument();
  });
});
```

### **Test 2: Verificación de Navegación**
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Layout from './Layout';

describe('Layout con navegación', () => {
  it('debe renderizar enlaces de navegación', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    // Verificar enlaces
    const firstLink = screen.getByText('First');
    const secondLink = screen.getByText('Second');
    
    expect(firstLink).toBeInTheDocument();
    expect(secondLink).toBeInTheDocument();
    expect(firstLink.tagName).toBe('A');
    expect(secondLink.tagName).toBe('A');
  });

  it('debe tener el atributo href correcto', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    const firstLink = screen.getByText('First');
    const secondLink = screen.getByText('Second');
    
    expect(firstLink).toHaveAttribute('href', '/first');
    expect(secondLink).toHaveAttribute('href', '/second');
  });
});
```

### **Test 3: Verificación de Componentes de Página**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import First from './First';
import Second from './Second';

describe('Componentes de página', () => {
  it('debe renderizar First correctamente', () => {
    render(<First />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('debe renderizar Second correctamente', () => {
    render(<Second />);
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

### **Test 4: Verificación de Rutas Anidadas**
```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Layout from './Layout';
import First from './First';
import Second from './Second';

describe('Rutas anidadas', () => {
  it('debe renderizar First en la ruta /first', () => {
    render(
      <MemoryRouter initialEntries={['/first']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="first" element={<First />} />
            <Route path="second" element={<Second />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).not.toBeInTheDocument();
  });

  it('debe renderizar Second en la ruta /second', () => {
    render(
      <MemoryRouter initialEntries={['/second']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="first" element={<First />} />
            <Route path="second" element={<Second />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('First')).not.toBeInTheDocument();
  });
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en el Navegador:**
```html
<!-- HTML generado por React Router -->
<div id="root">
  <div>
    <nav>
      <p>
        <a href="/first">First</a>
      </p>
      <p>
        <a href="/second">Second</a>
      </p>
    </nav>
    <main>
      <h1>First</h1> <!-- o <h1>Second</h1> dependiendo de la ruta -->
    </main>
  </div>
</div>
```

### **Comportamiento de Navegación:**
1. **URL inicial**: `/` - Muestra Layout con navegación
2. **Click en "First"**: URL cambia a `/first` - Renderiza componente First
3. **Click en "Second"**: URL cambia a `/second` - Renderiza componente Second
4. **Navegación**: Sin recargar la página (SPA)

### **Estructura de URLs:**
```
/           → Layout (con navegación)
/first      → Layout + First
/second     → Layout + Second
```

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Rutas con Parámetros**
```tsx
// 🎯 Configuración de rutas con parámetros
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/users/:id",
        element: <UserProfile />,
      },
      {
        path: "/posts/:postId",
        element: <PostDetail />,
      },
    ],
  },
]);

// 🎯 Componente que usa parámetros
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <h1>Perfil del Usuario {id}</h1>
      {/* Lógica para cargar datos del usuario */}
    </div>
  );
}
```

### **Ejercicio 2: Navegación Programática**
```tsx
// 🎯 Hook useNavigate para navegación programática
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Lógica de autenticación
      const success = await login(credentials);
      
      if (success) {
        // Navegación programática después del login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error de login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
```

### **Ejercicio 3: Rutas Protegidas**
```tsx
// 🎯 Componente de ruta protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

function ProtectedRoute({ 
  children, 
  isAuthenticated, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return isAuthenticated ? <>{children}</> : null;
}

// 🎯 Uso en configuración de rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute isAuthenticated={isLoggedIn}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

### **Ejercicio 4: Query Parameters**
```tsx
// 🎯 Hook useSearchParams para query parameters
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'name';

  const handleCategoryChange = (newCategory: string) => {
    setSearchParams({ category: newCategory, sort });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({ category, sort: newSort });
  };

  return (
    <div>
      <h1>Productos {category && `- ${category}`}</h1>
      
      <select value={category || ''} onChange={(e) => handleCategoryChange(e.target.value)}>
        <option value="">Todas las categorías</option>
        <option value="electronics">Electrónicos</option>
        <option value="clothing">Ropa</option>
      </select>

      <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="name">Por nombre</option>
        <option value="price">Por precio</option>
      </select>

      {/* Lista de productos filtrada */}
    </div>
  );
}
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Diferencias entre React Router v5 y v6:**
```typescript
// 🎯 React Router v5 (Legacy)
import { BrowserRouter, Route, Switch } from 'react-router-dom';

<BrowserRouter>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
  </Switch>
</BrowserRouter>

// ✅ React Router v6 (Moderno)
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

<RouterProvider router={router} />
```

### **Tipos de Rutas:**
```typescript
// 🎯 Rutas básicas
{ path: "/", element: <Home /> }

// 🎯 Rutas con parámetros
{ path: "/users/:id", element: <UserProfile /> }

// 🎯 Rutas anidadas
{
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "users", element: <UserList /> },
    { path: "settings", element: <Settings /> }
  ]
}

// 🎯 Rutas con wildcard
{ path: "*", element: <NotFound /> }
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```tsx
// ✅ Usar rutas anidadas para layouts compartidos
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> }
    ]
  }
]);

// ✅ Usar Link en lugar de <a> para navegación interna
<Link to="/about">Acerca de</Link>

// ✅ Usar useNavigate para navegación programática
const navigate = useNavigate();
navigate('/dashboard');

// ✅ Proteger rutas sensibles
<ProtectedRoute isAuthenticated={isLoggedIn}>
  <AdminPanel />
</ProtectedRoute>

// ✅ Usar lazy loading para rutas grandes
const Dashboard = lazy(() => import('./Dashboard'));
```

### **❌ Evitar:**
```tsx
// ❌ Usar <a> para navegación interna
<a href="/about">Acerca de</a>

// ❌ No manejar rutas no encontradas
// Siempre incluir una ruta catch-all

// ❌ No proteger rutas sensibles
// Siempre verificar autenticación

// ❌ Cargar todo de una vez
// Usar lazy loading para mejor rendimiento
```

---

## 🔄 CONCEPTOS AVANZADOS

### **Lazy Loading de Rutas:**
```tsx
// 🎯 Lazy loading con React.lazy
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const AdminPanel = lazy(() => import('./AdminPanel'));

// 🎯 Configuración con Suspense
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<div>Cargando...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
]);
```

### **Navegación con Estado:**
```tsx
// 🎯 Pasar estado a través de la navegación
import { useNavigate, useLocation } from 'react-router-dom';

function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`, {
      state: { product, from: location.pathname }
    });
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id} onClick={() => handleProductClick(product)}>
          {product.name}
        </div>
      ))}
    </div>
  );
}

// 🎯 Recibir estado en el componente destino
function ProductDetail() {
  const location = useLocation();
  const product = location.state?.product;

  return (
    <div>
      <h1>{product?.name}</h1>
      <Link to={location.state?.from || '/products'}>
        Volver a productos
      </Link>
    </div>
  );
}
```

### **Middleware de Rutas:**
```tsx
// 🎯 Middleware para logging de navegación
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function NavigationLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log('Navegación a:', location.pathname);
    // Analytics tracking
    analytics.track('page_view', { path: location.pathname });
  }, [location]);

  return null;
}

// 🎯 Uso en la aplicación
function App() {
  return (
    <>
      <NavigationLogger />
      <RouterProvider router={router} />
    </>
  );
}
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **React Router** permite navegación en SPAs
2. **createBrowserRouter** es la API moderna de React Router v6
3. **Rutas anidadas** permiten layouts compartidos
4. **Link y Outlet** son componentes fundamentales
5. **useNavigate** permite navegación programática

### **Habilidades Desarrolladas:**
- ✅ Configurar React Router en aplicaciones React
- ✅ Crear rutas básicas y anidadas
- ✅ Implementar navegación entre páginas
- ✅ Usar parámetros de URL y query parameters
- ✅ Proteger rutas con autenticación
- ✅ Implementar lazy loading de rutas

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Code Splitting**, optimizando el rendimiento de las aplicaciones React.

---

## 🎯 EJERCICIOS PRÁCTICOS

### **Ejercicio 1: Aplicación de Blog**
```tsx
// Crea una aplicación de blog con las siguientes rutas:
// - / (Home con lista de posts)
// - /post/:id (Detalle de post)
// - /author/:id (Perfil de autor)
// - /category/:category (Posts por categoría)
// - /search?q=query (Búsqueda de posts)
```

### **Ejercicio 2: Panel de Administración**
```tsx
// Crea un panel de administración con:
// - Rutas protegidas por autenticación
// - Layout compartido con sidebar
// - Subrutas para diferentes secciones
// - Navegación programática
```

### **Ejercicio 3: E-commerce**
```tsx
// Crea una aplicación de e-commerce con:
// - Catálogo de productos con filtros
// - Carrito de compras
// - Proceso de checkout
// - Historial de pedidos
// - Perfil de usuario
```

---

*¡Excelente! Has completado el análisis detallado del Capítulo 7. Ahora entiendes cómo implementar navegación en aplicaciones React con React Router. Estás listo para continuar con Code Splitting en el siguiente capítulo.* 