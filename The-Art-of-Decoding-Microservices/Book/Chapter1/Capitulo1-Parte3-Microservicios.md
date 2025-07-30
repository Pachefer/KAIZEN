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
// Este es un ejemplo completo de un microservicio que maneja la gestión de usuarios
// Demuestra los principios clave de microservicios: responsabilidad única, acoplamiento suelto,
// y despliegue independiente

// Anotación principal de Spring Boot que configura automáticamente la aplicación
// @SpringBootApplication combina @Configuration, @EnableAutoConfiguration y @ComponentScan
@SpringBootApplication
// Habilita el cliente de descubrimiento de servicios (Eureka, Consul, etc.)
// Permite que este servicio se registre y descubra otros servicios
@EnableDiscoveryClient
public class UsuarioServiceApplication {
    
    /**
     * Método principal que inicia la aplicación Spring Boot
     * Este es el punto de entrada de la aplicación
     * @param args Argumentos de línea de comandos pasados al programa
     */
    public static void main(String[] args) {
        // SpringApplication.run() inicia el contexto de Spring y arranca el servidor embebido
        // La aplicación se ejecutará en el puerto configurado (por defecto 8080)
        SpringApplication.run(UsuarioServiceApplication.class, args);
    }
}

// Controlador REST que maneja las peticiones HTTP relacionadas con usuarios
// @RestController combina @Controller y @ResponseBody para respuestas JSON automáticas
@RestController
// Define la ruta base para todos los endpoints de este controlador
// Todas las URLs comenzarán con /api/usuarios
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    // Inyección de dependencias del servicio de usuarios
    // @Autowired le dice a Spring que inyecte una instancia de UsuarioService
    @Autowired
    private UsuarioService usuarioService;  // Servicio que contiene la lógica de negocio
    
    /**
     * Endpoint GET para obtener un usuario por su ID
     * @param id ID único del usuario a buscar
     * @return ResponseEntity con el usuario si se encuentra, o 404 si no existe
     */
    @GetMapping("/{id}")  // Mapea peticiones GET a /api/usuarios/{id}
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        // Llama al servicio para obtener el usuario por ID
        Usuario usuario = usuarioService.obtenerUsuario(id);
        
        // Verifica si el usuario existe
        if (usuario != null) {
            // Retorna 200 OK con el usuario en el cuerpo de la respuesta
            return ResponseEntity.ok(usuario);
        }
        // Retorna 404 Not Found si el usuario no existe
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Endpoint POST para crear un nuevo usuario
     * @param usuario Datos del usuario a crear (viene en el cuerpo de la petición)
     * @return ResponseEntity con el usuario creado y código 201 Created
     */
    @PostMapping  // Mapea peticiones POST a /api/usuarios
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        // Llama al servicio para crear el usuario
        Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
        // Retorna 201 Created con el usuario creado en el cuerpo de la respuesta
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
    
    /**
     * Endpoint PUT para actualizar un usuario existente
     * @param id ID del usuario a actualizar
     * @param usuario Nuevos datos del usuario
     * @return ResponseEntity con el usuario actualizado o 404 si no existe
     */
    @PutMapping("/{id}")  // Mapea peticiones PUT a /api/usuarios/{id}
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        // Llama al servicio para actualizar el usuario
        Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
        
        // Verifica si la actualización fue exitosa
        if (usuarioActualizado != null) {
            // Retorna 200 OK con el usuario actualizado
            return ResponseEntity.ok(usuarioActualizado);
        }
        // Retorna 404 Not Found si el usuario no existe
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Endpoint DELETE para eliminar un usuario
     * @param id ID del usuario a eliminar
     * @return ResponseEntity con código 204 No Content si se elimina, o 404 si no existe
     */
    @DeleteMapping("/{id}")  // Mapea peticiones DELETE a /api/usuarios/{id}
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        // Llama al servicio para eliminar el usuario
        boolean eliminado = usuarioService.eliminarUsuario(id);
        
        // Verifica si la eliminación fue exitosa
        if (eliminado) {
            // Retorna 204 No Content (sin cuerpo de respuesta)
            return ResponseEntity.noContent().build();
        }
        // Retorna 404 Not Found si el usuario no existe
        return ResponseEntity.notFound().build();
    }
}

// Servicio de usuarios que contiene la lógica de negocio
// @Service marca esta clase como un servicio de Spring que puede ser inyectado
@Service
public class UsuarioService {
    
