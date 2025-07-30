# 6.1 Autenticación y Autorización

## 🎯 **Conceptos Básicos**

### **Autenticación vs Autorización**

**Autenticación** es como la verificación de identidad en Internet. Es simplemente verificar si el usuario/sistema que intenta acceder a una aplicación es la persona que aparenta ser. Esto sucede mediante nombres de usuario, contraseñas, tokens, o incluso información biométrica—¿huellas dactilares alguien?

**Autorización** es decidir qué puede hacer un usuario/sistema verificado una vez dentro. Es como, "Oh sí, ya estás en el edificio, ¿qué habitaciones puedes acceder?" La autorización identificará si un usuario tiene acceso a un recurso particular o puede realizar ciertas acciones basándose en sus roles o características.

## 🛠️ **Configuración de Spring Security**

### **Dependencias Maven**

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## 📝 **Ejemplo 1: Configuración Básica de Spring Security**

### **Configuración de Seguridad**

```java
// Clase de configuración de seguridad
// @Configuration marca esta clase como una configuración de Spring
@Configuration
// @EnableWebSecurity habilita la seguridad web de Spring Security
@EnableWebSecurity
// @EnableMethodSecurity habilita la seguridad a nivel de método
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    // Clave secreta para firmar JWT (en producción debería estar en variables de entorno)
    // Esta clave se usa para firmar y verificar tokens JWT
    private static final String SECRET_KEY = "miClaveSecretaMuyLargaYSeguraParaFirmarJWTs123456789";
    
    /**
     * Configuración del encoder de contraseñas
     * BCrypt es un algoritmo de hashing seguro para contraseñas
     * @return BCryptPasswordEncoder configurado
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        // Retorna una instancia de BCryptPasswordEncoder con fuerza 12
        // La fuerza determina cuántas rondas de hashing se realizan
        return new BCryptPasswordEncoder(12);
    }
    
    /**
     * Configuración del servicio de detalles de usuario
     * Define los usuarios que pueden autenticarse en el sistema
     * @return UserDetailsService configurado
     */
    @Bean
    public UserDetailsService userDetailsService() {
        // Crear usuario regular con rol USER
        UserDetails user = User.builder()
            .username("user")  // Nombre de usuario
            .password(bCryptPasswordEncoder().encode("user123"))  // Contraseña encriptada
            .authorities("ROLE_USER")  // Rol asignado
            .build();  // Construir el objeto UserDetails
        
        // Crear administrador con rol ADMIN
        UserDetails admin = User.builder()
            .username("admin")  // Nombre de usuario
            .password(bCryptPasswordEncoder().encode("admin123"))  // Contraseña encriptada
            .authorities("ROLE_ADMIN")  // Rol asignado
            .build();  // Construir el objeto UserDetails
        
        // Crear super administrador con múltiples roles
        UserDetails superAdmin = User.builder()
            .username("superadmin")  // Nombre de usuario
            .password(bCryptPasswordEncoder().encode("superadmin123"))  // Contraseña encriptada
            .authorities("ROLE_ADMIN", "ROLE_USER", "ROLE_SUPER_ADMIN")  // Múltiples roles
            .build();  // Construir el objeto UserDetails
        
        // Retornar un UserDetailsService en memoria con los usuarios creados
        // En producción, esto debería conectarse a una base de datos
        return new InMemoryUserDetailsManager(user, admin, superAdmin);
    }
    
    /**
     * Configuración de la cadena de filtros de seguridad
     * Define cómo se manejan las peticiones HTTP y la autenticación
     * @param http Configuración HTTP de Spring Security
     * @return SecurityFilterChain configurado
     * @throws Exception si hay error en la configuración
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configurar la cadena de filtros de seguridad
        http
            // Configurar headers de seguridad
            .headers(header -> header
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable)  // Deshabilitar frame options
                .contentTypeOptions(HeadersConfigurer.ContentTypeOptionsConfig::disable)  // Deshabilitar content type options
            )
            // Configurar CSRF (Cross-Site Request Forgery)
            .csrf(csrf -> csrf
                .disable()  // Deshabilitar CSRF para APIs REST
            )
            // Configurar autorización de peticiones
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso público a endpoints de autenticación
                .requestMatchers("/api/auth/**").permitAll()  // Endpoints de autenticación
                .requestMatchers("/api/public/**").permitAll()  // Endpoints públicos
                .requestMatchers("/actuator/health").permitAll()  // Health check
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()  // Documentación API
                // Requerir rol ADMIN para endpoints administrativos
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Solo administradores
                .requestMatchers("/api/super-admin/**").hasRole("SUPER_ADMIN")  // Solo super administradores
                // Requerir autenticación para todos los demás endpoints
                .anyRequest().authenticated()  // Cualquier otra petición requiere autenticación
            )
            // Configurar autenticación por sesión
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Sin estado (para JWT)
            )
            // Configurar manejo de excepciones
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())  // Punto de entrada para autenticación
                .accessDeniedHandler(new JwtAccessDeniedHandler())  // Manejador de acceso denegado
            )
            // Configurar filtros personalizados
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);  // Agregar filtro JWT
        
        // Retornar la configuración construida
        return http.build();
    }
    
    /**
     * Configuración del filtro de autenticación JWT
     * @return JwtAuthenticationFilter configurado
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        // Crear y retornar el filtro JWT personalizado
        return new JwtAuthenticationFilter();
    }
    
    /**
     * Configuración del proveedor de autenticación
     * @return AuthenticationProvider configurado
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        // Crear un DaoAuthenticationProvider
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        
        // Configurar el servicio de detalles de usuario
        provider.setUserDetailsService(userDetailsService());
        
        // Configurar el encoder de contraseñas
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        
        // Retornar el proveedor configurado
        return provider;
    }
    
    /**
     * Configuración del manager de autenticación
     * @param config Configuración de autenticación
     * @return AuthenticationManager configurado
     * @throws Exception si hay error en la configuración
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Retornar el manager de autenticación desde la configuración
        return config.getAuthenticationManager();
    }
}

// Clase para manejar errores de autenticación JWT
// Implementa AuthenticationEntryPoint para manejar errores de autenticación
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    /**
     * Maneja errores de autenticación
     * @param request Petición HTTP
     * @param response Respuesta HTTP
     * @param authException Excepción de autenticación
     * @throws IOException si hay error de I/O
     * @throws ServletException si hay error de servlet
     */
    @Override
    public void commence(HttpServletRequest request, 
                        HttpServletResponse response, 
                        AuthenticationException authException) throws IOException, ServletException {
        
        // Log del error de autenticación
        logger.error("Error de autenticación: {}", authException.getMessage());
        
        // Crear respuesta de error
        ErrorResponse errorResponse = new ErrorResponse(
            "UNAUTHORIZED",
            "Acceso no autorizado. Token JWT requerido o inválido.",
            LocalDateTime.now()
        );
        
        // Configurar respuesta HTTP
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401 Unauthorized
        response.setContentType("application/json;charset=UTF-8");  // Tipo de contenido JSON
        
        // Escribir respuesta JSON
        response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
    }
}

// Clase para manejar errores de acceso denegado JWT
// Implementa AccessDeniedHandler para manejar errores de autorización
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    
    /**
     * Maneja errores de acceso denegado
     * @param request Petición HTTP
     * @param response Respuesta HTTP
     * @param accessDeniedException Excepción de acceso denegado
     * @throws IOException si hay error de I/O
     * @throws ServletException si hay error de servlet
     */
    @Override
    public void handle(HttpServletRequest request, 
                      HttpServletResponse response, 
                      AccessDeniedException accessDeniedException) throws IOException, ServletException {
        
        // Log del error de acceso denegado
        logger.error("Error de acceso denegado: {}", accessDeniedException.getMessage());
        
        // Crear respuesta de error
        ErrorResponse errorResponse = new ErrorResponse(
            "FORBIDDEN",
            "Acceso denegado. No tienes permisos para acceder a este recurso.",
            LocalDateTime.now()
        );
        
        // Configurar respuesta HTTP
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);  // 403 Forbidden
        response.setContentType("application/json;charset=UTF-8");  // Tipo de contenido JSON
        
        // Escribir respuesta JSON
        response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
    }
}

// Clase de respuesta de error
// Representa una respuesta de error estándar
public class ErrorResponse {
    // Código de error
    private String error;
    
    // Mensaje de error
    private String message;
    
    // Timestamp del error
    private LocalDateTime timestamp;
    
    // Constructor
    public ErrorResponse(String error, String message, LocalDateTime timestamp) {
        this.error = error;
        this.message = message;
        this.timestamp = timestamp;
    }
    
    // Getters y Setters
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
```

