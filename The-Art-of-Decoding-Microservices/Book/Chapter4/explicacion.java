CHAPTER 4
Developing 
Microservices
Let’s dive into this chapter and discover how choosing the right technology 
stack can transform your microservices architecture. Choosing the right 
technology stack, when preparing a microservices architecture, isn’t 
just important, it’s transformational. Which technology you adopt will 
either make your app more efficient, faster, scalable, and generally easier 
to manage, or it will become a jumble. Microservices don’t rely on the 
standard monolith; you can stack different technologies in different 
services. But flexibility begets responsibility! It’s a matter of making the 
right decisions to make sure you don’t turn that adaptability into wrack.
Factors to Consider
When diving into microservices architecture, choosing the right tech stack 
can make or break your project’s success. First off, business requirements 
take the front seat—what exactly are you solving for? From expected traffic 
to low-latency needs, ensure that each service fits the business like a 
glove. Then, think about your team—team expertise matters. Sticking with 
what they know might just save you from hours of Googling and endless 
debugging marathons. But don’t stop there! Community and support 
are your secret weapons. Go with technologies that come with an active, 
194
vibrant community. More hands-on deck means more libraries, better 
frameworks, and quicker problem resolution.
Of course, there’s performance and scalability to weigh in. Different 
services call for different strengths, and some stacks excel at specific 
tasks—whether you need a CPU-cruncher or a lightning-fast I/O handler, 
choose wisely. Don’t forget about compatibility and integration—
microservices don’t exist in a vacuum. They need to communicate, sync, 
and play nice with other parts of your system, so pick tools that integrate 
smoothly. Finally, keep an eye on the operational complexity. Some tech 
choices come with added layers of deployment and monitoring headaches. 
Unless you’re into that sort of thing, aim for simplicity where possible.
Technology Stack Components
When deciding on a tech stack for microservices, you’re just choosing 
the tools for the task at hand with flexibility and scalability in mind. 
Architectural Decision Records (ADRs) play a crucial role here, 
documenting why specific technologies are chosen, ensuring decisions 
are transparent, and providing a historical context for future teams. The 
programming languages such as Java and.NET tend to be the preferred 
choice for enterprises as they’re highly flexible, while Python and Node.
js can be utilized for speed in more complex systems. Data storage is 
generally a matter of each microservice having its own database to 
remain decoupled, and you may opt for SQL (PostgreSQL or MySQL) or 
NoSQL (MongoDB (https://www.mongodb.com/) or Cassandra 
(https://cassandra.apache.org/)) depending on your data 
and consistency requirements. Interfacing with services requires 
communication protocols, RESTful APIs, gRPC, or a messaging protocol 
such as Kafka (https://kafka.apache.org/) or RabbitMQ (https://www.
rabbitmq.com/) tend to be preferred options depending on whether you 
need synchronous or asynchronous interaction.
Chapter 4 Developing Microservices
Chapter 4 Developing Microservices
Infrastructure components like containerization using Docker and 
orchestration using Kubernetes simplify deployment and scaling, and 
cloud platforms like AWS (https://aws.amazon.com/), Azure (https://
azure.microsoft.com/), or Google Cloud (https://cloud.google.com/) 
deliver managed services which remove overhead. Lastly, DevOps tools 
(Jenkins (https://www.jenkins.io/), GitLab (https://about.gitlab.
com/), or CircleCI (https://circleci.com/) for the CI/CD pipelines, and 
monitoring and logging systems (Prometheus (https://prometheus.
io/), Grafana (https://grafana.com/), and the ELK stack (https://www.
elastic.co/elastic-stack)) keep your microservices healthy and up 
and running. All of these features combined provide a complete, scalable, 
and efficient microservices platform. By combining these thoughtfully 
chosen technologies, documented through ADRs, you establish not only 
a complete and scalable microservices platform but also a system where 
decisions are guided, consistent, and easily adaptable as needs evolve.
Best Practices
• Start Small: Begin with a minimal set of technologies 
and expand as required. This approach helps in 
understanding the impact of each technology choice 
on the system.
• Consistency Where Possible: While different services 
can use different stacks, standardizing where possible 
can reduce complexity. For instance, using the same 
programming language or database technology across 
several services can simplify maintenance.
• Evaluate Regularly: As the project evolves and scales, 
regularly reevaluate the technology choices to ensure 
they still meet the business needs and operational 
capabilities.
195
196
Summary
Selecting the right technology stack for microservices is a careful balancing 
act—it’s about finding the best tool for each service’s unique needs without 
overwhelming the system with unnecessary complexity. The ideal stack 
boosts both productivity and performance while keeping operational 
headaches to a minimum. Flexibility is key, allowing you to adjust and 
evolve your choices as requirements change, ensuring your architecture 
stays agile and efficient.
Building RESTful Services
REST (Representational State Transfer) is an architectural style that follows 
key principles designed to make web services scalable and maintainable. 
First, it emphasizes statelessness, meaning each client request must 
include all necessary information for the server to process it without 
relying on stored session data. It also follows a client-server model, where 
clients and servers operate independently, only interacting through 
requests and responses. REST encourages cacheable responses to enhance 
performance, allowing certain responses to be stored and reused. Lastly, 
RESTful services must adhere to a uniform interface, ensuring consistent 
and standardized communication across the system. These principles 
together provide a solid foundation for building efficient and flexible web 
services.
REST with its stateless, client-server, and cache-safe architecture 
is the current standard for creating web services that do their job only. 
Let’s say you’re requesting coffee online (who needs caffeine anyway?). 
You tell the coffee server (a.k.a. the RESTful API), “I’d like a double shot 
latte, please!”—that’s the request. The server processes your order, makes 
the coffee (or calls the barista service), and hands it back to you—this 
is the response. But here’s the thing: you need to give all the details 
Chapter 4 Developing Microservices
197
every time (stateless), because the coffee server isn’t keeping track of 
your previous orders or how many shots you prefer. Every interaction is 
fresh. Meanwhile, the server is focusing solely on the coffee-making, not 
worrying about anything else (client-server separation).
Setting Up a Spring Boot Project
Spring Boot is an excellent framework for building RESTful services with 
Java. It simplifies the development process by providing a suite of tools and 
default configurations. To get started, create a new Spring Boot project.
Step 1: Set Up Spring Boot Project
First, create a new Spring Boot project. You can do this using the Spring 
Initializer (https://start.spring.io/) or by setting up the project 
manually.
Dependencies
• Spring Web
• Spring Test
• Spring DevTools
Sample pom.xml
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-devtools</artifactId>
 <scope>runtime</scope>
 <optional>true</optional>
</dependency>
Chapter 4 Developing Microservices
198
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-test</artifactId>
 <scope>test</scope>
</dependency>
Step 2: Create the Item Class with Getters and Setters
 public Item (Long id, String name) {
 this.id = id;
 this.name = name;
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
Step 3: Create the Controller
Create an ItemController class to handle HTTP requests:
@RestController
@RequestMapping("/api/items")
public class ItemController {
 private List<Item> itemList = new ArrayList<>();
 @GetMapping
Chapter 4 Developing Microservices
199
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
 return itemList.stream().filter(item ->
 item.getId().equals(id)).findFirst().map(item -> {
 item.setName(itemDetails.getName());
 return item;
 });
 }
 @DeleteMapping("/{id}")
 public void deleteItem(@PathVariable Long id) {
 itemList.removeIf(item -> item.getId().equals(id));
 }
}
Chapter 4 Developing Microservices
200
Step 4: Create the Main Application Class
Create a Spring Boot Rest Application main class to bootstrap the 
application:
DemoApplication.java:
@SpringBootApplication
public class DemoApplication {
 public static void main(String[] args) {
 SpringApplication.run(DemoApplication.class, args);
 }
}
Step 5: Run the Application
Run the application by executing the main method in DemoApplication. 
The application will start and listen for HTTP requests on port 8080.
Step 6: Test the RESTful Service
You can use tools like Postman or curl to test the RESTful endpoints:
• Get all items: curl -X GET http://
localhost:8080/api/items
• Get an item by ID: curl -X GET http://
localhost:8080/api/items/1
• Create a new item: curl -X POST http://
localhost:8080/api/items -H "Content-Type: 
application/json" -d '{"name":"Item 1"}'
• Update an item: curl -X PUT http://localhost:
8080/api/items/1 -H "Content-Type: application/
json" -d '{"name":"Updated Item 1"}'
• Delete an item: curl -X DELETE http://
localhost:8080/api/items/1
Chapter 4 Developing Microservices
Chapter 4 Developing Microservices
EXERCISE CHAPTER 4-1
1. Build the above example in any IDE of your choice like IntelliJ or 
Eclipse.
2. Add 10 items to the list and delete items 7 and 9.
3. Add validation annotations to the Item class:
Ensure that name and description are not empty or null when 
creating/updating an item.
Add validation in the ItemController and handle validation errors 
using @Valid.
4. Write test cases to verify that validation works correctly, such 
as ensuring that creating an item without a name returns an 
appropriate error response.
5. Print list of items.
Explanation of Annotations
Let’s go over the annotations used in the provided Spring Boot RESTful 
service example:
@RestController
• Explanation: It combines @Controller and 
@ResponseBody, which means that the class will 
handle HTTP requests, and the return values of its 
methods will be written directly to the HTTP response 
body as JSON (or another format).
201
Chapter 4 Developing Microservices
@RequestMapping
• Explanation: In the example, it’s used at the class 
level to define the base URL for all the endpoints in the 
controller. The path specified in @RequestMapping
(“/api/items”) will prefix all the other paths defined in 
the controller.
Example: @RequestMapping(“/api/items”)
@GetMapping
• Explanation: It’s used to map HTTP GET requests to 
specific handler methods. In the example, @GetMapping 
is used to handle requests to retrieve items.
Example: @GetMapping(“/{id}”)
@PostMapping
• Explanation: It’s used to map HTTP POST requests to 
specific handler methods. In the example, @PostMapping 
is used to handle requests to create a new item.
@PutMapping
• Explanation: It’s used to map HTTP PUT requests 
to specific handler methods. In the example, 
@PutMapping is used to handle requests to update an 
existing item.
Example: @PutMapping(“/{id}”)
@DeleteMapping
• Explanation: It’s used to map HTTP DELETE requests 
to specific handler methods. In the example, 
@DeleteMapping is used to handle requests to delete 
an item.
202
Chapter 4 Developing Microservices
Example: @DeleteMapping(“/{id}”)
@PathVariable
• Explanation: It indicates that a method parameter 
should be bound to a URI variable. In the example, 
@PathVariable Long id binds the value of the {id} path 
variable in the URL to the id method parameter.
@RequestBody
• Explanation: It indicates that a method parameter 
should be bound to the body of the HTTP request. In 
the example, @RequestBody Item item binds the JSON 
body of the request to the item parameter.
Example: @RequestBody Item item
@Autowired
• Explanation: It allows Spring to resolve and inject 
collaborating beans into your bean. In the example, 
@Autowired is used to inject the ItemService and 
ItemRepository instances into the controller and 
service classes, respectively.
@SpringBootApplication
• Explanation: It combines three annotations—
@Configuration, @EnableAutoConfiguration, and 
@ComponentScan. It enables auto-configuration and 
component scanning in a Spring Boot application. In 
the example, @SpringBootApplication is used to mark 
the SpringBootRestApplication class as the main entry 
point of the Spring Boot application.
203
204
These annotations are key components of Spring Boot, enabling 
developers to build RESTful web services efficiently and effectively by 
simplifying configuration and boilerplate code.
Summary
For our examples, we’ve seen how to develop RESTful services using Java and 
Spring Boot. Now you know how to create a project, specify a quick model, 
implement REST endpoints using annotations, and launch your service. 
Writing RESTful services is one of the key skills of any backend developer 
because it helps you develop scalable, maintainable, and interoperable web 
APIs. Test different endpoints, handle more complicated data structures, and 
see what else Spring Framework has to offer for your REST services.
Synchronous vs. Asynchronous 
Communication
In software development, how systems talk to each other—whether they 
like to chat in real time (synchronous) or prefer leaving messages for 
later (asynchronous)—makes a huge difference. These communication 
modes can shape how components manage requests, juggle resources, 
and respond under pressure. In the world of microservices, where many 
small services have to play nice together, getting communication right is 
nonnegotiable. Synchronous communication is like a direct phone call 
between services: one calls, the other answers, and both wait until the 
conversation is over. Asynchronous communication is more like leaving 
a voice message—services can go about their business while waiting for 
a reply as represented in Figure 4-1. Understanding when to use each of 
these styles is key to designing microservices that don’t buckle under the 
weight of too many conversations and stay resilient even when one service 
gets stuck in traffic.
Chapter 4 Developing Microservices
205
Figure 4-1. This diagram shows two microservice communication 
styles: Synchronous (Service A waits for a response from Service B) 
and Asynchronous (Services A and B communicate via a message 
broker, operating independently)
Synchronous Communication
Synchronous communication works similar to direct phone call—the 
client makes a request to the server, waits for the response, then exits. This 
interaction is instantaneous and tightly coupled so that the client has no 
choice but to wait until the server gets a response. The perks of synchronous 
communication? Well, it’s pretty simple to grasp and implement. You get 
immediate feedback since the client knows right away if the request was 
successful or not. Plus, debugging is easier since everything happens in a 
neat, linear sequence. But the limitations are equally apparent. Then there 
is the delay—because the client is waiting on the response, it slows down. 
Scalability is also vulnerable; if you have a large number of concurrent 
Chapter 4 Developing Microservices
206
requests, it will overwhelm the server, which is an unavoidable bottleneck. 
Fault tolerance is another issue; if the server fails, all dependent services 
may go down, leading to system-wide disruption.
Example in Java
Here is an example of synchronous communication using REST with 
Spring Boot:
 @GetMapping("/{id}")
 public Optional<Item> getItemById(@PathVariable Long id) {
 return itemList.stream().filter(item -> item.getId().
equals(id)).findFirst();
 }
In this example, when the client makes a GET request to /orders/
{id}, it waits until the server returns the order data. This is the same 
example we have discussed in the previous section.
Asynchronous Communication
Asynchronous communication operates in a way that lets the client send a 
request to the server and keep on with its business without waiting for an 
instant reply. Think of it like firing off an email—you send it, go about your 
day, and wait for a response whenever it arrives. The reply typically comes 
through a callback, message queue, or event system.
One of the major perks is that it’s nonblocking, meaning the client can 
juggle other tasks instead of sitting idly by. This makes it ideal for handling 
a high volume of requests efficiently, boosting scalability. Plus, it enhances 
fault tolerance—systems can retry failed requests or fall back on alternate 
solutions when things go awry.
However, asynchronous communication isn’t all sunshine and 
roses. It comes with added complexity, both in terms of implementation 
and understanding. Feedback is delayed, so you won’t get that instant 
Chapter 4 Developing Microservices
207
gratification of knowing whether your request succeeded. And let’s not 
forget debugging—tracing the flow of messages can feel like navigating a 
maze, adding another layer of challenge.
Example in Java
Here is an example of asynchronous communication using REST with 
Spring Boot. For asynchronous communication, we have to integrate 
some messaging queues which can store the messages and process 
them in order so that your main controller can continue to process other 
items in parallel. For this example, we are using RabbitMQ (https://
www.rabbitmq.com/), but you could also consider using other messaging 
services like Apache Kafka (https://kafka.apache.org/) to stream data 
in real time; Amazon SQS (https://aws.amazon.com/sqs/), which is fully 
managed and perfect for AWS applications; or Apache Pulsar (https://
pulsar.apache.org/), which includes geo-replication and storage 
in layers.
You choose your messaging system depending on what you need from 
your application—scalability, message retention, or order guarantees. 
Below example uses RabbitMQ to show how we can do asynchronous 
communication with a Spring Boot application.
Add RabbitMQ dependencies in pom.xml:
<dependency>
 <groupId>org.springframework.amqp</groupId>
 <artifactId>spring-rabbit-test</artifactId>
 <scope>test</scope>
</dependency>
<dependency>
 <groupId>org.springframework.amqp</groupId>
 <artifactId>spring-rabbit</artifactId>
 <version>3.1.3</version>
</dependency>
Chapter 4 Developing Microservices
208
Configuration class:
@Configuration
public class RabbitConfig {
 @Bean
 public Queue queue() {
 return new Queue("rabbitQueue");
 }
 @Bean
 public TopicExchange exchange() {
 return new TopicExchange("orderExchange");
 }
 public Binding binding(Queue queue, TopicExchange 
exchange) {
 return BindingBuilder.bind(queue).to(exchange).
with("orderRountingKey");
 }
}
Create a dummy OrderReceiver class:
@Component
public class OrderReceiver {
 @RabbitListener(queues = "orderQueue")
 public void receiveOrder(Order order) {
 System.out.println("Received Order: "+order);
 }
}
Create a dummy OrderSender class:
@Component
public class OrderSender {
 @Autowired
Chapter 4 Developing Microservices
209
 private RabbitTemplate rabbitTemplate;
 public void sendOrder(Order order) {
 rabbitTemplate.convertAndSend("orderExchange", 
"orderRoutingKEy", order);
 }
}
Explanation
In this example, the client sends an order message to RabbitMQ, and the 
receiver processes it asynchronously. The client does not wait for the order 
to be processed and can continue executing other tasks.
Binding Bean: Binds the queue (rabbitQueue) to the exchange 
(orderExchange) using the routing key “orderRoutingKey.” This allows 
messages sent to the exchange with this routing key to be directed to 
the queue.
@RabbitListener: Tells Spring to listen for messages from the 
“orderQueue” queue.
sendOrder Method: This method sends an Order object to the 
“orderExchange” using the routing key “orderRoutingKey.” The 
RabbitTemplate converts and sends the order message to RabbitMQ.
EXERCISE CHAPTER 4-2
1. Build the above example in any IDE of your choice like IntelliJ or 
Eclipse.
2. Place 1000 orders sequentially and print all of them and 
compare the program start time and end time between 
synchronous and asynchronous programs.
Chapter 4 Developing Microservices
210
Choosing the Right Communication Style
Choosing the right communication style for your system really boils down 
to your specific needs and constraints. Synchronous communication 
works best when you need an immediate response, the operations are 
quick and lightweight, and you’re aiming for simplicity in implementation. 
On the flip side, asynchronous communication shines when tasks are 
resource-heavy or time-consuming, scalability and fault tolerance are 
top priorities, and your system needs to handle a high volume of requests 
without breaking a sweat.
Summary
Mastering the nuances between synchronous and asynchronous 
communication is key to building responsive, efficient systems. With 
Java’s powerful frameworks like Spring Boot, you’ve got the tools to handle 
both styles of communication like a pro. Picking the right communication 
model isn’t just about functionality; it’s about making your system smarter, 
faster, and more scalable. By choosing wisely, you’ll keep everything 
running smoothly while meeting those all-important operational goals 
and user expectations.
Event-Driven Architecture and Messaging
Event-Driven Architecture (EDA) is like the cool, laid-back sibling of 
traditional software patterns, where instead of services constantly poking 
each other for updates, they sit back and wait for things to happen—
reacting only when events occur. It revolves around the creation, detection, 
and consumption of these events, allowing different parts of your system 
to communicate without being tightly coupled. In EDA, events are small, 
self-contained packets of information that describe significant happenings 
Chapter 4 Developing Microservices
Chapter 4 Developing Microservices
within the system, like a customer placing an order or an item running 
out of stock. This pattern is ideal for distributed systems where flexibility, 
scalability, and responsiveness take center stage.
With messaging as the backbone of this architecture, services can 
focus on their tasks while asynchronously listening for events that might 
interest them. Think of it as a system where everyone is minding their own 
business but remains ready to jump in when something important comes 
their way.
Key Concepts, Benefits, and Drawbacks
Event-Driven Architecture (EDA) is based on a few concepts that make 
it a cost-effective and open way to create distributed systems. Events are 
actually actual meaningful events that happen to the system—for example, 
an order being received or payment received. They are produced by event 
producers, the components that generate these events. In contrast, there 
are event consumers, the items that react to them by doing something 
such as updating a database or publishing a message. An event broker 
or messaging system (the middleware), which acts as a communication 
channel between producers and consumers, takes care of delivering and 
receiving events.
EDA brings significant benefits. Decoupling allows components to 
be loosely tied together, so each can be developed, deployed, and scaled 
independently. This decoupling makes scalability a natural advantage, 
as events can be processed by multiple consumers distributed across 
different services. The system’s flexibility shines here, too, since you can 
easily add or modify producers and consumers without disrupting the 
entire system. Plus, EDA improves resilience, as event brokers can replay 
events or persist them, ensuring that failures don’t result in data loss and 
that processes can be retried when needed.
211
212
However, EDA is not without its challenges. The complexity of 
managing asynchronous communication and event flows can increase, 
especially in large systems. Event duplication or out-of-order processing 
requires additional handling to ensure consistency. Also, latency can be 
a drawback in scenarios where real-time responses are critical, as the 
decoupled nature introduces delays. Lastly, debugging and tracing the 
flow of events through a distributed system can be more difficult, making 
troubleshooting more complex than in tightly coupled architectures.
Example in Java Using Spring Boot and Apache Kafka
Let’s create a simple event-driven system where an OrderService generates 
events when an order is created, and a NotificationService listens to these 
events and sends notifications.
Add Kafka dependencies to pom.xml
<dependency>
 <groupId>org.springframework.kafka</groupId>
 <artifactId>spring-kafka</artifactId>
</dependency>
<dependency>
 <groupId>org.springframework.kafka</groupId>
 <artifactId>spring-kafka-test</artifactId>
 <scope>test</scope>
</dependency>
Configure Kafka
application.properties:
#Kafka Configuration
spring.kafka.bootstrap-servers= localhost:9092
spring.kafka.consumer.group-id= order-group
spring.kafka.consumer.auto-offset-reset= earliest
Chapter 4 Developing Microservices
213
Create Order Event Model
public class OrderEvent {
 private String orderId;
 private String orderStatus;
 public OrderEvent(String orderId, String orderStatus) {
 this.orderId = orderId;
 this.orderStatus = orderStatus;
 }
 public String getOrderId() {
 return orderId;
 }
 public void setOrderId(String orderId) {
 this.orderId = orderId;
 }
 public String getOrderStatus() {
 return orderStatus;
 }
 public void setOrderStatus(String orderStatus) {
 this.orderStatus = orderStatus;
 }
}
Create OrderService to Produce Events
@Service
public class OrderService {
 private final KafkaTemplate<String, OrderEvent> 
kafkaTemplate;
Chapter 4 Developing Microservices
214
 public OrderService(KafkaTemplate<String, OrderEvent> 
kafkaTemplate) {
 this.kafkaTemplate = kafkaTemplate;
 }
 public void createOrder(String orderId) {
 OrderEvent event = new OrderEvent(orderId, "CREATED");
 kafkaTemplate.send("orders", event);
 System.out.println("Order event sent for orderId: " + 
orderId);
 }
}
Configure Kafka Producer
public class KafkaConfig {
 @Bean
 public ProducerFactory<String, OrderEvent> 
producerFactory() {
 Map<String, Object> config = new HashMap<>();
 config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, 
"localhost:9092");
 config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, 
StringSerializer.class);
 config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_
CONFIG, JsonSerializable.class);
 return new DefaultKafkaProducerFactory<String, 
OrderEvent>(config);
 }
 public KafkaTemplate<String, OrderEvent> kafkaTemplate() {
 return new KafkaTemplate<>(producerFactory());
 }
}
Chapter 4 Developing Microservices
215
Create NotificationService to Consume Events
@Service
public class NotificationService {
 public void consume(OrderEvent event) {
 System.out.println("Received order event: " + event.
getOrderId() + " with status: " + event.getOrderStatus());
 }
}
Configure Kafka Consumer
@Configuration
public class KafkaConsumerConfig {
 @Bean
 public ConsumerFactory<String, OrderEvent> 
consumerFactory() {
 Map<String, Object> config = new HashMap<>();
 config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, 
"localhost:9092");
 config.put(ConsumerConfig.GROUP_ID_CONFIG, 
"order-group");
 config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, 
StringDeserializer.class);
 config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_
CONFIG, JsonDeserializer.class);
 return new DefaultKafkaConsumerFactory<String, 
OrderEvent>(config);
 }
 @Bean
 public ConcurrentKafkaListenerContainerFactory<String, 
OrderEvent> kafkaListenerContainerFactory(){
Chapter 4 Developing Microservices
216
 ConcurrentKafkaListenerContainerFacto
ry<String, OrderEvent> factory = new 
ConcurrentKafkaListenerContainerFactory<>();
 factory.setConsumerFactory(consumerFactory());
 return factory;
 }
}
Expose an API Endpoint
@RestController
@RequestMapping("/orders")
public class OrderController {
 @Autowired
 OrderService orderService;
 @GetMapping("/{id}")
 public ResponseEntity<Order> getOrder(@PathVariable 
Long id){
 ResponseEntity<Order> resp = null;
 try {
 Order order = orderService.getOrder(id);
 resp = new ResponseEntity<Order>(order, 
HttpStatus.OK);
 }catch(OrderNotFoundException e) {
 throw e;
 }
 return resp;
 }
 @PostMapping
 public ResponseEntity<Order> createOrder(@RequestBody 
Order order){
Chapter 4 Developing Microservices
217
Order savedOrder = orderService.saveOrder(order);
 return ResponseEntity.status(HttpStatus.CREATED).
body(savedOrder);
 }
}
Explanation
This is just an easy Spring Boot/Apache Kafka event-driven program. 
There are two services that the application is consuming, OrderService and 
NotificationService.
OrderService: Order Service that processes orders. When you place an 
order, the order event (OrderEvent) is created with the order information, 
like orderId and orderStatus. Then it propagates this event to a Kafka topic 
named “orders” with KafkaTemplate.
NotificationService: This service will listen for “orders” topic events. 
It logs the order data whenever it consumes an OrderEvent, showing it 
received the event and the orderId and orderStatus.
Kafka Setup: The program sets up Kafka producers and consumers 
on Spring Kafka. KafkaConfig creates the producer factory and template 
to pass events to, and KafkaConsumerConfig creates the consumer factory 
and listener container to listen to Kafka events.
ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG: This 
specifies the deserializer class for the keys of the Kafka messages. Kafka 
serializes data before sending it so a deserializer is required to convert it 
back into a usable format.
ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG: This 
specifies the deserializer class for the values of the Kafka messages. The 
JsonDeserializer class is used here, which converts the message value 
(stored as bytes) into a JSON object or a POJO (Plain Old Java Object) 
based on the target data type.
217
Order Event Model: OrderEvent is an easy model storing order data 
like ID, status, etc.
OrderController: This controller exposes the REST API endpoints 
for order administration. The GET request gets an order ID and the 
POST request adds a new order, and it sends createOrder function to the 
OrderService, sending the Kafka event.
This implementation describes a minimal event-driven system where 
services communicate through Kafka, asynchronously, offering a scaled, 
decoupled framework for handling and responding to events.
EXERCISE CHAPTER 4-3
1. Build the above example in any IDE of your choice like IntelliJ or Eclipse.
2. Build a similar program based on the event-driven approach 
using Spring Boot and Apache Kafka of User Registration and 
Notification System. This system manages user registration 
events and sends notifications when a user successfully 
registers. It follows the same structure and principles as the 
order processing system.
Summary
EDA and messaging are the twins of modern software architecture 
and a great way to create scalable, loosely coupled systems capable of 
asynchronous communication. Event brokers such as Apache Kafka and 
Java-based event producers and consumers help programmers build 
performant, scalable applications that handle high-throughput events. It is 
not just nice-to-have but absolutely essential to understand EDA basics of 
messaging systems in today’s tech-enabled world. It enables you to build 
flexible, scalable, and robust architectures that are ready for real-time events.
Chapter 4 Developing Microservices
219
Service Discovery and Load Balancing
Service Discovery and Load Balancing are like the dynamic duo of modern 
distributed systems, working together to ensure efficient communication 
between microservices while keeping the whole operation scalable and 
reliable. In a microservices architecture, where services are constantly 
being deployed, scaled, or updated, these components ensure that services 
can seamlessly find each other and distribute the load without overloading 
any single instance.
Service Discovery is the system’s GPS and helps services find each other 
dynamically (without having to hardcode dependencies). Service Registry: 
This is one of the primary components of Service Discovery, which is a 
single-entry point to keep track of all services, location in the network, and 
metadata. While the Service Discovery Client is the system component that 
searches through this registry to identify the services it wants to interface 
with to facilitate fast and fluid interservices communications. But Service 
Discovery’s major limitation is that it opens the door to Service Registry 
being a centralized source of failure. When it crashes, services can’t find 
each other anymore, causing communication disruption.
However, Load Balancing is a traffic manager and distributes incoming 
requests among different service instances so that one of them does not 
get overwhelmed. This ensures that system resources are used efficiently, 
response times are kept as low as possible, and there is no service 
instance that overflows. Load Balancing has different approaches, like 
Round Robin where the request is evenly spread over multiple instances; 
Least Connections, which sends requests to the instance with the fewest 
connection(s); Random, which randomly places service instances to 
receive new requests; and Weighted Round Robin, where larger instances 
receive more requests. While it’s a good thing, Load Balancing can 
be problematic. Tracking stateful services, for example, can be very 
problematic because requests that are needed to be processed by the same 
instance may be flung out somewhere else, and it can break things.
Chapter 4 Developing Microservices
220
Though both Service Discovery and Load Balancing are important for 
scalability and performance, they are not without their challenges. Service 
Discovery makes things harder to manage (secure) the registry, and Load 
Balancing creates latency or unbalanced distribution if not properly 
done. The right amount of balance between these elements will ensure a 
strong, reliable system capable of adapting to the changes in a distributed 
microservices architecture.
Implementing Service Discovery in Java
To illustrate Service Discovery in Java, we’ll use Netflix Eureka for Service 
Discovery. Don’t worry about Load Balancing, we will learn that in the 
next section.
Set up Eureka server in pom.xml:
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-netflix-eureka-server</
artifactId>
</dependency>
Create an application class:
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerProjectApplication {
 public static void main(String[] args) {
 SpringApplication.run(EurekaServerProjectApplication.
class, args);
 }
}
Chapter 4 Developing Microservices
221
application.properties:
spring.application.name=EurekaServerProject
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
Register a Client Service with Eureka
pom.xml:
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-netflix-eureka-client</
artifactId>
</dependency>
application.properties:
spring.application.name=order-service-client
# Eureka Details
eureka.client.service-url.defaultZone = http://
localhost:8761/eureka
eureka.instance.instance-id=${spring.application.
name}:${random.value}
Client Application Class:
@SpringBootApplication
public class EurekaClientProjectApplication {
 public static void main(String[] args) {
 SpringApplication.run(EurekaClientProjectApplication.
class, args);
 }
}
Chapter 4 Developing Microservices
222
Client Service:
@RestController
@RequestMapping("/client")
public class EurekaClientController {
 @Autowired
 private RestTemplate restTemplate;
 public String getOrder() {
 return restTemplate.getForObject("http://order-service/
orders", String.class);
 }
}
Create a Config Template:
@Configuration
public class RestTemplateConfig {
 @Bean
 public RestTemplate restTemplate() {
 return new RestTemplate();
 }
}
Explanation
@EnableEurekaServer: Activates the Eureka Server, making this 
application act as a service registry where other services can register and 
discover each other.
spring.application.name: Sets the application name for this Eureka 
server instance.
server.port=8761: Configures the server to run on port 8761 (the 
default port for Eureka).
Chapter 4 Developing Microservices
223
eureka.client.register-with-eureka=false: Prevents the Eureka server 
itself from registering with another Eureka instance.
eureka.client.fetch-registry=false: Instructs the server not to fetch 
the registry since it is the registry itself.
spring.application.name=order-service-client: Names the client 
service as order-service-client.
eureka.client.service-url.defaultZone: Points the client to the Eureka 
server located at http://localhost:8761/eureka for service registration and 
discovery.
@RestController: Marks this class as a REST controller that handles 
HTTP requests.
@RequestMapping("/client"): Sets up a base path /client for this 
controller.
RestTemplate: A Spring-provided class for making HTTP requests.
getOrder Method: Makes a request to another service (order-service) 
to fetch orders. The service URL (http:// order-service /orders) uses Eureka 
for client-side load balancing and resolving the service instance URL.
Eureka Server: The EurekaServerProjectApplication acts as a service 
registry. It allows other services to register and discover each other.
Eureka Client: The order-service-client registers with the Eureka 
server. It can also discover other services registered in the Eureka registry.
Service Communication: The EurekaClientController uses a 
RestTemplate to call another service (order-service) by its name, relying on 
Eureka for service discovery and client-side load balancing.
Summary
In conclusion, Service Discovery and Load Balancing are the backbone of 
scalable and resilient microservices architectures. With tools like Netflix 
Eureka and Ribbon in your Java toolbox, you can seamlessly implement 
dynamic service registration, discovery, and smart load balancing across 
instances. Grasping these concepts allows you to build distributed systems 
Chapter 4 Developing Microservices
224
that aren’t just robust, but also agile and well equipped to handle the 
scaling challenges of today’s ever-evolving digital landscape. It’s all about 
keeping those microservices talking and thriving—without breaking 
a sweat.
API Gateways and Rate Limiting
API Gateways serve several important functions in a microservices 
system—they provide the entry point to customers, but also handle 
multiple backend services. They handle authentication and authorization, 
which helps in limiting access of non-auth-authorized users or services 
to highly sensitive backend data, which makes it more secure. The first 
thing an API Gateway provides is rate limiting, the limit of the number of 
requests in a day, so that the services are not overloaded, misused, and 
clients are getting a reasonable share of resources. Another fundamental 
role is load balancing where the traffic is dynamically distributed across 
several instances of the service for increased performance, availability, and 
reliability. Monitoring and logging are also provided by API Gateways with 
the help of metrics and logs that provide rich system behavior information 
that allows us to quickly diagnose, analyze, and optimize resource 
consumption.
However, API Gateways come with their own challenges. One of the 
most significant drawbacks is the potential to become a single point 
of failure. If the gateway goes down, access to all backend services is 
disrupted, making redundancy and failover mechanisms critical. API 
Gateways can also introduce added latency, as they add an extra hop in 
the request-response cycle. This complexity extends to management as 
well, as maintaining an API Gateway adds another layer of architectural 
intricacy. Lastly, scalability is a concern—if the gateway isn’t designed 
to scale with increasing traffic and services, it can quickly become a 
bottleneck, impacting overall system performance.
Chapter 4 Developing Microservices
225
Implementing Spring Cloud API Gateway
Add dependencies to pom.xml:
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-gateway-server</artifactId>
 <version>4.1.5</version>
</dependency>
Application.properties:
#Gateway properties
server.port=80
spring.application.name=GATEWAY-SERVICE
# Eureka Details
eureka.client.service-url.defaultZone = http://
localhost:8761/eureka
Configure Spring Cloud Gateway:
public class GatewayRoutingConfig {
 public RouteLocator locator;
 @Bean
 public RouteLocator customRouteLocator(RouteLocatorBuilder 
builder) {
 return builder.routes()
 .route("order-service", p -> p
 .path("/orders/**").uri("lb:// order-service"))
 .build();
 }
}
Chapter 4 Developing Microservices
226
In this example, any request that starts with /orders/** will be routed 
to the order-service. The lb:// prefix indicates that Spring Cloud Gateway 
should use a load balancer to route the request to an instance of order￾service registered in Eureka.
To implement rate limiter, let’s create a simple program using Spring 
Cloud API Gateway and Redis.
Add Redis to dependencies:
<dependency>
 <groupId>org.springframework.data</groupId>
 <artifactId>spring-data-redis</artifactId>
 <version>3.1.9</version>
 </dependency>
Apply Rate Limiter to Gateway Service:
public class GatewayRoutingConfig {
 public RouteLocator locator;
 @Bean
 public RouteLocator customRouteLocator(RouteLocatorBuilder 
builder) {
 return builder.routes()
 .route("order-service", p -> p
 .path("/orders/**")
 .filters(f -> f.requestRateLimiter(c-> c.setRate
Limiter(redisRateLimiter())))
 .uri("lb:// order-service"))
 .build();
 }
 public RedisRateLimiter redisRateLimiter() {
 return new RedisRateLimiter(10,20);
 }
}
Chapter 4 Developing Microservices
227
In this configuration, the rate limiter is applied to the order-service
route, limiting the requests to 10 per second with a burst capacity of 20.
Summary
Using Spring Cloud Gateway to implement an API Gateway is a smart move 
for managing traffic to your microservices with ease. Adding rate limiting on 
top of that ensures your services don’t get overwhelmed and remain efficient, 
even under heavy load or potential misuse. Spring Cloud Gateway’s rich 
feature set gives you the flexibility to create a robust, scalable, and resilient 
architecture that can grow with your system’s needs. This foundational setup 
not only handles traffic but also paves the way for you to incorporate essential 
cross-cutting concerns like security, logging, and monitoring—helping you 
build a complete and more dependable microservices environment.
Resilience and Fault Tolerance
In a microservices model, services span multiple servers or even data 
centers and can scale easily but come with some challenges. These include 
latency, partial failures, and limiting the number of resources. Resilience 
and fault tolerance become important to ensure the system will be able 
to take this in graceful fashion and keep functioning despite failures of 
certain components. Resilience can be defined as the system’s capacity 
to overcome failure and continue to function, and fault tolerance is the 
system’s ability to function correctly under the impact of failure. In order to 
get those features for microservices, developers use various methods.
Another is to have retries. When a service request is canceled due to 
some short-term problem, the process retries it automatically. Retries 
recover from short-term glitches but are also an added burden on the 
system that may escalate to larger issues if handled incorrectly. Another 
critical pattern is the Circuit Breaker, which prevents repeated execution 
of failing operations by “opening the circuit” after a certain number of 
Chapter 4 Developing Microservices
228
failures. This strategy allows failing services time to recover without 
overwhelming them with requests. However, configuring the thresholds 
for when to open and close the circuit requires careful tuning, as improper 
settings could either block requests unnecessarily or fail to provide enough 
time for recovery.
The bulkhead pattern involves isolating different parts of the system so 
that failures in one area don’t cascade and affect others. This isolation can 
enhance the overall resilience of the system, but it also adds complexity, 
as resources must be carefully allocated to ensure each bulkhead is 
appropriately sized and managed.
Finally, implementing fallbacks provides alternative solutions when 
a service fails, such as default responses or cached data. While fallbacks 
ensure that the system remains responsive, they can degrade the user 
experience if the fallback responses are insufficient or outdated.
Despite these strategies, there are potential drawbacks to consider. 
Retries, if overused, can increase latency and system load. Circuit breakers 
can disrupt services if misconfigured, and bulkheads require thoughtful 
planning to prevent inefficient resource utilization. Fallback mechanisms, 
while useful, can lead to inconsistent user experiences if not designed 
carefully. Balancing these strategies is essential for creating resilient, fault￾tolerant microservices systems that can gracefully handle the inevitable 
failures that come with distributed architectures.
Implementing Resilience4j
Add dependency to pom.xml:
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-circuitbreaker-resilience4j
</artifactId>
</dependency>
Chapter 4 Developing Microservices
229
Configure Resilience4j in your application.properties:
resilience4j.circuitbreaker.configs.default.register-health￾indicator=true
resilience4j.circuitbreaker.configs.default.permitted-number￾of-calls-in-half-open-state=3
resilience4j.circuitbreaker.configs.default.sliding-window￾type=TIME_BASED
resilience4j.circuitbreaker.configs.default.minimum-number￾of-calls=5
resilience4j.circuitbreaker.instances.backendB.
waitDurationInOpenState=10000
resilience4j.circuitbreaker.instances.backendB.
failureRateThreshold=50
resilience4j.retry.instances.backendA.maxAttempts=3
resilience4j.retry.instances.backendA.waitDuration=500
resilience4j.bulkhead.instances.backendA.maxConcurrentCalls=10
resilience4j.bulkhead.instances.backendB.maxWaitDuration=10ms
resilience4j.bulkhead.instances.backendB.maxConcurrentCalls=20
Configuration class:
@Configuration
public class AppConfig {
 @Bean
 public RestTemplate restTemplate() {
 return new RestTemplate();
 }
}
Implementing Bulkhead
Service class:
public class ExternalService {
 private final RestTemplate restTemplate;
Chapter 4 Developing Microservices
230
 @Autowired
 public ExternalServiceImpl(RestTemplate restTemplate) {
 this.restTemplate = restTemplate;
 }
 @Bulkhead(name="serviceBulkhead")
 @CircuitBreaker(name="serviceCB", fallbackMethod="fallback")
 @Retry(name="serviceRetry")
 public String callExternalService() {
 return restTemplate.getForObject("http://external￾service/api", String.class);
 }
 public String fallback(Throwable t) {
 return "Fallback response due to: " + t.getMessage();
 }
}
Create a Rest Controller class to test resiliency:
@RestController
@RequestMapping("/api")
public class ApiController {
 @Autowired
 private ExternalService externalService;
 @GetMapping("/external")
 public String callExternal() {
 return externalService.callExternalService();
 }
}
Chapter 4 Developing Microservices
Chapter 4 Developing Microservices
In This Example
• The @CircuitBreaker annotation is used to wrap 
the callExternalService method. If the method fails 
repeatedly, the circuit breaker will open, preventing 
further calls until the service recovers.
• The @Retry annotation automatically retries the 
callExternalService method if it fails.
• The fallback method provides a fallback response when 
the circuit breaker opens.
• The @Bulkhead annotation limits the number of 
concurrent calls to callExternalService to five.
• If more than five concurrent calls are made, additional 
calls will wait up to one second before failing.
• When you make a GET request to /api/external, the 
ExternalService will be called with resilience patterns 
applied.
• resilience4j.circuitbreaker.configs.default.registerhealth-indicator=true: Enables the health indicator for 
the default circuit breaker configuration, allowing it to 
be monitored via Spring Actuator.
• resilience4j.circuitbreaker.configs.default.permittednumber-of-calls-in-half-open-state=3: Specifies the 
number of test calls allowed when the circuit breaker 
is in the half-open state to decide whether to transition 
back to closed or remain open
231
• resilience4j.circuitbreaker.configs.default.sliding￾window-type=TIME_BASED: Configures the circuit 
breaker to use a time-based sliding window for 
evaluating metrics like failure rate.
• resilience4j.circuitbreaker.configs.default.minimum￾number-of-calls=5: Sets the minimum number of calls 
that must be made before the circuit breaker starts 
evaluating metrics like failure rate.
• resilience4j.circuitbreaker.instances.backendB.
waitDurationInOpenState=10000: Specifies the 
duration (in milliseconds) the circuit breaker will 
remain in the open state before transitioning to half￾open. Here, it’s ten seconds.
• resilience4j.circuitbreaker.instances.backendB.
failureRateThreshold=50: Sets the failure rate threshold 
(in percentage). If 50% or more of the calls fail, the 
circuit breaker will open.
• resilience4j.retry.instances.backendA.maxAttempts=3: 
Defines the maximum number of retry attempts for 
backendA before giving up.
• resilience4j.retry.instances.backendA.
waitDuration=500: Specifies the wait time 
(in milliseconds) between retry attempts for 
backendA. Here, it waits 500ms between retries.
• resilience4j.bulkhead.instances.backendA.
maxConcurrentCalls=10: Limits the maximum number 
of concurrent calls allowed for backendA to prevent 
overload.
232
233
• resilience4j.bulkhead.instances.backendB.
maxWaitDuration=10ms: Sets the maximum time (10 
milliseconds) that a call can wait in the queue if the 
bulkhead’s concurrent call limit is reached.
• resilience4j.bulkhead.instances.backendB.
maxConcurrentCalls=20: Specifies the maximum 
number of concurrent calls allowed for backendB.
Summary
Crafting resilient and fault-tolerant Java applications is like building a system 
with a built-in superhero cape—ready to swoop in and save the day when 
things go wrong (which they inevitably will). In distributed environments, 
where services can fail or slow down, these principles become the glue that 
holds everything together. Implementing patterns like the trusty Circuit 
Breaker or adding retry mechanisms is like giving your app a second chance 
to succeed. These techniques help minimize disruptions and keep things 
running smoothly, even when the unexpected strikes.
And here’s where frameworks like Resilience4j and Spring Retry come 
in, turning these strategies into easy-to-apply solutions for boosting 
reliability. By weaving resilience into the fabric of your Java applications, 
you’re not just preventing total system meltdowns—you’re also ensuring 
that when things go south, your app knows how to bounce back with style 
and grace. High availability? Check. Calm in the storm? Double-check.
Conclusion
Congrats, you’ve completed one of the most critical steps in this 
microservices journey! This chapter went from figuring out what 
technology stack to go with, creating RESTful services using Spring Boot, 
and even getting in the communication lane to know synchronous vs. 
Chapter 4 Developing Microservices
Chapter 4 Developing Microservices
asynchronous interactions. We dived into the firepower of event-driven 
architecture, highlighted service discovery and load balancing, and 
concluded with an overview of resilience design patterns such as retries, 
circuit breakers, and bulkheads. Quite the whirlwind, isn’t it? But now 
you have a solid starting point for an efficient and secure microservices 
ecosystem. This isn’t the end of the story! It’s not all about creating 
microservices. We now proceed to the equally important step: testing, 
deployment, and scaling. This chapter was about creating services, but 
the next chapter is about “how do we make these services work in the 
real world?”
We will dive into unit testing and integration testing to verify individual 
services and interactions. So put on your work gloves, load up your 
testing tools, and take a look into the seamless deployments and scalable 
architectures. It’s still a long ride, and believe me, it’ll be worth every line 
of code.
234