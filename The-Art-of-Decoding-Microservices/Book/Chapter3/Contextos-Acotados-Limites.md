# Contextos Acotados y Límites de Servicios - Ejemplos Prácticos

## 1. Definición de Contextos Acotados

### Contexto Acotado: Gestión de Pedidos (Order Management)

```java
// Ubicación: src/main/java/com/example/ordercontext/
// Este contexto maneja todo lo relacionado con pedidos, incluyendo creación, modificación y seguimiento

// Entidad raíz del contexto de pedidos
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Identificador único del pedido
    
    @Embedded
    private OrderNumber orderNumber; // Número único del pedido (objeto de valor)
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status; // Estado actual del pedido
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items; // Items del pedido (entidades hijas)
    
    @Embedded
    private CustomerInfo customerInfo; // Información del cliente (objeto de valor)
    
    @Embedded
    private ShippingAddress shippingAddress; // Dirección de envío (objeto de valor)
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount; // Monto total del pedido
    
    @Column(name = "created_at")
    private LocalDateTime createdAt; // Fecha de creación
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Fecha de última actualización
    
    // Constructor privado para forzar el uso de factory methods
    private Order() {
        this.items = new ArrayList<>(); // Inicializa la lista de items
        this.status = OrderStatus.DRAFT; // Estado inicial: borrador
    }
    
    // Factory method para crear un nuevo pedido
    public static Order createOrder(OrderNumber orderNumber, 
                                  CustomerInfo customerInfo, 
                                  ShippingAddress shippingAddress) {
        Order order = new Order(); // Crea nueva instancia
        order.orderNumber = orderNumber; // Asigna el número de pedido
        order.customerInfo = customerInfo; // Asigna información del cliente
        order.shippingAddress = shippingAddress; // Asigna dirección de envío
        order.createdAt = LocalDateTime.now(); // Establece fecha de creación
        order.updatedAt = LocalDateTime.now(); // Establece fecha de actualización
        return order; // Retorna el pedido creado
    }
    
    // Método de dominio para agregar un item al pedido
    public void addItem(Product product, int quantity) {
        // Validación de dominio: no se pueden agregar items a pedidos confirmados
        if (status == OrderStatus.CONFIRMED || status == OrderStatus.SHIPPED) {
            throw new OrderDomainException("No se pueden modificar pedidos confirmados o enviados");
        }
        
        // Validación de dominio: cantidad debe ser positiva
        if (quantity <= 0) {
            throw new OrderDomainException("La cantidad debe ser mayor a cero");
        }
        
        // Buscar si el producto ya existe en el pedido
        Optional<OrderItem> existingItem = items.stream()
            .filter(item -> item.getProductId().equals(product.getId()))
            .findFirst(); // Busca item existente
        
        if (existingItem.isPresent()) {
            // Si existe, actualizar la cantidad
            existingItem.get().updateQuantity(quantity); // Actualiza cantidad
        } else {
            // Si no existe, crear nuevo item
            OrderItem newItem = OrderItem.create(product, quantity); // Crea nuevo item
            items.add(newItem); // Agrega a la lista
        }
        
        recalculateTotal(); // Recalcula el total
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método de dominio para confirmar el pedido
    public void confirm() {
        // Validación de dominio: solo se pueden confirmar pedidos en borrador
        if (status != OrderStatus.DRAFT) {
            throw new OrderDomainException("Solo se pueden confirmar pedidos en borrador");
        }
        
        // Validación de dominio: el pedido debe tener al menos un item
        if (items.isEmpty()) {
            throw new OrderDomainException("No se puede confirmar un pedido sin items");
        }
        
        // Validación de dominio: todos los items deben tener stock disponible
        validateStockAvailability(); // Valida disponibilidad de stock
        
        status = OrderStatus.CONFIRMED; // Cambia estado a confirmado
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método de dominio para cancelar el pedido
    public void cancel() {
        // Validación de dominio: no se pueden cancelar pedidos ya enviados
        if (status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED) {
            throw new OrderDomainException("No se pueden cancelar pedidos ya enviados");
        }
        
        status = OrderStatus.CANCELLED; // Cambia estado a cancelado
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método privado para validar disponibilidad de stock
    private void validateStockAvailability() {
        for (OrderItem item : items) {
            if (!item.isStockAvailable()) { // Verifica stock para cada item
                throw new OrderDomainException("Stock insuficiente para el producto: " + item.getProductName());
            }
        }
    }
    
    // Método privado para recalcular el total
    private void recalculateTotal() {
        totalAmount = items.stream()
            .map(OrderItem::getSubtotal) // Obtiene subtotal de cada item
            .reduce(BigDecimal.ZERO, BigDecimal::add); // Suma todos los subtotales
    }
    
    // Getters necesarios para el dominio
    public OrderNumber getOrderNumber() { return orderNumber; }
    public OrderStatus getStatus() { return status; }
    public List<OrderItem> getItems() { return Collections.unmodifiableList(items); }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public boolean isConfirmed() { return status == OrderStatus.CONFIRMED; }
    public boolean isCancelled() { return status == OrderStatus.CANCELLED; }
}

// Objeto de valor para el número de pedido
@Embeddable
public class OrderNumber {
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String value; // Valor del número de pedido
    
    // Constructor privado
    private OrderNumber() {}
    
    // Factory method para crear número de pedido
    public static OrderNumber of(String value) {
        // Validación: formato debe ser ORD-YYYYMMDD-XXXX
        if (!value.matches("ORD-\\d{8}-\\d{4}")) {
            throw new IllegalArgumentException("Formato de número de pedido inválido");
        }
        
        OrderNumber orderNumber = new OrderNumber();
        orderNumber.value = value; // Asigna el valor validado
        return orderNumber;
    }
    
    // Factory method para generar número automáticamente
    public static OrderNumber generate() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")); // Fecha actual
        String random = String.format("%04d", new Random().nextInt(10000)); // Número aleatorio
        return of("ORD-" + date + "-" + random); // Genera el número
    }
    
    public String getValue() { return value; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderNumber that = (OrderNumber) o;
        return Objects.equals(value, that.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
```

