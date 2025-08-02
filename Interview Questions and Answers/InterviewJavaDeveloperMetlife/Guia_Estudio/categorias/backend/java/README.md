# ☕ Java - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Java](#fundamentos-de-java)
2. [Spring Boot](#spring-boot)
3. [Testing con JUnit](#testing-con-junit)
4. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Java

### Clases y Objetos

```java
// User.java - Clase modelo con anotaciones JPA
package com.example.demo.model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Entity // Anotación JPA para mapear a tabla de base de datos
@Table(name = "users") // Nombre de la tabla en la base de datos
public class User {
    
    @Id // Marca este campo como clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio") // Validación Bean Validation
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(name = "name", nullable = false, length = 50) // Configuración de columna
    private String name;
    
    @Email(message = "El email debe tener un formato válido") // Validación de email
    @Column(name = "email", unique = true, nullable = false) // Email único y obligatorio
    private String email;
    
    @Enumerated(EnumType.STRING) // Guardar enum como string en BD
    @Column(name = "role")
    private UserRole role;
    
    @Column(name = "is_active")
    private boolean isActive = true; // Valor por defecto
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructor por defecto (requerido por JPA)
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor con parámetros
    public User(String name, String email, UserRole role) {
        this(); // Llamar al constructor por defecto
        this.name = name;
        this.email = email;
        this.role = role;
    }
    
    // Método para actualizar timestamp
    @PreUpdate // Se ejecuta antes de actualizar en BD
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(email, user.email);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
    
    // Método toString
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                '}';
    }
}

// UserRole.java - Enum para roles de usuario
package com.example.demo.model;

public enum UserRole {
    ADMIN("Administrador"),
    USER("Usuario"),
    MODERATOR("Moderador");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
```

### Repositorio JPA

```java
// UserRepository.java - Interfaz de repositorio
package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // Marca esta interfaz como componente de repositorio
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Método de búsqueda por email (Spring Data JPA genera la consulta automáticamente)
    Optional<User> findByEmail(String email);
    
    // Método de búsqueda por nombre (ignorando mayúsculas/minúsculas)
    List<User> findByNameIgnoreCaseContaining(String name);
    
    // Método de búsqueda por rol
    List<User> findByRole(UserRole role);
    
    // Método de búsqueda por estado activo
    List<User> findByIsActiveTrue();
    
    // Método de búsqueda por email y estado activo
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    // Consulta personalizada con JPQL
    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate AND u.role = :role")
    List<User> findUsersCreatedAfterWithRole(@Param("startDate") LocalDateTime startDate, 
                                           @Param("role") UserRole role);
    
    // Consulta nativa SQL
    @Query(value = "SELECT * FROM users WHERE name LIKE %:name% AND is_active = true", 
           nativeQuery = true)
    List<User> findActiveUsersByName(@Param("name") String name);
    
    // Método para contar usuarios por rol
    long countByRole(UserRole role);
    
    // Método para verificar si existe un email
    boolean existsByEmail(String email);
    
    // Método para eliminar por email
    void deleteByEmail(String email);
}
```

---

## 🚀 Spring Boot

### Controlador REST

```java
// UserController.java - Controlador REST
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController // Marca como controlador REST
@RequestMapping("/api/users") // Ruta base para todos los endpoints
@CrossOrigin(origins = "*") // Permitir CORS
public class UserController {
    
    private final UserService userService; // Inyección de dependencia
    
    // Constructor con inyección de dependencia
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // GET /api/users - Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users); // Retorna 200 OK con la lista
    }
    
    // GET /api/users/{id} - Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user)) // Si existe, retorna 200 OK
                .orElse(ResponseEntity.notFound().build()); // Si no existe, retorna 404
    }
    
    // POST /api/users - Crear nuevo usuario
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser); // 201 Created
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        }
    }
    
    // PUT /api/users/{id} - Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, 
                                         @Valid @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
    
    // DELETE /api/users/{id} - Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
    
    // GET /api/users/search?name={name} - Buscar usuarios por nombre
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }
    
    // GET /api/users/role/{role} - Obtener usuarios por rol
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable UserRole role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
}
```

### Servicio de Negocio

```java
// UserService.java - Lógica de negocio
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Marca como servicio de Spring
@Transactional // Todas las operaciones son transaccionales
public class UserService {
    
    private final UserRepository userRepository; // Inyección del repositorio
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Método heredado de JpaRepository
    }
    
    // Obtener usuario por ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    // Crear nuevo usuario
    public User createUser(User user) {
        // Validar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("El email ya existe: " + user.getEmail());
        }
        
        // Validar que el nombre no esté vacío
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        
        // Establecer valores por defecto
        if (user.getRole() == null) {
            user.setRole(UserRole.USER); // Rol por defecto
        }
        
        user.setActive(true); // Usuario activo por defecto
        
        return userRepository.save(user); // Guardar en base de datos
    }
    
    // Actualizar usuario
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        
        // Actualizar campos
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.isActive());
        
        return userRepository.save(user); // Guardar cambios
    }
    
    // Eliminar usuario
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Buscar usuarios por nombre
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameIgnoreCaseContaining(name);
    }
    
    // Obtener usuarios por rol
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    // Obtener usuarios activos
    public List<User> getActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }
    
    // Activar/desactivar usuario
    public User toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        
        user.setActive(!user.isActive()); // Cambiar estado
        return userRepository.save(user);
    }
}
```

---

## 🧪 Testing con JUnit

### Testing de Servicios

```java
// UserServiceTest.java - Pruebas unitarias del servicio
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Configurar Mockito
class UserServiceTest {
    
    @Mock // Crear mock del repositorio
    private UserRepository userRepository;
    
    @InjectMocks // Inyectar el mock en el servicio
    private UserService userService;
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach // Se ejecuta antes de cada test
    void setUp() {
        // Crear usuario de prueba
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Juan Pérez");
        testUser.setEmail("juan@example.com");
        testUser.setRole(UserRole.USER);
        testUser.setActive(true);
    }
    
    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Arrange - Preparar datos de prueba
        List<User> expectedUsers = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(expectedUsers);
        
        // Act - Ejecutar método a probar
        List<User> actualUsers = userService.getAllUsers();
        
        // Assert - Verificar resultado
        assertEquals(expectedUsers, actualUsers);
        verify(userRepository).findAll(); // Verificar que se llamó el método
    }
    
    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        // Act
        Optional<User> result = userService.getUserById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository).findById(1L);
    }
    
    @Test
    void getUserById_WhenUserNotExists_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act
        Optional<User> result = userService.getUserById(999L);
        
        // Assert
        assertFalse(result.isPresent());
        verify(userRepository).findById(999L);
    }
    
    @Test
    void createUser_WithValidData_ShouldCreateUser() {
        // Arrange
        User newUser = new User("María García", "maria@example.com", UserRole.USER);
        when(userRepository.existsByEmail("maria@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        
        // Act
        User createdUser = userService.createUser(newUser);
        
        // Assert
        assertNotNull(createdUser);
        assertEquals("María García", createdUser.getName());
        assertEquals("maria@example.com", createdUser.getEmail());
        assertTrue(createdUser.isActive());
        verify(userRepository).existsByEmail("maria@example.com");
        verify(userRepository).save(newUser);
    }
    
    @Test
    void createUser_WithExistingEmail_ShouldThrowException() {
        // Arrange
        User newUser = new User("María García", "juan@example.com", UserRole.USER);
        when(userRepository.existsByEmail("juan@example.com")).thenReturn(true);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.createUser(newUser)
        );
        
        assertEquals("El email ya existe: juan@example.com", exception.getMessage());
        verify(userRepository).existsByEmail("juan@example.com");
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void createUser_WithEmptyName_ShouldThrowException() {
        // Arrange
        User newUser = new User("", "maria@example.com", UserRole.USER);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.createUser(newUser)
        );
        
        assertEquals("El nombre es obligatorio", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void updateUser_WhenUserExists_ShouldUpdateUser() {
        // Arrange
        User updateData = new User("Juan Pérez Actualizado", "juan.nuevo@example.com", UserRole.ADMIN);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        User updatedUser = userService.updateUser(1L, updateData);
        
        // Assert
        assertNotNull(updatedUser);
        verify(userRepository).findById(1L);
        verify(userRepository).save(testUser);
    }
    
    @Test
    void updateUser_WhenUserNotExists_ShouldThrowException() {
        // Arrange
        User updateData = new User("Juan Pérez Actualizado", "juan.nuevo@example.com", UserRole.ADMIN);
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUser(999L, updateData)
        );
        
        assertEquals("Usuario no encontrado con ID: 999", exception.getMessage());
        verify(userRepository).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void deleteUser_WhenUserExists_ShouldReturnTrue() {
        // Arrange
        when(userRepository.existsById(1L)).thenReturn(true);
        
        // Act
        boolean result = userService.deleteUser(1L);
        
        // Assert
        assertTrue(result);
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }
    
    @Test
    void deleteUser_WhenUserNotExists_ShouldReturnFalse() {
        // Arrange
        when(userRepository.existsById(999L)).thenReturn(false);
        
        // Act
        boolean result = userService.deleteUser(999L);
        
        // Assert
        assertFalse(result);
        verify(userRepository).existsById(999L);
        verify(userRepository, never()).deleteById(any());
    }
}
```

### Testing de Controladores

```java
// UserControllerTest.java - Pruebas de controlador
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class) // Test de controlador web
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc; // Para simular peticiones HTTP
    
    @MockBean
    private UserService userService; // Mock del servicio
    
    @Autowired
    private ObjectMapper objectMapper; // Para convertir objetos a JSON
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Juan Pérez");
        testUser.setEmail("juan@example.com");
        testUser.setRole(UserRole.USER);
        testUser.setActive(true);
    }
    
    @Test
    void getAllUsers_ShouldReturnUsers() throws Exception {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userService.getAllUsers()).thenReturn(users);
        
        // Act & Assert
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Juan Pérez"))
                .andExpect(jsonPath("$[0].email").value("juan@example.com"));
        
        verify(userService).getAllUsers();
    }
    
    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));
        
        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Juan Pérez"));
        
        verify(userService).getUserById(1L);
    }
    
    @Test
    void getUserById_WhenUserNotExists_ShouldReturn404() throws Exception {
        // Arrange
        when(userService.getUserById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());
        
        verify(userService).getUserById(999L);
    }
    
    @Test
    void createUser_WithValidData_ShouldReturn201() throws Exception {
        // Arrange
        User newUser = new User("María García", "maria@example.com", UserRole.USER);
        when(userService.createUser(any(User.class))).thenReturn(newUser);
        
        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("María García"))
                .andExpect(jsonPath("$.email").value("maria@example.com"));
        
        verify(userService).createUser(any(User.class));
    }
    
    @Test
    void createUser_WithInvalidData_ShouldReturn400() throws Exception {
        // Arrange
        User invalidUser = new User("", "invalid-email", UserRole.USER);
        when(userService.createUser(any(User.class)))
                .thenThrow(new IllegalArgumentException("Datos inválidos"));
        
        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest());
        
        verify(userService).createUser(any(User.class));
    }
    
    @Test
    void updateUser_WhenUserExists_ShouldReturn200() throws Exception {
        // Arrange
        User updateData = new User("Juan Pérez Actualizado", "juan.nuevo@example.com", UserRole.ADMIN);
        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(testUser);
        
        // Act & Assert
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk());
        
        verify(userService).updateUser(eq(1L), any(User.class));
    }
    
    @Test
    void deleteUser_WhenUserExists_ShouldReturn204() throws Exception {
        // Arrange
        when(userService.deleteUser(1L)).thenReturn(true);
        
        // Act & Assert
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
        
        verify(userService).deleteUser(1L);
    }
    
    @Test
    void deleteUser_WhenUserNotExists_ShouldReturn404() throws Exception {
        // Arrange
        when(userService.deleteUser(999L)).thenReturn(false);
        
        // Act & Assert
        mockMvc.perform(delete("/api/users/999"))
                .andExpect(status().isNotFound());
        
        verify(userService).deleteUser(999L);
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Java y cuáles son sus características principales?**
   - Lenguaje orientado a objetos, multiplataforma, tipado estático

2. **¿Cuál es la diferencia entre == y equals()?**
   - == compara referencias, equals() compara contenido

3. **¿Qué son las interfaces en Java?**
   - Contratos que definen métodos que deben implementar las clases

### Preguntas Intermedias

4. **¿Cómo funciona la gestión de memoria en Java?**
   - Garbage Collector, heap, stack, generaciones

5. **¿Qué son las anotaciones en Spring?**
   - Metadata para configurar comportamiento, @Component, @Service, etc.

6. **¿Cómo optimizas el rendimiento en Spring Boot?**
   - Caching, lazy loading, connection pooling, profiling

### Preguntas Avanzadas

7. **¿Cómo implementarías un sistema de autenticación con Spring Security?**
   - JWT, OAuth2, UserDetailsService, PasswordEncoder

8. **¿Qué es el patrón de inyección de dependencias?**
   - IoC container, beans, scopes, lifecycle

9. **¿Cómo manejarías transacciones distribuidas?**
   - @Transactional, propagation, isolation, rollback

---

## 📚 Recursos Adicionales

- [Documentación oficial de Java](https://docs.oracle.com/javase/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Java! 🚀** 