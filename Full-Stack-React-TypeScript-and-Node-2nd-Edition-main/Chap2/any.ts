
// any.ts
// Chap2/any.ts
// This code demonstrates the use of the 'any' type in TypeScript.
// It shows how 'any' can be used to hold values of different types and how it can lead to potential issues if not used carefully.
// The code is designed to illustrate the flexibility of 'any' while also highlighting the risks of type safety.
// It is concise, easy to understand, and serves as a cautionary example for using 'any' in TypeScript.
// The code is dynamic and can handle various types without type errors, but it lacks type safety.

let val: any = 22;

val = "string value";

val = new Array();

val.push(33);

console.log(val);//[ 33 ]

// Chap2/any.ts

let val2: any = 22;

val2 = "string value";

val2 = new Array();

// Error: Property 'doesnotexist' does not exist on type 'any'.
// This line will not cause a compile-time error, but it will lead to a runtime error

// val2.doesnotexist(33);


console.log(val2);// []





//***  unknown.ts */

let val3: unknown = 22;
val3 = "string value";
val3 = new Array();
// val3.push(33); /Error: Property 'push' does not exist on type 'unknown'.
// val3.doesnotexist(33); // Error: Property 'doesnotexist' does not exist on type 'unknown'.
console.log(val3);//[]

//Correct usage of unknown

let val4: unknown = 22;
val4 = "string value";
val4 = new Array();
if (val4 instanceof Array) {
    val4.push(33);
}
console.log(val4);//[ 33 ]


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

let obj: { name: string } & { age: number } = {
    name: 'tom',
    age: 25
}
console.log(obj);//{ name: 'tom', age: 25 }



// Union Types
// Union types allow you to define a variable that can hold values of multiple types.
// This is useful when you want to allow a variable to hold different types of values.
// It is a powerful feature in TypeScript that enhances type safety and code maintainability.

let unionObj: null | { name: string } = null;
unionObj = { name: 'jon'};
console.log(unionObj);//{ name: 'jon' }


// Literal Types
// Literal types allow you to define a variable that can only hold specific values.
// This is useful when you want to restrict a variable to a specific set of values.     
// It is a powerful feature in TypeScript that enhances type safety and code maintainability.

let literal: "tom" | "linda" | "jeff" | "sue" = "linda";
literal = "sue";
console.log(literal);//sue


// Error: Type '"john"' is not assignable to type '"tom" | "linda" | "jeff" | "sue"'.
// literal = "john"; // Uncommenting this line will cause a compile-time error
// This line will not cause a compile-time error, but it will lead to a runtime error

let literal2: "tom" | "linda" | "jeff" | "sue" = "linda";
literal2 = "sue";
//literal2 = "john"; // Type '"john"' is not assignable to type '"tom" | "linda" | "jeff" | "sue"'.
console.log(literal2);//sue

//Type aliases
// Type aliases allow you to create a new name for a type.
// This is useful when you want to create a more descriptive name for a type.
// It is a powerful feature in TypeScript that enhances code readability and maintainability.
// It is a best practice to use type aliases when you want to create a more descriptive name for a type.
// It is a clean and extensible design that can be used in various scenarios.
// It is a good practice to use type aliases when you want to create a more descriptive name for a type.

type Name = "tom" | "linda" | "jeff" | "sue";
let typeAlias: Name = "linda";
typeAlias = "sue";
//typeAlias = "john"; // Type '"john"' is not assignable to type 'tom" | "linda" | "jeff" | "sue"'.
console.log(typeAlias);//sue    

