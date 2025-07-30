# Capítulo 5: Testing, Deployment y Scaling
## Sección: Contract Testing (Pact, Consumer-Driven Contracts)

---

### 1. Introducción y Teoría

El **Contract Testing** verifica que los contratos entre servicios se cumplan correctamente. Es fundamental en microservicios para:

- **Garantizar compatibilidad** entre servicios
- **Detectar cambios breaking** en APIs
- **Validar contratos** antes del deployment
- **Facilitar desarrollo independiente** de servicios

**Tipos de Contract Testing:**
- **Consumer-Driven Contracts**: El consumidor define el contrato
- **Provider-Driven Contracts**: El proveedor define el contrato
- **Bi-Directional Contracts**: Ambos lados definen contratos

**Herramientas principales:**
- **Pact**: Framework para consumer-driven contract testing
- **Spring Cloud Contract**: Framework de Spring para contract testing
- **Pact Broker**: Repositorio centralizado de contratos

---

### 2. Ejemplo de Código: Consumer Tests con Pact

#### 2.1. Dependencias en pom.xml

```xml
<!-- Dependencias para Pact -->
<dependency>
    <groupId>au.com.dius.pact.consumer</groupId>
    <artifactId>junit5</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>au.com.dius.pact.consumer</groupId>
    <artifactId>java8</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>au.com.dius.pact.provider</groupId>
    <artifactId>junit5-spring</artifactId>
    <scope>test</scope>
</dependency>

<!-- Plugin para publicar contratos -->
<plugin>
    <groupId>au.com.dius.pact.provider</groupId>
    <artifactId>maven</artifactId>
    <version>4.3.2</version>
    <configuration>
        <pactDirectory>target/pacts</pactDirectory>
        <pactBrokerUrl>http://localhost:9292</pactBrokerUrl>
    </configuration>
</plugin>
```

#### 2.2. Consumer Test - Usuario Service

