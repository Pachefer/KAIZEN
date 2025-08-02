# 🅰️ Angular - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Angular](#fundamentos-de-angular)
2. [Componentes y Directivas](#componentes-y-directivas)
3. [Servicios e Inyección de Dependencias](#servicios-e-inyección-de-dependencias)
4. [Routing y Navegación](#routing-y-navegación)
5. [Formularios Reactivos](#formularios-reactivos)
6. [Testing](#testing)
7. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Angular

### Estructura de un Componente

```typescript
// user.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  // Selector CSS para usar el componente en templates
  selector: 'app-user',
  
  // Template HTML del componente
  templateUrl: './user.component.html',
  
  // Estilos CSS específicos del componente
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  // Propiedades públicas accesibles desde el template
  public users: User[] = [];
  public loading: boolean = false;
  public error: string | null = null;
  
  // Propiedades privadas solo para lógica interna
  private subscription: any;
  
  // Constructor con inyección de dependencias
  constructor(
    private userService: UserService, // Servicio inyectado
    private router: Router, // Router inyectado
    private activatedRoute: ActivatedRoute // Route inyectado
  ) {
    // Inicialización básica del componente
    console.log('UserComponent constructor ejecutado');
  }
  
  // Lifecycle hook: se ejecuta después de la inicialización
  ngOnInit(): void {
    console.log('UserComponent ngOnInit ejecutado');
    
    // Suscribirse a cambios en los parámetros de la ruta
    this.subscription = this.activatedRoute.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(userId);
      } else {
        this.loadUsers();
      }
    });
  }
  
  // Lifecycle hook: se ejecuta antes de destruir el componente
  ngOnDestroy(): void {
    console.log('UserComponent ngOnDestroy ejecutado');
    
    // Limpiar suscripciones para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  // Método público para cargar usuarios
  public loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    // Llamada al servicio para obtener usuarios
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar usuarios: ' + error.message;
        this.loading = false;
      }
    });
  }
  
  // Método público para cargar un usuario específico
  public loadUser(userId: string): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.users = [user]; // Convertir a array para mantener consistencia
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar usuario: ' + error.message;
        this.loading = false;
      }
    });
  }
  
  // Método para navegar a la página de edición
  public editUser(userId: string): void {
    this.router.navigate(['/users', userId, 'edit']);
  }
  
  // Método para eliminar usuario
  public deleteUser(userId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          // Remover usuario de la lista local
          this.users = this.users.filter(user => user.id !== userId);
          alert('Usuario eliminado exitosamente');
        },
        error: (error: any) => {
          this.error = 'Error al eliminar usuario: ' + error.message;
        }
      });
    }
  }
}
```

### Template HTML del Componente

```html
<!-- user.component.html -->
<div class="user-container">
  <!-- Header del componente -->
  <div class="user-header">
    <h2>Gestión de Usuarios</h2>
    <button 
      class="btn btn-primary" 
      (click)="router.navigate(['/users/new'])"
      [disabled]="loading">
      <i class="fas fa-plus"></i> Nuevo Usuario
    </button>
  </div>
  
  <!-- Indicador de carga -->
  <div *ngIf="loading" class="loading-spinner">
    <div class="spinner"></div>
    <p>Cargando usuarios...</p>
  </div>
  
  <!-- Mensaje de error -->
  <div *ngIf="error" class="error-message">
    <i class="fas fa-exclamation-triangle"></i>
    <span>{{ error }}</span>
    <button (click)="loadUsers()" class="btn btn-retry">
      Reintentar
    </button>
  </div>
  
  <!-- Lista de usuarios -->
  <div *ngIf="!loading && !error && users.length > 0" class="user-list">
    <div 
      *ngFor="let user of users; trackBy: trackByUserId" 
      class="user-card"
      [class.selected]="user.id === selectedUserId">
      
      <!-- Información del usuario -->
      <div class="user-info">
        <img 
          [src]="user.avatar || 'assets/default-avatar.png'" 
          [alt]="user.name"
          class="user-avatar"
          (error)="onImageError($event)">
        
        <div class="user-details">
          <h3>{{ user.name }}</h3>
          <p class="user-email">
            <i class="fas fa-envelope"></i>
            {{ user.email }}
          </p>
          <p class="user-role">
            <i class="fas fa-user-tag"></i>
            {{ user.role | titlecase }}
          </p>
          <p class="user-status">
            <span 
              class="status-badge"
              [class.active]="user.isActive"
              [class.inactive]="!user.isActive">
              {{ user.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
        </div>
      </div>
      
      <!-- Acciones del usuario -->
      <div class="user-actions">
        <button 
          class="btn btn-sm btn-outline-primary"
          (click)="editUser(user.id)"
          [disabled]="loading">
          <i class="fas fa-edit"></i> Editar
        </button>
        
        <button 
          class="btn btn-sm btn-outline-danger"
          (click)="deleteUser(user.id)"
          [disabled]="loading">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mensaje cuando no hay usuarios -->
  <div *ngIf="!loading && !error && users.length === 0" class="empty-state">
    <i class="fas fa-users"></i>
    <h3>No hay usuarios</h3>
    <p>Comienza agregando tu primer usuario</p>
    <button 
      class="btn btn-primary"
      (click)="router.navigate(['/users/new'])">
      Crear Usuario
    </button>
  </div>
</div>
```

### Estilos CSS del Componente

```css
/* user.component.css */
.user-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.user-header h2 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  color: #721c24;
  margin-bottom: 20px;
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.user-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.user-card.selected {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.user-info {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-details h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.2em;
}

.user-details p {
  margin: 5px 0;
  color: #6c757d;
  font-size: 0.9em;
}

.user-details i {
  width: 16px;
  margin-right: 8px;
  color: #95a5a6;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.user-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 4em;
  margin-bottom: 20px;
  color: #dee2e6;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #495057;
}

.empty-state p {
  margin: 0 0 20px 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-list {
    grid-template-columns: 1fr;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .user-actions {
    justify-content: center;
  }
}
```

---

## 🎨 Componentes y Directivas

### Directiva Personalizada

```typescript
// highlight.directive.ts
import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appHighlight]' // Selector para usar la directiva
})
export class HighlightDirective implements OnInit, OnDestroy {
  // Input property para recibir datos del componente padre
  @Input() appHighlight: string = '';
  
  // Input property con alias
  @Input('appHighlightColor') color: string = 'yellow';
  
  // Input property con setter para lógica adicional
  @Input() set appHighlightDelay(delay: number) {
    this._delay = delay;
    this.updateHighlight();
  }
  get appHighlightDelay(): number {
    return this._delay;
  }
  
  // Propiedades privadas
  private _delay: number = 0;
  private originalBackground: string = '';
  private timeoutId: any;
  
  // Constructor con ElementRef para acceder al elemento DOM
  constructor(private el: ElementRef) {
    console.log('HighlightDirective constructor ejecutado');
  }
  
  // Lifecycle hook
  ngOnInit(): void {
    console.log('HighlightDirective ngOnInit ejecutado');
    
    // Guardar el color de fondo original
    this.originalBackground = this.el.nativeElement.style.backgroundColor;
    
    // Aplicar highlight inicial si hay texto
    if (this.appHighlight) {
      this.updateHighlight();
    }
  }
  
  // Lifecycle hook
  ngOnDestroy(): void {
    console.log('HighlightDirective ngOnDestroy ejecutado');
    
    // Limpiar timeout si existe
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Restaurar color de fondo original
    this.el.nativeElement.style.backgroundColor = this.originalBackground;
  }
  
  // Método privado para actualizar el highlight
  private updateHighlight(): void {
    // Limpiar timeout anterior si existe
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Aplicar highlight después del delay
    this.timeoutId = setTimeout(() => {
      const element = this.el.nativeElement;
      const text = element.textContent || element.innerText || '';
      
      if (text.toLowerCase().includes(this.appHighlight.toLowerCase())) {
        // Aplicar color de highlight
        element.style.backgroundColor = this.color;
        element.style.transition = 'background-color 0.3s ease';
        
        // Agregar clase CSS para estilos adicionales
        element.classList.add('highlighted');
        
        // Remover highlight después de 2 segundos
        setTimeout(() => {
          element.style.backgroundColor = this.originalBackground;
          element.classList.remove('highlighted');
        }, 2000);
      }
    }, this._delay);
  }
}
```

### Componente con Input/Output

```typescript
// user-card.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnChanges {
  // Input properties para recibir datos del componente padre
  @Input() user: User | null = null;
  @Input() showActions: boolean = true;
  @Input() highlightText: string = '';
  
  // Output properties para emitir eventos al componente padre
  @Output() editUser = new EventEmitter<string>();
  @Output() deleteUser = new EventEmitter<string>();
  @Output() userSelected = new EventEmitter<User>();
  
  // Propiedades locales del componente
  public isExpanded: boolean = false;
  public isHovered: boolean = false;
  
  // Lifecycle hook para detectar cambios en inputs
  ngOnChanges(changes: SimpleChanges): void {
    console.log('UserCardComponent ngOnChanges ejecutado', changes);
    
    // Reaccionar a cambios en el usuario
    if (changes['user'] && changes['user'].currentValue) {
      this.resetCardState();
    }
    
    // Reaccionar a cambios en el texto de highlight
    if (changes['highlightText']) {
      this.handleHighlightChange(changes['highlightText']);
    }
  }
  
  // Método para manejar clic en la tarjeta
  public onCardClick(): void {
    if (this.user) {
      this.userSelected.emit(this.user);
    }
  }
  
  // Método para manejar clic en editar
  public onEditClick(event: Event): void {
    event.stopPropagation(); // Prevenir propagación del evento
    
    if (this.user) {
      this.editUser.emit(this.user.id);
    }
  }
  
  // Método para manejar clic en eliminar
  public onDeleteClick(event: Event): void {
    event.stopPropagation(); // Prevenir propagación del evento
    
    if (this.user && confirm('¿Estás seguro de eliminar este usuario?')) {
      this.deleteUser.emit(this.user.id);
    }
  }
  
  // Método para expandir/contraer la tarjeta
  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  // Método para manejar hover
  public onMouseEnter(): void {
    this.isHovered = true;
  }
  
  public onMouseLeave(): void {
    this.isHovered = false;
  }
  
  // Métodos privados
  private resetCardState(): void {
    this.isExpanded = false;
    this.isHovered = false;
  }
  
  private handleHighlightChange(change: SimpleChanges): void {
    // Lógica para manejar cambios en el texto de highlight
    console.log('Texto de highlight cambiado:', change.currentValue);
  }
  
  // Getter para calcular clases CSS dinámicamente
  get cardClasses(): string {
    const classes = ['user-card'];
    
    if (this.isExpanded) classes.push('expanded');
    if (this.isHovered) classes.push('hovered');
    if (this.user?.isActive === false) classes.push('inactive');
    
    return classes.join(' ');
  }
}
```

### Template del Componente con Directivas

```html
<!-- user-card.component.html -->
<div 
  class="user-card"
  [class]="cardClasses"
  (click)="onCardClick()"
  (mouseenter)="onMouseEnter()"
  (mouseleave)="onMouseLeave()"
  [appHighlight]="highlightText"
  appHighlightColor="lightblue"
  [appHighlightDelay]="500">
  
  <!-- Header de la tarjeta -->
  <div class="card-header">
    <div class="user-avatar-container">
      <img 
        [src]="user?.avatar || 'assets/default-avatar.png'" 
        [alt]="user?.name"
        class="user-avatar"
        (error)="onImageError($event)">
      
      <!-- Indicador de estado -->
      <div 
        class="status-indicator"
        [class.active]="user?.isActive"
        [class.inactive]="!user?.isActive">
      </div>
    </div>
    
    <div class="user-info">
      <h3 class="user-name">{{ user?.name }}</h3>
      <p class="user-email">{{ user?.email }}</p>
      <span class="user-role">{{ user?.role | titlecase }}</span>
    </div>
    
    <!-- Botón de expandir -->
    <button 
      class="expand-btn"
      (click)="toggleExpanded(); $event.stopPropagation()"
      [class.expanded]="isExpanded">
      <i class="fas fa-chevron-down"></i>
    </button>
  </div>
  
  <!-- Contenido expandible -->
  <div 
    class="card-content"
    [class.expanded]="isExpanded"
    [@expandAnimation]="isExpanded ? 'expanded' : 'collapsed'">
    
    <!-- Información adicional -->
    <div class="additional-info">
      <div class="info-item">
        <i class="fas fa-phone"></i>
        <span>{{ user?.phone || 'No disponible' }}</span>
      </div>
      
      <div class="info-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ user?.address || 'No disponible' }}</span>
      </div>
      
      <div class="info-item">
        <i class="fas fa-calendar"></i>
        <span>Registrado: {{ user?.createdAt | date:'short' }}</span>
      </div>
    </div>
    
    <!-- Acciones -->
    <div *ngIf="showActions" class="card-actions">
      <button 
        class="btn btn-sm btn-outline-primary"
        (click)="onEditClick($event)"
        [disabled]="!user">
        <i class="fas fa-edit"></i> Editar
      </button>
      
      <button 
        class="btn btn-sm btn-outline-danger"
        (click)="onDeleteClick($event)"
        [disabled]="!user">
        <i class="fas fa-trash"></i> Eliminar
      </button>
    </div>
  </div>
  
  <!-- Overlay de hover -->
  <div 
    class="hover-overlay"
    [class.visible]="isHovered">
    <div class="overlay-content">
      <p>Haz clic para ver detalles</p>
    </div>
  </div>
</div>
```

---

## 🔧 Servicios e Inyección de Dependencias

### Servicio de Usuarios

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, retry, shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root' // Singleton service disponible en toda la aplicación
})
export class UserService {
  // URL base de la API
  private readonly API_URL = 'https://api.example.com/users';
  
  // BehaviorSubject para cache local de usuarios
  private usersCache = new BehaviorSubject<User[]>([]);
  
  // Observable público para componentes
  public users$ = this.usersCache.asObservable();
  
  // Headers HTTP por defecto
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  
  // Constructor con inyección de HttpClient
  constructor(private http: HttpClient) {
    console.log('UserService constructor ejecutado');
  }
  
  // Método para obtener todos los usuarios
  getUsers(): Observable<User[]> {
    console.log('UserService: Obteniendo usuarios');
    
    // Retornar cache si está disponible
    const cachedUsers = this.usersCache.value;
    if (cachedUsers.length > 0) {
      console.log('UserService: Retornando usuarios desde cache');
      return of(cachedUsers);
    }
    
    // Realizar petición HTTP
    return this.http.get<User[]>(this.API_URL, {
      headers: this.defaultHeaders
    }).pipe(
      // Reintentar en caso de error
      retry(3),
      
      // Transformar respuesta si es necesario
      map((response: any) => {
        // Asumiendo que la API devuelve { data: User[] }
        return response.data || response;
      }),
      
      // Actualizar cache
      tap((users: User[]) => {
        console.log('UserService: Actualizando cache con', users.length, 'usuarios');
        this.usersCache.next(users);
      }),
      
      // Compartir la respuesta entre múltiples suscriptores
      shareReplay(1),
      
      // Manejar errores
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para obtener un usuario por ID
  getUserById(id: string): Observable<User> {
    console.log('UserService: Obteniendo usuario con ID:', id);
    
    const url = `${this.API_URL}/${id}`;
    
    return this.http.get<User>(url, {
      headers: this.defaultHeaders
    }).pipe(
      retry(2),
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para crear un nuevo usuario
  createUser(user: Partial<User>): Observable<User> {
    console.log('UserService: Creando usuario:', user);
    
    return this.http.post<User>(this.API_URL, user, {
      headers: this.defaultHeaders
    }).pipe(
      tap((newUser: User) => {
        // Agregar nuevo usuario al cache
        const currentUsers = this.usersCache.value;
        this.usersCache.next([...currentUsers, newUser]);
        console.log('UserService: Usuario creado y agregado al cache');
      }),
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para actualizar un usuario
  updateUser(id: string, updates: Partial<User>): Observable<User> {
    console.log('UserService: Actualizando usuario:', id, updates);
    
    const url = `${this.API_URL}/${id}`;
    
    return this.http.put<User>(url, updates, {
      headers: this.defaultHeaders
    }).pipe(
      tap((updatedUser: User) => {
        // Actualizar usuario en cache
        const currentUsers = this.usersCache.value;
        const updatedUsers = currentUsers.map(user => 
          user.id === id ? updatedUser : user
        );
        this.usersCache.next(updatedUsers);
        console.log('UserService: Usuario actualizado en cache');
      }),
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para eliminar un usuario
  deleteUser(id: string): Observable<void> {
    console.log('UserService: Eliminando usuario:', id);
    
    const url = `${this.API_URL}/${id}`;
    
    return this.http.delete<void>(url, {
      headers: this.defaultHeaders
    }).pipe(
      tap(() => {
        // Remover usuario del cache
        const currentUsers = this.usersCache.value;
        const filteredUsers = currentUsers.filter(user => user.id !== id);
        this.usersCache.next(filteredUsers);
        console.log('UserService: Usuario eliminado del cache');
      }),
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para buscar usuarios
  searchUsers(query: string): Observable<User[]> {
    console.log('UserService: Buscando usuarios con query:', query);
    
    const params = new HttpParams().set('q', query);
    
    return this.http.get<User[]>(this.API_URL, {
      headers: this.defaultHeaders,
      params: params
    }).pipe(
      map((response: any) => response.data || response),
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para obtener usuarios con paginación
  getUsersPaginated(page: number = 1, limit: number = 10): Observable<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    console.log('UserService: Obteniendo usuarios paginados:', { page, limit });
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<any>(this.API_URL, {
      headers: this.defaultHeaders,
      params: params
    }).pipe(
      map((response: any) => ({
        users: response.data || response.users || [],
        total: response.total || 0,
        page: response.page || page,
        totalPages: response.totalPages || Math.ceil((response.total || 0) / limit)
      })),
      catchError(this.handleError.bind(this))
    );
  }
  
  // Método para limpiar cache
  clearCache(): void {
    console.log('UserService: Limpiando cache');
    this.usersCache.next([]);
  }
  
  // Método para refrescar datos
  refreshUsers(): Observable<User[]> {
    console.log('UserService: Refrescando usuarios');
    this.clearCache();
    return this.getUsers();
  }
  
  // Método privado para manejar errores HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('UserService: Error en petición HTTP:', error);
    
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Usuario no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    // Emitir error personalizado
    return throwError(() => new Error(errorMessage));
  }
}
```

### Interceptor HTTP

```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Flag para evitar múltiples refresh tokens simultáneos
  private isRefreshing = false;
  
  // Subject para manejar refresh token
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor(private authService: AuthService) {
    console.log('AuthInterceptor constructor ejecutado');
  }
  
  // Método principal del interceptor
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Interceptando petición:', request.url);
    
    // Agregar token de autorización si está disponible
    const token = this.authService.getToken();
    if (token) {
      request = this.addToken(request, token);
    }
    
    // Procesar la petición
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('AuthInterceptor: Error en petición:', error.status);
        
        // Si el error es 401 (Unauthorized), intentar refresh token
        if (error.status === 401 && !request.url.includes('auth/refresh')) {
          return this.handle401Error(request, next);
        }
        
        // Para otros errores, simplemente propagar
        return throwError(() => error);
      })
    );
  }
  
  // Método privado para agregar token a la petición
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    console.log('AuthInterceptor: Agregando token a petición');
    
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Método privado para manejar error 401
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Manejando error 401');
    
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      
      // Intentar refresh token
      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          
          // Reintentar la petición original con el nuevo token
          return next.handle(this.addToken(request, token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          
          // Si el refresh token falla, logout
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // Si ya se está refrescando, esperar
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token)))
      );
    }
  }
}
```

---

## 🧪 Testing

### Testing de Componentes

```typescript
// user.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserComponent } from './user.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;
  let httpMock: HttpTestingController;
  
  // Datos de prueba
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      role: 'user',
      isActive: false,
      createdAt: new Date()
    }
  ];
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [UserService]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    // Verificar que no hay peticiones HTTP pendientes
    httpMock.verify();
  });
  
  // Test de creación del componente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // Test de inicialización
  it('should initialize with empty users array', () => {
    expect(component.users).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });
  
  // Test de carga de usuarios exitosa
  it('should load users successfully', fakeAsync(() => {
    // Configurar spy en el servicio
    spyOn(userService, 'getUsers').and.returnValue(
      of(mockUsers)
    );
    
    // Ejecutar ngOnInit
    component.ngOnInit();
    tick();
    
    // Verificar que los usuarios se cargaron
    expect(component.users).toEqual(mockUsers);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
    expect(userService.getUsers).toHaveBeenCalled();
  }));
  
  // Test de error al cargar usuarios
  it('should handle error when loading users fails', fakeAsync(() => {
    const errorMessage = 'Error de red';
    
    // Configurar spy para simular error
    spyOn(userService, 'getUsers').and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    
    // Ejecutar carga de usuarios
    component.loadUsers();
    tick();
    
    // Verificar manejo del error
    expect(component.error).toContain(errorMessage);
    expect(component.loading).toBe(false);
    expect(component.users).toEqual([]);
  }));
  
  // Test de eliminación de usuario
  it('should delete user successfully', fakeAsync(() => {
    // Configurar usuarios iniciales
    component.users = [...mockUsers];
    
    // Configurar spy para simular eliminación exitosa
    spyOn(userService, 'deleteUser').and.returnValue(
      of(void 0)
    );
    
    // Configurar confirm para simular confirmación del usuario
    spyOn(window, 'confirm').and.returnValue(true);
    
    // Ejecutar eliminación
    component.deleteUser('1');
    tick();
    
    // Verificar que el usuario fue eliminado
    expect(component.users.length).toBe(1);
    expect(component.users[0].id).toBe('2');
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  }));
  
  // Test de navegación a edición
  it('should navigate to edit user page', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    
    component.editUser('1');
    
    expect(router.navigate).toHaveBeenCalledWith(['/users', '1', 'edit']);
  });
  
  // Test de parámetros de ruta
  it('should load specific user when route has userId parameter', fakeAsync(() => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    
    // Simular parámetros de ruta
    activatedRoute.params = of({ id: '1' });
    
    // Configurar spy para getUserById
    spyOn(userService, 'getUserById').and.returnValue(
      of(mockUsers[0])
    );
    
    // Ejecutar ngOnInit
    component.ngOnInit();
    tick();
    
    // Verificar que se cargó el usuario específico
    expect(userService.getUserById).toHaveBeenCalledWith('1');
    expect(component.users).toEqual([mockUsers[0]]);
  }));
  
  // Test de limpieza de suscripciones
  it('should unsubscribe on destroy', () => {
    // Crear spy en subscription
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subscription'] = subscription;
    
    // Ejecutar ngOnDestroy
    component.ngOnDestroy();
    
    // Verificar que se llamó unsubscribe
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});
```

### Testing de Servicios

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    }
  ];
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should get users successfully', (done) => {
    service.getUsers().subscribe({
      next: (users) => {
        expect(users).toEqual(mockUsers);
        done();
      },
      error: done.fail
    });
    
    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should handle error when getting users fails', (done) => {
    service.getUsers().subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error.message).toContain('Error');
        done();
      }
    });
    
    const req = httpMock.expectOne('https://api.example.com/users');
    req.error(new ErrorEvent('Network error'));
  });
  
  it('should create user successfully', (done) => {
    const newUser: Partial<User> = {
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com'
    };
    
    service.createUser(newUser).subscribe({
      next: (user) => {
        expect(user.name).toBe('Nuevo Usuario');
        done();
      },
      error: done.fail
    });
    
    const req = httpMock.expectOne('https://api.example.com/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ ...newUser, id: '3' });
  });
  
  it('should update cache when user is created', (done) => {
    const newUser: Partial<User> = {
      name: 'Nuevo Usuario',
      email: 'nuevo@example.com'
    };
    
    // Suscribirse a cambios en el cache
    service.users$.subscribe(users => {
      if (users.length > 0) {
        expect(users[users.length - 1].name).toBe('Nuevo Usuario');
        done();
      }
    });
    
    service.createUser(newUser).subscribe();
    
    const req = httpMock.expectOne('https://api.example.com/users');
    req.flush({ ...newUser, id: '3' });
  });
});
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Angular y cuáles son sus características principales?**
   - Framework completo para aplicaciones web
   - TypeScript, Componentes, Servicios, Inyección de Dependencias

2. **¿Cuál es la diferencia entre AngularJS y Angular?**
   - AngularJS: Versión 1.x, JavaScript, $scope
   - Angular: Versión 2+, TypeScript, Componentes

3. **¿Qué son los decoradores en Angular?**
   - @Component, @Injectable, @Input, @Output, etc.
   - Metadata para configurar clases

### Preguntas Intermedias

4. **¿Cómo funciona la inyección de dependencias en Angular?**
   - Provider system, Token, Factory, Value providers

5. **¿Qué es el ciclo de vida de un componente?**
   - ngOnInit, ngOnDestroy, ngOnChanges, etc.

6. **¿Cómo optimizas el rendimiento en Angular?**
   - OnPush strategy, trackBy, lazy loading, pure pipes

### Preguntas Avanzadas

7. **¿Cómo implementarías un sistema de autenticación?**
   - Guards, Interceptors, JWT tokens

8. **¿Qué es el patrón de observables en Angular?**
   - RxJS, Subjects, Operators, Error handling

9. **¿Cómo manejarías el estado global?**
   - NgRx, Services, BehaviorSubject

---

## 📚 Recursos Adicionales

- [Documentación oficial de Angular](https://angular.io/docs)
- [Angular Testing](https://angular.io/guide/testing)
- [RxJS](https://rxjs.dev/)
- [Angular Material](https://material.angular.io/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Angular! 🚀** 