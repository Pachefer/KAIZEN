# Domain-Driven Design (DDD) en Microservicios

## Definición y Fundamentos

Domain-Driven Design (DDD) es una metodología de diseño de software que se enfoca en crear modelos que reflejen el dominio del negocio. En el contexto de microservicios, DDD proporciona una base sólida para identificar límites de servicios y crear arquitecturas que estén alineadas con las capacidades del negocio.

## Arquitectura de Cebolla (Onion Architecture)

```java
/**
 * ARQUITECTURA DE CEBOLLA (ONION ARCHITECTURE)
 * 
 * Esta arquitectura organiza el código en capas concéntricas:
 * - Dominio (núcleo): Lógica de negocio pura
 * - Aplicación: Casos de uso y coordinación
 * - Infraestructura: Implementaciones técnicas
 * - Framework: Conexiones externas
 */

/**
 * CAPA 1: DOMINIO (NÚCLEO)
 * Contiene las entidades, value objects y reglas de negocio
 * Esta capa NO depende de ninguna otra capa
 */
package com.ecommerce.domain;

/**
 * Entidad de Dominio: Producto
 * Representa un producto en el dominio del negocio
 * Contiene la lógica de negocio relacionada con productos
 */
public class Producto {
    
    // Identificador único del producto
    private ProductoId id;
    
    // Nombre del producto
    private NombreProducto nombre;
    
    // Precio del producto
    private Precio precio;
    
    // Categoría del producto
    private Categoria categoria;
    
    // Estado del producto (activo, inactivo, agotado)
    private EstadoProducto estado;
    
    // Stock disponible
    private Stock stock;
    
    /**
     * Constructor principal
     * Valida que los datos del producto sean correctos
     */
    public Producto(ProductoId id, NombreProducto nombre, Precio precio, 
                   Categoria categoria, Stock stock) {
        // Validar que el ID no sea nulo
        if (id == null) {
            throw new IllegalArgumentException("El ID del producto no puede ser nulo");
        }
        
        // Validar que el nombre no sea nulo
        if (nombre == null) {
            throw new IllegalArgumentException("El nombre del producto no puede ser nulo");            
        }
        
        // Validar que el precio sea válido
        if (precio == null || precio.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        
        // Validar que la categoría no sea nula
        if (categoria == null) {
            throw new IllegalArgumentException("La categoría no puede ser nula");
        }
        
        // Validar que el stock sea válido
        if (stock == null || stock.getCantidad() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        
        // Asignar valores
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.estado = EstadoProducto.ACTIVO; // Estado inicial
    }
    
    /**
     * Método de dominio: Actualizar precio
     * Contiene la lógica de negocio para cambiar el precio
     */
    public void actualizarPrecio(Precio nuevoPrecio) {
        // Validar que el nuevo precio sea válido
        if (nuevoPrecio == null || nuevoPrecio.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El nuevo precio debe ser mayor a cero");
        }
        
        // Validar que el nuevo precio no sea más del 50% menor que el actual
        BigDecimal diferenciaPorcentual = precio.getValor()
            .subtract(nuevoPrecio.getValor())
            .divide(precio.getValor(), 2, RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"));
        
        if (diferenciaPorcentual.compareTo(new BigDecimal("50")) > 0) {
            throw new IllegalArgumentException("No se puede reducir el precio más del 50%");
        }
        
        // Actualizar el precio
        this.precio = nuevoPrecio;
        
        // Si el precio se redujo significativamente, cambiar estado a OFERTA
        if (diferenciaPorcentual.compareTo(new BigDecimal("20")) > 0) {
            this.estado = EstadoProducto.EN_OFERTA;
        }
    }
    
    /**
     * Método de dominio: Reservar stock
     * Contiene la lógica de negocio para reservar productos
     */
    public void reservarStock(int cantidad) {
        // Validar que la cantidad sea positiva
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad a reservar debe ser positiva");
        }
        
        // Validar que haya suficiente stock
        if (stock.getCantidad() < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente para reservar " + cantidad + " unidades");
        }
        
        // Validar que el producto esté activo
        if (estado != EstadoProducto.ACTIVO && estado != EstadoProducto.EN_OFERTA) {
            throw new IllegalArgumentException("No se puede reservar stock de un producto inactivo");
        }
        
        // Reducir el stock
        this.stock = new Stock(stock.getCantidad() - cantidad);
        
        // Si el stock se agota, cambiar estado
        if (this.stock.getCantidad() == 0) {
            this.estado = EstadoProducto.AGOTADO;
        }
    }
    
    /**
     * Método de dominio: Liberar stock reservado
     * Contiene la lógica de negocio para liberar productos reservados
     */
    public void liberarStock(int cantidad) {
        // Validar que la cantidad sea positiva
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad a liberar debe ser positiva");
        }
        
        // Aumentar el stock
        this.stock = new Stock(stock.getCantidad() + cantidad);
        
        // Si el producto estaba agotado y ahora tiene stock, activarlo
        if (estado == EstadoProducto.AGOTADO && stock.getCantidad() > 0) {
            this.estado = EstadoProducto.ACTIVO;
        }
    }
    
    /**
     * Método de dominio: Calcular precio con descuento
     * Contiene la lógica de negocio para aplicar descuentos
     */
    public Precio calcularPrecioConDescuento(Descuento descuento) {
        // Validar que el descuento sea válido
        if (descuento == null) {
            return precio; // Sin descuento
        }
        
        // Validar que el descuento sea aplicable a este producto
        if (!descuento.esAplicable(this)) {
            return precio; // Descuento no aplicable
        }
        
        // Calcular precio con descuento
        BigDecimal precioConDescuento = precio.getValor()
            .multiply(BigDecimal.ONE.subtract(descuento.getPorcentaje().divide(new BigDecimal("100"))));
        
        return new Precio(precioConDescuento);
    }
    
    /**
     * Método de dominio: Verificar si está disponible
     * Contiene la lógica de negocio para verificar disponibilidad
     */
    public boolean estaDisponible() {
        return estado == EstadoProducto.ACTIVO || estado == EstadoProducto.EN_OFERTA;
    }
    
    /**
     * Método de dominio: Verificar si tiene stock suficiente
     * Contiene la lógica de negocio para verificar stock
     */
    public boolean tieneStockSuficiente(int cantidad) {
        return stock.getCantidad() >= cantidad && estaDisponible();
    }
    
    // Getters (solo para acceso de lectura)
    public ProductoId getId() { return id; }
    public NombreProducto getNombre() { return nombre; }
    public Precio getPrecio() { return precio; }
    public Categoria getCategoria() { return categoria; }
    public EstadoProducto getEstado() { return estado; }
    public Stock getStock() { return stock; }
}

/**
 * Value Object: ProductoId
 * Representa el identificador único de un producto
 * Es inmutable y se compara por valor
 */
public class ProductoId {
    private final String valor;
    
    public ProductoId(String valor) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del producto no puede estar vacío");
        }
        this.valor = valor.trim();
    }
    
    public String getValor() { return valor; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ProductoId that = (ProductoId) obj;
        return Objects.equals(valor, that.valor);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
    
    @Override
    public String toString() {
        return valor;
    }
}

/**
 * Value Object: NombreProducto
 * Representa el nombre de un producto
 * Contiene validaciones específicas del dominio
 */
public class NombreProducto {
    private final String valor;
    
    public NombreProducto(String valor) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto no puede estar vacío");
        }
        if (valor.length() > 100) {
            throw new IllegalArgumentException("El nombre del producto no puede exceder 100 caracteres");
        }
        this.valor = valor.trim();
    }
    
    public String getValor() { return valor; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        NombreProducto that = (NombreProducto) obj;
        return Objects.equals(valor, that.valor);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }
    
    @Override
    public String toString() {
        return valor;
    }
}

/**
 * Value Object: Precio
 * Representa el precio de un producto
 * Contiene validaciones y operaciones específicas del dominio
 */
public class Precio {
    private final BigDecimal valor;
    private final Moneda moneda;
    
    public Precio(BigDecimal valor) {
        this(valor, Moneda.USD); // Moneda por defecto
    }
    
    public Precio(BigDecimal valor, Moneda moneda) {
        if (valor == null) {
            throw new IllegalArgumentException("El valor del precio no puede ser nulo");
        }
        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a cero");
        }
        if (moneda == null) {
            throw new IllegalArgumentException("La moneda no puede ser nula");
        }
        
        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
        this.moneda = moneda;
    }
    
    public BigDecimal getValor() { return valor; }
    public Moneda getMoneda() { return moneda; }
    
    /**
     * Método de dominio: Sumar precios
     */
    public Precio sumar(Precio otro) {
        if (!this.moneda.equals(otro.moneda)) {
            throw new IllegalArgumentException("No se pueden sumar precios en diferentes monedas");
        }
        return new Precio(this.valor.add(otro.valor), this.moneda);
    }
    
    /**
     * Método de dominio: Multiplicar precio por cantidad
     */
    public Precio multiplicar(int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser positiva");
        }
        return new Precio(this.valor.multiply(new BigDecimal(cantidad)), this.moneda);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Precio that = (Precio) obj;
        return Objects.equals(valor, that.valor) && moneda == that.moneda;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(valor, moneda);
    }
    
    @Override
    public String toString() {
        return valor + " " + moneda;
    }
}

/**
 * Enum: EstadoProducto
 * Representa los posibles estados de un producto
 */
public enum EstadoProducto {
    ACTIVO("Activo"),
    INACTIVO("Inactivo"),
    AGOTADO("Agotado"),
    EN_OFERTA("En Oferta"),
    DISCONTINUADO("Discontinuado");
    
    private final String descripcion;
    
    EstadoProducto(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() { return descripcion; }
}

/**
 * Value Object: Stock
 * Representa la cantidad de stock disponible
 */
public class Stock {
    private final int cantidad;
    
    public Stock(int cantidad) {
        if (cantidad < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        this.cantidad = cantidad;
    }
    
    public int getCantidad() { return cantidad; }
    
    public boolean estaDisponible() {
        return cantidad > 0;
    }
    
    public boolean esBajo() {
        return cantidad <= 10; // Stock bajo si hay 10 o menos unidades
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Stock that = (Stock) obj;
        return cantidad == that.cantidad;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(cantidad);
    }
    
    @Override
    public String toString() {
        return String.valueOf(cantidad);
    }
}

/**
 * CAPA 2: APLICACIÓN
 * Contiene los casos de uso y la coordinación entre servicios
 * Depende solo del dominio
 */
package com.ecommerce.application;

/**
 * Servicio de Aplicación: Gestión de Productos
 * Coordina las operaciones de productos sin contener lógica de negocio
 */
@Service
public class ProductoApplicationService {
    
    // Repositorio de productos (interfaz del dominio)
    private final ProductoRepository productoRepository;
    
    // Servicio de dominio para descuentos
    private final DescuentoService descuentoService;
    
    // Event publisher para eventos de dominio
    private final DomainEventPublisher eventPublisher;
    
    /**
     * Constructor con inyección de dependencias
     */
    public ProductoApplicationService(ProductoRepository productoRepository,
                                   DescuentoService descuentoService,
                                   DomainEventPublisher eventPublisher) {
        this.productoRepository = productoRepository;
        this.descuentoService = descuentoService;
        this.eventPublisher = eventPublisher;
    }
    
    /**
     * Caso de uso: Crear nuevo producto
     * Coordina la creación sin contener lógica de negocio
     */
    public ProductoId crearProducto(CrearProductoCommand command) {
        // Validar comando de entrada
        validarComandoCrearProducto(command);
        
        // Crear entidad de dominio
        Producto producto = new Producto(
            new ProductoId(command.getId()),
            new NombreProducto(command.getNombre()),
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
     * Caso de uso: Actualizar precio de producto
     * Coordina la actualización sin contener lógica de negocio
     */
    public void actualizarPrecio(ActualizarPrecioCommand command) {
        // Buscar producto
        Producto producto = productoRepository.buscarPorId(new ProductoId(command.getProductoId()))
            .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + command.getProductoId()));
        
        // Crear nuevo precio
        Precio nuevoPrecio = new Precio(command.getNuevoPrecio());
        
        // Delegar lógica de negocio a la entidad de dominio
        producto.actualizarPrecio(nuevoPrecio);
        
        // Guardar cambios
        productoRepository.guardar(producto);
        
        // Publicar evento de dominio
        eventPublisher.publish(new PrecioActualizadoEvent(producto.getId(), producto.getPrecio()));
    }
    
    /**
     * Caso de uso: Reservar stock de producto
     * Coordina la reserva sin contener lógica de negocio
     */
    public void reservarStock(ReservarStockCommand command) {
        // Buscar producto
        Producto producto = productoRepository.buscarPorId(new ProductoId(command.getProductoId()))
            .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + command.getProductoId()));
        
        // Delegar lógica de negocio a la entidad de dominio
        producto.reservarStock(command.getCantidad());
        
        // Guardar cambios
        productoRepository.guardar(producto);
        
        // Publicar evento de dominio
        eventPublisher.publish(new StockReservadoEvent(producto.getId(), command.getCantidad()));
        
        // Si el stock está bajo, publicar evento de alerta
        if (producto.getStock().esBajo()) {
            eventPublisher.publish(new StockBajoEvent(producto.getId(), producto.getStock().getCantidad()));
        }
    }
    
    /**
     * Caso de uso: Obtener producto con precio calculado
     * Coordina la obtención y cálculo de precios
     */
    public ProductoDTO obtenerProductoConPrecio(String productoId, String codigoDescuento) {
        // Buscar producto
        Producto producto = productoRepository.buscarPorId(new ProductoId(productoId))
            .orElseThrow(() -> new ProductoNoEncontradoException("Producto no encontrado: " + productoId));
        
        // Calcular precio con descuento si se proporciona código
        Precio precioFinal = producto.getPrecio();
        if (codigoDescuento != null && !codigoDescuento.isEmpty()) {
            Descuento descuento = descuentoService.obtenerDescuento(codigoDescuento);
            precioFinal = producto.calcularPrecioConDescuento(descuento);
        }
        
        // Convertir a DTO
        return new ProductoDTO(
            producto.getId().getValor(),
            producto.getNombre().getValor(),
            precioFinal.getValor(),
            producto.getCategoria(),
            producto.getEstado(),
            producto.getStock().getCantidad(),
            producto.estaDisponible()
        );
    }
    
    /**
     * Validación del comando de crear producto
     */
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
 * Comandos de aplicación (Command Pattern)
 * Representan las intenciones de los usuarios
 */
public class CrearProductoCommand {
    private final String id;
    private final String nombre;
    private final BigDecimal precio;
    private final Categoria categoria;
    private final int stockInicial;
    
    public CrearProductoCommand(String id, String nombre, BigDecimal precio, 
                               Categoria categoria, int stockInicial) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stockInicial = stockInicial;
    }
    
    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public BigDecimal getPrecio() { return precio; }
    public Categoria getCategoria() { return categoria; }
    public int getStockInicial() { return stockInicial; }
}

public class ActualizarPrecioCommand {
    private final String productoId;
    private final BigDecimal nuevoPrecio;
    
    public ActualizarPrecioCommand(String productoId, BigDecimal nuevoPrecio) {
        this.productoId = productoId;
        this.nuevoPrecio = nuevoPrecio;
    }
    
    // Getters
    public String getProductoId() { return productoId; }
    public BigDecimal getNuevoPrecio() { return nuevoPrecio; }
}

public class ReservarStockCommand {
    private final String productoId;
    private final int cantidad;
    
    public ReservarStockCommand(String productoId, int cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }
    
    // Getters
    public String getProductoId() { return productoId; }
    public int getCantidad() { return cantidad; }
}

/**
 * DTOs para transferencia de datos
 * No contienen lógica de negocio
 */
public class ProductoDTO {
    private final String id;
    private final String nombre;
    private final BigDecimal precio;
    private final Categoria categoria;
    private final EstadoProducto estado;
    private final int stock;
    private final boolean disponible;
    
    public ProductoDTO(String id, String nombre, BigDecimal precio, 
                      Categoria categoria, EstadoProducto estado, 
                      int stock, boolean disponible) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.estado = estado;
        this.stock = stock;
        this.disponible = disponible;
    }
    
    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public BigDecimal getPrecio() { return precio; }
    public Categoria getCategoria() { return categoria; }
    public EstadoProducto getEstado() { return estado; }
    public int getStock() { return stock; }
    public boolean isDisponible() { return disponible; }
}

/**
 * CAPA 3: INFRAESTRUCTURA
 * Contiene las implementaciones técnicas
 * Depende de la aplicación y el dominio
 */
package com.ecommerce.infrastructure;

/**
 * Repositorio de Productos - Implementación JPA
 * Implementa la interfaz del dominio usando JPA
 */
@Repository
public class ProductoRepositoryJPA implements ProductoRepository {
    
    // Repositorio de Spring Data JPA
    private final ProductoJpaRepository jpaRepository;
    
    // Mapper para convertir entre entidades de dominio y JPA
    private final ProductoMapper mapper;
    
    /**
     * Constructor con inyección de dependencias
     */
    public ProductoRepositoryJPA(ProductoJpaRepository jpaRepository, ProductoMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    /**
     * Guardar producto en la base de datos
     */
    @Override
    public void guardar(Producto producto) {
        // Convertir entidad de dominio a entidad JPA
        ProductoEntity entity = mapper.toEntity(producto);
        
        // Guardar usando JPA
        ProductoEntity savedEntity = jpaRepository.save(entity);
        
        // Actualizar el ID si es una nueva entidad
        if (producto.getId() == null) {
            producto.setId(new ProductoId(savedEntity.getId()));
        }
    }
    
    /**
     * Buscar producto por ID
     */
    @Override
    public Optional<Producto> buscarPorId(ProductoId id) {
        // Buscar en la base de datos
        Optional<ProductoEntity> entity = jpaRepository.findById(id.getValor());
        
        // Convertir a entidad de dominio si existe
        return entity.map(mapper::toDomain);
    }
    
    /**
     * Buscar productos por categoría
     */
    @Override
    public List<Producto> buscarPorCategoria(Categoria categoria) {
        // Buscar en la base de datos
        List<ProductoEntity> entities = jpaRepository.findByCategoria(categoria);
        
        // Convertir a entidades de dominio
        return entities.stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    /**
     * Buscar productos disponibles
     */
    @Override
    public List<Producto> buscarDisponibles() {
        // Buscar en la base de datos
        List<ProductoEntity> entities = jpaRepository.findByEstadoIn(
            Arrays.asList(EstadoProducto.ACTIVO, EstadoProducto.EN_OFERTA)
        );
        
        // Convertir a entidades de dominio
        return entities.stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    /**
     * Eliminar producto
     */
    @Override
    public void eliminar(ProductoId id) {
        jpaRepository.deleteById(id.getValor());
    }
}

/**
 * Entidad JPA para Producto
 * Representa la tabla en la base de datos
 */
@Entity
@Table(name = "productos")
public class ProductoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", nullable = false)
    private Categoria categoria;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoProducto estado;
    
    @Column(name = "stock", nullable = false)
    private int stock;
    
    @Column(name = "moneda", nullable = false)
    @Enumerated(EnumType.STRING)
    private Moneda moneda;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Constructor por defecto para JPA
    protected ProductoEntity() {}
    
    // Constructor principal
    public ProductoEntity(String id, String nombre, BigDecimal precio, 
                         Categoria categoria, EstadoProducto estado, 
                         int stock, Moneda moneda) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.estado = estado;
        this.stock = stock;
        this.moneda = moneda;
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // Getters y Setters para JPA
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    
    public EstadoProducto getEstado() { return estado; }
    public void setEstado(EstadoProducto estado) { this.estado = estado; }
    
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    
    public Moneda getMoneda() { return moneda; }
    public void setMoneda(Moneda moneda) { this.moneda = moneda; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    /**
     * Método de JPA para actualizar fecha de modificación
     */
    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}

/**
 * Mapper para convertir entre entidades de dominio y JPA
 * Implementa el patrón Mapper
 */
@Component
public class ProductoMapper {
    
    /**
     * Convertir entidad de dominio a entidad JPA
     */
    public ProductoEntity toEntity(Producto producto) {
        if (producto == null) {
            return null;
        }
        
        ProductoEntity entity = new ProductoEntity(
            producto.getId().getValor(),
            producto.getNombre().getValor(),
            producto.getPrecio().getValor(),
            producto.getCategoria(),
            producto.getEstado(),
            producto.getStock().getCantidad(),
            producto.getPrecio().getMoneda()
        );
        
        return entity;
    }
    
    /**
     * Convertir entidad JPA a entidad de dominio
     */
    public Producto toDomain(ProductoEntity entity) {
        if (entity == null) {
            return null;
        }
        
        Producto producto = new Producto(
            new ProductoId(entity.getId()),
            new NombreProducto(entity.getNombre()),
            new Precio(entity.getPrecio(), entity.getMoneda()),
            entity.getCategoria(),
            new Stock(entity.getStock())
        );
        
        return producto;
    }
}

/**
 * Repositorio JPA de Spring Data
 * Define los métodos de consulta
 */
@Repository
public interface ProductoJpaRepository extends JpaRepository<ProductoEntity, String> {
    
    /**
     * Buscar productos por categoría
     */
    List<ProductoEntity> findByCategoria(Categoria categoria);
    
    /**
     * Buscar productos por estado
     */
    List<ProductoEntity> findByEstado(EstadoProducto estado);
    
    /**
     * Buscar productos por múltiples estados
     */
    List<ProductoEntity> findByEstadoIn(List<EstadoProducto> estados);
    
    /**
     * Buscar productos con stock bajo
     */
    @Query("SELECT p FROM ProductoEntity p WHERE p.stock <= 10")
    List<ProductoEntity> findProductosConStockBajo();
    
    /**
     * Buscar productos por rango de precios
     */
    List<ProductoEntity> findByPrecioBetween(BigDecimal precioMin, BigDecimal precioMax);
    
    /**
     * Contar productos por categoría
     */
    @Query("SELECT p.categoria, COUNT(p) FROM ProductoEntity p GROUP BY p.categoria")
    List<Object[]> countByCategoria();
}

## Beneficios de la Arquitectura de Cebolla

### ✅ Ventajas

1. **Separación de Responsabilidades**
   - Cada capa tiene una responsabilidad específica
   - Fácil de entender y mantener
   - Cambios en una capa no afectan otras

2. **Independencia del Dominio**
   - La lógica de negocio está aislada
   - No depende de tecnologías específicas
   - Fácil de probar

3. **Flexibilidad**
   - Fácil cambiar implementaciones
   - Fácil agregar nuevas funcionalidades
   - Fácil migrar tecnologías

### ❌ Desventajas

1. **Complejidad Inicial**
   - Más código para escribir
   - Más abstracciones para entender
   - Curva de aprendizaje

2. **Overhead**
   - Más clases e interfaces
   - Más mapeo entre capas
   - Posible impacto en performance

## Resumen

La Arquitectura de Cebolla es un patrón fundamental en DDD que organiza el código en capas concéntricas, manteniendo la lógica de negocio en el centro y las preocupaciones técnicas en las capas externas. Esto resulta en sistemas más mantenibles, testeables y flexibles. 