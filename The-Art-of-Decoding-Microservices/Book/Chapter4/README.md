# Capítulo 4: Desarrollo de Microservicios

## Descripción General

Este capítulo cubre los aspectos fundamentales del desarrollo de microservicios, incluyendo la selección de tecnologías, construcción de servicios RESTful, comunicación síncrona y asíncrona, arquitectura dirigida por eventos, descubrimiento de servicios, balanceo de carga, API Gateways y resiliencia.

## Estructura del Capítulo

### 1. Selección de Stack Tecnológico
- **Factores a considerar** en la elección de tecnologías
- **Componentes del stack tecnológico** (lenguajes, bases de datos, comunicación)
- **Mejores prácticas** para la selección de tecnologías

### 2. Construcción de Servicios RESTful
- **Principios REST** y su aplicación práctica
- **Configuración de Spring Boot** para servicios REST
- **Implementación de endpoints** con anotaciones Spring
- **Validación y manejo de errores**

### 3. Comunicación Síncrona vs Asíncrona
- **Comunicación síncrona** con REST
- **Comunicación asíncrona** con RabbitMQ
- **Criterios de selección** entre ambos enfoques

### 4. Arquitectura Dirigida por Eventos
- **Conceptos fundamentales** de EDA
- **Implementación con Apache Kafka**
- **Productores y consumidores de eventos**

### 5. Descubrimiento de Servicios y Balanceo de Carga
- **Service Discovery** con Netflix Eureka
- **Load Balancing** y sus estrategias
- **Implementación práctica** en Java

### 6. API Gateways y Rate Limiting
- **Funciones del API Gateway**
- **Implementación con Spring Cloud Gateway**
- **Rate limiting** con Redis

### 7. Resiliencia y Tolerancia a Fallos
- **Patrones de resiliencia** (Circuit Breaker, Retry, Bulkhead)
- **Implementación con Resilience4j**
- **Configuración y monitoreo**

## Tecnologías Utilizadas

### Core
- **Spring Boot 3.2.x** - Framework principal para desarrollo
- **Spring Cloud** - Componentes de microservicios
- **Java 17** - Lenguaje de programación

### Comunicación
- **REST APIs** - Comunicación síncrona
- **RabbitMQ** - Mensajería asíncrona
- **Apache Kafka** - Streaming de eventos

### Service Discovery
- **Netflix Eureka** - Descubrimiento de servicios
- **Spring Cloud Gateway** - API Gateway

### Resiliencia
- **Resilience4j** - Circuit breakers, retry, bulkhead
- **Redis** - Rate limiting y caching

### Testing
- **JUnit 5** - Framework de testing
- **Mockito** - Mocking
- **Testcontainers** - Testing con contenedores

## Instalación y Configuración

### Prerrequisitos

```bash
# Java 17 o superior
java -version

# Maven 3.6 o superior
mvn -version

# Docker (opcional, para Testcontainers)
docker --version
```

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd The-Art-of-Decoding-Microservices/Book/Chapter4
```

2. **Instalar dependencias**
```bash
mvn clean install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo application-dev.properties
cp src/main/resources/application-dev.properties.template src/main/resources/application-dev.properties

# Editar configuración según tu entorno
nano src/main/resources/application-dev.properties
```

### Configuración de Base de Datos

#### H2 (Desarrollo)
```properties
# application-dev.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
```

#### PostgreSQL (Producción)
```properties
# application-prod.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/microservices
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=validate
```

### Configuración de Mensajería

#### RabbitMQ
```properties
# application-dev.properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

#### Kafka
```properties
# application-dev.properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=chapter4-group
spring.kafka.consumer.auto-offset-reset=earliest
```

## Ejecución

### Desarrollo
```bash
# Ejecutar en modo desarrollo
mvn spring-boot:run -Dspring.profiles.active=dev

# O con variables de entorno
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run
```

### Producción
```bash
# Compilar para producción
mvn clean package -Pprod

# Ejecutar JAR
java -jar target/chapter4-microservices-development-1.0.0.jar --spring.profiles.active=prod
```

### Docker
```bash
# Construir imagen
docker build -t chapter4-microservices .

# Ejecutar contenedor
docker run -p 8080:8080 chapter4-microservices
```

## Testing

