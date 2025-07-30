package com.masteringmicroservices.model;

// ============================================================================
// CÓDIGO ORIGINAL MANTENIDO (comentado para referencia)
// ============================================================================
/*
public class Item {
	
	private Long id;
	private String name;
	
	public Item() {
		
	}
	
	public Item(Long id, String name) {
		this.id=id;
		this.name=name;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
*/
// ============================================================================

// Imports para funcionalidades avanzadas
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.ToString;

// Imports para validaciones
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

// Imports para JPA
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Imports para serialización
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;

// Imports para auditoría
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Modelo de dominio Item con funcionalidades avanzadas de nivel experto.
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - ✅ Validaciones robustas con Bean Validation
 * - ✅ Persistencia JPA con mapeo avanzado
 * - ✅ Auditoría automática con timestamps
 * - ✅ Optimistic locking para concurrencia
 * - ✅ Soft delete para preservación de datos
 * - ✅ Serialización JSON personalizada
 * - ✅ Lombok para reducir boilerplate
 * - ✅ Métodos de negocio encapsulados
 * - ✅ Validaciones de dominio
 * - ✅ Métodos de utilidad
 * 
 * PATRONES DE DISEÑO APLICADOS:
 * - Domain Model Pattern
 * - Value Object Pattern
 * - Audit Pattern
 * - Optimistic Locking Pattern
 * - Soft Delete Pattern
 * - Builder Pattern
 * 
 * @author Experto en Microservicios
 * @version 2.0 - Nivel Experto
 * @since 2024
 */