### Contexto Acotado: Gestión de Productos (Product Management)

```java
// Ubicación: src/main/java/com/example/productcontext/
// Este contexto maneja todo lo relacionado con productos, catálogos y precios

// Entidad raíz del contexto de productos
@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Identificador único del producto
    
    @Embedded
    private ProductCode productCode; // Código único del producto (objeto de valor)
    
    @Column(name = "name", nullable = false)
    private String name; // Nombre del producto
    
    @Column(name = "description")
    private String description; // Descripción del producto
    
    @Embedded
    private Price price; // Precio del producto (objeto de valor)
    
    @Enumerated(EnumType.STRING)
    private ProductStatus status; // Estado del producto (activo, inactivo, descontinuado)
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category; // Categoría del producto
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity; // Cantidad en stock
    
    @Column(name = "min_stock_level")
    private Integer minStockLevel; // Nivel mínimo de stock
    
    @Column(name = "created_at")
    private LocalDateTime createdAt; // Fecha de creación
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // Fecha de última actualización
    
    // Constructor privado
    private Product() {}
    
    // Factory method para crear un nuevo producto
    public static Product createProduct(ProductCode productCode, 
                                      String name, 
                                      String description, 
                                      Price price, 
                                      Category category) {
        Product product = new Product(); // Crea nueva instancia
        product.productCode = productCode; // Asigna código del producto
        product.name = name; // Asigna nombre
        product.description = description; // Asigna descripción
        product.price = price; // Asigna precio
        product.category = category; // Asigna categoría
        product.status = ProductStatus.ACTIVE; // Estado inicial: activo
        product.stockQuantity = 0; // Stock inicial: 0
        product.minStockLevel = 10; // Nivel mínimo por defecto
        product.createdAt = LocalDateTime.now(); // Fecha de creación
        product.updatedAt = LocalDateTime.now(); // Fecha de actualización
        return product; // Retorna el producto creado
    }
    
    // Método de dominio para actualizar el precio
    public void updatePrice(Price newPrice) {
        // Validación de dominio: el precio no puede ser negativo
        if (newPrice.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new ProductDomainException("El precio no puede ser negativo");
        }
        
        price = newPrice; // Actualiza el precio
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método de dominio para actualizar el stock
    public void updateStock(int newQuantity) {
        // Validación de dominio: el stock no puede ser negativo
        if (newQuantity < 0) {
            throw new ProductDomainException("El stock no puede ser negativo");
        }
        
        stockQuantity = newQuantity; // Actualiza el stock
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método de dominio para reservar stock
    public boolean reserveStock(int quantity) {
        // Validación de dominio: cantidad debe ser positiva
        if (quantity <= 0) {
            throw new ProductDomainException("La cantidad debe ser mayor a cero");
        }
        
        // Validación de dominio: debe haber stock suficiente
        if (stockQuantity < quantity) {
            return false; // No hay stock suficiente
        }
        
        stockQuantity -= quantity; // Reduce el stock
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
        return true; // Reserva exitosa
    }
    
    // Método de dominio para liberar stock reservado
    public void releaseStock(int quantity) {
        // Validación de dominio: cantidad debe ser positiva
        if (quantity <= 0) {
            throw new ProductDomainException("La cantidad debe ser mayor a cero");
        }
        
        stockQuantity += quantity; // Aumenta el stock
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método de dominio para descontinuar el producto
    public void discontinue() {
        status = ProductStatus.DISCONTINUED; // Cambia estado a descontinuado
        updatedAt = LocalDateTime.now(); // Actualiza fecha de modificación
    }
    
    // Método de dominio para verificar si está en stock
    public boolean isInStock() {
        return stockQuantity > 0; // Verifica si hay stock disponible
    }
    
    // Método de dominio para verificar si está bajo stock
    public boolean isLowStock() {
        return stockQuantity <= minStockLevel; // Verifica si está bajo el nivel mínimo
    }
    
    // Getters necesarios para el dominio
    public ProductCode getProductCode() { return productCode; }
    public String getName() { return name; }
    public Price getPrice() { return price; }
    public ProductStatus getStatus() { return status; }
    public Integer getStockQuantity() { return stockQuantity; }
    public boolean isActive() { return status == ProductStatus.ACTIVE; }
}

// Objeto de valor para el código de producto
@Embeddable
public class ProductCode {
    
    @Column(name = "product_code", unique = true, nullable = false)
    private String value; // Valor del código de producto
    
    // Constructor privado
    private ProductCode() {}
    
    // Factory method para crear código de producto
    public static ProductCode of(String value) {
        // Validación: formato debe ser PRD-XXXXX
        if (!value.matches("PRD-\\d{5}")) {
            throw new IllegalArgumentException("Formato de código de producto inválido");
        }
        
        ProductCode productCode = new ProductCode();
        productCode.value = value; // Asigna el valor validado
        return productCode;
    }
    
    // Factory method para generar código automáticamente
    public static ProductCode generate() {
        String random = String.format("%05d", new Random().nextInt(100000)); // Número aleatorio
        return of("PRD-" + random); // Genera el código
    }
    
    public String getValue() { return value; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductCode that = (ProductCode) o;
        return Objects.equals(value, that.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
```

