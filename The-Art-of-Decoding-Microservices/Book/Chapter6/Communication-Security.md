# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Seguridad en la Comunicación (TLS/SSL, mTLS, Encriptación)

---

### 1. Introducción y Teoría

La seguridad en la comunicación entre microservicios es fundamental para proteger los datos en tránsito. Los principales mecanismos incluyen:

- **TLS/SSL**: Encriptación de la comunicación entre cliente y servidor.
- **mTLS (Mutual TLS)**: Autenticación bidireccional usando certificados.
- **Encriptación de datos**: Protección de datos sensibles en reposo y en tránsito.
- **Rate Limiting**: Protección contra ataques de denegación de servicio.

---

### 2. Ejemplo de Código: Configuración TLS/SSL en Spring Boot

#### 2.1. Configuración del servidor con TLS

```java
// Configuración de seguridad TLS para el servidor
@Configuration
public class TlsConfig {
    
    // Configuración del servidor HTTPS
    @Bean
    public ServletWebServerFactory servletContainer() {
        // Crea un servidor Tomcat con configuración HTTPS
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        // Añade conector HTTPS con configuración TLS
        tomcat.addAdditionalTomcatConnectors(createSslConnector());
        return tomcat;
    }
    
    // Crea el conector SSL/TLS
    private Connector createSslConnector() {
        // Crea un conector para el puerto 8443 (HTTPS)
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        // Configura el puerto HTTPS
        connector.setScheme("https");
        connector.setSecure(true);
        connector.setPort(8443);
        // Configura el archivo keystore para certificados
        connector.setProperty("keystoreFile", "keystore.p12");
        connector.setProperty("keystorePass", "password");
        connector.setProperty("keystoreType", "PKCS12");
        // Habilita TLS 1.2 y 1.3
        connector.setProperty("sslProtocol", "TLS");
        connector.setProperty("sslEnabledProtocols", "TLSv1.2,TLSv1.3");
        return connector;
    }
}
```

#### 2.2. Configuración del cliente con certificados

```java
// Configuración del cliente HTTP con certificados
@Configuration
public class HttpClientConfig {
    
    // Bean para RestTemplate con configuración SSL
    @Bean
    public RestTemplate restTemplate() throws Exception {
        // Crea un RestTemplate con configuración SSL personalizada
        RestTemplate restTemplate = new RestTemplate();
        // Configura el cliente HTTP con certificados
        restTemplate.setRequestFactory(clientHttpRequestFactory());
        return restTemplate;
    }
    
    // Configura el factory de requests HTTP con SSL
    private ClientHttpRequestFactory clientHttpRequestFactory() throws Exception {
        // Carga el certificado del cliente
        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        keyStore.load(new FileInputStream("client-keystore.p12"), "password".toCharArray());
        
        // Configura el KeyManagerFactory
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keyStore, "password".toCharArray());
        
        // Carga el certificado del servidor (truststore)
        KeyStore trustStore = KeyStore.getInstance("PKCS12");
        trustStore.load(new FileInputStream("truststore.p12"), "password".toCharArray());
        
        // Configura el TrustManagerFactory
        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(trustStore);
        
        // Crea el contexto SSL
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), null);
        
        // Configura el cliente HTTP con SSL
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setHttpClient(HttpClients.custom()
                .setSSLContext(sslContext)
                .build());
        
        return factory;
    }
}
```

---

### 3. Ejemplo de Código: Rate Limiting

#### 3.1. Implementación de Rate Limiting con Bucket4j

```java
// Servicio de Rate Limiting usando Bucket4j
@Service
public class RateLimitingService {
    
    // Mapa para almacenar buckets por IP
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    // Configuración del rate limit: 10 requests por minuto
    private static final int REQUESTS_PER_MINUTE = 10;
    
    // Verifica si la IP puede hacer una petición
    public boolean allowRequest(String clientIp) {
        // Obtiene o crea el bucket para la IP
        Bucket bucket = buckets.computeIfAbsent(clientIp, this::createBucket);
        // Intenta consumir un token del bucket
        return bucket.tryConsume(1);
    }
    
    // Crea un nuevo bucket para una IP
    private Bucket createBucket(String clientIp) {
        // Configura el bucket con 10 tokens y recarga cada minuto
        return Bucket.builder()
                .addLimit(Bandwidth.classic(REQUESTS_PER_MINUTE, Refill.intervally(REQUESTS_PER_MINUTE, Duration.ofMinutes(1))))
                .build();
    }
}
```

#### 3.2. Filtro para aplicar Rate Limiting

```java
// Filtro para aplicar Rate Limiting en todas las peticiones
@Component
public class RateLimitingFilter extends OncePerRequestFilter {
    
    @Autowired
    private RateLimitingService rateLimitingService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {
        // Obtiene la IP del cliente
        String clientIp = getClientIpAddress(request);
        
        // Verifica si la IP puede hacer la petición
        if (!rateLimitingService.allowRequest(clientIp)) {
            // Si excede el límite, retorna 429 Too Many Requests
            response.setStatus(HttpServletResponse.SC_TOO_MANY_REQUESTS);
            response.getWriter().write("Rate limit exceeded");
            return;
        }
        
        // Si está dentro del límite, continúa con la petición
        filterChain.doFilter(request, response);
    }
    
    // Extrae la IP real del cliente (considerando proxies)
    private String getClientIpAddress(HttpServletRequest request) {
        // Verifica headers de proxy comunes
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Retorna la primera IP en la lista
            return xForwardedFor.split(",")[0].trim();
        }
        // Si no hay proxy, retorna la IP directa
        return request.getRemoteAddr();
    }
}
```

