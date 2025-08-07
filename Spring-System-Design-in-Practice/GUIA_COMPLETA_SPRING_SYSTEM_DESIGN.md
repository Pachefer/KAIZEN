# 🚀 GUÍA COMPLETA SPRING SYSTEM DESIGN IN PRACTICE
## Integración de Conceptos Avanzados y Diseño de Sistemas Escalables

---

## 📋 **INTRODUCCIÓN A LA GUÍA COMPLETA**

Esta guía integra todos los conceptos avanzados desarrollados para complementar el curso "Spring System Design in Practice" de 12 capítulos, incluyendo patrones de diseño, arquitectura de microservicios, y mejores prácticas para sistemas escalables empresariales.

### **🎯 Contenido Integrado:**
- **Arquitectura de Sistemas** - Spring Boot, Microservicios, Event-Driven
- **Patrones de Diseño** - SOLID, Clean Architecture, Domain-Driven Design
- **Despliegue Empresarial** - Docker, Kubernetes, CI/CD
- **Mejores Prácticas** - Testing, Performance, Security
- **Tecnologías Modernas** - Spring Cloud, Apache Kafka, Redis
- **DevOps Completo** - CI/CD, Monitoreo, Logging

---

## 🏗️ **ARQUITECTURA DE SISTEMAS CON SPRING**

### **1. Estructura de Proyecto Empresarial**

```java
// Estructura recomendada para sistemas escalables
/*
spring-system-design/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── systemdesign/
│   │   │           ├── rentalproperties/     # Dominio de propiedades
│   │   │           │   ├── domain/           # Entidades de dominio
│   │   │           │   ├── application/      # Casos de uso
│   │   │           │   ├── infrastructure/   # Implementaciones
│   │   │           │   └── presentation/     # Controladores REST
│   │   │           ├── rentalproposal/       # Dominio de propuestas
│   │   │           ├── payments/             # Dominio de pagos
│   │   │           ├── users/                # Dominio de usuarios
│   │   │           ├── notifications/        # Dominio de notificaciones
│   │   │           └── shared/               # Código compartido
│   │   │               ├── domain/           # Entidades compartidas
│   │   │               ├── infrastructure/   # Configuraciones
│   │   │               └── events/           # Eventos de dominio
│   │   └── resources/
│   │       ├── application.yml               # Configuración
│   │       ├── application-dev.yml           # Configuración desarrollo
│   │       └── application-prod.yml          # Configuración producción
│   └── test/
│       ├── java/                             # Tests unitarios
│       └── resources/                        # Recursos de test
├── docker/                                   # Configuración Docker
├── k8s/                                      # Configuración Kubernetes
├── docs/                                     # Documentación
└── build.gradle                              # Configuración Gradle
*/
```

### **2. Configuración de Dominios Compartidos**

```java
// src/main/java/com/systemdesign/shared/domain/BaseEntity.java
package com.systemdesign.shared.domain;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Version
    @Column(name = "version")
    private Long version;
    
    // Getters y setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}

// src/main/java/com/systemdesign/shared/domain/events/DomainEvent.java
package com.systemdesign.shared.domain.events;

import java.time.LocalDateTime;
import java.util.UUID;

public abstract class DomainEvent {
    private final UUID eventId;
    private final LocalDateTime occurredOn;
    private final String eventType;
    
    protected DomainEvent() {
        this.eventId = UUID.randomUUID();
        this.occurredOn = LocalDateTime.now();
        this.eventType = this.getClass().getSimpleName();
    }
    
    public UUID getEventId() { return eventId; }
    public LocalDateTime getOccurredOn() { return occurredOn; }
    public String getEventType() { return eventType; }
}

// src/main/java/com/systemdesign/shared/domain/events/EventPublisher.java
package com.systemdesign.shared.domain.events;

public interface EventPublisher {
    void publish(DomainEvent event);
    void publishAll(Iterable<DomainEvent> events);
}
```

---

## 🎯 **PRINCIPIOS SOLID EN SPRING SYSTEM DESIGN**

### **1. Single Responsibility Principle (SRP)**

