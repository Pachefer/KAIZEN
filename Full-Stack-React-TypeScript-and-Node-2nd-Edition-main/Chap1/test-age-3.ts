//The code now uses the Factory pattern for dynamic user creation and avoids redeclaration errors by renaming the array to users. This demonstrates a clean design pattern and keeps your code flexible and maintainable.

// Chap1/test-age%202.ts

// This code is a test for the abstraction of user age and driving permission
// It checks if a user can drive based on their age
// It uses a class to define the User structure and a method to check driving eligibility




class User {
  constructor(public name: string, public age: number) {}
  canDrive() {
    console.log("user is", this.name);
    if (this.age >= 16) {
      console.log("allow to drive");
    } else {
      console.log("do not allow to drive");
    }
  }
}

// Factory pattern for dynamic User creation
class UserFactory {
  static create(name: string, age: number): User {
    return new User(name, age);
  }
}

const userData = [
  { name: "Tom", age: 25 },
  { name: "Jerry", age: 15 },
  { name: "Anna", age: 18 },
  { name: "Bob", age: 14 },
];

const people: User[] = userData.map(u => UserFactory.create(u.name, u.age));

people.forEach(user => user.canDrive());
