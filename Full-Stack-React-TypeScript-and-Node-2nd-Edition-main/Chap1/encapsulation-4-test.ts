import { describe, it, expect } from "@jest/globals";

// If you want to import, export these from encapsulation-4.ts:
// export { Encapsulator3, Encapsulator3Factory, IEncapsulator3 };

describe("Encapsulator3", () => {
  it("should create an instance with a valid name", () => {
    const e = new Encapsulator3("Alice");
    expect(e.name).toBe("Alice");
  });

  it("should update the name using the setter", () => {
    const e = new Encapsulator3("Bob");
    e.name = "Charlie";
    expect(e.name).toBe("Charlie");
  });

  it("should throw if name is too short", () => {
    expect(() => new Encapsulator3("A")).toThrow("Name must be at least 2 characters");
    const e = new Encapsulator3("Valid");
    expect(() => { e.name = ""; }).toThrow("Name must be at least 2 characters");
  });
});

describe("Encapsulator3Factory", () => {
  it("should create Encapsulator3 from object", () => {
    const e = Encapsulator3Factory.create({ name: "Diana" });
    expect(e).toBeInstanceOf(Encapsulator3);
    expect(e.name).toBe("Diana");
  });
});

describe("Integration: encapsulator3List", () => {
  it("should create and update names for all encapsulators", () => {
    const data = [
      { name: "John" },
      { name: "Jane" },
      { name: "Alex" },
    ];
    const list = data.map(Encapsulator3Factory.create);
    expect(list.map(e => e.name)).toEqual(["John", "Jane", "Alex"]);
    list.forEach(e => {
      const upper = e.name.toUpperCase();
      e.name = upper;
      expect(e.name).toBe(upper);
    });
  });
});