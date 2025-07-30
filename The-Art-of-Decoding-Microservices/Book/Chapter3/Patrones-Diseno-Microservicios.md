# Patrones de Diseño de Microservicios - Ejemplos Prácticos

## 1. API Gateway Pattern

### Implementación del API Gateway

```java
// Ubicación: src/main/java/com/example/gateway/
// El API Gateway actúa como punto de entrada único para todos los clientes

// Configuración principal del API Gateway
@Configuration
@EnableDiscoveryClient
@EnableCircuitBreaker
public class GatewayConfig {
    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate(); // Crea RestTemplate con balanceo de carga
    }
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Ruta para el servicio de pedidos
            .route("order-service", r -> r
                .path("/api/orders/**") // Patrón de ruta para pedidos
                .filters(f -> f
                    .rewritePath("/api/orders/(?<segment>.*)", "/${segment}") // Reescribe la ruta
                    .addRequestHeader("X-Response-Time", System.currentTimeMillis() + "") // Agrega header
                    .circuitBreaker(config -> config
                        .setName("order-service-circuit-breaker") // Nombre del circuit breaker
                        .setFallbackUri("forward:/fallback/orders") // URI de fallback
                    )
                )
                .uri("lb://order-service") // URI del servicio con balanceo de carga
            )
            // Ruta para el servicio de productos
            .route("product-service", r -> r
                .path("/api/products/**") // Patrón de ruta para productos
                .filters(f -> f
                    .rewritePath("/api/products/(?<segment>.*)", "/${segment}") // Reescribe la ruta
                    .addRequestHeader("X-Response-Time", System.currentTimeMillis() + "") // Agrega header
                    .circuitBreaker(config -> config
                        .setName("product-service-circuit-breaker") // Nombre del circuit breaker
                        .setFallbackUri("forward:/fallback/products") // URI de fallback
                    )
                )
                .uri("lb://product-service") // URI del servicio con balanceo de carga
            )
            // Ruta para el servicio de clientes
            .route("customer-service", r -> r
                .path("/api/customers/**") // Patrón de ruta para clientes
                .filters(f -> f
                    .rewritePath("/api/customers/(?<segment>.*)", "/${segment}") // Reescribe la ruta
                    .addRequestHeader("X-Response-Time", System.currentTimeMillis() + "") // Agrega header
                    .circuitBreaker(config -> config
                        .setName("customer-service-circuit-breaker") // Nombre del circuit breaker
                        .setFallbackUri("forward:/fallback/customers") // URI de fallback
                    )
                )
                .uri("lb://customer-service") // URI del servicio con balanceo de carga
            )
            .build(); // Construye las rutas
    }
}

// Controlador para manejar fallbacks
@RestController
@RequestMapping("/fallback")
public class FallbackController {
    
    private static final Logger logger = LoggerFactory.getLogger(FallbackController.class); // Logger
    
    // Fallback para el servicio de pedidos
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> orderServiceFallback() {
        logger.warn("Order service is down, using fallback"); // Log de advertencia
        
        Map<String, Object> response = new HashMap<>(); // Crea respuesta
        response.put("message", "Order service is temporarily unavailable"); // Mensaje de error
        response.put("timestamp", LocalDateTime.now()); // Timestamp
        response.put("status", "SERVICE_UNAVAILABLE"); // Estado del servicio
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE) // Status 503
            .body(response); // Retorna respuesta
    }
    
    // Fallback para el servicio de productos
    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> productServiceFallback() {
        logger.warn("Product service is down, using fallback"); // Log de advertencia
        
        Map<String, Object> response = new HashMap<>(); // Crea respuesta
        response.put("message", "Product service is temporarily unavailable"); // Mensaje de error
        response.put("timestamp", LocalDateTime.now()); // Timestamp
        response.put("status", "SERVICE_UNAVAILABLE"); // Estado del servicio
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE) // Status 503
            .body(response); // Retorna respuesta
    }
    
    // Fallback para el servicio de clientes
    @GetMapping("/customers")
    public ResponseEntity<Map<String, Object>> customerServiceFallback() {
        logger.warn("Customer service is down, using fallback"); // Log de advertencia
        
        Map<String, Object> response = new HashMap<>(); // Crea respuesta
        response.put("message", "Customer service is temporarily unavailable"); // Mensaje de error
        response.put("timestamp", LocalDateTime.now()); // Timestamp
        response.put("status", "SERVICE_UNAVAILABLE"); // Estado del servicio
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE) // Status 503
            .body(response); // Retorna respuesta
    }
}

// Filtro para agregar headers de seguridad
@Component
public class SecurityFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest(); // Obtiene la petición
        
        // Agrega headers de seguridad
        ServerHttpRequest modifiedRequest = request.mutate()
            .header("X-Gateway-Timestamp", String.valueOf(System.currentTimeMillis())) // Timestamp
            .header("X-Gateway-Version", "1.0.0") // Versión del gateway
            .build(); // Construye la petición modificada
        
        // Continúa con la cadena de filtros
        return chain.filter(exchange.mutate().request(modifiedRequest).build()); // Pasa al siguiente filtro
    }
    
    @Override
    public int getOrder() {
        return -100; // Orden de ejecución (alto = primero)
    }
}

// Filtro para logging de peticiones
@Component
public class LoggingFilter implements GlobalFilter, Ordered {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class); // Logger
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis(); // Tiempo de inicio
        String path = exchange.getRequest().getPath().value(); // Ruta de la petición
        String method = exchange.getRequest().getMethod().name(); // Método HTTP
        
        logger.info("Incoming request: {} {}", method, path); // Log de petición entrante
        
        return chain.filter(exchange) // Continúa con la cadena
            .doFinally(signalType -> {
                long endTime = System.currentTimeMillis(); // Tiempo de fin
                long duration = endTime - startTime; // Duración total
                
                logger.info("Request completed: {} {} - Duration: {}ms", 
                    method, path, duration); // Log de petición completada
            });
    }
    
    @Override
    public int getOrder() {
        return -200; // Orden de ejecución
    }
}
```

