# 🚀 GUÍA EXCEPCIONAL - CAPÍTULOS 4-15: ANGULAR AVANZADO

## 📋 CONTENIDO DE LOS CAPÍTULOS
Esta guía cubre los conceptos avanzados de Angular desde el Capítulo 4 hasta el 15, incluyendo servicios, enrutamiento, formularios, HTTP, testing y más.

---

## 🔍 CAPÍTULO 4: SERVICIOS Y DEPENDENCY INJECTION

### Conceptos Clave:
- **Servicios**: Clases que encapsulan lógica de negocio
- **Dependency Injection**: Sistema de inyección de dependencias de Angular
- **Singleton Pattern**: Los servicios son singletons por defecto

### Ejemplo de Servicio:

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' }
  ];

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = { ...user, id: Math.max(...this.users.map(u => u.id)) + 1 };
    this.users.push(newUser);
    return of(newUser);
  }
}
```

### Pruebas Unitarias:

```typescript
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users', (done) => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('Juan Pérez');
      done();
    });
  });
});
```

---

## 🔍 CAPÍTULO 5: ENRUTAMIENTO Y NAVEGACIÓN

### Conceptos Clave:
- **RouterModule**: Módulo para manejar rutas
- **Route Guards**: Protección de rutas
- **Lazy Loading**: Carga perezosa de módulos

### Ejemplo de Configuración de Rutas:

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];
```

### Guard de Autenticación:

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

---

## 🔍 CAPÍTULO 6: FORMULARIOS REACTIVOS

### Conceptos Clave:
- **FormGroup**: Grupo de controles de formulario
- **FormControl**: Control individual de formulario
- **Validators**: Validadores integrados y personalizados

### Ejemplo de Formulario Reactivo:

```typescript
// user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Nombre:</label>
        <input formControlName="name" />
        <div *ngIf="userForm.get('name')?.errors?.['required']">
          El nombre es requerido
        </div>
      </div>
      
      <div>
        <label>Email:</label>
        <input formControlName="email" />
        <div *ngIf="userForm.get('email')?.errors?.['email']">
          Email inválido
        </div>
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">
        Guardar
      </button>
    </form>
  `
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(18), Validators.max(100)]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
```

### Pruebas de Formulario:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const nameControl = component.userForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });
});
```

---

## 🔍 CAPÍTULO 7: HTTP Y COMUNICACIÓN CON APIs

### Conceptos Clave:
- **HttpClient**: Cliente HTTP de Angular
- **Observables**: Manejo de respuestas asíncronas
- **Interceptors**: Interceptores para requests/responses

### Ejemplo de Servicio HTTP:

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
```

### Interceptor de Autenticación:

```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

---

## 🔍 CAPÍTULO 8: OBSERVABLES Y RXJS

### Conceptos Clave:
- **Observables**: Flujos de datos asíncronos
- **Operators**: Operadores para transformar datos
- **Subjects**: Tipos especiales de observables

### Ejemplo de Uso de RxJS:

```typescript
// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, filter, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any[]>([]);
  public data$ = this.dataSubject.asObservable();

  updateData(newData: any[]) {
    this.dataSubject.next(newData);
  }

  getFilteredData(searchTerm: string): Observable<any[]> {
    return this.data$.pipe(
      map(data => data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }

  getDataWithDelay(): Observable<any[]> {
    return this.data$.pipe(
      debounceTime(300),
      filter(data => data.length > 0)
    );
  }
}
```

### Componente que Usa Observables:

```typescript
// search.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl" placeholder="Buscar..." />
    <div *ngFor="let item of filteredItems">
      {{ item.name }}
    </div>
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  filteredItems: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.dataService.getFilteredData(searchTerm || '').subscribe(
        data => this.filteredItems = data
      );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 🔍 CAPÍTULO 9: PIPES Y TRANSFORMACIÓN DE DATOS

### Conceptos Clave:
- **Pipes**: Transformadores de datos en templates
- **Pipes Personalizados**: Creación de pipes custom
- **Pipes Impuros**: Pipes que se ejecutan en cada ciclo de detección

### Ejemplo de Pipe Personalizado:

```typescript
// currency-converter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyConverter'
})
export class CurrencyConverterPipe implements PipeTransform {
  private exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.5
  };

  transform(value: number, fromCurrency: string, toCurrency: string): number {
    if (!value || !fromCurrency || !toCurrency) {
      return value;
    }

    const fromRate = this.exchangeRates[fromCurrency as keyof typeof this.exchangeRates];
    const toRate = this.exchangeRates[toCurrency as keyof typeof this.exchangeRates];
    
    if (!fromRate || !toRate) {
      return value;
    }

    return (value / fromRate) * toRate;
  }
}
```

### Uso en Template:

```html
<div>
  <p>Precio en USD: {{ price | currency:'USD' }}</p>
  <p>Precio en EUR: {{ price | currencyConverter:'USD':'EUR' | currency:'EUR' }}</p>
  <p>Precio en GBP: {{ price | currencyConverter:'USD':'GBP' | currency:'GBP' }}</p>