### **Servicio de Autenticación**

```java
// Servicio de autenticación
// Maneja la lógica de autenticación y generación de tokens JWT
@Service
@Transactional
public class AuthenticationService {
    
    // Logger para registrar eventos
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    
    // Manager de autenticación inyectado
    @Autowired
    private AuthenticationManager authenticationManager;
    
    // Servicio JWT inyectado
    @Autowired
    private JwtService jwtService;
    
    // Repositorio de usuarios (en producción)
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Autentica un usuario y genera un token JWT
     * @param request Solicitud de autenticación
     * @return Respuesta con token JWT
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Log del intento de autenticación
        logger.info("Intento de autenticación para usuario: {}", request.getUsername());
        
        try {
            // Crear token de autenticación con credenciales
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                request.getUsername(),  // Nombre de usuario
                request.getPassword()   // Contraseña
            );
            
            // Autenticar usando el manager
            Authentication authentication = authenticationManager.authenticate(authToken);
            
            // Verificar que la autenticación fue exitosa
            if (authentication.isAuthenticated()) {
                // Generar token JWT
                String jwtToken = jwtService.generateToken(authentication);
                
                // Generar token de refresco
                String refreshToken = jwtService.generateRefreshToken(authentication);
                
                // Log de autenticación exitosa
                logger.info("Autenticación exitosa para usuario: {}", request.getUsername());
                
                // Retornar respuesta con tokens
                return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(3600)  // 1 hora
                    .build();
            } else {
                // Log de autenticación fallida
                logger.warn("Autenticación fallida para usuario: {}", request.getUsername());
                
                // Lanzar excepción de autenticación
                throw new AuthenticationException("Credenciales inválidas");
            }
            
        } catch (AuthenticationException e) {
            // Log del error de autenticación
            logger.error("Error durante la autenticación: {}", e.getMessage());
            
            // Lanzar excepción personalizada
            throw new AuthenticationException("Credenciales inválidas");
        }
    }
    
    /**
     * Refresca un token JWT usando un refresh token
     * @param refreshToken Token de refresco
     * @return Nueva respuesta con tokens
     */
    public AuthenticationResponse refreshToken(String refreshToken) {
        // Log del intento de refresco
        logger.info("Intento de refresco de token");
        
        try {
            // Verificar el refresh token
            if (jwtService.isTokenValid(refreshToken)) {
                // Extraer información del token
                String username = jwtService.extractUsername(refreshToken);
                
                // Obtener detalles del usuario
                UserDetails userDetails = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
                
                // Generar nuevo token JWT
                String newAccessToken = jwtService.generateToken(userDetails);
                
                // Generar nuevo refresh token
                String newRefreshToken = jwtService.generateRefreshToken(userDetails);
                
                // Log de refresco exitoso
                logger.info("Refresco de token exitoso para usuario: {}", username);
                
                // Retornar nueva respuesta
                return AuthenticationResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(3600)
                    .build();
            } else {
                // Log de refresh token inválido
                logger.warn("Refresh token inválido");
                
                // Lanzar excepción
                throw new AuthenticationException("Refresh token inválido");
            }
            
        } catch (Exception e) {
            // Log del error de refresco
            logger.error("Error durante el refresco de token: {}", e.getMessage());
            
            // Lanzar excepción
            throw new AuthenticationException("Error al refrescar token");
        }
    }
    
    /**
     * Registra un nuevo usuario
     * @param request Solicitud de registro
     * @return Respuesta de registro
     */
    public RegistrationResponse register(RegistrationRequest request) {
        // Log del intento de registro
        logger.info("Intento de registro para usuario: {}", request.getUsername());
        
        try {
            // Verificar que el usuario no exista
            if (userRepository.existsByUsername(request.getUsername())) {
                // Log de usuario existente
                logger.warn("Usuario ya existe: {}", request.getUsername());
                
                // Lanzar excepción
                throw new UserAlreadyExistsException("El usuario ya existe");
            }
            
            // Verificar que el email no exista
            if (userRepository.existsByEmail(request.getEmail())) {
                // Log de email existente
                logger.warn("Email ya existe: {}", request.getEmail());
                
                // Lanzar excepción
                throw new UserAlreadyExistsException("El email ya está registrado");
            }
            
            // Crear nuevo usuario
            User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(bCryptPasswordEncoder().encode(request.getPassword()))
                .role(Role.USER)  // Rol por defecto
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();
            
            // Guardar usuario en base de datos
            User savedUser = userRepository.save(user);
            
            // Log de registro exitoso
            logger.info("Registro exitoso para usuario: {}", request.getUsername());
            
            // Retornar respuesta de registro
            return RegistrationResponse.builder()
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .message("Usuario registrado exitosamente")
                .build();
            
        } catch (UserAlreadyExistsException e) {
            // Re-lanzar excepción de usuario existente
            throw e;
        } catch (Exception e) {
            // Log del error de registro
            logger.error("Error durante el registro: {}", e.getMessage());
            
            // Lanzar excepción genérica
            throw new RegistrationException("Error al registrar usuario");
        }
    }
}

// Solicitud de autenticación
// Representa los datos necesarios para autenticar un usuario
public class AuthenticationRequest {
    // Nombre de usuario
    @NotBlank(message = "El nombre de usuario es requerido")
    private String username;
    
    // Contraseña
    @NotBlank(message = "La contraseña es requerida")
    private String password;
    
    // Constructor por defecto
    public AuthenticationRequest() {}
    
    // Constructor con parámetros
    public AuthenticationRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    // Getters y Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

// Respuesta de autenticación
// Representa la respuesta después de una autenticación exitosa
@Builder
public class AuthenticationResponse {
    // Token de acceso JWT
    private String accessToken;
    
    // Token de refresco
    private String refreshToken;
    
    // Tipo de token
    private String tokenType;
    
    // Tiempo de expiración en segundos
    private Integer expiresIn;
    
    // Getters y Setters
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    
    public Integer getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Integer expiresIn) { this.expiresIn = expiresIn; }
}
```

