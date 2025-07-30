# Comunicación Entre Microservicios

## Definición y Fundamentos

La comunicación entre microservicios es el mecanismo que permite que servicios independientes y autónomos trabajen juntos para formar un sistema cohesivo. A diferencia de las aplicaciones monolíticas donde todo está en un solo proceso, los microservicios necesitan comunicarse a través de la red, lo que introduce nuevos desafíos y patrones de comunicación.

## Tipos de Comunicación

### 1. Comunicación Síncrona (Request-Response)

```java
/**
 * COMUNICACIÓN SÍNCRONA: Request-Response
 * 
 * Características:
 * - El cliente espera una respuesta inmediata
 * - Comunicación directa entre servicios
 * - Útil para operaciones que requieren respuesta inmediata
 * - Puede crear acoplamiento temporal
 */

/**
 * Cliente HTTP para comunicación síncrona
 */
@Service
public class ClienteHttpService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private CircuitBreakerFactory circuitBreakerFactory;
    
    /**
     * Comunicación síncrona con timeout y circuit breaker
     */
    public Usuario obtenerUsuario(Long usuarioId) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("usuario-service");
        
        return circuitBreaker.run(() -> {
            String url = "http://usuario-service/api/usuarios/" + usuarioId;
            
            ResponseEntity<Usuario> response = restTemplate.getForEntity(url, Usuario.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Error obteniendo usuario: " + response.getStatusCode());
            }
        }, throwable -> {
            // Fallback: retornar usuario por defecto
            return new Usuario(usuarioId, "Usuario No Disponible", "n/a@ejemplo.com");
        });
    }
    
    /**
     * Comunicación síncrona con retry
     */
    public Producto obtenerProducto(Long productoId) {
        String url = "http://producto-service/api/productos/" + productoId;
        
        // Configurar retry
        RetryTemplate retryTemplate = RetryTemplate.builder()
            .maxAttempts(3)
            .fixedBackoff(1000) // 1 segundo
            .retryOn(RuntimeException.class)
            .build();
        
        return retryTemplate.execute(context -> {
            ResponseEntity<Producto> response = restTemplate.getForEntity(url, Producto.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Error obteniendo producto: " + response.getStatusCode());
            }
        });
    }
    
    /**
     * Comunicación síncrona con bulkhead pattern
     */
    public List<Orden> obtenerOrdenesUsuario(Long usuarioId) {
        String url = "http://orden-service/api/ordenes/usuario/" + usuarioId;
        
        // Usar thread pool separado para evitar bloqueo
        CompletableFuture<List<Orden>> future = CompletableFuture.supplyAsync(() -> {
            ResponseEntity<List<Orden>> response = restTemplate.getForEntity(
                url, 
                new ParameterizedTypeReference<List<Orden>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Error obteniendo órdenes: " + response.getStatusCode());
            }
        }, Executors.newFixedThreadPool(10));
        
        try {
            return future.get(5, TimeUnit.SECONDS); // Timeout de 5 segundos
        } catch (Exception e) {
            throw new RuntimeException("Timeout obteniendo órdenes", e);
        }
    }
}

/**
 * Servidor REST para comunicación síncrona
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private ServicioUsuario servicioUsuario;
    
    /**
     * Endpoint para comunicación síncrona
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        try {
            Usuario usuario = servicioUsuario.obtenerPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (UsuarioNoEncontradoException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Endpoint con validación y transformación
     */
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody CrearUsuarioRequest request) {
        try {
            Usuario usuario = servicioUsuario.crearUsuario(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (UsuarioYaExisteException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Endpoint con paginación
     */
    @GetMapping
    public ResponseEntity<Page<Usuario>> obtenerUsuarios(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamano) {
        
        Pageable pageable = PageRequest.of(pagina, tamano);
        Page<Usuario> usuarios = servicioUsuario.obtenerUsuarios(pageable);
        
        return ResponseEntity.ok(usuarios);
    }
}
```

