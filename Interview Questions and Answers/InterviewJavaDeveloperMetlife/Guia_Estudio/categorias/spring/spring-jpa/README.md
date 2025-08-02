# 🗄️ Spring JPA - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Spring JPA](#fundamentos-de-spring-jpa)
2. [Repositorios](#repositorios)
3. [Consultas Personalizadas](#consultas-personalizadas)
4. [Transacciones](#transacciones)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Spring JPA

### Configuración Básica

```java
// JpaConfig.java - Configuración de Spring JPA
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration // Marca esta clase como configuración de Spring
@EnableJpaRepositories(basePackages = "com.example.repository") // Habilita repositorios JPA
public class JpaConfig {
    
    // Bean para EntityManagerFactory
    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        // Crear EntityManagerFactory con configuración de Hibernate
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource); // Configurar DataSource
        em.setPackagesToScan("com.example.model"); // Paquetes a escanear para entidades
        
        // Configurar adaptador de Hibernate
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(true); // Generar DDL automáticamente
        vendorAdapter.setShowSql(true); // Mostrar SQL en logs
        vendorAdapter.setDatabasePlatform("org.hibernate.dialect.MySQL8Dialect"); // Dialecto de MySQL
        em.setJpaVendorAdapter(vendorAdapter);
        
        // Configurar propiedades adicionales
        Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", "update"); // Actualizar esquema
        properties.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
        properties.setProperty("hibernate.show_sql", "true");
        properties.setProperty("hibernate.format_sql", "true");
        em.setJpaProperties(properties);
        
        return em;
    }
    
    // Bean para TransactionManager
    @Bean
    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        // Crear JpaTransactionManager para manejar transacciones JPA
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory.getObject());
        return transactionManager;
    }
}
```

### Entidad JPA

```java
// User.java - Entidad JPA con Spring Data
package com.example.model;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
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
    @Column(name = "username", unique = true, nullable = false, length = 50)
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
    private boolean enabled = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
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

## 🔄 Repositorios

### Repositorio Básico

```java
// UserRepository.java - Repositorio JPA con Spring Data
package com.example.repository;

import com.example.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository // Marca como componente de repositorio
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Métodos de consulta derivados (Spring Data JPA los implementa automáticamente)
    
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
    
    // Buscar usuarios deshabilitados
    List<User> findByEnabledFalse();
    
    // Buscar por nombre o apellido (ignorando mayúsculas/minúsculas)
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String firstName, String lastName);
    
    // Buscar por email (ignorando mayúsculas/minúsculas)
    List<User> findByEmailContainingIgnoreCase(String email);
    
    // Buscar usuarios creados después de una fecha
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    // Buscar usuarios creados entre dos fechas
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Buscar usuarios con paginación
    Page<User> findAll(Pageable pageable);
    
    // Buscar usuarios habilitados con paginación
    Page<User> findByEnabledTrue(Pageable pageable);
    
    // Buscar por username con paginación
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    
    // Contar usuarios habilitados
    long countByEnabledTrue();
    
    // Contar usuarios deshabilitados
    long countByEnabledFalse();
    
    // Buscar usuarios que tienen un rol específico
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    // Buscar usuarios que tienen roles específicos
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name IN :roleNames")
    List<User> findByRoleNames(@Param("roleNames") List<String> roleNames);
    
    // Buscar usuarios con roles usando JOIN FETCH para evitar N+1
    @Query("SELECT DISTINCT u FROM User u JOIN FETCH u.roles")
    List<User> findAllWithRoles();
    
    // Buscar usuario por ID con roles usando JOIN FETCH
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") Long id);
    
    // Buscar usuarios con consulta nativa SQL
    @Query(value = "SELECT * FROM users WHERE enabled = 1 AND created_at >= :date", nativeQuery = true)
    List<User> findActiveUsersSince(@Param("date") LocalDateTime date);
    
    // Buscar usuarios con consulta nativa compleja
    @Query(value = "SELECT u.* FROM users u " +
                   "JOIN user_roles ur ON u.id = ur.user_id " +
                   "JOIN roles r ON ur.role_id = r.id " +
                   "WHERE r.name = :roleName AND u.enabled = 1", nativeQuery = true)
    List<User> findActiveUsersByRole(@Param("roleName") String roleName);
    
    // Actualizar contraseña de usuario
    @Query("UPDATE User u SET u.password = :password, u.updatedAt = :updatedAt WHERE u.id = :id")
    @Modifying // Indica que es una operación de modificación
    @Transactional // Requiere transacción
    int updatePassword(@Param("id") Long id, @Param("password") String password, @Param("updatedAt") LocalDateTime updatedAt);
    
    // Habilitar/deshabilitar usuario
    @Query("UPDATE User u SET u.enabled = :enabled, u.updatedAt = :updatedAt WHERE u.id = :id")
    @Modifying
    @Transactional
    int updateUserStatus(@Param("id") Long id, @Param("enabled") boolean enabled, @Param("updatedAt") LocalDateTime updatedAt);
    
    // Eliminar usuarios inactivos
    @Query("DELETE FROM User u WHERE u.enabled = false AND u.createdAt < :date")
    @Modifying
    @Transactional
    int deleteInactiveUsers(@Param("date") LocalDateTime date);
}

// RoleRepository.java - Repositorio para roles
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    // Buscar por nombre
    Optional<Role> findByName(String name);
    
    // Verificar si existe por nombre
    boolean existsByName(String name);
    
    // Buscar roles por nombres
    List<Role> findByNameIn(List<String> names);
    
    // Buscar roles que tienen usuarios
    @Query("SELECT r FROM Role r JOIN r.users u")
    List<Role> findRolesWithUsers();
    
    // Contar usuarios por rol
    @Query("SELECT r.name, COUNT(u) FROM Role r LEFT JOIN r.users u GROUP BY r.name")
    List<Object[]> countUsersByRole();
}
```

---

## 🔍 Consultas Personalizadas

### Servicio con Repositorios

```java
// UserService.java - Servicio con Spring Data JPA
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service // Marca como componente de servicio
@Transactional // Todas las operaciones son transaccionales
public class UserService {
    
