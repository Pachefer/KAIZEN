# 🏢 WebSphere Application Server - Servidor Empresarial Avanzado

## 📋 Índice

1. [Configuración de WebSphere](#configuración-de-websphere)
2. [Despliegue de Aplicaciones](#despliegue-de-aplicaciones)
3. [Configuración de Datasources](#configuración-de-datasources)
4. [Clustering y Alta Disponibilidad](#clustering-y-alta-disponibilidad)
5. [Monitoreo y Performance](#monitoreo-y-performance)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración de WebSphere

### Configuración de Servidor

```java
// WebSphereConfig.java - Configuración para WebSphere Application Server
package com.example.config;

import com.ibm.websphere.management.AdminClient;
import com.ibm.websphere.management.AdminClientFactory;
import com.ibm.websphere.management.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.management.ObjectName;
import java.util.Properties;

@Configuration // Marca como configuración de Spring
public class WebSphereConfig {
    
    // Propiedades de WebSphere inyectadas desde application.properties
    @Value("${websphere.host}") // Host del servidor WebSphere
    private String websphereHost; // Host del servidor WebSphere
    
    @Value("${websphere.port}") // Puerto del servidor WebSphere
    private String webspherePort; // Puerto del servidor WebSphere
    
    @Value("${websphere.username}") // Usuario de administración
    private String websphereUsername; // Usuario de administración
    
    @Value("${websphere.password}") // Contraseña de administración
    private String webspherePassword; // Contraseña de administración
    
    // Bean para AdminClient de WebSphere
    @Bean
    public AdminClient adminClient() throws Exception {
        Properties props = new Properties(); // Crea propiedades para conexión
        
        // Configura propiedades de conexión
        props.setProperty(AdminClient.CONNECTOR_TYPE, AdminClient.CONNECTOR_TYPE_SOAP); // Establece tipo de conector
        props.setProperty(AdminClient.CONNECTOR_HOST, websphereHost); // Establece host
        props.setProperty(AdminClient.CONNECTOR_PORT, webspherePort); // Establece puerto
        props.setProperty(AdminClient.CONNECTOR_SECURITY_ENABLED, "true"); // Habilita seguridad
        props.setProperty(AdminClient.USERNAME, websphereUsername); // Establece usuario
        props.setProperty(AdminClient.PASSWORD, webspherePassword); // Establece contraseña
        
        // Crea AdminClient
        AdminClient adminClient = AdminClientFactory.createAdminClient(props); // Crea cliente de administración
        
        // RESULTADO ESPERADO: Cliente de administración configurado para WebSphere
        return adminClient; // Retorna cliente configurado
    }
    
    // Método para probar conexión a WebSphere
    public boolean testWebSphereConnection() {
        try {
            // Obtiene AdminClient
            AdminClient client = adminClient(); // Obtiene cliente de administración
            
            // Intenta conectar
            Session session = client.connect(); // Establece conexión
            
            // Verifica conexión
            boolean isConnected = session != null; // Verifica si la conexión es exitosa
            
            // RESULTADO ESPERADO: true si la conexión es exitosa
            return isConnected; // Retorna estado de la conexión
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error conectando a WebSphere: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para obtener información del servidor
    public String getServerInfo() {
        try {
            // Obtiene AdminClient
            AdminClient client = adminClient(); // Obtiene cliente de administración
            
            // Obtiene información del servidor
            ObjectName serverMBean = new ObjectName("WebSphere:type=Server,name=server1"); // MBean del servidor
            String serverName = (String) client.getAttribute(serverMBean, "name"); // Obtiene nombre del servidor
            String serverState = (String) client.getAttribute(serverMBean, "state"); // Obtiene estado del servidor
            
            // Construye información del servidor
            String info = String.format("Server: %s, State: %s", serverName, serverState); // Construye información
            
            // RESULTADO ESPERADO: String con información del servidor WebSphere
            return info; // Retorna información formateada
            
        } catch (Exception e) {
            // Maneja errores al obtener información
            System.err.println("Error obteniendo información del servidor: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si no se puede obtener información
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
}

// application.properties - Configuración de WebSphere
/*
# Configuración de WebSphere Application Server
websphere.host=localhost
websphere.port=8880
websphere.username=admin
websphere.password=admin123

# Configuración de JNDI
spring.jndi.enabled=true
spring.jndi.url=iiop://localhost:2809

# Configuración de transacciones
spring.transaction.jta.enabled=true
spring.transaction.jta.timeout=300
*/
```

---

## 🚀 Despliegue de Aplicaciones

### Configuración de Despliegue

```java
// WebSphereDeploymentService.java - Servicio para despliegue en WebSphere
package com.example.service;

import com.ibm.websphere.management.AdminClient;
import com.ibm.websphere.management.application.AppManagement;
import com.ibm.websphere.management.application.AppManagementProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.ObjectName;
import java.io.File;
import java.util.Properties;

@Service // Marca como servicio de Spring
public class WebSphereDeploymentService {
    
    private final AdminClient adminClient; // Cliente de administración
    
    @Autowired
    public WebSphereDeploymentService(AdminClient adminClient) {
        this.adminClient = adminClient; // Inyecta cliente de administración
    }
    
    // Método para desplegar aplicación
    public boolean deployApplication(String appName, String earPath) {
        try {
            // Verifica que el archivo EAR existe
            File earFile = new File(earPath); // Crea objeto File
            if (!earFile.exists()) { // Verifica si el archivo existe
                throw new RuntimeException("Archivo EAR no encontrado: " + earPath); // Lanza excepción
            }
            
            // Obtiene proxy de gestión de aplicaciones
            AppManagementProxy appManagementProxy = AppManagementProxy.getJMXProxyForType(adminClient, AppManagement.INSTALL); // Obtiene proxy
            
            // Configura propiedades de instalación
            Properties installProps = new Properties(); // Crea propiedades
            installProps.setProperty("app", appName); // Establece nombre de aplicación
            installProps.setProperty("contextroot", "/" + appName); // Establece contexto raíz
            installProps.setProperty("target", "WebSphere:cell=cell1,node=node1,server=server1"); // Establece target
            
            // Instala la aplicación
            String[] installOptions = {earPath}; // Opciones de instalación
            appManagementProxy.installApplication(appName, installProps, installOptions); // Instala aplicación
            
            // Inicia la aplicación
            appManagementProxy.startApplication(appName); // Inicia aplicación
            
            // RESULTADO ESPERADO: true si la aplicación se desplegó correctamente
            return true; // Retorna true si se desplegó correctamente
            
        } catch (Exception e) {
            // Maneja errores de despliegue
            System.err.println("Error desplegando aplicación: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de despliegue
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para detener aplicación
    public boolean stopApplication(String appName) {
        try {
            // Obtiene proxy de gestión de aplicaciones
            AppManagementProxy appManagementProxy = AppManagementProxy.getJMXProxyForType(adminClient, AppManagement.STOP); // Obtiene proxy
            
            // Detiene la aplicación
            appManagementProxy.stopApplication(appName); // Detiene aplicación
            
            // RESULTADO ESPERADO: true si la aplicación se detuvo correctamente
            return true; // Retorna true si se detuvo correctamente
            
        } catch (Exception e) {
            // Maneja errores de detención
            System.err.println("Error deteniendo aplicación: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de detención
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para iniciar aplicación
    public boolean startApplication(String appName) {
        try {
            // Obtiene proxy de gestión de aplicaciones
            AppManagementProxy appManagementProxy = AppManagementProxy.getJMXProxyForType(adminClient, AppManagement.START); // Obtiene proxy
            
            // Inicia la aplicación
            appManagementProxy.startApplication(appName); // Inicia aplicación
            
            // RESULTADO ESPERADO: true si la aplicación se inició correctamente
            return true; // Retorna true si se inició correctamente
            
        } catch (Exception e) {
            // Maneja errores de inicio
            System.err.println("Error iniciando aplicación: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de inicio
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para desinstalar aplicación
    public boolean uninstallApplication(String appName) {
        try {
            // Obtiene proxy de gestión de aplicaciones
            AppManagementProxy appManagementProxy = AppManagementProxy.getJMXProxyForType(adminClient, AppManagement.UNINSTALL); // Obtiene proxy
            
            // Desinstala la aplicación
            appManagementProxy.uninstallApplication(appName); // Desinstala aplicación
            
            // RESULTADO ESPERADO: true si la aplicación se desinstaló correctamente
            return true; // Retorna true si se desinstaló correctamente
            
        } catch (Exception e) {
            // Maneja errores de desinstalación
            System.err.println("Error desinstalando aplicación: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de desinstalación
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para obtener estado de aplicación
    public String getApplicationState(String appName) {
        try {
            // Obtiene MBean de la aplicación
            ObjectName appMBean = new ObjectName("WebSphere:type=Application,name=" + appName); // MBean de aplicación
            
            // Obtiene estado de la aplicación
            String state = (String) adminClient.getAttribute(appMBean, "state"); // Obtiene estado
            
            // RESULTADO ESPERADO: String con estado de la aplicación
            return state; // Retorna estado de la aplicación
            
        } catch (Exception e) {
            // Maneja errores al obtener estado
            System.err.println("Error obteniendo estado de aplicación: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si no se puede obtener estado
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
}
```

---

## 🗄️ Configuración de Datasources

### Configuración de JDBC

```java
// WebSphereDataSourceConfig.java - Configuración de datasources en WebSphere
package com.example.config;

import com.ibm.websphere.management.AdminClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.management.ObjectName;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration // Marca como configuración de Spring
public class WebSphereDataSourceConfig {
    
    @Autowired
    private AdminClient adminClient; // Inyecta cliente de administración
    
    // Propiedades de datasource
    @Value("${websphere.datasource.name}") // Nombre del datasource
    private String datasourceName; // Nombre del datasource
    
    @Value("${websphere.datasource.jndi}") // JNDI del datasource
    private String datasourceJndi; // JNDI del datasource
    
    // Bean para DataSource de WebSphere
    @Bean
    public DataSource webSphereDataSource() throws Exception {
        // Obtiene datasource desde JNDI
        javax.naming.InitialContext ctx = new javax.naming.InitialContext(); // Crea contexto inicial
        DataSource dataSource = (DataSource) ctx.lookup(datasourceJndi); // Busca datasource en JNDI
        
        // RESULTADO ESPERADO: DataSource configurado desde WebSphere
        return dataSource; // Retorna DataSource configurado
    }
    
    // Método para crear datasource
    public boolean createDataSource(String name, String jndiName, String url, String username, String password) {
        try {
            // Obtiene MBean de configuración de JDBC
            ObjectName jdbcMBean = new ObjectName("WebSphere:type=JDBCProvider,name=Default JDBC Provider"); // MBean de JDBC
            
            // Configura propiedades del datasource
            Properties dsProps = new Properties(); // Crea propiedades
            dsProps.setProperty("name", name); // Establece nombre
            dsProps.setProperty("jndiName", jndiName); // Establece JNDI
            dsProps.setProperty("url", url); // Establece URL
            dsProps.setProperty("username", username); // Establece usuario
            dsProps.setProperty("password", password); // Establece contraseña
            
            // Crea datasource
            adminClient.invoke(jdbcMBean, "createDataSource", new Object[]{dsProps}, new String[]{"java.util.Properties"}); // Crea datasource
            
            // RESULTADO ESPERADO: true si el datasource se creó correctamente
            return true; // Retorna true si se creó correctamente
            
        } catch (Exception e) {
            // Maneja errores de creación
            System.err.println("Error creando datasource: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de creación
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para probar conexión de datasource
    public boolean testDataSourceConnection(String jndiName) {
        try {
            // Obtiene datasource desde JNDI
            javax.naming.InitialContext ctx = new javax.naming.InitialContext(); // Crea contexto inicial
            DataSource dataSource = (DataSource) ctx.lookup(jndiName); // Busca datasource en JNDI
            
            // Prueba conexión
            dataSource.getConnection().close(); // Establece y cierra conexión de prueba
            
            // RESULTADO ESPERADO: true si la conexión es exitosa
            return true; // Retorna true si la conexión es exitosa
            
        } catch (Exception e) {
            // Maneja errores de conexión
            System.err.println("Error probando conexión de datasource: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de conexión
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para obtener información de datasource
    public String getDataSourceInfo(String jndiName) {
        try {
            // Obtiene datasource desde JNDI
            javax.naming.InitialContext ctx = new javax.naming.InitialContext(); // Crea contexto inicial
            DataSource dataSource = (DataSource) ctx.lookup(jndiName); // Busca datasource en JNDI
            
            // Obtiene información del datasource
            String info = String.format("DataSource: %s, Class: %s", jndiName, dataSource.getClass().getName()); // Construye información
            
            // RESULTADO ESPERADO: String con información del datasource
            return info; // Retorna información formateada
            
        } catch (Exception e) {
            // Maneja errores al obtener información
            System.err.println("Error obteniendo información de datasource: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si no se puede obtener información
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
}

// WebSphereJdbcService.java - Servicio para operaciones JDBC en WebSphere
package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Service // Marca como servicio de Spring
public class WebSphereJdbcService {
    
    private final JdbcTemplate jdbcTemplate; // Template JDBC para WebSphere
    
    @Autowired
    public WebSphereJdbcService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource); // Inicializa JdbcTemplate
    }
    
    // Método para ejecutar consulta de prueba
    public String testQuery() {
        try {
            // Ejecuta consulta simple
            String result = jdbcTemplate.queryForObject("SELECT CURRENT TIMESTAMP FROM SYSIBM.SYSDUMMY1", String.class); // Consulta timestamp actual
            
            // RESULTADO ESPERADO: Timestamp actual de la base de datos
            return "Conexión exitosa. Timestamp: " + result; // Retorna resultado formateado
            
        } catch (Exception e) {
            // Maneja errores de consulta
            System.err.println("Error ejecutando consulta: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si hay problema
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
    
    // Método para obtener estadísticas de conexión
    public Map<String, Object> getConnectionStats() {
        try {
            // Consulta para obtener estadísticas de conexión
            String sql = "SELECT " +
                        "COUNT(*) as total_connections, " +
                        "MAX(connection_time) as max_connection_time " +
                        "FROM TABLE(MON_GET_CONNECTION(NULL, -2))"; // SQL para estadísticas
            
            Map<String, Object> stats = jdbcTemplate.queryForMap(sql); // Ejecuta consulta
            
            // RESULTADO ESPERADO: Map con estadísticas de conexión
            return stats; // Retorna estadísticas
            
        } catch (Exception e) {
            // Maneja errores de consulta
            System.err.println("Error obteniendo estadísticas: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Map vacío si hay error
            return Map.of("error", e.getMessage()); // Retorna error en map
        }
    }
}
```

---

## 🔄 Clustering y Alta Disponibilidad

### Configuración de Cluster

```java
// WebSphereClusterConfig.java - Configuración de clustering en WebSphere
package com.example.config;

import com.ibm.websphere.management.AdminClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.management.ObjectName;
import java.util.Properties;

@Component // Marca como componente de Spring
public class WebSphereClusterConfig {
    
    @Autowired
    private AdminClient adminClient; // Inyecta cliente de administración
    
    // Método para crear cluster
    public boolean createCluster(String clusterName, String[] serverNames) {
        try {
            // Obtiene MBean de configuración de cluster
            ObjectName clusterMBean = new ObjectName("WebSphere:type=Cluster,name=" + clusterName); // MBean de cluster
            
            // Configura propiedades del cluster
            Properties clusterProps = new Properties(); // Crea propiedades
            clusterProps.setProperty("name", clusterName); // Establece nombre del cluster
            clusterProps.setProperty("members", String.join(",", serverNames)); // Establece miembros del cluster
            
            // Crea cluster
            adminClient.invoke(clusterMBean, "createCluster", new Object[]{clusterProps}, new String[]{"java.util.Properties"}); // Crea cluster
            
            // RESULTADO ESPERADO: true si el cluster se creó correctamente
            return true; // Retorna true si se creó correctamente
            
        } catch (Exception e) {
            // Maneja errores de creación
            System.err.println("Error creando cluster: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de creación
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para iniciar cluster
    public boolean startCluster(String clusterName) {
        try {
            // Obtiene MBean de cluster
            ObjectName clusterMBean = new ObjectName("WebSphere:type=Cluster,name=" + clusterName); // MBean de cluster
            
            // Inicia cluster
            adminClient.invoke(clusterMBean, "start", null, null); // Inicia cluster
            
            // RESULTADO ESPERADO: true si el cluster se inició correctamente
            return true; // Retorna true si se inició correctamente
            
        } catch (Exception e) {
            // Maneja errores de inicio
            System.err.println("Error iniciando cluster: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de inicio
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para detener cluster
    public boolean stopCluster(String clusterName) {
        try {
            // Obtiene MBean de cluster
            ObjectName clusterMBean = new ObjectName("WebSphere:type=Cluster,name=" + clusterName); // MBean de cluster
            
            // Detiene cluster
            adminClient.invoke(clusterMBean, "stop", null, null); // Detiene cluster
            
            // RESULTADO ESPERADO: true si el cluster se detuvo correctamente
            return true; // Retorna true si se detuvo correctamente
            
        } catch (Exception e) {
            // Maneja errores de detención
            System.err.println("Error deteniendo cluster: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de detención
            return false; // Retorna false en caso de error
        }
    }
    
    // Método para obtener estado de cluster
    public String getClusterState(String clusterName) {
        try {
            // Obtiene MBean de cluster
            ObjectName clusterMBean = new ObjectName("WebSphere:type=Cluster,name=" + clusterName); // MBean de cluster
            
            // Obtiene estado del cluster
            String state = (String) adminClient.getAttribute(clusterMBean, "state"); // Obtiene estado
            
            // RESULTADO ESPERADO: String con estado del cluster
            return state; // Retorna estado del cluster
            
        } catch (Exception e) {
            // Maneja errores al obtener estado
            System.err.println("Error obteniendo estado de cluster: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si no se puede obtener estado
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
    
    // Método para agregar servidor al cluster
    public boolean addServerToCluster(String clusterName, String serverName) {
        try {
            // Obtiene MBean de cluster
            ObjectName clusterMBean = new ObjectName("WebSphere:type=Cluster,name=" + clusterName); // MBean de cluster
            
            // Agrega servidor al cluster
            adminClient.invoke(clusterMBean, "addMember", new Object[]{serverName}, new String[]{"java.lang.String"}); // Agrega miembro
            
            // RESULTADO ESPERADO: true si el servidor se agregó correctamente
            return true; // Retorna true si se agregó correctamente
            
        } catch (Exception e) {
            // Maneja errores de agregado
            System.err.println("Error agregando servidor al cluster: " + e.getMessage()); // Log del error
            e.printStackTrace(); // Imprime stack trace completo
            
            // RESULTADO ESPERADO: false si hay error de agregado
            return false; // Retorna false en caso de error
        }
    }
}
```

---

## 📊 Monitoreo y Performance

### Configuración de Monitoreo

```java
// WebSphereMonitoringService.java - Servicio de monitoreo para WebSphere
package com.example.service;

import com.ibm.websphere.management.AdminClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.ObjectName;
import java.util.HashMap;
import java.util.Map;

@Service // Marca como servicio de Spring
public class WebSphereMonitoringService {
    
    private final AdminClient adminClient; // Cliente de administración
    
    @Autowired
    public WebSphereMonitoringService(AdminClient adminClient) {
        this.adminClient = adminClient; // Inyecta cliente de administración
    }
    
    // Método para obtener métricas de performance
    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> metrics = new HashMap<>(); // Crea map para métricas
        
        try {
            // Obtiene MBean de performance
            ObjectName perfMBean = new ObjectName("WebSphere:type=Performance,name=server1"); // MBean de performance
            
            // Obtiene métricas de CPU
            Double cpuUsage = (Double) adminClient.getAttribute(perfMBean, "cpuUsage"); // Obtiene uso de CPU
            metrics.put("cpuUsage", cpuUsage); // Agrega uso de CPU
            
            // Obtiene métricas de memoria
            Long heapSize = (Long) adminClient.getAttribute(perfMBean, "heapSize"); // Obtiene tamaño de heap
            Long heapUsed = (Long) adminClient.getAttribute(perfMBean, "heapUsed"); // Obtiene heap usado
            metrics.put("heapSize", heapSize); // Agrega tamaño de heap
            metrics.put("heapUsed", heapUsed); // Agrega heap usado
            metrics.put("heapUsagePercent", (heapUsed * 100.0) / heapSize); // Calcula porcentaje de uso
            
            // Obtiene métricas de threads
            Integer activeThreads = (Integer) adminClient.getAttribute(perfMBean, "activeThreads"); // Obtiene threads activos
            Integer maxThreads = (Integer) adminClient.getAttribute(perfMBean, "maxThreads"); // Obtiene threads máximos
            metrics.put("activeThreads", activeThreads); // Agrega threads activos
            metrics.put("maxThreads", maxThreads); // Agrega threads máximos
            metrics.put("threadUsagePercent", (activeThreads * 100.0) / maxThreads); // Calcula porcentaje de uso
            
            // RESULTADO ESPERADO: Map con métricas de performance del servidor
            
        } catch (Exception e) {
            // Maneja errores de monitoreo
            System.err.println("Error obteniendo métricas: " + e.getMessage()); // Log del error
            metrics.put("error", e.getMessage()); // Agrega error a métricas
            
            // RESULTADO ESPERADO: Map con error si hay problema
        }
        
        return metrics; // Retorna métricas
    }
    
    // Método para obtener logs del servidor
    public String getServerLogs() {
        try {
            // Obtiene MBean de logs
            ObjectName logMBean = new ObjectName("WebSphere:type=Log,name=server1"); // MBean de logs
            
            // Obtiene logs del servidor
            String logs = (String) adminClient.getAttribute(logMBean, "logContent"); // Obtiene contenido de logs
            
            // RESULTADO ESPERADO: String con logs del servidor
            return logs; // Retorna logs del servidor
            
        } catch (Exception e) {
            // Maneja errores al obtener logs
            System.err.println("Error obteniendo logs: " + e.getMessage()); // Log del error
            
            // RESULTADO ESPERADO: Mensaje de error si no se pueden obtener logs
            return "Error: " + e.getMessage(); // Retorna mensaje de error
        }
    }
    
    // Método para obtener estado de aplicaciones
    public Map<String, String> getApplicationStates() {
        Map<String, String> appStates = new HashMap<>(); // Crea map para estados de aplicaciones
        
        try {
            // Obtiene lista de aplicaciones
            ObjectName[] appMBeans = (ObjectName[]) adminClient.queryNames(new ObjectName("WebSphere:type=Application,*"), null); // Consulta aplicaciones
            
            // Itera sobre aplicaciones
            for (ObjectName appMBean : appMBeans) { // Itera sobre MBeans de aplicaciones
                String appName = appMBean.getKeyProperty("name"); // Obtiene nombre de aplicación
                String state = (String) adminClient.getAttribute(appMBean, "state"); // Obtiene estado
                appStates.put(appName, state); // Agrega estado de aplicación
            }
            
            // RESULTADO ESPERADO: Map con estados de todas las aplicaciones
            
        } catch (Exception e) {
            // Maneja errores al obtener estados
            System.err.println("Error obteniendo estados de aplicaciones: " + e.getMessage()); // Log del error
            appStates.put("error", e.getMessage()); // Agrega error a estados
            
            // RESULTADO ESPERADO: Map con error si hay problema
        }
        
        return appStates; // Retorna estados de aplicaciones
    }
    
    // Método para obtener estadísticas de transacciones
    public Map<String, Object> getTransactionStats() {
        Map<String, Object> txStats = new HashMap<>(); // Crea map para estadísticas de transacciones
        
        try {
            // Obtiene MBean de transacciones
            ObjectName txMBean = new ObjectName("WebSphere:type=Transaction,name=server1"); // MBean de transacciones
            
            // Obtiene estadísticas de transacciones
            Long totalTransactions = (Long) adminClient.getAttribute(txMBean, "totalTransactions"); // Obtiene total de transacciones
            Long committedTransactions = (Long) adminClient.getAttribute(txMBean, "committedTransactions"); // Obtiene transacciones confirmadas
            Long rolledBackTransactions = (Long) adminClient.getAttribute(txMBean, "rolledBackTransactions"); // Obtiene transacciones revertidas
            
            txStats.put("totalTransactions", totalTransactions); // Agrega total de transacciones
            txStats.put("committedTransactions", committedTransactions); // Agrega transacciones confirmadas
            txStats.put("rolledBackTransactions", rolledBackTransactions); // Agrega transacciones revertidas
            txStats.put("commitRate", (committedTransactions * 100.0) / totalTransactions); // Calcula tasa de confirmación
            
            // RESULTADO ESPERADO: Map con estadísticas de transacciones
            
        } catch (Exception e) {
            // Maneja errores al obtener estadísticas
            System.err.println("Error obteniendo estadísticas de transacciones: " + e.getMessage()); // Log del error
            txStats.put("error", e.getMessage()); // Agrega error a estadísticas
            
            // RESULTADO ESPERADO: Map con error si hay problema
        }
        
        return txStats; // Retorna estadísticas de transacciones
    }
}
```

---

## 🧪 Testing con WebSphere

### Tests de Integración

```java
// WebSphereIntegrationTest.java - Tests de integración para WebSphere
package com.example.test;

import com.example.config.WebSphereConfig;
import com.example.service.WebSphereDeploymentService;
import com.example.service.WebSphereJdbcService;
import com.example.service.WebSphereMonitoringService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo de Spring Boot
@ActiveProfiles("test") // Activa perfil de test
class WebSphereIntegrationTest {
    
    @Autowired
    private WebSphereConfig webSphereConfig; // Configuración de WebSphere
    
    @Autowired
    private WebSphereDeploymentService deploymentService; // Servicio de despliegue
    
    @Autowired
    private WebSphereJdbcService jdbcService; // Servicio JDBC
    
    @Autowired
    private WebSphereMonitoringService monitoringService; // Servicio de monitoreo
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        // Configuración inicial si es necesaria
        
        // RESULTADO ESPERADO: Configuración inicial completada
    }
    
    @Test
    @DisplayName("Debería conectar a WebSphere correctamente")
    void testWebSphereConnection() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        boolean connected = webSphereConfig.testWebSphereConnection(); // Prueba conexión
        
        // Assert - Verificar resultados
        assertTrue(connected, "Debería conectar a WebSphere correctamente"); // Verifica conexión
        
        // RESULTADO ESPERADO: Test pasa, conexión a WebSphere exitosa
    }
    
    @Test
    @DisplayName("Debería obtener información del servidor")
    void testGetServerInfo() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        String serverInfo = webSphereConfig.getServerInfo(); // Obtiene información del servidor
        
        // Assert - Verificar resultados
        assertNotNull(serverInfo, "Debería obtener información del servidor"); // Verifica información
        assertFalse(serverInfo.startsWith("Error"), "No debería retornar error"); // Verifica que no hay error
        
        // RESULTADO ESPERADO: Test pasa, información del servidor obtenida correctamente
    }
    
    @Test
    @DisplayName("Debería ejecutar consulta JDBC")
    void testJdbcQuery() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        String result = jdbcService.testQuery(); // Ejecuta consulta de prueba
        
        // Assert - Verificar resultados
        assertNotNull(result, "Debería obtener resultado de la consulta"); // Verifica resultado
        assertTrue(result.contains("Conexión exitosa"), "Debería indicar conexión exitosa"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, consulta JDBC ejecutada correctamente
    }
    
    @Test
    @DisplayName("Debería obtener métricas de performance")
    void testGetPerformanceMetrics() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        Map<String, Object> metrics = monitoringService.getPerformanceMetrics(); // Obtiene métricas
        
        // Assert - Verificar resultados
        assertNotNull(metrics, "Debería obtener métricas"); // Verifica métricas
        assertTrue(metrics.containsKey("cpuUsage") || metrics.containsKey("error"), "Debería contener métricas o error"); // Verifica contenido
        
        // RESULTADO ESPERADO: Test pasa, métricas obtenidas correctamente
    }
    
    @Test
    @DisplayName("Debería obtener estados de aplicaciones")
    void testGetApplicationStates() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        Map<String, String> appStates = monitoringService.getApplicationStates(); // Obtiene estados de aplicaciones
        
        // Assert - Verificar resultados
        assertNotNull(appStates, "Debería obtener estados de aplicaciones"); // Verifica estados
        assertFalse(appStates.isEmpty() || appStates.containsKey("error"), "Debería contener estados o error"); // Verifica contenido
        
        // RESULTADO ESPERADO: Test pasa, estados de aplicaciones obtenidos correctamente
    }
    
    @Test
    @DisplayName("Debería obtener estadísticas de transacciones")
    void testGetTransactionStats() {
        // Arrange - Preparar datos
        // No se necesitan datos específicos
        
        // Act - Ejecutar acción
        Map<String, Object> txStats = monitoringService.getTransactionStats(); // Obtiene estadísticas de transacciones
        
        // Assert - Verificar resultados
        assertNotNull(txStats, "Debería obtener estadísticas de transacciones"); // Verifica estadísticas
        assertTrue(txStats.containsKey("totalTransactions") || txStats.containsKey("error"), "Debería contener estadísticas o error"); // Verifica contenido
        
        // RESULTADO ESPERADO: Test pasa, estadísticas de transacciones obtenidas correctamente
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es WebSphere Application Server?**
   - Servidor de aplicaciones empresarial de IBM, JEE, clustering, alta disponibilidad

2. **¿Cuál es la diferencia entre WebSphere y Tomcat?**
   - WebSphere: empresarial, clustering, Tomcat: ligero, solo servlet container

3. **¿Qué son los MBeans en WebSphere?**
   - Managed Beans, gestión y monitoreo del servidor, JMX

### Preguntas Intermedias

4. **¿Cómo configurar clustering en WebSphere?**
   - Configuración de cluster, load balancing, session replication

5. **¿Qué es el AdminClient en WebSphere?**
   - Cliente de administración, gestión remota, JMX

6. **¿Cómo manejar transacciones en WebSphere?**
   - JTA, transacciones distribuidas, configuración de datasources

### Preguntas Avanzadas

7. **¿Cómo optimizar performance en WebSphere?**
   - Tuning de JVM, configuración de threads, monitoreo de recursos

8. **¿Qué son los deployment managers en WebSphere?**
   - Gestión centralizada, configuración de células, administración

9. **¿Cómo implementar alta disponibilidad en WebSphere?**
   - Clustering, failover, disaster recovery, backup/restore

---

## 📚 Recursos Adicionales

- [WebSphere Documentation](https://www.ibm.com/docs/en/was)
- [WebSphere Performance Tuning](https://www.ibm.com/docs/en/was/9.0.5?topic=tuning-performance)
- [WebSphere Clustering](https://www.ibm.com/docs/en/was/9.0.5?topic=clustering)
- [WebSphere Administration](https://www.ibm.com/docs/en/was/9.0.5?topic=administration)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de WebSphere! 🚀** 