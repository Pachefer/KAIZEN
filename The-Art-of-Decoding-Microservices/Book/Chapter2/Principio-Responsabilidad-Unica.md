# Principio de Responsabilidad Única (SRP) en Microservicios

## Definición y Fundamentos

El Principio de Responsabilidad Única (SRP) es como la regla de oro del diseño limpio: "Una clase debe tener solo una razón para cambiar". En términos simples, significa que una clase debe hacer solo una cosa, pero hacerla realmente bien—como un barista que perfecciona el arte del café en lugar de tratar de preparar un soufflé mediocre al lado. Imagina agrupar autenticación de usuarios, procesamiento de pagos y generación de reportes en un servicio—no solo está pidiendo problemas; prácticamente está confirmando asistencia al caos. Al adherirse a SRP, obtienes mantenibilidad, testabilidad y esa dulce sensación de zen modular, todo mientras evitas el equivalente técnico de hacer malabarismos con espadas en llamas.

## Ejemplo 1: Violación del SRP - Servicio Monolítico

```java
/**
 * ❌ EJEMPLO INCORRECTO: Violación del Principio de Responsabilidad Única
 * 
 * Este servicio maneja múltiples responsabilidades:
 * - Gestión de usuarios
 * - Procesamiento de pagos
 * - Generación de reportes
 * - Envío de notificaciones
 * 
 * Problemas:
 * - Difícil de mantener y probar
 * - Cambios en una funcionalidad pueden afectar otras
 * - No se puede escalar independientemente
 * - Violación clara del SRP
 */
// Anotación que marca esta clase como un servicio de Spring
// @Service permite que Spring detecte y gestione esta clase como un bean
@Service
public class ServicioEcommerceMonolitico {
    
    // DEPENDENCIAS PARA MÚLTIPLES RESPONSABILIDADES
    // Este es el primer problema: demasiadas dependencias indican demasiadas responsabilidades
    
    // Repositorio para gestión de usuarios - RESPONSABILIDAD 1
    @Autowired  // Inyección automática de dependencias
    private UsuarioRepository usuarioRepository;  // Acceso a datos de usuarios
    
    // Repositorio para procesamiento de pagos - RESPONSABILIDAD 2
    @Autowired
    private PagoRepository pagoRepository;  // Acceso a datos de pagos
    
    // Repositorio para generación de reportes - RESPONSABILIDAD 3
    @Autowired
    private ReporteRepository reporteRepository;  // Acceso a datos de reportes
    
    // Servicio de email para notificaciones - RESPONSABILIDAD 4
    @Autowired
    private EmailService emailService;  // Envío de emails
    
    // Servicio de SMS para notificaciones - RESPONSABILIDAD 4 (extensión)
    @Autowired
    private SMSService smsService;  // Envío de SMS
    
    // Generador de PDF para reportes - RESPONSABILIDAD 3 (extensión)
    @Autowired
    private PDFGenerator pdfGenerator;  // Generación de PDFs
    
    // Generador de Excel para reportes - RESPONSABILIDAD 3 (extensión)
    @Autowired
    private ExcelGenerator excelGenerator;  // Generación de archivos Excel
    
    /**
     * RESPONSABILIDAD 1: Gestión de Usuarios
     * Esta responsabilidad debería estar en un servicio separado
     * 
     * PROBLEMA: Este método maneja tanto la lógica de negocio de usuarios
     * como el envío de notificaciones, violando el SRP
     * 
     * @param request Datos del usuario a crear
     * @return Usuario creado y guardado
     * @throws IllegalArgumentException si faltan datos requeridos
     * @throws RuntimeException si el email ya está registrado
     */
    public Usuario crearUsuario(UsuarioRequest request) {
        // VALIDACIÓN 1: Verificar que el email no sea null o vacío
        // Esta validación es parte de la lógica de negocio de usuarios
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email es requerido");
        }
        
        // VALIDACIÓN 2: Verificar que el email no esté duplicado
        // findByEmail() busca en la base de datos si ya existe un usuario con ese email
        // isPresent() retorna true si se encuentra un usuario con ese email
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // CREACIÓN DEL USUARIO: Lógica de negocio principal
        // Crear una nueva instancia de Usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());           // Asignar nombre
        usuario.setEmail(request.getEmail());             // Asignar email
        usuario.setPassword(encryptPassword(request.getPassword()));  // Encriptar y asignar contraseña
        usuario.setFechaCreacion(LocalDateTime.now());    // Establecer fecha de creación
        
        // PERSISTENCIA: Guardar el usuario en la base de datos
        // save() persiste el usuario y retorna la entidad con el ID generado
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        // ❌ PROBLEMA: RESPONSABILIDAD ADICIONAL - Envío de notificaciones
        // Esta línea viola el SRP porque mezcla gestión de usuarios con notificaciones
        // El envío de emails debería estar en un servicio separado
        emailService.enviarEmailBienvenida(usuario.getEmail(), usuario.getNombre());
        
        // Retornar el usuario creado
        return usuarioGuardado;
    }
    
    /**
     * RESPONSABILIDAD 2: Procesamiento de Pagos
     * Esta responsabilidad debería estar en un servicio separado
     */
    public Pago procesarPago(PagoRequest request) {
        // Validar datos del pago
        if (request.getMonto() == null || request.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Monto debe ser mayor a cero");
        }
        
        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Procesar el pago con el proveedor externo
        String transaccionId = procesarPagoConProveedor(request);
        
        // Guardar el pago en la base de datos
        Pago pago = new Pago();
        pago.setUsuarioId(request.getUsuarioId());
        pago.setMonto(request.getMonto());
        pago.setMetodoPago(request.getMetodoPago());
        pago.setTransaccionId(transaccionId);
        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaProcesamiento(LocalDateTime.now());
        
        Pago pagoGuardado = pagoRepository.save(pago);
        
        // Enviar confirmación por SMS
        smsService.enviarConfirmacionPago(usuario.getTelefono(), pago.getMonto());
        
        return pagoGuardado;
    }
    
    /**
     * RESPONSABILIDAD 3: Generación de Reportes
     * Esta responsabilidad debería estar en un servicio separado
     */
    public byte[] generarReporteVentas(ReporteRequest request) {
        // Obtener datos de ventas
        List<Pago> pagos = pagoRepository.findByFechaBetween(
            request.getFechaInicio(), 
            request.getFechaFin()
        );
        
        // Calcular estadísticas
        BigDecimal totalVentas = pagos.stream()
            .map(Pago::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        int totalTransacciones = pagos.size();
        
        // Generar reporte en PDF
        if ("PDF".equals(request.getFormato())) {
            return pdfGenerator.generarReporteVentas(pagos, totalVentas, totalTransacciones);
        } else {
            return excelGenerator.generarReporteVentas(pagos, totalVentas, totalTransacciones);
        }
    }
    
    /**
     * RESPONSABILIDAD 4: Envío de Notificaciones
     * Esta responsabilidad debería estar en un servicio separado
     */
    public void enviarNotificacionPromocional(String mensaje, List<Long> usuarioIds) {
        for (Long usuarioId : usuarioIds) {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElse(null);
            
            if (usuario != null) {
                // Enviar por email
                emailService.enviarPromocion(usuario.getEmail(), mensaje);
                
                // Enviar por SMS si tiene teléfono
                if (usuario.getTelefono() != null) {
                    smsService.enviarPromocion(usuario.getTelefono(), mensaje);
                }
            }
        }
    }
    
    // Métodos privados auxiliares
    private String encryptPassword(String password) {
        // Lógica de encriptación
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }
    
    private String procesarPagoConProveedor(PagoRequest request) {
        // Lógica de integración con proveedor de pagos
        return UUID.randomUUID().toString();
    }
}

/**
 * ❌ PROBLEMAS DEL CÓDIGO ANTERIOR:
 * 
 * 1. MÚLTIPLES RESPONSABILIDADES:
 *    - Gestión de usuarios
 *    - Procesamiento de pagos
 *    - Generación de reportes
 *    - Envío de notificaciones
 * 
 * 2. ACOPLAMIENTO FUERTE:
 *    - Cambios en pagos pueden afectar usuarios
 *    - Cambios en reportes pueden afectar notificaciones
 * 
 * 3. DIFÍCIL DE ESCALAR:
 *    - No se puede escalar pagos sin escalar usuarios
 *    - No se puede optimizar reportes independientemente
 * 
 * 4. DIFÍCIL DE PROBAR:
 *    - Pruebas unitarias complejas
 *    - Múltiples dependencias por prueba
 * 
 * 5. VIOLACIÓN DEL SRP:
 *    - Una clase con múltiples razones para cambiar
 */

## Ejemplo 2: Aplicación Correcta del SRP - Microservicios Separados

```java
/**
 * ✅ EJEMPLO CORRECTO: Aplicación del Principio de Responsabilidad Única
 * 
 * Cada servicio tiene una única responsabilidad:
 * - ServicioUsuario: Solo gestión de usuarios
 * - ServicioPago: Solo procesamiento de pagos
 * - ServicioReporte: Solo generación de reportes
 * - ServicioNotificacion: Solo envío de notificaciones
 */

