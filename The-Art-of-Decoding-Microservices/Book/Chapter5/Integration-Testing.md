# Capítulo 5: Testing, Deployment y Scaling
## Sección: Integration Testing (TestContainers, Pruebas de Integración)

---

### 1. Introducción y Teoría

Las **pruebas de integración** verifican que los componentes de un sistema funcionen correctamente juntos. En microservicios, esto incluye:

- **Integración con bases de datos**: Verificar operaciones CRUD
- **Integración con servicios externos**: Verificar comunicación HTTP/gRPC
- **Integración con colas de mensajes**: Verificar procesamiento de eventos
- **TestContainers**: Contenedores Docker para pruebas de integración

**Ventajas de TestContainers:**
- **Aislamiento**: Cada prueba tiene su propio entorno
- **Realismo**: Usa las mismas tecnologías que en producción
- **Automatización**: Configuración automática de contenedores
- **Reproducibilidad**: Mismos resultados en cualquier entorno

---

### 2. Ejemplo de Código: Configuración de TestContainers

#### 2.1. Dependencias en pom.xml

```xml
<!-- Dependencias para TestContainers -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>kafka</artifactId>
    <scope>test</scope>
</dependency>

<!-- Dependencia para base de datos PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Dependencia para JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

#### 2.2. Configuración de TestContainers

```java
// Configuración base para pruebas de integración
@TestConfiguration
public class TestContainersConfig {
    
    // Contenedor PostgreSQL para pruebas
    @Container
    static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>("postgres:13")
        .withDatabaseName("testdb")
        .withUsername("testuser")
        .withPassword("testpass")
        .withInitScript("init-test-db.sql");  // Script de inicialización
    
    // Contenedor Kafka para pruebas
    @Container
    static KafkaContainer kafkaContainer = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:6.2.1"))
        .withExposedPorts(9093)
        .withEnv("KAFKA_CFG_LISTENERS", "PLAINTEXT://0.0.0.0:9093")
        .withEnv("KAFKA_CFG_ADVERTISED_LISTENERS", "PLAINTEXT://localhost:9093");
    
