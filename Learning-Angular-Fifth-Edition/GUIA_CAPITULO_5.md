# 🚀 GUÍA EXCEPCIONAL - CAPÍTULO 5: SERVICIOS Y DEPENDENCY INJECTION

## 📋 CONTENIDO DEL CAPÍTULO
Este capítulo introduce los servicios y el sistema de Dependency Injection (DI) de Angular. Los servicios son clases que encapsulan lógica de negocio y pueden ser inyectadas en componentes, directivas y otros servicios. Aprenderás a crear servicios, configurar providers y usar el sistema de inyección de dependencias.

---

## 🔍 ANÁLISIS DETALLADO DEL CÓDIGO

### 1. **app.component.ts - Componente Principal con DI**

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CopyrightDirective } from './copyright.directive';
import { APP_SETTINGS, appSettings } from './app.settings';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ProductListComponent,
    CopyrightDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
})
export class AppComponent {
  title = 'World';
  settings = inject(APP_SETTINGS);
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`import { inject }`**: Función de inyección de dependencias de Angular 14+
- **`providers: [{ provide: APP_SETTINGS, useValue: appSettings }]`**: Configura un provider a nivel de componente
- **`provide: APP_SETTINGS`**: Token de inyección (InjectionToken)
- **`useValue: appSettings`**: Valor que se inyectará cuando se solicite APP_SETTINGS
- **`settings = inject(APP_SETTINGS)`**: Inyecta el valor usando la función inject()

**🎯 PREDICCIÓN DE RESULTADOS:**
- El componente tendrá acceso a las configuraciones de la aplicación
- Las configuraciones estarán disponibles en `this.settings`
- Solo este componente y sus hijos tendrán acceso a estas configuraciones

### 2. **app.settings.ts - Configuración de la Aplicación**

```typescript
import { InjectionToken } from '@angular/core';

export interface AppSettings {
  title: string;
  version: string;
}

export const appSettings: AppSettings = {
  title: 'My e-shop',
  version: '1.0'
};

export const APP_SETTINGS = new InjectionToken<AppSettings>('app.settings');
```

**📝 COMENTARIOS DETALLADOS:**

- **`InjectionToken`**: Clase para crear tokens de inyección tipados
- **`interface AppSettings`**: Define la estructura de las configuraciones
- **`appSettings`**: Objeto con las configuraciones por defecto
- **`new InjectionToken<AppSettings>('app.settings')`**: Crea un token tipado con nombre descriptivo
- **`'app.settings'`**: Nombre del token para debugging

**🎯 PREDICCIÓN DE RESULTADOS:**
- Proporciona tipado fuerte para las configuraciones
- Permite inyección de configuraciones en cualquier parte de la aplicación
- Facilita el testing al poder mockear las configuraciones

### 3. **products.service.ts - Servicio de Productos**

```typescript
import { Injectable } from '@angular/core';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  getProducts(): Product[] {
    return [
      { 
        id: 1,
        title: 'Keyboard',
        price: 100,
        categories: {
          1: 'Computing',
          2: 'Peripherals'
        }
      },
      {
        id: 2,
        title: 'Microphone',
        price: 35,
        categories: { 3: 'Multimedia' }
      },
      {
        id: 3,
        title: 'Web camera',
        price: 79,
        categories: {
          1: 'Computing',
          3: 'Multimedia'
        }
      },
      {
        id: 4,
        title: 'Tablet',
        price: 500,
        categories: { 4: 'Entertainment' }
      }
    ];
  }  
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`@Injectable({ providedIn: 'root' })`**: Decorador que marca la clase como inyectable
- **`providedIn: 'root'`**: Registra el servicio como singleton a nivel de aplicación
- **`getProducts(): Product[]`**: Método que retorna un array de productos
- **`categories`**: Propiedad que agrupa productos por categorías
- **Datos hardcodeados**: Por ahora los datos están en memoria

**🎯 PREDICCIÓN DE RESULTADOS:**
- El servicio estará disponible en toda la aplicación
- Se creará una sola instancia (singleton)
- Retornará 4 productos con sus categorías
- Los productos tendrán precios y categorías organizadas

### 4. **favorites.service.ts - Servicio de Favoritos**

```typescript
import { Injectable } from '@angular/core';
import { Product } from './product';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService extends ProductsService {

  constructor() {
    super();
  }
  
  override getProducts(): Product[] {
    return super.getProducts().slice(1, 3);
  }  
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`extends ProductsService`**: Hereda de ProductsService
- **`super()`**: Llama al constructor de la clase padre
- **`override getProducts()`**: Sobrescribe el método de la clase padre
- **`super.getProducts().slice(1, 3)`**: Obtiene productos del padre y toma solo los índices 1 y 2
- **`slice(1, 3)`**: Método de array que retorna elementos desde índice 1 hasta 2 (exclusivo)

**🎯 PREDICCIÓN DE RESULTADOS:**
- Retornará solo 2 productos (Microphone y Web camera)
- Mantendrá la misma estructura de datos
- Se puede usar como reemplazo de ProductsService
- Demuestra herencia de servicios

---

## 🧪 PRUEBAS UNITARIAS

### Prueba para ProductsService

```typescript
import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { Product } from './product';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return products array', () => {
    const products = service.getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(4);
  });

  it('should return products with correct structure', () => {
    const products = service.getProducts();
    const firstProduct = products[0];
    
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('categories');
  });

  it('should return specific products', () => {
    const products = service.getProducts();
    
    expect(products[0].title).toBe('Keyboard');
    expect(products[1].title).toBe('Microphone');
    expect(products[2].title).toBe('Web camera');
    expect(products[3].title).toBe('Tablet');
  });

  it('should return products with categories', () => {
    const products = service.getProducts();
    const keyboard = products[0];
    
    expect(keyboard.categories).toEqual({
      1: 'Computing',
      2: 'Peripherals'
    });
  });
});
```

### Prueba para FavoritesService

```typescript
import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return subset of products', () => {
    const products = service.getProducts();
    expect(products.length).toBe(2);
  });

  it('should return correct subset', () => {
    const products = service.getProducts();
    expect(products[0].title).toBe('Microphone');
    expect(products[1].title).toBe('Web camera');
  });

  it('should inherit from ProductsService', () => {
    expect(service instanceof FavoritesService).toBe(true);
  });
});
```

### Prueba para AppSettings

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { APP_SETTINGS, appSettings } from './app.settings';

describe('AppComponent with Settings', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: APP_SETTINGS, useValue: appSettings }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject settings', () => {
    expect(component.settings).toBeDefined();
    expect(component.settings.title).toBe('My e-shop');
    expect(component.settings.version).toBe('1.0');
  });

  it('should have title property', () => {
    expect(component.title).toBe('World');
  });
});
```

### Prueba de Integración

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductsService } from './products.service';
import { FavoritesService } from './favorites.service';
import { APP_SETTINGS, appSettings } from './app.settings';

describe('App Integration', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productsService: ProductsService;
  let favoritesService: FavoritesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: APP_SETTINGS, useValue: appSettings }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    favoritesService = TestBed.inject(FavoritesService);
    fixture.detectChanges();
  });

  it('should have all services available', () => {
    expect(productsService).toBeTruthy();
    expect(favoritesService).toBeTruthy();
    expect(component.settings).toBeTruthy();
  });

  it('should return different product counts', () => {
    const allProducts = productsService.getProducts();
    const favoriteProducts = favoritesService.getProducts();
    
    expect(allProducts.length).toBe(4);
    expect(favoriteProducts.length).toBe(2);
  });
});
```

