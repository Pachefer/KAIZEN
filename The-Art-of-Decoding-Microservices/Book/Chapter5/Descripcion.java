CHAPTER 5
Testing, Deploying, 
and Scaling 
Microservices
Testing microservices is like shepherding a flock of wild and naughty cats. 
Each service is its own—autonomously created, delivered, and scaled—yet 
they all must operate perfectly. Where monoliths have a little bit easier 
testing, microservices have the added challenge of making each service 
integrate with others. The goal is not merely that one service does function, 
but that it communicates, handles failures gracefully, and doesn’t doom 
the system like dominoes.
Let’s dive into this chapter and see how to solve the testing problems 
in microservices. Testing microservices isn’t as fun as swinging chainsaws, 
and using the right strategies and resources, you can build a testing 
process that’s robust, effective, and, yes, fun. Buckle up because we’re 
going to pack your microservices for the wild without stressing out 
your day.
236
Unit Testing
Unit testing acts as your individual performance evaluation of each 
microservices puzzle. When working with microservices, unit testing 
involves being able to focus on individual pieces—tiny units of 
functionality—and verifying they are doing what they’re supposed to do by 
themselves. This is testing them in isolation, where they don’t interact with 
any other component of the system, ensuring each one works exactly as 
intended. Consider it as a prevention for problems when all the bells and 
whistles are working together.
For microservices, where every service runs in isolation but must 
integrate with the ecosystem, unit testing is even more essential. Not only 
checking that a function returns the correct value, but making sure your 
microservices are able to stand on their own when deployed out in the 
world. The benefit of microservices unit testing is that you can be assured 
of the quality of your code before it gets to other integrated tests. Plus, 
catching errors early in the process means less stress later down the road—
and who doesn’t want that?
Example: Unit Testing with JUnit and Mockito
Add Dependencies
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-test</artifactId>
 <scope>test</scope>
