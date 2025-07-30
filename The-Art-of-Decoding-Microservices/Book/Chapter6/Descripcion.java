CHAPTER 6
Microservices 
Security, Monitoring, 
and Maintenance
When it comes to microservices, security is like the sturdy lock on the front 
door of a digital house—it’s absolutely essential. Two basic pillars of this 
security structure are authentication and authorization. They provide a 
safe path for users and systems to work with apps and data. In this chapter, 
let’s dive into what they are, why we should care about them, and how you 
can use them in a Java microservices solution with Spring Security.
Authentication and Authorization
Think of authentication as the Internet equivalent of ID verification. Just 
trying to see if the user/system attempting to access an app is the person 
they appear to be. And this happens by means of usernames, passwords, 
tokens, or even biometric information—fingerprints anyone?
Authentication is proving identity. Authorization is deciding what a 
verified user/system does once in. It’s like, “Oh yeah, you’re in the building 
now, what rooms can you access?” Authorization will identify if a user has 
access to a particular resource or can do certain action based on their roles 
or characteristics.
266
Why It Matters
Authentication and authorization are the lifeblood of microservices 
security as shown in Figure 6-1. Without them, it would be a general public 
house anyone could come and poke around. With solid authentication and 
precise authorization, you are not only locking out unsolicited visitors but 
also making sure everyone is adhering to the norms of engagement.
Implementing these security measures within a Java microservice? 
Spring Security has made this super easy as they provide a great tool to 
build authentication and authorization functions within seconds. Well, 
don’t be afraid; securing your microservices doesn’t have to be a scary 
proposition. With the right equipment and knowledge, you can erect a 
fortress that is as secure as it is effective.
Figure 6-1. Key security measures in microservices architecture—a 
breakdown of essential strategies
Chapter 6 Microservices Security, Monitoring, and Maintenance
267
Ways of Authentication
Simple Authentication: The simplest authentication there is, entering a 
username and password into the headers. Yes, it’s base64 encoded, but 
don’t get too excited; it’s not even the safest option.
Token Authentication: This is more advanced. It’s using tokens such 
as JWT (JSON Web Tokens) or OAuth tokens. Tokens are distributed like 
VIP cards and enrolled for login without constantly retyping usernames 
and passwords.
OAuth: Another classic, OAuth delegates the authentication to an 
outsider (e.g., Google, Facebook). You just wave your Google badge; it’s like 
you can use different services without multiple credentials.
Ways of Authorization
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
Chapter 6 Microservices Security, Monitoring, and Maintenance
268
Implementing Authentication and 
Authorization in Java
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
Chapter 6 Microservices Security, Monitoring, and Maintenance
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
Chapter 6 Microservices Security, Monitoring, and Maintenance
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
Chapter 6 Microservices Security, Monitoring, and Maintenance
271
EXERCISE CHAPTER 6-1
1. Add a new role called “ROLE_MANAGER” and create a 
new user with this role. Add a new endpoint /manager in 
the AuthExampleController that only users with the “ROLE_
MANAGER” can access. Update the security configuration to 
authorize this new role accordingly.
2. Test the new role by creating an additional user and checking 
access to the /manager endpoint. Build the above example in 
any IDE of your choice like IntelliJ or Eclipse.
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
Chapter 6 Microservices Security, Monitoring, and Maintenance
272
Securing Service-to-Service 
Communication
This is not an optional advice to keep the communication between 
services secured in microservices, it is a requirement. As sensitive 
information is transmitted between multiple services, high-level security 
is essential to build trust and make sure that data cannot be intercepted 
or tampered with by an unintended third party. Let’s dive into the basic 
principles behind secure service-to-service communication, some 
common issues that you might encounter, and a Java example using Spring 
Boot to enable HTTPS and standard authentication.
Understanding What We Need: 
Service-to-Service Communication Security
What’s essential to secure service-to-service communication is that data is 
secret, intact, and verified when it is being transferred. Most importantly, 
secrecy involves encoding information so that only the intended recipient 
can decrypt and read it, preventing unauthorized access. It is like writing a 
letter locked and only the receiver can open it.
Then there is integrity—the idea that data should arrive exactly 
where it left off at its origin without being changed in the process. Think 
of it as a form of assurance that the message was not falsified in transit. 
Authentication, finally, lets the sharing services authenticate each other 
before data transfers begin. The digital thumbs up says, “Yes, we are both 
who we say we are,” before any information comes out.
The Implications of Securing Service Communication -
Even such security comes with challenges. Network security is one of 
the most difficult aspects. When services exchange information over public 
or nonsecure lines, the potential is for information to be leaked. Like when 
you send a postcard, without encryption, anyone can read the letter as 
Chapter 6 Microservices Security, Monitoring, and Maintenance
273
it goes along. That is why it is so important to have strong encryption to 
protect the data.
Identity management is another major hurdle. When the distributed 
system exists, each service must be able to identify and authenticate the 
other to avoid a break-in. This calls for an infrastructure that will manage 
identity verification dynamically and securely without breaking the 
integrity of the exchange.
Thirdly, key management has its own complications. Security Keys 
and Certificates: Cryptographic keys and certificates are necessary for 
encryption, but having to keep them safe (store, distribute, and rotate on 
a regular basis) can be like holding delicate valuable things in your hand 
and navigating through them with extreme caution. Mismanagement can 
undermine the entire security layer, so there should be best practices in 
securing these keys over the lifetime.
After learning about these foundational principles and the problems 
with them, developers can deploy secure communication techniques that 
keep the microservices equilibrating data (be it static updates or mission￾critical data).
Summary
Ensuring secure communication between services is nonnegotiable 
in today’s microservices landscape. Protecting data integrity and 
confidentiality while making sure only authorized services are chatting 
with each other helps maintain a robust and trustworthy system. By 
leveraging HTTPS and basic authentication in Java applications using 
frameworks like Spring Boot, developers can set up a solid foundation 
of security. This not only protects sensitive data flowing between 
microservices but also keeps the entire architecture safer and more 
reliable—like setting up a security guard at every doorway to check IDs 
before letting anyone in.
Chapter 6 Microservices Security, Monitoring, and Maintenance
274
Centralized Logging with ELK Stack
Centralized logging is an absolute must to monitor and troubleshoot 
distributed systems and microservices. Consider looking for a needle in a 
haystack—then, say the haystack is in various places. That’s how finding 
problems in microservices is handled without centralized logs. Enter the 
ELK stack (Elasticsearch, Logstash, Kibana), a highly scalable combination 
that makes log consolidation, storage, and visualization simple, if not fast. 
We will see how you can integrate the ELK stack with your Java applications 
to clean up your logs and translate it into useful data in this guide.
The ELK Stack at Work
Let’s begin with a breakdown of the ELK stack power providers and their 
role in the log ecosystem as shown in Figure 6-2.
Elasticsearch is the brain of the operation. It’s a distributed, REST￾based search and analytics system built to index logs in a flash. It’s like the 
library of your logs, categorizing logs in such a way that, if you’re looking 
for specific problems or trends, you can get to the data in a split second.
Figure 6-2. Basic logging strategy for a microservice environment
Chapter 6 Microservices Security, Monitoring, and Maintenance
Chapter 6 Microservices Security, Monitoring, and Maintenance
Then there is Logstash, the data controller. This flexible data 
processing pipeline loads logs from anything, from a file, a TCP/UDP 
stream, or even lightweight log shippers such as Beats, and converts them 
for delivery to Elasticsearch. You can think of it as a customs checkpoint on 
your logs where everything gets organized and labeled before being stored 
in the storage and later processed.
And then there’s the art-world genius: Kibana. Kibana is your savior for 
plotting and browsing all that cleanly structured data. It provides real-time 
reports and live dashboards that you can see trends, investigate anomalies, 
and activate alerts all from an intuitive user interface. And with Kibana, 
you are not just viewing logs, but also turning them into story-driven 
dashboards to show you how your services are running and healthy.
It’s not just a matter of a simple hooking up the ELK stack to your Java 
apps, it’s about an elegant integration with the way logs flow from your app 
into searchable, visually appealing format. Logstash allows you to set up 
pipelines to consume logs from your Java app’s logging framework, such as 
Logback or Log4j. Those logs are fed to Elasticsearch which indexes them 
and publishes them to be querying. Finally, Kibana unifies the three and 
lets you visualize logs in ways that uncover patterns and spot problems 
more quickly—no more wading through endless log files.
Now, with the ELK stack built-in, you can have visibility into your 
whole distributed system in a single view, so you can troubleshoot faster, 
more effectively, and without making guesses. Whether you’re debugging 
a performance bug, tracing a failed transaction, or simply inspecting your 
microservices for general state of health, the ELK stack is the toolkit you 
need to avoid errors and ensure the longevity of your infrastructure.
The ELK stack—your trusty sidekick in the grand quest for centralized 
logging and analytics! At the heart of this dynamic trio (Elasticsearch, 
Logstash, Kibana) lies Beats, those lightweight yet mighty data collectors 
that make sure no log, metric, or network packet escapes your watchful 
eye. Each Beat has its own personality and purpose, like members of an 
eccentric yet highly functional superhero team.
275
Chapter 6 Microservices Security, Monitoring, and Maintenance
Take Filebeat, for instance. It’s like the intern who never sleeps, 
tirelessly tailing log files from web servers, applications, or even that 
obscure system log you forgot existed. Then there’s Metricbeat, your 
fitness tracker for servers and applications—keeping tabs on CPU usage, 
memory, and even how hard your Docker containers are sweating. Think 
of it as your infrastructure’s personal trainer, but without the guilt trips.
Packetbeat is your network detective, nosing around network traffic to 
sniff out latency issues or protocol-level bottlenecks. It’s like the Sherlock 
Holmes of your stack, minus the pipe and hat. Meanwhile, Winlogbeat
plays the role of a bouncer, standing at the door of your Windows systems, 
logging every suspicious move, failed login, or shady error message—just 
in case things get rowdy.
If you’re more of a “paranoid sysadmin” type, you’ll love Auditbeat, 
the Beat that lets you sleep soundly knowing it’s watching user activity 
and monitoring file integrity. On the flip side, Heartbeat is your uptime 
cheerleader, constantly pinging APIs, websites, or services to confirm they’re 
alive and kicking. You could say it’s like your overly attached tech friend who 
won’t stop checking in: “Hey, are you there? How about now? Now?”
For the cloud-savvy among us, Functionbeat has your back, collecting 
logs and metrics from serverless functions like AWS Lambda. It’s proof that 
even in the cloud, someone’s watching (comforting or creepy, depending 
on your perspective). And let’s not forget Journalbeat, the Linux hipster 
that only hangs out with journald logs. It’s minimalistic, efficient, and 
always up to date on what your system services are up to.
Together, these Beats form the ultimate data-ingestion squad, ensuring 
that no matter what you’re monitoring—be it systems, services, or 
networks—you’re covered. Integrating Beats into your stack is like adding 
extra horsepower to an already well-oiled engine. It’s the kind of efficiency 
that doesn’t just solve problems—it anticipates them. And let’s face it, who 
doesn’t want a sidekick that works smarter, not harder?
276
277
Setting Up ELK Stack
Install and Configure Elasticsearch
• Download and install Elasticsearch from Elasticsearch 
Downloads.
• Configure Elasticsearch settings (elasticsearch.yml) for 
cluster and node configurations.
Install and Configure Logstash
• Download and install Logstash from https://www.
elastic.co/downloads/logstash.
• Configure Logstash pipelines (logstash.conf) for input, 
filter, and output plug-ins to process and forward logs 
to Elasticsearch.
Install and Configure Kibana
• Download and install Kibana from https://www.
elastic.co/downloads/kibana.
• Configure Kibana (kibana.yml) to connect to 
Elasticsearch and specify settings for visualization.
Integrating Java Application with ELK Stack
To demonstrate centralized logging with ELK stack using a Java 
application, let’s consider a basic Spring Boot application logging events 
to Logstash, which then forwards them to Elasticsearch for storage and 
Kibana for visualization.
Chapter 6 Microservices Security, Monitoring, and Maintenance
278
Add dependencies:
<dependency>
 <groupId>net.logstash.logback</groupId>
 <artifactId>logstash-logback-encoder</artifactId>
 <version>7.4</version>
 <scope>runtime</scope>
