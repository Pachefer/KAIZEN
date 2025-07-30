# Capítulo 5: Testing, Deployment y Scaling
## Sección: Deployment Strategies (Blue-Green, Canary, Rolling Deployment)

---

### 1. Introducción y Teoría

Las **estrategias de deployment** son fundamentales en microservicios para garantizar despliegues seguros y sin interrupciones. Incluyen:

- **Blue-Green Deployment**: Despliegue con dos entornos idénticos
- **Canary Deployment**: Despliegue gradual a un subconjunto de usuarios
- **Rolling Deployment**: Actualización gradual de instancias
- **Feature Flags**: Activación/desactivación de funcionalidades

**Objetivos principales:**
- **Zero Downtime**: Sin interrupciones del servicio
- **Rollback Rápido**: Reversión inmediata en caso de problemas
- **Testing en Producción**: Validación con tráfico real
- **Monitoreo Continuo**: Observación del comportamiento del sistema

---

### 2. Ejemplo de Código: Blue-Green Deployment

#### 2.1. Configuración de Kubernetes para Blue-Green

```yaml
# Configuración para Blue-Green Deployment en Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: usuario-service-blue
  labels:
    app: usuario-service
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: usuario-service
      version: blue
  template:
    metadata:
      labels:
        app: usuario-service
        version: blue
    spec:
      containers:
      - name: usuario-service
        image: usuario-service:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "blue"
        - name: DATABASE_URL
          value: "jdbc:postgresql://blue-db:5432/usuarios"
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: usuario-service-blue-svc
spec:
  selector:
    app: usuario-service
    version: blue
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: usuario-service-green
  labels:
    app: usuario-service
    version: green
spec:
  replicas: 0  # Inicialmente sin réplicas
  selector:
    matchLabels:
      app: usuario-service
      version: green
  template:
    metadata:
      labels:
        app: usuario-service
        version: green
    spec:
      containers:
      - name: usuario-service
        image: usuario-service:1.1.0  # Nueva versión
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "green"
        - name: DATABASE_URL
          value: "jdbc:postgresql://green-db:5432/usuarios"
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: usuario-service-green-svc
spec:
  selector:
    app: usuario-service
    version: green
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: usuario-service-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: usuarios.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: usuario-service-blue-svc  # Inicialmente apunta a blue
            port:
              number: 80
```

#### 2.2. Servicio de Deployment Manager

