import { describe, expect, expectTypeOf, test } from "vitest";
import { BycryptHasher } from "../../../src/infraestructure/services/bycrypt.service";

describe("Bycrypt hasher service - strong hasher", () => {
  const bycryptHasher = new BycryptHasher();
  const inputText = "some random text uwu";

  test(`'hash' returns a digested string`, async () => {
    const hashed = await bycryptHasher.hash(inputText);
    expectTypeOf(hashed).toBeString();
  });

  test(`'compare' returns true if given text equals hash payload`, async () => {
    const hashed = await bycryptHasher.hash(inputText);
    const isEqual = await bycryptHasher.compare(inputText, hashed);
    expect(isEqual).toBe(true);
  });

  test(`'compare' returns false if given text doesn't equal hash payload`, async () => {
    const hashed = await bycryptHasher.hash(inputText);
    const isEqual = await bycryptHasher.compare(
      "not-the-original-text",
      hashed,
    );
    expect(isEqual).toBe(false);
  });
});
