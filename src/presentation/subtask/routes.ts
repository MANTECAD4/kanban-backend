import { Router } from "express";
import { SubtaskController } from "./controller";
import { SubtaskMiddlewares } from "./middlewares";
import { TaskMiddlewares } from "../task/middlewares";
import { SubtaskRepository } from "../../domain/repositories/subtask.repository";
import { TaskRepository } from "../../domain/repositories";
import { GetSubtasksUseCase } from "../../application/use-cases/subtask/get-subtasks.use-case";
import { CreateSubtaskUseCase } from "../../application/use-cases/subtask/create-subtask.use-case";
import { UpdateSubtaskUseCase } from "../../application/use-cases/subtask/update-subtask.use-case";
import { DeleteSubtaskUseCase } from "../../application/use-cases/subtask/delete-subtask.use-case";

export class SubtaskRoutes {
  constructor(
    private readonly subtaskRepository: SubtaskRepository,
    private readonly taskRepository: TaskRepository,
  ) {}
  public get routes(): Router {
    const router = Router();

    const getSubtasksUsecase = new GetSubtasksUseCase(
      this.subtaskRepository,
      this.taskRepository,
    );
    const createSubtaskUsecase = new CreateSubtaskUseCase(
      this.subtaskRepository,
      this.taskRepository,
    );
    const updateSubtaskUsecase = new UpdateSubtaskUseCase(
      this.subtaskRepository,
    );
    const deleteSubtaskUsecase = new DeleteSubtaskUseCase(
      this.subtaskRepository,
    );

    const controller = new SubtaskController(
      getSubtasksUsecase,
      createSubtaskUsecase,
      updateSubtaskUsecase,
      deleteSubtaskUsecase,
    );

    router.get(
      "/in-task/:taskId",
      [TaskMiddlewares.taskIdParamValidation],
      controller.getAllByTask,
    );

    router.post(
      "/in-task/:taskId",
      [
        TaskMiddlewares.taskIdParamValidation,
        SubtaskMiddlewares.createSubtaskDataValidation,
      ],
      controller.create,
    );

    router.put(
      "/:subtaskId",
      [
        SubtaskMiddlewares.subtaskIdParamValidation,
        SubtaskMiddlewares.updateSubtaskDataValidation,
      ],
      controller.update,
    );

    router.delete(
      "/:subtaskId",
      [SubtaskMiddlewares.subtaskIdParamValidation],
      controller.delete,
    );

    return router;
  }
}
