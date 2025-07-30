# 5.1 Unit Testing (Testing Unitario)

## 🎯 **Conceptos Básicos**

El testing unitario actúa como tu evaluación individual de rendimiento de cada pieza del rompecabezas de microservicios. Cuando trabajas con microservicios, el testing unitario implica poder enfocarte en piezas individuales—pequeñas unidades de funcionalidad—y verificar que están haciendo lo que se supone que deben hacer por sí mismas. Esto es testing en aislamiento, donde no interactúan con ningún otro componente del sistema, asegurando que cada uno funciona exactamente como se pretende.

Para microservicios, donde cada servicio corre en aislamiento pero debe integrarse con el ecosistema, el testing unitario es aún más esencial. No solo verificar que una función retorna el valor correcto, sino asegurarte de que tus microservicios pueden mantenerse por sí mismos cuando se despliegan en el mundo real.

## 🛠️ **Configuración del Proyecto**

### **Dependencias Maven**

```xml
<!-- Dependencias para testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<!-- Mockito -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>

<!-- Mockito para JUnit 5 -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

## 📝 **Ejemplo 1: Servicio Simple**

### **Clase de Servicio**

```java
// Interfaz del servicio de items
// Define el contrato que debe implementar el servicio
public interface ItemService {
    // Obtiene todos los items disponibles
    public List<Item> getAllItems();
    
    // Obtiene un item específico por su ID
    public Optional<Item> getItemById(Long id);
    
    // Agrega un nuevo item al sistema
    public void addItem(Item item);
    
    // Actualiza un item existente
    public Item updateItem(Long id, Item item);
    
    // Elimina un item por su ID
    public boolean deleteItem(Long id);
}

// Implementación del servicio de items
// @Service marca esta clase como un servicio de Spring que puede ser inyectado
@Service
public class ItemServiceImpl implements ItemService {
    
    // Lista en memoria para almacenar items (en producción sería una base de datos)
    // Esta es una implementación simple para demostración
    private List<Item> items = new ArrayList<>();
    
    // Contador para generar IDs únicos
    private Long nextId = 1L;
    
    /**
     * Obtiene todos los items disponibles
     * @return Lista de todos los items
     */
    @Override
    public List<Item> getAllItems() {
        // Retorna una copia de la lista para evitar modificaciones externas
        return new ArrayList<>(items);
    }
    
    /**
     * Obtiene un item específico por su ID
     * @param id ID del item a buscar
     * @return Optional que contiene el item si se encuentra, o vacío si no existe
     */
    @Override
    public Optional<Item> getItemById(Long id) {
        // Usa Stream API para buscar el item por ID
        // filter() filtra items que coincidan con el ID
        // findFirst() retorna el primer item que coincida, o Optional.empty()
        return items.stream()
            .filter(item -> item.getId().equals(id))  // Compara IDs
            .findFirst();  // Retorna el primer item que coincida
    }
    
    /**
     * Agrega un nuevo item al sistema
     * @param item Item a agregar
     */
    @Override
    public void addItem(Item item) {
        // VALIDACIÓN: Verificar que el item no sea null
        if (item == null) {
            throw new IllegalArgumentException("El item no puede ser null");
        }
        
        // VALIDACIÓN: Verificar que el nombre no esté vacío
        if (item.getName() == null || item.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del item no puede estar vacío");
        }
        
        // Asignar ID único al item
        item.setId(nextId++);
        
        // Agregar el item a la lista
        items.add(item);
    }
    
    /**
     * Actualiza un item existente
     * @param id ID del item a actualizar
     * @param itemDetails Nuevos datos del item
     * @return Item actualizado, o null si no se encuentra
     */
    @Override
    public Item updateItem(Long id, Item itemDetails) {
        // VALIDACIÓN: Verificar que el ID no sea null
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser null");
        }
        
        // VALIDACIÓN: Verificar que los detalles del item no sean null
        if (itemDetails == null) {
            throw new IllegalArgumentException("Los detalles del item no pueden ser null");
        }
        