```java
// ✅ Separación de responsabilidades en Spring

// Service para gestión de propiedades (Responsabilidad: Lógica de negocio de propiedades)
@Service
@Transactional
public class RentalPropertyService {
    
    private final RentalPropertyRepository propertyRepository;
    private final PropertySearchService searchService;
    private final PropertyValidationService validationService;
    private final EventPublisher eventPublisher;
    
    public RentalPropertyService(RentalPropertyRepository propertyRepository,
                                PropertySearchService searchService,
                                PropertyValidationService validationService,
                                EventPublisher eventPublisher) {
        this.propertyRepository = propertyRepository;
        this.searchService = searchService;
        this.validationService = validationService;
        this.eventPublisher = eventPublisher;
    }
    
    public RentalProperty createProperty(CreatePropertyRequest request) {
        // Validar datos
        validationService.validateCreateRequest(request);
        
        // Crear propiedad
        RentalProperty property = RentalProperty.create(
            request.getAddress(),
            request.getPrice(),
            request.getLandlordId(),
            request.getFeatures()
        );
        
        // Guardar en base de datos
        RentalProperty savedProperty = propertyRepository.save(property);
        
        // Publicar evento
        eventPublisher.publish(new PropertyCreatedEvent(savedProperty.getId(), 
                                                       savedProperty.getAddress()));
        
        return savedProperty;
    }
    
    public List<RentalProperty> searchProperties(PropertySearchCriteria criteria) {
        return searchService.search(criteria);
    }
    
    public RentalProperty reserveProperty(UUID propertyId, UUID tenantId) {
        RentalProperty property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found"));
        
        property.reserve(tenantId);
        RentalProperty updatedProperty = propertyRepository.save(property);
        
        eventPublisher.publish(new PropertyReservedEvent(propertyId, tenantId));
        
        return updatedProperty;
    }
}

// Service para gestión de propuestas (Responsabilidad: Lógica de negocio de propuestas)
@Service
@Transactional
public class RentalProposalService {
    
    private final RentalProposalRepository proposalRepository;
    private final ProposalValidationService validationService;
    private final NotificationService notificationService;
    private final EventPublisher eventPublisher;
    
    public RentalProposalService(RentalProposalRepository proposalRepository,
                                ProposalValidationService validationService,
                                NotificationService notificationService,
                                EventPublisher eventPublisher) {
        this.proposalRepository = proposalRepository;
        this.validationService = validationService;
        this.notificationService = notificationService;
        this.eventPublisher = eventPublisher;
    }
    
    public RentalProposal createProposal(CreateProposalRequest request) {
        validationService.validateCreateRequest(request);
        
        RentalProposal proposal = RentalProposal.create(
            request.getPropertyId(),
            request.getTenantId(),
            request.getProposedPrice(),
            request.getTerms()
        );
        
        RentalProposal savedProposal = proposalRepository.save(proposal);
        
        // Notificar al landlord
        notificationService.notifyLandlord(savedProposal.getPropertyId(), 
                                         "New rental proposal received");
        
        eventPublisher.publish(new ProposalCreatedEvent(savedProposal.getId(), 
                                                       savedProposal.getPropertyId()));
        
        return savedProposal;
    }
    
    public RentalProposal counterOffer(UUID proposalId, CounterOfferRequest request) {
        RentalProposal proposal = proposalRepository.findById(proposalId)
            .orElseThrow(() -> new ProposalNotFoundException("Proposal not found"));
        
        proposal.counterOffer(request.getNewPrice(), request.getNewTerms());
        RentalProposal updatedProposal = proposalRepository.save(proposal);
        
        // Notificar al tenant
        notificationService.notifyTenant(proposal.getTenantId(), 
                                       "Counter offer received");
        
        eventPublisher.publish(new CounterOfferEvent(proposalId, 
                                                    request.getNewPrice()));
        
        return updatedProposal;
    }
}

// Service para gestión de pagos (Responsabilidad: Lógica de negocio de pagos)
@Service
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final PaymentGatewayService gatewayService;
    private final PaymentValidationService validationService;
    private final EventPublisher eventPublisher;
    
    public PaymentService(PaymentRepository paymentRepository,
                         PaymentGatewayService gatewayService,
                         PaymentValidationService validationService,
                         EventPublisher eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.gatewayService = gatewayService;
        this.validationService = validationService;
        this.eventPublisher = eventPublisher;
    }
    
    public Payment processPayment(ProcessPaymentRequest request) {
        validationService.validatePaymentRequest(request);
        
        // Procesar pago a través del gateway
        PaymentGatewayResponse gatewayResponse = gatewayService.processPayment(
            request.getAmount(),
            request.getPaymentMethod(),
            request.getCurrency()
        );
        
        Payment payment = Payment.create(
            request.getProposalId(),
            gatewayResponse.getTransactionId(),
            request.getAmount(),
            gatewayResponse.getStatus()
        );
        
        Payment savedPayment = paymentRepository.save(payment);
        
        if (gatewayResponse.isSuccessful()) {
            eventPublisher.publish(new PaymentSuccessfulEvent(savedPayment.getId(), 
                                                             savedPayment.getAmount()));
        } else {
            eventPublisher.publish(new PaymentFailedEvent(savedPayment.getId(), 
                                                         gatewayResponse.getErrorMessage()));
        }
        
        return savedPayment;
    }
}
```

