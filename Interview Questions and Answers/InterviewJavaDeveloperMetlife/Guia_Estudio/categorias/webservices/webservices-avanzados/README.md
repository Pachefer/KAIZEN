# 🌐 WebServices Avanzados - SOAP y REST Profesionales

## 📋 Índice

1. [WebServices SOAP Avanzados](#webservices-soap-avanzados)
2. [WebServices REST Avanzados](#webservices-rest-avanzados)
3. [Seguridad en WebServices](#seguridad-en-webservices)
4. [Monitoreo y Performance](#monitoreo-y-performance)
5. [Testing Avanzado](#testing-avanzado)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🔄 WebServices SOAP Avanzados

### Configuración de SOAP con WS-Security

```java
// AdvancedSoapConfig.java - Configuración avanzada de SOAP con seguridad
package com.example.config;

import org.apache.wss4j.common.ext.WSPasswordCallback;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.server.EndpointInterceptor;
import org.springframework.ws.soap.security.wss4j2.Wss4jSecurityInterceptor;

import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.UnsupportedCallbackException;
import java.io.IOException;
import java.util.List;

@Configuration // Marca como configuración de Spring
@EnableWs // Habilita Web Services
public class AdvancedSoapConfig extends WsConfigurerAdapter {
    
    // Propiedades de seguridad inyectadas desde application.properties
    @Value("${soap.security.username}") // Usuario para WS-Security
    private String securityUsername; // Usuario de seguridad
    
    @Value("${soap.security.password}") // Contraseña para WS-Security
    private String securityPassword; // Contraseña de seguridad
    
    @Value("${soap.security.keystore.path}") // Ruta del keystore
    private String keystorePath; // Ruta del keystore
    
    @Value("${soap.security.keystore.password}") // Contraseña del keystore
    private String keystorePassword; // Contraseña del keystore
    
    // Bean para interceptor de seguridad WS-Security
    @Bean
    public Wss4jSecurityInterceptor securityInterceptor() {
        Wss4jSecurityInterceptor securityInterceptor = new Wss4jSecurityInterceptor(); // Crea interceptor de seguridad
        
        // Configura validación de usuario/contraseña
        securityInterceptor.setValidationActions("UsernameToken"); // Establece acciones de validación
        securityInterceptor.setValidationCallbackHandler(callbackHandler()); // Establece callback handler
        
        // Configura encriptación
        securityInterceptor.setSecurementActions("Encrypt"); // Establece acciones de encriptación
        securityInterceptor.setSecurementEncryptionUser("useReqSessCert"); // Establece usuario de encriptación
        securityInterceptor.setSecurementEncryptionParts("{Content}{http://schemas.xmlsoap.org/soap/envelope/}Body"); // Establece partes a encriptar
        
        // Configura firma digital
        securityInterceptor.setSecurementActions("Signature"); // Establece acciones de firma
        securityInterceptor.setSecurementSignatureUser("server"); // Establece usuario de firma
        securityInterceptor.setSecurementSignatureParts("{Element}{http://schemas.xmlsoap.org/soap/envelope/}Body"); // Establece partes a firmar
        
        // RESULTADO ESPERADO: Interceptor de seguridad configurado con WS-Security
        return securityInterceptor; // Retorna interceptor configurado
    }
    
    // Bean para callback handler de autenticación
    @Bean
    public CallbackHandler callbackHandler() {
        return new CallbackHandler() {
            @Override
            public void handle(Callback[] callbacks) throws IOException, UnsupportedCallbackException {
                for (Callback callback : callbacks) { // Itera sobre callbacks
                    if (callback instanceof WSPasswordCallback) { // Verifica si es WSPasswordCallback
                        WSPasswordCallback passwordCallback = (WSPasswordCallback) callback; // Cast a WSPasswordCallback
                        
                        // Valida credenciales
                        if (securityUsername.equals(passwordCallback.getIdentifier()) && 
                            securityPassword.equals(passwordCallback.getPassword())) { // Verifica credenciales
                            // RESULTADO ESPERADO: Autenticación exitosa
                        } else {
                            // RESULTADO ESPERADO: Autenticación fallida
                            throw new UnsupportedCallbackException(callback, "Invalid credentials"); // Lanza excepción
                        }
                    }
                }
            }
        };
    }
    
    // Método para agregar interceptores
    @Override
    public void addInterceptors(List<EndpointInterceptor> interceptors) {
        interceptors.add(securityInterceptor()); // Agrega interceptor de seguridad
        
        // RESULTADO ESPERADO: Interceptores agregados a la configuración
    }
}

// AdvancedSoapService.java - Servicio SOAP avanzado con transacciones
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;

@Service // Marca como servicio de Spring
@Endpoint // Marca como endpoint SOAP
public class AdvancedSoapService {
    
    private static final String NAMESPACE_URI = "http://example.com/advanced"; // URI del namespace
    
    @Autowired
    private UserRepository userRepository; // Inyecta repositorio de usuarios
    
    @Autowired
    private AuditService auditService; // Inyecta servicio de auditoría
    
    // Endpoint para operación compleja con transacciones
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "ComplexOperationRequest") // Define endpoint
    @ResponsePayload // Marca como respuesta
    @Transactional(rollbackFor = Exception.class) // Configura transacción con rollback
    public JAXBElement<ComplexOperationResponse> complexOperation(@RequestPayload JAXBElement<ComplexOperationRequest> request) {
        try {
            // Extrae datos de la request
            ComplexOperationRequest requestData = request.getValue(); // Obtiene valor de la request
            String operationType = requestData.getOperationType(); // Obtiene tipo de operación
            String userId = requestData.getUserId(); // Obtiene ID de usuario
            
            // Valida datos de entrada
            validateRequest(requestData); // Valida request
            
            // Ejecuta operación compleja
            ComplexOperationResponse response = executeComplexOperation(requestData); // Ejecuta operación
            
            // Registra auditoría
            auditService.logOperation(operationType, userId, "SUCCESS"); // Registra auditoría
            
            // Crea respuesta
            QName qName = new QName(NAMESPACE_URI, "ComplexOperationResponse"); // Crea QName
            JAXBElement<ComplexOperationResponse> responseElement = new JAXBElement<>(qName, ComplexOperationResponse.class, response); // Crea elemento de respuesta
            
            // RESULTADO ESPERADO: Respuesta SOAP exitosa con datos procesados
            return responseElement; // Retorna respuesta
            
        } catch (Exception e) {
            // Maneja errores
            auditService.logOperation(request.getValue().getOperationType(), request.getValue().getUserId(), "FAILED: " + e.getMessage()); // Registra error
            throw new RuntimeException("Error en operación compleja: " + e.getMessage(), e); // Lanza excepción
        }
    }
    
    // Método para validar request
    private void validateRequest(ComplexOperationRequest request) {
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) { // Verifica userId
            throw new IllegalArgumentException("User ID is required"); // Lanza excepción
        }
        
        if (request.getOperationType() == null || request.getOperationType().trim().isEmpty()) { // Verifica operationType
            throw new IllegalArgumentException("Operation type is required"); // Lanza excepción
        }
        
        // RESULTADO ESPERADO: Request validado correctamente
    }
    
    // Método para ejecutar operación compleja
    private ComplexOperationResponse executeComplexOperation(ComplexOperationRequest request) {
        ComplexOperationResponse response = new ComplexOperationResponse(); // Crea respuesta
        
        // Ejecuta lógica de negocio según tipo de operación
        switch (request.getOperationType()) { // Switch por tipo de operación
            case "CREATE":
                response = executeCreateOperation(request); // Ejecuta operación de creación
                break;
            case "UPDATE":
                response = executeUpdateOperation(request); // Ejecuta operación de actualización
                break;
            case "DELETE":
                response = executeDeleteOperation(request); // Ejecuta operación de eliminación
                break;
            default:
                throw new IllegalArgumentException("Unsupported operation type: " + request.getOperationType()); // Lanza excepción
        }
        
        // RESULTADO ESPERADO: Respuesta con resultado de operación
        return response; // Retorna respuesta
    }
    
    // Método para operación de creación
    private ComplexOperationResponse executeCreateOperation(ComplexOperationRequest request) {
        // Lógica de creación
        User user = new User(); // Crea nuevo usuario
        user.setUsername(request.getUserId()); // Establece username
        user.setEmail(request.getEmail()); // Establece email
        
        User savedUser = userRepository.save(user); // Guarda usuario
        
        ComplexOperationResponse response = new ComplexOperationResponse(); // Crea respuesta
        response.setStatus("SUCCESS"); // Establece estado
        response.setMessage("User created successfully"); // Establece mensaje
        response.setResultId(savedUser.getId().toString()); // Establece ID de resultado
        
        // RESULTADO ESPERADO: Respuesta de creación exitosa
        return response; // Retorna respuesta
    }
    
    // Método para operación de actualización
    private ComplexOperationResponse executeUpdateOperation(ComplexOperationRequest request) {
        // Lógica de actualización
        User user = userRepository.findByUsername(request.getUserId()); // Busca usuario
        if (user == null) { // Verifica si existe
            throw new RuntimeException("User not found: " + request.getUserId()); // Lanza excepción
        }
        
        user.setEmail(request.getEmail()); // Actualiza email
        userRepository.save(user); // Guarda cambios
        
        ComplexOperationResponse response = new ComplexOperationResponse(); // Crea respuesta
        response.setStatus("SUCCESS"); // Establece estado
        response.setMessage("User updated successfully"); // Establece mensaje
        response.setResultId(user.getId().toString()); // Establece ID de resultado
        
        // RESULTADO ESPERADO: Respuesta de actualización exitosa
        return response; // Retorna respuesta
    }
    
    // Método para operación de eliminación
    private ComplexOperationResponse executeDeleteOperation(ComplexOperationRequest request) {
        // Lógica de eliminación
        User user = userRepository.findByUsername(request.getUserId()); // Busca usuario
        if (user == null) { // Verifica si existe
            throw new RuntimeException("User not found: " + request.getUserId()); // Lanza excepción
        }
        
        userRepository.delete(user); // Elimina usuario
        
        ComplexOperationResponse response = new ComplexOperationResponse(); // Crea respuesta
        response.setStatus("SUCCESS"); // Establece estado
        response.setMessage("User deleted successfully"); // Establece mensaje
        response.setResultId(user.getId().toString()); // Establece ID de resultado
        
        // RESULTADO ESPERADO: Respuesta de eliminación exitosa
        return response; // Retorna respuesta
    }
}
```

---

## 🚀 WebServices REST Avanzados

### Configuración de REST con HATEOAS

```java
// AdvancedRestConfig.java - Configuración avanzada de REST con HATEOAS
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.hateoas.config.HypermediaWebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Marca como configuración de Spring
@EnableHypermediaSupport(type = EnableHypermediaSupport.HypermediaType.HAL) // Habilita soporte HATEOAS
public class AdvancedRestConfig implements WebMvcConfigurer {
    
    // Bean para configurador de hipermedia
    @Bean
    public HypermediaWebMvcConfigurer hypermediaWebMvcConfigurer() {
        return new HypermediaWebMvcConfigurer() {
            // Configuración personalizada de hipermedia
        };
    }
}

// AdvancedRestController.java - Controlador REST avanzado con HATEOAS
package com.example.controller;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController // Marca como controlador REST
@RequestMapping("/api/v2/users") // Define ruta base
public class AdvancedRestController {
    
    @Autowired
    private UserRepository userRepository; // Inyecta repositorio de usuarios
    
    // Endpoint para obtener usuarios con paginación y HATEOAS
    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<User>>> getUsers(Pageable pageable) {
        try {
            // Obtiene página de usuarios
            Page<User> userPage = userRepository.findAll(pageable); // Obtiene página de usuarios
            
            // Convierte a EntityModel con links HATEOAS
            List<EntityModel<User>> userModels = userPage.getContent().stream() // Stream de usuarios
                    .map(user -> EntityModel.of(user, // Crea EntityModel
                            linkTo(methodOn(AdvancedRestController.class).getUser(user.getId())).withSelfRel(), // Link a sí mismo
                            linkTo(methodOn(AdvancedRestController.class).getUsers(pageable)).withRel("users"), // Link a colección
                            linkTo(methodOn(AdvancedRestController.class).updateUser(user.getId(), null)).withRel("update"), // Link de actualización
                            linkTo(methodOn(AdvancedRestController.class).deleteUser(user.getId())).withRel("delete") // Link de eliminación
                    ))
                    .collect(Collectors.toList()); // Recolecta en lista
            
            // Crea PagedModel con links de paginación
            PagedModel.PageMetadata pageMetadata = new PagedModel.PageMetadata( // Crea metadata de página
                    pageable.getPageSize(), // Tamaño de página
                    pageable.getPageNumber(), // Número de página
                    userPage.getTotalElements(), // Total de elementos
                    userPage.getTotalPages() // Total de páginas
            );
            
            PagedModel<EntityModel<User>> pagedModel = PagedModel.of(userModels, pageMetadata); // Crea PagedModel
            
            // Agrega links de navegación
            if (userPage.hasNext()) { // Si hay siguiente página
                pagedModel.add(linkTo(methodOn(AdvancedRestController.class).getUsers(pageable.next())).withRel("next")); // Link siguiente
            }
            if (userPage.hasPrevious()) { // Si hay página anterior
                pagedModel.add(linkTo(methodOn(AdvancedRestController.class).getUsers(pageable.previousOrFirst())).withRel("prev")); // Link anterior
            }
            pagedModel.add(linkTo(methodOn(AdvancedRestController.class).getUsers(pageable.first())).withRel("first")); // Link primera página
            pagedModel.add(linkTo(methodOn(AdvancedRestController.class).getUsers(pageable.withPage(userPage.getTotalPages() - 1))).withRel("last")); // Link última página
            
            // RESULTADO ESPERADO: Respuesta paginada con links HATEOAS
            return ResponseEntity.ok(pagedModel); // Retorna respuesta exitosa
            
        } catch (Exception e) {
            // Maneja errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Retorna error
        }
    }
    
    // Endpoint para obtener usuario específico con HATEOAS
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<User>> getUser(@PathVariable Long id) {
        try {
            // Busca usuario
            User user = userRepository.findById(id) // Busca por ID
                    .orElseThrow(() -> new RuntimeException("User not found: " + id)); // Lanza excepción si no existe
            
            // Crea EntityModel con links HATEOAS
            EntityModel<User> userModel = EntityModel.of(user, // Crea EntityModel
                    linkTo(methodOn(AdvancedRestController.class).getUser(id)).withSelfRel(), // Link a sí mismo
                    linkTo(methodOn(AdvancedRestController.class).getUsers(null)).withRel("users"), // Link a colección
                    linkTo(methodOn(AdvancedRestController.class).updateUser(id, user)).withRel("update"), // Link de actualización
                    linkTo(methodOn(AdvancedRestController.class).deleteUser(id)).withRel("delete") // Link de eliminación
            );
            
            // RESULTADO ESPERADO: Respuesta con usuario y links HATEOAS
            return ResponseEntity.ok(userModel); // Retorna respuesta exitosa
            
        } catch (RuntimeException e) {
            // Maneja errores
            return ResponseEntity.notFound().build(); // Retorna 404
        }
    }
    
    // Endpoint para crear usuario con validación avanzada
    @PostMapping
    public ResponseEntity<EntityModel<User>> createUser(@Valid @RequestBody User user) {
        try {
            // Valida datos de entrada
            validateUserData(user); // Valida datos de usuario
            
            // Verifica si el usuario ya existe
            if (userRepository.findByUsername(user.getUsername()).isPresent()) { // Verifica si existe
                return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Retorna conflicto
            }
            
            // Guarda usuario
            User savedUser = userRepository.save(user); // Guarda usuario
            
            // Crea EntityModel con links HATEOAS
            EntityModel<User> userModel = EntityModel.of(savedUser, // Crea EntityModel
                    linkTo(methodOn(AdvancedRestController.class).getUser(savedUser.getId())).withSelfRel(), // Link a sí mismo
                    linkTo(methodOn(AdvancedRestController.class).getUsers(null)).withRel("users"), // Link a colección
                    linkTo(methodOn(AdvancedRestController.class).updateUser(savedUser.getId(), savedUser)).withRel("update"), // Link de actualización
                    linkTo(methodOn(AdvancedRestController.class).deleteUser(savedUser.getId())).withRel("delete") // Link de eliminación
            );
            
            // RESULTADO ESPERADO: Respuesta de creación exitosa con links HATEOAS
            return ResponseEntity.status(HttpStatus.CREATED).body(userModel); // Retorna respuesta creada
            
        } catch (Exception e) {
            // Maneja errores
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Retorna error de validación
        }
    }
    
    // Endpoint para actualizar usuario con validación
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<User>> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        try {
            // Busca usuario existente
            User existingUser = userRepository.findById(id) // Busca por ID
                    .orElseThrow(() -> new RuntimeException("User not found: " + id)); // Lanza excepción si no existe
            
            // Actualiza datos
            existingUser.setUsername(user.getUsername()); // Actualiza username
            existingUser.setEmail(user.getEmail()); // Actualiza email
            existingUser.setFirstName(user.getFirstName()); // Actualiza firstName
            existingUser.setLastName(user.getLastName()); // Actualiza lastName
            
            // Valida datos actualizados
            validateUserData(existingUser); // Valida datos de usuario
            
            // Guarda cambios
            User updatedUser = userRepository.save(existingUser); // Guarda cambios
            
            // Crea EntityModel con links HATEOAS
            EntityModel<User> userModel = EntityModel.of(updatedUser, // Crea EntityModel
                    linkTo(methodOn(AdvancedRestController.class).getUser(id)).withSelfRel(), // Link a sí mismo
                    linkTo(methodOn(AdvancedRestController.class).getUsers(null)).withRel("users"), // Link a colección
                    linkTo(methodOn(AdvancedRestController.class).updateUser(id, updatedUser)).withRel("update"), // Link de actualización
                    linkTo(methodOn(AdvancedRestController.class).deleteUser(id)).withRel("delete") // Link de eliminación
            );
            
            // RESULTADO ESPERADO: Respuesta de actualización exitosa con links HATEOAS
            return ResponseEntity.ok(userModel); // Retorna respuesta exitosa
            
        } catch (RuntimeException e) {
            // Maneja errores
            return ResponseEntity.notFound().build(); // Retorna 404
        }
    }
    
    // Endpoint para eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            // Verifica si el usuario existe
            if (!userRepository.existsById(id)) { // Verifica si existe
                return ResponseEntity.notFound().build(); // Retorna 404
            }
            
            // Elimina usuario
            userRepository.deleteById(id); // Elimina por ID
            
            // RESULTADO ESPERADO: Respuesta de eliminación exitosa
            return ResponseEntity.noContent().build(); // Retorna 204 No Content
            
        } catch (Exception e) {
            // Maneja errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Retorna error
        }
    }
    
    // Método para validar datos de usuario
    private void validateUserData(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) { // Verifica username
            throw new IllegalArgumentException("Username is required"); // Lanza excepción
        }
        
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) { // Verifica email
            throw new IllegalArgumentException("Valid email is required"); // Lanza excepción
        }
        
        if (user.getUsername().length() < 3) { // Verifica longitud de username
            throw new IllegalArgumentException("Username must be at least 3 characters"); // Lanza excepción
        }
        
        // RESULTADO ESPERADO: Datos de usuario validados correctamente
    }
}
```

---

## 🔒 Seguridad en WebServices

### Configuración de Seguridad Avanzada

```java
// WebServiceSecurityConfig.java - Configuración de seguridad avanzada
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // Marca como configuración de Spring
@EnableWebSecurity // Habilita seguridad web
public class WebServiceSecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Value("${security.jwt.secret}") // Secreto JWT
    private String jwtSecret; // Secreto para JWT
    
    @Value("${security.jwt.expiration}") // Expiración JWT
    private Long jwtExpiration; // Tiempo de expiración JWT
    
    // Bean para encoder de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Crea encoder BCrypt con factor 12
        
        // RESULTADO ESPERADO: Encoder de contraseñas configurado
    }
    
    // Bean para filtro JWT
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtSecret, jwtExpiration); // Crea filtro JWT
        
        // RESULTADO ESPERADO: Filtro JWT configurado
    }
    
    // Configuración de seguridad HTTP
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Deshabilita CSRF para APIs
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Configura sesiones stateless
            .and()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll() // Permite acceso a autenticación
                .antMatchers("/api/public/**").permitAll() // Permite acceso a endpoints públicos
                .antMatchers("/api/admin/**").hasRole("ADMIN") // Requiere rol ADMIN
                .antMatchers("/api/user/**").hasRole("USER") // Requiere rol USER
                .anyRequest().authenticated() // Requiere autenticación para cualquier otra request
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // Agrega filtro JWT
        
        // RESULTADO ESPERADO: Configuración de seguridad aplicada
    }
}

// JwtAuthenticationFilter.java - Filtro de autenticación JWT
package com.example.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final String jwtSecret; // Secreto JWT
    private final Long jwtExpiration; // Expiración JWT
    private final UserDetailsService userDetailsService; // Servicio de detalles de usuario
    
    public JwtAuthenticationFilter(String jwtSecret, Long jwtExpiration) {
        this.jwtSecret = jwtSecret; // Establece secreto JWT
        this.jwtExpiration = jwtExpiration; // Establece expiración JWT
        this.userDetailsService = new CustomUserDetailsService(); // Crea servicio de detalles de usuario
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Extrae token del header
            String token = extractTokenFromRequest(request); // Extrae token de la request
            
            if (token != null && validateToken(token)) { // Verifica si token existe y es válido
                // Obtiene claims del token
                Claims claims = Jwts.parser() // Crea parser JWT
                        .setSigningKey(jwtSecret) // Establece clave de firma
                        .parseClaimsJws(token) // Parsea claims
                        .getBody(); // Obtiene body
                
                // Obtiene username de claims
                String username = claims.getSubject(); // Obtiene subject (username)
                
                // Carga detalles de usuario
                UserDetails userDetails = userDetailsService.loadUserByUsername(username); // Carga detalles de usuario
                
                // Crea autenticación
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken( // Crea token de autenticación
                        userDetails, // Detalles de usuario
                        null, // Credenciales (null para JWT)
                        userDetails.getAuthorities() // Autoridades
                );
                
                // Establece autenticación en contexto
                SecurityContextHolder.getContext().setAuthentication(authentication); // Establece autenticación
                
                // RESULTADO ESPERADO: Usuario autenticado correctamente
            }
            
        } catch (SignatureException e) {
            // Token inválido
            logger.error("Invalid JWT signature: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Token inválido, autenticación fallida
        } catch (Exception e) {
            // Otros errores
            logger.error("JWT authentication error: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Error de autenticación
        }
        
        // Continúa con la cadena de filtros
        filterChain.doFilter(request, response); // Continúa con filtros
    }
    
    // Método para extraer token de la request
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization"); // Obtiene header Authorization
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) { // Verifica si es Bearer token
            return bearerToken.substring(7); // Extrae token (sin "Bearer ")
        }
        
        // RESULTADO ESPERADO: Token extraído o null si no existe
        return null; // Retorna null si no hay token
    }
    
    // Método para validar token
    private boolean validateToken(String token) {
        try {
            // Intenta parsear el token
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token); // Parsea token
            
            // RESULTADO ESPERADO: true si el token es válido
            return true; // Retorna true si es válido
            
        } catch (Exception e) {
            // Token inválido
            logger.error("Token validation failed: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: false si el token es inválido
            return false; // Retorna false si es inválido
        }
    }
}
```

---

## 📊 Monitoreo y Performance

### Configuración de Monitoreo Avanzado

```java
// WebServiceMonitoringConfig.java - Configuración de monitoreo avanzado
package com.example.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Marca como configuración de Spring
public class WebServiceMonitoringConfig implements WebMvcConfigurer {
    
    @Autowired
    private MeterRegistry meterRegistry; // Inyecta registro de métricas
    
    // Bean para aspecto de timing
    @Bean
    public TimedAspect timedAspect() {
        return new TimedAspect(meterRegistry); // Crea aspecto de timing
        
        // RESULTADO ESPERADO: Aspecto de timing configurado
    }
    
    // Bean para interceptor de monitoreo
    @Bean
    public MonitoringInterceptor monitoringInterceptor() {
        return new MonitoringInterceptor(meterRegistry); // Crea interceptor de monitoreo
        
        // RESULTADO ESPERADO: Interceptor de monitoreo configurado
    }
    
    // Método para agregar interceptores
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(monitoringInterceptor()); // Agrega interceptor de monitoreo
        
        // RESULTADO ESPERADO: Interceptores agregados a la configuración
    }
}

// MonitoringInterceptor.java - Interceptor para monitoreo
package com.example.monitoring;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.TimeUnit;

public class MonitoringInterceptor implements HandlerInterceptor {
    
    private final MeterRegistry meterRegistry; // Registro de métricas
    private final Counter requestCounter; // Contador de requests
    private final Counter errorCounter; // Contador de errores
    private final Timer requestTimer; // Timer de requests
    
    public MonitoringInterceptor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry; // Establece registro de métricas
        
        // Crea contadores y timers
        this.requestCounter = Counter.builder("webservice.requests.total") // Crea contador de requests
                .description("Total number of web service requests") // Descripción
                .register(meterRegistry); // Registra en meter registry
        
        this.errorCounter = Counter.builder("webservice.errors.total") // Crea contador de errores
                .description("Total number of web service errors") // Descripción
                .register(meterRegistry); // Registra en meter registry
        
        this.requestTimer = Timer.builder("webservice.request.duration") // Crea timer de requests
                .description("Request duration") // Descripción
                .register(meterRegistry); // Registra en meter registry
    }
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Registra inicio de request
        long startTime = System.currentTimeMillis(); // Obtiene tiempo de inicio
        request.setAttribute("startTime", startTime); // Establece tiempo de inicio en request
        
        // Incrementa contador de requests
        requestCounter.increment(); // Incrementa contador
        
        // Registra métricas adicionales
        meterRegistry.counter("webservice.requests", // Crea contador con tags
                "method", request.getMethod(), // Método HTTP
                "path", request.getRequestURI() // Path de request
        ).increment(); // Incrementa contador
        
        // RESULTADO ESPERADO: Request registrada para monitoreo
        return true; // Continúa con el procesamiento
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // Obtiene tiempo de inicio
        Long startTime = (Long) request.getAttribute("startTime"); // Obtiene tiempo de inicio
        
        if (startTime != null) { // Verifica si existe tiempo de inicio
            // Calcula duración
            long duration = System.currentTimeMillis() - startTime; // Calcula duración
            
            // Registra duración
            requestTimer.record(duration, TimeUnit.MILLISECONDS); // Registra duración
            
            // Registra métricas de duración por método y path
            meterRegistry.timer("webservice.request.duration", // Crea timer con tags
                    "method", request.getMethod(), // Método HTTP
                    "path", request.getRequestURI(), // Path de request
                    "status", String.valueOf(response.getStatus()) // Status code
            ).record(duration, TimeUnit.MILLISECONDS); // Registra duración
        }
        
        // Registra errores si existen
        if (ex != null || response.getStatus() >= 400) { // Verifica si hay error
            errorCounter.increment(); // Incrementa contador de errores
            
            // Registra métricas de errores
            meterRegistry.counter("webservice.errors", // Crea contador de errores con tags
                    "method", request.getMethod(), // Método HTTP
                    "path", request.getRequestURI(), // Path de request
                    "status", String.valueOf(response.getStatus()) // Status code
            ).increment(); // Incrementa contador
        }
        
        // RESULTADO ESPERADO: Métricas de request registradas
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es WS-Security y cuáles son sus características?**
   - Estándar de seguridad para SOAP, autenticación, encriptación, firma digital

2. **¿Cuál es la diferencia entre SOAP y REST?**
   - SOAP: protocolo, XML, WS-Security, REST: arquitectura, JSON, HTTP

3. **¿Qué es HATEOAS en REST?**
   - Hypermedia as the Engine of Application State, links navegacionales

### Preguntas Intermedias

4. **¿Cómo implementar autenticación JWT en WebServices?**
   - Tokens, filtros, validación, refresh tokens

5. **¿Qué son los interceptores en WebServices?**
   - Middleware, validación, logging, seguridad

6. **¿Cómo manejar transacciones en WebServices?**
   - @Transactional, rollback, propagación, aislamiento

### Preguntas Avanzadas

7. **¿Cómo optimizar performance en WebServices?**
   - Caching, compresión, paginación, monitoreo

8. **¿Qué son los aspectos de seguridad en WebServices?**
   - AOP, validación, auditoría, logging

9. **¿Cómo implementar rate limiting en WebServices?**
   - Bucket algorithm, sliding window, headers, configuración

---

## 📚 Recursos Adicionales

- [WS-Security Documentation](https://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0.pdf)
- [Spring HATEOAS](https://spring.io/projects/spring-hateoas)
- [JWT Documentation](https://jwt.io/)
- [Micrometer Monitoring](https://micrometer.io/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de WebServices avanzados! 🚀** 