import { describe, expect, test, vi } from "vitest";
import {
  CustomError,
  ErrorCodes,
} from "../../../src/domain/errors/custom-error";
import { Request } from "express";

describe("Custom Error class", () => {
  test("should have a static method for each of the http response codes", () => {
    expect(CustomError).toHaveProperty("badRequest");
    expect(CustomError).toHaveProperty("unauthorized");
    expect(CustomError).toHaveProperty("forbidden");
    expect(CustomError).toHaveProperty("notFound");
    expect(CustomError).toHaveProperty("handleError");
  });
  test("should have a static method to return an error of type bad request", () => {
    const customErrorInstace = CustomError.badRequest(
      "Invalid data",
      ErrorCodes.BAD_REQUEST,
    );
    expect(customErrorInstace.statusCode).toBe(400);
  });
  test("should have a static method to return an error of type unauthorized", () => {
    const customErrorInstace = CustomError.unauthorized(
      "Login failed",
      ErrorCodes.UNAUTHORIZED,
    );
    expect(customErrorInstace.statusCode).toBe(401);
  });
  test("should have a static method to return an error of type forbidden", () => {
    const customErrorInstace = CustomError.forbidden(
      "user doesn't have access to this resource",
      ErrorCodes.FORBIDDEN,
    );
    expect(customErrorInstace.statusCode).toBe(403);
  });

  test("should have a static method to return an error of type not-found", () => {
    const customErrorInstace = CustomError.notFound(
      "Product not found",
      ErrorCodes.NOT_FOUND,
    );
    expect(customErrorInstace.statusCode).toBe(404);
  });

  //   test("should have a static method to return an error of type internal server error", () => {
  //     const customErrorInstace = CustomError.internalServerr(
  //       "Internal server error",
  //       ErrorCodes.INTERNAL_ERROR,
  //     );
  //     expect(customErrorInstace.statusCode).toBe(500);
  //   });

  test("handleError should use CustomError Instace content", () => {
    const customErrorInstance = CustomError.badRequest(
      "Invalid data",
      ErrorCodes.BAD_REQUEST,
    );

    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({
      json: jsonMock,
    });
    const mockResponse = {
      status: statusMock,
    };
    CustomError.handleError(
      customErrorInstance,
      {} as Request,
      // @ts-expect-error
      mockResponse,
    );

    expect(statusMock).toHaveBeenCalledWith(customErrorInstance.statusCode);
    expect(jsonMock).toHaveBeenCalledWith({
      ok: false,
      error: expect.objectContaining({
        message: customErrorInstance.message,
        code: customErrorInstance.code,
      }),
    });
  });

  test("handleError should return an internal server error if an unrecognized error is recieved ", () => {
    const jsonMock = vi.fn();

    const statusMock = vi.fn().mockReturnValue({
      json: jsonMock,
    });
    const mockResponse = {
      status: statusMock,
    };
    try {
      throw "Some error internal error";
    } catch (error) {
      CustomError.handleError(
        error,
        {} as Request,
        // @ts-expect-error
        mockResponse,
      );
    }
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      ok: false,
      error: {
        message: "Internal server error",
        code: ErrorCodes.INTERNAL_ERROR,
      },
    });
  });
});
