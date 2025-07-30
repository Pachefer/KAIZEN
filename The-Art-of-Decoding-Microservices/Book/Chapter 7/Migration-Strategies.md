# Capítulo 7: Estudios de Caso, Evitando Trampas y Futuro
## Sección: Migration Strategies (Estrategias de Migración de Monolitos a Microservicios)

---

### 1. Introducción y Teoría

Las **estrategias de migración** son fundamentales para transformar aplicaciones monolíticas en microservicios de forma segura y eficiente. Incluyen:

- **Strangler Fig Pattern**: Reemplazar gradualmente partes del monolito
- **Database Migration**: Migrar bases de datos de forma incremental
- **API Gateway**: Introducir gateway para gestionar transiciones
- **Feature Flags**: Controlar activación de nuevas funcionalidades

**Fases de migración:**
- **Análisis y Planificación**: Evaluar el monolito actual
- **Preparación**: Preparar infraestructura y herramientas
- **Migración Incremental**: Migrar servicios uno por uno
- **Validación**: Verificar funcionamiento correcto
- **Optimización**: Mejorar rendimiento y escalabilidad

---

### 2. Estrategia 1: Strangler Fig Pattern

#### 2.1. Implementación del Strangler Fig Pattern

```java
// Implementación del Strangler Fig Pattern
@Service
@Slf4j
public class StranglerFigService {
    
    @Autowired
    private MonolithService monolithService;
    
    @Autowired
    private MicroserviceService microserviceService;
    
    @Autowired
    private FeatureFlagService featureFlagService;
    
    @Autowired
    private MetricsService metricsService;
    
    // Método principal que implementa el Strangler Fig Pattern
    public Response handleRequest(Request request) {
        log.info("Manejando request con Strangler Fig Pattern: {}", request.getRequestId());
        
        try {
            // 1. VERIFICAR SI LA FUNCIONALIDAD HA SIDO MIGRADA
            String featureName = determineFeatureName(request);
            boolean isMigrated = featureFlagService.isFeatureEnabled(featureName);
            
            if (isMigrated) {
                log.debug("Funcionalidad migrada, usando microservicio: {}", featureName);
                return handleWithMicroservice(request, featureName);
            } else {
                log.debug("Funcionalidad no migrada, usando monolito: {}", featureName);
                return handleWithMonolith(request, featureName);
            }
            
        } catch (Exception e) {
            log.error("Error en Strangler Fig Pattern: {}", e.getMessage(), e);
            return handleFallback(request);
        }
    }
    
    // Método para manejar request con microservicio
    private Response handleWithMicroservice(Request request, String featureName) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Intentar con microservicio
            Response response = microserviceService.processRequest(request);
            
            // Registrar métricas de éxito
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMicroserviceSuccess(featureName, duration);
            
            log.debug("Request procesado exitosamente por microservicio: {}", request.getRequestId());
            return response;
            
        } catch (Exception e) {
            log.warn("Error en microservicio, fallback a monolito: {}", e.getMessage());
            
            // Registrar métricas de fallo
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMicroserviceFailure(featureName, duration, e.getMessage());
            
            // Fallback a monolito
            return handleWithMonolith(request, featureName);
        }
    }
    
    // Método para manejar request con monolito
    private Response handleWithMonolith(Request request, String featureName) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Procesar con monolito
            Response response = monolithService.processRequest(request);
            
            // Registrar métricas
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMonolithSuccess(featureName, duration);
            
            log.debug("Request procesado exitosamente por monolito: {}", request.getRequestId());
            return response;
            
        } catch (Exception e) {
            log.error("Error en monolito: {}", e.getMessage(), e);
            
            // Registrar métricas de fallo
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMonolithFailure(featureName, duration, e.getMessage());
            
            throw e;
        }
    }
    
    // Método para determinar nombre de la funcionalidad
    private String determineFeatureName(Request request) {
        // Lógica para determinar qué funcionalidad está siendo solicitada
        String path = request.getPath();
        String method = request.getMethod();
        
        if (path.startsWith("/api/users")) {
            return "user-management";
        } else if (path.startsWith("/api/orders")) {
            return "order-management";
        } else if (path.startsWith("/api/payments")) {
            return "payment-processing";
        } else if (path.startsWith("/api/inventory")) {
            return "inventory-management";
        } else {
            return "unknown-feature";
        }
    }
    
    // Método para manejo de fallback
    private Response handleFallback(Request request) {
        log.warn("Usando fallback para request: {}", request.getRequestId());
        
        try {
            // Intentar con monolito como último recurso
            return monolithService.processRequest(request);
        } catch (Exception e) {
            log.error("Error en fallback: {}", e.getMessage(), e);
            
            // Devolver respuesta de error
            Response errorResponse = new Response();
            errorResponse.setSuccess(false);
            errorResponse.setErrorMessage("Servicio temporalmente no disponible");
            errorResponse.setStatusCode(503);
            return errorResponse;
        }
    }
    
    // Método para migrar funcionalidad gradualmente
    public MigrationResult migrateFeature(String featureName, MigrationStrategy strategy) {
        log.info("Iniciando migración de funcionalidad: {} con estrategia: {}", featureName, strategy);
        
        try {
            switch (strategy) {
                case CANARY:
                    return migrateWithCanary(featureName);
                case BLUE_GREEN:
                    return migrateWithBlueGreen(featureName);
                case GRADUAL:
                    return migrateWithGradual(featureName);
                default:
                    throw new IllegalArgumentException("Estrategia no soportada: " + strategy);
            }
            
        } catch (Exception e) {
            log.error("Error migrando funcionalidad: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migración con Canary
    private MigrationResult migrateWithCanary(String featureName) {
        log.info("Migrando funcionalidad con Canary: {}", featureName);
        
        try {
            // 1. Habilitar para 1% del tráfico
            featureFlagService.enableFeatureForPercentage(featureName, 1.0);
            
            // 2. Monitorear métricas
            boolean metricsOk = monitorMetrics(featureName, Duration.ofMinutes(30));
            if (!metricsOk) {
                log.warn("Métricas no satisfactorias, deshabilitando Canary");
                featureFlagService.disableFeature(featureName);
                return new MigrationResult(false, "Métricas no satisfactorias");
            }
            
            // 3. Aumentar gradualmente
            featureFlagService.enableFeatureForPercentage(featureName, 5.0);
            metricsOk = monitorMetrics(featureName, Duration.ofMinutes(30));
            if (!metricsOk) {
                featureFlagService.disableFeature(featureName);
                return new MigrationResult(false, "Métricas no satisfactorias en 5%");
            }
            
            // 4. Continuar aumentando
            featureFlagService.enableFeatureForPercentage(featureName, 25.0);
            metricsOk = monitorMetrics(featureName, Duration.ofMinutes(30));
            if (!metricsOk) {
                featureFlagService.disableFeature(featureName);
                return new MigrationResult(false, "Métricas no satisfactorias en 25%");
            }
            
            // 5. Habilitar completamente
            featureFlagService.enableFeature(featureName);
            
            log.info("Migración Canary completada exitosamente: {}", featureName);
            return new MigrationResult(true, "Migración Canary completada");
            
        } catch (Exception e) {
            log.error("Error en migración Canary: {}", e.getMessage(), e);
            featureFlagService.disableFeature(featureName);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migración con Blue-Green
    private MigrationResult migrateWithBlueGreen(String featureName) {
        log.info("Migrando funcionalidad con Blue-Green: {}", featureName);
        
        try {
            // 1. Preparar entorno Green
            boolean greenReady = prepareGreenEnvironment(featureName);
            if (!greenReady) {
                return new MigrationResult(false, "Error preparando entorno Green");
            }
            
            // 2. Habilitar funcionalidad en Green
            featureFlagService.enableFeatureForEnvironment(featureName, "green");
            
            // 3. Monitorear Green
            boolean greenStable = monitorGreenEnvironment(featureName, Duration.ofMinutes(60));
            if (!greenStable) {
                log.warn("Green no estable, abortando migración");
                featureFlagService.disableFeatureForEnvironment(featureName, "green");
                return new MigrationResult(false, "Green no estable");
            }
            
            // 4. Cambiar tráfico a Green
            boolean trafficSwitched = switchTrafficToGreen(featureName);
            if (!trafficSwitched) {
                return new MigrationResult(false, "Error cambiando tráfico");
            }
            
            // 5. Habilitar completamente
            featureFlagService.enableFeature(featureName);
            
            log.info("Migración Blue-Green completada exitosamente: {}", featureName);
            return new MigrationResult(true, "Migración Blue-Green completada");
            
        } catch (Exception e) {
            log.error("Error en migración Blue-Green: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migración gradual
    private MigrationResult migrateWithGradual(String featureName) {
        log.info("Migrando funcionalidad gradualmente: {}", featureName);
        
        try {
            // Migrar por etapas: 10%, 25%, 50%, 75%, 100%
            double[] percentages = {10.0, 25.0, 50.0, 75.0, 100.0};
            
            for (double percentage : percentages) {
                log.info("Migrando {}% del tráfico para: {}", percentage, featureName);
                
                featureFlagService.enableFeatureForPercentage(featureName, percentage);
                
                // Monitorear por 1 hora
                boolean metricsOk = monitorMetrics(featureName, Duration.ofHours(1));
                if (!metricsOk) {
                    log.warn("Métricas no satisfactorias en {}%, deshabilitando", percentage);
                    featureFlagService.disableFeature(featureName);
                    return new MigrationResult(false, "Métricas no satisfactorias en " + percentage + "%");
                }
                
                log.info("{}% migrado exitosamente", percentage);
            }
            
            log.info("Migración gradual completada exitosamente: {}", featureName);
            return new MigrationResult(true, "Migración gradual completada");
            
        } catch (Exception e) {
            log.error("Error en migración gradual: {}", e.getMessage(), e);
            featureFlagService.disableFeature(featureName);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Métodos auxiliares
    private boolean monitorMetrics(String featureName, Duration duration) {
        try {
            // Simular monitoreo de métricas
            Thread.sleep(duration.toMillis());
            
            // Verificar métricas de error rate, latencia, throughput
            double errorRate = metricsService.getErrorRate(featureName);
            double latency = metricsService.getAverageLatency(featureName);
            double throughput = metricsService.getThroughput(featureName);
            
            boolean errorRateOk = errorRate < 0.05; // Menos del 5%
            boolean latencyOk = latency < 1000; // Menos de 1 segundo
            boolean throughputOk = throughput > 100; // Más de 100 req/s
            
            log.info("Métricas para {}: Error Rate={}%, Latency={}ms, Throughput={} req/s", 
                featureName, errorRate * 100, latency, throughput);
            
            return errorRateOk && latencyOk && throughputOk;
            
        } catch (Exception e) {
            log.error("Error monitoreando métricas: {}", e.getMessage(), e);
            return false;
        }
    }
    
    private boolean prepareGreenEnvironment(String featureName) {
        // Implementación para preparar entorno Green
        log.info("Preparando entorno Green para: {}", featureName);
        return true; // Simulado
    }
    
    private boolean monitorGreenEnvironment(String featureName, Duration duration) {
        // Implementación para monitorear entorno Green
        log.info("Monitoreando entorno Green para: {}", featureName);
        return true; // Simulado
    }
    
    private boolean switchTrafficToGreen(String featureName) {
        // Implementación para cambiar tráfico a Green
        log.info("Cambiando tráfico a Green para: {}", featureName);
        return true; // Simulado
    }
}
```

