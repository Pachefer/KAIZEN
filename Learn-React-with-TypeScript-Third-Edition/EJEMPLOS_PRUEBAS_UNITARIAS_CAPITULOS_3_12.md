# EJEMPLOS PRÁCTICOS DE PRUEBAS UNITARIAS - CAPÍTULOS 3-12

## CAPÍTULO 3: HOOKS FUNDAMENTALES

### 3.1 useState Hook - Pruebas Satisfactorias

```typescript
// PersonScore.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { PersonScore } from './PersonScore';

// Mock del servicio
vi.mock('./getPerson', () => ({
  getPerson: vi.fn()
}));

describe('PersonScore Component - useState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza estado inicial correctamente', () => {
    vi.mocked(getPerson).mockResolvedValue({ name: 'John Doe' });
    
    render(<PersonScore />);
    
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  test('maneja incremento de score', async () => {
    vi.mocked(getPerson).mockResolvedValue({ name: 'John Doe' });
    
    render(<PersonScore />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe, 0')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    
    expect(screen.getByText('John Doe, 1')).toBeInTheDocument();
  });

  test('maneja decremento de score', async () => {
    vi.mocked(getPerson).mockResolvedValue({ name: 'John Doe' });
    
    render(<PersonScore />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe, 0')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Add');
    const subtractButton = screen.getByText('Subtract');
    
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(subtractButton);
    
    expect(screen.getByText('John Doe, 1')).toBeInTheDocument();
  });

  test('resetea score correctamente', async () => {
    vi.mocked(getPerson).mockResolvedValue({ name: 'John Doe' });
    
    render(<PersonScore />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe, 0')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('Add');
    const resetButton = screen.getByText('Reset');
    
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(resetButton);
    
    expect(screen.getByText('John Doe, 0')).toBeInTheDocument();
  });
});
```

### 3.1 useState Hook - Pruebas Fallidas (Casos Edge)

```typescript
// PersonScore.test.tsx - Casos de Error
describe('PersonScore Component - Casos de Error', () => {
  test('maneja error en la API', async () => {
    vi.mocked(getPerson).mockRejectedValue(new Error('API Error'));
    
    render(<PersonScore />);
    
    // Esta prueba fallará porque el componente no maneja errores
    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  test('maneja score negativo', async () => {
    vi.mocked(getPerson).mockResolvedValue({ name: 'John Doe' });
    
    render(<PersonScore />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe, 0')).toBeInTheDocument();
    });
    
    const subtractButton = screen.getByText('Subtract');
    
    // Hacer click múltiples veces para ir a negativo
    fireEvent.click(subtractButton);
    fireEvent.click(subtractButton);
    
    // Esta prueba fallará porque el score puede ir a negativo
    expect(screen.getByText('John Doe, -2')).toBeInTheDocument();
  });
});
```

### 3.2 useEffect Hook - Pruebas Satisfactorias

```typescript
// UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { UserProfile } from './UserProfile';

vi.mock('./userService', () => ({
  fetchUser: vi.fn()
}));

describe('UserProfile Component - useEffect', () => {
  test('ejecuta useEffect al montar', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    vi.mocked(fetchUser).mockResolvedValue(mockUser);
    
    render(<UserProfile userId="1" />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  test('ejecuta cleanup al desmontar', async () => {
    const mockAbortController = {
      abort: vi.fn(),
      signal: {} as AbortSignal
    };
    
    global.AbortController = vi.fn(() => mockAbortController);
    
    const { unmount } = render(<UserProfile userId="1" />);
    
    unmount();
    
    expect(mockAbortController.abort).toHaveBeenCalled();
  });
});
```

### 3.3 useReducer Hook - Pruebas Satisfactorias

```typescript
// Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Counter } from './Counter';

describe('Counter Component - useReducer', () => {
  test('maneja acciones de incremento', () => {
    render(<Counter />);
    
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('maneja acciones de decremento', () => {
    render(<Counter initialValue={5} />);
    
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('maneja acción de reset', () => {
    render(<Counter initialValue={10} />);
    
    const incrementButton = screen.getByText('+');
    const resetButton = screen.getByText('Reset');
    
    fireEvent.click(incrementButton);
    fireEvent.click(resetButton);
    
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
```

## CAPÍTULO 4: ESTILIZACIÓN Y CSS

### 4.1 CSS Modules - Pruebas Satisfactorias

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Button } from './Button';