        // Buscar el item existente
        Optional<Item> existingItem = getItemById(id);
        
        // Si el item existe, actualizarlo
        if (existingItem.isPresent()) {
            Item item = existingItem.get();
            
            // Actualizar campos si no son null
            if (itemDetails.getName() != null) {
                item.setName(itemDetails.getName());
            }
            if (itemDetails.getDescription() != null) {
                item.setDescription(itemDetails.getDescription());
            }
            
            return item;
        }
        
        // Retornar null si el item no se encuentra
        return null;
    }
    
    /**
     * Elimina un item por su ID
     * @param id ID del item a eliminar
     * @return true si se eliminó exitosamente, false si no se encontró
     */
    @Override
    public boolean deleteItem(Long id) {
        // VALIDACIÓN: Verificar que el ID no sea null
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser null");
        }
        
        // Buscar el item por ID
        Optional<Item> itemToDelete = getItemById(id);
        
        // Si se encuentra, eliminarlo y retornar true
        if (itemToDelete.isPresent()) {
            items.remove(itemToDelete.get());
            return true;
        }
        
        // Retornar false si no se encuentra
        return false;
    }
}

// Clase de entidad Item
// Representa un item en el sistema
public class Item {
    // ID único del item
    private Long id;
    
    // Nombre del item
    private String name;
    
    // Descripción del item
    private String description;
    
    // Constructor por defecto requerido por JPA
    public Item() {}
    
