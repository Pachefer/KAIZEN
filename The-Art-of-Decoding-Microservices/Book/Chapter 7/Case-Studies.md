# Capítulo 7: Estudios de Caso, Evitando Trampas y Futuro
## Sección: Case Studies (Netflix, Amazon, Uber)

---

### 1. Introducción y Teoría

Los **estudios de caso** de empresas líderes proporcionan valiosas lecciones sobre la implementación exitosa de microservicios. Analizaremos:

- **Netflix**: Arquitectura de microservicios a escala global
- **Amazon**: Transformación de monolitos a microservicios
- **Uber**: Microservicios para plataforma de movilidad

**Aspectos clave a analizar:**
- **Arquitectura de servicios**: Diseño y organización
- **Patrones de comunicación**: Síncrona vs asíncrona
- **Gestión de datos**: Estrategias de persistencia
- **Escalabilidad**: Manejo de carga y crecimiento
- **Observabilidad**: Monitoreo y debugging

---

### 2. Estudio de Caso: Netflix

#### 2.1. Arquitectura de Netflix

```java
// Ejemplo de arquitectura inspirada en Netflix
@Service
@Slf4j
public class NetflixStyleRecommendationService {
    
    @Autowired
    private UserProfileService userProfileService;
    
    @Autowired
    private ContentCatalogService contentCatalogService;
    
    @Autowired
    private RatingService ratingService;
    
    @Autowired
    private HystrixCommand.Setter hystrixConfig;
    
    // Método para obtener recomendaciones con circuit breaker
    public List<Recommendation> getRecommendations(String userId, String contentType) {
        log.info("Obteniendo recomendaciones para usuario: {} tipo: {}", userId, contentType);
        
        try {
            // Usar Hystrix para manejar fallos
            return new HystrixCommand<List<Recommendation>>(hystrixConfig) {
                @Override
                protected List<Recommendation> run() throws Exception {
                    return obtenerRecomendacionesReales(userId, contentType);
                }
                
                @Override
                protected List<Recommendation> getFallback() {
                    log.warn("Usando fallback para recomendaciones de usuario: {}", userId);
                    return obtenerRecomendacionesFallback(userId, contentType);
                }
            }.execute();
            
        } catch (Exception e) {
            log.error("Error obteniendo recomendaciones: {}", e.getMessage(), e);
            return obtenerRecomendacionesFallback(userId, contentType);
        }
    }
    
    // Método principal para obtener recomendaciones
    private List<Recommendation> obtenerRecomendacionesReales(String userId, String contentType) {
        // 1. OBTENER PERFIL DE USUARIO
        log.debug("Obteniendo perfil de usuario: {}", userId);
        UserProfile userProfile = userProfileService.getUserProfile(userId);
        
        if (userProfile == null) {
            log.warn("Perfil de usuario no encontrado: {}", userId);
            return Collections.emptyList();
        }
        
        // 2. OBTENER CATÁLOGO DE CONTENIDO
        log.debug("Obteniendo catálogo de contenido tipo: {}", contentType);
        List<Content> availableContent = contentCatalogService.getContentByType(contentType);
        
        if (availableContent.isEmpty()) {
            log.warn("No hay contenido disponible para tipo: {}", contentType);
            return Collections.emptyList();
        }
        
        // 3. OBTENER RATINGS Y PREFERENCIAS
        log.debug("Obteniendo ratings y preferencias para usuario: {}", userId);
        List<Rating> userRatings = ratingService.getUserRatings(userId);
        Map<String, Double> userPreferences = calcularPreferenciasUsuario(userProfile, userRatings);
        
        // 4. CALCULAR RECOMENDACIONES
        log.debug("Calculando recomendaciones personalizadas");
        List<Recommendation> recommendations = calcularRecomendaciones(
            availableContent, userPreferences, userProfile);
        
        // 5. APLICAR FILTROS Y RANKING
        log.debug("Aplicando filtros y ranking final");
        recommendations = aplicarFiltros(recommendations, userProfile);
        recommendations = aplicarRanking(recommendations, userProfile);
        
        log.info("Recomendaciones calculadas: {} items", recommendations.size());
        return recommendations;
    }
    
    // Método para calcular preferencias del usuario
    private Map<String, Double> calcularPreferenciasUsuario(UserProfile userProfile, List<Rating> userRatings) {
        Map<String, Double> preferences = new HashMap<>();
        
        // Preferencias basadas en género
        for (String genre : userProfile.getFavoriteGenres()) {
            preferences.put("genre:" + genre, 0.8);
        }
        
        // Preferencias basadas en ratings
        for (Rating rating : userRatings) {
            String contentId = rating.getContentId();
            double ratingValue = rating.getRating();
            
            // Obtener género del contenido
            String genre = contentCatalogService.getContentGenre(contentId);
            if (genre != null) {
                double currentPreference = preferences.getOrDefault("genre:" + genre, 0.0);
                preferences.put("genre:" + genre, currentPreference + (ratingValue * 0.1));
            }
        }
        
        // Preferencias basadas en historial de visualización
        for (String watchedContent : userProfile.getWatchedContent()) {
            String genre = contentCatalogService.getContentGenre(watchedContent);
            if (genre != null) {
                double currentPreference = preferences.getOrDefault("genre:" + genre, 0.0);
                preferences.put("genre:" + genre, currentPreference + 0.05);
            }
        }
        
        log.debug("Preferencias calculadas: {}", preferences);
        return preferences;
    }
    
    // Método para calcular recomendaciones
    private List<Recommendation> calcularRecomendaciones(List<Content> availableContent, 
                                                        Map<String, Double> userPreferences, 
                                                        UserProfile userProfile) {
        List<Recommendation> recommendations = new ArrayList<>();
        
        for (Content content : availableContent) {
            double score = 0.0;
            
            // Score basado en género
            String contentGenre = content.getGenre();
            double genrePreference = userPreferences.getOrDefault("genre:" + contentGenre, 0.0);
            score += genrePreference * 0.4;
            
            // Score basado en popularidad
            double popularityScore = content.getPopularityScore();
            score += popularityScore * 0.2;
            
            // Score basado en rating promedio
            double averageRating = content.getAverageRating();
            score += averageRating * 0.2;
            
            // Score basado en novedad
            double noveltyScore = calcularNovedad(content, userProfile);
            score += noveltyScore * 0.1;
            
            // Score basado en diversidad
            double diversityScore = calcularDiversidad(content, recommendations);
            score += diversityScore * 0.1;
            
            // Crear recomendación
            Recommendation recommendation = new Recommendation();
            recommendation.setContentId(content.getId());
            recommendation.setContentTitle(content.getTitle());
            recommendation.setScore(score);
            recommendation.setReason("Basado en tus preferencias de " + contentGenre);
            
            recommendations.add(recommendation);
        }
        
        // Ordenar por score
        recommendations.sort((r1, r2) -> Double.compare(r2.getScore(), r1.getScore()));
        
        log.debug("Recomendaciones calculadas con scores: {}", 
            recommendations.stream().map(r -> r.getContentTitle() + ":" + r.getScore()).collect(Collectors.toList()));
        
        return recommendations;
    }
    
    // Método para aplicar filtros
    private List<Recommendation> aplicarFiltros(List<Recommendation> recommendations, UserProfile userProfile) {
        return recommendations.stream()
            .filter(recommendation -> {
                // Filtrar contenido ya visto
                if (userProfile.getWatchedContent().contains(recommendation.getContentId())) {
                    return false;
                }
                
                // Filtrar contenido no disponible en la región
                if (!contentCatalogService.isContentAvailableInRegion(
                    recommendation.getContentId(), userProfile.getRegion())) {
                    return false;
                }
                
                // Filtrar contenido con restricciones de edad
                if (contentCatalogService.hasAgeRestriction(recommendation.getContentId()) &&
                    userProfile.getAge() < contentCatalogService.getAgeRestriction(recommendation.getContentId())) {
                    return false;
                }
                
                return true;
            })
            .collect(Collectors.toList());
    }
    
    // Método para aplicar ranking final
    private List<Recommendation> aplicarRanking(List<Recommendation> recommendations, UserProfile userProfile) {
        // Aplicar boost para contenido en tendencia
        recommendations.forEach(recommendation -> {
            if (contentCatalogService.isTrending(recommendation.getContentId())) {
                recommendation.setScore(recommendation.getScore() * 1.2);
            }
        });
        
        // Aplicar boost para contenido de la misma serie
        recommendations.forEach(recommendation -> {
            if (userProfile.getWatchedContent().stream()
                .anyMatch(watched -> contentCatalogService.isSameSeries(watched, recommendation.getContentId()))) {
                recommendation.setScore(recommendation.getScore() * 1.3);
            }
        });
        
        // Re-ordenar por score final
        recommendations.sort((r1, r2) -> Double.compare(r2.getScore(), r1.getScore()));
        
        // Limitar a top 20 recomendaciones
        return recommendations.stream().limit(20).collect(Collectors.toList());
    }
    
    // Método fallback para recomendaciones
    private List<Recommendation> obtenerRecomendacionesFallback(String userId, String contentType) {
        log.info("Usando recomendaciones fallback para usuario: {}", userId);
        
        // Obtener contenido popular del tipo solicitado
        List<Content> popularContent = contentCatalogService.getPopularContentByType(contentType, 10);
        
        return popularContent.stream()
            .map(content -> {
                Recommendation recommendation = new Recommendation();
                recommendation.setContentId(content.getId());
                recommendation.setContentTitle(content.getTitle());
                recommendation.setScore(content.getPopularityScore());
                recommendation.setReason("Contenido popular en " + contentType);
                return recommendation;
            })
            .collect(Collectors.toList());
    }
    
    // Métodos auxiliares
    private double calcularNovedad(Content content, UserProfile userProfile) {
        // Implementación para calcular novedad del contenido
        return 0.5; // Valor por defecto
    }
    
    private double calcularDiversidad(Content content, List<Recommendation> currentRecommendations) {
        // Implementación para calcular diversidad
        return 0.5; // Valor por defecto
    }
}
```

