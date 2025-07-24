var Encapsulator3 = /** @class */ (function () {
    function Encapsulator3(name) {
        this.name = name; // use setter for validation
    }
    Object.defineProperty(Encapsulator3.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            if (!value || value.length < 2)
                throw new Error("Name must be at least 2 characters");
            this._name = value;
        },
        enumerable: false,
        configurable: true
    });
    return Encapsulator3;
}());
var Encapsulator3Factory = /** @class */ (function () {
    function Encapsulator3Factory() {
    }
    Encapsulator3Factory.create = function (_a) {
        var name = _a.name;
        return new Encapsulator3(name);
    };
    return Encapsulator3Factory;
}());
var encapsulator3Data = [
    { name: "John" },
    { name: "Jane" },
    { name: "Alex" },
];
var encapsulator3List = encapsulator3Data.map(function (data) { return Encapsulator3Factory.create(data); });
encapsulator3List.forEach(function (encapsulator, idx) {
    console.log("Original name [".concat(idx, "]:"), encapsulator.name);
    encapsulator.name = encapsulator.name.toUpperCase();
    console.log("Updated name [".concat(idx, "]:"), encapsulator.name);
});
