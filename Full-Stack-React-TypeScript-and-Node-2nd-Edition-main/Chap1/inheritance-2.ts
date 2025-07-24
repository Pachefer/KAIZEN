// Now the code is dynamic, supports multiple bicycles, and uses constructors for clarity and extensibility.
class Item {
  constructor(
    public id: string,
    public description: string,
    public price: number
  ) {}

  getId(): string {
    return this.id;
  }
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

  getWheelCount(): number {
    return this.wheelCount;
  }
}

// Dynamic creation of multiple bicycles
const bicycles: Bicycle[] = [
  new Bicycle("123", "Mountain Bike", 299.99, 2),
  new Bicycle("124", "Road Bike", 399.99, 2),
  new Bicycle("125", "Tricycle", 199.99, 3),
];

bicycles.forEach(bike => {
  console.log(`id: ${bike.getId()}, description: ${bike.description}, price: ${bike.price}, wheel count: ${bike.getWheelCount()}`);
});