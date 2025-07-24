# Comparación de Microservicios con Arquitecturas Monolíticas y SOA

## Resumen del Capítulo

Este capítulo explora la evolución de las arquitecturas de software, comparando tres estilos fundamentales: **monolítica**, **orientada a servicios (SOA)** y **microservicios**. 
Cada enfoque tiene sus ventajas y desventajas, y la elección depende del contexto específico de la aplicación.

---

## Mejores Prácticas para Arquitectura Serverless

### Optimización de Funciones
- **Minimizar cold starts** optimizando el código de funciones o usando técnicas para mantener las funciones "calientes" con invocaciones programadas
- **Funciones pequeñas y eficientes** con dependencias mínimas
- **Aprovechar servicios gestionados** para bases de datos y autenticación
- **Visibilidad del sistema** con logging y monitoring apropiados
- **Diseño para fallos** implementando reintentos, fallbacks y manejo de errores

### Resumen Serverless
La arquitectura serverless es una revolución en cómo construimos y ejecutamos aplicaciones modernas. 
Liberados de tener que desplegar y gestionar servidores, los desarrolladores pueden entregar aplicaciones escalables, rentables y resilientes en semanas en lugar de meses.

---

## Comparación Detallada de Arquitecturas

### Tabla 1-1: Diferencias entre Arquitecturas Monolítica, SOA y Microservicios

| Aspecto | Arquitectura Monolítica | SOA (Arquitectura Orientada a Servicios) | Arquitectura de Microservicios |
|---------|------------------------|------------------------------------------|--------------------------------|
| **Vista General de la Arquitectura** | Construyes una gran familia feliz—todo vive junto en un solo código base | SOA toma este monolito, lo divide y lo empaqueta como servicios independientes | Arquitectura moderna que divide tu aplicación en una colección de servicios pequeños e independientemente desplegables |
| **Código Base** | Todo está en un lugar, lo cual está bien... hasta que se vuelve desordenado | Aplicaciones compuestas de servicios débilmente acoplados | Tu app está hecha de servicios pequeños e independientes, cada uno con su propio trabajo |
| **Acoplamiento** | Componentes interconectados como gemelos siameses | Cada servicio proporciona una capacidad funcional distintiva | Comunicación descentralizada a través de protocolos ligeros como REST o gRPC |
| **Middleware** | N/A | El ESB maneja la mensajería entre servicios | Sin ESB pesado ralentizándote |

### Ejemplo de Código: Estructura de Proyecto

#### Arquitectura Monolítica
```java
// Estructura típica de un proyecto monolítico
src/
├── main/
│   ├── java/
│   │   └── com/company/
│   │       ├── controllers/     // Controladores web
│   │       ├── services/        // Lógica de negocio
│   │       ├── repositories/    // Acceso a datos
│   │       ├── models/          // Entidades
│   │       └── utils/           // Utilidades
│   └── resources/
│       ├── application.properties
│       └── static/              // Archivos estáticos
```

```java
// Ejemplo de servicio monolítico
@Service
public class OrderService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private NotificationService notificationService;
    
    public Order createOrder(OrderRequest request) {
        // Toda la lógica de negocio en un solo lugar
        User user = userRepository.findById(request.getUserId());
        Product product = productRepository.findById(request.getProductId());
        
        Order order = new Order(user, product);
        orderRepository.save(order);
        
        paymentService.processPayment(order);
        notificationService.sendConfirmation(order);
        
        return order;
    }
}
```

#### Arquitectura SOA
```java
// Estructura de servicios SOA
services/
├── user-service/
│   ├── UserService.java
│   └── UserRepository.java
├── product-service/
│   ├── ProductService.java
│   └── ProductRepository.java
├── order-service/
│   ├── OrderService.java
│   └── OrderRepository.java
└── esb/
    ├── MessageRouter.java
    └── ServiceRegistry.java
```