</dependency>
Configure Logback for Logstash Appender
Create logback-spring.xml in src/main/resources to configure Logback 
with Logstash appender:
<configuration>
 <include resource="org/springframework/boot/logging/
logback/defaults.xml" />
 <appender name="logstash" class="net.logstash.logback.
appender.LogstashTcpSocketAppender">
 <destination>logalhost:5000</destination>
 <encoder class="net.logstash.logback.encoder.
LogstashEncoder"></encoder>
 </appender>
 <root level="INFO">
 <appender-ref ref="logstash"/>
 </root>
</configuration>
Run Logstash
Start Logstash with a configuration (logstash.conf) to listen on TCP port 
5000, parse incoming logs, and send them to Elasticsearch.
1. Run Elasticsearch and Kibana
Start Elasticsearch and Kibana to interact with and 
visualize logs stored in Elasticsearch.
Chapter 6 Microservices Security, Monitoring, and Maintenance
279
2. Generate Logs in Java Application
Create a simple controller in your Spring Boot 
application to generate logs:
@RestController
public class HelloWorldController {
 private static final Logger logger = LoggerFactory.
getLogger(HelloWorldController.class);
 @GetMapping("/hello")
 public String hello() {
 logger.info("Hello World! Logging from Spring 
Boot application");
 return "Hello World!";
 }
}
3. View Logs in Kibana
• Access Kibana at http://localhost:5601.
• Create index pattern myapp-* to visualize logs 
stored in Elasticsearch.
• Explore logs with various visualizations and 
dashboards provided by Kibana.
Summary
Centralized logging using the ELK stack provides powerful tools for 
gathering, storing, and visualizing logs from distributed systems and 
microservices. By integrating Java applications with ELK through 
frameworks like Spring Boot, Logback, and Logstash, you set the stage 
for efficient log management, quick troubleshooting, and comprehensive 
performance monitoring. With the ELK stack’s capabilities, teams gain 
Chapter 6 Microservices Security, Monitoring, and Maintenance
Chapter 6 Microservices Security, Monitoring, and Maintenance
improved operational visibility, making debugging less of a scavenger 
hunt and more of a guided tour. This approach ensures your microservices 
architecture remains scalable, reliable, and efficient. Mastering centralized 
logging with the ELK stack equips developers and operations teams with 
the insight needed to manage, maintain, and optimize cloud-native 
applications with confidence and ease.
Monitoring Health and Performance
Maintaining health and performance of Java apps is more than best 
practice—it’s survival, to make sure that your systems function, bugs get 
pounded early, and resources get spent efficiently. When everything is 
distributed and changing, monitoring all parts’ health is essential in a 
microservices environment. In this chapter, you’ll learn how to implement 
health checks, collect metrics, and check on your Java application with 
Spring Boot Actuator, among other useful features.
Health checks are just like doctor’s visits for your app; they check 
if it is in good health by examining key components like databases and 
dependencies. Health checks deliver endpoints indicating the state of the 
application in case something’s wrong, helping developers and operators 
see the problem early before it becomes out of hand.
Metrics collection, by contrast, is a process of keeping track of the 
in-depth stuff. From JVM memory to HTTP request latency, you can 
monitor it all. As you track such metrics, you’ll be able to see how your app 
is performing and if it’s utilizing resources effectively. It’s your computer 
equivalent of a fitness monitor—only that in this case you don’t want to 
know when the software is burning too much “calorie” (i.e., memory) or 
slowing down under load.
All of this data has to be gathered by monitoring systems, such as 
Prometheus, Grafana, and Micrometer. These tools do not only collect 
and save metrics, but can display them in real-time through interactive 
280
281
dashboards. You can also configure your own custom health metrics and 
endpoints to get the full visibility into your application performance. 
With these tools, your app transforms from a black box into an open and 
transparent environment where every performance blip and blop can be 
spotted, analyzed, and addressed—keeping your services healthy and 
responsive.
Implementing Health Checks with Spring 
Boot Actuator
Add Spring Boot Actuator Dependency
Include Spring Boot Actuator in your pom.xml:
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
Configure Health Indicators
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpStatusCodeException;
@Component
public class ApiHealthIndicator implements HealthIndicator {
 private static final String API_URL = "https://api.example.
com/health";
Chapter 6 Microservices Security, Monitoring, and Maintenance
282
 @Override
 public Health health() {
 if (isApiUp()) {
 return Health.up().withDetail("Message", 
"API is up").build();
 } else {
 return Health.down().withDetail("Message", 
"API is down").build();
 }
 }
 private boolean isApiUp() {
 //Add code to check if API is up and running
 return true; // If no exception, the API is up
 } catch (HttpStatusCodeException e) {
 // Log the error or handle specific HTTP 
status codes
 System.err.println("API is down: " + 
e.getStatusCode());
 } catch (Exception e) {
 // Handle other exceptions like timeouts
 System.err.println("API is down: " + 
e.getMessage());
 }
 return false; // Return false if an exception occurs
 }
}
Chapter 6 Microservices Security, Monitoring, and Maintenance
283
Enable Actuator Endpoints
Configure Actuator endpoints in application.properties or application.yml:
# application.yml
management:
 endpoints:
 web:
 exposure:
 include: '*'