## 2. Mapeo de Contextos (Context Mapping)

### Relaciones entre Contextos

```java
// Ubicación: src/main/java/com/example/shared/
// Este paquete contiene las definiciones compartidas entre contextos

// Contexto Compartido (Shared Kernel) - Definiciones comunes
public class SharedKernel {
    
    // Identificadores compartidos
    public static class CustomerId {
        private final Long value;
        
        public CustomerId(Long value) {
            this.value = value; // Asigna el valor
        }
        
        public Long getValue() { return value; }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            CustomerId that = (CustomerId) o;
            return Objects.equals(value, that.value);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(value);
        }
    }
    
    // Moneda compartida
    public static class Currency {
        private final String code; // Código de moneda (USD, EUR, etc.)
        private final String symbol; // Símbolo de moneda ($, €, etc.)
        
        public Currency(String code, String symbol) {
            this.code = code; // Asigna código
            this.symbol = symbol; // Asigna símbolo
        }
        
        public String getCode() { return code; }
        public String getSymbol() { return symbol; }
        
        // Monedas predefinidas
        public static final Currency USD = new Currency("USD", "$");
        public static final Currency EUR = new Currency("EUR", "€");
        public static final Currency MXN = new Currency("MXN", "$");
    }
}

// Anticorruption Layer - Capa para traducir entre contextos
@Component
public class OrderProductAnticorruptionLayer {
    
    private final ProductServiceClient productServiceClient; // Cliente del servicio de productos
    private final ProductMapper productMapper; // Mapeador de productos
    
    // Constructor con inyección de dependencias
    public OrderProductAnticorruptionLayer(ProductServiceClient productServiceClient, 
                                         ProductMapper productMapper) {
        this.productServiceClient = productServiceClient; // Inyecta cliente
        this.productMapper = productMapper; // Inyecta mapeador
    }
    
    // Método para obtener información de producto para el contexto de pedidos
    public OrderProductInfo getProductInfoForOrder(ProductId productId) {
        // Obtiene datos del servicio de productos
        ProductDTO productDTO = productServiceClient.getProduct(productId.getValue()); // Llama al servicio
        
        // Traduce al modelo del contexto de pedidos
        return productMapper.toOrderProductInfo(productDTO); // Mapea los datos
    }
    
    // Método para verificar disponibilidad de stock
    public boolean checkStockAvailability(ProductId productId, int quantity) {
        // Obtiene información de stock del servicio de productos
        StockInfoDTO stockInfo = productServiceClient.getStockInfo(productId.getValue()); // Llama al servicio
        
        // Traduce y valida en el contexto de pedidos
        return stockInfo.getAvailableQuantity() >= quantity; // Verifica disponibilidad
    }
    
    // Método para reservar stock
    public boolean reserveStock(ProductId productId, int quantity) {
        try {
            // Llama al servicio de productos para reservar stock
            productServiceClient.reserveStock(productId.getValue(), quantity); // Reserva stock
            return true; // Reserva exitosa
        } catch (ProductServiceException e) {
            // Maneja errores del servicio de productos
            return false; // Reserva fallida
        }
    }
}

// Mapeador para traducir entre modelos de diferentes contextos
@Component
public class ProductMapper {
    
    // Mapea de ProductDTO (contexto de productos) a OrderProductInfo (contexto de pedidos)
    public OrderProductInfo toOrderProductInfo(ProductDTO productDTO) {
        return OrderProductInfo.builder() // Usa builder pattern
            .productId(ProductId.of(productDTO.getId())) // Mapea ID
            .name(productDTO.getName()) // Mapea nombre
            .price(Price.of(productDTO.getPrice(), productDTO.getCurrency())) // Mapea precio
            .isActive(productDTO.getStatus().equals("ACTIVE")) // Mapea estado
            .build(); // Construye el objeto
    }
    
    // Mapea de OrderProductInfo (contexto de pedidos) a ProductDTO (contexto de productos)
    public ProductDTO toProductDTO(OrderProductInfo orderProductInfo) {
        return ProductDTO.builder() // Usa builder pattern
            .id(orderProductInfo.getProductId().getValue()) // Mapea ID
            .name(orderProductInfo.getName()) // Mapea nombre
            .price(orderProductInfo.getPrice().getAmount()) // Mapea precio
            .currency(orderProductInfo.getPrice().getCurrency().getCode()) // Mapea moneda
            .status(orderProductInfo.isActive() ? "ACTIVE" : "INACTIVE") // Mapea estado
            .build(); // Construye el objeto
    }
}

// Cliente para comunicarse con el servicio de productos
@Component
public class ProductServiceClient {
    
    private final RestTemplate restTemplate; // Cliente HTTP
    private final String productServiceUrl; // URL del servicio de productos
    
    // Constructor con inyección de dependencias
    public ProductServiceClient(RestTemplate restTemplate, 
                              @Value("${services.product.url}") String productServiceUrl) {
        this.restTemplate = restTemplate; // Inyecta cliente HTTP
        this.productServiceUrl = productServiceUrl; // Inyecta URL del servicio
    }
    
    // Método para obtener un producto
    public ProductDTO getProduct(Long productId) {
        try {
            // Llama al endpoint del servicio de productos
            ResponseEntity<ProductDTO> response = restTemplate.getForEntity(
                productServiceUrl + "/products/" + productId, 
                ProductDTO.class
            ); // Realiza petición GET
            
            return response.getBody(); // Retorna el producto
        } catch (RestClientException e) {
            // Maneja errores de comunicación
            throw new ProductServiceException("Error al obtener producto: " + productId, e);
        }
    }
    
    // Método para obtener información de stock
    public StockInfoDTO getStockInfo(Long productId) {
        try {
            // Llama al endpoint de stock del servicio de productos
            ResponseEntity<StockInfoDTO> response = restTemplate.getForEntity(
                productServiceUrl + "/products/" + productId + "/stock", 
                StockInfoDTO.class
            ); // Realiza petición GET
            
            return response.getBody(); // Retorna información de stock
        } catch (RestClientException e) {
            // Maneja errores de comunicación
            throw new ProductServiceException("Error al obtener stock: " + productId, e);
        }
    }
    
    // Método para reservar stock
    public void reserveStock(Long productId, int quantity) {
        try {
            // Llama al endpoint para reservar stock
            restTemplate.postForEntity(
                productServiceUrl + "/products/" + productId + "/stock/reserve",
                new StockReservationRequest(quantity),
                Void.class
            ); // Realiza petición POST
        } catch (RestClientException e) {
            // Maneja errores de comunicación
            throw new ProductServiceException("Error al reservar stock: " + productId, e);
        }
    }
}
```

