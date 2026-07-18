import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { CategoryRepository } from "../../../domain/repositories";
import { SubmitCategoryDto } from "../../dtos/category.dto";

interface ClassDependencies {
  categoryRepository: CategoryRepository;
}

export class CreateCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor(dependencies: ClassDependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }

  public execute = async (boardId: number, data: SubmitCategoryDto) => {
    const existingColumnInBoard =
      await this.categoryRepository.getByBoardAndName(boardId, data.name);

    if (existingColumnInBoard)
      throw CustomError.badRequest({
        title: "Category creation failed",
        message:
          "Category name is already registered in this board's collection",
        code: ErrorCodes["ALREADY_REGISTERED"],
        details: null,
      });

    const numCategories = await this.categoryRepository.getCount(boardId);
    const lastPosition = numCategories <= 0 ? 0 : numCategories - 1;
    const createdColumn = await this.categoryRepository.create(boardId, {
      ...data,
      order: lastPosition,
    });

    return {
      category: createdColumn,
    };
  };
}