// Literal Types with Union
// Literal types can also be used with union types to create more complex type definitions. 
// This is useful when you want to allow a variable to hold specific values from multiple types.
type NameOrNumber = "tom" | "linda" | 25 | 30;
let unionLiteral: NameOrNumber = "linda";
unionLiteral = 30;
// unionLiteral = "john"; // Type '"john"' is not assignable to type 'tom" | "linda" | 25 | 30'.
console.log(unionLiteral);//30  
// Literal Types with Numeric Values
// Literal types can also be used with numeric values to create more complex type definitions.
// This is useful when you want to allow a variable to hold specific numeric values.
type NumericLiteral = 10 | 20 | 30 | 40;
let numericValue: NumericLiteral = 20;
numericValue = 30;
// numericValue = 50; // Type '50' is not assignable to type '  
10 | 20 | 30 | 40;
console.log(numericValue);//30
// Literal Types with String Values
// Literal types can also be used with string values to create more complex type definitions.
type StringLiteral = "apple" | "banana" | "cherry";
let stringValue: StringLiteral = "banana";
stringValue = "cherry";
// stringValue = "orange"; // Type '"orange"' is not assignable to type 'apple" | "banana" | "cherry"'.
console.log(stringValue);//cherry
// Literal Types with Boolean Values
// Literal types can also be used with boolean values to create more complex type definitions.
type BooleanLiteral = true | false;
let booleanValue: BooleanLiteral = true;
booleanValue = false;
// booleanValue = "true"; // Type '"true"' is not assignable to type 'true | false'.
console.log(booleanValue);//false
// Literal Types with Multiple Values
// Literal types can also be used with multiple values to create more complex type definitions.
type MultipleValues = "red" | "green" | "blue" | "yellow";
let colorValue: MultipleValues = "green";
colorValue = "blue";
// colorValue = "purple"; // Type '"purple"' is not assignable to type 'red" | "green" | "blue" | "yellow"'.
console.log(colorValue);//blue
// Literal Types with Numeric Ranges
// Literal types can also be used with numeric ranges to create more complex type definitions.
type NumericRange = 1 | 2 | 3 | 4 | 5;
let rangeValue: NumericRange = 3;
type Points = 20 | 30 | 40 | 50;
let score: Points = 20;
console.log(score);//[20]


type ComplexPerson = {
    name: string,
    age: number,
    birthday: Date,
    married: boolean,
    address: string
}





/****************** */


function createPerson(name: string, age: number): ComplexPerson {
    return {
        name,
        age,
        birthday: new Date(),
        married: false,
        address: "123 Main St"
    };
}

let person: ComplexPerson = createPerson("Alice", 30);
console.log(person);//{ name: 'Alice', age: 30, birthday: 2023-10-01T00:00:00.000Z, married: false, address: '123 Main St' }
// Function with Union Type Parameter   
function printValue(value: string | number): void {
    if (typeof value === "string") {
        console.log("String value:", value);
    } else {
        console.log("Number value:", value);
    }
}
printValue("Hello"); // String value: Hello
printValue(42); // Number value: 42
// Function with Literal Type Parameter
function printColor(color: "red" | "green" | "blue"): void {
    console.log("Selected color:", color);
}
printColor("red"); // Selected color: red
// printColor("yellow"); // Error: Argument of type '"yellow"' is not assignable to parameter of type '"red" | "green" | "blue"'.
// Function with Type Alias
type Status = "active" | "inactive" | "pending";
function printStatus(status: Status): void {
    console.log("Current status:", status);
}
printStatus("active"); // Current status: active
// printStatus("completed"); // Error: Argument of type '"completed"' is not assignable to parameter of type 'Status'.
// Function with Intersection Type
type User = {
    name: string;
    age: number;
} & {
    email: string;
    isActive: boolean;
};  

