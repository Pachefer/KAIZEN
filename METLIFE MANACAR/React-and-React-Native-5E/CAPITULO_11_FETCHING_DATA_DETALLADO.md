# 📖 CAPÍTULO 11: OBTENCIÓN DE DATOS DEL SERVIDOR
## Análisis Completo y Detallado

---

## 🎯 OBJETIVOS DEL CAPÍTULO

Al completar este capítulo, comprenderás:
- ✅ **Fetch API** y cómo usarla en React
- ✅ **Axios** y sus ventajas sobre fetch
- ✅ **React Query** para gestión de estado de datos
- ✅ **GraphQL** y consultas dinámicas
- ✅ **Manejo de estados de carga** y errores
- ✅ **Interceptores** y configuración de requests
- ✅ **Tipado TypeScript** para APIs
- ✅ **Patrones de fetching** y optimización

---

## 🔍 CONCEPTO FUNDAMENTAL: ¿QUÉ ES FETCHING DE DATOS?

### **Definición:**
Fetching de datos es el proceso de **obtener información desde servidores externos** para mostrarla en aplicaciones React. Esto incluye APIs REST, GraphQL, y otros servicios web.

### **Métodos Principales:**
```javascript
// 🎯 Fetch API nativo
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// 🎯 Axios (biblioteca popular)
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data));

// 🎯 React Query (gestión de estado)
const { data, isLoading, error } = useQuery('data', fetchData);
```

---

## 💻 ANÁLISIS DEL CÓDIGO: FETCH API

### **Archivo: `src/GitHubUser.ts`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 🎯 Interfaz TypeScript para datos de usuario de GitHub
// Define la estructura de datos que esperamos recibir de la API
export interface GitHubUser {
  login: string;           // Nombre de usuario único
  id: number;              // ID numérico del usuario
  avatar_url: string;      // URL de la imagen de perfil
  html_url: string;        // URL del perfil público
  gists_url: string;       // URL para gists del usuario
  repos_url: string;       // URL para repositorios del usuario
  name: string;            // Nombre real del usuario
  company: string | null;  // Empresa (puede ser null)
  location: string | null; // Ubicación (puede ser null)
  bio: string | null;      // Biografía (puede ser null)
  public_repos: number;    // Número de repositorios públicos
  public_gists: number;    // Número de gists públicos
  followers: number;       // Número de seguidores
  following: number;       // Número de usuarios seguidos
}
```

### **Archivo: `src/App.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React y componentes
import { useEffect, useState } from "react";
import { GitHubUser } from "./GitHubUser";
import UserInfo from "./UserInfo";

// 🎯 Componente principal que maneja el fetching de datos
function App() {
  // 📊 Estado para almacenar los datos del usuario
  // Puede ser undefined hasta que se carguen los datos
  const [user, setUser] = useState<GitHubUser>();
  
  // 📊 Estado para indicar si está cargando
  const [loading, setLoading] = useState(true);

  // 🎯 useEffect para cargar datos al montar el componente
  useEffect(() => {
    // 🔄 Indicar que está cargando
    setLoading(true);

    // 🌐 Fetch API para obtener datos del usuario
    fetch("https://api.github.com/users/sakhnyuk")
      .then((response) => response.json())  // Convertir respuesta a JSON
      .then((data) => setUser(data))        // Guardar datos en estado
      .catch((error) => console.log(error)) // Manejar errores
      .finally(() => setLoading(false));    // Indicar que terminó la carga
  }, []); // Array vacío = solo se ejecuta al montar

  // 🚀 Renderizado condicional basado en estado
  return (
    <div>
      {/* 🔄 Mostrar loading mientras carga */}
      {loading && <p>Loading...</p>}
      
      {/* ❌ Mostrar mensaje si no se encontró usuario */}
      {!loading && !user && <p>No user found.</p>}
      
      {/* ✅ Mostrar información del usuario si se cargó */}
      {user && <UserInfo user={user} />}
    </div>
  );
}

