# 🚀 GUÍA EXCEPCIONAL - CAPÍTULOS 7-12: ANGULAR AVANZADO

## 📋 CONTENIDO DE LOS CAPÍTULOS
Esta guía cubre los capítulos 7 al 12 de Angular, incluyendo enrutamiento, formularios, HTTP, testing avanzado, performance y optimización. Cada capítulo se enfoca en conceptos específicos y avanzados del framework.

---

## 🔍 CAPÍTULO 7: ENRUTAMIENTO Y NAVEGACIÓN

### Conceptos Clave:
- **RouterModule**: Configuración de rutas
- **Route Guards**: Protección de rutas
- **Lazy Loading**: Carga perezosa de módulos
- **Route Parameters**: Parámetros dinámicos

### Ejemplo de Configuración de Rutas:

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

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
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];
```

### Guard de Autenticación:

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}
```

### Resolver de Datos:

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
    const id = route.paramMap.get('id');
    if (id) {
      return this.productService.getProductById(+id);
    }
    return of(null);
  }
}
```

---

## 🔍 CAPÍTULO 8: FORMULARIOS REACTIVOS

### Conceptos Clave:
- **FormGroup**: Grupo de controles
- **FormControl**: Control individual
- **FormBuilder**: Constructor de formularios
- **Validators**: Validación personalizada

### Ejemplo de Formulario Reactivo Completo:

```typescript
// user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label>Nombre:</label>
        <input formControlName="name" />
        <div *ngIf="userForm.get('name')?.errors?.['required'] && userForm.get('name')?.touched">
          El nombre es requerido
        </div>
        <div *ngIf="userForm.get('name')?.errors?.['minlength']">
          El nombre debe tener al menos 2 caracteres
        </div>
      </div>
      
      <div>
        <label>Email:</label>
        <input formControlName="email" />
        <div *ngIf="userForm.get('email')?.errors?.['email']">
          Email inválido
        </div>
      </div>
      
      <div formGroupName="address">
        <label>Calle:</label>
        <input formControlName="street" />
        
        <label>Ciudad:</label>
        <input formControlName="city" />
      </div>
      
      <div>
        <label>Contraseña:</label>
        <input type="password" formControlName="password" />
        <div *ngIf="userForm.get('password')?.errors?.['passwordStrength']">
          La contraseña debe ser más fuerte
        </div>
      </div>
      
      <div>
        <label>Confirmar Contraseña:</label>
        <input type="password" formControlName="confirmPassword" />
        <div *ngIf="userForm.errors?.['passwordMismatch']">
          Las contraseñas no coinciden
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

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required]
      }),
      password: ['', [Validators.required, this.passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Escuchar cambios en el formulario
    this.userForm.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);
    });

    // Escuchar cambios en un control específico
    this.userForm.get('email')?.valueChanges.subscribe(email => {
      console.log('Email changed:', email);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      this.userService.createUser(userData).subscribe({
        next: (user) => {
          console.log('Usuario creado:', user);
          this.userForm.reset();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private passwordStrengthValidator(): Validators {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const valid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && password.length >= 8;
      return valid ? null : { passwordStrength: true };
    };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }
}
```

---

## 🔍 CAPÍTULO 9: HTTP Y COMUNICACIÓN CON APIs

### Conceptos Clave:
- **HttpClient**: Cliente HTTP de Angular
- **Interceptors**: Interceptores para requests/responses
- **Error Handling**: Manejo de errores
- **Retry Logic**: Lógica de reintento

### Servicio HTTP Completo:

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry, catchError, timeout } from 'rxjs';
import { User, Product, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.example.com';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    })
  };

  constructor(private http: HttpClient) {}

  // GET requests
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, this.httpOptions)
      .pipe(
        timeout(10000),
        retry(3),
        catchError(this.handleError)
      );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, this.httpOptions)
      .pipe(
        timeout(10000),
        retry(3),
        catchError(this.handleError)
      );
  }

  // POST requests
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.handleError)
      );
  }

  // PUT requests
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.handleError)
      );
  }

  // DELETE requests
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, this.httpOptions)
      .pipe(
        timeout(10000),
        catchError(this.handleError)
      );
  }

  // Query parameters
  searchUsers(query: string, page: number = 1, limit: number = 10): Observable<ApiResponse<User[]>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users/search`, {
      ...this.httpOptions,
      params
    }).pipe(
      timeout(10000),
      retry(3),
      catchError(this.handleError)
    );
  }

  // File upload
  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData, uploadOptions)
      .pipe(
        timeout(30000),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
```

### Interceptor de Autenticación:

```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();
    
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('auth/refresh')) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => next.handle(this.addToken(request, jwt)))
      );
    }
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
```

---

## 🔍 CAPÍTULO 10: TESTING AVANZADO

### Conceptos Clave:
- **Component Testing**: Pruebas de componentes
- **Service Testing**: Pruebas de servicios
- **Integration Testing**: Pruebas de integración
- **E2E Testing**: Pruebas end-to-end

### Pruebas de Componente Complejas:

```typescript
// user-form.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../services/user.service';
import { of, throwError } from 'rxjs';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUser = {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    address: {
      street: 'Calle Principal 123',
      city: 'Madrid'
    }
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['createUser']);
    
    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.valid).toBe(false);
  });

  it('should validate required fields', () => {
    const nameControl = component.userForm.get('name');
    const emailControl = component.userForm.get('email');

    nameControl?.setValue('');
    emailControl?.setValue('');

    expect(nameControl?.errors?.['required']).toBeTruthy();
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.userForm.get('password');
    
    // Contraseña débil
    passwordControl?.setValue('weak');
    expect(passwordControl?.errors?.['passwordStrength']).toBeTruthy();

    // Contraseña fuerte
    passwordControl?.setValue('StrongPass123!');
    expect(passwordControl?.errors?.['passwordStrength']).toBeFalsy();
  });

  it('should validate password match', () => {
    const passwordControl = component.userForm.get('password');
    const confirmPasswordControl = component.userForm.get('confirmPassword');
    
    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('password456');
    
    expect(component.userForm.errors?.['passwordMismatch']).toBeTruthy();

    confirmPasswordControl?.setValue('password123');
    expect(component.userForm.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('should submit form when valid', fakeAsync(() => {
    userService.createUser.and.returnValue(of(mockUser));

    // Llenar formulario válido
    component.userForm.patchValue({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      address: {
        street: 'Calle Principal 123',
        city: 'Madrid'
      },
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    component.onSubmit();
    tick();

    expect(userService.createUser).toHaveBeenCalledWith({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      address: {
        street: 'Calle Principal 123',
        city: 'Madrid'
      },
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });
  }));

  it('should handle submission error', fakeAsync(() => {
    const errorMessage = 'Error creating user';
    userService.createUser.and.returnValue(throwError(() => new Error(errorMessage)));

    spyOn(console, 'error');

    // Llenar formulario válido
    component.userForm.patchValue({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error al crear usuario:', jasmine.any(Error));
  }));

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', fakeAsync(() => {
    userService.createUser.and.returnValue(of(mockUser));
    spyOn(component.userForm, 'reset');

    // Llenar y enviar formulario
    component.userForm.patchValue({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    component.onSubmit();
    tick();

    expect(component.userForm.reset).toHaveBeenCalled();
  }));
});
```

### Pruebas de Servicio:

```typescript
// api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { User } from '../models/user';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const mockUsers = [mockUser];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create user', () => {
    const newUser = { name: 'Ana García', email: 'ana@example.com' };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockUser);
  });

  it('should handle HTTP errors', () => {
    const errorMessage = 'Server error';

    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Server error');
      }
    });

    const req = httpMock.expectOne('https://api.example.com/users');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
