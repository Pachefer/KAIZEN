# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Distributed Tracing (Jaeger, Zipkin, Sleuth)

---

### 1. Introducción y Teoría

El **Distributed Tracing** es fundamental en microservicios para rastrear el flujo de peticiones a través de múltiples servicios. Permite:

- **Visualizar el flujo de peticiones** entre servicios
- **Identificar cuellos de botella** en la comunicación
- **Debuggear problemas** de latencia y errores
- **Monitorear el rendimiento** de cada servicio

**Componentes principales:**
- **Jaeger**: Plataforma de tracing distribuido de Uber
- **Zipkin**: Sistema de tracing distribuido de Twitter
- **Spring Cloud Sleuth**: Integración de tracing para Spring Boot

---

### 2. Ejemplo de Código: Configuración de Spring Cloud Sleuth

#### 2.1. Dependencias en pom.xml

```xml
<!-- Dependencia para Spring Cloud Sleuth -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>

<!-- Dependencia para exportar traces a Zipkin -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>
```

#### 2.2. Configuración en application.yml

```yaml
# Configuración de Sleuth y Zipkin
spring:
  application:
    name: usuario-service  # Nombre del servicio para identificar en traces
  
  sleuth:
    sampler:
      probability: 1.0  # Muestra el 100% de las peticiones
    web:
      client:
        enabled: true  # Habilita tracing para RestTemplate
    messaging:
      enabled: true  # Habilita tracing para mensajes
    redis:
      enabled: true  # Habilita tracing para Redis
    jdbc:
      enabled: true  # Habilita tracing para JDBC

# Configuración de Zipkin
zipkin:
  base-url: http://localhost:9411  # URL del servidor Zipkin
  sender:
    type: web  # Envía traces via HTTP
```

---

### 3. Ejemplo de Código: Servicio con Tracing

```java
// Servicio de usuarios con tracing distribuido
@Service
@Slf4j  // Anotación de Lombok para logging
public class UsuarioService {
    
    // RestTemplate para llamadas HTTP a otros servicios
    @Autowired
    private RestTemplate restTemplate;
    
    // Método para crear usuario con tracing
    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        // Log con información de trace
        log.info("Iniciando creación de usuario: {}", request.getEmail());
        
        try {
            // Validación de datos
            validarUsuario(request);
            
            // Llamada a servicio de validación de email
            boolean emailValido = validarEmailExterno(request.getEmail());
            
            if (!emailValido) {
                log.warn("Email inválido: {}", request.getEmail());
                throw new IllegalArgumentException("Email inválido");
            }
            
            // Crear usuario
            Usuario usuario = new Usuario();
            usuario.setEmail(request.getEmail());
            usuario.setNombre(request.getNombre());
            usuario.setId(generarId());
            
            // Llamada a servicio de notificación
            enviarNotificacionBienvenida(usuario);
            
            log.info("Usuario creado exitosamente: {}", usuario.getId());
            return new UsuarioResponse(usuario.getId(), usuario.getEmail(), "CREATED");
            
        } catch (Exception e) {
            log.error("Error al crear usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Método para validar email llamando a servicio externo
    private boolean validarEmailExterno(String email) {
        log.info("Validando email externamente: {}", email);
        
        try {
            // Llamada HTTP a servicio de validación
            String url = "http://email-validation-service/validate?email=" + email;
            ResponseEntity<ValidacionResponse> response = restTemplate.getForEntity(
                url, 
                ValidacionResponse.class
            );
            
            log.info("Respuesta de validación: {}", response.getBody().isValido());
            return response.getBody().isValido();
            
        } catch (Exception e) {
            log.error("Error en validación de email: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para enviar notificación de bienvenida
    private void enviarNotificacionBienvenida(Usuario usuario) {
        log.info("Enviando notificación de bienvenida para: {}", usuario.getEmail());
        
        try {
            // Llamada HTTP a servicio de notificaciones
            String url = "http://notification-service/send";
            NotificacionRequest notifRequest = new NotificacionRequest(
                usuario.getEmail(), 
                "Bienvenido a nuestro servicio!"
            );
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                url, 
                notifRequest, 
                String.class
            );
            
            log.info("Notificación enviada: {}", response.getStatusCode());
            
        } catch (Exception e) {
            log.error("Error enviando notificación: {}", e.getMessage(), e);
            // No lanzamos excepción para no fallar la creación del usuario
        }
    }
    
    // Método para buscar usuario con tracing
    public UsuarioResponse buscarUsuario(Long id) {
        log.info("Buscando usuario con ID: {}", id);
        
        try {
            // Simular búsqueda en base de datos
            Thread.sleep(50); // Simula latencia de BD
            
            Usuario usuario = new Usuario();
            usuario.setId(id);
            usuario.setEmail("usuario" + id + "@example.com");
            usuario.setNombre("Usuario " + id);
            
            log.info("Usuario encontrado: {}", id);
            return new UsuarioResponse(usuario.getId(), usuario.getEmail(), "FOUND");
            
        } catch (Exception e) {
            log.error("Error buscando usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Métodos auxiliares
    private void validarUsuario(UsuarioRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email es requerido");
        }
    }
    
    private Long generarId() {
        return System.currentTimeMillis();
    }
}
```

