import { describe, it, expect } from "@jest/globals";

// If you want to import, export these from inheritance-4.ts:
// export { Item, Bicycle, Scooter, ItemFactory };

describe("Bicycle", () => {
  it("should create a Bicycle with correct properties", () => {
    const bike = new Bicycle("b1", "Test Bike", 100, 2);
    expect(bike.id).toBe("b1");
    expect(bike.description).toBe("Test Bike");
    expect(bike.price).toBe(100);
    expect(bike.wheelCount).toBe(2);
    expect(bike.getInfo()).toContain("Bicycle");
    expect(bike.getInfo()).toContain("wheel count: 2");
  });
});

describe("Scooter", () => {
  it("should create a Scooter with correct properties", () => {
    const scooter = new Scooter("s1", "Test Scooter", 200, true);
    expect(scooter.id).toBe("s1");
    expect(scooter.description).toBe("Test Scooter");
    expect(scooter.price).toBe(200);
    expect(scooter.electric).toBe(true);
    expect(scooter.getInfo()).toContain("Scooter");
    expect(scooter.getInfo()).toContain("electric: true");
  });
});

describe("ItemFactory", () => {
  it("should create a Bicycle from data", () => {
    const data = { type: "bicycle", id: "b2", description: "Road", price: 150, wheelCount: 2 };
    const item = ItemFactory.createItem(data);
    expect(item).toBeInstanceOf(Bicycle);
    expect(item.getInfo()).toContain("Road");
  });

  it("should create a Scooter from data", () => {
    const data = { type: "scooter", id: "s2", description: "Electric", price: 300, electric: false };
    const item = ItemFactory.createItem(data);
    expect(item).toBeInstanceOf(Scooter);
    expect(item.getInfo()).toContain("electric: false");
  });

  it("should throw on unknown type", () => {
    const data = { type: "car", id: "c1", description: "Car", price: 1000 };
    expect(() => ItemFactory.createItem(data)).toThrow("Unknown item type");
  });
});

describe("Integration: itemData mapping", () => {
  it("should create all items and call getInfo", () => {
    const itemData = [
      { type: "bicycle", id: "1", description: "A", price: 1, wheelCount: 2 },
      { type: "scooter", id: "2", description: "B", price: 2, electric: false },
    ];
    const items = itemData.map(ItemFactory.createItem);
    expect(items[0]).toBeInstanceOf(Bicycle);
    expect(items[1]).toBeInstanceOf(Scooter);
    expect(typeof items[0].getInfo()).toBe("string");
    expect(typeof items[1].getInfo()).toBe("string");
  });
});