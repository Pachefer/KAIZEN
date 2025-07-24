// Chap2/shape.ts
// Optimized: dynamic, scalable, and type-safe using interfaces and factory pattern
// This version uses an interface for shape, a factory for scalability, and supports dynamic creation of multiple people.
interface Named {
  name: string;
}

class Person implements Named {
  constructor(public name: string) {}
}

// Factory for scalable Person creation
class PersonFactory {
  static create({ name }: Named): Person {
    return new Person(name);
  }
}

const peopleData: Named[] = [
  { name: "Jill" },
  { name: "Jack" },
  { name: "Alex" },
];

const people: Person[] = peopleData.map(PersonFactory.create);

people.forEach(person => console.log(person));