/**
 * MICROSERVICIO 1: Servicio de Usuarios
 * Responsabilidad Única: Gestión completa del ciclo de vida de usuarios
 */
@Service
public class ServicioUsuario {
    
    // Solo dependencias relacionadas con usuarios
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UsuarioValidator usuarioValidator;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    /**
     * Crear un nuevo usuario
     * Esta es la única responsabilidad de este servicio
     */
    public Usuario crearUsuario(CrearUsuarioRequest request) {
        // Validar datos del usuario
        usuarioValidator.validarDatosUsuario(request);
        
        // Verificar unicidad del email
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UsuarioYaExisteException("El email ya está registrado: " + request.getEmail());
        }
        
        // Crear el usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setFechaCreacion(LocalDateTime.now());
        usuario.setEstado(EstadoUsuario.ACTIVO);
        
        // Guardar en la base de datos
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        // Publicar evento de usuario creado (comunicación asíncrona)
        eventPublisher.publish(new UsuarioCreadoEvent(usuarioGuardado.getId(), usuarioGuardado.getEmail()));
        
        return usuarioGuardado;
    }
    
    /**
     * Actualizar datos del usuario
     */
    public Usuario actualizarUsuario(Long usuarioId, ActualizarUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado: " + usuarioId));
        
        // Actualizar solo los campos permitidos
        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }
        
        if (request.getTelefono() != null) {
            usuario.setTelefono(request.getTelefono());
        }
        
        usuario.setFechaActualizacion(LocalDateTime.now());
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Desactivar usuario
     */
    public void desactivarUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado: " + usuarioId));
        
        usuario.setEstado(EstadoUsuario.INACTIVO);
        usuario.setFechaActualizacion(LocalDateTime.now());
        
        usuarioRepository.save(usuario);
        
        // Publicar evento de usuario desactivado
        eventPublisher.publish(new UsuarioDesactivadoEvent(usuarioId));
    }
    
    /**
     * Buscar usuario por email
     */
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    /**
     * Obtener usuario por ID
     */
    public Usuario obtenerPorId(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado: " + usuarioId));
    }
}

/**
 * MICROSERVICIO 2: Servicio de Pagos
 * Responsabilidad Única: Procesamiento de pagos y transacciones
 */
@Service
public class ServicioPago {
    
    // Solo dependencias relacionadas con pagos
    @Autowired
    private PagoRepository pagoRepository;
    
    @Autowired
    private ProveedorPagoService proveedorPagoService;
    
    @Autowired
    private PagoValidator pagoValidator;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    /**
     * Procesar un pago
     * Esta es la única responsabilidad de este servicio
     */
    public Pago procesarPago(ProcesarPagoRequest request) {
        // Validar datos del pago
        pagoValidator.validarPago(request);
        
        // Procesar pago con proveedor externo
        ResultadoProcesamiento resultado = proveedorPagoService.procesarPago(
            request.getMonto(),
            request.getMetodoPago(),
            request.getDatosTarjeta()
        );
        
        if (!resultado.isExitoso()) {
            throw new PagoFallidoException("Pago fallido: " + resultado.getMensajeError());
        }
        
        // Crear registro de pago
        Pago pago = new Pago();
        pago.setUsuarioId(request.getUsuarioId());
        pago.setMonto(request.getMonto());
        pago.setMetodoPago(request.getMetodoPago());
        pago.setTransaccionId(resultado.getTransaccionId());
        pago.setEstado(EstadoPago.COMPLETADO);
        pago.setFechaProcesamiento(LocalDateTime.now());
        pago.setDatosTransaccion(resultado.getDatosTransaccion());
        
        Pago pagoGuardado = pagoRepository.save(pago);
        
        // Publicar evento de pago procesado
        eventPublisher.publish(new PagoProcesadoEvent(
            pagoGuardado.getId(),
            pagoGuardado.getUsuarioId(),
            pagoGuardado.getMonto(),
            pagoGuardado.getTransaccionId()
        ));
        
        return pagoGuardado;
    }
    