    // Constructor con parámetros
    public Item(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    
    // Constructor simplificado
    public Item(Long id, String name) {
        this(id, name, null);
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    // Métodos de igualdad
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Item item = (Item) o;
        return Objects.equals(id, item.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
```

### **Tests Unitarios**

```java
// Clase de testing unitario para ItemService
// @ExtendWith(MockitoExtension.class) habilita la integración con Mockito
@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {
    
    // @InjectMocks crea una instancia de ItemServiceImpl e inyecta los mocks
    // Esto permite testing del servicio real con dependencias simuladas
    @InjectMocks
    private ItemServiceImpl itemService;  // Usamos la implementación real para testing
    
    // @Mock crea un mock de ItemRepository (si tuviéramos uno)
    // En este ejemplo no lo usamos porque el servicio usa una lista en memoria
    // @Mock
    // private ItemRepository itemRepository;
    
    /**
     * Configuración inicial que se ejecuta antes de cada test
     * @BeforeEach es una anotación de JUnit 5 que reemplaza @Before
     */
    @BeforeEach
    public void setup() {
        // Inicializar Mockito (aunque @ExtendWith(MockitoExtension.class) lo hace automáticamente)
        MockitoAnnotations.openMocks(this);
        
        // Crear datos de prueba
        Item item1 = new Item(1L, "Item 1", "Descripción del item 1");
        Item item2 = new Item(2L, "Item 2", "Descripción del item 2");
        
        // Agregar items al servicio
        itemService.addItem(item1);
        itemService.addItem(item2);
    }
    
    /**
     * Test: Obtener todos los items
     * Verifica que el método getAllItems() retorne la lista correcta
     */
    @Test
    public void testGetAllItems() {
        // Given: Los items ya están configurados en setup()
        
        // When: Llamar al método a testear
        List<Item> items = itemService.getAllItems();
        
        // Then: Verificar el resultado esperado
        // assertEquals verifica que el valor actual sea igual al esperado
        assertEquals(2, items.size(), "Debería haber 2 items en la lista");
        
        // Verificar que los items específicos estén presentes
        assertTrue(items.stream().anyMatch(item -> "Item 1".equals(item.getName())), 
                   "Debería contener Item 1");
        assertTrue(items.stream().anyMatch(item -> "Item 2".equals(item.getName())), 
                   "Debería contener Item 2");
    }
    
    /**
     * Test: Obtener item por ID existente
     * Verifica que getItemById() retorne el item correcto cuando existe
     */
    @Test
    public void testGetItemById_WhenItemExists() {
        // Given: ID de un item que sabemos que existe
        
        // When: Llamar al método a testear
        Optional<Item> item = itemService.getItemById(1L);
        
        // Then: Verificar el resultado esperado
        // assertTrue verifica que la condición sea verdadera
        assertTrue(item.isPresent(), "El item debería estar presente");
        assertEquals("Item 1", item.get().getName(), "El nombre debería ser 'Item 1'");
        assertEquals("Descripción del item 1", item.get().getDescription(), 
                     "La descripción debería coincidir");
    }
    
    /**
     * Test: Obtener item por ID inexistente
     * Verifica que getItemById() retorne Optional.empty() cuando el item no existe
     */
    @Test
    public void testGetItemById_WhenItemDoesNotExist() {
        // Given: ID de un item que no existe
        
        // When: Llamar al método a testear
        Optional<Item> item = itemService.getItemById(999L);
        
        // Then: Verificar el resultado esperado
        // assertFalse verifica que la condición sea falsa
        assertFalse(item.isPresent(), "El item no debería estar presente");
    }
    
    /**
     * Test: Agregar item válido
     * Verifica que addItem() agregue correctamente un nuevo item
     */
    @Test
    public void testAddItem_WithValidItem() {
        // Given: Un nuevo item válido
        Item newItem = new Item(null, "Nuevo Item", "Descripción del nuevo item");
        
        // When: Llamar al método a testear
        itemService.addItem(newItem);
        
        // Then: Verificar el resultado esperado
        List<Item> items = itemService.getAllItems();
        assertEquals(3, items.size(), "Debería haber 3 items después de agregar uno");
        
        // Verificar que el nuevo item esté presente
        Optional<Item> addedItem = itemService.getItemById(newItem.getId());
        assertTrue(addedItem.isPresent(), "El item agregado debería estar presente");
        assertEquals("Nuevo Item", addedItem.get().getName(), "El nombre debería coincidir");
    }
    
    /**
     * Test: Agregar item null
     * Verifica que addItem() lance excepción cuando se pasa un item null
     */
    @Test
    public void testAddItem_WithNullItem() {
        // Given: Un item null
        
        // When & Then: Verificar que se lance la excepción esperada
        // assertThrows verifica que se lance una excepción específica
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> itemService.addItem(null),
            "Debería lanzar IllegalArgumentException cuando el item es null"
        );
        
        // Verificar el mensaje de la excepción
        assertEquals("El item no puede ser null", exception.getMessage(), 
                     "El mensaje de error debería coincidir");
    }
    
    /**
     * Test: Agregar item con nombre vacío
     * Verifica que addItem() lance excepción cuando el nombre está vacío
     */
    @Test
    public void testAddItem_WithEmptyName() {
        // Given: Un item con nombre vacío
        Item itemWithEmptyName = new Item(null, "", "Descripción");
        
        // When & Then: Verificar que se lance la excepción esperada
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> itemService.addItem(itemWithEmptyName),
            "Debería lanzar IllegalArgumentException cuando el nombre está vacío"
        );
        
        // Verificar el mensaje de la excepción
        assertEquals("El nombre del item no puede estar vacío", exception.getMessage(), 
                     "El mensaje de error debería coincidir");
    }
    
    /**
     * Test: Actualizar item existente
     * Verifica que updateItem() actualice correctamente un item existente
     */
    @Test
    public void testUpdateItem_WhenItemExists() {
        // Given: Detalles de actualización
        Item updateDetails = new Item(null, "Item 1 Actualizado", "Nueva descripción");
        
        // When: Llamar al método a testear
        Item updatedItem = itemService.updateItem(1L, updateDetails);
        
        // Then: Verificar el resultado esperado
        assertNotNull(updatedItem, "El item actualizado no debería ser null");
        assertEquals("Item 1 Actualizado", updatedItem.getName(), "El nombre debería estar actualizado");
        assertEquals("Nueva descripción", updatedItem.getDescription(), 
                     "La descripción debería estar actualizada");
        
        // Verificar que el cambio persiste
        Optional<Item> retrievedItem = itemService.getItemById(1L);
        assertTrue(retrievedItem.isPresent(), "El item debería seguir existiendo");
        assertEquals("Item 1 Actualizado", retrievedItem.get().getName(), 
                     "El cambio debería persistir");
    }
    
    /**
     * Test: Actualizar item inexistente
     * Verifica que updateItem() retorne null cuando el item no existe
     */
    @Test
    public void testUpdateItem_WhenItemDoesNotExist() {
        // Given: Detalles de actualización para un item que no existe
        Item updateDetails = new Item(null, "Item Inexistente", "Descripción");
        
        // When: Llamar al método a testear
        Item updatedItem = itemService.updateItem(999L, updateDetails);
        
        // Then: Verificar el resultado esperado
        assertNull(updatedItem, "Debería retornar null cuando el item no existe");
    }
    
    /**
     * Test: Eliminar item existente
     * Verifica que deleteItem() elimine correctamente un item existente
     */
    @Test
    public void testDeleteItem_WhenItemExists() {
        // Given: ID de un item que existe
        
        // When: Llamar al método a testear
        boolean result = itemService.deleteItem(1L);
        
        // Then: Verificar el resultado esperado
        assertTrue(result, "Debería retornar true cuando se elimina exitosamente");
        
        // Verificar que el item ya no existe
        List<Item> items = itemService.getAllItems();
        assertEquals(1, items.size(), "Debería quedar solo 1 item");
        
        Optional<Item> deletedItem = itemService.getItemById(1L);
        assertFalse(deletedItem.isPresent(), "El item eliminado no debería existir");
    }
    
    /**
     * Test: Eliminar item inexistente
     * Verifica que deleteItem() retorne false cuando el item no existe
     */
    @Test
    public void testDeleteItem_WhenItemDoesNotExist() {
        // Given: ID de un item que no existe
        
        // When: Llamar al método a testear
        boolean result = itemService.deleteItem(999L);
        
        // Then: Verificar el resultado esperado
        assertFalse(result, "Debería retornar false cuando el item no existe");
        
        // Verificar que la cantidad de items no cambió
        List<Item> items = itemService.getAllItems();
        assertEquals(2, items.size(), "La cantidad de items no debería cambiar");
    }
    
    /**
     * Test: Verificar que los items tienen IDs únicos
     * Verifica que cada item agregado reciba un ID único
     */
    @Test
    public void testAddItem_AssignsUniqueIds() {
        // Given: Múltiples items nuevos
        Item item1 = new Item(null, "Item A");
        Item item2 = new Item(null, "Item B");
        Item item3 = new Item(null, "Item C");
        
        // When: Agregar los items
        itemService.addItem(item1);
        itemService.addItem(item2);
        itemService.addItem(item3);
        
        // Then: Verificar que cada item tenga un ID único
        Set<Long> ids = new HashSet<>();
        ids.add(item1.getId());
        ids.add(item2.getId());
        ids.add(item3.getId());
        
        assertEquals(3, ids.size(), "Cada item debería tener un ID único");
        assertTrue(item1.getId() > 0, "El ID debería ser positivo");
        assertTrue(item2.getId() > 0, "El ID debería ser positivo");
        assertTrue(item3.getId() > 0, "El ID debería ser positivo");
    }
}
```

## 📊 **Resultados Esperados y Manejo de Errores**

### **🎯 Casos de Éxito Esperados**

#### **1. Test de Obtención de Items Exitoso**
```java
// ENTRADA
@Test
public void testGetAllItems() {
    // Given: Items configurados en setup()
    
    // When
    List<Item> items = itemService.getAllItems();
    
    // RESULTADO ESPERADO - ÉXITO
    // ✅ Lista con 2 items
    // ✅ Items con nombres "Item 1" y "Item 2"
    // ✅ IDs únicos asignados
    // ✅ Test pasa sin errores
}

// LÓGICA EJECUTADA:
// ✅ setup() inicializa datos de prueba
// ✅ getAllItems() retorna copia de la lista
// ✅ assertEquals verifica tamaño correcto
// ✅ assertTrue verifica contenido esperado
```

#### **2. Test de Agregar Item Exitoso**
```java
// ENTRADA
@Test
public void testAddItem_WithValidItem() {
    // Given
    Item newItem = new Item(null, "Nuevo Item", "Descripción");
    
    // When
    itemService.addItem(newItem);
    
    // RESULTADO ESPERADO - ÉXITO
    // ✅ Item agregado a la lista
    // ✅ ID único asignado automáticamente
    // ✅ Validaciones pasan
    // ✅ Lista actualizada correctamente
}

// LÓGICA EJECUTADA:
// ✅ Validación de item no null
// ✅ Validación de nombre no vacío
// ✅ Asignación de ID único
// ✅ Agregado a lista interna
```

### **❌ Casos de Error Esperados**

#### **1. Test de Validación - Item Null**
```java
// ENTRADA INVÁLIDA
@Test
public void testAddItem_WithNullItem() {
    // When & Then
    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> itemService.addItem(null)
    );
    
    // RESULTADO ESPERADO - ERROR
    // ❌ IllegalArgumentException lanzada
    // ❌ Mensaje: "El item no puede ser null"
    // ❌ Item no se agrega a la lista
}

// LÓGICA EJECUTADA:
// ❌ Validación detecta item null
// ❌ Excepción lanzada inmediatamente
// ❌ assertThrows captura la excepción
// ❌ Mensaje verificado
```

#### **2. Test de Validación - Nombre Vacío**
```java
// ENTRADA INVÁLIDA
@Test
public void testAddItem_WithEmptyName() {
    // Given
    Item itemWithEmptyName = new Item(null, "", "Descripción");
    
    // When & Then
    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> itemService.addItem(itemWithEmptyName)
    );
    