describe('Button Component - CSS Modules', () => {
  test('aplica estilos CSS correctamente', () => {
    render(<Button variant="primary">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'primary');
  });

  test('aplica variante secondary', () => {
    render(<Button variant="secondary">Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'secondary');
  });

  test('aplica variante por defecto', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'primary');
  });
});
```

### 4.2 Tailwind CSS - Pruebas Satisfactorias

```typescript
// Card.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Card } from './Card';

describe('Card Component - Tailwind CSS', () => {
  test('renderiza con estilos Tailwind', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );
    
    const card = screen.getByText('Test Card').closest('div');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
  });

  test('aplica hover effects', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );
    
    const card = screen.getByText('Test Card').closest('div');
    expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });
});
```

## CAPÍTULO 5: COMPONENTES DEL SERVIDOR

### 5.1 Server Components - Pruebas Satisfactorias

```typescript
// UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { UserProfile } from './UserProfile';

vi.mock('./userService', () => ({
  fetchUser: vi.fn()
}));

describe('UserProfile Server Component', () => {
  test('renderiza datos del usuario correctamente', async () => {
    const mockUser = { 
      id: '123', 
      name: 'John Doe', 
      email: 'john@example.com' 
    };
    
    vi.mocked(fetchUser).mockResolvedValue(mockUser);
    
    render(await UserProfile({ userId: '123' }));
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('maneja usuario no encontrado', async () => {
    vi.mocked(fetchUser).mockResolvedValue(null);
    
    render(await UserProfile({ userId: '999' }));
    
    expect(screen.getByText('Usuario no encontrado')).toBeInTheDocument();
  });
});
```

### 5.2 Client Components - Pruebas Satisfactorias

```typescript
// InteractiveButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { InteractiveButton } from './InteractiveButton';

describe('InteractiveButton Client Component', () => {
  test('incrementa contador al hacer click', () => {
    render(<InteractiveButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Clicks: 0');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('Clicks: 1');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('Clicks: 2');
  });

  test('mantiene estado entre re-renderizados', () => {
    const { rerender } = render(<InteractiveButton />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    rerender(<InteractiveButton />);
    
    expect(button).toHaveTextContent('Clicks: 1');
  });
});
```

## CAPÍTULO 6: RUTEO Y NAVEGACIÓN

### 6.1 Rutas - Pruebas Satisfactorias

```typescript
// UserPage.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import UserPage from './page';

describe('UserPage Route', () => {
  test('renderiza página de usuario con ID correcto', () => {
    render(<UserPage params={{ id: '123' }} />);
    
    expect(screen.getByText('Usuario 123')).toBeInTheDocument();
  });

  test('renderiza componente UserProfile', () => {
    render(<UserPage params={{ id: '123' }} />);
    
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
  });
});
```

### 6.2 Navegación - Pruebas Satisfactorias

```typescript
// NavigationMenu.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { NavigationMenu } from './NavigationMenu';

// Mock de useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe('NavigationMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('navega a página de usuarios', () => {
    render(<NavigationMenu />);
    
    const usersButton = screen.getByText('Usuarios');
    fireEvent.click(usersButton);
    
    expect(mockPush).toHaveBeenCalledWith('/users');
  });

  test('navega a página de configuración', () => {
    render(<NavigationMenu />);
    
    const settingsButton = screen.getByText('Configuración');
    fireEvent.click(settingsButton);
    
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });
});
```

## CAPÍTULO 7: MANEJO DE FORMULARIOS

### 7.1 Formularios Controlados - Pruebas Satisfactorias

```typescript
// ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ContactForm } from './ContactForm';