---

### 3. Estrategia 2: Database Migration

#### 3.1. Implementación de Database Migration

```java
// Servicio para migración de bases de datos
@Service
@Slf4j
public class DatabaseMigrationService {
    
    @Autowired
    private MonolithDatabaseService monolithDb;
    
    @Autowired
    private MicroserviceDatabaseService microserviceDb;
    
    @Autowired
    private DataSyncService dataSyncService;
    
    @Autowired
    private MigrationRepository migrationRepository;
    
    // Método para iniciar migración de base de datos
    public MigrationResult startDatabaseMigration(String tableName, MigrationStrategy strategy) {
        log.info("Iniciando migración de base de datos: {} con estrategia: {}", tableName, strategy);
        
        try {
            // 1. VALIDAR TABLA
            log.debug("Validando tabla: {}", tableName);
            boolean tableValid = validateTable(tableName);
            if (!tableValid) {
                return new MigrationResult(false, "Tabla inválida: " + tableName);
            }
            
            // 2. CREAR REGISTRO DE MIGRACIÓN
            log.debug("Creando registro de migración");
            MigrationRecord migrationRecord = createMigrationRecord(tableName, strategy);
            
            // 3. EJECUTAR MIGRACIÓN SEGÚN ESTRATEGIA
            MigrationResult result;
            switch (strategy) {
                case FULL_SYNC:
                    result = migrateWithFullSync(tableName, migrationRecord);
                    break;
                case INCREMENTAL:
                    result = migrateWithIncremental(tableName, migrationRecord);
                    break;
                case SHADOW:
                    result = migrateWithShadow(tableName, migrationRecord);
                    break;
                default:
                    throw new IllegalArgumentException("Estrategia no soportada: " + strategy);
            }
            
            // 4. ACTUALIZAR REGISTRO DE MIGRACIÓN
            updateMigrationRecord(migrationRecord, result);
            
            log.info("Migración de base de datos completada: {}", tableName);
            return result;
            
        } catch (Exception e) {
            log.error("Error en migración de base de datos: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migración con sincronización completa
    private MigrationResult migrateWithFullSync(String tableName, MigrationRecord migrationRecord) {
        log.info("Migrando tabla con sincronización completa: {}", tableName);
        
        try {
            // 1. CREAR TABLA EN MICROSERVICIO
            log.debug("Creando tabla en microservicio: {}", tableName);
            boolean tableCreated = microserviceDb.createTable(tableName);
            if (!tableCreated) {
                return new MigrationResult(false, "Error creando tabla en microservicio");
            }
            
            // 2. OBTENER TODOS LOS DATOS DEL MONOLITO
            log.debug("Obteniendo datos del monolito: {}", tableName);
            List<Map<String, Object>> monolithData = monolithDb.getAllData(tableName);
            
            // 3. INSERTAR DATOS EN MICROSERVICIO
            log.debug("Insertando datos en microservicio: {} registros", monolithData.size());
            boolean dataInserted = microserviceDb.insertData(tableName, monolithData);
            if (!dataInserted) {
                return new MigrationResult(false, "Error insertando datos en microservicio");
            }
            
            // 4. VERIFICAR INTEGRIDAD
            log.debug("Verificando integridad de datos");
            boolean integrityOk = verifyDataIntegrity(tableName, monolithData.size());
            if (!integrityOk) {
                return new MigrationResult(false, "Error en integridad de datos");
            }
            
            // 5. CONFIGURAR SÍNCRONIZACIÓN BIDIRECCIONAL
            log.debug("Configurando sincronización bidireccional");
            boolean syncConfigured = configureBidirectionalSync(tableName);
            if (!syncConfigured) {
                return new MigrationResult(false, "Error configurando sincronización");
            }
            
            log.info("Migración con sincronización completa exitosa: {}", tableName);
            return new MigrationResult(true, "Migración completa exitosa");
            
        } catch (Exception e) {
            log.error("Error en migración completa: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migración incremental
    private MigrationResult migrateWithIncremental(String tableName, MigrationRecord migrationRecord) {
        log.info("Migrando tabla incrementalmente: {}", tableName);
        
        try {
            // 1. CREAR TABLA EN MICROSERVICIO
            log.debug("Creando tabla en microservicio: {}", tableName);
            boolean tableCreated = microserviceDb.createTable(tableName);
            if (!tableCreated) {
                return new MigrationResult(false, "Error creando tabla en microservicio");
            }
            
            // 2. MIGRAR DATOS EXISTENTES EN LOTES
            log.debug("Migrando datos existentes en lotes");
            boolean existingDataMigrated = migrateExistingDataInBatches(tableName);
            if (!existingDataMigrated) {
                return new MigrationResult(false, "Error migrando datos existentes");
            }
            
            // 3. CONFIGURAR CAPTURA DE CAMBIOS
            log.debug("Configurando captura de cambios");
            boolean changeCaptureConfigured = configureChangeCapture(tableName);
            if (!changeCaptureConfigured) {
                return new MigrationResult(false, "Error configurando captura de cambios");
            }
            
            // 4. INICIAR SÍNCRONIZACIÓN EN TIEMPO REAL
            log.debug("Iniciando sincronización en tiempo real");
            boolean realTimeSyncStarted = startRealTimeSync(tableName);
            if (!realTimeSyncStarted) {
                return new MigrationResult(false, "Error iniciando sincronización en tiempo real");
            }
            
            log.info("Migración incremental exitosa: {}", tableName);
            return new MigrationResult(true, "Migración incremental exitosa");
            
        } catch (Exception e) {
            log.error("Error en migración incremental: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migración con shadow
    private MigrationResult migrateWithShadow(String tableName, MigrationRecord migrationRecord) {
        log.info("Migrando tabla con shadow: {}", tableName);
        
        try {
            // 1. CREAR TABLA SHADOW
            log.debug("Creando tabla shadow: {}", tableName);
            boolean shadowTableCreated = createShadowTable(tableName);
            if (!shadowTableCreated) {
                return new MigrationResult(false, "Error creando tabla shadow");
            }
            
            // 2. CONFIGURAR TRIGGERS PARA SÍNCRONIZACIÓN
            log.debug("Configurando triggers para sincronización");
            boolean triggersConfigured = configureSyncTriggers(tableName);
            if (!triggersConfigured) {
                return new MigrationResult(false, "Error configurando triggers");
            }
            
            // 3. MIGRAR DATOS EXISTENTES
            log.debug("Migrando datos existentes a shadow");
            boolean existingDataMigrated = migrateExistingDataToShadow(tableName);
            if (!existingDataMigrated) {
                return new MigrationResult(false, "Error migrando datos existentes");
            }
            
            // 4. VERIFICAR SÍNCRONIZACIÓN
            log.debug("Verificando sincronización shadow");
            boolean syncVerified = verifyShadowSync(tableName);
            if (!syncVerified) {
                return new MigrationResult(false, "Error en sincronización shadow");
            }
            
            // 5. CAMBIAR A SHADOW
            log.debug("Cambiando a tabla shadow");
            boolean switchedToShadow = switchToShadowTable(tableName);
            if (!switchedToShadow) {
                return new MigrationResult(false, "Error cambiando a shadow");
            }
            
            log.info("Migración con shadow exitosa: {}", tableName);
            return new MigrationResult(true, "Migración shadow exitosa");
            
        } catch (Exception e) {
            log.error("Error en migración shadow: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Método para migrar datos existentes en lotes
    private boolean migrateExistingDataInBatches(String tableName) {
        try {
            log.debug("Migrando datos existentes en lotes para: {}", tableName);
            
            int batchSize = 1000;
            int offset = 0;
            boolean hasMoreData = true;
            
            while (hasMoreData) {
                // Obtener lote de datos
                List<Map<String, Object>> batch = monolithDb.getDataBatch(tableName, offset, batchSize);
                
                if (batch.isEmpty()) {
                    hasMoreData = false;
                    break;
                }
                
                // Insertar lote en microservicio
                boolean batchInserted = microserviceDb.insertData(tableName, batch);
                if (!batchInserted) {
                    log.error("Error insertando lote en offset: {}", offset);
                    return false;
                }
                
                offset += batchSize;
                log.debug("Lote migrado: {} registros", batch.size());
            }
            
            log.info("Datos existentes migrados exitosamente: {} registros", offset);
            return true;
            
        } catch (Exception e) {
            log.error("Error migrando datos existentes: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para configurar captura de cambios
    private boolean configureChangeCapture(String tableName) {
        try {
            log.debug("Configurando captura de cambios para: {}", tableName);
            
            // Configurar CDC (Change Data Capture) o triggers
            boolean cdcConfigured = monolithDb.configureCDC(tableName);
            if (!cdcConfigured) {
                log.warn("CDC no disponible, usando triggers");
                return configureSyncTriggers(tableName);
            }
            
            return true;
            
        } catch (Exception e) {
            log.error("Error configurando captura de cambios: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para iniciar sincronización en tiempo real
    private boolean startRealTimeSync(String tableName) {
        try {
            log.debug("Iniciando sincronización en tiempo real para: {}", tableName);
            
            // Iniciar proceso de sincronización
            dataSyncService.startRealTimeSync(tableName, (changeEvent) -> {
                try {
                    // Procesar cambio en tiempo real
                    processChangeEvent(tableName, changeEvent);
                } catch (Exception e) {
                    log.error("Error procesando cambio: {}", e.getMessage(), e);
                }
            });
            
            return true;
            
        } catch (Exception e) {
            log.error("Error iniciando sincronización en tiempo real: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Método para procesar evento de cambio
    private void processChangeEvent(String tableName, ChangeEvent changeEvent) {
        try {
            log.debug("Procesando cambio: {} en tabla: {}", changeEvent.getType(), tableName);
            
            switch (changeEvent.getType()) {
                case INSERT:
                    microserviceDb.insertData(tableName, Arrays.asList(changeEvent.getData()));
                    break;
                case UPDATE:
                    microserviceDb.updateData(tableName, changeEvent.getData(), changeEvent.getWhereClause());
                    break;
                case DELETE:
                    microserviceDb.deleteData(tableName, changeEvent.getWhereClause());
                    break;
                default:
                    log.warn("Tipo de cambio no soportado: {}", changeEvent.getType());
            }
            
        } catch (Exception e) {
            log.error("Error procesando evento de cambio: {}", e.getMessage(), e);
        }
    }
    
    // Métodos auxiliares
    private boolean validateTable(String tableName) {
        // Implementación para validar tabla
        return true; // Simulado
    }
    
    private MigrationRecord createMigrationRecord(String tableName, MigrationStrategy strategy) {
        // Implementación para crear registro de migración
        return new MigrationRecord(); // Simulado
    }
    
    private void updateMigrationRecord(MigrationRecord record, MigrationResult result) {
        // Implementación para actualizar registro
    }
    
    private boolean verifyDataIntegrity(String tableName, int expectedCount) {
        // Implementación para verificar integridad
        return true; // Simulado
    }
    
    private boolean configureBidirectionalSync(String tableName) {
        // Implementación para sincronización bidireccional
        return true; // Simulado
    }
    
    private boolean createShadowTable(String tableName) {
        // Implementación para crear tabla shadow
        return true; // Simulado
    }
    
    private boolean configureSyncTriggers(String tableName) {
        // Implementación para configurar triggers
        return true; // Simulado
    }
    
    private boolean migrateExistingDataToShadow(String tableName) {
        // Implementación para migrar datos a shadow
        return true; // Simulado
    }
    
    private boolean verifyShadowSync(String tableName) {
        // Implementación para verificar sincronización shadow
        return true; // Simulado
    }
    
    private boolean switchToShadowTable(String tableName) {
        // Implementación para cambiar a shadow
        return true; // Simulado
    }
}
```

