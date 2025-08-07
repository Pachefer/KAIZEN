# 🎯 EJERCICIOS PRÁCTICOS AVANZADOS SPRING SYSTEM DESIGN
## Desafíos y Proyectos para Dominar Spring System Design

---

## 📋 **INTRODUCCIÓN A LOS EJERCICIOS**

Estos ejercicios están diseñados para complementar el curso "Spring System Design in Practice" y aplicar todos los conceptos avanzados aprendidos en sistemas escalables empresariales.

### **🎯 Niveles de Dificultad:**
- **🟢 Básico** - Conceptos fundamentales de Spring System Design
- **🟡 Intermedio** - Patrones y arquitectura
- **🔴 Avanzado** - Conceptos expertos
- **🟣 Experto** - Proyectos completos

---

## 🟢 **EJERCICIOS BÁSICOS**

### **Ejercicio 1: Configuración de Spring Boot con Gradle**

```java
// 🎯 Objetivo: Configurar un proyecto Spring Boot básico

// 1. Crea la configuración de Gradle
// build.gradle
plugins {
    // Completa la configuración
}

// 2. Configura el entorno de desarrollo
// application-dev.yml
spring:
  datasource:
    # Completa la configuración

// 3. Crea una entidad básica
// src/main/java/com/systemdesign/rentalproperties/domain/RentalProperty.java
@Entity
@Table(name = "rental_properties")
public class RentalProperty {
    // Completa la entidad
}
```

**Solución:**
```gradle
// build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'org.flywaydb.flyway' version '10.0.0'
    id 'org.sonarqube' version '4.4.1.3373'
}

group = 'com.systemdesign'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-cache'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    
    implementation 'org.postgresql:postgresql'
    implementation 'org.flywaydb:flyway-core'
    implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
    implementation 'org.springframework.kafka:spring-kafka'
    
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
    testImplementation 'org.testcontainers:junit-jupiter'
    testImplementation 'org.testcontainers:postgresql'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/rental_system
    username: admin
    password: password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    locations: classpath:db/migration
  
  security:
    jwt:
      secret: your-dev-secret-key
      expiration: 86400000 # 24 hours

logging:
  level:
    com.systemdesign: DEBUG
    org.springframework.security: DEBUG
```

```java
// src/main/java/com/systemdesign/rentalproperties/domain/RentalProperty.java
package com.systemdesign.rentalproperties.domain;

import com.systemdesign.shared.domain.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "rental_properties")
public class RentalProperty extends BaseEntity {
    
    @NotBlank(message = "Address is required")
    @Column(name = "address", nullable = false)
    private String address;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PropertyStatus status = PropertyStatus.AVAILABLE;
    
    @NotNull(message = "Landlord ID is required")
    @Column(name = "landlord_id", nullable = false)
    private UUID landlordId;
    
    @Column(name = "tenant_id")
    private UUID tenantId;
    
    @ElementCollection
    @CollectionTable(name = "property_features", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "feature")
    private Set<String> features = new HashSet<>();
    
    // Constructor privado para encapsulación
    private RentalProperty() {}
    
    // Factory method
    public static RentalProperty create(String address, BigDecimal price, 
                                       UUID landlordId, Set<String> features) {
        RentalProperty property = new RentalProperty();
        property.address = address;
        property.price = price;
        property.landlordId = landlordId;
        property.features = features != null ? features : new HashSet<>();
        property.status = PropertyStatus.AVAILABLE;
        return property;
    }
    
    // Business methods
    public void reserve(UUID tenantId) {
        if (status != PropertyStatus.AVAILABLE) {
            throw new IllegalStateException("Property is not available for reservation");
        }
        this.tenantId = tenantId;
        this.status = PropertyStatus.RESERVED;
    }
    
    public void release() {
        this.tenantId = null;
        this.status = PropertyStatus.AVAILABLE;
    }
    
    public boolean isAvailable() {
        return status == PropertyStatus.AVAILABLE;
    }
    
    // Getters
    public String getAddress() { return address; }
    public BigDecimal getPrice() { return price; }
    public PropertyStatus getStatus() { return status; }
    public UUID getLandlordId() { return landlordId; }
    public UUID getTenantId() { return tenantId; }
    public Set<String> getFeatures() { return new HashSet<>(features); }
}

// src/main/java/com/systemdesign/rentalproperties/domain/PropertyStatus.java
package com.systemdesign.rentalproperties.domain;

public enum PropertyStatus {
    AVAILABLE,
    RESERVED,
    RENTED,
    MAINTENANCE,
    UNAVAILABLE
}
```

