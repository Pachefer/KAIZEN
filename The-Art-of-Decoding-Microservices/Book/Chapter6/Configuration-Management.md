# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Configuration Management (Spring Cloud Config, Vault)

---

### 1. Introducción y Teoría

El **Configuration Management** es fundamental en microservicios para gestionar configuraciones de forma centralizada y segura. Permite:

- **Centralizar configuraciones** de múltiples servicios
- **Gestionar secretos** de forma segura
- **Cambiar configuraciones** sin redeployar aplicaciones
- **Mantener configuraciones** específicas por entorno

**Componentes principales:**
- **Spring Cloud Config**: Servidor de configuración centralizada
- **HashiCorp Vault**: Gestión segura de secretos
- **Environment Variables**: Variables de entorno para configuraciones sensibles
- **Configuration Properties**: Propiedades de configuración en Spring Boot

---

### 2. Ejemplo de Código: Configuración con Spring Cloud Config

#### 2.1. Dependencias en pom.xml

```xml
<!-- Dependencia para Spring Cloud Config Client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>

<!-- Dependencia para Spring Boot Actuator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Dependencia para refresh de configuración -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

#### 2.2. Configuración en bootstrap.yml

```yaml
# Configuración del cliente de Spring Cloud Config
spring:
  application:
    name: usuario-service  # Nombre del servicio
  
  cloud:
    config:
      uri: http://localhost:8888  # URL del servidor de configuración
      fail-fast: true  # Fallar rápido si no puede conectarse
      retry:
        initial-interval: 1000  # Intervalo inicial de reintento
        max-interval: 2000  # Intervalo máximo de reintento
        max-attempts: 6  # Número máximo de intentos
  
  profiles:
    active: dev  # Perfil activo (dev, staging, prod)
```

---

### 3. Ejemplo de Código: Clase de Configuración

```java
// Clase de configuración para el servicio de usuarios
@Configuration
@ConfigurationProperties(prefix = "usuario.service")
@Data  // Anotación de Lombok para getters/setters
public class UsuarioServiceConfig {
    
    // Configuración de base de datos
    private DatabaseConfig database = new DatabaseConfig();
    
    // Configuración de servicios externos
    private ExternalServicesConfig externalServices = new ExternalServicesConfig();
    
    // Configuración de seguridad
    private SecurityConfig security = new SecurityConfig();
    
    // Configuración de logging
    private LoggingConfig logging = new LoggingConfig();
    
    // Clase interna para configuración de base de datos
    @Data
    public static class DatabaseConfig {
        private String url;  // URL de conexión a la BD
        private String username;  // Usuario de la BD
        private String password;  // Contraseña de la BD
        private int maxConnections = 10;  // Máximo de conexiones
        private int connectionTimeout = 30000;  // Timeout de conexión en ms
        private boolean enableConnectionPool = true;  // Habilitar pool de conexiones
    }
    
    // Clase interna para configuración de servicios externos
    @Data
    public static class ExternalServicesConfig {
        private String emailValidationUrl;  // URL del servicio de validación de email
        private String notificationServiceUrl;  // URL del servicio de notificaciones
        private String paymentServiceUrl;  // URL del servicio de pagos
        private int timeoutSeconds = 30;  // Timeout para llamadas HTTP
        private int maxRetries = 3;  // Máximo de reintentos
        private boolean circuitBreakerEnabled = true;  // Habilitar circuit breaker
    }
    
    // Clase interna para configuración de seguridad
    @Data
    public static class SecurityConfig {
        private String jwtSecret;  // Secreto para JWT
        private int jwtExpirationHours = 24;  // Expiración de JWT en horas
        private boolean enableCors = true;  // Habilitar CORS
        private String[] allowedOrigins = {"*"};  // Orígenes permitidos
        private boolean enableRateLimiting = true;  // Habilitar rate limiting
        private int maxRequestsPerMinute = 100;  // Máximo de requests por minuto
    }
    