### Ejecutar Todas las Pruebas
```bash
mvn test
```

### Ejecutar Pruebas Específicas
```bash
# Pruebas de servicios RESTful
mvn test -Dtest=*Restful*

# Pruebas de comunicación asíncrona
mvn test -Dtest=*Async*

# Pruebas de resiliencia
mvn test -Dtest=*Resilience*
```

### Pruebas de Integración
```bash
# Ejecutar pruebas de integración
mvn verify -Pintegration-test

# Con Testcontainers
mvn test -Dspring.profiles.active=test
```

### Cobertura de Código
```bash
# Generar reporte de cobertura
mvn jacoco:report

# Ver reporte
open target/site/jacoco/index.html
```

## Estructura de Código

### Servicios RESTful
```
src/main/java/com/example/restful/
├── controller/     # Controladores REST
├── service/        # Lógica de negocio
├── repository/     # Acceso a datos
├── model/          # Entidades y DTOs
├── dto/            # Data Transfer Objects
└── exception/      # Manejo de excepciones
```

### Comunicación Asíncrona
```
src/main/java/com/example/async/
├── producer/       # Productores de mensajes
├── consumer/       # Consumidores de mensajes
├── config/         # Configuración de mensajería
├── event/          # Eventos de dominio
└── handler/        # Manejadores de eventos
```

### Service Discovery
```
src/main/java/com/example/discovery/
├── server/         # Servidor Eureka
├── client/         # Cliente Eureka
├── config/         # Configuración
└── controller/     # Controladores de discovery
```

### API Gateway
```
src/main/java/com/example/gateway/
├── config/         # Configuración de rutas
├── filter/         # Filtros personalizados
├── rate-limiter/   # Limitación de tasa
└── security/       # Configuración de seguridad
```

### Resiliencia
```
src/main/java/com/example/resilience/
├── circuit-breaker/ # Circuit breakers
├── retry/          # Lógica de reintentos
├── bulkhead/       # Aislamiento de recursos
├── fallback/       # Estrategias de fallback
└── config/         # Configuración de resiliencia
```

## Ejemplos de Uso

### 1. Crear un Servicio RESTful
```java
@RestController
@RequestMapping("/api/items")
public class ItemController {
    
    private final ItemService itemService;
    
    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getAllItems(Pageable pageable) {
        Page<ItemResponse> items = itemService.getAllItems(pageable);
        return ResponseEntity.ok(items);
    }
    
    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody CreateItemRequest request) {
        ItemResponse createdItem = itemService.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }
}
```

### 2. Implementar Comunicación Asíncrona
```java
@Component
public class OrderEventProducer {
    
    private final RabbitTemplate rabbitTemplate;
    
    public void sendOrderCreatedEvent(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order);
        rabbitTemplate.convertAndSend("order.exchange", "order.created", event);
    }
}

@Component
public class OrderEventConsumer {
    
    @RabbitListener(queues = "order.queue")
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Procesar evento de pedido creado
        notificationService.sendOrderConfirmation(event);
        inventoryService.reserveStock(event);
    }
}
```

### 3. Configurar Service Discovery
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

@SpringBootApplication
@EnableEurekaClient
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

### 4. Implementar API Gateway
```java
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("order-service", r -> r
                .path("/api/orders/**")
                .filters(f -> f
                    .requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter()))
                    .circuitBreaker(c -> c.setFallbackUri("/fallback")))
                .uri("lb://order-service"))
            .build();
    }
}
```

### 5. Aplicar Patrones de Resiliencia
```java
@Service
public class ExternalServiceClient {
    
    @CircuitBreaker(name = "external-service", fallbackMethod = "fallback")
    @Retry(name = "external-service")
    @Bulkhead(name = "external-service")
    public String callExternalService() {
        return restTemplate.getForObject("http://external-service/api", String.class);
    }
    
    public String fallback(Exception e) {
        return "Fallback response: " + e.getMessage();
    }
}
```

## Monitoreo y Observabilidad

### Endpoints de Actuator
```
# Health check
GET /actuator/health

# Métricas
GET /actuator/metrics

# Información de la aplicación
GET /actuator/info

# Variables de entorno
GET /actuator/env

# Configuración
GET /actuator/configprops
```