---

### 4. Estrategia 3: API Gateway Migration

#### 4.1. Implementación de API Gateway

```java
// API Gateway para migración
@Component
@Slf4j
public class MigrationAPIGateway {
    
    @Autowired
    private RouteService routeService;
    
    @Autowired
    private LoadBalancerService loadBalancerService;
    
    @Autowired
    private CircuitBreakerService circuitBreakerService;
    
    @Autowired
    private MetricsService metricsService;
    
    // Método para manejar requests con routing inteligente
    public ResponseEntity<String> handleRequest(HttpServletRequest request) {
        String requestId = UUID.randomUUID().toString();
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        log.info("API Gateway - Request: {} {} {}", requestId, method, path);
        
        try {
            // 1. DETERMINAR RUTA
            Route route = routeService.determineRoute(path, method);
            
            if (route == null) {
                log.warn("Ruta no encontrada: {} {}", method, path);
                return ResponseEntity.notFound().build();
            }
            
            // 2. VERIFICAR SI ESTÁ MIGRADA
            if (route.isMigrated()) {
                log.debug("Ruta migrada, usando microservicio: {}", route.getServiceName());
                return handleMicroserviceRequest(request, route, requestId);
            } else {
                log.debug("Ruta no migrada, usando monolito: {}", route.getServiceName());
                return handleMonolithRequest(request, route, requestId);
            }
            
        } catch (Exception e) {
            log.error("Error en API Gateway: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Internal Server Error\"}");
        }
    }
    
    // Método para manejar requests a microservicios
    private ResponseEntity<String> handleMicroserviceRequest(HttpServletRequest request, Route route, String requestId) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Usar circuit breaker
            return circuitBreakerService.execute(() -> {
                // Obtener instancia del microservicio
                String serviceInstance = loadBalancerService.getServiceInstance(route.getServiceName());
                
                // Construir URL del microservicio
                String targetUrl = buildTargetUrl(serviceInstance, request);
                
                // Realizar request al microservicio
                return forwardRequest(request, targetUrl);
                
            }, () -> {
                // Fallback a monolito
                log.warn("Circuit breaker activado, fallback a monolito para: {}", route.getServiceName());
                return handleMonolithRequest(request, route, requestId);
            });
            
        } finally {
            // Registrar métricas
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMicroserviceRequest(route.getServiceName(), duration, true);
        }
    }
    
    // Método para manejar requests al monolito
    private ResponseEntity<String> handleMonolithRequest(HttpServletRequest request, Route route, String requestId) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Obtener instancia del monolito
            String monolithInstance = loadBalancerService.getMonolithInstance();
            
            // Construir URL del monolito
            String targetUrl = buildMonolithUrl(monolithInstance, request);
            
            // Realizar request al monolito
            ResponseEntity<String> response = forwardRequest(request, targetUrl);
            
            // Registrar métricas
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMonolithRequest(route.getServiceName(), duration, true);
            
            return response;
            
        } catch (Exception e) {
            log.error("Error en request al monolito: {}", e.getMessage(), e);
            
            // Registrar métricas de error
            long duration = System.currentTimeMillis() - startTime;
            metricsService.recordMonolithRequest(route.getServiceName(), duration, false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Service Unavailable\"}");
        }
    }
    
    // Método para reenviar request
    private ResponseEntity<String> forwardRequest(HttpServletRequest request, String targetUrl) {
        try {
            // Crear cliente HTTP
            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                String headerValue = request.getHeader(headerName);
                headers.add(headerName, headerValue);
            }
            
            // Crear entidad HTTP
            HttpEntity<String> entity = new HttpEntity<>(getRequestBody(request), headers);
            
            // Realizar request
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.exchange(targetUrl, HttpMethod.valueOf(request.getMethod()), entity, String.class);
            
        } catch (Exception e) {
            log.error("Error reenviando request: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // Método para construir URL objetivo
    private String buildTargetUrl(String serviceInstance, HttpServletRequest request) {
        String path = request.getRequestURI();
        String query = request.getQueryString();
        
        String url = serviceInstance + path;
        if (query != null) {
            url += "?" + query;
        }
        
        return url;
    }
    
    // Método para construir URL del monolito
    private String buildMonolithUrl(String monolithInstance, HttpServletRequest request) {
        String path = request.getRequestURI();
        String query = request.getQueryString();
        
        String url = monolithInstance + path;
        if (query != null) {
            url += "?" + query;
        }
        
        return url;
    }
    
    // Método para obtener body del request
    private String getRequestBody(HttpServletRequest request) {
        try {
            return request.getReader().lines().collect(Collectors.joining());
        } catch (Exception e) {
            return "";
        }
    }
    
    // Método para migrar ruta
    public MigrationResult migrateRoute(String path, String method) {
        log.info("Migrando ruta: {} {}", method, path);
        
        try {
            // 1. VERIFICAR QUE EL MICROSERVICIO ESTÉ LISTO
            Route route = routeService.getRoute(path, method);
            if (route == null) {
                return new MigrationResult(false, "Ruta no encontrada");
            }
            
            boolean microserviceReady = verifyMicroserviceReady(route.getServiceName());
            if (!microserviceReady) {
                return new MigrationResult(false, "Microservicio no está listo");
            }
            
            // 2. CONFIGURAR RUTA COMO MIGRADA
            route.setMigrated(true);
            routeService.updateRoute(route);
            
            // 3. MONITOREAR MÉTRICAS
            boolean metricsOk = monitorRouteMetrics(route, Duration.ofMinutes(30));
            if (!metricsOk) {
                log.warn("Métricas no satisfactorias, revirtiendo migración");
                route.setMigrated(false);
                routeService.updateRoute(route);
                return new MigrationResult(false, "Métricas no satisfactorias");
            }
            
            log.info("Ruta migrada exitosamente: {} {}", method, path);
            return new MigrationResult(true, "Ruta migrada exitosamente");
            
        } catch (Exception e) {
            log.error("Error migrando ruta: {}", e.getMessage(), e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    // Métodos auxiliares
    private boolean verifyMicroserviceReady(String serviceName) {
        try {
            String healthUrl = "http://" + serviceName + "/actuator/health";
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(healthUrl, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("Microservicio no está listo: {}", serviceName);
            return false;
        }
    }
    
    private boolean monitorRouteMetrics(Route route, Duration duration) {
        try {
            Thread.sleep(duration.toMillis());
            
            double errorRate = metricsService.getErrorRate(route.getServiceName());
            double latency = metricsService.getAverageLatency(route.getServiceName());
            
            boolean errorRateOk = errorRate < 0.05; // Menos del 5%
            boolean latencyOk = latency < 1000; // Menos de 1 segundo
            
            log.info("Métricas para ruta {}: Error Rate={}%, Latency={}ms", 
                route.getPath(), errorRate * 100, latency);
            
            return errorRateOk && latencyOk;
            
        } catch (Exception e) {
            log.error("Error monitoreando métricas: {}", e.getMessage(), e);
            return false;
        }
    }
}
```

