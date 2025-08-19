# 🌱 Guía Completa de Spring Boot - Entrevistas y Dominio

## 🎯 Introducción a Spring Boot

**Spring Boot** es un framework de Java que simplifica el desarrollo de aplicaciones Spring, proporcionando configuración automática, servidor embebido y dependencias preconfiguradas.

### 🌟 **¿Por qué Spring Boot?**

- **Configuración automática** - Auto-configuration inteligente
- **Servidor embebido** - Tomcat, Jetty o Undertow incluidos
- **Starter POMs** - Dependencias preconfiguradas
- **Actuator** - Monitoreo y métricas integradas
- **Ecosistema empresarial** - Spring Cloud, Security, Data

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Qué es la inyección de dependencias en Spring Boot?**

**Respuesta Completa:**

La **Inyección de Dependencias (DI)** es un patrón de diseño donde las dependencias de una clase se proporcionan externamente en lugar de crearlas internamente.

**Tipos de Inyección:**

1. **Constructor Injection** - Dependencias por constructor (recomendado)
2. **Setter Injection** - Dependencias por métodos setter
3. **Field Injection** - Dependencias por campos anotados

```java
// Ejemplo de Inyección de Dependencias
@SpringBootApplication
public class SpringBootDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoApplication.class, args);
    }
}

// Servicio de negocio
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // Constructor Injection (RECOMENDADO)
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        emailService.sendWelcomeEmail(savedUser.getEmail());
        return savedUser;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

// Repositorio
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByActiveTrue();
}

// Servicio de email
@Service
public class EmailService {
    private final JavaMailSender mailSender;
    
    // Constructor Injection
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public void sendWelcomeEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("¡Bienvenido!");
        message.setText("Gracias por registrarte en nuestra aplicación.");
        mailSender.send(message);
    }
}

// Controlador REST
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    // Constructor Injection
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}

// Entidad
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
    
    @Column(name = "is_active")
    private boolean active = true;
    
    // Constructores, getters y setters
    public User() {}
    
    public User(String email, String name) {
        this.email = email;
        this.name = name;
    }
    
    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
```

**Simulador de Inyección de Dependencias:**