Access health endpoint: http://localhost:8080/actuator/health
Explanation
The application exposes Actuator endpoints by configuring them in 
application.yml to include all (‘*’). This allows access to various built-in 
endpoints, such as /actuator as shown in Figure 6-3, followed by /actuator/
health as shown in Figure 6-4.
Chapter 6 Microservices Security, Monitoring, and Maintenance
Chapter 6 Microservices Security, Monitoring, and Maintenance
Figure 6-3. This diagram represents how an actuator endpoint will 
look like on a browser
284
285
Figure 6-4. This diagram represents how a health endpoint will look 
like on the browser from actuator
Actuator with Kubernetes
In the case of a Spring Boot application deployed on Kubernetes, the 
Actuator module can be used to generate readiness and liveness probes 
for Kubernetes health monitoring. Such probes help Kubernetes track the 
health of the application and detect if the container is available for traffic 
or it needs to be restarted.
Endpoints in Spring Boot for Kubernetes
Spring Boot provides Actuator health endpoints that can be used directly 
for readiness and liveness checks:
1. Liveness Probe Endpoint: This endpoint indicates 
whether the application is still running and should 
not be restarted. Default endpoint: /actuator/
health/liveness.
2. Readiness Probe Endpoint: This endpoint 
indicates whether the application is ready to serve 
requests. Default endpoint: /actuator/health/
readiness.
Chapter 6 Microservices Security, Monitoring, and Maintenance
286
Configuration in application.properties
Activate the readiness and liveness probes:
management.endpoint.health.probes.enabled=true management.
endpoints.web.exposure.include=health
This ensures that the /health/liveness and /health/readiness 
endpoints are exposed for Kubernetes to access.
Kubernetes YAML Example
You can configure the probes in your Kubernetes Deployment YAML file 
like this:
livenessProbe:
 httpGet:
 path: /actuator/health/liveness
 port: 8080
 initialDelaySeconds: 5
 periodSeconds: 10