```java
// Servicio para gestionar Blue-Green deployments
@Service
@Slf4j
public class BlueGreenDeploymentService {
    
    @Autowired
    private KubernetesClient kubernetesClient;
    
    @Autowired
    private HealthCheckService healthCheckService;
    
    @Autowired
    private MetricsService metricsService;
    
    // Método para iniciar Blue-Green deployment
    public DeploymentResult iniciarBlueGreenDeployment(String serviceName, String newVersion) {
        log.info("Iniciando Blue-Green deployment para {} versión {}", serviceName, newVersion);
        
        try {
            // 1. VERIFICAR ESTADO ACTUAL
            log.info("Paso 1: Verificar estado actual del servicio");
            DeploymentStatus currentStatus = obtenerEstadoDeployment(serviceName, "blue");
            
            if (!currentStatus.isHealthy()) {
                throw new DeploymentException("Servicio actual no está saludable");
            }
            
            // 2. DESPLEGAR NUEVA VERSIÓN EN GREEN
            log.info("Paso 2: Desplegar nueva versión en entorno green");
            boolean greenDeployed = desplegarVersionGreen(serviceName, newVersion);
            
            if (!greenDeployed) {
                throw new DeploymentException("Error desplegando versión green");
            }
            
            // 3. VERIFICAR SALUD DE GREEN
            log.info("Paso 3: Verificar salud del entorno green");
            boolean greenHealthy = verificarSaludGreen(serviceName);
            
            if (!greenHealthy) {
                log.error("Entorno green no está saludable, abortando deployment");
                rollbackGreen(serviceName);
                throw new DeploymentException("Entorno green no está saludable");
            }
            
            // 4. EJECUTAR PRUEBAS DE SMOKE
            log.info("Paso 4: Ejecutar pruebas de smoke en green");
            boolean smokeTestsPassed = ejecutarPruebasSmoke(serviceName, "green");
            
            if (!smokeTestsPassed) {
                log.error("Pruebas de smoke fallaron en green, abortando deployment");
                rollbackGreen(serviceName);
                throw new DeploymentException("Pruebas de smoke fallaron");
            }
            
            // 5. CAMBIAR TRÁFICO A GREEN
            log.info("Paso 5: Cambiar tráfico a entorno green");
            boolean trafficSwitched = cambiarTraficoAGreen(serviceName);
            
            if (!trafficSwitched) {
                log.error("Error cambiando tráfico a green, abortando deployment");
                rollbackGreen(serviceName);
                throw new DeploymentException("Error cambiando tráfico");
            }
            
            // 6. MONITOREAR GREEN EN PRODUCCIÓN
            log.info("Paso 6: Monitorear green en producción");
            boolean greenStable = monitorearGreenEnProduccion(serviceName);
            
            if (!greenStable) {
                log.error("Green inestable en producción, haciendo rollback");
                rollbackAGreen(serviceName);
                throw new DeploymentException("Green inestable en producción");
            }
            
            // 7. LIMPIAR ENTORNO BLUE
            log.info("Paso 7: Limpiar entorno blue");
            limpiarEntornoBlue(serviceName);
            
            log.info("Blue-Green deployment completado exitosamente");
            
            return new DeploymentResult(true, "Deployment completado exitosamente", 
                Map.of("version", newVersion, "environment", "green"));
            
        } catch (Exception e) {
            log.error("Error en Blue-Green deployment: {}", e.getMessage(), e);
            return new DeploymentResult(false, "Error: " + e.getMessage(), null);
        }
    }
    
    // Método para desplegar versión en green
    private boolean desplegarVersionGreen(String serviceName, String version) {
        try {
            log.info("Desplegando versión {} en green para {}", version, serviceName);
            
            // Actualizar deployment de green
            Deployment greenDeployment = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-green")
                .get();
            
            if (greenDeployment == null) {
                throw new DeploymentException("Deployment green no encontrado");
            }
            
            // Actualizar imagen
            greenDeployment.getSpec().getTemplate().getSpec().getContainers().get(0)
                .setImage(serviceName + ":" + version);
            
            // Aplicar cambios
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-green")
                .replace(greenDeployment);
            
            // Escalar a 3 réplicas
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-green")
                .scale(3);
            
            // Esperar que esté listo
            boolean isReady = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-green")
                .waitUntilReady(300, TimeUnit.SECONDS);
            
            log.info("Green deployment listo: {}", isReady);
            return isReady;
            
        } catch (Exception e) {
            log.error("Error desplegando green: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para verificar salud de green
    private boolean verificarSaludGreen(String serviceName) {
        try {
            log.info("Verificando salud de green para {}", serviceName);
            
            // Verificar readiness probe
            boolean readinessOk = healthCheckService.verificarReadiness(serviceName + "-green");
            if (!readinessOk) {
                log.warn("Readiness probe falló en green");
                return false;
            }
            
            // Verificar liveness probe
            boolean livenessOk = healthCheckService.verificarLiveness(serviceName + "-green");
            if (!livenessOk) {
                log.warn("Liveness probe falló en green");
                return false;
            }
            
            // Verificar métricas básicas
            boolean metricsOk = metricsService.verificarMetricasBasicas(serviceName + "-green");
            if (!metricsOk) {
                log.warn("Métricas básicas fallaron en green");
                return false;
            }
            
            log.info("Green está saludable");
            return true;
            
        } catch (Exception e) {
            log.error("Error verificando salud de green: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para ejecutar pruebas de smoke
    private boolean ejecutarPruebasSmoke(String serviceName, String environment) {
        try {
            log.info("Ejecutando pruebas de smoke en {} para {}", environment, serviceName);
            
            // Obtener URL del servicio
            String serviceUrl = obtenerServiceUrl(serviceName, environment);
            
            // Ejecutar pruebas básicas
            boolean healthCheckOk = ejecutarHealthCheck(serviceUrl);
            if (!healthCheckOk) {
                log.warn("Health check falló en smoke tests");
                return false;
            }
            
            boolean apiTestOk = ejecutarPruebaAPI(serviceUrl);
            if (!apiTestOk) {
                log.warn("Prueba de API falló en smoke tests");
                return false;
            }
            
            boolean performanceOk = ejecutarPruebaPerformance(serviceUrl);
            if (!performanceOk) {
                log.warn("Prueba de performance falló en smoke tests");
                return false;
            }
            
            log.info("Pruebas de smoke pasaron exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error ejecutando smoke tests: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para cambiar tráfico a green
    private boolean cambiarTraficoAGreen(String serviceName) {
        try {
            log.info("Cambiando tráfico a green para {}", serviceName);
            
            // Actualizar ingress para apuntar a green
            Ingress ingress = kubernetesClient.network()
                .v1()
                .ingresses()
                .inNamespace("default")
                .withName(serviceName + "-ingress")
                .get();
            
            if (ingress == null) {
                throw new DeploymentException("Ingress no encontrado");
            }
            
            // Cambiar backend service a green
            ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0).getBackend()
                .getService().setName(serviceName + "-green-svc");
            
            // Aplicar cambios
            kubernetesClient.network()
                .v1()
                .ingresses()
                .inNamespace("default")
                .withName(serviceName + "-ingress")
                .replace(ingress);
            
            // Esperar que el cambio se propague
            Thread.sleep(10000);
            
            log.info("Tráfico cambiado exitosamente a green");
            return true;
            
        } catch (Exception e) {
            log.error("Error cambiando tráfico: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para monitorear green en producción
    private boolean monitorearGreenEnProduccion(String serviceName) {
        try {
            log.info("Monitoreando green en producción para {}", serviceName);
            
            // Monitorear por 5 minutos
            long startTime = System.currentTimeMillis();
            long monitoringDuration = 5 * 60 * 1000; // 5 minutos
            
            while (System.currentTimeMillis() - startTime < monitoringDuration) {
                // Verificar métricas de error
                double errorRate = metricsService.obtenerErrorRate(serviceName + "-green");
                if (errorRate > 0.05) { // Más del 5% de errores
                    log.error("Error rate demasiado alto en green: {}%", errorRate * 100);
                    return false;
                }
                
                // Verificar latencia
                double avgLatency = metricsService.obtenerLatenciaPromedio(serviceName + "-green");
                if (avgLatency > 1000) { // Más de 1 segundo
                    log.error("Latencia demasiado alta en green: {}ms", avgLatency);
                    return false;
                }
                
                // Verificar throughput
                double throughput = metricsService.obtenerThroughput(serviceName + "-green");
                if (throughput < 100) { // Menos de 100 requests por minuto
                    log.error("Throughput demasiado bajo en green: {}", throughput);
                    return false;
                }
                
                Thread.sleep(30000); // Esperar 30 segundos
            }
            
            log.info("Green estable en producción");
            return true;
            
        } catch (Exception e) {
            log.error("Error monitoreando green: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para rollback a blue
    private void rollbackAGreen(String serviceName) {
        try {
            log.info("Haciendo rollback a blue para {}", serviceName);
            
            // Cambiar tráfico de vuelta a blue
            Ingress ingress = kubernetesClient.network()
                .v1()
                .ingresses()
                .inNamespace("default")
                .withName(serviceName + "-ingress")
                .get();
            
            ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0).getBackend()
                .getService().setName(serviceName + "-blue-svc");
            
            kubernetesClient.network()
                .v1()
                .ingresses()
                .inNamespace("default")
                .withName(serviceName + "-ingress")
                .replace(ingress);
            
            log.info("Rollback a blue completado");
            
        } catch (Exception e) {
            log.error("Error en rollback: {}", e.getMessage(), e);
        }
    }
    
    // Método para limpiar entorno blue
    private void limpiarEntornoBlue(String serviceName) {
        try {
            log.info("Limpiando entorno blue para {}", serviceName);
            
            // Escalar blue a 0 réplicas
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-blue")
                .scale(0);
            
            log.info("Entorno blue limpiado");
            
        } catch (Exception e) {
            log.error("Error limpiando blue: {}", e.getMessage(), e);
        }
    }
    
    // Métodos auxiliares
    private DeploymentStatus obtenerEstadoDeployment(String serviceName, String environment) {
        // Implementación para obtener estado del deployment
        return new DeploymentStatus(true, "Healthy");
    }
    
    private void rollbackGreen(String serviceName) {
        // Implementación para rollback de green
        log.info("Rollback de green completado");
    }
    
    private String obtenerServiceUrl(String serviceName, String environment) {
        return "http://" + serviceName + "-" + environment + "-svc:8080";
    }
    
    private boolean ejecutarHealthCheck(String serviceUrl) {
        // Implementación de health check
        return true;
    }
    
    private boolean ejecutarPruebaAPI(String serviceUrl) {
        // Implementación de prueba de API
        return true;
    }
    
    private boolean ejecutarPruebaPerformance(String serviceUrl) {
        // Implementación de prueba de performance
        return true;
    }
}
```