    // Configuración de propiedades para pruebas
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Configurar URL de base de datos
        registry.add("spring.datasource.url", postgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
        registry.add("spring.datasource.driver-class-name", postgresContainer::getDriverClassName);
        
        // Configurar JPA
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.jpa.show-sql", () -> "true");
        registry.add("spring.jpa.properties.hibernate.format_sql", () -> "true");
        
        // Configurar Kafka
        registry.add("spring.kafka.bootstrap-servers", kafkaContainer::getBootstrapServers);
        registry.add("spring.kafka.consumer.auto-offset-reset", () -> "earliest");
    }
}
```

---

### 3. Ejemplo de Código: Pruebas de Integración con Base de Datos

```java
// Pruebas de integración para el servicio de usuarios
@SpringBootTest
@Testcontainers
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UsuarioServiceIntegrationTest {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    // Prueba de integración para crear usuario
    @Test
    @DisplayName("Debería crear usuario exitosamente en base de datos")
    void deberiaCrearUsuarioExitosamente() {
        // Arrange: Preparar datos de prueba
        UsuarioRequest request = new UsuarioRequest("test@email.com", "Test User");
        
        // Act: Ejecutar operación
        UsuarioResponse response = usuarioService.crearUsuario(request);
        
        // Assert: Verificar resultado
        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("test@email.com", response.getEmail());
        assertEquals("CREATED", response.getStatus());
        
        // Verificar que se guardó en la base de datos
        Usuario usuarioGuardado = usuarioRepository.findById(response.getId()).orElse(null);
        assertNotNull(usuarioGuardado);
        assertEquals("test@email.com", usuarioGuardado.getEmail());
        assertEquals("Test User", usuarioGuardado.getNombre());
    }
    
    // Prueba de integración para buscar usuario
    @Test
    @DisplayName("Debería buscar usuario existente en base de datos")
    void deberiaBuscarUsuarioExistente() {
        // Arrange: Crear usuario en base de datos
        Usuario usuario = new Usuario();
        usuario.setEmail("buscar@email.com");
        usuario.setNombre("Usuario Buscar");
        usuario = usuarioRepository.save(usuario);
        
        // Forzar flush para asegurar que se guardó
        entityManager.flush();
        entityManager.clear();
        
        // Act: Ejecutar búsqueda
        UsuarioResponse response = usuarioService.buscarUsuario(usuario.getId());
        
        // Assert: Verificar resultado
        assertNotNull(response);
        assertEquals(usuario.getId(), response.getId());
        assertEquals("buscar@email.com", response.getEmail());
        assertEquals("FOUND", response.getStatus());
    }
    
    // Prueba de integración para actualizar usuario
    @Test
    @DisplayName("Debería actualizar usuario existente en base de datos")
    void deberiaActualizarUsuarioExistente() {
        // Arrange: Crear usuario en base de datos
        Usuario usuario = new Usuario();
        usuario.setEmail("actualizar@email.com");
        usuario.setNombre("Usuario Original");
        usuario = usuarioRepository.save(usuario);
        
        // Preparar datos de actualización
        UsuarioUpdateRequest updateRequest = new UsuarioUpdateRequest("Usuario Actualizado");
        
        // Act: Ejecutar actualización
        UsuarioResponse response = usuarioService.actualizarUsuario(usuario.getId(), updateRequest);
        
        // Assert: Verificar resultado
        assertNotNull(response);
        assertEquals(usuario.getId(), response.getId());
        assertEquals("UPDATED", response.getStatus());
        
        // Verificar que se actualizó en la base de datos
        Usuario usuarioActualizado = usuarioRepository.findById(usuario.getId()).orElse(null);
        assertNotNull(usuarioActualizado);
        assertEquals("Usuario Actualizado", usuarioActualizado.getNombre());
    }
    
    // Prueba de integración para eliminar usuario
    @Test
    @DisplayName("Debería eliminar usuario existente de base de datos")
    void deberiaEliminarUsuarioExistente() {
        // Arrange: Crear usuario en base de datos
        Usuario usuario = new Usuario();
        usuario.setEmail("eliminar@email.com");
        usuario.setNombre("Usuario Eliminar");
        usuario = usuarioRepository.save(usuario);
        
        // Act: Ejecutar eliminación
        boolean eliminado = usuarioService.eliminarUsuario(usuario.getId());
        
        // Assert: Verificar resultado
        assertTrue(eliminado);
        
        // Verificar que se eliminó de la base de datos
        Optional<Usuario> usuarioEliminado = usuarioRepository.findById(usuario.getId());
        assertFalse(usuarioEliminado.isPresent());
    }
    
    // Prueba de integración para validación de email único
    @Test
    @DisplayName("Debería fallar al crear usuario con email duplicado")
    void deberiaFallarConEmailDuplicado() {
        // Arrange: Crear usuario con email específico
        UsuarioRequest request1 = new UsuarioRequest("duplicado@email.com", "Usuario 1");
        usuarioService.crearUsuario(request1);
        
        // Act & Assert: Intentar crear otro usuario con el mismo email
        UsuarioRequest request2 = new UsuarioRequest("duplicado@email.com", "Usuario 2");
        
        assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.crearUsuario(request2);
        });
        
        // Verificar que solo existe un usuario con ese email
        List<Usuario> usuarios = usuarioRepository.findByEmail("duplicado@email.com");
        assertEquals(1, usuarios.size());
    }
    
    // Prueba de integración para búsqueda por email
    @Test
    @DisplayName("Debería buscar usuarios por email")
    void deberiaBuscarUsuariosPorEmail() {
        // Arrange: Crear múltiples usuarios
        usuarioRepository.save(new Usuario(null, "usuario1@email.com", "Usuario 1"));
        usuarioRepository.save(new Usuario(null, "usuario2@email.com", "Usuario 2"));
        usuarioRepository.save(new Usuario(null, "otro@email.com", "Otro Usuario"));
        
        // Act: Buscar usuarios que contengan "usuario" en el email
        List<Usuario> usuarios = usuarioService.buscarUsuariosPorEmail("usuario");
        
        // Assert: Verificar resultado
        assertEquals(2, usuarios.size());
        assertTrue(usuarios.stream().allMatch(u -> u.getEmail().contains("usuario")));
    }
}
```

---

### 4. Ejemplo de Código: Pruebas de Integración con Kafka

```java
// Pruebas de integración para eventos de Kafka
@SpringBootTest
@Testcontainers
class KafkaIntegrationTest {
    