    // Inyección del repositorio de usuarios para acceso a datos
    // @Autowired le dice a Spring que inyecte una instancia de UsuarioRepository
    @Autowired
    private UsuarioRepository usuarioRepository;  // Capa de acceso a datos
    
    // Inyección de RestTemplate para comunicación con otros microservicios
    // Permite hacer llamadas HTTP a otros servicios
    @Autowired
    private RestTemplate restTemplate;  // Cliente HTTP para comunicación entre servicios
    
    /**
     * Obtiene un usuario por su ID
     * @param id ID único del usuario a buscar
     * @return Usuario si se encuentra, null si no existe
     */
    public Usuario obtenerUsuario(Long id) {
        // Busca el usuario en la base de datos usando el repositorio
        // findById() retorna un Optional, orElse(null) retorna null si no se encuentra
        return usuarioRepository.findById(id).orElse(null);
    }
    
    /**
     * Crea un nuevo usuario con validaciones
     * @param usuario Datos del usuario a crear
     * @return Usuario creado y guardado en la base de datos
     * @throws IllegalArgumentException si faltan datos requeridos
     * @throws RuntimeException si el email ya está registrado
     */
    public Usuario crearUsuario(Usuario usuario) {
        // VALIDACIÓN 1: Verificar que los campos obligatorios no sean null
        // Esta validación previene errores de base de datos y asegura integridad de datos
        if (usuario.getEmail() == null || usuario.getNombre() == null) {
            throw new IllegalArgumentException("Email y nombre son requeridos");
        }
        
        // VALIDACIÓN 2: Verificar que el email no esté duplicado
        // findByEmail() busca en la base de datos si ya existe un usuario con ese email
        // isPresent() retorna true si se encuentra un usuario con ese email
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Si todas las validaciones pasan, guarda el usuario en la base de datos
        // save() persiste el usuario y retorna la entidad con el ID generado
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

## 📊 **RESULTADOS ESPERADOS Y MANEJO DE ERRORES**

### **🎯 Casos de Éxito Esperados**

#### **1. Creación Exitosa de Usuario**
```java
// ENTRADA
POST /api/usuarios
{
    "nombre": "Juan Pérez",
    "email": "juan.perez@email.com",
    "password": "password123"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 201 Created
{
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@email.com",
    "password": "$2a$10$hashedPassword...",
    "estado": "ACTIVO",
    "fechaCreacion": "2024-01-15T10:30:00",
    "fechaActualizacion": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA:
// ✅ Validación de campos requeridos
// ✅ Verificación de email único
// ✅ Encriptación de password con BCrypt
// ✅ Asignación de estado ACTIVO
// ✅ Generación automática de fechas
// ✅ Persistencia en base de datos
// ✅ Respuesta HTTP 201 con usuario creado
```

#### **2. Obtención Exitosa de Usuario**
```java
// ENTRADA
GET /api/usuarios/1

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@email.com",
    "estado": "ACTIVO",
    "fechaCreacion": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA:
// ✅ Búsqueda en base de datos por ID
// ✅ Usuario encontrado
// ✅ Serialización a JSON
// ✅ Respuesta HTTP 200
```

#### **3. Actualización Exitosa de Usuario**
```java
// ENTRADA
PUT /api/usuarios/1
{
    "nombre": "Juan Carlos Pérez",
    "email": "juan.carlos@email.com"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "id": 1,
    "nombre": "Juan Carlos Pérez",
    "email": "juan.carlos@email.com",
    "estado": "ACTIVO",
    "fechaCreacion": "2024-01-15T10:30:00",
    "fechaActualizacion": "2024-01-15T11:45:00"
}

// LÓGICA EJECUTADA:
// ✅ Validación de existencia del usuario
// ✅ Actualización de campos
// ✅ Actualización automática de fechaActualizacion
// ✅ Persistencia en base de datos
// ✅ Respuesta HTTP 200 con usuario actualizado
```

#### **4. Eliminación Exitosa de Usuario**
```java
// ENTRADA
DELETE /api/usuarios/1

// RESULTADO ESPERADO - ÉXITO
HTTP 204 No Content

// LÓGICA EJECUTADA:
// ✅ Verificación de existencia del usuario
// ✅ Eliminación de la base de datos
// ✅ Respuesta HTTP 204 (sin contenido)
```

#### **5. Obtención de Usuario con Perfil**
```java
// ENTRADA
GET /api/usuarios/1/con-perfil

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
{
    "usuario": {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "juan.perez@email.com"
    },
    "perfil": {
        "id": 1,
        "biografia": "Desarrollador Java",
        "ubicacion": "Madrid, España",
        "sitioWeb": "https://juanperez.dev"
    }
}

// LÓGICA EJECUTADA:
// ✅ Obtención de usuario principal
// ✅ Llamada síncrona al microservicio de perfiles
// ✅ Combinación de datos
// ✅ Respuesta HTTP 200 con datos completos
```

### **❌ Casos de Error Esperados**

#### **1. Error de Validación - Campos Requeridos**
```java
// ENTRADA INVÁLIDA
POST /api/usuarios
{
    "nombre": "",
    "email": null,
    "password": "123"
}

// RESULTADO ESPERADO - ERROR
HTTP 400 Bad Request
{
    "error": "VALIDATION_ERROR",
    "message": "Email y nombre son requeridos",
    "timestamp": "2024-01-15T10:30:00",
    "path": "/api/usuarios"
}

// LÓGICA EJECUTADA:
// ❌ Validación falla en campos requeridos
// ❌ IllegalArgumentException lanzada
// ❌ ControllerAdvice captura la excepción
// ❌ Respuesta HTTP 400 con detalles del error
```

#### **2. Error de Validación - Email Duplicado**
```java
// ENTRADA INVÁLIDA (email ya existe)
POST /api/usuarios
{
    "nombre": "María García",
    "email": "juan.perez@email.com", // Email ya registrado
    "password": "password456"
}

// RESULTADO ESPERADO - ERROR
HTTP 409 Conflict
{
    "error": "DUPLICATE_EMAIL",
    "message": "El email ya está registrado",
    "timestamp": "2024-01-15T10:30:00",
    "path": "/api/usuarios"
}

// LÓGICA EJECUTADA:
// ❌ Verificación de email único falla
// ❌ RuntimeException lanzada
// ❌ ControllerAdvice captura la excepción
// ❌ Respuesta HTTP 409 (Conflict)
```

#### **3. Error de Recurso No Encontrado**
```java
// ENTRADA INVÁLIDA (usuario no existe)
GET /api/usuarios/999

// RESULTADO ESPERADO - ERROR
HTTP 404 Not Found
{
    "error": "USER_NOT_FOUND",
    "message": "Usuario con ID 999 no encontrado",
    "timestamp": "2024-01-15T10:30:00",
    "path": "/api/usuarios/999"
}

// LÓGICA EJECUTADA:
// ❌ Búsqueda en base de datos no encuentra usuario
// ❌ Método retorna null
// ❌ Controller retorna ResponseEntity.notFound()
// ❌ Respuesta HTTP 404
```

#### **4. Error de Servicio Externo No Disponible**
```java
// ENTRADA
GET /api/usuarios/1/con-perfil

// RESULTADO ESPERADO - ERROR PARCIAL
HTTP 200 OK
{
    "usuario": {
        "id": 1,
        "nombre": "Juan Pérez",
        "email": "juan.perez@email.com"
    },
    "perfil": null
}

// LÓGICA EJECUTADA:
// ✅ Usuario principal obtenido exitosamente
// ❌ Llamada al microservicio de perfiles falla
// ❌ Exception capturada y loggeada
// ❌ Respuesta parcial con perfil null
// ✅ Respuesta HTTP 200 (no falla completamente)
```

#### **5. Error de Base de Datos**
```java
// ENTRADA
POST /api/usuarios
{
    "nombre": "Test User",
    "email": "test@email.com",
    "password": "password123"
}

// RESULTADO ESPERADO - ERROR
HTTP 500 Internal Server Error
{
    "error": "DATABASE_ERROR",
    "message": "Error de conexión a la base de datos",
    "timestamp": "2024-01-15T10:30:00",
    "path": "/api/usuarios"
}

// LÓGICA EJECUTADA:
// ❌ Persistencia en base de datos falla
// ❌ DataAccessException lanzada
// ❌ ControllerAdvice captura la excepción
// ❌ Respuesta HTTP 500
```

### **🔧 Manejo de Errores Implementado**

#### **1. Excepciones Personalizadas**
```java
// Excepciones específicas del dominio
public class UsuarioNoEncontradoException extends RuntimeException {
    public UsuarioNoEncontradoException(String message) {
        super(message);
    }
}

public class EmailDuplicadoException extends RuntimeException {
    public EmailDuplicadoException(String message) {
        super(message);
    }
}
```

#### **2. ControllerAdvice para Manejo Global**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleValidationError(IllegalArgumentException e) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", e.getMessage()));
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleBusinessError(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("BUSINESS_ERROR", e.getMessage()));
    }
    
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseError(DataAccessException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("DATABASE_ERROR", "Error de base de datos"));
    }
}
```

#### **3. Logging y Monitoreo**
```java
// Logging estructurado para debugging
logger.info("Usuario creado exitosamente: {}", usuario.getId());
logger.error("Error al crear usuario: {}", e.getMessage(), e);
logger.warn("Intento de crear usuario con email duplicado: {}", email);
```

### **📈 Métricas de Performance Esperadas**

#### **Tiempos de Respuesta:**
- **Creación de Usuario:** 100-300ms
- **Obtención de Usuario:** 50-150ms
- **Actualización de Usuario:** 100-250ms
- **Eliminación de Usuario:** 80-200ms
- **Usuario con Perfil:** 200-500ms (incluye llamada externa)

#### **Throughput:**
- **Operaciones por segundo:** 1000-3000 req/seg
- **Usuarios concurrentes:** 500-1500
- **Latencia p95:** < 500ms
- **Latencia p99:** < 1000ms

#### **Disponibilidad:**
- **Uptime esperado:** 99.9%
- **Tiempo de recuperación:** < 30 segundos
- **Tolerancia a fallos:** Circuit breaker implementado

### **🛡️ Estrategias de Resiliencia**

#### **1. Circuit Breaker Pattern**
```java
// Implementación con Resilience4j
@CircuitBreaker(name = "perfilService", fallbackMethod = "getPerfilFallback")
public Perfil getPerfil(Long userId) {
    return restTemplate.getForObject("/api/perfiles/" + userId, Perfil.class);
}

