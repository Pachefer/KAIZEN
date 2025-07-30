# Servicios RESTful con Spring Boot

## Introducción

REST (Representational State Transfer) es un estilo arquitectónico que sigue principios clave diseñados para hacer los servicios web escalables y mantenibles. En este capítulo aprenderemos a construir servicios RESTful robustos usando Spring Boot.

## Principios REST

### 1. Statelessness (Sin Estado)
Cada request debe contener toda la información necesaria para procesarlo.

### 2. Client-Server
Separación clara entre cliente y servidor.

### 3. Cacheable
Las respuestas deben ser cacheables para mejorar el rendimiento.

### 4. Uniform Interface
Interfaz consistente y estandarizada.

## Configuración del Proyecto

### Dependencias Maven

```xml
<dependencies>
    <!-- Spring Boot Web Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Implementación Completa

### 1. Modelo de Datos

```java
// Entidad Item con validaciones
@Entity
@Table(name = "items")
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Column(name = "description")
    private String description;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Column(name = "price", nullable = false)
    private BigDecimal price;
    
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private ItemCategory category;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructor por defecto
    public Item() {}
    
    // Constructor con parámetros
    public Item(String name, String description, BigDecimal price, 
                Integer quantity, ItemCategory category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Método para actualizar el item
    public void update(Item itemDetails) {
        this.name = itemDetails.getName();
        this.description = itemDetails.getDescription();
        this.price = itemDetails.getPrice();
        this.quantity = itemDetails.getQuantity();
        this.category = itemDetails.getCategory();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

// Enum para categorías de items
public enum ItemCategory {
    ELECTRONICS,    // Electrónicos
    CLOTHING,       // Ropa
    BOOKS,          // Libros
    HOME,           // Hogar
    SPORTS,         // Deportes
    OTHER           // Otros
}
```

### 2. DTOs (Data Transfer Objects)

```java
// DTO para crear un item
public class CreateItemRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal price;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    private Integer quantity;
    
    @NotNull(message = "La categoría es obligatoria")
    private ItemCategory category;
    
    // Constructor
    public CreateItemRequest() {}
    
    public CreateItemRequest(String name, String description, BigDecimal price, 
                           Integer quantity, ItemCategory category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }
    
    // Getters y Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
}

// DTO para actualizar un item
public class UpdateItemRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal price;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    private Integer quantity;
    
    @NotNull(message = "La categoría es obligatoria")
    private ItemCategory category;
    
    // Constructor
    public UpdateItemRequest() {}
    
    // Getters y Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
}