### **Ejercicio 2: Crear un Repository con Spring Data JPA**

```java
// 🎯 Objetivo: Crear un repository usando Spring Data JPA

// 1. Crea la interfaz del repository
public interface RentalPropertyRepository extends JpaRepository<RentalProperty, UUID> {
    // Completa los métodos de consulta
}

// 2. Crea el service
@Service
@Transactional
public class RentalPropertyService {
    // Implementa el service
}

// 3. Crea el controlador REST
@RestController
@RequestMapping("/api/v1/properties")
public class RentalPropertyController {
    // Implementa el controlador
}
```

**Solución:**
```java
// src/main/java/com/systemdesign/rentalproperties/infrastructure/RentalPropertyRepository.java
package com.systemdesign.rentalproperties.infrastructure;

import com.systemdesign.rentalproperties.domain.RentalProperty;
import com.systemdesign.rentalproperties.domain.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface RentalPropertyRepository extends JpaRepository<RentalProperty, UUID> {
    
    List<RentalProperty> findByLandlordId(UUID landlordId);
    
    List<RentalProperty> findByStatus(PropertyStatus status);
    
    List<RentalProperty> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<RentalProperty> findByAddressContainingIgnoreCase(String address);
    
    List<RentalProperty> findByLandlordIdAndStatus(UUID landlordId, PropertyStatus status);
    
    @Query("SELECT p FROM RentalProperty p WHERE p.status = 'AVAILABLE' " +
           "AND p.price BETWEEN :minPrice AND :maxPrice " +
           "AND p.address LIKE %:location%")
    List<RentalProperty> searchAvailableProperties(@Param("minPrice") BigDecimal minPrice,
                                                   @Param("maxPrice") BigDecimal maxPrice,
                                                   @Param("location") String location);
    
    @Query("SELECT COUNT(p) FROM RentalProperty p WHERE p.landlordId = :landlordId")
    long countByLandlordId(@Param("landlordId") UUID landlordId);
    
    @Query("SELECT AVG(p.price) FROM RentalProperty p WHERE p.status = 'AVAILABLE'")
    BigDecimal getAveragePrice();
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/application/RentalPropertyService.java
package com.systemdesign.rentalproperties.application;

import com.systemdesign.rentalproperties.domain.RentalProperty;
import com.systemdesign.rentalproperties.domain.PropertyStatus;
import com.systemdesign.rentalproperties.infrastructure.RentalPropertyRepository;
import com.systemdesign.rentalproperties.presentation.dto.CreatePropertyRequest;
import com.systemdesign.rentalproperties.presentation.dto.UpdatePropertyRequest;
import com.systemdesign.shared.domain.events.EventPublisher;
import com.systemdesign.rentalproperties.domain.events.PropertyCreatedEvent;
import com.systemdesign.rentalproperties.domain.events.PropertyReservedEvent;
import com.systemdesign.rentalproperties.domain.exceptions.PropertyNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class RentalPropertyService {
    
    private final RentalPropertyRepository propertyRepository;
    private final EventPublisher eventPublisher;
    
    public RentalProperty createProperty(CreatePropertyRequest request) {
        RentalProperty property = RentalProperty.create(
            request.getAddress(),
            request.getPrice(),
            request.getLandlordId(),
            request.getFeatures()
        );
        
        RentalProperty savedProperty = propertyRepository.save(property);
        
        eventPublisher.publish(new PropertyCreatedEvent(savedProperty.getId(), 
                                                       savedProperty.getAddress()));
        
        return savedProperty;
    }
    
    @Transactional(readOnly = true)
    public RentalProperty getPropertyById(UUID id) {
        return propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<RentalProperty> getAllProperties() {
        return propertyRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<RentalProperty> getPropertiesByLandlord(UUID landlordId) {
        return propertyRepository.findByLandlordId(landlordId);
    }
    
    @Transactional(readOnly = true)
    public List<RentalProperty> getAvailableProperties() {
        return propertyRepository.findByStatus(PropertyStatus.AVAILABLE);
    }
    
    @Transactional(readOnly = true)
    public List<RentalProperty> searchProperties(BigDecimal minPrice, BigDecimal maxPrice, String location) {
        return propertyRepository.searchAvailableProperties(minPrice, maxPrice, location);
    }
    
    public RentalProperty updateProperty(UUID id, UpdatePropertyRequest request) {
        RentalProperty property = getPropertyById(id);
        
        if (request.getAddress() != null) {
            property.setAddress(request.getAddress());
        }
        if (request.getPrice() != null) {
            property.setPrice(request.getPrice());
        }
        if (request.getFeatures() != null) {
            property.setFeatures(request.getFeatures());
        }
        
        return propertyRepository.save(property);
    }
    
    public RentalProperty reserveProperty(UUID propertyId, UUID tenantId) {
        RentalProperty property = getPropertyById(propertyId);
        property.reserve(tenantId);
        
        RentalProperty updatedProperty = propertyRepository.save(property);
        
        eventPublisher.publish(new PropertyReservedEvent(propertyId, tenantId));
        
        return updatedProperty;
    }
    
    public RentalProperty releaseProperty(UUID propertyId) {
        RentalProperty property = getPropertyById(propertyId);
        property.release();
        
        return propertyRepository.save(property);
    }
    
    public void deleteProperty(UUID id) {
        if (!propertyRepository.existsById(id)) {
            throw new PropertyNotFoundException("Property not found with id: " + id);
        }
        propertyRepository.deleteById(id);
    }
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/presentation/RentalPropertyController.java
package com.systemdesign.rentalproperties.presentation;

import com.systemdesign.rentalproperties.application.RentalPropertyService;
import com.systemdesign.rentalproperties.domain.RentalProperty;
import com.systemdesign.rentalproperties.presentation.dto.CreatePropertyRequest;
import com.systemdesign.rentalproperties.presentation.dto.UpdatePropertyRequest;
import com.systemdesign.shared.domain.exceptions.PropertyNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class RentalPropertyController {
    
    private final RentalPropertyService propertyService;
    
    @PostMapping
    public ResponseEntity<RentalProperty> createProperty(@Valid @RequestBody CreatePropertyRequest request) {
        RentalProperty property = propertyService.createProperty(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(property);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RentalProperty> getPropertyById(@PathVariable UUID id) {
        try {
            RentalProperty property = propertyService.getPropertyById(id);
            return ResponseEntity.ok(property);
        } catch (PropertyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<RentalProperty>> getAllProperties() {
        List<RentalProperty> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<RentalProperty>> getPropertiesByLandlord(@PathVariable UUID landlordId) {
        List<RentalProperty> properties = propertyService.getPropertiesByLandlord(landlordId);
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<RentalProperty>> getAvailableProperties() {
        List<RentalProperty> properties = propertyService.getAvailableProperties();
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<RentalProperty>> searchProperties(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String location) {
        
        List<RentalProperty> properties = propertyService.searchProperties(minPrice, maxPrice, location);
        return ResponseEntity.ok(properties);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RentalProperty> updateProperty(@PathVariable UUID id, 
                                                        @Valid @RequestBody UpdatePropertyRequest request) {
        try {
            RentalProperty property = propertyService.updateProperty(id, request);
            return ResponseEntity.ok(property);
        } catch (PropertyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/reserve")
    public ResponseEntity<RentalProperty> reserveProperty(@PathVariable UUID id, 
                                                         @RequestParam UUID tenantId) {
        try {
            RentalProperty property = propertyService.reserveProperty(id, tenantId);
            return ResponseEntity.ok(property);
        } catch (PropertyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/release")
    public ResponseEntity<RentalProperty> releaseProperty(@PathVariable UUID id) {
        try {
            RentalProperty property = propertyService.releaseProperty(id);
            return ResponseEntity.ok(property);
        } catch (PropertyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable UUID id) {
        try {
            propertyService.deleteProperty(id);
            return ResponseEntity.noContent().build();
        } catch (PropertyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

---

## 🟡 **EJERCICIOS INTERMEDIOS**

### **Ejercicio 3: Event-Driven Architecture con Spring Events**

```java
// 🎯 Objetivo: Implementar arquitectura event-driven