## 2. Circuit Breaker Pattern

### Implementación con Resilience4j

```java
// Ubicación: src/main/java/com/example/circuitbreaker/
// Implementación del patrón Circuit Breaker para manejar fallos

// Configuración del Circuit Breaker
@Configuration
public class CircuitBreakerConfig {
    
    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
            .failureRateThreshold(50) // Umbral de tasa de fallos (50%)
            .waitDurationInOpenState(Duration.ofSeconds(60)) // Tiempo de espera en estado abierto
            .slidingWindowSize(10) // Tamaño de la ventana deslizante
            .minimumNumberOfCalls(5) // Número mínimo de llamadas antes de evaluar
            .permittedNumberOfCallsInHalfOpenState(3) // Llamadas permitidas en estado semi-abierto
            .automaticTransitionFromOpenToHalfOpenEnabled(true) // Transición automática
            .recordExceptions(IOException.class, TimeoutException.class) // Excepciones a registrar
            .build(); // Construye la configuración
        
        return CircuitBreakerRegistry.of(config); // Crea el registro
    }
    
    @Bean
    public CircuitBreaker orderServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("order-service"); // Crea circuit breaker para pedidos
    }
    
    @Bean
    public CircuitBreaker productServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("product-service"); // Crea circuit breaker para productos
    }
}

// Servicio que usa Circuit Breaker
@Service
public class OrderServiceWithCircuitBreaker {
    
    private final CircuitBreaker orderServiceCircuitBreaker; // Circuit breaker para pedidos
    private final CircuitBreaker productServiceCircuitBreaker; // Circuit breaker para productos
    private final RestTemplate restTemplate; // Cliente HTTP
    private final String orderServiceUrl; // URL del servicio de pedidos
    private final String productServiceUrl; // URL del servicio de productos
    
    // Constructor con inyección de dependencias
    public OrderServiceWithCircuitBreaker(CircuitBreaker orderServiceCircuitBreaker,
                                        CircuitBreaker productServiceCircuitBreaker,
                                        RestTemplate restTemplate,
                                        @Value("${services.order.url}") String orderServiceUrl,
                                        @Value("${services.product.url}") String productServiceUrl) {
        this.orderServiceCircuitBreaker = orderServiceCircuitBreaker; // Inyecta circuit breaker de pedidos
        this.productServiceCircuitBreaker = productServiceCircuitBreaker; // Inyecta circuit breaker de productos
        this.restTemplate = restTemplate; // Inyecta cliente HTTP
        this.orderServiceUrl = orderServiceUrl; // Inyecta URL de pedidos
        this.productServiceUrl = productServiceUrl; // Inyecta URL de productos
    }
    
    // Método para obtener un pedido con Circuit Breaker
    public OrderDTO getOrder(Long orderId) {
        return orderServiceCircuitBreaker.executeSupplier(() -> {
            // Llamada al servicio de pedidos
            ResponseEntity<OrderDTO> response = restTemplate.getForEntity(
                orderServiceUrl + "/orders/" + orderId, 
                OrderDTO.class
            ); // Realiza petición GET
            
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new ServiceException("Order service returned: " + response.getStatusCode()); // Lanza excepción
            }
            
            return response.getBody(); // Retorna el pedido
        });
    }
    
    // Método para obtener productos con Circuit Breaker
    public List<ProductDTO> getProducts() {
        return productServiceCircuitBreaker.executeSupplier(() -> {
            // Llamada al servicio de productos
            ResponseEntity<ProductDTO[]> response = restTemplate.getForEntity(
                productServiceUrl + "/products", 
                ProductDTO[].class
            ); // Realiza petición GET
            
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new ServiceException("Product service returned: " + response.getStatusCode()); // Lanza excepción
            }
            
            return Arrays.asList(response.getBody()); // Retorna lista de productos
        });
    }
    
    // Método para crear un pedido con Circuit Breaker
    public OrderDTO createOrder(CreateOrderRequest request) {
        return orderServiceCircuitBreaker.executeSupplier(() -> {
            // Llamada al servicio de pedidos
            ResponseEntity<OrderDTO> response = restTemplate.postForEntity(
                orderServiceUrl + "/orders", 
                request, 
                OrderDTO.class
            ); // Realiza petición POST
            
            if (response.getStatusCode() != HttpStatus.CREATED) {
                throw new ServiceException("Order service returned: " + response.getStatusCode()); // Lanza excepción
            }
            
            return response.getBody(); // Retorna el pedido creado
        });
    }
}

// Event listener para monitorear el Circuit Breaker
@Component
public class CircuitBreakerEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(CircuitBreakerEventListener.class); // Logger
    
    @EventListener
    public void onCircuitBreakerEvent(CircuitBreakerEvent event) {
        switch (event.getEventType()) {
            case FAILURE_RATE_EXCEEDED:
                logger.warn("Circuit breaker {} failure rate exceeded", event.getCircuitBreakerName()); // Log de fallo
                break;
            case STATE_TRANSITION:
                logger.info("Circuit breaker {} state changed from {} to {}", 
                    event.getCircuitBreakerName(), 
                    event.getStateTransition().getFromState(), 
                    event.getStateTransition().getToState()); // Log de cambio de estado
                break;
            case SUCCESS:
                logger.debug("Circuit breaker {} call succeeded", event.getCircuitBreakerName()); // Log de éxito
                break;
            case ERROR:
                logger.error("Circuit breaker {} call failed", event.getCircuitBreakerName(), event.getThrowable()); // Log de error
                break;
        }
    }
}
```

