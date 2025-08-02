# 🌱 Spring Core - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Spring Core](#fundamentos-de-spring-core)
2. [Inyección de Dependencias (IoC)](#inyección-de-dependencias-ioc)
3. [Programación Orientada a Aspectos (AOP)](#programación-orientada-a-aspectos-aop)
4. [Configuración](#configuración)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Spring Core

### Configuración Básica

```java
// ApplicationConfig.java - Configuración básica de Spring Core
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration // Marca esta clase como configuración de Spring
@ComponentScan(basePackages = "com.example") // Escanea componentes en el paquete especificado
@PropertySource("classpath:application.properties") // Carga archivo de propiedades
public class ApplicationConfig {
    
    // Bean para configuración de base de datos
    @Bean
    public DataSource dataSource() {
        // Crear y configurar DataSource
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/testdb");
        config.setUsername("root");
        config.setPassword("password");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        
        return new HikariDataSource(config);
    }
    
    // Bean para JdbcTemplate
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        // Crear JdbcTemplate con el DataSource configurado
        return new JdbcTemplate(dataSource);
    }
    
    // Bean para TransactionManager
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        // Crear DataSourceTransactionManager para manejar transacciones
        return new DataSourceTransactionManager(dataSource);
    }
    
    // Bean para configuración de logging
    @Bean
    public LoggingAspect loggingAspect() {
        // Crear aspecto para logging automático
        return new LoggingAspect();
    }
    
    // Bean para configuración de cache
    @Bean
    public CacheManager cacheManager() {
        // Crear SimpleCacheManager para cache en memoria
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("users"),
            new ConcurrentMapCache("products")
        ));
        return cacheManager;
    }
}
```

### Componente Básico

```java
// UserService.java - Servicio básico con Spring Core
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Marca como componente de servicio
@Transactional // Todas las operaciones son transaccionales
public class UserService {
    
    private final UserRepository userRepository; // Repositorio inyectado
    private final EmailService emailService; // Servicio de email inyectado
    private final CacheManager cacheManager; // Cache manager inyectado
    
    // Constructor con inyección de dependencias
    @Autowired
    public UserService(@Qualifier("userRepositoryImpl") UserRepository userRepository,
                      EmailService emailService,
                      CacheManager cacheManager) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.cacheManager = cacheManager;
    }
    
    // Método para crear usuario
    @Transactional
    public User createUser(User user) {
        // Validar datos del usuario
        validateUser(user);
        
        // Guardar usuario en base de datos
        User savedUser = userRepository.save(user);
        
        // Enviar email de bienvenida
        emailService.sendWelcomeEmail(savedUser.getEmail());
        
        // Limpiar cache de usuarios
        clearUserCache();
        
        return savedUser;
    }
    
    // Método para obtener usuario por ID
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        // Intentar obtener del cache primero
        Cache cache = cacheManager.getCache("users");
        if (cache != null) {
            Cache.ValueWrapper cached = cache.get("user_" + id);
            if (cached != null) {
                return Optional.of((User) cached.get());
            }
        }
        
        // Si no está en cache, obtener de base de datos
        Optional<User> user = userRepository.findById(id);
        
        // Guardar en cache si existe
        if (user.isPresent() && cache != null) {
            cache.put("user_" + id, user.get());
        }
        
        return user;
    }
    
    // Método para obtener todos los usuarios
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Método para actualizar usuario
    @Transactional
    public User updateUser(Long id, User userDetails) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Actualizar campos
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            
            // Guardar cambios
            User updatedUser = userRepository.save(user);
            
            // Limpiar cache
            clearUserCache();
            
            return updatedUser;
        } else {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
    }
    
    // Método para eliminar usuario
    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            clearUserCache();
            return true;
        }
        return false;
    }
    
    // Método privado para validar usuario
    private void validateUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username es requerido");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email es requerido");
        }
        
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username ya existe: " + user.getUsername());
        }
    }
    
    // Método privado para limpiar cache
    private void clearUserCache() {
        Cache cache = cacheManager.getCache("users");
        if (cache != null) {
            cache.clear();
        }
    }
}
```

---

## 🔄 Inyección de Dependencias (IoC)

### Configuración de Beans

```java
// BeanConfig.java - Configuración avanzada de beans
package com.example.config;

import com.example.service.EmailService;
import com.example.service.SMTPEmailService;
import com.example.service.SendGridEmailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Configuration
public class BeanConfig {
    
    // Bean para servicio de email SMTP (perfil de desarrollo)
    @Bean
    @Profile("dev")
    @Qualifier("smtpEmailService")
    public EmailService smtpEmailService() {
        // Crear servicio de email SMTP para desarrollo
        SMTPEmailService emailService = new SMTPEmailService();
        emailService.setHost("localhost");
        emailService.setPort(1025);
        emailService.setUsername("dev@example.com");
        emailService.setPassword("devpassword");
        return emailService;
    }
    
    // Bean para servicio de email SendGrid (perfil de producción)
    @Bean
    @Profile("prod")
    @Primary // Bean principal para inyección automática
    @Qualifier("sendGridEmailService")
    public EmailService sendGridEmailService() {
        // Crear servicio de email SendGrid para producción
        SendGridEmailService emailService = new SendGridEmailService();
        emailService.setApiKey(System.getenv("SENDGRID_API_KEY"));
        emailService.setFromEmail("noreply@example.com");
        return emailService;
    }
    
    // Bean para configuración de propiedades
    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        // Configurar placeholder para propiedades
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        configurer.setLocation(new ClassPathResource("application.properties"));
        return configurer;
    }
    
    // Bean para configuración de eventos
    @Bean
    public ApplicationEventPublisher applicationEventPublisher() {
        // Configurar publisher de eventos de aplicación
        return new SimpleApplicationEventPublisher();
    }
}

// EmailService.java - Interfaz para servicios de email
public interface EmailService {
    void sendEmail(String to, String subject, String body);
    void sendWelcomeEmail(String email);
    void sendPasswordResetEmail(String email, String token);
}

// SMTPEmailService.java - Implementación SMTP
@Service
@Profile("dev")
public class SMTPEmailService implements EmailService {
    
    private String host;
    private int port;
    private String username;
    private String password;
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        // Implementación para envío de email via SMTP
        System.out.println("Enviando email via SMTP a: " + to);
        System.out.println("Asunto: " + subject);
        System.out.println("Cuerpo: " + body);
    }
    
    @Override
    public void sendWelcomeEmail(String email) {
        String subject = "Bienvenido a nuestra aplicación";
        String body = "Gracias por registrarte en nuestra aplicación.";
        sendEmail(email, subject, body);
    }
    
    @Override
    public void sendPasswordResetEmail(String email, String token) {
        String subject = "Restablecimiento de contraseña";
        String body = "Tu token para restablecer contraseña es: " + token;
        sendEmail(email, subject, body);
    }
    
    // Getters y Setters
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// SendGridEmailService.java - Implementación SendGrid
@Service
@Profile("prod")
public class SendGridEmailService implements EmailService {
    
    private String apiKey;
    private String fromEmail;
    
    @Override
    public void sendEmail(String to, String subject, String body) {
        // Implementación para envío de email via SendGrid
        System.out.println("Enviando email via SendGrid a: " + to);
        System.out.println("Asunto: " + subject);
        System.out.println("Cuerpo: " + body);
    }
    
    @Override
    public void sendWelcomeEmail(String email) {
        String subject = "Bienvenido a nuestra aplicación";
        String body = "Gracias por registrarte en nuestra aplicación.";
        sendEmail(email, subject, body);
    }
    
    @Override
    public void sendPasswordResetEmail(String email, String token) {
        String subject = "Restablecimiento de contraseña";
        String body = "Tu token para restablecer contraseña es: " + token;
        sendEmail(email, subject, body);
    }
    
    // Getters y Setters
    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    
    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }
}
```

---

## 🎯 Programación Orientada a Aspectos (AOP)

### Aspectos Personalizados

```java
// LoggingAspect.java - Aspecto para logging automático
package com.example.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect // Marca como aspecto
@Component // Componente de Spring
public class LoggingAspect {
    
    // Pointcut para todos los métodos de servicio
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}
    
    // Pointcut para métodos que retornan void
    @Pointcut("execution(* *(..))")
    public void voidMethods() {}
    
    // Pointcut combinado
    @Pointcut("serviceMethods() && voidMethods()")
    public void serviceVoidMethods() {}
    
    // Advice antes de la ejecución del método
    @Before("serviceMethods()")
    public void logBefore(JoinPoint joinPoint) {
        // Log antes de ejecutar método
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();
        
        System.out.println("🟢 [BEFORE] Ejecutando método: " + className + "." + methodName);
        System.out.println("📝 [BEFORE] Argumentos: " + Arrays.toString(args));
    }
    
    // Advice después de la ejecución exitosa del método
    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        // Log después de ejecución exitosa
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        System.out.println("✅ [AFTER RETURNING] Método completado: " + className + "." + methodName);
        System.out.println("📤 [AFTER RETURNING] Resultado: " + result);
    }
    
    // Advice después de la ejecución (siempre se ejecuta)
    @After("serviceMethods()")
    public void logAfter(JoinPoint joinPoint) {
        // Log después de ejecución (exitosa o con excepción)
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        System.out.println("🔚 [AFTER] Método finalizado: " + className + "." + methodName);
    }
    
    // Advice para manejo de excepciones
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "error")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable error) {
        // Log cuando ocurre una excepción
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        System.out.println("❌ [AFTER THROWING] Excepción en método: " + className + "." + methodName);
        System.out.println("💥 [AFTER THROWING] Error: " + error.getMessage());
        error.printStackTrace();
    }
    
    // Advice alrededor del método (permite control total)
    @Around("serviceMethods()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        // Log antes de ejecutar
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        long startTime = System.currentTimeMillis();
        System.out.println("⏱️ [AROUND] Iniciando método: " + className + "." + methodName);
        
        try {
            // Ejecutar el método original
            Object result = joinPoint.proceed();
            
            // Log después de ejecución exitosa
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            System.out.println("✅ [AROUND] Método completado: " + className + "." + methodName);
            System.out.println("⏱️ [AROUND] Duración: " + duration + "ms");
            System.out.println("📤 [AROUND] Resultado: " + result);
            
            return result;
        } catch (Throwable error) {
            // Log en caso de excepción
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            System.out.println("❌ [AROUND] Excepción en método: " + className + "." + methodName);
            System.out.println("⏱️ [AROUND] Duración antes del error: " + duration + "ms");
            System.out.println("💥 [AROUND] Error: " + error.getMessage());
            
            throw error;
        }
    }
}

// SecurityAspect.java - Aspecto para seguridad
@Aspect
@Component
public class SecurityAspect {
    
    // Pointcut para métodos que requieren autenticación
    @Pointcut("@annotation(com.example.annotation.RequiresAuth)")
    public void requiresAuthMethods() {}
    
    // Advice para verificar autenticación
    @Before("requiresAuthMethods()")
    public void checkAuthentication(JoinPoint joinPoint) {
        // Verificar si el usuario está autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Acceso denegado: Usuario no autenticado");
        }
        
        System.out.println("🔐 [SECURITY] Usuario autenticado: " + authentication.getName());
    }
    
    // Pointcut para métodos que requieren roles específicos
    @Pointcut("@annotation(com.example.annotation.RequiresRole)")
    public void requiresRoleMethods() {}
    
    // Advice para verificar roles
    @Before("requiresRoleMethods() && @annotation(requiresRole)")
    public void checkRole(JoinPoint joinPoint, RequiresRole requiresRole) {
        // Verificar si el usuario tiene el rol requerido
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Acceso denegado: Usuario no autenticado");
        }
        
        String requiredRole = requiresRole.value();
        boolean hasRole = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + requiredRole));
        
        if (!hasRole) {
            throw new SecurityException("Acceso denegado: Rol requerido: " + requiredRole);
        }
        
        System.out.println("🔐 [SECURITY] Usuario tiene rol requerido: " + requiredRole);
    }
}

// RequiresAuth.java - Anotación para autenticación
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresAuth {
}

// RequiresRole.java - Anotación para roles
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresRole {
    String value();
}
```

---

## 🧪 Testing

### Testing de Spring Core

```java
// UserServiceTest.java - Pruebas del servicio con Spring
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private EmailService emailService;
    
    @Mock
    private CacheManager cacheManager;
    
    @Mock
    private Cache cache;
    
    @InjectMocks
    private UserService userService;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        
        when(cacheManager.getCache("users")).thenReturn(cache);
    }
    
    @Test
    void createUser_WithValidData_ShouldCreateUser() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        User result = userService.createUser(testUser);
        
        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).save(testUser);
        verify(emailService).sendWelcomeEmail("test@example.com");
        verify(cache).clear();
    }
    
    @Test
    void createUser_WithExistingUsername_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.createUser(testUser)
        );
        
        assertEquals("Username ya existe: testuser", exception.getMessage());
        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendWelcomeEmail(any());
    }
    
    @Test
    void getUserById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        // Act
        Optional<User> result = userService.getUserById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(cache).put("user_1", testUser);
    }
    
    @Test
    void getUserById_WithCachedUser_ShouldReturnFromCache() {
        // Arrange
        when(cache.get("user_1")).thenReturn(new Cache.ValueWrapper() {
            @Override
            public Object get() {
                return testUser;
            }
        });
        
        // Act
        Optional<User> result = userService.getUserById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userRepository, never()).findById(any());
    }
    
    @Test
    void updateUser_WithValidId_ShouldUpdateUser() {
        // Arrange
        User updateDetails = new User();
        updateDetails.setUsername("newusername");
        updateDetails.setEmail("newemail@example.com");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Act
        User result = userService.updateUser(1L, updateDetails);
        
        // Assert
        assertNotNull(result);
        verify(userRepository).save(testUser);
        verify(cache).clear();
    }
    
    @Test
    void updateUser_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> userService.updateUser(999L, testUser)
        );
        
        assertEquals("Usuario no encontrado con ID: 999", exception.getMessage());
        verify(userRepository, never()).save(any());
    }
    
    @Test
    void deleteUser_WithValidId_ShouldReturnTrue() {
        // Arrange
        when(userRepository.existsById(1L)).thenReturn(true);
        
        // Act
        boolean result = userService.deleteUser(1L);
        
        // Assert
        assertTrue(result);
        verify(userRepository).deleteById(1L);
        verify(cache).clear();
    }
    
    @Test
    void deleteUser_WithInvalidId_ShouldReturnFalse() {
        // Arrange
        when(userRepository.existsById(999L)).thenReturn(false);
        
        // Act
        boolean result = userService.deleteUser(999L);
        
        // Assert
        assertFalse(result);
        verify(userRepository, never()).deleteById(any());
        verify(cache, never()).clear();
    }
}

// LoggingAspectTest.java - Pruebas del aspecto de logging
@ExtendWith(MockitoExtension.class)
class LoggingAspectTest {
    
    @Mock
    private UserService userService;
    
    @InjectMocks
    private LoggingAspect loggingAspect;
    
    @Test
    void logBefore_ShouldLogMethodExecution() {
        // Arrange
        JoinPoint joinPoint = mock(JoinPoint.class);
        when(joinPoint.getSignature().getName()).thenReturn("createUser");
        when(joinPoint.getTarget().getClass().getSimpleName()).thenReturn("UserService");
        when(joinPoint.getArgs()).thenReturn(new Object[]{"test"});
        
        // Act
        loggingAspect.logBefore(joinPoint);
        
        // Assert - Verificar que se ejecutó sin excepciones
        assertTrue(true);
    }
    
    @Test
    void logAfterReturning_ShouldLogSuccessfulExecution() {
        // Arrange
        JoinPoint joinPoint = mock(JoinPoint.class);
        when(joinPoint.getSignature().getName()).thenReturn("getUserById");
        when(joinPoint.getTarget().getClass().getSimpleName()).thenReturn("UserService");
        
        User testUser = new User();
        testUser.setUsername("testuser");
        
        // Act
        loggingAspect.logAfterReturning(joinPoint, testUser);
        
        // Assert - Verificar que se ejecutó sin excepciones
        assertTrue(true);
    }
    
    @Test
    void logAfterThrowing_ShouldLogException() {
        // Arrange
        JoinPoint joinPoint = mock(JoinPoint.class);
        when(joinPoint.getSignature().getName()).thenReturn("createUser");
        when(joinPoint.getTarget().getClass().getSimpleName()).thenReturn("UserService");
        
        RuntimeException exception = new RuntimeException("Test exception");
        
        // Act
        loggingAspect.logAfterThrowing(joinPoint, exception);
        
        // Assert - Verificar que se ejecutó sin excepciones
        assertTrue(true);
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Spring Core y cuáles son sus características principales?**
   - Framework de contenedor IoC, AOP, configuración declarativa

2. **¿Qué es la Inyección de Dependencias (IoC)?**
   - Patrón donde las dependencias se inyectan desde el exterior

3. **¿Cuáles son los tipos de inyección de dependencias en Spring?**
   - Constructor injection, setter injection, field injection

### Preguntas Intermedias

4. **¿Cómo funciona el contenedor IoC de Spring?**
   - BeanFactory, ApplicationContext, ciclo de vida de beans

5. **¿Qué es AOP y cómo se implementa en Spring?**
   - Programación orientada a aspectos, pointcuts, advice

6. **¿Cuáles son los scopes de beans en Spring?**
   - Singleton, prototype, request, session, application

### Preguntas Avanzadas

7. **¿Cómo implementarías un aspecto personalizado?**
   - @Aspect, @Pointcut, @Before, @After, @Around

8. **¿Qué son los profiles en Spring?**
   - Configuración específica por ambiente, @Profile

9. **¿Cómo optimizar el rendimiento en Spring Core?**
   - Lazy loading, bean scoping, AOP optimization

---

## 📚 Recursos Adicionales

- [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/)
- [Spring Core Reference](https://docs.spring.io/spring-framework/reference/core.html)
- [Spring AOP Reference](https://docs.spring.io/spring-framework/reference/core/aop.html)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Spring Core! 🚀** 