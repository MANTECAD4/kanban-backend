import { describe, expect, test } from "vitest";
import { getDefinedFields } from "../../../src/domain/services/get-defined-fields.service";
describe("Get defined fields application service", () => {
  test("should return an object ignoring undefined properties", () => {
    const testObject = {
      id: 10,
      name: "new name",
      description: undefined,
      revokedAt: undefined,
    };

    const definedFields = getDefinedFields(testObject);

    expect(definedFields).toStrictEqual({ id: 10, name: "new name" });
    expect(Object.keys(definedFields)).toHaveLength(2);
  });

  test("should respect falsy property values (except undefined)", () => {
    const testObject = {
      id: 10,
      name: "new name",
      imageUrl: null,
      money: 0,
      isEmailValidated: false,
      description: undefined,
    };

    const definedFileds = getDefinedFields(testObject);

    expect(definedFileds).toStrictEqual({
      id: 10,
      name: "new name",
      imageUrl: null,
      money: 0,
      isEmailValidated: false,
    });
  });

  test(`should throw an error if recieved object is empty`, () => {
    expect(() => getDefinedFields({})).toThrow();
  });

  test(`should throw an error if recieved object has only undefined fields`, () => {
    expect(() =>
      getDefinedFields({ name: undefined, id: undefined }),
    ).toThrow();
  });
});
