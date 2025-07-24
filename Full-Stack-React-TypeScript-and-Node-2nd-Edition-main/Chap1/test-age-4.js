// This code demonstrates the Factory pattern for dynamic user creation and checks driving eligibility.
var User = /** @class */ (function () {
    function User(name, age) {
        this.name = name;
        this.age = age;
    }
    User.prototype.canDrive = function () {
        console.log("user is ".concat(this.name));
        console.log(this.age >= 16 ? "allow to drive" : "do not allow to drive");
    };
    return User;
}());
var UserFactory = /** @class */ (function () {
    function UserFactory() {
    }
    UserFactory.create = function (_a) {
        var name = _a.name, age = _a.age;
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
var users = userData.map(UserFactory.create);
users.forEach(function (user) { return user.canDrive(); });