readinessProbe:
 httpGet:
 path: /actuator/health/readiness
 port: 8080
 initialDelaySeconds: 10
 periodSeconds: 5
initialDelaySeconds: Time to wait before the probe starts after the 
container starts
periodSeconds: Frequency of probe checks
Chapter 6 Microservices Security, Monitoring, and Maintenance
287
How They Work in Kubernetes
1. Liveness Probe: If the application becomes 
unresponsive or enters a “broken” state, Kubernetes 
will use this probe to determine if the container 
should be restarted.
2. Readiness Probe: Indicates whether the application 
is ready to serve requests. Kubernetes will not route 
traffic to a pod until the readiness check passes.
Metrics Collection and Monitoring 
with Prometheus and Grafana
Especially for microservices, metrics and monitoring serve as a lifeline. 
You can’t forget about the performance of your applications when 
you have a bunch of different services that need to follow along like a 
choreographed dance. That is, if you take Prometheus and Grafana, the 
free-floating set of open source monitoring frameworks that have made 
this all possible. Together, these two provide a single, complete, and easy 
way to gather and visualize app metrics that help developers and ops 
maintain their systems’ availability and performance.
Prometheus is a time-series database designed with monitoring in 
mind. It gathers metrics from tracked targets by scraping HTTP endpoints 
periodically. Imagine it is a constant worker bee, constantly checking in 
and collecting information to see how everything is working. And it doesn’t 
just collect data, but also stores that data effectively and has a query 
language called PromQL that lets you do real-time analytics and accurate 
monitoring.
Chapter 6 Microservices Security, Monitoring, and Maintenance
288
Grafana, however, is the musician of this collaboration. It’s a data 
visualization and monitoring solution that transforms the metrics 
that Prometheus collects into gorgeous, customizable dashboards. It 
visualizes data across different sources and lets you monitor your services’ 
status in real time, with dynamic graphs and alerts customized to your 
requirements.
Let’s dive into how these tools work together with a Java application. 
Prometheus, like a curious observer, will scrape metrics from your 
application’s endpoints, storing all the essential data. Grafana steps in to 
create dashboards that visualize these metrics, helping you not just see but 
understand the performance patterns and any anomalies in your services. 
You can set up Prometheus to track things like request rates, error counts, 
memory usage, and anything else you want to keep an eye on. Grafana 
then transforms this data into interactive, user-friendly visuals, making 
your monitoring experience not just informative but genuinely engaging.
Understanding the components of this stack is key. Prometheus is 
your data collector and analyzer, purpose-built for handling time-series 
metrics with efficiency and flexibility. Grafana is your visualizer, turning 
numbers into insightful dashboards that provide clarity and control over 
your system’s performance. Together, they create an invaluable toolset 
for anyone working with cloud-native applications, ensuring that your 
microservices not only work well but work smart.
Setting Up Prometheus
1. Download and Install Prometheus
• Download Prometheus from Prometheus 
Downloads.
• Extract the downloaded archive and configure 
prometheus.yml for scraping targets.
Chapter 6 Microservices Security, Monitoring, and Maintenance
289
2. Configure in pom.xml
<dependency>
 <groupId>io.micrometer</groupId>
 <artifactId>micrometer-registry-prometheus
