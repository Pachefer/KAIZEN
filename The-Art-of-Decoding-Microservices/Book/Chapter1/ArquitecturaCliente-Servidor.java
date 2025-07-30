// ### Principios de la Arquitectura Cliente-Servidor

// La arquitectura cliente-servidor opera bajo un principio simple pero poderoso: la división de deberes entre solicitantes de servicio (clientes) y proveedores de servicio (servidores). Esta separación de responsabilidades permite un desarrollo de aplicaciones más organizado y escalable.

// - **Cliente**: El cliente es la entidad que inicia la comunicación enviando solicitudes al servidor. Puede ser un navegador web, una aplicación móvil o cualquier software que requiera datos o servicios.
// - **Servidor**: El servidor es la entidad que recibe y procesa solicitudes de clientes, proporcionando los datos o servicios necesarios en respuesta.
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