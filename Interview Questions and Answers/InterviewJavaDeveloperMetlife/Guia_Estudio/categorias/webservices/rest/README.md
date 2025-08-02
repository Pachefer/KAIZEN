# 🌐 REST Web Services - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de REST](#fundamentos-de-rest)
2. [Controladores REST](#controladores-rest)
3. [Validación y Manejo de Errores](#validación-y-manejo-de-errores)
4. [Documentación con Swagger](#documentación-con-swagger)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de REST

### Configuración Básica

```java
// RestConfig.java - Configuración de REST
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Marca esta clase como configuración de Spring
public class RestConfig implements WebMvcConfigurer {
    
    // Configurar CORS para permitir peticiones desde diferentes dominios
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplicar a todas las rutas /api/
                .allowedOrigins("http://localhost:3000", "https://myapp.com") // Orígenes permitidos
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Todos los headers permitidos
                .allowCredentials(true) // Permitir credenciales
                .maxAge(3600); // Cache preflight por 1 hora
    }
    
    // Bean para ObjectMapper personalizado
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule()); // Soporte para Java 8 Time
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // Fechas como ISO-8601
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // Excluir campos null
        return mapper;
    }
}

// application.properties - Configuración de propiedades
/*
# Configuración del servidor
server.port=8080
server.servlet.context-path=/api

# Configuración de logging
logging.level.com.example=DEBUG
logging.level.org.springframework.web=DEBUG

# Configuración de Jackson
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.serialization.fail-on-empty-beans=false
spring.jackson.deserialization.fail-on-unknown-properties=false
*/
```

### DTOs (Data Transfer Objects)

```java
// UserDTO.java - DTO para transferencia de datos de usuario
package com.example.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Set;

public class UserDTO {
    
    @JsonProperty("id") // Nombre del campo en JSON
    private Long id;
    
    @NotBlank(message = "El username es obligatorio")
    @Size(min = 3, max = 50, message = "El username debe tener entre 3 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "El username solo puede contener letras, números y guiones bajos")
    @JsonProperty("username")
    private String username;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @JsonProperty("email")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "La contraseña debe contener al menos una minúscula, una mayúscula y un número")
    @JsonProperty("password")
    private String password;
    
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    @JsonProperty("firstName")
    private String firstName;
    
    @Size(max = 50, message = "El apellido no puede exceder 50 caracteres")
    @JsonProperty("lastName")
    private String lastName;
    
    @JsonProperty("enabled")
    private boolean enabled = true;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") // Formato ISO-8601
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
    
    @JsonProperty("roles")
    private Set<String> roles; // Solo nombres de roles
    
    // Constructor por defecto
    public UserDTO() {}
    
    // Constructor con parámetros básicos
    public UserDTO(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.enabled = true;
    }
    
    // Constructor completo
    public UserDTO(Long id, String username, String email, String firstName, 
                   String lastName, boolean enabled, LocalDateTime createdAt, 
                   LocalDateTime updatedAt, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.roles = roles;
    }
    
    // Método para obtener nombre completo
    @JsonIgnore // No incluir en JSON
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
    
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}

// ApiResponse.java - Respuesta estándar de la API
public class ApiResponse<T> {
    
    @JsonProperty("success")
    private boolean success;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private T data;
    
    @JsonProperty("timestamp")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    @JsonProperty("path")
    private String path;
    
    // Constructor por defecto
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor con parámetros
    public ApiResponse(boolean success, String message, T data, String path) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
    
    // Método estático para respuesta exitosa
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, null);
    }
    
    // Método estático para respuesta exitosa sin datos
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }
    
    // Método estático para respuesta de error
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }
    
    // Getters y Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
}
```

---

## 🔄 Controladores REST

### Controlador Principal

```java
// UserController.java - Controlador REST para usuarios
package com.example.controller;

import com.example.dto.UserDTO;
import com.example.dto.ApiResponse;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import java.util.List;

@RestController // Marca como controlador REST
@RequestMapping("/users") // Ruta base para todos los endpoints
@Validated // Habilita validación de parámetros
@Tag(name = "User Management", description = "APIs para gestión de usuarios") // Documentación Swagger
@CrossOrigin(origins = {"http://localhost:3000", "https://myapp.com"}) // CORS específico
public class UserController {
    
    private final UserService userService; // Servicio inyectado
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // POST /users - Crear usuario
    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario en el sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "409", description = "Usuario ya existe")
    })
    public ResponseEntity<ApiResponse<UserDTO>> createUser(
            @Valid @RequestBody UserDTO userDTO) {
        
        // Crear usuario usando el servicio
        UserDTO createdUser = userService.createUser(userDTO);
        
        // Retornar respuesta exitosa con código 201 (Created)
        ApiResponse<UserDTO> response = ApiResponse.success(createdUser, "Usuario creado exitosamente");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // GET /users/{id} - Obtener usuario por ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene un usuario específico por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable @Min(1) Long id) {
        
        // Buscar usuario por ID
        UserDTO user = userService.getUserById(id);
        
        // Retornar respuesta exitosa
        ApiResponse<UserDTO> response = ApiResponse.success(user, "Usuario encontrado");
        return ResponseEntity.ok(response);
    }
    
    // GET /users - Obtener todos los usuarios con paginación
    @GetMapping
    @Operation(summary = "Obtener usuarios", description = "Obtiene una lista paginada de usuarios")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida")
    })
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllUsers(
            @Parameter(description = "Número de página (0-based)")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Tamaño de la página")
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Campo para ordenar")
            @RequestParam(defaultValue = "id") String sortBy,
            
            @Parameter(description = "Dirección del ordenamiento")
            @RequestParam(defaultValue = "asc") @Pattern(regexp = "asc|desc") String direction) {
        
        // Crear objeto de paginación
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        // Obtener usuarios paginados
        Page<UserDTO> users = userService.getAllUsers(pageable);
        
        // Retornar respuesta exitosa
        ApiResponse<Page<UserDTO>> response = ApiResponse.success(users, "Usuarios obtenidos exitosamente");
        return ResponseEntity.ok(response);
    }
    
    // GET /users/search - Buscar usuarios
    @GetMapping("/search")
    @Operation(summary = "Buscar usuarios", description = "Busca usuarios por diferentes criterios")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Búsqueda completada")
    })
    public ResponseEntity<ApiResponse<List<UserDTO>>> searchUsers(
            @Parameter(description = "Username para buscar")
            @RequestParam(required = false) String username,
            
            @Parameter(description = "Email para buscar")
            @RequestParam(required = false) String email,
            
            @Parameter(description = "Estado del usuario")
            @RequestParam(required = false) Boolean enabled) {
        
        // Buscar usuarios con criterios
        List<UserDTO> users = userService.searchUsers(username, email, enabled);
        
        // Retornar respuesta exitosa
        ApiResponse<List<UserDTO>> response = ApiResponse.success(users, "Búsqueda completada");
        return ResponseEntity.ok(response);
    }
    
    // PUT /users/{id} - Actualizar usuario
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable @Min(1) Long id,
            
            @Valid @RequestBody UserDTO userDTO) {
        
        // Actualizar usuario
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        
        // Retornar respuesta exitosa
        ApiResponse<UserDTO> response = ApiResponse.success(updatedUser, "Usuario actualizado exitosamente");
        return ResponseEntity.ok(response);
    }
    
    // PATCH /users/{id}/password - Cambiar contraseña
    @PatchMapping("/{id}/password")
    @Operation(summary = "Cambiar contraseña", description = "Cambia la contraseña de un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña cambiada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable @Min(1) Long id,
            
            @Parameter(description = "Nueva contraseña", required = true)
            @RequestParam String newPassword) {
        
        // Cambiar contraseña
        boolean success = userService.changePassword(id, newPassword);
        
        if (success) {
            ApiResponse<String> response = ApiResponse.success("Contraseña cambiada exitosamente");
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<String> response = ApiResponse.error("No se pudo cambiar la contraseña");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // PATCH /users/{id}/status - Cambiar estado del usuario
    @PatchMapping("/{id}/status")
    @Operation(summary = "Cambiar estado", description = "Habilita o deshabilita un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable @Min(1) Long id) {
        
        // Cambiar estado del usuario
        boolean success = userService.toggleUserStatus(id);
        
        if (success) {
            ApiResponse<String> response = ApiResponse.success("Estado del usuario cambiado exitosamente");
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<String> response = ApiResponse.error("No se pudo cambiar el estado del usuario");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // DELETE /users/{id} - Eliminar usuario
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @Parameter(description = "ID del usuario", required = true)
            @PathVariable @Min(1) Long id) {
        
        // Eliminar usuario
        boolean success = userService.deleteUser(id);
        
        if (success) {
            ApiResponse<String> response = ApiResponse.success("Usuario eliminado exitosamente");
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<String> response = ApiResponse.error("No se pudo eliminar el usuario");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // GET /users/statistics - Obtener estadísticas
    @GetMapping("/statistics")
    @Operation(summary = "Obtener estadísticas", description = "Obtiene estadísticas de usuarios")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas")
    })
    public ResponseEntity<ApiResponse<UserStatistics>> getUserStatistics() {
        
        // Obtener estadísticas
        UserStatistics statistics = userService.getUserStatistics();
        
        // Retornar respuesta exitosa
        ApiResponse<UserStatistics> response = ApiResponse.success(statistics, "Estadísticas obtenidas");
        return ResponseEntity.ok(response);
    }
}

// UserStatistics.java - Clase para estadísticas
public class UserStatistics {
    
    @JsonProperty("totalUsers")
    private long totalUsers;
    
    @JsonProperty("activeUsers")
    private long activeUsers;
    
    @JsonProperty("inactiveUsers")
    private long inactiveUsers;
    
    @JsonProperty("newUsersThisMonth")
    private long newUsersThisMonth;
    
    // Constructor
    public UserStatistics(long totalUsers, long activeUsers, long inactiveUsers, long newUsersThisMonth) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.newUsersThisMonth = newUsersThisMonth;
    }
    
    // Getters
    public long getTotalUsers() { return totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public long getInactiveUsers() { return inactiveUsers; }
    public long getNewUsersThisMonth() { return newUsersThisMonth; }
}
```

---

## ⚠️ Validación y Manejo de Errores

### Global Exception Handler

```java
// GlobalExceptionHandler.java - Manejador global de excepciones
package com.example.exception;

import com.example.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import javax.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Marca como manejador global de excepciones
public class GlobalExceptionHandler {
    
    // Manejador para excepciones de validación de argumentos
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        // Crear mapa para errores de validación
        Map<String, String> errors = new HashMap<>();
        
        // Extraer errores de validación
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // Crear respuesta de error
        ApiResponse<Map<String, String>> response = ApiResponse.error("Datos de entrada inválidos");
        response.setData(errors);
        response.setPath(request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Manejador para excepciones de validación de parámetros
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        
        // Crear mapa para errores de validación
        Map<String, String> errors = new HashMap<>();
        
        // Extraer errores de validación
        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // Crear respuesta de error
        ApiResponse<Map<String, String>> response = ApiResponse.error("Parámetros inválidos");
        response.setData(errors);
        response.setPath(request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Manejador para excepciones de recurso no encontrado
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        // Crear respuesta de error
        ApiResponse<String> response = ApiResponse.error(ex.getMessage());
        response.setPath(request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    // Manejador para excepciones de conflicto (recurso ya existe)
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceAlreadyExistsException(
            ResourceAlreadyExistsException ex, WebRequest request) {
        
        // Crear respuesta de error
        ApiResponse<String> response = ApiResponse.error(ex.getMessage());
        response.setPath(request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
    
    // Manejador para excepciones de argumento ilegal
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        // Crear respuesta de error
        ApiResponse<String> response = ApiResponse.error(ex.getMessage());
        response.setPath(request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    // Manejador para excepciones generales
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGeneralException(
            Exception ex, WebRequest request) {
        
        // Crear respuesta de error
        ApiResponse<String> response = ApiResponse.error("Error interno del servidor");
        response.setPath(request.getDescription(false));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

// ResourceNotFoundException.java - Excepción personalizada
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s : '%s'", resourceName, fieldName, fieldValue));
    }
}

// ResourceAlreadyExistsException.java - Excepción personalizada
public class ResourceAlreadyExistsException extends RuntimeException {
    
    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
    
    public ResourceAlreadyExistsException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s ya existe con %s : '%s'", resourceName, fieldName, fieldValue));
    }
}
```

---

## 📚 Documentación con Swagger

### Configuración de Swagger

```java
// SwaggerConfig.java - Configuración de Swagger/OpenAPI
package com.example.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration // Marca esta clase como configuración de Spring
public class SwaggerConfig {
    
    // Bean para configuración de OpenAPI
    @Bean
    public OpenAPI customOpenAPI() {
        // Crear información de la API
        Contact contact = new Contact();
        contact.setName("Equipo de Desarrollo");
        contact.setEmail("dev@example.com");
        contact.setUrl("https://example.com");
        
        License license = new License();
        license.setName("MIT License");
        license.setUrl("https://opensource.org/licenses/MIT");
        
        Info info = new Info()
                .title("API de Gestión de Usuarios")
                .version("1.0.0")
                .description("API REST para la gestión completa de usuarios en el sistema")
                .contact(contact)
                .license(license);
        
        // Configurar servidores
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080/api");
        devServer.setDescription("Servidor de desarrollo");
        
        Server prodServer = new Server();
        prodServer.setUrl("https://api.example.com");
        prodServer.setDescription("Servidor de producción");
        
        // Crear configuración de OpenAPI
        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}
```

---

## 🧪 Testing

### Testing de Controladores REST

```java
// UserControllerTest.java - Pruebas del controlador REST
package com.example.controller;

import com.example.dto.UserDTO;
import com.example.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class) // Configuración para testing de controladores
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc; // Cliente HTTP simulado
    
    @MockBean
    private UserService userService; // Mock del servicio
    
    @Autowired
    private ObjectMapper objectMapper; // Mapper para JSON
    
    private UserDTO testUserDTO;
    
    @BeforeEach
    void setUp() {
        testUserDTO = new UserDTO();
        testUserDTO.setId(1L);
        testUserDTO.setUsername("testuser");
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setPassword("password123");
        testUserDTO.setFirstName("Test");
        testUserDTO.setLastName("User");
        testUserDTO.setEnabled(true);
    }
    
    @Test
    void createUser_WithValidData_ShouldReturnCreated() throws Exception {
        // Arrange
        when(userService.createUser(any(UserDTO.class))).thenReturn(testUserDTO);
        
        // Act & Assert
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"));
        
        verify(userService).createUser(any(UserDTO.class));
    }
    
    @Test
    void createUser_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        // Arrange
        UserDTO invalidUser = new UserDTO();
        invalidUser.setUsername(""); // Username vacío
        
        // Act & Assert
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
        
        verify(userService, never()).createUser(any());
    }
    
    @Test
    void getUserById_WithValidId_ShouldReturnUser() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(testUserDTO);
        
        // Act & Assert
        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.username").value("testuser"));
        
        verify(userService).getUserById(1L);
    }
    
    @Test
    void getUserById_WithInvalidId_ShouldReturnBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/users/0")) // ID inválido
                .andExpect(status().isBadRequest());
        
        verify(userService, never()).getUserById(any());
    }
    
    @Test
    void getAllUsers_ShouldReturnPaginatedUsers() throws Exception {
        // Arrange
        List<UserDTO> users = Arrays.asList(testUserDTO);
        Page<UserDTO> page = new PageImpl<>(users, PageRequest.of(0, 10), 1);
        when(userService.getAllUsers(any(PageRequest.class))).thenReturn(page);
        
        // Act & Assert
        mockMvc.perform(get("/users")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "id"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(1));
        
        verify(userService).getAllUsers(any(PageRequest.class));
    }
    
    @Test
    void updateUser_WithValidData_ShouldReturnUpdatedUser() throws Exception {
        // Arrange
        when(userService.updateUser(eq(1L), any(UserDTO.class))).thenReturn(testUserDTO);
        
        // Act & Assert
        mockMvc.perform(put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("testuser"));
        
        verify(userService).updateUser(eq(1L), any(UserDTO.class));
    }
    
    @Test
    void changePassword_WithValidData_ShouldReturnSuccess() throws Exception {
        // Arrange
        when(userService.changePassword(1L, "newpassword")).thenReturn(true);
        
        // Act & Assert
        mockMvc.perform(patch("/users/1/password")
                .param("newPassword", "newpassword"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        
        verify(userService).changePassword(1L, "newpassword");
    }
    
    @Test
    void toggleUserStatus_ShouldReturnSuccess() throws Exception {
        // Arrange
        when(userService.toggleUserStatus(1L)).thenReturn(true);
        
        // Act & Assert
        mockMvc.perform(patch("/users/1/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        
        verify(userService).toggleUserStatus(1L);
    }
    
    @Test
    void deleteUser_WithValidId_ShouldReturnSuccess() throws Exception {
        // Arrange
        when(userService.deleteUser(1L)).thenReturn(true);
        
        // Act & Assert
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
        
        verify(userService).deleteUser(1L);
    }
    
    @Test
    void searchUsers_ShouldReturnMatchingUsers() throws Exception {
        // Arrange
        List<UserDTO> users = Arrays.asList(testUserDTO);
        when(userService.searchUsers(anyString(), anyString(), anyBoolean())).thenReturn(users);
        
        // Act & Assert
        mockMvc.perform(get("/users/search")
                .param("username", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
        
        verify(userService).searchUsers("test", null, null);
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es REST y cuáles son sus principios?**
   - Stateless, client-server, cacheable, uniform interface

2. **¿Cuáles son los métodos HTTP principales?**
   - GET, POST, PUT, DELETE, PATCH

3. **¿Qué son los códigos de estado HTTP?**
   - 2xx (éxito), 4xx (cliente), 5xx (servidor)

### Preguntas Intermedias

4. **¿Cómo manejar validación en REST APIs?**
   - @Valid, @Validated, Bean Validation

5. **¿Qué es CORS y cómo configurarlo?**
   - Cross-Origin Resource Sharing, configuración de orígenes

6. **¿Cómo documentar APIs REST?**
   - Swagger/OpenAPI, anotaciones, documentación automática

### Preguntas Avanzadas

7. **¿Cómo optimizar APIs REST?**
   - Paginación, cache, compresión, versionado

8. **¿Qué son los DTOs y cuándo usarlos?**
   - Data Transfer Objects, separación de capas

9. **¿Cómo manejar autenticación en REST?**
   - JWT, OAuth2, API keys, Basic Auth

---

## 📚 Recursos Adicionales

- [Spring Web Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
- [REST API Best Practices](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de REST Web Services! 🚀** 