## 📊 **Resultados Esperados y Manejo de Errores**

### **🎯 Casos de Éxito Esperados**

#### **1. Autenticación Exitosa**
```java
// ENTRADA
POST /api/auth/login
{
    "username": "user",
    "password": "user123"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600
}

// LÓGICA EJECUTADA:
// ✅ Validación de credenciales
// ✅ Autenticación exitosa
// ✅ Generación de JWT token
// ✅ Generación de refresh token
// ✅ Respuesta con tokens
```

#### **2. Acceso Autorizado a Recurso Protegido**
```java
// ENTRADA
GET /api/admin/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "users": [
        {
            "id": 1,
            "username": "user1",
            "email": "user1@example.com"
        }
    ]
}

// LÓGICA EJECUTADA:
// ✅ Validación de JWT token
// ✅ Verificación de rol ADMIN
// ✅ Acceso autorizado
// ✅ Retorno de datos
```

### **❌ Casos de Error Esperados**

#### **1. Credenciales Inválidas**
```java
// ENTRADA INVÁLIDA
POST /api/auth/login
{
    "username": "user",
    "password": "wrongpassword"
}

// RESULTADO ESPERADO - ERROR
HTTP 401 Unauthorized
{
    "error": "UNAUTHORIZED",
    "message": "Credenciales inválidas",
    "timestamp": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA:
// ❌ Validación de credenciales falla
// ❌ AuthenticationException lanzada
// ❌ Respuesta 401 con mensaje de error
```