## 3. Límites de Servicios

### Definición de Límites

```java
// Ubicación: src/main/java/com/example/ordercontext/boundaries/
// Este paquete define los límites del contexto de pedidos

// Límite del contexto de pedidos - define qué se expone al exterior
public class OrderContextBoundary {
    
    // Comandos que puede recibir el contexto
    public interface Commands {
        // Comando para crear un pedido
        CreateOrderCommand createOrder(CreateOrderRequest request);
        
        // Comando para agregar item a un pedido
        AddItemCommand addItem(AddItemRequest request);
        
        // Comando para confirmar un pedido
        ConfirmOrderCommand confirmOrder(ConfirmOrderRequest request);
        
        // Comando para cancelar un pedido
        CancelOrderCommand cancelOrder(CancelOrderRequest request);
    }
    
    // Consultas que puede responder el contexto
    public interface Queries {
        // Consulta para obtener un pedido por número
        OrderDTO getOrderByNumber(String orderNumber);
        
        // Consulta para obtener pedidos de un cliente
        List<OrderDTO> getOrdersByCustomer(Long customerId);
        
        // Consulta para obtener pedidos por estado
        List<OrderDTO> getOrdersByStatus(String status);
    }
    
    // Eventos que puede publicar el contexto
    public interface Events {
        // Evento cuando se crea un pedido
        OrderCreatedEvent orderCreated(Order order);
        
        // Evento cuando se confirma un pedido
        OrderConfirmedEvent orderConfirmed(Order order);
        
        // Evento cuando se cancela un pedido
        OrderCancelledEvent orderCancelled(Order order);
        
        // Evento cuando se agrega un item
        ItemAddedEvent itemAdded(Order order, OrderItem item);
    }
}

// Implementación del límite del contexto
@Service
@Transactional
public class OrderContextBoundaryImpl implements OrderContextBoundary.Commands, 
                                                OrderContextBoundary.Queries {
    
    private final OrderRepository orderRepository; // Repositorio de pedidos
    private final OrderDomainService orderDomainService; // Servicio de dominio
    private final OrderProductAnticorruptionLayer anticorruptionLayer; // Capa anticorrupción
    private final ApplicationEventPublisher eventPublisher; // Publicador de eventos
    
    // Constructor con inyección de dependencias
    public OrderContextBoundaryImpl(OrderRepository orderRepository,
                                  OrderDomainService orderDomainService,
                                  OrderProductAnticorruptionLayer anticorruptionLayer,
                                  ApplicationEventPublisher eventPublisher) {
        this.orderRepository = orderRepository; // Inyecta repositorio
        this.orderDomainService = orderDomainService; // Inyecta servicio de dominio
        this.anticorruptionLayer = anticorruptionLayer; // Inyecta capa anticorrupción
        this.eventPublisher = eventPublisher; // Inyecta publicador de eventos
    }
    
    // Implementación del comando para crear pedido
    @Override
    public CreateOrderCommand createOrder(CreateOrderRequest request) {
        // Validar request
        validateCreateOrderRequest(request); // Valida la petición
        
        // Crear número de pedido
        OrderNumber orderNumber = OrderNumber.generate(); // Genera número único
        
        // Crear información del cliente
        CustomerInfo customerInfo = CustomerInfo.of(
            request.getCustomerId(), 
            request.getCustomerName(), 
            request.getCustomerEmail()
        ); // Crea info del cliente
        
        // Crear dirección de envío
        ShippingAddress shippingAddress = ShippingAddress.of(
            request.getStreet(), 
            request.getCity(), 
            request.getPostalCode()
        ); // Crea dirección de envío
        
        // Crear pedido usando el servicio de dominio
        Order order = orderDomainService.createOrder(
            orderNumber, 
            customerInfo, 
            shippingAddress
        ); // Crea el pedido
        
        // Guardar pedido
        Order savedOrder = orderRepository.save(order); // Guarda en repositorio
        
        // Publicar evento
        eventPublisher.publishEvent(new OrderCreatedEvent(savedOrder)); // Publica evento
        
        // Retornar comando exitoso
        return CreateOrderCommand.success(savedOrder.getOrderNumber().getValue()); // Retorna resultado
    }
    
    // Implementación del comando para agregar item
    @Override
    public AddItemCommand addItem(AddItemRequest request) {
        // Buscar pedido
        Order order = findOrderByNumber(request.getOrderNumber()); // Busca el pedido
        
        // Obtener información del producto desde el contexto de productos
        OrderProductInfo productInfo = anticorruptionLayer.getProductInfoForOrder(
            ProductId.of(request.getProductId())
        ); // Obtiene info del producto
        
        // Verificar disponibilidad de stock
        boolean stockAvailable = anticorruptionLayer.checkStockAvailability(
            ProductId.of(request.getProductId()), 
            request.getQuantity()
        ); // Verifica stock
        
        if (!stockAvailable) {
            return AddItemCommand.failure("Stock insuficiente"); // Retorna error
        }
        
        // Agregar item al pedido
        order.addItem(productInfo, request.getQuantity()); // Agrega el item
        
        // Guardar pedido
        Order savedOrder = orderRepository.save(order); // Guarda cambios
        
        // Publicar evento
        eventPublisher.publishEvent(new ItemAddedEvent(savedOrder, 
            savedOrder.getItems().get(savedOrder.getItems().size() - 1))); // Publica evento
        
        // Retornar comando exitoso
        return AddItemCommand.success(); // Retorna resultado
    }
    
    // Implementación del comando para confirmar pedido
    @Override
    public ConfirmOrderCommand confirmOrder(ConfirmOrderRequest request) {
        // Buscar pedido
        Order order = findOrderByNumber(request.getOrderNumber()); // Busca el pedido
        
        // Confirmar pedido
        order.confirm(); // Confirma el pedido
        
        // Reservar stock para todos los items
        for (OrderItem item : order.getItems()) {
            boolean reserved = anticorruptionLayer.reserveStock(
                item.getProductId(), 
                item.getQuantity()
            ); // Reserva stock
            
            if (!reserved) {
                return ConfirmOrderCommand.failure("No se pudo reservar stock"); // Retorna error
            }
        }
        
        // Guardar pedido
        Order savedOrder = orderRepository.save(order); // Guarda cambios
        
        // Publicar evento
        eventPublisher.publishEvent(new OrderConfirmedEvent(savedOrder)); // Publica evento
        
        // Retornar comando exitoso
        return ConfirmOrderCommand.success(); // Retorna resultado
    }
    
    // Implementación de consulta para obtener pedido por número
    @Override
    public OrderDTO getOrderByNumber(String orderNumber) {
        // Buscar pedido
        Order order = findOrderByNumber(orderNumber); // Busca el pedido
        
        // Convertir a DTO
        return OrderMapper.toDTO(order); // Mapea a DTO
    }
    
    // Implementación de consulta para obtener pedidos por cliente
    @Override
    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        // Buscar pedidos
        List<Order> orders = orderRepository.findByCustomerId(customerId); // Busca pedidos
        
        // Convertir a DTOs
        return orders.stream()
            .map(OrderMapper::toDTO) // Mapea cada pedido
            .collect(Collectors.toList()); // Recolecta resultados
    }
    
    // Método helper para buscar pedido por número
    private Order findOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(OrderNumber.of(orderNumber))
            .orElseThrow(() -> new OrderNotFoundException("Pedido no encontrado: " + orderNumber));
    }
    
    // Método helper para validar request de creación
    private void validateCreateOrderRequest(CreateOrderRequest request) {
        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID es requerido");
        }
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name es requerido");
        }
        if (request.getCustomerEmail() == null || request.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email es requerido");
        }
    }
}
```

