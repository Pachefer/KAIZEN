# Análisis Completo de Teofin - Mobile Banking UI App

## 📋 Descripción General
Teofin es una aplicación de banca móvil construida con Next.js 15, TypeScript y Redux Toolkit. La aplicación implementa un sistema de gestión de cuentas bancarias, transferencias, pagos y una interfaz de usuario optimizada para dispositivos móviles con enfoque en seguridad y usabilidad.

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
src/
├── app/           # App Router de Next.js 15
├── components/    # Componentes reutilizables
├── store/         # Lógica de negocio y store Redux
├── types/         # Definiciones de tipos TypeScript
├── constants/     # Constantes de la aplicación
├── hooks/         # Custom hooks personalizados
├── css/           # Estilos globales
└── assets/        # Recursos estáticos
```

## 🔍 Análisis Línea por Línea

### 1. Layout Principal (`src/app/layout.tsx`)

```typescript
import {Roboto} from 'next/font/google';
import type {Metadata, Viewport} from 'next';
import StoreProvider from '@/app/StoreProvider';
import {BurgerContacts} from '@/components/BurgerContacts';
```

**Explicación:**
- Importa la fuente Roboto de Google Fonts
- Importa tipos de Next.js para metadatos y viewport
- Importa el proveedor del store Redux
- Importa el componente de menú lateral

### 2. Componente Button (`src/components/Button.tsx`)

```typescript
type Props = {
  label: string;
  onClickAction?: () => void;
  colorScheme?: 'primary' | 'secondary' | 'danger';
  containerStyle?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
};
```

**Explicación:**
- Define props tipadas para el componente
- Utiliza union types para el esquema de colores
- Incluye estado disabled y loading para mejor UX
- Permite estilos personalizados adicionales

### 3. Componente Header (`src/components/Header.tsx`)

```typescript
type Props = {
  title?: string;
  showBackButton?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  titleStyle?: React.CSSProperties;
  showBalance?: boolean;
};
```

**Explicación:**
- Props opcionales para controlar la funcionalidad del header
- Incluye funcionalidad de notificaciones y balance
- Permite personalización del título y botones
- Utiliza props booleanas para mostrar/ocultar elementos

### 4. Componente InputField (`src/components/InputField.tsx`)

```typescript
type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  required?: boolean;
  mask?: string;
  maxLength?: number;
};
```

**Explicación:**
- Componente de entrada especializado para formularios bancarios
- Incluye máscaras de entrada para formatos específicos
- Maneja diferentes tipos de input con validación
- Soporta etiquetas y estado requerido

### 5. Componente Switcher (`src/components/Switcher.tsx`)

```typescript
type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
};
```

**Explicación:**
- Componente de interruptor para configuraciones
- Permite diferentes tamaños y colores
- Maneja estado disabled para accesibilidad
- Callback para cambios de estado

## 🚀 Mejoras de Arquitectura

### 1. Implementación de Patrones de Diseño

#### Chain of Responsibility Pattern para Validaciones
```typescript
// src/lib/validation/ValidationHandler.ts
export abstract class ValidationHandler {
  protected nextHandler?: ValidationHandler;

  setNext(handler: ValidationHandler): ValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  abstract validate(data: any): ValidationResult;

  protected handleNext(data: any): ValidationResult {
    if (this.nextHandler) {
      return this.nextHandler.validate(data);
    }
    return { isValid: true, errors: [] };
  }
}

export class RequiredFieldValidator extends ValidationHandler {
  constructor(private fieldName: string) {
    super();
  }

  validate(data: any): ValidationResult {
    if (!data[this.fieldName] || data[this.fieldName].trim() === '') {
      return { 
        isValid: false, 
        errors: [`${this.fieldName} es requerido`] 
      };
    }
    return this.handleNext(data);
  }
}

export class EmailValidator extends ValidationHandler {
  validate(data: any): ValidationResult {
    const email = data.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      return { 
        isValid: false, 
        errors: ['Formato de email inválido'] 
      };
    }
    return this.handleNext(data);
  }
}

// Uso
const validator = new RequiredFieldValidator('email')
  .setNext(new EmailValidator())
  .setNext(new PasswordStrengthValidator());