### 2. Comunicación Asíncrona (Event-Driven)

```java
/**
 * COMUNICACIÓN ASÍNCRONA: Event-Driven
 * 
 * Características:
 * - El emisor no espera respuesta inmediata
 * - Desacoplamiento temporal y espacial
 * - Mayor resiliencia y escalabilidad
 * - Patrón publish-subscribe
 */

/**
 * Productor de eventos
 */
@Service
public class EventProducer {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Publicar evento de usuario creado
     */
    public void publicarUsuarioCreado(UsuarioCreadoEvent event) {
        try {
            String mensaje = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("usuarios-creados", event.getUsuarioId().toString(), mensaje);
            
            log.info("Evento UsuarioCreado publicado: {}", event.getUsuarioId());
        } catch (Exception e) {
            log.error("Error publicando evento UsuarioCreado: {}", e.getMessage(), e);
            throw new EventPublishException("Error publicando evento", e);
        }
    }
    
    /**
     * Publicar evento de pago procesado
     */
    public void publicarPagoProcesado(PagoProcesadoEvent event) {
        try {
            String mensaje = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("pagos-procesados", event.getPagoId().toString(), mensaje);
            
            log.info("Evento PagoProcesado publicado: {}", event.getPagoId());
        } catch (Exception e) {
            log.error("Error publicando evento PagoProcesado: {}", e.getMessage(), e);
            throw new EventPublishException("Error publicando evento", e);
        }
    }
    
    /**
     * Publicar evento de orden creada
     */
    public void publicarOrdenCreada(OrdenCreadaEvent event) {
        try {
            String mensaje = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("ordenes-creadas", event.getOrdenId().toString(), mensaje);
            
            log.info("Evento OrdenCreada publicado: {}", event.getOrdenId());
        } catch (Exception e) {
            log.error("Error publicando evento OrdenCreada: {}", e.getMessage(), e);
            throw new EventPublishException("Error publicando evento", e);
        }
    }
}

/**
 * Consumidor de eventos
 */
@Component
public class EventConsumer {
    
    @Autowired
    private ServicioNotificacion servicioNotificacion;
    
    @Autowired
    private ServicioInventario servicioInventario;
    
    @Autowired
    private ServicioReporte servicioReporte;
    
    /**
     * Consumir evento de usuario creado
     */
    @KafkaListener(topics = "usuarios-creados", groupId = "notificacion-service")
    public void consumirUsuarioCreado(String mensaje) {
        try {
            UsuarioCreadoEvent event = objectMapper.readValue(mensaje, UsuarioCreadoEvent.class);
            
            // Enviar notificación de bienvenida
            EnviarNotificacionRequest request = new EnviarNotificacionRequest();
            request.setTipo(TipoNotificacion.BIENVENIDA);
            request.setDestinatario(event.getEmail());
            request.setCanal(CanalNotificacion.EMAIL);
            request.setAsunto("¡Bienvenido a nuestra plataforma!");
            request.setMensaje("Hola " + event.getNombre() + ", ¡gracias por registrarte!");
            
            servicioNotificacion.enviarNotificacion(request);
            
            log.info("Notificación de bienvenida enviada para usuario: {}", event.getUsuarioId());
        } catch (Exception e) {
            log.error("Error procesando evento UsuarioCreado: {}", e.getMessage(), e);
            // Implementar dead letter queue o retry mechanism
        }
    }
    
    /**
     * Consumir evento de pago procesado
     */
    @KafkaListener(topics = "pagos-procesados", groupId = "inventario-service")
    public void consumirPagoProcesado(String mensaje) {
        try {
            PagoProcesadoEvent event = objectMapper.readValue(mensaje, PagoProcesadoEvent.class);
            
            // Actualizar inventario
            servicioInventario.actualizarStockPorPago(event.getOrdenId(), event.getItems());
            
            log.info("Inventario actualizado para pago: {}", event.getPagoId());
        } catch (Exception e) {
            log.error("Error procesando evento PagoProcesado: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Consumir evento de orden creada
     */
    @KafkaListener(topics = "ordenes-creadas", groupId = "reporte-service")
    public void consumirOrdenCreada(String mensaje) {
        try {
            OrdenCreadaEvent event = objectMapper.readValue(mensaje, OrdenCreadaEvent.class);
            
            // Actualizar estadísticas de reportes
            servicioReporte.actualizarEstadisticasVentas(event.getTotal());
            
            log.info("Estadísticas actualizadas para orden: {}", event.getOrdenId());
        } catch (Exception e) {
            log.error("Error procesando evento OrdenCreada: {}", e.getMessage(), e);
        }
    }
}
```

