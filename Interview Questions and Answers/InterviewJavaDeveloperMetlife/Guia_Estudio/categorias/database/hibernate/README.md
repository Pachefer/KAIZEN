# 🗄️ Hibernate - Guía de Estudio Avanzada

## 📋 Índice

1. [Fundamentos de Hibernate](#fundamentos-de-hibernate)
2. [Mapeo de Entidades](#mapeo-de-entidades)
3. [Consultas y HQL](#consultas-y-hql)
4. [Transacciones](#transacciones)
5. [Testing](#testing)
6. [Preguntas de Entrevista](#preguntas-de-entrevista)

---

## 🎯 Fundamentos de Hibernate

### Configuración Básica

```java
// hibernate.cfg.xml - Configuración de Hibernate
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <!-- Configuración de la base de datos -->
        <property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/testdb</property>
        <property name="hibernate.connection.username">root</property>
        <property name="hibernate.connection.password">password</property>
        
        <!-- Configuración de dialecto -->
        <property name="hibernate.dialect">org.hibernate.dialect.MySQL8Dialect</property>
        
        <!-- Configuración de pool de conexiones -->
        <property name="hibernate.c3p0.min_size">5</property>
        <property name="hibernate.c3p0.max_size">20</property>
        <property name="hibernate.c3p0.timeout">300</property>
        
        <!-- Configuración de logging -->
        <property name="hibernate.show_sql">true</property>
        <property name="hibernate.format_sql">true</property>
        
        <!-- Configuración de esquema -->
        <property name="hibernate.hbm2ddl.auto">update</property>
        
        <!-- Mapeo de entidades -->
        <mapping class="com.example.model.User"/>
        <mapping class="com.example.model.Role"/>
    </session-factory>
</hibernate-configuration>
```

### Entidad Básica

```java
// User.java - Entidad básica con Hibernate
package com.example.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity // Marca como entidad JPA/Hibernate
@Table(name = "users") // Nombre de la tabla
public class User {
    
    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;
    
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructor por defecto
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor con parámetros
    public User(String username, String email, String password) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
    // Método para actualizar timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

---

## 🔗 Mapeo de Entidades

### Relaciones

```java
// Order.java - Entidad con relaciones
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true)
    private String orderNumber;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;
    
    // Relación muchos a uno con User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    // Relación uno a muchos con OrderItem
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();
    
    // Método para agregar item
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    // Método para remover item
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}

// OrderItem.java - Entidad relacionada
@Entity
@Table(name = "order_items")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    
    // Relación muchos a uno con Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    // Relación muchos a uno con Product
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
```

---

## 🔍 Consultas y HQL

### DAO con Hibernate

```java
// UserDAO.java - Data Access Object con Hibernate
package com.example.dao;

import com.example.model.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserDAO {
    
    private final SessionFactory sessionFactory;
    
    @Autowired
    public UserDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }
    
    // Método para obtener sesión actual
    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
    
    // Guardar usuario
    public User save(User user) {
        Session session = getCurrentSession();
        session.saveOrUpdate(user);
        return user;
    }
    
    // Buscar por ID
    public Optional<User> findById(Long id) {
        Session session = getCurrentSession();
        User user = session.get(User.class, id);
        return Optional.ofNullable(user);
    }
    
    // Buscar por username usando HQL
    public Optional<User> findByUsername(String username) {
        Session session = getCurrentSession();
        Query<User> query = session.createQuery(
            "FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", username);
        return query.uniqueResultOptional();
    }
    
    // Buscar por email usando Criteria
    public Optional<User> findByEmail(String email) {
        Session session = getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<User> cr = cb.createQuery(User.class);
        Root<User> root = cr.from(User.class);
        
        cr.select(root).where(cb.equal(root.get("email"), email));
        
        Query<User> query = session.createQuery(cr);
        return query.uniqueResultOptional();
    }
    
    // Obtener todos los usuarios
    public List<User> findAll() {
        Session session = getCurrentSession();
        Query<User> query = session.createQuery("FROM User", User.class);
        return query.list();
    }
    
    // Buscar usuarios por nombre usando LIKE
    public List<User> findByUsernameLike(String pattern) {
        Session session = getCurrentSession();
        Query<User> query = session.createQuery(
            "FROM User u WHERE u.username LIKE :pattern", User.class);
        query.setParameter("pattern", "%" + pattern + "%");
        return query.list();
    }
    
    // Contar usuarios
    public long count() {
        Session session = getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(u) FROM User u", Long.class);
        return query.uniqueResult();
    }
    
    // Eliminar usuario
    public boolean deleteById(Long id) {
        Session session = getCurrentSession();
        User user = session.get(User.class, id);
        if (user != null) {
            session.delete(user);
            return true;
        }
        return false;
    }
    
    // Actualizar contraseña
    public boolean updatePassword(Long userId, String newPassword) {
        Session session = getCurrentSession();
        Query query = session.createQuery(
            "UPDATE User u SET u.password = :password WHERE u.id = :id");
        query.setParameter("password", newPassword);
        query.setParameter("id", userId);
        
        int rowsAffected = query.executeUpdate();
        return rowsAffected > 0;
    }
    
    // Buscar usuarios con paginación
    public List<User> findAllWithPagination(int page, int size) {
        Session session = getCurrentSession();
        Query<User> query = session.createQuery("FROM User u ORDER BY u.id", User.class);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        return query.list();
    }
}
```

---

## 💾 Transacciones

### Servicio con Transacciones

```java
// UserService.java - Servicio con manejo de transacciones
package com.example.service;

import com.example.dao.UserDAO;
import com.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserDAO userDAO;
    
    @Autowired
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }
    
    // Método transaccional para crear usuario
    @Transactional
    public User createUser(User user) {
        // Validar datos
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username es requerido");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email es requerido");
        }
        
        // Verificar si el username ya existe
        Optional<User> existingUser = userDAO.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username ya existe: " + user.getUsername());
        }
        
        // Verificar si el email ya existe
        Optional<User> existingEmail = userDAO.findByEmail(user.getEmail());
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email ya existe: " + user.getEmail());
        }
        
        // Guardar usuario
        return userDAO.save(user);
    }
    
    // Método transaccional para actualizar usuario
    @Transactional
    public User updateUser(Long id, User userDetails) {
        Optional<User> userOpt = userDAO.findById(id);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Actualizar campos
            if (userDetails.getUsername() != null) {
                user.setUsername(userDetails.getUsername());
            }
            
            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
            }
            
            if (userDetails.getPassword() != null) {
                user.setPassword(userDetails.getPassword());
            }
            
            return userDAO.save(user);
        } else {
            throw new IllegalArgumentException("Usuario no encontrado con ID: " + id);
        }
    }
    
    // Método transaccional para eliminar usuario
    @Transactional
    public boolean deleteUser(Long id) {
        return userDAO.deleteById(id);
    }
    
    // Método de solo lectura para obtener usuario
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userDAO.findById(id);
    }
    
    // Método de solo lectura para obtener todos los usuarios
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
    
    // Método de solo lectura para buscar usuarios
    @Transactional(readOnly = true)
    public List<User> searchUsers(String query) {
        return userDAO.findByUsernameLike(query);
    }
    
    // Método transaccional para cambiar contraseña
    @Transactional
    public boolean changePassword(Long userId, String newPassword) {
        return userDAO.updatePassword(userId, newPassword);
    }
}
```

---

## 🧪 Testing

### Testing de Hibernate

```java
// UserDAOTest.java - Pruebas del DAO
package com.example.dao;