    // Clase interna para configuración de logging
    @Data
    public static class LoggingConfig {
        private String level = "INFO";  // Nivel de logging
        private String pattern = "%d{yyyy-MM-dd HH:mm:ss} - %msg%n";  // Patrón de log
        private boolean enableStructuredLogging = true;  // Habilitar logging estructurado
        private String logFile = "logs/usuario-service.log";  // Archivo de log
        private int maxFileSize = 100;  // Tamaño máximo de archivo en MB
        private int maxHistory = 30;  // Número máximo de archivos de backup
    }
}
```

---

### 4. Ejemplo de Código: Servicio que Usa Configuración

```java
// Servicio que utiliza configuración centralizada
@Service
@Slf4j
public class UsuarioService {
    
    // Inyección de la configuración
    @Autowired
    private UsuarioServiceConfig config;
    
    // RestTemplate para llamadas HTTP
    @Autowired
    private RestTemplate restTemplate;
    
    // Método para crear usuario usando configuración
    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        log.info("Iniciando creación de usuario con configuración: {}", 
            config.getExternalServices().getEmailValidationUrl());
        
        try {
            // Validar email usando servicio externo configurado
            boolean emailValido = validarEmailExterno(request.getEmail());
            
            if (!emailValido) {
                log.warn("Email inválido según configuración externa: {}", request.getEmail());
                throw new IllegalArgumentException("Email inválido");
            }
            
            // Crear usuario
            Usuario usuario = new Usuario();
            usuario.setEmail(request.getEmail());
            usuario.setNombre(request.getNombre());
            usuario.setId(generarId());
            
            // Enviar notificación usando configuración
            enviarNotificacionBienvenida(usuario);
            
            log.info("Usuario creado exitosamente usando configuración: {}", usuario.getId());
            return new UsuarioResponse(usuario.getId(), usuario.getEmail(), "CREATED");
            
        } catch (Exception e) {
            log.error("Error al crear usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Método para validar email usando configuración externa
    private boolean validarEmailExterno(String email) {
        String url = config.getExternalServices().getEmailValidationUrl();
        int timeout = config.getExternalServices().getTimeoutSeconds() * 1000;
        
        log.debug("Validando email en: {} con timeout: {}ms", url, timeout);
        
        try {
            // Configurar timeout para la llamada HTTP
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setConnectTimeout(timeout);
            factory.setReadTimeout(timeout);
            
            RestTemplate customRestTemplate = new RestTemplate(factory);
            
            // Realizar llamada HTTP
            ResponseEntity<ValidacionResponse> response = customRestTemplate.getForEntity(
                url + "?email=" + email, 
                ValidacionResponse.class
            );
            
            log.debug("Respuesta de validación: {}", response.getBody().isValido());
            return response.getBody().isValido();
            
        } catch (Exception e) {
            log.error("Error en validación de email: {}", e.getMessage(), e);
            
            // Si está habilitado el circuit breaker, manejar el fallo
            if (config.getExternalServices().isCircuitBreakerEnabled()) {
                log.warn("Circuit breaker activado para validación de email");
                return true; // Permitir creación sin validación externa
            }
            
            return false;
        }
    }
    
    // Método para enviar notificación usando configuración
    private void enviarNotificacionBienvenida(Usuario usuario) {
        String url = config.getExternalServices().getNotificationServiceUrl();
        int timeout = config.getExternalServices().getTimeoutSeconds() * 1000;
        
        log.debug("Enviando notificación a: {} con timeout: {}ms", url, timeout);
        
        try {
            // Configurar timeout para la llamada HTTP
            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
            factory.setConnectTimeout(timeout);
            factory.setReadTimeout(timeout);
            
            RestTemplate customRestTemplate = new RestTemplate(factory);
            
            // Preparar notificación
            NotificacionRequest notifRequest = new NotificacionRequest(
                usuario.getEmail(), 
                "Bienvenido a nuestro servicio!"
            );
            
            // Realizar llamada HTTP
            ResponseEntity<String> response = customRestTemplate.postForEntity(
                url, 
                notifRequest, 
                String.class
            );
            
            log.info("Notificación enviada exitosamente: {}", response.getStatusCode());
            
        } catch (Exception e) {
            log.error("Error enviando notificación: {}", e.getMessage(), e);
            
            // Si está habilitado el circuit breaker, no fallar la creación
            if (config.getExternalServices().isCircuitBreakerEnabled()) {
                log.warn("Circuit breaker activado para notificaciones");
            } else {
                throw e; // Re-lanzar excepción si no está habilitado
            }
        }
    }
    
    // Método auxiliar para generar ID
    private Long generarId() {
        return System.currentTimeMillis();
    }
}
```

---

### 5. Ejemplo de Código: Configuración con Vault

```java
// Configuración para integración con Vault
@Configuration
@EnableConfigurationProperties
public class VaultConfig {
    
    // Bean para cliente de Vault
    @Bean
    public VaultTemplate vaultTemplate() {
        // Configuración del cliente de Vault
        VaultEndpoint endpoint = VaultEndpoint.create("localhost", 8200);
        endpoint.setScheme("http");
        
        // Configuración de autenticación (token)
        ClientAuthentication clientAuthentication = new TokenAuthentication("your-vault-token");
        
        // Crear cliente de Vault
        VaultTemplate vaultTemplate = new VaultTemplate(endpoint, clientAuthentication);
        
        return vaultTemplate;
    }
    
    // Bean para acceder a secretos de Vault
    @Bean
    public VaultSecretService vaultSecretService(VaultTemplate vaultTemplate) {
        return new VaultSecretService(vaultTemplate);
    }
}

// Servicio para gestionar secretos de Vault
@Service
public class VaultSecretService {
    
    private final VaultTemplate vaultTemplate;
    private static final Logger logger = LoggerFactory.getLogger(VaultSecretService.class);
    
    public VaultSecretService(VaultTemplate vaultTemplate) {
        this.vaultTemplate = vaultTemplate;
    }
    
    // Método para obtener secreto de Vault
    public String getSecret(String path, String key) {
        try {
            logger.debug("Obteniendo secreto de Vault: {}/{}", path, key);
            
            // Leer secreto de Vault
            VaultResponse response = vaultTemplate.read(path);
            
            if (response != null && response.getData() != null) {
                Object value = response.getData().get(key);
                logger.debug("Secreto obtenido exitosamente");
                return value != null ? value.toString() : null;
            } else {
                logger.warn("No se encontró secreto en Vault: {}/{}", path, key);
                return null;
            }
            
        } catch (Exception e) {
            logger.error("Error obteniendo secreto de Vault: {}", e.getMessage(), e);
            return null;
        }
    }
    
    // Método para escribir secreto en Vault
    public boolean writeSecret(String path, String key, String value) {
        try {
            logger.debug("Escribiendo secreto en Vault: {}/{}", path, key);
            
            // Preparar datos para escribir
            Map<String, Object> data = new HashMap<>();
            data.put(key, value);
            
            // Escribir secreto en Vault
            vaultTemplate.write(path, data);
            
            logger.info("Secreto escrito exitosamente en Vault: {}/{}", path, key);
            return true;
            
        } catch (Exception e) {
            logger.error("Error escribiendo secreto en Vault: {}", e.getMessage(), e);
            return false;
        }
    }
}
```

---

### 6. Ejemplo de Código: Endpoint para Refresh de Configuración

```java
// Controlador para refresh de configuración
@RestController
@RequestMapping("/actuator")
@Slf4j
public class ConfigurationController {
    
    // Endpoint para refresh de configuración
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshConfiguration() {
        log.info("Solicitud de refresh de configuración recibida");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Publicar evento de refresh
            ApplicationEventPublisher publisher = ApplicationContextProvider.getApplicationContext()
                .getBean(ApplicationEventPublisher.class);
            
            publisher.publishEvent(new RefreshRemoteApplicationEvent(this, "usuario-service", "default"));
            
            response.put("status", "success");
            response.put("message", "Configuración refrescada exitosamente");
            response.put("timestamp", Instant.now());
            
            log.info("Configuración refrescada exitosamente");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error refrescando configuración: {}", e.getMessage(), e);
            
            response.put("status", "error");
            response.put("message", "Error refrescando configuración: " + e.getMessage());
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Endpoint para ver configuración actual
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getCurrentConfiguration() {
        log.debug("Solicitud de configuración actual recibida");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Obtener configuración actual
            UsuarioServiceConfig config = ApplicationContextProvider.getApplicationContext()
                .getBean(UsuarioServiceConfig.class);
            
            response.put("database", config.getDatabase());
            response.put("externalServices", config.getExternalServices());
            response.put("security", config.getSecurity());
            response.put("logging", config.getLogging());
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error obteniendo configuración: {}", e.getMessage(), e);
            
            response.put("status", "error");
            response.put("message", "Error obteniendo configuración: " + e.getMessage());
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
```

---

### 7. Pruebas Unitarias para Configuration Management

```java
// Pruebas unitarias para gestión de configuración
@SpringBootTest
public class ConfigurationManagementTest {
    
    @Autowired
    private UsuarioServiceConfig config;
    
    @Autowired
    private UsuarioService usuarioService;
    
    @MockBean
    private RestTemplate restTemplate;
    
    @Test
    public void testConfigurationLoading() {
        // Verificar que la configuración se cargó correctamente
        assertNotNull(config);
        assertNotNull(config.getDatabase());
        assertNotNull(config.getExternalServices());
        assertNotNull(config.getSecurity());
        assertNotNull(config.getLogging());
        
        // Verificar valores por defecto
        assertEquals(10, config.getDatabase().getMaxConnections());
        assertEquals(30, config.getExternalServices().getTimeoutSeconds());
        assertEquals(24, config.getSecurity().getJwtExpirationHours());
        assertEquals("INFO", config.getLogging().getLevel());
    }
    
    @Test
    public void testServiceWithConfiguration() {
        // Configurar mock para validación de email
        ValidacionResponse validacionResponse = new ValidacionResponse(true);
        when(restTemplate.getForEntity(anyString(), eq(ValidacionResponse.class)))
            .thenReturn(ResponseEntity.ok(validacionResponse));
        
        // Configurar mock para notificación
        when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
            .thenReturn(ResponseEntity.ok("OK"));
        
        // Crear usuario usando configuración
        UsuarioRequest request = new UsuarioRequest("test@email.com", "Test User");
        UsuarioResponse response = usuarioService.crearUsuario(request);
        
        // Verificar respuesta
        assertNotNull(response);
        assertEquals("test@email.com", response.getEmail());
        assertEquals("CREATED", response.getStatus());
    }
    
    @Test
    public void testConfigurationRefresh() {
        // Simular refresh de configuración
        // En un caso real, se cambiaría la configuración en el servidor de config
        // y se llamaría al endpoint de refresh
        
        assertNotNull(config);
        // Verificar que la configuración sigue siendo válida después del refresh
    }
}
```

---

### 8. Mejoras y Patrones de Diseño

- **Configuration Encryption**: Encriptar configuraciones sensibles
- **Configuration Validation**: Validar configuraciones al cargar
- **Configuration Caching**: Cachear configuraciones para mejorar rendimiento
- **Configuration Versioning**: Versionar configuraciones para rollback
- **Configuration Monitoring**: Monitorear cambios en configuraciones

---

### 9. Resultados Esperados y Manejo de Errores

#### 9.1. Escenarios exitosos

- **Configuración cargada correctamente**:
    - Servicio inicia con configuración válida
    - Todos los componentes funcionan según configuración
    - Refresh de configuración funciona sin reiniciar

#### 9.2. Escenarios de error

- **Servidor de configuración no disponible**:
    - Servicio usa configuración por defecto
    - Logs indican problema de conectividad
    - Reintentos automáticos configurados

- **Configuración inválida**:
    - Servicio falla al iniciar con error descriptivo
    - Validación de configuración previene errores
    - Logs detallan problema específico

---

### 10. Explicación Detallada de la Lógica

- **Spring Cloud Config**: Centraliza configuraciones en repositorio Git
- **Configuration Properties**: Mapea propiedades YAML a objetos Java
- **Vault**: Gestiona secretos de forma segura con encriptación
- **Refresh Endpoint**: Permite cambiar configuración sin reiniciar
- **Environment Profiles**: Diferentes configuraciones por entorno

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, "Backup & Recovery") o proceder con el Capítulo 5? 