```java
// Pruebas de contrato para el consumidor (Usuario Service)
@ExtendWith(PactConsumerTestExt.class)
@PactTestFor(providerName = "email-validation-service")
class UsuarioServiceContractTest {
    
    // Cliente HTTP para llamadas al servicio externo
    @Autowired
    private RestTemplate restTemplate;
    
    // Servicio de usuarios que consume el servicio de validación
    @Autowired
    private UsuarioService usuarioService;
    
    // Definir contrato para validación de email
    @Pact(consumer = "usuario-service")
    public RequestResponsePact validarEmailPact(PactDslWithProvider builder) {
        return builder
            .given("email válido existe")
            .uponReceiving("una petición para validar email válido")
            .method("GET")
            .path("/validate")
            .query("email=test@email.com")
            .willRespondWith()
            .status(200)
            .headers(Map.of("Content-Type", "application/json"))
            .body(new PactDslJsonBody()
                .booleanType("valido", true)
                .stringType("mensaje", "Email válido")
                .numberType("codigo", 200))
            .toPact();
    }
    
    // Prueba usando el contrato definido
    @Test
    @PactTestFor(pactMethod = "validarEmailPact")
    void deberiaValidarEmailValido(MockServer mockServer) {
        // Configurar URL del mock server
        String baseUrl = mockServer.getUrl();
        
        // Configurar RestTemplate para usar el mock
        RestTemplate testRestTemplate = new RestTemplate();
        
        // Realizar llamada al servicio mock
        String url = baseUrl + "/validate?email=test@email.com";
        ResponseEntity<ValidacionResponse> response = testRestTemplate.getForEntity(
            url, 
            ValidacionResponse.class
        );
        
        // Verificar respuesta
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        
        ValidacionResponse validacionResponse = response.getBody();
        assertNotNull(validacionResponse);
        assertTrue(validacionResponse.isValido());
        assertEquals("Email válido", validacionResponse.getMensaje());
        assertEquals(200, validacionResponse.getCodigo());
    }
    
    // Definir contrato para email inválido
    @Pact(consumer = "usuario-service")
    public RequestResponsePact validarEmailInvalidoPact(PactDslWithProvider builder) {
        return builder
            .given("email inválido")
            .uponReceiving("una petición para validar email inválido")
            .method("GET")
            .path("/validate")
            .query("email=invalid-email")
            .willRespondWith()
            .status(400)
            .headers(Map.of("Content-Type", "application/json"))
            .body(new PactDslJsonBody()
                .booleanType("valido", false)
                .stringType("mensaje", "Email inválido")
                .numberType("codigo", 400)
                .stringType("error", "Formato de email incorrecto"))
            .toPact();
    }
    
    // Prueba para email inválido
    @Test
    @PactTestFor(pactMethod = "validarEmailInvalidoPact")
    void deberiaRechazarEmailInvalido(MockServer mockServer) {
        // Configurar URL del mock server
        String baseUrl = mockServer.getUrl();
        RestTemplate testRestTemplate = new RestTemplate();
        
        // Realizar llamada al servicio mock
        String url = baseUrl + "/validate?email=invalid-email";
        ResponseEntity<ValidacionResponse> response = testRestTemplate.getForEntity(
            url, 
            ValidacionResponse.class
        );
        
        // Verificar respuesta de error
        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
        
        ValidacionResponse validacionResponse = response.getBody();
        assertNotNull(validacionResponse);
        assertFalse(validacionResponse.isValido());
        assertEquals("Email inválido", validacionResponse.getMensaje());
        assertEquals(400, validacionResponse.getCodigo());
        assertEquals("Formato de email incorrecto", validacionResponse.getError());
    }
    
    // Definir contrato para servicio no disponible
    @Pact(consumer = "usuario-service")
    public RequestResponsePact servicioNoDisponiblePact(PactDslWithProvider builder) {
        return builder
            .given("servicio no disponible")
            .uponReceiving("una petición cuando el servicio está caído")
            .method("GET")
            .path("/validate")
            .query("email=test@email.com")
            .willRespondWith()
            .status(503)
            .headers(Map.of("Content-Type", "application/json"))
            .body(new PactDslJsonBody()
                .stringType("error", "Servicio no disponible")
                .numberType("codigo", 503))
            .toPact();
    }
    
    // Prueba para servicio no disponible
    @Test
    @PactTestFor(pactMethod = "servicioNoDisponiblePact")
    void deberiaManejarServicioNoDisponible(MockServer mockServer) {
        // Configurar URL del mock server
        String baseUrl = mockServer.getUrl();
        RestTemplate testRestTemplate = new RestTemplate();
        
        // Realizar llamada al servicio mock
        String url = baseUrl + "/validate?email=test@email.com";
        
        // Verificar que se maneja el error apropiadamente
        assertThrows(HttpClientErrorException.class, () -> {
            testRestTemplate.getForEntity(url, ValidacionResponse.class);
        });
    }
}
```

---

### 3. Ejemplo de Código: Provider Tests con Pact

