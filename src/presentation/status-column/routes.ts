import { Router } from "express";
import { StatusColumnsController } from "./controller";
import { StatusColumnsMiddlewares } from "./middlewares";
import { CreateStatusColumnUseCase } from "../../application/use-cases/status-column/create-column.use-case";
import { StatusColumnRepository } from "../../domain/repositories";

export class StatusColumnsRoutes {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}
  public get routes() {
    const router = Router({ mergeParams: true });

    const creatStatusColumnUseCase = new CreateStatusColumnUseCase(
      this.statusColumnRepository,
    );

    const controller = new StatusColumnsController(creatStatusColumnUseCase);
    router.get("/", [], controller.findAll);

    router.post(
      "/",
      [StatusColumnsMiddlewares.createStatusColumnDataValidation],
      controller.create,
    );
    return router;
  }
}
