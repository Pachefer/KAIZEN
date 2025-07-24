var Person = /** @class */ (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    Person.prototype.canDrive = function () {
        console.log("user is", this.name);
        if (this.age >= 16) {
            console.log("allow to drive");
        }
        else {
            console.log("do not allow to drive");
        }
    };
    return Person;
}());
// Factory function for dynamic Person creation
function createPerson(name, age) {
    return new Person(name, age);
}
var dynamicUserData = [
    { name: "John", age: 15 },
    { name: "Jane", age: 18 },
    { name: "Alex", age: 12 },
];
var dynamicUsers = dynamicUserData.map(function (u) { return createPerson(u.name, u.age); });
dynamicUsers.forEach(function (user) { return user.canDrive(); });