#### 2.2. Patrones de Netflix: Circuit Breaker

```java
// Implementación de Circuit Breaker inspirada en Netflix Hystrix
@Component
@Slf4j
public class NetflixStyleCircuitBreaker {
    
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicInteger successCount = new AtomicInteger(0);
    private final AtomicReference<CircuitState> state = new AtomicReference<>(CircuitState.CLOSED);
    private final AtomicLong lastFailureTime = new AtomicLong(0);
    
    private final int failureThreshold;
    private final int successThreshold;
    private final long timeoutDuration;
    
    public NetflixStyleCircuitBreaker() {
        this.failureThreshold = 5;
        this.successThreshold = 3;
        this.timeoutDuration = 60000; // 1 minuto
    }
    
    // Método para ejecutar con circuit breaker
    public <T> T execute(Supplier<T> command, Supplier<T> fallback) {
        if (canExecute()) {
            try {
                T result = command.get();
                onSuccess();
                return result;
            } catch (Exception e) {
                onFailure();
                log.warn("Comando falló, usando fallback: {}", e.getMessage());
                return fallback.get();
            }
        } else {
            log.warn("Circuit breaker abierto, usando fallback");
            return fallback.get();
        }
    }
    
    // Método para verificar si se puede ejecutar
    private boolean canExecute() {
        CircuitState currentState = state.get();
        
        switch (currentState) {
            case CLOSED:
                return true;
            case OPEN:
                // Verificar si ha pasado el tiempo de timeout
                long now = System.currentTimeMillis();
                long lastFailure = lastFailureTime.get();
                
                if (now - lastFailure >= timeoutDuration) {
                    log.info("Circuit breaker cambiando a HALF_OPEN");
                    state.set(CircuitState.HALF_OPEN);
                    return true;
                }
                return false;
            case HALF_OPEN:
                return true;
            default:
                return false;
        }
    }
    
    // Método para manejar éxito
    private void onSuccess() {
        successCount.incrementAndGet();
        failureCount.set(0);
        
        if (state.get() == CircuitState.HALF_OPEN && successCount.get() >= successThreshold) {
            log.info("Circuit breaker cambiando a CLOSED");
            state.set(CircuitState.CLOSED);
            successCount.set(0);
        }
    }
    
    // Método para manejar fallo
    private void onFailure() {
        failureCount.incrementAndGet();
        lastFailureTime.set(System.currentTimeMillis());
        
        if (failureCount.get() >= failureThreshold) {
            log.warn("Circuit breaker cambiando a OPEN");
            state.set(CircuitState.OPEN);
        }
    }
    
    // Método para obtener estado del circuit breaker
    public CircuitState getState() {
        return state.get();
    }
    
    // Método para obtener métricas
    public CircuitBreakerMetrics getMetrics() {
        return new CircuitBreakerMetrics(
            state.get(),
            failureCount.get(),
            successCount.get(),
            lastFailureTime.get()
        );
    }
    
    // Enums y clases de soporte
    public enum CircuitState {
        CLOSED, OPEN, HALF_OPEN
    }
    
    public static class CircuitBreakerMetrics {
        private final CircuitState state;
        private final int failureCount;
        private final int successCount;
        private final long lastFailureTime;
        
        public CircuitBreakerMetrics(CircuitState state, int failureCount, int successCount, long lastFailureTime) {
            this.state = state;
            this.failureCount = failureCount;
            this.successCount = successCount;
            this.lastFailureTime = lastFailureTime;
        }
        
        // Getters
        public CircuitState getState() { return state; }
        public int getFailureCount() { return failureCount; }
        public int getSuccessCount() { return successCount; }
        public long getLastFailureTime() { return lastFailureTime; }
    }
}
```