### 3. Comunicación Híbrida (Síncrona + Asíncrona)

```java
/**
 * COMUNICACIÓN HÍBRIDA: Combinando patrones síncronos y asíncronos
 * 
 * Características:
 * - Usa comunicación síncrona para respuestas inmediatas
 * - Usa comunicación asíncrona para operaciones en segundo plano
 * - Optimiza para diferentes tipos de operaciones
 */

/**
 * Servicio que combina comunicación síncrona y asíncrona
 */
@Service
public class ServicioOrdenHibrido {
    
    @Autowired
    private ClienteHttpService clienteHttp;
    
    @Autowired
    private EventProducer eventProducer;
    
    @Autowired
    private OrdenRepository ordenRepository;
    
    /**
     * Crear orden con comunicación híbrida
     */
    public OrdenResponse crearOrden(CrearOrdenRequest request) {
        // 1. COMUNICACIÓN SÍNCRONA: Validar usuario
        Usuario usuario = clienteHttp.obtenerUsuario(request.getUsuarioId());
        if (usuario == null) {
            throw new UsuarioNoEncontradoException("Usuario no encontrado");
        }
        
        // 2. COMUNICACIÓN SÍNCRONA: Verificar inventario
        for (ItemOrden item : request.getItems()) {
            boolean disponible = clienteHttp.verificarDisponibilidad(item.getProductoId(), item.getCantidad());
            if (!disponible) {
                throw new StockInsuficienteException("Stock insuficiente para producto: " + item.getProductoId());
            }
        }
        
        // 3. Crear orden localmente
        Orden orden = new Orden();
        orden.setUsuarioId(request.getUsuarioId());
        orden.setItems(request.getItems());
        orden.setTotal(calcularTotal(request.getItems()));
        orden.setEstado(EstadoOrden.CREADA);
        orden.setFechaCreacion(LocalDateTime.now());
        
        Orden ordenGuardada = ordenRepository.save(orden);
        
        // 4. COMUNICACIÓN ASÍNCRONA: Publicar eventos
        eventProducer.publicarOrdenCreada(new OrdenCreadaEvent(
            ordenGuardada.getId(),
            ordenGuardada.getUsuarioId(),
            ordenGuardada.getItems(),
            ordenGuardada.getTotal()
        ));
        
        // 5. Retornar respuesta inmediata
        return new OrdenResponse(
            ordenGuardada.getId(),
            "Orden creada exitosamente",
            ordenGuardada.getTotal(),
            ordenGuardada.getEstado()
        );
    }
    
    /**
     * Procesar pago con comunicación híbrida
     */
    public PagoResponse procesarPago(Long ordenId, ProcesarPagoRequest request) {
        // 1. COMUNICACIÓN SÍNCRONA: Procesar pago
        Pago pago = clienteHttp.procesarPago(request);
        
        // 2. Actualizar orden localmente
        Orden orden = ordenRepository.findById(ordenId)
            .orElseThrow(() -> new OrdenNoEncontradaException("Orden no encontrada"));
        
        orden.setEstado(EstadoOrden.PAGADA);
        orden.setTransaccionId(pago.getTransaccionId());
        orden.setFechaPago(LocalDateTime.now());
        
        ordenRepository.save(orden);
        
        // 3. COMUNICACIÓN ASÍNCRONA: Publicar evento de pago
        eventProducer.publicarPagoProcesado(new PagoProcesadoEvent(
            pago.getId(),
            ordenId,
            pago.getMonto(),
            pago.getTransaccionId()
        ));
        
        // 4. Retornar respuesta inmediata
        return new PagoResponse(
            pago.getId(),
            "Pago procesado exitosamente",
            pago.getMonto(),
            pago.getTransaccionId()
        );
    }
    
    private BigDecimal calcularTotal(List<ItemOrden> items) {
        return items.stream()
            .map(ItemOrden::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

## Patrones de Comunicación

### 1. API Gateway Pattern

```java
/**
 * API GATEWAY PATTERN
 * 
 * Punto de entrada único para todos los clientes
 * Maneja routing, autenticación, rate limiting, etc.
 */

