# 🧪 JUnit Avanzado - Guía de Estudio Detallada

## 📋 Índice

1. [Configuración Avanzada](#configuración-avanzada)
2. [Testing de Integración](#testing-de-integración)
3. [Testing de Performance](#testing-de-performance)
4. [Testing de Excepciones](#testing-de-excepciones)
5. [Testing de Servicios](#testing-de-servicios)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración Avanzada

### Configuración de JUnit 5

```java
// JUnitConfig.java - Configuración avanzada de JUnit 5
package com.example.config;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest // Marca como test de Spring Boot - Carga todo el contexto de la aplicación
@ActiveProfiles("test") // Activa el perfil "test" - Usa configuración específica para testing
@TestPropertySource(locations = "classpath:application-test.properties") // Carga propiedades específicas de test
@Transactional // Todas las pruebas son transaccionales - Rollback automático después de cada test
@ExtendWith(TestResultLogger.class) // Extensión personalizada para logging de resultados
public class JUnitConfig {
    
    // Esta clase sirve como base para todos los tests de integración
    // RESULTADO ESPERADO: Configuración centralizada que se aplica a todos los tests que extiendan esta clase
}

// TestResultLogger.java - Extensión personalizada para logging
package com.example.extension;

import org.junit.jupiter.api.extension.AfterTestExecutionCallback;
import org.junit.jupiter.api.extension.BeforeTestExecutionCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.lang.reflect.Method;

public class TestResultLogger implements BeforeTestExecutionCallback, AfterTestExecutionCallback {
    
    private static final String START_TIME = "start time"; // Clave para almacenar tiempo de inicio
    
    @Override
    public void beforeTestExecution(ExtensionContext context) throws Exception {
        // Se ejecuta ANTES de cada test
        Method testMethod = context.getRequiredTestMethod(); // Obtiene el método de test actual
        String testName = testMethod.getName(); // Obtiene el nombre del método
        String className = context.getRequiredTestClass().getSimpleName(); // Obtiene el nombre de la clase
        
        // Almacena el tiempo de inicio para calcular duración
        context.getStore(ExtensionContext.Namespace.GLOBAL).put(START_TIME, System.currentTimeMillis());
        
        // RESULTADO ESPERADO: Log muestra "Iniciando test: UserServiceTest.createUser_ShouldCreateUser"
        System.out.println("🚀 Iniciando test: " + className + "." + testName);
    }
    
    @Override
    public void afterTestExecution(ExtensionContext context) throws Exception {
        // Se ejecuta DESPUÉS de cada test
        Method testMethod = context.getRequiredTestMethod(); // Obtiene el método de test actual
        String testName = testMethod.getName(); // Obtiene el nombre del método
        String className = context.getRequiredTestClass().getSimpleName(); // Obtiene el nombre de la clase
        
        // Calcula la duración del test
        long startTime = context.getStore(ExtensionContext.Namespace.GLOBAL).remove(START_TIME, long.class);
        long duration = System.currentTimeMillis() - startTime; // Duración en milisegundos
        
        // Obtiene el resultado del test (PASSED, FAILED, ABORTED)
        ExtensionContext.Store store = context.getStore(ExtensionContext.Namespace.GLOBAL);
        boolean testFailed = context.getExecutionException().isPresent(); // Verifica si hubo excepción
        
        if (testFailed) {
            // RESULTADO ESPERADO: Log muestra "❌ Test falló: UserServiceTest.createUser_ShouldCreateUser (150ms)"
            System.out.println("❌ Test falló: " + className + "." + testName + " (" + duration + "ms)");
        } else {
            // RESULTADO ESPERADO: Log muestra "✅ Test exitoso: UserServiceTest.createUser_ShouldCreateUser (150ms)"
            System.out.println("✅ Test exitoso: " + className + "." + testName + " (" + duration + "ms)");
        }
    }
}

// application-test.properties - Propiedades específicas para testing
/*
# Configuración de base de datos para testing (H2 en memoria)
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Configuración de JPA para testing
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Configuración de logging para testing
logging.level.com.example=DEBUG
logging.level.org.springframework.test=DEBUG

# Configuración de cache para testing
spring.cache.type=none
*/
```

---

## 🔄 Testing de Integración

### Testing de Repositorios

```java
// UserRepositoryIntegrationTest.java - Testing de integración de repositorios
package com.example.repository;

import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest // Configuración específica para testing de JPA - Solo carga entidades y repositorios
@ActiveProfiles("test") // Activa perfil de test
class UserRepositoryIntegrationTest {
    
    @Autowired
    private TestEntityManager entityManager; // Gestor de entidades para testing - Permite manipulación directa
    
    @Autowired
    private UserRepository userRepository; // Repositorio a testear - Inyectado automáticamente
    
    private User testUser; // Usuario de prueba - Se crea antes de cada test
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test - Prepara datos de prueba
        testUser = new User(); // Crea nueva instancia de usuario
        testUser.setUsername("testuser"); // Establece username
        testUser.setEmail("test@example.com"); // Establece email
        testUser.setPassword("password123"); // Establece contraseña
        testUser.setFirstName("Test"); // Establece nombre
        testUser.setLastName("User"); // Establece apellido
        testUser.setEnabled(true); // Habilita el usuario
        testUser.setCreatedAt(LocalDateTime.now()); // Establece fecha de creación
        testUser.setUpdatedAt(LocalDateTime.now()); // Establece fecha de actualización
        
        // RESULTADO ESPERADO: testUser contiene todos los datos necesarios para las pruebas
    }
    
    @Test
    @DisplayName("Debería guardar usuario correctamente")
    void save_ShouldSaveUser() {
        // Arrange - Preparar datos
        // testUser ya está configurado en setUp()
        
        // Act - Ejecutar acción
        User savedUser = userRepository.save(testUser); // Guarda el usuario en la base de datos
        
        // Assert - Verificar resultados
        assertNotNull(savedUser.getId(), "El ID no debería ser null después de guardar"); // Verifica que se generó ID
        assertEquals("testuser", savedUser.getUsername(), "El username debería coincidir"); // Verifica username
        assertEquals("test@example.com", savedUser.getEmail(), "El email debería coincidir"); // Verifica email
        
        // Verificación adicional con TestEntityManager
        User foundUser = entityManager.find(User.class, savedUser.getId()); // Busca directamente en la base de datos
        assertNotNull(foundUser, "El usuario debería existir en la base de datos"); // Verifica que existe
        assertEquals("testuser", foundUser.getUsername(), "El username en BD debería coincidir"); // Verifica datos en BD
        
        // RESULTADO ESPERADO: Test pasa, usuario guardado con ID generado automáticamente
    }
    
    @Test
    @DisplayName("Debería encontrar usuario por ID")
    void findById_ShouldReturnUser() {
        // Arrange - Preparar datos
        User savedUser = entityManager.persistAndFlush(testUser); // Guarda y sincroniza con BD
        // RESULTADO ESPERADO: savedUser tiene ID generado automáticamente
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userRepository.findById(savedUser.getId()); // Busca por ID
        
        // Assert - Verificar resultados
        assertTrue(foundUser.isPresent(), "El usuario debería ser encontrado"); // Verifica que se encontró
        assertEquals("testuser", foundUser.get().getUsername(), "El username debería coincidir"); // Verifica username
        assertEquals("test@example.com", foundUser.get().getEmail(), "El email debería coincidir"); // Verifica email
        
        // RESULTADO ESPERADO: Test pasa, usuario encontrado correctamente
    }
    
    @Test
    @DisplayName("Debería retornar empty cuando usuario no existe")
    void findById_WithNonExistentId_ShouldReturnEmpty() {
        // Arrange - Preparar datos
        Long nonExistentId = 999L; // ID que no existe en la base de datos
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userRepository.findById(nonExistentId); // Busca por ID inexistente
        
        // Assert - Verificar resultados
        assertFalse(foundUser.isPresent(), "No debería encontrar usuario con ID inexistente"); // Verifica que no se encontró
        
        // RESULTADO ESPERADO: Test pasa, Optional.empty() retornado
    }
    
    @Test
    @DisplayName("Debería encontrar usuario por username")
    void findByUsername_ShouldReturnUser() {
        // Arrange - Preparar datos
        entityManager.persistAndFlush(testUser); // Guarda usuario en BD
        
        // Act - Ejecutar acción
        Optional<User> foundUser = userRepository.findByUsername("testuser"); // Busca por username
        
        // Assert - Verificar resultados
        assertTrue(foundUser.isPresent(), "El usuario debería ser encontrado por username"); // Verifica que se encontró
        assertEquals("testuser", foundUser.get().getUsername(), "El username debería coincidir"); // Verifica username
        
        // RESULTADO ESPERADO: Test pasa, usuario encontrado por username
    }
    
    @Test
    @DisplayName("Debería encontrar todos los usuarios")
    void findAll_ShouldReturnAllUsers() {
        // Arrange - Preparar datos
        User user1 = new User("user1", "user1@test.com", "password1"); // Crea primer usuario
        User user2 = new User("user2", "user2@test.com", "password2"); // Crea segundo usuario
        User user3 = new User("user3", "user3@test.com", "password3"); // Crea tercer usuario
        
        entityManager.persistAndFlush(user1); // Guarda primer usuario
        entityManager.persistAndFlush(user2); // Guarda segundo usuario
        entityManager.persistAndFlush(user3); // Guarda tercer usuario
        
        // Act - Ejecutar acción
        List<User> allUsers = userRepository.findAll(); // Obtiene todos los usuarios
        
        // Assert - Verificar resultados
        assertEquals(3, allUsers.size(), "Debería encontrar 3 usuarios"); // Verifica cantidad
        assertTrue(allUsers.stream().anyMatch(u -> "user1".equals(u.getUsername())), "Debería contener user1"); // Verifica user1
        assertTrue(allUsers.stream().anyMatch(u -> "user2".equals(u.getUsername())), "Debería contener user2"); // Verifica user2
        assertTrue(allUsers.stream().anyMatch(u -> "user3".equals(u.getUsername())), "Debería contener user3"); // Verifica user3
        
        // RESULTADO ESPERADO: Test pasa, lista con 3 usuarios encontrados
    }
    
    @Test
    @DisplayName("Debería actualizar usuario correctamente")
    void update_ShouldUpdateUser() {
        // Arrange - Preparar datos
        User savedUser = entityManager.persistAndFlush(testUser); // Guarda usuario original
        savedUser.setFirstName("Updated"); // Modifica nombre
        savedUser.setLastName("Name"); // Modifica apellido
        
        // Act - Ejecutar acción
        User updatedUser = userRepository.save(savedUser); // Actualiza usuario
        
        // Assert - Verificar resultados
        assertEquals("Updated", updatedUser.getFirstName(), "El nombre debería estar actualizado"); // Verifica nombre
        assertEquals("Name", updatedUser.getLastName(), "El apellido debería estar actualizado"); // Verifica apellido
        
        // Verificación adicional
        User foundUser = entityManager.find(User.class, savedUser.getId()); // Busca en BD
        assertEquals("Updated", foundUser.getFirstName(), "El nombre en BD debería estar actualizado"); // Verifica en BD
        
        // RESULTADO ESPERADO: Test pasa, usuario actualizado correctamente
    }
    
    @Test
    @DisplayName("Debería eliminar usuario correctamente")
    void delete_ShouldDeleteUser() {
        // Arrange - Preparar datos
        User savedUser = entityManager.persistAndFlush(testUser); // Guarda usuario
        Long userId = savedUser.getId(); // Obtiene ID del usuario
        
        // Act - Ejecutar acción
        userRepository.deleteById(userId); // Elimina usuario por ID
        entityManager.flush(); // Sincroniza cambios con BD
        
        // Assert - Verificar resultados
        User foundUser = entityManager.find(User.class, userId); // Busca usuario eliminado
        assertNull(foundUser, "El usuario debería estar eliminado"); // Verifica que no existe
        
        // RESULTADO ESPERADO: Test pasa, usuario eliminado correctamente
    }
}
```

---

## ⚡ Testing de Performance

### Testing de Rendimiento

```java
// UserServicePerformanceTest.java - Testing de performance
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo de Spring Boot
@ActiveProfiles("test") // Activa perfil de test
class UserServicePerformanceTest {
    
    @Autowired
    private UserService userService; // Servicio a testear
    
    @Autowired
    private UserRepository userRepository; // Repositorio para preparar datos
    
    private List<User> testUsers; // Lista de usuarios de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test - Prepara datos masivos
        testUsers = new ArrayList<>(); // Inicializa lista vacía
        
        // Crea 1000 usuarios de prueba para tests de performance
        for (int i = 0; i < 1000; i++) {
            User user = new User(); // Crea nuevo usuario
            user.setUsername("user" + i); // Username único
            user.setEmail("user" + i + "@test.com"); // Email único
            user.setPassword("password" + i); // Contraseña única
            user.setFirstName("FirstName" + i); // Nombre único
            user.setLastName("LastName" + i); // Apellido único
            user.setEnabled(true); // Usuario habilitado
            testUsers.add(user); // Agrega a la lista
        }
        
        // RESULTADO ESPERADO: testUsers contiene 1000 usuarios únicos para testing
    }
    
    @Test
    @DisplayName("Debería crear 1000 usuarios en menos de 5 segundos")
    void createUsers_PerformanceTest() {
        // Arrange - Preparar datos
        // testUsers ya está configurado en setUp()
        
        // Act - Ejecutar acción con medición de tiempo
        Instant start = Instant.now(); // Marca tiempo de inicio
        
        for (User user : testUsers) {
            userService.createUser(user); // Crea cada usuario
        }
        
        Instant end = Instant.now(); // Marca tiempo de fin
        Duration duration = Duration.between(start, end); // Calcula duración
        
        // Assert - Verificar resultados
        long totalUsers = userRepository.count(); // Cuenta usuarios en BD
        assertEquals(1000, totalUsers, "Deberían existir 1000 usuarios"); // Verifica cantidad
        
        // Verificación de performance
        long durationInSeconds = duration.getSeconds(); // Duración en segundos
        assertTrue(durationInSeconds < 5, "La operación debería completarse en menos de 5 segundos. Tiempo: " + durationInSeconds + "s"); // Verifica tiempo
        
        // RESULTADO ESPERADO: Test pasa, 1000 usuarios creados en menos de 5 segundos
        System.out.println("⏱️ Tiempo de creación de 1000 usuarios: " + durationInSeconds + " segundos");
    }
    
    @Test
    @DisplayName("Debería buscar usuarios concurrentemente")
    void searchUsers_ConcurrentTest() throws Exception {
        // Arrange - Preparar datos
        // Crear usuarios primero
        for (User user : testUsers) {
            userService.createUser(user); // Crea usuarios en BD
        }
        
        // Act - Ejecutar búsquedas concurrentes
        ExecutorService executor = Executors.newFixedThreadPool(10); // Pool de 10 hilos
        List<CompletableFuture<List<User>>> futures = new ArrayList<>(); // Lista de futuros
        
        Instant start = Instant.now(); // Marca tiempo de inicio
        
        // Lanza 100 búsquedas concurrentes
        for (int i = 0; i < 100; i++) {
            final int index = i; // Índice para la búsqueda
            CompletableFuture<List<User>> future = CompletableFuture.supplyAsync(() -> {
                // Búsqueda concurrente
                return userService.searchUsers("user" + index, null, true); // Busca usuario específico
            }, executor);
            futures.add(future); // Agrega futuro a la lista
        }
        
        // Espera que todas las búsquedas terminen
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join(); // Espera completación
        
        Instant end = Instant.now(); // Marca tiempo de fin
        Duration duration = Duration.between(start, end); // Calcula duración
        
        // Assert - Verificar resultados
        long durationInMillis = duration.toMillis(); // Duración en milisegundos
        assertTrue(durationInMillis < 3000, "Las búsquedas concurrentes deberían completarse en menos de 3 segundos. Tiempo: " + durationInMillis + "ms"); // Verifica tiempo
        
        // Verificar que todas las búsquedas fueron exitosas
        for (CompletableFuture<List<User>> future : futures) {
            List<User> users = future.get(); // Obtiene resultado
            assertNotNull(users, "La búsqueda debería retornar una lista"); // Verifica que no sea null
        }
        
        executor.shutdown(); // Cierra el executor
        
        // RESULTADO ESPERADO: Test pasa, 100 búsquedas concurrentes completadas en menos de 3 segundos
        System.out.println("⚡ Tiempo de 100 búsquedas concurrentes: " + durationInMillis + " milisegundos");
    }
    
    @Test
    @DisplayName("Debería manejar carga de memoria eficientemente")
    void memoryUsage_LoadTest() {
        // Arrange - Preparar datos
        Runtime runtime = Runtime.getRuntime(); // Obtiene instancia de Runtime
        long initialMemory = runtime.totalMemory() - runtime.freeMemory(); // Memoria inicial
        
        // Act - Ejecutar operaciones intensivas
        List<User> largeUserList = new ArrayList<>(); // Lista para usuarios grandes
        
        // Crea 10000 usuarios en memoria (sin guardar en BD)
        for (int i = 0; i < 10000; i++) {
            User user = new User(); // Crea nuevo usuario
            user.setUsername("largeuser" + i); // Username único
            user.setEmail("largeuser" + i + "@test.com"); // Email único
            user.setPassword("password" + i); // Contraseña única
            user.setFirstName("LargeFirstName" + i); // Nombre único
            user.setLastName("LargeLastName" + i); // Apellido único
            largeUserList.add(user); // Agrega a la lista
        }
        
        long finalMemory = runtime.totalMemory() - runtime.freeMemory(); // Memoria final
        long memoryUsed = finalMemory - initialMemory; // Memoria utilizada
        
        // Assert - Verificar resultados
        long memoryUsedMB = memoryUsed / (1024 * 1024); // Convierte a MB
        assertTrue(memoryUsedMB < 100, "El uso de memoria debería ser menor a 100MB. Uso actual: " + memoryUsedMB + "MB"); // Verifica uso de memoria
        
        // RESULTADO ESPERADO: Test pasa, uso de memoria eficiente para 10000 usuarios
        System.out.println("💾 Memoria utilizada para 10000 usuarios: " + memoryUsedMB + " MB");
    }
}
```

---

## ⚠️ Testing de Excepciones

### Testing de Manejo de Errores

```java
// UserServiceExceptionTest.java - Testing de excepciones
package com.example.service;

import com.example.exception.ResourceNotFoundException;
import com.example.exception.ResourceAlreadyExistsException;
import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo
@ActiveProfiles("test") // Activa perfil de test
class UserServiceExceptionTest {
    
    @Autowired
    private UserService userService; // Servicio a testear
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User(); // Crea nuevo usuario
        testUser.setUsername("testuser"); // Establece username
        testUser.setEmail("test@example.com"); // Establece email
        testUser.setPassword("password123"); // Establece contraseña
        testUser.setFirstName("Test"); // Establece nombre
        testUser.setLastName("User"); // Establece apellido
        testUser.setEnabled(true); // Habilita usuario
        
        // RESULTADO ESPERADO: testUser configurado correctamente
    }
    
    @Test
    @DisplayName("Debería lanzar excepción al crear usuario con username duplicado")
    void createUser_WithDuplicateUsername_ShouldThrowException() {
        // Arrange - Preparar datos
        userService.createUser(testUser); // Crea primer usuario
        User duplicateUser = new User(); // Crea usuario duplicado
        duplicateUser.setUsername("testuser"); // Mismo username
        duplicateUser.setEmail("different@example.com"); // Email diferente
        duplicateUser.setPassword("password456"); // Contraseña diferente
        
        // Act & Assert - Ejecutar acción y verificar excepción
        ResourceAlreadyExistsException exception = assertThrows(
            ResourceAlreadyExistsException.class, // Tipo de excepción esperada
            () -> userService.createUser(duplicateUser), // Código que debería lanzar excepción
            "Debería lanzar ResourceAlreadyExistsException" // Mensaje si no lanza excepción
        );
        
        // Verificar mensaje de la excepción
        String expectedMessage = "Usuario ya existe con username: testuser"; // Mensaje esperado
        assertEquals(expectedMessage, exception.getMessage(), "El mensaje de error debería coincidir"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada con mensaje correcto
    }
    
    @Test
    @DisplayName("Debería lanzar excepción al crear usuario con email duplicado")
    void createUser_WithDuplicateEmail_ShouldThrowException() {
        // Arrange - Preparar datos
        userService.createUser(testUser); // Crea primer usuario
        User duplicateUser = new User(); // Crea usuario duplicado
        duplicateUser.setUsername("differentuser"); // Username diferente
        duplicateUser.setEmail("test@example.com"); // Mismo email
        duplicateUser.setPassword("password456"); // Contraseña diferente
        
        // Act & Assert - Ejecutar acción y verificar excepción
        ResourceAlreadyExistsException exception = assertThrows(
            ResourceAlreadyExistsException.class, // Tipo de excepción esperada
            () -> userService.createUser(duplicateUser), // Código que debería lanzar excepción
            "Debería lanzar ResourceAlreadyExistsException" // Mensaje si no lanza excepción
        );
        
        // Verificar mensaje de la excepción
        String expectedMessage = "Usuario ya existe con email: test@example.com"; // Mensaje esperado
        assertEquals(expectedMessage, exception.getMessage(), "El mensaje de error debería coincidir"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada con mensaje correcto
    }
    
    @Test
    @DisplayName("Debería lanzar excepción al actualizar usuario inexistente")
    void updateUser_WithNonExistentId_ShouldThrowException() {
        // Arrange - Preparar datos
        Long nonExistentId = 999L; // ID que no existe
        User updateData = new User(); // Datos para actualizar
        updateData.setUsername("newusername"); // Nuevo username
        updateData.setEmail("newemail@example.com"); // Nuevo email
        
        // Act & Assert - Ejecutar acción y verificar excepción
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class, // Tipo de excepción esperada
            () -> userService.updateUser(nonExistentId, updateData), // Código que debería lanzar excepción
            "Debería lanzar ResourceNotFoundException" // Mensaje si no lanza excepción
        );
        
        // Verificar mensaje de la excepción
        String expectedMessage = "Usuario no encontrado con ID: 999"; // Mensaje esperado
        assertEquals(expectedMessage, exception.getMessage(), "El mensaje de error debería coincidir"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada con mensaje correcto
    }
    
    @Test
    @DisplayName("Debería lanzar excepción al eliminar usuario inexistente")
    void deleteUser_WithNonExistentId_ShouldThrowException() {
        // Arrange - Preparar datos
        Long nonExistentId = 999L; // ID que no existe
        
        // Act - Ejecutar acción
        boolean result = userService.deleteUser(nonExistentId); // Intenta eliminar usuario inexistente
        
        // Assert - Verificar resultados
        assertFalse(result, "Debería retornar false al intentar eliminar usuario inexistente"); // Verifica resultado
        
        // RESULTADO ESPERADO: Test pasa, método retorna false sin lanzar excepción
    }
    
    @Test
    @DisplayName("Debería lanzar excepción al cambiar contraseña de usuario inexistente")
    void changePassword_WithNonExistentId_ShouldThrowException() {
        // Arrange - Preparar datos
        Long nonExistentId = 999L; // ID que no existe
        String newPassword = "newpassword123"; // Nueva contraseña
        
        // Act - Ejecutar acción
        boolean result = userService.changePassword(nonExistentId, newPassword); // Intenta cambiar contraseña
        
        // Assert - Verificar resultados
        assertFalse(result, "Debería retornar false al intentar cambiar contraseña de usuario inexistente"); // Verifica resultado
        
        // RESULTADO ESPERADO: Test pasa, método retorna false sin lanzar excepción
    }
    
    @Test
    @DisplayName("Debería lanzar excepción con datos de entrada inválidos")
    void createUser_WithInvalidData_ShouldThrowException() {
        // Arrange - Preparar datos inválidos
        User invalidUser = new User(); // Crea usuario sin datos
        // No establece username, email, password (datos requeridos)
        
        // Act & Assert - Ejecutar acción y verificar excepción
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, // Tipo de excepción esperada
            () -> userService.createUser(invalidUser), // Código que debería lanzar excepción
            "Debería lanzar IllegalArgumentException" // Mensaje si no lanza excepción
        );
        
        // Verificar que el mensaje contiene información sobre el error
        String message = exception.getMessage(); // Obtiene mensaje de error
        assertTrue(message.contains("Username es requerido") || 
                  message.contains("Email es requerido") || 
                  message.contains("Password es requerido"), 
                  "El mensaje debería indicar qué campo es requerido"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada con mensaje descriptivo
    }
}
```

---

## 🔧 Testing de Servicios

### Testing de Lógica de Negocio

```java
// UserServiceBusinessLogicTest.java - Testing de lógica de negocio
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo
@ActiveProfiles("test") // Activa perfil de test
class UserServiceBusinessLogicTest {
    
    @Autowired
    private UserService userService; // Servicio a testear
    
    @Autowired
    private UserRepository userRepository; // Repositorio para verificar datos
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User(); // Crea nuevo usuario
        testUser.setUsername("businessuser"); // Establece username
        testUser.setEmail("business@example.com"); // Establece email
        testUser.setPassword("businesspass123"); // Establece contraseña
        testUser.setFirstName("Business"); // Establece nombre
        testUser.setLastName("User"); // Establece apellido
        testUser.setEnabled(true); // Habilita usuario
        
        // RESULTADO ESPERADO: testUser configurado correctamente
    }
    
    @Test
    @DisplayName("Debería validar contraseña segura")
    void validatePassword_SecurityTest() {
        // Arrange - Preparar datos
        User weakPasswordUser = new User(); // Usuario con contraseña débil
        weakPasswordUser.setUsername("weakuser"); // Establece username
        weakPasswordUser.setEmail("weak@example.com"); // Establece email
        weakPasswordUser.setPassword("123"); // Contraseña débil (muy corta)
        
        // Act & Assert - Ejecutar acción y verificar excepción
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, // Tipo de excepción esperada
            () -> userService.createUser(weakPasswordUser), // Código que debería lanzar excepción
            "Debería lanzar excepción por contraseña débil" // Mensaje si no lanza excepción
        );
        
        // Verificar mensaje de la excepción
        String message = exception.getMessage(); // Obtiene mensaje de error
        assertTrue(message.contains("Password") || message.contains("contraseña"), 
                  "El mensaje debería mencionar la contraseña"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada por contraseña débil
    }
    
    @Test
    @DisplayName("Debería validar formato de email")
    void validateEmail_FormatTest() {
        // Arrange - Preparar datos
        User invalidEmailUser = new User(); // Usuario con email inválido
        invalidEmailUser.setUsername("invalidemail"); // Establece username
        invalidEmailUser.setEmail("invalid-email"); // Email inválido (sin @)
        invalidEmailUser.setPassword("validpass123"); // Contraseña válida
        
        // Act & Assert - Ejecutar acción y verificar excepción
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, // Tipo de excepción esperada
            () -> userService.createUser(invalidEmailUser), // Código que debería lanzar excepción
            "Debería lanzar excepción por email inválido" // Mensaje si no lanza excepción
        );
        
        // Verificar mensaje de la excepción
        String message = exception.getMessage(); // Obtiene mensaje de error
        assertTrue(message.contains("Email") || message.contains("email"), 
                  "El mensaje debería mencionar el email"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada por email inválido
    }
    
    @Test
    @DisplayName("Debería actualizar timestamp al modificar usuario")
    void updateUser_ShouldUpdateTimestamp() {
        // Arrange - Preparar datos
        User createdUser = userService.createUser(testUser); // Crea usuario
        LocalDateTime originalUpdatedAt = createdUser.getUpdatedAt(); // Obtiene timestamp original
        
        // Esperar un momento para que el timestamp sea diferente
        try {
            Thread.sleep(100); // Espera 100 milisegundos
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restaura estado de interrupción
        }
        
        // Act - Ejecutar acción
        User updateData = new User(); // Datos para actualizar
        updateData.setFirstName("Updated"); // Nuevo nombre
        User updatedUser = userService.updateUser(createdUser.getId(), updateData); // Actualiza usuario
        
        // Assert - Verificar resultados
        assertTrue(updatedUser.getUpdatedAt().isAfter(originalUpdatedAt), 
                  "El timestamp debería haberse actualizado"); // Verifica timestamp actualizado
        assertEquals("Updated", updatedUser.getFirstName(), 
                    "El nombre debería estar actualizado"); // Verifica nombre actualizado
        
        // RESULTADO ESPERADO: Test pasa, timestamp actualizado correctamente
    }
    
    @Test
    @DisplayName("Debería mantener datos originales en campos no actualizados")
    void updateUser_ShouldPreserveUnchangedFields() {
        // Arrange - Preparar datos
        User createdUser = userService.createUser(testUser); // Crea usuario
        String originalEmail = createdUser.getEmail(); // Email original
        String originalPassword = createdUser.getPassword(); // Contraseña original
        
        // Act - Ejecutar acción
        User updateData = new User(); // Datos para actualizar
        updateData.setFirstName("OnlyFirstName"); // Solo actualiza nombre
        User updatedUser = userService.updateUser(createdUser.getId(), updateData); // Actualiza usuario
        
        // Assert - Verificar resultados
        assertEquals("OnlyFirstName", updatedUser.getFirstName(), 
                    "El nombre debería estar actualizado"); // Verifica nombre actualizado
        assertEquals(originalEmail, updatedUser.getEmail(), 
                    "El email debería mantenerse igual"); // Verifica email sin cambios
        assertEquals(originalPassword, updatedUser.getPassword(), 
                    "La contraseña debería mantenerse igual"); // Verifica contraseña sin cambios
        
        // RESULTADO ESPERADO: Test pasa, solo el nombre se actualizó, otros campos se mantuvieron
    }
    
    @Test
    @DisplayName("Debería obtener estadísticas correctas")
    void getUserStatistics_ShouldReturnCorrectStats() {
        // Arrange - Preparar datos
        // Crear usuarios con diferentes estados
        User activeUser1 = new User("active1", "active1@test.com", "pass1"); // Usuario activo 1
        activeUser1.setEnabled(true); // Habilita usuario
        userService.createUser(activeUser1); // Crea usuario activo 1
        
        User activeUser2 = new User("active2", "active2@test.com", "pass2"); // Usuario activo 2
        activeUser2.setEnabled(true); // Habilita usuario
        userService.createUser(activeUser2); // Crea usuario activo 2
        
        User inactiveUser = new User("inactive", "inactive@test.com", "pass3"); // Usuario inactivo
        inactiveUser.setEnabled(false); // Deshabilita usuario
        userService.createUser(inactiveUser); // Crea usuario inactivo
        
        // Act - Ejecutar acción
        UserStatistics stats = userService.getUserStatistics(); // Obtiene estadísticas
        
        // Assert - Verificar resultados
        assertEquals(3, stats.getTotalUsers(), "Debería haber 3 usuarios totales"); // Verifica total
        assertEquals(2, stats.getActiveUsers(), "Debería haber 2 usuarios activos"); // Verifica activos
        assertEquals(1, stats.getInactiveUsers(), "Debería haber 1 usuario inactivo"); // Verifica inactivos
        
        // RESULTADO ESPERADO: Test pasa, estadísticas calculadas correctamente
    }
    
    @Test
    @DisplayName("Debería buscar usuarios con criterios múltiples")
    void searchUsers_WithMultipleCriteria_ShouldReturnFilteredResults() {
        // Arrange - Preparar datos
        // Crear usuarios con diferentes características
        User user1 = new User("john_doe", "john@test.com", "pass1"); // Usuario 1
        user1.setFirstName("John"); // Nombre John
        user1.setEnabled(true); // Habilitado
        userService.createUser(user1); // Crea usuario 1
        
        User user2 = new User("jane_smith", "jane@test.com", "pass2"); // Usuario 2
        user2.setFirstName("Jane"); // Nombre Jane
        user2.setEnabled(true); // Habilitado
        userService.createUser(user2); // Crea usuario 2
        
        User user3 = new User("bob_disabled", "bob@test.com", "pass3"); // Usuario 3
        user3.setFirstName("Bob"); // Nombre Bob
        user3.setEnabled(false); // Deshabilitado
        userService.createUser(user3); // Crea usuario 3
        
        // Act - Ejecutar acción
        List<User> activeUsers = userService.searchUsers(null, null, true); // Busca usuarios activos
        List<User> johnUsers = userService.searchUsers("john", null, null); // Busca usuarios con "john"
        List<User> testEmailUsers = userService.searchUsers(null, "test.com", null); // Busca usuarios con email test.com
        
        // Assert - Verificar resultados
        assertEquals(2, activeUsers.size(), "Debería encontrar 2 usuarios activos"); // Verifica usuarios activos
        assertEquals(1, johnUsers.size(), "Debería encontrar 1 usuario con 'john'"); // Verifica búsqueda por username
        assertEquals(3, testEmailUsers.size(), "Debería encontrar 3 usuarios con email test.com"); // Verifica búsqueda por email
        
        // RESULTADO ESPERADO: Test pasa, búsquedas con criterios múltiples funcionan correctamente
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es JUnit y cuáles son sus características principales?**
   - Framework de testing para Java, anotaciones, assertions, lifecycle hooks

2. **¿Cuál es la diferencia entre JUnit 4 y JUnit 5?**
   - JUnit 5: módulos, extensiones, parámetros, testing paralelo

3. **¿Qué son las anotaciones @Test, @BeforeEach, @AfterEach?**
   - @Test: marca método como test, @BeforeEach: se ejecuta antes de cada test, @AfterEach: se ejecuta después

### Preguntas Intermedias

4. **¿Cómo manejar excepciones en JUnit?**
   - assertThrows, assertDoesNotThrow, testing de mensajes de error

5. **¿Qué es el testing de integración?**
   - Testing de componentes que interactúan entre sí, @SpringBootTest, @DataJpaTest

6. **¿Cómo medir performance en tests?**
   - Duration, Instant, assertions de tiempo, testing concurrente

### Preguntas Avanzadas

7. **¿Cómo crear extensiones personalizadas en JUnit 5?**
   - BeforeTestExecutionCallback, AfterTestExecutionCallback, ExtensionContext

8. **¿Qué son los test templates y parámetros?**
   - @ParameterizedTest, @ValueSource, @CsvSource, testing con múltiples valores

9. **¿Cómo optimizar tests de performance?**
   - Profiling, memory testing, concurrent testing, benchmarks

---

## 📚 Recursos Adicionales

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-testing)
- [Testing Best Practices](https://junit.org/junit5/docs/current/user-guide/#writing-tests)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de JUnit Avanzado! 🚀** 