    @Autowired
    private UsuarioEventPublisher eventPublisher;
    
    @Autowired
    private KafkaTemplate<String, UsuarioEvent> kafkaTemplate;
    
    @Autowired
    private UsuarioEventConsumer eventConsumer;
    
    // Prueba de integración para publicación de eventos
    @Test
    @DisplayName("Debería publicar evento de usuario creado en Kafka")
    void deberiaPublicarEventoUsuarioCreado() throws InterruptedException {
        // Arrange: Preparar evento
        UsuarioEvent evento = new UsuarioEvent();
        evento.setId(1L);
        evento.setEmail("test@email.com");
        evento.setTipo("USUARIO_CREADO");
        evento.setTimestamp(Instant.now());
        
        // Act: Publicar evento
        eventPublisher.publicarEvento(evento);
        
        // Assert: Verificar que el evento se publicó
        // Esperar un poco para que se procese
        Thread.sleep(1000);
        
        // Verificar que el consumidor recibió el evento
        List<UsuarioEvent> eventosRecibidos = eventConsumer.getEventosRecibidos();
        assertFalse(eventosRecibidos.isEmpty());
        
        UsuarioEvent eventoRecibido = eventosRecibidos.get(eventosRecibidos.size() - 1);
        assertEquals(evento.getId(), eventoRecibido.getId());
        assertEquals(evento.getEmail(), eventoRecibido.getEmail());
        assertEquals(evento.getTipo(), eventoRecibido.getTipo());
    }
    
    // Prueba de integración para procesamiento de eventos
    @Test
    @DisplayName("Debería procesar múltiples eventos en orden")
    void deberiaProcesarMultiplesEventosEnOrden() throws InterruptedException {
        // Arrange: Preparar múltiples eventos
        List<UsuarioEvent> eventos = Arrays.asList(
            crearEvento(1L, "evento1@email.com", "USUARIO_CREADO"),
            crearEvento(2L, "evento2@email.com", "USUARIO_ACTUALIZADO"),
            crearEvento(3L, "evento3@email.com", "USUARIO_ELIMINADO")
        );
        
        // Act: Publicar eventos
        for (UsuarioEvent evento : eventos) {
            eventPublisher.publicarEvento(evento);
        }
        
        // Assert: Verificar procesamiento
        Thread.sleep(2000);
        
        List<UsuarioEvent> eventosRecibidos = eventConsumer.getEventosRecibidos();
        assertTrue(eventosRecibidos.size() >= eventos.size());
        
        // Verificar que los eventos se procesaron en el orden correcto
        for (int i = 0; i < eventos.size(); i++) {
            assertEquals(eventos.get(i).getId(), eventosRecibidos.get(i).getId());
            assertEquals(eventos.get(i).getTipo(), eventosRecibidos.get(i).getTipo());
        }
    }
    
