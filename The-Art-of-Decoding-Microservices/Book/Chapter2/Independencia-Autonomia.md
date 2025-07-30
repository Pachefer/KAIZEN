# Independencia y Autonomía en Microservicios

## Definición y Fundamentos

La independencia y autonomía son los pilares que sostienen toda la arquitectura de microservicios. Estos principios son lo que hace que los microservicios sean tan efectivos: te permiten construir sistemas donde cada componente puede funcionar por su cuenta, pero también trabajar juntos para crear una aplicación robusta y escalable.

## Ejemplo 1: Violación de Independencia - Servicios Acoplados

```java
/**
 * ❌ EJEMPLO INCORRECTO: Servicios Fuertemente Acoplados
 * 
 * Problemas:
 * - Dependencias directas entre servicios
 * - Cambios en un servicio afectan otros
 * - Difícil de escalar independientemente
 * - Violación de autonomía
 */
@Service
public class ServicioOrdenAcoplado {
    
    // ❌ DEPENDENCIA DIRECTA: Violación de independencia
    @Autowired
    private ServicioUsuario servicioUsuario;
    
    @Autowired
    private ServicioInventario servicioInventario;
    
    @Autowired
    private ServicioPago servicioPago;
    
    @Autowired
    private OrdenRepository ordenRepository;
    
    /**
     * ❌ PROBLEMA: Llamadas directas a otros servicios
     * Esto crea acoplamiento fuerte y viola la autonomía
     */
    public Orden crearOrden(CrearOrdenRequest request) {
        // ❌ Llamada directa al servicio de usuarios
        Usuario usuario = servicioUsuario.obtenerPorId(request.getUsuarioId());
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        // ❌ Llamada directa al servicio de inventario
        for (ItemOrden item : request.getItems()) {
            Producto producto = servicioInventario.obtenerProducto(item.getProductoId());
            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente");
            }
        }
        
        // Crear la orden
        Orden orden = new Orden();
        orden.setUsuarioId(request.getUsuarioId());
        orden.setItems(request.getItems());
        orden.setTotal(calcularTotal(request.getItems()));
        orden.setEstado(EstadoOrden.PENDIENTE);
        orden.setFechaCreacion(LocalDateTime.now());
        
        Orden ordenGuardada = ordenRepository.save(orden);
        
        // ❌ Llamada directa al servicio de pagos
        Pago pago = servicioPago.procesarPago(ordenGuardada.getId(), request.getMetodoPago());
        
        // Actualizar estado de la orden
        ordenGuardada.setEstado(EstadoOrden.CONFIRMADA);
        ordenRepository.save(ordenGuardada);
        
        return ordenGuardada;
    }
    
    private BigDecimal calcularTotal(List<ItemOrden> items) {
        return items.stream()
            .map(ItemOrden::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

/**
 * ❌ PROBLEMAS DEL CÓDIGO ANTERIOR:
 * 
 * 1. ACOPLAMIENTO FUERTE:
 *    - ServicioOrden depende directamente de otros servicios
 *    - Si un servicio falla, afecta a todos los demás
 *    - Cambios en un servicio requieren cambios en otros
 * 
 * 2. FALTA DE AUTONOMÍA:
 *    - ServicioOrden no puede funcionar sin otros servicios
 *    - No puede ser desplegado independientemente
 *    - No puede ser probado de forma aislada
 * 
 * 3. ESCALABILIDAD LIMITADA:
 *    - No se puede escalar servicios individualmente
 *    - Cuellos de botella en servicios dependientes
 *    - Uso ineficiente de recursos
 * 
 * 4. COMPLEJIDAD DE TESTING:
 *    - Pruebas requieren mocks de múltiples servicios
 *    - Difícil de probar en aislamiento
 *    - Pruebas de integración complejas
 */
```

## Ejemplo 2: Aplicación Correcta - Servicios Independientes y Autónomos

