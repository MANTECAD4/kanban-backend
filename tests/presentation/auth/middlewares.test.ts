import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { TokenProvider } from "../../../src/domain/services/token-generator.service";
import { AuthMiddlewares } from "../../../src/presentation/auth/middlewares";
import { Request, Response } from "express";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../../src/application/dtos";
import {
  CustomError,
  ErrorCodes,
} from "../../../src/domain/errors/custom-error";
import { JwtGenerator } from "../../../src/infraestructure/services/jwt-generator.service";

describe("Auth Middlewares", () => {
  const accessTokenDuration = 15;
  const tokenSecret = "im-a-token-secret";
  const refreshTokenDuration = 15;

  const mockAccessTokenPayload: AccessTokenPayload = {
    sub: { id: 10 },
    type: "access",
  };

  const mockNextFn = vi.fn();
  const mockResponse = {} as Response;

  const unauthorizedErrorSpy = vi.spyOn(CustomError, "unauthorized");
  const handleErrorSpy = vi
    .spyOn(CustomError, "handleError")
    //@ts-expect-error
    .mockImplementation(() => {});

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  describe("Positive cases", () => {
    test("should have login data validation, register data validation & validate access token middlewares", () => {
      const authMiddlewares = new AuthMiddlewares({} as TokenProvider);
      expect(authMiddlewares).toHaveProperty("loginDataValidation");
      expect(authMiddlewares).toHaveProperty("registerDataValidation");
      expect(authMiddlewares).toHaveProperty("validateAccessToken");

      expectTypeOf(authMiddlewares.loginDataValidation).toBeFunction();
      expectTypeOf(authMiddlewares.registerDataValidation).toBeFunction();
      expectTypeOf(authMiddlewares.validateAccessToken).toBeFunction();
    });

    test("'validateAccessToken' should extract authorization header and validate its content with given token provider & finally call next Fn", () => {
      const mockTokenGenerator: TokenProvider = {
        generate: vi.fn(),
        validate: vi.fn().mockReturnValue(mockAccessTokenPayload),
      };
      const mockToken = "this-should-be-a-token";

      const mockRequest = {
        header: vi.fn().mockReturnValue(`Bearer ${mockToken}`),
      } as unknown as Request;

      const authMiddlewares = new AuthMiddlewares(mockTokenGenerator);

      authMiddlewares.validateAccessToken(
        mockRequest,
        {} as Response,
        mockNextFn,
      );

      expect(mockTokenGenerator.validate).toHaveBeenCalledWith(mockToken);
      expect(mockNextFn).toHaveBeenCalled();
    });
  });
  describe("Negative cases", () => {
    test(`Validate Access token should respond with an error if 'authorization' header is not included`, () => {
      const authMiddlewares = new AuthMiddlewares({} as TokenProvider);

      const mockRequest = {
        header: vi.fn(),
      };

      authMiddlewares.validateAccessToken(
        //@ts-expect-error
        mockRequest,
        mockResponse,
        mockNextFn,
      );

      expect(unauthorizedErrorSpy).toHaveBeenCalledWith(
        "No token provided",
        ErrorCodes.UNAUTHORIZED,
      );

      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.any(CustomError),
        mockRequest,
        mockResponse,
      );

      expect(mockNextFn).not.toHaveBeenCalled();
    });

    test(`Validate access token should respond with an error if authorization header doens't start with 'Bearer ', like a Bearer token should do `, () => {
      const authMiddlewares = new AuthMiddlewares({} as TokenProvider);
      const mockRequest = {
        header: vi.fn().mockReturnValue("not-a-bearer-token"),
      } as unknown as Request;

      authMiddlewares.validateAccessToken(
        mockRequest,
        mockResponse as Response,
        mockNextFn,
      );

      expect(unauthorizedErrorSpy).toHaveBeenCalledWith(
        "Invalid token",
        ErrorCodes.INVALID_TOKEN,
      );

      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.any(CustomError),
        mockRequest,
        mockResponse,
      );

      expect(mockNextFn).not.toHaveBeenCalled();
    });

    test("Validate access should respond with an error if recieved token is invalid (corrupted, malformed)", () => {
      const jwtProvider = new JwtGenerator(tokenSecret);
      const authMiddlewares = new AuthMiddlewares(jwtProvider);

      const invalidToken = "this-is-an-invalid-token";
      const mockRequest = {
        header: vi.fn().mockReturnValue(`Bearer ${invalidToken}`),
      } as unknown as Request;
      const mockResponse = {} as Response;

      authMiddlewares.validateAccessToken(
        mockRequest,
        mockResponse,
        mockNextFn,
      );

      expect(unauthorizedErrorSpy).toHaveBeenCalledWith(
        expect.any(String),
        ErrorCodes.INVALID_TOKEN,
      );
      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.any(CustomError),
        mockRequest,
        mockResponse,
      );
      expect(mockNextFn).not.toHaveBeenCalled();
    });

    test("Valuidate access token should respond with an error if an expired token is recieved", () => {
      const jwtProvider = new JwtGenerator(tokenSecret);
      const authMiddlewares = new AuthMiddlewares(jwtProvider);

      const expiredAccessToken = jwtProvider.generate(
        mockAccessTokenPayload,
        accessTokenDuration,
      );

      const mockRequest = {
        header: vi.fn().mockReturnValue(`Bearer ${expiredAccessToken}`),
      } as unknown as Request;
      const mockResponse = {} as Response;
      vi.advanceTimersByTime(1000 * 60 * (accessTokenDuration + 1));

      authMiddlewares.validateAccessToken(
        mockRequest,
        mockResponse,
        mockNextFn,
      );

      expect(unauthorizedErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/expired/i),
        ErrorCodes.INVALID_TOKEN,
      );
      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.any(CustomError),
        mockRequest,
        mockResponse,
      );
      expect(mockNextFn).not.toHaveBeenCalled();
    });

    test("Validate access token should throw an error if a valid token with wrong type is recieved", () => {
      const jwtProvider = new JwtGenerator("im-a-token-secret");
      const authMiddlewares = new AuthMiddlewares(jwtProvider);
      const refreshTokenPayload: RefreshTokenPayload = {
        sub: { id: 1 },
        type: "refresh",
        jti: crypto.randomUUID(),
      };
      const refreshToken = jwtProvider.generate(
        refreshTokenPayload,
        refreshTokenDuration,
      );

      const mockRequest = {
        header: vi.fn().mockReturnValue(`Bearer ${refreshToken}`),
      } as unknown as Request;

      authMiddlewares.validateAccessToken(
        mockRequest,
        mockResponse,
        mockNextFn,
      );

      expect(unauthorizedErrorSpy).toHaveBeenCalledWith(
        "Invalid token payload",
        ErrorCodes.INVALID_TOKEN,
      );

      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.any(CustomError),
        mockRequest,
        mockResponse,
      );

      expect(mockNextFn).not.toHaveBeenCalled();
    });
  });
});
