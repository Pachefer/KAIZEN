// The code is now dynamic and scalable: it uses standard getter/setter naming, supports multiple encapsulated instances, and demonstrates dynamic updates for each. This approach is clean, extensible, and ready for further enhancements. Let me know if you want to add more features or patterns!
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

// Dynamic and scalable: handle multiple encapsulators
const names = ["John", "Jane", "Alex"];
const encapsulators = names.map(name => new Encapsulator(name));

encapsulators.forEach((encapsulator, idx) => {
  console.log(`Original name [${idx}]:`, encapsulator.name);
  encapsulator.name = encapsulator.name.toUpperCase();
  console.log(`Updated name [${idx}]:`, encapsulator.name);
});