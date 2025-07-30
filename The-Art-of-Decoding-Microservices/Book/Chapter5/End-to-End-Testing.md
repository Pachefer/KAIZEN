# Capítulo 5: Testing, Deployment y Scaling
## Sección: End-to-End Testing (Pruebas E2E, Selenium, RestAssured)

---

### 1. Introducción y Teoría

Las **pruebas End-to-End (E2E)** verifican que todo el sistema funcione correctamente desde la perspectiva del usuario final. En microservicios, esto incluye:

- **Flujos completos de usuario**: Desde la interfaz hasta la base de datos
- **Integración entre servicios**: Comunicación entre múltiples microservicios
- **Interfaz de usuario**: Pruebas de frontend con Selenium
- **APIs REST**: Pruebas de APIs con RestAssured

**Tipos de pruebas E2E:**
- **UI Testing**: Pruebas de interfaz de usuario
- **API Testing**: Pruebas de APIs REST
- **Workflow Testing**: Pruebas de flujos de negocio completos
- **Performance Testing**: Pruebas de rendimiento del sistema completo

---

### 2. Ejemplo de Código: Pruebas E2E con RestAssured

#### 2.1. Dependencias en pom.xml

```xml
<!-- Dependencias para RestAssured -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>json-schema-validator</artifactId>
    <scope>test</scope>
</dependency>

<!-- Dependencias para Selenium -->
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-chrome-driver</artifactId>
    <scope>test</scope>
</dependency>

<!-- Dependencias para TestContainers -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

#### 2.2. Configuración de RestAssured

```java
// Configuración base para pruebas E2E con RestAssured
@TestConfiguration
public class RestAssuredConfig {
    
    // Configurar RestAssured antes de todas las pruebas
    @BeforeAll
    static void setupRestAssured() {
        // Configurar base URI para todas las pruebas
        RestAssured.baseURI = "http://localhost:8080";
        
        // Configurar logging para debugging
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        
        // Configurar timeouts
        RestAssured.config = RestAssured.config()
            .connectionConfig(ConnectionConfig.connectionConfig()
                .connectTimeout(5000)
                .readTimeout(10000));
        
        // Configurar filtros para logging
        RestAssured.filters(new RequestLoggingFilter(), new ResponseLoggingFilter());
    }
    
    // Configurar autenticación si es necesaria
    @BeforeEach
    void setupAuthentication() {
        // Obtener token de autenticación
        String token = obtenerTokenAutenticacion();
        
        // Configurar header de autorización para todas las peticiones
        if (token != null) {
            RestAssured.given()
                .header("Authorization", "Bearer " + token);
        }
    }
    
    // Método para obtener token de autenticación
    private String obtenerTokenAutenticacion() {
        try {
            // Realizar login para obtener token
            Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body("{\"username\":\"admin\",\"password\":\"admin123\"}")
                .when()
                .post("/api/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .response();
            
            return response.jsonPath().getString("token");
        } catch (Exception e) {
            // Si no se puede obtener token, continuar sin autenticación
            return null;
        }
    }
}
```

---

### 3. Ejemplo de Código: Pruebas E2E de API

```java
// Pruebas E2E para el flujo completo de gestión de usuarios
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ExtendWith(RestAssuredExtension.class)
class UsuarioE2ETest {
    
    @LocalServerPort
    private int port;
    
    // Configurar puerto para RestAssured
    @BeforeEach
    void setupPort() {
        RestAssured.port = port;
    }
    
