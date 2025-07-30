# Capítulo 7: Estudios de Caso, Evitando Trampas y Futuro
## Sección: Common Pitfalls (Trampas Comunes en Microservicios)

---

### 1. Introducción y Teoría

Las **trampas comunes** en microservicios son errores frecuentes que pueden llevar al fracaso de la arquitectura. Es fundamental identificarlas y evitarlas:

- **Distributed Monolith**: Microservicios que están demasiado acoplados
- **Database per Service**: Problemas con gestión de datos distribuidos
- **Service Communication**: Problemas de comunicación entre servicios
- **Data Consistency**: Problemas de consistencia de datos
- **Over-engineering**: Complejidad innecesaria

**Categorías de trampas:**
- **Arquitectural Pitfalls**: Problemas de diseño de arquitectura
- **Operational Pitfalls**: Problemas de operación y mantenimiento
- **Development Pitfalls**: Problemas en el desarrollo
- **Testing Pitfalls**: Problemas en testing y calidad

---

### 2. Trampa 1: Distributed Monolith

#### 2.1. Ejemplo de Distributed Monolith (ANTI-PATRÓN)

```java
// ANTI-PATRÓN: Servicios demasiado acoplados (Distributed Monolith)
@Service
@Slf4j
public class DistributedMonolithUserService {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private ShippingService shippingService;
    
    // ANTI-PATRÓN: Método que hace demasiadas cosas y está muy acoplado
    @Transactional
    public UserOrderResult processUserOrder(UserOrderRequest request) {
        log.info("Procesando orden de usuario: {}", request.getUserId());
        
        try {
            // 1. VALIDAR USUARIO (responsabilidad del servicio de usuarios)
            UserValidationResult userValidation = validateUser(request.getUserId());
            if (!userValidation.isValid()) {
                return new UserOrderResult(false, "Usuario inválido: " + userValidation.getError());
            }
            
            // 2. VALIDAR INVENTARIO (responsabilidad del servicio de inventario)
            InventoryValidationResult inventoryValidation = inventoryService.validateInventory(request.getItems());
            if (!inventoryValidation.isAvailable()) {
                return new UserOrderResult(false, "Inventario insuficiente");
            }
            
            // 3. RESERVAR INVENTARIO (responsabilidad del servicio de inventario)
            boolean inventoryReserved = inventoryService.reserveInventory(request.getOrderId(), request.getItems());
            if (!inventoryReserved) {
                return new UserOrderResult(false, "Error reservando inventario");
            }
            
            // 4. PROCESAR PAGO (responsabilidad del servicio de pagos)
            PaymentResult paymentResult = paymentService.processPayment(request.getPaymentInfo(), request.getTotalAmount());
            if (!paymentResult.isSuccessful()) {
                inventoryService.releaseInventory(request.getOrderId());
                return new UserOrderResult(false, "Error procesando pago: " + paymentResult.getError());
            }
            
            // 5. CREAR ORDEN (responsabilidad del servicio de órdenes)
            Order order = orderService.createOrder(request);
            if (order == null) {
                paymentService.refundPayment(paymentResult.getTransactionId());
                inventoryService.releaseInventory(request.getOrderId());
                return new UserOrderResult(false, "Error creando orden");
            }
            
            // 6. PREPARAR ENVÍO (responsabilidad del servicio de envíos)
            ShippingPreparationResult shippingResult = shippingService.prepareShipping(order);
            if (!shippingResult.isSuccessful()) {
                orderService.cancelOrder(order.getOrderId());
                paymentService.refundPayment(paymentResult.getTransactionId());
                inventoryService.releaseInventory(request.getOrderId());
                return new UserOrderResult(false, "Error preparando envío");
            }
            
            // 7. ENVIAR NOTIFICACIONES (responsabilidad del servicio de notificaciones)
            notificationService.sendOrderConfirmation(request.getUserId(), order.getOrderId());
            notificationService.sendShippingNotification(request.getUserId(), order.getOrderId());
            
            // 8. ACTUALIZAR ESTADÍSTICAS DE USUARIO (responsabilidad del servicio de usuarios)
            updateUserStatistics(request.getUserId(), order.getTotalAmount());
            
            log.info("Orden procesada exitosamente: {}", order.getOrderId());
            return new UserOrderResult(true, "Orden procesada exitosamente", order);
            
        } catch (Exception e) {
            log.error("Error procesando orden: {}", e.getMessage(), e);
            
            // ANTI-PATRÓN: Rollback manual de múltiples servicios
            try {
                orderService.cancelOrder(request.getOrderId());
                paymentService.refundPayment(request.getPaymentInfo().getTransactionId());
                inventoryService.releaseInventory(request.getOrderId());
            } catch (Exception rollbackError) {
                log.error("Error en rollback: {}", rollbackError.getMessage(), rollbackError);
            }
            
            return new UserOrderResult(false, "Error interno: " + e.getMessage());
        }
    }
    
    // ANTI-PATRÓN: Métodos que no deberían estar en este servicio
    private UserValidationResult validateUser(String userId) {
        // Lógica de validación de usuario que debería estar en UserService
        return new UserValidationResult(true, null);
    }
    
    private void updateUserStatistics(String userId, BigDecimal totalAmount) {
        // Lógica de estadísticas que debería estar en UserService
        log.info("Actualizando estadísticas para usuario: {}", userId);
    }
}
```