---

### 5. Pruebas Unitarias para Migration Strategies

```java
// Pruebas unitarias para estrategias de migración
@SpringBootTest
public class MigrationStrategiesTest {
    
    @Autowired
    private StranglerFigService stranglerFigService;
    
    @Autowired
    private DatabaseMigrationService databaseMigrationService;
    
    @Autowired
    private MigrationAPIGateway apiGateway;
    
    @MockBean
    private FeatureFlagService featureFlagService;
    
    @MockBean
    private MonolithService monolithService;
    
    @MockBean
    private MicroserviceService microserviceService;
    
    @Test
    public void testStranglerFigPattern() {
        // Arrange: Configurar mocks
        Request request = new Request("request123", "/api/users", "GET");
        Response expectedResponse = new Response(true, "Success");
        
        when(featureFlagService.isFeatureEnabled("user-management")).thenReturn(true);
        when(microserviceService.processRequest(request)).thenReturn(expectedResponse);
        
        // Act: Manejar request con Strangler Fig
        Response result = stranglerFigService.handleRequest(request);
        
        // Assert: Verificar resultado
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("Success", result.getMessage());
    }
    
    @Test
    public void testDatabaseMigration() {
        // Arrange: Configurar mocks
        when(monolithDb.getAllData("users")).thenReturn(Arrays.asList(new HashMap<>()));
        when(microserviceDb.createTable("users")).thenReturn(true);
        when(microserviceDb.insertData("users", any())).thenReturn(true);
        
        // Act: Migrar tabla
        MigrationResult result = databaseMigrationService.startDatabaseMigration("users", MigrationStrategy.FULL_SYNC);
        
        // Assert: Verificar resultado
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("Migración completa exitosa", result.getMessage());
    }
    
    @Test
    public void testAPIGatewayMigration() {
        // Arrange: Configurar mocks
        Route route = new Route("/api/users", "GET", "user-service", true);
        when(routeService.determineRoute("/api/users", "GET")).thenReturn(route);
        
        // Act: Migrar ruta
        MigrationResult result = apiGateway.migrateRoute("/api/users", "GET");
        
        // Assert: Verificar resultado
        assertNotNull(result);
        // Verificar que se migró correctamente
    }
}
```