    // Prueba E2E completa del flujo de creación de usuario
    @Test
    @DisplayName("Flujo completo: Crear, buscar, actualizar y eliminar usuario")
    void flujoCompletoGestionUsuario() {
        // 1. CREAR USUARIO
        log.info("=== PASO 1: Crear usuario ===");
        
        String email = "e2e-test-" + System.currentTimeMillis() + "@email.com";
        String nombre = "Usuario E2E Test";
        
        // Crear usuario via API
        Response createResponse = RestAssured.given()
            .contentType(ContentType.JSON)
            .body("{\"email\":\"" + email + "\",\"nombre\":\"" + nombre + "\"}")
            .when()
            .post("/api/usuarios")
            .then()
            .statusCode(201)  // Verificar que se creó exitosamente
            .body("email", equalTo(email))  // Verificar email
            .body("nombre", equalTo(nombre))  // Verificar nombre
            .body("status", equalTo("CREATED"))  // Verificar status
            .body("id", notNullValue())  // Verificar que tiene ID
            .extract()
            .response();
        
        // Extraer ID del usuario creado
        Long userId = createResponse.jsonPath().getLong("id");
        log.info("Usuario creado con ID: {}", userId);
        
        // 2. BUSCAR USUARIO CREADO
        log.info("=== PASO 2: Buscar usuario creado ===");
        
        // Buscar usuario por ID
        Response getResponse = RestAssured.given()
            .when()
            .get("/api/usuarios/" + userId)
            .then()
            .statusCode(200)  // Verificar que se encontró
            .body("id", equalTo(userId.intValue()))  // Verificar ID
            .body("email", equalTo(email))  // Verificar email
            .body("nombre", equalTo(nombre))  // Verificar nombre
            .body("status", equalTo("FOUND"))  // Verificar status
            .extract()
            .response();
        
        log.info("Usuario encontrado exitosamente");
        
        // 3. ACTUALIZAR USUARIO
        log.info("=== PASO 3: Actualizar usuario ===");
        
        String nuevoNombre = "Usuario E2E Actualizado";
        
        // Actualizar usuario
        Response updateResponse = RestAssured.given()
            .contentType(ContentType.JSON)
            .body("{\"nombre\":\"" + nuevoNombre + "\"}")
            .when()
            .put("/api/usuarios/" + userId)
            .then()
            .statusCode(200)  // Verificar que se actualizó
            .body("id", equalTo(userId.intValue()))  // Verificar ID
            .body("email", equalTo(email))  // Verificar email se mantiene
            .body("nombre", equalTo(nuevoNombre))  // Verificar nuevo nombre
            .body("status", equalTo("UPDATED"))  // Verificar status
            .extract()
            .response();
        
        log.info("Usuario actualizado exitosamente");
        
        // 4. VERIFICAR ACTUALIZACIÓN
        log.info("=== PASO 4: Verificar actualización ===");
        
        // Buscar usuario nuevamente para verificar cambios
        RestAssured.given()
            .when()
            .get("/api/usuarios/" + userId)
            .then()
            .statusCode(200)  // Verificar que se encuentra
            .body("nombre", equalTo(nuevoNombre))  // Verificar nombre actualizado
            .body("email", equalTo(email));  // Verificar email sin cambios
        
        log.info("Actualización verificada exitosamente");
        
        // 5. ELIMINAR USUARIO
        log.info("=== PASO 5: Eliminar usuario ===");
        
        // Eliminar usuario
        RestAssured.given()
            .when()
            .delete("/api/usuarios/" + userId)
            .then()
            .statusCode(200);  // Verificar que se eliminó
        
        log.info("Usuario eliminado exitosamente");
        
        // 6. VERIFICAR ELIMINACIÓN
        log.info("=== PASO 6: Verificar eliminación ===");
        
        // Intentar buscar usuario eliminado
        RestAssured.given()
            .when()
            .get("/api/usuarios/" + userId)
            .then()
            .statusCode(404);  // Verificar que no se encuentra
        
        log.info("Eliminación verificada exitosamente");
        
        log.info("=== FLUJO E2E COMPLETADO EXITOSAMENTE ===");
    }
    
