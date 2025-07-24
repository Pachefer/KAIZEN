

import { User, UserFactory, IUser } from "./test-age-4";


import type {Config} from 'jest';

const config: Config = {
  verbose: true,
};

export default config;

describe("UserFactory", () => {
  it("creates a User with correct properties", () => {
    const user = UserFactory.create({ name: "Alice", age: 22 });
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe("Alice");
    expect(user.age).toBe(22);
  });
});

describe("User.canDrive", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("allows users aged 16 or older to drive", () => {
    const user = new User("Driver", 18);
    user.canDrive();
    expect(consoleSpy).toHaveBeenCalledWith("user is Driver");
    expect(consoleSpy).toHaveBeenCalledWith("allow to drive");
  });

  it("does not allow users younger than 16 to drive", () => {
    const user = new User("Youngster", 15);
    user.canDrive();
    expect(consoleSpy).toHaveBeenCalledWith("user is Youngster");
    expect(consoleSpy).toHaveBeenCalledWith("do not allow to drive");
  });

  it("allows users exactly 16 years old to drive", () => {
    const user = new User("Edge", 16);
    user.canDrive();
    expect(consoleSpy).toHaveBeenCalledWith("user is Edge");
    expect(consoleSpy).toHaveBeenCalledWith("allow to drive");
  });

  it("handles negative ages gracefully", () => {
    const user = new User("Negative", -5);
    user.canDrive();
    expect(consoleSpy).toHaveBeenCalledWith("user is Negative");
    expect(consoleSpy).toHaveBeenCalledWith("do not allow to drive");
  });

  it("handles age zero gracefully", () => {
    const user = new User("Baby", 0);
    user.canDrive();
    expect(consoleSpy).toHaveBeenCalledWith("user is Baby");
    expect(consoleSpy).toHaveBeenCalledWith("do not allow to drive");
  });

  it("handles large ages", () => {
    const user = new User("Oldie", 100);
    user.canDrive();
    expect(consoleSpy).toHaveBeenCalledWith("user is Oldie");
    expect(consoleSpy).toHaveBeenCalledWith("allow to drive");
  });
});