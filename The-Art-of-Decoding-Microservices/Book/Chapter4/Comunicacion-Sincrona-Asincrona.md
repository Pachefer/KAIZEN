# Comunicación Síncrona vs Asíncrona en Microservicios

## Introducción

En el desarrollo de microservicios, la forma en que los servicios se comunican entre sí es fundamental para el rendimiento, escalabilidad y resiliencia del sistema. Existen dos enfoques principales: **comunicación síncrona** y **comunicación asíncrona**, cada uno con sus ventajas y casos de uso específicos.

## Comunicación Síncrona

### Características

La comunicación síncrona funciona como una llamada telefónica directa: un servicio hace una petición y espera la respuesta antes de continuar.

```java
// Ejemplo de comunicación síncrona con REST
// Esta clase demuestra cómo implementar comunicación síncrona entre microservicios
// usando Spring RestTemplate para hacer llamadas HTTP bloqueantes
@Service  // Anotación que marca esta clase como un servicio de Spring
public class SynchronousCommunicationService {
    
    // RestTemplate es la clase de Spring para hacer llamadas HTTP síncronas
    // Se inyecta a través del constructor para facilitar testing
    private final RestTemplate restTemplate;
    
    // Logger para registrar eventos y debugging
    // Se crea usando LoggerFactory con la clase actual como parámetro
    private final Logger logger = LoggerFactory.getLogger(SynchronousCommunicationService.class);
    
    // Constructor que recibe RestTemplate como dependencia
    // Esto permite inyección de dependencias y facilita testing unitario
    public SynchronousCommunicationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;  // Asigna la dependencia inyectada
    }
    
    /**
     * Comunicación síncrona: El cliente espera la respuesta
     * Este método demuestra el patrón de comunicación síncrona donde
     * cada llamada espera la respuesta antes de continuar
     * @param orderId ID del pedido a consultar
     * @return Información completa del pedido incluyendo producto y usuario
     */
    public OrderDetails getOrderDetailsSynchronously(Long orderId) {
        // Registra el inicio de la operación para debugging y monitoreo
        logger.info("Iniciando comunicación síncrona para orderId: {}", orderId);
        
        // Captura el tiempo de inicio para medir performance
        long startTime = System.currentTimeMillis();
        
        try {
            // PRIMERA LLAMADA SÍNCRONA: Obtener información del pedido
            // getForEntity hace una llamada HTTP GET y espera la respuesta
            // Si el servicio no responde, este hilo se bloquea hasta timeout
            ResponseEntity<Order> orderResponse = restTemplate.getForEntity(
                "http://order-service/api/orders/" + orderId,  // URL del servicio de pedidos
                Order.class  // Tipo de respuesta esperada
            );
            
            // Verifica que la respuesta HTTP sea exitosa (200 OK)
            // Si no es exitosa, lanza una excepción personalizada
            if (orderResponse.getStatusCode() != HttpStatus.OK) {
                throw new ServiceException("Error al obtener pedido: " + orderResponse.getStatusCode());
            }
            
            // Extrae el cuerpo de la respuesta HTTP
            Order order = orderResponse.getBody();
            
            // SEGUNDA LLAMADA SÍNCRONA: Obtener información del producto
            // Esta llamada se ejecuta solo después de que la primera termine
            // Si el servicio de productos está lento, bloquea todo el flujo
            ResponseEntity<Product> productResponse = restTemplate.getForEntity(
                "http://product-service/api/products/" + order.getProductId(),  // URL del servicio de productos
                Product.class  // Tipo de respuesta esperada
            );
            
            // Verifica respuesta del servicio de productos
            if (productResponse.getStatusCode() != HttpStatus.OK) {
                throw new ServiceException("Error al obtener producto: " + productResponse.getStatusCode());
            }
            
            // Extrae información del producto
            Product product = productResponse.getBody();
            
            // TERCERA LLAMADA SÍNCRONA: Obtener información del usuario
            // Esta llamada se ejecuta solo después de que las dos anteriores terminen
            // La latencia total es la suma de las tres llamadas
            ResponseEntity<User> userResponse = restTemplate.getForEntity(
                "http://user-service/api/users/" + order.getUserId(),  // URL del servicio de usuarios
                User.class  // Tipo de respuesta esperada
            );
            
            // Verifica respuesta del servicio de usuarios
            if (userResponse.getStatusCode() != HttpStatus.OK) {
                throw new ServiceException("Error al obtener usuario: " + userResponse.getStatusCode());
            }
            
            // Extrae información del usuario
            User user = userResponse.getBody();
            
            // Construye el objeto de respuesta completo
            // Combina información de los tres servicios en un solo objeto
            OrderDetails orderDetails = new OrderDetails(order, product, user);
            
            // Calcula y registra el tiempo total de la operación
            long endTime = System.currentTimeMillis();
            logger.info("Comunicación síncrona completada en {} ms", endTime - startTime);
            
            // Retorna la información completa del pedido
            return orderDetails;
            
        } catch (Exception e) {
            // Manejo de errores: registra el error y relanza como excepción personalizada
            logger.error("Error en comunicación síncrona: {}", e.getMessage());
            throw new ServiceException("Error en comunicación síncrona", e);
        }
    }
    
    /**
     * Ejemplo de comunicación síncrona con timeout
     * @param orderId ID del pedido
     * @return Información del pedido
     */
    public OrderDetails getOrderDetailsWithTimeout(Long orderId) {
        logger.info("Iniciando comunicación síncrona con timeout para orderId: {}", orderId);
        
        // Configurar timeout
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5 segundos
        factory.setReadTimeout(10000);   // 10 segundos
        
        RestTemplate timeoutRestTemplate = new RestTemplate(factory);
        
        try {
            ResponseEntity<Order> response = timeoutRestTemplate.getForEntity(
                "http://order-service/api/orders/" + orderId, 
                Order.class
            );
            
            Order order = response.getBody();
            return new OrderDetails(order, null, null);
            
        } catch (ResourceAccessException e) {
            logger.error("Timeout en comunicación síncrona: {}", e.getMessage());
            throw new ServiceException("Timeout en comunicación síncrona", e);
        }
    }
}

// Clase para representar detalles del pedido
public class OrderDetails {
    private Order order;
    private Product product;
    private User user;
    
    public OrderDetails(Order order, Product product, User user) {
        this.order = order;
        this.product = product;
        this.user = user;
    }
    
    // Getters
    public Order getOrder() { return order; }
    public Product getProduct() { return product; }
    public User getUser() { return user; }
}

// Clases de dominio
// La clase Order representa una entidad de dominio que modela un pedido en el sistema
// Esta clase es utilizada tanto en comunicación síncrona como asíncrona
public class Order {
    // ID único del pedido, generado automáticamente por la base de datos
    // Es la clave primaria de la entidad
    private Long id;
    
    // ID del usuario que realizó el pedido
    // Referencia a la entidad User (relación muchos a uno)
    private Long userId;
    
    // ID del producto que se pidió
    // Referencia a la entidad Product (relación muchos a uno)
    private Long productId;
    
    // Cantidad de productos solicitados en este pedido
    // Debe ser mayor que cero
    private Integer quantity;
    
    // Precio total del pedido (precio unitario * cantidad)
    // Se calcula automáticamente al crear el pedido
    private BigDecimal totalPrice;
    
    // Estado actual del pedido (CREATED, CONFIRMED, SHIPPED, etc.)
    // Determina en qué fase del proceso está el pedido
    private OrderStatus status;
    
    // Timestamp del momento en que se creó el pedido
    // Útil para auditoría y análisis temporal
    private LocalDateTime createdAt;
    
    // Constructor por defecto requerido por JPA
    // Permite a JPA crear instancias de la clase
    public Order() {}
    
    /**
     * Constructor con parámetros para crear un pedido completo
     * @param id ID único del pedido
     * @param userId ID del usuario que hizo el pedido
     * @param productId ID del producto pedido
     * @param quantity Cantidad solicitada
     * @param totalPrice Precio total calculado
     * @param status Estado inicial del pedido
     */
    public Order(Long id, Long userId, Long productId, Integer quantity, 
                 BigDecimal totalPrice, OrderStatus status) {
        this.id = id;                     // Asigna el ID único
        this.userId = userId;             // Asigna el ID del usuario
        this.productId = productId;       // Asigna el ID del producto
        this.quantity = quantity;         // Asigna la cantidad
        this.totalPrice = totalPrice;     // Asigna el precio total
        this.status = status;             // Asigna el estado inicial
        this.createdAt = LocalDateTime.now();  // Establece el timestamp de creación
    }
    
    // Métodos getter y setter para acceder y modificar los campos
    // Estos métodos son necesarios para JPA y serialización JSON
    
    /**
     * @return ID único del pedido
     */
    public Long getId() { return id; }
    
    /**
     * @param id ID único del pedido
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * @return ID del usuario que realizó el pedido
     */
    public Long getUserId() { return userId; }
    
    /**
     * @param userId ID del usuario que realizó el pedido
     */
    public void setUserId(Long userId) { this.userId = userId; }
    
    /**
     * @return ID del producto que se pidió
     */
    public Long getProductId() { return productId; }
    
    /**
     * @param productId ID del producto que se pidió
     */
    public void setProductId(Long productId) { this.productId = productId; }
    
    /**
     * @return Cantidad de productos solicitados
     */
    public Integer getQuantity() { return quantity; }
    
    /**
     * @param quantity Cantidad de productos solicitados
     */
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    /**
     * @return Precio total del pedido
     */
    public BigDecimal getTotalPrice() { return totalPrice; }
    
    /**
     * @param totalPrice Precio total del pedido
     */
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    
    /**
     * @return Estado actual del pedido
     */
    public OrderStatus getStatus() { return status; }
    
    /**
     * @param status Estado actual del pedido
     */
    public void setStatus(OrderStatus status) { this.status = status; }
    
    /**
     * @return Timestamp de creación del pedido
     */
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    /**
     * @param createdAt Timestamp de creación del pedido
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

public class Product {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    
    // Constructor, getters y setters
    public Product() {}
    
    public Product(Long id, String name, String description, BigDecimal price, Integer stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }
    
    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}

public class User {
    private Long id;
    private String name;
    private String email;
    private String address;
    
    // Constructor, getters y setters
    public User() {}
    
    public User(Long id, String name, String email, String address) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = address;
    }
    
    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}

// Enum para estado del pedido
// Este enum define los posibles estados que puede tener un pedido en el sistema
// Cada estado representa una fase específica del ciclo de vida del pedido
public enum OrderStatus {
    /**
     * Estado inicial cuando se crea un pedido
     * El pedido ha sido creado pero aún no ha sido procesado
     */
    CREATED,    // Creado
    
    /**
     * Estado cuando el pedido ha sido confirmado
     * El pedido ha sido validado y está listo para ser procesado
     */
    CONFIRMED,  // Confirmado
    
    /**
     * Estado cuando el pedido ha sido enviado
     * El producto ha sido empacado y enviado al cliente
     */
    SHIPPED,    // Enviado
    
    /**
     * Estado final cuando el pedido ha sido entregado
     * El producto ha llegado al cliente y el pedido está completo
     */
    DELIVERED,  // Entregado
    
    /**
     * Estado cuando el pedido ha sido cancelado
     * El pedido no se procesará y se cancela por alguna razón
     */
    CANCELLED   // Cancelado
}
```