```java
/**
 * ✅ EJEMPLO CORRECTO: Servicios Independientes y Autónomos
 * 
 * Cada servicio es completamente independiente y autónomo:
 * - Tiene su propia base de datos
 * - Maneja su propia lógica de negocio
 * - Se comunica a través de eventos asíncronos
 * - Puede funcionar sin otros servicios
 */

/**
 * MICROSERVICIO: Servicio de Órdenes
 * Responsabilidad: Gestión completa del ciclo de vida de órdenes
 * Autonomía: Funciona independientemente de otros servicios
 */
@Service
public class ServicioOrdenAutonomo {
    
    // ✅ SOLO DEPENDENCIAS INTERNAS: Autonomía completa
    @Autowired
    private OrdenRepository ordenRepository;
    
    @Autowired
    private OrdenValidator ordenValidator;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    @Autowired
    private OrdenService ordenService;
    
    /**
     * ✅ MÉTODO AUTÓNOMO: No depende de otros servicios
     * La validación se hace con datos locales o eventos
     */
    public Orden crearOrden(CrearOrdenRequest request) {
        // Validar la orden localmente
        ordenValidator.validarOrden(request);
        
        // Crear la orden con estado inicial
        Orden orden = new Orden();
        orden.setUsuarioId(request.getUsuarioId());
        orden.setItems(request.getItems());
        orden.setTotal(calcularTotal(request.getItems()));
        orden.setEstado(EstadoOrden.CREADA);
        orden.setFechaCreacion(LocalDateTime.now());
        orden.setMetodoPago(request.getMetodoPago());
        
        // Guardar en la base de datos local
        Orden ordenGuardada = ordenRepository.save(orden);
        
        // ✅ PUBLICAR EVENTO: Comunicación asíncrona
        // Otros servicios pueden reaccionar a este evento
        eventPublisher.publish(new OrdenCreadaEvent(
            ordenGuardada.getId(),
            ordenGuardada.getUsuarioId(),
            ordenGuardada.getItems(),
            ordenGuardada.getTotal()
        ));
        
        return ordenGuardada;
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Procesar pago localmente
     * No depende de servicios externos
     */
    public void procesarPagoOrden(Long ordenId, String transaccionId) {
        Orden orden = ordenRepository.findById(ordenId)
            .orElseThrow(() -> new OrdenNoEncontradaException("Orden no encontrada: " + ordenId));
        
        // Actualizar estado localmente
        orden.setEstado(EstadoOrden.PAGADA);
        orden.setTransaccionId(transaccionId);
        orden.setFechaPago(LocalDateTime.now());
        
        ordenRepository.save(orden);
        
        // Publicar evento de pago procesado
        eventPublisher.publish(new OrdenPagadaEvent(
            orden.getId(),
            orden.getUsuarioId(),
            orden.getTotal(),
            transaccionId
        ));
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Confirmar orden
     */
    public void confirmarOrden(Long ordenId) {
        Orden orden = ordenRepository.findById(ordenId)
            .orElseThrow(() -> new OrdenNoEncontradaException("Orden no encontrada: " + ordenId));
        
        orden.setEstado(EstadoOrden.CONFIRMADA);
        orden.setFechaConfirmacion(LocalDateTime.now());
        
        ordenRepository.save(orden);
        
        // Publicar evento de confirmación
        eventPublisher.publish(new OrdenConfirmadaEvent(
            orden.getId(),
            orden.getUsuarioId(),
            orden.getItems()
        ));
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Cancelar orden
     */
    public void cancelarOrden(Long ordenId, String motivo) {
        Orden orden = ordenRepository.findById(ordenId)
            .orElseThrow(() -> new OrdenNoEncontradaException("Orden no encontrada: " + ordenId));
        
        orden.setEstado(EstadoOrden.CANCELADA);
        orden.setMotivoCancelacion(motivo);
        orden.setFechaCancelacion(LocalDateTime.now());
        
        ordenRepository.save(orden);
        
        // Publicar evento de cancelación
        eventPublisher.publish(new OrdenCanceladaEvent(
            orden.getId(),
            orden.getUsuarioId(),
            orden.getTotal(),
            motivo
        ));
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Obtener órdenes de usuario
     */
    public List<Orden> obtenerOrdenesUsuario(Long usuarioId) {
        return ordenRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Obtener estadísticas locales
     */
    public EstadisticasOrden obtenerEstadisticas(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Orden> ordenes = ordenRepository.findByFechaCreacionBetween(
            fechaInicio.atStartOfDay(),
            fechaFin.atTime(23, 59, 59)
        );
        
        BigDecimal totalVentas = ordenes.stream()
            .filter(o -> o.getEstado() == EstadoOrden.CONFIRMADA)
            .map(Orden::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long totalOrdenes = ordenes.stream()
            .filter(o -> o.getEstado() == EstadoOrden.CONFIRMADA)
            .count();
        
        return new EstadisticasOrden(totalVentas, totalOrdenes);
    }
    
    private BigDecimal calcularTotal(List<ItemOrden> items) {
        return items.stream()
            .map(ItemOrden::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

/**
 * MICROSERVICIO: Servicio de Inventario
 * Responsabilidad: Gestión de inventario y stock
 * Autonomía: Funciona independientemente de otros servicios
 */
@Service
public class ServicioInventarioAutonomo {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private InventarioValidator inventarioValidator;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Actualizar stock
     */
    public void actualizarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + productoId));
        
        int nuevoStock = producto.getStock() + cantidad;
        if (nuevoStock < 0) {
            throw new StockInsuficienteException("Stock insuficiente para el producto: " + productoId);
        }
        
        producto.setStock(nuevoStock);
        producto.setFechaActualizacion(LocalDateTime.now());
        
        productoRepository.save(producto);
        
        // Publicar evento de stock actualizado
        eventPublisher.publish(new StockActualizadoEvent(
            productoId,
            cantidad,
            nuevoStock
        ));
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Verificar disponibilidad
     */
    public boolean verificarDisponibilidad(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + productoId));
        
        return producto.getStock() >= cantidad;
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Reservar productos
     */
    public void reservarProductos(Long ordenId, List<ItemOrden> items) {
        for (ItemOrden item : items) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + item.getProductoId()));
            
            if (producto.getStock() < item.getCantidad()) {
                throw new StockInsuficienteException("Stock insuficiente para el producto: " + item.getProductoId());
            }
            
            // Reservar el stock
            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);
        }
        
        // Publicar evento de productos reservados
        eventPublisher.publish(new ProductosReservadosEvent(ordenId, items));
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Liberar reserva
     */
    public void liberarReserva(Long ordenId, List<ItemOrden> items) {
        for (ItemOrden item : items) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + item.getProductoId()));
            
            // Liberar el stock reservado
            producto.setStock(producto.getStock() + item.getCantidad());
            productoRepository.save(producto);
        }
        
        // Publicar evento de reserva liberada
        eventPublisher.publish(new ReservaLiberadaEvent(ordenId, items));
    }
}

/**
 * MICROSERVICIO: Servicio de Pagos
 * Responsabilidad: Procesamiento de pagos
 * Autonomía: Funciona independientemente de otros servicios
 */
@Service
public class ServicioPagoAutonomo {
    
    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private ProveedorPagoService proveedorPagoService;
    
    @Autowired
    private PagoValidator pagoValidator;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Procesar pago
     */
    public Pago procesarPago(ProcesarPagoRequest request) {
        // Validar pago localmente
        pagoValidator.validarPago(request);
        
        // Procesar con proveedor externo
        ResultadoProcesamiento resultado = proveedorPagoService.procesarPago(
            request.getMonto(),
            request.getMetodoPago(),
            request.getDatosTarjeta()
        );
        
        if (!resultado.isExitoso()) {
            throw new PagoFallidoException("Pago fallido: " + resultado.getMensajeError());
        }
        
        // Guardar pago localmente
        Pago pago = new Pago();
        pago.setOrdenId(request.getOrdenId());
        pago.setMonto(request.getMonto());
        pago.setMetodoPago(request.getMetodoPago());
        pago.setTransaccionId(resultado.getTransaccionId());
        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaProcesamiento(LocalDateTime.now());
        
        Pago pagoGuardado = pagoRepository.save(pago);
        
        // Publicar evento de pago procesado
        eventPublisher.publish(new PagoProcesadoEvent(
            pagoGuardado.getId(),
            pagoGuardado.getOrdenId(),
            pagoGuardado.getMonto(),
            pagoGuardado.getTransaccionId()
        ));
        
        return pagoGuardado;
    }
    
    /**
     * ✅ MÉTODO AUTÓNOMO: Reembolsar pago
     */
    public Pago reembolsarPago(Long pagoId, BigDecimal montoReembolso) {
        Pago pago = pagoRepository.findById(pagoId)
            .orElseThrow(() -> new PagoNoEncontradoException("Pago no encontrado: " + pagoId));
        
        if (pago.getEstado() != EstadoPago.COMPLETADO) {
            throw new PagoNoReembolsableException("El pago no puede ser reembolsado");
        }
        
        // Procesar reembolso con proveedor
        ResultadoReembolso resultado = proveedorPagoService.reembolsarPago(
            pago.getTransaccionId(),
            montoReembolso
        );
        
        if (!resultado.isExitoso()) {
            throw new ReembolsoFallidoException("Reembolso fallido: " + resultado.getMensajeError());
        }
        
        // Actualizar estado localmente
        pago.setEstado(EstadoPago.REEMBOLSADO);
        pago.setMontoReembolso(montoReembolso);
        pago.setFechaReembolso(LocalDateTime.now());
        
        Pago pagoActualizado = pagoRepository.save(pago);
        
        // Publicar evento de reembolso
        eventPublisher.publish(new PagoReembolsadoEvent(
            pagoActualizado.getId(),
            pagoActualizado.getOrdenId(),
            pagoActualizado.getMontoReembolso()
        ));
        
        return pagoActualizado;
    }
}
```