</dependency>
Chapter 5 Testing, Deploying, and Scaling Microservices
237
Create a Simple Service Class
ItemService.java:
public interface ItemService {
 public List<Item> getAllItems();
 public Optional<Item> getItemById(Long id);
 public void addItem(Item item);
}
@Service
public class ItemServiceImpl implements ItemService {
 private List<Item> items = new ArrayList<>();
 @Override
 public List<Item> getAllItems() {
 return items;
 }
 @Override
 public Optional<Item> getItemById(Long id) {
 return items.stream().filter(item -> item.getId().
equals(id)).findFirst();
 }
 @Override
 public void addItem(Item item) {
 items.add(item);
 }
}
Create Unit Tests
public class ItemServiceTest {
 @InjectMocks
 private ItemService itemService;
Chapter 5 Testing, Deploying, and Scaling Microservices
238
 @BeforeEach
 public void setup() {
 MockitoAnnotations.openMocks(this);
 Item item1 = new Item(1L, "Item 1");
 Item item2 = new Item(2L, "Item 2");
 itemService.addItem(item1);
 itemService.addItem(item1);
 }
 @Test
 public void testGetAllItems() {
 List<Item> items = itemService.getAllItems();
 assertEquals(2, items.size());
 }
 @Test
 public void testGetItemById() {
 Optional<Item> item = itemService.getItemById(1L);
 assertTrue(item.isPresent());
 assertEquals("Item 1", item.get().getName());
 }
}
Breakdown of the Code
• @InjectMocks Annotation: The itemService object is 
annotated with @InjectMocks, which tells Mockito to 
inject any necessary dependencies into ItemService 
when creating the instance. It facilitates the testing of 
ItemService in isolation.
Chapter 5 Testing, Deploying, and Scaling Microservices
Chapter 5 Testing, Deploying, and Scaling Microservices
• setup() Method: This method is annotated with 
@BeforeEach, meaning it will run before each test 
case, setting up the necessary test environment.
• The method calls MockitoAnnotations.
openMocks(this); to initialize the mocks and inject 
dependencies into itemService.
• spring-boot-starter-test: This dependency is a 
comprehensive testing toolkit provided by Spring 
Boot. It includes a set of libraries and tools to support 
different types of testing, such as unit testing, 
integration testing, and more, for example, JUnit 
(primary framework for writing and running tests), 
Mockito (framework for creating and managing mock 
objects), AssertJ (fluent assertion library for making test 
assertions more readable and expressive), etc.
EXERCISE CHAPTER 5-1
1. Build the above example in any IDE of your choice like IntelliJ or 
Eclipse.
2. Write the JUnits for all the controllers we have created so far.
Integration Testing for Microservices 
in Java
Integration testing for microservices involves testing interactions between 
microservices components or with external dependencies such as 
databases or other services.
239
240
Integration testing verifies that different parts of the application work 
together as expected.
Example: Integration Testing with Spring Boot
Create a Simple REST Controller
@RestController
@RequestMapping("/api/items")
public class ItemController {
 private List<Item> itemList = new ArrayList<>();
 @GetMapping
 public List<Item> getAllItems() {
 return itemList;
 }
 @GetMapping("/{id}")
 public Optional<Item> getItemById(@PathVariable Long id) {
 return itemList.stream().filter(item -> item.getId().
equals(id)).findFirst();
 }
 @PostMapping
 public Item createItem(@RequestBody Item item) {
 item.setId((long) (itemList.size() + 1));
 itemList.add(item);
 return item;
 }
 @PutMapping("/{id}")
 public Optional<Item> updateItem(@PathVariable Long id, 
@RequestBody Item itemDetails) {
Chapter 5 Testing, Deploying, and Scaling Microservices
241
 return itemList.stream().filter(item -> item.getId().
equals(id)).findFirst().map(item -> {
 item.setName(itemDetails.getName());
 return item;
 });
 }
 @DeleteMapping("/{id}")
 public void deleteItem(@PathVariable Long id) {
 itemList.removeIf(item -> item.getId().equals(id));
 }
}
Create Integration Tests
@SpringBootTest
@AutoConfigureMockMvc
public class ItemControllerIntegrationTest {
 @Autowired
 private MockMvc mockMvc;
 @Test
 public void testGetAllItems() throws Exception {
 mockMvc.perform(get("/api/items"))
 .andExpect(status().isOk())
 .andExpect(content().contentType(MediaType.
APPLICATION_JSON))
 .andExpect(jsonPath("$", org.hamcrest.Matchers.
hasSize(0)));
 }
 @Test
 public void testAddAndGetItem() throws Exception {
 Item item = new Item(1L, "Item1");
Chapter 5 Testing, Deploying, and Scaling Microservices
242
 mockMvc.perform(post("/api/items")
 .contentType(MediaType.
APPLICATION_JSON)
 .content(new ObjectMapper().
writeValueAsString(item)))
 .andExpect(status().isOk());
 mockMvc.perform(get("/api/items"))
 .andExpect(status().isOk())
 .andExpect(content().contentType(MediaType.
APPLICATION_JSON))
 .andExpect(jsonPath("$", org.hamcrest.Matchers.
hasSize(1)))
 .andExpect(jsonPath("$[0].name").
value("Item 1"));
 }
}
Short Explanation
@Autowired MockMvc: MockMvc is used to simulate HTTP requests and 
test the web layer without starting the entire server. It allows for testing 
controllers directly.
@SpringBootTest: Loads the full application context, including 
repositories and services. Use this for full end-to-end integration tests.
@AutoConfigureMockMvc: Enables MockMvc in the context.
End-to-End Testing for Microservices in Java
End-to-end testing verifies the entire application flow, involving multiple 
services, to ensure that everything works together as expected.
Chapter 5 Testing, Deploying, and Scaling Microservices
243
Example: End-to-End Testing
Create End-to-End Test Class
ItemEndToEndTest.java:
@SpringBootTest
@AutoConfigureMockMvc
public class ItemEndToEndTest {
 @Autowired
 private MockMvc mockMvc;
 @Test
 public void testEndToEnd() throws Exception {
 Item item = new Item(1L, "Item 1");
 mockMvc.perform(post("/api/items")
 .contentType(MediaType.
APPLICATION_JSON)
 .content(new ObjectMapper().
writeValueAsString(item)))
 .andExpect(status().isOk());
 mockMvc.perform(post("/api/items"))
 .andExpect(status().isOk())
 .andExpect(content().contentType(MediaType.
APPLICATION_JSON))
 .andExpect(jsonPath("$", org.hamcrest.Matchers.
hasSize(1)))
 .andExpect(jsonPath("$[0]. name").
value("Item 1"));
 }
}
Chapter 5 Testing, Deploying, and Scaling Microservices
244
Explanation
The test checks if the entire flow of adding an item and retrieving it 
works as expected by simulating API calls and verifying that the response 
matches the expected outcome. This ensures that the ItemController 
behaves correctly under real-world conditions, validating both the input 
processing and the output response structure.
Summary
Wrapping things up, unit testing and integration testing are nonnegotiable 
when it comes to building reliable, high-performing microservices. These 
practices aren’t just about checking a box—they’re about catching issues 
early, before they snowball into bigger problems. The sooner bugs are 
squashed, the smoother your services run, and the happier your users will 
be. Getting a solid grasp of how to apply these testing strategies in your 
Java microservices arsenal can seriously boost the scalability and resilience 
of your applications, making sure they hit both technical and business 
targets head-on. So, test early, test often, and make your microservices 
bulletproof!
Contract Testing
In microservices architecture, reliable communication between services 
is the glue that holds the system together. Contract testing steps in to 
ensure these interactions are validated without the heavy lift of traditional 
integration testing. Unlike full-blown integration tests where services 
directly communicate, contract testing focuses on the agreements—or 
contracts—between a service provider and a consumer. Think of it like 
making sure everyone’s agreed on the plan before diving into execution. 
This approach reduces integration issues and allows services to be 
developed and deployed independently.
Chapter 5 Testing, Deploying, and Scaling Microservices
245
Why Contract Testing Matters
One of the primary benefits of contract testing is the early detection of 
issues. By validating service interactions during development, teams can 
catch integration problems before they make their way into production. 
This proactive approach helps avoid the dreaded last-minute scramble to 
fix broken connections right before a release.
Contract testing also supports independent development. Since 
each service has its own contract, teams can develop and deploy services 
without having to wait on each other. This separation of concerns speeds 
up development cycles and ensures that when services finally interact, 
they’ll do so smoothly.
Stability is another key advantage of contract testing. With services 
adhering strictly to predefined contracts, there’s less risk of unexpected 
behavior once everything is in production. It’s like having a solid 
handshake agreement in place that ensures everyone is playing by the 
same rules.
Finally, contract testing fits beautifully into continuous integration 
and delivery (CI/CD) pipelines. Fast feedback from contract tests helps 
developers know right away if something isn’t aligning between services, 
making automated deployments smoother and more reliable.
The Challenges
Of course, contract testing isn’t without its hurdles. One major challenge 
is maintaining the contracts themselves. As services evolve and change, 
keeping contracts up to date can become a real task. If the contracts don’t 
reflect current service interactions, their usefulness quickly diminishes.
Tooling complexity is another challenge. Integrating contract testing 
into CI/CD pipelines can sometimes feel like a balancing act. Depending 
on the tools and technologies in play, getting everything to work 
seamlessly can require some effort and fine-tuning.
Chapter 5 Testing, Deploying, and Scaling Microservices
246
Finally, there’s the issue of service dependencies. During testing, you 
may have to deal with external services or databases, which adds layers of 
complexity. Simulating those dependencies accurately while keeping the 
tests isolated can be tricky.
Typically, contract tests are written by the service provider and shared 
with the consumer to ensure both sides are on the same page. It's a bit like 
agreeing on the rules before playing the game—once everyone’s aligned, 
things move forward much more smoothly.
Let’s create a sample Java program to understand how contract testing 
works. We'll create a simple scenario where a consumer service calls a 
provider service to fetch a list of products. If your service ecosystem is 
using only Spring Boot, then you can use spring-cloud-starter-contract￾verifier, but if other consumers are using other languages like Node.js, 
Python, etc., then they will likely face difficulties with it. Companies with 
diverse technology stacks may face challenges in standardizing contract 
testing. They often rely on polyglot-friendly tools (e.g., Pact, Postman, or 
OpenAPI contracts). Let’s see how to implement contract testing using a 
simple Pact example.
Example: Contract Testing Using Pact
Set Up the Provider Service
Create a Spring Boot project for the provider service:
<dependency>
 <groupId>au.com.dius.pact.provider</groupId>
 <artifactId>junit5</artifactId>
 <version>4.5.5</version>
 <scope>test</scope>