### Ventajas de la Comunicación Síncrona

```java
// Ejemplo que demuestra las ventajas de la comunicación síncrona
public class SynchronousCommunicationAdvantages {
    
    /**
     * Ventaja 1: Simplicidad de implementación
     */
    public void demonstrateSimplicity() {
        System.out.println("Ventajas de la Comunicación Síncrona:");
        System.out.println("=====================================");
        System.out.println("1. Simplicidad: Fácil de entender e implementar");
        System.out.println("2. Feedback inmediato: Respuesta instantánea");
        System.out.println("3. Debugging fácil: Flujo lineal y predecible");
        System.out.println("4. Consistencia: Datos siempre actualizados");
        System.out.println("5. Transacciones: Soporte para ACID");
    }
    
    /**
     * Ventaja 2: Feedback inmediato
     */
    public boolean processOrderWithImmediateFeedback(Long orderId) {
        try {
            // El cliente recibe confirmación inmediata
            OrderDetails orderDetails = getOrderDetailsSynchronously(orderId);
            
            if (orderDetails.getOrder().getStatus() == OrderStatus.CONFIRMED) {
                System.out.println("Pedido confirmado inmediatamente");
                return true;
            } else {
                System.out.println("Pedido no confirmado");
                return false;
            }
            
        } catch (Exception e) {
            System.out.println("Error procesando pedido: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Ventaja 3: Debugging fácil
     */
    public void demonstrateEasyDebugging() {
        System.out.println("\nDebugging en Comunicación Síncrona:");
        System.out.println("===================================");
        System.out.println("1. Flujo lineal: A -> B -> C -> D");
        System.out.println("2. Stack trace completo disponible");
        System.out.println("3. Puntos de fallo claros");
        System.out.println("4. Logs secuenciales fáciles de seguir");
        System.out.println("5. Testing unitario directo");
    }
    
    private OrderDetails getOrderDetailsSynchronously(Long orderId) {
        // Simulación de llamada síncrona
        return new OrderDetails(
            new Order(orderId, 1L, 1L, 2, BigDecimal.valueOf(99.99), OrderStatus.CONFIRMED),
            new Product(1L, "Producto Test", "Descripción", BigDecimal.valueOf(49.99), 10),
            new User(1L, "Usuario Test", "usuario@test.com", "Dirección Test")
        );
    }
}
```

### Desventajas de la Comunicación Síncrona