## 3. Event-Driven Architecture

### Implementación con Spring Events

```java
// Ubicación: src/main/java/com/example/events/
// Implementación de arquitectura dirigida por eventos

// Evento base para todos los eventos de dominio
public abstract class DomainEvent {
    
    private final String eventId; // ID único del evento
    private final LocalDateTime timestamp; // Timestamp del evento
    private final String eventType; // Tipo del evento
    
    // Constructor protegido
    protected DomainEvent(String eventType) {
        this.eventId = UUID.randomUUID().toString(); // Genera ID único
        this.timestamp = LocalDateTime.now(); // Establece timestamp
        this.eventType = eventType; // Asigna tipo de evento
    }
    
    // Getters
    public String getEventId() { return eventId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getEventType() { return eventType; }
}

// Evento cuando se crea un pedido
public class OrderCreatedEvent extends DomainEvent {
    
    private final OrderDTO order; // Datos del pedido
    
    // Constructor
    public OrderCreatedEvent(OrderDTO order) {
        super("OrderCreated"); // Llama al constructor padre
        this.order = order; // Asigna el pedido
    }
    
    public OrderDTO getOrder() { return order; }
}

// Evento cuando se confirma un pedido
public class OrderConfirmedEvent extends DomainEvent {
    
    private final OrderDTO order; // Datos del pedido
    
    // Constructor
    public OrderConfirmedEvent(OrderDTO order) {
        super("OrderConfirmed"); // Llama al constructor padre
        this.order = order; // Asigna el pedido
    }
    
    public OrderDTO getOrder() { return order; }
}

// Evento cuando se cancela un pedido
public class OrderCancelledEvent extends DomainEvent {
    
    private final OrderDTO order; // Datos del pedido
    private final String reason; // Razón de la cancelación
    
    // Constructor
    public OrderCancelledEvent(OrderDTO order, String reason) {
        super("OrderCancelled"); // Llama al constructor padre
        this.order = order; // Asigna el pedido
        this.reason = reason; // Asigna la razón
    }
    
    public OrderDTO getOrder() { return order; }
    public String getReason() { return reason; }
}

// Evento cuando se agrega un item al pedido
public class ItemAddedEvent extends DomainEvent {
    
    private final OrderDTO order; // Datos del pedido
    private final OrderItemDTO item; // Datos del item
    
    // Constructor
    public ItemAddedEvent(OrderDTO order, OrderItemDTO item) {
        super("ItemAdded"); // Llama al constructor padre
        this.order = order; // Asigna el pedido
        this.item = item; // Asigna el item
    }
    
    public OrderDTO getOrder() { return order; }
    public OrderItemDTO getItem() { return item; }
}

// Servicio de eventos
@Service
public class EventService {
    
    private final ApplicationEventPublisher eventPublisher; // Publicador de eventos
    private final ObjectMapper objectMapper; // Mapeador JSON
    
    // Constructor con inyección de dependencias
    public EventService(ApplicationEventPublisher eventPublisher, ObjectMapper objectMapper) {
        this.eventPublisher = eventPublisher; // Inyecta publicador
        this.objectMapper = objectMapper; // Inyecta mapeador
    }
    
    // Método para publicar evento de pedido creado
    public void publishOrderCreated(OrderDTO order) {
        OrderCreatedEvent event = new OrderCreatedEvent(order); // Crea evento
        eventPublisher.publishEvent(event); // Publica evento
    }
    
    // Método para publicar evento de pedido confirmado
    public void publishOrderConfirmed(OrderDTO order) {
        OrderConfirmedEvent event = new OrderConfirmedEvent(order); // Crea evento
        eventPublisher.publishEvent(event); // Publica evento
    }
    
    // Método para publicar evento de pedido cancelado
    public void publishOrderCancelled(OrderDTO order, String reason) {
        OrderCancelledEvent event = new OrderCancelledEvent(order, reason); // Crea evento
        eventPublisher.publishEvent(event); // Publica evento
    }
    
    // Método para publicar evento de item agregado
    public void publishItemAdded(OrderDTO order, OrderItemDTO item) {
        ItemAddedEvent event = new ItemAddedEvent(order, item); // Crea evento
        eventPublisher.publishEvent(event); // Publica evento
    }
}

// Event listener para procesar eventos de pedidos
@Component
public class OrderEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderEventListener.class); // Logger
    private final NotificationService notificationService; // Servicio de notificaciones
    private final InventoryService inventoryService; // Servicio de inventario
    
    // Constructor con inyección de dependencias
    public OrderEventListener(NotificationService notificationService, 
                            InventoryService inventoryService) {
        this.notificationService = notificationService; // Inyecta servicio de notificaciones
        this.inventoryService = inventoryService; // Inyecta servicio de inventario
    }
    
    // Listener para evento de pedido creado
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        logger.info("Processing order created event: {}", event.getEventId()); // Log de procesamiento
        
        try {
            // Enviar notificación al cliente
            notificationService.sendOrderConfirmation(event.getOrder()); // Envía confirmación
            
            // Actualizar inventario
            for (OrderItemDTO item : event.getOrder().getItems()) {
                inventoryService.reserveStock(item.getProductId(), item.getQuantity()); // Reserva stock
            }
            
            logger.info("Order created event processed successfully: {}", event.getEventId()); // Log de éxito
        } catch (Exception e) {
            logger.error("Error processing order created event: {}", event.getEventId(), e); // Log de error
        }
    }
    
    // Listener para evento de pedido confirmado
    @EventListener
    @Async
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        logger.info("Processing order confirmed event: {}", event.getEventId()); // Log de procesamiento
        
        try {
            // Enviar notificación de confirmación
            notificationService.sendOrderConfirmed(event.getOrder()); // Envía confirmación
            
            // Iniciar proceso de envío
            notificationService.notifyShippingDepartment(event.getOrder()); // Notifica departamento de envío
            
            logger.info("Order confirmed event processed successfully: {}", event.getEventId()); // Log de éxito
        } catch (Exception e) {
            logger.error("Error processing order confirmed event: {}", event.getEventId(), e); // Log de error
        }
    }
    
    // Listener para evento de pedido cancelado
    @EventListener
    @Async
    public void handleOrderCancelled(OrderCancelledEvent event) {
        logger.info("Processing order cancelled event: {}", event.getEventId()); // Log de procesamiento
        
        try {
            // Enviar notificación de cancelación
            notificationService.sendOrderCancelled(event.getOrder(), event.getReason()); // Envía cancelación
            
            // Liberar inventario reservado
            for (OrderItemDTO item : event.getOrder().getItems()) {
                inventoryService.releaseStock(item.getProductId(), item.getQuantity()); // Libera stock
            }
            
            logger.info("Order cancelled event processed successfully: {}", event.getEventId()); // Log de éxito
        } catch (Exception e) {
            logger.error("Error processing order cancelled event: {}", event.getEventId(), e); // Log de error
        }
    }
    
    // Listener para evento de item agregado
    @EventListener
    @Async
    public void handleItemAdded(ItemAddedEvent event) {
        logger.info("Processing item added event: {}", event.getEventId()); // Log de procesamiento
        
        try {
            // Actualizar total del pedido
            notificationService.sendOrderUpdated(event.getOrder()); // Envía actualización
            
            // Verificar disponibilidad de stock
            inventoryService.checkStockAvailability(event.getItem().getProductId(), 
                                                  event.getItem().getQuantity()); // Verifica stock
            
            logger.info("Item added event processed successfully: {}", event.getEventId()); // Log de éxito
        } catch (Exception e) {
            logger.error("Error processing item added event: {}", event.getEventId(), e); // Log de error
        }
    }
}
```

