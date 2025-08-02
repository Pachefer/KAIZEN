# 🔐 Spring Security - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Spring Security](#fundamentos-de-spring-security)
2. [Autenticación](#autenticación)
3. [Autorización](#autorización)
4. [JWT y OAuth2](#jwt-y-oauth2)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Spring Security

### Configuración Básica

```java
// SecurityConfig.java - Configuración básica de Spring Security
package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Marca esta clase como configuración de Spring
@EnableWebSecurity // Habilita Spring Security para aplicaciones web
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    // Bean para el encoder de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt es el algoritmo recomendado para hashear contraseñas
        return new BCryptPasswordEncoder(12); // Strength de 12 (muy seguro)
    }
    
    // Configurar autenticación en memoria (para desarrollo)
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
            .withUser("admin") // Usuario administrador
            .password(passwordEncoder().encode("admin123")) // Contraseña hasheada
            .roles("ADMIN") // Rol de administrador
            .and()
            .withUser("user") // Usuario normal
            .password(passwordEncoder().encode("user123")) // Contraseña hasheada
            .roles("USER"); // Rol de usuario
    }
    
    // Configurar reglas de autorización
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para APIs REST (opcional)
            .csrf().disable()
            
            // Configurar autorización de rutas
            .authorizeRequests()
                .antMatchers("/public/**").permitAll() // Rutas públicas sin autenticación
                .antMatchers("/api/admin/**").hasRole("ADMIN") // Solo administradores
                .antMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // Usuarios y admin
                .antMatchers("/api/**").authenticated() // Cualquier ruta /api requiere autenticación
                .anyRequest().authenticated() // Cualquier otra ruta requiere autenticación
            .and()
            
            // Configurar formulario de login
            .formLogin()
                .loginPage("/login") // Página de login personalizada
                .defaultSuccessUrl("/dashboard") // Redirigir después del login exitoso
                .failureUrl("/login?error=true") // Redirigir en caso de error
                .permitAll() // Permitir acceso a la página de login
            .and()
            
            // Configurar logout
            .logout()
                .logoutUrl("/logout") // URL para logout
                .logoutSuccessUrl("/login?logout=true") // Redirigir después del logout
                .invalidateHttpSession(true) // Invalidar sesión
                .deleteCookies("JSESSIONID") // Eliminar cookies
                .permitAll() // Permitir logout a todos
            .and()
            
            // Configurar manejo de excepciones
            .exceptionHandling()
                .accessDeniedPage("/access-denied") // Página de acceso denegado
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint()); // Entry point personalizado
    }
}

// CustomAuthenticationEntryPoint.java - Entry point personalizado para APIs
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    @Override
    public void commence(HttpServletRequest request, 
                        HttpServletResponse response, 
                        AuthenticationException authException) throws IOException {
        
        // Verificar si es una petición a la API
        if (request.getRequestURI().startsWith("/api/")) {
            // Para APIs, devolver JSON en lugar de redirigir
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            
            String jsonResponse = "{\"error\":\"No autorizado\",\"message\":\"Se requiere autenticación\"}";
            response.getWriter().write(jsonResponse);
        } else {
            // Para páginas web, redirigir al login
            response.sendRedirect("/login");
        }
    }
}
```

### Entidad de Usuario

```java
// User.java - Entidad de usuario con Spring Security
package com.example.demo.model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity // Marca como entidad JPA
@Table(name = "users") // Nombre de la tabla
public class User {
    
    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;
    
    @NotBlank(message = "El username es obligatorio")
    @Size(min = 3, max = 50, message = "El username debe tener entre 3 y 50 caracteres")
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "enabled")
    private boolean enabled = true; // Usuario activo por defecto
    
    @Column(name = "account_non_expired")
    private boolean accountNonExpired = true; // Cuenta no expirada
    
    @Column(name = "credentials_non_expired")
    private boolean credentialsNonExpired = true; // Credenciales no expiradas
    
    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true; // Cuenta no bloqueada
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    // Relación muchos a muchos con roles
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    // Constructor por defecto
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor con parámetros básicos
    public User(String username, String email, String password) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
    // Método para agregar rol
    public void addRole(Role role) {
        this.roles.add(role);
        role.getUsers().add(this);
    }
    
    // Método para remover rol
    public void removeRole(Role role) {
        this.roles.remove(role);
        role.getUsers().remove(this);
    }
    
    // Método para verificar si tiene un rol específico
    public boolean hasRole(String roleName) {
        return this.roles.stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }
    
    // Método para obtener nombres de roles como strings
    public Collection<String> getRoleNames() {
        return this.roles.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }
    
    // Método para actualizar timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    
    public boolean isAccountNonExpired() { return accountNonExpired; }
    public void setAccountNonExpired(boolean accountNonExpired) { this.accountNonExpired = accountNonExpired; }
    
    public boolean isCredentialsNonExpired() { return credentialsNonExpired; }
    public void setCredentialsNonExpired(boolean credentialsNonExpired) { this.credentialsNonExpired = credentialsNonExpired; }
    
    public boolean isAccountNonLocked() { return accountNonLocked; }
    public void setAccountNonLocked(boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}

// Role.java - Entidad de rol
@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre del rol es obligatorio")
    @Column(name = "name", unique = true, nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    // Relación muchos a muchos con usuarios
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();
    
    // Constructor por defecto
    public Role() {}
    
    // Constructor con nombre
    public Role(String name) {
        this.name = name;
    }
    
    // Constructor con nombre y descripción
    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }
}
```

---

## 🔐 Autenticación

### UserDetailsService Personalizado

```java
// CustomUserDetailsService.java - Servicio personalizado para cargar usuarios
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service // Marca como servicio de Spring
@Transactional // Todas las operaciones son transaccionales
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository; // Repositorio de usuarios
    
    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // Método requerido por UserDetailsService
    @Override
    @Transactional(readOnly = true) // Solo lectura para esta operación
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // Buscar usuario por username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuario no encontrado con username: " + username
                ));
        
        // Verificar si el usuario está habilitado
        if (!user.isEnabled()) {
            throw new UsernameNotFoundException("Usuario deshabilitado: " + username);
        }
        
        // Convertir roles a autoridades de Spring Security
        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
        
        // Crear UserDetails de Spring Security
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(!user.isAccountNonExpired())
                .accountLocked(!user.isAccountNonLocked())
                .credentialsExpired(!user.isCredentialsNonExpired())
                .disabled(!user.isEnabled())
                .build();
    }
    
    // Método para cargar usuario por ID
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuario no encontrado con ID: " + id
                ));
        
        return loadUserByUsername(user.getUsername());
    }
    
    // Método para actualizar último login
    @Transactional
    public void updateLastLogin(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}

// UserRepository.java - Repositorio de usuarios
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Buscar por username
    Optional<User> findByUsername(String username);
    
    // Buscar por email
    Optional<User> findByEmail(String email);
    
    // Verificar si existe por username
    boolean existsByUsername(String username);
    
    // Verificar si existe por email
    boolean existsByEmail(String email);
    
    // Buscar usuarios habilitados
    List<User> findByEnabledTrue();
    
    // Buscar usuarios por rol
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    // Buscar usuarios con roles específicos
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name IN :roleNames")
    List<User> findByRoleNames(@Param("roleNames") List<String> roleNames);
}
```

### Servicio de Autenticación

```java
// AuthenticationService.java - Servicio de autenticación
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthenticationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    
    @Autowired
    public AuthenticationService(UserRepository userRepository,
                               PasswordEncoder passwordEncoder,
                               AuthenticationManager authenticationManager,
                               CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }
    
    // Método para registrar un nuevo usuario
    public User registerUser(User user) {
        // Validar que el username no exista
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("El username ya existe: " + user.getUsername());
        }
        
        // Validar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("El email ya existe: " + user.getEmail());
        }
        
        // Encriptar contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Establecer valores por defecto
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Guardar usuario
        User savedUser = userRepository.save(user);
        
        return savedUser;
    }
    
    // Método para autenticar usuario
    public Authentication authenticateUser(String username, String password) {
        try {
            // Crear token de autenticación
            UsernamePasswordAuthenticationToken authToken = 
                new UsernamePasswordAuthenticationToken(username, password);
            
            // Autenticar con Spring Security
            Authentication authentication = authenticationManager.authenticate(authToken);
            
            // Si la autenticación es exitosa, actualizar último login
            if (authentication.isAuthenticated()) {
                userDetailsService.updateLastLogin(username);
            }
            
            return authentication;
        } catch (Exception e) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }
    }
    
    // Método para obtener usuario autenticado actual
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userRepository.findByUsername(username);
        }
        
        return Optional.empty();
    }
    
    // Método para cambiar contraseña
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Verificar contraseña actual
            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                // Encriptar nueva contraseña
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setUpdatedAt(LocalDateTime.now());
                userRepository.save(user);
                return true;
            }
        }
        
        return false;
    }
    
    // Método para habilitar/deshabilitar usuario
    public boolean toggleUserStatus(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEnabled(!user.isEnabled());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        
        return false;
    }
    
    // Método para bloquear/desbloquear cuenta
    public boolean toggleAccountLock(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setAccountNonLocked(!user.isAccountNonLocked());
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            return true;
        }
        
        return false;
    }
}
```

---

## 🛡️ Autorización

### Anotaciones de Seguridad

```java
// UserController.java - Controlador con anotaciones de seguridad
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthenticationService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    private final AuthenticationService authenticationService;
    
    @Autowired
    public UserController(UserService userService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }
    
    // GET /api/users - Obtener todos los usuarios (solo ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Solo usuarios con rol ADMIN
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    // GET /api/users/{id} - Obtener usuario por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/users/profile - Obtener perfil del usuario actual
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()") // Cualquier usuario autenticado
    public ResponseEntity<User> getCurrentUserProfile() {
        Optional<User> currentUser = authenticationService.getCurrentUser();
        
        if (currentUser.isPresent()) {
            return ResponseEntity.ok(currentUser.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/users - Crear nuevo usuario (solo ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(201).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // PUT /api/users/{id} - Actualizar usuario
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // DELETE /api/users/{id} - Eliminar usuario (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/users/{id}/toggle-status - Habilitar/deshabilitar usuario
    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
        if (authenticationService.toggleUserStatus(id)) {
            return ResponseEntity.ok("Estado del usuario actualizado");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/users/{id}/toggle-lock - Bloquear/desbloquear cuenta
    @PostMapping("/{id}/toggle-lock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleAccountLock(@PathVariable Long id) {
        if (authenticationService.toggleAccountLock(id)) {
            return ResponseEntity.ok("Estado de bloqueo actualizado");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // POST /api/users/change-password - Cambiar contraseña
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request) {
        Optional<User> currentUser = authenticationService.getCurrentUser();
        
        if (currentUser.isPresent()) {
            String username = currentUser.get().getUsername();
            
            if (authenticationService.changePassword(username, request.getOldPassword(), request.getNewPassword())) {
                return ResponseEntity.ok("Contraseña cambiada exitosamente");
            } else {
                return ResponseEntity.badRequest().body("Contraseña actual incorrecta");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/users/search - Buscar usuarios (solo ADMIN)
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
}

// PasswordChangeRequest.java - DTO para cambio de contraseña
public class PasswordChangeRequest {
    private String oldPassword;
    private String newPassword;
    
    // Constructor por defecto
    public PasswordChangeRequest() {}
    
    // Constructor con parámetros
    public PasswordChangeRequest(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
    
    // Getters y Setters
    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
    
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
```

---

## 🧪 Testing

### Testing de Spring Security

```java
// SecurityConfigTest.java - Pruebas de configuración de seguridad
package com.example.demo.config;

import com.example.demo.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SecurityConfig.class)
class SecurityConfigTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CustomUserDetailsService userDetailsService;
    
    // Test de acceso a rutas públicas
    @Test
    void publicEndpoints_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/public/health"))
                .andExpect(status().isOk());
    }
    
    // Test de acceso denegado a rutas protegidas sin autenticación
    @Test
    void protectedEndpoints_ShouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }
    
    // Test de acceso con rol de usuario
    @Test
    @WithMockUser(roles = "USER")
    void userRole_ShouldAccessUserEndpoints() throws Exception {
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isOk());
    }
    
    // Test de acceso denegado para usuarios sin rol ADMIN
    @Test
    @WithMockUser(roles = "USER")
    void userRole_ShouldNotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }
    
    // Test de acceso con rol de administrador
    @Test
    @WithMockUser(roles = "ADMIN")
    void adminRole_ShouldAccessAllEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk());
    }
}

// AuthenticationServiceTest.java - Pruebas del servicio de autenticación
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private CustomUserDetailsService userDetailsService;
    
    @InjectMocks
    private AuthenticationService authenticationService;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setEnabled(true);
    }
    
    @Test
    void registerUser_WithValidData_ShouldCreateUser() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        User result = authenticationService.registerUser(testUser);
        
        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void registerUser_WithExistingUsername_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authenticationService.registerUser(testUser)
        );
        
        assertEquals("El username ya existe: testuser", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void registerUser_WithExistingEmail_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> authenticationService.registerUser(testUser)
        );
        
        assertEquals("El email ya existe: test@example.com", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void changePassword_WithValidCredentials_ShouldReturnTrue() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "password123")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        boolean result = authenticationService.changePassword("testuser", "oldPassword", "newPassword");
        
        // Assert
        assertTrue(result);
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void changePassword_WithInvalidOldPassword_ShouldReturnFalse() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "password123")).thenReturn(false);
        
        // Act
        boolean result = authenticationService.changePassword("testuser", "wrongPassword", "newPassword");
        
        // Assert
        assertFalse(result);
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void toggleUserStatus_WithValidUserId_ShouldReturnTrue() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        boolean result = authenticationService.toggleUserStatus(1L);
        
        // Assert
        assertTrue(result);
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void toggleUserStatus_WithInvalidUserId_ShouldReturnFalse() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act
        boolean result = authenticationService.toggleUserStatus(999L);
        
        // Assert
        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Spring Security y cuáles son sus características principales?**
   - Framework de seguridad para aplicaciones Spring
   - Autenticación, autorización, protección contra ataques

2. **¿Cuál es la diferencia entre autenticación y autorización?**
   - Autenticación: verificar identidad
   - Autorización: verificar permisos

3. **¿Qué es UserDetailsService?**
   - Interfaz para cargar datos de usuario específicos de la aplicación

### Preguntas Intermedias

4. **¿Cómo funciona el filtro de seguridad en Spring Security?**
   - FilterChain, SecurityFilterChain, orden de filtros

5. **¿Qué son las anotaciones de seguridad?**
   - @PreAuthorize, @PostAuthorize, @Secured, @RolesAllowed

6. **¿Cómo implementarías autenticación personalizada?**
   - Custom AuthenticationProvider, UserDetailsService

### Preguntas Avanzadas

7. **¿Cómo implementarías JWT con Spring Security?**
   - JWT Token Provider, Authentication Filter, Token Validation

8. **¿Qué es OAuth2 y cómo se integra con Spring Security?**
   - Authorization Server, Resource Server, Client Credentials

9. **¿Cómo manejarías la seguridad en microservicios?**
   - JWT tokens, API Gateway, Service-to-service authentication

---

## 📚 Recursos Adicionales

- [Spring Security Documentation](https://docs.spring.io/spring-security/site/docs/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Security Samples](https://github.com/spring-projects/spring-security-samples)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Spring Security! 🚀** 