// 1. Configura Spring Events
// src/main/java/com/systemdesign/shared/config/EventConfig.java
@Configuration
public class EventConfig {
    // Completa la configuración
}

// 2. Crea los eventos
// src/main/java/com/systemdesign/rentalproperties/domain/events/PropertyEvents.java
public class PropertyCreatedEvent {
    // Implementa el evento
}

// 3. Crea los listeners
// src/main/java/com/systemdesign/rentalproperties/infrastructure/listeners/PropertyEventListeners.java
@Component
public class PropertyEventListeners {
    // Implementa los listeners
}
```

**Solución:**
```java
// src/main/java/com/systemdesign/shared/config/EventConfig.java
package com.systemdesign.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ApplicationEventMulticaster;
import org.springframework.context.event.SimpleApplicationEventMulticaster;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

@Configuration
public class EventConfig {
    
    @Bean(name = "applicationEventMulticaster")
    public ApplicationEventMulticaster applicationEventMulticaster() {
        SimpleApplicationEventMulticaster eventMulticaster = new SimpleApplicationEventMulticaster();
        eventMulticaster.setTaskExecutor(new SimpleAsyncTaskExecutor());
        return eventMulticaster;
    }
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/domain/events/PropertyEvents.java
package com.systemdesign.rentalproperties.domain.events;

import com.systemdesign.shared.domain.events.DomainEvent;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
public class PropertyCreatedEvent extends DomainEvent {
    private final UUID propertyId;
    private final String address;
    private final BigDecimal price;
    private final UUID landlordId;
    
