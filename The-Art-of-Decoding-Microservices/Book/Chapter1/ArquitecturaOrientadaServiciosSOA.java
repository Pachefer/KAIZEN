// Interfaz del servicio
public interface ServicioUsuario {
    Usuario obtenerUsuario(int id);
    List<Usuario> buscarUsuarios(String criterio);
    void crearUsuario(Usuario usuario);
    void actualizarUsuario(Usuario usuario);
    void eliminarUsuario(int id);
}

// Implementación del servicio
public class ServicioUsuarioImpl implements ServicioUsuario {
    private Database database;
    private Logger logger;
    
    public ServicioUsuarioImpl(Database database, Logger logger) {
        this.database = database;
        this.logger = logger;
    }
    
    @Override
    public Usuario obtenerUsuario(int id) {
        logger.info("Obteniendo usuario con ID: " + id);
        return database.buscarUsuario(id);
    }
    
    @Override
    public List<Usuario> buscarUsuarios(String criterio) {
        logger.info("Buscando usuarios con criterio: " + criterio);
        return database.buscarUsuariosPorCriterio(criterio);
    }
    
    @Override
    public void crearUsuario(Usuario usuario) {
        logger.info("Creando nuevo usuario: " + usuario.getNombre());
        database.guardarUsuario(usuario);
    }
    
    @Override
    public void actualizarUsuario(Usuario usuario) {
        logger.info("Actualizando usuario: " + usuario.getId());
        database.actualizarUsuario(usuario);
    }
    
    @Override
    public void eliminarUsuario(int id) {
        logger.info("Eliminando usuario con ID: " + id);
        database.eliminarUsuario(id);
    }
}

// Servicio de autenticación
public interface ServicioAutenticacion {
    String autenticar(String username, String password);
    boolean validarToken(String token);
    void cerrarSesion(String token);
}

public class ServicioAutenticacionImpl implements ServicioAutenticacion {
    private Map<String, String> tokens = new ConcurrentHashMap<>();
    private Logger logger;
    
    public ServicioAutenticacionImpl(Logger logger) {
        this.logger = logger;
    }
    
    @Override
    public String autenticar(String username, String password) {
        logger.info("Intentando autenticar usuario: " + username);
        
        // Simulación de autenticación
        if ("admin".equals(username) && "password".equals(password)) {
            String token = UUID.randomUUID().toString();
            tokens.put(token, username);
            logger.info("Usuario autenticado exitosamente: " + username);
            return token;
        }
        
        logger.warning("Autenticación fallida para usuario: " + username);
        return null;
    }
    
    @Override
    public boolean validarToken(String token) {
        boolean valido = tokens.containsKey(token);
        logger.info("Validando token: " + token + " - Resultado: " + valido);
        return valido;
    }
    
    @Override
    public void cerrarSesion(String token) {
        tokens.remove(token);
        logger.info("Sesión cerrada para token: " + token);
    }
}

// Bus de servicios empresariales (ESB)
public class EnterpriseServiceBus {
    private Map<String, Object> servicios = new ConcurrentHashMap<>();
    private List<Interceptor> interceptores = new ArrayList<>();
    private Logger logger;
    
    public EnterpriseServiceBus(Logger logger) {
        this.logger = logger;
    }
    
    public void registrarServicio(String nombre, Object servicio) {
        servicios.put(nombre, servicio);
        logger.info("Servicio registrado: " + nombre);
    }
    
    public Object obtenerServicio(String nombre) {
        Object servicio = servicios.get(nombre);
        if (servicio == null) {
            logger.error("Servicio no encontrado: " + nombre);
            throw new RuntimeException("Servicio no encontrado: " + nombre);
        }
        return servicio;
    }
    
    public void agregarInterceptor(Interceptor interceptor) {
        interceptores.add(interceptor);
        logger.info("Interceptor agregado: " + interceptor.getClass().getSimpleName());
    }
    
    public Object invocarServicio(String nombreServicio, String metodo, Object... parametros) {
        logger.info("Invocando servicio: " + nombreServicio + "." + metodo);
        
        // Ejecutar interceptores antes
        for (Interceptor interceptor : interceptores) {
            interceptor.antes(nombreServicio, metodo, parametros);
        }
        
        try {
            Object servicio = obtenerServicio(nombreServicio);
            // Aquí se usaría reflexión para invocar el método
            Object resultado = simularInvocacion(servicio, metodo, parametros);
            
            // Ejecutar interceptores después
            for (Interceptor interceptor : interceptores) {
                interceptor.despues(nombreServicio, metodo, resultado);
            }
            
            return resultado;
        } catch (Exception e) {
            logger.error("Error invocando servicio: " + e.getMessage());
            throw new RuntimeException("Error invocando servicio", e);
        }
    }
    