---

### 3. Estudio de Caso: Amazon

#### 3.1. Arquitectura de Amazon

```java
// Ejemplo de arquitectura inspirada en Amazon
@Service
@Slf4j
public class AmazonStyleOrderService {
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private ShippingService shippingService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    // Método para procesar orden con arquitectura de eventos
    @Transactional
    public OrderResult processOrder(OrderRequest orderRequest) {
        log.info("Procesando orden: {}", orderRequest.getOrderId());
        
        try {
            // 1. VALIDAR INVENTARIO
            log.debug("Validando inventario para orden: {}", orderRequest.getOrderId());
            InventoryValidationResult inventoryResult = inventoryService.validateInventory(orderRequest.getItems());
            
            if (!inventoryResult.isAvailable()) {
                log.warn("Inventario insuficiente para orden: {}", orderRequest.getOrderId());
                return new OrderResult(false, "Inventario insuficiente", null);
            }
            
            // 2. RESERVAR INVENTARIO
            log.debug("Reservando inventario para orden: {}", orderRequest.getOrderId());
            boolean inventoryReserved = inventoryService.reserveInventory(orderRequest.getOrderId(), orderRequest.getItems());
            
            if (!inventoryReserved) {
                log.error("Error reservando inventario para orden: {}", orderRequest.getOrderId());
                return new OrderResult(false, "Error reservando inventario", null);
            }
            
            // 3. PROCESAR PAGO
            log.debug("Procesando pago para orden: {}", orderRequest.getOrderId());
            PaymentResult paymentResult = paymentService.processPayment(orderRequest.getPaymentInfo(), orderRequest.getTotalAmount());
            
            if (!paymentResult.isSuccessful()) {
                log.error("Error procesando pago para orden: {}", orderRequest.getOrderId());
                // Liberar inventario reservado
                inventoryService.releaseInventory(orderRequest.getOrderId());
                return new OrderResult(false, "Error procesando pago: " + paymentResult.getErrorMessage(), null);
            }
            
            // 4. CREAR ORDEN
            log.debug("Creando orden: {}", orderRequest.getOrderId());
            Order order = crearOrden(orderRequest, paymentResult.getTransactionId());
            
            // 5. PUBLICAR EVENTO DE ORDEN CREADA
            log.debug("Publicando evento de orden creada: {}", orderRequest.getOrderId());
            OrderCreatedEvent orderCreatedEvent = new OrderCreatedEvent(
                order.getOrderId(),
                order.getCustomerId(),
                order.getItems(),
                order.getTotalAmount(),
                Instant.now()
            );
            eventPublisher.publishEvent("order.created", orderCreatedEvent);
            
            // 6. INICIAR PROCESO DE ENVÍO ASÍNCRONO
            log.debug("Iniciando proceso de envío asíncrono para orden: {}", orderRequest.getOrderId());
            iniciarProcesoEnvio(order);
            
            // 7. ENVIAR NOTIFICACIÓN AL CLIENTE
            log.debug("Enviando notificación al cliente para orden: {}", orderRequest.getOrderId());
            notificationService.sendOrderConfirmation(order.getCustomerId(), order.getOrderId());
            
            log.info("Orden procesada exitosamente: {}", orderRequest.getOrderId());
            
            return new OrderResult(true, "Orden procesada exitosamente", order);
            
        } catch (Exception e) {
            log.error("Error procesando orden: {}", e.getMessage(), e);
            
            // Intentar liberar inventario en caso de error
            try {
                inventoryService.releaseInventory(orderRequest.getOrderId());
            } catch (Exception releaseError) {
                log.error("Error liberando inventario: {}", releaseError.getMessage(), releaseError);
            }
            
            return new OrderResult(false, "Error interno: " + e.getMessage(), null);
        }
    }
    
    // Método para crear orden
    private Order crearOrden(OrderRequest orderRequest, String transactionId) {
        Order order = new Order();
        order.setOrderId(orderRequest.getOrderId());
        order.setCustomerId(orderRequest.getCustomerId());
        order.setItems(orderRequest.getItems());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setStatus(OrderStatus.CONFIRMED);
        order.setTransactionId(transactionId);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        
        // Calcular fecha estimada de entrega
        order.setEstimatedDeliveryDate(calcularFechaEntrega(orderRequest.getShippingAddress()));
        
        // Guardar orden en base de datos
        orderRepository.save(order);
        
        log.debug("Orden creada: {}", order.getOrderId());
        return order;
    }
    
    // Método para iniciar proceso de envío asíncrono
    @Async
    public void iniciarProcesoEnvio(Order order) {
        try {
            log.info("Iniciando proceso de envío para orden: {}", order.getOrderId());
            
            // 1. PREPARAR ENVÍO
            ShippingPreparationResult preparationResult = shippingService.prepareShipping(order);
            
            if (!preparationResult.isSuccessful()) {
                log.error("Error preparando envío para orden: {}", order.getOrderId());
                // Publicar evento de error
                eventPublisher.publishEvent("shipping.failed", new ShippingFailedEvent(order.getOrderId()));
                return;
            }
            
            // 2. PUBLICAR EVENTO DE ENVÍO PREPARADO
            eventPublisher.publishEvent("shipping.prepared", new ShippingPreparedEvent(
                order.getOrderId(), preparationResult.getTrackingNumber()));
            
            // 3. ACTUALIZAR ESTADO DE LA ORDEN
            order.setStatus(OrderStatus.SHIPPED);
            order.setTrackingNumber(preparationResult.getTrackingNumber());
            order.setUpdatedAt(Instant.now());
            orderRepository.save(order);
            
            // 4. ENVIAR NOTIFICACIÓN DE ENVÍO
            notificationService.sendShippingNotification(order.getCustomerId(), order.getOrderId(), 
                preparationResult.getTrackingNumber());
            
            log.info("Proceso de envío completado para orden: {}", order.getOrderId());
            
        } catch (Exception e) {
            log.error("Error en proceso de envío para orden: {}", order.getOrderId(), e);
            eventPublisher.publishEvent("shipping.failed", new ShippingFailedEvent(order.getOrderId()));
        }
    }
    
    // Método para calcular fecha de entrega
    private Instant calcularFechaEntrega(Address shippingAddress) {
        // Lógica para calcular fecha estimada de entrega
        // Basada en ubicación, método de envío, etc.
        return Instant.now().plus(Duration.ofDays(3));
    }
    
    // Método para manejar eventos de cancelación
    @EventListener
    public void handleOrderCancellation(OrderCancelledEvent event) {
        log.info("Manejando cancelación de orden: {}", event.getOrderId());
        
        try {
            // Liberar inventario
            inventoryService.releaseInventory(event.getOrderId());
            
            // Procesar reembolso si es necesario
            if (event.isRefundRequired()) {
                paymentService.processRefund(event.getOrderId(), event.getRefundAmount());
            }
            
            // Actualizar estado de la orden
            Order order = orderRepository.findByOrderId(event.getOrderId());
            if (order != null) {
                order.setStatus(OrderStatus.CANCELLED);
                order.setUpdatedAt(Instant.now());
                orderRepository.save(order);
            }
            
            // Enviar notificación de cancelación
            notificationService.sendCancellationNotification(order.getCustomerId(), order.getOrderId());
            
            log.info("Cancelación de orden procesada: {}", event.getOrderId());
            
        } catch (Exception e) {
            log.error("Error procesando cancelación de orden: {}", event.getOrderId(), e);
        }
    }
}
```