public Perfil getPerfilFallback(Long userId, Exception e) {
    logger.warn("Fallback ejecutado para usuario: {}", userId);
    return null; // Retorna perfil vacío en caso de fallo
}
```

#### **2. Retry Pattern**
```java
// Reintentos automáticos para operaciones transitorias
@Retry(name = "databaseRetry", fallbackMethod = "saveUserFallback")
public Usuario saveUser(Usuario usuario) {
    return usuarioRepository.save(usuario);
}
```

#### **3. Timeout Configuration**
```java
// Timeouts para evitar bloqueos indefinidos
@Bean
public RestTemplate restTemplate() {
    return RestTemplateBuilder()
        .setConnectTimeout(Duration.ofSeconds(5))
        .setReadTimeout(Duration.ofSeconds(10))
        .build();
}
```

### **🧪 Pruebas Unitarias Esperadas**

#### **Casos de Prueba Exitosos:**
```java
@Test
void crearUsuario_ConDatosValidos_DeberiaCrearUsuario() {
    // Given
    UsuarioRequest request = new UsuarioRequest("Test", "test@email.com", "password");
    
    // When
    Usuario resultado = usuarioService.crearUsuario(request);
    
    // Then
    assertThat(resultado).isNotNull();
    assertThat(resultado.getEmail()).isEqualTo("test@email.com");
    assertThat(resultado.getEstado()).isEqualTo(EstadoUsuario.ACTIVO);
    verify(usuarioRepository).save(any(Usuario.class));
}
```

#### **Casos de Prueba de Error:**
```java
@Test
void crearUsuario_ConEmailDuplicado_DeberiaLanzarExcepcion() {
    // Given
    UsuarioRequest request = new UsuarioRequest("Test", "existing@email.com", "password");
    when(usuarioRepository.findByEmail("existing@email.com"))
        .thenReturn(Optional.of(new Usuario()));
    
    // When & Then
    assertThatThrownBy(() -> usuarioService.crearUsuario(request))
        .isInstanceOf(RuntimeException.class)
        .hasMessage("El email ya está registrado");
}
```

Esta implementación garantiza un manejo robusto de errores, alta disponibilidad y performance predecible del microservicio de usuarios. 