```java
// Ejemplo que demuestra las desventajas de la comunicación síncrona
public class SynchronousCommunicationDisadvantages {
    
    /**
     * Desventaja 1: Acoplamiento fuerte
     */
    public void demonstrateTightCoupling() {
        System.out.println("Desventajas de la Comunicación Síncrona:");
        System.out.println("========================================");
        System.out.println("1. Acoplamiento fuerte: Servicios dependen entre sí");
        System.out.println("2. Latencia acumulativa: Tiempo total = suma de todos los servicios");
        System.out.println("3. Punto único de fallo: Si un servicio falla, todo falla");
        System.out.println("4. Escalabilidad limitada: No se puede escalar independientemente");
        System.out.println("5. Recursos bloqueados: Threads esperando respuestas");
    }
    
    /**
     * Desventaja 2: Latencia acumulativa
     */
    public void demonstrateLatencyAccumulation() {
        long startTime = System.currentTimeMillis();
        
        try {
            // Simular llamadas a múltiples servicios
            Thread.sleep(100); // Servicio A: 100ms
            Thread.sleep(200); // Servicio B: 200ms
            Thread.sleep(150); // Servicio C: 150ms
            Thread.sleep(300); // Servicio D: 300ms
            
            long totalTime = System.currentTimeMillis() - startTime;
            System.out.println("Tiempo total síncrono: " + totalTime + "ms");
            System.out.println("(Suma de todos los servicios: 100 + 200 + 150 + 300 = 750ms)");
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Desventaja 3: Punto único de fallo
     */
    public void demonstrateSinglePointOfFailure() {
        System.out.println("\nSimulación de fallo en cascada:");
        System.out.println("================================");
        
        try {
            // Simular fallo en el servicio B
            if (Math.random() < 0.5) { // 50% de probabilidad de fallo
                throw new ServiceException("Servicio B no disponible");
            }
            
            // Si B falla, A y C también fallan
            System.out.println("Servicio A: OK");
            System.out.println("Servicio B: FALLO");
            System.out.println("Servicio C: FALLO (dependiente de B)");
            System.out.println("Servicio D: FALLO (dependiente de C)");
            
        } catch (Exception e) {
            System.out.println("Error en cascada: " + e.getMessage());
        }
    }
    
    /**
     * Desventaja 4: Recursos bloqueados
     */
    public void demonstrateBlockedResources() {
        System.out.println("\nRecursos bloqueados en comunicación síncrona:");
        System.out.println("=============================================");
        System.out.println("1. Threads esperando respuestas");
        System.out.println("2. Conexiones HTTP mantenidas");
        System.out.println("3. Memoria ocupada por requests pendientes");
        System.out.println("4. CPU inactiva durante esperas");
        System.out.println("5. Conexiones de base de datos bloqueadas");
    }
}
```

## Comunicación Asíncrona

### Características

La comunicación asíncrona permite que los servicios envíen mensajes y continúen con su trabajo sin esperar respuestas inmediatas.

```java
// Ejemplo de comunicación asíncrona con RabbitMQ
@Configuration
public class AsynchronousCommunicationConfig {
    
    /**
     * Configuración de RabbitMQ para comunicación asíncrona
     */
    @Bean
    public Queue orderQueue() {
        return new Queue("order.queue", true); // Queue durable
    }
    
    @Bean
    public Queue notificationQueue() {
        return new Queue("notification.queue", true);
    }
    
    @Bean
    public Queue inventoryQueue() {
        return new Queue("inventory.queue", true);
    }
    
    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange("order.exchange");
    }
    
    @Bean
    public Binding orderBinding(Queue orderQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(orderQueue)
            .to(orderExchange)
            .with("order.created");
    }
    
    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(notificationQueue)
            .to(orderExchange)
            .with("order.created");
    }
    
    @Bean
    public Binding inventoryBinding(Queue inventoryQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(inventoryQueue)
            .to(orderExchange)
            .with("order.created");
    }
}

// Productor de mensajes asíncronos
// Esta clase es responsable de enviar mensajes a RabbitMQ de forma asíncrona
// Los mensajes se envían sin esperar respuesta, permitiendo que el productor continúe
@Component  // Anotación que marca esta clase como un componente de Spring
public class AsynchronousMessageProducer {
    
    // RabbitTemplate es la clase de Spring para interactuar con RabbitMQ
    // Permite enviar y recibir mensajes de forma asíncrona
    private final RabbitTemplate rabbitTemplate;
    
    // Logger para registrar eventos de mensajería
    // Útil para debugging y monitoreo de mensajes enviados
    private final Logger logger = LoggerFactory.getLogger(AsynchronousMessageProducer.class);
    
    // Constructor que recibe RabbitTemplate como dependencia
    // Esto permite inyección de dependencias y facilita testing
    public AsynchronousMessageProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;  // Asigna la dependencia inyectada
    }
    
    /**
     * Envía mensaje asíncrono de creación de pedido
     * Este método demuestra el patrón de comunicación asíncrona donde
     * el productor envía un mensaje y continúa sin esperar respuesta
     * @param order Pedido creado que se va a notificar
     */
    public void sendOrderCreatedMessage(Order order) {
        // Registra el inicio del envío del mensaje para debugging
        logger.info("Enviando mensaje asíncrono de pedido creado: {}", order.getId());
        
        // Crea un evento de dominio que representa la creación del pedido
        // Los eventos de dominio son objetos inmutables que representan algo que sucedió
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),           // ID único del pedido
            order.getUserId(),       // ID del usuario que hizo el pedido
            order.getProductId(),    // ID del producto pedido
            order.getQuantity(),     // Cantidad solicitada
            order.getTotalPrice(),   // Precio total del pedido
            LocalDateTime.now()      // Timestamp del momento de creación
        );
        
        // ENVÍO ASÍNCRONO: Envía el mensaje a RabbitMQ sin esperar respuesta
        // convertAndSend serializa el objeto y lo envía al exchange especificado
        // El método retorna inmediatamente, no bloquea el hilo actual
        rabbitTemplate.convertAndSend(
            "order.exchange",    // Nombre del exchange donde se publica el mensaje
            "order.created",     // Routing key que determina a qué colas va el mensaje
            event               // Objeto a serializar y enviar
        );
        
        // Registra que el mensaje se envió exitosamente
        // El productor puede continuar con otras tareas inmediatamente
        logger.info("Mensaje enviado exitosamente. Continuando con otras tareas...");
    }
    
    /**
     * Envía mensaje asíncrono de actualización de inventario
     * @param productId ID del producto
     * @param quantity Cantidad a reservar
     */
    public void sendInventoryUpdateMessage(Long productId, Integer quantity) {
        logger.info("Enviando mensaje asíncrono de actualización de inventario: productId={}, quantity={}", 
                   productId, quantity);
        
        InventoryUpdateEvent event = new InventoryUpdateEvent(
            productId,
            quantity,
            InventoryOperation.RESERVE,
            LocalDateTime.now()
        );
        
        rabbitTemplate.convertAndSend("order.exchange", "inventory.update", event);
    }
    
    /**
     * Envía mensaje asíncrono de notificación
     * @param userId ID del usuario
     * @param message Mensaje a enviar
     */
    public void sendNotificationMessage(Long userId, String message) {
        logger.info("Enviando mensaje asíncrono de notificación: userId={}, message={}", userId, message);
        
        NotificationEvent event = new NotificationEvent(
            userId,
            message,
            NotificationType.EMAIL,
            LocalDateTime.now()
        );
        
        rabbitTemplate.convertAndSend("order.exchange", "notification.send", event);
    }
}

// Eventos de dominio
// Los eventos de dominio son objetos inmutables que representan algo que sucedió en el sistema
// Son fundamentales en la arquitectura dirigida por eventos (EDA)
public class OrderCreatedEvent {
    // ID único del pedido que se creó
    // Este campo es esencial para identificar el pedido específico
    private Long orderId;
    
    // ID del usuario que realizó el pedido
    // Necesario para enviar notificaciones al usuario correcto
    private Long userId;
    
    // ID del producto que se pidió
    // Necesario para actualizar inventario y generar reportes
    private Long productId;
    
    // Cantidad de productos solicitados
    // Necesario para cálculos de inventario y facturación
    private Integer quantity;
    
    // Precio total del pedido
    // Necesario para reportes financieros y confirmaciones
    private BigDecimal totalPrice;
    
    // Timestamp del momento en que se creó el pedido
    // Útil para auditoría, debugging y análisis temporal
    private LocalDateTime createdAt;
    
    /**
     * Constructor que inicializa todos los campos del evento
     * Los eventos de dominio deben ser inmutables, por eso solo tienen constructor
     * @param orderId ID único del pedido
     * @param userId ID del usuario que hizo el pedido
     * @param productId ID del producto pedido
     * @param quantity Cantidad solicitada
     * @param totalPrice Precio total del pedido
     * @param createdAt Timestamp de creación
     */
    public OrderCreatedEvent(Long orderId, Long userId, Long productId, 
                           Integer quantity, BigDecimal totalPrice, LocalDateTime createdAt) {
        this.orderId = orderId;           // Asigna el ID del pedido
        this.userId = userId;             // Asigna el ID del usuario
        this.productId = productId;       // Asigna el ID del producto
        this.quantity = quantity;         // Asigna la cantidad
        this.totalPrice = totalPrice;     // Asigna el precio total
        this.createdAt = createdAt;       // Asigna el timestamp de creación
    }
    
    // Métodos getter para acceder a los campos del evento
    // Los eventos son inmutables, por eso solo tienen getters, no setters
    
    /**
     * @return ID único del pedido
     */
    public Long getOrderId() { return orderId; }
    
    /**
     * @return ID del usuario que realizó el pedido
     */
    public Long getUserId() { return userId; }
    
    /**
     * @return ID del producto que se pidió
     */
    public Long getProductId() { return productId; }
    
    /**
     * @return Cantidad de productos solicitados
     */
    public Integer getQuantity() { return quantity; }
    
    /**
     * @return Precio total del pedido
     */
    public BigDecimal getTotalPrice() { return totalPrice; }
    
    /**
     * @return Timestamp del momento de creación del pedido
     */
    public LocalDateTime getCreatedAt() { return createdAt; }
}

public class InventoryUpdateEvent {
    private Long productId;
    private Integer quantity;
    private InventoryOperation operation;
    private LocalDateTime timestamp;
    
    public InventoryUpdateEvent(Long productId, Integer quantity, 
                              InventoryOperation operation, LocalDateTime timestamp) {
        this.productId = productId;
        this.quantity = quantity;
        this.operation = operation;
        this.timestamp = timestamp;
    }
    
    // Getters
    public Long getProductId() { return productId; }
    public Integer getQuantity() { return quantity; }
    public InventoryOperation getOperation() { return operation; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

public class NotificationEvent {
    private Long userId;
    private String message;
    private NotificationType type;
    private LocalDateTime timestamp;
    
    public NotificationEvent(Long userId, String message, 
                           NotificationType type, LocalDateTime timestamp) {
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.timestamp = timestamp;
    }
    
    // Getters
    public Long getUserId() { return userId; }
    public String getMessage() { return message; }
    public NotificationType getType() { return type; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

// Enums para operaciones
public enum InventoryOperation {
    RESERVE,    // Reservar
    RELEASE,    // Liberar
    UPDATE      // Actualizar
}

public enum NotificationType {
    EMAIL,      // Email
    SMS,        // SMS
    PUSH        // Push notification
}
```

