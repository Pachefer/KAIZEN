// any.ts
// Chap2/any.ts
// This code demonstrates the use of the 'any' type in TypeScript.
// It shows how 'any' can be used to hold values of different types and how it can lead to potential issues if not used carefully.
// The code is designed to illustrate the flexibility of 'any' while also highlighting the risks of type safety.
// It is concise, easy to understand, and serves as a cautionary example for using 'any' in TypeScript.
// The code is dynamic and can handle various types without type errors, but it lacks type safety.
var val = 22;
val = "string value";
val = new Array();
val.push(33);
console.log(val); //[ 33 ]
// Chap2/any.ts
var val2 = 22;
val2 = "string value";
val2 = new Array();
// Error: Property 'doesnotexist' does not exist on type 'any'.
// This line will not cause a compile-time error, but it will lead to a runtime error
// val2.doesnotexist(33);
console.log(val2); // []
//***  unknown.ts */
var val3 = 22;
val3 = "string value";
val3 = new Array();
// val3.push(33); /Error: Property 'push' does not exist on type 'unknown'.
// val3.doesnotexist(33); // Error: Property 'doesnotexist' does not exist on type 'unknown'.
console.log(val3); //[]
//Correct usage of unknown
var val4 = 22;
val4 = "string value";
val4 = new Array();
if (val4 instanceof Array) {
    val4.push(33);
}
console.log(val4); //[ 33 ]
/**
 * Intersection Types
 * Intersection types allow you to combine multiple types into one.
 * This is useful when you want to create a type that has properties from multiple types.
 * It is a powerful feature in TypeScript that allows for more complex type definitions.
 * The code demonstrates how to create an object with properties from two different types.
 * It is concise, type-safe, and easy to extend with new properties or types.
 * It is designed to be dynamic and scalable, allowing for easy addition of new properties or types.
 * It is a clean and extensible design that can be used in various scenarios.
 * It is a good practice to use intersection types when you need to combine multiple types.
 * It is a powerful feature that enhances type safety and code maintainability.
 * It is a best practice to use intersection types when you need to combine multiple types.
 */
