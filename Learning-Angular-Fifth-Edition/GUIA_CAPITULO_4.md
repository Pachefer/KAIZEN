# 🚀 GUÍA EXCEPCIONAL - CAPÍTULO 4: DIRECTIVAS Y PIPES

## 📋 CONTENIDO DEL CAPÍTULO
Este capítulo introduce las directivas y pipes de Angular, que son herramientas fundamentales para manipular el DOM y transformar datos en las plantillas. Aprenderás a crear directivas personalizadas y pipes para reutilizar lógica en toda la aplicación.

---

## 🔍 ANÁLISIS DETALLADO DEL CÓDIGO

### 1. **app.component.ts - Componente Principal**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CopyrightDirective } from './copyright.directive';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ProductListComponent,
    CopyrightDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'World';
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`import { CopyrightDirective }`**: Importa la directiva personalizada creada en este capítulo
- **`imports: [CopyrightDirective]`**: Registra la directiva para que esté disponible en la plantilla
- **`ProductListComponent`**: Componente que maneja la lista de productos
- **`RouterOutlet`**: Componente para el enrutamiento de la aplicación

**🎯 PREDICCIÓN DE RESULTADOS:**
- La directiva CopyrightDirective estará disponible para usar en templates
- Se puede usar `[appCopyright]` en elementos HTML
- El componente ProductListComponent se renderizará normalmente

### 2. **copyright.directive.ts - Directiva de Copyright**

```typescript
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCopyright]'
})
export class CopyrightDirective {

  constructor(el: ElementRef) {
    const currentYear = new Date().getFullYear();
    const targetEl: HTMLElement = el.nativeElement;
    targetEl.classList.add('copyright');
    targetEl.textContent = `Copyright ©${currentYear} All Rights Reserved`;
  }  

}
```

**📝 COMENTARIOS DETALLADOS:**

- **`@Directive`**: Decorador que define una directiva personalizada
- **`selector: '[appCopyright]'`**: Selector CSS que identifica dónde usar la directiva
- **`ElementRef`**: Servicio que proporciona acceso al elemento DOM
- **`el.nativeElement`**: Acceso directo al elemento HTML nativo
- **`getFullYear()`**: Método que obtiene el año actual
- **`classList.add('copyright')`**: Agrega la clase CSS 'copyright' al elemento
- **`textContent`**: Establece el contenido de texto del elemento

**🎯 PREDICCIÓN DE RESULTADOS:**
- Cualquier elemento con `[appCopyright]` mostrará el copyright actualizado
- El año se actualizará automáticamente cada año
- Se aplicará la clase CSS 'copyright' al elemento
- El texto será "Copyright ©2024 All Rights Reserved" (o el año actual)

### 3. **sort.pipe.ts - Pipe de Ordenamiento**

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: Product[], args: keyof Product = 'title'): Product[] {
    if (value) {
      return value.sort((a: Product, b: Product) => {
        if (a[args] < b[args]) {
          return -1;
        } else if (b[args] < a[args]) {
          return 1;
        }
        return 0;
      });
    }
    return [];
  }

}
```

**📝 COMENTARIOS DETALLADOS:**

- **`@Pipe`**: Decorador que define un pipe personalizado
- **`name: 'sort'`**: Nombre del pipe para usar en templates
- **`PipeTransform`**: Interfaz que debe implementar todo pipe
- **`transform()`**: Método obligatorio que transforma los datos
- **`value: Product[]`**: Array de productos a ordenar
- **`args: keyof Product = 'title'`**: Propiedad por la cual ordenar (por defecto 'title')
- **`keyof Product`**: Tipo que representa las claves válidas de Product
- **`sort()`**: Método nativo de JavaScript para ordenar arrays
- **`-1, 1, 0`**: Valores de retorno para el ordenamiento ascendente

**🎯 PREDICCIÓN DE RESULTADOS:**
- Se puede usar `| sort` en templates para ordenar productos
- Se puede especificar la propiedad: `| sort:'price'`
- Por defecto ordenará por 'title' si no se especifica
- Retornará array vacío si no hay datos

### 4. **product.ts - Modelo de Producto**

```typescript
export interface Product {
  id: number;
  title: string;
  price: number;
}
```

**📝 COMENTARIOS DETALLADOS:**

- **`interface Product`**: Define la estructura de un producto
- **`id: number`**: Identificador único del producto
- **`title: string`**: Nombre o título del producto
- **`price: number`**: Precio del producto

**🎯 PREDICCIÓN DE RESULTADOS:**
- Proporciona tipado fuerte para objetos Product
- Se puede usar en componentes, servicios y pipes
- TypeScript verificará que los objetos cumplan esta estructura

---

## 🧪 PRUEBAS UNITARIAS

### Prueba para CopyrightDirective

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyrightDirective } from './copyright.directive';

describe('CopyrightDirective', () => {
  let directive: CopyrightDirective;
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    directive = new CopyrightDirective({ nativeElement: element });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add copyright class to element', () => {
    expect(element.classList.contains('copyright')).toBe(true);
  });

  it('should set copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    const expectedText = `Copyright ©${currentYear} All Rights Reserved`;
    expect(element.textContent).toBe(expectedText);
  });

  it('should update text content', () => {
    expect(element.textContent).toContain('Copyright ©');
    expect(element.textContent).toContain('All Rights Reserved');
  });
});
```

### Prueba para SortPipe