### Consumidores de Mensajes Asíncronos

```java
// Consumidor para notificaciones
// Esta clase es responsable de procesar mensajes de RabbitMQ de forma asíncrona
// Los consumidores se ejecutan en hilos separados y procesan mensajes cuando están disponibles
@Component  // Anotación que marca esta clase como un componente de Spring
public class NotificationMessageConsumer {
    
    // Logger para registrar eventos de procesamiento de mensajes
    // Útil para debugging y monitoreo de mensajes procesados
    private final Logger logger = LoggerFactory.getLogger(NotificationMessageConsumer.class);
    
    /**
     * Procesa mensajes de pedidos creados para enviar notificaciones
     * Este método se ejecuta automáticamente cuando llega un mensaje a la cola
     * Es un ejemplo de procesamiento asíncrono donde el consumidor actúa independientemente
     * @param event Evento de pedido creado que contiene toda la información necesaria
     */
    @RabbitListener(queues = "notification.queue")  // Anotación que indica que este método escucha la cola especificada
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Registra el inicio del procesamiento del mensaje
        logger.info("Procesando notificación para pedido creado: {}", event.getOrderId());
        
        try {
            // PROCESAMIENTO ASÍNCRONO: Envía notificaciones sin bloquear el productor
            // El productor ya continuó con otras tareas, este procesamiento es independiente
            
            // Simula el envío de email de confirmación
            // En un sistema real, aquí se integraría con un servicio de email
            sendOrderConfirmationEmail(event);
            
            // Simula el envío de SMS de confirmación
            // En un sistema real, aquí se integraría con un servicio de SMS
            sendOrderConfirmationSMS(event);
            
            // Registra que las notificaciones se enviaron exitosamente
            logger.info("Notificaciones enviadas exitosamente para pedido: {}", event.getOrderId());
            
        } catch (Exception e) {
            // Manejo de errores en procesamiento asíncrono
            // Los errores no afectan al productor, solo se registran para debugging
            logger.error("Error enviando notificaciones para pedido {}: {}", 
                        event.getOrderId(), e.getMessage());
            // En un sistema real, aquí se implementaría retry logic
            // Los mensajes fallidos podrían enviarse a una dead letter queue
        }
    }
    
    /**
     * Simula el envío de email de confirmación de pedido
     * En un sistema real, este método se integraría con un servicio de email
     * como SendGrid, Mailgun, o AWS SES
     * @param event Evento que contiene la información del pedido y usuario
     */
    private void sendOrderConfirmationEmail(OrderCreatedEvent event) {
        // Simulación de envío de email
        // En un sistema real, aquí se construiría el contenido del email
        // y se enviaría usando un servicio de email
        logger.info("Enviando email de confirmación a usuario {} para pedido {}", 
                   event.getUserId(), event.getOrderId());
        
        // Ejemplo de integración con servicio de email (comentado)
        // EmailRequest emailRequest = EmailRequest.builder()
        //     .to(event.getUserId())
        //     .subject("Confirmación de Pedido #" + event.getOrderId())
        //     .body("Su pedido ha sido confirmado...")
        //     .build();
        // emailService.sendOrderConfirmation(emailRequest);
    }
    
    /**
     * Simula el envío de SMS de confirmación de pedido
     * En un sistema real, este método se integraría con un servicio de SMS
     * como Twilio, AWS SNS, o un proveedor local
     * @param event Evento que contiene la información del pedido y usuario
     */
    private void sendOrderConfirmationSMS(OrderCreatedEvent event) {
        // Simulación de envío de SMS
        // En un sistema real, aquí se construiría el mensaje SMS
        // y se enviaría usando un servicio de SMS
        logger.info("Enviando SMS de confirmación a usuario {} para pedido {}", 
                   event.getUserId(), event.getOrderId());
        
        // Ejemplo de integración con servicio de SMS (comentado)
        // SMSRequest smsRequest = SMSRequest.builder()
        //     .to(event.getUserId())
        //     .message("Su pedido #" + event.getOrderId() + " ha sido confirmado")
        //     .build();
        // smsService.sendOrderConfirmation(smsRequest);
    }
}

// Consumidor para actualización de inventario
@Component
public class InventoryMessageConsumer {
    
    private final Logger logger = LoggerFactory.getLogger(InventoryMessageConsumer.class);
    
    /**
     * Procesa mensajes de actualización de inventario
     * @param event Evento de actualización de inventario
     */
    @RabbitListener(queues = "inventory.queue")
    public void handleInventoryUpdate(InventoryUpdateEvent event) {
        logger.info("Procesando actualización de inventario: productId={}, operation={}, quantity={}", 
                   event.getProductId(), event.getOperation(), event.getQuantity());
        
        try {
            switch (event.getOperation()) {
                case RESERVE:
                    reserveInventory(event);
                    break;
                case RELEASE:
                    releaseInventory(event);
                    break;
                case UPDATE:
                    updateInventory(event);
                    break;
                default:
                    logger.warn("Operación de inventario no reconocida: {}", event.getOperation());
            }
            
            logger.info("Actualización de inventario procesada exitosamente");
            
        } catch (Exception e) {
            logger.error("Error procesando actualización de inventario: {}", e.getMessage());
            // En un sistema real, aquí se implementaría retry logic
        }
    }
    
    private void reserveInventory(InventoryUpdateEvent event) {
        logger.info("Reservando {} unidades del producto {}", 
                   event.getQuantity(), event.getProductId());
        
        // Simulación de reserva de inventario
        // inventoryService.reserveStock(event.getProductId(), event.getQuantity());
    }
    
    private void releaseInventory(InventoryUpdateEvent event) {
        logger.info("Liberando {} unidades del producto {}", 
                   event.getQuantity(), event.getProductId());
        
        // Simulación de liberación de inventario
        // inventoryService.releaseStock(event.getProductId(), event.getQuantity());
    }
    
    private void updateInventory(InventoryUpdateEvent event) {
        logger.info("Actualizando inventario del producto {} con cantidad {}", 
                   event.getProductId(), event.getQuantity());
        
        // Simulación de actualización de inventario
        // inventoryService.updateStock(event.getProductId(), event.getQuantity());
    }
}
```

