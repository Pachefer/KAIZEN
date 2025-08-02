# ☁️ Azure - Servicios en la Nube Avanzados

## 📋 Índice

1. [Configuración de Azure](#configuración-de-azure)
2. [Azure App Service](#azure-app-service)
3. [Azure SQL Database](#azure-sql-database)
4. [Azure Storage](#azure-storage)
5. [Azure Functions](#azure-functions)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de Azure

### Configuración del SDK de Azure

```java
// AzureConfig.java - Configuración de Azure SDK
package com.example.config;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Marca como configuración de Spring
public class AzureConfig {
    
    // Propiedades de Azure inyectadas desde application.properties
    @Value("${azure.keyvault.url}") // URL del Key Vault
    private String keyVaultUrl; // URL del Azure Key Vault
    
    @Value("${azure.storage.connection-string}") // Connection string de Storage
    private String storageConnectionString; // Connection string para Azure Storage
    
    @Value("${azure.storage.container-name}") // Nombre del contenedor
    private String containerName; // Nombre del contenedor de blobs
    
    // Bean para SecretClient de Azure Key Vault
    @Bean
    public SecretClient secretClient() {
        SecretClient secretClient = new SecretClientBuilder() // Crea builder para SecretClient
                .vaultUrl(keyVaultUrl) // Establece URL del Key Vault
                .credential(new DefaultAzureCredentialBuilder().build()) // Usa credenciales por defecto
                .buildClient(); // Construye el cliente
        
        // RESULTADO ESPERADO: Cliente configurado para acceder a Azure Key Vault
        return secretClient; // Retorna cliente configurado
    }
    
    // Bean para BlobServiceClient de Azure Storage
    @Bean
    public BlobServiceClient blobServiceClient() {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder() // Crea builder para BlobServiceClient
                .connectionString(storageConnectionString) // Establece connection string
                .buildClient(); // Construye el cliente
        
        // RESULTADO ESPERADO: Cliente configurado para acceder a Azure Blob Storage
        return blobServiceClient; // Retorna cliente configurado
    }
    
    // Método para probar conexión a Azure
    public boolean testAzureConnection() {
        try {
            // Intenta obtener un secreto para probar conexión
            SecretClient client = secretClient(); // Obtiene cliente de Key Vault
            client.getSecret("test-secret"); // Intenta obtener secreto de prueba
            
            // RESULTADO ESPERADO: true si la conexión es exitosa
            return true; // Retorna true si la conexión es exitosa
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error conectando a Azure: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
}

// application.properties - Configuración de Azure
/*
# Configuración de Azure
azure.keyvault.url=https://your-keyvault.vault.azure.net/
azure.storage.connection-string=DefaultEndpointsProtocol=https;AccountName=yourstorage;AccountKey=yourkey;EndpointSuffix=core.windows.net
azure.storage.container-name=mycontainer

# Configuración de Azure App Service
spring.cloud.azure.appservice.enabled=true
spring.cloud.azure.appservice.instance-id=${WEBSITE_INSTANCE_ID:local}

# Configuración de Azure SQL Database
spring.datasource.url=jdbc:sqlserver://your-server.database.windows.net:1433;database=your-database;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
*/
```

---

## 🚀 Azure App Service

### Configuración de App Service

```java
// AppServiceConfig.java - Configuración específica para Azure App Service
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Marca como configuración de Spring
public class AppServiceConfig {
    
    // Propiedades de App Service
    @Value("${azure.appservice.instance-id:local}") // ID de instancia de App Service
    private String instanceId; // ID de la instancia actual
    
    @Value("${azure.appservice.slot-name:production}") // Nombre del slot
    private String slotName; // Nombre del slot de deployment
    
    // Bean para configuración de CORS para App Service
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Mapea rutas de API
                        .allowedOrigins("*") // Permite todos los orígenes (configurar según necesidades)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                        .allowedHeaders("*") // Headers permitidos
                        .maxAge(3600); // Tiempo máximo de cache (1 hora)
                
                // RESULTADO ESPERADO: Configuración CORS aplicada a todas las rutas de API
            }
        };
    }
    
    // Método para obtener información de la instancia
    public String getInstanceInfo() {
        String info = String.format("Instance ID: %s, Slot: %s", instanceId, slotName); // Construye información
        
        // RESULTADO ESPERADO: String con información de la instancia de App Service
        return info; // Retorna información formateada
    }
    
    // Método para verificar si está ejecutándose en App Service
    public boolean isRunningInAppService() {
        // Verifica si está ejecutándose en App Service
        boolean isAppService = !"local".equals(instanceId); // Verifica si no es local
        
        // RESULTADO ESPERADO: true si está en App Service, false si es local
        return isAppService; // Retorna estado de ejecución
    }
}

// HealthCheckController.java - Controlador para health checks de App Service
package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController // Marca como controlador REST
public class HealthCheckController {
    
    @Autowired
    private AppServiceConfig appServiceConfig; // Inyecta configuración de App Service
    
    // Endpoint para health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> healthInfo = new HashMap<>(); // Crea map para información de salud
        
        // Agrega información básica
        healthInfo.put("status", "UP"); // Establece estado como UP
        healthInfo.put("timestamp", System.currentTimeMillis()); // Agrega timestamp
        healthInfo.put("instance", appServiceConfig.getInstanceInfo()); // Agrega información de instancia
        
        // Verifica conexiones críticas
        boolean databaseConnected = checkDatabaseConnection(); // Verifica conexión a base de datos
        healthInfo.put("database", databaseConnected ? "UP" : "DOWN"); // Agrega estado de BD
        
        boolean storageConnected = checkStorageConnection(); // Verifica conexión a storage
        healthInfo.put("storage", storageConnected ? "UP" : "DOWN"); // Agrega estado de storage
        
        // Determina estado general
        boolean overallHealth = databaseConnected && storageConnected; // Determina salud general
        int statusCode = overallHealth ? 200 : 503; // Código de estado HTTP
        
        // RESULTADO ESPERADO: Respuesta con información de salud de la aplicación
        return ResponseEntity.status(statusCode).body(healthInfo); // Retorna respuesta con código de estado
    }
    
    // Método para verificar conexión a base de datos
    private boolean checkDatabaseConnection() {
        try {
            // Aquí iría la lógica para verificar conexión a BD
            // Por simplicidad, retornamos true
            return true; // Simula conexión exitosa
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error verificando conexión a BD: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para verificar conexión a storage
    private boolean checkStorageConnection() {
        try {
            // Aquí iría la lógica para verificar conexión a storage
            // Por simplicidad, retornamos true
            return true; // Simula conexión exitosa
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error verificando conexión a Storage: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
}
```

---

## 🗄️ Azure SQL Database

### Configuración de Azure SQL

```java
// AzureSqlConfig.java - Configuración para Azure SQL Database
package com.example.config;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration // Marca como configuración de Spring
public class AzureSqlConfig {
    
    @Autowired
    private SecretClient secretClient; // Inyecta cliente de Key Vault
    
    // Propiedades de Azure SQL
    @Value("${azure.sql.server}") // Servidor de Azure SQL
    private String sqlServer; // Nombre del servidor SQL
    
    @Value("${azure.sql.database}") // Nombre de la base de datos
    private String database; // Nombre de la base de datos
    
    @Value("${azure.sql.username-secret}") // Nombre del secreto para username
    private String usernameSecret; // Nombre del secreto en Key Vault
    
    @Value("${azure.sql.password-secret}") // Nombre del secreto para password
    private String passwordSecret; // Nombre del secreto en Key Vault
    
    // Bean para DataSource de Azure SQL
    @Bean
    public DataSource azureSqlDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource(); // Crea DataSource
        
        // Construye URL de conexión
        String connectionUrl = String.format( // Construye URL de conexión
            "jdbc:sqlserver://%s.database.windows.net:1433;" +
            "database=%s;" +
            "encrypt=true;" +
            "trustServerCertificate=false;" +
            "hostNameInCertificate=*.database.windows.net;" +
            "loginTimeout=30;",
            sqlServer, database // Parámetros de servidor y base de datos
        );
        
        // Obtiene credenciales desde Key Vault
        String username = secretClient.getSecret(usernameSecret).getValue(); // Obtiene username
        String password = secretClient.getSecret(passwordSecret).getValue(); // Obtiene password
        
        // Configura DataSource
        dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver"); // Establece driver
        dataSource.setUrl(connectionUrl); // Establece URL de conexión
        dataSource.setUsername(username); // Establece username
        dataSource.setPassword(password); // Establece password
        
        // RESULTADO ESPERADO: DataSource configurado para Azure SQL Database
        return dataSource; // Retorna DataSource configurado
    }
    
    // Método para probar conexión a Azure SQL
    public boolean testSqlConnection() {
        try {
            // Intenta establecer conexión
            DataSource dataSource = azureSqlDataSource(); // Obtiene DataSource
            dataSource.getConnection().close(); // Establece y cierra conexión de prueba
            
            // RESULTADO ESPERADO: true si la conexión es exitosa
            return true; // Retorna true si la conexión es exitosa
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error conectando a Azure SQL: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
}

// AzureSqlService.java - Servicio para operaciones con Azure SQL
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Service // Marca como servicio de Spring
public class AzureSqlService {
    
    private final JdbcTemplate jdbcTemplate; // Template JDBC para Azure SQL
    
    @Autowired
    public AzureSqlService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource); // Inicializa JdbcTemplate
    }
    
    // Método para ejecutar consulta de prueba
    public String testQuery() {
        try {
            // Ejecuta consulta simple
            String result = jdbcTemplate.queryForObject("SELECT GETDATE() as current_time", String.class); // Consulta fecha actual
            
            // RESULTADO ESPERADO: Fecha actual del servidor SQL
            return "Conexión exitosa. Hora del servidor: " + result; // Retorna resultado formateado
            
        } catch (Exception e) {
            // Maneja errores de consulta
            System.err.println("Error ejecutando consulta: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si hay problema
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
    
    // Método para obtener estadísticas de la base de datos
    public Map<String, Object> getDatabaseStats() {
        try {
            // Consulta para obtener estadísticas
            String sql = "SELECT " +
                        "DB_NAME() as database_name, " +
                        "COUNT(*) as table_count " +
                        "FROM INFORMATION_SCHEMA.TABLES " +
                        "WHERE TABLE_TYPE = 'BASE TABLE'"; // SQL para estadísticas
            
            Map<String, Object> stats = jdbcTemplate.queryForMap(sql); // Ejecuta consulta
            
            // RESULTADO ESPERADO: Map con estadísticas de la base de datos
            return stats; // Retorna estadísticas
            
        } catch (Exception e) {
            // Maneja errores de consulta
            System.err.println("Error obteniendo estadísticas: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Map vacío si hay error
            return Map.of("error", e.getMessage()); // Retorna error en map
        }
    }
}
```

---

## 📦 Azure Storage

### Configuración de Blob Storage

```java
// AzureStorageConfig.java - Configuración para Azure Blob Storage
package com.example.config;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Marca como configuración de Spring
public class AzureStorageConfig {
    
    @Autowired
    private BlobServiceClient blobServiceClient; // Inyecta cliente de Blob Service
    
    @Value("${azure.storage.container-name}")
    private String containerName; // Nombre del contenedor
    
    // Bean para BlobContainerClient
    @Bean
    public BlobContainerClient blobContainerClient() {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName); // Obtiene cliente del contenedor
        
        // Crea el contenedor si no existe
        if (!containerClient.exists()) { // Verifica si el contenedor existe
            containerClient.create(); // Crea el contenedor
            
            // RESULTADO ESPERADO: Contenedor creado si no existía
        }
        
        // RESULTADO ESPERADO: Cliente configurado para el contenedor especificado
        return containerClient; // Retorna cliente del contenedor
    }
}

// AzureStorageService.java - Servicio para operaciones con Azure Storage
package com.example.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service // Marca como servicio de Spring
public class AzureStorageService {
    
    private final BlobContainerClient containerClient; // Cliente del contenedor
    
    @Autowired
    public AzureStorageService(BlobContainerClient containerClient) {
        this.containerClient = containerClient; // Inyecta cliente del contenedor
    }
    
    // Método para subir archivo
    public boolean uploadFile(String fileName, byte[] content) {
        try {
            // Obtiene cliente del blob
            BlobClient blobClient = containerClient.getBlobClient(fileName); // Obtiene cliente del blob
            
            // Sube el contenido
            blobClient.upload(new ByteArrayInputStream(content), content.length, true); // Sube archivo
            
            // RESULTADO ESPERADO: true si el archivo se subió correctamente
            return true; // Retorna true si se subió correctamente
            
        } catch (Exception e) {
            // Maneja errores de subida
            System.err.println("Error subiendo archivo: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de subida
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para descargar archivo
    public byte[] downloadFile(String fileName) {
        try {
            // Obtiene cliente del blob
            BlobClient blobClient = containerClient.getBlobClient(fileName); // Obtiene cliente del blob
            
            // Verifica si el blob existe
            if (!blobClient.exists()) { // Verifica si el blob existe
                throw new RuntimeException("Archivo no encontrado: " + fileName); // Lanza excepción
            }
            
            // Descarga el contenido
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream(); // Crea stream de salida
            blobClient.downloadStream(outputStream); // Descarga contenido
            
            // RESULTADO ESPERADO: Contenido del archivo como byte array
            return outputStream.toByteArray(); // Retorna contenido del archivo
            
        } catch (Exception e) {
            // Maneja errores de descarga
            System.err.println("Error descargando archivo: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: null si hay error de descarga
            return null; // Retorna null en caso de error
        }
    }
    
    // Método para eliminar archivo
    public boolean deleteFile(String fileName) {
        try {
            // Obtiene cliente del blob
            BlobClient blobClient = containerClient.getBlobClient(fileName); // Obtiene cliente del blob
            
            // Elimina el blob
            blobClient.delete(); // Elimina el blob
            
            // RESULTADO ESPERADO: true si el archivo se eliminó correctamente
            return true; // Retorna true si se eliminó correctamente
            
        } catch (Exception e) {
            // Maneja errores de eliminación
            System.err.println("Error eliminando archivo: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de eliminación
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para listar archivos
    public java.util.List<String> listFiles() {
        try {
            java.util.List<String> fileNames = new java.util.ArrayList<>(); // Lista para nombres de archivos
            
            // Itera sobre todos los blobs
            containerClient.listBlobs().forEach(blobItem -> { // Itera sobre blobs
                fileNames.add(blobItem.getName()); // Agrega nombre del archivo
            });
            
            // RESULTADO ESPERADO: Lista con nombres de todos los archivos
            return fileNames; // Retorna lista de nombres
            
        } catch (Exception e) {
            // Maneja errores de listado
            System.err.println("Error listando archivos: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: Lista vacía si hay error
            return new java.util.ArrayList<>(); // Retorna lista vacía en caso de error
        }
    }
}
```

---

## ⚡ Azure Functions

### Configuración de Azure Functions

```java
// AzureFunctionConfig.java - Configuración para Azure Functions
package com.example.config;

import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component // Marca como componente de Spring
public class AzureFunctionConfig {
    
    @Autowired
    private AzureStorageService storageService; // Inyecta servicio de storage
    
    // Función HTTP trigger
    @FunctionName("processFile")
    public Map<String, Object> processFile(
            @HttpTrigger(name = "req", methods = {"POST"}, authLevel = "anonymous") String requestBody,
            ExecutionContext context) {
        
        Map<String, Object> response = new HashMap<>(); // Crea map para respuesta
        
        try {
            // Log de la función
            context.getLogger().info("Procesando archivo: " + requestBody); // Log de información
            
            // Procesa el archivo
            String fileName = "processed_" + System.currentTimeMillis() + ".txt"; // Genera nombre de archivo
            byte[] content = requestBody.getBytes(); // Convierte request body a bytes
            
            // Sube archivo procesado
            boolean uploaded = storageService.uploadFile(fileName, content); // Sube archivo
            
            if (uploaded) { // Si se subió correctamente
                response.put("status", "success"); // Establece estado como éxito
                response.put("fileName", fileName); // Agrega nombre del archivo
                response.put("message", "Archivo procesado y subido correctamente"); // Agrega mensaje
                
                // RESULTADO ESPERADO: Respuesta de éxito con información del archivo
            } else { // Si hubo error
                response.put("status", "error"); // Establece estado como error
                response.put("message", "Error procesando archivo"); // Agrega mensaje de error
                
                // RESULTADO ESPERADO: Respuesta de error
            }
            
        } catch (Exception e) {
            // Maneja excepciones
            context.getLogger().severe("Error en función: " + e.getMessage()); // Log de error
            response.put("status", "error"); // Establece estado como error
            response.put("message", "Error: " + e.getMessage()); // Agrega mensaje de error
            
            // RESULTADO ESPERADO: Respuesta de error con detalles
        }
        
        return response; // Retorna respuesta
    }
    
    // Función para obtener estadísticas
    @FunctionName("getStats")
    public Map<String, Object> getStats(
            @HttpTrigger(name = "req", methods = {"GET"}, authLevel = "anonymous") String request,
            ExecutionContext context) {
        
        Map<String, Object> response = new HashMap<>(); // Crea map para respuesta
        
        try {
            // Log de la función
            context.getLogger().info("Obteniendo estadísticas"); // Log de información
            
            // Obtiene lista de archivos
            java.util.List<String> files = storageService.listFiles(); // Lista archivos
            
            // Construye estadísticas
            response.put("status", "success"); // Establece estado como éxito
            response.put("totalFiles", files.size()); // Agrega total de archivos
            response.put("files", files); // Agrega lista de archivos
            response.put("timestamp", System.currentTimeMillis()); // Agrega timestamp
            
            // RESULTADO ESPERADO: Respuesta con estadísticas de archivos
            
        } catch (Exception e) {
            // Maneja excepciones
            context.getLogger().severe("Error obteniendo estadísticas: " + e.getMessage()); // Log de error
            response.put("status", "error"); // Establece estado como error
            response.put("message", "Error: " + e.getMessage()); // Agrega mensaje de error
            
            // RESULTADO ESPERADO: Respuesta de error con detalles
        }
        
        return response; // Retorna respuesta
    }
}

// AzureFunctionService.java - Servicio para Azure Functions
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service // Marca como servicio de Spring
public class AzureFunctionService {
    
    @Autowired
    private AzureStorageService storageService; // Inyecta servicio de storage
    
    // Método para procesar archivo
    public Map<String, Object> processFile(String content) {
        Map<String, Object> result = new HashMap<>(); // Crea map para resultado
        
        try {
            // Genera nombre único para archivo
            String fileName = "processed_" + System.currentTimeMillis() + ".txt"; // Genera nombre
            
            // Procesa contenido (ejemplo: convierte a mayúsculas)
            String processedContent = content.toUpperCase(); // Convierte a mayúsculas
            
            // Sube archivo procesado
            boolean uploaded = storageService.uploadFile(fileName, processedContent.getBytes()); // Sube archivo
            
            if (uploaded) { // Si se subió correctamente
                result.put("success", true); // Establece éxito como true
                result.put("fileName", fileName); // Agrega nombre del archivo
                result.put("originalSize", content.length()); // Agrega tamaño original
                result.put("processedSize", processedContent.length()); // Agrega tamaño procesado
                
                // RESULTADO ESPERADO: Resultado exitoso con información del procesamiento
            } else { // Si hubo error
                result.put("success", false); // Establece éxito como false
                result.put("error", "Error subiendo archivo procesado"); // Agrega mensaje de error
                
                // RESULTADO ESPERADO: Resultado de error
            }
            
        } catch (Exception e) {
            // Maneja excepciones
            result.put("success", false); // Establece éxito como false
            result.put("error", "Error procesando archivo: " + e.getMessage()); // Agrega mensaje de error
            
            // RESULTADO ESPERADO: Resultado de error con detalles
        }
        
        return result; // Retorna resultado
    }
    
    // Método para obtener estadísticas
    public Map<String, Object> getStorageStats() {
        Map<String, Object> stats = new HashMap<>(); // Crea map para estadísticas
        
        try {
            // Obtiene lista de archivos
            java.util.List<String> files = storageService.listFiles(); // Lista archivos
            
            // Calcula estadísticas
            stats.put("totalFiles", files.size()); // Agrega total de archivos
            stats.put("processedFiles", files.stream().filter(f -> f.startsWith("processed_")).count()); // Cuenta archivos procesados
            stats.put("originalFiles", files.stream().filter(f -> !f.startsWith("processed_")).count()); // Cuenta archivos originales
            stats.put("lastUpdated", System.currentTimeMillis()); // Agrega timestamp
            
            // RESULTADO ESPERADO: Estadísticas detalladas del storage
            
        } catch (Exception e) {
            // Maneja excepciones
            stats.put("error", "Error obteniendo estadísticas: " + e.getMessage()); // Agrega mensaje de error
            
            // RESULTADO ESPERADO: Estadísticas con error
        }
        
        return stats; // Retorna estadísticas
    }
}
```

---

## 🧪 Testing con Azure

### Tests de Integración

```java
// AzureIntegrationTest.java - Tests de integración para Azure
package com.example.test;

import com.example.config.AzureConfig;
import com.example.service.AzureStorageService;
import com.example.service.AzureSqlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo de Spring Boot
@ActiveProfiles("test") // Activa perfil de test
class AzureIntegrationTest {
    
    @Autowired
    private AzureConfig azureConfig; // Configuración de Azure
    
    @Autowired
    private AzureStorageService storageService; // Servicio de storage
    
    @Autowired
    private AzureSqlService sqlService; // Servicio de SQL
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        // Configuración inicial si es necesaria
        
        // RESULTADO ESPERADO: Configuración inicial completada
    }
    
    @Test
    @DisplayName("Debería conectar a Azure correctamente")
    void testAzureConnection() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        boolean connected = azureConfig.testAzureConnection(); // Prueba conexión
        
        // Assert - Verificar resultados
        assertTrue(connected, "Debería conectar a Azure correctamente"); // Verifica conexión
        
        // RESULTADO ESPERADO: Test pasa, conexión a Azure exitosa
    }
    
    @Test
    @DisplayName("Debería subir archivo a Azure Storage")
    void testUploadFile() {
        // Arrange - Preparar datos
        String fileName = "test-file-" + System.currentTimeMillis() + ".txt"; // Nombre único
        String content = "Contenido de prueba para Azure Storage"; // Contenido de prueba
        byte[] contentBytes = content.getBytes(); // Convierte a bytes
        
        // Act - Ejecutar acción
        boolean uploaded = storageService.uploadFile(fileName, contentBytes); // Sube archivo
        
        // Assert - Verificar resultados
        assertTrue(uploaded, "Debería subir archivo correctamente"); // Verifica subida
        
        // Verificación adicional - descargar archivo
        byte[] downloadedContent = storageService.downloadFile(fileName); // Descarga archivo
        assertNotNull(downloadedContent, "Debería poder descargar el archivo"); // Verifica descarga
        assertEquals(content, new String(downloadedContent), "El contenido debería coincidir"); // Verifica contenido
        
        // Limpieza
        storageService.deleteFile(fileName); // Elimina archivo de prueba
        
        // RESULTADO ESPERADO: Test pasa, archivo subido, descargado y eliminado correctamente
    }
    
    @Test
    @DisplayName("Debería conectar a Azure SQL Database")
    void testSqlConnection() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        String result = sqlService.testQuery(); // Ejecuta consulta de prueba
        
        // Assert - Verificar resultados
        assertNotNull(result, "Debería obtener resultado de la consulta"); // Verifica resultado
        assertTrue(result.contains("Conexión exitosa"), "Debería indicar conexión exitosa"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, conexión a Azure SQL exitosa
    }
    
    @Test
    @DisplayName("Debería obtener estadísticas de Azure SQL")
    void testGetDatabaseStats() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        Map<String, Object> stats = sqlService.getDatabaseStats(); // Obtiene estadísticas
        
        // Assert - Verificar resultados
        assertNotNull(stats, "Debería obtener estadísticas"); // Verifica estadísticas
        assertTrue(stats.containsKey("database_name"), "Debería contener nombre de base de datos"); // Verifica campo
        assertTrue(stats.containsKey("table_count"), "Debería contener conteo de tablas"); // Verifica campo
        
        // RESULTADO ESPERADO: Test pasa, estadísticas obtenidas correctamente
    }
    
    @Test
    @DisplayName("Debería listar archivos de Azure Storage")
    void testListFiles() {
        // Arrange - Preparar datos
        String fileName = "list-test-" + System.currentTimeMillis() + ".txt"; // Nombre único
        String content = "Archivo para prueba de listado"; // Contenido de prueba
        storageService.uploadFile(fileName, content.getBytes()); // Sube archivo de prueba
        
        // Act - Ejecutar acción
        List<String> files = storageService.listFiles(); // Lista archivos
        
        // Assert - Verificar resultados
        assertNotNull(files, "Debería obtener lista de archivos"); // Verifica lista
        assertTrue(files.contains(fileName), "Debería contener el archivo subido"); // Verifica archivo
        
        // Limpieza
        storageService.deleteFile(fileName); // Elimina archivo de prueba
        
        // RESULTADO ESPERADO: Test pasa, archivos listados correctamente
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Azure y cuáles son sus servicios principales?**
   - Plataforma cloud de Microsoft, App Service, SQL Database, Storage, Functions

2. **¿Cuál es la diferencia entre Azure y AWS?**
   - Azure: Microsoft, mejor integración con .NET, AWS: Amazon, más servicios

3. **¿Qué es Azure App Service?**
   - Servicio para hospedar aplicaciones web, móviles y APIs

### Preguntas Intermedias

4. **¿Cómo configurar Azure Key Vault?**
   - Almacenamiento seguro de secretos, credenciales, certificados

5. **¿Qué es Azure Functions?**
   - Computación serverless, triggers HTTP, eventos, escalado automático

6. **¿Cómo manejar autenticación en Azure?**
   - Azure AD, Managed Identity, Service Principal, OAuth2

### Preguntas Avanzadas

7. **¿Cómo implementar CI/CD en Azure?**
   - Azure DevOps, GitHub Actions, Azure Pipelines, deployment slots

8. **¿Qué son los Azure Resource Manager templates?**
   - Infraestructura como código, JSON templates, deployment automatizado

9. **¿Cómo monitorear aplicaciones en Azure?**
   - Application Insights, Azure Monitor, Log Analytics, métricas personalizadas

---

## 📚 Recursos Adicionales

- [Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [Azure Java SDK](https://docs.microsoft.com/en-us/azure/developer/java/)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Azure! 🚀** 