---

### 4. Ejemplo de Código: Configuración de RestTemplate con Tracing

```java
// Configuración de RestTemplate con tracing automático
@Configuration
public class RestTemplateConfig {
    
    @Bean
    @LoadBalanced  // Para usar con Eureka/Consul
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    // Interceptor para añadir headers de tracing
    @Bean
    public RestTemplateInterceptor tracingInterceptor() {
        return new RestTemplateInterceptor();
    }
}

// Interceptor personalizado para tracing
@Component
public class RestTemplateInterceptor implements ClientHttpRequestInterceptor {
    
    @Override
    public ClientHttpResponse intercept(
            HttpRequest request, 
            byte[] body, 
            ClientHttpRequestExecution execution) throws IOException {
        
        // Añadir headers de tracing si están disponibles
        if (Tracer.currentSpan() != null) {
            Span span = Tracer.currentSpan();
            request.getHeaders().add("X-B3-TraceId", span.context().traceIdString());
            request.getHeaders().add("X-B3-SpanId", span.context().spanIdString());
        }
        
        return execution.execute(request, body);
    }
}
```

---

### 5. Ejemplo de Código: Controlador REST con Tracing

```java
// Controlador REST con tracing automático
@RestController
@RequestMapping("/api/usuarios")
@Slf4j
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    // Endpoint para crear usuario
    @PostMapping
    public ResponseEntity<UsuarioResponse> crearUsuario(@RequestBody UsuarioRequest request) {
        log.info("Recibida petición para crear usuario: {}", request.getEmail());
        
        try {
            UsuarioResponse response = usuarioService.crearUsuario(request);
            log.info("Usuario creado exitosamente: {}", response.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Error de validación: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
            
        } catch (Exception e) {
            log.error("Error interno: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Endpoint para buscar usuario
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarUsuario(@PathVariable Long id) {
        log.info("Recibida petición para buscar usuario: {}", id);
        
        try {
            UsuarioResponse response = usuarioService.buscarUsuario(id);
            log.info("Usuario encontrado: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error buscando usuario: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

---

### 6. Pruebas Unitarias para Tracing

```java
// Pruebas unitarias para verificar tracing
@SpringBootTest
@AutoConfigureTestDatabase
public class TracingTest {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @MockBean
    private RestTemplate restTemplate;
    
    @Test
    public void testTracingOnUserCreation() {
        // Configurar mock para validación de email
        ValidacionResponse validacionResponse = new ValidacionResponse(true);
        when(restTemplate.getForEntity(
            anyString(), 
            eq(ValidacionResponse.class)
        )).thenReturn(ResponseEntity.ok(validacionResponse));
        
        // Configurar mock para notificación
        when(restTemplate.postForEntity(
            anyString(), 
            any(), 
            eq(String.class)
        )).thenReturn(ResponseEntity.ok("OK"));
        
        // Crear usuario
        UsuarioRequest request = new UsuarioRequest("test@email.com", "Test User");
        UsuarioResponse response = usuarioService.crearUsuario(request);
        
        // Verificar que se generó respuesta
        assertNotNull(response);
        assertEquals("test@email.com", response.getEmail());
        assertEquals("CREATED", response.getStatus());
        
        // Verificar que se realizaron las llamadas HTTP
        verify(restTemplate, times(1)).getForEntity(anyString(), eq(ValidacionResponse.class));
        verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(String.class));
    }
    
    @Test
    public void testTracingOnUserSearch() {
        // Buscar usuario
        UsuarioResponse response = usuarioService.buscarUsuario(1L);
        
        // Verificar respuesta
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("FOUND", response.getStatus());
    }
}
```

---

### 7. Mejoras y Patrones de Diseño

- **Sampling**: Configurar muestreo para reducir overhead en producción
- **Custom Spans**: Crear spans personalizados para operaciones específicas
- **Baggage**: Añadir información contextual a los traces
- **Error Tracking**: Integrar con sistemas de monitoreo de errores
- **Performance Monitoring**: Usar traces para análisis de rendimiento

---

### 8. Resultados Esperados y Manejo de Errores

#### 8.1. Escenarios exitosos

- **Creación de usuario exitosa**:
    - Trace completo visible en Jaeger/Zipkin
    - Spans para validación, creación y notificación
    - Información de latencia de cada operación

#### 8.2. Escenarios de error

- **Error en validación de email**:
    - Trace muestra dónde falló la operación
    - Información de error en el span correspondiente
- **Error en servicio de notificación**:
    - Trace continúa pero marca el error
    - Usuario se crea aunque falle la notificación

---

### 9. Explicación Detallada de la Lógica

- **Spring Cloud Sleuth**: Automáticamente genera trace IDs y span IDs
- **Propagación de contexto**: Los headers de tracing se propagan entre servicios
- **Integración con Zipkin**: Los traces se envían automáticamente al servidor Zipkin
- **Visualización**: Zipkin/Jaeger muestran el flujo completo de la petición
- **Análisis de rendimiento**: Permite identificar cuellos de botella en la comunicación

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, "Health Checks" o "Configuration Management")? 