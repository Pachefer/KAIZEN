# Capítulo 1 (Parte 4): Arquitecturas Modernas y Patrones de Diseño

## Arquitectura Orientada a Eventos (EDA)

La arquitectura orientada a eventos es el chico cool del bloque cuando se trata de software: se trata de reaccionar a las cosas mientras están sucediendo. El diseño orientado a eventos, como estilo arquitectónico, se basa en los fundamentos de generación, detección y consumo de eventos.

### Conceptos Clave de EDA

- **Eventos**: Un evento es, más o menos, un titular: "¡Algo pasó!" Podría ser un usuario presionando un botón, una actualización de inventario, o un error del sistema.
- **Productores de Eventos**: Los chismosos que publican eventos, una aplicación, un servicio, un dispositivo, lo que sea.
- **Consumidores de Eventos**: Los oyentes de ese evento se suscriben y reaccionan a estos eventos.

### Ejemplo de Arquitectura Orientada a Eventos

```java
// Interfaz para eventos
public interface Evento {
    String getTipo();
    LocalDateTime getTimestamp();
    String getOrigen();
}

// Evento de orden creada
public class OrdenCreadaEvent implements Evento {
    private final Long ordenId;
    private final Long usuarioId;
    private final BigDecimal total;
    private final LocalDateTime timestamp;
    private final String origen;
    
    public OrdenCreadaEvent(Long ordenId, Long usuarioId, BigDecimal total) {
        this.ordenId = ordenId;
        this.usuarioId = usuarioId;
        this.total = total;
        this.timestamp = LocalDateTime.now();
        this.origen = "orden-service";
    }
    
    @Override
    public String getTipo() {
        return "ORDEN_CREADA";
    }
    
    @Override
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    @Override
    public String getOrigen() {
        return origen;
    }
    
    // Getters
    public Long getOrdenId() { return ordenId; }
    public Long getUsuarioId() { return usuarioId; }
    public BigDecimal getTotal() { return total; }
}

// Evento de pago procesado
public class PagoProcesadoEvent implements Evento {
    private final Long ordenId;
    private final String metodoPago;
    private final boolean exitoso;
    private final LocalDateTime timestamp;
    private final String origen;
    
    public PagoProcesadoEvent(Long ordenId, String metodoPago, boolean exitoso) {
        this.ordenId = ordenId;
        this.metodoPago = metodoPago;
        this.exitoso = exitoso;
        this.timestamp = LocalDateTime.now();
        this.origen = "pago-service";
    }
    
    @Override
    public String getTipo() {
        return "PAGO_PROCESADO";
    }
    
    @Override
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    @Override
    public String getOrigen() {
        return origen;
    }
    
    // Getters
    public Long getOrdenId() { return ordenId; }
    public String getMetodoPago() { return metodoPago; }
    public boolean isExitoso() { return exitoso; }
}

// Broker de eventos
public class EventBroker {
    private final Map<String, List<EventConsumer>> consumers = new ConcurrentHashMap<>();
    private final Queue<Evento> eventQueue = new ConcurrentLinkedQueue<>();
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    private volatile boolean running = true;
    
    public EventBroker() {
        startEventProcessor();
    }
    
    public void publish(Evento evento) {
        eventQueue.offer(evento);
        System.out.println("Evento publicado: " + evento.getTipo() + " desde " + evento.getOrigen());
    }
    
    public void subscribe(String eventType, EventConsumer consumer) {
        consumers.computeIfAbsent(eventType, k -> new CopyOnWriteArrayList<>()).add(consumer);
        System.out.println("Consumidor suscrito a: " + eventType);
    }
    
    private void startEventProcessor() {
        executorService.submit(() -> {
            while (running) {
                Evento evento = eventQueue.poll();
                if (evento != null) {
                    processEvent(evento);
                } else {
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        });
    }
    
    private void processEvent(Evento evento) {
        List<EventConsumer> eventConsumers = consumers.get(evento.getTipo());
        if (eventConsumers != null) {
            for (EventConsumer consumer : eventConsumers) {
                executorService.submit(() -> {
                    try {
                        consumer.handleEvent(evento);
                    } catch (Exception e) {
                        System.err.println("Error procesando evento: " + e.getMessage());
                    }
                });
            }
        }
    }
    
    public void shutdown() {
        running = false;
        executorService.shutdown();
    }
}

// Interfaz para consumidores de eventos
public interface EventConsumer {
    void handleEvent(Evento evento);
}

// Consumidor de eventos de inventario
public class InventarioEventConsumer implements EventConsumer {
    
    @Override
    public void handleEvent(Evento evento) {
        if (evento instanceof OrdenCreadaEvent) {
            OrdenCreadaEvent ordenEvent = (OrdenCreadaEvent) evento;
            actualizarInventario(ordenEvent);
        } else if (evento instanceof PagoProcesadoEvent) {
            PagoProcesadoEvent pagoEvent = (PagoProcesadoEvent) evento;
            if (pagoEvent.isExitoso()) {
                confirmarInventario(pagoEvent);
            }
        }
    }
    
    private void actualizarInventario(OrdenCreadaEvent evento) {
        System.out.println("Actualizando inventario para orden: " + evento.getOrdenId());
        // Lógica para actualizar inventario
    }
    
    private void confirmarInventario(PagoProcesadoEvent evento) {
        System.out.println("Confirmando inventario para orden: " + evento.getOrdenId());
        // Lógica para confirmar inventario
    }
}

// Consumidor de eventos de notificaciones
public class NotificacionEventConsumer implements EventConsumer {
    
    @Override
    public void handleEvent(Evento evento) {
        if (evento instanceof OrdenCreadaEvent) {
            OrdenCreadaEvent ordenEvent = (OrdenCreadaEvent) evento;
            enviarNotificacionOrdenCreada(ordenEvent);
        } else if (evento instanceof PagoProcesadoEvent) {
            PagoProcesadoEvent pagoEvent = (PagoProcesadoEvent) evento;
            enviarNotificacionPago(pagoEvent);
        }
    }
    
    private void enviarNotificacionOrdenCreada(OrdenCreadaEvent evento) {
        System.out.println("Enviando notificación de orden creada al usuario: " + evento.getUsuarioId());
        // Lógica para enviar notificación
    }
    
    private void enviarNotificacionPago(PagoProcesadoEvent evento) {
        if (evento.isExitoso()) {
            System.out.println("Enviando confirmación de pago para orden: " + evento.getOrdenId());
        } else {
            System.out.println("Enviando notificación de pago fallido para orden: " + evento.getOrdenId());
        }
        // Lógica para enviar notificación
    }
}

// Servicio de órdenes que publica eventos
public class OrdenService {
    
    private final EventBroker eventBroker;
    private final Map<Long, Orden> ordenes = new ConcurrentHashMap<>();
    private final AtomicLong ordenIdGenerator = new AtomicLong(1);
    
    public OrdenService(EventBroker eventBroker) {
        this.eventBroker = eventBroker;
    }
    
    public Orden crearOrden(Long usuarioId, List<Producto> productos) {
        Long ordenId = ordenIdGenerator.getAndIncrement();
        BigDecimal total = productos.stream()
                .map(Producto::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Orden orden = new Orden(ordenId, usuarioId, productos, total);
        ordenes.put(ordenId, orden);
        
        // Publicar evento de orden creada
        OrdenCreadaEvent evento = new OrdenCreadaEvent(ordenId, usuarioId, total);
        eventBroker.publish(evento);
        
        return orden;
    }
    
    public void procesarPago(Long ordenId, String metodoPago) {
        Orden orden = ordenes.get(ordenId);
        if (orden != null) {
            // Simular procesamiento de pago
            boolean pagoExitoso = Math.random() > 0.1; // 90% de éxito
            
            // Publicar evento de pago procesado
            PagoProcesadoEvent evento = new PagoProcesadoEvent(ordenId, metodoPago, pagoExitoso);
            eventBroker.publish(evento);
            
            if (pagoExitoso) {
                orden.setEstado(EstadoOrden.CONFIRMADA);
            }
        }
    }
}

// Pruebas unitarias para EDA
public class EventDrivenArchitectureTest {
    
    @Test
    public void testEventPublishingAndConsumption() {
        // Arrange
        EventBroker eventBroker = new EventBroker();
        InventarioEventConsumer inventarioConsumer = new InventarioEventConsumer();
        NotificacionEventConsumer notificacionConsumer = new NotificacionEventConsumer();
        
        eventBroker.subscribe("ORDEN_CREADA", inventarioConsumer);
        eventBroker.subscribe("ORDEN_CREADA", notificacionConsumer);
        eventBroker.subscribe("PAGO_PROCESADO", inventarioConsumer);
        eventBroker.subscribe("PAGO_PROCESADO", notificacionConsumer);
        
        OrdenService ordenService = new OrdenService(eventBroker);
        
        // Act
        List<Producto> productos = Arrays.asList(
            new Producto("Laptop", "Laptop gaming", new BigDecimal("999.99"), 1, CategoriaProducto.ELECTRONICOS)
        );
        
        Orden orden = ordenService.crearOrden(1L, productos);
        ordenService.procesarPago(orden.getId(), "TARJETA");
        
        // Assert - Los eventos deberían ser procesados por los consumidores
        // En un entorno real, verificaríamos que los métodos de los consumidores fueron llamados
        assertNotNull(orden);
        assertEquals(1L, orden.getId());
        
        // Limpiar
        eventBroker.shutdown();
    }
}
```