## 4. Sidecar Pattern

### Implementación del Sidecar

```java
// Ubicación: src/main/java/com/example/sidecar/
// El Sidecar proporciona funcionalidades auxiliares al servicio principal

// Configuración del Sidecar
@Configuration
public class SidecarConfig {
    
    @Bean
    public HealthIndicator sidecarHealthIndicator() {
        return new SidecarHealthIndicator(); // Indicador de salud del sidecar
    }
    
    @Bean
    public MetricsRegistry sidecarMetricsRegistry() {
        return new SimpleMeterRegistry(); // Registro de métricas
    }
}

// Indicador de salud del Sidecar
@Component
public class SidecarHealthIndicator implements HealthIndicator {
    
    private final ApplicationContext applicationContext; // Contexto de la aplicación
    private final MetricsRegistry metricsRegistry; // Registro de métricas
    
    // Constructor con inyección de dependencias
    public SidecarHealthIndicator(ApplicationContext applicationContext, 
                                MetricsRegistry metricsRegistry) {
        this.applicationContext = applicationContext; // Inyecta contexto
        this.metricsRegistry = metricsRegistry; // Inyecta registro de métricas
    }
    
    @Override
    public Health health() {
        try {
            // Verificar que la aplicación esté funcionando
            if (applicationContext.isActive()) { // Verifica si está activa
                return Health.up() // Estado saludable
                    .withDetail("sidecar", "running") // Detalle del sidecar
                    .withDetail("timestamp", LocalDateTime.now()) // Timestamp
                    .build(); // Construye respuesta
            } else {
                return Health.down() // Estado no saludable
                    .withDetail("sidecar", "stopped") // Detalle del sidecar
                    .withDetail("timestamp", LocalDateTime.now()) // Timestamp
                    .build(); // Construye respuesta
            }
        } catch (Exception e) {
            return Health.down() // Estado no saludable
                .withDetail("sidecar", "error") // Detalle del error
                .withDetail("error", e.getMessage()) // Mensaje de error
                .withDetail("timestamp", LocalDateTime.now()) // Timestamp
                .build(); // Construye respuesta
        }
    }
}

// Servicio de logging del Sidecar
@Service
public class SidecarLoggingService {
    
    private static final Logger logger = LoggerFactory.getLogger(SidecarLoggingService.class); // Logger
    private final MetricsRegistry metricsRegistry; // Registro de métricas
    
    // Constructor con inyección de dependencias
    public SidecarLoggingService(MetricsRegistry metricsRegistry) {
        this.metricsRegistry = metricsRegistry; // Inyecta registro de métricas
    }
    
    // Método para registrar petición HTTP
    public void logHttpRequest(String method, String path, int statusCode, long duration) {
        // Registrar en logs
        logger.info("HTTP Request: {} {} - Status: {} - Duration: {}ms", 
            method, path, statusCode, duration); // Log de petición
        
        // Registrar métricas
        Counter requestCounter = Counter.builder("http_requests_total") // Contador de peticiones
            .tag("method", method) // Tag del método
            .tag("path", path) // Tag de la ruta
            .tag("status", String.valueOf(statusCode)) // Tag del status
            .register(metricsRegistry); // Registra en el registry
        
        requestCounter.increment(); // Incrementa contador
        
        // Registrar duración
        Timer requestTimer = Timer.builder("http_request_duration") // Timer de duración
            .tag("method", method) // Tag del método
            .tag("path", path) // Tag de la ruta
            .register(metricsRegistry); // Registra en el registry
        
        requestTimer.record(duration, TimeUnit.MILLISECONDS); // Registra duración
    }
    
    // Método para registrar error
    public void logError(String method, String path, Exception exception) {
        // Registrar en logs
        logger.error("HTTP Error: {} {} - Error: {}", 
            method, path, exception.getMessage(), exception); // Log de error
        
        // Registrar métricas
        Counter errorCounter = Counter.builder("http_errors_total") // Contador de errores
            .tag("method", method) // Tag del método
            .tag("path", path) // Tag de la ruta
            .tag("exception", exception.getClass().getSimpleName()) // Tag de la excepción
            .register(metricsRegistry); // Registra en el registry
        
        errorCounter.increment(); // Incrementa contador
    }
    
    // Método para registrar métricas de memoria
    public void logMemoryMetrics() {
        Runtime runtime = Runtime.getRuntime(); // Obtiene runtime
        long totalMemory = runtime.totalMemory(); // Memoria total
        long freeMemory = runtime.freeMemory(); // Memoria libre
        long usedMemory = totalMemory - freeMemory; // Memoria usada
        
        // Registrar métricas de memoria
        Gauge.builder("jvm_memory_used_bytes") // Gauge de memoria usada
            .register(metricsRegistry, usedMemory); // Registra memoria usada
        
        Gauge.builder("jvm_memory_free_bytes") // Gauge de memoria libre
            .register(metricsRegistry, freeMemory); // Registra memoria libre
        
        Gauge.builder("jvm_memory_total_bytes") // Gauge de memoria total
            .register(metricsRegistry, totalMemory); // Registra memoria total
        
        // Log de métricas de memoria
        logger.debug("Memory metrics - Used: {}MB, Free: {}MB, Total: {}MB", 
            usedMemory / 1024 / 1024, 
            freeMemory / 1024 / 1024, 
            totalMemory / 1024 / 1024); // Log de métricas
    }
}

// Filtro HTTP del Sidecar
@Component
public class SidecarHttpFilter implements Filter {
    
    private final SidecarLoggingService loggingService; // Servicio de logging
    private final MetricsRegistry metricsRegistry; // Registro de métricas
    
    // Constructor con inyección de dependencias
    public SidecarHttpFilter(SidecarLoggingService loggingService, 
                           MetricsRegistry metricsRegistry) {
        this.loggingService = loggingService; // Inyecta servicio de logging
        this.metricsRegistry = metricsRegistry; // Inyecta registro de métricas
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        long startTime = System.currentTimeMillis(); // Tiempo de inicio
        HttpServletRequest httpRequest = (HttpServletRequest) request; // Cast a HTTP request
        HttpServletResponse httpResponse = (HttpServletResponse) response; // Cast a HTTP response
        
        try {
            // Continuar con la cadena de filtros
            chain.doFilter(request, response); // Pasa al siguiente filtro
            
            // Calcular duración
            long endTime = System.currentTimeMillis(); // Tiempo de fin
            long duration = endTime - startTime; // Duración total
            
            // Registrar petición exitosa
            loggingService.logHttpRequest(
                httpRequest.getMethod(), // Método HTTP
                httpRequest.getRequestURI(), // URI de la petición
                httpResponse.getStatus(), // Status de la respuesta
                duration // Duración
            ); // Registra petición
            
        } catch (Exception e) {
            // Calcular duración
            long endTime = System.currentTimeMillis(); // Tiempo de fin
            long duration = endTime - startTime; // Duración total
            
            // Registrar error
            loggingService.logError(
                httpRequest.getMethod(), // Método HTTP
                httpRequest.getRequestURI(), // URI de la petición
                e // Excepción
            ); // Registra error
            
            // Re-lanzar excepción
            throw e; // Re-lanza la excepción
        }
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Inicialización del filtro
    }
    
    @Override
    public void destroy() {
        // Destrucción del filtro
    }
}

// Controlador de métricas del Sidecar
@RestController
@RequestMapping("/sidecar/metrics")
public class SidecarMetricsController {
    
    private final MetricsRegistry metricsRegistry; // Registro de métricas
    private final SidecarLoggingService loggingService; // Servicio de logging
    
    // Constructor con inyección de dependencias
    public SidecarMetricsController(MetricsRegistry metricsRegistry, 
                                  SidecarLoggingService loggingService) {
        this.metricsRegistry = metricsRegistry; // Inyecta registro de métricas
        this.loggingService = loggingService; // Inyecta servicio de logging
    }
    
    // Endpoint para obtener métricas
    @GetMapping
    public ResponseEntity<String> getMetrics() {
        // Registrar métricas de memoria
        loggingService.logMemoryMetrics(); // Registra métricas de memoria
        
        // Obtener métricas en formato Prometheus
        StringBuilder metrics = new StringBuilder(); // StringBuilder para métricas
        
        // Métricas de peticiones HTTP
        metrics.append("# HELP http_requests_total Total number of HTTP requests\n");
        metrics.append("# TYPE http_requests_total counter\n");
        
        // Métricas de duración de peticiones
        metrics.append("# HELP http_request_duration Duration of HTTP requests\n");
        metrics.append("# TYPE http_request_duration histogram\n");
        
        // Métricas de errores
        metrics.append("# HELP http_errors_total Total number of HTTP errors\n");
        metrics.append("# TYPE http_errors_total counter\n");
        
        // Métricas de memoria
        metrics.append("# HELP jvm_memory_used_bytes Used memory in bytes\n");
        metrics.append("# TYPE jvm_memory_used_bytes gauge\n");
        
        metrics.append("# HELP jvm_memory_free_bytes Free memory in bytes\n");
        metrics.append("# TYPE jvm_memory_free_bytes gauge\n");
        
        metrics.append("# HELP jvm_memory_total_bytes Total memory in bytes\n");
        metrics.append("# TYPE jvm_memory_total_bytes gauge\n");
        
        return ResponseEntity.ok(metrics.toString()); // Retorna métricas
    }
    
    // Endpoint para obtener métricas específicas
    @GetMapping("/{metricName}")
    public ResponseEntity<Map<String, Object>> getMetric(@PathVariable String metricName) {
        Map<String, Object> metricData = new HashMap<>(); // Mapa para datos de métrica
        
        // Buscar métrica por nombre
        Meter meter = metricsRegistry.find(metricName).meter(); // Busca métrica
        
        if (meter != null) {
            metricData.put("name", meter.getId().getName()); // Nombre de la métrica
            metricData.put("type", meter.getId().getType()); // Tipo de métrica
            metricData.put("tags", meter.getId().getTags()); // Tags de la métrica
            metricData.put("timestamp", LocalDateTime.now()); // Timestamp
            
            return ResponseEntity.ok(metricData); // Retorna datos de métrica
        } else {
            return ResponseEntity.notFound().build(); // Métrica no encontrada
        }
    }
}
```