    public PropertyCreatedEvent(UUID propertyId, String address, BigDecimal price, UUID landlordId) {
        this.propertyId = propertyId;
        this.address = address;
        this.price = price;
        this.landlordId = landlordId;
    }
}

@Getter
public class PropertyReservedEvent extends DomainEvent {
    private final UUID propertyId;
    private final UUID tenantId;
    
    public PropertyReservedEvent(UUID propertyId, UUID tenantId) {
        this.propertyId = propertyId;
        this.tenantId = tenantId;
    }
}

@Getter
public class PropertyUpdatedEvent extends DomainEvent {
    private final UUID propertyId;
    private final String address;
    private final BigDecimal price;
    
    public PropertyUpdatedEvent(UUID propertyId, String address, BigDecimal price) {
        this.propertyId = propertyId;
        this.address = address;
        this.price = price;
    }
}

@Getter
public class PropertyDeletedEvent extends DomainEvent {
    private final UUID propertyId;
    
    public PropertyDeletedEvent(UUID propertyId) {
        this.propertyId = propertyId;
    }
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/infrastructure/listeners/PropertyEventListeners.java
package com.systemdesign.rentalproperties.infrastructure.listeners;

import com.systemdesign.rentalproperties.domain.events.*;
import com.systemdesign.notifications.application.NotificationService;
import com.systemdesign.analytics.application.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PropertyEventListeners {
    
    private final NotificationService notificationService;
    private final AnalyticsService analyticsService;
    
    @EventListener
    @Async
    public void handlePropertyCreated(PropertyCreatedEvent event) {
        log.info("Property created: {}", event.getPropertyId());
        
        // Notificar al landlord
        notificationService.notifyUser(event.getLandlordId(), 
            "Property created successfully: " + event.getAddress());
        
        // Registrar en analytics
        analyticsService.trackEvent("property_created", 
            "property_id", event.getPropertyId().toString(),
            "address", event.getAddress(),
            "price", event.getPrice().toString());
    }
    
    @EventListener
    @Async
    public void handlePropertyReserved(PropertyReservedEvent event) {
        log.info("Property reserved: {} by tenant: {}", event.getPropertyId(), event.getTenantId());
        
        // Notificar al tenant
        notificationService.notifyUser(event.getTenantId(), 
            "Property reserved successfully");
        
        // Registrar en analytics
        analyticsService.trackEvent("property_reserved", 
            "property_id", event.getPropertyId().toString(),
            "tenant_id", event.getTenantId().toString());
    }
    
    @EventListener
    @Async
    public void handlePropertyUpdated(PropertyUpdatedEvent event) {
        log.info("Property updated: {}", event.getPropertyId());
        
        // Registrar en analytics
        analyticsService.trackEvent("property_updated", 
            "property_id", event.getPropertyId().toString(),
            "address", event.getAddress(),
            "price", event.getPrice().toString());
    }
    
    @EventListener
    @Async
    public void handlePropertyDeleted(PropertyDeletedEvent event) {
        log.info("Property deleted: {}", event.getPropertyId());
        
        // Limpiar datos relacionados
        analyticsService.deletePropertyData(event.getPropertyId());
        
        // Registrar en analytics
        analyticsService.trackEvent("property_deleted", 
            "property_id", event.getPropertyId().toString());
    }
}
```

### **Ejercicio 4: Microservicios con Spring Cloud**

```java
// 🎯 Objetivo: Implementar microservicios con Spring Cloud

// 1. Configura Spring Cloud
// build.gradle (dependencies)
dependencies {
    // Completa las dependencias
}

// 2. Crea el servicio de descubrimiento
// src/main/java/com/systemdesign/discovery/DiscoveryServiceApplication.java
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {
    // Implementa la aplicación
}

// 3. Crea el API Gateway
// src/main/java/com/systemdesign/gateway/GatewayApplication.java
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    // Implementa la aplicación
}
```

**Solución:**
```gradle
// build.gradle (para microservicios)
dependencies {
    // Spring Cloud
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway'
    implementation 'org.springframework.cloud:spring-cloud-starter-config'
    implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j'
    
    // Spring Boot
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    
    // Database
    implementation 'org.postgresql:postgresql'
    implementation 'org.flywaydb:flyway-core'
    
    // Security
    implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.3'
    
    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
    testImplementation 'org.testcontainers:junit-jupiter'
    testImplementation 'org.testcontainers:postgresql'
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:2023.0.0"
    }
}
```

```java
// src/main/java/com/systemdesign/discovery/DiscoveryServiceApplication.java
package com.systemdesign.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}
```

```yaml
# src/main/resources/application.yml (Discovery Service)
server:
  port: 8761

