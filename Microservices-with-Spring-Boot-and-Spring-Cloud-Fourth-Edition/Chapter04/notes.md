*Building a Docker image

Para crear la imagen de Docker, primero debemos crear nuestro artefacto de implementación (es decir, el archivo JAR pesado) para el producto­servicio:
 cd $BOOK_HOME/Chapter04
./gradlew :microservices:product-service:build

-----------------
Podemos encontrar el archivo JAR fat en la biblioteca de compilación de Gradle, build/libs. 
ls -l microservices/ product-service/build/libs
--------------
crearemos la imagen de Docker y la llamaremos producto­servicio, de la siguiente manera:
  cd microservices/product-service
docker build -t product-service .
------------
Verifique que obtuvimos una imagen de Docker, como se esperaba, usando el siguiente comando:
   docker images | grep product-service

   -----------
   Inicie el microservicio del producto como un contenedor usando el siguiente comando:
    docker run --rm -p8080:8080 -e "SPRING_PROFILES_ACTIVE=docker" product-service
    ---------
     Pruebe el siguiente comando en otra ventana de terminal:
    curl localhost:8080/product/3
    pachefer@Pro-de-Fernando Chapter04 % curl localhost:8080/product/3 -pq 
{"productId":3,"name":"name-3","weight":123,"serviceAddress":"ffa1fa35c39b/172.17.0.2:8080"}%  
--------------------------
 Solicita a Docker todos los contenedores en ejecución:
    ------docker ps
    CONTAINER ID   IMAGE             COMMAND                  CREATED          STATUS          PORTS                    NAMES
ffa1fa35c39b   product-service   "java org.springfram…"   13 minutes ago   Up 13 minutes   0.0.0.0:8080->8080/tcp   gifted_shannon
--------------
Ejecutar el contenedor en modo separado
 docker run -d -p8080:8080 -e "SPRING_PROFILES_ACTIVE=docker" --name my-prd-srv product-service
 ---------
Conozca el comando docker logs 
  docker logs my-prd-srv -f
    .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.5.0)

2025-09-15T07:40:39.912Z  INFO 1 --- [           main] s.m.m.c.p.ProductServiceApplication      : Starting ProductServiceApplication v1.0.0-SNAPSHOT using Java 24 with PID 1 (/application/BOOT-INF/classes started by root in /application)
2025-09-15T07:40:39.916Z DEBUG 1 --- [           main] s.m.m.c.p.ProductServiceApplication      : Running with Spring Boot v3.5.0, Spring v6.2.7
2025-09-15T07:40:39.917Z  INFO 1 --- [           main] s.m.m.c.p.ProductServiceApplication      : The following 1 profile is active: "docker"
2025-09-15T07:40:41.872Z  INFO 1 --- [           main] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 1 endpoint beneath base path '/actuator'
WARNING: A restricted method in java.lang.System has been called
WARNING: java.lang.System::loadLibrary has been called by io.netty.util.internal.NativeLibraryUtil in an unnamed module (file:/application/BOOT-INF/lib/netty-common-4.1.121.Final.jar)
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers in this module
WARNING: Restricted methods will be blocked in a future release unless native access is enabled

2025-09-15T07:40:42.412Z  INFO 1 --- [           main] o.s.b.web.embedded.netty.NettyWebServer  : Netty started on port 8080 (http)
2025-09-15T07:40:42.435Z  INFO 1 --- [           main] s.m.m.c.p.ProductServiceApplication      : Started ProductServiceApplication in 3.217 seconds (process running for 3.701)


---------
Termine esto deteniendo y retirando el contenedor:
 docker rm -f my-prd-srv
 ----------------------
 *Administrar un paisaje de microservicios mediante Docker Compose

pachefer@Pro-de-Fernando Chapter04 % ./gradlew build
Java HotSpot(TM) 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A restricted method in java.lang.System has been called
WARNING: java.lang.System::loadLibrary has been called by io.netty.util.internal.NativeLibraryUtil in an unnamed module (file:/Users/pachefer/.gradle/caches/modules-2/files-2.1/io.netty/netty-common/4.1.121.Final/7a5252fc3543286abbd1642eac74e4df87f7235f/netty-common-4.1.121.Final.jar)
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers in this module
WARNING: Restricted methods will be blocked in a future release unless native access is enabled

2025-09-15T01:56:29.135-06:00  INFO 40770 --- [ionShutdownHook] o.s.b.w.embedded.netty.GracefulShutdown  : Commencing graceful shutdown. Waiting for active requests to complete
2025-09-15T01:56:29.137-06:00  INFO 40770 --- [ netty-shutdown] o.s.b.w.embedded.netty.GracefulShutdown  : Graceful shutdown complete
Java HotSpot(TM) 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A restricted method in java.lang.System has been called
WARNING: java.lang.System::loadLibrary has been called by io.netty.util.internal.NativeLibraryUtil in an unnamed module (file:/Users/pachefer/.gradle/caches/modules-2/files-2.1/io.netty/netty-common/4.1.121.Final/7a5252fc3543286abbd1642eac74e4df87f7235f/netty-common-4.1.121.Final.jar)
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers in this module
WARNING: Restricted methods will be blocked in a future release unless native access is enabled