### Ventajas de la Comunicación Asíncrona

```java
// Ejemplo que demuestra las ventajas de la comunicación asíncrona
public class AsynchronousCommunicationAdvantages {
    
    /**
     * Ventaja 1: Desacoplamiento
     */
    public void demonstrateDecoupling() {
        System.out.println("Ventajas de la Comunicación Asíncrona:");
        System.out.println("======================================");
        System.out.println("1. Desacoplamiento: Servicios independientes");
        System.out.println("2. Escalabilidad: Cada servicio escala independientemente");
        System.out.println("3. Resiliencia: Fallos no se propagan");
        System.out.println("4. Rendimiento: No hay bloqueo de recursos");
        System.out.println("5. Flexibilidad: Fácil agregar nuevos consumidores");
    }
    
    /**
     * Ventaja 2: Escalabilidad independiente
     */
    public void demonstrateIndependentScaling() {
        System.out.println("\nEscalabilidad Independiente:");
        System.out.println("============================");
        System.out.println("Servicio A: 1 instancia (baja carga)");
        System.out.println("Servicio B: 3 instancias (alta carga)");
        System.out.println("Servicio C: 2 instancias (carga media)");
        System.out.println("Servicio D: 1 instancia (baja carga)");
        System.out.println("Cada servicio escala según sus necesidades específicas");
    }
    
    /**
     * Ventaja 3: Resiliencia
     */
    public void demonstrateResilience() {
        System.out.println("\nResiliencia en Comunicación Asíncrona:");
        System.out.println("=====================================");
        System.out.println("Si el servicio B falla:");
        System.out.println("- Servicio A: Continúa funcionando");
        System.out.println("- Servicio C: Continúa funcionando");
        System.out.println("- Servicio D: Continúa funcionando");
        System.out.println("- Mensajes se procesan cuando B se recupera");
    }
    
    /**
     * Ventaja 4: Rendimiento mejorado
     */
    public void demonstratePerformanceImprovement() {
        long startTime = System.currentTimeMillis();
        
        // Simular procesamiento paralelo
        CompletableFuture<Void> task1 = CompletableFuture.runAsync(() -> {
            try { Thread.sleep(100); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        
        CompletableFuture<Void> task2 = CompletableFuture.runAsync(() -> {
            try { Thread.sleep(200); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        
        CompletableFuture<Void> task3 = CompletableFuture.runAsync(() -> {
            try { Thread.sleep(150); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        
        CompletableFuture<Void> task4 = CompletableFuture.runAsync(() -> {
            try { Thread.sleep(300); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        
        // Esperar que todas las tareas completen
        CompletableFuture.allOf(task1, task2, task3, task4).join();
        
        long totalTime = System.currentTimeMillis() - startTime;
        System.out.println("Tiempo total asíncrono: " + totalTime + "ms");
        System.out.println("(Tiempo del servicio más lento: 300ms)");
    }
}
```

### Desventajas de la Comunicación Asíncrona

```java
// Ejemplo que demuestra las desventajas de la comunicación asíncrona
public class AsynchronousCommunicationDisadvantages {
    
    /**
     * Desventaja 1: Complejidad
     */
    public void demonstrateComplexity() {
        System.out.println("Desventajas de la Comunicación Asíncrona:");
        System.out.println("=========================================");
        System.out.println("1. Complejidad: Más difícil de entender y debuggear");
        System.out.println("2. Latencia: Respuestas no inmediatas");
        System.out.println("3. Consistencia eventual: Datos pueden estar desactualizados");
        System.out.println("4. Duplicación de mensajes: Requiere idempotencia");
        System.out.println("5. Orden de mensajes: Puede ser problemático");
    }
    
    /**
     * Desventaja 2: Debugging complejo
     */
    public void demonstrateComplexDebugging() {
        System.out.println("\nDebugging en Comunicación Asíncrona:");
        System.out.println("====================================");
        System.out.println("1. Flujo no lineal: A -> [Queue] -> B, C, D");
        System.out.println("2. Estados intermedios difíciles de rastrear");
        System.out.println("3. Mensajes perdidos o duplicados");
        System.out.println("4. Timeouts y reintentos");
        System.out.println("5. Logs distribuidos difíciles de correlacionar");
    }
    
    /**
     * Desventaja 3: Consistencia eventual
     */
    public void demonstrateEventualConsistency() {
        System.out.println("\nConsistencia Eventual:");
        System.out.println("=====================");
        System.out.println("Tiempo 0: Pedido creado");
        System.out.println("Tiempo 1: Inventario actualizado");
        System.out.println("Tiempo 2: Notificación enviada");
        System.out.println("Tiempo 3: Facturación procesada");
        System.out.println("Tiempo 4: Todos los sistemas sincronizados");
        System.out.println("Los datos pueden estar inconsistentes temporalmente");
    }
    
    /**
     * Desventaja 4: Duplicación de mensajes
     */
    public void demonstrateMessageDuplication() {
        System.out.println("\nDuplicación de Mensajes:");
        System.out.println("=======================");
        System.out.println("Problema: El mismo mensaje puede ser procesado múltiples veces");
        System.out.println("Solución: Implementar idempotencia");
        System.out.println("Ejemplo: Usar IDs únicos para evitar procesamiento duplicado");
    }
}
```

## Comparación y Selección

### Matriz de Decisión

