# 🗄️ DB2 - Base de Datos Empresarial Avanzada

## 📋 Índice

1. [Configuración de DB2](#configuración-de-db2)
2. [Operaciones Básicas](#operaciones-básicas)
3. [Consultas Avanzadas](#consultas-avanzadas)
4. [Optimización](#optimización)
5. [Integración con Java](#integración-con-java)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de DB2

### Configuración de Conexión

```java
// DB2Config.java - Configuración de conexión a DB2
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration // Marca como configuración de Spring
public class DB2Config {
    
    // Propiedades de conexión inyectadas desde application.properties
    @Value("${db2.url}") // URL de conexión a DB2
    private String db2Url; // Ejemplo: jdbc:db2://localhost:50000/SAMPLE
    
    @Value("${db2.username}") // Usuario de DB2
    private String db2Username; // Usuario con permisos en la base de datos
    
    @Value("${db2.password}") // Contraseña de DB2
    private String db2Password; // Contraseña del usuario
    
    @Value("${db2.driver}") // Driver de DB2
    private String db2Driver; // com.ibm.db2.jcc.DB2Driver
    
    // Bean para DataSource de DB2
    @Bean
    public DataSource db2DataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource(); // Crea DataSource
        
        // Configura propiedades de conexión
        dataSource.setDriverClassName(db2Driver); // Establece driver de DB2
        dataSource.setUrl(db2Url); // Establece URL de conexión
        dataSource.setUsername(db2Username); // Establece usuario
        dataSource.setPassword(db2Password); // Establece contraseña
        
        // RESULTADO ESPERADO: DataSource configurado para conexión a DB2
        return dataSource; // Retorna DataSource configurado
    }
    
    // Método para probar conexión
    public boolean testConnection() {
        try (Connection connection = DriverManager.getConnection(db2Url, db2Username, db2Password)) {
            // Intenta establecer conexión
            boolean isValid = connection.isValid(5); // Verifica que la conexión sea válida (timeout 5 segundos)
            
            // RESULTADO ESPERADO: true si la conexión es exitosa, false si falla
            return isValid; // Retorna estado de la conexión
            
        } catch (SQLException e) {
            // Maneja errores de conexión
            System.err.println("Error conectando a DB2: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para obtener información de la base de datos
    public String getDatabaseInfo() {
        try (Connection connection = DriverManager.getConnection(db2Url, db2Username, db2Password)) {
            // Obtiene metadatos de la base de datos
            String dbName = connection.getCatalog(); // Obtiene nombre de la base de datos
            String dbVersion = connection.getMetaData().getDatabaseProductVersion(); // Obtiene versión
            String dbProduct = connection.getMetaData().getDatabaseProductName(); // Obtiene nombre del producto
            
            // Construye información de la base de datos
            String info = String.format("DB: %s, Version: %s, Product: %s", dbName, dbVersion, dbProduct);
            
            // RESULTADO ESPERADO: String con información de la base de datos
            return info; // Retorna información formateada
            
        } catch (SQLException e) {
            // Maneja errores al obtener información
            System.err.println("Error obteniendo información de DB2: " + e.getMessage());
            
            // RESULTADO ESPERADO: Mensaje de error si no se puede obtener información
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
}

// application.properties - Configuración de DB2
/*
# Configuración de DB2
db2.url=jdbc:db2://localhost:50000/SAMPLE
db2.username=db2admin
db2.password=password123
db2.driver=com.ibm.db2.jcc.DB2Driver

# Configuración de pool de conexiones
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# Configuración de JPA para DB2
spring.jpa.database-platform=org.hibernate.dialect.DB2Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
*/
```

---

## 🔄 Operaciones Básicas

### Creación de Tablas

```sql
-- Crear tabla de usuarios con características avanzadas de DB2
CREATE TABLE USERS (
    ID BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1) PRIMARY KEY, -- ID autoincremental
    USERNAME VARCHAR(50) NOT NULL UNIQUE, -- Username único, no nulo
    EMAIL VARCHAR(100) NOT NULL UNIQUE, -- Email único, no nulo
    PASSWORD VARCHAR(255) NOT NULL, -- Contraseña hasheada
    FIRST_NAME VARCHAR(50), -- Nombre opcional
    LAST_NAME VARCHAR(50), -- Apellido opcional
    ENABLED BOOLEAN DEFAULT TRUE, -- Estado habilitado por defecto
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP, -- Timestamp de creación automático
    UPDATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP, -- Timestamp de actualización
    VERSION INTEGER DEFAULT 1 -- Versión para control de concurrencia optimista
);

-- RESULTADO ESPERADO: Tabla USERS creada con todas las columnas y restricciones

-- Crear índices para optimizar consultas
CREATE INDEX IDX_USERS_USERNAME ON USERS(USERNAME); -- Índice en username para búsquedas rápidas
CREATE INDEX IDX_USERS_EMAIL ON USERS(EMAIL); -- Índice en email para búsquedas rápidas
CREATE INDEX IDX_USERS_ENABLED ON USERS(ENABLED); -- Índice en enabled para filtros

-- RESULTADO ESPERADO: Índices creados para mejorar performance de consultas

-- Crear tabla de roles con relación muchos a muchos
CREATE TABLE ROLES (
    ID BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1) PRIMARY KEY,
    NAME VARCHAR(50) NOT NULL UNIQUE,
    DESCRIPTION VARCHAR(200),
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

-- RESULTADO ESPERADO: Tabla ROLES creada para gestión de roles

-- Tabla de relación usuario-rol
CREATE TABLE USER_ROLES (
    USER_ID BIGINT NOT NULL,
    ROLE_ID BIGINT NOT NULL,
    ASSIGNED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP,
    PRIMARY KEY (USER_ID, ROLE_ID), -- Clave primaria compuesta
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID) ON DELETE CASCADE, -- FK con cascade delete
    FOREIGN KEY (ROLE_ID) REFERENCES ROLES(ID) ON DELETE CASCADE -- FK con cascade delete
);

-- RESULTADO ESPERADO: Tabla de relación creada con FKs y cascade delete
```

### Operaciones CRUD Básicas

```java
// UserDAO.java - Data Access Object para DB2
package com.example.dao;

import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository // Marca como repositorio de Spring
public class UserDAO {
    
    private final JdbcTemplate jdbcTemplate; // Template JDBC para DB2
    
    // RowMapper personalizado para mapear resultados a objetos User
    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User(); // Crea nueva instancia de User
        
        // Mapea columnas de la base de datos a propiedades del objeto
        user.setId(rs.getLong("ID")); // Mapea ID
        user.setUsername(rs.getString("USERNAME")); // Mapea username
        user.setEmail(rs.getString("EMAIL")); // Mapea email
        user.setPassword(rs.getString("PASSWORD")); // Mapea password
        user.setFirstName(rs.getString("FIRST_NAME")); // Mapea firstName
        user.setLastName(rs.getString("LAST_NAME")); // Mapea lastName
        user.setEnabled(rs.getBoolean("ENABLED")); // Mapea enabled
        
        // Mapea timestamps
        Timestamp createdAt = rs.getTimestamp("CREATED_AT"); // Obtiene timestamp de creación
        if (createdAt != null) {
            user.setCreatedAt(createdAt.toLocalDateTime()); // Convierte a LocalDateTime
        }
        
        Timestamp updatedAt = rs.getTimestamp("UPDATED_AT"); // Obtiene timestamp de actualización
        if (updatedAt != null) {
            user.setUpdatedAt(updatedAt.toLocalDateTime()); // Convierte a LocalDateTime
        }
        
        user.setVersion(rs.getInt("VERSION")); // Mapea versión
        
        // RESULTADO ESPERADO: Objeto User completamente mapeado desde la base de datos
        return user; // Retorna objeto User mapeado
    };
    
    @Autowired
    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate; // Inyecta JdbcTemplate
    }
    
    // Crear usuario
    public User createUser(User user) {
        String sql = "INSERT INTO USERS (USERNAME, EMAIL, PASSWORD, FIRST_NAME, LAST_NAME, ENABLED) " +
                    "VALUES (?, ?, ?, ?, ?, ?)"; // SQL para insertar usuario
        
        KeyHolder keyHolder = new GeneratedKeyHolder(); // Holder para obtener ID generado
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); // Prepara statement con retorno de keys
            ps.setString(1, user.getUsername()); // Establece username
            ps.setString(2, user.getEmail()); // Establece email
            ps.setString(3, user.getPassword()); // Establece password
            ps.setString(4, user.getFirstName()); // Establece firstName
            ps.setString(5, user.getLastName()); // Establece lastName
            ps.setBoolean(6, user.isEnabled()); // Establece enabled
            
            // RESULTADO ESPERADO: PreparedStatement configurado con todos los parámetros
            return ps; // Retorna PreparedStatement configurado
        }, keyHolder); // Ejecuta update con keyHolder
        
        // Obtiene ID generado automáticamente
        Long generatedId = keyHolder.getKey().longValue(); // Extrae ID generado
        user.setId(generatedId); // Establece ID en el objeto user
        
        // RESULTADO ESPERADO: Usuario creado con ID generado automáticamente
        return user; // Retorna usuario con ID asignado
    }
    
    // Buscar usuario por ID
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM USERS WHERE ID = ?"; // SQL para buscar por ID
        
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id); // Ejecuta query
            
            // RESULTADO ESPERADO: Usuario encontrado o null si no existe
            return Optional.ofNullable(user); // Retorna Optional con usuario o empty
            
        } catch (Exception e) {
            // Maneja caso cuando no se encuentra usuario
            System.err.println("Usuario no encontrado con ID: " + id); // Log del error
            
            // RESULTADO ESPERADO: Optional vacío si no se encuentra usuario
            return Optional.empty(); // Retorna Optional vacío
        }
    }
    
    // Buscar usuario por username
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM USERS WHERE USERNAME = ?"; // SQL para buscar por username
        
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, username); // Ejecuta query
            
            // RESULTADO ESPERADO: Usuario encontrado o null si no existe
            return Optional.ofNullable(user); // Retorna Optional con usuario o empty
            
        } catch (Exception e) {
            // Maneja caso cuando no se encuentra usuario
            System.err.println("Usuario no encontrado con username: " + username); // Log del error
            
            // RESULTADO ESPERADO: Optional vacío si no se encuentra usuario
            return Optional.empty(); // Retorna Optional vacío
        }
    }
    
    // Obtener todos los usuarios
    public List<User> findAll() {
        String sql = "SELECT * FROM USERS ORDER BY ID"; // SQL para obtener todos los usuarios
        
        List<User> users = jdbcTemplate.query(sql, userRowMapper); // Ejecuta query
        
        // RESULTADO ESPERADO: Lista con todos los usuarios ordenados por ID
        return users; // Retorna lista de usuarios
    }
    
    // Actualizar usuario
    public boolean updateUser(User user) {
        String sql = "UPDATE USERS SET USERNAME = ?, EMAIL = ?, PASSWORD = ?, " +
                    "FIRST_NAME = ?, LAST_NAME = ?, ENABLED = ?, " +
                    "UPDATED_AT = CURRENT TIMESTAMP, VERSION = VERSION + 1 " +
                    "WHERE ID = ? AND VERSION = ?"; // SQL para actualizar con control de concurrencia
        
        int rowsAffected = jdbcTemplate.update(sql, // Ejecuta update
            user.getUsername(), // Establece username
            user.getEmail(), // Establece email
            user.getPassword(), // Establece password
            user.getFirstName(), // Establece firstName
            user.getLastName(), // Establece lastName
            user.isEnabled(), // Establece enabled
            user.getId(), // WHERE ID
            user.getVersion() // WHERE VERSION (control de concurrencia)
        );
        
        // RESULTADO ESPERADO: 1 si se actualizó correctamente, 0 si no se encontró o versión incorrecta
        return rowsAffected > 0; // Retorna true si se actualizó al menos una fila
    }
    
    // Eliminar usuario
    public boolean deleteById(Long id) {
        String sql = "DELETE FROM USERS WHERE ID = ?"; // SQL para eliminar usuario
        
        int rowsAffected = jdbcTemplate.update(sql, id); // Ejecuta delete
        
        // RESULTADO ESPERADO: 1 si se eliminó correctamente, 0 si no se encontró
        return rowsAffected > 0; // Retorna true si se eliminó al menos una fila
    }
}
```

---

## 🔍 Consultas Avanzadas

### Consultas con Joins y Agregaciones

```java
// UserQueryService.java - Servicio de consultas avanzadas
package com.example.service;

import com.example.model.User;
import com.example.model.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service // Marca como servicio de Spring
public class UserQueryService {
    
    private final JdbcTemplate jdbcTemplate; // Template JDBC para DB2
    
    // RowMapper para resultados de consultas complejas
    private final RowMapper<UserRole> userRoleRowMapper = (rs, rowNum) -> {
        UserRole userRole = new UserRole(); // Crea nueva instancia de UserRole
        
        // Mapea datos del usuario
        userRole.setUserId(rs.getLong("USER_ID")); // Mapea USER_ID
        userRole.setUsername(rs.getString("USERNAME")); // Mapea USERNAME
        userRole.setEmail(rs.getString("EMAIL")); // Mapea EMAIL
        userRole.setRoleId(rs.getLong("ROLE_ID")); // Mapea ROLE_ID
        userRole.setRoleName(rs.getString("ROLE_NAME")); // Mapea ROLE_NAME
        userRole.setAssignedAt(rs.getTimestamp("ASSIGNED_AT").toLocalDateTime()); // Mapea ASSIGNED_AT
        
        // RESULTADO ESPERADO: Objeto UserRole completamente mapeado
        return userRole; // Retorna objeto UserRole mapeado
    };
    
    @Autowired
    public UserQueryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate; // Inyecta JdbcTemplate
    }
    
    // Consulta con JOIN para obtener usuarios y sus roles
    public List<UserRole> getUsersWithRoles() {
        String sql = "SELECT u.ID as USER_ID, u.USERNAME, u.EMAIL, " +
                    "r.ID as ROLE_ID, r.NAME as ROLE_NAME, ur.ASSIGNED_AT " +
                    "FROM USERS u " +
                    "LEFT JOIN USER_ROLES ur ON u.ID = ur.USER_ID " +
                    "LEFT JOIN ROLES r ON ur.ROLE_ID = r.ID " +
                    "ORDER BY u.ID, r.NAME"; // SQL con LEFT JOIN para obtener usuarios y roles
        
        List<UserRole> userRoles = jdbcTemplate.query(sql, userRoleRowMapper); // Ejecuta query
        
        // RESULTADO ESPERADO: Lista de usuarios con sus roles asignados (incluye usuarios sin roles)
        return userRoles; // Retorna lista de UserRole
    }
    
    // Consulta con agregaciones para estadísticas
    public Map<String, Object> getUserStatistics() {
        String sql = "SELECT " +
                    "COUNT(*) as TOTAL_USERS, " +
                    "COUNT(CASE WHEN ENABLED = TRUE THEN 1 END) as ACTIVE_USERS, " +
                    "COUNT(CASE WHEN ENABLED = FALSE THEN 1 END) as INACTIVE_USERS, " +
                    "AVG(CASE WHEN ENABLED = TRUE THEN 1 ELSE 0 END) as ACTIVATION_RATE " +
                    "FROM USERS"; // SQL con agregaciones para estadísticas
        
        Map<String, Object> stats = jdbcTemplate.queryForMap(sql); // Ejecuta query y obtiene Map
        
        // RESULTADO ESPERADO: Map con estadísticas de usuarios
        return stats; // Retorna estadísticas como Map
    }
    
    // Consulta con subconsulta para usuarios con múltiples roles
    public List<User> getUsersWithMultipleRoles() {
        String sql = "SELECT u.* FROM USERS u " +
                    "WHERE u.ID IN (" +
                    "    SELECT USER_ID FROM USER_ROLES " +
                    "    GROUP BY USER_ID " +
                    "    HAVING COUNT(*) > 1" +
                    ") " +
                    "ORDER BY u.USERNAME"; // SQL con subconsulta para usuarios con múltiples roles
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("ID")); // Mapea ID
            user.setUsername(rs.getString("USERNAME")); // Mapea USERNAME
            user.setEmail(rs.getString("EMAIL")); // Mapea EMAIL
            user.setEnabled(rs.getBoolean("ENABLED")); // Mapea ENABLED
            
            // RESULTADO ESPERADO: Objeto User mapeado para consulta específica
            return user; // Retorna objeto User mapeado
        });
        
        // RESULTADO ESPERADO: Lista de usuarios que tienen más de un rol asignado
        return users; // Retorna lista de usuarios
    }
    
    // Consulta con paginación
    public List<User> getUsersWithPagination(int page, int size) {
        int offset = page * size; // Calcula offset para paginación
        
        String sql = "SELECT * FROM USERS " +
                    "ORDER BY ID " +
                    "FETCH FIRST ? ROWS ONLY " +
                    "OFFSET ? ROWS"; // SQL con paginación usando FETCH FIRST y OFFSET
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("ID")); // Mapea ID
            user.setUsername(rs.getString("USERNAME")); // Mapea USERNAME
            user.setEmail(rs.getString("EMAIL")); // Mapea EMAIL
            user.setEnabled(rs.getBoolean("ENABLED")); // Mapea ENABLED
            
            // RESULTADO ESPERADO: Objeto User mapeado para paginación
            return user; // Retorna objeto User mapeado
        }, size, offset); // Pasa parámetros de paginación
        
        // RESULTADO ESPERADO: Lista de usuarios de la página especificada
        return users; // Retorna lista paginada de usuarios
    }
    
    // Consulta con búsqueda por texto
    public List<User> searchUsers(String searchTerm) {
        String sql = "SELECT * FROM USERS " +
                    "WHERE USERNAME LIKE ? OR EMAIL LIKE ? OR FIRST_NAME LIKE ? OR LAST_NAME LIKE ? " +
                    "ORDER BY USERNAME"; // SQL con búsqueda por texto usando LIKE
        
        String likePattern = "%" + searchTerm + "%"; // Crea patrón de búsqueda
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("ID")); // Mapea ID
            user.setUsername(rs.getString("USERNAME")); // Mapea USERNAME
            user.setEmail(rs.getString("EMAIL")); // Mapea EMAIL
            user.setFirstName(rs.getString("FIRST_NAME")); // Mapea FIRST_NAME
            user.setLastName(rs.getString("LAST_NAME")); // Mapea LAST_NAME
            user.setEnabled(rs.getBoolean("ENABLED")); // Mapea ENABLED
            
            // RESULTADO ESPERADO: Objeto User mapeado para búsqueda
            return user; // Retorna objeto User mapeado
        }, likePattern, likePattern, likePattern, likePattern); // Pasa patrón de búsqueda para cada campo
        
        // RESULTADO ESPERADO: Lista de usuarios que coinciden con el término de búsqueda
        return users; // Retorna lista de usuarios encontrados
    }
}
```

---

## ⚡ Optimización

### Índices y Estadísticas

```sql
-- Crear índices compuestos para optimizar consultas complejas
CREATE INDEX IDX_USERS_NAME_EMAIL ON USERS(FIRST_NAME, LAST_NAME, EMAIL); -- Índice compuesto para búsquedas por nombre y email
CREATE INDEX IDX_USERS_STATUS_DATE ON USERS(ENABLED, CREATED_AT); -- Índice compuesto para filtros por estado y fecha

-- RESULTADO ESPERADO: Índices compuestos creados para mejorar performance de consultas complejas

-- Actualizar estadísticas de la base de datos
RUNSTATS ON TABLE USERS WITH DISTRIBUTION AND DETAILED INDEXES ALL; -- Actualiza estadísticas de la tabla USERS
RUNSTATS ON TABLE ROLES WITH DISTRIBUTION AND DETAILED INDEXES ALL; -- Actualiza estadísticas de la tabla ROLES
RUNSTATS ON TABLE USER_ROLES WITH DISTRIBUTION AND DETAILED INDEXES ALL; -- Actualiza estadísticas de la tabla USER_ROLES

-- RESULTADO ESPERADO: Estadísticas actualizadas para optimización del optimizador de consultas

-- Crear vistas materializadas para consultas frecuentes
CREATE TABLE USER_SUMMARY AS (
    SELECT 
        u.ID,
        u.USERNAME,
        u.EMAIL,
        u.ENABLED,
        COUNT(ur.ROLE_ID) as ROLE_COUNT,
        LISTAGG(r.NAME, ', ') WITHIN GROUP (ORDER BY r.NAME) as ROLE_NAMES
    FROM USERS u
    LEFT JOIN USER_ROLES ur ON u.ID = ur.USER_ID
    LEFT JOIN ROLES r ON ur.ROLE_ID = r.ID
    GROUP BY u.ID, u.USERNAME, u.EMAIL, u.ENABLED
) DATA INITIALLY DEFERRED REFRESH DEFERRED; -- Vista materializada para resumen de usuarios

-- RESULTADO ESPERADO: Vista materializada creada para consultas de resumen rápidas

-- Crear índices para la vista materializada
CREATE INDEX IDX_USER_SUMMARY_USERNAME ON USER_SUMMARY(USERNAME); -- Índice en username
CREATE INDEX IDX_USER_SUMMARY_ENABLED ON USER_SUMMARY(ENABLED); -- Índice en enabled

-- RESULTADO ESPERADO: Índices creados para optimizar consultas en la vista materializada
```

### Configuración de Pool de Conexiones

```java
// DB2ConnectionPoolConfig.java - Configuración optimizada de pool de conexiones
package com.example.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration // Marca como configuración de Spring
public class DB2ConnectionPoolConfig {
    
    @Value("${db2.url}")
    private String db2Url; // URL de conexión a DB2
    
    @Value("${db2.username}")
    private String db2Username; // Usuario de DB2
    
    @Value("${db2.password}")
    private String db2Password; // Contraseña de DB2
    
    @Value("${db2.driver}")
    private String db2Driver; // Driver de DB2
    
    // Bean para DataSource optimizado con HikariCP
    @Bean
    public DataSource db2DataSource() {
        HikariConfig config = new HikariConfig(); // Crea configuración de HikariCP
        
        // Configuración básica de conexión
        config.setDriverClassName(db2Driver); // Establece driver de DB2
        config.setJdbcUrl(db2Url); // Establece URL de conexión
        config.setUsername(db2Username); // Establece usuario
        config.setPassword(db2Password); // Establece contraseña
        
        // Configuración de pool optimizada para DB2
        config.setMaximumPoolSize(20); // Máximo 20 conexiones en el pool
        config.setMinimumIdle(5); // Mínimo 5 conexiones idle
        config.setConnectionTimeout(30000); // Timeout de conexión 30 segundos
        config.setIdleTimeout(600000); // Timeout de idle 10 minutos
        config.setMaxLifetime(1800000); // Vida máxima de conexión 30 minutos
        
        // Configuración específica de DB2
        config.addDataSourceProperty("currentSchema", "DB2ADMIN"); // Establece schema por defecto
        config.addDataSourceProperty("autoCommit", "true"); // Auto-commit habilitado
        config.addDataSourceProperty("readOnly", "false"); // Modo lectura/escritura
        
        // Configuración de validación de conexiones
        config.setConnectionTestQuery("SELECT 1 FROM SYSIBM.SYSDUMMY1"); // Query de prueba para DB2
        config.setValidationTimeout(5000); // Timeout de validación 5 segundos
        
        // Configuración de logging
        config.setPoolName("DB2HikariPool"); // Nombre del pool para logging
        config.setLeakDetectionThreshold(60000); // Detección de leaks después de 1 minuto
        
        // RESULTADO ESPERADO: DataSource configurado con pool optimizado para DB2
        return new HikariDataSource(config); // Retorna DataSource con HikariCP
    }
    
    // Método para monitorear el pool de conexiones
    public void monitorConnectionPool(DataSource dataSource) {
        if (dataSource instanceof HikariDataSource) {
            HikariDataSource hikariDS = (HikariDataSource) dataSource; // Cast a HikariDataSource
            
            // Obtiene métricas del pool
            int totalConnections = hikariDS.getHikariPoolMXBean().getTotalConnections(); // Total de conexiones
            int activeConnections = hikariDS.getHikariPoolMXBean().getActiveConnections(); // Conexiones activas
            int idleConnections = hikariDS.getHikariPoolMXBean().getIdleConnections(); // Conexiones idle
            
            // Imprime métricas
            System.out.println("=== Pool de Conexiones DB2 ==="); // Header del reporte
            System.out.println("Total Connections: " + totalConnections); // Total de conexiones
            System.out.println("Active Connections: " + activeConnections); // Conexiones activas
            System.out.println("Idle Connections: " + idleConnections); // Conexiones idle
            System.out.println("Utilization: " + (activeConnections * 100.0 / totalConnections) + "%"); // Porcentaje de utilización
            
            // RESULTADO ESPERADO: Métricas del pool de conexiones impresas en consola
        }
    }
}
```

---

## 🧪 Testing con DB2

### Tests de Integración

```java
// UserDAOTest.java - Tests de integración para DB2
package com.example.dao;

import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo de Spring Boot
@ActiveProfiles("test") // Activa perfil de test
@Transactional // Todas las pruebas son transaccionales
class UserDAOTest {
    
    @Autowired
    private UserDAO userDAO; // DAO a testear
    
    @Autowired
    private JdbcTemplate jdbcTemplate; // JdbcTemplate para verificaciones adicionales
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User(); // Crea nuevo usuario
        testUser.setUsername("testuser"); // Establece username
        testUser.setEmail("test@example.com"); // Establece email
        testUser.setPassword("password123"); // Establece contraseña
        testUser.setFirstName("Test"); // Establece nombre
        testUser.setLastName("User"); // Establece apellido
        testUser.setEnabled(true); // Habilita usuario
        
        // RESULTADO ESPERADO: testUser configurado correctamente
    }
    
    @Test
    @DisplayName("Debería crear usuario correctamente")
    void createUser_ShouldCreateUser() {
        // Arrange - Preparar datos
        // testUser ya está configurado en setUp()
        
        // Act - Ejecutar acción
        User createdUser = userDAO.createUser(testUser); // Crea usuario
        
        // Assert - Verificar resultados
        assertNotNull(createdUser.getId(), "El ID no debería ser null"); // Verifica que se generó ID
        assertEquals("testuser", createdUser.getUsername(), "El username debería coincidir"); // Verifica username
        assertEquals("test@example.com", createdUser.getEmail(), "El email debería coincidir"); // Verifica email
        
        // Verificación adicional con query directa
        String sql = "SELECT COUNT(*) FROM USERS WHERE ID = ?"; // SQL para verificar existencia
        int count = jdbcTemplate.queryForObject(sql, Integer.class, createdUser.getId()); // Ejecuta query
        
        assertEquals(1, count, "Debería existir exactamente un usuario con ese ID"); // Verifica que existe en BD
        
        // RESULTADO ESPERADO: Test pasa, usuario creado correctamente en DB2
    }
    
    @Test
    @DisplayName("Debería encontrar usuario por ID")
    void findById_ShouldReturnUser() {
        // Arrange - Preparar datos
        User createdUser = userDAO.createUser(testUser); // Crea usuario primero
        Long userId = createdUser.getId(); // Obtiene ID del usuario creado
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userDAO.findById(userId); // Busca usuario por ID
        
        // Assert - Verificar resultados
        assertTrue(foundUser.isPresent(), "El usuario debería ser encontrado"); // Verifica que se encontró
        assertEquals("testuser", foundUser.get().getUsername(), "El username debería coincidir"); // Verifica username
        assertEquals("test@example.com", foundUser.get().getEmail(), "El email debería coincidir"); // Verifica email
        
        // RESULTADO ESPERADO: Test pasa, usuario encontrado correctamente
    }
    
    @Test
    @DisplayName("Debería retornar empty cuando usuario no existe")
    void findById_WithNonExistentId_ShouldReturnEmpty() {
        // Arrange - Preparar datos
        Long nonExistentId = 999L; // ID que no existe
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userDAO.findById(nonExistentId); // Busca usuario inexistente
        
        // Assert - Verificar resultados
        assertFalse(foundUser.isPresent(), "No debería encontrar usuario con ID inexistente"); // Verifica que no se encontró
        
        // RESULTADO ESPERADO: Test pasa, Optional.empty() retornado
    }
    
    @Test
    @DisplayName("Debería actualizar usuario correctamente")
    void updateUser_ShouldUpdateUser() {
        // Arrange - Preparar datos
        User createdUser = userDAO.createUser(testUser); // Crea usuario
        createdUser.setFirstName("Updated"); // Modifica nombre
        createdUser.setLastName("Name"); // Modifica apellido
        
        // Act - Ejecutar acción
        boolean updated = userDAO.updateUser(createdUser); // Actualiza usuario
        
        // Assert - Verificar resultados
        assertTrue(updated, "El usuario debería ser actualizado"); // Verifica que se actualizó
        
        // Verificación adicional
        Optional<User> foundUser = userDAO.findById(createdUser.getId()); // Busca usuario actualizado
        assertTrue(foundUser.isPresent(), "El usuario debería existir después de actualizar"); // Verifica existencia
        assertEquals("Updated", foundUser.get().getFirstName(), "El nombre debería estar actualizado"); // Verifica nombre
        assertEquals("Name", foundUser.get().getLastName(), "El apellido debería estar actualizado"); // Verifica apellido
        
        // RESULTADO ESPERADO: Test pasa, usuario actualizado correctamente
    }
    
    @Test
    @DisplayName("Debería eliminar usuario correctamente")
    void deleteById_ShouldDeleteUser() {
        // Arrange - Preparar datos
        User createdUser = userDAO.createUser(testUser); // Crea usuario
        Long userId = createdUser.getId(); // Obtiene ID del usuario
        
        // Act - Ejecutar acción
        boolean deleted = userDAO.deleteById(userId); // Elimina usuario
        
        // Assert - Verificar resultados
        assertTrue(deleted, "El usuario debería ser eliminado"); // Verifica que se eliminó
        
        // Verificación adicional
        Optional<User> foundUser = userDAO.findById(userId); // Busca usuario eliminado
        assertFalse(foundUser.isPresent(), "El usuario no debería existir después de eliminar"); // Verifica que no existe
        
        // RESULTADO ESPERADO: Test pasa, usuario eliminado correctamente
    }
    
    @Test
    @DisplayName("Debería obtener todos los usuarios")
    void findAll_ShouldReturnAllUsers() {
        // Arrange - Preparar datos
        User user1 = new User("user1", "user1@test.com", "pass1"); // Crea primer usuario
        User user2 = new User("user2", "user2@test.com", "pass2"); // Crea segundo usuario
        
        userDAO.createUser(user1); // Crea primer usuario
        userDAO.createUser(user2); // Crea segundo usuario
        
        // Act - Ejecutar acción
        List<User> allUsers = userDAO.findAll(); // Obtiene todos los usuarios
        
        // Assert - Verificar resultados
        assertTrue(allUsers.size() >= 2, "Debería encontrar al menos 2 usuarios"); // Verifica cantidad mínima
        assertTrue(allUsers.stream().anyMatch(u -> "user1".equals(u.getUsername())), "Debería contener user1"); // Verifica user1
        assertTrue(allUsers.stream().anyMatch(u -> "user2".equals(u.getUsername())), "Debería contener user2"); // Verifica user2
        
        // RESULTADO ESPERADO: Test pasa, lista con todos los usuarios encontrados
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es DB2 y cuáles son sus características principales?**
   - Base de datos relacional de IBM, ACID, escalabilidad, alta disponibilidad

2. **¿Cuál es la diferencia entre DB2 y Oracle?**
   - DB2: IBM, mejor en mainframes, Oracle: mejor en sistemas distribuidos

3. **¿Qué son los tablespaces en DB2?**
   - Contenedores lógicos para almacenar datos, índices, y objetos temporales

### Preguntas Intermedias

4. **¿Cómo optimizar consultas en DB2?**
   - Índices, estadísticas, EXPLAIN, configuración de buffer pools

5. **¿Qué son los lock modes en DB2?**
   - IS, IX, S, U, X, Z - diferentes niveles de bloqueo para concurrencia

6. **¿Cómo manejar transacciones en DB2?**
   - BEGIN, COMMIT, ROLLBACK, savepoints, isolation levels

### Preguntas Avanzadas

7. **¿Cómo implementar alta disponibilidad en DB2?**
   - HADR, clustering, backup/recovery, disaster recovery

8. **¿Qué son los stored procedures en DB2?**
   - Procedimientos almacenados, SQL PL, optimización de performance

9. **¿Cómo monitorear performance en DB2?**
   - Snapshot monitor, event monitor, performance views, db2top

---

## 📚 Recursos Adicionales

- [DB2 Documentation](https://www.ibm.com/docs/en/db2)
- [DB2 Performance Tuning](https://www.ibm.com/docs/en/db2/11.5?topic=performance-tuning)
- [DB2 SQL Reference](https://www.ibm.com/docs/en/db2/11.5?topic=sql-reference)
- [DB2 Best Practices](https://www.ibm.com/docs/en/db2/11.5?topic=best-practices)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de DB2! 🚀** 