### **2. Open/Closed Principle (OCP)**

```java
// ✅ Extensible sin modificación

// Interfaz para estrategias de notificación
public interface NotificationStrategy {
    void sendNotification(String recipient, String message, NotificationType type);
    boolean supports(NotificationType type);
}

// Estrategia de notificación por email
@Service
public class EmailNotificationStrategy implements NotificationStrategy {
    
    private final JavaMailSender mailSender;
    private final EmailTemplateService templateService;
    
    public EmailNotificationStrategy(JavaMailSender mailSender,
                                   EmailTemplateService templateService) {
        this.mailSender = mailSender;
        this.templateService = templateService;
    }
    
    @Override
    public void sendNotification(String recipient, String message, NotificationType type) {
        String subject = templateService.getSubject(type);
        String htmlContent = templateService.renderTemplate(type, message);
        
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipient);
        email.setSubject(subject);
        email.setText(htmlContent);
        
        mailSender.send(email);
    }
    
    @Override
    public boolean supports(NotificationType type) {
        return type == NotificationType.EMAIL;
    }
}

// Estrategia de notificación por SMS
@Service
public class SmsNotificationStrategy implements NotificationStrategy {
    
    private final TwilioService twilioService;
    
    public SmsNotificationStrategy(TwilioService twilioService) {
        this.twilioService = twilioService;
    }
    
    @Override
    public void sendNotification(String recipient, String message, NotificationType type) {
        twilioService.sendSms(recipient, message);
    }
    
    @Override
    public boolean supports(NotificationType type) {
        return type == NotificationType.SMS;
    }
}

// Estrategia de notificación push
@Service
public class PushNotificationStrategy implements NotificationStrategy {
    
    private final FirebaseService firebaseService;
    
    public PushNotificationStrategy(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }
    
    @Override
    public void sendNotification(String recipient, String message, NotificationType type) {
        firebaseService.sendPushNotification(recipient, message);
    }
    
    @Override
    public boolean supports(NotificationType type) {
        return type == NotificationType.PUSH;
    }
}

// Service que usa estrategias de notificación
@Service
public class NotificationService {
    
    private final List<NotificationStrategy> strategies;
    
    public NotificationService(List<NotificationStrategy> strategies) {
        this.strategies = strategies;
    }
    
    public void sendNotification(String recipient, String message, NotificationType type) {
        NotificationStrategy strategy = strategies.stream()
            .filter(s -> s.supports(type))
            .findFirst()
            .orElseThrow(() -> new UnsupportedNotificationTypeException("Unsupported notification type: " + type));
        
        strategy.sendNotification(recipient, message, type);
    }
    
    public void sendMultiChannelNotification(String recipient, String message, 
                                           List<NotificationType> types) {
        types.forEach(type -> sendNotification(recipient, message, type));
    }
}
```

---

## 🏗️ **ARQUITECTURA CLEAN ARCHITECTURE EN SPRING**

### **1. Estructura de Capas**