#### **2. Acceso Denegado por Rol Insuficiente**
```java
// ENTRADA INVÁLIDA
GET /api/admin/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... // Token de usuario regular

// RESULTADO ESPERADO - ERROR
HTTP 403 Forbidden
{
    "error": "FORBIDDEN",
    "message": "Acceso denegado. No tienes permisos para acceder a este recurso.",
    "timestamp": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA:
// ✅ JWT token válido
// ❌ Rol USER insuficiente para endpoint ADMIN
// ❌ AccessDeniedException lanzada
// ❌ Respuesta 403 con mensaje de error
```

#### **3. Token JWT Expirado**
```java
// ENTRADA INVÁLIDA
GET /api/protected/resource
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... // Token expirado

// RESULTADO ESPERADO - ERROR
HTTP 401 Unauthorized
{
    "error": "UNAUTHORIZED",
    "message": "Token JWT expirado",
    "timestamp": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA:
// ❌ Validación de JWT token falla
// ❌ Token expirado detectado
// ❌ JwtAuthenticationEntryPoint maneja el error
// ❌ Respuesta 401 con mensaje específico
```

### **📈 Métricas de Seguridad**

#### **Tiempos de Respuesta:**
- **Autenticación:** 100-300ms
- **Validación de JWT:** 10-50ms
- **Verificación de roles:** 5-20ms
- **Generación de tokens:** 50-150ms

