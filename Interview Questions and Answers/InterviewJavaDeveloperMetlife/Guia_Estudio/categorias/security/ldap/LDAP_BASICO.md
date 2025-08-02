# 🔐 LDAP - Guía Básica para Principiantes

## 📋 Índice

1. [¿Qué es LDAP?](#qué-es-ldap)
2. [Conceptos Básicos](#conceptos-básicos)
3. [Estructura de LDAP](#estructura-de-ldap)
4. [Primeros Pasos](#primeros-pasos)
5. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🤔 ¿Qué es LDAP?

### Definición Simple
LDAP (Lightweight Directory Access Protocol) es un protocolo para acceder y gestionar información de directorios, como usuarios, grupos y recursos de una organización.

**¿Para qué se usa?**
- **Autenticación de usuarios**: Verificar quién puede acceder al sistema
- **Autorización**: Determinar qué puede hacer cada usuario
- **Gestión de usuarios**: Crear, modificar y eliminar cuentas
- **Organización**: Estructurar información de la empresa

### Analogía Simple
Imagina LDAP como una **agenda telefónica gigante** de una empresa:
- **Cada entrada** es como una tarjeta de contacto
- **La estructura** es como las secciones de la agenda (empleados, departamentos, etc.)
- **Los atributos** son como los campos de cada tarjeta (nombre, teléfono, email, etc.)
- **Las búsquedas** son como buscar en la agenda por nombre o departamento

---

## 🔧 Conceptos Básicos

### 1. DN (Distinguished Name)
El DN es la dirección única de cada entrada en LDAP.

```ldap
# Ejemplo de DN
cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
```

**Explicación:**
- `cn=Juan Pérez` - Nombre común (Common Name)
- `ou=Empleados` - Unidad organizacional (Organizational Unit)
- `dc=empresa,dc=com` - Componentes del dominio (Domain Components)

### 2. RDN (Relative Distinguished Name)
Es la parte más específica del DN.

```ldap
# En el DN: cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
# El RDN es: cn=Juan Pérez
```

### 3. Atributos
Los atributos contienen la información de cada entrada.

```ldap
# Ejemplo de entrada LDAP con atributos
dn: cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
objectClass: inetOrgPerson
cn: Juan Pérez
sn: Pérez
givenName: Juan
mail: juan.perez@empresa.com
telephoneNumber: +34 123 456 789
department: IT
title: Desarrollador
```

### 4. ObjectClass
Define qué tipo de objeto es y qué atributos puede tener.

```ldap
# ObjectClass comunes
objectClass: top                    # Clase base
objectClass: person                 # Persona
objectClass: organizationalPerson   # Persona organizacional
objectClass: inetOrgPerson          # Persona de Internet
```

---

## 📁 Estructura de LDAP

### Estructura Jerárquica Típica

```
dc=empresa,dc=com
├── ou=Empleados
│   ├── cn=Juan Pérez
│   ├── cn=María García
│   └── cn=Carlos López
├── ou=Departamentos
│   ├── cn=IT
│   ├── cn=RRHH
│   └── cn=Finanzas
└── ou=Grupos
    ├── cn=Administradores
    ├── cn=Desarrolladores
    └── cn=Usuarios
```

### Ejemplo de Entrada Completa

```ldap
# Entrada de usuario
dn: cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: Juan Pérez
sn: Pérez
givenName: Juan
mail: juan.perez@empresa.com
telephoneNumber: +34 123 456 789
mobile: +34 987 654 321
department: IT
title: Desarrollador Senior
employeeNumber: 1001
manager: cn=María García,ou=Empleados,dc=empresa,dc=com
```

---

## 🚀 Primeros Pasos

### 1. Configuración Básica de Spring Boot

```xml
<!-- pom.xml - Dependencias LDAP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-ldap</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-ldap</artifactId>
</dependency>
```

```properties
# application.properties - Configuración básica LDAP
# Configuración del servidor LDAP
spring.ldap.embedded.port=8389
spring.ldap.embedded.ldif=classpath:ldap-data.ldif

# Configuración de Spring Security
spring.security.ldap.server.url=ldap://localhost:8389
spring.security.ldap.server.base=dc=empresa,dc=com
spring.security.ldap.server.manager-dn=cn=admin,dc=empresa,dc=com
spring.security.ldap.server.manager-password=admin123
```

### 2. Configuración de Seguridad Básica

```java
// SecurityConfig.java - Configuración básica de seguridad con LDAP
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/public/**").permitAll() // Páginas públicas
                .antMatchers("/admin/**").hasRole("ADMIN") // Solo admins
                .anyRequest().authenticated() // Resto requiere autenticación
            .and()
            .formLogin() // Formulario de login
            .and()
            .ldapAuthentication() // Autenticación LDAP
                .userSearchBase("ou=Empleados") // Base de búsqueda de usuarios
                .userSearchFilter("(cn={0})") // Filtro de búsqueda
                .groupSearchBase("ou=Grupos") // Base de búsqueda de grupos
                .groupSearchFilter("(member={0})") // Filtro de grupos
                .contextSource()
                    .url("ldap://localhost:8389") // URL del servidor
                    .base("dc=empresa,dc=com") // DN base
                    .managerDn("cn=admin,dc=empresa,dc=com") // DN del manager
                    .managerPassword("admin123"); // Contraseña del manager
        
        return http.build();
    }
}
```

### 3. Datos de Prueba LDAP

```ldif
# ldap-data.ldif - Datos de prueba
dn: dc=empresa,dc=com
objectClass: top
objectClass: dcObject
objectClass: organization
dc: empresa
o: Empresa Ejemplo

dn: ou=Empleados,dc=empresa,dc=com
objectClass: top
objectClass: organizationalUnit
ou: Empleados

dn: cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: Juan Pérez
sn: Pérez
givenName: Juan
mail: juan.perez@empresa.com
telephoneNumber: +34 123 456 789
department: IT
title: Desarrollador
userPassword: {SHA}jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=

dn: cn=María García,ou=Empleados,dc=empresa,dc=com
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: María García
sn: García
givenName: María
mail: maria.garcia@empresa.com
telephoneNumber: +34 987 654 321
department: RRHH
title: Gerente de RRHH
userPassword: {SHA}jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=

dn: ou=Grupos,dc=empresa,dc=com
objectClass: top
objectClass: organizationalUnit
ou: Grupos

dn: cn=Administradores,ou=Grupos,dc=empresa,dc=com
objectClass: top
objectClass: groupOfNames
cn: Administradores
member: cn=María García,ou=Empleados,dc=empresa,dc=com

dn: cn=Desarrolladores,ou=Grupos,dc=empresa,dc=com
objectClass: top
objectClass: groupOfNames
cn: Desarrolladores
member: cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
```

---

## 💡 Ejemplos Prácticos

### 1. Servicio Básico de Usuarios

```java
// UserService.java - Servicio básico de usuarios LDAP
@Service
public class UserService {
    
    @Autowired
    private LdapTemplate ldapTemplate;
    
    // Buscar usuario por nombre
    public User findUserByUsername(String username) {
        String searchBase = "ou=Empleados,dc=empresa,dc=com";
        String searchFilter = "(cn=" + username + ")";
        
        List<User> users = ldapTemplate.search(
            searchBase,
            searchFilter,
            new UserAttributesMapper()
        );
        
        return users.isEmpty() ? null : users.get(0);
    }
    
    // Buscar todos los usuarios
    public List<User> findAllUsers() {
        String searchBase = "ou=Empleados,dc=empresa,dc=com";
        String searchFilter = "(objectClass=inetOrgPerson)";
        
        return ldapTemplate.search(
            searchBase,
            searchFilter,
            new UserAttributesMapper()
        );
    }
    
    // Buscar usuarios por departamento
    public List<User> findUsersByDepartment(String department) {
        String searchBase = "ou=Empleados,dc=empresa,dc=com";
        String searchFilter = "(department=" + department + ")";
        
        return ldapTemplate.search(
            searchBase,
            searchFilter,
            new UserAttributesMapper()
        );
    }
}

// User.java - Modelo de usuario
public class User {
    private String dn;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private String title;
    
    // Constructor, getters y setters
}

// UserAttributesMapper.java - Mapper para convertir atributos LDAP
public class UserAttributesMapper implements AttributesMapper<User> {
    
    @Override
    public User mapFromAttributes(Attributes attributes) throws NamingException {
        User user = new User();
        
        // Mapear atributos LDAP a objeto Java
        if (attributes.get("cn") != null) {
            user.setUsername((String) attributes.get("cn").get());
        }
        
        if (attributes.get("givenName") != null) {
            user.setFirstName((String) attributes.get("givenName").get());
        }
        
        if (attributes.get("sn") != null) {
            user.setLastName((String) attributes.get("sn").get());
        }
        
        if (attributes.get("mail") != null) {
            user.setEmail((String) attributes.get("mail").get());
        }
        
        if (attributes.get("telephoneNumber") != null) {
            user.setPhone((String) attributes.get("telephoneNumber").get());
        }
        
        if (attributes.get("department") != null) {
            user.setDepartment((String) attributes.get("department").get());
        }
        
        if (attributes.get("title") != null) {
            user.setTitle((String) attributes.get("title").get());
        }
        
        return user;
    }
}
```

### 2. Controlador Básico

```java
// UserController.java - Controlador básico
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }
    
    // Obtener usuario por nombre
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Obtener usuarios por departamento
    @GetMapping("/department/{department}")
    public ResponseEntity<List<User>> getUsersByDepartment(@PathVariable String department) {
        List<User> users = userService.findUsersByDepartment(department);
        return ResponseEntity.ok(users);
    }
}
```

### 3. Formulario de Login Básico

```html
<!-- login.html - Formulario de login básico -->
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h2>Iniciar Sesión</h2>
    
    <form action="/login" method="POST">
        <div>
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>
        </div>
        
        <div>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
        </div>
        
        <div>
            <button type="submit">Iniciar Sesión</button>
        </div>
    </form>
    
    <!-- Mostrar errores si los hay -->
    <div th:if="${param.error}">
        <p style="color: red;">Usuario o contraseña incorrectos</p>
    </div>
    
    <div th:if="${param.logout}">
        <p style="color: green;">Sesión cerrada correctamente</p>
    </div>
</body>
</html>
```

### 4. Página de Dashboard

```html
<!-- dashboard.html - Página de dashboard -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>Bienvenido, <span th:text="${#authentication.name}">Usuario</span></h1>
    
    <h2>Información del Usuario</h2>
    <div>
        <p><strong>Nombre:</strong> <span th:text="${user.firstName}">Nombre</span></p>
        <p><strong>Apellido:</strong> <span th:text="${user.lastName}">Apellido</span></p>
        <p><strong>Email:</strong> <span th:text="${user.email}">email@empresa.com</span></p>
        <p><strong>Departamento:</strong> <span th:text="${user.department}">Departamento</span></p>
        <p><strong>Cargo:</strong> <span th:text="${user.title}">Cargo</span></p>
    </div>
    
    <h2>Roles y Permisos</h2>
    <div>
        <p><strong>Roles:</strong></p>
        <ul>
            <li th:each="role : ${#authentication.authorities}" th:text="${role}">ROLE_USER</li>
        </ul>
    </div>
    
    <div th:if="${#authorization.expression('hasRole(''ADMIN'')')}">
        <h3>Panel de Administración</h3>
        <p>Como administrador, tienes acceso a funciones especiales.</p>
        <a href="/admin/users">Gestionar Usuarios</a>
    </div>
    
    <form action="/logout" method="POST">
        <button type="submit">Cerrar Sesión</button>
    </form>
</body>
</html>
```

---

## 🔍 Comandos LDAP Básicos

### 1. Búsquedas Básicas

```bash
# Buscar todos los usuarios
ldapsearch -H ldap://localhost:8389 -D "cn=admin,dc=empresa,dc=com" -w admin123 -b "ou=Empleados,dc=empresa,dc=com" "(objectClass=inetOrgPerson)"

# Buscar usuario específico
ldapsearch -H ldap://localhost:8389 -D "cn=admin,dc=empresa,dc=com" -w admin123 -b "ou=Empleados,dc=empresa,dc=com" "(cn=Juan Pérez)"

# Buscar usuarios por departamento
ldapsearch -H ldap://localhost:8389 -D "cn=admin,dc=empresa,dc=com" -w admin123 -b "ou=Empleados,dc=empresa,dc=com" "(department=IT)"
```

### 2. Agregar Usuario

```bash
# Crear archivo LDIF para nuevo usuario
cat > new-user.ldif << EOF
dn: cn=Ana López,ou=Empleados,dc=empresa,dc=com
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
cn: Ana López
sn: López
givenName: Ana
mail: ana.lopez@empresa.com
telephoneNumber: +34 555 123 456
department: Marketing
title: Especialista de Marketing
userPassword: {SHA}jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=
EOF

# Agregar usuario
ldapadd -H ldap://localhost:8389 -D "cn=admin,dc=empresa,dc=com" -w admin123 -f new-user.ldif
```

### 3. Modificar Usuario

```bash
# Crear archivo LDIF para modificar usuario
cat > modify-user.ldif << EOF
dn: cn=Juan Pérez,ou=Empleados,dc=empresa,dc=com
changetype: modify
replace: title
title: Desarrollador Senior
-
replace: telephoneNumber
telephoneNumber: +34 123 456 789
EOF

# Modificar usuario
ldapmodify -H ldap://localhost:8389 -D "cn=admin,dc=empresa,dc=com" -w admin123 -f modify-user.ldif
```

### 4. Eliminar Usuario

```bash
# Crear archivo LDIF para eliminar usuario
cat > delete-user.ldif << EOF
dn: cn=Ana López,ou=Empleados,dc=empresa,dc=com
changetype: delete
EOF

# Eliminar usuario
ldapmodify -H ldap://localhost:8389 -D "cn=admin,dc=empresa,dc=com" -w admin123 -f delete-user.ldif
```

---

## 📚 Recursos para Aprender Más

### Herramientas Recomendadas:
- **Apache Directory Studio** - Cliente gráfico para LDAP
- **JXplorer** - Explorador LDAP gratuito
- **ldapsearch/ldapadd** - Herramientas de línea de comandos

### Sitios Web:
- [LDAP.com](https://ldap.com) - Recursos LDAP
- [Spring LDAP Documentation](https://docs.spring.io/spring-ldap/docs/current/reference/)

### Libros:
- "LDAP System Administration" por Gerald Carter
- "Understanding and Deploying LDAP Directory Services" por Tim Howes

---

## 🎯 Checklist de Nivel Básico

### Conceptos que debes entender:
- [ ] ¿Qué es LDAP y para qué se usa?
- [ ] Estructura jerárquica de LDAP
- [ ] Concepto de DN y RDN
- [ ] Atributos y ObjectClass
- [ ] Configuración básica de Spring Security con LDAP
- [ ] Búsquedas LDAP básicas
- [ ] Autenticación de usuarios con LDAP

### Habilidades prácticas:
- [ ] Configurar servidor LDAP embebido
- [ ] Crear estructura de directorio básica
- [ ] Implementar autenticación LDAP en Spring Boot
- [ ] Realizar búsquedas LDAP
- [ ] Crear formulario de login que use LDAP
- [ ] Manejar roles y permisos básicos
- [ ] Usar herramientas LDAP de línea de comandos

---

**¡Con estos conceptos básicos ya tienes una base sólida para avanzar al nivel intermedio! 🚀** 