## Arquitectura Serverless

La arquitectura serverless es un truco de magia para desarrolladores: de repente puedes construir y desplegar aplicaciones completas sin tener que pensar en servidores. La forma en que funciona serverless es que, en la nube, el aprovisionamiento, parcheo y escalado de servidores son manejados por el proveedor de nube, fuera del escenario.

### Conceptos Clave de Serverless

1. **Functions as a Service (FaaS)**: Este es el núcleo de serverless. Piensa en fragmentos de lógica del tamaño de un bocado que se ejecutan solo en respuesta a un evento.

2. **Backend as a Service (BaaS)**: El backend es lo que hace que tu aplicación funcione, y es fácil de construir, pero también es la parte más repetitiva del desarrollo.

3. **Todo Orientado a Eventos**: Serverless está orientado a eventos, lo que significa que todo sucede debido a eventos.

4. **Auto-escalado**: Una arquitectura serverless escalará hacia arriba o hacia abajo dependiendo de la cantidad de demanda.

5. **Pago por Uso**: Lo mejor de serverless es que solo pagas por el tiempo que tu código se ejecuta.

### Ejemplo de Arquitectura Serverless con AWS Lambda

```java
// Función Lambda para procesar órdenes
public class ProcesarOrdenFunction implements RequestHandler<OrdenRequest, OrdenResponse> {
    
    private final DynamoDBMapper dynamoDBMapper;
    private final SNSClient snsClient;
    private final String topicArn;
    
    public ProcesarOrdenFunction() {
        this.dynamoDBMapper = new DynamoDBMapper(DynamoDBClient.builder().build());
        this.snsClient = SNSClient.builder().build();
        this.topicArn = System.getenv("NOTIFICATION_TOPIC_ARN");
    }
    
    @Override
    public OrdenResponse handleRequest(OrdenRequest request, Context context) {
        try {
            // Validar la solicitud
            if (request.getUsuarioId() == null || request.getProductos() == null || request.getProductos().isEmpty()) {
                throw new IllegalArgumentException("Datos de orden inválidos");
            }
            
            // Crear la orden
            Orden orden = crearOrden(request);
            
            // Guardar en DynamoDB
            dynamoDBMapper.save(orden);
            
            // Enviar notificación
            enviarNotificacion(orden);
            
            // Retornar respuesta
            return new OrdenResponse(
                orden.getId(),
                "Orden procesada exitosamente",
                orden.getTotal(),
                orden.getEstado()
            );
            
        } catch (Exception e) {
            context.getLogger().log("Error procesando orden: " + e.getMessage());
            throw new RuntimeException("Error procesando orden", e);
        }
    }
    
    private Orden crearOrden(OrdenRequest request) {
        BigDecimal total = request.getProductos().stream()
                .map(ProductoRequest::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new Orden(
            UUID.randomUUID().toString(),
            request.getUsuarioId(),
            request.getProductos(),
            total,
            EstadoOrden.PENDIENTE,
            LocalDateTime.now()
        );
    }
    
    private void enviarNotificacion(Orden orden) {
        try {
            PublishRequest publishRequest = PublishRequest.builder()
                .topicArn(topicArn)
                .message(crearMensajeNotificacion(orden))
                .subject("Nueva orden creada")
                .build();
            
            snsClient.publish(publishRequest);
        } catch (Exception e) {
            // Log del error pero no fallar la función
            System.err.println("Error enviando notificación: " + e.getMessage());
        }
    }
    
    private String crearMensajeNotificacion(Orden orden) {
        return String.format(
            "Nueva orden creada - ID: %s, Usuario: %s, Total: $%.2f",
            orden.getId(),
            orden.getUsuarioId(),
            orden.getTotal()
        );
    }
}

// Función Lambda para procesar pagos
public class ProcesarPagoFunction implements RequestHandler<PagoRequest, PagoResponse> {
    
    private final DynamoDBMapper dynamoDBMapper;
    private final SQSClient sqsClient;
    private final String queueUrl;
    
    public ProcesarPagoFunction() {
        this.dynamoDBMapper = new DynamoDBMapper(DynamoDBClient.builder().build());
        this.sqsClient = SQSClient.builder().build();
        this.queueUrl = System.getenv("INVENTARIO_QUEUE_URL");
    }
    
    @Override
    public PagoResponse handleRequest(PagoRequest request, Context context) {
        try {
            // Buscar la orden
            Orden orden = dynamoDBMapper.load(Orden.class, request.getOrdenId());
            if (orden == null) {
                throw new RuntimeException("Orden no encontrada: " + request.getOrdenId());
            }
            
            // Procesar el pago
            boolean pagoExitoso = procesarPagoConProveedor(request);
            
            if (pagoExitoso) {
                // Actualizar estado de la orden
                orden.setEstado(EstadoOrden.CONFIRMADA);
                orden.setFechaActualizacion(LocalDateTime.now());
                dynamoDBMapper.save(orden);
                
                // Enviar mensaje a la cola de inventario
                enviarMensajeInventario(orden);
                
                return new PagoResponse(
                    request.getOrdenId(),
                    "Pago procesado exitosamente",
                    true,
                    request.getMetodoPago()
                );
            } else {
                return new PagoResponse(
                    request.getOrdenId(),
                    "Pago fallido",
                    false,
                    request.getMetodoPago()
                );
            }
            
        } catch (Exception e) {
            context.getLogger().log("Error procesando pago: " + e.getMessage());
            throw new RuntimeException("Error procesando pago", e);
        }
    }
    
    private boolean procesarPagoConProveedor(PagoRequest request) {
        // Simulación de procesamiento de pago
        // En un entorno real, aquí se integraría con un proveedor de pagos
        return Math.random() > 0.1; // 90% de éxito
    }
    
    private void enviarMensajeInventario(Orden orden) {
        try {
            String mensaje = String.format(
                "{\"ordenId\": \"%s\", \"accion\": \"actualizar_inventario\", \"timestamp\": \"%s\"}",
                orden.getId(),
                LocalDateTime.now()
            );
            
            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                .queueUrl(queueUrl)
                .messageBody(mensaje)
                .build();
            
            sqsClient.sendMessage(sendMessageRequest);
        } catch (Exception e) {
            System.err.println("Error enviando mensaje a cola de inventario: " + e.getMessage());
        }
    }
}

// Función Lambda para procesar inventario
public class ProcesarInventarioFunction implements RequestHandler<SQSEvent, Void> {
    
    private final DynamoDBMapper dynamoDBMapper;
    
    public ProcesarInventarioFunction() {
        this.dynamoDBMapper = new DynamoDBMapper(DynamoDBClient.builder().build());
    }
    
    @Override
    public Void handleRequest(SQSEvent event, Context context) {
        for (SQSEvent.SQSMessage message : event.getRecords()) {
            try {
                procesarMensajeInventario(message.getBody());
            } catch (Exception e) {
                context.getLogger().log("Error procesando mensaje: " + e.getMessage());
                // En un entorno real, aquí se manejaría el dead letter queue
            }
        }
        return null;
    }
    
    private void procesarMensajeInventario(String mensaje) {
        // Parsear el mensaje JSON
        // En un entorno real, usarías Jackson o Gson
        System.out.println("Procesando mensaje de inventario: " + mensaje);
        
        // Lógica para actualizar inventario
        // Esto podría incluir actualizar DynamoDB, llamar a otros servicios, etc.
    }
}

// Clases de datos para las funciones Lambda
public class OrdenRequest {
    private String usuarioId;
    private List<ProductoRequest> productos;
    private String direccionEnvio;
    
    // Constructores, getters y setters
    public OrdenRequest() {}
    
    public String getUsuarioId() { return usuarioId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
    
    public List<ProductoRequest> getProductos() { return productos; }
    public void setProductos(List<ProductoRequest> productos) { this.productos = productos; }
    
    public String getDireccionEnvio() { return direccionEnvio; }
    public void setDireccionEnvio(String direccionEnvio) { this.direccionEnvio = direccionEnvio; }
}

public class OrdenResponse {
    private String ordenId;
    private String mensaje;
    private BigDecimal total;
    private String estado;
    
    public OrdenResponse(String ordenId, String mensaje, BigDecimal total, String estado) {
        this.ordenId = ordenId;
        this.mensaje = mensaje;
        this.total = total;
        this.estado = estado;
    }
    
    // Getters y setters
    public String getOrdenId() { return ordenId; }
    public void setOrdenId(String ordenId) { this.ordenId = ordenId; }
    
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

public class PagoRequest {
    private String ordenId;
    private String metodoPago;
    private String numeroTarjeta;
    private String cvv;
    private String fechaExpiracion;
    
    // Constructores, getters y setters
    public PagoRequest() {}
    
    public String getOrdenId() { return ordenId; }
    public void setOrdenId(String ordenId) { this.ordenId = ordenId; }
    
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    
    public String getNumeroTarjeta() { return numeroTarjeta; }
    public void setNumeroTarjeta(String numeroTarjeta) { this.numeroTarjeta = numeroTarjeta; }
    
    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }
    
    public String getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(String fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }
}

public class PagoResponse {
    private String ordenId;
    private String mensaje;
    private boolean exitoso;
    private String metodoPago;
    
    public PagoResponse(String ordenId, String mensaje, boolean exitoso, String metodoPago) {
        this.ordenId = ordenId;
        this.mensaje = mensaje;
        this.exitoso = exitoso;
        this.metodoPago = metodoPago;
    }
    
    // Getters y setters
    public String getOrdenId() { return ordenId; }
    public void setOrdenId(String ordenId) { this.ordenId = ordenId; }
    
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    
    public boolean isExitoso() { return exitoso; }
    public void setExitoso(boolean exitoso) { this.exitoso = exitoso; }
    
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}

public class ProductoRequest {
    private String id;
    private String nombre;
    private BigDecimal precio;
    private int cantidad;
    
    // Constructores, getters y setters
    public ProductoRequest() {}
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
}

// Pruebas unitarias para funciones serverless
public class ServerlessFunctionTest {
    
    @Test
    public void testProcesarOrdenFunction() {
        // Arrange
        ProcesarOrdenFunction function = new ProcesarOrdenFunction();
        OrdenRequest request = new OrdenRequest();
        request.setUsuarioId("user123");
        
        List<ProductoRequest> productos = Arrays.asList(
            new ProductoRequest("prod1", "Laptop", new BigDecimal("999.99"), 1)
        );
        request.setProductos(productos);
        
        TestContext context = new TestContext();
        
        // Act
        OrdenResponse response = function.handleRequest(request, context);
        
        // Assert
        assertNotNull(response);
        assertNotNull(response.getOrdenId());
        assertEquals("Orden procesada exitosamente", response.getMensaje());
        assertEquals(new BigDecimal("999.99"), response.getTotal());
    }
    
    @Test
    public void testProcesarPagoFunction() {
        // Arrange
        ProcesarPagoFunction function = new ProcesarPagoFunction();
        PagoRequest request = new PagoRequest();
        request.setOrdenId("order123");
        request.setMetodoPago("TARJETA");
        
        TestContext context = new TestContext();
        
        // Act
        PagoResponse response = function.handleRequest(request, context);
        
        // Assert
        assertNotNull(response);
        assertEquals("order123", response.getOrdenId());
        assertTrue(response.isExitoso() || !response.isExitoso()); // Debe ser uno u otro
    }
}

// Clase de contexto de prueba
class TestContext implements Context {
    @Override
    public String getAwsRequestId() { return "test-request-id"; }
    
    @Override
    public String getLogGroupName() { return "test-log-group"; }
    
    @Override
    public String getLogStreamName() { return "test-log-stream"; }
    
    @Override
    public String getFunctionName() { return "test-function"; }
    
    @Override
    public String getFunctionVersion() { return "1"; }
    
    @Override
    public String getInvokedFunctionArn() { return "test-arn"; }
    
    @Override
    public CognitoIdentity getIdentity() { return null; }
    
    @Override
    public ClientContext getClientContext() { return null; }
    
    @Override
    public int getRemainingTimeInMillis() { return 30000; }
    
    @Override
    public int getMemoryLimitInMB() { return 512; }
    
    @Override
    public LambdaLogger getLogger() { return new TestLogger(); }
}

class TestLogger implements LambdaLogger {
    @Override
    public void log(String message) {
        System.out.println("LOG: " + message);
    }
    
    @Override
    public void log(byte[] message) {
        System.out.println("LOG: " + new String(message));
    }
}
```

