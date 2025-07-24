# Capítulo 1 (Parte 3): Arquitectura de Microservicios

## Arquitectura de Microservicios

La arquitectura de microservicios es como romper tu aplicación grande y torpe en una serie de piezas más pequeñas y del tamaño de un bocado, cada pieza haciendo su propio trabajo, pero todas trabajando juntas para hacer que todo funcione sin problemas. Cada servicio corresponde a una función de negocio específica, y se comunican entre sí a través de APIs bien definidas.

### Principios Clave de Microservicios

1. **Responsabilidad Única**: Cada servicio tiene un trabajo y solo un trabajo. Se mantiene en su carril, su mente alrededor de una sola función de negocio.

2. **Acoplamiento Suelto**: Los microservicios no comparten cuentas bancarias conjuntas. Se mantienen solos, cada uno haciendo su negocio y dejando a sus vecinos solos.

3. **Despliegue Independiente**: ¿Quieres actualizar o parchear un servicio? Adelante. Juego por juego, un microservicio a la vez, significa que los cambios se pueden hacer sin un gran drama y pueden desplegarse mucho más rápidamente.

4. **Gestión de Datos Descentralizada**: Si cada microservicio tiene su propia base de datos, evita un punto único de falla.

5. **Infraestructura Automatizada**: Cuando muchos microservicios están corriendo, la infraestructura automatizada es tu mejor amigo.

6. **Resiliencia**: Los microservicios saben cómo rodar con los golpes. Cuando uno falla, las salvaguardas integradas como circuit breakers y reintentos saltan a la acción.

### Ejemplo Completo de Microservicios

