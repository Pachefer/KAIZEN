# Capítulo 1 (Parte 2): Arquitectura Cliente-Servidor y SOA

## Arquitectura Cliente-Servidor

La arquitectura cliente-servidor es un modelo fundamental en el mundo de la computación, definiendo la interacción entre dos partes: un cliente y un servidor. Esta arquitectura sustenta gran parte del desarrollo de software moderno, permitiendo sistemas escalables, eficientes y mantenibles.

### Principios de la Arquitectura Cliente-Servidor

La arquitectura cliente-servidor opera bajo un principio simple pero poderoso: la división de deberes entre solicitantes de servicio (clientes) y proveedores de servicio (servidores). Esta separación de responsabilidades permite un desarrollo de aplicaciones más organizado y escalable.

- **Cliente**: El cliente es la entidad que inicia la comunicación enviando solicitudes al servidor. Puede ser un navegador web, una aplicación móvil o cualquier software que requiera datos o servicios.
- **Servidor**: El servidor es la entidad que recibe y procesa solicitudes de clientes, proporcionando los datos o servicios necesarios en respuesta.

### Ejemplo de Arquitectura Cliente-Servidor

```java
// Servidor HTTP simple
import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class ServidorHTTP {
    private ServerSocket serverSocket;
    private ExecutorService executorService;
    private boolean ejecutando = false;
    
    public ServidorHTTP(int puerto) throws IOException {
        this.serverSocket = new ServerSocket(puerto);
        this.executorService = Executors.newFixedThreadPool(10);
        System.out.println("Servidor iniciado en puerto " + puerto);
    }
    
    public void iniciar() {
        ejecutando = true;
        while (ejecutando) {
            try {
                Socket clienteSocket = serverSocket.accept();
                executorService.submit(new ManejadorCliente(clienteSocket));
            } catch (IOException e) {
                if (ejecutando) {
                    System.err.println("Error aceptando conexión: " + e.getMessage());
                }
            }
        }
    }
    
    public void detener() {
        ejecutando = false;
        executorService.shutdown();
        try {
            serverSocket.close();
        } catch (IOException e) {
            System.err.println("Error cerrando servidor: " + e.getMessage());
        }
    }
    
    private static class ManejadorCliente implements Runnable {
        private Socket clienteSocket;
        
        public ManejadorCliente(Socket socket) {
            this.clienteSocket = socket;
        }
        
        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(clienteSocket.getInputStream()));
                 PrintWriter out = new PrintWriter(clienteSocket.getOutputStream(), true)) {
                
                String lineaEntrada = in.readLine();
                if (lineaEntrada != null && lineaEntrada.startsWith("GET")) {
                    // Procesar solicitud GET
                    String respuesta = procesarSolicitudGET(lineaEntrada);
                    enviarRespuestaHTTP(out, respuesta);
                } else {
                    enviarRespuestaHTTP(out, "Método no soportado");
                }
                
            } catch (IOException e) {
                System.err.println("Error manejando cliente: " + e.getMessage());
            } finally {
                try {
                    clienteSocket.close();
                } catch (IOException e) {
                    System.err.println("Error cerrando socket: " + e.getMessage());
                }
            }
        }
        
        private String procesarSolicitudGET(String solicitud) {
            // Simulación de procesamiento de solicitud
            if (solicitud.contains("/usuarios")) {
                return "{\"usuarios\": [{\"id\": 1, \"nombre\": \"Juan\"}, {\"id\": 2, \"nombre\": \"Ana\"}]}";
            } else if (solicitud.contains("/productos")) {
                return "{\"productos\": [{\"id\": 1, \"nombre\": \"Laptop\", \"precio\": 999.99}]}";
            } else {
                return "{\"mensaje\": \"Ruta no encontrada\"}";
            }
        }
        
        private void enviarRespuestaHTTP(PrintWriter out, String contenido) {
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Content-Length: " + contenido.length());
            out.println();
            out.println(contenido);
        }
    }
}

// Cliente HTTP simple
public class ClienteHTTP {
    private String servidor;
    private int puerto;
    
    public ClienteHTTP(String servidor, int puerto) {
        this.servidor = servidor;
        this.puerto = puerto;
    }
    
    public String realizarSolicitudGET(String ruta) throws IOException {
        try (Socket socket = new Socket(servidor, puerto);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
            
            // Enviar solicitud HTTP
            out.println("GET " + ruta + " HTTP/1.1");
            out.println("Host: " + servidor + ":" + puerto);
            out.println();
            
            // Leer respuesta
            StringBuilder respuesta = new StringBuilder();
            String linea;
            boolean enCuerpo = false;
            
            while ((linea = in.readLine()) != null) {
                if (linea.isEmpty()) {
                    enCuerpo = true;
                    continue;
                }
                if (enCuerpo) {
                    respuesta.append(linea);
                }
            }
            
            return respuesta.toString();
        }
    }
}

// Pruebas unitarias
public class ClienteServidorTest {
    
    @Test
    public void testComunicacionClienteServidor() throws Exception {
        // Iniciar servidor en un hilo separado
        ServidorHTTP servidor = new ServidorHTTP(8080);
        Thread servidorThread = new Thread(() -> servidor.iniciar());
        servidorThread.start();
        
        // Esperar a que el servidor esté listo
        Thread.sleep(1000);
        
        // Crear cliente y hacer solicitud
        ClienteHTTP cliente = new ClienteHTTP("localhost", 8080);
        String respuesta = cliente.realizarSolicitudGET("/usuarios");
        
        // Verificar respuesta
        assertTrue(respuesta.contains("usuarios"));
        assertTrue(respuesta.contains("Juan"));
        
        // Detener servidor
        servidor.detener();
        servidorThread.join();
    }
}
```