#### 3.2. Patrones de Amazon: Event Sourcing

```java
// Implementación de Event Sourcing inspirada en Amazon
@Component
@Slf4j
public class AmazonStyleEventStore {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    // Método para guardar evento
    public void saveEvent(String aggregateId, String eventType, Object eventData) {
        try {
            log.debug("Guardando evento: {} para aggregate: {}", eventType, aggregateId);
            
            // Crear evento
            Event event = new Event();
            event.setId(UUID.randomUUID().toString());
            event.setAggregateId(aggregateId);
            event.setEventType(eventType);
            event.setEventData(serializeEventData(eventData));
            event.setTimestamp(Instant.now());
            event.setVersion(getNextVersion(aggregateId));
            
            // Guardar en base de datos
            eventRepository.save(event);
            
            // Publicar evento
            eventPublisher.publishEvent(eventType, event);
            
            log.debug("Evento guardado exitosamente: {}", event.getId());
            
        } catch (Exception e) {
            log.error("Error guardando evento: {}", e.getMessage(), e);
            throw new EventStoreException("Error guardando evento", e);
        }
    }
    
    // Método para obtener eventos de un aggregate
    public List<Event> getEvents(String aggregateId) {
        try {
            log.debug("Obteniendo eventos para aggregate: {}", aggregateId);
            
            List<Event> events = eventRepository.findByAggregateIdOrderByVersionAsc(aggregateId);
            
            log.debug("Encontrados {} eventos para aggregate: {}", events.size(), aggregateId);
            return events;
            
        } catch (Exception e) {
            log.error("Error obteniendo eventos: {}", e.getMessage(), e);
            throw new EventStoreException("Error obteniendo eventos", e);
        }
    }
    
    // Método para reconstruir aggregate desde eventos
    public <T> T reconstructAggregate(String aggregateId, Class<T> aggregateClass) {
        try {
            log.debug("Reconstruyendo aggregate: {} de tipo: {}", aggregateId, aggregateClass.getSimpleName());
            
            List<Event> events = getEvents(aggregateId);
            
            if (events.isEmpty()) {
                log.warn("No se encontraron eventos para aggregate: {}", aggregateId);
                return null;
            }
            
            // Crear instancia del aggregate
            T aggregate = aggregateClass.getDeclaredConstructor().newInstance();
            
            // Aplicar eventos en orden
            for (Event event : events) {
                applyEvent(aggregate, event);
            }
            
            log.debug("Aggregate reconstruido exitosamente: {}", aggregateId);
            return aggregate;
            
        } catch (Exception e) {
            log.error("Error reconstruyendo aggregate: {}", e.getMessage(), e);
            throw new EventStoreException("Error reconstruyendo aggregate", e);
        }
    }
    
    // Método para aplicar evento a aggregate
    private <T> void applyEvent(T aggregate, Event event) {
        try {
            log.debug("Aplicando evento: {} a aggregate: {}", event.getEventType(), event.getAggregateId());
            
            // Buscar método para manejar el evento
            Method eventHandler = findEventHandler(aggregate.getClass(), event.getEventType());
            
            if (eventHandler != null) {
                // Deserializar datos del evento
                Object eventData = deserializeEventData(event.getEventData(), eventHandler.getParameterTypes()[0]);
                
                // Invocar método del aggregate
                eventHandler.invoke(aggregate, eventData);
                
                log.debug("Evento aplicado exitosamente");
            } else {
                log.warn("No se encontró handler para evento: {}", event.getEventType());
            }
            
        } catch (Exception e) {
            log.error("Error aplicando evento: {}", e.getMessage(), e);
            throw new EventStoreException("Error aplicando evento", e);
        }
    }
    
    // Método para obtener siguiente versión
    private long getNextVersion(String aggregateId) {
        Event lastEvent = eventRepository.findTopByAggregateIdOrderByVersionDesc(aggregateId);
        return lastEvent != null ? lastEvent.getVersion() + 1 : 1;
    }
    
    // Método para serializar datos del evento
    private String serializeEventData(Object eventData) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(eventData);
        } catch (Exception e) {
            log.error("Error serializando datos del evento: {}", e.getMessage(), e);
            throw new EventStoreException("Error serializando datos del evento", e);
        }
    }
    
    // Método para deserializar datos del evento
    private Object deserializeEventData(String eventData, Class<?> targetClass) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(eventData, targetClass);
        } catch (Exception e) {
            log.error("Error deserializando datos del evento: {}", e.getMessage(), e);
            throw new EventStoreException("Error deserializando datos del evento", e);
        }
    }
    
    // Método para encontrar handler de evento
    private Method findEventHandler(Class<?> aggregateClass, String eventType) {
        for (Method method : aggregateClass.getMethods()) {
            if (method.getName().equals("handle" + eventType) && method.getParameterCount() == 1) {
                return method;
            }
        }
        return null;
    }
}
```

