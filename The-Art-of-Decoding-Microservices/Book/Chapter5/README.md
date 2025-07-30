# Capítulo 5: Testing, Deploying y Scaling de Microservicios

## 📚 **Descripción del Capítulo**

Este capítulo se enfoca en las estrategias prácticas para testing, deployment y scaling de microservicios. Aprenderás cómo implementar testing unitario, de integración, contract testing y end-to-end testing, así como estrategias de despliegue y técnicas de escalado.

## 🎯 **Objetivos de Aprendizaje**

- Implementar testing unitario efectivo con JUnit 5 y Mockito
- Diseñar estrategias de testing de integración robustas
- Utilizar contract testing con Pact para garantizar compatibilidad
- Configurar testing end-to-end automatizado
- Implementar estrategias de despliegue seguras (Blue-Green, Canary, Rolling)
- Aplicar técnicas de escalado horizontal y vertical
- Monitorear y optimizar el rendimiento de microservicios

## 📁 **Estructura del Proyecto**

```
Chapter5/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/microservices/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       └── config/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   └── test/
│       ├── java/
│       │   └── com/microservices/
│       │       ├── unit/
│       │       ├── integration/
│       │       ├── contract/
│       │       └── e2e/
│       └── resources/
│           ├── test-data/
│           └── pact/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── README.md
```

## 🛠️ **Tecnologías Utilizadas**

### **Testing Frameworks**
- **JUnit 5**: Framework de testing unitario
- **Mockito**: Framework de mocking
- **TestContainers**: Testing con contenedores
- **Pact**: Contract testing
- **RestAssured**: Testing de APIs REST

### **Deployment Tools**
- **Docker**: Containerización
- **Kubernetes**: Orquestación de contenedores
- **Jenkins/GitLab CI**: CI/CD pipelines
- **ArgoCD**: GitOps deployment

### **Monitoring & Scaling**
- **Prometheus**: Métricas y monitoreo
- **Grafana**: Visualización de métricas
- **Jaeger**: Distributed tracing
- **Kubernetes HPA**: Auto-scaling

## 🚀 **Instrucciones de Uso**

### **1. Compilar el Proyecto**

```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar tests unitarios
mvn test

# Ejecutar tests de integración
mvn verify

# Ejecutar tests de performance
mvn test -Pperformance
```

### **2. Ejecutar la Aplicación**

```bash
# Ejecutar en modo desarrollo
mvn spring-boot:run

# Ejecutar con perfil específico
mvn spring-boot:run -Dspring.profiles.active=test

# Ejecutar con Docker
docker-compose up -d
```

### **3. Ejecutar Tests Específicos**

```bash
# Solo tests unitarios
mvn test -Punit-tests

# Solo tests de integración
mvn test -Pintegration-tests

# Solo tests end-to-end
mvn test -Pe2e-tests

# Tests de performance
mvn test -Pperformance-tests
```

### **4. Desplegar en Kubernetes**

```bash
# Construir imagen Docker
mvn clean package dockerfile:build

# Desplegar en Kubernetes
kubectl apply -f kubernetes/

# Verificar el despliegue
kubectl get pods
kubectl get services
```

## 📊 **Ejemplos de Testing**

### **1. Unit Testing**

```java
@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {
    
    @InjectMocks
    private ItemServiceImpl itemService;
    
    @Test
    public void testGetAllItems() {
        // Given
        Item item1 = new Item(1L, "Item 1");
        Item item2 = new Item(2L, "Item 2");
        
        // When
        List<Item> items = itemService.getAllItems();
        
        // Then
        assertEquals(2, items.size());
        assertTrue(items.stream().anyMatch(item -> "Item 1".equals(item.getName())));
    }
}
```