    // Prueba E2E para validación de email
    @Test
    @DisplayName("Flujo E2E: Validación de email con servicio externo")
    void flujoValidacionEmail() {
        log.info("=== INICIANDO PRUEBA E2E DE VALIDACIÓN DE EMAIL ===");
        
        // 1. CREAR USUARIO CON EMAIL VÁLIDO
        log.info("Paso 1: Crear usuario con email válido");
        
        String emailValido = "usuario-valido@email.com";
        
        Response responseValido = RestAssured.given()
            .contentType(ContentType.JSON)
            .body("{\"email\":\"" + emailValido + "\",\"nombre\":\"Usuario Válido\"}")
            .when()
            .post("/api/usuarios")
            .then()
            .statusCode(201)  // Debería crearse exitosamente
            .body("email", equalTo(emailValido))
            .extract()
            .response();
        
        Long userIdValido = responseValido.jsonPath().getLong("id");
        log.info("Usuario con email válido creado: {}", userIdValido);
        
        // 2. INTENTAR CREAR USUARIO CON EMAIL INVÁLIDO
        log.info("Paso 2: Intentar crear usuario con email inválido");
        
        String emailInvalido = "email-invalido";
        
        RestAssured.given()
            .contentType(ContentType.JSON)
            .body("{\"email\":\"" + emailInvalido + "\",\"nombre\":\"Usuario Inválido\"}")
            .when()
            .post("/api/usuarios")
            .then()
            .statusCode(400)  // Debería fallar
            .body("error", containsString("Email inválido"));  // Verificar mensaje de error
        
        log.info("Validación de email inválido funcionó correctamente");
        
        // 3. LIMPIAR DATOS DE PRUEBA
        log.info("Paso 3: Limpiar datos de prueba");
        
        RestAssured.given()
            .when()
            .delete("/api/usuarios/" + userIdValido)
            .then()
            .statusCode(200);
        
        log.info("=== PRUEBA E2E DE VALIDACIÓN COMPLETADA ===");
    }
    