    /**
     * Reembolsar un pago
     */
    public Pago reembolsarPago(Long pagoId, BigDecimal montoReembolso) {
        Pago pago = pagoRepository.findById(pagoId)
            .orElseThrow(() -> new PagoNoEncontradoException("Pago no encontrado: " + pagoId));
        
        if (pago.getEstado() != EstadoPago.COMPLETADO) {
            throw new PagoNoReembolsableException("El pago no puede ser reembolsado");
        }
        
        // Procesar reembolso con proveedor
        ResultadoReembolso resultado = proveedorPagoService.reembolsarPago(
            pago.getTransaccionId(),
            montoReembolso
        );
        
        if (!resultado.isExitoso()) {
            throw new ReembolsoFallidoException("Reembolso fallido: " + resultado.getMensajeError());
        }
        
        // Actualizar estado del pago
        pago.setEstado(EstadoPago.REEMBOLSADO);
        pago.setMontoReembolso(montoReembolso);
        pago.setFechaReembolso(LocalDateTime.now());
        
        Pago pagoActualizado = pagoRepository.save(pago);
        
        // Publicar evento de reembolso
        eventPublisher.publish(new PagoReembolsadoEvent(
            pagoActualizado.getId(),
            pagoActualizado.getUsuarioId(),
            pagoActualizado.getMontoReembolso()
        ));
        
        return pagoActualizado;
    }
    
    /**
     * Obtener historial de pagos de un usuario
     */
    public List<Pago> obtenerHistorialPagos(Long usuarioId) {
        return pagoRepository.findByUsuarioIdOrderByFechaProcesamientoDesc(usuarioId);
    }
    
    /**
     * Obtener estadísticas de pagos
     */
    public EstadisticasPago obtenerEstadisticas(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Pago> pagos = pagoRepository.findByFechaProcesamientoBetween(
            fechaInicio.atStartOfDay(),
            fechaFin.atTime(23, 59, 59)
        );
        
        BigDecimal totalVentas = pagos.stream()
            .filter(p -> p.getEstado() == EstadoPago.COMPLETADO)
            .map(Pago::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long totalTransacciones = pagos.stream()
            .filter(p -> p.getEstado() == EstadoPago.COMPLETADO)
            .count();
        
        return new EstadisticasPago(totalVentas, totalTransacciones);
    }
}

/**
 * MICROSERVICIO 3: Servicio de Reportes
 * Responsabilidad Única: Generación de reportes y análisis
 */
@Service
public class ServicioReporte {
    
    // Solo dependencias relacionadas con reportes
    @Autowired
    private ReporteRepository reporteRepository;
    
    @Autowired
    private PDFGenerator pdfGenerator;
    
    @Autowired
    private ExcelGenerator excelGenerator;
    
    @Autowired
    private ReporteDataService reporteDataService;
    
    /**
     * Generar reporte de ventas
     * Esta es la única responsabilidad de este servicio
     */
    public byte[] generarReporteVentas(GenerarReporteVentasRequest request) {
        // Obtener datos para el reporte
        DatosReporteVentas datos = reporteDataService.obtenerDatosVentas(
            request.getFechaInicio(),
            request.getFechaFin(),
            request.getFiltros()
        );
        
        // Generar reporte según el formato solicitado
        byte[] reporte;
        if ("PDF".equals(request.getFormato())) {
            reporte = pdfGenerator.generarReporteVentas(datos);
        } else if ("EXCEL".equals(request.getFormato())) {
            reporte = excelGenerator.generarReporteVentas(datos);
        } else {
            throw new FormatoReporteNoSoportadoException("Formato no soportado: " + request.getFormato());
        }
        
        // Guardar registro del reporte generado
        Reporte reporteRegistro = new Reporte();
        reporteRegistro.setTipo(TipoReporte.VENTAS);
        reporteRegistro.setFormato(request.getFormato());
        reporteRegistro.setFechaGeneracion(LocalDateTime.now());
        reporteRegistro.setUsuarioId(request.getUsuarioId());
        reporteRegistro.setTamanioBytes(reporte.length);
        
        reporteRepository.save(reporteRegistro);
        
        return reporte;
    }
    
    /**
     * Generar reporte de usuarios
     */
    public byte[] generarReporteUsuarios(GenerarReporteUsuariosRequest request) {
        DatosReporteUsuarios datos = reporteDataService.obtenerDatosUsuarios(
            request.getFechaInicio(),
            request.getFechaFin(),
            request.getFiltros()
        );
        
        byte[] reporte;
        if ("PDF".equals(request.getFormato())) {
            reporte = pdfGenerator.generarReporteUsuarios(datos);
        } else {
            reporte = excelGenerator.generarReporteUsuarios(datos);
        }
        
        // Guardar registro
        Reporte reporteRegistro = new Reporte();
        reporteRegistro.setTipo(TipoReporte.USUARIOS);
        reporteRegistro.setFormato(request.getFormato());
        reporteRegistro.setFechaGeneracion(LocalDateTime.now());
        reporteRegistro.setUsuarioId(request.getUsuarioId());
        reporteRegistro.setTamanioBytes(reporte.length);
        
        reporteRepository.save(reporteRegistro);
        
        return reporte;
    }
    
    /**
     * Obtener historial de reportes generados
     */
    public List<Reporte> obtenerHistorialReportes(Long usuarioId) {
        return reporteRepository.findByUsuarioIdOrderByFechaGeneracionDesc(usuarioId);
    }
}

/**
 * MICROSERVICIO 4: Servicio de Notificaciones
 * Responsabilidad Única: Envío de notificaciones por diferentes canales
 */
@Service
public class ServicioNotificacion {
    
    // Solo dependencias relacionadas con notificaciones
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SMSService smsService;
    
    @Autowired
    private PushNotificationService pushNotificationService;
    
    @Autowired
    private NotificacionRepository notificacionRepository;
    
    @Autowired
    private PlantillaService plantillaService;
    
