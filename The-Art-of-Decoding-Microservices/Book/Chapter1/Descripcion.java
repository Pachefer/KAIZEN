Introduction
Purpose of the Book
Are you getting started with software development and architecture 
and feeling overwhelmed by the microservices landscape—or maybe 
you have been developing software for years and want to improve your 
understanding of the world of microservices? This book is for you. 
Whether you are looking for an introduction or are already knee-deep in 
this landscape, The Art of Decoding Microservices: An In-Depth Exploration 
of Modern Software Architecture cuts through the jargon and complexity 
to provide a comprehensive introduction to microservices that you can 
understand and apply.
The aim is to educate developers, architects, DevOps engineers, and 
IT leaders about how to develop and build microservices—whether it’s a 
greenfield project or a renovation of an existing system. We’ll teach you 
the basics, dive into advanced patterns, and point out common failures 
so you can avoid the headaches. Underpinning the book is the belief that 
microservices are more than a mere technical wave: they are business 
enablers, allowing you to be more agile, more scalable, and better equipped 
for digital transformation. You’ll certainly come away with insight into best 
practice, but also confidence in your ability to make better decisions, to 
innovate, and to manage in this ever-changing world of software.
Designed to be your trusted companion, this book is theory-rich and 
chock-full of hands-on examples of how to design and build systems. 
Whether you’re a novice microservices player looking to learn the ropes 
or an experienced systems professional seeking to tune your systems, 
you’ll find a host of tools and practical guidance to help you achieve your 
architectural goals… and maybe even have some fun along the way.
xix
xx
Who Should Read This Book?
If you’re involved in software development and architecture and need 
to cut through the buzz, The Art of Decoding Microservices: An In-Depth 
Exploration of Modern Software Architecture is the book you’ve been 
looking for. It’s both a beginner’s guide and a Swiss Army knife, a handy 
reference for those making their first foray into microservices as well as 
a refreshing and clear text for those who have been around the block a 
couple of times already.
From novice to microservices seasoned veteran, there is something for 
everyone in this book. Newcomers will benefit from an accessible, jargon￾free introduction to microservices, while seasoned practitioners will find 
advanced patterns and tools that take their systems to the next level. You’ll 
learn how to build scalable, resilient, and maintainable systems, based 
on real-world examples and case studies. You’ll learn the nitty-gritty 
of CI/CD pipelines, container orchestration, and service monitoring, 
so you have a playbook for keeping microservices running. You’ll also 
receive both strategic advice and practical tips for going from monolith to 
microservices, so you’ll be better prepared to tackle your own migration. 
This book bridges the gap between theory and practice, providing a wealth 
of information for study and innovation. You will be equipped to assess the 
technical and business pros and cons of adopting microservices so you can 
make the right decisions for your organization and its future.
Whether you’re in the trenches of code, leading a team, or making 
strategic decisions about your company’s tech stack, The Art of Decoding 
Microservices will help you gain the knowledge you need to succeed in 
this fast-paced world of software development. It’s helpful to have a basic 
understanding of software development and architecture before jumping 
into the deep end—but don’t worry; we’ll take you from novice to ninja in 
no time. Enjoy!
Introduction
xxi
What You Will Learn
In this book, you will learn:
What are microservices? And why should you 
care? The first few chapters of this book answer 
those questions and more, explaining what exactly 
a microservice is, how it differs from a monolithic 
architecture, and why adopting this style of 
software design can bring tremendous value to your 
organization.
Designing Microservices: You’ll learn important 
design principles for microservices, including how 
to decompose a monolith into microservices and 
how to design for failure.
Microservices Communication: Learn about 
the various “speaking styles” of a microservices 
architecture, such as the difference between 
synchronous and asynchronous communication 
and when to use each.
Deployment and Scaling: What is containerization? 
How can we orchestrate applications with 
packages such as Kubernetes? How can we scale 
microservices for more load?
Security and Monitoring: How to secure your 
microservices in a distributed system, and how 
to monitor the health of your system and the 
performance of your services.
Introduction
Introduction
Case Studies: Real-world examples of businesses 
that made the move to a microservices architecture, 
what the problems were, and how they dealt 
with them.
Best Practices and Antipatterns: The book ends 
with a chapter on best practices and antipatterns 
you should have in mind when working with 
microservices.
By the end of the book, the reader will have a solid understanding of 
microservices architecture and will be ready to apply these ideas to design, 
build, and run highly scalable, resilient, and efficient microservices-based 
systems.
How to Use This Book
Following along with the text, this book will take you on a tour of 
microservices, from the foundations of the architecture to its most complex 
twists and turns. Whether you’re getting started with microservices or are 
already a veteran, here’s how to get the most out of this book.
Start at the Beginning for a Complete Understanding: If you’re 
just beginning with microservices, please start at Chapter 1. No skipping 
ahead. Each chapter follows on from the previous one, in a natural 
progression that will ease your way into the more difficult material later on.
But Don’t Miss the Big Picture: The book is designed to walk you 
through from basics to more advanced topics. You don’t build a house by 
starting with the roof. As you progress through the logical flow, you’ll build 
the foundation before you venture into the deep waters of microservices.
xxii
Introduction
Use It As a Handy Reference: Have been working with microservices 
for a while but need a refresher on a particular topic? You can start 
wherever you need. The table of contents and index will help you rapidly 
jump to the topic you are looking for—perhaps you need to brush up on 
scaling strategies, or learn to manage APIs, or how fault isolation works, or 
other topics.
Quick Reference Tools: Summaries, diagrams, and checklists are 
interspersed throughout the book as a way to provide quick snippets 
of information to refresh your memory, without having to reread entire 
chapters.
Get Your Hands Dirty with Exercises and Examples: This isn’t a 
book to read. It’s a book to do. The hands-on activities and examples guide 
you through the process of putting theory into practice. Here’s where the 
rubber hits the road.
Play with Code Samples: Each of the samples in the book exists in a 
playpen. This means that you can run it, break it, tweak it, rework it, and 
generally have some fun. Try modifying and extending these examples to 
increase your learning process.
Learn from Real-World Case Studies: Winning with Case Studies: 
Pay particular attention to the real-world case studies. These aren’t just 
success stories; they’re packed with useful and actionable insights you can 
steal, um, I mean, apply to your projects.
Reflect on the Challenges and Solutions: While it’s a great feeling to 
breeze through a case study, the real benefit of reading these books is in 
the reflection. The challenges and solutions presented here will make you 
a better problem-solver and give context for applying best practices in the 
real world.
Stay Updated with Online Resources: Supplementary Materials: 
Check the online book for any additional materials—code repositories, 
further reading, or updates. These are a great way to stay in touch with the 
latest tools and techniques.
xxiii
Introduction
Get Involved in the Community: Join an online discussion forum or 
community for microservices. You can share what you have learned or 
pose questions or even help others as you are able to do so.
Gradually Apply Concepts: Keep It Simple: Once you’ve worked 
through what you’ve learned into a pattern of service, it’s time to deliver 
it. But start simple, with just the basic service, and work out the finer 
structure, those service machines, as you gain confidence. You have to 
crawl before you run.
Continuing to Learn: Microservices, like all technology, is continually 
evolving. This book will give you a great foundation, but always be curious 
and keep learning. New tools, techniques, and best practices come out all 
the time.
Final Thought: It’s a Marathon, Not a Sprint: Learning to master 
microservices isn’t something you sprint through. It’s about the journey. 
Go slow, absorb, and have fun. Each chapter gets you a little closer to 
understanding how you can make microservices work for you, and before 
you know it, you’ll begin building systems that are scalable, resilient, and, 
yes, damn cool!
Happy learning!
xxiv
1 © Sumit Bhatnagar and Roshan Mahant 2025 
S. Bhatnagar and R. Mahant, The Art of Decoding Microservices, 
https://doi.org/10.1007/979-8-8688-1267-5_1
CHAPTER 1
Evolution of Software 
Architecture
In the past few decades, software architecture has been on a wild 
roller coaster ride, morphing and twisting to accommodate the ever￾expanding needs of businesses, the relentless march of technology, and 
the unpredictability of project management whims. Let’s dive into this 
chapter and discover the exciting history of software architecture. It 
has been a journey from procedural code’s early days to today’s cloud￾powered wonders. It’s like watching an old, reliable bicycle transform 
into a self-driving, cloud-powered electric vehicle—while still expecting 
it to be just as simple to ride. What began as the humble art of structuring 
code has evolved into today’s cloud-native labyrinths, where even the 
most complex software systems are designed to make life, ideally, less of 
a digital headache. But, of course, every now and then, they do throw in a 
few migraines just to keep things interesting. Since software architecture 
is the core of technical business, this roller-coaster ride shows little sign 
of slowing down into the future. It’s safe to assume that there will be more 
automation—with more AI being leveraged in the system optimizers and 
actuators to help us make the best decisions. There will be even more 
serverless architectures, where instead of worrying about underlying 
infrastructure, developers will be fine with just programming at a higher 
2
abstraction level. Whatever the future holds, it’s safe to say that we will 
continuously transform software architecture once again to handle the 
next wave of challenge.
After all, this evolution—from procedural programming to the cloud￾native wonders of today—is part of a larger story about how technology 
starts to be seen: not just as tooling for solving a particular problem, but 
as an environment in which entire businesses, industries, and innovations 
can be constructed. The ride has been a little bumpy at times, but software 
architecture has made it all possible, one paradigm shift at a time. Let’s 
discuss more about this evolution in detail.
The Early Epoch: Structured Programming
The journey began with structured programming, where simplicity 
ruled the day, and the goal was just to keep your code from looking like 
a tangled bowl of spaghetti. Back in the 1960s and 1970s, software was 
pretty straightforward—or as straightforward as anything involving early 
computers could be. Programs were written in procedural chunks, where 
developers broke down their tasks into neat little subroutines. Think of it 
like following a recipe: Step 1, do this. Step 2, do that. Step 3, profit. While 
this was great for keeping things organized, it didn’t exactly lend itself to 
the growing complexity of the digital age.
The Golden Age: Object-Oriented 
Programming
By the late 1980s and into the 1990s, software had ballooned into massive 
beasts, and chaos was threatening to reign once more. Enter object￾oriented programming (OOP), arriving like a superhero with a cape—
except the cape was probably a Java or C++ manual. OOP didn’t just 
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
focus on what software did, but what it was. It neatly packaged data into 
objects, like putting a tiger in a digital zoo enclosure where it wouldn’t 
eat your other code. Concepts like inheritance, encapsulation, and 
polymorphism—words so complex they practically required their own 
user manuals—were introduced to tame the software wilderness. The 
result? Code that was modular, scalable, and didn’t require you to consult 
a magic 8-ball every time you wanted to update a system.
Component-Based Software 
Engineering (CBSE)
By the start of the 1990s, the software engineers were asking: “Can’t 
we push this just a bit further?” Enter Component-Based Software 
Engineering (CBSE). CBSE was a natural progression from OOP, but it took 
the principle of modularity to the nth degree. If OOP allowed developers 
to create building blocks, CBSE provided a whole catalog of those. With 
CBSE, software systems could be split up into reusable components that 
could be developed, tested, and deployed independently—just like the 
furniture pieces, they could be used again and again. CBSE applications 
developed faster and proved to be more reliable than their monolithic 
predecessors. No need to reinvent the wheel every time you have a new 
feature.
Monolithic Architecture
Meanwhile, the trusty monolithic architecture was still trucking along, 
especially for applications with clearly defined boundaries. With 
monolithic designs, you built an entire application as one gigantic, 
indivisible unit. Think of it like building a house, but with all the 
rooms sharing the same walls and plumbing. It worked—until your 
3
4
house got so big that renovations turned into a nightmare. While 
monolithic architecture made development and deployment relatively 
straightforward, things got messy when you tried to scale or maintain the 
application. If one room flooded, the whole house had issues. It was fine 
for smaller applications, but not ideal for complex, ever-growing systems.
Service-Oriented Architecture (SOA)
By the time we’d tottered into the early 2000s, the demand was for more 
flexibility and agility, like a gymnast, only with a lot fewer somersaults. 
Enter service-oriented architecture (SOA). The premise was to take the big, 
monolithic applications of the past, break them down into smaller distinct 
services, each one managing a specific business function but offered 
up for consumption over the network. SOA represented a way in which 
different systems could all remain independently interconnected, avoiding 
the descent into chaos; it was perfect for enterprise systems looking to 
increase scale and integrate diverse technologies and for the web services 
revolution and the explosion in standard protocols such as SOAP and 
REST. It wasn’t just a technical trend. SOA represented a revolution in the 
way that businesses could scale. And it arrived right on time.
Microservices Architecture
By the 2010s, people were starting to realize that monolithic designs 
couldn’t cope with the requirements imposed by modern applications—
especially those with ambitions to conquer the cloud. Microservices 
architecture was the finely tuned, more evolved cousin of SOA. Instead 
of a handful, a microservices architecture breaks up an application into 
potentially hundreds or thousands of loosely coupled services. Each 
service may be coded, deployed, and scaled independently. It’s like gluing 
together a piece of furniture from individual jigsaw puzzles. Each piece 
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
snaps together but doesn’t weigh the other pieces down; the result is a 
flexible architecture that’s perfectly suited to maps of a cloud. It thrives in 
situations where continuous delivery and aplomb are essential.
Cloud-Native Architectures
Side by side, the rise of microservices paralleled another emerging trend 
in the software world. If microservices made applications more agile, it 
turned out the real cherry on top was cloud-native, born specifically for 
platforms in the cloud. By combining the flexibility of microservices with 
the cloud’s scalability and resilience, these modern architectures leveraged 
the latest technologies—containers (think Docker) and orchestration 
(Kubernetes, anyone?)—in order to do the following in one go: (1) break 
down apps in smaller services, (2) run all of those application services 
everywhere, (3) have them scale automatically on demand, and (4) recover 
from failure without anyone feeling it. Cloud-native is all about moving 
fast in dynamic environments, making it MVP for any large enterprise with 
multiple moving pieces.
Looking Forward: Serverless and Beyond
And now we’re in an era of serverless computing—I’m beginning to feel 
like we’ve reached the “final boss” of complexity. With serverless, you as 
a developer can build and run applications without ever having to deal 
with the servers underpinning this infrastructure. Imagine you’re cooking 
dinner and, instead of having to wash up, the kitchen magic-resets itself. 
Serverless is kind of like that: you’re able to focus solely on the code, and 
the server infrastructure takes care of itself. I reckon this marks the next 
development frontier in reducing operational complexity and increasing 
deployment cycles: it feels like we’ve hit our stride with serverless, and 
5
Chapter 1 Evolution of Software Architecture
anywhere else to go, at least not until we’re all soon-to-be-redundant 
automatons trapped in some pixelated utopia… But we’re the tech 
industry, so you know we’ll find a way.
In general, each generation of software architecture diagram 
somewhat resembles the process of your favorite game character leveling 
up—with each successive generation, more powers are acquired, more 
restrictions are removed, and—especially—the potential is far greater. 
Structured programming, mainframe, distributed computing, client-server, 
and many of the other driving forces I’ve covered up to this point, such as 
monolithic and service-oriented architecture, are all ancient history; the 
world we (and developers) live in looks different now with the possibilities 
of serverless computing. It’s hard not to imagine that the future of the field 
will look even different as artificial intelligence, machine learning, and 
automation continue to reshape the landscape of how software is built and 
orchestrated.
But since I still have plenty of work to do before my soul is harvested 
by our machine overlords, I’ll walk you through each of these architectures 
in the next few sections. So, without further ado, grab your field plow and 
join me.
Monolithic Architecture
Monolithic architecture is like that sweater that fits everyone—except, 
unlike that sweater, it is never comfy, but instead tries to hold every 
component of your app together in one big, tightly woven ball. The user 
interface, the business logic, the data access, and every other part of the 
app are all squished together into one giant, monolithic codebase. You 
tweak that one part, and you are touching the whole thing, as shown in 
Figure 1-1. It’s like moving the furniture around in a house where every 
single piece is bolted to the floor. And when deployment time comes? The 
entire app has to go out, packaged together as one indivisible blob. Yay!
6
Chapter 1 Evolution of Software Architecture
This diagram illustrates a monolithic architecture for a shopping 
application. In this setup, all components of the application—UI Code, 
Catalog Service, Discount Service, Order Service, and ORM (Object￾Relational Mapping)—are tightly integrated into a single, large application. 
Both desktop and mobile clients interact with the monolithic system, 
which handles everything in one big package. All services within the 
shopping app share the same codebase and connect to a single database. 
While simple to develop and deploy initially, this architecture can become 
a challenge as the app scales, as changes to one part of the system often 
require redeploying the entire application.
Figure 1-1. A typical monolithic architecture
Key Characteristics
Single Codebase and Deployment Unit: All your code—frontend is 
contained in one place, backend, everything at one place. If you change 
a line of code in one part of the application, you have to rebuild and 
redeploy the entire application. Really, the entire application. Remember 
7
8
that WordPress bug? You also had to repaint your house because 
you wanted to change the color of one door. Single Codebase, Single 
Deployment Unit: Yes, that’s what this is.
Tightly Coupled Components: Everything is so interdependent; 
it’s like conjoined twins of the digital world. Make a change somewhere; 
usually, you’ll need to make a change somewhere else too. And you get to 
do lots of unexpected tweaking too, just when you least feel like it.
Simpler Development and Deployment: On the surface, monolithic 
architectures feel incredibly convenient. You’ve got fewer moving parts, so 
development, testing, and deployment might seem more straightforward. 
There’s just one app to think about, one app to deploy, and one app to 
rule them all. So why bother with anything else? Well, because, eventually, 
things get complicated. Fast.
The Trouble with Monolithic Architectures
Maintenance Mayhem: Your app gets so large that your codebase turns 
into a sprawling mess. Even when you’re adding new features, it starts 
to feel like you’re defusing a bomb—something little can go wrong, and 
it blows up in your face. They didn’t just fix code, they explored it, like 
traversing a jungle with only a flashlight and the dim hope of finding an 
exit somewhere.
Scaling Bottlenecks: When you want to scale a monolithic app, you 
have to scale the whole thing—warts, boils, and all. Even if there’s only 
one part of the app under pressure—let’s say the checkout page is getting 
slammed during a closeout sale—you have to scale the whole app, from 
its UI all the way down to the database and everything in between. It’s the 
mechanic approach to a broken windshield wiper—take the whole car to 
the garage. This “all-or-nothing” scaling approach comes with significant 
costs. Scaling up a large, single-block application demands considerable 
infrastructure resources, which can quickly translate into hefty bills 
for server space, memory, and CPU usage. Moreover, the downtime or 
Chapter 1 Evolution of Software Architecture
9
slowdowns involved in scaling a monolith can indirectly impact revenue, 
as users may experience lag or downtime. In contrast, a microservices 
architecture would allow only the checkout service to scale, optimizing 
resource allocation and potentially cutting costs by focusing on the specific 
part of the application that’s in demand.
Reliability Riddle: When one component decides to throw a tantrum 
and crash, it’s not just that part of the app that takes a nap—the whole 
system can go down with it. Picture your entire house losing power 
because your coffee maker short-circuits. That’s the kind of drama you sign 
up for with monolithic architectures.
Obsolescence Handcuffs: Commit to monolithic architecture and 
you’re essentially married to a certain tech stack. It’s great—until it isn’t. 
Need to modernize? Want to jump on board with the latest and greatest? 
Well, good luck with that! You might be looking at a full-on teardown and 
rebuild, since everything’s so tightly intertwined. Upgrading isn’t exactly a 
quick breakup; it’s more like trying to escape a locked room without the key.
Deployment Drag: With a monolith, every tiny change means 
redeploying the whole app—whether you’re fixing a login bug or adding 
a new button, the entire application has to go through the redeployment 
process. Got a small bug in the login form? Yep, better buckle up because the 
whole app’s getting redeployed just for that. How did we end up here? If you 
pulled out the “dropped cherry” metaphor back in 1998, it wouldn’t have 
fit. Back then, your cherry-dropping app would’ve been its own little piece 
of code, calling on the cake app when needed. You’d spin it up, drop your 
cherry, shut it down, and leave the cake app untouched. Simple days, huh?
When Monoliths Aren’t Monsters
But don’t abandon the monolith altogether. For short-run projects or ones 
with small scaling requirements, monolithic architecture can still be the 
right call. It’s quick to get started up and running, and you don’t have to 
worry about the overhead of managing many services or the orchestration 
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
of communication between them. If your app will have a simple 
few-function structure and you want to keep things basic, you can 
comfortably stick with a monolith.
Yet for larger, more complicated systems, where scaling, malleability, 
and continual motion might be more stricter, monoliths feel awkward—
like a suit that might fit, but can’t possibly be as comfortable as it should, 
and anyway, you’re going to rip the thing by the end of the night.
Client-Server Architecture
The client-server architecture is a foundational model in the world of 
computing, defining the interaction between two parties: a client and 
a server, as shown in Figure 1-2. This architecture underpins much 
of modern software development, enabling scalable, efficient, and 
maintainable systems. In this section, we will explore the principles of 
client-server architecture, its components, benefits, common patterns, and 
examples of its application in real-world scenarios.
Figure 1-2. A basic client-server architecture
Chapter 1 Evolution of Software Architecture
Principles of Client-Server Architecture
Client-server architecture operates on a simple yet powerful principle: 
the division of duties between service requesters (clients) and service 
providers (servers). This separation of concerns allows for more organized 
and scalable application development.
• Client: The client is the entity that initiates 
communication by sending requests to the server. It 
can be a web browser, a mobile app, or any software 
that requires data or services.
• Server: The server is the entity that receives and 
processes requests from clients, providing the 
necessary data or services in response. Servers can host 
databases, web pages, APIs, and more.
The communication between clients and servers typically happens 
over a network, following specific protocols such as HTTP, HTTPS, FTP, or 
WebSocket.
Components of Client-Server Architecture
Client-server architecture can be broken down into several key 
components:
• Client
• User Interface (UI): The frontend part of the client, 
where users interact with the application
• Client Logic: Processes user inputs, manages the 
user interface, and prepares data to be sent to 
the server
11
Chapter 1 Evolution of Software Architecture
• Server
• Server Logic: Processes client requests, executes 
business logic, and interacts with the database
• Database: Stores and manages data, accessible by 
the server
• Middleware: Software that connects 
different components or services, facilitating 
communication and data management
• Network
• The medium through which clients and servers 
communicate, typically the Internet or an 
internal network
Benefits of Client-Server Architecture
The client-server model offers numerous advantages that have contributed 
to its widespread adoption:
• Scalability: Servers can handle multiple clients 
simultaneously, and additional servers can be added to 
manage increased load.
• Maintainability: Separation of client and server logic 
simplifies updates and maintenance, as changes can be 
made independently.
• Security: Centralized servers allow for better control 
over data access and security measures.
• Flexibility: Clients can be thin (minimal logic) or thick 
(extensive logic), and servers can be scaled up or out 
based on demand.
12
Chapter 1 Evolution of Software Architecture
Common Patterns in Client-Server Architecture
Several architectural patterns have emerged within the client-server model 
to address specific needs and enhance performance:
• Two-Tier Architecture
• Consists of a client and a server. The client directly 
communicates with the server, which handles both 
application logic and database management.
• Three-Tier Architecture
• Adds a middle layer (middleware) between the 
client and server. The client interacts with the 
application server, which then communicates with 
the database server. This separation enhances 
scalability and maintainability.
• N-Tier Architecture
• Extends the three-tier model by adding more layers 
(e.g., presentation, application, business logic, data 
access). Each layer has a specific responsibility, 
further improving modularity and scalability.
• Microservices Architecture
• A variant of N-tier architecture, where the 
application is broken down into smaller, 
independent services. Each service is responsible 
for a specific functionality and communicates with 
others through APIs.
13
14
Real-World Examples
Client-server architecture is ubiquitous in modern computing. Here are 
some real-world examples:
• Web Applications: A typical web application involves a 
web browser (client) sending requests to a web server. 
The server processes these requests, interacts with a 
database if necessary, and returns the appropriate web 
pages or data.
• Email Systems: Email clients (e.g., Outlook, Gmail) act 
as clients, connecting to email servers via protocols like 
IMAP or SMTP to send and receive emails.
• Online Gaming: In online multiplayer games, the game 
client communicates with a game server that manages 
game state, player interactions, and other game logic.
• APIs and Web Services: Clients such as mobile apps 
or web applications communicate with servers hosting 
APIs to fetch data, authenticate users, or perform other 
operations.
Summary
Client-server architecture remains a cornerstone of modern software 
development, providing a robust framework for building scalable, 
maintainable, and efficient applications. By understanding its principles, 
components, and common patterns, developers can design and 
implement systems that meet the demands of today’s complex computing 
environments.
Chapter 1 Evolution of Software Architecture
15
Service-Oriented Architecture
Service-oriented architecture is the software equivalent to the Swiss Army 
knife; it provides you with lots of potential tools, all nicely organized in 
services that don’t get accidentally pressed and activated while you are 
unwrapping them and planning where to use them. SOA is an architectural 
style that makes it possible for services to play together within an 
organization, like members of the same orchestra. Each has their own 
special part to play, but when the players of an SOA orchestra get together, 
they produce a harmonious business process or need. Each service of 
an SOA orchestra, like a soloist, can be created, managed, and deployed 
separately. Figure 1-3 illustrates service-oriented architecture (SOA) where 
multiple clients (desktop, mobile, and laptop) interact with services over a 
centralized structure.
In SOA, services are organized in various components as follows:
• Service Locator: It is responsible for helping clients to 
find available services.
• Service Broker: In charge of communicating between 
services.
• Service Provider: Responsible for delivering actual 
functionality.
Service-oriented architecture focuses on building a reusable, modular, 
and communication-efficient system, which helps to integrate and 
maintain large-scale applications in a distributed environment.
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
Figure 1-3. An illustration of service-oriented architecture (SOA) 
showcasing how clients (web, mobile, and desktop) interact with 
services through key components like the Service Locator, Service 
Broker, and Service Provider
Key Principles of SOA
• Loose Coupling: SOA services are like good neighbors. 
They tap on your shoulder, wave, but don’t have five 
minutes to talk about your kids and the weather. Things 
can change. One service might get a facelift. It doesn’t 
have to drag everyone else with it. You don’t rebuild 
your kitchen so the bathroom falls in.
• Service Abstraction: You go to a restaurant. 
You order your food, but you don’t have to know 
what is happening in the kitchen. Same goes for 
16
Chapter 1 Evolution of Software Architecture
service-oriented architecture (SOA). The service’s 
implementation is hidden from the consumer. You 
interact with a well-defined interface—not the 
ingredients or amount of pots on the stove.
• Reusability: If implemented effectively, SOA services 
should be used again and again—you shouldn’t need 
to write a new box for each new feature. You can keep 
the power drill at your disposal for adding picture 
hooks wherever you want. Rather than building new 
functionality from scratch, you can copy an existing 
artifact and adapt it to your own needs.
• Composability: You can mix a few SOA services 
together to make something new. An example would be 
customizing a sandwich from different items at the deli. 
Each item is nice on its own, but mixed together they 
can make a complex experience that’s so much more 
than the sum of its parts.
• Interoperability: SOA is a world diplomat. It ensures 
services can talk to each other irrespective of the 
programming language they are written in or the 
hardware or software programming platform they’re 
running on, through standard communications 
protocols such as HTTPS, SOAP, and REST. There is 
an interpreter at an international conference who 
translates for people coming from every corner of 
the planet, and everyone can understand and be 
understood.
17
Chapter 1 Evolution of Software Architecture
• Discoverability: Have you ever just been running an 
app, absolutely convinced there is a feature that does 
something, and you just can’t find it? SOA avoids this 
problem. Services are documented and discoverable, 
that is, listed in a central registry, like a phone book of 
available services.
Core Components of SOA
• Service Provider: The provider is the chef in this 
culinary metaphor. They compose the service and cook 
it to eat; they write the menu (i.e., the service contract) 
and keep it on hand, so that when a customer orders a 
dish or component thereof, they make it available.
• Service Producer: On the other side of the slash 
mark, you have the service producer—the customer 
performing the service, whether they’re in an unskilled 
or highly technical role—generally, the person 
providing the service out of their own skills. They have 
to follow the service contract, which is what telling 
people what’s on the menu is all about, and they also 
have to accept the orders on how to make it. They don’t 
care how fast they make what they’re making, as long as 
it comes out the way the consumer ordered it.
• Service Registry: Your friendly neighborhood phone 
book, which can be thought of as Yelp for services 
provided by your SOA. Providers publish their services 
here, and consumers browse through it. They locate the 
services they need, along with detailed instructions on 
how to use them.
18
Chapter 1 Evolution of Software Architecture
• Service Bus (ESB): If they are the spices of the kitchen, 
the Enterprise Service Bus (ESB) is the conveyor belt in 
the kitchen; it’s the component that moves everything 
around; takes care of communication between services, 
message routing, and message transformation; and 
makes sure that all the different protocols are playing 
nicely together.
Benefits of SOA
• Adaptability and Agility: SOA is the kind of 
architecture that can roll with the punches. Businesses 
change track, needs evolve, and with SOA you are able 
to tweak and adjust on the fly—reuse and reconfigure 
what you’ve already got out there. You don’t have to 
rebuild the factory to make a new part; you just bolt a 
different part onto the end.
• Scalability: Since each service stands on its own, you 
can scale individual services based on demand. It’s 
like you can introduce more seats at your restaurant 
for extra service for a lunch rush without entirely 
expanding your building.
• Cost Efficiency: You’re reusing services with SOA, so 
development costs go down. This is the software version 
of hand-me-downs: if it’s perfectly good, why build new 
every time? You save time, money, and resources.
• The Big Benefit: Better Integration: SOA is the king 
of integration, regardless of whether there are many 
moving parts. It ensures that your systems can talk to 
one another easily, with ease of data and process flow.
19
Chapter 1 Evolution of Software Architecture
• Better Coordination: Because each service is 
independently developed, several teams can work on 
different parts of the system altogether, unencumbered 
by other teams. The living metaphor for this is multiple 
kitchens in one restaurant, each with its own head 
chef. Everyone doing their job without messing with 
anyone else.
Challenges of SOA
• Complexity: SOA can get complicated. Managing 
all those independent services requires careful 
orchestration and governance, or things might spin out 
of control.
• Performance Overhead: All that communication 
between services adds some lag. It’s like adding extra 
steps to a process—useful but not always fast.
• Security: Ensuring secure communication between 
services can be tricky, especially when dealing with 
sensitive data.
• Governance: Managing the life cycle of services, 
keeping everything compliant with standards, and 
maintaining quality require strict oversight.
Real-World Use Cases
• Financial Services: SOA allows banks to break up 
services such as customer management, transaction 
processing, and fraud detection and make each service 
20
Chapter 1 Evolution of Software Architecture
work as an individual task while allowing the bank to 
run without having everything stuffed into a single 
bulky system.
• Business: SOA binds together files documenting 
patient history, billing and charges, medical imaging, 
etc., as if it were a hospital with distinct departments 
working together to provide the patient with the right 
care at the right time and a safe employee environment 
in the long term.
• Retail: Electronic marketplaces come to life thanks 
to SOA. Keeping track of inventory, fulfilling orders, 
processing payments, providing customer service—
each of these tasks is done by a discrete SOA service 
that can stand alone but also works with all the rest to 
create a holistic shopping experience.
Best Practices for Implementing SOA
• Clear Service Boundaries: Your services shouldn’t 
have too much overlap—each one should be 
responsible for something and do its job. If all your 
vendors were electricians, they’d be fine; if all your 
programming pasta cookers, you’ll be okay. But no one 
wants their plumber to attempt electrical work.
• Agree on Standard Communication Protocols: Get 
everyone to speak the same language. Standardize how 
your services talk to each other. It’s much easier for the 
services to integrate with one another, and everyone is 
spared those embarrassing “Wait, what?” moments.
21
22
• Robust Security: Secure your services as if they were 
a vault. Encrypt, authenticate, and control access to 
sensitive data.
• Monitor Services and Availability: Keep an eye out 
for your services—check how they are performing, if 
they are available or if they are being used. Always keep 
an eye on your brands—have they gone offline or is 
something wrong with available data?
• Adopt SOA in Stages: Don’t try to do SOA all at once; 
start with the most important services and scale up 
over time. The analogy would be “get your feet wet” 
rather than “dive into the deep end.”
Summary
Building a system based on service orientation is a potentially powerful 
way of composing modern systems, thereby equipping organizations to 
become more modular, more agile, and thus more scalable. To be sure, 
it can seem complex, messy, and difficult at times, but done properly, 
service orientation provides flexibility and efficiency that can dramatically 
change the way a business operates. If you have existing systems that you 
would like to integrate, if you have a need to build new apps, or if you 
need to build a new layer that enables you to scale apps you already have, 
SOA fundamental concepts will plant the seeds for the next steps of your 
innovation and growth. And we will discuss these concepts later in this 
chapter. Strap yourself in; we are going for a ride!
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
Microservices Architecture
Microservices architecture is like breaking your big, clunky app into a 
series of smaller, bite-sized pieces—each piece doing its own job, yet all 
working together to make the whole thing run smoothly. Every service 
corresponds to a specific business function, and they communicate with 
each other through well-defined APIs as represented in Figure 1-4. It’s 
become a hit because of how scalable, flexible, and perfect it is for teams 
embracing DevOps and continuous delivery.
Figure 1-4 shows the architecture of microservices, where multiple 
independent services work together through an API Gateway. The client 
communicates with various services through the API Gateway, which 
acts as a mediator. Key components include the Identity Provider for 
authentication, CDN for delivering static content, and microservices 
that handle distinct functionalities, managed by the Config Server and 
Admin Server. Services use message queues (Kafka) for asynchronous 
communication, while tools like Sleuth + Zipkin provide tracing. The 
system also includes service discovery to locate services and management 
tools to monitor and control them. The backend interacts with a remote 
service and a database, with data being pulled from a repository to 
complete requests. This architecture supports scalability, flexibility, and 
efficient service management.
23
Chapter 1 Evolution of Software Architecture
Figure 1-4. A typical microservice-based application
Key Principles of Microservices
• Single Responsibility: Every service has one job and 
only one job. It keeps to its lane its mind around a 
single business function. No multitasking here.
• Loose Coupling: Microservices don’t share joint bank 
accounts. They hang solo, each one going about their 
business and leaving their neighbors alone. That way, if 
they decide to dye their hair blue, the people next door 
don’t have to dye theirs too.
• Independent Deployment: Want to update or patch 
one service? Go ahead. Play by play, one microservice 
at a time, means that changes can be made without a 
big drama and can roll out much more quickly. Picture 
a team fixing just one room in your house while you’re 
able to keep the rest of it open for business.
24
Chapter 1 Evolution of Software Architecture
• Decentralized Data Management (having a 
database for each microservice): If each microservice 
has its own database, it avoids a single point of 
failure, reducing the risk of bringing down the 
entire system if one database goes down.
• Automated Infrastructure: When a lot of microservices 
are running around, automated infrastructure is your 
best friend. From building through deployment to 
monitoring, automated infrastructure does the heavy 
lifting without your human oversight.
• Resilience: Microservices know how to roll with the 
punches. When one fails, built-in safeguards like circuit 
breakers and retries jump into action, keeping things 
moving forward. It’s like having a bad day but still 
powering through—these services are pros at bouncing 
back and carrying on.
Core Components of Microservices
• Service Discovery: Microservices feature a component 
that dynamically finds either via components such as 
Eureka or by other means. It’s like the GPS of your car.
• API Gateway: The bouncer at the door, checking 
their credentials, handling all the client requests, and 
making sure they get to the right microservice. It also 
takes care of things like authentication, rate limiting, 
and logging—all the behind-the-scenes work. By using 
tools like Kong, Tyk, Apigee, etc., organizations can 
easily manage complex traffic flows and secure their 
microservices with minimal overhead.
25
Chapter 1 Evolution of Software Architecture
• Service Mesh: Think of it as the traffic cop managing 
the flow of data between services. It handles 
communication, load balancing, and even security for 
service-to-service interactions.
• CI/CD: Continuous integration and continuous 
deployment are the secret sauce for getting changes 
live quickly and efficiently. They automate the testing 
and deployment processes, so you can push updates 
without fear of everything falling apart.
• Containerization: Microservices are often deployed in 
containers (hello, Docker!) to keep them lightweight, 
portable, and consistent across different environments. 
Orchestrators like Kubernetes step in to make sure 
everything is balanced and scalable. Even if these terms 
are new to you, don’t worry; we will explain these in 
detail later in the book.
Benefits of Microservices
• Scalable: You can scale individual services in response 
to demand instead of scaling the whole app. You turn 
up the heat on one burner, instead of cranking up the 
whole stove.
• Adaptable and Agility: Each team can innovate 
and deploy their service independently, with faster 
innovation times and quicker time to market. Less 
waiting and more doing.
26
Chapter 1 Evolution of Software Architecture
• Resilience and Fault Isolation: When one service fails, 
the whole app doesn’t have to go down in flames. Each 
microservice failure is contained, so the rest can keep 
running smoothly.
• Technology Diversity: Different services can be built 
using different languages or frameworks, which means 
teams can choose the best tool for each job. One 
microservice might love Python, while another prefers 
Java—and that’s perfectly fine. This flexibility also 
extends to different versions within each technology 
stack, enabling teams to upgrade or maintain specific 
versions as needed without impacting the entire 
system. For example, one service might be running the 
latest version of Node.js, while another sticks with an 
older, stable release of Java. This approach allows teams 
to optimize each service independently, balancing 
innovation and stability across the system.
• Improved Collaboration: Small teams can own their 
own microservices and be more productive. Break 
down your orchestra into specific sections. You get 
exactly what they’re good at and everybody blows 
together.
Challenges of Microservices
• Complexity: The more microservices you have, 
the more moving parts there are. Orchestration, 
monitoring, and management get tricky, and good 
tools and practices are called for to keep things 
ticking over.
27
Chapter 1 Evolution of Software Architecture
• Data Consistency: Keeping data consistent across 
multiple services is like herding cats, either adopt 
an event-driven architecture or settle for eventual 
consistency.
• Network Latency: More services talking to each other 
means more chances for delays. Optimizing with 
caching or load balancing helps, but network hiccups 
are always lurking.
• Security: Securing communication between 
microservices and managing authentication can get 
complicated, especially when you have a lot of services 
running around doing their thing.
• Operational Overhead: You’re going to need strong 
CI/CD pipelines, monitoring, and infrastructure 
management, which can increase the operational 
workload.
Microservices vs. Monolithic Architecture
In the monolithic one, everything is put into one big, fat application. It is 
initially easy to build, but hard to maintain, scale, and update as it gets 
large. In the microservices architecture, however, the app is divided into 
smaller independent services, and that makes it easier to maintain, scale, 
and even deploy each service separately. The difference is like the one 
between building one giant jack-of-all-trades machine and one with a 
collection of gadgets that are more specialized.
28
29
Microservices vs. SOA
While on the surface there are some similarities, such as the focusability 
and loose coupling, microservices and SOA are not the same. SOA is all 
about big, enterprise-wide service concepts that cut across a whole range 
of business functions. In contrast, microservices are much smaller in 
scope, often focusing on individual functionalities, and emphasize DevOps 
practices with continuous deployment.
Summary
The move to microservices is a profound shift in application design 
and development, but by breaking applications down into small, 
independently deployable services, it offers flexibility, scalability, 
resilience, and data isolation that monolithic systems could never compete 
with. Of course, microservices come with their own set of challenges, 
which can be managed with the right tools and best practices to keep 
your applications lean, mean, and fit for purpose. But while microservices 
let us break up large applications into more manageable pieces, they 
are not the only architectural style that allow us to create systems that 
are more dynamic and responsive. In the next section, we will introduce 
a complementary approach that embraces events as a way to make 
systems more reactive and scalable. Let’s enter the realm of Event-Driven 
Architecture (EDA). You are going to find out how event-based systems can 
decouple systems, improve resilience and scalability, and accommodate 
real-time data flow. Get ready to see how events can turn your applications 
into dynamic, high-performance machines!
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
Event-Driven Architecture (EDA)
Event-Driven Architecture (EDA) is the cool kid on the block when 
it comes to software: it’s all about reacting to things while they’re 
happening. Event-driven design, as an architectural style, is based on the 
fundamentals of event generation, detection, and consumption. An event 
might be a data change, a user action, a system state update, or anything 
else that a service or a component wants to communicate about without 
interfering with another service or component. The event mechanism 
connects decoupled services or components, glues together distributed 
services, and increases the throughput and responsiveness of the system 
by sending small payloads and avoiding shared state while also enabling 
vertical and horizontal scalability as represented in Figure 1-5.
This diagram depicts Event-Driven Architecture, in which an Event 
Producer generates events and sends them to an Event Broker. The broker 
receives the events and sorts them in different topics (Topic 1, Topic 2, 
Topic 3), making it easier to route the event to the correct Event Consumer. 
Each event will be published in the corresponding topic, and only the 
Event Consumer subscribed to that topic will receive and process the event 
asynchronously. Event-Driven Architecture promotes loose coupling, 
allowing systems to respond in real time to change in a system without 
being directly coupled to each other, making it suitable for creating 
scalable and flexible applications.
30
Chapter 1 Evolution of Software Architecture
Figure 1-5. Typical representation of how event-driven 
architecture works
Key Concepts of Event-Driven Architecture
• Events: An event is, more or less, a headline: 
“Something happened!” It might be a user pressing 
a button, an inventory update, or a system error. An 
event is immutable—it tells you about a change that 
occurred, and that’s it.
• Event Brokers: Gossips who publish events—an app, a 
service, a device, whatever. These are the ones that tell 
everyone that something has changed.
• Event Producers: On the other side stand the 
producers which are the events itself. Pro of the 
occurrence of an event and what denotes the 
occurrence of that certain event.
• Event Consumers: Listeners of that event subscribe 
and react to these events, such as running a processing 
or workflow.
31
32
Events don’t just float around aimlessly—they travel through event 
channels, like message queues or platforms such as Kafka or RabbitMQ, 
to reach their destination. But the magic happens when we act on these 
events, not just process them. Once an event arrives, it’s time to parse, 
filter, and separate the signal from the noise. Sometimes, we enrich or 
transform the data before taking action, ensuring the event is not only 
processed but also leveraged to drive meaningful outcomes.
Types of Event-Driven Architectures
• Simple Event Processing: One typical use case is of 
the form “when X happens then do Y”—for example, 
when a sale is made, send a notification. Simple 
event processing is exactly what it sounds like: it is 
about processing a single event to produce a single, 
immediate result.
Figure 1-6. Typical representation of how simple event 
processing is done
• Complex Event Processing (CEP): Where the magic 
happens. Here’s where you have multiple events come 
in, infer things along the way, and infer some kind 
of conclusion. This would be like a fraud detective—
taking all these different elements, deduce different 
things, watching a system for real-time analytics.
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
Figure 1-7. Typical representation of how a complex event 
processing is done
Benefits of Event-Driven Architecture
• Decoupling: EDA is the architectural equivalent of a 
party animal—it allows components to “do their own 
thing” without tight binding between them. Everyone 
can party on, with less dependency drama.
• Scalability: Since event producers and consumers are 
decoupled, each can scale up or down independently, 
as needed by demand. No need to scale up all, for 
example, because one part needs more attention 
than usual.
33
Chapter 1 Evolution of Software Architecture
• Responsiveness: Systems respond in real time in 
an event-driven world, which leads to better overall 
experience in the way a system is used. It’s like having 
a system that stays on the lookout, ready to jump into 
action the moment something happens.
• Flexibility: EDA makes it easy to add new event 
producers or consumers without changing the system’s 
other elements. This is the kind of architecture that 
punches back.
• Fault Tolerance: One component fails, but it doesn’t 
pull everything else down with it. EDA isolates failure, 
allowing the rest of the system to continue operating as 
if nothing had happened.
Challenges of Event-Driven Architecture
• Complexity: Building and managing an event-driven 
system isn’t always a walk in the park. Handling events 
reliably, ensuring they’re processed in the right order, and 
managing idempotency can feel like juggling chainsaws.
• Data Consistency: Events are flying between 
components which makes keeping data consistent 
across a distributed system challenging. You might 
have to settle for eventual consistency and use 
compensating transactions.
• Monitoring and Troubleshooting: When your system 
is spewing events every which way, finding out where 
something went wrong can be like finding a needle in a 
haystack. Strong logging and monitoring tools will need 
to be in place to keep things in check.
34
Chapter 1 Evolution of Software Architecture
• Latency: Events don’t always arrive instantly. There 
could be some time gap depending on the mechanism 
of event delivery, so performance needs to be 
optimized.
• In an event-driven architecture, flow is hard to organize 
since you have to choose between “choreography” 
where services respond to events without any central 
coordination and “orchestration” where a central 
coordinator directs the flow of events and controls 
the order of events (all options have pros and cons, 
depending on your system complexity and desired 
degree of control).
Real-World Use Cases
• Ecommerce: Retail platforms love EDA for handling 
real-time inventory updates, order processing, and 
user actions. It ensures customers always get up-to￾date info and that the system scales during those Black 
Friday rushes.
• IoT: The Internet of Things thrives on event-driven 
architecture. Whether it’s reacting to sensor data, 
device alerts, or user interactions, EDA ensures IoT 
systems respond in real time.
• Financial Services: Banks use EDA for high-speed 
fraud detection, transaction processing, and analyzing 
market trends. Real-time event handling means no 
delays in catching suspicious activity.
35
Chapter 1 Evolution of Software Architecture
• Gaming: Online gaming platforms rely on EDA to 
manage player actions, update game states, and send 
notifications in real time. No one likes lag in their game, 
and EDA helps keep things moving smoothly.
Implementing Event-Driven Architecture
• Use a Good Event Broker: A good event broker, like 
Apache Kafka, Apache Pulsar, RabbitMQ, or AWS SNS/
SQS, for distribution is the foundation of your system. 
• Define Event Schemas: Ensure everyone has the same 
understanding of what constitutes an event and what 
shape or format it should take.
• Build Producers and Consumers: Extract the pieces 
that produce and process the events, keeping them 
loosely coupled and independent.
• Make Idempotent: Make sure the event handlers are 
idempotent so that the event handler can repeat the 
event (if it is retriggered) without any problem.
• Monitor and Log Events: You will also want to monitor 
and log the events, to ensure that everything is running 
smoothly. You can use tools such as ELK (E - Elasticsearch, 
L - Logstash, and K - Kibana) stack or Prometheus and 
Grafana to make sense of the flood of information. If you’re 
hearing Prometheus and Grafana for the first time, don’t 
be afraid. We got you covered. Stay tuned.
• Robust Error Handling with Retries: In the event of 
a glitch, your system needs to be capable of gracefully 
righting itself so it doesn’t come to a dead stop.
36
37
Best Practices for Event-Driven Architecture
Start small—don’t try to boil the ocean. Begin with a few key events, then 
scale up as you grow more confident in your system. As your event model 
evolves, keep things consistent across versions by using versioning and 
schema validation.
Optimize event processing by batching, filtering, and aggregating 
events whenever possible.
Maintain loose coupling between producers and consumers by 
introducing intermediaries like event brokers, which keeps your system 
flexible and adaptable.
Lastly, always plan for scalability by designing the system to scale 
horizontally, allowing you to add more producers and consumers as 
demand increases.
Summary
In many respects, EDA is a true disruptor: a way to come up with 
responsive, scalable, and elastic systems that change at the speed of 
their users. By decoupling each component, EDA economizes the work 
required to develop new features, increase scalability, or implement 
new functionality into a system. It also relies on events as the main 
communication mechanism between these components, a choice that 
enables systems to react in real time and adapt to a changing landscape. 
Nothing comes without a cost, of course. According to systems developers, 
the major drawbacks might include a steep learning curve, a more 
complex architecture, and the introduction of an additional consistency 
layer that might otherwise be unnecessary. Nonetheless, when executed 
properly, EDA can dramatically improve how modern, distributed 
applications operate.
Chapter 1 Evolution of Software Architecture
38
However, we’re also going to look at serverless architecture, another 
way to create modern applications with a whole new set of benefits. What 
if you never have to manage servers again? Seems too good to be true? 
You will want to stick around to learn how serverless elevates cloud-based 
computing to an entirely new level of simplicity and scalability.
Serverless Architecture
A magic trick for developers: all of a sudden, you can build and deploy 
whole apps without having to think about servers. The way serverless 
works is that, on the cloud, the provisioning, patching, and scaling of 
servers are handled by the cloud provider, off-stage. You are able to focus 
purely on writing your code. In a way, it’s like driving a car: you don’t have 
to know about the engine. This is cost-effective, scales great, and it enables 
a blazing speed of development—the most important aspect of anything 
from simple APIs to heavy data processing.
Figure 1-8 showcases a serverless architecture utilizing various 
services. Clients (such as desktop, mobile, and laptop users) interact 
with the system. CloudFront and S3 serve static content, ensuring 
quick delivery of assets like images or HTML. For dynamic processing, 
requests are routed through the API Gateway, which directs them to AWS 
Lambda functions, where the core application logic is executed without 
managing any underlying servers. Data is stored in DynamoDB, an AWS￾managed NoSQL database. This architecture allows for scalable, cost￾efficient applications that run on demand, eliminating the need for server 
maintenance or provisioning.
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
Figure 1-8. A serverless architecture design
Key Concepts of Serverless Architecture
• Functions as a Service (FaaS): This is the core of 
serverless. Think of bite-size chunks of logic that run 
only in response to an event, and each of which does 
one thing (if that). They scale independently and 
vanish when they’re not needed.
• Backend as a Service (or BaaS): The backend is what 
makes your app go, and it is easy to build—but it is also 
the most repetitive part of development, since every 
app requires this. The concept of BaaS was an eye￾opener for me. It’s like “I don’t want to cook, I just want 
to order Chinese”: let the database, authentication, and 
storage of your app be handled by a third party.
39
Chapter 1 Evolution of Software Architecture
• Event-Driven Everything: Serverless is event-driven, 
meaning that everything happens because of events—
an HTTP request, a file upload, a job scheduled by a 
cron-like service, and so on. The system does nothing 
unless you snap your fingers.
• Auto-scaling: A serverless architecture will scale up 
or down depending on the amount of demand. Need 
more resources? You don’t even have to think about it; 
it’ll manage it for you. A quiet period? It’ll scale down. 
No lifting of fingers required.
• Pay-As-You-Go: The best thing about serverless is 
that you only pay for the time your code runs. No idle 
servers or resources, so super cost-effective.
Benefits of Serverless Architecture
• Cost-Effectiveness: No more paying for unused server 
time. With serverless, you pay only for the actual 
compute time your functions demand—nothing more, 
nothing less.
• Scalability: A serverless app scales with ease. If you’re 
dealing with 10 users or 10,000, the system will scale up 
automatically, and you don’t have to babysit anything.
• Reduced Operational Overhead: Developers can 
finally just focus on building stuff. No more patching 
servers or worrying about capacity planning. Just code, 
deploy, and you’re done.
40
Chapter 1 Evolution of Software Architecture
• Faster Time to Market: Less infrastructure to manage 
means quicker development cycles. You can deploy 
updates or new features rapidly, which is great when 
you’re racing to beat deadlines.
• Resilience: Since your cloud provider handles most of 
the backend heavy lifting, serverless systems come with 
built-in resilience. They’ve got the redundancy and 
fault tolerance covered.
Challenges of Serverless Architecture
• Cold Start Latency: The first time you call a function, 
there’s a delay while a new instance is spun up by the 
cloud provider. Before you can pour your tea, you must 
wait for the kettle to boil.
• Limited Execution Time: There’s usually a limit to how 
long a serverless function can run, so they aren’t great 
for tasks that take a long time. You wouldn’t want them 
running a marathon—they’re sprinters.
• Debugging Complexity: When you don’t have access 
to the underlying infrastructure, debugging feels like 
you have a murder on your hands, and they’ve stolen 
half the evidence.
• Vendor Lock-In: If you start using serverless services 
with a particular cloud provider, it’s difficult to switch 
to someone else. It’s like picking a favorite coffee shop. 
You find your groove, and waiting online feels like 
a hassle.
41
42
• Security Concerns: While the cloud provider handles 
infrastructure security, developers still need to make 
sure their application is secure, from permissions to 
proper coding practices.
Serverless vs. Traditional Architectures
In more traditional architectures, you’re responsible for the server, the 
storage, and the network—you’re basically steering a massive ship. You 
need to provision resources, plan capacity ahead of time, and handle 
everything that goes on behind the scenes. In serverless, all of that is 
abstracted away from the logic side of things, infrastructure, but if you’re 
trying to avoid and enjoy the benefits of workloads that can scale up and 
down dynamically, serverless is the way to go.
Real-World Use Cases
• Web Apps: Serverless is great for building web 
applications that scale. You can use AWS Lambda, 
Azure Functions, and Google Cloud Functions to 
handle all the backend logic, while you take care of the 
user experience.
• Data Processing: Serverless functions are useful for 
processing real-time data streams or performing ETL 
(Extract, Transform, Load) operations. Just point them 
at the data and let them do the job.
• Microservices: Serverless fits beautifully into a 
microservices architecture. Each function can be 
responsible for one task, making it easier to build, scale, 
and maintain.
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
• IoT Applications: With countless devices generating 
data, serverless architecture can handle the real-time 
processing and reactions that IoT solutions need.
• Chatbots and Voice Assistants: Whether it’s a chatbot 
answering queries or a voice assistant giving you the 
weather, serverless functions can handle the logic and 
responses with ease.
Implementing Serverless Architecture
• Choose a Cloud Provider: Pick your provider—AWS 
Lambda, Azure Functions, or Google Cloud Functions 
are the top choices.
• Define Functions: Break your application logic into 
small, independent functions. Each one should handle 
a specific task and be deployable on its own.
• Set Up Event Sources: Define the triggers that will 
call your functions—whether it’s an HTTP request, a 
database change, or a scheduled event.
• Manage State: Since serverless functions are stateless, 
use managed services like DynamoDB, Cosmos DB, or 
Firestore to store persistent data.
• Implement Security: Ensure that your functions 
are locked down with proper identity and access 
management (IAM) configurations and secure 
communication channels.
• Monitor and Optimize: Keep an eye on your functions 
using cloud monitoring tools. Track performance, 
identify bottlenecks, and tweak for faster execution.
43
44
Best Practices for Serverless Architecture
Minimize cold starts by optimizing your function code or using techniques 
to keep functions “warm” with scheduled invocations. Keep your functions 
small and efficient, with minimal dependencies, as faster functions 
are also more cost-effective. Leverage managed services for tasks like 
databases and authentication to reduce your operational load—no need 
to reinvent the wheel. Always have visibility into your system with proper 
logging and monitoring to catch performance issues or errors early. And 
remember, design for failure—implement retries, fallbacks, and error 
handling to keep your system resilient when things inevitably go wrong.
Summary
Serverless architecture is a revolution in how we build and run modern 
applications. Freed from having to deploy and manage servers, and able to 
program applications as a series of events and steps handled by functions, 
developers can deliver applications that are scalable, cost-effective, 
and resilient—in a matter of weeks, rather than months. Serverless is 
hard, but it’s worth it. It’s a no-brainer for many use cases and can help 
organizations achieve scalability, cost efficiency, and faster time to market 
using best practices and the right tools.
Microservices Comparison with Monolithic 
and SOA Architectures
So, let’s start at the beginning and work our way through three 
fundamental architectural styles: monolithic, service-oriented architecture 
(SOA), and microservices, because no two applications are alike, and, like 
tools, some approaches fit a workstyle better than others.
Chapter 1 Evolution of Software Architecture
45
Table 1-1. Differences between Monolithic, SOA, and Microservices 
Architectures
Monolithic 
Architecture
SOA (Service￾Oriented 
Architecture)
Microservices 
Architecture
Architecture 
Overview
When you go 
monolithic, you’re 
building one big, 
happy family—
everything lives 
together in a 
single codebase.
Single Codebase:
Everything’s in one 
place, which is 
neat… until it gets 
messy.
Tight Coupling:
Components are 
interconnected 
like a set of 
conjoined twins—
you can’t mess 
with one without 
affecting the 
others.
SOA simply takes 
this monolith, breaks 
it up, and packages 
it as free-standing 
services, except with 
a little more corporate 
polish than the term 
“architecture” might 
suggest.
Service Composition:
Applications are 
composed of loosely 
coupled services, 
each of which 
provides a distinct 
functional capability.
Middleware 
Dependency: The ESB 
handles the messaging 
between services. 
Sounds great—
until it becomes 
a performance 
bottleneck.
Microservices is 
the cool, modern 
architecture that 
splits your application 
into a collection of 
small, independently 
deployable services.
Independent Services:
Your app is made up 
of tiny, independent 
services, each with its 
own job. No more “one 
size fits all.”
Decentralized 
Communication:
Communication 
happens through 
lightweight protocols 
like REST or gRPC, 
and services often 
talk to each other via 
messaging queues. 
No heavyweight ESB 
slowing you down.
(continued)
Chapter 1 Evolution of Software Architecture
46
Monolithic 
Architecture
SOA (Service￾Oriented 
Architecture)
Microservices 
Architecture
Single 
Deployment:
Want to fix a 
tiny bug? Guess 
what—you’re 
redeploying the 
whole app. Hope 
you’re not in a 
rush.
Standardized 
Protocols: SOA loves 
SOAP and XML. Sure, 
it’s structured and 
powerful. But it gets a 
little… old school.
Service Autonomy:
Each service manages 
its own data and logic. 
This is like giving 
each team member 
their own toolbox, and 
they don’t have to 
share (which is always 
better, right?).
Scalability Eh, not great. 
Scaling means 
adding more 
horsepower to 
a single server, 
and that gets 
expensive fast. 
This approach 
is like trying to 
fit more people 
into a crowded 
elevator—
eventually, you run 
out of room.
Better than 
monolithic, but 
the ESB can get 
overwhelmed if too 
many services are 
pinging it at once. It’s 
like having a really 
efficient assistant—
until you bury them in 
too much paperwork.
This is where 
microservices shine. 
Each service can 
scale independently, 
which means you 
only throw resources 
at what needs it. It’s 
like adding more 
tables to a crowded 
restaurant—no need 
to expand the whole 
building.
Table 1-1. (continued)
(continued)
Chapter 1 Evolution of Software Architecture
47
Monolithic 
Architecture
SOA (Service￾Oriented 
Architecture)
Microservices 
Architecture
Development 
and 
Deployment
Any small 
change requires 
redeploying the 
entire application, 
which can slow 
down development. 
Picture yourself 
trying to redecorate 
your living room 
but having to 
rebuild the whole 
house each time.
Services can be 
reused, which helps 
speed things up a bit, 
but deployment can 
get complicated with 
all that middleware to 
manage.
Supports continuous 
deployment, and 
because each 
service is small and 
independent, you can 
move fast. Think of 
it like running a race 
with a team—you 
don’t all have to cross 
the finish line at once.
Data 
Management
The whole app 
usually leans on a 
single database, 
which can become 
a bottleneck. It’s 
like having one 
giant pot of soup 
for everyone—it 
works, but it’s not 
ideal if someone 
needs a custom 
dish.
Services tend to 
share a data model, 
so you get more 
flexibility than 
monolithic but still 
run into limitations.
Each service has 
its own database, 
allowing for “polyglot 
persistence.” One 
service might use SQL, 
another NoSQL—
whatever works best 
for that specific job. 
Now everyone gets 
their own bowl of 
soup, custom-made.
Table 1-1. (continued)
(continued)
Chapter 1 Evolution of Software Architecture
48
Table 1-1. (continued)
(continued)
Monolithic 
Architecture
SOA (Service￾Oriented 
Architecture)
Microservices 
Architecture
Fault Isolation If one piece fails, 
the whole ship 
sinks. It’s a house 
of cards—one 
wrong step, and 
the whole thing 
goes down.
Better fault isolation, 
but because services 
rely on the ESB, a 
single snag can still 
take down the whole 
thing.
If one service fails, the 
others can keep on 
trucking. It’s resilient 
by design, and it 
employs patterns 
like circuit breakers 
to gracefully handle 
issues.
Communication 
and Integration
All communication 
happens 
internally within 
the application. 
It’s like a family 
dinner where 
everyone’s at 
the same table. 
Simple, but there’s 
not much privacy.
Services talk to each 
other through the 
ESB, using protocols 
like SOAP. It’s 
powerful, but a bit 
slow and clunky.
Communication 
is lightweight and 
decentralized. REST, 
gRPC, and messaging 
queues get the job 
done efficiently. Bonus 
points for often being 
event-driven, making 
everything even more 
flexible.
Chapter 1 Evolution of Software Architecture
49
Table 1-1. (continued)
(continued)
Monolithic 
Architecture
SOA (Service￾Oriented 
Architecture)
Microservices 
Architecture
Technology 
Stack
You’re stuck with 
one tech stack 
for the entire 
app. Want to try 
something new? 
Be prepared for a 
major refactor.
Mixed technologies 
are allowed, but the 
ESB can limit your 
choices. Think of it 
as working within 
a corporate dress 
code—there’s 
flexibility, but only to 
a point.
Total freedom! Each 
service can use a 
different language, 
framework, or 
database. You can 
work in whatever you 
want to work in—
jeans and hoodie or 
suit and tie—it doesn’t 
matter.
Governance 
and 
Management
Centralized 
Governance:
Governance is 
straightforward 
but can become a 
bottleneck as the 
application grows.
Unified 
Management:
Easier to manage 
as a single entity 
but less flexible.
Centralized 
Governance with 
Flexibility: Requires 
governance for 
service contracts and 
ESB but allows some 
service autonomy.
Service 
Management: More 
complex due to the 
involvement of ESB 
and multiple services.
Decentralized 
Governance:
Encourages 
decentralized decision￾making, leading to 
innovation and agility.
Service Autonomy:
Each service 
is managed 
independently, 
requiring sophisticated 
tools for orchestration 
and monitoring.
Chapter 1 Evolution of Software Architecture
50
Monolithic 
Architecture
SOA (Service￾Oriented 
Architecture)
Microservices 
Architecture
Security Unified Security:
Easier to 
implement and 
manage security 
policies centrally.
Single Attack 
Surface: A breach 
can potentially 
compromise the 
entire application.
Service-Level 
Security: Security 
is handled at the 
service level but can 
be complex due to 
multiple services.
Middleware 
Security: ESB 
provides centralized 
security controls.
Service-Level 
Security: Each service 
must implement 
its own security, 
increasing complexity.
Zero-Trust Model:
Often adopts a zero￾trust security model, 
ensuring secure 
service-to-service 
communication.
Table 1-1. (continued)
Conclusion
Microservices architecture offers significant advantages over monolithic 
and SOA architectures, particularly in terms of scalability, flexibility, and 
resilience. While monolithic architecture is simpler and easier to manage 
for small applications, it struggles with scalability and maintainability as 
the application grows.
SOA improves on monolithic by promoting service reusability and 
loose coupling but often involves complex middleware and centralized 
governance. Microservices take these concepts further, emphasizing small, 
independently deployable services, decentralized data management, and 
polyglot programming. This approach provides greater agility, scalability, 
and fault isolation but requires sophisticated tools and practices to 
Chapter 1 Evolution of Software Architecture
Chapter 1 Evolution of Software Architecture
manage the increased complexity. Understanding these differences helps 
organizations choose the right architecture based on their specific needs 
and context.
Having grasped the basics of why microservices are different from 
other architectures, it’s time to get beneath the surface and look at what 
really makes them tick. We’ll start with the core concepts in the next 
chapter. You’ll learn about the Single Responsibility Principle (because, 
hey, nobody likes code that tries to do too much), then move into why 
independence and autonomy are nonnegotiable in this world, and why 
decentralized data management is central to the architecture. We’ll cover 
the basics of APIs and communication, the principles behind scalability 
and fault isolation, and the importance of continuous delivery and 
DevOps. You’ll see what polyglot programming means and how it’s done, 
as well as learning about service discovery and load balancing. We’ll 
round off the journey with a look at some key topics, such as logging and 
monitoring and security.
It’s time to roll up your sleeves and see how all these parts fit together 
to create a powerful, flexible architecture that is revolutionizing how we 
build applications. In the next chapter, we will explore the core concepts of 
microservices.
51