```java
// dependency-injection-simulator.java
import java.util.*;
import java.lang.reflect.*;

public class DependencyInjectionSimulator {
    private Map<String, Object> beans = new HashMap<>();
    private Map<String, Class<?>> beanDefinitions = new HashMap<>();
    private int injectionCount = 0;
    private int errorCount = 0;
    
    public static void main(String[] args) {
        DependencyInjectionSimulator simulator = new DependencyInjectionSimulator();
        simulator.runSimulation();
    }
    
    // Registrar definición de bean
    public void registerBean(String name, Class<?> clazz) {
        beanDefinitions.put(name, clazz);
        System.out.println("📝 Bean registrado: " + name + " -> " + clazz.getSimpleName());
    }
    
    // Crear y configurar bean
    public Object createBean(String name) {
        try {
            Class<?> clazz = beanDefinitions.get(name);
            if (clazz == null) {
                throw new RuntimeException("Bean no encontrado: " + name);
            }
            
            System.out.println("\n🔧 Creando bean: " + name + " (" + clazz.getSimpleName() + ")");
            
            // Buscar constructor con más parámetros (constructor principal)
            Constructor<?>[] constructors = clazz.getConstructors();
            Constructor<?> mainConstructor = Arrays.stream(constructors)
                .max(Comparator.comparing(Constructor::getParameterCount))
                .orElse(null);
            
            if (mainConstructor == null) {
                // Constructor por defecto
                Object bean = clazz.getDeclaredConstructor().newInstance();
                beans.put(name, bean);
                System.out.println("   ✅ Bean creado con constructor por defecto");
                return bean;
            }
            
            // Constructor con parámetros - inyección de dependencias
            Class<?>[] paramTypes = mainConstructor.getParameterTypes();
            Object[] params = new Object[paramTypes.length];
            
            System.out.println("   📋 Constructor encontrado con " + paramTypes.length + " parámetros:");
            
            for (int i = 0; i < paramTypes.length; i++) {
                String paramName = "param" + i;
                Class<?> paramType = paramTypes[i];
                
                // Buscar bean del tipo requerido
                Object dependency = findBeanByType(paramType);
                if (dependency != null) {
                    params[i] = dependency;
                    System.out.println("   ✅ Parámetro " + i + " (" + paramType.getSimpleName() + ") inyectado");
                    injectionCount++;
                } else {
                    // Crear dependencia si no existe
                    dependency = createDependency(paramType);
                    params[i] = dependency;
                    System.out.println("   🔄 Dependencia " + paramType.getSimpleName() + " creada automáticamente");
                }
            }
            
            // Crear bean con dependencias inyectadas
            Object bean = mainConstructor.newInstance(params);
            beans.put(name, bean);
            
            System.out.println("   🎉 Bean creado exitosamente con inyección de dependencias");
            return bean;
            
        } catch (Exception e) {
            System.out.println("   ❌ Error creando bean: " + e.getMessage());
            errorCount++;
            return null;
        }
    }
    
    // Buscar bean por tipo
    private Object findBeanByType(Class<?> type) {
        for (Object bean : beans.values()) {
            if (type.isAssignableFrom(bean.getClass())) {
                return bean;
            }
        }
        return null;
    }
    
    // Crear dependencia automáticamente
    private Object createDependency(Class<?> type) {
        try {
            // Para tipos básicos, crear valores por defecto
            if (type == String.class) return "default";
            if (type == int.class || type == Integer.class) return 0;
            if (type == boolean.class || type == Boolean.class) return false;
            if (type == long.class || type == Long.class) return 0L;
            if (type == double.class || type == Double.class) return 0.0;
            
            // Para otros tipos, intentar crear con constructor por defecto
            return type.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            System.out.println("   ⚠️  No se pudo crear dependencia automática para " + type.getSimpleName());
            return null;
        }
    }
    
    // Ejecutar simulación
    public void runSimulation() {
        System.out.println("🌱 SIMULADOR DE INYECCIÓN DE DEPENDENCIAS EN SPRING BOOT");
        System.out.println("=" .repeat(70));
        
        // Registrar beans
        System.out.println("\n📝 REGISTRANDO BEANS...");
        registerBean("userRepository", UserRepository.class);
        registerBean("emailService", EmailService.class);
        registerBean("userService", UserService.class);
        registerBean("userController", UserController.class);
        
        // Crear beans en orden de dependencias
        System.out.println("\n🔧 CREANDO BEANS...");
        createBean("userRepository");
        createBean("emailService");
        createBean("userService");
        createBean("userController");
        
        // Probar funcionalidad
        System.out.println("\n🧪 PROBANDO FUNCIONALIDAD...");
        testFunctionality();
        
        // Mostrar resumen
        showFinalSummary();
    }
    
    // Probar funcionalidad de los beans
    private void testFunctionality() {
        try {
            UserService userService = (UserService) beans.get("userService");
            UserController userController = (UserController) beans.get("userController");
            
            if (userService != null && userController != null) {
                System.out.println("✅ Servicios creados correctamente");
                
                // Simular operaciones
                User testUser = new User("test@example.com", "Usuario Test");
                System.out.println("📝 Usuario de prueba creado: " + testUser.getName());
                
                // Verificar que las dependencias están inyectadas
                System.out.println("🔍 Verificando inyección de dependencias...");
                verifyDependencies(userService);
                
            } else {
                System.out.println("❌ Error: No se pudieron crear los servicios");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error probando funcionalidad: " + e.getMessage());
        }
    }
    
    // Verificar dependencias inyectadas
    private void verifyDependencies(UserService userService) {
        try {
            // Usar reflexión para verificar campos privados
            Field[] fields = UserService.class.getDeclaredFields();
            
            for (Field field : fields) {
                field.setAccessible(true);
                Object value = field.get(userService);
                
                if (value != null) {
                    System.out.println("   ✅ Campo " + field.getName() + " inyectado: " + 
                                     value.getClass().getSimpleName());
                } else {
                    System.out.println("   ❌ Campo " + field.getName() + " no inyectado");
                }
            }
            
        } catch (Exception e) {
            System.out.println("   ⚠️  Error verificando dependencias: " + e.getMessage());
        }
    }
    
    // Mostrar resumen final
    private void showFinalSummary() {
        System.out.println("\n🎉 RESUMEN FINAL DE LA SIMULACIÓN");
        System.out.println("=" .repeat(50));
        
        System.out.println("📊 Estadísticas:");
        System.out.println("   Beans registrados: " + beanDefinitions.size());
        System.out.println("   Beans creados: " + beans.size());
        System.out.println("   Inyecciones exitosas: " + injectionCount);
        System.out.println("   Errores: " + errorCount);
        
        System.out.println("\n💡 LECCIONES APRENDIDAS:");
        System.out.println("   ✅ Constructor Injection es la forma más segura");
        System.out.println("   ✅ Spring crea beans en orden de dependencias");
        System.out.println("   ✅ Las dependencias se resuelven automáticamente");
        System.out.println("   ✅ Los beans se almacenan en el contexto de Spring");
        
        System.out.println("\n🚨 MEJORES PRÁCTICAS:");
        System.out.println("   🔴 Usa Constructor Injection para dependencias obligatorias");
        System.out.println("   🔴 Evita Field Injection (menos testeable)");
        System.out.println("   🔴 Mantén constructores simples y claros");
        System.out.println("   🔴 Usa @Qualifier para beans del mismo tipo");
        
        System.out.println("\n🌟 BENEFICIOS DE LA INYECCIÓN DE DEPENDENCIAS:");
        System.out.println("   📱 Código más testeable");
        System.out.println("   🔄 Desacoplamiento entre clases");
        System.out.println("   🎯 Configuración centralizada");
        System.out.println("   🚀 Inicialización automática de beans");
    }
    
    // Clases simuladas para las pruebas
    static class UserRepository {
        public User save(User user) { return user; }
        public List<User> findAll() { return new ArrayList<>(); }
        public Optional<User> findByEmail(String email) { return Optional.empty(); }
        public List<User> findByActiveTrue() { return new ArrayList<>(); }
    }
    
    static class EmailService {
        public EmailService(Object mailSender) {}
        public void sendWelcomeEmail(String email) {}
    }
    
    static class UserService {
        private final UserRepository userRepository;
        private final EmailService emailService;
        
        public UserService(UserRepository userRepository, EmailService emailService) {
            this.userRepository = userRepository;
            this.emailService = emailService;
        }
        
        public User createUser(User user) { return userRepository.save(user); }
        public List<User> getAllUsers() { return userRepository.findAll(); }
    }
    
    static class UserController {
        private final UserService userService;
        
        public UserController(UserService userService) {
            this.userService = userService;
        }
    }
    
    static class User {
        private String email;
        private String name;
        
        public User() {}
        public User(String email, String name) {
            this.email = email;
            this.name = name;
        }
        
        public String getName() { return name; }
    }
}
```

