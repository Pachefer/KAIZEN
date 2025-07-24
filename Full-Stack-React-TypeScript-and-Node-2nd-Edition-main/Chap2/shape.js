// Chap2/shape.ts
// This code defines a class hierarchy for geometric shapes, specifically circles and rectangles.
// It includes methods for calculating area and perimeter.
// The code is designed to be extensible, allowing for easy addition of new shape types and methods.
// It uses TypeScript's class system to ensure type safety and encapsulation.   
var Person = /** @class */ (function () {
    function Person() {
        this.name = "";
    }
    return Person;
}());
var jill = {
    name: "jill"
};
var person = jill;
console.log(person);
