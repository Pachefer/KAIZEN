# 🔐 LDAP - Guía Completa de Autenticación y Autorización

## 📋 Índice

1. [Configuración Básica](#configuración-básica)
2. [Autenticación LDAP](#autenticación-ldap)
3. [Integración con Spring Security](#integración-con-spring-security)
4. [Configuración Avanzada](#configuración-avanzada)
5. [Troubleshooting](#troubleshooting)

---

## ⚙️ Configuración Básica

### Configuración de LDAP Server

```java
// LDAPServerConfig.java - Configuración del servidor LDAP
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration // Marca como configuración de Spring
public class LDAPServerConfig {
    
    // Propiedades de conexión LDAP inyectadas desde application.properties
    @Value("${ldap.url}") // URL del servidor LDAP
    private String ldapUrl; // URL del servidor LDAP (ej: ldap://localhost:389)
    
    @Value("${ldap.base}") // DN base del directorio LDAP
    private String ldapBase; // DN base (ej: dc=example,dc=com)
    
    @Value("${ldap.manager.dn}") // DN del usuario manager
    private String managerDn; // DN del usuario manager (ej: cn=admin,dc=example,dc=com)
    
    @Value("${ldap.manager.password}") // Contraseña del usuario manager
    private String managerPassword; // Contraseña del usuario manager
    
    @Value("${ldap.user.search.base}") // Base de búsqueda de usuarios
    private String userSearchBase; // Base de búsqueda de usuarios (ej: ou=users)
    
    @Value("${ldap.user.search.filter}") // Filtro de búsqueda de usuarios
    private String userSearchFilter; // Filtro de búsqueda (ej: (uid={0}))
    
    @Value("${ldap.group.search.base}") // Base de búsqueda de grupos
    private String groupSearchBase; // Base de búsqueda de grupos (ej: ou=groups)
    
    @Value("${ldap.group.search.filter}") // Filtro de búsqueda de grupos
    private String groupSearchFilter; // Filtro de búsqueda de grupos (ej: (member={0}))
    
    // Bean para configuración del contexto LDAP
    @Bean
    public LdapContextSource contextSource() {
        LdapContextSource contextSource = new LdapContextSource(); // Crea contexto LDAP
        
        // Configuración de conexión
        contextSource.setUrl(ldapUrl); // Establece URL del servidor LDAP
        contextSource.setBase(ldapBase); // Establece DN base
        contextSource.setUserDn(managerDn); // Establece DN del usuario manager
        contextSource.setPassword(managerPassword); // Establece contraseña del manager
        
        // Configuración de pool de conexiones
        contextSource.setPooled(true); // Habilita pool de conexiones
        contextSource.setMinEvictableIdleTimeMillis(300000); // 5 minutos
        contextSource.setMaxEvictableIdleTimeMillis(900000); // 15 minutos
        contextSource.setTimeBetweenEvictionRunsMillis(60000); // 1 minuto
        
        // Configuración de timeouts
        contextSource.setBaseEnvironmentProperties(java.util.Map.of(
            "com.sun.jndi.ldap.connect.timeout", "3000", // Timeout de conexión 3s
            "com.sun.jndi.ldap.read.timeout", "3000"     // Timeout de lectura 3s
        ));
        
        // RESULTADO ESPERADO: Contexto LDAP configurado correctamente
        return contextSource; // Retorna contexto configurado
    }
    
    // Bean para template LDAP
    @Bean
    public LdapTemplate ldapTemplate() {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource()); // Crea template LDAP
        
        // Configuración de template
        ldapTemplate.setDefaultCountLimit(100); // Límite de resultados por defecto
        ldapTemplate.setDefaultTimeLimit(30000); // Timeout de búsqueda 30s
        
        // RESULTADO ESPERADO: Template LDAP configurado correctamente
        return ldapTemplate; // Retorna template configurado
    }
    
    // Bean para configuración de búsqueda de usuarios
    @Bean
    public LDAPUserSearchConfig userSearchConfig() {
        LDAPUserSearchConfig config = new LDAPUserSearchConfig(); // Crea configuración de búsqueda
        
        config.setSearchBase(userSearchBase); // Establece base de búsqueda
        config.setSearchFilter(userSearchFilter); // Establece filtro de búsqueda
        config.setSearchSubtree(true); // Habilita búsqueda en subárbol
        
        // RESULTADO ESPERADO: Configuración de búsqueda de usuarios creada
        return config; // Retorna configuración
    }
    
    // Bean para configuración de búsqueda de grupos
    @Bean
    public LDAPGroupSearchConfig groupSearchConfig() {
        LDAPGroupSearchConfig config = new LDAPGroupSearchConfig(); // Crea configuración de grupos
        
        config.setSearchBase(groupSearchBase); // Establece base de búsqueda
        config.setSearchFilter(groupSearchFilter); // Establece filtro de búsqueda
        config.setSearchSubtree(true); // Habilita búsqueda en subárbol
        
        // RESULTADO ESPERADO: Configuración de búsqueda de grupos creada
        return config; // Retorna configuración
    }
}

// LDAPUserSearchConfig.java - Configuración de búsqueda de usuarios
package com.example.config;

public class LDAPUserSearchConfig {
    private String searchBase; // Base de búsqueda de usuarios
    private String searchFilter; // Filtro de búsqueda de usuarios
    private boolean searchSubtree; // Flag para búsqueda en subárbol
    
    // Getters y setters
    public String getSearchBase() { return searchBase; } // Getter para base de búsqueda
    public void setSearchBase(String searchBase) { this.searchBase = searchBase; } // Setter para base de búsqueda
    
    public String getSearchFilter() { return searchFilter; } // Getter para filtro de búsqueda
    public void setSearchFilter(String searchFilter) { this.searchFilter = searchFilter; } // Setter para filtro de búsqueda
    
    public boolean isSearchSubtree() { return searchSubtree; } // Getter para flag de subárbol
    public void setSearchSubtree(boolean searchSubtree) { this.searchSubtree = searchSubtree; } // Setter para flag de subárbol
}

// LDAPGroupSearchConfig.java - Configuración de búsqueda de grupos
package com.example.config;

public class LDAPGroupSearchConfig {
    private String searchBase; // Base de búsqueda de grupos
    private String searchFilter; // Filtro de búsqueda de grupos
    private boolean searchSubtree; // Flag para búsqueda en subárbol
    
    // Getters y setters
    public String getSearchBase() { return searchBase; } // Getter para base de búsqueda
    public void setSearchBase(String searchBase) { this.searchBase = searchBase; } // Setter para base de búsqueda
    
    public String getSearchFilter() { return searchFilter; } // Getter para filtro de búsqueda
    public void setSearchFilter(String searchFilter) { this.searchFilter = searchFilter; } // Setter para filtro de búsqueda
    
    public boolean isSearchSubtree() { return searchSubtree; } // Getter para flag de subárbol
    public void setSearchSubtree(boolean searchSubtree) { this.searchSubtree = searchSubtree; } // Setter para flag de subárbol
}
```

### Configuración de application.properties

```properties
# application.properties - Configuración LDAP
# Configuración del servidor LDAP
ldap.url=ldap://localhost:389
ldap.base=dc=example,dc=com

# Configuración del usuario manager
ldap.manager.dn=cn=admin,dc=example,dc=com
ldap.manager.password=admin123

# Configuración de búsqueda de usuarios
ldap.user.search.base=ou=users
ldap.user.search.filter=(uid={0})

# Configuración de búsqueda de grupos
ldap.group.search.base=ou=groups
ldap.group.search.filter=(member={0})

# Configuración de pool de conexiones
ldap.pool.initial=5
ldap.pool.max=20
ldap.pool.timeout=3000

# Configuración de timeouts
ldap.connect.timeout=3000
ldap.read.timeout=3000
ldap.search.timeout=30000

# Configuración de SSL/TLS
ldap.ssl.enabled=false
ldap.ssl.verify=false

# Configuración de logging
logging.level.org.springframework.ldap=DEBUG
logging.level.com.example.ldap=DEBUG
```

---

## 🔐 Autenticación LDAP

### Servicio de Autenticación LDAP

```java
// LDAPAuthenticationService.java - Servicio de autenticación LDAP
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.filter.Filter;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

@Service // Marca como servicio de Spring
public class LDAPAuthenticationService implements UserDetailsService {
    
    @Autowired
    private LdapTemplate ldapTemplate; // Inyecta template LDAP
    
    @Autowired
    private LDAPUserSearchConfig userSearchConfig; // Inyecta configuración de búsqueda
    
    @Autowired
    private LDAPGroupSearchConfig groupSearchConfig; // Inyecta configuración de grupos
    
    // Método para autenticar usuario (UserDetailsService)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // Buscar usuario en LDAP
            Optional<LDAPUser> ldapUser = findUserByUsername(username); // Busca usuario por username
            
            if (ldapUser.isPresent()) { // Si el usuario existe
                LDAPUser user = ldapUser.get(); // Obtiene usuario
                
                // Obtener roles del usuario
                List<String> roles = getUserRoles(user.getDn()); // Obtiene roles del usuario
                
                // Crear UserDetails con roles
                return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername()) // Establece username
                    .password(user.getPassword()) // Establece password (hash)
                    .disabled(!user.isEnabled()) // Establece si está habilitado
                    .accountExpired(user.isAccountExpired()) // Establece si la cuenta expiró
                    .credentialsExpired(user.isCredentialsExpired()) // Establece si las credenciales expiraron
                    .accountLocked(user.isAccountLocked()) // Establece si la cuenta está bloqueada
                    .roles(roles.toArray(new String[0])) // Establece roles
                    .build(); // Construye UserDetails
                
                // RESULTADO ESPERADO: UserDetails creado con información del usuario LDAP
            } else {
                // RESULTADO ESPERADO: Usuario no encontrado
                throw new UsernameNotFoundException("Usuario no encontrado: " + username); // Lanza excepción
            }
            
        } catch (Exception e) {
            // RESULTADO ESPERADO: Error en la búsqueda del usuario
            throw new UsernameNotFoundException("Error buscando usuario: " + username, e); // Lanza excepción
        }
    }
    
    // Método para autenticar usuario con contraseña
    public Authentication authenticate(String username, String password) {
        try {
            // Buscar usuario en LDAP
            Optional<LDAPUser> ldapUser = findUserByUsername(username); // Busca usuario por username
            
            if (ldapUser.isPresent()) { // Si el usuario existe
                LDAPUser user = ldapUser.get(); // Obtiene usuario
                
                // Verificar contraseña en LDAP
                if (authenticateUser(user.getDn(), password)) { // Autentica usuario
                    // Obtener roles del usuario
                    List<String> roles = getUserRoles(user.getDn()); // Obtiene roles del usuario
                    
                    // Crear token de autenticación
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        username, // Principal
                        password, // Credentials
                        roles.stream() // Stream de roles
                            .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)) // Convierte a autoridades
                            .collect(java.util.stream.Collectors.toList()) // Recolecta en lista
                    );
                    
                    // RESULTADO ESPERADO: Token de autenticación válido
                    return token; // Retorna token
                } else {
                    // RESULTADO ESPERADO: Contraseña incorrecta
                    throw new BadCredentialsException("Contraseña incorrecta para usuario: " + username); // Lanza excepción
                }
            } else {
                // RESULTADO ESPERADO: Usuario no encontrado
                throw new UsernameNotFoundException("Usuario no encontrado: " + username); // Lanza excepción
            }
            
        } catch (Exception e) {
            // RESULTADO ESPERADO: Error en la autenticación
            throw new BadCredentialsException("Error en autenticación: " + e.getMessage(), e); // Lanza excepción
        }
    }
    
    // Método para buscar usuario por username
    private Optional<LDAPUser> findUserByUsername(String username) {
        try {
            // Crear filtro de búsqueda
            Filter filter = new EqualsFilter("uid", username); // Filtro por uid
            
            // Buscar usuario en LDAP
            List<LDAPUser> users = ldapTemplate.search( // Busca usuarios
                userSearchConfig.getSearchBase(), // Base de búsqueda
                filter.encode(), // Filtro codificado
                new LDAPUserAttributesMapper() // Mapper para convertir resultados
            );
            
            // RESULTADO ESPERADO: Usuario encontrado o Optional.empty()
            return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0)); // Retorna usuario o empty
            
        } catch (Exception e) {
            // RESULTADO ESPERADO: Error en la búsqueda
            throw new RuntimeException("Error buscando usuario: " + username, e); // Lanza excepción
        }
    }
    
    // Método para autenticar usuario con DN y contraseña
    private boolean authenticateUser(String userDn, String password) {
        try {
            // Crear contexto de autenticación
            org.springframework.ldap.core.ContextSource contextSource = ldapTemplate.getContextSource(); // Obtiene contexto
            org.springframework.ldap.core.DirContextAdapter context = new org.springframework.ldap.core.DirContextAdapter(userDn); // Crea contexto
            
            // Intentar autenticación
            contextSource.getContext(userDn, password); // Intenta autenticación
            
            // RESULTADO ESPERADO: true si la autenticación es exitosa
            return true; // Retorna true
            
        } catch (Exception e) {
            // RESULTADO ESPERADO: false si la autenticación falla
            return false; // Retorna false
        }
    }
    
    // Método para obtener roles del usuario
    private List<String> getUserRoles(String userDn) {
        try {
            // Crear filtro de búsqueda de grupos
            Filter filter = new EqualsFilter("member", userDn); // Filtro por member
            
            // Buscar grupos en LDAP
            List<String> groups = ldapTemplate.search( // Busca grupos
                groupSearchConfig.getSearchBase(), // Base de búsqueda
                filter.encode(), // Filtro codificado
                new LDAPGroupAttributesMapper() // Mapper para convertir resultados
            );
            
            // RESULTADO ESPERADO: Lista de roles del usuario
            return groups; // Retorna grupos
            
        } catch (Exception e) {
            // RESULTADO ESPERADO: Lista vacía en caso de error
            return java.util.Collections.emptyList(); // Retorna lista vacía
        }
    }
}

// LDAPUser.java - Modelo de usuario LDAP
package com.example.model;

public class LDAPUser {
    private String dn; // Distinguished Name del usuario
    private String username; // Username del usuario
    private String password; // Contraseña del usuario (hash)
    private String email; // Email del usuario
    private String fullName; // Nombre completo del usuario
    private boolean enabled; // Flag si está habilitado
    private boolean accountExpired; // Flag si la cuenta expiró
    private boolean credentialsExpired; // Flag si las credenciales expiraron
    private boolean accountLocked; // Flag si la cuenta está bloqueada
    
    // Constructor
    public LDAPUser() {} // Constructor vacío
    
    // Getters y setters
    public String getDn() { return dn; } // Getter para DN
    public void setDn(String dn) { this.dn = dn; } // Setter para DN
    
    public String getUsername() { return username; } // Getter para username
    public void setUsername(String username) { this.username = username; } // Setter para username
    
    public String getPassword() { return password; } // Getter para password
    public void setPassword(String password) { this.password = password; } // Setter para password
    
    public String getEmail() { return email; } // Getter para email
    public void setEmail(String email) { this.email = email; } // Setter para email
    
    public String getFullName() { return fullName; } // Getter para nombre completo
    public void setFullName(String fullName) { this.fullName = fullName; } // Setter para nombre completo
    
    public boolean isEnabled() { return enabled; } // Getter para enabled
    public void setEnabled(boolean enabled) { this.enabled = enabled; } // Setter para enabled
    
    public boolean isAccountExpired() { return accountExpired; } // Getter para account expired
    public void setAccountExpired(boolean accountExpired) { this.accountExpired = accountExpired; } // Setter para account expired
    
    public boolean isCredentialsExpired() { return credentialsExpired; } // Getter para credentials expired
    public void setCredentialsExpired(boolean credentialsExpired) { this.credentialsExpired = credentialsExpired; } // Setter para credentials expired
    
    public boolean isAccountLocked() { return accountLocked; } // Getter para account locked
    public void setAccountLocked(boolean accountLocked) { this.accountLocked = accountLocked; } // Setter para account locked
}

// LDAPUserAttributesMapper.java - Mapper para usuarios LDAP
package com.example.mapper;

import com.example.model.LDAPUser;
import org.springframework.ldap.core.AttributesMapper;
import javax.naming.directory.Attributes;

public class LDAPUserAttributesMapper implements AttributesMapper<LDAPUser> {
    
    @Override
    public LDAPUser mapFromAttributes(Attributes attributes) throws javax.naming.NamingException {
        LDAPUser user = new LDAPUser(); // Crea nuevo usuario
        
        // Mapear atributos LDAP a objeto Java
        if (attributes.get("uid") != null) { // Si existe uid
            user.setUsername((String) attributes.get("uid").get()); // Establece username
        }
        
        if (attributes.get("mail") != null) { // Si existe mail
            user.setEmail((String) attributes.get("mail").get()); // Establece email
        }
        
        if (attributes.get("cn") != null) { // Si existe cn
            user.setFullName((String) attributes.get("cn").get()); // Establece nombre completo
        }
        
        if (attributes.get("userPassword") != null) { // Si existe userPassword
            user.setPassword((String) attributes.get("userPassword").get()); // Establece password
        }
        
        // Configurar flags de estado
        user.setEnabled(true); // Por defecto habilitado
        user.setAccountExpired(false); // Por defecto no expirado
        user.setCredentialsExpired(false); // Por defecto credenciales válidas
        user.setAccountLocked(false); // Por defecto no bloqueado
        
        // RESULTADO ESPERADO: Usuario LDAP mapeado correctamente
        return user; // Retorna usuario mapeado
    }
}

// LDAPGroupAttributesMapper.java - Mapper para grupos LDAP
package com.example.mapper;

import org.springframework.ldap.core.AttributesMapper;
import javax.naming.directory.Attributes;

public class LDAPGroupAttributesMapper implements AttributesMapper<String> {
    
    @Override
    public String mapFromAttributes(Attributes attributes) throws javax.naming.NamingException {
        // Obtener nombre del grupo
        if (attributes.get("cn") != null) { // Si existe cn
            String groupName = (String) attributes.get("cn").get(); // Obtiene nombre del grupo
            
            // RESULTADO ESPERADO: Nombre del grupo
            return groupName; // Retorna nombre del grupo
        }
        
        // RESULTADO ESPERADO: null si no hay nombre de grupo
        return null; // Retorna null
    }
}
```

---

## 🔒 Integración con Spring Security

### Configuración de Spring Security con LDAP

```java
// LDAPSecurityConfig.java - Configuración de seguridad con LDAP
package com.example.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;

@Configuration // Marca como configuración de Spring
@EnableWebSecurity // Habilita seguridad web
public class LDAPSecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Autowired
    private LDAPAuthenticationService ldapAuthenticationService; // Inyecta servicio de autenticación
    
    @Autowired
    private LDAPUserSearchConfig userSearchConfig; // Inyecta configuración de usuarios
    
    @Autowired
    private LDAPGroupSearchConfig groupSearchConfig; // Inyecta configuración de grupos
    
    // Bean para encoder de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Crea encoder BCrypt con factor 12
        
        // RESULTADO ESPERADO: Encoder de contraseñas configurado
    }
    
    // Configuración de autenticación
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // Configurar autenticación LDAP
        auth.ldapAuthentication() // Configura autenticación LDAP
            .userSearchBase(userSearchConfig.getSearchBase()) // Establece base de búsqueda de usuarios
            .userSearchFilter(userSearchConfig.getSearchFilter()) // Establece filtro de búsqueda de usuarios
            .groupSearchBase(groupSearchConfig.getSearchBase()) // Establece base de búsqueda de grupos
            .groupSearchFilter(groupSearchConfig.getSearchFilter()) // Establece filtro de búsqueda de grupos
            .contextSource() // Configura contexto
                .url("ldap://localhost:389") // Establece URL del servidor LDAP
                .base("dc=example,dc=com") // Establece DN base
                .managerDn("cn=admin,dc=example,dc=com") // Establece DN del manager
                .managerPassword("admin123") // Establece contraseña del manager
            .and() // Y
            .passwordCompare() // Compara contraseñas
                .passwordEncoder(passwordEncoder()) // Establece encoder de contraseñas
                .passwordAttribute("userPassword"); // Establece atributo de contraseña
        
        // RESULTADO ESPERADO: Autenticación LDAP configurada correctamente
    }
    
    // Configuración de autorización
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // Configuración CSRF
            .csrf().disable() // Deshabilita CSRF para APIs
            
            // Configuración de autorización
            .authorizeRequests()
                .antMatchers("/api/public/**").permitAll() // Endpoints públicos
                .antMatchers("/api/admin/**").hasRole("ADMIN") // Requiere rol ADMIN
                .antMatchers("/api/user/**").hasRole("USER") // Requiere rol USER
                .anyRequest().authenticated() // Requiere autenticación para cualquier otra request
            .and()
            
            // Configuración de formulario de login
            .formLogin()
                .loginPage("/login") // Página de login personalizada
                .defaultSuccessUrl("/dashboard") // URL de éxito por defecto
                .failureUrl("/login?error=true") // URL de fallo
                .permitAll() // Permite acceso a todos
            .and()
            
            // Configuración de logout
            .logout()
                .logoutUrl("/logout") // URL de logout
                .logoutSuccessUrl("/login?logout=true") // URL de éxito de logout
                .invalidateHttpSession(true) // Invalida sesión HTTP
                .deleteCookies("JSESSIONID") // Elimina cookies de sesión
                .permitAll(); // Permite acceso a todos
        
        // RESULTADO ESPERADO: Configuración de seguridad aplicada
    }
}
```

---

## 📊 Predicciones de Resultados

### Resultados Esperados por Funcionalidad

| Funcionalidad | Resultado Esperado | Indicadores de Éxito |
|---------------|-------------------|---------------------|
| **Configuración LDAP** | Servidor LDAP configurado | Conexión establecida, búsquedas exitosas |
| **Autenticación** | Usuarios autenticados | Login exitoso, roles asignados |
| **Autorización** | Acceso controlado | Endpoints protegidos, roles verificados |
| **Integración Spring** | Seguridad aplicada | Configuración cargada, filtros activos |
| **Búsqueda de Usuarios** | Usuarios encontrados | Resultados de búsqueda, mapeo correcto |
| **Gestión de Grupos** | Roles asignados | Grupos encontrados, permisos aplicados |

### Métricas de Rendimiento

```java
// LDAPMetricsService.java - Métricas de rendimiento LDAP
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service // Marca como servicio de Spring
public class LDAPMetricsService {
    
    @Autowired
    private LdapTemplate ldapTemplate; // Inyecta template LDAP
    
    // Contadores de métricas
    private final AtomicLong authenticationCount = new AtomicLong(0); // Contador de autenticaciones
    private final AtomicLong searchCount = new AtomicLong(0); // Contador de búsquedas
    private final AtomicLong errorCount = new AtomicLong(0); // Contador de errores
    
    // Método para medir tiempo de autenticación
    public Duration measureAuthenticationTime(String username, String password) {
        Instant start = Instant.now(); // Tiempo de inicio
        
        try {
            // Intentar autenticación
            boolean authenticated = authenticateUser(username, password); // Autentica usuario
            
            if (authenticated) { // Si autenticación exitosa
                authenticationCount.incrementAndGet(); // Incrementa contador de autenticaciones
            } else {
                errorCount.incrementAndGet(); // Incrementa contador de errores
            }
            
            // RESULTADO ESPERADO: Duración de la autenticación
            return Duration.between(start, Instant.now()); // Retorna duración
            
        } catch (Exception e) {
            errorCount.incrementAndGet(); // Incrementa contador de errores
            
            // RESULTADO ESPERADO: Duración con error
            return Duration.between(start, Instant.now()); // Retorna duración
        }
    }
    
    // Método para medir tiempo de búsqueda
    public Duration measureSearchTime(String searchBase, String filter) {
        Instant start = Instant.now(); // Tiempo de inicio
        
        try {
            // Realizar búsqueda
            ldapTemplate.search(searchBase, filter, new LDAPUserAttributesMapper()); // Realiza búsqueda
            
            searchCount.incrementAndGet(); // Incrementa contador de búsquedas
            
            // RESULTADO ESPERADO: Duración de la búsqueda
            return Duration.between(start, Instant.now()); // Retorna duración
            
        } catch (Exception e) {
            errorCount.incrementAndGet(); // Incrementa contador de errores
            
            // RESULTADO ESPERADO: Duración con error
            return Duration.between(start, Instant.now()); // Retorna duración
        }
    }
    
    // Método para obtener métricas
    public LDAPMetrics getMetrics() {
        LDAPMetrics metrics = new LDAPMetrics(); // Crea objeto de métricas
        
        metrics.setAuthenticationCount(authenticationCount.get()); // Establece contador de autenticaciones
        metrics.setSearchCount(searchCount.get()); // Establece contador de búsquedas
        metrics.setErrorCount(errorCount.get()); // Establece contador de errores
        
        // Calcular tasa de éxito
        long totalOperations = authenticationCount.get() + searchCount.get(); // Total de operaciones
        if (totalOperations > 0) { // Si hay operaciones
            double successRate = (double) (totalOperations - errorCount.get()) / totalOperations * 100; // Calcula tasa de éxito
            metrics.setSuccessRate(successRate); // Establece tasa de éxito
        }
        
        // RESULTADO ESPERADO: Métricas calculadas
        return metrics; // Retorna métricas
    }
    
    // Método auxiliar para autenticación
    private boolean authenticateUser(String username, String password) {
        // Implementación de autenticación
        return true; // Placeholder
    }
}

// LDAPMetrics.java - Modelo de métricas LDAP
package com.example.model;

public class LDAPMetrics {
    private long authenticationCount; // Contador de autenticaciones
    private long searchCount; // Contador de búsquedas
    private long errorCount; // Contador de errores
    private double successRate; // Tasa de éxito
    
    // Getters y setters
    public long getAuthenticationCount() { return authenticationCount; } // Getter para contador de autenticaciones
    public void setAuthenticationCount(long authenticationCount) { this.authenticationCount = authenticationCount; } // Setter para contador de autenticaciones
    
    public long getSearchCount() { return searchCount; } // Getter para contador de búsquedas
    public void setSearchCount(long searchCount) { this.searchCount = searchCount; } // Setter para contador de búsquedas
    
    public long getErrorCount() { return errorCount; } // Getter para contador de errores
    public void setErrorCount(long errorCount) { this.errorCount = errorCount; } // Setter para contador de errores
    
    public double getSuccessRate() { return successRate; } // Getter para tasa de éxito
    public void setSuccessRate(double successRate) { this.successRate = successRate; } // Setter para tasa de éxito
}
```

---

## 🎯 Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es LDAP y para qué se usa?**
   - Lightweight Directory Access Protocol, directorio de usuarios y recursos

2. **¿Cuáles son los componentes principales de LDAP?**
   - DN, RDN, atributos, esquemas, entradas

3. **¿Cómo configurar autenticación LDAP en Spring?**
   - Configuración de contexto, búsqueda de usuarios, mapeo de roles

### Preguntas Intermedias

4. **¿Cómo implementar autorización basada en roles con LDAP?**
   - Búsqueda de grupos, mapeo de roles, configuración de permisos

5. **¿Cómo optimizar el rendimiento de LDAP?**
   - Pool de conexiones, caché, índices, timeouts

6. **¿Cómo manejar errores de conexión LDAP?**
   - Reintentos, fallback, logging, monitoreo

### Preguntas Avanzadas

7. **¿Cómo implementar LDAP con SSL/TLS?**
   - Configuración de certificados, puertos seguros, verificación

8. **¿Cómo sincronizar datos entre LDAP y base de datos?**
   - Eventos de cambio, sincronización bidireccional, conflictos

9. **¿Cómo escalar LDAP en entornos empresariales?**
   - Replicación, balanceo de carga, alta disponibilidad

---

**¡Dominar LDAP te hará un experto en autenticación empresarial! 🚀** 