    // Prueba E2E para manejo de errores
    @Test
    @DisplayName("Flujo E2E: Manejo de errores y casos edge")
    void flujoManejoErrores() {
        log.info("=== INICIANDO PRUEBA E2E DE MANEJO DE ERRORES ===");
        
        // 1. INTENTAR CREAR USUARIO SIN DATOS REQUERIDOS
        log.info("Paso 1: Crear usuario sin email");
        
        RestAssured.given()
            .contentType(ContentType.JSON)
            .body("{\"nombre\":\"Usuario Sin Email\"}")
            .when()
            .post("/api/usuarios")
            .then()
            .statusCode(400)  // Debería fallar
            .body("error", containsString("Email es requerido"));
        
        log.info("Validación de email requerido funcionó");
        
        // 2. INTENTAR BUSCAR USUARIO INEXISTENTE
        log.info("Paso 2: Buscar usuario inexistente");
        
        RestAssured.given()
            .when()
            .get("/api/usuarios/999999")
            .then()
            .statusCode(404)  // Debería no encontrar
            .body("error", containsString("Usuario no encontrado"));
        
        log.info("Manejo de usuario inexistente funcionó");
        
        // 3. INTENTAR ACTUALIZAR USUARIO INEXISTENTE
        log.info("Paso 3: Actualizar usuario inexistente");
        
        RestAssured.given()
            .contentType(ContentType.JSON)
            .body("{\"nombre\":\"Usuario Actualizado\"}")
            .when()
            .put("/api/usuarios/999999")
            .then()
            .statusCode(404)  // Debería no encontrar
            .body("error", containsString("Usuario no encontrado"));
        
        log.info("Manejo de actualización de usuario inexistente funcionó");
        
        // 4. INTENTAR ELIMINAR USUARIO INEXISTENTE
        log.info("Paso 4: Eliminar usuario inexistente");
        
        RestAssured.given()
            .when()
            .delete("/api/usuarios/999999")
            .then()
            .statusCode(404)  // Debería no encontrar
            .body("error", containsString("Usuario no encontrado"));
        
        log.info("Manejo de eliminación de usuario inexistente funcionó");
        
        log.info("=== PRUEBA E2E DE MANEJO DE ERRORES COMPLETADA ===");
    }
}
```

---

### 4. Ejemplo de Código: Pruebas E2E con Selenium

```java
// Pruebas E2E de interfaz de usuario con Selenium
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class UsuarioUIE2ETest {
    
    @LocalServerPort
    private int port;
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Configurar WebDriver antes de cada prueba
    @BeforeEach
    void setupWebDriver() {
        // Configurar Chrome en modo headless para CI/CD
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Navegar a la aplicación
        driver.get("http://localhost:" + port);
    }
    
    // Limpiar WebDriver después de cada prueba
    @AfterEach
    void cleanupWebDriver() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    // Prueba E2E completa de interfaz de usuario
    @Test
    @DisplayName("Flujo E2E UI: Crear, buscar y eliminar usuario desde interfaz")
    void flujoCompletoUI() {
        log.info("=== INICIANDO PRUEBA E2E DE INTERFAZ DE USUARIO ===");
        
        // 1. VERIFICAR QUE LA PÁGINA SE CARGA CORRECTAMENTE
        log.info("Paso 1: Verificar carga de página");
        
        wait.until(ExpectedConditions.titleContains("Gestión de Usuarios"));
        
        // Verificar que los elementos principales están presentes
        WebElement titulo = driver.findElement(By.tagName("h1"));
        assertEquals("Gestión de Usuarios", titulo.getText());
        
        WebElement formulario = driver.findElement(By.id("usuario-form"));
        assertTrue(formulario.isDisplayed());
        
        log.info("Página cargada correctamente");
        
        // 2. CREAR USUARIO DESDE LA INTERFAZ
        log.info("Paso 2: Crear usuario desde interfaz");
        
        // Llenar formulario
        WebElement emailInput = driver.findElement(By.id("email"));
        WebElement nombreInput = driver.findElement(By.id("nombre"));
        WebElement submitButton = driver.findElement(By.id("submit-btn"));
        
        String email = "ui-test-" + System.currentTimeMillis() + "@email.com";
        String nombre = "Usuario UI Test";
        
        emailInput.sendKeys(email);
        nombreInput.sendKeys(nombre);
        
        // Enviar formulario
        submitButton.click();
        
        // Esperar mensaje de éxito
        WebElement successMessage = wait.until(ExpectedConditions.elementToBeClickable(
            By.className("alert-success")));
        
        assertTrue(successMessage.getText().contains("Usuario creado exitosamente"));
        log.info("Usuario creado desde interfaz");
        
        // 3. BUSCAR USUARIO CREADO
        log.info("Paso 3: Buscar usuario creado");
        
        // Usar campo de búsqueda
        WebElement searchInput = driver.findElement(By.id("search-input"));
        searchInput.sendKeys(email);
        
        WebElement searchButton = driver.findElement(By.id("search-btn"));
        searchButton.click();
        
        // Esperar resultados
        WebElement userRow = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//tr[contains(., '" + email + "')]")));
        
        assertTrue(userRow.isDisplayed());
        assertTrue(userRow.getText().contains(nombre));
        log.info("Usuario encontrado en la tabla");
        
        // 4. EDITAR USUARIO
        log.info("Paso 4: Editar usuario");
        
        // Hacer clic en botón de editar
        WebElement editButton = userRow.findElement(By.className("btn-edit"));
        editButton.click();
        
        // Esperar que se abra el modal de edición
        WebElement editModal = wait.until(ExpectedConditions.elementToBeClickable(
            By.id("edit-modal")));
        
        // Modificar nombre
        WebElement editNombreInput = editModal.findElement(By.id("edit-nombre"));
        String nuevoNombre = "Usuario UI Actualizado";
        editNombreInput.clear();
        editNombreInput.sendKeys(nuevoNombre);
        
        // Guardar cambios
        WebElement saveButton = editModal.findElement(By.id("save-btn"));
        saveButton.click();
        
        // Esperar mensaje de éxito
        WebElement updateMessage = wait.until(ExpectedConditions.elementToBeClickable(
            By.className("alert-success")));
        
        assertTrue(updateMessage.getText().contains("Usuario actualizado exitosamente"));
        log.info("Usuario actualizado desde interfaz");
        
        // 5. VERIFICAR CAMBIOS
        log.info("Paso 5: Verificar cambios");
        
        // Refrescar búsqueda
        searchInput.clear();
        searchInput.sendKeys(email);
        searchButton.click();
        
        // Verificar que el nombre se actualizó
        WebElement updatedRow = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//tr[contains(., '" + nuevoNombre + "')]")));
        
        assertTrue(updatedRow.isDisplayed());
        log.info("Cambios verificados correctamente");
        
        // 6. ELIMINAR USUARIO
        log.info("Paso 6: Eliminar usuario");
        
        // Hacer clic en botón de eliminar
        WebElement deleteButton = updatedRow.findElement(By.className("btn-delete"));
        deleteButton.click();
        
        // Confirmar eliminación en modal
        WebElement confirmModal = wait.until(ExpectedConditions.elementToBeClickable(
            By.id("confirm-modal")));
        
        WebElement confirmButton = confirmModal.findElement(By.id("confirm-btn"));
        confirmButton.click();
        
        // Esperar mensaje de éxito
        WebElement deleteMessage = wait.until(ExpectedConditions.elementToBeClickable(
            By.className("alert-success")));
        
        assertTrue(deleteMessage.getText().contains("Usuario eliminado exitosamente"));
        log.info("Usuario eliminado desde interfaz");
        
        // 7. VERIFICAR ELIMINACIÓN
        log.info("Paso 7: Verificar eliminación");
        
        // Buscar usuario eliminado
        searchInput.clear();
        searchInput.sendKeys(email);
        searchButton.click();
        
        // Verificar que no aparece en resultados
        List<WebElement> results = driver.findElements(By.xpath("//tr[contains(., '" + email + "')]"));
        assertEquals(0, results.size());
        
        log.info("Eliminación verificada correctamente");
        
        log.info("=== PRUEBA E2E DE INTERFAZ COMPLETADA EXITOSAMENTE ===");
    }
    
    // Prueba E2E para validación de formularios
    @Test
    @DisplayName("Flujo E2E UI: Validación de formularios")
    void validacionFormulariosUI() {
        log.info("=== INICIANDO PRUEBA E2E DE VALIDACIÓN DE FORMULARIOS ===");
        
        // 1. INTENTAR CREAR USUARIO SIN EMAIL
        log.info("Paso 1: Crear usuario sin email");
        
        WebElement nombreInput = driver.findElement(By.id("nombre"));
        WebElement submitButton = driver.findElement(By.id("submit-btn"));
        
        nombreInput.sendKeys("Usuario Sin Email");
        submitButton.click();
        
        // Verificar mensaje de error
        WebElement errorMessage = wait.until(ExpectedConditions.elementToBeClickable(
            By.className("alert-danger")));
        
        assertTrue(errorMessage.getText().contains("Email es requerido"));
        log.info("Validación de email requerido funcionó");
        
        // 2. INTENTAR CREAR USUARIO CON EMAIL INVÁLIDO
        log.info("Paso 2: Crear usuario con email inválido");
        
        WebElement emailInput = driver.findElement(By.id("email"));
        emailInput.sendKeys("email-invalido");
        
        submitButton.click();
        
        // Verificar mensaje de error
        WebElement invalidEmailError = wait.until(ExpectedConditions.elementToBeClickable(
            By.className("alert-danger")));
        
        assertTrue(invalidEmailError.getText().contains("Email inválido"));
        log.info("Validación de formato de email funcionó");
        
        log.info("=== PRUEBA E2E DE VALIDACIÓN COMPLETADA ===");
    }
}
```

---

### 5. Ejemplo de Código: Pruebas E2E de Performance

```java
// Pruebas E2E de rendimiento con RestAssured
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class UsuarioPerformanceE2ETest {
    
    @LocalServerPort
    private int port;
    
    @BeforeEach
    void setupPort() {
        RestAssured.port = port;
    }
    
    // Prueba de rendimiento para creación de usuarios
    @Test
    @DisplayName("Performance E2E: Crear múltiples usuarios concurrentemente")
    void performanceCrearUsuarios() {
        log.info("=== INICIANDO PRUEBA E2E DE PERFORMANCE ===");
        
        int numUsuarios = 100;
        List<String> emails = new ArrayList<>();
        
        // Generar emails únicos
        for (int i = 0; i < numUsuarios; i++) {
            emails.add("perf-test-" + System.currentTimeMillis() + "-" + i + "@email.com");
        }
        
        // Medir tiempo de creación secuencial
        long startTime = System.currentTimeMillis();
        
        for (String email : emails) {
            RestAssured.given()
                .contentType(ContentType.JSON)
                .body("{\"email\":\"" + email + "\",\"nombre\":\"Usuario Performance\"}")
                .when()
                .post("/api/usuarios")
                .then()
                .statusCode(201);
        }
        
        long endTime = System.currentTimeMillis();
        long tiempoTotal = endTime - startTime;
        
        log.info("Tiempo total para crear {} usuarios: {} ms", numUsuarios, tiempoTotal);
        log.info("Promedio por usuario: {} ms", tiempoTotal / numUsuarios);
        
        // Verificar que todos los usuarios se crearon
        for (String email : emails) {
            RestAssured.given()
                .when()
                .get("/api/usuarios/search?email=" + email)
                .then()
                .statusCode(200)
                .body("size()", equalTo(1));
        }
        
        log.info("Todos los usuarios creados exitosamente");
        
        // Limpiar datos de prueba
        for (String email : emails) {
            Response response = RestAssured.given()
                .when()
                .get("/api/usuarios/search?email=" + email)
                .then()
                .extract()
                .response();
            
            Long userId = response.jsonPath().getLong("[0].id");
            if (userId != null) {
                RestAssured.given()
                    .when()
                    .delete("/api/usuarios/" + userId)
                    .then()
                    .statusCode(200);
            }
        }
        
        log.info("=== PRUEBA E2E DE PERFORMANCE COMPLETADA ===");
    }
    
    // Prueba de carga para búsqueda de usuarios
    @Test
    @DisplayName("Performance E2E: Búsqueda de usuarios bajo carga")
    void performanceBusquedaUsuarios() {
        log.info("=== INICIANDO PRUEBA E2E DE CARGA DE BÚSQUEDA ===");
        
        // Crear usuarios de prueba
        List<Long> userIds = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            String email = "load-test-" + System.currentTimeMillis() + "-" + i + "@email.com";
            
            Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body("{\"email\":\"" + email + "\",\"nombre\":\"Usuario Load Test\"}")
                .when()
                .post("/api/usuarios")
                .then()
                .statusCode(201)
                .extract()
                .response();
            
            userIds.add(response.jsonPath().getLong("id"));
        }
        
        // Realizar búsquedas concurrentes
        int numBusquedas = 200;
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < numBusquedas; i++) {
            RestAssured.given()
                .when()
                .get("/api/usuarios")
                .then()
                .statusCode(200)
                .body("size()", greaterThan(0));
        }
        
