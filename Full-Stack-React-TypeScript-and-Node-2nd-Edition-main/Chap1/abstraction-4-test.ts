import { describe, it, expect, jest } from "@jest/globals";

// If you want to import, export these from abstraction-4.ts:
// export { Person, PersonFactory, DefaultDriveStrategy, StrictDriveStrategy, DriveStrategy, User };

describe("DefaultDriveStrategy", () => {
  const strategy = new DefaultDriveStrategy();
  it("should allow driving at age 16 and above", () => {
    expect(strategy.canDrive(16)).toBe(true);
    expect(strategy.canDrive(18)).toBe(true);
    expect(strategy.canDrive(100)).toBe(true);
  });
  it("should not allow driving below age 16", () => {
    expect(strategy.canDrive(15)).toBe(false);
    expect(strategy.canDrive(0)).toBe(false);
  });
});

describe("StrictDriveStrategy", () => {
  const strategy = new StrictDriveStrategy();
  it("should allow driving at age 18 and above", () => {
    expect(strategy.canDrive(18)).toBe(true);
    expect(strategy.canDrive(21)).toBe(true);
  });
  it("should not allow driving below age 18", () => {
    expect(strategy.canDrive(17)).toBe(false);
    expect(strategy.canDrive(0)).toBe(false);
  });
});

describe("Person", () => {
  it("should use DefaultDriveStrategy by default", () => {
    const person = new Person("Alice", 17);
    expect(person["driveStrategy"]).toBeInstanceOf(DefaultDriveStrategy);
  });

  it("should use injected strategy", () => {
    const person = new Person("Bob", 17, new StrictDriveStrategy());
    expect(person["driveStrategy"]).toBeInstanceOf(StrictDriveStrategy);
  });

  it("canDrive() logs correct output for allowed and not allowed", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    const person = new Person("Alice", 17);
    person.canDrive();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("user is Alice"));
    expect(log).toHaveBeenCalledWith("do not allow to drive");

    const person2 = new Person("Bob", 18, new StrictDriveStrategy());
    person2.canDrive();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("user is Bob"));
    expect(log).toHaveBeenCalledWith("allow to drive");
    log.mockRestore();
  });
});

describe("PersonFactory", () => {
  it("should create Person with default strategy", () => {
    const user = PersonFactory.create({ name: "Jane", age: 18 });
    expect(user).toBeInstanceOf(Person);
    expect(user.name).toBe("Jane");
    expect(user.age).toBe(18);
  });

  it("should create Person with custom strategy", () => {
    const user = PersonFactory.create({ name: "Sam", age: 17 }, new StrictDriveStrategy());
    expect(user).toBeInstanceOf(Person);
    expect(user.name).toBe("Sam");
    expect(user.age).toBe(17);
  });
});

describe("Integration: dynamicUsers", () => {
  it("should create and check all users with correct strategies", () => {
    const data = [
      { name: "John", age: 15 },
      { name: "Jane", age: 18 },
      { name: "Alex", age: 12 },
      { name: "Sam", age: 20 },
    ];
    const strategies = [new DefaultDriveStrategy(), new StrictDriveStrategy()];
    const users: User[] = [
      PersonFactory.create(data[0]), // John, default
      PersonFactory.create(data[1], strategies[1]), // Jane, strict
      PersonFactory.create(data[2]), // Alex, default
      PersonFactory.create(data[3], strategies[1]), // Sam, strict
    ];
    expect(users[0].name).toBe("John");
    expect(users[1].name).toBe("Jane");
    expect(users[2].name).toBe("Alex");
    expect(users[3].name).toBe("Sam");
    expect(users[0].age).toBe(15);
    expect(users[1].age).toBe(18);
    expect(users[2].age).toBe(12);
    expect(users[3].age).toBe(20);
  });
});