spring:
  application:
    name: discovery-service

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    wait-time-in-ms-when-sync-empty: 0
```

```java
// src/main/java/com/systemdesign/gateway/GatewayApplication.java
package com.systemdesign.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

```yaml
# src/main/resources/application.yml (API Gateway)
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: rental-properties-service
          uri: lb://rental-properties-service
          predicates:
            - Path=/api/v1/properties/**
          filters:
            - StripPrefix=0
            - name: CircuitBreaker
              args:
                name: propertiesCircuitBreaker
                fallbackUri: forward:/fallback/properties
        
        - id: rental-proposals-service
          uri: lb://rental-proposals-service
          predicates:
            - Path=/api/v1/proposals/**
          filters:
            - StripPrefix=0
            - name: CircuitBreaker
              args:
                name: proposalsCircuitBreaker
                fallbackUri: forward:/fallback/proposals
        
        - id: payments-service
          uri: lb://payments-service
          predicates:
            - Path=/api/v1/payments/**
          filters:
            - StripPrefix=0
            - name: CircuitBreaker
              args:
                name: paymentsCircuitBreaker
                fallbackUri: forward:/fallback/payments

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

management:
  endpoints:
    web:
      exposure:
        include: health,info,gateway
```

```java
// src/main/java/com/systemdesign/gateway/fallback/FallbackController.java
package com.systemdesign.gateway.fallback;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {
    
    @GetMapping("/properties")
    public ResponseEntity<Map<String, String>> propertiesFallback() {
        return ResponseEntity.ok(Map.of(
            "message", "Properties service is temporarily unavailable",
            "status", "SERVICE_UNAVAILABLE"
        ));
    }
    
    @GetMapping("/proposals")
    public ResponseEntity<Map<String, String>> proposalsFallback() {
        return ResponseEntity.ok(Map.of(
            "message", "Proposals service is temporarily unavailable",
            "status", "SERVICE_UNAVAILABLE"
        ));
    }
    
    @GetMapping("/payments")
    public ResponseEntity<Map<String, String>> paymentsFallback() {
        return ResponseEntity.ok(Map.of(
            "message", "Payments service is temporarily unavailable",
            "status", "SERVICE_UNAVAILABLE"
        ));
    }
}
```

