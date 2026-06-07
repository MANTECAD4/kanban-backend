import { describe, expect, test, vi } from "vitest";
import { ZodObject } from "zod";
import { StatusColumnMiddlewares } from "../../../src/presentation/status-column/middlewares";
import * as Factories from "../../../src/presentation/shared/factories/data-validation-middleware";
import * as ParamsSchemas from "../../../src/presentation/shared/schemas/int-id.schema";
import {
  CreateStatusColumnSchema,
  UpdateStatusColumnSchema,
} from "../../../src/application/dtos";

describe("Status Column Middlewares", () => {
  test(`should have 'createStatusColumnDataValidation', 'updateStatusColumnDataValidation' & 'columnIdParamValidation' middlewares`, () => {
    const dataValidationMiddlewareFactorySpy = vi.spyOn(
      Factories,
      "dataValidationMiddlewareFactory",
    );
    const paramsWithIdSchemaSpy = vi.spyOn(ParamsSchemas, "ParamsWithIdSchema");

    const statusColumnMiddlewares = new StatusColumnMiddlewares();

    expect(statusColumnMiddlewares).toHaveProperty(
      "createStatusColumnDataValidation",
    );
    expect(statusColumnMiddlewares).toHaveProperty(
      "updateStatusColumnDataValidation",
    );
    expect(statusColumnMiddlewares).toHaveProperty("columnIdParamValidation");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      CreateStatusColumnSchema,
      "Invalid data for status column. Creation failed",
      Factories.RequestValidationTarget.BODY,
    );

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      UpdateStatusColumnSchema,
      "Invalid data for updating status column",
      Factories.RequestValidationTarget.BODY,
    );

    expect(paramsWithIdSchemaSpy).toHaveBeenCalledWith("columnId");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      expect.any(ZodObject),
      "Invalid status column id provided.",
      Factories.RequestValidationTarget.PARAMS,
    );
  });
});