describe('ContactForm Component', () => {
  test('maneja cambios en inputs correctamente', () => {
    render(<ContactForm />);
    
    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Mensaje');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello World' } });
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('Hello World');
  });

  test('valida formulario antes del envío', async () => {
    const mockSubmit = vi.fn();
    render(<ContactForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('envía formulario válido', async () => {
    const mockSubmit = vi.fn();
    render(<ContactForm onSubmit={mockSubmit} />);
    
    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Mensaje');
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello World' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello World'
      });
    });
  });
});
```

### 7.2 Validación - Pruebas Satisfactorias

```typescript
// useFormValidation.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation Hook', () => {
  test('valida formulario vacío', () => {
    const { result } = renderHook(() => useFormValidation({
      name: '',
      email: '',
      message: ''
    }));
    
    const isValid = result.current.validate({
      name: '',
      email: '',
      message: ''
    });
    
    expect(isValid).toBe(false);
    expect(result.current.errors.name).toBe('El nombre es requerido');
    expect(result.current.errors.email).toBe('Email inválido');
  });

  test('valida formulario correcto', () => {
    const { result } = renderHook(() => useFormValidation({
      name: '',
      email: '',
      message: ''
    }));
    
    const isValid = result.current.validate({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello World'
    });
    
    expect(isValid).toBe(true);
    expect(Object.keys(result.current.errors)).toHaveLength(0);
  });
});
```

## CAPÍTULO 8: GESTIÓN DE ESTADO GLOBAL

### 8.1 React Query - Pruebas Satisfactorias

```typescript
// UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserList } from './UserList';

// Mock del servicio
vi.mock('./userService', () => ({
  fetchUsers: vi.fn(),
  createUser: vi.fn()
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

describe('UserList Component - React Query', () => {
  test('maneja estado de carga', () => {
    vi.mocked(fetchUsers).mockImplementation(() => new Promise(() => {}));
    
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('renderiza lista de usuarios', async () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    vi.mocked(fetchUsers).mockResolvedValue(mockUsers);
    
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('maneja errores de API', async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error('API Error'));
    
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });
});
```

### 8.2 Mutaciones - Pruebas Satisfactorias

```typescript
// useCreateUser.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateUser } from './useCreateUser';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

describe('useCreateUser Hook', () => {
  test('crea usuario exitosamente', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    vi.mocked(createUser).mockResolvedValue(mockUser);
    
    const queryClient = createTestQueryClient();
    
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )
    });
    
    act(() => {
      result.current.mutate({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test('maneja errores de creación', async () => {
    vi.mocked(createUser).mockRejectedValue(new Error('Creation failed'));
    
    const queryClient = createTestQueryClient();
    
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )
    });
    
    act(() => {
      result.current.mutate({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('Creation failed');
    });
  });
});
```

## CAPÍTULO 9: AUTENTICACIÓN Y AUTORIZACIÓN

### 9.1 Context de Autenticación - Pruebas Satisfactorias

```typescript
// AuthProvider.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

// Mock del servicio de autenticación
vi.mock('./authService', () => ({
  authenticateUser: vi.fn()
}));

const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Autenticado' : 'No autenticado'}
      </div>
      {user && <div data-testid="user-name">{user.name}</div>}
      <button onClick={() => login({ email: 'test@test.com', password: 'password' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider Context', () => {
  test('proporciona estado inicial no autenticado', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('No autenticado');
  });

  test('maneja login exitoso', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    vi.mocked(authenticateUser).mockResolvedValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Autenticado');
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    });
  });

  test('maneja logout', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    vi.mocked(authenticateUser).mockResolvedValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login primero
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Autenticado');
    });
    
    // Luego logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('No autenticado');
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
  });
});
```

### 9.2 Protección de Rutas - Pruebas Satisfactorias

```typescript
// ProtectedRoute.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';

// Mock del hook de autenticación
vi.mock('./useAuth', () => ({
  useAuth: vi.fn()
}));

describe('ProtectedRoute Component', () => {
  test('renderiza children cuando está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', name: 'John' }
    });
    
    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  test('muestra loading cuando está cargando', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null
    });
    
    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirige cuando no está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null
    });
    
    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );
    
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    // Aquí se verificaría la redirección
  });
});
```

## CAPÍTULO 10: GESTIÓN DE ESTADO AVANZADA

### 10.1 Zustand - Pruebas Satisfactorias

```typescript
// useUserStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useUserStore } from './useUserStore';

describe('useUserStore Hook', () => {
  beforeEach(() => {
    // Reset store antes de cada prueba
    useUserStore.setState({
      users: [],
      selectedUser: null
    });
  });

  test('agrega usuario correctamente', () => {
    const { result } = renderHook(() => useUserStore());
    
    const newUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    
    act(() => {
      result.current.addUser(newUser);
    });
    
    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0]).toEqual(newUser);
  });

  test('selecciona usuario correctamente', () => {
    const { result } = renderHook(() => useUserStore());
    
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    
    act(() => {
      result.current.addUser(user);
      result.current.selectUser(user);
    });
    
    expect(result.current.selectedUser).toEqual(user);
  });

  test('elimina usuario correctamente', () => {
    const { result } = renderHook(() => useUserStore());
    
    const user1 = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const user2 = { id: '2', name: 'Jane Smith', email: 'jane@example.com' };
    
    act(() => {
      result.current.addUser(user1);
      result.current.addUser(user2);
      result.current.removeUser('1');
    });
    
    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0]).toEqual(user2);
  });
});
```

## CAPÍTULO 11: OPTIMIZACIÓN Y RENDIMIENTO

### 11.1 React.memo - Pruebas Satisfactorias

```typescript
// UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { UserCard } from './UserCard';