---

## 🔴 **EJERCICIOS AVANZADOS**

### **Ejercicio 5: CQRS Pattern con Spring**

```java
// 🎯 Objetivo: Implementar CQRS (Command Query Responsibility Segregation)

// 1. Configura CQRS
// src/main/java/com/systemdesign/shared/config/CqrsConfig.java
@Configuration
public class CqrsConfig {
    // Completa la configuración
}

// 2. Crea los commands
// src/main/java/com/systemdesign/rentalproperties/application/commands/PropertyCommands.java
public class CreatePropertyCommand {
    // Implementa el command
}

// 3. Crea los queries
// src/main/java/com/systemdesign/rentalproperties/application/queries/PropertyQueries.java
public class GetPropertyByIdQuery {
    // Implementa el query
}

// 4. Crea los handlers
// src/main/java/com/systemdesign/rentalproperties/application/handlers/PropertyCommandHandlers.java
@Component
public class PropertyCommandHandlers {
    // Implementa los handlers
}
```

**Solución:**
```java
// src/main/java/com/systemdesign/shared/config/CqrsConfig.java
package com.systemdesign.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;

@Configuration
public class CqrsConfig implements ApplicationEventPublisherAware {
    
    private ApplicationEventPublisher eventPublisher;
    
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.eventPublisher = applicationEventPublisher;
    }
    
    @Bean
    public ApplicationEventPublisher eventPublisher() {
        return eventPublisher;
    }
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/application/commands/PropertyCommands.java
package com.systemdesign.rentalproperties.application.commands;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Getter
@RequiredArgsConstructor
public class CreatePropertyCommand {
    private final String address;
    private final BigDecimal price;
    private final UUID landlordId;
    private final Set<String> features;
}

@Getter
@RequiredArgsConstructor
public class UpdatePropertyCommand {
    private final UUID propertyId;
    private final String address;
    private final BigDecimal price;
    private final Set<String> features;
}

@Getter
@RequiredArgsConstructor
public class ReservePropertyCommand {
    private final UUID propertyId;
    private final UUID tenantId;
}

@Getter
@RequiredArgsConstructor
public class ReleasePropertyCommand {
    private final UUID propertyId;
}

@Getter
@RequiredArgsConstructor
public class DeletePropertyCommand {
    private final UUID propertyId;
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/application/queries/PropertyQueries.java
package com.systemdesign.rentalproperties.application.queries;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@RequiredArgsConstructor
public class GetPropertyByIdQuery {
    private final UUID propertyId;
}

@Getter
@RequiredArgsConstructor
public class GetAllPropertiesQuery {
    // No parameters needed
}

@Getter
@RequiredArgsConstructor
public class GetPropertiesByLandlordQuery {
    private final UUID landlordId;
}

@Getter
@RequiredArgsConstructor
public class SearchPropertiesQuery {
    private final BigDecimal minPrice;
    private final BigDecimal maxPrice;
    private final String location;
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/application/handlers/PropertyCommandHandlers.java
package com.systemdesign.rentalproperties.application.handlers;

import com.systemdesign.rentalproperties.application.commands.*;
import com.systemdesign.rentalproperties.domain.RentalProperty;
import com.systemdesign.rentalproperties.infrastructure.RentalPropertyRepository;
import com.systemdesign.rentalproperties.domain.events.*;
import com.systemdesign.shared.domain.events.EventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PropertyCommandHandlers {
    
    private final RentalPropertyRepository propertyRepository;
    private final EventPublisher eventPublisher;
    
    @Transactional
    public RentalProperty handle(CreatePropertyCommand command) {
        RentalProperty property = RentalProperty.create(
            command.getAddress(),
            command.getPrice(),
            command.getLandlordId(),
            command.getFeatures()
        );
        
        RentalProperty savedProperty = propertyRepository.save(property);
        
        eventPublisher.publish(new PropertyCreatedEvent(
            savedProperty.getId(),
            savedProperty.getAddress(),
            savedProperty.getPrice(),
            savedProperty.getLandlordId()
        ));
        
        return savedProperty;
    }
    
    @Transactional
    public RentalProperty handle(UpdatePropertyCommand command) {
        RentalProperty property = propertyRepository.findById(command.getPropertyId())
            .orElseThrow(() -> new PropertyNotFoundException("Property not found"));
        
        if (command.getAddress() != null) {
            property.setAddress(command.getAddress());
        }
        if (command.getPrice() != null) {
            property.setPrice(command.getPrice());
        }
        if (command.getFeatures() != null) {
            property.setFeatures(command.getFeatures());
        }
        
        RentalProperty updatedProperty = propertyRepository.save(property);
        
        eventPublisher.publish(new PropertyUpdatedEvent(
            updatedProperty.getId(),
            updatedProperty.getAddress(),
            updatedProperty.getPrice()
        ));
        
        return updatedProperty;
    }
    
    @Transactional
    public RentalProperty handle(ReservePropertyCommand command) {
        RentalProperty property = propertyRepository.findById(command.getPropertyId())
            .orElseThrow(() -> new PropertyNotFoundException("Property not found"));
        
        property.reserve(command.getTenantId());
        RentalProperty updatedProperty = propertyRepository.save(property);
        
        eventPublisher.publish(new PropertyReservedEvent(
            updatedProperty.getId(),
            command.getTenantId()
        ));
        
        return updatedProperty;
    }
    
    @Transactional
    public RentalProperty handle(ReleasePropertyCommand command) {
        RentalProperty property = propertyRepository.findById(command.getPropertyId())
            .orElseThrow(() -> new PropertyNotFoundException("Property not found"));
        
        property.release();
        return propertyRepository.save(property);
    }
    
    @Transactional
    public void handle(DeletePropertyCommand command) {
        if (!propertyRepository.existsById(command.getPropertyId())) {
            throw new PropertyNotFoundException("Property not found");
        }
        
        propertyRepository.deleteById(command.getPropertyId());
        
        eventPublisher.publish(new PropertyDeletedEvent(command.getPropertyId()));
    }
}
```

