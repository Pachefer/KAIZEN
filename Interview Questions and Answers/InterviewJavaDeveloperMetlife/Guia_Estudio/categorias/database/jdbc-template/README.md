# 🔗 JDBC Template - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de JDBC Template](#fundamentos-de-jdbc-template)
2. [Operaciones CRUD](#operaciones-crud)
3. [Consultas Avanzadas](#consultas-avanzadas)
4. [Transacciones](#transacciones)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de JDBC Template

### Configuración Básica

```java
// DatabaseConfig.java - Configuración de JDBC Template
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration // Marca esta clase como configuración de Spring
public class DatabaseConfig {
    
    // Propiedades de la base de datos desde application.properties
    @Value("${spring.datasource.url}")
    private String url;
    
    @Value("${spring.datasource.username}")
    private String username;
    
    @Value("${spring.datasource.password}")
    private String password;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    
    // Bean para DataSource
    @Bean
    public DataSource dataSource() {
        // Crear DataSource con configuración básica
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(driverClassName); // Driver de MySQL
        dataSource.setUrl(url); // URL de conexión
        dataSource.setUsername(username); // Usuario de la base de datos
        dataSource.setPassword(password); // Contraseña de la base de datos
        
        return dataSource;
    }
    
    // Bean para JdbcTemplate
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        // Crear JdbcTemplate con el DataSource configurado
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
        // Configurar propiedades adicionales
        jdbcTemplate.setFetchSize(100); // Tamaño de fetch para consultas grandes
        jdbcTemplate.setMaxRows(1000); // Máximo número de filas por consulta
        jdbcTemplate.setQueryTimeout(30); // Timeout de consultas en segundos
        
        return jdbcTemplate;
    }
    
    // Bean para TransactionManager
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        // Crear DataSourceTransactionManager para manejar transacciones
        return new DataSourceTransactionManager(dataSource);
    }
}

// application.properties - Configuración de propiedades
/*
spring.datasource.url=jdbc:mysql://localhost:3306/testdb?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuración de pool de conexiones
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
*/
```

### Modelo de Datos

```java
// User.java - Modelo de usuario para JDBC Template
package com.example.model;

import java.time.LocalDateTime;

public class User {
    
    private Long id; // ID del usuario
    private String username; // Nombre de usuario
    private String email; // Email del usuario
    private String password; // Contraseña (hasheada)
    private String firstName; // Nombre
    private String lastName; // Apellido
    private boolean enabled; // Si el usuario está habilitado
    private LocalDateTime createdAt; // Fecha de creación
    private LocalDateTime updatedAt; // Fecha de última actualización
    
    // Constructor por defecto
    public User() {}
    
    // Constructor con parámetros básicos
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.enabled = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor completo
    public User(Long id, String username, String email, String password, 
                String firstName, String lastName, boolean enabled, 
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
    
    // Método para obtener nombre completo
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        } else {
            return username;
        }
    }
    
    // Método toString para debugging
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", enabled=" + enabled +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
```

---

## 🔄 Operaciones CRUD

### DAO con JDBC Template

```java
// UserDAO.java - Data Access Object con JDBC Template
package com.example.dao;

import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository // Marca como componente de repositorio
public class UserDAO {
    
    private final JdbcTemplate jdbcTemplate; // Template de JDBC inyectado
    
    // RowMapper para convertir filas de la base de datos a objetos User
    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setEnabled(rs.getBoolean("enabled"));
        user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        user.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return user;
    };
    
    @Autowired
    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // Método para crear usuario
    public User createUser(User user) {
        // SQL para insertar usuario
        String sql = "INSERT INTO users (username, email, password, first_name, last_name, enabled, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        // KeyHolder para obtener el ID generado
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        // Ejecutar inserción y obtener ID generado
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            ps.setBoolean(6, user.isEnabled());
            ps.setTimestamp(7, java.sql.Timestamp.valueOf(LocalDateTime.now()));
            ps.setTimestamp(8, java.sql.Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);
        
        // Establecer ID generado en el objeto user
        user.setId(keyHolder.getKey().longValue());
        return user;
    }
    
    // Método para obtener usuario por ID
    public Optional<User> findById(Long id) {
        try {
            // SQL para buscar usuario por ID
            String sql = "SELECT * FROM users WHERE id = ?";
            
            // Ejecutar consulta y mapear resultado
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            // Retornar Optional vacío si no se encuentra el usuario
            return Optional.empty();
        }
    }
    
    // Método para obtener usuario por username
    public Optional<User> findByUsername(String username) {
        try {
            // SQL para buscar usuario por username
            String sql = "SELECT * FROM users WHERE username = ?";
            
            // Ejecutar consulta y mapear resultado
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, username);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            // Retornar Optional vacío si no se encuentra el usuario
            return Optional.empty();
        }
    }
    
    // Método para obtener usuario por email
    public Optional<User> findByEmail(String email) {
        try {
            // SQL para buscar usuario por email
            String sql = "SELECT * FROM users WHERE email = ?";
            
            // Ejecutar consulta y mapear resultado
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            // Retornar Optional vacío si no se encuentra el usuario
            return Optional.empty();
        }
    }
    
    // Método para obtener todos los usuarios
    public List<User> findAll() {
        // SQL para obtener todos los usuarios
        String sql = "SELECT * FROM users ORDER BY id";
        
        // Ejecutar consulta y mapear resultados
        return jdbcTemplate.query(sql, userRowMapper);
    }
    
    // Método para obtener usuarios con paginación
    public List<User> findAllWithPagination(int page, int size) {
        // SQL para obtener usuarios con paginación
        String sql = "SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?";
        
        // Calcular offset basado en página y tamaño
        int offset = page * size;
        
        // Ejecutar consulta y mapear resultados
        return jdbcTemplate.query(sql, userRowMapper, size, offset);
    }
    
    // Método para actualizar usuario
    public boolean updateUser(User user) {
        // SQL para actualizar usuario
        String sql = "UPDATE users SET username = ?, email = ?, password = ?, " +
                    "first_name = ?, last_name = ?, enabled = ?, updated_at = ? " +
                    "WHERE id = ?";
        
        // Ejecutar actualización y retornar número de filas afectadas
        int rowsAffected = jdbcTemplate.update(sql,
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                user.isEnabled(),
                LocalDateTime.now(),
                user.getId()
        );
        
        return rowsAffected > 0;
    }
    
    // Método para eliminar usuario
    public boolean deleteById(Long id) {
        // SQL para eliminar usuario
        String sql = "DELETE FROM users WHERE id = ?";
        
        // Ejecutar eliminación y retornar número de filas afectadas
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }
    
    // Método para verificar si existe usuario por username
    public boolean existsByUsername(String username) {
        // SQL para contar usuarios con username específico
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        
        // Ejecutar consulta y retornar si existe
        int count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count > 0;
    }
    
    // Método para verificar si existe usuario por email
    public boolean existsByEmail(String email) {
        // SQL para contar usuarios con email específico
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        
        // Ejecutar consulta y retornar si existe
        int count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count > 0;
    }
    
    // Método para contar total de usuarios
    public long count() {
        // SQL para contar todos los usuarios
        String sql = "SELECT COUNT(*) FROM users";
        
        // Ejecutar consulta y retornar conteo
        return jdbcTemplate.queryForObject(sql, Long.class);
    }
    
    // Método para habilitar/deshabilitar usuario
    public boolean toggleUserStatus(Long id) {
        // SQL para actualizar estado del usuario
        String sql = "UPDATE users SET enabled = NOT enabled, updated_at = ? WHERE id = ?";
        
        // Ejecutar actualización y retornar número de filas afectadas
        int rowsAffected = jdbcTemplate.update(sql, LocalDateTime.now(), id);
        return rowsAffected > 0;
    }
}
```

---

## 🔍 Consultas Avanzadas

### Consultas Complejas

```java
// UserQueryService.java - Servicio para consultas avanzadas
package com.example.service;

import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserQueryService {
    
    private final JdbcTemplate jdbcTemplate;
    
    // RowMapper para resultados de consultas complejas
    private final RowMapper<Map<String, Object>> mapRowMapper = (rs, rowNum) -> {
        Map<String, Object> row = new HashMap<>();
        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
            String columnName = rs.getMetaData().getColumnName(i);
            Object value = rs.getObject(i);
            row.put(columnName, value);
        }
        return row;
    };
    
    @Autowired
    public UserQueryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    // Método para buscar usuarios con filtros múltiples
    public List<User> searchUsers(String username, String email, Boolean enabled) {
        // Construir SQL dinámicamente basado en filtros
        StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE 1=1");
        List<Object> params = new ArrayList<>();
        
        if (username != null && !username.trim().isEmpty()) {
            sql.append(" AND username LIKE ?");
            params.add("%" + username + "%");
        }
        
        if (email != null && !email.trim().isEmpty()) {
            sql.append(" AND email LIKE ?");
            params.add("%" + email + "%");
        }
        
        if (enabled != null) {
            sql.append(" AND enabled = ?");
            params.add(enabled);
        }
        
        sql.append(" ORDER BY created_at DESC");
        
        // Ejecutar consulta con parámetros dinámicos
        return jdbcTemplate.query(sql.toString(), 
                (rs, rowNum) -> mapToUser(rs), 
                params.toArray());
    }
    
    // Método para obtener estadísticas de usuarios
    public Map<String, Object> getUserStatistics() {
        // SQL para obtener estadísticas
        String sql = "SELECT " +
                    "COUNT(*) as total_users, " +
                    "COUNT(CASE WHEN enabled = 1 THEN 1 END) as active_users, " +
                    "COUNT(CASE WHEN enabled = 0 THEN 1 END) as inactive_users, " +
                    "COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30_days " +
                    "FROM users";
        
        // Ejecutar consulta y retornar estadísticas
        return jdbcTemplate.queryForMap(sql);
    }
    
    // Método para obtener usuarios por rango de fechas
    public List<User> getUsersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        // SQL para obtener usuarios en rango de fechas
        String sql = "SELECT * FROM users WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC";
        
        // Ejecutar consulta con parámetros de fecha
        return jdbcTemplate.query(sql, 
                (rs, rowNum) -> mapToUser(rs), 
                startDate, endDate);
    }
    
    // Método para obtener usuarios con JOIN
    public List<Map<String, Object>> getUsersWithRoles() {
        // SQL con JOIN para obtener usuarios y sus roles
        String sql = "SELECT u.id, u.username, u.email, u.first_name, u.last_name, " +
                    "GROUP_CONCAT(r.name) as roles " +
                    "FROM users u " +
                    "LEFT JOIN user_roles ur ON u.id = ur.user_id " +
                    "LEFT JOIN roles r ON ur.role_id = r.id " +
                    "GROUP BY u.id, u.username, u.email, u.first_name, u.last_name " +
                    "ORDER BY u.username";
        
        // Ejecutar consulta y retornar resultados como Map
        return jdbcTemplate.query(sql, mapRowMapper);
    }
    
    // Método para obtener usuarios con consulta nativa compleja
    public List<User> getUsersWithComplexQuery() {
        // SQL complejo con subconsultas y funciones
        String sql = "SELECT u.* FROM users u " +
                    "WHERE u.enabled = 1 " +
                    "AND u.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) " +
                    "AND u.id NOT IN (SELECT DISTINCT user_id FROM user_logins WHERE login_date < DATE_SUB(NOW(), INTERVAL 6 MONTH)) " +
                    "ORDER BY u.created_at DESC";
        
        // Ejecutar consulta compleja
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapToUser(rs));
    }
    
    // Método para actualización en lote
    public int[] batchUpdateUsers(List<User> users) {
        // SQL para actualización en lote
        String sql = "UPDATE users SET username = ?, email = ?, updated_at = ? WHERE id = ?";
        
        // Preparar datos para actualización en lote
        List<Object[]> batchArgs = users.stream()
                .map(user -> new Object[]{
                        user.getUsername(),
                        user.getEmail(),
                        LocalDateTime.now(),
                        user.getId()
                })
                .collect(Collectors.toList());
        
        // Ejecutar actualización en lote
        return jdbcTemplate.batchUpdate(sql, batchArgs);
    }
    
    // Método para inserción en lote
    public int[] batchInsertUsers(List<User> users) {
        // SQL para inserción en lote
        String sql = "INSERT INTO users (username, email, password, first_name, last_name, enabled, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Preparar datos para inserción en lote
        List<Object[]> batchArgs = users.stream()
                .map(user -> new Object[]{
                        user.getUsername(),
                        user.getEmail(),
                        user.getPassword(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.isEnabled(),
                        LocalDateTime.now(),
                        LocalDateTime.now()
                })
                .collect(Collectors.toList());
        
        // Ejecutar inserción en lote
        return jdbcTemplate.batchUpdate(sql, batchArgs);
    }
    
    // Método auxiliar para mapear ResultSet a User
    private User mapToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setEnabled(rs.getBoolean("enabled"));
        user.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        user.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return user;
    }
}
```

---

## 💾 Transacciones

### Servicio con Transacciones

```java
// UserService.java - Servicio con manejo de transacciones
package com.example.service;

import com.example.dao.UserDAO;
import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserDAO userDAO;
    private final UserQueryService userQueryService;
    
    @Autowired
    public UserService(UserDAO userDAO, UserQueryService userQueryService) {
        this.userDAO = userDAO;
        this.userQueryService = userQueryService;
    }
    
    // Método transaccional para crear usuario
    @Transactional
    public User createUser(User user) {
        // Validar datos del usuario
        validateUser(user);
        
        // Verificar que el username no exista
        if (userDAO.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username ya existe: " + user.getUsername());
        }
        
        // Verificar que el email no exista
        if (userDAO.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email ya existe: " + user.getEmail());
        }
        
        // Crear usuario
        User createdUser = userDAO.createUser(user);
        
        // Aquí podrías agregar lógica adicional como enviar email de bienvenida
        // Si algo falla, toda la transacción se revierte
        
        return createdUser;
    }
    
    // Método transaccional para actualizar usuario
    @Transactional
    public User updateUser(Long id, User userDetails) {
        // Buscar usuario existente
        Optional<User> existingUser = userDAO.findById(id);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            
            // Actualizar campos
            if (userDetails.getUsername() != null) {
                // Verificar que el nuevo username no exista (excluyendo el usuario actual)
                if (!userDetails.getUsername().equals(user.getUsername()) && 
                    userDAO.existsByUsername(userDetails.getUsername())) {
                    throw new IllegalArgumentException("Username ya existe: " + userDetails.getUsername());
                }
                user.setUsername(userDetails.getUsername());
            }
            
            if (userDetails.getEmail() != null) {
                // Verificar que el nuevo email no exista (excluyendo el usuario actual)
                if (!userDetails.getEmail().equals(user.getEmail()) && 
                    userDAO.existsByEmail(userDetails.getEmail())) {
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
            
            // Actualizar usuario
            boolean updated = userDAO.updateUser(user);
            
            if (!updated) {
                throw new RuntimeException("No se pudo actualizar el usuario");
            }
            
            return user;
        } else {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
    }
    
    // Método transaccional para eliminar usuario
    @Transactional
    public boolean deleteUser(Long id) {
        // Verificar que el usuario existe
        Optional<User> user = userDAO.findById(id);
        
        if (user.isPresent()) {
            // Aquí podrías agregar lógica adicional como eliminar datos relacionados
            // Si algo falla, toda la transacción se revierte
            
            return userDAO.deleteById(id);
        } else {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
    }
    
    // Método de solo lectura para obtener usuario
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userDAO.findById(id);
    }
    
    // Método de solo lectura para obtener todos los usuarios
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
    
    // Método de solo lectura para buscar usuarios
    @Transactional(readOnly = true)
    public List<User> searchUsers(String username, String email, Boolean enabled) {
        return userQueryService.searchUsers(username, email, enabled);
    }
    
    // Método transaccional para operación compleja
    @Transactional
    public void performComplexOperation(Long userId, String newEmail) {
        // Esta es una operación compleja que involucra múltiples pasos
        // Si cualquier paso falla, toda la transacción se revierte
        
        // Paso 1: Obtener usuario
        Optional<User> userOpt = userDAO.findById(userId);
        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        
        User user = userOpt.get();
        
        // Paso 2: Verificar que el nuevo email no exista
        if (userDAO.existsByEmail(newEmail)) {
            throw new IllegalArgumentException("Email ya existe: " + newEmail);
        }
        
        // Paso 3: Actualizar email
        user.setEmail(newEmail);
        boolean updated = userDAO.updateUser(user);
        
        if (!updated) {
            throw new RuntimeException("No se pudo actualizar el email");
        }
        
        // Paso 4: Registrar cambio en log (ejemplo)
        // logUserEmailChange(userId, user.getEmail(), newEmail);
        
        // Si llegamos aquí, toda la operación fue exitosa
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
```

---

## 🧪 Testing

### Testing de JDBC Template

```java
// UserDAOTest.java - Pruebas del DAO con JDBC Template
package com.example.dao;

import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDAOTest {
    
    @Mock
    private JdbcTemplate jdbcTemplate;
    
    @InjectMocks
    private UserDAO userDAO;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEnabled(true);
    }
    
    @Test
    void createUser_ShouldCreateUserAndReturnWithId() {
        // Arrange
        when(jdbcTemplate.update(any(), any(GeneratedKeyHolder.class))).thenAnswer(invocation -> {
            GeneratedKeyHolder keyHolder = invocation.getArgument(1);
            keyHolder.getKeyList().add(Map.of("id", 1L));
            return 1;
        });
        
        // Act
        User result = userDAO.createUser(testUser);
        
        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(jdbcTemplate).update(any(), any(GeneratedKeyHolder.class));
    }
    
    @Test
    void findById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(jdbcTemplate.queryForObject(anyString(), any(RowMapper.class), eq(1L)))
                .thenReturn(testUser);
        
        // Act
        Optional<User> result = userDAO.findById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(jdbcTemplate).queryForObject(anyString(), any(RowMapper.class), eq(1L));
    }
    
    @Test
    void findById_WithInvalidId_ShouldReturnEmpty() {
        // Arrange
        when(jdbcTemplate.queryForObject(anyString(), any(RowMapper.class), eq(999L)))
                .thenThrow(new EmptyResultDataAccessException(1));
        
        // Act
        Optional<User> result = userDAO.findById(999L);
        
        // Assert
        assertFalse(result.isPresent());
    }
    
    @Test
    void findByUsername_WithValidUsername_ShouldReturnUser() {
        // Arrange
        when(jdbcTemplate.queryForObject(anyString(), any(RowMapper.class), eq("testuser")))
                .thenReturn(testUser);
        
        // Act
        Optional<User> result = userDAO.findByUsername("testuser");
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }
    
    @Test
    void findAll_ShouldReturnAllUsers() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class))).thenReturn(users);
        
        // Act
        List<User> result = userDAO.findAll();
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).getUsername());
    }
    
    @Test
    void updateUser_WithValidUser_ShouldReturnTrue() {
        // Arrange
        when(jdbcTemplate.update(anyString(), anyVararg())).thenReturn(1);
        
        // Act
        boolean result = userDAO.updateUser(testUser);
        
        // Assert
        assertTrue(result);
        verify(jdbcTemplate).update(anyString(), anyVararg());
    }
    
    @Test
    void updateUser_WithInvalidUser_ShouldReturnFalse() {
        // Arrange
        when(jdbcTemplate.update(anyString(), anyVararg())).thenReturn(0);
        
        // Act
        boolean result = userDAO.updateUser(testUser);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void deleteById_WithValidId_ShouldReturnTrue() {
        // Arrange
        when(jdbcTemplate.update(anyString(), eq(1L))).thenReturn(1);
        
        // Act
        boolean result = userDAO.deleteById(1L);
        
        // Assert
        assertTrue(result);
        verify(jdbcTemplate).update(anyString(), eq(1L));
    }
    
    @Test
    void deleteById_WithInvalidId_ShouldReturnFalse() {
        // Arrange
        when(jdbcTemplate.update(anyString(), eq(999L))).thenReturn(0);
        
        // Act
        boolean result = userDAO.deleteById(999L);
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void existsByUsername_WithExistingUsername_ShouldReturnTrue() {
        // Arrange
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("testuser")))
                .thenReturn(1);
        
        // Act
        boolean result = userDAO.existsByUsername("testuser");
        
        // Assert
        assertTrue(result);
    }
    
    @Test
    void existsByUsername_WithNonExistingUsername_ShouldReturnFalse() {
        // Arrange
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("nonexistent")))
                .thenReturn(0);
        
        // Act
        boolean result = userDAO.existsByUsername("nonexistent");
        
        // Assert
        assertFalse(result);
    }
    
    @Test
    void count_ShouldReturnTotalUsers() {
        // Arrange
        when(jdbcTemplate.queryForObject(anyString(), eq(Long.class))).thenReturn(10L);
        
        // Act
        long result = userDAO.count();
        
        // Assert
        assertEquals(10L, result);
    }
    
    @Test
    void toggleUserStatus_WithValidId_ShouldReturnTrue() {
        // Arrange
        when(jdbcTemplate.update(anyString(), any(), eq(1L))).thenReturn(1);
        
        // Act
        boolean result = userDAO.toggleUserStatus(1L);
        
        // Assert
        assertTrue(result);
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es JDBC Template y cuáles son sus ventajas?**
   - Abstracción de JDBC, manejo automático de recursos, excepciones

2. **¿Cuál es la diferencia entre JDBC y JDBC Template?**
   - JDBC: API de bajo nivel, JDBC Template: abstracción de Spring

3. **¿Qué es RowMapper en JDBC Template?**
   - Interfaz para mapear filas de ResultSet a objetos

### Preguntas Intermedias

4. **¿Cómo manejar transacciones con JDBC Template?**
   - @Transactional, DataSourceTransactionManager

5. **¿Qué son las operaciones en lote (batch)?**
   - batchUpdate, batchInsert, mejor rendimiento

6. **¿Cómo optimizar consultas con JDBC Template?**
   - PreparedStatement, índices, paginación

### Preguntas Avanzadas

7. **¿Cómo implementar consultas dinámicas?**
   - StringBuilder, parámetros dinámicos, SQL dinámico

8. **¿Qué son las excepciones específicas de JDBC Template?**
   - EmptyResultDataAccessException, DataAccessException

9. **¿Cómo manejar conexiones y pools?**
   - DataSource, HikariCP, configuración de pool

---

## 📚 Recursos Adicionales

- [Spring JDBC Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc)
- [JDBC Template Reference](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html)
- [Spring Data Access Best Practices](https://docs.spring.io/spring-framework/reference/data-access.html)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de JDBC Template! 🚀** 