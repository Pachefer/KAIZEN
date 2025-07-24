var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    return Person;
}());
// Factory for scalable Person creation
var PersonFactory = /** @class */ (function () {
    function PersonFactory() {
    }
    PersonFactory.create = function (_a) {
        var name = _a.name;
        return new Person(name);
    };
    return PersonFactory;
}());
var peopleData = [
    { name: "Jill" },
    { name: "Jack" },
    { name: "Alex" },
];
var people = peopleData.map(PersonFactory.create);
people.forEach(function (person) { return console.log(person); });
