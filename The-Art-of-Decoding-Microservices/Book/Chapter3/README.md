# Capítulo 3: Diseño de Microservicios

## Descripción General

Este capítulo cubre los fundamentos del diseño de microservicios, incluyendo Domain-Driven Design (DDD), Contextos Acotados, Límites de Servicios y Patrones de Diseño específicos para microservicios.

## Estructura del Capítulo

### 1. Domain-Driven Design (DDD)
- **Arquitectura de Cebolla (Onion Architecture)**
- **Entidades de Dominio**
- **Objetos de Valor**
- **Repositorios de Dominio**
- **Servicios de Dominio**

### 2. Contextos Acotados y Límites de Servicios
- **Definición de Contextos Acotados**
- **Mapeo de Contextos (Context Mapping)**
- **Anticorruption Layer**
- **Límites de Servicios**

### 3. Patrones de Diseño de Microservicios
- **API Gateway Pattern**
- **Circuit Breaker Pattern**
- **Event-Driven Architecture**
- **Sidecar Pattern**

## Archivos Incluidos

### Documentación
- `Capitulo3-Diseno-Microservicios.md` - Introducción y conceptos básicos
- `Domain-Driven-Design-Ejemplos.md` - Ejemplos prácticos de DDD
- `Contextos-Acotados-Limites.md` - Contextos acotados y límites
- `Patrones-Diseno-Microservicios.md` - Patrones de diseño implementados

### Configuración
- `pom.xml` - Configuración Maven con todas las dependencias necesarias

## Tecnologías Utilizadas

### Core
- **Spring Boot 3.2.x** - Framework principal
- **Spring Cloud 2023.0.x** - Componentes de microservicios
- **Java 17** - Lenguaje de programación

### Base de Datos
- **H2 Database** - Base de datos en memoria para desarrollo
- **PostgreSQL** - Base de datos de producción
- **JPA/Hibernate** - ORM

### Comunicación
- **REST APIs** - Comunicación síncrona
- **Spring Events** - Comunicación asíncrona interna
- **OpenFeign** - Cliente HTTP declarativo

### Resiliencia
- **Resilience4j** - Circuit Breaker, Retry, Timeout
- **Hystrix** - Circuit Breaker (legacy)

### Monitoreo
- **Micrometer** - Métricas
- **Prometheus** - Recolección de métricas
- **Actuator** - Endpoints de monitoreo

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
cd The-Art-of-Decoding-Microservicios/Book/Chapter3
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
java -jar target/chapter3-microservices-1.0.0.jar --spring.profiles.active=prod
```

### Docker
```bash
# Construir imagen
docker build -t chapter3-microservices .

# Ejecutar contenedor
docker run -p 8080:8080 chapter3-microservices
```

## Testing

### Ejecutar Todas las Pruebas
```bash
mvn test
```

### Ejecutar Pruebas Específicas
```bash
# Pruebas de DDD
mvn test -Dtest=*DDD*

# Pruebas de Circuit Breaker
mvn test -Dtest=*CircuitBreaker*

# Pruebas de Eventos
mvn test -Dtest=*Event*
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

### Domain-Driven Design
```
src/main/java/com/example/ddd/
├── domain/           # Capa de dominio
│   ├── entities/     # Entidades de dominio
│   ├── valueobjects/ # Objetos de valor
│   ├── repositories/ # Interfaces de repositorio
│   └── services/     # Servicios de dominio
├── application/      # Capa de aplicación
│   ├── services/     # Servicios de aplicación
│   ├── commands/     # Comandos
│   └── queries/      # Consultas
├── infrastructure/   # Capa de infraestructura
│   ├── persistence/  # Implementaciones de repositorio
│   ├── external/     # Servicios externos
│   └── config/       # Configuración
└── interfaces/       # Capa de interfaces
    ├── rest/         # Controladores REST
    ├── dto/          # Objetos de transferencia
    └── mappers/      # Mapeadores
```

### Contextos Acotados
```
src/main/java/com/example/contexts/
├── ordercontext/     # Contexto de pedidos
│   ├── domain/       # Dominio del contexto
│   ├── application/  # Aplicación del contexto
│   └── infrastructure/ # Infraestructura del contexto
├── productcontext/   # Contexto de productos
│   ├── domain/       # Dominio del contexto
│   ├── application/  # Aplicación del contexto
│   └── infrastructure/ # Infraestructura del contexto
└── shared/           # Contexto compartido
    ├── kernel/       # Kernel compartido
    └── anticorruption/ # Capa anticorrupción
```

