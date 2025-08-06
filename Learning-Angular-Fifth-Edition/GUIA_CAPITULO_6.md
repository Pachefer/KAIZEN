# 🚀 GUÍA EXCEPCIONAL - CAPÍTULO 6: OBSERVABLES Y RXJS

## 📋 CONTENIDO DEL CAPÍTULO
Este capítulo introduce los observables y RxJS, que son fundamentales para manejar flujos de datos asíncronos en Angular. Aprenderás a crear observables, usar operadores RxJS, y manejar eventos del DOM de manera reactiva.

---

## 🔍 ANÁLISIS DETALLADO DEL CÓDIGO

### 1. **app.component.ts - Componente con Observables**

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CopyrightDirective } from './copyright.directive';
import { APP_SETTINGS, appSettings } from './app.settings';
import { Observable } from 'rxjs';

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
  title$ = new Observable(observer => {
    setInterval(() => {
      observer.next();
    }, 2000);
  });  
  settings = inject(APP_SETTINGS);
  
  private setTitle = () => {
    const timestamp = new Date();
    this.title = `${this.settings.title} (${timestamp})`;
  }

  constructor() {
    this.title$.subscribe(this.setTitle);
  }
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`import { Observable } from 'rxjs'`**: Importa la clase Observable de RxJS
- **`title$ = new Observable(observer => { ... })`**: Crea un observable personalizado
- **`setInterval(() => { observer.next(); }, 2000)`**: Emite un valor cada 2 segundos
- **`title$`**: Convención de nomenclatura para observables (termina en $)
- **`this.title$.subscribe(this.setTitle)`**: Se suscribe al observable y ejecuta setTitle
- **`setTitle`**: Método que actualiza el título con timestamp

**🎯 PREDICCIÓN DE RESULTADOS:**
- El título se actualizará cada 2 segundos con un nuevo timestamp
- El formato será "My e-shop (timestamp actual)"
- El observable emitirá valores indefinidamente hasta que se desuscriba

### 2. **key-logger.component.ts - Componente de Logging de Teclas**

```typescript
import { Component, ElementRef, OnInit, viewChild, input } from '@angular/core';
import { fromEvent, tap, map, filter } from 'rxjs';

@Component({
  selector: 'app-key-logger',
  imports: [],
  templateUrl: './key-logger.component.html',
  styleUrl: './key-logger.component.css'
})
export class KeyLoggerComponent implements OnInit {
  input = viewChild<ElementRef>('keyContainer');
  numeric = input(false);
  keys = '';

  ngOnInit(): void {
    const logger$ = fromEvent<KeyboardEvent>(this.input()!.nativeElement, 'keyup');
    logger$.pipe(
      map(evt => evt.key.charCodeAt(0)),
      filter(code => {
        if (this.numeric()) {
          return (code > 31 && (code < 48 || code > 57)) === false;
        }
        return true;
      }),
      tap(digit => this.keys += String.fromCharCode(digit))
    ).subscribe();
  }  
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`import { fromEvent, tap, map, filter } from 'rxjs'`**: Importa operadores RxJS
- **`viewChild<ElementRef>('keyContainer')`**: Nueva sintaxis de Angular 17+ para viewChild
- **`input(false)`**: Nueva sintaxis para inputs
- **`fromEvent<KeyboardEvent>(element, 'keyup')`**: Crea observable desde evento DOM
- **`map(evt => evt.key.charCodeAt(0))`**: Transforma evento en código ASCII
- **`filter(code => ...)`**: Filtra códigos según si es numérico o no
- **`tap(digit => this.keys += String.fromCharCode(digit))`**: Efecto secundario que acumula teclas
- **`subscribe()`**: Se suscribe al observable

**🎯 PREDICCIÓN DE RESULTADOS:**
- Capturará todas las teclas presionadas en el elemento
- Si numeric es true, solo capturará números (códigos 48-57)
- Acumulará las teclas en la propiedad keys
- Se ejecutará cada vez que se presione una tecla

---

## 🧪 PRUEBAS UNITARIAS

### Prueba para AppComponent con Observables

```typescript
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { APP_SETTINGS, appSettings } from './app.settings';

