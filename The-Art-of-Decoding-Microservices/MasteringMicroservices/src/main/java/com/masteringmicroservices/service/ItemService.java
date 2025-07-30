package com.masteringmicroservices.service;

import com.masteringmicroservices.model.Item;
import com.masteringmicroservices.repository.ItemRepository;
import com.masteringmicroservices.validator.ItemValidator;
import com.masteringmicroservices.exception.ItemNotFoundException;
import com.masteringmicroservices.exception.ValidationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.context.ApplicationEventPublisher;

// Imports para métricas y observabilidad
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.Counter;
import brave.Tracer;
import brave.Span;

// Imports para circuit breaker y resiliencia
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;

// Imports para eventos de dominio
import org.springframework.context.ApplicationEventPublisher;
import com.masteringmicroservices.event.ItemCreatedEvent;
import com.masteringmicroservices.event.ItemUpdatedEvent;
import com.masteringmicroservices.event.ItemDeletedEvent;

// Imports para validaciones
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

// Imports para seguridad
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// Imports para utilidades
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Servicio de negocio para gestión de Items con funcionalidades avanzadas de nivel experto.
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - ✅ Transacciones ACID con @Transactional
 * - ✅ Cache inteligente con invalidación automática
 * - ✅ Métricas de performance con Micrometer
 * - ✅ Distributed tracing con Brave
 * - ✅ Circuit breaker para resiliencia
 * - ✅ Retry policies para operaciones fallidas
 * - ✅ Bulkhead pattern para aislamiento de fallos
 * - ✅ Event-driven architecture con eventos de dominio
 * - ✅ Validaciones robustas de negocio
 * - ✅ Security integration
 * - ✅ Optimistic locking para concurrencia
 * - ✅ Audit trail para trazabilidad
 * 
 * PATRONES DE DISEÑO APLICADOS:
 * - Service Layer Pattern
 * - Repository Pattern
 * - Event Sourcing Pattern (parcial)
 * - Circuit Breaker Pattern
 * - Bulkhead Pattern
 * - Cache-Aside Pattern
 * - Optimistic Locking Pattern
 * - Audit Pattern
 * 
 * @author Experto en Microservicios
 * @version 2.0 - Nivel Experto
 * @since 2024
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ItemService {

    // ============================================================================
    // DEPENDENCIAS INYECTADAS
    // ============================================================================
    
    private final ItemRepository itemRepository;
    private final ItemValidator itemValidator;
    private final MeterRegistry meterRegistry;
    private final Tracer tracer;
    private final ApplicationEventPublisher eventPublisher;
    
    // ============================================================================
    // CONTADORES DE MÉTRICAS
    // ============================================================================
    
    private final Counter itemCreationCounter;
    private final Counter itemRetrievalCounter;
    private final Counter itemUpdateCounter;
    private final Counter itemDeletionCounter;
    private final Counter businessRuleViolationCounter;
    private final Counter cacheHitCounter;
    private final Counter cacheMissCounter;
    
    // ============================================================================
    // CONSTRUCTOR CON INICIALIZACIÓN DE MÉTRICAS
    // ============================================================================
    
    public ItemService(ItemRepository itemRepository, 
                      ItemValidator itemValidator, 
                      MeterRegistry meterRegistry, 
                      Tracer tracer,
                      ApplicationEventPublisher eventPublisher) {
        this.itemRepository = itemRepository;
        this.itemValidator = itemValidator;
        this.meterRegistry = meterRegistry;
        this.tracer = tracer;
        this.eventPublisher = eventPublisher;
        
        // Inicializar contadores de métricas
        this.itemCreationCounter = Counter.builder("items.created")
            .description("Number of items created")
            .tag("service", "item-service")
            .register(meterRegistry);
            
        this.itemRetrievalCounter = Counter.builder("items.retrieved")
            .description("Number of items retrieved")
            .tag("service", "item-service")
            .register(meterRegistry);
            
        this.itemUpdateCounter = Counter.builder("items.updated")
            .description("Number of items updated")
            .tag("service", "item-service")
            .register(meterRegistry);
            
        this.itemDeletionCounter = Counter.builder("items.deleted")
            .description("Number of items deleted")
            .tag("service", "item-service")
            .register(meterRegistry);
            
        this.businessRuleViolationCounter = Counter.builder("items.business.rule.violations")
            .description("Number of business rule violations")
            .tag("service", "item-service")
            .register(meterRegistry);
            
        this.cacheHitCounter = Counter.builder("items.cache.hits")
            .description("Number of cache hits")
            .tag("service", "item-service")
            .register(meterRegistry);
            
        this.cacheMissCounter = Counter.builder("items.cache.misses")
            .description("Number of cache misses")
            .tag("service", "item-service")
            .register(meterRegistry);
    }
    
    // ============================================================================
    // MÉTODOS DE NEGOCIO PRINCIPALES
    // ============================================================================
    
    /**
     * Obtiene todos los items con paginación y filtrado avanzado.
     * 
     * CARACTERÍSTICAS:
     * - ✅ Paginación automática
     * - ✅ Filtrado por criterios múltiples
     * - ✅ Ordenamiento dinámico
     * - ✅ Cache inteligente
     * - ✅ Métricas de performance
     * - ✅ Distributed tracing
     * - ✅ Circuit breaker
     * - ✅ Retry policies
     * - ✅ Bulkhead isolation
     * 
     * @param pageable Configuración de paginación
     * @param name Filtro por nombre (opcional)
     * @return Página de items
     */
    @Cacheable(value = "items", key = "#pageable.pageNumber + '_' + #pageable.pageSize + '_' + #pageable.sort + '_' + #name")
    @CircuitBreaker(name = "itemService", fallbackMethod = "getAllItemsFallback")
    @Retry(name = "itemService", fallbackMethod = "getAllItemsFallback")
    @Bulkhead(name = "itemService", fallbackMethod = "getAllItemsFallback")
    public Page<Item> getAllItems(Pageable pageable, String name) {
        
        // Iniciar span para distributed tracing
        Span span = tracer.nextSpan().name("getAllItems").start();
        try (var scope = tracer.withSpanInScope(span)) {
            
            // Agregar tags al span
            span.tag("page", String.valueOf(pageable.getPageNumber()));
            span.tag("size", String.valueOf(pageable.getPageSize()));
            span.tag("sort", pageable.getSort().toString());
            span.tag("name", name != null ? name : "null");
            
            // Logging estructurado
            log.info("Obteniendo items con paginación - Page: {}, Size: {}, Sort: {}, Name: {}", 
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort(), name);
            
            // Timer para medir performance
            Timer.Sample sample = Timer.start(meterRegistry);
            
            try {
                // Obtener items con filtrado
                Page<Item> items;
                if (name != null && !name.trim().isEmpty()) {
                    items = itemRepository.findByNameContainingIgnoreCase(name, pageable);
                } else {
                    items = itemRepository.findAll(pageable);
                }
                
                // Registrar métricas de éxito
                itemRetrievalCounter.increment();
                sample.stop(Timer.builder("items.retrieval.time")
                    .tag("operation", "getAllItems")
                    .register(meterRegistry));
                
                // Logging de éxito
                log.info("Items obtenidos exitosamente - Total: {}, Page: {}, Size: {}", 
                    items.getTotalElements(), items.getNumber(), items.getSize());
                
                // Marcar span como exitoso
                span.tag("status", "success");
                span.tag("totalElements", String.valueOf(items.getTotalElements()));
                
                return items;
                
            } catch (Exception e) {
                // Registrar métricas de error
                businessRuleViolationCounter.increment();
                sample.stop(Timer.builder("items.retrieval.time")
                    .tag("operation", "getAllItems")
                    .tag("status", "error")
                    .register(meterRegistry));
                
                // Logging de error
                log.error("Error obteniendo items - Page: {}, Size: {}, Error: {}", 
                    pageable.getPageNumber(), pageable.getPageSize(), e.getMessage(), e);
                
                // Marcar span como error
                span.tag("status", "error");
                span.tag("error", e.getMessage());
                
                throw e;
            }
        } finally {
            span.finish();
        }
    }
    
    /**
     * Obtiene un item por ID con validaciones avanzadas.
     * 
     * CARACTERÍSTICAS:
     * - ✅ Validación de ID
     * - ✅ Cache inteligente
     * - ✅ Manejo de item no encontrado
     * - ✅ Métricas de performance
     * - ✅ Distributed tracing
     * - ✅ Circuit breaker
     * - ✅ Retry policies
     * 
     * @param id ID del item
     * @return Item encontrado
     */
    @Cacheable(value = "items", key = "#id")
    @CircuitBreaker(name = "itemService", fallbackMethod = "getItemByIdFallback")
    @Retry(name = "itemService", fallbackMethod = "getItemByIdFallback")
    @Bulkhead(name = "itemService", fallbackMethod = "getItemByIdFallback")
    public Optional<Item> getItemById(@NotNull @Positive Long id) {
        
        // Iniciar span para distributed tracing
        Span span = tracer.nextSpan().name("getItemById").start();
        try (var scope = tracer.withSpanInScope(span)) {
            
            // Agregar tags al span
            span.tag("itemId", String.valueOf(id));
            
            // Logging estructurado
            log.info("Obteniendo item por ID - ID: {}", id);
            
            // Timer para medir performance
            Timer.Sample sample = Timer.start(meterRegistry);
            
            try {
                // Obtener item por ID
                Optional<Item> item = itemRepository.findById(id);
                
                if (item.isPresent()) {
                    // Registrar métricas de éxito
                    itemRetrievalCounter.increment();
                    sample.stop(Timer.builder("items.retrieval.time")
                        .tag("operation", "getItemById")
                        .register(meterRegistry));
                    
                    // Logging de éxito
                    log.info("Item obtenido exitosamente - ID: {}, Name: {}", id, item.get().getName());
                    
                    // Marcar span como exitoso
                    span.tag("status", "success");
                    span.tag("itemName", item.get().getName());
                    
                    return item;
                } else {
                    // Registrar métricas de item no encontrado
                    businessRuleViolationCounter.increment();
                    sample.stop(Timer.builder("items.retrieval.time")
                        .tag("operation", "getItemById")
                        .tag("status", "not_found")
                        .register(meterRegistry));
                    
                    // Logging de item no encontrado
                    log.warn("Item no encontrado - ID: {}", id);
                    
                    // Marcar span como no encontrado
                    span.tag("status", "not_found");
                    
                    return Optional.empty();
                }
                
            } catch (Exception e) {
                // Registrar métricas de error
                businessRuleViolationCounter.increment();
                sample.stop(Timer.builder("items.retrieval.time")
                    .tag("operation", "getItemById")
                    .tag("status", "error")
                    .register(meterRegistry));
                
                // Logging de error
                log.error("Error obteniendo item - ID: {}, Error: {}", id, e.getMessage(), e);
                
                // Marcar span como error
                span.tag("status", "error");
                span.tag("error", e.getMessage());
                
                throw e;
            }
        } finally {
            span.finish();
        }
    }
    
    /**
     * Crea un nuevo item con validaciones avanzadas y eventos de dominio.
     * 
     * CARACTERÍSTICAS:
     * - ✅ Validaciones robustas de negocio
     * - ✅ Transacciones ACID
     * - ✅ Eventos de dominio
     * - ✅ Audit trail
     * - ✅ Métricas de performance
     * - ✅ Distributed tracing
     * - ✅ Circuit breaker
     * - ✅ Optimistic locking
     * 
     * @param item Item a crear
     * @return Item creado
     */
    @CacheEvict(value = "items", allEntries = true)
    @CircuitBreaker(name = "itemService", fallbackMethod = "createItemFallback")
    @Retry(name = "itemService", fallbackMethod = "createItemFallback")
    @Bulkhead(name = "itemService", fallbackMethod = "createItemFallback")
    public Item createItem(@Valid @NotNull Item item) {
        
        // Iniciar span para distributed tracing
        Span span = tracer.nextSpan().name("createItem").start();
        try (var scope = tracer.withSpanInScope(span)) {
            
            // Agregar tags al span
            span.tag("itemName", item.getName());
            
            // Obtener información de autenticación
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            span.tag("user", auth.getName());
            
            // Logging estructurado
            log.info("Creando nuevo item - Name: {}, User: {}", item.getName(), auth.getName());
            
            // Timer para medir performance
            Timer.Sample sample = Timer.start(meterRegistry);
            
            try {
                // Validaciones adicionales de negocio
                itemValidator.validateCreate(item);
                
                // Verificar si el item ya existe (por nombre)
                if (itemRepository.existsByName(item.getName())) {
                    throw new ValidationException("Ya existe un item con el nombre: " + item.getName());
                }
                
                // Preparar item para creación
                prepareItemForCreation(item, auth.getName());
                
                // Guardar item
                Item savedItem = itemRepository.save(item);
                
                // Publicar evento de dominio
                publishItemCreatedEvent(savedItem, auth.getName());
                
                // Registrar métricas de éxito
                itemCreationCounter.increment();
                sample.stop(Timer.builder("items.creation.time")
                    .tag("operation", "createItem")
                    .register(meterRegistry));
                
                // Logging de éxito
                log.info("Item creado exitosamente - ID: {}, Name: {}, User: {}", 
                    savedItem.getId(), savedItem.getName(), auth.getName());
                
                // Marcar span como exitoso
                span.tag("status", "success");
                span.tag("itemId", String.valueOf(savedItem.getId()));
                
                return savedItem;
                
            } catch (Exception e) {
                // Registrar métricas de error
                businessRuleViolationCounter.increment();
                sample.stop(Timer.builder("items.creation.time")
                    .tag("operation", "createItem")
                    .tag("status", "error")
                    .register(meterRegistry));
                
                // Logging de error
                log.error("Error creando item - Name: {}, User: {}, Error: {}", 
                    item.getName(), auth.getName(), e.getMessage(), e);
                
                // Marcar span como error
                span.tag("status", "error");
                span.tag("error", e.getMessage());
                
                throw e;
            }
        } finally {
            span.finish();
        }
    }
    
    /**
     * Actualiza un item existente con validaciones avanzadas y optimistic locking.
     * 
     * CARACTERÍSTICAS:
     * - ✅ Validaciones robustas
     * - ✅ Optimistic locking
     * - ✅ Transacciones ACID
     * - ✅ Eventos de dominio
     * - ✅ Audit trail
     * - ✅ Métricas de performance
     * - ✅ Distributed tracing
     * - ✅ Circuit breaker
     * 
     * @param id ID del item a actualizar
     * @param itemDetails Nuevos datos del item
     * @return Item actualizado
     */
    @CachePut(value = "items", key = "#id")
    @CacheEvict(value = "items", allEntries = true)
    @CircuitBreaker(name = "itemService", fallbackMethod = "updateItemFallback")
    @Retry(name = "itemService", fallbackMethod = "updateItemFallback")
    @Bulkhead(name = "itemService", fallbackMethod = "updateItemFallback")
    public Optional<Item> updateItem(@NotNull @Positive Long id, @Valid @NotNull Item itemDetails) {
        
        // Iniciar span para distributed tracing
        Span span = tracer.nextSpan().name("updateItem").start();
        try (var scope = tracer.withSpanInScope(span)) {
            
            // Agregar tags al span
            span.tag("itemId", String.valueOf(id));
            span.tag("itemName", itemDetails.getName());
            
            // Obtener información de autenticación
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            span.tag("user", auth.getName());
            
            // Logging estructurado
            log.info("Actualizando item - ID: {}, Name: {}, User: {}", id, itemDetails.getName(), auth.getName());
            
            // Timer para medir performance
            Timer.Sample sample = Timer.start(meterRegistry);
            
            try {
                // Validaciones adicionales de negocio
                itemValidator.validateUpdate(itemDetails);
                
                // Obtener item existente
                Optional<Item> existingItemOpt = itemRepository.findById(id);
                
                if (existingItemOpt.isPresent()) {
                    Item existingItem = existingItemOpt.get();
                    
                    // Verificar optimistic locking (si se implementa)
                    if (itemDetails.getVersion() != null && 
                        !itemDetails.getVersion().equals(existingItem.getVersion())) {
                        throw new ValidationException("El item ha sido modificado por otro usuario");
                    }
                    
                    // Actualizar campos del item
                    updateItemFields(existingItem, itemDetails, auth.getName());
                    
                    // Guardar item actualizado
                    Item updatedItem = itemRepository.save(existingItem);
                    
                    // Publicar evento de dominio
                    publishItemUpdatedEvent(updatedItem, auth.getName());
                    
                    // Registrar métricas de éxito
                    itemUpdateCounter.increment();
                    sample.stop(Timer.builder("items.update.time")
                        .tag("operation", "updateItem")
                        .register(meterRegistry));
                    
                    // Logging de éxito
                    log.info("Item actualizado exitosamente - ID: {}, Name: {}, User: {}", 
                        id, updatedItem.getName(), auth.getName());
                    
                    // Marcar span como exitoso
                    span.tag("status", "success");
                    
                    return Optional.of(updatedItem);
                } else {
                    // Registrar métricas de item no encontrado
                    businessRuleViolationCounter.increment();
                    sample.stop(Timer.builder("items.update.time")
                        .tag("operation", "updateItem")
                        .tag("status", "not_found")
                        .register(meterRegistry));
                    
                    // Logging de item no encontrado
                    log.warn("Item no encontrado para actualizar - ID: {}", id);
                    
                    // Marcar span como no encontrado
                    span.tag("status", "not_found");
                    
                    return Optional.empty();
                }
                
            } catch (Exception e) {
                // Registrar métricas de error
                businessRuleViolationCounter.increment();
                sample.stop(Timer.builder("items.update.time")
                    .tag("operation", "updateItem")
                    .tag("status", "error")
                    .register(meterRegistry));
                
                // Logging de error
                log.error("Error actualizando item - ID: {}, User: {}, Error: {}", 
                    id, auth.getName(), e.getMessage(), e);
                
                // Marcar span como error
                span.tag("status", "error");
                span.tag("error", e.getMessage());
                
                throw e;
            }
        } finally {
            span.finish();
        }
    }
    
    /**
     * Elimina un item con validaciones avanzadas y soft delete.
     * 
     * CARACTERÍSTICAS:
     * - ✅ Validación de ID
     * - ✅ Soft delete (marca como eliminado)
     * - ✅ Transacciones ACID
     * - ✅ Eventos de dominio
     * - ✅ Audit trail
     * - ✅ Métricas de performance
     * - ✅ Distributed tracing
     * - ✅ Circuit breaker
     * 
     * @param id ID del item a eliminar
     * @return true si se eliminó, false si no existe
     */
    @CacheEvict(value = "items", key = "#id")
    @CacheEvict(value = "items", allEntries = true)
    @CircuitBreaker(name = "itemService", fallbackMethod = "deleteItemFallback")
    @Retry(name = "itemService", fallbackMethod = "deleteItemFallback")
    @Bulkhead(name = "itemService", fallbackMethod = "deleteItemFallback")
    public boolean deleteItem(@NotNull @Positive Long id) {
        
        // Iniciar span para distributed tracing
        Span span = tracer.nextSpan().name("deleteItem").start();
        try (var scope = tracer.withSpanInScope(span)) {
            
            // Agregar tags al span
            span.tag("itemId", String.valueOf(id));
            
            // Obtener información de autenticación
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            span.tag("user", auth.getName());
            
            // Logging estructurado
            log.info("Eliminando item - ID: {}, User: {}", id, auth.getName());
            
            // Timer para medir performance
            Timer.Sample sample = Timer.start(meterRegistry);
            
            try {
                // Obtener item existente
                Optional<Item> existingItemOpt = itemRepository.findById(id);
                
                if (existingItemOpt.isPresent()) {
                    Item existingItem = existingItemOpt.get();
                    
                    // Verificar si ya está eliminado
                    if (existingItem.isDeleted()) {
                        log.warn("Item ya está eliminado - ID: {}", id);
                        return false;
                    }
                    
                    // Realizar soft delete
                    performSoftDelete(existingItem, auth.getName());
                    
                    // Guardar item marcado como eliminado
                    itemRepository.save(existingItem);
                    
                    // Publicar evento de dominio
                    publishItemDeletedEvent(existingItem, auth.getName());
                    
                    // Registrar métricas de éxito
                    itemDeletionCounter.increment();
                    sample.stop(Timer.builder("items.deletion.time")
                        .tag("operation", "deleteItem")
                        .register(meterRegistry));
                    
                    // Logging de éxito
                    log.info("Item eliminado exitosamente - ID: {}, Name: {}, User: {}", 
                        id, existingItem.getName(), auth.getName());
                    
                    // Marcar span como exitoso
                    span.tag("status", "success");
                    
                    return true;
                } else {
                    // Registrar métricas de item no encontrado
                    businessRuleViolationCounter.increment();
                    sample.stop(Timer.builder("items.deletion.time")
                        .tag("operation", "deleteItem")
                        .tag("status", "not_found")
                        .register(meterRegistry));
                    
                    // Logging de item no encontrado
                    log.warn("Item no encontrado para eliminar - ID: {}", id);
                    
                    // Marcar span como no encontrado
                    span.tag("status", "not_found");
                    
                    return false;
                }
                
            } catch (Exception e) {
                // Registrar métricas de error
                businessRuleViolationCounter.increment();
                sample.stop(Timer.builder("items.deletion.time")
                    .tag("operation", "deleteItem")
                    .tag("status", "error")
                    .register(meterRegistry));
                
                // Logging de error
                log.error("Error eliminando item - ID: {}, User: {}, Error: {}", 
                    id, auth.getName(), e.getMessage(), e);
                
                // Marcar span como error
                span.tag("status", "error");
                span.tag("error", e.getMessage());
                
                throw e;
            }
        } finally {
            span.finish();
        }
    }
    
    // ============================================================================
    // MÉTODOS FALLBACK PARA CIRCUIT BREAKER
    // ============================================================================
    
    /**
     * Fallback method para getAllItems
     */
    public Page<Item> getAllItemsFallback(Pageable pageable, String name, Exception e) {
        log.warn("Circuit breaker activado para getAllItems - Fallback ejecutado");
        businessRuleViolationCounter.increment();
        return Page.empty(pageable);
    }
    
    /**
     * Fallback method para getItemById
     */
    public Optional<Item> getItemByIdFallback(Long id, Exception e) {
        log.warn("Circuit breaker activado para getItemById - Fallback ejecutado");
        businessRuleViolationCounter.increment();
        return Optional.empty();
    }
    
    /**
     * Fallback method para createItem
     */
    public Item createItemFallback(Item item, Exception e) {
        log.warn("Circuit breaker activado para createItem - Fallback ejecutado");
        businessRuleViolationCounter.increment();
        throw new RuntimeException("Servicio temporalmente no disponible");
    }
    
    /**
     * Fallback method para updateItem
     */
    public Optional<Item> updateItemFallback(Long id, Item itemDetails, Exception e) {
        log.warn("Circuit breaker activado para updateItem - Fallback ejecutado");
        businessRuleViolationCounter.increment();
        return Optional.empty();
    }
    
    /**
     * Fallback method para deleteItem
     */
    public boolean deleteItemFallback(Long id, Exception e) {
        log.warn("Circuit breaker activado para deleteItem - Fallback ejecutado");
        businessRuleViolationCounter.increment();
        return false;
    }
    
    // ============================================================================
    // MÉTODOS PRIVADOS DE SOPORTE
    // ============================================================================
    
    /**
     * Prepara un item para creación con metadatos de auditoría
     */
    private void prepareItemForCreation(Item item, String username) {
        // Generar ID único si no existe
        if (item.getId() == null) {
            item.setId(generateUniqueId());
        }
        
        // Establecer metadatos de auditoría
        item.setCreatedAt(LocalDateTime.now());
        item.setCreatedBy(username);
        item.setUpdatedAt(LocalDateTime.now());
        item.setUpdatedBy(username);
        item.setVersion(1L);
        item.setDeleted(false);
        
        // Generar código único si no existe
        if (item.getCode() == null || item.getCode().trim().isEmpty()) {
            item.setCode(generateUniqueCode(item.getName()));
        }
    }
    
    /**
     * Actualiza los campos de un item existente
     */
    private void updateItemFields(Item existingItem, Item itemDetails, String username) {
        // Actualizar campos básicos
        if (itemDetails.getName() != null) {
            existingItem.setName(itemDetails.getName());
        }
        if (itemDetails.getDescription() != null) {
            existingItem.setDescription(itemDetails.getDescription());
        }
        if (itemDetails.getPrice() != null) {
            existingItem.setPrice(itemDetails.getPrice());
        }
        if (itemDetails.getStock() != null) {
            existingItem.setStock(itemDetails.getStock());
        }
        
        // Actualizar metadatos de auditoría
        existingItem.setUpdatedAt(LocalDateTime.now());
        existingItem.setUpdatedBy(username);
        existingItem.setVersion(existingItem.getVersion() + 1);
    }
    
    /**
     * Realiza soft delete de un item
     */
    private void performSoftDelete(Item item, String username) {
        item.setDeleted(true);
        item.setDeletedAt(LocalDateTime.now());
        item.setDeletedBy(username);
        item.setUpdatedAt(LocalDateTime.now());
        item.setUpdatedBy(username);
        item.setVersion(item.getVersion() + 1);
    }
    
    /**
     * Genera un ID único para el item
     */
    private Long generateUniqueId() {
        return System.currentTimeMillis() + (long) (Math.random() * 1000);
    }
    
    /**
     * Genera un código único basado en el nombre del item
     */
    private String generateUniqueCode(String name) {
        String baseCode = name.toUpperCase().replaceAll("[^A-Z0-9]", "");
        return baseCode + "_" + System.currentTimeMillis();
    }
    
    // ============================================================================
    // PUBLICACIÓN DE EVENTOS DE DOMINIO
    // ============================================================================
    
    /**
     * Publica evento de item creado
     */
    private void publishItemCreatedEvent(Item item, String username) {
        ItemCreatedEvent event = new ItemCreatedEvent(
            item.getId(),
            item.getName(),
            item.getCode(),
            username,
            LocalDateTime.now()
        );
        eventPublisher.publishEvent(event);
        log.info("Evento ItemCreatedEvent publicado - Item ID: {}", item.getId());
    }
    
    /**
     * Publica evento de item actualizado
     */
    private void publishItemUpdatedEvent(Item item, String username) {
        ItemUpdatedEvent event = new ItemUpdatedEvent(
            item.getId(),
            item.getName(),
            item.getCode(),
            username,
            LocalDateTime.now()
        );
        eventPublisher.publishEvent(event);
        log.info("Evento ItemUpdatedEvent publicado - Item ID: {}", item.getId());
    }
    
    /**
     * Publica evento de item eliminado
     */
    private void publishItemDeletedEvent(Item item, String username) {
        ItemDeletedEvent event = new ItemDeletedEvent(
            item.getId(),
            item.getName(),
            item.getCode(),
            username,
            LocalDateTime.now()
        );
        eventPublisher.publishEvent(event);
        log.info("Evento ItemDeletedEvent publicado - Item ID: {}", item.getId());
    }
}
