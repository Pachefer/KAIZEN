# 📮 POSTMAN - Testing Avanzado de APIs

## 📋 Índice

1. [Configuración de POSTMAN](#configuración-de-postman)
2. [Collections y Environments](#collections-y-environments)
3. [Testing y Automatización](#testing-y-automatización)
4. [Scripts y Pre-request](#scripts-y-pre-request)
5. [Monitoreo y Reportes](#monitoreo-y-reportes)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de POSTMAN

### Configuración de Collection

```json
{
  "info": {
    "name": "API Testing Collection",
    "description": "Colección completa para testing de APIs REST",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api",
      "type": "string"
    },
    {
      "key": "timeout",
      "value": "30000",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "{{authToken}}",
      "type": "string"
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{authToken}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Users API",
      "item": [
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"{{$randomFullName}}\",\n  \"email\": \"{{$randomEmail}}\",\n  \"password\": \"password123\",\n  \"firstName\": \"{{$randomFirstName}}\",\n  \"lastName\": \"{{$randomLastName}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users",
              "host": ["{{baseUrl}}"],
              "path": ["users"]
            }
          },
          "response": [],
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "// Test script para validar respuesta de creación de usuario",
                  "pm.test(\"Status code is 201\", function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test(\"Response has user ID\", function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData.id).to.be.a('number');",
                  "});",
                  "",
                  "pm.test(\"Response time is less than 2000ms\", function () {",
                  "    pm.expect(pm.response.responseTime).to.be.below(2000);",
                  "});",
                  "",
                  "// Guardar ID del usuario creado para uso posterior",
                  "if (pm.response.code === 201) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.collectionVariables.set(\"createdUserId\", jsonData.id);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ]
        },
        {
          "name": "Get User by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/users/{{createdUserId}}",
              "host": ["{{baseUrl}}"],
              "path": ["users", "{{createdUserId}}"]
            }
          },
          "response": [],
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "// Test script para validar obtención de usuario",
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"User data is correct\", function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('username');",
                  "    pm.expect(jsonData).to.have.property('email');",
                  "});",
                  "",
                  "pm.test(\"Response time is less than 1000ms\", function () {",
                  "    pm.expect(pm.response.responseTime).to.be.below(1000);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🚀 Collections y Environments

### Configuración de Environment

```json
{
  "id": "env-12345",
  "name": "Development Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api",
      "type": "default",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "type": "secret",
      "enabled": true
    },
    {
      "key": "username",
      "value": "admin",
      "type": "default",
      "enabled": true
    },
    {
      "key": "password",
      "value": "admin123",
      "type": "secret",
      "enabled": true
    },
    {
      "key": "timeout",
      "value": "30000",
      "type": "default",
      "enabled": true
    }
  ],
  "_postman_variable_scope": "environment"
}
```

### Configuración de Collection con Variables

```json
{
  "info": {
    "name": "Authentication API",
    "description": "Endpoints para autenticación y autorización"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"{{username}}\",\n  \"password\": \"{{password}}\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/auth/login",
          "host": ["{{baseUrl}}"],
          "path": ["auth", "login"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Test script para validar login exitoso",
              "pm.test(\"Login successful\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"Response contains token\", function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData).to.have.property('token');",
              "    pm.expect(jsonData.token).to.be.a('string');",
              "});",
              "",
              "// Guardar token para uso posterior",
              "if (pm.response.code === 200) {",
              "    var jsonData = pm.response.json();",
              "    pm.environment.set(\"authToken\", jsonData.token);",
              "    console.log(\"Token guardado: \" + jsonData.token);",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ]
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{authToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/auth/logout",
          "host": ["{{baseUrl}}"],
          "path": ["auth", "logout"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Test script para validar logout",
              "pm.test(\"Logout successful\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "// Limpiar token después del logout",
              "if (pm.response.code === 200) {",
              "    pm.environment.unset(\"authToken\");",
              "    console.log(\"Token eliminado del environment\");",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ]
    }
  ]
}
```

---

## 🧪 Testing y Automatización

### Scripts de Testing Avanzados

```javascript
// test-script.js - Scripts de testing avanzados para POSTMAN

// Función para validar estructura de respuesta JSON
function validateJsonStructure(response, expectedStructure) {
    pm.test("JSON structure is valid", function () {
        var jsonData = pm.response.json();
        
        // Validar propiedades requeridas
        expectedStructure.forEach(function(property) {
            pm.expect(jsonData).to.have.property(property);
        });
        
        // Validar tipos de datos
        if (jsonData.id) {
            pm.expect(jsonData.id).to.be.a('number');
        }
        if (jsonData.username) {
            pm.expect(jsonData.username).to.be.a('string');
        }
        if (jsonData.email) {
            pm.expect(jsonData.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }
    });
}

// Función para validar headers de respuesta
function validateResponseHeaders() {
    pm.test("Response headers are correct", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
        pm.expect(pm.response.headers.get("Cache-Control")).to.exist;
    });
}

// Función para validar paginación
function validatePagination() {
    pm.test("Pagination is working", function () {
        var jsonData = pm.response.json();
        
        if (jsonData.content) {
            pm.expect(jsonData).to.have.property('pageable');
            pm.expect(jsonData).to.have.property('totalElements');
            pm.expect(jsonData).to.have.property('totalPages');
            pm.expect(jsonData.content).to.be.an('array');
        }
    });
}

// Función para validar errores
function validateErrorResponse() {
    pm.test("Error response structure", function () {
        var jsonData = pm.response.json();
        
        pm.expect(jsonData).to.have.property('timestamp');
        pm.expect(jsonData).to.have.property('status');
        pm.expect(jsonData).to.have.property('error');
        pm.expect(jsonData).to.have.property('message');
        pm.expect(jsonData).to.have.property('path');
    });
}

// Función para validar autenticación
function validateAuthentication() {
    pm.test("Authentication is required", function () {
        pm.response.to.have.status(401);
        
        var jsonData = pm.response.json();
        pm.expect(jsonData.error).to.equal("Unauthorized");
        pm.expect(jsonData.message).to.include("authentication");
    });
}

// Función para validar autorización
function validateAuthorization() {
    pm.test("Authorization is required", function () {
        pm.response.to.have.status(403);
        
        var jsonData = pm.response.json();
        pm.expect(jsonData.error).to.equal("Forbidden");
        pm.expect(jsonData.message).to.include("access");
    });
}

// Función para validar validación de datos
function validateDataValidation() {
    pm.test("Data validation errors", function () {
        pm.response.to.have.status(400);
        
        var jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('errors');
        pm.expect(jsonData.errors).to.be.an('array');
        pm.expect(jsonData.errors.length).to.be.greaterThan(0);
    });
}

// Función para validar rate limiting
function validateRateLimiting() {
    pm.test("Rate limiting headers", function () {
        pm.expect(pm.response.headers.get("X-RateLimit-Limit")).to.exist;
        pm.expect(pm.response.headers.get("X-RateLimit-Remaining")).to.exist;
        pm.expect(pm.response.headers.get("X-RateLimit-Reset")).to.exist;
    });
}

// Función para validar CORS
function validateCORS() {
    pm.test("CORS headers are present", function () {
        pm.expect(pm.response.headers.get("Access-Control-Allow-Origin")).to.exist;
        pm.expect(pm.response.headers.get("Access-Control-Allow-Methods")).to.exist;
        pm.expect(pm.response.headers.get("Access-Control-Allow-Headers")).to.exist;
    });
}

// Función para validar cache
function validateCache() {
    pm.test("Cache headers are present", function () {
        pm.expect(pm.response.headers.get("ETag")).to.exist;
        pm.expect(pm.response.headers.get("Last-Modified")).to.exist;
    });
}

// Función para validar compresión
function validateCompression() {
    pm.test("Response is compressed", function () {
        pm.expect(pm.response.headers.get("Content-Encoding")).to.equal("gzip");
    });
}

// Función para validar seguridad
function validateSecurity() {
    pm.test("Security headers are present", function () {
        pm.expect(pm.response.headers.get("X-Content-Type-Options")).to.equal("nosniff");
        pm.expect(pm.response.headers.get("X-Frame-Options")).to.equal("DENY");
        pm.expect(pm.response.headers.get("X-XSS-Protection")).to.equal("1; mode=block");
        pm.expect(pm.response.headers.get("Strict-Transport-Security")).to.exist;
    });
}

// Función para validar performance
function validatePerformance() {
    pm.test("Response time is acceptable", function () {
        pm.expect(pm.response.responseTime).to.be.below(2000);
    });
    
    pm.test("Response size is reasonable", function () {
        var responseSize = pm.response.size().body;
        pm.expect(responseSize).to.be.below(100000); // 100KB
    });
}

// Función para validar consistencia de datos
function validateDataConsistency() {
    pm.test("Data consistency", function () {
        var jsonData = pm.response.json();
        
        if (jsonData.id && jsonData.createdAt) {
            // Validar que el ID es consistente
            pm.expect(jsonData.id).to.be.a('number');
            pm.expect(jsonData.id).to.be.greaterThan(0);
            
            // Validar que las fechas son válidas
            pm.expect(new Date(jsonData.createdAt)).to.be.instanceOf(Date);
        }
    });
}

// Función para validar internacionalización
function validateI18n() {
    pm.test("Internationalization support", function () {
        pm.expect(pm.response.headers.get("Content-Language")).to.exist;
        pm.expect(pm.response.headers.get("Accept-Language")).to.exist;
    });
}

// Función para validar versionado de API
function validateApiVersioning() {
    pm.test("API versioning", function () {
        pm.expect(pm.response.headers.get("API-Version")).to.exist;
        pm.expect(pm.response.headers.get("Deprecation")).to.not.exist;
    });
}
```

---

## 🔧 Scripts y Pre-request

### Scripts de Pre-request

```javascript
// pre-request-script.js - Scripts ejecutados antes de las requests

// Función para generar datos dinámicos
function generateDynamicData() {
    // Generar timestamp único
    var timestamp = new Date().getTime();
    pm.environment.set("timestamp", timestamp);
    
    // Generar UUID
    var uuid = pm.variables.replaceIn("{{$guid}}");
    pm.environment.set("requestId", uuid);
    
    // Generar datos aleatorios
    var randomName = pm.variables.replaceIn("{{$randomFullName}}");
    var randomEmail = pm.variables.replaceIn("{{$randomEmail}}");
    var randomPhone = pm.variables.replaceIn("{{$randomPhoneNumber}}");
    
    pm.environment.set("randomName", randomName);
    pm.environment.set("randomEmail", randomEmail);
    pm.environment.set("randomPhone", randomPhone);
}

// Función para configurar headers dinámicos
function setupDynamicHeaders() {
    // Agregar timestamp al header
    pm.request.headers.add({
        key: "X-Request-Timestamp",
        value: pm.environment.get("timestamp")
    });
    
    // Agregar request ID
    pm.request.headers.add({
        key: "X-Request-ID",
        value: pm.environment.get("requestId")
    });
    
    // Agregar user agent personalizado
    pm.request.headers.add({
        key: "User-Agent",
        value: "PostmanRuntime/7.32.3"
    });
}

// Función para validar autenticación
function validateAuthToken() {
    var authToken = pm.environment.get("authToken");
    
    if (!authToken) {
        console.log("No auth token found, attempting to login...");
        
        // Realizar login automático
        performAutoLogin();
    } else {
        console.log("Auth token found: " + authToken.substring(0, 20) + "...");
    }
}

// Función para login automático
function performAutoLogin() {
    var loginRequest = {
        url: pm.environment.get("baseUrl") + "/auth/login",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify({
                username: pm.environment.get("username"),
                password: pm.environment.get("password")
            })
        }
    };
    
    pm.sendRequest(loginRequest, function (err, response) {
        if (err) {
            console.log("Login failed: " + err);
        } else if (response.code === 200) {
            var jsonData = response.json();
            pm.environment.set("authToken", jsonData.token);
            console.log("Auto login successful");
        } else {
            console.log("Login failed with status: " + response.code);
        }
    });
}

// Función para preparar datos de prueba
function prepareTestData() {
    // Limpiar datos de pruebas anteriores
    var cleanupRequest = {
        url: pm.environment.get("baseUrl") + "/test/cleanup",
        method: "DELETE",
        header: {
            "Authorization": "Bearer " + pm.environment.get("authToken")
        }
    };
    
    pm.sendRequest(cleanupRequest, function (err, response) {
        if (err) {
            console.log("Cleanup failed: " + err);
        } else {
            console.log("Test data cleaned up");
        }
    });
}

// Función para configurar timeouts
function setupTimeouts() {
    var timeout = pm.environment.get("timeout");
    if (timeout) {
        pm.request.timeout = parseInt(timeout);
    }
}

// Función para validar environment
function validateEnvironment() {
    var requiredVars = ["baseUrl", "username", "password"];
    
    requiredVars.forEach(function(varName) {
        var value = pm.environment.get(varName);
        if (!value) {
            throw new Error("Required environment variable missing: " + varName);
        }
    });
    
    console.log("Environment validation passed");
}

// Función para configurar proxy si es necesario
function setupProxy() {
    var useProxy = pm.environment.get("useProxy");
    
    if (useProxy === "true") {
        var proxyHost = pm.environment.get("proxyHost");
        var proxyPort = pm.environment.get("proxyPort");
        
        if (proxyHost && proxyPort) {
            pm.request.proxy = {
                host: proxyHost,
                port: parseInt(proxyPort)
            };
        }
    }
}

// Función para configurar certificados SSL
function setupSSLCertificates() {
    var useSSL = pm.environment.get("useSSL");
    
    if (useSSL === "true") {
        pm.request.ssl = {
            verify: false // Solo para testing
        };
    }
}

// Función para configurar retry logic
function setupRetryLogic() {
    pm.request.retry = {
        count: 3,
        delay: 1000
    };
}

// Función para configurar rate limiting
function setupRateLimiting() {
    var rateLimit = pm.environment.get("rateLimit");
    
    if (rateLimit) {
        pm.request.rateLimit = {
            limit: parseInt(rateLimit),
            window: 60000 // 1 minuto
        };
    }
}

// Función para configurar cache
function setupCache() {
    pm.request.cache = {
        enabled: true,
        maxAge: 300000 // 5 minutos
    };
}

// Función para configurar compresión
function setupCompression() {
    pm.request.headers.add({
        key: "Accept-Encoding",
        value: "gzip, deflate, br"
    });
}

// Función para configurar idioma
function setupLanguage() {
    var language = pm.environment.get("language") || "en-US";
    
    pm.request.headers.add({
        key: "Accept-Language",
        value: language
    });
}

// Función para configurar timezone
function setupTimezone() {
    var timezone = pm.environment.get("timezone") || "UTC";
    
    pm.request.headers.add({
        key: "X-Timezone",
        value: timezone
    });
}

// Función para configurar tracking
function setupTracking() {
    var sessionId = pm.environment.get("sessionId");
    
    if (!sessionId) {
        sessionId = pm.variables.replaceIn("{{$guid}}");
        pm.environment.set("sessionId", sessionId);
    }
    
    pm.request.headers.add({
        key: "X-Session-ID",
        value: sessionId
    });
}
```

---

## 📊 Monitoreo y Reportes

### Scripts de Monitoreo

```javascript
// monitoring-script.js - Scripts para monitoreo y reportes

// Función para registrar métricas de performance
function logPerformanceMetrics() {
    var responseTime = pm.response.responseTime;
    var responseSize = pm.response.size().body;
    var statusCode = pm.response.code;
    
    // Guardar métricas en variables de collection
    pm.collectionVariables.set("lastResponseTime", responseTime);
    pm.collectionVariables.set("lastResponseSize", responseSize);
    pm.collectionVariables.set("lastStatusCode", statusCode);
    
    // Calcular métricas acumulativas
    var totalRequests = parseInt(pm.collectionVariables.get("totalRequests") || "0");
    var totalResponseTime = parseInt(pm.collectionVariables.get("totalResponseTime") || "0");
    var totalResponseSize = parseInt(pm.collectionVariables.get("totalResponseSize") || "0");
    
    totalRequests++;
    totalResponseTime += responseTime;
    totalResponseSize += responseSize;
    
    pm.collectionVariables.set("totalRequests", totalRequests);
    pm.collectionVariables.set("totalResponseTime", totalResponseTime);
    pm.collectionVariables.set("totalResponseSize", totalResponseSize);
    
    // Calcular promedios
    var avgResponseTime = totalResponseTime / totalRequests;
    var avgResponseSize = totalResponseSize / totalRequests;
    
    pm.collectionVariables.set("avgResponseTime", avgResponseTime);
    pm.collectionVariables.set("avgResponseSize", avgResponseSize);
    
    console.log("Performance Metrics:");
    console.log("- Response Time: " + responseTime + "ms");
    console.log("- Response Size: " + responseSize + " bytes");
    console.log("- Status Code: " + statusCode);
    console.log("- Average Response Time: " + avgResponseTime.toFixed(2) + "ms");
    console.log("- Average Response Size: " + avgResponseSize.toFixed(2) + " bytes");
}

// Función para detectar anomalías
function detectAnomalies() {
    var responseTime = pm.response.responseTime;
    var avgResponseTime = parseFloat(pm.collectionVariables.get("avgResponseTime") || "0");
    var threshold = avgResponseTime * 2; // 2x el promedio
    
    if (responseTime > threshold) {
        console.warn("ANOMALY DETECTED: Response time " + responseTime + "ms exceeds threshold " + threshold + "ms");
        pm.collectionVariables.set("anomaliesDetected", parseInt(pm.collectionVariables.get("anomaliesDetected") || "0") + 1);
    }
}

// Función para generar reporte de salud
function generateHealthReport() {
    var totalRequests = parseInt(pm.collectionVariables.get("totalRequests") || "0");
    var successfulRequests = parseInt(pm.collectionVariables.get("successfulRequests") || "0");
    var failedRequests = parseInt(pm.collectionVariables.get("failedRequests") || "0");
    var avgResponseTime = parseFloat(pm.collectionVariables.get("avgResponseTime") || "0");
    var anomaliesDetected = parseInt(pm.collectionVariables.get("anomaliesDetected") || "0");
    
    var successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    
    var healthReport = {
        timestamp: new Date().toISOString(),
        totalRequests: totalRequests,
        successfulRequests: successfulRequests,
        failedRequests: failedRequests,
        successRate: successRate.toFixed(2) + "%",
        averageResponseTime: avgResponseTime.toFixed(2) + "ms",
        anomaliesDetected: anomaliesDetected,
        status: successRate > 95 ? "HEALTHY" : successRate > 80 ? "WARNING" : "CRITICAL"
    };
    
    console.log("Health Report:", JSON.stringify(healthReport, null, 2));
    
    // Guardar reporte en variable
    pm.collectionVariables.set("lastHealthReport", JSON.stringify(healthReport));
}

// Función para registrar errores
function logErrors() {
    var statusCode = pm.response.code;
    
    if (statusCode >= 400) {
        var errorCount = parseInt(pm.collectionVariables.get("errorCount") || "0");
        errorCount++;
        pm.collectionVariables.set("errorCount", errorCount);
        
        var errorLog = {
            timestamp: new Date().toISOString(),
            statusCode: statusCode,
            url: pm.request.url.toString(),
            method: pm.request.method,
            error: pm.response.text()
        };
        
        console.error("Error logged:", JSON.stringify(errorLog, null, 2));
        
        // Guardar último error
        pm.collectionVariables.set("lastError", JSON.stringify(errorLog));
    }
}

// Función para monitorear disponibilidad
function monitorAvailability() {
    var statusCode = pm.response.code;
    var isAvailable = statusCode < 500;
    
    var availabilityData = {
        timestamp: new Date().toISOString(),
        available: isAvailable,
        statusCode: statusCode,
        responseTime: pm.response.responseTime
    };
    
    // Calcular uptime
    var totalChecks = parseInt(pm.collectionVariables.get("availabilityChecks") || "0");
    var availableChecks = parseInt(pm.collectionVariables.get("availableChecks") || "0");
    
    totalChecks++;
    if (isAvailable) {
        availableChecks++;
    }
    
    pm.collectionVariables.set("availabilityChecks", totalChecks);
    pm.collectionVariables.set("availableChecks", availableChecks);
    
    var uptime = totalChecks > 0 ? (availableChecks / totalChecks) * 100 : 0;
    pm.collectionVariables.set("uptime", uptime.toFixed(2));
    
    console.log("Availability: " + (isAvailable ? "UP" : "DOWN") + " (Uptime: " + uptime.toFixed(2) + "%)");
}

// Función para generar alertas
function generateAlerts() {
    var statusCode = pm.response.code;
    var responseTime = pm.response.responseTime;
    var uptime = parseFloat(pm.collectionVariables.get("uptime") || "100");
    
    var alerts = [];
    
    // Alerta por código de estado
    if (statusCode >= 500) {
        alerts.push("CRITICAL: Server error " + statusCode);
    } else if (statusCode >= 400) {
        alerts.push("WARNING: Client error " + statusCode);
    }
    
    // Alerta por tiempo de respuesta
    if (responseTime > 5000) {
        alerts.push("CRITICAL: Response time " + responseTime + "ms exceeds 5s");
    } else if (responseTime > 2000) {
        alerts.push("WARNING: Response time " + responseTime + "ms exceeds 2s");
    }
    
    // Alerta por disponibilidad
    if (uptime < 95) {
        alerts.push("CRITICAL: Uptime " + uptime + "% below 95% threshold");
    } else if (uptime < 99) {
        alerts.push("WARNING: Uptime " + uptime + "% below 99% threshold");
    }
    
    if (alerts.length > 0) {
        console.warn("ALERTS GENERATED:");
        alerts.forEach(function(alert) {
            console.warn("- " + alert);
        });
        
        // Guardar alertas
        pm.collectionVariables.set("lastAlerts", JSON.stringify(alerts));
    }
}

// Función para exportar métricas
function exportMetrics() {
    var metrics = {
        timestamp: new Date().toISOString(),
        performance: {
            totalRequests: parseInt(pm.collectionVariables.get("totalRequests") || "0"),
            averageResponseTime: parseFloat(pm.collectionVariables.get("avgResponseTime") || "0"),
            averageResponseSize: parseFloat(pm.collectionVariables.get("avgResponseSize") || "0")
        },
        availability: {
            uptime: parseFloat(pm.collectionVariables.get("uptime") || "100"),
            totalChecks: parseInt(pm.collectionVariables.get("availabilityChecks") || "0"),
            availableChecks: parseInt(pm.collectionVariables.get("availableChecks") || "0")
        },
        errors: {
            totalErrors: parseInt(pm.collectionVariables.get("errorCount") || "0"),
            anomalies: parseInt(pm.collectionVariables.get("anomaliesDetected") || "0")
        }
    };
    
    // Exportar a archivo (simulado)
    console.log("Metrics exported:", JSON.stringify(metrics, null, 2));
    
    // Guardar métricas
    pm.collectionVariables.set("exportedMetrics", JSON.stringify(metrics));
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es POSTMAN y cuáles son sus características principales?**
   - Herramienta de testing para APIs REST, colecciones, environments, automatización

2. **¿Cuál es la diferencia entre POSTMAN y SOAP UI?**
   - POSTMAN: más simple, REST, UI intuitiva, SOAP UI: más completo, SOAP, scripting avanzado

3. **¿Qué son las variables en POSTMAN?**
   - Almacenamiento de datos dinámicos, environments, colecciones, locales

### Preguntas Intermedias

4. **¿Cómo configurar automatización en POSTMAN?**
   - Newman CLI, scripts de testing, pre-request scripts, CI/CD integration

5. **¿Qué son los environments en POSTMAN?**
   - Configuraciones específicas por ambiente, variables de entorno, switching

6. **¿Cómo manejar autenticación en POSTMAN?**
   - Bearer tokens, OAuth, Basic Auth, API keys, headers personalizados

### Preguntas Avanzadas

7. **¿Cómo optimizar performance testing en POSTMAN?**
   - Newman con concurrencia, monitoreo de métricas, análisis de resultados

8. **¿Qué son los mock servers en POSTMAN?**
   - Servicios simulados, desarrollo sin dependencias, testing aislado

9. **¿Cómo integrar POSTMAN con CI/CD?**
   - Newman CLI, reportes automáticos, Jenkins, GitLab CI, GitHub Actions

---

## 📚 Recursos Adicionales

- [POSTMAN Documentation](https://learning.postman.com/)
- [POSTMAN API](https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-43db-9f5e-248a3485df18)
- [Newman CLI](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [POSTMAN Testing](https://learning.postman.com/docs/writing-scripts/test-scripts/)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de POSTMAN! 🚀** 