---

### 3. Ejemplo de Código: Canary Deployment

```java
// Servicio para gestionar Canary deployments
@Service
@Slf4j
public class CanaryDeploymentService {
    
    @Autowired
    private KubernetesClient kubernetesClient;
    
    @Autowired
    private MetricsService metricsService;
    
    @Autowired
    private LoadBalancerService loadBalancerService;
    
    // Método para iniciar Canary deployment
    public DeploymentResult iniciarCanaryDeployment(String serviceName, String newVersion, int initialPercentage) {
        log.info("Iniciando Canary deployment para {} versión {} con {}% de tráfico", 
            serviceName, newVersion, initialPercentage);
        
        try {
            // 1. DESPLEGAR CANARY
            log.info("Paso 1: Desplegar versión canary");
            boolean canaryDeployed = desplegarCanary(serviceName, newVersion);
            
            if (!canaryDeployed) {
                throw new DeploymentException("Error desplegando canary");
            }
            
            // 2. CONFIGURAR TRÁFICO INICIAL
            log.info("Paso 2: Configurar {}% de tráfico a canary", initialPercentage);
            boolean trafficConfigured = configurarTraficoCanary(serviceName, initialPercentage);
            
            if (!trafficConfigured) {
                throw new DeploymentException("Error configurando tráfico canary");
            }
            
            // 3. MONITOREAR CANARY
            log.info("Paso 3: Monitorear canary");
            boolean canaryStable = monitorearCanary(serviceName, initialPercentage);
            
            if (!canaryStable) {
                log.error("Canary inestable, abortando deployment");
                rollbackCanary(serviceName);
                throw new DeploymentException("Canary inestable");
            }
            
            // 4. AUMENTAR TRÁFICO GRADUALMENTE
            log.info("Paso 4: Aumentar tráfico gradualmente");
            boolean trafficIncreased = aumentarTraficoGradualmente(serviceName, initialPercentage);
            
            if (!trafficIncreased) {
                log.error("Error aumentando tráfico, abortando deployment");
                rollbackCanary(serviceName);
                throw new DeploymentException("Error aumentando tráfico");
            }
            
            // 5. PROMOVER A PRODUCCIÓN
            log.info("Paso 5: Promover canary a producción");
            boolean promoted = promoverCanary(serviceName);
            
            if (!promoted) {
                throw new DeploymentException("Error promoviendo canary");
            }
            
            log.info("Canary deployment completado exitosamente");
            
            return new DeploymentResult(true, "Canary deployment completado", 
                Map.of("version", newVersion, "final_percentage", "100"));
            
        } catch (Exception e) {
            log.error("Error en Canary deployment: {}", e.getMessage(), e);
            return new DeploymentResult(false, "Error: " + e.getMessage(), null);
        }
    }
    
    // Método para desplegar canary
    private boolean desplegarCanary(String serviceName, String version) {
        try {
            log.info("Desplegando canary versión {} para {}", version, serviceName);
            
            // Crear deployment canary
            Deployment canaryDeployment = new DeploymentBuilder()
                .withNewMetadata()
                    .withName(serviceName + "-canary")
                    .addToLabels("app", serviceName)
                    .addToLabels("version", "canary")
                .endMetadata()
                .withNewSpec()
                    .withReplicas(1)
                    .withNewSelector()
                        .addToMatchLabels("app", serviceName)
                        .addToMatchLabels("version", "canary")
                    .endSelector()
                    .withNewTemplate()
                        .withNewMetadata()
                            .addToLabels("app", serviceName)
                            .addToLabels("version", "canary")
                        .endMetadata()
                        .withNewSpec()
                            .addNewContainer()
                                .withName(serviceName)
                                .withImage(serviceName + ":" + version)
                                .addNewPort()
                                    .withContainerPort(8080)
                                .endPort()
                                .addNewEnv()
                                    .withName("SPRING_PROFILES_ACTIVE")
                                    .withValue("canary")
                                .endEnv()
                            .endContainer()
                        .endSpec()
                    .endTemplate()
                .endSpec()
                .build();
            
            // Aplicar deployment
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .create(canaryDeployment);
            
            // Esperar que esté listo
            boolean isReady = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-canary")
                .waitUntilReady(300, TimeUnit.SECONDS);
            
            log.info("Canary deployment listo: {}", isReady);
            return isReady;
            
        } catch (Exception e) {
            log.error("Error desplegando canary: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para configurar tráfico canary
    private boolean configurarTraficoCanary(String serviceName, int percentage) {
        try {
            log.info("Configurando {}% de tráfico a canary", percentage);
            
            // Configurar load balancer para distribuir tráfico
            loadBalancerService.configurarDistribucionTrafico(serviceName, percentage);
            
            // Esperar que la configuración se propague
            Thread.sleep(10000);
            
            log.info("Tráfico canary configurado exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error configurando tráfico canary: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para monitorear canary
    private boolean monitorearCanary(String serviceName, int percentage) {
        try {
            log.info("Monitoreando canary con {}% de tráfico", percentage);
            
            // Monitorear por 10 minutos
            long startTime = System.currentTimeMillis();
            long monitoringDuration = 10 * 60 * 1000; // 10 minutos
            
            while (System.currentTimeMillis() - startTime < monitoringDuration) {
                // Verificar métricas de canary
                double canaryErrorRate = metricsService.obtenerErrorRate(serviceName + "-canary");
                double productionErrorRate = metricsService.obtenerErrorRate(serviceName + "-production");
                
                // Comparar con producción
                if (canaryErrorRate > productionErrorRate * 1.5) { // 50% más errores
                    log.error("Canary tiene demasiados errores: {} vs {}", canaryErrorRate, productionErrorRate);
                    return false;
                }
                
                // Verificar latencia
                double canaryLatency = metricsService.obtenerLatenciaPromedio(serviceName + "-canary");
                double productionLatency = metricsService.obtenerLatenciaPromedio(serviceName + "-production");
                
                if (canaryLatency > productionLatency * 1.2) { // 20% más latencia
                    log.error("Canary tiene latencia muy alta: {} vs {}", canaryLatency, productionLatency);
                    return false;
                }
                
                // Verificar throughput
                double canaryThroughput = metricsService.obtenerThroughput(serviceName + "-canary");
                double expectedThroughput = metricsService.obtenerThroughput(serviceName + "-production") * (percentage / 100.0);
                
                if (canaryThroughput < expectedThroughput * 0.8) { // 80% del throughput esperado
                    log.error("Canary tiene throughput muy bajo: {} vs esperado {}", canaryThroughput, expectedThroughput);
                    return false;
                }
                
                Thread.sleep(60000); // Esperar 1 minuto
            }
            
            log.info("Canary estable durante monitoreo");
            return true;
            
        } catch (Exception e) {
            log.error("Error monitoreando canary: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para aumentar tráfico gradualmente
    private boolean aumentarTraficoGradualmente(String serviceName, int initialPercentage) {
        try {
            log.info("Aumentando tráfico gradualmente desde {}%", initialPercentage);
            
            int[] percentages = {25, 50, 75, 100};
            
            for (int percentage : percentages) {
                if (percentage <= initialPercentage) {
                    continue; // Saltar porcentajes ya configurados
                }
                
                log.info("Aumentando tráfico a {}%", percentage);
                
                // Configurar nuevo porcentaje
                boolean configured = configurarTraficoCanary(serviceName, percentage);
                if (!configured) {
                    log.error("Error configurando {}% de tráfico", percentage);
                    return false;
                }
                
                // Monitorear por 5 minutos
                boolean stable = monitorearCanary(serviceName, percentage);
                if (!stable) {
                    log.error("Canary inestable con {}% de tráfico", percentage);
                    return false;
                }
                
                log.info("Canary estable con {}% de tráfico", percentage);
            }
            
            log.info("Tráfico aumentado gradualmente exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error aumentando tráfico gradualmente: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para promover canary
    private boolean promoverCanary(String serviceName) {
        try {
            log.info("Promoviendo canary a producción para {}", serviceName);
            
            // Actualizar deployment de producción
            Deployment productionDeployment = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-production")
                .get();
            
            // Obtener imagen de canary
            String canaryImage = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-canary")
                .get()
                .getSpec()
                .getTemplate()
                .getSpec()
                .getContainers()
                .get(0)
                .getImage();
            
            // Actualizar imagen de producción
            productionDeployment.getSpec().getTemplate().getSpec().getContainers().get(0)
                .setImage(canaryImage);
            
            // Aplicar cambios
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-production")
                .replace(productionDeployment);
            
            // Configurar 100% de tráfico a producción
            loadBalancerService.configurarDistribucionTrafico(serviceName, 0); // 0% a canary = 100% a producción
            
            // Eliminar deployment canary
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-canary")
                .delete();
            
            log.info("Canary promovido exitosamente a producción");
            return true;
            
        } catch (Exception e) {
            log.error("Error promoviendo canary: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para rollback de canary
    private void rollbackCanary(String serviceName) {
        try {
            log.info("Haciendo rollback de canary para {}", serviceName);
            
            // Configurar 0% de tráfico a canary
            loadBalancerService.configurarDistribucionTrafico(serviceName, 0);
            
            // Eliminar deployment canary
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName + "-canary")
                .delete();
            
            log.info("Rollback de canary completado");
            
        } catch (Exception e) {
            log.error("Error en rollback de canary: {}", e.getMessage(), e);
        }
    }
}
```