// 📤 Exportación del componente
export default App;
```

### **Archivo: `src/UserInfo.tsx`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importación del tipo de datos
import { GitHubUser } from "./GitHubUser";

// 🎯 Interfaz para las props del componente
interface GitHubUserProps {
  user: GitHubUser; // Prop user de tipo GitHubUser
}

// 🎯 Componente que muestra la información del usuario
const UserInfo = ({ user }: GitHubUserProps) => {
  return (
    <div>
      {/* 🖼️ Imagen de perfil del usuario */}
      <img src={user.avatar_url} alt={user.login} width="100" height="100" />
      
      {/* 👤 Nombre del usuario (fallback al login si no hay nombre) */}
      <h2>{user.name || user.login}</h2>
      
      {/* 📝 Biografía del usuario */}
      <p>{user.bio}</p>
      
      {/* 📍 Ubicación (fallback si no está especificada) */}
      <p>Location: {user.location || "Not specified"}</p>
      
      {/* 🏢 Empresa (fallback si no está especificada) */}
      <p>Company: {user.company || "Not specified"}</p>
      
      {/* 👥 Estadísticas de seguidores */}
      <p>Followers: {user.followers}</p>
      <p>Following: {user.following}</p>
      
      {/* 📦 Estadísticas de repositorios */}
      <p>Public Repos: {user.public_repos}</p>
      <p>Public Gists: {user.public_gists}</p>
      
      {/* 🔗 Enlace al perfil de GitHub */}
      <p>
        GitHub Profile:{" "}
        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
          {user.login}
        </a>
      </p>
    </div>
  );
};

// 📤 Exportación del componente
export default UserInfo;
```

---

## 💻 ANÁLISIS DEL CÓDIGO: AXIOS

### **Archivo: `src/api.ts`**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de axios y tipos
import axios, { AxiosInstance } from "axios";
import { GitHubUser } from "./GitHubUser";

// 🎯 Clase para manejar las llamadas a la API
class API {
  // 🔧 Instancia privada de axios configurada
  private apiInstance: AxiosInstance;