```java
// src/main/java/com/systemdesign/rentalproperties/application/handlers/PropertyQueryHandlers.java
package com.systemdesign.rentalproperties.application.handlers;

import com.systemdesign.rentalproperties.application.queries.*;
import com.systemdesign.rentalproperties.domain.RentalProperty;
import com.systemdesign.rentalproperties.infrastructure.RentalPropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PropertyQueryHandlers {
    
    private final RentalPropertyRepository propertyRepository;
    
    public Optional<RentalProperty> handle(GetPropertyByIdQuery query) {
        return propertyRepository.findById(query.getPropertyId());
    }
    
    public List<RentalProperty> handle(GetAllPropertiesQuery query) {
        return propertyRepository.findAll();
    }
    
    public List<RentalProperty> handle(GetPropertiesByLandlordQuery query) {
        return propertyRepository.findByLandlordId(query.getLandlordId());
    }
    
    public List<RentalProperty> handle(SearchPropertiesQuery query) {
        return propertyRepository.searchAvailableProperties(
            query.getMinPrice(),
            query.getMaxPrice(),
            query.getLocation()
        );
    }
}
```

---

## 🟣 **PROYECTOS COMPLETOS**

### **Proyecto 1: Sistema de Alquiler Completo**

```java
// 🎯 Objetivo: Crear un sistema completo de alquiler de propiedades

// Características requeridas:
// - Microservicios: Properties, Proposals, Payments, Users, Notifications
// - Event-Driven Architecture con Spring Events
// - CQRS Pattern para separación de comandos y queries
// - Spring Cloud para service discovery y API Gateway
// - Testing completo con TestContainers
// - Docker y Kubernetes
// - CI/CD pipeline
// - Monitoring y logging
```