---

### 4. Ejemplo de Código: Rolling Deployment

```java
// Servicio para gestionar Rolling deployments
@Service
@Slf4j
public class RollingDeploymentService {
    
    @Autowired
    private KubernetesClient kubernetesClient;
    
    @Autowired
    private HealthCheckService healthCheckService;
    
    // Método para iniciar Rolling deployment
    public DeploymentResult iniciarRollingDeployment(String serviceName, String newVersion, int maxUnavailable) {
        log.info("Iniciando Rolling deployment para {} versión {} con máximo {} indisponibles", 
            serviceName, newVersion, maxUnavailable);
        
        try {
            // 1. CONFIGURAR ESTRATEGIA ROLLING
            log.info("Paso 1: Configurar estrategia rolling");
            boolean strategyConfigured = configurarEstrategiaRolling(serviceName, maxUnavailable);
            
            if (!strategyConfigured) {
                throw new DeploymentException("Error configurando estrategia rolling");
            }
            
            // 2. ACTUALIZAR IMAGEN
            log.info("Paso 2: Actualizar imagen a versión {}", newVersion);
            boolean imageUpdated = actualizarImagen(serviceName, newVersion);
            
            if (!imageUpdated) {
                throw new DeploymentException("Error actualizando imagen");
            }
            
            // 3. MONITOREAR ROLLING UPDATE
            log.info("Paso 3: Monitorear rolling update");
            boolean rollingSuccessful = monitorearRollingUpdate(serviceName);
            
            if (!rollingSuccessful) {
                log.error("Rolling update falló, iniciando rollback");
                rollbackRolling(serviceName);
                throw new DeploymentException("Rolling update falló");
            }
            
            // 4. VERIFICAR DESPLIEGUE COMPLETO
            log.info("Paso 4: Verificar despliegue completo");
            boolean deploymentComplete = verificarDespliegueCompleto(serviceName);
            
            if (!deploymentComplete) {
                throw new DeploymentException("Despliegue incompleto");
            }
            
            log.info("Rolling deployment completado exitosamente");
            
            return new DeploymentResult(true, "Rolling deployment completado", 
                Map.of("version", newVersion, "strategy", "rolling"));
            
        } catch (Exception e) {
            log.error("Error en Rolling deployment: {}", e.getMessage(), e);
            return new DeploymentResult(false, "Error: " + e.getMessage(), null);
        }
    }
    
    // Método para configurar estrategia rolling
    private boolean configurarEstrategiaRolling(String serviceName, int maxUnavailable) {
        try {
            log.info("Configurando estrategia rolling con máximo {} indisponibles", maxUnavailable);
            
            // Obtener deployment actual
            Deployment deployment = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .get();
            
            if (deployment == null) {
                throw new DeploymentException("Deployment no encontrado");
            }
            
            // Configurar estrategia rolling update
            RollingUpdateDeployment rollingUpdate = new RollingUpdateDeploymentBuilder()
                .withMaxUnavailable(new IntOrString(maxUnavailable))
                .withMaxSurge(new IntOrString(1))
                .build();
            
            deployment.getSpec().getStrategy().setRollingUpdate(rollingUpdate);
            
            // Aplicar cambios
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .replace(deployment);
            
            log.info("Estrategia rolling configurada exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error configurando estrategia rolling: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para actualizar imagen
    private boolean actualizarImagen(String serviceName, String version) {
        try {
            log.info("Actualizando imagen a versión {} para {}", version, serviceName);
            
            // Obtener deployment
            Deployment deployment = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .get();
            
            // Actualizar imagen
            deployment.getSpec().getTemplate().getSpec().getContainers().get(0)
                .setImage(serviceName + ":" + version);
            
            // Aplicar cambios
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .replace(deployment);
            
            log.info("Imagen actualizada exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error actualizando imagen: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para monitorear rolling update
    private boolean monitorearRollingUpdate(String serviceName) {
        try {
            log.info("Monitoreando rolling update para {}", serviceName);
            
            // Monitorear hasta que el rolling update se complete
            boolean updateComplete = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .waitUntilCondition(deployment -> {
                    // Verificar que el rolling update se completó
                    return deployment.getStatus().getUpdatedReplicas() != null &&
                           deployment.getStatus().getUpdatedReplicas().equals(deployment.getSpec().getReplicas()) &&
                           deployment.getStatus().getAvailableReplicas() != null &&
                           deployment.getStatus().getAvailableReplicas().equals(deployment.getSpec().getReplicas());
                }, 600, TimeUnit.SECONDS);
            
            if (!updateComplete) {
                log.error("Rolling update no se completó en el tiempo esperado");
                return false;
            }
            
            log.info("Rolling update completado exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error monitoreando rolling update: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para verificar despliegue completo
    private boolean verificarDespliegueCompleto(String serviceName) {
        try {
            log.info("Verificando despliegue completo para {}", serviceName);
            
            // Verificar que todas las réplicas están listas
            Deployment deployment = kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .get();
            
            int desiredReplicas = deployment.getSpec().getReplicas();
            int readyReplicas = deployment.getStatus().getReadyReplicas() != null ? 
                deployment.getStatus().getReadyReplicas() : 0;
            
            if (readyReplicas != desiredReplicas) {
                log.error("No todas las réplicas están listas: {}/{}", readyReplicas, desiredReplicas);
                return false;
            }
            
            // Verificar health checks
            boolean healthOk = healthCheckService.verificarSaludServicio(serviceName);
            if (!healthOk) {
                log.error("Health checks fallaron después del rolling update");
                return false;
            }
            
            log.info("Despliegue completo verificado exitosamente");
            return true;
            
        } catch (Exception e) {
            log.error("Error verificando despliegue completo: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para rollback de rolling deployment
    private void rollbackRolling(String serviceName) {
        try {
            log.info("Haciendo rollback de rolling deployment para {}", serviceName);
            
            // Hacer rollback a la versión anterior
            kubernetesClient.apps()
                .deployments()
                .inNamespace("default")
                .withName(serviceName)
                .rollout()
                .undo();
            
            log.info("Rollback de rolling deployment completado");
            
        } catch (Exception e) {
            log.error("Error en rollback de rolling deployment: {}", e.getMessage(), e);
        }
    }
}
```

