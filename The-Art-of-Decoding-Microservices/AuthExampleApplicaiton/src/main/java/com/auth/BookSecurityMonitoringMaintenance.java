CHAPTER 6
Microservices
Security, Monitoring,
and Maintenance

When it comes to microservices, security is like the sturdy lock on the front
door of a digital house—it’s absolutely essential. Two basic pillars of this
security structure are authentication and authorization. They provide a
safe path for users and systems to work with apps and data. In this chapter,
let’s dive into what they are, why we should care about them, and how you
can use them in a Java microservices solution with Spring Security.
    //Traduccion documnento
    //Cuando se trata de microservicios, la seguridad es como el candado robusto en la puerta principal de una casa digital: es absolutamente esencial. 
    // Dos pilares fundamentales de esta estructura de seguridad son la autenticación y la autorización. 
    // Proporcionan un camino seguro para que los usuarios y sistemas trabajen con aplicaciones y datos. En este capítulo, vamos a sumergirnos en qué son, por qué debemos prestarles atención y cómo puedes usarlos en una solución de microservicios Java con Spring Security.

Authentication and Authorization
Think of authentication as the Internet equivalent of ID verification. Just
trying to see if the user/system attempting to access an app is the person
they appear to be. And this happens by means of usernames, passwords,
tokens, or even biometric information—fingerprints anyone?
Authentication is proving identity. Authorization is deciding what a
verified user/system does once in. It’s like, “Oh yeah, you’re in the building
now, what rooms can you access?” Authorization will identify if a user has
access to a particular resource or can do certain action based on their roles
or characteristics.
    //Autenticación y autorización
    //Piensa en la autenticación como el equivalente en Internet de la verificación de identidad. Simplemente tratando de ver si el usuario/sistema que intenta acceder a una aplicación es la persona que aparenta ser. Y esto se hace mediante nombres de usuario, contraseñas, tokens o incluso información biométrica, como huellas dactilares.
    //La autenticación es probar la identidad. La autorización es decidir lo que hace un usuario/sistema autenticado una vez dentro. Es como, "Oh, sí, ya estás en el edificio, ¿a qué salas puedes acceder?". La autorización identificará si un usuario tiene acceso a un recurso o puede realizar ciertas acciones según sus roles o características.



266
Why It Matters
Authentication and authorization are the lifeblood of microservices
security as shown in Figure 6-1. Without them, it would be a general public
house anyone could come and poke around. With solid authentication and
precise authorization, you are not only locking out unsolicited visitors but
also making sure everyone is adhering to the norms of engagement.
Implementing these security measures within a Java microservice?
Spring Security has made this super easy as they provide a great tool to
build authentication and authorization functions within seconds. Well,
don’t be afraid; securing your microservices doesn’t have to be a scary
proposition. With the right equipment and knowledge, you can erect a
fortress that is as secure as it is effective.
    //Traduccion documnento
    //La autenticación y la autorización son la sangre vital de la seguridad de los microservicios, como se muestra en la Figura 6-1. Sin ellos, sería una casa pública a la que cualquiera podría entrar y echar un vistazo. Con autenticación y autorización sólidas, no solo estás rechazando a los visitantes no solicitados, sino también asegurándote de que todos cumplan con las normas de participación.
    //Implementar estas medidas de seguridad dentro de un microservicio Java?
    //Spring Security ha hecho esto super fácil, ya que proporcionan una gran herramienta para construir funciones de autenticación y autorización en segundos. Bueno, no tengas miedo; asegurar tus microservicios no tiene por qué ser una propuesta aterradora. Con el equipo y el conocimiento adecuados, puedes erigir un castillo que sea tan seguro como efectivo.


Figure 6-1. Key security measures in microservices architecture—a
breakdown of essential strategies

Chapter 6 MiCroserviCes seCurity, Monitoring, and MaintenanCe
267
Ways of Authentication
Simple Authentication: The simplest authentication there is, entering a
username and password into the headers. Yes, it’s base64 encoded, but
don’t get too excited; it’s not even the safest option.
Token Authentication: This is more advanced. It’s using tokens such
as JWT (JSON Web Tokens) or OAuth tokens. Tokens are distributed like
VIP cards and enrolled for login without constantly retyping usernames
and passwords.
    //Traduccion documnento
    //Autenticación basada en roles (RBAC): Este mecanismo asigna derechos según los roles de los usuarios. Por ejemplo, un "admin" puede ver todo (por suerte), y un "user" solo puede ver o editar ciertos recursos.
    //Autenticación basada en atributos (ABAC): Un poco más especializado, ABAC funciona tomando los atributos del usuario, como su ubicación, empresa o cargo, para filtrar lo que pueden ver. Un usuario de "finanzas", por ejemplo, solo podría ver datos financieros, y un empleado de "marketing" solo podría ver datos de campañas.
    //Control de acceso basado en políticas (PBAC): Este modelo es básicamente el uso de políticas predefinidas para permitir o denegar el acceso en un momento determinado o en cualquier nivel de seguridad.



