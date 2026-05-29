import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  test,
  vi,
} from "vitest";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { JwtGenerator } from "../../../src/infraestructure/services/jwt-generator.service";
import { TokenPayload } from "../../../src/application/dtos";
import z from "zod";
import { CustomError } from "../../../src/domain/errors/custom-error";

describe("Jwt Generator service", () => {
  const secret = "some-secret-uwu";
  const duration = 15;
  const payloadAccessToken: TokenPayload = { sub: { id: 777 }, type: "access" };
  const payloadRefreshToken: TokenPayload = {
    sub: { id: 777 },
    type: "refresh",
    jti: crypto.randomUUID(),
  };
  const jwtGenerator = new JwtGenerator(secret);

  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Success cases", () => {
    test(`'generate' calls jwt.sign with sent payload and secret`, () => {
      const jwtSpy = vi.spyOn(jwt, "sign");
      const token = jwtGenerator.generate(payloadAccessToken, duration);

      expect(jwtSpy).toHaveBeenCalledWith(
        payloadAccessToken,
        secret,
        expect.objectContaining({ expiresIn: 60 * duration }),
      );

      expectTypeOf(token).toBeString();
    });

    test(`'validate' returns token payload`, () => {
      const jwtSpy = vi.spyOn(jwt, "verify");
      const token = jwtGenerator.generate(payloadAccessToken, duration);

      const tokenPayload = jwtGenerator.validate(token);

      expect(jwtSpy).toHaveBeenCalledWith(token, secret);
      expect(tokenPayload).toEqual(expect.objectContaining(payloadAccessToken));
    });
  });

  describe("Failure cases", () => {
    test(`'validate' throws an error if token has already expired`, () => {
      const token = jwtGenerator.generate(payloadAccessToken, duration);
      vi.advanceTimersByTime(1000 * 60 * (duration + 1));

      expect(() => jwtGenerator.validate(token)).toThrow(/expired/i);
    });
    test(`'validate' throws an error if token is corrupted`, () => {
      const token = jwtGenerator.generate(payloadAccessToken, duration);
      const corrupted = token.substring(0, 8) + "ñ" + token.substring(8 + 1);

      expect(() => jwtGenerator.validate(corrupted)).toThrow(/invalid/i);
    });
    test(`'validate' throws an error if token is malformed`, () => {
      expect(() => jwtGenerator.validate("not-a-jwt")).toThrow(/malformed/i);
    });
  });
});