---

### 4. Estudio de Caso: Uber

#### 4.1. Arquitectura de Uber

```java
// Ejemplo de arquitectura inspirada en Uber
@Service
@Slf4j
public class UberStyleRideService {
    
    @Autowired
    private DriverService driverService;
    
    @Autowired
    private LocationService locationService;
    
    @Autowired
    private PricingService pricingService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    // Método para solicitar viaje
    public RideRequestResult requestRide(RideRequest rideRequest) {
        log.info("Solicitando viaje: {}", rideRequest.getRequestId());
        
        try {
            // 1. VALIDAR SOLICITUD
            log.debug("Validando solicitud de viaje: {}", rideRequest.getRequestId());
            ValidationResult validationResult = validarSolicitud(rideRequest);
            
            if (!validationResult.isValid()) {
                log.warn("Solicitud inválida: {} - {}", rideRequest.getRequestId(), validationResult.getErrorMessage());
                return new RideRequestResult(false, validationResult.getErrorMessage(), null);
            }
            
            // 2. CALCULAR PRECIO
            log.debug("Calculando precio para viaje: {}", rideRequest.getRequestId());
            PricingResult pricingResult = pricingService.calculatePrice(
                rideRequest.getPickupLocation(), 
                rideRequest.getDropoffLocation(),
                rideRequest.getRideType()
            );
            
            // 3. BUSCAR CONDUCTORES CERCANOS
            log.debug("Buscando conductores cercanos para viaje: {}", rideRequest.getRequestId());
            List<Driver> nearbyDrivers = driverService.findNearbyDrivers(
                rideRequest.getPickupLocation(), 
                pricingResult.getEstimatedDuration()
            );
            
            if (nearbyDrivers.isEmpty()) {
                log.warn("No hay conductores disponibles para viaje: {}", rideRequest.getRequestId());
                return new RideRequestResult(false, "No hay conductores disponibles", null);
            }
            
            // 4. ASIGNAR CONDUCTOR
            log.debug("Asignando conductor para viaje: {}", rideRequest.getRequestId());
            Driver assignedDriver = asignarConductor(nearbyDrivers, rideRequest);
            
            if (assignedDriver == null) {
                log.warn("No se pudo asignar conductor para viaje: {}", rideRequest.getRequestId());
                return new RideRequestResult(false, "No se pudo asignar conductor", null);
            }
            
            // 5. CREAR VIAJE
            log.debug("Creando viaje: {}", rideRequest.getRequestId());
            Ride ride = crearViaje(rideRequest, assignedDriver, pricingResult);
            
            // 6. PUBLICAR EVENTO DE VIAJE CREADO
            log.debug("Publicando evento de viaje creado: {}", rideRequest.getRequestId());
            RideCreatedEvent rideCreatedEvent = new RideCreatedEvent(
                ride.getRideId(),
                ride.getRiderId(),
                ride.getDriverId(),
                ride.getPickupLocation(),
                ride.getDropoffLocation(),
                ride.getEstimatedPrice(),
                Instant.now()
            );
            eventPublisher.publishEvent("ride.created", rideCreatedEvent);
            
            // 7. NOTIFICAR AL CONDUCTOR
            log.debug("Notificando al conductor: {}", assignedDriver.getDriverId());
            notificationService.notifyDriver(assignedDriver.getDriverId(), ride);
            
            // 8. NOTIFICAR AL PASAJERO
            log.debug("Notificando al pasajero: {}", rideRequest.getRiderId());
            notificationService.notifyRider(rideRequest.getRiderId(), ride);
            
            log.info("Viaje solicitado exitosamente: {} - Conductor: {}", 
                rideRequest.getRequestId(), assignedDriver.getDriverId());
            
            return new RideRequestResult(true, "Viaje solicitado exitosamente", ride);
            
        } catch (Exception e) {
            log.error("Error solicitando viaje: {}", e.getMessage(), e);
            return new RideRequestResult(false, "Error interno: " + e.getMessage(), null);
        }
    }
    
    // Método para validar solicitud
    private ValidationResult validarSolicitud(RideRequest rideRequest) {
        // Validar ubicaciones
        if (!locationService.isValidLocation(rideRequest.getPickupLocation()) ||
            !locationService.isValidLocation(rideRequest.getDropoffLocation())) {
            return new ValidationResult(false, "Ubicaciones inválidas");
        }
        
        // Validar distancia mínima
        double distance = locationService.calculateDistance(
            rideRequest.getPickupLocation(), 
            rideRequest.getDropoffLocation()
        );
        
        if (distance < 0.1) { // Menos de 100 metros
            return new ValidationResult(false, "Distancia mínima no alcanzada");
        }
        
        // Validar que el pasajero no tenga viajes activos
        if (tieneViajesActivos(rideRequest.getRiderId())) {
            return new ValidationResult(false, "Ya tienes un viaje activo");
        }
        
        return new ValidationResult(true, null);
    }
    
    // Método para asignar conductor
    private Driver asignarConductor(List<Driver> nearbyDrivers, RideRequest rideRequest) {
        log.debug("Asignando conductor entre {} conductores disponibles", nearbyDrivers.size());
        
        // Filtrar conductores disponibles
        List<Driver> availableDrivers = nearbyDrivers.stream()
            .filter(driver -> driver.getStatus() == DriverStatus.AVAILABLE)
            .filter(driver -> driver.getRating() >= 4.0) // Mínimo 4 estrellas
            .collect(Collectors.toList());
        
        if (availableDrivers.isEmpty()) {
            log.warn("No hay conductores disponibles con criterios mínimos");
            return null;
        }
        
        // Ordenar por score de asignación
        availableDrivers.sort((d1, d2) -> Double.compare(calcularScoreAsignacion(d2, rideRequest), 
                                                        calcularScoreAsignacion(d1, rideRequest)));
        
        // Intentar asignar al mejor conductor
        for (Driver driver : availableDrivers) {
            if (driverService.assignRide(driver.getDriverId(), rideRequest.getRequestId())) {
                log.info("Conductor asignado: {} con score: {}", 
                    driver.getDriverId(), calcularScoreAsignacion(driver, rideRequest));
                return driver;
            }
        }
        
        log.warn("No se pudo asignar ningún conductor");
        return null;
    }
    
    // Método para calcular score de asignación
    private double calcularScoreAsignacion(Driver driver, RideRequest rideRequest) {
        double score = 0.0;
        
        // Score basado en distancia
        double distance = locationService.calculateDistance(
            driver.getCurrentLocation(), 
            rideRequest.getPickupLocation()
        );
        score += (1.0 / (1.0 + distance)) * 0.4; // 40% del score
        
        // Score basado en rating
        score += (driver.getRating() / 5.0) * 0.3; // 30% del score
        
        // Score basado en tiempo de respuesta
        double responseTime = driver.getAverageResponseTime();
        score += (1.0 / (1.0 + responseTime)) * 0.2; // 20% del score
        
        // Score basado en historial de cancelaciones
        double cancellationRate = driver.getCancellationRate();
        score += (1.0 - cancellationRate) * 0.1; // 10% del score
        
        return score;
    }
    
    // Método para crear viaje
    private Ride crearViaje(RideRequest rideRequest, Driver driver, PricingResult pricingResult) {
        Ride ride = new Ride();
        ride.setRideId(rideRequest.getRequestId());
        ride.setRiderId(rideRequest.getRiderId());
        ride.setDriverId(driver.getDriverId());
        ride.setPickupLocation(rideRequest.getPickupLocation());
        ride.setDropoffLocation(rideRequest.getDropoffLocation());
        ride.setRideType(rideRequest.getRideType());
        ride.setEstimatedPrice(pricingResult.getEstimatedPrice());
        ride.setEstimatedDuration(pricingResult.getEstimatedDuration());
        ride.setStatus(RideStatus.ASSIGNED);
        ride.setCreatedAt(Instant.now());
        ride.setUpdatedAt(Instant.now());
        
        // Guardar viaje en base de datos
        rideRepository.save(ride);
        
        log.debug("Viaje creado: {}", ride.getRideId());
        return ride;
    }
    
    // Método para manejar eventos de viaje
    @EventListener
    public void handleRideStarted(RideStartedEvent event) {
        log.info("Manejando inicio de viaje: {}", event.getRideId());
        
        try {
            // Actualizar estado del viaje
            Ride ride = rideRepository.findByRideId(event.getRideId());
            if (ride != null) {
                ride.setStatus(RideStatus.IN_PROGRESS);
                ride.setStartedAt(event.getTimestamp());
                ride.setUpdatedAt(Instant.now());
                rideRepository.save(ride);
            }
            
            // Notificar al pasajero
            notificationService.notifyRideStarted(ride.getRiderId(), ride.getRideId());
            
            log.info("Viaje iniciado: {}", event.getRideId());
            
        } catch (Exception e) {
            log.error("Error manejando inicio de viaje: {}", event.getRideId(), e);
        }
    }
    
    @EventListener
    public void handleRideCompleted(RideCompletedEvent event) {
        log.info("Manejando finalización de viaje: {}", event.getRideId());
        
        try {
            // Actualizar estado del viaje
            Ride ride = rideRepository.findByRideId(event.getRideId());
            if (ride != null) {
                ride.setStatus(RideStatus.COMPLETED);
                ride.setCompletedAt(event.getTimestamp());
                ride.setFinalPrice(event.getFinalPrice());
                ride.setUpdatedAt(Instant.now());
                rideRepository.save(ride);
            }
            
            // Procesar pago
            paymentService.processRidePayment(ride.getRideId(), event.getFinalPrice());
            
            // Notificar al pasajero
            notificationService.notifyRideCompleted(ride.getRiderId(), ride.getRideId(), event.getFinalPrice());
            
            log.info("Viaje completado: {}", event.getRideId());
            
        } catch (Exception e) {
            log.error("Error manejando finalización de viaje: {}", event.getRideId(), e);
        }
    }
    
    // Métodos auxiliares
    private boolean tieneViajesActivos(String riderId) {
        // Implementación para verificar viajes activos
        return false; // Valor por defecto
    }
}
```