### **Proyecto 2: Sistema de Gestión Empresarial**

```java
// 🎯 Objetivo: Crear un sistema completo de gestión empresarial

// Características requeridas:
// - Módulos: Employees, Departments, Projects, Tasks, Reports
// - REST API y GraphQL
// - Autenticación y autorización avanzada
// - Auditoría y logging
// - Reportes y analytics
// - Notificaciones en tiempo real
// - Integración con servicios externos
// - Despliegue en la nube
```

---

## 🎯 **DESAFÍOS EXTRA**

### **Desafío 1: Sistema de Microservicios Distribuido**

```java
// Implementa un sistema completo de microservicios con:
// - API Gateway con Spring Cloud Gateway
// - Service Discovery con Eureka
// - Config Server con Spring Cloud Config
// - Circuit Breaker con Resilience4j
// - Distributed Tracing con Sleuth
// - Load Balancing
// - Health Checks
// - Metrics con Micrometer
```

### **Desafío 2: Aplicación Serverless con Spring**

```java
// Desarrolla una aplicación serverless con:
// - AWS Lambda con Spring Cloud Function
// - API Gateway
// - DynamoDB
// - S3 para archivos
// - SQS para mensajes
// - CloudWatch para logging
// - Serverless Framework
// - CI/CD con GitHub Actions
```

### **Desafío 3: Sistema de Real-time con WebSockets**

```java
// Crea un sistema de comunicación en tiempo real con:
// - WebSockets con Spring WebSocket
// - STOMP protocol
// - Chat en tiempo real
// - Notificaciones push
// - Presence indicators
// - Room management
// - Message persistence
// - File sharing
```

---

## 📊 **EVALUACIÓN Y MÉTRICAS**

### **Criterios de Evaluación:**

1. **Arquitectura de Sistemas** - Uso de patrones de diseño
2. **Performance** - Optimización y rendimiento
3. **Testing Coverage** - Cobertura de pruebas
4. **Security** - Implementación de seguridad
5. **Documentation** - Código bien documentado
6. **Deployment** - Despliegue automatizado
7. **Monitoring** - Observabilidad y logging

### **Herramientas de Evaluación:**

```bash
# Spring Boot
./gradlew test
./gradlew integrationTest
./gradlew testCoverage
./gradlew build

# Microservicios
./gradlew test:microservices
./gradlew test:integration
./gradlew test:performance

# Docker
docker build -t spring-system-design .
docker-compose up -d
docker-compose down

# Kubernetes
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f deployment/spring-system-design
```

---

*¡Estos ejercicios te ayudarán a dominar el diseño de sistemas escalables con Spring y las mejores prácticas empresariales!* 🚀✨ 