## Arquitectura Orientada a Servicios (SOA)

La arquitectura orientada a servicios es el equivalente de software a la navaja suiza; te proporciona muchas herramientas potenciales, todas organizadas en servicios que no se presionan y activan accidentalmente mientras las desenvuelves y planeas dónde usarlas. SOA es un estilo arquitectónico que hace posible que los servicios jueguen juntos dentro de una organización, como miembros de la misma orquesta.

### Principios Clave de SOA

1. **Acoplamiento Suelto**: Los servicios SOA son como buenos vecinos. Tocan tu hombro, saludan, pero no tienen cinco minutos para hablar sobre tus hijos y el clima.

2. **Abstracción de Servicio**: Vas a un restaurante. Pides tu comida, pero no tienes que saber qué está pasando en la cocina.

3. **Reutilización**: Si se implementa efectivamente, los servicios SOA deberían usarse una y otra vez.

4. **Composabilidad**: Puedes mezclar algunos servicios SOA para hacer algo nuevo.

5. **Interoperabilidad**: SOA es un diplomático mundial. Asegura que los servicios puedan hablar entre sí independientemente del lenguaje de programación.

### Ejemplo de SOA

```java
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
```

### Beneficios de SOA

1. **Adaptabilidad y Agilidad**: SOA es el tipo de arquitectura que puede rodar con los golpes. Los negocios cambian de rumbo, las necesidades evolucionan, y con SOA puedes ajustar y modificar sobre la marcha.

2. **Escalabilidad**: Dado que cada servicio se mantiene por sí solo, puedes escalar servicios individuales basándote en la demanda.

3. **Eficiencia de Costos**: Estás reutilizando servicios con SOA, por lo que los costos de desarrollo bajan.

4. **Mejor Integración**: SOA es el rey de la integración, independientemente de si hay muchas partes móviles.

5. **Mejor Coordinación**: Debido a que cada servicio se desarrolla independientemente, varios equipos pueden trabajar en diferentes partes del sistema en conjunto.

### Desafíos de SOA

1. **Complejidad**: SOA puede complicarse. Gestionar todos esos servicios independientes requiere orquestación y gobernanza cuidadosas.

2. **Sobrecarga de Rendimiento**: Toda esa comunicación entre servicios agrega algo de retraso.

3. **Seguridad**: Asegurar la comunicación segura entre servicios puede ser complicado.

4. **Gobernanza**: Gestionar el ciclo de vida de los servicios, mantener todo conforme con los estándares y mantener la calidad requiere supervisión estricta. 