```java
// Ejemplo de servicio SOA con ESB
@Service
public class OrderServiceSOA {
    
    @Autowired
    private ESBClient esbClient;
    
    public Order createOrder(OrderRequest request) {
        // Comunicación a través del ESB
        User user = esbClient.invoke("user-service", "getUser", request.getUserId());
        Product product = esbClient.invoke("product-service", "getProduct", request.getProductId());
        
        Order order = new Order(user, product);
        orderRepository.save(order);
        
        // Notificar a otros servicios a través del ESB
        esbClient.publish("order.created", order);
        
        return order;
    }
}

// ESB Client
@Component
public class ESBClient {
    
    public <T> T invoke(String serviceName, String operation, Object... params) {
        // Lógica de invocación de servicios a través del ESB
        return esbGateway.invoke(serviceName, operation, params);
    }
    
    public void publish(String event, Object data) {
        // Publicación de eventos a través del ESB
        esbGateway.publish(event, data);
    }
}
```

#### Arquitectura de Microservicios
```java
// Estructura de microservicios
microservices/
├── user-service/
│   ├── src/main/java/
│   │   └── com/user/
│   │       ├── UserController.java
│   │       ├── UserService.java
│   │       └── UserRepository.java
│   └── Dockerfile
├── product-service/
│   ├── src/main/java/
│   │   └── com/product/
│   │       ├── ProductController.java
│   │       ├── ProductService.java
│   │       └── ProductRepository.java
│   └── Dockerfile
├── order-service/
│   ├── src/main/java/
│   │   └── com/order/
│   │       ├── OrderController.java
│   │       ├── OrderService.java
│   │       └── OrderRepository.java
│   └── Dockerfile
└── api-gateway/
    ├── src/main/java/
    │   └── com/gateway/
    │       └── GatewayController.java
    └── Dockerfile
```

```java
// Ejemplo de microservicio de órdenes
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(order);
    }
}

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public Order createOrder(OrderRequest request) {
        // Comunicación directa con otros microservicios
        User user = userServiceClient.getUser(request.getUserId());
        Product product = productServiceClient.getProduct(request.getProductId());
        
        Order order = new Order(user, product);
        orderRepository.save(order);
        
        // Publicar evento para otros servicios
        eventPublisher.publish("order.created", new OrderCreatedEvent(order));
        
        return order;
    }
}

// Cliente para comunicarse con otros microservicios
@Component
public class UserServiceClient {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "http://user-service/api/users/" + userId, 
            User.class
        );
    }
}
```

---

## Características Detalladas por Arquitectura

### Escalabilidad

#### Monolítica
```java
// Escalado vertical - agregar más recursos al servidor
@Configuration
public class ServerConfig {
    
    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.addConnectorCustomizers(connector -> {
            connector.setProperty("maxThreads", "200"); // Más hilos
            connector.setProperty("maxConnections", "10000"); // Más conexiones
        });
        return factory;
    }
}
```

#### SOA
```java
// Escalado con ESB
@Component
public class ESBLoadBalancer {
    
    private List<String> serviceInstances = new ArrayList<>();
    
    public String getServiceInstance(String serviceName) {
        // Balanceo de carga entre instancias del servicio
        return serviceInstances.get(ThreadLocalRandom.current().nextInt(serviceInstances.size()));
    }
}
```

#### Microservicios
```java
// Escalado independiente por servicio
@Configuration
public class OrderServiceConfig {
    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

// Kubernetes deployment para escalado automático
/*
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: order-service:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
*/
```

### Gestión de Datos

#### Monolítica - Base de Datos Única
```java
// Configuración de base de datos única
@Configuration
public class DatabaseConfig {
    
    @Bean
    @Primary
    public DataSource dataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:mysql://localhost:3306/monolithic_app")
            .username("root")
            .password("password")
            .build();
    }
}

// Entidades compartidas
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    // ... más campos
}

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    // ... más campos
}
```