2025-09-15T01:56:37.338-06:00  INFO 40812 --- [ionShutdownHook] o.s.b.w.embedded.netty.GracefulShutdown  : Commencing graceful shutdown. Waiting for active requests to complete
2025-09-15T01:56:37.340-06:00  INFO 40812 --- [ netty-shutdown] o.s.b.w.embedded.netty.GracefulShutdown  : Graceful shutdown complete
Java HotSpot(TM) 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A restricted method in java.lang.System has been called
WARNING: java.lang.System::loadLibrary has been called by io.netty.util.internal.NativeLibraryUtil in an unnamed module (file:/Users/pachefer/.gradle/caches/modules-2/files-2.1/io.netty/netty-common/4.1.121.Final/7a5252fc3543286abbd1642eac74e4df87f7235f/netty-common-4.1.121.Final.jar)
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers in this module
WARNING: Restricted methods will be blocked in a future release unless native access is enabled

2025-09-15T01:56:45.149-06:00  INFO 40848 --- [ionShutdownHook] o.s.b.w.embedded.netty.GracefulShutdown  : Commencing graceful shutdown. Waiting for active requests to complete
2025-09-15T01:56:45.151-06:00  INFO 40848 --- [ netty-shutdown] o.s.b.w.embedded.netty.GracefulShutdown  : Graceful shutdown complete

