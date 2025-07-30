# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Health Checks (Spring Boot Actuator, Health Checks Personalizados)

---

### 1. Introducción y Teoría

Los **Health Checks** son endpoints que permiten verificar el estado de salud de un microservicio. Son fundamentales para:

- **Monitoreo de servicios** en tiempo real
- **Load balancers** para determinar qué instancias están disponibles
- **Orquestadores** como Kubernetes para gestionar pods
- **Alertas automáticas** cuando un servicio falla

**Tipos de Health Checks:**
- **Liveness**: Verifica que la aplicación esté ejecutándose
- **Readiness**: Verifica que la aplicación esté lista para recibir tráfico
- **Startup**: Verifica que la aplicación haya iniciado correctamente

---

### 2. Ejemplo de Código: Configuración de Spring Boot Actuator

#### 2.1. Dependencias en pom.xml

```xml
<!-- Dependencia para Spring Boot Actuator -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Dependencia para health checks de base de datos -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Dependencia para health checks de Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 2.2. Configuración en application.yml

```yaml
# Configuración de Actuator
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus  # Endpoints expuestos
      base-path: /actuator  # Ruta base para endpoints
  
  endpoint:
    health:
      show-details: always  # Mostrar detalles siempre
      show-components: always  # Mostrar componentes siempre
  
  health:
    redis:
      enabled: true  # Habilitar health check de Redis
    db:
      enabled: true  # Habilitar health check de base de datos
  
  # Configuración de métricas
  metrics:
    export:
      prometheus:
        enabled: true  # Exportar métricas a Prometheus
```

---

### 3. Ejemplo de Código: Health Checks Personalizados

```java
// Health check personalizado para servicio de usuarios
@Component
public class UsuarioServiceHealthIndicator implements HealthIndicator {
    
    // Logger para esta clase
    private static final Logger logger = LoggerFactory.getLogger(UsuarioServiceHealthIndicator.class);
    
    // Servicio de usuarios para verificar funcionalidad
    @Autowired
    private UsuarioService usuarioService;
    
    // Método principal que implementa HealthIndicator
    @Override
    public Health health() {
        logger.debug("Ejecutando health check para UsuarioService");
        
        try {
            // Verificar que el servicio puede realizar operaciones básicas
            boolean servicioFuncional = verificarServicioUsuario();
            
            if (servicioFuncional) {
                // Servicio funcionando correctamente
                logger.debug("UsuarioService health check: UP");
                return Health.up()
                    .withDetail("service", "UsuarioService")
                    .withDetail("status", "Operational")
                    .withDetail("timestamp", Instant.now())
                    .build();
            } else {
                // Servicio no funciona correctamente
                logger.warn("UsuarioService health check: DOWN - Servicio no funcional");
                return Health.down()
                    .withDetail("service", "UsuarioService")
                    .withDetail("status", "Not Operational")
                    .withDetail("error", "Servicio no responde correctamente")
                    .withDetail("timestamp", Instant.now())
                    .build();
            }
            
        } catch (Exception e) {
            // Error en el health check
            logger.error("Error en health check de UsuarioService: {}", e.getMessage(), e);
            return Health.down()
                .withDetail("service", "UsuarioService")
                .withDetail("status", "Error")
                .withDetail("error", e.getMessage())
                .withDetail("timestamp", Instant.now())
                .build();
        }
    }
    