    // RESULTADO ESPERADO - ERROR
    // ❌ IllegalArgumentException lanzada
    // ❌ Mensaje: "El nombre del item no puede estar vacío"
    // ❌ Item no se agrega a la lista
}
```

### **📈 Métricas de Testing**

#### **Cobertura de Código Esperada:**
- **Líneas de código:** 95%
- **Ramas de código:** 90%
- **Funciones:** 100%
- **Clases:** 100%

#### **Tiempos de Ejecución:**
- **Tests unitarios:** < 100ms por test
- **Suite completa:** < 500ms
- **CI/CD pipeline:** < 2 minutos

#### **Estadísticas de Testing:**
- **Tests totales:** 10
- **Tests de éxito:** 7
- **Tests de error:** 3
- **Assertions:** 25+

### **🛡️ Estrategias de Testing**

#### **1. Arrange-Act-Assert Pattern**
```java
@Test
public void testExample() {
    // Arrange: Preparar datos de prueba
    Item testItem = new Item(1L, "Test Item");
    
    // Act: Ejecutar la acción a testear
    itemService.addItem(testItem);
    
    // Assert: Verificar el resultado
    assertTrue(itemService.getItemById(1L).isPresent());
}
```

#### **2. Test Data Builders**
```java
public class ItemTestBuilder {
    private Long id = 1L;
    private String name = "Test Item";
    private String description = "Test Description";
    
    public ItemTestBuilder withId(Long id) {
        this.id = id;
        return this;
    }
    
    public ItemTestBuilder withName(String name) {
        this.name = name;
        return this;
    }
    
    public Item build() {
        return new Item(id, name, description);
    }
}
```

#### **3. Test Categories**
```java
// Tests de funcionalidad normal
@Test
@Tag("happy-path")
public void testNormalOperation() { }

// Tests de casos límite
@Test
@Tag("edge-case")
public void testEdgeCase() { }

// Tests de errores
@Test
@Tag("error-handling")
public void testErrorHandling() { }
```

Esta implementación de testing unitario proporciona una base sólida para verificar la funcionalidad individual de cada componente del microservicio, asegurando que cada pieza funcione correctamente antes de integrarse con otros servicios. 