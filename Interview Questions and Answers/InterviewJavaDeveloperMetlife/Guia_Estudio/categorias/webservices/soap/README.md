# 📡 SOAP Web Services - Guía de Estudio Detallada

## 📋 Índice

1. [Configuración de SOAP](#configuración-de-soap)
2. [Servicios SOAP](#servicios-soap)
3. [Cliente SOAP](#cliente-soap)
4. [Testing de SOAP](#testing-de-soap)
5. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de SOAP

### Configuración de Spring WS

```java
// SoapConfig.java - Configuración de SOAP Web Services
package com.example.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.server.EndpointInterceptor;
import org.springframework.ws.soap.server.endpoint.interceptor.PayloadValidatingInterceptor;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

import java.util.List;

@EnableWs // Habilita SOAP Web Services en Spring
@Configuration // Marca como configuración de Spring
public class SoapConfig extends WsConfigurerAdapter {
    
    // Bean para MessageDispatcherServlet - Maneja peticiones SOAP
    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(ApplicationContext applicationContext) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet(); // Crea servlet para SOAP
        servlet.setApplicationContext(applicationContext); // Establece contexto de aplicación
        servlet.setTransformWsdlLocations(true); // Permite transformación de ubicaciones WSDL
        
        // RESULTADO ESPERADO: Servlet configurado para manejar peticiones SOAP en /ws/*
        return new ServletRegistrationBean<>(servlet, "/ws/*"); // Registra servlet en ruta /ws/*
    }
    
    // Bean para definición WSDL - Genera WSDL automáticamente
    @Bean(name = "users") // Nombre del servicio WSDL
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema usersSchema) {
        DefaultWsdl11Definition wsdl11Definition = new DefaultWsdl11Definition(); // Crea definición WSDL
        wsdl11Definition.setPortTypeName("UsersPort"); // Establece nombre del puerto
        wsdl11Definition.setLocationUri("/ws"); // Establece URI del servicio
        wsdl11Definition.setTargetNamespace("http://example.com/users"); // Establece namespace
        wsdl11Definition.setSchema(usersSchema); // Establece esquema XML
        
        // RESULTADO ESPERADO: WSDL disponible en http://localhost:8080/ws/users.wsdl
        return wsdl11Definition; // Retorna definición WSDL
    }
    
    // Bean para esquema XML - Define estructura de mensajes SOAP
    @Bean
    public XsdSchema usersSchema() {
        // Carga esquema XML desde archivo resources/users.xsd
        return new SimpleXsdSchema(new ClassPathResource("users.xsd")); // Retorna esquema XML
    }
    
    // Bean para interceptor de validación - Valida mensajes SOAP
    @Bean
    public PayloadValidatingInterceptor payloadValidatingInterceptor() {
        PayloadValidatingInterceptor interceptor = new PayloadValidatingInterceptor(); // Crea interceptor
        interceptor.setValidateRequest(true); // Valida peticiones entrantes
        interceptor.setValidateResponse(true); // Valida respuestas salientes
        interceptor.setXsdSchema(usersSchema()); // Establece esquema para validación
        
        // RESULTADO ESPERADO: Todos los mensajes SOAP se validan contra el esquema XML
        return interceptor; // Retorna interceptor configurado
    }
    
    // Configuración de interceptores - Agrega interceptores al pipeline
    @Override
    public void addInterceptors(List<EndpointInterceptor> interceptors) {
        interceptors.add(payloadValidatingInterceptor()); // Agrega interceptor de validación
        // RESULTADO ESPERADO: Interceptor de validación aplicado a todos los endpoints
    }
}

// users.xsd - Esquema XML para mensajes SOAP
/*
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           xmlns:tns="http://example.com/users"
           targetNamespace="http://example.com/users"
           elementFormDefault="qualified">

    <!-- Definición de tipos complejos -->
    <xs:complexType name="User">
        <xs:sequence>
            <xs:element name="id" type="xs:long" minOccurs="0"/>
            <xs:element name="username" type="xs:string"/>
            <xs:element name="email" type="xs:string"/>
            <xs:element name="firstName" type="xs:string" minOccurs="0"/>
            <xs:element name="lastName" type="xs:string" minOccurs="0"/>
            <xs:element name="enabled" type="xs:boolean" default="true"/>
        </xs:sequence>
    </xs:complexType>

    <!-- Definición de tipos de respuesta -->
    <xs:complexType name="GetUserRequest">
        <xs:sequence>
            <xs:element name="id" type="xs:long"/>
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="GetUserResponse">
        <xs:sequence>
            <xs:element name="user" type="tns:User" minOccurs="0"/>
        </xs:sequence>
    </xs:complexType>

    <!-- Definición de elementos de mensaje -->
    <xs:element name="getUserRequest" type="tns:GetUserRequest"/>
    <xs:element name="getUserResponse" type="tns:GetUserResponse"/>
    <xs:element name="createUserRequest" type="tns:User"/>
    <xs:element name="createUserResponse" type="tns:User"/>
    <xs:element name="updateUserRequest" type="tns:User"/>
    <xs:element name="updateUserResponse" type="tns:User"/>
    <xs:element name="deleteUserRequest" type="tns:GetUserRequest"/>
    <xs:element name="deleteUserResponse" type="xs:boolean"/>
    <xs:element name="getAllUsersRequest" type="xs:string"/>
    <xs:element name="getAllUsersResponse">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="users" type="tns:User" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
</xs:schema>
*/
```

---

## 🔄 Servicios SOAP

### Endpoint SOAP

```java
// UserEndpoint.java - Endpoint SOAP para servicios de usuario
package com.example.endpoint;

import com.example.model.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint // Marca como endpoint SOAP
public class UserEndpoint {
    
    private static final String NAMESPACE_URI = "http://example.com/users"; // Namespace del servicio
    
    private final UserService userService; // Servicio de usuarios inyectado
    
    @Autowired
    public UserEndpoint(UserService userService) {
        this.userService = userService; // Inyecta servicio de usuarios
    }
    
    // Endpoint para obtener usuario por ID
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUserRequest") // Mapea petición SOAP
    @ResponsePayload // Indica que es respuesta SOAP
    public GetUserResponse getUser(@RequestPayload GetUserRequest request) {
        // Obtiene ID del usuario desde la petición SOAP
        Long userId = request.getId(); // Extrae ID de la petición
        
        // Busca usuario usando el servicio
        User user = userService.getUserById(userId); // Obtiene usuario por ID
        
        // Crea respuesta SOAP
        GetUserResponse response = new GetUserResponse(); // Crea objeto de respuesta
        response.setUser(user); // Establece usuario en la respuesta
        
        // RESULTADO ESPERADO: Respuesta SOAP con datos del usuario o null si no existe
        return response; // Retorna respuesta SOAP
    }
    
    // Endpoint para crear usuario
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createUserRequest") // Mapea petición SOAP
    @ResponsePayload // Indica que es respuesta SOAP
    public CreateUserResponse createUser(@RequestPayload User request) {
        // Crea usuario usando el servicio
        User createdUser = userService.createUser(request); // Crea usuario
        
        // Crea respuesta SOAP
        CreateUserResponse response = new CreateUserResponse(); // Crea objeto de respuesta
        response.setUser(createdUser); // Establece usuario creado en la respuesta
        
        // RESULTADO ESPERADO: Respuesta SOAP con usuario creado e ID generado
        return response; // Retorna respuesta SOAP
    }
    
    // Endpoint para actualizar usuario
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateUserRequest") // Mapea petición SOAP
    @ResponsePayload // Indica que es respuesta SOAP
    public UpdateUserResponse updateUser(@RequestPayload User request) {
        // Actualiza usuario usando el servicio
        User updatedUser = userService.updateUser(request.getId(), request); // Actualiza usuario
        
        // Crea respuesta SOAP
        UpdateUserResponse response = new UpdateUserResponse(); // Crea objeto de respuesta
        response.setUser(updatedUser); // Establece usuario actualizado en la respuesta
        
        // RESULTADO ESPERADO: Respuesta SOAP con usuario actualizado
        return response; // Retorna respuesta SOAP
    }
    
    // Endpoint para eliminar usuario
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteUserRequest") // Mapea petición SOAP
    @ResponsePayload // Indica que es respuesta SOAP
    public DeleteUserResponse deleteUser(@RequestPayload GetUserRequest request) {
        // Elimina usuario usando el servicio
        boolean deleted = userService.deleteUser(request.getId()); // Elimina usuario
        
        // Crea respuesta SOAP
        DeleteUserResponse response = new DeleteUserResponse(); // Crea objeto de respuesta
        response.setSuccess(deleted); // Establece resultado de eliminación
        
        // RESULTADO ESPERADO: Respuesta SOAP con true si se eliminó, false si no existía
        return response; // Retorna respuesta SOAP
    }
    
    // Endpoint para obtener todos los usuarios
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAllUsersRequest") // Mapea petición SOAP
    @ResponsePayload // Indica que es respuesta SOAP
    public GetAllUsersResponse getAllUsers(@RequestPayload String request) {
        // Obtiene todos los usuarios usando el servicio
        List<User> users = userService.getAllUsers(); // Obtiene lista de usuarios
        
        // Crea respuesta SOAP
        GetAllUsersResponse response = new GetAllUsersResponse(); // Crea objeto de respuesta
        response.getUsers().addAll(users); // Agrega usuarios a la respuesta
        
        // RESULTADO ESPERADO: Respuesta SOAP con lista de todos los usuarios
        return response; // Retorna respuesta SOAP
    }
}

// Clases de respuesta SOAP (generadas automáticamente por JAXB)
// GetUserResponse.java
public class GetUserResponse {
    private User user; // Usuario de la respuesta
    
    public User getUser() { return user; } // Getter
    public void setUser(User user) { this.user = user; } // Setter
}

// CreateUserResponse.java
public class CreateUserResponse {
    private User user; // Usuario creado
    
    public User getUser() { return user; } // Getter
    public void setUser(User user) { this.user = user; } // Setter
}

// UpdateUserResponse.java
public class UpdateUserResponse {
    private User user; // Usuario actualizado
    
    public User getUser() { return user; } // Getter
    public void setUser(User user) { this.user = user; } // Setter
}

// DeleteUserResponse.java
public class DeleteUserResponse {
    private boolean success; // Resultado de eliminación
    
    public boolean isSuccess() { return success; } // Getter
    public void setSuccess(boolean success) { this.success = success; } // Setter
}

// GetAllUsersResponse.java
public class GetAllUsersResponse {
    private List<User> users = new ArrayList<>(); // Lista de usuarios
    
    public List<User> getUsers() { return users; } // Getter
    public void setUsers(List<User> users) { this.users = users; } // Setter
}
```

---

## 🔧 Cliente SOAP

### Cliente SOAP con Spring WS

```java
// UserSoapClient.java - Cliente SOAP para consumir servicios
package com.example.client;

import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

@Component // Marca como componente de Spring
public class UserSoapClient extends WebServiceGatewaySupport {
    
    private static final String SOAP_ACTION_GET_USER = "http://example.com/users/getUserRequest"; // SOAP Action
    private static final String SOAP_ACTION_CREATE_USER = "http://example.com/users/createUserRequest"; // SOAP Action
    private static final String SOAP_ACTION_UPDATE_USER = "http://example.com/users/updateUserRequest"; // SOAP Action
    private static final String SOAP_ACTION_DELETE_USER = "http://example.com/users/deleteUserRequest"; // SOAP Action
    private static final String SOAP_ACTION_GET_ALL_USERS = "http://example.com/users/getAllUsersRequest"; // SOAP Action
    
    // Método para obtener usuario por ID
    public GetUserResponse getUser(Long userId) {
        // Crea petición SOAP
        GetUserRequest request = new GetUserRequest(); // Crea objeto de petición
        request.setId(userId); // Establece ID del usuario
        
        // Envía petición SOAP y obtiene respuesta
        GetUserResponse response = (GetUserResponse) getWebServiceTemplate() // Obtiene template SOAP
                .marshalSendAndReceive( // Envía y recibe mensaje SOAP
                        "http://localhost:8080/ws", // URL del servicio SOAP
                        request, // Petición SOAP
                        new SoapActionCallback(SOAP_ACTION_GET_USER) // Callback con SOAP Action
                );
        
        // RESULTADO ESPERADO: Respuesta SOAP con datos del usuario o null si no existe
        return response; // Retorna respuesta SOAP
    }
    
    // Método para crear usuario
    public CreateUserResponse createUser(User user) {
        // Envía petición SOAP y obtiene respuesta
        CreateUserResponse response = (CreateUserResponse) getWebServiceTemplate() // Obtiene template SOAP
                .marshalSendAndReceive( // Envía y recibe mensaje SOAP
                        "http://localhost:8080/ws", // URL del servicio SOAP
                        user, // Usuario a crear
                        new SoapActionCallback(SOAP_ACTION_CREATE_USER) // Callback con SOAP Action
                );
        
        // RESULTADO ESPERADO: Respuesta SOAP con usuario creado e ID generado
        return response; // Retorna respuesta SOAP
    }
    
    // Método para actualizar usuario
    public UpdateUserResponse updateUser(User user) {
        // Envía petición SOAP y obtiene respuesta
        UpdateUserResponse response = (UpdateUserResponse) getWebServiceTemplate() // Obtiene template SOAP
                .marshalSendAndReceive( // Envía y recibe mensaje SOAP
                        "http://localhost:8080/ws", // URL del servicio SOAP
                        user, // Usuario a actualizar
                        new SoapActionCallback(SOAP_ACTION_UPDATE_USER) // Callback con SOAP Action
                );
        
        // RESULTADO ESPERADO: Respuesta SOAP con usuario actualizado
        return response; // Retorna respuesta SOAP
    }
    
    // Método para eliminar usuario
    public DeleteUserResponse deleteUser(Long userId) {
        // Crea petición SOAP
        GetUserRequest request = new GetUserRequest(); // Crea objeto de petición
        request.setId(userId); // Establece ID del usuario
        
        // Envía petición SOAP y obtiene respuesta
        DeleteUserResponse response = (DeleteUserResponse) getWebServiceTemplate() // Obtiene template SOAP
                .marshalSendAndReceive( // Envía y recibe mensaje SOAP
                        "http://localhost:8080/ws", // URL del servicio SOAP
                        request, // Petición SOAP
                        new SoapActionCallback(SOAP_ACTION_DELETE_USER) // Callback con SOAP Action
                );
        
        // RESULTADO ESPERADO: Respuesta SOAP con true si se eliminó, false si no existía
        return response; // Retorna respuesta SOAP
    }
    
    // Método para obtener todos los usuarios
    public GetAllUsersResponse getAllUsers() {
        // Envía petición SOAP y obtiene respuesta
        GetAllUsersResponse response = (GetAllUsersResponse) getWebServiceTemplate() // Obtiene template SOAP
                .marshalSendAndReceive( // Envía y recibe mensaje SOAP
                        "http://localhost:8080/ws", // URL del servicio SOAP
                        "", // Petición vacía
                        new SoapActionCallback(SOAP_ACTION_GET_ALL_USERS) // Callback con SOAP Action
                );
        
        // RESULTADO ESPERADO: Respuesta SOAP con lista de todos los usuarios
        return response; // Retorna respuesta SOAP
    }
}

// SoapClientConfig.java - Configuración del cliente SOAP
@Configuration // Marca como configuración de Spring
public class SoapClientConfig {
    
    // Bean para WebServiceTemplate - Template para peticiones SOAP
    @Bean
    public WebServiceTemplate webServiceTemplate() {
        WebServiceTemplate webServiceTemplate = new WebServiceTemplate(); // Crea template SOAP
        
        // Configura marshaller/unmarshaller JAXB
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller(); // Crea marshaller JAXB
        marshaller.setContextPath("com.example.model"); // Establece paquete de clases
        webServiceTemplate.setMarshaller(marshaller); // Establece marshaller
        webServiceTemplate.setUnmarshaller(marshaller); // Establece unmarshaller
        
        // Configura URL por defecto
        webServiceTemplate.setDefaultUri("http://localhost:8080/ws"); // Establece URL por defecto
        
        // RESULTADO ESPERADO: Template SOAP configurado para comunicación con servicio
        return webServiceTemplate; // Retorna template configurado
    }
}
```

---

## 🧪 Testing de SOAP

### Testing de Endpoints SOAP

```java
// UserEndpointTest.java - Testing de endpoints SOAP
package com.example.endpoint;

import com.example.model.User;
import com.example.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.ws.test.server.MockWebServiceClient;
import org.springframework.ws.test.server.RequestCreators;
import org.springframework.ws.test.server.ResponseMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest // Carga contexto completo de Spring Boot
class UserEndpointTest {
    
    @Autowired
    private MockWebServiceClient mockClient; // Cliente mock para testing SOAP
    
    @MockBean
    private UserService userService; // Mock del servicio de usuarios
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User(); // Crea nuevo usuario
        testUser.setId(1L); // Establece ID
        testUser.setUsername("testuser"); // Establece username
        testUser.setEmail("test@example.com"); // Establece email
        testUser.setFirstName("Test"); // Establece nombre
        testUser.setLastName("User"); // Establece apellido
        testUser.setEnabled(true); // Habilita usuario
        
        // RESULTADO ESPERADO: testUser configurado correctamente
    }
    
    @Test
    void getUser_ShouldReturnUser() throws Exception {
        // Arrange - Preparar datos
        when(userService.getUserById(1L)).thenReturn(testUser); // Mock del servicio
        
        // Act & Assert - Ejecutar petición SOAP y verificar respuesta
        mockClient
                .send(RequestCreators.withPayload( // Crea petición SOAP
                        "<getUserRequest xmlns='http://example.com/users'>" +
                        "<id>1</id>" +
                        "</getUserRequest>")) // XML de petición
                .andExpect(ResponseMatchers.payload( // Verifica respuesta SOAP
                        "<getUserResponse xmlns='http://example.com/users'>" +
                        "<user>" +
                        "<id>1</id>" +
                        "<username>testuser</username>" +
                        "<email>test@example.com</email>" +
                        "<firstName>Test</firstName>" +
                        "<lastName>User</lastName>" +
                        "<enabled>true</enabled>" +
                        "</user>" +
                        "</getUserResponse>")); // XML de respuesta esperada
        
        // RESULTADO ESPERADO: Test pasa, respuesta SOAP correcta con datos del usuario
    }
    
    @Test
    void createUser_ShouldReturnCreatedUser() throws Exception {
        // Arrange - Preparar datos
        when(userService.createUser(any(User.class))).thenReturn(testUser); // Mock del servicio
        
        // Act & Assert - Ejecutar petición SOAP y verificar respuesta
        mockClient
                .send(RequestCreators.withPayload( // Crea petición SOAP
                        "<createUserRequest xmlns='http://example.com/users'>" +
                        "<username>testuser</username>" +
                        "<email>test@example.com</email>" +
                        "<firstName>Test</firstName>" +
                        "<lastName>User</lastName>" +
                        "<enabled>true</enabled>" +
                        "</createUserRequest>")) // XML de petición
                .andExpect(ResponseMatchers.payload( // Verifica respuesta SOAP
                        "<createUserResponse xmlns='http://example.com/users'>" +
                        "<user>" +
                        "<id>1</id>" +
                        "<username>testuser</username>" +
                        "<email>test@example.com</email>" +
                        "<firstName>Test</firstName>" +
                        "<lastName>User</lastName>" +
                        "<enabled>true</enabled>" +
                        "</user>" +
                        "</createUserResponse>")); // XML de respuesta esperada
        
        // RESULTADO ESPERADO: Test pasa, respuesta SOAP correcta con usuario creado
    }
    
    @Test
    void deleteUser_ShouldReturnSuccess() throws Exception {
        // Arrange - Preparar datos
        when(userService.deleteUser(1L)).thenReturn(true); // Mock del servicio
        
        // Act & Assert - Ejecutar petición SOAP y verificar respuesta
        mockClient
                .send(RequestCreators.withPayload( // Crea petición SOAP
                        "<deleteUserRequest xmlns='http://example.com/users'>" +
                        "<id>1</id>" +
                        "</deleteUserRequest>")) // XML de petición
                .andExpect(ResponseMatchers.payload( // Verifica respuesta SOAP
                        "<deleteUserResponse xmlns='http://example.com/users'>" +
                        "<success>true</success>" +
                        "</deleteUserResponse>")); // XML de respuesta esperada
        
        // RESULTADO ESPERADO: Test pasa, respuesta SOAP correcta con true
    }
}

// UserSoapClientTest.java - Testing del cliente SOAP
@ExtendWith(MockitoExtension.class) // Extensión de Mockito
class UserSoapClientTest {
    
    @Mock
    private WebServiceTemplate webServiceTemplate; // Mock del template SOAP
    
    @InjectMocks
    private UserSoapClient soapClient; // Cliente SOAP a testear
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User(); // Crea nuevo usuario
        testUser.setId(1L); // Establece ID
        testUser.setUsername("testuser"); // Establece username
        testUser.setEmail("test@example.com"); // Establece email
        
        // Configura mock del template SOAP
        ReflectionTestUtils.setField(soapClient, "webServiceTemplate", webServiceTemplate); // Inyecta mock
        
        // RESULTADO ESPERADO: testUser y mock configurados correctamente
    }
    
    @Test
    void getUser_ShouldReturnUser() {
        // Arrange - Preparar datos
        GetUserRequest request = new GetUserRequest(); // Crea petición
        request.setId(1L); // Establece ID
        
        GetUserResponse expectedResponse = new GetUserResponse(); // Crea respuesta esperada
        expectedResponse.setUser(testUser); // Establece usuario en respuesta
        
        when(webServiceTemplate.marshalSendAndReceive(any(), any(), any())).thenReturn(expectedResponse); // Mock del template
        
        // Act - Ejecutar acción
        GetUserResponse response = soapClient.getUser(1L); // Llama método del cliente
        
        // Assert - Verificar resultados
        assertNotNull(response); // Verifica que respuesta no sea null
        assertEquals(testUser, response.getUser()); // Verifica usuario en respuesta
        
        // RESULTADO ESPERADO: Test pasa, respuesta correcta del cliente SOAP
    }
    
    @Test
    void createUser_ShouldReturnCreatedUser() {
        // Arrange - Preparar datos
        CreateUserResponse expectedResponse = new CreateUserResponse(); // Crea respuesta esperada
        expectedResponse.setUser(testUser); // Establece usuario en respuesta
        
        when(webServiceTemplate.marshalSendAndReceive(any(), any(), any())).thenReturn(expectedResponse); // Mock del template
        
        // Act - Ejecutar acción
        CreateUserResponse response = soapClient.createUser(testUser); // Llama método del cliente
        
        // Assert - Verificar resultados
        assertNotNull(response); // Verifica que respuesta no sea null
        assertEquals(testUser, response.getUser()); // Verifica usuario en respuesta
        
        // RESULTADO ESPERADO: Test pasa, respuesta correcta del cliente SOAP
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es SOAP y cuáles son sus características?**
   - Protocolo de comunicación, XML, WSDL, orientado a servicios

2. **¿Cuál es la diferencia entre SOAP y REST?**
   - SOAP: protocolo, XML, WSDL, REST: arquitectura, JSON, HTTP

3. **¿Qué es WSDL en SOAP?**
   - Web Services Description Language, describe servicios SOAP

### Preguntas Intermedias

4. **¿Cómo funciona la validación en SOAP?**
   - Esquemas XML, XSD, interceptores de validación

5. **¿Qué son los SOAP Actions?**
   - Headers HTTP que identifican operaciones SOAP

6. **¿Cómo manejar errores en SOAP?**
   - SOAP Faults, excepciones, manejo de errores

### Preguntas Avanzadas

7. **¿Cómo optimizar servicios SOAP?**
   - Caching, compresión, pooling de conexiones

8. **¿Qué son los interceptores en Spring WS?**
   - PayloadValidatingInterceptor, logging, seguridad

9. **¿Cómo implementar seguridad en SOAP?**
   - WS-Security, autenticación, autorización

---

## 📚 Recursos Adicionales

- [Spring Web Services Documentation](https://docs.spring.io/spring-ws/docs/)
- [SOAP Web Services Guide](https://www.w3.org/TR/soap/)
- [WSDL Specification](https://www.w3.org/TR/wsdl/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de SOAP Web Services! 🚀** 