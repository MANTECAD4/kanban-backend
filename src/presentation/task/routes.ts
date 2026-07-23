import { Router } from "express";
import { TaskController } from "./controller";
import { TaskMiddlewares } from "./middlewares";
import { CategoryMiddlewares } from "../category/middlewares";

interface ClassDependencies {
  controller: TaskController;
  categoryMiddlewares: CategoryMiddlewares;
  taskMiddlewares: TaskMiddlewares;
}

export class TaskRoutes {
  private readonly controller: TaskController;
  private readonly categoryMiddlewares: CategoryMiddlewares;
  private readonly taskMiddlewares: TaskMiddlewares;
  constructor(dependencies: ClassDependencies) {
    const { controller, categoryMiddlewares, taskMiddlewares } = dependencies;
    this.controller = controller;
    this.categoryMiddlewares = categoryMiddlewares;
    this.taskMiddlewares = taskMiddlewares;
  }

  public get routes(): Router {
    const router = Router({ mergeParams: true });

    router.get(
      "/in-category/:categoryId",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.validateRelation,
      ],
      this.controller.getAllByCategory,
    );
    router.get(
      "/:taskSlug/in-category/:categoryId",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.validateRelation,
      ],
      this.controller.getBySlug,
    );

    router.post(
      "/in-category/:categoryId",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.validateRelation,
        this.taskMiddlewares.submitTaskDataValidation,
      ],
      this.controller.create,
    );

    router.put(
      "/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
        this.taskMiddlewares.submitTaskDataValidation,
      ],
      this.controller.updateData,
    );
    router.patch(
      "/:taskId/change-category",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
        this.taskMiddlewares.changeCategoryDataValidation,
      ],
      this.controller.updateCategory,
    );
    router.patch(
      "/:taskId/change-order",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
        this.taskMiddlewares.changeOrderValidation,
      ],
      this.controller.updateOrder,
    );

    router.delete(
      "/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
      ],
      this.controller.delete,
    );

    return router;
  }
}
