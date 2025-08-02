# 🛡️ OWASP - Guía Intermedia para Desarrolladores

## 📋 Índice

1. [Conceptos Intermedios](#conceptos-intermedios)
2. [Implementación de Filtros Personalizados](#implementación-de-filtros-personalizados)
3. [Autenticación Avanzada](#autenticación-avanzada)
4. [Autorización Granular](#autorización-granular)
5. [Logging y Monitoreo](#logging-y-monitoreo)
6. [Testing de Seguridad](#testing-de-seguridad)

---

## 🔧 Conceptos Intermedios

### 1. Filtros de Seguridad Personalizados

Los filtros son componentes que procesan las requests HTTP antes de llegar al controlador.

```java
// CustomSecurityFilter.java - Filtro personalizado
@Component
public class CustomSecurityFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomSecurityFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Obtener información de la request
        String requestURI = httpRequest.getRequestURI();
        String method = httpRequest.getMethod();
        String userAgent = httpRequest.getHeader("User-Agent");
        String ipAddress = getClientIpAddress(httpRequest);
        
        // Log de la request
        logger.info("Request: {} {} from IP: {} User-Agent: {}", 
                   method, requestURI, ipAddress, userAgent);
        
        // Validar User-Agent
        if (isSuspiciousUserAgent(userAgent)) {
            logger.warn("Suspicious User-Agent detected: {}", userAgent);
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
            return;
        }
        
        // Validar rate limiting
        if (isRateLimitExceeded(ipAddress)) {
            logger.warn("Rate limit exceeded for IP: {}", ipAddress);
            httpResponse.sendError(HttpServletResponse.SC_TOO_MANY_REQUESTS, "Rate limit exceeded");
            return;
        }
        
        // Continuar con la cadena de filtros
        chain.doFilter(request, response);
        
        // Log de la respuesta
        logger.info("Response: {} {} - Status: {}", 
                   method, requestURI, httpResponse.getStatus());
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
    
    private boolean isSuspiciousUserAgent(String userAgent) {
        if (userAgent == null) {
            return true;
        }
        
        // Lista de User-Agents sospechosos
        String[] suspiciousPatterns = {
            "sqlmap", "nikto", "nmap", "scanner", "bot", "crawler"
        };
        
        String lowerUserAgent = userAgent.toLowerCase();
        for (String pattern : suspiciousPatterns) {
            if (lowerUserAgent.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    private boolean isRateLimitExceeded(String ipAddress) {
        // Implementación básica de rate limiting
        // En producción, usar Redis o similar
        return false; // Placeholder
    }
}
```

### 2. Interceptores de Seguridad

Los interceptores permiten ejecutar código antes y después de las requests.

```java
// SecurityInterceptor.java - Interceptor de seguridad
@Component
public class SecurityInterceptor implements HandlerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityInterceptor.class);
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                           Object handler) throws Exception {
        
        // Verificar si el handler es un método de controlador
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            
            // Verificar anotaciones de seguridad
            if (handlerMethod.hasMethodAnnotation(Secure.class)) {
                if (!isUserAuthenticated(request)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
                    return false;
                }
            }
            
            if (handlerMethod.hasMethodAnnotation(RequireRole.class)) {
                RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);
                if (!hasRequiredRole(request, requireRole.value())) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Insufficient privileges");
                    return false;
                }
            }
            
            // Log de acceso
            logAccess(request, handlerMethod);
        }
        
        return true;
    }
    
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, 
                          Object handler, ModelAndView modelAndView) throws Exception {
        
        // Agregar headers de seguridad a la respuesta
        addSecurityHeaders(response);
        
        // Log de respuesta
        logResponse(request, response);
    }
    
    private boolean isUserAuthenticated(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null && session.getAttribute("authenticated") != null;
    }
    
    private boolean hasRequiredRole(HttpServletRequest request, String requiredRole) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            List<String> userRoles = (List<String>) session.getAttribute("roles");
            return userRoles != null && userRoles.contains(requiredRole);
        }
        return false;
    }
    
    private void addSecurityHeaders(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    
    private void logAccess(HttpServletRequest request, HandlerMethod handlerMethod) {
        String username = getCurrentUsername(request);
        String method = handlerMethod.getMethod().getName();
        String controller = handlerMethod.getBeanType().getSimpleName();
        
        logger.info("Access: User={}, Controller={}, Method={}, IP={}", 
                   username, controller, method, request.getRemoteAddr());
    }
    
    private void logResponse(HttpServletRequest request, HttpServletResponse response) {
        String username = getCurrentUsername(request);
        int status = response.getStatus();
        
        if (status >= 400) {
            logger.warn("Error Response: User={}, Status={}, URI={}", 
                       username, status, request.getRequestURI());
        }
    }
    
    private String getCurrentUsername(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            return (String) session.getAttribute("username");
        }
        return "anonymous";
    }
}

// Anotaciones personalizadas
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Secure {}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    String value();
}
```

---

## 🔐 Autenticación Avanzada

### 1. Autenticación Multi-Factor (MFA)

```java
// MFAService.java - Servicio de autenticación multi-factor
@Service
public class MFAService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SMSService smsService;
    
    // Generar código TOTP (Time-based One-Time Password)
    public String generateTOTP(String secret) {
        try {
            // Usar Google Authenticator o similar
            TOTP totp = new TOTP(secret);
            return totp.now();
        } catch (Exception e) {
            throw new RuntimeException("Error generating TOTP", e);
        }
    }
    
    // Verificar código TOTP
    public boolean verifyTOTP(String secret, String code) {
        try {
            TOTP totp = new TOTP(secret);
            return totp.verify(code);
        } catch (Exception e) {
            return false;
        }
    }
    
    // Enviar código por email
    public void sendEmailCode(String email, String code) {
        String subject = "Código de verificación";
        String body = "Tu código de verificación es: " + code;
        emailService.sendEmail(email, subject, body);
    }
    
    // Enviar código por SMS
    public void sendSMSCode(String phone, String code) {
        String message = "Tu código de verificación es: " + code;
        smsService.sendSMS(phone, message);
    }
    
    // Proceso completo de autenticación MFA
    public MFAStatus authenticateWithMFA(String username, String password, String mfaCode) {
        // 1. Verificar credenciales básicas
        User user = userService.authenticate(username, password);
        if (user == null) {
            return MFAStatus.INVALID_CREDENTIALS;
        }
        
        // 2. Verificar si MFA está habilitado
        if (!user.isMfaEnabled()) {
            return MFAStatus.MFA_NOT_ENABLED;
        }
        
        // 3. Verificar código MFA
        if (!verifyTOTP(user.getMfaSecret(), mfaCode)) {
            return MFAStatus.INVALID_MFA_CODE;
        }
        
        return MFAStatus.SUCCESS;
    }
}

// Enum para estados de MFA
public enum MFAStatus {
    SUCCESS,
    INVALID_CREDENTIALS,
    MFA_NOT_ENABLED,
    INVALID_MFA_CODE,
    EXPIRED_CODE
}
```

### 2. Autenticación por Tokens JWT

```java
// JWTService.java - Servicio de tokens JWT
@Service
public class JWTService {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    // Generar token JWT
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getId())
                .claim("roles", user.getRoles())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    // Validar token JWT
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new SecurityException("Token expired");
        } catch (UnsupportedJwtException e) {
            throw new SecurityException("Unsupported JWT");
        } catch (MalformedJwtException e) {
            throw new SecurityException("Malformed JWT");
        } catch (SignatureException e) {
            throw new SecurityException("Invalid signature");
        } catch (IllegalArgumentException e) {
            throw new SecurityException("Invalid token");
        }
    }
    
    // Extraer username del token
    public String getUsernameFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getSubject();
    }
    
    // Extraer roles del token
    public List<String> getRolesFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.get("roles", List.class);
    }
    
    // Verificar si el token está próximo a expirar
    public boolean isTokenNearExpiration(String token) {
        try {
            Claims claims = validateToken(token);
            Date expiration = claims.getExpiration();
            Date now = new Date();
            
            // Considerar próximo a expirar si faltan menos de 5 minutos
            long timeUntilExpiration = expiration.getTime() - now.getTime();
            return timeUntilExpiration < 300000; // 5 minutos en milisegundos
        } catch (Exception e) {
            return true;
        }
    }
}
```

---

## 🔒 Autorización Granular

### 1. Sistema de Permisos Basado en Recursos

```java
// PermissionService.java - Servicio de permisos granular
@Service
public class PermissionService {
    
    @Autowired
    private PermissionRepository permissionRepository;
    
    // Verificar permiso específico
    public boolean hasPermission(String username, String resource, String action) {
        Permission permission = permissionRepository.findByUsernameAndResourceAndAction(
            username, resource, action);
        return permission != null && permission.isActive();
    }
    
    // Verificar múltiples permisos
    public boolean hasAllPermissions(String username, List<PermissionRequest> permissions) {
        for (PermissionRequest permission : permissions) {
            if (!hasPermission(username, permission.getResource(), permission.getAction())) {
                return false;
            }
        }
        return true;
    }
    
    // Verificar al menos un permiso
    public boolean hasAnyPermission(String username, List<PermissionRequest> permissions) {
        for (PermissionRequest permission : permissions) {
            if (hasPermission(username, permission.getResource(), permission.getAction())) {
                return true;
            }
        }
        return false;
    }
    
    // Asignar permiso a usuario
    public void grantPermission(String username, String resource, String action) {
        Permission permission = new Permission();
        permission.setUsername(username);
        permission.setResource(resource);
        permission.setAction(action);
        permission.setActive(true);
        permission.setGrantedAt(new Date());
        
        permissionRepository.save(permission);
    }
    
    // Revocar permiso de usuario
    public void revokePermission(String username, String resource, String action) {
        Permission permission = permissionRepository.findByUsernameAndResourceAndAction(
            username, resource, action);
        if (permission != null) {
            permission.setActive(false);
            permission.setRevokedAt(new Date());
            permissionRepository.save(permission);
        }
    }
}

// Modelo de permiso
@Entity
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String resource;
    private String action;
    private boolean active;
    private Date grantedAt;
    private Date revokedAt;
    
    // Getters y setters
}

// Request de permiso
public class PermissionRequest {
    private String resource;
    private String action;
    
    // Constructor, getters y setters
}
```

### 2. Autorización Basada en Atributos (ABAC)

```java
// ABACService.java - Servicio de autorización basada en atributos
@Service
public class ABACService {
    
    // Evaluar política ABAC
    public boolean evaluatePolicy(ABACRequest request) {
        // Obtener atributos del usuario
        UserAttributes userAttributes = getUserAttributes(request.getUsername());
        
        // Obtener atributos del recurso
        ResourceAttributes resourceAttributes = getResourceAttributes(request.getResource());
        
        // Obtener atributos del entorno
        EnvironmentAttributes envAttributes = getEnvironmentAttributes(request);
        
        // Evaluar reglas de política
        return evaluateRules(userAttributes, resourceAttributes, envAttributes, request.getAction());
    }
    
    // Evaluar reglas específicas
    private boolean evaluateRules(UserAttributes user, ResourceAttributes resource, 
                                EnvironmentAttributes env, String action) {
        
        // Regla 1: Usuario debe estar en el mismo departamento que el recurso
        if (!user.getDepartment().equals(resource.getDepartment())) {
            return false;
        }
        
        // Regla 2: Usuario debe tener el rol requerido
        if (!user.getRoles().contains(resource.getRequiredRole())) {
            return false;
        }
        
        // Regla 3: Acción debe estar permitida en el horario actual
        if (!isActionAllowedInTimeRange(action, env.getCurrentTime())) {
            return false;
        }
        
        // Regla 4: Usuario debe estar en la ubicación permitida
        if (!isLocationAllowed(user.getLocation(), resource.getAllowedLocations())) {
            return false;
        }
        
        return true;
    }
    
    private boolean isActionAllowedInTimeRange(String action, LocalTime currentTime) {
        // Implementar lógica de horarios permitidos
        if ("DELETE".equals(action)) {
            // Solo permitir eliminaciones entre 9 AM y 5 PM
            return currentTime.isAfter(LocalTime.of(9, 0)) && 
                   currentTime.isBefore(LocalTime.of(17, 0));
        }
        return true;
    }
    
    private boolean isLocationAllowed(String userLocation, List<String> allowedLocations) {
        return allowedLocations.contains(userLocation);
    }
}

// Modelos de atributos
public class UserAttributes {
    private String username;
    private String department;
    private List<String> roles;
    private String location;
    private String securityLevel;
    
    // Getters y setters
}

public class ResourceAttributes {
    private String resourceId;
    private String department;
    private String requiredRole;
    private List<String> allowedLocations;
    private String sensitivityLevel;
    
    // Getters y setters
}

public class EnvironmentAttributes {
    private LocalTime currentTime;
    private String userIp;
    private String userAgent;
    private boolean isHoliday;
    
    // Getters y setters
}

public class ABACRequest {
    private String username;
    private String resource;
    private String action;
    
    // Getters y setters
}
```

---

## 📊 Logging y Monitoreo

### 1. Sistema de Logging Avanzado

```java
// SecurityLoggingService.java - Servicio de logging avanzado
@Service
public class SecurityLoggingService {
    
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");
    private static final Logger accessLogger = LoggerFactory.getLogger("ACCESS");
    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");
    
    // Log de eventos de seguridad
    public void logSecurityEvent(SecurityEvent event) {
        String logMessage = String.format(
            "SECURITY_EVENT: Type=%s, User=%s, IP=%s, Details=%s, Timestamp=%s",
            event.getType(),
            event.getUsername(),
            event.getIpAddress(),
            event.getDetails(),
            event.getTimestamp()
        );
        
        switch (event.getSeverity()) {
            case LOW:
                securityLogger.info(logMessage);
                break;
            case MEDIUM:
                securityLogger.warn(logMessage);
                break;
            case HIGH:
                securityLogger.error(logMessage);
                // Enviar alerta
                sendSecurityAlert(event);
                break;
            case CRITICAL:
                securityLogger.error(logMessage);
                // Enviar alerta inmediata
                sendCriticalAlert(event);
                break;
        }
    }
    
    // Log de acceso a recursos
    public void logResourceAccess(ResourceAccessEvent event) {
        String logMessage = String.format(
            "RESOURCE_ACCESS: User=%s, Resource=%s, Action=%s, IP=%s, Success=%s, Timestamp=%s",
            event.getUsername(),
            event.getResource(),
            event.getAction(),
            event.getIpAddress(),
            event.isSuccess(),
            event.getTimestamp()
        );
        
        accessLogger.info(logMessage);
    }
    
    // Log de auditoría
    public void logAuditEvent(AuditEvent event) {
        String logMessage = String.format(
            "AUDIT_EVENT: User=%s, Action=%s, Target=%s, OldValue=%s, NewValue=%s, Timestamp=%s",
            event.getUsername(),
            event.getAction(),
            event.getTarget(),
            event.getOldValue(),
            event.getNewValue(),
            event.getTimestamp()
        );
        
        auditLogger.info(logMessage);
    }
    
    private void sendSecurityAlert(SecurityEvent event) {
        // Implementar envío de alertas (email, SMS, Slack, etc.)
    }
    
    private void sendCriticalAlert(SecurityEvent event) {
        // Implementar envío de alertas críticas
    }
}

// Modelos de eventos
public class SecurityEvent {
    private SecurityEventType type;
    private String username;
    private String ipAddress;
    private String details;
    private SecuritySeverity severity;
    private LocalDateTime timestamp;
    
    // Constructor, getters y setters
}

public class ResourceAccessEvent {
    private String username;
    private String resource;
    private String action;
    private String ipAddress;
    private boolean success;
    private LocalDateTime timestamp;
    
    // Constructor, getters y setters
}

public class AuditEvent {
    private String username;
    private String action;
    private String target;
    private String oldValue;
    private String newValue;
    private LocalDateTime timestamp;
    
    // Constructor, getters y setters
}

public enum SecurityEventType {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    ACCESS_DENIED,
    SUSPICIOUS_ACTIVITY,
    RATE_LIMIT_EXCEEDED,
    SQL_INJECTION_ATTEMPT,
    XSS_ATTEMPT
}

public enum SecuritySeverity {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
```

### 2. Monitoreo en Tiempo Real

```java
// SecurityMonitoringService.java - Servicio de monitoreo
@Service
public class SecurityMonitoringService {
    
    private final Map<String, AtomicInteger> failedLoginAttempts = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> suspiciousActivityCount = new ConcurrentHashMap<>();
    private final Queue<SecurityEvent> recentEvents = new ConcurrentLinkedQueue<>();
    
    // Monitorear intentos de login fallidos
    public void monitorFailedLogin(String username, String ipAddress) {
        String key = username + ":" + ipAddress;
        int attempts = failedLoginAttempts.computeIfAbsent(key, k -> new AtomicInteger(0))
                                         .incrementAndGet();
        
        if (attempts >= 5) {
            SecurityEvent event = new SecurityEvent();
            event.setType(SecurityEventType.LOGIN_FAILURE);
            event.setUsername(username);
            event.setIpAddress(ipAddress);
            event.setSeverity(SecuritySeverity.HIGH);
            event.setDetails("Multiple failed login attempts: " + attempts);
            event.setTimestamp(LocalDateTime.now());
            
            logSecurityEvent(event);
            blockUser(username);
        }
    }
    
    // Monitorear actividad sospechosa
    public void monitorSuspiciousActivity(String username, String activity) {
        int count = suspiciousActivityCount.computeIfAbsent(username, k -> new AtomicInteger(0))
                                         .incrementAndGet();
        
        if (count >= 3) {
            SecurityEvent event = new SecurityEvent();
            event.setType(SecurityEventType.SUSPICIOUS_ACTIVITY);
            event.setUsername(username);
            event.setSeverity(SecuritySeverity.MEDIUM);
            event.setDetails("Suspicious activity detected: " + activity);
            event.setTimestamp(LocalDateTime.now());
            
            logSecurityEvent(event);
        }
    }
    
    // Obtener estadísticas de seguridad
    public SecurityStatistics getSecurityStatistics() {
        SecurityStatistics stats = new SecurityStatistics();
        
        // Contar eventos por tipo
        Map<SecurityEventType, Long> eventCounts = recentEvents.stream()
            .collect(Collectors.groupingBy(SecurityEvent::getType, Collectors.counting()));
        
        stats.setEventCounts(eventCounts);
        stats.setTotalFailedLogins(failedLoginAttempts.values().stream()
            .mapToInt(AtomicInteger::get).sum());
        stats.setTotalSuspiciousActivities(suspiciousActivityCount.values().stream()
            .mapToInt(AtomicInteger::get).sum());
        
        return stats;
    }
    
    private void blockUser(String username) {
        // Implementar bloqueo de usuario
    }
    
    private void logSecurityEvent(SecurityEvent event) {
        // Agregar a cola de eventos recientes
        recentEvents.offer(event);
        
        // Mantener solo los últimos 1000 eventos
        while (recentEvents.size() > 1000) {
            recentEvents.poll();
        }
    }
}

// Modelo de estadísticas
public class SecurityStatistics {
    private Map<SecurityEventType, Long> eventCounts;
    private int totalFailedLogins;
    private int totalSuspiciousActivities;
    private LocalDateTime generatedAt;
    
    // Constructor, getters y setters
}
```

---

## 🧪 Testing de Seguridad

### 1. Tests Unitarios de Seguridad

```java
// SecurityServiceTest.java - Tests de seguridad
@ExtendWith(MockitoExtension.class)
class SecurityServiceTest {
    
    @Mock
    private UserService userService;
    
    @Mock
    private PermissionService permissionService;
    
    @InjectMocks
    private SecurityService securityService;
    
    @Test
    @DisplayName("Should authenticate valid user")
    void shouldAuthenticateValidUser() {
        // Given
        String username = "testuser";
        String password = "validpassword";
        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPasswordHash("hashedpassword");
        
        when(userService.findByUsername(username)).thenReturn(mockUser);
        when(userService.verifyPassword(password, "hashedpassword")).thenReturn(true);
        
        // When
        boolean result = securityService.authenticate(username, password);
        
        // Then
        assertTrue(result);
        verify(userService).findByUsername(username);
        verify(userService).verifyPassword(password, "hashedpassword");
    }
    
    @Test
    @DisplayName("Should reject invalid password")
    void shouldRejectInvalidPassword() {
        // Given
        String username = "testuser";
        String password = "invalidpassword";
        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPasswordHash("hashedpassword");
        
        when(userService.findByUsername(username)).thenReturn(mockUser);
        when(userService.verifyPassword(password, "hashedpassword")).thenReturn(false);
        
        // When
        boolean result = securityService.authenticate(username, password);
        
        // Then
        assertFalse(result);
    }
    
    @Test
    @DisplayName("Should check permissions correctly")
    void shouldCheckPermissionsCorrectly() {
        // Given
        String username = "testuser";
        String resource = "user:123";
        String action = "read";
        
        when(permissionService.hasPermission(username, resource, action)).thenReturn(true);
        
        // When
        boolean result = securityService.hasPermission(username, resource, action);
        
        // Then
        assertTrue(result);
        verify(permissionService).hasPermission(username, resource, action);
    }
    
    @Test
    @DisplayName("Should prevent SQL injection")
    void shouldPreventSqlInjection() {
        // Given
        String maliciousInput = "'; DROP TABLE users; --";
        
        // When
        boolean result = securityService.isValidInput(maliciousInput);
        
        // Then
        assertFalse(result);
    }
    
    @Test
    @DisplayName("Should prevent XSS attacks")
    void shouldPreventXssAttacks() {
        // Given
        String maliciousInput = "<script>alert('XSS')</script>";
        
        // When
        String sanitized = securityService.sanitizeInput(maliciousInput);
        
        // Then
        assertFalse(sanitized.contains("<script>"));
        assertTrue(sanitized.contains("&lt;script&gt;"));
    }
}
```

### 2. Tests de Integración de Seguridad

```java
// SecurityIntegrationTest.java - Tests de integración
@SpringBootTest
@AutoConfigureTestDatabase
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class SecurityIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    @DisplayName("Should require authentication for protected endpoints")
    void shouldRequireAuthenticationForProtectedEndpoints() {
        // Given
        String protectedUrl = "/api/admin/users";
        
        // When
        ResponseEntity<String> response = restTemplate.getForEntity(protectedUrl, String.class);
        
        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
    
    @Test
    @DisplayName("Should allow access with valid credentials")
    void shouldAllowAccessWithValidCredentials() {
        // Given
        String username = "admin";
        String password = "admin123";
        
        // Create test user
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
        user.setRoles(Arrays.asList("ADMIN"));
        userRepository.save(user);
        
        // When
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(username, password);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "/api/admin/users", 
            HttpMethod.GET, 
            entity, 
            String.class
        );
        
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
    
    @Test
    @DisplayName("Should prevent CSRF attacks")
    void shouldPreventCsrfAttacks() {
        // Given
        String csrfUrl = "/api/users";
        String maliciousPayload = "{\"username\":\"hacker\",\"email\":\"hacker@evil.com\"}";
        
        // When
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(maliciousPayload, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            csrfUrl, 
            HttpMethod.POST, 
            entity, 
            String.class
        );
        
        // Then
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
    
    @Test
    @DisplayName("Should validate input data")
    void shouldValidateInputData() {
        // Given
        String invalidEmail = "invalid-email";
        
        // When
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String payload = "{\"email\":\"" + invalidEmail + "\"}";
        HttpEntity<String> entity = new HttpEntity<>(payload, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "/api/users", 
            HttpMethod.POST, 
            entity, 
            String.class
        );
        
        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
```

---

## 🎯 Checklist de Nivel Intermedio

### Conceptos que debes dominar:
- [ ] Implementación de filtros personalizados
- [ ] Uso de interceptores para seguridad
- [ ] Autenticación multi-factor (MFA)
- [ ] Tokens JWT y manejo de sesiones
- [ ] Autorización granular basada en permisos
- [ ] Autorización basada en atributos (ABAC)
- [ ] Logging avanzado de eventos de seguridad
- [ ] Monitoreo en tiempo real
- [ ] Testing de seguridad (unitarios e integración)

### Habilidades prácticas:
- [ ] Crear filtros de seguridad personalizados
- [ ] Implementar sistema de permisos granular
- [ ] Configurar autenticación MFA
- [ ] Manejar tokens JWT de forma segura
- [ ] Implementar logging de auditoría
- [ ] Crear tests de seguridad
- [ ] Configurar monitoreo de eventos
- [ ] Implementar rate limiting
- [ ] Manejar sesiones de forma segura

---

**¡Con estos conceptos intermedios estás listo para abordar el nivel avanzado! 🚀** 