#### SOA - Modelo de Datos Compartido
```java
// Servicios comparten el mismo modelo de datos
@Service
public class UserServiceSOA {
    
    @Autowired
    private UserRepository userRepository;
    
    public User getUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}

@Service
public class OrderServiceSOA {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ESBClient esbClient;
    
    public Order createOrder(OrderRequest request) {
        // Usa el mismo modelo de User a través del ESB
        User user = esbClient.invoke("user-service", "getUser", request.getUserId());
        // ... lógica de creación de orden
    }
}
```

#### Microservicios - Persistencia Políglota
```java
// Cada servicio tiene su propia base de datos
// User Service - PostgreSQL
@Configuration
public class UserServiceDatabaseConfig {
    
    @Bean
    @Primary
    public DataSource userDataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:postgresql://localhost:5432/user_service_db")
            .username("user_service")
            .password("password")
            .build();
    }
}

// Order Service - MongoDB
@Configuration
public class OrderServiceDatabaseConfig {
    
    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "order_service_db");
    }
}

// Product Service - Redis para caché
@Configuration
public class ProductServiceCacheConfig {
    
    @Bean
    public RedisTemplate<String, Product> redisTemplate() {
        RedisTemplate<String, Product> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Product.class));
        return template;
    }
}
```

### Comunicación e Integración

#### Monolítica - Comunicación Interna
```java
// Comunicación directa entre componentes
@Service
public class OrderService {
    
    @Autowired
    private UserService userService; // Inyección directa
    
    @Autowired
    private ProductService productService; // Inyección directa
    
    public Order createOrder(OrderRequest request) {
        User user = userService.getUser(request.getUserId()); // Llamada directa
        Product product = productService.getProduct(request.getProductId()); // Llamada directa
        // ... lógica de negocio
    }
}
```

#### SOA - Comunicación a través de ESB
```java
// Comunicación a través del ESB con SOAP
@Service
public class OrderServiceSOA {
    
    @Autowired
    private ESBClient esbClient;
    
    public Order createOrder(OrderRequest request) {
        // Invocación SOAP a través del ESB
        SOAPMessage response = esbClient.invokeSOAP(
            "user-service", 
            "getUser", 
            createSOAPRequest(request.getUserId())
        );
        
        User user = parseSOAPResponse(response);
        // ... más lógica
    }
}

@Component
public class ESBClient {
    
    public SOAPMessage invokeSOAP(String serviceName, String operation, SOAPMessage request) {
        // Lógica de invocación SOAP a través del ESB
        return soapGateway.invoke(serviceName, operation, request);
    }
}
```

#### Microservicios - Comunicación Descentralizada
```java
// Comunicación REST entre microservicios
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(order);
    }
}

@Service
public class OrderService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    public Order createOrder(OrderRequest request) {
        // Comunicación REST directa
        User user = userServiceClient.getUser(request.getUserId());
        Product product = productServiceClient.getProduct(request.getProductId());
        // ... lógica de negocio
    }
}

// Cliente REST para otros microservicios
@Component
public class UserServiceClient {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            "http://user-service/api/users/" + userId, 
            User.class
        );
    }
}

// Comunicación asíncrona con mensajes
@Component
public class OrderEventPublisher {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishOrderCreated(Order order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order);
        rabbitTemplate.convertAndSend("order.events", "order.created", event);
    }
}
```

### Aislamiento de Fallos

#### Monolítica - Fallo Total
```java
// Si falla una parte, falla todo
@Service
public class OrderService {
    
    public Order createOrder(OrderRequest request) {
        try {
            User user = userService.getUser(request.getUserId());
            Product product = productService.getProduct(request.getProductId());
            // Si userService falla, toda la operación falla
            return new Order(user, product);
        } catch (Exception e) {
            // El fallo afecta toda la aplicación
            throw new RuntimeException("Error en creación de orden", e);
        }
    }
}
```