  // 🎯 Constructor que configura la instancia de axios
  constructor() {
    // 🌐 Crear instancia de axios con URL base
    this.apiInstance = axios.create({
      baseURL: "https://api.github.com",
    });

    // 📤 Interceptor para requests (se ejecuta antes de cada request)
    this.apiInstance.interceptors.request.use((config) => {
      // 📝 Log del request que se va a hacer
      console.log("Request:", `${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // 📥 Interceptor para responses (se ejecuta después de cada response)
    this.apiInstance.interceptors.response.use(
      (response) => {
        // ✅ Log de la respuesta exitosa
        console.log("Response:", response.data);
        return response;
      },
      (error) => {
        // ❌ Log del error
        console.log("Error:", error);
        return Promise.reject(error);
      }
    );
  }

  // 🎯 Método para obtener perfil de usuario
  getProfile(username: string) {
    // 🌐 GET request tipado con GitHubUser
    return this.apiInstance.get<GitHubUser>(`/users/${username}`);
  }
}

// 📤 Exportar instancia singleton de la API
export default new API();
```

### **Archivo: `src/App.tsx` (con Axios)**

```tsx
// 🔍 ANÁLISIS LÍNEA POR LÍNEA

// 📦 Importaciones de React y servicios
import { useEffect, useState } from "react";
import { GitHubUser } from "./GitHubUser";
import UserInfo from "./UserInfo";
import api from "./api";

// 🎯 Componente principal usando axios
function App() {
  // 📊 Estados para usuario y loading
  const [user, setUser] = useState<GitHubUser>();
  const [loading, setLoading] = useState(true);

  // 🎯 useEffect para cargar datos usando axios
  useEffect(() => {
    // 🔄 Indicar que está cargando
    setLoading(true);

    // 🌐 Usar la instancia de API configurada
    api
      .getProfile("sakhnyuk")
      .then((res) => setUser(res.data))  // Axios envuelve la respuesta
      .finally(() => setLoading(false)); // Siempre se ejecuta
  }, []);

  // 🚀 Renderizado condicional
  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && !user && <p>No user found.</p>}
      {user && <UserInfo user={user} />}
    </div>
  );
}

// 📤 Exportación del componente
export default App;
```

---

## 🧪 PRUEBAS UNITARIAS

### **Test 1: Verificación de Fetch API**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// 🎯 Mock de fetch global
global.fetch = vi.fn();

describe('Fetch API Implementation', () => {
  it('debe cargar datos de usuario correctamente', async () => {
    // Arrange: Mock de respuesta exitosa
    const mockUser = {
      login: 'testuser',
      id: 123,
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/testuser',
      gists_url: 'https://api.github.com/users/testuser/gists',
      repos_url: 'https://api.github.com/users/testuser/repos',
      company: 'Test Company',
      location: 'Test City',
      bio: 'Test bio',
      public_repos: 10,
      public_gists: 5,
      followers: 100,
      following: 50
    };

    (fetch as any).mockResolvedValueOnce({
      json: async () => mockUser
    });

    // Act: Renderizar componente
    render(<App />);

    // Assert: Verificar que se muestra loading inicialmente
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Verificar que se cargan los datos
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Assert: Verificar que fetch fue llamado
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/sakhnyuk');
  });

  it('debe manejar errores de fetch', async () => {
    // Arrange: Mock de error
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    // Act: Renderizar componente
    render(<App />);

    // Assert: Verificar que se muestra loading inicialmente
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Verificar que se maneja el error
    await waitFor(() => {
      expect(screen.getByText('No user found.')).toBeInTheDocument();
    });
  });
});
```

### **Test 2: Verificación de Componente UserInfo**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserInfo from './UserInfo';

describe('UserInfo Component', () => {
  it('debe renderizar información del usuario correctamente', () => {
    // Arrange: Datos de usuario de prueba
    const mockUser = {
      login: 'testuser',
      id: 123,
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/testuser',
      gists_url: 'https://api.github.com/users/testuser/gists',
      repos_url: 'https://api.github.com/users/testuser/repos',
      company: 'Test Company',
      location: 'Test City',
      bio: 'Test bio',
      public_repos: 10,
      public_gists: 5,
      followers: 100,
      following: 50
    };

    // Act: Renderizar componente
    render(<UserInfo user={mockUser} />);

    // Assert: Verificar que se muestran todos los datos
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
    expect(screen.getByText('Location: Test City')).toBeInTheDocument();
    expect(screen.getByText('Company: Test Company')).toBeInTheDocument();
    expect(screen.getByText('Followers: 100')).toBeInTheDocument();
    expect(screen.getByText('Following: 50')).toBeInTheDocument();
    expect(screen.getByText('Public Repos: 10')).toBeInTheDocument();
    expect(screen.getByText('Public Gists: 5')).toBeInTheDocument();
  });

  it('debe manejar valores null correctamente', () => {
    // Arrange: Usuario con valores null
    const mockUser = {
      login: 'testuser',
      id: 123,
      name: null,
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/testuser',
      gists_url: 'https://api.github.com/users/testuser/gists',
      repos_url: 'https://api.github.com/users/testuser/repos',
      company: null,
      location: null,
      bio: null,
      public_repos: 0,
      public_gists: 0,
      followers: 0,
      following: 0
    };

    // Act: Renderizar componente
    render(<UserInfo user={mockUser} />);

    // Assert: Verificar fallbacks para valores null
    expect(screen.getByText('testuser')).toBeInTheDocument(); // Usa login si name es null
    expect(screen.getByText('Location: Not specified')).toBeInTheDocument();
    expect(screen.getByText('Company: Not specified')).toBeInTheDocument();
  });
});
```

### **Test 3: Verificación de API con Axios**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import App from './App';

// 🎯 Mock de axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Axios Implementation', () => {
  it('debe cargar datos usando axios correctamente', async () => {
    // Arrange: Mock de respuesta de axios
    const mockUser = {
      login: 'testuser',
      id: 123,
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/testuser',
      gists_url: 'https://api.github.com/users/testuser/gists',
      repos_url: 'https://api.github.com/users/testuser/repos',
      company: 'Test Company',
      location: 'Test City',
      bio: 'Test bio',
      public_repos: 10,
      public_gists: 5,
      followers: 100,
      following: 50
    };

    mockedAxios.create.mockReturnValue({
      get: vi.fn().mockResolvedValue({ data: mockUser }),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    } as any);

    // Act: Renderizar componente
    render(<App />);

    // Assert: Verificar que se cargan los datos
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});
```

---

## 📊 PREDICCIÓN DE RESULTADOS

### **Resultado Esperado en el Navegador:**
```html
<!-- Estado de carga -->
<div>
  <p>Loading...</p>
</div>

<!-- Después de cargar datos -->
<div>
  <img src="https://avatars.githubusercontent.com/u/123456?v=4" alt="sakhnyuk" width="100" height="100" />
  <h2>John Doe</h2>
  <p>Software Developer passionate about React and TypeScript</p>
  <p>Location: San Francisco, CA</p>
  <p>Company: Tech Corp</p>
  <p>Followers: 150</p>
  <p>Following: 75</p>
  <p>Public Repos: 25</p>
  <p>Public Gists: 10</p>
  <p>GitHub Profile: <a href="https://github.com/sakhnyuk" target="_blank" rel="noopener noreferrer">sakhnyuk</a></p>
</div>
```

### **Comportamiento de la Aplicación:**
1. **Inicial**: Muestra "Loading..."
2. **Fetching**: Hace request a GitHub API
3. **Éxito**: Muestra información del usuario
4. **Error**: Muestra "No user found."

---

## 🔧 VARIACIONES Y EJERCICIOS

### **Ejercicio 1: Hook Personalizado para Fetching**
```tsx
// 🎯 Hook personalizado para manejar fetching
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Uso:
function UserProfile({ username }: { username: string }) {
  const { data: user, loading, error } = useFetch<GitHubUser>(
    `https://api.github.com/users/${username}`
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return <UserInfo user={user} />;
}
```

### **Ejercicio 2: Manejo de Errores Avanzado**
```tsx
// 🎯 Componente con manejo de errores robusto
import { useState, useEffect } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string;
  retry: () => void;
}

function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
    retry: () => {}
  });

  const handleError = (message: string, retryFn: () => void) => {
    setError({
      hasError: true,
      message,
      retry: retryFn
    });
  };

  const clearError = () => {
    setError({
      hasError: false,
      message: '',
      retry: () => {}
    });
  };

  return { error, handleError, clearError };
}

function RobustUserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError } = useErrorHandler();