    // Método para verificar que el servicio funciona
    private boolean verificarServicioUsuario() {
        try {
            // Intentar crear un usuario de prueba
            UsuarioRequest request = new UsuarioRequest("health-check@test.com", "Health Check User");
            UsuarioResponse response = usuarioService.crearUsuario(request);
            
            // Verificar que se obtuvo una respuesta válida
            return response != null && response.getId() != null;
            
        } catch (Exception e) {
            logger.warn("Error verificando UsuarioService: {}", e.getMessage());
            return false;
        }
    }
}
```

---

### 4. Ejemplo de Código: Health Check para Base de Datos

```java
// Health check personalizado para base de datos
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseHealthIndicator.class);
    
    // DataSource para verificar conexión a BD
    @Autowired
    private DataSource dataSource;
    
    // JdbcTemplate para ejecutar queries de prueba
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public Health health() {
        logger.debug("Ejecutando health check para base de datos");
        
        try {
            // Verificar conexión a la base de datos
            boolean conexionOk = verificarConexionBD();
            
            if (!conexionOk) {
                logger.warn("Database health check: DOWN - Sin conexión");
                return Health.down()
                    .withDetail("database", "Main Database")
                    .withDetail("status", "Connection Failed")
                    .withDetail("timestamp", Instant.now())
                    .build();
            }
            
            // Verificar que se pueden ejecutar queries
            boolean queriesOk = verificarQueriesBD();
            
            if (!queriesOk) {
                logger.warn("Database health check: DOWN - Queries fallan");
                return Health.down()
                    .withDetail("database", "Main Database")
                    .withDetail("status", "Query Execution Failed")
                    .withDetail("timestamp", Instant.now())
                    .build();
            }
            
            // Verificar espacio en disco (simulado)
            boolean espacioOk = verificarEspacioDisco();
            
            if (!espacioOk) {
                logger.warn("Database health check: WARNING - Poco espacio en disco");
                return Health.status("WARNING")
                    .withDetail("database", "Main Database")
                    .withDetail("status", "Low Disk Space")
                    .withDetail("warning", "Espacio en disco bajo")
                    .withDetail("timestamp", Instant.now())
                    .build();
            }
            
            // Todo funcionando correctamente
            logger.debug("Database health check: UP");
            return Health.up()
                .withDetail("database", "Main Database")
                .withDetail("status", "Operational")
                .withDetail("connection", "Active")
                .withDetail("queries", "Working")
                .withDetail("disk_space", "Sufficient")
                .withDetail("timestamp", Instant.now())
                .build();
                
        } catch (Exception e) {
            logger.error("Error en health check de base de datos: {}", e.getMessage(), e);
            return Health.down()
                .withDetail("database", "Main Database")
                .withDetail("status", "Error")
                .withDetail("error", e.getMessage())
                .withDetail("timestamp", Instant.now())
                .build();
        }
    }
    
    // Verificar conexión a la base de datos
    private boolean verificarConexionBD() {
        try {
            // Intentar obtener una conexión
            try (Connection connection = dataSource.getConnection()) {
                return connection.isValid(5); // Timeout de 5 segundos
            }
        } catch (Exception e) {
            logger.warn("Error verificando conexión a BD: {}", e.getMessage());
            return false;
        }
    }
    
    // Verificar que se pueden ejecutar queries
    private boolean verificarQueriesBD() {
        try {
            // Ejecutar query simple de prueba
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception e) {
            logger.warn("Error verificando queries de BD: {}", e.getMessage());
            return false;
        }
    }
    
    // Verificar espacio en disco (simulado)
    private boolean verificarEspacioDisco() {
        try {
            // Simular verificación de espacio en disco
            // En un caso real, se usaría File.getFreeSpace() o similar
            return Math.random() > 0.1; // 90% de probabilidad de tener espacio
        } catch (Exception e) {
            logger.warn("Error verificando espacio en disco: {}", e.getMessage());
            return false;
        }
    }
}
```

---

### 5. Ejemplo de Código: Health Check para Servicios Externos

```java
// Health check para servicios externos
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {
    
    private static final Logger logger = LoggerFactory.getLogger(ExternalServiceHealthIndicator.class);
    
    // RestTemplate para llamadas HTTP
    @Autowired
    private RestTemplate restTemplate;
    
    // Configuración de timeouts
    private static final int TIMEOUT_SECONDS = 5;
    
    @Override
    public Health health() {
        logger.debug("Ejecutando health check para servicios externos");
        
        Map<String, Object> detalles = new HashMap<>();
        boolean todosLosServiciosOk = true;
        
        // Verificar servicio de validación de email
        boolean emailServiceOk = verificarServicioEmail();
        detalles.put("email-validation-service", emailServiceOk ? "UP" : "DOWN");
        if (!emailServiceOk) todosLosServiciosOk = false;
        
        // Verificar servicio de notificaciones
        boolean notificationServiceOk = verificarServicioNotificaciones();
        detalles.put("notification-service", notificationServiceOk ? "UP" : "DOWN");
        if (!notificationServiceOk) todosLosServiciosOk = false;
        
        // Verificar servicio de pagos
        boolean paymentServiceOk = verificarServicioPagos();
        detalles.put("payment-service", paymentServiceOk ? "UP" : "DOWN");
        if (!paymentServiceOk) todosLosServiciosOk = false;
        
        detalles.put("timestamp", Instant.now());
        
        if (todosLosServiciosOk) {
            logger.debug("External services health check: UP");
            return Health.up()
                .withDetails(detalles)
                .build();
        } else {
            logger.warn("External services health check: DOWN - Algunos servicios no disponibles");
            return Health.down()
                .withDetails(detalles)
                .build();
        }
    }
    
    // Verificar servicio de validación de email
    private boolean verificarServicioEmail() {
        try {
            String url = "http://email-validation-service/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.warn("Email validation service no disponible: {}", e.getMessage());
            return false;
        }
    }
    
    // Verificar servicio de notificaciones
    private boolean verificarServicioNotificaciones() {
        try {
            String url = "http://notification-service/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.warn("Notification service no disponible: {}", e.getMessage());
            return false;
        }
    }
    
    // Verificar servicio de pagos
    private boolean verificarServicioPagos() {
        try {
            String url = "http://payment-service/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.warn("Payment service no disponible: {}", e.getMessage());
            return false;
        }
    }
}
```

---

### 6. Pruebas Unitarias para Health Checks

```java
// Pruebas unitarias para health checks
@SpringBootTest
public class HealthCheckTest {
    