        long endTime = System.currentTimeMillis();
        long tiempoTotal = endTime - startTime;
        
        log.info("Tiempo total para {} búsquedas: {} ms", numBusquedas, tiempoTotal);
        log.info("Promedio por búsqueda: {} ms", tiempoTotal / numBusquedas);
        log.info("Búsquedas por segundo: {}", (numBusquedas * 1000.0) / tiempoTotal);
        
        // Limpiar datos de prueba
        for (Long userId : userIds) {
            RestAssured.given()
                .when()
                .delete("/api/usuarios/" + userId)
                .then()
                .statusCode(200);
        }
        
        log.info("=== PRUEBA E2E DE CARGA COMPLETADA ===");
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Test Data Management**: Gestionar datos de prueba de forma centralizada
- **Parallel Test Execution**: Ejecutar pruebas E2E en paralelo
- **Test Reporting**: Generar reportes detallados de pruebas E2E
- **Visual Testing**: Capturar screenshots en caso de fallo
- **Cross-Browser Testing**: Probar en múltiples navegadores

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Flujo completo exitoso**:
    - Todas las operaciones CRUD funcionan correctamente
    - Interfaz de usuario responde apropiadamente
    - APIs devuelven respuestas correctas
    - Rendimiento cumple con expectativas

#### 7.2. Escenarios de error

- **Error de conectividad**:
    - Pruebas fallan con timeout apropiado
    - Screenshots se capturan automáticamente
    - Logs detallan el problema específico

- **Error de validación**:
    - Mensajes de error se muestran correctamente
    - Formularios no se envían con datos inválidos
    - Validación funciona en frontend y backend

---

### 8. Explicación Detallada de la Lógica

- **RestAssured**: Simplifica pruebas de APIs REST
- **Selenium WebDriver**: Automatiza pruebas de interfaz de usuario
- **TestContainers**: Proporciona entornos aislados para pruebas
- **Performance Testing**: Mide rendimiento del sistema completo
- **E2E Testing**: Verifica flujos completos desde la perspectiva del usuario

---

¿Deseas que continúe con la siguiente sección del capítulo 5 (por ejemplo, "Deployment Strategies" o "Scaling Strategies")? 