</artifactId>
 <scope>runtime</scope>
</dependency>
3. Configure prometheus.yml
Example configuration to scrape metrics from a Java 
application:
global:
scrape_interval: "15s"
scrape_configs:
 - job_name: 'java-app'
 metrics_path: '/actuator/prometheus'
 static_configs:
 - targets: ['localhost:8080']
Configure Prometheus to scrape metrics from 
localhost:8080/actuator/prometheus endpoint 
exposed by the Java application.
4. Run Prometheus
Start Prometheus server by running prometheus.exe 
(on Windows) or prometheus (on Linux/Mac):
./prometheus --config.file=prometheus.yml
Access Prometheus at http://localhost:9090 to 
explore metrics and execute queries using PromQL.
Chapter 6 Microservices Security, Monitoring, and Maintenance
290
Visualizing Metrics with Grafana
1. Download and Install Grafana
• Download Grafana from Grafana Downloads.
• Install and configure Grafana according to your 
operating system.
2. Add Prometheus Data Source
• Access Grafana at http://localhost:3000 (default port).
• Add Prometheus as a data source (Configuration ➤
Data Sources ➤ Add data source).
• URL: http://localhost:9090
• Access: Direct
3. Create Grafana Dashboards
• Create a new dashboard (+ ➤ Dashboard ➤ Add 
new panel).
• Select Prometheus data source and use PromQL 
queries to visualize metrics.
• Example: Create a panel to monitor JVM thread 
count (jvm_threads_current) over time.
Example Java Application Metrics Dashboard 
in Grafana
• Dashboard Example
• Visualizes JVM metrics (jvm_threads_current) 
and HTTP request metrics (http_server_requests_
seconds_count) from the Java application.
Chapter 6 Microservices Security, Monitoring, and Maintenance
Chapter 6 Microservices Security, Monitoring, and Maintenance
Figure 6-5. This diagram shows Prometheus home page running on 
port 9090
Figure 6-6. This image shows Grafana home page running on 
port 3000
291
Chapter 6 Microservices Security, Monitoring, and Maintenance
Figure 6-7. This image shows Prometheus parameters available for 
jvm_memory_used_bytes
Figure 6-8. This image shows Prometheus jvm_memory_used_bytes
292
293
Figure 6-9. This image shows Grafana dashboard showing input 
from Prometheus
Summary
Prometheus and Grafana are a dynamic duo when it comes to metrics 
collection, monitoring, and visualization for Java applications and 
microservices. By pairing Prometheus with Java applications through 
Micrometer, and then using Grafana to bring those metrics to life with 
intuitive dashboards, teams can unlock a treasure trove of insights into 
performance, resource usage, and long-term trends. Embracing these 
tools empowers developers and ops teams alike to keep a sharp eye on 
their cloud-native setups, fine-tuning performance and swiftly addressing 
issues. This combination ensures not only that apps stay uptime and 
scalable, but that they respond fast in the dynamic world of production 
environments. The important thing is, everything gets handled as 
smoothly as possible—sometimes with a dash of flair!
Chapter 6 Microservices Security, Monitoring, and Maintenance
294
Versioning and Backward Compatibility
Versioning microservices and ensuring backward compatibility are vital 
for keeping your system agile, adapting to changing business needs, and 
rolling out updates smoothly—without leaving your service consumers 
in the lurch. This guide delves into the various strategies for versioning 
microservices and explains how to maintain backward compatibility in 
Java-based environments.
One of the primary strategies is URI Versioning, which involves 
embedding the version number directly into the URI path, like /api/v1/
resource. This is a clear and straightforward approach, making it obvious 
to consumers which version they are interacting with. It’s a tried-and-true 
method, simple and easy to implement, but it can sometimes clutter your 
endpoints as versions accumulate.
Another method is Query Parameter Versioning, where you specify 
the version using query parameters, such as /api/resource?v=1. This 
is flexible, allowing changes without altering the URI structure, but it 
requires clients to be vigilant about including the right parameters.
Header Versioning adds a layer of sophistication by using custom 
headers to indicate the version, such as Accept: application/vnd.company.
resource.v1+json. Think of it as a secret handshake between client and 
server—clean and effective, though it demands that clients understand 
how to format requests properly. Alternatively, there’s Media Type 
Versioning, where the media type itself specifies the version (application/
vnd.company.resource-v1+json). This approach is particularly useful 
when engaging in content negotiation, offering flexibility but potentially 
adding complexity when managing numerous versions.
Ensuring backward compatibility is where the real finesse comes in. 
It’s all about evolving your services without breaking existing clients—a 
bit like upgrading the plumbing in your house without shutting off the 
water. Techniques such as additive changes—where you only add new 
features without removing or altering existing ones—help maintain 
Chapter 6 Microservices Security, Monitoring, and Maintenance
295
stability. Semantic Versioning is another crucial tool, where version 
numbers like 1.0.0 for major updates, 1.1.0 for minor improvements, and 
1.1.1 for patches clearly communicate the nature of changes. Additionally, 
deprecation policies allow you to phase out old versions gracefully, giving 
consumers enough time to adapt before making any disruptive changes.
By applying these versioning strategies and backward compatibility 
techniques, developers can ensure that their microservices architecture 
remains robust, adaptable, and client-friendly, even as the services grow 
and evolve over time.
Implementing Versioning and Backward 
Compatibility
Create a simple Spring Boot project with Spring Initializer and create a 
REST controller with URI versioning using Spring annotations:
 @RestController