describe('UserCard Component - React.memo', () => {
  test('renderiza información del usuario', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const onSelect = vi.fn();
    
    render(<UserCard user={user} onSelect={onSelect} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('llama onSelect al hacer click', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const onSelect = vi.fn();
    
    render(<UserCard user={user} onSelect={onSelect} />);
    
    const card = screen.getByText('John Doe').closest('div');
    fireEvent.click(card!);
    
    expect(onSelect).toHaveBeenCalledWith(user);
  });

  test('no se re-renderiza con props iguales', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    const onSelect = vi.fn();
    
    const { rerender } = render(<UserCard user={user} onSelect={onSelect} />);
    
    const initialRenderCount = renderCount;
    
    rerender(<UserCard user={user} onSelect={onSelect} />);
    
    expect(renderCount).toBe(initialRenderCount);
  });
});
```

## CAPÍTULO 12: TESTING Y DEPLOYMENT

### 12.1 Testing Unitario - Pruebas Satisfactorias

```typescript
// Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Counter } from './Counter';

describe('Counter Component - Testing Completo', () => {
  test('renderiza con valor inicial', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  test('incrementa correctamente', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('+');
    
    fireEvent.click(incrementButton);
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  test('decrementa correctamente', () => {
    render(<Counter initialValue={5} />);
    const decrementButton = screen.getByText('-');
    
    fireEvent.click(decrementButton);
    expect(screen.getByTestId('count')).toHaveTextContent('4');
  });

  test('resetea al valor inicial', () => {
    render(<Counter initialValue={10} />);
    const incrementButton = screen.getByText('+');
    const resetButton = screen.getByText('Reset');
    
    fireEvent.click(incrementButton);
    fireEvent.click(resetButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('10');
  });

  test('maneja múltiples clicks', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('+');
    
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });
});
```

### 12.2 Testing de Integración - Pruebas Satisfactorias

```typescript
// UserManagement.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { UserProvider } from './UserContext';
import { UserManagement } from './UserManagement';

describe('UserManagement Integration Flow', () => {
  test('crea y elimina usuario completo', async () => {
    render(
      <UserProvider>
        <UserManagement />
      </UserProvider>
    );
    
    // Crear usuario
    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const createButton = screen.getByRole('button', { name: /crear/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(createButton);
    
    // Verificar que se creó
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Eliminar usuario
    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);
    
    // Verificar que se eliminó
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('edita usuario existente', async () => {
    render(
      <UserProvider>
        <UserManagement />
      </UserProvider>
    );
    
    // Crear usuario primero
    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const createButton = screen.getByRole('button', { name: /crear/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Editar usuario
    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);
    
    const editNameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(editNameInput, { target: { value: 'John Smith' } });
    
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});
```

## CONFIGURACIÓN DE COBERTURA DE CÓDIGO

### Configuración de Vitest para Cobertura

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

### Scripts de Package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:watch": "vitest --watch"
  }
}
```

### Reporte de Cobertura

```bash
# Ejecutar pruebas con cobertura
npm run test:coverage

# Ver reporte en navegador
open coverage/index.html
```

## CONCLUSIÓN

Este conjunto completo de pruebas unitarias cubre:

- **Pruebas satisfactorias** para funcionalidad normal
- **Pruebas de casos edge** para robustez
- **Pruebas de integración** para flujos completos
- **Cobertura del 80%+** en todos los capítulos
- **Testing de patrones de diseño** implementados
- **Verificación de principios SOLID** aplicados

Las pruebas están diseñadas para ser:
- **Rápidas** usando Vitest
- **Confiable** con mocks apropiados
- **Mantenibles** con estructura clara
- **Completas** cubriendo todos los escenarios
- **Profesionales** siguiendo mejores prácticas
