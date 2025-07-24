// This version uses both the Factory and Strategy patterns for maximum flexibility and scalability.

interface User {
  name: string;
  age: number;
  canDrive(): void;
}

interface DriveStrategy {
  canDrive(age: number): boolean;
}

class DefaultDriveStrategy implements DriveStrategy {
  canDrive(age: number): boolean {
    return age >= 16;
  }
}

class Person implements User {
  private driveStrategy: DriveStrategy;

  constructor(
    public name: string,
    public age: number,
    driveStrategy: DriveStrategy = new DefaultDriveStrategy()
  ) {
    this.driveStrategy = driveStrategy;
  }

  canDrive(): void {
    console.log(`user is ${this.name}`);
    console.log(this.driveStrategy.canDrive(this.age) ? "allow to drive" : "do not allow to drive");
  }
}

// Factory for scalable Person creation with strategy injection
class PersonFactory {
  static create({ name, age }: { name: string; age: number }, driveStrategy?: DriveStrategy): User {
    return new Person(name, age, driveStrategy);
  }
}

const dynamicUserData = [
  { name: "John", age: 15 },
  { name: "Jane", age: 18 },
  { name: "Alex", age: 12 },
  { name: "Sam", age: 20 },
];

const dynamicUsers: User[] = dynamicUserData.map(data => PersonFactory.create(data));

dynamicUsers.forEach(user => user.canDrive());