@RestController
@RequestMapping("/api/gateway")
public class ApiGatewayController {
    
    @Autowired
    private ClienteHttpService clienteHttp;
    
    @Autowired
    private CircuitBreakerFactory circuitBreakerFactory;
    
    /**
     * Obtener información completa de usuario
     * Agrega datos de múltiples servicios
     */
    @GetMapping("/usuarios/{id}/completo")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioCompleto(@PathVariable Long id) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("usuario-completo");
        
        return circuitBreaker.run(() -> {
            Map<String, Object> resultado = new HashMap<>();
            
            // Obtener datos básicos del usuario
            Usuario usuario = clienteHttp.obtenerUsuario(id);
            resultado.put("usuario", usuario);
            
            // Obtener órdenes del usuario
            try {
                List<Orden> ordenes = clienteHttp.obtenerOrdenesUsuario(id);
                resultado.put("ordenes", ordenes);
            } catch (Exception e) {
                resultado.put("ordenes", new ArrayList<>());
                resultado.put("errorOrdenes", "No se pudieron obtener las órdenes");
            }
            
            // Obtener pagos del usuario
            try {
                List<Pago> pagos = clienteHttp.obtenerPagosUsuario(id);
                resultado.put("pagos", pagos);
            } catch (Exception e) {
                resultado.put("pagos", new ArrayList<>());
                resultado.put("errorPagos", "No se pudieron obtener los pagos");
            }
            
            return ResponseEntity.ok(resultado);
        }, throwable -> {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("error", "Servicio no disponible");
            fallback.put("usuario", null);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallback);
        });
    }
    
    /**
     * Crear orden completa
     * Orquesta múltiples servicios
     */
    @PostMapping("/ordenes/completa")
    public ResponseEntity<OrdenCompletaResponse> crearOrdenCompleta(@RequestBody CrearOrdenCompletaRequest request) {
        try {
            // 1. Validar usuario
            Usuario usuario = clienteHttp.obtenerUsuario(request.getUsuarioId());
            
            // 2. Validar productos
            for (ItemOrden item : request.getItems()) {
                Producto producto = clienteHttp.obtenerProducto(item.getProductoId());
                if (producto == null) {
                    throw new ProductoNoEncontradoException("Producto no encontrado: " + item.getProductoId());
                }
            }
            
            // 3. Crear orden
            Orden orden = clienteHttp.crearOrden(request);
            
            // 4. Procesar pago si se especifica
            Pago pago = null;
            if (request.getMetodoPago() != null) {
                ProcesarPagoRequest pagoRequest = new ProcesarPagoRequest();
                pagoRequest.setOrdenId(orden.getId());
                pagoRequest.setMonto(orden.getTotal());
                pagoRequest.setMetodoPago(request.getMetodoPago());
                pagoRequest.setDatosTarjeta(request.getDatosTarjeta());
                
                pago = clienteHttp.procesarPago(pagoRequest);
            }
            
            // 5. Retornar respuesta completa
            OrdenCompletaResponse response = new OrdenCompletaResponse();
            response.setOrden(orden);
            response.setUsuario(usuario);
            response.setPago(pago);
            response.setMensaje("Orden creada exitosamente");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new OrdenCompletaResponse("Error creando orden: " + e.getMessage()));
        }
    }
}
```

### 2. Saga Pattern

```java
/**
 * SAGA PATTERN
 * 
 * Maneja transacciones distribuidas
 * Compensa acciones si algo falla
 */

