import { describe, expect, expectTypeOf, test } from "vitest";
import { CryptoHasher } from "../../../src/infraestructure/services/crypyo-hasher.service";

describe("Crypto hasher service - soft hasher", () => {
  const cryptoHasher = new CryptoHasher();
  const inputText = "some random text uwu";

  test(`'hash' returns a digested string`, async () => {
    const hashed = await cryptoHasher.hash(inputText);
    expectTypeOf(hashed).toBeString();
  });

  test(`'compare' returns true if given text equals hash payload`, async () => {
    const hashed = await cryptoHasher.hash(inputText);
    const isEqual = await cryptoHasher.compare(inputText, hashed);
    expect(isEqual).toBe(true);
  });

  test(`'compare' returns false if given text doesn't equal hash payload`, async () => {
    const hashed = await cryptoHasher.hash(inputText);
    const isEqual = await cryptoHasher.compare("not-the-original-text", hashed);
    expect(isEqual).toBe(false);
  });
});