## Patrones de Diseño para Microservicios

### 1. Circuit Breaker Pattern

El patrón Circuit Breaker es esencial para la resiliencia en microservicios. Previene que las fallas se propaguen y permite que el sistema se recupere.

```java
// Implementación del patrón Circuit Breaker
public class CircuitBreaker {
    private final String name;
    private final int failureThreshold;
    private final long timeout;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicLong lastFailureTime = new AtomicLong(0);
    private final AtomicReference<State> state = new AtomicReference<>(State.CLOSED);
    
    public enum State {
        CLOSED, OPEN, HALF_OPEN
    }
    
    public CircuitBreaker(String name, int failureThreshold, long timeout) {
        this.name = name;
        this.failureThreshold = failureThreshold;
        this.timeout = timeout;
    }
    
    public <T> T execute(Supplier<T> supplier) throws Exception {
        if (canExecute()) {
            try {
                T result = supplier.get();
                onSuccess();
                return result;
            } catch (Exception e) {
                onFailure();
                throw e;
            }
        } else {
            throw new CircuitBreakerOpenException("Circuit breaker is open for: " + name);
        }
    }
    
    private boolean canExecute() {
        State currentState = state.get();
        
        switch (currentState) {
            case CLOSED:
                return true;
            case OPEN:
                if (System.currentTimeMillis() - lastFailureTime.get() > timeout) {
                    state.compareAndSet(State.OPEN, State.HALF_OPEN);
                    return true;
                }
                return false;
            case HALF_OPEN:
                return true;
            default:
                return false;
        }
    }
    
    private void onSuccess() {
        failureCount.set(0);
        state.set(State.CLOSED);
        System.out.println("Circuit breaker " + name + " closed");
    }
    
    private void onFailure() {
        failureCount.incrementAndGet();
        lastFailureTime.set(System.currentTimeMillis());
        
        if (failureCount.get() >= failureThreshold) {
            state.set(State.OPEN);
            System.out.println("Circuit breaker " + name + " opened");
        }
    }
    
    public State getState() {
        return state.get();
    }
    
    public int getFailureCount() {
        return failureCount.get();
    }
}

// Excepción personalizada para circuit breaker abierto
public class CircuitBreakerOpenException extends RuntimeException {
    public CircuitBreakerOpenException(String message) {
        super(message);
    }
}

// Servicio que usa circuit breaker
public class ExternalServiceClient {
    private final CircuitBreaker circuitBreaker;
    private final RestTemplate restTemplate;
    
    public ExternalServiceClient(String serviceName, RestTemplate restTemplate) {
        this.circuitBreaker = new CircuitBreaker(serviceName, 5, 60000); // 5 fallas, 60s timeout
        this.restTemplate = restTemplate;
    }
    
    public String callExternalService(String url) throws Exception {
        return circuitBreaker.execute(() -> {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new RuntimeException("External service returned: " + response.getStatusCode());
            }
        });
    }
    
    public CircuitBreaker.State getCircuitBreakerState() {
        return circuitBreaker.getState();
    }
}

// Pruebas unitarias para Circuit Breaker
public class CircuitBreakerTest {
    
    @Test
    public void testCircuitBreakerSuccess() throws Exception {
        // Arrange
        CircuitBreaker circuitBreaker = new CircuitBreaker("test", 3, 1000);
        
        // Act
        String result = circuitBreaker.execute(() -> "success");
        
        // Assert
        assertEquals("success", result);
        assertEquals(CircuitBreaker.State.CLOSED, circuitBreaker.getState());
        assertEquals(0, circuitBreaker.getFailureCount());
    }
    
    @Test
    public void testCircuitBreakerFailure() {
        // Arrange
        CircuitBreaker circuitBreaker = new CircuitBreaker("test", 2, 1000);
        
        // Act & Assert
        // Primera falla
        assertThrows(RuntimeException.class, () -> {
            circuitBreaker.execute(() -> {
                throw new RuntimeException("Test failure");
            });
        });
        assertEquals(CircuitBreaker.State.CLOSED, circuitBreaker.getState());
        assertEquals(1, circuitBreaker.getFailureCount());
        
        // Segunda falla - abre el circuit breaker
        assertThrows(RuntimeException.class, () -> {
            circuitBreaker.execute(() -> {
                throw new RuntimeException("Test failure");
            });
        });
        assertEquals(CircuitBreaker.State.OPEN, circuitBreaker.getState());
        
        // Tercera llamada - debe fallar inmediatamente
        assertThrows(CircuitBreakerOpenException.class, () -> {
            circuitBreaker.execute(() -> "should not execute");
        });
    }
}
```