@Service
public class SagaOrdenService {
    
    @Autowired
    private ClienteHttpService clienteHttp;
    
    @Autowired
    private EventProducer eventProducer;
    
    /**
     * Saga para crear orden completa
     */
    public void ejecutarSagaCrearOrden(CrearOrdenRequest request) {
        List<SagaStep> steps = new ArrayList<>();
        
        // Paso 1: Crear orden
        steps.add(new CrearOrdenStep(clienteHttp, request));
        
        // Paso 2: Reservar inventario
        steps.add(new ReservarInventarioStep(clienteHttp, request.getItems()));
        
        // Paso 3: Procesar pago
        steps.add(new ProcesarPagoStep(clienteHttp, request.getMetodoPago()));
        
        // Ejecutar saga
        Saga saga = new Saga(steps);
        saga.execute();
    }
}

/**
 * Pasos de la saga
 */
public class CrearOrdenStep implements SagaStep {
    
    private final ClienteHttpService clienteHttp;
    private final CrearOrdenRequest request;
    private Orden ordenCreada;
    
    public CrearOrdenStep(ClienteHttpService clienteHttp, CrearOrdenRequest request) {
        this.clienteHttp = clienteHttp;
        this.request = request;
    }
    
    @Override
    public void execute() {
        ordenCreada = clienteHttp.crearOrden(request);
        log.info("Orden creada: {}", ordenCreada.getId());
    }
    
    @Override
    public void compensate() {
        if (ordenCreada != null) {
            clienteHttp.cancelarOrden(ordenCreada.getId());
            log.info("Orden cancelada: {}", ordenCreada.getId());
        }
    }
}

public class ReservarInventarioStep implements SagaStep {
    
    private final ClienteHttpService clienteHttp;
    private final List<ItemOrden> items;
    
    public ReservarInventarioStep(ClienteHttpService clienteHttp, List<ItemOrden> items) {
        this.clienteHttp = clienteHttp;
        this.items = items;
    }
    
    @Override
    public void execute() {
        clienteHttp.reservarInventario(items);
        log.info("Inventario reservado para {} items", items.size());
    }
    
    @Override
    public void compensate() {
        clienteHttp.liberarInventario(items);
        log.info("Inventario liberado para {} items", items.size());
    }
}
```

## Pruebas de Comunicación

```java
/**
 * PRUEBAS PARA COMUNICACIÓN ENTRE MICROSERVICIOS
 */

/**
 * Pruebas para comunicación síncrona
 */
@ExtendWith(MockitoExtension.class)
public class ComunicacionSincronaTest {
    
    @Mock
    private RestTemplate restTemplate;
    
    @Mock
    private CircuitBreakerFactory circuitBreakerFactory;
    
    @Mock
    private CircuitBreaker circuitBreaker;
    
    @InjectMocks
    private ClienteHttpService clienteHttp;
    
    @Test
    public void testObtenerUsuarioExitoso() {
        // Arrange
        Long usuarioId = 1L;
        Usuario usuarioEsperado = new Usuario(usuarioId, "Juan", "juan@ejemplo.com");
        
        when(circuitBreakerFactory.create("usuario-service")).thenReturn(circuitBreaker);
        when(circuitBreaker.run(any(), any())).thenReturn(usuarioEsperado);
        
        // Act
        Usuario resultado = clienteHttp.obtenerUsuario(usuarioId);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(usuarioId, resultado.getId());
        assertEquals("Juan", resultado.getNombre());
    }
    
