// This code demonstrates the Factory pattern for dynamic user creation and checks driving eligibility.

interface IUser {
  name: string;
  age: number;
  canDrive(): void;
}

class User implements IUser {
  constructor(public name: string, public age: number) {}

  canDrive(): void {
    console.log(`user is ${this.name}`);
    console.log(this.age >= 16 ? "allow to drive" : "do not allow to drive");
  }
}

class UserFactory {
  static create({ name, age }: { name: string; age: number }): IUser {
    return new User(name, age);
  }
}

const userData = [
  { name: "Tom", age: 25 },
  { name: "Jerry", age: 15 },
  { name: "Anna", age: 18 },
  { name: "Bob", age: 14 },
];

const users: IUser[] = userData.map(UserFactory.create);

users.forEach(user => user.canDrive());