---

## 🎯 EJERCICIOS PRÁCTICOS

### Ejercicio 1: Crear Servicio de Carrito de Compras
**Objetivo**: Crear un servicio que maneje el carrito de compras

```typescript
// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value;
    const filteredItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(filteredItems);
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}
```

**Resultado Esperado**: Servicio completo para manejar carrito de compras con observables

### Ejercicio 2: Crear Servicio de Configuración Dinámica
**Objetivo**: Crear un servicio que permita cambiar configuraciones en tiempo real

```typescript
// config.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppConfig {
  theme: 'light' | 'dark';
  language: 'es' | 'en';
  currency: 'USD' | 'EUR' | 'GBP';
  notifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = new BehaviorSubject<AppConfig>({
    theme: 'light',
    language: 'es',
    currency: 'USD',
    notifications: true
  });

  getConfig(): Observable<AppConfig> {
    return this.config.asObservable();
  }

  updateConfig(updates: Partial<AppConfig>): void {
    const currentConfig = this.config.value;
    this.config.next({ ...currentConfig, ...updates });
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.updateConfig({ theme });
  }

  setLanguage(language: 'es' | 'en'): void {
    this.updateConfig({ language });
  }

  toggleNotifications(): void {
    const currentConfig = this.config.value;
    this.updateConfig({ notifications: !currentConfig.notifications });
  }
}
```