    @Autowired
    private UsuarioServiceHealthIndicator usuarioHealthIndicator;
    
    @Autowired
    private DatabaseHealthIndicator databaseHealthIndicator;
    
    @Autowired
    private ExternalServiceHealthIndicator externalHealthIndicator;
    
    @Test
    public void testUsuarioServiceHealthCheck() {
        // Ejecutar health check
        Health health = usuarioHealthIndicator.health();
        
        // Verificar que se generó un health check válido
        assertNotNull(health);
        assertNotNull(health.getStatus());
        assertNotNull(health.getDetails());
        
        // Verificar que contiene información del servicio
        assertTrue(health.getDetails().containsKey("service"));
        assertEquals("UsuarioService", health.getDetails().get("service"));
    }
    
    @Test
    public void testDatabaseHealthCheck() {
        // Ejecutar health check
        Health health = databaseHealthIndicator.health();
        
        // Verificar que se generó un health check válido
        assertNotNull(health);
        assertNotNull(health.getStatus());
        assertNotNull(health.getDetails());
        
        // Verificar que contiene información de la base de datos
        assertTrue(health.getDetails().containsKey("database"));
        assertEquals("Main Database", health.getDetails().get("database"));
    }
    
    @Test
    public void testExternalServiceHealthCheck() {
        // Ejecutar health check
        Health health = externalHealthIndicator.health();
        
        // Verificar que se generó un health check válido
        assertNotNull(health);
        assertNotNull(health.getStatus());
        assertNotNull(health.getDetails());
        
        // Verificar que contiene información de servicios externos
        assertTrue(health.getDetails().containsKey("email-validation-service"));
        assertTrue(health.getDetails().containsKey("notification-service"));
        assertTrue(health.getDetails().containsKey("payment-service"));
    }
}
```

---

### 7. Mejoras y Patrones de Diseño

- **Health Check Aggregation**: Combinar múltiples health checks en uno solo
- **Circuit Breaker**: Implementar circuit breakers para servicios externos
- **Caching**: Cachear resultados de health checks para mejorar rendimiento
- **Async Health Checks**: Ejecutar health checks de forma asíncrona
- **Custom Health Groups**: Agrupar health checks por funcionalidad

---

### 8. Resultados Esperados y Manejo de Errores

#### 8.1. Escenarios exitosos

- **Todos los servicios funcionando**:
    - Health check retorna status "UP"
    - Detalles completos de cada componente
    - Información de timestamp disponible

#### 8.2. Escenarios de error

- **Servicio de base de datos caído**:
    - Health check retorna status "DOWN"
    - Detalles específicos del error
    - Información de diagnóstico incluida

- **Servicios externos no disponibles**:
    - Health check retorna status "DOWN"
    - Lista de servicios afectados
    - Información de conectividad

---

### 9. Explicación Detallada de la Lógica

- **Spring Boot Actuator**: Proporciona endpoints de health automáticamente
- **HealthIndicator Interface**: Permite crear health checks personalizados
- **Health Status**: UP, DOWN, WARNING, UNKNOWN
- **Health Details**: Información adicional sobre el estado
- **Integration**: Se integra con Kubernetes, load balancers y sistemas de monitoreo

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, "Configuration Management" o "Backup & Recovery")? 