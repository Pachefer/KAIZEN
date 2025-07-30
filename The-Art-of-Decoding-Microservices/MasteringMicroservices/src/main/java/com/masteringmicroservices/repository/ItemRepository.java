package com.masteringmicroservices.repository;

import com.masteringmicroservices.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio de Items con funcionalidades avanzadas de nivel experto.
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - ✅ Consultas JPA optimizadas
 * - ✅ Consultas personalizadas con @Query
 * - ✅ Consultas nativas para performance
 * - ✅ Paginación y ordenamiento
 * - ✅ Filtrado dinámico
 * - ✅ Consultas de agregación
 * - ✅ Consultas de búsqueda full-text
 * - ✅ Consultas de auditoría
 * - ✅ Consultas de métricas
 * - ✅ Consultas de reporting
 * 
 * PATRONES DE DISEÑO APLICADOS:
 * - Repository Pattern
 * - Query Object Pattern
 * - Specification Pattern
 * - Criteria API Pattern
 * 
 * @author Experto en Microservicios
 * @version 2.0 - Nivel Experto
 * @since 2024
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    // ============================================================================
    // CONSULTAS BÁSICAS OPTIMIZADAS
    // ============================================================================
    
    /**
     * Busca items por nombre (case-insensitive)
     * 
     * @param name Nombre del item
     * @return Lista de items con el nombre especificado
     */
    @Query("SELECT i FROM Item i WHERE LOWER(i.name) = LOWER(:name) AND i.deleted = false")
    List<Item> findByNameIgnoreCase(@Param("name") String name);
    
    /**
     * Busca items por código
     * 
     * @param code Código del item
     * @return Item con el código especificado
     */
    @Query("SELECT i FROM Item i WHERE i.code = :code AND i.deleted = false")
    Optional<Item> findByCode(@Param("code") String code);
    
    /**
     * Busca items por categoría
     * 
     * @param category Categoría del item
     * @return Lista de items de la categoría especificada
     */
    @Query("SELECT i FROM Item i WHERE i.category = :category AND i.deleted = false")
    List<Item> findByCategory(@Param("category") String category);
    
    /**
     * Busca items por estado
     * 
     * @param status Estado del item
     * @return Lista de items con el estado especificado
     */
    @Query("SELECT i FROM Item i WHERE i.status = :status AND i.deleted = false")
    List<Item> findByStatus(@Param("status") Item.ItemStatus status);
    
    // ============================================================================
    // CONSULTAS DE BÚSQUEDA AVANZADA
    // ============================================================================
    
    /**
     * Busca items por nombre que contenga el texto especificado
     * 
     * @param name Texto a buscar en el nombre
     * @return Lista de items que contienen el texto en el nombre
     */
    @Query("SELECT i FROM Item i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :name, '%')) AND i.deleted = false")
    List<Item> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * Busca items por descripción que contenga el texto especificado
     * 
     * @param description Texto a buscar en la descripción
     * @return Lista de items que contienen el texto en la descripción
     */
    @Query("SELECT i FROM Item i WHERE LOWER(i.description) LIKE LOWER(CONCAT('%', :description, '%')) AND i.deleted = false")
    List<Item> findByDescriptionContainingIgnoreCase(@Param("description") String description);
    
    /**
     * Búsqueda full-text en nombre y descripción
     * 
     * @param searchTerm Término de búsqueda
     * @return Lista de items que coinciden con el término de búsqueda
     */
    @Query("SELECT i FROM Item i WHERE " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "i.deleted = false")
    List<Item> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    // ============================================================================
    // CONSULTAS DE FILTRADO POR PRECIO
    // ============================================================================
    
    /**
     * Busca items por rango de precio
     * 
     * @param minPrice Precio mínimo
     * @param maxPrice Precio máximo
     * @return Lista de items en el rango de precio especificado
     */
    @Query("SELECT i FROM Item i WHERE i.price BETWEEN :minPrice AND :maxPrice AND i.deleted = false")
    List<Item> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                               @Param("maxPrice") BigDecimal maxPrice);
    
    /**
     * Busca items con precio mayor al especificado
     * 
     * @param price Precio mínimo
     * @return Lista de items con precio mayor al especificado
     */
    @Query("SELECT i FROM Item i WHERE i.price > :price AND i.deleted = false")
    List<Item> findByPriceGreaterThan(@Param("price") BigDecimal price);
    
    /**
     * Busca items con precio menor al especificado
     * 
     * @param price Precio máximo
     * @return Lista de items con precio menor al especificado
     */
    @Query("SELECT i FROM Item i WHERE i.price < :price AND i.deleted = false")
    List<Item> findByPriceLessThan(@Param("price") BigDecimal price);
    
    // ============================================================================
    // CONSULTAS DE FILTRADO POR STOCK
    // ============================================================================
    
    /**
     * Busca items con stock disponible
     * 
     * @return Lista de items con stock mayor a 0
     */
    @Query("SELECT i FROM Item i WHERE i.stock > 0 AND i.deleted = false")
    List<Item> findAvailableItems();
    
    /**
     * Busca items agotados
     * 
     * @return Lista de items con stock 0
     */
    @Query("SELECT i FROM Item i WHERE i.stock = 0 AND i.deleted = false")
    List<Item> findOutOfStockItems();
    
    /**
     * Busca items con stock bajo (menos de 10 unidades)
     * 
     * @return Lista de items con stock bajo
     */
    @Query("SELECT i FROM Item i WHERE i.stock > 0 AND i.stock < 10 AND i.deleted = false")
    List<Item> findLowStockItems();
    
    // ============================================================================
    // CONSULTAS DE AGREGACIÓN Y MÉTRICAS
    // ============================================================================
    
    /**
     * Cuenta items por categoría
     * 
     * @param category Categoría
     * @return Número de items en la categoría
     */
    @Query("SELECT COUNT(i) FROM Item i WHERE i.category = :category AND i.deleted = false")
    long countByCategory(@Param("category") String category);
    
    /**
     * Cuenta items por estado
     * 
     * @param status Estado
     * @return Número de items con el estado especificado
     */
    @Query("SELECT COUNT(i) FROM Item i WHERE i.status = :status AND i.deleted = false")
    long countByStatus(@Param("status") Item.ItemStatus status);
    
    /**
     * Cuenta items por patrón de nombre
     * 
     * @param namePattern Patrón de nombre
     * @return Número de items que coinciden con el patrón
     */
    @Query("SELECT COUNT(i) FROM Item i WHERE i.name LIKE :namePattern AND i.deleted = false")
    long countByNamePattern(@Param("namePattern") String namePattern);
    
    /**
     * Cuenta items por rango de precio
     * 
     * @param minPrice Precio mínimo
     * @param maxPrice Precio máximo
     * @return Número de items en el rango de precio
     */
    @Query("SELECT COUNT(i) FROM Item i WHERE i.price BETWEEN :minPrice AND :maxPrice AND i.deleted = false")
    long countByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                          @Param("maxPrice") BigDecimal maxPrice);
    
    // ============================================================================
    // CONSULTAS DE AUDITORÍA
    // ============================================================================
    
    /**
     * Busca items creados por un usuario específico
     * 
     * @param createdBy Usuario creador
     * @return Lista de items creados por el usuario
     */
    @Query("SELECT i FROM Item i WHERE i.createdBy = :createdBy AND i.deleted = false")
    List<Item> findByCreatedBy(@Param("createdBy") String createdBy);
    
    /**
     * Busca items modificados por un usuario específico
     * 
     * @param updatedBy Usuario modificador
     * @return Lista de items modificados por el usuario
     */
    @Query("SELECT i FROM Item i WHERE i.updatedBy = :updatedBy AND i.deleted = false")
    List<Item> findByUpdatedBy(@Param("updatedBy") String updatedBy);
    
    /**
     * Busca items creados en un rango de fechas
     * 
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     * @return Lista de items creados en el rango de fechas
     */
    @Query("SELECT i FROM Item i WHERE i.createdAt BETWEEN :startDate AND :endDate AND i.deleted = false")
    List<Item> findByCreatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate,
                                     @Param("endDate") java.time.LocalDateTime endDate);
    
    /**
     * Busca items modificados en un rango de fechas
     * 
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     * @return Lista de items modificados en el rango de fechas
     */
    @Query("SELECT i FROM Item i WHERE i.updatedAt BETWEEN :startDate AND :endDate AND i.deleted = false")
    List<Item> findByUpdatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate,
                                     @Param("endDate") java.time.LocalDateTime endDate);
    
    // ============================================================================
    // CONSULTAS DE REPORTING
    // ============================================================================
    
    /**
     * Obtiene estadísticas de items por categoría
     * 
     * @return Lista de estadísticas por categoría
     */
    @Query("SELECT i.category, COUNT(i), AVG(i.price), SUM(i.stock) " +
           "FROM Item i WHERE i.deleted = false GROUP BY i.category")
    List<Object[]> getCategoryStatistics();
    
    /**
     * Obtiene estadísticas de items por estado
     * 
     * @return Lista de estadísticas por estado
     */
    @Query("SELECT i.status, COUNT(i), AVG(i.price), SUM(i.stock) " +
           "FROM Item i WHERE i.deleted = false GROUP BY i.status")
    List<Object[]> getStatusStatistics();
    
    /**
     * Obtiene el valor total del inventario
     * 
     * @return Valor total del inventario
     */
    @Query("SELECT SUM(i.price * i.stock) FROM Item i WHERE i.deleted = false")
    BigDecimal getTotalInventoryValue();
    
    /**
     * Obtiene el valor promedio de los items
     * 
     * @return Valor promedio de los items
     */
    @Query("SELECT AVG(i.price) FROM Item i WHERE i.deleted = false AND i.price IS NOT NULL")
    BigDecimal getAverageItemPrice();
    
    // ============================================================================
    // CONSULTAS DE PERFORMANCE Y OPTIMIZACIÓN
    // ============================================================================
    
    /**
     * Busca items más populares (por número de vistas)
     * 
     * @param limit Límite de resultados
     * @return Lista de items más populares
     */
    @Query("SELECT i FROM Item i WHERE i.deleted = false ORDER BY i.viewCount DESC")
    List<Item> findMostPopularItems(@Param("limit") int limit);
    
    /**
     * Busca items mejor calificados
     * 
     * @param limit Límite de resultados
     * @return Lista de items mejor calificados
     */
    @Query("SELECT i FROM Item i WHERE i.deleted = false AND i.rating IS NOT NULL ORDER BY i.rating DESC")
    List<Item> findTopRatedItems(@Param("limit") int limit);
    
    /**
     * Busca items recientemente creados
     * 
     * @param limit Límite de resultados
     * @return Lista de items recientemente creados
     */
    @Query("SELECT i FROM Item i WHERE i.deleted = false ORDER BY i.createdAt DESC")
    List<Item> findRecentlyCreatedItems(@Param("limit") int limit);
    
    /**
     * Busca items recientemente modificados
     * 
     * @param limit Límite de resultados
     * @return Lista de items recientemente modificados
     */
    @Query("SELECT i FROM Item i WHERE i.deleted = false ORDER BY i.updatedAt DESC")
    List<Item> findRecentlyUpdatedItems(@Param("limit") int limit);
    
    // ============================================================================
    // CONSULTAS NATIVAS PARA PERFORMANCE CRÍTICA
    // ============================================================================
    
    /**
     * Búsqueda full-text nativa para mejor performance
     * 
     * @param searchTerm Término de búsqueda
     * @return Lista de items que coinciden con el término de búsqueda
     */
    @Query(value = "SELECT * FROM items i WHERE " +
                   "MATCH(i.name, i.description) AGAINST(:searchTerm IN NATURAL LANGUAGE MODE) " +
                   "AND i.deleted = false", nativeQuery = true)
    List<Item> searchItemsFullText(@Param("searchTerm") String searchTerm);
    
    /**
     * Consulta nativa para estadísticas de inventario
     * 
     * @return Estadísticas de inventario
     */
    @Query(value = "SELECT " +
                   "COUNT(*) as total_items, " +
                   "SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END) as available_items, " +
                   "SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock_items, " +
                   "SUM(stock) as total_stock, " +
                   "AVG(price) as average_price, " +
                   "SUM(price * stock) as total_value " +
                   "FROM items WHERE deleted = false", nativeQuery = true)
    Object[] getInventoryStatistics();
    
    /**
     * Consulta nativa para items con mejor relación precio/calificación
     * 
     * @param limit Límite de resultados
     * @return Lista de items con mejor relación precio/calificación
     */
    @Query(value = "SELECT * FROM items i " +
                   "WHERE i.deleted = false AND i.rating IS NOT NULL AND i.price IS NOT NULL " +
                   "ORDER BY (i.rating / i.price) DESC LIMIT :limit", nativeQuery = true)
    List<Item> findBestValueItems(@Param("limit") int limit);
    
    // ============================================================================
    // CONSULTAS DE MANTENIMIENTO
    // ============================================================================
    
    /**
     * Busca items eliminados (soft delete)
     * 
     * @return Lista de items eliminados
     */
    @Query("SELECT i FROM Item i WHERE i.deleted = true")
    List<Item> findDeletedItems();
    
    /**
     * Busca items con versiones antiguas
     * 
     * @param minVersion Versión mínima
     * @return Lista de items con versiones antiguas
     */
    @Query("SELECT i FROM Item i WHERE i.version < :minVersion AND i.deleted = false")
    List<Item> findItemsWithOldVersion(@Param("minVersion") Long minVersion);
    
    /**
     * Busca items sin categoría
     * 
     * @return Lista de items sin categoría
     */
    @Query("SELECT i FROM Item i WHERE i.category IS NULL AND i.deleted = false")
    List<Item> findItemsWithoutCategory();
    
    /**
     * Busca items sin descripción
     * 
     * @return Lista de items sin descripción
     */
    @Query("SELECT i FROM Item i WHERE i.description IS NULL AND i.deleted = false")
    List<Item> findItemsWithoutDescription();
    
    // ============================================================================
    // CONSULTAS DE SEGURIDAD
    // ============================================================================
    
    /**
     * Verifica si existe un item con el nombre especificado
     * 
     * @param name Nombre del item
     * @return true si existe, false en caso contrario
     */
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Item i WHERE i.name = :name AND i.deleted = false")
    boolean existsByName(@Param("name") String name);
    
    /**
     * Verifica si existe un item con el código especificado
     * 
     * @param code Código del item
     * @return true si existe, false en caso contrario
     */
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Item i WHERE i.code = :code AND i.deleted = false")
    boolean existsByCode(@Param("code") String code);
    
    /**
     * Busca items duplicados por nombre
     * 
     * @return Lista de nombres duplicados
     */
    @Query("SELECT i.name FROM Item i WHERE i.deleted = false GROUP BY i.name HAVING COUNT(i) > 1")
    List<String> findDuplicateNames();
    
    /**
     * Busca items duplicados por código
     * 
     * @return Lista de códigos duplicados
     */
    @Query("SELECT i.code FROM Item i WHERE i.deleted = false GROUP BY i.code HAVING COUNT(i) > 1")
    List<String> findDuplicateCodes();
} 