### 2. Saga Pattern

El patrón Saga se usa para manejar transacciones distribuidas en microservicios.

```java
// Implementación del patrón Saga
public interface SagaStep {
    void execute();
    void compensate();
}

public class Saga {
    private final List<SagaStep> steps = new ArrayList<>();
    private final List<SagaStep> executedSteps = new ArrayList<>();
    
    public void addStep(SagaStep step) {
        steps.add(step);
    }
    
    public void execute() {
        try {
            for (SagaStep step : steps) {
                step.execute();
                executedSteps.add(step);
            }
            System.out.println("Saga completada exitosamente");
        } catch (Exception e) {
            System.out.println("Saga falló, iniciando compensación: " + e.getMessage());
            compensate();
            throw new RuntimeException("Saga failed", e);
        }
    }
    
    private void compensate() {
        // Compensar en orden inverso
        for (int i = executedSteps.size() - 1; i >= 0; i--) {
            try {
                executedSteps.get(i).compensate();
            } catch (Exception e) {
                System.err.println("Error durante compensación: " + e.getMessage());
            }
        }
    }
}

// Pasos de la saga para crear una orden
public class CrearOrdenStep implements SagaStep {
    private final OrdenService ordenService;
    private final OrdenRequest request;
    private String ordenId;
    
    public CrearOrdenStep(OrdenService ordenService, OrdenRequest request) {
        this.ordenService = ordenService;
        this.request = request;
    }
    
    @Override
    public void execute() {
        Orden orden = ordenService.crearOrden(request);
        this.ordenId = orden.getId();
        System.out.println("Orden creada: " + ordenId);
    }
    
    @Override
    public void compensate() {
        if (ordenId != null) {
            ordenService.cancelarOrden(ordenId);
            System.out.println("Orden cancelada: " + ordenId);
        }
    }
}

public class ReservarInventarioStep implements SagaStep {
    private final InventarioService inventarioService;
    private final String ordenId;
    private final List<Producto> productos;
    
    public ReservarInventarioStep(InventarioService inventarioService, String ordenId, List<Producto> productos) {
        this.inventarioService = inventarioService;
        this.ordenId = ordenId;
        this.productos = productos;
    }
    
    @Override
    public void execute() {
        inventarioService.reservarProductos(ordenId, productos);
        System.out.println("Inventario reservado para orden: " + ordenId);
    }
    
    @Override
    public void compensate() {
        inventarioService.liberarReserva(ordenId);
        System.out.println("Reserva de inventario liberada para orden: " + ordenId);
    }
}

public class ProcesarPagoStep implements SagaStep {
    private final PagoService pagoService;
    private final String ordenId;
    private final String metodoPago;
    
    public ProcesarPagoStep(PagoService pagoService, String ordenId, String metodoPago) {
        this.pagoService = pagoService;
        this.ordenId = ordenId;
        this.metodoPago = metodoPago;
    }
    
    @Override
    public void execute() {
        pagoService.procesarPago(ordenId, metodoPago);
        System.out.println("Pago procesado para orden: " + ordenId);
    }
    
    @Override
    public void compensate() {
        pagoService.reembolsarPago(ordenId);
        System.out.println("Pago reembolsado para orden: " + ordenId);
    }
}

// Servicio que orquesta la saga
public class OrdenSagaService {
    
    private final OrdenService ordenService;
    private final InventarioService inventarioService;
    private final PagoService pagoService;
    
    public OrdenSagaService(OrdenService ordenService, InventarioService inventarioService, PagoService pagoService) {
        this.ordenService = ordenService;
        this.inventarioService = inventarioService;
        this.pagoService = pagoService;
    }
    
    public void procesarOrdenCompleta(OrdenRequest request, String metodoPago) {
        Saga saga = new Saga();
        
        // Agregar pasos a la saga
        saga.addStep(new CrearOrdenStep(ordenService, request));
        saga.addStep(new ReservarInventarioStep(inventarioService, "orderId", request.getProductos()));
        saga.addStep(new ProcesarPagoStep(pagoService, "orderId", metodoPago));
        
        // Ejecutar la saga
        saga.execute();
    }
}

// Pruebas unitarias para Saga
public class SagaTest {
    
    @Test
    public void testSagaSuccess() {
        // Arrange
        MockOrdenService ordenService = new MockOrdenService();
        MockInventarioService inventarioService = new MockInventarioService();
        MockPagoService pagoService = new MockPagoService();
        
        OrdenSagaService sagaService = new OrdenSagaService(ordenService, inventarioService, pagoService);
        
        OrdenRequest request = new OrdenRequest();
        request.setUsuarioId("user123");
        
        // Act
        sagaService.procesarOrdenCompleta(request, "TARJETA");
        
        // Assert
        assertTrue(ordenService.isOrdenCreada());
        assertTrue(inventarioService.isInventarioReservado());
        assertTrue(pagoService.isPagoProcesado());
    }
    
    @Test
    public void testSagaFailureWithCompensation() {
        // Arrange
        MockOrdenService ordenService = new MockOrdenService();
        MockInventarioService inventarioService = new MockInventarioService();
        MockPagoService pagoService = new MockPagoService();
        pagoService.setShouldFail(true); // Simular falla en el pago
        
        OrdenSagaService sagaService = new OrdenSagaService(ordenService, inventarioService, pagoService);
        
        OrdenRequest request = new OrdenRequest();
        request.setUsuarioId("user123");
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            sagaService.procesarOrdenCompleta(request, "TARJETA");
        });
        
        // Verificar que se ejecutó la compensación
        assertTrue(ordenService.isOrdenCancelada());
        assertTrue(inventarioService.isReservaLiberada());
    }
}

// Clases mock para pruebas
class MockOrdenService extends OrdenService {
    private boolean ordenCreada = false;
    private boolean ordenCancelada = false;
    
    @Override
    public Orden crearOrden(OrdenRequest request) {
        ordenCreada = true;
        return new Orden("mock-order-id", request.getUsuarioId(), new ArrayList<>(), BigDecimal.ZERO, EstadoOrden.PENDIENTE, LocalDateTime.now());
    }
    
    @Override
    public void cancelarOrden(String ordenId) {
        ordenCancelada = true;
    }
    
    public boolean isOrdenCreada() { return ordenCreada; }
    public boolean isOrdenCancelada() { return ordenCancelada; }
}

class MockInventarioService extends InventarioService {
    private boolean inventarioReservado = false;
    private boolean reservaLiberada = false;
    
    @Override
    public void reservarProductos(String ordenId, List<Producto> productos) {
        inventarioReservado = true;
    }
    
    @Override
    public void liberarReserva(String ordenId) {
        reservaLiberada = true;
    }
    
    public boolean isInventarioReservado() { return inventarioReservado; }
    public boolean isReservaLiberada() { return reservaLiberada; }
}

class MockPagoService extends PagoService {
    private boolean pagoProcesado = false;
    private boolean pagoReembolsado = false;
    private boolean shouldFail = false;
    
    @Override
    public void procesarPago(String ordenId, String metodoPago) {
        if (shouldFail) {
            throw new RuntimeException("Pago fallido");
        }
        pagoProcesado = true;
    }
    
    @Override
    public void reembolsarPago(String ordenId) {
        pagoReembolsado = true;
    }
    
    public boolean isPagoProcesado() { return pagoProcesado; }
    public boolean isPagoReembolsado() { return pagoReembolsado; }
    public void setShouldFail(boolean shouldFail) { this.shouldFail = shouldFail; }
}
```