### Métricas Personalizadas
```java
@Component
public class CustomMetrics {
    
    private final MeterRegistry meterRegistry;
    
    public void recordOrderCreated() {
        Counter.builder("orders.created")
            .register(meterRegistry)
            .increment();
    }
    
    public void recordOrderProcessingTime(long duration) {
        Timer.builder("orders.processing.time")
            .register(meterRegistry)
            .record(duration, TimeUnit.MILLISECONDS);
    }
}
```

## Configuración de Logging

### Logback Configuration
```xml
<!-- src/main/resources/logback-spring.xml -->
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

## Seguridad

### Configuración de Seguridad Básica
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
}
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U postgres -d microservices
```

#### 2. Error de RabbitMQ
```bash
# Verificar que RabbitMQ esté ejecutándose
sudo systemctl status rabbitmq-server

# Verificar conexión
rabbitmqctl status
```

#### 3. Error de Kafka
```bash
# Verificar que Kafka esté ejecutándose
kafka-topics.sh --list --bootstrap-server localhost:9092

# Verificar consumidores
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
```

#### 4. Error de Eureka
```bash
# Verificar que Eureka esté ejecutándose
curl http://localhost:8761/eureka/apps

# Verificar servicios registrados
curl http://localhost:8761/eureka/apps
```

### Logs de Debug
```properties
# application-dev.properties
logging.level.com.example=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
logging.level.org.springframework.amqp=DEBUG
logging.level.org.springframework.kafka=DEBUG
```

## Mejores Prácticas

### 1. Desarrollo de Servicios RESTful
- ✅ Usar validaciones Bean Validation
- ✅ Implementar manejo de errores consistente
- ✅ Documentar APIs con OpenAPI/Swagger
- ✅ Usar DTOs para separar capas
- ✅ Implementar paginación y ordenamiento
- ❌ No exponer entidades directamente
- ❌ No ignorar validaciones de entrada

### 2. Comunicación Asíncrona
- ✅ Implementar idempotencia
- ✅ Manejar duplicación de mensajes
- ✅ Usar dead letter queues
- ✅ Implementar retry logic
- ✅ Monitorear colas de mensajes
- ❌ No asumir orden de mensajes
- ❌ No ignorar fallos de mensajería

### 3. Service Discovery
- ✅ Configurar health checks
- ✅ Implementar circuit breakers
- ✅ Usar load balancing
- ✅ Monitorear servicios registrados
- ✅ Configurar timeouts apropiados
- ❌ No hardcodear URLs de servicios
- ❌ No ignorar fallos de discovery

### 4. API Gateway
- ✅ Implementar rate limiting
- ✅ Configurar circuit breakers
- ✅ Usar filtros de seguridad
- ✅ Implementar logging centralizado
- ✅ Configurar timeouts
- ❌ No usar como base de datos
- ❌ No ignorar monitoreo

### 5. Resiliencia
- ✅ Configurar timeouts apropiados
- ✅ Implementar fallbacks
- ✅ Usar circuit breakers
- ✅ Implementar retry con backoff
- ✅ Monitorear métricas de resiliencia
- ❌ No configurar timeouts muy largos
- ❌ No ignorar fallbacks

## Recursos Adicionales

### Documentación
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Cloud Reference](https://docs.spring.io/spring-cloud/docs/current/reference/html/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Resilience4j Documentation](https://resilience4j.readme.io/)

### Herramientas
- [Postman](https://www.postman.com/) - Testing de APIs
- [Docker](https://www.docker.com/) - Contenedores
- [Prometheus](https://prometheus.io/) - Monitoreo
- [Grafana](https://grafana.com/) - Visualización
- [RabbitMQ Management](https://www.rabbitmq.com/management.html) - Gestión de RabbitMQ
- [Kafka UI](https://github.com/provectus/kafka-ui) - UI para Kafka

### Comunidad
- [Spring Community](https://spring.io/community)
- [RabbitMQ Community](https://www.rabbitmq.com/community.html)
- [Apache Kafka Community](https://kafka.apache.org/community)
- [Resilience4j Community](https://github.com/resilience4j/resilience4j)

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte:
- Email: soporte@ejemplo.com
- Issues: [GitHub Issues](https://github.com/ejemplo/microservices/issues)
- Wiki: [Documentación](https://github.com/ejemplo/microservices/wiki) 