</dependency>
Create a REST controller in the provider service.
Chapter 5 Testing, Deploying, and Scaling Microservices
247
Product.java:
public class Product {
 private Long id;
 private String name;
 private String description;
 public Product() {}
 public Product(Long id, String name, String description) {
 super();
 this.id = id;
 this.name = name;
 this.description = description;
 }
 public Long getId() {
 return id;
 }
 public void setId(Long id) {
 this.id = id;
 }
 public String getName() {
 return name;
 }
 public void setName(String name) {
 this.name = name;
 }
public String getDescription() {
 return description;
 }
 public void setDescription(String description) {
 this.description = description;
 }
}
Chapter 5 Testing, Deploying, and Scaling Microservices
248
ProductController.java:
@RestController
@RequestMapping("/api/products")
public class ProductController {
 public List<Product> getAllProducts(){
 return Arrays.asList(
 new Product(1L, "Product 1", "Description 1"),
 new Product(2L, "Product 2", "Description 2")
 );
 }
}
Consumer Side: Pact Test
<dependencies>
 <dependency>
 <groupId>au.com.dius.pact.consumer</groupId>
 <artifactId>junit5</artifactId>
 <version>4.6.5</version>
 <scope>test</scope>
 </dependency>
 <dependency>
 <groupId>io.rest-assured</groupId>
 <artifactId>rest-assured</artifactId>
 <version>5.3.0</version>
 <scope>test</scope>
 </dependency>