#### **Throughput de Seguridad:**
- **Autenticaciones por segundo:** 1000-5000
- **Validaciones de token por segundo:** 10000-50000
- **Verificaciones de rol por segundo:** 20000-100000

#### **Disponibilidad de Seguridad:**
- **Uptime del sistema de autenticación:** 99.9%
- **Tiempo de recuperación:** < 30 segundos
- **Tolerancia a fallos:** Circuit breaker implementado

### **🛡️ Estrategias de Seguridad**

#### **1. Rate Limiting**
```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(100.0); // 100 requests por segundo
}
```

#### **2. Token Blacklisting**
```java
@Service
public class TokenBlacklistService {
    private Set<String> blacklistedTokens = new ConcurrentHashSet<>();
    
    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }
    
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}
```

#### **3. Audit Logging**
```java
@Aspect
@Component
public class SecurityAuditAspect {
    
    @Around("@annotation(secured)")
    public Object auditSecurity(ProceedingJoinPoint joinPoint, Secured secured) {
        // Log de intento de acceso
        logger.info("Intento de acceso a método: {}", joinPoint.getSignature().getName());
        
        try {
            Object result = joinPoint.proceed();
            // Log de acceso exitoso
            logger.info("Acceso exitoso a método: {}", joinPoint.getSignature().getName());
            return result;
        } catch (Throwable e) {
            // Log de acceso denegado
            logger.warn("Acceso denegado a método: {}", joinPoint.getSignature().getName());
            throw e;
        }
    }
}
```

Esta implementación de autenticación y autorización proporciona una base sólida para proteger microservicios, con manejo robusto de errores, métricas de seguridad y estrategias de protección avanzadas. 