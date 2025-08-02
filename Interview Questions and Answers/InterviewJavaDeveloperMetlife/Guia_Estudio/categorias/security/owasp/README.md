# 🛡️ OWASP - Estándares de Seguridad Avanzados

## 📋 Índice

1. [OWASP Top 10](#owasp-top-10)
2. [Prevención de Vulnerabilidades](#prevención-de-vulnerabilidades)
3. [Validación y Sanitización](#validación-y-sanitización)
4. [Autenticación y Autorización](#autenticación-y-autorización)
5. [Logging y Monitoreo](#logging-y-monitoreo)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 OWASP Top 10

### Implementación de Contramedidas OWASP

```java
// OWASPSecurityConfig.java - Configuración de seguridad OWASP
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration // Marca como configuración de Spring
@EnableWebSecurity // Habilita seguridad web
public class OWASPSecurityConfig extends WebSecurityConfigurerAdapter {
    
    // Propiedades de seguridad inyectadas desde application.properties
    @Value("${security.csrf.enabled}") // Habilitar CSRF
    private boolean csrfEnabled; // Flag para habilitar CSRF
    
    @Value("${security.xss.enabled}") // Habilitar protección XSS
    private boolean xssEnabled; // Flag para habilitar protección XSS
    
    @Value("${security.content-type.enabled}") // Habilitar validación de Content-Type
    private boolean contentTypeEnabled; // Flag para validación de Content-Type
    
    // Bean para encoder de contraseñas (OWASP A02:2021 - Cryptographic Failures)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Crea encoder BCrypt con factor 12
        
        // RESULTADO ESPERADO: Encoder de contraseñas seguro configurado
    }
    
    // Bean para filtro de seguridad OWASP
    @Bean
    public OWASPSecurityFilter owaspSecurityFilter() {
        return new OWASPSecurityFilter(xssEnabled, contentTypeEnabled); // Crea filtro de seguridad
        
        // RESULTADO ESPERADO: Filtro de seguridad OWASP configurado
    }
    
    // Configuración de seguridad HTTP (OWASP A01:2021 - Broken Access Control)
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // Configuración CSRF (OWASP A01:2021 - Broken Access Control)
            .csrf().disable() // Deshabilita CSRF para APIs (configurar según necesidades)
            
            // Configuración de headers de seguridad (OWASP A05:2021 - Security Misconfiguration)
            .headers()
                .frameOptions().deny() // Previene clickjacking
                .contentTypeOptions().and() // Previene MIME sniffing
                .xssProtection().and() // Habilita protección XSS
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig // Configura HSTS
                    .maxAgeInSeconds(31536000) // 1 año
                    .includeSubdomains(true) // Incluye subdominios
                )
            .and()
            
            // Configuración de autorización (OWASP A01:2021 - Broken Access Control)
            .authorizeRequests()
                .antMatchers("/api/public/**").permitAll() // Endpoints públicos
                .antMatchers("/api/admin/**").hasRole("ADMIN") // Requiere rol ADMIN
                .antMatchers("/api/user/**").hasRole("USER") // Requiere rol USER
                .anyRequest().authenticated() // Requiere autenticación para cualquier otra request
            .and()
            
            // Configuración de sesiones (OWASP A02:2021 - Cryptographic Failures)
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sesiones stateless
                .maximumSessions(1) // Máximo 1 sesión por usuario
                .expiredUrl("/login?expired") // URL para sesiones expiradas
            .and()
            
            // Agregar filtro de seguridad OWASP
            .addFilterBefore(owaspSecurityFilter(), UsernamePasswordAuthenticationFilter.class);
        
        // RESULTADO ESPERADO: Configuración de seguridad OWASP aplicada
    }
}

// OWASPSecurityFilter.java - Filtro de seguridad OWASP
package com.example.security;

import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Pattern;

public class OWASPSecurityFilter extends OncePerRequestFilter {
    
    private final boolean xssEnabled; // Flag para protección XSS
    private final boolean contentTypeEnabled; // Flag para validación de Content-Type
    
    // Patrones para detección de XSS
    private static final Pattern XSS_PATTERN = Pattern.compile( // Patrón para detectar XSS
            "<script[^>]*>.*?</script>|<iframe[^>]*>.*?</iframe>|javascript:|vbscript:|onload=|onerror=", // Patrones XSS
            Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL // Flags de patrón
    );
    
    // Patrones para detección de SQL Injection
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile( // Patrón para detectar SQL Injection
            "\\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\\b", // Palabras clave SQL
            Pattern.CASE_INSENSITIVE // Flag de patrón
    );
    
    public OWASPSecurityFilter(boolean xssEnabled, boolean contentTypeEnabled) {
        this.xssEnabled = xssEnabled; // Establece flag de XSS
        this.contentTypeEnabled = contentTypeEnabled; // Establece flag de Content-Type
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Validación de Content-Type (OWASP A05:2021 - Security Misconfiguration)
            if (contentTypeEnabled) { // Si está habilitada la validación
                validateContentType(request); // Valida Content-Type
            }
            
            // Validación de parámetros (OWASP A03:2021 - Injection)
            validateParameters(request); // Valida parámetros
            
            // Validación de headers (OWASP A05:2021 - Security Misconfiguration)
            validateHeaders(request); // Valida headers
            
            // Protección XSS (OWASP A03:2021 - Injection)
            if (xssEnabled) { // Si está habilitada la protección XSS
                sanitizeRequest(request); // Sanitiza request
            }
            
            // Continúa con la cadena de filtros
            filterChain.doFilter(request, response); // Continúa con filtros
            
            // Validación de respuesta (OWASP A05:2021 - Security Misconfiguration)
            validateResponse(response); // Valida respuesta
            
        } catch (SecurityException e) {
            // Maneja excepciones de seguridad
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // Establece status 403
            response.getWriter().write("Security violation detected"); // Escribe mensaje de error
            
            // RESULTADO ESPERADO: Request bloqueada por violación de seguridad
        }
    }
    
    // Método para validar Content-Type
    private void validateContentType(HttpServletRequest request) {
        String contentType = request.getContentType(); // Obtiene Content-Type
        
        if (contentType != null && !contentType.startsWith("application/json") && 
            !contentType.startsWith("application/x-www-form-urlencoded") && 
            !contentType.startsWith("multipart/form-data")) { // Valida Content-Type
            
            throw new SecurityException("Invalid Content-Type: " + contentType); // Lanza excepción
        }
        
        // RESULTADO ESPERADO: Content-Type validado correctamente
    }
    
    // Método para validar parámetros
    private void validateParameters(HttpServletRequest request) {
        // Valida parámetros de query string
        String queryString = request.getQueryString(); // Obtiene query string
        if (queryString != null) { // Si existe query string
            validateInput(queryString); // Valida input
        }
        
        // Valida parámetros de request
        request.getParameterMap().values().forEach(values -> { // Itera sobre parámetros
            for (String value : values) { // Itera sobre valores
                if (value != null) { // Si el valor no es null
                    validateInput(value); // Valida input
                }
            }
        });
        
        // RESULTADO ESPERADO: Parámetros validados correctamente
    }
    
    // Método para validar headers
    private void validateHeaders(HttpServletRequest request) {
        // Valida User-Agent
        String userAgent = request.getHeader("User-Agent"); // Obtiene User-Agent
        if (userAgent != null && userAgent.length() > 500) { // Si es muy largo
            throw new SecurityException("User-Agent too long"); // Lanza excepción
        }
        
        // Valida Referer
        String referer = request.getHeader("Referer"); // Obtiene Referer
        if (referer != null && !referer.startsWith(request.getScheme() + "://" + request.getServerName())) { // Valida Referer
            throw new SecurityException("Invalid Referer"); // Lanza excepción
        }
        
        // RESULTADO ESPERADO: Headers validados correctamente
    }
    
    // Método para sanitizar request
    private void sanitizeRequest(HttpServletRequest request) {
        // Sanitiza parámetros
        request.getParameterMap().forEach((key, values) -> { // Itera sobre parámetros
            for (int i = 0; i < values.length; i++) { // Itera sobre valores
                if (values[i] != null) { // Si el valor no es null
                    values[i] = sanitizeInput(values[i]); // Sanitiza input
                }
            }
        });
        
        // RESULTADO ESPERADO: Request sanitizada correctamente
    }
    
    // Método para validar input
    private void validateInput(String input) {
        // Detección de XSS
        if (XSS_PATTERN.matcher(input).find()) { // Si encuentra patrón XSS
            throw new SecurityException("XSS attack detected"); // Lanza excepción
        }
        
        // Detección de SQL Injection
        if (SQL_INJECTION_PATTERN.matcher(input).find()) { // Si encuentra patrón SQL Injection
            throw new SecurityException("SQL injection attack detected"); // Lanza excepción
        }
        
        // Detección de Path Traversal
        if (input.contains("..") || input.contains("\\") || input.contains("/")) { // Si contiene caracteres de path traversal
            throw new SecurityException("Path traversal attack detected"); // Lanza excepción
        }
        
        // RESULTADO ESPERADO: Input validado correctamente
    }
    
    // Método para sanitizar input
    private String sanitizeInput(String input) {
        // Sanitiza caracteres especiales
        return input.replaceAll("<", "&lt;") // Reemplaza < con &lt;
                   .replaceAll(">", "&gt;") // Reemplaza > con &gt;
                   .replaceAll("\"", "&quot;") // Reemplaza " con &quot;
                   .replaceAll("'", "&#x27;") // Reemplaza ' con &#x27;
                   .replaceAll("&", "&amp;"); // Reemplaza & con &amp;
        
        // RESULTADO ESPERADO: Input sanitizado correctamente
    }
    
    // Método para validar respuesta
    private void validateResponse(HttpServletResponse response) {
        // Valida headers de respuesta
        if (!response.containsHeader("X-Content-Type-Options")) { // Si no tiene header X-Content-Type-Options
            response.setHeader("X-Content-Type-Options", "nosniff"); // Establece header
        }
        
        if (!response.containsHeader("X-Frame-Options")) { // Si no tiene header X-Frame-Options
            response.setHeader("X-Frame-Options", "DENY"); // Establece header
        }
        
        if (!response.containsHeader("X-XSS-Protection")) { // Si no tiene header X-XSS-Protection
            response.setHeader("X-XSS-Protection", "1; mode=block"); // Establece header
        }
        
        // RESULTADO ESPERADO: Respuesta validada correctamente
    }
}
```

---

## ✅ Prevención de Vulnerabilidades

### Servicio de Prevención OWASP

```java
// OWASPPreventionService.java - Servicio de prevención de vulnerabilidades OWASP
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service // Marca como servicio de Spring
public class OWASPPreventionService {
    
    // Mapa para tracking de intentos de acceso (OWASP A07:2021 - Identification and Authentication Failures)
    private final ConcurrentHashMap<String, AtomicInteger> accessAttempts = new ConcurrentHashMap<>(); // Mapa de intentos de acceso
    
    // Mapa para tracking de sesiones (OWASP A01:2021 - Broken Access Control)
    private final ConcurrentHashMap<String, String> activeSessions = new ConcurrentHashMap<>(); // Mapa de sesiones activas
    
    @Autowired
    private OWASPLoggingService loggingService; // Inyecta servicio de logging
    
    // Método para prevenir ataques de fuerza bruta (OWASP A07:2021 - Identification and Authentication Failures)
    public boolean checkBruteForceProtection(String username, String ipAddress) {
        String key = username + ":" + ipAddress; // Crea clave única
        AtomicInteger attempts = accessAttempts.computeIfAbsent(key, k -> new AtomicInteger(0)); // Obtiene contador
        
        int currentAttempts = attempts.incrementAndGet(); // Incrementa contador
        
        // Verifica límite de intentos
        if (currentAttempts > 5) { // Si excede 5 intentos
            loggingService.logSecurityWarning("Brute force attempt detected", 
                "User: " + username + ", IP: " + ipAddress + ", Attempts: " + currentAttempts); // Log de advertencia
            
            // RESULTADO ESPERADO: false - Acceso bloqueado por fuerza bruta
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Acceso permitido
        return true; // Retorna true
    }
    
    // Método para resetear contador de intentos
    public void resetAccessAttempts(String username, String ipAddress) {
        String key = username + ":" + ipAddress; // Crea clave única
        accessAttempts.remove(key); // Elimina contador
        
        // RESULTADO ESPERADO: Contador de intentos reseteado
    }
    
    // Método para prevenir session fixation (OWASP A01:2021 - Broken Access Control)
    public void preventSessionFixation(HttpSession session) {
        // Regenera ID de sesión después de autenticación
        if (session != null && session.getAttribute("authenticated") != null) { // Si está autenticado
            session.invalidate(); // Invalida sesión actual
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest(); // Obtiene request
            HttpSession newSession = request.getSession(true); // Crea nueva sesión
            newSession.setAttribute("authenticated", true); // Establece autenticado
            
            // RESULTADO ESPERADO: Sesión regenerada para prevenir session fixation
        }
    }
    
    // Método para prevenir session hijacking (OWASP A01:2021 - Broken Access Control)
    public boolean validateSession(HttpSession session, String username) {
        if (session == null) { // Si no hay sesión
            return false; // Retorna false
        }
        
        // Verifica si la sesión pertenece al usuario
        String sessionUsername = (String) session.getAttribute("username"); // Obtiene username de sesión
        if (!username.equals(sessionUsername)) { // Si no coincide
            loggingService.logSecurityWarning("Session hijacking attempt detected", 
                "Expected user: " + username + ", Session user: " + sessionUsername); // Log de advertencia
            
            // RESULTADO ESPERADO: false - Sesión inválida
            return false; // Retorna false
        }
        
        // Verifica tiempo de expiración de sesión
        long lastAccessTime = session.getLastAccessedTime(); // Obtiene último acceso
        long currentTime = System.currentTimeMillis(); // Obtiene tiempo actual
        long sessionTimeout = 30 * 60 * 1000; // 30 minutos en milisegundos
        
        if (currentTime - lastAccessTime > sessionTimeout) { // Si expiró
            session.invalidate(); // Invalida sesión
            
            // RESULTADO ESPERADO: false - Sesión expirada
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Sesión válida
        return true; // Retorna true
    }
    
    // Método para prevenir CSRF (OWASP A01:2021 - Broken Access Control)
    public boolean validateCSRFToken(String token, HttpSession session) {
        if (token == null || session == null) { // Si no hay token o sesión
            return false; // Retorna false
        }
        
        // Obtiene token de sesión
        String sessionToken = (String) session.getAttribute("csrf_token"); // Obtiene token de sesión
        if (sessionToken == null || !sessionToken.equals(token)) { // Si no coincide
            loggingService.logSecurityWarning("CSRF attack detected", 
                "Invalid CSRF token"); // Log de advertencia
            
            // RESULTADO ESPERADO: false - Token CSRF inválido
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Token CSRF válido
        return true; // Retorna true
    }
    
    // Método para generar token CSRF
    public String generateCSRFToken(HttpSession session) {
        String token = java.util.UUID.randomUUID().toString(); // Genera token UUID
        session.setAttribute("csrf_token", token); // Establece token en sesión
        
        // RESULTADO ESPERADO: Token CSRF generado
        return token; // Retorna token
    }
    
    // Método para prevenir clickjacking (OWASP A05:2021 - Security Misconfiguration)
    public void setClickjackingHeaders(HttpServletResponse response) {
        response.setHeader("X-Frame-Options", "DENY"); // Previene clickjacking
        response.setHeader("Content-Security-Policy", "frame-ancestors 'none'"); // CSP para clickjacking
        
        // RESULTADO ESPERADO: Headers de clickjacking establecidos
    }
    
    // Método para prevenir MIME sniffing (OWASP A05:2021 - Security Misconfiguration)
    public void setMIMESniffingHeaders(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff"); // Previene MIME sniffing
        
        // RESULTADO ESPERADO: Header de MIME sniffing establecido
    }
    
    // Método para prevenir XSS (OWASP A03:2021 - Injection)
    public String sanitizeXSS(String input) {
        if (input == null) { // Si input es null
            return null; // Retorna null
        }
        
        // Sanitiza caracteres especiales
        return input.replaceAll("<", "&lt;") // Reemplaza < con &lt;
                   .replaceAll(">", "&gt;") // Reemplaza > con &gt;
                   .replaceAll("\"", "&quot;") // Reemplaza " con &quot;
                   .replaceAll("'", "&#x27;") // Reemplaza ' con &#x27;
                   .replaceAll("&", "&amp;") // Reemplaza & con &amp;
                   .replaceAll("javascript:", "") // Remueve javascript:
                   .replaceAll("vbscript:", "") // Remueve vbscript:
                   .replaceAll("onload=", "") // Remueve onload=
                   .replaceAll("onerror=", ""); // Remueve onerror=
        
        // RESULTADO ESPERADO: Input sanitizado contra XSS
    }
    
    // Método para prevenir SQL Injection (OWASP A03:2021 - Injection)
    public boolean validateSQLInput(String input) {
        if (input == null) { // Si input es null
            return true; // Retorna true
        }
        
        // Patrones de SQL Injection
        String[] sqlPatterns = { // Array de patrones SQL
            "union", "select", "insert", "update", "delete", "drop", "create", "alter", 
            "exec", "execute", "script", "javascript", "vbscript"
        };
        
        String lowerInput = input.toLowerCase(); // Convierte a minúsculas
        
        for (String pattern : sqlPatterns) { // Itera sobre patrones
            if (lowerInput.contains(pattern)) { // Si contiene patrón
                loggingService.logSecurityWarning("SQL injection attempt detected", 
                    "Input: " + input + ", Pattern: " + pattern); // Log de advertencia
                
                // RESULTADO ESPERADO: false - Input contiene SQL malicioso
                return false; // Retorna false
            }
        }
        
        // RESULTADO ESPERADO: true - Input válido
        return true; // Retorna true
    }
    
    // Método para prevenir Path Traversal (OWASP A01:2021 - Broken Access Control)
    public boolean validatePath(String path) {
        if (path == null) { // Si path es null
            return false; // Retorna false
        }
        
        // Verifica caracteres de path traversal
        if (path.contains("..") || path.contains("\\") || path.contains("//")) { // Si contiene caracteres de path traversal
            loggingService.logSecurityWarning("Path traversal attempt detected", 
                "Path: " + path); // Log de advertencia
            
            // RESULTADO ESPERADO: false - Path contiene caracteres de traversal
            return false; // Retorna false
        }
        
        // Verifica que el path esté dentro del directorio permitido
        String normalizedPath = path.replaceAll("/+", "/"); // Normaliza path
        if (!normalizedPath.startsWith("/allowed/")) { // Si no está en directorio permitido
            loggingService.logSecurityWarning("Path traversal attempt detected", 
                "Path: " + path + " not in allowed directory"); // Log de advertencia
            
            // RESULTADO ESPERADO: false - Path fuera de directorio permitido
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Path válido
        return true; // Retorna true
    }
}
```

---

## 🔒 Validación y Sanitización

### Servicio de Validación OWASP

```java
// OWASPValidationService.java - Servicio de validación OWASP
package com.example.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service // Marca como servicio de Spring
public class OWASPValidationService {
    
    // Patrones de validación
    private static final Pattern EMAIL_PATTERN = Pattern.compile( // Patrón para email
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" // Patrón de email
    );
    
    private static final Pattern PHONE_PATTERN = Pattern.compile( // Patrón para teléfono
            "^[+]?[0-9]{10,15}$" // Patrón de teléfono
    );
    
    private static final Pattern USERNAME_PATTERN = Pattern.compile( // Patrón para username
            "^[a-zA-Z0-9_]{3,20}$" // Patrón de username
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile( // Patrón para contraseña
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$" // Patrón de contraseña fuerte
    );
    
    @Autowired
    private OWASPLoggingService loggingService; // Inyecta servicio de logging
    
    // Método para validar email (OWASP A03:2021 - Injection)
    public boolean validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) { // Si es null o vacío
            return false; // Retorna false
        }
        
        // Valida longitud
        if (email.length() > 254) { // Si es muy largo
            loggingService.logValidationError(email, "Email validation", "Email too long"); // Log de error
            return false; // Retorna false
        }
        
        // Valida patrón
        if (!EMAIL_PATTERN.matcher(email).matches()) { // Si no coincide con patrón
            loggingService.logValidationError(email, "Email validation", "Invalid email format"); // Log de error
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Email válido
        return true; // Retorna true
    }
    
    // Método para validar teléfono
    public boolean validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) { // Si es null o vacío
            return false; // Retorna false
        }
        
        // Valida patrón
        if (!PHONE_PATTERN.matcher(phone).matches()) { // Si no coincide con patrón
            loggingService.logValidationError(phone, "Phone validation", "Invalid phone format"); // Log de error
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Teléfono válido
        return true; // Retorna true
    }
    
    // Método para validar username
    public boolean validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) { // Si es null o vacío
            return false; // Retorna false
        }
        
        // Valida patrón
        if (!USERNAME_PATTERN.matcher(username).matches()) { // Si no coincide con patrón
            loggingService.logValidationError(username, "Username validation", "Invalid username format"); // Log de error
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Username válido
        return true; // Retorna true
    }
    
    // Método para validar contraseña (OWASP A07:2021 - Identification and Authentication Failures)
    public boolean validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) { // Si es null o vacío
            return false; // Retorna false
        }
        
        // Valida longitud mínima
        if (password.length() < 8) { // Si es muy corta
            loggingService.logValidationError(password, "Password validation", "Password too short"); // Log de error
            return false; // Retorna false
        }
        
        // Valida patrón de contraseña fuerte
        if (!PASSWORD_PATTERN.matcher(password).matches()) { // Si no coincide con patrón
            loggingService.logValidationError(password, "Password validation", "Password not strong enough"); // Log de error
            return false; // Retorna false
        }
        
        // Verifica contraseñas comunes
        if (isCommonPassword(password)) { // Si es contraseña común
            loggingService.logValidationError(password, "Password validation", "Common password detected"); // Log de error
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Contraseña válida
        return true; // Retorna true
    }
    
    // Método para verificar contraseñas comunes
    private boolean isCommonPassword(String password) {
        String[] commonPasswords = { // Array de contraseñas comunes
            "password", "123456", "123456789", "qwerty", "abc123", "password123",
            "admin", "letmein", "welcome", "monkey", "dragon", "master"
        };
        
        String lowerPassword = password.toLowerCase(); // Convierte a minúsculas
        
        for (String common : commonPasswords) { // Itera sobre contraseñas comunes
            if (lowerPassword.equals(common)) { // Si coincide
                return true; // Retorna true
            }
        }
        
        // RESULTADO ESPERADO: false - No es contraseña común
        return false; // Retorna false
    }
    
    // Método para validar entrada de texto
    public boolean validateTextInput(String input, int maxLength) {
        if (input == null) { // Si es null
            return false; // Retorna false
        }
        
        // Valida longitud
        if (input.length() > maxLength) { // Si excede longitud máxima
            loggingService.logValidationError(input, "Text validation", "Input too long"); // Log de error
            return false; // Retorna false
        }
        
        // Valida caracteres especiales
        if (containsSpecialCharacters(input)) { // Si contiene caracteres especiales
            loggingService.logValidationError(input, "Text validation", "Special characters not allowed"); // Log de error
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Input válido
        return true; // Retorna true
    }
    
    // Método para verificar caracteres especiales
    private boolean containsSpecialCharacters(String input) {
        // Patrón para caracteres especiales peligrosos
        Pattern specialChars = Pattern.compile("[<>\"'&;(){}]"); // Patrón de caracteres especiales
        
        // RESULTADO ESPERADO: true si contiene caracteres especiales
        return specialChars.matcher(input).find(); // Retorna si encuentra caracteres especiales
    }
    
    // Método para sanitizar input
    public String sanitizeInput(String input) {
        if (input == null) { // Si es null
            return null; // Retorna null
        }
        
        // Sanitiza caracteres especiales
        return input.replaceAll("<", "&lt;") // Reemplaza < con &lt;
                   .replaceAll(">", "&gt;") // Reemplaza > con &gt;
                   .replaceAll("\"", "&quot;") // Reemplaza " con &quot;
                   .replaceAll("'", "&#x27;") // Reemplaza ' con &#x27;
                   .replaceAll("&", "&amp;") // Reemplaza & con &amp;
                   .replaceAll(";", "&#59;") // Reemplaza ; con &#59;
                   .replaceAll("(", "&#40;") // Reemplaza ( con &#40;
                   .replaceAll(")", "&#41;") // Reemplaza ) con &#41;
                   .replaceAll("{", "&#123;") // Reemplaza { con &#123;
                   .replaceAll("}", "&#125;"); // Reemplaza } con &#125;
        
        // RESULTADO ESPERADO: Input sanitizado
    }
    
    // Método para validar archivo
    public boolean validateFile(String fileName, String[] allowedExtensions) {
        if (fileName == null || fileName.trim().isEmpty()) { // Si es null o vacío
            return false; // Retorna false
        }
        
        // Obtiene extensión del archivo
        String extension = getFileExtension(fileName); // Obtiene extensión
        if (extension == null) { // Si no tiene extensión
            loggingService.logValidationError(fileName, "File validation", "No file extension"); // Log de error
            return false; // Retorna false
        }
        
        // Verifica extensión permitida
        for (String allowedExt : allowedExtensions) { // Itera sobre extensiones permitidas
            if (allowedExt.equalsIgnoreCase(extension)) { // Si coincide
                // RESULTADO ESPERADO: true - Extensión permitida
                return true; // Retorna true
            }
        }
        
        loggingService.logValidationError(fileName, "File validation", "File extension not allowed: " + extension); // Log de error
        
        // RESULTADO ESPERADO: false - Extensión no permitida
        return false; // Retorna false
    }
    
    // Método para obtener extensión de archivo
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.'); // Obtiene índice del último punto
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) { // Si hay punto válido
            return fileName.substring(lastDotIndex + 1); // Retorna extensión
        }
        
        // RESULTADO ESPERADO: null - No hay extensión
        return null; // Retorna null
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es OWASP y cuáles son sus objetivos?**
   - Open Web Application Security Project, mejorar seguridad de aplicaciones web

2. **¿Cuáles son las principales vulnerabilidades del OWASP Top 10?**
   - Broken Access Control, Cryptographic Failures, Injection, Insecure Design

3. **¿Qué es XSS y cómo prevenirlo?**
   - Cross-Site Scripting, sanitización de input, validación de output

### Preguntas Intermedias

4. **¿Cómo implementar protección CSRF?**
   - Tokens CSRF, validación de origen, headers de seguridad

5. **¿Qué es SQL Injection y cómo prevenirlo?**
   - Inyección SQL, prepared statements, validación de input

6. **¿Cómo manejar autenticación segura?**
   - Contraseñas fuertes, rate limiting, multi-factor authentication

### Preguntas Avanzadas

7. **¿Cómo implementar logging de seguridad?**
   - Eventos de seguridad, auditoría, monitoreo de ataques

8. **¿Qué son las vulnerabilidades de configuración?**
   - Headers de seguridad, configuración de servidor, permisos

9. **¿Cómo realizar testing de seguridad?**
   - Penetration testing, vulnerability scanning, code review

---

## 📚 Recursos Adicionales

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de OWASP! 🚀** 