</dependencies>
Chapter 5 Testing, Deploying, and Scaling Microservices
249
This test creates a Pact contract where the consumer expects the /api/
products endpoint to return a list of products with specific fields.
import au.com.dius.pact.consumer.dsl.PactDslWithProvider;
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt;
import au.com.dius.pact.consumer.junit5.PactTestFor;
import au.com.dius.pact.consumer.dsl.PactDslJsonArray;
import au.com.dius.pact.core.model.annotations.Pact;
import au.com.dius.pact.core.model.PactSpecVersion;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import java.util.Map;
import static org.hamcrest.Matchers.equalTo;
@ExtendWith(PactConsumerTestExt.class)
public class ProductConsumerPactTest {
 @Pact(consumer = "ProductConsumer", provider = 
"ProductProvider")
 public au.com.dius.pact.core.model.RequestResponsePact 
createPact(PactDslWithProvider builder) {
 return builder
 .given("Products exist")
 .uponReceiving("A request to get all products")
 .path("/api/products")
 .method("GET")
 .willRespondWith()
 .status(200)
 .body(PactDslJsonArray.arrayMinLike(2)
 .object("id", 1L)
Chapter 5 Testing, Deploying, and Scaling Microservices
250
 .stringType("name", "Product 1")
 .stringType("description", 
"Description 1"))
 .toPact();
 }
 @Test
 @PactTestFor(providerName = "ProductProvider", pactVersion 
= PactSpecVersion.V3)
 public void testGetAllProducts(MockServer mockServer) {
 RestAssured
 .given()
 .baseUri(mockServer.getUrl())
 .when()
 .get("/api/products")
 .then()
 .statusCode(200)
 .body("[0].name", equalTo("Product 1"))
 .body("[0].description", 
equalTo("Description 1"));
 }
}
Provider Side: Pact Verification Test
<dependency>
 <groupId>au.com.dius.pact.provider</groupId>
 <artifactId>junit5</artifactId>
 <version>4.6.5</version>
 <scope>test</scope>
