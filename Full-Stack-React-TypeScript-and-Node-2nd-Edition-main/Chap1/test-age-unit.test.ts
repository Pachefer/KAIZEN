import { describe, it, expect, vi } from "jest";

// Assuming User, IUser, and UserFactory are exported from test-age-4.ts
import { User, IUser, UserFactory } from "./test-age-4";

describe("UserFactory", () => {
  it("should create a User instance with correct properties", () => {
    const user = UserFactory.create({ name: "Alice", age: 20 });
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe("Alice");
    expect(user.age).toBe(20);
  });
});

describe("User.canDrive", () => {
  it("should allow users aged 16 or older to drive", () => {
    const user = new User("Driver", 18);
    const logSpy = vi.spyOn(console, "log");
    user.canDrive();
    expect(logSpy).toHaveBeenCalledWith("user is Driver");
    expect(logSpy).toHaveBeenCalledWith("allow to drive");
    logSpy.mockRestore();
  });

  it("should not allow users younger than 16 to drive", () => {
    const user = new User("Youngster", 15);
    const logSpy = vi.spyOn(console, "log");
    user.canDrive();
    expect(logSpy).toHaveBeenCalledWith("user is Youngster");
    expect(logSpy).toHaveBeenCalledWith("do not allow to drive");
    logSpy.mockRestore();
  });

  it("should handle edge case of age exactly 16", () => {
    const user = new User("Edge", 16);
    const logSpy = vi.spyOn(console, "log");
    user.canDrive();
    expect(logSpy).toHaveBeenCalledWith("user is Edge");
    expect(logSpy).toHaveBeenCalledWith("allow to drive");
    logSpy.mockRestore();
  });

  it("should handle negative ages gracefully", () => {
    const user = new User("Negative", -1);
    const logSpy = vi.spyOn(console, "log");
    user.canDrive();
    expect(logSpy).toHaveBeenCalledWith("user is Negative");
    expect(logSpy).toHaveBeenCalledWith("do not allow to drive");
    logSpy.mockRestore();
  });
});