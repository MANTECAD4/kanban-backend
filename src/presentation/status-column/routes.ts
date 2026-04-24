import { Router } from "express";
import { StatusColumnsController } from "./controller";
import { StatusColumnsMiddlewares } from "./middlewares";
import { CreateStatusColumnUseCase } from "../../application/use-cases/status-column/create-column.use-case";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../domain/repositories";
import { GetStatusColumnsUseCase } from "../../application/use-cases/status-column/get-columns.use-case";

export class StatusColumnsRoutes {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}
  public get routes() {
    const router = Router({ mergeParams: true });

    const creatStatusColumnUseCase = new CreateStatusColumnUseCase(
      this.statusColumnRepository,
      this.boardRepository,
    );

    const getStatusColumnsUseCase = new GetStatusColumnsUseCase(
      this.statusColumnRepository,
      this.boardRepository,
    );

    const controller = new StatusColumnsController(
      creatStatusColumnUseCase,
      getStatusColumnsUseCase,
    );
    router.get("/", [], controller.findAll);

    router.post(
      "/",
      [StatusColumnsMiddlewares.createStatusColumnDataValidation],
      controller.create,
    );
    return router;
  }
}
