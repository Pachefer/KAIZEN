# 🚀 GUÍA EXCEPCIONAL - CAPÍTULO 7: ENRUTAMIENTO Y NAVEGACIÓN

## 📋 CONTENIDO DEL CAPÍTULO
Este capítulo introduce el sistema de enrutamiento de Angular, que permite crear aplicaciones de una sola página (SPA) con navegación entre diferentes vistas. Aprenderás a configurar rutas, crear guards de protección y implementar lazy loading.

---

## 🔍 ANÁLISIS DETALLADO DEL CÓDIGO

### 1. **Configuración Básica de Rutas**

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: '**', component: NotFoundComponent }
];
```

**📝 COMENTARIOS DETALLADOS:**

- **`Routes`**: Tipo que define un array de configuraciones de rutas
- **`path: ''`**: Ruta raíz que redirige a '/home'
- **`pathMatch: 'full'`**: Coincidencia exacta de la ruta
- **`path: 'products/:id'`**: Ruta con parámetro dinámico
- **`path: '**'`**: Ruta comodín para páginas no encontradas

**🎯 PREDICCIÓN DE RESULTADOS:**
- La aplicación redirigirá automáticamente a '/home' desde la raíz
- Se podrá navegar a '/products' para ver la lista
- Se podrá navegar a '/products/123' para ver un producto específico
- Cualquier ruta no definida mostrará el componente NotFound

### 2. **Configuración del Router**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation())
  ]
};
```

**📝 COMENTARIOS DETALLADOS:**

- **`provideRouter(routes)`**: Configura el router con las rutas definidas
- **`withHashLocation()`**: Usa hash-based routing (#) en lugar de HTML5 history API
- **`ApplicationConfig`**: Tipo que define la configuración de la aplicación

**🎯 PREDICCIÓN DE RESULTADOS:**
- Las URLs tendrán el formato '#/ruta' en lugar de '/ruta'
- Mejor compatibilidad con servidores que no soportan HTML5 history
- Navegación funcional sin configuración especial del servidor

### 3. **Componente con Navegación**

```typescript
// product-list.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <div *ngFor="let product of products" 
           class="product-item"
           (click)="viewProduct(product.id)">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price | currency }}</p>
      </div>
    </div>
  `
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, title: 'Producto 1', price: 100 },
    { id: 2, title: 'Producto 2', price: 200 },
    { id: 3, title: 'Producto 3', price: 300 }
  ];

  constructor(private router: Router) {}

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`Router`**: Servicio para navegación programática
- **`router.navigate(['/products', productId])`**: Navega a una ruta con parámetros
- **`(click)="viewProduct(product.id)"`**: Evento que dispara la navegación
- **`products: Product[]`**: Array de productos para mostrar

**🎯 PREDICCIÓN DE RESULTADOS:**
- Se mostrará una lista de productos
- Al hacer clic en un producto, navegará a su detalle
- La URL cambiará a '/products/1', '/products/2', etc.

### 4. **Componente que Recibe Parámetros**

```typescript
// product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-detail',
  template: `
    <div *ngIf="product" class="product-detail">
      <h2>{{ product.title }}</h2>
      <p>Precio: {{ product.price | currency }}</p>
      <button (click)="goBack()">Volver</button>
    </div>
    <div *ngIf="!product">
      <p>Producto no encontrado</p>
      <button (click)="goBack()">Volver</button>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: number): void {
    // Simular carga de producto
    this.product = {
      id: id,
      title: `Producto ${id}`,
      price: id * 100
    };
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`ActivatedRoute`**: Servicio que proporciona información sobre la ruta activa
- **`route.params.subscribe()`**: Observable que emite cuando cambian los parámetros
- **`+params['id']`**: Convierte el parámetro string a number
- **`router.navigate(['/products'])`**: Navega de vuelta a la lista

**🎯 PREDICCIÓN DE RESULTADOS:**
- El componente recibirá el ID del producto desde la URL
- Mostrará los detalles del producto correspondiente
- El botón "Volver" navegará de vuelta a la lista
- Si no encuentra el producto, mostrará mensaje de error

---

## 🧪 PRUEBAS UNITARIAS

### Prueba para ProductListComponent

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have products array', () => {
    expect(component.products.length).toBe(3);
    expect(component.products[0].title).toBe('Producto 1');
  });

  it('should navigate to product detail when viewProduct is called', () => {
    const productId = 1;
    
    component.viewProduct(productId);
    
    expect(router.navigate).toHaveBeenCalledWith(['/products', productId]);
  });

  it('should render product list', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Producto 1');
    expect(compiled.textContent).toContain('Producto 2');
    expect(compiled.textContent).toContain('Producto 3');
  });
});
```

### Prueba para ProductDetailComponent

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    component.ngOnInit();
    
    expect(component.product).toBeDefined();
    expect(component.product?.id).toBe(1);
    expect(component.product?.title).toBe('Producto 1');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle different product IDs', () => {
    // Simular cambio de parámetros
    (route.params as any) = of({ id: '5' });
    
    component.ngOnInit();
    
    expect(component.product?.id).toBe(5);
    expect(component.product?.title).toBe('Producto 5');
  });
});
```

