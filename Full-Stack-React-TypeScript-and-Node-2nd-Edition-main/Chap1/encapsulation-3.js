// The code now uses the Factory pattern for encapsulator creation and avoids redeclaration errors by using unique variable names. It is dynamic, scalable, and demonstrates a clean design pattern.
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
// Factory pattern for encapsulator creation
var EncapsulatorFactory = /** @class */ (function () {
    function EncapsulatorFactory() {
    }
    EncapsulatorFactory.create = function (name) {
        return new Encapsulator(name);
    };
    return EncapsulatorFactory;
}());
var encapsulatorNames = ["John", "Jane", "Alex"];
var encapsulatorList = encapsulatorNames.map(EncapsulatorFactory.create);
encapsulatorList.forEach(function (encapsulator, idx) {
    console.log("Original name [".concat(idx, "]:"), encapsulator.name);
    encapsulator.name = encapsulator.name.split("").reverse().join(""); // Example dynamic update
    console.log("Updated name [".concat(idx, "]:"), encapsulator.name);
});