</div>
```

---

## 🔍 CAPÍTULO 10: DIRECTIVAS

### Conceptos Clave:
- **Directivas Estructurales**: *ngIf, *ngFor, *ngSwitch
- **Directivas de Atributo**: ngClass, ngStyle
- **Directivas Personalizadas**: Creación de directivas custom

### Ejemplo de Directiva Personalizada:

```typescript
// highlight.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: string = 'yellow';
  @Input() defaultColor: string = 'transparent';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.highlight(this.appHighlight || this.defaultColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

### Directiva Estructural Personalizada:

```typescript
// unless.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]',
  standalone: true
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

---

## 🔍 CAPÍTULO 11: TESTING AVANZADO

### Conceptos Clave:
- **Testing de Componentes**: Pruebas de componentes con TestBed
- **Testing de Servicios**: Pruebas de servicios con mocks
- **Testing de Integración**: Pruebas end-to-end con Protractor

### Ejemplo de Testing Completo:

```typescript
// user-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUsers = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);
    
    await TestBed.configureTestingModule({
      imports: [UserListComponent, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    userService.getUsers.and.returnValue(of(mockUsers));
    
    component.ngOnInit();
    
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should delete user when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userService.deleteUser.and.returnValue(of(void 0));
    
    component.deleteUser(1);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should not delete user when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteUser(1);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });
});
```

---

## 🔍 CAPÍTULO 12: PERFORMANCE Y OPTIMIZACIÓN

### Conceptos Clave:
- **Change Detection**: Estrategias de detección de cambios
- **OnPush Strategy**: Estrategia OnPush para mejor performance
- **Lazy Loading**: Carga perezosa de módulos y componentes

### Ejemplo de Optimización:

```typescript
// optimized.component.ts
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <button (click)="onClick()">Click me</button>
    </div>
  `
})
export class OptimizedComponent {
  @Input() title: string = '';
  @Input() description: string = '';

  onClick() {
    console.log('Button clicked');
  }
}
```

### TrackBy Function para *ngFor:

```typescript
// user-list.component.ts
export class UserListComponent {
  users: User[] = [];

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
```

```html
<div *ngFor="let user of users; trackBy: trackByUserId">
  {{ user.name }}
</div>
```

---

## 🔍 CAPÍTULO 13: SEGURIDAD

### Conceptos Clave:
- **XSS Prevention**: Prevención de ataques XSS
- **CSRF Protection**: Protección contra CSRF
- **Content Security Policy**: Políticas de seguridad de contenido

### Ejemplo de Sanitización:

```typescript
// safe-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
```

### Interceptor de Seguridad:

```typescript
// security.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Agregar headers de seguridad
    const secureReq = req.clone({
      headers: req.headers
        .set('X-Content-Type-Options', 'nosniff')
        .set('X-Frame-Options', 'DENY')
        .set('X-XSS-Protection', '1; mode=block')
    });

    return next.handle(secureReq);
  }
}
```

---

## 🔍 CAPÍTULO 14: DEPLOYMENT Y PRODUCCIÓN

### Conceptos Clave:
- **Build Optimization**: Optimización del build de producción
- **Environment Configuration**: Configuración de entornos
- **Deployment Strategies**: Estrategias de despliegue

### Configuración de Entornos:

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  version: '1.0.0'
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.mysite.com/api',
  version: '1.0.0'
};
```

### Angular.json Optimizado:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

---

## 🔍 CAPÍTULO 15: PATRONES AVANZADOS

### Conceptos Clave:
- **State Management**: Gestión de estado con NgRx
- **Micro Frontends**: Arquitectura de micro frontends
- **Server-Side Rendering**: Renderizado del lado del servidor

### Ejemplo de State Management con NgRx:

```typescript
// user.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: any }>()
);
```

```typescript
// user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user';
import * as UserActions from './user.actions';

export interface UserState {
  users: User[];
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({
    ...state,
    loading: true
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
```

---

## 🎯 EJERCICIOS PRÁCTICOS INTEGRADOS

### Ejercicio 1: Aplicación Completa de E-commerce

```typescript
// Estructura de la aplicación
src/app/
├── components/
│   ├── product-list/
│   ├── product-detail/
│   ├── shopping-cart/
│   └── checkout/
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── order.service.ts
├── models/
│   ├── product.ts
│   ├── cart-item.ts
│   └── order.ts
├── guards/
│   └── auth.guard.ts
└── interceptors/
    └── auth.interceptor.ts
```

### Ejercicio 2: Dashboard Administrativo

```typescript
// Características principales
- Autenticación y autorización
- Gestión de usuarios
- Estadísticas en tiempo real
- Gráficos interactivos
- Exportación de datos
- Notificaciones push
```

---

## 📊 RESUMEN GENERAL

### ✅ CONCEPTOS DOMINADOS:
1. **Arquitectura Angular**: Componentes, servicios, módulos
2. **TypeScript Avanzado**: Tipos, interfaces, generics
3. **RxJS**: Observables, operadores, subjects
4. **Testing**: Unit testing, integration testing
5. **Performance**: Optimización y mejores prácticas
6. **Seguridad**: Prevención de vulnerabilidades
7. **Deployment**: Configuración de producción

### 🎯 HABILIDADES DESARROLLADAS:
- Crear aplicaciones Angular completas
- Implementar arquitecturas escalables
- Escribir código mantenible y testeable
- Optimizar performance de aplicaciones
- Desplegar aplicaciones en producción

### 🚀 PRÓXIMOS PASOS:
- Explorar frameworks de estado (NgRx, Akita)
- Aprender sobre micro frontends
- Implementar PWA (Progressive Web Apps)
- Explorar Angular Universal (SSR)

---

## 🔍 CONSEJOS FINALES

1. **Practica Constante**: Crea proyectos reales para aplicar conceptos
2. **Mantente Actualizado**: Angular evoluciona rápidamente
3. **Comunidad**: Participa en foros y conferencias
4. **Documentación**: Lee la documentación oficial regularmente
5. **Code Review**: Revisa código de otros desarrolladores

---

*¡Felicidades! Has completado una guía excepcional de Angular. Estás listo para crear aplicaciones profesionales.* 🎉 