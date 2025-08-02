# 🛡️ OWASP - Estándares Avanzados y Mejores Prácticas

## 📋 Índice

1. [OWASP Top 10 2021 Detallado](#owasp-top-10-2021-detallado)
2. [Implementación de Contramedidas](#implementación-de-contramedidas)
3. [Testing de Seguridad](#testing-de-seguridad)
4. [Monitoreo y Logging](#monitoreo-y-logging)
5. [Configuración de Seguridad](#configuración-de-seguridad)

---

## 🎯 OWASP Top 10 2021 Detallado

### A01:2021 - Broken Access Control

```java
// AccessControlService.java - Servicio de control de acceso avanzado
package com.example.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.acls.domain.BasePermission;
import org.springframework.security.acls.model.Acl;
import org.springframework.security.acls.model.MutableAcl;
import org.springframework.security.acls.model.MutableAclService;
import org.springframework.security.acls.model.ObjectIdentity;
import org.springframework.security.acls.model.Sid;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service // Marca como servicio de Spring
public class AccessControlService {
    
    @Autowired
    private MutableAclService aclService; // Inyecta servicio ACL
    
    // Cache para permisos de usuario
    private final ConcurrentHashMap<String, List<String>> userPermissionsCache = new ConcurrentHashMap<>(); // Cache de permisos
    
    // Método para verificar acceso a recursos
    @PreAuthorize("hasRole('USER')") // Requiere rol USER
    public boolean checkResourceAccess(Long resourceId, String action) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Obtiene autenticación actual
        
        if (auth == null || !auth.isAuthenticated()) { // Si no está autenticado
            logSecurityViolation("Access denied: User not authenticated", auth); // Log de violación
            return false; // Retorna false
        }
        
        // Verificar cache de permisos
        String cacheKey = auth.getName() + ":" + resourceId; // Clave de cache
        List<String> cachedPermissions = userPermissionsCache.get(cacheKey); // Obtiene permisos del cache
        
        if (cachedPermissions != null) { // Si hay permisos en cache
            boolean hasPermission = cachedPermissions.contains(action); // Verifica si tiene permiso
            
            // RESULTADO ESPERADO: Permiso verificado desde cache
            return hasPermission; // Retorna resultado
        }
        
        // Verificar permisos en ACL
        ObjectIdentity oid = new ObjectIdentityImpl("Resource", resourceId); // Crea identidad del objeto
        Acl acl = aclService.readAclById(oid); // Lee ACL del objeto
        
        if (acl == null) { // Si no hay ACL
            logSecurityViolation("No ACL found for resource: " + resourceId, auth); // Log de violación
            return false; // Retorna false
        }
        
        // Verificar permisos específicos
        boolean hasPermission = acl.isGranted( // Verifica si tiene permiso
            List.of(BasePermission.valueOf(action.toUpperCase())), // Lista de permisos
            List.of((Sid) auth.getPrincipal()), // Lista de SIDs
            false // No heredar permisos
        );
        
        // Actualizar cache
        if (hasPermission) { // Si tiene permiso
            userPermissionsCache.put(cacheKey, List.of(action)); // Actualiza cache
        }
        
        // RESULTADO ESPERADO: Permiso verificado desde ACL
        return hasPermission; // Retorna resultado
    }
    
    // Método para verificar acceso basado en roles
    public boolean checkRoleBasedAccess(String resource, String action) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Obtiene autenticación
        
        // Mapeo de recursos a roles requeridos
        java.util.Map<String, String> resourceRoleMap = java.util.Map.of( // Mapa de recursos a roles
            "admin-panel", "ROLE_ADMIN", // Panel de admin requiere rol ADMIN
            "user-data", "ROLE_USER", // Datos de usuario requiere rol USER
            "financial-data", "ROLE_FINANCE" // Datos financieros requiere rol FINANCE
        );
        
        String requiredRole = resourceRoleMap.get(resource); // Obtiene rol requerido
        if (requiredRole == null) { // Si no hay rol requerido
            logSecurityViolation("Unknown resource: " + resource, auth); // Log de violación
            return false; // Retorna false
        }
        
        boolean hasRole = auth.getAuthorities().stream() // Stream de autoridades
            .anyMatch(authority -> authority.getAuthority().equals(requiredRole)); // Verifica si tiene rol
        
        if (!hasRole) { // Si no tiene rol
            logSecurityViolation("Access denied: Required role " + requiredRole + " for resource " + resource, auth); // Log de violación
        }
        
        // RESULTADO ESPERADO: Acceso verificado basado en roles
        return hasRole; // Retorna resultado
    }
    
    // Método para verificar acceso basado en atributos
    public boolean checkAttributeBasedAccess(String resource, String action, java.util.Map<String, Object> attributes) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Obtiene autenticación
        
        // Verificar atributos específicos
        if (attributes.containsKey("department")) { // Si tiene atributo department
            String userDepartment = getUserDepartment(auth.getName()); // Obtiene departamento del usuario
            String resourceDepartment = (String) attributes.get("department"); // Obtiene departamento del recurso
            
            if (!userDepartment.equals(resourceDepartment)) { // Si no coincide
                logSecurityViolation("Access denied: Department mismatch for resource " + resource, auth); // Log de violación
                return false; // Retorna false
            }
        }
        
        if (attributes.containsKey("location")) { // Si tiene atributo location
            String userLocation = getUserLocation(auth.getName()); // Obtiene ubicación del usuario
            String resourceLocation = (String) attributes.get("location"); // Obtiene ubicación del recurso
            
            if (!userLocation.equals(resourceLocation)) { // Si no coincide
                logSecurityViolation("Access denied: Location mismatch for resource " + resource, auth); // Log de violación
                return false; // Retorna false
            }
        }
        
        // RESULTADO ESPERADO: Acceso verificado basado en atributos
        return true; // Retorna true
    }
    
    // Método para limpiar cache de permisos
    public void clearPermissionsCache() {
        userPermissionsCache.clear(); // Limpia cache
        
        // RESULTADO ESPERADO: Cache de permisos limpiado
    }
    
    // Métodos auxiliares
    private String getUserDepartment(String username) {
        // Implementación para obtener departamento del usuario
        return "IT"; // Placeholder
    }
    
    private String getUserLocation(String username) {
        // Implementación para obtener ubicación del usuario
        return "HQ"; // Placeholder
    }
    
    private void logSecurityViolation(String message, Authentication auth) {
        // Log de violación de seguridad
        System.err.println("SECURITY VIOLATION: " + message + " - User: " + 
            (auth != null ? auth.getName() : "Unknown")); // Imprime violación
    }
}
```

### A02:2021 - Cryptographic Failures

```java
// CryptographicService.java - Servicio de criptografía avanzado
package com.example.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Service // Marca como servicio de Spring
public class CryptographicService {
    
    @Value("${crypto.algorithm:AES}") // Algoritmo de cifrado
    private String algorithm; // Algoritmo (AES, RSA, etc.)
    
    @Value("${crypto.key.size:256}") // Tamaño de clave
    private int keySize; // Tamaño de clave en bits
    
    @Value("${crypto.gcm.tag.length:128}") // Longitud del tag GCM
    private int gcmTagLength; // Longitud del tag GCM en bits
    
    private final SecureRandom secureRandom = new SecureRandom(); // Generador de números aleatorios seguros
    
    // Método para generar clave AES
    public String generateAESKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES"); // Obtiene generador de claves AES
        keyGen.init(keySize, secureRandom); // Inicializa con tamaño de clave y random seguro
        SecretKey secretKey = keyGen.generateKey(); // Genera clave secreta
        
        // RESULTADO ESPERADO: Clave AES generada en Base64
        return Base64.getEncoder().encodeToString(secretKey.getEncoded()); // Retorna clave en Base64
    }
    
    // Método para cifrar datos con AES-GCM
    public String encryptAESGCM(String plaintext, String keyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64); // Decodifica clave Base64
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES"); // Crea clave secreta
        
        // Generar IV (Initialization Vector)
        byte[] iv = new byte[12]; // IV de 12 bytes para GCM
        secureRandom.nextBytes(iv); // Llena IV con bytes aleatorios
        
        // Configurar cipher
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding"); // Obtiene cipher AES-GCM
        GCMParameterSpec gcmSpec = new GCMParameterSpec(gcmTagLength, iv); // Crea parámetros GCM
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec); // Inicializa cipher en modo cifrado
        
        // Cifrar datos
        byte[] ciphertext = cipher.doFinal(plaintext.getBytes("UTF-8")); // Cifra texto plano
        
        // Combinar IV y ciphertext
        byte[] encryptedData = new byte[iv.length + ciphertext.length]; // Crea array para datos cifrados
        System.arraycopy(iv, 0, encryptedData, 0, iv.length); // Copia IV
        System.arraycopy(ciphertext, 0, encryptedData, iv.length, ciphertext.length); // Copia ciphertext
        
        // RESULTADO ESPERADO: Datos cifrados en Base64
        return Base64.getEncoder().encodeToString(encryptedData); // Retorna datos cifrados en Base64
    }
    
    // Método para descifrar datos con AES-GCM
    public String decryptAESGCM(String encryptedDataBase64, String keyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64); // Decodifica clave Base64
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES"); // Crea clave secreta
        
        // Decodificar datos cifrados
        byte[] encryptedData = Base64.getDecoder().decode(encryptedDataBase64); // Decodifica datos Base64
        
        // Extraer IV y ciphertext
        byte[] iv = new byte[12]; // IV de 12 bytes
        byte[] ciphertext = new byte[encryptedData.length - 12]; // Ciphertext (resto de bytes)
        System.arraycopy(encryptedData, 0, iv, 0, 12); // Copia IV
        System.arraycopy(encryptedData, 12, ciphertext, 0, ciphertext.length); // Copia ciphertext
        
        // Configurar cipher
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding"); // Obtiene cipher AES-GCM
        GCMParameterSpec gcmSpec = new GCMParameterSpec(gcmTagLength, iv); // Crea parámetros GCM
        cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec); // Inicializa cipher en modo descifrado
        
        // Descifrar datos
        byte[] plaintextBytes = cipher.doFinal(ciphertext); // Descifra ciphertext
        
        // RESULTADO ESPERADO: Texto plano descifrado
        return new String(plaintextBytes, "UTF-8"); // Retorna texto plano
    }
    
    // Método para generar hash seguro
    public String generateSecureHash(String input, String salt) throws Exception {
        java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256"); // Obtiene digest SHA-256
        
        // Combinar input y salt
        String combined = input + salt; // Combina input y salt
        byte[] hashBytes = digest.digest(combined.getBytes("UTF-8")); // Genera hash
        
        // RESULTADO ESPERADO: Hash seguro en Base64
        return Base64.getEncoder().encodeToString(hashBytes); // Retorna hash en Base64
    }
    
    // Método para generar salt seguro
    public String generateSecureSalt() {
        byte[] salt = new byte[32]; // Salt de 32 bytes
        secureRandom.nextBytes(salt); // Llena salt con bytes aleatorios
        
        // RESULTADO ESPERADO: Salt seguro en Base64
        return Base64.getEncoder().encodeToString(salt); // Retorna salt en Base64
    }
    
    // Método para verificar integridad de datos
    public boolean verifyDataIntegrity(String data, String expectedHash, String salt) throws Exception {
        String actualHash = generateSecureHash(data, salt); // Genera hash actual
        
        // RESULTADO ESPERADO: true si los hashes coinciden
        return actualHash.equals(expectedHash); // Retorna comparación de hashes
    }
}
```

---

## 🔧 Implementación de Contramedidas

### Servicio de Prevención de Ataques

```java
// AttackPreventionService.java - Servicio de prevención de ataques
package com.example.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service // Marca como servicio de Spring
public class AttackPreventionService {
    
    @Autowired
    private SecurityLoggingService loggingService; // Inyecta servicio de logging
    
    // Cache para tracking de ataques
    private final ConcurrentHashMap<String, AttackTracker> attackTrackers = new ConcurrentHashMap<>(); // Cache de trackers de ataques
    
    // Configuración de límites
    private static final int MAX_LOGIN_ATTEMPTS = 5; // Máximo intentos de login
    private static final int MAX_REQUESTS_PER_MINUTE = 100; // Máximo requests por minuto
    private static final int BLOCK_DURATION_MINUTES = 15; // Duración del bloqueo en minutos
    
    // Método para prevenir ataques de fuerza bruta
    public boolean checkBruteForceProtection(String username, String ipAddress) {
        String key = username + ":" + ipAddress; // Clave única para tracking
        AttackTracker tracker = attackTrackers.computeIfAbsent(key, k -> new AttackTracker()); // Obtiene o crea tracker
        
        // Verificar si está bloqueado
        if (tracker.isBlocked()) { // Si está bloqueado
            loggingService.logSecurityWarning("Brute force attempt blocked", 
                "User: " + username + ", IP: " + ipAddress + ", Blocked until: " + tracker.getBlockUntil()); // Log de bloqueo
            
            // RESULTADO ESPERADO: false - Acceso bloqueado
            return false; // Retorna false
        }
        
        // Incrementar contador de intentos
        int attempts = tracker.incrementAttempts(); // Incrementa intentos
        
        if (attempts > MAX_LOGIN_ATTEMPTS) { // Si excede límite
            tracker.block(BLOCK_DURATION_MINUTES); // Bloquea por duración especificada
            loggingService.logSecurityAlert("Brute force attack detected", 
                "User: " + username + ", IP: " + ipAddress + ", Attempts: " + attempts); // Log de alerta
            
            // RESULTADO ESPERADO: false - Usuario bloqueado
            return false; // Retorna false
        }
        
        // RESULTADO ESPERADO: true - Acceso permitido
        return true; // Retorna true
    }
    
    // Método para prevenir ataques de rate limiting
    public boolean checkRateLimit(String ipAddress) {
        AttackTracker tracker = attackTrackers.computeIfAbsent(ipAddress, k -> new AttackTracker()); // Obtiene o crea tracker
        
        // Verificar si está bloqueado
        if (tracker.isBlocked()) { // Si está bloqueado
            loggingService.logSecurityWarning("Rate limit exceeded", 
                "IP: " + ipAddress + ", Blocked until: " + tracker.getBlockUntil()); // Log de bloqueo
            
            // RESULTADO ESPERADO: false - Rate limit excedido
            return false; // Retorna false
        }
        
        // Verificar requests por minuto
        int requestsThisMinute = tracker.getRequestsThisMinute(); // Obtiene requests del minuto actual
        
        if (requestsThisMinute > MAX_REQUESTS_PER_MINUTE) { // Si excede límite
            tracker.block(BLOCK_DURATION_MINUTES); // Bloquea por duración especificada
            loggingService.logSecurityAlert("Rate limit attack detected", 
                "IP: " + ipAddress + ", Requests: " + requestsThisMinute); // Log de alerta
            
            // RESULTADO ESPERADO: false - Rate limit excedido
            return false; // Retorna false
        }
        
        // Incrementar contador de requests
        tracker.incrementRequests(); // Incrementa requests
        
        // RESULTADO ESPERADO: true - Rate limit OK
        return true; // Retorna true
    }
    
    // Método para prevenir ataques de inyección SQL
    public boolean validateSQLInput(String input) {
        if (input == null) { // Si input es null
            return true; // Retorna true
        }
        
        // Patrones de SQL Injection
        String[] sqlPatterns = { // Array de patrones SQL maliciosos
            "union", "select", "insert", "update", "delete", "drop", "create", "alter", 
            "exec", "execute", "script", "javascript", "vbscript", "xp_", "sp_"
        };
        
        String lowerInput = input.toLowerCase(); // Convierte a minúsculas
        
        for (String pattern : sqlPatterns) { // Itera sobre patrones
            if (lowerInput.contains(pattern)) { // Si contiene patrón
                HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest(); // Obtiene request
                
                loggingService.logSecurityAlert("SQL injection attempt detected", 
                    "Input: " + input + ", Pattern: " + pattern + ", IP: " + request.getRemoteAddr()); // Log de alerta
                
                // RESULTADO ESPERADO: false - Input contiene SQL malicioso
                return false; // Retorna false
            }
        }
        
        // RESULTADO ESPERADO: true - Input válido
        return true; // Retorna true
    }
    
    // Método para prevenir ataques XSS
    public String sanitizeXSS(String input) {
        if (input == null) { // Si input es null
            return null; // Retorna null
        }
        
        // Sanitizar caracteres especiales
        return input.replaceAll("<", "&lt;") // Reemplaza < con &lt;
                   .replaceAll(">", "&gt;") // Reemplaza > con &gt;
                   .replaceAll("\"", "&quot;") // Reemplaza " con &quot;
                   .replaceAll("'", "&#x27;") // Reemplaza ' con &#x27;
                   .replaceAll("&", "&amp;") // Reemplaza & con &amp;
                   .replaceAll("javascript:", "") // Remueve javascript:
                   .replaceAll("vbscript:", "") // Remueve vbscript:
                   .replaceAll("onload=", "") // Remueve onload=
                   .replaceAll("onerror=", "") // Remueve onerror=
                   .replaceAll("onclick=", "") // Remueve onclick=
                   .replaceAll("onmouseover=", ""); // Remueve onmouseover=
        
        // RESULTADO ESPERADO: Input sanitizado contra XSS
    }
    
    // Método para resetear contadores
    public void resetCounters(String key) {
        AttackTracker tracker = attackTrackers.get(key); // Obtiene tracker
        if (tracker != null) { // Si existe tracker
            tracker.reset(); // Resetea tracker
        }
        
        // RESULTADO ESPERADO: Contadores reseteados
    }
    
    // Clase interna para tracking de ataques
    private static class AttackTracker {
        private final AtomicInteger attempts = new AtomicInteger(0); // Contador de intentos
        private final AtomicInteger requests = new AtomicInteger(0); // Contador de requests
        private LocalDateTime lastRequestTime = LocalDateTime.now(); // Tiempo del último request
        private LocalDateTime blockUntil = null; // Tiempo hasta el que está bloqueado
        
        public int incrementAttempts() {
            return attempts.incrementAndGet(); // Incrementa intentos
        }
        
        public int incrementRequests() {
            // Resetear contador si ha pasado un minuto
            LocalDateTime now = LocalDateTime.now(); // Tiempo actual
            if (ChronoUnit.MINUTES.between(lastRequestTime, now) >= 1) { // Si ha pasado un minuto
                requests.set(0); // Resetea contador
                lastRequestTime = now; // Actualiza tiempo
            }
            
            return requests.incrementAndGet(); // Incrementa requests
        }
        
        public int getRequestsThisMinute() {
            // Resetear contador si ha pasado un minuto
            LocalDateTime now = LocalDateTime.now(); // Tiempo actual
            if (ChronoUnit.MINUTES.between(lastRequestTime, now) >= 1) { // Si ha pasado un minuto
                requests.set(0); // Resetea contador
                lastRequestTime = now; // Actualiza tiempo
            }
            
            return requests.get(); // Retorna requests
        }
        
        public void block(int minutes) {
            blockUntil = LocalDateTime.now().plusMinutes(minutes); // Establece tiempo de bloqueo
        }
        
        public boolean isBlocked() {
            if (blockUntil == null) { // Si no está bloqueado
                return false; // Retorna false
            }
            
            boolean blocked = LocalDateTime.now().isBefore(blockUntil); // Verifica si está bloqueado
            
            if (!blocked) { // Si ya no está bloqueado
                blockUntil = null; // Limpia bloqueo
                attempts.set(0); // Resetea intentos
                requests.set(0); // Resetea requests
            }
            
            return blocked; // Retorna estado de bloqueo
        }
        
        public LocalDateTime getBlockUntil() {
            return blockUntil; // Retorna tiempo de bloqueo
        }
        
        public void reset() {
            attempts.set(0); // Resetea intentos
            requests.set(0); // Resetea requests
            blockUntil = null; // Limpia bloqueo
        }
    }
}
```

---

## 📊 Predicciones de Resultados

### Resultados Esperados por Funcionalidad

| Funcionalidad | Resultado Esperado | Indicadores de Éxito |
|---------------|-------------------|---------------------|
| **Control de Acceso** | Acceso controlado | Permisos verificados, violaciones bloqueadas |
| **Criptografía** | Datos protegidos | Claves generadas, datos cifrados/descifrados |
| **Prevención de Ataques** | Ataques bloqueados | Intentos limitados, IPs bloqueadas |
| **Validación de Input** | Input sanitizado | XSS prevenido, SQL injection bloqueado |
| **Logging de Seguridad** | Eventos registrados | Logs generados, alertas enviadas |
| **Monitoreo** | Actividad monitoreada | Métricas calculadas, anomalías detectadas |

### Métricas de Seguridad

```java
// SecurityMetricsService.java - Métricas de seguridad
package com.example.security;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service // Marca como servicio de Spring
public class SecurityMetricsService {
    
    // Contadores de métricas
    private final AtomicLong totalRequests = new AtomicLong(0); // Contador total de requests
    private final AtomicLong blockedRequests = new AtomicLong(0); // Contador de requests bloqueados
    private final AtomicLong securityViolations = new AtomicLong(0); // Contador de violaciones
    private final AtomicLong successfulLogins = new AtomicLong(0); // Contador de logins exitosos
    private final AtomicLong failedLogins = new AtomicLong(0); // Contador de logins fallidos
    
    // Método para registrar request
    public void recordRequest(boolean blocked) {
        totalRequests.incrementAndGet(); // Incrementa total de requests
        
        if (blocked) { // Si fue bloqueado
            blockedRequests.incrementAndGet(); // Incrementa requests bloqueados
        }
    }
    
    // Método para registrar violación de seguridad
    public void recordSecurityViolation() {
        securityViolations.incrementAndGet(); // Incrementa violaciones
    }
    
    // Método para registrar login
    public void recordLogin(boolean successful) {
        if (successful) { // Si fue exitoso
            successfulLogins.incrementAndGet(); // Incrementa logins exitosos
        } else { // Si falló
            failedLogins.incrementAndGet(); // Incrementa logins fallidos
        }
    }
    
    // Método para obtener métricas
    public SecurityMetrics getMetrics() {
        SecurityMetrics metrics = new SecurityMetrics(); // Crea objeto de métricas
        
        long total = totalRequests.get(); // Obtiene total de requests
        long blocked = blockedRequests.get(); // Obtiene requests bloqueados
        
        metrics.setTotalRequests(total); // Establece total de requests
        metrics.setBlockedRequests(blocked); // Establece requests bloqueados
        metrics.setSecurityViolations(securityViolations.get()); // Establece violaciones
        metrics.setSuccessfulLogins(successfulLogins.get()); // Establece logins exitosos
        metrics.setFailedLogins(failedLogins.get()); // Establece logins fallidos
        
        // Calcular tasas
        if (total > 0) { // Si hay requests
            metrics.setBlockRate((double) blocked / total * 100); // Calcula tasa de bloqueo
        }
        
        long totalLogins = successfulLogins.get() + failedLogins.get(); // Total de logins
        if (totalLogins > 0) { // Si hay logins
            metrics.setLoginSuccessRate((double) successfulLogins.get() / totalLogins * 100); // Calcula tasa de éxito
        }
        
        // RESULTADO ESPERADO: Métricas calculadas
        return metrics; // Retorna métricas
    }
}

// SecurityMetrics.java - Modelo de métricas de seguridad
package com.example.model;

public class SecurityMetrics {
    private long totalRequests; // Total de requests
    private long blockedRequests; // Requests bloqueados
    private long securityViolations; // Violaciones de seguridad
    private long successfulLogins; // Logins exitosos
    private long failedLogins; // Logins fallidos
    private double blockRate; // Tasa de bloqueo
    private double loginSuccessRate; // Tasa de éxito de login
    
    // Getters y setters
    public long getTotalRequests() { return totalRequests; } // Getter para total de requests
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; } // Setter para total de requests
    
    public long getBlockedRequests() { return blockedRequests; } // Getter para requests bloqueados
    public void setBlockedRequests(long blockedRequests) { this.blockedRequests = blockedRequests; } // Setter para requests bloqueados
    
    public long getSecurityViolations() { return securityViolations; } // Getter para violaciones
    public void setSecurityViolations(long securityViolations) { this.securityViolations = securityViolations; } // Setter para violaciones
    
    public long getSuccessfulLogins() { return successfulLogins; } // Getter para logins exitosos
    public void setSuccessfulLogins(long successfulLogins) { this.successfulLogins = successfulLogins; } // Setter para logins exitosos
    
    public long getFailedLogins() { return failedLogins; } // Getter para logins fallidos
    public void setFailedLogins(long failedLogins) { this.failedLogins = failedLogins; } // Setter para logins fallidos
    
    public double getBlockRate() { return blockRate; } // Getter para tasa de bloqueo
    public void setBlockRate(double blockRate) { this.blockRate = blockRate; } // Setter para tasa de bloqueo
    
    public double getLoginSuccessRate() { return loginSuccessRate; } // Getter para tasa de éxito de login
    public void setLoginSuccessRate(double loginSuccessRate) { this.loginSuccessRate = loginSuccessRate; } // Setter para tasa de éxito de login
}
```

---

**¡Implementar estos estándares OWASP te hará un experto en seguridad web! 🚀** 