## Ejemplo 3: Comunicación Asíncrona con Eventos

```java
/**
 * COMUNICACIÓN ASÍNCRONA ENTRE MICROSERVICIOS
 * 
 * Los microservicios se comunican a través de eventos
 * manteniendo su independencia y autonomía
 */

/**
 * Eventos para comunicación asíncrona
 */
public class OrdenCreadaEvent {
    private final Long ordenId;
    private final Long usuarioId;
    private final List<ItemOrden> items;
    private final BigDecimal total;
    private final LocalDateTime fechaCreacion;
    
    public OrdenCreadaEvent(Long ordenId, Long usuarioId, List<ItemOrden> items, BigDecimal total) {
        this.ordenId = ordenId;
        this.usuarioId = usuarioId;
        this.items = items;
        this.total = total;
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // Getters
    public Long getOrdenId() { return ordenId; }
    public Long getUsuarioId() { return usuarioId; }
    public List<ItemOrden> getItems() { return items; }
    public BigDecimal getTotal() { return total; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}

public class PagoProcesadoEvent {
    private final Long pagoId;
    private final Long ordenId;
    private final BigDecimal monto;
    private final String transaccionId;
    private final LocalDateTime fechaProcesamiento;
    
    public PagoProcesadoEvent(Long pagoId, Long ordenId, BigDecimal monto, String transaccionId) {
        this.pagoId = pagoId;
        this.ordenId = ordenId;
        this.monto = monto;
        this.transaccionId = transaccionId;
        this.fechaProcesamiento = LocalDateTime.now();
    }
    
    // Getters
    public Long getPagoId() { return pagoId; }
    public Long getOrdenId() { return ordenId; }
    public BigDecimal getMonto() { return monto; }
    public String getTransaccionId() { return transaccionId; }
    public LocalDateTime getFechaProcesamiento() { return fechaProcesamiento; }
}

/**
 * Consumidores de eventos - Cada servicio escucha eventos relevantes
 */
@Component
public class OrdenEventHandler {
    
    @Autowired
    private ServicioOrdenAutonomo servicioOrden;
    
    /**
     * ✅ ESCUCHAR EVENTO: Pago procesado
     * El servicio de órdenes reacciona a pagos procesados
     */
    @EventListener
    public void handlePagoProcesado(PagoProcesadoEvent event) {
        // Actualizar estado de la orden localmente
        servicioOrden.procesarPagoOrden(event.getOrdenId(), event.getTransaccionId());
    }
}

@Component
public class InventarioEventHandler {
    
    @Autowired
    private ServicioInventarioAutonomo servicioInventario;
    
    /**
     * ✅ ESCUCHAR EVENTO: Orden creada
     * El servicio de inventario reacciona a órdenes creadas
     */
    @EventListener
    public void handleOrdenCreada(OrdenCreadaEvent event) {
        // Reservar productos para la orden
        servicioInventario.reservarProductos(event.getOrdenId(), event.getItems());
    }
    
    /**
     * ✅ ESCUCHAR EVENTO: Orden cancelada
     * El servicio de inventario reacciona a órdenes canceladas
     */
    @EventListener
    public void handleOrdenCancelada(OrdenCanceladaEvent event) {
        // Liberar productos reservados
        servicioInventario.liberarReserva(event.getOrdenId(), event.getItems());
    }
}
```