const result = validator.validate({ email: 'test@example.com', password: '123' });
```

#### State Pattern para Transacciones
```typescript
// src/lib/transactions/TransactionState.ts
export interface TransactionState {
  process(transaction: Transaction): Promise<TransactionResult>;
  canTransitionTo(newState: TransactionState): boolean;
}

export class PendingState implements TransactionState {
  async process(transaction: Transaction): Promise<TransactionResult> {
    // Lógica para transacciones pendientes
    return { status: 'pending', message: 'Transacción en proceso' };
  }

  canTransitionTo(newState: TransactionState): boolean {
    return newState instanceof ProcessingState || newState instanceof FailedState;
  }
}

export class ProcessingState implements TransactionState {
  async process(transaction: Transaction): Promise<TransactionResult> {
    // Lógica para transacciones en procesamiento
    return { status: 'processing', message: 'Procesando transacción' };
  }

  canTransitionTo(newState: TransactionState): boolean {
    return newState instanceof CompletedState || newState instanceof FailedState;
  }
}

export class Transaction {
  private state: TransactionState = new PendingState();

  setState(newState: TransactionState): void {
    if (this.state.canTransitionTo(newState)) {
      this.state = newState;
    } else {
      throw new Error('Transición de estado no válida');
    }
  }

  async process(): Promise<TransactionResult> {
    return this.state.process(this);
  }
}
```

### 2. Principios SOLID

#### Single Responsibility Principle
```typescript
// Separar responsabilidades en servicios específicos
export class AccountService {
  getBalance(accountId: string): Promise<number> { /* ... */ }
  updateBalance(accountId: string, amount: number): Promise<void> { /* ... */ }
}

export class TransactionService {
  createTransaction(data: TransactionData): Promise<Transaction> { /* ... */ }
  processTransaction(transactionId: string): Promise<TransactionResult> { /* ... */ }
}

export class SecurityService {
  validateUser(userId: string, token: string): Promise<boolean> { /* ... */ }
  encryptData(data: string): string { /* ... */ }
  decryptData(encryptedData: string): string { /* ... */ }
}
```

#### Open/Closed Principle
```typescript
// Extensible sin modificar código existente
export interface PaymentMethod {
  processPayment(amount: number): Promise<PaymentResult>;
  getFee(): number;
  getProcessingTime(): number;
}

export class CreditCardPayment implements PaymentMethod {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Implementación para tarjeta de crédito
    return { success: true, transactionId: 'cc_123' };
  }

  getFee(): number {
    return 0.025; // 2.5%
  }

  getProcessingTime(): number {
    return 24; // 24 horas
  }
}

export class BankTransferPayment implements PaymentMethod {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Implementación para transferencia bancaria
    return { success: true, transactionId: 'bt_456' };
  }

  getFee(): number {
    return 0.01; // 1%
  }

  getProcessingTime(): number {
    return 48; // 48 horas
  }
}
```

### 3. Arquitectura de Capas con Clean Architecture

```
src/
├── presentation/     # Componentes UI y páginas
├── application/      # Casos de uso y servicios
├── domain/          # Entidades y reglas de negocio
└── infrastructure/  # Servicios externos
```

```typescript
// src/domain/entities/Account.ts
export class Account {
  constructor(
    public readonly id: string,
    public readonly accountNumber: string,
    public readonly balance: number,
    public readonly currency: string,
    public readonly type: AccountType,
    public readonly status: AccountStatus
  ) {}

  canWithdraw(amount: number): boolean {
    return this.balance >= amount && this.status === AccountStatus.ACTIVE;
  }

  withdraw(amount: number): void {
    if (!this.canWithdraw(amount)) {
      throw new Error('No se puede realizar el retiro');
    }
    this.balance -= amount;
  }

  deposit(amount: number): void {
    if (this.status !== AccountStatus.ACTIVE) {
      throw new Error('Cuenta no activa');
    }
    this.balance += amount;
  }

  getFormattedBalance(): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: this.currency
    }).format(this.balance);
  }
}

// src/domain/repositories/AccountRepository.ts
export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  save(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
}