```java
// Pruebas de contrato para el proveedor (Email Validation Service)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(PactVerificationSpringProvider.class)
@PactTestFor(providerName = "email-validation-service")
class EmailValidationServiceContractTest {
    
    @LocalServerPort
    private int port;
    
    @Autowired
    private EmailValidationController emailValidationController;
    
    @Autowired
    private EmailValidationService emailValidationService;
    
    // Configurar target para las pruebas de contrato
    @BeforeEach
    void setUp(PactVerificationContext context) {
        context.setTarget(new HttpTestTarget("localhost", port));
    }
    
    // Prueba de contrato para validación de email válido
    @TestTemplate
    @ExtendWith(PactVerificationInvocationContextProvider.class)
    void pactVerificationTestTemplate(PactVerificationContext context) {
        context.verifyInteraction();
    }
    
    // Estado para email válido
    @State("email válido existe")
    void toEmailValidoExists() {
        // Configurar el estado del servicio para email válido
        when(emailValidationService.validarEmail("test@email.com"))
            .thenReturn(new ValidacionResponse(true, "Email válido", 200, null));
    }
    
    // Estado para email inválido
    @State("email inválido")
    void toEmailInvalidoExists() {
        // Configurar el estado del servicio para email inválido
        when(emailValidationService.validarEmail("invalid-email"))
            .thenReturn(new ValidacionResponse(false, "Email inválido", 400, "Formato de email incorrecto"));
    }
    
    // Estado para servicio no disponible
    @State("servicio no disponible")
    void toServicioNoDisponible() {
        // Configurar el estado del servicio para simular fallo
        when(emailValidationService.validarEmail(anyString()))
            .thenThrow(new ServiceUnavailableException("Servicio no disponible"));
    }
    
    // Prueba de integración completa
    @Test
    @DisplayName("Debería validar email según contrato definido")
    void deberiaValidarEmailSegunContrato() {
        // Arrange: Preparar datos de prueba
        String email = "test@email.com";
        
        // Act: Ejecutar validación
        ValidacionResponse response = emailValidationService.validarEmail(email);
        
        // Assert: Verificar que cumple con el contrato
        assertNotNull(response);
        assertTrue(response.isValido());
        assertEquals("Email válido", response.getMensaje());
        assertEquals(200, response.getCodigo());
        assertNull(response.getError());
    }
    
    // Prueba de integración para email inválido
    @Test
    @DisplayName("Debería rechazar email inválido según contrato")
    void deberiaRechazarEmailInvalidoSegunContrato() {
        // Arrange: Preparar email inválido
        String email = "invalid-email";
        
        // Act: Ejecutar validación
        ValidacionResponse response = emailValidationService.validarEmail(email);
        
        // Assert: Verificar que cumple con el contrato
        assertNotNull(response);
        assertFalse(response.isValido());
        assertEquals("Email inválido", response.getMensaje());
        assertEquals(400, response.getCodigo());
        assertEquals("Formato de email incorrecto", response.getError());
    }
}
```

---

### 4. Ejemplo de Código: Configuración de Pact Broker

```java
// Configuración para integración con Pact Broker
@Configuration
public class PactBrokerConfig {
    
    @Value("${pact.broker.url:http://localhost:9292}")
    private String pactBrokerUrl;
    
    @Value("${pact.broker.username:}")
    private String pactBrokerUsername;
    
    @Value("${pact.broker.password:}")
    private String pactBrokerPassword;
    
    // Bean para configuración de Pact Broker
    @Bean
    public PactBrokerConfig pactBrokerConfig() {
        return new PactBrokerConfig.Builder()
            .setUrl(pactBrokerUrl)
            .setUsername(pactBrokerUsername)
            .setPassword(pactBrokerPassword)
            .build();
    }
    
    // Bean para cliente de Pact Broker
    @Bean
    public PactBrokerClient pactBrokerClient(PactBrokerConfig config) {
        return new PactBrokerClient(config);
    }
    
    // Bean para publicar contratos
    @Bean
    public PactPublisher pactPublisher(PactBrokerClient client) {
        return new PactPublisher(client);
    }
}

// Servicio para gestionar contratos con Pact Broker
@Service
@Slf4j
public class PactContractService {
    
    @Autowired
    private PactBrokerClient pactBrokerClient;
    
    @Autowired
    private PactPublisher pactPublisher;
    
    // Método para publicar contrato
    public void publicarContrato(String consumerName, String providerName, String pactContent) {
        try {
            log.info("Publicando contrato: {} -> {}", consumerName, providerName);
            
            // Publicar contrato al broker
            pactPublisher.publishPact(pactContent, consumerName, providerName);
            
            log.info("Contrato publicado exitosamente");
            
        } catch (Exception e) {
            log.error("Error publicando contrato: {}", e.getMessage(), e);
            throw new RuntimeException("Error publicando contrato", e);
        }
    }
    
    // Método para verificar contrato
    public boolean verificarContrato(String consumerName, String providerName, String version) {
        try {
            log.info("Verificando contrato: {} -> {} (versión: {})", consumerName, providerName, version);
            
            // Verificar contrato en el broker
            boolean esValido = pactBrokerClient.verifyPact(consumerName, providerName, version);
            
            if (esValido) {
                log.info("Contrato verificado exitosamente");
            } else {
                log.warn("Contrato no cumple con las expectativas");
            }
            
            return esValido;
            
        } catch (Exception e) {
            log.error("Error verificando contrato: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para obtener lista de contratos
    public List<PactContract> obtenerContratos(String consumerName) {
        try {
            log.debug("Obteniendo contratos para consumidor: {}", consumerName);
            
            // Obtener contratos del broker
            List<PactContract> contratos = pactBrokerClient.getPacts(consumerName);
            
            log.debug("Encontrados {} contratos", contratos.size());
            return contratos;
            
        } catch (Exception e) {
            log.error("Error obteniendo contratos: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
    
    // Método para eliminar contrato obsoleto
    public void eliminarContrato(String consumerName, String providerName, String version) {
        try {
            log.info("Eliminando contrato: {} -> {} (versión: {})", consumerName, providerName, version);
            
            // Eliminar contrato del broker
            pactBrokerClient.deletePact(consumerName, providerName, version);
            
            log.info("Contrato eliminado exitosamente");
            
        } catch (Exception e) {
            log.error("Error eliminando contrato: {}", e.getMessage(), e);
            throw new RuntimeException("Error eliminando contrato", e);
        }
    }
}
```

