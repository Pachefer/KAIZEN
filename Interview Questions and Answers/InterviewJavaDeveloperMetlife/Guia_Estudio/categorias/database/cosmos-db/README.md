# 🌌 Cosmos DB - Base de Datos NoSQL Avanzada

## 📋 Índice

1. [Configuración de Cosmos DB](#configuración-de-cosmos-db)
2. [Operaciones Básicas](#operaciones-básicas)
3. [Consultas Avanzadas](#consultas-avanzadas)
4. [Optimización](#optimización)
5. [Integración con Java](#integración-con-java)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de Cosmos DB

### Configuración de Conexión

```java
// CosmosDBConfig.java - Configuración de conexión a Cosmos DB
package com.example.config;

import com.azure.cosmos.CosmosClient;
import com.azure.cosmos.CosmosClientBuilder;
import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.CosmosDatabase;
import com.azure.cosmos.models.CosmosContainerProperties;
import com.azure.cosmos.models.CosmosDatabaseProperties;
import com.azure.cosmos.models.ThroughputProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Marca como configuración de Spring
public class CosmosDBConfig {
    
    // Propiedades de conexión inyectadas desde application.properties
    @Value("${cosmos.endpoint}") // Endpoint de Cosmos DB
    private String cosmosEndpoint; // URL del endpoint de Cosmos DB
    
    @Value("${cosmos.key}") // Clave de acceso a Cosmos DB
    private String cosmosKey; // Clave primaria o secundaria
    
    @Value("${cosmos.database}") // Nombre de la base de datos
    private String databaseName; // Nombre de la base de datos
    
    @Value("${cosmos.container}") // Nombre del contenedor
    private String containerName; // Nombre del contenedor
    
    // Bean para CosmosClient
    @Bean
    public CosmosClient cosmosClient() {
        CosmosClient client = new CosmosClientBuilder() // Crea builder para CosmosClient
                .endpoint(cosmosEndpoint) // Establece endpoint
                .key(cosmosKey) // Establece clave de acceso
                .buildClient(); // Construye el cliente
        
        // RESULTADO ESPERADO: Cliente Cosmos DB configurado y listo para usar
        return client; // Retorna cliente configurado
    }
    
    // Bean para CosmosDatabase
    @Bean
    public CosmosDatabase cosmosDatabase(CosmosClient client) {
        // Crea o obtiene la base de datos
        CosmosDatabase database = client.getDatabase(databaseName); // Obtiene referencia a la base de datos
        
        // Verifica si la base de datos existe, si no la crea
        try {
            database.read(); // Intenta leer la base de datos
        } catch (Exception e) {
            // Si no existe, la crea
            CosmosDatabaseProperties databaseProperties = new CosmosDatabaseProperties(databaseName); // Crea propiedades
            database = client.createDatabase(databaseProperties); // Crea la base de datos
            
            // RESULTADO ESPERADO: Base de datos creada si no existía
        }
        
        // RESULTADO ESPERADO: Referencia a la base de datos existente o recién creada
        return database; // Retorna referencia a la base de datos
    }
    
    // Bean para CosmosContainer
    @Bean
    public CosmosContainer cosmosContainer(CosmosDatabase database) {
        // Crea o obtiene el contenedor
        CosmosContainer container = database.getContainer(containerName); // Obtiene referencia al contenedor
        
        // Verifica si el contenedor existe, si no lo crea
        try {
            container.read(); // Intenta leer el contenedor
        } catch (Exception e) {
            // Si no existe, lo crea
            CosmosContainerProperties containerProperties = new CosmosContainerProperties(containerName, "/id"); // Crea propiedades con partition key
            ThroughputProperties throughputProperties = ThroughputProperties.createAutoscaledThroughput(400); // Configura throughput autoscalado
            
            container = database.createContainer(containerProperties, throughputProperties); // Crea el contenedor
            
            // RESULTADO ESPERADO: Contenedor creado si no existía
        }
        
        // RESULTADO ESPERADO: Referencia al contenedor existente o recién creado
        return container; // Retorna referencia al contenedor
    }
    
    // Método para probar conexión
    public boolean testConnection(CosmosClient client) {
        try {
            // Intenta leer información de la cuenta
            client.readAccount(); // Lee información de la cuenta de Cosmos DB
            
            // RESULTADO ESPERADO: true si la conexión es exitosa
            return true; // Retorna true si la conexión es exitosa
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error conectando a Cosmos DB: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
}

// application.properties - Configuración de Cosmos DB
/*
# Configuración de Cosmos DB
cosmos.endpoint=https://your-cosmos-account.documents.azure.com:443/
cosmos.key=your-cosmos-db-key
cosmos.database=TestDatabase
cosmos.container=Users

# Configuración de Spring Data Cosmos
spring.cloud.azure.cosmos.endpoint=${cosmos.endpoint}
spring.cloud.azure.cosmos.key=${cosmos.key}
spring.cloud.azure.cosmos.database=${cosmos.database}
spring.cloud.azure.cosmos.populate-query-metrics=true
*/
```

---

## 🔄 Operaciones Básicas

### Modelo de Datos

```java
// User.java - Modelo de usuario para Cosmos DB
package com.example.model;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Container(containerName = "Users") // Especifica nombre del contenedor
public class User {
    
    @JsonProperty("id") // Mapea a campo id en JSON
    private String id; // ID único del documento
    
    @JsonProperty("username") // Mapea a campo username en JSON
    private String username; // Nombre de usuario
    
    @JsonProperty("email") // Mapea a campo email en JSON
    private String email; // Email del usuario
    
    @JsonProperty("password") // Mapea a campo password en JSON
    private String password; // Contraseña hasheada
    
    @JsonProperty("firstName") // Mapea a campo firstName en JSON
    private String firstName; // Nombre del usuario
    
    @JsonProperty("lastName") // Mapea a campo lastName en JSON
    private String lastName; // Apellido del usuario
    
    @JsonProperty("enabled") // Mapea a campo enabled en JSON
    private boolean enabled; // Estado habilitado
    
    @JsonProperty("createdAt") // Mapea a campo createdAt en JSON
    private LocalDateTime createdAt; // Fecha de creación
    
    @JsonProperty("updatedAt") // Mapea a campo updatedAt en JSON
    private LocalDateTime updatedAt; // Fecha de actualización
    
    @JsonProperty("_etag") // Mapea a campo _etag para control de concurrencia
    private String etag; // ETag para control de concurrencia optimista
    
    // Constructor por defecto requerido por Cosmos DB
    public User() {
        // RESULTADO ESPERADO: Instancia de User creada con valores por defecto
    }
    
    // Constructor con parámetros
    public User(String username, String email, String password) {
        this.id = java.util.UUID.randomUUID().toString(); // Genera ID único
        this.username = username; // Establece username
        this.email = email; // Establece email
        this.password = password; // Establece password
        this.enabled = true; // Habilita por defecto
        this.createdAt = LocalDateTime.now(); // Establece fecha de creación
        this.updatedAt = LocalDateTime.now(); // Establece fecha de actualización
        
        // RESULTADO ESPERADO: Instancia de User creada con todos los campos inicializados
    }
    
    // Getters y Setters
    public String getId() { return id; } // Retorna ID
    public void setId(String id) { this.id = id; } // Establece ID
    
    public String getUsername() { return username; } // Retorna username
    public void setUsername(String username) { this.username = username; } // Establece username
    
    public String getEmail() { return email; } // Retorna email
    public void setEmail(String email) { this.email = email; } // Establece email
    
    public String getPassword() { return password; } // Retorna password
    public void setPassword(String password) { this.password = password; } // Establece password
    
    public String getFirstName() { return firstName; } // Retorna firstName
    public void setFirstName(String firstName) { this.firstName = firstName; } // Establece firstName
    
    public String getLastName() { return lastName; } // Retorna lastName
    public void setLastName(String lastName) { this.lastName = lastName; } // Establece lastName
    
    public boolean isEnabled() { return enabled; } // Retorna enabled
    public void setEnabled(boolean enabled) { this.enabled = enabled; } // Establece enabled
    
    public LocalDateTime getCreatedAt() { return createdAt; } // Retorna createdAt
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; } // Establece createdAt
    
    public LocalDateTime getUpdatedAt() { return updatedAt; } // Retorna updatedAt
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; } // Establece updatedAt
    
    public String getEtag() { return etag; } // Retorna etag
    public void setEtag(String etag) { this.etag = etag; } // Establece etag
}
```

### Operaciones CRUD Básicas

```java
// UserRepository.java - Repositorio para Cosmos DB
package com.example.repository;

import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.models.CosmosItemRequestOptions;
import com.azure.cosmos.models.CosmosItemResponse;
import com.azure.cosmos.models.CosmosQueryRequestOptions;
import com.azure.cosmos.models.PartitionKey;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository // Marca como repositorio de Spring
public class UserRepository {
    
    private final CosmosContainer container; // Contenedor de Cosmos DB
    
    @Autowired
    public UserRepository(CosmosContainer container) {
        this.container = container; // Inyecta contenedor
    }
    
    // Crear usuario
    public User createUser(User user) {
        // Establece fechas si no están configuradas
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now()); // Establece fecha de creación
        }
        if (user.getUpdatedAt() == null) {
            user.setUpdatedAt(LocalDateTime.now()); // Establece fecha de actualización
        }
        
        // Crea opciones de request
        CosmosItemRequestOptions requestOptions = new CosmosItemRequestOptions(); // Crea opciones de request
        
        // Crea el item en Cosmos DB
        CosmosItemResponse<User> response = container.createItem(user, new PartitionKey(user.getId()), requestOptions); // Crea item
        
        // Obtiene el item creado
        User createdUser = response.getItem(); // Obtiene item de la respuesta
        
        // RESULTADO ESPERADO: Usuario creado en Cosmos DB con ID y ETag asignados
        return createdUser; // Retorna usuario creado
    }
    
    // Buscar usuario por ID
    public Optional<User> findById(String id) {
        try {
            // Busca el item por ID
            CosmosItemResponse<User> response = container.readItem(id, new PartitionKey(id), User.class); // Lee item por ID
            
            // Obtiene el item encontrado
            User user = response.getItem(); // Obtiene item de la respuesta
            
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
        // Query SQL para buscar por username
        String query = "SELECT * FROM c WHERE c.username = @username"; // Query SQL con parámetro
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Obtiene el primer resultado
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Usuario encontrado o null si no existe
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0)); // Retorna Optional con usuario o empty
    }
    
    // Obtener todos los usuarios
    public List<User> findAll() {
        // Query SQL para obtener todos los usuarios
        String query = "SELECT * FROM c ORDER BY c.createdAt"; // Query SQL para obtener todos
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Convierte resultados a lista
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Lista con todos los usuarios ordenados por fecha de creación
        return users; // Retorna lista de usuarios
    }
    
    // Actualizar usuario
    public Optional<User> updateUser(User user) {
        try {
            // Actualiza fecha de modificación
            user.setUpdatedAt(LocalDateTime.now()); // Establece fecha de actualización
            
            // Crea opciones de request con ETag para control de concurrencia
            CosmosItemRequestOptions requestOptions = new CosmosItemRequestOptions(); // Crea opciones de request
            if (user.getEtag() != null) {
                requestOptions.setIfMatchETag(user.getEtag()); // Establece ETag para control de concurrencia
            }
            
            // Reemplaza el item en Cosmos DB
            CosmosItemResponse<User> response = container.replaceItem(user, user.getId(), new PartitionKey(user.getId()), requestOptions); // Reemplaza item
            
            // Obtiene el item actualizado
            User updatedUser = response.getItem(); // Obtiene item de la respuesta
            
            // RESULTADO ESPERADO: Usuario actualizado con nuevo ETag
            return Optional.of(updatedUser); // Retorna Optional con usuario actualizado
            
        } catch (Exception e) {
            // Maneja errores de actualización
            System.err.println("Error actualizando usuario: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Optional vacío si hay error
            return Optional.empty(); // Retorna Optional vacío
        }
    }
    
    // Eliminar usuario
    public boolean deleteById(String id) {
        try {
            // Crea opciones de request
            CosmosItemRequestOptions requestOptions = new CosmosItemRequestOptions(); // Crea opciones de request
            
            // Elimina el item de Cosmos DB
            container.deleteItem(id, new PartitionKey(id), requestOptions); // Elimina item
            
            // RESULTADO ESPERADO: true si se eliminó correctamente
            return true; // Retorna true si se eliminó
            
        } catch (Exception e) {
            // Maneja errores de eliminación
            System.err.println("Error eliminando usuario: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: false si hay error
            return false; // Retorna false en caso de error
        }
    }
    
    // Búsqueda con paginación
    public List<User> findWithPagination(int page, int size) {
        // Query SQL con paginación
        String query = "SELECT * FROM c ORDER BY c.createdAt OFFSET @offset LIMIT @limit"; // Query SQL con paginación
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query con parámetros
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Convierte resultados a lista
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Lista de usuarios de la página especificada
        return users; // Retorna lista paginada de usuarios
    }
}
```

---

## 🔍 Consultas Avanzadas

### Consultas con Agregaciones y Joins

```java
// UserQueryService.java - Servicio de consultas avanzadas para Cosmos DB
package com.example.service;

import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.models.CosmosQueryRequestOptions;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service // Marca como servicio de Spring
public class UserQueryService {
    
    private final CosmosContainer container; // Contenedor de Cosmos DB
    
    @Autowired
    public UserQueryService(CosmosContainer container) {
        this.container = container; // Inyecta contenedor
    }
    
    // Consulta con agregaciones para estadísticas
    public Map<String, Object> getUserStatistics() {
        // Query SQL con agregaciones
        String query = "SELECT " +
                      "COUNT(1) as totalUsers, " +
                      "COUNT(c.enabled) as activeUsers, " +
                      "AVG(CASE WHEN c.enabled = true THEN 1 ELSE 0 END) as activationRate " +
                      "FROM c"; // Query SQL con agregaciones
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<Map> results = container.queryItems(query, queryOptions, Map.class); // Ejecuta query
        
        // Obtiene el primer resultado
        Map<String, Object> stats = new HashMap<>(); // Map para almacenar estadísticas
        results.forEach(stats::putAll); // Agrega resultados al map
        
        // RESULTADO ESPERADO: Map con estadísticas de usuarios
        return stats; // Retorna estadísticas como Map
    }
    
    // Consulta con búsqueda por texto
    public List<User> searchUsers(String searchTerm) {
        // Query SQL con búsqueda por texto
        String query = "SELECT * FROM c " +
                      "WHERE CONTAINS(c.username, @searchTerm, true) " +
                      "OR CONTAINS(c.email, @searchTerm, true) " +
                      "OR CONTAINS(c.firstName, @searchTerm, true) " +
                      "OR CONTAINS(c.lastName, @searchTerm, true) " +
                      "ORDER BY c.username"; // Query SQL con búsqueda por texto
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Convierte resultados a lista
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Lista de usuarios que coinciden con el término de búsqueda
        return users; // Retorna lista de usuarios encontrados
    }
    
    // Consulta con filtros complejos
    public List<User> getUsersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        // Query SQL con filtros de fecha
        String query = "SELECT * FROM c " +
                      "WHERE c.createdAt >= @startDate AND c.createdAt <= @endDate " +
                      "ORDER BY c.createdAt DESC"; // Query SQL con filtros de fecha
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Convierte resultados a lista
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Lista de usuarios creados en el rango de fechas especificado
        return users; // Retorna lista de usuarios
    }
    
    // Consulta con funciones de ventana (Window Functions)
    public List<User> getUsersWithRanking() {
        // Query SQL con funciones de ventana
        String query = "SELECT *, " +
                      "ROW_NUMBER() OVER (ORDER BY c.createdAt) as rowNum, " +
                      "RANK() OVER (ORDER BY c.createdAt) as rankNum " +
                      "FROM c " +
                      "ORDER BY c.createdAt"; // Query SQL con funciones de ventana
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Convierte resultados a lista
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Lista de usuarios con información de ranking por fecha de creación
        return users; // Retorna lista de usuarios
    }
    
    // Consulta con subconsultas
    public List<User> getRecentActiveUsers() {
        // Query SQL con subconsulta
        String query = "SELECT * FROM c " +
                      "WHERE c.enabled = true " +
                      "AND c.createdAt IN (" +
                      "    SELECT VALUE MAX(c2.createdAt) " +
                      "    FROM c2 " +
                      "    WHERE c2.enabled = true" +
                      ") " +
                      "ORDER BY c.username"; // Query SQL con subconsulta
        
        // Crea opciones de query
        CosmosQueryRequestOptions queryOptions = new CosmosQueryRequestOptions(); // Crea opciones de query
        
        // Ejecuta query
        CosmosPagedIterable<User> results = container.queryItems(query, queryOptions, User.class); // Ejecuta query
        
        // Convierte resultados a lista
        List<User> users = new ArrayList<>(); // Lista para almacenar resultados
        results.forEach(users::add); // Agrega resultados a la lista
        
        // RESULTADO ESPERADO: Lista de usuarios activos más recientes
        return users; // Retorna lista de usuarios
    }
}
```

---

## ⚡ Optimización

### Configuración de Throughput y Particionamiento

```java
// CosmosDBOptimizationConfig.java - Configuración de optimización
package com.example.config;

import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.models.CosmosContainerProperties;
import com.azure.cosmos.models.ThroughputProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component // Marca como componente de Spring
public class CosmosDBOptimizationConfig {
    
    @Autowired
    private CosmosContainer container; // Inyecta contenedor
    
    // Configurar throughput autoscalado
    public void configureAutoscaledThroughput() {
        // Configura throughput autoscalado
        ThroughputProperties throughputProperties = ThroughputProperties.createAutoscaledThroughput(4000); // Crea throughput autoscalado
        
        // Aplica configuración al contenedor
        container.replaceThroughput(throughputProperties); // Reemplaza throughput del contenedor
        
        // RESULTADO ESPERADO: Throughput autoscalado configurado para el contenedor
    }
    
    // Configurar throughput manual
    public void configureManualThroughput(int ruPerSecond) {
        // Configura throughput manual
        ThroughputProperties throughputProperties = ThroughputProperties.createManualThroughput(ruPerSecond); // Crea throughput manual
        
        // Aplica configuración al contenedor
        container.replaceThroughput(throughputProperties); // Reemplaza throughput del contenedor
        
        // RESULTADO ESPERADO: Throughput manual configurado para el contenedor
    }
    
    // Obtener métricas de throughput
    public void getThroughputMetrics() {
        // Obtiene throughput actual
        ThroughputProperties currentThroughput = container.readThroughput(); // Lee throughput actual
        
        // Imprime métricas
        System.out.println("=== Métricas de Throughput Cosmos DB ==="); // Header del reporte
        System.out.println("RU por segundo: " + currentThroughput.getManualThroughput()); // RU por segundo
        System.out.println("Throughput máximo: " + currentThroughput.getAutoscaleMaxThroughput()); // Throughput máximo
        System.out.println("Tipo: " + (currentThroughput.getAutoscaleMaxThroughput() != null ? "Autoscalado" : "Manual")); // Tipo de throughput
        
        // RESULTADO ESPERADO: Métricas de throughput impresas en consola
    }
}
```

---

## 🧪 Testing con Cosmos DB

### Tests de Integración

```java
// UserRepositoryTest.java - Tests de integración para Cosmos DB
package com.example.repository;

import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo de Spring Boot
@ActiveProfiles("test") // Activa perfil de test
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository; // Repositorio a testear
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User("testuser", "test@example.com", "password123"); // Crea nuevo usuario
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
        User createdUser = userRepository.createUser(testUser); // Crea usuario
        
        // Assert - Verificar resultados
        assertNotNull(createdUser.getId(), "El ID no debería ser null"); // Verifica que se generó ID
        assertEquals("testuser", createdUser.getUsername(), "El username debería coincidir"); // Verifica username
        assertEquals("test@example.com", createdUser.getEmail(), "El email debería coincidir"); // Verifica email
        assertNotNull(createdUser.getEtag(), "El ETag no debería ser null"); // Verifica que se generó ETag
        
        // RESULTADO ESPERADO: Test pasa, usuario creado correctamente en Cosmos DB
    }
    
    @Test
    @DisplayName("Debería encontrar usuario por ID")
    void findById_ShouldReturnUser() {
        // Arrange - Preparar datos
        User createdUser = userRepository.createUser(testUser); // Crea usuario primero
        String userId = createdUser.getId(); // Obtiene ID del usuario creado
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userRepository.findById(userId); // Busca usuario por ID
        
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
        String nonExistentId = "non-existent-id"; // ID que no existe
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userRepository.findById(nonExistentId); // Busca usuario inexistente
        
        // Assert - Verificar resultados
        assertFalse(foundUser.isPresent(), "No debería encontrar usuario con ID inexistente"); // Verifica que no se encontró
        
        // RESULTADO ESPERADO: Test pasa, Optional.empty() retornado
    }
    
    @Test
    @DisplayName("Debería actualizar usuario correctamente")
    void updateUser_ShouldUpdateUser() {
        // Arrange - Preparar datos
        User createdUser = userRepository.createUser(testUser); // Crea usuario
        createdUser.setFirstName("Updated"); // Modifica nombre
        createdUser.setLastName("Name"); // Modifica apellido
        
        // Act - Ejecutar acción
        Optional<User> updatedUser = userRepository.updateUser(createdUser); // Actualiza usuario
        
        // Assert - Verificar resultados
        assertTrue(updatedUser.isPresent(), "El usuario debería ser actualizado"); // Verifica que se actualizó
        assertEquals("Updated", updatedUser.get().getFirstName(), "El nombre debería estar actualizado"); // Verifica nombre
        assertEquals("Name", updatedUser.get().getLastName(), "El apellido debería estar actualizado"); // Verifica apellido
        
        // RESULTADO ESPERADO: Test pasa, usuario actualizado correctamente
    }
    
    @Test
    @DisplayName("Debería eliminar usuario correctamente")
    void deleteById_ShouldDeleteUser() {
        // Arrange - Preparar datos
        User createdUser = userRepository.createUser(testUser); // Crea usuario
        String userId = createdUser.getId(); // Obtiene ID del usuario
        
        // Act - Ejecutar acción
        boolean deleted = userRepository.deleteById(userId); // Elimina usuario
        
        // Assert - Verificar resultados
        assertTrue(deleted, "El usuario debería ser eliminado"); // Verifica que se eliminó
        
        // Verificación adicional
        Optional<User> foundUser = userRepository.findById(userId); // Busca usuario eliminado
        assertFalse(foundUser.isPresent(), "El usuario no debería existir después de eliminar"); // Verifica que no existe
        
        // RESULTADO ESPERADO: Test pasa, usuario eliminado correctamente
    }
    
    @Test
    @DisplayName("Debería obtener usuarios con paginación")
    void findWithPagination_ShouldReturnPaginatedResults() {
        // Arrange - Preparar datos
        for (int i = 1; i <= 15; i++) { // Crea 15 usuarios
            User user = new User("user" + i, "user" + i + "@test.com", "password" + i); // Crea nuevo usuario
            user.setEnabled(true); // Habilita usuario
            userRepository.createUser(user); // Crea usuario
        }
        
        // Act - Ejecutar acción
        List<User> page1 = userRepository.findWithPagination(0, 10); // Primera página (10 elementos)
        List<User> page2 = userRepository.findWithPagination(1, 10); // Segunda página (5 elementos)
        
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

1. **¿Qué es Cosmos DB y cuáles son sus características principales?**
   - Base de datos NoSQL distribuida globalmente, múltiples modelos de datos, consistencia configurable

2. **¿Cuál es la diferencia entre Cosmos DB y MongoDB?**
   - Cosmos DB: Microsoft, distribución global, MongoDB: NoSQL puro, más flexible

3. **¿Qué son los Request Units (RU) en Cosmos DB?**
   - Unidad de medida para throughput, combina CPU, memoria y operaciones I/O

### Preguntas Intermedias

4. **¿Cómo optimizar consultas en Cosmos DB?**
   - Índices, partition keys, queries eficientes, throughput apropiado

5. **¿Qué son los partition keys en Cosmos DB?**
   - Claves para distribuir datos, escalabilidad horizontal, performance de queries

6. **¿Cómo manejar consistencia en Cosmos DB?**
   - Niveles de consistencia, trade-offs entre consistencia y performance

### Preguntas Avanzadas

7. **¿Cómo implementar distribución global en Cosmos DB?**
   - Multi-region writes, conflict resolution, latencia optimizada

8. **¿Qué son los stored procedures en Cosmos DB?**
   - JavaScript server-side, transacciones ACID, lógica de negocio

9. **¿Cómo monitorear performance en Cosmos DB?**
   - Métricas de RU, latencia, throughput, Azure Monitor

---

## 📚 Recursos Adicionales

- [Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Cosmos DB Performance Tips](https://docs.microsoft.com/en-us/azure/cosmos-db/performance-tips)
- [Cosmos DB SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-query-getting-started)
- [Cosmos DB Best Practices](https://docs.microsoft.com/en-us/azure/cosmos-db/best-practices)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Cosmos DB! 🚀** 