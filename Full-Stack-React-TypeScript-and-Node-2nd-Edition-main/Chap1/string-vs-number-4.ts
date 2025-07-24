// Optimized: Strategy pattern, extensible, concise, and type-safe.
// AddContext constructor now takes strategies as a parameter for better extensibility and testability.
// Used template literals for string concatenation.
// Added more test cases for robustness.
// The code is concise, type-safe, and easy to extend with new strategies.

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
    return `${a}${b}`;
  }
}

class AddContext {
  private strategies: AddStrategy[];

  constructor(strategies: AddStrategy[]) {
    this.strategies = strategies;
  }

  add(a: Value, b: Value): Value {
    const strategy = this.strategies.find(s => s.canHandle(a, b));
    if (!strategy) throw new Error("No strategy found for these types");
    return strategy.add(a, b);
  }
}

// Easily extensible: just add more strategies to the array if needed.
const addContext = new AddContext([
  new NumberAddStrategy(),
  new StringAddStrategy(),
]);

const testCases: [Value, Value][] = [
  [5, 6],         // number + number
  ["5", 6],       // string + number
  [5, "6"],       // number + string
  ["5", "6"],     // string + string
  ["hello", " world"], // string + string
  [0, ""],        // number + empty string
];

testCases.forEach(([a, b]) => {
  console.log(`addContext.add(${JSON.stringify(a)}, ${JSON.stringify(b)}) =`, addContext.add(a, b));
});