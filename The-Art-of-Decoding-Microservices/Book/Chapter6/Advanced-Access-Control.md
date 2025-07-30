# Capítulo 6: Seguridad, Monitoreo y Mantenimiento
## Sección: Control de Acceso Avanzado (RBAC y ABAC)

---

### 1. Introducción

En sistemas de microservicios modernos, el control de acceso es fundamental para proteger los recursos y garantizar que solo los usuarios autorizados puedan realizar ciertas acciones. Más allá de la autenticación básica, existen mecanismos avanzados como el **Control de Acceso Basado en Roles (RBAC)** y el **Control de Acceso Basado en Atributos (ABAC)**, que permiten definir políticas de seguridad más flexibles y granulares.

- **RBAC (Role-Based Access Control):** Asigna permisos a roles y roles a usuarios. Ejemplo: un usuario con rol "ADMIN" puede crear, editar y eliminar recursos, mientras que un usuario con rol "USER" solo puede leerlos.
- **ABAC (Attribute-Based Access Control):** Define permisos en función de atributos del usuario, del recurso o del contexto. Ejemplo: solo permitir acceso si el usuario pertenece a un departamento específico o si la solicitud proviene de una ubicación determinada.

---

### 2. Ejemplo de implementación: RBAC y ABAC en Spring Security

A continuación, se muestra cómo implementar un sistema de control de acceso avanzado en una API REST usando **Spring Boot** y **Spring Security**, combinando RBAC y ABAC.

#### Estructura del ejemplo:
- **Modelo de Usuario** con roles y atributos personalizados.
- **Controlador REST** protegido por roles y atributos.
- **Configuración de seguridad** para aplicar reglas RBAC y ABAC.
- **Pruebas unitarias** para validar el control de acceso.

---

### 3. Código fuente detallado y comentado línea por línea

#### 3.1. Modelo de Usuario con roles y atributos

```java
// Clase Usuario que representa a un usuario del sistema
public class Usuario {
    // Identificador único del usuario
    private Long id;
    // Nombre de usuario
    private String username;
    // Contraseña (encriptada)
    private String password;
    // Lista de roles asignados al usuario (por ejemplo: ADMIN, USER)
    private List<String> roles;
    // Atributos adicionales para ABAC (por ejemplo: departamento, ubicación)
    private Map<String, String> atributos;

    // Constructor
    public Usuario(Long id, String username, String password, List<String> roles, Map<String, String> atributos) {
        this.id = id; // Asigna el ID
        this.username = username; // Asigna el nombre de usuario
        this.password = password; // Asigna la contraseña
        this.roles = roles; // Asigna los roles
        this.atributos = atributos; // Asigna los atributos personalizados
    }

    // Getters y setters omitidos por brevedad
}
```

(Continúa con la implementación del servicio, configuración de seguridad y controlador REST...) 