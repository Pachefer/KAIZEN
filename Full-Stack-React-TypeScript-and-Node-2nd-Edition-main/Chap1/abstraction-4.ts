// Best practice: Extensible Factory + Strategy patterns, clear types, and easy to add new strategies.

interface User {
  name: string;
  age: number;
  canDrive(): void;
}

interface DriveStrategy {
  canDrive(age: number): boolean;
  description: string;
}

class DefaultDriveStrategy implements DriveStrategy {
  description = "Standard (>=16)";
  canDrive(age: number): boolean {
    return age >= 16;
  }
}

class StrictDriveStrategy implements DriveStrategy {
  description = "Strict (>=18)";
  canDrive(age: number): boolean {
    return age >= 18;
  }
}

class Person implements User {
  constructor(
    public name: string,
    public age: number,
    private driveStrategy: DriveStrategy = new DefaultDriveStrategy()
  ) {}

  canDrive(): void {
    console.log(`user is ${this.name} [strategy: ${this.driveStrategy.description}]`);
    console.log(this.driveStrategy.canDrive(this.age) ? "allow to drive" : "do not allow to drive");
  }
}

// Factory for scalable Person creation with strategy injection
class PersonFactory {
  static create(
    { name, age }: { name: string; age: number },
    driveStrategy?: DriveStrategy
  ): User {
    return new Person(name, age, driveStrategy);
  }
}

const dynamicUserData = [
  { name: "John", age: 15 },
  { name: "Jane", age: 18 },
  { name: "Alex", age: 12 },
  { name: "Sam", age: 20 },
];

const strategies: DriveStrategy[] = [
  new DefaultDriveStrategy(),
  new StrictDriveStrategy(),
];

// Demonstrate dynamic, scalable, and pattern-based user creation
const dynamicUsers: User[] = [
  PersonFactory.create(dynamicUserData[0]), // John, default strategy
  PersonFactory.create(dynamicUserData[1], strategies[1]), // Jane, strict strategy
  PersonFactory.create(dynamicUserData[2]), // Alex, default strategy
  PersonFactory.create(dynamicUserData[3], strategies[1]), // Sam, strict strategy
];

dynamicUsers.forEach(user => user.canDrive());