**Resultado Esperado**: Servicio de configuración reactivo con observables

### Ejercicio 3: Crear Servicio de Autenticación
**Objetivo**: Crear un servicio que maneje la autenticación de usuarios

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  login(email: string, password: string): Promise<boolean> {
    // Simulación de login
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'admin123') {
          const user: User = {
            id: 1,
            email: 'admin@example.com',
            name: 'Administrador',
            role: 'admin'
          };
          this.currentUser.next(user);
          this.isAuthenticated.next(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout(): void {
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
  }

  isAdmin(): boolean {
    const user = this.currentUser.value;
    return user?.role === 'admin';
  }
}
```

**Resultado Esperado**: Servicio de autenticación completo con roles y estados

---

## 🔧 CONFIGURACIÓN ADICIONAL

### Estructura de Archivos Recomendada

```
src/app/
├── services/
│   ├── products.service.ts
│   ├── favorites.service.ts
│   ├── cart.service.ts
│   ├── config.service.ts
│   └── auth.service.ts
├── models/
│   ├── product.ts
│   ├── cart-item.ts
│   ├── user.ts
│   └── app-config.ts
├── tokens/
│   └── app-settings.ts
└── components/
    └── product-list/
```

### Configuración de Providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { APP_SETTINGS, appSettings } from './app.settings';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: APP_SETTINGS, useValue: appSettings }
  ]
};
```

---

## 📊 RESUMEN DEL CAPÍTULO

### ✅ CONCEPTOS APRENDIDOS:
1. **Servicios**: Clases que encapsulan lógica de negocio
2. **Dependency Injection**: Sistema de inyección de dependencias
3. **InjectionToken**: Tokens tipados para inyección
4. **Providers**: Configuración de cómo inyectar dependencias
5. **Singleton Pattern**: Servicios como instancias únicas

### 🎯 HABILIDADES DESARROLLADAS:
- Crear servicios inyectables
- Configurar providers
- Usar InjectionToken
- Implementar herencia en servicios
- Escribir pruebas para servicios

### 🚀 PRÓXIMOS PASOS:
- Implementar servicios con HTTP
- Crear interceptores
- Trabajar con observables en servicios
- Implementar guards de autenticación

---

## 🔍 CONSEJOS DE APRENDIZAJE

1. **Usa Servicios**: Encapsula lógica de negocio en servicios
2. **Configura Providers**: Aprende a configurar inyección de dependencias
3. **Testea Servicios**: Escribe pruebas unitarias para servicios
4. **Reutiliza**: Crea servicios que puedan ser reutilizados

---

## 🎯 EJEMPLOS PRÁCTICOS ADICIONALES

### Ejemplo: Servicio de Logging

```typescript
// logging.service.ts
import { Injectable } from '@angular/core';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logs: Array<{ level: LogLevel; message: string; timestamp: Date }> = [];

  log(level: LogLevel, message: string): void {
    const logEntry = { level, message, timestamp: new Date() };
    this.logs.push(logEntry);
    
    // En producción, enviar a servicio de logging
    console.log(`[${level}] ${message}`, logEntry);
  }

  getLogs(): Array<{ level: LogLevel; message: string; timestamp: Date }> {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }
}
```

**Resultado Esperado**: Servicio de logging completo con diferentes niveles

---

*¡Excelente progreso! Has dominado los servicios y la inyección de dependencias en Angular.* 🎉 