import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../../../src/presentation/shared/factories/data-validation-middleware";
import {
  testBodySchema,
  testParamsSchema,
  testQuerySchema,
} from "../../fixtures/schemas";
import { Request, Response } from "express";
import {
  CustomError,
  ErrorCodes,
} from "../../../src/domain/errors/custom-error";

describe("Data validation middleware factory", () => {
  const requestBody = { id: 1, name: "test name" };
  const requestQuery = { page: 10, sort: "price" };
  const requestParams = { userId: 777, slug: "test search slug" };
  const errorMsg = "test error message uwu";

  beforeEach(() => vi.restoreAllMocks());

  describe("Success cases", () => {
    test(`factory should return a function (a new middleware)`, () => {
      const createdMiddleware = dataValidationMiddlewareFactory(
        testBodySchema,
        errorMsg,
        RequestValidationTarget.BODY,
      );
      expectTypeOf(createdMiddleware).toBeFunction();
    });

    test("created middleware should validate 'body' with given schema and write validated data back into req object", () => {
      const mockRequest: Record<string, any> = {
        body: requestBody,
      };

      const createdMiddleware = dataValidationMiddlewareFactory(
        testBodySchema,
        errorMsg,
        RequestValidationTarget.BODY,
      );

      createdMiddleware(mockRequest as Request, {} as Response, vi.fn());
      expect(mockRequest).toHaveProperty("validatedBody");
      expect(Object.keys(mockRequest.validatedBody)).toStrictEqual(
        Object.keys(requestBody),
      );
    });

    test("created middleware should validate 'query' with given schema and write validated data back into req object", () => {
      const mockRequest: Record<string, any> = {
        query: requestQuery,
      };

      const createdMiddleware = dataValidationMiddlewareFactory(
        testQuerySchema,
        errorMsg,
        RequestValidationTarget.QUERY,
      );

      createdMiddleware(mockRequest as Request, {} as Response, vi.fn());
      expect(mockRequest).toHaveProperty("validatedQuery");
      expect(Object.keys(mockRequest.validatedQuery)).toStrictEqual(
        Object.keys(requestQuery),
      );
    });

    test("created middleware should validate 'params' with given schema and write validated data back into req object", () => {
      const mockRequest: Record<string, any> = {
        params: requestParams,
      };

      const createdMiddleware = dataValidationMiddlewareFactory(
        testParamsSchema,
        errorMsg,
        RequestValidationTarget.PARAMS,
      );

      createdMiddleware(mockRequest as Request, {} as Response, vi.fn());
      expect(mockRequest).toHaveProperty("validatedParams");
      expect(Object.keys(mockRequest.validatedParams)).toStrictEqual(
        Object.keys(requestParams),
      );
    });
  });

  describe("Failure cases", () => {
    test("should throw a custom error & call handle error from CustomError if data isn't accepted by given zod schema", async () => {
      const mockRequest: Record<string, any> = {
        query: {},
      };

      const spyBadRequest = vi.spyOn(CustomError, "badRequest");
      const spyHandleError = vi
        .spyOn(CustomError, "handleError")
        // @ts-expect-error
        .mockImplementation(() => {});

      const createdMiddleware = dataValidationMiddlewareFactory(
        testQuerySchema,
        errorMsg,
        RequestValidationTarget.QUERY,
      );

      createdMiddleware(mockRequest as Request, {} as Response, vi.fn());

      expect(spyBadRequest).toHaveBeenCalledWith(
        errorMsg,
        ErrorCodes.INVALID_DATA,
        expect.any(Object),
      );
      expect(spyHandleError).toHaveBeenCalledWith(
        expect.any(CustomError),
        expect.any(Object),
        expect.any(Object),
      );
    });
  });
});
