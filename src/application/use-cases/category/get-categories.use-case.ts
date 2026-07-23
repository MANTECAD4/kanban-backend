import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { CategoryRepository } from "../../../domain/repositories";

interface ClassDependencies {
  categoryRepository: CategoryRepository;
}

export class GetCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor(dependencies: ClassDependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }
  public execute = async (boardId: number) => {
    const categories = await this.categoryRepository.getAll(boardId);
    if (categories.length === 0) {
      throw CustomError.notFound({
        title: "Not found",
        message: "No categories found for this board",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }
    return {
      categories: categories,

      meta: { total: categories.length },
    };
  };
}