---

### 5. Ejemplo de Código: Controlador para Gestión de Contratos

```java
// Controlador REST para gestionar contratos
@RestController
@RequestMapping("/api/contracts")
@Slf4j
public class ContractController {
    
    @Autowired
    private PactContractService pactContractService;
    
    // Endpoint para publicar contrato
    @PostMapping("/publish")
    public ResponseEntity<Map<String, Object>> publicarContrato(
            @RequestBody PublishContractRequest request) {
        
        log.info("Solicitud de publicación de contrato recibida: {} -> {}", 
            request.getConsumerName(), request.getProviderName());
        
        try {
            // Publicar contrato
            pactContractService.publicarContrato(
                request.getConsumerName(),
                request.getProviderName(),
                request.getPactContent()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Contrato publicado exitosamente");
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error publicando contrato: {}", e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Endpoint para verificar contrato
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verificarContrato(
            @RequestBody VerifyContractRequest request) {
        
        log.info("Solicitud de verificación de contrato recibida: {} -> {}", 
            request.getConsumerName(), request.getProviderName());
        
        try {
            // Verificar contrato
            boolean esValido = pactContractService.verificarContrato(
                request.getConsumerName(),
                request.getProviderName(),
                request.getVersion()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("valid", esValido);
            response.put("message", esValido ? "Contrato válido" : "Contrato inválido");
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error verificando contrato: {}", e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Endpoint para listar contratos
    @GetMapping("/list/{consumerName}")
    public ResponseEntity<List<PactContract>> listarContratos(@PathVariable String consumerName) {
        log.debug("Solicitud de lista de contratos recibida para: {}", consumerName);
        
        try {
            List<PactContract> contratos = pactContractService.obtenerContratos(consumerName);
            return ResponseEntity.ok(contratos);
            
        } catch (Exception e) {
            log.error("Error listando contratos: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Endpoint para eliminar contrato
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> eliminarContrato(
            @RequestBody DeleteContractRequest request) {
        
        log.info("Solicitud de eliminación de contrato recibida: {} -> {} (versión: {})", 
            request.getConsumerName(), request.getProviderName(), request.getVersion());
        
        try {
            // Eliminar contrato
            pactContractService.eliminarContrato(
                request.getConsumerName(),
                request.getProviderName(),
                request.getVersion()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Contrato eliminado exitosamente");
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error eliminando contrato: {}", e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            response.put("timestamp", Instant.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
```