## 4. Pruebas Unitarias para Límites

```java
// Pruebas unitarias para el límite del contexto de pedidos
@ExtendWith(MockitoExtension.class)
class OrderContextBoundaryImplTest {
    
    @Mock
    private OrderRepository orderRepository; // Mock del repositorio
    
    @Mock
    private OrderDomainService orderDomainService; // Mock del servicio de dominio
    
    @Mock
    private OrderProductAnticorruptionLayer anticorruptionLayer; // Mock de la capa anticorrupción
    
    @Mock
    private ApplicationEventPublisher eventPublisher; // Mock del publicador de eventos
    
    @InjectMocks
    private OrderContextBoundaryImpl orderContextBoundary; // Servicio bajo prueba
    
    @Test
    @DisplayName("Debería crear un pedido exitosamente")
    void shouldCreateOrderSuccessfully() {
        // Arrange: preparar datos de prueba
        CreateOrderRequest request = CreateOrderRequest.builder()
            .customerId(1L)
            .customerName("Juan Pérez")
            .customerEmail("juan@example.com")
            .street("Calle Principal 123")
            .city("Ciudad")
            .postalCode("12345")
            .build(); // Crea request de prueba
        
        OrderNumber orderNumber = OrderNumber.generate(); // Genera número de pedido
        Order order = createTestOrder(orderNumber); // Crea pedido de prueba
        
        // Configurar mocks
        when(orderDomainService.createOrder(any(), any(), any())).thenReturn(order); // Mock creación
        when(orderRepository.save(any())).thenReturn(order); // Mock guardado
        
        // Act: crear pedido
        CreateOrderCommand result = orderContextBoundary.createOrder(request); // Ejecuta comando
        
        // Assert: verificar resultado
        assertThat(result.isSuccess()).isTrue(); // Verifica que fue exitoso
        assertThat(result.getOrderNumber()).isEqualTo(orderNumber.getValue()); // Verifica número
        
        // Verificar interacciones
        verify(orderDomainService).createOrder(any(), any(), any()); // Verifica llamada al servicio
        verify(orderRepository).save(order); // Verifica guardado
        verify(eventPublisher).publishEvent(any(OrderCreatedEvent.class)); // Verifica publicación de evento
    }
    
    @Test
    @DisplayName("Debería agregar item a un pedido exitosamente")
    void shouldAddItemToOrderSuccessfully() {
        // Arrange: preparar datos de prueba
        AddItemRequest request = AddItemRequest.builder()
            .orderNumber("ORD-20231201-0001")
            .productId(1L)
            .quantity(2)
            .build(); // Crea request de prueba
        
        Order order = createTestOrder(OrderNumber.of(request.getOrderNumber())); // Crea pedido
        OrderProductInfo productInfo = createTestProductInfo(); // Crea info de producto
        
        // Configurar mocks
        when(orderRepository.findByOrderNumber(any())).thenReturn(Optional.of(order)); // Mock búsqueda
        when(anticorruptionLayer.getProductInfoForOrder(any())).thenReturn(productInfo); // Mock producto
        when(anticorruptionLayer.checkStockAvailability(any(), anyInt())).thenReturn(true); // Mock stock
        when(orderRepository.save(any())).thenReturn(order); // Mock guardado
        
        // Act: agregar item
        AddItemCommand result = orderContextBoundary.addItem(request); // Ejecuta comando
        
        // Assert: verificar resultado
        assertThat(result.isSuccess()).isTrue(); // Verifica que fue exitoso
        
        // Verificar interacciones
        verify(anticorruptionLayer).getProductInfoForOrder(any()); // Verifica obtención de producto
        verify(anticorruptionLayer).checkStockAvailability(any(), anyInt()); // Verifica verificación de stock
        verify(orderRepository).save(order); // Verifica guardado
        verify(eventPublisher).publishEvent(any(ItemAddedEvent.class)); // Verifica publicación de evento
    }
    
    @Test
    @DisplayName("No debería agregar item si no hay stock disponible")
    void shouldNotAddItemWhenStockUnavailable() {
        // Arrange: preparar datos de prueba
        AddItemRequest request = AddItemRequest.builder()
            .orderNumber("ORD-20231201-0001")
            .productId(1L)
            .quantity(10)
            .build(); // Crea request de prueba
        
        Order order = createTestOrder(OrderNumber.of(request.getOrderNumber())); // Crea pedido
        OrderProductInfo productInfo = createTestProductInfo(); // Crea info de producto
        
        // Configurar mocks
        when(orderRepository.findByOrderNumber(any())).thenReturn(Optional.of(order)); // Mock búsqueda
        when(anticorruptionLayer.getProductInfoForOrder(any())).thenReturn(productInfo); // Mock producto
        when(anticorruptionLayer.checkStockAvailability(any(), anyInt())).thenReturn(false); // Mock sin stock
        
        // Act: agregar item
        AddItemCommand result = orderContextBoundary.addItem(request); // Ejecuta comando
        
        // Assert: verificar resultado
        assertThat(result.isSuccess()).isFalse(); // Verifica que falló
        assertThat(result.getErrorMessage()).isEqualTo("Stock insuficiente"); // Verifica mensaje de error
        
        // Verificar que no se guardó
        verify(orderRepository, never()).save(any()); // Verifica que no se guardó
        verify(eventPublisher, never()).publishEvent(any()); // Verifica que no se publicó evento
    }
    
    // Métodos helper para crear datos de prueba
    private Order createTestOrder(OrderNumber orderNumber) {
        CustomerInfo customerInfo = CustomerInfo.of(1L, "Test User", "test@example.com"); // Crea info cliente
        ShippingAddress shippingAddress = ShippingAddress.of("Test Street", "Test City", "12345"); // Crea dirección
        return Order.createOrder(orderNumber, customerInfo, shippingAddress); // Crea y retorna pedido
    }
    
    private OrderProductInfo createTestProductInfo() {
        return OrderProductInfo.builder() // Usa builder
            .productId(ProductId.of(1L)) // Asigna ID
            .name("Test Product") // Asigna nombre
            .price(Price.of(BigDecimal.valueOf(100.00), SharedKernel.Currency.USD)) // Asigna precio
            .isActive(true) // Asigna estado activo
            .build(); // Construye y retorna
    }
}
```

Este ejemplo demuestra cómo implementar Contextos Acotados y Límites de Servicios en microservicios, incluyendo:

1. **Contextos Acotados**: Definición clara de responsabilidades
2. **Mapeo de Contextos**: Relaciones entre contextos diferentes
3. **Anticorruption Layer**: Traducción entre modelos de diferentes contextos
4. **Límites de Servicios**: Definición de comandos, consultas y eventos
5. **Pruebas Unitarias**: Verificación completa de la funcionalidad
6. **Comentarios Detallados**: Línea por línea de código 