## Pruebas Unitarias para Independencia y Autonomía

```java
/**
 * PRUEBAS UNITARIAS PARA SERVICIOS INDEPENDIENTES
 * 
 * Cada servicio se prueba de forma aislada
 * sin dependencias de otros servicios
 */

/**
 * Pruebas para el Servicio de Órdenes Autónomo
 */
@ExtendWith(MockitoExtension.class)
public class ServicioOrdenAutonomoTest {
    
    @Mock
    private OrdenRepository ordenRepository;
    
    @Mock
    private OrdenValidator ordenValidator;
    
    @Mock
    private EventPublisher eventPublisher;
    
    @InjectMocks
    private ServicioOrdenAutonomo servicioOrden;
    
    /**
     * ✅ Prueba: Crear orden de forma autónoma
     * No depende de otros servicios
     */
    @Test
    public void testCrearOrdenAutonomo() {
        // Arrange
        CrearOrdenRequest request = new CrearOrdenRequest();
        request.setUsuarioId(1L);
        request.setItems(Arrays.asList(
            new ItemOrden(1L, 2, new BigDecimal("50.00"))
        ));
        request.setMetodoPago("TARJETA");
        
        Orden ordenEsperada = new Orden();
        ordenEsperada.setId(1L);
        ordenEsperada.setUsuarioId(1L);
        ordenEsperada.setEstado(EstadoOrden.CREADA);
        ordenEsperada.setTotal(new BigDecimal("100.00"));
        
        when(ordenValidator.validarOrden(request)).thenReturn(true);
        when(ordenRepository.save(any(Orden.class))).thenReturn(ordenEsperada);
        
        // Act
        Orden resultado = servicioOrden.crearOrden(request);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(EstadoOrden.CREADA, resultado.getEstado());
        assertEquals(new BigDecimal("100.00"), resultado.getTotal());
        
        // Verificar que se publicó el evento
        verify(eventPublisher).publish(any(OrdenCreadaEvent.class));
    }
    
    /**
     * ✅ Prueba: Procesar pago de orden
     */
    @Test
    public void testProcesarPagoOrden() {
        // Arrange
        Long ordenId = 1L;
        String transaccionId = "TXN123456";
        
        Orden orden = new Orden();
        orden.setId(ordenId);
        orden.setEstado(EstadoOrden.CREADA);
        
        when(ordenRepository.findById(ordenId)).thenReturn(Optional.of(orden));
        when(ordenRepository.save(any(Orden.class))).thenReturn(orden);
        
        // Act
        servicioOrden.procesarPagoOrden(ordenId, transaccionId);
        
        // Assert
        verify(ordenRepository).findById(ordenId);
        verify(ordenRepository).save(any(Orden.class));
        verify(eventPublisher).publish(any(OrdenPagadaEvent.class));
    }
    
    /**
     * ✅ Prueba: Confirmar orden
     */
    @Test
    public void testConfirmarOrden() {
        // Arrange
        Long ordenId = 1L;
        
        Orden orden = new Orden();
        orden.setId(ordenId);
        orden.setEstado(EstadoOrden.PAGADA);
        
        when(ordenRepository.findById(ordenId)).thenReturn(Optional.of(orden));
        when(ordenRepository.save(any(Orden.class))).thenReturn(orden);
        
        // Act
        servicioOrden.confirmarOrden(ordenId);
        
        // Assert
        verify(ordenRepository).findById(ordenId);
        verify(ordenRepository).save(any(Orden.class));
        verify(eventPublisher).publish(any(OrdenConfirmadaEvent.class));
    }
}

/**
 * Pruebas para el Servicio de Inventario Autónomo
 */
@ExtendWith(MockitoExtension.class)
public class ServicioInventarioAutonomoTest {
    
    @Mock
    private ProductoRepository productoRepository;
    
    @Mock
    private InventarioValidator inventarioValidator;
    
    @Mock
    private EventPublisher eventPublisher;
    
    @InjectMocks
    private ServicioInventarioAutonomo servicioInventario;
    
    /**
     * ✅ Prueba: Actualizar stock
     */
    @Test
    public void testActualizarStock() {
        // Arrange
        Long productoId = 1L;
        int cantidad = 10;
        
        Producto producto = new Producto();
        producto.setId(productoId);
        producto.setStock(50);
        
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);
        
        // Act
        servicioInventario.actualizarStock(productoId, cantidad);
        
        // Assert
        verify(productoRepository).findById(productoId);
        verify(productoRepository).save(any(Producto.class));
        verify(eventPublisher).publish(any(StockActualizadoEvent.class));
    }
    
    /**
     * ✅ Prueba: Verificar disponibilidad
     */
    @Test
    public void testVerificarDisponibilidad() {
        // Arrange
        Long productoId = 1L;
        int cantidad = 5;
        
        Producto producto = new Producto();
        producto.setId(productoId);
        producto.setStock(10);
        
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        
        // Act
        boolean disponible = servicioInventario.verificarDisponibilidad(productoId, cantidad);
        
        // Assert
        assertTrue(disponible);
        verify(productoRepository).findById(productoId);
    }
    
    /**
     * ✅ Prueba: Reservar productos
     */
    @Test
    public void testReservarProductos() {
        // Arrange
        Long ordenId = 1L;
        List<ItemOrden> items = Arrays.asList(
            new ItemOrden(1L, 2, new BigDecimal("50.00"))
        );
        
        Producto producto = new Producto();
        producto.setId(1L);
        producto.setStock(10);
        
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);
        
        // Act
        servicioInventario.reservarProductos(ordenId, items);
        
        // Assert
        verify(productoRepository).findById(1L);
        verify(productoRepository).save(any(Producto.class));
        verify(eventPublisher).publish(any(ProductosReservadosEvent.class));
    }
}

/**
 * Pruebas para el Servicio de Pagos Autónomo
 */
@ExtendWith(MockitoExtension.class)
public class ServicioPagoAutonomoTest {
    
    @Mock
    private PagoRepository pagoRepository;
    
    @Mock
    private ProveedorPagoService proveedorPagoService;
    
    @Mock
    private PagoValidator pagoValidator;
    
    @Mock
    private EventPublisher eventPublisher;
    
    @InjectMocks
    private ServicioPagoAutonomo servicioPago;
    
    /**
     * ✅ Prueba: Procesar pago exitosamente
     */
    @Test
    public void testProcesarPagoExitoso() {
        // Arrange
        ProcesarPagoRequest request = new ProcesarPagoRequest();
        request.setOrdenId(1L);
        request.setMonto(new BigDecimal("100.00"));
        request.setMetodoPago("TARJETA");
        
        ResultadoProcesamiento resultado = new ResultadoProcesamiento();
        resultado.setExitoso(true);
        resultado.setTransaccionId("TXN123456");
        
        Pago pagoEsperado = new Pago();
        pagoEsperado.setId(1L);
        pagoEsperado.setEstado(EstadoPago.COMPLETADO);
        
        when(pagoValidator.validarPago(request)).thenReturn(true);
        when(proveedorPagoService.procesarPago(any(), any(), any())).thenReturn(resultado);
        when(pagoRepository.save(any(Pago.class))).thenReturn(pagoEsperado);
        
        // Act
        Pago resultado = servicioPago.procesarPago(request);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(EstadoPago.COMPLETADO, resultado.getEstado());
        verify(pagoValidator).validarPago(request);
        verify(proveedorPagoService).procesarPago(any(), any(), any());
        verify(pagoRepository).save(any(Pago.class));
        verify(eventPublisher).publish(any(PagoProcesadoEvent.class));
    }
    
    /**
     * ✅ Prueba: Pago fallido
     */
    @Test
    public void testProcesarPagoFallido() {
        // Arrange
        ProcesarPagoRequest request = new ProcesarPagoRequest();
        request.setMonto(new BigDecimal("100.00"));
        
        ResultadoProcesamiento resultado = new ResultadoProcesamiento();
        resultado.setExitoso(false);
        resultado.setMensajeError("Tarjeta rechazada");
        
        when(pagoValidator.validarPago(request)).thenReturn(true);
        when(proveedorPagoService.procesarPago(any(), any(), any())).thenReturn(resultado);
        
        // Act & Assert
        assertThrows(PagoFallidoException.class, () -> {
            servicioPago.procesarPago(request);
        });
        
        // Verificar que no se guardó el pago
        verify(pagoRepository, never()).save(any(Pago.class));
    }
}
```