    private Object simularInvocacion(Object servicio, String metodo, Object... parametros) {
        // Simulación de invocación de método
        if (servicio instanceof ServicioUsuario && "obtenerUsuario".equals(metodo)) {
            return new Usuario(1, "Usuario Ejemplo", "usuario@ejemplo.com");
        }
        return null;
    }
}

// Interceptor para logging y monitoreo
public interface Interceptor {
    void antes(String servicio, String metodo, Object[] parametros);
    void despues(String servicio, String metodo, Object resultado);
}

public class LoggingInterceptor implements Interceptor {
    private Logger logger;
    
    public LoggingInterceptor(Logger logger) {
        this.logger = logger;
    }
    
    @Override
    public void antes(String servicio, String metodo, Object[] parametros) {
        logger.info("ANTES - Servicio: " + servicio + ", Método: " + metodo);
    }
    
    @Override
    public void despues(String servicio, String metodo, Object resultado) {
        logger.info("DESPUÉS - Servicio: " + servicio + ", Método: " + metodo + ", Resultado: " + resultado);
    }
}

// Cliente SOA
public class ClienteSOA {
    private EnterpriseServiceBus esb;
    
    public ClienteSOA(EnterpriseServiceBus esb) {
        this.esb = esb;
    }
    
    public Usuario obtenerUsuario(int id) {
        return (Usuario) esb.invocarServicio("servicioUsuario", "obtenerUsuario", id);
    }
    
    public String autenticar(String username, String password) {
        return (String) esb.invocarServicio("servicioAutenticacion", "autenticar", username, password);
    }
}

// Pruebas unitarias para SOA
public class SOATest {
    
    @Test
    public void testRegistroYObtencionServicio() {
        Logger logger = Logger.getLogger("SOATest");
        EnterpriseServiceBus esb = new EnterpriseServiceBus(logger);
        
        ServicioUsuario servicioUsuario = new ServicioUsuarioImpl(new Database(), logger);
        esb.registrarServicio("servicioUsuario", servicioUsuario);
        
        Object servicio = esb.obtenerServicio("servicioUsuario");
        assertNotNull(servicio);
        assertTrue(servicio instanceof ServicioUsuario);
    }
    
    @Test
    public void testInvocacionConInterceptor() {
        Logger logger = Logger.getLogger("SOATest");
        EnterpriseServiceBus esb = new EnterpriseServiceBus(logger);
        
        // Registrar servicios
        esb.registrarServicio("servicioUsuario", new ServicioUsuarioImpl(new Database(), logger));
        esb.registrarServicio("servicioAutenticacion", new ServicioAutenticacionImpl(logger));
        
        // Agregar interceptor
        esb.agregarInterceptor(new LoggingInterceptor(logger));
        
        // Crear cliente y probar
        ClienteSOA cliente = new ClienteSOA(esb);
        Usuario usuario = cliente.obtenerUsuario(1);
        
        assertNotNull(usuario);
        assertEquals("Usuario Ejemplo", usuario.getNombre());
    }
    
    @Test
    public void testAutenticacion() {
        Logger logger = Logger.getLogger("SOATest");
        ServicioAutenticacion servicio = new ServicioAutenticacionImpl(logger);
        
        String token = servicio.autenticar("admin", "password");
        assertNotNull(token);
        
        boolean valido = servicio.validarToken(token);
        assertTrue(valido);
        
        servicio.cerrarSesion(token);
        valido = servicio.validarToken(token);
        assertFalse(valido);
    }
}

// Clases de soporte
class Usuario {
    private int id;
    private String nombre;
    private String email;
    
    public Usuario(int id, String nombre, String email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }
    
    // Getters
    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
}

class Database {
    public Usuario buscarUsuario(int id) {
        return new Usuario(id, "Usuario " + id, "usuario" + id + "@ejemplo.com");
    }
    
    public List<Usuario> buscarUsuariosPorCriterio(String criterio) {
        return Arrays.asList(
            new Usuario(1, "Juan", "juan@ejemplo.com"),
            new Usuario(2, "Ana", "ana@ejemplo.com")
        );
    }
    
    public void guardarUsuario(Usuario usuario) {
        System.out.println("Guardando usuario: " + usuario.getNombre());
    }
    
    public void actualizarUsuario(Usuario usuario) {
        System.out.println("Actualizando usuario: " + usuario.getNombre());
    }
    
    public void eliminarUsuario(int id) {
        System.out.println("Eliminando usuario con ID: " + id);
    }
}

class Logger {
    private String nombre;
    
    public Logger(String nombre) {
        this.nombre = nombre;
    }
    
    public void info(String mensaje) {
        System.out.println("[INFO][" + nombre + "] " + mensaje);
    }
    
    public void warning(String mensaje) {
        System.out.println("[WARNING][" + nombre + "] " + mensaje);
    }
    
    public void error(String mensaje) {
        System.err.println("[ERROR][" + nombre + "] " + mensaje);
    }
}