---

### 6. Pruebas Unitarias para Contract Testing

```java
// Pruebas unitarias para servicio de contratos
@SpringBootTest
public class PactContractServiceTest {
    
    @Autowired
    private PactContractService pactContractService;
    
    @MockBean
    private PactBrokerClient pactBrokerClient;
    
    @Test
    public void testPublicarContrato() {
        // Arrange: Preparar datos de prueba
        String consumerName = "usuario-service";
        String providerName = "email-validation-service";
        String pactContent = "{\"consumer\":{\"name\":\"usuario-service\"},\"provider\":{\"name\":\"email-validation-service\"}}";
        
        // Act: Publicar contrato
        pactContractService.publicarContrato(consumerName, providerName, pactContent);
        
        // Assert: Verificar que se llamó al broker
        verify(pactBrokerClient, times(1)).publishPact(pactContent, consumerName, providerName);
    }
    
    @Test
    public void testVerificarContrato() {
        // Arrange: Configurar mock
        String consumerName = "usuario-service";
        String providerName = "email-validation-service";
        String version = "1.0.0";
        
        when(pactBrokerClient.verifyPact(consumerName, providerName, version))
            .thenReturn(true);
        
        // Act: Verificar contrato
        boolean resultado = pactContractService.verificarContrato(consumerName, providerName, version);
        
        // Assert: Verificar resultado
        assertTrue(resultado);
        verify(pactBrokerClient, times(1)).verifyPact(consumerName, providerName, version);
    }
    
    @Test
    public void testObtenerContratos() {
        // Arrange: Configurar mock
        String consumerName = "usuario-service";
        List<PactContract> contratosEsperados = Arrays.asList(
            new PactContract("usuario-service", "email-validation-service", "1.0.0"),
            new PactContract("usuario-service", "notification-service", "1.0.0")
        );
        
        when(pactBrokerClient.getPacts(consumerName))
            .thenReturn(contratosEsperados);
        
        // Act: Obtener contratos
        List<PactContract> contratos = pactContractService.obtenerContratos(consumerName);
        
        // Assert: Verificar resultado
        assertEquals(2, contratos.size());
        assertEquals("email-validation-service", contratos.get(0).getProviderName());
        assertEquals("notification-service", contratos.get(1).getProviderName());
    }
}
```

---

### 7. Mejoras y Patrones de Diseño

- **Contract Versioning**: Versionar contratos para compatibilidad
- **Contract Evolution**: Evolucionar contratos sin breaking changes
- **Contract Testing in CI/CD**: Integrar contract testing en pipelines
- **Contract Documentation**: Documentar contratos automáticamente
- **Contract Monitoring**: Monitorear cumplimiento de contratos en producción

---

### 8. Resultados Esperados y Manejo de Errores

#### 8.1. Escenarios exitosos

- **Contrato válido**:
    - Consumer y provider cumplen con el contrato
    - Pruebas pasan exitosamente
    - Contrato se publica en broker

#### 8.2. Escenarios de error

- **Contrato roto**:
    - Provider no cumple con expectativas del consumer
    - Pruebas fallan con mensaje descriptivo
    - Se notifica a equipos de desarrollo

- **Servicio no disponible**:
    - Pact Broker no está disponible
    - Pruebas fallan con error de conectividad
    - Se implementa retry automático

---

### 9. Explicación Detallada de la Lógica

- **Consumer-Driven Contracts**: El consumidor define las expectativas
- **Pact Broker**: Centraliza y gestiona contratos
- **Mock Server**: Simula respuestas del provider en pruebas
- **State Management**: Gestiona estados del provider para pruebas
- **Contract Verification**: Valida que el provider cumple con contratos

---

¿Deseas que continúe con la siguiente sección del capítulo 5 (por ejemplo, "End-to-End Testing" o "Deployment Strategies")? 