```java
// Domain Layer (Entidades y reglas de negocio)
@Entity
@Table(name = "rental_properties")
public class RentalProperty extends BaseEntity {
    
    @Column(name = "address", nullable = false)
    private String address;
    
    @Column(name = "price", nullable = false)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PropertyStatus status;
    
    @Column(name = "landlord_id", nullable = false)
    private UUID landlordId;
    
    @Column(name = "tenant_id")
    private UUID tenantId;
    
    @ElementCollection
    @CollectionTable(name = "property_features")
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

// Repository Layer (Interfaces de acceso a datos)
public interface RentalPropertyRepository extends JpaRepository<RentalProperty, UUID> {
    List<RentalProperty> findByLandlordId(UUID landlordId);
    List<RentalProperty> findByStatus(PropertyStatus status);
    List<RentalProperty> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<RentalProperty> findByAddressContainingIgnoreCase(String address);
    
    @Query("SELECT p FROM RentalProperty p WHERE p.status = 'AVAILABLE' " +
           "AND p.price BETWEEN :minPrice AND :maxPrice " +
           "AND p.address LIKE %:location%")
    List<RentalProperty> searchAvailableProperties(@Param("minPrice") BigDecimal minPrice,
                                                   @Param("maxPrice") BigDecimal maxPrice,
                                                   @Param("location") String location);
}

// Use Case Layer (Casos de uso de la aplicación)
@Service
@Transactional
public class CreatePropertyUseCase {
    
    private final RentalPropertyRepository propertyRepository;
    private final PropertyValidationService validationService;
    private final EventPublisher eventPublisher;
    
    public CreatePropertyUseCase(RentalPropertyRepository propertyRepository,
                                PropertyValidationService validationService,
                                EventPublisher eventPublisher) {
        this.propertyRepository = propertyRepository;
        this.validationService = validationService;
        this.eventPublisher = eventPublisher;
    }
    
    public RentalProperty execute(CreatePropertyRequest request) {
        // Validar request
        validationService.validateCreateRequest(request);
        
        // Crear propiedad
        RentalProperty property = RentalProperty.create(
            request.getAddress(),
            request.getPrice(),
            request.getLandlordId(),
            request.getFeatures()
        );
        
        // Guardar
        RentalProperty savedProperty = propertyRepository.save(property);
        
        // Publicar evento
        eventPublisher.publish(new PropertyCreatedEvent(savedProperty.getId(), 
                                                       savedProperty.getAddress()));
        
        return savedProperty;
    }
}

// Infrastructure Layer (Implementaciones concretas)
@Repository
public class RentalPropertyRepositoryImpl implements RentalPropertyRepository {
    
    private final JpaRepository<RentalProperty, UUID> jpaRepository;
    
    public RentalPropertyRepositoryImpl(JpaRepository<RentalProperty, UUID> jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    public RentalProperty save(RentalProperty property) {
        return jpaRepository.save(property);
    }
    
    @Override
    public Optional<RentalProperty> findById(UUID id) {
        return jpaRepository.findById(id);
    }
    
    @Override
    public List<RentalProperty> findByLandlordId(UUID landlordId) {
        return jpaRepository.findByLandlordId(landlordId);
    }
    
    // Implementación de otros métodos...
}
```

---

## 🐳 **DOCKER Y KUBERNETES PARA SPRING**

### **1. Docker Compose para Desarrollo**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: rental_system
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - rental-network

  # Redis para caché y sesiones
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - rental-network

  # Apache Kafka para eventos
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - rental-network

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    networks:
      - rental-network

  # Servicio de propiedades
  rental-properties-service:
    build: 
      context: ./rental-properties-service
      dockerfile: Dockerfile.dev
    ports:
      - "8081:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/rental_system
      SPRING_REDIS_HOST: redis
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
    volumes:
      - ./rental-properties-service:/app
      - /app/build
    depends_on:
      - postgres
      - redis
      - kafka
    networks:
      - rental-network

  # Servicio de propuestas
  rental-proposals-service:
    build:
      context: ./rental-proposals-service
      dockerfile: Dockerfile.dev
    ports:
      - "8082:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/rental_system
      SPRING_REDIS_HOST: redis
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
    volumes:
      - ./rental-proposals-service:/app
      - /app/build
    depends_on:
      - postgres
      - redis
      - kafka
    networks:
      - rental-network

  # Servicio de pagos
  payments-service:
    build:
      context: ./payments-service
      dockerfile: Dockerfile.dev
    ports:
      - "8083:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/rental_system
      SPRING_REDIS_HOST: redis
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092
    volumes:
      - ./payments-service:/app
      - /app/build
    depends_on:
      - postgres
      - redis
      - kafka
    networks:
      - rental-network

  # API Gateway
  api-gateway:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - rental-properties-service
      - rental-proposals-service
      - payments-service
    networks:
      - rental-network