    private final UserRepository userRepository; // Repositorio inyectado
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // Método para crear usuario
    @Transactional
    public User createUser(User user) {
        // Validar datos del usuario
        validateUser(user);
        
        // Verificar que el username no exista
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username ya existe: " + user.getUsername());
        }
        
        // Verificar que el email no exista
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email ya existe: " + user.getEmail());
        }
        
        // Guardar usuario
        return userRepository.save(user);
    }
    
    // Método para obtener usuario por ID
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    // Método para obtener usuario por ID con roles
    @Transactional(readOnly = true)
    public Optional<User> getUserByIdWithRoles(Long id) {
        return userRepository.findByIdWithRoles(id);
    }
    
    // Método para obtener usuario por username
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Método para obtener usuario por email
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Método para obtener todos los usuarios
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Método para obtener todos los usuarios con roles
    @Transactional(readOnly = true)
    public List<User> getAllUsersWithRoles() {
        return userRepository.findAllWithRoles();
    }
    
    // Método para obtener usuarios con paginación
    @Transactional(readOnly = true)
    public Page<User> getUsersWithPagination(int page, int size, String sortBy) {
        // Crear objeto de paginación
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }
    
    // Método para buscar usuarios
    @Transactional(readOnly = true)
    public Page<User> searchUsers(String username, int page, int size) {
        // Crear objeto de paginación
        Pageable pageable = PageRequest.of(page, size, Sort.by("username"));
        return userRepository.findByUsernameContainingIgnoreCase(username, pageable);
    }
    
    // Método para obtener usuarios por rol
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName);
    }
    
    // Método para obtener usuarios activos desde una fecha
    @Transactional(readOnly = true)
    public List<User> getActiveUsersSince(LocalDateTime date) {
        return userRepository.findActiveUsersSince(date);
    }
    
    // Método para actualizar usuario
    @Transactional
    public User updateUser(Long id, User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Actualizar campos
            if (userDetails.getUsername() != null) {
                // Verificar que el nuevo username no exista (excluyendo el usuario actual)
                if (!userDetails.getUsername().equals(user.getUsername()) && 
                    userRepository.existsByUsername(userDetails.getUsername())) {
                    throw new IllegalArgumentException("Username ya existe: " + userDetails.getUsername());
                }
                user.setUsername(userDetails.getUsername());
            }
            
            if (userDetails.getEmail() != null) {
                // Verificar que el nuevo email no exista (excluyendo el usuario actual)
                if (!userDetails.getEmail().equals(user.getEmail()) && 
                    userRepository.existsByEmail(userDetails.getEmail())) {
                    throw new IllegalArgumentException("Email ya existe: " + userDetails.getEmail());
                }
                user.setEmail(userDetails.getEmail());
            }
            
            if (userDetails.getPassword() != null) {
                user.setPassword(userDetails.getPassword());
            }
            
            if (userDetails.getFirstName() != null) {
                user.setFirstName(userDetails.getFirstName());
            }
            
            if (userDetails.getLastName() != null) {
                user.setLastName(userDetails.getLastName());
            }
            
            if (userDetails.isEnabled() != user.isEnabled()) {
                user.setEnabled(userDetails.isEnabled());
            }
            
            // Guardar cambios
            return userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
    }
    
    // Método para cambiar contraseña
    @Transactional
    public boolean changePassword(Long userId, String newPassword) {
        LocalDateTime updatedAt = LocalDateTime.now();
        int rowsAffected = userRepository.updatePassword(userId, newPassword, updatedAt);
        return rowsAffected > 0;
    }
    
    // Método para habilitar/deshabilitar usuario
    @Transactional
    public boolean toggleUserStatus(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean newStatus = !user.isEnabled();
            LocalDateTime updatedAt = LocalDateTime.now();
            
            int rowsAffected = userRepository.updateUserStatus(userId, newStatus, updatedAt);
            return rowsAffected > 0;
        }
        
        return false;
    }
    
    // Método para eliminar usuario
    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Método para eliminar usuarios inactivos
    @Transactional
    public int deleteInactiveUsers(LocalDateTime date) {
        return userRepository.deleteInactiveUsers(date);
    }
    
    // Método para obtener estadísticas
    @Transactional(readOnly = true)
    public UserStatistics getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();
        long inactiveUsers = userRepository.countByEnabledFalse();
        
        return new UserStatistics(totalUsers, activeUsers, inactiveUsers);
    }
    
    // Método privado para validar usuario
    private void validateUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username es requerido");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email es requerido");
        }
        
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password es requerido");
        }
        
        if (user.getUsername().length() < 3) {
            throw new IllegalArgumentException("Username debe tener al menos 3 caracteres");
        }
        
        if (!user.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email debe tener formato válido");
        }
    }
}

