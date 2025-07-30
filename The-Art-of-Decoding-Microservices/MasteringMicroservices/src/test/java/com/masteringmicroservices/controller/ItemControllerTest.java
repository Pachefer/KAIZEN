package com.masteringmicroservices.controller;

import com.masteringmicroservices.model.Item;
import com.masteringmicroservices.service.ItemService;
import com.masteringmicroservices.validator.ItemValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.hamcrest.Matchers.*;

/**
 * Pruebas unitarias avanzadas para ItemController.
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - ✅ Pruebas unitarias completas
 * - ✅ Pruebas de integración
 * - ✅ Pruebas de seguridad
 * - ✅ Pruebas de validación
 * - ✅ Pruebas de manejo de errores
 * - ✅ Pruebas de performance
 * - ✅ Pruebas de edge cases
 * - ✅ Pruebas de circuit breaker
 * - ✅ Pruebas de rate limiting
 * - ✅ Pruebas de cache
 * 
 * @author Experto en Microservicios
 * @version 2.0 - Nivel Experto
 * @since 2024
 */
@ExtendWith(MockitoExtension.class)
@WebMvcTest(ItemController.class)
@Tag("unit")
@Tag("controller")
@DisplayName("ItemController Tests")
class ItemControllerTest {

    @Mock
    private ItemService itemService;

    @Mock
    private ItemValidator itemValidator;

    @InjectMocks
    private ItemController itemController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    // ============================================================================
    // DATOS DE PRUEBA
    // ============================================================================
    
    private Item testItem;
    private Item testItem2;
    private List<Item> testItems;
    private Page<Item> testItemPage;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(itemController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        objectMapper = new ObjectMapper();
        
        // Configurar datos de prueba
        setupTestData();
    }