```

---

## 🔍 CAPÍTULO 11: PERFORMANCE Y OPTIMIZACIÓN

### Conceptos Clave:
- **Change Detection**: Estrategias de detección de cambios
- **OnPush Strategy**: Estrategia OnPush
- **TrackBy Functions**: Optimización de *ngFor
- **Lazy Loading**: Carga perezosa

### Componente Optimizado:

```typescript
// optimized-list.component.ts
import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../models/product';

@Component({
  selector: 'app-optimized-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-list">
      <div *ngFor="let product of products; trackBy: trackByProductId" 
           class="product-item"
           [class.selected]="selectedProductId === product.id">
        <h3>{{ product.title }}</h3>
        <p>{{ product.price | currency }}</p>
        <button (click)="selectProduct(product.id)">Seleccionar</button>
      </div>
    </div>
  `,
  styles: [`
    .product-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .product-item {
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 8px;
    }
    .product-item.selected {
      border-color: #007bff;
      background-color: #f8f9fa;
    }
  `]
})
export class OptimizedListComponent implements OnChanges {
  @Input() products: Product[] = [];
  @Input() selectedProductId: number | null = null;

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  selectProduct(productId: number): void {
    // Emitir evento o usar servicio
    console.log('Producto seleccionado:', productId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      console.log('Productos actualizados:', this.products.length);
    }
  }
}
```

### Servicio de Cache:

```typescript
// cache.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = 300000): void { // 5 minutos por defecto
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Método para obtener datos con cache automático
  getWithCache<T>(key: string, dataObservable: Observable<T>, ttl: number = 300000): Observable<T> {
    const cached = this.get<T>(key);
    
    if (cached) {
      return of(cached);
    }

    return dataObservable.pipe(
      map(data => {
        this.set(key, data, ttl);
        return data;
      })
    );
  }

  // Limpiar cache expirado
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
```

---

## 🔍 CAPÍTULO 12: SEGURIDAD

### Conceptos Clave:
- **XSS Prevention**: Prevención de ataques XSS
- **CSRF Protection**: Protección contra CSRF
- **Content Security Policy**: Políticas de seguridad
- **Input Sanitization**: Sanitización de entrada

### Interceptor de Seguridad:

```typescript
// security.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Agregar headers de seguridad
    const secureReq = req.clone({
      headers: req.headers
        .set('X-Content-Type-Options', 'nosniff')
        .set('X-Frame-Options', 'DENY')
        .set('X-XSS-Protection', '1; mode=block')
        .set('Referrer-Policy', 'strict-origin-when-cross-origin')
        .set('Content-Security-Policy', this.getCSPHeader())
    });

    return next.handle(secureReq);
  }

  private getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }
}
```

### Pipe de Sanitización:

```typescript
// safe-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
```

### Servicio de Validación:

```typescript
// validation.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  // Validar entrada contra XSS
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar contraseña fuerte
  isStrongPassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }

  // Validar URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validar entrada numérica
  isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }

  // Limpiar entrada de caracteres especiales
  cleanInput(input: string): string {
    return input.replace(/[<>]/g, '');
  }
}
```

---

## 🧪 PRUEBAS UNITARIAS INTEGRADAS

### Pruebas de Performance:

```typescript
// performance.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptimizedListComponent } from './optimized-list.component';

describe('Performance Tests', () => {
  let component: OptimizedListComponent;
  let fixture: ComponentFixture<OptimizedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptimizedListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OptimizedListComponent);
    component = fixture.componentInstance;
  });

  it('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      title: `Product ${i}`,
      price: Math.random() * 100
    }));

    const startTime = performance.now();
    component.products = largeDataset;
    fixture.detectChanges();
    const endTime = performance.now();

    // Debería renderizar en menos de 100ms
    expect(endTime - startTime).toBeLessThan(100);
  });

  it('should use trackBy function for optimization', () => {
    const products = [
      { id: 1, title: 'Product 1', price: 10 },
      { id: 2, title: 'Product 2', price: 20 }
    ];

    component.products = products;
    fixture.detectChanges();

    const trackBySpy = spyOn(component, 'trackByProductId');
    
    // Simular actualización de productos
    component.products = [...products, { id: 3, title: 'Product 3', price: 30 }];
    fixture.detectChanges();

    expect(trackBySpy).toHaveBeenCalled();
  });
});
```

### Pruebas de Seguridad:

```typescript
// security.spec.ts
import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('Security Tests', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('should sanitize XSS attempts', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = service.sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });

  it('should validate strong passwords', () => {
    expect(service.isStrongPassword('WeakPass')).toBe(false);
    expect(service.isStrongPassword('StrongPass123!')).toBe(true);
  });

  it('should validate email format', () => {
    expect(service.isValidEmail('invalid-email')).toBe(false);
    expect(service.isValidEmail('valid@email.com')).toBe(true);
  });
});
```

---

## 🎯 EJERCICIOS PRÁCTICOS INTEGRADOS

### Ejercicio 1: Aplicación E-commerce Completa

```typescript
// Estructura de la aplicación
src/app/
├── components/
│   ├── product-list/
│   ├── product-detail/
│   ├── shopping-cart/
│   ├── checkout/
│   └── user-profile/
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── auth.service.ts
│   └── order.service.ts
├── guards/
│   ├── auth.guard.ts
│   └── admin.guard.ts
├── interceptors/
│   ├── auth.interceptor.ts
│   └── error.interceptor.ts
├── models/
│   ├── product.ts
│   ├── user.ts
│   └── order.ts
└── utils/
    ├── validators.ts
    └── formatters.ts
```

### Ejercicio 2: Dashboard Administrativo

```typescript
// Características principales
- Autenticación y autorización con roles
- Gestión de usuarios y productos
- Estadísticas en tiempo real
- Gráficos interactivos
- Exportación de datos
- Notificaciones push
- Auditoría de acciones
- Backup automático
```

---

## 📊 RESUMEN GENERAL

### ✅ CONCEPTOS DOMINADOS:
1. **Enrutamiento Avanzado**: Guards, resolvers, lazy loading
2. **Formularios Reactivos**: Validación compleja, form builders
3. **HTTP y APIs**: Interceptors, manejo de errores, cache
4. **Testing Completo**: Unit, integration, performance
5. **Optimización**: OnPush, trackBy, lazy loading
6. **Seguridad**: XSS, CSRF, sanitización

### 🎯 HABILIDADES DESARROLLADAS:
- Crear aplicaciones Angular escalables
- Implementar arquitecturas robustas
- Escribir código seguro y optimizado
- Realizar testing completo
- Manejar performance y seguridad

### 🚀 PRÓXIMOS PASOS:
- Implementar PWA (Progressive Web Apps)
- Explorar Angular Universal (SSR)
- Trabajar con micro frontends
- Implementar CI/CD pipelines

---

*¡Felicidades! Has completado una guía excepcional de Angular avanzado. Estás listo para crear aplicaciones profesionales.* 🎉 