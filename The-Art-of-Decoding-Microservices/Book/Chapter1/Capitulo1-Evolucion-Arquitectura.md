# Capítulo 1: Evolución de la Arquitectura de Software

## Introducción

En las últimas décadas, la arquitectura de software ha estado en una montaña rusa salvaje, transformándose y girando para acomodar las necesidades cada vez más expansivas de las empresas, la marcha implacable de la tecnología y la imprevisibilidad de los caprichos de la gestión de proyectos. Sumerjámonos en este capítulo y descubramos la emocionante historia de la arquitectura de software. Ha sido un viaje desde los primeros días del código procedural hasta las maravillas impulsadas por la nube de hoy. Es como ver una bicicleta vieja y confiable transformarse en un vehículo eléctrico autónomo impulsado por la nube, mientras aún esperas que sea igual de simple de manejar.

## La Época Temprana: Programación Estructurada

El viaje comenzó con la programación estructurada, donde la simplicidad gobernaba el día, y el objetivo era solo mantener tu código de verse como un tazón de espagueti enredado. A principios de los años 1960 y 1970, el software era bastante directo, o tan directo como cualquier cosa que involucrara computadoras tempranas podía ser. Los programas se escribían en fragmentos procedurales, donde los desarrolladores descomponían sus tareas en pequeños subrutinas ordenadas. Piensa en ello como seguir una receta: Paso 1, haz esto. Paso 2, haz aquello. Paso 3, beneficio. Si bien esto era genial para mantener las cosas organizadas, no se prestaba exactamente a la creciente complejidad de la era digital.

### Ejemplo de Programación Estructurada

```c
// Ejemplo de programación estructurada en C
#include <stdio.h>

// Función para calcular el factorial
int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Función para validar entrada
int validar_entrada(int n) {
    if (n < 0) {
        return 0; // Inválido
    }
    return 1; // Válido
}

// Función principal
int main() {
    int numero;
    printf("Ingresa un número para calcular factorial: ");
    scanf("%d", &numero);
    
    if (validar_entrada(numero)) {
        int resultado = factorial(numero);
        printf("El factorial de %d es %d\n", numero, resultado);
    } else {
        printf("Número inválido\n");
    }
    
    return 0;
}
```

## La Edad de Oro: Programación Orientada a Objetos

A finales de los años 1980 y en los 1990, el software se había inflado en bestias masivas, y el caos amenazaba con reinar una vez más. Entra la programación orientada a objetos (POO), llegando como un superhéroe con una capa, excepto que la capa probablemente era un manual de Java o C++. La POO no solo se enfocaba en lo que hacía el software, sino en lo que era. Empaquetaba ordenadamente los datos en objetos, como poner un tigre en un recinto digital de zoológico donde no se comería tu otro código. Conceptos como herencia, encapsulación y polimorfismo, palabras tan complejas que prácticamente requerían sus propios manuales de usuario, fueron introducidos para domar la jungla del software.

### Ejemplo de Programación Orientada a Objetos

```java
// Ejemplo de POO en Java
public class Usuario {
    private String nombre;
    private String email;
    private int edad;
    
    // Constructor
    public Usuario(String nombre, String email, int edad) {
        this.nombre = nombre;
        this.email = email;
        this.edad = edad;
    }
    
    // Getters y Setters (Encapsulación)
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public int getEdad() {
        return edad;
    }
    
    public void setEdad(int edad) {
        if (edad >= 0) {
            this.edad = edad;
        }
    }
    
    // Método de instancia
    public boolean esMayorDeEdad() {
        return edad >= 18;
    }
    
    @Override
    public String toString() {
        return "Usuario{nombre='" + nombre + "', email='" + email + "', edad=" + edad + "}";
    }
}

// Clase que hereda de Usuario (Herencia)
public class UsuarioPremium extends Usuario {
    private String nivelPremium;
    private double descuento;
    
    public UsuarioPremium(String nombre, String email, int edad, String nivelPremium) {
        super(nombre, email, edad);
        this.nivelPremium = nivelPremium;
        this.descuento = calcularDescuento(nivelPremium);
    }
    
    private double calcularDescuento(String nivel) {
        switch (nivel.toLowerCase()) {
            case "oro": return 0.20;
            case "plata": return 0.15;
            case "bronce": return 0.10;
            default: return 0.05;
        }
    }
    
    public double aplicarDescuento(double precio) {
        return precio * (1 - descuento);
    }
}

// Prueba unitaria para Usuario
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UsuarioTest {
    
    @Test
    public void testUsuarioCreacion() {
        Usuario usuario = new Usuario("Juan", "juan@email.com", 25);
        assertEquals("Juan", usuario.getNombre());
        assertEquals("juan@email.com", usuario.getEmail());
        assertEquals(25, usuario.getEdad());
    }
    
    @Test
    public void testEsMayorDeEdad() {
        Usuario usuarioMayor = new Usuario("Ana", "ana@email.com", 20);
        Usuario usuarioMenor = new Usuario("Pedro", "pedro@email.com", 16);
        
        assertTrue(usuarioMayor.esMayorDeEdad());
        assertFalse(usuarioMenor.esMayorDeEdad());
    }
    
    @Test
    public void testUsuarioPremium() {
        UsuarioPremium premium = new UsuarioPremium("María", "maria@email.com", 30, "oro");
        double precioOriginal = 100.0;
        double precioConDescuento = premium.aplicarDescuento(precioOriginal);
        
        assertEquals(80.0, precioConDescuento, 0.01);
    }
}
```

