# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Métricas y Monitoreo (Prometheus, Grafana, Micrometer)

---

### 1. Introducción y Teoría

El monitoreo y las métricas son fundamentales para mantener microservicios saludables y detectar problemas proactivamente. Los componentes principales incluyen:

- **Prometheus**: Sistema de monitoreo y alertas de código abierto.
- **Grafana**: Plataforma de visualización y análisis de métricas.
- **Micrometer**: Biblioteca para exponer métricas de aplicaciones Java.
- **Health Checks**: Verificaciones de salud de los servicios.

---

### 2. Ejemplo de Código: Configuración de Métricas con Micrometer

#### 2.1. Configuración de Micrometer en Spring Boot

```java
// Configuración de métricas con Micrometer
@Configuration
public class MetricsConfig {
    
    // Bean para el registro de métricas
    @Bean
    public MeterRegistry meterRegistry() {
        // Crea un registro de métricas con Prometheus
        PrometheusMeterRegistry prometheusRegistry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
        // Configura el endpoint para exponer métricas
        prometheusRegistry.config().commonTags("application", "microservice-demo");
        return prometheusRegistry;
    }
    
    // Bean para exponer métricas en endpoint /actuator/prometheus
    @Bean
    public PrometheusMeterRegistry prometheusMeterRegistry() {
        // Configura el registro específico para Prometheus
        return new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
    }
}
```

#### 2.2. Servicio con métricas personalizadas

```java
// Servicio de usuarios con métricas integradas
@Service
public class UsuarioService {
    
    // Contador para usuarios creados
    private final Counter usuariosCreadosCounter;
    
    // Timer para medir tiempo de respuesta
    private final Timer tiempoRespuestaTimer;
    
    // Gauge para número de usuarios activos
    private final Gauge usuariosActivosGauge;
    
    // Constructor con inyección de MeterRegistry
    public UsuarioService(MeterRegistry meterRegistry) {
        // Inicializa el contador de usuarios creados
        this.usuariosCreadosCounter = Counter.builder("usuarios.creados")
                .description("Número total de usuarios creados")
                .register(meterRegistry);
        
        // Inicializa el timer para medir tiempo de respuesta
        this.tiempoRespuestaTimer = Timer.builder("usuarios.tiempo.respuesta")
                .description("Tiempo de respuesta para operaciones de usuarios")
                .register(meterRegistry);
        
        // Inicializa el gauge para usuarios activos
        this.usuariosActivosGauge = Gauge.builder("usuarios.activos")
                .description("Número de usuarios activos")
                .register(meterRegistry, this, UsuarioService::getUsuariosActivos);
    }
    
    // Método para crear usuario con métricas
    public Usuario crearUsuario(UsuarioRequest request) {
        // Inicia el timer para medir tiempo de respuesta
        Timer.Sample sample = Timer.start();
        
        try {
            // Lógica de creación de usuario
            Usuario usuario = new Usuario();
            usuario.setNombre(request.getNombre());
            usuario.setEmail(request.getEmail());
            
            // Incrementa el contador de usuarios creados
            usuariosCreadosCounter.increment();
            
            // Simula persistencia
            Thread.sleep(100);
            
            return usuario;
        } finally {
            // Detiene el timer y registra el tiempo
            sample.stop(tiempoRespuestaTimer);
        }
    }
    
    // Método para obtener número de usuarios activos (usado por el gauge)
    private double getUsuariosActivos() {
        // Simula consulta a base de datos
        return Math.random() * 1000;
    }
}
```

---

### 3. Ejemplo de Código: Health Checks

#### 3.1. Health Check personalizado

```java
// Health check personalizado para verificar conectividad a base de datos
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try {
            // Intenta obtener una conexión a la base de datos
            try (Connection connection = dataSource.getConnection()) {
                // Ejecuta una consulta simple para verificar conectividad
                try (PreparedStatement statement = connection.prepareStatement("SELECT 1")) {
                    ResultSet resultSet = statement.executeQuery();
                    if (resultSet.next()) {
                        // Si la consulta es exitosa, el servicio está UP
                        return Health.up()
                                .withDetail("database", "available")
                                .withDetail("response_time", "10ms")
                                .build();
                    }
                }
            }
            // Si no se puede conectar, el servicio está DOWN
            return Health.down()
                    .withDetail("database", "unavailable")
                    .withDetail("error", "Cannot connect to database")
                    .build();
        } catch (Exception e) {
            // Si hay excepción, el servicio está DOWN
            return Health.down()
                    .withDetail("database", "error")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
```

#### 3.2. Health Check para servicios externos

```java
// Health check para verificar conectividad a servicios externos
@Component
public class ExternalServiceHealthIndicator implements HealthIndicator {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Override
    public Health health() {
        try {
            // Intenta hacer una petición al servicio externo
            ResponseEntity<String> response = restTemplate.getForEntity(
                "http://external-service/health", String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                // Si la respuesta es exitosa, el servicio está UP
                return Health.up()
                        .withDetail("external_service", "available")
                        .withDetail("response_time", response.getHeaders().getFirst("X-Response-Time"))
                        .build();
            } else {
                // Si la respuesta no es exitosa, el servicio está DOWN
                return Health.down()
                        .withDetail("external_service", "unavailable")
                        .withDetail("status_code", response.getStatusCodeValue())
                        .build();
            }
        } catch (Exception e) {
            // Si hay excepción, el servicio está DOWN
            return Health.down()
                    .withDetail("external_service", "error")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
```