```java
// Matriz de decisión para seleccionar tipo de comunicación
// Esta clase implementa un algoritmo de decisión basado en múltiples factores
// para determinar si usar comunicación síncrona o asíncrona
public class CommunicationDecisionMatrix {
    
    /**
     * Determina el tipo de comunicación apropiado basado en requisitos específicos
     * Este método evalúa múltiples factores y asigna puntuaciones para tomar una decisión
     * @param requirements Requisitos de comunicación del sistema
     * @return Tipo de comunicación recomendado (SÍNCRONO o ASÍNCRONO)
     */
    public CommunicationType selectCommunicationType(CommunicationRequirements requirements) {
        
        // Variables para acumular puntuaciones de cada tipo de comunicación
        // Se usa un sistema de puntuación de 1-3 donde 3 es la mejor opción
        int syncScore = 0;    // Puntuación para comunicación síncrona
        int asyncScore = 0;   // Puntuación para comunicación asíncrona
        
        // FACTOR 1: Necesidad de respuesta inmediata
        // Si se requiere respuesta inmediata, la comunicación síncrona es mejor
        if (requirements.isImmediateResponseRequired()) {
            syncScore += 3;   // Síncrono es ideal para respuestas inmediatas
            asyncScore += 1;  // Asíncrono no es ideal para respuestas inmediatas
        } else {
            syncScore += 1;   // Síncrono no es necesario si no se requiere respuesta inmediata
            asyncScore += 3;  // Asíncrono es mejor para procesamiento en background
        }
        
        // FACTOR 2: Volumen de tráfico
        // Para alto volumen, la comunicación asíncrona es más eficiente
        if (requirements.getTrafficVolume() > 1000) {  // Más de 1000 requests por segundo
            syncScore += 1;   // Síncrono puede saturar con alto volumen
            asyncScore += 3;  // Asíncrono maneja mejor el alto volumen
        } else {
            syncScore += 3;   // Síncrono es adecuado para bajo volumen
            asyncScore += 1;  // Asíncrono puede ser excesivo para bajo volumen
        }
        
        // FACTOR 3: Complejidad del sistema
        // Sistemas complejos se benefician más de comunicación asíncrona
        if (requirements.getSystemComplexity() > 7) {  // Escala de 1-10
            syncScore += 1;   // Síncrono puede ser difícil de mantener en sistemas complejos
            asyncScore += 3;  // Asíncrono facilita el desacoplamiento en sistemas complejos
        } else {
            syncScore += 3;   // Síncrono es más simple para sistemas simples
            asyncScore += 1;  // Asíncrono puede agregar complejidad innecesaria
        }
        
        // FACTOR 4: Requisitos de escalabilidad
        // La escalabilidad es una fortaleza de la comunicación asíncrona
        if (requirements.isHighScalabilityRequired()) {
            syncScore += 1;   // Síncrono tiene limitaciones de escalabilidad
            asyncScore += 3;  // Asíncrono permite escalar independientemente
        } else {
            syncScore += 3;   // Síncrono es adecuado si no se requiere alta escalabilidad
            asyncScore += 1;  // Asíncrono puede ser excesivo si no se requiere escalabilidad
        }
        
        // FACTOR 5: Tolerancia a fallos
        // La tolerancia a fallos es mejor con comunicación asíncrona
        if (requirements.isHighFaultToleranceRequired()) {
            syncScore += 1;   // Síncrono puede propagar fallos en cascada
            asyncScore += 3;  // Asíncrono aísla fallos y permite recuperación
        } else {
            syncScore += 3;   // Síncrono es adecuado si la tolerancia a fallos no es crítica
            asyncScore += 1;  // Asíncrono puede ser excesivo si no se requiere alta tolerancia
        }
        
        // DECISIÓN FINAL: Retorna el tipo con mayor puntuación
        // Si las puntuaciones son iguales, se favorece la comunicación síncrona por simplicidad
        return syncScore >= asyncScore ? CommunicationType.SYNCHRONOUS : CommunicationType.ASYNCHRONOUS;
    }
    
    /**
     * Imprime la matriz de decisión
     */
    public void printDecisionMatrix() {
        System.out.println("Matriz de Decisión: Comunicación Síncrona vs Asíncrona");
        System.out.println("=====================================================");
        System.out.println();
        System.out.println("Criterio                    | Síncrona | Asíncrona | Recomendación");
        System.out.println("----------------------------|----------|-----------|--------------");
        System.out.println("Respuesta inmediata         |    ✓     |     ✗     | Síncrona");
        System.out.println("Alto volumen de tráfico     |    ✗     |     ✓     | Asíncrona");
        System.out.println("Sistema simple              |    ✓     |     ✗     | Síncrona");
        System.out.println("Alta escalabilidad          |    ✗     |     ✓     | Asíncrona");
        System.out.println("Alta tolerancia a fallos    |    ✗     |     ✓     | Asíncrona");
        System.out.println("Transacciones ACID          |    ✓     |     ✗     | Síncrona");
        System.out.println("Debugging fácil             |    ✓     |     ✗     | Síncrona");
        System.out.println("Desacoplamiento             |    ✗     |     ✓     | Asíncrona");
    }
}

// Clase para requisitos de comunicación
public class CommunicationRequirements {
    private boolean immediateResponseRequired;
    private int trafficVolume; // requests per second
    private int systemComplexity; // 1-10 scale
    private boolean highScalabilityRequired;
    private boolean highFaultToleranceRequired;
    
    // Constructor
    public CommunicationRequirements(boolean immediateResponseRequired, int trafficVolume,
                                   int systemComplexity, boolean highScalabilityRequired,
                                   boolean highFaultToleranceRequired) {
        this.immediateResponseRequired = immediateResponseRequired;
        this.trafficVolume = trafficVolume;
        this.systemComplexity = systemComplexity;
        this.highScalabilityRequired = highScalabilityRequired;
        this.highFaultToleranceRequired = highFaultToleranceRequired;
    }
    
    // Getters
    public boolean isImmediateResponseRequired() { return immediateResponseRequired; }
    public int getTrafficVolume() { return trafficVolume; }
    public int getSystemComplexity() { return systemComplexity; }
    public boolean isHighScalabilityRequired() { return highScalabilityRequired; }
    public boolean isHighFaultToleranceRequired() { return highFaultToleranceRequired; }
}

// Enum para tipos de comunicación
public enum CommunicationType {
    SYNCHRONOUS,   // Comunicación síncrona
    ASYNCHRONOUS   // Comunicación asíncrona
}
```

### Ejemplos de Casos de Uso

```java
// Ejemplos de casos de uso para cada tipo de comunicación
public class CommunicationUseCases {
    
    /**
     * Casos de uso para comunicación síncrona
     */
    public void demonstrateSynchronousUseCases() {
        System.out.println("Casos de Uso para Comunicación SÍNCRONA:");
        System.out.println("========================================");
        System.out.println("1. Autenticación y autorización");
        System.out.println("2. Validación de datos en tiempo real");
        System.out.println("3. Consultas de información crítica");
        System.out.println("4. Transacciones financieras");
        System.out.println("5. Verificación de inventario");
        System.out.println("6. Cálculos en tiempo real");
        System.out.println("7. APIs públicas con respuesta inmediata");
    }
    
    /**
     * Casos de uso para comunicación asíncrona
     */
    public void demonstrateAsynchronousUseCases() {
        System.out.println("\nCasos de Uso para Comunicación ASÍNCRONA:");
        System.out.println("=========================================");
        System.out.println("1. Notificaciones por email/SMS");
        System.out.println("2. Procesamiento de archivos grandes");
        System.out.println("3. Actualización de inventario");
        System.out.println("4. Generación de reportes");
        System.out.println("5. Sincronización de datos");
        System.out.println("6. Análisis y analytics");
        System.out.println("7. Integración con sistemas externos");
    }
    
    /**
     * Ejemplo híbrido: Combinando ambos enfoques
     */
    public void demonstrateHybridApproach() {
        System.out.println("\nEnfoque HÍBRIDO:");
        System.out.println("================");
        System.out.println("1. Crear pedido: SÍNCRONO (validación inmediata)");
        System.out.println("2. Procesar pago: SÍNCRONO (confirmación inmediata)");
        System.out.println("3. Actualizar inventario: ASÍNCRONO (background)");
        System.out.println("4. Enviar notificaciones: ASÍNCRONO (background)");
        System.out.println("5. Generar factura: ASÍNCRONO (background)");
        System.out.println("6. Actualizar analytics: ASÍNCRONO (background)");
    }
}
```

