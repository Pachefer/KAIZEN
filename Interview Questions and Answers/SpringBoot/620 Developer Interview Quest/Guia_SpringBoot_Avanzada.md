# Guía Avanzada de Spring Boot - 620 Preguntas y Respuestas

## 🎯 Descripción

Esta guía avanzada contiene preguntas y respuestas detalladas sobre Spring Boot, incluyendo ejemplos de código prácticos, pruebas unitarias y mejoras recomendadas. Basada en el libro "620 Spring Boot Developer Interview Questions" de Manish Salunke.

## 📋 Contenido

- **Preguntas traducidas** al español
- **Ejemplos de código** con documentación línea por línea
- **Pruebas unitarias** completas y explicadas
- **Mejoras y mejores prácticas** para cada concepto
- **Objetivos de aprendizaje** claros

---

## Pregunta 1: ¿Qué es Spring Boot?

### 📝 Pregunta Original
What is Spring Boot?

### 🔍 Respuesta Traducida
Spring Boot es un framework que simplifica el desarrollo de aplicaciones Spring.

### 💻 Ejemplo de Código
```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}

@RestController
public class ConfigController {
    @Value("${app.name}")
    private String appName;
    
    @GetMapping("/config")
    public String getConfig() {
        return "Aplicación: " + appName;
    }
}

# application.properties
app.name=Mi Aplicación Spring Boot
server.port=8080
```

### 📖 Explicación del Código
Ejemplo práctico de Spring Boot que demuestra los conceptos mencionados en la pregunta.

### 🧪 Pruebas Unitarias
```java
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
```

### 📚 Explicación de las Pruebas
Pruebas unitarias para el ejemplo de Spring Boot que verifican el comportamiento esperado.

### 🎯 Resultado Esperado
Código ejecutable que demuestra el concepto de Spring Boot

### 🚀 Mejoras Recomendadas
1. Usar @ConfigurationProperties para configuraciones tipadas
2. Implementar health checks personalizados con @Component
3. Configurar múltiples profiles para diferentes entornos
4. Usar Spring Boot Actuator para monitoreo
5. Implementar custom starters para reutilización

### 📖 Objetivos de Aprendizaje
- Comprender el concepto de Spring Boot
- Aplicar patrones de diseño
- Implementar pruebas unitarias
- Seguir mejores prácticas

### 📊 Información Adicional
- **Categoría**: Spring Boot
- **Dificultad**: Intermediate
- **ID**: 1

---

## Pregunta 2: ¿Qué es la inyección de dependencias?

### 📝 Pregunta Original
What is dependency injection?

### 🔍 Respuesta Traducida
La inyección de dependencias es un patrón de diseño donde las dependencias se proporcionan a una clase en lugar de crearse dentro de ella.

### 💻 Ejemplo de Código
```java
@Component
public class UserService {
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
    }
}

@Configuration
public class AppConfig {
    @Bean
    public UserRepository userRepository() {
        return new JpaUserRepository();
    }
}
```

### 📖 Explicación del Código
Ejemplo práctico de Spring Core que demuestra los conceptos mencionados en la pregunta.

### 🧪 Pruebas Unitarias
```java
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
```

### 📚 Explicación de las Pruebas
Pruebas unitarias para el ejemplo de Spring Core que verifican el comportamiento esperado.

### 🎯 Resultado Esperado
Código ejecutable que demuestra el concepto de Spring Boot

### 🚀 Mejoras Recomendadas
1. Usar constructor injection en lugar de field injection para mejor testabilidad
2. Implementar interfaces para desacoplar componentes
3. Usar @Qualifier cuando hay múltiples beans del mismo tipo
4. Configurar beans con @ConditionalOnProperty para configuración condicional
5. Implementar ApplicationListener para eventos personalizados

### 📖 Objetivos de Aprendizaje
- Comprender el concepto de Spring Boot
- Aplicar patrones de diseño
- Implementar pruebas unitarias
- Seguir mejores prácticas

### 📊 Información Adicional
- **Categoría**: Spring Core
- **Dificultad**: Intermediate
- **ID**: 2

---

## Pregunta 3: ¿Qué es JPA?

### 📝 Pregunta Original
What is JPA?

### 🔍 Respuesta Traducida
JPA (Java Persistence API) es una especificación para gestionar datos relacionales en aplicaciones Java.

### 💻 Ejemplo de Código
```java
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

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
    List<User> findByEmailDomain(@Param("domain") String domain);
}
```

### 📖 Explicación del Código
Ejemplo práctico de Spring Data que demuestra los conceptos mencionados en la pregunta.

### 🧪 Pruebas Unitarias
```java
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
```

### 📚 Explicación de las Pruebas
Pruebas unitarias para el ejemplo de Spring Data que verifican el comportamiento esperado.

### 🎯 Resultado Esperado
Código ejecutable que demuestra el concepto de Spring Boot

### 🚀 Mejoras Recomendadas
1. Usar @Query con índices optimizados
2. Implementar paginación para consultas grandes
3. Usar @EntityGraph para evitar N+1 queries
4. Implementar auditoría con @EntityListeners
5. Usar @Lock para control de concurrencia

### 📖 Objetivos de Aprendizaje
- Comprender el concepto de Spring Boot
- Aplicar patrones de diseño
- Implementar pruebas unitarias
- Seguir mejores prácticas

### 📊 Información Adicional
- **Categoría**: Spring Data
- **Dificultad**: Intermediate
- **ID**: 3

---