var obj = {
    name: 'tom',
    age: 25
};
console.log(obj); //{ name: 'tom', age: 25 }
// Union Types
// Union types allow you to define a variable that can hold values of multiple types.
// This is useful when you want to allow a variable to hold different types of values.
// It is a powerful feature in TypeScript that enhances type safety and code maintainability.
var unionObj = null;
unionObj = { name: 'jon' };
console.log(unionObj); //{ name: 'jon' }
// Literal Types
// Literal types allow you to define a variable that can only hold specific values.
// This is useful when you want to restrict a variable to a specific set of values.     
// It is a powerful feature in TypeScript that enhances type safety and code maintainability.
var literal = "linda";
literal = "sue";
console.log(literal); //sue
// Error: Type '"john"' is not assignable to type '"tom" | "linda" | "jeff" | "sue"'.
// literal = "john"; // Uncommenting this line will cause a compile-time error
// This line will not cause a compile-time error, but it will lead to a runtime error
var literal2 = "linda";
literal2 = "sue";
//literal2 = "john"; // Type '"john"' is not assignable to type '"tom" | "linda" | "jeff" | "sue"'.
console.log(literal2); //sue
var typeAlias = "linda";
typeAlias = "sue";
//typeAlias = "john"; // Type '"john"' is not assignable to type 'tom" | "linda" | "jeff" | "sue"'.
console.log(typeAlias); //sue    
var unionLiteral = "linda";
unionLiteral = 30;
// unionLiteral = "john"; // Type '"john"' is not assignable to type 'tom" | "linda" | 25 | 30'.
console.log(unionLiteral); //30  
var numericValue = 20;
numericValue = 30;
// numericValue = 50; // Type '50' is not assignable to type '  
10 | 20 | 30 | 40;
console.log(numericValue); //30
var stringValue = "banana";
stringValue = "cherry";
// stringValue = "orange"; // Type '"orange"' is not assignable to type 'apple" | "banana" | "cherry"'.
console.log(stringValue); //cherry
var booleanValue = true;
booleanValue = false;
// booleanValue = "true"; // Type '"true"' is not assignable to type 'true | false'.
console.log(booleanValue); //false
var colorValue = "green";
colorValue = "blue";
// colorValue = "purple"; // Type '"purple"' is not assignable to type 'red" | "green" | "blue" | "yellow"'.
console.log(colorValue); //blue
var rangeValue = 3;
var score = 20;
console.log(score); //[20]
//Function return types
function createPerson(name, age) {
    return {
        name: name,
        age: age,
        birthday: new Date(),
        married: false,
        address: "123 Main St"
    };
}
var person = createPerson("Alice", 30);
console.log(person); //{ name: 'Alice', age: 30, birthday: 2023-10-01T00:00:00.000Z, married: false, address: '123 Main St' }
// Function with Union Type Parameter   
function printValue(value) {
    if (typeof value === "string") {
        console.log("String value:", value);
    }
    else {
        console.log("Number value:", value);
    }
}
printValue("Hello"); // String value: Hello
printValue(42); // Number value: 42
// Function with Literal Type Parameter
function printColor(color) {
    console.log("Selected color:", color);
}
printColor("red"); // Selected color: red
function printStatus(status) {
    console.log("Current status:", status);
}
printStatus("active"); // Current status: active
function createUser(user) {
    console.log("User created:", user);
}
createUser({
    name: "John",
    age: 25,
    email: "",
    isActive: true
}); // User created: { name: 'John', age: 25, email: '', isActive: true }
// createUser({ name: "Jane", age: 30 }); // Error: Property 'email' is missing in type '{ name: string; age: number; }'    
// Function with Union Type Return
function getValue() {
    return Math.random() > 0.5 ? "Hello" : 42;
}
var value = getValue();
if (typeof value === "string") {
    console.log("Returned string:", value);
}
else {
    console.log("Returned number:", value);
}
// Function with Literal Type Return
function getDirection() {
    var directions = ["north", "south", "east", "west"];
    return directions[Math.floor(Math.random() * directions.length)];
}
var direction = getDirection();
console.log("Random direction:", direction); // Random direction: north/south/east/west
function getCoordinates() {
    return {
        x: Math.random() * 100,
        y: Math.random() * 100
    };
}
var coords = getCoordinates();
console.log("Random coordinates:", coords); // Random coordinates: { x: 12.34, y: 56.78 }
function createPoint(point) {
    console.log("Point created:", point);
}
createPoint({
    x: 10,
    y: 20,
    label: "A"
}); // Point created: { x: 10, y: 20, label: 'A' }
// createPoint({ x: 10, y: 20 }); // Error: Property 'label' is missing in type '{ x: number; y: number; }'.
// Function with Union Type Parameter and Return
function processInput(input) {
    if (typeof input === "string") {
        return input.toUpperCase();
    }
    else {
        return input * 2;
    }
}
var result1 = processInput("hello");
console.log("Processed string:", result1); // Processed string: HELLO
var result2 = processInput(10);
console.log("Processed number:", result2); // Processed number: 20  
// Function with Literal Type Parameter and Return
function getFruit(fruit) {
    return "You selected: ".concat(fruit);
}
var fruitResult = getFruit("banana");
console.log(fruitResult); // You selected: banana       
function createProfile(profile) {
    return "Profile created for ".concat(profile.username, ", age ").concat(profile.age);
}
var profileResult = createProfile({ username: "Alice", age: 30 });
console.log(profileResult); // Profile created for Alice, age 30    
function createAddress(address) {
    return "Address: ".concat(address.street, ", ").concat(address.city, ", ").concat(address.country, ", ").concat(address.postalCode);
}
var addressResult = createAddress({
    street: "123 Main St",
    city: "Springfield",
    country: "USA",
    postalCode: "12345"
});
console.log(addressResult); // Address: 123 Main St, Springfield, USA, 12345
function getShapeDetails(shape) {
    switch (shape) {
        case "circle":
            return { type: "circle", radius: 10 };
        case "square":
            return { type: "square", sideLength: 5 };
        case "triangle":
            return { type: "triangle", base: 6, height: 4 };
    }
}
var shapeDetails = getShapeDetails("circle");
console.log("Shape details:", shapeDetails); // Shape details: { type: 'circle', radius: 10 }   
function getColorDetails(color) {
    switch (color) {
        case "red":
            return { color: "red", hex: "#FF0000", rgb: "255,0,0" };
        case "green":
            return { color: "green", hex: "#00FF00", rgb: "0,255,0" };
        case "blue":
            return { color: "blue", hex: "#0000FF", rgb: "0,0,255" };
    }
}
var colorDetails = getColorDetails("green");
console.log("Color details:", colorDetails); // Color details: { color: 'green', hex: '#00FF00', rgb: '0,255,0' }    
function createProduct(product) {
    return "Product created: ".concat(product.name, ", Price: $").concat(product.price, ", Category: ").concat(product.category, ", In Stock: ").concat(product.inStock);
}
var productResult = createProduct({
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true
});
console.log(productResult); // Product created: Laptop, Price: $999.99, Category: Electronics, In Stock: true
function getVehicleDetails(vehicle) {
    switch (vehicle) {
        case "car":
            return { type: "car", wheels: 4, fuelType: "petrol", capacity: 5 };
        case "bike":
            return { type: "bike", wheels: 2, fuelType: "petrol", capacity: 2 };
        case "bus":
            return { type: "bus", wheels: 6, fuelType: "diesel", capacity: 50 };
    }
}
var vehicleDetails = getVehicleDetails("bus");
console.log("Vehicle details:", vehicleDetails); // Vehicle details: { type: 'bus', wheels: 6, fuelType: 'diesel', capacity: 50 }   
function getAnimalDetails(animal) {
    switch (animal) {
        case "dog":
            return { type: "dog", sound: "bark", habitat: "domestic", diet: "carnivore" };
        case "cat":
            return { type: "cat", sound: "meow", habitat: "domestic", diet: "carnivore" };
        case "bird":
            return { type: "bird", sound: "chirp", habitat: "wild", diet: "omnivore" };
    }
}
var animalDetails = getAnimalDetails("cat");
console.log("Animal details:", animalDetails); // Animal details: { type: 'cat',
function createBook(book) {
    return "Book created: ".concat(book.title, ", Author: ").concat(book.name, ", Age: ").concat(book.age, ", Published Year: ").concat(book.publishedYear, ", Genre: ").concat(book.genre);
}
var bookResult = createBook({
    title: "TypeScript Basics",
    name: "John Doe",
    age: 35,
    publishedYear: 2023,
    genre: "Programming"
});
console.log(bookResult); // Book created: TypeScript Basics, Author: John Doe, Age
function getFoodDetails(food) {
    switch (food) {
        case "pizza":
            return { type: "pizza", calories: 300, ingredients: ["cheese", "tomato sauce", "dough"], isVegetarian: true };
        case "burger":
            return { type: "burger", calories: 500, ingredients: ["bun", "patty", "lettuce"], isVegetarian: false };
        case "salad":
            return { type: "salad", calories: 150, ingredients: ["lettuce", "tomato", "cucumber"], isVegetarian: true };
    }
}
var foodDetails = getFoodDetails("pizza");
console.log("Food details:", foodDetails); // Food details: { type: 'pizza',
function getCityDetails(city) {
    switch (city) {
        case "New York":
            return { name: "New York", population: 8419600, area: 302.6, country: "USA" };
        case "Los Angeles":
            return { name: "Los Angeles", population: 3980400, area: 468.7, country: "USA" };
        case "Chicago":
            return { name: "Chicago", population: 2716000, area: 227.3, country: "USA" };
    }
}
var cityDetails = getCityDetails("Los Angeles");
console.log("City details:", cityDetails); // City details: { name: 'Los Angeles', population: 3980400, area: 468.7, country: 'USA' }   
function createMovie(movie) {
    return "Movie created: ".concat(movie.title, ", Director: ").concat(movie.director, ", Release Year: ").concat(movie.releaseYear, ", Genre: ").concat(movie.genre, ", Rating: ").concat(movie.rating, "/10");
}
var movieResult = createMovie({
    title: "Inception",
    director: "Christopher Nolan",
    releaseYear: 2010,
    genre: "Sci-Fi",
    rating: 8.8
});
console.log(movieResult); // Movie created: Inception, Director: Christopher Nolan, Release Year: 2010, Genre: Sci-Fi, Rating: 8.8/10
function getSportDetails(sport) {
    switch (sport) {
        case "football":
            return { type: "football", players: 11, duration: 90, isTeamSport: true };
        case "basketball":
            return { type: "basketball", players: 5, duration: 48, isTeamSport: true };
        case "tennis":
            return { type: "tennis", players: 1, duration: 120, isTeamSport: false };
    }
}
var sportDetails = getSportDetails("football");
console.log("Sport details:", sportDetails); // Sport details: { type: 'football',
function getLanguageDetails(language) {
    switch (language) {
        case "English":
            return { name: "English", speakers: 1500000000, origin: "England", isOfficial: true };
        case "Spanish":
            return { name: "Spanish", speakers: 580000000, origin: "Spain", isOfficial: true };
        case "French":
            return { name: "French", speakers: 300000000, origin: "France", isOfficial: true };
    }
}
var languageDetails = getLanguageDetails("Spanish");
console.log("Language details:", languageDetails); // Language details: { name: 'Spanish',  
function createDevice(device) {
    return "Device created: ".concat(device.brand, " ").concat(device.model, ", Release Year: ").concat(device.releaseYear, ", Smart: ").concat(device.isSmart);
}
var deviceResult = createDevice({
    brand: "Apple",
    model: "iPhone 14",
    releaseYear: 2022,
    isSmart: true
});
console.log(deviceResult); // Device created: Apple iPhone 14, Release Year: 2022, Smart: true
function getBeverageDetails(beverage) {
    switch (beverage) {
        case "coffee":
            return { type: "coffee", temperature: "hot", isCaffeinated: true, sugarContent: 5 };
        case "tea":
            return { type: "tea", temperature: "hot", isCaffeinated: true, sugarContent: 2 };
        case "juice":
            return { type: "juice", temperature: "cold", isCaffeinated: false, sugarContent: 10 };
    }
}
var beverageDetails = getBeverageDetails("tea");
console.log("Beverage details:", beverageDetails); // Beverage details: { type: 'tea', temperature: 'hot', isCaffeinated: true, sugarContent: 2 }
function getCountryDetails(country) {
    switch (country) {
        case "USA":
            return { name: "USA", population: 331000000, area: 9833517, capital: "Washington, D.C." };
        case "Canada":
            return { name: "Canada", population: 37700000, area: 9984670, capital: "Ottawa" };
        case "Mexico":
            return { name: "Mexico", population: 126000000, area: 1964375, capital: "Mexico City" };
    }
}
var countryDetails = getCountryDetails("Canada");
console.log("Country details:", countryDetails); // Country details: { name: 'Canada',