volumes:
  postgres_data:
  redis_data:

networks:
  rental-network:
    driver: bridge
```

### **2. Dockerfile para Spring Boot**

```dockerfile
# Dockerfile
FROM eclipse-temurin:17-jdk-alpine as build

WORKDIR /app

# Copiar archivos de configuración
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Descargar dependencias
RUN ./gradle dependencies --no-daemon

# Copiar código fuente
COPY src src

# Compilar aplicación
RUN ./gradle build -x test --no-daemon

# Etapa de producción
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S spring
RUN adduser -S spring -u 1001

# Copiar JAR compilado
COPY --from=build /app/build/libs/*.jar app.jar

# Cambiar propiedad de archivos
RUN chown -R spring:spring /app
USER spring

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 🧪 **TESTING AVANZADO PARA SPRING**

### **1. Testing de Servicios**

```java
// src/test/java/com/systemdesign/rentalproperties/service/RentalPropertyServiceTest.java
@ExtendWith(MockitoExtension.class)
class RentalPropertyServiceTest {
    
    @Mock
    private RentalPropertyRepository propertyRepository;
    
    @Mock
    private PropertySearchService searchService;
    
    @Mock
    private PropertyValidationService validationService;
    
    @Mock
    private EventPublisher eventPublisher;
    
    @InjectMocks
    private RentalPropertyService propertyService;
    
    @Test
    @DisplayName("Should create property successfully")
    void shouldCreatePropertySuccessfully() {
        // Arrange
        CreatePropertyRequest request = new CreatePropertyRequest(
            "123 Main St",
            new BigDecimal("1500.00"),
            UUID.randomUUID(),
            Set.of("Parking", "Gym")
        );
        
        RentalProperty expectedProperty = RentalProperty.create(
            request.getAddress(),
            request.getPrice(),
            request.getLandlordId(),
            request.getFeatures()
        );
        
        when(propertyRepository.save(any(RentalProperty.class)))
            .thenReturn(expectedProperty);
        
        // Act
        RentalProperty result = propertyService.createProperty(request);
        
        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getAddress()).isEqualTo(request.getAddress());
        assertThat(result.getPrice()).isEqualTo(request.getPrice());
        assertThat(result.getLandlordId()).isEqualTo(request.getLandlordId());
        
        verify(validationService).validateCreateRequest(request);
        verify(propertyRepository).save(any(RentalProperty.class));
        verify(eventPublisher).publish(any(PropertyCreatedEvent.class));
    }
    
    @Test
    @DisplayName("Should throw exception when property not found")
    void shouldThrowExceptionWhenPropertyNotFound() {
        // Arrange
        UUID propertyId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        
        when(propertyRepository.findById(propertyId))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> propertyService.reserveProperty(propertyId, tenantId))
            .isInstanceOf(PropertyNotFoundException.class)
            .hasMessage("Property not found");
        
        verify(propertyRepository).findById(propertyId);
        verifyNoMoreInteractions(propertyRepository, eventPublisher);
    }
    
    @Test
    @DisplayName("Should reserve property successfully")
    void shouldReservePropertySuccessfully() {
        // Arrange
        UUID propertyId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        
        RentalProperty property = RentalProperty.create(
            "123 Main St",
            new BigDecimal("1500.00"),
            UUID.randomUUID(),
            Set.of("Parking")
        );
        
        when(propertyRepository.findById(propertyId))
            .thenReturn(Optional.of(property));
        when(propertyRepository.save(any(RentalProperty.class)))
            .thenReturn(property);
        
        // Act
        RentalProperty result = propertyService.reserveProperty(propertyId, tenantId);
        
        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTenantId()).isEqualTo(tenantId);
        assertThat(result.getStatus()).isEqualTo(PropertyStatus.RESERVED);
        
        verify(propertyRepository).findById(propertyId);
        verify(propertyRepository).save(property);
        verify(eventPublisher).publish(any(PropertyReservedEvent.class));
    }
}
```

### **2. Testing de Controladores**

```java
// src/test/java/com/systemdesign/rentalproperties/presentation/RentalPropertyControllerTest.java
@WebMvcTest(RentalPropertyController.class)
class RentalPropertyControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private RentalPropertyService propertyService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @DisplayName("Should create property via REST API")
    void shouldCreatePropertyViaRestApi() throws Exception {
        // Arrange
        CreatePropertyRequest request = new CreatePropertyRequest(
            "123 Main St",
            new BigDecimal("1500.00"),
            UUID.randomUUID(),
            Set.of("Parking", "Gym")
        );
        
        RentalProperty expectedProperty = RentalProperty.create(
            request.getAddress(),
            request.getPrice(),
            request.getLandlordId(),
            request.getFeatures()
        );
        
        when(propertyService.createProperty(any(CreatePropertyRequest.class)))
            .thenReturn(expectedProperty);
        
        // Act & Assert
        mockMvc.perform(post("/api/v1/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(expectedProperty.getId().toString()))
            .andExpect(jsonPath("$.address").value(expectedProperty.getAddress()))
            .andExpect(jsonPath("$.price").value(expectedProperty.getPrice().doubleValue()))
            .andExpect(jsonPath("$.status").value(expectedProperty.getStatus().toString()));
        
        verify(propertyService).createProperty(any(CreatePropertyRequest.class));
    }
    
    @Test
    @DisplayName("Should return 400 when request is invalid")
    void shouldReturn400WhenRequestIsInvalid() throws Exception {
        // Arrange
        CreatePropertyRequest request = new CreatePropertyRequest(
            "", // Invalid empty address
            new BigDecimal("-100"), // Invalid negative price
            null, // Invalid null landlord ID
            null
        );
        
        // Act & Assert
        mockMvc.perform(post("/api/v1/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors").exists());
        
        verifyNoInteractions(propertyService);
    }
    
    @Test
    @DisplayName("Should get property by ID")
    void shouldGetPropertyById() throws Exception {
        // Arrange
        UUID propertyId = UUID.randomUUID();
        RentalProperty property = RentalProperty.create(
            "123 Main St",
            new BigDecimal("1500.00"),
            UUID.randomUUID(),
            Set.of("Parking")
        );
        
        when(propertyService.getPropertyById(propertyId))
            .thenReturn(property);
        
        // Act & Assert
        mockMvc.perform(get("/api/v1/properties/{id}", propertyId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(property.getId().toString()))
            .andExpect(jsonPath("$.address").value(property.getAddress()));
        
        verify(propertyService).getPropertyById(propertyId);
    }
    
    @Test
    @DisplayName("Should return 404 when property not found")
    void shouldReturn404WhenPropertyNotFound() throws Exception {
        // Arrange
        UUID propertyId = UUID.randomUUID();
        
        when(propertyService.getPropertyById(propertyId))
            .thenThrow(new PropertyNotFoundException("Property not found"));
        
        // Act & Assert
        mockMvc.perform(get("/api/v1/properties/{id}", propertyId))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Property not found"));
        
        verify(propertyService).getPropertyById(propertyId);
    }
}
```

---

## 🚀 **DESPLIEGUE EN LA NUBE PARA SPRING**

### **1. Kubernetes para Aplicación Spring**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: rental-system
```

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: rental-system-config
  namespace: rental-system
data:
  SPRING_PROFILES_ACTIVE: "prod"
  SPRING_DATASOURCE_URL: "jdbc:postgresql://postgres-service:5432/rental_system"
  SPRING_REDIS_HOST: "redis-service"
  SPRING_KAFKA_BOOTSTRAP_SERVERS: "kafka-service:9092"
  LOGGING_LEVEL_ROOT: "INFO"
  LOGGING_LEVEL_COM_SYSTEMDESIGN: "DEBUG"
```

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: rental-system-secrets
  namespace: rental-system
type: Opaque
data:
  SPRING_DATASOURCE_PASSWORD: cGFzc3dvcmQ= # base64 encoded
  SPRING_REDIS_PASSWORD: cGFzc3dvcmQ= # base64 encoded
  JWT_SECRET: eW91ci1zZWNyZXQta2V5 # base64 encoded
```

```yaml
# k8s/rental-properties-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rental-properties-deployment
  namespace: rental-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rental-properties
  template:
    metadata:
      labels:
        app: rental-properties
    spec:
      containers:
      - name: rental-properties
        image: your-registry/rental-properties:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          valueFrom:
            configMapKeyRef:
              name: rental-system-config
              key: SPRING_PROFILES_ACTIVE
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            configMapKeyRef:
              name: rental-system-config
              key: SPRING_DATASOURCE_URL
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: rental-system-secrets
              key: SPRING_DATASOURCE_PASSWORD
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

### **2. CI/CD Pipeline para Spring**

```yaml
# .github/workflows/spring-deploy.yml
name: Spring System Design Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle
    
    - name: Run tests
      run: ./gradlew test
    
    - name: Run integration tests
      run: ./gradlew integrationTest
    
    - name: Run security scan
      run: ./gradlew dependencyCheckAnalyze

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle
    
    - name: Build application
      run: ./gradlew build -x test
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Rental Properties Service
      uses: docker/build-push-action@v4
      with:
        context: ./rental-properties-service
        file: ./rental-properties-service/Dockerfile
        push: true
        tags: your-username/rental-properties:latest
    
    - name: Build and push Rental Proposals Service
      uses: docker/build-push-action@v4
      with:
        context: ./rental-proposals-service
        file: ./rental-proposals-service/Dockerfile
        push: true
        tags: your-username/rental-proposals:latest
    
    - name: Build and push Payments Service
      uses: docker/build-push-action@v4
      with:
        context: ./payments-service
        file: ./payments-service/Dockerfile
        push: true
        tags: your-username/payments:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: apply -f k8s/
```

---

## 🎯 **MEJORES PRÁCTICAS PARA SPRING**

### **1. Seguridad Avanzada**

```java
// src/main/java/com/systemdesign/shared/security/SecurityConfig.java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/properties/**").authenticated()
                .requestMatchers("/api/v1/proposals/**").authenticated()
                .requestMatchers("/api/v1/payments/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

// src/main/java/com/systemdesign/shared/security/JwtAuthenticationFilter.java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    
    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, 
                                 UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String userId = tokenProvider.getUserIdFromJWT(jwt);
                UserDetails userDetails = userDetailsService.loadUserById(userId);
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### **2. Performance Optimization**

```java
// src/main/java/com/systemdesign/shared/cache/CacheConfig.java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(redisConnectionFactory)
            .cacheDefaults(config)
            .withCacheConfiguration("properties", 
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(15)))
            .withCacheConfiguration("proposals", 
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(10)))
            .build();
    }
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        
        template.afterPropertiesSet();
        return template;
    }
}

// src/main/java/com/systemdesign/rentalproperties/service/RentalPropertyService.java
@Service
@Transactional
@CacheConfig(cacheNames = "properties")
public class RentalPropertyService {
    
    @Cacheable(key = "#id")
    public RentalProperty getPropertyById(UUID id) {
        return propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found"));
    }
    
    @Cacheable(key = "#criteria.hashCode()")
    public List<RentalProperty> searchProperties(PropertySearchCriteria criteria) {
        return searchService.search(criteria);
    }
    
    @CacheEvict(key = "#property.id")
    public RentalProperty updateProperty(RentalProperty property) {
        return propertyRepository.save(property);
    }
    
    @CacheEvict(allEntries = true)
    public void clearCache() {
        // Method to clear all cache entries
    }
}
```

---

*¡Esta guía completa integra todos los conceptos avanzados para crear sistemas escalables con Spring y las mejores prácticas empresariales!* 🚀✨ 