### Prueba de Integración de Rutas

```typescript
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app.routes';

describe('Route Configuration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)]
    });
  });

  it('should have correct route structure', () => {
    expect(routes.length).toBeGreaterThan(0);
    
    const homeRoute = routes.find(r => r.path === 'home');
    expect(homeRoute).toBeDefined();
    
    const productsRoute = routes.find(r => r.path === 'products');
    expect(productsRoute).toBeDefined();
    
    const wildcardRoute = routes.find(r => r.path === '**');
    expect(wildcardRoute).toBeDefined();
  });

  it('should have redirect route', () => {
    const redirectRoute = routes.find(r => r.path === '');
    expect(redirectRoute?.redirectTo).toBe('/home');
    expect(redirectRoute?.pathMatch).toBe('full');
  });
});
```

---

## 🎯 EJERCICIOS PRÁCTICOS

### Ejercicio 1: Crear Guard de Autenticación
**Objetivo**: Crear un guard que proteja rutas que requieren autenticación

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Guardar la URL a la que quería ir
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
  }
}
```

**Resultado Esperado**: Rutas protegidas que redirigen a login si no hay autenticación

### Ejercicio 2: Crear Resolver de Datos
**Objetivo**: Crear un resolver que cargue datos antes de activar una ruta

```typescript
// product.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product | null> {
    const productId = route.paramMap.get('id');
    
    if (productId) {
      return this.productService.getProductById(+productId);
    }
    
    return of(null);
  }
}
```

**Resultado Esperado**: Datos cargados antes de mostrar el componente

### Ejercicio 3: Implementar Lazy Loading
**Objetivo**: Crear un módulo que se cargue de forma perezosa

```typescript
// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  }
];

// app.routes.ts
export const routes: Routes = [
  // ... otras rutas
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

**Resultado Esperado**: Módulo admin que se carga solo cuando se necesita

---

## 🔧 CONFIGURACIÓN ADICIONAL

### Estructura de Archivos Recomendada

```
src/app/
├── components/
│   ├── home/
│   ├── product-list/
│   ├── product-detail/
│   └── not-found/
├── guards/
│   ├── auth.guard.ts
│   └── admin.guard.ts
├── resolvers/
│   └── product.resolver.ts
├── modules/
│   └── admin/
│       ├── admin.module.ts
│       ├── admin.routes.ts
│       └── components/
└── app.routes.ts
```

### Configuración Avanzada de Rutas

```typescript
// app.routes.ts con configuración completa
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ProductResolver } from './resolvers/product.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'products', 
    component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'products/:id', 
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
    resolve: {
      product: ProductResolver
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];
```

---

## 📊 RESUMEN DEL CAPÍTULO

### ✅ CONCEPTOS APRENDIDOS:
1. **Configuración de Rutas**: Cómo definir rutas en Angular
2. **Navegación Programática**: Usar Router para navegar desde código
3. **Parámetros de Ruta**: Obtener y usar parámetros dinámicos
4. **Guards**: Protección de rutas con guards
5. **Resolvers**: Carga de datos antes de activar rutas
6. **Lazy Loading**: Carga perezosa de módulos

### 🎯 HABILIDADES DESARROLLADAS:
- Configurar sistema de rutas completo
- Implementar navegación entre componentes
- Crear guards de autenticación
- Usar resolvers para precarga de datos
- Implementar lazy loading
- Escribir pruebas para rutas

### 🚀 PRÓXIMOS PASOS:
- Implementar guards más complejos
- Crear resolvers para múltiples datos
- Trabajar con rutas anidadas
- Implementar navegación con historial

---

## 🔍 CONSEJOS DE APRENDIZAJE

1. **Planifica las Rutas**: Diseña la estructura de navegación antes de implementar
2. **Usa Guards**: Protege rutas sensibles con guards apropiados
3. **Optimiza con Lazy Loading**: Carga módulos solo cuando se necesiten
4. **Testea la Navegación**: Escribe pruebas para verificar el comportamiento de las rutas

---

*¡Excelente progreso! Has dominado el sistema de enrutamiento de Angular.* 🎉 