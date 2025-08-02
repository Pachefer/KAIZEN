# 🧪 SOAP UI - Testing Avanzado de APIs

## 📋 Índice

1. [Configuración de SOAP UI](#configuración-de-soap-ui)
2. [Testing de REST APIs](#testing-de-rest-apis)
3. [Testing de SOAP Web Services](#testing-de-soap-web-services)
4. [Automatización y Scripts](#automatización-y-scripts)
5. [Performance Testing](#performance-testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de SOAP UI

### Configuración de Proyecto

```xml
<!-- soapui-project.xml - Configuración de proyecto SOAP UI -->
<con:soapui-project id="test-project" name="API Testing Project" resourceRoot="" soapui-version="5.7.0" abortOnError="false" runType="SEQUENTIAL" xmlns:con="http://eviware.com/soapui/config">
    
    <!-- Configuración de propiedades globales -->
    <con:properties>
        <con:property>
            <con:name>baseUrl</con:name>
            <con:value>http://localhost:8080/api</con:value>
        </con:property>
        <con:property>
            <con:name>timeout</con:name>
            <con:value>30000</con:value>
        </con:property>
        <con:property>
            <con:name>authToken</con:name>
            <con:value>${#Project#authToken}</con:value>
        </con:property>
    </con:properties>
    
    <!-- Configuración de interfaces REST -->
    <con:interface xsi:type="con:RestService" id="rest-api" name="REST API" baseUrl="${#Project#baseUrl}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        
        <!-- Endpoint para usuarios -->
        <con:endpoint id="users-endpoint" name="Users Endpoint" path="/users">
            <con:settings/>
        </con:endpoint>
        
        <!-- Endpoint para autenticación -->
        <con:endpoint id="auth-endpoint" name="Auth Endpoint" path="/auth">
            <con:settings/>
        </con:endpoint>
        
    </con:interface>
    
    <!-- Configuración de interfaces SOAP -->
    <con:interface xsi:type="con:WsdlInterface" id="soap-api" name="SOAP API" type="wsdl" wsdlUrl="http://localhost:8080/soap/users?wsdl" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        
        <!-- Binding SOAP -->
        <con:settings/>
        <con:definitionCache type="TEXT" rootPart="http://localhost:8080/soap/users?wsdl">
            <con:part>
                <con:url>http://localhost:8080/soap/users?wsdl</con:url>
                <con:content><![CDATA[<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="http://example.com/users" targetNamespace="http://example.com/users">
                    <wsdl:message name="getUserRequest">
                        <wsdl:part name="userId" type="xs:string"/>
                    </wsdl:message>
                    <wsdl:message name="getUserResponse">
                        <wsdl:part name="user" type="tns:User"/>
                    </wsdl:message>
                    <wsdl:portType name="UserService">
                        <wsdl:operation name="getUser">
                            <wsdl:input message="tns:getUserRequest"/>
                            <wsdl:output message="tns:getUserResponse"/>
                        </wsdl:operation>
                    </wsdl:portType>
                    <wsdl:binding name="UserServiceSoapBinding" type="tns:UserService">
                        <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
                        <wsdl:operation name="getUser">
                            <soap:operation soapAction=""/>
                            <wsdl:input>
                                <soap:body use="literal" namespace="http://example.com/users"/>
                            </wsdl:input>
                            <wsdl:output>
                                <soap:body use="literal" namespace="http://example.com/users"/>
                            </wsdl:output>
                        </wsdl:operation>
                    </wsdl:binding>
                    <wsdl:service name="UserService">
                        <wsdl:port name="UserServicePort" binding="tns:UserServiceSoapBinding">
                            <soap:address location="http://localhost:8080/soap/users"/>
                        </wsdl:port>
                    </wsdl:service>
                </wsdl:definitions>]]></con:content>
                <con:type>http://schemas.xmlsoap.org/wsdl/</con:type>
            </con:part>
        </con:definitionCache>
        
    </con:interface>
    
</con:soapui-project>
```

---

## 🚀 Testing de REST APIs

### Configuración de Test Cases REST

```xml
<!-- rest-test-suite.xml - Suite de tests para REST APIs -->
<con:testSuite id="rest-test-suite" name="REST API Test Suite" xmlns:con="http://eviware.com/soapui/config">
    
    <!-- Test Case para crear usuario -->
    <con:testCase id="create-user-test" name="Create User Test" failOnError="true" failTestCaseOnErrors="true" keepSession="false" maxResults="0" searchProperties="true" timeout="0" xmlns:con="http://eviware.com/soapui/config">
        
        <!-- Configuración de propiedades del test case -->
        <con:properties>
            <con:property>
                <con:name>testUserId</con:name>
                <con:value>${=System.currentTimeMillis()}</con:value>
            </con:property>
        </con:properties>
        
        <!-- Test Step: Crear usuario -->
        <con:testStep type="request" id="create-user-step" name="Create User">
            <con:settings/>
            <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <con:interface>rest-api</con:interface>
                <con:operation>POST</con:operation>
                <con:request name="Create User Request" id="create-user-request" mediaType="application/json" postQueryString="false">
                    <con:settings>
                        <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                    </con:settings>
                    <con:endpoint>${#Project#baseUrl}/users</con:endpoint>
                    <con:request>
                        {
                            "username": "testuser_${#TestCase#testUserId}",
                            "email": "test_${#TestCase#testUserId}@example.com",
                            "password": "password123",
                            "firstName": "Test",
                            "lastName": "User"
                        }
                    </con:request>
                    <con:assertion type="Valid HTTP Status Codes" id="valid-status">
                        <con:configuration>
                            <codes>201</codes>
                        </con:configuration>
                    </con:assertion>
                    <con:assertion type="Response SLA" id="response-time">
                        <con:configuration>
                            <maxTime>2000</maxTime>
                        </con:configuration>
                    </con:assertion>
                    <con:assertion type="Contains" id="contains-user-id">
                        <con:configuration>
                            <token>id</token>
                            <ignoreCase>false</ignoreCase>
                            <useRegEx>false</useRegEx>
                        </con:configuration>
                    </con:assertion>
                </con:request>
            </con:config>
        </con:testStep>
        
        <!-- Test Step: Verificar usuario creado -->
        <con:testStep type="request" id="verify-user-step" name="Verify User Created">
            <con:settings/>
            <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <con:interface>rest-api</con:interface>
                <con:operation>GET</con:operation>
                <con:request name="Get User Request" id="get-user-request" mediaType="application/json" postQueryString="false">
                    <con:settings>
                        <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                    </con:settings>
                    <con:endpoint>${#Project#baseUrl}/users/${PropertyTransfer#userId}</con:endpoint>
                    <con:request/>
                    <con:assertion type="Valid HTTP Status Codes" id="valid-status-get">
                        <con:configuration>
                            <codes>200</codes>
                        </con:configuration>
                    </con:assertion>
                    <con:assertion type="Contains" id="contains-username">
                        <con:configuration>
                            <token>testuser_${#TestCase#testUserId}</token>
                            <ignoreCase>false</ignoreCase>
                            <useRegEx>false</useRegEx>
                        </con:configuration>
                    </con:assertion>
                </con:request>
            </con:config>
        </con:testStep>
        
        <!-- Property Transfer: Extraer ID del usuario creado -->
        <con:properties>
            <con:property>
                <con:name>userId</con:name>
                <con:value>${create-user-step#Response#$.id}</con:value>
            </con:property>
        </con:properties>
        
    </con:testCase>
    
    <!-- Test Case para autenticación -->
    <con:testCase id="auth-test" name="Authentication Test" failOnError="true" failTestCaseOnErrors="true" keepSession="false" maxResults="0" searchProperties="true" timeout="0" xmlns:con="http://eviware.com/soapui/config">
        
        <!-- Test Step: Login -->
        <con:testStep type="request" id="login-step" name="Login">
            <con:settings/>
            <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <con:interface>rest-api</con:interface>
                <con:operation>POST</con:operation>
                <con:request name="Login Request" id="login-request" mediaType="application/json" postQueryString="false">
                    <con:settings>
                        <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                    </con:settings>
                    <con:endpoint>${#Project#baseUrl}/auth/login</con:endpoint>
                    <con:request>
                        {
                            "username": "admin",
                            "password": "admin123"
                        }
                    </con:request>
                    <con:assertion type="Valid HTTP Status Codes" id="valid-status-login">
                        <con:configuration>
                            <codes>200</codes>
                        </con:configuration>
                    </con:assertion>
                    <con:assertion type="Contains" id="contains-token">
                        <con:configuration>
                            <token>token</token>
                            <ignoreCase>false</ignoreCase>
                            <useRegEx>false</useRegEx>
                        </con:configuration>
                    </con:assertion>
                </con:request>
            </con:config>
        </con:testStep>
        
        <!-- Property Transfer: Extraer token de autenticación -->
        <con:properties>
            <con:property>
                <con:name>authToken</con:name>
                <con:value>${login-step#Response#$.token}</con:value>
            </con:property>
        </con:properties>
        
    </con:testCase>
    
</con:testSuite>
```

---

## 🔄 Testing de SOAP Web Services

### Configuración de Test Cases SOAP

```xml
<!-- soap-test-suite.xml - Suite de tests para SOAP Web Services -->
<con:testSuite id="soap-test-suite" name="SOAP API Test Suite" xmlns:con="http://eviware.com/soapui/config">
    
    <!-- Test Case para obtener usuario -->
    <con:testCase id="get-user-soap-test" name="Get User SOAP Test" failOnError="true" failTestCaseOnErrors="true" keepSession="false" maxResults="0" searchProperties="true" timeout="0" xmlns:con="http://eviware.com/soapui/config">
        
        <!-- Test Step: Obtener usuario -->
        <con:testStep type="request" id="get-user-soap-step" name="Get User SOAP">
            <con:settings/>
            <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <con:interface>soap-api</con:interface>
                <con:operation>getUser</con:operation>
                <con:request name="Get User SOAP Request" id="get-user-soap-request">
                    <con:settings>
                        <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                    </con:settings>
                    <con:endpoint>http://localhost:8080/soap/users</con:endpoint>
                    <con:request>
                        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://example.com/users">
                            <soapenv:Header/>
                            <soapenv:Body>
                                <user:getUser>
                                    <userId>1</userId>
                                </user:getUser>
                            </soapenv:Body>
                        </soapenv:Envelope>
                    </con:request>
                    <con:assertion type="SOAP Response" id="soap-response">
                        <con:configuration/>
                    </con:assertion>
                    <con:assertion type="Schema Compliance" id="schema-compliance">
                        <con:configuration/>
                    </con:assertion>
                    <con:assertion type="Contains" id="contains-user-data">
                        <con:configuration>
                            <token>username</token>
                            <ignoreCase>false</ignoreCase>
                            <useRegEx>false</useRegEx>
                        </con:configuration>
                    </con:assertion>
                </con:request>
            </con:config>
        </con:testStep>
        
    </con:testCase>
    
    <!-- Test Case para crear usuario SOAP -->
    <con:testCase id="create-user-soap-test" name="Create User SOAP Test" failOnError="true" failTestCaseOnErrors="true" keepSession="false" maxResults="0" searchProperties="true" timeout="0" xmlns:con="http://eviware.com/soapui/config">
        
        <!-- Test Step: Crear usuario SOAP -->
        <con:testStep type="request" id="create-user-soap-step" name="Create User SOAP">
            <con:settings/>
            <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <con:interface>soap-api</con:interface>
                <con:operation>createUser</con:operation>
                <con:request name="Create User SOAP Request" id="create-user-soap-request">
                    <con:settings>
                        <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                    </con:settings>
                    <con:endpoint>http://localhost:8080/soap/users</con:endpoint>
                    <con:request>
                        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://example.com/users">
                            <soapenv:Header/>
                            <soapenv:Body>
                                <user:createUser>
                                    <userData>
                                        <username>soapuser_${=System.currentTimeMillis()}</username>
                                        <email>soap_${=System.currentTimeMillis()}@example.com</email>
                                        <password>password123</password>
                                        <firstName>SOAP</firstName>
                                        <lastName>User</lastName>
                                    </userData>
                                </user:createUser>
                            </soapenv:Body>
                        </soapenv:Envelope>
                    </con:request>
                    <con:assertion type="SOAP Response" id="soap-response-create">
                        <con:configuration/>
                    </con:assertion>
                    <con:assertion type="Contains" id="contains-success">
                        <con:configuration>
                            <token>success</token>
                            <ignoreCase>false</ignoreCase>
                            <useRegEx>false</useRegEx>
                        </con:configuration>
                    </con:assertion>
                </con:request>
            </con:config>
        </con:testStep>
        
    </con:testCase>
    
</con:testSuite>
```

---

## 🤖 Automatización y Scripts

### Scripts de Groovy para SOAP UI

```groovy
// setup-script.groovy - Script de configuración inicial
import com.eviware.soapui.model.testsuite.TestRunner
import com.eviware.soapui.model.testsuite.TestSuite
import com.eviware.soapui.model.testsuite.TestCase
import com.eviware.soapui.model.testsuite.TestStep

// Script ejecutado antes de cada test suite
def setupTestSuite(TestSuite testSuite, TestRunner testRunner) {
    log.info "=== Configurando Test Suite: ${testSuite.name} ==="
    
    // Configurar propiedades globales
    def project = testSuite.getProject()
    project.setPropertyValue("baseUrl", "http://localhost:8080/api")
    project.setPropertyValue("timeout", "30000")
    
    // Limpiar datos de pruebas anteriores
    cleanupTestData()
    
    // Preparar datos de prueba
    prepareTestData()
    
    log.info "Configuración completada para: ${testSuite.name}"
}

// Script ejecutado antes de cada test case
def setupTestCase(TestCase testCase, TestRunner testRunner) {
    log.info "=== Configurando Test Case: ${testCase.name} ==="
    
    // Generar datos únicos para el test
    def timestamp = System.currentTimeMillis()
    testCase.setPropertyValue("testTimestamp", timestamp.toString())
    testCase.setPropertyValue("testUserId", "user_${timestamp}")
    
    // Configurar headers de autenticación si es necesario
    setupAuthHeaders(testCase)
    
    log.info "Configuración completada para: ${testCase.name}"
}

// Script ejecutado después de cada test case
def teardownTestCase(TestCase testCase, TestRunner testRunner) {
    log.info "=== Limpiando Test Case: ${testCase.name} ==="
    
    // Limpiar datos creados durante el test
    cleanupTestCaseData(testCase)
    
    // Registrar resultados
    logResults(testCase, testRunner)
    
    log.info "Limpieza completada para: ${testCase.name}"
}

// Función para limpiar datos de prueba
def cleanupTestData() {
    try {
        // Llamada a API para limpiar datos de prueba
        def cleanupRequest = project.getInterfaceByName("REST API").getOperationByName("DELETE").createRequest()
        cleanupRequest.setEndpoint("${project.getPropertyValue('baseUrl')}/test/cleanup")
        cleanupRequest.submit()
        
        log.info "Datos de prueba limpiados exitosamente"
    } catch (Exception e) {
        log.warn "Error limpiando datos de prueba: ${e.message}"
    }
}

// Función para preparar datos de prueba
def prepareTestData() {
    try {
        // Crear datos de prueba necesarios
        def setupRequest = project.getInterfaceByName("REST API").getOperationByName("POST").createRequest()
        setupRequest.setEndpoint("${project.getPropertyValue('baseUrl')}/test/setup")
        setupRequest.setRequestContent('{"action": "setup"}')
        setupRequest.submit()
        
        log.info "Datos de prueba preparados exitosamente"
    } catch (Exception e) {
        log.warn "Error preparando datos de prueba: ${e.message}"
    }
}

// Función para configurar headers de autenticación
def setupAuthHeaders(TestCase testCase) {
    try {
        // Obtener token de autenticación si existe
        def authToken = project.getPropertyValue("authToken")
        if (authToken) {
            testCase.setPropertyValue("authHeader", "Bearer ${authToken}")
        }
    } catch (Exception e) {
        log.warn "Error configurando headers de autenticación: ${e.message}"
    }
}

// Función para limpiar datos del test case
def cleanupTestCaseData(TestCase testCase) {
    try {
        // Obtener ID de usuario creado durante el test
        def userId = testCase.getPropertyValue("createdUserId")
        if (userId) {
            // Eliminar usuario creado
            def deleteRequest = project.getInterfaceByName("REST API").getOperationByName("DELETE").createRequest()
            deleteRequest.setEndpoint("${project.getPropertyValue('baseUrl')}/users/${userId}")
            deleteRequest.submit()
            
            log.info "Usuario ${userId} eliminado exitosamente"
        }
    } catch (Exception e) {
        log.warn "Error limpiando datos del test case: ${e.message}"
    }
}

// Función para registrar resultados
def logResults(TestCase testCase, TestRunner testRunner) {
    def status = testRunner.getStatus()
    def timeTaken = testRunner.getTimeTaken()
    
    log.info "Test Case: ${testCase.name}"
    log.info "Status: ${status}"
    log.info "Time Taken: ${timeTaken}ms"
    
    // Guardar resultados en archivo si es necesario
    saveResultsToFile(testCase, status, timeTaken)
}

// Función para guardar resultados en archivo
def saveResultsToFile(TestCase testCase, status, timeTaken) {
    try {
        def resultsFile = new File("test-results.log")
        def timestamp = new Date().format("yyyy-MM-dd HH:mm:ss")
        def logEntry = "${timestamp} | ${testCase.name} | ${status} | ${timeTaken}ms\n"
        
        resultsFile.append(logEntry)
    } catch (Exception e) {
        log.warn "Error guardando resultados: ${e.message}"
    }
}
```

---

## ⚡ Performance Testing

### Configuración de Load Tests

```xml
<!-- load-test-suite.xml - Suite de tests de performance -->
<con:testSuite id="load-test-suite" name="Load Test Suite" xmlns:con="http://eviware.com/soapui/config">
    
    <!-- Load Test: Prueba de carga para obtener usuarios -->
    <con:loadTest id="get-users-load-test" name="Get Users Load Test" xmlns:con="http://eviware.com/soapui/config">
        
        <!-- Configuración de estrategia de carga -->
        <con:loadStrategy type="simple">
            <con:configuration>
                <strategy>simple</strategy>
                <limit>100</limit>
                <testDelay>1000</testDelay>
            </con:configuration>
        </con:loadStrategy>
        
        <!-- Configuración de límites -->
        <con:maxAssertionErrors>10</con:maxAssertionErrors>
        <con:maxErrors>10</con:maxErrors>
        <con:maxRequestDelay>1000</con:maxRequestDelay>
        <con:maxResponseTime>5000</con:maxResponseTime>
        <con:maxThroughput>50</con:maxThroughput>
        <con:maxThreads>10</con:maxThreads>
        <con:minThroughput>10</con:minThroughput>
        <con:randomFactor>0.5</con:randomFactor>
        <con:strategy>simple</con:strategy>
        <con:testLimit>100</con:testLimit>
        <con:testDelay>1000</con:testDelay>
        <con:threadCount>5</con:threadCount>
        
        <!-- Test Case de referencia -->
        <con:testCase id="get-users-test-case" name="Get Users Test Case">
            
            <!-- Test Step: Obtener lista de usuarios -->
            <con:testStep type="request" id="get-users-step" name="Get Users">
                <con:settings/>
                <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <con:interface>rest-api</con:interface>
                    <con:operation>GET</con:operation>
                    <con:request name="Get Users Request" id="get-users-request" mediaType="application/json" postQueryString="false">
                        <con:settings>
                            <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                        </con:settings>
                        <con:endpoint>${#Project#baseUrl}/users</con:endpoint>
                        <con:request/>
                        <con:assertion type="Valid HTTP Status Codes" id="valid-status-load">
                            <con:configuration>
                                <codes>200</codes>
                            </con:configuration>
                        </con:assertion>
                        <con:assertion type="Response SLA" id="response-time-load">
                            <con:configuration>
                                <maxTime>2000</maxTime>
                            </con:configuration>
                        </con:assertion>
                    </con:request>
                </con:config>
            </con:testStep>
            
        </con:testCase>
        
    </con:loadTest>
    
    <!-- Load Test: Prueba de carga para crear usuarios -->
    <con:loadTest id="create-users-load-test" name="Create Users Load Test" xmlns:con="http://eviware.com/soapui/config">
        
        <!-- Configuración de estrategia de carga -->
        <con:loadStrategy type="burst">
            <con:configuration>
                <strategy>burst</strategy>
                <limit>50</limit>
                <testDelay>500</testDelay>
            </con:configuration>
        </con:loadStrategy>
        
        <!-- Configuración de límites -->
        <con:maxAssertionErrors>5</con:maxAssertionErrors>
        <con:maxErrors>5</con:maxErrors>
        <con:maxRequestDelay>500</con:maxRequestDelay>
        <con:maxResponseTime>3000</con:maxResponseTime>
        <con:maxThroughput>20</con:maxThroughput>
        <con:maxThreads>5</con:maxThreads>
        <con:minThroughput>5</con:minThroughput>
        <con:randomFactor>0.3</con:randomFactor>
        <con:strategy>burst</con:strategy>
        <con:testLimit>50</con:testLimit>
        <con:testDelay>500</con:testDelay>
        <con:threadCount>3</con:threadCount>
        
        <!-- Test Case de referencia -->
        <con:testCase id="create-users-test-case" name="Create Users Test Case">
            
            <!-- Test Step: Crear usuario -->
            <con:testStep type="request" id="create-user-load-step" name="Create User Load">
                <con:settings/>
                <con:config xsi:type="con:RequestStepConfig" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <con:interface>rest-api</con:interface>
                    <con:operation>POST</con:operation>
                    <con:request name="Create User Load Request" id="create-user-load-request" mediaType="application/json" postQueryString="false">
                        <con:settings>
                            <con:setting id="com.eviware.soapui.impl.wsdl.WsdlRequest@request-headers">&lt;xml-fragment/></con:setting>
                        </con:settings>
                        <con:endpoint>${#Project#baseUrl}/users</con:endpoint>
                        <con:request>
                            {
                                "username": "loaduser_${=System.currentTimeMillis()}_${=Math.random()}",
                                "email": "load_${=System.currentTimeMillis()}_${=Math.random()}@example.com",
                                "password": "password123",
                                "firstName": "Load",
                                "lastName": "User"
                            }
                        </con:request>
                        <con:assertion type="Valid HTTP Status Codes" id="valid-status-create-load">
                            <con:configuration>
                                <codes>201</codes>
                            </con:configuration>
                        </con:assertion>
                        <con:assertion type="Response SLA" id="response-time-create-load">
                            <con:configuration>
                                <maxTime>3000</maxTime>
                            </con:configuration>
                        </con:assertion>
                    </con:request>
                </con:config>
            </con:testStep>
            
        </con:testCase>
        
    </con:loadTest>
    
</con:testSuite>
```

---

## 📊 Monitoreo y Reportes

### Scripts de Generación de Reportes

```groovy
// report-generator.groovy - Script para generar reportes
import com.eviware.soapui.model.testsuite.TestRunner
import com.eviware.soapui.model.testsuite.TestSuite
import com.eviware.soapui.model.testsuite.TestCase
import com.eviware.soapui.model.testsuite.TestStep
import com.eviware.soapui.model.loadtest.LoadTest
import com.eviware.soapui.model.loadtest.LoadTestRunner

// Función para generar reporte de resultados
def generateTestReport(TestRunner testRunner) {
    log.info "=== Generando Reporte de Resultados ==="
    
    def project = testRunner.getTestSuite().getProject()
    def testSuite = testRunner.getTestSuite()
    def results = collectTestResults(testRunner)
    
    // Generar reporte HTML
    generateHtmlReport(results, project)
    
    // Generar reporte JSON
    generateJsonReport(results, project)
    
    // Generar reporte CSV
    generateCsvReport(results, project)
    
    log.info "Reportes generados exitosamente"
}

// Función para recolectar resultados de tests
def collectTestResults(TestRunner testRunner) {
    def results = [:]
    results.projectName = testRunner.getTestSuite().getProject().getName()
    results.testSuiteName = testRunner.getTestSuite().getName()
    results.startTime = testRunner.getStartTime()
    results.endTime = testRunner.getEndTime()
    results.duration = testRunner.getTimeTaken()
    results.status = testRunner.getStatus().toString()
    results.totalTests = 0
    results.passedTests = 0
    results.failedTests = 0
    results.testCases = []
    
    // Recolectar resultados de test cases
    testRunner.getTestSuite().getTestCaseList().each { testCase ->
        def testCaseResult = [:]
        testCaseResult.name = testCase.getName()
        testCaseResult.status = testCase.getTestStepList().findAll { it.getStatus().toString() == "FAILED" }.size() > 0 ? "FAILED" : "PASSED"
        testCaseResult.duration = testCase.getTimeTaken()
        testCaseResult.assertions = []
        
        // Recolectar resultados de assertions
        testCase.getTestStepList().each { testStep ->
            if (testStep instanceof com.eviware.soapui.model.testsuite.TestRequest) {
                testStep.getAssertionList().each { assertion ->
                    def assertionResult = [:]
                    assertionResult.name = assertion.getName()
                    assertionResult.status = assertion.getStatus().toString()
                    testCaseResult.assertions.add(assertionResult)
                }
            }
        }
        
        results.testCases.add(testCaseResult)
        results.totalTests++
        
        if (testCaseResult.status == "PASSED") {
            results.passedTests++
        } else {
            results.failedTests++
        }
    }
    
    return results
}

// Función para generar reporte HTML
def generateHtmlReport(results, project) {
    def htmlContent = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Report - ${results.projectName}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background-color: #f0f0f0; padding: 10px; border-radius: 5px; }
            .summary { margin: 20px 0; }
            .test-case { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .passed { background-color: #d4edda; }
            .failed { background-color: #f8d7da; }
            .assertion { margin: 5px 0; padding: 5px; background-color: #f8f9fa; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Test Report - ${results.projectName}</h1>
            <p><strong>Test Suite:</strong> ${results.testSuiteName}</p>
            <p><strong>Start Time:</strong> ${new Date(results.startTime).format("yyyy-MM-dd HH:mm:ss")}</p>
            <p><strong>Duration:</strong> ${results.duration}ms</p>
        </div>
        
        <div class="summary">
            <h2>Summary</h2>
            <p><strong>Total Tests:</strong> ${results.totalTests}</p>
            <p><strong>Passed:</strong> ${results.passedTests}</p>
            <p><strong>Failed:</strong> ${results.failedTests}</p>
            <p><strong>Success Rate:</strong> ${results.totalTests > 0 ? (results.passedTests * 100 / results.totalTests).round(2) : 0}%</p>
        </div>
        
        <div class="test-cases">
            <h2>Test Cases</h2>
    """
    
    results.testCases.each { testCase ->
        def cssClass = testCase.status == "PASSED" ? "passed" : "failed"
        htmlContent += """
            <div class="test-case ${cssClass}">
                <h3>${testCase.name}</h3>
                <p><strong>Status:</strong> ${testCase.status}</p>
                <p><strong>Duration:</strong> ${testCase.duration}ms</p>
        """
        
        if (testCase.assertions.size() > 0) {
            htmlContent += "<h4>Assertions:</h4>"
            testCase.assertions.each { assertion ->
                htmlContent += """
                    <div class="assertion">
                        <strong>${assertion.name}:</strong> ${assertion.status}
                    </div>
                """
            }
        }
        
        htmlContent += "</div>"
    }
    
    htmlContent += """
        </div>
    </body>
    </html>
    """
    
    // Guardar archivo HTML
    def htmlFile = new File("test-report.html")
    htmlFile.text = htmlContent
    
    log.info "Reporte HTML generado: test-report.html"
}

// Función para generar reporte JSON
def generateJsonReport(results, project) {
    def jsonContent = new groovy.json.JsonBuilder(results).toPrettyString()
    
    // Guardar archivo JSON
    def jsonFile = new File("test-report.json")
    jsonFile.text = jsonContent
    
    log.info "Reporte JSON generado: test-report.json"
}

// Función para generar reporte CSV
def generateCsvReport(results, project) {
    def csvContent = "Test Case,Status,Duration,Assertions\n"
    
    results.testCases.each { testCase ->
        def assertions = testCase.assertions.collect { "${it.name}:${it.status}" }.join(";")
        csvContent += "${testCase.name},${testCase.status},${testCase.duration},${assertions}\n"
    }
    
    // Guardar archivo CSV
    def csvFile = new File("test-report.csv")
    csvFile.text = csvContent
    
    log.info "Reporte CSV generado: test-report.csv"
}

// Función para generar reporte de performance
def generatePerformanceReport(LoadTestRunner loadTestRunner) {
    log.info "=== Generando Reporte de Performance ==="
    
    def loadTest = loadTestRunner.getLoadTest()
    def results = [:]
    results.loadTestName = loadTest.getName()
    results.startTime = loadTestRunner.getStartTime()
    results.endTime = loadTestRunner.getEndTime()
    results.duration = loadTestRunner.getTimeTaken()
    results.totalRequests = loadTestRunner.getTotalRequests()
    results.failedRequests = loadTestRunner.getFailedRequests()
    results.averageResponseTime = loadTestRunner.getAverageResponseTime()
    results.maxResponseTime = loadTestRunner.getMaxResponseTime()
    results.minResponseTime = loadTestRunner.getMinResponseTime()
    results.requestsPerSecond = loadTestRunner.getRequestsPerSecond()
    
    // Generar reporte de performance
    def perfReport = """
    Performance Test Report
    ======================
    Load Test: ${results.loadTestName}
    Duration: ${results.duration}ms
    Total Requests: ${results.totalRequests}
    Failed Requests: ${results.failedRequests}
    Success Rate: ${results.totalRequests > 0 ? ((results.totalRequests - results.failedRequests) * 100 / results.totalRequests).round(2) : 0}%
    Average Response Time: ${results.averageResponseTime}ms
    Max Response Time: ${results.maxResponseTime}ms
    Min Response Time: ${results.minResponseTime}ms
    Requests Per Second: ${results.requestsPerSecond}
    """
    
    // Guardar reporte de performance
    def perfFile = new File("performance-report.txt")
    perfFile.text = perfReport
    
    log.info "Reporte de performance generado: performance-report.txt"
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es SOAP UI y cuáles son sus características principales?**
   - Herramienta de testing para APIs REST y SOAP, automatización, reportes

2. **¿Cuál es la diferencia entre SOAP UI y Postman?**
   - SOAP UI: más completo, SOAP, automatización, Postman: más simple, REST

3. **¿Qué son los assertions en SOAP UI?**
   - Validaciones automáticas de respuestas, verificación de contenido y estructura

### Preguntas Intermedias

4. **¿Cómo configurar automatización en SOAP UI?**
   - Scripts Groovy, test suites, property transfers, data sources

5. **¿Qué son los property transfers en SOAP UI?**
   - Transferencia de datos entre test steps, extracción de valores de respuestas

6. **¿Cómo manejar autenticación en SOAP UI?**
   - Headers de autorización, tokens, OAuth, Basic Auth

### Preguntas Avanzadas

7. **¿Cómo optimizar performance testing en SOAP UI?**
   - Load testing, estrategias de carga, monitoreo de recursos, análisis de resultados

8. **¿Qué son los mock services en SOAP UI?**
   - Servicios simulados, testing sin dependencias, desarrollo paralelo

9. **¿Cómo integrar SOAP UI con CI/CD?**
   - Command line, reportes automáticos, integración con Jenkins, GitLab CI

---

## 📚 Recursos Adicionales

- [SOAP UI Documentation](https://www.soapui.org/docs/)
- [SOAP UI Groovy Scripting](https://www.soapui.org/scripting-properties/tips-tricks.html)
- [SOAP UI Performance Testing](https://www.soapui.org/load-testing/)
- [SOAP UI Automation](https://www.soapui.org/automation/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de SOAP UI! 🚀** 