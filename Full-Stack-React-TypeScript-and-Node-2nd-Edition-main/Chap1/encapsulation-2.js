// The code is now dynamic and scalable: it uses standard getter/setter naming, supports multiple encapsulated instances, and demonstrates dynamic updates for each. This approach is clean, extensible, and ready for further enhancements. Let me know if you want to add more features or patterns!
var Encapsulator = /** @class */ (function () {
    function Encapsulator(name) {
        this._name = name;
    }
    Object.defineProperty(Encapsulator.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: false,
        configurable: true
    });
    return Encapsulator;
}());
// Dynamic and scalable: handle multiple encapsulators
var names = ["John", "Jane", "Alex"];
var encapsulators = names.map(function (name) { return new Encapsulator(name); });
encapsulators.forEach(function (encapsulator, idx) {
    console.log("Original name [".concat(idx, "]:"), encapsulator.name);
    encapsulator.name = encapsulator.name.toUpperCase();
    console.log("Updated name [".concat(idx, "]:"), encapsulator.name);
});