---

### 4. Ejemplo de Código: Encriptación de Datos

#### 4.1. Servicio de encriptación

```java
// Servicio para encriptar y desencriptar datos
@Service
public class EncryptionService {
    
    // Clave secreta para encriptación (en producción, usar variables de entorno)
    private static final String SECRET_KEY = "MySecretKey123456789012345678901234";
    
    // Algoritmo de encriptación
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    
    // Encripta un texto plano
    public String encrypt(String plainText) throws Exception {
        // Crea la clave secreta
        SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
        
        // Crea el cipher para encriptación
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        
        // Encripta el texto
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        
        // Convierte a Base64 para almacenamiento/transmisión
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }
    
    // Desencripta un texto encriptado
    public String decrypt(String encryptedText) throws Exception {
        // Crea la clave secreta
        SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
        
        // Crea el cipher para desencriptación
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key);
        
        // Decodifica de Base64
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedText);
        
        // Desencripta
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        
        // Convierte a String
        return new String(decryptedBytes);
    }
}
```

#### 4.2. Uso en entidades sensibles

```java
// Entidad con datos sensibles encriptados
@Entity
public class UsuarioSensible {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Campo encriptado
    @Convert(converter = EncryptedStringConverter.class)
    private String numeroTarjeta;
    
    // Campo encriptado
    @Convert(converter = EncryptedStringConverter.class)
    private String cvv;
    
    // ... getters y setters ...
}

// Convertidor para encriptar/desencriptar automáticamente
@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {
    
    @Autowired
    private EncryptionService encryptionService;
    
    @Override
    public String convertToDatabaseColumn(String attribute) {
        try {
            // Encripta antes de guardar en BD
            return encryptionService.encrypt(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Error encriptando dato", e);
        }
    }
    
    @Override
    public String convertToEntityAttribute(String dbData) {
        try {
            // Desencripta al leer de BD
            return encryptionService.decrypt(dbData);
        } catch (Exception e) {
            throw new RuntimeException("Error desencriptando dato", e);
        }
    }
}
```

---

### 5. Pruebas Unitarias para Seguridad en Comunicación

#### 5.1. Prueba de Rate Limiting

```java
// Prueba unitaria para Rate Limiting
@SpringBootTest
public class RateLimitingTest {
    
    @Autowired
    private RateLimitingService rateLimitingService;
    
    @Test
    public void testRateLimiting() {
        String clientIp = "192.168.1.1";
        
        // Primeras 10 peticiones deben ser permitidas
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimitingService.allowRequest(clientIp));
        }
        
        // La petición 11 debe ser denegada
        assertFalse(rateLimitingService.allowRequest(clientIp));
    }
}
```

#### 5.2. Prueba de encriptación

```java
// Prueba unitaria para encriptación
@SpringBootTest
public class EncryptionTest {
    
    @Autowired
    private EncryptionService encryptionService;
    
    @Test
    public void testEncryptionDecryption() throws Exception {
        String originalText = "Dato sensible 123";
        
        // Encripta el texto
        String encrypted = encryptionService.encrypt(originalText);
        
        // Verifica que el texto encriptado es diferente
        assertNotEquals(originalText, encrypted);
        
        // Desencripta el texto
        String decrypted = encryptionService.decrypt(encrypted);
        
        // Verifica que el texto desencriptado es igual al original
        assertEquals(originalText, decrypted);
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Uso de certificados wildcard**: Para simplificar la gestión de certificados en múltiples subdominios.
- **Rotación automática de claves**: Implementar rotación periódica de claves de encriptación.
- **Hardware Security Modules (HSM)**: Para almacenar claves de forma más segura.
- **API Gateway con Rate Limiting**: Centralizar el rate limiting en el gateway.
- **Monitoreo de seguridad**: Alertas para intentos de acceso no autorizado.

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Comunicación TLS**:
    - Cliente se conecta con certificado válido → Conexión HTTPS establecida.
    - Datos transmitidos encriptados → Protección en tránsito.
- **Rate Limiting**:
    - Cliente dentro del límite → Petición procesada normalmente.
    - Cliente excede límite → HTTP 429 Too Many Requests.
- **Encriptación**:
    - Dato encriptado correctamente → Dato protegido en reposo.
    - Dato desencriptado correctamente → Dato legible para aplicación.

#### 7.2. Escenarios de error

- **TLS**:
    - Certificado inválido → Conexión rechazada.
    - Certificado expirado → Conexión rechazada.
- **Rate Limiting**:
    - Demasiadas peticiones → HTTP 429, cliente debe esperar.
- **Encriptación**:
    - Clave incorrecta → Error de desencriptación.
    - Dato corrupto → Error de desencriptación.

---

### 8. Explicación Detallada de la Lógica

- **TLS/SSL**: Establece una conexión encriptada entre cliente y servidor usando certificados digitales.
- **Rate Limiting**: Controla el número de peticiones por cliente para prevenir abuso.
- **Encriptación**: Protege datos sensibles convirtiéndolos en texto ilegible sin la clave correcta.
- **mTLS**: Requiere que tanto cliente como servidor se autentiquen mutuamente con certificados.

---

¿Deseas que continúe con la siguiente sección del capítulo 6 (por ejemplo, "Métricas y Monitoreo" o "Logging Centralizado")? 