</dependency>
Chapter 5 Testing, Deploying, and Scaling Microservices
251
Provider Pact Test Code
import au.com.dius.pact.provider.junit5.
PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
@ExtendWith(PactVerificationTest.class)
public class ProductProviderPactTest {
 @BeforeEach
 void setup(PactVerificationContext context) {
 context.setTarget(new HttpTestTarget("localhost", 
8080, "/"));
 }
 @TestTemplate
 @ExtendWith(PactVerificationTest.class)
 void pactVerificationTestTemplate(PactVerificationContext 
context) {
 context.verifyInteraction();
 }
}
Steps to Execute
1. Run Consumer Test: Execute 
ProductConsumerPactTest to generate a Pact file in 
the target/pacts folder.
2. Share the Pact File: Share the generated .json Pact 
file with the provider team.
Chapter 5 Testing, Deploying, and Scaling Microservices
252
3. Run Provider Test: Start your application 
(e.g., ProductController). Execute 
ProductProviderPactTest to verify the provider 
adheres to the consumer expectations.
Explanation
The provided code demonstrates contract testing using Pact to ensure 
that the consumer (ProductConsumer) and provider (ProductProvider) 
adhere to an agreed-upon contract for the /api/products endpoint. On 
the consumer side, the Pact test defines the expected interaction with the 
provider, specifying that a GET request to /api/products should return 
a 200 status and a JSON array of products with specific fields (ID, name, 
description). It uses Rest Assured to validate the response against these 
expectations. On the provider side, the Pact verification test ensures that 
the actual implementation of the provider meets the expectations defined 
in the Pact file generated by the consumer test. This ensures compatibility 
between the microservices without direct integration during development.
@ExtendWith(PactConsumerTestExt.class): Used in consumer tests 
to integrate Pact’s consumer test functionality with JUnit 5.
@Pact: Marks a method as defining a Pact interaction. It is used to 
specify the consumer-provider contract, including request and response 
details.
@PactTestFor: Specifies the provider name and the Pact specification 
version (e.g., V3) to be used during the test. It also configures the mock 
server that simulates the provider during the consumer test.
@BeforeEach: A standard JUnit 5 annotation that runs the annotated 
method before each test. In the provider test, it sets up the Pact verification 
context with the target provider URL.
@TestTemplate: A JUnit 5 annotation used to define reusable test 
templates. In Pact, it’s used for running the interaction verification for all 
the Pact interactions in the contract.
Chapter 5 Testing, Deploying, and Scaling Microservices
253
@PactVerificationTest: Extends the JUnit 5 test with Pact’s provider￾side verification functionality to validate that the actual provider 
implementation adheres to the consumer's expectations.
Summary
Contract testing is a powerful tool for ensuring that your microservices 
play nice with each other, sticking to their promises (or contracts) like 
a well-behaved orchestra. With Spring Cloud Contract, you can take 
the guesswork out of service interactions, automatically generating and 
validating contracts to keep everything in harmony. This approach not 
only makes your microservices more reliable but also keeps integration 
issues at bay. In this guide, we scratched the surface with a simple example 
to help you kickstart contract testing in a microservices setup using Java 
and Spring Boot. Now you're all set to take your services from good to gold!
Deploying and Scaling Microservices
Containers and orchestration are changing how modern software is 
written, deployed, and operated. It’s no longer clunky installations 
where application transfer was an effort. With containerization today, 
the software deployment has become a bit like putting together an 
optimally structured suitcase—light, fast, portable, and quick. The leading 
technologies driving this change are Docker and Kubernetes—the two 
technologies which, when combined, allow you to handle containers and 
deploy them at scale seamlessly. This chapter covers containers, Docker, 
and Kubernetes in brief and shows how you can use them with an easy 
Java example.
Containers are boxes that come together as a unit and bundle up your 
app along with its dependencies, libraries, and settings. This means your 
app will work properly every time regardless of where it is—whether it’s 
Chapter 5 Testing, Deploying, and Scaling Microservices
Chapter 5 Testing, Deploying, and Scaling Microservices
on your home machine, test server, or production server. Docker makes 
deploying, managing, and creating these containers easy. It makes it easy 
for you to develop, ship, and consume your apps in any destination, with 
little to no effort.
With Docker, it's all about building blocks. The first are images, which 
are read-only templates for container design. You can see the image as a 
schematic of what is inside the box. Once you have an image, you create 
a container, which is a live instance of the image running in a single 
lightweight container. This is another essential feature of Docker; this is 
the recipe that Docker consumes to create your image. And finally, there’s 
Docker Hub, a giant registry of premade Docker images to share. So, it’s a 
store where you can buy pictures and get projects started or sell your own.
One of the reasons that Docker has become a popular choice among 
developers is because of its stability. It removes the "works on my 
machine" flaw in your application by ensuring your app always performs 
the same regardless of the place it’s deployed. In addition, Docker isolates 
you so your apps don’t communicate with one another or with the host 
system. Portability of Docker is incredible—move your app from your 
laptop to the cloud and do not miss a beat. Furthermore, with Docker 
being light, you can deploy more containers on the same hardware to get 
the most out of the available resources.
We’ve now got the basics of Docker in our hands, so let’s dive right into 
Kubernetes, the orchestration platform that turns container management 
into a finely tuned ballet. Kubernetes will let you deploy, scale, and 
manage your containers in a distributed infrastructure while keeping them 
neat and organized.
In this Docker and Kubernetes journey, we’re only starting but it’s only 
the beginning!
254
Chapter 5 Testing, Deploying, and Scaling Microservices
Kubernetes for Orchestration
In container orchestration, Kubernetes is the container’s air traffic 
controller. Docker helps you bundle your applications into containers, 
but Kubernetes takes over container management. It automatically does 
deployment and scaling and even does the hardest thing—handling 
containers on clusters of nodes so they work together.
Pods, the smallest deployable unit, are the foundation of Kubernetes. 
Think of them like mini ships carrying one or more containers that 
need to work together. They might be small, but Pods are mighty—
they encapsulate your containers and ensure they run with the right 
configuration. But managing a fleet of Pods is where Deployments come 
into play. These ensure your Pods always match the desired state, no 
matter what. If one Pod crashes, the Deployment controller will launch a 
new one to keep things running smoothly.
But wait, how do all these Pods talk to each other or the outside world? 
That’s where Services come in. Services expose your application running 
inside Pods, making sure it’s discoverable, whether it’s talking to other 
services within your cluster or to external clients. And when you need 
external access to your internal services, Kubernetes brings out the big 
guns with Ingress. Ingress manages how traffic from outside the cluster 
gets routed to your services, complete with load balancing, SSL, and virtual 
hosting if you need it.
In essence, Kubernetes isn’t just managing containers—it’s 
orchestrating an entire symphony of services, making sure everything 
from scaling, load balancing, to self-healing is done automatically. It’s the 
engine that keeps your containerized applications running smoothly, even 
as your environment scales and grows more complex.
To understand it fully, let's create a sample project using Docker. Let's 
create a simple Java application and containerize it using Docker.
255
256
Example: Kubernetes with Docker
1. Java Application: Create a basic Java application 
with a REST endpoint using Spring Boot.
@RestController
@SpringBootApplication
public class DockerDemoProjectApplication {
 public static void main(String[] args) {
 SpringApplication.run(DockerDemoProject
Application.class, args);
 }
 @GetMapping("/")
 public String hello() {
 return "Hello, World!";
 }
}
Install Docker locally from https://docs.docker.com/.
Dockerfile: Create a Dockerfile to package the Java application into a 
Docker image.
FROM openjdk:11-ea-17-jre-slim
WORKDIR /app
COPY target/DockerDemoProject-1.0.jar /app/hello-world-app.jar
EXPOSE 8080
CMD ["java", "jar", "hello-world-app.jar"]
Build Docker Image: Build the Docker image using the Docker CLI.
docker build -t hello-world-app
Run Docker Container: Run a Docker container from the built image.
docker run -p 8080:8080 hello-world-app
Chapter 5 Testing, Deploying, and Scaling Microservices
257
Access: Access the application at http://localhost:8080 to see the 
"Hello, World!" message.
Explanation: This Dockerfile uses an OpenJDK 17 base image, copies 
the compiled JAR file (hello-world-app.jar), exposes port 8080, and 
specifies the command to run the application.
Example: Kubernetes Deployment
Install Minikube (minikube is local Kubernetes, focusing on making it 
easy to learn and develop for Kubernetes) from https://minikube.sigs.
k8s.io/ to set up a cluster locally. Also, install kubectl (a command￾line tool for interacting with your Kubernetes cluster) from https://
kubernetes.io/.
Start Minikube from the command prompt: minikube start
Use the above built application in this Kubernetes example. Tag the 
image created above:
docker tag hello-world-app <your-dockerhub-username>/hello￾world-app:latest
Push the image to the Minikube cluster: docker build -t hello￾world-app
Create Kubernetes configuration files:
apiVersion: apps/v1
kind: Deployment
metadata:
 name: hello-world-deployment