---

### 🔴 **PREGUNTA 2: ¿Qué son los perfiles (profiles) en Spring Boot?**

**Respuesta Completa:**

Los **perfiles** en Spring Boot permiten configurar diferentes configuraciones para diferentes entornos (desarrollo, pruebas, producción).

**Tipos de Perfiles:**

1. **Perfiles por defecto** - `default`
2. **Perfiles específicos** - `dev`, `test`, `prod`
3. **Perfiles activos** - Configurados en `application.properties`

```java
// Ejemplo de Perfiles en Spring Boot
@Configuration
@Profile("dev")
public class DevConfig {
    
    @Bean
    public DataSource dataSource() {
        // Configuración para desarrollo
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:testdb");
        config.setUsername("sa");
        config.setPassword("");
        return new HikariDataSource(config);
    }
    
    @Bean
    public EmailService emailService() {
        // Servicio de email simulado para desarrollo
        return new MockEmailService();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {
    
    @Bean
    public DataSource dataSource() {
        // Configuración para producción
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(System.getenv("DB_URL"));
        config.setUsername(System.getenv("DB_USERNAME"));
        config.setPassword(System.getenv("DB_PASSWORD"));
        config.setMaximumPoolSize(20);
        return new HikariDataSource(config);
    }
    
    @Bean
    public EmailService emailService() {
        // Servicio de email real para producción
        return new RealEmailService();
    }
}

// Configuración común
@Configuration
public class CommonConfig {
    
    @Bean
    @Profile("!prod") // No en producción
    public LoggingService loggingService() {
        return new ConsoleLoggingService();
    }
    
    @Bean
    @Profile("prod")
    public LoggingService loggingService() {
        return new FileLoggingService();
    }
}

// Servicios específicos por perfil
@Service
@Profile("dev")
public class MockEmailService implements EmailService {
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        System.out.println("📧 EMAIL SIMULADO:");
        System.out.println("   Para: " + to);
        System.out.println("   Asunto: " + subject);
        System.out.println("   Cuerpo: " + body);
        System.out.println("   (Este es un email simulado para desarrollo)");
    }
}

@Service
@Profile("prod")
public class RealEmailService implements EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        System.out.println("📧 Email real enviado a: " + to);
    }
}

// Configuración de propiedades por perfil
// application-dev.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
logging.level.com.example=DEBUG

// application-prod.properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.hikari.maximum-pool-size=20
logging.level.com.example=WARN
logging.file.name=logs/application.log

// application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

**Simulador de Perfiles:**

```java
// profiles-simulator.java
import java.util.*;
import java.io.*;