```typescript
import { SortPipe } from './sort.pipe';
import { Product } from './product';

describe('SortPipe', () => {
  let pipe: SortPipe;
  let testProducts: Product[];

  beforeEach(() => {
    pipe = new SortPipe();
    testProducts = [
      { id: 3, title: 'Zebra', price: 300 },
      { id: 1, title: 'Apple', price: 100 },
      { id: 2, title: 'Banana', price: 200 }
    ];
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array for null input', () => {
    expect(pipe.transform(null as any)).toEqual([]);
  });

  it('should return empty array for undefined input', () => {
    expect(pipe.transform(undefined as any)).toEqual([]);
  });

  it('should sort products by title by default', () => {
    const result = pipe.transform(testProducts);
    expect(result[0].title).toBe('Apple');
    expect(result[1].title).toBe('Banana');
    expect(result[2].title).toBe('Zebra');
  });

  it('should sort products by price when specified', () => {
    const result = pipe.transform(testProducts, 'price');
    expect(result[0].price).toBe(100);
    expect(result[1].price).toBe(200);
    expect(result[2].price).toBe(300);
  });

  it('should sort products by id when specified', () => {
    const result = pipe.transform(testProducts, 'id');
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
  });

  it('should handle empty array', () => {
    expect(pipe.transform([])).toEqual([]);
  });

  it('should handle single item array', () => {
    const singleProduct = [{ id: 1, title: 'Test', price: 100 }];
    expect(pipe.transform(singleProduct)).toEqual(singleProduct);
  });
});
```

### Prueba de Integración

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CopyrightDirective } from './copyright.directive';
import { SortPipe } from './sort.pipe';

describe('App Integration', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, CopyrightDirective, SortPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create app component with directives and pipes', () => {
    expect(component).toBeTruthy();
  });

  it('should have title property', () => {
    expect(component.title).toBe('World');
  });
});
```

---

## 🎯 EJERCICIOS PRÁCTICOS

### Ejercicio 1: Crear Directiva de Resaltado
**Objetivo**: Crear una directiva que resalte elementos al hacer hover

```typescript
// highlight.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string = 'yellow';
  @Input() defaultColor: string = 'transparent';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.defaultColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

**Resultado Esperado**: Elementos que cambian de color al pasar el mouse

### Ejercicio 2: Crear Pipe de Filtrado
**Objetivo**: Crear un pipe que filtre productos por precio

```typescript
// filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(products: Product[], minPrice: number, maxPrice?: number): Product[] {
    if (!products) return [];
    
    return products.filter(product => {
      if (maxPrice) {
        return product.price >= minPrice && product.price <= maxPrice;
      }
      return product.price >= minPrice;
    });
  }
}
```

**Resultado Esperado**: Pipe que filtra productos por rango de precios

### Ejercicio 3: Crear Directiva Estructural
**Objetivo**: Crear una directiva que muestre elementos solo si el usuario está autenticado

```typescript
// auth.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAuth]'
})
export class AuthDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appAuth(isAuthenticated: boolean) {
    if (isAuthenticated && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isAuthenticated && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

**Resultado Esperado**: Directiva que controla la visibilidad basada en autenticación

---

## 🔧 CONFIGURACIÓN ADICIONAL

### Estructura de Archivos Recomendada

```
src/app/
├── directives/
│   ├── copyright.directive.ts
│   ├── highlight.directive.ts
│   └── auth.directive.ts
├── pipes/
│   ├── sort.pipe.ts
│   └── filter.pipe.ts
├── models/
│   └── product.ts
└── components/
    └── product-list/
```

### Uso en Templates

```html
<!-- Uso de directiva -->
<div [appCopyright]></div>
<div [appHighlight]="'lightblue'">Hover me!</div>

<!-- Uso de directiva estructural -->
<div *appAuth="isAuthenticated">Contenido protegido</div>

<!-- Uso de pipes -->
<div *ngFor="let product of products | sort:'price' | filter:100:500">
  {{ product.title }} - {{ product.price | currency }}
</div>
```

---

## 📊 RESUMEN DEL CAPÍTULO

### ✅ CONCEPTOS APRENDIDOS:
1. **Directivas**: Cómo crear y usar directivas personalizadas
2. **Pipes**: Transformación de datos en templates
3. **ElementRef**: Acceso al DOM desde directivas
4. **HostListener**: Escuchar eventos del DOM
5. **PipeTransform**: Interfaz para crear pipes

### 🎯 HABILIDADES DESARROLLADAS:
- Crear directivas de atributo personalizadas
- Implementar pipes de transformación
- Manipular el DOM desde directivas
- Escuchar eventos del host
- Escribir pruebas para directivas y pipes

### 🚀 PRÓXIMOS PASOS:
- Crear directivas estructurales más complejas
- Implementar pipes con parámetros múltiples
- Trabajar con servicios en directivas
- Optimizar performance de pipes

---

## 🔍 CONSEJOS DE APRENDIZAJE

1. **Practica con Directivas**: Crea directivas para funcionalidades comunes
2. **Optimiza Pipes**: Usa pipes puros cuando sea posible
3. **Testea Todo**: Escribe pruebas para directivas y pipes
4. **Reutiliza**: Crea directivas y pipes reutilizables

---

## 🎯 EJEMPLOS PRÁCTICOS ADICIONALES

### Ejemplo: Sistema de Notificaciones

```typescript
// notification.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appNotification]'
})
export class NotificationDirective implements OnInit {
  @Input() appNotification: string = 'info';
  @Input() message: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = this.el.nativeElement;
    element.classList.add('notification', `notification-${this.appNotification}`);
    
    if (this.message) {
      element.textContent = this.message;
    }
  }
}
```

**Resultado Esperado**: Sistema de notificaciones con diferentes tipos y estilos

---

*¡Excelente progreso! Has dominado las directivas y pipes de Angular.* 🎉 