    @Test
    public void testObtenerUsuarioConFallback() {
        // Arrange
        Long usuarioId = 1L;
        Usuario usuarioFallback = new Usuario(usuarioId, "Usuario No Disponible", "n/a@ejemplo.com");
        
        when(circuitBreakerFactory.create("usuario-service")).thenReturn(circuitBreaker);
        when(circuitBreaker.run(any(), any())).thenReturn(usuarioFallback);
        
        // Act
        Usuario resultado = clienteHttp.obtenerUsuario(usuarioId);
        
        // Assert
        assertNotNull(resultado);
        assertEquals("Usuario No Disponible", resultado.getNombre());
    }
}

/**
 * Pruebas para comunicación asíncrona
 */
@ExtendWith(MockitoExtension.class)
public class ComunicacionAsincronaTest {
    
    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Mock
    private ServicioNotificacion servicioNotificacion;
    
    @InjectMocks
    private EventProducer eventProducer;
    
    @InjectMocks
    private EventConsumer eventConsumer;
    
    @Test
    public void testPublicarUsuarioCreado() {
        // Arrange
        UsuarioCreadoEvent event = new UsuarioCreadoEvent(1L, "juan@ejemplo.com", "Juan");
        when(kafkaTemplate.send(anyString(), anyString(), anyString())).thenReturn(null);
        
        // Act
        eventProducer.publicarUsuarioCreado(event);
        
        // Assert
        verify(kafkaTemplate).send("usuarios-creadas", "1", anyString());
    }
    
    @Test
    public void testConsumirUsuarioCreado() {
        // Arrange
        String mensaje = "{\"usuarioId\":1,\"email\":\"juan@ejemplo.com\",\"nombre\":\"Juan\"}";

when(servicioNotificacion.enviarNotificacion(any())).thenReturn(null);
        
        // Act
        eventConsumer.consumirUsuarioCreado(mensaje);
        
        // Assert
        verify(servicioNotificacion).enviarNotificacion(any(EnviarNotificacionRequest.class));
    }
}

/**
 * Pruebas para comunicación híbrida
 */
@ExtendWith(MockitoExtension.class)
public class ComunicacionHibridaTest {
    
    @Mock
    private ClienteHttpService clienteHttp;
    
    @Mock
    private EventProducer eventProducer;
    
    @Mock
    private OrdenRepository ordenRepository;
    
    @InjectMocks
    private ServicioOrdenHibrido servicioOrden;
    
    @Test
    public void testCrearOrdenHibrida() {
        // Arrange
        CrearOrdenRequest request = new CrearOrdenRequest();
        request.setUsuarioId(1L);
        request.setItems(Arrays.asList(new ItemOrden(1L, 2, new BigDecimal("50.00"))));
        
        Usuario usuario = new Usuario(1L, "Juan", "juan@ejemplo.com");
        Orden orden = new Orden(1L, 1L, request.getItems(), new BigDecimal("100.00"));
        
        when(clienteHttp.obtenerUsuario(1L)).thenReturn(usuario);
        when(clienteHttp.verificarDisponibilidad(any(), anyInt())).thenReturn(true);
        when(ordenRepository.save(any())).thenReturn(orden);
        
        // Act
        OrdenResponse resultado = servicioOrden.crearOrden(request);
        
        // Assert
        assertNotNull(resultado);
        assertEquals("Orden creada exitosamente", resultado.getMensaje());
        verify(clienteHttp).obtenerUsuario(1L);
        verify(eventProducer).publicarOrdenCreada(any(OrdenCreadaEvent.class));
    }
}
```

## Resumen

La comunicación entre microservicios es fundamental para el éxito de la arquitectura. Los patrones principales son:

1. **Comunicación Síncrona**: Para respuestas inmediatas
2. **Comunicación Asíncrona**: Para desacoplamiento y resiliencia
3. **Comunicación Híbrida**: Combinando ambos patrones según las necesidades

Los patrones de comunicación como API Gateway y Saga ayudan a manejar la complejidad de la comunicación distribuida, mientras que las pruebas aseguran que la comunicación funcione correctamente en diferentes escenarios. 