public class ProfilesSimulator {
    private Map<String, ProfileConfig> profiles = new HashMap<>();
    private String activeProfile = "default";
    private int configLoadCount = 0;
    private int beanCreationCount = 0;
    
    public static void main(String[] args) {
        ProfilesSimulator simulator = new ProfilesSimulator();
        simulator.runSimulation();
    }
    
    // Clase para representar configuración de perfil
    static class ProfileConfig {
        String name;
        Map<String, String> properties = new HashMap<>();
        List<String> beans = new ArrayList<>();
        boolean isActive = false;
        
        public ProfileConfig(String name) {
            this.name = name;
        }
        
        public void addProperty(String key, String value) {
            properties.put(key, value);
        }
        
        public void addBean(String beanName) {
            beans.add(beanName);
        }
    }
    
    // Configurar perfiles
    private void setupProfiles() {
        System.out.println("📝 CONFIGURANDO PERFILES...");
        
        // Perfil de desarrollo
        ProfileConfig devProfile = new ProfileConfig("dev");
        devProfile.addProperty("spring.datasource.url", "jdbc:h2:mem:testdb");
        devProfile.addProperty("spring.datasource.username", "sa");
        devProfile.addProperty("spring.datasource.password", "");
        devProfile.addProperty("logging.level.com.example", "DEBUG");
        devProfile.addProperty("spring.h2.console.enabled", "true");
        devProfile.addBean("MockEmailService");
        devProfile.addBean("ConsoleLoggingService");
        devProfile.addBean("DevDataSource");
        profiles.put("dev", devProfile);
        
        // Perfil de producción
        ProfileConfig prodProfile = new ProfileConfig("prod");
        prodProfile.addProperty("spring.datasource.url", "${DB_URL}");
        prodProfile.addProperty("spring.datasource.username", "${DB_USERNAME}");
        prodProfile.addProperty("spring.datasource.password", "${DB_PASSWORD}");
        prodProfile.addProperty("logging.level.com.example", "WARN");
        prodProfile.addProperty("logging.file.name", "logs/application.log");
        prodProfile.addBean("RealEmailService");
        prodProfile.addBean("FileLoggingService");
        prodProfile.addBean("ProdDataSource");
        profiles.put("prod", prodProfile);
        
        // Perfil de pruebas
        ProfileConfig testProfile = new ProfileConfig("test");
        testProfile.addProperty("spring.datasource.url", "jdbc:h2:mem:testdb");
        testProfile.addProperty("spring.jpa.hibernate.ddl-auto", "create-drop");
        testProfile.addProperty("spring.jpa.show-sql", "true");
        testProfile.addProperty("logging.level.org.hibernate.SQL", "DEBUG");
        testProfile.addBean("MockEmailService");
        testProfile.addBean("ConsoleLoggingService");
        testProfile.addBean("TestDataSource");
        profiles.put("test", testProfile);
        
        // Perfil por defecto
        ProfileConfig defaultProfile = new ProfileConfig("default");
        defaultProfile.addProperty("spring.profiles.active", "dev");
        defaultProfile.addBean("DefaultConfig");
        profiles.put("default", defaultProfile);
        
        System.out.println("   ✅ Perfiles configurados: " + profiles.keySet());
    }
    
