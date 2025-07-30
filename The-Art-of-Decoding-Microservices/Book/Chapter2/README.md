# Capítulo 2: Visión General de Microservicios

## Descripción

Este capítulo explora los conceptos fundamentales de microservicios, incluyendo el Principio de Responsabilidad Única (SRP), Independencia y Autonomía, y los patrones de comunicación entre servicios. Cada concepto se ilustra con ejemplos de código detallados, pruebas unitarias y mejores prácticas.

## Estructura del Capítulo

### 📁 Archivos del Capítulo

1. **`Introduccion.md`** - Visión general y conceptos fundamentales
2. **`Principio-Responsabilidad-Unica.md`** - Ejemplos detallados del SRP
3. **`Independencia-Autonomia.md`** - Patrones de independencia y autonomía
4. **`Comunicacion-Microservicios.md`** - Patrones de comunicación
5. **`Comparacion-Concepciones.md`** - Comparación y conclusiones
6. **`README.md`** - Este archivo de instrucciones

## Conceptos Clave

### 1. Principio de Responsabilidad Única (SRP)
- **Definición**: Cada microservicio debe tener una única responsabilidad
- **Beneficios**: Mantenibilidad, testabilidad, escalabilidad independiente
- **Ejemplos**: Servicios separados para usuarios, pagos, inventario

### 2. Independencia y Autonomía
- **Definición**: Cada servicio puede funcionar sin depender de otros
- **Beneficios**: Despliegue independiente, resiliencia, desarrollo paralelo
- **Ejemplos**: Servicios autónomos con bases de datos separadas

### 3. Comunicación Entre Microservicios
- **Síncrona**: APIs REST para respuestas inmediatas
- **Asíncrona**: Eventos para desacoplamiento
- **Híbrida**: Combinación de ambos patrones

## Ejemplos de Código Incluidos

### ✅ Ejemplos Correctos
- Servicios con responsabilidad única
- Comunicación asíncrona con eventos
- Circuit breakers para resiliencia
- Pruebas unitarias completas

### ❌ Ejemplos Incorrectos
- Servicios monolíticos con múltiples responsabilidades
- Comunicación síncrona excesiva
- Falta de manejo de errores
- Violaciones del SRP

## Patrones de Diseño Implementados

### 1. Circuit Breaker Pattern
```java
@HystrixCommand(fallbackMethod = "fallbackObtenerUsuario")
public Usuario obtenerUsuario(Long id) {
    return restTemplate.getForObject("/usuarios/" + id, Usuario.class);
}
```

### 2. Saga Pattern
```java
public void procesarTransferencia(TransferenciaRequest request) {
    Saga saga = new Saga();
    saga.addStep(new DebitarCuentaOrigen(request));
    saga.addStep(new AcreditarCuentaDestino(request));
    saga.execute();
}
```

### 3. Event-Driven Architecture
```java
@EventListener
public void handleUsuarioCreado(UsuarioCreadoEvent event) {
    servicioNotificacion.enviarNotificacionBienvenida(event);
}
```

## Cómo Usar los Ejemplos

### 1. Compilación
```bash
# Compilar todos los ejemplos
mvn clean compile

# Compilar con tests
mvn clean test
```

### 2. Ejecución
```bash
# Ejecutar servicios individuales
mvn spring-boot:run -pl usuario-service
mvn spring-boot:run -pl pago-service
mvn spring-boot:run -pl inventario-service
```

### 3. Testing
```bash
# Ejecutar todas las pruebas
mvn test

# Ejecutar pruebas específicas
mvn test -Dtest=ServicioUsuarioTest
mvn test -Dtest=ComunicacionSincronaTest
```

## Dependencias Principales

### Spring Boot
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### Testing
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
```

### Circuit Breaker
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```

## Estructura de Proyectos

### Microservicio de Usuarios
```
usuario-service/
├── src/main/java/
│   ├── controller/
│   │   └── UsuarioController.java
│   ├── service/
│   │   └── ServicioUsuario.java
│   ├── repository/
│   │   └── UsuarioRepository.java
│   └── model/
│       └── Usuario.java
└── src/test/java/
    └── ServicioUsuarioTest.java
```

### Microservicio de Pagos
```
pago-service/
├── src/main/java/
│   ├── controller/
│   │   └── PagoController.java
│   ├── service/
│   │   └── ServicioPago.java
│   └── model/
│       └── Pago.java
└── src/test/java/
    └── ServicioPagoTest.java
```

## Configuración de Base de Datos

### H2 (Desarrollo)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  h2:
    console:
      enabled: true
```

### PostgreSQL (Producción)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/microservices
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
```

## Monitoreo y Observabilidad

### Actuator Endpoints
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

### Métricas Prometheus
```java
@RestController
public class MetricsController {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @GetMapping("/metrics/requests")
    public Counter getRequestCounter() {
        return Counter.builder("http_requests_total")
            .description("Total HTTP requests")
            .register(meterRegistry);
    }
}
```

## Mejores Prácticas Implementadas

### 1. Validación de Entrada
```java
@Valid
public class CrearUsuarioRequest {
    @NotBlank(message = "Nombre es requerido")
    private String nombre;
    
    @Email(message = "Email debe ser válido")
    private String email;
}
```

### 2. Manejo de Errores
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleUsuarioNoEncontrado(UsuarioNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("Usuario no encontrado", e.getMessage()));
    }
}
```

### 3. Logging Estructurado
```java
@Slf4j
@Service
public class ServicioUsuario {
    
    public Usuario crearUsuario(CrearUsuarioRequest request) {
        log.info("Creando usuario con email: {}", request.getEmail());
        
        try {
            Usuario usuario = // lógica de creación
            log.info("Usuario creado exitosamente con ID: {}", usuario.getId());
            return usuario;
        } catch (Exception e) {
            log.error("Error creando usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

## Escenarios de Prueba

### 1. Pruebas Unitarias
- Validación de lógica de negocio
- Manejo de errores
- Transformación de datos

### 2. Pruebas de Integración
- Comunicación entre servicios
- Persistencia de datos
- APIs REST

### 3. Pruebas de Resiliencia
- Circuit breakers
- Timeouts
- Fallbacks

## Troubleshooting

### Problemas Comunes

1. **Error de Conexión a Base de Datos**
   ```bash
   # Verificar que la BD esté ejecutándose
   docker ps | grep postgres
   
   # Verificar configuración
   cat application.yml
   ```

2. **Error de Comunicación Entre Servicios**
   ```bash
   # Verificar que los servicios estén ejecutándose
   curl http://localhost:8080/actuator/health
   
   # Verificar logs
   tail -f logs/application.log
   ```

3. **Error de Circuit Breaker**
   ```bash
   # Verificar configuración de Hystrix
   curl http://localhost:8080/actuator/hystrix.stream
   ```

## Próximos Pasos

Después de completar este capítulo, se recomienda:

1. **Implementar los ejemplos** en un entorno de desarrollo
2. **Experimentar con diferentes patrones** de comunicación
3. **Probar los circuit breakers** con fallas simuladas
4. **Explorar el monitoreo** y métricas
5. **Continuar con el Capítulo 3** para patrones avanzados

## Recursos Adicionales

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)

## Contribución

Para contribuir a este capítulo:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Agrega pruebas
5. Envía un pull request

## Licencia

Este contenido está bajo la licencia MIT. Ver el archivo LICENSE para más detalles. 