import com.example.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDAOTest {
    
    @Mock
    private SessionFactory sessionFactory;
    
    @Mock
    private Session session;
    
    @Mock
    private Query<User> query;
    
    @InjectMocks
    private UserDAO userDAO;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        
        when(sessionFactory.getCurrentSession()).thenReturn(session);
    }
    
    @Test
    void save_ShouldSaveUser() {
        // Arrange
        when(session.saveOrUpdate(any(User.class))).thenReturn(1L);
        
        // Act
        User result = userDAO.save(testUser);
        
        // Assert
        assertNotNull(result);
        verify(session).saveOrUpdate(testUser);
    }
    
    @Test
    void findById_WithValidId_ShouldReturnUser() {
        // Arrange
        when(session.get(User.class, 1L)).thenReturn(testUser);
        
        // Act
        Optional<User> result = userDAO.findById(1L);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }
    
    @Test
    void findById_WithInvalidId_ShouldReturnEmpty() {
        // Arrange
        when(session.get(User.class, 999L)).thenReturn(null);
        
        // Act
        Optional<User> result = userDAO.findById(999L);
        
        // Assert
        assertFalse(result.isPresent());
    }
    
    @Test
    void findByUsername_WithValidUsername_ShouldReturnUser() {
        // Arrange
        when(session.createQuery(anyString(), eq(User.class))).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.uniqueResultOptional()).thenReturn(Optional.of(testUser));
        
        // Act
        Optional<User> result = userDAO.findByUsername("testuser");
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }
    
    @Test
    void findAll_ShouldReturnAllUsers() {
        // Arrange
        List<User> users = List.of(testUser);
        when(session.createQuery(anyString(), eq(User.class))).thenReturn(query);
        when(query.list()).thenReturn(users);
        
        // Act
        List<User> result = userDAO.findAll();
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("testuser", result.get(0).getUsername());
    }
    
    @Test
    void deleteById_WithValidId_ShouldReturnTrue() {
        // Arrange
        when(session.get(User.class, 1L)).thenReturn(testUser);
        
        // Act
        boolean result = userDAO.deleteById(1L);
        
        // Assert
        assertTrue(result);
        verify(session).delete(testUser);
    }
    
    @Test
    void deleteById_WithInvalidId_ShouldReturnFalse() {
        // Arrange
        when(session.get(User.class, 999L)).thenReturn(null);
        
        // Act
        boolean result = userDAO.deleteById(999L);
        
        // Assert
        assertFalse(result);
        verify(session, never()).delete(any());
    }
}
```

---

## ❓ Preguntas de Entrevista

### Preguntas Básicas

1. **¿Qué es Hibernate y cuáles son sus ventajas?**
   - ORM (Object-Relational Mapping)
   - Mapeo automático, consultas HQL, transacciones

2. **¿Cuál es la diferencia entre JPA y Hibernate?**
   - JPA es la especificación, Hibernate es la implementación

3. **¿Qué son las anotaciones de mapeo?**
   - @Entity, @Table, @Column, @Id, @GeneratedValue

### Preguntas Intermedias

4. **¿Cómo funcionan las relaciones en Hibernate?**
   - @OneToMany, @ManyToOne, @OneToOne, @ManyToMany

5. **¿Qué es el lazy loading y eager loading?**
   - FetchType.LAZY vs FetchType.EAGER

6. **¿Cómo optimizar consultas en Hibernate?**
   - Índices, consultas nativas, paginación

### Preguntas Avanzadas

7. **¿Cómo manejar transacciones en Hibernate?**
   - @Transactional, Session management, rollback

8. **¿Qué son los estados de las entidades?**
   - Transient, Persistent, Detached, Removed

9. **¿Cómo implementar caching en Hibernate?**
   - First-level cache, Second-level cache, Query cache

---

## 📚 Recursos Adicionales

- [Hibernate Documentation](https://hibernate.org/orm/documentation/)
- [Hibernate User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/)
- [Hibernate Best Practices](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#best-practices)

---

**¡Practica estos conceptos y estarás listo para cualquier entrevista de Hibernate! 🚀** 