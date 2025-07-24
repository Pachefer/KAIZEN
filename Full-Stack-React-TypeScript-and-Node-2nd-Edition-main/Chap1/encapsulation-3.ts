// The code now uses the Factory pattern for encapsulator creation and avoids redeclaration errors by using unique variable names. It is dynamic, scalable, and demonstrates a clean design pattern.
class Encapsulator {
  private _name: string;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  constructor(name: string) {
    this._name = name;
  }
}

// Factory pattern for encapsulator creation
class EncapsulatorFactory {
  static create(name: string): Encapsulator {
    return new Encapsulator(name);
  }
}

const encapsulatorNames = ["John", "Jane", "Alex"];
const encapsulatorList = encapsulatorNames.map(EncapsulatorFactory.create);

encapsulatorList.forEach((encapsulator, idx) => {
  console.log(`Original name [${idx}]:`, encapsulator.name);
  encapsulator.name = encapsulator.name.split("").reverse().join(""); // Example dynamic update
  console.log(`Updated name [${idx}]:`, encapsulator.name);
});