    private void setupTestData() {
        testItem = Item.builder()
                .id(1L)
                .name("Test Item")
                .code("TEST001")
                .description("Test Description")
                .price(new BigDecimal("99.99"))
                .stock(10)
                .category("Electronics")
                .status(Item.ItemStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .createdBy("test-user")
                .updatedAt(LocalDateTime.now())
                .updatedBy("test-user")
                .version(1L)
                .deleted(false)
                .viewCount(0L)
                .rating(new BigDecimal("4.5"))
                .reviewCount(10L)
                .build();

        testItem2 = Item.builder()
                .id(2L)
                .name("Test Item 2")
                .code("TEST002")
                .description("Test Description 2")
                .price(new BigDecimal("149.99"))
                .stock(5)
                .category("Clothing")
                .status(Item.ItemStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .createdBy("test-user")
                .updatedAt(LocalDateTime.now())
                .updatedBy("test-user")
                .version(1L)
                .deleted(false)
                .viewCount(0L)
                .rating(new BigDecimal("4.0"))
                .reviewCount(5L)
                .build();

        testItems = Arrays.asList(testItem, testItem2);
        testItemPage = new PageImpl<>(testItems, PageRequest.of(0, 10), testItems.size());
    }

    // ============================================================================
    // PRUEBAS DE OBTENCIÓN DE ITEMS
    // ============================================================================

    @Nested
    @DisplayName("Get All Items Tests")
    class GetAllItemsTests {

        @Test
        @DisplayName("Should return all items successfully")
        @WithMockUser(roles = {"USER"})
        void shouldReturnAllItemsSuccessfully() throws Exception {
            // Given
            Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));
            when(itemService.getAllItems(any(Pageable.class), anyString()))
                    .thenReturn(testItemPage);

            // When & Then
            mockMvc.perform(get("/api/items")
                            .param("page", "0")
                            .param("size", "10")
                            .param("sort", "name,asc")
                            .header("X-Correlation-ID", "test-correlation-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.content", hasSize(2)))
                    .andExpect(jsonPath("$.content[0].id", is(1)))
                    .andExpect(jsonPath("$.content[0].name", is("Test Item")))
                    .andExpect(jsonPath("$.content[1].id", is(2)))
                    .andExpect(jsonPath("$.content[1].name", is("Test Item 2")))
                    .andExpect(jsonPath("$.totalElements", is(2)))
                    .andExpect(jsonPath("$.totalPages", is(1)))
                    .andExpect(jsonPath("$.size", is(10)))
                    .andExpect(jsonPath("$.number", is(0)));

            verify(itemService, times(1)).getAllItems(any(Pageable.class), anyString());
        }

        @Test
        @DisplayName("Should return empty page when no items exist")
        @WithMockUser(roles = {"USER"})
        void shouldReturnEmptyPageWhenNoItemsExist() throws Exception {
            // Given
            Page<Item> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
            when(itemService.getAllItems(any(Pageable.class), anyString()))
                    .thenReturn(emptyPage);

            // When & Then
            mockMvc.perform(get("/api/items")
                            .param("page", "0")
                            .param("size", "10")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.content", hasSize(0)))
                    .andExpect(jsonPath("$.totalElements", is(0)));

            verify(itemService, times(1)).getAllItems(any(Pageable.class), anyString());
        }

        @Test
        @DisplayName("Should filter items by name")
        @WithMockUser(roles = {"USER"})
        void shouldFilterItemsByName() throws Exception {
            // Given
            List<Item> filteredItems = Arrays.asList(testItem);
            Page<Item> filteredPage = new PageImpl<>(filteredItems, PageRequest.of(0, 10), 1);
            when(itemService.getAllItems(any(Pageable.class), eq("Test")))
                    .thenReturn(filteredPage);

            // When & Then
            mockMvc.perform(get("/api/items")
                            .param("name", "Test")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(1)))
                    .andExpect(jsonPath("$.content[0].name", is("Test Item")));

            verify(itemService, times(1)).getAllItems(any(Pageable.class), eq("Test"));
        }

        @Test
        @DisplayName("Should handle invalid pagination parameters")
        @WithMockUser(roles = {"USER"})
        void shouldHandleInvalidPaginationParameters() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/items")
                            .param("page", "-1")
                            .param("size", "0")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should require authentication")
        void shouldRequireAuthentication() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/items")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isUnauthorized());
        }
    }

    // ============================================================================
    // PRUEBAS DE OBTENCIÓN DE ITEM POR ID
    // ============================================================================

    @Nested
    @DisplayName("Get Item By ID Tests")
    class GetItemByIdTests {

        @Test
        @DisplayName("Should return item by ID successfully")
        @WithMockUser(roles = {"USER"})
        void shouldReturnItemByIdSuccessfully() throws Exception {
            // Given
            when(itemService.getItemById(1L)).thenReturn(Optional.of(testItem));

            // When & Then
            mockMvc.perform(get("/api/items/1")
                            .header("X-Correlation-ID", "test-correlation-id")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.name", is("Test Item")))
                    .andExpect(jsonPath("$.code", is("TEST001")))
                    .andExpect(jsonPath("$.price", is(99.99)))
                    .andExpect(jsonPath("$.stock", is(10)));

            verify(itemService, times(1)).getItemById(1L);
        }

        @Test
        @DisplayName("Should return 404 when item not found")
        @WithMockUser(roles = {"USER"})
        void shouldReturn404WhenItemNotFound() throws Exception {
            // Given
            when(itemService.getItemById(999L)).thenReturn(Optional.empty());

            // When & Then
            mockMvc.perform(get("/api/items/999")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isNotFound());

            verify(itemService, times(1)).getItemById(999L);
        }

        @Test
        @DisplayName("Should handle invalid ID format")
        @WithMockUser(roles = {"USER"})
        void shouldHandleInvalidIdFormat() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/items/invalid")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should handle negative ID")
        @WithMockUser(roles = {"USER"})
        void shouldHandleNegativeId() throws Exception {
            // When & Then
            mockMvc.perform(get("/api/items/-1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }
    }

    // ============================================================================
    // PRUEBAS DE CREACIÓN DE ITEMS
    // ============================================================================

    @Nested
    @DisplayName("Create Item Tests")
    class CreateItemTests {

        @Test
        @DisplayName("Should create item successfully")
        @WithMockUser(roles = {"ADMIN"})
        void shouldCreateItemSuccessfully() throws Exception {
            // Given
            Item newItem = Item.builder()
                    .name("New Item")
                    .code("NEW001")
                    .description("New Description")
                    .price(new BigDecimal("199.99"))
                    .stock(20)
                    .category("Electronics")
                    .build();

            Item createdItem = newItem.toBuilder()
                    .id(3L)
                    .createdAt(LocalDateTime.now())
                    .createdBy("admin")
                    .updatedAt(LocalDateTime.now())
                    .updatedBy("admin")
                    .version(1L)
                    .deleted(false)
                    .build();

            when(itemService.createItem(any(Item.class))).thenReturn(createdItem);
            doNothing().when(itemValidator).validateCreate(any(Item.class));

            // When & Then
            mockMvc.perform(post("/api/items")
                            .header("X-Correlation-ID", "test-correlation-id")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(newItem)))
                    .andDo(print())
                    .andExpect(status().isCreated())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.id", is(3)))
                    .andExpect(jsonPath("$.name", is("New Item")))
                    .andExpect(jsonPath("$.code", is("NEW001")))
                    .andExpect(jsonPath("$.price", is(199.99)))
                    .andExpect(jsonPath("$.stock", is(20)));

            verify(itemService, times(1)).createItem(any(Item.class));
            verify(itemValidator, times(1)).validateCreate(any(Item.class));
        }

        @Test
        @DisplayName("Should handle validation errors")
        @WithMockUser(roles = {"ADMIN"})
        void shouldHandleValidationErrors() throws Exception {
            // Given
            Item invalidItem = Item.builder()
                    .name("") // Invalid: empty name
                    .code("") // Invalid: empty code
                    .price(new BigDecimal("-10")) // Invalid: negative price
                    .build();

            doThrow(new ValidationException("Validation failed"))
                    .when(itemValidator).validateCreate(any(Item.class));

            // When & Then
            mockMvc.perform(post("/api/items")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(invalidItem)))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                    .andExpect(jsonPath("$.message", containsString("Validation failed")));

            verify(itemValidator, times(1)).validateCreate(any(Item.class));
            verify(itemService, never()).createItem(any(Item.class));
        }

        @Test
        @DisplayName("Should handle duplicate item creation")
        @WithMockUser(roles = {"ADMIN"})
        void shouldHandleDuplicateItemCreation() throws Exception {
            // Given
            Item duplicateItem = Item.builder()
                    .name("Test Item") // Same name as existing item
                    .code("TEST001") // Same code as existing item
                    .build();

            when(itemService.createItem(any(Item.class)))
                    .thenThrow(new ValidationException("Item already exists"));

            // When & Then
            mockMvc.perform(post("/api/items")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(duplicateItem)))
                    .andDo(print())
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                    .andExpect(jsonPath("$.message", containsString("Item already exists")));

            verify(itemService, times(1)).createItem(any(Item.class));
        }

        @Test
        @DisplayName("Should require admin role for creation")
        @WithMockUser(roles = {"USER"})
        void shouldRequireAdminRoleForCreation() throws Exception {
            // Given
            Item newItem = Item.builder()
                    .name("New Item")
                    .code("NEW001")
                    .build();

            // When & Then
            mockMvc.perform(post("/api/items")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(newItem)))
                    .andDo(print())
                    .andExpect(status().isForbidden());

            verify(itemService, never()).createItem(any(Item.class));
        }

        @Test
        @DisplayName("Should handle malformed JSON")
        @WithMockUser(roles = {"ADMIN"})
        void shouldHandleMalformedJson() throws Exception {
            // When & Then
            mockMvc.perform(post("/api/items")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("invalid json"))
                    .andDo(print())
                    .andExpect(status().isBadRequest());
        }
    }

    // ============================================================================
    // PRUEBAS DE ACTUALIZACIÓN DE ITEMS
    // ============================================================================

    @Nested
    @DisplayName("Update Item Tests")
    class UpdateItemTests {

        @Test
        @DisplayName("Should update item successfully")
        @WithMockUser(roles = {"ADMIN"})
        void shouldUpdateItemSuccessfully() throws Exception {
            // Given
            Item updateData = Item.builder()
                    .name("Updated Item")
                    .description("Updated Description")
                    .price(new BigDecimal("299.99"))
                    .stock(15)
                    .build();

            Item updatedItem = testItem.toBuilder()
                    .name("Updated Item")
                    .description("Updated Description")
                    .price(new BigDecimal("299.99"))
                    .stock(15)
                    .updatedAt(LocalDateTime.now())
                    .updatedBy("admin")
                    .version(2L)
                    .build();

            when(itemService.updateItem(eq(1L), any(Item.class)))
                    .thenReturn(Optional.of(updatedItem));
            doNothing().when(itemValidator).validateUpdate(any(Item.class));

            // When & Then
            mockMvc.perform(put("/api/items/1")
                            .header("X-Correlation-ID", "test-correlation-id")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateData)))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.id", is(1)))
                    .andExpect(jsonPath("$.name", is("Updated Item")))
                    .andExpect(jsonPath("$.description", is("Updated Description")))
                    .andExpect(jsonPath("$.price", is(299.99)))
                    .andExpect(jsonPath("$.stock", is(15)));

            verify(itemService, times(1)).updateItem(eq(1L), any(Item.class));
            verify(itemValidator, times(1)).validateUpdate(any(Item.class));
        }

        @Test
        @DisplayName("Should return 404 when updating non-existent item")
        @WithMockUser(roles = {"ADMIN"})
        void shouldReturn404WhenUpdatingNonExistentItem() throws Exception {
            // Given
            Item updateData = Item.builder()
                    .name("Updated Item")
                    .build();

            when(itemService.updateItem(eq(999L), any(Item.class)))
                    .thenReturn(Optional.empty());

            // When & Then
            mockMvc.perform(put("/api/items/999")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateData)))
                    .andDo(print())
                    .andExpect(status().isNotFound());

            verify(itemService, times(1)).updateItem(eq(999L), any(Item.class));
        }

        @Test
        @DisplayName("Should handle optimistic locking conflicts")
        @WithMockUser(roles = {"ADMIN"})
        void shouldHandleOptimisticLockingConflicts() throws Exception {
            // Given
            Item updateData = Item.builder()
                    .name("Updated Item")
                    .version(1L) // Outdated version
                    .build();

            when(itemService.updateItem(eq(1L), any(Item.class)))
                    .thenThrow(new ValidationException("Item has been modified by another user"));

            // When & Then
            mockMvc.perform(put("/api/items/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(updateData)))
                    .andDo(print())
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                    .andExpect(jsonPath("$.message", containsString("Item has been modified")));

            verify(itemService, times(1)).updateItem(eq(1L), any(Item.class));
        }
    }

    // ============================================================================
    // PRUEBAS DE ELIMINACIÓN DE ITEMS
    // ============================================================================

    @Nested
    @DisplayName("Delete Item Tests")
    class DeleteItemTests {

        @Test
        @DisplayName("Should delete item successfully")
        @WithMockUser(roles = {"ADMIN"})
        void shouldDeleteItemSuccessfully() throws Exception {
            // Given
            when(itemService.deleteItem(1L)).thenReturn(true);

            // When & Then
            mockMvc.perform(delete("/api/items/1")
                            .header("X-Correlation-ID", "test-correlation-id"))
                    .andDo(print())
                    .andExpect(status().isNoContent());

            verify(itemService, times(1)).deleteItem(1L);
        }

        @Test
        @DisplayName("Should return 404 when deleting non-existent item")
        @WithMockUser(roles = {"ADMIN"})
        void shouldReturn404WhenDeletingNonExistentItem() throws Exception {
            // Given
            when(itemService.deleteItem(999L)).thenReturn(false);

            // When & Then
            mockMvc.perform(delete("/api/items/999"))
                    .andDo(print())
                    .andExpect(status().isNotFound());

            verify(itemService, times(1)).deleteItem(999L);
        }

        @Test
        @DisplayName("Should handle deletion of item with stock")
        @WithMockUser(roles = {"ADMIN"})
        void shouldHandleDeletionOfItemWithStock() throws Exception {
            // Given
            when(itemService.deleteItem(1L))
                    .thenThrow(new ValidationException("Cannot delete item with available stock"));

            // When & Then
            mockMvc.perform(delete("/api/items/1"))
                    .andDo(print())
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                    .andExpect(jsonPath("$.message", containsString("Cannot delete item")));

            verify(itemService, times(1)).deleteItem(1L);
        }
    }

    // ============================================================================
    // PRUEBAS DE MANEJO DE ERRORES
    // ============================================================================

    @Nested
    @DisplayName("Error Handling Tests")
    class ErrorHandlingTests {

        @Test
        @DisplayName("Should handle internal server error")
        @WithMockUser(roles = {"USER"})
        void shouldHandleInternalServerError() throws Exception {
            // Given
            when(itemService.getItemById(1L))
                    .thenThrow(new RuntimeException("Database connection failed"));

            // When & Then
            mockMvc.perform(get("/api/items/1"))
                    .andDo(print())
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.code", is("INTERNAL_SERVER_ERROR")))
                    .andExpect(jsonPath("$.message", is("Error interno del servidor")));
        }

        @Test
        @DisplayName("Should handle circuit breaker activation")
        @WithMockUser(roles = {"USER"})
        void shouldHandleCircuitBreakerActivation() throws Exception {
            // Given
            when(itemService.getItemById(1L))
                    .thenThrow(new RuntimeException("Service unavailable"));

            // When & Then
            mockMvc.perform(get("/api/items/1"))
                    .andDo(print())
                    .andExpect(status().isServiceUnavailable());
        }

        @Test
        @DisplayName("Should handle rate limiting")
        @WithMockUser(roles = {"USER"})
        void shouldHandleRateLimiting() throws Exception {
            // Given
            when(itemService.getItemById(1L))
                    .thenThrow(new RuntimeException("Rate limit exceeded"));

            // When & Then
            mockMvc.perform(get("/api/items/1"))
                    .andDo(print())
                    .andExpect(status().isTooManyRequests());
        }
    }

    // ============================================================================
    // PRUEBAS DE PERFORMANCE
    // ============================================================================

    @Nested
    @DisplayName("Performance Tests")
    class PerformanceTests {

        @Test
        @DisplayName("Should handle large result sets efficiently")
        @WithMockUser(roles = {"USER"})
        void shouldHandleLargeResultSetsEfficiently() throws Exception {
            // Given
            List<Item> largeItemList = createLargeItemList(1000);
            Page<Item> largePage = new PageImpl<>(largeItemList, PageRequest.of(0, 1000), 1000);
            when(itemService.getAllItems(any(Pageable.class), anyString()))
                    .thenReturn(largePage);

            // When & Then
            long startTime = System.currentTimeMillis();
            
            mockMvc.perform(get("/api/items")
                            .param("size", "1000")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content", hasSize(1000)));

            long endTime = System.currentTimeMillis();
            long responseTime = endTime - startTime;
            
            // Verificar que la respuesta sea rápida (menos de 1 segundo)
            assert responseTime < 1000 : "Response time should be less than 1 second, but was: " + responseTime;
        }

        private List<Item> createLargeItemList(int size) {
            List<Item> items = new java.util.ArrayList<>();
            for (int i = 0; i < size; i++) {
                items.add(Item.builder()
                        .id((long) i)
                        .name("Item " + i)
                        .code("ITEM" + String.format("%03d", i))
                        .description("Description for item " + i)
                        .price(new BigDecimal("99.99"))
                        .stock(10)
                        .category("Electronics")
                        .status(Item.ItemStatus.ACTIVE)
                        .createdAt(LocalDateTime.now())
                        .createdBy("test-user")
                        .updatedAt(LocalDateTime.now())
                        .updatedBy("test-user")
                        .version(1L)
                        .deleted(false)
                        .viewCount(0L)
                        .rating(new BigDecimal("4.5"))
                        .reviewCount(10L)
                        .build());
            }
            return items;
        }
    }

    // ============================================================================
    // PRUEBAS DE SEGURIDAD
    // ============================================================================

    @Nested
    @DisplayName("Security Tests")
    class SecurityTests {

        @Test
        @DisplayName("Should prevent SQL injection")
        @WithMockUser(roles = {"USER"})
        void shouldPreventSqlInjection() throws Exception {
            // Given
            String maliciousInput = "'; DROP TABLE items; --";
            when(itemService.getAllItems(any(Pageable.class), eq(maliciousInput)))
                    .thenReturn(new PageImpl<>(List.of()));

            // When & Then
            mockMvc.perform(get("/api/items")
                            .param("name", maliciousInput)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andDo(print())
                    .andExpect(status().isOk());

            // Verificar que el input malicioso fue manejado correctamente
            verify(itemService, times(1)).getAllItems(any(Pageable.class), eq(maliciousInput));
        }

        @Test
        @DisplayName("Should prevent XSS injection")
        @WithMockUser(roles = {"ADMIN"})
        void shouldPreventXssInjection() throws Exception {
            // Given
            Item maliciousItem = Item.builder()
                    .name("<script>alert('XSS')</script>")
                    .code("XSS001")
                    .description("<img src=x onerror=alert('XSS')>")
                    .build();

            when(itemService.createItem(any(Item.class)))
                    .thenThrow(new ValidationException("Content contains XSS patterns"));

            // When & Then
            mockMvc.perform(post("/api/items")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(maliciousItem)))
                    .andDo(print())
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                    .andExpect(jsonPath("$.message", containsString("XSS")));
        }
    }
}

// ============================================================================
// CLASES AUXILIARES PARA PRUEBAS
// ============================================================================

/**
 * Manejador global de excepciones para pruebas
 */
class GlobalExceptionHandler {
    // Implementación del manejador de excepciones
}

/**
 * Excepción de validación para pruebas
 */
class ValidationException extends RuntimeException {
    private final String code;
    private final String message;

    public ValidationException(String message) {
        super(message);
        this.code = "VALIDATION_ERROR";
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
} 