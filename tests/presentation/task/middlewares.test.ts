import { describe, expect, test, vi } from "vitest";
import { TaskMiddlewares } from "../../../src/presentation/task/middlewares";

import * as Factories from "../../../src/presentation/shared/factories/data-validation-middleware";
import * as ParamsSchemas from "../../../src/presentation/shared/schemas/int-id.schema";
import {
  CreateTaskSchema,
  UpdateColumnInTaskSchema,
  UpdateDataInTaskSchema,
} from "../../../src/application/dtos";
import { ZodObject } from "zod";

describe("Task Middlewares", () => {
  test(`should have 'taskIdParamValidation', 'createTaskDataValidation', 'updateTaskDataValidation' &'updateTaskColumnDataValidation' middlewares 
 `, () => {
    const dataValidationMiddlewareFactorySpy = vi.spyOn(
      Factories,
      "dataValidationMiddlewareFactory",
    );
    const paramsWithIdSchemaSpy = vi.spyOn(ParamsSchemas, "ParamsWithIdSchema");
    const taskMiddlewares = new TaskMiddlewares();

    expect(taskMiddlewares).toHaveProperty("taskIdParamValidation");
    expect(taskMiddlewares).toHaveProperty("createTaskDataValidation");
    expect(taskMiddlewares).toHaveProperty("updateTaskDataValidation");
    expect(taskMiddlewares).toHaveProperty("updateTaskColumnDataValidation");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      CreateTaskSchema,
      "Invalid data recieved. Task creation failed",
      Factories.RequestValidationTarget.BODY,
    );
    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      UpdateDataInTaskSchema,
      "Invalida data recieved. Task update failed",
      Factories.RequestValidationTarget.BODY,
    );
    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      UpdateColumnInTaskSchema,
      `Invalid data recieved. TaskUpdate failed`,
      Factories.RequestValidationTarget.BODY,
    );

    expect(paramsWithIdSchemaSpy).toHaveBeenCalledWith("taskId");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      expect.any(ZodObject),
      `Invalid task id provided`,
      Factories.RequestValidationTarget.PARAMS,
    );
  });
});