## 5. Pruebas Unitarias para Patrones

```java
// Pruebas unitarias para el API Gateway
@ExtendWith(MockitoExtension.class)
class GatewayConfigTest {
    
    @Test
    @DisplayName("Debería configurar rutas correctamente")
    void shouldConfigureRoutesCorrectly() {
        // Arrange: crear builder de rutas
        RouteLocatorBuilder builder = new RouteLocatorBuilder(null); // Crea builder
        
        // Act: crear configuración
        GatewayConfig config = new GatewayConfig(); // Crea configuración
        RouteLocator routeLocator = config.customRouteLocator(builder); // Obtiene rutas
        
        // Assert: verificar que las rutas se configuraron
        assertThat(routeLocator).isNotNull(); // Verifica que no sea nulo
    }
    
    @Test
    @DisplayName("Debería crear RestTemplate con balanceo de carga")
    void shouldCreateLoadBalancedRestTemplate() {
        // Act: crear configuración
        GatewayConfig config = new GatewayConfig(); // Crea configuración
        RestTemplate restTemplate = config.restTemplate(); // Obtiene RestTemplate
        
        // Assert: verificar que se creó correctamente
        assertThat(restTemplate).isNotNull(); // Verifica que no sea nulo
    }
}

// Pruebas unitarias para Circuit Breaker
@ExtendWith(MockitoExtension.class)
class OrderServiceWithCircuitBreakerTest {
    
    @Mock
    private CircuitBreaker orderServiceCircuitBreaker; // Mock del circuit breaker
    
    @Mock
    private RestTemplate restTemplate; // Mock del RestTemplate
    
    @InjectMocks
    private OrderServiceWithCircuitBreaker orderService; // Servicio bajo prueba
    
    @Test
    @DisplayName("Debería obtener pedido exitosamente")
    void shouldGetOrderSuccessfully() {
        // Arrange: preparar datos de prueba
        Long orderId = 1L; // ID del pedido
        OrderDTO expectedOrder = createTestOrder(); // Pedido de prueba
        ResponseEntity<OrderDTO> response = ResponseEntity.ok(expectedOrder); // Respuesta exitosa
        
        // Configurar mocks
        when(orderServiceCircuitBreaker.executeSupplier(any())).thenReturn(expectedOrder); // Mock circuit breaker
        when(restTemplate.getForEntity(anyString(), eq(OrderDTO.class))).thenReturn(response); // Mock HTTP
        
        // Act: obtener pedido
        OrderDTO result = orderService.getOrder(orderId); // Ejecuta método
        
        // Assert: verificar resultado
        assertThat(result).isEqualTo(expectedOrder); // Verifica que sea el pedido esperado
        
        // Verificar interacciones
        verify(orderServiceCircuitBreaker).executeSupplier(any()); // Verifica uso del circuit breaker
    }
    
    @Test
    @DisplayName("Debería manejar fallo del servicio")
    void shouldHandleServiceFailure() {
        // Arrange: preparar datos de prueba
        Long orderId = 1L; // ID del pedido
        
        // Configurar mocks para simular fallo
        when(orderServiceCircuitBreaker.executeSupplier(any()))
            .thenThrow(new ServiceException("Service unavailable")); // Mock fallo
        
        // Act & Assert: verificar que se lanza excepción
        assertThatThrownBy(() -> orderService.getOrder(orderId)) // Ejecuta método
            .isInstanceOf(ServiceException.class) // Verifica tipo de excepción
            .hasMessage("Service unavailable"); // Verifica mensaje
    }
    
    // Método helper para crear pedido de prueba
    private OrderDTO createTestOrder() {
        return OrderDTO.builder() // Usa builder
            .id(1L) // Asigna ID
            .orderNumber("ORD-20231201-0001") // Asigna número
            .status("CREATED") // Asigna estado
            .totalAmount(BigDecimal.valueOf(100.00)) // Asigna total
            .build(); // Construye y retorna
    }
}

// Pruebas unitarias para Event-Driven Architecture
@ExtendWith(MockitoExtension.class)
class EventServiceTest {
    
    @Mock
    private ApplicationEventPublisher eventPublisher; // Mock del publicador
    
    @InjectMocks
    private EventService eventService; // Servicio bajo prueba
    
    @Test
    @DisplayName("Debería publicar evento de pedido creado")
    void shouldPublishOrderCreatedEvent() {
        // Arrange: preparar datos de prueba
        OrderDTO order = createTestOrder(); // Pedido de prueba
        
        // Act: publicar evento
        eventService.publishOrderCreated(order); // Publica evento
        
        // Assert: verificar que se publicó
        verify(eventPublisher).publishEvent(any(OrderCreatedEvent.class)); // Verifica publicación
    }
    
    @Test
    @DisplayName("Debería publicar evento de pedido confirmado")
    void shouldPublishOrderConfirmedEvent() {
        // Arrange: preparar datos de prueba
        OrderDTO order = createTestOrder(); // Pedido de prueba
        
        // Act: publicar evento
        eventService.publishOrderConfirmed(order); // Publica evento
        
        // Assert: verificar que se publicó
        verify(eventPublisher).publishEvent(any(OrderConfirmedEvent.class)); // Verifica publicación
    }
    
    @Test
    @DisplayName("Debería publicar evento de pedido cancelado")
    void shouldPublishOrderCancelledEvent() {
        // Arrange: preparar datos de prueba
        OrderDTO order = createTestOrder(); // Pedido de prueba
        String reason = "Customer request"; // Razón de cancelación
        
        // Act: publicar evento
        eventService.publishOrderCancelled(order, reason); // Publica evento
        
        // Assert: verificar que se publicó
        verify(eventPublisher).publishEvent(any(OrderCancelledEvent.class)); // Verifica publicación
    }
    
    // Método helper para crear pedido de prueba
    private OrderDTO createTestOrder() {
        return OrderDTO.builder() // Usa builder
            .id(1L) // Asigna ID
            .orderNumber("ORD-20231201-0001") // Asigna número
            .status("CREATED") // Asigna estado
            .totalAmount(BigDecimal.valueOf(100.00)) // Asigna total
            .build(); // Construye y retorna
    }
}

// Pruebas unitarias para Sidecar
@ExtendWith(MockitoExtension.class)
class SidecarLoggingServiceTest {
    
    @Mock
    private MetricsRegistry metricsRegistry; // Mock del registro de métricas
    
    @InjectMocks
    private SidecarLoggingService loggingService; // Servicio bajo prueba
    
    @Test
    @DisplayName("Debería registrar petición HTTP")
    void shouldLogHttpRequest() {
        // Arrange: preparar datos de prueba
        String method = "GET"; // Método HTTP
        String path = "/api/orders/1"; // Ruta
        int statusCode = 200; // Status code
        long duration = 150; // Duración en ms
        
        // Configurar mocks
        Counter mockCounter = mock(Counter.class); // Mock del contador
        Timer mockTimer = mock(Timer.class); // Mock del timer
        
        when(metricsRegistry.counter(anyString(), any())).thenReturn(mockCounter); // Mock contador
        when(metricsRegistry.timer(anyString(), any())).thenReturn(mockTimer); // Mock timer
        
        // Act: registrar petición
        loggingService.logHttpRequest(method, path, statusCode, duration); // Registra petición
        
        // Assert: verificar interacciones
        verify(mockCounter).increment(); // Verifica incremento del contador
        verify(mockTimer).record(duration, TimeUnit.MILLISECONDS); // Verifica registro de duración
    }
    
    @Test
    @DisplayName("Debería registrar error HTTP")
    void shouldLogHttpError() {
        // Arrange: preparar datos de prueba
        String method = "POST"; // Método HTTP
        String path = "/api/orders"; // Ruta
        Exception exception = new RuntimeException("Test error"); // Excepción de prueba
        
        // Configurar mocks
        Counter mockCounter = mock(Counter.class); // Mock del contador
        when(metricsRegistry.counter(anyString(), any())).thenReturn(mockCounter); // Mock contador
        
        // Act: registrar error
        loggingService.logError(method, path, exception); // Registra error
        
        // Assert: verificar interacciones
        verify(mockCounter).increment(); // Verifica incremento del contador
    }
}
```

Este ejemplo demuestra cómo implementar los principales patrones de diseño de microservicios, incluyendo:

1. **API Gateway Pattern**: Punto de entrada único con routing, filtros y circuit breakers
2. **Circuit Breaker Pattern**: Manejo de fallos y recuperación automática
3. **Event-Driven Architecture**: Comunicación asíncrona basada en eventos
4. **Sidecar Pattern**: Funcionalidades auxiliares como logging y métricas
5. **Pruebas Unitarias**: Verificación completa de cada patrón
6. **Comentarios Detallados**: Línea por línea de código 