## Beneficios de la Independencia y Autonomía

### ✅ Ventajas de la Aplicación Correcta

1. **Independencia Total**
   - Cada servicio puede funcionar sin otros
   - Despliegue independiente
   - Testing aislado

2. **Autonomía Completa**
   - Cada servicio controla su propio dominio
   - Decisiones locales sin dependencias externas
   - Gestión independiente de datos

3. **Escalabilidad Independiente**
   - Cada servicio escala según sus necesidades
   - Optimización específica por servicio
   - Uso eficiente de recursos

4. **Resiliencia Mejorada**
   - Fallas aisladas por servicio
   - Recuperación independiente
   - Sistema más robusto

5. **Desarrollo Paralelo**
   - Equipos pueden trabajar independientemente
   - Sin bloqueos entre servicios
   - Desarrollo más rápido

### ❌ Problemas de Violar la Independencia

1. **Acoplamiento Fuerte**
   - Dependencias directas entre servicios
   - Cambios afectan múltiples servicios
   - Difícil de modificar

2. **Falta de Autonomía**
   - Servicios no pueden funcionar solos
   - Dependencias externas constantes
   - Testing complejo

3. **Escalabilidad Limitada**
   - No se puede escalar servicios individualmente
   - Cuellos de botella
   - Uso ineficiente de recursos

4. **Complejidad Incrementada**
   - Gestión de dependencias compleja
   - Debugging difícil
   - Mantenimiento costoso

## Resumen

La independencia y autonomía son fundamentales para el éxito de la arquitectura de microservicios. Al aplicar estos principios correctamente:

- **Cada microservicio es completamente independiente**
- **La comunicación se hace a través de eventos asíncronos**
- **Cada servicio controla su propio dominio de datos**
- **El sistema es más resiliente y escalable**

La clave está en diseñar servicios que puedan funcionar de forma autónoma y comunicarse a través de interfaces bien definidas, manteniendo la separación de responsabilidades y evitando dependencias directas entre servicios. 