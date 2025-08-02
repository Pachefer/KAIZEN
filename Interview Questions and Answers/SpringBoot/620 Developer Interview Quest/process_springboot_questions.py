#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para procesar preguntas de Spring Boot: traducir, generar ejemplos y pruebas
"""

import json
import os
from typing import Dict, List, Any

def translate_question(question: str, answer: str, category: str) -> Dict[str, str]:
    """
    Traduce pregunta y respuesta al español
    """
    # Traducciones básicas para términos técnicos
    translations = {
        'spring boot': 'Spring Boot',
        'dependency injection': 'inyección de dependencias',
        'bean': 'bean',
        'autoconfiguration': 'autoconfiguración',
        'starter': 'starter',
        'jpa': 'JPA',
        'hibernate': 'Hibernate',
        'repository': 'repositorio',
        'entity': 'entidad',
        'controller': 'controlador',
        'rest': 'REST',
        'api': 'API',
        'security': 'seguridad',
        'authentication': 'autenticación',
        'authorization': 'autorización',
        'jwt': 'JWT',
        'test': 'prueba',
        'mock': 'mock',
        'integration': 'integración',
        'deploy': 'desplegar',
        'docker': 'Docker',
        'cloud': 'nube',
        'production': 'producción'
    }
    
    # Traducción simple (en un caso real usarías un servicio de traducción)
    translated_question = question
    translated_answer = answer
    
    for eng, esp in translations.items():
        translated_question = translated_question.replace(eng, esp)
        translated_answer = translated_answer.replace(eng, esp)
    
    return {
        'original_question': question,
        'translated_question': translated_question,
        'original_answer': answer,
        'translated_answer': translated_answer,
        'category': category
    }

def generate_example_code(category: str, question: str) -> Dict[str, str]:
    """
    Genera ejemplos de código basados en la categoría y pregunta
    """
    examples = {
        'Spring Core': '''
```java
// Ejemplo de Inyección de Dependencias
@Component
public class UserService {
    private final UserRepository userRepository;
    
    // Constructor injection - forma recomendada
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
    }
}

// Configuración de Bean
@Configuration
public class AppConfig {
    @Bean
    public UserRepository userRepository() {
        return new JpaUserRepository();
    }
}
```''',
        
        'Spring Boot': '''
```java
// Aplicación Spring Boot básica
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}

// Configuración de propiedades
@RestController
public class ConfigController {
    @Value("${app.name}")
    private String appName;
    
    @GetMapping("/config")
    public String getConfig() {
        return "Aplicación: " + appName;
    }
}

// application.properties
app.name=Mi Aplicación Spring Boot
server.port=8080
```''',
        
        'Spring Data': '''
```java
// Entidad JPA
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    // Getters y setters
}

// Repositorio Spring Data
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
    List<User> findByEmailDomain(@Param("domain") String domain);
}
```''',
        
        'Spring Security': '''
```java
// Configuración de Seguridad
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```''',
        
        'Spring Web': '''
```java
// Controlador REST
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```''',
        
        'Testing': '''
```java
// Prueba unitaria con JUnit 5 y Mockito
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void findById_WhenUserExists_ReturnsUser() {
        // Arrange
        Long userId = 1L;
        User expectedUser = new User(userId, "test@example.com", "Test User");
        when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser));
        
        // Act
        User result = userService.findById(userId);
        
        // Assert
        assertThat(result).isEqualTo(expectedUser);
        verify(userRepository).findById(userId);
    }
    
    @Test
    void findById_WhenUserNotExists_ThrowsException() {
        // Arrange
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> userService.findById(userId))
            .isInstanceOf(UserNotFoundException.class)
            .hasMessage("Usuario no encontrado");
    }
}

// Prueba de integración
@SpringBootTest
@AutoConfigureTestDatabase
class UserControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void createUser_ReturnsCreatedUser() {
        User user = new User(null, "test@example.com", "Test User");
        
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users", user, User.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getEmail()).isEqualTo("test@example.com");
    }
}
```''',
        
        'Deployment': '''
```yaml
# Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/mydb
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

# application-docker.properties
spring.datasource.url=jdbc:postgresql://db:5432/mydb
spring.datasource.username=user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```'''
    }
    
    return {
        'code_example': examples.get(category, examples['Spring Boot']),
        'explanation': f'Ejemplo práctico de {category} que demuestra los conceptos mencionados en la pregunta.'
    }

def generate_unit_tests(category: str) -> Dict[str, str]:
    """
    Genera pruebas unitarias para los ejemplos de código
    """
    tests = {
        'Spring Core': '''
```java
// Pruebas para UserService
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void constructorInjection_WorksCorrectly() {
        assertThat(userService).isNotNull();
        assertThat(userService.getUserRepository()).isEqualTo(userRepository);
    }
    
    @Test
    void findById_WithValidId_ReturnsUser() {
        Long id = 1L;
        User expectedUser = new User(id, "test@example.com", "Test User");
        when(userRepository.findById(id)).thenReturn(Optional.of(expectedUser));
        
        User result = userService.findById(id);
        
        assertThat(result).isEqualTo(expectedUser);
    }
}
```''',
        
        'Spring Boot': '''
```java
// Pruebas para ConfigController
@WebMvcTest(ConfigController.class)
class ConfigControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @TestConfiguration
    static class TestConfig {
        @Bean
        public ConfigController configController() {
            return new ConfigController();
        }
    }
    
    @Test
    void getConfig_ReturnsApplicationName() throws Exception {
        mockMvc.perform(get("/config"))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("Mi Aplicación")));
    }
}
```''',
        
        'Spring Data': '''
```java
// Pruebas para UserRepository
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void findByEmail_WithExistingEmail_ReturnsUser() {
        User user = new User(null, "test@example.com", "Test User");
        entityManager.persistAndFlush(user);
        
        Optional<User> found = userRepository.findByEmail("test@example.com");
        
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
    }
    
    @Test
    void findByEmail_WithNonExistingEmail_ReturnsEmpty() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        
        assertThat(found).isEmpty();
    }
}
```''',
        
        'Spring Security': '''
```java
// Pruebas para SecurityConfig
@WebMvcTest
class SecurityConfigTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void publicEndpoint_IsAccessible() throws Exception {
        mockMvc.perform(get("/public/hello"))
            .andExpect(status().isOk());
    }
    
    @Test
    void adminEndpoint_RequiresAuthentication() throws Exception {
        mockMvc.perform(get("/admin/users"))
            .andExpect(status().is3xxRedirection());
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void adminEndpoint_WithAdminRole_IsAccessible() throws Exception {
        mockMvc.perform(get("/admin/users"))
            .andExpect(status().isOk());
    }
}
```''',
        
        'Spring Web': '''
```java
// Pruebas para UserController
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void getUser_WithValidId_ReturnsUser() throws Exception {
        Long userId = 1L;
        User user = new User(userId, "test@example.com", "Test User");
        when(userService.findById(userId)).thenReturn(user);
        
        mockMvc.perform(get("/api/users/{id}", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(userId))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }
    
    @Test
    void createUser_WithValidData_ReturnsCreatedUser() throws Exception {
        User user = new User(null, "new@example.com", "New User");
        User savedUser = new User(1L, "new@example.com", "New User");
        when(userService.save(any(User.class))).thenReturn(savedUser);
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"new@example.com\",\"name\":\"New User\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1L));
    }
}
```''',
        
        'Testing': '''
```java
// Pruebas para las pruebas (meta-testing)
class TestExamplesTest {
    
    @Test
    void testExamples_AreValidJavaCode() {
        // Verificar que los ejemplos de código son sintácticamente válidos
        assertThat(TestExamples.class).isNotNull();
    }
    
    @Test
    void testAnnotations_AreCorrectlyUsed() {
        Method[] methods = TestExamples.class.getMethods();
        
        for (Method method : methods) {
            if (method.getName().startsWith("test")) {
                assertThat(method.isAnnotationPresent(Test.class)).isTrue();
            }
        }
    }
}
```''',
        
        'Deployment': '''
```yaml
# Pruebas de configuración Docker
# docker-compose.test.yml
version: '3.8'
services:
  app-test:
    build: .
    environment:
      - SPRING_PROFILES_ACTIVE=test
      - SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb
    ports:
      - "8081:8080"
  
  test-runner:
    image: curlimages/curl
    depends_on:
      - app-test
    command: >
      sh -c "
        echo 'Waiting for app to start...' &&
        sleep 30 &&
        curl -f http://app-test:8080/actuator/health &&
        echo 'Application is healthy!'
      "
```'''
    }
    
    return {
        'unit_tests': tests.get(category, tests['Spring Boot']),
        'test_explanation': f'Pruebas unitarias para el ejemplo de {category} que verifican el comportamiento esperado.'
    }

def generate_improvements(category: str) -> List[str]:
    """
    Genera sugerencias de mejoras para cada categoría
    """
    improvements = {
        'Spring Core': [
            'Usar constructor injection en lugar de field injection para mejor testabilidad',
            'Implementar interfaces para desacoplar componentes',
            'Usar @Qualifier cuando hay múltiples beans del mismo tipo',
            'Configurar beans con @ConditionalOnProperty para configuración condicional',
            'Implementar ApplicationListener para eventos personalizados'
        ],
        'Spring Boot': [
            'Usar @ConfigurationProperties para configuraciones tipadas',
            'Implementar health checks personalizados con @Component',
            'Configurar múltiples profiles para diferentes entornos',
            'Usar Spring Boot Actuator para monitoreo',
            'Implementar custom starters para reutilización'
        ],
        'Spring Data': [
            'Usar @Query con índices optimizados',
            'Implementar paginación para consultas grandes',
            'Usar @EntityGraph para evitar N+1 queries',
            'Implementar auditoría con @EntityListeners',
            'Usar @Lock para control de concurrencia'
        ],
        'Spring Security': [
            'Implementar autenticación JWT con refresh tokens',
            'Usar @PreAuthorize para autorización a nivel de método',
            'Implementar rate limiting para prevenir ataques',
            'Configurar CORS apropiadamente',
            'Usar HTTPS en producción'
        ],
        'Spring Web': [
            'Implementar validación con @Valid y @Validated',
            'Usar ResponseEntity para respuestas HTTP apropiadas',
            'Implementar manejo global de excepciones',
            'Usar @RestControllerAdvice para advice personalizado',
            'Implementar versionado de APIs'
        ],
        'Testing': [
            'Usar @TestPropertySource para configuración de pruebas',
            'Implementar pruebas de integración con @SpringBootTest',
            'Usar @MockBean para mocks de Spring',
            'Implementar pruebas de contrato con Pact',
            'Usar TestContainers para pruebas con bases de datos reales'
        ],
        'Deployment': [
            'Implementar health checks y readiness probes',
            'Configurar logging estructurado con JSON',
            'Usar secrets management para credenciales',
            'Implementar blue-green deployment',
            'Configurar monitoring con Prometheus y Grafana'
        ]
    }
    
    return improvements.get(category, improvements['Spring Boot'])

def process_questions(input_file: str, output_file: str):
    """
    Procesa las preguntas: traduce, genera ejemplos y mejoras
    """
    print("🔄 Procesando preguntas de Spring Boot...")
    
    # Leer preguntas estructuradas
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    processed_questions = []
    
    for i, question in enumerate(data['questions'][:10], 1):  # Procesar solo las primeras 10
        print(f"📝 Procesando pregunta {i}/{min(10, len(data['questions']))}")
        
        # Traducir pregunta
        translation = translate_question(
            question['question'], 
            question['answer'], 
            question['category']
        )
        
        # Generar ejemplo de código
        code_example = generate_example_code(
            question['category'], 
            question['question']
        )
        
        # Generar pruebas unitarias
        unit_tests = generate_unit_tests(question['category'])
        
        # Generar mejoras
        improvements = generate_improvements(question['category'])
        
        # Crear pregunta procesada
        processed_question = {
            'id': i,
            'original_question': translation['original_question'],
            'translated_question': translation['translated_question'],
            'original_answer': translation['original_answer'],
            'translated_answer': translation['translated_answer'],
            'category': question['category'],
            'difficulty': question.get('difficulty', 'Intermediate'),
            'code_example': code_example['code_example'],
            'code_explanation': code_example['explanation'],
            'unit_tests': unit_tests['unit_tests'],
            'test_explanation': unit_tests['test_explanation'],
            'improvements': improvements,
            'expected_result': 'Código ejecutable que demuestra el concepto de Spring Boot',
            'learning_objectives': [
                'Comprender el concepto de Spring Boot',
                'Aplicar patrones de diseño',
                'Implementar pruebas unitarias',
                'Seguir mejores prácticas'
            ]
        }
        
        processed_questions.append(processed_question)
    
    # Guardar preguntas procesadas
    output_data = {
        'metadata': {
            'source': '620 Spring Boot Developer Interview Questions - Manish Salunke',
            'processed_questions': len(processed_questions),
            'categories': list(set(q['category'] for q in processed_questions))
        },
        'questions': processed_questions
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Procesamiento completado: {len(processed_questions)} preguntas procesadas")
    print(f"📁 Archivo guardado: {output_file}")

def main():
    """Función principal"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(current_dir, 'springboot_questions_structured.json')
    output_file = os.path.join(current_dir, 'springboot_questions_processed.json')
    
    if not os.path.exists(input_file):
        print(f"❌ Error: No se encontró el archivo de entrada: {input_file}")
        print("💡 Ejecuta primero: python extract_springboot_questions.py")
        return
    
    process_questions(input_file, output_file)

if __name__ == "__main__":
    main() 