    // Activar perfil
    public void activateProfile(String profileName) {
        if (profiles.containsKey(profileName)) {
            // Desactivar perfil anterior
            if (profiles.containsKey(activeProfile)) {
                profiles.get(activeProfile).isActive = false;
            }
            
            // Activar nuevo perfil
            activeProfile = profileName;
            profiles.get(profileName).isActive = true;
            
            System.out.println("\n🔄 PERFIL ACTIVADO: " + profileName);
            System.out.println("-".repeat(40));
            
            // Cargar configuración del perfil
            loadProfileConfiguration(profileName);
            
        } else {
            System.out.println("❌ Perfil no encontrado: " + profileName);
        }
    }
    
    // Cargar configuración del perfil
    private void loadProfileConfiguration(String profileName) {
        ProfileConfig profile = profiles.get(profileName);
        configLoadCount++;
        
        System.out.println("📋 Cargando configuración del perfil '" + profileName + "':");
        
        // Mostrar propiedades
        System.out.println("   🔧 Propiedades:");
        for (Map.Entry<String, String> prop : profile.properties.entrySet()) {
            String value = prop.getValue();
            if (value.startsWith("${") && value.endsWith("}")) {
                value = "[VARIABLE DE ENTORNO]";
            }
            System.out.println("      " + prop.getKey() + " = " + value);
        }
        
        // Mostrar beans
        System.out.println("   🫘 Beans:");
        for (String bean : profile.beans) {
            System.out.println("      - " + bean);
        }
        
        // Crear beans del perfil
        createProfileBeans(profile);
    }
    
    // Crear beans del perfil
    private void createProfileBeans(ProfileConfig profile) {
        System.out.println("\n🔨 Creando beans del perfil...");
        
        for (String beanName : profile.beans) {
            try {
                Object bean = createBean(beanName, profile.name);
                if (bean != null) {
                    System.out.println("   ✅ Bean creado: " + beanName + " (" + bean.getClass().getSimpleName() + ")");
                    beanCreationCount++;
                } else {
                    System.out.println("   ❌ Error creando bean: " + beanName);
                }
            } catch (Exception e) {
                System.out.println("   ❌ Error creando bean " + beanName + ": " + e.getMessage());
            }
        }
    }
    
    // Crear bean específico
    private Object createBean(String beanName, String profileName) {
        switch (beanName) {
            case "MockEmailService":
                return new MockEmailService();
            case "RealEmailService":
                return new RealEmailService();
            case "ConsoleLoggingService":
                return new ConsoleLoggingService();
            case "FileLoggingService":
                return new FileLoggingService();
            case "DevDataSource":
                return new DevDataSource();
            case "ProdDataSource":
                return new ProdDataSource();
            case "TestDataSource":
                return new TestDataSource();
            case "DefaultConfig":
                return new DefaultConfig();
            default:
                return null;
        }
    }
    
    // Ejecutar simulación
    public void runSimulation() {
        System.out.println("🌱 SIMULADOR DE PERFILES EN SPRING BOOT");
        System.out.println("=" .repeat(60));
        
        setupProfiles();
        
        // Simular activación de diferentes perfiles
        System.out.println("\n🚀 SIMULANDO ACTIVACIÓN DE PERFILES...");
        
        // Activar perfil de desarrollo
        activateProfile("dev");
        
        // Simular cambio a producción
        System.out.println("\n" + "=".repeat(50));
        System.out.println("🔄 CAMBIANDO A PERFIL DE PRODUCCIÓN");
        activateProfile("prod");
        
        // Simular cambio a pruebas
        System.out.println("\n" + "=".repeat(50));
        System.out.println("🔄 CAMBIANDO A PERFIL DE PRUEBAS");
        activateProfile("test");
        
        // Mostrar resumen
        showFinalSummary();
    }
    
