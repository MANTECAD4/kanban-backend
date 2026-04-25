import { Router } from "express";
import { StatusColumnsController } from "./controller";
import { StatusColumnsMiddlewares } from "./middlewares";
import { CreateStatusColumnUseCase } from "../../application/use-cases/status-column/create-column.use-case";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../domain/repositories";
import { GetStatusColumnsUseCase } from "../../application/use-cases/status-column/get-columns.use-case";
import { UpdateStatusColumnUseCase } from "../../application/use-cases/status-column/update-column.use-case";
import { DeleteStatusColumnUseCase } from "../../application/use-cases/status-column/delete-column.use-case";

export class StatusColumnsRoutes {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}
  public get routes() {
    const router = Router({ mergeParams: true });

    const createStatusColumnUseCase = new CreateStatusColumnUseCase(
      this.statusColumnRepository,
      this.boardRepository,
    );

    const getStatusColumnsUseCase = new GetStatusColumnsUseCase(
      this.statusColumnRepository,
      this.boardRepository,
    );

    const updateStatusColumnUsecase = new UpdateStatusColumnUseCase(
      this.statusColumnRepository,
    );
    const deleteStatusColumnUsecase = new DeleteStatusColumnUseCase(
      this.statusColumnRepository,
    );

    const controller = new StatusColumnsController(
      getStatusColumnsUseCase,
      createStatusColumnUseCase,
      updateStatusColumnUsecase,
      deleteStatusColumnUsecase,
    );
    router.get("/", controller.getAll);

    router.post(
      "/",
      [StatusColumnsMiddlewares.createStatusColumnDataValidation],
      controller.create,
    );

    router.put(
      "/:columnId",
      [
        StatusColumnsMiddlewares.columnIdParamValidation,
        StatusColumnsMiddlewares.updateStatusColumnDataValidation,
      ],
      controller.update,
    );

    router.delete(
      "/:columnId",
      [StatusColumnsMiddlewares.columnIdParamValidation],
      controller.delete,
    );
    return router;
  }
}
