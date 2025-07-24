//This version uses the Strategy pattern for extensible and dynamic addition logic.
// Now the code dynamically tests all combinations of string and number addition/concatenation using the Strategy pattern.

// It checks if a user can drive based on their age.
// It uses a class to define the User structure and a method to check driving eligibility.


type Value = number | string;

interface AddStrategy {
  canHandle(a: Value, b: Value): boolean;
  add(a: Value, b: Value): Value;
}

class NumberAddStrategy implements AddStrategy {
  canHandle(a: Value, b: Value): boolean {
    return typeof a === "number" && typeof b === "number";
  }
  add(a: Value, b: Value): Value {
    return (a as number) + (b as number);
  }
}

class StringAddStrategy implements AddStrategy {
  canHandle(a: Value, b: Value): boolean {
    return typeof a === "string" || typeof b === "string";
  }
  add(a: Value, b: Value): Value {
    return String(a) + String(b);
  }
}

class AddContext {
  private strategies: AddStrategy[] = [];

  constructor() {
    this.strategies.push(new NumberAddStrategy(), new StringAddStrategy());
  }

  add(a: Value, b: Value): Value {
    const strategy = this.strategies.find(s => s.canHandle(a, b));
    if (!strategy) throw new Error("No strategy found for these types");
    return strategy.add(a, b);
  }
}

const addContext = new AddContext();

const testCases: [Value, Value][] = [
  [5, 6],         // number + number
  ["5", 6],       // string + number
  [5, "6"],       // number + string
  ["5", "6"],     // string + string
];

testCases.forEach(([a, b]) => {
  console.log(`addContext.add(${JSON.stringify(a)}, ${JSON.stringify(b)}) =`, addContext.add(a, b));
});