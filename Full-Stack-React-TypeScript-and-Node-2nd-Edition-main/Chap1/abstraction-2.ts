// This version uses a factory for scalability, concise ternary logic, and is easily extensible for more user types or logic.

interface User {
  name: string;
  age: number;
  canDrive(): void;
}

class Person implements User {
  constructor(public name: string, public age: number) {}

  canDrive(): void {
    console.log(`user is ${this.name}`);
    console.log(this.age >= 16 ? "allow to drive" : "do not allow to drive");
  }
}

// Factory for scalable Person creation
class PersonFactory {
  static create({ name, age }: { name: string; age: number }): User {
    return new Person(name, age);
  }
}

const dynamicUserData = [
  { name: "John", age: 15 },
  { name: "Jane", age: 18 },
  { name: "Alex", age: 12 },
  { name: "Sam", age: 20 },
];

const dynamicUsers: User[] = dynamicUserData.map(PersonFactory.create);

dynamicUsers.forEach(user => user.canDrive());