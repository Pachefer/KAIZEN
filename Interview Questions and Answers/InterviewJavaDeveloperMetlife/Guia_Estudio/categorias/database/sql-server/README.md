# 🗄️ SQL Server - Base de Datos Microsoft Avanzada

## 📋 Índice

1. [Configuración de SQL Server](#configuración-de-sql-server)
2. [Operaciones Básicas](#operaciones-básicas)
3. [Consultas Avanzadas](#consultas-avanzadas)
4. [Optimización](#optimización)
5. [Integración con Java](#integración-con-java)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de SQL Server

### Configuración de Conexión

```java
// SQLServerConfig.java - Configuración de conexión a SQL Server
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
public class SQLServerConfig {
    
    // Propiedades de conexión inyectadas desde application.properties
    @Value("${sqlserver.url}") // URL de conexión a SQL Server
    private String sqlServerUrl; // Ejemplo: jdbc:sqlserver://localhost:1433;databaseName=TestDB
    
    @Value("${sqlserver.username}") // Usuario de SQL Server
    private String sqlServerUsername; // Usuario con permisos en la base de datos
    
    @Value("${sqlserver.password}") // Contraseña de SQL Server
    private String sqlServerPassword; // Contraseña del usuario
    
    @Value("${sqlserver.driver}") // Driver de SQL Server
    private String sqlServerDriver; // com.microsoft.sqlserver.jdbc.SQLServerDriver
    
    // Bean para DataSource de SQL Server
    @Bean
    public DataSource sqlServerDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource(); // Crea DataSource
        
        // Configura propiedades de conexión
        dataSource.setDriverClassName(sqlServerDriver); // Establece driver de SQL Server
        dataSource.setUrl(sqlServerUrl); // Establece URL de conexión
        dataSource.setUsername(sqlServerUsername); // Establece usuario
        dataSource.setPassword(sqlServerPassword); // Establece contraseña
        
        // RESULTADO ESPERADO: DataSource configurado para conexión a SQL Server
        return dataSource; // Retorna DataSource configurado
    }
    
    // Método para probar conexión
    public boolean testConnection() {
        try (Connection connection = DriverManager.getConnection(sqlServerUrl, sqlServerUsername, sqlServerPassword)) {
            // Intenta establecer conexión
            boolean isValid = connection.isValid(5); // Verifica que la conexión sea válida (timeout 5 segundos)
            
            // RESULTADO ESPERADO: true si la conexión es exitosa, false si falla
            return isValid; // Retorna estado de la conexión
            
        } catch (SQLException e) {
            // Maneja errores de conexión
            System.err.println("Error conectando a SQL Server: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para obtener información de la base de datos
    public String getDatabaseInfo() {
        try (Connection connection = DriverManager.getConnection(sqlServerUrl, sqlServerUsername, sqlServerPassword)) {
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
            System.err.println("Error obteniendo información de SQL Server: " + e.getMessage());
            
            // RESULTADO ESPERADO: Mensaje de error si no se puede obtener información
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
}

// application.properties - Configuración de SQL Server
/*
# Configuración de SQL Server
sqlserver.url=jdbc:sqlserver://localhost:1433;databaseName=TestDB;encrypt=true;trustServerCertificate=true
sqlserver.username=sa
sqlserver.password=YourStrong@Passw0rd
sqlserver.driver=com.microsoft.sqlserver.jdbc.SQLServerDriver

# Configuración de pool de conexiones
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# Configuración de JPA para SQL Server
spring.jpa.database-platform=org.hibernate.dialect.SQLServer2019Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
*/
```

---

## 🔄 Operaciones Básicas

### Creación de Tablas

```sql
-- Crear tabla de usuarios con características avanzadas de SQL Server
CREATE TABLE Users (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY, -- ID autoincremental
    Username NVARCHAR(50) NOT NULL UNIQUE, -- Username único, no nulo (NVARCHAR para Unicode)
    Email NVARCHAR(100) NOT NULL UNIQUE, -- Email único, no nulo
    Password NVARCHAR(255) NOT NULL, -- Contraseña hasheada
    FirstName NVARCHAR(50), -- Nombre opcional
    LastName NVARCHAR(50), -- Apellido opcional
    Enabled BIT DEFAULT 1, -- Estado habilitado por defecto (BIT = boolean)
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(), -- Timestamp de creación automático (UTC)
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(), -- Timestamp de actualización
    Version INT DEFAULT 1 -- Versión para control de concurrencia optimista
);

-- RESULTADO ESPERADO: Tabla Users creada con todas las columnas y restricciones

-- Crear índices para optimizar consultas
CREATE INDEX IX_Users_Username ON Users(Username); -- Índice en username para búsquedas rápidas
CREATE INDEX IX_Users_Email ON Users(Email); -- Índice en email para búsquedas rápidas
CREATE INDEX IX_Users_Enabled ON Users(Enabled); -- Índice en enabled para filtros

-- RESULTADO ESPERADO: Índices creados para mejorar performance de consultas

-- Crear tabla de roles con relación muchos a muchos
CREATE TABLE Roles (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- RESULTADO ESPERADO: Tabla Roles creada para gestión de roles

-- Tabla de relación usuario-rol
CREATE TABLE UserRoles (
    UserId BIGINT NOT NULL,
    RoleId BIGINT NOT NULL,
    AssignedAt DATETIME2 DEFAULT GETUTCDATE(),
    PRIMARY KEY (UserId, RoleId), -- Clave primaria compuesta
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE, -- FK con cascade delete
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE -- FK con cascade delete
);

-- RESULTADO ESPERADO: Tabla de relación creada con FKs y cascade delete

-- Crear trigger para actualizar UpdatedAt automáticamente
CREATE TRIGGER TR_Users_UpdateTimestamp
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users 
    SET UpdatedAt = GETUTCDATE()
    FROM Users u
    INNER JOIN inserted i ON u.Id = i.Id;
END;

-- RESULTADO ESPERADO: Trigger creado para actualizar automáticamente UpdatedAt
```

### Operaciones CRUD Básicas

```java
// UserDAO.java - Data Access Object para SQL Server
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
    
    private final JdbcTemplate jdbcTemplate; // Template JDBC para SQL Server
    
    // RowMapper personalizado para mapear resultados a objetos User
    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User(); // Crea nueva instancia de User
        
        // Mapea columnas de la base de datos a propiedades del objeto
        user.setId(rs.getLong("Id")); // Mapea Id (case sensitive en SQL Server)
        user.setUsername(rs.getString("Username")); // Mapea Username
        user.setEmail(rs.getString("Email")); // Mapea Email
        user.setPassword(rs.getString("Password")); // Mapea Password
        user.setFirstName(rs.getString("FirstName")); // Mapea FirstName
        user.setLastName(rs.getString("LastName")); // Mapea LastName
        user.setEnabled(rs.getBoolean("Enabled")); // Mapea Enabled (BIT se mapea a boolean)
        
        // Mapea timestamps
        Timestamp createdAt = rs.getTimestamp("CreatedAt"); // Obtiene timestamp de creación
        if (createdAt != null) {
            user.setCreatedAt(createdAt.toLocalDateTime()); // Convierte a LocalDateTime
        }
        
        Timestamp updatedAt = rs.getTimestamp("UpdatedAt"); // Obtiene timestamp de actualización
        if (updatedAt != null) {
            user.setUpdatedAt(updatedAt.toLocalDateTime()); // Convierte a LocalDateTime
        }
        
        user.setVersion(rs.getInt("Version")); // Mapea versión
        
        // RESULTADO ESPERADO: Objeto User completamente mapeado desde la base de datos
        return user; // Retorna objeto User mapeado
    };
    
    @Autowired
    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate; // Inyecta JdbcTemplate
    }
    
    // Crear usuario
    public User createUser(User user) {
        String sql = "INSERT INTO Users (Username, Email, Password, FirstName, LastName, Enabled) " +
                    "OUTPUT INSERTED.Id " +
                    "VALUES (?, ?, ?, ?, ?, ?)"; // SQL para insertar usuario con OUTPUT para obtener ID
        
        KeyHolder keyHolder = new GeneratedKeyHolder(); // Holder para obtener ID generado
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS); // Prepara statement con retorno de keys
            ps.setString(1, user.getUsername()); // Establece Username
            ps.setString(2, user.getEmail()); // Establece Email
            ps.setString(3, user.getPassword()); // Establece Password
            ps.setString(4, user.getFirstName()); // Establece FirstName
            ps.setString(5, user.getLastName()); // Establece LastName
            ps.setBoolean(6, user.isEnabled()); // Establece Enabled
            
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
        String sql = "SELECT * FROM Users WHERE Id = ?"; // SQL para buscar por ID
        
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
        String sql = "SELECT * FROM Users WHERE Username = ?"; // SQL para buscar por Username
        
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, username); // Ejecuta query
            
            // RESULTADO ESPERADO: Usuario encontrado o null si no existe
            return Optional.ofNullable(user); // Retorna Optional con usuario o empty
            
        } catch (Exception e) {
            // Maneja caso cuando no se encuentra usuario
            System.err.println("Usuario no encontrado con Username: " + username); // Log del error
            
            // RESULTADO ESPERADO: Optional vacío si no se encuentra usuario
            return Optional.empty(); // Retorna Optional vacío
        }
    }
    
    // Obtener todos los usuarios
    public List<User> findAll() {
        String sql = "SELECT * FROM Users ORDER BY Id"; // SQL para obtener todos los usuarios
        
        List<User> users = jdbcTemplate.query(sql, userRowMapper); // Ejecuta query
        
        // RESULTADO ESPERADO: Lista con todos los usuarios ordenados por ID
        return users; // Retorna lista de usuarios
    }
    
    // Actualizar usuario
    public boolean updateUser(User user) {
        String sql = "UPDATE Users SET Username = ?, Email = ?, Password = ?, " +
                    "FirstName = ?, LastName = ?, Enabled = ?, " +
                    "Version = Version + 1 " +
                    "WHERE Id = ? AND Version = ?"; // SQL para actualizar con control de concurrencia
        
        int rowsAffected = jdbcTemplate.update(sql, // Ejecuta update
            user.getUsername(), // Establece Username
            user.getEmail(), // Establece Email
            user.getPassword(), // Establece Password
            user.getFirstName(), // Establece FirstName
            user.getLastName(), // Establece LastName
            user.isEnabled(), // Establece Enabled
            user.getId(), // WHERE Id
            user.getVersion() // WHERE Version (control de concurrencia)
        );
        
        // RESULTADO ESPERADO: 1 si se actualizó correctamente, 0 si no se encontró o versión incorrecta
        return rowsAffected > 0; // Retorna true si se actualizó al menos una fila
    }
    
    // Eliminar usuario
    public boolean deleteById(Long id) {
        String sql = "DELETE FROM Users WHERE Id = ?"; // SQL para eliminar usuario
        
        int rowsAffected = jdbcTemplate.update(sql, id); // Ejecuta delete
        
        // RESULTADO ESPERADO: 1 si se eliminó correctamente, 0 si no se encontró
        return rowsAffected > 0; // Retorna true si se eliminó al menos una fila
    }
    
    // Búsqueda con paginación usando OFFSET/FETCH
    public List<User> findWithPagination(int page, int size) {
        int offset = page * size; // Calcula offset para paginación
        
        String sql = "SELECT * FROM Users " +
                    "ORDER BY Id " +
                    "OFFSET ? ROWS " +
                    "FETCH NEXT ? ROWS ONLY"; // SQL con paginación usando OFFSET/FETCH (SQL Server 2012+)
        
        List<User> users = jdbcTemplate.query(sql, userRowMapper, offset, size); // Ejecuta query con parámetros
        
        // RESULTADO ESPERADO: Lista de usuarios de la página especificada
        return users; // Retorna lista paginada de usuarios
    }
}
```

---

## 🔍 Consultas Avanzadas

### Consultas con Joins y Agregaciones

```java
// UserQueryService.java - Servicio de consultas avanzadas para SQL Server
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
    
    private final JdbcTemplate jdbcTemplate; // Template JDBC para SQL Server
    
    // RowMapper para resultados de consultas complejas
    private final RowMapper<UserRole> userRoleRowMapper = (rs, rowNum) -> {
        UserRole userRole = new UserRole(); // Crea nueva instancia de UserRole
        
        // Mapea datos del usuario
        userRole.setUserId(rs.getLong("UserId")); // Mapea UserId
        userRole.setUsername(rs.getString("Username")); // Mapea Username
        userRole.setEmail(rs.getString("Email")); // Mapea Email
        userRole.setRoleId(rs.getLong("RoleId")); // Mapea RoleId
        userRole.setRoleName(rs.getString("RoleName")); // Mapea RoleName
        userRole.setAssignedAt(rs.getTimestamp("AssignedAt").toLocalDateTime()); // Mapea AssignedAt
        
        // RESULTADO ESPERADO: Objeto UserRole completamente mapeado
        return userRole; // Retorna objeto UserRole mapeado
    };
    
    @Autowired
    public UserQueryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate; // Inyecta JdbcTemplate
    }
    
    // Consulta con JOIN para obtener usuarios y sus roles
    public List<UserRole> getUsersWithRoles() {
        String sql = "SELECT u.Id as UserId, u.Username, u.Email, " +
                    "r.Id as RoleId, r.Name as RoleName, ur.AssignedAt " +
                    "FROM Users u " +
                    "LEFT JOIN UserRoles ur ON u.Id = ur.UserId " +
                    "LEFT JOIN Roles r ON ur.RoleId = r.Id " +
                    "ORDER BY u.Id, r.Name"; // SQL con LEFT JOIN para obtener usuarios y roles
        
        List<UserRole> userRoles = jdbcTemplate.query(sql, userRoleRowMapper); // Ejecuta query
        
        // RESULTADO ESPERADO: Lista de usuarios con sus roles asignados (incluye usuarios sin roles)
        return userRoles; // Retorna lista de UserRole
    }
    
    // Consulta con agregaciones para estadísticas
    public Map<String, Object> getUserStatistics() {
        String sql = "SELECT " +
                    "COUNT(*) as TotalUsers, " +
                    "COUNT(CASE WHEN Enabled = 1 THEN 1 END) as ActiveUsers, " +
                    "COUNT(CASE WHEN Enabled = 0 THEN 1 END) as InactiveUsers, " +
                    "AVG(CAST(Enabled as FLOAT)) as ActivationRate " +
                    "FROM Users"; // SQL con agregaciones para estadísticas (BIT se convierte a FLOAT para AVG)
        
        Map<String, Object> stats = jdbcTemplate.queryForMap(sql); // Ejecuta query y obtiene Map
        
        // RESULTADO ESPERADO: Map con estadísticas de usuarios
        return stats; // Retorna estadísticas como Map
    }
    
    // Consulta con subconsulta para usuarios con múltiples roles
    public List<User> getUsersWithMultipleRoles() {
        String sql = "SELECT u.* FROM Users u " +
                    "WHERE u.Id IN (" +
                    "    SELECT UserId FROM UserRoles " +
                    "    GROUP BY UserId " +
                    "    HAVING COUNT(*) > 1" +
                    ") " +
                    "ORDER BY u.Username"; // SQL con subconsulta para usuarios con múltiples roles
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("Id")); // Mapea Id
            user.setUsername(rs.getString("Username")); // Mapea Username
            user.setEmail(rs.getString("Email")); // Mapea Email
            user.setEnabled(rs.getBoolean("Enabled")); // Mapea Enabled
            
            // RESULTADO ESPERADO: Objeto User mapeado para consulta específica
            return user; // Retorna objeto User mapeado
        });
        
        // RESULTADO ESPERADO: Lista de usuarios que tienen más de un rol asignado
        return users; // Retorna lista de usuarios
    }
    
    // Consulta con Common Table Expression (CTE)
    public List<User> getUsersWithRoleCount() {
        String sql = "WITH UserRoleCounts AS (" +
                    "    SELECT UserId, COUNT(*) as RoleCount " +
                    "    FROM UserRoles " +
                    "    GROUP BY UserId" +
                    ") " +
                    "SELECT u.*, ISNULL(urc.RoleCount, 0) as RoleCount " +
                    "FROM Users u " +
                    "LEFT JOIN UserRoleCounts urc ON u.Id = urc.UserId " +
                    "ORDER BY urc.RoleCount DESC, u.Username"; // SQL con CTE para contar roles por usuario
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("Id")); // Mapea Id
            user.setUsername(rs.getString("Username")); // Mapea Username
            user.setEmail(rs.getString("Email")); // Mapea Email
            user.setEnabled(rs.getBoolean("Enabled")); // Mapea Enabled
            
            // RESULTADO ESPERADO: Objeto User mapeado con información de roles
            return user; // Retorna objeto User mapeado
        });
        
        // RESULTADO ESPERADO: Lista de usuarios ordenados por cantidad de roles
        return users; // Retorna lista de usuarios
    }
    
    // Consulta con búsqueda por texto usando LIKE
    public List<User> searchUsers(String searchTerm) {
        String sql = "SELECT * FROM Users " +
                    "WHERE Username LIKE ? OR Email LIKE ? OR FirstName LIKE ? OR LastName LIKE ? " +
                    "ORDER BY Username"; // SQL con búsqueda por texto usando LIKE
        
        String likePattern = "%" + searchTerm + "%"; // Crea patrón de búsqueda
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("Id")); // Mapea Id
            user.setUsername(rs.getString("Username")); // Mapea Username
            user.setEmail(rs.getString("Email")); // Mapea Email
            user.setFirstName(rs.getString("FirstName")); // Mapea FirstName
            user.setLastName(rs.getString("LastName")); // Mapea LastName
            user.setEnabled(rs.getBoolean("Enabled")); // Mapea Enabled
            
            // RESULTADO ESPERADO: Objeto User mapeado para búsqueda
            return user; // Retorna objeto User mapeado
        }, likePattern, likePattern, likePattern, likePattern); // Pasa patrón de búsqueda para cada campo
        
        // RESULTADO ESPERADO: Lista de usuarios que coinciden con el término de búsqueda
        return users; // Retorna lista de usuarios encontrados
    }
    
    // Consulta con funciones de ventana (Window Functions)
    public List<User> getUsersWithRanking() {
        String sql = "SELECT *, " +
                    "ROW_NUMBER() OVER (ORDER BY CreatedAt) as RowNum, " +
                    "RANK() OVER (ORDER BY CreatedAt) as RankNum, " +
                    "DENSE_RANK() OVER (ORDER BY CreatedAt) as DenseRankNum " +
                    "FROM Users " +
                    "ORDER BY CreatedAt"; // SQL con funciones de ventana para ranking
        
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User(); // Crea nueva instancia de User
            user.setId(rs.getLong("Id")); // Mapea Id
            user.setUsername(rs.getString("Username")); // Mapea Username
            user.setEmail(rs.getString("Email")); // Mapea Email
            user.setEnabled(rs.getBoolean("Enabled")); // Mapea Enabled
            
            // RESULTADO ESPERADO: Objeto User mapeado con información de ranking
            return user; // Retorna objeto User mapeado
        });
        
        // RESULTADO ESPERADO: Lista de usuarios con información de ranking por fecha de creación
        return users; // Retorna lista de usuarios
    }
}
```

---

## ⚡ Optimización

### Índices y Estadísticas

```sql
-- Crear índices compuestos para optimizar consultas complejas
CREATE INDEX IX_Users_Name_Email ON Users(FirstName, LastName, Email); -- Índice compuesto para búsquedas por nombre y email
CREATE INDEX IX_Users_Status_Date ON Users(Enabled, CreatedAt); -- Índice compuesto para filtros por estado y fecha

-- RESULTADO ESPERADO: Índices compuestos creados para mejorar performance de consultas complejas

-- Crear índices filtrados para consultas específicas
CREATE INDEX IX_Users_Active_Only ON Users(Username, Email) WHERE Enabled = 1; -- Índice filtrado solo para usuarios activos
CREATE INDEX IX_Users_Recent ON Users(CreatedAt) WHERE CreatedAt >= DATEADD(YEAR, -1, GETUTCDATE()); -- Índice filtrado para usuarios recientes

-- RESULTADO ESPERADO: Índices filtrados creados para optimizar consultas específicas

-- Actualizar estadísticas de la base de datos
UPDATE STATISTICS Users WITH FULLSCAN; -- Actualiza estadísticas de la tabla Users
UPDATE STATISTICS Roles WITH FULLSCAN; -- Actualiza estadísticas de la tabla Roles
UPDATE STATISTICS UserRoles WITH FULLSCAN; -- Actualiza estadísticas de la tabla UserRoles

-- RESULTADO ESPERADO: Estadísticas actualizadas para optimización del optimizador de consultas

-- Crear vistas indexadas para consultas frecuentes
CREATE VIEW vw_UserSummary WITH SCHEMABINDING AS
SELECT 
    u.Id,
    u.Username,
    u.Email,
    u.Enabled,
    COUNT(ur.RoleId) as RoleCount,
    STRING_AGG(r.Name, ', ') WITHIN GROUP (ORDER BY r.Name) as RoleNames
FROM dbo.Users u
LEFT JOIN dbo.UserRoles ur ON u.Id = ur.UserId
LEFT JOIN dbo.Roles r ON ur.RoleId = r.Id
GROUP BY u.Id, u.Username, u.Email, u.Enabled; -- Vista indexada para resumen de usuarios

-- RESULTADO ESPERADO: Vista indexada creada para consultas de resumen rápidas

-- Crear índice único para la vista indexada
CREATE UNIQUE CLUSTERED INDEX IX_vw_UserSummary_Id ON vw_UserSummary(Id); -- Índice único para la vista

-- RESULTADO ESPERADO: Índice único creado para optimizar consultas en la vista indexada
```

### Configuración de Pool de Conexiones

```java
// SQLServerConnectionPoolConfig.java - Configuración optimizada de pool de conexiones
package com.example.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration // Marca como configuración de Spring
public class SQLServerConnectionPoolConfig {
    
    @Value("${sqlserver.url}")
    private String sqlServerUrl; // URL de conexión a SQL Server
    
    @Value("${sqlserver.username}")
    private String sqlServerUsername; // Usuario de SQL Server
    
    @Value("${sqlserver.password}")
    private String sqlServerPassword; // Contraseña de SQL Server
    
    @Value("${sqlserver.driver}")
    private String sqlServerDriver; // Driver de SQL Server
    
    // Bean para DataSource optimizado con HikariCP
    @Bean
    public DataSource sqlServerDataSource() {
        HikariConfig config = new HikariConfig(); // Crea configuración de HikariCP
        
        // Configuración básica de conexión
        config.setDriverClassName(sqlServerDriver); // Establece driver de SQL Server
        config.setJdbcUrl(sqlServerUrl); // Establece URL de conexión
        config.setUsername(sqlServerUsername); // Establece usuario
        config.setPassword(sqlServerPassword); // Establece contraseña
        
        // Configuración de pool optimizada para SQL Server
        config.setMaximumPoolSize(20); // Máximo 20 conexiones en el pool
        config.setMinimumIdle(5); // Mínimo 5 conexiones idle
        config.setConnectionTimeout(30000); // Timeout de conexión 30 segundos
        config.setIdleTimeout(600000); // Timeout de idle 10 minutos
        config.setMaxLifetime(1800000); // Vida máxima de conexión 30 minutos
        
        // Configuración específica de SQL Server
        config.addDataSourceProperty("applicationName", "SpringApp"); // Nombre de la aplicación
        config.addDataSourceProperty("autoCommit", "true"); // Auto-commit habilitado
        config.addDataSourceProperty("readOnly", "false"); // Modo lectura/escritura
        config.addDataSourceProperty("encrypt", "true"); // Encriptación habilitada
        config.addDataSourceProperty("trustServerCertificate", "true"); // Confiar en certificado del servidor
        
        // Configuración de validación de conexiones
        config.setConnectionTestQuery("SELECT 1"); // Query de prueba para SQL Server
        config.setValidationTimeout(5000); // Timeout de validación 5 segundos
        
        // Configuración de logging
        config.setPoolName("SQLServerHikariPool"); // Nombre del pool para logging
        config.setLeakDetectionThreshold(60000); // Detección de leaks después de 1 minuto
        
        // RESULTADO ESPERADO: DataSource configurado con pool optimizado para SQL Server
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
            System.out.println("=== Pool de Conexiones SQL Server ==="); // Header del reporte
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

## 🧪 Testing con SQL Server

### Tests de Integración

```java
// UserDAOTest.java - Tests de integración para SQL Server
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
        String sql = "SELECT COUNT(*) FROM Users WHERE Id = ?"; // SQL para verificar existencia
        int count = jdbcTemplate.queryForObject(sql, Integer.class, createdUser.getId()); // Ejecuta query
        
        assertEquals(1, count, "Debería existir exactamente un usuario con ese ID"); // Verifica que existe en BD
        
        // RESULTADO ESPERADO: Test pasa, usuario creado correctamente en SQL Server
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
    @DisplayName("Debería obtener usuarios con paginación")
    void findWithPagination_ShouldReturnPaginatedResults() {
        // Arrange - Preparar datos
        for (int i = 1; i <= 15; i++) { // Crea 15 usuarios
            User user = new User(); // Crea nuevo usuario
            user.setUsername("user" + i); // Establece username único
            user.setEmail("user" + i + "@test.com"); // Establece email único
            user.setPassword("password" + i); // Establece contraseña
            user.setEnabled(true); // Habilita usuario
            userDAO.createUser(user); // Crea usuario
        }
        
        // Act - Ejecutar acción
        List<User> page1 = userDAO.findWithPagination(0, 10); // Primera página (10 elementos)
        List<User> page2 = userDAO.findWithPagination(1, 10); // Segunda página (5 elementos)
        
        // Assert - Verificar resultados
        assertEquals(10, page1.size(), "La primera página debería tener 10 usuarios"); // Verifica tamaño página 1
        assertEquals(5, page2.size(), "La segunda página debería tener 5 usuarios"); // Verifica tamaño página 2
        
        // Verificar que no hay duplicados entre páginas
        boolean hasDuplicates = page1.stream().anyMatch(user1 -> 
            page2.stream().anyMatch(user2 -> user1.getId().equals(user2.getId()))); // Verifica duplicados
        assertFalse(hasDuplicates, "No debería haber duplicados entre páginas"); // Verifica que no hay duplicados
        
        // RESULTADO ESPERADO: Test pasa, paginación funciona correctamente
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es SQL Server y cuáles son sus características principales?**
   - Base de datos relacional de Microsoft, ACID, escalabilidad, integración con .NET

2. **¿Cuál es la diferencia entre SQL Server y MySQL?**
   - SQL Server: Microsoft, mejor en Windows, MySQL: Oracle, multiplataforma

3. **¿Qué son los schemas en SQL Server?**
   - Contenedores lógicos para organizar objetos de base de datos

### Preguntas Intermedias

4. **¿Cómo optimizar consultas en SQL Server?**
   - Índices, estadísticas, execution plans, configuración de memoria

5. **¿Qué son los lock types en SQL Server?**
   - Shared, Exclusive, Update, Intent, Schema locks para concurrencia

6. **¿Cómo manejar transacciones en SQL Server?**
   - BEGIN TRANSACTION, COMMIT, ROLLBACK, savepoints, isolation levels

### Preguntas Avanzadas

7. **¿Cómo implementar alta disponibilidad en SQL Server?**
   - Always On, clustering, mirroring, log shipping, backup/recovery

8. **¿Qué son los stored procedures en SQL Server?**
   - Procedimientos almacenados, T-SQL, optimización de performance

9. **¿Cómo monitorear performance en SQL Server?**
   - DMVs, Extended Events, SQL Server Profiler, Query Store

---

## 📚 Recursos Adicionales

- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [SQL Server Performance Tuning](https://docs.microsoft.com/en-us/sql/relational-databases/performance/)
- [T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/language-reference)
- [SQL Server Best Practices](https://docs.microsoft.com/en-us/sql/sql-server/best-practices-for-sql-server)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de SQL Server! 🚀** 