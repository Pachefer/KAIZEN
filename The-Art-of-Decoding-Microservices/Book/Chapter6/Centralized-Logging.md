# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Logging Centralizado (ELK Stack, Graylog, Logback)

---

### 1. Introducción y Teoría

El logging centralizado es fundamental en arquitecturas de microservicios para recopilar, almacenar y analizar logs de múltiples servicios. Los componentes principales incluyen:

- **ELK Stack**: Elasticsearch, Logstash, Kibana para recopilación y visualización de logs.
- **Graylog**: Plataforma de gestión de logs empresarial.
- **Logback**: Framework de logging para Java con configuración avanzada.
- **Structured Logging**: Logs estructurados en formato JSON para mejor análisis.

---

### 2. Ejemplo de Código: Configuración de Logging con Logback

#### 2.1. Configuración de Logback (logback-spring.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Configuración para desarrollo -->
    <springProfile name="dev">
        <!-- Appender para consola con formato JSON -->
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <!-- Incluye timestamp en formato ISO -->
                    <timestamp/>
                    <!-- Incluye nivel de log -->
                    <logLevel/>
                    <!-- Incluye nombre del logger -->
                    <loggerName/>
                    <!-- Incluye mensaje del log -->
                    <message/>
                    <!-- Incluye MDC (Mapped Diagnostic Context) -->
                    <mdc/>
                    <!-- Incluye stack trace si existe -->
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>
        
        <!-- Configuración del logger raíz -->
        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
        </root>
    </springProfile>
    
    <!-- Configuración para producción -->
    <springProfile name="prod">
        <!-- Appender para archivo con rotación -->
        <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>logs/application.log</file>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>logs/application.%d{yyyy-MM-dd}.%i.log</fileNamePattern>
                <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                    <maxFileSize>100MB</maxFileSize>
                </timeBasedFileNamingAndTriggeringPolicy>
                <maxHistory>30</maxHistory>
            </rollingPolicy>
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>
        
        <root level="INFO">
            <appender-ref ref="FILE"/>
        </root>
    </springProfile>
</configuration>
```

#### 2.2. Servicio con Logging Estructurado

```java
// Servicio de usuarios con logging estructurado
@Service
public class UsuarioService {
    
    // Logger para esta clase
    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    
    // Método para crear un usuario con logging detallado
    public Usuario crearUsuario(UsuarioRequest request) {
        // Log de inicio de operación
        logger.info("Iniciando creación de usuario", 
            StructuredArguments.kv("email", request.getEmail()),
            StructuredArguments.kv("operation", "CREATE_USER"));
        
        try {
            // Validación de datos
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                logger.warn("Intento de crear usuario con email vacío",
                    StructuredArguments.kv("operation", "CREATE_USER"),
                    StructuredArguments.kv("error", "EMAIL_REQUIRED"));
                throw new IllegalArgumentException("Email es requerido");
            }
            
            // Lógica de creación
            Usuario usuario = new Usuario();
            usuario.setEmail(request.getEmail());
            usuario.setNombre(request.getNombre());
            
            // Simula persistencia
            Thread.sleep(100);
            
            // Log de éxito
            logger.info("Usuario creado exitosamente",
                StructuredArguments.kv("userId", usuario.getId()),
                StructuredArguments.kv("email", usuario.getEmail()),
                StructuredArguments.kv("operation", "CREATE_USER"),
                StructuredArguments.kv("status", "SUCCESS"));
            
            return usuario;
            
        } catch (Exception e) {
            // Log de error
            logger.error("Error al crear usuario",
                StructuredArguments.kv("email", request.getEmail()),
                StructuredArguments.kv("operation", "CREATE_USER"),
                StructuredArguments.kv("error", e.getMessage()),
                StructuredArguments.kv("status", "ERROR"),
                e);
            throw e;
        }
    }
    
    // Método para buscar usuario por ID
    public Usuario buscarPorId(Long id) {
        // Log de inicio de búsqueda
        logger.debug("Buscando usuario por ID",
            StructuredArguments.kv("userId", id),
            StructuredArguments.kv("operation", "FIND_USER"));
        
        // Simula búsqueda
        Usuario usuario = new Usuario();
        usuario.setId(id);
        
        if (usuario != null) {
            logger.debug("Usuario encontrado",
                StructuredArguments.kv("userId", id),
                StructuredArguments.kv("operation", "FIND_USER"),
                StructuredArguments.kv("status", "FOUND"));
        } else {
            logger.warn("Usuario no encontrado",
                StructuredArguments.kv("userId", id),
                StructuredArguments.kv("operation", "FIND_USER"),
                StructuredArguments.kv("status", "NOT_FOUND"));
        }
        
        return usuario;
    }
}
```

---

### 3. Ejemplo de Código: Integración con ELK Stack

#### 3.1. Configuración de Logstash (logstash.conf)

```ruby
# Configuración de Logstash para procesar logs de microservicios
input {
  # Entrada desde archivo de logs
  file {
    path => "/var/log/microservices/*.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
  
  # Entrada desde beats (opcional)
  beats {
    port => 5044
  }
}

filter {
  # Parseo de logs JSON
  if [message] =~ /^\{.*\}$/ {
    json {
      source => "message"
    }
  }
  
  # Extracción de campos adicionales
  grok {
    match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:logger} %{GREEDYDATA:msg}" }
  }
  
  # Añadir metadatos
  mutate {
    add_field => { "service" => "microservice-demo" }
    add_field => { "environment" => "%{ENVIRONMENT}" }
  }
  
  # Filtro de geoip para logs de acceso
  if [client_ip] {
    geoip {
      source => "client_ip"
      target => "geoip"
    }
  }
}