describe('AppComponent with Observables', () => {
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

  it('should have title$ observable', () => {
    expect(component.title$).toBeDefined();
    expect(typeof component.title$.subscribe).toBe('function');
  });

  it('should update title after 2 seconds', fakeAsync(() => {
    const initialTitle = component.title;
    
    tick(2000);
    fixture.detectChanges();
    
    expect(component.title).not.toBe(initialTitle);
    expect(component.title).toContain('My e-shop');
    expect(component.title).toContain('(');
  }));

  it('should have settings injected', () => {
    expect(component.settings).toBeDefined();
    expect(component.settings.title).toBe('My e-shop');
  });

  it('should update title with timestamp', fakeAsync(() => {
    const beforeTime = new Date();
    
    tick(2000);
    fixture.detectChanges();
    
    const titleTime = component.title.match(/\((.*)\)/)?.[1];
    const afterTime = new Date();
    
    if (titleTime) {
      const titleDate = new Date(titleTime);
      expect(titleDate.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(titleDate.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    }
  }));
});
```

### Prueba para KeyLoggerComponent

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyLoggerComponent } from './key-logger/key-logger.component';
import { ElementRef } from '@angular/core';

describe('KeyLoggerComponent', () => {
  let component: KeyLoggerComponent;
  let fixture: ComponentFixture<KeyLoggerComponent>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    mockElementRef = {
      nativeElement: document.createElement('input')
    };

    await TestBed.configureTestingModule({
      imports: [KeyLoggerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(KeyLoggerComponent);
    component = fixture.componentInstance;
    
    // Mock viewChild
    component.input = () => mockElementRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have numeric input defaulting to false', () => {
    expect(component.numeric()).toBe(false);
  });

  it('should have empty keys initially', () => {
    expect(component.keys).toBe('');
  });

  it('should capture all keys when numeric is false', () => {
    const inputElement = mockElementRef.nativeElement;
    
    // Simular evento keyup
    const keyEvent = new KeyboardEvent('keyup', { key: 'a' });
    inputElement.dispatchEvent(keyEvent);
    
    expect(component.keys).toContain('a');
  });

  it('should only capture numbers when numeric is true', () => {
    component.numeric = () => true;
    const inputElement = mockElementRef.nativeElement;
    
    // Simular evento keyup con letra
    const letterEvent = new KeyboardEvent('keyup', { key: 'a' });
    inputElement.dispatchEvent(letterEvent);
    
    // Simular evento keyup con número
    const numberEvent = new KeyboardEvent('keyup', { key: '5' });
    inputElement.dispatchEvent(numberEvent);
    
    expect(component.keys).not.toContain('a');
    expect(component.keys).toContain('5');
  });

  it('should accumulate multiple keys', () => {
    const inputElement = mockElementRef.nativeElement;
    
    // Simular múltiples eventos
    ['h', 'e', 'l', 'l', 'o'].forEach(key => {
      const event = new KeyboardEvent('keyup', { key });
      inputElement.dispatchEvent(event);
    });
    
    expect(component.keys).toBe('hello');
  });
});
```

### Prueba de Integración con RxJS

```typescript
import { TestBed } from '@angular/core/testing';
import { fromEvent, map, filter, tap } from 'rxjs';

describe('RxJS Integration', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('input');
  });

  it('should create observable from DOM event', (done) => {
    const event$ = fromEvent<KeyboardEvent>(mockElement, 'keyup');
    let eventCount = 0;

    event$.subscribe(() => {
      eventCount++;
      if (eventCount === 2) {
        expect(eventCount).toBe(2);
        done();
      }
    });

    // Simular eventos
    mockElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    mockElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
  });

  it('should transform events with map operator', (done) => {
    const event$ = fromEvent<KeyboardEvent>(mockElement, 'keyup');
    
    event$.pipe(
      map(evt => evt.key)
    ).subscribe(key => {
      expect(key).toBe('x');
      done();
    });

    mockElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'x' }));
  });

  it('should filter events with filter operator', (done) => {
    const event$ = fromEvent<KeyboardEvent>(mockElement, 'keyup');
    
    event$.pipe(
      map(evt => evt.key),
      filter(key => key === 'a')
    ).subscribe(key => {
      expect(key).toBe('a');
      done();
    });

    // Este evento será filtrado
    mockElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    // Este evento pasará el filtro
    mockElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
  });
});
```

---

## 🎯 EJERCICIOS PRÁCTICOS

### Ejercicio 1: Crear Observable de Contador
**Objetivo**: Crear un observable que cuente hacia arriba y hacia abajo

```typescript
// counter.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private counter = new BehaviorSubject<number>(0);
  private isRunning = new BehaviorSubject<boolean>(false);
  private direction = new BehaviorSubject<'up' | 'down'>('up');

  getCounter(): Observable<number> {
    return this.counter.asObservable();
  }

  getIsRunning(): Observable<boolean> {
    return this.isRunning.asObservable();
  }

  start(): void {
    if (!this.isRunning.value) {
      this.isRunning.next(true);
      
      interval(1000).pipe(
        map(() => {
          const current = this.counter.value;
          const dir = this.direction.value;
          return dir === 'up' ? current + 1 : current - 1;
        })
      ).subscribe(newValue => {
        this.counter.next(newValue);
      });
    }
  }

  stop(): void {
    this.isRunning.next(false);
  }

  reset(): void {
    this.counter.next(0);
  }

  setDirection(direction: 'up' | 'down'): void {
    this.direction.next(direction);
  }

  setValue(value: number): void {
    this.counter.next(value);
  }
}
```

**Resultado Esperado**: Servicio de contador reactivo con controles

### Ejercicio 2: Crear Observable de Búsqueda
**Objetivo**: Crear un observable que maneje búsquedas con debounce

```typescript
// search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  private searchResults = new BehaviorSubject<Product[]>([]);

  getSearchResults(): Observable<Product[]> {
    return this.searchResults.asObservable();
  }

  search(term: string): void {
    this.searchTerm.next(term);
  }

  setupSearch(products: Product[]): void {
    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term.trim()) {
          return [products];
        }
        const filtered = products.filter(product =>
          product.title.toLowerCase().includes(term.toLowerCase())
        );
        return [filtered];
      })
    ).subscribe(results => {
      this.searchResults.next(results);
    });
  }

  clearSearch(): void {
    this.searchTerm.next('');
  }
}
```

**Resultado Esperado**: Servicio de búsqueda con debounce y filtrado

### Ejercicio 3: Crear Observable de Notificaciones
**Objetivo**: Crear un sistema de notificaciones reactivo

```typescript
// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private nextId = 1;

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000): void {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type,
      duration
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      timer(duration).subscribe(() => {
        this.remove(notification.id);
      });
    }
  }

  remove(id: number): void {
    const currentNotifications = this.notifications.value;
    const filtered = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(filtered);
  }

  clearAll(): void {
    this.notifications.next([]);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}
```

**Resultado Esperado**: Sistema de notificaciones completo con auto-remoción

---

## 🔧 CONFIGURACIÓN ADICIONAL

### Estructura de Archivos Recomendada

```
src/app/
├── services/
│   ├── counter.service.ts
│   ├── search.service.ts
│   └── notification.service.ts
├── components/
│   ├── key-logger/
│   └── counter/
├── models/
│   └── notification.ts
└── utils/
    └── rxjs-helpers.ts
```

### Operadores RxJS Comunes

```typescript
// rxjs-helpers.ts
import { Observable, map, filter, debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs';

export const rxjsHelpers = {
  // Transformar datos
  mapData: <T, R>(transform: (value: T) => R) => map<T, R>(transform),
  
  // Filtrar datos
  filterData: <T>(predicate: (value: T) => boolean) => filter<T>(predicate),
  
  // Debounce para búsquedas
  debounceSearch: (time: number = 300) => debounceTime(time),
  
  // Evitar valores duplicados
  distinctValues: <T>() => distinctUntilChanged<T>(),
  
  // Efectos secundarios
  sideEffect: <T>(effect: (value: T) => void) => tap<T>(effect),
  
  // Manejo de errores
  handleError: <T>(handler: (error: any) => Observable<T>) => catchError(handler)
};
```

---

## 📊 RESUMEN DEL CAPÍTULO

### ✅ CONCEPTOS APRENDIDOS:
1. **Observables**: Flujos de datos asíncronos
2. **Operadores RxJS**: map, filter, tap, debounceTime
3. **fromEvent**: Crear observables desde eventos DOM
4. **BehaviorSubject**: Observables con valor inicial
5. **Suscripciones**: Cómo manejar observables

### 🎯 HABILIDADES DESARROLLADAS:
- Crear observables personalizados
- Usar operadores RxJS
- Manejar eventos del DOM reactivamente
- Implementar patrones reactivos
- Escribir pruebas para observables

### 🚀 PRÓXIMOS PASOS:
- Implementar HTTP con observables
- Crear interceptores reactivos
- Trabajar con Subjects y BehaviorSubjects
- Implementar manejo de errores

---

## 🔍 CONSEJOS DE APRENDIZAJE

1. **Practica con Observables**: Crea observables para diferentes escenarios
2. **Usa Operadores**: Aprende a combinar operadores RxJS
3. **Maneja Suscripciones**: Siempre desuscríbete para evitar memory leaks
4. **Testea Observables**: Escribe pruebas para flujos reactivos

---

## 🎯 EJEMPLOS PRÁCTICOS ADICIONALES

### Ejemplo: Observable de Estado de Aplicación

```typescript
// app-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

export interface AppState {
  isLoading: boolean;
  user: any | null;
  theme: 'light' | 'dark';
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private state = new BehaviorSubject<AppState>({
    isLoading: false,
    user: null,
    theme: 'light',
    language: 'es'
  });

  getState(): Observable<AppState> {
    return this.state.asObservable();
  }

  getLoadingState(): Observable<boolean> {
    return this.state.pipe(map(state => state.isLoading));
  }

  getUserState(): Observable<any> {
    return this.state.pipe(map(state => state.user));
  }

  updateState(updates: Partial<AppState>): void {
    const currentState = this.state.value;
    this.state.next({ ...currentState, ...updates });
  }

  setLoading(loading: boolean): void {
    this.updateState({ isLoading: loading });
  }

  setUser(user: any): void {
    this.updateState({ user });
  }

  toggleTheme(): void {
    const currentTheme = this.state.value.theme;
    this.updateState({ theme: currentTheme === 'light' ? 'dark' : 'light' });
  }
}
```

**Resultado Esperado**: Servicio de estado global reactivo

---

*¡Excelente progreso! Has dominado los observables y RxJS en Angular.* 🎉 