    // Método auxiliar para crear eventos
    private UsuarioEvent crearEvento(Long id, String email, String tipo) {
        UsuarioEvent evento = new UsuarioEvent();
        evento.setId(id);
        evento.setEmail(email);
        evento.setTipo(tipo);
        evento.setTimestamp(Instant.now());
        return evento;
    }
}
```

---

### 5. Ejemplo de Código: Pruebas de Integración con Servicios Externos

```java
// Pruebas de integración para servicios externos
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ExternalServiceIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private RestTemplate restTemplate;
    
    // Prueba de integración para validación de email externa
    @Test
    @DisplayName("Debería validar email usando servicio externo")
    void deberiaValidarEmailConServicioExterno() {
        // Arrange: Configurar mock para servicio externo
        ValidacionResponse validacionResponse = new ValidacionResponse(true);
        when(restTemplate.getForEntity(
            contains("/validate"), 
            eq(ValidacionResponse.class)
        )).thenReturn(ResponseEntity.ok(validacionResponse));
        
        // Act: Crear usuario (que internamente valida email)
        UsuarioRequest request = new UsuarioRequest("valid@email.com", "Test User");
        
        // Assert: Verificar que se llamó al servicio externo
        // En una implementación real, se verificaría el resultado
        assertDoesNotThrow(() -> {
            // Simular llamada al servicio
            restTemplate.getForEntity("http://email-service/validate?email=valid@email.com", 
                ValidacionResponse.class);
        });
        
        // Verificar que se realizó la llamada
        verify(restTemplate, times(1)).getForEntity(
            contains("/validate"), 
            eq(ValidacionResponse.class)
        );
    }
    
    // Prueba de integración para manejo de errores en servicios externos
    @Test
    @DisplayName("Debería manejar errores de servicios externos")
    void deberiaManejarErroresDeServiciosExternos() {
        // Arrange: Configurar mock para simular error
        when(restTemplate.getForEntity(
            anyString(), 
            eq(ValidacionResponse.class)
        )).thenThrow(new RestClientException("Servicio no disponible"));
        
        // Act & Assert: Verificar manejo de error
        assertThrows(RestClientException.class, () -> {
            restTemplate.getForEntity("http://email-service/validate?email=test@email.com", 
                ValidacionResponse.class);
        });
    }
    
    // Prueba de integración para timeout de servicios externos
    @Test
    @DisplayName("Debería manejar timeouts de servicios externos")
    void deberiaManejarTimeoutsDeServiciosExternos() {
        // Arrange: Configurar mock para simular timeout
        when(restTemplate.getForEntity(
            anyString(), 
            eq(ValidacionResponse.class)
        )).thenThrow(new ResourceAccessException("Timeout"));
        
        // Act & Assert: Verificar manejo de timeout
        assertThrows(ResourceAccessException.class, () -> {
            restTemplate.getForEntity("http://email-service/validate?email=test@email.com", 
                ValidacionResponse.class);
        });
    }
}
```

---

### 6. Ejemplo de Código: Configuración de Pruebas de Integración

```java
// Configuración específica para pruebas de integración
@TestConfiguration
public class IntegrationTestConfig {
    
    // Bean para RestTemplate con configuración de pruebas
    @Bean
    @Primary
    public RestTemplate testRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        
        // Configurar timeout para pruebas
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(5000);
        restTemplate.setRequestFactory(factory);
        
        return restTemplate;
    }
    
    // Bean para configuración de Kafka en pruebas
    @Bean
    public KafkaTemplate<String, UsuarioEvent> testKafkaTemplate(
            ProducerFactory<String, UsuarioEvent> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
    
    // Bean para configuración de consumidor de Kafka en pruebas
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, UsuarioEvent> testKafkaListenerContainerFactory(
            ConsumerFactory<String, UsuarioEvent> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, UsuarioEvent> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setConcurrency(1);
        return factory;
    }
}
```

---

### 7. Mejoras y Patrones de Diseño

- **Test Data Builders**: Crear builders para datos de prueba
- **Test Containers Lifecycle**: Gestionar ciclo de vida de contenedores
- **Parallel Test Execution**: Ejecutar pruebas en paralelo
- **Test Categories**: Categorizar pruebas por tipo y velocidad
- **Test Reporting**: Generar reportes detallados de pruebas

---

### 8. Resultados Esperados y Manejo de Errores

#### 8.1. Escenarios exitosos

- **Pruebas de base de datos**:
    - Operaciones CRUD funcionan correctamente
    - Transacciones se manejan apropiadamente
    - Datos se persisten y recuperan correctamente

#### 8.2. Escenarios de error

- **Error de conexión a base de datos**:
    - Prueba falla con mensaje descriptivo
    - Contenedor se reinicia automáticamente
    - Logs detallan el problema de conectividad

- **Error en servicio externo**:
    - Prueba maneja timeout apropiadamente
    - Circuit breaker se activa si está configurado
    - Fallback se ejecuta correctamente

---

### 9. Explicación Detallada de la Lógica

- **TestContainers**: Proporciona contenedores Docker para pruebas
- **@Transactional**: Gestiona transacciones en pruebas
- **@AutoConfigureTestDatabase**: Configura base de datos de prueba
- **MockMvc**: Simula peticiones HTTP para pruebas de controladores
- **KafkaTemplate**: Gestiona publicación de mensajes en Kafka

---

¿Deseas que continúe con la siguiente sección del capítulo 5 (por ejemplo, "Contract Testing" o "End-to-End Testing")? 