    /**
     * Enviar notificación
     * Esta es la única responsabilidad de este servicio
     */
    public void enviarNotificacion(EnviarNotificacionRequest request) {
        // Validar la notificación
        validarNotificacion(request);
        
        // Crear registro de notificación
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(request.getTipo());
        notificacion.setDestinatario(request.getDestinatario());
        notificacion.setCanal(request.getCanal());
        notificacion.setAsunto(request.getAsunto());
        notificacion.setMensaje(request.getMensaje());
        notificacion.setFechaEnvio(LocalDateTime.now());
        notificacion.setEstado(EstadoNotificacion.PENDIENTE);
        
        notificacionRepository.save(notificacion);
        
        try {
            // Enviar según el canal especificado
            switch (request.getCanal()) {
                case EMAIL:
                    enviarPorEmail(request);
                    break;
                case SMS:
                    enviarPorSMS(request);
                    break;
                case PUSH:
                    enviarPorPush(request);
                    break;
                case MULTIPLE:
                    enviarPorMultiplesCanales(request);
                    break;
                default:
                    throw new CanalNoSoportadoException("Canal no soportado: " + request.getCanal());
            }
            
            // Actualizar estado a enviado
            notificacion.setEstado(EstadoNotificacion.ENVIADO);
            notificacion.setFechaEnvioExitoso(LocalDateTime.now());
            
        } catch (Exception e) {
            // Actualizar estado a fallido
            notificacion.setEstado(EstadoNotificacion.FALLIDO);
            notificacion.setMensajeError(e.getMessage());
            
            throw new NotificacionFallidaException("Error enviando notificación: " + e.getMessage(), e);
        }
        
        notificacionRepository.save(notificacion);
    }
    
    /**
     * Enviar notificación promocional masiva
     */
    public void enviarNotificacionPromocional(NotificacionPromocionalRequest request) {
        // Obtener plantilla
        String plantilla = plantillaService.obtenerPlantilla(request.getTipoPlantilla());
        
        // Personalizar mensaje para cada destinatario
        for (String destinatario : request.getDestinatarios()) {
            String mensajePersonalizado = plantillaService.personalizarPlantilla(
                plantilla,
                destinatario,
                request.getDatosPersonalizacion()
            );
            
            EnviarNotificacionRequest notificacionRequest = new EnviarNotificacionRequest();
            notificacionRequest.setTipo(TipoNotificacion.PROMOCIONAL);
            notificacionRequest.setDestinatario(destinatario);
            notificacionRequest.setCanal(request.getCanal());
            notificacionRequest.setAsunto(request.getAsunto());
            notificacionRequest.setMensaje(mensajePersonalizado);
            
            enviarNotificacion(notificacionRequest);
        }
    }
    
    /**
     * Obtener estadísticas de notificaciones
     */
    public EstadisticasNotificacion obtenerEstadisticas(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Notificacion> notificaciones = notificacionRepository.findByFechaEnvioBetween(
            fechaInicio.atStartOfDay(),
            fechaFin.atTime(23, 59, 59)
        );
        
        long totalEnviadas = notificaciones.stream()
            .filter(n -> n.getEstado() == EstadoNotificacion.ENVIADO)
            .count();
        
        long totalFallidas = notificaciones.stream()
            .filter(n -> n.getEstado() == EstadoNotificacion.FALLIDO)
            .count();
        
        return new EstadisticasNotificacion(totalEnviadas, totalFallidas);
    }
    
    // Métodos privados auxiliares
    private void validarNotificacion(EnviarNotificacionRequest request) {
        if (request.getDestinatario() == null || request.getDestinatario().isEmpty()) {
            throw new IllegalArgumentException("Destinatario es requerido");
        }
        
        if (request.getMensaje() == null || request.getMensaje().isEmpty()) {
            throw new IllegalArgumentException("Mensaje es requerido");
        }
    }
    
    private void enviarPorEmail(EnviarNotificacionRequest request) {
        emailService.enviarEmail(
            request.getDestinatario(),
            request.getAsunto(),
            request.getMensaje()
        );
    }
    
    private void enviarPorSMS(EnviarNotificacionRequest request) {
        smsService.enviarSMS(
            request.getDestinatario(),
            request.getMensaje()
        );
    }
    
    private void enviarPorPush(EnviarNotificacionRequest request) {
        pushNotificationService.enviarNotificacion(
            request.getDestinatario(),
            request.getAsunto(),
            request.getMensaje()
        );
    }
    
    private void enviarPorMultiplesCanales(EnviarNotificacionRequest request) {
        // Enviar por email
        enviarPorEmail(request);
        
        // Enviar por SMS si hay número de teléfono
        if (request.getDestinatario().matches(".*\\d.*")) {
            enviarPorSMS(request);
        }
    }
}
```

## Ejemplo 3: Comunicación Entre Microservicios

```java
/**
 * COMUNICACIÓN ENTRE MICROSERVICIOS
 * 
 * Los microservicios se comunican a través de eventos y APIs REST
 * manteniendo su independencia y responsabilidad única
 */

/**
 * Eventos para comunicación asíncrona entre microservicios
 */
public class UsuarioCreadoEvent {
    private final Long usuarioId;
    private final String email;
    private final String nombre;
    private final LocalDateTime fechaCreacion;
    