spec:
 replicas: 2
 selector:
 matchLabels:
 app: hello-world
 template:
Chapter 5 Testing, Deploying, and Scaling Microservices
258
 metadata:
 labels:
 app: hello-world
 spec:
 containers:
 - name: hello-world-app
 image: <your-dockerhub-username>/hello-world￾app:latest # Change this to your image name
 ports:
 - containerPort: 8080
Create a service file:
apiVersion: v1
kind: Service
metadata:
 name: hello-world-service
spec:
 selector:
 app: hello-world
 ports:
 - protocol: TCP
 port: 8080
 targetPort: 8080
 type: NodePort
Apply the Kubernetes Files
• Apply the deployment: kubectl apply -f hello￾world-deployment.yaml
• Apply the service: kubectl apply -f hello-world￾service.yaml
• Verify that the deployment and service are running:
Chapter 5 Testing, Deploying, and Scaling Microservices
Chapter 5 Testing, Deploying, and Scaling Microservices
kubectl get deployments
kubectl get pods
kubectl get services
Using Minikube, you can access the service directly using minikube 
service hello-world-service.
Explanation
• replicas: Specifies that two instances (pods) of the 
application will be deployed.
• image: Use the Docker image from your Docker Hub or 
local Minikube registry.
• containerPort: Specifies that the container listens on 
port 8080.
• selector: Selects the pods labeled app: hello-world to 
route traffic to.
• ports: Maps port 8080 of the service to port 8080 of the 
container.
• type: The NodePort service exposes the application on 
a port accessible from outside the cluster.
You have now set up Kubernetes configurations for a simple Spring 
Boot application using Docker. You created
• A Deployment (hello-world-deployment.yaml) to 
manage the application pods.
• A Service (hello-world-service.yaml) to expose the 
application on port 8080.
259
260
This setup enables you to run, scale, and access the Dockerized Spring 
Boot application in your local Kubernetes cluster.
EXERCISE CHAPTER 5-2
1. Update the replicas count in the hello-world-deployment.yaml 
file to three and reapply the configuration.
2. Verify that the number of pods has increased above example.
3. Modify the hello-world-app application (e.g., change the 
message it returns) and rebuild the Docker image.
4. Update the image version in the deployment file and redeploy 
the application to see the updated version.
Summary
Containers and orchestration with Docker and Kubernetes have changed 
the way we think about deploying, scaling, and managing applications. 
With Docker, you can package your app into a compact, lightweight 
container that runs smoothly across different environments without the 
"but it worked on my machine" problem. Kubernetes takes it one step 
further by orchestrating these containers—automating deployment, 
scaling, and cluster application management. Take these two and you have 
the most powerful combination of tools to keep your Java applications 
easily distributed between development, testing, and production and 
scalable and resilient in the face of ever more demand. For learning to use 
Docker and Kubernetes in your Java applications, it is like getting a sneak 
peek at creating efficient, agile, modern cloud-native architectures that 
scale as you need.
Chapter 5 Testing, Deploying, and Scaling Microservices
261
Scaling Microservices
Scaling microservices is a critical part of ensuring your system performs 
well and makes the most of available resources, especially in dynamic 
environments where demand can change rapidly. Kubernetes steps in here 
with tools like the Horizontal Pod Autoscaler (HPA), automating scaling 
decisions based on workload metrics. To really master scaling strategies 
for microservices, it's important to grasp the key differences between 
horizontal and vertical scaling, particularly when using something 
like HPA.
Horizontal Scaling: You scale by building more pods (instances) of 
your microservices. This replicates the load across many nodes which is 
great for high volume, fault tolerance, and availability. Consider it as the 
same as multiplication: the more pods you have, the more traffic you can 
serve without overloading one instance. The advantage of this is it’s highly 
scalable and elastical, making it load balancing and fault-tolerant. This, of 
course, adds additional overhead, more moving pieces to deal with, and a 
distributed design.
Vertical Scaling: Here, you don’t build more pods but provide each 
current pod with an extra amount of capacity (CPU or memory). This is 
useful when you want to perform heavier computation on one instance 
and makes managing this easy. It doesn’t require your service to hold a set 
of instances (which can be particularly convenient for stateful services). 
The flip side? You have a limit of the physical resources of the node, and 
going vertical may bring a few seconds of downtime as resources are 
relocated.
Both approaches have their merits, and choosing between them—or 
using a combination of both—depends on the specific needs of your 
microservices architecture. Horizontal scaling gives you more flexibility, 
but vertical scaling can be a simpler, albeit sometimes temporary, fix for 
resource-hungry applications.
Chapter 5 Testing, Deploying, and Scaling Microservices
262
Summary
Grasping the differences between horizontal and vertical scaling, 
especially when using Kubernetes' Horizontal Pod Autoscaler (HPA), is 
key to crafting a truly scalable and efficient microservices architecture. 
With HPA taking care of horizontal scaling—adjusting the number of pods 
based on metrics like CPU usage—and vertical scaling fine-tuning the 
resources within individual pods, you can dynamically adapt to workload 
fluctuations without breaking a sweat. This smart scaling approach 
boosts performance and availability while keeping resource use in check, 
making Kubernetes an invaluable tool for creating resilient, cloud-native 
microservices that thrive under pressure.
Conclusion
As we wrap up this chapter, it’s clear that testing, deploying, and scaling 
microservices is no walk in the park—it’s more like managing a bustling 
café where every barista needs to work independently yet harmoniously. 
We’ve explored the nitty-gritty of unit testing, where each service proves 
it can stand on its own two feet, and integration testing, which ensures 
the whole team plays nicely together. Add contract testing to the mix, and 
you’ve got a safety net to catch any misunderstandings between services 
before they lead to a comedy of errors in production.
Deployment and scaling brought Docker and Kubernetes to the 
forefront—tools that transform microservices from fragile experiments into 
robust, scalable entities. Docker packs your applications into tidy, portable 
containers, while Kubernetes orchestrates them like a maestro leading a 
symphony. Whether it’s spinning up new instances with horizontal scaling 
or beefing up existing ones with vertical scaling, you now have the tools to 
ensure your microservices perform gracefully under pressure.
Chapter 5 Testing, Deploying, and Scaling Microservices
Chapter 5 Testing, Deploying, and Scaling Microservices
Remember, these strategies aren’t just about technical mastery; they’re 
about delivering value—building systems that are resilient, efficient, and 
prepared for the unpredictable. With your expertise in the intricacies of 
microservices architecture, you’re not just adopting best practices; you’re 
setting the standard for what modern, scalable applications can achieve.
What’s Next?
Buckle up for the next chapter, where we delve into the critical pillars 
of security, maintenance, and logging. We’ll tackle topics like fortifying 
service-to-service communication, managing logs like a pro with 
centralized solutions, and ensuring your microservices aren’t just 
functional but also compliant with industry standards. Think of it as the 
next step in your journey to microservices mastery—because building is 
only half the battle; protecting and maintaining is where the real art lies. 
See you there!