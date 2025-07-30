# Contextos Acotados y Límites de Servicios

## Definición y Fundamentos

Los contextos acotados son una parte fundamental de Domain-Driven Design (DDD) que define límites claros dentro de un dominio de negocio. En microservicios, cada contexto acotado se traduce naturalmente en un microservicio independiente, asegurando que cada servicio maneje una parte específica del dominio.

## Ejemplo: E-commerce Platform

```java
/**
 * CONTEXTOS ACOTADOS EN E-COMMERCE
 * 
 * Este ejemplo muestra cómo identificar y mapear contextos acotados
 * a microservicios en una plataforma de e-commerce
 */

/**
 * CONTEXTO ACOTADO 1: GESTIÓN DE PRODUCTOS
 * Responsabilidad: Todo lo relacionado con productos, catálogo y categorías
 * Microservicio: ProductoService
 */
package com.ecommerce.producto.domain;

/**
 * Entidad de Dominio: Producto
 * Representa un producto en el contexto de gestión de productos
 */
public class Producto {
    
    // Identificador único del producto
    private ProductoId id;
    
    // Información básica del producto
    private NombreProducto nombre;
    private DescripcionProducto descripcion;
    private Precio precio;
    private Categoria categoria;
    
    // Estado del producto
    private EstadoProducto estado;
    
    // Información de inventario
    private Stock stock;
    private StockMinimo stockMinimo;
    
    // Información de marketing
    private Etiquetas etiquetas;
    private Imagenes imagenes;
    
    /**
     * Constructor principal
     * Valida que los datos del producto sean correctos según las reglas del contexto
     */
    public Producto(ProductoId id, NombreProducto nombre, DescripcionProducto descripcion,
                   Precio precio, Categoria categoria, Stock stock) {
        
        // Validaciones específicas del contexto de productos
        validarDatosProducto(id, nombre, descripcion, precio, categoria, stock);
        
        // Asignar valores
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.estado = EstadoProducto.ACTIVO;
        this.stockMinimo = new StockMinimo(5); // Stock mínimo por defecto
        this.etiquetas = new Etiquetas();
        this.imagenes = new Imagenes();
    }
    
    /**
     * Método de dominio: Publicar producto
     * Lógica específica del contexto de productos
     */
    public void publicar() {
        // Validar que el producto tenga toda la información requerida
        if (!tieneInformacionCompleta()) {
            throw new ProductoIncompletoException("El producto no tiene toda la información requerida para ser publicado");
        }
        
        // Validar que tenga stock disponible
        if (!stock.estaDisponible()) {
            throw new ProductoSinStockException("No se puede publicar un producto sin stock");
        }
        
        // Cambiar estado a publicado
        this.estado = EstadoProducto.PUBLICADO;
        
        // Generar SKU automáticamente si no existe
        if (this.id.getSku() == null) {
            this.id = this.id.generarSku(this.categoria);
        }
    }
    
    /**
     * Método de dominio: Actualizar información del producto
     */
    public void actualizarInformacion(NombreProducto nuevoNombre, DescripcionProducto nuevaDescripcion,
                                     Precio nuevoPrecio, Categoria nuevaCategoria) {
        
        // Validar que el producto no esté publicado si se cambia información crítica
        if (estado == EstadoProducto.PUBLICADO) {
            if (!this.nombre.equals(nuevoNombre) || !this.categoria.equals(nuevaCategoria)) {
                throw new ProductoPublicadoException("No se puede cambiar nombre o categoría de un producto publicado");
            }
        }
        
        // Actualizar información
        this.nombre = nuevoNombre;
        this.descripcion = nuevaDescripcion;
        this.precio = nuevoPrecio;
        this.categoria = nuevaCategoria;
        
        // Si el precio cambió significativamente, cambiar estado
        if (precio.cambioSignificativo(nuevoPrecio)) {
            this.estado = EstadoProducto.EN_REVISION;
        }
    }
    
    /**
     * Método de dominio: Agregar etiquetas
     */
    public void agregarEtiquetas(List<String> nuevasEtiquetas) {
        this.etiquetas.agregar(nuevasEtiquetas);
    }
    
    /**
     * Método de dominio: Agregar imágenes
     */
    public void agregarImagenes(List<Imagen> nuevasImagenes) {
        this.imagenes.agregar(nuevasImagenes);
    }
    
    /**
     * Método de dominio: Verificar si está listo para publicación
     */
    public boolean estaListoParaPublicacion() {
        return tieneInformacionCompleta() && 
               stock.estaDisponible() && 
               imagenes.tieneImagenPrincipal();
    }
    
    /**
     * Validaciones específicas del contexto de productos
     */
    private void validarDatosProducto(ProductoId id, NombreProducto nombre, 
                                    DescripcionProducto descripcion, Precio precio,
                                    Categoria categoria, Stock stock) {
        
        if (id == null) {
            throw new IllegalArgumentException("El ID del producto es requerido");
        }
        
        if (nombre == null || nombre.getValor().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es requerido");
        }
        
        if (descripcion == null || descripcion.getValor().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción del producto es requerida");
        }
        
        if (precio == null || precio.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        
        if (categoria == null) {
            throw new IllegalArgumentException("La categoría es requerida");
        }
        
        if (stock == null || stock.getCantidad() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
    }
    
    private boolean tieneInformacionCompleta() {
        return nombre != null && descripcion != null && precio != null && 
               categoria != null && imagenes.tieneImagenPrincipal();
    }
    
    // Getters
    public ProductoId getId() { return id; }
    public NombreProducto getNombre() { return nombre; }
    public DescripcionProducto getDescripcion() { return descripcion; }
    public Precio getPrecio() { return precio; }
    public Categoria getCategoria() { return categoria; }
    public EstadoProducto getEstado() { return estado; }
    public Stock getStock() { return stock; }
    public Etiquetas getEtiquetas() { return etiquetas; }
    public Imagenes getImagenes() { return imagenes; }
}

/**
 * CONTEXTO ACOTADO 2: GESTIÓN DE INVENTARIO
 * Responsabilidad: Control de stock, reservas y disponibilidad
 * Microservicio: InventarioService
 */
package com.ecommerce.inventario.domain;

/**
 * Entidad de Dominio: Inventario
 * Representa el inventario de un producto específico
 */
public class Inventario {
    
    // Identificador del producto
    private ProductoId productoId;
    
    // Información de stock
    private StockDisponible stockDisponible;
    private StockReservado stockReservado;
    private StockEnTransito stockEnTransito;
    
    // Configuración de inventario
    private StockMinimo stockMinimo;
    private StockMaximo stockMaximo;
    private PuntoReorden puntoReorden;
    
    // Información de proveedores
    private Proveedor proveedor;
    private TiempoEntrega tiempoEntrega;
    
    /**
     * Constructor principal
     */
    public Inventario(ProductoId productoId, StockDisponible stockDisponible,
                     StockMinimo stockMinimo, Proveedor proveedor) {
        
        this.productoId = productoId;
        this.stockDisponible = stockDisponible;
        this.stockReservado = new StockReservado(0);
        this.stockEnTransito = new StockEnTransito(0);
        this.stockMinimo = stockMinimo;
        this.stockMaximo = new StockMaximo(stockDisponible.getCantidad() * 2); // 2x stock actual
        this.puntoReorden = new PuntoReorden(stockMinimo.getCantidad() + 10);
        this.proveedor = proveedor;
        this.tiempoEntrega = new TiempoEntrega(7); // 7 días por defecto
    }
    
    /**
     * Método de dominio: Reservar stock
     * Lógica específica del contexto de inventario
     */
    public void reservarStock(int cantidad) {
        // Validar que haya suficiente stock disponible
        if (stockDisponible.getCantidad() < cantidad) {
            throw new StockInsuficienteException(
                "Stock insuficiente. Disponible: " + stockDisponible.getCantidad() + 
                ", Solicitado: " + cantidad
            );
        }
        
        // Reducir stock disponible
        stockDisponible = stockDisponible.reducir(cantidad);
        
        // Aumentar stock reservado
        stockReservado = stockReservado.aumentar(cantidad);
        
        // Verificar si se debe generar orden de reabastecimiento
        if (debeReabastecer()) {
            generarOrdenReabastecimiento();
        }
    }
    
    /**
     * Método de dominio: Liberar stock reservado
     */
    public void liberarStockReservado(int cantidad) {
        // Validar que haya suficiente stock reservado
        if (stockReservado.getCantidad() < cantidad) {
            throw new IllegalArgumentException("No hay suficiente stock reservado para liberar");
        }
        
        // Reducir stock reservado
        stockReservado = stockReservado.reducir(cantidad);
        
        // Aumentar stock disponible
        stockDisponible = stockDisponible.aumentar(cantidad);
    }
    
    /**
     * Método de dominio: Confirmar stock en tránsito
     */
    public void confirmarStockEnTransito(int cantidad) {
        // Reducir stock en tránsito
        stockEnTransito = stockEnTransito.reducir(cantidad);
        
        // Aumentar stock disponible
        stockDisponible = stockDisponible.aumentar(cantidad);
    }
    
    /**
     * Método de dominio: Recibir stock de proveedor
     */
    public void recibirStock(int cantidad) {
        // Aumentar stock disponible
        stockDisponible = stockDisponible.aumentar(cantidad);
        
        // Actualizar stock máximo si es necesario
        if (stockDisponible.getCantidad() > stockMaximo.getCantidad()) {
            stockMaximo = new StockMaximo(stockDisponible.getCantidad());
        }
    }
    
    /**
     * Método de dominio: Verificar disponibilidad
     */
    public boolean tieneStockDisponible(int cantidad) {
        return stockDisponible.getCantidad() >= cantidad;
    }
    
    /**
     * Método de dominio: Calcular stock total
     */
    public int calcularStockTotal() {
        return stockDisponible.getCantidad() + 
               stockReservado.getCantidad() + 
               stockEnTransito.getCantidad();
    }
    
    /**
     * Método de dominio: Verificar si debe reabastecer
     */
    public boolean debeReabastecer() {
        return stockDisponible.getCantidad() <= puntoReorden.getCantidad();
    }
    
    /**
     * Método de dominio: Generar orden de reabastecimiento
     */
    private void generarOrdenReabastecimiento() {
        int cantidadAOrdenar = stockMaximo.getCantidad() - stockDisponible.getCantidad();
        
        // Publicar evento de dominio
        DomainEventPublisher.publish(new OrdenReabastecimientoGeneradaEvent(
            productoId, cantidadAOrdenar, proveedor, tiempoEntrega
        ));
    }
    
    // Getters
    public ProductoId getProductoId() { return productoId; }
    public StockDisponible getStockDisponible() { return stockDisponible; }
    public StockReservado getStockReservado() { return stockReservado; }
    public StockEnTransito getStockEnTransito() { return stockEnTransito; }
    public boolean tieneStockBajo() { return debeReabastecer(); }
}

/**
 * CONTEXTO ACOTADO 3: GESTIÓN DE PEDIDOS
 * Responsabilidad: Procesamiento de pedidos, estados y facturación
 * Microservicio: PedidoService
 */
package com.ecommerce.pedido.domain;

/**
 * Entidad de Dominio: Pedido
 * Representa un pedido en el contexto de gestión de pedidos
 */
public class Pedido {
    
    // Identificador único del pedido
    private PedidoId id;
    
    // Información del cliente
    private ClienteId clienteId;
    private DireccionEnvio direccionEnvio;
    
    // Items del pedido
    private List<ItemPedido> items;
    
    // Estado del pedido
    private EstadoPedido estado;
    
    // Información de pago
    private MetodoPago metodoPago;
    private EstadoPago estadoPago;
    
    // Información de envío
    private EstadoEnvio estadoEnvio;
    private TrackingEnvio trackingEnvio;
    
    // Fechas importantes
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaConfirmacion;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaEntrega;
    
    /**
     * Constructor principal
     */
    public Pedido(PedidoId id, ClienteId clienteId, DireccionEnvio direccionEnvio,
                  List<ItemPedido> items, MetodoPago metodoPago) {
        
        this.id = id;
        this.clienteId = clienteId;
        this.direccionEnvio = direccionEnvio;
        this.items = new ArrayList<>(items);
        this.metodoPago = metodoPago;
        this.estado = EstadoPedido.CREADO;
        this.estadoPago = EstadoPago.PENDIENTE;
        this.estadoEnvio = EstadoEnvio.PENDIENTE;
        this.fechaCreacion = LocalDateTime.now();
        
        // Validar pedido
        validarPedido();
    }
    
    /**
     * Método de dominio: Confirmar pedido
     * Lógica específica del contexto de pedidos
     */
    public void confirmar() {
        // Validar que el pedido esté en estado válido
        if (estado != EstadoPedido.CREADO) {
            throw new PedidoNoConfirmableException("El pedido no puede ser confirmado en su estado actual");
        }
        
        // Validar que tenga items
        if (items.isEmpty()) {
            throw new PedidoVacioException("El pedido no puede estar vacío");
        }
        
        // Validar que el pago esté procesado
        if (estadoPago != EstadoPago.PROCESADO) {
            throw new PagoNoProcesadoException("El pago debe estar procesado para confirmar el pedido");
        }
        
        // Cambiar estado
        this.estado = EstadoPedido.CONFIRMADO;
        this.fechaConfirmacion = LocalDateTime.now();
        
        // Publicar evento de dominio
        DomainEventPublisher.publish(new PedidoConfirmadoEvent(id, clienteId, items));
    }
    
    /**
     * Método de dominio: Procesar pago
     */
    public void procesarPago(String transaccionId, BigDecimal monto) {
        // Validar que el monto coincida con el total del pedido
        if (monto.compareTo(calcularTotal()) != 0) {
            throw new MontoIncorrectoException("El monto del pago no coincide con el total del pedido");
        }
        
        // Actualizar estado de pago
        this.estadoPago = EstadoPago.PROCESADO;
        
        // Publicar evento de dominio
        DomainEventPublisher.publish(new PagoProcesadoEvent(id, transaccionId, monto));
    }
    
    /**
     * Método de dominio: Enviar pedido
     */
    public void enviar(String numeroTracking) {
        // Validar que el pedido esté confirmado
        if (estado != EstadoPedido.CONFIRMADO) {
            throw new PedidoNoEnviableException("El pedido debe estar confirmado para ser enviado");
        }
        
        // Cambiar estado
        this.estado = EstadoPedido.ENVIADO;
        this.estadoEnvio = EstadoEnvio.ENVIADO;
        this.trackingEnvio = new TrackingEnvio(numeroTracking);
        this.fechaEnvio = LocalDateTime.now();
        
        // Publicar evento de dominio
        DomainEventPublisher.publish(new PedidoEnviadoEvent(id, numeroTracking));
    }
    
    /**
     * Método de dominio: Entregar pedido
     */
    public void entregar() {
        // Validar que el pedido esté enviado
        if (estado != EstadoPedido.ENVIADO) {
            throw new PedidoNoEntregableException("El pedido debe estar enviado para ser entregado");
        }
        
        // Cambiar estado
        this.estado = EstadoPedido.ENTREGADO;
        this.estadoEnvio = EstadoEnvio.ENTREGADO;
        this.fechaEntrega = LocalDateTime.now();
        
        // Publicar evento de dominio
        DomainEventPublisher.publish(new PedidoEntregadoEvent(id, clienteId));
    }
    
    /**
     * Método de dominio: Cancelar pedido
     */
    public void cancelar(String motivo) {
        // Validar que el pedido pueda ser cancelado
        if (estado == EstadoPedido.ENVIADO || estado == EstadoPedido.ENTREGADO) {
            throw new PedidoNoCancelableException("No se puede cancelar un pedido ya enviado");
        }
        
        // Cambiar estado
        this.estado = EstadoPedido.CANCELADO;
        
        // Publicar evento de dominio
        DomainEventPublisher.publish(new PedidoCanceladoEvent(id, motivo));
    }
    
    /**
     * Método de dominio: Calcular total del pedido
     */
    public BigDecimal calcularTotal() {
        return items.stream()
            .map(ItemPedido::calcularSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Método de dominio: Calcular total con impuestos
     */
    public BigDecimal calcularTotalConImpuestos() {
        BigDecimal subtotal = calcularTotal();
        BigDecimal impuestos = subtotal.multiply(new BigDecimal("0.16")); // 16% IVA
        return subtotal.add(impuestos);
    }
    
    /**
     * Método de dominio: Agregar item al pedido
     */
    public void agregarItem(ItemPedido item) {
        // Validar que el pedido no esté confirmado
        if (estado != EstadoPedido.CREADO) {
            throw new PedidoNoModificableException("No se puede modificar un pedido confirmado");
        }
        
        // Verificar si el producto ya existe en el pedido
        Optional<ItemPedido> itemExistente = items.stream()
            .filter(i -> i.getProductoId().equals(item.getProductoId()))
            .findFirst();
        
        if (itemExistente.isPresent()) {
            // Actualizar cantidad del item existente
            itemExistente.get().actualizarCantidad(item.getCantidad());
        } else {
            // Agregar nuevo item
            items.add(item);
        }
    }
    
    /**
     * Método de dominio: Remover item del pedido
     */
    public void removerItem(ProductoId productoId) {
        // Validar que el pedido no esté confirmado
        if (estado != EstadoPedido.CREADO) {
            throw new PedidoNoModificableException("No se puede modificar un pedido confirmado");
        }
        
        items.removeIf(item -> item.getProductoId().equals(productoId));
    }
    
    /**
     * Validaciones específicas del contexto de pedidos
     */
    private void validarPedido() {
        if (clienteId == null) {
            throw new IllegalArgumentException("El cliente es requerido");
        }
        
        if (direccionEnvio == null) {
            throw new IllegalArgumentException("La dirección de envío es requerida");
        }
        
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("El pedido debe tener al menos un item");
        }
        
        if (metodoPago == null) {
            throw new IllegalArgumentException("El método de pago es requerido");
        }
    }
    
    // Getters
    public PedidoId getId() { return id; }
    public ClienteId getClienteId() { return clienteId; }
    public DireccionEnvio getDireccionEnvio() { return direccionEnvio; }
    public List<ItemPedido> getItems() { return new ArrayList<>(items); }
    public EstadoPedido getEstado() { return estado; }
    public EstadoPago getEstadoPago() { return estadoPago; }
    public EstadoEnvio getEstadoEnvio() { return estadoEnvio; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaConfirmacion() { return fechaConfirmacion; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
}

/**
 * CONTEXTO ACOTADO 4: GESTIÓN DE CLIENTES
 * Responsabilidad: Información de clientes, perfiles y preferencias
 * Microservicio: ClienteService
 */
package com.ecommerce.cliente.domain;

/**
 * Entidad de Dominio: Cliente
 * Representa un cliente en el contexto de gestión de clientes
 */
public class Cliente {
    
    // Identificador único del cliente
    private ClienteId id;
    
    // Información personal
    private NombreCliente nombre;
    private Email email;
    private Telefono telefono;
    private FechaNacimiento fechaNacimiento;
    
    // Información de dirección
    private List<Direccion> direcciones;
    private Direccion direccionPrincipal;
    
    // Información de preferencias
    private PreferenciasCliente preferencias;
    private List<Categoria> categoriasInteres;
    
    // Estado del cliente
    private EstadoCliente estado;
    private TipoCliente tipoCliente;
    
    // Información de fidelización
    private PuntosFidelizacion puntosFidelizacion;
    private NivelCliente nivelCliente;
    
    /**
     * Constructor principal
     */
    public Cliente(ClienteId id, NombreCliente nombre, Email email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.estado = EstadoCliente.ACTIVO;
        this.tipoCliente = TipoCliente.REGULAR;
        this.direcciones = new ArrayList<>();
        this.preferencias = new PreferenciasCliente();
        this.categoriasInteres = new ArrayList<>();
        this.puntosFidelizacion = new PuntosFidelizacion(0);
        this.nivelCliente = NivelCliente.BRONCE;
    }
    
    /**
     * Método de dominio: Actualizar información personal
     */
    public void actualizarInformacionPersonal(NombreCliente nuevoNombre, Telefono telefono,
                                             FechaNacimiento fechaNacimiento) {
        this.nombre = nuevoNombre;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        
        // Actualizar nivel de cliente basado en información completa
        actualizarNivelCliente();
    }
    
    /**
     * Método de dominio: Agregar dirección
     */
    public void agregarDireccion(Direccion direccion) {
        direcciones.add(direccion);
        
        // Si es la primera dirección, establecerla como principal
        if (direcciones.size() == 1) {
            this.direccionPrincipal = direccion;
        }
    }
    
    /**
     * Método de dominio: Establecer dirección principal
     */
    public void establecerDireccionPrincipal(Direccion direccion) {
        if (!direcciones.contains(direccion)) {
            throw new DireccionNoEncontradaException("La dirección no pertenece al cliente");
        }
        
        this.direccionPrincipal = direccion;
    }
    
    /**
     * Método de dominio: Actualizar preferencias
     */
    public void actualizarPreferencias(PreferenciasCliente nuevasPreferencias) {
        this.preferencias = nuevasPreferencias;
        
        // Actualizar categorías de interés
        this.categoriasInteres = nuevasPreferencias.getCategoriasInteres();
    }
    
    /**
     * Método de dominio: Agregar puntos de fidelización
     */
    public void agregarPuntos(int puntos) {
        this.puntosFidelizacion = puntosFidelizacion.agregar(puntos);
        
        // Verificar si debe subir de nivel
        verificarCambioNivel();
    }
    
    /**
     * Método de dominio: Canjear puntos
     */
    public void canjearPuntos(int puntos) {
        this.puntosFidelizacion = puntosFidelizacion.canjear(puntos);
    }
    
    /**
     * Método de dominio: Verificar si es cliente premium
     */
    public boolean esClientePremium() {
        return nivelCliente == NivelCliente.PLATINO || nivelCliente == NivelCliente.ORO;
    }
    
    /**
     * Método de dominio: Calcular descuento por fidelización
     */
    public BigDecimal calcularDescuentoFidelizacion() {
        switch (nivelCliente) {
            case BRONCE:
                return new BigDecimal("0.05"); // 5%
            case PLATA:
                return new BigDecimal("0.10"); // 10%
            case ORO:
                return new BigDecimal("0.15"); // 15%
            case PLATINO:
                return new BigDecimal("0.20"); // 20%
            default:
                return BigDecimal.ZERO;
        }
    }
    
    /**
     * Método de dominio: Verificar cambio de nivel
     */
    private void verificarCambioNivel() {
        NivelCliente nuevoNivel = calcularNivelCliente();
        
        if (nuevoNivel != nivelCliente) {
            NivelCliente nivelAnterior = nivelCliente;
            this.nivelCliente = nuevoNivel;
            
            // Publicar evento de dominio
            DomainEventPublisher.publish(new ClienteCambioNivelEvent(id, nivelAnterior, nuevoNivel));
        }
    }
    
    /**
     * Método de dominio: Calcular nivel del cliente
     */
    private NivelCliente calcularNivelCliente() {
        int puntos = puntosFidelizacion.getCantidad();
        
        if (puntos >= 10000) {
            return NivelCliente.PLATINO;
        } else if (puntos >= 5000) {
            return NivelCliente.ORO;
        } else if (puntos >= 1000) {
            return NivelCliente.PLATA;
        } else {
            return NivelCliente.BRONCE;
        }
    }
    
    /**
     * Método de dominio: Actualizar nivel de cliente
     */
    private void actualizarNivelCliente() {
        // Si tiene información completa, puede ser cliente premium
        if (tieneInformacionCompleta()) {
            this.tipoCliente = TipoCliente.PREMIUM;
        }
    }
    
    /**
     * Método de dominio: Verificar si tiene información completa
     */
    public boolean tieneInformacionCompleta() {
        return nombre != null && email != null && telefono != null && 
               fechaNacimiento != null && direccionPrincipal != null;
    }
    
    // Getters
    public ClienteId getId() { return id; }
    public NombreCliente getNombre() { return nombre; }
    public Email getEmail() { return email; }
    public Telefono getTelefono() { return telefono; }
    public FechaNacimiento getFechaNacimiento() { return fechaNacimiento; }
    public List<Direccion> getDirecciones() { return new ArrayList<>(direcciones); }
    public Direccion getDireccionPrincipal() { return direccionPrincipal; }
    public PreferenciasCliente getPreferencias() { return preferencias; }
    public List<Categoria> getCategoriasInteres() { return new ArrayList<>(categoriasInteres); }
    public EstadoCliente getEstado() { return estado; }
    public TipoCliente getTipoCliente() { return tipoCliente; }
    public PuntosFidelizacion getPuntosFidelizacion() { return puntosFidelizacion; }
    public NivelCliente getNivelCliente() { return nivelCliente; }
}

/**
 * MAPEO DE CONTEXTOS ACOTADOS A MICROSERVICIOS
 * 
 * Cada contexto acotado se mapea a un microservicio independiente
 * con su propia base de datos y API
 */

/**
 * Servicio de Aplicación: ProductoService
 * Coordina las operaciones del contexto de productos
 */
@Service
public class ProductoApplicationService {
    
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final DomainEventPublisher eventPublisher;
    
    public ProductoApplicationService(ProductoRepository productoRepository,
                                   CategoriaRepository categoriaRepository,
                                   DomainEventPublisher eventPublisher) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Caso de uso: Crear producto
     */
    public ProductoId crearProducto(CrearProductoCommand command) {
        // Validar comando
        validarComandoCrearProducto(command);
        
        // Crear entidad de dominio
        Producto producto = new Producto(
            new ProductoId(command.getId()),
            new NombreProducto(command.getNombre()),
            new DescripcionProducto(command.getDescripcion()),
            new Precio(command.getPrecio()),
            command.getCategoria(),
            new Stock(command.getStockInicial())
        );
        
        // Guardar en repositorio
        productoRepository.guardar(producto);
        
        // Publicar evento de dominio
        eventPublisher.publish(new ProductoCreadoEvent(producto.getId(), producto.getNombre()));
        
        return producto.getId();
    }
    
    /**
     * Caso de uso: Publicar producto
     */
    public void publicarProducto(String productoId) {
        Producto producto = productoRepository.buscarPorId(new ProductoId(productoId))
            .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado"));
        
        producto.publicar();
        
        productoRepository.guardar(producto);
        
        eventPublisher.publish(new ProductoPublicadoEvent(producto.getId()));
    }
    
    private void validarComandoCrearProducto(CrearProductoCommand command) {
        if (command == null) {
            throw new IllegalArgumentException("El comando no puede ser nulo");
        }
        if (command.getId() == null || command.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del producto es requerido");
        }
        if (command.getNombre() == null || command.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es requerido");
        }
        if (command.getDescripcion() == null || command.getDescripcion().trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción del producto es requerida");
        }
        if (command.getPrecio() == null || command.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        if (command.getCategoria() == null) {
            throw new IllegalArgumentException("La categoría es requerida");
        }
        if (command.getStockInicial() < 0) {
            throw new IllegalArgumentException("El stock inicial no puede ser negativo");
        }
    }
}

/**
 * Servicio de Aplicación: InventarioService
 * Coordina las operaciones del contexto de inventario
 */
@Service
public class InventarioApplicationService {
    
    private final InventarioRepository inventarioRepository;
    private final DomainEventPublisher eventPublisher;
    
    public InventarioApplicationService(InventarioRepository inventarioRepository,
                                      DomainEventPublisher eventPublisher) {
        this.inventarioRepository = inventarioRepository;
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Caso de uso: Reservar stock
     */
    public void reservarStock(ReservarStockCommand command) {
        Inventario inventario = inventarioRepository.buscarPorProductoId(new ProductoId(command.getProductoId()))
            .orElseThrow(() -> new InventarioNoEncontradoException("Inventario no encontrado"));
        
        inventario.reservarStock(command.getCantidad());
        
        inventarioRepository.guardar(inventario);
        
        eventPublisher.publish(new StockReservadoEvent(inventario.getProductoId(), command.getCantidad()));
    }
    
    /**
     * Caso de uso: Recibir stock
     */
    public void recibirStock(RecibirStockCommand command) {
        Inventario inventario = inventarioRepository.buscarPorProductoId(new ProductoId(command.getProductoId()))
            .orElseThrow(() -> new InventarioNoEncontradoException("Inventario no encontrado"));
        
        inventario.recibirStock(command.getCantidad());
        
        inventarioRepository.guardar(inventario);
        
        eventPublisher.publish(new StockRecibidoEvent(inventario.getProductoId(), command.getCantidad()));
    }
}

/**
 * Servicio de Aplicación: PedidoService
 * Coordina las operaciones del contexto de pedidos
 */
@Service
public class PedidoApplicationService {
    
    private final PedidoRepository pedidoRepository;
    private final DomainEventPublisher eventPublisher;
    
    public PedidoApplicationService(PedidoRepository pedidoRepository,
                                  DomainEventPublisher eventPublisher) {
        this.pedidoRepository = pedidoRepository;
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Caso de uso: Crear pedido
     */
    public PedidoId crearPedido(CrearPedidoCommand command) {
        Pedido pedido = new Pedido(
            new PedidoId(command.getId()),
            new ClienteId(command.getClienteId()),
            command.getDireccionEnvio(),
            command.getItems(),
            command.getMetodoPago()
        );
        
        pedidoRepository.guardar(pedido);
        
        eventPublisher.publish(new PedidoCreadoEvent(pedido.getId(), pedido.getClienteId()));
        
        return pedido.getId();
    }
    
    /**
     * Caso de uso: Confirmar pedido
     */
    public void confirmarPedido(String pedidoId) {
        Pedido pedido = pedidoRepository.buscarPorId(new PedidoId(pedidoId))
            .orElseThrow(() -> new PedidoNoEncontradoException("Pedido no encontrado"));
        
        pedido.confirmar();
        
        pedidoRepository.guardar(pedido);
        
        eventPublisher.publish(new PedidoConfirmadoEvent(pedido.getId(), pedido.getClienteId()));
    }
}

/**
 * Servicio de Aplicación: ClienteService
 * Coordina las operaciones del contexto de clientes
 */
@Service
public class ClienteApplicationService {
    
    private final ClienteRepository clienteRepository;
    private final DomainEventPublisher eventPublisher;
    
    public ClienteApplicationService(ClienteRepository clienteRepository,
                                   DomainEventPublisher eventPublisher) {
        this.clienteRepository = clienteRepository;
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Caso de uso: Registrar cliente
     */
    public ClienteId registrarCliente(RegistrarClienteCommand command) {
        Cliente cliente = new Cliente(
            new ClienteId(command.getId()),
            new NombreCliente(command.getNombre()),
            new Email(command.getEmail())
        );
        
        clienteRepository.guardar(cliente);
        
        eventPublisher.publish(new ClienteRegistradoEvent(cliente.getId(), cliente.getEmail()));
        
        return cliente.getId();
    }
    
    /**
     * Caso de uso: Actualizar información del cliente
     */
    public void actualizarInformacionCliente(ActualizarClienteCommand command) {
        Cliente cliente = clienteRepository.buscarPorId(new ClienteId(command.getClienteId()))
            .orElseThrow(() -> new ClienteNoEncontradoException("Cliente no encontrado"));
        
        cliente.actualizarInformacionPersonal(
            new NombreCliente(command.getNombre()),
            new Telefono(command.getTelefono()),
            new FechaNacimiento(command.getFechaNacimiento())
        );
        
        clienteRepository.guardar(cliente);
        
        eventPublisher.publish(new ClienteActualizadoEvent(cliente.getId()));
    }
}
```

## Beneficios de los Contextos Acotados

### ✅ Ventajas

1. **Separación Clara de Responsabilidades**
   - Cada contexto maneja su propio dominio
   - Lógica de negocio específica por contexto
   - Fácil de entender y mantener

2. **Independencia de Microservicios**
   - Cada contexto se mapea a un microservicio
   - Bases de datos independientes
   - Despliegue independiente

3. **Escalabilidad**
   - Escalar contextos específicos según demanda
   - Optimización independiente
   - Uso eficiente de recursos

### ❌ Desafíos

1. **Coordinación Entre Contextos**
   - Gestión de transacciones distribuidas
   - Consistencia eventual
   - Comunicación entre servicios

2. **Duplicación de Datos**
   - Datos compartidos entre contextos
   - Sincronización de información
   - Gestión de referencias

## Resumen

Los contextos acotados proporcionan una base sólida para diseñar microservicios que estén alineados con el dominio del negocio. Cada contexto se mapea naturalmente a un microservicio, asegurando que los servicios sean cohesivos internamente y débilmente acoplados entre sí. 