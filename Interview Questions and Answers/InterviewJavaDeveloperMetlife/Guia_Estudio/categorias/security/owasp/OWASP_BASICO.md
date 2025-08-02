# 🛡️ OWASP - Guía Básica para Principiantes

## 📋 Índice

1. [¿Qué es OWASP?](#qué-es-owasp)
2. [Conceptos Básicos de Seguridad Web](#conceptos-básicos-de-seguridad-web)
3. [OWASP Top 10 Simplificado](#owasp-top-10-simplificado)
4. [Primeros Pasos](#primeros-pasos)
5. [Ejemplos Prácticos Básicos](#ejemplos-prácticos-básicos)

---

## 🤔 ¿Qué es OWASP?

### Definición Simple
OWASP (Open Web Application Security Project) es una organización que ayuda a hacer las aplicaciones web más seguras.

**¿Por qué es importante?**
- Las aplicaciones web tienen vulnerabilidades que los hackers pueden explotar
- OWASP nos enseña cómo proteger nuestras aplicaciones
- Es un estándar reconocido mundialmente

### Analogía Simple
Imagina que tu aplicación web es como una casa:
- **OWASP** es como un manual de seguridad para tu casa
- **Las vulnerabilidades** son como puertas o ventanas sin cerrar
- **Los hackers** son como ladrones que buscan entrar
- **Las contramedidas** son como cerraduras, alarmas y sistemas de seguridad

---

## 🔒 Conceptos Básicos de Seguridad Web

### 1. Autenticación vs Autorización

**Autenticación (¿Quién eres?)**
```java
// Ejemplo básico de autenticación
public boolean login(String username, String password) {
    // Verificar si el usuario existe
    if (username.equals("admin") && password.equals("123456")) {
        return true; // Usuario autenticado
    }
    return false; // Autenticación fallida
}
```

**Autorización (¿Qué puedes hacer?)**
```java
// Ejemplo básico de autorización
public boolean canAccessAdminPanel(String username) {
    if (username.equals("admin")) {
        return true; // Puede acceder al panel de admin
    }
    return false; // No tiene permisos
}
```

### 2. Input vs Output

**Input (Datos que entran)**
```java
// Ejemplo de input del usuario
String userInput = request.getParameter("search"); // Lo que el usuario escribe
```

**Output (Datos que salen)**
```java
// Ejemplo de output hacia el usuario
response.getWriter().write("Resultado: " + userInput); // Lo que mostramos al usuario
```

### 3. Validación vs Sanitización

**Validación (¿Es correcto?)**
```java
// Ejemplo básico de validación
public boolean isValidEmail(String email) {
    // Verificar si tiene formato de email
    return email.contains("@") && email.contains(".");
}
```

**Sanitización (Limpiar datos)**
```java
// Ejemplo básico de sanitización
public String sanitizeInput(String input) {
    // Remover caracteres peligrosos
    return input.replace("<", "&lt;")
                .replace(">", "&gt;");
}
```

---

## 🎯 OWASP Top 10 Simplificado

### 1. Broken Access Control (Control de Acceso Roto)
**Problema**: Los usuarios pueden acceder a recursos que no deberían.

**Ejemplo Malo:**
```java
// ❌ MALO - Sin verificación de permisos
public void deleteUser(int userId) {
    // Cualquier usuario puede eliminar cualquier cuenta
    database.deleteUser(userId);
}
```

**Ejemplo Bueno:**
```java
// ✅ BUENO - Con verificación de permisos
public void deleteUser(int userId, String currentUser) {
    // Solo el propietario puede eliminar su cuenta
    if (isOwner(userId, currentUser) || isAdmin(currentUser)) {
        database.deleteUser(userId);
    } else {
        throw new SecurityException("No tienes permisos");
    }
}
```

### 2. Cryptographic Failures (Fallos Criptográficos)
**Problema**: Los datos sensibles no están protegidos.

**Ejemplo Malo:**
```java
// ❌ MALO - Contraseña en texto plano
public void savePassword(String password) {
    database.save("password", password); // Sin encriptar
}
```

**Ejemplo Bueno:**
```java
// ✅ BUENO - Contraseña encriptada
public void savePassword(String password) {
    String encryptedPassword = encryptPassword(password);
    database.save("password", encryptedPassword);
}

private String encryptPassword(String password) {
    // Usar algoritmo seguro como BCrypt
    return BCrypt.hashpw(password, BCrypt.gensalt());
}
```

### 3. Injection (Inyección)
**Problema**: Los atacantes pueden insertar código malicioso.

**Ejemplo Malo (SQL Injection):**
```java
// ❌ MALO - Vulnerable a SQL Injection
public List<User> searchUsers(String searchTerm) {
    String query = "SELECT * FROM users WHERE name = '" + searchTerm + "'";
    return database.executeQuery(query);
}
// Si searchTerm = "'; DROP TABLE users; --"
// Resultado: "SELECT * FROM users WHERE name = ''; DROP TABLE users; --'"
```

**Ejemplo Bueno:**
```java
// ✅ BUENO - Usando Prepared Statements
public List<User> searchUsers(String searchTerm) {
    String query = "SELECT * FROM users WHERE name = ?";
    PreparedStatement stmt = connection.prepareStatement(query);
    stmt.setString(1, searchTerm);
    return stmt.executeQuery();
}
```

### 4. Insecure Design (Diseño Inseguro)
**Problema**: La aplicación no está diseñada pensando en la seguridad.

**Ejemplo Malo:**
```java
// ❌ MALO - Diseño inseguro
public class User {
    public String password; // Contraseña visible
    public String creditCard; // Tarjeta de crédito sin encriptar
}
```

**Ejemplo Bueno:**
```java
// ✅ BUENO - Diseño seguro
public class User {
    private String passwordHash; // Solo el hash
    private String encryptedCreditCard; // Encriptado
    private String salt; // Salt para mayor seguridad
    
    // Getters seguros
    public String getPasswordHash() { return passwordHash; }
    public String getEncryptedCreditCard() { return encryptedCreditCard; }
}
```

---

## 🚀 Primeros Pasos

### 1. Configuración Básica de Seguridad

```java
// SecurityConfig.java - Configuración básica
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Configuración básica
            .authorizeRequests()
                .antMatchers("/public/**").permitAll() // Páginas públicas
                .antMatchers("/admin/**").hasRole("ADMIN") // Solo admins
                .anyRequest().authenticated() // Resto requiere login
            .and()
            .formLogin() // Formulario de login
            .and()
            .logout(); // Logout automático
        
        return http.build();
    }
}
```

### 2. Validación Básica de Input

```java
// ValidationService.java - Validación básica
@Service
public class ValidationService {
    
    // Validar email
    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        
        // Patrón básico de email
        String emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailPattern);
    }
    
    // Validar contraseña
    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Debe tener al menos una letra y un número
        boolean hasLetter = password.matches(".*[a-zA-Z].*");
        boolean hasNumber = password.matches(".*\\d.*");
        
        return hasLetter && hasNumber;
    }
    
    // Sanitizar input básico
    public String sanitizeInput(String input) {
        if (input == null) {
            return "";
        }
        
        // Remover caracteres peligrosos básicos
        return input.replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#x27;");
    }
}
```

### 3. Logging Básico de Seguridad

```java
// SecurityLogger.java - Logging básico
@Component
public class SecurityLogger {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityLogger.class);
    
    // Log de login exitoso
    public void logSuccessfulLogin(String username, String ip) {
        logger.info("Login exitoso - Usuario: {}, IP: {}", username, ip);
    }
    
    // Log de login fallido
    public void logFailedLogin(String username, String ip) {
        logger.warn("Login fallido - Usuario: {}, IP: {}", username, ip);
    }
    
    // Log de acceso denegado
    public void logAccessDenied(String username, String resource) {
        logger.warn("Acceso denegado - Usuario: {}, Recurso: {}", username, resource);
    }
}
```

---

## 💡 Ejemplos Prácticos Básicos

### 1. Formulario de Login Seguro

```html
<!-- login.html - Formulario básico seguro -->
<form action="/login" method="POST">
    <input type="text" name="username" placeholder="Usuario" required>
    <input type="password" name="password" placeholder="Contraseña" required>
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    <button type="submit">Iniciar Sesión</button>
</form>
```

```java
// LoginController.java - Controlador básico
@Controller
public class LoginController {
    
    @Autowired
    private ValidationService validationService;
    
    @Autowired
    private SecurityLogger securityLogger;
    
    @PostMapping("/login")
    public String login(@RequestParam String username, 
                       @RequestParam String password,
                       HttpServletRequest request) {
        
        // Validar input
        if (!validationService.isValidUsername(username)) {
            securityLogger.logFailedLogin(username, request.getRemoteAddr());
            return "redirect:/login?error=invalid";
        }
        
        // Intentar autenticación
        try {
            // Lógica de autenticación
            if (authenticateUser(username, password)) {
                securityLogger.logSuccessfulLogin(username, request.getRemoteAddr());
                return "redirect:/dashboard";
            } else {
                securityLogger.logFailedLogin(username, request.getRemoteAddr());
                return "redirect:/login?error=invalid";
            }
        } catch (Exception e) {
            securityLogger.logFailedLogin(username, request.getRemoteAddr());
            return "redirect:/login?error=system";
        }
    }
    
    private boolean authenticateUser(String username, String password) {
        // Implementación básica de autenticación
        return "admin".equals(username) && "password123".equals(password);
    }
}
```

### 2. API Básica Segura

```java
// UserController.java - API básica segura
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private ValidationService validationService;
    
    // Obtener usuario (solo el propio usuario)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id, 
                                      Authentication auth) {
        
        // Verificar que el usuario accede a sus propios datos
        if (!auth.getName().equals(id.toString())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
        
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                         @RequestBody User user,
                                         Authentication auth) {
        
        // Verificar permisos
        if (!auth.getName().equals(id.toString())) {
            return ResponseEntity.status(403).build();
        }
        
        // Validar datos
        if (!validationService.isValidEmail(user.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        
        // Sanitizar datos
        user.setName(validationService.sanitizeInput(user.getName()));
        
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }
}
```

### 3. Configuración de Headers Básica

```java
// WebSecurityConfig.java - Headers básicos
@Configuration
public class WebSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Headers de seguridad básicos
            .headers()
                .frameOptions().deny() // Prevenir clickjacking
                .contentTypeOptions().and() // Prevenir MIME sniffing
                .xssProtection().and() // Protección XSS básica
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000) // 1 año
                    .includeSubdomains(true)
                )
            .and()
            // Configuración CSRF
            .csrf()
                .ignoringAntMatchers("/api/public/**") // Ignorar APIs públicas
            .and()
            // Configuración de sesiones
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1) // Una sesión por usuario
                .expiredUrl("/login?expired");
        
        return http.build();
    }
}
```

---

## 📚 Recursos para Aprender Más

### Libros Recomendados:
- "Web Application Security" por Andrew Hoffman
- "The Web Application Hacker's Handbook" por Dafydd Stuttard

### Sitios Web:
- [OWASP.org](https://owasp.org) - Sitio oficial
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) - Guías rápidas
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) - Aplicación para practicar

### Herramientas para Practicar:
- **OWASP ZAP** - Herramienta gratuita para testing de seguridad
- **Burp Suite Community** - Proxy para testing de aplicaciones web
- **SQLMap** - Herramienta para detectar SQL Injection

---

## 🎯 Checklist de Nivel Básico

### Conceptos que debes entender:
- [ ] ¿Qué es OWASP y por qué es importante?
- [ ] Diferencia entre autenticación y autorización
- [ ] Qué es input validation y sanitization
- [ ] Conceptos básicos de las 10 vulnerabilidades principales
- [ ] Cómo implementar validación básica de formularios
- [ ] Cómo configurar headers de seguridad básicos
- [ ] Cómo hacer logging de eventos de seguridad

### Habilidades prácticas:
- [ ] Crear un formulario de login seguro
- [ ] Implementar validación de input básica
- [ ] Configurar Spring Security básico
- [ ] Usar Prepared Statements para prevenir SQL Injection
- [ ] Implementar logging de seguridad básico
- [ ] Configurar headers de seguridad HTTP

---

**¡Con estos conceptos básicos ya tienes una base sólida para avanzar al nivel intermedio! 🚀** 