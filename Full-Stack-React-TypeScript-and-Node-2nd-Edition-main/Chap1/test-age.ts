
// test-age.ts
// This file tests the abstraction of the User interface and the canDrive function.
// It checks if a user can drive based on their age.
// It uses an interface to define the User structure and a function to check driving eligibility.

interface User {
  name: string;
  age: number;
}

function canDrive(usr: User) {
  console.log("user is", usr.name);

  if (usr.age >= 16) {
    console.log("allow to drive");
  } else {
    console.log("do not allow to drive");
  }
}

const tom: User = {
  name: "tom",
  age: 25,
};

canDrive(tom);