    // Mostrar resumen final
    private void showFinalSummary() {
        System.out.println("\n🎉 RESUMEN FINAL DE LA SIMULACIÓN");
        System.out.println("=" .repeat(50));
        
        System.out.println("📊 Estadísticas:");
        System.out.println("   Perfiles configurados: " + profiles.size());
        System.out.println("   Configuraciones cargadas: " + configLoadCount);
        System.out.println("   Beans creados: " + beanCreationCount);
        System.out.println("   Perfil activo final: " + activeProfile);
        
        System.out.println("\n💡 LECCIONES APRENDIDAS:");
        System.out.println("   ✅ Los perfiles permiten configuraciones específicas por entorno");
        System.out.println("   ✅ Se pueden activar múltiples perfiles");
        System.out.println("   ✅ Los beans se crean según el perfil activo");
        System.out.println("   ✅ Las propiedades se resuelven por perfil");
        
        System.out.println("\n🚨 CASOS DE USO:");
        System.out.println("   🔴 dev: Desarrollo local con base de datos en memoria");
        System.out.println("   🔴 test: Pruebas con configuración específica");
        System.out.println("   🔴 prod: Producción con configuración real");
        System.out.println("   🔴 default: Configuración por defecto");
        
        System.out.println("\n🌟 BENEFICIOS:");
        System.out.println("   📱 Configuración específica por entorno");
        System.out.println("   🔄 Fácil cambio entre configuraciones");
        System.out.println("   🎯 Beans específicos por perfil");
        System.out.println("   🚀 Despliegue simplificado");
    }
    
    // Clases simuladas para las pruebas
    static class MockEmailService {
        public void sendEmail(String to, String subject, String body) {
            System.out.println("   📧 Email simulado enviado a: " + to);
        }
    }
    
    static class RealEmailService {
        public void sendEmail(String to, String subject, String body) {
            System.out.println("   📧 Email real enviado a: " + to);
        }
    }
    
    static class ConsoleLoggingService {
        public void log(String message) {
            System.out.println("   📝 Log en consola: " + message);
        }
    }
    
    static class FileLoggingService {
        public void log(String message) {
            System.out.println("   📝 Log en archivo: " + message);
        }
    }
    
    static class DevDataSource {
        public String getConnection() {
            return "Conexión H2 en memoria (Desarrollo)";
        }
    }
    
    static class ProdDataSource {
        public String getConnection() {
            return "Conexión PostgreSQL (Producción)";
        }
    }
    
    static class TestDataSource {
        public String getConnection() {
            return "Conexión H2 en memoria (Pruebas)";
        }
    }
    
    static class DefaultConfig {
        public String getConfig() {
            return "Configuración por defecto";
        }
    }
}
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos de Spring**
   - IoC Container
   - Bean Lifecycle
   - AOP (Aspect-Oriented Programming)

2. **Spring Boot Features**
   - Auto-configuration
   - Starter POMs
   - Actuator
   - Externalized Configuration

3. **Spring Data**
   - JPA/Hibernate
   - Spring Data JPA
   - Query Methods
   - Transactions

4. **Spring Security**
   - Authentication
   - Authorization
   - JWT
   - OAuth2

5. **Spring Cloud**
   - Service Discovery
   - Configuration Server
   - Circuit Breaker
   - API Gateway

### 🚀 **Proyectos Prácticos Recomendados:**

1. **API REST con Spring Boot**
2. **Microservicios con Spring Cloud**
3. **Aplicación con Spring Security**
4. **Sistema con Spring Data JPA**
5. **Dashboard con Spring Actuator**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de Spring Boot! 🌱**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como desarrollador Spring Boot! 🎯**