## Ingeniería de Software Basada en Componentes (CBSE)

Para el inicio de los años 1990, los ingenieros de software se preguntaban: "¿No podemos empujar esto un poco más lejos?" Entra la Ingeniería de Software Basada en Componentes (CBSE). CBSE era una progresión natural de la POO, pero llevaba el principio de modularidad al enésimo grado. Si la POO permitía a los desarrolladores crear bloques de construcción, CBSE proporcionaba un catálogo completo de esos. Con CBSE, los sistemas de software podían dividirse en componentes reutilizables que podían ser desarrollados, probados y desplegados independientemente, justo como las piezas de muebles, podían ser usadas una y otra vez.

### Ejemplo de CBSE

```java
// Interfaz del componente
public interface ComponentePago {
    boolean procesarPago(double monto, String moneda);
    String obtenerEstado();
    void cancelarPago();
}

// Implementación del componente de pago con tarjeta
public class ComponentePagoTarjeta implements ComponentePago {
    private String numeroTarjeta;
    private String estado = "PENDIENTE";
    
    public ComponentePagoTarjeta(String numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }
    
    @Override
    public boolean procesarPago(double monto, String moneda) {
        // Simulación de procesamiento de pago
        if (validarTarjeta() && monto > 0) {
            this.estado = "COMPLETADO";
            return true;
        }
        this.estado = "FALLIDO";
        return false;
    }
    
    @Override
    public String obtenerEstado() {
        return estado;
    }
    
    @Override
    public void cancelarPago() {
        this.estado = "CANCELADO";
    }
    
    private boolean validarTarjeta() {
        return numeroTarjeta != null && numeroTarjeta.length() >= 13;
    }
}

// Componente de inventario
public interface ComponenteInventario {
    boolean verificarDisponibilidad(String productoId, int cantidad);
    void actualizarInventario(String productoId, int cantidad);
    int obtenerStock(String productoId);
}

public class ComponenteInventarioSimple implements ComponenteInventario {
    private Map<String, Integer> inventario = new HashMap<>();
    
    public ComponenteInventarioSimple() {
        // Inicializar con algunos productos
        inventario.put("PROD001", 100);
        inventario.put("PROD002", 50);
        inventario.put("PROD003", 75);
    }
    
    @Override
    public boolean verificarDisponibilidad(String productoId, int cantidad) {
        Integer stock = inventario.get(productoId);
        return stock != null && stock >= cantidad;
    }
    
    @Override
    public void actualizarInventario(String productoId, int cantidad) {
        Integer stockActual = inventario.get(productoId);
        if (stockActual != null) {
            inventario.put(productoId, stockActual - cantidad);
        }
    }
    
    @Override
    public int obtenerStock(String productoId) {
        return inventario.getOrDefault(productoId, 0);
    }
}

// Sistema que usa componentes
public class SistemaEcommerce {
    private ComponentePago componentePago;
    private ComponenteInventario componenteInventario;
    
    public SistemaEcommerce(ComponentePago componentePago, ComponenteInventario componenteInventario) {
        this.componentePago = componentePago;
        this.componenteInventario = componenteInventario;
    }
    
    public boolean procesarOrden(String productoId, int cantidad, double precio) {
        // Verificar inventario
        if (!componenteInventario.verificarDisponibilidad(productoId, cantidad)) {
            return false;
        }
        
        // Procesar pago
        if (!componentePago.procesarPago(precio, "USD")) {
            return false;
        }
        
        // Actualizar inventario
        componenteInventario.actualizarInventario(productoId, cantidad);
        
        return true;
    }
}

// Pruebas unitarias para el sistema de componentes
public class SistemaEcommerceTest {
    
    @Test
    public void testProcesarOrdenExitosa() {
        ComponentePago pago = new ComponentePagoTarjeta("1234567890123456");
        ComponenteInventario inventario = new ComponenteInventarioSimple();
        SistemaEcommerce sistema = new SistemaEcommerce(pago, inventario);
        
        boolean resultado = sistema.procesarOrden("PROD001", 2, 50.0);
        
        assertTrue(resultado);
        assertEquals("COMPLETADO", pago.obtenerEstado());
        assertEquals(98, inventario.obtenerStock("PROD001"));
    }
    
    @Test
    public void testProcesarOrdenSinStock() {
        ComponentePago pago = new ComponentePagoTarjeta("1234567890123456");
        ComponenteInventario inventario = new ComponenteInventarioSimple();
        SistemaEcommerce sistema = new SistemaEcommerce(pago, inventario);
        
        boolean resultado = sistema.procesarOrden("PROD001", 200, 50.0);
        
        assertFalse(resultado);
        assertEquals("PENDIENTE", pago.obtenerEstado());
        assertEquals(100, inventario.obtenerStock("PROD001"));
    }
}
```