    public UsuarioCreadoEvent(Long usuarioId, String email, String nombre) {
        this.usuarioId = usuarioId;
        this.email = email;
        this.nombre = nombre;
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // Getters
    public Long getUsuarioId() { return usuarioId; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}

public class PagoProcesadoEvent {
    private final Long pagoId;
    private final Long usuarioId;
    private final BigDecimal monto;
    private final String transaccionId;
    private final LocalDateTime fechaProcesamiento;
    
    public PagoProcesadoEvent(Long pagoId, Long usuarioId, BigDecimal monto, String transaccionId) {
        this.pagoId = pagoId;
        this.usuarioId = usuarioId;
        this.monto = monto;
        this.transaccionId = transaccionId;
        this.fechaProcesamiento = LocalDateTime.now();
    }
    
    // Getters
    public Long getPagoId() { return pagoId; }
    public Long getUsuarioId() { return usuarioId; }
    public BigDecimal getMonto() { return monto; }
    public String getTransaccionId() { return transaccionId; }
    public LocalDateTime getFechaProcesamiento() { return fechaProcesamiento; }
}

/**
 * Consumidor de eventos en el Servicio de Notificaciones
 * Escucha eventos de otros microservicios y reacciona apropiadamente
 */
@Component
public class NotificacionEventHandler {
    
    @Autowired
    private ServicioNotificacion servicioNotificacion;
    
    /**
     * Escuchar evento de usuario creado
     * Responsabilidad única: Reaccionar a usuarios creados enviando notificación de bienvenida
     */
    @EventListener
    public void handleUsuarioCreado(UsuarioCreadoEvent event) {
        // Crear notificación de bienvenida
        EnviarNotificacionRequest request = new EnviarNotificacionRequest();
        request.setTipo(TipoNotificacion.BIENVENIDA);
        request.setDestinatario(event.getEmail());
        request.setCanal(CanalNotificacion.EMAIL);
        request.setAsunto("¡Bienvenido a nuestra plataforma!");
        request.setMensaje("Hola " + event.getNombre() + ", ¡gracias por registrarte!");
        
        // Enviar notificación
        servicioNotificacion.enviarNotificacion(request);
    }
    
    /**
     * Escuchar evento de pago procesado
     * Responsabilidad única: Reaccionar a pagos procesados enviando confirmación
     */
    @EventListener
    public void handlePagoProcesado(PagoProcesadoEvent event) {
        // Crear notificación de confirmación de pago
        EnviarNotificacionRequest request = new EnviarNotificacionRequest();
        request.setTipo(TipoNotificacion.CONFIRMACION_PAGO);
        request.setDestinatario("usuario-" + event.getUsuarioId() + "@ejemplo.com"); // Email del usuario
        request.setCanal(CanalNotificacion.EMAIL);
        request.setAsunto("Confirmación de Pago");
        request.setMensaje("Tu pago de $" + event.getMonto() + " ha sido procesado exitosamente. ID de transacción: " + event.getTransaccionId());
        
        // Enviar notificación
        servicioNotificacion.enviarNotificacion(request);
    }
}
```

## Pruebas Unitarias para SRP

```java
/**
 * PRUEBAS UNITARIAS PARA EL PRINCIPIO DE RESPONSABILIDAD ÚNICA
 * 
 * Cada microservicio tiene sus propias pruebas unitarias
 * enfocadas en su única responsabilidad
 */

/**
 * Pruebas para el Servicio de Usuarios
 */
@ExtendWith(MockitoExtension.class)
public class ServicioUsuarioTest {
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private UsuarioValidator usuarioValidator;
    
    @Mock
    private EventPublisher eventPublisher;
    
    @InjectMocks
    private ServicioUsuario servicioUsuario;
    
    /**
     * Prueba: Crear usuario exitosamente
     * Verifica que el servicio cumple su única responsabilidad
     */
    @Test
    public void testCrearUsuarioExitoso() {
        // Arrange - Preparar datos de prueba
        CrearUsuarioRequest request = new CrearUsuarioRequest();
        request.setNombre("Juan Pérez");
        request.setEmail("juan@ejemplo.com");
        request.setPassword("password123");
        request.setTelefono("+1234567890");
        
        Usuario usuarioEsperado = new Usuario();
        usuarioEsperado.setId(1L);
        usuarioEsperado.setNombre("Juan Pérez");
        usuarioEsperado.setEmail("juan@ejemplo.com");
        usuarioEsperado.setPassword("encodedPassword");
        usuarioEsperado.setTelefono("+1234567890");
        usuarioEsperado.setEstado(EstadoUsuario.ACTIVO);
        
        // Configurar mocks
        when(usuarioValidator.validarDatosUsuario(request)).thenReturn(true);
        when(usuarioRepository.findByEmail("juan@ejemplo.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioEsperado);
        
        // Act - Ejecutar el método bajo prueba
        Usuario resultado = servicioUsuario.crearUsuario(request);
        
        // Assert - Verificar resultados
        assertNotNull(resultado);
        assertEquals("Juan Pérez", resultado.getNombre());
        assertEquals("juan@ejemplo.com", resultado.getEmail());
        assertEquals(EstadoUsuario.ACTIVO, resultado.getEstado());
        
        // Verificar que se llamaron los métodos correctos
        verify(usuarioValidator).validarDatosUsuario(request);
        verify(usuarioRepository).findByEmail("juan@ejemplo.com");
        verify(passwordEncoder).encode("password123");
        verify(usuarioRepository).save(any(Usuario.class));
        verify(eventPublisher).publish(any(UsuarioCreadoEvent.class));
    }
    
    /**
     * Prueba: Error cuando el email ya existe
     */
    @Test
    public void testCrearUsuarioConEmailDuplicado() {
        // Arrange
        CrearUsuarioRequest request = new CrearUsuarioRequest();
        request.setEmail("juan@ejemplo.com");
        
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setEmail("juan@ejemplo.com");
        
        when(usuarioValidator.validarDatosUsuario(request)).thenReturn(true);
        when(usuarioRepository.findByEmail("juan@ejemplo.com"))
            .thenReturn(Optional.of(usuarioExistente));
        
        // Act & Assert
        assertThrows(UsuarioYaExisteException.class, () -> {
            servicioUsuario.crearUsuario(request);
        });
        
        // Verificar que no se guardó el usuario
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
    
    /**
     * Prueba: Actualizar usuario exitosamente
     */
    @Test
    public void testActualizarUsuarioExitoso() {
        // Arrange
        Long usuarioId = 1L;
        ActualizarUsuarioRequest request = new ActualizarUsuarioRequest();
        request.setNombre("Juan Carlos Pérez");
        request.setTelefono("+0987654321");
        
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(usuarioId);
        usuarioExistente.setNombre("Juan Pérez");
        usuarioExistente.setTelefono("+1234567890");
        
        when(usuarioRepository.findById(usuarioId))
            .thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.save(any(Usuario.class)))
            .thenReturn(usuarioExistente);
        
        // Act
        Usuario resultado = servicioUsuario.actualizarUsuario(usuarioId, request);
        
        // Assert
        assertNotNull(resultado);
        verify(usuarioRepository).findById(usuarioId);
        verify(usuarioRepository).save(any(Usuario.class));
    }
}

/**
 * Pruebas para el Servicio de Pagos
 */
@ExtendWith(MockitoExtension.class)
public class ServicioPagoTest {
    
    @Mock
    private PagoRepository pagoRepository;
    
    @Mock
    private ProveedorPagoService proveedorPagoService;
    
    @Mock
    private PagoValidator pagoValidator;
    
    @Mock
    private EventPublisher eventPublisher;
    
    @InjectMocks
    private ServicioPago servicioPago;
    
    /**
     * Prueba: Procesar pago exitosamente
     */
    @Test
    public void testProcesarPagoExitoso() {
        // Arrange
        ProcesarPagoRequest request = new ProcesarPagoRequest();
        request.setUsuarioId(1L);
        request.setMonto(new BigDecimal("100.00"));
        request.setMetodoPago(MetodoPago.TARJETA_CREDITO);
        request.setDatosTarjeta("1234567890123456");
        
        ResultadoProcesamiento resultadoProcesamiento = new ResultadoProcesamiento();
        resultadoProcesamiento.setExitoso(true);
        resultadoProcesamiento.setTransaccionId("TXN123456");
        
        Pago pagoEsperado = new Pago();
        pagoEsperado.setId(1L);
        pagoEsperado.setUsuarioId(1L);
        pagoEsperado.setMonto(new BigDecimal("100.00"));
        pagoEsperado.setTransaccionId("TXN123456");
        pagoEsperado.setEstado(EstadoPago.COMPLETADO);
        
        when(pagoValidator.validarPago(request)).thenReturn(true);
        when(proveedorPagoService.procesarPago(any(), any(), any()))
            .thenReturn(resultadoProcesamiento);
        when(pagoRepository.save(any(Pago.class))).thenReturn(pagoEsperado);
        
        // Act
        Pago resultado = servicioPago.procesarPago(request);
        
        // Assert
        assertNotNull(resultado);
        assertEquals(EstadoPago.COMPLETADO, resultado.getEstado());
        assertEquals("TXN123456", resultado.getTransaccionId());
        
        verify(pagoValidator).validarPago(request);
        verify(proveedorPagoService).procesarPago(any(), any(), any());
        verify(pagoRepository).save(any(Pago.class));
        verify(eventPublisher).publish(any(PagoProcesadoEvent.class));
    }
    
    /**
     * Prueba: Pago fallido
     */
    @Test
    public void testProcesarPagoFallido() {
        // Arrange
        ProcesarPagoRequest request = new ProcesarPagoRequest();
        request.setMonto(new BigDecimal("100.00"));
        
        ResultadoProcesamiento resultadoProcesamiento = new ResultadoProcesamiento();
        resultadoProcesamiento.setExitoso(false);
        resultadoProcesamiento.setMensajeError("Tarjeta rechazada");
        
        when(pagoValidator.validarPago(request)).thenReturn(true);
        when(proveedorPagoService.procesarPago(any(), any(), any()))
            .thenReturn(resultadoProcesamiento);
        
        // Act & Assert
        assertThrows(PagoFallidoException.class, () -> {
            servicioPago.procesarPago(request);
        });
        
        // Verificar que no se guardó el pago
        verify(pagoRepository, never()).save(any(Pago.class));
    }
}

/**
 * Pruebas para el Servicio de Notificaciones
 */
@ExtendWith(MockitoExtension.class)
public class ServicioNotificacionTest {
    
    @Mock
    private EmailService emailService;
    
    @Mock
    private SMSService smsService;
    
    @Mock
    private NotificacionRepository notificacionRepository;
    
    @InjectMocks
    private ServicioNotificacion servicioNotificacion;
    
    /**
     * Prueba: Enviar notificación por email exitosamente
     */
    @Test
    public void testEnviarNotificacionEmailExitoso() {
        // Arrange
        EnviarNotificacionRequest request = new EnviarNotificacionRequest();
        request.setTipo(TipoNotificacion.INFORMATIVA);
        request.setDestinatario("usuario@ejemplo.com");
        request.setCanal(CanalNotificacion.EMAIL);
        request.setAsunto("Test Subject");
        request.setMensaje("Test Message");
        
        Notificacion notificacionGuardada = new Notificacion();
        notificacionGuardada.setId(1L);
        notificacionGuardada.setEstado(EstadoNotificacion.ENVIADO);
        
        when(notificacionRepository.save(any(Notificacion.class)))
            .thenReturn(notificacionGuardada);
        
        // Act
        servicioNotificacion.enviarNotificacion(request);
        
        // Assert
        verify(emailService).enviarEmail("usuario@ejemplo.com", "Test Subject", "Test Message");
        verify(notificacionRepository, times(2)).save(any(Notificacion.class)); // Una vez al inicio, otra al final
    }
    
    /**
     * Prueba: Error al enviar notificación
     */
    @Test
    public void testEnviarNotificacionFallida() {
        // Arrange
        EnviarNotificacionRequest request = new EnviarNotificacionRequest();
        request.setDestinatario("usuario@ejemplo.com");
        request.setCanal(CanalNotificacion.EMAIL);
        request.setMensaje("Test Message");
        
        when(notificacionRepository.save(any(Notificacion.class)))
            .thenReturn(new Notificacion());
        doThrow(new RuntimeException("Error de conexión"))
            .when(emailService).enviarEmail(any(), any(), any());
        
        // Act & Assert
        assertThrows(NotificacionFallidaException.class, () -> {
            servicioNotificacion.enviarNotificacion(request);
        });
        
        // Verificar que se actualizó el estado a fallido
        verify(notificacionRepository, times(2)).save(any(Notificacion.class));
    }
}
```

## Beneficios del SRP Aplicado

### ✅ Ventajas de la Aplicación Correcta del SRP

1. **Mantenibilidad Mejorada**
   - Cada servicio es fácil de entender y modificar
   - Cambios en un servicio no afectan otros
   - Código más limpio y organizado

2. **Testabilidad Superior**
   - Pruebas unitarias más simples y enfocadas
   - Menos dependencias por prueba
   - Cobertura de código más fácil de lograr

3. **Escalabilidad Independiente**
   - Cada servicio puede escalar según sus necesidades
   - Optimización específica por servicio
   - Uso eficiente de recursos

4. **Despliegue Independiente**
   - Actualizaciones sin afectar todo el sistema
   - Rollbacks rápidos y seguros
   - Despliegues más frecuentes

5. **Resiliencia Mejorada**
   - Fallas aisladas por servicio
   - Recuperación más rápida
   - Sistema más robusto

### ❌ Problemas de Violar el SRP

1. **Complejidad Incrementada**
   - Código difícil de entender
   - Múltiples responsabilidades mezcladas
   - Debugging complejo

2. **Acoplamiento Fuerte**
   - Cambios afectan múltiples funcionalidades
   - Difícil de modificar sin romper otras partes
   - Dependencias circulares

3. **Escalabilidad Limitada**
   - No se puede escalar funcionalidades específicas
   - Uso ineficiente de recursos
   - Cuellos de botella

4. **Testing Complejo**
   - Pruebas unitarias difíciles
   - Múltiples dependencias
   - Cobertura de código baja

## 📊 **RESULTADOS ESPERADOS Y MANEJO DE ERRORES**

### **🎯 Casos de Éxito Esperados**

#### **1. Creación Exitosa de Usuario (SRP Aplicado)**
```java
// ENTRADA
POST /api/usuarios
{
    "nombre": "Ana García",
    "email": "ana.garcia@email.com",
    "password": "password123"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 201 Created
{
    "id": 1,
    "nombre": "Ana García",
    "email": "ana.garcia@email.com",
    "estado": "ACTIVO",
    "fechaCreacion": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ✅ ServicioUsuario: Solo maneja lógica de usuarios
// ✅ Validación de datos de usuario
// ✅ Persistencia en base de datos de usuarios
// ✅ NO maneja pagos, reportes o notificaciones
// ✅ Respuesta HTTP 201 con usuario creado
// ✅ Evento UsuarioCreadoEvent publicado para otros servicios
```

#### **2. Procesamiento Exitoso de Pago (SRP Aplicado)**
```java
// ENTRADA
POST /api/pagos
{
    "usuarioId": 1,
    "monto": 150.00,
    "metodoPago": "TARJETA_CREDITO",
    "numeroTarjeta": "4111111111111111"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 201 Created
{
    "id": 1,
    "usuarioId": 1,
    "monto": 150.00,
    "estado": "COMPLETADO",
    "transaccionId": "TXN_123456789",
    "fechaProcesamiento": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ✅ ServicioPago: Solo maneja lógica de pagos
// ✅ Validación de datos de pago
// ✅ Procesamiento con proveedor externo
// ✅ Persistencia en base de datos de pagos
// ✅ NO maneja usuarios, reportes o notificaciones
// ✅ Evento PagoCompletadoEvent publicado
```

#### **3. Generación Exitosa de Reporte (SRP Aplicado)**
```java
// ENTRADA
POST /api/reportes/ventas
{
    "fechaInicio": "2024-01-01",
    "fechaFin": "2024-01-31",
    "formato": "PDF"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 200 OK
Content-Type: application/pdf
[Archivo PDF del reporte]

// LÓGICA EJECUTADA (SRP RESPETADO):
// ✅ ServicioReporte: Solo maneja lógica de reportes
// ✅ Obtención de datos de ventas
// ✅ Generación de PDF
// ✅ NO maneja usuarios, pagos o notificaciones
// ✅ Respuesta con archivo PDF
```

#### **4. Envío Exitoso de Notificación (SRP Aplicado)**
```java
// ENTRADA
POST /api/notificaciones
{
    "destinatario": "ana.garcia@email.com",
    "canal": "EMAIL",
    "mensaje": "Tu pago ha sido procesado exitosamente"
}

// RESULTADO ESPERADO - ÉXITO
HTTP 201 Created
{
    "id": 1,
    "destinatario": "ana.garcia@email.com",
    "estado": "ENVIADO",
    "fechaEnvio": "2024-01-15T10:30:00"
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ✅ ServicioNotificacion: Solo maneja lógica de notificaciones
// ✅ Validación de datos de notificación
// ✅ Envío por canal especificado (email)
// ✅ Persistencia en base de datos de notificaciones
// ✅ NO maneja usuarios, pagos o reportes
```

### **❌ Casos de Error Esperados**

#### **1. Error de Validación en Servicio de Usuarios**
```java
// ENTRADA INVÁLIDA
POST /api/usuarios
{
    "nombre": "",
    "email": "email-invalido",
    "password": "123"
}

// RESULTADO ESPERADO - ERROR
HTTP 400 Bad Request
{
    "error": "VALIDATION_ERROR",
    "message": "Datos de usuario inválidos",
    "details": [
        "El nombre no puede estar vacío",
        "El email debe tener formato válido",
        "La contraseña debe tener al menos 8 caracteres"
    ]
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ❌ ServicioUsuario: Solo valida datos de usuario
// ❌ NO valida datos de pago, reporte o notificación
// ❌ Error específico del dominio de usuarios
// ❌ Respuesta HTTP 400 con detalles de validación
```

#### **2. Error de Pago Rechazado**
```java
// ENTRADA INVÁLIDA
POST /api/pagos
{
    "usuarioId": 1,
    "monto": 150.00,
    "metodoPago": "TARJETA_CREDITO",
    "numeroTarjeta": "4000000000000002" // Tarjeta de prueba rechazada
}

// RESULTADO ESPERADO - ERROR
HTTP 422 Unprocessable Entity
{
    "error": "PAYMENT_DECLINED",
    "message": "Pago rechazado por el proveedor",
    "details": "Tarjeta declinada - fondos insuficientes"
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ❌ ServicioPago: Solo maneja errores de pago
// ❌ NO maneja errores de usuario, reporte o notificación
// ❌ Error específico del dominio de pagos
// ❌ Evento PagoRechazadoEvent publicado
```

#### **3. Error de Generación de Reporte**
```java
// ENTRADA INVÁLIDA
POST /api/reportes/ventas
{
    "fechaInicio": "2024-01-31",
    "fechaFin": "2024-01-01", // Fecha fin anterior a fecha inicio
    "formato": "PDF"
}

// RESULTADO ESPERADO - ERROR
HTTP 400 Bad Request
{
    "error": "INVALID_DATE_RANGE",
    "message": "Rango de fechas inválido",
    "details": "La fecha de fin debe ser posterior a la fecha de inicio"
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ❌ ServicioReporte: Solo maneja errores de reportes
// ❌ NO maneja errores de usuario, pago o notificación
// ❌ Error específico del dominio de reportes
```

#### **4. Error de Envío de Notificación**
```java
// ENTRADA INVÁLIDA
POST /api/notificaciones
{
    "destinatario": "email-invalido",
    "canal": "EMAIL",
    "mensaje": "Test"
}

// RESULTADO ESPERADO - ERROR
HTTP 400 Bad Request
{
    "error": "INVALID_EMAIL",
    "message": "Email inválido",
    "details": "El formato del email no es válido"
}

// LÓGICA EJECUTADA (SRP RESPETADO):
// ❌ ServicioNotificacion: Solo maneja errores de notificaciones
// ❌ NO maneja errores de usuario, pago o reporte
// ❌ Error específico del dominio de notificaciones
```

### **🔄 Flujos de Comunicación Entre Servicios**

#### **1. Flujo Exitoso: Usuario → Pago → Notificación**
```java
// PASO 1: Crear Usuario
POST /api/usuarios → UsuarioCreadoEvent

// PASO 2: Procesar Pago (escucha UsuarioCreadoEvent)
PagoService.onUsuarioCreado() → ProcesarPagoInicial → PagoCompletadoEvent

// PASO 3: Enviar Notificación (escucha PagoCompletadoEvent)
NotificacionService.onPagoCompletado() → EnviarEmailBienvenida

// RESULTADO ESPERADO:
// ✅ Cada servicio maneja solo su responsabilidad
// ✅ Comunicación asíncrona por eventos
// ✅ Desacoplamiento entre servicios
// ✅ Fallas aisladas por servicio
```

#### **2. Flujo con Error: Pago Rechazado**
```java
// PASO 1: Usuario creado exitosamente
POST /api/usuarios → UsuarioCreadoEvent

// PASO 2: Pago rechazado
PagoService.onUsuarioCreado() → ProcesarPagoInicial → PagoRechazadoEvent

// PASO 3: Notificación de error
NotificacionService.onPagoRechazado() → EnviarEmailError

// RESULTADO ESPERADO:
// ✅ ServicioUsuario: No afectado por el error de pago
// ✅ ServicioPago: Maneja su propio error
// ✅ ServicioNotificacion: Reacciona al evento de error
// ✅ Sistema continúa funcionando
```

### **📈 Métricas de Performance por Servicio**

#### **ServicioUsuario:**
- **Tiempo de respuesta:** 100-300ms
- **Throughput:** 2000-5000 req/seg
- **Errores esperados:** < 1%
- **Responsabilidad:** Solo gestión de usuarios

#### **ServicioPago:**
- **Tiempo de respuesta:** 500-2000ms (incluye proveedor externo)
- **Throughput:** 500-1000 transacciones/seg
- **Errores esperados:** < 5% (incluye rechazos de tarjetas)
- **Responsabilidad:** Solo procesamiento de pagos

#### **ServicioReporte:**
- **Tiempo de respuesta:** 1000-5000ms (generación de archivos)
- **Throughput:** 100-500 reportes/seg
- **Errores esperados:** < 2%
- **Responsabilidad:** Solo generación de reportes

#### **ServicioNotificacion:**
- **Tiempo de respuesta:** 200-800ms (incluye envío externo)
- **Throughput:** 1000-3000 notificaciones/seg
- **Errores esperados:** < 3%
- **Responsabilidad:** Solo envío de notificaciones

### **🛡️ Estrategias de Resiliencia por Servicio**

#### **1. Circuit Breaker por Servicio**
```java
// Cada servicio tiene su propio circuit breaker
@CircuitBreaker(name = "usuarioService")
@CircuitBreaker(name = "pagoService")
@CircuitBreaker(name = "reporteService")
@CircuitBreaker(name = "notificacionService")

// Configuración específica por servicio
usuarioService:
  failure-rate-threshold: 50
  wait-duration-in-open-state: 30s
  
pagoService:
  failure-rate-threshold: 30
  wait-duration-in-open-state: 60s
```

#### **2. Fallback Methods Específicos**
```java
// Fallback específico para cada servicio
public Usuario crearUsuarioFallback(UsuarioRequest request, Exception e) {
    logger.warn("Fallback ejecutado para creación de usuario");
    return new Usuario(); // Usuario temporal
}

public Pago procesarPagoFallback(PagoRequest request, Exception e) {
    logger.warn("Fallback ejecutado para procesamiento de pago");
    return new Pago(); // Pago temporal
}
```

#### **3. Timeout Configuration por Servicio**
```java
// Timeouts específicos según la responsabilidad
usuarioService:
  timeout: 5s
  
pagoService:
  timeout: 30s // Más tiempo para proveedor externo
  
reporteService:
  timeout: 60s // Más tiempo para generación de archivos
  
notificacionService:
  timeout: 10s
```

### **🧪 Pruebas Unitarias por Responsabilidad**

#### **ServicioUsuario - Pruebas Enfocadas:**
```java
@Test
void crearUsuario_ConDatosValidos_DeberiaCrearUsuario() {
    // Solo prueba lógica de usuarios
    // NO prueba pagos, reportes o notificaciones
}

@Test
void actualizarUsuario_ConEmailDuplicado_DeberiaLanzarExcepcion() {
    // Solo prueba validaciones de usuario
    // NO prueba validaciones de otros dominios
}
```

#### **ServicioPago - Pruebas Enfocadas:**
```java
@Test
void procesarPago_ConTarjetaValida_DeberiaCompletarPago() {
    // Solo prueba lógica de pagos
    // NO prueba usuarios, reportes o notificaciones
}

@Test
void procesarPago_ConTarjetaRechazada_DeberiaLanzarExcepcion() {
    // Solo prueba errores de pago
    // NO prueba errores de otros dominios
}
```

### **📊 Comparación: SRP Aplicado vs Violado**

#### **Con SRP Aplicado:**
```java
// ✅ Ventajas
- Código más limpio y mantenible
- Pruebas unitarias simples
- Escalabilidad independiente
- Fallas aisladas
- Despliegue independiente
- Equipos especializados

// 📈 Métricas
- Tiempo de desarrollo: -40%
- Bugs en producción: -60%
- Tiempo de recuperación: -70%
- Satisfacción del equipo: +50%
```

#### **Con SRP Violado:**
```java
// ❌ Desventajas
- Código complejo y difícil de mantener
- Pruebas unitarias complejas
- Escalabilidad limitada
- Fallas en cascada
- Despliegue monolítico
- Equipos sobrecargados

// 📉 Métricas
- Tiempo de desarrollo: +100%
- Bugs en producción: +200%
- Tiempo de recuperación: +300%
- Satisfacción del equipo: -50%
```

Esta implementación del SRP garantiza que cada microservicio tenga una responsabilidad única y bien definida, mejorando significativamente la mantenibilidad, escalabilidad y resiliencia del sistema. 