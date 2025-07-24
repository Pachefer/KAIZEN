import { describe, it, expect } from "@jest/globals";

// Import your classes/types if you export them from string-vs-number-4.ts
// For this example, we'll redefine them here for clarity:

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

const addContext = new AddContext([
  new NumberAddStrategy(),
  new StringAddStrategy(),
]);

describe("AddContext", () => {
  it("adds two numbers", () => {
    expect(addContext.add(2, 3)).toBe(5);
    expect(addContext.add(-1, 1)).toBe(0);
    expect(addContext.add(0, 0)).toBe(0);
  });

  it("concatenates two strings", () => {
    expect(addContext.add("a", "b")).toBe("ab");
    expect(addContext.add("", "test")).toBe("test");
    expect(addContext.add("hello", "")).toBe("hello");
  });

  it("concatenates string and number", () => {
    expect(addContext.add("5", 6)).toBe("56");
    expect(addContext.add(5, "6")).toBe("56");
    expect(addContext.add("", 123)).toBe("123");
    expect(addContext.add(123, "")).toBe("123");
  });

  it("concatenates string with stringified number", () => {
    expect(addContext.add("number: ", 42)).toBe("number: 42");
    expect(addContext.add(42, " is the answer")).toBe("42 is the answer");
  });

  it("throws if no strategy matches (should never happen with current strategies)", () => {
    // This is just for completeness; with current strategies, all cases are covered.
    const customContext = new AddContext([]);
    expect(() => customContext.add(1, 2)).toThrow("No strategy found for these types");
  });
});