### **2. Integration Testing**

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ItemControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    public void testGetAllItems() {
        // When
        ResponseEntity<List<Item>> response = restTemplate.exchange(
            "/api/items",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<Item>>() {}
        );
        
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

### **3. Contract Testing**

```java
@ExtendWith(PactConsumerTestExt.class)
public class ItemConsumerPactTest {
    
    @Pact(consumer = "ItemConsumer", provider = "ItemProvider")
    public RequestResponsePact createPact(PactDslWithProvider builder) {
        return builder
            .given("items exist")
            .uponReceiving("a request for all items")
            .path("/api/items")
            .method("GET")
            .willRespondWith()
            .status(200)
            .body(new PactDslJsonArray()
                .object()
                .numberType("id", 1)
                .stringType("name", "Item 1")
                .closeObject()
            )
            .toPact();
    }
    
    @Test
    @PactTestFor(providerName = "ItemProvider")
    public void testGetAllItems(MockServer mockServer) {
        // Test implementation
    }
}
```

## 🔧 **Estrategias de Deployment**

### **1. Blue-Green Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: item-service-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: item-service
      version: blue
  template:
    metadata:
      labels:
        app: item-service
        version: blue
    spec:
      containers:
      - name: item-service
        image: item-service:1.0.0
        ports:
        - containerPort: 8080
```

### **2. Canary Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: item-service-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: item-service
      version: canary
  template:
    metadata:
      labels:
        app: item-service
        version: canary
    spec:
      containers:
      - name: item-service
        image: item-service:2.0.0
        ports:
        - containerPort: 8080
```

### **3. Rolling Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: item-service
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: item-service
  template:
    metadata:
      labels:
        app: item-service
    spec:
      containers:
      - name: item-service
        image: item-service:latest
        ports:
        - containerPort: 8080
```

## 📈 **Estrategias de Scaling**

### **1. Horizontal Pod Autoscaler**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: item-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: item-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### **2. Vertical Pod Autoscaler**

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: item-service-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: item-service
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: '*'
      minAllowed:
        cpu: 100m
        memory: 50Mi
      maxAllowed:
        cpu: 1
        memory: 500Mi
      controlledValues: RequestsAndLimits
```

## 📊 **Métricas y Monitoreo**

### **1. Prometheus Configuration**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'item-service'
      static_configs:
      - targets: ['item-service:8080']
      metrics_path: '/actuator/prometheus'
```

### **2. Grafana Dashboard**

```json
{
  "dashboard": {
    "title": "Item Service Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

## 🧪 **Testing Commands**

### **Ejecutar Tests Específicos**

```bash
# Tests unitarios
mvn test -Dtest=ItemServiceTest

# Tests de integración
mvn test -Dtest=ItemControllerIntegrationTest

# Tests de contract
mvn test -Dtest=ItemConsumerPactTest

# Tests de performance
mvn gatling:test -Dgatling.simulationClass=PerformanceSimulation
```

### **Cobertura de Código**

```bash
# Generar reporte de cobertura
mvn jacoco:report

# Verificar cobertura mínima
mvn jacoco:check
```

## 🔍 **Troubleshooting**

### **Problemas Comunes**

1. **Tests fallando en CI/CD**
   - Verificar variables de entorno
   - Asegurar que TestContainers esté disponible
   - Revisar logs de Docker

2. **Performance tests lentos**
   - Optimizar configuración de TestContainers
   - Usar imágenes Docker más pequeñas
   - Configurar timeouts apropiados

3. **Contract tests fallando**
   - Verificar que el Pact Broker esté accesible
   - Revisar versiones de contratos
   - Validar formato de requests/responses

### **Logs y Debugging**

```bash
# Ver logs de la aplicación
kubectl logs -f deployment/item-service

# Ver logs de Prometheus
kubectl logs -f deployment/prometheus

# Ver logs de Grafana
kubectl logs -f deployment/grafana

# Debug de pods
kubectl describe pod <pod-name>
```

## 📚 **Recursos Adicionales**

- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [TestContainers Documentation](https://www.testcontainers.org/)
- [Pact Documentation](https://docs.pact.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)

## 🤝 **Contribución**

Para contribuir a este capítulo:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 