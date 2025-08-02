# 📦 Maven - Gestión de Dependencias Avanzada

## 📋 Índice

1. [Configuración Avanzada](#configuración-avanzada)
2. [Gestión de Dependencias](#gestión-de-dependencias)
3. [Ciclo de Vida](#ciclo-de-vida)
4. [Plugins Avanzados](#plugins-avanzados)
5. [Testing con Maven](#testing-con-maven)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Configuración Avanzada

### POM Completo

```xml
<!-- pom.xml - Project Object Model completo -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    
    <!-- Información básica del proyecto -->
    <modelVersion>4.0.0</modelVersion> <!-- Versión del modelo POM
    <groupId>com.example</groupId> <!-- Identificador único del grupo/organización
    <artifactId>mi-aplicacion</artifactId> <!-- Nombre del proyecto
    <version>1.0.0-SNAPSHOT</version> <!-- Versión del proyecto (SNAPSHOT = desarrollo)
    <packaging>jar</packaging> <!-- Tipo de empaquetado (jar, war, ear, pom)
    
    <!-- RESULTADO ESPERADO: Proyecto configurado con identificadores únicos -->
    
    <!-- Propiedades del proyecto -->
    <properties>
        <maven.compiler.source>17</maven.compiler.source> <!-- Versión Java fuente
        <maven.compiler.target>17</maven.compiler.target> <!-- Versión Java objetivo
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding> <!-- Encoding del proyecto
        <spring.version>3.2.0</spring.version> <!-- Versión de Spring
        <junit.version>5.10.0</junit.version> <!-- Versión de JUnit
        <maven-surefire-plugin.version>3.1.2</maven-surefire-plugin.version> <!-- Versión del plugin de testing
    </properties>
    
    <!-- RESULTADO ESPERADO: Propiedades centralizadas para versiones y configuración -->
    
    <!-- Dependencias del proyecto -->
    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId> <!-- Grupo de la dependencia
            <artifactId>spring-boot-starter-web</artifactId> <!-- Artefacto específico
            <version>${spring.version}</version> <!-- Usa propiedad definida arriba
            <scope>compile</scope> <!-- Scope de la dependencia (compile por defecto)
        </dependency>
        
        <!-- RESULTADO ESPERADO: Dependencia de Spring Boot Web agregada al classpath -->
        
        <!-- Spring Boot Starter Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
            <version>${spring.version}</version>
        </dependency>
        
        <!-- RESULTADO ESPERADO: Dependencia de JPA agregada para persistencia -->
        
        <!-- H2 Database (para testing) -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>2.2.224</version>
            <scope>runtime</scope> <!-- Solo disponible en runtime, no en compile
        </dependency>
        
        <!-- RESULTADO ESPERADO: Base de datos H2 disponible solo en runtime -->
        
        <!-- JUnit 5 para testing -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope> <!-- Solo disponible en testing
        </dependency>
        
        <!-- RESULTADO ESPERADO: JUnit 5 disponible solo para tests -->
        
        <!-- Mockito para mocking -->
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <version>5.7.0</version>
            <scope>test</scope>
        </dependency>
        
        <!-- RESULTADO ESPERADO: Mockito disponible para crear mocks en tests -->
    </dependencies>
    
    <!-- RESULTADO ESPERADO: Todas las dependencias configuradas con scopes apropiados -->
    
    <!-- Gestión de dependencias -->
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot BOM (Bill of Materials) -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring.version}</version>
                <type>pom</type> <!-- Tipo POM para BOM
                <scope>import</scope> <!-- Importa dependencias del BOM
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <!-- RESULTADO ESPERADO: Versiones de Spring Boot gestionadas automáticamente -->
    
    <!-- Configuración de build -->
    <build>
        <plugins>
            <!-- Plugin de compilación -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>${maven.compiler.source}</source> <!-- Usa propiedad definida
                    <target>${maven.compiler.target}</target> <!-- Usa propiedad definida
                    <encoding>${project.build.sourceEncoding}</encoding> <!-- Usa encoding definido
                </configuration>
            </plugin>
            
            <!-- RESULTADO ESPERADO: Compilación configurada para Java 17 -->
            
            <!-- Plugin de testing -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${maven-surefire-plugin.version}</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include> <!-- Incluye archivos que terminan en Test.java
                        <include>**/*Tests.java</include> <!-- Incluye archivos que terminan en Tests.java
                    </includes>
                    <excludes>
                        <exclude>**/*IntegrationTest.java</exclude> <!-- Excluye tests de integración
                    </excludes>
                </configuration>
            </plugin>
            
            <!-- RESULTADO ESPERADO: Tests unitarios ejecutados, tests de integración excluidos -->
            
            <!-- Plugin de Spring Boot -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring.version}</version>
                <configuration>
                    <mainClass>com.example.Application</mainClass> <!-- Clase principal
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            
            <!-- RESULTADO ESPERADO: Plugin de Spring Boot configurado para crear JAR ejecutable -->
        </plugins>
    </build>
    
    <!-- RESULTADO ESPERADO: Build configurado con plugins necesarios -->
    
    <!-- Repositorios -->
    <repositories>
        <repository>
            <id>central</id> <!-- Identificador del repositorio
            <name>Maven Central</name> <!-- Nombre del repositorio
            <url>https://repo1.maven.org/maven2/</url> <!-- URL del repositorio
        </repository>
        
        <!-- RESULTADO ESPERADO: Repositorio central de Maven configurado -->
        
        <!-- Repositorio de Spring -->
        <repository>
            <id>spring-releases</id>
            <name>Spring Releases</name>
            <url>https://repo.spring.io/release</url>
        </repository>
    </repositories>
    
    <!-- RESULTADO ESPERADO: Repositorios configurados para descargar dependencias -->
</project>
```

---

## 🔄 Gestión de Dependencias

### Comandos de Dependencias

```bash
# Descargar dependencias
mvn dependency:resolve # Descarga todas las dependencias del proyecto
# RESULTADO ESPERADO: Todas las dependencias descargadas al repositorio local

# Ver dependencias del proyecto
mvn dependency:tree # Muestra árbol de dependencias
# RESULTADO ESPERADO: Árbol jerárquico de todas las dependencias y sus transiciones

# Ejemplo de salida:
# com.example:mi-aplicacion:jar:1.0.0-SNAPSHOT
# +- org.springframework.boot:spring-boot-starter-web:jar:3.2.0:compile
#    +- org.springframework.boot:spring-boot-starter:jar:3.2.0:compile
#       +- org.springframework.boot:spring-boot:jar:3.2.0:compile
#          +- org.springframework:spring-context:jar:6.1.0:compile

# Analizar dependencias
mvn dependency:analyze # Analiza dependencias no utilizadas
# RESULTADO ESPERADO: Lista de dependencias declaradas pero no utilizadas

# Copiar dependencias
mvn dependency:copy-dependencies # Copia dependencias a directorio target/lib
# RESULTADO ESPERADO: Todas las dependencias copiadas al directorio especificado

# Resolver conflictos
mvn dependency:resolve-conflicts # Resuelve conflictos de versiones
# RESULTADO ESPERADO: Conflictos de versiones resueltos automáticamente

# Ver dependencias con vulnerabilidades
mvn dependency:check # Verifica vulnerabilidades de seguridad
# RESULTADO ESPERADO: Reporte de dependencias con vulnerabilidades conocidas
```

### Exclusión de Dependencias

```xml
<!-- Excluir dependencia transitiva -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>${spring.version}</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId> <!-- Excluye logging por defecto
        </exclusion>
    </exclusions>
</dependency>

<!-- RESULTADO ESPERADO: Logging por defecto excluido, se puede usar Log4j2 o Logback -->

<!-- Dependencia alternativa -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
    <version>${spring.version}</version>
</dependency>

<!-- RESULTADO ESPERADO: Log4j2 configurado como sistema de logging -->
```

---

## 🔄 Ciclo de Vida

### Fases del Ciclo de Vida

```bash
# Fase validate - Valida que el proyecto es correcto
mvn validate # Valida estructura del proyecto
# RESULTADO ESPERADO: Validación exitosa del proyecto

# Fase compile - Compila código fuente
mvn compile # Compila código Java
# RESULTADO ESPERADO: Archivos .class generados en target/classes

# Fase test - Ejecuta tests unitarios
mvn test # Ejecuta tests sin empaquetar
# RESULTADO ESPERADO: Tests ejecutados, reportes generados en target/surefire-reports

# Fase package - Empaqueta código compilado
mvn package # Crea JAR/WAR sin instalar
# RESULTADO ESPERADO: Archivo JAR/WAR creado en target/

# Fase verify - Ejecuta tests de integración
mvn verify # Ejecuta tests de integración
# RESULTADO ESPERADO: Tests de integración ejecutados

# Fase install - Instala en repositorio local
mvn install # Instala en repositorio local
# RESULTADO ESPERADO: Artefacto instalado en ~/.m2/repository

# Fase deploy - Despliega a repositorio remoto
mvn deploy # Despliega a repositorio remoto
# RESULTADO ESPERADO: Artefacto desplegado en repositorio remoto
```

### Comandos de Limpieza

```bash
# Limpiar proyecto
mvn clean # Elimina directorio target
# RESULTADO ESPERADO: Directorio target eliminado completamente

# Limpiar e instalar
mvn clean install # Limpia e instala en un solo comando
# RESULTADO ESPERADO: Proyecto limpiado, compilado, testeado e instalado

# Limpiar e empaquetar
mvn clean package # Limpia y empaqueta
# RESULTADO ESPERADO: Proyecto limpiado y empaquetado

# Limpiar con skip tests
mvn clean install -DskipTests # Salta tests para build más rápido
# RESULTADO ESPERADO: Build rápido sin ejecutar tests
```

---

## 🔌 Plugins Avanzados

### Plugin de Testing

```xml
<!-- Configuración avanzada de testing -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.1.2</version>
    <configuration>
        <!-- Configuración de tests -->
        <includes>
            <include>**/*Test.java</include> <!-- Tests unitarios
            <include>**/*Tests.java</include> <!-- Tests múltiples
        </includes>
        <excludes>
            <exclude>**/*IntegrationTest.java</exclude> <!-- Excluye tests de integración
            <exclude>**/*SlowTest.java</exclude> <!-- Excluye tests lentos
        </excludes>
        
        <!-- Configuración de JVM -->
        <argLine>-Xmx1024m -XX:MaxPermSize=256m</argLine> <!-- Configuración de memoria
        
        <!-- Configuración de paralelización -->
        <parallel>classes</parallel> <!-- Ejecuta clases en paralelo
        <threadCount>4</threadCount> <!-- Número de hilos
        
        <!-- Configuración de reportes -->
        <reportsDirectory>${project.build.directory}/test-reports</reportsDirectory>
        
        <!-- Configuración de timeouts -->
        <timeoutInSeconds>300</timeoutInSeconds> <!-- Timeout de 5 minutos
    </configuration>
</plugin>

<!-- RESULTADO ESPERADO: Tests ejecutados en paralelo con configuración optimizada -->
```

### Plugin de Cobertura

```xml
<!-- Plugin de cobertura de código -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals>
                <goal>prepare-agent</goal> <!-- Prepara agente de cobertura
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase> <!-- Se ejecuta después de test
            <goals>
                <goal>report</goal> <!-- Genera reporte de cobertura
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal> <!-- Verifica cobertura mínima
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>BUNDLE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum> <!-- 80% de cobertura mínima
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>

<!-- RESULTADO ESPERADO: Reporte de cobertura generado en target/site/jacoco -->
```

---

## 🧪 Testing con Maven

### Configuración de Tests

```java
// UserServiceTest.java - Test con Maven
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Carga contexto completo de Spring Boot
@ActiveProfiles("test") // Activa perfil de test
class UserServiceTest {
    
    @Autowired
    private UserService userService; // Servicio a testear
    
    @Autowired
    private UserRepository userRepository; // Repositorio para verificar datos
    
    private User testUser; // Usuario de prueba
    
    @BeforeEach
    void setUp() {
        // Se ejecuta ANTES de cada test
        testUser = new User(); // Crea nuevo usuario
        testUser.setUsername("testuser"); // Establece username
        testUser.setEmail("test@example.com"); // Establece email
        testUser.setPassword("password123"); // Establece contraseña
        testUser.setFirstName("Test"); // Establece nombre
        testUser.setLastName("User"); // Establece apellido
        testUser.setEnabled(true); // Habilita usuario
        
        // RESULTADO ESPERADO: testUser configurado correctamente
    }
    
    @Test
    @DisplayName("Debería crear usuario correctamente")
    void createUser_ShouldCreateUser() {
        // Arrange - Preparar datos
        // testUser ya está configurado en setUp()
        
        // Act - Ejecutar acción
        User createdUser = userService.createUser(testUser); // Crea usuario
        
        // Assert - Verificar resultados
        assertNotNull(createdUser.getId(), "El ID no debería ser null"); // Verifica ID
        assertEquals("testuser", createdUser.getUsername(), "El username debería coincidir"); // Verifica username
        assertEquals("test@example.com", createdUser.getEmail(), "El email debería coincidir"); // Verifica email
        
        // Verificación adicional
        User foundUser = userRepository.findById(createdUser.getId()).orElse(null); // Busca en BD
        assertNotNull(foundUser, "El usuario debería existir en la base de datos"); // Verifica existencia
        
        // RESULTADO ESPERADO: Test pasa, usuario creado correctamente
    }
    
    @Test
    @DisplayName("Debería lanzar excepción con datos inválidos")
    void createUser_WithInvalidData_ShouldThrowException() {
        // Arrange - Preparar datos inválidos
        User invalidUser = new User(); // Crea usuario sin datos
        // No establece campos requeridos
        
        // Act & Assert - Ejecutar acción y verificar excepción
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class, // Tipo de excepción esperada
            () -> userService.createUser(invalidUser), // Código que debería lanzar excepción
            "Debería lanzar IllegalArgumentException" // Mensaje si no lanza excepción
        );
        
        // Verificar mensaje de la excepción
        String message = exception.getMessage(); // Obtiene mensaje de error
        assertTrue(message.contains("Username") || message.contains("Email"), 
                  "El mensaje debería mencionar el campo requerido"); // Verifica mensaje
        
        // RESULTADO ESPERADO: Test pasa, excepción lanzada con mensaje descriptivo
    }
}

// application-test.properties - Propiedades para testing
/*
# Configuración de base de datos para testing (H2 en memoria)
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Configuración de JPA para testing
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Configuración de logging para testing
logging.level.com.example=DEBUG
logging.level.org.springframework.test=DEBUG

# Configuración de cache para testing
spring.cache.type=none
*/
```

### Comandos de Testing

```bash
# Ejecutar tests unitarios
mvn test # Ejecuta todos los tests unitarios
# RESULTADO ESPERADO: Tests ejecutados, reportes en target/surefire-reports

# Ejecutar tests específicos
mvn test -Dtest=UserServiceTest # Ejecuta solo UserServiceTest
# RESULTADO ESPERADO: Solo UserServiceTest ejecutado

# Ejecutar método específico
mvn test -Dtest=UserServiceTest#createUser_ShouldCreateUser # Ejecuta método específico
# RESULTADO ESPERADO: Solo el método especificado ejecutado

# Ejecutar tests con patrones
mvn test -Dtest="*ServiceTest" # Ejecuta tests que terminen en ServiceTest
# RESULTADO ESPERADO: Todos los tests de servicios ejecutados

# Ejecutar tests de integración
mvn verify # Ejecuta tests de integración
# RESULTADO ESPERADO: Tests de integración ejecutados

# Generar reporte de cobertura
mvn test jacoco:report # Ejecuta tests y genera reporte de cobertura
# RESULTADO ESPERADO: Reporte de cobertura en target/site/jacoco
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Maven y cuáles son sus características principales?**
   - Herramienta de build, gestión de dependencias, ciclo de vida estandarizado

2. **¿Cuál es la diferencia entre Maven y Gradle?**
   - Maven: XML, declarativo, Gradle: Groovy/Kotlin, imperativo

3. **¿Qué es el POM en Maven?**
   - Project Object Model, archivo XML que describe el proyecto

### Preguntas Intermedias

4. **¿Cómo funciona la resolución de dependencias en Maven?**
   - Repositorio local, repositorios remotos, conflictos de versiones

5. **¿Qué son los scopes en Maven?**
   - compile, runtime, test, provided, system, import

6. **¿Cómo manejar conflictos de dependencias?**
   - exclusion, dependencyManagement, versiones específicas

### Preguntas Avanzadas

7. **¿Cómo optimizar builds de Maven?**
   - Parallel execution, incremental compilation, dependency caching

8. **¿Qué son los plugins de Maven y cómo crearlos?**
   - Extensiones de funcionalidad, Mojo, lifecycle binding

9. **¿Cómo implementar CI/CD con Maven?**
   - Jenkins, GitHub Actions, Azure DevOps, pipelines automatizados

---

## 📚 Recursos Adicionales

- [Maven Documentation](https://maven.apache.org/guides/)
- [Maven Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [Maven Plugins](https://maven.apache.org/plugins/)
- [Maven Best Practices](https://maven.apache.org/developers/conventions/code.html)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Maven! 🚀** 