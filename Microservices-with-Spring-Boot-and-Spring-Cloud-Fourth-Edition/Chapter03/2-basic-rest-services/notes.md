Podemos probar el servicio del producto por sí solo. Construir e iniciar el microservicio con el siguientes comandos:
--compilar
cd $BOOK_HOME/Chapter03/2-basic-rest-services
./gradlew build

--ejecutar
java -jar microservices/product-service/build/libs/*.jar &

Realice una llamada de prueba al servicio de atención al cliente:
   curl http://localhost:7002/product/123

9. Finalmente, detenga el servicio del producto:
kill $(jobs -p)

-----------------

Para las llamadas a getRecommendations() y getReviews(), se debe usar un método más avanzado, exchange() . Esto se debe a la asignación automática de una respuesta JSON a una clase de modelo que RestTemplate realiza. Los métodos getRecommendations() y getReviews() esperan una lista genérica en las respuestas, es decir, List<Recommendation>.
y List<Review>. Dado que los genéricos no almacenan ningún tipo de información en tiempo de ejecución, no podemos especificar que los métodos esperen una lista genérica en sus respuestas. En su lugar, podemos usar una clase auxiliar de Spring Framework, ParameterizedTypeReference, diseñada para resolver este problema al almacenar la información de tipo en tiempo de ejecución. Esto significa que RestTemplate puede determinar a qué clase asignar las respuestas JSON. Para utilizar esta clase auxiliar, debemos usar el método exchange(), más complejo , en lugar del método getForObject(), más sencillo, de RestTemplate.

-----------------

Para obtener la respuesta JSON impresa correctamente, puede utilizar la herramienta jq:
curl http://localhost:7001/producto­compuesto/1 ­s | jq .

-----------------

# Verificar que se devuelva un error 404 (No encontrado) para un productId inexistente (13) curl http://localhost:7001/producto­compuesto/13 ­i
# Verificar que no se devuelvan recomendaciones para el productId 113 curl http://localhost:7001/producto­compuesto/113 ­s | jq .
# Verificar que no se devuelvan reseñas para el productId 213 curl http://localhost:7001/producto­compuesto/213 ­s | jq .
# Verifique que se devuelva un error 422 (Entidad no procesable) para un productId que esté fuera del rango (­1)
curl http://localhost:7001/producto­compuesto/­1 ­i
# Verifique que se devuelva un error 400 (Solicitud incorrecta) para un productId que no sea un número, es decir, un formato no válido
curl http://localhost:7001/producto­compuesto/invalidProductId ­i

-----------------

El script de prueba, test­em­all.bash, implementa las pruebas manuales descritas en la sección "Probar las API manualmente" y se encuentra en la carpeta principal $BOOK_HOME/Chapter03/2­basic­rest­services 


        brew install jq