// UserStatistics.java - Clase para estadísticas
public class UserStatistics {
    private final long totalUsers;
    private final long activeUsers;
    private final long inactiveUsers;
    
    public UserStatistics(long totalUsers, long activeUsers, long inactiveUsers) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
    }
    
    // Getters
    public long getTotalUsers() { return totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public long getInactiveUsers() { return inactiveUsers; }
}
```

---

## 🧪 Testing

### Testing de Spring JPA

```java
// UserRepositoryTest.java - Pruebas del repositorio
package com.example.repository;

import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest // Configuración para testing de JPA
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEnabled(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());
    }
    
    @Test
    void save_ShouldSaveUser() {
        // Act
        User savedUser = userRepository.save(testUser);
        
        // Assert
        assertNotNull(savedUser.getId());
        assertEquals("testuser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
    }
    
    @Test
    void findById_WithValidId_ShouldReturnUser() {
        // Arrange
        User savedUser = userRepository.save(testUser);
        
        // Act
        Optional<User> foundUser = userRepository.findById(savedUser.getId());
        
        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }
    
    @Test
    void findById_WithInvalidId_ShouldReturnEmpty() {
        // Act
        Optional<User> foundUser = userRepository.findById(999L);
        
        // Assert
        assertFalse(foundUser.isPresent());
    }
    
    @Test
    void findByUsername_WithValidUsername_ShouldReturnUser() {
        // Arrange
        userRepository.save(testUser);
        
        // Act
        Optional<User> foundUser = userRepository.findByUsername("testuser");
        
        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }
    
    @Test
    void findByUsername_WithInvalidUsername_ShouldReturnEmpty() {
        // Act
        Optional<User> foundUser = userRepository.findByUsername("nonexistent");
        
        // Assert
        assertFalse(foundUser.isPresent());
    }
    
    @Test
    void existsByUsername_WithExistingUsername_ShouldReturnTrue() {
        // Arrange
        userRepository.save(testUser);
        
        // Act
        boolean exists = userRepository.existsByUsername("testuser");
        
        // Assert
        assertTrue(exists);
    }
    
    @Test
    void existsByUsername_WithNonExistingUsername_ShouldReturnFalse() {
        // Act
        boolean exists = userRepository.existsByUsername("nonexistent");
        
        // Assert
        assertFalse(exists);
    }
    
    @Test
    void findByEnabledTrue_ShouldReturnOnlyEnabledUsers() {
        // Arrange
        User enabledUser = new User("enabled", "enabled@test.com", "password");
        enabledUser.setEnabled(true);
        
        User disabledUser = new User("disabled", "disabled@test.com", "password");
        disabledUser.setEnabled(false);
        
        userRepository.save(enabledUser);
        userRepository.save(disabledUser);
        
        // Act
        List<User> enabledUsers = userRepository.findByEnabledTrue();
        
        // Assert
        assertEquals(1, enabledUsers.size());
        assertTrue(enabledUsers.get(0).isEnabled());
    }
    
    @Test
    void findAll_WithPagination_ShouldReturnPaginatedResults() {
        // Arrange
        for (int i = 1; i <= 5; i++) {
            User user = new User("user" + i, "user" + i + "@test.com", "password");
            userRepository.save(user);
        }
        
        Pageable pageable = PageRequest.of(0, 3);
        
        // Act
        Page<User> page = userRepository.findAll(pageable);
        
        // Assert
        assertEquals(5, page.getTotalElements());
        assertEquals(3, page.getContent().size());
        assertEquals(2, page.getTotalPages());
    }
    
    @Test
    void findByUsernameContainingIgnoreCase_ShouldReturnMatchingUsers() {
        // Arrange
        User user1 = new User("john_doe", "john@test.com", "password");
        User user2 = new User("jane_doe", "jane@test.com", "password");
        User user3 = new User("bob_smith", "bob@test.com", "password");
        
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        
        Pageable pageable = PageRequest.of(0, 10);
        
        // Act
        Page<User> page = userRepository.findByUsernameContainingIgnoreCase("doe", pageable);
        
        // Assert
        assertEquals(2, page.getTotalElements());
        assertTrue(page.getContent().stream().allMatch(user -> 
            user.getUsername().toLowerCase().contains("doe")));
    }
    
    @Test
    void findByCreatedAtAfter_ShouldReturnUsersCreatedAfterDate() {
        // Arrange
        LocalDateTime baseDate = LocalDateTime.now().minusDays(1);
        
        User oldUser = new User("olduser", "old@test.com", "password");
        oldUser.setCreatedAt(baseDate.minusDays(1));
        
        User newUser = new User("newuser", "new@test.com", "password");
        newUser.setCreatedAt(baseDate.plusDays(1));
        
        userRepository.save(oldUser);
        userRepository.save(newUser);
        
        // Act
        List<User> recentUsers = userRepository.findByCreatedAtAfter(baseDate);
        
        // Assert
        assertEquals(1, recentUsers.size());
        assertEquals("newuser", recentUsers.get(0).getUsername());
    }
}