```java
// Microservicio de Usuarios
@SpringBootApplication
@EnableDiscoveryClient
public class UsuarioServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UsuarioServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioService.obtenerUsuario(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
        if (usuarioActualizado != null) {
            return ResponseEntity.ok(usuarioActualizado);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        boolean eliminado = usuarioService.eliminarUsuario(id);
        if (eliminado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Usuario obtenerUsuario(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }
    
    public Usuario crearUsuario(Usuario usuario) {
        // Validar datos
        if (usuario.getEmail() == null || usuario.getNombre() == null) {
            throw new IllegalArgumentException("Email y nombre son requeridos");
        }
        
        // Verificar si el email ya existe
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        return usuarioRepository.save(usuario);
    }
    
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        return usuarioRepository.findById(id)
                .map(existente -> {
                    existente.setNombre(usuario.getNombre());
                    existente.setEmail(usuario.getEmail());
                    return usuarioRepository.save(existente);
                })
                .orElse(null);
    }
    
    public boolean eliminarUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public UsuarioConPerfil obtenerUsuarioConPerfil(Long id) {
        Usuario usuario = obtenerUsuario(id);
        if (usuario == null) {
            return null;
        }
        
        // Llamar al microservicio de perfiles
        try {
            ResponseEntity<Perfil> respuesta = restTemplate.getForEntity(
                "http://perfil-service/api/perfiles/" + id, 
                Perfil.class
            );
            
            if (respuesta.getStatusCode() == HttpStatus.OK) {
                return new UsuarioConPerfil(usuario, respuesta.getBody());
            }
        } catch (Exception e) {
            // Log del error pero no fallar completamente
            System.err.println("Error obteniendo perfil: " + e.getMessage());
        }
        
        return new UsuarioConPerfil(usuario, null);
    }
}

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    private EstadoUsuario estado = EstadoUsuario.ACTIVO;
    
    @CreatedDate
    private LocalDateTime fechaCreacion;
    
    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
    
    // Constructores, getters y setters
    public Usuario() {}
    
    public Usuario(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public EstadoUsuario getEstado() { return estado; }
    public void setEstado(EstadoUsuario estado) { this.estado = estado; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}

public enum EstadoUsuario {
    ACTIVO, INACTIVO, SUSPENDIDO
}

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByEstado(EstadoUsuario estado);
    boolean existsByEmail(String email);
}

// Microservicio de Productos
@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<Page<Producto>> obtenerProductos(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamano) {
        
        Pageable pageable = PageRequest.of(pagina, tamano);
        Page<Producto> productos = productoService.obtenerProductos(pageable);
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        Producto producto = productoService.obtenerProducto(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoService.crearProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }
    
    @PutMapping("/{id}/stock")
    public ResponseEntity<Producto> actualizarStock(
            @PathVariable Long id, 
            @RequestParam int cantidad) {
        
        Producto producto = productoService.actualizarStock(id, cantidad);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }
}

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public Page<Producto> obtenerProductos(Pageable pageable) {
        return productoRepository.findAll(pageable);
    }
    
    public Producto obtenerProducto(Long id) {
        return productoRepository.findById(id).orElse(null);
    }
    
    public Producto crearProducto(Producto producto) {
        Producto nuevoProducto = productoRepository.save(producto);
        
        // Publicar evento de producto creado
        eventPublisher.publishEvent(new ProductoCreadoEvent(nuevoProducto));
        
        return nuevoProducto;
    }
    
    @Transactional
    public Producto actualizarStock(Long id, int cantidad) {
        return productoRepository.findById(id)
                .map(producto -> {
                    int nuevoStock = producto.getStock() + cantidad;
                    if (nuevoStock < 0) {
                        throw new RuntimeException("Stock no puede ser negativo");
                    }
                    
                    producto.setStock(nuevoStock);
                    Producto actualizado = productoRepository.save(producto);
                    
                    // Publicar evento de stock actualizado
                    eventPublisher.publishEvent(new StockActualizadoEvent(actualizado, cantidad));
                    
                    return actualizado;
                })
                .orElse(null);
    }
}

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(length = 1000)
    private String descripcion;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Enumerated(EnumType.STRING)
    private CategoriaProducto categoria;
    
    @CreatedDate
    private LocalDateTime fechaCreacion;
    
    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
    
    // Constructores, getters y setters
    public Producto() {}
    
    public Producto(String nombre, String descripcion, BigDecimal precio, Integer stock, CategoriaProducto categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    
    public CategoriaProducto getCategoria() { return categoria; }
    public void setCategoria(CategoriaProducto categoria) { this.categoria = categoria; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}

public enum CategoriaProducto {
    ELECTRONICOS, ROPA, LIBROS, HOGAR, DEPORTES
}

// API Gateway
@RestController
@RequestMapping("/api/gateway")
public class ApiGatewayController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private CircuitBreakerFactory circuitBreakerFactory;
    
    @GetMapping("/usuarios/{id}/completo")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioCompleto(@PathVariable Long id) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("usuario-service");
        
        return circuitBreaker.run(() -> {
            Map<String, Object> resultado = new HashMap<>();
            
            // Obtener usuario
            ResponseEntity<Usuario> usuarioResponse = restTemplate.getForEntity(
                "http://usuario-service/api/usuarios/" + id, 
                Usuario.class
            );
            
            if (usuarioResponse.getStatusCode() == HttpStatus.OK) {
                resultado.put("usuario", usuarioResponse.getBody());
                
                // Obtener perfil
                try {
                    ResponseEntity<Perfil> perfilResponse = restTemplate.getForEntity(
                        "http://perfil-service/api/perfiles/" + id, 
                        Perfil.class
                    );
                    if (perfilResponse.getStatusCode() == HttpStatus.OK) {
                        resultado.put("perfil", perfilResponse.getBody());
                    }
                } catch (Exception e) {
                    resultado.put("perfil", null);
                    resultado.put("errorPerfil", "No se pudo obtener el perfil");
                }
                
                // Obtener órdenes recientes
                try {
                    ResponseEntity<List<Orden>> ordenesResponse = restTemplate.getForEntity(
                        "http://orden-service/api/ordenes/usuario/" + id + "/recientes", 
                        new ParameterizedTypeReference<List<Orden>>() {}
                    );
                    if (ordenesResponse.getStatusCode() == HttpStatus.OK) {
                        resultado.put("ordenesRecientes", ordenesResponse.getBody());
                    }
                } catch (Exception e) {
                    resultado.put("ordenesRecientes", new ArrayList<>());
                    resultado.put("errorOrdenes", "No se pudieron obtener las órdenes");
                }
                
                return ResponseEntity.ok(resultado);
            }
            
            return ResponseEntity.notFound().build();
        }, throwable -> {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("error", "Servicio no disponible");
            fallback.put("usuario", null);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallback);
        });
    }
}

// Configuración de Circuit Breaker
@Configuration
public class CircuitBreakerConfig {
    
    @Bean
    public CircuitBreakerFactory circuitBreakerFactory() {
        return new DefaultCircuitBreakerFactory();
    }
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

// Eventos para comunicación asíncrona
public class ProductoCreadoEvent {
    private final Producto producto;
    private final LocalDateTime timestamp;
    
    public ProductoCreadoEvent(Producto producto) {
        this.producto = producto;
        this.timestamp = LocalDateTime.now();
    }
    
    public Producto getProducto() { return producto; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

public class StockActualizadoEvent {
    private final Producto producto;
    private final int cambioStock;
    private final LocalDateTime timestamp;
    
    public StockActualizadoEvent(Producto producto, int cambioStock) {
        this.producto = producto;
        this.cambioStock = cambioStock;
        this.timestamp = LocalDateTime.now();
    }
    
    public Producto getProducto() { return producto; }
    public int getCambioStock() { return cambioStock; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

// Pruebas unitarias para microservicios
@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @Mock
    private RestTemplate restTemplate;
    
    @InjectMocks
    private UsuarioService usuarioService;
    
    @Test
    public void testObtenerUsuario() {
        // Arrange
        Long id = 1L;
        Usuario usuario = new Usuario("Juan", "juan@email.com", "password");
        usuario.setId(id);
        
        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));
        
        // Act
        Usuario resultado = usuarioService.obtenerUsuario(id);
        
        // Assert
        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        assertEquals("juan@email.com", resultado.getEmail());
        verify(usuarioRepository).findById(id);
    }
    
    @Test
    public void testCrearUsuario() {
        // Arrange
        Usuario usuario = new Usuario("Ana", "ana@email.com", "password");
        Usuario usuarioGuardado = new Usuario("Ana", "ana@email.com", "password");
        usuarioGuardado.setId(1L);
        
        when(usuarioRepository.findByEmail("ana@email.com")).thenReturn(Optional.empty());
        when(usuarioRepository.save(usuario)).thenReturn(usuarioGuardado);
        
        // Act
        Usuario resultado = usuarioService.crearUsuario(usuario);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(usuarioRepository).findByEmail("ana@email.com");
        verify(usuarioRepository).save(usuario);
    }
    
    @Test
    public void testCrearUsuarioConEmailDuplicado() {
        // Arrange
        Usuario usuario = new Usuario("Ana", "ana@email.com", "password");
        Usuario usuarioExistente = new Usuario("Otro", "ana@email.com", "password");
        
        when(usuarioRepository.findByEmail("ana@email.com")).thenReturn(Optional.of(usuarioExistente));
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            usuarioService.crearUsuario(usuario);
        });
        
        verify(usuarioRepository).findByEmail("ana@email.com");
        verify(usuarioRepository, never()).save(any());
    }
    
    @Test
    public void testObtenerUsuarioConPerfil() {
        // Arrange
        Long id = 1L;
        Usuario usuario = new Usuario("Juan", "juan@email.com", "password");
        usuario.setId(id);
        
        Perfil perfil = new Perfil();
        perfil.setId(id);
        perfil.setBiografia("Desarrollador de software");
        
        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));
        when(restTemplate.getForEntity(
            eq("http://perfil-service/api/perfiles/" + id), 
            eq(Perfil.class)
        )).thenReturn(ResponseEntity.ok(perfil));
        
        // Act
        UsuarioConPerfil resultado = usuarioService.obtenerUsuarioConPerfil(id);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(usuario, resultado.getUsuario());
        assertEquals(perfil, resultado.getPerfil());
    }
}

@ExtendWith(MockitoExtension.class)
public class ProductoServiceTest {
    
    @Mock
    private ProductoRepository productoRepository;
    
    @Mock
    private ApplicationEventPublisher eventPublisher;
    
    @InjectMocks
    private ProductoService productoService;
    
    @Test
    public void testCrearProducto() {
        // Arrange
        Producto producto = new Producto("Laptop", "Laptop gaming", new BigDecimal("999.99"), 10, CategoriaProducto.ELECTRONICOS);
        Producto productoGuardado = new Producto("Laptop", "Laptop gaming", new BigDecimal("999.99"), 10, CategoriaProducto.ELECTRONICOS);
        productoGuardado.setId(1L);
        
        when(productoRepository.save(producto)).thenReturn(productoGuardado);
        
        // Act
        Producto resultado = productoService.crearProducto(producto);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(productoRepository).save(producto);
        verify(eventPublisher).publishEvent(any(ProductoCreadoEvent.class));
    }
    
    @Test
    public void testActualizarStock() {
        // Arrange
        Long id = 1L;
        Producto producto = new Producto("Laptop", "Laptop gaming", new BigDecimal("999.99"), 10, CategoriaProducto.ELECTRONICOS);
        producto.setId(id);
        
        when(productoRepository.findById(id)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);
        
        // Act
        Producto resultado = productoService.actualizarStock(id, 5);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(15, resultado.getStock());
        verify(productoRepository).findById(id);
        verify(productoRepository).save(producto);
        verify(eventPublisher).publishEvent(any(StockActualizadoEvent.class));
    }
    
    @Test
    public void testActualizarStockNegativo() {
        // Arrange
        Long id = 1L;
        Producto producto = new Producto("Laptop", "Laptop gaming", new BigDecimal("999.99"), 10, CategoriaProducto.ELECTRONICOS);
        producto.setId(id);
        
        when(productoRepository.findById(id)).thenReturn(Optional.of(producto));
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            productoService.actualizarStock(id, -15);
        });
        
        verify(productoRepository).findById(id);
        verify(productoRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }
}

// Clases de soporte
public class UsuarioConPerfil {
    private Usuario usuario;
    private Perfil perfil;
    
    public UsuarioConPerfil(Usuario usuario, Perfil perfil) {
        this.usuario = usuario;
        this.perfil = perfil;
    }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }
}

public class Perfil {
    private Long id;
    private String biografia;
    private String ubicacion;
    private String sitioWeb;
    
    // Constructores, getters y setters
    public Perfil() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBiografia() { return biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }
    
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    
    public String getSitioWeb() { return sitioWeb; }
    public void setSitioWeb(String sitioWeb) { this.sitioWeb = sitioWeb; }
}

public class Orden {
    private Long id;
    private Long usuarioId;
    private List<Producto> productos;
    private BigDecimal total;
    private EstadoOrden estado;
    private LocalDateTime fechaCreacion;
    
    // Constructores, getters y setters
    public Orden() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    
    public List<Producto> getProductos() { return productos; }
    public void setProductos(List<Producto> productos) { this.productos = productos; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public EstadoOrden getEstado() { return estado; }
    public void setEstado(EstadoOrden estado) { this.estado = estado; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}

public enum EstadoOrden {
    PENDIENTE, CONFIRMADA, EN_PROCESO, ENVIADA, ENTREGADA, CANCELADA
}
```