## 📊 **RESULTADOS ESPERADOS Y MANEJO DE ERRORES**

### **🎯 Casos de Éxito Esperados**

#### **1. Comunicación Síncrona Exitosa**
```java
// ENTRADA
GET /api/orders/1/details

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "order": {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "CONFIRMED",
        "totalAmount": 150.00
    },
    "product": {
        "id": 1,
        "name": "Laptop Dell XPS 13",
        "price": 1200.00,
        "category": "Electronics"
    },
    "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan.perez@email.com"
    }
}

// LÓGICA EJECUTADA (SÍNCRONA):
// ✅ Llamada 1: GET /order-service/api/orders/1 (200ms)
// ✅ Llamada 2: GET /product-service/api/products/1 (150ms)
// ✅ Llamada 3: GET /user-service/api/users/1 (100ms)
// ✅ Tiempo total: 450ms (suma de las 3 llamadas)
// ✅ Respuesta inmediata con todos los datos
// ✅ Consistencia garantizada (datos del mismo momento)
```

#### **2. Comunicación Asíncrona Exitosa**
```java
// ENTRADA
POST /api/orders
{
    "userId": 1,
    "productId": 1,
    "quantity": 2
}

// RESULTADO ESPERADO - ÉXITO
HTTP 201 Created
{
    "orderId": 1,
    "status": "CREATED",
    "message": "Orden creada exitosamente"
}

// LÓGICA EJECUTADA (ASÍNCRONA):
// ✅ Orden creada inmediatamente (100ms)
// ✅ OrderCreatedEvent publicado en cola
// ✅ Respuesta HTTP 201 sin esperar procesamiento
// ✅ Background: InventoryService actualiza inventario
// ✅ Background: NotificationService envía email
// ✅ Background: AnalyticsService registra métricas
// ✅ Tiempo de respuesta: 100ms (solo creación)
```

#### **3. Procesamiento de Eventos Asíncronos**
```java
// EVENTO PUBLICADO
OrderCreatedEvent {
    "orderId": 1,
    "userId": 1,
    "productId": 1,
    "quantity": 2,
    "timestamp": "2024-01-15T10:30:00"
}

// RESULTADO ESPERADO - PROCESAMIENTO ASÍNCRONO
// ✅ InventoryService: Reduce inventario en 2 unidades
// ✅ NotificationService: Envía email de confirmación
// ✅ AnalyticsService: Registra venta para reportes
// ✅ BillingService: Genera factura en background
// ✅ ShippingService: Prepara envío

// LÓGICA EJECUTADA:
// ✅ Cada servicio procesa independientemente
// ✅ No bloquea la respuesta principal
// ✅ Procesamiento paralelo
// ✅ Tolerancia a fallos individuales
```

#### **4. Comunicación Híbrida Exitosa**
```java
// ENTRADA
POST /api/orders/checkout
{
    "orderId": 1,
    "paymentMethod": "CREDIT_CARD",
    "cardNumber": "4111111111111111"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "orderId": 1,
    "status": "PAID",
    "transactionId": "TXN_123456789",
    "message": "Pago procesado exitosamente"
}

// LÓGICA EJECUTADA (HÍBRIDA):
// ✅ SÍNCRONO: Validación de inventario (50ms) - ÉXITO
// ✅ SÍNCRONO: Procesamiento de pago (2000ms) - FALLA
// ✅ SÍNCRONO: Confirmación de orden - NO SE EJECUTA
// ✅ ASÍNCRONO: OrderPaidEvent - NO SE PUBLICA
// ✅ Orden permanece en estado PENDING
```

### **❌ Casos de Error Esperados**

#### **1. Error en Comunicación Síncrona - Timeout**
```java
// ENTRADA
GET /api/orders/1/details

// RESULTADO ESPERADO - ERROR
HTTP 504 Gateway Timeout
{
    "error": "SERVICE_TIMEOUT",
    "message": "Tiempo de espera agotado al obtener detalles del pedido",
    "details": "El servicio de productos no respondió en 10 segundos",
    "timestamp": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA (SÍNCRONA):
// ❌ Llamada 1: GET /order-service/api/orders/1 (200ms) - ÉXITO
// ❌ Llamada 2: GET /product-service/api/products/1 (10000ms) - TIMEOUT
// ❌ Llamada 3: NO SE EJECUTA (bloqueada por timeout)
// ❌ Toda la operación falla
// ❌ Usuario no recibe información parcial
```

#### **2. Error en Comunicación Síncrona - Servicio No Disponible**
```java
// ENTRADA
GET /api/orders/1/details

// RESULTADO ESPERADO - ERROR
HTTP 503 Service Unavailable
{
    "error": "SERVICE_UNAVAILABLE",
    "message": "Servicio de usuarios no disponible",
    "details": "Connection refused to user-service:8080",
    "timestamp": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA (SÍNCRONA):
// ❌ Llamada 1: GET /order-service/api/orders/1 (200ms) - ÉXITO
// ❌ Llamada 2: GET /product-service/api/products/1 (150ms) - ÉXITO
// ❌ Llamada 3: GET /user-service/api/users/1 - FALLA
// ❌ Toda la operación falla
// ❌ Circuit breaker activado
```

#### **3. Error en Comunicación Asíncrona - Mensaje Perdido**
```java
// ENTRADA
POST /api/orders
{
    "userId": 1,
    "productId": 1,
    "quantity": 2
}

// RESULTADO ESPERADO - ÉXITO PARCIAL
HTTP 201 Created
{
    "orderId": 1,
    "status": "CREATED",
    "message": "Orden creada exitosamente"
}

// LÓGICA EJECUTADA (ASÍNCRONA):
// ✅ Orden creada exitosamente
// ✅ OrderCreatedEvent publicado
// ❌ InventoryService: No recibe el evento (mensaje perdido)
// ✅ NotificationService: Recibe y procesa el evento
// ✅ AnalyticsService: Recibe y procesa el evento
// ❌ Inventario no actualizado (inconsistencia temporal)
```

#### **4. Error en Comunicación Asíncrona - Consumidor Fallido**
```java
// EVENTO PUBLICADO
OrderCreatedEvent {
    "orderId": 1,
    "userId": 1,
    "productId": 1,
    "quantity": 2
}

// RESULTADO ESPERADO - PROCESAMIENTO PARCIAL
// ✅ InventoryService: Procesa exitosamente
// ❌ NotificationService: Falla al enviar email
// ✅ AnalyticsService: Procesa exitosamente
// ✅ BillingService: Procesa exitosamente

// LÓGICA EJECUTADA:
// ✅ Orden principal no afectada
// ❌ Email de notificación no enviado
// ✅ Otros servicios continúan funcionando
// ✅ Reintentos automáticos configurados
```

