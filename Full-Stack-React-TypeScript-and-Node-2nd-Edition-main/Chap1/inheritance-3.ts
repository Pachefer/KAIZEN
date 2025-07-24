// This version uses the Factory pattern for extensibility and clean design. You can easily add more item types and creation logic.

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

// Factory pattern for item creation
class ItemFactory {
  static createBicycle(data: { id: string; description: string; price: number; wheelCount: number }): Bicycle {
    return new Bicycle(data.id, data.description, data.price, data.wheelCount);
  }
}

// Dynamic creation of multiple bicycles using the factory
const bicycleData = [
  { id: "123", description: "Mountain Bike", price: 299.99, wheelCount: 2 },
  { id: "124", description: "Road Bike", price: 399.99, wheelCount: 2 },
  { id: "125", description: "Tricycle", price: 199.99, wheelCount: 3 },
];

const bicycles: Bicycle[] = bicycleData.map(ItemFactory.createBicycle);

bicycles.forEach(bike => {
  console.log(bike.getInfo());
});