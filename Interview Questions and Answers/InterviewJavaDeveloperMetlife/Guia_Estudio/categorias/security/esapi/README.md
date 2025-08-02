# 🛡️ ESAPI - Enterprise Security API Avanzado

## 📋 Índice

1. [Configuración de ESAPI](#configuración-de-esapi)
2. [Validación de Entrada](#validación-de-entrada)
3. [Encriptación y Hashing](#encriptación-y-hashing)
4. [Autenticación y Autorización](#autenticación-y-autorización)
5. [Logging de Seguridad](#logging-de-seguridad)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de ESAPI

### Configuración de ESAPI

```java
// ESAPIConfig.java - Configuración de ESAPI
package com.example.config;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.Logger;
import org.owasp.esapi.errors.EnterpriseSecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@Configuration // Marca como configuración de Spring
public class ESAPIConfig {
    
    // Propiedades de ESAPI inyectadas desde application.properties
    @Value("${esapi.config.file}") // Archivo de configuración ESAPI
    private String esapiConfigFile; // Ruta del archivo de configuración
    
    @Value("${esapi.encryption.key}") // Clave de encriptación
    private String encryptionKey; // Clave para encriptación
    
    @Value("${esapi.validation.enabled}") // Habilitar validación
    private boolean validationEnabled; // Flag para habilitar validación
    
    // Bean para inicializar ESAPI
    @Bean
    public void initializeESAPI() {
        try {
            // Carga configuración de ESAPI
            Properties props = new Properties(); // Crea propiedades
            props.load(new FileInputStream(esapiConfigFile)); // Carga archivo de configuración
            
            // Configura propiedades de ESAPI
            props.setProperty("ESAPI.Encryptor.MasterKey", encryptionKey); // Establece clave maestra
            props.setProperty("ESAPI.Validator.Enabled", String.valueOf(validationEnabled)); // Establece validación
            
            // Inicializa ESAPI con configuración personalizada
            ESAPI.initialize(props); // Inicializa ESAPI
            
            // Verifica inicialización
            Logger logger = ESAPI.getLogger(ESAPIConfig.class); // Obtiene logger
            logger.info(Logger.SECURITY_SUCCESS, "ESAPI initialized successfully"); // Log de éxito
            
            // RESULTADO ESPERADO: ESAPI inicializado correctamente con configuración personalizada
            
        } catch (IOException e) {
            // Maneja errores de configuración
            System.err.println("Error loading ESAPI configuration: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: Error en inicialización de ESAPI
        } catch (EnterpriseSecurityException e) {
            // Maneja errores de seguridad empresarial
            System.err.println("ESAPI security error: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: Error de seguridad en ESAPI
        }
    }
    
    // Bean para logger de ESAPI
    @Bean
    public Logger esapiLogger() {
        return ESAPI.getLogger("ApplicationLogger"); // Crea logger de ESAPI
        
        // RESULTADO ESPERADO: Logger de ESAPI configurado
    }
    
    // Bean para validador de ESAPI
    @Bean
    public org.owasp.esapi.Validator esapiValidator() {
        return ESAPI.validator(); // Obtiene validador de ESAPI
        
        // RESULTADO ESPERADO: Validador de ESAPI configurado
    }
    
    // Bean para encriptador de ESAPI
    @Bean
    public org.owasp.esapi.Encryptor esapiEncryptor() {
        return ESAPI.encryptor(); // Obtiene encriptador de ESAPI
        
        // RESULTADO ESPERADO: Encriptador de ESAPI configurado
    }
    
    // Bean para autenticador de ESAPI
    @Bean
    public org.owasp.esapi.Authenticator esapiAuthenticator() {
        return ESAPI.authenticator(); // Obtiene autenticador de ESAPI
        
        // RESULTADO ESPERADO: Autenticador de ESAPI configurado
    }
}

// ESAPIProperties.java - Propiedades de configuración ESAPI
package com.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component // Marca como componente de Spring
@ConfigurationProperties(prefix = "esapi") // Prefijo para propiedades
public class ESAPIProperties {
    
    private String configFile; // Archivo de configuración
    private String encryptionKey; // Clave de encriptación
    private boolean validationEnabled; // Habilitar validación
    private int maxInputLength; // Longitud máxima de entrada
    private String allowedCharacters; // Caracteres permitidos
    
    // Getters y setters
    public String getConfigFile() {
        return configFile; // Retorna archivo de configuración
    }
    
    public void setConfigFile(String configFile) {
        this.configFile = configFile; // Establece archivo de configuración
    }
    
    public String getEncryptionKey() {
        return encryptionKey; // Retorna clave de encriptación
    }
    
    public void setEncryptionKey(String encryptionKey) {
        this.encryptionKey = encryptionKey; // Establece clave de encriptación
    }
    
    public boolean isValidationEnabled() {
        return validationEnabled; // Retorna si validación está habilitada
    }
    
    public void setValidationEnabled(boolean validationEnabled) {
        this.validationEnabled = validationEnabled; // Establece validación
    }
    
    public int getMaxInputLength() {
        return maxInputLength; // Retorna longitud máxima de entrada
    }
    
    public void setMaxInputLength(int maxInputLength) {
        this.maxInputLength = maxInputLength; // Establece longitud máxima
    }
    
    public String getAllowedCharacters() {
        return allowedCharacters; // Retorna caracteres permitidos
    }
    
    public void setAllowedCharacters(String allowedCharacters) {
        this.allowedCharacters = allowedCharacters; // Establece caracteres permitidos
    }
}

// application.properties - Configuración de ESAPI
/*
# Configuración de ESAPI
esapi.config.file=classpath:ESAPI.properties
esapi.encryption.key=your-secret-encryption-key-here
esapi.validation.enabled=true
esapi.max-input-length=1000
esapi.allowed-characters=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_

# Configuración de logging ESAPI
logging.level.org.owasp.esapi=INFO
logging.level.com.example.security=DEBUG
*/
```

---

## ✅ Validación de Entrada

### Servicio de Validación ESAPI

```java
// ESAPIValidationService.java - Servicio de validación con ESAPI
package com.example.service;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.Validator;
import org.owasp.esapi.errors.ValidationException;
import org.owasp.esapi.reference.validation.StringValidationRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service // Marca como servicio de Spring
public class ESAPIValidationService {
    
    @Autowired
    private Validator esapiValidator; // Inyecta validador de ESAPI
    
    // Método para validar entrada de texto
    public String validateTextInput(String input, String context) throws ValidationException {
        try {
            // Valida entrada usando ESAPI
            String validatedInput = esapiValidator.getValidInput( // Obtiene entrada válida
                    context, // Contexto de validación
                    input, // Entrada a validar
                    "SafeString", // Tipo de validación
                    100, // Longitud máxima
                    false // No permite caracteres especiales
            );
            
            // RESULTADO ESPERADO: Entrada validada y sanitizada
            return validatedInput; // Retorna entrada validada
            
        } catch (ValidationException e) {
            // Maneja errores de validación
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Input validation failed for context: " + context + ", input: " + input // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de validación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para validar email
    public String validateEmail(String email) throws ValidationException {
        try {
            // Valida email usando ESAPI
            String validatedEmail = esapiValidator.getValidInput( // Obtiene email válido
                    "Email validation", // Contexto
                    email, // Email a validar
                    "Email", // Tipo de validación
                    100, // Longitud máxima
                    false // No permite caracteres especiales
            );
            
            // RESULTADO ESPERADO: Email validado y sanitizado
            return validatedEmail; // Retorna email validado
            
        } catch (ValidationException e) {
            // Maneja errores de validación de email
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Email validation failed: " + email // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de validación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para validar URL
    public String validateURL(String url) throws ValidationException {
        try {
            // Valida URL usando ESAPI
            String validatedURL = esapiValidator.getValidInput( // Obtiene URL válida
                    "URL validation", // Contexto
                    url, // URL a validar
                    "URL", // Tipo de validación
                    200, // Longitud máxima
                    false // No permite caracteres especiales
            );
            
            // RESULTADO ESPERADO: URL validada y sanitizada
            return validatedURL; // Retorna URL validada
            
        } catch (ValidationException e) {
            // Maneja errores de validación de URL
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "URL validation failed: " + url // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de validación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para validar número
    public Integer validateNumber(String number) throws ValidationException {
        try {
            // Valida número usando ESAPI
            String validatedNumber = esapiValidator.getValidInput( // Obtiene número válido
                    "Number validation", // Contexto
                    number, // Número a validar
                    "Integer", // Tipo de validación
                    10, // Longitud máxima
                    false // No permite caracteres especiales
            );
            
            // Convierte a Integer
            Integer result = Integer.parseInt(validatedNumber); // Convierte a Integer
            
            // RESULTADO ESPERADO: Número validado y convertido
            return result; // Retorna número validado
            
        } catch (ValidationException e) {
            // Maneja errores de validación de número
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Number validation failed: " + number // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de validación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para validar entrada personalizada con regex
    public String validateCustomInput(String input, String pattern, String context) throws ValidationException {
        try {
            // Crea regla de validación personalizada
            StringValidationRule customRule = new StringValidationRule( // Crea regla personalizada
                    context, // Contexto
                    Pattern.compile(pattern) // Patrón regex compilado
            );
            
            // Valida entrada usando regla personalizada
            String validatedInput = customRule.getValid(input); // Obtiene entrada válida
            
            // RESULTADO ESPERADO: Entrada validada con patrón personalizado
            return validatedInput; // Retorna entrada validada
            
        } catch (ValidationException e) {
            // Maneja errores de validación personalizada
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Custom validation failed for context: " + context + ", input: " + input // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de validación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para sanitizar HTML
    public String sanitizeHTML(String html) {
        try {
            // Sanitiza HTML usando ESAPI
            String sanitizedHTML = esapiValidator.getValidInput( // Obtiene HTML sanitizado
                    "HTML sanitization", // Contexto
                    html, // HTML a sanitizar
                    "HTML", // Tipo de validación
                    10000, // Longitud máxima
                    true // Permite caracteres especiales
            );
            
            // RESULTADO ESPERADO: HTML sanitizado y seguro
            return sanitizedHTML; // Retorna HTML sanitizado
            
        } catch (ValidationException e) {
            // Maneja errores de sanitización
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "HTML sanitization failed: " + html // Mensaje
            );
            
            // RESULTADO ESPERADO: String vacío en caso de error
            return ""; // Retorna string vacío
        }
    }
    
    // Método para validar archivo
    public String validateFileName(String fileName) throws ValidationException {
        try {
            // Valida nombre de archivo usando ESAPI
            String validatedFileName = esapiValidator.getValidInput( // Obtiene nombre válido
                    "File name validation", // Contexto
                    fileName, // Nombre a validar
                    "FileName", // Tipo de validación
                    255, // Longitud máxima
                    false // No permite caracteres especiales
            );
            
            // RESULTADO ESPERADO: Nombre de archivo validado
            return validatedFileName; // Retorna nombre validado
            
        } catch (ValidationException e) {
            // Maneja errores de validación de archivo
            ESAPI.getLogger(ESAPIValidationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "File name validation failed: " + fileName // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de validación lanzada
            throw e; // Re-lanza excepción
        }
    }
}
```

---

## 🔐 Encriptación y Hashing

### Servicio de Encriptación ESAPI

```java
// ESAPIEncryptionService.java - Servicio de encriptación con ESAPI
package com.example.service;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.Encryptor;
import org.owasp.esapi.errors.EncryptionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service // Marca como servicio de Spring
public class ESAPIEncryptionService {
    
    @Autowired
    private Encryptor esapiEncryptor; // Inyecta encriptador de ESAPI
    
    // Método para encriptar texto
    public String encryptText(String plainText) throws EncryptionException {
        try {
            // Encripta texto usando ESAPI
            String encryptedText = esapiEncryptor.encrypt(plainText); // Encripta texto
            
            // RESULTADO ESPERADO: Texto encriptado en formato seguro
            return encryptedText; // Retorna texto encriptado
            
        } catch (EncryptionException e) {
            // Maneja errores de encriptación
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Encryption failed for text: " + plainText, // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de encriptación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para desencriptar texto
    public String decryptText(String encryptedText) throws EncryptionException {
        try {
            // Desencripta texto usando ESAPI
            String decryptedText = esapiEncryptor.decrypt(encryptedText); // Desencripta texto
            
            // RESULTADO ESPERADO: Texto desencriptado
            return decryptedText; // Retorna texto desencriptado
            
        } catch (EncryptionException e) {
            // Maneja errores de desencriptación
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Decryption failed for encrypted text", // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de desencriptación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para generar hash seguro
    public String hashPassword(String password) throws EncryptionException {
        try {
            // Genera hash de contraseña usando ESAPI
            String hashedPassword = esapiEncryptor.hash(password, "salt"); // Genera hash con salt
            
            // RESULTADO ESPERADO: Hash seguro de la contraseña
            return hashedPassword; // Retorna hash
            
        } catch (EncryptionException e) {
            // Maneja errores de hashing
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Password hashing failed", // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de hashing lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para verificar hash
    public boolean verifyHash(String password, String hash) throws EncryptionException {
        try {
            // Verifica hash usando ESAPI
            boolean isValid = esapiEncryptor.verifyHash(password, hash); // Verifica hash
            
            // RESULTADO ESPERADO: true si el hash es válido, false en caso contrario
            return isValid; // Retorna resultado de verificación
            
        } catch (EncryptionException e) {
            // Maneja errores de verificación
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Hash verification failed", // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de verificación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para generar token seguro
    public String generateSecureToken() {
        try {
            // Genera token seguro usando ESAPI
            String secureToken = esapiEncryptor.getRandomString(32); // Genera token de 32 caracteres
            
            // RESULTADO ESPERADO: Token seguro generado
            return secureToken; // Retorna token
            
        } catch (Exception e) {
            // Maneja errores de generación de token
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Secure token generation failed", // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Token generado con SecureRandom como fallback
            return generateFallbackToken(); // Retorna token de fallback
        }
    }
    
    // Método para generar token de fallback
    private String generateFallbackToken() {
        SecureRandom random = new SecureRandom(); // Crea SecureRandom
        byte[] bytes = new byte[32]; // Array de bytes
        random.nextBytes(bytes); // Genera bytes aleatorios
        
        // Convierte a string hexadecimal
        StringBuilder token = new StringBuilder(); // StringBuilder para token
        for (byte b : bytes) { // Itera sobre bytes
            token.append(String.format("%02x", b)); // Agrega byte como hex
        }
        
        // RESULTADO ESPERADO: Token hexadecimal generado con SecureRandom
        return token.toString(); // Retorna token
    }
    
    // Método para encriptar datos sensibles
    public String encryptSensitiveData(String sensitiveData) throws EncryptionException {
        try {
            // Encripta datos sensibles usando ESAPI
            String encryptedData = esapiEncryptor.encrypt(sensitiveData); // Encripta datos
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIEncryptionService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Sensitive data encrypted successfully" // Mensaje
            );
            
            // RESULTADO ESPERADO: Datos sensibles encriptados
            return encryptedData; // Retorna datos encriptados
            
        } catch (EncryptionException e) {
            // Maneja errores de encriptación de datos sensibles
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Sensitive data encryption failed", // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de encriptación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para desencriptar datos sensibles
    public String decryptSensitiveData(String encryptedData) throws EncryptionException {
        try {
            // Desencripta datos sensibles usando ESAPI
            String decryptedData = esapiEncryptor.decrypt(encryptedData); // Desencripta datos
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIEncryptionService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Sensitive data decrypted successfully" // Mensaje
            );
            
            // RESULTADO ESPERADO: Datos sensibles desencriptados
            return decryptedData; // Retorna datos desencriptados
            
        } catch (EncryptionException e) {
            // Maneja errores de desencriptación de datos sensibles
            ESAPI.getLogger(ESAPIEncryptionService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Sensitive data decryption failed", // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de desencriptación lanzada
            throw e; // Re-lanza excepción
        }
    }
}
```

---

## 🔑 Autenticación y Autorización

### Servicio de Autenticación ESAPI

```java
// ESAPIAuthenticationService.java - Servicio de autenticación con ESAPI
package com.example.service;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.Authenticator;
import org.owasp.esapi.User;
import org.owasp.esapi.errors.AuthenticationException;
import org.owasp.esapi.errors.EncryptionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service // Marca como servicio de Spring
public class ESAPIAuthenticationService {
    
    @Autowired
    private Authenticator esapiAuthenticator; // Inyecta autenticador de ESAPI
    
    @Autowired
    private ESAPIEncryptionService encryptionService; // Inyecta servicio de encriptación
    
    // Método para autenticar usuario
    public User authenticateUser(String username, String password) throws AuthenticationException {
        try {
            // Autentica usuario usando ESAPI
            User user = esapiAuthenticator.login(username, password); // Autentica usuario
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "User authenticated successfully: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Usuario autenticado correctamente
            return user; // Retorna usuario autenticado
            
        } catch (AuthenticationException e) {
            // Maneja errores de autenticación
            ESAPI.getLogger(ESAPIAuthenticationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Authentication failed for user: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de autenticación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para crear usuario
    public User createUser(String username, String password) throws AuthenticationException {
        try {
            // Crea usuario usando ESAPI
            User user = esapiAuthenticator.createUser(username, password, password); // Crea usuario
            
            // Configura propiedades del usuario
            user.setAccountLocked(false); // Desbloquea cuenta
            user.setAccountExpired(false); // No expira cuenta
            user.setCredentialsExpired(false); // No expiran credenciales
            user.setEnabled(true); // Habilita usuario
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "User created successfully: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Usuario creado correctamente
            return user; // Retorna usuario creado
            
        } catch (AuthenticationException e) {
            // Maneja errores de creación de usuario
            ESAPI.getLogger(ESAPIAuthenticationService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "User creation failed for: " + username, // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de creación lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para cambiar contraseña
    public void changePassword(String username, String oldPassword, String newPassword) throws AuthenticationException {
        try {
            // Obtiene usuario
            User user = esapiAuthenticator.getUser(username); // Obtiene usuario
            
            // Cambia contraseña usando ESAPI
            user.changePassword(oldPassword, newPassword, newPassword); // Cambia contraseña
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Password changed successfully for user: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Contraseña cambiada correctamente
            
        } catch (AuthenticationException e) {
            // Maneja errores de cambio de contraseña
            ESAPI.getLogger(ESAPIAuthenticationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Password change failed for user: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Excepción de cambio de contraseña lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para verificar permisos
    public boolean hasPermission(String username, String permission) {
        try {
            // Obtiene usuario
            User user = esapiAuthenticator.getUser(username); // Obtiene usuario
            
            // Verifica permiso usando ESAPI
            boolean hasPermission = user.hasRole(permission); // Verifica rol
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "Permission check for user: " + username + ", permission: " + permission + ", result: " + hasPermission // Mensaje
            );
            
            // RESULTADO ESPERADO: true si tiene permiso, false en caso contrario
            return hasPermission; // Retorna resultado
            
        } catch (Exception e) {
            // Maneja errores de verificación de permisos
            ESAPI.getLogger(ESAPIAuthenticationService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Permission check failed for user: " + username + ", permission: " + permission, // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: false en caso de error
            return false; // Retorna false
        }
    }
    
    // Método para bloquear usuario
    public void lockUser(String username) throws AuthenticationException {
        try {
            // Obtiene usuario
            User user = esapiAuthenticator.getUser(username); // Obtiene usuario
            
            // Bloquea usuario usando ESAPI
            user.lock(); // Bloquea usuario
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).warning( // Log de advertencia
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "User locked: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Usuario bloqueado correctamente
            
        } catch (AuthenticationException e) {
            // Maneja errores de bloqueo
            ESAPI.getLogger(ESAPIAuthenticationService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "User lock failed for: " + username, // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de bloqueo lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para desbloquear usuario
    public void unlockUser(String username) throws AuthenticationException {
        try {
            // Obtiene usuario
            User user = esapiAuthenticator.getUser(username); // Obtiene usuario
            
            // Desbloquea usuario usando ESAPI
            user.unlock(); // Desbloquea usuario
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "User unlocked: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Usuario desbloqueado correctamente
            
        } catch (AuthenticationException e) {
            // Maneja errores de desbloqueo
            ESAPI.getLogger(ESAPIAuthenticationService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "User unlock failed for: " + username, // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Excepción de desbloqueo lanzada
            throw e; // Re-lanza excepción
        }
    }
    
    // Método para cerrar sesión
    public void logout(String username) {
        try {
            // Obtiene usuario
            User user = esapiAuthenticator.getUser(username); // Obtiene usuario
            
            // Cierra sesión usando ESAPI
            esapiAuthenticator.logout(user); // Cierra sesión
            
            // Log de auditoría
            ESAPI.getLogger(ESAPIAuthenticationService.class).info( // Log de información
                    org.owasp.esapi.Logger.SECURITY_AUDIT, // Tipo de log
                    "User logged out: " + username // Mensaje
            );
            
            // RESULTADO ESPERADO: Sesión cerrada correctamente
            
        } catch (Exception e) {
            // Maneja errores de cierre de sesión
            ESAPI.getLogger(ESAPIAuthenticationService.class).error( // Log de error
                    org.owasp.esapi.Logger.SECURITY_FAILURE, // Tipo de log
                    "Logout failed for user: " + username, // Mensaje
                    e // Excepción
            );
            
            // RESULTADO ESPERADO: Error en cierre de sesión
        }
    }
}
```

---

## 📝 Logging de Seguridad

### Servicio de Logging ESAPI

```java
// ESAPILoggingService.java - Servicio de logging de seguridad con ESAPI
package com.example.service;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service // Marca como servicio de Spring
public class ESAPILoggingService {
    
    @Autowired
    private Logger esapiLogger; // Inyecta logger de ESAPI
    
    // Método para log de eventos de seguridad exitosos
    public void logSecuritySuccess(String event, String details) {
        esapiLogger.info( // Log de información
                Logger.SECURITY_SUCCESS, // Tipo de log
                "Security success - Event: " + event + ", Details: " + details + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Evento de seguridad exitoso registrado
    }
    
    // Método para log de eventos de seguridad fallidos
    public void logSecurityFailure(String event, String details, Exception exception) {
        esapiLogger.error( // Log de error
                Logger.SECURITY_FAILURE, // Tipo de log
                "Security failure - Event: " + event + ", Details: " + details + ", Timestamp: " + new Date(), // Mensaje
                exception // Excepción
        );
        
        // RESULTADO ESPERADO: Evento de seguridad fallido registrado
    }
    
    // Método para log de auditoría
    public void logSecurityAudit(String event, String user, String action) {
        esapiLogger.info( // Log de información
                Logger.SECURITY_AUDIT, // Tipo de log
                "Security audit - Event: " + event + ", User: " + user + ", Action: " + action + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Evento de auditoría registrado
    }
    
    // Método para log de advertencias de seguridad
    public void logSecurityWarning(String event, String details) {
        esapiLogger.warning( // Log de advertencia
                Logger.SECURITY_AUDIT, // Tipo de log
                "Security warning - Event: " + event + ", Details: " + details + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Advertencia de seguridad registrada
    }
    
    // Método para log de intentos de acceso
    public void logAccessAttempt(String username, String resource, boolean success) {
        String event = success ? "Access granted" : "Access denied"; // Determina evento
        String logLevel = success ? Logger.SECURITY_SUCCESS : Logger.SECURITY_FAILURE; // Determina nivel de log
        
        esapiLogger.info( // Log de información
                logLevel, // Tipo de log
                "Access attempt - User: " + username + ", Resource: " + resource + ", Result: " + event + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Intento de acceso registrado
    }
    
    // Método para log de cambios de configuración
    public void logConfigurationChange(String user, String setting, String oldValue, String newValue) {
        esapiLogger.info( // Log de información
                Logger.SECURITY_AUDIT, // Tipo de log
                "Configuration change - User: " + user + ", Setting: " + setting + ", Old Value: " + oldValue + ", New Value: " + newValue + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Cambio de configuración registrado
    }
    
    // Método para log de errores de validación
    public void logValidationError(String input, String context, String error) {
        esapiLogger.warning( // Log de advertencia
                Logger.SECURITY_AUDIT, // Tipo de log
                "Validation error - Context: " + context + ", Input: " + input + ", Error: " + error + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Error de validación registrado
    }
    
    // Método para log de eventos de encriptación
    public void logEncryptionEvent(String operation, String dataType, boolean success) {
        String event = success ? "Encryption success" : "Encryption failure"; // Determina evento
        String logLevel = success ? Logger.SECURITY_SUCCESS : Logger.SECURITY_FAILURE; // Determina nivel de log
        
        esapiLogger.info( // Log de información
                logLevel, // Tipo de log
                "Encryption event - Operation: " + operation + ", Data Type: " + dataType + ", Result: " + event + ", Timestamp: " + new Date() // Mensaje
        );
        
        // RESULTADO ESPERADO: Evento de encriptación registrado
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es ESAPI y cuáles son sus características principales?**
   - Enterprise Security API, validación, encriptación, autenticación, logging

2. **¿Cuál es la diferencia entre ESAPI y Spring Security?**
   - ESAPI: más específico para OWASP, Spring Security: framework completo

3. **¿Qué son las reglas de validación en ESAPI?**
   - Patrones predefinidos, validación de entrada, sanitización

### Preguntas Intermedias

4. **¿Cómo configurar ESAPI en una aplicación Spring?**
   - Archivo de configuración, inicialización, beans de configuración

5. **¿Qué tipos de validación ofrece ESAPI?**
   - String, Email, URL, Integer, FileName, HTML

6. **¿Cómo manejar encriptación con ESAPI?**
   - Encryptor, hash, tokens, datos sensibles

### Preguntas Avanzadas

7. **¿Cómo integrar ESAPI con OWASP Top 10?**
   - Prevención de vulnerabilidades, validación de entrada, logging

8. **¿Qué son los aspectos de seguridad en ESAPI?**
   - Logging, auditoría, monitoreo de eventos

9. **¿Cómo optimizar performance con ESAPI?**
   - Caching, configuración, validación eficiente

---

## 📚 Recursos Adicionales

- [ESAPI Documentation](https://owasp.org/www-project-enterprise-security-api/)
- [ESAPI Java](https://github.com/ESAPI/esapi-java-legacy)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ESAPI Configuration](https://owasp.org/www-project-enterprise-security-api/releases/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de ESAPI! 🚀** 