#### **5. Error en Comunicación Híbrida - Pago Fallido**
```java
// ENTRADA
POST /api/orders/checkout
{
    "orderId": 1,
    "paymentMethod": "CREDIT_CARD",
    "cardNumber": "4000000000000002" // Tarjeta de prueba rechazada
}

// RESULTADO ESPERADO - ERROR
HTTP 422 Unprocessable Entity
{
    "error": "PAYMENT_DECLINED",
    "message": "Pago rechazado por el proveedor",
    "details": "Tarjeta declinada - fondos insuficientes",
    "timestamp": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA (HÍBRIDA):
// ✅ SÍNCRONO: Validación de inventario (50ms) - ÉXITO
// ❌ SÍNCRONO: Procesamiento de pago (2000ms) - FALLA
// ❌ SÍNCRONO: Confirmación de orden - NO SE EJECUTA
// ❌ ASÍNCRONO: OrderPaidEvent - NO SE PUBLICA
// ✅ Orden permanece en estado PENDING
```

### **🔄 Flujos de Comunicación Complejos**

#### **1. Flujo Exitoso: Crear Orden → Procesar Pago → Enviar Notificaciones**
```java
// PASO 1: Crear Orden (Asíncrono)
POST /api/orders → OrderCreatedEvent

// PASO 2: Procesar Pago (Síncrono)
POST /api/orders/1/checkout → PaymentProcessedEvent

// PASO 3: Enviar Notificaciones (Asíncrono)
NotificationService.onPaymentProcessed() → EmailSentEvent

// RESULTADO ESPERADO:
// ✅ Orden creada inmediatamente
// ✅ Pago procesado con confirmación
// ✅ Notificaciones enviadas en background
// ✅ Sistema resiliente a fallos parciales
```

#### **2. Flujo con Error: Servicio de Pagos No Disponible**
```java
// PASO 1: Crear Orden (Asíncrono)
POST /api/orders → OrderCreatedEvent ✅

// PASO 2: Procesar Pago (Síncrono)
POST /api/orders/1/checkout → ERROR ❌

// PASO 3: Notificaciones (Asíncrono)
NotificationService.onPaymentFailed() → PaymentFailedEmailSent ✅

// RESULTADO ESPERADO:
// ✅ Orden creada exitosamente
// ❌ Pago falla con error específico
// ✅ Notificación de error enviada
// ✅ Usuario puede reintentar el pago
```

### **📈 Métricas de Performance por Tipo de Comunicación**

#### **Comunicación Síncrona:**
- **Tiempo de respuesta:** 500-5000ms (suma de llamadas)
- **Throughput:** 100-1000 req/seg
- **Errores esperados:** < 5%
- **Latencia p95:** < 3000ms
- **Disponibilidad:** 99.5%

#### **Comunicación Asíncrona:**
- **Tiempo de respuesta:** 100-500ms (solo operación principal)
- **Throughput:** 1000-10000 req/seg
- **Errores esperados:** < 2%
- **Latencia p95:** < 500ms
- **Disponibilidad:** 99.9%

#### **Comunicación Híbrida:**
- **Tiempo de respuesta:** 1000-3000ms (operaciones críticas)
- **Throughput:** 500-2000 req/seg
- **Errores esperados:** < 3%
- **Latencia p95:** < 2000ms
- **Disponibilidad:** 99.7%

### **🛡️ Estrategias de Resiliencia**

#### **1. Circuit Breaker para Comunicación Síncrona**
```java
@CircuitBreaker(name = "orderDetailsService", fallbackMethod = "getOrderDetailsFallback")
public OrderDetails getOrderDetailsSynchronously(Long orderId) {
    // Llamadas síncronas con circuit breaker
    Order order = orderService.getOrder(orderId);
    Product product = productService.getProduct(order.getProductId());
    User user = userService.getUser(order.getUserId());
    
    return new OrderDetails(order, product, user);
}

public OrderDetails getOrderDetailsFallback(Long orderId, Exception e) {
    logger.warn("Fallback ejecutado para orderId: {}", orderId);
    // Retorna datos parciales o cache
    return new OrderDetails(orderService.getOrder(orderId), null, null);
}
```

#### **2. Retry Pattern para Comunicación Asíncrona**
```java
@Retry(name = "messageRetry", fallbackMethod = "sendMessageFallback")
public void sendOrderCreatedEvent(OrderCreatedEvent event) {
    kafkaTemplate.send("order-events", event);
}

public void sendMessageFallback(OrderCreatedEvent event, Exception e) {
    logger.error("Fallback ejecutado para evento: {}", event);
    // Almacena en base de datos para reprocesamiento
    deadLetterQueueService.store(event);
}
```

#### **3. Timeout Configuration**
```java
// Configuración de timeouts específicos
@Bean
public RestTemplate restTemplate() {
    return RestTemplateBuilder()
        .setConnectTimeout(Duration.ofSeconds(5))
        .setReadTimeout(Duration.ofSeconds(10))
        .build();
}

// Configuración de Kafka
spring.kafka.producer.properties.request.timeout.ms=30000
spring.kafka.consumer.properties.session.timeout.ms=30000
```

### **🧪 Pruebas de Comunicación**

#### **Pruebas de Comunicación Síncrona:**
```java
@Test
void getOrderDetails_ConServiciosDisponibles_DeberiaRetornarDetallesCompletos() {
    // Given
    when(orderService.getOrder(1L)).thenReturn(order);
    when(productService.getProduct(1L)).thenReturn(product);
    when(userService.getUser(1L)).thenReturn(user);
    
    // When
    OrderDetails result = syncService.getOrderDetailsSynchronously(1L);
    
    // Then
    assertThat(result.getOrder()).isEqualTo(order);
    assertThat(result.getProduct()).isEqualTo(product);
    assertThat(result.getUser()).isEqualTo(user);
}
```

#### **Pruebas de Comunicación Asíncrona:**
```java
@Test
void createOrder_DeberiaPublicarEvento() {
    // Given
    OrderRequest request = new OrderRequest(1L, 1L, 2);
    
    // When
    orderService.createOrder(request);
    
    // Then
    verify(kafkaTemplate).send("order-events", any(OrderCreatedEvent.class));
}
```

### **📊 Comparación: Síncrono vs Asíncrono**

#### **Comunicación Síncrona:**
```java
// ✅ Ventajas
- Simplicidad de implementación
- Respuesta inmediata
- Consistencia garantizada
- Debugging fácil

// ❌ Desventajas
- Acoplamiento fuerte
- Latencia acumulativa
- Punto único de fallo
- Escalabilidad limitada

// 📈 Casos de Uso
- Autenticación
- Validaciones críticas
- Transacciones financieras
- Consultas en tiempo real
```

#### **Comunicación Asíncrona:**
```java
// ✅ Ventajas
- Desacoplamiento
- Escalabilidad independiente
- Alta resiliencia
- Mejor rendimiento

// ❌ Desventajas
- Mayor complejidad
- Consistencia eventual
- Debugging complejo
- Posible duplicación

// 📈 Casos de Uso
- Notificaciones
- Procesamiento de archivos
- Actualización de inventario
- Analytics y reportes
```

Esta implementación garantiza que la comunicación entre microservicios sea robusta, escalable y resiliente, adaptándose a los diferentes requisitos de cada operación. 