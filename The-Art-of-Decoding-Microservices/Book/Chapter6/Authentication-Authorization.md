# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Autenticación y Autorización

### Introducción
La autenticación y autorización son pilares fundamentales en la seguridad de microservicios. La **autenticación** verifica la identidad del usuario, mientras que la **autorización** determina los permisos que tiene ese usuario sobre los recursos del sistema. En arquitecturas modernas, es común utilizar **JWT (JSON Web Token)** y frameworks como **Spring Security** para implementar estos mecanismos de manera robusta y escalable.

---

### Ejemplo Práctico: Autenticación y Autorización con Spring Boot y JWT

A continuación, se muestra un ejemplo completo de cómo implementar autenticación y autorización en un microservicio usando Spring Boot y JWT. El código está comentado línea por línea para facilitar su comprensión.

#### Dependencias necesarias (pom.xml)
```xml
<!-- Dependencias principales para seguridad y JWT -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

#### 1. Modelo de Usuario
```java
// Clase que representa al usuario del sistema
public class Usuario {
    private Long id; // Identificador único
    private String username; // Nombre de usuario
    private String password; // Contraseña (encriptada)
    private String rol; // Rol del usuario (ej: ADMIN, USER)
    // Getters y setters omitidos por brevedad
}
```

---

#### 2. Servicio para Usuarios (UserDetailsService personalizado)
```java
// Servicio que carga los detalles del usuario desde la base de datos
@Service
public class UsuarioDetailsService implements UserDetailsService {
    // Simulación de base de datos en memoria
    private Map<String, Usuario> usuarios = new HashMap<>();

    public UsuarioDetailsService() {
        // Usuario de ejemplo: admin/admin123 con rol ADMIN
        Usuario admin = new Usuario();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
        admin.setRol("ADMIN");
        usuarios.put("admin", admin);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca el usuario por nombre
        Usuario usuario = usuarios.get(username);
        if (usuario == null) {
            // Si no existe, lanza excepción
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
        // Retorna un objeto User de Spring Security
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .roles(usuario.getRol())
                .build();
    }
}
```

---

#### 3. Utilidad para JWT
```java
// Clase utilitaria para generar y validar JWT
@Component
public class JwtUtil {
    private final String SECRET_KEY = "clave-secreta-super-segura"; // Clave secreta para firmar el token

    // Genera un token JWT para el usuario
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", userDetails.getAuthorities().iterator().next().getAuthority());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Extrae el nombre de usuario del token
    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getSubject();
    }

    // Valida si el token es correcto y no ha expirado
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Verifica si el token ha expirado
    private boolean isTokenExpired(String token) {
        final Date expiration = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getExpiration();
        return expiration.before(new Date());
    }
}
```

---

#### 4. Filtro de Autenticación JWT
```java
// Filtro que intercepta las peticiones y valida el JWT
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    @Autowired
    private UsuarioDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        // Obtiene el header Authorization
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // Extrae el token si el header es correcto
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
        }

        // Si hay usuario y no está autenticado aún
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            // Valida el token
            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // Continúa con la cadena de filtros
        chain.doFilter(request, response);
    }
}
```

---

#### 5. Configuración de Seguridad
```java
// Configuración principal de seguridad
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    @Autowired
    private UsuarioDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // Configura el servicio de usuarios y el encoder de contraseñas
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Deshabilita CSRF y permite acceso público a /authenticate
        http.csrf().disable()
            .authorizeRequests().antMatchers("/authenticate").permitAll()
            .anyRequest().authenticated();
        // Añade el filtro JWT antes del filtro de autenticación por usuario y contraseña
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
```

---

#### 6. Controlador de Autenticación
```java
// Controlador REST para autenticación
@RestController
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint para autenticarse y obtener el token
    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            // Autentica el usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            // Si las credenciales son inválidas
            throw new Exception("Credenciales incorrectas", e);
        }
        // Carga los detalles del usuario
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        // Genera el token JWT
        final String jwt = jwtUtil.generateToken(userDetails);
        // Retorna el token
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}

// Clases auxiliares para la petición y respuesta
class AuthRequest {
    private String username;
    private String password;
    // Getters y setters
}
class AuthResponse {
    private String jwt;
    public AuthResponse(String jwt) { this.jwt = jwt; }
    public String getJwt() { return jwt; }
}
```

---

### Pruebas Unitarias (JUnit + Mockito)
```java
// Prueba unitaria para el servicio de usuarios
@SpringBootTest
public class UsuarioDetailsServiceTest {
    @Autowired
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    public void testLoadUserByUsername_UsuarioExiste() {
        // Busca el usuario admin
        UserDetails user = usuarioDetailsService.loadUserByUsername("admin");
        // Verifica que el usuario no sea nulo
        assertNotNull(user);
        // Verifica el nombre de usuario
        assertEquals("admin", user.getUsername());
        // Verifica el rol
        assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    public void testLoadUserByUsername_UsuarioNoExiste() {
        // Espera excepción si el usuario no existe
        assertThrows(UsernameNotFoundException.class, () -> {
            usuarioDetailsService.loadUserByUsername("noexiste");
        });
    }
}
```

---

### Mejoras y Patrones de Diseño
- **Escalabilidad**: Separar el servicio de autenticación en un microservicio independiente (por ejemplo, usando Keycloak o Auth0).
- **Patrón Sidecar**: Implementar un sidecar para manejar la autenticación y autorización fuera del proceso principal.
- **Token Refresh**: Añadir endpoints para refrescar el token JWT.
- **Auditoría**: Registrar todos los intentos de autenticación y acceso a recursos sensibles.

---

### Resultados Esperados y Manejo de Errores

#### Escenario de Éxito
- **Entrada:**
    ```json
    POST /authenticate
    {
        "username": "admin",
        "password": "admin123"
    }
    ```
- **Resultado esperado:**
    ```json
    HTTP 200 OK
    {
        "jwt": "eyJhbGciOiJIUzI1NiJ9..."
    }
    ```
- **Lógica ejecutada:**
    - ✅ Validación de credenciales
    - ✅ Generación de JWT
    - ✅ Respuesta con token

#### Escenario de Error (Credenciales incorrectas)
- **Entrada:**
    ```json
    POST /authenticate
    {
        "username": "admin",
        "password": "incorrecto"
    }
    ```
- **Resultado esperado:**
    ```json
    HTTP 403 Forbidden
    {
        "error": "Credenciales incorrectas"
    }
    ```
- **Lógica ejecutada:**
    - ❌ Validación de credenciales
    - ❌ No se genera JWT
    - ✅ Respuesta de error

#### Escenario de Error (Token expirado o inválido)
- **Entrada:**
    ```http
    GET /api/usuarios
    Authorization: Bearer token_invalido_o_expirado
    ```
- **Resultado esperado:**
    ```json
    HTTP 401 Unauthorized
    {
        "error": "Token inválido o expirado"
    }
    ```
- **Lógica ejecutada:**
    - ❌ Validación de token
    - ✅ Respuesta de error

---

### Explicación Detallada
Este ejemplo muestra cómo proteger endpoints REST usando JWT y Spring Security. El filtro intercepta cada petición, valida el token y, si es válido, permite el acceso. Si el token es inválido o las credenciales son incorrectas, se retorna un error adecuado. Este patrón es escalable y desacoplado, ideal para microservicios.

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, Control de Acceso o Seguridad en la Comunicación)? 