#### 2.2. Solución: Servicios Correctamente Separados

```java
// PATRÓN CORRECTO: Servicios con responsabilidades bien definidas
@Service
@Slf4j
public class ProperUserService {
    
    @Autowired
    private EventPublisher eventPublisher;
    
    // Responsabilidad única: Gestión de usuarios
    public UserValidationResult validateUser(String userId) {
        log.info("Validando usuario: {}", userId);
        
        try {
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                return new UserValidationResult(false, "Usuario no encontrado");
            }
            
            if (!user.isActive()) {
                return new UserValidationResult(false, "Usuario inactivo");
            }
            
            if (user.isBlocked()) {
                return new UserValidationResult(false, "Usuario bloqueado");
            }
            
            return new UserValidationResult(true, null);
            
        } catch (Exception e) {
            log.error("Error validando usuario: {}", e.getMessage(), e);
            return new UserValidationResult(false, "Error interno");
        }
    }
    
    // Responsabilidad única: Actualizar estadísticas de usuario
    public void updateUserStatistics(String userId, BigDecimal totalAmount) {
        log.info("Actualizando estadísticas para usuario: {}", userId);
        
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setTotalOrders(user.getTotalOrders() + 1);
                user.setTotalSpent(user.getTotalSpent().add(totalAmount));
                user.setLastOrderDate(Instant.now());
                userRepository.save(user);
                
                // Publicar evento para otros servicios
                UserStatisticsUpdatedEvent event = new UserStatisticsUpdatedEvent(
                    userId, totalAmount, Instant.now());
                eventPublisher.publishEvent("user.statistics.updated", event);
            }
            
        } catch (Exception e) {
            log.error("Error actualizando estadísticas: {}", e.getMessage(), e);
        }
    }
    
    // Responsabilidad única: Crear usuario
    public User createUser(CreateUserRequest request) {
        log.info("Creando usuario: {}", request.getEmail());
        
        try {
            // Validar que el email no existe
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new UserAlreadyExistsException("Usuario ya existe");
            }
            
            // Crear usuario
            User user = new User();
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setActive(true);
            user.setCreatedAt(Instant.now());
            
            user = userRepository.save(user);
            
            // Publicar evento
            UserCreatedEvent event = new UserCreatedEvent(user.getId(), user.getEmail(), Instant.now());
            eventPublisher.publishEvent("user.created", event);
            
            log.info("Usuario creado exitosamente: {}", user.getId());
            return user;
            
        } catch (Exception e) {
            log.error("Error creando usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

---

### 3. Trampa 2: Database per Service

#### 3.1. Ejemplo de Database per Service (ANTI-PATRÓN)

```java
// ANTI-PATRÓN: Servicios compartiendo base de datos
@Service
@Slf4j
public class SharedDatabaseService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // ANTI-PATRÓN: Acceso directo a tablas de otros servicios
    public OrderWithUserInfo getOrderWithUserInfo(String orderId) {
        log.info("Obteniendo orden con información de usuario: {}", orderId);
        
        try {
            // ANTI-PATRÓN: JOIN entre tablas de diferentes servicios
            String sql = """
                SELECT o.order_id, o.total_amount, o.status, o.created_at,
                       u.user_id, u.email, u.name, u.phone
                FROM orders o
                JOIN users u ON o.user_id = u.user_id
                WHERE o.order_id = ?
                """;
            
            OrderWithUserInfo result = jdbcTemplate.queryForObject(sql, 
                new Object[]{orderId}, 
                (rs, rowNum) -> {
                    OrderWithUserInfo orderInfo = new OrderWithUserInfo();
                    orderInfo.setOrderId(rs.getString("order_id"));
                    orderInfo.setTotalAmount(rs.getBigDecimal("total_amount"));
                    orderInfo.setStatus(rs.getString("status"));
                    orderInfo.setCreatedAt(rs.getTimestamp("created_at").toInstant());
                    orderInfo.setUserId(rs.getString("user_id"));
                    orderInfo.setUserEmail(rs.getString("email"));
                    orderInfo.setUserName(rs.getString("name"));
                    orderInfo.setUserPhone(rs.getString("phone"));
                    return orderInfo;
                });
            
            log.info("Orden con información de usuario obtenida: {}", orderId);
            return result;
            
        } catch (Exception e) {
            log.error("Error obteniendo orden con información de usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // ANTI-PATRÓN: Transacciones distribuidas manuales
    @Transactional
    public boolean processOrderWithUserUpdate(String orderId, String userId, BigDecimal amount) {
        log.info("Procesando orden con actualización de usuario: {}", orderId);
        
        try {
            // ANTI-PATRÓN: Actualizar múltiples tablas en una transacción
            jdbcTemplate.update("UPDATE orders SET status = 'PROCESSED' WHERE order_id = ?", orderId);
            jdbcTemplate.update("UPDATE users SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE user_id = ?", 
                amount, userId);
            
            log.info("Orden procesada con actualización de usuario: {}", orderId);
            return true;
            
        } catch (Exception e) {
            log.error("Error procesando orden con actualización de usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

#### 3.2. Solución: Database per Service Correcto

```java
// PATRÓN CORRECTO: Cada servicio con su propia base de datos
@Service
@Slf4j
public class ProperOrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserServiceClient userServiceClient; // Cliente para servicio de usuarios
    
    @Autowired
    private EventPublisher eventPublisher;
    
    // PATRÓN CORRECTO: Solo accede a datos de órdenes
    public Order getOrder(String orderId) {
        log.info("Obteniendo orden: {}", orderId);
        
        try {
            Order order = orderRepository.findById(orderId).orElse(null);
            
            if (order != null) {
                log.info("Orden obtenida: {}", orderId);
            } else {
                log.warn("Orden no encontrada: {}", orderId);
            }
            
            return order;
            
        } catch (Exception e) {
            log.error("Error obteniendo orden: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // PATRÓN CORRECTO: Obtener información de usuario via API
    public OrderWithUserInfo getOrderWithUserInfo(String orderId) {
        log.info("Obteniendo orden con información de usuario: {}", orderId);
        
        try {
            // Obtener orden de la base de datos local
            Order order = getOrder(orderId);
            if (order == null) {
                return null;
            }
            
            // Obtener información de usuario via API
            UserInfo userInfo = userServiceClient.getUserInfo(order.getUserId());
            
            // Combinar información
            OrderWithUserInfo result = new OrderWithUserInfo();
            result.setOrderId(order.getOrderId());
            result.setTotalAmount(order.getTotalAmount());
            result.setStatus(order.getStatus());
            result.setCreatedAt(order.getCreatedAt());
            result.setUserId(userInfo.getUserId());
            result.setUserEmail(userInfo.getEmail());
            result.setUserName(userInfo.getName());
            result.setUserPhone(userInfo.getPhone());
            
            log.info("Orden con información de usuario obtenida: {}", orderId);
            return result;
            
        } catch (Exception e) {
            log.error("Error obteniendo orden con información de usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // PATRÓN CORRECTO: Solo actualiza datos de órdenes
    @Transactional
    public Order processOrder(String orderId) {
        log.info("Procesando orden: {}", orderId);
        
        try {
            Order order = getOrder(orderId);
            if (order == null) {
                throw new OrderNotFoundException("Orden no encontrada: " + orderId);
            }
            
            // Actualizar solo datos de la orden
            order.setStatus(OrderStatus.PROCESSED);
            order.setProcessedAt(Instant.now());
            order = orderRepository.save(order);
            
            // Publicar evento para que otros servicios reaccionen
            OrderProcessedEvent event = new OrderProcessedEvent(
                order.getOrderId(), 
                order.getUserId(), 
                order.getTotalAmount(), 
                Instant.now()
            );
            eventPublisher.publishEvent("order.processed", event);
            
            log.info("Orden procesada exitosamente: {}", orderId);
            return order;
            
        } catch (Exception e) {
            log.error("Error procesando orden: {}", e.getMessage(), e);
            throw e;
        }
    }
}

// Cliente para servicio de usuarios
@Component
@Slf4j
public class UserServiceClient {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public UserInfo getUserInfo(String userId) {
        try {
            String url = "http://user-service/api/users/" + userId;
            ResponseEntity<UserInfo> response = restTemplate.getForEntity(url, UserInfo.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                log.warn("Error obteniendo información de usuario: {}", response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            log.error("Error llamando servicio de usuarios: {}", e.getMessage(), e);
            return null;
        }
    }
}
```

---

### 4. Trampa 3: Service Communication

#### 4.1. Ejemplo de Comunicación Síncrona Excesiva (ANTI-PATRÓN)

```java
// ANTI-PATRÓN: Comunicación síncrona excesiva entre servicios
@Service
@Slf4j
public class SynchronousCommunicationService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    // ANTI-PATRÓN: Múltiples llamadas síncronas en cascada
    public OrderResult processOrderSynchronously(OrderRequest request) {
        log.info("Procesando orden de forma síncrona: {}", request.getOrderId());
        
        try {
            // 1. Validar usuario (llamada síncrona)
            String userValidationUrl = "http://user-service/api/users/" + request.getUserId() + "/validate";
            ResponseEntity<UserValidationResponse> userResponse = restTemplate.getForEntity(
                userValidationUrl, UserValidationResponse.class);
            
            if (!userResponse.getStatusCode().is2xxSuccessful() || !userResponse.getBody().isValid()) {
                return new OrderResult(false, "Usuario inválido");
            }
            
            // 2. Validar inventario (llamada síncrona)
            String inventoryValidationUrl = "http://inventory-service/api/inventory/validate";
            InventoryValidationRequest inventoryRequest = new InventoryValidationRequest(request.getItems());
            ResponseEntity<InventoryValidationResponse> inventoryResponse = restTemplate.postForEntity(
                inventoryValidationUrl, inventoryRequest, InventoryValidationResponse.class);
            
            if (!inventoryResponse.getStatusCode().is2xxSuccessful() || !inventoryResponse.getBody().isAvailable()) {
                return new OrderResult(false, "Inventario insuficiente");
            }
            
            // 3. Reservar inventario (llamada síncrona)
            String inventoryReservationUrl = "http://inventory-service/api/inventory/reserve";
            InventoryReservationRequest reservationRequest = new InventoryReservationRequest(
                request.getOrderId(), request.getItems());
            ResponseEntity<InventoryReservationResponse> reservationResponse = restTemplate.postForEntity(
                inventoryReservationUrl, reservationRequest, InventoryReservationResponse.class);
            
            if (!reservationResponse.getStatusCode().is2xxSuccessful() || !reservationResponse.getBody().isReserved()) {
                return new OrderResult(false, "Error reservando inventario");
            }
            
            // 4. Procesar pago (llamada síncrona)
            String paymentUrl = "http://payment-service/api/payments/process";
            PaymentRequest paymentRequest = new PaymentRequest(request.getPaymentInfo(), request.getTotalAmount());
            ResponseEntity<PaymentResponse> paymentResponse = restTemplate.postForEntity(
                paymentUrl, paymentRequest, PaymentResponse.class);
            
            if (!paymentResponse.getStatusCode().is2xxSuccessful() || !paymentResponse.getBody().isSuccessful()) {
                // Rollback manual
                String rollbackUrl = "http://inventory-service/api/inventory/release";
                restTemplate.postForEntity(rollbackUrl, request.getOrderId(), String.class);
                return new OrderResult(false, "Error procesando pago");
            }
            
            // 5. Crear orden (llamada síncrona)
            String orderUrl = "http://order-service/api/orders";
            ResponseEntity<OrderResponse> orderResponse = restTemplate.postForEntity(
                orderUrl, request, OrderResponse.class);
            
            if (!orderResponse.getStatusCode().is2xxSuccessful()) {
                // Rollback manual
                String paymentRollbackUrl = "http://payment-service/api/payments/refund";
                restTemplate.postForEntity(paymentRollbackUrl, paymentResponse.getBody().getTransactionId(), String.class);
                String inventoryRollbackUrl = "http://inventory-service/api/inventory/release";
                restTemplate.postForEntity(inventoryRollbackUrl, request.getOrderId(), String.class);
                return new OrderResult(false, "Error creando orden");
            }
            
            // 6. Enviar notificación (llamada síncrona)
            String notificationUrl = "http://notification-service/api/notifications/send";
            NotificationRequest notificationRequest = new NotificationRequest(
                request.getUserId(), "ORDER_CONFIRMED", orderResponse.getBody().getOrderId());
            ResponseEntity<NotificationResponse> notificationResponse = restTemplate.postForEntity(
                notificationUrl, notificationRequest, NotificationResponse.class);
            
            if (!notificationResponse.getStatusCode().is2xxSuccessful()) {
                log.warn("Error enviando notificación, pero orden procesada");
            }
            
            log.info("Orden procesada exitosamente de forma síncrona: {}", request.getOrderId());
            return new OrderResult(true, "Orden procesada exitosamente", orderResponse.getBody());
            
        } catch (Exception e) {
            log.error("Error procesando orden de forma síncrona: {}", e.getMessage(), e);
            
            // ANTI-PATRÓN: Rollback manual complejo
            try {
                performRollback(request);
            } catch (Exception rollbackError) {
                log.error("Error en rollback: {}", rollbackError.getMessage(), rollbackError);
            }
            
            return new OrderResult(false, "Error interno: " + e.getMessage());
        }
    }
    
    // ANTI-PATRÓN: Rollback manual complejo
    private void performRollback(OrderRequest request) {
        log.info("Realizando rollback para orden: {}", request.getOrderId());
        
        try {
            // Rollback de inventario
            String inventoryRollbackUrl = "http://inventory-service/api/inventory/release";
            restTemplate.postForEntity(inventoryRollbackUrl, request.getOrderId(), String.class);
            
            // Rollback de pago (si se procesó)
            // Rollback de orden (si se creó)
            // Rollback de notificación (si se envió)
            
        } catch (Exception e) {
            log.error("Error en rollback: {}", e.getMessage(), e);
        }
    }
}
```

#### 4.2. Solución: Comunicación Asíncrona con Eventos

```java
// PATRÓN CORRECTO: Comunicación asíncrona con eventos
@Service
@Slf4j
public class AsynchronousCommunicationService {
    
    @Autowired
    private EventPublisher eventPublisher;
    
    @Autowired
    private OrderRepository orderRepository;
    
    // PATRÓN CORRECTO: Procesamiento asíncrono con eventos
    @Transactional
    public OrderResult processOrderAsynchronously(OrderRequest request) {
        log.info("Procesando orden de forma asíncrona: {}", request.getOrderId());
        
        try {
            // 1. Crear orden en estado PENDING
            Order order = new Order();
            order.setOrderId(request.getOrderId());
            order.setUserId(request.getUserId());
            order.setItems(request.getItems());
            order.setTotalAmount(request.getTotalAmount());
            order.setStatus(OrderStatus.PENDING);
            order.setCreatedAt(Instant.now());
            
            order = orderRepository.save(order);
            
            // 2. Publicar evento de orden creada
            OrderCreatedEvent orderCreatedEvent = new OrderCreatedEvent(
                order.getOrderId(),
                order.getUserId(),
                order.getItems(),
                order.getTotalAmount(),
                Instant.now()
            );
            eventPublisher.publishEvent("order.created", orderCreatedEvent);
            
            log.info("Orden creada y evento publicado: {}", request.getOrderId());
            return new OrderResult(true, "Orden creada, procesamiento en progreso", order);
            
        } catch (Exception e) {
            log.error("Error creando orden: {}", e.getMessage(), e);
            return new OrderResult(false, "Error interno: " + e.getMessage());
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para validación de usuario
    @EventListener
    public void handleUserValidation(OrderCreatedEvent event) {
        log.info("Manejando validación de usuario para orden: {}", event.getOrderId());
        
        try {
            // Validar usuario (puede ser asíncrono)
            UserValidationResult validationResult = userService.validateUser(event.getUserId());
            
            if (validationResult.isValid()) {
                // Publicar evento de usuario validado
                UserValidatedEvent userValidatedEvent = new UserValidatedEvent(
                    event.getOrderId(), event.getUserId(), Instant.now());
                eventPublisher.publishEvent("user.validated", userValidatedEvent);
            } else {
                // Publicar evento de validación fallida
                UserValidationFailedEvent validationFailedEvent = new UserValidationFailedEvent(
                    event.getOrderId(), event.getUserId(), validationResult.getError(), Instant.now());
                eventPublisher.publishEvent("user.validation.failed", validationFailedEvent);
            }
            
        } catch (Exception e) {
            log.error("Error validando usuario: {}", e.getMessage(), e);
            
            // Publicar evento de error
            UserValidationFailedEvent validationFailedEvent = new UserValidationFailedEvent(
                event.getOrderId(), event.getUserId(), "Error interno", Instant.now());
            eventPublisher.publishEvent("user.validation.failed", validationFailedEvent);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para validación de inventario
    @EventListener
    public void handleInventoryValidation(UserValidatedEvent event) {
        log.info("Manejando validación de inventario para orden: {}", event.getOrderId());
        
        try {
            // Validar inventario
            InventoryValidationResult validationResult = inventoryService.validateInventory(event.getItems());
            
            if (validationResult.isAvailable()) {
                // Publicar evento de inventario validado
                InventoryValidatedEvent inventoryValidatedEvent = new InventoryValidatedEvent(
                    event.getOrderId(), event.getItems(), Instant.now());
                eventPublisher.publishEvent("inventory.validated", inventoryValidatedEvent);
            } else {
                // Publicar evento de validación fallida
                InventoryValidationFailedEvent validationFailedEvent = new InventoryValidationFailedEvent(
                    event.getOrderId(), "Inventario insuficiente", Instant.now());
                eventPublisher.publishEvent("inventory.validation.failed", validationFailedEvent);
            }
            
        } catch (Exception e) {
            log.error("Error validando inventario: {}", e.getMessage(), e);
            
            InventoryValidationFailedEvent validationFailedEvent = new InventoryValidationFailedEvent(
                event.getOrderId(), "Error interno", Instant.now());
            eventPublisher.publishEvent("inventory.validation.failed", validationFailedEvent);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para procesamiento de pago
    @EventListener
    public void handlePaymentProcessing(InventoryValidatedEvent event) {
        log.info("Manejando procesamiento de pago para orden: {}", event.getOrderId());
        
        try {
            // Procesar pago
            PaymentResult paymentResult = paymentService.processPayment(event.getOrderId());
            
            if (paymentResult.isSuccessful()) {
                // Publicar evento de pago exitoso
                PaymentProcessedEvent paymentProcessedEvent = new PaymentProcessedEvent(
                    event.getOrderId(), paymentResult.getTransactionId(), Instant.now());
                eventPublisher.publishEvent("payment.processed", paymentProcessedEvent);
            } else {
                // Publicar evento de pago fallido
                PaymentFailedEvent paymentFailedEvent = new PaymentFailedEvent(
                    event.getOrderId(), paymentResult.getError(), Instant.now());
                eventPublisher.publishEvent("payment.failed", paymentFailedEvent);
            }
            
        } catch (Exception e) {
            log.error("Error procesando pago: {}", e.getMessage(), e);
            
            PaymentFailedEvent paymentFailedEvent = new PaymentFailedEvent(
                event.getOrderId(), "Error interno", Instant.now());
            eventPublisher.publishEvent("payment.failed", paymentFailedEvent);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para finalización de orden
    @EventListener
    public void handleOrderCompletion(PaymentProcessedEvent event) {
        log.info("Finalizando orden: {}", event.getOrderId());
        
        try {
            // Actualizar estado de la orden
            Order order = orderRepository.findByOrderId(event.getOrderId());
            if (order != null) {
                order.setStatus(OrderStatus.CONFIRMED);
                order.setConfirmedAt(Instant.now());
                orderRepository.save(order);
            }
            
            // Publicar evento de orden confirmada
            OrderConfirmedEvent orderConfirmedEvent = new OrderConfirmedEvent(
                event.getOrderId(), event.getTransactionId(), Instant.now());
            eventPublisher.publishEvent("order.confirmed", orderConfirmedEvent);
            
            log.info("Orden confirmada exitosamente: {}", event.getOrderId());
            
        } catch (Exception e) {
            log.error("Error finalizando orden: {}", e.getMessage(), e);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para cancelación
    @EventListener
    public void handleOrderCancellation(OrderCancellationEvent event) {
        log.info("Cancelando orden: {}", event.getOrderId());
        
        try {
            // Actualizar estado de la orden
            Order order = orderRepository.findByOrderId(event.getOrderId());
            if (order != null) {
                order.setStatus(OrderStatus.CANCELLED);
                order.setCancelledAt(Instant.now());
                order.setCancellationReason(event.getReason());
                orderRepository.save(order);
            }
            
            log.info("Orden cancelada: {}", event.getOrderId());
            
        } catch (Exception e) {
            log.error("Error cancelando orden: {}", e.getMessage(), e);
        }
    }
}
```

---

### 5. Trampa 4: Data Consistency

#### 5.1. Ejemplo de Consistencia de Datos (ANTI-PATRÓN)

```java
// ANTI-PATRÓN: Intentar mantener consistencia síncrona entre servicios
@Service
@Slf4j
public class SynchronousDataConsistencyService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    // ANTI-PATRÓN: Transacción distribuida manual
    @Transactional
    public boolean updateUserAndOrders(String userId, UserUpdateRequest userRequest, List<OrderUpdateRequest> orderRequests) {
        log.info("Actualizando usuario y órdenes de forma síncrona: {}", userId);
        
        try {
            // 1. Actualizar usuario
            String userUpdateUrl = "http://user-service/api/users/" + userId;
            ResponseEntity<UserUpdateResponse> userResponse = restTemplate.put(
                userUpdateUrl, userRequest, UserUpdateResponse.class);
            
            if (!userResponse.getStatusCode().is2xxSuccessful()) {
                log.error("Error actualizando usuario: {}", userId);
                return false;
            }
            
            // 2. Actualizar órdenes
            for (OrderUpdateRequest orderRequest : orderRequests) {
                String orderUpdateUrl = "http://order-service/api/orders/" + orderRequest.getOrderId();
                ResponseEntity<OrderUpdateResponse> orderResponse = restTemplate.put(
                    orderUpdateUrl, orderRequest, OrderUpdateResponse.class);
                
                if (!orderResponse.getStatusCode().is2xxSuccessful()) {
                    log.error("Error actualizando orden: {}", orderRequest.getOrderId());
                    
                    // ANTI-PATRÓN: Rollback manual del usuario
                    String userRollbackUrl = "http://user-service/api/users/" + userId + "/rollback";
                    restTemplate.postForEntity(userRollbackUrl, userRequest, String.class);
                    
                    return false;
                }
            }
            
            log.info("Usuario y órdenes actualizados exitosamente: {}", userId);
            return true;
            
        } catch (Exception e) {
            log.error("Error actualizando usuario y órdenes: {}", e.getMessage(), e);
            
            // ANTI-PATRÓN: Rollback manual complejo
            try {
                performRollback(userId, userRequest);
            } catch (Exception rollbackError) {
                log.error("Error en rollback: {}", rollbackError.getMessage(), rollbackError);
            }
            
            return false;
        }
    }
    
    // ANTI-PATRÓN: Rollback manual complejo
    private void performRollback(String userId, UserUpdateRequest userRequest) {
        log.info("Realizando rollback para usuario: {}", userId);
        
        try {
            // Rollback del usuario
            String userRollbackUrl = "http://user-service/api/users/" + userId + "/rollback";
            restTemplate.postForEntity(userRollbackUrl, userRequest, String.class);
            
            // Rollback de órdenes (si se actualizaron)
            // Rollback de otros servicios relacionados
            
        } catch (Exception e) {
            log.error("Error en rollback: {}", e.getMessage(), e);
        }
    }
}
```

#### 5.2. Solución: Saga Pattern para Consistencia

```java
// PATRÓN CORRECTO: Saga Pattern para consistencia eventual
@Service
@Slf4j
public class SagaPatternService {
    
    @Autowired
    private EventPublisher eventPublisher;
    
    @Autowired
    private SagaRepository sagaRepository;
    
    // PATRÓN CORRECTO: Iniciar saga para actualización distribuida
    public String startUserUpdateSaga(String userId, UserUpdateRequest userRequest, List<OrderUpdateRequest> orderRequests) {
        log.info("Iniciando saga para actualización de usuario: {}", userId);
        
        try {
            // Crear saga
            String sagaId = UUID.randomUUID().toString();
            Saga saga = new Saga();
            saga.setSagaId(sagaId);
            saga.setUserId(userId);
            saga.setStatus(SagaStatus.STARTED);
            saga.setCreatedAt(Instant.now());
            saga.setSteps(createSagaSteps(userId, userRequest, orderRequests));
            
            sagaRepository.save(saga);
            
            // Publicar evento de inicio de saga
            SagaStartedEvent sagaStartedEvent = new SagaStartedEvent(sagaId, userId, Instant.now());
            eventPublisher.publishEvent("saga.started", sagaStartedEvent);
            
            log.info("Saga iniciada: {}", sagaId);
            return sagaId;
            
        } catch (Exception e) {
            log.error("Error iniciando saga: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para primer paso de la saga
    @EventListener
    public void handleUserUpdateStep(SagaStartedEvent event) {
        log.info("Ejecutando paso de actualización de usuario en saga: {}", event.getSagaId());
        
        try {
            // Actualizar usuario
            UserUpdateResult result = userService.updateUser(event.getUserId());
            
            if (result.isSuccessful()) {
                // Publicar evento de éxito
                UserUpdateCompletedEvent userUpdateCompletedEvent = new UserUpdateCompletedEvent(
                    event.getSagaId(), event.getUserId(), Instant.now());
                eventPublisher.publishEvent("user.update.completed", userUpdateCompletedEvent);
            } else {
                // Publicar evento de fallo
                UserUpdateFailedEvent userUpdateFailedEvent = new UserUpdateFailedEvent(
                    event.getSagaId(), event.getUserId(), result.getError(), Instant.now());
                eventPublisher.publishEvent("user.update.failed", userUpdateFailedEvent);
            }
            
        } catch (Exception e) {
            log.error("Error en paso de actualización de usuario: {}", e.getMessage(), e);
            
            UserUpdateFailedEvent userUpdateFailedEvent = new UserUpdateFailedEvent(
                event.getSagaId(), event.getUserId(), "Error interno", Instant.now());
            eventPublisher.publishEvent("user.update.failed", userUpdateFailedEvent);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para segundo paso de la saga
    @EventListener
    public void handleOrderUpdateStep(UserUpdateCompletedEvent event) {
        log.info("Ejecutando paso de actualización de órdenes en saga: {}", event.getSagaId());
        
        try {
            // Obtener saga
            Saga saga = sagaRepository.findBySagaId(event.getSagaId());
            if (saga == null) {
                log.error("Saga no encontrada: {}", event.getSagaId());
                return;
            }
            
            // Actualizar órdenes
            List<OrderUpdateRequest> orderRequests = saga.getOrderUpdateRequests();
            boolean allOrdersUpdated = true;
            String errorMessage = null;
            
            for (OrderUpdateRequest orderRequest : orderRequests) {
                try {
                    OrderUpdateResult result = orderService.updateOrder(orderRequest);
                    if (!result.isSuccessful()) {
                        allOrdersUpdated = false;
                        errorMessage = result.getError();
                        break;
                    }
                } catch (Exception e) {
                    allOrdersUpdated = false;
                    errorMessage = e.getMessage();
                    break;
                }
            }
            
            if (allOrdersUpdated) {
                // Publicar evento de éxito
                OrderUpdateCompletedEvent orderUpdateCompletedEvent = new OrderUpdateCompletedEvent(
                    event.getSagaId(), event.getUserId(), Instant.now());
                eventPublisher.publishEvent("order.update.completed", orderUpdateCompletedEvent);
            } else {
                // Publicar evento de fallo
                OrderUpdateFailedEvent orderUpdateFailedEvent = new OrderUpdateFailedEvent(
                    event.getSagaId(), event.getUserId(), errorMessage, Instant.now());
                eventPublisher.publishEvent("order.update.failed", orderUpdateFailedEvent);
            }
            
        } catch (Exception e) {
            log.error("Error en paso de actualización de órdenes: {}", e.getMessage(), e);
            
            OrderUpdateFailedEvent orderUpdateFailedEvent = new OrderUpdateFailedEvent(
                event.getSagaId(), event.getUserId(), "Error interno", Instant.now());
            eventPublisher.publishEvent("order.update.failed", orderUpdateFailedEvent);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para finalización de saga
    @EventListener
    public void handleSagaCompletion(OrderUpdateCompletedEvent event) {
        log.info("Finalizando saga exitosamente: {}", event.getSagaId());
        
        try {
            // Actualizar estado de la saga
            Saga saga = sagaRepository.findBySagaId(event.getSagaId());
            if (saga != null) {
                saga.setStatus(SagaStatus.COMPLETED);
                saga.setCompletedAt(Instant.now());
                sagaRepository.save(saga);
            }
            
            // Publicar evento de saga completada
            SagaCompletedEvent sagaCompletedEvent = new SagaCompletedEvent(
                event.getSagaId(), event.getUserId(), Instant.now());
            eventPublisher.publishEvent("saga.completed", sagaCompletedEvent);
            
            log.info("Saga completada exitosamente: {}", event.getSagaId());
            
        } catch (Exception e) {
            log.error("Error finalizando saga: {}", e.getMessage(), e);
        }
    }
    
    // PATRÓN CORRECTO: Manejador de eventos para compensación
    @EventListener
    public void handleSagaCompensation(OrderUpdateFailedEvent event) {
        log.info("Iniciando compensación de saga: {}", event.getSagaId());
        
        try {
            // Compensar actualización de usuario
            UserCompensationResult compensationResult = userService.compensateUserUpdate(event.getUserId());
            
            if (compensationResult.isSuccessful()) {
                // Actualizar estado de la saga
                Saga saga = sagaRepository.findBySagaId(event.getSagaId());
                if (saga != null) {
                    saga.setStatus(SagaStatus.COMPENSATED);
                    saga.setCompensatedAt(Instant.now());
                    saga.setCompensationReason(event.getError());
                    sagaRepository.save(saga);
                }
                
                // Publicar evento de compensación completada
                SagaCompensatedEvent sagaCompensatedEvent = new SagaCompensatedEvent(
                    event.getSagaId(), event.getUserId(), event.getError(), Instant.now());
                eventPublisher.publishEvent("saga.compensated", sagaCompensatedEvent);
                
                log.info("Saga compensada exitosamente: {}", event.getSagaId());
            } else {
                log.error("Error en compensación de saga: {}", event.getSagaId());
            }
            
        } catch (Exception e) {
            log.error("Error compensando saga: {}", e.getMessage(), e);
        }
    }
    
    // Método auxiliar para crear pasos de la saga
    private List<SagaStep> createSagaSteps(String userId, UserUpdateRequest userRequest, List<OrderUpdateRequest> orderRequests) {
        List<SagaStep> steps = new ArrayList<>();
        
        // Paso 1: Actualizar usuario
        SagaStep userStep = new SagaStep();
        userStep.setStepId("user-update");
        userStep.setOrder(1);
        userStep.setStatus(StepStatus.PENDING);
        steps.add(userStep);
        
        // Paso 2: Actualizar órdenes
        SagaStep orderStep = new SagaStep();
        orderStep.setStepId("order-update");
        orderStep.setOrder(2);
        orderStep.setStatus(StepStatus.PENDING);
        steps.add(orderStep);
        
        return steps;
    }
}
```

---

### 6. Pruebas Unitarias para Common Pitfalls

```java
// Pruebas unitarias para trampas comunes
@SpringBootTest
public class CommonPitfallsTest {
    
    @Autowired
    private ProperUserService properUserService;
    
    @Autowired
    private AsynchronousCommunicationService asyncService;
    
    @Autowired
    private SagaPatternService sagaService;
    
    @MockBean
    private UserRepository userRepository;
    
    @MockBean
    private EventPublisher eventPublisher;
    
    @Test
    public void testProperUserService() {
        // Arrange: Configurar mocks
        User user = new User("user123", "test@email.com", "Test User");
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));
        
        // Act: Validar usuario
        UserValidationResult result = properUserService.validateUser("user123");
        
        // Assert: Verificar resultado
        assertTrue(result.isValid());
        assertNull(result.getError());
    }
    
    @Test
    public void testAsynchronousCommunication() {
        // Arrange: Configurar mocks
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setOrderId("order123");
        orderRequest.setUserId("user123");
        
        // Act: Procesar orden de forma asíncrona
        OrderResult result = asyncService.processOrderAsynchronously(orderRequest);
        
        // Assert: Verificar resultado
        assertTrue(result.isSuccess());
        assertEquals("Orden creada, procesamiento en progreso", result.getMessage());
        
        // Verificar que se publicó evento
        verify(eventPublisher, times(1)).publishEvent(eq("order.created"), any(OrderCreatedEvent.class));
    }
    
    @Test
    public void testSagaPattern() {
        // Arrange: Configurar mocks
        UserUpdateRequest userRequest = new UserUpdateRequest();
        List<OrderUpdateRequest> orderRequests = Arrays.asList(new OrderUpdateRequest());
        
        // Act: Iniciar saga
        String sagaId = sagaService.startUserUpdateSaga("user123", userRequest, orderRequests);
        
        // Assert: Verificar saga iniciada
        assertNotNull(sagaId);
        verify(eventPublisher, times(1)).publishEvent(eq("saga.started"), any(SagaStartedEvent.class));
    }
}
```

---

### 7. Mejoras y Patrones de Diseño

- **Event Sourcing**: Mantener historial completo de eventos
- **CQRS**: Separar comandos y consultas
- **Saga Pattern**: Manejar transacciones distribuidas
- **Circuit Breaker**: Manejar fallos en servicios
- **Bulkhead Pattern**: Aislar fallos entre servicios

---

### 8. Resultados Esperados y Manejo de Errores

#### 8.1. Escenarios exitosos

- **Servicios desacoplados**:
    - Responsabilidades bien definidas
    - Comunicación asíncrona
    - Consistencia eventual

#### 8.2. Escenarios de error

- **Fallos en servicios**:
    - Circuit breakers activados
    - Compensación automática
    - Rollback de transacciones

---

### 9. Explicación Detallada de la Lógica

- **Distributed Monolith**: Evitar servicios demasiado acoplados
- **Database per Service**: Cada servicio con su propia base de datos
- **Service Communication**: Usar comunicación asíncrona con eventos
- **Data Consistency**: Implementar consistencia eventual con Saga Pattern
- **Anti-patterns**: Identificar y evitar trampas comunes

---

¿Deseas que continúe con la siguiente sección del capítulo 7 (por ejemplo, "Migration Strategies" o "Future Trends")? 