  const fetchUser = async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (response.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      handleError(
        err instanceof Error ? err.message : 'Error desconocido',
        fetchUser
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  if (loading) return <div>Cargando usuario...</div>;
  
  if (error.hasError) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={error.retry}>Reintentar</button>
      </div>
    );
  }

  if (!user) return <div>No se encontró el usuario</div>;

  return <UserInfo user={user} />;
}
```

---

## ⚠️ PUNTOS IMPORTANTES

### **Ventajas de Fetch vs Axios:**
```typescript
// ✅ Fetch API (nativo):
// - No requiere dependencias adicionales
// - Soporte nativo en navegadores modernos
// - Más control sobre requests
// - Menor tamaño de bundle

// ✅ Axios:
// - API más consistente
// - Interceptores automáticos
// - Mejor manejo de errores
// - Transformación automática de datos
// - Soporte para cancelación de requests
```

### **Consideraciones de Rendimiento:**
```typescript
// 🎯 Optimizaciones recomendadas:
// - Usar React Query para caching
// - Implementar debouncing en búsquedas
// - Cancelar requests pendientes
// - Implementar retry logic
// - Usar lazy loading para datos grandes
```

---

## 🎯 MEJORES PRÁCTICAS

### **✅ Hacer:**
```tsx
// ✅ Usar TypeScript para tipar respuestas
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ✅ Manejar estados de loading y error
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// ✅ Usar interceptores para logging
axios.interceptors.request.use(config => {
  console.log(`Request: ${config.method} ${config.url}`);
  return config;
});

// ✅ Implementar retry logic
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### **❌ Evitar:**
```tsx
// ❌ No manejar errores
fetch(url).then(response => response.json());

// ❌ No tipar respuestas
const data = await response.json(); // any type

// ❌ No cancelar requests pendientes
// Siempre limpiar requests en useEffect cleanup

// ❌ No implementar loading states
// Siempre mostrar feedback al usuario
```

---

## 📝 RESUMEN DEL CAPÍTULO

### **Conceptos Clave Aprendidos:**
1. **Fetch API** es la forma nativa de hacer requests HTTP
2. **Axios** proporciona una API más robusta y consistente
3. **TypeScript** mejora la seguridad de tipos en APIs
4. **Interceptores** permiten logging y transformación de requests
5. **Manejo de errores** es crucial para UX

### **Habilidades Desarrolladas:**
- ✅ Implementar fetching de datos con Fetch API
- ✅ Usar Axios para requests HTTP
- ✅ Manejar estados de loading y error
- ✅ Tipar respuestas de API con TypeScript
- ✅ Implementar interceptores y logging
- ✅ Crear hooks personalizados para fetching

### **Próximos Pasos:**
En el siguiente capítulo aprenderemos sobre **Gestión de Estado en React**, implementando Context API y otros patrones de estado.

---

*¡Excelente! Has completado el análisis detallado del Capítulo 11. Ahora entiendes cómo obtener datos del servidor de manera eficiente y robusta. Estás listo para continuar con Gestión de Estado en React en el siguiente capítulo.* 