## Arquitectura Monolítica

Mientras tanto, la confiable arquitectura monolítica seguía funcionando, especialmente para aplicaciones con límites claramente definidos. Con diseños monolíticos, construías una aplicación completa como una unidad gigantesca e indivisible. Piensa en ello como construir una casa, pero con todas las habitaciones compartiendo las mismas paredes y plomería. Funcionaba, hasta que tu casa se volvía tan grande que las renovaciones se convertían en una pesadilla.

### Ejemplo de Arquitectura Monolítica

```java
// Aplicación monolítica de e-commerce
public class EcommerceMonolito {
    private List<Producto> productos = new ArrayList<>();
    private List<Usuario> usuarios = new ArrayList<>();
    private List<Orden> ordenes = new ArrayList<>();
    private Database database = new Database();
    
    // Gestión de productos
    public void agregarProducto(String nombre, double precio, int stock) {
        Producto producto = new Producto(nombre, precio, stock);
        productos.add(producto);
        database.guardarProducto(producto);
    }
    
    public Producto buscarProducto(String nombre) {
        return productos.stream()
                .filter(p -> p.getNombre().equals(nombre))
                .findFirst()
                .orElse(null);
    }
    
    // Gestión de usuarios
    public void registrarUsuario(String nombre, String email) {
        Usuario usuario = new Usuario(nombre, email);
        usuarios.add(usuario);
        database.guardarUsuario(usuario);
    }
    
    public Usuario autenticarUsuario(String email, String password) {
        return usuarios.stream()
                .filter(u -> u.getEmail().equals(email) && u.verificarPassword(password))
                .findFirst()
                .orElse(null);
    }
    
    // Gestión de órdenes
    public Orden crearOrden(Usuario usuario, List<Producto> productos) {
        Orden orden = new Orden(usuario, productos);
        ordenes.add(orden);
        database.guardarOrden(orden);
        return orden;
    }
    
    public void procesarPago(Orden orden, String metodoPago) {
        // Lógica de pago integrada
        if (metodoPago.equals("TARJETA")) {
            procesarPagoTarjeta(orden);
        } else if (metodoPago.equals("PAYPAL")) {
            procesarPagoPayPal(orden);
        }
    }
    
    private void procesarPagoTarjeta(Orden orden) {
        // Lógica específica para tarjeta
        System.out.println("Procesando pago con tarjeta para orden: " + orden.getId());
    }
    
    private void procesarPagoPayPal(Orden orden) {
        // Lógica específica para PayPal
        System.out.println("Procesando pago con PayPal para orden: " + orden.getId());
    }
    
    // Gestión de inventario
    public void actualizarInventario(String productoNombre, int cantidad) {
        Producto producto = buscarProducto(productoNombre);
        if (producto != null) {
            producto.actualizarStock(cantidad);
            database.actualizarProducto(producto);
        }
    }
    
    // Reportes
    public ReporteVentas generarReporteVentas() {
        return new ReporteVentas(ordenes);
    }
    
    public ReporteInventario generarReporteInventario() {
        return new ReporteInventario(productos);
    }
}

// Clases de soporte
class Producto {
    private String nombre;
    private double precio;
    private int stock;
    
    public Producto(String nombre, double precio, int stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }
    
    public void actualizarStock(int cantidad) {
        this.stock += cantidad;
    }
    
    // Getters
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public int getStock() { return stock; }
}

class Usuario {
    private String nombre;
    private String email;
    private String password;
    
    public Usuario(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
    }
    
    public boolean verificarPassword(String password) {
        return this.password != null && this.password.equals(password);
    }
    
    // Getters
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
}

class Orden {
    private String id;
    private Usuario usuario;
    private List<Producto> productos;
    private double total;
    
    public Orden(Usuario usuario, List<Producto> productos) {
        this.id = UUID.randomUUID().toString();
        this.usuario = usuario;
        this.productos = productos;
        this.total = productos.stream().mapToDouble(Producto::getPrecio).sum();
    }
    
    // Getters
    public String getId() { return id; }
    public double getTotal() { return total; }
}

class Database {
    public void guardarProducto(Producto producto) {
        System.out.println("Guardando producto en base de datos: " + producto.getNombre());
    }
    
    public void guardarUsuario(Usuario usuario) {
        System.out.println("Guardando usuario en base de datos: " + usuario.getEmail());
    }
    
    public void guardarOrden(Orden orden) {
        System.out.println("Guardando orden en base de datos: " + orden.getId());
    }
    
    public void actualizarProducto(Producto producto) {
        System.out.println("Actualizando producto en base de datos: " + producto.getNombre());
    }
}

class ReporteVentas {
    public ReporteVentas(List<Orden> ordenes) {
        System.out.println("Generando reporte de ventas con " + ordenes.size() + " órdenes");
    }
}

class ReporteInventario {
    public ReporteInventario(List<Producto> productos) {
        System.out.println("Generando reporte de inventario con " + productos.size() + " productos");
    }
}

// Pruebas unitarias para la aplicación monolítica
public class EcommerceMonolitoTest {
    
    @Test
    public void testAgregarProducto() {
        EcommerceMonolito monolito = new EcommerceMonolito();
        monolito.agregarProducto("Laptop", 999.99, 10);
        
        Producto producto = monolito.buscarProducto("Laptop");
        assertNotNull(producto);
        assertEquals("Laptop", producto.getNombre());
        assertEquals(999.99, producto.getPrecio(), 0.01);
        assertEquals(10, producto.getStock());
    }
    
    @Test
    public void testCrearOrden() {
        EcommerceMonolito monolito = new EcommerceMonolito();
        monolito.agregarProducto("Mouse", 29.99, 50);
        
        Usuario usuario = new Usuario("Juan", "juan@email.com");
        Producto producto = monolito.buscarProducto("Mouse");
        List<Producto> productos = Arrays.asList(producto);
        
        Orden orden = monolito.crearOrden(usuario, productos);
        
        assertNotNull(orden);
        assertEquals(29.99, orden.getTotal(), 0.01);
    }
}
```

