package com.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
//traducir parrafo
//@EnableWebSecurity habilita las características de seguridad web de Spring Security.
//Se define un UserDetailsService personalizado para crear dos usuarios en memoria (user con rol USER y admin con rol ADMIN), con contraseñas codificadas usando BCryptPasswordEncoder.
//El método securityFilterChain configura la configuración de seguridad. Establece reglas de autorización: las rutas que comienzan con /user requieren ROLE_USER, /admin requiere ROLE_ADMIN, y otras rutas pueden ser accedidas por usuarios con cualquiera de los roles. Esta configuración asegura la aplicación, restringiendo el acceso a diferentes partes según los roles de los usuarios, y utiliza usuarios en memoria para pruebas y propósitos de demostración.