output {
  # Salida a Elasticsearch
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "microservices-logs-%{+YYYY.MM.dd}"
  }
  
  # Salida a consola para debugging
  stdout {
    codec => rubydebug
  }
}
```

#### 3.2. Configuración de Filebeat (filebeat.yml)

```yaml
# Configuración de Filebeat para enviar logs a Logstash
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/microservices/*.log
  json.keys_under_root: true
  json.add_error_key: true
  json.message_key: message

processors:
- add_host_metadata: ~
- add_cloud_metadata: ~

output.logstash:
  hosts: ["localhost:5044"]

logging.level: info
```

---

### 4. Ejemplo de Código: Logging con MDC (Mapped Diagnostic Context)

```java
// Interceptor para añadir información de contexto a los logs
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Genera un ID único para la petición
        String requestId = UUID.randomUUID().toString();
        
        // Añade información al contexto MDC
        MDC.put("requestId", requestId);
        MDC.put("clientIp", getClientIpAddress(request));
        MDC.put("userAgent", request.getHeader("User-Agent"));
        MDC.put("endpoint", request.getRequestURI());
        MDC.put("method", request.getMethod());
        
        // Log de inicio de petición
        logger.info("Petición recibida",
            StructuredArguments.kv("requestId", requestId),
            StructuredArguments.kv("clientIp", getClientIpAddress(request)),
            StructuredArguments.kv("endpoint", request.getRequestURI()),
            StructuredArguments.kv("method", request.getMethod()));
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // Log de fin de petición
        logger.info("Petición completada",
            StructuredArguments.kv("requestId", MDC.get("requestId")),
            StructuredArguments.kv("statusCode", response.getStatus()),
            StructuredArguments.kv("duration", System.currentTimeMillis()));
        
        // Limpia el contexto MDC
        MDC.clear();
    }
    
    // Método para obtener la IP real del cliente
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
```

---

### 5. Pruebas Unitarias para Logging

```java
// Prueba unitaria para verificar logging
@SpringBootTest
public class LoggingTest {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Test
    public void testLoggingOnUserCreation() {
        // Captura los logs durante la ejecución
        try (CapturedOutput output = new CapturedOutput()) {
            // Crea un usuario
            UsuarioRequest request = new UsuarioRequest("test@email.com", "Test User");
            usuarioService.crearUsuario(request);
            
            // Verifica que se generaron logs
            String logs = output.toString();
            assertTrue(logs.contains("Iniciando creación de usuario"));
            assertTrue(logs.contains("Usuario creado exitosamente"));
            assertTrue(logs.contains("test@email.com"));
        }
    }
    
    @Test
    public void testLoggingOnError() {
        // Captura los logs durante la ejecución
        try (CapturedOutput output = new CapturedOutput()) {
            // Intenta crear usuario con email vacío
            UsuarioRequest request = new UsuarioRequest("", "Test User");
            
            try {
                usuarioService.crearUsuario(request);
                fail("Debería haber lanzado una excepción");
            } catch (IllegalArgumentException e) {
                // Verifica que se generó log de error
                String logs = output.toString();
                assertTrue(logs.contains("Intento de crear usuario con email vacío"));
                assertTrue(logs.contains("EMAIL_REQUIRED"));
            }
        }
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Log Aggregation**: Centralizar logs de múltiples servicios en un solo lugar.
- **Structured Logging**: Usar formato JSON para facilitar el análisis.
- **Log Levels**: Configurar niveles apropiados para diferentes entornos.
- **Performance Monitoring**: Incluir métricas de rendimiento en los logs.
- **Security Logging**: Registrar eventos de seguridad y auditoría.

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Log de creación de usuario**:
    - Se genera log estructurado con información completa.
    - Log visible en Elasticsearch/Kibana.
    - Información de contexto disponible (requestId, clientIp, etc.).

#### 7.2. Escenarios de error

- **Error de configuración**:
    - Logstash no puede procesar logs → Logs acumulados en buffer.
    - Elasticsearch no disponible → Logs perdidos temporalmente.
- **Error de aplicación**:
    - Excepción capturada y loggeada con stack trace.
    - Información de contexto preservada.

---

### 8. Explicación Detallada de la Lógica

- **Logback**: Framework de logging que permite configuración flexible y múltiples appenders.
- **Structured Logging**: Logs en formato JSON que facilitan el análisis y búsqueda.
- **MDC**: Permite añadir información contextual a todos los logs de una petición.
- **ELK Stack**: Proporciona recopilación, procesamiento y visualización de logs.
- **Filebeat**: Agente ligero para enviar logs a Logstash o Elasticsearch.

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, "Distributed Tracing" o "Health Checks")? 