OAuth: Another classic, OAuth delegates the authentication to an
outsider (e.g., Google, Facebook). You just wave your Google badge; it’s like
you can use different services without multiple credentials.
Ways of Authorization
Role-Based Access Control (RBAC): This mechanism allocates rights
based on user roles. So, for instance, an “admin” can see everything (lucky
them), and a “user” can only see or edit certain resources.
Attribute-Based Access Control (ABAC): A bit more specialized,
ABAC works by taking the user’s attributes such as location, company, or
title to filter out what they can see. A user of “finance,” for example, might
only be able to see financials, and a “marketing” employee will only be
able to see campaign data.
Policy-Based Access Control (PBAC): This model is basically a use of
prebuilt policies to allow or deny access on a certain time of day or at any
given level of security.
    //Traduccion documnento
    //Autenticación basada en roles (RBAC): Este mecanismo asigna derechos según los roles de los usuarios. Por ejemplo, un "admin" puede ver todo (por suerte), y un "user" solo puede ver o editar ciertos recursos.
    //Autenticación basada en atributos (ABAC): Un poco más especializado, ABAC funciona tomando los atributos del usuario, como su ubicación, empresa o cargo, para filtrar lo que pueden ver. Un usuario de "finanzas", por ejemplo, solo podría ver datos financieros, y un empleado de "marketing" solo podría ver datos de campañas.
    //Control de acceso basado en políticas (PBAC): Este modelo es básicamente el uso de políticas predefinidas para permitir o denegar el acceso en un momento determinado o en cualquier nivel de seguridad.

Chapter 6 MiCroserviCes seCurity, Monitoring, and MaintenanCe
268
Implementing Authentication and
Authorization in Java
Add Spring Security Dependency: Include Spring Security in your Maven
pom.xml file.
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-security</artifactId>
</dependency>
Configure Spring Security: Create a configuration class to customize
security settings.
@Configuration
@EnableWebSecurity
public class SecurityConfig {
String str = "hello";
@Bean
public UserDetailsService userDetailsService(){
UserDetails user1 = User.builder()
.username("user")
.password(bCryptPasswordEncoder().
encode("user"))
.authorities("ROLE_USER")
.build();
UserDetails admin = User.builder()
.username("admin")
.password(bCryptPasswordEncoder().
encode("admin"))
.authorities("ROLE_ADMIN")
.build();
Chapter 6 MiCroserviCes seCurity, Monitoring, and MaintenanCe
269
return new InMemoryUserDetailsManager(user1,admin);
}
@Bean
public SecurityFilterChain securityFilterChain
(HttpSecurity http) throws Exception{
http
.headers(header -> header.frameOptions
(HeadersConfigurer.FrameOptionsConfig::
disable))
.csrf(AbstractHttpConfigurer::disable)
.formLogin(AbstractHttpConfigurer::disable)
.authorizeHttpRequests(req -> req.
requestMatchers("/user/**").hasRole
("USER"))
.authorizeHttpRequests(req -> req.
requestMatchers("/admin/**").hasRole
("ADMIN"))
.authorizeHttpRequests(req -> req.
requestMatchers("/**").hasAnyRole
("USER", "ADMIN"))
.authorizeHttpRequests(req -> req.
anyRequest().authenticated())
.httpBasic(Customizer.withDefaults());
return http.build();
}
@Bean
public BCryptPasswordEncoder bCryptPasswordEncoder(){
return new BCryptPasswordEncoder();
}
}
Chapter 6 MiCroserviCes seCurity, Monitoring, and MaintenanCe
270
Create a Spring Boot Application: Develop a simple Spring Boot
application with REST endpoints.
@RestController
public class AuthExampleController {
@GetMapping("/")
public String home() {
return "Welcome to the home page!";
}
@GetMapping("/user")
public String user() {
return "Welcome User!";
}
@GetMapping("/admin")
public String admin() {
return "Welcome Admin!";
}
}
Explanation
@EnableWebSecurity enables Spring Security’s web security features. A
custom UserDetailsService is defined to create two in-memory users (user
with role USER and admin with role ADMIN), with passwords encoded
using BCryptPasswordEncoder. The securityFilterChain method
configures security settings. It sets up authorization rules: paths starting
with /user require ROLE_USER, /admin requires ROLE_ADMIN, and other
paths can be accessed by users with either role. This setup secures the
application, restricting access to different parts based on user roles, and
uses in-memory users for testing and demonstration purposes.
Chapter 6 MiCroserviCes seCurity, Monitoring, and MaintenanCe
271
EXERCISE CHAPTER 6-1
1. add a new role called “ROLE_MANAGER” and create a
new user with this role. add a new endpoint /manager in
the authexampleController that only users with the “ROLE_
MANAGER” can access. update the security configuration to
authorize this new role accordingly.
2. test the new role by creating an additional user and checking
access to the /manager endpoint. Build the above example in
any ide of your choice like intelliJ or eclipse.
Summary
Securing applications with authentication and authorization is like setting
up the bouncer and the VIP list for your software—only the right folks get
in, and they can only access what they’re supposed to. These mechanisms
are fundamental in keeping your application safe from unauthorized
access and malicious activity. By leveraging robust frameworks like
Spring Security in Java, developers can implement secure login processes,
manage user permissions effectively, and enforce strict access controls
over sensitive resources. It’s not about ticking a security checkbox, but
rather establishing trust with your users, keeping their data safe, and
demonstrating that your app follows the law in terms of compliance. It’s
not only smart to be aware of these principles and build them into your
software, it’s the key to a reliable and secure system users can trust.