#### SOA - Fallo con ESB
```java
// Fallo puede afectar múltiples servicios
@Service
public class OrderServiceSOA {
    
    @Autowired
    private ESBClient esbClient;
    
    public Order createOrder(OrderRequest request) {
        try {
            // Si el ESB falla, todos los servicios se ven afectados
            User user = esbClient.invoke("user-service", "getUser", request.getUserId());
            Product product = esbClient.invoke("product-service", "getProduct", request.getProductId());
            return new Order(user, product);
        } catch (ESBException e) {
            // Fallo del ESB afecta toda la operación
            throw new RuntimeException("Error en ESB", e);
        }
    }
}
```

#### Microservicios - Circuit Breaker Pattern
```java
// Aislamiento de fallos con Circuit Breaker
@Service
public class OrderService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    @HystrixCommand(fallbackMethod = "createOrderFallback")
    public Order createOrder(OrderRequest request) {
        User user = userServiceClient.getUser(request.getUserId());
        Product product = productServiceClient.getProduct(request.getProductId());
        return new Order(user, product);
    }
    
    // Método de fallback si el servicio de usuarios falla
    public Order createOrderFallback(OrderRequest request, Throwable t) {
        // Lógica de fallback - usar datos en caché o valores por defecto
        User user = getCachedUser(request.getUserId());
        Product product = productServiceClient.getProduct(request.getProductId());
        return new Order(user, product);
    }
}

// Implementación de Circuit Breaker
@Component
public class CircuitBreakerConfig {
    
    @Bean
    public HystrixCommandAspect hystrixAspect() {
        return new HystrixCommandAspect();
    }
    
    @Bean
    public HystrixMetricsPoller hystrixMetricsPoller() {
        return new HystrixMetricsPoller();
    }
}
```

---

## Conclusión

La arquitectura de microservicios ofrece ventajas significativas sobre las arquitecturas monolítica y SOA, particularmente en términos de **escalabilidad**, **flexibilidad** y **resiliencia**.

### Resumen de Ventajas:

1. **Monolítica**: Simple y fácil de gestionar para aplicaciones pequeñas, pero lucha con escalabilidad y mantenibilidad
2. **SOA**: Mejora la monolítica promoviendo reutilización de servicios y acoplamiento débil, pero involucra middleware complejo
3. **Microservicios**: Lleva estos conceptos más lejos, enfatizando servicios pequeños, gestión de datos descentralizada y programación poliglota

### Próximos Pasos:

En el siguiente capítulo exploraremos los conceptos fundamentales de microservicios:
- Principio de Responsabilidad Única
- Independencia y autonomía
- Gestión de datos descentralizada
- APIs y comunicación
- Escalabilidad y aislamiento de fallos
- Entrega continua y DevOps
- Programación poliglota
- Descubrimiento de servicios y balanceo de carga
- Logging, monitoring y seguridad

---

## Ejemplos de Implementación Práctica

### Docker Compose para Microservicios
```yaml
# docker-compose.yml
version: '3.8'
services:
  user-service:
    build: ./user-service
    ports:
      - "8081:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    depends_on:
      - user-db
  
  product-service:
    build: ./product-service
    ports:
      - "8082:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    depends_on:
      - product-db
  
  order-service:
    build: ./order-service
    ports:
      - "8083:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    depends_on:
      - order-db
      - rabbitmq
  
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    depends_on:
      - user-service
      - product-service
      - order-service
  
  user-db:
    image: postgres:13
    environment:
      POSTGRES_DB: user_service
      POSTGRES_USER: user_service
      POSTGRES_PASSWORD: password
  
  product-db:
    image: mongodb:4.4
    environment:
      MONGO_INITDB_DATABASE: product_service
  
  order-db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: order_service
      MYSQL_USER: order_service
      MYSQL_PASSWORD: password
  
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```

### Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
      - name: order-service
        image: order-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: USER_SERVICE_URL
          value: "http://user-service:8080"
        - name: PRODUCT_SERVICE_URL
          value: "http://product-service:8080"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: order-service
spec:
  selector:
    app: order-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

Este documento proporciona una comprensión completa de las diferencias entre las tres arquitecturas principales, con ejemplos prácticos de código que ilustran cada concepto. 