### Patrones de Diseño
```
src/main/java/com/example/patterns/
├── gateway/          # API Gateway Pattern
├── circuitbreaker/   # Circuit Breaker Pattern
├── events/           # Event-Driven Architecture
└── sidecar/          # Sidecar Pattern
```

## Ejemplos de Uso

### 1. Crear una Entidad de Dominio
```java
// Entidad raíz del agregado Order
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Embedded
    private OrderNumber orderNumber;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    // Factory method para crear una nueva orden
    public static Order createOrder(OrderNumber orderNumber, 
                                  CustomerInfo customerInfo, 
                                  Address shippingAddress) {
        Order order = new Order();
        order.orderNumber = orderNumber;
        order.customerInfo = customerInfo;
        order.shippingAddress = shippingAddress;
        order.status = OrderStatus.CREATED;
        order.createdAt = LocalDateTime.now();
        order.updatedAt = LocalDateTime.now();
        return order;
    }
    
    // Método de dominio para agregar un item
    public void addItem(Product product, int quantity) {
        if (status == OrderStatus.CANCELLED) {
            throw new DomainException("No se pueden agregar items a una orden cancelada");
        }
        
        if (quantity <= 0) {
            throw new DomainException("La cantidad debe ser mayor a cero");
        }
        
        // Lógica de negocio para agregar item
        // ...
    }
}
```

### 2. Implementar Circuit Breaker
```java
@Service
public class OrderServiceWithCircuitBreaker {
    
    private final CircuitBreaker orderServiceCircuitBreaker;
    private final RestTemplate restTemplate;
    
    public OrderDTO getOrder(Long orderId) {
        return orderServiceCircuitBreaker.executeSupplier(() -> {
            ResponseEntity<OrderDTO> response = restTemplate.getForEntity(
                orderServiceUrl + "/orders/" + orderId, 
                OrderDTO.class
            );
            
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new ServiceException("Order service returned: " + response.getStatusCode());
            }
            
            return response.getBody();
        });
    }
}
```

### 3. Publicar Eventos de Dominio
```java
@Service
public class EventService {
    
    private final ApplicationEventPublisher eventPublisher;
    
    public void publishOrderCreated(OrderDTO order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order);
        eventPublisher.publishEvent(event);
    }
}

@Component
public class OrderEventListener {
    
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Procesar evento de pedido creado
        notificationService.sendOrderConfirmation(event.getOrder());
        inventoryService.reserveStock(event.getOrder());
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

#### 2. Error de Circuit Breaker
```bash
# Verificar configuración
curl http://localhost:8080/actuator/health

# Ver métricas del circuit breaker
curl http://localhost:8080/actuator/metrics/resilience4j.circuitbreaker.calls
```

#### 3. Error de Eventos
```bash
# Verificar logs de eventos
tail -f logs/application.log | grep "Event"

# Verificar configuración de async
curl http://localhost:8080/actuator/env | grep async
```

### Logs de Debug
```properties
# application-dev.properties
logging.level.com.example=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

## Mejores Prácticas

### 1. Diseño de Dominio
- ✅ Usar entidades de dominio con lógica de negocio
- ✅ Implementar objetos de valor inmutables
- ✅ Definir agregados con límites claros
- ✅ Usar servicios de dominio para lógica compleja
- ❌ No mezclar lógica de infraestructura en el dominio

### 2. Contextos Acotados
- ✅ Definir límites claros entre contextos
- ✅ Usar anticorruption layer para comunicación
- ✅ Mantener consistencia dentro del contexto
- ❌ No compartir entidades entre contextos

### 3. Patrones de Diseño
- ✅ Implementar circuit breakers para resiliencia
- ✅ Usar eventos para comunicación asíncrona
- ✅ Implementar API Gateway para routing
- ✅ Usar sidecar para funcionalidades auxiliares
- ❌ No crear dependencias circulares

### 4. Testing
- ✅ Escribir pruebas unitarias para lógica de dominio
- ✅ Usar mocks para dependencias externas
- ✅ Implementar pruebas de integración
- ✅ Mantener alta cobertura de código
- ❌ No probar solo casos felices

## Recursos Adicionales

### Documentación
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Cloud Reference](https://docs.spring.io/spring-cloud/docs/current/reference/html/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Microservices Patterns](https://microservices.io/patterns/)

### Herramientas
- [Postman](https://www.postman.com/) - Testing de APIs
- [Docker](https://www.docker.com/) - Contenedores
- [Prometheus](https://prometheus.io/) - Monitoreo
- [Grafana](https://grafana.com/) - Visualización

### Comunidad
- [Spring Community](https://spring.io/community)
- [Microservices Community](https://microservices.io/)
- [DDD Community](https://domainlanguage.com/)

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