### Características Clave de la Arquitectura Monolítica

1. **Código Único y Unidad de Despliegue**: Todo tu código está contenido en un lugar. Si cambias una línea de código en una parte de la aplicación, tienes que reconstruir y redespagar toda la aplicación.

2. **Componentes Fuertemente Acoplados**: Todo es tan interdependiente que es como gemelos siameses del mundo digital. Haces un cambio en algún lugar y usualmente necesitas hacer un cambio en otro lugar también.

3. **Desarrollo y Despliegue Más Simples**: En la superficie, las arquitecturas monolíticas se sienten increíblemente convenientes. Tienes menos partes móviles, por lo que el desarrollo, las pruebas y el despliegue pueden parecer más directos.

### Problemas con las Arquitecturas Monolíticas

1. **Caos de Mantenimiento**: Tu aplicación se vuelve tan grande que tu base de código se convierte en un desastre expansivo.

2. **Cuellos de Botella de Escalado**: Cuando quieres escalar una aplicación monolítica, tienes que escalar toda la cosa.

3. **Acertijo de Confiabilidad**: Cuando un componente decide hacer una rabieta y fallar, no es solo esa parte de la aplicación la que toma una siesta, todo el sistema puede irse abajo con ella.

4. **Grilletes de Obsolescencia**: Comprometerte con la arquitectura monolítica y esencialmente te casas con cierta pila tecnológica.

5. **Arrastre de Despliegue**: Con un monolito, cada cambio pequeño significa redespagar toda la aplicación. 