// Improved: Extensible Factory pattern, supports multiple item types, clean and scalable.

abstract class Item {
  constructor(
    public id: string,
    public description: string,
    public price: number
  ) {}

  abstract getInfo(): string;
}

class Bicycle extends Item {
  constructor(
    id: string,
    description: string,
    price: number,
    public wheelCount: number
  ) {
    super(id, description, price);
  }

  getInfo(): string {
    return `Bicycle [id: ${this.id}, description: ${this.description}, price: ${this.price}, wheel count: ${this.wheelCount}]`;
  }
}

class Scooter extends Item {
  constructor(
    id: string,
    description: string,
    price: number,
    public electric: boolean
  ) {
    super(id, description, price);
  }

  getInfo(): string {
    return `Scooter [id: ${this.id}, description: ${this.description}, price: ${this.price}, electric: ${this.electric}]`;
  }
}

// Generic Factory pattern for item creation
class ItemFactory {
  static createItem(data: any): Item {
    switch (data.type) {
      case "bicycle":
        return new Bicycle(data.id, data.description, data.price, data.wheelCount);
      case "scooter":
        return new Scooter(data.id, data.description, data.price, data.electric);
      default:
        throw new Error("Unknown item type");
    }
  }
}

// Dynamic creation of multiple items using the factory
const itemData = [
  { type: "bicycle", id: "123", description: "Mountain Bike", price: 299.99, wheelCount: 2 },
  { type: "bicycle", id: "124", description: "Road Bike", price: 399.99, wheelCount: 2 },
  { type: "bicycle", id: "125", description: "Tricycle", price: 199.99, wheelCount: 3 },
  { type: "scooter", id: "200", description: "Electric Scooter", price: 499.99, electric: true },
];

const items: Item[] = itemData.map(ItemFactory.createItem);

items.forEach(item => {
  console.log(item.getInfo());
});