---

### 6. Mejoras y Patrones de Diseño

- **Feature Toggles**: Control granular de funcionalidades
- **Canary Deployments**: Despliegues graduales
- **Blue-Green Deployments**: Despliegues sin interrupciones
- **Database Sharding**: Particionamiento de bases de datos
- **Service Mesh**: Gestión de comunicación entre servicios

---

### 7. Resultados Esperados y Manejo de Errores

#### 7.1. Escenarios exitosos

- **Migración gradual exitosa**:
    - Servicios migrados sin interrupciones
    - Métricas de rendimiento mejoradas
    - Rollback automático en caso de problemas

#### 7.2. Escenarios de error

- **Fallos en migración**:
    - Detección automática de problemas
    - Rollback automático a versión estable
    - Notificación a equipos de desarrollo

---

### 8. Explicación Detallada de la Lógica

- **Strangler Fig Pattern**: Reemplazar gradualmente partes del monolito
- **Database Migration**: Migrar bases de datos de forma incremental
- **API Gateway**: Gestionar transiciones entre monolito y microservicios
- **Feature Flags**: Controlar activación de nuevas funcionalidades
- **Monitoring**: Monitorear métricas durante la migración

---

¿Deseas que continúe con la siguiente sección del capítulo 7 (por ejemplo, "Future Trends") o proceder con la finalización del proyecto? 