### Beneficios de Microservicios

1. **Escalable**: Puedes escalar servicios individuales en respuesta a la demanda en lugar de escalar toda la aplicación.

2. **Adaptable y Ágil**: Cada equipo puede innovar y desplegar su servicio independientemente, con tiempos de innovación más rápidos y tiempo de llegada al mercado más rápido.

3. **Resiliencia y Aislamiento de Fallas**: Cuando un servicio falla, toda la aplicación no tiene que irse abajo en llamas.

4. **Diversidad Tecnológica**: Diferentes servicios pueden construirse usando diferentes lenguajes o frameworks.

5. **Colaboración Mejorada**: Los equipos pequeños pueden poseer sus propios microservicios y ser más productivos.

### Desafíos de Microservicios

1. **Complejidad**: Cuantos más microservicios tengas, más partes móviles hay.

2. **Consistencia de Datos**: Mantener los datos consistentes a través de múltiples servicios es como pastorear gatos.

3. **Latencia de Red**: Más servicios hablando entre sí significa más oportunidades para retrasos.

4. **Seguridad**: Asegurar la comunicación entre microservicios y gestionar la autenticación puede complicarse.

5. **Sobrecarga Operacional**: Necesitarás tuberías CI/CD fuertes, monitoreo y gestión de infraestructura. 