// DTO para respuesta de item
public class ItemResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private ItemCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructor
    public ItemResponse() {}
    
    public ItemResponse(Item item) {
        this.id = item.getId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.price = item.getPrice();
        this.quantity = item.getQuantity();
        this.category = item.getCategory();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

### 3. Repositorio

```java
// Repositorio JPA para items
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    /**
     * Busca items por categoría
     * @param category Categoría a buscar
     * @return Lista de items de la categoría especificada
     */
    List<Item> findByCategory(ItemCategory category);
    
    /**
     * Busca items por nombre (búsqueda parcial, case-insensitive)
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de items que coinciden con el nombre
     */
    List<Item> findByNameContainingIgnoreCase(String name);
    
    /**
     * Busca items por rango de precios
     * @param minPrice Precio mínimo
     * @param maxPrice Precio máximo
     * @return Lista de items dentro del rango de precios
     */
    List<Item> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    /**
     * Busca items con stock disponible (cantidad > 0)
     * @return Lista de items con stock disponible
     */
    List<Item> findByQuantityGreaterThan(Integer quantity);
    
    /**
     * Cuenta items por categoría
     * @param category Categoría a contar
     * @return Número de items en la categoría
     */
    long countByCategory(ItemCategory category);
}
```

### 4. Servicio

```java
// Servicio para la lógica de negocio de items
@Service
@Transactional
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final Logger logger = LoggerFactory.getLogger(ItemService.class);
    
    // Constructor con inyección de dependencias
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }
    
    /**
     * Obtiene todos los items con paginación
     * @param pageable Configuración de paginación
     * @return Página de items
     */
    public Page<ItemResponse> getAllItems(Pageable pageable) {
        logger.info("Obteniendo todos los items con paginación: {}", pageable);
        
        Page<Item> items = itemRepository.findAll(pageable);
        Page<ItemResponse> itemResponses = items.map(ItemResponse::new);
        
        logger.info("Se encontraron {} items", itemResponses.getTotalElements());
        return itemResponses;
    }
    
    /**
     * Obtiene un item por su ID
     * @param id ID del item
     * @return Item encontrado
     * @throws ItemNotFoundException si el item no existe
     */
    public ItemResponse getItemById(Long id) {
        logger.info("Buscando item con ID: {}", id);
        
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> {
                logger.warn("Item con ID {} no encontrado", id);
                return new ItemNotFoundException("Item con ID " + id + " no encontrado");
            });
        
        logger.info("Item encontrado: {}", item.getName());
        return new ItemResponse(item);
    }
    
    /**
     * Crea un nuevo item
     * @param createRequest Datos del item a crear
     * @return Item creado
     */
    public ItemResponse createItem(CreateItemRequest createRequest) {
        logger.info("Creando nuevo item: {}", createRequest.getName());
        
        // Validar que no exista un item con el mismo nombre
        if (itemRepository.findByNameContainingIgnoreCase(createRequest.getName()).size() > 0) {
            logger.warn("Ya existe un item con el nombre: {}", createRequest.getName());
            throw new ItemAlreadyExistsException("Ya existe un item con el nombre: " + createRequest.getName());
        }
        
        // Crear el item
        Item item = new Item(
            createRequest.getName(),
            createRequest.getDescription(),
            createRequest.getPrice(),
            createRequest.getQuantity(),
            createRequest.getCategory()
        );
        
        Item savedItem = itemRepository.save(item);
        logger.info("Item creado exitosamente con ID: {}", savedItem.getId());
        
        return new ItemResponse(savedItem);
    }
    
    /**
     * Actualiza un item existente
     * @param id ID del item a actualizar
     * @param updateRequest Datos de actualización
     * @return Item actualizado
     * @throws ItemNotFoundException si el item no existe
     */
    public ItemResponse updateItem(Long id, UpdateItemRequest updateRequest) {
        logger.info("Actualizando item con ID: {}", id);
        
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> {
                logger.warn("Item con ID {} no encontrado para actualización", id);
                return new ItemNotFoundException("Item con ID " + id + " no encontrado");
            });
        
        // Actualizar el item
        item.setName(updateRequest.getName());
        item.setDescription(updateRequest.getDescription());
        item.setPrice(updateRequest.getPrice());
        item.setQuantity(updateRequest.getQuantity());
        item.setCategory(updateRequest.getCategory());
        item.setUpdatedAt(LocalDateTime.now());
        
        Item updatedItem = itemRepository.save(item);
        logger.info("Item actualizado exitosamente: {}", updatedItem.getName());
        
        return new ItemResponse(updatedItem);
    }
    
    /**
     * Elimina un item
     * @param id ID del item a eliminar
     * @throws ItemNotFoundException si el item no existe
     */
    public void deleteItem(Long id) {
        logger.info("Eliminando item con ID: {}", id);
        
        if (!itemRepository.existsById(id)) {
            logger.warn("Item con ID {} no encontrado para eliminación", id);
            throw new ItemNotFoundException("Item con ID " + id + " no encontrado");
        }
        
        itemRepository.deleteById(id);
        logger.info("Item eliminado exitosamente");
    }
    
    /**
     * Busca items por categoría
     * @param category Categoría a buscar
     * @return Lista de items de la categoría
     */
    public List<ItemResponse> getItemsByCategory(ItemCategory category) {
        logger.info("Buscando items por categoría: {}", category);
        
        List<Item> items = itemRepository.findByCategory(category);
        List<ItemResponse> itemResponses = items.stream()
            .map(ItemResponse::new)
            .collect(Collectors.toList());
        
        logger.info("Se encontraron {} items en la categoría {}", itemResponses.size(), category);
        return itemResponses;
    }
    
    /**
     * Busca items por nombre
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de items que coinciden
     */
    public List<ItemResponse> searchItemsByName(String name) {
        logger.info("Buscando items por nombre: {}", name);
        
        List<Item> items = itemRepository.findByNameContainingIgnoreCase(name);
        List<ItemResponse> itemResponses = items.stream()
            .map(ItemResponse::new)
            .collect(Collectors.toList());
        
        logger.info("Se encontraron {} items que coinciden con '{}'", itemResponses.size(), name);
        return itemResponses;
    }
    
    /**
     * Busca items por rango de precios
     * @param minPrice Precio mínimo
     * @param maxPrice Precio máximo
     * @return Lista de items en el rango de precios
     */
    public List<ItemResponse> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        logger.info("Buscando items por rango de precios: {} - {}", minPrice, maxPrice);
        
        List<Item> items = itemRepository.findByPriceBetween(minPrice, maxPrice);
        List<ItemResponse> itemResponses = items.stream()
            .map(ItemResponse::new)
            .collect(Collectors.toList());
        
        logger.info("Se encontraron {} items en el rango de precios", itemResponses.size());
        return itemResponses;
    }
    
    /**
     * Obtiene estadísticas de items
     * @return Estadísticas de items
     */
    public ItemStatistics getItemStatistics() {
        logger.info("Obteniendo estadísticas de items");
        
        long totalItems = itemRepository.count();
        long electronicsCount = itemRepository.countByCategory(ItemCategory.ELECTRONICS);
        long clothingCount = itemRepository.countByCategory(ItemCategory.CLOTHING);
        long booksCount = itemRepository.countByCategory(ItemCategory.BOOKS);
        long homeCount = itemRepository.countByCategory(ItemCategory.HOME);
        long sportsCount = itemRepository.countByCategory(ItemCategory.SPORTS);
        long otherCount = itemRepository.countByCategory(ItemCategory.OTHER);
        
        ItemStatistics statistics = new ItemStatistics(
            totalItems, electronicsCount, clothingCount, 
            booksCount, homeCount, sportsCount, otherCount
        );
        
        logger.info("Estadísticas obtenidas: {}", statistics);
        return statistics;
    }
}

// Clase para estadísticas de items
public class ItemStatistics {
    private long totalItems;
    private long electronicsCount;
    private long clothingCount;
    private long booksCount;
    private long homeCount;
    private long sportsCount;
    private long otherCount;
    
    // Constructor
    public ItemStatistics(long totalItems, long electronicsCount, long clothingCount,
                         long booksCount, long homeCount, long sportsCount, long otherCount) {
        this.totalItems = totalItems;
        this.electronicsCount = electronicsCount;
        this.clothingCount = clothingCount;
        this.booksCount = booksCount;
        this.homeCount = homeCount;
        this.sportsCount = sportsCount;
        this.otherCount = otherCount;
    }
    
    // Getters
    public long getTotalItems() { return totalItems; }
    public long getElectronicsCount() { return electronicsCount; }
    public long getClothingCount() { return clothingCount; }
    public long getBooksCount() { return booksCount; }
    public long getHomeCount() { return homeCount; }
    public long getSportsCount() { return sportsCount; }
    public long getOtherCount() { return otherCount; }
    
    @Override
    public String toString() {
        return String.format("ItemStatistics{totalItems=%d, electronics=%d, clothing=%d, books=%d, home=%d, sports=%d, other=%d}",
            totalItems, electronicsCount, clothingCount, booksCount, homeCount, sportsCount, otherCount);
    }
}
```

### 5. Controlador REST

```java
// Controlador REST para items
@RestController
@RequestMapping("/api/items")
@Validated
public class ItemController {
    
    private final ItemService itemService;
    private final Logger logger = LoggerFactory.getLogger(ItemController.class);
    
    // Constructor con inyección de dependencias
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }
    
    /**
     * GET /api/items - Obtiene todos los items con paginación
     * @param page Número de página (default: 0)
     * @param size Tamaño de página (default: 10)
     * @param sort Campo de ordenamiento (default: id)
     * @param direction Dirección de ordenamiento (default: ASC)
     * @return Página de items
     */
    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction) {
        
        logger.info("GET /api/items - page={}, size={}, sort={}, direction={}", 
                   page, size, sort, direction);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        Page<ItemResponse> items = itemService.getAllItems(pageable);
        
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/items/{id} - Obtiene un item por ID
     * @param id ID del item
     * @return Item encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        logger.info("GET /api/items/{}", id);
        
        ItemResponse item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }
    
    /**
     * POST /api/items - Crea un nuevo item
     * @param createRequest Datos del item a crear
     * @return Item creado
     */
    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody CreateItemRequest createRequest) {
        logger.info("POST /api/items - Creando item: {}", createRequest.getName());
        
        ItemResponse createdItem = itemService.createItem(createRequest);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .header("Location", "/api/items/" + createdItem.getId())
            .body(createdItem);
    }
    
    /**
     * PUT /api/items/{id} - Actualiza un item existente
     * @param id ID del item a actualizar
     * @param updateRequest Datos de actualización
     * @return Item actualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateItemRequest updateRequest) {
        
        logger.info("PUT /api/items/{} - Actualizando item", id);
        
        ItemResponse updatedItem = itemService.updateItem(id, updateRequest);
        return ResponseEntity.ok(updatedItem);
    }
    
    /**
     * DELETE /api/items/{id} - Elimina un item
     * @param id ID del item a eliminar
     * @return Respuesta sin contenido
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        logger.info("DELETE /api/items/{} - Eliminando item", id);
        
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/items/category/{category} - Obtiene items por categoría
     * @param category Categoría a buscar
     * @return Lista de items de la categoría
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ItemResponse>> getItemsByCategory(
            @PathVariable ItemCategory category) {
        
        logger.info("GET /api/items/category/{} - Buscando items por categoría", category);
        
        List<ItemResponse> items = itemService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/items/search - Busca items por nombre
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de items que coinciden
     */
    @GetMapping("/search")
    public ResponseEntity<List<ItemResponse>> searchItemsByName(
            @RequestParam String name) {
        
        logger.info("GET /api/items/search?name={} - Buscando items por nombre", name);
        
        List<ItemResponse> items = itemService.searchItemsByName(name);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/items/price-range - Busca items por rango de precios
     * @param minPrice Precio mínimo
     * @param maxPrice Precio máximo
     * @return Lista de items en el rango de precios
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<ItemResponse>> getItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        
        logger.info("GET /api/items/price-range?minPrice={}&maxPrice={} - Buscando por rango de precios", 
                   minPrice, maxPrice);
        
        List<ItemResponse> items = itemService.getItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(items);
    }
    
    /**
     * GET /api/items/statistics - Obtiene estadísticas de items
     * @return Estadísticas de items
     */
    @GetMapping("/statistics")
    public ResponseEntity<ItemStatistics> getItemStatistics() {
        logger.info("GET /api/items/statistics - Obteniendo estadísticas");
        
        ItemStatistics statistics = itemService.getItemStatistics();
        return ResponseEntity.ok(statistics);
    }
}
```

### 6. Manejo de Errores

```java
// Excepción personalizada para items no encontrados
public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(String message) {
        super(message);
    }
}

// Excepción personalizada para items que ya existen
public class ItemAlreadyExistsException extends RuntimeException {
    public ItemAlreadyExistsException(String message) {
        super(message);
    }
}

// Manejador global de excepciones
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * Maneja excepciones de validación
     * @param ex Excepción de validación
     * @return Respuesta de error
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        logger.warn("Error de validación: {}", ex.getMessage());
        
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Error de validación",
            errors
        );
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Maneja excepciones de items no encontrados
     * @param ex Excepción de item no encontrado
     * @return Respuesta de error
     */
    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleItemNotFoundException(
            ItemNotFoundException ex) {
        
        logger.warn("Item no encontrado: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            List.of("El item solicitado no existe")
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    /**
     * Maneja excepciones de items que ya existen
     * @param ex Excepción de item que ya existe
     * @return Respuesta de error
     */
    @ExceptionHandler(ItemAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleItemAlreadyExistsException(
            ItemAlreadyExistsException ex) {
        
        logger.warn("Item ya existe: {}", ex.getMessage());
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            List.of("Ya existe un item con los datos proporcionados")
        );
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
    
    /**
     * Maneja excepciones generales
     * @param ex Excepción general
     * @return Respuesta de error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        
        logger.error("Error interno del servidor: {}", ex.getMessage(), ex);
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Error interno del servidor",
            List.of("Ha ocurrido un error inesperado")
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

// Clase para respuestas de error
public class ErrorResponse {
    private int status;
    private String message;
    private List<String> details;
    private LocalDateTime timestamp;
    
    // Constructor
    public ErrorResponse(int status, String message, List<String> details) {
        this.status = status;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters
    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public List<String> getDetails() { return details; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
```

### 7. Configuración de la Aplicación

```java
// Clase principal de la aplicación
@SpringBootApplication
public class RestfulServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(RestfulServiceApplication.class, args);
    }
    
    /**
     * Configuración de Jackson para manejo de fechas
     * @return ObjectMapper configurado
     */
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
    
    /**
     * Configuración de CORS
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 8. Configuración de Propiedades

```properties
# application.properties
# Configuración del servidor
server.port=8080
server.servlet.context-path=/api

# Configuración de la base de datos (H2 para desarrollo)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Configuración de JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Configuración de logging
logging.level.com.example=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Configuración de validación
spring.validation.enabled=true

# Configuración de Jackson
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=UTC
```

## Pruebas Unitarias

```java
// Pruebas unitarias para el controlador
@WebMvcTest(ItemController.class)
class ItemControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ItemService itemService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @DisplayName("GET /api/items debería retornar lista de items")
    void getAllItems_ShouldReturnItemsList() throws Exception {
        // Given
        List<ItemResponse> items = Arrays.asList(
            new ItemResponse(createTestItem(1L, "Item 1")),
            new ItemResponse(createTestItem(2L, "Item 2"))
        );
        
        when(itemService.getAllItems(any(Pageable.class)))
            .thenReturn(new PageImpl<>(items));
        
        // When & Then
        mockMvc.perform(get("/api/items"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(2)))
            .andExpect(jsonPath("$.content[0].name").value("Item 1"))
            .andExpect(jsonPath("$.content[1].name").value("Item 2"));
    }
    
    @Test
    @DisplayName("GET /api/items/{id} debería retornar item por ID")
    void getItemById_ShouldReturnItem() throws Exception {
        // Given
        Long itemId = 1L;
        ItemResponse item = new ItemResponse(createTestItem(itemId, "Test Item"));
        
        when(itemService.getItemById(itemId)).thenReturn(item);
        
        // When & Then
        mockMvc.perform(get("/api/items/{id}", itemId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(itemId))
            .andExpect(jsonPath("$.name").value("Test Item"));
    }
    
    @Test
    @DisplayName("POST /api/items debería crear nuevo item")
    void createItem_ShouldCreateNewItem() throws Exception {
        // Given
        CreateItemRequest request = new CreateItemRequest(
            "New Item", "Description", BigDecimal.valueOf(99.99), 10, ItemCategory.ELECTRONICS
        );
        
        ItemResponse createdItem = new ItemResponse(createTestItem(1L, "New Item"));
        when(itemService.createItem(any(CreateItemRequest.class))).thenReturn(createdItem);
        
        // When & Then
        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("New Item"))
            .andExpect(header().string("Location", "/api/items/1"));
    }
    
    @Test
    @DisplayName("PUT /api/items/{id} debería actualizar item existente")
    void updateItem_ShouldUpdateExistingItem() throws Exception {
        // Given
        Long itemId = 1L;
        UpdateItemRequest request = new UpdateItemRequest();
        request.setName("Updated Item");
        request.setDescription("Updated Description");
        request.setPrice(BigDecimal.valueOf(149.99));
        request.setQuantity(5);
        request.setCategory(ItemCategory.CLOTHING);
        
        ItemResponse updatedItem = new ItemResponse(createTestItem(itemId, "Updated Item"));
        when(itemService.updateItem(eq(itemId), any(UpdateItemRequest.class)))
            .thenReturn(updatedItem);
        
        // When & Then
        mockMvc.perform(put("/api/items/{id}", itemId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Item"));
    }
    
    @Test
    @DisplayName("DELETE /api/items/{id} debería eliminar item")
    void deleteItem_ShouldDeleteItem() throws Exception {
        // Given
        Long itemId = 1L;
        doNothing().when(itemService).deleteItem(itemId);
        
        // When & Then
        mockMvc.perform(delete("/api/items/{id}", itemId))
            .andExpect(status().isNoContent());
        
        verify(itemService).deleteItem(itemId);
    }
    
    @Test
    @DisplayName("GET /api/items/{id} debería retornar 404 cuando item no existe")
    void getItemById_ShouldReturn404_WhenItemNotFound() throws Exception {
        // Given
        Long itemId = 999L;
        when(itemService.getItemById(itemId))
            .thenThrow(new ItemNotFoundException("Item no encontrado"));
        
        // When & Then
        mockMvc.perform(get("/api/items/{id}", itemId))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Item no encontrado"));
    }
    
    @Test
    @DisplayName("POST /api/items debería retornar 400 cuando datos son inválidos")
    void createItem_ShouldReturn400_WhenInvalidData() throws Exception {
        // Given
        CreateItemRequest request = new CreateItemRequest();
        // Datos inválidos: nombre vacío
        
        // When & Then
        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Error de validación"));
    }
    
    // Método helper para crear items de prueba
    private Item createTestItem(Long id, String name) {
        Item item = new Item(name, "Test Description", BigDecimal.valueOf(99.99), 10, ItemCategory.ELECTRONICS);
        item.setId(id);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        return item;
    }
}
```

## Resumen

En este capítulo hemos aprendido a construir servicios RESTful robustos con Spring Boot, incluyendo:

1. **Modelos de datos** con validaciones JPA y Bean Validation
2. **DTOs** para separar la capa de presentación de la capa de dominio
3. **Repositorios** con métodos de consulta personalizados
4. **Servicios** con lógica de negocio y manejo de transacciones
5. **Controladores REST** con endpoints CRUD completos
6. **Manejo de errores** global con respuestas consistentes
7. **Pruebas unitarias** completas para el controlador

### Mejores Prácticas Implementadas

- ✅ **Validación de entrada** con Bean Validation
- ✅ **Separación de responsabilidades** con DTOs
- ✅ **Manejo de errores** consistente
- ✅ **Logging** apropiado
- ✅ **Documentación** con comentarios JavaDoc
- ✅ **Pruebas unitarias** completas
- ✅ **Configuración** flexible con properties
- ✅ **Paginación** y ordenamiento
- ✅ **Búsqueda** y filtrado
- ✅ **Estadísticas** y métricas

Este servicio RESTful proporciona una base sólida para construir microservicios robustos y escalables. 