// src/application/use-cases/GetAccountBalance.ts
export class GetAccountBalance {
  constructor(private accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<number> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Cuenta no encontrada');
    }
    return account.balance;
  }
}
```

## 🧪 Pruebas Unitarias

### Configuración de Testing
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "msw": "^2.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Pruebas del Componente InputField
```typescript
// src/components/__tests__/InputField.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputField } from '../InputField';

describe('InputField Component', () => {
  test('renderiza correctamente con label', () => {
    render(<InputField label="Número de cuenta" />);
    expect(screen.getByText('Número de cuenta')).toBeInTheDocument();
  });

  test('ejecuta onChange cuando se escribe', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    render(<InputField label="Email" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test@example.com');
    
    expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
  });

  test('muestra error cuando se proporciona', () => {
    render(<InputField label="Contraseña" error="Contraseña muy débil" />);
    expect(screen.getByText('Contraseña muy débil')).toBeInTheDocument();
  });

  test('aplica máscara de entrada correctamente', () => {
    render(<InputField label="Teléfono" mask="(999) 999-9999" />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(input).toHaveValue('(123) 456-7890');
  });
});
```

### Pruebas de Integración
```typescript
// src/lib/__tests__/TransactionService.integration.test.ts
import { TransactionService } from '../TransactionService';
import { AccountRepositoryImpl } from '../repositories/AccountRepositoryImpl';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'txn_123',
        status: 'pending',
        amount: 100,
        fromAccount: 'acc_1',
        toAccount: 'acc_2'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TransactionService Integration', () => {
  test('crea transacción exitosamente', async () => {
    const transactionService = new TransactionService();
    
    const transactionData = {
      amount: 100,
      fromAccount: 'acc_1',
      toAccount: 'acc_2',
      description: 'Transferencia'
    };
    
    const result = await transactionService.createTransaction(transactionData);
    
    expect(result.id).toBe('txn_123');
    expect(result.status).toBe('pending');
    expect(result.amount).toBe(100);
  });
});
```

## 🎨 Mejoras de UI/UX

### 1. Sistema de Diseño Bancario
```typescript
// src/design-system/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
    },
    success: {
      50: '#E8F5E8',
      100: '#C8E6C9',
      500: '#4CAF50',
      600: '#388E3C',
      700: '#2E7D32',
    },
    warning: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      500: '#FF9800',
      600: '#F57C00',
      700: '#EF6C00',
    },
    error: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  typography: {
    h1: { fontSize: '32px', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '24px', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '20px', fontWeight: 600, lineHeight: 1.4 },
    body: { fontSize: '16px', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '14px', fontWeight: 400, lineHeight: 1.4 },
    numeric: { fontFamily: 'monospace', fontSize: '18px', fontWeight: 600 },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
};
```

### 2. Componentes de Seguridad
```typescript
// src/components/SecurityCodeInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion';