function createUser(user: User): void {
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
function getValue(): string | number {
    return Math.random() > 0.5 ? "Hello" : 42;
}
let value = getValue();
if (typeof value === "string") {
    console.log("Returned string:", value);
}
else {
    console.log("Returned number:", value);
}       
// Function with Literal Type Return
function getDirection(): "north" | "south" | "east" | "west" {
    const directions = ["north", "south", "east", "west"];
    return directions[Math.floor(Math.random() * directions.length)] as "north" | "south" | "east" | "west";
}
let direction = getDirection();
console.log("Random direction:", direction); // Random direction: north/south/east/west
// Function with Type Alias Return
type Coordinates = {
    x: number;
    y: number;
};
function getCoordinates(): Coordinates {
    return {
        x: Math.random() * 100,
        y: Math.random() * 100
    };
}
let coords = getCoordinates();
console.log("Random coordinates:", coords); // Random coordinates: { x: 12.34, y: 56.78 }
// Function with Intersection Type Return
type Point = {
    x: number;
    y: number;
} & {   
    label: string;
};
function createPoint(point: Point): void {
    console.log("Point created:", point);
}
createPoint({
    x: 10,
    y: 20,
    label: "A"
}); // Point created: { x: 10, y: 20, label: 'A' }
// createPoint({ x: 10, y: 20 }); // Error: Property 'label' is missing in type '{ x: number; y: number; }'.
// Function with Union Type Parameter and Return
function processInput(input: string | number): string | number {
    if (typeof input === "string") {
        return input.toUpperCase();
    } else {
        return input * 2;
    }
}
let result1 = processInput("hello");
console.log("Processed string:", result1); // Processed string: HELLO
let result2 = processInput(10);
console.log("Processed number:", result2); // Processed number: 20  
// Function with Literal Type Parameter and Return
function getFruit(fruit: "apple" | "banana" | "cherry"): string {
    return `You selected: ${fruit}`;
}   
let fruitResult = getFruit("banana");
console.log(fruitResult); // You selected: banana       
// Function with Type Alias Parameter and Return
type UserProfile = {
    username: string;
    age: number;
};
function createProfile(profile: UserProfile): string {
    return `Profile created for ${profile.username}, age ${profile.age}`;
}
let profileResult = createProfile({ username: "Alice", age: 30 });    

console.log(profileResult); // Profile created for Alice, age 30    
// Function with Intersection Type Parameter and Return
type Address = {
    street: string;         
    city: string;
} & {
    country: string;
    postalCode: string;
};
function createAddress(address: Address): string {
    return `Address: ${address.street}, ${address.city}, ${address.country}, ${address.postalCode}`;
}
let addressResult = createAddress({
    street: "123 Main St",
    city: "Springfield",
    country: "USA",
    postalCode: "12345"
});
console.log(addressResult); // Address: 123 Main St, Springfield, USA, 12345
// Function with Union Type Parameter and Intersection Type Return
type Shape = "circle" | "square" | "triangle";
type Circle = {
    type: "circle";
    radius: number;
};
type Square = {
    type: "square";
    sideLength: number;
};
type Triangle = {
    type: "triangle";
    base: number;
    height: number;
};
type ShapeDetails = Circle | Square | Triangle; 
function getShapeDetails(shape: Shape): ShapeDetails {
    switch (shape) {
        case "circle":
            return { type: "circle", radius: 10 };
        case "square":
            return { type: "square", sideLength: 5 };
        case "triangle":
            return { type: "triangle", base: 6, height: 4 };
    }
}

let shapeDetails = getShapeDetails("circle");
console.log("Shape details:", shapeDetails); // Shape details: { type: 'circle', radius: 10 }   
// Function with Literal Type Parameter and Intersection Type Return
type Color = "red" | "green" | "blue";
type ColorDetails = {
    color: Color;
    hex: string;
} & {
    rgb: string;
};
function getColorDetails(color: Color): ColorDetails {  
    switch (color) {
        case "red":
            return { color: "red", hex: "#FF0000", rgb: "255,0,0" };
        case "green":
            return { color: "green", hex: "#00FF00", rgb: "0,255,0" };
        case "blue":
            return { color: "blue", hex: "#0000FF", rgb: "0,0,255" };
    }
}

let colorDetails = getColorDetails("green");
console.log("Color details:", colorDetails); // Color details: { color: 'green', hex: '#00FF00', rgb: '0,255,0' }    
// Function with Type Alias Parameter and Intersection Type Return
type Product = {            
    name: string;
    price: number;
} & {
    category: string;
    inStock: boolean;
};      
function createProduct(product: Product): string {
    return `Product created: ${product.name}, Price: $${product.price}, Category: ${product.category}, In Stock: ${product.inStock}`;
}
let productResult = createProduct({         
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true
});
console.log(productResult); // Product created: Laptop, Price: $999.99, Category: Electronics, In Stock: true
// Function with Union Type Parameter and Intersection Type Return
type Vehicle = "car" | "bike" | "bus";
type VehicleDetails = {             
    type: Vehicle;
    wheels: number;
} & {
    fuelType: string;
    capacity: number;
};
function getVehicleDetails(vehicle: Vehicle): VehicleDetails {              
    switch (vehicle) {
        case "car":
            return { type: "car", wheels: 4, fuelType: "petrol", capacity: 5 };
        case "bike":
            return { type: "bike", wheels: 2, fuelType: "petrol", capacity: 2 };
        case "bus":
            return { type: "bus", wheels: 6, fuelType: "diesel", capacity: 50 };
    }
}

let vehicleDetails = getVehicleDetails("bus");
console.log("Vehicle details:", vehicleDetails); // Vehicle details: { type: 'bus', wheels: 6, fuelType: 'diesel', capacity: 50 }   
// Function with Literal Type Parameter and Intersection Type Return
type Animal = "dog" | "cat" | "bird";
type AnimalDetails = {
    type: Animal;
    sound: string;
} & {
    habitat: string;
    diet: string;
};
function getAnimalDetails(animal: Animal): AnimalDetails {
    switch (animal) {
        case "dog":
            return { type: "dog", sound: "bark", habitat: "domestic", diet: "carnivore" };
        case "cat":
            return { type: "cat", sound: "meow", habitat: "domestic", diet: "carnivore" };
        case "bird":
            return { type: "bird", sound: "chirp", habitat: "wild", diet: "omnivore" };
    }
}
let animalDetails = getAnimalDetails("cat");
console.log("Animal details:", animalDetails); // Animal details: { type: 'cat',

// sound: {'meow', habitat: 'domestic', diet: 'carnivore' }
// Function with Type Alias Parameter and Intersection Type Return
type Book = {
    title: string;
}
type Author = {
    name: string;
    age: number;
};
type BookDetails = Book & Author & {
    publishedYear: number;
    genre: string;
};
function createBook(book: BookDetails): string {
    return `Book created: ${book.title}, Author: ${book.name}, Age: ${book.age}, Published Year: ${book.publishedYear}, Genre: ${book.genre}`;
}
let bookResult = createBook({
    
    title: "TypeScript Basics",
    name: "John Doe",
    age: 35,
    publishedYear: 2023,
    genre: "Programming"
});
console.log(bookResult); // Book created: TypeScript Basics, Author: John Doe, Age
//: 35, Published Year: 2023, Genre: Programming
// Function with Union Type Parameter and Intersection Type Return
type Food = "pizza" | "burger" | "salad";
type FoodDetails = {
    type: Food;
    calories: number;
} & {
    ingredients: string[];
    isVegetarian: boolean;
};
function getFoodDetails(food: Food): FoodDetails {  
    switch (food) {
        case "pizza":
            return { type: "pizza", calories: 300, ingredients: ["cheese", "tomato sauce", "dough"], isVegetarian: true };
        case "burger":
            return { type: "burger", calories: 500, ingredients: ["bun", "patty", "lettuce"], isVegetarian: false };
        case "salad":
            return { type: "salad", calories: 150, ingredients: ["lettuce", "tomato", "cucumber"], isVegetarian: true };
    }
}

let foodDetails = getFoodDetails("pizza");
console.log("Food details:", foodDetails); // Food details: { type: 'pizza',
// calories: 300, ingredients: [ 'cheese', 'tomato sauce', 'dough' ], isVegetarian: true }
// Function with Literal Type Parameter and Intersection Type Return
type City = "New York" | "Los Angeles" | "Chicago"; 
type CityDetails = {
    name: City;
    population: number;
} & {
    area: number; // in square miles
    country: string;
};

function getCityDetails(city: City): CityDetails {
    switch (city) {
        case "New York":
            return { name: "New York", population: 8419600, area: 302.6, country: "USA" };
        case "Los Angeles":
            return { name: "Los Angeles", population: 3980400, area: 468.7, country: "USA" };
        case "Chicago":
            return { name: "Chicago", population: 2716000, area: 227.3, country: "USA" };
    }
}


let cityDetails = getCityDetails("Los Angeles");
console.log("City details:", cityDetails); // City details: { name: 'Los Angeles', population: 3980400, area: 468.7, country: 'USA' }   
// Function with Type Alias Parameter and Intersection Type Return
type Movie = {
    title: string;
    director: string;   
    releaseYear: number;

};
type MovieDetails = Movie & {
    genre: string;  
    rating: number; // out of 10
};
function createMovie(movie: MovieDetails): string {
    return `Movie created: ${movie.title}, Director: ${movie.director}, Release Year: ${movie.releaseYear}, Genre: ${movie.genre}, Rating: ${movie.rating}/10`;
}
let movieResult = createMovie({
    title: "Inception",
    director: "Christopher Nolan",
    releaseYear: 2010,
    genre: "Sci-Fi",        
    rating: 8.8
});
console.log(movieResult); // Movie created: Inception, Director: Christopher Nolan, Release Year: 2010, Genre: Sci-Fi, Rating: 8.8/10
// Function with Union Type Parameter and Intersection Type Return
type Sport = "football" | "basketball" | "tennis";
type SportDetails = {
    type: Sport;
    players: number; // number of players per team      
} & {
    duration: number; // in minutes
    isTeamSport: boolean;
};
function getSportDetails(sport: Sport): SportDetails {  
    switch (sport) {
        case "football":
            return { type: "football", players: 11, duration: 90, isTeamSport: true };
        case "basketball":
            return { type: "basketball", players: 5, duration: 48, isTeamSport: true };
        case "tennis":
            return { type: "tennis", players: 1, duration: 120, isTeamSport: false };
    }
}
let sportDetails = getSportDetails("football");
console.log("Sport details:", sportDetails); // Sport details: { type: 'football',
// players: 11, duration: 90, isTeamSport: true }
// Function with Literal Type Parameter and Intersection Type Return
type Language = "English" | "Spanish" | "French";
type LanguageDetails = {
    name: Language;
    speakers: number; // number of speakers worldwide
} & {
    origin: string; // country of origin
    isOfficial: boolean; // whether it is an official language in any country
};
function getLanguageDetails(language: Language): LanguageDetails {
    switch (language) {
        case "English":
            return { name: "English", speakers: 1500000000, origin: "England", isOfficial: true };
        case "Spanish":
            return { name: "Spanish", speakers: 580000000, origin: "Spain", isOfficial: true };
        case "French":
            return { name: "French", speakers: 300000000, origin: "France", isOfficial: true };
    }
}
let languageDetails = getLanguageDetails("Spanish");
console.log("Language details:", languageDetails); // Language details: { name: 'Spanish',  
// speakers: 580000000, origin: 'Spain', isOfficial: true }
// Function with Type Alias Parameter and Intersection Type Return
type Device = {
    brand: string;
    model: string;
};
type DeviceDetails = Device & {
    releaseYear: number;
    isSmart: boolean; // whether the device is a smart device
};
function createDevice(device: DeviceDetails): string {
    return `Device created: ${device.brand} ${device.model}, Release Year: ${device.releaseYear}, Smart: ${device.isSmart}`;
}
let deviceResult = createDevice({   
    brand: "Apple",
    model: "iPhone 14",
    releaseYear: 2022,
    isSmart: true
});
console.log(deviceResult); // Device created: Apple iPhone 14, Release Year: 2022, Smart: true
// Function with Union Type Parameter and Intersection Type Return
type Beverage = "coffee" | "tea" | "juice";
type BeverageDetails = {
    type: Beverage;
    temperature: string; // hot or cold
} & {
    isCaffeinated: boolean; // whether the beverage contains caffeine
    sugarContent: number; // in grams   
};
function getBeverageDetails(beverage: Beverage): BeverageDetails {
    switch (beverage) {
        case "coffee":
            return { type: "coffee", temperature: "hot", isCaffeinated: true, sugarContent: 5 };
        case "tea":
            return { type: "tea", temperature: "hot", isCaffeinated: true, sugarContent: 2 };
        case "juice":
            return { type: "juice", temperature: "cold", isCaffeinated: false, sugarContent: 10 };
    }
}
let beverageDetails = getBeverageDetails("tea");
console.log("Beverage details:", beverageDetails); // Beverage details: { type: 'tea', temperature: 'hot', isCaffeinated: true, sugarContent: 2 }
// Function with Literal Type Parameter and Intersection Type Return
type Country = "USA" | "Canada" | "Mexico";
type CountryDetails = {
    name: Country;
    population: number; // number of inhabitants
} & {
    area: number; // in square kilometers
    capital: string; // capital city
};
function getCountryDetails(country: Country): CountryDetails {
    switch (country) {
        case "USA":
            return { name: "USA", population: 331000000, area: 9833517, capital: "Washington, D.C." };
        case "Canada":
            return { name: "Canada", population: 37700000, area: 9984670, capital: "Ottawa" };
        case "Mexico":
            return { name: "Mexico", population: 126000000, area: 1964375, capital: "Mexico City" };
    }
}
let countryDetails = getCountryDetails("Canada");
console.log("Country details:", countryDetails); // Country details: { name: 'Canada',