---

### 5. Pruebas Unitarias para Deployment Strategies

```java
// Pruebas unitarias para servicios de deployment
@SpringBootTest
public class DeploymentStrategiesTest {
    
    @Autowired
    private BlueGreenDeploymentService blueGreenService;
    
    @Autowired
    private CanaryDeploymentService canaryService;
    
    @Autowired
    private RollingDeploymentService rollingService;
    
    @MockBean
    private KubernetesClient kubernetesClient;
    
    @MockBean
    private HealthCheckService healthCheckService;
    
    @MockBean
    private MetricsService metricsService;
    
    @Test
    public void testBlueGreenDeployment() {
        // Arrange: Configurar mocks
        when(healthCheckService.verificarReadiness(anyString())).thenReturn(true);
        when(healthCheckService.verificarLiveness(anyString())).thenReturn(true);
        when(metricsService.verificarMetricasBasicas(anyString())).thenReturn(true);
        when(metricsService.obtenerErrorRate(anyString())).thenReturn(0.01);
        when(metricsService.obtenerLatenciaPromedio(anyString())).thenReturn(500.0);
        when(metricsService.obtenerThroughput(anyString())).thenReturn(1000.0);
        
        // Act: Ejecutar blue-green deployment
        DeploymentResult result = blueGreenService.iniciarBlueGreenDeployment("usuario-service", "1.1.0");
        
        // Assert: Verificar resultado
        assertTrue(result.isSuccess());
        assertEquals("Deployment completado exitosamente", result.getMessage());
        assertEquals("1.1.0", result.getDetails().get("version"));
        assertEquals("green", result.getDetails().get("environment"));
    }
    
    @Test
    public void testCanaryDeployment() {
        // Arrange: Configurar mocks
        when(metricsService.obtenerErrorRate(anyString())).thenReturn(0.01);
        when(metricsService.obtenerLatenciaPromedio(anyString())).thenReturn(500.0);
        when(metricsService.obtenerThroughput(anyString())).thenReturn(1000.0);
        
        // Act: Ejecutar canary deployment
        DeploymentResult result = canaryService.iniciarCanaryDeployment("usuario-service", "1.1.0", 10);
        
        // Assert: Verificar resultado
        assertTrue(result.isSuccess());
        assertEquals("Canary deployment completado", result.getMessage());
        assertEquals("1.1.0", result.getDetails().get("version"));
        assertEquals("100", result.getDetails().get("final_percentage"));
    }
    
    @Test
    public void testRollingDeployment() {
        // Arrange: Configurar mocks
        when(healthCheckService.verificarSaludServicio(anyString())).thenReturn(true);
        
        // Act: Ejecutar rolling deployment
        DeploymentResult result = rollingService.iniciarRollingDeployment("usuario-service", "1.1.0", 1);
        
        // Assert: Verificar resultado
        assertTrue(result.isSuccess());
        assertEquals("Rolling deployment completado", result.getMessage());
        assertEquals("1.1.0", result.getDetails().get("version"));
        assertEquals("rolling", result.getDetails().get("strategy"));
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Feature Flags**: Implementar feature flags para activación gradual
- **Automated Rollback**: Rollback automático basado en métricas
- **Deployment Pipeline**: Pipeline automatizado para deployments
- **Monitoring Integration**: Integración con sistemas de monitoreo
- **A/B Testing**: Testing A/B integrado con deployments

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Blue-Green exitoso**:
    - Zero downtime durante el deployment
    - Rollback rápido en caso de problemas
    - Validación completa antes del switch

#### 7.2. Escenarios de error

- **Error en nueva versión**:
    - Detección automática de problemas
    - Rollback automático a versión estable
    - Notificación a equipos de desarrollo

- **Error de infraestructura**:
    - Fallback a versión estable
    - Monitoreo continuo del estado
    - Recuperación automática cuando sea posible

---

### 8. Explicación Detallada de la Lógica

- **Blue-Green**: Dos entornos idénticos para switch instantáneo
- **Canary**: Despliegue gradual con monitoreo continuo
- **Rolling**: Actualización gradual sin interrupciones
- **Health Checks**: Verificación de salud antes de switches
- **Metrics Monitoring**: Monitoreo de métricas para decisiones

---

¿Deseas que continúe con la siguiente sección del capítulo 5 (por ejemplo, "Scaling Strategies") o proceder con el Capítulo 7? 