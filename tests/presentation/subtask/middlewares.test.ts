import { describe, expect, test, vi } from "vitest";
import { SubtaskMiddlewares } from "../../../src/presentation/subtask/middlewares";
import * as Factories from "../../../src/presentation/shared/factories/data-validation-middleware";
import * as ParamsSchemas from "../../../src/presentation/shared/schemas/int-id.schema";
import {
  CreateSubtaskSchema,
  UpdateSubtaskSchema,
} from "../../../src/application/dtos";
import { ZodObject } from "zod";

describe("Subtask Middlewares", () => {
  test(`should have 'subtaskIdParamValidation', 'createSubtaskDataValidation' & 'updateSubtaskDataValidation' middlewares`, () => {
    const dataValidationMiddlewareFactorySpy = vi.spyOn(
      Factories,
      "dataValidationMiddlewareFactory",
    );
    const paramsWithIdSchemaSpy = vi.spyOn(ParamsSchemas, "ParamsWithIdSchema");

    const subtaskMiddlewares = new SubtaskMiddlewares();

    expect(subtaskMiddlewares).toHaveProperty("subtaskIdParamValidation");
    expect(subtaskMiddlewares).toHaveProperty("createSubtaskDataValidation");
    expect(subtaskMiddlewares).toHaveProperty("updateSubtaskDataValidation");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      CreateSubtaskSchema,
      `Invalid data required to create a subtask`,
      Factories.RequestValidationTarget.BODY,
    );
    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      UpdateSubtaskSchema,
      `Invalid data required to update a subtask`,
      Factories.RequestValidationTarget.BODY,
    );

    expect(paramsWithIdSchemaSpy).toHaveBeenCalledWith("subtaskId");
    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      expect.any(ZodObject),
      `Invalid subtask id`,
      Factories.RequestValidationTarget.PARAMS,
    );
  });
});