export const SecurityCodeInput: React.FC<{
  length: number;
  onComplete: (code: string) => void;
  autoFocus?: boolean;
}> = ({ length, onComplete, autoFocus = true }) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo un carácter por input

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Mover al siguiente input
    if (value && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Verificar si el código está completo
    if (newCode.every(digit => digit !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Mover al input anterior si está vacío
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <div className="security-code-input">
      {code.map((digit, index) => (
        <motion.input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          className={`security-code-digit ${focusedIndex === index ? 'focused' : ''}`}
          whileFocus={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      ))}
    </div>
  );
};
```

### 3. Componentes de Dashboard
```typescript
// src/components/AccountCard.tsx
import React from 'react';
import { motion } from 'motion';
import { Account } from '@/domain/entities/Account';

export const AccountCard: React.FC<{
  account: Account;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ account, onClick, isSelected = false }) => {
  return (
    <motion.div
      className={`account-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="account-header">
        <h3 className="account-type">{account.type}</h3>
        <span className="account-status">{account.status}</span>
      </div>
      
      <div className="account-number">
        **** **** **** {account.accountNumber.slice(-4)}
      </div>
      
      <div className="account-balance">
        <span className="balance-label">Balance disponible</span>
        <span className="balance-amount">
          {account.getFormattedBalance()}
        </span>
      </div>
      
      <div className="account-actions">
        <button className="action-btn">Ver detalles</button>
        <button className="action-btn">Transferir</button>
      </div>
    </motion.div>
  );
};
```

## 🔐 Seguridad y Autenticación

### 1. Sistema de Autenticación
```typescript
// src/lib/auth/AuthService.ts
export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      this.token = data.token;
      this.currentUser = data.user;

      // Guardar en localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }
}
```

### 2. Middleware de Seguridad
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/transactions') ||
                          request.nextUrl.pathname.startsWith('/profile');

  // Redirigir a login si no hay token y es página protegida
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirigir a dashboard si hay token y está en página de auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Agregar headers de seguridad
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};
```

## 📱 Optimizaciones PWA para Banca

### 1. Service Worker con Cache Inteligente
```typescript
// public/sw.js
const CACHE_NAME = 'teofin-v1';
const STATIC_CACHE = 'teofin-static-v1';
const API_CACHE = 'teofin-api-v1';

const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
];

// Cache First para assets estáticos
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// Network First para API calls con fallback a cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 2. Manifest.json para Banca Móvil
```json
{
  "name": "Teofin - Banca Móvil",
  "short_name": "Teofin",
  "description": "Tu banco en el bolsillo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196F3",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "es",
  "categories": ["finance", "business"],
  "icons": [
    {
      "src": "/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Mi Cuenta",
      "short_name": "Cuenta",
      "description": "Ver saldo y movimientos",
      "url": "/dashboard",
      "icons": [{ "src": "/icon-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Transferir",
      "short_name": "Transferir",
      "description": "Realizar transferencia",
      "url": "/transactions/new",
      "icons": [{ "src": "/icon-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

## 🔧 Scripts de Desarrollo

### 1. Scripts de Build y Testing
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "analyze": "ANALYZE=true next build",
    "security:audit": "npm audit --audit-level moderate",
    "docker:build": "docker build -t teofin .",
    "docker:run": "docker run -p 3000:3000 teofin"
  }
}
```

### 2. Configuración de Jest
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

## 📊 Métricas de Calidad

### 1. Cobertura de Código
- **Objetivo**: 90% de cobertura
- **Componentes**: 95%
- **Lógica de negocio**: 90%
- **Servicios**: 85%
- **Utilidades**: 85%

### 2. Performance y Seguridad
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.0s
- **Largest Contentful Paint**: < 1.8s
- **Cumulative Layout Shift**: < 0.03
- **Security Score**: 100%
- **HTTPS**: Obligatorio

### 3. Métricas de Accesibilidad
- **WCAG 2.1 AA Compliance**: 100%
- **Keyboard Navigation**: 100%
- **Screen Reader Support**: 100%
- **Color Contrast**: 100%
- **Focus Management**: 100%

## 🚀 Próximos Pasos y Roadmap

### Fase 1: Mejoras Inmediatas (1-2 semanas)
1. **Implementar Storybook** para documentación de componentes
2. **Agregar pruebas E2E** con Playwright
3. **Implementar CI/CD** con GitHub Actions
4. **Agregar monitoreo** de performance y errores

### Fase 2: Mejoras de Arquitectura (3-4 semanas)
1. **Implementar arquitectura hexagonal** completa
2. **Agregar sistema de eventos** para comunicación entre módulos
3. **Implementar cache inteligente** con React Query
4. **Agregar sistema de logging** estructurado

### Fase 3: Funcionalidades Avanzadas (5-8 semanas)
1. **Implementar i18n** para múltiples idiomas
2. **Agregar analytics** y tracking de eventos
3. **Implementar modo offline** completo
4. **Agregar notificaciones push** nativas

### Fase 4: Optimizaciones de Performance (9-12 semanas)
1. **Implementar lazy loading** avanzado
2. **Agregar virtualización** para listas largas
3. **Implementar code splitting** inteligente
4. **Optimizar bundle size** y tree shaking

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)
- [Banking Security Guidelines](https://www.pcisecuritystandards.org/)
- [Financial UX Best Practices](https://www.nngroup.com/articles/financial-ux/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