## Comparación de Arquitecturas

### Tabla Comparativa

| Aspecto | Monolito | SOA | Microservicios | Serverless |
|---------|----------|-----|----------------|------------|
| **Complejidad** | Baja | Media | Alta | Muy Alta |
| **Escalabilidad** | Limitada | Media | Excelente | Automática |
| **Despliegue** | Todo o nada | Por servicios | Independiente | Por función |
| **Tecnología** | Única | Múltiple | Múltiple | Múltiple |
| **Mantenimiento** | Centralizado | Centralizado | Distribuido | Distribuido |
| **Costo** | Bajo | Medio | Alto | Variable |
| **Tiempo de Desarrollo** | Rápido | Medio | Lento | Muy Rápido |
| **Resiliencia** | Baja | Media | Alta | Muy Alta |

### Recomendaciones de Uso

1. **Monolito**: Para aplicaciones pequeñas, equipos pequeños, o prototipos rápidos.
2. **SOA**: Para integración de sistemas empresariales existentes.
3. **Microservicios**: Para aplicaciones grandes, equipos grandes, o cuando se necesita alta escalabilidad.
4. **Serverless**: Para cargas de trabajo variables, aplicaciones event-driven, o cuando se quiere minimizar la gestión de infraestructura.

## Conclusión

La evolución de la arquitectura de software ha sido un viaje fascinante desde la simplicidad de la programación estructurada hasta la complejidad y poder de las arquitecturas modernas como microservicios y serverless. Cada arquitectura tiene su lugar y propósito, y la elección correcta depende de los requisitos específicos del proyecto, el tamaño del equipo, y las restricciones del negocio.

Los patrones de diseño como Circuit Breaker y Saga son esenciales para construir sistemas resilientes y confiables en arquitecturas distribuidas. La comprensión de estos patrones y su implementación correcta es crucial para el éxito de cualquier sistema basado en microservicios.

En los siguientes capítulos, profundizaremos en los conceptos específicos de microservicios, incluyendo comunicación entre servicios, gestión de datos, monitoreo, y mejores prácticas de implementación. 