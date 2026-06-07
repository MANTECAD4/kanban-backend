import { beforeEach, describe, expect, test, vi } from "vitest";
import { BoardMiddlewares } from "../../../src/presentation/board/middlewares";
import * as factories from "../../../src/presentation/shared/factories/data-validation-middleware";

import {
  CreateBoardSchema,
  UpdateBoardSchema,
} from "../../../src/application/dtos";

import { ZodObject } from "zod";
import * as ParamsSchemas from "../../../src/presentation/shared/schemas/int-id.schema";

describe("Board middlewares", () => {
  const dataValidationMiddlewareFactorySpy = vi.spyOn(
    factories,
    "dataValidationMiddlewareFactory",
  );

  const paramsWithIdSchemaFactorySpy = vi.spyOn(
    ParamsSchemas,
    "ParamsWithIdSchema",
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test(`should have 'create board', 'update board '& 'board id param' validation middlewares`, () => {
    const boardMiddlewares = new BoardMiddlewares();

    expect(boardMiddlewares).toHaveProperty("createBoardDataValidation");
    expect(boardMiddlewares).toHaveProperty("updateBoardDataValidation");
    expect(boardMiddlewares).toHaveProperty("boardIdParamValidation");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      CreateBoardSchema,
      "Invalid data recieved. Board creation failed.",
      factories.RequestValidationTarget.BODY,
    );

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      UpdateBoardSchema,
      "Invalid data recieved. Board update failed.",
      factories.RequestValidationTarget.BODY,
    );

    expect(paramsWithIdSchemaFactorySpy).toHaveBeenCalledWith("boardId");

    expect(dataValidationMiddlewareFactorySpy).toHaveBeenCalledWith(
      expect.any(ZodObject),
      "Invalid board id provided.",
      factories.RequestValidationTarget.PARAMS,
    );
  });
});
