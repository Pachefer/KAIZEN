//The code is now fully dynamic and error-free: it uses a class for users and iterates over a list of user objects to check driving eligibility. The redeclaration error is fixed by renaming the array to people

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

const people: User[] = [
  new User("Tom", 25),
  new User("Jerry", 15),
  new User("Anna", 18),
  new User("Bob", 14),
];

people.forEach(user => user.canDrive());