@Entity
@Table(name = "items", indexes = {
    @Index(name = "idx_items_name", columnList = "name"),
    @Index(name = "idx_items_code", columnList = "code"),
    @Index(name = "idx_items_deleted", columnList = "deleted"),
    @Index(name = "idx_items_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
@ToString(exclude = {"description"})
public class Item {

    // ============================================================================
    // ATRIBUTOS BÁSICOS (manteniendo compatibilidad con código original)
    // ============================================================================
    
    /**
     * Identificador único del item
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    @NotNull(message = "ID no puede ser nulo")
    private Long id;
    
    /**
     * Nombre del item
     */
    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "Nombre no puede estar vacío")
    @Size(min = 2, max = 100, message = "Nombre debe tener entre 2 y 100 caracteres")
    private String name;
    
    // ============================================================================
    // ATRIBUTOS AVANZADOS PARA NEGOCIO
    // ============================================================================
    
    /**
     * Código único del item
     */
    @Column(name = "code", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Código no puede estar vacío")
    @Size(min = 3, max = 50, message = "Código debe tener entre 3 y 50 caracteres")
    private String code;
    
    /**
     * Descripción detallada del item
     */
    @Column(name = "description", columnDefinition = "TEXT")
    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String description;
    
    /**
     * Precio del item
     */
    @Column(name = "price", precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "Precio debe ser mayor o igual a 0")
    private BigDecimal price;
    
    /**
     * Stock disponible del item
     */
    @Column(name = "stock", nullable = false)
    @PositiveOrZero(message = "Stock debe ser mayor o igual a 0")
    private Integer stock;
    
    /**
     * Categoría del item
     */
    @Column(name = "category", length = 50)
    @Size(max = 50, message = "Categoría no puede exceder 50 caracteres")
    private String category;
    
    /**
     * Estado del item (ACTIVE, INACTIVE, DISCONTINUED)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @NotNull(message = "Estado no puede ser nulo")
    private ItemStatus status;
    
    // ============================================================================
    // ATRIBUTOS DE AUDITORÍA
    // ============================================================================
    
    /**
     * Fecha de creación
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    /**
     * Usuario que creó el item
     */
    @Column(name = "created_by", nullable = false, updatable = false, length = 100)
    @NotBlank(message = "Usuario creador no puede estar vacío")
    private String createdBy;
    
    /**
     * Fecha de última modificación
     */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    /**
     * Usuario que modificó por última vez el item
     */
    @Column(name = "updated_by", nullable = false, length = 100)
    @NotBlank(message = "Usuario modificador no puede estar vacío")
    private String updatedBy;
    
    /**
     * Versión para optimistic locking
     */
    @Version
    @Column(name = "version", nullable = false)
    @Positive(message = "Versión debe ser mayor a 0")
    private Long version;
    
    // ============================================================================
    // ATRIBUTOS PARA SOFT DELETE
    // ============================================================================
    
    /**
     * Indica si el item está eliminado (soft delete)
     */
    @Column(name = "deleted", nullable = false)
    private Boolean deleted;
    
    /**
     * Fecha de eliminación
     */
    @Column(name = "deleted_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deletedAt;
    
    /**
     * Usuario que eliminó el item
     */
    @Column(name = "deleted_by", length = 100)
    private String deletedBy;
    
    // ============================================================================
    // ATRIBUTOS PARA MÉTRICAS Y ANALÍTICAS
    // ============================================================================
    
    /**
     * Número de veces que se ha consultado el item
     */
    @Column(name = "view_count", nullable = false)
    @PositiveOrZero(message = "Contador de vistas debe ser mayor o igual a 0")
    private Long viewCount;
    
    /**
     * Puntuación promedio del item
     */
    @Column(name = "rating", precision = 3, scale = 2)
    @DecimalMin(value = "0.0", message = "Puntuación debe ser mayor o igual a 0")
    private BigDecimal rating;
    
    /**
     * Número de reseñas del item
     */
    @Column(name = "review_count", nullable = false)
    @PositiveOrZero(message = "Contador de reseñas debe ser mayor o igual a 0")
    private Long reviewCount;
    
    // ============================================================================
    // CONSTRUCTORES
    // ============================================================================
    
    /**
     * Constructor por defecto (requerido por JPA)
     */
    public Item() {
        // Inicializar valores por defecto
        this.stock = 0;
        this.status = ItemStatus.ACTIVE;
        this.deleted = false;
        this.viewCount = 0L;
        this.reviewCount = 0L;
        this.rating = BigDecimal.ZERO;
        this.version = 1L;
    }
    
    /**
     * Constructor con parámetros básicos (compatibilidad con código original)
     */
    public Item(Long id, String name) {
        this();
        this.id = id;
        this.name = name;
        this.code = generateCodeFromName(name);
    }
    
    /**
     * Constructor con parámetros avanzados
     */
    public Item(Long id, String name, String code, String description, 
                BigDecimal price, Integer stock, String category) {
        this();
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }
    
    // ============================================================================
    // MÉTODOS DE NEGOCIO
    // ============================================================================
    
    /**
     * Verifica si el item está disponible para compra
     * 
     * @return true si el item está disponible, false en caso contrario
     */
    @JsonIgnore
    public boolean isAvailable() {
        return !isDeleted() && 
               getStatus() == ItemStatus.ACTIVE && 
               getStock() != null && 
               getStock() > 0;
    }
    
    /**
     * Verifica si el item está agotado
     * 
     * @return true si el item está agotado, false en caso contrario
     */
    @JsonIgnore
    public boolean isOutOfStock() {
        return getStock() == null || getStock() <= 0;
    }
    
    /**
     * Verifica si el item está en oferta (precio reducido)
     * 
     * @param originalPrice Precio original de referencia
     * @return true si está en oferta, false en caso contrario
     */
    public boolean isOnSale(BigDecimal originalPrice) {
        if (getPrice() == null || originalPrice == null) {
            return false;
        }
        
        BigDecimal discount = originalPrice.subtract(getPrice());
        BigDecimal discountPercentage = discount.divide(originalPrice, 2, BigDecimal.ROUND_HALF_UP)
                                               .multiply(new BigDecimal("100"));
        
        return discountPercentage.compareTo(new BigDecimal("10")) >= 0; // 10% o más de descuento
    }
    
    /**
     * Reduce el stock del item
     * 
     * @param quantity Cantidad a reducir
     * @throws IllegalStateException si no hay suficiente stock
     */
    public void reduceStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        
        if (getStock() < quantity) {
            throw new IllegalStateException("Stock insuficiente. Disponible: " + getStock() + ", Solicitado: " + quantity);
        }
        
        this.stock -= quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Aumenta el stock del item
     * 
     * @param quantity Cantidad a aumentar
     */
    public void increaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        
        this.stock += quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Incrementa el contador de vistas
     */
    public void incrementViewCount() {
        this.viewCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Actualiza la puntuación del item
     * 
     * @param newRating Nueva puntuación
     * @param newReviewCount Nuevo número de reseñas
     */
    public void updateRating(BigDecimal newRating, Long newReviewCount) {
        if (newRating == null || newReviewCount == null) {
            throw new IllegalArgumentException("Puntuación y número de reseñas no pueden ser nulos");
        }
        
        if (newRating.compareTo(BigDecimal.ZERO) < 0 || newRating.compareTo(new BigDecimal("5")) > 0) {
            throw new IllegalArgumentException("Puntuación debe estar entre 0 y 5");
        }
        
        this.rating = newRating;
        this.reviewCount = newReviewCount;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Marca el item como eliminado (soft delete)
     * 
     * @param deletedBy Usuario que elimina el item
     */
    public void markAsDeleted(String deletedBy) {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }
    
    /**
     * Restaura el item eliminado
     */
    public void restore() {
        this.deleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }
    
    /**
     * Cambia el estado del item
     * 
     * @param newStatus Nuevo estado
     */
    public void changeStatus(ItemStatus newStatus) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Estado no puede ser nulo");
        }
        
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();
        this.version++;
    }
    
    // ============================================================================
    // MÉTODOS DE VALIDACIÓN DE DOMINIO
    // ============================================================================
    
    /**
     * Valida que el item cumple con las reglas de negocio
     * 
     * @throws IllegalArgumentException si no cumple las reglas
     */
    public void validateBusinessRules() {
        // Validar nombre
        if (getName() == null || getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Nombre del item es requerido");
        }
        
        // Validar código
        if (getCode() == null || getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Código del item es requerido");
        }
        
        // Validar precio
        if (getPrice() != null && getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Precio no puede ser negativo");
        }
        
        // Validar stock
        if (getStock() != null && getStock() < 0) {
            throw new IllegalArgumentException("Stock no puede ser negativo");
        }
        
        // Validar estado
        if (getStatus() == null) {
            throw new IllegalArgumentException("Estado del item es requerido");
        }
    }
    
    /**
     * Verifica si el item puede ser modificado
     * 
     * @return true si puede ser modificado, false en caso contrario
     */
    @JsonIgnore
    public boolean canBeModified() {
        return !isDeleted() && getStatus() != ItemStatus.DISCONTINUED;
    }
    
    /**
     * Verifica si el item puede ser eliminado
     * 
     * @return true si puede ser eliminado, false en caso contrario
     */
    @JsonIgnore
    public boolean canBeDeleted() {
        return !isDeleted() && getStock() == 0;
    }
    
    // ============================================================================
    // MÉTODOS DE UTILIDAD
    // ============================================================================
    
    /**
     * Genera un código único basado en el nombre
     * 
     * @param name Nombre del item
     * @return Código generado
     */
    private String generateCodeFromName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "ITEM_" + System.currentTimeMillis();
        }
        
        String baseCode = name.toUpperCase()
                             .replaceAll("[^A-Z0-9]", "")
                             .substring(0, Math.min(name.length(), 8));
        
        return baseCode + "_" + System.currentTimeMillis();
    }
    
    /**
     * Calcula el valor total del inventario
     * 
     * @return Valor total del inventario
     */
    @JsonIgnore
    public BigDecimal getInventoryValue() {
        if (getPrice() == null || getStock() == null) {
            return BigDecimal.ZERO;
        }
        
        return getPrice().multiply(new BigDecimal(getStock()));
    }
    
    /**
     * Obtiene el estado del item como string
     * 
     * @return Estado como string
     */
    @JsonProperty("statusText")
    public String getStatusText() {
        return getStatus() != null ? getStatus().getDisplayName() : "UNKNOWN";
    }
    
    /**
     * Obtiene información resumida del item
     * 
     * @return Información resumida
     */
    @JsonIgnore
    public String getSummary() {
        return String.format("Item[id=%d, name='%s', code='%s', stock=%d, price=%s]", 
            getId(), getName(), getCode(), getStock(), getPrice());
    }
    
    // ============================================================================
    // ENUMERACIONES
    // ============================================================================
    
    /**
     * Estados posibles de un item
     */
    public enum ItemStatus {
        ACTIVE("Activo"),
        INACTIVE("Inactivo"),
        DISCONTINUED("Descontinuado"),
        OUT_OF_STOCK("Agotado");
        
        private final String displayName;
        
        ItemStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // ============================================================================
    // MÉTODOS DE COMPARACIÓN Y ORDENAMIENTO
    // ============================================================================
    
    /**
     * Compara items por nombre
     * 
     * @param other Otro item
     * @return Resultado de la comparación
     */
    public int compareByName(Item other) {
        if (other == null) {
            return 1;
        }
        
        String thisName = this.getName() != null ? this.getName() : "";
        String otherName = other.getName() != null ? other.getName() : "";
        
        return thisName.compareToIgnoreCase(otherName);
    }
    
    /**
     * Compara items por precio
     * 
     * @param other Otro item
     * @return Resultado de la comparación
     */
    public int compareByPrice(Item other) {
        if (other == null) {
            return 1;
        }
        
        BigDecimal thisPrice = this.getPrice() != null ? this.getPrice() : BigDecimal.ZERO;
        BigDecimal otherPrice = other.getPrice() != null ? other.getPrice() : BigDecimal.ZERO;
        
        return thisPrice.compareTo(otherPrice);
    }
    
    /**
     * Compara items por stock
     * 
     * @param other Otro item
     * @return Resultado de la comparación
     */
    public int compareByStock(Item other) {
        if (other == null) {
            return 1;
        }
        
        Integer thisStock = this.getStock() != null ? this.getStock() : 0;
        Integer otherStock = other.getStock() != null ? other.getStock() : 0;
        
        return thisStock.compareTo(otherStock);
    }
}