BUILD SUCCESSFUL in 28s
28 actionable tasks: 18 executed, 10 up-to-date
pachefer@Pro-de-Fernando Chapter04 % docker compose build
[+] Building 5.8s (45/45) FINISHED                                                                                                                          docker:desktop-linux
 => [review internal] load .dockerignore                                                                                                                                    0.0s
 => => transferring context: 2B                                                                                                                                             0.0s
 => [review internal] load build definition from Dockerfile                                                                                                                 0.1s
 => => transferring dockerfile: 624B                                                                                                                                        0.0s
 => [product-composite internal] load .dockerignore                                                                                                                         0.0s
 => => transferring context: 2B                                                                                                                                             0.0s
 => [product-composite internal] load build definition from Dockerfile                                                                                                      0.0s
 => => transferring dockerfile: 624B                                                                                                                                        0.0s
 => [review internal] load metadata for docker.io/library/eclipse-temurin:24_36-jre-noble                                                                                   1.2s
 => [recommendation internal] load .dockerignore                                                                                                                            0.0s
 => => transferring context: 2B                                                                                                                                             0.0s
 => [recommendation internal] load build definition from Dockerfile                                                                                                         0.0s
 => => transferring dockerfile: 624B                                                                                                                                        0.0s
 => [product internal] load .dockerignore                                                                                                                                   0.0s
 => => transferring context: 2B                                                                                                                                             0.0s
 => [product internal] load build definition from Dockerfile                                                                                                                0.0s
 => => transferring dockerfile: 624B                                                                                                                                        0.0s
 => [review auth] library/eclipse-temurin:pull token for registry-1.docker.io                                                                                               0.0s
 => [product-composite stage-1 1/6] FROM docker.io/library/eclipse-temurin:24_36-jre-noble@sha256:95acbab1533dc788647084a581aba63299d175758a15011ceda57d1134b0ce7e          0.0s
 => [review internal] load build context                                                                                                                                    1.6s
 => => transferring context: 26.83MB                                                                                                                                        1.6s
 => [product-composite internal] load build context                                                                                                                         1.6s
 => => transferring context: 26.83MB                                                                                                                                        1.6s
 => [recommendation internal] load build context                                                                                                                            1.6s
 => => transferring context: 26.83MB                                                                                                                                        1.6s
 => [product internal] load build context                                                                                                                                   0.0s
 => => transferring context: 124B                                                                                                                                           0.0s
 => CACHED [product-composite stage-1 2/6] WORKDIR /application                                                                                                             0.0s
 => CACHED [recommendation builder 2/4] WORKDIR /extracted                                                                                                                  0.0s
 => CACHED [product builder 3/4] ADD ./build/libs/*.jar app.jar                                                                                                             0.0s
 => CACHED [product builder 4/4] RUN java -Djarmode=layertools -jar app.jar extract                                                                                         0.0s
 => CACHED [product stage-1 3/6] COPY --from=builder /extracted/dependencies/ ./                                                                                            0.0s
 => CACHED [product stage-1 4/6] COPY --from=builder /extracted/spring-boot-loader/ ./                                                                                      0.0s
 => CACHED [product stage-1 5/6] COPY --from=builder /extracted/snapshot-dependencies/ ./                                                                                   0.0s
 => CACHED [product stage-1 6/6] COPY --from=builder /extracted//application/ ./                                                                                            0.0s
 => [product] exporting to image                                                                                                                                            0.0s
 => => exporting layers                                                                                                                                                     0.0s
 => => writing image sha256:9341b5237f20d4558123ce6218f7705349d0cb8bd51cf917fa44f1cca69e33ba                                                                                0.0s
 => => naming to docker.io/library/chapter04-product                                                                                                                        0.0s
 => [product-composite builder 3/4] ADD ./build/libs/*.jar app.jar                                                                                                          0.4s
 => [recommendation builder 3/4] ADD ./build/libs/*.jar app.jar                                                                                                             0.3s
 => [review builder 3/4] ADD ./build/libs/*.jar app.jar                                                                                                                     0.3s
 => [review builder 4/4] RUN java -Djarmode=layertools -jar app.jar extract                                                                                                 2.2s
 => [product-composite builder 4/4] RUN java -Djarmode=layertools -jar app.jar extract                                                                                      2.2s
 => [recommendation builder 4/4] RUN java -Djarmode=layertools -jar app.jar extract                                                                                         2.2s
 => CACHED [recommendation stage-1 3/6] COPY --from=builder /extracted/dependencies/ ./                                                                                     0.0s
 => CACHED [recommendation stage-1 4/6] COPY --from=builder /extracted/spring-boot-loader/ ./                                                                               0.0s
 => CACHED [recommendation stage-1 5/6] COPY --from=builder /extracted/snapshot-dependencies/ ./                                                                            0.0s
 => [recommendation stage-1 6/6] COPY --from=builder /extracted//application/ ./                                                                                            0.0s
 => CACHED [review stage-1 3/6] COPY --from=builder /extracted/dependencies/ ./                                                                                             0.0s
 => CACHED [review stage-1 4/6] COPY --from=builder /extracted/spring-boot-loader/ ./                                                                                       0.0s
 => CACHED [review stage-1 5/6] COPY --from=builder /extracted/snapshot-dependencies/ ./                                                                                    0.0s
 => [review stage-1 6/6] COPY --from=builder /extracted//application/ ./                                                                                                    0.0s
 => [recommendation] exporting to image                                                                                                                                     0.0s
 => => exporting layers                                                                                                                                                     0.0s
 => => writing image sha256:43744c50aa9cb13ef9681b035d1d762872302a34d29ced1f3065a137f0581314                                                                                0.0s
 => => naming to docker.io/library/chapter04-recommendation                                                                                                                 0.0s
 => [review] exporting to image                                                                                                                                             0.1s
 => => exporting layers                                                                                                                                                     0.0s
 => => writing image sha256:fb2feb36151746d3a2ec54b4aaaa43f918d428d5c35184b0aac44811b058f3b4                                                                                0.0s
 => => naming to docker.io/library/chapter04-review                                                                                                                         0.0s
 => CACHED [product-composite stage-1 3/6] COPY --from=builder /extracted/dependencies/ ./                                                                                  0.0s
 => CACHED [product-composite stage-1 4/6] COPY --from=builder /extracted/spring-boot-loader/ ./                                                                            0.0s
 => CACHED [product-composite stage-1 5/6] COPY --from=builder /extracted/snapshot-dependencies/ ./                                                                         0.0s
 => [product-composite stage-1 6/6] COPY --from=builder /extracted//application/ ./                                                                                         0.0s
 => [product-composite] exporting to image                                                                                                                                  0.1s
 => => exporting layers                                                                                                                                                     0.0s
 => => writing image sha256:8c38cb0a98f69dacba3ea68ce135b3aeba69334e299c9f1b0ad571fac3b255ec                                                                                0.0s
 => => naming to docker.io/library/chapter04-product-composite    
 -------------
2. Luego, debemos verificar que podamos ver nuestras imágenes de Docker, de la siguiente manera:
 pachefer@Pro-de-Fernando Chapter04 %    docker images | grep chapter04
chapter04-recommendation      latest    43744c50aa9c   About a minute ago   341MB
chapter04-review              latest    fb2feb361517   About a minute ago   341MB
chapter04-product-composite   latest    8c38cb0a98f6   About a minute ago   341MB
chapter04-product             latest    9341b5237f20   50 minutes ago       341MB
---------
4. Inicie el entorno de microservicios con el siguiente comando:
   docker compose up -d
 pachefer@Pro-de-Fernando Chapter04 %    docker compose up -d
[+] Building 0.0s (0/0)                                                                                                                                     docker:desktop-linux
[+] Running 5/5
 ✔ Network chapter04_default                Created                                                                                                                         0.1s 
 ✔ Container chapter04-recommendation-1     Started                                                                                                                         0.1s 
 ✔ Container chapter04-product-1            Started                                                                                                                         0.1s 
 ✔ Container chapter04-review-1             Started                                                                                                                         0.1s 
 ✔ Container chapter04-product-composite-1  Started 
 ---------
 Podemos seguir el inicio monitoreando la salida que se escribe en el registro de cada contenedor. con el siguiente comando:
    docker compose logs -f
