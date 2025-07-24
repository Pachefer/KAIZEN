//The code now uses the Factory pattern for dynamic user creation and avoids redeclaration errors by renaming the array to users. This demonstrates a clean design pattern and keeps your code flexible and maintainable.
// Chap1/test-age%202.ts
// This code is a test for the abstraction of user age and driving permission
// It checks if a user can drive based on their age
// It uses a class to define the User structure and a method to check driving eligibility
var User = /** @class */ (function () {
    function User(name, age) {
        this.name = name;
        this.age = age;
    }
    User.prototype.canDrive = function () {
        console.log("user is", this.name);
        if (this.age >= 16) {
            console.log("allow to drive");
        }
        else {
            console.log("do not allow to drive");
        }
    };
    return User;
}());
// Factory pattern for dynamic User creation
var UserFactory = /** @class */ (function () {
    function UserFactory() {
    }
    UserFactory.create = function (name, age) {
        return new User(name, age);
    };
    return UserFactory;
}());
var userData = [
    { name: "Tom", age: 25 },
    { name: "Jerry", age: 15 },
    { name: "Anna", age: 18 },
    { name: "Bob", age: 14 },
];
var people = userData.map(function (u) { return UserFactory.create(u.name, u.age); });
people.forEach(function (user) { return user.canDrive(); });