---

### 4. Ejemplo de Código: Alertas y Notificaciones

#### 4.1. Servicio de alertas

```java
// Servicio para enviar alertas cuando se detectan problemas
@Service
public class AlertService {
    
    // Logger para registrar alertas
    private static final Logger logger = LoggerFactory.getLogger(AlertService.class);
    
    // Método para enviar alerta de error
    public void enviarAlertaError(String servicio, String mensaje, Map<String, Object> detalles) {
        // Construye el mensaje de alerta
        String alerta = String.format("ALERTA: Servicio %s - %s", servicio, mensaje);
        
        // Registra la alerta en el log
        logger.error(alerta, detalles);
        
        // Aquí se podría integrar con sistemas de notificación como:
        // - Slack
        // - Email
        // - PagerDuty
        // - Teams
        
        // Ejemplo: enviar a Slack
        enviarAlertaSlack(alerta, detalles);
    }
    
    // Método para enviar alerta a Slack
    private void enviarAlertaSlack(String mensaje, Map<String, Object> detalles) {
        try {
            // Construye el payload para Slack
            Map<String, Object> payload = new HashMap<>();
            payload.put("text", mensaje);
            payload.put("attachments", Arrays.asList(detalles));
            
            // Envía la petición a Slack (simulado)
            // En producción, usar WebClient o RestTemplate
            logger.info("Alerta enviada a Slack: {}", mensaje);
        } catch (Exception e) {
            logger.error("Error enviando alerta a Slack", e);
        }
    }
}
```

---

### 5. Pruebas Unitarias para Métricas y Monitoreo

#### 5.1. Prueba de métricas

```java
// Prueba unitaria para métricas
@SpringBootTest
public class MetricsTest {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @Test
    public void testUsuarioCreadoMetric() {
        // Crea un usuario
        UsuarioRequest request = new UsuarioRequest("Juan", "juan@email.com");
        usuarioService.crearUsuario(request);
        
        // Verifica que el contador se incrementó
        Counter counter = meterRegistry.counter("usuarios.creados");
        assertEquals(1.0, counter.count(), 0.01);
    }
    
    @Test
    public void testTiempoRespuestaMetric() {
        // Crea un usuario y mide el tiempo
        UsuarioRequest request = new UsuarioRequest("Ana", "ana@email.com");
        usuarioService.crearUsuario(request);
        
        // Verifica que el timer registró el tiempo
        Timer timer = meterRegistry.timer("usuarios.tiempo.respuesta");
        assertTrue(timer.count() > 0);
        assertTrue(timer.totalTime(TimeUnit.MILLISECONDS) > 0);
    }
}
```

#### 5.2. Prueba de health checks

```java
// Prueba unitaria para health checks
@SpringBootTest
public class HealthCheckTest {
    
    @Autowired
    private HealthIndicator databaseHealthIndicator;
    
    @Test
    public void testDatabaseHealthCheck() {
        // Ejecuta el health check
        Health health = databaseHealthIndicator.health();
        
        // Verifica que el health check devuelve un estado válido
        assertNotNull(health);
        assertNotNull(health.getStatus());
        
        // Verifica que incluye detalles
        Map<String, Object> details = health.getDetails();
        assertNotNull(details);
        assertTrue(details.containsKey("database"));
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Dashboards personalizados**: Crear dashboards específicos para cada microservicio.
- **Alertas inteligentes**: Usar machine learning para detectar anomalías.
- **Tracing distribuido**: Integrar con Jaeger o Zipkin para seguimiento de peticiones.
- **Auto-scaling basado en métricas**: Usar métricas para escalar automáticamente.
- **SLA monitoring**: Monitorear acuerdos de nivel de servicio.

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Métricas recolectadas**:
    - Contador de usuarios creados incrementado → Métrica visible en Prometheus.
    - Timer de tiempo de respuesta registrado → Histograma disponible en Grafana.
    - Gauge de usuarios activos actualizado → Valor en tiempo real.
- **Health checks**:
    - Base de datos disponible → Health check UP.
    - Servicio externo respondiendo → Health check UP.

#### 7.2. Escenarios de error

- **Métricas**:
    - Error al registrar métrica → Log de error, métrica no registrada.
    - Prometheus no disponible → Métricas acumuladas en buffer.
- **Health checks**:
    - Base de datos no disponible → Health check DOWN, alerta enviada.
    - Servicio externo caído → Health check DOWN, notificación automática.

---

### 8. Explicación Detallada de la Lógica

- **Micrometer**: Proporciona una abstracción para registrar métricas que pueden ser exportadas a diferentes sistemas.
- **Prometheus**: Recolecta métricas mediante polling y las almacena en una base de datos de series temporales.
- **Grafana**: Visualiza las métricas recolectadas por Prometheus en dashboards interactivos.
- **Health Checks**: Verifican la salud de los servicios y sus dependencias para detectar problemas proactivamente.

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, "Logging Centralizado" o "Distributed Tracing")? 