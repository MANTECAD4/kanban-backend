import { TaskRepository } from "../../../domain/repositories";
import { SubmitTaskDto } from "../../dtos";
import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";

interface ClassDependencies {
  taskRepository: TaskRepository;
  categoryRepository: CategoryRepository;
}

export class CreateTaskUseCase {
  private readonly taskRepository: TaskRepository;
  private readonly categoryRepository: CategoryRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository, categoryRepository } = dependencies;
    this.taskRepository = taskRepository;
    this.categoryRepository = categoryRepository;
  }

  public execute = async (categoryId: number, data: SubmitTaskDto) => {
    const category = await this.categoryRepository.getById(categoryId);

    const taskSlugsInBoard = (
      await this.taskRepository.getAllByBoard(category!.boardId)
    ).map((task) => task.slug);

    if (taskSlugsInBoard.includes(data.slug)) {
      throw CustomError.badRequest({
        title: "Invalid data",
        message: `Task with name ${data.title} already registered in this board`,
        code: ErrorCodes.BAD_REQUEST,
        details: null,
      });
    }

    const lastPosition = await this.taskRepository.getCount(categoryId);

    const createdTask = await this.taskRepository.create(categoryId, {
      ...data,
      order: lastPosition,
    });
    return { task: createdTask };
  };
}