// UserServiceTest.java - Pruebas del servicio
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
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
    void createUser_WithValidData_ShouldCreateUser() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        User result = userService.createUser(testUser);
        
        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).save(testUser);
    }
    
    @Test
    void createUser_WithExistingUsername_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.createUser(testUser)
        );
        
        assertEquals("Username ya existe: testuser", exception.getMessage());
        verify(userRepository, never()).save(any());
    }
    
    @Test
    void getUserById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        // Act
        Optional<User> result = userService.getUserById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }
    
    @Test
    void updateUser_WithValidId_ShouldUpdateUser() {
        // Arrange
        User updateDetails = new User();
        updateDetails.setUsername("newusername");
        updateDetails.setEmail("newemail@test.com");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsername("newusername")).thenReturn(false);
        when(userRepository.existsByEmail("newemail@test.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        User result = userService.updateUser(1L, updateDetails);
        
        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
    }
    
    @Test
    void changePassword_WithValidUserId_ShouldReturnTrue() {
        // Arrange
        when(userRepository.updatePassword(1L, "newpassword", any(LocalDateTime.class)))
                .thenReturn(1);
        
        // Act
        boolean result = userService.changePassword(1L, "newpassword");
        
        // Assert
        assertTrue(result);
        verify(userRepository).updatePassword(1L, "newpassword", any(LocalDateTime.class));
    }
    
    @Test
    void toggleUserStatus_WithValidUserId_ShouldReturnTrue() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.updateUserStatus(1L, false, any(LocalDateTime.class)))
                .thenReturn(1);
        
        // Act
        boolean result = userService.toggleUserStatus(1L);
        
        // Assert
        assertTrue(result);
        verify(userRepository).updateUserStatus(1L, false, any(LocalDateTime.class));
    }
    
    @Test
    void getUserStatistics_ShouldReturnStatistics() {
        // Arrange
        when(userRepository.count()).thenReturn(10L);
        when(userRepository.countByEnabledTrue()).thenReturn(8L);
        when(userRepository.countByEnabledFalse()).thenReturn(2L);
        
        // Act
        UserStatistics statistics = userService.getUserStatistics();
        
        // Assert
        assertEquals(10L, statistics.getTotalUsers());
        assertEquals(8L, statistics.getActiveUsers());
        assertEquals(2L, statistics.getInactiveUsers());
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Spring Data JPA y cuáles son sus ventajas?**
   - Abstracción de JPA, repositorios automáticos, consultas derivadas

2. **¿Cuál es la diferencia entre JPA y Spring Data JPA?**
   - JPA: especificación, Spring Data JPA: implementación con funcionalidades adicionales

3. **¿Qué son los repositorios en Spring Data JPA?**
   - Interfaces que extienden JpaRepository, métodos automáticos

### Preguntas Intermedias

4. **¿Cómo funcionan las consultas derivadas?**
   - Naming conventions, Spring Data JPA las implementa automáticamente

5. **¿Qué es @Query y cuándo usarlo?**
   - Anotación para consultas personalizadas, JPQL y SQL nativo

6. **¿Cómo manejar transacciones en Spring Data JPA?**
   - @Transactional, propagación, aislamiento

### Preguntas Avanzadas

7. **¿Cómo optimizar consultas con Spring Data JPA?**
   - JOIN FETCH, paginación, índices, N+1 queries

8. **¿Qué son los projections en Spring Data JPA?**
   - Interfaces para seleccionar campos específicos, DTOs automáticos

9. **¿Cómo implementar auditoría en Spring Data JPA?**
   - @EntityListeners, @CreatedDate, @LastModifiedDate

---

## 📚 Recursos Adicionales

- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/reference/)
- [Spring Data JPA Best Practices](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.repositories)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Spring JPA! 🚀** 