---

### 5. Pruebas Unitarias para Case Studies

```java
// Pruebas unitarias para estudios de caso
@SpringBootTest
public class CaseStudiesTest {
    
    @Autowired
    private NetflixStyleRecommendationService recommendationService;
    
    @Autowired
    private AmazonStyleOrderService orderService;
    
    @Autowired
    private UberStyleRideService rideService;
    
    @MockBean
    private UserProfileService userProfileService;
    
    @MockBean
    private InventoryService inventoryService;
    
    @MockBean
    private DriverService driverService;
    
    @Test
    public void testNetflixRecommendationService() {
        // Arrange: Configurar mocks
        UserProfile userProfile = new UserProfile();
        userProfile.setFavoriteGenres(Arrays.asList("Action", "Drama"));
        
        when(userProfileService.getUserProfile(anyString())).thenReturn(userProfile);
        
        // Act: Obtener recomendaciones
        List<Recommendation> recommendations = recommendationService.getRecommendations("user123", "movie");
        
        // Assert: Verificar recomendaciones
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
    }
    
    @Test
    public void testAmazonOrderService() {
        // Arrange: Configurar mocks
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setOrderId("order123");
        orderRequest.setCustomerId("customer123");
        
        when(inventoryService.validateInventory(any())).thenReturn(new InventoryValidationResult(true));
        when(inventoryService.reserveInventory(anyString(), any())).thenReturn(true);
        
        // Act: Procesar orden
        OrderResult result = orderService.processOrder(orderRequest);
        
        // Assert: Verificar resultado
        assertNotNull(result);
        // Verificar que se procesó correctamente
    }
    
    @Test
    public void testUberRideService() {
        // Arrange: Configurar mocks
        RideRequest rideRequest = new RideRequest();
        rideRequest.setRequestId("ride123");
        rideRequest.setRiderId("rider123");
        
        List<Driver> nearbyDrivers = Arrays.asList(new Driver("driver123", DriverStatus.AVAILABLE, 4.5));
        when(driverService.findNearbyDrivers(any(), any())).thenReturn(nearbyDrivers);
        when(driverService.assignRide(anyString(), anyString())).thenReturn(true);
        
        // Act: Solicitar viaje
        RideRequestResult result = rideService.requestRide(rideRequest);
        
        // Assert: Verificar resultado
        assertNotNull(result);
        // Verificar que se solicitó correctamente
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Chaos Engineering**: Pruebas de resiliencia en producción
- **Feature Flags**: Activación gradual de funcionalidades
- **A/B Testing**: Testing de variantes en producción
- **Canary Deployments**: Despliegues graduales
- **Circuit Breakers**: Manejo de fallos en servicios

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Recomendaciones personalizadas**:
    - Algoritmos de recomendación funcionando correctamente
    - Fallbacks disponibles en caso de fallos
    - Métricas de precisión monitoreadas

#### 7.2. Escenarios de error

- **Servicios no disponibles**:
    - Circuit breakers activados apropiadamente
    - Fallbacks ejecutados correctamente
    - Recuperación automática cuando sea posible

---

### 8. Explicación Detallada de la Lógica

- **Netflix**: Arquitectura de microservicios con circuit breakers y fallbacks
- **Amazon**: Event sourcing y arquitectura orientada a eventos
- **Uber**: Microservicios para plataforma de movilidad en tiempo real
- **Patrones comunes**: Circuit breakers, event sourcing, CQRS, saga pattern

---

¿Deseas que continúe con la siguiente sección del capítulo 7 (por ejemplo, "Common Pitfalls" o "Migration Strategies")? 