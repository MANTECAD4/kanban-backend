import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  CategoryRepository,
} from "../../../domain/repositories";

interface ClassDependencies {
  categoryRepository: CategoryRepository;
  taskRepository: TaskRepository;
}

export class UpdateStatusColumnInTaskUseCase {
  private readonly categoryRepository: CategoryRepository;
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository, categoryRepository } =
      dependencies;
    this.taskRepository = kanbanTaskRepository;
    this.categoryRepository = categoryRepository;
  }

  public execute = async (taskId: number, categoryId: number) => {
    const nextCategory = await this.categoryRepository.getById(categoryId);

    if (!nextCategory)
      throw CustomError.notFound({
        title: "Not Found",
        message: "New referenced category not found",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });

    const currentCategoryId = (await this.taskRepository.getById(taskId))!
      .categoryId;
    const currentCategory =
      await this.categoryRepository.getById(currentCategoryId);
    // const

    const categoriesInBoard = (
      await this.categoryRepository.getAll(currentCategory!.boardId)
    ).map(({ id }) => id);

    if (!categoriesInBoard.includes(categoryId))
      throw CustomError.badRequest({
        title: "Task update failed",
        message: `New Status column doesn't belong to actual board`,
        code: ErrorCodes.BAD_REQUEST,
        details: null,
      });

    const updatedTask = await this.taskRepository.updateTaskCategory(
      taskId,
      categoryId,
    );
    return { task: updatedTask };
  };
}
