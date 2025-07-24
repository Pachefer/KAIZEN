// The code now uses unique class and variable names, corrects the factory usage, and is fully dynamic, extensible, and type-safe. This approach avoids redeclaration errors and follows best practices for scalable encapsulation with validation.interface IEncapsulator3 {
interface IEncapsulator3 {
  name: string;
}

class Encapsulator3 implements IEncapsulator3 {
  private _name: string;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    if (!value || value.length < 2) throw new Error("Name must be at least 2 characters");
    this._name = value;
  }

  constructor(name: string) {
    this.name = name; // use setter for validation
  }
}

class Encapsulator3Factory {
  static create({ name }: { name: string }): Encapsulator3 {
    return new Encapsulator3(name);
  }
}

const encapsulator3Data = [
  { name: "John" },
  { name: "Jane" },
  { name: "Alex" },
];

const encapsulator3List: Encapsulator3[] = encapsulator3Data.map(data => Encapsulator3Factory.create(data));

encapsulator3List.forEach((encapsulator, idx) => {
  console.log(`Original name [${idx}]:`, encapsulator.name);
  encapsulator.name = encapsulator.name.toUpperCase();
  console.log(`Updated name [${idx}]:`, encapsulator.name);
});