@RequestMapping("/api/v1")
public class UserControllerV1 {
 @GetMapping("/users")
 public String getUsersV1() {
 return "Version 1: List of users";
 }
}
Add Version 2 with Backward Compatibility
Extend the controller to add version 2 while maintaining backward 
compatibility:
@RestController
@RequestMapping("/api/v2")
public class UserControllerV2 {
 @GetMapping("/users")
Chapter 6 Microservices Security, Monitoring, and Maintenance
296
 public String getUsersV2() {
 return "Version 2: List of users with additional 
fields";
 }
 @GetMapping(value = "/users", headers = "X-API-Version=2")
 public String getUsersV2HeaderVersion() {
 return "Version 2: List of users with additional fields 
(header version)";
 }
}
Explanation
This setup demonstrates how to implement API versioning using both 
URL paths and headers, providing flexibility and ensuring older clients 
can continue using version 1 while newer clients can take advantage of 
version 2.
EXERCISE CHAPTER 6-2
1. Create a new controller class (UserControllerV3) for version 3 
using /api/v3 as the base path.
2. Add an endpoint /users to return “Version 3: Users with 
enhanced features.”
3. Add backward compatibility by configuring this endpoint to also 
respond to version 3 requests via the header “X-API￾Version=3.”
4. Refactor your version 2 and version 3 controllers to use a base 
controller (BaseUserController) that contains common logic. 
Make sure that each version still works correctly and backward 
compatibility is maintained.
Chapter 6 Microservices Security, Monitoring, and Maintenance
297
Summary
Versioning and maintaining backward compatibility in microservices 
are essential for handling API evolution while meeting the varied needs 
of clients. Implementing strategies such as URI versioning and header 
versioning in Java-based microservices allows developers to manage 
changes gracefully, enhance system flexibility, and maintain strong, 
reliable connections with service consumers. By understanding these 
approaches and applying industry best practices, teams can evolve 
their microservices architecture smoothly, minimizing disruptions and 
ensuring seamless version transitions in live environments.
Grasping these concepts and their practical application not only 
empowers developers to build resilient and adaptable systems but also 
ensures they are equipped to handle the modern complexities of secure 
and distributed architectures.
Conclusion
Congratulations, you’ve just scaled the Everest of microservices security, 
monitoring, and maintenance! In this chapter, we unraveled the intricate 
tapestry of keeping your microservices safe, efficient, and humming like 
a well-tuned orchestra. From the unyielding guards of authentication 
and authorization to the tactical ninjas of secure service-to-service 
communication, we’ve covered it all. Think of your microservices 
ecosystem as a fortress, with Spring Security as your gatekeeper, HTTPS 
your armored messenger, and JWT tokens the VIP badges for those 
allowed inside. Pretty neat, right?
Logging, meanwhile, became the Sherlock Holmes of our 
microservices mystery. With the ELK stack as our magnifying glass, even 
the sneakiest bugs and errors don’t stand a chance. Add Prometheus 
and Grafana to the mix, and you’ve got yourself a high-tech control room 
Chapter 6 Microservices Security, Monitoring, and Maintenance
Chapter 6 Microservices Security, Monitoring, and Maintenance
with dashboards that turn raw data into stories worth telling. Whether 
it’s CPU usage or those suspicious latency spikes, nothing escapes your 
watchful eye.
Of course, it’s not all about what you know now but what you prepare 
for. Versioning and backward compatibility? They’re your keys to futureproofing. As your services evolve, these strategies ensure you’re building 
bridges, not barriers, for users and clients alike. Add the polish of 
Kubernetes readiness probes, and your microservices are as resilient as 
they are scalable.
Next up, we shift gears to dissect real-world case studies and learn 
from the titans of microservices architecture. “Lessons from Case Studies, 
Avoiding Pitfalls, and Shaping the Future” will show you not only what 
works but also what doesn’t—because let’s be honest, sometimes it’s 
the near disasters that teach us the most. Get ready to dive into tales of 
triumph, stumble, and everything in between. Stay tuned!
298